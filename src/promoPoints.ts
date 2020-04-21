// IF YOU ARE READING HTIS IN ON THE WEB EDITOR, DO NOT EDIT DIRECTLY, EDIT THE TYPESCRIPT SOURCE
// visit https://github.com/suniacamp to see the repositories

// Provides Slack an update with current promo point standings

export {}; // prevent global scope

function promoPoints() {
  Logger.log("Sending promo point update...");

  const promoPointsSource = PropertiesService.getScriptProperties().getProperty(
    "promoPointsSource"
  );
  const promoPointsSheet = SpreadsheetApp.openById(promoPointsSource);
  const totalSheet = promoPointsSheet.getSheetByName("TOTALS");

  const totalStaff: number = totalSheet.getLastRow();

  let xOffset = 2;
  let yOffset = 3;

  let message = "Promo Point Standings for the Week of " + new Date() + "\n";

  for (let i = yOffset; i < totalStaff; i++) {
    let name = totalSheet.getRange(i, xOffset).getValue();
    let points = totalSheet.getRange(i, xOffset + 1).getValue();
    message += name + ": " + points + "\n";
  }

  try { 
    sendPointsMessage(message);
  } catch (error) {
      Logger.log(error + "\nexiting the function as a result");
      return;
  }

  Logger.log("Done!");
}

// Send the point message to Slack by grabbing web hook URL and creating payloads
function sendPointsMessage(message: string) {
  let slackWebhook = PropertiesService.getScriptProperties().getProperty(
    "slackTestingWebhook"
  );

  let testingPayload = {
    channel: "#testing",
    text: message,
  };

  let promoPayload = {
    channel: "#promo",
    text: message,
  };

  sendToSlack(slackWebhook, testingPayload);
  // sendToSlack(slackWebhook, promoPayload);
}

// Slack boilerplate
function sendToSlack(url: string, payload: object) {
    let options: Object = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    };
    UrlFetchApp.fetch(url, options);
}
