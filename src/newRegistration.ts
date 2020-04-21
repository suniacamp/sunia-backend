// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

// Emails registrant and their parent, updates Slack, adds to database

export {}; // prevent global scope

interface student {
  date: string;
  firstName: string;
  prefName: string;
  lastName: string;
  week: string;
  bus: string;
  studentPhone: string;
  studentEmail: string;
  age: string;
  gender: string;
  healthNumber: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  healthConcerns: string;
  medications: string;
  diet: string;
  parentName: string;
  parentRelationship: string;
  parentEmail: string;
  parentPhone: string;
  schoolName: string;
  schoolCity: string;
  schoolProvince: string;
  schoolCountry: string;
  grade: string;
  ecName: string;
  ecRelationship: string;
  ecPhone: string;
  ecPhoneType: string;
  ecAltPhone: string;
  ecAltPhoneType: string;
  ec2Name: string;
  ec2Relationship: string;
  ec2Phone: string;
  ec2PhoneType: string;
  ec2AltPhone: string;
  ec2AltPhoneType: string;
  hearAboutUs: string;
  shoutout: string;
}

function newRegistration() {
  Logger.log("Managing new registration...");

  // registrar@sunia.ca should be the one executing the script, so that the email sends from the current reg
  // configure this by making sure the trigger for this script is under registrar@sunia.ca
  const email = Session.getActiveUser().getEmail();

  if (email != "registrar@sunia.ca") {
    Logger.log(
      "The email isn't sending from registrar@sunia.ca... it's sending from " +
        email
    );
    return;
  }

  const registrants: student[] = getData();

  transferData(registrants);
  postToSlack(registrants);
  sendEmails(registrants);

  Logger.log("Done!");
}

