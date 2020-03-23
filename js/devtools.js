chrome.browserAction.onClicked.addListener(function() {
  // open or focus options page.
  const optionsUrl = chrome.runtime.getURL("popup.html");
  chrome.tabs.query({}, function(extensionTabs) {
      let found = false;
      for (let i = 0, len = extensionTabs.length; i < len; i++) {
          if (optionsUrl === extensionTabs[i].url) {
              found = true;
              chrome.tabs.update(extensionTabs[i].id, {selected: true});
              break;
          }
      }
      if (found === false) {
          chrome.tabs.create({url: optionsUrl});
      }
  });
});