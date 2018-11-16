var checkKarma = function() {
  // Setup and open API
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.reddit.com/api/me.json", true);
  xhr.onreadystatechange = function() {

    if (xhr.readyState == 4) {
      // Parse text for use
      var redditdata = JSON.parse(xhr.responseText);
      if (redditdata.data.comment_karma && redditdata.data.link_karma) {

        // Check if user wants to use Comment or Link Karma
        if (displaySetting == true){
            usekarma = redditdata.data.comment_karma;
        }
        else {
            usekarma = redditdata.data.link_karma;
        }


        // Display changes depending on Karma number
        if (usekarma <= 999){
          // Show karma as is
          chrome.browserAction.setBadgeText({ text: usekarma + "" });
        }
        else if (usekarma > 999 && usekarma < 10000){
          // Show x.yk karma where x is some thousand and y is some hundred.
          chrome.browserAction.setBadgeText({ text: usekarma =
            ((usekarma - (usekarma % 100)) / 1000) + "k" });
        }
        else if (usekarma >= 10000 && usekarma < 1000000){
          // Show xk where x is some number of thousands.
          chrome.browserAction.setBadgeText({ text:
            ((usekarma - (usekarma % 1000)) / 1000) + "k" });
        }
        else {
          // Show x.ym where x is some million and y is some hundred thousand.
          chrome.browserAction.setBadgeText({ text: usekarma =
            ((usekarma - (usekarma % 100000)) / 1000000) + "m" });
        }

      } else {
        // Issue with connection
        chrome.browserAction.setBadgeText("???")
      }

    } else {
      // Loading 'icon'
      chrome.browserAction.setBadgeText({ text: "~" });
    }
  };
  xhr.send();
};

// Load number when new page is opened.
chrome.browserAction.setBadgeBackgroundColor({color: '#276795'});
var displaySetting = true;
checkKarma();

// Check every 30 seconds
setInterval(checkKarma, 30000);

// On Click change display settings between karma types
chrome.browserAction.onClicked.addListener(function(tab) {
  displaySetting = !displaySetting;
  checkKarma();
});
