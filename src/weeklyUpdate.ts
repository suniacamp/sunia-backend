// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

// Provides an update to Slack of registrants from the last week
// Doesn't check dates, but assigns boolean value instead, so if there's
// a bug it may be run later and not miss any students

function weeklyUpdate() {
  Logger.log("Attempting to give weekly update...");
  let misc: string = "";

  let masterRegString = PropertiesService.getScriptProperties().getProperty(
    "masterRegSource"
  );

  const masterRegSource = SpreadsheetApp.openById(masterRegString);

  const mrOverview = masterRegSource.getSheetByName("OVERVIEW"); // mr is short for masterReg
  const mrInput = masterRegSource.getSheetByName("INPUT");
  const mrRegs = masterRegSource.getSheetByName("REGS");
  const lastReg = mrInput.getLastRow();

  let lastWU: number;
  try {
    lastWU = getLastInUpdate(mrRegs, lastReg);
  } catch (error) {
    Logger.log(error + "\nexiting function as a result");
    return;
  }

  let list: string;
  try {
    list = generateList(mrInput, lastWU, lastReg);
  } catch (error) {
    Logger.log(error + "\nexiting function as a result");
    return;
  }

  let stats: string;
  try {
    stats = generateGeneralStats(mrOverview);
  } catch (error) {
    Logger.log(error + "\nexiting function as a result");
  }

  const slackMessage: string = generateSlackMessage(stats, list);
  try {
    sendWeeklyUpdate(slackMessage);
  } catch (error) {
    Logger.log(error, "exiting function as a result");
  }

  Logger.log("Weekly update done!", misc);
}

// Finds the column entitled "WEEKLY UPDATE", loops through it and returns the earliest row where there is a false
function getLastInUpdate(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lr: number
): number {
  const data = sheet.getDataRange().getValues();
  const col = data[0].indexOf("WEEKLY UPDATE"); // looks at top row of sheet
  if (col == -1) {
    throw new Error("The weekly update column wasn't found");
  }
  for (let i = 0; i < lr; i++) {
    // row, then column
    if (data[i][col] == false) {
      return i;
    }
  }
  throw new Error("No false value found in WU column");
}

// Creates list of student information for Slack information
function generateList(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lc: number,
  lr: number
): string {
  const data = sheet.getDataRange().getValues(); // gathering input sheet data

  const fnameCol = data[0].indexOf("FIRST NAME"); // looks at top row of sheet
  const lnameCol = data[0].indexOf("LAST NAME");
  const weekCol = data[0].indexOf("WEEK");
  const cityCol = data[0].indexOf("CITY");
  const provCol = data[0].indexOf("PROVINCE/STATE");
  const countryCol = data[0].indexOf("COUNTRY");
  const schoolCol = data[0].indexOf("SCHOOL");
  const gradeCol = data[0].indexOf("GRADE");
  const shoutoutCol = data[0].indexOf("SHOUTOUT");

  // check to make sure all columns are found; if not throw error
  if (
    fnameCol == -1 ||
    lnameCol == -1 ||
    weekCol == -1 ||
    cityCol == -1 ||
    provCol == -1 ||
    countryCol == -1 ||
    schoolCol == -1 ||
    gradeCol == -1 ||
    shoutoutCol == -1
  ) {
    throw new Error(
      "A column name wasn't found. Please check the names all much the above spellings and capitalization."
    );
  }
  let list: string = "";
  for (var i = lc; i < lr; i++) {
    // looping from last contacted to last registered
    let fname = data[i][fnameCol];
    let lname = data[i][lnameCol];
    let week = data[i][weekCol];
    let city = data[i][cityCol];
    let prov = data[i][provCol];
    let country = data[i][countryCol];
    let grade = data[i][gradeCol];
    let school = data[i][schoolCol];
    let shoutout = data[i][shoutoutCol];
    const slackFormatting = getSlackStudentFormatting(
      fname,
      lname,
      week,
      city,
      prov,
      country,
      grade,
      school,
      shoutout
    );
    list += slackFormatting; // returns formatted string directly of students
  }
  return list;
}

// Returns relevant information from the overview tab
function generateGeneralStats(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): string {
  const data = sheet.getDataRange().getValues(); // gathering overview tab data
  Logger.log(data);
  let result: string = "";
  const lastStat: number = sheet.getLastRow();
  const offset = 3; // first row with actual statistics, counting from 0 (row 4)

  for (let i = offset; i < lastStat; i++) {
    result += getSlackStatisticFormatting(data[i][1], data[i][2]);
    Logger.log(result);
  }

  return result;
}

// Generates payment statistics for staff
function generatePaymentStats(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): string {
  const data = sheet.getDataRange().getValues(); // gathering overview tab data
  let result: string = "";
  const lastStat: number = sheet.getLastRow();
  const offset = 3; // first row with actual statistics, counting from 0 (row 4)

  for (let i = offset; i < lastStat; i++) {
    result += getSlackStatisticFormatting(data[i][4], data[i][5]);
  }

  return result;
}

// Returns message formatted for Slack
function getSlackStudentFormatting(
  fname: string,
  lname: string,
  week: string,
  city: string,
  prov: string,
  country: string,
  grade: string,
  school: string,
  shoutout: string
): string {
  return `
        ${fname} ${lname}\n
        ${week}\n
        ${city}, ${prov}, ${country}\n
        Grade ${grade} @ ${school}\n
        Shoutout?! ${shoutout}
        \n
    `;
}

function getSlackStatisticFormatting(name: string, stat: string): string {
  if (name.indexOf('%') != -1) {
    stat = generatePercentage(parseFloat(stat));
  }

  return `
        ${name}: ${stat}
    `;
}

// Generates Slack string literal
function generateSlackMessage(stats: string, students: string): string {
  return `
    111011101 Welcome to your weekly update! 111011101
    \n
    010101 STATISTICS 010101
    ${stats}
    \n
    101010 STUDENTS 101010
    ${students}
    Let's commence preparations for rumbling!
    \n
    Bender
    `;
}

// Sends admin update about payment information for students
function sendAdminPaymentUpdate(message: string) {
  let url = PropertiesService.getScriptProperties().getProperty(
    "slackTestingWebhook"
  );
  let testPayload = {
    channel: "testing",
    text: message,
  };
  try {
    //sendToSlack(url, reg_payload);
    sendToSlack(url, testPayload); // remove in production
  } catch (error) {
    throw new Error("There was an issue sending the payment payload");
  }
}

// Sends weekly update to the slack channel by generating payloads and grabbing URL from GAS properties
function sendWeeklyUpdate(message: string) {
  let url = PropertiesService.getScriptProperties().getProperty(
    "slackTestingWebhook"
  );
  let testPayload = {
    channel: "#testing",
    text: message,
  };
  let reg_payload = {
    channel: "#registration",
    text: message,
  };
  try {
    //sendToSlack(url, reg_payload);
    sendToSlack(url, testPayload); // remove in production
  } catch (error) {
    throw new Error("There was an issue sending the weekly update");
  }
}

// Slack boilerplate
function sendToSlack(url: string, payload: object) {
  let options: Object = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(url, options);
}

// Simply utility function for converting sheet decimals to percentages
function generatePercentage(decimal: number) {
  return `${(decimal * 100).toFixed(2)}%`;
}
