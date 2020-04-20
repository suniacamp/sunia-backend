function test_message() {
  
  var me = Session.getActiveUser().getEmail();
  var aliases = GmailApp.getAliases();
  var email = aliases[0];
  
  var student_info = "First name: Michael " + "<br/>" + "Last name: DeMarco" + "\n\n\n\n\n" + "Test";
  
  var template = HtmlService.createTemplateFromFile('script');
  template.student_info = student_info;  
  var htmlBody = template.evaluate().getContent();
  
  MailApp.sendEmail({
    to: "michaelfromyeg@gmail.com",
    subject: "SUNIA 2019",
    htmlBody: htmlBody,
  });
  
}