chrome.app.runtime.onLaunched.addListener(function(launchData) {
  if (!launchData.url) {
    var match = false;
  } else {
    var match = launchData.url.toString().match(/\?(sequence|s)=.+/);
  }
  if (match) {
    chrome.app.window.create('index.html' + match[0], {
    }, function(win){
      win.maximize();
    });
  } else {
    chrome.app.window.create('index.html', {
    }, function(win){
      win.maximize();
    });
  }
});
