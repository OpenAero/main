// OpenAero.js 1.3.3
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
// svg Name Space
var svgNS = "http://www.w3.org/2000/svg";
// xlink Name Space for including image in svg
var xlinkNS="http://www.w3.org/1999/xlink";
// Get ellipse perameters for perspective drawing
var perspective_param = get_ellipse_parameters(yAxisOffsetDefault,yAxisScaleFactor);
var True_Drawing_Angle
// set y axis offset to the default
var yAxisOffset = yAxisOffsetDefault;
// Attitude goes from 0 to 359
// 0 = upright LTR, 45 = 45 up LTR, 90 = vertical up belly right etc
var Attitude = 0;
// Direction goes from 0 to 359 and indicates the direction the aircraft would have if it was pulled to level flight.
// It is combined with Attitude to define overall direction allowing integers for all whole degrees
// 0 = LTR, 90 = front to back, 180 = RTL, 270 = back to front. But when Attitude is inverted directions are reversed!
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
// XML string with all sequence info, undo and redo
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
// sequenceText holds the sequence_text input field object
var sequenceText = document.getElementById('sequence_text');
// sportingClass holds the class select object
var sportingClass = document.getElementById('class');
// figureK holds the current total figureK
var figureK = 0;

// figures is an object that will hold all figure data of the sequence
// format is: figures[i].xxx where:
// i is the figure nr (including drawing only figs)
// xxx is a specific element, being: 
// .string     as in sequence text line
// .paths      for all the drawing paths
// .aresti     for the Aresti nrs of the figure
// .k          for the K factors of the figure
// .figNr      for the base figure index in fig[]
// .bBox       for the bounding rectangle
// .startPos   for the starting position
// .draggable  boolean to indicate if draggable or not
// .connector  true for connector figures
// .entryAxis  for the start axis (X or Y) of the figure
// .unknownFigureLetter = letter for Free Unknown figures
// .comments   comments set before the figure by "xxx"
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

// mobileBrowser is true when OpenAero is run on a mobile browser
var mobileBrowser = false;

// cookies is true when cookies are enabled (checked by doOnLoad)
var cookies = false;

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
var inFigureXSwitchFig = 9999;

// seqCheckAvail indicates if sequence checking is available for a rule/cat/seq combination
var seqCheckAvail = [];
// variables used for checking sequence validity
var checkConv = [];
var checkAllowRegex = [];
var checkAllowCatId = [];
var checkCatGroup = [];
var checkFigGroup = [];
var checkRule = [];
var figCheckLine = [];
var defRules = [];
var rulesActive = false;

// fig will hold all figures in the catalog in the form
// fig[i].xxx where xxx is:
// .base    : the pattern for each figure as it's written in the sequence, with + and - but without any rolls
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
// queueGroup holds the figGroup index of the figure queue group
var queueGroup;
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


// **************************************************************
// *
// *           FUNCTIONS
// *
// **************************************************************

/************************************************
 * User interface layout
 ************************************************/
 
// setMobile sets mobile (true) or desktop (false) layout
function setMobile (mobile) {
  // select no figure
  if (selectedFigure.id !== null) selectFigure (false);
  // get viewport meta element
  var viewport = document.getElementById('viewport');
  // load CSS depending on mobile or desktop version
  var link = document.getElementById('mobileDesktopCSS');
  var setMobileMenu = document.getElementById('setMobile');
  var tab = document.getElementById('tab-svgContainer');
  var svg = document.getElementById('svgContainer');
  if (mobile) {
    mobileBrowser = true;
    // set view to width 320
    viewport.setAttribute('content', 'width=320, initial-scale=1.0, ' +
      'maximum-scale=2.0, minimum-scale=1.0');
    // set mobile css
    link.setAttribute('href', 'mobile.css');
    // update view menu
    setMobileMenu.setAttribute('onClick', 'setMobile(false);');
    setMobileMenu.innerHTML = userText.desktopVersion;
    // unhide sequence tab
    tab.removeAttribute('style');
    // hide sequence svg
    svg.setAttribute('style', 'position:absolute;z-index:-1;top:-5000px;');
    // remove any vertical displacement done by updateSequenceTextHeight
    document.getElementById('sequence_text').removeAttribute('style');
    document.getElementById('main').removeAttribute('style');
  } else {
    mobileBrowser = false;
    viewport.setAttribute('content', '');
    link.setAttribute('href', 'desktop.css');  
    setMobileMenu.setAttribute('onClick', 'setMobile(true);');
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
  changeFigureGroup(document.getElementById('figureGroup'));
}    

// menuActive and menuInactive show and remove top menu's on mouseover
function menuActive (e) {
  e.setAttribute('class', 'active');
  //console.log(e.firstChild.innerHTML + ' active');
}

function menuInactive (e) {
  e.removeAttribute('class');
  //console.log(e.firstChild.innerHTML + ' inactive');
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
  SVGRoot.setAttribute("version", "1.2");
  SVGRoot.setAttribute("baseProfile", "tiny");
  SVGRoot.setAttribute("id", "sequenceSvg");
  // enable figure selection and drag&drop on all forms except A
  if (activeForm != 'A') {
    SVGRoot.setAttribute("onmousedown", 'grabFigure(evt)');
    SVGRoot.setAttribute("onmousemove", 'Drag(evt)');
    SVGRoot.setAttribute("onmouseup", 'Drop(evt)');
  }
  var group = document.createElementNS (svgNS, "g");
  group.setAttribute('id', 'sequence');
  
  // this will serve as the canvas over which items are dragged.
  //    having the drag events occur on the mousemove over a backdrop
  //    (instead of the dragged element) prevents the dragged element
  //    from being inadvertantly dropped when the mouse is moved rapidly
  group.innerHTML = "<rect id='BackDrop' x='-10%' y='-10%' width='110%' height='110%' fill='none' pointer-events='all' />";

  SVGRoot.appendChild(group);
  container.appendChild(SVGRoot);
  selectFilter(SVGRoot);
  
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

// selectFilter builds a svg color filter for use with a selected figure
// White areas (such as inside of pos flick)  will become slightly yellow
// Black and red will become magenta
function selectFilter (svg) {
  var filter = document.createElementNS (svgNS, 'filter');
  filter.setAttribute('id', 'selectFilter');
  var el = document.createElementNS (svgNS, 'feComponentTransfer');
  // build filter for magenta; Red=1, Blue=0.75
  var feFunc = document.createElementNS (svgNS, 'feFuncR');
  feFunc.setAttribute('type', 'table');
  feFunc.setAttribute('tableValues', '1 1');
  el.appendChild(feFunc);
  var feFunc = document.createElementNS (svgNS, 'feFuncB');
  feFunc.setAttribute('type', 'table');
  feFunc.setAttribute('tableValues', '0.75 0.75');
  el.appendChild(feFunc);
  filter.appendChild(el);
  svg.appendChild(filter);
}
  
// alertBox creates a styled alert box with a 'close' option
// html contains the HTML text. When false, the box is closed
function alertBox(html, title) {
  var div = document.getElementById('alertBox');
  if (html) {
    // Activate overlay
    document.getElementById('alertBoxOverlay').setAttribute('style', '');
    // show box
    div.classList.remove ('noDisplay');
    //div.setAttribute('class', '');
    // Make the title
    var msgDiv = document.getElementById('alertTitle');
    if (title) {
      msgDiv.innerHTML = title;
    } else msgDiv.innerHTML = '';
    // Make the message
    var msgDiv = document.getElementById('alertMessage');
    msgDiv.innerHTML = html;
    // return the div
    return div;
  } else {
    div.classList.add ('noDisplay');
    //div.setAttribute('class', 'noDisplay');
    document.getElementById('alertBoxOverlay').setAttribute('style', 'display:none;');
  }
}

// printDialog shows or hides the print dialog
// when false, the dialog is closed
function printDialog(show) {
  var div = document.getElementById('printDialog');
  if (show) {
    document.getElementById('alertBoxOverlay').setAttribute('style', '');
    div.classList.remove ('noDisplay');
    //div.setAttribute('class', '');
  } else {
    document.getElementById('alertBoxOverlay').setAttribute('style', 'display:none;');
    div.classList.add ('noDisplay');
    //div.setAttribute('class', 'noDisplay');
  }
}

// settingsDialog shows or hides the settings dialog
// when false, the dialog is closed
function settingsDialog(show) {
  var div = document.getElementById('settingsDialog');
  if (show) {
    document.getElementById('alertBoxOverlay').setAttribute('style', '');
    div.classList.remove ('noDisplay');
  } else {
    document.getElementById('alertBoxOverlay').setAttribute('style', 'display:none;');
    div.classList.add ('noDisplay');
  }
}

// Modern Combo Box  Script
// copyright Stephen Chapman, 18th October 2008
// you may copy this script provided that you retain the copyright notice
// you should not need to alter the below code

// TO DO: replace by HTML5 combo function (<datalist>)

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
  if (typeof e === 'object') {
    var li = e.parentNode;
  } else {
    var li = document.getElementById(e);
  }
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

// roundTwo returns a number rounded to two decimal places
// Use for all drawing functions to prevent rendering errors and keep SVG file size down
function roundTwo (nr) {
  // return Math.round (nr * 100 + 0.1) / 100; // causes CPU hog with humpty bumps. Why?
  return parseFloat((parseFloat(nr) + 0.005).toFixed(2));
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
  category = category.toLowerCase();
  var returnValue = '';
  // Only search if superFamilies are defined for the category
  if (superFamilies[category]) {
    for (var family in superFamilies[category]) {
      for (var i = 0; i<aresti.length; i++) {
        if (aresti[i].substring(0, family.length) == family) {
          returnValue = superFamilies[category][family];
          break; // Break loop i
        }
      }
      if (returnValue) break; // Break loop family
    }
  }
  return returnValue;
}

// dirAttToAngle creates an angle to draw from the values for direction
// and attitude.
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToAngle (dir, att) {
  while (dir < 0) dir = dir + 360;
  while (dir >= 360) dir = dir - 360;
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
    if ((theta < 90) || (theta > 270)) theta = 0; else theta = 180;
  }
// Check for right or left half, calculate angle and make negative for left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * degToRad;
    if (angle > Tau) {
      angle = angle - Tau;
    } else if (angle < 0) angle = angle + Tau;
  } else {
    var angle = (theta - att) * degToRad;
    if (angle >= 0) {
      angle = angle - Tau;
    } else if (angle < -Tau) angle = angle + Tau;
  }
  return angle;
}

// changeDir changes Direction global by value
// and checks it stays within 0-359
function changeDir (value) {
  Direction = Direction + value;
  while (Direction < 0) Direction = Direction + 360;
  while (Direction >= 360) Direction = Direction - 360;
}

// changeAtt changes Attitude global by value
// and checks it stays within 0-359
function changeAtt (value) {
  Attitude = Attitude + value;
  while (Attitude < 0) Attitude = Attitude + 360;
  while (Attitude >= 360) Attitude = Attitude - 360;
  // update goRight for attitude changes. We monitor the exit direction
  // but also the direction through the top or bottom when ending vert.
  // Don't update this time when updateAxisDir is false, used for
  // double bumps
  if (updateAxisDir) {
    if (((Direction == 0) || (Direction == 180)) && (value != 0)) {
      if (Direction == 0) {
        goRight = false;
      } else {
        goRight = true;
      }
      if ((Attitude > 90) && (Attitude < 270)) {
        goRight = !goRight;
      } else if ((Attitude == 90) || (Attitude == 270)) {
        if ((Attitude == 90) == (value < 0)) goRight = !goRight;
      }
    }
  } else updateAxisDir = true;
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
  path.setAttribute ('style', style['windArrow']);
  g.appendChild(path);
  var text = document.createElementNS (svgNS, "text");
  text.setAttribute('x', x - (sign * 10));
  text.setAttribute('y', y + 20);
  text.setAttribute('style', style['miniFormA']);
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
function makeFigStart (seqNr) {
  var pathsArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  // Create a marker for possible automatic repositioning of the figure start
  pathsArray.push({'figureStart': true});
  // Create the first figure mark if applicable
  var ref_rayon = 9;
  var open = Math.PI / 6;
  var rayon = ref_rayon;
  // draw numbers in circles when numberInCircle set AND seqNr present
  if (numberInCircle && seqNr && (activeForm != 'A')) {
    if (firstFigure) {
      rayon = ref_rayon + 4;
      var ax = roundTwo(rayon * Math.cos(angle - open));
      var ay = -roundTwo(rayon * Math.sin(angle - open));
      var Deltax = roundTwo(rayon * Math.cos(angle + open) - ax);
      var Deltay = roundTwo(-rayon * Math.sin(angle + open) - ay);
      pathsArray.push({'path': 'm ' + ax + ',' + ay + ' a' + rayon + ',' + rayon +' 0 1 1 ' + Deltax + ',' + Deltay, 'style':'pos'});
    }
    if (seqNr < 10) {
      // Add the figure number
      if (seqNr) pathsArray.push ({'text':seqNr, 'style':'figNbr_09', 'x':0, 'y':5, 'text-anchor':'middle'});
      rayon = ref_rayon;     
    } else {
      // Add the figure number
      pathsArray.push ({'text':seqNr, 'style':'figNbr_10', 'x':0, 'y':5, 'text-anchor':'middle'});
      rayon = ref_rayon + 1;   
    }
    // Make the marker
    pathsArray.push({'path': 'm ' + (-rayon) + ',0 a' + rayon + ',' + rayon + ' 0 1 1 0,0.01', 'style':'pos', 'dx':Math.cos(angle) * 9, 'dy':- Math.sin(angle) * 9});
  } else {
    if (firstFigure && (activeForm != 'A')) {
      pathsArray.push({'path': 'm 3,-6 a7,7 0 1 1 -6,0', 'style':'pos'});
    }
    // Add the figure number, except on Form A
    if (seqNr && (activeForm != 'A')) {
      pathsArray.push ({'text':seqNr, 'style':'miniFormA', 'x':0, 'y':-8, 'text-anchor':'middle'});
    }
    // Make the marker
    pathsArray.push({'path': 'm -4,0 a4,4 0 1 1 0,0.01', 'style':'blackfill', 'dx':Math.cos(angle) * 4, 'dy':- Math.sin(angle) * 4});
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
    pathArray['path'] = 'm ' + dx2 + ',' + dy2 + ' l ' + (dx * 2) +
      ',' + (dy * 2) + ' l ' + (-4 * dx) + ',' + (-4 * dy);
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
function makeFigSpace (extent) {
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = Math.cos(angle) * lineElement * extent;
  var dy = - Math.sin(angle) * lineElement * extent;
  pathArray['path'] = '';
  pathArray['style'] = 'neg';
  pathArray['dx'] = dx;
  pathArray['dy'] = dy;
  return Array(pathArray);
}

// makeVertSpace creates vertical space
function makeVertSpace (extent) {
  var pathArray = [];
  pathArray['path'] = '';
  pathArray['style'] = 'neg';
  pathArray['dx'] = 0;
  pathArray['dy'] = lineElement * extent;
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
  pathArray['path'] = 'l ' + dx + ',' + dy;
  if (NegLoad == 0) {
      pathArray['style'] = 'pos';
  } else pathArray['style'] = 'neg';
  pathArray['dx'] = dx;
  pathArray['dy'] = dy;
  return Array(pathArray);
}

// makeMove is similar to makeLine but only moves the pointer and creates no lines
function makeMove (Params) {
  var Extent = Params[0];
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = roundTwo(Math.cos(angle) * lineElement * Extent);
  var dy = - roundTwo(Math.sin(angle) * lineElement * Extent);
  pathArray['path'] = '';
  pathArray['style'] = '';
  pathArray['dx'] = dx;
  pathArray['dy'] = dy;
  return Array(pathArray);
}

// makeCorner creates sharp corners. Actually it only changes direction, no lines are created
function makeCorner (param) {
  var Extent = Math.abs(param);
  var PullPush = param > 0 ? 0 : param == 0 ? 0 : 1;
  var pathArray = [];
  changeAtt(Extent - (PullPush * 2 * Extent));
  pathArray['path'] = '';
  NegLoad = PullPush;
  if (NegLoad == 0) {
    pathArray['style'] = 'pos';
  } else pathArray['style'] = 'neg'
  return Array(pathArray);
}

// get_ellipse_parameters gets the ellipse radius and orientation from
// the perspective angle and the Y axis scale factor
function get_ellipse_parameters(P_Angle,Y_Scale) {
  if ((P_Angle == 30) && (Y_Scale == 0.7)) {
    return {'x_radius': 0.559 , 'y_radius': 1.085 ,'rot_angle': 14.67 };
  }
  if (Y_Scale == 1) {
    var Rot_axe_Ellipse = (90 - P_Angle) /2;
    var X_axis_Radius = yAxisScaleFactor * Math.sqrt(1 - Math.sin(P_Angle*degToRad)) ;
    var Y_axis_Radius = Math.sqrt(1 + Math.sin(P_Angle*degToRad)) ;
    return {'x_radius': X_axis_Radius , 'y_radius': Y_axis_Radius ,'rot_angle': Rot_axe_Ellipse };
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
  var H_orient = roundTwo(180 * Math.atan((B*Math.sin(theta)) /
    (Math.cos(theta) + A*Math.sin(theta))) / Math.PI);
// Returns only vertical plane parameters (not the horizontal one, for the moment)
  return {'x_radius': V_r_min, 'y_radius': V_r_max ,'rot_angle': V_orient}
}

// dirAttToXYAngle modified from dirAttToAngle to just care about angle in a vertical "plan".
// dirAttToAngle creates an angle to draw from the values for direction and attitude
// 0 or higher angles mean theta was in the right half, negative angles mean theta was in the left half => necessary for correct looping shapes
function dirAttToXYAngle (dir, att) {
  while (dir < 0) dir = dir + 360;
  while (dir >= 360) dir = dir - 360;
  // Create offset for the Y-axis, determined by yAxisOffset
  if (dir < 180) {
    var theta = 0;
  } else var theta =  180;
  // No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    if ((theta < 90) || (theta > 270)) theta = 0; else theta = 180;
  }
  // Check for right or left half, calculate angle and make negative for left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * degToRad;
    if (angle > Tau) {
      angle = angle - Tau;
    } else if (angle < 0) angle = angle + Tau;
  } else {
    var angle = (theta - att) * degToRad;
    if (angle >= 0) {
      angle = angle - Tau;
    } else if (angle < -Tau) angle = angle + Tau;
  }
  return angle;
}

// makeCurve creates curves of up to 359 degrees
// This is used for all looping shapes
// param is the angle in whole degrees
function makeCurve (param) {
  // Define some variables
  var pathArray = [];
  var Extent = Math.abs(param);
  var PullPush = param > 0 ? 0 : param == 0 ? 0 : 1;
  NegLoad = PullPush;
  if (NegLoad == 0) {
    pathArray['style'] = 'pos';
  } else pathArray['style'] = 'neg';
  var Radius = curveRadius;
  if (Extent > 180) var longCurve = 1; else var longCurve = 0;
  // Calculate at which angle the curve starts
  var radStart = dirAttToAngle (Direction, Attitude);
  var radStartXY = dirAttToXYAngle (Direction, Attitude);
  //  var start_Att = Attitude;
  // Change direction and make sure Attitude stays in [0,359]
  if (PullPush == 0) changeAtt(Extent); else changeAtt(-Extent);
  // Calculate at which angle the curve stops
  var radStop = dirAttToAngle (Direction, Attitude);
  var radStopXY = dirAttToXYAngle (Direction, Attitude);
  // See if we are curving left or right, depending on radStart and PullPush
  if (radStart >= 0) var curveRight = 0; else var curveRight = 1;
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
    if (radStartXY >= 0) var curveRight = 0; else var curveRight = 1;
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
    pathArray['path'] = 'a' + roundTwo(X_axis_Radius) + ',' +  roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' ' + longCurve +
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
  var dx = Math.cos(angle) * lineElement075;
  var dy = - Math.sin(angle) * lineElement075;
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
  while (startRad >= Tau) startRad = startRad - Tau;
  while (startRad < 0) startRad = startRad + Tau;
  while (stopRad >= Tau) stopRad = stopRad - Tau;
  while (stopRad < 0) stopRad = stopRad + Tau;
    
  if (rad >= 0) var sign = 1; else var sign = -1;
  // calculate where we are in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
  // as the atan function only produces angles between -PI/2 and PI/2 we
  // may have to correct for full ellipse range
  if ((startRad > Math.PI) && (startRad < Tau)) {
    radEllipse = radEllipse + Math.PI;
  }
  startX = Math.cos (radEllipse) * curveRadius;
  startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
  // calculate where we go to in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
  if ((stopRad > Math.PI) && (stopRad < Tau)) {
    radEllipse = radEllipse + Math.PI;
  }
  stopX = Math.cos (radEllipse) * curveRadius;
  stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
  dx = roundTwo(stopX - startX) * sign;
  dy = roundTwo(stopY - startY) * sign;
  if (rad > 0) sweepFlag = 0; else sweepFlag = 1;
  if (Math.abs (rad) < Math.PI) longCurve = 0; else longCurve = 1;
  if ((Attitude > 90) && (Attitude < 270)) {
    pathsArray.push({'path':'a ' + curveRadius + ',' +
      roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
      sweepFlag + ' ' + dx + ',' + dy, 'style':'neg', 'dx':dx,'dy':dy});
  } else {
    pathsArray.push({'path':'a ' + curveRadius + ',' +
      roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
      sweepFlag + ' ' + dx + ',' + dy, 'style':'pos', 'dx':dx,'dy':dy});
  }
  return pathsArray;
}

// makeTurnDots creates dotted arc segments for turns and rolling circles.
// Size is in DRAWN rads
function makeTurnDots (rad, startRad, stopRad, pathsArray) {
  while (startRad >= Tau) startRad = startRad - Tau;
  while (stopRad >= Tau) stopRad = stopRad - Tau;
    
  if (rad >= 0) sign = 1; else sign = -1;
  // calculate where we are in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
  // as the atan function only produces angles between -PI/2 and PI/2
  // we may have to correct for full ellipse range
  if ((startRad > Math.PI) && (startRad < Tau)) {
    radEllipse = radEllipse + Math.PI;
  }
  startX = Math.cos (radEllipse) * curveRadius;
  startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
  // calculate where we go to in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
  if ((stopRad > Math.PI) && (stopRad < Tau)) {
    radEllipse = radEllipse + Math.PI;
  }
  stopX = Math.cos (radEllipse) * curveRadius;
  stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
  dx = (stopX - startX) * sign;
  dy = (stopY - startY) * sign;
  if (rad > 0) sweepFlag = 0; else sweepFlag = 1;
  if (Math.abs (rad) < Math.PI) longCurve = 0; else longCurve = 1;
  pathsArray.push({'path':'a ' + curveRadius + ',' +
    roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
    sweepFlag + ' ' + dx + ',' + dy, 'style':'dotted'});
  return pathsArray;
}

// makeTurnRoll creates rolls in rolling turns. Basically a minimal version of makeRoll
// param is the amount of roll degrees
function makeTurnRoll (param, rad) {
  var pathsArray = [];
  var extent = Math.abs(param);
  var sign = param > 0 ? 1 : -1;
  var sweepFlag = param > 0 ? 1 : 0;
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
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
  if (extent >= 360) {
    radPoint = rad - sign * (Math.PI / 6);
  } else {
    radPoint = rad;
  }
  var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
  var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
  // Make the curved path
  path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
  path = path + 'a' + rollcurveRadius + ',' + rollcurveRadius +
    ' 0 0 ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
  pathsArray.push ({'path':path, 'style':'pos'});
  return pathsArray;
}

// makeTurn builds turns and rolling circles from the draw instructions
// parsed from fig[i].draw
function makeTurn (draw) {
  // parse base
  var pathsArray = [];
  // Check if we are in an in/out or out/in roll
  regex = /io|IO/;
  if (regex.test(draw)) {
    var switchRollDir = true;
  } else {
    var switchRollDir = false;
  }
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
      if (((Direction == 0) == (Attitude == 0)) == (activeForm != 'C')) {
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
  if (regex.test(draw)) var rollDir = -sign; else var rollDir = sign;
  // See if we start inverted, this will also flip the drawing direction
  if (Attitude == 180) rollDir = -rollDir;

  // See if direction change is called for by the preparsed draw string
  var stopRad = dirAttToAngle (Direction + (sign * extent), Attitude);
  if (stopRad < 0) stopRad = stopRad + Tau;
  var startRad = dirAttToAngle (Direction, Attitude);
  if (startRad < 0) startRad = startRad + Tau;
  startRadSave = startRad;
  var rad = sign * stopRad - sign * startRad;
  if (rad <= 0) rad = rad + Tau;
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
        steps = steps + parseInt(numbers[i]);
      }
    }
    var step = rad / steps;
    var halfStepSigned = sign * (step / 2);
    var rollPos = 1;
    for (var i = 0; i < rad; i = i + step) {
      pathsArray = makeTurnArc (halfStepSigned, startRad, startRad + halfStepSigned, pathsArray);
      startRad = startRad + halfStepSigned;
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
      startRad = startRad + halfStepSigned;
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
      // not always exactly centered: TO DO: improve code
      var dx = -sign * (Math.sin (stopRad)) * curveRadius;
      var dy = -sign * (Math.cos (stopRad)) * curveRadius * flattenTurn;
      pathsArray.push ({'text':extent + "\u00B0", 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'});
      changeDir (sign * extent);
    } else {
      pathsArray = makeTurnArc (sign * Math.PI, startRad, startRad + Math.PI, pathsArray);
      changeDir (180);
      pathsArray = makeTurnArc (sign * Math.PI, startRad + Math.PI, startRad, pathsArray);
      changeDir (180);
    }
  }
  return pathsArray;
}

// makeRoll creates aileron rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of roll
// [1] is hesitations in fractions of full roll
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional glider slow roll argument, true = slow roll
// [4] is optional autocorrect roll argument, true = autocorrect roll
// Example: (270,4) would be a 3x4 roll
function makeRoll (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var sweepFlag = params[0] > 0 ? 1 : 0;
  if (params.length > 2) var rollTop = params[2];
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) rad = True_Drawing_Angle;
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
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
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
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
      dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
      pathsArray.push ({'path':path, 'style':style[0]});
    }
    
    // Calculate at which angle the curve starts and stops
    if (extent >= 360) {
      radPoint = rad - sign * (Math.PI / 6);
    } else {
      radPoint = rad;
    }
    var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
    var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
    // Make the curved path
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    path = path + 'a' + rollcurveRadius + ',' + rollcurveRadius +
      ' 0 0 ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':style[1]});
    // Where necessary, show the roll numbers after completing the first roll point and arc.
    // This is only necessary for rolls that are not multiples of 180 or have hesitations
    if (extent == Math.abs(params[0])) {
      if ((parseInt(extent / 180) != (extent / 180)) || (stops > 0)) {
        if (stops > 0) {
          var text = '' + (extent / (360 / stops));
          if (extent != 360) text = text + 'x' + stops;
        } else {
          text = ((extent / 90) - (parseInt (extent / 360) * 4)) + '/4';
        }
        if (extent > 360) {
          dx = -sign * (radSin * (rollcurveRadius + 4 + ((rollFontSize / 5) * text.length)));
          dy = -sign * (radCos * (rollcurveRadius + rollFontSize)) + (rollFontSize / 5) + 1;
        } else {
          dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 5) * text.length)));
          dy = -sign * (radCos * (rollcurveRadius + rollFontSize / 2)) + (rollFontSize / 5) + 1;
        }
        pathsArray.push ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'});
      }
    }
    // Completed the first (full) roll. Continue for more than 360
    extent = extent - 360;
    // For more than 360 degrees, draw a line between the rolls and the roll tip connect line
    if (extent > 0) {
      // Make the line between the two rolls. Always positive for now
      // Only move the pointer for rolls in the top
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
        path = 'm ' + roundTwo(dxTip+dx/2) + ',' + roundTwo(dyTip+dy/2) + ' ';
        path = path + 'l ' + roundTwo(-dx*1.5) + ',' + roundTwo(-dy*1.5);
      } else {
        // regular roll
        path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
        path = path + 'l ' + roundTwo(-dx) + ',' + roundTwo(-dy);
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
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
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
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    if (params[1] == 0) pathStyle = 'posfill'; else pathStyle = 'negfill';
    pathsArray.push ({'path':path, 'style':pathStyle, 'dx':radCos * snapElement075, 'dy':-radSin * snapElement075});
    // Where necessary, show the roll numbers after completing the first roll point and arc.
    // This is only necessary for rolls that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      if (parseInt(extent / 180) != (extent / 180)) {
        text = ((extent / 90) - (parseInt (extent / 360) * 4)) + '/4'
        if (extent > 360) {
          dx = -sign * (radSin * (rollcurveRadius + 4 + ((rollFontSize / 5) * text.length)));
          dy = -sign * (radCos * (rollcurveRadius + rollFontSize)) + (rollFontSize / 5) + 1;
        } else {
          dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 5) * text.length)));
          dy = -sign * (radCos * (rollcurveRadius + rollFontSize / 2)) + (rollFontSize / 5) + 1;
        }
        pathsArray.push ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'});
      }
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
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
      path = path + 'l ' + roundTwo(-dx) + ',' + roundTwo(-dy);
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
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
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
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    if (params[1] == 0) pathStyle = 'posfill'; else pathStyle = 'negfill';
    pathsArray.push ({'path':path, 'style':pathStyle, 'dx':radCos * spinElement, 'dy':-radSin * spinElement});
    // Where necessary, show the roll numbers after completing the first roll point and arc.
    // This is only necessary for spins that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      if (parseInt(extent / 180) != (extent / 180)) {
        text = ((extent / 90) - (parseInt (extent / 360) * 4)) + '/4';
        dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 3) * text.length)));
        dy = -sign * (radCos * (rollcurveRadius + rollFontSize)) + (rollFontSize / 5);
        pathsArray.push ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'});
      }
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
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
      path = path + 'l ' + roundTwo(-dx) + ',' + roundTwo(-dy);
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
    dy = dy - dx * scaleLine.y;
    dx = dx * scaleLine.x;
    if (yAxisOffset > 90) sweepFlag = 1 - sweepFlag;
    pathsArray[0]['path'] = 'a' + roundTwo(X_axis_Radius) + ',' +  roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' 0 ' +
      sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathsArray[0]['path'] = 'a' + Radius + ',' + Radius + ' 0 0 ' +
      sweepFlag + ' ' + dx + ',' + dy;
  }
  pathsArray[0]['dx'] = dx;
  pathsArray[0]['dy'] = dy;
  var Radius = (curveRadius) / 2;
  if (angle > 0) dx = Radius; else dx = -Radius;
  dy = Radius;
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.rot_angle : -perspective_param.rot_angle;
    var X_axis_Radius = perspective_param.x_radius * Radius;
    var Y_axis_Radius = perspective_param.y_radius * Radius;
    dy = dy - dx * scaleLine.y;
    dx = dx * scaleLine.x;
    pathsArray[1]['path'] = 'a' + roundTwo(X_axis_Radius) + ',' +  roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' 0 ' +
      sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathsArray[1]['path'] = 'a' + Radius + ',' + Radius + ' 0 0 ' +
      sweepFlag + ' ' + dx + ',' + dy;
  }
  pathsArray[1]['style'] = 'pos';
  pathsArray[1]['dx'] = dx;
  pathsArray[1]['dy'] = dy;
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

