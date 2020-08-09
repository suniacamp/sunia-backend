function payments() {
 
  //Writing emails
  var me = Session.getActiveUser().getEmail();
  var aliases = GmailApp.getAliases();
  var email = aliases[0];
  
  //Obtain master reg sheet and payment reg sheet (inputted to)
  var master_reg = SpreadsheetApp.openById("1gCFYbMEpomb30mZvjP3ljtri3QMEUajGbEZ_XeFzo5E");
  var regs_payment = master_reg.getSheetByName("INPUT_PAYMENT");
  
  //Obtain paypal form
  var paypal_form = SpreadsheetApp.openById("1Znny8vOtN7-jyh8Z9L33dy-53K5oCy5mIvHQsBT7tiQ"); //Main Paypal form
  var paypal_main = paypal_form.getSheetByName("PAYPAL"); //Raw input, from Squarespace
  var paypal_data = paypal_form.getSheetByName("Num_Added"); //Tracks last row added to main db
  var paypal_total = paypal_main.getLastRow();
  var paypal_last = paypal_data.getRange(1,2).getValue();
  var paypal_last_cell = paypal_data.getRange(1,2);
  
  //Obtain cheque form
  var cheque_form = SpreadsheetApp.openById("1zOY26xhVuRDsa1Grhrs-T1ta3breSpXA_aVnxnX89Nk");
  var cheque_main = cheque_form.getSheetByName("CHEQUE");
  var cheque_data = cheque_form.getSheetByName("Num_Added");
  var cheque_total = cheque_main.getLastRow();
  var cheque_last = cheque_data.getRange(1,2).getValue();
  var cheque_last_cell = cheque_data.getRange(1,2);
  
  //Obtain deferrals form
  var deferral_form = SpreadsheetApp.openById("1WkSGasZYdJxUuiRTfIkLGAbDLOqKzEKKR9xABuM1pGY");
  var deferral_main = deferral_form.getSheetByName("DEFERRAL");
  var deferral_data = deferral_form.getSheetByName("Num_Added");
  var deferral_total = deferral_main.getLastRow();
  var deferral_last = deferral_data.getRange(1,2).getValue();
  var deferral_last_cell = deferral_data.getRange(1,2);
  
  //Obtain aid form
  var aid_form = SpreadsheetApp.openById("1wFgV3sNj1iAqEInbNesPfPHbYhgq5Xe1Er0348eRdew");
  var aid_main = aid_form.getSheetByName("AID");
  var aid_data = aid_form.getSheetByName("Num_Added");
  var aid_total = aid_main.getLastRow();
  var aid_last = aid_data.getRange(1,2).getValue();
  var aid_last_cell = aid_data.getRange(1,2);
  
  
  //Get which row to update
  var reg_last_row = regs_payment.getLastRow() + 1;
  
  //Loop paypal
  if (paypal_total != paypal_last ) {
    for (var i = paypal_last + 1; i < paypal_total + 1; i++) {
      paypal_last_cell.setValue(paypal_last_cell.getValue() + 1);
      
      //Get student name --> set student name
      s_name = paypal_main.getRange(i,2).getValue();
      regs_payment.getRange(reg_last_row, 1).setValue(s_name);
      
      //Set payment type (Paypal)
      regs_payment.getRange(reg_last_row, 2).setValue("Paypal");
      
      //Get student email --> set student email
      s_email = paypal_main.getRange(i,3).getValue();
      regs_payment.getRange(reg_last_row, 3).setValue(s_email);
      
      //Get payer's name --> set payer's name
      payer_name = paypal_main.getRange(i,4).getValue();
      regs_payment.getRange(reg_last_row, 4).setValue(payer_name);
      
      //No misc.
      regs_payment.getRange(reg_last_row, 5).setValue("n/a");
      
      reg_last_row++;
    }
  }
  
  //Loop cheque
  
  if (cheque_total != cheque_last ) {
    for (var i = cheque_last + 1; i < cheque_total + 1; i++) {
      cheque_last_cell.setValue(cheque_last_cell.getValue() + 1);
      
      //Get student name --> set student name
      s_name = cheque_main.getRange(i,2).getValue();
      regs_payment.getRange(reg_last_row, 1).setValue(s_name);
      
      //Set payment type (Cheque)
      regs_payment.getRange(reg_last_row, 2).setValue("Cheque");
      
      //Get student email --> set student email
      s_email = cheque_main.getRange(i,3).getValue();
      regs_payment.getRange(reg_last_row, 3).setValue(s_email);
      
      //Get payer's name --> set payer's name
      payer_name = cheque_main.getRange(i,4).getValue();
      regs_payment.getRange(reg_last_row, 4).setValue(payer_name);
      
      //Set misc: "N.B.: Cheque follow-up needed."
      regs_payment.getRange(reg_last_row, 5).setValue("Cheque follow-up needed.");
      
      reg_last_row++;
    }
  }
  
  //Loop deferrals
  
  if (deferral_total != deferral_last ) {
    for (var i = deferral_last + 1; i < deferral_total + 1; i++) {
      deferral_last_cell.setValue(deferral_last_cell.getValue() + 1);
      
      //Get student name --> set student name
      s_name = deferral_main.getRange(i,2).getValue();
      regs_payment.getRange(reg_last_row, 1).setValue(s_name);
      
      //Set payment type (Paypal)
      regs_payment.getRange(reg_last_row, 2).setValue("Deferral");
      
      //Get student email --> set student email
      s_email = deferral_main.getRange(i,3).getValue();
      regs_payment.getRange(reg_last_row, 3).setValue(s_email);
      
      //Get payer's name --> set payer's name
      payer_name = deferral_main.getRange(i,4).getValue();
      regs_payment.getRange(reg_last_row, 4).setValue(payer_name);
      
      //Set misc. to plan outline
      plan_outline = deferral_main.getRange(i,5).getValue();
      regs_payment.getRange(reg_last_row, 5).setValue(plan_outline);
      
      reg_last_row++;
    }
  }
  
  //Loop aid
  
  if (aid_total != aid_last ) {
    for (var i = aid_last + 1; i < aid_total + 1; i++) {
      aid_last_cell.setValue(aid_last_cell.getValue() + 1);
      
      
      //Get student name --> set student name
      s_name = aid_main.getRange(i,2).getValue();
      regs_payment.getRange(reg_last_row, 1).setValue(s_name);
      
      //Set payment type (Paypal)
      regs_payment.getRange(reg_last_row, 2).setValue("Aid");
      
      //Get student email --> set student email
      s_email = aid_main.getRange(i,3).getValue();
      regs_payment.getRange(reg_last_row, 3).setValue(s_email);
      
      //Get payer's name --> set payer's name
      payer_name = aid_main.getRange(i,4).getValue();
      regs_payment.getRange(reg_last_row, 4).setValue(payer_name);
      
      //Set misc. to reasoning, etc.
      reason = aid_main.getRange(i,6).getValue();
      regs_payment.getRange(reg_last_row, 5).setValue(reason);
      
      reg_last_row++;
    }
  }
  
 }