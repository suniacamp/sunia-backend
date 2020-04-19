function send_point_update() {
  
  var promo_points_sheet = SpreadsheetApp.openById("1tHdKQCTmwxbdHziFG6DWk5IQ1cMnK-yh-eryaOaw0cY");
  var tracker_sheet = promo_points_sheet.getSheetByName("TRACKER");
  var total_sheet = promo_points_sheet.getSheetByName("TOTALS");
  
  var last_row = total_sheet.getLastRow(); //Returns the position of the last column that has content.
  Logger.log("The last row filled in of the spreadsheet is " + last_row);
  
  var x_offset = 2;
  var y_offset = 3;
  
  var message = "*Promo Point Standings*\n\n";
  
  for (var i = y_offset; i <= last_row; i++) {
    
    var name = total_sheet.getRange(i, x_offset).getValue();
    var points = total_sheet.getRange(i, x_offset + 1).getValue();
    
    message += name + " - " + points + "\n";
    
  }
  
  var team_message = "*Promo Team Standings*\n\n";
  
  for (var j = y_offset; j <= ( last_row / 2 ) + 1; j++) {
    
    var team_name = total_sheet.getRange(j, x_offset + 2).getValue();
    var team_points = total_sheet.getRange(j, x_offset + 3).getValue();
    
    team_message += team_name + " - " + team_points + "\n";
    
  }
   
    var url = "https://hooks.slack.com/services/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";
    
    var points_payload = {
    "channel" : "#promo-general", // <-- optional parameter, use if you want to override default channel
    "text" : message + "\n" + team_message, // <-- required parameter
    }
    
    sendToSlack_(url, points_payload);
  
}


function sendToSlack_(url,payload) {
  var options =  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  return UrlFetchApp.fetch(url, options)
}
