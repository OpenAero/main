// This is the service worker with the Cache-first network

const CACHE = "pwabuilder-precache-OpenAero";
const precacheFiles = [
'changelog.txt',
'cordova.js',
'css/desktop.css',
'css/desktop-largeMobile.css',
'css/general.css',
'css/MaterialIcons-Regular.ttf',
'css/mobile.css',
'css/smallMobile.css',
'doc/aresti_system.html',
'doc/aresti_system_de.html',
'doc/CIVA-Free-Known-Programme-Guidance-Glider-Aircraft.html',
'doc/CIVA-Free-Known-Programme-Guidance-Glider-Aircraft-2024-v1.png',
'doc/CIVA-Free-Known-Programme-Guidance-Power-Aircraft.html',
'doc/CIVA-Free-Known-Programme-Guidance-Power-Aircraft-2024-v1.png',
'doc/gpl_files/combo.css',
'doc/gpl_files/gplv3-127x51.png',
'doc/gpl_files/layout.css',
'doc/gpl_files/mini.css',
'doc/gpl_files/print.css',
'doc/gpl.htm',
'doc/language.html',
'doc/language_de.html',
'doc/manual.html',
'doc/manual_de.html',
'doc/privacy.html',
'img/blue_handles.png',
'img/ee_ext-figure.png',
'img/favicons/favicon114.png',
'img/favicons/favicon128.png',
'img/favicons/favicon16.png',
'img/favicons/favicon195.png',
'img/favicons/favicon24.png',
'img/favicons/favicon32.png',
'img/favicons/favicon57.png',
'img/favicons/favicon72.png',
'img/favicons/favicon96in128.png',
'img/favicons/favicon96.png',
    'img/fullrolls.png',
'img/fudesignerPhone.png',
'img/google-play-badge.png',
'img/hesrolls.png',
'img/ios-appstore-badge.svg',
'img/magnifier.svg',
'img/microsoft-badge.svg',
'img/multirolls.png',
'img/OA_FigureAddPanel.png',
'img/OA_FigureGrid.gif',
'img/OA_FigureGroup.png',
'img/OA_FigureInfoPanel.png',
    'img/OA_FigureSelection.png',
    'img/OA_FlyingMode.png',
'img/OA_FreeUnknownDesignerMain.png',
'img/OA_GridInfo.png',
'img/OA_ReorderFigures.png',
'img/PilotCard.svg',
'img/pwa-badge.png',
'img/sequence_info.png',
'img/snaprolls.png',
'img/spinrolls.png',
'index.html',
'js/config.js',
'js/docs.js',
'js/figures23.js',
'js/jszip.min.js',
'js/languages/en.js',
'js/languages/de.js',
'js/languages/fr.js',
'js/library.js',
'js/logo.js',
    'js/main.js',
'js/qrcode.min.js',
'js/rules/rules15-ga.js',
'js/rules/rules24-sac.js',
'js/rules/rules23.js',
'js/rules/rules22-baea.js',
'js/rules/rules24-france.js',
'js/rules/rules23-aac.js',
'js/rules/rules23-iac.js',
'js/rules/rules23-imac.js',
'js/rules/rules24-glider-iac.js',
'js/rules/rules24-civa.js',
'js/rules/rules24-glider-civa.js',
'js/rules/rules25-nzac.js',
'js/rules/rules20-saa.js',
'js/rules/rules23-vink.js',
'js/rules/rules22-aeci.js',
'js/rulesWorker.js',
'js/vkbeautify.min.js',
'manifest.json',
'manifest.webmanifest',
'pwabuilder-sw.js'
];

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  console.log("[PWA Builder] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("[PWA Builder] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) { 
    if (event.request.method !== "GET") return;

    // Never cache PHP
  if (/\.php/.test(event.request.url)) return;

  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));
            return response;
          })
          .catch(function (error) {
            console.log("[PWA Builder] Network request failed and no cache." + error);
          });
      }
    )
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
    return caches.open(CACHE).then(function (cache) {
      return cache.put(request, response);
  });
}
