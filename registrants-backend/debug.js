function debug() {
  var master_reg = SpreadsheetApp.openById("1jVpp4SmYy40jtqspUZPhGXKebAeVNvtYjZu0V3GykRY");
  var overview_sheet = master_reg.getSheetByName("OVERVIEW");
  var db_sheet = master_reg.getSheetByName("INPUT")
  var regs = overview_sheet.getRange(2,2).getValue();
  Logger.log(regs)
  
}
