// OpenAero.js 1.4.3.1
// This file is part of OpenAero.

//  OpenAero was originally designed by Ringo Massa and built upon ideas
//  of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

//  OpenAero is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.
    
// **************************************************************
// *
// *           BASE VARIABLES
// *
// **************************************************************

// Define window objects for saving files
if (!window.BlobBuilder && window.WebKitBlobBuilder) window.BlobBuilder = window.WebKitBlobBuilder;
if (!window.requestFileSystem && window.webkitRequestFileSystem) window.requestFileSystem = window.webkitRequestFileSystem;
var savefile = [];
// interval id
var intervalID = [];
// event handlers
var myEvents = [];
// svg Name Space
var svgNS = "http://www.w3.org/2000/svg";
// xlink Name Space for including image in svg
var xlinkNS = "http://www.w3.org/1999/xlink";

var True_Drawing_Angle;
// set y axis offset to the default
var yAxisOffset = yAxisOffsetDefault;
// Attitude goes from 0 to 359
// 0 = upright LTR, 45 = 45 up LTR, 90 = vertical up belly right etc
var Attitude = 0;
// Direction goes from 0 to 359 and indicates the direction the aircraft
// would have if it was pulled to level flight. It is combined with Attitude
// to define overall direction allowing integers for all whole degrees
// 0 = LTR, 90 = front to back, 180 = RTL, 270 = back to front. But when
// Attitude is inverted directions are reversed!
var Direction = 0;
// NegLoad indicates whether the current vertical has a negative load
// 0 = positive, 1 = negative
var NegLoad = 0;
// goRight determines in which direction a vertical 1/4 roll to the
// X axis will go. True = right (=upwind on form B), false = left
var goRight = true;
// goFront determines direction for 1/4 roll to Y axis
var goFront = true;
// updateAxisDir determines if it should be updated in changeAtt
var updateAxisDir = true;
// X is x position on canvas
var X = 0;
// Y is y position on canvas
var Y = 0;
// Scale is the current scaling factor
// 1 = default, .5 is 50%, 2 is 200%
var scale = 1;
// activeForm holds the currently displayed form
// activeForm == 'C' is true when form C is drawn. It is used in various
// functions to ensure exact mirroring
var activeForm = 'B';
// activeSequence holds the current sequence string, separate figures,
// XML string with all sequence info, undo, redo and filename
var activeSequence = {'text': '',
                      'figures': [],
                      'xml': null,
                      'undo': [],
                      'redo': [],
                      'addUndo': true
                      };
// sequenceSaved is true when the current sequence has been saved. It
// starts out true as we start with an empty sequence
var sequenceSaved = true;
// sequenceText will hold the sequence_text input field object
var sequenceText;
// sportingClass will hold the class select object
var sportingClass;
// fileName will hold the fileName input field
var fileName;
// figureK holds the current total figureK
var figureK = 0;
// userText global
var userText = [];
// fileList is used for operations that involve multiple files
var fileList = [];

// figures is an object that will hold all figure data of the sequence
// format is: figures[i].xxx where:
// i is the figure nr (including drawing only figs)
// xxx is a specific element, being: 
// .aresti     for the Aresti nrs of the figure
// .bBox       for the bounding rectangle
// .comments   comments set before the figure by "xxx"
// .connector  true for connector figures
// .draggable  boolean to indicate if draggable or not
// .entryAxis  for the start axis (X or Y) of the figure
// .figNr      for the base figure index in fig[]
// .k          for the K factors of the figure
// .paths      for all the drawing paths
// .rollInfo   roll information
// .seqNr      number in sequence
// .startPos   for the starting position
// .string     as in sequence text line
// .unknownFigureLetter = letter for Free Unknown figures
var figures = [];

// firstFigure is true when the figure is the first of the (sub)sequence
var firstFigure = true;
// connectors holds the number of connector figures in the sequence
var connectors = 0;
// unknownFigureLetter holds the letter assigned to the upcoming figure
var unknownFigureLetter = false;
// Tau is 2 times PI. Saves calculations during runtime
var Tau = Math.PI * 2;
// degToRad is Pi / 180. Saves calculations for degree to rad conversions
var degToRad = Math.PI / 180;
// Get ellipse perameters for perspective drawing
var perspective_param = getEllipseParameters(yAxisOffsetDefault,yAxisScaleFactor);
// logoImg holds the active logo image
var logoImg = false;
// figureStart holds the start positions (x,y) of all figures
var figureStart = [];
// selectFigure holds variables for the currently selected figure
var selectedFigure = {'id':null};
// SVGRoot is the sequence SVG object
var SVGRoot = null;
// These variables are used for dragging and dropping
var TrueCoords = null;
var GrabPoint = null;
var DragTarget = null;
// confirmFunction is used as a function reference of confirm dialog
var confirmFunction;

// mobileBrowser is true when OpenAero is run on a mobile browser
var mobileBrowser = false;

// browserString identifies the browser
var browserString = '';

// storage is true when localStorage is enabled (checked by doOnLoad)
// start with true to activate the check
var storage = true;

// loadComplete is true when doOnLoad has completed
var loadComplete = false;

// multi is used for keeping track of multiple sequence check globals
// processing : true when one of multiple sequences is processed
// total      : total number 
// count      : current number
// savedSeq   : sequence active before starting multi check
var multi = {'processing':false, 'total':0, 'count':0, 'savedSeq':''};

// variables for OLAN Humpty Bump check. Remove in 2015 with associated
// code in : OpenAero.js config.js index.html
var OLANBumpBugCheck = false;
var OLANBumpBugFigs = [];
var OLANNBugFigs = [];
// variables for automatic conversion of roll directions in OLAN files
var OLANSequence = false;
var inFigureXSwitchFig = Infinity;

// seqCheckAvail indicates if sequence checking is available for a rule/cat/seq combination
var seqCheckAvail = [];
// variables used for checking sequence validity
var checkConv = [];        // conversions
var checkAllowRegex = [];  // regexes for allowed figures
var checkAllowCatId = [];  // Catalogue Numbers for allowed figures
var checkCatGroup = [];
var checkFigGroup = [];
var checkRule = [];
var figCheckLine = [];
var defRules = [];
var rulesActive = false;   // Are rules active?
var infoCheck = [];        // Seq info fields to be filled out when saving or printing
var figureLetters = '';    // Letters that can be assigned to individual figures
var ruleSuperFamily = [];  // Array of rules for determining figure SF
var ruleSeqCheck = [];     // rules for checking complete OpenAero seq string

// fig will hold all figures in the catalog in the form
// fig[i].xxx where xxx is:
// .base    : the pattern for each figure as it's written in the sequence,
//            with + and - but without any rolls
// .aresti  : the Aresti number for each figure 
// .rolls   : shows which roll positions are possible for each figure
// .kpwrd   : the powered K factor for each figure
// .kglide  : the glider K factor for each figure
// .draw    : the drawing instructions for each figure
// .group   : to which group every figure belongs
var fig = [];

// figBaseLookup holds the same data as fig.base, but with the base as
// key and corresponding figure(s) as an array for fast lookup
var figBaseLookup = [];
// figGroup holds the figure group data
var figGroup = [];
// rollBase holds the base for each roll (roll, snap, spin) element
var rollBase = [];
// rollAresti is the Aresti number for each roll
var rollAresti = [];
// rollKPwrd is the K factor for each roll for Powered
var rollKPwrd = [];
// rollKGlider is the K factor for each roll for gliders
var rollKGlider = [];
// alertMsgs will hold any alerts about figures and the sequence
var alertMsgs = [];

/************************************************
 * 
 * HTML5 DOM functions
 * 
 ************************************************/
 
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
 
/*global self, document, DOMException */
 
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
 
if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {
 
(function (view) {
 
"use strict";
 
if (!('HTMLElement' in view) && !('Element' in view)) return;
 
var
      classListProp = "classList"
    , protoProp = "prototype"
    , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
    , objCtr = Object
    , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
    , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
              i = 0
            , len = this.length
        ;
        for (; i < len; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    }
    // Vendors: please allow content code to instantiate DOMExceptions
    , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
    }
    , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
            throw new DOMEx(
                  "SYNTAX_ERR"
                , "An invalid or illegal string was specified"
            );
        }
        if (/\s/.test(token)) {
            throw new DOMEx(
                  "INVALID_CHARACTER_ERR"
                , "String contains an invalid character"
            );
        }
        return arrIndexOf.call(classList, token);
    }
    , ClassList = function (elem) {
        var
              trimmedClasses = strTrim.call(elem.className)
            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
            , i = 0
            , len = classes.length
        ;
        for (; i < len; i++) {
            this.push(classes[i]);
        }
        this._updateClassName = function () {
            elem.className = this.toString();
        };
    }
    , classListProto = ClassList[protoProp] = []
    , classListGetter = function () {
        return new ClassList(this);
    }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
    return this[i] || null;
};
classListProto.contains = function (token) {
    token += "";
    return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
    var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
    ;
    do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
        }
    }
    while (++i < l);
 
    if (updated) {
        this._updateClassName();
    }
};
classListProto.remove = function () {
    var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
    ;
    do {
        token = tokens[i] + "";
        var index = checkTokenAndGetIndex(this, token);
        if (index !== -1) {
            this.splice(index, 1);
            updated = true;
        }
    }
    while (++i < l);
 
    if (updated) {
        this._updateClassName();
    }
};
classListProto.toggle = function (token, forse) {
    token += "";
 
    var
          result = this.contains(token)
        , method = result ?
            forse !== true && "remove"
        :
            forse !== false && "add"
    ;
 
    if (method) {
        this[method](token);
    }
 
    return result;
};
classListProto.toString = function () {
    return this.join(" ");
};
 
if (objCtr.defineProperty) {
    var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
    };
    try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
    }
} else if (objCtr[protoProp].__defineGetter__) {
    elemCtrProto.__defineGetter__(classListProp, classListGetter);
}
 
}(self));
 
}
// * End classlist.js

// add getElementsByClassName for older browsers
if(!document.getElementsByClassName) {
  document.getElementsByClassName = function(className) {
    return this.querySelectorAll("." + className);
  };
}
  
// encode_utf8 returns a string that can be correctly used by btoa
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

// decode_utf8 returns a string that can be correctly used by atob
function decode_utf8( s ) {
  return decodeURIComponent(escape(s));
}

// **************************************************************
// *
// *           FUNCTIONS
// *
// **************************************************************

/************************************************
 * User interface functions
 ************************************************/
 
// switchMobile switches between mobile and desktop layout
function switchMobile () {
  mobileBrowser = !mobileBrowser;
  // select no figure
  if (selectedFigure.id !== null) selectFigure (false);
  // get viewport meta element
  var viewport = document.getElementById('viewport');
  // load CSS depending on mobile or desktop version
  var link = document.getElementById('mobileDesktopCSS');
  var setMobileMenu = document.getElementById('t_setMobile');
  var tab = document.getElementById('tab-svgContainer');
  var svg = document.getElementById('svgContainer');
  if (mobileBrowser) {
    // set view to device width
    viewport.setAttribute('content', 'width=device-width');
    // set view to width 320
//    viewport.setAttribute('content', 'width=320, initial-scale=1.0, ' +
//      'maximum-scale=2.0, minimum-scale=1.0');
    // set mobile css
    link.setAttribute('href', 'mobile.css');
    // update Sequence main menu link
    document.getElementById('t_sequence').innerHTML = userText.sequenceShort;
    // update view menu
    setMobileMenu.innerHTML = userText.desktopVersion;
    // unhide sequence tab
    tab.removeAttribute('style');
    // hide sequence svg
    svg.setAttribute('style', 'position:absolute;z-index:-1;top:-5000px;');
    // remove any vertical displacement done by updateSequenceTextHeight
    document.getElementById('sequence_text').removeAttribute('style');
    document.getElementById('main').removeAttribute('style');
  } else {
    viewport.setAttribute('content', '');
    link.setAttribute('href', 'desktop.css');
    // update Sequence main menu link
    document.getElementById('t_sequence').innerHTML = userText.sequence;
    setMobileMenu.innerHTML = userText.mobileVersion;
    tab.setAttribute('style', 'display:none;');
    svg.removeAttribute('style');
    checkSequenceChanged();    
  }
  // set correct sequence text height
  updateSequenceTextHeight ();
  // set correctly sized plus min elements
  addPlusMinElements();
  // set undo/redo button size
  setUndoRedo ();
  // set entry/exit attitude elements
  setEntryExitElements ();
  // clear all figure chooser svg's
  for (var i = 0; i < fig.length; i++) {
    if (fig[i]) delete fig[i].svg;
  }
  // redraw sequence
  draw();
  // Activate the first figure selection group
  changeFigureGroup();
}    

// menuActive and menuInactive show and remove top menus on mouseover
function menuActive () {
  this.classList.add ('active');
}

function menuInactive (el) {
  if (el.classList) {
    el.classList.remove ('active');
  } else {
    this.classList.remove ('active');
  }
}

// rebuildSequence deletes and recreates the svg that holds the sequence
// SVGRoot is a global SVG object
function rebuildSequenceSvg () {
  var container = document.getElementById("svgContainer");
  while (container.childNodes.length > 0) {
    container.removeChild(container.lastChild);
  }
  SVGRoot = document.createElementNS(svgNS, "svg");
  SVGRoot.setAttribute("xmlns", svgNS) ;
  SVGRoot.setAttribute("xmlns:xlink", xlinkNS);
  SVGRoot.setAttribute("version", "1.2");
  SVGRoot.setAttribute("baseProfile", "tiny");
  SVGRoot.setAttribute("id", "sequenceSvg");
  SVGRoot.setAttribute("viewBox", "0 0 800 600");
  // enable figure selection and drag&drop on all forms except A
  if (activeForm != 'A') {
    SVGRoot.addEventListener ('mousedown', grabFigure, false);
    SVGRoot.addEventListener ('mousemove', Drag, false);
    SVGRoot.addEventListener ('mouseup', Drop, false);    
  }
  var group = document.createElementNS (svgNS, "g");
  group.setAttribute('id', 'sequence');
  
  // this will serve as the canvas over which items are dragged.
  //    having the drag events occur on the mousemove over a backdrop
  //    (instead of the dragged element) prevents the dragged element
  //    from being inadvertantly dropped when the mouse is moved rapidly
  /** REMOVED in 1.4.1 : CAUSES TROUBLE IN CHROME 32 */
  //group.innerHTML = "<rect id='BackDrop' x='0' y='0' width='100%' height='100%' fill='none' pointer-events='all' />";

  SVGRoot.appendChild(group);
  container.appendChild(SVGRoot);
  // selectFilter(SVGRoot);
  
  // these svg points hold x and y values...
  //    very handy, but they do not display on the screen (just so you know)
  TrueCoords = SVGRoot.createSVGPoint();
  GrabPoint = SVGRoot.createSVGPoint();
}

// prepareSvg clears a provided svg and prepares it for figure addition
function prepareSvg (svg) {
  while (svg.childNodes.length > 0) svg.removeChild(svg.lastChild);
  var group = document.createElementNS (svgNS, "g")
  group.setAttribute('id', 'sequence');
  svg.appendChild(group);
}

/** Dialogs and windows */

// infoBox creates a styled box without any options.
// html contains the HTML text. When false, the box is closed
function infoBox(html, title) {
  var div = document.getElementById('infoBox');
  if (html) {
    // show box
    div.classList.remove ('noDisplay');
    // Make the title
    document.getElementById('infoTitle').innerHTML = (title)? title : '';
    // Make the message
    document.getElementById('infoMessage').innerHTML = html;
  } else {
    div.classList.add ('noDisplay');
  }
}

// alertBox creates a styled alert box with a 'close' option
// html contains the HTML text. When false, the box is closed
function alertBox(html, title) {
  var div = document.getElementById('alertBox');
  if (html) {
    // show box
    div.classList.remove ('noDisplay');
    // Make the title
    document.getElementById('alertTitle').innerHTML = (title)? title : '';
    // Make the message
    document.getElementById('alertMessage').innerHTML = html;
  } else {
    div.classList.add ('noDisplay');
  }
}

// confirmBox creates a styled confirm box with 'yes' and 'no' options
// html contains the HTML text. When false, the box is closed
// f is a function to be executed after confirm
function confirmBox(html, title, f) {
  var div = document.getElementById('confirmBox');
  if (html) {
    // show box
    div.classList.remove ('noDisplay');
    // Make the title
    document.getElementById('confirmTitle').innerHTML = (title)? title : '';
    // Make the message
    document.getElementById('confirmMessage').innerHTML = html;
    confirmFunction = f;
  } else {
    div.classList.add ('noDisplay');
  }
}

// saveDialog shows or hides the save dialog
// when message is false, the dialog is closed
function saveDialog (message, name, ext) {
  if (message) {
    document.getElementById('saveDialog').classList.remove ('noDisplay');
    document.getElementById('saveFileMessage').innerHTML = message;
    document.getElementById('dlTextField').value = name;
    document.getElementById('fileExt').innerHTML = ext;
  } else {
    document.getElementById('saveDialog').classList.add ('noDisplay');
  }
}

// printDialog shows or hides the print dialog
// when false, the dialog is closed
function printDialog(show) {
  if (show) {
    missingInfoCheck(function(){

      document.getElementById('printDialog').classList.remove ('noDisplay');
  
      // by default, disable "Print Super Family"
      var el = document.getElementById('printSF');
      el.checked = false;
      // enable when rules with sf definition active
      if (rulesActive) {
        if (ruleSuperFamily.length) {
          el.checked = true;
        }
      }
    });
  } else {
    document.getElementById('printDialog').classList.add ('noDisplay');
  }
}

// printMultiDialog shows or hides the print multi dialog
// when false, the dialog is closed
function printMultiDialog(show) {
  var div = document.getElementById('printMulti');
  if (show) {
    div.classList.remove ('noDisplay');
  } else {
    div.classList.add ('noDisplay');
  }
}

// settingsDialog shows or hides the settings dialog
// when false, the dialog is closed
function settingsDialog() {
  var div = document.getElementById('settingsDialog');
  if (this.id === 't_settings') {
    div.classList.remove ('noDisplay');
  } else {
    div.classList.add ('noDisplay');
  }
}

// helpWindow will display a window with content from url and title
function helpWindow(url, title) {
  if (chromeApp.active) {
    chrome.app.window.create (url, {
      bounds: {
        width:800,
        height:600
      }
    }, function(w) {
      var win = w.contentWindow;
      win.onLoad = function() {
        win.document.title = title;
      };
    });
  } else {    
    var w = window.open(url, title, 'menubar=no, scrollbars=yes, status=no, toolbar=no, top=30, width=800');
    // set location again after 2 seconds to circumvent Chrome bug
    // regarding anchors later in html
    setTimeout(function(){
      w.location = url;
    }, 2000);
  }
}

// newWindow will display a window with content from body and title
// body can also be a function
function newWindow (body, title) {
  // handling is different for App and web
  if (chromeApp.active) {
    if (typeof body === "function") body = body();
    chrome.app.window.create ('window.html', {
      bounds: {
        width:800,
        height:600
      }
    }, function(w) {
      var win = w.contentWindow;
      win.onLoad = function() {
        win.document.title = title;
        win.document.body = body;
      };
    });
  } else {
    var w = window.open ('', title, 'width=800,height=600,top=50,' +
      'location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
    if (typeof body === "function") body = body();
    if (body) {
      // create data uri
      var uri = 'data:text/html;base64,' +
        btoa('<title>' + title + '</title>' +
        new XMLSerializer().serializeToString(body));
      // open the window with data uri for contents
      w.location.assign(uri);
    }
    w.focus();
  }
}
  
/** End dialogs and windows */

// Modern Combo Box  Script
// copyright Stephen Chapman, 18th October 2008
// you may copy this script provided that you retain the copyright notice
// you should not need to alter the below code

// fixme: replace by HTML5 combo function (<datalist>) when Safari supports

function combo(id,h,l) {
  var self = this; 
  self.h = h; 
  self.l = l; 
  self.inp = document.getElementById(id); 
  self.hasfocus = false; 
  self.sel = -1; 
  self.ul = self.inp.nextSibling; 
  while (self.ul.nodeType == 3) self.ul = self.ul.nextSibling; 
  self.ul.onmouseover = function() {self.ul.className = '';}; 
  self.ul.onmouseout = function() {self.ul.className = 'focused'; if (!self.hasfocus) self.ul.style.display = 'none';}; 
  self.list = self.ul.getElementsByTagName('li'); 
  for (var i=self.list.length - 1; i >= 0; i--) {
    self.list[i].onclick = function() {self.inp.value = this.firstChild.data;  self.rset(self);changeCombo(id);}
  } 
  self.inp.onfocus = function() {self.ul.style.display = 'block'; self.ul.className = 'focused'; self.hasfocus = true; self.sel = -1;}; 
  self.inp.onblur = function() {if(self.ul.className=='focused') {self.rset(self);} self.ul.className = ''; self.hasfocus = false;}; 
  self.inp.onkeyup = function(e) {var k = (e)? e.keyCode : event.keyCode; if (k == 40 || k == 13) {if (self.sel == self.list.length-1) {self.list[self.sel].style.backgroundColor = self.l; self.sel = -1;} if (self.sel > -1) self.list[self.sel].style.backgroundColor = self.l; self.inp.value = self.list[++self.sel].firstChild.data; self.list[self.sel].style.backgroundColor = self.h;} else if (k == 38 && self.sel > 0) {self.list[self.sel].style.backgroundColor = self.l; self.inp.value = self.list[--self.sel].firstChild.data; self.list[self.sel].style.backgroundColor = self.h;}changeCombo(id);return false;};
}
combo.prototype.rset = function(self) {self.ul.style.display = 'none'; self.sel = -1; for (var i=self.list.length - 1; i >= 0; i--) {self.list[i].style.backgroundColor = self.l;}return false;};

// selectTab allows us to select different tabbed pages
// 'e' is either the tab object or a tab id
function selectTab (e) {
  var li = (e.target)? e.target.parentNode : document.getElementById(e);
  var ul = li.parentNode;
  var list = ul.getElementsByTagName('li');
  for (var i = list.length - 1; i>=0; i--) {
    // only do something when the tab is not hidden
    if (list[i].getAttribute('style') != 'display:none;') {
      list[i].setAttribute('class', 'inactiveTab');
      // hide the tab by lowering z-index and setting top to -5000px
      // so any data is still accessible
      document.getElementById(list[i].id.replace('tab-', '')).setAttribute('style', 'position:absolute;z-index:-1;top:-5000px;')
    }
  }
  li.setAttribute('class', 'activeTab');
  document.getElementById(li.id.replace('tab-', '')).setAttribute('style', '')
}

// updateUserTexts updates all userText in the interface as indicated by
// <span class="userText" id="t_[key]"></span> or another HTML element,
// e.g. <a></a> or <div></div>
// where [key] is the key in userText, e.g. "addingFigure"
function updateUserTexts () {
  var language = lang[document.getElementById('language').value];
  // add a warning to the console for every missing key. Helps in
  // creating new translations
  for (var key in lang['en']) {
    if (!(key in language) && (key != 'en')) {
      console.log ('Key "' + key + '" missing in language "' +
        document.getElementById('language').value + '"');
    }
  }
  // put language values in userText
  for (var key in language) {
    userText[key] = language[key];
  }
  var id;
  var value;
  var els = document.getElementsByClassName('userText');
  for (var i = els.length - 1; i >= 0; i--) {
    id = els[i].id.replace (/^t_/, '');
    value = userText[id];
    if (!value) value = '';
    els[i].innerHTML = value;
  }
}

/************************************************
 * General functions
 ************************************************/

// roundTwo returns a number rounded to two decimal places.
// Use for all drawing functions to prevent rendering errors and keep
// SVG file size down
function roundTwo (nr) {
  return parseFloat(parseFloat(nr).toFixed(2));
}

// sanitizeSpaces does:
// transform tabs to spaces, multiple to single spaces and
// remove leading and trailing spaces (when noLT is false)
function sanitizeSpaces (line, noLT) {
  line = line.replace(/[\t]/g, ' ').replace(/\s\s+/g, ' ');
  if (!noLT) line = line.replace(/^\s/g,'').replace(/\s$/g,'');
  return line;
}

// getSuperFamily returns the superfamily for a category of the figure
// described by an array of Aresti numbers
function getSuperFamily (aresti, category) {
  var superFamily = [];
  // Set default Super Family. First check if a matching category is
  // active, otherwise use "advanced".
  category = category.toLowerCase();
  if (superFamilies[category]) {
    superFamily = superFamilies[category];
  } else {
    superFamily = superFamilies.advanced;
  }
  // set Super Family from rules
  if (rulesActive) {
    if (ruleSuperFamily.length) {
      superFamily = ruleSuperFamily;
    }
  }

  var returnValue = '';
  // Only search if superFamilies are defined for the category
  if (superFamily !== []) {
    for (var i = 0; i < superFamily.length; i++) {
      for (var j = 0; j < aresti.length; j++) {
        if (aresti[j].match(superFamily[i][0])) {
          returnValue = superFamily[i][1];
          break; // Break loop aresti
        }
      }
      if (returnValue) break; // Break loop superFamily
    }
  }
  return returnValue;
}

// dirAttToAngle creates an angle to draw from the values for direction
// and attitude.
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToAngle (dir, att) {
  while (dir < 0) dir += 360;
  while (dir >= 360) dir -= 360;
  // Create offset for the Y-axis, determined by yAxisOffset
  if (dir < 90) {
    var theta = (dir * (yAxisOffset / 90));
  } else if (dir < 180) {
    var theta = (dir - 90) * ((180 - yAxisOffset) / 90) + yAxisOffset;
  } else if (dir < 270) {
    var theta = (dir - 180) * (yAxisOffset / 90) + 180;
  } else {
    var theta = (dir - 270) * ((180 - yAxisOffset) / 90) + yAxisOffset + 180;
  }
  // No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    theta = ((theta < 90) || (theta > 270))? 0 : 180;
  }
// Check for right or left half, calculate angle and make negative for left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * degToRad;
    if (angle > Tau) {
      angle -= Tau;
    } else if (angle < 0) {
      angle += Tau;
    }
  } else {
    var angle = (theta - att) * degToRad;
    if (angle >= 0) {
      angle -= Tau;
    } else if (angle < -Tau) {
      angle += Tau;
    }
  }
  return angle;
}

// changeDir changes Direction global by value
// and checks it stays within 0-359
function changeDir (value) {
  Direction += value;
  while (Direction < 0) Direction += 360;
  while (Direction >= 360) Direction -= 360;
}

// changeAtt changes Attitude global by value
// and checks it stays within 0-359
function changeAtt (value) {
  Attitude += value;
  while (Attitude < 0) Attitude += 360;
  while (Attitude >= 360) Attitude -= 360;
  // update goRight for attitude changes. We monitor the exit direction
  // but also the direction through the top or bottom when ending vert.
  // Don't update this time when updateAxisDir is false, used for
  // double bumps
  if (updateAxisDir) {
    if (((Direction == 0) || (Direction == 180)) && (value != 0)) {
      goRight = (Direction == 0)? false : true;
      if ((Attitude > 90) && (Attitude < 270)) {
        goRight = !goRight;
      } else if ((Attitude == 90) || (Attitude == 270)) {
        if ((Attitude == 90) == (value < 0)) goRight = !goRight;
      }
    }
  } else {
    updateAxisDir = true;
  }
}

// changeRollFontSize will update the font size for rolls (e.g. 2x8)
function changeRollFontSize (s) {
  var regex = new RegExp('font-size:[ ]*' + rollFontSize + 'px;');
  rollFontSize = s;
  style.rollText = style.rollText.replace(regex,'font-size: ' + rollFontSize + 'px;');
}

// *******************************************************************************
// Define the low level shapes
// The function names are of the format makeXXX where XXX is the name to be called
// *******************************************************************************

// drawWind draws the wind arrow and text
// x and y represent the corner of the rectangle bounding the arrow at the top downwind side
// The return value is an array with the width and height of the bounding rectangle
function drawWind (x, y, sign, svgEl) {
  if (!svgEl) svgEl = SVGRoot.getElementById('sequence');
  var g = document.createElementNS (svgNS, 'g');
  g.setAttribute('id', 'windArrow');
  var path = document.createElementNS (svgNS, "path");
  pathNode = 'M' + x + ',' + (y + 6) + ' l ' + (-sign * 90) +
    ',0 l 0,-6 l ' + (-sign * 16) + ',16 l ' + (sign * 16) +
    ',16 l 0,-6 l ' + (sign * 90) + ',0 z';
  path.setAttribute ('d', pathNode);
  path.setAttribute ('style', style.windArrow);
  g.appendChild(path);
  var text = document.createElementNS (svgNS, "text");
  text.setAttribute('x', x - (sign * 10));
  text.setAttribute('y', y + 20);
  text.setAttribute('style', style.miniFormA);
  if (sign == 1) {
    text.setAttribute('text-anchor', 'end');
  } else text.setAttribute('text-anchor', 'start');
  if (iacForms) {
    var textNode = document.createTextNode(userText.windIAC);
  } else {
    var textNode = document.createTextNode(userText.wind);
  }
  text.appendChild(textNode);
  g.appendChild(text);
  svgEl.appendChild(g);
  return {'width':106, 'height':32};
}

// makeFigStart creates figure start marker
function makeFigStart (params) {
  var seqNr = params.seqNr;
  var first = params.first;
  
  var pathsArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  // Create a marker for possible automatic repositioning of the figure
  // start
  pathsArray.push({'figureStart': true});
  // Create the first figure mark if applicable
  var ref_rayon = 9;
  var open = Math.PI / 6;
  var rayon = ref_rayon;
  // draw numbers in circles when numberInCircle set AND seqNr present
  if (numberInCircle && seqNr && (activeForm != 'A')) {
    if (first && (activeForm !== 'Grid')) {
      rayon = ref_rayon + 4;
      var ax = roundTwo(rayon * Math.cos(angle - open));
      var ay = -roundTwo(rayon * Math.sin(angle - open));
      var Deltax = roundTwo(rayon * Math.cos(angle + open) - ax);
      var Deltay = roundTwo(-rayon * Math.sin(angle + open) - ay);
      pathsArray.push({'path': 'm ' + ax + ',' + ay + ' a' + rayon +
        ',' + rayon +' 0 1 1 ' + Deltax + ',' + Deltay, 'style':'pos'});
    }
    if (seqNr < 10) {
      // Add the figure number
      if (seqNr) pathsArray.push ({
        'text':seqNr,
        'style':'figNbr_09',
        'x':0,
        'y':5,
        'text-anchor':'middle'
      });
      rayon = ref_rayon;     
    } else {
      // Add the figure number
      pathsArray.push ({
        'text':seqNr,
        'style':'figNbr_10',
        'x':0,
        'y':5,
        'text-anchor':'middle'
      });
      rayon = ref_rayon + 1;   
    }
    // Make the marker
    pathsArray.push({
      'path': 'm ' + (-rayon) + ',0 a' + rayon + ',' + rayon + ' 0 1 1 0,0.01',
      'style':'pos',
      'dx':Math.cos(angle) * 9,
      'dy':- Math.sin(angle) * 9
    });
  } else {
    if (first && (activeForm !== 'A') && (activeForm !== 'Grid')) {
      pathsArray.push({'path': 'm 3,-6 a7,7 0 1 1 -6,0', 'style':'pos'});
    }
    // Add the figure number, except on Form A
    if (seqNr && (activeForm != 'A')) {
      pathsArray.push ({
        'text':seqNr,
        'style':'miniFormA',
        'x':0,
        'y':-8,
        'text-anchor':'middle'
      });
    }
    // Make the marker
    pathsArray.push({
      'path': 'm -4,0 a4,4 0 1 1 0,0.01',
      'style':'blackfill',
      'dx':Math.cos(angle) * 4,
      'dy':- Math.sin(angle) * 4
    });
  }
  return pathsArray;
}

// makeFigStop creates figure stop
function makeFigStop (lastFig) {
  var pathArray = [];
  var angle = (Direction + 90) * degToRad;
  var dx = roundTwo(Math.cos(angle) * lineElement / scale);
  var dy = - roundTwo(Math.sin(angle) * lineElement / scale);
  if (lastFig) {
    var angle2 = dirAttToAngle (Direction, Attitude);
    var dx2 = roundTwo(Math.cos(angle2) * lineElement);
    var dy2 = - roundTwo(Math.sin(angle2) * lineElement);
    pathArray['path'] = 'm ' + (dx2 + dx * 2) + ',' + (dy2 + dy * 2) +
      ' l ' + (-4 * dx) + ',' + (-4 * dy);
    pathArray['style'] = 'pos';
    pathArray['dx'] = dx2;
    pathArray['dy'] = dy2;
  } else {
    pathArray['path'] = 'l ' + dx + ',' + dy + ' l ' + (-2 * dx) +
      ',' + (-2 * dy);
    pathArray['style'] = 'pos';
    pathArray['dx'] = 0;
    pathArray['dy'] = 0;
  }
  return Array(pathArray);
}

// makeFigSpace creates space after figure
// scaling should not affect movement, so divide by scale
function makeFigSpace (extent) {
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = Math.cos(angle) * (lineElement / scale) * extent;
  var dy = - Math.sin(angle) * (lineElement / scale) * extent;
  pathArray['path'] = '';
  pathArray['style'] = 'neg';
  pathArray['dx'] = roundTwo(dx);
  pathArray['dy'] = roundTwo(dy);
  return Array(pathArray);
}

// makeVertSpace creates vertical space
// scaling should not affect movement, so divide by scale
function makeVertSpace (extent) {
  var pathArray = [];
  pathArray['path'] = '';
  pathArray['style'] = 'neg';
  pathArray['dx'] = 0;
  pathArray['dy'] = (lineElement / scale) * extent;
  return Array(pathArray);
}

// makeFigLast creates last figure stop
function makeFigLast () {
  var pathArray = new Array(2);
}

// makeLine creates lines
// Params:
// 0: line length
function makeLine (Params) {
  var Extent = Params[0];
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = roundTwo(Math.cos(angle) * lineElement * Extent);
  var dy = - roundTwo(Math.sin(angle) * lineElement * Extent);
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    dx = roundTwo(yAxisScaleFactor*dx);
    if ((Attitude == 90) || (Attitude == 270)) {
    } else {
      dy = roundTwo(yAxisScaleFactor*dy);
    }
    if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
      angle = angle - (yAxisOffset * degToRad);
      dx = roundTwo(scaleLine.x * Math.cos(angle) * lineElement * Extent);
      if (yAxisOffset > 90) {
        dy = roundTwo((-scaleLine.y * Math.cos(angle) + Math.sin(angle)) * lineElement * Extent);
      } else {
        dy = - roundTwo((scaleLine.y * Math.cos(angle) + Math.sin(angle)) * lineElement * Extent);
      }
      True_Drawing_Angle = Math.atan(-dy/dx);
      if (dx < 0) True_Drawing_Angle = True_Drawing_Angle + Math.PI;
    }
  } else True_Drawing_Angle = angle;
  pathArray.path = 'l ' + dx + ',' + dy;
  pathArray.style = (NegLoad == 0)? 'pos' : 'neg';
  pathArray.dx = dx;
  pathArray.dy = dy;
  return Array(pathArray);
}

// makeMove is similar to makeLine but only moves the pointer and
// creates no lines
function makeMove (Params) {
  var Extent = Params[0];
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = roundTwo(Math.cos(angle) * lineElement * Extent);
  var dy = - roundTwo(Math.sin(angle) * lineElement * Extent);
  pathArray.path = '';
  pathArray.style = '';
  pathArray.dx = dx;
  pathArray.dy = dy;
  return Array(pathArray);
}

// makeCorner creates sharp corners. Actually it only changes direction,
// no lines are created
function makeCorner (param) {
  // make sure param is an Integer
  param = parseInt (param);
  var Extent = Math.abs(param);
  var PullPush = (param >= 0)? 0 : 1;
  var pathArray = [];
  // changed in 1.4.3
  //changeAtt(Extent - (PullPush * 2 * Extent));
  changeAtt (param);
  pathArray.path = '';
  NegLoad = PullPush;
  pathArray.style = (NegLoad == 0)? 'pos' : 'neg';
  return Array(pathArray);
}

// getEllipseParameters gets the ellipse radius and orientation from
// the perspective angle and the Y axis scale factor
function getEllipseParameters(P_Angle,Y_Scale) {
  if ((P_Angle == 30) && (Y_Scale == 0.7)) {
    return {
      'x_radius': 0.559,
      'y_radius': 1.085,
      'rot_angle': 14.67,      
	    'H_x_radius': 1.184,
      'H_y_radius': 0.296,
      'H_rot_angle': -9.41
    };
  }
  if (Y_Scale == 1) {
    var V_orient = (90 - P_Angle) /2;
    var V_r_min = Math.sqrt(1 - Math.sin(P_Angle*degToRad)) ;
    var V_r_max = Math.sqrt(1 + Math.sin(P_Angle*degToRad)) ;
    var H_orient = - P_Angle /2;
    var H_r_min = Math.sqrt(1 - Math.sin((90-P_Angle)*degToRad)) ;
    var H_r_max = Math.sqrt(1 + Math.sin((90-P_Angle)*degToRad)) ;
    return {
      'x_radius': V_r_min,
      'y_radius': V_r_max,
      'rot_angle': V_orient,
	    'H_x_radius': H_r_max,
      'H_y_radius': H_r_min,
      'H_rot_angle': H_orient
    };
  }
  var A = Y_Scale * Math.cos(P_Angle*degToRad);
  var B = Y_Scale * Math.sin(P_Angle*degToRad);
  // Parameters for perspective of elements in the vertical plane
  // (loops or loop parts)
  var theta = (Math.PI + Math.atan(-2*B/(1 - Y_Scale * Y_Scale)))/2 ;
  var V_orient = roundTwo(90 - (180 * Math.atan((Math.sin(theta) +
    B*Math.cos(theta)) / (A*Math.cos(theta))) / Math.PI)) ;
  var V_r_max = roundTwo(Math.sqrt(Math.pow(A*Math.cos(theta),2) +
    Math.pow(Math.sin(theta) + B*Math.cos(theta),2)));
  theta = theta + Math.PI/2 ;
  var V_r_min = roundTwo(Math.sqrt(Math.pow(A*Math.cos(theta),2) +
    Math.pow(Math.sin(theta) + B*Math.cos(theta),2)));
  // Parameters for perspective of elements in the horizontal plane
  // (turns or rolling turns)
  theta = Math.atan(2*A/(1 - Y_Scale * Y_Scale))/2 ;
  var H_r_max = roundTwo(Math.sqrt(Math.pow(Math.cos(theta) +
    A*Math.sin(theta),2) + Math.pow(B*Math.sin(theta),2)));
  theta = theta + Math.PI/2 ;
  var H_r_min = roundTwo(Math.sqrt(Math.pow(Math.cos(theta) +
    A*Math.sin(theta),2) + Math.pow(B*Math.sin(theta),2)));
  var H_orient = roundTwo(-90 - 180 * Math.atan((B*Math.sin(theta)) /
    (Math.cos(theta) + A*Math.sin(theta))) / Math.PI);
// Returns both vertical and horizontal planes parameters
  return {
    'x_radius': V_r_min, 
    'y_radius': V_r_max,
    'rot_angle': V_orient ,
    'H_x_radius': H_r_max,
    'H_y_radius': H_r_min,
    'H_rot_angle': H_orient
  };
}

// dirAttToXYAngle modified from dirAttToAngle to just care about angle
// in a vertical "plan".
// dirAttToAngle creates an angle to draw from the values for direction
// and attitude
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToXYAngle (dir, att) {
  while (dir < 0) dir += 360;
  while (dir >= 360) dir -= 360;
  // Create offset for the Y-axis, determined by yAxisOffset
  var theta = (dir < 180)? 0 : 180;
  // No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    theta = ((theta < 90) || (theta > 270))? 0 : 180;
  }
  // Check for right or left half, calculate angle and make negative for
  // left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * degToRad;
    if (angle > Tau) {
      angle -= Tau;
    } else if (angle < 0) {
      angle += Tau;
    }
  } else {
    var angle = (theta - att) * degToRad;
    if (angle >= 0) {
      angle -= Tau;
    } else if (angle < -Tau) {
      angle += Tau;
    }
  }
  True_Drawing_Angle = angle;
  return angle;
}

// dirAttToGGAngle modified from dirAttToAngle to neutralize perspective
// angle adjustments.
// dirAttToAngle creates an angle to draw from the values for direction
// and attitude
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToGGAngle (dir, att) {
  while (dir < 0) dir += 360;
  while (dir >= 360) dir -= 360;
  // Don't create offset for the Y-axis related to yAxisOffset
  var theta = dir ;  // Modif GG : perspective neutralisation
  // No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    theta = ((theta < 90) || (theta > 270))? 0 : 180;
  }
  // Check for right or left half, calculate angle and make negative for
  // left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * degToRad;
    if (angle > Tau) {
      angle -= Tau;
    } else if (angle < 0) {
      angle += Tau;
    }
  } else {
    var angle = (theta - att) * degToRad;
    if (angle >= 0) {
      angle -= Tau;
    } else if (angle < -Tau) {
      angle += Tau;
    }
  }
  return angle;
}

// makeCurve creates curves of up to 359 degrees
// This is used for all looping shapes
// param is the angle in whole degrees
function makeCurve (param) {
  // Define some variables
  var pathArray = [];
  // make sure param is an Integer
  param = parseInt (param);
  var Extent = Math.abs(param);
  var PullPush = (param >= 0)? 0 : 1;
  NegLoad = PullPush;
  pathArray.style = (NegLoad == 0)? 'pos' : 'neg';
  var Radius = curveRadius;
  var longCurve = (Extent > 180)? 1 : 0;
  // Calculate at which angle the curve starts
  var radStart = dirAttToAngle (Direction, Attitude);
  var radStartXY = dirAttToXYAngle (Direction, Attitude);
  //  var start_Att = Attitude;
  // Change direction and make sure Attitude stays in [0,359]
  // changed in 1.4.3
  //if (PullPush == 0) changeAtt(Extent); else changeAtt(-Extent);
  changeAtt (param);
  
  // Calculate at which angle the curve stops
  var radStop = dirAttToAngle (Direction, Attitude);
  var radStopXY = dirAttToXYAngle (Direction, Attitude);
  // See if we are curving left or right, depending on radStart and PullPush
  var curveRight = (radStart >= 0)? 0 : 1;
  if (PullPush == 1) curveRight = 1 - curveRight;
  if (curveRight == 0) {
    var dx = (Math.sin(radStop) - Math.sin(radStart)) * Radius;
    var dy = (Math.cos(radStop) - Math.cos(radStart)) * Radius;
  } else {
    var dx = (Math.sin(radStop + Math.PI) - Math.sin(radStart + Math.PI)) * Radius;
    var dy = (Math.cos(radStop + Math.PI) - Math.cos(radStart + Math.PI)) * Radius;
  }
  var sweepFlag = curveRight;
  // Make the path and move the cursor
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    var curveRight = (radStartXY >= 0)? 0 : 1;
    if (PullPush == 1) curveRight = 1 - curveRight;
    dx = yAxisScaleFactor * ((Math.sin(radStopXY) - Math.sin(radStartXY))) * Radius;
    dy = (Math.cos(radStopXY) - Math.cos(radStartXY)) * Radius;
    if (curveRight == 1) {
      dx = -dx ;
      dy = -dy ;
    }
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.rot_angle : -perspective_param.rot_angle;
    var X_axis_Radius = perspective_param.x_radius * Radius;
    var Y_axis_Radius = perspective_param.y_radius * Radius;
    dy = dy - dx * Math.sin(yAxisOffset * degToRad);
    dx = dx * Math.cos(yAxisOffset * degToRad);
    pathArray['path'] = 'a' + roundTwo(X_axis_Radius) + ',' +
      roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' ' + longCurve +
      ' ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathArray['path'] = 'a' + Radius + ',' + Radius + ' 0 ' + longCurve +
      ' ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  }
  pathArray['dx'] = dx;
  pathArray['dy'] = dy;
  return Array(pathArray);
}

// makeRollTopLine creates the small lines around rolls in the top
function makeRollTopLine () {
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude + 90);
  var dx = roundTwo(Math.cos(angle) * lineElement075);
  var dy = - roundTwo(Math.sin(angle) * lineElement075);
  pathArray.path = 'l ' + dx + ',' + dy + ' l ' + (-2 * dx) +
    ',' + (-2 * dy);
  pathArray.style = 'pos';
  pathArray.dx = 0;
  pathArray.dy = 0;
  return Array(pathArray);
}

// #################################
// Code for making (rolling) turns
// This has to be changed in the future to improve the look of the code
// For now we keep it like this as it does work

// makeTurnArc creates arc segments for turns and rolling circles.
// Size is in DRAWN rads
function makeTurnArc (rad, startRad, stopRad, pathsArray) {
  while (startRad < 0) startRad += Tau;
  while (startRad >= Tau) startRad -= Tau;
  while (stopRad < 0) stopRad += Tau;
  while (stopRad >= Tau) stopRad -= Tau;

  var sign = (rad >= 0)? 1 : -1;
  
  if (!newTurnPerspective.checked) {
    // calculate where we are in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
    // as the atan function only produces angles between -PI/2 and PI/2 we
    // may have to correct for full ellipse range
    if ((startRad > Math.PI) && (startRad < Tau)) {
      radEllipse += Math.PI;
    }
    startX = Math.cos (radEllipse) * curveRadius;
    startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    // calculate where we go to in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
    if ((stopRad > Math.PI) && (stopRad < Tau)) {
      radEllipse += Math.PI;
    }
    stopX = Math.cos (radEllipse) * curveRadius;
    stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    dx = roundTwo(stopX - startX) * sign;
    dy = roundTwo(stopY - startY) * sign;
    sweepFlag = (rad > 0)? 0 : 1;
    longCurve = (Math.abs (rad) < Math.PI)? 0 : 1;
    if ((Attitude > 90) && (Attitude < 270)) {
      pathsArray.push({'path':'a ' + curveRadius + ',' +
        roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'neg', 'dx':dx,'dy':dy});
    } else {
      pathsArray.push({'path':'a ' + curveRadius + ',' +
        roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'pos', 'dx':dx,'dy':dy});
    }
  } else {
  // Modif GG Start
  // Always draw in perspactive (rolling) turns, no matter which is the value of curvePerspective
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.H_rot_angle : -perspective_param.H_rot_angle;
    var X_curveRadius = roundTwo(perspective_param.H_x_radius * curveRadius) ;
    var Y_curveRadius = roundTwo(perspective_param.H_y_radius * curveRadius) ;
    dy =  yAxisScaleFactor * (Math.cos(stopRad) - Math.cos(startRad)) ;
    dx =  roundTwo((Math.sin(stopRad) - Math.sin(startRad) - dy * Math.cos(yAxisOffset * degToRad)) * curveRadius) * sign;
    dy =  roundTwo(dy * Math.sin(yAxisOffset * degToRad) * curveRadius) * sign;
    sweepFlag = (rad > 0)? 0 : 1;
    longCurve = (Math.abs (rad) < Math.PI)? 0 : 1;
    if ((Attitude > 90) && (Attitude < 270)) {
      pathsArray.push({'path':'a ' + X_curveRadius + ',' +
        Y_curveRadius + ' ' + Rot_axe_Ellipse + ' ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'neg', 'dx':dx,'dy':dy});
    } else {
      pathsArray.push({'path':'a ' + X_curveRadius + ',' +
        Y_curveRadius + ' ' + Rot_axe_Ellipse + ' ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'pos', 'dx':dx,'dy':dy});
    }
  // Modif GG End
  }
  return pathsArray;
}

// makeTurnDots creates dotted arc segments for turns and rolling circles.
// Size is in DRAWN rads
function makeTurnDots (rad, startRad, stopRad, pathsArray) {
  while (startRad >= Tau) startRad = startRad - Tau;
  while (stopRad >= Tau) stopRad = stopRad - Tau;
    
  sign = (rad >= 0)? 1 : -1;
  if (!newTurnPerspective.checked) {
    // calculate where we are in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
    // as the atan function only produces angles between -PI/2 and PI/2
    // we may have to correct for full ellipse range
    if ((startRad > Math.PI) && (startRad < Tau)) {
      radEllipse += Math.PI;
    }
    startX = Math.cos (radEllipse) * curveRadius;
    startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    // calculate where we go to in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
    if ((stopRad > Math.PI) && (stopRad < Tau)) {
      radEllipse += Math.PI;
    }
    stopX = Math.cos (radEllipse) * curveRadius;
    stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    dx = (stopX - startX) * sign;
    dy = (stopY - startY) * sign;
    sweepFlag = (rad > 0)? 0 : 1;
    if (Math.abs (rad) < Math.PI) longCurve = 0; else longCurve = 1;
    pathsArray.push({'path':'a ' + curveRadius + ',' +
      roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
      sweepFlag + ' ' + dx + ',' + dy, 'style':'dotted'});
  } else {
    // Modif GG Start
    // Always draw in perspactive (rolling) turns, no matter which is the value of curvePerspective
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.H_rot_angle : -perspective_param.H_rot_angle;
    var X_curveRadius = roundTwo(perspective_param.H_x_radius * curveRadius) ;
    var Y_curveRadius = roundTwo(perspective_param.H_y_radius * curveRadius) ;
    dy =  yAxisScaleFactor * (Math.cos(stopRad) - Math.cos(startRad)) ;
    dx =  roundTwo((Math.sin(stopRad) - Math.sin(startRad) - dy * Math.cos(yAxisOffset * degToRad)) * curveRadius) * sign;
    dy =  roundTwo(dy * Math.sin(yAxisOffset * degToRad) * curveRadius) * sign;
    sweepFlag = (rad > 0)? 0 : 1;
    if (Math.abs (rad) < Math.PI) longCurve = 0; else longCurve = 1;
    pathsArray.push({'path':'a ' + X_curveRadius + ',' +
      Y_curveRadius + ' ' + Rot_axe_Ellipse + ' ' + longCurve + ' ' +
      sweepFlag + ' ' + dx + ',' + dy, 'style':'dotted'});
    // Modif GG End
  }
  return pathsArray;
}

// makeTurnRoll creates rolls in rolling turns. Basically a minimal version of makeRoll
// param is the amount of roll degrees
function makeTurnRoll (param, rad) {
  if (!!newTurnPerspective.checked) {
      // Modif GG Start (Define the size of the arrow and its tip)
    var arrow_tip_width = 5 ;
    var arrow_tip_length = Math.PI / 4.5 ;
    var arrow_length = Math.PI / 9 ;
    var turn_rollcurveRadius = rollcurveRadius * 2 ;
  // Modif GG End (Define the size of the arrow and its tip)
  }
  var pathsArray = [];
  var extent = Math.abs(param);
  var sign = param > 0 ? 1 : -1;
  var sweepFlag = param > 0 ? 1 : 0;
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  if (!newTurnPerspective.checked) {
    // Make the tip shape
    var radPoint = rad + sign * (Math.PI / 3.5);
    dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius);
    dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    var radPoint = rad + sign * (Math.PI / 6);
    dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    pathsArray.push ({'path':path, 'style':'blackfill'});
  
    // Calculate at which angle the curve starts and stops
    radPoint = (extent >= 360)? rad - sign * (Math.PI / 6) : rad;
    var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
    var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
    // Make the curved path
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' a ' +
      rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag +
      ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
  } else {
    // Modif GG Start
    var persp_Sin = Math.sin(yAxisOffset * degToRad);
    var persp_Cos = Math.cos(yAxisOffset * degToRad);
  // get ellipse parameters
    var rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.H_rot_angle : -perspective_param.H_rot_angle;
    var X_rollcurveRadius = roundTwo(perspective_param.H_x_radius * turn_rollcurveRadius) ;
    var Y_rollcurveRadius = roundTwo(perspective_param.H_y_radius * turn_rollcurveRadius) ;
    // Make the tip shape
    var radPoint = rad + sign * arrow_tip_length ;
    dxTip = ((Math.cos(radPoint) - radCos) * turn_rollcurveRadius);
    dyTip = -((Math.sin(radPoint) - radSin) * turn_rollcurveRadius);
    var el_dxTip = dxTip - yAxisScaleFactor * dyTip * persp_Cos ; 
    var el_dyTip = yAxisScaleFactor * dyTip * persp_Sin ; 
    path = 'm ' + roundTwo(el_dxTip) + ',' + roundTwo(el_dyTip) + ' ';
    var radPoint = rad + sign * arrow_length ;
    dx = (((Math.cos(radPoint) * (turn_rollcurveRadius + arrow_tip_width)) - (radCos * turn_rollcurveRadius))) - dxTip;
    dy = -(((Math.sin(radPoint) * (turn_rollcurveRadius + arrow_tip_width)) - (radSin * turn_rollcurveRadius))) - dyTip;
    var el_dx = dx - yAxisScaleFactor * dy * persp_Cos ; 
    var el_dy = yAxisScaleFactor * dy * persp_Sin ; 
    path = path + 'l ' + roundTwo(el_dx) + ',' + roundTwo(el_dy) + ' ';
    dx = (((Math.cos(radPoint) * (turn_rollcurveRadius - arrow_tip_width)) - (radCos * turn_rollcurveRadius))) - dx - dxTip;
    dy = -(((Math.sin(radPoint) * (turn_rollcurveRadius - arrow_tip_width)) - (radSin * turn_rollcurveRadius))) - dy - dyTip;
    el_dx = dx - yAxisScaleFactor * dy * persp_Cos ; 
    el_dy = yAxisScaleFactor * dy * persp_Sin ; 
    path = path + 'l ' + roundTwo(el_dx) + ',' + roundTwo(el_dy) + ' z';
    pathsArray.push ({'path':path, 'style':'blackfill'});
  
    // Calculate at which angle the curve starts and stops
    radPoint = (extent >= 360)? rad - sign * arrow_length : rad;
    var dx = (Math.cos(radPoint) - radCos) * turn_rollcurveRadius - dxTip;
    var dy = -(Math.sin(radPoint) - radSin) * turn_rollcurveRadius - dyTip;
    el_dx = dx - yAxisScaleFactor * dy * persp_Cos ; 
    el_dy = yAxisScaleFactor * dy * persp_Sin ; 
    // Make the curved path
    path = 'm ' + roundTwo(el_dxTip) + ',' + roundTwo(el_dyTip) + ' a ' +
      X_rollcurveRadius + ',' + Y_rollcurveRadius + ' ' + rot_axe_Ellipse + ' 0 ' + sweepFlag +
      ' ' + roundTwo(el_dx) + ',' + roundTwo(el_dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
  // Modif GG End
  }
  return pathsArray;
}

// makeTurn builds turns and rolling circles from the draw instructions
// parsed from fig[i].draw
function makeTurn (draw) {
  // parse base
  var pathsArray = [];
  // Check if we are in an in/out or out/in roll
  regex = /io|IO/;
  var switchRollDir = (regex.test(draw))? true : false;
  var sign = 1;
  var numbers = draw.replace(/[^\d]+/g, '');
  var extent = parseInt(numbers.charAt(0)) * 90;
  // Set the default exit direction
  if ((extent == 90) || (extent == 270)) {
    var dirChange = sign * extent;
    changeDir (dirChange);
    if ((Direction == 0) || (Direction == 180)) {
      // Set depending on goRight on X axis
      if ((((Direction == 0) == (Attitude == 0)) != goRight ) == (activeForm != 'C')) {
        sign = -sign;
        rollDir = -rollDir;
      }
    } else {
      // Set towards viewer on Y axis
      if (((Direction == 90) == (Attitude == 0)) == (activeForm != 'C')) {
        sign = -sign;
        rollDir = -rollDir;
      }
    }
    changeDir (-dirChange);
  } else {
    if ((Direction == 0) || (Direction == 180)) {
      // towards viewer X-to-X axis
      if (((Direction == 0) == (Attitude < 180)) == (activeForm != 'C')) {
        sign = -sign;
        rollDir = -rollDir;
      }
    } else {
      // according goRight Y-to-Y axis
      if ((((Direction == 90) == (Attitude == 0)) != goRight ) == (activeForm != 'C')) {
        sign = -sign;
        rollDir = -rollDir;
      }
    }
  }
  // Check if the exit direction is flipped
  if (draw.charAt(0) == userpat.moveforward) {
    var sign = -sign;
  }
  
  // See if we start with an outside roll
  regex = /J/;
  var rollDir = (regex.test(draw))? -sign : sign;
  // See if we start inverted, this will also flip the drawing direction
  if (Attitude == 180) rollDir = -rollDir;
  
  // use for wingover
  var newAttitude = Attitude;
  if (extent == 180) {
    newAttitude = 360 - Attitude;
    if (newAttitude == 360) newAttitude = 0;
  }

  // See if direction change is called for by the preparsed draw string
  if (newAttitude != Attitude) {
    // for wingover, HACK
    var stopRad = dirAttToXYAngle (Direction + (sign * extent), newAttitude);
    var startRad = dirAttToXYAngle (Direction, Attitude);
  } else {
    if (!newTurnPerspective.checked) {
      var stopRad = dirAttToAngle (Direction + (sign * extent), newAttitude);
      var startRad = dirAttToAngle (Direction, Attitude);
    } else {
      // Modif GG Start : dirAttToAngle -> dirAttToGGAngle
      var stopRad = dirAttToGGAngle (Direction + (sign * extent), newAttitude);
      var startRad = dirAttToGGAngle (Direction, Attitude);
      // Modif GG Stop
    }
  }
  if (stopRad < 0) stopRad += Tau;
  if (startRad < 0) startRad += Tau;
  startRadSave = startRad;
  var rad = sign * stopRad - sign * startRad;
  if (rad <= 0) rad += Tau;
  if (numbers.length > 1) {
    // rolling turns
    var steps = 0;
    var rolls = 0;
    for (var i = 1; i < numbers.length; i++) {
      if (numbers[i] == '5') {
        rolls += 0.5;
        steps++;
      } else {
        rolls += parseInt(numbers[i]);
        steps += parseInt(numbers[i]);
      }
    }
    var step = rad / steps;
    var halfStepSigned = sign * (step / 2);
    var rollPos = 1;
    for (var i = 0; i < rad; i = i + step) {
      pathsArray = makeTurnArc (halfStepSigned, startRad, startRad + halfStepSigned, pathsArray);
      startRad += halfStepSigned;
      if (numbers[rollPos] == '5') { 
        rollPaths = makeTurnRoll (180 * rollDir, startRad);
        changeDir (180);
        changeAtt (180);
        if (switchRollDir) rollDir = -rollDir;
      } else {
        rollPaths = makeTurnRoll (360 * rollDir, startRad);
        if (switchRollDir) rollDir = -rollDir;
      }
      for (var j = 0; j < rollPaths.length; j++) {
        pathsArray.push (rollPaths[j]);
      }
      pathsArray = makeTurnArc (halfStepSigned, startRad, startRad + halfStepSigned, pathsArray);
      startRad += halfStepSigned;
      rollPos++;
    }
    pathsArray = makeTurnDots (sign*(Tau - rad), stopRad, startRadSave, pathsArray);
    changeDir (sign * extent);
  } else {
    // regular turns
    if (extent != 360) {
      pathsArray = makeTurnArc (sign * rad, startRad, stopRad, pathsArray);
      pathsArray = makeTurnDots (sign * (Tau-rad), stopRad, startRad, pathsArray);
      // build turn extent text with degree sign in unicode
      // not always exactly centered: fixme: improve code
      if (!newTurnPerspective.checked) {
        var dx = -sign * (Math.sin (stopRad)) * curveRadius;
        var dy = -sign * (Math.cos (stopRad)) * curveRadius * flattenTurn;
      } else {
        // Modif GG Start 
        var X_curveRadius = roundTwo(perspective_param.H_x_radius * curveRadius) ;
        var Y_curveRadius = roundTwo(perspective_param.H_y_radius * curveRadius) ;
        var dx = -sign * (Math.sin (stopRad)) * X_curveRadius;
        var dy = -sign * (Math.cos (stopRad)) * Y_curveRadius + rollFontSize / 3;
        // Modif GG Stop
      }

      pathsArray.push ({
        'text':extent + "\u00B0",
        'style':'rollText',
        'x':dx,
        'y':dy,
        'text-anchor':'middle'
      });
      changeDir (sign * extent);
      // used for wingover
      Attitude = newAttitude;
    } else {
      pathsArray = makeTurnArc (sign * Math.PI, startRad, startRad + Math.PI, pathsArray);
      changeDir (180);
      pathsArray = makeTurnArc (sign * Math.PI, startRad + Math.PI, startRad, pathsArray);
      changeDir (180);
    }
  }
  return pathsArray;
}

// makeRollText is a helper function for makeRoll, makeSnap and makeSpin.
// It creates the text (2x8, 3/4 etc) and also comments next to rolls,
// snaps and spins.
// It returns the text as a pathArray, or false for no text
function makeRollText (extent, stops, sign, comment, radSin, radCos) {
  // don't flip text by default and start with empty comment text
  var flipText = false;
  var text = '';
  
  // check for roll comment
  if (comment) {
    // check for roll text flip
    if (comment[0] === userpat.flipNumber) {
      flipText = true;
      comment = comment.substring (1);
    }
    text = comment;
  }

  if ((parseInt(extent / 180) != (extent / 180)) || (stops > 0) || (text.length > 0)) {
    if (stops > 0) {
      if (text.length > 0) text = ' ' + text;
      if (extent != 360) text = 'x' + stops + text;
      text = (extent / (360 / stops)) + text;
    } else if ((parseInt(extent / 180) != (extent / 180))) {
      if (text.length > 0) text = ' ' + text;
      text = ((extent / 90) - (parseInt (extent / 360) * 4)) + '/4' + text;
    }
    if (flipText) {
      if (extent >= 360) { // make room for 'tail' of roll symbol
        dx = sign * (radSin * (rollcurveRadius + ((rollFontSize / 5) * text.length)));
        dy = sign * (radCos * (rollcurveRadius + rollFontSize / 2)) + (rollFontSize / 5) + 1;
      } else {             // no tail
        dx = sign * (radSin * (rollcurveRadius / 2 + ((rollFontSize / 5) * text.length)));
        dy = sign * (radCos * (rollcurveRadius / 2 + rollFontSize / 2)) + (rollFontSize / 5) + 1;
      }
    } else {
      if (extent > 360) { // make room for roll connect line
        dx = -sign * (radSin * (rollcurveRadius + 4 + ((rollFontSize / 4) * text.length)));
        dy = -sign * (radCos * (rollcurveRadius + 4 + rollFontSize / 3)) + (rollFontSize / 4) + 2;
      } else {
        dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 4) * text.length)));
        dy = -sign * (radCos * (rollcurveRadius + rollFontSize / 3)) + (rollFontSize / 4) + 2;
      }
    }
  }

  if (text != '') {
    return ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'});
  } else {
    return false;
  }
}

// makeRoll creates aileron rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of roll
// [1] is hesitations in fractions of full roll
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional glider slow roll argument, true = slow roll
// [4] is optional autocorrect roll argument, true = autocorrect roll
// [5] is optional comment
// Example: (270,4) would be a 3x4 roll
function makeRoll (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var sweepFlag = params[0] > 0 ? 1 : 0;
  if (params.length > 2) var rollTop = params[2];
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
    rad = True_Drawing_Angle;
  }
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  // distinguish for autocorrect rolls
  if (params[4]) {
    var style = ['corrfill', 'corr'];
    // draw circle around roll
    pathsArray.push({'path': 'm -' + (rollcurveRadius * 1.2) + ',0 a' +
      (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
      ' 0 1 1 0,0.01', 'style':style[1]});
  } else {
    var style = ['blackfill', 'pos'];
  }
  while (extent > 0) {
    // Make the tip shape
    var radPoint = rad + sign * (Math.PI / 3.5);
    dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius);
    dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    var radPoint = rad + sign * (Math.PI / 6);
    dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    pathsArray.push ({'path':path, 'style':style[0]});

    // Make the second tip for glider slow rolls
    if (params[3]) {
      var radPoint = rad + sign * (Math.PI / 2.5);
      dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius);
      dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
      var radPoint = rad + sign * (Math.PI / 3.5);
      dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
      dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
      dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
      pathsArray.push ({'path':path, 'style':style[0]});
    }
    
    // Calculate at which angle the curve starts and stops
    radPoint = (extent >= 360)? (rad - sign * (Math.PI / 6)) : rad;
    var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
    var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
    // Make the curved path
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' a ' +
      rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag +
      ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':style[1]});
        
    // Where necessary, show the roll numbers after completing the first
    // roll point and arc.
    // This is only necessary for rolls that are not multiples of 180 or
    // have hesitations
    // Also add any user defined comment here
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (extent, stops, sign, params[5], radSin, radCos);
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) roll. Continue for more than 360
    extent -= 360;
    // For more than 360 degrees, draw a line between the rolls and the roll tip connect line
    if (extent > 0) {
      // Make the line between the two rolls.
      // Only move the pointer (no line) for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', Array(1/scale, 0), pathsArray);
      } else {
        pathsArray = buildShape ('Line', Array(1/scale, 0), pathsArray);
      }
      // Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1].dx;
      dy = pathsArray[pathsArray.length - 1].dy;
      if (params[3]) {
        // glider slow roll
        var radPoint = rad + sign * (Math.PI / 2);
      } else {
        // regular roll
        var radPoint = rad + sign * (Math.PI / 3);
      }
      dxTip = (((Math.cos(radPoint) * (rollcurveRadius + 2)) - (radCos * rollcurveRadius)));
      dyTip = -(((Math.sin(radPoint) * (rollcurveRadius + 2)) - (radSin * rollcurveRadius)));
      if (params[3]) {
        // glider slow roll
        path = 'm ' + roundTwo(dxTip+dx/2) + ',' + roundTwo(dyTip+dy/2) +
          ' l ' + roundTwo(-dx*1.5) + ',' + roundTwo(-dy*1.5);
      } else {
        // regular roll
        path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
          roundTwo(-dx) + ',' + roundTwo(-dy);
      }
      pathsArray.push ({'path':path, 'style':style[1]});
    }
  }
  return pathsArray;
}

// makeSnap creates snap rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of snap
// [1] indicates pos or neg snap. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional comment
// Examples: (270,0) is a 3/4 pos snap. (180,1) is a 1/2 neg snap
function makeSnap (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
    rad = True_Drawing_Angle;
  }
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  if (params.length > 2) var rollTop = params[2];
  while (extent > 0) {
    // Make the base shape
    dxTip = -radSin * snapElement2 * sign;
    dyTip = -radCos * snapElement2 * sign;
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    dx = radCos * snapElement; 
    dy = -radSin * snapElement;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    if (extent >= 360) {
      dx = (radCos * snapElement12) + (radSin * snapElement3 * sign);
      dy = (- radSin * snapElement12) + (radCos * snapElement3 * sign);
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * snapElement24;
      dy = radSin * snapElement24;
    } else {
      dx = (radCos * snapElement) + (radSin * snapElement2 * sign);
      dy = (- radSin * snapElement) + (radCos * snapElement2 * sign);
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * snapElement2;
      dy = radSin * snapElement2;
    }
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    if (params[1] == 0) pathStyle = 'posfill'; else pathStyle = 'negfill';
    pathsArray.push ({
      'path':path,
      'style':pathStyle,
      'dx':radCos * snapElement075,
      'dy':-radSin * snapElement075
    });

    // Where necessary, show the roll numbers after completing the first roll point and arc.
    // This is only necessary for rolls that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (extent, 0, sign, params[3], radSin, radCos);
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) roll. Continue for more than 360
    extent = extent - 360;
    // For more than 360 degrees, draw a line between the rolls and the roll tip connect line
    if (extent > 0) {
      // Save the status of the load variable, don't want to change that during the roll
      var saveLoad = NegLoad;
      // Make the line between the two rolls
      // Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', Array(1.5/scale, 0), pathsArray);
      } else {
        pathsArray = buildShape ('Line', Array(1.5/scale, 0), pathsArray);
      }
      NegLoad = saveLoad;
      // Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1]['dx'] + radCos * snapElement2;
      dy = pathsArray[pathsArray.length - 1]['dy'] - radSin * snapElement2;
      dxTip = -radSin * snapElement24 * sign + radCos * snapElement;
      dyTip = -radCos * snapElement24 * sign - radSin * snapElement;
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
        roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
    }
  }
  return pathsArray;
}

// makeSpin creates spins
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of spin
// [1] indicates pos or neg spin. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional comment
// Examples: (270,0) is a 3/4 pos spin. (540,1) is a 1 1/2 neg spin
function makeSpin (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude);
  if (params.length > 2) var rollTop = params[2];
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  while (extent > 0) {
    // Make the base shape
    // First make the tip line
    dxTip = -radSin * spinElement2 * sign;
    dyTip = -radCos * spinElement2 * sign;
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    dx = radCos * spinElement;
    dy = -radSin * spinElement;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
    // Next make the triangle
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    if (extent >= 360) {
      dx = (radCos * spinElement * 1.5) + (radSin * spinElement3 * sign);
      dy = (- radSin * spinElement * 1.5) + (radCos * spinElement3 * sign);
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * spinElement * 1.5;
      dy = radSin * spinElement * 1.5;
    } else {
      dx = (radCos * spinElement) + (radSin * spinElement2 * sign);
      dy = (- radSin * spinElement) + (radCos * spinElement2 * sign);
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * spinElement;
      dy = radSin * spinElement;
    }
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    if (params[1] == 0) pathStyle = 'posfill'; else pathStyle = 'negfill';
    pathsArray.push ({
      'path':path,
      'style':pathStyle,
      'dx':radCos * spinElement,
      'dy':-radSin * spinElement
    });
    // Where necessary, show the roll numbers after completing the first roll point and arc.
    // This is only necessary for spins that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (extent, 0, sign, params[3], radSin, radCos);
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) spin. Continue for more than 360
    extent = extent - 360;
    // For more than 360 degrees, draw a line between the spins and the spin tip connect line
    if (extent > 0) {
      // Make the line between the two rolls. Always positive for now
      // Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', Array(0.5/scale, 0), pathsArray);
      } else {
        pathsArray = buildShape ('Line', Array(0.5/scale, 0), pathsArray);
      }
      // Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1].dx + radCos * spinElement2;
      dy = pathsArray[pathsArray.length - 1].dy - radSin * spinElement2;
      dxTip = -radSin * spinElement24 * sign + radCos * spinElement;
      dyTip = -radCos * spinElement24 * sign - radSin * spinElement;
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
        roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
    }
  }
  return pathsArray;
}

// makeHammer creates hammerhead tops
// extent is the size of the line before the hammerhead top.
// We will move that much down before continuing drawing
function makeHammer (extent) {
  pathArray = [];
  Attitude = 270;
  changeDir(180);
  pathArray['style'] = 'pos';
  if ((Direction == 90) || (Direction == 270)) {
    dy = roundTwo((1 - scaleLine.y) * lineElement);
    dx = roundTwo(scaleLine.x * lineElement);
    pathArray['path'] = "l " + (dx) + "," + (dy);
  } else {
    pathArray['path'] = "l " + (lineElement) + "," + (lineElement);
  }
  pathArray['dx'] = 0;
  pathArray['dy'] = lineElement * extent;
  return Array(pathArray);
}

// makeTailslide creates tailslide tops
// param gives the type as a string
function makeTailslide (param) {
  var pathsArray = new Array(Array(),Array());
  var sweepFlag = 1;
  NegLoad = 0;
  var angle = dirAttToAngle (Direction, Attitude);
  if (param == figpat.tailslidewheels) angle = -angle;
  if (angle > 0) sweepFlag = 1; else sweepFlag = 0;
  if (param == figpat.tailslidecanopy) {
    pathsArray[0]['style'] = 'pos';
  } else pathsArray[0]['style'] = 'neg';
  var Radius = curveRadius;
  if (angle > 0) dx = -Radius; else dx = Radius;
  dy = Radius;
  // Make the path and move the cursor
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.rot_angle : -perspective_param.rot_angle;
    var X_axis_Radius = perspective_param.x_radius * Radius;
    var Y_axis_Radius = perspective_param.y_radius * Radius;
    dx = dx * scaleLine.x;
    dy = dy - dx * scaleLine.y;
    if (yAxisOffset > 90) {
      dx = -dx;
    }
    pathsArray[0]['path'] = 'a' + roundTwo(X_axis_Radius) + ',' +
      roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' 0 ' +
      sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathsArray[0]['path'] = 'a' + Radius + ',' + Radius + ' 0 0 ' +
      sweepFlag + ' ' + dx + ',' + dy;
  }
  pathsArray[0].dx = dx;
  pathsArray[0].dy = dy;
  var Radius = (curveRadius) / 2;
  if (angle > 0) dx = Radius; else dx = -Radius;
  dy = Radius;
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.rot_angle : -perspective_param.rot_angle;
    var X_axis_Radius = perspective_param.x_radius * Radius;
    var Y_axis_Radius = perspective_param.y_radius * Radius;
    dx = dx * scaleLine.x;
    dy = dy - dx * scaleLine.y;
    if (yAxisOffset > 90) {
      dx = -dx;
    }
    pathsArray[1].path = 'a' + roundTwo(X_axis_Radius) + ',' +
      roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' 0 ' +
      sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathsArray[1].path = 'a' + Radius + ',' + Radius + ' 0 0 ' +
      sweepFlag + ' ' + dx + ',' + dy;
  }
  pathsArray[1].style = 'pos';
  pathsArray[1].dx = dx;
  pathsArray[1].dy = dy;
  Attitude = 270;
  return pathsArray;
}

// makePointTip creates pointed tops (non-Aresti)
// extent is the size of the line before the top.
// We will move that much down before continuing drawing
function makePointTip (extent) {
  pathArray = [];
  changeAtt(180);
  changeDir(180);
  pathArray['path'] = '';
  pathArray['style'] = 'pos';
  pathArray['dx'] = 0;
  pathArray['dy'] = lineElement * extent;
  return Array(pathArray);
}

// tspan creates an svg tspan with optional spacing to the next line 
function tspan (line, dy) {
  // when no dy supplied, set to 14
  dy = typeof dy !== 'undefined' ? dy : 14;
  // create span
  var span = document.createElementNS (svgNS, 'tspan');
  span.setAttribute('x', 0);
  span.setAttribute('dy', dy);
  span.appendChild(document.createTextNode(line));
  return span;
}

// makeTextBlock makes text blocks, for example from comments
function makeTextBlock (text) {
  var pathsArray = [];
  var rotate = false;
  var header = true;
  
  // handle special code for Unknown figure designation
  var regex = /^@[A-Z]/;
  var match = text.match(regex);
  if (match) {
    text = text.replace (match[0], '');
    unknownFigureLetter = match[0].replace('@', '');
  }
  // handle special code for Unknown connector
  var regex = /^connector$/;
  if (text.match(regex)) {
    text = '';
    unknownFigureLetter = 'L';
  }
  
  if (text != '') {
    // temporarily attach text to SVG root
    var t = SVGRoot.appendChild(document.createElementNS(svgNS, 'text'));
    t.style = style.textBlock;

    // Parse special characters
    // Not all OLAN special codes are supported yet. They will be
    // filtered out
    var lineNr = 0;
    var line = '';
    var header = true;
    var styleId = 'textBlockBorder';
    
    for (var i = 0; i < text.length; i++) {
      switch (text[i]) {
        // anywhere tags
        case ('\\'): // new line          
          t.appendChild (tspan(line));
          line = '';
          lineNr++;
          break;
        case ('#'): // aresti numbers and K
          break;
        case ('&'): // figure string
          break;
        // header only tags
        case ('_'): // put text block UNDER subsequent figure
        case ('~'): // put text block ABOVE subsequent figure
          if (header) {
            break;
          }
        case ('['): // make text block bold ( [ ) or red ( [[ )
          if (header) {
            styleId = 'textBlockBorderBold';
            if (text[i+1]) {
              if (text[i+1] === '[') {
                styleId = 'textBlockBorderBoldRed';
                i++;
              }
            }
            break;
          }
        case ('^'): // place block vertically
          if (header) {
            rotate = 90;
            break;
          }
        // no tag, add character
        default:
          line += text[i];
          header = false;
      }
    }

    t.appendChild (tspan(line));

    // determine final text block size
    var box = t.getBBox();
    // if the box will be rotated, swap w and h
    if (rotate) {
      var h = box.width;
      var w = box.height;
    } else {
      var w = box.width;
      var h = box.height;
    }

    // remove element from SVG root
    SVGRoot.removeChild(t);

    // calculate where the center of the box should be
    // rotation is taken into account
    // current angle = angle to box center
    var angle = dirAttToAngle (Direction, Attitude);
    // find distance from box edge to center in this direction
    var s = Math.sin (angle);
    var c = Math.cos (angle);
    if (s == 0) { // horizontal
      var d = w / 2;
    } else if (c == 0) { // vertical
      var d = h / 2;
    } else { // other, choose shortest
      var d = Math.abs ((w / 2) / c);
      var dv = Math.abs ((h / 2) / s);
      if (d > dv) {
        d = dv;
      }
    }
    
    // set top-left x and y of the text box
    var x = roundTwo ((c * d) - (w / 2));
    var y = - roundTwo ((s * d) + (h / 2));
    
    // set dx and dy for starting the figure after the text box
    var dx = roundTwo (2 * c * d);
    var dy = - roundTwo (2 * s * d);
    
    // draw rectangle around text
    pathsArray.push ({'path':'m ' + (x-3) + ',' + (y-3) + ' l ' + (w + 6) +
      ',0 l 0,' + (h + 6) + ' l' + -(w+6) + ',0 z', 'style':styleId});
      
    // when the text will be rotated, re-adjust x and y so the
    // un-rotated text will be in the right position before rotation
    if (rotate) {
      var x = roundTwo ((c * d) - (h / 2));
      var y = - roundTwo ((s * d) + (w / 2));
    }
    pathsArray.push ({'textBlock':t, 'x':x, 'y':y, 'dx':dx, 'dy':dy, 'r':rotate});
    
    // put space after block
    pathsArray.push (makeFigSpace(2)[0]);
  } else {
    pathsArray.push({'dx':0,'dy':0});
  }
  return pathsArray;
}

/**************************************************************************
 * Functions for creating and drawing complex shapes from the base shapes */

// draw a shape
function buildShape(shapeName, Params, paths) {
  // if the paths array was not provided, create an empty one
  if (!paths) var paths = [];
  // define the pathsArray by executing the correct makeShape function
  switch (shapeName) {
    case 'FigStart':
      var pathsArray = makeFigStart (Params);
      break;
    case 'FigStop':
      var pathsArray = makeFigStop (Params);
      break;
    case 'FigSpace':
      var pathsArray = makeFigSpace (Params);
      break;
    case 'VertSpace':
      var pathsArray = makeVertSpace (Params);
      break;
    case 'FigLast':
      var pathsArray = makeFigLast (Params);
      break;
    case 'Line':
      var pathsArray = makeLine (Params);
      break;
    case 'Move':
      var pathsArray = makeMove (Params);
      break;
    case 'Corner':
      var pathsArray = makeCorner (Params);
      break;
    case 'Curve':
      var pathsArray = makeCurve (Params);
      break;
    case 'RollTopLine':
      var pathsArray = makeRollTopLine (Params);
      break;
    case 'TurnRoll':
      var pathsArray = makeTurnRoll (Params);
      break;
    case 'Turn':
      var pathsArray = makeTurn (Params);
      break;
    case 'Roll':
      var pathsArray = makeRoll (Params);
      break;
    case 'Snap':
      var pathsArray = makeSnap (Params);
      break;
    case 'Spin':
      var pathsArray = makeSpin (Params);
      break;
    case 'Hammer':
      var pathsArray = makeHammer (Params);
      break;
    case 'Tailslide':
      var pathsArray = makeTailslide (Params);
      break;
    case 'PointTip':
      var pathsArray = makePointTip (Params);
      break;
    case 'TextBlock':
      var pathsArray = makeTextBlock (Params);
      break;
  }
  // walk through the returned paths
  for (var i = 0; i < pathsArray.length; i++) {
    paths.push (pathsArray[i]);
  }
  return paths;
}

// drawShape draws a shape from a pathArray
// selectFigure will be true if the figure to be drawn is one selected
// by hover
// prev, if provided, should hold the contents and bounding box of a
// previous text element to avoid.
function drawShape(pathArray, svgElement, prev) {
  var cur = false;
  if (!svgElement) svgElement = SVGRoot.getElementById('sequence');
  // decide if we are drawing a path or text or starting a figure
  if (pathArray.path) {
    var path = document.createElementNS (svgNS, "path");
    path.setAttribute('d', 'M ' + roundTwo(X) + ',' + roundTwo(Y) +
      ' ' + pathArray.path);
    path.setAttribute('style', style[pathArray.style]);
    // option for rotating paths. Not used yet but may become usefull
    // for fitting rolls and snaps to curve in top or bottom of loop
    if ('rotate' in pathArray) {
      path.setAttribute('transform', 'rotate(' + pathArray.rotate +
        ' ' + X + ' ' + Y + ')');
    }
    svgElement.appendChild(path);
  } else if (pathArray.text) {
    var text = document.createElementNS (svgNS, "text");
    text.setAttribute('x', roundTwo(X + pathArray.x));
    text.setAttribute('y', roundTwo(Y + pathArray.y));
    text.setAttribute('style', style[pathArray.style]);
    text.setAttribute('text-anchor', pathArray['text-anchor']);
    var textNode = document.createTextNode(pathArray.text);
    text.appendChild(textNode);
    svgElement.appendChild(text);
    
    // Following is used to check subsequent rolls for overlap and
    // apply corrections. We use two ellipses sized to fit the text BBox
    // to determine the correct distance.
    
    // If we are dealing with a rollText of 5 characters or less, create
    // cur. Longer texts are just too hard to separate consistently.
    if ((pathArray.text.length <= 5) && (pathArray.style == 'rollText')) {
      cur = text.getBBox();
      cur.t = text;
    }
    if (prev && cur) {
      // increase hor and decrease vert spacing
      var cx1 = parseFloat(cur.x + (cur.width / 2));
      var cy1 = parseFloat(cur.y + (cur.height / 2));
      var cx2 = parseFloat(prev.x + (prev.width / 2));
      var cy2 = parseFloat(prev.y + (prev.height / 2));
      // find the line between the centers of the ellipses
      var dx = parseFloat(cx2 - cx1);
      var dy = parseFloat(cy2 - cy1);
      var d = Math.sqrt(dx * dx + dy * dy);
      var cos = dx / d;
      var sin = dy / d;
      var rfCor = rollFontSize / 8;
      // find x and y on the ellipses in the direction of the line
      // connecting the centers
      var ex1 = cos * (cur.width / 2 + rfCor);
      var ey1 = sin * (cur.height / 2 - rfCor);
      var ex2 = cos * (prev.width / 2 + rfCor);
      var ey2 = sin * (prev.height / 2 - rfCor);
      var overlap = (Math.sqrt(ex1 * ex1 + ey1 * ey1) + Math.sqrt(ex2 * ex2 + ey2 * ey2)) - d;
      if (overlap > 0) {
        // move previous and current figure opposite by 50% of overlap
        overlap = overlap / 2;
        prev.t.setAttribute('x', roundTwo(parseFloat(prev.t.getAttribute('x')) + cos * overlap));
        prev.t.setAttribute('y', roundTwo(parseFloat(prev.t.getAttribute('y')) + sin * overlap));
        text.setAttribute('x', roundTwo(X + pathArray.x - cos * overlap));
        text.setAttribute('y', roundTwo(Y + pathArray.y - sin * overlap));
      }
    }
  } else if (pathArray.textBlock) {
    var tb = pathArray.textBlock;
    var spans = tb.getElementsByTagName('tspan');
    // set all tspan x values
    for (var i = 0; i < spans.length; i++) {
      spans[i].setAttribute('x', roundTwo(X + pathArray.x));
    }
    // set text x value
    tb.setAttribute('x', roundTwo(X + pathArray.x));
    tb.setAttribute('y', roundTwo(Y + pathArray.y));
    // when a rotation is specified, rotate around center
    svgElement.appendChild(tb);
    if (pathArray.r) {
      var box = tb.getBBox();
      tb.setAttribute ('transform', 'rotate (' + pathArray.r + ',' +
        roundTwo(box.x + box.width / 2) + ',' +
        roundTwo(box.y + box.height / 2) + ')');
    }
  } else if (pathArray.figureStart) {
    // Check if figure starts do not overlap when this is not the first figure
    if (figureStart.length > 0) {
      // count is used to make sure there is never an infinite loop
      var count = 0;
      do {
        // Walk through the figure starts and see if we find any distance
        // lower than minimum with the one we're making now
        var overlap = false;
        for (var i = 0; i < figureStart.length; i++) {
          var distSq = (figureStart[i].x - X)*(figureStart[i].x - X) + (figureStart[i].y - Y)*(figureStart[i].y - Y);
          if (distSq < minFigStartDistSq) {
            // found one that's too close. Move the start down and run again
            Y = parseInt(figureStart[i].y + Math.sqrt(minFigStartDistSq-((figureStart[i].x - X)*(figureStart[i].x - X))) + 1);
            overlap = true;
            count ++;
            break; // break for loop
          }
        }
      } while (overlap && (count < 10000));
      Y = roundTwo(Y);
    }
    // Put this figure's start in the figureStart array for checking
    // against the next one
    figureStart.push({'x':X, 'y':Y});
    // make a transparent circle at the figure start for easy grabbing
    var circle = document.createElementNS (svgNS, "circle");
    circle.setAttribute('cx', X);
    circle.setAttribute('cy', Y);
    circle.setAttribute('r', minFigStartDist / 2);
    circle.setAttribute('stroke', 'none');
    circle.setAttribute('fill', 'transparent');
    circle.setAttribute('fill-opacity', '0.0');
    circle.setAttribute('class', 'figStartCircle');
    svgElement.appendChild (circle);
  }
  if ('dx' in pathArray) X = roundTwo(X + pathArray['dx']);
  if ('dy' in pathArray) Y = roundTwo(Y + pathArray['dy']);
  return cur;
}

// drawLine draws a line from x,y to x+dx,y+dy in style styleId
// When an svg object is provided, it will be used i.s.o. the standard sequenceSvg
function drawLine (x, y, dx, dy, styleId, svg) {
  var path = document.createElementNS (svgNS, "path");
  path.setAttribute('d', 'M ' + roundTwo(x) + ',' + roundTwo(y) +
    ' l ' + roundTwo(dx) + ',' + roundTwo(dy));
  path.setAttribute('style',style[styleId]);
  if (svg) {
    svg.appendChild(path);
  } else SVGRoot.getElementById('sequence').appendChild(path);
}
  
// drawRectangle draws a rectangle at position x, y in style styleId
// When an svg object is provided, it will be used i.s.o. the standard sequenceSvg
function drawRectangle (x, y, width, height, styleId, svg) {
  var path = document.createElementNS (svgNS, "rect");
  path.setAttribute('x', x);
  path.setAttribute('y', y);
  path.setAttribute('width', width);
  path.setAttribute('height', height);
  path.setAttribute('style', style[styleId]);
  if (svg) {
    svg.appendChild(path);
  } else SVGRoot.getElementById('sequence').appendChild(path);
}
  
// drawText draws any text at position x, y in style styleId with
// optional anchor, id, svg
function drawText (text, x, y, styleId, anchor, id, svg) {
  var newText = document.createElementNS (svgNS, "text");
  if (id) newText.setAttribute('id', id);
  if (style) newText.setAttribute('style', style[styleId]);
  if (anchor) newText.setAttribute('text-anchor', anchor);
  newText.setAttribute('x', roundTwo(x));        
  newText.setAttribute('y', roundTwo(y));
  var textNode = document.createTextNode(text);
  newText.appendChild(textNode);
  if (svg) {
    svg.appendChild (newText);
  } else {
    SVGRoot.getElementById('sequence').appendChild(newText);
  }
}

// drawTextArea draws any text area at position x, y in style styleId
// with optional anchor and id
// w and h are width and height. With one of them not set the other will
// be determined automatically
function drawTextArea (text, x, y, w, h, styleId, id, svg) {
  var newText = document.createElementNS (svgNS, "foreignObject");
  var div = document.createElement ('div');
  if (id) newText.setAttribute('id', id);
  newText.setAttribute('x', roundTwo(x));
  newText.setAttribute('y', roundTwo(y));
  if (w) {
    div.setAttribute('width', roundTwo(w));
    newText.setAttribute('width', roundTwo(w));
  }
  if (h) newText.setAttribute('height', roundTwo(h));
  div.innerHTML = text;
  if (styleId) div.setAttribute('style', style[styleId]);
  newText.appendChild (div);
  if (svg) {
    svg.appendChild (newText);
  } else {
    SVGRoot.getElementById('sequence').appendChild(newText);
  }
}

// draw an aresti number text with a figure
function drawArestiText(figNr, aresti) {
  drawText (aresti, X, Y, 'start', 'text-' + figNr);
}

// #####################################################
// Functions for setting up the software

// doOnLoad is only called on initial loading of the page
function doOnLoad () {
  // define DOM variables
  sequenceText = document.getElementById('sequence_text');
  sportingClass = document.getElementById('class');
  fileName = document.getElementById('fileName');
  newTurnPerspective = document.getElementById('newTurnPerspective');

  var errors = [];
  
  try {
    if (chrome) {
      if (chrome.fileSystem) {
        chromeApp.active = true;
        console.log('Running as Chrome app');
      }
    }
  } catch (e) {};
  
  // add all listeners for clicks, keyup etc
  addEventListeners();

  // Use try to prevent bugs in this part from blocking OpenAero startup.
  // Errors are logged to console.
//  try {    
    // check if Chrome App is installed
    checkForApp();

    // Check if localStorage is supported. When running as Chrome app, we
    // assume the local storage support is present
    if (!chromeApp.active) {
      storage = (typeof(localStorage) != 'undefined')? true : false;
    }

    // set correct options and menu items in various places
    setOptions();
    /** Define the default language and userText now as they are used
     *  In other functions during load
     */
    updateUserTexts();
    // load settings from storage
    loadSettingsStorage();
    
    /** userText is now defined, continue */

    // Add a listener for HTML5 app cache updates
    if (!chromeApp.active) {
      addUpdateListener();
    }
    // show loading overlay and circles
    /**
    var el = document.getElementById('alertBoxOverlay');
    el.removeAttribute('style');
    el.innerHTML = '<svg id="loaderSvg" xmlns:svg=' + svgNS + ' xmlns=' + svgNS +
      ' xmlns:xlink=' + xlinkNS + ' version="1.1" width="100%" height="40%"' +
      'viewBox="-19 -19 38 38"><defs><circle id="loaderCircle" cx="10" cy="10" r="4"/></defs>' +
      '<g id="a"><use xlink:href="#loaderCircle"style="fill:#adadad;fill-opacity:0.5;stroke-width:0" />' +
      '<use xlink:href="#loaderCircle" transform="rotate(45)" style="fill:#adadad;fill-opacity:0.5;" />' +
      '<use xlink:href="#loaderCircle" transform="rotate(90)" style="fill:#c1c1c1;fill-opacity:0.56862745;" />' +
      '<use xlink:href="#loaderCircle" transform="rotate(135)" style="fill:#d7d7d7;fill-opacity:0.67843161;" />' +
      '<use xlink:href="#loaderCircle" transform="rotate(180)" style="fill:#e9e9e9;fill-opacity:0.78431373;" />' +
      '<use xlink:href="#loaderCircle" transform="rotate(225)" style="fill:#f4f4f4;fill-opacity:0.89019608;" />' +
      '<use xlink:href="#loaderCircle" transform="rotate(270)" style="fill:#ffffff;fill-opacity:1;" />' +
      '<use xlink:href="#loaderCircle" transform="rotate(315)" style="fill:#adadad;fill-opacity:0.5;" />' +
      '<animateTransform attributeName="transform" attributeType="XML" type="rotate" begin="0s" dur="1s" repeatCount="indefinite" calcMode="discrete" values="0  ;  45;  90; 135; 180; 225; 270; 315"  keyTimes="0.0; 0.13; 0.27; 0.40; 0.53; 0.67; 0.80; 0.93" /></g></svg>';
    */
    // build sequence svg
    rebuildSequenceSvg();
    // determine if we are running on a mobile browser by screen width
    if (screen.width < 761) {
      switchMobile ();
    }

    // check browser and capabilities
    var err = checkBrowser();
    if (err) errors.push (err);
    // Setup the drag n drop listeners for multi file checking
    var dropZone = document.getElementById('fileDrop');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', updateMulti, false);
    // add onresize event for resizing the sequence text window
    window.onresize = updateSequenceTextHeight;
    // Parse the figures file
    parseFiguresFile();
    // Parse the rules
    parseRules();
    // set default Form to B
    activeForm = 'B';
      
    // Activate the first figure selection group
    changeFigureGroup();
    document.getElementById('figureHeader').innerHTML = '';
    // Add plus and minus elements such as used in entry/exit line adjustment
    addPlusMinElements();
    // build the buttons
    buildButtons();
    // prepare figure editor
    updateFigureEditor();
    // update save as PNG or SVG height
    saveImageSizeAdjust();
    // set default Y axis offset and start direction
    setYAxisOffset (yAxisOffsetDefault);
    Direction = 0;
    // set OpenAero version for saving
    document.getElementById('oa_version').value = version;

    // Load sequence from URL if sequence GET element is set.
    launchURL ({'url': window.document.URL});
    
    // When no sequence is active yet, load sequence storage (if any).
    // Do this after the rules have been loaded to make sure rules stay
    // in Sequence info
    if (!activeSequence.xml) {
      function f(c) {
        activeSequence.xml = c.sequence;
        activateXMLsequence (activeSequence.xml);
      }
      getLocal('sequence', f);
    }
      
    // Add combo box functions for rules/category/program input fields
    // but make sure we don't change the logo (true)
    new combo('rules','#cc9','#ffc');
    changeCombo('rules', true);

    // check if the sequence displayed is the one in the input field
    checkSequenceChanged();
    // select active Form
    // need to do this to make sure the sequence is drawn when loaded
    // from localStorage or url
    selectForm(activeForm);
    if (mobileBrowser) selectTab('tab-sequenceInfo');
//  } catch (e) {
//    console.log(e);
//  }
  
  /**
  // load (mostly) completed, remove loading icon and status
  el.innerHTML = '';
  el.setAttribute('style', 'display:none;');
  */
  
  // Check if an update has just been done
  checkUpdateDone();
  // Check for the latest version every 10 minutes
  if (!chromeApp.active) {
    window.setInterval(function(){latestVersion()},600000);
  }
  // check if we are running from a file (DEPRECATED)
  if (window.location.protocol === 'file:') {
    if (presentFileError) errors.push (userText.runFromFile);
  } else {
    // set alert if localStorage is disabled
    if (!storage) errors.push (userText.noCookies);
  }
  // show alert box for any alerts
  if (errors.length) {
    alertBox ('<p>' + errors.join('</p><p>') + '</p>');
  }
  loadComplete = true;
  // also check for latest version now
  if (chromeApp.active) {
    document.getElementById('latestVersion').parentNode.classList.add('noDisplay');
    document.getElementById('version').innerHTML = sprintf (
      userText.version, version);
  } else {
    latestVersion();
  }
  // activate addtohomescreen for iOS
  addToHomescreen();
}

/** Use of function getElementsByAttribute is DEPRECATED in 1.4.0
 *  May be of use in the future so keep it for now
function getElementsByAttribute(oElm, strTagName, strAttributeName, strAttributeValue){
  var arrElements = (strTagName == "*" && document.all)? document.all : oElm.getElementsByTagName(strTagName);
  var arrReturnElements = new Array();
  var oAttributeValue = (typeof strAttributeValue != "undefined")? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)") : null;
  var oCurrent;
  var oAttribute;
  for(var i=0; i<arrElements.length; i++){
      oCurrent = arrElements[i];
      oAttribute = oCurrent.getAttribute(strAttributeName);
      if(typeof oAttribute == "string" && oAttribute.length > 0){
          if(typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))){
              arrReturnElements.push(oCurrent);
          }
      }
  }
  return arrReturnElements;
}
*/

// launchURL is run during doOnLoad (web) or on event onLaunched (App)
// and retrieves sequence from URL (if any)
function launchURL (launchData) {
  var match = launchData.url.toString().match(/\?(sequence|s)=.+/);
  if (match) {
    activateXMLsequence (decodeURI(match[0].replace(/\?(sequence|s)=/, '')));
  }
}

// appZoom adds zoom functionality to the app and is called by keydown
function appZoom (e) {
  var zoomSteps = ['0.33', '0.5', '0.67', '0.75', '0.9', '1',
    '1.1', '1.25', '1.5', '1.75', '2', '2.5', '3'];
  var zoom = document.body.style.zoom ? document.body.style.zoom : '1';
  if ((e.shiftKey && e.ctrlKey && (e.keyCode == 187)) || (e === 1)) {
    var zoom = zoomSteps[zoomSteps.indexOf(zoom) + 1];
  } else if ((!e.shiftKey && e.ctrlKey && (e.keyCode == 189)) || (e === -1)) {
    var zoom = zoomSteps[zoomSteps.indexOf(zoom) - 1];
  } else {
    // no special appZoom key or click, return true to bubble key
    return true;
  }
  // only update zoom when zoom has a valid value
  if (zoom) {
    document.body.style.zoom = zoom;
    document.getElementById('zoom').innerText = parseInt(zoom * 100) + '%';
  }
  // don't bubble key
  return false;
}
  
// addEventListeners adds all event listeners for actions.
// In index.html no actions are specified. It is necessary they are
// specified as event listeners for Chrome Apps.
function addEventListeners () {
  // zoom for Chrome app
  if (chromeApp.active) {
    document.addEventListener ('keydown', appZoom, false);
  } else {
    document.getElementById('zoomMenu').classList.add('noDisplay');
  }

  // menu
  document.getElementById('menuFile').addEventListener('mouseover', menuActive, false);
  document.getElementById('menuFile').addEventListener('mouseout', menuInactive, false);
  document.getElementById('file').addEventListener('mousedown', function(){menuInactive(document.getElementById('menuFile'))}, false);  
  document.getElementById('file').addEventListener('change', openSequence, false);
  document.getElementById('t_clearSequence').addEventListener('click', clearSequence, false);
  document.getElementById('t_saveSequence').addEventListener('click', saveSequence, false);
  document.getElementById('t_emailSequence').addEventListener('mousedown', emailSequence, false);
  document.getElementById('t_saveAsLink').addEventListener('click', saveAsURL, false);
  document.getElementById('t_saveAsImage').addEventListener('click', function(){printDialog(true)}, false);
  document.getElementById('t_saveFigsSeparate').addEventListener('click', saveFigs, false);
  document.getElementById('t_printSaveForms').addEventListener('click', function(){printDialog(true)}, false);
  
  document.getElementById('menuView').addEventListener('mouseover', menuActive, false);
  document.getElementById('menuView').addEventListener('mouseout', menuInactive, false);
  document.getElementById('t_formA').addEventListener('click', function(){selectForm('A')}, false);
  document.getElementById('t_formB').addEventListener('click', function(){selectForm('B')}, false);
  document.getElementById('t_formC').addEventListener('click', function(){selectForm('C')}, false);
  document.getElementById('t_figsInGrid').addEventListener('click', function(){selectForm('Grid')}, false);
  document.getElementById('zoomMin').addEventListener('mousedown', function(){appZoom(-1)}, false);
  document.getElementById('zoomPlus').addEventListener('mousedown', function(){appZoom(1)}, false);
  document.getElementById('t_setMobile').addEventListener('click', switchMobile, false);
  
  document.getElementById('menuSequence').addEventListener('mouseover', menuActive, false);
  document.getElementById('menuSequence').addEventListener('mouseout', menuInactive, false);
  document.getElementById('t_flipYAxis').addEventListener('click', flipYAxis, false);
  document.getElementById('t_clearPositioning').addEventListener('click', clearPositioningOption, false);
  document.getElementById('t_separateFigures').addEventListener('click', separateFigures, false);
  document.getElementById('t_checkSequence').addEventListener('click', function(){checkSequence(true)}, false);
  
  document.getElementById('menuQueue').addEventListener('mouseover', menuActive, false);
  document.getElementById('menuQueue').addEventListener('mouseout', menuInactive, false);
  document.getElementById('t_showQueue').addEventListener('click', showQueue, false);
  document.getElementById('t_addToQueue').addEventListener('click', addToQueue, false);
  document.getElementById('t_addAllToQueue').addEventListener('click', addAllToQueue, false);
  document.getElementById('t_clearQueue').addEventListener('click', clearQueue, false);
  document.getElementById('queue').addEventListener('change', openQueue, false);
  document.getElementById('t_saveQueueFile').addEventListener('click', saveQueue, false);
  
  document.getElementById('menuDemo').addEventListener('mouseover', menuActive, false);
  document.getElementById('menuDemo').addEventListener('mouseout', menuInactive, false);

  document.getElementById('menuTools').addEventListener('mouseover', menuActive, false);
  document.getElementById('menuTools').addEventListener('mouseout', menuInactive, false);
  document.getElementById('t_checkMultipleSeq').addEventListener('mousedown', function(){checkMultiDialog(true)}, false);
  //document.getElementById('t_printMultipleSeq').addEventListener('mousedown', function(){printMultiDialog(true)}, false);
  document.getElementById('rulesFile').addEventListener('change', openRulesFile, false);
  document.getElementById('t_settings').addEventListener('click', settingsDialog, false);
  document.getElementById('t_installChromeAppTitle').addEventListener ('mousedown', installChromeApp, false);
  
  document.getElementById('menuHelp').addEventListener('mouseover', menuActive, false);
  document.getElementById('menuHelp').addEventListener('mouseout', menuInactive, false);  
  document.getElementById('t_manual').addEventListener('click', function(){
      helpWindow('manual.html', 'OpenAero manual');
    }, false);
  document.getElementById('t_openaeroLanguage').addEventListener('click', function(){
      helpWindow('language.html', 'OpenAero language');
    }, false);
  document.getElementById('t_arestiSystem').addEventListener('click', function(){
      helpWindow('arestisystem.html', 'The Aresti aerocryptographic system');
    }, false);
  document.getElementById('t_about').addEventListener('click', function(){
      helpWindow('about.html', 'About');
    }, false);
    
  // sequence string
  document.getElementById('undo').addEventListener('click', clickButton, false);
  document.getElementById('redo').addEventListener('click', clickButton, false);
  document.getElementById('sequence_text').addEventListener('input', checkSequenceChanged, false);
  document.getElementById('sequence_text').addEventListener('focus', function(){this.hasfocus=true}, false);
  document.getElementById('sequence_text').addEventListener('blur', function(){this.hasfocus=false}, false);
  document.getElementById('sequence_text').addEventListener('paste', function(){OLANBumpBugCheck=true}, false);
  
  // left block tabs
  document.getElementById('t_sequenceInfo').addEventListener('click', selectTab, false);
  document.getElementById('t_figureEditor').addEventListener('click', selectTab, false);
  document.getElementById('t_sequenceTab').addEventListener('click', selectTab, false);
  
  // sequence info options
  document.getElementById('pilot').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('aircraft').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('location').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('date').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('class').addEventListener('change',  selectPwrdGlider, false);
  document.getElementById('positioning').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('harmony').addEventListener('change', changeSequenceInfo, false);
  
  document.getElementById('t_chooseLogo').addEventListener('click', logoChooser, false);
  document.getElementById('t_removeLogo').addEventListener ('click', removeLogo, false);
  document.getElementById('logoImage').addEventListener ('click', logoChooser, false);
  document.getElementById('hideLogoChooser').addEventListener('click', hideLogoChooser, false);
  document.getElementById('logoFile').addEventListener('change', openLogoFile, false);

  document.getElementById('notes').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('fileName').addEventListener('keyup', updateSaveFilename, false);
    
  // figure editor options
  document.getElementById('manual.html_adding_a_figure').addEventListener('mousedown', function(){
    helpWindow('manual.html#adding_a_figure', 'Adding a figure');
  }, false);
  document.getElementById('manual.html_figure_comments').addEventListener('mousedown', function(){
    helpWindow('manual.html#figure_comments', 'Figure comments');
  }, false);
  document.getElementById('subSequenceDirection').addEventListener('change', updateFigure, false);
  document.getElementById('t_addFigureText').addEventListener('mousedown', showFigureSelector, false);
  document.getElementById('subSequence').addEventListener('click', clickButton, false);
  document.getElementById('deleteFig').addEventListener('click', clickButton, false);
  document.getElementById('switchFirstRoll').addEventListener('click', clickButton, false);
  document.getElementById('switchY').addEventListener('click', clickButton, false);
  document.getElementById('switchX').addEventListener('click', clickButton, false);
  document.getElementById('magMin').addEventListener('click', clickButton, false);
  document.getElementById('magPlus').addEventListener('click', clickButton, false);
  document.getElementById('moveForward').addEventListener('click', clickButton, false);
  document.getElementById('straightLine').addEventListener('click', clickButton, false);
  document.getElementById('curvedLine').addEventListener('click', clickButton, false);
  document.getElementById('moveX').addEventListener('change', updateFigure, false);
  document.getElementById('moveY').addEventListener('change', updateFigure, false);
  document.getElementById('unknownFigure').addEventListener('change', updateFigure, false);
  document.getElementById('figEntryButton').addEventListener('click', clickButton, false);
  document.getElementById('figExitButton').addEventListener('click', clickButton, false);
  document.getElementById('comments').addEventListener('change', updateFigure, false);
  
  // figure selector
  document.getElementById('hideIllegal').addEventListener('change', changeHideIllegal, false);
  document.getElementById('hideFigureSelector').addEventListener('mousedown', hideFigureSelector, false);
  document.getElementById('figureGroup').addEventListener('change', changeFigureGroup, false);

  // close alert box
  document.getElementById('t_closeAlert').addEventListener('click', function(){alertBox()}, false);
  
  // confirm box
  document.getElementById('t_confirmBoxYes').addEventListener('click', confirmYes, false);
  document.getElementById('t_confirmBoxNo').addEventListener('click', function(){confirmBox()}, false);
  
  // check sequence dialog
  document.getElementById('t_checkSequenceOK').addEventListener('click', function(){checkSequence()}, false);
  document.getElementById('t_checkSequenceLog').addEventListener('click', function(){checkSequence('log')}, false);
  
  // check multiple dialog
  document.getElementById('checkMultiFiles').addEventListener('change', function(){updateMulti(this)}, false);
  document.getElementById('t_checkSequences').addEventListener('mousedown', checkMulti, false);
  document.getElementById('t_checkMultiClose').addEventListener('click', function(){checkMultiDialog()}, false);
  
  // print multiple dialog
  document.getElementById('printMultiFiles').addEventListener('change', function(){printMulti()}, false);
  document.getElementById('t_printMultiClose').addEventListener('mousedown', function(){printMultiDialog()}, false);

  // settings dialog
  document.getElementById('manual.html_settings').addEventListener('mousedown', function(){
    helpWindow('manual.html#settings', 'Settings');
  }, false);
  document.getElementById('t_general').addEventListener('click', selectTab, false);
  document.getElementById('t_styling').addEventListener('click', selectTab, false);
  document.getElementById('t_expert').addEventListener('click', selectTab, false);
  document.getElementById('language').addEventListener('change', changeLanguage, false);
  document.getElementById('gridColumns').addEventListener('change', updateGridColumns, false);
  document.getElementById('queueColumns').addEventListener('change', changeQueueColumns, false);
  document.getElementById('imageFormatPNG').addEventListener('change', saveSettingsStorage, false);
  document.getElementById('imageFormatSVG').addEventListener('change', saveSettingsStorage, false);
  document.getElementById('saveFigsSeparateWidth').addEventListener('change', saveSettingsStorage, false);
  document.getElementById('saveFigsSeparateHeight').addEventListener('change', saveSettingsStorage, false);
  document.getElementById('zipImageFilenamePattern').addEventListener('change', saveSettingsStorage, false);

  document.getElementById('numberInCircle').addEventListener('change', updateNumberInCircle, false);
  document.getElementById('rollFontSize').addEventListener('change', updateRollFontSize, false);

  document.getElementById('nonArestiRolls').addEventListener('change', updateNonArestiRolls, false);
  document.getElementById('styles').addEventListener('change', getStyle, false);
  document.getElementById('styleString').addEventListener('change', updateStyle, false);
  document.getElementById('t_changeStyle').addEventListener('mousedown', updateStyle, false);
  document.getElementById('t_resetStyle').addEventListener('mousedown', function(){resetStyle()}, false);
  document.getElementById('t_resetStyleAll').addEventListener('mousedown', function(){resetStyle(true)}, false);
  document.getElementById('newTurnPerspective').addEventListener('change', draw, false);
  document.getElementById('t_restoreDefaultSettings').addEventListener('mousedown', restoreDefaultSettings, false);
  
  document.getElementById('t_settingsClose').addEventListener('mousedown', settingsDialog, false);

  // save dialog
  document.getElementById('dlTextField').addEventListener('keyup', updateSaveFilename, true);
  document.getElementById('t_saveFile').addEventListener('click',function(){
    window.setTimeout(function(){saveDialog()},100);
    }, false);
  document.getElementById('t_cancelSave').addEventListener('mousedown', function(){saveDialog()}, false);
  
  // print/save image dialog
  document.getElementById('manual.html_save_print').addEventListener('click', function(){
      helpWindow('manual.html#save_print', 'OpenAero manual');
    }, false);
  document.getElementById('printFormA').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormB').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormC').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormPilotCards').addEventListener('change', setPilotCardForm, false);
  document.getElementById('pilotCardPercent').addEventListener('click', setPilotCardLayout, false);
  document.getElementById('pilotCard2').addEventListener('click', setPilotCardLayout, false);
  document.getElementById('pilotCard4').addEventListener('click', setPilotCardLayout, false);
  document.getElementById('printFormGrid').addEventListener('change', saveImageSizeAdjust, false);
  /*
  document.getElementById('pilotCardX').addEventListener('change', function(){setRatio('pilotCardY', this, Math.PageRatio)}, false);
  document.getElementById('pilotCardY').addEventListener('change', function(){setRatio('pilotCardX', this, 1/Math.PageRatio)}, false);
  document.getElementById('pilotCardUnits').addEventListener('change', setPilotCardUnits, false);*/
  document.getElementById('imageWidth').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('imageHeight').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('pageSpacing').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('t_print').addEventListener('click', printForms, false);
  document.getElementById('t_saveAsPNG').addEventListener('click', savePNG, false);
  document.getElementById('t_saveAsSVG').addEventListener('click', saveSVG, false);
  document.getElementById('t_cancelPrint').addEventListener('click', function(){printDialog()}, false);
  
}

function myEvent() {
  eval (myEvents[this.id]);
}

// checkForApp will check if the OpenAero Chrome app is present
function checkForApp () {
  // only do something when not running as Chrome app
  // and
  // in Chrome browser with extension support
  if (typeof chrome == "undefined") return;
  if (!chromeApp.active) {
    function f (c) {
      
      if (typeof chrome.app == "undefined") return;
      if (!chromeApp.active) {
        // App not active. This also means we are not in OpenAero Stable
        // (openaero.net or www.openaero.net) with the App installed.
        // Stable is automatically redirected to the App through the
        // url_handlers directive in manifest.json
        
        // Create <head> link for direct install
        var head = document.getElementsByTagName ('head')[0];
        var link = document.createElement ('link');
        link.rel = 'chrome-webstore-item';
        link.href = 'https://chrome.google.com/webstore/detail/' + chromeApp.id;
        head.appendChild (link);
        // Show link in tools menu
        document.getElementById('installChromeApp').classList.remove ('noDisplay');
          
        // Create a box asking the user if they want to install the
        // App, unless installChromeAppAsked is present. Also wait until
        // loadComplete
        if (!c.installChromeAppAsked) {
          var id = window.setInterval (function(){
            if (loadComplete) {
              window.clearInterval (intervalID.installChromeApp);
              delete intervalID.installChromeApp;
              confirmBox (
                userText.installChromeApp,
                userText.installChromeAppTitle,
                installChromeApp
              );
            }
          }, 1000);
          intervalID.installChromeApp = id;
          // don't ask again, independent of install result
          storeLocal ('installChromeAppAsked', 'true');
        };
      }
      
    }
    
    getLocal ('installChromeAppAsked', f);
    
  }

}

// installChromeApp will perform Chrome App installation after called
function installChromeApp() {
  chrome.webstore.install (
    undefined,
    function() {
      // install succesfull
      alertBox (userText.installChromeAppComplete, userText.installChromeAppTitle);
      // hide menu link
      document.getElementById('installChromeApp').classList.add ('noDisplay');
    },
    function(e) {
      // install unsuccesfull
      console.log(e);
    }
  );
}

// #####################################################
// Functions for interpreting user input and variables

// confirmYes is executed when Yes is clicked in a confirm box. It
// causes the box to be removed and function confirmFunction to be
// executed.
function confirmYes () {
  document.getElementById('confirmBox').classList.add ('noDisplay');
  confirmFunction();
  confirmFunction = null;
}

// checkBrowser checks on which browser we're running and creates
// alerts where applicable
function checkBrowser () {
  /* The objects in dataBrowser are used in the order they appear;
   * that's why dataBrowser is an array. As soon as a positive
   * identification is made the script ends, and it doesn't check the
   * remaining objects.
   * Detection order is very important. The general rule is that you
   * check for the minor browsers first. The reason is that many minor
   * browsers give their users the opportunity to change identity in
   * order to work around browser detects.
   * For instance, the Opera navigator.userAgent may contain "MSIE". If
   * we'd check for Explorer first, we'd find the "MSIE" and incorrectly
   * conclude that the browser is Explorer. In order to avoid this false
   * detection, we should check for Opera first. If the browser is in
   * fact Opera, the script never proceeds to the "MSIE" check. */
  var BrowserDetect = {
    init: function () {
      this.browser = this.searchString(this.dataBrowser) || "unknown";
      this.version = this.searchVersion(navigator.userAgent)
        || this.searchVersion(navigator.appVersion)
        || "unknown";
      this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
      for (var i=0;i<data.length;i++)	{
        var dataString = data[i].string;
        var dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if (dataString) {
          if (dataString.indexOf(data[i].subString) != -1)
            return data[i].identity;
        }
        else if (dataProp)
          return data[i].identity;
      }
    },
    searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index == -1) return;
      return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
      {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
      },
      { 	string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
      },
      {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
      },
      {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
      },
      {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
      },
      {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
      },
      {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
      },
      {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
      },
      {		// for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
      },
      {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
      },
      {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
      },
      { 		// for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
      }
    ],
    dataOS : [
      {
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
      },
      {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
      },
      {
           string: navigator.userAgent,
           subString: "iPhone",
           identity: "iPhone/iPod"
      },
      {
        string: navigator.platform,
        subString: 'iPad',
        identity:  'iPad'
      },
      {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
      }
    ]
  
  };
  BrowserDetect.init();
  var fatalError = false;
  browserString = BrowserDetect.browser + ' Version ' +
    BrowserDetect.version + ', running on ' + BrowserDetect.OS;
  // following line can be used for finding browser keys
  // for (key in navigator) console.log (key + ' : ' + navigator[key]);
  console.log ('Browser: ' + browserString);
  // Check for essential methods, OpenAero will not function without these!
  // use the selectedFigureSvg to check for SVG and getBBox support
  if (!document.getElementById('selectedFigureSvg').getBBox()) fatalError = true;
  if (fatalError) {
    document.getElementsByTagName('body')[0].innerHTML = '<h2><center>' +
      sprintf (userText.oldBrowser, browserString) +
      userText.getChrome +
      '</center></h2>';
    throw new Error('Browser not capable of running OpenAero');
  }
  // Check for recommended methods
  // check for file support
  if (!fileSupport()) {
    return userText.fileOpeningNotSupported + '<br>' + userText.getChrome;
  }
  // Present a warning if the browser is not Chrome and the warning was
  // not displayed for four weeks. Use store value for setting the
  // expiry time
  if (BrowserDetect.browser != 'Chrome') {
    function f(c) {
      var d = new Date();
      var t = parseInt(d.getTime());
      if (c.noChromeWarned) {
        if (c.noChromeWarned < t) {
          c.noChromeWarned = false;
        }
      }
      if (!c.noChromeWarned) {
        storeLocal ('noChromeWarned', t + 2419200000);
        alertBox (sprintf (userText.browserDetect, browserString) +
          userText.getChrome);
      }
    }
    getLocal ('noChromeWarned', f);
  }
}

// checkFileSupport checks for file reading support
// if not available, some functions are disabled and a warning is returned
function fileSupport () {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('File reading support confirmed');
    return true;
  } else {
    // disable file reading functions
    var els = document.getElementsByClassName('fileOpening');
    for (var i = els.length - 1; i >= 0; i--) {
      els[i].parentNode.removeChild(els[i]);
    }
    return false;
  }
}

// clickButton is called when clicking certain buttons
// we have to go down 2 levels to update the button image:
// button div -> button a -> button img
function clickButton () {
  var e = this;
  var divClass = e.getAttribute('class');
  
  // when the figure is a Free Unknown figure with a letter, don't
  // click disableFUfig buttons
  if (selectedFigure.id) {
    if (figures[selectedFigure.id].unknownFigureLetter) {
      if (figures[selectedFigure.id].unknownFigureLetter !== 'L') {
        if (divClass.match (/\bdisableFUfig\b/)) {
          return;
        }
      }
    }
  }
  
  switch (divClass) {
    // handle min button
    case 'minButton':
      if (mobileBrowser) {
        e.firstChild.setAttribute('src', mask.on);
        window.setTimeout (function(){e.firstChild.setAttribute('src', mask.off);}, 200);
      } else {
        e.firstChild.setAttribute('src', mask.smallon);
        window.setTimeout (function(){e.firstChild.setAttribute('src', mask.smalloff);}, 200);
      }
      e.nextSibling.value--;
      break;
    // handle plus button
    case 'plusButton':
      if (mobileBrowser) {
        e.firstChild.setAttribute('src', mask.on);
        window.setTimeout (function(){e.firstChild.setAttribute('src', mask.off);}, 200);
      } else {
        e.firstChild.setAttribute('src', mask.smallon);
        window.setTimeout (function(){e.firstChild.setAttribute('src', mask.smalloff);}, 200);
      }
      e.previousSibling.value++;
      break;
    // handle all other buttons
    default:
      // don't click disabled buttons
      if (e.firstChild.firstChild.getAttribute('src') == mask.disable) return;
      if (e.firstChild.firstChild.getAttribute('src') == mask.smalldisable) return;
      // activate the correct click action
      switch (e.id) {
        // temporary depression buttons
        case 'undo':
        case 'redo':
        case 'deleteFig':
        case 'magMin':
        case 'magPlus':
          // don't click tempo buttons that are on
          if (e.firstChild.firstChild.getAttribute('src') == mask.on) return;
          if (e.firstChild.firstChild.getAttribute('src') == mask.smallon) return;
          if (e.firstChild.firstChild.getAttribute('src') == mask.off) {
            e.firstChild.firstChild.setAttribute('src', mask.on);
            window.setTimeout (function(){e.firstChild.firstChild.setAttribute('src', mask.off);}, 200);
          } else if (e.firstChild.firstChild.getAttribute('src') == mask.smalloff)  {
            e.firstChild.firstChild.setAttribute('src', mask.smallon);
            window.setTimeout (function(){e.firstChild.firstChild.setAttribute('src', mask.smalloff);}, 200);
          }
          break;
        case 'figEntryButton':
        case 'figExitButton':
          break;
        // switch between active/inactive buttons
        default:
          if (e.firstChild.firstChild.getAttribute('src') == mask.off) {
            e.firstChild.firstChild.setAttribute('src', mask.on);
          } else if (e.firstChild.firstChild.getAttribute('src') == mask.on) {
            e.firstChild.firstChild.setAttribute('src', mask.off);
          } else if (e.firstChild.firstChild.getAttribute('src') == mask.smalloff) {
            e.firstChild.firstChild.setAttribute('src', mask.smallon);
          } else if (e.firstChild.firstChild.getAttribute('src') == mask.smallon) {
            e.firstChild.firstChild.setAttribute('src', mask.smalloff);
          }
      }
  }
      
  // disable the moveX/moveY selectors. They will be enabled depending
  // on the move button that's active
  document.getElementById('moveXCont').classList.add ('noDisplay');
  document.getElementById('moveYCont').classList.add ('noDisplay');

  // take action
  switch (e.id) {
    case 'undo':
      if (activeSequence.undo.length) {
        activeSequence.redo.push (activeSequence.xml);
        activeSequence.addUndo = false;
        activateXMLsequence (activeSequence.undo.pop());       
        changeSequenceInfo();
        if (activeSequence.text == sequenceText.value) {
          draw();
        }/* else checkSequenceChanged();*/
        activeSequence.addUndo = true;
        setUndoRedo();
        // select no figure
        selectFigure (false);
      }      
      // don't continue. Not a figure function
      return;
    case 'redo':
      if (activeSequence.redo.length) {
        activeSequence.undo.push (activeSequence.xml);
        activeSequence.addUndo = false;
        activateXMLsequence (activeSequence.redo.pop());
        changeSequenceInfo();
        if (activeSequence.text == sequenceText.value) {
          draw();
        }/* else checkSequenceChanged();*/
        activeSequence.addUndo = true;
        setUndoRedo();
        // select no figure
        selectFigure (false);
      }
      // don't continue. Not a figure function
      return;
    case 'deleteFig':
      if (selectedFigure.id != null) {
        var flipY = activeSequence.text.replace(regexComments, '').match(regexFlipYAxis);
        // remove all previous drawing figures and the figure itself
        while (selectedFigure.id > 0) {
          if (figures[selectedFigure.id - 1].figNr) {
            break;
          } else {
            updateSequence(selectedFigure.id - 1, '', true);
          }
        }
        updateSequence(selectedFigure.id, '', true);
        // when Y was flipped and we removed the figure with the only
        // flip symbol, put it back
        if (flipY && !activeSequence.text.replace(regexComments, '').match(regexFlipYAxis)) {
          flipYAxis();
        }
      }
      // don't continue function, figure has been removed
      return;
    case 'magMin':
      document.getElementById('scale').value--;
      updateFigure();
      break;
    case 'magPlus':
      document.getElementById('scale').value++;
      updateFigure();
      break;
    case 'moveForward':
      document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.off);
      document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.off);
      if (e.firstChild.firstChild.getAttribute('src') == mask.on) {
        // remove disabled for move
        document.getElementById('moveXCont').firstChild.classList.add ('noDisplay');
        document.getElementById('moveXCont').classList.remove ('noDisplay');
        // set default of 2 if no value was set
        var el = document.getElementById('moveX-value');
        if (el.value == 0) el.value = 2;
      }
      break;
    case 'straightLine':
      document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.off);
      document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.off);
      if (e.firstChild.firstChild.getAttribute('src') == mask.on) {
        document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
        document.getElementById('moveXCont').classList.remove ('noDisplay');
        document.getElementById('moveYCont').classList.remove ('noDisplay');
      }
      break;
    case 'curvedLine':
      document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.off);
      document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.off);
      if (e.firstChild.firstChild.getAttribute('src') == mask.on) {
        document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
        document.getElementById('moveXCont').classList.remove ('noDisplay');
        document.getElementById('moveYCont').classList.remove ('noDisplay');
      }
      break;
    case 'figEntryButton':
    case 'figExitButton':
      // switch button upright/inverted
      e.classList.toggle ('inverted');
      break;
    default:
      // roll flip buttons don't have a generic id, so using 'case' won't work
      if (e.id.match(/^roll\d-\d-flip(Number|)$/)) {
        e.classList.toggle ('on');
      }
  }
  updateFigure();
}

// addPlusMinElements creates plus/min elements on startup
function addPlusMinElements () {
  var el = document.getElementsByClassName('plusMin');
  for (var i = el.length - 1; i >= 0; i--) {
    // clear element
    while (el[i].childNodes.length > 0) el[i].removeChild(el[i].lastChild);
    var button = document.createElement('span');
    button.setAttribute('class', 'minButton');
    button.addEventListener ('mousedown', clickButton, false);
    if (mobileBrowser) {
      button.innerHTML = '<img src="buttons/mask.png">';
    } else {
      button.innerHTML = '<img src="buttons/smallMask.png">';
    }
    el[i].appendChild (button);
    var value = document.createElement('input');
    if (mobileBrowser) value.type = 'number';
    value.id = el[i].id + '-value';
    value.size = '2';
    value.value = '0';
    value.setAttribute('class', 'plusMinText');
    value.addEventListener ('update', updateFigure, false);
    el[i].appendChild (value);
    var button = document.createElement('span');
    button.setAttribute('class', 'plusButton');
    button.addEventListener ('mousedown', clickButton, false);
    if (mobileBrowser) {
      button.innerHTML = '<img src="buttons/mask.png">';
    } else {
      button.innerHTML = '<img src="buttons/smallMask.png">';
    }
    el[i].appendChild (button);
  }
}

// buildButtons builds the buttons on startup
function buildButtons () {
  var el = document.getElementsByClassName('button');
  for (var i = el.length - 1; i >=0; i--) {
    el[i].innerHTML = '<a><img src="buttons/mask.png"><div></div></a>';
  }
  // add tooltips
  for (key in userText.tooltip) {
    var el = document.getElementById(key);
    if (el) {
      el.firstChild.classList.add ('tooltip');
      el.firstChild.lastChild.innerHTML = userText.tooltip[key];
    }
  }
}

// build an element with plus/minus buttons and return it
function buildPlusMinElement (id, value) {
  var el = document.createElement('span');
  
  var span = document.createElement('span');
  span.classList.add('minButton');
  span.addEventListener('click', clickButton, false);
  var img = document.createElement('img');
  if (mobileBrowser) {
    img.setAttribute('src', 'buttons/mask.png');
  } else {
    img.setAttribute('src', 'buttons/smallMask.png');
  }
  span.appendChild(img);
  el.appendChild (span);
  
  var input = document.createElement('input');
  input.setAttribute ('id', id);
  input.setAttribute ('value', value);
  input.classList.add ('plusMinText');
  input.addEventListener ('update', updateFigure, false);
  el.appendChild (input);

  var span = document.createElement('span');
  span.classList.add('plusButton');
  span.addEventListener('click', clickButton, false);
  var img = document.createElement('img');
  if (mobileBrowser) {
    img.setAttribute('src', 'buttons/mask.png');
  } else {
    img.setAttribute('src', 'buttons/smallMask.png');
  }
  span.appendChild(img);
  el.appendChild (span);
  
  if (!mobileBrowser) {
    if (userText.tooltip[id]) {
      el.classList.add ('tooltip','ttRight');
      var div = document.createElement('div');
      div.innerHTML = userText.tooltip[id];
      el.appendChild(div);
    }
  }

  return el;
}

// addRollSelectElement adds roll select elements to the parent element
function addRollSelectElement (figNr, rollEl, elNr, parent) {
  var thisRoll = figures[figNr].rollInfo[rollEl];
  var pattern = '';
  if (thisRoll.pattern[elNr]) {
    pattern = thisRoll.pattern[elNr];
    // handle special case where (non-standard) 28 is used i.s.o. 8
    if (pattern === '28') pattern = '8';
  }
  var span = document.createElement ('span');
  var html = '<select id="roll' + rollEl + '-' + elNr +
    '" class="rollSelect disableRollFUfig">';
  // build the slow roll options
  for (var i = 0; i < rollTypes.length; i++) {
    var roll = rollTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="rollSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the positive flick options
  for (var i = 0; i < posFlickTypes.length; i++) {
    var roll = posFlickTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="posFlickSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the negative flick options
  for (var i = 0; i < negFlickTypes.length; i++) {
    var roll = negFlickTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="negFlickSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the positive spin options
  for (var i = 0; i < posSpinTypes.length; i++) {
    var roll = posSpinTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="posSpinSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the negative spin options
  for (var i = 0; i < negSpinTypes.length; i++) {
    var roll = negSpinTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="negSpinSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the glider slow roll options
  if (sportingClass.value === 'glider') {
    for (var i = 0; i < gliderRollTypes.length; i++) {
      var roll = gliderRollTypes[i].split(':');
      html += '<option value="'+roll[0]+'" class="rollSelectOption"';
      if (roll[0] == pattern) html += ' selected="selected"';
      html += '>'+roll[1]+'</option>';
    }
  }
  
  html += '</select>';
  
  // build direction flip button
  if (elNr === 0) {
    html += '<div id="roll' + rollEl + '-' + elNr + '-flip" ' +
      'class="rollFlip smallButton';
  } else {
    html += '<div id="roll' + rollEl + '-' + elNr + '-flip" ' +
      'class="rollFlipTwo disableFUfig smallButton';
  }
  
  // decide wether the direction flip is activated for rolls
  if (pattern !== '') {

    if (elNr === 0) {
      // flip direction for the first roll
      if (thisRoll.flip[elNr]) html += ' on';
    } else {
      // XOR with the previous roll direction for subsequent rolls
      if (thisRoll.flip[elNr] != thisRoll.flip[elNr-1]) {
        html += ' on';
      } 
    }
  } else if (elNr !== 0) {
    // activate flip direction for subsequent rolls that are still empty
    html += ' on';
  }
  
  html += '"><div><div></div></div></div>';
  
  // build number flip button
  html += '<div id="roll' + rollEl + '-' + elNr + '-flipNumber" ' +
    'class="numberFlip smallButton';

  // decide wether the direction flip is activated for rolls
  if (pattern !== '') {
    if (thisRoll.flipNumber[elNr]) html += ' on';
  }
  
  html += '"><div><div></div></div></div>';
  
  // build roll comment field
  html += '<input type="text" id="roll' + rollEl + '-' + elNr +
    '-comment" class="rollComment" value="';
  if (thisRoll.comment[elNr]) {
    html += thisRoll.comment[elNr].replace(/^\|/, '');
  }
  html += '">';
  span.innerHTML = html;
  parent.appendChild (span);
  // give browser time to build the DOM from innerHTML before adding
  // events
  window.setTimeout (function(){
    var el = document.getElementById('roll' + rollEl + '-' + elNr);
    if (el) {
      el.addEventListener('change', updateFigure, false);
      document.getElementById('roll' + rollEl + '-' + elNr + '-flip').addEventListener('click', clickButton, false);
      document.getElementById('roll' + rollEl + '-' + elNr + '-flipNumber').addEventListener('click', clickButton, false);
      document.getElementById('roll' + rollEl + '-' + elNr + '-comment').addEventListener('change', updateFigure, false);
    }
  }, 200);
}

// createExampleSequence will build an example sequence and add it to
// the demo menu list
function createExampleSequence (year, rnLower, rules, cat, seq, string) {
  var key = year + rules + ' ' + cat + ' ' + seq;
  var sequence = '<sequence><class>';
  if (rnLower.match(/^glider-/)) {
    sequence += 'glider';
  } else {
    sequence += 'powered';
  }
  sequence += '</class><rules>' + rules + '</rules>' +
    '<category>' + cat + '</category>' +
    '<program>' + seq + '</program>' +
    '<sequence_text>' + string + '</sequence_text>';
  if (rulesLogo[rules.toLowerCase()]) {
    sequence += '<logo>' + rulesLogo[rules.toLowerCase()] + '</logo>';
  }
  sequence += '<oa_version>' + version + '</oa_version></sequence>';
  console.log ('Adding example sequence: ' + key);
  exampleSequences[key] = sequence;
  addExampleSequenceToMenu (key);
}  

// addExampleSequenceToMenu will add an entry in the demo menu list
function addExampleSequenceToMenu (key) {
  var el = document.getElementById('exampleSequences');
  var year = key.match (/^[\d]+/)[0];
  if (year) {
    var li = document.getElementById('year' + year);
    if (!li) {
      li = document.createElement('li');
      li.setAttribute ('id', 'year' + year);
      li.innerHTML = '<a href="#">' + year + '</a>';
      var ul = document.createElement('ul');
      li.appendChild (ul);
      el.appendChild (li);
    } else {
      var ul = li.lastChild;
    }
    var subli = document.createElement('li');
    subli.innerHTML = '<a href="#">' + key.replace(/^[\d]+[ ]*/, '') + '</a>';
    subli.setAttribute ('id', 'example-' + key);
    subli.addEventListener ('click', exampleSequence, false);
    ul.appendChild(subli);
  } else {
    var li = document.createElement('li');
    li.innerHTML = '<a href="#">' + key + '</a>';
    li.setAttribute ('id', 'example-' + key);
    li.addEventListener ('click', exampleSequence, false);
    el.appendChild(li);
  }
}
  
// setOptions will:
// -add example sequence entries to the menu
// -set correct options in settings dialog
function setOptions () {
  // add example sequence entries
  for (key in exampleSequences) {
    addExampleSequenceToMenu (key);
  }

  // set settings dialog options
  
  // create language chooser, with default language
  var el = document.getElementById('language');
  for (key in lang) {
    var option = document.createElement('option');
    option.setAttribute('value', key);
    option.innerHTML = lang[key][key];
    el.appendChild(option);
  }
  el.setAttribute('value', defaultLanguage);

  // set default values
  document.getElementById ('numberInCircle').setAttribute('value', numberInCircle);
  document.getElementById ('zipImageFilenamePattern').setAttribute('value', zipImageFilenamePattern);
  document.getElementById ('zipImageFilenamePattern').setAttribute('size', zipImageFilenamePattern.length);

  // set roll font sizes
  for (var key in rollFont) {
    var opt = document.getElementById('t_roll' + key[0].toUpperCase() + key.slice(1));
    opt.setAttribute('value', rollFont[key]);
    if (rollFont[key] == rollFontSize) {
      opt.setAttribute ('selected', 'selected');
    }
  }
  
  // add styles to settings dialog, sorted alphabetically
  var el = document.getElementById('styles');
  var sortKeys = Object.keys(style).sort();
  for (var i = 0; i < sortKeys.length; i++) {
    var key = sortKeys[i];
    styleSave[key] = style[key];
    var opt = document.createElement('option');
    opt.setAttribute('value', key);
    opt.innerHTML = key;
    el.appendChild(opt);
  }
  getStyle();
}

// loadSettingsStorage will load the settings from storage 'settings'
function loadSettingsStorage () {
  function f (c) {
    var settings = c.settings;
    if (settings) {
      settings = settings.split('|');
      for (var i = settings.length - 1; i >= 0; i--) {
        var setting = settings[i].split('=');
        var el = document.getElementById (setting[0]);
        var value = decodeURI(setting[1]);
        if (el.type === 'checkbox') {
          if (setting[1] == 1) {
            el.setAttribute ('checked', 'checked');
          } else {
            el.removeAttribute ('checked');
          }
        } else if (el.type.match (/^select/)) {
          // only set values that are in the list in a select
          var el = document.getElementById (setting[0]);
          var nodes = el.childNodes;
          for (var key in nodes) {
            // see if exact value is in there and set and break if so
            if (nodes[key].value == value) {
              el.value = value;
              break;
            }
            // if the value is numeric, find closest match
            if ((parseFloat(nodes[key].value) == nodes[key].value) &&
              (parseFloat(value) == value)) {
              if (Math.abs(nodes[key].value - value) < Math.abs(el.value - value)) {
                el.value = nodes[key].value;
              }
            }
          }
        } else {
          el.value = value;
        }
      }
      updateUserTexts();
      numberInCircle = (document.getElementById('numberInCircle').checked)? true : false;
      changeRollFontSize (document.getElementById('rollFontSize').value);
    }
  }
  if (storage) getLocal ('settings', f);
}

// saveSettingsStorage will save the settings to storage 'settings'
function saveSettingsStorage () {
  if (storage) {
    var settings = [];
    for (var i = saveSettings.length - 1; i >=0; i--) {
      var el = document.getElementById(saveSettings[i]);
      var value = '';
      if (el.type === 'checkbox') {
        if (el.checked) {
          value = 1;
        } else {
          value = 0;
        }
      } else {
        value = encodeURI(el.value);
      }
      settings.push (el.id + '=' + value);
    }
    storeLocal ('settings', settings.join('|'));
  }
}

// changeLanguage will change the interface language
function changeLanguage () {
  updateUserTexts();
  saveSettingsStorage();
  checkSequenceChanged(true);
}

// getStyle will retrieve a style and put it's value in the Settings
// styleString field
function getStyle() {
  var key = document.getElementById('styles').value;
  document.getElementById('styleString').value = style[key];
}

// updateStyle will change a style after it has been changed in the
// Settings styleString field
function updateStyle() {
  style[document.getElementById('styles').value] = document.getElementById('styleString').value;
  // update rollFontSize if applicable
  if (document.getElementById('styles').value === 'rollText') {
    rollFontSize = style.rollText.match(regexRollFontSize)[1];
  }
  // redraw sequence
  draw();
}

// resetStyle resets a style (or all) to the default value
function resetStyle(all) {
  if (all) {
    for (key in style) style[key] = styleSave[key];
  } else {
    var key = document.getElementById('styles').value;
    style[key] = styleSave[key];
  }
  getStyle();
  draw();
}

// restoreDefaultSettings restores all settings to their default values
function restoreDefaultSettings () {
  // close settings dialog
  settingsDialog ();
  confirmBox (
    userText.restoreDefaultSettingsConfirm,
    userText.restoreDefaultSettings,
    function(){
      storeLocal ('settings', '');
      window.document.removeEventListener('beforeunload', preventUnload);
      // reload the page, sequence will be provided by localStorage
      window.location.reload(true);
    }
  );
}
 
// updateNonArestiRolls is called when "non-Aresti rolls" is changed in
// settings
function updateNonArestiRolls() {
  saveSettingsStorage();
  draw();
}

// updateNumberInCircle is called when "number in circle" is changed in
// settings
function updateNumberInCircle() {
  saveSettingsStorage();
  numberInCircle = (!numberInCircle);
  draw();
}

// updateRollFontSize is called when "roll font size" is changed in
// settings
function updateRollFontSize() {
  saveSettingsStorage();
  changeRollFontSize(this.value);
  draw();
}

// updateGridColumns is called when "Grid columns" is changed in settings
function updateGridColumns() {
  saveSettingsStorage();
  selectForm('Grid');
}

// setPilotCardForm will show or hide pilot card options
function setPilotCardForm () {
  if (document.getElementById('printFormPilotCards').checked) {
    document.getElementById('pilotCardLayout').classList.remove('folded');
  } else {
    document.getElementById('pilotCardLayout').classList.add('folded');
  }
  saveImageSizeAdjust();
}

// setPilotCardLayout is activated when clicking a pilot card layout in
// the print/save dialog
function setPilotCardLayout() {
  var els = document.getElementsByClassName ('pilotCardLayout');
  for (i = els.length - 1; i >= 0; i--) {
      els[i].classList.remove ('active');
  }
  this.classList.add ('active');
}

/** DEPRECATED in 1.4.0 as we set the size by percentage
// setPilotCardUnits changes the values for X and Y when the units change
function setPilotCardUnits () {
  var el = {'X':document.getElementById('pilotCardX'),
            'Y':document.getElementById('pilotCardY')};
  if (this.value === 'cm') {
    el.X.value = roundTwo(el.X.value * 2.54);
    el.Y.value = roundTwo(el.Y.value * 2.54);
  } else {
    el.X.value = roundTwo(el.X.value / 2.54);
    el.Y.value = roundTwo(el.Y.value / 2.54);
  }
}

// setRatio sets the value of element 'id' to
// (value of element e) * ratio
function setRatio (id, e, ratio) {
  document.getElementById (id).value = roundTwo(e.value * ratio);
}
*/

// selectPwrdGlider is activated when powered or glider is chosen
function selectPwrdGlider () {
  // update figure chooser
  changeFigureGroup();
  // update rule list
  updateRulesList();
  new combo('rules','#cc9','#ffc');
  changeCombo('rules');
  // select no figure to force roll option redraw
  selectFigure (false);
  // redraw including mini form A
  draw();
  // update sequence info
  changeSequenceInfo();
  // hide Harmony field for powered
  var el = document.getElementById ('harmonyField');
  if (sportingClass.value === 'powered') {
    el.setAttribute('style', 'opacity:0;');
  } else el.removeAttribute('style');
}

// setYAxisOffset sets the Y axis offset
function setYAxisOffset (offset) {
  yAxisOffset = offset;
  // set scaleLine object to prevent calculations in makeLine and other
  // functions
  if (curvePerspective) {
    scaleLine.x = yAxisScaleFactor * Math.cos(yAxisOffset * degToRad);
    scaleLine.y = yAxisScaleFactor * Math.sin(yAxisOffset * degToRad);
  } else {
    scaleLine.x = 1;
    scaleLine.y = 1;
  }
}

// updateFigureEditor will update the figure editor for the
// provided figureId
function updateFigureEditor () {
  displaySelectedFigure();
  updateFigureOptions(selectedFigure.id);
  addRollSelectors(selectedFigure.id);
}

// showFigureSelector displays the base figure selector
// for some reason sliding only works from the left for mobile !?
function showFigureSelector () {
  updateFigureSelectorOptions ();
  document.getElementById('figureSelector').classList.add('active');
}

// hideFigureSelector hides the base figure selector
// but because we do need it to be available for various operations
// we hide it by removing the CSS class that shows it on screen
function hideFigureSelector () {
  document.getElementById('figureSelector').classList.remove('active');
}

// hideLogoChooser hides the logo chooser
function hideLogoChooser () {
  document.getElementById('logoChooserContainer').removeAttribute('class');
}

// displaySelectedFigure will display the currently selected figure
// in the figure editor
function displaySelectedFigure() {
  var svg = document.getElementById('selectedFigureSvg');
  prepareSvg(svg);

  if (selectedFigure.id !== null) {
    // assign this figure an id of -2 to prevent filtering etc.
    figures[-2] = figures[selectedFigure.id];
    // reset X and Y and clear figureStart to prevent adjusting
    // figure position
    X = 0;
    Y = 0;
    figureStart = [];
    drawFullFigure(-2, true, svg);
    var bBox = figures[-2].bBox;
    delete figures[-2];
    // Set viewBox from figure bBox
    var xMargin = bBox.width / 20;
    var yMargin = bBox.height / 20;
    svg.setAttribute('viewBox',
      roundTwo(bBox.x - xMargin) + ' ' +
      roundTwo(bBox.y - yMargin) + ' ' +
      roundTwo(bBox.width + xMargin * 2) + ' ' +
      roundTwo(bBox.height + yMargin * 2));
    svg.setAttribute('width', 140);
    svg.setAttribute('height', 140);
  }
}

// updateFigureOptions will update all options for editing a figure
// var figureId is the id of the figures[] object
function updateFigureOptions (figureId) {
  if (selectedFigure.id === null) {
    // move figure box right
    document.getElementById('selectedFigure').classList.remove('active');
    // hide figure modifiers
    document.getElementById('figureOptions').setAttribute('style', 'display:none;');
    document.getElementById('unknownFigure').classList.add('noDisplay');
    document.getElementById('entryExit').setAttribute('style', 'display:none;');
    // hide comments box
    document.getElementById('commentSection').classList.add('noDisplay');
    // hide Free Unknown disabled options warning
    document.getElementById('FUfigOptionsDisabled').classList.add ('noDisplay');
  } else {
    // move figure box left
    document.getElementById('selectedFigure').classList.add('active');
    // show figure modifiers
    document.getElementById('figureOptions').removeAttribute('style');
    document.getElementById('entryExit').removeAttribute('style');
    // set switchFirstRoll
    var image = document.getElementById('switchFirstRoll').firstChild.firstChild;
    if (figures[figureId].switchFirstRoll) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchFirstRoll === false) {
      image.setAttribute('src', mask.off);
    } else {
      image.setAttribute('src', mask.disable);
    }
    // set switchX
    var image = document.getElementById('switchX').firstChild.firstChild;
    if (figures[figureId].switchX) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchX === false) {
      image.setAttribute('src', mask.off);
    } else {
      image.setAttribute('src', mask.disable);
    }
    // set switchY
    var image = document.getElementById('switchY').firstChild.firstChild;
    if (figures[figureId].switchY) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchY === false) {
      image.setAttribute('src', mask.off);
    } else image.setAttribute('src', mask.disable);
    // set subSequence
    var image = document.getElementById('subSequence').firstChild.firstChild;
    var el = document.getElementById('subSequenceDirection');
    if (figures[figureId].subSequence) {
      image.setAttribute('src', mask.on);
      el.classList.remove ('noDisplay');
      document.getElementById('subSequenceDirections').value = figures[figureId].subSequence;
    } else {
      image.setAttribute('src', mask.off);
      el.classList.add ('noDisplay');
    }
    // set correct scale
    document.getElementById('scale').value = figures[figureId].scale;
    // set move
    // first we disable all selectors and remove values
    document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.off);
    document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.off);
    document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.off);
    document.getElementById('moveXCont').classList.add ('noDisplay');
    document.getElementById('moveYCont').classList.add ('noDisplay');
    document.getElementById('moveX-value').value = '';
    document.getElementById('moveY-value').value = '';
    
    // go back in the figure list until we end up at the beginning OR
    // find a real figure OR find a move figure
    var i = figureId - 1;
    while ((i >= 0) && !figures[i].figNr) {
      var prevFig = figures[i];
      if (prevFig) {
        if (prevFig.moveTo) {
          document.getElementById('moveX-value').value = prevFig.moveTo[0];
          document.getElementById('moveY-value').value = prevFig.moveTo[1];
          document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.on);
          document.getElementById('moveXCont').classList.remove ('noDisplay');
          document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
          document.getElementById('moveYCont').classList.remove ('noDisplay');
          break;
        } else if (prevFig.curveTo) {
          document.getElementById('moveX-value').value = prevFig.curveTo[0];
          document.getElementById('moveY-value').value = prevFig.curveTo[1];
          document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.on);
          document.getElementById('moveXCont').classList.remove ('noDisplay');
          document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
          document.getElementById('moveYCont').classList.remove ('noDisplay');
          break;
        } else if (prevFig.moveForward) {
          document.getElementById('moveX-value').value = prevFig.moveForward;
          document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.on);
          document.getElementById('moveXCont').classList.remove ('noDisplay');
          document.getElementById('moveXCont').firstChild.classList.add ('noDisplay');
          break;
        }
      }
      i--;
    }
    // no earlier real figure found, disable move selectors
    if (i == -1) {
      document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.disable);
      document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.disable);
      document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.disable);
    }
    
    // only show unknown figure letter selector when figureLetters
    // defined, or when the value was not 0 to enable changing
    var el = document.getElementById('unknownFigure');
    if ((figureLetters !== '') || figures[figureId].unknownFigureLetter) {
      // clear select list
      while (el.childNodes.length > 0) el.removeChild(el.lastChild);
      // build select list
      var listLetters = figureLetters;
      var option = document.createElement ('option');
      option.setAttribute ('value', '0');
      option.innerHTML = userText.noFreeUnknownFig;
      el.appendChild (option);
      if (connectFig.max > 0) {
        var option = document.createElement ('option');
        option.setAttribute ('value', 'L');
        option.innerHTML = userText.freeUnknownLink;
        el.appendChild (option);
        listLetters += 'L';
      }
      for (var j = 0; j < figureLetters.length; j++) {
        var option = document.createElement ('option');
        option.setAttribute ('value', figureLetters[j]);
        option.innerHTML = userText.freeUnknownFig + figureLetters[j];
        el.appendChild (option);
      }
      // add the actual figure letter as an option if not present in list
      if (figures[figureId].unknownFigureLetter) {
        if (!listLetters.match(new RegExp(figures[figureId].unknownFigureLetter))) {
          var option = document.createElement ('option');
          option.setAttribute ('value', figures[figureId].unknownFigureLetter);
          if (figures[figureId].unknownFigureLetter === 'L') {
            option.innerHTML = userText.freeUnknownLink;
          } else {
            option.innerHTML = userText.freeUnknownFig +
              figures[figureId].unknownFigureLetter;
          }
          el.appendChild (option);
        }
      }
        
      // set Unknown Figure and selector colors      
      el.classList.remove ('noDisplay');
      var used = [];
      for (var j = figures.length - 1; j >= 0; j--) {
        if (figures[j].unknownFigureLetter && figures[j].aresti && (j != figureId)) {
          if (figures[j].unknownFigureLetter != 'L') {
            used.push(figures[j].unknownFigureLetter);
          }
        }
      }
      var options = el.getElementsByTagName('option');
      for (var j = options.length - 1; j >= 0; j--) {
        if (used.indexOf(options[j].value) != -1) {
          options[j].classList.add('used');
        } else {
          options[j].classList.remove('used');
        }
      }
      if (figures[figureId].unknownFigureLetter) {
        el.value = figures[figureId].unknownFigureLetter;
      } else el.value = 0;
    } else {
      // make sure no value is selected and hide select box
      el.value = 0;
      el.classList.add ('noDisplay');
    }
    
    // check if dealing with a real figure. If so, allow upright/inverted setting
    if (fig[figures[figureId].figNr]) {
      // set entry attitude button
      var pattern = fig[figures[figureId].figNr].pattern;
      document.getElementById('figEntryButton').classList.remove('inverted');
      if (pattern[0] === '-') {
        document.getElementById('figEntryButton').classList.add('inverted');
      }      
      // set exit attitude button
      document.getElementById('figExitButton').classList.remove('inverted');
      if (pattern[pattern.length - 1] === '-') {
        document.getElementById('figExitButton').classList.add('inverted');
      }
    }
    
    // set entry extension
    document.getElementById('entryExt-value').value = figures[figureId].entryExt;
    // set exit extension
    document.getElementById('exitExt-value').value = figures[figureId].exitExt;
    // show comments box
    var el = document.getElementById('commentSection');
    el.classList.remove('noDisplay');
    var el = document.getElementById('comments');
    if (figures[figureId].comments) {
      el.value = figures[figureId].comments;
    } else el.value = '';
    
    var disable = false;
    var el = document.getElementById('FUfigOptionsDisabled');
    el.classList.add ('noDisplay');
    // when the figure is a Free Unknown figure with a letter, disable
    // disableFUfig buttons and disableRollFUfig select
    if (figures[selectedFigure.id].unknownFigureLetter) {
      if (figures[selectedFigure.id].unknownFigureLetter !== 'L') {
        disable = true;
        el.classList.remove ('noDisplay');
      }
    }
    
    // the DOM may need some time to update classes, so wait before
    // enabling/disabling
    setTimeout (function(){
      var els = document.getElementsByClassName ('disableFUfig');
      for (var i = els.length - 1; i >= 0; i--) {
        if (disable) {
          els[i].classList.add ('disable');
        } else {
          els[i].classList.remove ('disable');
        }
      }
  
      var els = document.getElementsByClassName ('disableRollFUfig');
      for (var i = els.length - 1; i >= 0; i--) {
        if (disable) {
          els[i].setAttribute ('disabled', 'disabled');
        } else {
          els[i].removeAttribute ('disabled');
        }
      }
    }, 200);

  }
}

// addRollSelectors will add all applicable roll selectors when
// editing a figure
// var figureId is the id of the figures[] object
function addRollSelectors (figureId) {
  var el = document.getElementById('rollInfo');
  if (figureId === null) {
    el.setAttribute('style', 'display:none;');
  } else if (fig[figures[figureId].figNr]) {
    el.removeAttribute('style');
    var rolls = fig[figures[figureId].figNr].rolls;
    // clear selectors
    while (el.childNodes.length > 0) el.removeChild(el.lastChild);
    // show the applicable roll selectors
    if (rolls) {
      var rollNr = 0;
      for (var i = 0; i < rolls.length; i++) {
        if (parseInt(rolls[i]) > 0) {
          var rollInfo = figures[figureId].rollInfo[i];
          var div = document.createElement('div');
          div.setAttribute('id', 'roll' + i);
          div.setAttribute('class', 'section');
          var divdiv = document.createElement ('div');
          divdiv.classList.add ('sectionLabel');
          divdiv.innerHTML = userText.rollPos[rollNr];
          div.appendChild (divdiv);
          var divdiv = document.createElement ('div');
          divdiv.classList.add ('sectionLabelClose');
          divdiv.innerHTML = '&nbsp;';
          div.appendChild (divdiv);
          // loop until max rolls per element + 1
          for (var j = 0; j < rollsPerRollElement + 1; j++) {
            var pattern = figures[figureId].rollInfo[i].pattern[j-1];
            if (pattern) {
              pattern = pattern.replace('-', '');
            } else {
              pattern = '';
            }
            // show the element when:
            // it's the first one OR the previous one is not empty
            // AND it's number is not higher than rollsPerRollElement
            if ((j == 0) || (pattern != '')) {
              if (j < rollsPerRollElement) {
                addRollSelectElement(figureId, i, j, div);
                var divdiv = document.createElement ('div');
                divdiv.classList.add ('clearBoth');
                div.appendChild (divdiv);
              }
            } else break;
          }
          // j indicates how many active subrolls there are
          var subRolls = j;
          // build the gaps element for subRolls rolls
          var divdiv = document.createElement ('div');
          divdiv.classList.add ('rollGaps');
          // only show 'Gaps' text for non-mobile
          if (!mobileBrowser) {
            var span = document.createElement('span');
            span.innerHTML = userText.gaps;
            div.appendChild (span);
          }
          var gap = figures[figureId].rollInfo[i].gap;
          for (var j = 0; j < subRolls; j++) {
            if (typeof gap[j] != 'undefined') {
              var thisGap = gap[j];
            } else {
              thisGap = 0;
            }
            var span = document.createElement('span');
            span.setAttribute('id', 'roll'+i+'-gap'+j);
            span.classList.add ('plusMin');
            span.appendChild (buildPlusMinElement('roll'+i+'-gap'+j+'-value', thisGap));
            divdiv.appendChild(span);
          }
          div.appendChild (divdiv);
          var divdiv = document.createElement ('div');
          divdiv.classList.add ('clearBoth');
          div.appendChild (divdiv);
          el.appendChild(div);
          rollNr++;
        }
      }
    }
  }
}

// setUndoRedo will update undo/redo buttons and redo object
function setUndoRedo (e, clear) {
  if (clear) {
    activeSequence[e] = [];
  }
  if (mobileBrowser) {
    if (activeSequence['undo'].length) {
      document.getElementById('undo').firstChild.firstChild.setAttribute('src', mask.off);
    } else {
      document.getElementById('undo').firstChild.firstChild.setAttribute('src', mask.disable);
    }
    if (activeSequence['redo'].length) {
      document.getElementById('redo').firstChild.firstChild.setAttribute('src', mask.off);
    } else {
      document.getElementById('redo').firstChild.firstChild.setAttribute('src', mask.disable);
    }
  } else {
    if (activeSequence['undo'].length) {
      document.getElementById('undo').firstChild.firstChild.setAttribute('src', mask.smalloff);
    } else {
      document.getElementById('undo').firstChild.firstChild.setAttribute('src', mask.smalldisable);
    }
    if (activeSequence['redo'].length) {
      document.getElementById('redo').firstChild.firstChild.setAttribute('src', mask.smalloff);
    } else {
      document.getElementById('redo').firstChild.firstChild.setAttribute('src', mask.smalldisable);
    }
  }
}

// setEntryExitElements will set correctly sized entry/exit att buttons
function setEntryExitElements () {
  for (var i = 1; i>= 0; i--) {
    var el = document.getElementById(['figEntryButton', 'figExitButton'][i]);
    if (mobileBrowser) {
      el.classList.remove ('smallButton');
      el.classList.add ('button');
      //el.firstChild.firstChild.setAttribute('src', mask.off);
    } else {
      el.classList.remove ('button');
      el.classList.add ('smallButton');
      //el.firstChild.firstChild.setAttribute('src', mask.smalloff);
    }
  }
}
    
// updateFigure will be called when any figure option is updated
function updateFigure() {
  // get the current string
  var string = figures[selectedFigure.id].string;
  // get the base figure number
  var figNr = figures[selectedFigure.id].figNr;
  // get the pattern
  var pattern = fig[figNr].pattern;
  // get the base
  var base = fig[figNr].base;
  // update the original pattern for entry/exit changes
  var entry = document.getElementById('figEntryButton');
  var exit = document.getElementById('figExitButton');
  if (entry.classList.contains ('inverted')) {
    pattern = '-' + pattern.substring(1);
    base = '-' + base.substring(1);
  } else {
    pattern = '+' + pattern.substring(1);
    base = '+' + base.substring(1);
  }
  if (exit.classList.contains ('inverted')) {
    pattern = pattern.substring(0, pattern.length - 1) + '-';
    base = base.substring(0, base.length - 1) + '-';
  } else {
    pattern = pattern.substring(0, pattern.length - 1) + '+';
    base = base.substring(0, base.length - 1) + '+';
  }
  // check if the base exists
  if (!figBaseLookup [base]) {
    // if not, try flipping entry AND exit
    base = fig[figNr].base.replace(/-/g, '#').replace(/\+/g, '-').replace(/#/g, '+');
    if (figBaseLookup [base]) {
      pattern = fig[figNr].pattern.replace(/-/g, '#').replace(/\+/g, '-').replace(/#/g, '+');
      // set figEntryButton and figExitButton to correct state
      if (base[0] === '-') {
        entry.classList.add ('inverted');
      } else {
        entry.classList.remove ('inverted');
      }
      if (base[base.length - 1] === '-') {
        exit.classList.add ('inverted');
      } else {
        exit.classList.remove ('inverted');
      }
    } else {
      // Doesn't help. Restore original pattern. No option for changing
      // upright/inverted
      pattern = fig[figNr].pattern;
    }
  }
  // remove + from pattern
  pattern = pattern.replace(/\+/g, '');
  // add rolls
  var rollEl = 0;
  // start at roll 1 for figures that don't have roll element 0
  if (!document.getElementById('roll0-0')) rollEl = 1;
  while (pattern.match(/[\^\&\_]/)) {
    var rolls = '';
    for (var rollNr = 0; rollNr <= rollsPerRollElement; rollNr++) {
      // apply gaps
      var gap = document.getElementById('roll'+rollEl+'-gap'+rollNr+'-value');
      // only apply when the input element exists
      if (gap) {
        gap = gap.value;
        if (gap < 0) {
          rolls += new Array(1 - gap).join(userpat.lineshorten);
        } else if (gap > 0) {
          gap = gap / 3;
          rolls += new Array(parseInt(gap) + 1).join(userpat.rollext);
          rolls += new Array(Math.round((gap-parseInt(gap))*3) + 1).join(userpat.rollextshort);
        }
      }
      // apply rolls, roll direction flips, roll number flips and comments
      var thisRoll = document.getElementById('roll'+rollEl+'-'+rollNr);
      // only apply when the input element exists
      if (thisRoll) {
        var rollFlip = document.getElementById('roll'+rollEl+'-'+rollNr+'-flip');
        var flipNumber = document.getElementById('roll'+rollEl+'-'+rollNr+'-flipNumber');
        if (thisRoll.value != '') {
          var comment = '';
          if (rollFlip.classList.contains ('on')) {
            rolls += ',';
          } else {
            if (rolls.match(/[0-9fs]/)) rolls += ';';
          }
          if (flipNumber.classList.contains ('on')) {
            comment = userpat.flipNumber; // add to start of comment
          }
          comment += document.getElementById('roll'+rollEl+'-'+rollNr+'-comment').value;
          if (comment !== '') {
            comment = userpat.comment + comment + userpat.comment;
          }
          rolls += comment;
          rolls += thisRoll.value;
        }
      }
    }
    if (rollEl == 0) {
      // set switchFirstRoll
      var image = document.getElementById('switchFirstRoll').firstChild.firstChild;
      if (image.getAttribute('src') == mask.on) {
        rolls += ';' + userpat.switchDirX;
      }
    } 
    pattern = pattern.replace(/[\^\&\_]/, rolls);
    rollEl++;
  }
  // remove non-necessary roll elements in parenthesis, but only when
  // there are no active rolls in parenthesis
  // result is e.g.: dhd or dhd(1)()
  if (!pattern.match (/\([^)]+\)/)) {
    pattern = pattern.replace (/\(\)/g, '');
  }
  // move back in the figure cueue to find scale, move or subsequence
  // patterns
  var i = selectedFigure.id - 1;
  var moveToFig = false;
  var curveToFig = false;
  var moveForwardFig = false;
  var moveDownFig = false;
  var scaleFig = false;
  var subSequence = false;
  // continue as long as we're not at the beginning and are not on
  // a regular figure  
  while ((i >= 0) && !figures[i].figNr) {
    var prevFig = figures[i];
    if (prevFig) {
      if (prevFig.moveTo || prevFig.curveTo) {
        moveToFig = i;
      } else if (prevFig.moveForward) {
        moveForwardFig = i;
      } else if (prevFig.moveDown) {
        moveDownFig = i;
      } else if (prevFig.scale) {
        scaleFig = i;
      } else if (prevFig.subSequence) {
        subSequence = i;
      }
    }
    i--;
  }
  // set magnification
  el = document.getElementById('scale');
  if (scaleFig === false) {
    if (el.value != 0) {
      updateSequence (selectedFigure.id - 1, el.value+'%', false);
      return;
    }
  } else {
    if (el.value != 0) {
      updateSequence (scaleFig, el.value+'%', true);
    } else {
      updateSequence (scaleFig, '', true);
      return;
    }
  }
  var moveX = document.getElementById('moveX-value').value;
  moveX = (moveX)? parseInt(moveX) : 0;
  var moveY = document.getElementById('moveY-value').value;
  moveY = (moveY)? parseInt(moveY) : 0;
  var el1 = document.getElementById('moveForward').firstChild.firstChild;
  var el2 = document.getElementById('straightLine').firstChild.firstChild;
  var el3 = document.getElementById('curvedLine').firstChild.firstChild;
  if (el2.getAttribute('src') == mask.on) {
    // set moveTo with straight line
    // remove any moveForward
    if (moveForwardFig != false) {
      updateSequence (moveForwardFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // remove any moveDown
    if (moveDownFig != false) {
      updateSequence (moveDownFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // replace any moveTo or curveTo
    //if ((Math.abs(moveX) > 0) || (Math.abs(moveY) > 0)) {
      var movePattern = '['+moveX+','+moveY+']';
      if (moveToFig != false) {
        // replace moveTo HERE!
        updateSequence (moveToFig, movePattern, true);
      } else {
        // add new moveTo
        updateSequence (selectedFigure.id - 1, movePattern, false);
        return;
      }
  } else if (el3.getAttribute('src') == mask.on) {
    // set moveTo with curved line
    // remove any moveForward
    if (moveForwardFig != false) {
      updateSequence (moveForwardFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // remove any moveDown
    if (moveDownFig != false) {
      updateSequence (moveDownFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // replace any moveTo or curveTo
    //if ((Math.abs(moveX) > 0) || (Math.abs(moveY) > 0)) {
      var movePattern = '('+moveX+','+moveY+')';
      if (moveToFig != false) {
        // replace curveTo HERE!
        updateSequence (moveToFig, movePattern, true);
      } else {
        // add new curveTo
        updateSequence (selectedFigure.id - 1, movePattern, false);
        return;
      }
  } else if (el1.getAttribute('src') == mask.on) {
    // set moveForward
    // remove any moveTo
    if (moveToFig != false) {
      updateSequence (moveToFig, '', true);
      if (moveForwardFig != false) moveForwardFig--;
    }
    // replace any moveForward
    if (parseInt(moveX) > 0) {
      if (moveX == 1) {
        var movePattern = '>';
      } else var movePattern = moveX + '>';
      if (moveForwardFig != false) {
        // replace moveForward
        updateSequence (moveForwardFig, movePattern, true);
      } else {
        // add new moveForward
        updateSequence (selectedFigure.id - 1, movePattern, false);
        return;
      }
    } else if (moveForwardFig != false) {
      // remove moveForward
      updateSequence (moveForwardFig, '', true);
    }
  } else {
    // remove moveTo and moveForward
    if (moveToFig != false) {
      updateSequence (moveToFig, '', true);
    }
    if (moveForwardFig != false) {
      updateSequence (moveForwardFig, '', true);
    }
  }
  // set correct subSequence type
  var el = document.getElementById('subSequence').firstChild.firstChild;
  var sel = document.getElementById('subSequenceDirections');
  if (el.getAttribute('src') === mask.on) {
    figures[selectedFigure.id].subSequence = sel.value;
    if (subSequence === false) {
      updateSequence (selectedFigure.id - 1, sel.value, false);
      //updateSequence (selectedFigure.id - 1, userpat.subSequence, false);
    } else {
      updateSequence (selectedFigure.id - 1, sel.value, true);
    }
  } else {
    if (subSequence !== false) {
      updateSequence (subSequence, '', true);
      sel.value = userpat.subSequence;
    }
  }

  // set entry extension
  var val = document.getElementById('entryExt-value').value;
  if (val < 0) {
    if (pattern[0] == '-') {
      // don't prepend + for negative entry
      pattern = new Array(1 - val).join(userpat.lineshorten) + pattern;
    } else {
      pattern = new Array(1 - val).join(userpat.lineshorten) + '+' + pattern;
    }
  } else if (val > 0) {
    val = val / 3;
    if (document.getElementById('figEntryButton').classList.contains ('inverted')) {
      // use '-' for negative entry
      pattern = new Array(parseInt(val) + 1).join('-') + pattern;
    } else {
      pattern = new Array(parseInt(val) + 1).join(userpat.longforward) + pattern;
    }      
    pattern = new Array(Math.round((val-parseInt(val))*3) + 1).join(userpat.forward) + pattern;
  }

  // set exit extension
  val = document.getElementById('exitExt-value').value;
  if (val < 0) {
    if (pattern[pattern.length - 1] == '-') {
      // don't prepend + for negative exit
      pattern += new Array(1 - val).join(userpat.lineshorten);
    } else {
      pattern += '+' + new Array(1 - val).join(userpat.lineshorten);
    }
  } else if (val > 0) {
    val = val / 3;
    if (document.getElementById('figExitButton').classList.contains ('inverted')) {
      // use '-' for negative exit
      pattern += new Array(parseInt(val) + 1).join('-');
    } else {
      pattern += new Array(parseInt(val) + 1).join(userpat.longforward);
    }      
    pattern += new Array(Math.round((val-parseInt(val))*3) + 1).join(userpat.forward);
  }

  // set switchY
  var image = document.getElementById('switchY').firstChild.firstChild;
  if (image.getAttribute('src') == mask.on) pattern += userpat.switchDirY; 

  // set switchX
  var image = document.getElementById('switchX').firstChild.firstChild;
  if (image.getAttribute('src') == mask.on) pattern += userpat.switchDirX;

  // when there was a flipYaxis in this figure, add it to the beginning
  // of the pattern
  if (figures[selectedFigure.id].string.indexOf(userpat.flipYaxis) > -1) {
    pattern = userpat.flipYaxis + pattern;
  }
  
  // update comments, including Free Unknown letter
  // keep this at the end to prevent disturbing other items
  var val = document.getElementById('unknownFigure').value;
  var comments = (val != 0)? '@' + val : '';

  comments += document.getElementById('comments').value;

  // retrieve original comments
  if (figures[selectedFigure.id].unknownFigureLetter) {
    var oldComments = '@' + figures[selectedFigure.id].unknownFigureLetter;
  } else {
    var oldComments = '';
  }
  oldComments += figures[selectedFigure.id].comments;
  if (!oldComments) oldComments = '';

  if (comments != oldComments) {
  // move back in the figure queue to find comments
    var match = false;
    var i = selectedFigure.id - 1;
    while ((i >= 0) && !figures[i].figNr) {
      var prevFig = figures[i];
      if (prevFig) {
        // find a match for comments
        match = prevFig.string.match(/^"([^"]*)"$/);
        if (match) {
          if (comments != '') {
            updateSequence (i, '"' + comments + '"', true);
          } else {
            updateSequence (i, '', true);
          }
          break;
        }
      }
      i--;
    }
    // no match, apply new
    if (!match && (comments != '')) {
      updateSequence (selectedFigure.id - 1, '"' + comments + '"', false);
    }
  }

  // update the sequence with the final pattern
  if (pattern !== string) {
    updateSequence (selectedFigure.id, pattern, true);
  } else {
    updateFigureOptions (selectedFigure.id);
  }
}

// latestVersion makes sure the latest version is installed
function latestVersion() {
  // show version
  document.getElementById('version').innerHTML = sprintf (
    userText.version, version);
  var img = document.getElementById('latestVersion');
  // displays a link to download the latest version of OpenAero when
  // a newer one than the one being used is available and we are
  // running from file. This is DEPRECATED but we'd rather have users
  // using new file versions in case they insist
  
  // Only do this when we are not running from openaero.net or as
  // Chrome app. In this case, we hide the container completely
  
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    // Check for appcache when using http
    if (window.applicationCache) window.applicationCache.update();
    img.parentNode.classList.add('noDisplay');
  } else {
    
    img.removeAttribute('onerror');
    // Apply latest version img src
    img.setAttribute('src', 'http://openaero.net/openaero.php?f=version&version=' + version);
    // Hide the image on error (e.g. no internet connection)
    img.setAttribute('onerror', "this.style.display = 'none';");
  }
}

// preventUnload is used to set a question asking the user if he wants
// to leave OpenAero. Argument is false (no question) or true (question)
function preventUnload () {
  return userText.confirmLeave;
}

// addUpdateListener adds an event listener that checks if a new app
// cache update is available
function addUpdateListener () {
  if (window.applicationCache) {
    window.applicationCache.addEventListener('updateready', function(e) {
      if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        // Swap it in and reload the page to get the new hotness.
        window.applicationCache.swapCache();
        // only reload after confirmation
        if (storage) {
          var t = userText.loadNewVersion;
        } else {
          var t = userText.loadNewVersionNoCookies;
        }
        confirmBox (t, userText.loadNewVersionTitle, function(){
          sequenceSaved = true;
          window.document.removeEventListener('beforeunload', preventUnload);
          // reload the page, sequence will be provided by localStorage
          window.location.reload(true);
        });
      } else {
        // Manifest didn't change. Nothing new to serve.
      }
    }, false);
  }
}

// checkUpdateDone checks if an update was just done. If so, it presents
// a dialog to the user
function checkUpdateDone() {
 function f (c) {
    var oldVersion = c.version;
    if (oldVersion !== version) {
      alertBox (versionNew);
      // create link for changelog
      document.getElementById('changelog').addEventListener (
        'mousedown',
        function() {helpWindow ('changelog.txt', 'changelog.txt');}
      );
      storeLocal ('version', version);
    }
  }   
  // this only works when storage is enabled
  if (storage) getLocal ('version', f);
}

// changeSequenceInfo is called whenever any part of the sequence info
// may be changed
function changeSequenceInfo () {
  // change the web page title to reflect the sequence info
  var title = 'OpenAero - ';
  title += document.getElementById('category').value + ' ';
  title += document.getElementById('program').value + ' ';
  title += document.getElementById('location').value + ' - ';
  title += document.getElementById('date').value + ' - ';
  title += document.getElementById('pilot').value;
  document.title = title;
  var xml = '<sequence>\n'
  for (i = 0; i < sequenceXMLlabels.length; i++) {
    var el = document.getElementById(sequenceXMLlabels[i]);
    if (el) {
      if (el.value !== '') {
      xml += '  <' + sequenceXMLlabels[i] + '>' +
        el.value + '</' + sequenceXMLlabels[i] + '>\n';
      }
    }
  }
  xml += '</sequence>';
  if (xml != activeSequence.xml) {
    if (activeSequence.addUndo) {
      // add undo and clear redo
      if (activeSequence.xml) {
        activeSequence.undo.push (activeSequence.xml);
        // maximum 100 undos
        if (activeSequence.undo.length > 100) {
          activeSequence.undo.shift();
        }
      }

      setUndoRedo ('redo', true);
    }
    // put everything in activeSequence.xml object
    activeSequence.xml = xml;
    // save activeSequence.xml in storage 'sequence'
    storeLocal ('sequence', activeSequence.xml);
  }
  checkInfo();
}

// buildFigureXML creates a well-formatted XML string that holds all
// sequence details. It is later appended at the end of the .seq file 
function buildFigureXML () {
  var ff = document.createElement('figures');
  var figNr = 0;
  figureK = 0;
  for (var i = 0; i < figures.length; i++) {
    aresti = figures[i].aresti;
    k = figures[i].k;
    if (aresti) {
      figNr++;
      var figK = 0;
      var f = ff.appendChild(document.createElement('figure'));
      var nr = f.appendChild(document.createElement('nr'));
      nr.appendChild(document.createTextNode(figNr));
      if (figures[i].unknownFigureLetter) {
        var letter = f.appendChild(document.createElement('letter'));
        letter.appendChild(document.createTextNode(figures[i].unknownFigureLetter));
      }
      if (document.getElementById('class').value == 'glider') {
        var superFamily = getSuperFamily (aresti, 'glider');
      } else {
        var superFamily = getSuperFamily (aresti, document.getElementById('category').value);
      }
      if (superFamily) {
        var sf = f.appendChild(document.createElement('sf'));
        sf.appendChild(document.createTextNode(superFamily));
      }

      for (var j = 0; j < aresti.length; j++) {
        var element = f.appendChild(document.createElement('element'));
        var aj = element.appendChild(document.createElement('aresti'));
        aj.appendChild(document.createTextNode(aresti[j]));
        var kj = element.appendChild(document.createElement('k'));
        kj.appendChild(document.createTextNode(k[j]));
        figK = figK + parseInt(k[j]);
      }
      // Adjust figure K for connectors
      if (figures[i].unknownFigureLetter) {
        if (figures[i].unknownFigureLetter == 'L') {
          if (connectors <= connectFig.max) {
            figK = connectFig.totalK / connectors;
          } else if (connectFig.max > 0) {
            figK = connectFig.totalK / connectFig.max;
          }
        }
      }
      // Adjust figure K for floatingPoint
      if (figures[i].floatingPoint) {
        figK -= 1;
      }
      var fK = f.appendChild(document.createElement('figk'));
      fK.appendChild(document.createTextNode(figK));
      figureK += figK;
    }
  }
  var ffK = ff.appendChild(document.createElement('figurek'));
  ffK.appendChild(document.createTextNode(figureK));
  if (parseInt(document.getElementById('positioning').value)) {
    var totalK = figureK +
      parseInt(document.getElementById('positioning').value);
  } else var totalK = figureK;
  var tK = ff.appendChild(document.createElement('totalk'));
  tK.appendChild(document.createTextNode(totalK));
  return (new XMLSerializer().serializeToString(ff));
}

// buildSettingsXML creates a well-formatted XML string that holds all
// settings details. It is later appended at the end of the .seq file 
function buildSettingsXML () {
  var key, val, s, node;
  var settings = document.createElement('settings');
  for (var i = 0; i < saveSettings.length; i++) {
    key = saveSettings[i];
    // get the value or, if checkbox, if checked or not
    if (document.getElementById(key).type == 'checkbox') {
      val = document.getElementById(key).checked? true : false;
    } else {
      val = document.getElementById(key).value;
    }
    s = settings.appendChild(document.createElement('setting'));
    node = s.appendChild(document.createElement('key'));
    node.appendChild (document.createTextNode(key));
    node = s.appendChild(document.createElement('value'));
    node.appendChild (document.createTextNode(val));
  }
  return (new XMLSerializer().serializeToString(settings));
}

// changeCombo is executed when a combo box value is changed
// When noLogo is true, the logo is not changed
function changeCombo(id, noLogo) {
  var rules = document.getElementById('rules');
  var ruleName = rules.value.toLowerCase();
  // prepend glider- for glider
  if (document.getElementById('class').value === 'glider') {
    ruleName = 'glider-' + ruleName;
  }
  var category = document.getElementById('category');
  var categoryName = category.value.toLowerCase();
  var program = document.getElementById('program');
  var programName = program.value.toLowerCase();
  if (id === 'rules') {
    var categoryList = document.getElementById('categoryList');
    // Clean up category list
    while (categoryList.childNodes.length > 0) {
      categoryList.removeChild(categoryList.lastChild);
    }
    if (ruleName != '') {
      category.placeholder = '';
      category.removeAttribute ('disabled');
      // Populate category list
      if (seqCheckAvail[ruleName]) {
        for (n in seqCheckAvail[ruleName]['cats']) {
          if (seqCheckAvail[ruleName].cats[n].show) {
            var listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(seqCheckAvail[ruleName]['cats'][n]['name']));
            categoryList.appendChild(listItem);
          }
        }
      }
      new combo('category','#cc9','#ffc');
      if (rulesLogo[ruleName] && !noLogo) {
        selectLogo(rulesLogo[ruleName]);
      }
    } else {
      // disable category field
      category.value = '';
      category.placeholder = userText.selectRulesFirst;
      category.setAttribute ('disabled', 'disabled');
    }
    // set CIVA or IAC forms default
    iacForms = (ruleName === 'iac')? true : false;
    if (iacForms) {
      document.getElementById('iacForms').setAttribute('checked', 'checked');
    } else {
      document.getElementById('iacForms').removeAttribute('checked');
    }
    
    // update category
    changeCombo ('category');
  } else if (id === 'category') {
    var programList = document.getElementById('programList');
    // Clean up program list
    while (programList.childNodes.length > 0) programList.removeChild(programList.lastChild);
    if (categoryName != '') {
      program.placeholder = '';
      program.removeAttribute ('disabled');
      // Populate program list
      if (seqCheckAvail[ruleName]) {
        if (seqCheckAvail[ruleName]['cats'][categoryName]) {
          for (n in seqCheckAvail[ruleName]['cats'][categoryName]['seqs']) {
            if (seqCheckAvail[ruleName].cats[categoryName].seqs[n][0] != '*') {
              var listItem = document.createElement('li');
              listItem.appendChild(document.createTextNode(seqCheckAvail[ruleName]['cats'][categoryName]['seqs'][n]));
              programList.appendChild(listItem);
            }
          }
        }
      }
    } else {
      // disable program field
      program.value = '';
      program.placeholder = userText.selectCategoryFirst;
      program.setAttribute ('disabled', 'disabled');
    }
    new combo('program','#cc9','#ffc');
    
    // update program
    changeCombo ('program');
  } else if (id === 'program') {
    try {
      if (seqCheckAvail[ruleName]['cats'][categoryName]['seqs'][programName]) {
        // clear positioning and harmony values
        document.getElementById('positioning').value = '';
        document.getElementById('harmony').value = '';
        // Load rules, check the sequence and display any alerts
        var log = loadRules(ruleName, categoryName, programName);
      } else {
        if (rulesActive) {
          unloadRules ();
        }
      }
    } catch (error) {
      if (rulesActive) {
        unloadRules ();
      }
    }
  }
  changeSequenceInfo();
  // redraw sequence. May be necessary to update (mini) Form A
  checkSequenceChanged(true);
  // make sure only available figure groups are shown in chooser
  availableFigureGroups();
  return log;
}

// createSelection selects part of an input field. This can be used when
// editing figures
function createSelection(field, start, end) {
  if( field.createTextRange ) {
    var selRange = field.createTextRange();
    selRange.collapse(true);
    selRange.moveStart('character', start);
    selRange.moveEnd('character', end-start);
    selRange.select();
  } else if( field.setSelectionRange ) {
    field.setSelectionRange(start, end);
  } else if( field.selectionStart ) {
    field.selectionStart = start;
    field.selectionEnd = end;
  }
  // focus the field when we're not in the mobile version
  field.focus();
}

// buildLogoSvg will create a logo svg from a provided image string, width and height
function buildLogoSvg(logoImage, x, y, width, height) {
  
  function toInt32(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  }

  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("version", "1.2");
  svg.setAttribute("baseProfile", "tiny");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("xmlns:xlink", xlinkNS);
// svg images are included inline and scaled
  if (logoImage.match(/<svg/)) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(logoImage, "image/svg+xml");
    var svgBase = doc.getElementsByTagName('svg')[0];
    var scale = width / svgBase.getAttribute('width');
    if ((height / svgBase.getAttribute('height')) < scale) {
      scale = height / svgBase.getAttribute('height');
    }
    var group = document.createElementNS(svgNS, "g");
    group.setAttribute('transform', 'translate(' + x + ',' + y + 
      ') scale(' + scale.toFixed(4) + ')');
    group.appendChild(svgBase);
    svg.appendChild(group);
// other images are included through an xlink data url
  } else {
    // find image size and use this to set correct width and height of
    // image, using provided as max
    var img = document.createElement('img');
    img.src = logoImage;
    if (img.width) {
      var scale = width / img.width;
      if ((img.height * scale) > height) {
        var scale = height / img.height;
      }
      width = parseInt (img.width * scale);
      height = parseInt (img.height * scale);
    }
    var image = document.createElementNS (svgNS, "image");
    image.setAttribute('x', x);
    image.setAttribute('y', y);
    image.setAttribute('width', width);
    image.setAttribute('height', height);
    image.setAttribute('preserveAspectRatio', 'xMaxYMax');
    image.setAttributeNS(xlinkNS, 'href', logoImage);
    svg.appendChild (image);
  }
  svg.setAttribute("class", "logoSvg");
  svg.setAttribute("width", x + width);
  svg.setAttribute("height", y + height);
  return svg;
}

// logoChooser will display the available logos
// and allow for selection of a logo
function logoChooser() {
// define logo thumbnail width and height
  var width = 72;
  var height = 72;
  // show the logo chooser container
  var container = document.getElementById('logoChooserContainer');
  container.setAttribute('class', 'active');
  // clear logo file when present
  var el = document.getElementById('logoFile');
  if (el) el.value = '';
  // Show all the logo images
  container = document.getElementById('chooseLogo');
  // Clean up the container
  while (container.childNodes.length > 0) {
    container.removeChild(container.lastChild);
  }
  for (var logoName in logoImages) {
    var div = document.createElement('div');
    container.appendChild(div);
    var link = document.createElement('a');
    link.setAttribute("href", "#");
    link.setAttribute("alt", logoName);
    link.addEventListener ('click', selectLogo, false);
    div.appendChild(link);
    link.appendChild(buildLogoSvg(logoImages[logoName], 0, 0, width, height));
/*    link.setAttribute('style', 'margin-top:' + 
      parseInt((height - link.firstChild.getBBox().height) / 2) + 'px;');
    console.log(link.getAttribute('style'));*/
  }
}

// selectLogo is called when a logo is clicked in the logoChooser and
// will select the correct logo for use
function selectLogo(logo) {
  // get name from alt attribute when called from eventListener
  if (this.getAttribute) logo = this.getAttribute('alt');
  logoImg = logoImages[logo];
  document.getElementById('logo').value = logo;
  hideLogoChooser();
  drawActiveLogo();
  changeSequenceInfo();
}

// uploadLogo is used to upload a logo
function uploadLogo (file) {
  logoImages['mylogo'] = file;
  selectLogo ('mylogo');
}

// drawActiveLogo makes a small thumbnail of the active logo in the
// Sequence info and adds 'remove logo' link
function drawActiveLogo() {
  var width = 120; // maximum width
  var height = 60; // maximum height
  document.getElementById('logoImage').classList.remove ('noDisplay');
  document.getElementById('t_chooseLogo').classList.add ('noDisplay');
  // Create logo svg
  var link = document.getElementById('logoImage');
  if (link.firstChild) link.removeChild(link.firstChild);
  link.appendChild(buildLogoSvg(logoImg, 0, 0, width, height));

  document.getElementById('t_removeLogo').classList.remove ('noDisplay');
}

// removeLogo makes it possible to remove the previously chosen logo
function removeLogo() {
  logoImg = false;
  // Remove 'remove logo' link and logo image
  document.getElementById('t_removeLogo').classList.add ('noDisplay');
  document.getElementById('logoImage').classList.add ('noDisplay');
  document.getElementById('logo').value = '';
  // Add choose logo option
  document.getElementById('t_chooseLogo').classList.remove ('noDisplay');
  changeSequenceInfo();
}
  
// parseFiguresFile parses the figures file and stores it in several
// arrays for fast retrieval
function parseFiguresFile () {
  var groupRegex = new RegExp('^F[0-9]');
  var figGroupSelector = document.getElementById('figureGroup');
  var figGroupNr = 0;
  
  // add the Queue 'figure group' at the beginning
  figGroup[0] = {'family':'*', 'name':userText.figureQueue};
  // add an option for the group to the figure selector
  var option = document.createElement('option');
  option.setAttribute('value', 0);
  option.innerHTML = '* ' + userText.figureQueue;
  figGroupSelector.appendChild(option);

  var figMainGroup = '';
  var groupClasses = ['familyA', 'familyB'];
  var groupClass = 1;
  for (var i = 0; i < figs.length; i++) {
    // Clean up the lines
    line = sanitizeSpaces(figs[i]);
    // Split the remainder on the space. Figure group lines and
    // Family 9 should now have two elements, the others three 
    var splitLine = line.split(" ");
    // check if we are dealing with a 'figure group' line
    if (groupRegex.test(line)) {
      // increase figGroupNr counter
      figGroupNr++;
      // parse family and name
      figGroup[figGroupNr] = {'family':splitLine[0].replace(/^F/, ''), 'name':splitLine[1]};
      // add an option for the group to the figure selector
      var option = document.createElement('option');
      option.setAttribute('value', figGroupNr);
      option.innerHTML = line.replace(/^F/, '');
      if (figMainGroup != line[1]) {
        figMainGroup = line[1];
        groupClass = 1 - groupClass;
      }
      option.setAttribute('class', groupClasses[groupClass]);
      figGroupSelector.appendChild(option);
    } else {
      if (splitLine[0]) {
        // Next we split the Aresti and K-factors part
        var arestiK = splitLine[1].split("(")
        var kFactors = arestiK[1].replace(")","").split(":");
        if (!arestiK[1].match(/:/)) kFactors[1] = kFactors[0];
        // Split K factors on the colon; kFactors[0] is for Powered,
        // kFactors[1] is for Gliders
        fig[i] = {'aresti':arestiK[0], 'kpwrd':kFactors[0], 'kglider':kFactors[1], 'group':figGroupNr, 'pattern':splitLine[0]};
        // We will extract roll elements for everything but roll figures
        // and (rolling) turns
        if (regexTurn.test(splitLine[0])) {
          // handle (rolling) turns
          theBase = splitLine[0];
          if (theBase in figBaseLookup) {
            figBaseLookup[theBase].push(i);
          } else {
            figBaseLookup[theBase] = [i];
          }
          fig[i].base = theBase;
          fig[i].draw = splitLine[2];
        } else if (splitLine.length > 2) {
          // handle everything except (rolling) turns and rolls
          theBase = splitLine[0].replace(/[\d\(\)\_\^\&]+/g, '');
          if (theBase in figBaseLookup) {
            figBaseLookup[theBase].push(i);
          } else {
            figBaseLookup[theBase] = [i];
          }
          fig[i].base = theBase;
          fig[i].draw = splitLine[2];
          // Find which rolls are possible in this figure, handle the
          // empty base of rolls on horizontal
          if (theBase.replace(/[\+\-]+/g, '') != '') {
            rollbase = splitLine[0].split(theBase.replace(/[\+\-]+/g, ''));
          } else {
            rollbase = Array(splitLine[0].replace(/[\+\-]+/g, ''));
          }
          rolls = rollbase.join(')').replace(/[\(\+\-]+/g, '').split(')');
          fig[i].rolls = [];
          for (r = 0; r < rolls.length; r++) {
            switch (rolls[r]) {
              case (figpat.fullroll):
                fig[i].rolls[r] = 1;
                break;
              case (figpat.halfroll):
                fig[i].rolls[r] = 2;
                break;
              case (figpat.anyroll):
                fig[i].rolls[r] = 3;
                break;
              default:
                fig[i].rolls[r] = 0;
            }
          }
        } else {
        // Handle rolls
          delete (fig[i]); // no fig object for rolls
          rollBase[i] = splitLine[0];
          rollAresti[i] = arestiK[0];
          rollKPwrd[i] = parseInt(kFactors[0]);
          rollKGlider[i] = parseInt(kFactors[1]);
        }
      }
    }
  }
  // select first figure group
  figGroupSelector.value = 1;
}

// parseRules walks through the rules file to find out which rules
// are available
function parseRules(start) {
  if (!start) start = 0;
  var year = rulesYear();
  for (var i=start; i<rules.length; i++) {
    // Check for [section]
    if (rules[i][0].match(/[\[\(]/)) {
      var parts = rules[i].replace(/[\[\]\(\)]/g, '').split(" ");
      if (parts.length > 2) {
        // Seems like a valid section name. Set correct rule, cat and seq.
        var ruleName = parts[0];
        var rnLower = ruleName.toLowerCase();
        var seqName = parts[parts.length - 1];
        parts.splice(parts.length - 1, 1);
        parts.splice(0, 1);
        var catName = parts.join(' ');
        console.log('Parsing ' + rules[i]);
        // only add square-bracket names to rules
        if (!seqCheckAvail[rnLower]) {
          // remove 'glider-' in display name, if present
          ruleName = ruleName.replace (/^glider-/, '');
          seqCheckAvail[rnLower] = {
            'show': false,
            'name': ruleName,
            'cats':[]
          };
        }
        if (!seqCheckAvail[rnLower]['cats'][catName.toLowerCase()]) {
          seqCheckAvail[rnLower]['cats'][catName.toLowerCase()] = {
            'show': false,
            'name': catName,
            'seqs':[]
          };
        }
        if (rules[i][0] == '[') {
          seqCheckAvail[rnLower]['cats'][catName.toLowerCase()]['seqs'][seqName.toLowerCase()] = seqName;
          seqCheckAvail[rnLower].show = true;
          seqCheckAvail[rnLower]['cats'][catName.toLowerCase()].show = true;
        } else {
          seqCheckAvail[rnLower]['cats'][catName.toLowerCase()]['seqs'][seqName.toLowerCase()] = '*' + seqName;
        }
      }
    } else if (rules[i].match (/^demo[\s]*=/)) {
      if (seqName && year) {
        createExampleSequence (
          year,
          rnLower,
          ruleName,
          catName,
          seqName,
          rules[i].match(/^demo[\s]*=[\s]*(.*)$/)[1]
        );
      }
    }
  }
  updateRulesList();
}

// updateRulesList updates the rules field for powered or glider
function updateRulesList () {
  var regex = /^glider-/;
  var el = document.getElementById('rulesList');
  // clear list
  while (el.childNodes.length > 0) el.removeChild(el.lastChild);
  // clear rules value
  document.getElementById('rules').value = '';
  // build list for powered or glider
  for (ruleName in seqCheckAvail) {
    if ((document.getElementById('class').value === 'glider') === (regex.test(ruleName))) {  
      if (seqCheckAvail[ruleName].show) {
        var listItem = document.createElement('li');
        listItem.innerHTML = seqCheckAvail[ruleName]['name'];
        el.appendChild(listItem);
      }
    }
  }
}

// rulesYear retrieves the year of the rules provided in ruleName.
// with no ruleName provided, the year of rulesYY.js is used
function rulesYear (ruleName) {
  if (ruleName) {
    ruleName = '-' + ruleName;
  } else {
    ruleName = '';
  }
  var year = '';
  // find the year of the rules from the file name in index.html
  var scripts = document.getElementsByTagName('script');
  var regex = new RegExp ('rules/rules([0-9][0-9]+)' + ruleName + '\\.js$');
  for (var i = scripts.length - 1; i >=0; i--) {
    var match = scripts[i].src.match(regex);
    if (match) {
      if (match[1].length == 2) {
        year = '20' + match[1] + ' ';
      } else {
        year = match[1] + ' ';
      }
      break;
    }
  }
  return year;
}
  
// loadRules loads the rules for the active sequence and stores it in
// several arrays for fast retrieval
function loadRules(ruleName, catName, programName) {

  var year = rulesYear (ruleName);

  // Set parseSection to true to match the global rules
  var parseSection = true;
  var ruleSection = ruleName + ' ' + catName + ' ' + programName;
  ruleSection = ruleSection.toLowerCase();
  console.log ('Loading rules ' + ruleSection);
  var section = [];
  var sectionRegex = /[\[\]\(\)]/g;
  // First clear or preset the variables
  checkAllowRegex = [];
  checkAllowCatId = [];
  checkCatGroup = [];
  checkFigGroup = [];
  checkRule = [];
  defRules = [];
  checkConv = [];
  connectFig = {'max': 0, 'totalK': 0};
  infoCheck = [];
  figureLetters = '';
  ruleSuperFamily = [];
  ruleSeqCheck = [];
  // Find the sections
  for (var i = 0; i < rules.length; i++) {
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      var name = rules[i].toLowerCase().replace (sectionRegex, '');
      if (section[name]) {
        // log duplicate sections. Use the last one as this will allow
        // rules import by the user
        console.log('* Warning: duplicate section "' + name +
        '" at rulenr ' + i + '. May be because of rule import. ' +
        'Using last section.');
      }
      section[name] = i;
    }
  }
  // Walk through the rules

  // First run, simplify rule lines and define groups and Groups
  for (var i = 0; i < rules.length; i++) {
    rules[i] = sanitizeSpaces(rules[i]);
    // Check for [section] or (section) to match sequence type specific rules
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      parseSection = (i == section[ruleSection])? true : false;
    } else if (parseSection) {
      // when parseSection = true, continue
      // First we remove any spaces around '=', this makes parsing easier
      rules[i] = rules[i].replace(/ *= */g, '=');
      // We also remove spaces around : or ; except when it is a 'why-' line
      if (!rules[i].match(/^why-.+/)) {
        rules[i] = rules[i].replace(/ *: */g, ':');
        rules[i] = rules[i].replace(/ *; */g, ';');
      }
      if (rules[i].match(/^more=/)) {
        // Apply 'more' rules
        var name = rules[i].replace('more=', '').toLowerCase();
        i = section[name];
        ruleSection = false; // don't go over this section again!
      } else if (rules[i].match(/^group-/)) {
        // Apply 'group' rules => single catalog id match
        var newGroup = rules[i].replace(/^group-/, '').split('=');
        checkCatGroup[newGroup[0]] = [];
        checkCatGroup[newGroup[0]]['regex'] = RegExp(newGroup[1] + '[0-9\.]*', '');
      } else if (rules[i].match(/^Group-/)) {
        // Apply 'Group' rules => full figure (multiple catalog id) match
        var newGroup = rules[i].replace(/^Group-/, '').split('=');
        checkFigGroup[newGroup[0]] = [];
        checkFigGroup[newGroup[0]]['regex'] = RegExp(newGroup[1] + '[0-9\. ]*', 'g');
      }
    }
  }
  
  parseSection = true;
  ruleSection = (ruleName + ' ' + catName + ' ' + programName).toLowerCase();

  // Second run, add all other rules
  for (var i = 0; i < rules.length; i++) {
    // Check for [section] or (section) to match sequence type specific rules
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      parseSection = (i == section[ruleSection])? true : false;
    } else if (parseSection) {
      // when parseSection = true, continue
      if (rules[i].match(/^conv-[^=]+=/)) {
        // Apply 'conv' rules
        var convName = rules[i].match(/^conv-([^=]+)/)[1];
        // log duplicate conversions, use latest
        if (checkConv[convName]) {
          console.log('* Error: duplicate conversion "' + convName +
            '" at rulenr ' + i);
        }
        checkConv[convName] = [];
        var convRules = rules[i].match(/^conv-[^=]+=(.*)$/)[1].split(';');
        for (var j = 0; j < convRules.length; j++) {
          var c = convRules[j].split('=');
          // create regex, make sure it matches to the end
          checkConv[convName].push ({
            'regex': new RegExp(c[0] + '.*', 'g'),
            'replace': c[1]
          });
        }
      } else if (rules[i].match(/^more=/)) {
        // Apply 'more' rules
        var name = rules[i].replace('more=', '').toLowerCase();
        i = section[name];
        ruleSection = false; // don't go over this section again!
      } else if (rules[i].match(/^allow=/)) {
      // Apply 'allow' rules
        var newCatLine = rules[i].replace(/^allow=/, '');
        var newCat = newCatLine.match(/^[^\s]*/g);
        var newRules = newCatLine.replace(newCat, '').split(';');
        for (var j = 0; j<newRules.length; j++) {
          newRules[j] = newRules[j].replace(/^\s+|\s+$/g, '');
        }
        checkAllowRegex.push ({'regex':RegExp(newCat, 'g'), 'rules':newRules});
      } else if (rules[i].match(/^allow-defrules=/)) {
      // Apply 'allow-defrules' rules
        var newCatLine = rules[i].replace(/^allow-defrules=/, '');
        defRules = newCatLine.replace(/[\s]+/g, '').split(';');
      } else if (rules[i].match(/^[0-9]+\./)) {
        // Apply figure number rules
        // The key of checkAllowCatId is equal to the figure number
        // The value is an array of rules that have to be applied
        var newCatLine = rules[i];
        var newCat = newCatLine.match(/^[^\s]*/g)[0];
        // Create an array with rules that have to be applied to the figure
        var newRules = newCatLine.replace(newCat, '').replace(/[\s]+/g, '').split(';');
        // When there are no rules we want an empty array, whereas split
        // provides an array with one empty string
        if (newRules[0] == '') newRules = [];
        // Check if the figure string applies to multiple figures, such as 1.1.1.1-4
        // If so, make a new checkAllowCatId for each figure
        var multiple = newCat.match(/[0-9]+\-[0-9]+$/);
        if (multiple) {
          multiple = multiple[0];
          for (var j = multiple.split('-')[0]; j < (parseInt(multiple.split('-')[1]) + 1); j++) {
            checkAllowCatId[newCat.replace(multiple, '') + j] = newRules;
          }
        } else checkAllowCatId[newCat] = newRules;
      } else if (rules[i].match(/[^-]+-min=\d+$/)) {
      // Apply [group]-min rules
        var group = rules[i].replace(/-min/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].min = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].min = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-max=\d+$/)) {
      // Apply [group]-max rules
        var group = rules[i].replace(/-max/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].max = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].max = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-repeat=\d+$/)) {
      // Apply [group]-repeat rules
        var group = rules[i].replace(/-repeat/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].repeat = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].repeat = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-minperfig=\d+$/)) {
      // Apply [group]-minperfig rules
        var group = rules[i].replace(/-minperfig/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].minperfig = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].minperfig = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-maxperfig=\d+$/)) {
      // Apply [group]-maxperfig rules
        var group = rules[i].replace(/-maxperfig/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].maxperfig = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].maxperfig = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-name=.+$/)) {
      // Apply [group]-name and seqcheck-name rules
        var group = rules[i].replace(/-name/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].name = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].name = group[1];
        if (ruleSeqCheck[group[0]]) ruleSeqCheck[group[0]].name = group[1];
      } else if (rules[i].match(/^conv-[^=]+=.+/)) {
// Apply conv-x rules
// DEPRECATED
//  var convName = rules[i].match(/^conv-[^=]+/)[0].replace(/^conv-/, '')
//  var convRules = rules[i].replace('conv-'+convName+'=', '').split(';')
//  checkConv[convName] = []
//  for (var j = 0; j<convRules.length; j++) {
//    var convRuleParts = convRules[j].split('=')
//    checkConv[convName][j] = {'regex':RegExp(convRuleParts[0], 'g'), 'replace':convRuleParts[1]}
//  }
      } else if (rules[i].match(/^rule-[^=]+=.+/)) {
      // Apply rule-x rules
        var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^rule-/, '');
        var checkRuleParts = rules[i].replace('rule-'+newRuleName+'=', '');
        var colonPos = checkRuleParts.indexOf(':');
        var check = checkRuleParts.substring(colonPos + 1);
        if (check.match(/^</)) {
          checkRule[newRuleName] = {
            'conv':checkRuleParts.substring(0,colonPos),
            'less':parseInt(check.match(/^<(.*)/)[1])};
          //console.log (checkRule[newRuleName].less);
        } else if (check.match(/^\+</)) {
          checkRule[newRuleName] = {
            'conv':checkRuleParts.substring(0,colonPos),
            'totalLess':parseInt(check.match(/^\+<(.*)/)[1])};
          //console.log (checkRule[newRuleName].totalLess);
        } else {
          checkRule[newRuleName] = {
            'conv':checkRuleParts.substring(0,colonPos),
            'regex':RegExp(checkRuleParts.substring(colonPos + 1), 'g')};
        }
      } else if (rules[i].match(/^why-[^=]+=.+/)) {
        // Apply why-x rules
        var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why-/, '');
        if (checkRule[newRuleName]) {
          checkRule[newRuleName]['why'] = rules[i].replace(/^[^=]+=/, '');
        }
      } else if (rules[i].match(/^floating-point/)) {
        // Apply floating-point rules
        checkCatGroup.floatingPoint = rules[i].match(/[0-9]+/)[0];
      } else if (rules[i].match(regexRulesConnectors)) {
        var match = rules[i].match(regexRulesConnectors);
        connectFig.max = parseInt(match[1]);
        connectFig.totalK = parseInt(match[2]);
      } else if (rules[i].match(/^posnl/)) {
        // load positioning and harmony K
        var pos = rules[i].match(/[0-9+]+/)[0].split('+');
        var el = document.getElementById('positioning');
        if (pos[0] > 0) el.value = pos[0];
        var el = document.getElementById('harmony');
        if (pos[1] > 0) el.value = pos[1];
      } else if (rules[i].match(/^infocheck[ ]*=/)) {
        // define fields that should be checked for not being empty when
        // saving or printing a sequence
        infoCheck = rules[i].replace(/ /g, '').match(/=(.*)/)[1].split(';');
      } else if (rules[i].match(/^figure-letters[ ]*=/)) {
        // define Figure Letters
        figureLetters = rules[i].replace(/ /g, '').match(/=(.*)/)[1];
      } else if (rules[i].match(/^sf[ ]*=/)) {
        // define Super Families
        var val = rules[i].replace(/ /g, '').match(/=(.*)/)[1];
        if (superFamilies[val.toLowerCase()]) {
          ruleSuperFamily = superFamilies[val.toLowerCase()];
        } else {
          var families = val.split(';');
          for (var j = 0; j < families.length; j++) {
            var regex = new RegExp (families[j].split(':')[0]);
            var fam = families[j].split(':')[1];
            ruleSuperFamily.push ([regex, fam]);
          }
        }
      } else if (rules[i].match(/^seqcheck-/)) {
        var newRuleName = rules[i].split('=')[0].replace(/^seqcheck-/, '');
        var regex = new RegExp (rules[i].split('=')[1]);
        ruleSeqCheck[newRuleName] = {'regex' : regex};
      }
    }
  }
  // set rules active
  rulesActive = year + ruleName + ' ' + catName + ' ' + programName;

  // Check the loaded rules against the sequence, return log and display any alerts
  var log = checkRules();
  displayAlerts ();
  markFigures ();
  checkInfo ();
  return log;
}

// unloadRules will set rules to inactive and do some checks
function unloadRules () {
  console.log('Clearing rules');
  rulesActive = false;
  // update sequence
  checkSequenceChanged(true);
  // make sure only available figure groups are shown in chooser
  availableFigureGroups();
  // update figure chooser
  changeFigureGroup ();
}
  
// checkRules will check a complete sequence against the loaded rules
// and produce alerts where necessary.
// The Aresti list according description in allowed.js is in the array figCheckLine
// A log array is returned
function checkRules () {  
  var figNr = 0;
  var figureK = 0;
  var connectors = 0;
  var groupMatch = [];
  var figCount = [];
  var elemCount = [];
  var log = [];
  var logLine = '';
  var errFigs;
  log.push ('Testing sequence:' + activeSequence.text);
  // see if there are active rules. If not, return
  if (rulesActive) {
    log.push ('Rules: ' + rulesActive);
  } else {
    log.push ('Rules: no');
    return log;
  }
  for (var i = 0; i < figures.length; i++) {
    var aresti = figures[i].aresti;
    if (aresti) {
      var k = figures[i].k;
      var figString = figCheckLine[figures[i].seqNr];
      figNr++;
      if (aresti.length > 1) {
        var checkLine = figString.replace(aresti[0] + ' ', '');
      } else {
        var checkLine = '';
      }
      var a = '';
      var checkArray = [];
      for (var ii = 0; ii < checkLine.length; ii++) {
        if (checkLine[ii].match(/[ ,;]/)) {
          checkArray.push(a);
          checkArray.push(checkLine[ii]);
          a = '';
        } else {
          a += checkLine[ii];
        }
      }
      checkArray.push(a);

      // format thisFig for logging
      var thisFig = figString.replace(/;/g, ',');
      for (var j = 0; j < aresti.length; j++) {
        var regex = new RegExp ('(' + aresti[j].replace(/\./g, '\\.') + ')( |,|$)');
        thisFig = thisFig.replace(regex, '$1(' + k[j] + ')$2');
      }
      log.push ('========= Figure #' + figNr + ': ' + thisFig);
      // Check if the figure is a connector
      if (figures[i].connector) {
        connectors++;
        log.push ('is connector? True');
      } else {
        log.push ('is connector? False');
        var figK = 0;
        var groupFigMatch = [];
        // Walk through the elements of the figure
        if (figCount[aresti[0]]) {
          figCount[aresti[0]]++;
        } else figCount[aresti[0]] = 1;
        log.push ('Group-combined: Count=' + figNr + ' Fig count=' +
          figCount[aresti[0]]);
        elemCount = [];
        for (var j = 0; j < aresti.length; j++) {
          log.push ('---- Element: ' + aresti[j]);
          figK = figK + parseInt(k[j]);
          figureK = figureK + parseInt(k[j]);
          if (elemCount[aresti[j]]) {
            elemCount[aresti[j]]++;
          } else elemCount[aresti[j]] = 1;
          log.push('Group-k: Count=' + figureK + ' Elem count=' +
            elemCount[aresti[j]]);
          // Check all group rules on all elements
          for (group in checkCatGroup) {
            if ((group != 'k') && (group != 'floatingPoint')) {
              var match = aresti[j].match(checkCatGroup[group].regex);
              if (match) {
                if (!groupFigMatch[group]) groupFigMatch[group] = [];
                groupFigMatch[group].push(match[0]);
                if (!groupMatch[group]) groupMatch[group] = [];
                groupMatch[group].push({'match':match[0], 'fig':figNr});
                log.push ('group-' + group +
                  ': Count=' + groupFigMatch[group].length +
                  ' Elem count=' + elemCount[aresti[j]]);
              }
              // Do checks after the last aresti code of the figure has been processed
              if (j == (aresti.length - 1)) {
                if (groupFigMatch[group]) {
                  log.push ('group-' + checkCatGroup[group].name +
                    ': Count=' + groupFigMatch[group].length +
                    ' Elem count=' + elemCount[aresti[j]]);
                  if (checkCatGroup[group]['maxperfig'] && (groupFigMatch[group].length > checkCatGroup[group]['maxperfig'])) {
                    checkAlert(group, 'maxperfig', figNr);
                    log.push('Maximum of ' + checkCatGroup[group]['maxperfig'] + ' elements of this group exceeded');
                  }
                  if (checkCatGroup[group]['minperfig'] && (groupFigMatch[group].length < checkCatGroup[group]['minperfig'])) {
                    checkAlert(group, 'minperfig', figNr);
                    log.push('Minimum of ' + checkCatGroup[group]['minperfig'] + ' elements of this group not reached');
                  }
                }
              }
            }
          }
          // Check for specific allowed figures if the checkAllowCatId
          // object is not empty
          // Used only for Unknowns at this point (2012)
          if (Object.keys(checkAllowCatId).length > 0) {
            //log.push ('Checking for specific allowed figures');
            if (!(aresti[j] in checkAllowCatId)) {
              checkAlert (aresti[j], 'notAllowed', figNr);
              //log.push ('Not allowed:' + aresti[j]);
            }
          }
        }
        // Run rule checks on specific allowed figures if the
        // checkAllowCatId object is not empty
        // Used only for Unknowns at this point (2012)
        if (Object.keys(checkAllowCatId).length > 0) {
          //log.push ('Checking rules on specific allowed figures');
          var arestiNr = figString.split(' ')[0];
          //console.log(arestiNr);
          if (arestiNr in checkAllowCatId) {
            //log.push('Allowed base figure:' + arestiNr);
            // Apply rules to the figure
            // Run the checks on the rolls

            for (var ii = 0; ii < checkAllowCatId[arestiNr].length; ii++) {
              // copy checkArray to check
              var check = checkArray.slice(0);
              // forElement may be used to add element number to 'why'
              var forElement = '';
              var rule = checkAllowCatId[arestiNr][ii];
              log.push ('-basefig rule: ' + rule);
              // check if this is a rule of form rule:nr
              var ruleSplit = rule.split(':');
              rule = ruleSplit[0];
              // if it is a rule of form rule:nr, only put this roll
              // element in check
              if (ruleSplit[1]) {
                var rollNr = 1;
                check = [];
                for (var m = 0; m < checkArray.length; m++) {
                  if (rollNr == ruleSplit[1]) {
                    if (checkArray[m] == ' ') break;
                    check.push (checkArray[m]);
                  } else {
                    if (checkArray[m] == ' ') rollNr++;
                  }
                }
                forElement = userText.forElement + ruleSplit[1];
              }
              // Apply conversions to the Aresti number before checking the rule
              if (checkRule[rule].conv) {
                var conversion = checkRule[rule].conv;
                log.push ('Apply: ' + checkRule[rule].conv);
                logLine = 'Converted: ' + check.join('') + ' => ';
                for (var l = 0; l < checkConv[conversion].length; l++) {
                  for (var m = 0; m < check.length; m++) {
                    if (!check[m].match(/[ ,;]/)) {
                      check[m] = check[m].replace(checkConv[conversion][l].regex,
                      checkConv[conversion][l].replace);
                    }
                  }
                }
                checkLine = check.join('');

                log.push (logLine + checkLine);
              }
              if (checkRule[rule].regex) {
                if (checkLine.match(checkRule[rule].regex)) {
                  checkAlert (checkRule[rule].why + forElement, 'rule', figNr);
                  log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                }
              } else if (checkRule[rule].less) {
                var sum = 0;
                for (var l = check.length - 1; l >= 0; l--) {
                  if (check[l].match(/^[0-9]/)) {
                    sum += parseInt (check[l]);
                  }
                  if ((check[l] == ' ') || (l == 0)) {
                    if (sum >= parseInt (checkRule[rule].less)) {
                      checkAlert (checkRule[rule].why + forElement, 'rule', figNr);
                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                    }
                    sum = 0;
                  }
                }
              } else if (checkRule[rule].totalLess) {
                var sum = 0;
                for (var l = check.length - 1; l >= 0; l--) {
                  if (check[l].match(/^[0-9]/)) {
                    sum += parseInt (check[l]);
                  }
                }
                if (sum >= parseInt (checkRule[rule].totalLess)) {
                  checkAlert (checkRule[rule].why + forElement, 'rule', figNr);
                  log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                }
              }
              
            }
            // Check default rules when applicable
            if (defRules != []) {
              for (k = 0; k < defRules.length; k++) {
                // copy checkArray to check
                var check = checkArray.slice(0);
                
                var checkLine = figString.replace(arestiNr + ' ', '');
                rule = defRules[k];
                // check if this is a rule of form rule:nr
                var ruleSplit = rule.split(':');
                if ((ruleSplit[1] === j) || (ruleSplit.length == 1)) {
                  rule = ruleSplit[0];
  
                  log.push ('-basefig rule: ' + rule);
                  // Apply conversions to the Aresti number before checking the rule
                  if (checkRule[rule].conv) {
                    var conversion = checkRule[rule].conv;
                    log.push ('Apply: ' + checkRule[rule].conv);
                    logLine = 'Converted: ' + checkLine + ' => ';
                    for (var l = 0; l < checkConv[conversion].length; l++) {
                      for (var m = 0; m < check.length; m++) {
                        if (!check[m].match(/[ ,;]/)) {
                          check[m] = check[m].replace(checkConv[conversion][l].regex,
                          checkConv[conversion][l].replace);
                        }
                      }
                    }
                    checkLine = check.join('');
                    log.push (logLine + checkLine);
                  }
                  if (checkRule[rule].regex) {
                    if (checkLine.match(checkRule[rule].regex)) {
                      checkAlert (checkRule[rule].why, 'rule', figNr);
                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                    }
                  } else if (checkRule[rule].less) {
                    var sum = 0;
                    for (var l = check.length - 1; l >= 0; l--) {
                      if (check[l].match(/^[0-9]/)) {
                        sum += parseInt (check[l]);
                      }
                      if ((check[l] == ' ') || (l == 0)) {
                        if (sum >= parseInt (checkRule[rule].less)) {
                          checkAlert (checkRule[rule].why, 'rule', figNr);
                          log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                        }
                        sum = 0;
                      }
                    }
                  } else if (checkRule[rule].totalLess) {
                    var sum = 0;
                    for (var l = check.length - 1; l >= 0; l--) {
                      if (check[l].match(/^[0-9]/)) {
                        sum += parseInt (check[l]);
                      }
                    }
                    if (sum >= parseInt (checkRule[rule].totalLess)) {
                      checkAlert (checkRule[rule].why, 'rule', figNr);
                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                    }

                  }
                }
              }
            }
          }
        }
        // Check the Group rules for complete figures
        for (group in checkFigGroup) {
          var match = figString.match(checkFigGroup[group]['regex']);
          if (match) {
            if (!groupMatch[group]) groupMatch[group] = [];
            for (j = 0; j < match.length; j++) {
              groupMatch[group].push({'match':match[j], 'fig':figNr});
            }
          }
        }
        if (checkCatGroup['k']['minperfig']) {
          if (figK < checkCatGroup['k']['minperfig']) {
            checkAlert('k', 'minperfig', figNr);
          }
        }
        if (checkCatGroup['k']['maxperfig']) {
          if (figK > checkCatGroup['k']['maxperfig']) {
            checkAlert('k', 'maxperfig', figNr);
          }
        }
      }
    }
  }
  
  // add connectors to figureK where applicable
  if ((connectors > 0) && (connectFig.max > 0)) {
    figureK += connectFig.totalK;
  }
  // check for total min/max K
  if (checkCatGroup['k']['min']) {
    if (figureK < checkCatGroup['k']['min']) {
      checkAlert('k', 'min');
    }
  }
  if (checkCatGroup['k']['max']) {
    if (figureK > checkCatGroup['k']['max']) {
      checkAlert('k', 'max');
    }
  }

  // Run checks on maximum and minimum occurrence of a group (catalog ID)
  // Go through all groups
  log.push ('====== Testing global repeat/min/max ======');
  for (group in checkCatGroup) {
    // Did we have a match on this group?
    if (groupMatch[group]) {
      //console.log('* Match');
      //console.log(checkCatGroup[group]);
      // Check for max and min occurrences of the group
      if (checkCatGroup[group]['max']) {
        log.push ('testing group ' + group + '-max=' +
          checkCatGroup[group]['max'] + ' val=' + groupMatch[group].length);
        if (groupMatch[group].length > checkCatGroup[group]['max']) {
          errFigs = figureNumbers (groupMatch[group]);
          checkAlert(group, 'max', errFigs);
          log.push ('*** Error: Maximum ' + checkCatGroup[group]['max'] +
            ' of group ' + group + '(' + errFigs + ')');
        }
      }
      if (checkCatGroup[group]['min']) {
        log.push ('testing group ' + group + '-min=' +
          checkCatGroup[group]['min'] + ' val=' + groupMatch[group].length);
        if (groupMatch[group].length < checkCatGroup[group]['min']) {
          checkAlert(group, 'min');
          log.push ('*** Error: Minimum ' + checkCatGroup[group]['min'] +
            ' of group ' + group);
        }
      }
      // Check for repeats of the exact same catalog id when necessary
      if (checkCatGroup[group]['repeat']) {
        //console.log('Check repeat');
        var matches = [];
        for (var j = 0; j < groupMatch[group].length; j++) {
          var thisMatch = groupMatch[group][j];
          if (matches[thisMatch.match]) {
            matches[thisMatch.match].push({'match':thisMatch.match, 'fig':thisMatch.fig});
          } else {
            matches[thisMatch.match] =
              [{'match':thisMatch.match, 'fig':thisMatch.fig}];
          }
        }
        for (match in matches) {
          if (checkCatGroup[group]['repeat'] && (matches[match].length > checkCatGroup[group]['repeat'])) {
            errFigs = figureNumbers (matches[match]);
            checkAlert(group, 'repeat', errFigs);
            log.push ('*** Error: Repeat ' + checkCatGroup[group]['repeat'] +
              ' of group ' + group + '(' + errFigs + ')');
          }
        }
      }
    } else {
      // No occurrences of this group, was there a minimum?
      if (checkCatGroup[group]['min'] && (group != 'k')) {
        checkAlert(group, 'min');
        log.push ('*** Error: Minimum ' + checkCatGroup[group]['min'] +
          ' of group ' + group);
      }
    }
  }
  // Run checks on maximum and minimum occurrence of a Group (complete figure)
  // Go through all groups
  for (group in checkFigGroup) {
    // Did we have a match on this group?
    if (groupMatch[group]) {
      // Check for max and min occurrences of the group
      if (checkFigGroup[group]['max'] && (groupMatch[group].length > checkFigGroup[group]['max'])) {
        errFigs = figureNumbers (groupMatch[group]);
        checkAlert(group, 'figmax', errFigs);
        log.push ('*** Error: Maximum ' + checkFigGroup[group]['max'] +
          ' of group ' + group + '(' + errFigs + ')');
      }
      if (checkFigGroup[group]['min'] && (groupMatch[group].length < checkFigGroup[group]['min'])) {
        checkAlert(group, 'figmin');
        log.push ('*** Error: Minimum ' + checkFigGroup[group]['min'] +
          ' of group ' + group);
      }
      // Check for repeats of the exact same figure when necessary
      if (checkFigGroup[group]['repeat']) {
        var matches = [];
        for (var j = 0; j < groupMatch[group].length; j++) {
          var thisMatch = groupMatch[group][j];
          if (matches[thisMatch.match]) {
            matches[thisMatch.match].push({'match':thisMatch.match, 'fig':thisMatch.fig});
          } else {
            matches[thisMatch.match] =
              [{'match':thisMatch.match, 'fig':thisMatch.fig}];
          }
        }
        for (match in matches) {
          if (checkFigGroup[group]['repeat'] && (matches[match].length > checkFigGroup[group]['repeat'])) {
            errFigs = figureNumbers (matches[match]);
            checkAlert(group, 'figrepeat', errFigs);
            log.push ('*** Error: Repeat ' + checkFigGroup[group]['repeat'] +
              ' of group ' + group + '(' + errFigs + ')');
          }
        }
      }
    } else {
      // No occurrences of this group, was there a minimum?
      if (checkFigGroup[group]['min']) {
        checkAlert(group, 'figmin');
        log.push ('*** Error: Minimum ' + checkFigGroup[group]['min'] +
          ' of group ' + group);
      }
    }
  }
  
  // Check complete sequence string on seqcheck directives
  // When there is NO match for any of the directives, an alert is created
  
  if (ruleSeqCheck !== []) {
    for (var name in ruleSeqCheck) {
      if (!ruleSeqCheck[name].regex.test(activeSequence.text)) {
        checkAlert (ruleSeqCheck[name].name);
      }
    }
  }
  
  // check for multiple use of the same free unknown figure, except L(ink)
  // Also check if all figures have been assigned a Free Unknown letter
  // or link when applicable

  var remaining = '';
  if (figureLetters) {
    remaining = figureLetters;
  }
  var ufl = [];
  for (var i = 0; i < figures.length; i++) {
    var l = figures[i].unknownFigureLetter;
    if (figures[i].aresti) {
      if (l) {
        if (ufl[l]) {
          ufl[l].push(figures[i].seqNr);
        } else {
          ufl[l] = [figures[i].seqNr];
        }
        remaining = remaining.replace(l, '');
      } else if (figureLetters) {
        var msg = sprintf(userText.noFigureLetterAssigned, figures[i].seqNr);
        alertMsgs.push (msg);
        log.push ('*** Error: ' + msg);
      }
    }
  }
  for (l in ufl) {
    if ((ufl[l].length > 1) && (l != 'L')) {
      var msg = sprintf(userText.FUletterMulti, ufl[l].join(','), l);
      alertMsgs.push(msg);
      log.push ('*** Error: ' + msg);
    }
  }
  // see if we have remaining (=unused) letters
  if (remaining.length) {
    var msg = sprintf(userText.unusedFigureLetters, remaining);
    alertMsgs.push (msg);
    log.push ('*** Error: ' + msg);
  }

  return log;
}

// figureNumbers is called by checkRules. It takes a match array with
// i items {'match':xxx, 'fig':xxx} and returns the fig numbers as a
// comma-separated line
function figureNumbers (match) {
  var figs = [];
  for (var i = 0; i < match.length; i++) {
    figs.push (match[i].fig);
  }
  return figs.join(',');
}

// checkAlert adds an alert resulting from sequence checking
// 'value' represents a value for processing
// 'type' represents the type of checking error
function checkAlert (value, type, figNr) {
  if (figNr) alertFig = '(' + figNr + ') '; else alertFig = ''
  switch (type) {
    case 'maxperfig':
      alertMsgs.push(alertFig + 'Not more than ' +
        checkCatGroup[value]['maxperfig'] + ' of ' +
        checkCatGroup[value]['name'] + ' per figure');
      break;
    case 'minperfig':
      alertMsgs.push(alertFig + 'At least ' +
        checkCatGroup[value]['minperfig'] + ' of ' +
        checkCatGroup[value]['name'] + ' per figure');
      break   
    case 'max':
      alertMsgs.push(alertFig + 'Not more than ' +
        checkCatGroup[value]['max'] + ' of ' +
        checkCatGroup[value]['name'] + ' allowed');
      break;
    case 'min':
      alertMsgs.push(alertFig + 'At least ' +
        checkCatGroup[value]['min'] + ' of ' +
        checkCatGroup[value]['name'] + ' required');
      break;
    case 'repeat':
      alertMsgs.push(alertFig + 'Not more than ' +
        checkCatGroup[value]['repeat'] + ' exact repetitions of ' +
        checkCatGroup[value]['name'] + ' allowed');
      break;
    case 'figmax':
      alertMsgs.push(alertFig + 'Not more than ' +
        checkFigGroup[value]['max'] + ' of ' +
        checkFigGroup[value]['name'] + ' allowed');
      break;
    case 'figmin':
      alertMsgs.push(alertFig + 'At least ' +
        checkFigGroup[value]['min'] + ' of ' +
        checkFigGroup[value]['name'] + ' required');
      break;
    case 'figrepeat':
      alertMsgs.push(alertFig + 'Not more than ' +
        checkFigGroup[value]['repeat'] + ' exact repetitions of ' +
        checkFigGroup[value]['name'] + ' allowed');
      break;
    case 'rule':
      alertMsgs.push(alertFig + value);
      break;
    case 'notAllowed':
      alertMsgs.push(alertFig + value + ' is not allowed in this sequence');
      break;
    default:
      alertMsgs.push(value);
  }
}

// checkSequence will show a window with sequence checking information
// show=true : show window
// show=log  : show log page
// show=false: hide window
function checkSequence(show) {

  var div = document.getElementById('checkSequence');
  if (show) {
    if (show === 'log') {
      newWindow (function(){
        // show log page
        var log = checkRules();
        var body = document.createElement('body');
  
        var pre = document.createElement('pre');
        body.appendChild(pre);
        for (var i = 0; i < log.length; i++) {
          pre.appendChild(document.createTextNode(log[i] + '\n'));
        }
        return body;
      }, userText.sequenceCheckLog);
    } else {
      div.classList.remove ('noDisplay');
      var content = '';
      if (rulesActive) {
        content = '<p>' + userText.checkingRules + ' : ' + rulesActive + '</p>';
      } else {
        content = '<p>' + userText.noRules + '</p>';
      }
      // get alerts from alert area
      var contentDiv = document.getElementById('checkSequenceContent');
      contentDiv.innerHTML = document.getElementById('alerts').innerHTML;
      // remove label and <br> (first three items)
      contentDiv.removeChild(contentDiv.firstChild);
      contentDiv.removeChild(contentDiv.firstChild);
      contentDiv.removeChild(contentDiv.firstChild);
      if (contentDiv.innerHTML == '') {
        // no alerts
        if (rulesActive) {
          contentDiv.innerHTML = content + userText.sequenceCorrect;
        } else {
          contentDiv.innerHTML = content;
        }
      } else {
        // alerts present
        contentDiv.innerHTML = content + contentDiv.innerHTML;
      }
    }
  } else {
    div.classList.add ('noDisplay');
  }
}

// checkInfo checks if the required Sequence info is present and
// highlights any empty info fields with red borders (checkInfo class)
function checkInfo () {
  // first clear all red borders
  var el = document.getElementsByClassName('checkInfo');
  for (var i = el.length - 1; i >= 0; i--) {
    el[i].classList.remove ('checkInfo');
  }
  // when no rules are active, revert to default: pilot and aircraft
  if (!rulesActive) infoCheck = ['pilot', 'aircraft'];
  // add red borders to missing info
  for (var i = 0; i < infoCheck.length; i++) {
    el = document.getElementById(infoCheck[i]);
    if (el) {
      if (el.value == '') {
        el.classList.add ('checkInfo');
      }
    }
  }
}

// missingInfoCheck checks for missing Sequence Info.
// When no missing info is detected, function f is executed.
// Otherwise, a warning is presented and f executed only after confirm
function missingInfoCheck (f) {
  var el = document.getElementsByClassName('checkInfo');
  
  if (el.length === 0) {
    f();
  } else {
    var warning = userText.missingInfo;
    for (var i = 0; i < el.length; i++) {
      warning += '<br>\n' + userText[el[i].id].replace(/&amp;/g, '&');
    }
    confirmBox (warning, userText.missingInfoTitle, f);
  }
}

// updateFigureSelectorOptions updates the figure chooser options
function updateFigureSelectorOptions (selectedOption) {
  var container = document.getElementById('figureSelectorOptionsDiv');
  // clear container
  while (container.childNodes.length > 0) {
    container.removeChild (container.lastChild);
  }
  // find first and last (if any) real figures
  var firstFigure = false;
  var lastFigure = false;
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) {
      if (firstFigure === false) firstFigure = i;
      lastFigure = i;
    }
  }
  // only make a selector when there is at least one figure in the seq
  if (firstFigure !== false) {
    var options = ['figSelectorAddStart'];
    // if a figure is selected, add extra options
    if (selectedFigure.id !== null) {
      options.push ('figSelectorAddBefore');
      options.push ('figSelectorReplace');
      options.push ('figSelectorAddAfter');
      // set default option to add after
      if (!selectedOption) selectedOption = 'figSelectorAddAfter';
    }
    options.push ('figSelectorAddEnd');
    // set default option to add at end
    if (!selectedOption) selectedOption = 'figSelectorAddEnd';
    var select = document.createElement ('select');
    select.id = 'figureSelectorOptions';
    select.setAttribute('onChange', 'markFigures();');
    for (var i = 0; i < options.length; i++) {
      var option = document.createElement ('option');
      option.value = options[i];
      if (options[i] == selectedOption) option.selected = 'selected';
      option.innerHTML = userText[options[i]];
      select.appendChild (option);
    }
    container.appendChild (select);
  }
  markFigures();
}

// changeHideIllegal is executed when the hideIllegal checkbox is toggled
function changeHideIllegal() {
  availableFigureGroups();
  changeFigureGroup (document.getElementById('figureGroup'));
}

// availableFigureGroups selects the available figure groups. May be
// limited by active rules.
function availableFigureGroups() {
  var options = document.getElementById('figureGroup').childNodes;
  if ((Object.keys(checkAllowCatId).length > 0) &&
    rulesActive &&
    (document.getElementById('hideIllegal').checked == true)) {
    // hide all options
    for (var i = 1; i < options.length; i++) {
      options[i].classList.add ('nodisplay');
    }
    // now show all options that are applicable
    for (var i in fig) {
      if (fig[i].aresti in checkAllowCatId) {
        options[fig[i].group].classList.remove('nodisplay');
      }
    }
  } else {
    // show all options
    for (var i = 1; i < options.length; i++) {
      options[i].classList.remove ('nodisplay');
    }
  }
}

// changeFigureGroup updates the figure group in the figure chooser
function changeFigureGroup() {
  var e = document.getElementById('figureGroup');
  
  var arestiDraw = [];
  var figureGroup = e.value;
  var table = document.getElementById('figureChooserTable');
  var container = document.getElementById('figureSvgContainer');
  // figureSvg holds the figures for selection
  var svg = document.getElementById('figureChooserSvg');
  
  // set the correct size and row count for the figure thumbnails
  if (e.value != 0) {
    var size = 72;
    var newRow = /\.[01]$/;
    var maxColCount = 4;
  } else {
    var maxColCount = document.getElementById('queueColumns').value;
    var size = parseInt((320 / maxColCount) - 8);
    var newRow = /never/;
    //var maxColCount = 2;
  }
  var colCount = 0;
  
  firstFigure = false;
  
  // clear the figureChooser table
  while (table.childNodes.length > 0) table.removeChild(table.lastChild);
  for (var i = 0; i < fig.length; i++) {
    if (fig[i]) {
      // Only draw figures that are in this group AND have not been
      // drawn before (e.g. 1j and j)
      if ((fig[i].group == figureGroup) && !inArray(arestiDraw, (fig[i].aresti+fig[i].draw))) {
        if (!fig[i].svg) {
          // The figure has not been drawn in this session, go ahead and
          // draw it. First we take the original base and remove + and
          // full/any roll symbols
          var figure = fig[i].pattern.replace(/[\+\_\&]/g, '');
          // next we replace half roll symbols by actual half rolls
          figure = figure.replace(RegExp('\\' + figpat.halfroll, 'g'), '2');
          figures[-1] = [];
          if (figure[0] != '-') {
            Attitude = 0;
            Direction = 0;
          } else {
            Attitude = 180;
            Direction = 180;
          }
          // build the figure and replace line paths by thicker line paths
          // fig[i].string is only set for Queue figures
          if (fig[i].string) {
            buildFigure ([i], fig[i].string, false, -1);
          } else {
            buildFigure ([i], figure, false, -1);
          }
          var paths = figures[-1].paths;
          for (j = paths.length - 1; j >= 0; j--) {
            if (paths[j].style == 'neg') {
              paths[j].style = 'chooserNeg';
            } else if (paths[j].style == 'pos') {
              paths[j].style = 'chooserPos';
            }
          }
          figures[-1] = {'paths': paths, 'aresti': figures[-1].aresti};
          // clear the svg
          prepareSvg(svg);
          // reset X and Y and clear figureStart to prevent adjusting
          // figure position
          X = 0;
          Y = 0;
          figureStart = [];
          // draw the figure
          drawFullFigure(-1, true, svg);
          // retrieve the group holding the figure and set viewbox
          var group = svg.getElementById('figure-1');
          var bBox = group.getBBox();
          var xMargin = bBox.width / 20;
          var yMargin = bBox.height / 20;
          group.setAttribute('transform', 'translate(' +
            roundTwo((xMargin - bBox.x)) + ' ' +
            roundTwo((yMargin - bBox.y)) + ')');
          svg.setAttribute('viewBox', '0 0 '+
            roundTwo(bBox.width+xMargin*2)+' '+
            roundTwo(bBox.height+yMargin*2));
          svg.setAttribute('width', size);
          svg.setAttribute('height', size);
          svg.setAttribute('id', 'figureChooser'+i);
          // add the svg to fig[i] as xml text
          fig[i].svg = new XMLSerializer().serializeToString(svg);
          svg.setAttribute('id', 'figureChooserSvg');
          // add the roll Aresti nrs to fig if applicable
          fig[i].rollAresti = [];

          for (var j = 1; j < figures[-1].aresti.length; j++) {
            fig[i].rollAresti[j] = rollAresti.indexOf(figures[-1].aresti[j]);
          }
        }
        if ((fig[i].aresti.match(newRow) && (fig[i].group != 0)) || (colCount == 0)) {
          colCount = 0;
          var tr = document.createElement('tr');
          table.appendChild(tr);
        }
        colCount++;
        if (colCount >= maxColCount) colCount = 0;
        var td = document.createElement('td');
        tr.appendChild(td);
        td.setAttribute('id', i);
        var inner = document.createElement('div');
        td.appendChild(inner);
        inner.innerHTML = fig[i].svg;
        td.addEventListener ('mousedown', function(){selectFigure(this)}, false);
        var rollK = 0;
        if (sportingClass.value === 'glider') {
          var k = fig[i].kglider;
          for (var j = 1; j < fig[i].rollAresti.length; j++) {
            // Set rollK to -1 when this roll has 0K -> illegal
            // Can only happen for queue figures
            if (rollKGlider[fig[i].rollAresti[j]] == 0) {
              rollK = -1;
              break;
            }
            rollK += rollKGlider[fig[i].rollAresti[j]];
          }
        } else {
          var k = fig[i].kpwrd;
          for (var j = 1; j < fig[i].rollAresti.length; j++) {
            // Set rollK to -1 when this roll has 0K -> illegal
            // Can only happen for queue figures
            if (rollKPwrd[fig[i].rollAresti[j]] == 0) {
              rollK = -1;
              break;
            }
            rollK += rollKPwrd[fig[i].rollAresti[j]];
          }
        }
        if (rollK > 0) {
          k += '(+' + rollK + ')';
        } else if (rollK < 0) {
          k += '<font color="red">(N/A)</font>';
        }
        inner.innerHTML += 'K:' + k;
        
        // extra for figures in queueGroup
        if (fig[i].group == 0) {
          // add a 'remove' button
          var a = document.createElement('a');
          a.setAttribute('href', '#');
          a.setAttribute('class', 'removeFromQueueButton');
          a.setAttribute('id', 'removeFromQueue' + i);
          a.addEventListener ('mousedown', removeFromQueue, false);
          a.innerHTML = '<img src="buttons/close.png">';
          inner.appendChild(a);
          // add the unknownFigureLetter where defined
          if (fig[i].unknownFigureLetter) {
            inner.innerHTML += '<div class="UFletterInQueue">' +
              fig[i].unknownFigureLetter +
              '</div>';
          }
        }
         
        
        // add this figure's Aresti number and pattern to arestiDraw
        // so it is not drawn twice
        arestiDraw.push(fig[i].aresti+fig[i].draw);
      }
    }
  }
  // When any figure was drawn, redraw sequence
  if (-1 in figures) {
    // Clear alert messages created by building figures
    alertMsgs = [];
    // Delete this figure
    delete figures[-1];
  }
  markFigures();
}

// markFigures applies marking to figure chooser elements
function markFigures () {
  markUsedFigures ();
  markMatchingFigures ();
  markNotAllowedFigures ();
}

// markUsedFigures marks figures that are already in the sequence
function markUsedFigures () {
  var table = document.getElementById('figureChooserTable');
  var tr = table.childNodes;
  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].childNodes;
    for (var j = 0; j < td.length; j++) {
      td[j].classList.remove ('queueUsed');
      // add class queueUsed if the figure is already present in
      // the sequence
      for (var k = 0 ; k < figures.length ; k++) {
        if (!figures[k]) break;
        if (figures[k].aresti) {
          if (('queue-' + figures[k].aresti.join('-')) === fig[td[j].id].aresti) {
            td[j].classList.add ('queueUsed');
            break;
          }
        }
      }
    }
  }
}

// markMatchingFigures updates figure chooser elements to show if they
// 'fit' in the selected sequence position
function markMatchingFigures () {
  var el = document.getElementById('figureSelectorOptions');
  var previousPattern = false;
  var nextPattern = false;
  if (el) {
    switch (el.value) {
      case 'figSelectorAddStart':
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti) {
            nextPattern = fig[figures[i].figNr].pattern;
            break;
          }
        }
        break;
      case 'figSelectorAddBefore':
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti) {
            if (selectedFigure.id > i) {
              previousPattern = fig[figures[i].figNr].pattern;
            } else {
              nextPattern = fig[figures[i].figNr].pattern;
              break;
            }
          }
        }
        break;
      case 'figSelectorReplace':
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti) {
            if (selectedFigure.id > i) {
              previousPattern = fig[figures[i].figNr].pattern;
            } else if (selectedFigure.id < i) {
              nextPattern = fig[figures[i].figNr].pattern;
              break;
            }
          }
        }
        break;
      case 'figSelectorAddAfter':
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti) {
            if (selectedFigure.id == i) {
              previousPattern = fig[figures[i].figNr].pattern;
            } else if (selectedFigure.id < i) {
              nextPattern = fig[figures[i].figNr].pattern;
              break;
            }
          }
        }
        break;
      case 'figSelectorAddEnd':
        for (var i = figures.length - 1; i >= 0; i--) {
          if (figures[i].aresti) {
            previousPattern = fig[figures[i].figNr].pattern;
            break;
          }
        }
    }  
  }
  if (previousPattern) {
    var regexString = '^[\\' + previousPattern[previousPattern.length - 1] + '].*';
  } else var regexString = '';
  if (nextPattern) regexString += '[\\' + nextPattern[0] + ']$';
  var regex = new RegExp (regexString);
  var table = document.getElementById('figureChooserTable');
  var tr = table.childNodes;
  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].childNodes;
    for (var j = 0; j < td.length; j++) {
      if (fig[td[j].id].pattern.match(regex)) {
        td[j].classList.add ('matchingFigure');
      } else {
        td[j].classList.remove ('matchingFigure');
      }
    }
  }
}

// markNotAllowedFigures updates figure chooser elements to show if they
// are not allowed for the specified rules
function markNotAllowedFigures () {
  var table = document.getElementById('figureChooserTable');
  var tr = table.childNodes;
  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].childNodes;
    for (var j = 0; j < td.length; j++) {
      if ((sportingClass.value === 'powered') && (fig[td[j].id].kpwrd == 0)) {
        if (document.getElementById('hideIllegal').checked == true) {
          td[j].classList.add ('figureNotAllowedHidden');
        } else {
          td[j].classList.add ('figureNotAllowed');
        }
      } else if ((sportingClass.value === 'glider') && (fig[td[j].id].kglider == 0)) {
        if (document.getElementById('hideIllegal').checked == true) {
          td[j].classList.add ('figureNotAllowedHidden');
        } else {
          td[j].classList.add ('figureNotAllowed');
        }
      } else if (rulesActive) {
        if (Object.keys(checkAllowCatId).length > 0) {
          var aresti = fig[td[j].id].aresti;
          if (aresti.match(/^queue-/)) {
            aresti = aresti.match(/^queue-([0-9\.]+)/)[1];
          }
          if (!(aresti in checkAllowCatId)) {
            if (document.getElementById('hideIllegal').checked == true) {
              td[j].classList.add ('figureNotAllowedHidden');
            } else {
              td[j].classList.add ('figureNotAllowed');
            }
          } else {
            td[j].classList.remove ('figureNotAllowed');
            td[j].classList.remove ('figureNotAllowedHidden');
          }
        } else {
          td[j].classList.remove ('figureNotAllowed');
          td[j].classList.remove ('figureNotAllowedHidden');
        }
      } else {
        td[j].classList.remove ('figureNotAllowed');
        td[j].classList.remove ('figureNotAllowedHidden');
      }
    }
  }
}
  
// selectFigure is executed when clicking a figure in the figureChooser
// (e = object) or from grabFigure (e = figNr) or from certain functions
// or false
function selectFigure (e, noChooserUpdate) {
  if ((e !== false) && !mobileBrowser) {
    // show figure editor tab
    selectTab ('tab-figureInfo');
  }

  var queueFigure = false;
  var fromChooser = typeof e === 'object' ? true : false;

  if (fromChooser) {
    var options = document.getElementById('figureSelectorOptions');
    // check if this was triggered by removing a figure. If so, do nothing
    if (!fig[e.id]) return;
    // use the string if provided (for Queue figures)
    if (fig[e.id].string) {
      figure = fig[e.id].string;
      queueFigure = e.id;
    } else {
      // when doing a replace, check if this is a similar figure
      if (options) {
        if (options.value == 'figSelectorReplace') {
          
          // getRolls creates a string that represents the rolls and
          // their attitude in the figure
          function getRolls (id) {
            var rolls = fig[id].pattern.replace (/[^\^&_]/g, '');
            var att = 0;
            var out = '';
            var n = 0;
            var d = fig[id].draw;
            for (var i = 0; i < d.length; i++) {
              if (drawAngles[d[i]]) {
                att += drawAngles[d[i]];
              } else if (d[i].match (/[hHtTuU]/)) {
                att += 180;
              } else if (d[i] == '_') {
                out += att + rolls[n];
                n++;
              } else if (d[i] == '!') {
                out += '!';
              }
              if (att >= 360) att -= 360;
              if (att < 0) att += 360;
            }
            return out;
          }
          
          // replace similar figures, keeping rolls, extensions etc
          if (getRolls(e.id) === getRolls(figures[selectedFigure.id].figNr)) {
            // change the base figure
            figures[selectedFigure.id].pattern = fig[e.id].pattern;
            figures[selectedFigure.id].figNr = e.id;
            // Update figure editor to new figure
            updateFigureOptions(selectedFigure.id);
            // Update the actual figure according figure editor
            updateFigure();
            // no more work needed, figure has been changed
            return;
          }
        }
      }
      if (!figure) {
        // Replace the selected figure or add a new figure at the end
        // first we take the original base and remove + and full/any roll symbols
        var figure = fig[e.id].pattern.replace(/[\+\_\&]/g, '');
        // Special case, put 0 for a horizontal line
        if (fig[e.id].pattern == '+_+') figure = '0';
        // replace half roll symbols by actual half rolls
        figure = figure.replace(/\^/g, '2');
        // remove non-necessary roll elements in parenthesis, but only when
        // there are no active rolls in parenthesis
        // result is e.g.: n or n(2)-
        if (!figure.match (/\([^)]+\)/)) {
          figure = figure.replace (/\(\)/g, '');
        }
      }
    }
    // See if a figure was grabbed already. If so, replace it
    if (options) {
      switch (options.value) {
        case 'figSelectorAddStart':
          // find the first 'figure', except sequence options
          // and add before that one
          for (var i = 0; i < figures.length; i++) {
            if (!figures[i].string.match(regexSequenceOptions)) {
              updateSequence(i - 1, figure, false, true);
              setFigureSelected(i);
              break;
            }
          }
          break;
        case 'figSelectorAddBefore':
          for (var i = selectedFigure.id - 1; i>=0; i--) {
            if (i > -1) {
              if (figures[i].string.match(regexSequenceOptions) || figures[i].aresti) {
                break;
              }
            }
          }
          updateSequence(i, figure, false, true);
          setFigureSelected(i + 1);
          break;
        case 'figSelectorReplace':          
          updateSequence(selectedFigure.id, figure, true, true);
          break;
        case 'figSelectorAddAfter':
          updateSequence(selectedFigure.id, figure, false, true);
          setFigureSelected(parseInt(selectedFigure.id) + 1);
          break;
        case 'figSelectorAddEnd':
          updateSequence(figures.length - 1, figure, false, true);
          setFigureSelected(figures.length - 1);
          break;
      }
    } else {
      // otherwise, add a new figure at the end
      updateSequence(figures.length - 1, figure, false, true);
      setFigureSelected(figures.length - 1);
    }
  } else if (e !== false) {
    setFigureSelected(e);
    var figNr = figures[selectedFigure.id].figNr;
    e = SVGRoot.getElementById('figure'+e);
  }
  var elFT = document.getElementById('t_addFigureText');
  if (e !== false) {
    // e!==false => a figure is selected
    // hide the figure selector for mobile browsers, but highlight the
    // chosen figure in case the figure selector is shown again
    if (mobileBrowser) hideFigureSelector ();
    var table = document.getElementById('figureChooserTable');
    // needed for old browsers that don't support getElementsByClassName
    if (!table.getElementsByClassName) {
      table.prototype.getElementsByClassName = document.getElementsByClassName;
    }
    //
    var selected = table.getElementsByClassName('selected');
    // remove selected class for all
    for (var i = 0; i < selected.length; i++) {
      selected[i].classList.remove('selected');
    }
    // add selected class to figure
    if (e.parentNode.classList) e.parentNode.classList.add ('selected');
    elFT.parentNode.setAttribute('class', "hoverdisplay");
    elFT.innerHTML = userText.clickChangeFigure;
    
    // with figure loaded from chooser, remove any unknown figure letters
    // and add queue unknown figure letter if applicable
    if (fromChooser) {
      var uf = (queueFigure)? fig[queueFigure].unknownFigureLetter : false;

      for (var i = selectedFigure.id - 1; i>=0; i--) {
        if (figures[i].aresti) {
          break;
        } else {
          if (figures[i].unknownFigureLetter) {
            updateSequence(i, '', true);
          }
        }
      }
      // set unknown figure letter if applicable
      if (uf) updateSequence(i, '"@' + uf + '"', false, true);
    }

    // update all figure options
    updateFigureEditor();
    
    // set the figure chooser
    //if (!noChooserUpdate) {
      if (queueFigure) {
        setFigChooser(queueFigure);
      } else {
        setFigChooser(figures[selectedFigure.id].figNr);
      }
    //}
      
    // Select the figure in the sequence text when we were not editing
    // in the text and we are not on a touch device, as we assume this
    // would have a non-physical keyboard popping up. Select all the
    // way back to the previous real figure
    if (!sequenceText.hasfocus && !('ontouchstart' in document.documentElement)) {
      var start = figures[selectedFigure.id].stringStart;
      for (var i = selectedFigure.id - 1; i>=0; i--) {
        if (figures[i].aresti) {
          break;
        } else {
          start = figures[i].stringStart;
        }
      }
      createSelection (sequenceText, start, figures[selectedFigure.id].stringEnd);
    }

  } else {
    // e===false => select no figure
    // remove selection start from sequence text
    sequenceText.removeAttribute('selectionStart');
    // set selected figure to null
    setFigureSelected(null);
    // set figure editor
    updateFigureEditor();
    // update figure selector options
    updateFigureSelectorOptions();
    // correctly set the figure change/edit block
    document.getElementById('selectedFigureSvg').innerHTML = "";
    elFT.parentNode.removeAttribute('class');
    elFT.innerHTML = userText.clickAddFigure;
    document.getElementById('figureHeader').innerHTML = '';
  }
}

// ###################################################
// Functions for creating complete sequences

// checkFloatingPoint checks if a floating point correction should be
// made and adds this to the figures object where applicable
function checkFloatingPoint () {
  var figureK = 0;
  // in case of floating-point, check total K first to determine
  // how much to take off and where. Disregard connectors.
  if (checkCatGroup.floatingPoint) {
    var figK = [];
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti && !figures[i].connector) {
        // build array figK[i] = XXYY, where XX = K and YY = 99 - i
        // this will enable sorting while keeping K and i relation
        figK[i] = 99 - i;
        for (var j = 0; j < figures[i].k.length; j++) {
          figK[i] += (figures[i].k[j] * 100);
          figureK += parseInt(figures[i].k[j]);
        }
      }
    }
    var fp = figureK - (checkCatGroup.k.max - checkCatGroup.floatingPoint);
    // don't apply fp when K is too high anyway
    if (fp > checkCatGroup.floatingPoint) fp = 0;
    // sort figK low to high
    // identical Ks will be sorted first fig first
    figK.sort(function(a,b){return a - b});
    while (fp > 0) {
      var n = figK.pop();
      if (n) {
        // retrieve correct i and set floatingPoint
        var i = 99 - Math.round(((n / 100) - parseInt(n/100)) * 100);
        figures[i].floatingPoint = true;
        fp--;
      }
    }
  }
}

// makeMiniFormA creates a mini form A
// It starts at (x, y) and returns width and height of the block
function makeMiniFormA (x, y) {  
  var blockX = x;
  var blockY = y;
  // set the header for the correct sporting class
  if (sportingClass.options[sportingClass.selectedIndex]) {
    var myClass = sportingClass.options[sportingClass.selectedIndex].innerHTML;
    drawText (myClass, blockX + 4, blockY + 17, 'miniFormATotal');
    drawRectangle (blockX, blockY, 152, 24, 'pos');
    blockY += 24;
  }
  var figNr = 0;
  
  var figureK = 0;
  for (var i = 0; i < figures.length; i++) {
    aresti = figures[i].aresti;
    var k = figures[i].k;
    if (aresti) {
      figNr++;
      var figK = 0;
      topBlockY = blockY;
      for (var j = 0; j < aresti.length; j++) {
        drawText (aresti[j], blockX + 44, blockY + 16, 'miniFormA');
        drawText (k[j], blockX + 104, blockY + 16, 'miniFormA');
        figK = figK + parseInt(k[j]);
        blockY += 12;
      }
      // Adjust figure K for connectors
      if (figures[i].unknownFigureLetter) {
        if (aresti.length < 2) blockY += 12;
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 4, 'miniFormA');
        if (figures[i].unknownFigureLetter == 'L') {
          if (connectors <= connectFig.max) {
            figK = connectFig.totalK / connectors;
          } else {
            if (connectFig.max > 0) {
              figK = connectFig.totalK / connectFig.max;
            }
            alertMsgs.push ('(' + figNr + ') ' +
              userText.maxConnectors +
              connectFig.max);
          }
          drawText ('Conn.', blockX + 4, (topBlockY + blockY) / 2 + 16, 'miniFormA');
        } else {
          drawText (figures[i].unknownFigureLetter, blockX + 4,
            (topBlockY + blockY) / 2 + 16, 'miniFormA');
        }
      } else {
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 10, 'miniFormA');
      }
      // adjust figure K for floating point
      if (figures[i].floatingPoint) {
        if (topBlockY == blockY) blockY += 12;
        drawText ('(' + figK + ')', blockX + 130,
          (topBlockY + blockY) / 2 + 15, 'miniFormASmall');
        figK -= 1;
        drawText (figK, blockX + 132, (topBlockY + blockY) / 2 + 5, 'miniFormA');
      } else {
        drawText (figK, blockX + 132, (topBlockY + blockY) / 2 + 10, 'miniFormA');
      }
      drawLine (blockX, topBlockY, 152, 0, 'pos');
      var vertSize = (blockY - topBlockY + 12);
      drawLine (blockX, topBlockY, 0, vertSize, 'pos');
      drawLine (blockX + 40, topBlockY, 0, vertSize, 'pos');
      drawLine (blockX + 100, topBlockY, 0, vertSize, 'pos');
      drawLine (blockX + 126, topBlockY, 0, vertSize, 'pos');
      drawLine (blockX + 152, topBlockY, 0, vertSize, 'pos');
      figureK += figK;
      blockY += 12;
    }
  }
  drawText ('Total K = ' + figureK, blockX + 4, blockY + 17, 'miniFormATotal');
  // add maximum K (corrected for Floating Point) where applicable
  if (checkCatGroup.k && checkCatGroup.k.max) {
    var max = checkCatGroup.k.max;
    if (checkCatGroup.floatingPoint) max -= checkCatGroup.floatingPoint;
    drawText ('(max K = ' + max + ')',
      blockX + 4, blockY + 32, 'miniFormAMax');
      drawRectangle (blockX, blockY, 152, 40, 'pos');
      blockY += 40;
  } else {
    drawRectangle (blockX, blockY, 152, 24, 'pos');
    blockY += 24;
  }
  return {'width':152, 'height':blockY - y};
}

/**********************************************************************
 * 
 * Functions for drag & drop repositioning
 * 
 **********************************************************************/
 
// grabFigure will select a figure and allow dragging
function grabFigure(evt) {
  DragTarget = null;
  // find out which element we moused down on
  var targetElement = evt.target.parentNode;
  // only drag real sequence figures
  if (targetElement.id.match(/^figure[0-9]/)) {
    if ( figures[targetElement.id.replace('figure', '')].draggable ) {
      //set the item moused down on as the element to be dragged
      DragTarget = targetElement;
    }
  } else if (targetElement.id === 'svgContainer') {
    // clicked somewhere in the SVG container, maybe within figure bBox?
    var svg = SVGRoot;
    var svgRect = svg.getBoundingClientRect();
    var viewBox = svg.getAttribute('viewBox').split(' ');
    // svg may be rescaled on mobile browser
    if (mobileBrowser) {
     var scale = svg.getAttribute('width') / viewBox[2];
    } else {
     var scale = 1;
    }
    var margin = 5 * scale;
    GrabPoint.x = TrueCoords.x;
    GrabPoint.y = TrueCoords.y;
    var x = (GrabPoint.x - svgRect.left) / scale + parseInt(viewBox[0]);
    var y = (GrabPoint.y - svgRect.top) / scale + parseInt(viewBox[1]);

    //GrabPoint.x = ((evt.clientX - svgRect.left) / scale) + parseInt(viewBox[0]);
    //GrabPoint.y = ((evt.clientY - svgRect.top) / scale) + parseInt(viewBox[1]);
    var closest = false;
    var minDistSq = Infinity;
    for (var i = figures.length - 1; i >= 0; i--) {
     if (figures[i].draggable) {
       var bBox = svg.getElementById('figure'+i).getBBox();
       // clicked well within bBox (>margin units within border)?
       if ((x > (bBox.x + margin)) && (x < (bBox.x + bBox.width - margin))) {
         if ((y > (bBox.y + margin)) && (y < (bBox.y + bBox.height - margin))) {
           // calculate distance squared to bBox centre
           var distSq = Math.pow(x - (bBox.x + (bBox.width / 2)), 2) +
             Math.pow(y - (bBox.y + (bBox.height / 2)), 2);
           if (distSq < minDistSq) {
             minDistSq = distSq;
             closest = i;
           }
         }
       }
     }
    }
    // select figure if the closest centre, within bBox, was found
    if (closest !== false) {
      DragTarget = document.getElementById('figure'+closest);
    }
  }
  if (DragTarget) {
    // move this element to the "top" of the display, so it is
    // always over other elements
    DragTarget.parentNode.appendChild( DragTarget );

    // turn off all pointer events to the dragged element, this does 2 things:
    //    1) allows us to drag text elements without selecting the text
    //    2) allows us to find out where the dragged element is dropped (see Drop)
    DragTarget.setAttribute('pointer-events', 'none');

    // we need to find the current position and translation of the grabbed element,
    //    so that we only apply the differential between the current location
    //    and the new location
    GrabPoint.x = TrueCoords.x;
    GrabPoint.y = TrueCoords.y;
    
    // blur sequenceText area
    sequenceText.blur();
    // the DragTarget id is the new selectedFigure.id
    selectFigure(DragTarget.id.replace('figure', ''));
  } else selectFigure(false);
}

// setFigChooser sets the figure chooser to the correct group and
// highlights the figure provided by figNr
function setFigChooser (figNr) {
  // check if fig[figNr] is valid
  if (fig[figNr]) {
    var figureGroup = fig[figNr].group;
    var select = document.getElementById ('figureGroup');
    var options = select.options;
    for (var i = options.length - 1; i >= 0; i--) {
      if (options[i].value == figureGroup) {
        options[i].setAttribute('selected', 'true');
        var selectedGroup = options[i];
        select.selectedIndex = i;
      } else {
        options[i].removeAttribute('selected');
      }
    }
    changeFigureGroup(selectedGroup);
    var figure = document.getElementById(figNr);
    var td = figure.parentNode;
    var div = document.getElementById('figureChooser');
    // Get the vertical offset of the <tr> in which the element is
    var scroll = td.parentNode.offsetTop;
    // Select the correct figure and scroll selector there
    td.classList.add ('selected');
    div.scrollTop = scroll;
  }
  updateFigureSelectorOptions();
}

// setFigureSelected sets the active figure and applies color filter
function setFigureSelected (figNr) {
  // if any figure was previously selected, remove that filter
  var selFig = SVGRoot.getElementById('figure'+selectedFigure.id);
  if (selFig) {
    if (selectedFigure.id !== figNr) {
      var nodes = selFig.childNodes;
      for (var i = nodes.length - 1; i >= 0; i--) {
        var s = nodes[i].getAttribute('style');
        if (s) {
          s = s.replace (/#ff00a0/g, 'black');
          s = s.replace (/#ff1090/g, 'red');
          nodes[i].setAttribute ('style', s);
        }
      }
    }
  }
  
  // fill selectedFigure with BBox values
  var selFig = SVGRoot.getElementById('figure'+figNr);
  if (selFig) selectedFigure = selFig.getBBox();
  // set selectedFigure.id
  selectedFigure.id = figNr;

  if (figNr !== null) {
    // define header element for info
    var header = document.getElementById('figureHeader');
    //console.log(figNr);
    header.innerHTML = userText.editingFigure + figures[figNr].seqNr;
  
    // apply color filter
    var nodes = SVGRoot.getElementById('figure'+figNr).childNodes;
    for (var i = nodes.length - 1; i >= 0; i--) {
      var s = nodes[i].getAttribute('style');
      if (s) {
        s = s.replace (/black/g, '#ff00a0');
        s = s.replace (/red/g, '#ff1090');
        nodes[i].setAttribute ('style', s);
      }
    }
  }
}

// Drag allows to drag the selected figure to a new position
function Drag(evt) {

  // don't drag when on Fig in grid view
  if (activeForm === 'Grid') return;
  
  // put the coordinates of object evt in TrueCoords global
   TrueCoords.x = evt.clientX;
   TrueCoords.y = evt.clientY;

  // if we don't currently have an element in tow, don't do anything
  if (DragTarget) {
    // Don't drag figure 0, it's auto positioned
    if (DragTarget.id != 'figure0') {
      // account for the offset between the element's origin and the
      // exact place we grabbed it. This way, the drag will look more natural
      var newX = TrueCoords.x - GrabPoint.x;
      var newY = TrueCoords.y - GrabPoint.y;

      // apply a new tranform translation to the dragged element, to display
      // it in its new location
      DragTarget.setAttribute('transform', 'translate(' + newX + ',' + newY + ')');
      // enlarge sequence SVG if necessary
      // could be smoother, but works
      var viewBox = SVGRoot.getAttribute('viewBox').split(' ')
      var newWidth = TrueCoords.x + selectedFigure.width;
      if (newWidth > viewBox[2]) {
        SVGRoot.setAttribute('width', newWidth);
        SVGRoot.setAttribute('viewBox', SVGRoot.getAttribute('viewBox').replace(/^([^ ]+ [^ ]+ )[^ ]+/, "$1" + newWidth));
      } else {
        var newHeight = TrueCoords.y + selectedFigure.height;
        if (newHeight > viewBox[3]) {
          SVGRoot.setAttribute('height', newHeight);
          SVGRoot.setAttribute('viewBox', SVGRoot.getAttribute('viewBox').replace(/[^ ]+$/, newHeight));
        } else if ((newX + selectedFigure.x) < 1) {
          SVGRoot.setAttribute('viewBox', SVGRoot.getAttribute('viewBox').replace(/^[^ ]+/, parseInt(viewBox[0]) - 1));
        } else if ((newY + selectedFigure.y) < 1) {
          SVGRoot.setAttribute('viewBox', SVGRoot.getAttribute('viewBox').replace(/^([^ ]+ )[^ ]+/, "$1" + parseInt(viewBox[1] - 1)));
        }  
      }
    }
  }
}

// Drop is activated when a figure is dropped at a new position
function Drop(evt) {
  
   // if we aren't currently dragging an element, don't do anything
   if ( DragTarget ) {
      // since the element currently being dragged has its pointer-events turned off,
      //    we are afforded the opportunity to find out the element it's being dropped on
      var targetElement = evt.target;

      // turn the pointer-events back on, so we can grab this item later
      DragTarget.setAttribute('pointer-events', 'all');

      var transform = DragTarget.getAttribute('transform');
      
      // create new curveTo for dragged elements when not in grid view
      if (transform && (activeForm !== 'Grid')) {
        var dxdy = transform.match(/[0-9\-\.]*,[0-9\-\.]*/)[0].split(',');
        var dx = parseInt(dxdy[0] / lineElement)
        var dy = parseInt(dxdy[1] / lineElement)
        // reverse direction for dragging in Form C
        if (activeForm === 'C') dx = -dx;
        updateSequence (DragTarget.id.replace('figure', '') - 1,
          '(' + dx + ',' + dy + ')',
          false,
          false,
          true)
      }
      
      // set the global variable to null, so nothing will be dragged until we
      //    grab the next element
      DragTarget = null;
   }
  if (!('ontouchstart' in document.documentElement)) {
    sequenceText.focus();
  }
}

/**********************************************************************
 * 
 * Functions for point & click altering of the sequence
 * 
 **********************************************************************/
 
// changeEntryDirection alters the entry direction of the sequence
function changeEntryDirection () {
  // get code
  for (code in entryOptions) {
    if (entryOptions[code] === this.id) break;
  }
  updateSequenceOptions ('');
  if (activeSequence.figures[0]) {
    if (entryOptions[activeSequence.figures[0].string]) {
      updateSequence(0, code, true);
      return;
    }
  }
  // put at start when no entry option to replace
  updateSequence(-1, code);
}

// flipYAxis will flip the drawn direction of the Y axis
function flipYAxis () {
  var v = sequenceText.value;
  if (v.replace(regexComments, '').match(regexFlipYAxis)) {
    // disable flip
    var t = '';
    var inComment = false;
    for (var i = 0; i < v.length; i++) {
      // disregard / in comments
      if (v[i] === userpat.comment) inComment = !inComment;
      // check for single /
      if ((v[i] === '/') && !inComment) {
        if (i < (v.length - 1)) {
          // keep double //
          if (v[i + 1] === '/') {
            t += '//';
            i++;
          }
        }
      } else {
        t += v[i];
      }
    }
    sequenceText.value = t;
  } else {
    // add flip to first real figure, if it exists
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) {
        updateSequence (i, userpat.flipYaxis + figures[i].string, true);
        break;
      }
    }
  }
  checkSequenceChanged();
}

// updateSequenceOptions updates the sequence options to reflect the
// active start of the sequence. The active start is NOT displayed as an
// option
function updateSequenceOptions (code) {
  el = document.getElementById('sequenceOptions');
  // needed for old browsers that don't support getElementsByClassName
  if (!el.getElementsByClassName) {
    el.prototype.getElementsByClassName = document.getElementsByClassName;
  }
  //

  // create a nodeList and remove the items of the nodelist
  var options = el.getElementsByClassName('entryOption');
  while (options[0]) el.removeChild(options[0]);

  for (key in entryOptions) {
    if (code != key) {
      var li = document.createElement('li');
      li.setAttribute ('class', 'entryOption');
      var a = document.createElement('a');
      a.setAttribute ('id' , entryOptions[key]);
      a.setAttribute ('href', '#');
      a.addEventListener ('click', changeEntryDirection, false);
      a.innerHTML = userText[entryOptions[key]];
      li.appendChild(a);
      el.insertBefore(li, el.firstChild);
    }
  }
}

// clearPositioning removes all figure positioning elements
function clearPositioningOption () {
  // only do this when on Form B or C
  if ((activeForm === 'B') || (activeForm === 'C')) {
    // confirm clearing the position formatting
    confirmBox (userText.clearPositioningConfirm,
      userText.clearPositioning, clearPositioning);
  } else {
    alertBox (userText.notOnFormBC);
  }
}

// clearPositioning removes all figure positioning elements
function clearPositioning () {
  // make sure no figure is selected
  selectFigure (false);
  // remove all moveTo, curveTo and moveForward figures
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
      updateSequence (i, '', true);
      i--;
    }
  }
}

// separateFigures separates all the figures from each other. This is
// done vertically with a curveTo
function separateFigures () {
  // only do this when on Form B or C
  if ((activeForm === 'B') || (activeForm === 'C')) {
    // confirm clearing the position formatting. When confirmed, the
    // anonymous function is executed
    confirmBox (userText.clearPositioningConfirm,
      userText.separateFigures, function(){
      // anonymous function -------------------
      clearPositioning();
      // start a loop that will continue until nothing's done any more
      do {
        var breakLoop = false;
        var i = 1;
        // start going through the figures from the second figure
        while ((i < figures.length) && !breakLoop) {
          // get the bBox set for the figure
          var bBox = figures[i].bBox;
          // only real (draggable) figures have a bBox
          if (bBox && figures[i].aresti) {
            var moveDown = 0;
            var boxTop = bBox.y;
            var boxBottom = bBox.y + bBox.height;
            var boxLeft = bBox.x;
            var boxRight = bBox.x + bBox.width;
            do {
              var repeat = false;
              for (var j = i - 1; j >= 0; j--) {
                var bBoxJ = figures[j].bBox;
                if (bBoxJ && figures[j].aresti) {
                  if ((boxRight > bBoxJ.x) && (boxLeft < (bBoxJ.x + bBoxJ.width))) {
                    if (((boxBottom + moveDown) > bBoxJ.y) && ((boxTop + moveDown) < (bBoxJ.y + bBoxJ.height))) {
                      moveDown += bBoxJ.y + bBoxJ.height - (boxTop + moveDown);
                      repeat = true;
                      break;
                    }
                  }
                }
              }
            } while (repeat);
            if (moveDown > 0) {
              moveDown = Math.ceil(moveDown/lineElement);
              // No longer necessary because we redraw every time. This code could be
              // quicker but needs extra work. Keep it here just in case...
              //        for (j = i; j < figures.length; j++) {
              //          if (figures[j].bBox) figures[j].bBox.y = figures[j].bBox.y + (moveDown * lineElement)
              //        }
              updateSequence(i - 1, '(0,' + moveDown + ')', false);
              breakLoop = true;
            }
          }
          i++;
        }
      } while (breakLoop);
      // end anynymous function ---------------
    });
  } else {
    alertBox (userText.notOnFormBC);
  }
}

// drawFullFigure draws a complete Aresti figure in the sequenceSvg
// or in an other svg object when provided
function drawFullFigure (i, draggable, svg) {
  // default to SVGRoot when no svg object provided
  if (!svg) svg = SVGRoot;
  // Mark the starting position of the figure
  figures[i].startPos = {'x':X, 'y':Y};
  figures[i].draggable = draggable;
  svgElement = svg.getElementById('sequence');
  var paths = figures[i].paths;
  // return for no-draw figures
  if (!paths) return;
// Create a group for the figure, draw it and apply to the SVG
  var group = document.createElementNS (svgNS, "g");
  group.setAttribute('id', 'figure' + i);
  // put the group in the DOM
  svgElement.appendChild(group);
  var bBox = false;
  for (var j = 0; j < paths.length; j++) {
    var box = drawShape (paths[j], group, bBox);
    if (box) bBox = box;
  }
//  if (draggable) {
    figures[i].bBox = group.getBBox();
//  }
  if ((selectedFigure.id === i) && draggable) {
    setFigureSelected (i);
  }
}

// showQueue shows the figure queue
function showQueue () {
  var select = document.getElementById ('figureGroup');
  var options = select.options;
  select.selectedIndex = 0;
  changeFigureGroup(options[0]);
  showFigureSelector();
}

// chnageQueueColumns changes the amount of columns in queue
function changeQueueColumns () {
  saveSettingsStorage();
  // clear queue figure SVGs first, to allow resizing
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i]) {
      if (fig[i].group == 0) fig[i].svg = false;
    }
  }
  showQueue();
}

// addToQueue adds the selected figure to the figure queue
function addToQueue () {
  var f = figures[selectedFigure.id];
  var figNr = f.figNr;
  // create aresti string
  // queue-[base]-[roll1]-[roll2]-...
  var aresti = 'queue';
  for (var i=0; i < f.aresti.length; i++) {
    aresti += '-' + f.aresti[i];
  }
  var figLen = fig.length;
  // check if the figure is already in the queue
  var i = figLen - 1;
  while (fig[i]) {
    if (fig[i].group == 0) {
      if (fig[i].aresti == aresti) {
        alertBox (userText.figureAlreadyInQueue);
        return;
      }
      i--;
    } else break;
  }
  // append the figure to the fig array
  fig[figLen] = {'aresti':aresti,
                'base':fig[figNr].base,
                'rolls':fig[figNr].rolls,
                'draw':fig[figNr].draw,
                'pattern':fig[figNr].pattern,
                'kpwrd':fig[figNr].kpwrd,
                'kglider':fig[figNr].kglider};

  // add properties
  fig[figLen].unknownFigureLetter = f.unknownFigureLetter;
  // set queue group nr
  fig[figLen].group = 0;
  // remove extensions/shortenings
  var string = f.string;
  string = string.replace(/[~\.'`]/g, '');
  // remove comments
  string = string.replace(/"[^"]*"/g, '');
  // correct X/Y axis switch where necessary. Queue figures always
  // start on X axis
  if (f.entryAxis == 'Y') {
    string = string.replace(/\^/g, '#').replace(/>/g, '^').replace(/#/g, '>');
  }
  // Handle the very special case where there's only an upright or
  // inverted spin and the base figure is an iv
  if (string.match (/(\d|)(s|is)/) && !string.match (/iv/) && fig[figLen].base.match (/iv/)) {
    string = string.replace (/(\d*)(s|is)/, "iv$1$2");
  }

  fig[figLen].string = string;
  showQueue();
}

// addAllToQueue adds all figures in sequence to queue
function addAllToQueue () {
  infoBox (userText.addAllToQueueWait, userText.addAllToQueue);
  setTimeout(function(){
    var f = selectedFigure.id;
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) {
        selectFigure(i);
        addToQueue();
      }
    }
    // remove infoBox
    infoBox ();
    // reselect original selected figure
    selectFigure(f);
    // set the figure chooser to the queue group
    document.getElementById ('figureGroup').value = '0';
    changeFigureGroup();
  }, 100);
}

// removeFromQueue removes a figure from the queue
function removeFromQueue (e) {
  e.stopPropagation();
  fig.splice(e.target.parentNode.id.replace(/^removeFromQueue/, ''), 1);
  showQueue();
}

// clearQueue removes all figures from queue
function clearQueue () {
  var figLast = fig.length - 1;
  while (!fig[figLast]) {
    fig.length -= 1;
    figLast -= 1;
  }
  // only do anything when there are actually figures in the queue
  if (fig[figLast].group == 0) {
    showQueue();
    // confirm removing all
    confirmBox (userText.clearQueueConfirm, userText.clearQueue, function(){    
      // start removing figures
      var i = figLast;
      while (fig[i]) {
        if (fig[i].group == 0) {
          fig.pop();
          i--;
        } else break;
      }
      hideFigureSelector();
    });
  }
}
  
// makeFormA creates Form A from the figures array
function makeFormA() {
  setYAxisOffset (yAxisOffsetDefault);
  Direction = 0;
  figNr = 0;
  svgElement = SVGRoot.getElementById('sequence');
  // Count how many real figures there are
  for (var i = 0; i < figures.length; i++) {
    var aresti = figures[i].aresti;
    var paths = figures[i].paths;
    if (aresti) {
      // Build the figure at the top-left
      X = 0;
      Y = 0;
      drawFullFigure(i, false);
      figNr ++;
    }
  }
  // The final form will be 800x1000px, leaving room for the print header
  var columnTitleHeight = 50;
  // define column titles and widths
  if (iacForms) {
    var columnTitles = Array('No:20', 'Symbol:100', 'Cat. No.:70', 'K:30', 'Total K:60', 'Grade:80', 'Remarks:260');
    var columnWidths = Array(20, 100, 70, 30, 60, 80, 260);
  } else {
    var columnTitles = Array('No:20', 'Symbol:100', 'Cat. No.:70', 'K:30', 'Total K:60', 'Marks:80', 'Remarks:220', 'Pos:40');
    var columnWidths = Array(20, 100, 70, 30, 60, 40, 40, 220, 40);
  }
  // define height of each row
  var rowHeight = parseInt((1000 - columnTitleHeight) / figNr);
  if (rowHeight > 125) rowHeight = 125;
  // build column titles
  var x = 0;
  for (var i = 0; i < columnTitles.length; i++) {
    drawRectangle (x, 0, columnTitles[i].split(':')[1], columnTitleHeight, 'formLine')
    drawText (columnTitles[i].split(':')[0], x + columnTitles[i].split(':')[1] / 2, columnTitleHeight / 2, 'formAText', 'middle')
    x = x + parseInt(columnTitles[i].split(':')[1])
  }
  var y = columnTitleHeight;
  var row = 0
  figureK = 0
  for (var i = 0; i < figures.length; i++) {
    // reduce rowheight for last one so border fits within height 1000
    if (row == (figNr - 1)) rowHeight -= 2;
    // find Aresti nr(s) and k(s) for figure
    var aresti = figures[i].aresti
    var k = figures[i].k
    // only draw if there is a (fake) aresti number
    if (aresti) {
      var x = 0
      var colCount = (iacForms)? 7 : 9;
      for (var column = 0; column < colCount; column++) {
        switch (column) {
          case (0):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine')
            drawText (row + 1, x + columnWidths[column] / 2, y + rowHeight / 2, 'formATextBold', 'middle')
            break;
          case (1):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'pos')
            // Get the drawn figure from the SVG and set the correct scaling
            var group = document.getElementById('figure' + i)
            var bBox = group.getBBox()
            var scaleFigure = roundTwo((columnWidths[column] - 10) / bBox['width'])
            scaleFigure = scaleFigure.toFixed(4);
            if (((rowHeight - 20) / bBox['height']) < scaleFigure) scaleFigure = roundTwo((rowHeight - 10) / bBox['height'])
            var xMargin = (columnWidths[column] - bBox['width'] * scaleFigure) / 2
            var yMargin = (rowHeight - bBox['height'] * scaleFigure) / 2
            group.setAttribute('transform', 'translate(' + roundTwo((x + xMargin - bBox['x']*scaleFigure)) + ' ' + roundTwo((y + yMargin - bBox['y']*scaleFigure)) + ') scale(' + scaleFigure + ')')
                  break;
          case (2):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            // set the font size from 8-13 depending on the amount of Aresti nrs
            var fontsize = parseInt(rowHeight / (aresti.length + 1));
            if (fontsize < 8) fontsize = 8;
            if (fontsize > 13) fontsize = 13;
            for (var j = 0; j < aresti.length; j++) {
              drawText (aresti[j], x + columnWidths[column] / 2, y + (j + 1) * fontsize, 'formATextBold' + fontsize + 'px', 'middle')
            }
            break;
          case (3):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            var figK = 0;
            // set the font size from 8-13 depending on the amount of Aresti nrs
            var fontsize = parseInt(rowHeight / (aresti.length + 1));
            if (fontsize < 8) fontsize = 8;
            if (fontsize > 13) fontsize = 13;
            for (var j = 0; j < aresti.length; j++) {
              drawText (k[j], x + columnWidths[column] / 2, y + (j + 1) * fontsize, 'formATextBold' + fontsize + 'px', 'middle');
              figK = figK + parseInt(k[j]);
            }
            if (figures[i].connector) {
              if (connectors <= connectFig.max) {
                figK = connectFig.totalK / connectors;
              } else {
                figK = connectFig.totalK / connectFig.max[document.getElementById('class').value];
                alertMsgs.push ('(' + (row + 1) + ') ' +
                  userText.maxConnectors +
                  connectFig.max);
              }
            }
            break;
          case (4):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            if (figures[i].floatingPoint) {
              drawText ('(' + figK + ')', x + columnWidths[column] / 2, y + rowHeight / 2 + 10, 'formAText', 'middle');
              figK = figK - 1;
              drawText (figK, x + columnWidths[column] / 2, y + rowHeight / 2 - 8, 'formATextLarge', 'middle');
            } else {
              drawText (figK, x + columnWidths[column] / 2, y + rowHeight / 2, 'formATextLarge', 'middle');
            }
            if (document.getElementById('printSF').checked === true) {        
              if (document.getElementById('class').value == 'glider') {
                var superFamily = getSuperFamily (aresti, 'glider');
              } else {
                var superFamily = getSuperFamily (aresti, document.getElementById('category').value);
              }
              if (superFamily) {
                drawText('SF ' + superFamily,  x + columnWidths[column] / 2, y + rowHeight - 10, 'formAText', 'middle');
              }
            }
            // check if mark as connector or specific unknown figure
            if (figures[i].connector) {
              drawText('connect',  x + columnWidths[column] / 2, y + 15, 'formAText', 'middle');
            } else if (figures[i].unknownFigureLetter) {
              drawText('Fig ' + figures[i].unknownFigureLetter,  x + columnWidths[column] / 2, y + 15, 'formAText', 'middle');
            }
            figureK = figureK + figK;
            break;
          case (5):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine')
            drawLine (x, y, 0, rowHeight, 'formLineBold')
            break;
          case (6):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine')
            break;
          case (7):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine')
            break;
          default:
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine')
        }
        if (column == (colCount - 1)) drawLine (x + columnWidths[column], y, 0, rowHeight, 'formLineBold')
        if ((row == 0) && (column > 4)) drawLine (x, y, columnWidths[column], 0, 'formLineBold');
        if ((row == (figNr - 1)) && (column > 4)) {
          drawLine (x, y + rowHeight, columnWidths[column], 0, 'formLineBold');
        }
        x = x + columnWidths[column];
      }
      y = y + rowHeight;
      row++;
    }
  }
  SVGRoot.setAttribute("viewBox", '0 0 800 1000');
  // resize svg if we are on a mobile browser
  if (mobileBrowser) {
    SVGRoot.setAttribute('width', '312px');
    SVGRoot.setAttribute('height', '390px');
  } else {
    SVGRoot.setAttribute("width", '800px');
    SVGRoot.setAttribute("height", '1000px');
  }
}

// makeFormB creates Form B from the figures array
function makeFormB() {
  for (var i = 0; i < figures.length; i++) {
    // only make real figures draggable
    var draggable = (figures[i].aresti && true);
    if (figures[i].paths.length) drawFullFigure(i, draggable);
  }
  addFormElements ('B');
}

// makeFormC creates Form C from the figures array
function makeFormC() {
  for (var i = 0; i < figures.length; i++) {
    // only make real figures draggable
    var draggable = (figures[i].aresti && true);
    if (figures[i].paths.length) drawFullFigure(i, draggable);
  }
  addFormElements ('C');
}

// makeFormGrid creates a grid of figures
function makeFormGrid (cols) {
  var svg = SVGRoot;
  var cw = parseInt(800 / cols);
  var ch = parseInt(cw * Math.GR);
  var x = 0;
  var y = 0;
  var col = 0;
  var scaleMin = Infinity; // high number, will hold the smallest Fig scale
  // draw all real figures
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) {
      var f = figures[i];
      // draw rectangle
      drawRectangle (x, y, cw, ch, 'formLine', svg);
      // draw figure Ks, Arestis and Figure Letter
      var textWidth = 0;
      var figK = 0;
      var yy = y + ch - 10;
      for (var j = f.k.length - 1; j>=0; j--) {figK += parseInt(f.k[j])};
      drawText('K: ' + figK,  x + 5, yy, 'formATextBold', 'start');
      for (var j = f.k.length - 1; j>=0; j--) {
        yy -= 15;
        drawText(f.aresti[j] + '(' + f.k[j] + ')',  x + 5, yy, 'formAText', 'start', 'Fig' + i + 'Aresti' + j, svg);
        var tw = svg.lastChild.getBBox().width;
        if (tw > textWidth) textWidth = tw;
      }
      if (figures[i].unknownFigureLetter) {
        yy -= 15;
        drawText('Fig ' + f.unknownFigureLetter,  x + 5, yy, 'formATextBold', 'start');
      }
      
      // draw comments
      if (f.comments) {
        var flagWidth = 0;
        var code = false;
        // check for three-letter flag code
        var match = f.comments.match(/[A-Z]{3}/g);
        if (match) {
          for (var j = match.length - 1; j >= 0; j--) {
            // check for IOC codes first
            if (iocCountriesReverse[match[j]]) {
              code = iocCountriesReverse[match[j]].toLowerCase();
              if (flags[code]) {
                break;
              } else code = false; 
            }
            // next check for iso codes
            if (isoCountriesReverse[match[j]]) {
              code = isoCountriesReverse[match[j]].toLowerCase();
              if (flags[code]) {
                break;
              } else code = false; 
            }
          }
        }
        if (code) {
          // set scale for flag
          var scale = roundTwo((cw - tw - 10) / 56);
          if (scale > 1) scale = 1;
          var flag = document.createElementNS (svgNS, 'image');
          flag.setAttribute('width', 48 * scale);
          flag.setAttribute('height', 48 * scale);
          flag.setAttribute('x', x + cw - (52 * scale));
          flag.setAttribute('y', y + ch - (48 * scale));
          flag.setAttribute('id', 'flag' + i);
          flag.setAttributeNS(xlinkNS, 'href', 'data:image/png;base64,' + flags[code]);
          svg.appendChild(flag);
          flagWidth = 56 * scale;
        }

        var paths = makeTextBlock (f.comments);
        // create group for comments
        var g = svg.appendChild(document.createElementNS (svgNS, 'g'));
        for (var j = 0; j < paths.length; j++) {
          // don't draw box, only text
          if (!paths[j].path) drawShape (paths[j], g);
        }
        var bBox = g.getBBox();
        // check if comments fit right of Aresti nrs, scale if necessary
        var scale = (cw - tw - flagWidth - 40) / bBox.width;
        if (scale > 1) scale = 1;
        if (scale < 0.67) {
          // would get too small, put above Aresti nrs and scale to
          // column width, upto factor 0.67
          scale = (cw - 40) /bBox.width;
          if (scale > 1) scale = 1;
          if (scale < 0.67) scale = 0.67;
          yy -= (bBox.height + 10);
          g.setAttribute ('transform', 'translate(' +
            roundTwo(x - (bBox.x * scale) + 5) + ',' +
            roundTwo(yy - (bBox.y * scale)) + ') scale(' +
            roundTwo(scale) + ')');
        } else {
          // put right and scale
          if (((yy - 15) + (bBox.height * scale)) > ((y + ch) - 10)) {
            yy = (y + ch) + 5 - (bBox.height * scale);
          }
          g.setAttribute ('transform', 'translate(' +
            roundTwo(x - (bBox.x * scale) + tw + 25) + ',' + 
            roundTwo((yy - 15) - (bBox.y * scale)) + ') scale(' +
            roundTwo(scale) + ')');
        }
      }
        
      // draw figure
      var fh = yy - y - 10;
      // set X and Y to 0 to prevent roundoff errors in figure drawing
      // and scaling
      X = 0;
      Y = 0;
      drawFullFigure(i, f.paths[0].figureStart, svg);
      var bBox = f.bBox;
      var thisFig = svg.getElementById('figure' + i);
      // set figure size to column width - 20
      var scale = (cw - 20) / bBox.width;
      if (((fh - 20) / bBox.height) < scale) {
        scale = (fh - 20) / bBox.height;
      }
      if (scale < scaleMin) scaleMin = scale;
      // move each figure to grid element center and scale appropriately
      figures[i].tx = roundTwo(x - (bBox.x * scale) + ((cw - bBox.width * scale) / 2));
      figures[i].ty = roundTwo(y - (bBox.y * scale) + ((fh - bBox.height * scale) / 2));
      figures[i].fh = roundTwo(fh);
      figures[i].viewScale = roundTwo(scale);
      thisFig.setAttribute ('transform', 'translate(' +
        figures[i].tx + ',' + 
        figures[i].ty + ') scale(' + 
        figures[i].viewScale + ')');
      x += cw;
      col++;
      if (col >= cols) {
        x = 0;
        col = 0;
        y += ch;
      }
    }
  }
  // update viewbox and svg height
  svg.setAttribute("viewBox", '-1 -1 802 ' + (y + ch + 2));
  if (mobileBrowser) {
    svg.setAttribute("width", 312);
    svg.setAttribute("height", roundTwo((y + ch + 2) * (312 / 802)));
  } else {
    svg.setAttribute("width", 802);
    svg.setAttribute("height", (y + ch + 2));
  }    

  // go through the figures again, set maximum scale to scaleMin * 1.8
  // and recenter horizontally when necessary
  for (var i = 0; i < figures.length; i++) {
    var f = figures[i];
    if (f.aresti) {
      var thisFig = svg.getElementById('figure' + i);
      var scale = f.viewScale;
      if (scale > (scaleMin * 1.8)) {
        var scale = scaleMin * 1.8;
        var bBox = f.bBox;
        var x = roundTwo(f.tx + (bBox.x * f.viewScale) - ((cw - bBox.width * f.viewScale) / 2));
        var y = roundTwo(f.ty + (bBox.y * f.viewScale) - ((f.fh - bBox.height * f.viewScale) / 2));
        thisFig.setAttribute ('transform', 'translate(' +
          roundTwo(x - (bBox.x * scale) + ((cw - bBox.width * scale) / 2)) +
          ',' + roundTwo(y - (bBox.y * scale) + ((f.fh - bBox.height * scale) / 2)) +
          ') scale(' + roundTwo(scale) + ')');
      }
    }
  }
}

// makeFormPilotCard creates pilotcards from the figures array
function makeFormPilotCard() {  
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].paths.length) {
      drawFullFigure(i, figures[i]['paths'][0]['figureStart']);
    }
  }
}

// addFormElements adds wind & mini form A and adjusts size
function addFormElements (form) {
  // Find out how big the SVG has become and adjust margins
  var bBox = SVGRoot.getElementById('sequence').getBBox();
  var x = parseInt(bBox.x) ;
  var y = parseInt(bBox.y);
  var w = parseInt(bBox.width);
  var h = parseInt(bBox.height);
  y -= 40;
  h += 40;
  switch (form) {
    case 'B':
      if (miniFormA) {
        drawWind ((w + x) + 172, y, 1);
      } else {
        drawWind (w + x, y, 1);
      }
      break;
    case 'C':
      drawWind (x, y, -1);
      break;
  }
  // Add mini Form A, but only to Form B or C when miniFormA is set
  if (((form === 'C') || (form === 'B')) && miniFormA) {
    var block = makeMiniFormA ((w + x) + 20, y + 50);
  } else {
    var block = {'width':0, 'height':0};
  }
  w += 20 + block.width;
  if ((50 + block.height) > h) h = (50 + block.height);
  // Change the viewBox to make the sequence fit
  SVGRoot.setAttribute("viewBox",
    (x - 3) + ' ' + (y - 3) + ' ' + (w + 5) + ' ' + (h + 30));
  // resize svg if we are on a mobile browser
  var scaleSvg = (mobileBrowser)? 312 / (w + 5) : 1;
  
  SVGRoot.setAttribute("width",  scaleSvg * (w + 5));
  SVGRoot.setAttribute("height", scaleSvg * (h + 30));
}

// displayAlerts displays alert messages in the Alerts box
function displayAlerts () {
  var container = document.getElementById("alerts");
  // Clear any previous messages but make sure we don't remove the label (2 nodes)
  while (container.childNodes.length > 2) {
    container.removeChild(container.lastChild);
  }
  // Display messages, start with a break to stay clear from the label
  for (var i = 0; i < alertMsgs.length; i++) {
    container.appendChild (document.createElement('br'));
    var htmlText = document.createElement('span');
    container.appendChild (htmlText);
    htmlText.innerHTML = alertMsgs[i];
  }
  // Add break to keep the box open with no alerts
  if (i === 0) container.appendChild (document.createElement('br'));
  // Clear all alerts
  alertMsgs = [];
}

// do some kind of draw
function draw () {
  rebuildSequenceSvg ();
  // reset all drawing variables to default values
  firstFigure = true;
  Attitude = 0;
  X = 0;
  Y = 0;
  var content = '';
  if (activeForm === 'C') {
    goRight = false;
    setYAxisOffset (180 - yAxisOffsetDefault);
    Direction = 180;
  } else {
    goRight = true;
    setYAxisOffset (yAxisOffsetDefault);
    Direction = 0;
  }
  
  parseSequence();

  if (activeForm === 'A') {
    makeFormA();
  } else if (activeForm === 'B') {
    makeFormB();
  } else if (activeForm === 'C') {
    makeFormC();
  } else {
    makeFormGrid(document.getElementById('gridColumns').value);
  }
  // check if selectedFigure.id is still valid
  if (!figures[selectedFigure.id]) selectFigure(false);
  // display all alerts
  displayAlerts ();
}

function updateSequenceTextHeight () {
  var cloneDiv = document.getElementById('sequenceTextClone');
  if (!mobileBrowser) {
    // use the clone div to determine the height of the sequence textarea
    // add two characters to make sure the text in the clone is always longer    
    cloneDiv.innerHTML = sequenceText.value + '##';
    // when the clone is only a single line, add a break for minimum 2 lines
    if (cloneDiv.offsetHeight < 22) cloneDiv.innerHTML += '<br />.';
    var height = cloneDiv.offsetHeight;
    //if (height < 36) height = 36;
    sequenceText.setAttribute('style', 'height:' + (height + 6) + 'px;');
    // also set the position of the "main" div
    document.getElementById('main').setAttribute ('style', 'top:' + (height - 14) + 'px;');
  } else {
    cloneDiv.innerHTML = '';
  }
}

// checkSequenceChanged is called by onInput on the
// sequence input field to check if it has to be redrawn.
// When force is set (e.g. after drag & drop) redraw will always be done
function checkSequenceChanged (force) {
  
  // remove all line breaks from the sequence input field
  sequenceText.value = sequenceText.value.replace (/(\r\n|\n|\r)/gm, '');
  // update height of sequence text box for non-mobile browsers
  updateSequenceTextHeight();
  // read the sequence string and mark the location of the caret/selection
  var selStart = sequenceText.selectionStart;
  var selectFigureId = false;
  
  // whenever the sequence is empty, clear the filename
  if (sequenceText.value == '') fileName.value = '';
  
  // Prevent OpenAero from being left unintentionally
  if (activeSequence.text != sequenceText.value) {
    sequenceSaved = false;
    window.document.addEventListener('beforeunload', preventUnload);
  }

  if ((activeSequence.text != sequenceText.value) || force) {
    // reset sequence entry options
    updateSequenceOptions ('');
    activeSequence.text = sequenceText.value;
    var string = activeSequence.text;
    // whenever the string is empty, consider it 'saved'
    if (string === '') {
      sequenceSaved = true;
      window.document.removeEventListener('beforeunload', preventUnload);
    }

    var figure = [];
    var thisFigure = {'string':'', 'stringStart':0, 'stringEnd':0};
    var inText = false;
    for (var i = 0; i <= string.length; i++) {
      if (string[i] == userpat.comment) inText = !inText;
      if (((string[i] === ' ') || (i === string.length)) && !inText) {
        if (thisFigure.string !== '') {
          var match = thisFigure.string.match (regexMoveForward);
          // Create a separate 'figure' for moveForward (x>) at the
          // beginning of a figure.
          // OLAN has it coupled to a figure but OpenAero keeps sequence
          // drawing instructions separate
          if (match) {
            figure.push ({
              'string':match[0],
              'stringStart':thisFigure.stringStart,
              'stringEnd':(thisFigure.stringStart + match[0].length)});
            thisFigure.stringStart = thisFigure.stringStart + match[0].length;
            thisFigure.string = thisFigure.string.replace(regexMoveForward, '');
          }
          // do the same for moveDown (x^)
          var match = thisFigure.string.match (regexMoveDown);
          if (match) {
            figure.push ({
              'string':match[0],
              'stringStart':thisFigure.stringStart,
              'stringEnd':(thisFigure.stringStart + match[0].length)});
            thisFigure.stringStart = thisFigure.stringStart + match[0].length;
            thisFigure.string = thisFigure.string.replace(regexMoveDown, '');
          }          
          // only add figures that are not empty
          if (thisFigure.string != '') {
            figure.push ({
              'string':thisFigure.string,
              'stringStart':thisFigure.stringStart,
              'stringEnd':i});
            thisFigure.string = '';
            // make the selected figure the same as the one selected in
            // the string, when the string has focus
            if (sequenceText.hasfocus) {
              if ((selStart >= thisFigure.stringStart) && (selStart < i)) {
                if (selectedFigure.id != (figure.length - 1)) {
                  selectFigureId = figure.length - 1;
                }
              }
            }
          }
        }
      } else {
        // set the start when this is the first character
        if (thisFigure.string === '') thisFigure.stringStart = i;
        // add the character
        thisFigure.string += string[i];
      }
    }

    // save previous figures for ^ > flip check
    activeSequence.previousFigures = activeSequence.figures;

    // Now assign to activeSequence      
    activeSequence.figures = figure;
    
    // Get current scroll position of the sequence
    var scrollPosition = SVGRoot.parentNode.scrollTop;
    
    // Update activeSequence.xml and storage
    changeSequenceInfo();

    // Redraw sequence
    draw ();
    
    // Select the correct figure when applicable
    if ((selectFigureId !== false) && (selectedFigure.id !== null)) {
      selectFigure (selectFigureId);
    }
    
    // Set the correct scroll position
    SVGRoot.parentNode.scrollTop = scrollPosition;
          
    // Update figure editor when a figure is being edited
    if (selectedFigure.id !== null) updateFigureEditor();

    // Update marking of figures in figure selector when active
    if (document.getElementById('figureSelector').classList.contains ('active')) {
      markFigures ();
    }
  } else if (sequenceText === document.activeElement) {
    // when no change was made, just check where the caret in the
    // sequence text is and when necessary change selected figure
    for (var i = 0; i < figures.length; i++) {
      if ((selStart >= figures[i].stringStart) && (selStart <= figures[i].stringEnd)) {
        if (figures[i].aresti) {
          selectFigureId = i;
        }
        break;
      }
    }
    if (selectFigureId != selectedFigure.id) {
      selectFigure (selectFigureId);
    }
  }
}

// select which Form to show
function selectForm (form) {
  activeForm = form;
  updateDefaultView();
  draw (form);
  if (mobileBrowser) selectTab('tab-svgContainer');
}

// updateDefaultView updates the hidden defaultView value
function updateDefaultView (queue) {
  var el = document.getElementById('default_view');
  if (queue) {
    el.value = 'queue';
  } else {
    if (activeForm === 'Grid') {
      el.value = 'grid:' + document.getElementById('gridColumns').value;
    } else el.value = '';
  }
  changeSequenceInfo();
}

/******************************************
 * Functions for opening and saving files */

// clearSequence will start a new blank sequence
function clearSequence () {
  function clear() {
    // clear all input fields
    var fields = document.getElementsByTagName('input');
    var length = fields.length;
    while (length--) {
      if (fields[length].type === 'text') {
        fields[length].value = '';
      }
    }
    var fields = document.getElementsByTagName('textarea');
    var length = fields.length;
    while (length--) {
      fields[length].value = '';
    }
    // reload sequence
    checkSequenceChanged();
    displayAlerts();
    sequenceSaved = true;
  }
  
  if (!sequenceSaved) {
    confirmBox (userText.sequenceNotSavedWarning,
      userText.clearSequence, clear);
  } else {
    clear();
  }
}

// openLogoFile will load a logo from a file
function openLogoFile () {
  hideLogoChooser();
  openFile(document.getElementById('logoFile').files[0], 'Logo');
}

// exampleSequence will load an example sequence
function exampleSequence () {
  var key = this.id.replace(/^example-/, '');
  OLANBumpBugCheck = false;
  fileName.value = '';
  activateXMLsequence(exampleSequences[key]);
  selectFigure (false);
}

// openSequence will load a sequence from a .seq file
function openSequence () {
  function open () {
    var form = document.getElementById('fileForm');
    var el = document.getElementById('file');
    openFile(el.files[0], 'Sequence');
    
    // clone the file input element
    var el2 = el.cloneNode(true);
    
    // retrieve filename by changing file input to span
    el.parentNode.replaceChild(document.createElement('span'),el);
    var filename = el.value.replace(/.*\\/, '').replace(/\.[^.]*$/, '');
    
    fileName.value = filename;
    fileName.updateSaveFilename;
    
    // rebuild and reset the form
    form.removeChild (form.firstChild);
    form.appendChild(el2);
    form.reset();

    // add event listener to new element
    el2.addEventListener('change', openSequence, false);
  }

  // Check if the current sequence was saved. If not, present a dialog
  if (!sequenceSaved) {
    confirmBox (userText.sequenceNotSavedWarning,
      userText.openSequence, open);
  } else {
    open();
  }

}

// openSequence will load a sequence from a .seq file
function openQueue () {
  openFile(document.getElementById('queue').files[0], 'Queue');
  // Clear file field to enable loading the same file again
  document.getElementById('queueForm').reset();
}

// openRulesFile will load a rules file from a .js file
function openRulesFile () {
  openFile(document.getElementById('rulesFile').files[0], 'RulesFile');
  // Clear file field to enable loading the same file again
  document.getElementById('rulesFileForm').reset();
}

// openFile is called to open a file
// file    = file object from file input element
// handler = name of correct handler to execute after loading. Function
//           names are loaded<handler>
function openFile (file, handler) {
  if(file){
    console.log('Reading file: ' + file.name);
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    // Handle success, and errors. With onload the correct loading
    // function will be called
    switch (handler) {
      case 'SequenceMulti':
        reader.onload = loadedSequenceMulti;
        break;
      case 'Sequence':
        reader.onload = loadedSequence;
        break;
      case 'Queue':
        reader.onload = loadedQueue;
        break;
      case 'Logo':
        reader.onload = loadedLogo;
        break;
      case 'RulesFile':
        reader.onload = loadedRulesFile;
        break;
    }

    reader.onerror = errorHandler;
  }
}

// removeFileListFile removes a file from fileList
function removeFileListFile(el, f) {
  fileList.splice (el.id.replace(/^removeFileListFile/, ''), 1);
  f();
}
  
// checkMultiDialog shows or hides the multiple sequence check dialog
// when false, the dialog is closed
function checkMultiDialog(show) {
  var div = document.getElementById('checkMulti');
  if (show) {
    div.classList.remove ('noDisplay');
    var el = document.getElementById('multiCurrentRules');
    el.innerHTML = (rulesActive)? rulesActive : userText.none;
  } else {
    // clear fileList
    fileList = [];
    var el = document.getElementById('fileDropFiles');
    while (el.childNodes.length > 0) el.removeChild(el.lastChild);
    div.classList.add ('noDisplay');
  }
}

// updateMulti is called after dragging & dropping files to multi field
function updateMulti (evt) {
  if (evt) {
    if (evt.dataTransfer) {
      evt.stopPropagation();
      evt.preventDefault();
      var files = evt.dataTransfer.files; // FileList object.
    } else {  
      // get files from file element
      var files = evt.files;
      // clear for next, after short wait
      setTimeout(function(){evt.parentNode.reset();}, 400);    
    }
    for (var i = 0; i < files.length; i++) {
      fileList.push (files[i]);
    }
  }
  var el = document.getElementById('fileDropFiles');
  while (el.childNodes.length > 0) el.removeChild(el.lastChild);
  for (var i = 0; i < fileList.length; i++) {
    var div = document.createElement ('div');
    var span = document.createElement ('span');
    span.classList.add ('fileListFileRemove');
    span.id = 'removeFileListFile' + i;
    span.addEventListener ('mousedown', function(){
      removeFileListFile(this, updateMulti);
      }, false);
    div.appendChild (span);
    var name = document.createTextNode (fileList[i].name);
    div.appendChild (name);
    el.appendChild(div);
  }
}

// checkMulti is called to open multiple files for checking.
function checkMulti () {
  // save active sequence
  multi.savedSeq = activeSequence.xml;
  // set counter and limit
  multi.count = 0;
  multi.total = fileList.length;
  if (multi.total === 0) return;
  infoBox (
    sprintf(userText.checkMultiWait, multi.total),
    userText.checkMulti);
  if (!chromeApp.active) {
    // open check window. Must do this early to prevent popup blocking
    newWindow ('', userText.sequenceCheckLog);
  }  
  var body = document.createElement('body');
  // go through the selected files
  for (var i = 0, f; f=fileList[i];i++){
    (function (file) {
      var reader = new FileReader();
      // Handle success, and errors. With onload the correct loading
      // function will be called
      reader.readAsText(file, "UTF-8");
      reader.file = file;
      reader.onload = function(e) {loadedSequenceMulti(e, body)};
      reader.onerror = function(e) {errorMulti(e, body)};
    })(f);
  }
  // hide dialog screen
  checkMultiDialog();
}

// finishMulti will be called when all sequences have been checked
function finishMulti (body) {
  // show the check result window
  newWindow (body, userText.sequenceCheckLog);
  // clear "wait" message
  infoBox ();
  // Clear file field to enable loading the same file again
  document.getElementById('checkMultiFileForm').reset();
  // restore saved sequence
  activateXMLsequence (multi.savedSeq);
  //checkSequenceChanged();
}

// loadedSequenceMulti will be called when a sequence file has been
// loaded for multiple sequence checking
function loadedSequenceMulti(evt, body) {
  // check if loadedSequenceMulti is running. If so, set 100ms timeout
  // for next try
  if (multi.processing) {
    setTimeout (loadedSequenceMulti(evt, body), 100);
    return;
  } else multi.processing = true;
  // increase multi counter
  multi.count++;
  /** fixme: possible code to show counter. Problem: it requires full
   *  redraw which maken everything very slow and messy and thus is
   *  counterproductive. Maybe through separate window?
   */
  // document.getElementById ('checkMultiCounter').innerHTML = sprintf(
  //  userText.checkMultiWait, multi.count, multi.total, evt.target.file.name);
  
  console.log('Checking: ' + evt.target.file.name);
  // create log entry
  var pre = document.createElement('pre');
  body.appendChild (pre);
  pre.appendChild(document.createTextNode('File: ' + evt.target.file.name + '\n'));

  // Obtain the read file data  
  var fileString = evt.target.result;
  // Check if we have an OLAN sequence or an OpenAero XML sequence.
  // If the sequence file starts with '<', assume it's an XML sequence.
  // If it starts with '[', assume it's an OLAN sequence.
  // In all other cases throw an error.
  if (fileString.charAt(0) === '<') {
    OLANBumpBugCheck = false;
  } else if (fileString.charAt(0) === '[') {
    // OLAN sequence, transform to XML
    fileString = OLANtoXML (fileString);
  } else {
    pre.appendChild (document.createTextNode(userText.notSequenceFile + '\n'));
    console.log('*** ' + userText.notSequenceFile);
    fileString = false;
  }
  
  if (fileString) {    
    activateXMLsequence (fileString, true);
    // make sure no figure is selected
    selectFigure (false);
  
    // Activate the loading of the checking rules (if any)
    if (document.getElementById('multiOverrideRules').checked) {
      // use rules currently set
      var log = checkRules();
    } else {
      // use rules from file
      var log = changeCombo('program');
    }
  
    // clear any alert boxes. Errors are shown in the log.
    alertBox();
    // clear alert messages
    alertMsgs = [];
  
    if (document.getElementById('multiFullLog').checked) {
      // full expanded log
      
      for (var i = 0; i < log.length; i++) {
        pre.appendChild(document.createTextNode(log[i] + '\n'));
      }
    } else {
      // concise log
      
      // get alerts from alert area
      var div = document.createElement('div');
      div.innerHTML = document.getElementById('alerts').innerHTML;
      // remove label and <br> (first three items)
      div.removeChild(div.firstChild);
      div.removeChild(div.firstChild);
      div.removeChild(div.firstChild);
      if (div.innerHTML == '') {
        if (rulesActive) {
          pre.appendChild(document.createTextNode('Rules: ' + rulesActive + '\n'));
          pre.appendChild(document.createTextNode(userText.sequenceCorrect + '\n'));
        } else {
          pre.appendChild(document.createTextNode(userText.noRules + '\n'));
        }
      } else {
        if (rulesActive) {
          pre.appendChild(document.createTextNode('Rules: ' + rulesActive + '\n'));
        }
        body.appendChild (div);
        // myWindow.document.body.appendChild(div);
        var pre = document.createElement('pre');
        // myWindow.document.body.appendChild (pre);
        body.appendChild (pre);
      }
    }
  }
  pre.appendChild(document.createTextNode('--------------------------------------------------------\n'));
  // done processing file
  multi.processing = false;
  if (multi.count == multi.total) finishMulti(body);
}

// errorMulti will be called when there is a multi file loading error
function errorMulti(e, body) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('Error: ' + msg);
  // increase multi counter
  multi.count++;
  if (multi.count == multi.total) finishMulti(body);
}

// loadedSequence will be called when a sequence file has been loaded
function loadedSequence(evt) {
  // Obtain the read file data  
  var fileString = evt.target.result;
  // Check if we have an OLAN sequence or an OpenAero XML sequence
  // If the sequence file starts with '<', assume it's an XML sequence
  // If it starts with '[', assume it's an OLAN sequence
  // In other cases, throw an error
  if (fileString.charAt(0) === '<') {
    OLANBumpBugCheck = false;
  } else if (fileString.charAt(0) === '[') {
    // OLAN sequence, transform to XML
    fileString = OLANtoXML (fileString);
  } else {
    alertBox(userText.notSequenceFile);
    console.log('*** ' + userText.notSequenceFile);
    return;
  }

  activateXMLsequence (fileString, true);
  // make sure no figure is selected
  selectFigure (false);

  // update the sequence if OLANSequence was true
  if (OLANSequence) {
    OLANSequence = false;
    updateSequence (-1, '');
    activeSequence.text = '';
    checkSequenceChanged();
  }
  // changeSequenceInfo();
  sequenceSaved = true;
  window.document.removeEventListener('beforeunload', preventUnload);

  // Activate the loading of the checking rules (if any)
  changeCombo('program');
}

// loadedQueue will be called when a queue file has been loaded
function loadedQueue(evt) {
  // Obtain the read file data  
  var fileString = evt.target.result;
  // Check if we have an OLAN sequence or an OpenAero XML sequence
  // If the sequence file starts with '<', assume it's an XML sequence
  if (fileString.charAt(0) === '<') {
    OLANBumpBugCheck = false;
  } else {
    // OLAN sequence, transform to XML
    fileString = OLANtoXML (fileString);
  }
  // save current sequence
  var sequence = activeSequence.xml;

  // clear queue
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i]) {
      if (fig[i].group == 0) {
        delete fig[i];
      } else break;
    }
  }
  // put the figures in the queue
  activateXMLsequence (fileString);

  for (var i = 0; i < figures.length; i++) {  
    if (figures[i].aresti) {
      selectedFigure.id = i;
      addToQueue();
    }
  }
  selectFigure (false);
  // restore previous sequence or start with empty
  activateXMLsequence (sequence);
  // show queue
  showQueue();
}
  
// OLANtoXML transforms an OLAN file to OpenAero XML
function OLANtoXML (string) {
  OLANSequence = true;
  var activeKey = false;
  var lines = string.split('\n');
  string = '<sequence>';
  for (var i = 0; i < lines.length; i++) {
    // remove Windows linebreak
    lines[i] = lines[i].replace('\r', '');
    // check for key match
    if (lines[i].match(/^\[[a-zA-Z]+\]$/)) {
      var key = lines[i].toLowerCase().replace(/[^a-z]/g, '');
      if (key === 'sequence') {
        key = 'sequence_text';
      }
      if (activeKey) {
        string += '</' + activeKey + '>';
        activeKey = false;
      }
      if (inArray(sequenceXMLlabels, key)) {
        string += '<' + key + '>';
        activeKey = key;
      } else activeKey = false;
    } else if (activeKey) string += lines[i];
  }
  if (activeKey) string += '</' + activeKey + '>';
  // end with current oa_version to prevent some error messages
  string += '<oa_version>' + version + '</oa_version></sequence>';
  OLANBumpBugCheck = true;
  return string;
}

// activateXMLsequence will make a sequence provided as XML active
function activateXMLsequence (xml, noLoadRules) {
  // clear previous values
  for (var i = 0; i < sequenceXMLlabels.length; i++) {
    document.getElementById(sequenceXMLlabels[i]).value = '';
  }
  // set 'class' to powered by default to provide compatibility with OLAN
  // and older OpenAero versions
  document.getElementById('class').value = 'powered';
  if (xml) {
    // myElement will hold every entry as a node
    var myElement = document.createElement('div');
    // myTextArea will translate HTML escape characters to regular ones
    var myTextArea = document.createElement('textarea');
    myElement.innerHTML = xml;
    var rootNode = myElement.getElementsByTagName("sequence")[0];
    var nodes = rootNode.childNodes;
    // Put every element in the correct field
    for (var ele in nodes) {
      if(nodes[ele].innerHTML) {
        // translate escape characters by browser through myTextArea
        myTextArea.innerHTML = nodes[ele].innerHTML;
        // e will be the field, only put a value when it exists
        var e = document.getElementById(nodes[ele].nodeName.toLowerCase());
        if (e) e.value = myTextArea.value;
      }
    }
    // check for default_view
    var view = document.getElementById('default_view').value;
    if (view) {
      var view = view.split(':');
        if (view[0] === 'grid') {
        document.getElementById('gridColumns').value = view[1];
        activeForm = 'Grid';
      } else if (view[0] === 'queue') {
        activeForm = 'Grid';
      }
    }
    var logo = document.getElementById('logo').value;
    if (logoImages[logo]) selectLogo(logo);

    //logo = document.getElementById('logo').value;
    //if (logoImages[logo]) selectLogo(logo);

    checkOpenAeroVersion();
  }
  // hide Harmony field for powered
  var el = document.getElementById ('harmonyField');
  if (sportingClass.value === 'powered') {
    el.setAttribute('style', 'opacity:0;');
  } else el.removeAttribute('style');
  // Load rules when applicable and update sequence data
  // Don't change the logo
  if (!noLoadRules) changeCombo('rules', true);
  
  // update sequence
  checkSequenceChanged();

  // sequence was just loaded, so also saved
  window.document.removeEventListener('beforeunload', preventUnload);
  sequenceSaved = true;
}

// handleDragOver takes care of file dragging
function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

/**********************
 * End file functions */

// checkOpenAeroVersion checks for the version number of the loaded
// sequence and provides a warning if necessary
function checkOpenAeroVersion () {
  var oa_version = document.getElementById('oa_version');
  var alerts = '';
  if (oa_version.value == '') {
    // before 1.2.3
    if (sequenceText.value != '') alerts += userText.warningPre123;
  }
  if (compVersion (oa_version.value, '1.2.4') < 0) {
    // check for bumps
    if (sequenceText.value.match (/(b|pb)(b|pb)/)) {
      alerts += userText.warningPre124;
    }
  }
  if (compVersion (oa_version.value, '1.3.7') < 0) {
    // check for snaps started from knife edge
    if (sequenceText.value.match (/((^|[^0-9])(4|[357]4?))[if\.'`]*[,;][\.'`]*[357]i?f/)) {
      alerts += userText.warningPre137;
    }
  }
    
  // add any additional checks here
  // compVersion can be used to check against specific minimum versions
  if (alerts != '') alertBox(alerts + userText.warningPre);
  // set version to current version for subsequent saving
  oa_version.value = version;
}

// compVersion compares two versions and returns:
// -1 when v1 < v2
// 1 when v1 > v2
// 0 when v1 = v2
// No letters can be used but any number of digits. Comparison will
// continue until all digits of the longest version have been checked,
// where a 0 will be counted as higher than no number at all.
// E.g. ("1.4.0.0", "1.4.0") will return 1
function compVersion (v1, v2) {
  var subV1 = v1.split('.');
  var subV2 = v2.split('.');
  var count = (subV1.length > subV2.length)? subV1.length : subV2.length;
  for (var i = 0; i < count; i++) {
    if (i >= subV1.length) return -1;
    if (i >= subV2.length) return 1;
    if (parseInt(subV1[i]) < parseInt(subV2[i])) return -1;
    if (parseInt(subV1[i]) > parseInt(subV2[i])) return 1;
  }
  return 0;
}
   
// loadedLogo will be called when a logo image has been loaded
function loadedLogo (evt) {
  var fileData = evt.target.result;
  if (evt.type) {
    // svg images are put in logoImg as-is
    if (fileData.match(/<svg/)) {
      logoImg = fileData;
    // other (binary) images are encoded to base64
    } else {
      logoImg = 'data:' + evt.type + ';base64,' + btoa(fileData);
    }
    draw();
    drawActiveLogo();
  } else {
    alertBox (userText.unknownFileType);
  }
}

// loadedRulesFile will be called when a rules file has been loaded
function loadedRulesFile (evt) {
  // get start index for new rules
  var start = rules.length;
  // convert file to array
  var lines = evt.target.result.toString().split("\n");
  for (var i = 0; i < lines.length; i++) {
    // remove any windows linebreaks
    var line = lines[i].replace('\r', '');
    // only keep part inside rules.push
    line = line.replace (/rules\.push[ ]*\("([^"]*).*$/, "$1");
    // replace all double backslashes by single
    line = line.replace (/\\\\/g, '\\');
    // do some basic matching to check for correct rule line
    if (line.match (/^([0-9\.]{5}|\[[^\]]+\]|\([^\)]+\))/) || line.match (/^[^#\/][a-zA-Z0-9\-_]+=/)) {
      console.log(line);
      rules.push (line);
    }
  }
  // when new rules have been added, parse those
  if (rules.length > start) {
    parseRules (start);
    alertBox (userText.rulesImported + (rules.length - start), userText.rulesImportTitle);
  } else {
    alertBox (userText.rulesNotImported, userText.rulesImportTitle);
  }
}

// updateSaveFilename gets called when the "Save as" filename is changed
// and syncs between t_saveFile and fileName elements
function updateSaveFilename() {
  var filename = this.value;
  var el = document.getElementById('t_saveFile').firstChild;
  if (el) {
    el.setAttribute('download', filename + document.getElementById('fileExt').innerHTML);
  }
  fileName.value = filename;
}

// writeFileEntry uses the Chrome app API to write files
function writeFileEntry(writableEntry, opt_blob, callback) {
  if (!writableEntry) {
    //output.textContent = 'Nothing selected.';
    return;
  }

  writableEntry.createWriter(function(writer) {

    writer.onerror = errorHandler;
    writer.onwriteend = callback;

    // If we have data, write it to the file. Otherwise, just use the
    // file we loaded.
    if (opt_blob) {
      writer.truncate(opt_blob.size);
      waitForIO(writer, function() {
        writer.seek(0);
        writer.write(opt_blob);
      });
    } 
    else {
      chosenEntry.file(function(file) {
        writer.truncate(file.fileSize);
        waitForIO(writer, function() {
          writer.seek(0);
          writer.write(file);
        });
      });
    }
  }, errorHandler);
}

// waitForIO waits for file IO
function waitForIO(writer, callback) {
  // set a watchdog to avoid eventual locking:
  var start = Date.now();
  // wait for a few seconds
  var reentrant = function() {
    if (writer.readyState===writer.WRITING && Date.now()-start<4000) {
      setTimeout(reentrant, 100);
      return;
    }
    if (writer.readyState===writer.WRITING) {
      console.error("Write operation taking too long, aborting!"+
        " (current writer readyState is "+writer.readyState+")");
      writer.abort();
    } 
    else {
      callback();
    }
  };
  setTimeout(reentrant, 100);
}

// saveFile saves a file
// The function returns true if the file was saved
function saveFile(data, name, ext, filter, format, noBounce) {
  
  /***** Version 1.4.0 *****
   * We set noBounce to true as bounce does not work well on iPad and
   * causes different behaviour online and offline.
   * Keep the code for now in case we want to return to using bounce.
   */
  
  // NEVER BOUNCE
  noBounce = true;
  
  // Set saving result to true always as we currently have no method of
  // knowing whether the file was saved or not
  var result = true;

  // depending on browser and online status, we choose a method for
  // saving the file with the following preference:
  // 1) Use chrome.fileSystem, only available when running as Chrome App
  // 2) Use "download" attribute
  // 3) Use bounce off server
  // 4) Ask user to right-click and "Save as"

  // 1) Chrome app saving
  if (chromeApp.active) {
    // convert base64 to binary
    if (format.match (/;base64$/)) {
      var byteC = atob (data);
      var byteN = new Array(byteC.length);
      for (var i = 0; i < byteC.length; i++) {
          byteN[i] = byteC.charCodeAt(i);
      }
      data = new Uint8Array(byteN);
    }
    
    chrome.fileSystem.chooseEntry ({
      'type':'saveFile',
      'suggestedName':name+ext
    }, function(w) {
      var blob = new Blob([data], {type: format.replace(/;.+$/, '')});
      writeFileEntry (w, blob, function(){
        // this callback is called after succesful write
        fileName.value = w.name.replace(/\.[^.]*$/, '');
        fileName.updateSaveFilename;
        if (ext === '.seq') {
          sequenceSaved = true;
          window.document.removeEventListener('beforeunload', preventUnload);
        }
      });
    });
    return;
  }

  // prevent asking confirmation of 'leaving'
  window.document.removeEventListener('beforeunload', preventUnload);
  // reactivate the warning after five seconds
  var handle = setTimeout(function() {
    if (!sequenceSaved) {
      // Prevent OpenAero from being left unintentionally
      window.document.addEventListener('beforeunload', preventUnload);
    }
  }, 5000);

  // Transform utf8 to base64, otherwise handling in the data URI might
  // not work well
  if (RegExp(';utf8$').test(format)) {
    format = format.replace('utf8', 'base64');
    data = btoa(encode_utf8(data));
  }

  var fileURL = 'data:' + format + ',' + data;

  var a = document.createElement('a');
  if (typeof a.download != "undefined") {
    // 2) use "download" attribute
    // Present an alert box with a download link for the file
    
    console.log('Save with download attribute');
    saveDialog (userText.downloadHTML5, name, ext);
    document.getElementById('t_saveFile').innerHTML =
      '<a download="' + name + ext + '" href="data:' + format + ',' +
      data + '" id="dlButton">' + userText.saveFile + '</a>';

  } else {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
  
      var http = true;
    } else {
      var http = false;
    }
    // Disable http bounce for noBounce. Used because zip files cause trouble
    if (noBounce) http = false;
    if (http) {
      var waitTime = 2000; // wait for two seconds when using http
    } else {
      var waitTime = 10;   // wait for 10 ms otherwise (=immediately)
    }
    // 3) Try to save the file through a bounce from PHP.
    //    We use an XMLHttpRequest to determine if we are online
    var xhr = new XMLHttpRequest();
    
    // Set a timer to waitTime. When this activates there is no or bad
    // internet access
    var noResponseTimer = setTimeout(function() {
      xhr.abort();
      // 4) Present an alert box with a download link for the file, to
      //    be used with right-click and "Save as...". The "download"
      //    attribute will not work, as otherwise we would not be
      //    running this routine. But we'll keep it for consistency
      
      // build HTML for alert box
      console.log('Save with right-click');
      saveDialog (userText.downloadLegacy, name, ext);
      document.getElementById('t_saveFile').innerHTML =
        '<a download="' + name + ext + '" href="data:' + format + ',' +
        data + '" id="dlButton" target="_blank">' + userText.saveFile +
        '</a>';
    }, waitTime);
  
    if (http) {
      // Set event for XMLHttpRequest state change
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) {
          return;
        }
        if (xhr.status == 200) {
          // connection available, go for bounce
          clearTimeout(noResponseTimer);
          console.log('Save through bounce');
          // show save dialog
          saveDialog (userText.downloadHTML5, name, ext);
          // add link that will arrange submitting the form to openaero.php
          var el = document.getElementById('t_saveFile');
          el.innerHTML = '<a href="#">' + userText.saveFile + '</a>';
          el.addEventListener ('mousedown', bounceFile, false);
          // populate bounce form
          var form = document.getElementById("saveFileForm");
          form.elements["data"].value = data;
          form.elements["name"].value = document.getElementById('dlTextField').value + ext;
          form.elements["format"].value = format;
        }
      }
      
      // Send request
      xhr.open("GET", 'openaero.php');
      xhr.send();
    }
  }

    /** code for immediate saving, without seperate filename dialog
    var save = document.createElement('a');
    save.href = fileURL;
    save.target = '_blank';
    save.download = savefile.name;
    
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent("click", true, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save.dispatchEvent(event);
    (window.URL || window.webkitURL).revokeObjectURL(save.href);
    */
 
/** IE code, disabled. Maybe use in the future

  // for non-IE
  if (!window.ActiveXObject) {
  }

  // for IE
  else if ( !! window.ActiveXObject && document.execCommand)     {
      var _window = window.open(fileURL, '_blank');
      _window.document.close();
      _window.document.execCommand('SaveAs', true, fileName || fileURL)
      _window.close();
  }

//END IE code */ 
  
  return result;
}

// bounceFile will submit the filled-out form for bouncing file off server
function bounceFile () {
  console.log ('Submitting file for bounce');
  document.getElementById('saveFileForm').submit();
  document.getElementById('t_saveFile').removeEventListener ('mousedown', bounceFile);
}
  
// saveSequence will save a sequence to a .seq file
// the .seq file is standard xml, so not OLAN compatible
function saveSequence () {
  function save() {
    var filename = activeFileName();

    if (filename === '') filename = 'sequence';
    // take the original sequence XML,
    // remove the end tag, add figure XML and add the end tag again.
    // Then beautify the output.
    var xml = activeSequence.xml.replace('</sequence>', '');
    xml += buildFigureXML();
    xml += buildSettingsXML();
    xml += '</sequence>';
    xml = vkbeautify.xml (xml);
    saveFile (
      xml,
      filename,
      '.seq',
      {'name':'OpenAero Sequence', 'filter':'*.seq'},
      'text/xhtml+xml;utf8'
    );
  }
  
  missingInfoCheck(save);
}

// saveQueue will save the current queue to a .seq file
// the .seq file is standard xml, so not OLAN compatible
function saveQueue () {
  var sequenceString = sequenceText.value;
  var queueFigs = [];
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i]) {
      if (fig[i].group == 0) {
        queueFigs.push (fig[i].string);
      } else break;
    }
  }
  if (queueFigs.length == 0) {
    alertBox (userText.queueEmpty);
    return;
  }
  // put queue figures in sequence for saving
  sequenceText.value = queueFigs.join(' // ');
  updateDefaultView(true);
  checkSequenceChanged();
  var filename = activeFileName('QUEUE');
  // Beautify the output.
  var xml = vkbeautify.xml (activeSequence.xml);
  // prevent "leaving" warning
  window.document.removeEventListener('beforeunload', preventUnload);
  saveFile (
    xml,
    filename,
    '.seq',
    {'name':'OpenAero Queue', 'filter':'*.seq'},
    'text/xhtml+xml;utf8'
  );
  if (!sequenceSaved) {
    // Prevent OpenAero from being left unintentionally
    window.document.addEventListener('beforeunload', preventUnload);
  }
  // restore sequence
  sequenceText.value = sequenceString;
  updateDefaultView();
  checkSequenceChanged();
}

// errorHandler will be called when there is a file error
function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

// saveAsURL provides a URL encoded sequence that the user can copy
// and then email, bookmark or whatever
function saveAsURL () {
  function save () {
    // also replace single ticks (') as they may break the link
    var url = 'http://openaero.net?s=' +
      encodeURI(activeSequence.xml).replace (/'/g, '%27');
    
    if (chromeApp.active) {
      alertBox ('<p>' + userText.saveAsURLFromApp +
        '</p><textarea id="saveAsURLArea"></textarea>',
        userText.saveAsURLTitle);
      var copyFrom = document.getElementById('saveAsURLArea');
      copyFrom.innerHTML = url;
      copyFrom.select();
    } else {
      alertBox (userText.saveAsURL + '<br />' +
        '<a href="' + url + '">' + url + '</a>', userText.saveAsURLTitle);
    }
  }
  
  missingInfoCheck(save);
}

// emailSequence creates an email with a complete sequence as a URL in
// the body and the set save name as subject
function emailSequence () {
  var el = document.getElementById('t_emailSequence');
  
  function email() {
    // create body with descriptive text, newlines and sequence URL
    // also replace single ticks (') as they may break the link
    var body = userText.emailHeader + '\n\n' + 
      'http://openaero.net?s=' + 
      encodeURI(activeSequence.xml).replace (/'/g, '%27');
    var subject =  activeFileName();
    if (subject === '') subject = 'Sequence';
    el.setAttribute('href', 'mailto:%20?subject=' + encodeURI(subject) +
      '&body=' + encodeURI(body));
    // click again to make sure this also gets triggerred after
    // missingInfoCheck dialog
    el.click();
  }
  
  el.setAttribute('href', '#');
  missingInfoCheck (email);
}

/********************************
 * Functions for handling storage
 */
 
// storeLocal uses localStorage to save data. If this is not supported
// it returns false
function storeLocal(name, value) {
  if (storage) {
    if (chromeApp.active) {
      var c = {};
      c[name] = value;
      chrome.storage.local.set (c);
    } else {
      localStorage.setItem (name, value);
    }
    return true;
  } else {
    return false;
  }
}

// getLocal gets a value from localStorage and returns it. If
// localStorage is not supported it returns false
// To also support chrome.storage (for apps) it works asynchronous.
// Function f is the callback to be called when the storage is loaded
function getLocal(name, f) {
  if (storage) {
    if (chromeApp.active) {
      chrome.storage.local.get (name, f);
    } else {
      var c = [];
      c[name] = localStorage.getItem (name);
      f (c);
    }
  } else {
    return false;
  }
}

/********************************
 * Functions for printing
 */

// parseAircraft will parse aircraft type or registration from Aircraft
// field
function parseAircraft (t) {
  var reg = '';
  var aircraft = document.getElementById('aircraft').value;
  for (var i = regexRegistration.length - 1; i >=0; i--) {
    var match = aircraft.match (regexRegistration[i]);
    if (match) {
      reg = match[0];
      break;
    }
  }
  if (t === 'registration') {
    return reg;
  } else {
    return aircraft.replace (reg, '');
  }
}

// printForms will print selected forms
function printForms () {
  buildForms (true);
}

// buildForms will format selected forms for print or save. When
// print=true, a print is created. Otherwise an SVG holding the forms is
// returned.
function buildForms (print) {
  // open the print window in time to prevent popup blocking
  if (print && !chromeApp.active) {
    var win = window.open ('',"printForms",'width=800,height=600,' +
      'top=50,location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
  }
  var pages = ['A', 'B', 'C', 'PilotCards', 'Grid'];
  iacForms = document.getElementById('iacForms').checked;
  var activeFormSave = activeForm;
  var svg = '';
  var translateY = 0;
  // save the miniFormA value and set miniFormA depending on checkbox
  var miniFormASave = (miniFormA)? true : false;
  var filename = activeFileName();
  if (filename === '') filename = 'sequence';

  // make sure no figure is selected
  selectFigure (false);
    
  // hide print dialog
  printDialog();

  if (print) {
    //if (chromeApp.active) {
      var body = document.createElement('body');
    //} else {
    //}
  }

  for (var i = 0; i < pages.length; i++) {
    if (document.getElementById('printForm' + pages[i]).checked) {
      activeForm = pages[i];
      if ((activeForm == 'B') && document.getElementById('printMiniFormAonB').checked) {
        miniFormA = true;
      } else if ((activeForm == 'C') && document.getElementById('printMiniFormAonC').checked) {
        miniFormA = true;
      } else {
        miniFormA = false;
      }
      // set correct drawing Form for pilot cards
      if (activeForm == 'PilotCards') {
        activeForm = (document.getElementById('pilotCardFormB').checked)? 'B' : 'C';
      }
      draw ();
      // reset activeForm for buildForm
      activeForm = pages[i];
      divClass = (i < (pages.length - 1))? 'breakAfter' : '';
      
      var formSVG = buildForm (SVGRoot, print);
      
      if (print) {
        var div = document.createElement('div');
        div.setAttribute ('class', divClass);
        div.innerHTML = formSVG;
        body.appendChild (div);
      } else {
        // remove newlines from SVG to simplify regex matching
        formSVG = formSVG.replace (/[\n\r]/g, '');
        // remove end tag from all SVGs
        formSVG = formSVG.replace (/<\/svg>$/, '');
        if (svg === '') {
          // use first SVG start tag and adjust width
          svg = formSVG.replace (/(<svg[^>]*width=")([^"]*)/, '$1' +
            document.getElementById ('imageWidth').value);
        } else {
          // remove subsequent SVGs start tags
          formSVG = formSVG.replace (/^.*?<svg[^>]*>/, '');
          // remove xml declarations
          formSVG = formSVG.replace (/<\?xml[^>]*>/, '');
          // add translated group with formSVG
          svg += '<g transform="translate (0,' + translateY + ')">' +
            formSVG + '</g>';
        }
        translateY += 1130 + parseInt(document.getElementById ('pageSpacing').value);
      }
    }
  }
  if (print) {
    // Print the constructed pages. For the App an asynchronous callback
    // is used. For the web version we work synchronous but use
    // setTimeout to prevent browser blocking.
    if (chromeApp.active) {
      chrome.app.window.create ('print.html', {
        bounds: {
          width: 800,
          height: 600
        }
      }, function(w) {
        var win = w.contentWindow;
        win.onLoad = function() {
          win.document.title = activeFileName();
          win.document.body = body;
          console.log(win.document.head);
          win.print();
          win.close();
        };
      });
    } else {
      win.document.body = body;
      win.document.title = activeFileName();
      var style = document.createElement ('style');
      style.type = 'text/css';
      style.media = 'print';
      style.innerHTML = 'body {margin: 0px;}' +
      '.breakAfter {display:block; page-break-after:always;}' +
      'svg {height: 100%; page-break-inside:avoid;}';
      win.document.head.appendChild(style);

      // use setTimeout for printing to prevent blocking and
      // associated warnings by the browser
      setTimeout (function(){win.print(); win.close();}, 200);
    }
  } else {
    svg += '</svg>';
    // Update viewBox
    // Add some margin to make sure bold lines etc are correctly shown
    svg = svg.replace (/viewBox="[^"]*"/, 'viewBox="-5 -5 810 ' +
      (translateY - parseInt(document.getElementById ('pageSpacing').value) + 10) + '"');
    // replace first width and height. These should be for complete SVG
    svg = svg.replace (/width="[^"]*"/, 'width="' +
      document.getElementById ('imageWidth').value + 'px"');
    svg = svg.replace (/height="[^"]*"/, 'height="' +
      document.getElementById ('imageHeight').value + 'px"');      
  }

  // Reset the screen to the normal view
  activeForm = activeFormSave;
  miniFormA = (miniFormASave)? true : false;

  draw ();
  
  return svg;
}

// adjustRollFontSize will adjust the rollFontSize to compensate for
// scaling in buildForm
function adjustRollFontSize (scale, svg) {
  var baseRollFontSize = rollFontSize;
  if (svg) {
    SVGRoot = svg;
  } else {
    svg = SVGRoot;
  }
  // increase rollFontSize for significant downscaling, and redraw
  if (parseInt (rollFontSize / scale) > rollFontSize) {
    changeRollFontSize (parseInt (rollFontSize / scale));
    draw();
    changeRollFontSize (baseRollFontSize);
  }
  return SVGRoot;
}
    
// buildForm will build a complete SVG string for printing a form
// from a provided SVG object and activeForm global.
// The default size of the page is A4, 800x1130
function buildForm (svg, print) {
  if (svg.getElementsByClassName) {
    var el = svg.getElementsByClassName('figStartCircle');
  } else {
    // needed for old browsers that don't support getElementsByClassName
    var el = svg.querySelectorAll('figStartCircle');
  }

  // remove all elements that have className figStartCircle from the svg.
  // Otherwise they may show up as big black circles
  var count = el.length;
  for (var i = 0; i < count; i++) el[0].parentNode.removeChild(el[0]);

  var bBox = svg.getBBox();
  
  var mySVG = svg;
  
  // don't change any layout for Grid or pilotCards view
  if ((activeForm !== 'Grid') && (activeForm !== 'PilotCards')) {
    // Find the size and adjust scaling if necessary, upscaling to a
    // maximum factor of 2.
    // The sequence max width=800, height=1000 (Form A) or 950 (Form B & C)
    w = parseInt(bBox.width);
    h = parseInt(bBox.height + 20); // add some margin to the bottom
    
    if (activeForm === 'A') {
      var maxHeight = 1000;
    } else {
      var maxHeight = 950;
      if (document.getElementById('printCheck').checked) {
        maxHeight -= 12;
      }
    }
    
    if (iacForms) {
      // IAC forms
      var moveRight = 15;
      // check maximum scale from print dialog
      var maxScale = document.getElementById ('maxScaling').value / 100;
        
      // For form A we need to add the righthand scoring column, so
      // max width = 580
      if (activeForm === 'A') {
        var scale = 580 / w;
        var marginTop = 130;
      } else {
        var scale = 700 / w;
        var marginTop = 120;
      }
      if (scale > maxScale) scale = maxScale;
      // check for max height
      if ((maxHeight / h) < scale) {
        scale = maxHeight / h;
        if (scale > maxScale) scale = maxScale;
        // height limited, so we can move the sequence right for centering
        moveRight = ((700 - (w * scale)) / 2) + 15;
        if (moveRight < 15) moveRight = 15;
      } else if (scale > maxScale) {
        scale = maxScale;
      }
      
      // Check if roll font size should be enlarged because of downscaling.
      // Do this before adding wind and box around sequence as sequence
      // may be redrawn!
      mySVG = adjustRollFontSize (scale, mySVG);
      
      // remove wind arrow
      var el = mySVG.getElementById('windArrow');
      if (el) el.parentNode.removeChild(el);
      
      if (activeForm === 'A') {
        // check if the columns should be stretched
        var maxStretch = 1.2;
        moveRight = 0;
        var xScale = scale;
        if ((xScale * w) < 580) {
          xScale = 580 / w;
          if (xScale > maxStretch) {
            xScale = maxStretch;
          }
        }
  
        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
          ') scale(' + xScale + ',' + scale + ')');
        mySVG.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');
      } else {
        // Insert box containing sequence
        drawRectangle (0, 126, 740, 945, 'formLine', mySVG);

        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
          ') scale(' + scale + ')');
      }
      
      // rebuild wind arrow in the correct place
      if (activeForm === 'B') {
        drawWind (740, 110, 1, mySVG);
      } else if (activeForm === 'C') {
        drawWind (0, 110, -1, mySVG);
      }
    
      //mySVG.setAttribute("viewBox", '0 0 800 1130');
      //mySVG.setAttribute("width", '100%');
      // Add all necessary elements
      if (logoImg) {
        if (activeForm === 'A') {
          var logoSvg = buildLogoSvg(logoImg, 610, 930, 110, 110);
        } else {
          var logoSvg = buildLogoSvg(logoImg, 0, 10, 80, 100);
        }        
        mySVG.appendChild(logoSvg);
      }
      buildHeader (mySVG);
      if (activeForm === 'A') {
        buildScoreColumn (mySVG);
        buildCornertab (mySVG);
      }
    } else {
      // CIVA forms
      var moveRight = 10;

      // set maximum scale from print dialog
      var maxScale = document.getElementById ('maxScaling').value / 100;
      
      // take the tear-off tab into account with no miniFormA
      // (defined by X + Y = 1620)
      if (!miniFormA) {
        if ((1620 / (w+h)) < maxScale) maxScale = 1620 / (w+h);
      }

      // For form A we need to add the righthand scoring column, so
      // max width = 620. For Form B and C max width = 790 to always
      // provide 10px left margin to sequence.
      if (activeForm === 'A') {
        var scale = 600 / w;
        var marginTop = 130;
      } else {
        var scale = 790 / w;
        var marginTop = 140;
      }
      if (scale > maxScale) scale = maxScale;
      // check for max height
      if ((maxHeight / h) < scale) {
        scale = maxHeight / h;
        if (scale > maxScale) scale = maxScale;
        // height limited, so we can move the sequence right for centering
        // limit this on tear-off tab
        moveRight = 1620 - ((w + h) * scale);
        if (moveRight < 0) moveRight = 0;
      } else if (scale > maxScale) {
        scale = maxScale;
      }
      
      mySVG = adjustRollFontSize (scale, mySVG);

      if (activeForm === 'A') {
        // check if the columns should be stretched
        var maxStretch = 1.2;
        moveRight = 0;
        var xScale = scale;
        if ((xScale * w) < 620) {
          xScale = 620 / w;
          if (xScale > maxStretch) {
            xScale = maxStretch;
          }
        }
        mySVG.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');
  
        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
          ') scale(' + xScale + ',' + scale + ')');
      } else {
        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
          ') scale(' + scale + ')');
      }
        
      // Add all necessary elements
      var logoWidth = 0;
      if (logoImg) {
        var logoSvg = buildLogoSvg(logoImg, 0, 0, 200, 120);
        mySVG.appendChild(logoSvg);
        logoWidth = parseInt(logoSvg.getBBox().width) + 10;
      }
      var header = document.createElementNS(svgNS, 'g');
      buildHeader (header, logoWidth);
      mySVG.appendChild(header);
      
      if (activeForm === 'A') buildScoreColumn (mySVG);
      buildCornertab (mySVG);
    }
    
    if ((activeForm === 'B') || (activeForm === 'C')) {
      // add sequence string when checked.
      if (document.getElementById('printString').checked) {
        var txt = sanitizeSpaces(activeSequence.text);
        // When printing a PDF, we prefer textarea as this improves
        // copy/paste 
        // When saving as image, we can not use textarea as this will
        // cause errors in conversion
        if (print) {
          // replace spaces by &nbsp; to make sure copy/paste works
          // correctly
          drawTextArea (txt.replace (/ /g, '&nbsp;'), 10, 1085,
            600, 40, 'sequenceString', '', mySVG);
        } else {
          var g = document.createElementNS (svgNS, 'g');
          drawText(txt, 0, 0, 'sequenceString', '', 'start', g);
          mySVG.appendChild(g);
  
          var scaleBox = '';
  
          var box = g.getBBox();
          if (box.width > 600) {
            g.removeChild(g.firstChild);
            // medium to long text
            // split on last possible space, might create three lines
            var words = txt.split (' ');
            var lines = [''];
            var maxChar = parseInt(txt.length * (600 / box.width));
            for (var i = 0; i < words.length; i++) {
              if ((lines[lines.length-1].length + words[i].length) < maxChar) {
                lines[lines.length-1] += words[i] + ' ';
              } else {
                lines.push(words[i] + ' ');
              }
            }
  
            if (lines.length > 3) {
              // very long text
              // Split in three equal lines
              drawText(txt.substring (0,parseInt(txt.length / 3)),
                0, 0, 'sequenceString', '', 'start', g);
              drawText(txt.substring (parseInt(txt.length / 3),
                parseInt((txt.length / 3) * 2)),
                0, 13, 'sequenceString', '', 'start', g);
              drawText(txt.substring (parseInt((txt.length / 3) * 2)),
                0, 26, 'sequenceString', '', 'start', g);
            } else {
              for (var i = 0; i < lines.length; i++) {
                drawText(lines[i], 0, i * 13, 'sequenceString', '', 'start', g);
              }
            }
            //  adjust X scale if necessary
            box = g.getBBox();
            var scaleX = 600 / box.width;
            if (scaleX < 1) {
              scaleBox = ' scale (' + scaleX + ',1)';
            }
          }
          g.setAttribute ('transform', 'translate (' + (10 - box.x) +
            ',' + (1128 - (box.y + box.height)) + ')' + scaleBox);
        }
      }

      
      // add check result when checked
      if (document.getElementById('printCheck').checked) {
        checkRules();
        var d = new Date();
        var text = userText.sequenceTest +
          d.getDate() + '-' +
          parseInt(d.getMonth() + 1) + '-' +
          d.getFullYear() + ' ' +
          d.getHours() + ':' +
          d.getMinutes() + ' ' +
          'OpenAero ' + version + ' ' +
          rulesActive + ' ';
        if (!alertMsgs.length) {
          drawText(text + userText.sequenceCorrect, 10, 1082,
            'sequenceString', '', 'start', mySVG);
        } else {
          var y = 1082;
          for (var i = alertMsgs.length - 1; i>=0; i--) {
            drawText (alertMsgs[i], 10, y,
              'sequenceString', '', 'start', mySVG);
            y -= 12;
          }
          drawText (text + userText.sequenceHasErrors, 10, y,
            'sequenceString', '', 'start', mySVG);
        }
        alertMsgs = [];
      }

    }
    mySVG.setAttribute("viewBox", '0 0 800 1130');
    mySVG.setAttribute("width", '100%');
  }
  
  // 1 to 4 pilot cards on a sheet
  if (activeForm === 'PilotCards') {
    var el = document.getElementsByClassName('pilotCardLayout active')[0];
    var rotate = false;
    switch (el.id) {
      case 'pilotCard2':
        var copies = 2;
        rotate = true;
        var width = 565;
        var height = 800;
        break;
      case 'pilotCard4':
        var copies = 4;
        var width = 400;
        var height = 565;
        break;
      default:
        var copies = 1;
        var width = document.getElementById('pilotCardPercentValue').value * 8;
        var height = document.getElementById('pilotCardPercentValue').value * 11.3;
    }
    if (copies !== 1) {
      // add 10% margin
      var w = parseInt(bBox.width) * 1.1;
      var x = parseInt(bBox.x) - bBox.width * 0.05;
      var h = parseInt(bBox.height) * 1.1;
      var y = parseInt(bBox.y) - bBox.height * 0.05;
    } else {
      var w = parseInt(bBox.width);
      var x = parseInt(bBox.x);
      var h = parseInt(bBox.height);
      var y = parseInt(bBox.y);  
    }
      
    // find correct scale
    var scale = roundTwo(width / w);
    if ((height / h) < scale ) scale = roundTwo(height / h);

    // make copies and translate / rotate / scale
    var seq1 = mySVG.getElementById('sequence');

    if (rotate) {
      // use matrix transform to rotate, scale and translate
      seq1.setAttribute ('transform', 'matrix(0,' + scale + ',' +
        (-scale) + ',0,' + (scale * (h + y) + (height - h * scale) / 2) + ',' +
        (-scale * x + ((width - w * scale) / 2)) + ')');

    } else {
      seq1.setAttribute('transform', 'translate(' +
      roundTwo(-x * scale) + ',' + roundTwo(-y * scale) +
      ') scale(' + scale + ')');
    }

    if (copies === 4) {
      var seq2 = seq1.cloneNode(true);
      seq2.setAttribute('id', 'seq2');
      seq2.setAttribute('transform', 'translate(' +
            roundTwo((-x * scale) + width) + ',' + roundTwo(-y * scale) +
            ') scale(' + scale + ')');
      mySVG.appendChild(seq2);
    }
    
    if (copies !== 1) {
      var seq3 = seq1.cloneNode(true);
      seq3.setAttribute('id', 'seq3');
      if (rotate) {
      // use matrix transform to rotate, scale and translate
      seq3.setAttribute ('transform', 'matrix(0,' + scale + ',' +
        (-scale) + ',0,' + (scale * (h + y) + (height - h * scale) / 2) + ',' +
        (-scale * x + width + ((width - w * scale) / 2)) + ')');
      } else {
        seq3.setAttribute('transform', 'translate(' +
        roundTwo(-x * scale) + ',' + roundTwo(-y * scale + height) +
        ') scale(' + scale + ')');
      }
      mySVG.appendChild(seq3);
    }
    
    if (copies === 4) {
      var seq4 = seq1.cloneNode(true);
      seq4.setAttribute('id', 'seq4');
      seq4.setAttribute('transform', 'translate(' +
            roundTwo((-x * scale) + width) + ',' + roundTwo(-y * scale + height) +
            ') scale(' + scale + ')');
      mySVG.appendChild(seq4);
    }
    mySVG.setAttribute ('viewBox', '0 0 800 1130');
    mySVG.setAttribute("width", '100%');
  }

  if (activeForm === 'Grid') {
    mySVG.setAttribute("width", '100%');
    mySVG.setAttribute("height", '100%');
  }
  
  // Add the notes to the top when checked. This will result in a
  // "vertical flattening" of the entire form
  if (document.getElementById('printNotes').checked) {
    // rebuild entire svg in group
    var g = document.createElementNS (svgNS, 'g');
    while (mySVG.childNodes.length > 0) {
      var node = mySVG.firstChild;
      mySVG.removeChild (node);
      g.appendChild (node);
    }
    // temporarily attach text to SVG root
    var t = mySVG.appendChild(document.createElementNS(svgNS, 'text'));
    t.setAttribute('style', style.printNotes);
    var dy = style.printNotes.match (/font-size[ ]*:[ ]*([\d]+)/)[1];
    var lines = document.getElementById('notes').value.replace(/\r/g, '').split ('\n');
    for (var i = 0; i < lines.length; i++) {
      t.appendChild (tspan(lines[i], dy));
    }
    var box = t.getBBox();
    var vScale = (1130 - box.height) / 1130;
    t.setAttribute ('transform', 'translate(' + (-box.x) + ',' +
      (-box.y) + ')');
    g.setAttribute ('transform', 'translate (0,' + box.height +
      ') scale (1,' + vScale + ')');
    mySVG.appendChild (g);
  }
  
  // Insert rectangle (=background) at the beginning
  var path = document.createElementNS (svgNS, "rect");
  path.setAttribute('x', '-5');
  path.setAttribute('y', '0');
  path.setAttribute('width', '810');
  path.setAttribute('height', '1130');
  path.setAttribute('style',style.formBackground);
  mySVG.insertBefore(path, mySVG.firstChild);

  svg = mySVG;

  // For some reason serializeToString may convert the xlink:href to
  // a0:href or just href for the logo image
  // So we change it back right away because otherwise the logo isn't displayed
  var sequenceSVG = new XMLSerializer().serializeToString(svg).replace (/ [^ ]*href/g, ' xlink:href');
  sequenceSVG = '<?xml version="1.0" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
    '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + sequenceSVG;
    
  // create Black & White (sequence drawing only) forms when checked
  if (document.getElementById('blackWhite').checked) {
    // replace style neg by negBW
    var regex = RegExp('"' + style.neg + '"', 'g');
    sequenceSVG = sequenceSVG.replace (regex, '"' + style.negBW + '"');
    // replace style negfill by negfillBW
    var regex = RegExp('"' + style.negfill + '"', 'g');
    sequenceSVG = sequenceSVG.replace (regex, '"' + style.negfillBW + '"');
    // replace remaining red by black
    sequenceSVG = sequenceSVG.replace(/\bred;/g, 'black;');
  }
  
  // create inverse forms when checked
  if (document.getElementById('inverseForms').checked) {
    // build sequence white-on-black
    sequenceSVG = sequenceSVG.replace(/\bwhite;/g, 'BLACK;');
    sequenceSVG = sequenceSVG.replace(/\bblack;/g, 'white;');
    sequenceSVG = sequenceSVG.replace(/\bBLACK;/g, 'black;');
    // change red to lighter red
    sequenceSVG = sequenceSVG.replace(/\bred;/g, '#ff6040;');
    
    // fatten lines
    sequenceSVG = sequenceSVG.replace(/stroke-width:\s*2px;/g, 'stroke-width: 4px;');
    sequenceSVG = sequenceSVG.replace(/stroke-width:\s*1\.5px;/g, 'stroke-width: 3px;');
    sequenceSVG = sequenceSVG.replace(/stroke-width:\s*1px;/g, 'stroke-width: 2px;');
  }

  return sequenceSVG;
}

// buildHeader will append the sequence header
function buildHeader (svg, logoWidth) {
  if (!iacForms) {
    drawRectangle (logoWidth, 0, 720 - logoWidth, 65, 'formLine', svg);
    drawText (document.getElementById('location').value + ' ' +
      document.getElementById('date').value, 425, 33, 'formATextLarge', 'middle', '', svg);
    drawRectangle (720, 0, 80, 65, 'formLine', svg);
    drawText ('Form ' + activeForm, 760, 33, 'formATextLarge', 'middle', '', svg);
    drawRectangle (logoWidth, 65, 80, 65, 'formLine', svg);
    drawText ('Pilot ID', logoWidth + 5, 75, 'miniFormA', 'start', '', svg);
    drawRectangle (logoWidth + 80, 65, 640 - logoWidth, 65, 'formLine', svg);
    drawText (
      ((document.getElementById('class').value == 'glider')? 'Glider ' : '') +
      document.getElementById('category').value + ' Programme ' +
      document.getElementById('program').value,
      475, 105, 'formATextLarge', 'middle', '', svg);
    drawRectangle (720, 65, 80, 65, 'formLine', svg);
    drawText ('Flight #', 725, 75, 'miniFormA', 'start', '', svg);
  } else {
    if (activeForm === 'A') {
      drawRectangle (0, 0, 60, 130, 'formLine', svg);
      drawRectangle (60, 0, 740, 50, 'formLine', svg);
      drawRectangle (60, 50, 240, 80, 'formLine', svg);
      drawRectangle (300, 50, 100, 80, 'formLine', svg);
      drawRectangle (400, 50, 120, 80, 'formLine', svg);
      drawRectangle (520, 50, 120, 80, 'formLine', svg);
      drawRectangle (640, 50, 70, 80, 'formLine', svg);
      drawRectangle (710, 50, 90, 80, 'formLineBold', svg);
      drawText (activeForm, 30, 75, 'formATextHuge', 'middle', '', svg);
      drawText ('INTERNATIONAL AEROBATIC CLUB SCORESHEET', 430, 35, 'formATextLarge', 'middle', '', svg);
      drawText (userText.contest + ':', 65, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('location').value, 180, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.date + ':', 305, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('date').value, 350, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.category + ':', 405, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('category').value, 460, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.programme + ':', 525, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('program').value, 580, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.pilotnumberIAC1, 645, 70, 'formAText', 'start', '', svg);
      drawText (userText.pilotnumberIAC2, 645, 95, 'formAText', 'start', '', svg);
    } else {
      // sequence info box
      drawRectangle (90, 10, 550, 100, 'formLine', svg);
      drawRectangle (570, 60, 70, 50, 'formLineBold', svg);
      drawLine (90, 60, 550, 0, 'formLine', svg); // ---
      drawLine (140, 10, 0, 50, 'formLine', svg); // |
      drawLine (490, 10, 0, 100, 'formLine', svg);// ||
      drawLine (290, 60, 0, 50, 'formLine', svg); // |
      drawText (activeForm, 115, 48, 'formATextHuge', 'middle', '', svg);
      drawText (userText.contest + ':', 150, 25, 'formAText', 'start', '', svg);
      drawText (document.getElementById('location').value, 315, 47, 'formATextLarge', 'middle', '', svg);
      drawText (userText.category + ':', 500, 25, 'formAText', 'start', '', svg);
      drawText (document.getElementById('category').value, 565, 47, 'formATextLarge', 'middle', '', svg);
      drawText (userText.date + ':', 100, 75, 'formAText', 'start', '', svg);
      drawText (document.getElementById('date').value, 190, 97, 'formATextLarge', 'middle', '', svg);
      drawText (userText.program + ':', 300, 75, 'formAText', 'start', '', svg);
      drawText (document.getElementById('program').value, 390, 97, 'formATextLarge', 'middle', '', svg);
      drawText (userText.pilotNo, 530, 90, 'formAText', 'middle', '', svg);
      
      // tear-off tab
      drawLine (640, 0, 160, 160, 'formLine', svg);
      drawLine (650, 0, 150, 150, 'dotted', svg);
      drawText (userText.pilot + ': ' + document.getElementById('pilot').value, 670, 10, 'formAText', 'start', 'pilotText', svg);
      // rotate pilot text elements by 45 degr CW    
      var el = svg.getElementById('pilotText');
      el.setAttribute('transform', 'rotate(45 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
        
      // check line
      drawLine (800, 420, 0, 460, 'dotted', svg);
      drawText ('FREE PROGRAM CHECK BY:', 790, 1080, 'formAText', 'start', 'checkByText', svg);
      drawText ('(signature/date)', 790, 880, 'formAText', 'start', 'signText', svg);
      drawText ('A/C: ' + parseAircraft('registration'), 790, 380, 'formAText', 'start', 'acText', svg);
      // rotate text elements by 90 degr CCW    
      var el = svg.getElementById('checkByText');
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
      var el = svg.getElementById('signText');
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
      var el = svg.getElementById('acText');
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
    }
  }
}

// buildScoreColumn will append the righthand scoring column
function buildScoreColumn (svg) {
  if (iacForms) {
    drawRectangle (580, 130, 120, 50, 'formLine', svg);
    drawText ('Item', 650, 155, 'formAText', 'middle', '', svg);
    drawRectangle (700, 130, 40, 50, 'formLine', svg);
    drawText ('K', 720, 155, 'formAText', 'middle', '', svg);
    drawRectangle (740, 130, 60, 50, 'formLine', svg);
    drawText ('Score', 770, 155, 'formAText', 'middle', '', svg);

    drawRectangle (580, 180, 120, 50, 'formLine', svg);    
    drawText ('Presentation', 590, 205, 'formATextBold', 'start', '', svg);
    drawRectangle (700, 180, 40, 50, 'formLine', svg);
    drawText (document.getElementById('positioning').value, 720, 205, 'formATextLarge', 'middle', '', svg);
    drawRectangle (740, 180, 60, 50, 'formLineBold', svg);
    drawLine (740, 180, 0, 50, 'formLine', svg);
    
    drawText ('FIGURE TOTAL K =', 590, 270, 'formAText', 'start', '', svg);
    drawRectangle (740, 240, 60, 40, 'formLine', svg);
    drawText ('INC. PRESENTATION =', 590, 320, 'formAText', 'start', '', svg);
    drawRectangle (740, 290, 60, 40, 'formLine', svg);

    drawText (figureK, 770, 265, 'formATextLarge', 'middle', '', svg);
    var totalK = figureK;
    if (parseInt(document.getElementById('positioning').value)) {
      totalK += parseInt(document.getElementById('positioning').value);
    }
    
    drawText (totalK, 770, 315, 'formATextLarge', 'middle', '', svg);

    drawRectangle (590, 340, 210, 60, 'formLine', svg);
    drawText ('Aircraft type:', 600, 355, 'formAText', 'start', '', svg);
    drawText (parseAircraft('type'), 695, 380, 'formATextLarge', 'middle', '', svg);
    
    // "checked by" block
    drawRectangle (640, 430, 160, 280, 'formLine', svg);
    drawLine (695, 430, 0, 280, 'formLine', svg);
    drawLine (750, 430, 0, 280, 'formLine', svg);
    drawLine (750, 610, 50, 0, 'formLine', svg);
    drawText ('FREE PROGRAM CHECKED BY:', 630, 700, 'formAText', 'start', 'checkedBy1', svg);
    drawText ('Signature:', 655, 700, 'formAText', 'start', 'checkedBy2', svg);
    drawText ('Printed Name:', 710, 700, 'formAText', 'start', 'checkedBy3', svg);
    drawText ('IAC No:', 765, 700, 'formAText', 'start', 'checkedBy4', svg);
    drawText ('Date:', 765, 600, 'formAText', 'start', 'checkedBy5', svg);
    // rotate all text elements by 90 degr CCW
    for (var i = 1; i < 6; i++) {
      var el = svg.getElementById('checkedBy' + i);
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
    }
    
    // judge details
    var y= 740;
    drawRectangle (590, y, 210, 75, 'formLine', svg);
    drawLine (590, y+50, 210, 0, 'formLine', svg);
    drawText ('Judge', 595, y + 15, 'formAText', 'start', '', svg);
    drawText (
      'Name:',
      595,
      y + 15 + parseInt(style.formAText.match(/font-size[ ]*:[ ]*([0-9]+)px/)[1]),
      'formAText',
      'start',
      '',
      svg);
    drawText ('IAC #', 595, y + 67, 'formAText', 'start', '', svg);

    // assistant details
    var y= 830;
    drawRectangle (590, y, 210, 75, 'formLine', svg);
    drawLine (590, y+50, 210, 0, 'formLine', svg);
    drawText ('Assistant', 595, y + 15, 'formAText', 'start', '', svg);
    drawText (
      'Name:',
      595,
      y + 15 + parseInt(style.formAText.match(/font-size[ ]*:[ ]*([0-9]+)px/)[1]),
      'formAText',
      'start',
      '',
      svg);
    drawText ('IAC #', 595, y + 67, 'formAText', 'start', '', svg);


  } else {
    drawRectangle (620, 130, 60, 50, 'formLine', svg);
    drawText ('Item', 650, 155, 'formAText', 'middle', '', svg);
    drawRectangle (680, 130, 40, 50, 'formLine', svg);
    drawText ('K', 700, 155, 'formAText', 'middle', '', svg);
    drawRectangle (720, 130, 80, 50, 'formLine', svg);
    drawText ('Grade', 760, 155, 'formAText', 'middle', '', svg);
  
    // Positioning
    drawRectangle (620, 180, 60, 50, 'formLine', svg);
    drawText ('Pos.', 650, 205, 'formAText', 'middle', '', svg);
    drawRectangle (680, 180, 40, 50, 'formLine', svg);
    drawText (document.getElementById('positioning').value, 700, 205, 'formATextLarge', 'middle', '', svg);
    if (sportingClass.value != 'glider') drawRectangle (720, 180, 80, 50, 'formLineBold', svg);
    drawLine (760, 180, 0, 50, 'formLine', svg);
  
    // Harmony
    if (sportingClass.value === 'glider') {
      drawRectangle (620, 230, 60, 50, 'formLine', svg);
      drawText ('Harm.', 650, 255, 'formAText', 'middle', '', svg);
      drawRectangle (680, 230, 40, 50, 'formLine', svg);
      drawText (document.getElementById('harmony').value, 700, 255, 'formATextLarge', 'middle', '', svg);
      drawRectangle (720, 180, 80, 100, 'formLineBold', svg);
      drawLine (760, 230, 0, 50, 'formLine', svg);
      drawLine (720, 230, 80, 0, 'formLine', svg);
    }
    
    drawRectangle (620, 280, 90, 25, 'formLine', svg);
    drawText ('Fig K', 665, 295, 'formAText', 'middle', '', svg);
    drawRectangle (710, 280, 90, 25, 'formLine', svg);
    drawText ('Total K', 755, 295, 'formAText', 'middle', '', svg);
    drawRectangle (620, 305, 90, 50, 'formLine', svg);
    drawText (figureK, 665, 330, 'formATextLarge', 'middle', '', svg);
    drawRectangle (710, 305, 90, 50, 'formLine', svg);
    var totalK = figureK;
    if (parseInt(document.getElementById('positioning').value)) {
      totalK += parseInt(document.getElementById('positioning').value);
    }
    if (parseInt(document.getElementById('harmony').value)) {
      totalK += parseInt(document.getElementById('harmony').value);
    }

    drawText (totalK, 755, 330, 'formATextLarge', 'middle', '', svg);
    drawRectangle (620, 355, 180, 25, 'formLine', svg);
    drawText ('Penalties', 710, 370, 'formATextBold', 'middle', '', svg);
    var penalties = new Array (
      'Too Low',
      'Disqual Fig',
      'Too High',
      'Outs',
      'Interruptions',
      'Insertions',
      'Missed Slot',
      'Trg Violation',
      'Faulty Wing Rocks');
    var y = 380;
    drawRectangle (750, y, 50, penalties.length * 25, 'formLineBold', svg);
    for (var i = 0; i<penalties.length; i++) {
      drawRectangle (620, y, 180, 25, 'formLine', svg);
      drawText (penalties[i], 628, y + 18, 'formAText', 'start', '', svg);
      y += 25;
    }
  
    drawRectangle (620, y, 180, 25, 'formLine', svg);
    drawText ('Final Freestyle', 710, y + 15, 'formATextBold', 'middle', '', svg);
    drawRectangle (620, y+25, 80, 50, 'formLine', svg);
    drawText ('Duration', 660, y + 50, 'formAText', 'middle', '', svg);
    drawRectangle (700, y+25, 50, 50, 'formLine', svg);
    drawText ('Min', 725, y + 40, 'formAText', 'middle', '', svg);
    drawRectangle (750, y+25, 50, 50, 'formLine', svg);
    drawText ('Sec', 775, y + 40, 'formAText', 'middle', '', svg);
    drawRectangle (700, y+50, 100, 25, 'formLineBold', svg);
    
    // judge details
    drawRectangle (620, y+85, 180, 25, 'formLine', svg);
    drawText ('Judges Details', 710, y + 100, 'formATextBold', 'middle', '', svg);
    drawRectangle (620, y+110, 180, 160, 'formLineBold', svg);
    drawLine (620, y+170, 180, 0, 'formLine', svg);
    drawLine (620, y+220, 180, 0, 'formLine', svg);
    drawText ('Signature', 628, y + 128, 'formAText', 'start', '', svg);
    drawText ('Name', 628, y + 188, 'formAText', 'start', '', svg);
    drawText ('Number', 628, y + 238, 'formAText', 'start', '', svg);
  }
}

// buildCornertab will append the righthand corner cut-off tab
function buildCornertab (svg) {
  drawLine (620, 1130, 180, -180, 'formLine', svg);
  drawLine (680, 1120, 110, -110, 'dotted', svg);
  drawLine (730, 1120, 60, -60, 'dotted', svg);
  // Add pilot's name
  if (document.getElementById('pilot').value) {
    var newText = document.createElementNS (svgNS, "text");
    newText.setAttribute('style', style.formATextBold);
    newText.setAttribute('text-anchor', 'middle');
    newText.setAttribute('x', 730);        
    newText.setAttribute('y', 1060);
    newText.setAttribute('transform', 'rotate(-45 730 1060)');
    var textNode = document.createTextNode(document.getElementById('pilot').value);
    newText.appendChild(textNode);
    svg.appendChild (newText);
  }
  // Add pilot text
  var newText = document.createElementNS (svgNS, "text");
  newText.setAttribute('style', style.formAText);
  newText.setAttribute('text-anchor', 'middle');
  newText.setAttribute('x', 780);        
  newText.setAttribute('y', 1035);
  newText.setAttribute('transform', 'rotate(-45 780 1035)');
  var textNode = document.createTextNode(userText.pilot);
  newText.appendChild(textNode);
  svg.appendChild (newText);
  // Add aircraft info
  if (document.getElementById('aircraft').value) {
    var newText = document.createElementNS (svgNS, "text");
    newText.setAttribute('style', style.formATextBold);
    newText.setAttribute('text-anchor', 'middle');
    newText.setAttribute('x', 755);
    newText.setAttribute('y', 1085);
    newText.setAttribute('transform', 'rotate(-45 755 1085)');
    if (iacForms) {
      var textNode = document.createTextNode(parseAircraft('registration'));
    } else {
      var textNode = document.createTextNode(document.getElementById('aircraft').value);
    }
    newText.appendChild(textNode);
    svg.appendChild (newText);
  }
  // Add aircraft text
  var newText = document.createElementNS (svgNS, "text");
  newText.setAttribute('style', style.formAText);
  newText.setAttribute('text-anchor', 'middle');
  newText.setAttribute('x', 785);        
  newText.setAttribute('y', 1080);
  newText.setAttribute('transform', 'rotate(-45 785 1080)');
  var textNode = document.createTextNode(userText.ac);
  newText.appendChild(textNode);
  svg.appendChild (newText);
}

// activeFileName will return the current active file name, or create a
// default file name. The result is appended with 'append' when supplied
function activeFileName (append) {
  if (!append) append = '';
  if (!fileName.value) {
    var filename = document.getElementById('location').value+' ';
    if (document.getElementById('class').value == 'glider') {
      filename += 'Glider ';
    }
    filename += document.getElementById('category').value+' '+
      document.getElementById('program').value+' '+
      document.getElementById('pilot').value;
    filename = filename.replace(/\s\s+/g, ' ');
    filename = filename.replace(/^\s+|\s+$/g, '');
    fileName.value = filename;
  } else {
    filename = fileName.value;
  }
  filename += append;
  return filename;
}

// saveImageSizeAdjust will adjust the "Saving PNG or SVG" width or
// height, whichever is relevant
function saveImageSizeAdjust () {
  var pages = ['A', 'B', 'C', 'PilotCards', 'Grid'];
  var count = 0;
  for (var i = 0; i < pages.length; i++) {
    if (document.getElementById('printForm'+pages[i]).checked) {
      count++;
    }
  }
  // don't do anything if no pages marked
  if (count === 0) return;
  // calculate ratio (Y / X) in base units
  var ratio = ((count * 1130) +
    ((count - 1) * document.getElementById ('pageSpacing').value)) / 800;

  if (this.id === 'imageHeight') {
    document.getElementById ('imageWidth').value = parseInt (
      this.value / ratio);
  } else {
    document.getElementById ('imageHeight').value = parseInt (
      document.getElementById ('imageWidth').value * ratio);
  }
}
    
// saveSVG will save an SVG image as selected in print/save dialog
function saveSVG () {
  // put the svg in var data
  var data = buildForms();
  saveFile(
    data,
    activeFileName(),
    '.svg',
    {'name':'SVG file', 'filter':'*.svg'},
    'image/svg+xml;utf8');
  draw();
}

// savePNG will save a PNG image as selected in print/save dialog
function savePNG () {
  // put the svg in var data
  var data = buildForms();
  infoBox (userText.convertingToPng, userText.convertingTitle);
  // use setTimeout to prevent browser hang-up and warning, and to give
  // it time to rebuild the sequence first
  setTimeout(function(){
    // wrap conversion in try, in case it fails
    try {
      svgToPng (data, function(data){
        saveFile(
          data,
          activeFileName(),
          '.png',
          {'name':'PNG file', 'filter':'*.png'},
          'image/png;base64');
        infoBox ();
      });
    } catch (err) {
      console.log(err.stack);
      infoBox ();
      alertBox (
        sprintf(userText.convertingFailed, encodeURI(browserString + '\n' + err.stack)),
        userText.convertingTitle);
      return;
    }
  }, 500);
  draw();
}

// saveFigs will save all the figures in the sequence separately in a
// single zip file
function saveFigs () {
  var filename = activeFileName(' Form '+activeForm);
  // save selectedFigure.id
  var id = selectedFigure.id;
  // create new zip object
  var zip = new JSZip();
  // get image filename pattern
  var fPattern = document.getElementById('zipImageFilenamePattern').value;
  // get image width and height
  var width = document.getElementById('saveFigsSeparateWidth').value.replace(/[^0-9]/g, '') + 'px';
  var height = document.getElementById('saveFigsSeparateHeight').value.replace(/[^0-9]/g, '') + 'px';
  // go through the active form and get each figure from the edit figure
  // box
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].figNr) {
      selectedFigure.id = i;
      displaySelectedFigure();
      var svg = document.getElementById('selectedFigureSvg');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      // convert svg object to string
      svg = new XMLSerializer().serializeToString(document.getElementById('selectedFigureSvg'));
      // create correct image filename
      var fName = fPattern;
      fName = fName.replace (/%pilot/g, document.getElementById('pilot').value);
      fName = fName.replace (/%aircraft/g, document.getElementById('aircraft').value);
      fName = fName.replace (/%location/g, document.getElementById('location').value);
      fName = fName.replace (/%date/g, document.getElementById('date').value);
      fName = fName.replace (/%class/g, document.getElementById('class').value);
      fName = fName.replace (/%rules/g, document.getElementById('rules').value);
      fName = fName.replace (/%category/g, document.getElementById('category').value);
      fName = fName.replace (/%program/g, document.getElementById('program').value);
      fName = fName.replace (/%form/g, activeForm);
      fName = fName.replace (/%figure/g, figures[i].seqNr);
      if (document.getElementById('imageFormatPNG').checked) {
        zip.file(fName + '.png', svgToPng (svg), {base64: true});
      } else {
        // convert svg to standalone
        svg = '<?xml version="1.0" standalone="no"?>\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
        '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + svg;
        zip.file(fName + '.svg', svg);
      }
    }
  }
  var data = zip.generate();

  saveFile(
    data,
    filename,
    '.zip',
    {'name':'ZIP file', 'filter':'*.zip'},
    'application/zip;base64',
    true);
  selectedFigure.id = id;
  displaySelectedFigure();
}  

// svgToPng will convert an svg to a png image
// The png will be returned as base64
// If provided, function f will be executed when the canvas has loaded.
// Otherwise, the function will return with the data.
// Use the callback (with function f) when the SVG may include external
// or data: images to make sure these are loaded before toDataURL
function svgToPng (svg, f) {
  // remove anything before <svg tag
  svg = svg.replace (/^.*?<svg/, '<svg');
  // convert svg to canvas
  var canvas = document.createElement('canvas');
  document.lastChild.appendChild (canvas);
  canvg (canvas, svg);
  if (f) {
    setTimeout(function(){
      // Wait 500ms for canvas to render, then...
      // rasterize canvas to png data URL, without data URL info
      var data = canvas.toDataURL().replace(/^data:[^,]*,/, '');
      document.lastChild.removeChild (canvas);
      f(data);
    }, 500);
  } else {
    // rasterize canvas to png data URL, without data URL info
    var data = canvas.toDataURL().replace(/^data:[^,]*,/, '');
    document.lastChild.removeChild (canvas);
    return data;
  }
}

// savePDF will save Forms A,B and C as a single PDF
// NOT functional yet!
function savePDF () {
}

// inArray returns all the array keys in 'arr' that hold 'val' as an array
// Only works for numbered arrays!
function inArray(arr, val) {
  var result = [];
  var i = arr.indexOf (val);
  while (i >= 0) {
    result.push(i);
    i = arr.indexOf (val, i + 1);
  }
  if (result.length > 0) return result; else return false;
}

// buildIllegal builds the symbol for an illegal figure
function buildIllegal (i) {
// create space before the figure
  var paths = [];
  paths = buildShape ('FigSpace' , 2, paths);
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = Math.cos(angle) * lineElement * 6;
  var dy = - Math.sin(angle) * lineElement * 6;
  paths.push({'path':'l ' + dx + ',' + (dy - lineElement * 6) + ' m ' +
    -dx + ',' + -dy + ' l ' + dx + ',' + (dy + lineElement * 6), 'style':'illegalCross'});
  paths.push({'path':'l ' + dx + ',' + dy + ' l 0,' + (-lineElement * 6) +
    ' l ' + -dx + ',' + -dy + ' z', 'style':'illegalBox', 'dx':dx, 'dy':dy});
  // Create empty space after illegal figure symbol
  paths = buildShape ('FigSpace', 2, paths);
  figures[i].paths = paths;
}

// buildMoveTo builds the symbol for a moveto and moves the cursor
// scaling should not affect movement, so divide by scale
function buildMoveTo (dxdy, i) {
  var paths = [];
  if (activeForm === 'C') dxdy[0] = -dxdy[0];
  paths.push({'path':'l ' + roundTwo(dxdy[0] * (lineElement / scale)) +
    ',' + roundTwo(dxdy[1] * (lineElement / scale)),
    'style':'dotted',
    'dx':dxdy[0] * (lineElement / scale),
    'dy':dxdy[1] * (lineElement / scale)});
// Create space after the figure
  figures[i].paths = buildShape ('FigSpace' , 2, paths);
  figures[i].moveTo = dxdy;
}

// buildCurveTo builds the symbol for a curveto and moves the cursor
// scaling should not affect movement, so divide by scale
function buildCurveTo (dxdy, i) {
  var paths = [];
  if (activeForm === 'C') dxdy[0] = -dxdy[0];
  var angle = dirAttToAngle (Direction, Attitude);
  var dist = Math.sqrt(dxdy[0]*dxdy[0] + dxdy[1]*dxdy[1]);
  var dx = Math.cos(angle) * (lineElement / scale) * dist / 2;
  var dy = - Math.sin(angle) * (lineElement / scale) * dist / 2;
 
  paths.push({'path':'c ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ' +
    roundTwo(dxdy[0] * (lineElement / scale) - dx) + ',' +
    roundTwo(dxdy[1] * (lineElement / scale) - dy) + ' ' +
    roundTwo(dxdy[0] * (lineElement / scale)) + ',' +
    roundTwo(dxdy[1] * (lineElement / scale)),
    'style':'dotted',
    'dx':(dxdy[0] * (lineElement / scale)),
    'dy':(dxdy[1] * (lineElement / scale))});
// Create space after the figure
  figures[i].paths = buildShape ('FigSpace' , 2, paths);
  figures[i].curveTo = dxdy;
}

// buildMoveForward moves the cursor forward
function buildMoveForward (extent, i) {
  if (extent > 0) {
    figures[i].paths = buildShape ('FigSpace' , extent);
    figures[i].moveForward = extent;
  }
}

// buildMoveDown moves the cursor downward
function buildMoveDown (extent, i) {
  if (extent > 0) {
    figures[i].paths = buildShape ('VertSpace' , extent);
    figures[i].moveDown = extent;
  }
}

// buildFigure parses a complete figure as defined by the figNrs and
// figString and puts it in array figures. It also creates a figCheckLine
// for each figure that can be used for sequence validity checking
// figNrs         = Possible figures that matched pattern
// figString      = User defined string for figure
// seqNr          = Sequence figure number
// figStringIndex = index of figure (figures[figStringIndex])
function buildFigure (figNrs, figString, seqNr, figStringIndex) {
  var figNr = figNrs[0];
  var roll = [];
  var rollSums = [];
  var rollPatterns = [];
  // fill paths with any prebuilt paths when provided
  // (e.g. for autocorrect red circle)
  var paths = figures[figStringIndex].paths;
  var rollInfo = [];
  // lowKFlick is set when the K for flick should be low:
  // vertical down after hammerhead, tailslide or after roll element
  var lowKFlick = false;
  // entryAxis identifies the axis on which the figure starts
  var entryAxis = ((Direction == 0) || (Direction == 180))? 'X' : 'Y';
  // goFront is set to true for every new figure that starts to front
  if (((Direction == 90) && (Attitude == 0)) || ((Direction == 270) && (Attitude == 180))) {
    goFront = false;
  } else {
    goFront = true;
  }
  // In the first part we handle everything except (rolling) turns
  var bareFigBase = fig[figNr].base.replace(/[\+\-]+/g, '');

  if (!regexTurn.test(fig[figNr].base)) {
    // First we split the figstring in it's elements, the bareFigBase
    // is empty for rolls on horizontal.
    if (bareFigBase != '') {
      // prevent splitting on bareFigBase inside comments
      if (figString.match(/"/)) {
        var inComment = false;
        var l = bareFigBase.length;
        for (var i = 0; i <= (figString.length - l); i++) {
          if (!inComment && (figString.substring(i, i + l) === bareFigBase)) {
            var splitLR = [
              figString.substring(0, i),
              figString.substring(i + l)
            ];
            break;
          } else if (figString[i] === '"') {
            inComment = !inComment;
          }
        }
      } else {
        var splitLR = figString.split(bareFigBase);
      }
    } else {
      var splitLR = Array(figString);
    }
    // start with an empty set of rolls
    for (var i = 0; i < fig[figNr].rolls.length; i++) {
      rollPatterns[i] = '';
    }
    // Find the roll patterns
    regEx = /[\+<\~\^\>]+/g;
    rollPatterns[0] = splitLR[0].replace(regEx, '');
    if (splitLR.length > 1) {
      moreRolls = splitLR[1].replace(regEx, '').split(')');
      for (var i = 0; i < moreRolls.length; i++) {
        if (moreRolls[i].match(/\(/)) {
          rollPatterns[i + 1] = moreRolls[i].replace(/\(/g, '');
        } else {
          rollPatterns[fig[figNr].rolls.length - 1] = moreRolls[i];
        }
      }
    }
    
    // Parse the roll patterns and find out where to put rolls, snaps and spins
    // We need to do this before building the figure because it can affect our choice of figure
    for (var i = 0; i < rollPatterns.length; i++) {
      roll[i] = [];
      rollInfo[i] = {
        'gap':[0],
        'pattern':[],
        'flip':[],
        'flipNumber':[],
        'comment':[]
      };
      var rollPattern = rollPatterns[i];
      rollSums[i] = 0;
      rollSign = (activeForm === 'C')? -1 : 1;
      extent = 0;
      var subRoll = 0;
      var flipRoll = false;
      var flipNumber = false;
      var inComment = false;
      var comment = '';
      if (rollPattern != '') {
        for (j = 0; j < rollPattern.length; j++) {
          // check if we are not in a roll comment section
          if (!inComment) {
            switch (rollPattern.charAt(j)) {
              case (userpat.comment):
                // start of comment
                inComment = true;
                break;
              case (userpat.rollext):
                // Long line before or after roll, twice the length of
                // the same pattern in figures.js
                roll[i].push({'type':'line', 'extent':3, 'load':NegLoad});
                rollInfo[i].gap[subRoll] += 3;
                break;
              case (userpat.rollextshort):
                // Short line before or after roll, twice the length of
                // the same pattern in figures.js
                roll[i].push({'type':'line', 'extent':1, 'load':NegLoad});
                rollInfo[i].gap[subRoll]++;
                break;
              case (userpat.lineshorten):
                // Make line before or after roll shorter
                roll[i].push({'type':'line', 'extent':-1, 'load':NegLoad});
                rollInfo[i].gap[subRoll]--;
                break;
              case (userpat.opproll):
                // Switch roll direction
                rollSign = -rollSign;
                flipRoll = !flipRoll;
                break;
              case ('f'):
                // Add single snaps
                // When there was a roll before, add a line first
                if (extent > 0) {
                  roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
                }
                roll[i].push({
                  'type':'possnap',
                  'extent':rollSign * 360,
                  'pattern':'1f',
                  'flip':flipRoll,
                  'flipNumber':flipNumber,
                  'comment':comment});
                extent = 360;
                rollInfo[i].pattern[subRoll] = 'f';
                rollInfo[i].flip[subRoll] = flipRoll;
                rollInfo[i].flipNumber[subRoll] = flipNumber;
                rollInfo[i].comment[subRoll] = comment;
                flipNumber = false;
                comment = '';
                subRoll++;
                rollInfo[i].gap[subRoll] = 0;
                break;
              case ('s'):
                // Add single spins
                // When there was a roll before, add a line first
                if (extent > 0) {
                  roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
                }
                roll[i].push({
                  'type':'posspin',
                  'extent':rollSign * 360,
                  'pattern':'1s',
                  'flip':flipRoll,
                  'flipNumber':flipNumber,
                  'comment':comment});
                extent = 360;
                rollInfo[i].pattern[subRoll] = 's';
                rollInfo[i].flip[subRoll] = flipRoll;
                rollInfo[i].flipNumber[subRoll] = flipNumber;
                rollInfo[i].comment[subRoll] = comment;
                flipNumber = false;
                comment = '';
                subRoll++;
                rollInfo[i].gap[subRoll] = 0;
                break;
              case('i'):
                // Add single inverted snaps and spins
                // When there was a roll before, add a line first
                if (extent > 0) {
                  roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
                }
                if (rollPattern[j + 1].match (/[fs]/)) {
                  j++;
                  if (rollPattern[j] === 'f') {
                    roll[i].push({
                      'type':'negsnap',
                      'extent':rollSign * 360,
                      'pattern':'1if',
                      'flip':flipRoll,
                      'flipNumber':flipNumber,
                      'comment':comment});
                    rollInfo[i].pattern[subRoll] = 'if';
                  } else {
                    roll[i].push({
                      'type':'negspin',
                      'extent':rollSign * 360,
                      'pattern':'1is',
                      'flip':flipRoll,
                      'flipNumber':flipNumber,
                      'comment':comment});
                    rollInfo[i].pattern[subRoll] = 'is';
                  }
                  extent = 360;
                  rollInfo[i].flip[subRoll] = flipRoll;
                  rollInfo[i].flipNumber[subRoll] = flipNumber;
                  rollInfo[i].comment[subRoll] = comment;
                  flipNumber = false;
                  comment = '';
                  subRoll++;
                  rollInfo[i].gap[subRoll] = 0;
                }
                break;
              // Handle all different kinds of rolls and their notation
              default:
                if (parseInt(rollPattern[j])) {
                  var startJ = j;
                  stops = 0;
                  // When there was a roll before, add a line first
                  if (extent > 0) {
                    var regex = /[fs]/;
                    if (regex.test(rollPattern)) {                 
                      roll[i].push({'type':'line', 'extent':2, 'load':NegLoad})
                    } else {
                      roll[i].push({'type':'line', 'extent':1, 'load':NegLoad})
                    }
                  }
  
                  if (rollPattern.charAt(j + 1).match(/[0-9]/)) { // use charAt to prevent end-of-string error
                    // special case: more than 8x8 roll
                    if (rollPattern.charAt(j + 2).match(/[1-9]/)) { // use charAt to prevent end-of-string error
                      stops = parseInt(rollPattern[j + 2]);
                      extent = parseInt(rollPattern.substring(j, j+2)) * (360 / stops);
                      j++;
                    } else {
                      if (rollPattern[j + 1] != '0') {
                        stops = parseInt(rollPattern[j + 1]);
                        extent = parseInt(rollPattern[j]) * (360 / stops);
                      }
                    }
                    j++;
                  } else if (rollPattern[j] == '1') {
                    extent = 360;
                  } else if (rollPattern[j] == '4') {
                    extent = 90;
                  } else if (rollPattern[j] == '8') {
                    stops = 8;
                    extent = 90;
                  } else if (rollPattern[j] == '9') {
                    extent = 720;
                  } else {
                    extent = 90 * parseInt(rollPattern[j]);
                  }
                  var illegalSnapSpin = false;
                  switch (rollPattern[j + 1]) {
                    case ('i'):
                      if (rollPattern[j + 2] === 'f') {
                        j += 2;
                        if (!stops) {
                          roll[i].push({
                            'type':'negsnap',
                            'extent':rollSign * extent,
                            'pattern':rollPattern.substring(startJ, j + 1),
                            'flip':flipRoll,
                            'flipNumber':flipNumber,
                            'comment':comment});
                        } else {
                          illegalSnapSpin = rollPattern.substring(j - 1, j + 1);
                        }
                      } else if (rollPattern[j + 2] === 's') {
                        j += 2;
                        if (!stops) {
                          roll[i].push({
                          'type':'negspin',
                          'extent':rollSign * extent, 
                          'pattern':rollPattern.substring(startJ, j + 1),
                          'flip':flipRoll,
                          'flipNumber':flipNumber,
                          'comment':comment});
                        } else {
                          illegalSnapSpin = rollPattern.substring(j - 1, j + 1);
                        }
                      } 
                      break;
                    case ('f'):
                      j++;
                      if (!stops) {
                        roll[i].push({
                          'type':'possnap',
                          'extent':rollSign * extent,
                          'pattern':rollPattern.substring(startJ, j + 1),
                          'flip':flipRoll, 
                          'flipNumber':flipNumber,
                          'comment':comment});
                      } else {
                        illegalSnapSpin = rollPattern.substring(j, j + 1);
                      }
                      break;
                    case ('s'):
                      j++;
                      if (!stops) {
                        roll[i].push({
                          'type':'posspin',
                          'extent':rollSign * extent, 
                          'pattern':rollPattern.substring(startJ, j + 1),
                          'flip':flipRoll,
                          'flipNumber':flipNumber,
                          'comment':comment});
                      } else {
                        illegalSnapSpin = rollPattern.substring(j, j + 1);
                      }
                      break;
                    default:
                      roll[i].push({
                        'type':'roll',
                        'extent':rollSign * extent,
                        'stops':stops,
                        'pattern':rollPattern.substring(startJ, j + 1),
                        'flip':flipRoll,
                        'flipNumber':flipNumber,
                        'comment':comment});
                  }
                  if (illegalSnapSpin) {
                    alertMsgs.push ('Fig ' + seqNr + ':' +
                      rollPattern.substring(startJ, j + 1) +
                      userText.illegalFig +
                      rollPattern.substring(startJ, startJ + 1) +
                      illegalSnapSpin);
                    extent = 0;
                  }
                  rollSums[i] += rollSign * extent;
                  if (extent != 0) {
                    rollInfo[i].pattern[subRoll] = rollPattern.substring(startJ, j + 1);
                    rollInfo[i].flip[subRoll] = flipRoll;
                    rollInfo[i].flipNumber[subRoll] = flipNumber;
                    rollInfo[i].comment[subRoll] = comment;
                    subRoll++;
                    rollInfo[i].gap[subRoll] = 0;
                  }
                  flipNumber = false;
                  comment = '';
                } else if (rollPattern[j] === '0') {
                  // Glider Slow roll
                  var startJ = j;
                  // When there was a roll before, add a line first
                  if (extent > 0) {
                    roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
                    extent = 0;
                  }
                  j++;
                  switch (rollPattern[j]) {
                    case '2':
                      extent = 180;
                      break;
                    case '1':
                      extent = 360;
                      break;
                    case '6':
                      extent = 540;
                      break;
                  }
                  rollSums[i] += rollSign * extent;
                  if (extent != 0) {
                    rollInfo[i].pattern[subRoll] = rollPattern.substring(startJ, j+1);
                    rollInfo[i].flip[subRoll] = flipRoll;
                    rollInfo[i].flipNumber[subRoll] = flipNumber;
                    rollInfo[i].comment[subRoll] = comment;
                    subRoll++;
                    rollInfo[i].gap[subRoll] = 0;
                    roll[i].push({
                      'type':'slowroll',
                      'extent':rollSign * extent,
                      'stops':0,
                      'pattern':rollPattern.substring(startJ, j+1),
                      'flip':flipRoll,
                      'flipNumber':flipNumber,
                      'comment':comment});
                    j++;
                  }
                  flipNumber = false;
                  comment = '';
                }
            }
          } else {
            // in comment, end it or add character to comment
            if (rollPattern[j] === userpat.comment) {
              inComment = false;
            } else {
              // flip roll number if pattern present at comment start
              if ((comment === '') && (rollPattern[j] === userpat.flipNumber)) {
                flipNumber = true;
              }
              comment += rollPattern[j];
            }
          }
        }
      }
    }
    // Set the number of the first roll for drawing later on
    // To do this we check the fig.pattern for a roll match before the base
    var rollnr = (fig[figNr].pattern.match(/^[\+\-][_\^\&]/))? 0 : 1;

    // If there are multiple figNrs we check the rolls to see which one
    // matches best. It's very important that with different figures with
    // the same figure base the roll total is equal in the figures.js file
    if (figNrs.length > 1) {
      // Set rollCorrMin to infinity to start with so the
      // first correction will allways be smaller
      rollCorrMin = Infinity;
      for (var i = 0; i < figNrs.length; i++) {
        rollCorr = 0;
        for (var j = 0; j < roll.length; j++) {
          if ((fig[figNrs[i]].rolls[j] == 1) || (!fig[figNrs[i]].rolls[j])) {
            // full or no roll symbol at this position in fig[xx].rolls[yy]
            rollCorr = rollCorr + Math.abs((parseInt(rollSums[j] / 360) - (rollSums[j] / 360)) * 360);
          } else if (fig[figNrs[i]].rolls[j] == 2) {
            // half roll symbol at this position in fig[xx].rolls[yy]
            rollCorr = rollCorr + Math.abs((parseInt((rollSums[j] + 180) / 360) - ((rollSums[j] + 180) / 360)) * 360);
          } 
        }
        if (rollCorr < rollCorrMin) {
          rollCorrMin = rollCorr;
          figNr = figNrs[i];
          var rollnr = (fig[figNr].pattern.match(/^[\+\-][_\^\&]/))? 0 : 1;
        }
      }
      var figureDraw = fig[figNr].draw;
    } else var figureDraw = fig[figNrs[0]].draw;
  } else var figureDraw = fig[figNrs[0]].draw;
  // The chosen figure is now final, so we can:
  // assign Aresti Nr and K Factor to the figure
  // fix the figNr in the figures object
  var arestiNrs = new Array(fig[figNr].aresti);
  if ((sportingClass.value === 'glider') && (fig[figNr].kglider)) {
    var kFactors = new Array(fig[figNr].kglider);
  } else {
    var kFactors = new Array(fig[figNr].kpwrd);
  }
  figures[figStringIndex].figNr = figNr;
  figCheckLine[seqNr] = fig[figNr].aresti;
  // If we are not in Form A we check for entry and exit extension
  // and shortening and apply them
  var entryExt = 0;
  var exitExt = 0;
  if (activeForm != 'A') {
    // get position for the base (1) OR the roll(s) on a horizontal (2)
    if (bareFigBase != '') {
      var basePos = figString.indexOf(bareFigBase);
    } else {
      stringLoop:
      for (var i = 0; i < figString.length; i++) {
        switch (figString[i]) {
          case userpat.forward:
          case userpat.forwardshorten:
          case '-':
            break;
          default:
            basePos = i;
            break stringLoop;
        }
      }
    }
    for (var i = 0; i < figString.length; i++) {
      if (figString.charAt(i) == userpat.forward) {
        if (i < basePos) {
          figureDraw = figpat.forward + figureDraw;
          entryExt++;
        } else {
          figureDraw = figureDraw + figpat.forward;
          exitExt++;
        }
      } else if (figString.charAt(i) == userpat.forwardshorten) {
        if (i < basePos) {
          figureDraw = userpat.forwardshorten + figureDraw;
          entryExt--;
        } else {
          figureDraw = figureDraw + userpat.forwardshorten;
          exitExt--;
        }
      }
    }
  }

  // Now we go through the drawing instructions
  var lineLength = 0;
  var lineSum = 0;
  var lineDraw = false;
  var rollTop = false;
  var comment = false;
  
  // Build the start of figure symbol
  paths = buildShape('FigStart',
    {
      'seqNr':seqNr,
      'first':firstFigure
    },
    paths);
  for (var i = 0; i < figureDraw.length; i++) {
    // set correct load
    if ((figureDraw[i] == figpat.longforward) || (figureDraw[i] == figpat.forward)) {
      if ((Attitude != 90) && (Attitude != 270)) {
        NegLoad = ((Attitude > 90) && (Attitude < 270))? 1 : 0;
      }
    }
    // Sum continuous lines in the figure
    switch (figureDraw.charAt(i)) {
      // Make long lines
      case (figpat.longforward):
        lineSum += 4;
        lineDraw = true;
        break;
      case (userpat.rollext):
        lineSum += 3;
        lineDraw = true;
        break;
      // Make short lines
      case (figpat.forward):
      case (userpat.rollextshort):
        lineSum++;
        lineDraw = true;
        break;
        // shorten entry and exit lines
      case (userpat.forwardshorten):
        lineSum--;
        break;
        // When a roll is encountered, continue there for line
        // lengthening and/or shortening
      case (figpat.fullroll):
        break;
        // When something else than a roll or line is encountered, build
        // the line. Do not make any existing line shorter than 1
      case ('-'):
        // just skip any negative entry/exit
        break;
      default:
      if (lineDraw) {
        if (lineSum > 0) {
          lineLength += lineSum;
          paths = buildShape('Line', Array(lineSum, NegLoad), paths);
        } else {
          lineLength++;
          paths = buildShape('Line', Array(1, NegLoad), paths);
        }
        lineDraw = false;
      }
      lineSum = 0;
    }
    // Take care of everything but lines
    switch (figureDraw.charAt(i)) {
      // Make hammerheads
      case (figpat.hammer):
      case (figpat.pushhammer):
        paths = buildShape('Hammer', lineLength, paths);
        // down line after hammer always positive
        NegLoad = false;
        lowKFlick = true;
        break;
      // Make tailslides
      case (figpat.tailslidecanopy):
      case (figpat.tailslidewheels):
        paths = buildShape('Tailslide', figureDraw.charAt(i), paths);
        lowKFlick = true;
        break;
      case (figpat.pointTip):
      case (figpat.pushPointTip):
        paths = buildShape('PointTip', lineLength, paths);
        break;
      // Make rolls, including any line lenghthening and/or shortening
      case (figpat.fullroll):
        // Make a space on the figCheckLine before every possible roll
        figCheckLine[seqNr] = figCheckLine[seqNr] + ' ';
        if (roll[rollnr]) {
          var rollPaths = [];
          rollSum = 0;
          rollDone = false;
          attChanged = 0;
          for (j = 0; j < roll[rollnr].length; j++) {
            // Build line elements after all extensions and shortenings have been processed
            if (roll[rollnr][j].type != 'line') {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale, 0), rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength += lineSum;
                    rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths);
                  } else {
                    lineLength++;
                    rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths);
                  }
                }
                lineDraw = false;
              }
              lineSum = 0;
            } 

            /***** handle rolls and lines *****/
            
            // Find which roll in figures.js matches. There should only
            // be one. Then add Aresti nr and K factor
            var rollAtt = rollAttitudes[Attitude];
            // Find the correct snap/load combination
            // Snaps started knife edge are judged as
            // 'pos from neg'/'neg from pos' with foot-down entry
            if ((roll[rollnr][j].type == 'possnap') || (roll[rollnr][j].type == 'negsnap')) {
              if (((Attitude == 90) || (Attitude == 270)) && lowKFlick) {
                // Handle snaps on verticals where lowKFlick is set
                if (roll[rollnr][j].type == 'possnap') {
                  rollAtt = '+' + rollAtt;
                } else {
                  rollAtt = '-' + rollAtt;
                }
              } else if (((rollSum / 180) == parseInt(rollSum / 180)) || (Attitude == 90) || (Attitude == 270)) {
                // Handle snaps on verticals and from non-knife-edge
                rollAtt = (NegLoad == 0)? '+' + rollAtt : '-' + rollAtt;
              } else {                
                // Handle snaps from knife edge. Use rollSum to find the
                // previous amount of roll. Use switches to determine
                // correct virtual load/attitude combination
                var inv = ((Attitude > 90) && (Attitude < 270));
                inv = (inv == (((Math.abs(rollSum) - 90) / 360) == parseInt((Math.abs(rollSum) - 90) / 360)));
                inv = (inv == ((rollSum * roll[rollnr][j].extent) > 0));
                if (inv) {
                  // Foot up for pos start, foot down for neg start
                  rollAtt = '+' + rollAtt;
                } else {
                  // Foot down for pos start, foot up for neg start
                  rollAtt = '-' + rollAtt;
                }
              }
            }
            // set lowKFlick to true after anything but a line
            if (roll[rollnr][j].type !== 'line') {
              lowKFlick = true;
            }
            var rollI = rollBase.indexOf(rollAtt + roll[rollnr][j].pattern);
            if (rollI >= 0) {
              arestiNrs.push (rollAresti[rollI]);
              if ((sportingClass.value == 'glider') && (rollKGlider[rollI])) {
                kFactors.push (rollKGlider[rollI]);
              } else {
                kFactors.push (rollKPwrd[rollI]);
              }
              // Check if there was a roll before the current one and
              // add ; or , as appropriate for checking
              var k = j - 1;
              while (k > -1) {      
                if (roll[rollnr][k].type != 'line') {
                  if ((roll[rollnr][j].extent / roll[rollnr][k].extent) > 0) {
                    figCheckLine[seqNr] += ';';
                  } else {
                    figCheckLine[seqNr] += ',';
                  }
                  break;
                }
                k--;
              }
              figCheckLine[seqNr] += rollAresti[rollI];
            } else {
              // disable non-Aresti rolls
              if (!document.getElementById('nonArestiRolls').checked) {
                if (roll[rollnr][j].type != 'line') {
                  roll[rollnr][j] = {'type': 'line', 'extent': 0};
                }
              }
            }

            /** add the roll drawings to rollPaths */
            switch (roll[rollnr][j].type) {
              // Sum line elements
              case ('line'):
                lineSum += roll[rollnr][j]['extent'];
                // don't set lineDraw to true for shortenings. This will
                // prevent drawing a line of minimum length 1 when no
                // line was present in the figure drawing instructions
                if (roll[rollnr][j].extent > 0) lineDraw = true;
                break;
              // Build roll elements
              case ('roll'):
                rollPaths = buildShape('Roll', Array(
                  roll[rollnr][j].extent,
                  roll[rollnr][j].stops,
                  rollTop,
                  false,
                  false,
                  roll[rollnr][j].comment), rollPaths);
                lineLength += Math.abs(parseInt((roll[rollnr][j].extent - 1) / 360)) * (10 / lineElement);
                break;
              case ('slowroll'):
                rollPaths = buildShape('Roll', Array(
                  roll[rollnr][j].extent,
                  roll[rollnr][j].stops,
                  rollTop,
                  true,
                  false,
                  roll[rollnr][j].comment), rollPaths);
                lineLength += Math.abs(parseInt((roll[rollnr][j].extent - 1) / 360)) * (10 / lineElement);
                break;
              case ('possnap'):
                rollPaths = buildShape('Snap', Array(
                  roll[rollnr][j].extent,
                  0,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case ('negsnap'):
                rollPaths = buildShape('Snap', Array(
                  roll[rollnr][j].extent,
                  1,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case ('posspin'):
                rollPaths = buildShape('Spin', Array(
                  roll[rollnr][j].extent,
                  0,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (spinElement / lineElement);
                break;
              case ('negspin'):
                rollPaths = buildShape('Spin', Array(
                  roll[rollnr][j].extent,
                  1,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (spinElement / lineElement);
            }
            
            /** update attitude and direction after roll */
            if (roll[rollnr][j].type != 'line') {
              rollSum += roll[rollnr][j].extent;
              rollDone = true;
              // Half rolls and all rolls in the vertical change
              // direction and possibly attitude
              if ((parseInt((rollSum + 180) / 360) - ((rollSum + 180) / 360)) == 0) {
                Attitude = 180 - Attitude;
                if (Attitude < 0) Attitude += 360;
                if (activeForm == 'C') {
                  changeDir (-Math.abs(rollSum));
                } else {
                  changeDir(Math.abs(rollSum));
                }
                rollSum = 0;
                attChanged = 180 - attChanged;
                // correct load for half rolls in top of loop
                if (rollTop) NegLoad = 1 - NegLoad;
              }
              // check correct load after rolls that are not vertical or
              // in top of loop
              if ((Attitude != 90) && (Attitude != 270) && (!rollTop)) {
                NegLoad = (((Attitude > 90) && (Attitude < 270)))? 1 : 0;
              }
            }
          }
          // completed all rolls of this roll position
          // set lowKFlick to false for next roll position
          lowKFlick = false;
      
          rollSum = rollSums[rollnr];
          // See if we have to autocorrect the rolls
          if (fig[figNr].rolls[rollnr] == 1) {
            autoCorr = (parseInt(rollSum / 360) - (rollSum / 360)) * 360;
            // When a line is standing by to be built, build it before
            // doing the autocorrect
            if (autoCorr != 0) {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale, 0), rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength += lineSum;
                    rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths);
                  } else {
                    lineLength++;
                    rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths);
                  }
                }
                lineSum = 0;
                lineDraw = false;
              }
              // Also build a line if a roll was done before
              if (rollDone) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale, 0), rollPaths);
                } else {
                  rollPaths = buildShape('Line', Array(2, NegLoad), rollPaths);
                  lineLength += 2;
                }
              }
            }
            if (attChanged == 180) {
              Attitude = 180 - Attitude;
              if (Attitude < 0) Attitude += 360;
              changeDir(180);
            }
          } else if (fig[figNr].rolls[rollnr] == 2) {
            autoCorr = (parseInt((rollSum + 180) / 360) - ((rollSum + 180) / 360)) * 360;
            // When a line is standing by to be built, build it before
            // doing the autocorrect
            if (autoCorr != 0) {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale), rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength += lineSum;
                    rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths);
                  } else {
                    lineLength++;
                    rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths);
                  }
                }
                lineSum = 0;
                lineDraw = false;
              }
              // Also build a line if a roll was done before
              if (rollDone) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale, 0), rollPaths);
                } else {
                  rollPaths = buildShape('Line', Array(2, NegLoad), rollPaths);
                  lineLength += 2;
                }
              }
            }
            // Half rolls change direction, attitude and load
            if (attChanged == 0) {
              Attitude = 180 - Attitude;
              if (Attitude < 0) Attitude += 360;
              changeDir(180);
            }
          } else {
            autoCorr = 0;
          }
          // Add autocorrect roll
          if (autoCorr != 0) {
            rollPaths = buildShape('Roll', Array(autoCorr, 0, false, false, true), rollPaths);
            // Find which roll in figures.js matches. There should only be one.
            // Then add Aresti nr and K factor
            var rollAtt = rollAttitudes[Attitude];
            switch (Math.abs(autoCorr)) {
              case (90):
                var rollI = rollBase.indexOf(rollAtt + '4');
                break;
              case (180):
                var rollI = rollBase.indexOf(rollAtt + '2');
                break;
              case (270):
                var rollI = rollBase.indexOf(rollAtt + '3');
                break;
              default:
                var rollI = -1;
            }
            if (rollI >= 0) {
              arestiNrs.push (rollAresti[rollI]);
              if ((sportingClass.value == 'glider') && (rollKGlider[rollI])) {
                kFactors.push (rollKGlider[rollI]);
              } else kFactors.push (rollKPwrd[rollI]);
            }
            alertMsgs.push ('Fig ' + seqNr + userText.autocorrectRoll);
          }
          // Add the second curve segment after a roll in the top
          // Invert the angle when it was a half roll
          // Move the pointer to where the roll should be. Start it offset
          // so it is centered on the top (especially for multiple rolls)
          if (rollTop) {
            if (fig[figNr].rolls[rollnr] == 2) {
              rollTopAngleAfter = -rollTopAngleAfter;
            }
            var topLineAngle = (rollTopAngleAfter > 0)? 45 : -45;
            paths = buildShape ('Curve', topLineAngle, paths);
            if (rollPaths.length) {
              // draw the second marker when there was a roll in the top
              paths = buildShape ('RollTopLine', '', paths);
            } else {
              // no roll, remove first marker
              paths[paths.length - 3].path = '';
            }
            paths = buildShape ('Curve', rollTopAngleAfter - topLineAngle, paths);
            // Retrieve the movement by the two curve paths
            dx = paths[paths.length - 1].dx + paths[paths.length - 3].dx;
            dy = paths[paths.length - 1].dy + paths[paths.length - 3].dy;
            dxRolls = 0;
            dyRolls = 0;
            // Retrieve the roll path movements
            for (var k = 0; k < rollPaths.length; k++) {
              if (rollPaths[k].dx) dxRolls += rollPaths[k].dx;
              if (rollPaths[k].dy) dyRolls += rollPaths[k].dy;
            }
/** fixme: would be nice to have rolls and snaps follow the curve of the
 *  loop. No consistent method found yet. */
            paths.push ({
              'path':'',
              'style':'',
              'dx':-dx-(dxRolls/2),
              'dy':-dy-(dyRolls/2)
            });
          }
          // Add all the roll paths
          for (var k = 0; k < rollPaths.length; k++) {
            paths.push(rollPaths[k]);
          }
          // Move back to the right place at the end of the curve after
          // a roll in the top
          if (rollTop) {
            paths.push ({
              'path':'',
              'style':'',
              'dx':dx - (dxRolls / 2),
              'dy':dy - (dyRolls / 2)
            });
          }
        }
      
        // See if the direction should be changed from default
        // This is only possible when there was a 1/4, 3/4 etc roll and
        // the attitude is vertical.
        // Only run one X and one Y switch per figure
        figString = checkQRollSwitch (
          figString,
          figStringIndex,
          fig[figNr].pattern,
          seqNr,
          rollSum,
          figureDraw,
          i,
          roll,
          rollnr);
      
        // The roll drawing has past, so make sure the rollTop variable
        // is set to false
        rollTop = false;
        rollnr++;
        break;
      // handle clovers (figures with fixed 1/4 roll up or down)
      case ('4'):
        paths = buildShape ('Roll', Array(90, 0), paths);
        figString = checkQRollSwitch (
          figString,
          figStringIndex,
          fig[figNr].pattern,
          seqNr,
          90,
          figureDraw,
          i,
          roll,
          rollnr);
        break;
      // (rolling) turns are handled here. We pass the turn part and any
      // direction changers of the draw string.
      // Other parsing is in the makeTurn function
      case ('j'):
      case ('J'):        
        // when this was an OLAN sequence, check for previous in-figure
        // X axis swap and autocorrect the exit of this figure for the
        // next round
        if (OLANSequence) OLANXSwitch(figStringIndex);

        if (regexChangeDir.test (figString)) {
          figures[figStringIndex].switchX = true;
          var prefix = (activeForm == 'C')? '' : userpat.moveforward;
        } else {
          figures[figStringIndex].switchX = false;
          var prefix = (activeForm == 'C')? userpat.moveforward : '';
        }
        paths = buildShape ('Turn', prefix +
          figureDraw.replace(/[^jioJIO\d]+/g, ''), paths);
        var regex = /[jioJIO\d]+/;
        while (regex.test(figureDraw.charAt(i))) i++;
        i--;
        break;
      // Handle angle and curve drawing. In here we will also decide the
      // goRight parameter that decides how we roll vertical
      default:
        if (figureDraw.charAt(i) in drawAngles) {
          var angle = parseInt(drawAngles[figureDraw.charAt(i)]);
          // Draw sharp angles for corners less than 180 unless
          // specifically told to make a curve by '=' symbol
          if ((Math.abs(angle) < 180) && (figureDraw.charAt(i + 1) != '=')) {
            paths = buildShape ('Corner', angle, paths);
          } else {
            // Draw curve. Half size when followed by '/' symbol
            if (figureDraw.charAt(i + 1) == '/') {
              curveRadius = curveRadius / 2;
            }
            // Check if the next roll should be in the top
            rollTop = (figureDraw[i + 1] == '!')? true : false;
            if ((Math.abs(angle) < 360) && !rollTop) {
              paths = buildShape ('Curve', angle, paths);
            } else if (rollTop) {
              // Split any loop with a roll in top so we can use the second
              // part later to determine the top
              // We do this by finding the point closest to the center of
              // looping shape that has Attitude 0 or 180
              attTop = Attitude + (angle / 2);
              diffTop = ((attTop / 180) - parseInt ((attTop + 90) / 180)) * 180;
              if (Math.abs(diffTop) > 90) {
                diffTop = ((attTop / 180) - parseInt ((attTop - 90) / 180)) * 180;
              }
              angleTop = (angle / 2) - diffTop;

              var topLineAngle = (angleTop > 0)? 45 : -45;
              paths = buildShape ('Curve', angleTop - topLineAngle, paths);
              paths = buildShape ('RollTopLine', '', paths);
              paths = buildShape ('Curve', topLineAngle, paths);
              var rollTopAngleAfter = angle - angleTop;
            } else {
              // Split full loops in two parts for drawing.
              paths = buildShape ('Curve', angle / 2, paths);
              paths = buildShape ('Curve', angle / 2, paths);
            }
            // if applicable, reset curveRadius when done
            if (figureDraw.charAt(i + 1) == '/') {
              curveRadius = curveRadius * 2;
            }
          }
          NegLoad = (angle < 0)? 1 : 0;
          // The lineLength may be necessary for e.g. hammerhead and is
          // set to 0 after any angle
          lineLength = 0;
          // unset lowKFlick after every curve
          lowKFlick = false;
        }
    }
  }
  // Draw any remaining line, we can leave the variables 'dirty' because
  // there is no more processing after this
  if (lineDraw) {
    if (lineSum > 0) {
      paths = buildShape('Line', Array(lineSum, NegLoad), paths);
    } else {
      paths = buildShape('Line', Array(1, NegLoad), paths);
    }
  }

  // Make the end of figure symbol
  paths = buildShape ('FigStop', '', paths);
  // Create empty space after each figure
  paths = buildShape ('FigSpace', 2, paths);

  // The figure is complete. Create the final figure object for later
  // processing such as drawing Forms and point & click figure editing
  figures[figStringIndex].paths = paths;
  figures[figStringIndex].aresti = arestiNrs;
  figures[figStringIndex].k = kFactors;
  figures[figStringIndex].seqNr = seqNr;
  figures[figStringIndex].rolls = roll;
  figures[figStringIndex].rollInfo = rollInfo;
  figures[figStringIndex].scale = Math.round((scale - 1) * 10);
  figures[figStringIndex].entryExt = entryExt;
  figures[figStringIndex].exitExt = exitExt;
  figures[figStringIndex].entryAxis = entryAxis;
  figures[figStringIndex].unknownFigureLetter = unknownFigureLetter;
  unknownFigureLetter = false;
  
  // Replace double spaces or a space at the end on the figCheckLine
  // with the fake Aresti code for no roll 0.0.0.0
  while (figCheckLine[seqNr].match(/(  )|( $)/)) {
    figCheckLine[seqNr] = figCheckLine[seqNr].replace('  ', ' 0.0.0.0 ');
    figCheckLine[seqNr] = figCheckLine[seqNr].replace(/ $/, ' 0.0.0.0');
  }
  
  // set inFigureXSwitchFig (used for OLAN sequence autocorrect) to false
  // when we exit on X axis
  if ((Direction == 0) || (Direction == 180)) {
    inFigureXSwitchFig = Infinity;
  }
}

// checkQRollSwitch checks for vertical 1/4 rolls and determines 
// roll direction.
// Only run one X and one Y switch per figure
function checkQRollSwitch (figString, figStringIndex, pattern, seqNr, rollSum, figureDraw, fdIndex, roll, rollnr) {
  if (((Attitude == 90) || (Attitude == 270)) && ((rollSum / 180) != parseInt(rollSum / 180))) {
    if (activeForm == 'C') {
      changeDir (-Math.abs(rollSum));
    } else {
      changeDir(Math.abs(rollSum));
    }
    // find the next angle. Usually this will occur before a new rolling
    // element EXCEPT for tailslides and hammerheads
    var nextAngle = 0;
    var nextRollExtent = 0;
    var nextRollExtentPrev = 0;
    var switchVert = false;
    var doubleBump = figString.match (/(pb|b)(pb|b)/);
    var firstRoll = (rollnr == 0)? true : false;
    for (var i = fdIndex + 1; i < figureDraw.length; i++) {
      if (figureDraw[i] in drawAngles) {
        // found an angle
        nextAngle = drawAngles[figureDraw[i]];
        // break the loop when the angle doesn't bring us back to vertical
        if ((nextAngle / 180) != parseInt (nextAngle / 180)) {
          break;
        }
      } else if (figureDraw[i] == figpat.fullroll) {
        // see if there are more rolls before any angle. This happens on
        // tailslides and hammers and influences the direction in which we
        // will have to turn to end up correct at the end of the figure
        rollnr++;
        nextRollExtentPrev = nextRollExtent;
        for (var j = 0; j < roll[rollnr].length; j++) {
          if (roll[rollnr][j]['type'] != 'line') {
            nextRollExtent += parseInt(roll[rollnr][j].extent);
          }
        }
        // when the next roll is a 1/4 roll there is no need to continue.
        // Special code for double bumps: HACK
        // This may need to be made more generic in the future
        // when one of the following rolls is a 1/4 we just care about
        // the direction of this roll. It should make the next curve go
        // in the correct direction.
        // We know this routine will be called again for the next roll
        if ((nextRollExtent / 180) != parseInt(nextRollExtent / 180)) {
          if (doubleBump && firstRoll) {
            if (rollnr == 2) {
              nextRollExtent = nextRollExtentPrev;
              break;
            }
            // see if there's a first part direction switcher (;> or ;^).
            // Remove when applied
            var regex = /;[>^](b|pb|ib|ipb)/;
            if (figString.match (regex)) {
              var switchDir = true;
              figString = figString.replace(regex, "$1");
              figures[figStringIndex].switchFirstRoll = true;
            } else {
              var switchDir = false;
              figures[figStringIndex].switchFirstRoll = false;
            }
            if ((Direction == 0) || (Direction == 180)) {
              if (((((Attitude == 90) == (Direction == 0)) == (nextAngle > 0)) == goRight) != switchDir) {
                changeDir(180);
              }
              goFront = !goFront;
              updateAxisDir = false;
            } else {
              if (((((Attitude == 90) == (Direction == 270)) == (nextAngle > 0)) == goFront) != switchDir) {
                changeDir(180);
              }
              if (updateAxisDir) goFront = !goFront; 
              updateAxisDir = false;
            }
            return figString;
          } else {
            // The exit direction will be based on this roll next time
            // checkQRollSwitch is called
            break;
          }
            
        } else {
          // we have continued to the next vertical roll, so the vertical
          // has switched
          switchVert = !switchVert;
        }

      } else if (figureDraw[i] == figpat.hammer) {
        // set a 'virtual' roll for the tailslides. HARDCODED
        nextRollExtent += 180;
      }
    }
    if ((Direction == 0) || (Direction == 180)) {
      // change roll direction depending on the X direction we want to
      // fly after the vertical
      // count angles greater than 180 as negative. e.g. Rev P-loop will
      // first go the 'wrong' way before ending the 'right' way
      if (Math.abs(nextAngle) > 180) nextAngle = -nextAngle;
      // multiple switches decide if we should go right or left
      // each switch toggles the decision
      if (((((Attitude == 90) == (Direction == 0)) == (nextAngle > 0)) == goRight) != switchVert) {
        changeDir(180);
      }
      // when this was an OLAN sequence, check for previous in-figure
      // X axis swap and autocorrect this figure for the next round
      if (OLANSequence) OLANXSwitch(figStringIndex);
      if (regexSwitchDirX.test (figString)) {
        changeDir (180);
        figures[figStringIndex].switchX = true;
        inFigureXSwitchFig = figStringIndex; // used for OLAN auto correct
        // Remove this direction changer from the figure string once
        // applied and no Q roll follows
        if (nextRollExtent == 0) {
          figString = figString.replace(regexSwitchDirX, '');
        }
      } else figures[figStringIndex].switchX = false;
      // check for the OLAN Humpty Bump direction bug
      if (OLANBumpBugCheck) {
        if (regexOLANBumpBug.test(pattern)) {
          OLANBumpBugFigs.push (seqNr);
          // autocorrect loaded OLAN sequence when applicable
          if (OLANSequence) {
            if (regexSwitchDirX.test (figString)) {
              figures[figStringIndex].string = figures[figStringIndex].string.replace(regexSwitchDirX, '');
            } else {
              figures[figStringIndex].string = figures[figStringIndex].string + userpat.switchDirX;
            }
          }
        }
      }
      // just changed from Y to X axis. Make the default direction for
      // a subsequent X to Y in the same figure go the other way. This
      // will keep e.g. 4b4 the same when starting on X or Y axis
      if (updateAxisDir) goFront = !goFront;
    } else {
      // count angles greater than 180 as negative. e.g. Rev P-loop will
      // first go the 'wrong' way before ending the 'right' way
      if (Math.abs(nextAngle) > 180) nextAngle = -nextAngle;
      // autocorrect loaded OLAN sequence when applicable
      if (OLANSequence && !goFront) {
        goFront = true;
        if (regexSwitchDirY.test (figString)) {
          figures[figStringIndex].string = figures[figStringIndex].string.replace(regexSwitchDirY, '');
        } else {
          figures[figStringIndex].string += userpat.switchDirY;
        }
      }
      if (((((Attitude == 90) == (Direction == 90)) == (nextAngle < 0)) == goFront) != switchVert) {
        changeDir(180);
      }      
      if (regexSwitchDirY.test (figString)) {
        changeDir(180);
        figures[figStringIndex].switchY = true;
        if (nextRollExtent == 0) {
          figString = figString.replace(regexSwitchDirY, '');
        }
      } else {
        figures[figStringIndex].switchY = false;
      }
      // check for the OLAN N direction bug
      if (OLANBumpBugCheck && figures[figStringIndex].switchX) {
        if (regexOLANNBug.test(pattern)) {
          OLANNBugFigs.push (seqNr);
        }
      }
    }
    if ((nextRollExtent / 180) == parseInt(nextRollExtent / 180)) {
      changeDir (-nextRollExtent);
    }
  }
  return figString;
}

// OLANXSwitch:
// when this was an OLAN sequence, check for previous in-figure
// X axis swap and autocorrect the exit of this figure for the
// next round
function OLANXSwitch (figStringIndex) {
  if (inFigureXSwitchFig < figStringIndex) {
    if (regexSwitchDirX.test (figures[figStringIndex].string)) {
      figures[figStringIndex].string = figures[figStringIndex].string.replace(regexSwitchDirX, '');
    } else {
      figures[figStringIndex].string += userpat.switchDirX;
    }
  }
}

// updateSequence updates the sequence character string.
// Figure 'figure' is placed after figure 'figNr' or over figNr' when
// 'replace' is true.
// Also some checks are done, including direction switcher checks.
// The function assumes the 'figure' starts on X axis. So when the previous
// figure ends on Y axis, direction changers are flipped.

// when force is true, update will be done even when it seems no change is made
function updateSequence (figNr, figure, replace, fromFigSel, force) {

  // correct direction changers when new figure is from Figure Selector
  if (fromFigSel) {
    if (replace) var prevFig = figNr - 1; else var prevFig = figNr;
    if (figures[prevFig] && figure.match(/[a-zA-Z]/)) {
      if (figures[prevFig].exitAxis == 'Y') {
        // switch > and ^. Use temporary placeholder #
        figure = figure.replace(/\^/g, '#').replace(/>/g, '^').replace(/#/g, '>');
      }
    }
  }
  
  // just return if asked to replace an identical figure
  if (replace && (figures[figNr].string == figure) && !force) return;
  
  var updateSelected = true;
  var string = '';
  var separator = (figure == '')? '' : ' ';
  for (var i = figures.length - 1; i >= 0; i--) {
    if (i == figNr) {
      if (!replace) {
        // Handle (multiple) moveto or curveto
        if (figure.match(regexMoveTo) || figure.match(regexCurveTo)) {
          var curve = true;
          var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
          var dx = parseInt(dxdy[0]);
          var dy = parseInt(dxdy[1]);
          // go back until we find a real figure
          while (!figures[i].seqNr) {
            // check for previous move, curve or movefoward
            if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
              // keep straight line when that was the previous way of moving
              if (figures[i].moveTo) curve = false;
              // sum dx and dy
              if (figures[i].moveForward) {
                dx += parseInt(figures[i].paths[0].dx * (scale / lineElement));
                dy += parseInt(figures[i].paths[0].dy * (scale / lineElement));
              } else {
                var dxdy = figures[i].string.replace(/[^0-9\,\-]/g, '').split(',');
                dx += parseInt(dxdy[0]);
                dy += parseInt(dxdy[1]);
              }
              // correcting the selected figure id is done here
              if ((selectedFigure.id !== null) && (i < figNr)) {
                // for every second and subsequent replace of move,
                // we reduce the selected figure id
                if (!updateSelected) selectedFigure.id--;
              }
              // don't update the selectedFigure.id later
              updateSelected = false;
            } else {
              // no move figure, add it to the start of the string and
              // continue looking
              string = figures[i].string + ' ' + string;
            }
            i--;
            // no move on figure 0, so stop there
            if (i == 0) break;
          }
          if (!updateSelected) {
            // only build the move when it is more than one unit
            if ((Math.abs(dx) + Math.abs(dy)) > 1) {
              if (curve) {
                figure = '(' + dx + ',' + dy + ')';
              } else {
                figure = '[' + dx + ',' + dy + ']';
              }
            } else {
              figure = '';
              selectedFigure.id--;
            }
          }
        }
      }
      
      // replace or add before
      if (figure !== '') {
        string = figure + separator + string;
      }
      if (!replace) {
        string = figures[i].string + ' ' + string;
      }
    } else {
      string = figures[i].string + ' ' + string;
    }
  }
  // with a negative figNr the fig is placed at the beginning
  if (figNr < 0) string = figure + separator + string;

  // check if the selected figure id has te be changed
  if ((selectedFigure.id !== null) && updateSelected) {
    if (selectedFigure.id > figNr) {
      if (replace) {
        if (figure == '') selectedFigure.id--;
      } else {
        selectedFigure.id++;
      }
    } else if (replace) {
      if ((figure === '') && (selectedFigure.id === figNr)) {
        selectFigure(false);
      }
    }
  }

  // remove last added space, update field
  sequenceText.value = string.replace (/ $/, '');

  // check for sequence changes
  checkSequenceChanged(force);
  
  // reselect correct figure
  if (selectedFigure.id !== null) selectFigure (selectedFigure.id, true);
}

// comparePreviousSequence returns the old and new figure numbers that
// are the last ones changed compared to the previous sequence, e.g.:
// "o b4 h3 q" to "o d b h3 q" would return [1,2]
// with no change, the return is [false, false]
function comparePreviousSequence () {
  if (activeSequence.previousFigures) {
    var m = activeSequence.previousFigures.length - 1;
    var n = activeSequence.figures.length - 1;
    while ((m >= 0) && (n >= 0)) {
      if (activeSequence.previousFigures[m].string === activeSequence.figures[n].string) {
        m--;
        n--;
      } else {
        return [m, n];
      }
    }
  }
  return [false, false];
}
   
// updateXYFlip changes all > to ^ and vv from figure 'n' (defined by
// comparePreviousSequence) to the end.
// But only on Free Unknown figures with matching Figure Letters. It is
// done only for these as otherwise unexpected effects when copy-pasting
// whole sequences may occur.
// When doing this, the Figure Letters will be identical by definition,
// as the sequence is checked identical as of 'n'.
function updateXYFlip(m, n) {
  var dmn = m - n;
  if (activeSequence.figures[n]) {
    var text = activeSequence.text.substring(0, activeSequence.figures[n].stringStart);
    for (var i = n; i < activeSequence.figures.length; i++) {
      var s = activeSequence.figures[i].string;
      // Only act on figures that previously had an unknownFigureLetter.
      // This will also prevent matching moves, such as "12>", ">", "^^"
      if (activeSequence.previousFigures[i + dmn].unknownFigureLetter) {
        // switch > and ^. Use temporary placeholder #
        s = s.replace(/[\^]/g, '#').replace(/\>/g, '^').replace(/#/g, '>');
      }
      activeSequence.figures[i].string = s;
      text += s + ' ';
    }
    // remove last space if this was not present in sequenceText
    if (sequenceText.value[sequenceText.value.length - 1] !== ' ') {
      sequenceText.value = text.replace(/ $/, '');
    }
  }
}


// parseSequence parses the sequence character string
function parseSequence () {
  // Clear the figCheckLine array
  figCheckLine = [];
  // Clear the figureStart array
  figureStart = [];
  var seqNr = 1;
  var subSequence = false;
  var comments = false;
  var figure = '';
  connectors = 0;
// Make sure the scale is set to 1 before parsing
  if (scale != 1) {
    curveRadius = curveRadius / scale;
    lineElement = lineElement / scale;
    scale = 1;
  }
  // See if there is a y-axis flip symbol and activate it, except when 
  // it matches the subSequence code which is similar (/ or //)
  if (activeSequence.text.replace(regexComments, '').match(regexFlipYAxis)) {
    setYAxisOffset (180 - yAxisOffset);
  }
  // Get the split string from activeSequence
  figures = activeSequence.figures;

  // Find out where the sequence changed
  var changePoints = comparePreviousSequence();
  
  for (var i = 0; i < figures.length; i++) {
    // make sure all paths are empty
    figures[i].paths = [];
    
    figure = figures[i].string;
    
    // always start figure LTR for Figures in grid view
    if (activeForm === 'Grid') {
      Direction = (Attitude == 0)? 0 : 180;
    }
    
    // simplify the string
    
    // replace `+ by forwardshorten for entry
    var shorten = figure.match (regexEntryShorten);
    if (shorten) {
      figure = figure.replace (regexEntryShorten, 
        new Array(shorten[0].length - shorten[1].length).join(userpat.forwardshorten) +
        shorten[1]);
    }
    
    // replace +` by forwardshorten for exit
    var shorten = figure.match (regexExitShorten);
    if (shorten) {
      figure = figure.replace (regexExitShorten, shorten[1] +
        new Array(shorten[0].length - shorten[1].length).join(userpat.forwardshorten));
    }
    
    // replace `- by forwardshorten for negative entry
    var shorten = figure.match (regexEntryShortenNeg);
    if (shorten) {
      figure = figure.replace (regexEntryShortenNeg, 
        new Array(shorten[0].length - shorten[1].length + 1).join(userpat.forwardshorten) +
        shorten[1]);
    }
    
    // replace -` by forwardshorten for negative exit
    var shorten = figure.match (regexExitShortenNeg);
    if (shorten) {
      figure = figure.replace (regexExitShortenNeg, shorten[1] +
        new Array(shorten[0].length - shorten[1].length + 1).join(userpat.forwardshorten));
    }

    // replace the second '-' and up (in row) by longforward (reverse for speed)
    // e.g. ---h- will be ++-h-
    // don't know a way to do this with regex...
    var multipleMinus = false;
    // if the figure is only - and extensions, e.g. --, disregard last minus
    var skipMinus = (figure.match(/^[-~`]*$/))? true : false;
    for (var j = figure.length - 1; j >= 0; j--) {
      if (figure[j] == '-') {
        if (multipleMinus) {
          figure = figure.substring(0, j) + userpat.longforward +
            figure.substring (j+1);
        } else if (skipMinus) {
          skipMinus = false;
        } else multipleMinus = true;
      } else multipleMinus = false;
    }
    
    // replace longforward by 3x forward
    // e.g. -++h- will be -~~~~~~h-
    figure = figure.replace (regexLongForward, userpat.forward+userpat.forward+userpat.forward);
    
    // Parse out the instructions that are for drawing B and C forms only
    if (figure.match(regexDrawInstr) ||
      (figure.replace(regexMoveForward, '').length == 0) ||
      (figure.replace(regexMoveDown, '').length == 0) ||
      (figure == userpat.subSequence)) {
      var onlyDraw = true;
      if (figure.charAt(0) == userpat.moveto) {
        // Move to new position
        var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
        if ((dxdy[0] >= 0 || dxdy[0] < 0) && (dxdy[1] >= 0 || dxdy[1] < 0)) {
          buildMoveTo (dxdy, i);
        }
      } else if (figure.charAt(0) == userpat.curveTo) {
        // Curve to new position
        var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
        if ((dxdy[0] >= 0 || dxdy[0] < 0) && (dxdy[1] >= 0 || dxdy[1] < 0)) {
          buildCurveTo (dxdy, i);
        }
      } else if (regexMoveForward.test(figure)) {
        // Move forward without connecting line
        var moveFwd = figure.match(regexMoveForward)[0];
        if (parseInt (moveFwd)) {
          buildMoveForward (parseInt(moveFwd) +
                            moveFwd.length -
                            moveFwd.match(/[0-9]*/)[0].length -
                            1, i);
        } else {
          buildMoveForward (moveFwd.length, i);
        }
      } else if (regexMoveDown.test(figure)) {
        // Move down without connecting line
        var moveDn = figure.match(regexMoveDown)[0];
        if (parseInt (moveDn)) {
          buildMoveDown (parseInt(moveDn) + moveDn.length - moveDn.match(/[0-9]*/).length - 1, i);
        } else {
          buildMoveDown (moveDn.length, i);
        }
      } else if (figure.charAt(figure.length - 1) == userpat.scale) {
        // Change scale
        if (scale != 1) {
          curveRadius = curveRadius / scale;
          lineElement = lineElement / scale;
        }
        scale = 1 + (parseInt (figure.replace(userpat.scale, '')) / 10);
        if (!scale) scale = 1;
        if (scale < 0.1) scale = 0.1;
        curveRadius = curveRadius * scale;
        lineElement = lineElement * scale;
        figures[i].scale = true;
//      } else if (figure.match (regexSequenceOptions)) {
      } else if (figure == userpat.subSequence) {
        // Start subsequence
        firstFigure = true;
        figures[i].subSequence = '//';
        subSequence = '//';
        if (Attitude == 180) {
          Attitude = 0;
          changeDir(180);
        }
      } else if (regexTextBlock.test(figure)) {
        // add text block
        figures[i].paths = buildShape ('TextBlock', figure.replace(RegExp(userpat.comment, 'g'), ''), []); 
        figures[i].unknownFigureLetter = unknownFigureLetter;
        // set comments, to be applied to the next real figure
        comments = figure.replace(RegExp(userpat.comment, 'g'), '');
        // remove unknownFigureLetter from comments when applicable
        comments = comments.replace(/^@[A-L]/, '');
      }
    } else {
      // remove any comments inside the figure
      var base = figure.replace(/"[^"]*"/g, '');
      // To determine the base we remove all non-alphabet characters (except -)
      base = base.replace(/[^a-zA-Z\-]+/g, '');
      // Replace any x> format to move forward by x times >
      if (regexMoveForward.test(figure)) {
        var moveFwd = fig.match(regexMoveForward)[0];
        if (parseInt (moveFwd)) {
          figure = figure.replace(regexMoveForward, parseInt(moveFwd) + moveFwd.length - moveFwd.match(/[0-9]*/).length - 1);
        } else {
          figure = figure.replace(regexMoveForward, moveFwd.length);
        }
      }
      // Handle the very special case where there's only an upright (1)
      // or inverted (2) spin
      if (base.replace(/-/g, '') == 's') {
        figure = figure.replace(/(\d*)s/, "iv$1s");
        base = base.replace('s', 'iv');
      } else if (base.replace(/-/g, '') == 'is') {
        figure = figure.replace(/(\d*)is/, "iv$1is");
        base = base.replace('is', 'iv');
      }
      // To continue determining the base we remove if, is, f, s
      base = base.replace(/if|is|f|s/g, '');
      // Handle simple horizontal rolls that change from upright to inverted or vv
      if (base == '-') {
        if (figure.replace(/[^a-zA-Z0-9\-\+]+/g, '').charAt(0) == '-') {
          base += '+';
        } else {
          base = '+' + base;
        }
        // Handle everything else
      } else if ((base != '') || figure.match(/^[^\[\(]*[0-9fs]/)) {
        // begin the base with a '+' if there is no '-'
        if (base.charAt(0) != '-') base = '+' + base;
        // end the base with a '+' if there is no '-'
        if (base.charAt(base.length - 1) != '-') base += '+';
      }
      // set subSequence to true for subsequence 'figures'
      if (base.match(/^\+e(j|ja|d|u)\+$/) && !firstFigure) {
        subSequence = true;
      }
      // Autocorrect the entry attitude for figures after the first
      // (sub)figure where necessary
      if (!(firstFigure || subSequence)) {
        // Start upright
        if (Attitude == 0) {
          if (base[0] == '-') {
            Attitude = 180;
            changeDir(180);
            // don't show warning in Grid view
            if (activeForm !== 'Grid') {
              alertMsgs.push ('Fig ' + seqNr + userText.setUpright);
              // draw circle around figure start
              figures[i].paths = [{'path': 'm -' + (rollcurveRadius * 1.2) +
                ',0 a' + (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
                ' 0 1 1 0,0.01', 'style':'corr'}];
            }
          }
        // Start inverted
        } else if (Attitude == 180) {
          if (base[0] == '+') {
            Attitude = 0;
            changeDir(180);
            // don't show warning in Grid view
            if (activeForm !== 'Grid') {
              alertMsgs.push ('Fig ' + seqNr + userText.setInverted);
              // draw circle around figure start
              figures[i].paths = [{'path': 'm -' + (rollcurveRadius * 1.2) +
                ',0 a' + (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
                ' 0 1 1 0,0.01', 'style':'corr'}];
            }
          }
        }
      }
      // Handle turns and rolling turns. They do have numbers in the base
      if (base.match(/^.j[^w]/)) {
        base = figure.replace(/[^a-zA-Z0-9\-\+]+/g, '');
        if (base.charAt(0) != '-') base = '+' + base;
        if (base.charAt(base.length - 1) != '-') base = base + '+';
      }
      // Retrieve the figNrs (if any) from array figBaseLookup
      figNrs = figBaseLookup[base];
      if (figNrs) {
        // When the first figure starts negative we make sure the
        // Attitude is inverted and the DRAWING direction stays the same
        if ((firstFigure || subSequence) && (base.charAt(0) == '-')) {
          Attitude = 180;
          changeDir(-180);
        }
        // switch default goRight for every figure that starts on X axis
        if ((Direction == 0) || (Direction == 180)) {
          goRight = ((Direction == 180) == (Attitude == 0));
        }
        // build the figure into the figures object
        buildFigure (figNrs, figure, seqNr, i);
        // check if this is a connector
        if (regexConnector.test(figure)) {
          connectors++;
          figures[i].connector = true;
        } else if (figures[i].unknownFigureLetter) {
          if (figures[i].unknownFigureLetter == 'L') {
            connectors++;
            figures[i].connector = true;
          }
        }
            
        // check if this is the first figure of a subSequence
        if (subSequence) {
          figures[i].subSequence = subSequence;
          subSequence = false;
        }
        
        // add comments when applicable
        if (comments) {
          figures[i].comments = comments;
          comments = false;
        }
        
        // increase sequence figure number
        seqNr ++;
        firstFigure = false;
        // Reset scale to 1 after completing a figure
        if (scale != 1) {
          curveRadius = curveRadius / scale;
          lineElement = lineElement / scale;
          scale = 1;
        }
        // Crossbox entry 'figure'
      } else if (base == '+ej+') {
        Attitude = 0;
        Direction = 270;
        if (firstFigure) {
          updateSequenceOptions ('ej');
        } else {
          subSequence = 'ej';
          figures[i].subSequence = 'ej';
          firstFigure = true;
        }
        // Crossbox away entry 'figure'
      } else if (base == '+eja+') {
        Attitude = 0;
        Direction = 90;
        if (firstFigure) {
          updateSequenceOptions ('eja');
        } else {
          subSequence = 'eja';
          figures[i].subSequence = 'eja';
          firstFigure = true;
        }
        // Downwind entry 'figure'
      } else if (base == '+ed+') {
        Attitude = 0;
        if (activeForm == 'C') {
          Direction = 0;
          goRight = true;
        } else {
          Direction = 180;
          goRight = false;
        }
        if (firstFigure) {
          updateSequenceOptions ('ed');
        } else {
          subSequence = 'ed';
          figures[i].subSequence = 'ed';
          firstFigure = true;
        }
        // Upwind entry 'figure'
      } else if (base == '+eu+') {
        Attitude = 0;
        if (activeForm == 'C') {
          Direction = 180;
          goRight = false;
        } else {
          Direction = 0;
          goRight = true;
        }
        if (firstFigure) {
//          updateSequenceOptions ('eu');
        } else {
          subSequence = 'eu';
          figures[i].subSequence = 'eu';
          firstFigure = true;
        }
      } else if (base != '') {
        if (firstFigure) updateSequenceOptions ('');
        // No viable figure found, therefore Illegal
        buildIllegal (i);
        if (i == (figures.length - 1)) {
          alertMsgs.push (userText.illegalAtEnd);
        } else {  
          alertMsgs.push (userText.illegalBefore + seqNr);
        }
      }
    }
    
    // set the exitAxis for every figure, including draw only
    figures[i].exitAxis = ((Direction == 0) || (Direction == 180))? 'X' : 'Y';
    
    // check if this is the changePoint
    if (i === changePoints[1]) {
      // check if the exitAxis has been changed
      if (activeSequence.previousFigures[changePoints[0]].exitAxis !== figures[i].exitAxis) {
        updateXYFlip (changePoints[0] + 1, i + 1);
      }
    }
      
  }
  // check for floating point correction
  checkFloatingPoint();
  // Check the sequence against the correct rules
  if (rulesActive) checkRules ();
  // check for any OLAN Humpty Bump bug messages
  if (OLANBumpBugCheck) {
    var warning = '';
    if (OLANBumpBugFigs.length >= 1) {
      warning = 'Fig ';
      for (var i = 0; i < OLANBumpBugFigs.length; i++) {
        warning += OLANBumpBugFigs[i];
        if (i < (OLANBumpBugFigs.length -1)) warning += ' and ';
      }
      if (OLANBumpBugFigs.length < 2) {
        warning += userText.OLANBumpBugWarning;
      } else warning += userText.OLANBumpBugWarningMulti;
    }
    if (OLANNBugFigs.length >= 1) {
      warning += 'Fig ';
      for (var i = 0; i < OLANNBugFigs.length; i++) {
        warning += OLANNBugFigs[i];
        if (i < (OLANNBugFigs.length -1)) warning += ' and ';
      }
      if (OLANNBugFigs.length < 2) {
        warning += userText.OLANNBugWarning;
      } else warning += userText.OLANNBugWarningMulti;
    }
    if (warning != '') {
      alertBox(warning + userText.OLANBugWarningFooter);
      OLANBumpBugFigs = [];
      OLANNBugFigs = [];
      OLANBumpBugCheck = false;
    }
  }
  // Build the last figure stop shape at the last real figure after
  // all's done.
  if (!firstFigure && !(activeForm == 'Grid')) {
    for (var i = figures.length - 1; i >= 0; i--) {
      if (figures[i].aresti) {
        paths = figures[i].paths;
        // remove space at end of figure
        paths.pop();
        paths = buildShape ('FigStop', true, paths);
        figures[i].paths = paths;
        break;
      }
    }
  }
}

// do initialization after 0.5 s
window.onload = window.setTimeout(doOnLoad, 500);
