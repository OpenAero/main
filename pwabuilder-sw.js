// This is the service worker with the Cache-first network

const CACHE = "pwabuilder-precache-OpenAero";
const precacheFiles = [
'changelog.txt',
'cordova.js',
'assets/css/desktop.css',
'assets/css/desktop-largeMobile.css',
'assets/css/general.css',
'assets/css/MaterialIcons-Regular.ttf',
'assets/css/mobile.css',
'assets/css/smallMobile.css',
'doc/aresti_system.html',
'doc/aresti_system_de.html',
'doc/CIVA-Free-Known-Programme-Guidance-Glider-Aircraft.html',
'doc/CIVA-Free-Known-Programme-Guidance-Glider-Aircraft-2025-v1.png',
'doc/CIVA-Free-Known-Programme-Guidance-Power-Aircraft.html',
'doc/CIVA-Free-Known-Programme-Guidance-Power-Aircraft-2025-v1.png',
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
'assets/images/blue_handles.png',
'assets/images/ee_ext-figure.png',
'assets/images/favicons/favicon114.png',
'assets/images/favicons/favicon128.png',
'assets/images/favicons/favicon16.png',
'assets/images/favicons/favicon195.png',
'assets/images/favicons/favicon24.png',
'assets/images/favicons/favicon32.png',
'assets/images/favicons/favicon57.png',
'assets/images/favicons/favicon72.png',
'assets/images/favicons/favicon96in128.png',
'assets/images/favicons/favicon96.png',
    'assets/images/fullrolls.png',
'assets/images/fudesignerPhone.png',
'assets/images/google-play-badge.png',
'assets/images/hesrolls.png',
'assets/images/ios-appstore-badge.svg',
'assets/images/magnifier.svg',
'assets/images/microsoft-badge.svg',
'assets/images/multirolls.png',
'assets/images/OA_FigureAddPanel.png',
'assets/images/OA_FigureGrid.gif',
'assets/images/OA_FigureGroup.png',
'assets/images/OA_FigureInfoPanel.png',
    'assets/images/OA_FigureSelection.png',
    'assets/images/OA_FlyingMode.png',
'assets/images/OA_FreeUnknownDesignerMain.png',
'assets/images/OA_GridInfo.png',
'assets/images/OA_ReorderFigures.png',
'assets/images/PilotCard.svg',
'assets/images/pwa-badge.png',
'assets/images/sequence_info.png',
'assets/images/single_inverted_spin_on_rp.svg',
'assets/images/single_spin.svg',
'assets/images/snaprolls.png',
'assets/images/spinrolls.png',
'index.html',
'js/config.js',
'js/docs.js',
'data/figures/figures.js',
'js/jszip.min.js',
'components/languages/en.js',
'components/languages/de.js',
'components/languages/fr.js',
'data/library.js',
'data/logo.js',
    'js/main.js',
'js/qrcode.min.js',
'data/rules/rules.js', // This must be at the top of rules files!
'data/rules/rules-ga.js',
'data/rules/rules-sac.js',
'data/rules/rules-baea.js',
'data/rules/rules-france.js',
'data/rules/rules-aac.js',
'data/rules/rules-iac.js',
'data/rules/rules-imac.js',
'data/rules/rules-glider-iac.js',
'data/rules/rules-civa.js',
'data/rules/rules-glider-civa.js',
'data/rules/rules-nzac.js',
'data/rules/rules-saa.js',
'data/rules/rules-vink.js',
'data/rules/rules-aeci.js',
'js/rulesWorker.js',
'js/vkbeautify.min.js',
'manifest.json',
'manifest.webmanifest',
'pwabuilder-sw.js',
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