// Get student data from raw input sheet
function getData(): student[] {
  let rawRegString = PropertiesService.getScriptProperties().getProperty(
    "rawRegSource"
  );
  const rawRegSource = SpreadsheetApp.openById(rawRegString);
  const rrData = rawRegSource.getSheetByName("Raw_Data");
  const rrNumEmailed = rawRegSource.getSheetByName("Num_Emailed");

  let lastReg = rrData.getLastRow();
  let lastEmailed = rrNumEmailed.getRange(1, 2).getValue();
  let lastEmailedCell = rrNumEmailed.getRange(1, 2);

  const data = rrData.getDataRange().getValues(); // raw reg data in 2D array

  // Get all the column indexes

  // Personal information
  const dateCol = data[0].indexOf("Submitted On"); // looks at top row of sheet
  const fnCol = data[0].indexOf("First Name");
  const prefCol = data[0].indexOf("Preferred First Name");
  const lnCol = data[0].indexOf("Last Name");
  const sessionCol = data[0].indexOf("Session Choice");
  const busCol = data[0].indexOf("Red Deer Bus");
  const hearCol = data[0].indexOf("How Did You Hear About SUNIA");
  const stuPhoneCol = data[0].indexOf("Student Phone");
  const stuEmailCol = data[0].indexOf("Student Email");
  const stuAgeCol = data[0].indexOf("Age");
  const stuHCCol = data[0].indexOf("Provincial Health Care Number");
  const genderCol = data[0].indexOf("Gender");

  // Location
  const addressCol = data[0].indexOf("Address");
  const cityCol = data[0].indexOf("City");
  const provinceCol = data[0].indexOf("ProvinceState");
  const countryCol = data[0].indexOf("Country");
  const postalCol = data[0].indexOf("Postal CodeZIP Code");

  // Medical
  const healthCol = data[0].indexOf("Health Concerns");
  const medCol = data[0].indexOf("Medications");
  const dietCol = data[0].indexOf("Dietary Restrictions");

  // Parent information
  const parentNameCol = data[0].indexOf("ParentGuardian Name");
  const parentRelCol = data[0].indexOf(
    "ParentGuardian Relationship to Student"
  );
  const parentEmailCol = data[0].indexOf("ParentGuardian Email");
  const parentPhoneCol = data[0].indexOf("ParentGuardian Phone");

  // School
  const schoolNameCol = data[0].indexOf("School Name");
  const schoolCityCol = data[0].indexOf("School City");
  const schoolProvCol = data[0].indexOf("School ProvinceState");
  const schoolCountryCol = data[0].indexOf("School Country");
  const gradeCol = data[0].indexOf("Grade");

  // Primary emergency contact
  const primeNameCol = data[0].indexOf("Primary Emergency Contact");
  const primeRelCol = data[0].indexOf("Primary Relation to Student");
  const primePhone1Col = data[0].indexOf("Primary Phone");
  const primePhone1TypeCol = data[0].indexOf("Primary Phone Type");
  const primePhone2Col = data[0].indexOf("Primary Alternate Phone");
  const primePhone2TypeCol = data[0].indexOf("Primary Alternate Phone Type");

  // Secondary emergency contact
  const secNameCol = data[0].indexOf("Secondary Emergency Contact");
  const secRelCol = data[0].indexOf("Secondary Relation to Student");
  const secPhone1Col = data[0].indexOf("Secondary Phone");
  const secPhone1TypeCol = data[0].indexOf("Secondary Phone Type");
  const secPhone2Col = data[0].indexOf("Secondary Alternate Phone");
  const secPhone2TypeCol = data[0].indexOf("Secondary Alternate Phone Type");

  // Shoutout
  const shoutoutCol = data[0].indexOf(
    "Optional Did anyone in particular encourage you to register If so who"
  );

  let students: student[];
  for (let i = lastEmailed + 1; i < lastReg + 1; i++) {
    lastEmailedCell.setValue(lastEmailedCell.getValue() + 1);

    let student = {
      date: data[i][dateCol],
      firstName: data[i][fnCol],
      prefName: data[i][prefCol],
      lastName: data[i][lnCol],
      week: data[i][sessionCol],
      bus: data[i][busCol],
      studentPhone: data[i][stuPhoneCol],
      studentEmail: data[i][stuEmailCol],
      age: data[i][stuAgeCol],
      gender: data[i][genderCol],
      healthNumber: data[i][stuHCCol],
      address: data[i][addressCol],
      city: data[i][cityCol],
      province: data[i][provinceCol],
      country: data[i][countryCol],
      postalCode: data[i][postalCol],
      healthConcerns: data[i][healthCol],
      medications: data[i][medCol],
      diet: data[i][dietCol],
      parentName: data[i][parentNameCol],
      parentRelationship: data[i][parentRelCol],
      parentEmail: data[i][parentEmailCol],
      parentPhone: data[i][parentPhoneCol],
      schoolName: data[i][schoolNameCol],
      schoolCity: data[i][schoolCityCol],
      schoolProvince: data[i][schoolProvCol],
      schoolCountry: data[i][schoolCountryCol],
      grade: data[i][gradeCol],
      ecName: data[i][primeNameCol],
      ecRelationship: data[i][primeRelCol],
      ecPhone: data[i][primePhone1Col],
      ecPhoneType: data[i][primePhone1TypeCol],
      ecAltPhone: data[i][primePhone2Col],
      ecAltPhoneType: data[i][primePhone2TypeCol],
      ec2Name: data[i][secNameCol],
      ec2Relationship: data[i][secRelCol],
      ec2Phone: data[i][secPhone1Col],
      ec2PhoneType: data[i][secPhone1TypeCol],
      ec2AltPhone: data[i][secPhone2Col],
      ec2AltPhoneType: data[i][secPhone2TypeCol],
      hearAboutUs: data[i][hearCol],
      shoutout: data[i][shoutoutCol],
    };
    students.push(student);
  }
  return students;
}