// makeTextBlock makes text blocks
function makeTextBlock (text) {
  
  function tspan (line) {
    var span = document.createElementNS (svgNS, 'tspan');
    span.setAttribute('x', 0);
    span.setAttribute('dy', 14);
    span.appendChild(document.createTextNode(line));
    return span;
  }
  
  var pathsArray = [];
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
    t.style = style['textBlock'];

    // parse special characters, TO DO
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
        // no tag, add character
        default:
          line += text[i];
          header = false;
      }
    }
    var span = document.createElementNS (svgNS, 'tspan');
    span.setAttribute('x', 0);
    span.setAttribute('dy', 14);
    span.appendChild(document.createTextNode(line));
    t.appendChild (span);
    // determine size
    var box = t.getBBox();
    var w = box.width;
    var h = box.height;
    // remove element from SVG root
    SVGRoot.removeChild(t);

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
    var x = roundTwo ((c * d) - (w / 2));
    var y = - roundTwo ((s * d) + (h / 2));
    var dx = roundTwo (2 * c * d);
    var dy = - roundTwo (2 * s * d);
    // draw rectangle around text
    pathsArray.push ({'path':'m ' + (x-3) + ',' + (y-3) + ' l ' + (w + 6) +
      ',0 l 0,' + (h + 6) + ' l' + -(w+6) + ',0 z', 'style':styleId});  
    pathsArray.push ({'textBlock':t, 'x':x, 'y':y, 'dx':dx, 'dy':dy});
    pathsArray.push (makeFigSpace(2)[0]);
  } else {
    pathsArray.push({'dx':0,'dy':0});
  }
  return pathsArray;
}

/**************************************************************************
 * Functions for creating and drawing complex shapes from the base shapes */

// draw a shape
function buildShape(ShapeName, Params, paths) {
  // if the paths array was not provided, create an empty one
  if (!paths) var paths = [];
  // define the pathsArray by executing the correct makeShape function
  var pathsArray = eval ('make' + ShapeName + '(Params)');
  // walk through the returned paths
  for (var i = 0; i < pathsArray.length; i++) {
    paths.push (pathsArray[i]);
  }
  return paths;
}

// drawShape draws a shape from a pathArray
// selectFigure will be true if the figure to be drawn is one selected by hover
function drawShape(pathArray, svgElement) {
  if (!svgElement) svgElement = SVGRoot.getElementById('sequence');
  // decide if we are drawing a path or text or starting a figure
  if (pathArray['path']) {
    var path = document.createElementNS (svgNS, "path");
    path.setAttribute('d', 'M ' + roundTwo(X) + ',' + roundTwo(Y) +
      ' ' + pathArray['path']);
    path.setAttribute('style', style[pathArray['style']]);
    svgElement.appendChild(path);
  } else if (pathArray['text']) {
    var text = document.createElementNS (svgNS, "text");
    text.setAttribute('x', roundTwo(X + pathArray['x']));        
    text.setAttribute('y', roundTwo(Y + pathArray['y']));
    text.setAttribute('style', style[pathArray['style']]);
    text.setAttribute('text-anchor', pathArray['text-anchor']);
    var textNode = document.createTextNode(pathArray['text']);
    text.appendChild(textNode);
    svgElement.appendChild(text);
  } else if (pathArray['textBlock']) {
    var tb = pathArray['textBlock'];
    var spans = tb.getElementsByTagName('tspan');
    // set all tspan x values
    for (var i = 0; i < spans.length; i++) {
      spans[i].setAttribute('x', roundTwo(X + pathArray['x']));
    }
    // set text x value
    tb.setAttribute('x', roundTwo(X + pathArray['x']));
    tb.setAttribute('y', roundTwo(Y + pathArray['y']));
    svgElement.appendChild(tb);
  } else if (pathArray['figureStart']) {
    // Check if figure starts do not overlap when this is not the first figure
    if (figureStart.length > 0) {
      do {
        // Walk through the figure starts and see if we find any distance
        // lower than minimum with the one we're making now
        var overlap = false;
        for (var i = 0; i < figureStart.length; i++) {
          var distSq = roundTwo((figureStart[i].x - X)*(figureStart[i].x - X) + (figureStart[i].y - Y)*(figureStart[i].y - Y))
          if (distSq < minFigStartDistSq) {
            // found one that's too close. Move the start down and run again
            Y = roundTwo(figureStart[i].y + Math.sqrt(minFigStartDistSq-((figureStart[i].x - X)*(figureStart[i].x - X))));
            overlap = true;
            break; // break for loop
          }
        }
      } while (overlap);
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
    circle.setAttribute('class', 'figStartCircle');
    svgElement.appendChild (circle);
  }
  if ('dx' in pathArray) X = roundTwo(X + pathArray['dx']);
  if ('dy' in pathArray) Y = roundTwo(Y + pathArray['dy']);
  return svgElement;
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
  } else SVGRoot.getElementById('sequence').appendChild(newText);
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
  if (w) newText.setAttribute('width', roundTwo(w));
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
// Functions for interpreting user input and variables

// doOnLoad is only called on initial loading of the page
function doOnLoad () {
  // Add a listener for HTML5 app cache updates
  addUpdateListener();
  // show loading overlay and circles
  var el = document.getElementById('alertBoxOverlay');
  el.removeAttribute('style');
  el.innerHTML = '<svg id="loaderSvg" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="40%" viewBox="-19 -19 38 38"><defs><circle id="loaderCircle" cx="10" cy="10" r="4"/></defs>   <g id="a"><use xlink:href="#loaderCircle"style="fill:#adadad;fill-opacity:0.5;stroke-width:0" /><use xlink:href="#loaderCircle" transform="rotate(45)" style="fill:#adadad;fill-opacity:0.5;" /><use xlink:href="#loaderCircle" transform="rotate(90)" style="fill:#c1c1c1;fill-opacity:0.56862745;" /><use xlink:href="#loaderCircle" transform="rotate(135)" style="fill:#d7d7d7;fill-opacity:0.67843161;" /><use xlink:href="#loaderCircle" transform="rotate(180)" style="fill:#e9e9e9;fill-opacity:0.78431373;" /><use xlink:href="#loaderCircle" transform="rotate(225)" style="fill:#f4f4f4;fill-opacity:0.89019608;" /><use xlink:href="#loaderCircle" transform="rotate(270)" style="fill:#ffffff;fill-opacity:1;" /><use xlink:href="#loaderCircle" transform="rotate(315)" style="fill:#adadad;fill-opacity:0.5;" /><animateTransform attributeName="transform" attributeType="XML" type="rotate" begin="0s" dur="1s" repeatCount="indefinite" calcMode="discrete" values="0  ;  45;  90; 135; 180; 225; 270; 315"  keyTimes="0.0; 0.13; 0.27; 0.40; 0.53; 0.67; 0.80; 0.93" /></g></svg>';
  // build sequence svg
  rebuildSequenceSvg();
  // check browser and capabilities
  var errors = checkBrowser();
  // determine if we are running on a mobile browser by screen width
  if (screen.width < 761) setMobile (true); else setMobile (false);
  // check if cookies are supported
  setCookie ('cookieTest', 'dummy', 1);
  if (getCookie ('cookieTest') == 'dummy') {
    cookies = true;
    setCookie ('cookieTest', '', -1);
  }
  // Setup the drag n drop listeners for multi file checking
  var dropZone = document.getElementById('fileDrop');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', checkMulti, false);
  // add onresize event for resizing the sequence text window
  window.onresize = updateSequenceTextHeight;
  // Parse the figures file
  parseFiguresFile();
  // Parse the rules
  parseRules();
  // Activate the first figure selection group
  changeFigureGroup(document.getElementById('figureGroup'));
  document.getElementById('figureHeader').innerHTML = '';
  // Add plus and minus elements such as used in entry/exit line adjustment
  addPlusMinElements();
  // build the buttons
  buildButtons();
  // prepare figure editor
  updateFigureEditor();
  // set correct options and menu items in various places
  setOptions();
  // set default Y axis offset and start direction
  setYAxisOffset (yAxisOffsetDefault);
  Direction = 0;
  // set OpenAero version for saving
  document.getElementById('oa_version').value = version;
  // Load sequence cookie (if any)
  activeSequence.xml = getCookie('sequence');
  if (activeSequence.xml) activateXMLsequence (activeSequence.xml);
  // load sequence from URL if sequence GET element is set
  var sURL = window.document.URL.toString();
  var match = sURL.match(/\?sequence=.+/);
  if (match) {
    activateXMLsequence (decodeURI(match[0].replace('?sequence=', '')));
  }
  // Add combo box functions for rules/category/program input fields
  new combo('rules','#cc9','#ffc');
  changeCombo('rules');
  // check if the sequence displayed is the one in the input field
  checkSequenceChanged();
  // select form B
  // need to do this to make sure the sequence is drawn when loaded
  // from a cookie
  selectForm('B');
  // Update the browser title and activeSequence.xml
  changeSequenceInfo();
  // load (mostly) completed, remove loading icon and status
  el.innerHTML = '';
  el.setAttribute('style', 'display:none;');
  // Check if an update has just been done
  checkUpdateDone();
  // Check for the latest version every 10 minutes
  window.setInterval(function(){latestVersion()},600000);
  // check if we are running from a file (DEPRECATED). This will also
  // mean cookies are disabled
  if (window.location.protocol === 'file:') {
    errors.push (userText.runFromFile);
  } else {
    // set alert if cookies are disabled
    if (!cookies) errors.push (userText.noCookies);
  }
  // show alert box for any alerts
  if (errors.length) {
    alertBox ('<p>' + errors.join('</p><p>') + '</p>');
  }
  loadComplete = true;
  // also check for latest version now
  latestVersion();
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
        subString: "Linux",
        identity: "Linux"
      }
    ]
  
  };
  BrowserDetect.init();
  var fatalError = false;
  var browserString = BrowserDetect.browser + ' Version ' +
    BrowserDetect.version + ', running on ' + BrowserDetect.OS;
  // Check for essential methods, OpenAero will not function without these!
  // use the loader to check for SVG and getBBox support
  if (!document.getElementById('a').getBBox) fatalError = true;
  if (fatalError) {
    document.getElementsByTagName('body')[0].innerHTML = '<h2><center>' +
      'Your browser (' + browserString + ') is not capable ' +
      'of running OpenAero.<br>' + userText.getChrome +
      '</center></h2>';
    throw new Error('Browser not capable of running OpenAero');
  }
  // Check for recommended methods
  // check for file support
  if (!fileSupport()) {
    return ([userText.fileOpeningNotSupported + '<br>' + userText.getChrome]);
  }
  // Present a warning if the browser is not Chrome
  if (BrowserDetect.browser != 'Chrome') {
    return (['Your browser has been detected as: ' + browserString +
      '.<br>' + userText.getChrome]);
  }
  return [];
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
function clickButton (e) {
  var divClass = e.getAttribute('class');
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
  document.getElementById('moveX').setAttribute('disabled', 'disabled');
  document.getElementById('moveY').setAttribute('disabled', 'disabled');

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
        } else checkSequenceChanged();
        activeSequence.addUndo = true;
        setUndoRedo();
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
        } else checkSequenceChanged();
        activeSequence.addUndo = true;
        setUndoRedo();
      }
      // don't continue. Not a figure function
      return;
    case 'deleteFig':
      if (selectedFigure.id != null) {
        // remove all previous drawing figures and the figure itself
        while (selectedFigure.id > 0) {
          if (figures[selectedFigure.id - 1].figNr) {
            break;
          } else {
            updateSequence(selectedFigure.id - 1, '', true);
          }
        }        
        updateSequence(selectedFigure.id, '', true);
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
        document.getElementById('moveX').removeAttribute('disabled');
      }
      break;
    case 'straightLine':
      document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.off);
      document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.off);
      if (e.firstChild.firstChild.getAttribute('src') == mask.on) {
        document.getElementById('moveX').removeAttribute('disabled');
        document.getElementById('moveY').removeAttribute('disabled');
      }
      break;
    case 'curvedLine':
      document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.off);
      document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.off);
      if (e.firstChild.firstChild.getAttribute('src') == mask.on) {
        document.getElementById('moveX').removeAttribute('disabled');
        document.getElementById('moveY').removeAttribute('disabled');
      }
      break;
    case 'figEntryButton':
    case 'figExitButton':
      // switch button upright/inverted
      if (e.classList.contains ('inverted')) {
        e.classList.remove ('inverted');
      } else {
        e.classList.add ('inverted');
      }
      break;
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
    button.setAttribute('onMouseDown', 'clickButton(this);');
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
    value.setAttribute('onUpdate', 'updateFigure();');
    value.setAttribute('onKeyUp', 'updateFigure();');
    el[i].appendChild (value);
    var button = document.createElement('span');
    button.setAttribute('class', 'plusButton');
    button.setAttribute('onMouseDown', 'clickButton(this);');
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

