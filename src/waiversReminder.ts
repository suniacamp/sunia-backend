// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

export {}; // prevent global scope

// Sends parents update to fill out their waivers, along with some other helpful reminders
function waivers() {
  Logger.log("Sending weekly waivers update...");

  // registrar@sunia.ca should be the one executing the script, so that the email sends from the current reg
  // configure this by making sure the trigger for this script is under registrar@sunia.ca
  const aliases = GmailApp.getAliases();
  const email = aliases[0];

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
  const data = mrRegs.getDataRange().getValues();
  const lastReg = mrRegs.getLastRow();

  const colPayment = data[0].indexOf("PAYMENT TYPE?"); // looks at top row of sheet
  const colWaivers = data[0].indexOf("WAIVERS COMPLETE"); // looks at top row of sheet
  const colParentEmail = data[0].indexOf("PARENT EMAIL"); // looks at top row of sheet

  for (let i = 1; i < lastReg; i++) {
    if (data[i][colPayment] == false || data[i][colWaivers] == false) {
      sendReminderEmail(data[i][colParentEmail]);
    }
  }

  Logger.log("Done!");
}

function sendReminderEmail(pEmail: string) {
  if (pEmail == "") {
    Logger.log("Parent email was blank for some reason. Weird.");
    return;
  }

  try {
    let pTemplate = HtmlService.createTemplateFromFile("html/reminders");
    let phtmlBody = pTemplate.evaluate().getContent();

    MailApp.sendEmail({
      to: pEmail,
      subject: "SUNIA 2020: Next Steps in Your Child's Registration!",
      htmlBody: phtmlBody,
    });

    Logger.log(pEmail + "was contacted with the reminder email!");
  } catch (error) {
    Logger.log(
      "I tried to send a reminder email to " +
        pEmail +
        " but there was an error"
    );
  }
}
