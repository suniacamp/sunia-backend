// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

// Provides an update to Slack of registrants from the last week
// Doesn't check dates, but assigns boolean value instead, so if there's
// a bug it may be run later and not miss any students

function weeklyUpdate() {
    Logger.log("Attempting to give weekly update...");
    let misc: string = "";

    const masterRegSource = SpreadsheetApp.openById("1gCFYbMEpomb30mZvjP3ljtri3QMEUajGbEZ_XeFzo5E");
    const mrOverview = masterRegSource.getSheetByName("OVERVIEW") // mr is short for masterReg
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
    const row = lastWU;

    let list: string;
    try {
        list = generateList(mrInput, row, lastReg);
    } catch (error) {
        Logger.log(error + "\nexiting function as a result");
        return;
    }

    let stats: string;
    try {
        stats = generateStats(mrOverview);
    } catch (error) {
        Logger.log(error + "\nexiting function as a result");
    }

    const slackMessage: string = generateSlackMessage(stats, list);
    try {
        sendSlackMessage(slackMessage);
    } catch(error) {
        Logger.log(error, "exiting function as a result");
    }

    Logger.log("Weekly update done!", misc);
}


// Finds the column entitled "WEEKLY UPDATE", loops through it and returns the earliest row where there is a false
function getLastInUpdate(sheet: GoogleAppsScript.Spreadsheet.Sheet, lr: number): number {
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
function generateList(sheet: GoogleAppsScript.Spreadsheet.Sheet, lc: number, lr: number): string {
    const data = sheet.getDataRange().getValues(); // gathering input sheet data
    
    const fnameCol = data[0].indexOf("FIRST NAME"); // looks at top row of sheet
    const lnameCol = data[0].indexOf("LAST NAME");
    const weekCol = data[0].indexOf("WEEK");
    const cityCol = data[0].indexOf("CITY");
    const provCol = data[0].indexOf("PROVINCE/STATE");
    const countryCol = data[0].indexOf("COUNTRY");
    const schoolCol = data[0].indexOf("SCHOOL");
    const gradeCol = data[0].indexOf("GRADE");
    const shoutoutCol = data[0].indexOf("SHOUTOUT");;

    // check to make sure all columns are found; if not throw error
    if (fnameCol == -1 || lnameCol == -1 || weekCol == -1 || cityCol == -1 || provCol == -1 || 
        countryCol == -1 || schoolCol == -1 || gradeCol == -1 || shoutoutCol == -1) {
            throw new Error("A column name wasn't found. Please check the names all much the above spellings and capitalization.");
    }
    let list: string;
    for (var i = lc; i < lr; i++) { // looping from last contacted to last registered
        let fname = data[i][fnameCol];
        let lname = data[i][lnameCol];
        let week = data[i][weekCol];
        let city = data[i][cityCol];
        let prov = data[i][provCol];
        let country = data[i][countryCol];
        let grade = data[i][gradeCol];
        let school = data[i][schoolCol];
        let shoutout = data[i][shoutoutCol];
        const slackFormatting = getSlackFormatting(fname, lname, week, city, prov, country, grade, school, shoutout);
        Logger.log("student to add: " + slackFormatting);
        list += slackFormatting; // returns formatted string directly of students
    }
    return list;
}

// Returns relevant information from the overview tab
function generateStats(sheet: GoogleAppsScript.Spreadsheet.Sheet): string {
    return "Hello, world!";
}

// Returns message formatted for Slack
function getSlackFormatting(fname: string, lname: string, week: string, city: string, prov: string, country: string, grade: string, school: string, shoutout: string): string {
    return `
        ${fname} ${lname}\n
        ${week}\n
        ${city}, ${prov}, ${country}\n
        Grade ${grade} @ ${school}\n
        Shoutout?! ${shoutout}\n
        \n
    `;
}

function generateSlackMessage(stats: string, students: string): string {
    return `
    111011101 Welcome to your weekly update! 111011101\n
    \n
    010101 STATISTICS 010101\n
    ${stats}\n
    \n
    101010 STUDENTS 101010\n
    ${students}\n
    \n
    Let's commence preparations for rumbling!\n
    \n
    Bender
    `
}

function sendSlackMessage(message: string) {
    let url = PropertiesService.getScriptProperties().getProperty('slackTestingWebhook');
    let testPayload = {
        "channel" : "#testing",
        "text" : message
    }
    let reg_payload = {
        "channel" : "#registration", 
        "text" : message
    }
    try {
        //sendToSlack(url, reg_payload);
        sendToSlack(url, testPayload); // remove in production
    } catch (error) {
        throw new Error("There was an issue sending the payload");
    }
}

// Slack boilerplate
function sendToSlack(url: string, payload: object) {
    let options: Object = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload)
    }
    UrlFetchApp.fetch(url, options);
}