// build an element with plus/minus buttons
function buildPlusMinElement (id, value) {
  if (mobileBrowser) {
    var html = '<span class="minButton" onClick="clickButton(this);">' +
      '<img src="buttons/mask.png"></span>';
    html += '<input type="number" id="'+id+'" size="2" value="'+value+'" ' +
      'class="plusMinText" onUpdate="updateFigure();" onKeyUp="updateFigure();" />';
    html += '<span class="plusButton" onClick="clickButton(this);">' +
      '<img src="buttons/mask.png"></span>';
  } else {
    if (userText.tooltip[id]) {
      var html = '<span class="tooltip ttRight">';
      html += '<span class="minButton" onClick="clickButton(this);">' +
        '<img src="buttons/smallMask.png"></span>';
      html += '<input type="text" id="'+id+'" size="2" value="'+value+'" ' +
        'class="plusMinText" onUpdate="updateFigure();" onKeyUp="updateFigure();" />';
      html += '<span class="plusButton" onClick="clickButton(this);">' +
        '<img src="buttons/smallMask.png"></span>';
      html += '<div>' + userText.tooltip[id] + '</div></span>';
    } else {
      var html = '<span class="minButton" onClick="clickButton(this);">' +
        '<img src="buttons/smallMask.png"></span>';
      html += '<input type="text" id="'+id+'" size="2" value="'+value+'" ' +
        'class="plusMinText" onUpdate="updateFigure();" onKeyUp="updateFigure();" />';
      html += '<span class="plusButton" onClick="clickButton(this);">' +
        '<img src="buttons/smallMask.png"></span>';
    }
  }
  return html;
}

// buildRollSelecteElement builds roll select elements
function buildRollSelectElement (figNr, rollEl, elNr) {
  var thisRoll = figures[figNr].rollInfo[rollEl];
  var pattern = '';
  if (thisRoll.pattern[elNr]) {
    pattern = thisRoll.pattern[elNr].replace('-', '');
  }
  var html = '<span><select id="roll' + rollEl + '-' + elNr +
    '" class="rollSelect" onChange="updateFigure();">';
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
  // build direction flip checkbox
  html += '</select>Flip<input type="checkbox" id="roll' + rollEl +
    '-' + elNr + '-swap" class=rollSwap';
  // decide wether the direction flip is activated for rolls
  if (pattern != '') {
    if (elNr == 0) {
      // flip direction for the first roll
      if (thisRoll.pattern[elNr][0] == '-') html += ' checked';
    } else {
      // XOR with the previous roll direction for subsequent rolls
      if ((thisRoll.pattern[elNr][0] != '-') != (thisRoll.pattern[elNr-1][0] != '-')) {
        html += ' checked';
      } 
    }
  } else if (elNr != 0) {
    // activate flip direction for subsequent rolls that are still empty
    html += ' checked';
  }
  html +=' onChange="updateFigure();" /></span>';
  return html;
}

// setOptions will:
// -add example sequence entries to the menu
// -set correct options in print dialog
function setOptions () {
  // add example sequence entries
  var el = document.getElementById('exampleSequences');
  for (key in exampleSequences) {
    var li = document.createElement('li');
    li.innerHTML = '<a href="#" onClick="var xml=\'' +
      escape(exampleSequences[key]) + '\';activateXMLsequence(unescape(xml));' +
      ' selectFigure (false); checkSequenceChanged();">' +
      key + '</a>';
    el.appendChild(li);
  }
  // set print dialog options
  document.getElementById ('numberInCircle').setAttribute('value', numberInCircle);
}

// setPilotCardForm will enable/disable pilot card form radio buttons
function setPilotCardForm () {
  if (document.getElementById('printFormPilotCards').checked) {
    document.getElementById('pilotCardFormB').removeAttribute('disabled');
    document.getElementById('pilotCardFormC').removeAttribute('disabled');
  } else {
    document.getElementById('pilotCardFormB').setAttribute('disabled', true);
    document.getElementById('pilotCardFormC').setAttribute('disabled', true);
  }
}

// selectPwrdGlider is activated when powered or glider is chosen
function selectPwrdGlider () {
  // update figure chooser
  changeFigureGroup(document.getElementById('figureGroup'));
  // update rule list
  updateRulesList();
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
  document.getElementById('figureSelector').setAttribute('class', 'active');
}

// hideFigureSelector hides the base figure selector
// but because we do need it to be available for various operations
// we hide it by removing the CSS class that shows it on screen
function hideFigureSelector () {
  document.getElementById('figureSelector').removeAttribute('class');
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
    drawFullFigure(-2, true, svg);
    delete figures[-2];
    // Get the drawn figure from the SVG and set the position and margin
    var group = svg.getElementById('figure-2');
    var bBox = group.getBBox();
    var xMargin = bBox['width'] / 20;
    var yMargin = bBox['height'] / 20;
    group.setAttribute('transform', 'translate(' +
      roundTwo((xMargin - bBox['x'])) + ' ' +
      roundTwo((yMargin - bBox['y'])) + ')');
    svg.setAttribute('viewBox', '0 0 ' +
      (bBox['width'] + xMargin * 2) + ' ' + (bBox['height'] + yMargin * 2));
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
    document.getElementById('unknownFigureChooser').setAttribute('style', 'display:none;');
    document.getElementById('entryExit').setAttribute('style', 'display:none;');
    // hide comments box
    document.getElementById('commentSection').classList.add('noDisplay');
  } else {
    // move figure box left
    document.getElementById('selectedFigure').classList.add('active');
    // show figure modifiers
    document.getElementById('figureOptions').removeAttribute('style');
    document.getElementById('unknownFigureChooser').removeAttribute('style');
    document.getElementById('entryExit').removeAttribute('style');
    // set switchFirstRoll
    var image = document.getElementById('switchFirstRoll').firstChild.firstChild;
    if (figures[figureId].switchFirstRoll) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchFirstRoll === false) {
      image.setAttribute('src', mask.off);
    } else image.setAttribute('src', mask.disable);
    // set switchX
    var image = document.getElementById('switchX').firstChild.firstChild;
    if (figures[figureId].switchX) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchX === false) {
      image.setAttribute('src', mask.off);
    } else image.setAttribute('src', mask.disable);
    // set switchY
    var image = document.getElementById('switchY').firstChild.firstChild;
    if (figures[figureId].switchY) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchY === false) {
      image.setAttribute('src', mask.off);
    } else image.setAttribute('src', mask.disable);
    // set subSequence
    var image = document.getElementById('subSequence').firstChild.firstChild;
    if (figures[figureId].subSequence) {
      image.setAttribute('src', mask.on);
    } else image.setAttribute('src', mask.off);
    // set correct scale
    document.getElementById('scale').value = figures[figureId].scale;
    // set move
    // first we disable all selectors and remove values
    document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.off);
    document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.off);
    document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.off);
    document.getElementById('moveX').setAttribute('disabled', 'disabled');
    document.getElementById('moveY').setAttribute('disabled', 'disabled');
    document.getElementById('moveX').value = '';
    document.getElementById('moveY').value = '';
    
    // go back in the figure cueue until we end up at the beginning OR
    // find a real figure OR find a move figure
    var i = figureId - 1;
    while ((i >= 0) && !figures[i].figNr) {
      var prevFig = figures[i];
      if (prevFig) {
        if (prevFig.moveTo) {
          document.getElementById('moveX').value = prevFig.moveTo[0];
          document.getElementById('moveY').value = prevFig.moveTo[1];
          document.getElementById('straightLine').firstChild.firstChild.setAttribute('src', mask.on);
          document.getElementById('moveX').removeAttribute('disabled');
          document.getElementById('moveY').removeAttribute('disabled');
          break;
        } else if (prevFig.curveTo) {
          document.getElementById('moveX').value = prevFig.curveTo[0];
          document.getElementById('moveY').value = prevFig.curveTo[1];
          document.getElementById('curvedLine').firstChild.firstChild.setAttribute('src', mask.on);
          document.getElementById('moveX').removeAttribute('disabled');
          document.getElementById('moveY').removeAttribute('disabled');
          break;
        } else if (prevFig.moveForward) {
          document.getElementById('moveX').value = prevFig.moveForward;
          document.getElementById('moveForward').firstChild.firstChild.setAttribute('src', mask.on);
          document.getElementById('moveX').removeAttribute('disabled');
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
    // set Unknown Figure
    if (figures[figureId].unknownFigureLetter) {
      document.getElementById('unknownFigure').value = figures[figureId].unknownFigureLetter;
    } else document.getElementById('unknownFigure').value = 0;
    
    // check if dealing with a real figure. If so, allow upright/inverted setting
    //if (fig[figures[figureId].figNr]) {
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
    //}
    
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
    }
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
          div.innerHTML = '<div class="sectionLabel">' +
            userText.rollPos[rollNr] + '</div>' +
            '<div class="sectionLabelClose">&nbsp;</div>';
          // loop until max rolls per element + 1
          for (var j = 0; j < rollsPerRollElement + 1; j++) {
            var pattern = figures[figureId].rollInfo[i].pattern[j-1];
            if (pattern) pattern = pattern.replace('-', ''); else pattern = '';
            // show the element when:
            // it's the first one OR the previous one is not empty
            // AND it's number is not higher than rollsPerRollElement
            if ((j == 0) || (pattern != '')) {
              if (j < rollsPerRollElement) {
                div.innerHTML += buildRollSelectElement(figureId, i, j);
                div.innerHTML += '<div class=clearBoth></div>';
              }
            } else break;
          }
          // j indicates how many active subrolls there are
          var subRolls = j;
          // build the gaps element for subRolls rolls
          div.innerHTML += '<div class="rollGaps">';
          // only show 'Gaps' text for non-mobile
          if (!mobileBrowser) div.innerHTML += '<span>Gaps</span>';
          var gap = figures[figureId].rollInfo[i].gap;
          for (var j = 0; j < subRolls; j++) {
            if (typeof gap[j] != 'undefined') {
              var thisGap = gap[j];
            } else thisGap = 0;
            div.innerHTML += '<span id="roll'+i+'-gap'+j+'" class="plusMin">';
            div.innerHTML += buildPlusMinElement('roll'+i+'-gap'+j+'-value', thisGap)+'</span>';
          }
          div.innerHTML += '</div><div class=clearBoth></div>';
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
  if (document.getElementById('figEntryButton').classList.contains ('inverted')) {
    pattern = '-' + pattern.substring(1);
    base = '-' + base.substring(1);
  } else {
    pattern = '+' + pattern.substring(1);
    base = '+' + base.substring(1);
  }
  if (document.getElementById('figExitButton').classList.contains ('inverted')) {
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
    } else {
      // doesn't help. Restore original pattern. No option for changing upright/inverted
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
    for (var rollNr = 0; rollNr < (rollsPerRollElement + 1); rollNr++) {
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
      // apply rolls and direction switchers
      var thisRoll = document.getElementById('roll'+rollEl+'-'+rollNr);
      // only apply when the input element exists
      if (thisRoll) {
        var rollSwap = document.getElementById('roll'+rollEl+'-'+rollNr+'-swap');
        if (thisRoll.value != '') {
          if (rollSwap.checked == true) {
            rolls += ',';
          } else if (rolls.match(/[0-9fs]/)) rolls += ';';
          rolls += thisRoll.value;
        }
      }
    }
    if (rollEl == 0) {
      // set switchFirstRoll
      var image = document.getElementById('switchFirstRoll').firstChild.firstChild;
      if (image.getAttribute('src') == mask.on) rolls += ';' + userpat.switchDirX;
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
  // set switchY
  var image = document.getElementById('switchY').firstChild.firstChild;
  if (image.getAttribute('src') == mask.on) pattern += userpat.switchDirY; 
  // set switchX
  var image = document.getElementById('switchX').firstChild.firstChild;
  if (image.getAttribute('src') == mask.on) pattern += userpat.switchDirX;
  // move back in the figure cueue to find scale or move patterns
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
  var moveX = document.getElementById('moveX').value;
  if (!moveX) moveX = 0; else moveX = parseInt(moveX);
  var moveY = document.getElementById('moveY').value;
  if (!moveY) moveY = 0; else moveY = parseInt(moveY);
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
    //} else if (moveToFig != false) {
      // remove moveTo or curveTo
      //updateSequence (moveToFig, '', true);
    //}
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
  // set subSequence
  var el = document.getElementById('subSequence').firstChild.firstChild;
  if (el.getAttribute('src') == mask.on) {
    if (subSequence === false) {
      updateSequence (selectedFigure.id - 1, userpat.subSequence, false);
    }
  } else {
    if (subSequence !== false) {
      updateSequence (subSequence, '', true);
    }
  }

  // set entry extension
  var val = document.getElementById('entryExt-value').value;
  if (val < 0) {
    pattern = new Array(1 - val).join(userpat.lineshorten) + '+' + pattern;
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
    pattern += '+' + new Array(1 - val).join(userpat.lineshorten);
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

  // when there was a flipYaxis in this figure, add it to the beginning
  // of the pattern
  if (figures[selectedFigure.id].string.indexOf(userpat.flipYaxis) > -1) {
    pattern = userpat.flipYaxis + pattern;
  }
  
  // update comments, including Free Unknown letter
  // keep this at the end to prevent disturbing other items
  var val = document.getElementById('unknownFigure').value;
  if (val != 0) {
    var comments = '@' + val;
  } else {
    var comments = '';
  }
  comments += document.getElementById('comments').value;
  if (figures[selectedFigure.id].unknownFigureLetter) {
    var oldComments = '@' + figures[selectedFigure.id].unknownFigureLetter;
  } else {
    var oldComments = '';
  }
  oldComments += figures[selectedFigure.id].comments;
  if (!oldComments) oldComments = '';
  if (comments != oldComments) {
  // move back in the figure cueue to find comments
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
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    // Check for appcache when using http
    window.applicationCache.update();
  } else {
    // displays a link to download the latest version of OpenAero when
    // a newer one than the one being used is available and we are
    // running from file. This is DEPRECATED but we'd rather have users
    // using new file versions in case they insist
    var img = document.getElementById('latestVersion');
    img.removeAttribute('onerror');
    // Apply latest version img src
    img.setAttribute('src', 'http://openaero.net/openaero.php?f=version&version=' + version);
    // Hide the image on error (e.g. no internet connection)
    img.setAttribute('onerror', "this.style.display = 'none';");
  }
}

// addUpdateListener adds an event listener that checks if a new app
// cache update is available
function addUpdateListener () {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      // If we're not done loading, just reload
      if (confirm(userText.loadNewVersion)) {
        // if we were done loading, only reload after confirmation
        sequenceSaved = true;
        window.onbeforeunload = null;
        // get the URL without any GET attributes
        var url = window.document.URL.toString().replace(/\?.*/g, '');
        // reload the page with the active sequence
        window.location.assign(url + '?sequence=' + encodeURI(activeSequence.xml));
      }
    } else {
      // Manifest didn't change. Nothing new to serve.
    }
  }, false)
}

// checkUpdateDone checks if an update was just done. If so, it presents
// a dialog to the user
function checkUpdateDone() {
  // this only works when cookies are enabled
  if (cookies) {
    var oldVersion = getCookie('version');
    if (oldVersion !== version) {
      alertBox (versionNew);
      setCookie ('version', version, 2000);
    }
  }
}

// changeSequenceInfo is called whenever any part of the sequence info
// may be changed
function changeSequenceInfo () {
  // change the web page title to reflect the sequence info
  var title = 'OpenAero - ';
  title = title + document.getElementById('category').value + ' ';
  title = title + document.getElementById('program').value + ' ';
  title = title + document.getElementById('location').value + ' - ';
  title = title + document.getElementById('date').value + ' - ';
  title = title + document.getElementById('pilot').value;
  document.title = title;
  var xml = '<sequence>\n'
  for (i = 0; i < sequenceXMLlabels.length; i++) {
    var el = document.getElementById(sequenceXMLlabels[i]);
    if (el) xml = xml + '  <' + sequenceXMLlabels[i] +
      '>' + el.value + '</' + sequenceXMLlabels[i] + '>\n';
  }
  xml = xml + '</sequence>';
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
    // save activeSequence.xml in cookie 'sequence' for 6 years
    // unfortunately this will not work in Chrome from a local file
    setCookie ('sequence', activeSequence.xml, 2000);
  }
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
      var superFamily = getSuperFamily (aresti, document.getElementById('category').value);
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
          if (connectors <= connectFig.max[document.getElementById('class').value]) {
            figK = connectFig.totalK[document.getElementById('class').value] / connectors;
          } else {
            figK = connectFig.totalK[document.getElementById('class').value] / connectFig.max[document.getElementById('class').value];
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

// changeCombo is executed when a combo box value is changed
function changeCombo(id) {
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
          var listItem = document.createElement('li');
          listItem.appendChild(document.createTextNode(seqCheckAvail[ruleName]['cats'][n]['name']));
          categoryList.appendChild(listItem);
        }
      }
      new combo('category','#cc9','#ffc');
      if (rulesLogo[ruleName]) selectLogo(rulesLogo[ruleName]);
    } else {
      // disable category field
      category.value = '';
      category.placeholder = userText.selectRulesFirst;
      category.setAttribute ('disabled', 'disabled');
    }
    // set CIVA or IAC forms default
    if (ruleName === 'iac') {
      iacForms = true;
    } else iacForms = false;
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
            var listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(seqCheckAvail[ruleName]['cats'][categoryName]['seqs'][n]));
            programList.appendChild(listItem);
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
        // Load rules, check the sequence and display any alerts
        rulesActive = ruleName + ' ' + categoryName + ' ' + programName;
        var log = loadRules(ruleName, categoryName, programName);
      } else {
        if (rulesActive) {
          // redraw/check sequence with rules disabled
          rulesActive = false;
          draw();
        }
      }
    } catch (error) {
      if (rulesActive) {
        // redraw/check sequence with rules disabled
        rulesActive = false;
        draw();
      }
    }
  }
  changeSequenceInfo();
  // redraw sequence. May be necessary to update (mini) Form A
  draw();
  return log;
}

// createSelection selects part of an input field. This can be used when editing figures
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
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("version", "1.2");
  svg.setAttribute("baseProfile", "tiny");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
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
      ') scale(' + scale + ')');
    group.appendChild(svgBase);
    svg.appendChild(group);
// other images are included through an xlink data url
  } else {
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
  var width = 110;
  var height = 110;
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
    var link = document.createElement('a');
    link.setAttribute("href", "#");
    link.setAttribute("onClick", "selectLogo('" + logoName + "')");
    container.appendChild(link);
    link.appendChild(buildLogoSvg(logoImages[logoName], 0, 0, width, height));
  }
}

// selectLogo is called when a logo is clicked in the logoChooser and
// will select the correct logo for use
function selectLogo(logo) {
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
  var container = document.getElementById('activeLogo');
  container.removeChild(container.lastChild);
  // Make a link to the logoChooser
  var link = document.createElement('a');
  link.setAttribute("href", "#");
  link.setAttribute("onClick", "logoChooser()");
  container.appendChild(link);
  // Create logo svg
  link.appendChild(buildLogoSvg(logoImg, 0, 0, width, height));

  var container = document.getElementById('removeLogo');
  // Make a link to removeLogo when it's not there
  if (container.childNodes.length < 1) {
    var link = document.createElement('a');
    link.setAttribute("href", "#");
    link.setAttribute("onClick", "removeLogo()");
    container.appendChild(link);
    var text = document.createTextNode(userText.removeLogo);
    link.appendChild(text);
  }
}

// removeLogo makes it possible to remove the previously chosen logo
function removeLogo() {
  logoImg = false;
  // Remove 'remove logo' link and logo image
  var container = document.getElementById('removeLogo');
  container.removeChild(container.lastChild);
  var container = document.getElementById('activeLogo');
  container.removeChild(container.lastChild);
  // Add choose logo option
  var link = document.createElement('a');
  link.setAttribute("href", "#");
  link.setAttribute("onClick", "logoChooser()");
  container.appendChild(link);
  var text = document.createTextNode(userText.chooseLogo);
  link.appendChild(text);
}
  
// parseFiguresFile parses the figures file and stores it in several
// arrays for fast retrieval
function parseFiguresFile () {
  var groupRegex = new RegExp('^F[0-9]');
  var figGroupSelector = document.getElementById('figureGroup');
  var figGroupNr = -1;
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
          } else rollbase = Array(splitLine[0].replace(/[\+\-]+/g, ''));
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
  // add the Queue 'figure group' at the end
  queueGroup = figGroupNr + 1;
  figGroup[queueGroup] = {'family':'*', 'name':userText.figureQueue};
  // add an option for the group to the figure selector
  var option = document.createElement('option');
  option.setAttribute('value', queueGroup);
  option.innerHTML = '* ' + userText.figureQueue;
  figGroupSelector.appendChild(option);
}

