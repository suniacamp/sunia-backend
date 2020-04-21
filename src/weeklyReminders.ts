// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

export {}; // prevent global scope

// Sends parents update to fill out their waivers, along with some other helpful reminders
function weeklyReminders() {
  Logger.log("Sending weekly reminders email...");

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

  let masterRegString = PropertiesService.getScriptProperties().getProperty(
    "masterRegSource"
  );

  const masterRegSource = SpreadsheetApp.openById(masterRegString);

  const mrRegs = masterRegSource.getSheetByName("REGS");
  const mrInput = masterRegSource.getSheetByName("INPUT");
  const data = mrRegs.getDataRange().getValues();
  const lastReg = mrInput.getLastRow(); // get last row from input, because REGS has true/falses all the way down (will check every row)

  
  const colPayment = data[0].indexOf("PAYMENT TYPE?"); // looks at top row of sheet
  const colWaivers = data[0].indexOf("WAIVERS COMPLETE"); // looks at top row of sheet
  const colParentEmail = data[0].indexOf("PARENT EMAIL"); // looks at top row of sheet
  const colReminded = data[0].indexOf("REMINDED"); // looks at top row of sheet

  if (colPayment == -1 || colWaivers == -1 || colParentEmail == -1 || colReminded == -1) {
    Logger.log("A column name was not found, exiting script as a result");
    return;
  }

  for (let i = 1; i < lastReg; i++) {
    if (data[i][colPayment] == false || data[i][colWaivers] == false) { // if they haven't submitted a payment type or waivers
      if (data[i][colParentEmail] == "") {
        continue; // parent's email is blank, just continue to loop
      } else {
        sendReminderEmail(data[i][colParentEmail]);
        // add 1 to "reminded" column to keep track of emails
        let oldReminderCount = mrRegs.getRange(i+1, colReminded+1).getValue(); // get range and set range are indexed from 1
        mrRegs.getRange(i+1, colReminded+1).setValue(oldReminderCount + 1);
      }
    }
  }

  Logger.log("Done!");
}

function sendReminderEmail(pEmail: string) {
  if (pEmail == "") {
    Logger.log("Parent email was blank for some reason. Weird.");
    return;
  }

  // TODO: remove in production
  if (pEmail != "michaelfromyeg@gmail.com") {
    Logger.log("Tried sending to a non-testing email.");
    return;
  }

  try {
    let pTemplate = HtmlService.createTemplateFromFile("html/reminders");
    let phtmlBody = pTemplate.evaluate().getContent();

    MailApp.sendEmail({
      to: pEmail,
      subject: "SUNIA 2020: Registration Reminders",
      htmlBody: phtmlBody,
    });

    Logger.log(pEmail + " was contacted with the reminder email!");
  } catch (error) {
    Logger.log(
      "I tried to send a reminder email to " +
        pEmail +
        " but there was an error"
    );
  }
}
