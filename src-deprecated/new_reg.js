function new_reg() {
  // todo: fix identation
  
  //Writing emails
  var me = Session.getActiveUser().getEmail();
  var aliases = GmailApp.getAliases();
  var email = aliases[0];
  
  Logger.log(email);
  
  //obtain master reg sheet
  var master_reg = SpreadsheetApp.openById("1gCFYbMEpomb30mZvjP3ljtri3QMEUajGbEZ_XeFzo5E"); // todo: update yearly
  var overview_sheet = master_reg.getSheetByName("OVERVIEW");
  var db_sheet = master_reg.getSheetByName("INPUT");
  
  //obtain raw reg sheet
  var raw_ss = SpreadsheetApp.openById("1DtTotfFEs1maSvXFPqPa8o_qiIfw0R5hFfpGWJm0lrQ"); // todo: update yearly
  var raw_sheet = raw_ss.getSheetByName("Raw_Data"); //todo rename variables
  var raw_data_sheet = raw_ss.getSheetByName("Num_Emailed");
  
  var last_row = raw_sheet.getLastRow(); //Returns the position of the last column that has content.
  Logger.log("The last row filled in of the spreadsheet is " + last_row);
  var last_email_row = raw_data_sheet.getRange(1,2).getValue();
  var last_emailed_cell = raw_data_sheet.getRange(1,2);
  
  //sheets counts from 1
  //goes through all regs that have not yet been emailed in the last minute
  if (last_email_row != last_row) {
    for (var i = last_email_row + 1; i < last_row + 1; i++){
      
      var reg_last_row = db_sheet.getLastRow() + 1;
      last_emailed_cell.setValue(last_emailed_cell.getValue() + 1);
      
      var date_registered = raw_sheet.getRange(i,1).getValue();
      
      var f_name = raw_sheet.getRange(i,2).getValue();
      var pref_name = raw_sheet.getRange(i,3).getValue();
      var l_name = raw_sheet.getRange(i,4).getValue();
      var week = raw_sheet.getRange(i,5).getValue()
      var bus = raw_sheet.getRange(i,6).getValue();
      var hear_about_sunia = raw_sheet.getRange(i,7).getValue();
      
      var s_phone = raw_sheet.getRange(i,8).getValue();
      var s_email = raw_sheet.getRange(i,9).getValue();
      var age = raw_sheet.getRange(i,10).getValue();
      var gender = raw_sheet.getRange(i,12).getValue();
      var health_num = raw_sheet.getRange(i,11).getValue();
      
      var address = raw_sheet.getRange(i,13).getValue();
      var city = raw_sheet.getRange(i,14).getValue();
      var province = raw_sheet.getRange(i,15).getValue();
      var country = raw_sheet.getRange(i,16).getValue();
      var postal_code = raw_sheet.getRange(i,17).getValue();
      var health_concerns = raw_sheet.getRange(i,18).getValue();
      var diet = raw_sheet.getRange(i,19).getValue();
      
      var p_name = raw_sheet.getRange(i,20).getValue();
      var p_relation = raw_sheet.getRange(i,21).getValue();
      var p_email = raw_sheet.getRange(i,22).getValue();
      var p_phone = raw_sheet.getRange(i,23).getValue();
      
      var school = raw_sheet.getRange(i,24).getValue();
      var school_city = raw_sheet.getRange(i,25).getValue();
      var school_province = raw_sheet.getRange(i,26).getValue();
      var school_country = raw_sheet.getRange(i,27).getValue();
      var grade = raw_sheet.getRange(i,28).getValue();
      
      var prime_name = raw_sheet.getRange(i,29).getValue();
      var prime_relation = raw_sheet.getRange(i,30).getValue();
      var prime_phone = raw_sheet.getRange(i,31).getValue();
      var prime_phone_type = raw_sheet.getRange(i,32).getValue();
      var prime_alt_phone = raw_sheet.getRange(i,33).getValue();
      var prime_alt_phone_type = raw_sheet.getRange(i,34).getValue();
      
      var second_name = raw_sheet.getRange(i,35).getValue();
      var second_relation = raw_sheet.getRange(i,36).getValue();
      var second_phone = raw_sheet.getRange(i,37).getValue();
      var second_phone_type = raw_sheet.getRange(i,38).getValue();
      var second_alt_phone = raw_sheet.getRange(i,39).getValue();
      var second_alt_phone_type = raw_sheet.getRange(i,40).getValue();
      
      var shoutout = raw_sheet.getRange(i,41).getValue();
      
      //copies info from input db to master db
      db_sheet.getRange(reg_last_row, 1).setValue(f_name);
      db_sheet.getRange(reg_last_row, 2).setValue(pref_name);
      db_sheet.getRange(reg_last_row, 3).setValue(l_name);
      db_sheet.getRange(reg_last_row, 4).setValue(week);
      db_sheet.getRange(reg_last_row, 5).setValue(bus);
      db_sheet.getRange(reg_last_row, 6).setValue(hear_about_sunia);
      
      db_sheet.getRange(reg_last_row, 7).setValue(s_phone);
      db_sheet.getRange(reg_last_row, 8).setValue(s_email);
      db_sheet.getRange(reg_last_row, 9).setValue(age);
      db_sheet.getRange(reg_last_row, 10).setValue(gender); //address
      db_sheet.getRange(reg_last_row, 11).setValue(address); //city
      db_sheet.getRange(reg_last_row, 12).setValue(city); //province
      db_sheet.getRange(reg_last_row, 13).setValue(province); //country
      db_sheet.getRange(reg_last_row, 14).setValue(country); //postcal code
      db_sheet.getRange(reg_last_row, 15).setValue(postal_code); //country
      db_sheet.getRange(reg_last_row, 16).setValue(health_num); //health con
      db_sheet.getRange(reg_last_row, 17).setValue(health_concerns);
      db_sheet.getRange(reg_last_row, 18).setValue(diet);
      
      db_sheet.getRange(reg_last_row, 19).setValue(p_name);
      db_sheet.getRange(reg_last_row, 20).setValue(p_relation);
      db_sheet.getRange(reg_last_row, 21).setValue(p_email);
      db_sheet.getRange(reg_last_row, 22).setValue(p_phone);
      
      db_sheet.getRange(reg_last_row, 23).setValue(school);
      db_sheet.getRange(reg_last_row, 24).setValue(school_city);
      db_sheet.getRange(reg_last_row, 25).setValue(school_province);
      db_sheet.getRange(reg_last_row, 26).setValue(school_country);
      db_sheet.getRange(reg_last_row, 27).setValue(grade);
      
      db_sheet.getRange(reg_last_row, 28).setValue(prime_name);
      db_sheet.getRange(reg_last_row, 29).setValue(prime_relation);
      db_sheet.getRange(reg_last_row, 30).setValue(prime_phone);
      db_sheet.getRange(reg_last_row, 31).setValue(prime_phone_type);
      db_sheet.getRange(reg_last_row, 32).setValue(prime_alt_phone);
      db_sheet.getRange(reg_last_row, 33).setValue(prime_alt_phone_type);
      
      db_sheet.getRange(reg_last_row, 34).setValue(second_name);
      db_sheet.getRange(reg_last_row, 35).setValue(second_relation);
      db_sheet.getRange(reg_last_row, 36).setValue(second_phone);
      db_sheet.getRange(reg_last_row, 37).setValue(second_phone_type);
      db_sheet.getRange(reg_last_row, 38).setValue(second_alt_phone);
      db_sheet.getRange(reg_last_row, 39).setValue(second_alt_phone_type);
      
      db_sheet.getRange(reg_last_row, 40).setValue(date_registered);
      
      db_sheet.getRange(reg_last_row, 41).setValue(shoutout);
      
      raw_sheet.getRange(i,40).setValue("Yes");
      
      //Obtain Overview Data
      
      var regs_total = overview_sheet.getRange(2,2).getValue();          
      
      var wa_regs = overview_sheet.getRange(11,2).getValue();
      var wb_regs = overview_sheet.getRange(12,2).getValue();
      
      var drops = overview_sheet.getRange(4,2).getValue();
      var drops_p = (overview_sheet.getRange(5,2).getValue()* 100).toFixed(2) + "%";
      
      var total_attending = overview_sheet.getRange(14,2).getValue();
      
      //Create Messages
      var admin_message = "100101010 (Another registrant has arrived.)\n\n\nWeek A Attending: " + wa_regs + "\nWeek B Attending: " + wb_regs + "\nDrops Total: " + drops + "\nDrops Percentage: " + drops_p + "\nTotal Attending: " + total_attending + "\n\nName: " + pref_name + " " + l_name + "\nWeek: " + week + "\nAge: " + age + "\nCity: " + city + "\nProvince: " + province + "\nCountry: " + country + "\n\nSchool: " + school + "\nSchool City: " + school_city + "\nSchool Province: " + school_province + "\nGrade: " + grade + "\nHow Did You Hear About Us: " + hear_about_sunia + "\n\nLets face it, comedy's a dead art form. Now tragedy! Ha ha ha, that's funny!\n\nBender";
      var reg_message = "100101010 (Another registrant has arrived.)\n\n\nWeek A Attending: " + wa_regs + "\nWeek B Attending: " + wb_regs + "\nDrops Total: " + drops + "\nDrops Percentage: " + drops_p + "\nTotal Attending: " + total_attending + "\n\nFirst Name: " + f_name + "\nPreferred Name: " + pref_name + "\nLast Name: " + l_name + "\n\nWeek: " +  week + "\nTaking Bus: " + bus + "\nHow did you hear about SUNIA: " + hear_about_sunia + "\n\nStudent Phone: " + s_phone + "\nStudent Email: " + s_email + "\nAge: " + age + "\nGender: " + gender + "\nAddress: " + address + "\nCity: " + city + "\nProvince: " + province + "\nCountry: " + country + "\nPostal Code: " + postal_code + "\nHealth Number: " + health_num + "\nHealth Conditions: " + health_concerns + "\nDietary Restrictions: " + diet + "\n\nSchool: " + school + "\nSchool City: " + school_city + "\nSchool Province: " + school_province + "\nGrade: " + grade + "\n\nParent Name: " + p_name + "\nRelation to Student: " + p_relation + "\nParent Email: " + p_email + "\nParent Phone: " + p_phone + "\n\nPrimary Emergency Contact: " + prime_name + "\nRelation to Student: " + prime_relation + "\nPrimary Phone: " + prime_phone + " (" + prime_phone_type +")\nSecondary Phone: " + prime_alt_phone + " (" + prime_alt_phone_type +")\n\nSecondary Emergency Contact: " + second_name + "\nRelation to Student: " + second_relation + "\nPrimary Phone: " + second_phone + " (" + second_phone_type +")\nSecondary Phone: " + second_alt_phone + " (" + second_alt_phone_type + ")\n\nI failed at my life-long dream again. How can I be so bad at everything I try, and still be so great?\n\nBender";
      
      // todo: update this set of links using new Slack app (should be named Bender).
      var url_adminstaff = "https://hooks.slack.com/services/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";
      var url_test = "https://hooks.slack.com/services/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";
      var url_reg = "https://hooks.slack.com/services/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";
      var url_regops = "https://hooks.slack.com/services/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";
      
      // todo: add quotes
      var bender_quotes = ["I’m so embarrassed. I wish everybody else was dead.","My story is a lot like yours, only more interesting ‘cause it involves robots.","This is the worst kind of discrimination there is: the kind against me!","Bite my shiny metal ass!","I'm going to build my own theme park! With Blackjack! And hookers!"];
      
      
      // Create Slack payloads 
      
      var admin_payload = {
        "channel" : "#admin-staff", // <-- optional parameter, use if you want to override default channel
        "text" : admin_message, // <-- required parameter
      }
      
      var reg_payload = {
        "channel" : "#reg-ops", // <-- optional parameter, use if you want to override default channel
        "text" : reg_message, // <-- required parameter
      }
      
      //testing
      var test_payload = {
      "channel" : "#testing", // <-- optional parameter, use if you want to override default channel
      "text" : reg_message, // <-- required parameter
      }

      //Send Slack payloads (helper code at bottom of file)
      
      //sendToSlack_(url_adminstaff, admin_payload);
      //sendToSlack_(url_regops, reg_payload);
      //sendToSlack_(url_test, test_payload);
      
      // Create registrant object for email
      
      var registrant = {
        f_name: f_name, 
        pref_name: pref_name,
        l_name: l_name,
        week: week,
        bus: bus,
        s_phone: s_phone,
        s_email: s_email,
        age: age,
        gender: gender,
        health_num: health_num,
        address: address,
        city: city,
        province: province,
        country: country,
        postal_code: postal_code,
        health_concerns: health_concerns,
        diet: diet,
        p_name: p_name,
        p_relation: p_relation,
        p_email: p_email,
        p_phone: p_phone,
        school: school,
        school_city: school_city,
        school_province: school_province,
        school_country: school_country,
        grade: grade,
        prime_name: prime_name,
        prime_relation: prime_relation,
        prime_phone: prime_phone,
        prime_phone_type: prime_phone_type,
        prime_alt_phone: prime_alt_phone,
        prime_alt_phone_type: prime_alt_phone_type,
        second_name: second_name,
        second_relation: second_relation,
        second_phone: second_phone,
        second_phone_type: second_phone_type,
        second_alt_phone: second_alt_phone,
        second_alt_phone_type: second_alt_phone_type,
      };
      
      if (p_email != ""){
        try {
          var ptemplate = HtmlService.createTemplateFromFile('parent_init');
          ptemplate.p_name = p_name;
          ptemplate.registrant = registrant;
          var phtmlBody = ptemplate.evaluate().getContent();
          
          //send mail to parent
          MailApp.sendEmail({
          to: p_email,
          subject: "SUNIA 2020: Next Steps in Your Child's Registration!",
          htmlBody: phtmlBody,
          });
           
          Logger.log(p_name + " was contacted!");
          
        }
        catch (e){
          Logger.log("error with parent email");
          Logger.log(e);
          var error_payload = {
            "text" : pref_name + " " + l_name + "'s parent's email contains an error",
          }
          //sendToSlack_(url_regops, error_payload);
        }
      }
      
      if (s_email != ""){
        try {
          var stemplate = HtmlService.createTemplateFromFile('student_init'); 
          stemplate.s_name = f_name;
          stemplate.registrant = registrant;
          var shtmlBody = stemplate.evaluate().getContent();
          
          //send mail to student
          MailApp.sendEmail({
          to: s_email,
          subject: "SUNIA 2020: Next Steps in Your Registration!",
          htmlBody: shtmlBody,
          });
           
          Logger.log(f_name + " was contacted!");
        }
        catch (e){
          Logger.log(e);
          Logger.log("error with student email");
          var error_payload = {
            "text" : pref_name + " " + l_name + "'s email contains an error", // <-- required parameter
          }
          //sendToSlack_(url_regops, error_payload);
        }
      }
      
      
      
    }
  }
}

function sendToSlack_(url,payload) {
  var options =  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  return UrlFetchApp.fetch(url, options)
}