// parseRules walks through the rules file to find out which rules
// are available
function parseRules() {
  for (var i=0; i<rules.length; i++) {
    // Check for [section]
    if (rules[i].charAt(0) == '[') {
      var parts = rules[i].replace(/[\[\]]/g, '').split(" ");
      if (parts.length > 2) {
        // Seems like a valid section name. Set correct rule, cat and seq.
        var ruleName = parts[0];
        var rnLower = ruleName.toLowerCase();
        var seqName = parts[parts.length - 1];
        parts.splice(parts.length - 1, 1);
        parts.splice(0, 1);
        var catName = parts.join(' ');
        console.log('Parsing ' + rules[i]);
        if (!seqCheckAvail[rnLower]) {
          // check for glider. If so, remove 'glider-' in display name
          if (ruleName.match (/^glider-/)) {
            ruleName = ruleName.replace (/^glider-/, '');
          }
          seqCheckAvail[rnLower] = {'name':ruleName, 'cats':[]};
        }
        if (!seqCheckAvail[ruleName.toLowerCase()]['cats'][catName.toLowerCase()]) {
          seqCheckAvail[ruleName.toLowerCase()]['cats'][catName.toLowerCase()] = {'name':catName, 'seqs':[]};
        }
        seqCheckAvail[ruleName.toLowerCase()]['cats'][catName.toLowerCase()]['seqs'][seqName.toLowerCase()] = seqName;
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
      var listItem = document.createElement('li');
      listItem.innerHTML = seqCheckAvail[ruleName]['name'];
      el.appendChild(listItem);
    }
  }
  new combo('rules','#cc9','#ffc');
  changeCombo('rules');
}

// loadRules loads the rules for the active sequence and stores it in
// several arrays for fast retrieval
function loadRules(ruleName, catName, seqName) {
  // Set parseSection to true to match the global rules
  var parseSection = true;
  var ruleSection = ruleName + ' ' + catName + ' ' + seqName;
  ruleSection = ruleSection.toLowerCase();
  console.log ('Loading rules ' + ruleSection);
  var section = [];
  var sectionRegex = /[\[\]\(\)]/g;
  // First clear the arrays
  checkAllowRegex = [];
  checkAllowCatId = [];
  checkCatGroup = [];
  checkFigGroup = [];
  checkRule = [];
  defRules = [];
  checkConv = [];
  // Find the sections
  for (var i = 0; i < rules.length; i++) {
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      var name = rules[i].toLowerCase().replace (sectionRegex, '');
      if (section[name]) {
        // log duplicate sections
        console.log('* Error: duplicate section "' + name +
        '" at rulenr ' + i);
      } else {
        section[name] = i;
      }
    }
  }
  // Walk through the rules
  for (var i=0; i<rules.length; i++) {
    rules[i] = sanitizeSpaces(rules[i]);
    // Check for [section] or (section) to match sequence type specific rules
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      if (rules[i].replace(sectionRegex, '').toLowerCase() == ruleSection) {
        parseSection = true;
      } else {
        parseSection = false;
      }
    } else if (parseSection) {
      // when parseSection = true, continue
      // First we remove any spaces around '=', this makes parsing easier
      rules[i] = rules[i].replace(/ *= */g, '=');
      // We also remove spaces around : or ; except when it is a 'why-' line
      if (!rules[i].match(/^why-.+/)) {
        rules[i] = rules[i].replace(/ *: */g, ':');
        rules[i] = rules[i].replace(/ *; */g, ';');
      }
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
      } else if (rules[i].match(/^group-/)) {
      // Apply 'group' rules => single catalog id match
        var newGroup = rules[i].replace(/^group-/, '').split('=');
        checkCatGroup[newGroup[0]] = [];
        checkCatGroup[newGroup[0]]['regex'] = RegExp(newGroup[1] + '[0-9\.]*', '');
      } else if (rules[i].match(/^Group-/)) {
      // Apply 'Group' rules => full figure (multiple catalog id) match
        var newGroup = rules[i].replace(/^Group-/, '').split('=');
        checkFigGroup[newGroup[0]] = [];
        checkFigGroup[newGroup[0]]['regex'] = RegExp(newGroup[1] + '[0-9\.]*', 'g');
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
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['min'] = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['min'] = group[1];
      } else if (rules[i].match(/[^-]+-max=\d+$/)) {
      // Apply [group]-max rules
        var group = rules[i].replace(/-max/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['max'] = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['max'] = group[1];
      } else if (rules[i].match(/[^-]+-repeat=\d+$/)) {
      // Apply [group]-repeat rules
        var group = rules[i].replace(/-repeat/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['repeat'] = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['repeat'] = group[1];
      } else if (rules[i].match(/[^-]+-minperfig=\d+$/)) {
      // Apply [group]-minperfig rules
        var group = rules[i].replace(/-minperfig/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['minperfig'] = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['minperfig'] = group[1];
      } else if (rules[i].match(/[^-]+-maxperfig=\d+$/)) {
      // Apply [group]-maxperfig rules
        var group = rules[i].replace(/-maxperfig/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['maxperfig'] = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['maxperfig'] = group[1];
      } else if (rules[i].match(/[^-]+-name=.+$/)) {
      // Apply [group]-name rules
        var group = rules[i].replace(/-name/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['name'] = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['name'] = group[1];
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
          checkRule[newRuleName] = {'conv':checkRuleParts.substring(0,colonPos), 'less':parseInt(check.match(/^<(.*)/)[1])};
          //console.log (checkRule[newRuleName].less);
        } else if (check.match(/^\+</)) {
          checkRule[newRuleName] = {'conv':checkRuleParts.substring(0,colonPos), 'totalLess':parseInt(check.match(/^\+<(.*)/)[1])};
          //console.log (checkRule[newRuleName].totalLess);
        } else {
          checkRule[newRuleName] = {'conv':checkRuleParts.substring(0,colonPos), 'regex':RegExp(checkRuleParts.substring(colonPos + 1), 'g')};
        }
      } else if (rules[i].match(/^why-[^=]+=.+/)) {
        // Apply why-x rules
        var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why-/, '');
        if (checkRule[newRuleName]) checkRule[newRuleName]['why'] = rules[i].replace(/^[^=]+=/, '');
      } else if (rules[i].match(/^floating-point/)) {
        // Apply floating-point rules
        checkCatGroup.floatingPoint = rules[i].match(/[0-9]+/)[0];
      }
    }
  }
  // Check the loaded rules against the sequence, return log and display any alerts
  var log = checkRules();
  displayAlerts ();
  markFigures ();
  return log;
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
            if (group != 'k') {
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
              
              var rule = checkAllowCatId[arestiNr][ii];
              // check if this is a rule of form rule:nr
              var ruleSplit = rule.split(':');
              if ((ruleSplit[1] === j) || (ruleSplit.length == 1)) {
                rule = ruleSplit[0];

                log.push ('-basefig rule: ' + rule);
                // Apply conversions to the Aresti number before checking the rule
                //console.log(rule);
                //console.log(check);
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
  // check for total min/max K
  if (checkCatGroup['k']['min']) {
    if (figureK < checkCatGroup['k']['min']) checkAlert('k', 'min');
  }
  if (checkCatGroup['k']['max']) {
    if (figureK > checkCatGroup['k']['max']) checkAlert('k', 'max');
  }

  // Run checks on maximum and minimum occurrence of a group (catalog ID)
  // Go through all groups
  log.push ('====== Testing global repeat/min/max ======');
  for (group in checkCatGroup) {
    //console.log(group);
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
      if (checkCatGroup[group]['min']) {
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
      // show log page
      var log = checkRules();
      myWindow = window.open('',"printForms",'width=900,height=700,top=50' +
        ',location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
      myWindow.document.title = userText.showLog;
      myWindow.innerHTML = '';
      myWindow.document.write('<pre>');
      for (var i = 0; i < log.length; i++) {
        myWindow.document.write(log[i] + '\n');
      }
      myWindow.document.write('</pre>');
    } else {
      document.getElementById('alertBoxOverlay').setAttribute('style', '');
      div.classList.remove ('noDisplay');
      var content = '';
      if (rulesActive) {
        content = '<p>' + userText.checkingRules + ' : ' + rulesActive + '</p>';
      } else content = '<p>' + userText.noRules + '</p>';
      // get alerts from alert area
      var contentDiv = document.getElementById('checkSequenceContent');
      contentDiv.innerHTML = document.getElementById('alerts').innerHTML;
      // remove label and <br> (first three items)
      contentDiv.removeChild(contentDiv.firstChild);
      contentDiv.removeChild(contentDiv.firstChild);
      contentDiv.removeChild(contentDiv.firstChild);
      if (contentDiv.innerHTML == '') {
        if (rulesActive) {
          contentDiv.innerHTML = content + userText.sequenceCorrect;
        }
      } else {
        contentDiv.innerHTML = content + contentDiv.innerHTML;
      }
    }
  } else {
    document.getElementById('alertBoxOverlay').setAttribute('style', 'display:none;');
    div.classList.add ('noDisplay');
  }
}

// updateFigureSelectorOptions updates the figure chooser options
function updateFigureSelectorOptions (selectedOption) {
  var container = document.getElementById('figureSelectorOptionsDiv');
  // clear container
  while (container.childNodes.length > 0) container.removeChild (container.lastChild);
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
      // set default option to replace
      if (!selectedOption) selectedOption = 'figSelectorReplace';
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

// changeFigureGroup updates the figure group in the figure chooser
function changeFigureGroup(e) {
  var aresti = [];
  var figureGroup = e.value;
  var table = document.getElementById('figureChooserTable');
  var container = document.getElementById('figureSvgContainer');
  // figureSvg holds the figures for selection
  var svg = document.getElementById('figureChooserSvg');
  // set the correct size and row count for the figure thumbnails
  if (e.value != queueGroup) {
    var size = 72;
    var newRow = /\.[01]$/;
    var maxColCount = 4;
  } else {
    var size = 152;
    var newRow = /never/;
    var maxColCount = 2;
  }
  var colCount = 0;
  firstFigure = false;
  // clear the figureChooser table
  while (table.childNodes.length > 0) table.removeChild(table.lastChild);
  for (var i = 0; i < fig.length; i++) {
    if (fig[i]) {
      // Only draw figures that are in this group AND have not been
      // drawn before (e.g. 1j and j)
      if ((fig[i].group == figureGroup) && !inArray(aresti, fig[i].aresti)) {
        if (!fig[i].svg) {
          // The figure has not been drawn in this session, go ahead and draw it
          // first we take the original base and remove + and full/any roll symbols
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
          } else buildFigure ([i], figure, false, -1);
          var paths = figures[-1].paths;
          var aresti = figures[-1].aresti;
          for (j = paths.length - 1; j >= 0; j--) {
            if (paths[j].style == 'neg') {
              paths[j].style = 'chooserNeg';
            } else if (paths[j].style == 'pos') {
              paths[j].style = 'chooserPos';
            }
          }
          figures[-1] = {'paths': paths, 'aresti': aresti};
          // clear the svg
          prepareSvg(svg);
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
        if ((fig[i].aresti.match(newRow) && (fig[i].group != queueGroup)) || (colCount == 0)) {
          colCount = 0;
          var tr = document.createElement('tr');
          table.appendChild(tr);
        }
        colCount++;
        if (colCount >= maxColCount) colCount = 0;
        var td = document.createElement('td');
        tr.appendChild(td);
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.setAttribute('id', i);
        a.setAttribute('onmousedown', 'selectFigure(this);');
        a.innerHTML = fig[i].svg;
        td.appendChild(a);
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
        td.innerHTML += 'K:' + k;
        // add a 'remove' button to figures in queueGroup
        if (fig[i].group == queueGroup) {
          var a = document.createElement('a');
          a.setAttribute('href', '#');
          a.setAttribute('class', 'removeFromQueueButton');
          a.setAttribute('id', i);
          a.setAttribute('onmousedown', 'removeFromQueue(this);');
          a.innerHTML = '<img src="buttons/close.png">'; // set close button TO DO
          td.appendChild(a);
        }
        // add this figure's Aresti number to aresti variable so it
        // is not drawn twice
        aresti.push(fig[i].aresti);
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
  markMatchingFigures ();
  markNotAllowedFigures ();
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
  if (nextPattern) regexString = regexString + '[\\' + nextPattern[0] + ']$';
  var regex = new RegExp (regexString);
  var table = document.getElementById('figureChooserTable');
  var tr = table.childNodes;
  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].childNodes;
    for (var j = 0; j < td.length; j++) {
      if (fig[td[j].firstChild.id].pattern.match(regex)) {
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
      if ((sportingClass.value === 'powered') && (fig[td[j].firstChild.id].kpwrd == 0)) {
        td[j].classList.add ('figureNotAllowed');
      } else if ((sportingClass.value === 'glider') && (fig[td[j].firstChild.id].kglider == 0)) {
        td[j].classList.add ('figureNotAllowed');
      } else if (rulesActive) {
        if (Object.keys(checkAllowCatId).length > 0) {
          if (!(fig[td[j].firstChild.id].aresti in checkAllowCatId)) {
            td[j].classList.add ('figureNotAllowed');
          } else {
            td[j].classList.remove ('figureNotAllowed');
          }
        } else {
          td[j].classList.remove ('figureNotAllowed');
        }
      } else {
        td[j].classList.remove ('figureNotAllowed');
      }
    }
  }
}
  
// selectFigure is executed when clicking a figure in the figureChooser
// (e = object) or from grabFigure (e = figNr) or false
function selectFigure (e) {
  if ((e !== false) && !mobileBrowser) {
    // show figure editor tab
    selectTab ('tab-figureInfo');
  }
  var queueFigure = false;
  if (typeof e === 'object') {
    // use the string if provided (for Queue figures)
    if (fig[e.id].string) {
      figure = fig[e.id].string;
      queueFigure = e.id;
    } else {
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
    // See if a figure was grabbed already. If so, replace it
    var options = document.getElementById('figureSelectorOptions');
    if (options) {
      switch (options.value) {
        case 'figSelectorAddStart':
          // find the first figure and add before that one
          for (var i = 0; i < figures.length; i++) {
            if (figures[i].aresti) {
              updateSequence(i - 1, figure, false, true);
              setFigureSelected(i);
              break;
            }
          }
          break;
        case 'figSelectorAddBefore':
          updateSequence(selectedFigure.id - 1, figure, false, true);
          setFigureSelected(selectedFigure.id - 1);
          break;
        case 'figSelectorReplace':
          updateSequence(selectedFigure.id, figure, true, true);
          break;
        case 'figSelectorAddAfter':
          updateSequence(selectedFigure.id, figure, false, true);
          setFigureSelected(selectedFigure.id + 1);
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
  var elFT = document.getElementById('addFigureText');
  if (e !== false) {
    // e!==false => a figure is selected
    // hide the figure selector for mobile browsers, but highlight the
    // chosen figure in case the figure selector is shown again
    if (mobileBrowser) hideFigureSelector ();
    var table = document.getElementById('figureChooserTable');
    var selected = table.getElementsByClassName('selected');
    // remove selected class for all
    for (var i = 0; i < selected.length; i++) selected[i].classList.remove('selected');
    // add selected class to figure
    if (e.parentNode.classList) e.parentNode.classList.add ('selected');
    elFT.parentNode.setAttribute('class', "hoverdisplay");
    elFT.firstChild.innerHTML = userText.clickChangeFigure;
    
    // with figure loaded from queue, remove any unknown figure letters
    // and add queue unknown figure letter
    if (queueFigure) {
      var uf = fig[queueFigure].unknownFigureLetter;
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
    if (queueFigure) {
      setFigChooser(queueFigure);
    } else {
      setFigChooser(figures[selectedFigure.id].figNr);
    }
      
    // select the figure in the sequence text when we were not editing
    // in the text and we are not in the mobile version. Select all the
    // way back to the previous real figure
    if (!sequenceText.hasfocus && !mobileBrowser) {
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
    // hide the figure selector
    hideFigureSelector();
    // correctly set the figure change/edit block
    document.getElementById('selectedFigureSvg').innerHTML = "";
    elFT.parentNode.removeAttribute('class');
    elFT.firstChild.innerHTML = userText.clickAddFigure;
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
  // how much to take off and where
  if (checkCatGroup.floatingPoint) {
    var figK = [];
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) {
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
          if (connectors <= connectFig.max[document.getElementById('class').value]) {
            figK = connectFig.totalK[document.getElementById('class').value] / connectors;
          } else {
            figK = connectFig.totalK[document.getElementById('class').value] / connectFig.max[document.getElementById('class').value];
            alertMsgs.push ('(' + figNr + ') ' +
              userText.maxConnectors +
              connectFig.max[document.getElementById('class').value]);
          }
          drawText ('Conn.', blockX + 4, (topBlockY + blockY) / 2 + 16, 'miniFormA');
        } else {
          drawText (figures[i].unknownFigureLetter, blockX + 4, (topBlockY + blockY) / 2 + 16, 'miniFormA');
        }
      } else {
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 10, 'miniFormA');
      }
      // adjust figure K for floating point
      if (figures[i].floatingPoint) {
        if (topBlockY == blockY) blockY += 12;
        drawText ('(' + figK + ')', blockX + 130, (topBlockY + blockY) / 2 + 15, 'miniFormASmall');
        figK = figK - 1;
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
      figureK = figureK + figK;
      blockY += 12;
    }
  }
  drawText ('Total K = ' + figureK, blockX + 4, blockY + 17, 'miniFormATotal');
  drawRectangle (blockX, blockY, 152, 24, 'pos');
  return {'width':152, 'height':(blockY + 24) - y};
}

// markFigureStarts puts an image with a hover link at the figure start
// The hover link will light up the complete figure upon hover through mouseOverFigureStart
function markFigureStarts (dx,dy) {
  var container = document.getElementById("svgContainer");
  for (var i = 0; i < figureStart.length; i++) {
    var left = parseInt(figureStart[i]['x'] + dx - lineElement + 3)
    var top = parseInt(figureStart[i]['y'] + dy - lineElement + 3)
    var style = 'left:' + left + 'px;top:' + top + 'px;'
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("version", "1.2");
    svg.setAttribute("baseProfile", "tiny");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("class", 'figureStart');
    svg.setAttribute("id", 'figureStart' + (i + 1));
    svg.setAttribute("width", lineElement2 + 'px');
    svg.setAttribute("height", lineElement2 + 'px');
    svg.setAttribute("style", style);
    svg.setAttribute("draggable", 'true');
    var circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', lineElement);
    circle.setAttribute('cy', lineElement);
    circle.setAttribute('r', lineElement - 4);
    circle.setAttribute('stroke', 'transparent');
    circle.setAttribute('stroke-width', 4);
    circle.setAttribute('fill', 'transparent');
    svg.appendChild(circle);
    container.appendChild(svg);
  }
}

// mouseOverFigureStart will highlight the figure over the start of
// which the mouse hovers
function mouseOverFigureStart(e) {
  var circle = e.lastChild;
//  circle.setAttribute('stroke', 'magenta')
  X = e.offsetLeft;
  Y = e.offsetTop;
  id = e.getAttribute('id').replace ('figureStart', '');
  // Draw magenta figure svg
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("version", "1.2");
  svg.setAttribute("baseProfile", "tiny");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("id", 'selectFigure');
  svg.setAttribute("style", 'top:9px;left:10px;');
  svg.setAttribute("width", '800px');
  svg.setAttribute("height", '800px');

  // Pass through the figures and find the correct one
  var figNr = 1;
  for (var i = 0; i < figures.length; i++) {
    var aresti = figures[i].aresti
    // Only count real figures, no drawing instructions
    if (aresti) {
      if (figNr == id) {
        var paths = figures[i].paths
        for (var j = 0; j < paths.length; j++) {
          drawShape (paths[j], svg, true)
        }
        break; // figure drawn, break for loop
      }
      figNr ++
    }
  }
  var container = document.getElementById("svgContainer");
  container.appendChild(svg)
}

// mouseOutFigureStart will un-hightlight the figure after the mouse leaves hover
function mouseOutFigureStart(e) {
  var container = document.getElementById("svgContainer");
  var circle = e.lastChild;
//  circle.setAttribute('stroke', 'transparent');
  var id = document.getElementById('selectFigure')
  if (id) container.removeChild(id);
}

/**********************************************************************
 * 
 * Functions for drag & drop repositioning
 * 
 **********************************************************************/
 
// grabFigure will select a figure and allow dragging
function grabFigure(evt) {
   // find out which element we moused down on
   var targetElement = evt.target.parentNode;

   // only drag real sequence figures
   if (targetElement.id.match(/^figure[0-9]/)) {
     if ( figures[targetElement.id.replace('figure', '')].draggable ) {
        //set the item moused down on as the element to be dragged
        DragTarget = targetElement;
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
}

// setFigureSelected sets the active figure and applies color filter
function setFigureSelected (figNr) {
  // if any figure was previously selected, remove that filter
  var selFig = SVGRoot.getElementById('figure'+selectedFigure.id);
  if (selFig) selFig.removeAttribute('filter');
  // fill selectedFigure with BBox values
  var selFig = SVGRoot.getElementById('figure'+figNr);
  if (selFig) selectedFigure = selFig.getBBox();
  // set selectedFigure.id
  selectedFigure.id = figNr;

  if (figNr !== null) {
    // define header element for info
    var header = document.getElementById('figureHeader');
    header.innerHTML = userText.editingFigure + figures[figNr].seqNr;
  
    // apply color filter
    var figure = SVGRoot.getElementById('figure'+figNr);
    figure.setAttribute('filter', 'url(#selectFilter)');
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
      // exact place we grabbed it... this way, the drag will look more natural
      var newX = TrueCoords.x - GrabPoint.x;
      var newY = TrueCoords.y - GrabPoint.y;

      // apply a new tranform translation to the dragged element, to display
      //    it in its new location
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
      
      // create new moveTo for dragged elements when not in grid view
      if (transform && (activeForm !== 'Grid')) {
        var dxdy = transform.match(/[0-9\-\.]*,[0-9\-\.]*/)[0].split(',');
        var dx = parseInt(dxdy[0] / lineElement)
        var dy = parseInt(dxdy[1] / lineElement)
        // reverse direction for dragging in Form C
        if (activeForm === 'C') dx = -dx;
        updateSequence (DragTarget.id.replace('figure', '') - 1, '[' + dx + ',' + dy + ']', false)
      }
      
      // set the global variable to null, so nothing will be dragged until we
      //    grab the next element
      DragTarget = null;
   }
  if (!mobileBrowser) sequenceText.focus();
}

/**********************************************************************
 * 
 * Functions for point & click altering of the sequence
 * 
 **********************************************************************/
 
// changeEntryDirection alters the entry direction of the sequence
function changeEntryDirection (code) {
  // entryOptions are in reverse order of displayed
  var entryOptions = {'eja': 'X-box entry (away)', 'ej': 'X-box entry', 'ed': 'Downwind entry', '': 'Upwind entry'}
  updateSequenceOptions ('');
  if (activeSequence.figures[0]) {
    if (entryOptions[activeSequence.figures[0].string]) {
      updateSequence(0, code, true)
    } else updateSequence(-1, code);
  } else updateSequence(-1, code);
}

// flipYAxis will flip the drawn direction of the Y axis
function flipYAxis () {
  if (activeSequence.text.match(regexFlipYAxis)) {
    // disable flip
    sequenceText.value = sequenceText.value.replace(regexFlipYAxisReplace, '$1$2');
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
// active start of the sequence. The active start is NOT displayed as an option
function updateSequenceOptions (code) {
  // entryOptions are in reverse order of displayed
  var entryOptions = {'eja': 'X-box entry (away)', 'ej': 'X-box entry', 'ed': 'Downwind entry', '': 'Upwind entry'}
  el = document.getElementById('sequenceOptions');
  // create a nodeList and remove the items of the nodelist
  var options = el.getElementsByClassName('entryOption');
  while (options[0]) el.removeChild(options[0]);

  for (key in entryOptions) {
    if (code != key) {
      var li = document.createElement('li');
      li.setAttribute ('class', 'entryOption');
      var a = document.createElement('a');
      a.setAttribute ('href', '#');
      a.setAttribute ('onClick', 'changeEntryDirection(\'' + key + '\');');
      a.innerHTML = entryOptions[key];
      li.appendChild(a);
      el.insertBefore(li, el.firstChild);
    }
  }
}

// clearPositioning removes all figure positioning elements
function clearPositioning () {
  // only do this when on Form B or C
  if ((activeForm === 'B') || (activeForm === 'C')) {
    // confirm clearing the position formatting
    if (!confirm (userText.separateFigures)) return;
    // make sure no figure is selected
    selectFigure (false);
    // remove all moveTo, curveTo and moveForward figures
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
        updateSequence (i, '', true);
        i--;
      }
    }
    return true;
  } else {
    alertBox (userText.notOnFormBC);
    return false;
  }
}

// separateFigures separates all the figures from each other
function separateFigures () {
  // Only do anything clearPositioning returns true
  if (clearPositioning()) {
    // start a loop that will continue until nothing's done any more
    do {
      var breakLoop = false;
      var i = 1;
      // start going through the figures from the second figure
      while ((i < figures.length) && !breakLoop) {
        // get the bBox set for the figure
        var bBox = figures[i].bBox;
        // only real (draggable) figures have a bBox
        if (bBox) {
          var moveDown = 0;
          var boxTop = bBox.y;
          var boxBottom = bBox.y + bBox.height;
          var boxLeft = bBox.x;
          var boxRight = bBox.x + bBox.width;
          do {
            var repeat = false;
            for (var j = i - 1; j >= 0; j--) {
              var bBoxJ = figures[j].bBox;
              if (bBoxJ) {
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
            updateSequence(i - 1, '[0,' + moveDown + ']', false);
            breakLoop = true;
          }
        }
        i++;
      }
    } while (breakLoop);
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
  if ((selectedFigure.id === i) && draggable) {
    group.setAttribute('filter', 'url(#selectFilter)');
  }
  // put the group in the DOM
  svgElement.appendChild(group);
  for (var j = 0; j < paths.length; j++) {
    drawShape (paths[j], group);
  }
  if (draggable) {
    figures[i].bBox = group.getBBox();
  }
}

// showQueue shows the figure queue
function showQueue () {
  var select = document.getElementById ('figureGroup');
  var options = select.options;
  select.selectedIndex = queueGroup;
  changeFigureGroup(options[queueGroup]);
  showFigureSelector();
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
    if (fig[i].group == queueGroup) {
      if (fig[i].aresti == aresti) {
        alertBox (userText.figureAlreadyInQueue);
        return;
      }
      i--;
    } else break;
  }
  // append the figure to the fig array
  fig[figLen] = {'base':fig[figNr].base,
                'rolls':fig[figNr].rolls,
                'draw':fig[figNr].draw,
                'pattern':fig[figNr].pattern,
                'kpwrd':fig[figNr].kpwrd,
                'kglider':fig[figNr].kglider};
  fig[figLen].aresti = aresti;
  // add properties
  fig[figLen].unknownFigureLetter = f.unknownFigureLetter;
  // set queue group nr
  fig[figLen].group = queueGroup;
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
  fig[figLen].string = string;
  showQueue();
}

// removeFromQueue removes a figure from the queue
function removeFromQueue (e) {
  delete fig[e.id];
  showQueue();
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
    var columnWidths = Array(20, 100, 70, 30, 60, 40, 40, 260);
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
    drawRectangle (x, 0, columnTitles[i].split(':')[1], columnTitleHeight, 'FormLine')
    drawText (columnTitles[i].split(':')[0], x + columnTitles[i].split(':')[1] / 2, columnTitleHeight / 2, 'FormAText', 'middle')
    x = x + parseInt(columnTitles[i].split(':')[1])
  }
  var y = columnTitleHeight;
  var row = 0
  figureK = 0
  for (var i = 0; i < figures.length; i++) {
    // reduce rowheight for last one so border fits within height 1000
    if (row == (figNr - 1)) rowHeight = rowHeight - 2;
    // find Aresti nr(s) and k(s) for figure
    var aresti = figures[i].aresti
    var k = figures[i].k
    // only draw if there is a (fake) aresti number
    if (aresti) {
      var x = 0
      if (iacForms) var colCount = 8; else var colCount = 9;
      for (var column = 0; column < colCount; column++) {
        switch (column) {
          case (0):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
            drawText (row + 1, x + columnWidths[column] / 2, y + rowHeight / 2, 'FormATextBold', 'middle')
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
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine');
            // set the font size from 8-13 depending on the amount of Aresti nrs
            var fontsize = parseInt(rowHeight / (aresti.length + 1));
            if (fontsize < 8) fontsize = 8;
            if (fontsize > 13) fontsize = 13;
            for (var j = 0; j < aresti.length; j++) {
              drawText (aresti[j], x + columnWidths[column] / 2, y + (j + 1) * fontsize, 'FormATextBold' + fontsize + 'px', 'middle')
            }
            break;
          case (3):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine');
            var figK = 0;
            // set the font size from 8-13 depending on the amount of Aresti nrs
            var fontsize = parseInt(rowHeight / (aresti.length + 1));
            if (fontsize < 8) fontsize = 8;
            if (fontsize > 13) fontsize = 13;
            for (var j = 0; j < aresti.length; j++) {
              drawText (k[j], x + columnWidths[column] / 2, y + (j + 1) * fontsize, 'FormATextBold' + fontsize + 'px', 'middle');
              figK = figK + parseInt(k[j]);
            }
            if (figures[i].connector) {
              if (connectors <= connectFig.max[document.getElementById('class').value]) {
                figK = connectFig.totalK[document.getElementById('class').value] / connectors;
              } else {
                figK = connectFig.totalK[document.getElementById('class').value] / connectFig.max[document.getElementById('class').value];
                alertMsgs.push ('(' + (row + 1) + ') ' +
                  userText.maxConnectors +
                  connectFig.max[document.getElementById('class').value]);
              }
            }
            break;
          case (4):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine');
            if (figures[i].floatingPoint) {
              drawText ('(' + figK + ')', x + columnWidths[column] / 2, y + rowHeight / 2 + 10, 'FormAText', 'middle');
              figK = figK - 1;
              drawText (figK, x + columnWidths[column] / 2, y + rowHeight / 2 - 8, 'FormATextLarge', 'middle');
            } else {
              drawText (figK, x + columnWidths[column] / 2, y + rowHeight / 2, 'FormATextLarge', 'middle');
            }            
            var superFamily = getSuperFamily (aresti, document.getElementById('category').value);
            if (superFamily) {
              drawText('SF ' + superFamily,  x + columnWidths[column] / 2, y + rowHeight - 10, 'FormAText', 'middle');
            }
            // check if mark as connector or specific unknown figure
            if (figures[i].connector) {
              drawText('connect',  x + columnWidths[column] / 2, y + 15, 'FormAText', 'middle');
            } else if (figures[i].unknownFigureLetter) {
              drawText('Fig ' + figures[i].unknownFigureLetter,  x + columnWidths[column] / 2, y + 15, 'FormAText', 'middle');
            }
            figureK = figureK + figK;
            break;
          case (5):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
            drawLine (x, y, 0, rowHeight, 'FormLineBold')
            break;
          case (6):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
            break;
          case (7):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
            break;
          default:
            drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
        }
        if (column == (colCount - 1)) drawLine (x + columnWidths[column], y, 0, rowHeight, 'FormLineBold')
        if ((row == 0) && (column > 4)) drawLine (x, y, columnWidths[column], 0, 'FormLineBold');
        if ((row == (figNr - 1)) && (column > 4)) {
          drawLine (x, y + rowHeight, columnWidths[column], 0, 'FormLineBold');
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
    if (figures[i].paths.length) drawFullFigure(i, figures[i]['paths'][0]['figureStart']);
  }
  addFormElements ('B');
}

// makeFormC creates Form C from the figures array
function makeFormC() {
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].paths.length) drawFullFigure(i, figures[i]['paths'][0]['figureStart']);
  }
  addFormElements ('C');
}

// makeFormGrid creates a grid of figures
function makeFormGrid (cols) {
  var svg = SVGRoot;
  // width = 800
  var cw = parseInt(800 / cols);
  var ch = parseInt(cw * Math.GR);
  var x = 0;
  var y = 0;
  var col = 0;
  var scaleMin = 100; // high number, will hold the smallest Fig scale
  // draw all real figures
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) {
      var f = figures[i];
      // draw rectangle
      drawRectangle (x, y, cw, ch, 'FormLine', svg);
      // draw figure Ks, Arestis and Figure Letter
      var textWidth = 0;
      var figK = 0;
      var yy = y + ch - 10;
      for (var j = f.k.length - 1; j>=0; j--) {figK += parseInt(f.k[j])};
      drawText('K: ' + figK,  x + 10, yy, 'FormATextBold', 'start');
      for (var j = f.k.length - 1; j>=0; j--) {
        yy -= 15;
        drawText(f.aresti[j] + '(' + f.k[j] + ')',  x + 10, yy, 'FormAText', 'start', 'Fig' + i + 'Aresti' + j, svg);
        var tw = svg.lastChild.getBBox().width;
        if (tw > textWidth) textWidth = tw;
      }
      if (figures[i].unknownFigureLetter) {
        yy -= 15;
        drawText('Fig ' + f.unknownFigureLetter,  x + 10, yy, 'FormATextBold', 'start');
      }
      
      // draw comments
      if (f.comments) {
        var paths = makeTextBlock (f.comments);
        // create group for comments
        var g = svg.appendChild(document.createElementNS (svgNS, 'g'));
        for (var j = 0; j < paths.length; j++) {
          // don't draw box, only text
          if (!paths[j].path) drawShape (paths[j], g);
        }
        var bBox = g.getBBox();
        // check if comments fit right of Aresti nrs, scale if necessary
        var scale = (cw - tw - 40) / bBox.width;
        if (scale > 1) scale = 1;
        if (scale < 0.67) {
          // would get too small, put above Aresti nrs and scale to
          // column width, upto factor 0.67
          scale = (cw - 40) /bBox.width;
          if (scale > 1) scale = 1;
          if (scale < 0.67) scale = 0.67;
          yy -= (bBox.height + 10);
          g.setAttribute ('transform', 'translate(' +
            roundTwo(x - (bBox.x * scale) + 10) + ',' +
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
      figures[i].fh = fh;
      figures[i].viewScale = roundTwo(scale);
      thisFig.setAttribute ('transform', 'translate(' +
        figures[i].tx + ',' + 
        figures[i].ty + ') scale(' + 
        figures[i].viewScale + ')');
      x = x + cw;
      col++;
      if (col >= cols) {
        x = 0;
        col = 0;
        y = y + ch;
      }
    }
  }
  // update viewbox and svg height
  svg.setAttribute("viewBox", '-1 -1 802 ' + (y + ch + 2));
  svg.setAttribute("height", (y + ch));

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
    if (figures[i].paths.length) drawFullFigure(i, figures[i]['paths'][0]['figureStart']);
  }
}

// addFormElements adds wind & mini form A and adjusts size
function addFormElements (form) {
  // Find out how big the SVG has become and adjust margins
  var bBox = SVGRoot.getBBox();
  x = parseInt(bBox['x']) ;
  y = parseInt(bBox['y']);
  w = parseInt(bBox['width']);
  h = parseInt(bBox['height']);
  y = y - 40;
  h = h + 40;
  switch (form) {
    case 'B':
      if (miniFormA) {
        drawWind ((w + x) + 172, y, 1);
      } else drawWind (w + x, y, 1);
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
  w = w + 20 + block.width;
  if ((50 + block.height) > h) h = (50 + block.height);
  // Change the viewBox to make the sequence fit
  viewBox = (x - 3) + ' ' + (y - 3) + ' ' + (w + 5) + ' ' + (h + 30);
  SVGRoot.setAttribute("viewBox", viewBox);
  // resize svg if we are on a mobile browser
  if (mobileBrowser) {
    var scaleSvg = 312 / (w + 5);
  } else scaleSvg = 1;
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
  firstFigure = true;
  Attitude = 0;
  X = 0;
  Y = 0;
  var content = ''
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
    if (cloneDiv.offsetHeight < 20) cloneDiv.innerHTML += '<br>.';
    var height = cloneDiv.offsetHeight;
    //if (height < 36) height = 36;
    sequenceText.setAttribute('style', 'height:' + height + 'px;');
    // also set the position of the "main" div
    document.getElementById('main').setAttribute ('style', 'top:' + (height - 14) + 'px;');
  } else {
    cloneDiv.innerHTML = '';
  }
}

// checkSequenceChanged is called by onInput or onKeyUp on the
// sequence input field to check if it has to be redrawn
function checkSequenceChanged () {
  // remove all line breaks from the sequence input field
  sequenceText.value = sequenceText.value.replace (/(\r\n|\n|\r)/gm, '');
  // update height of sequence text box for non-mobile browsers
  updateSequenceTextHeight();
  // read the sequence string and mark the location of the caret/selection
  var selStart = sequenceText.selectionStart;
  var selectFigureId = false;
  if (activeSequence.text != sequenceText.value) {
    activeSequence.text = sequenceText.value;
    var string = activeSequence.text;
    
    var figure = [];
    var thisFigure = {'string':'', 'stringStart':0, 'stringEnd':0};
    var inText = false;
    for (var i = 0; i <= string.length; i++) {
      if (string[i] == userpat.text) inText = !inText;
      if (((string[i] === ' ') || (i === string.length)) && !inText) {
        if (thisFigure.string !== '') {
          var match = thisFigure.string.match (regexMoveForward);
          // Create a separate 'figure' for moveForward (x>) at the beginning of a figure.
          // OLAN has it coupled to a figure but OpenAero keeps sequence drawing instructions separate
          if (match) {
            figure.push ({'string':match[0], 'stringStart':thisFigure.stringStart, 'stringEnd':(thisFigure.stringStart + match[0].length)});
            thisFigure.stringStart = thisFigure.stringStart + match[0].length;
            thisFigure.string = thisFigure.string.replace(regexMoveForward, '');
          }
          // do the same for moveDown (x^)
          var match = thisFigure.string.match (regexMoveDown);
          if (match) {
            figure.push ({'string':match[0], 'stringStart':thisFigure.stringStart, 'stringEnd':(thisFigure.stringStart + match[0].length)});
            thisFigure.stringStart = thisFigure.stringStart + match[0].length;
            thisFigure.string = thisFigure.string.replace(regexMoveDown, '');
          }          
          // only add figures that are not empty
          if (thisFigure.string != '') {
            figure.push ({'string':thisFigure.string, 'stringStart':thisFigure.stringStart, 'stringEnd':i});
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
    
    // Now assign to activeSequence      
    activeSequence.figures = figure;

    // Get current scroll position of the sequence
    var scrollPosition = SVGRoot.parentNode.scrollTop;
    
    // Update activeSequence.xml and cookie
    changeSequenceInfo();

    // Redraw sequence
    draw ();
    
    // Select the correct figure when applicable
    if ((selectFigureId !== false) && (selectedFigure.id !== null)) {
      selectFigure (selectFigureId);
    }
    
    // Set the correct scroll position
    SVGRoot.parentNode.scrollTop = scrollPosition;
    
    // Prevent OpenAero from being left unintentionally
    sequenceSaved = false;
    window.onbeforeunload = function(e){return userText.confirmLeave;}
        
    // Update figure editor when a figure is being edited
    if (selectedFigure.id !== null) updateFigureEditor();
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
  draw (form);
}

/******************************************
 * Functions for opening and saving files */

// clearSequence will start a new blank sequence
function clearSequence () {
  if (!sequenceSaved) {
    if (!confirm (userText.sequenceNotSavedWarning)) return;
  }
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
}
  
// openSequence will load a sequence from a .seq file
function openSequence () {
// Check if the current sequence was saved. If not, present a dialog
  if (!sequenceSaved) {
    if (!confirm (userText.sequenceNotSavedWarning)) return;
  }
  openFile(document.getElementById('file').files[0], 'Sequence');
  // Clear file field to enable loading the same file again
  document.getElementById('fileForm').reset();
}

// openSequence will load a sequence from a .seq file
function openQueue () {
  openFile(document.getElementById('queue').files[0], 'Queue');
  // Clear file field to enable loading the same file again
  document.getElementById('queueForm').reset();
}

// openFile is called to open a file
// file = file object from file input element
// handler = name of correct handler to execute after loading. Function names are loaded<handler>
function openFile (file, handler) {
  if(file){
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    // Handle success, and errors. With onload the correct loading function will be called
    reader.onload = eval ('loaded' + handler);
    reader.onerror = errorHandler;
  }
}

// checkMultiDialog shows or hides the multiple sequence check dialog
// when false, the dialog is closed
function checkMultiDialog(show) {
  var div = document.getElementById('checkMulti');
  if (show) {
    document.getElementById('alertBoxOverlay').setAttribute('style', '');
    div.classList.remove ('noDisplay');
    var el = document.getElementById('multiCurrentRules');
    if (rulesActive) {
      el.innerHTML = rulesActive;
    } else {
      el.innerHTML = userText.none;
    }
  } else {
    document.getElementById('alertBoxOverlay').setAttribute('style', 'display:none;');
    div.classList.add ('noDisplay');
  }
}

// checkMulti is called to open multiple files for checking.
// files = file object from multi file input element
function checkMulti (evt) {
  // check if checkMulti was called from a file drop
  if (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; // FileList object.
  } else {  
    // get files from file element
    var el = document.getElementById('checkMultiFiles');
    var files = el.files;
    // clear for next
    el.files = '';
  }
  // save active sequence
  multi.savedSeq = activeSequence.xml;
  // set counter and limit
  multi.count = 0;
  multi.total = files.length;
  // open the window and close it. This will clear any previous window
  var myWindow = window.open('',"Check Multiple Sequences");
  myWindow.close();
  // now open for new output
  myWindow = window.open('',"Check Multiple Sequences",'width=900,height=700,top=50' +
    ',location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
  myWindow.document.title = userText.showLog;
  // go through the selected files
  for (var i = 0, f; f=files[i];i++){
    (function (file) {
      var reader = new FileReader();
      // Handle success, and errors. With onload the correct loading
      // function will be called
      reader.readAsText(file, "UTF-8");
      reader.file = file;
      reader.onload = loadedSequenceMulti;
      reader.onerror = errorMulti;
    })(f);
  }
  // hide dialog screen
  checkMultiDialog();
}

// finishMulti will be called when all sequences have been checked
function finishMulti () {
  // Clear file field to enable loading the same file again
  document.getElementById('checkMultiFileForm').reset();
  // restore saved sequence
  activateXMLsequence (multi.savedSeq);
  checkSequenceChanged();
}

// loadedSequenceMulti will be called when a sequence file has been loaded
// for multiple sequence checking
function loadedSequenceMulti(evt) {
  // check if loadedSequenceMulti is running. If so, set 100ms timeout
  // for next try
  if (multi.processing) {
    setTimeout (loadedSequenceMulti(evt), 100);
    return;
  } else multi.processing = true;
  console.log('Checking: ' + evt.target.file.name);
  // Obtain the read file data  
  var fileString = evt.target.result;
  // select the window
  var myWindow = window.open('',"Check Multiple Sequences");
  // Check if we have an OLAN sequence or an OpenAero XML sequence
  // If the sequence file starts with '<', assume it's an XML sequence
  if (fileString.charAt(0) === '<') {
    OLANBumpBugCheck = false;
  } else {
    // OLAN sequence, transform to XML
    fileString = OLANtoXML (fileString);
  }
  activateXMLsequence (fileString, true);
  // make sure no figure is selected
  selectFigure (false);
  // Draw the sequence
  checkSequenceChanged();

  // Activate the loading of the checking rules (if any)
  if (document.getElementById('multiOverrideRules').checked) {
    // use rules currently set
    var log = checkRules();
  } else {
    // use rules from file
    var log = changeCombo('program');
  }
  // write the log to the log window
  myWindow.document.write('<pre>');
  myWindow.document.write('File: ' + evt.target.file.name + '\n');
  if (document.getElementById('multiFullLog').checked) {
    // full expanded log
    
    for (var i = 0; i < log.length; i++) {
      myWindow.document.write(log[i] + '\n');
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
        myWindow.document.write ('Rules: ' + rulesActive + '\n');
        myWindow.document.write(userText.sequenceCorrect + '\n');
      } else {
        myWindow.document.write(userText.noRules + '\n');
      }
    } else {
      if (rulesActive) {
        myWindow.document.write ('Rules: ' + rulesActive + '\n');
      }
      myWindow.document.write('</pre>');
      myWindow.document.write(div.innerHTML);
      myWindow.document.write('<pre>');
    }
  }
  myWindow.document.write('--------------------------------------------------------\n');
  myWindow.document.write('</pre>');
  // clear any alert boxes. Errors are shown in the log.
  alertBox();
  // clear alert messages
  alertMsgs = [];
  // increase multi counter
  multi.count++;
  // done processing file
  multi.processing = false;
  if (multi.count == multi.total) finishMulti();
}

// errorMulti will be called when there is a multi file loading error
function errorMulti(e) {
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
  if (multi.count == multi.total) finishMulti();
}

// loadedSequence will be called when a sequence file has been loaded
function loadedSequence(evt) {
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
  activateXMLsequence (fileString);
  // make sure no figure is selected
  selectFigure (false);
  // Draw the sequence and change the browser title after loading
  checkSequenceChanged();
  // update the sequence if OLANSequence was true
  if (OLANSequence) {
    OLANSequence = false;
    updateSequence (-1, '');
    activeSequence.text = '';
    checkSequenceChanged();
  }
  // changeSequenceInfo();
  sequenceSaved = true;
  window.onbeforeunload = null;

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
  // save current sequence when the string is not empty
  if (sequenceText.value != '') {
    var sequence = activeSequence.xml;
  }
  // clear queue
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i]) {
      if (fig[i].group == queueGroup) {
        delete fig[i];
      } else break;
    }
  }
  // put the figures in the queue
  activateXMLsequence (fileString);
  // put a subsequence symbol between all figures to make sure no
  // attitude autocorrect is done
  sequenceText.value = sequenceText.value.replace(/ /g, ' // ');
  checkSequenceChanged();
  for (var i = 0; i < figures.length; i++) {  
    if (figures[i].aresti) {
      selectedFigure.id = i;
      addToQueue();
    }
  }
  selectFigure (false);
  // restore previous sequence or start with empty
  if (sequence) {
    activateXMLsequence (sequence);
  } else sequenceText.value = '';
  checkSequenceChanged();
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
    // end with oa_version 1.2.4 to prevent message about drawing
    string += '<oa_version>1.2.4</oa_version></sequence>';
    OLANBumpBugCheck = true;
    return string;
}

// activateXMLsequence will make a sequence provided as XML active
function activateXMLsequence (xml, noLoadRules) {
  // clear previous values
  for (var i = 0; i < sequenceXMLlabels.length; i++) {
    document.getElementById(sequenceXMLlabels[i]).value = '';
  }
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
  logo = document.getElementById('logo').value;
  if (logoImages[logo]) selectLogo(logo);
  checkOpenAeroVersion();
  // hide Harmony field for powered
  var el = document.getElementById ('harmonyField');
  if (sportingClass.value === 'powered') {
    el.setAttribute('style', 'opacity:0;');
  } else el.removeAttribute('style');
  // load rules when applicable and update sequence data
  if (!noLoadRules) changeCombo('rules');
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
  if (oa_version.value == '') {
    // before 1.2.3
    if (sequenceText.value != '') alertBox(userText.warningPre123);
  } else if (compVersion (oa_version.value, '1.2.4') < 0) {
    if (sequenceText.value.match (/(b|pb)(b|pb)/)) {
      alertBox(userText.warningPre124);
    }
  }
  // add any additional checks through else if ...
  // compVersion can be used to check against specific minimum versions
  
  // set version to current version for subsequent saving
  oa_version.value = version;
}

// compVersion compares two versions and returns:
// -1 when v1 < v2
// 1 when v1 > v2
// 0 when v1 = v2
// this function assumes a 3-digit version number without letters!
function compVersion (v1, v2) {
  var subV1 = v1.split('.');
  var subV2 = v2.split('.');
  for (var i = 0; i < 3; i++) {
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
    alert (userText.unknownFileType);
  }
}

// saveFile saves a file
// The function returns true if the file was saved
function saveFile(data, name, filter, format) {
  // Set saving result to true always as we currently have no method of
  // knowing whether the file was saved or not
  var result = true;
  savefile.data = data;
  savefile.name = name;
  savefile.format = format;
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    var http = true;
  } else var http = false;
  if (http) {
    var waitTime = 2000;
  } else {
    var waitTime = 10;
  }
  // Try to save the file through a bounce from PHP
  // We use an XMLHttpRequest to determine if we are online
  var xhr = new XMLHttpRequest();
  
  // Set a timer to waitTime. When this activates there is no or bad
  // internet access
  var noResponseTimer = setTimeout(function() {
    xhr.abort();
    // Present an alert box with a download link for the file
    // Less gracious than through PHP bounce but only other option for now
    
    // Transform utf8 to base64, otherwise handling in the data URI might not work well
    if (RegExp(';utf8$').test(format)) {
      format = format.replace('utf8', 'base64');
      data = btoa(data);
    }
    // build HTML for alert box
    var html = '<p>' + userText.downloadWarning + '<br />';
    // check for support of "download" attribute on <a>
    var a = document.createElement('a');
    if (typeof a.download != "undefined") {
      // supported
      html += userText.downloadHTML5 + '</p>';
    } else {
      // not supported
      html += userText.downloadLegacy + '</p>';
    }
    html += '<input type="text" value="' + name + '" ' +
      'onKeyUp="document.getElementById(\'dlButton\').setAttribute(\'download\', this.value);" ' +
      'id="dlTextField">' +
      '<div class="textButton"><a download="' + name +
      '" href="data:' + format + ',' + data + '" ' +
      'id="dlButton">' + userText.download + '</a></div>';
    alertBox(html);
  }, waitTime);

  if (http) {
  
    // Set event for XMLHttpRequest state change
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) {
        return;
      }
      if (xhr.status == 200) {
        clearTimeout(noResponseTimer);
        // Giving IE a chance to build the DOM in
        // the iframe with a short timeout:
    
        setTimeout(function(){
          // prevent asking confirmation of 'leaving'
          window.onbeforeunload = null;
    
          var form = document.getElementById("saveFileForm");
    
          form.elements["data"].value = data;
          form.elements["name"].value = name;
          form.elements["format"].value = format;
          // Submitting the form to openaero.php. This will
          // cause the file download dialog box to appear.
          form.submit();
          if (!sequenceSaved) {
            // Prevent OpenAero from being left unintentionally
            window.onbeforeunload = function(e){return userText.confirmLeave;}
          }
        },50);
      }
  
    }
    
    // Send request
    xhr.open("GET", 'openaero.php');
    xhr.send();
  }
  return result;
}

// saveSequence will save a sequence to a .seq file
// the .seq file is standard xml, so not OLAN compatible
function saveSequence () {
  var fileName = document.getElementById('location').value+' '+
    document.getElementById('category').value+' '+
    document.getElementById('program').value+' '+
    document.getElementById('pilot').value;
  fileName = fileName.replace(/^\s+|\s+$/g, '');
  if (fileName === '') fileName = 'sequence';
  // take the original sequence XML, remove the end tag and add it again
  // after the figure XML. Then beautify the output.
  var xml = vkbeautify.xml(activeSequence.xml.replace('</sequence>', '') +
    buildFigureXML() +
    '</sequence>');
  if (saveFile (xml, fileName + '.seq', {'name':'OpenAero Sequence', 'filter':'*.seq'}, 'text/xhtml+xml;utf8')) {
    sequenceSaved = true;
    window.onbeforeunload = null;
  } else {
    sequenceSaved = false;
    // Prevent OpenAero from being left unintentionally
    window.onbeforeunload = function(e){return userText.confirmLeave;};
  }
}

// saveQueue will save the current queue to a .seq file
// the .seq file is standard xml, so not OLAN compatible
function saveQueue () {
  var sequenceString = sequenceText.value;
  var queueFigs = [];
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i]) {
      if (fig[i].group == queueGroup) {
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
  checkSequenceChanged();
  var fileName = document.getElementById('location').value+' '+
    document.getElementById('category').value+' '+
    document.getElementById('program').value+' '+
    document.getElementById('pilot').value;
  fileName = fileName.replace(/^\s+|\s+$/g, '');
  fileName += 'QUEUE';
  // prevent "leaving" warning
  window.onbeforeunload = null;
  if (saveFile (activeSequence.xml, fileName + '.seq', {'name':'OpenAero Queue', 'filter':'*.seq'}, 'text/xhtml+xml;utf8')) {
    alertBox(userText.queueSaved);
  } else {
    alertBox(userText.queueNotSaved);
  }
  if (!sequenceSaved) {
    // Prevent OpenAero from being left unintentionally
    window.onbeforeunload = function(e){return userText.confirmLeave;};
  }
  // restore sequence
  sequenceText.value = sequenceString;
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
  var url = 'http://openaero.net?sequence=' + encodeURI(activeSequence.xml);
  alertBox (userText.saveAsURL + '<br />' +
    '<a href="' + url + '">' + url + '</a>', userText.saveAsURLTitle);
}

/********************************
 * Functions for handling cookies
 */
 
function setCookie(c_name,value,exdays) {
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays === null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
  var i,x,y,ARRcookies=document.cookie.split(";");
  for (i=0;i<ARRcookies.length;i++) {
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x === c_name) return unescape(y);
  }
}

/********************************
 * Functions for printing
 */

// printAllForms will print forms A,B and C. This can also be used to output them to PDF
function printAllForms () {
  // make sure no figure is selected
  selectFigure (false);
  var activeFormSave = activeForm;
  // get options from printDialog
  iacForms = document.getElementById('iacForms').checked;
  // save the miniFormA value and set miniFormA depending on checkbox
  if (miniFormA) {
    var miniFormASave = true;
  } else var miniFormASave = false;
  // hide print dialog
  printDialog();
  // Open a new window for the print
  myWindow = window.open('',"printForms",'width=900,height=700,top=50' +
    ',location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
  var fileName = document.getElementById('location').value+' '+
    document.getElementById('category').value+' '+
    document.getElementById('program').value+' '+
    document.getElementById('pilot').value;
  fileName = fileName.replace(/^\s+|\s+$/g, '');
  if (fileName === '') fileName = 'sequence';
  myWindow.document.title = fileName;
  var pages = ['A', 'B', 'C', 'PilotCards', 'Grid'];
  myWindow.document.write('<html><head><style type="text/css"' +
    'media="print">body {margin: 0px;}' +
    '.breakAfter {display:block; page-break-after:always;}' +
    'svg {height: 100%; page-break-inside:avoid;}' +
    '</style></head><body>')
  for (var i = 0; i < pages.length; i++) {
    if (document.getElementById('printForm' + pages[i]).checked) {
      activeForm = pages[i];
      if ((activeForm == 'B') && document.getElementById('printMiniFormAonB').checked) {
        miniFormA = true;
      } else if ((activeForm == 'C') && document.getElementById('printMiniFormAonC').checked) {
        miniFormA = true;
      } else miniFormA = false;
      // set correct drawing Form for pilot cards
      if (activeForm == 'PilotCards') {
        if (document.getElementById('pilotCardFormB').checked) {
          activeForm = 'B';
        } else activeForm = 'C';
      }
      draw ();
      // reset activeForm for buildPrintForm
      activeForm = pages[i];
      if (i < (pages.length - 1)) {
        var divClass = 'breakAfter';
      } else var divClass = '';
      myWindow.document.write('<div class="' + divClass + '">' +
        buildPrintForm (SVGRoot) + '</div>');
    }
  }
  myWindow.document.write('</body></html>');
  // use setTimeout for printing to prevent blocking and
  // associated warnings by the browser
  setTimeout (function(){myWindow.print();  myWindow.close();
}, 100);
  // Reset the screen to the normal view
  activeForm = activeFormSave;
  if (miniFormASave) miniFormA = true; else miniFormA = false;
  draw ();
}

// buildPrintForm will build a complete SVG string for printing a form
// from a provided SVG object and activeForm global.
// The default size of the page is A4, 800x1130
function buildPrintForm (svg) {
  // remove all elements that have className figStartCircle from the svg.
  // Otherwise they may show up as big black circles
  var el = svg.getElementsByClassName('figStartCircle');
  var count = el.length;
  for (var i = 0; i < count; i++) el[0].parentNode.removeChild(el[0]);

  var bBox = svg.getBBox();
  
  // don't change any layout for Grid or pilotCards view
  if ((activeForm !== 'Grid') && (activeForm !== 'PilotCards')) {
    // Find the size and adjust scaling if necessary, upscaling to a maximum factor of 2
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
      // set the maximum scale to three
      var maxScale = 3;
  
      // remove wind arrow
      var el = svg.getElementById('windArrow');
      if (el) el.parentNode.removeChild(el);
      
      // For form A we need to add the righthand scoring column, so
      // max width = 580
      if (activeForm === 'A') {
        var scale = 580 / w;
        var marginTop = 130;
      } else {
        var scale = 700 / w;
        var marginTop = 120;
        // Insert box containing sequence
        drawRectangle (0, 126, 740, 950, 'FormLine', svg);
      }
      // check for max height
      if ((maxHeight / h) < scale) {
        scale = maxHeight / h;
        if (scale > maxScale) scale = maxScale;
        // height limited, so we can move the sequence right for centering
        moveRight = ((700 - (w * scale)) / 2) + 15;
        if (moveRight < 15) moveRight = 15;
      } else if (scale > maxScale) scale = maxScale;
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
  
        svg.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox['x'] * scale)) + ',' + (marginTop - bBox['y']*scale) +
          ') scale(' + xScale + ',' + scale + ')');
        svg.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');
      } else {
        svg.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox['x'] * scale)) + ',' + (marginTop - bBox['y']*scale) +
          ') scale(' + scale + ')');
      }
      
      // rebuild wind arrow in the correct place
      if (activeForm === 'B') {
        drawWind (740, 110, 1, svg);
      } else if (activeForm === 'C') {
        drawWind (0, 110, -1, svg);
      }
    
      svg.setAttribute("viewBox", '-5 -5 810 1140');
      svg.setAttribute("width", '100%');
      // Add all necessary elements
      if (logoImg) {
        if (activeForm === 'A') {
          var logoSvg = buildLogoSvg(logoImg, 610, 930, 110, 110);
        } else {
          var logoSvg = buildLogoSvg(logoImg, 0, 10, 80, 100);
        }        
        svg.appendChild(logoSvg);
      }
      buildPrintHeader (svg);
      if (activeForm === 'A') {
        buildPrintScoreColumn (svg);
        buildPrintCornertab (svg);
      }
    } else {
      // CIVA forms
      var moveRight = 0;
      // set the maximum scale to two but take the tear-off tab in account
      // for Form C (defined by X + Y = 1620)
      if (!miniFormA) {
        var maxScale = 1620 / (w+h);
        if (maxScale > 2) maxScale = 2;
      } else var maxScale = 2;
      // For form A we need to add the righthand scoring column, so
      // max width = 620 (580 for IAC)
      if (activeForm === 'A') {
        var scale = 620 / w;
        var marginTop = 130;
      } else {
        var scale = 800 / w;
        var marginTop = 140;
      }
      // check for max height
      if ((maxHeight / h) < scale) {
        scale = maxHeight / h;
        if (scale > maxScale) scale = maxScale;
        // height limited, so we can move the sequence right for centering
        // limit this on tear-off tab
        moveRight = 1620 - ((w + h) * scale);
        if (moveRight < 0) moveRight = 0;
      } else if (scale > maxScale) scale = maxScale;
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
        svg.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');
  
        svg.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox['x'] * scale)) + ',' + (marginTop - bBox['y']*scale) +
          ') scale(' + xScale + ',' + scale + ')');
      } else {
        svg.getElementById('sequence').setAttribute('transform', 'translate(' +
          (moveRight - (bBox['x'] * scale)) + ',' + (marginTop - bBox['y']*scale) +
          ') scale(' + scale + ')');
      }
        
      svg.setAttribute("viewBox", '-5 -5 810 1140');
      svg.setAttribute("width", '100%');
      // Add all necessary elements
      var logoWidth = 0;
      if (logoImg) {
        var logoSvg = buildLogoSvg(logoImg, 0, 0, 200, 120);
        svg.appendChild(logoSvg);
        logoWidth = parseInt(logoSvg.getBBox().width) + 10;
      }
      buildPrintHeader (svg, logoWidth);
      if (activeForm === 'A') buildPrintScoreColumn (svg);
      buildPrintCornertab (svg);
    }
    // add sequence string when checked
    if ((activeForm === 'B') || (activeForm === 'C')) {
      if (document.getElementById('printString').checked) {
        drawTextArea (activeSequence.text, 10, 1085, 600, 40, 'sequenceString', '', svg);
      }
    }
    // add check result when checked
    if ((activeForm === 'B') || (activeForm === 'C')) {
      if (document.getElementById('printCheck').checked) {
        checkRules();
        var d = new Date();
        var text = userText.sequenceTest +
          d.getDay() + '-' +
          d.getMonth() + '-' +
          d.getFullYear() + ' ' +
          d.getHours() + ':' +
          d.getMinutes() + ' ' +
          'OpenAero ' + version + ' ';
        if (!alertMsgs.length) {
          drawText(text + userText.sequenceCorrect, 10, 1082, 'sequenceString', '', 'start', svg);
        } else {
          var y = 1082;
          for (var i = alertMsgs.length - 1; i>=0; i--) {
            drawText (alertMsgs[i], 10, y, 'sequenceString', '', 'start', svg);
            y -= 12;
          }
          drawText (text + userText.sequenceHasErrors, 10, y, 'sequenceString', '', 'start', svg);
        }
        alertMsgs = [];
      }
    }
  }
  
  // 4 pilot cards on a sheet
  if (activeForm === 'PilotCards') {
    // add 10% margin
    w = parseInt(bBox.width) * 1.1;
    x = parseInt(bBox.x) - bBox.width * 0.05;
    h = parseInt(bBox.height) * 1.1;
    y = parseInt(bBox.y) - bBox.height * 0.05;
    // find correct scale
    var scale = roundTwo(400 / w);
    if ((565 / h) < scale ) scale = roundTwo(565 / h);
    // make copies and translate / scale
    var seq1 = svg.getElementById('sequence');
    seq1.setAttribute('transform', 'translate(' +
          roundTwo(-x * scale) + ',' + roundTwo(-y * scale) +
          ') scale(' + scale + ')');
    var seq2 = seq1.cloneNode(true);
    seq2.setAttribute('id', 'seq2');
    seq2.setAttribute('transform', 'translate(' +
          roundTwo((-x * scale) + 400) + ',' + roundTwo(-y * scale) +
          ') scale(' + scale + ')');
    svg.appendChild(seq2);
    var seq3 = seq1.cloneNode(true);
    seq3.setAttribute('id', 'seq3');
    seq3.setAttribute('transform', 'translate(' +
          roundTwo(-x * scale) + ',' + roundTwo(-y * scale + 565) +
          ') scale(' + scale + ')');
    svg.appendChild(seq3);
    var seq4 = seq1.cloneNode(true);
    seq4.setAttribute('id', 'seq4');
    seq4.setAttribute('transform', 'translate(' +
          roundTwo((-x * scale) + 400) + ',' + roundTwo(-y * scale + 565) +
          ') scale(' + scale + ')');
    svg.appendChild(seq4);
    svg.setAttribute ('viewBox', '0 0 800 1130');
    svg.setAttribute("width", '100%');
  }

  if (activeForm === 'Grid') {
    svg.setAttribute("width", '100%');
    svg.setAttribute("height", '100%');
  }
  
  // Insert rectangle (=background) before sequence
  var path = document.createElementNS (svgNS, "rect");
  path.setAttribute('x', '-5');
  path.setAttribute('y', '-5');
  path.setAttribute('width', '810');
  path.setAttribute('height', '1140');
  path.setAttribute('style',style['FormBackground']);
  svg.insertBefore(path, svg.getElementById('sequence'));

  // For some reason serializeToString may convert the xlink:href to
  // a0:href or just href for the logo image
  // So we change it back right away because otherwise the logo isn't displayed
  var sequenceSVG = new XMLSerializer().serializeToString(svg).replace (/ [^ ]*href/, ' xlink:href');
  sequenceSVG = '<?xml version="1.0" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
    '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + sequenceSVG;
  
  if (document.getElementById('inverseForms').checked) {
    // build sequence white-on-black
    sequenceSVG = sequenceSVG.replace(/white/g, '<black>');
    sequenceSVG = sequenceSVG.replace(/black/g, 'white');
    sequenceSVG = sequenceSVG.replace(/<black>/g, 'black');
  }
  
  return sequenceSVG;
}

// buildPrintHeader will append the sequence header
function buildPrintHeader (svg, logoWidth) {
  if (!iacForms) {
    drawRectangle (logoWidth, 0, 720 - logoWidth, 65, 'FormLine', svg);
    drawText (document.getElementById('location').value + ' ' +
      document.getElementById('date').value, 425, 33, 'FormATextLarge', 'middle', '', svg);
    drawRectangle (720, 0, 80, 65, 'FormLine', svg);
    drawText ('Form ' + activeForm, 760, 33, 'FormATextLarge', 'middle', '', svg);
    drawRectangle (logoWidth, 65, 80, 65, 'FormLine', svg);
    drawText ('Pilot ID', logoWidth + 5, 75, 'miniFormA', 'start', '', svg);
    drawRectangle (logoWidth + 80, 65, 640 - logoWidth, 65, 'FormLine', svg);
    drawText (document.getElementById('category').value + ' Programme ' +
      document.getElementById('program').value, 465, 98, 'FormATextLarge', 'middle', '', svg);
    drawRectangle (720, 65, 80, 65, 'FormLine', svg);
    drawText ('Flight #', 725, 75, 'miniFormA', 'start', '', svg);
  } else {
    if (activeForm === 'A') {
      drawRectangle (0, 0, 60, 130, 'FormLine', svg);
      drawRectangle (60, 0, 740, 50, 'FormLine', svg);
      drawRectangle (60, 50, 240, 80, 'FormLine', svg);
      drawRectangle (300, 50, 100, 80, 'FormLine', svg);
      drawRectangle (400, 50, 120, 80, 'FormLine', svg);
      drawRectangle (520, 50, 120, 80, 'FormLine', svg);
      drawRectangle (640, 50, 70, 80, 'FormLine', svg);
      drawRectangle (710, 50, 90, 80, 'FormLineBold', svg);
      drawText (activeForm, 30, 75, 'FormATextHuge', 'middle', '', svg);
      drawText ('INTERNATIONAL AEROBATIC CLUB SCORESHEET', 430, 35, 'FormATextLarge', 'middle', '', svg);
      drawText (userText.contest + ':', 65, 70, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('location').value, 180, 100, 'FormATextMedium', 'middle', '', svg);
      drawText (userText.date + ':', 305, 70, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('date').value, 350, 100, 'FormATextMedium', 'middle', '', svg);
      drawText (userText.category + ':', 405, 70, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('category').value, 460, 100, 'FormATextMedium', 'middle', '', svg);
      drawText (userText.programme + ':', 525, 70, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('program').value, 580, 100, 'FormATextMedium', 'middle', '', svg);
      drawText (userText.pilotnumberIAC1, 645, 70, 'FormAText', 'start', '', svg);
      drawText (userText.pilotnumberIAC2, 645, 95, 'FormAText', 'start', '', svg);
    } else {
      // sequence info box
      drawRectangle (90, 10, 550, 100, 'FormLine', svg);
      drawRectangle (570, 60, 70, 50, 'FormLineBold', svg);
      drawLine (90, 60, 550, 0, 'FormLine', svg); // ---
      drawLine (140, 10, 0, 50, 'FormLine', svg); // |
      drawLine (490, 10, 0, 100, 'FormLine', svg);// ||
      drawLine (290, 60, 0, 50, 'FormLine', svg); // |
      drawText (activeForm, 115, 48, 'FormATextHuge', 'middle', '', svg);
      drawText (userText.contest + ':', 150, 25, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('location').value, 315, 47, 'FormATextLarge', 'middle', '', svg);
      drawText (userText.category + ':', 500, 25, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('category').value, 565, 47, 'FormATextLarge', 'middle', '', svg);
      drawText (userText.date + ':', 100, 75, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('date').value, 190, 97, 'FormATextLarge', 'middle', '', svg);
      drawText (userText.program + ':', 300, 75, 'FormAText', 'start', '', svg);
      drawText (document.getElementById('program').value, 390, 97, 'FormATextLarge', 'middle', '', svg);
      drawText (userText.pilotNo, 530, 90, 'FormAText', 'middle', '', svg);
      
      // tear-off tab
      drawLine (640, 0, 160, 160, 'FormLine', svg);
      drawLine (650, 0, 150, 150, 'dotted', svg);
      drawText (userText.pilot + ': ' + document.getElementById('pilot').value, 670, 10, 'FormAText', 'start', 'pilotText', svg);
      // rotate pilot text elements by 45 degr CW    
      var el = svg.getElementById('pilotText');
      el.setAttribute('transform', 'rotate(45 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
        
      // check line
      drawLine (800, 420, 0, 460, 'dotted', svg);
      drawText ('FREE PROGRAM CHECK BY:', 790, 1080, 'FormAText', 'start', 'checkByText', svg);
      drawText ('(signature/date)', 790, 880, 'FormAText', 'start', 'signText', svg);
      drawText ('A/C: ' + document.getElementById('aircraft').value, 790, 380, 'FormAText', 'start', 'acText', svg);
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

// buildPrintScoreColumn will append the righthand scoring column
function buildPrintScoreColumn (svg) {
  if (iacForms) {
    drawRectangle (580, 130, 120, 50, 'FormLine', svg);
    drawText ('Item', 650, 155, 'FormAText', 'middle', '', svg);
    drawRectangle (700, 130, 40, 50, 'FormLine', svg);
    drawText ('K', 720, 155, 'FormAText', 'middle', '', svg);
    drawRectangle (740, 130, 60, 50, 'FormLine', svg);
    drawText ('Score', 770, 155, 'FormAText', 'middle', '', svg);

    drawRectangle (580, 180, 120, 50, 'FormLine', svg);    
    drawText ('Presentation', 590, 205, 'FormATextBold', 'start', '', svg);
    drawRectangle (700, 180, 40, 50, 'FormLine', svg);
    drawText (document.getElementById('positioning').value, 720, 205, 'FormATextLarge', 'middle', '', svg);
    drawRectangle (740, 180, 60, 50, 'FormLineBold', svg);
    drawLine (740, 180, 0, 50, 'FormLine', svg);
    
    drawText ('FIGURE TOTAL K =', 590, 270, 'FormAText', 'start', '', svg);
    drawRectangle (740, 240, 60, 40, 'FormLine', svg);
    drawText ('INC. PRESENTATION =', 590, 320, 'FormAText', 'start', '', svg);
    drawRectangle (740, 290, 60, 40, 'FormLine', svg);

    drawText (figureK, 770, 265, 'FormATextLarge', 'middle', '', svg);
    if (parseInt(document.getElementById('positioning').value)) {
      var totalK = figureK + parseInt(document.getElementById('positioning').value);
    } else var totalK = figureK;
    drawText (totalK, 770, 315, 'FormATextLarge', 'middle', '', svg);

    drawRectangle (590, 340, 210, 60, 'FormLine', svg);
    drawText ('Aircraft type:', 600, 355, 'FormAText', 'start', '', svg);
    drawText (document.getElementById('aircraft').value, 695, 380, 'FormATextLarge', 'middle', '', svg);
    
    // "checked by" block
    drawRectangle (640, 440, 160, 300, 'FormLine', svg);
    drawLine (695, 440, 0, 300, 'FormLine', svg);
    drawLine (750, 440, 0, 300, 'FormLine', svg);
    drawLine (750, 630, 50, 0, 'FormLine', svg);
    drawText ('FREE PROGRAM CHECKED BY:', 630, 730, 'FormAText', 'start', 'checkedBy1', svg);
    drawText ('Signature:', 655, 730, 'FormAText', 'start', 'checkedBy2', svg);
    drawText ('Printed Name:', 720, 730, 'FormAText', 'start', 'checkedBy3', svg);
    drawText ('IAC No:', 765, 730, 'FormAText', 'start', 'checkedBy4', svg);
    drawText ('Date:', 765, 620, 'FormAText', 'start', 'checkedBy5', svg);
    // rotate all text elements by 90 degr CCW
    for (var i = 1; i < 6; i++) {
      var el = svg.getElementById('checkedBy' + i);
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
    }
    
    // judge details
    var y= 770;
    drawRectangle (590, y, 210, 25, 'FormLine', svg);
    drawText ('Judge', 695, y + 15, 'FormATextBold', 'middle', '', svg);
    drawRectangle (590, y+25, 210, 100, 'FormLineBold', svg);
    drawLine (590, y+75, 210, 0, 'FormLine', svg);
    drawText ('Name', 598, y + 43, 'FormAText', 'start', '', svg);
    drawText ('Number', 598, y + 93, 'FormAText', 'start', '', svg);

  } else {
    drawRectangle (620, 130, 60, 50, 'FormLine', svg);
    drawText ('Item', 650, 155, 'FormAText', 'middle', '', svg);
    drawRectangle (680, 130, 40, 50, 'FormLine', svg);
    drawText ('K', 700, 155, 'FormAText', 'middle', '', svg);
    drawRectangle (720, 130, 80, 50, 'FormLine', svg);
    drawText ('Grade', 760, 155, 'FormAText', 'middle', '', svg);
  
    // Positioning
    drawRectangle (620, 180, 60, 50, 'FormLine', svg);
    drawText ('Pos.', 650, 205, 'FormAText', 'middle', '', svg);
    drawRectangle (680, 180, 40, 50, 'FormLine', svg);
    drawText (document.getElementById('positioning').value, 700, 205, 'FormATextLarge', 'middle', '', svg);
    if (sportingClass.value != 'glider') drawRectangle (720, 180, 80, 50, 'FormLineBold', svg);
    drawLine (760, 180, 0, 50, 'FormLine', svg);
  
    // Harmony
    if (sportingClass.value === 'glider') {
      drawRectangle (620, 230, 60, 50, 'FormLine', svg);
      drawText ('Harm.', 650, 255, 'FormAText', 'middle', '', svg);
      drawRectangle (680, 230, 40, 50, 'FormLine', svg);
      drawText (document.getElementById('harmony').value, 700, 255, 'FormATextLarge', 'middle', '', svg);
      drawRectangle (720, 180, 80, 100, 'FormLineBold', svg);
      drawLine (760, 230, 0, 50, 'FormLine', svg);
      drawLine (720, 230, 80, 0, 'FormLine', svg);
    }
    
    drawRectangle (620, 280, 90, 25, 'FormLine', svg);
    drawText ('Fig K', 665, 295, 'FormAText', 'middle', '', svg);
    drawRectangle (710, 280, 90, 25, 'FormLine', svg);
    drawText ('Total K', 755, 295, 'FormAText', 'middle', '', svg);
    drawRectangle (620, 305, 90, 50, 'FormLine', svg);
    drawText (figureK, 665, 330, 'FormATextLarge', 'middle', '', svg);
    drawRectangle (710, 305, 90, 50, 'FormLine', svg);
    if (parseInt(document.getElementById('positioning').value)) {
      var totalK = figureK + parseInt(document.getElementById('positioning').value);
    } else var totalK = figureK;
    drawText (totalK, 755, 330, 'FormATextLarge', 'middle', '', svg);
    drawRectangle (620, 355, 180, 25, 'FormLine', svg);
    drawText ('Penalties', 710, 370, 'FormATextBold', 'middle', '', svg);
    var penalties = new Array ('Too Low', 'Disqual Fig', 'Too High', 'Outs', 'Interruptions', 'Insertions', 'Missed Slot', 'Trg Violation', 'Faulty Wing Rocks');
    var y = 380;
    drawRectangle (750, y, 50, penalties.length * 25, 'FormLineBold', svg);
    for (var i = 0; i<penalties.length; i++) {
      drawRectangle (620, y, 180, 25, 'FormLine', svg);
      drawText (penalties[i], 628, y + 18, 'FormAText', 'start', '', svg);
      y = y + 25;
    }
  
    drawRectangle (620, y, 180, 25, 'FormLine', svg);
    drawText ('Final Freestyle', 710, y + 15, 'FormATextBold', 'middle', '', svg);
    drawRectangle (620, y+25, 80, 50, 'FormLine', svg);
    drawText ('Duration', 660, y + 50, 'FormAText', 'middle', '', svg);
    drawRectangle (700, y+25, 50, 50, 'FormLine', svg);
    drawText ('Min', 725, y + 40, 'FormAText', 'middle', '', svg);
    drawRectangle (750, y+25, 50, 50, 'FormLine', svg);
    drawText ('Sec', 775, y + 40, 'FormAText', 'middle', '', svg);
    drawRectangle (700, y+50, 100, 25, 'FormLineBold', svg);
    
    // judge details
    drawRectangle (620, y+85, 180, 25, 'FormLine', svg);
    drawText ('Judges Details', 710, y + 100, 'FormATextBold', 'middle', '', svg);
    drawRectangle (620, y+110, 180, 160, 'FormLineBold', svg);
    drawLine (620, y+170, 180, 0, 'FormLine', svg);
    drawLine (620, y+220, 180, 0, 'FormLine', svg);
    drawText ('Signature', 628, y + 128, 'FormAText', 'start', '', svg);
    drawText ('Name', 628, y + 188, 'FormAText', 'start', '', svg);
    drawText ('Number', 628, y + 238, 'FormAText', 'start', '', svg);
  }
}

// buildPrintCornertab will append the righthand corner cut-off tab
function buildPrintCornertab (svg) {
  drawLine (620, 1130, 180, -180, 'FormLine', svg);
  drawLine (680, 1120, 110, -110, 'dotted', svg);
  drawLine (730, 1120, 60, -60, 'dotted', svg);
  // Add pilot's name
  if (document.getElementById('pilot').value) {
    var newText = document.createElementNS (svgNS, "text");
    newText.setAttribute('style', style['FormATextBold']);
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
  newText.setAttribute('style', style['FormAText']);
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
    newText.setAttribute('style', style['FormATextBold']);
    newText.setAttribute('text-anchor', 'middle');
    newText.setAttribute('x', 755);
    newText.setAttribute('y', 1085);
    newText.setAttribute('transform', 'rotate(-45 755 1085)');
    var textNode = document.createTextNode(document.getElementById('aircraft').value);
    newText.appendChild(textNode);
    svg.appendChild (newText);
  }
  // Add aircraft text
  var newText = document.createElementNS (svgNS, "text");
  newText.setAttribute('style', style['FormAText']);
  newText.setAttribute('text-anchor', 'middle');
  newText.setAttribute('x', 785);        
  newText.setAttribute('y', 1080);
  newText.setAttribute('transform', 'rotate(-45 785 1080)');
  var textNode = document.createTextNode(userText.ac);
  newText.appendChild(textNode);
  svg.appendChild (newText);
}

// saveSvg will create a download dialog box to save the currently viewed Form
function saveSvg () {
  var fileName = document.getElementById('location').value+' '+
    document.getElementById('category').value+' '+
    document.getElementById('program').value+' '+
    document.getElementById('pilot').value+' '+
    'Form '+activeForm+'.svg';
  fileName = fileName.replace(/^\s+|\s+$/g, '');
  var data = buildPrintForm(SVGRoot);
  saveFile(data, fileName, {'name':'SVG file', 'filter':'*.svg'}, 'image/svg+xml;utf8');
  draw();
}

// savePDF will save Forms A,B and C as a single PDF
// NOT functional yet!
function savePDF () {
  form = 'A';
  draw ();
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
function buildMoveTo (dxdy, i) {
  var paths = [];
  if (activeForm === 'C') dxdy[0] = -dxdy[0];
  paths.push({'path':'l ' + roundTwo(dxdy[0] * lineElement) + ',' +
    roundTwo(dxdy[1] * lineElement), 'style':'dotted', 'dx':(dxdy[0] * lineElement), 'dy':(dxdy[1] * lineElement)});
// Create space after the figure
  figures[i].paths = buildShape ('FigSpace' , 2, paths);
  figures[i].moveTo = dxdy;
}

// buildCurveTo builds the symbol for a curveto and moves the cursor
function buildCurveTo (dxdy, i) {
  var paths = [];
  if (activeForm === 'C') dxdy[0] = -dxdy[0];
  var angle = dirAttToAngle (Direction, Attitude);
  var dist = Math.sqrt(dxdy[0]*dxdy[0] + dxdy[1]*dxdy[1]);
  var dx = Math.cos(angle) * lineElement * dist / 2;
  var dy = - Math.sin(angle) * lineElement * dist / 2;
 
  paths.push({'path':'c ' + dx + ',' + dy + ' ' +
    roundTwo(dxdy[0] * lineElement - dx) + ',' +
    roundTwo(dxdy[1] * lineElement - dy) + ' ' +
    roundTwo(dxdy[0] * lineElement) + ',' +
    roundTwo(dxdy[1] * lineElement), 'style':'dotted', 'dx':(dxdy[0] * lineElement), 'dy':(dxdy[1] * lineElement)});
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
  if ((Direction == 0) || (Direction == 180)) {
    var entryAxis = 'X';
  } else var entryAxis = 'Y';
  // goFront is set to true for every new figure that starts to front
  if (((Direction == 90) && (Attitude == 0)) || ((Direction == 270) && (Attitude == 180))) {
    goFront = false;
  } else goFront = true;
  // In the first part we handle everything except (rolling) turns
  var bareFigBase = fig[figNr].base.replace(/[\+\-]+/g, '');

  if (!regexTurn.test(fig[figNr].base)) {
    // First we split the figstring in it's elements, the bareFigBase
    // is empty for rolls on horizontal
    if (bareFigBase != '') {
      var splitLR = figString.split(bareFigBase);
    } else var splitLR = Array(figString);
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
      rollInfo[i] = {'gap':[0], 'pattern':[]};
      var rollPattern = rollPatterns[i];
      rollSums[i] = 0;
      if (activeForm === 'C') rollSign = -1; else rollSign = 1;
      extent = 0;
      var subRoll = 0;
      var switchRoll = '';
      if (rollPattern != '') {
        for (j = 0; j < rollPattern.length; j++) {
          switch (rollPattern.charAt(j)) {
          // Long line before or after roll, twice the length of the same pattern in figures.js
            case (userpat.rollext):
              roll[i].push({'type':'line', 'extent':3, 'load':NegLoad});
              rollInfo[i].gap[subRoll] += 3;
              break;
          // Short line before or after roll, twice the length of the same pattern in figures.js
            case (userpat.rollextshort):
              roll[i].push({'type':'line', 'extent':1, 'load':NegLoad});
              rollInfo[i].gap[subRoll]++;
              break;
          // Make line before or after roll shorter
            case (userpat.lineshorten):
              roll[i].push({'type':'line', 'extent':-1, 'load':NegLoad});
              rollInfo[i].gap[subRoll]--;
              break;
          // Switch roll direction
            case (userpat.opproll):
              rollSign = -rollSign;
              if (switchRoll === '') switchRoll = '-'; else switchRoll = '';
              break;
            case ('f'):
        // Add single snaps
        // When there was a roll before, add a line first
              if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
              roll[i].push({'type':'possnap', 'extent':rollSign * 360, 'pattern':'1f'});
              extent = 360;
              rollInfo[i].pattern[subRoll] = switchRoll+'f';
              subRoll++;
              rollInfo[i].gap[subRoll] = 0;
              break;
            case ('s'):
        // Add single spins
        // When there was a roll before, add a line first
              if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
              roll[i].push({'type':'posspin', 'extent':rollSign * 360, 'pattern':'1s'});
              extent = 360;
              rollInfo[i].pattern[subRoll] = switchRoll+'s';
              subRoll++;
              rollInfo[i].gap[subRoll] = 0;
              break;
            case('i'):
        // Add single inverted snaps and spins
        // When there was a roll before, add a line first
              if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
              if (rollPattern.charAt(j + 1) === 'f') {
                j++;
                roll[i].push({'type':'negsnap', 'extent':rollSign * 360, 'pattern':'1if'});
                extent = 360;
                rollInfo[i].pattern[subRoll] = switchRoll+'if';
                subRoll++;
                rollInfo[i].gap[subRoll] = 0;
              } else if (rollPattern.charAt(j + 1) === 's') {
                j++;
                roll[i].push({'type':'negspin', 'extent':rollSign * 360, 'pattern':'1is'});
                extent = 360;
                rollInfo[i].pattern[subRoll] = switchRoll+'is';
                subRoll++;
                rollInfo[i].gap[subRoll] = 0;
              }
              break;
          // Handle all different kinds of rolls and their notation
            default:
              if (parseInt(rollPattern.charAt(j))) {
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

                if (parseInt(rollPattern.charAt(j + 1))) {
                  stops = parseInt(rollPattern.charAt(j + 1));
                  extent = parseInt(rollPattern.charAt(j)) * (360 / stops);
                  j++;
                } else if (parseInt(rollPattern.charAt(j)) == 1) {
                  extent = 360;
                } else if (parseInt(rollPattern.charAt(j)) == 4) {
                  extent = 90;
                } else if (parseInt(rollPattern.charAt(j)) == 8) {
                  stops = 8;
                  extent = 90;
                } else if (parseInt(rollPattern.charAt(j)) == 9) {
                  extent = 720;
                } else {
                  extent = 90 * parseInt(rollPattern.charAt(j));
                }
                var illegalSnapSpin = false;
                switch (rollPattern.charAt(j + 1)) {
                  case ('i'):
                    if (rollPattern.charAt(j + 2) === 'f') {
                      j = j + 2;
                      if (!stops) {
                        roll[i].push({'type':'negsnap', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)});
                      } else illegalSnapSpin = rollPattern.substring(j - 1, j + 1);
                    } else if (rollPattern.charAt(j + 2) === 's') {
                      j = j + 2;
                      if (!stops) {
                        roll[i].push({'type':'negspin', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)});
                      } else illegalSnapSpin = rollPattern.substring(j - 1, j + 1);
                    } 
                    break;
                  case ('f'):
                    j++
                    if (!stops) {
                      roll[i].push({'type':'possnap', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)});
                    } else illegalSnapSpin = rollPattern.substring(j, j + 1);
                    break;
                  case ('s'):
                    j++;
                    if (!stops) {
                      roll[i].push({'type':'posspin', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)});
                    } else illegalSnapSpin = rollPattern.substring(j, j + 1);
                    break;
                  default:
                    roll[i].push({'type':'roll', 'extent':rollSign * extent, 'stops':stops, 'pattern':rollPattern.substring(startJ, j + 1)});
                }
                if (illegalSnapSpin) {
                  alertMsgs.push ('Fig ' + seqNr + ':' + rollPattern.substring(startJ, j + 1) + userText.illegalFig + rollPattern.substring(startJ, startJ + 1) + illegalSnapSpin);
                  extent = 0;
                }
                rollSums[i] = rollSums[i] + rollSign * extent;
                if (extent != 0) {
                  rollInfo[i].pattern[subRoll] = switchRoll + rollPattern.substring(startJ, j + 1);
                  subRoll++;
                  rollInfo[i].gap[subRoll] = 0;
                }
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
                rollSums[i] = rollSums[i] + rollSign * extent;
                if (extent != 0) {
                  rollInfo[i].pattern[subRoll] = switchRoll + rollPattern.substring(startJ, j+1);
                  subRoll++;
                  rollInfo[i].gap[subRoll] = 0;
                  roll[i].push({'type':'slowroll', 'extent':rollSign * extent, 'stops':0, 'pattern':rollPattern.substring(startJ, j+1)});
                  j++;
                }
              }
          }
        }
      }
    }
    // Set the number of the first roll for drawing later on
    // To do this we check the fig.pattern for a roll match before the base
    if (fig[figNr].pattern.match(/^[\+\-][_\^\&]/)) {
      var rollnr = 0;
    } else var rollnr = 1;
    // If there are multiple figNrs we check the rolls to see which one
    // matches best. It's very important that with different figures with
    // the same figure base the roll total is equal in the figures.js file
    if (figNrs.length > 1) {
      // Set rollCorrMin to a very large number to start with so the
      // first correction will allways be smaller
      rollCorrMin = 9999;
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
          if (fig[figNr].pattern.match(/^[\+\-][_\^\&]/)) var rollnr = 0; else var rollnr = 1;
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
  } else var kFactors = new Array(fig[figNr].kpwrd);
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
      for (var i = 0; i < figString.length; i++) {
        if (figString[i] != userpat.forward) {
          basePos = i;
          break;
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
  // Build the start of figure symbol
  paths = buildShape('FigStart', seqNr, paths);
  for (var i = 0; i < figureDraw.length; i++) {
    // set correct load
    if ((figureDraw[i] == figpat.longforward) || (figureDraw[i] == figpat.forward)) {
      if ((Attitude != 90) && (Attitude != 270)) {
        if ((Attitude > 90) && (Attitude < 270)) {
          NegLoad = 1;
        } else {
          NegLoad = 0;
        }
      }
    }
    // Sum continuous lines in the figure
    switch (figureDraw.charAt(i)) {
      // Make long lines
      case (figpat.longforward):
        lineSum = lineSum + 4;
        lineDraw = true;
        break;
      case (userpat.rollext):
        lineSum = lineSum + 3;
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
        // When a roll is encountered, continue there for line lengthening and/or shortening
      case (figpat.fullroll):
        break;
        // When something else than a roll or line is encountered, build
        // the line. Do not make any existing line shorter than 1
      default:
      if (lineDraw) {
        if (lineSum > 0) {
          lineLength = lineLength + lineSum;
          paths = buildShape('Line', Array(lineSum, NegLoad), paths);
        } else {
          lineLength++;
          paths = buildShape('Line', Array(1, NegLoad), paths);
        }
        lineSum = 0;
        lineDraw = false;
      }
    }
    // Take care of everything but lines
    switch (figureDraw.charAt(i)) {
      // Make hammerheads
      case (figpat.hammer):
      case (figpat.pushhammer):
        paths = buildShape('Hammer', lineLength, paths);
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
            if (roll[rollnr][j]['type'] != 'line') {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale, 0), rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength = lineLength + lineSum;
                    rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths);
                  } else {
                    lineLength = lineLength + 1;
                    rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths);
                  }
                }
                lineSum = 0;
                lineDraw = false;
              }
            }  
            switch (roll[rollnr][j]['type']) {
              // Sum line elements
              case ('line'):
                lineSum = lineSum + roll[rollnr][j]['extent'];
                lineDraw = true;
                break;
              // Build roll elements
              case ('roll'):
                rollPaths = buildShape('Roll', Array(roll[rollnr][j]['extent'], roll[rollnr][j]['stops'], rollTop), rollPaths);
                break;
              case ('slowroll'):
                rollPaths = buildShape('Roll', Array(roll[rollnr][j]['extent'], roll[rollnr][j]['stops'], rollTop, true), rollPaths);
                break;
              case ('possnap'):
                rollPaths = buildShape('Snap', Array(roll[rollnr][j]['extent'], 0, rollTop), rollPaths);
                lineLength = lineLength +
                  Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (snapElement075 / lineElement);
                break;
              case ('negsnap'):
                rollPaths = buildShape('Snap', Array(roll[rollnr][j]['extent'], 1, rollTop), rollPaths);
                lineLength = lineLength +
                  Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (snapElement075 / lineElement);
                break;
              case ('posspin'):
                rollPaths = buildShape('Spin', Array(roll[rollnr][j]['extent'], 0, rollTop), rollPaths);
                lineLength = lineLength +
                  Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (spinElement / lineElement);
                break;
              case ('negspin'):
                rollPaths = buildShape('Spin', Array(roll[rollnr][j]['extent'], 1, rollTop), rollPaths);
                lineLength = lineLength +
                  Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (spinElement / lineElement);
            }
            // Find which roll in figures.js matches. There should only be one. Then add Aresti nr and K factor
            var rollAtt = rollAttitudes[Attitude];
            // Find the correct snap/load combination
            // Snaps started knife edge are judged as 'pos from neg'/'neg from pos' with foot-down entry
            if ((roll[rollnr][j]['type'] == 'possnap') || (roll[rollnr][j]['type'] == 'negsnap')) {
              if (((Attitude == 90) || (Attitude == 270)) && lowKFlick) {
                // Handle snaps on verticals where lowKFlick is set
                if (roll[rollnr][j]['type'] == 'possnap') {
                  rollAtt = '+' + rollAtt;
                } else rollAtt = '-' + rollAtt;
              } else if (((rollSum / 180) == parseInt(rollSum / 180)) || (Attitude == 90) || (Attitude == 270)) {
                // Handle snaps on verticals and from non-knife-edge
                if (NegLoad == 0) rollAtt = '+' + rollAtt; else rollAtt = '-' + rollAtt;
              } else {
                // Handle snaps from knife edge. This is the only case (so far) where the way something is
                // drawn (tip down=foot down for pos, tip down=foot up for neg) influences the K factor
                if ((Math.cos(dirAttToAngle (Direction, Attitude)) * roll[rollnr][j]['extent']) < 0) {
                // Foot down snap, the harder one
                /* Old code, seems to be incorrect according Aresti catalogue?
                  if (roll[rollnr][j]['type'] == 'possnap') rollAtt = '-' + rollAtt; else rollAtt = '+' + rollAtt; */
                  rollAtt = '-' + rollAtt;
                } else {
                // Foot up snap, the easier one
                /* Old code, seems to be incorrect according Aresti catalogue?
                  if (roll[rollnr][j]['type'] == 'possnap') rollAtt = '+' + rollAtt; else rollAtt = '-' + rollAtt; */
                  rollAtt = '+' + rollAtt;
                }
              }
            }
            // set lowKFlick to true after anything but a line
            if (roll[rollnr][j]['type'] !== 'line') {
              lowKFlick = true;
            }
            var rollI = rollBase.indexOf(rollAtt + roll[rollnr][j]['pattern']);
            if (rollI >= 0) {
              arestiNrs.push (rollAresti[rollI]);
              if ((sportingClass.value == 'glider') && (rollKGlider[rollI])) {
                kFactors.push (rollKGlider[rollI]);
              } else kFactors.push (rollKPwrd[rollI]);
              // Check if there was a roll before the current one and add ; or , as appropriate for checking
              var k = j - 1;
              while (k > -1) {      
                if (roll[rollnr][k]['type'] != 'line') {
                  if ((roll[rollnr][j]['extent'] / roll[rollnr][k]['extent']) > 0) {
                    figCheckLine[seqNr] = figCheckLine[seqNr] + ';';
                  } else {
                    figCheckLine[seqNr] = figCheckLine[seqNr] + ',';
                  }
                  break;
                }
                k--;
              }
              figCheckLine[seqNr] = figCheckLine[seqNr] + rollAresti[rollI];
            }
            if (roll[rollnr][j]['type'] != 'line') {
              rollSum = rollSum + roll[rollnr][j]['extent']
              rollDone = true
              // Half rolls and all rolls in the vertical change direction and possibly attitude
              if ((parseInt((rollSum + 180) / 360) - ((rollSum + 180) / 360)) == 0) {
                Attitude = 180 - Attitude;
                if (Attitude < 0) Attitude = Attitude + 360;
                if (activeForm == 'C') {
                  changeDir (-Math.abs(rollSum));
                } else changeDir(Math.abs(rollSum));
                rollSum = 0;
                attChanged = 180 - attChanged;
              }
              // check correct load after non-vertical rolls
              if ((Attitude != 90) && (Attitude != 270)) {
                if ((Attitude > 90) && (Attitude < 270)) {
                  NegLoad = 1;
                } else {
                  NegLoad = 0;
                }
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
            // When a line is standing by to be built, build it before doing the autocorrect
            if (autoCorr != 0) {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale, 0), rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength = lineLength + lineSum;
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
                  lineLength = lineLength + 2;
                }
              }
            }
            if (attChanged == 180) {
              Attitude = 180 - Attitude;
              if (Attitude < 0) Attitude = Attitude + 360;
              changeDir(180);
            }
          } else if (fig[figNr].rolls[rollnr] == 2) {
            autoCorr = (parseInt((rollSum + 180) / 360) - ((rollSum + 180) / 360)) * 360;
            // When a line is standing by to be built, build it before doing the autocorrect
            if (autoCorr != 0) {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', Array(1.2/scale), rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength = lineLength + lineSum;
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
                  lineLength = lineLength + 2;
                }
              }
            }
            // Half rolls change direction and attitude
            if (attChanged == 0) {
              Attitude = 180 - Attitude;
              if (Attitude < 0) Attitude = Attitude + 360;
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
            if (rollTopAngleAfter > 0) {
              var topLineAngle = 45;
            } else var topLineAngle = -45;
            paths = buildShape ('Curve', topLineAngle, paths);
            if (rollPaths.length) {
              // draw the marker when there was a roll in the top
              paths = buildShape ('RollTopLine', '', paths);
            } else {
              // no roll, remove first marker
              paths[paths.length - 3].path = '';
            }
            paths = buildShape ('Curve', rollTopAngleAfter - topLineAngle, paths);
            // Retrieve the movement by the two curve paths
            dx = paths[paths.length - 1]['dx'] + paths[paths.length - 3]['dx'];
            dy = paths[paths.length - 1]['dy'] + paths[paths.length - 3]['dy'];
            dxRolls = 0;
            dyRolls = 0;
            // Retrieve the roll path movements
            for (var k = 0; k < rollPaths.length; k++) {
              if (rollPaths[k]['dx']) dxRolls = dxRolls + rollPaths[k]['dx'];
              if (rollPaths[k]['dy']) dyRolls = dyRolls + rollPaths[k]['dy'];
            }
            paths.push ({'path':'', 'style':'', 'dx':-dx-(dxRolls/2), 'dy':-dy-(dyRolls/2)});
          }
          // Add all the roll paths
          for (var k = 0; k < rollPaths.length; k++) paths.push(rollPaths[k]);
          // Move back to the right place at the end of the curve after a roll in the top
          if (rollTop) {
            paths.push ({'path':'', 'style':'', 'dx':dx - (dxRolls / 2), 'dy':dy - (dyRolls / 2)});
          }
        }
      
        // See if the direction should be changed from default
        // This is only possible when there was a 1/4, 3/4 etc roll and the attitude is vertical
        // only run one X and one Y switch per figure
        figString = checkQRollSwitch (figString, figStringIndex, fig[figNr].pattern, seqNr, rollSum, figureDraw, i, roll, rollnr);
      
        // The roll drawing has past, so make sure the rollTop variable is set to false
        rollTop = false;
        rollnr++;
        break;
      // handle clovers (figures with fixed 1/4 roll up or down)
      case ('4'):
        paths = buildShape ('Roll', Array(90, 0), paths);
        figString = checkQRollSwitch (figString, figStringIndex, fig[figNr].pattern, seqNr, 90, figureDraw, i, roll, rollnr);
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
          if (activeForm == 'C') {
            var prefix = '';
          } else var prefix = userpat.moveforward;
        } else {
          figures[figStringIndex].switchX = false;
          if (activeForm == 'C') {
            var prefix = userpat.moveforward;
          } else var prefix = '';
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
          // specifically told to make a curve by 'fi=' symbol
          if ((Math.abs(angle) < 180) && (figureDraw.charAt(i + 1) != '=')) {
            paths = buildShape ('Corner', angle, paths);
          } else {
          // Draw curve. Half size when followed by '/' symbol
            if (figureDraw.charAt(i + 1) == '/') curveRadius = curveRadius / 2;
          // Check if the next roll should be in the top
            if (figureDraw.charAt(i + 1) == '!') {
              rollTop = true;
            } else rollTop = false;
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

              if (angleTop > 0) {
                var topLineAngle = 45;
              } else var topLineAngle = -45;
              paths = buildShape ('Curve', angleTop - topLineAngle, paths);
              paths = buildShape ('RollTopLine', '', paths);
              paths = buildShape ('Curve', topLineAngle, paths);
              var rollTopAngleAfter = angle - angleTop;
            } else {
              // Split full loops in two parts for drawing.
              paths = buildShape ('Curve', angle / 2, paths);
              paths = buildShape ('Curve', angle / 2, paths);
            }   
            if (figureDraw.charAt(i + 1) == '/') curveRadius = curveRadius * 2;
          }
          if (angle < 0) NegLoad = 1; else NegLoad = 0;
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
  
  // set inFigureXSwitch (used for OLAN sequence autocorrect) to false
  // when we exit on X axis
  if ((Direction == 0) || (Direction == 180)) inFigureXSwitchFig = 9999;
}

