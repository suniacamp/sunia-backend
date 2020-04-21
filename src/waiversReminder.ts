// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

export {}; // prevent global scope

// Sends parents update to fill out their waivers, along with some other helpful reminders
function waivers() {
  Logger.log("Sending weekly waivers update...");

  // registrar@sunia.ca should be the one executing the script, so that the email sends from the current reg
  // configure this by making sure the trigger for this script is under registrar@sunia.ca
  const me = Session.getActiveUser().getEmail();
  const aliases = GmailApp.getAliases();
  const email = aliases[0];

  if (email != "registrar@sunia.ca") {
    Logger.log(
      "The email wasn't send from registrar@sunia.ca... it was sent from " +
        email
    );
  }
  Logger.log("Done!");
}
