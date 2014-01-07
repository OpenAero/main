chrome.app.runtime.onLaunched.addListener(function(launchData) {
  if (!launchData.url) {
    var match = false;
  } else {
    var match = launchData.url.toString().match(/\?(sequence|s)=.+/);
  }
  if (match) {
    chrome.app.window.create('index.html' + match[0], {
      'id':'OpenAero',
      'bounds':{
        'width': 960,
        'height': 720
      }
    });
  } else {
    chrome.app.window.create('index.html', {
      'id':'OpenAero',
      'bounds':{
        'width': 960,
        'height': 720
      }
    });
  }
});