// checkQRollSwitch checks for vertical 1/4 rolls and determines 
// roll direction
// Only run one X and one Y switch per figure
function checkQRollSwitch (figString, figStringIndex, pattern, seqNr, rollSum, figureDraw, fdIndex, roll, rollnr) {
  if (((Attitude == 90) || (Attitude == 270)) && ((rollSum / 180) != parseInt(rollSum / 180))) {
    if (activeForm == 'C') {
      changeDir (-Math.abs(rollSum));
    } else changeDir(Math.abs(rollSum));
    // find the next angle. Usually this will occur before a new rolling
    // element EXCEPT for tailslides and hammerheads
    var nextAngle = 0;
    var nextRollExtent = 0;
    var nextRollExtentPrev = 0;
    var switchVert = false;
    var doubleBump = figString.match (/(pb|b)(pb|b)/);
    if (rollnr == 0) var firstRoll = true; else var firstRoll = false;
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
            nextRollExtent += parseInt(roll[rollnr][j]['extent']);
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
          figures[figStringIndex].string = figures[figStringIndex].string + userpat.switchDirY;
        }
      }
      if (((((Attitude == 90) == (Direction == 90)) == (nextAngle < 0)) == goFront) != switchVert) {
        changeDir(180);
      }      
      if (regexSwitchDirY.test (figString)) {
        changeDir(180);
        figures[figStringIndex].switchY = true;
        if (nextRollExtent == 0) figString = figString.replace(regexSwitchDirY, '');
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
    if ((nextRollExtent / 180) == parseInt(nextRollExtent / 180)) changeDir (-nextRollExtent);
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
      figures[figStringIndex].string = figures[figStringIndex].string + userpat.switchDirX;
    }
  }
}

