// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

export {}; // prevent global scope

// Exports payment information to main database
function managePayments() {
  Logger.log("Transferring payment details...");

  // registrar@sunia.ca should be the one executing the script, so that the email sends from the current reg
  // configure this by making sure the trigger for this script is under registrar@sunia.ca
  const email = Session.getActiveUser().getEmail();

  transferPaypal(); // deprecated
  transferCheques();
  transferDeferrals();
  transferAid();

  // Note that Stripe data is handled within Squarespace
  // TODO: find way of integrating Stripe data with sheets

  Logger.log("Done!");
}

function transferPaypal() {
  let openRow: number = getOpenRow();
  const inputTab: GoogleAppsScript.Spreadsheet.Sheet = getInputPayment();
  
  const paypalSource = PropertiesService.getScriptProperties().getProperty(
    "paypalSource"
  );
  const paypalForm = SpreadsheetApp.openById(paypalSource);

  const paypalMain = paypalForm.getSheetByName("PAYPAL"); //Raw input, from Squarespace
  const paypalUtils = paypalForm.getSheetByName("UTILS"); //Tracks last row added to main db

  const paypalTotal = paypalMain.getLastRow();
  const paypalLast = paypalUtils.getRange(1, 2).getValue();
  const paypalLastCell = paypalUtils.getRange(1, 2);

  for (let i = paypalLast + 1; i < paypalTotal + 1; i++) {
    paypalLastCell.setValue(paypalLastCell.getValue() + 1);
    
    // Get and set student name
    let studentName = paypalMain.getRange(i,2).getValue();
    inputTab.getRange(openRow, 1).setValue(studentName);
    
    // Set payment type to "Paypal"
    inputTab.getRange(openRow, 2).setValue("Paypal");
    
    //Get and set student's email
    let studentEmail = paypalMain.getRange(i,3).getValue();
    inputTab.getRange(openRow, 3).setValue(studentEmail);
    
    // Get and set payer's name
    let payerName = paypalMain.getRange(i,4).getValue();
    inputTab.getRange(openRow, 4).setValue(payerName);
    
    //No miscellanious data to add, set to n/a
    inputTab.getRange(openRow, 5).setValue("n/a");
    
    openRow++;
  }
}

function transferCheques() {
  let openRow: number = getOpenRow();
  const inputTab: GoogleAppsScript.Spreadsheet.Sheet = getInputPayment();

  const chequeSource = PropertiesService.getScriptProperties().getProperty(
    "chequeSource"
  );
  const chequeForm = SpreadsheetApp.openById(chequeSource);

  const chequeMain = chequeForm.getSheetByName("CHEQUE");
  const chequeUtils = chequeForm.getSheetByName("UTILS");
  const chequeTotal = chequeMain.getLastRow();
  const chequeLast = chequeUtils.getRange(1, 2).getValue();
  const chequeLastCell = chequeUtils.getRange(1, 2);

  for (let i = chequeLast + 1; i < chequeTotal + 1; i++) {
    chequeLastCell.setValue(chequeLastCell.getValue() + 1);

    let studentName = chequeMain.getRange(i,2).getValue();
    inputTab.getRange(openRow, 1).setValue(studentName);
    
    inputTab.getRange(openRow, 2).setValue("Cheque");
    
    let studentEmail = chequeMain.getRange(i,3).getValue();
    inputTab.getRange(openRow, 3).setValue(studentEmail);
    
    let payerName = chequeMain.getRange(i,4).getValue();
    inputTab.getRange(openRow, 4).setValue(payerName);
    
    inputTab.getRange(openRow, 5).setValue("Cheque follow-up needed.");
    
    openRow++;
  }

}

function transferDeferrals() {
  let openRow: number = getOpenRow();
  const inputTab: GoogleAppsScript.Spreadsheet.Sheet = getInputPayment();

  const deferralSource = PropertiesService.getScriptProperties().getProperty(
    "deferralSource"
  );
  const deferralForm = SpreadsheetApp.openById(deferralSource);

  const deferralMain = deferralForm.getSheetByName("DEFERRAL");
  const deferralUtils = deferralForm.getSheetByName("UTILS");
  const deferralTotal = deferralMain.getLastRow();
  const deferralLast = deferralUtils.getRange(1, 2).getValue();
  const deferralLastCell = deferralUtils.getRange(1, 2);

  for (let i = deferralLast + 1; i < deferralTotal + 1; i++) {
    deferralLastCell.setValue(deferralLastCell.getValue() + 1);

    let studentName = deferralMain.getRange(i,2).getValue();
    inputTab.getRange(openRow, 1).setValue(studentName);
    
    inputTab.getRange(openRow, 2).setValue("Deferral");
    
    let studentEmail = deferralMain.getRange(i,3).getValue();
    inputTab.getRange(openRow, 3).setValue(studentEmail);

    let payerName = deferralMain.getRange(i,4).getValue();
    inputTab.getRange(openRow, 4).setValue(payerName);
    
    let planOutline = deferralMain.getRange(i,5).getValue();
    inputTab.getRange(openRow, 5).setValue(planOutline);
    
    openRow++;
  }
}

function transferAid() {
  let openRow: number = getOpenRow();
  const inputTab: GoogleAppsScript.Spreadsheet.Sheet = getInputPayment();

  const aidSource = PropertiesService.getScriptProperties().getProperty(
    "aidSource"
  );
  const aidForm = SpreadsheetApp.openById(aidSource);

  const aidMain = aidForm.getSheetByName("AID");
  const aidUtils = aidForm.getSheetByName("UTILS");
  const aidTotal = aidMain.getLastRow();
  const aidLast = aidUtils.getRange(1, 2).getValue();
  const aidLastCell = aidUtils.getRange(1, 2);

  for (let i = aidLast + 1; i < aidTotal + 1; i++) {
    aidLastCell.setValue(aidLastCell.getValue() + 1);

    let studentName = aidMain.getRange(i,2).getValue();
    inputTab.getRange(openRow, 1).setValue(studentName);
    
    inputTab.getRange(openRow, 2).setValue("Aid");
    
    let studentEmail = aidMain.getRange(i,3).getValue();
    inputTab.getRange(openRow, 3).setValue(studentEmail);
    
    let payerName = aidMain.getRange(i,4).getValue();
    inputTab.getRange(openRow, 4).setValue(payerName);
    
    let reason = aidMain.getRange(i,6).getValue();
    inputTab.getRange(openRow, 5).setValue(reason);
    
    openRow++;
  }
}

// Get bottom row of input payment sheet (to write to)
function getOpenRow(): number {
  const mrPayment = getInputPayment();
  return mrPayment.getLastRow() + 1; // begin updating at last row + 1
}

// Return input payment spreadsheet
function getInputPayment(): GoogleAppsScript.Spreadsheet.Sheet {
  let masterRegString = PropertiesService.getScriptProperties().getProperty(
    "masterRegSource"
  );
  const masterRegSource = SpreadsheetApp.openById(masterRegString);
  return masterRegSource.getSheetByName("INPUT_PAYMENT");
}
