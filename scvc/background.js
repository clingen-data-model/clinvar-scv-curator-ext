const API_KEY = 'AIzaSyADs3YruA9LTaRjc7hS94SQvKbQXJSpMp0';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Create a rule that will show the page action when the conditions are met.
const kMatchRule = {
  // Declare the rule conditions.
  conditions: [new chrome.declarativeContent.PageStateMatcher({
    pageUrl: {hostEquals: 'www.ncbi.nlm.nih.gov',
              pathContains: 'variation'}})],
  // Shows the page action when the condition is met.
  actions: [new chrome.declarativeContent.ShowPageAction()]
}

// Register the runtime.onInstalled event listener.
chrome.runtime.onInstalled.addListener(function() {
  // Overrride the rules to replace them with kMatchRule.
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([kMatchRule]);
  });
});

function onGAPILoad() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
  }, function(error) {
    console.log('error', error)
  });
}

// Listen for messages from popup.js
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {

    // verify that the request contains data, otherwise do not write.
    if (!request.scv) return false;

    // Get the users email
    chrome.identity.getProfileUserInfo(function(userinfo){
      request.user_email=userinfo.email;
    });

    // Get the token
    chrome.identity.getAuthToken({interactive: true}, function(token) {

      // Set scvc auth token
      gapi.auth.setToken({
        'access_token': token,
      });

      const body = {values: [[
        request.vcv,
        request.name,
        request.scv,
        request.submitter,
        request.interp,
        request.action,
        request.reason,
        request.notes,
        new Date(), // Timestamp
        request.submitter_id,
        request.variation_id,
        request.user_email,
        request.override_field,
        request.override_value
      ]]};

      // Append values to the spreadsheet
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: request.spreadsheet,
        range: request.sheet,
        valueInputOption: 'USER_ENTERED',
        resource: body
      }).then((response) => {
        // On success
        console.log(`${response.result.updates.updatedCells} cells appended.`)
        sendResponse({success: true});
      });
    })

    // Wait for response
    return true;
  }
);