// updateSequence updates the sequence character string.
// Figure 'figure' is placed after figure 'figNr' or over figNr' when
// 'replace' is true.
// Also some checks are done, including direction switcher checks.
// The function assumes the 'figure' starts on X axis. So when the previous
// figure ends on Y axis, direction changers are flipped.
function updateSequence (figNr, figure, replace, fromFigSel) {
  // correct direction changers when new figure is from Figure Selector
  if (fromFigSel) {
    if (replace) var prevFig = figNr - 1; else var prevFig = figNr;
    if (figures[prevFig] && figure.match(/[a-z]/)) {
      if (figures[prevFig].exitAxis == 'Y') {
        // switch > and ^. Use temporary placeholder #
        figure = figure.replace(/\^/g, '#').replace(/>/g, '^').replace(/#/g, '>');
      }
    }
  }
  
  // just return if asked to replace an identical figure
  if (replace && (figures[figNr].string == figure)) return;
  
  var updateSelected = true;
  var string = '';
  if (figure == '') var separator = ''; else var separator = ' ';
  for (var i = figures.length - 1; i >= 0; i--) {
    if (i == figNr) {
      if (!replace) {
        // Handle (multiple) moveto or curveto
        if (figure.match(regexMoveTo) || figure.match(regexCurveTo)) {
          var curve = false;
          var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
          var dx = parseInt(dxdy[0]);
          var dy = parseInt(dxdy[1]);
          // check for previous move, curve or movefoward
          while (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
            if (figures[i].curveTo) curve = true;
            if (figures[i].moveForward) {
              dx += figures[i].moveForward;
            } else {
              var dxdy = figures[i].string.replace(/[^0-9\,\-]/g, '').split(',');
              dx += parseInt(dxdy[0]);
              dy += parseInt(dxdy[1]);
            }
            // correcting the selected figure id is done here
            if ((selectedFigure.id !== null) && (i < figNr)) {
              selectedFigure.id--;
            }
            updateSelected = false;
            i--;
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
      
      if (figure !== '') {
        string = figure + separator + string;
      }
      if (!replace) {
        string = figures[i].string + ' ' + string;
      }
    } else string = figures[i].string + ' ' + string;
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
  checkSequenceChanged();
  
  // reselect correct figure
  if (selectedFigure.id !== null) selectFigure (selectedFigure.id);
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
  if (activeSequence.text.match(regexFlipYAxis)) {
    setYAxisOffset (180 - yAxisOffset);
  }
  // Get the split string from activeSequence
  figures = activeSequence.figures;

  for (var i = 0; i < figures.length; i++) {
    // make sure all paths are empty
    figures[i].paths = [];
    
    figure = figures[i].string;
    
    // always start figure LTR for Figures in grid view
    if (activeForm === 'Grid') {
      if (Attitude == 0) {
        Direction = 0;
      } else Direction = 180;
    }
    
    // simplify the string
    
    // replace `+  by forwardshorten for entry
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
    
    // replace the second '-' and up (in row) by longforward (reverse for speed)
    // e.g. ---h- will be ++-h-
    // don't know a way to do this with regex...
    var multipleMinus = false;
    // if the figure is only - and extensions, e.g. --, disregard last minus
    if (figure.match(/^[-~`]*$/)) {
      var skipMinus = true
    } else var skipMinus = false;
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
    if (figure.match(regexDrawInstr) || (figure.replace(regexMoveForward, '').length == 0) || (figure.replace(regexMoveDown, '').length == 0) || (figure == userpat.subSequence)) {
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
          buildMoveForward (parseInt(moveFwd) + moveFwd.length - moveFwd.match(/[0-9]*/).length - 1, i);
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
      } else if (figure == userpat.subSequence) {
        // Start subsequence
        firstFigure = true;
        figures[i].subSequence = true;
        subSequence = true;
        if (Attitude == 180) {
          Attitude = 0;
          changeDir(180);
        }
      } else if (regexTextBlock.test(figure)) {
        // add text block
        figures[i].paths = buildShape ('TextBlock', figure.replace(RegExp(userpat.text, 'g'), ''), []); 
        figures[i].unknownFigureLetter = unknownFigureLetter;
        // set comments, to be applied to the next real figure
        comments = figure.replace(RegExp(userpat.text, 'g'), '');
        // remove figure letter from comments when applicable
        comments = comments.replace(/^@[A-L]/, '');
      }
    } else {
      // remove any comments inside the figure
      figure = figure.replace(/"[^"]*"/g, '');
      // To determine the base we remove all non-alphabet characters (except -)
      var base = figure.replace(/[^a-z\-]+/g, '');
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
        if (figure.replace(/[^a-z0-9\-\+]+/g, '').charAt(0) == '-') {
          base = base + '+';
        } else base = '+' + base;
        // Handle everything else
      } else {
        // begin the base with a '+' if there is no '-'
        if (base.charAt(0) != '-') base = '+' + base;
        // end the base with a '+' if there is no '-'
        if (base.charAt(base.length - 1) != '-') base = base + '+';
      }
      // set subSequence to true for subsequence 'figures'
      if (base.match(/^\+e(j|ja|d|u)\+$/) && !firstFigure) {
        subSequence = true;
      }
      // Autocorrect the entry attitude for figures after the first
      // (sub)figure where necessary, when not on grid view
      if (!(firstFigure || subSequence || (activeForm == 'Grid'))) {
        // Start upright
        if (Attitude == 0) {
          if (base[0] == '-') {
            Attitude = 180;
            changeDir(180);
            alertMsgs.push ('Fig ' + seqNr + userText.setUpright);
            // draw circle around figure start
            figures[i].paths = [{'path': 'm -' + (rollcurveRadius * 1.2) +
              ',0 a' + (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
              ' 0 1 1 0,0.01', 'style':'corr'}];
          }
        // Start inverted
        } else if (Attitude == 180) {
          if (base[0] == '+') {
            Attitude = 0;
            changeDir(180);
            alertMsgs.push ('Fig ' + seqNr + userText.setInverted);
            // draw circle around figure start
            figures[i].paths = [{'path': 'm -' + (rollcurveRadius * 1.2) +
              ',0 a' + (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
              ' 0 1 1 0,0.01', 'style':'corr'}];
          }
        }
      }
      // Handle turns and rolling turns. They do have numbers in the base
      if (base.match(/^.j/)) {
        base = figure.replace(/[^a-z0-9\-\+]+/g, '');
        if (base.charAt(0) != '-') base = '+' + base;
        if (base.charAt(base.length - 1) != '-') base = base + '+'
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
          figures[i].subSequence = true;
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
        Direction = 270;
        if (firstFigure) {
          updateSequenceOptions ('ej');
        } else {
          subSequence = true;
        }
        // Crossbox away entry 'figure'
      } else if (base == '+eja+') {
        Direction = 90;
        if (firstFigure) {
          updateSequenceOptions ('eja');
        } else {
          subSequence = true;
        }
        // Downwind entry 'figure'
      } else if (base == '+ed+') {
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
          subSequence = true;
        }
        // Upwind entry 'figure'
      } else if (base == '+eu+') {
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
          subSequence = true;
        }
      } else {
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
    if ((Direction == 0) || (Direction == 180)) {
      figures[i].exitAxis = 'X';
    } else {
      figures[i].exitAxis = 'Y';
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
  // Build the last figure stop shape after all's done. This won't
  // work well if 'move' figures are added at the end
  if (!firstFigure) {
    paths = figures[figures.length - 1].paths;
    // remove space at end of figure
    paths.pop();
    paths = buildShape ('FigStop', true, paths);
    figures[figures.length - 1].paths = paths;
  }
}
