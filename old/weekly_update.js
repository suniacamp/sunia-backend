function weekly_update() {
  
    Logger.log("Weekly update!");
  
    var master_reg = SpreadsheetApp.openById("1gCFYbMEpomb30mZvjP3ljtri3QMEUajGbEZ_XeFzo5E");
  
    var overview_sheet = master_reg.getSheetByName("OVERVIEW");
    var db_sheet = master_reg.getSheetByName("INPUT");
    var reg_sheet = master_reg.getSheetByName("REGS");
  
    var last_row = db_sheet.getLastRow();
    var last_emailed_row = overview_sheet.getRange(17, 2).getValue();
  
    Logger.log(last_row);
    Logger.log(last_emailed_row);
  
    var list = "";

    if (last_emailed_row != last_row) {
        for (var i = last_emailed_row; i < last_row + 1; i++) {
          
            var name = db_sheet.getRange(i, 2).getValue() + " " + db_sheet.getRange(i, 3).getValue();
            Logger.log(name);
            var week = db_sheet.getRange(i, 4).getValue();
            var city = db_sheet.getRange(i, 12).getValue();
            var prov = db_sheet.getRange(i, 13).getValue();
            var country = db_sheet.getRange(i, 14).getValue();
            var school = db_sheet.getRange(i, 23).getValue();
            var grade = db_sheet.getRange(i, 27).getValue();
            var shoutout = db_sheet.getRange(i, 41).getValue();
          
          list += name + "\n" + week + "\nGrade: " + grade + ", " + school + "\n" + city + ", " + prov + ", " + country + "\nSHOUTOUT?! " + shoutout + "\n\n"; 
        }
    }
  
  var total_regs = overview_sheet.getRange(2,2).getValue();
  var regs_total = overview_sheet.getRange(2,2).getValue();          
  
  var wa_regs = overview_sheet.getRange(11,2).getValue();
  var wb_regs = overview_sheet.getRange(12,2).getValue();
  
  var drops = overview_sheet.getRange(4,2).getValue();
  var drops_p = (overview_sheet.getRange(5,2).getValue()* 100).toFixed(2) + "%";
  
  var total_attending = overview_sheet.getRange(14,2).getValue();
  
    overview_sheet.getRange(17, 2).setValue(last_row);
    
    var url = "https://hooks.slack.com/services/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";
    
    var update = "111011101 Welcome to your weekly update.\n\nWeek A Attending: " + wa_regs + "\nWeek B Attending: " + wb_regs + "\nDrops Total: " + drops + "\nDrops Percentage: " + drops_p + "\nTotal Attending: " + total_attending + "\n\n" + list + "\n\nLet's commence preparations for rumbling!\n\nBender.";
    
    var test_payload = {
    "channel" : "#testing", // <-- optional parameter, use if you want to override default channel
    "text" : update, // <-- required parameter
    }
    var reg_payload = {
    "channel" : "#registration", // <-- optional parameter, use if you want to override default channel
    "text" : update, // <-- required parameter
    }
    
    //sendToSlack_(url, reg_payload);
    //sendToSlack_(url, test_payload);
}
            
function sendToSlack_(url,payload) {
    var options =  {
        "method" : "post",
        "contentType" : "application/json",
        "payload" : JSON.stringify(payload)
    };
    return UrlFetchApp.fetch(url, options)
}
