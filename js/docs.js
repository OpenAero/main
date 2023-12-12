/* docs.js

This file is part of OpenAero.

OpenAero was originally designed by Ringo Massa and built upon ideas
of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

OpenAero is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

OpenAero is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.
*/

document.addEventListener("DOMContentLoaded", load, false);

function load () {
	
    // Temporary fix (HACK!) to load appropriate German help windows
	const settings = JSON.parse(localStorage.getItem('settings'));
	if (settings && settings.language == 'de') {
		var page = location.href.split("/").slice(-1)[0].split('#');
		if (['aresti_system.html','language.html','manual.html'].indexOf(page[0]) >= 0) {
			window.location = page[0].replace(/\.html$/, '_de.html') +
				(page[1] ? `#${page[1]}` : '');
		}
	}

	// append class to HTML element when in a frame
	document.documentElement.classList.add (window.self == window.top ? "top" : "framed");
	// do not display nodes with class noUWP on UWP
	if (window.Windows) {
		document.getElementsByClassName ('noUWP').forEach(el => { el.classList.add ('noDisplay') });
    }
    // do not display nodes with class noIOS on IOS
    if (/i(Pad|Phone|Pod)/i.test(navigator.userAgent)) {
        document.getElementsByClassName('noIOS').forEach(el => { el.classList.add('noDisplay')});
    }
    //fixAnchors();
}

// This is the service worker with the Cache-first network

// Check compatibility for the browser we're running this in
if ("serviceWorker" in navigator) {
	// Register the service worker, unless running from local file
	if (window.location.protocol !== 'file:') {
    navigator.serviceWorker
      .register("pwabuilder-sw.js", {
        scope: "./"
      })
      .then(function (reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
      });
	}
}


// fixAnchors fixes anchor handling as they do not work well in Cordova
// iframe
function fixAnchors () {
	//if (typeof cordova === 'undefined') return;
	
	// get page URI and split anchor if applicable
	var page = location.href.split("/").slice(-1)[0].split('#');
	var regex = new RegExp ('^' + page[0] + '#');

	// jump to anchor if included in URI
	if (page[1]) {
		document.documentElement.scrollTop = 
			document.getElementById (page[1]).offsetTop;
	}
	
	// add handlers for anchors
	var a = document.getElementsByTagName ('A');
	for (var i = 0; i < a.length; i++) {
		if (regex.test(a[i].href.split("/").slice(-1))) {
			a[i].addEventListener ('click', function (e) {
				document.documentElement.scrollTop = 
					document.getElementById (this.href.match (/#(.*)$/)[1]).offsetTop;
				e.preventDefault();
			});
		}
	}
}
