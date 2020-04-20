function waviers() {
  
  //Writing emails
  var me = Session.getActiveUser().getEmail();
  var aliases = GmailApp.getAliases();
  var email = aliases[0];
  
  //Initialize
  var folks_to_email = [];
  var waiver_message = "";
  
  //obtain master reg sheet
  var master_reg = SpreadsheetApp.openById("1jVpp4SmYy40jtqspUZPhGXKebAeVNvtYjZu0V3GykRY");
  var overview_sheet = master_reg.getSheetByName("OVERVIEW");
  var db_sheet = master_reg.getSheetByName("INPUT");
  var reg_sheet = master_reg.getSheetByName("REGS");
  
  var num_regs = overview_sheet.getRange(2,2).getValue();  //Returns the position of the last column that has content.
  Logger.log("The last row filled in of the spreadsheet is " + num_regs);
  
  for (var i = 2; i < num_regs + 2; i++) {
    var value = reg_sheet.getRange(i,28).getValue();
    Logger.log(value);
    
    if (value.equals("")) {
      var email = reg_sheet.getRange(i,20).getValue();
      Logger.log(email);
      folks_to_email.push(email);
    }
  }
  
  for (var i = 0; i < folks_to_email.length; i++) {
    Logger.log("This is from the list now: " + folks_to_email[i]);
    
    //Email to folks with message
  }
  
}