function transferData(registrants: student[]) {
  // Get master reg sheet
  let masterRegString = PropertiesService.getScriptProperties().getProperty(
    "masterRegSource"
  );
  const masterRegSource = SpreadsheetApp.openById(masterRegString);
  const mrInput = masterRegSource.getSheetByName("INPUT");
  const data = mrInput.getDataRange().getValues(); // raw reg data in 2D array

  // Get all the column indexes

  // Personal information
  const dateCol = data[0].indexOf("DATE OF REG"); // looks at top row of sheet
  const fnCol = data[0].indexOf("FIRST NAME");
  const prefCol = data[0].indexOf("PERFERRED NAME");
  const lnCol = data[0].indexOf("LAST NAME");
  const sessionCol = data[0].indexOf("WEEK");
  const busCol = data[0].indexOf("BUS");
  const hearCol = data[0].indexOf("HOW DID YOU HEAR ABOUT SUNIA");
  const stuPhoneCol = data[0].indexOf("STUDENT PHONE");
  const stuEmailCol = data[0].indexOf("STUDENT EMAIL");
  const stuAgeCol = data[0].indexOf("AGE");
  const stuHCCol = data[0].indexOf("AHC#");
  const genderCol = data[0].indexOf("GENDER");

  // Location
  const addressCol = data[0].indexOf("ADDRESS");
  const cityCol = data[0].indexOf("CITY");
  const provinceCol = data[0].indexOf("PROVINCE/STATE");
  const countryCol = data[0].indexOf("COUNTRY");
  const postalCol = data[0].indexOf("POSTAL CODE");

  // Medical
  const healthCol = data[0].indexOf("HEALTH CONCERNS");
  const medCol = data[0].indexOf("MEDICATIONS");
  const dietCol = data[0].indexOf("DIETARY RESTRICTIONS");

  // Parent information
  const parentNameCol = data[0].indexOf("PARENT NAME");
  const parentRelCol = data[0].indexOf("PARENT RELATIONSHIP");
  const parentEmailCol = data[0].indexOf("PARENT EMAIL");
  const parentPhoneCol = data[0].indexOf("PARENT PHONE");

  // School
  const schoolNameCol = data[0].indexOf("SCHOOL");
  const schoolCityCol = data[0].indexOf("SCHOOL CITY");
  const schoolProvCol = data[0].indexOf("SCHOOL PROVINCE/STATE");
  const schoolCountryCol = data[0].indexOf("SCHOOL COUNTRY");
  const gradeCol = data[0].indexOf("GRADE");

  // Primary emergency contact
  const primeNameCol = data[0].indexOf("PRIME EC NAME");
  const primeRelCol = data[0].indexOf("PRIME EC RELATIONSHIP");
  const primePhone1Col = data[0].indexOf("PRIME EC PHONE NUMBER");
  const primePhone1TypeCol = data[0].indexOf("PRIME EC PHONE TYPE");
  const primePhone2Col = data[0].indexOf("PRIME EC ALTERNATE PHONE");
  const primePhone2TypeCol = data[0].indexOf("PRIME EC ALTERNATE PHONE TYPE");

  // Secondary emergency contact
  const secNameCol = data[0].indexOf("SECOND EMERG CONTACT NAME");
  const secRelCol = data[0].indexOf("SECOND EMERG RELATIONSHIP");
  const secPhone1Col = data[0].indexOf("SECOND EMERG PHONE 1");
  const secPhone1TypeCol = data[0].indexOf("SECOND EMERG PHONE TYPE");
  const secPhone2Col = data[0].indexOf("SECOND EMERG PHONE 2");
  const secPhone2TypeCol = data[0].indexOf("SECOND EMERG ALTERNATE PHONE TYPE");

  // Shoutout
  const shoutoutCol = data[0].indexOf("SHOUTOUT");

  for (let registrant of registrants) {
    let rowToWriteTo = mrInput.getLastRow() + 1;
   
    // Student basics
    mrInput.getRange(rowToWriteTo, dateCol).setValue(registrant.date);
    mrInput.getRange(rowToWriteTo, fnCol).setValue(registrant.firstName);
    mrInput.getRange(rowToWriteTo, prefCol).setValue(registrant.prefName);
    mrInput.getRange(rowToWriteTo, lnCol).setValue(registrant.lastName);

    // SUNIA logistics
    mrInput.getRange(rowToWriteTo, sessionCol).setValue(registrant.week);
    mrInput.getRange(rowToWriteTo, busCol).setValue(registrant.bus);
    mrInput.getRange(rowToWriteTo, hearCol).setValue(registrant.hearAboutUs);
    
    // More student information
    mrInput.getRange(rowToWriteTo, stuPhoneCol).setValue(registrant.studentPhone);
    mrInput.getRange(rowToWriteTo, stuEmailCol).setValue(registrant.studentEmail);
    mrInput.getRange(rowToWriteTo, stuAgeCol).setValue(registrant.age);
    mrInput.getRange(rowToWriteTo, stuHCCol).setValue(registrant.healthNumber);
    mrInput.getRange(rowToWriteTo, genderCol).setValue(registrant.gender);

    // Location
    mrInput.getRange(rowToWriteTo, addressCol).setValue(registrant.address);
    mrInput.getRange(rowToWriteTo, cityCol).setValue(registrant.city);
    mrInput.getRange(rowToWriteTo, provinceCol).setValue(registrant.province);
    mrInput.getRange(rowToWriteTo, countryCol).setValue(registrant.country);
    mrInput.getRange(rowToWriteTo, postalCol).setValue(registrant.postalCode);

    // Student health
    mrInput.getRange(rowToWriteTo, healthCol).setValue(registrant.healthConcerns);
    mrInput.getRange(rowToWriteTo, medCol).setValue(registrant.medications);
    mrInput.getRange(rowToWriteTo, dietCol).setValue(registrant.diet);

    // Parent information
    mrInput.getRange(rowToWriteTo, parentNameCol).setValue(registrant.parentName);
    mrInput.getRange(rowToWriteTo, parentRelCol).setValue(registrant.parentRelationship);
    mrInput.getRange(rowToWriteTo, parentEmailCol).setValue(registrant.parentEmail);
    mrInput.getRange(rowToWriteTo, parentPhoneCol).setValue(registrant.parentPhone);
    
    // School
    mrInput.getRange(rowToWriteTo, schoolNameCol).setValue(registrant.schoolName);
    mrInput.getRange(rowToWriteTo, schoolCityCol).setValue(registrant.schoolCity);
    mrInput.getRange(rowToWriteTo, schoolProvCol).setValue(registrant.schoolProvince);
    mrInput.getRange(rowToWriteTo, schoolCountryCol).setValue(registrant.schoolCountry);
    mrInput.getRange(rowToWriteTo, gradeCol).setValue(registrant.grade);
    
    // First emergency contact
    mrInput.getRange(rowToWriteTo, primeNameCol).setValue(registrant.ecName);
    mrInput.getRange(rowToWriteTo, primeRelCol).setValue(registrant.ecRelationship);
    mrInput.getRange(rowToWriteTo, primePhone1Col).setValue(registrant.ecPhone);
    mrInput.getRange(rowToWriteTo, primePhone1TypeCol).setValue(registrant.ecPhoneType);
    mrInput.getRange(rowToWriteTo, primePhone2Col).setValue(registrant.ecAltPhone);
    mrInput.getRange(rowToWriteTo, primePhone2TypeCol).setValue(registrant.ecAltPhoneType);
    
    // Second emergency contact
    mrInput.getRange(rowToWriteTo, secNameCol).setValue(registrant.ec2Name);
    mrInput.getRange(rowToWriteTo, secRelCol).setValue(registrant.ec2Relationship);
    mrInput.getRange(rowToWriteTo, secPhone1Col).setValue(registrant.ec2Phone);
    mrInput.getRange(rowToWriteTo, secPhone1TypeCol).setValue(registrant.ec2PhoneType);
    mrInput.getRange(rowToWriteTo, secPhone2Col).setValue(registrant.ec2AltPhone);
    mrInput.getRange(rowToWriteTo, secPhone2TypeCol).setValue(registrant.ec2AltPhoneType);
    
    // Shoutout
    mrInput.getRange(rowToWriteTo, shoutoutCol).setValue(registrant.shoutout);
  }
}

