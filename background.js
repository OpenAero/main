chrome.app.runtime.onLaunched.addListener(function(launchData) {
  
  function onWindowCreated(win) {
    appWin = win;
    // add listener for bound changes
    appWin.onBoundsChanged.addListener(onBoundsChanged);
  }
  
  function onBoundsChanged() {
    chrome.storage.local.set({'bounds':appWin.getBounds()});
  }

  if (!launchData.url) {
    var match = false;
  } else {
    var match = launchData.url.toString().match(/\?(sequence|s)=.+/);
  }
  // get bounds from localStorage and create window
  chrome.storage.local.get ('bounds',
    function(bounds) {
      // set default bounds if no bounds stored
      if (!bounds) bounds = {'bounds':{'width': 960, 'height': 720}};
      if (match) {
        chrome.app.window.create('index.html' + match[0], 
          bounds,
          onWindowCreated
        );
      } else {
        chrome.app.window.create('index.html', 
          bounds,
          onWindowCreated
        );
      }
    }
  );
});