function postToSlack(registrants: student[]) {
  let url = PropertiesService.getScriptProperties().getProperty(
    "slackTestingWebhook"
  );
  for (let registrant of registrants) {
    let message: string = generateSlackFormatting(registrant);
    let testPayload = {
      channel: "#testing",
      text: message,
    };
    let regPayload = {
      channel: "#registration",
      text: message,
    };
    try {
      // sendToSlack(url, regPayload);
      sendToSlack(url, testPayload);
    } catch (error) {
      throw new Error("There was an issue sending the update to Slack");
    }
  }
}

// Generates Slack formatting for a registrant
function generateSlackFormatting(registrant: student): string {
  return `
    100101010 (Another registrant has arrived.)
    \n
    Name: ${registrant.firstName}
    Week: ${registrant.week}
    Gender: ${registrant.gender}
    City: ${registrant.city}
    Province: ${registrant.province}
    School: ${registrant.schoolName}
    Grade: ${registrant.grade}
    How did you hear about SUNIA? ${registrant.hearAboutUs}
    \n
    ${generateRandomBenderQuote()}
    Bender
  `;
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

function sendEmails(registrants: student[]) {
  for (let registrant of registrants) {
    let pEmail: string = registrant.parentEmail;
    let sEmail: string = registrant.studentEmail;

    sendParentEmail(pEmail, registrant);
    sendStudentEmail(sEmail, registrant);
  }
}

function sendParentEmail(pEmail: string, registrant: student) {
  if (pEmail == "" || pEmail != "michaelfromyeg@gmail.com") {
    Logger.log("Parent email was empty for some reason... strange");
    return;
  } else {
    try {
      let parentName: string = registrant.parentName;
      let pTemplate = HtmlService.createTemplateFromFile("html/parent_intro");

      pTemplate.parentName = parentName; // note the different variable names
      pTemplate.registrant = registrant;

      var phtmlBody = pTemplate.evaluate().getContent();

      if (pEmail != "michaelfromyeg@gmail.com") {
        return;
      }

      MailApp.sendEmail({
        to: pEmail,
        subject: "SUNIA 2020: Next Steps in Your Child's Registration!",
        htmlBody: phtmlBody,
      });

      Logger.log(parentName + " was contacted!");
    } catch (error) {
      Logger.log(
        error + "\nError with parent email, email likely not send as a result"
      );
    }
  }
}

function sendStudentEmail(sEmail: string, registrant: student) {
  if (sEmail == "" || sEmail != "michaelfromyeg@gmail.com") {
    Logger.log("Student email was blank for reason... strange");
    return;
  } else {
    try {
      let studentName: string = registrant.firstName;
      let sTemplate = HtmlService.createTemplateFromFile("html/student_intro");

      sTemplate.studentName = studentName;
      sTemplate.registrant = registrant;

      var shtmlBody = sTemplate.evaluate().getContent();

      if (sEmail != "michaelfromyeg@gmail.com") {
        return;
      }

      //send mail to student
      MailApp.sendEmail({
        to: sEmail,
        subject: "SUNIA 2020: Next Steps in Your Registration!",
        htmlBody: shtmlBody,
      });

      Logger.log(studentName + " was contacted!");
    } catch (error) {
      Logger.log(
        error + "\nError with student email, email likely not send as a result"
      );
    }
  }
}

function generateRandomBenderQuote(): string {
  let benderQuotes: string[] = ["I’m so embarrassed. I wish everybody else was dead.", 
                                "My story is a lot like yours, only more interesting ‘cause it involves robots.",
                                "This is the worst kind of discrimination there is: the kind against me!",
                                "Bite my shiny metal ass!",
                                "I'm going to build my own theme park! With Blackjack! And hookers!"];
  return benderQuotes[Math.floor(Math.random() * benderQuotes.length)];
}
