// OpenAero.js 1.2.0
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
// X is x position on canvas
var X = 0;
// Y is y position on canvas
var Y = 0;
// Scale is the current scaling factor
// 1 = default, .5 is 50%, 2 is 200%
var scale = 1;
// activeForm holds the currently displayed form
// activeForm == 'C' is true when form C is drawn. It is used in various functions to ensure exact mirroring
var activeForm = 'B';
// activeSequence holds the current sequence string and separate figures
var activeSequence = {'text': '', 'figures': []};
// sequenceSaved is true when the current sequence has been saved. It starts out true as we start with an empty sequence
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
// .string as in sequence text line
// .paths for all the drawing paths
// .aresti for the Aresti nrs of the figure
// .k for the K factors of the figure
// .figNr for the base figure index in fig[]
// .bBox for the bounding rectangle
// .startPos for the starting position
// .draggable boolean to indicate if draggable or not
var figures = [];
// firstFigure is true when the figure is the first of the (sub)sequence
var firstFigure = true;
// connectors holds the number of connector figures in the sequence
var connectors = 0;
// PI2 is 2 times PI. Saves calculations during runtime
var PI2 = Math.PI * 2;
// logoImg holds the active logo image
var logoImg = false;
// sequenceXML holds the XML string with all sequence info
var sequenceXML = null;
// openWindow holds the new window handle that may be necessary when saving files on other browsers than Firefox
var openWindow = '';
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

// seqCheckAvail indicates if sequence checking is available for a rule/cat/seq combination
var seqCheckAvail = [];
// variables used for checking sequence validity
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
// figBaseLookup holds the same data as fig.base, but with the base as key and corresponding figure(s) as an array for fast lookup
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

// **************************************************************
// *
// *           FUNCTIONS
// *
// **************************************************************

// rebuildSequence deletes and recreates the svg that holds the sequence
// SVGRoot is a global SVG object
function rebuildSequenceSvg () {
  var container = document.getElementById("svgContainer");
  while (container.childNodes.length > 0) container.removeChild(container.lastChild);
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
  //return svg;
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
function alertBox(html) {
// Remove any open boxes first
  closeAlertBox();
// Make the box
  var div = document.createElement('div');
  div.id = 'alertBox';
// Make the message
  var msgDiv = document.createElement('div');
  msgDiv.id = 'message';
  msgDiv.innerHTML = html;
  div.appendChild(msgDiv);
// Make the 'close' button
  var closeDiv = document.createElement('div');
  closeDiv.id = 'close';
  var aElem = document.createElement('a');
  aElem.href = '#';
  aElem.setAttribute('onClick', 'closeAlertBox();');
  aElem.appendChild(document.createTextNode(userText.closeIt));
  closeDiv.appendChild(aElem);
  div.appendChild(closeDiv);
  document.body.appendChild(div);
  // return the div
  return div;
}

//closeAlertBox removes any alertBoxes
function closeAlertBox() {
  box = document.getElementById('alertBox');
  if (box) document.body.removeChild(box);
}

// Modern Combo Box  Script
// copyright Stephen Chapman, 18th October 2008
// you may copy this script provided that you retain the copyright notice
// you should not need to alter the below code

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
    list[i].setAttribute('class', 'inactiveTab');
    // hide the tab by moving it out of view so any data is still accessible
    document.getElementById(list[i].id.replace('tab-', '')).setAttribute('style', 'position:fixed;left:-5000px;')
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

// getSuperFamily returns the superfamily for a category of the figure described by an array of Aresti numbers
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

// dirAttToAngle creates an angle to draw from the values for direction and attitude
// 0 or higher angles mean theta was in the right half, negative angles mean theta was in the left half => necessary for correct looping shapes
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
  } else var theta = (dir - 270) * ((180 - yAxisOffset) / 90) + yAxisOffset + 180;
// No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    if ((theta < 90) || (theta > 270)) theta = 0; else theta = 180;
  }
// Check for right or left half, calculate angle and make negative for left half
  if ((theta < 90) || (theta > 270)) {
    var angle = ((theta + att) / 180) * Math.PI;
    if (angle > PI2) {
      angle = angle - PI2;
    } else if (angle < 0) angle = angle + PI2;
  } else {
    var angle = ((theta - att) / 180) * Math.PI;
    if (angle >= 0) {
      angle = angle - PI2;
    } else if (angle < -PI2) angle = angle + PI2;
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
}

// *******************************************************************************
// Define the low level shapes
// The function names are of the format makeXXX where XXX is the name to be called
// *******************************************************************************

// drawWind draws the wind arrow and text
// x and y represent the corner of the rectangle bounding the arrow at the top downwind side
// The return value is an array with the width and height of the bounding rectangle
function drawWind (x, y, sign) {
  var path = document.createElementNS (svgNS, "path");
  pathNode = 'M' + x + ',' + (y + 6) + ' l ' + (-sign * 80) +
    ',0 l 0,-6 l ' + (-sign * 16) + ',16 l ' + (sign * 16) +
    ',16 l 0,-6 l ' + (sign * 80) + ',0 z';
  path.setAttribute ('d', pathNode);
  path.setAttribute ('style', style['pos']);
  SVGRoot.getElementById('sequence').appendChild(path);
  var text = document.createElementNS (svgNS, "text");
  text.setAttribute('x', x - (sign * 10));
  text.setAttribute('y', y + 20);
  text.setAttribute('style', style['miniFormA']);
  if (sign == 1) {
    text.setAttribute('text-anchor', 'end');
  } else text.setAttribute('text-anchor', 'start');
  var textNode = document.createTextNode(userText.wind);
  text.appendChild(textNode);
  SVGRoot.getElementById('sequence').appendChild(text);
  return {'width':96, 'height':32};
}

// makeFigStart creates figure start marker
function makeFigStart (seqNr) {
  var pathsArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  // Create a marker for possible automatic repositioning of the figure start
  pathsArray.push({'figureStart': true});
  // Create the first figure mark if applicable
  if (firstFigure) {
    pathsArray.push({'path': 'm 3,-6 a7,7 0 1 1 -6,0', 'style':'pos'});
  }
  // Add the figure number
  if (seqNr) pathsArray.push ({'text':seqNr, 'style':'miniFormA', 'x':0, 'y':-8, 'text-anchor':'middle'});
  // Make the marker
  pathsArray.push({'path': 'm -4,0 a4,4 0 1 1 0,0.01', 'style':'blackfill', 'dx':Math.cos(angle) * 4, 'dy':- Math.sin(angle) * 4});
  return pathsArray;
}

// makeFigStop creates figure stop
function makeFigStop (lastFig) {
  var pathArray = new Array();
  var angle = ((Direction + 90) / 180) * Math.PI;
  var dx = Math.cos(angle) * lineElement;
  var dy = - Math.sin(angle) * lineElement;
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

// makeFigLast creates last figure stop
function makeFigLast () {
  var pathArray = new Array(2);
}

// makeLine creates lines
function makeLine (Params) {
  var Extent = Params[0];
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = roundTwo(Math.cos(angle) * lineElement * Extent);
  var dy = - roundTwo(Math.sin(angle) * lineElement * Extent);
  pathArray['path'] = 'l ' + dx + ',' + dy;
  if ((Attitude == 90) || (Attitude == 270)) {
    if (NegLoad == 0) {
      pathArray['style'] = 'pos';
    } else pathArray['style'] = 'neg';
  } else if ((Attitude > 90) && (Attitude < 270)) {
    pathArray['style'] = 'neg';
    NegLoad = 1;
  } else {
    pathArray['style'] = 'pos';
    NegLoad = 0;
  }
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
// Change direction and make sure Attitude stays in [0,359]
  if (PullPush == 0) changeAtt(Extent); else changeAtt(-Extent);
// Calculate at which angle the curve stops
  var radStop = dirAttToAngle (Direction, Attitude);
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
  pathArray['path'] = 'a' + Radius + ',' + Radius + ' 0 ' + longCurve +
    ' ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  pathArray['dx'] = dx;
  pathArray['dy'] = dy;
  return Array(pathArray);
}

// makeRollTopLine creates the small lines around rolls in the top
function makeRollTopLine () {
  var pathArray = [];
  //var angle = ((Attitude + 90) / 180) * Math.PI;
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
// This has to be changed in the future to improve the look of the figures and the code
// For now we keep it like this as it does work

// makeTurnArc creates arc segments for turns and rolling circles. Size is in DRAWN rads
function makeTurnArc (rad, startRad, stopRad, pathsArray) {
  while (startRad >= PI2) startRad = startRad - PI2;
  while (startRad < 0) startRad = startRad + PI2;
  while (stopRad >= PI2) stopRad = stopRad - PI2;
  while (stopRad < 0) stopRad = stopRad + PI2;
    
  if (rad >= 0) var sign = 1; else var sign = -1;
// calculate where we are in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
// as the atan function only produces angles between -PI/2 and PI/2 we may have to correct for full ellipse range
  if ((startRad > Math.PI) && (startRad < PI2)) radEllipse = radEllipse + Math.PI;
  startX = Math.cos (radEllipse) * curveRadius;
  startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
// calculate where we go to in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
  if ((stopRad > Math.PI) && (stopRad < PI2)) radEllipse = radEllipse + Math.PI;
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

// makeTurnDots creates dotted arc segments for turns and rolling circles. Size is in DRAWN rads
function makeTurnDots (rad, startRad, stopRad, pathsArray) {
  while (startRad >= PI2) startRad = startRad - PI2;
  while (stopRad >= PI2) stopRad = stopRad - PI2;
    
  if (rad >= 0) sign = 1; else sign = -1;
  // calculate where we are in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
  // as the atan function only produces angles between -PI/2 and PI/2
  // we may have to correct for full ellipse range
  if ((startRad > Math.PI) && (startRad < PI2)) {
    radEllipse = radEllipse + Math.PI;
  }
  startX = Math.cos (radEllipse) * curveRadius;
  startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
  // calculate where we go to in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
  if ((stopRad > Math.PI) && (stopRad < PI2)) {
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

// makeTurn builds turns and rolling circles from the draw instructions parsed from fig[i].draw
function makeTurn (draw) {
// parse base
  var pathsArray = [];
// Check if we are in an in/out or out/in roll
  regex = /io|IO/;
  if (regex.test(draw)) var switchRollDir = true; else switchRollDir = false;
// Check if the exit direction is flipped
  if (draw.charAt(0) == userpat.moveforward) {
    var sign = -1;
  } else var sign = 1;
// See if we start with an outside roll
  regex = /J/;
  if (regex.test(draw)) var rollDir = -sign; else var rollDir = sign;
// See if we start inverted, this will also flip the drawing direction
  if (Attitude == 180) rollDir = -rollDir;
  var numbers = draw.replace(/[^\d]+/g, '');
  var extent = parseInt(numbers.charAt(0)) * 90;
// See if direction change is called for by the preparsed draw string
  var stopRad = dirAttToAngle (Direction + (sign * extent), Attitude);
  if (stopRad < 0) stopRad = stopRad + PI2;
  var startRad = dirAttToAngle (Direction, Attitude);
  if (startRad < 0) startRad = startRad + PI2;
  startRadSave = startRad;
  var rad = sign * stopRad - sign * startRad;
  if (rad <= 0) rad = rad + PI2;
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
    pathsArray = makeTurnDots (sign*(PI2 - rad), stopRad, startRadSave, pathsArray);
    changeDir (sign * extent);
  } else {
// regular turns
    if (extent != 360) {
      pathsArray = makeTurnArc (sign * rad, startRad, stopRad, pathsArray);
      pathsArray = makeTurnDots (sign * (PI2-rad), stopRad, startRad, pathsArray);
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
// Example: (270,4) would be a 3x4 roll
function makeRoll (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var sweepFlag = params[0] > 0 ? 1 : 0;
  if (params.length > 2) var rollTop = params[2];
  var rad = dirAttToAngle (Direction, Attitude);
// calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
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
        pathsArray = buildShape ('Move', Array(2, 0), pathsArray);
      } else {
        pathsArray = buildShape ('Line', Array(2, 0), pathsArray);
      }
// Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1]['dx'];
      dy = pathsArray[pathsArray.length - 1]['dy'];
      var radPoint = rad + sign * (Math.PI / 3);
      dxTip = (((Math.cos(radPoint) * (rollcurveRadius + 2)) - (radCos * rollcurveRadius)));
      dyTip = -(((Math.sin(radPoint) * (rollcurveRadius + 2)) - (radSin * rollcurveRadius)));
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
      path = path + 'l ' + roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
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
        pathsArray = buildShape ('Move', Array(1.5, 0), pathsArray);
      } else {
        pathsArray = buildShape ('Line', Array(1.5, 0), pathsArray);
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
        pathsArray = buildShape ('Move', Array(0.5, 0), pathsArray);
      } else {
        pathsArray = buildShape ('Line', Array(0.5, 0), pathsArray);
      }
// Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1]['dx'] + radCos * spinElement2;
      dy = pathsArray[pathsArray.length - 1]['dy'] - radSin * spinElement2;
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
// extent is the size of the line before the hammerhead top. We will move that much down before continuing drawing
function makeHammer (extent) {
  pathArray = [];
  Attitude = 270;
  changeDir(180);
  pathArray['path'] = "l " + (lineElement) + "," + (lineElement);
  pathArray['style'] = 'pos';
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
  pathsArray[0]['path'] = 'a' + Radius + ',' + Radius + ' 0 0 ' +
    sweepFlag + ' ' + dx + ',' + dy;
  pathsArray[0]['dx'] = dx;
  pathsArray[0]['dy'] = dy;
  var Radius = (curveRadius) / 2;
  if (angle > 0) dx = Radius; else dx = -Radius;
  dy = Radius;
  pathsArray[1]['path'] = 'a' + Radius + ',' + Radius + ' 0 0 ' +
    sweepFlag + ' ' + dx + ',' + dy;
  pathsArray[1]['style'] = 'pos';
  pathsArray[1]['dx'] = dx;
  pathsArray[1]['dy'] = dy;
  Attitude = 270;
  return pathsArray;
}

// ######################################################################
// Functions for creating and drawing complex shapes from the base shapes

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
    text.setAttribute('x', X + pathArray['x']);        
    text.setAttribute('y', Y + pathArray['y']);
    text.setAttribute('style', style[pathArray['style']]);
    text.setAttribute('text-anchor', pathArray['text-anchor']);
    var textNode = document.createTextNode(pathArray['text']);
    text.appendChild(textNode);
    svgElement.appendChild(text);
  } else if (pathArray['figureStart']) {
// Check if figure starts do not overlap when this is not the first figure
    if (figureStart.length > 0) {
      do {
        // Walk through the figure starts and see if we find any distance
        // lower than minimum with the one we're making now
        var overlap = false;
        for (var i = 0; i < figureStart.length; i++) {
          var distSq = roundTwo((figureStart[i]['x'] - X)*(figureStart[i]['x'] - X) + (figureStart[i]['y'] - Y)*(figureStart[i]['y'] - Y))
          if (distSq < minFigStartDistSq) {
            // found one that's too close. Move the start down and run again
            Y = roundTwo(figureStart[i]['y'] + Math.sqrt(minFigStartDistSq-((figureStart[i]['x'] - X)*(figureStart[i]['x'] - X))));
            overlap = true;
            break; // break for loop
          }
        }
      } while (overlap);
    }
    // Put this figure's start in the figureStart array for checking against the next one
    figureStart.push({'x':X, 'y':Y})
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
  path.setAttribute('style',style[styleId]);
  if (svg) {
    svg.appendChild(path);
  } else SVGRoot.getElementById('sequence').appendChild(path);
}
  
// drawText draws any text at position x, y in style styleId with optional anchor and id
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

// draw an aresti number text with a figure
function drawArestiText(figNr, aresti) {
  drawText (aresti, X, Y, 'start', 'text-' + figNr);
}

// #####################################################
// Functions for interpreting user input and variables

// doOnLoad is only called on initial loading of the page
function doOnLoad () {
// Parse the figures file
  parseFiguresFile();
// Parse the rules file
  parseRulesFile();
  // Activate the first figure selection group
  changeFigureGroup(document.getElementById('figureGroup'));
  document.getElementById('figureHeader').innerHTML = userText.addingFigure;
  // Load sequence cookie
  sequenceXML = getCookie('sequence');
  if (sequenceXML) activateXMLsequence (sequenceXML);
  // build sequence svg
  rebuildSequenceSvg();
  // Check for the latest version every 10 minutes
  latestVersion();
  window.setInterval(function(){latestVersion()},600000);
  // Add combo box functions for rules/category/program input fields
  new combo('rules','#cc9','#ffc');
  new combo('category','#cc9','#ffc');
  new combo('program','#cc9','#ffc');
  // Add plus and minus elements such as used in entry/exit line adjustment
  addPlusMinElements();
  // prepare figure editor
  updateFigureEditor();
  // check if the sequence displayed is the one in the input field
  checkSequenceChanged();
  // Update the browser title and sequenceXML
  changeSequenceInfo();
}

// clickButton is called when clicking certain buttons
function clickButton (e) {
  // don't click disabled buttons
  if (e.firstChild.getAttribute('src') == mask.disable) return;
  // activate the correct click action
  switch (e.id) {
    // temporary depression
    case 'deleteFig':
    case 'magMin':
    case 'magPlus':
      e.firstChild.setAttribute('src', mask.on);
      window.setTimeout (function(){e.firstChild.setAttribute('src', mask.off);}, 200);
      break;
    // switch between active/inactive
    default:
      if (e.firstChild.getAttribute('src') == mask.off) {
        e.firstChild.setAttribute('src', mask.on);
      } else {
        e.firstChild.setAttribute('src', mask.off);
      }
  }
  var divClass = e.getAttribute('class');
  switch (divClass) {
    case 'minButton':
      e.firstChild.setAttribute('src', mask.smallon);
      window.setTimeout (function(){e.firstChild.setAttribute('src', mask.smalloff);}, 200);
      e.nextSibling.value--;
      break;
    case 'plusButton':
      e.firstChild.setAttribute('src', mask.smallon);
      window.setTimeout (function(){e.firstChild.setAttribute('src', mask.smalloff);}, 200);
      e.previousSibling.value++;
      break;
  }
      
  // disable the moveX/moveY selectors. They will be enabled depending
  // on the move button that's active
  document.getElementById('moveX').setAttribute('disabled', 'disabled');
  document.getElementById('moveY').setAttribute('disabled', 'disabled');

  // take action
  switch (e.id) {
    case 'deleteFig':
      if (selectedFigure.id != null) updateSequence(selectedFigure.id, '', true);
      break;
    case 'magMin':
      document.getElementById('scale').value--;
      updateFigure();
      break;
    case 'magPlus':
      document.getElementById('scale').value++;
      updateFigure();
      break;
    case 'moveNoLine':
      document.getElementById('straightLine').firstChild.setAttribute('src', mask.off);
      document.getElementById('curvedLine').firstChild.setAttribute('src', mask.off);
      if (e.firstChild.getAttribute('src') == mask.on) {
        document.getElementById('moveX').removeAttribute('disabled');
      }
      break;
    case 'straightLine':
      document.getElementById('moveNoLine').firstChild.setAttribute('src', mask.off);
      document.getElementById('curvedLine').firstChild.setAttribute('src', mask.off);
      if (e.firstChild.getAttribute('src') == mask.on) {
        document.getElementById('moveX').removeAttribute('disabled');
        document.getElementById('moveY').removeAttribute('disabled');
      }
      break;
    case 'curvedLine':
      document.getElementById('straightLine').firstChild.setAttribute('src', mask.off);
      document.getElementById('moveNoLine').firstChild.setAttribute('src', mask.off);
      if (e.firstChild.getAttribute('src') == mask.on) {
        document.getElementById('moveX').removeAttribute('disabled');
        document.getElementById('moveY').removeAttribute('disabled');
      }
      break;
      
  }
  updateFigure();
}

// addPlusMinElements creates plus/min elements on startup
function addPlusMinElements () {
  var el = document.getElementsByClassName('plusMin');
  for (var i = el.length - 1; i >= 0; i--) {
    var button = document.createElement('span');
    button.setAttribute('class', 'minButton');
    button.setAttribute('onMouseDown', 'clickButton(this);');
    button.innerHTML = '<img src="buttons/smallMask.png">';
    el[i].appendChild (button);
    var value = document.createElement('input');
    value.type = 'text';
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
    button.innerHTML = '<img src="buttons/smallMask.png">';
    el[i].appendChild (button);
  }
}

// build an element with plus/minus buttons
function buildPlusMinElement (id, value) {
  var html = '<span class="minButton" onClick="clickButton(this);">' +
    '<img src="buttons/smallMask.png"></span>';
  html += '<input type="text" id="'+id+'" size="2" value="'+value+'" ' +
    'class="plusMinText" onUpdate="updateFigure();" onKeyUp="updateFigure();" />';
  html += '<span class="plusButton" onClick="clickButton(this);">' +
    '<img src="buttons/smallMask.png"></span>';;  
  return html;
}

function buildRollSelectElement (figNr, rollEl, elNr) {
  var thisRoll = figures[figNr].rollInfo[rollEl];
  var pattern = '';
  if (thisRoll.pattern[elNr]) pattern = thisRoll.pattern[elNr].replace('-', '');
  var html = '<span><select id="roll'+rollEl+'-'+elNr+'" class="rollSelect" onChange="updateFigure();">';
  // build the slow roll options
  for (var i = 0; i < rollTypes.length; i++) {
    var roll = rollTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="rollSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the flick options
  for (var i = 0; i < flickTypes.length; i++) {
    var roll = flickTypes[i].split(':');
    html += '<option value="'+roll[0]+'"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the spin options
  for (var i = 0; i < spinTypes.length; i++) {
    var roll = spinTypes[i].split(':');
    html += '<option value="'+roll[0]+'"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build direction flip checkbox
  html += '</select>Flip<input type="checkbox" id="roll'+rollEl+'-'+elNr+'-swap" class=rollSwap';
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

// updateFigureEditor will update the figure editor for the
// provided figureId
function updateFigureEditor () {
  displaySelectedFigure();
  updateFigureOptions(selectedFigure.id);
  addRollSelectors(selectedFigure.id);
}

// showFigureSelector displays the base figure selector
function showFigureSelector () {
  document.getElementById('figureSelector').setAttribute('style', 'right:0px;');
}

// hideFigureSelector hides the base figure selector
// but because we do need it to be available for various operations
// we slide it to the right
function hideFigureSelector () {
/* Nice slide, doesn't work for some reason
 * 
  document.getElementById('figureSelector').setAttribute('style', 'right:0px;');
  intervalID.hideFigureSelector = window.setInterval(function(){
    var el = document.getElementById('figureSelector');
    var i = parseInt(el.getAttribute('style').match(/[0-9]+/)) + 10;
    if (i < 300) {
      el.setAttribute('style', 'right:-'+i+'px;');
    } else {
      window.clearInterval(intervalID.hideFigureSelector);
    }
  },10);
  */

  document.getElementById('figureSelector').setAttribute('style', 'right:-300px;');
}

// displaySelectedFigure will display the currently selected figure
// in the figure editor
function displaySelectedFigure() {
  var svg = document.getElementById('selectedFigureSvg');
  prepareSvg(svg);
  if (!(selectedFigure.id === null)) {
    // assign this figure an id of -2 to prevent filtering etc.
    figures[-2] = figures[selectedFigure.id];
    drawFullFigure(-2, true, svg);
    delete figures[-2];
    // Get the drawn figure from the SVG and set the position and margin
    var group = svg.getElementById('figure-2');
    var bBox = group.getBBox();
    var xMargin = bBox['width'] / 20;
    var yMargin = bBox['height'] / 20;
    group.setAttribute('transform', 'translate(' + roundTwo((xMargin - bBox['x'])) + ' ' + roundTwo((yMargin - bBox['y'])) + ')')
    svg.setAttribute('viewBox', '0 0 '+(bBox['width']+xMargin*2)+' '+(bBox['height']+yMargin*2));
    svg.setAttribute('width', 140);
    svg.setAttribute('height', 140);
  }
}

// updateFigureOptions will update all options for editing a figure
// var figureId is the id of the figures[] object
function updateFigureOptions (figureId) {
  if (selectedFigure.id === null) {
    document.getElementById('figureOptions').setAttribute('style', 'display:none;');
    document.getElementById('entryExitExtension').setAttribute('style', 'display:none;');
  } else {
    document.getElementById('figureOptions').removeAttribute('style');
    document.getElementById('entryExitExtension').removeAttribute('style');
    // set switchX
    var image = document.getElementById('switchX').firstChild;
    if (figures[figureId].switchX) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchX === false) {
      image.setAttribute('src', mask.off);
    } else image.setAttribute('src', mask.disable);
    // set switchY
    var image = document.getElementById('switchY').firstChild;
    if (figures[figureId].switchY) {
      image.setAttribute('src', mask.on);
    } else if (figures[figureId].switchY === false) {
      image.setAttribute('src', mask.off);
    } else image.setAttribute('src', mask.disable);
    // set correct scale
    document.getElementById('scale').value = figures[figureId].scale;
    // set move
    // first we disable all selectors and remove values
    document.getElementById('straightLine').firstChild.setAttribute('src', mask.off);
    document.getElementById('curvedLine').firstChild.setAttribute('src', mask.off);
    document.getElementById('moveNoLine').firstChild.setAttribute('src', mask.off);
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
          document.getElementById('straightLine').firstChild.setAttribute('src', mask.on);
          document.getElementById('moveX').removeAttribute('disabled');
          document.getElementById('moveY').removeAttribute('disabled');
          break;
        } else if (prevFig.moveForward) {
          document.getElementById('moveX').value = prevFig.moveForward;
          document.getElementById('moveNoLine').firstChild.setAttribute('src', mask.on);
          document.getElementById('moveX').removeAttribute('disabled');
          break;
        }
      }
      i--;
    }
    // no earlier real figure found, disable move selectors
    if (i == -1) {
      document.getElementById('straightLine').firstChild.setAttribute('src', mask.disable);
      document.getElementById('curvedLine').firstChild.setAttribute('src', mask.disable);
      document.getElementById('moveNoLine').firstChild.setAttribute('src', mask.disable);
    }
    // set entry extension
    document.getElementById('entryExt-value').value = figures[figureId].entryExt;
    // set exit extension
    document.getElementById('exitExt-value').value = figures[figureId].exitExt;
  }
}

// addRollSelectors will add all applicable roll selectors when
// editing a figure
// var figureId is the id of the figures[] object
function addRollSelectors (figureId) {
  var el = document.getElementById('rollInfo');
  if (figureId === null) {
    el.setAttribute('style', 'display:none;');
  } else {
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
          div.innerHTML += '<div class="rollGaps"><span>Gaps</span>';
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

// updateFigure will be called when any figure option is updated
function updateFigure() {
  // get the base figure number
  var figNr = figures[selectedFigure.id].figNr;
  // get the base pattern
  var pattern = fig[figNr].pattern.replace(/\+/g, '');
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
  var image = document.getElementById('switchY').firstChild;
  if (image.getAttribute('src') == mask.on) pattern += userpat.switchDirY; 
  // set switchX
  var image = document.getElementById('switchX').firstChild;
  if (image.getAttribute('src') == mask.on) pattern += userpat.switchDirX;
  // move back in the figure cueue to find scale or move patterns
  var i = selectedFigure.id - 1;
  var moveToFig = false;
  var moveForwardFig = false;
  var scaleFig = false;
  // continue as long as we're not at the beginning and are not on
  // a regular figure  
  while ((i >= 0) && !figures[i].figNr) {
    var prevFig = figures[i];
    if (prevFig) {
      if (prevFig.moveTo) {
        moveToFig = i;
      } else if (prevFig.moveForward) {
        moveForwardFig = i;
      } else if (prevFig.scale) {
        scaleFig = i;
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
  var el1 = document.getElementById('straightLine').firstChild;
  var el2 = document.getElementById('moveNoLine').firstChild;
  if (el1.getAttribute('src') == mask.on) {
    // set moveTo with straight line
    // remove any moveForward
    if (moveForwardFig != false) {
      updateSequence (moveForwardFig, '', true);
    }
    // replace any moveTo
    if ((Math.abs(moveX) > 0) || (Math.abs(moveY) > 0)) {
      var movePattern = '['+moveX+','+moveY+']';
      if (moveToFig != false) {
        // replace moveTo HERE!
        updateSequence (moveToFig, movePattern, true);
      } else {
        // add new moveTo
        updateSequence (selectedFigure.id - 1, movePattern, false);
        return;
      }
    } else if (moveToFig != false) {
      // remove moveTo
      updateSequence (moveToFig, '', true);
    }
  } else if (el2.getAttribute('src') == mask.on) {
    // set moveForward
    // remove any moveTo
    if (moveToFig != false) {
      updateSequence (moveToFig, '', true);
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

  // set entry extension
  var ext = document.getElementById('entryExt-value').value;
  if (ext < 0) {
    pattern = new Array(1 - ext).join(userpat.lineshorten) + '+' + pattern;
  } else if (ext > 0) {
    ext = ext / 3;
    pattern = new Array(parseInt(ext) + 1).join(userpat.longforward) + pattern;
    pattern = new Array(Math.round((ext-parseInt(ext))*3) + 1).join(userpat.forward) + pattern;
  }

  // set exit extension
  var ext = document.getElementById('exitExt-value').value;
  if (ext < 0) {
    pattern += '+' + new Array(1 - ext).join(userpat.lineshorten);
  } else if (ext > 0) {
    ext = ext / 3;
    pattern += new Array(parseInt(ext) + 1).join(userpat.longforward);
    pattern += new Array(Math.round((ext-parseInt(ext))*3) + 1).join(userpat.forward);
  }

  // when there was a flipYaxis in this figure, add it to the beginning
  // of the pattern
  if (figures[selectedFigure.id].string.indexOf(userpat.flipYaxis) > -1) {
    pattern = userpat.flipYaxis + pattern;
  }
  // update the sequence with the final pattern
  updateSequence (selectedFigure.id, pattern, true);
}

// latestVersion displays a link to download the latest version
// of OpenAero when a newer one than the one being used is available
function latestVersion() {
  var img = document.getElementById('latestVersion');
  img.removeAttribute('onerror');
  // Apply latest version img src
  img.setAttribute('src', 'http://openaero.net/openaero.php?f=version&version=' + version);
  // Hide the image on error (e.g. no internet connection)
  img.setAttribute('onerror', "this.style.display = 'none';");
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
  // put everything in sequenceXML variable
  sequenceXML = '<sequence>'
  var labels = new Array('pilot', 'aircraft', 'category', 'location', 'date', 'class', 'program', 'rules', 'positioning', 'notes', 'sequence_text', 'logo')
  for (i = 0; i < labels.length; i++) {
    sequenceXML = sequenceXML + '<' + labels[i] + '>' + document.getElementById(labels[i]).value + '</' + labels[i] + '>\n';
  }
  sequenceXML = sequenceXML + '</sequence>';
  // save sequenceXML in cookie 'sequence' for 6 years
  // unfortunately this will not work in Chrome from a local file
  setCookie ('sequence', sequenceXML, 2000);
}

function changeCombo(id) {
  var ruleName = document.getElementById('rules').value.toLowerCase();
  if (id == 'rules') {
    var categoryList = document.getElementById('categoryList');
  // Clean up the list
    while (categoryList.childNodes.length > 0) categoryList.removeChild(categoryList.lastChild);
    if (seqCheckAvail[ruleName]) {
      for (categoryName in seqCheckAvail[ruleName]['cats']) {
        var listItem = document.createElement('li');
        listItem.appendChild(document.createTextNode(seqCheckAvail[ruleName]['cats'][categoryName]['name']));
        categoryList.appendChild(listItem);
      }
    }
    document.getElementById('category').value = '';
    new combo('category','#cc9','#ffc');
    if (rulesLogo[ruleName]) selectLogo(rulesLogo[ruleName]);
  }
  if ((id == 'rules') || (id == 'category')) {
    var categoryName = document.getElementById('category').value.toLowerCase();
    var programList = document.getElementById('programList');
  // Clean up the list
    while (programList.childNodes.length > 0) programList.removeChild(programList.lastChild);
    if (seqCheckAvail[ruleName]['cats'][categoryName]) {
      for (programName in seqCheckAvail[ruleName]['cats'][categoryName]['seqs']) {
        var listItem = document.createElement('li');
        listItem.appendChild(document.createTextNode(seqCheckAvail[ruleName]['cats'][categoryName]['seqs'][programName]));
        programList.appendChild(listItem);
      }
    }
    document.getElementById('program').value = '';
    new combo('program','#cc9','#ffc');
  }
  if (id == 'program') {
    var ruleName = document.getElementById('rules').value.toLowerCase();
    var categoryName = document.getElementById('category').value.toLowerCase();
    var programName = document.getElementById('program').value.toLowerCase();
    if (seqCheckAvail[ruleName]['cats'][categoryName]['seqs'][programName]) {
// Load rules, check the sequence and display any alerts
      rulesActive = true;
      loadRules(ruleName, categoryName, programName);
    } else rulesActive = false;
  }
  changeSequenceInfo();
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
   field.focus();
}

// buildLogoSvg will create a logo svg from a provided image string, width and height
function buildLogoSvg(logoImage, width, height) {
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("version", "1.2");
  svg.setAttribute("baseProfile", "tiny");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
// svg images are included inline and scaled
  if (logoImage.match(/<svg/)) {
    parser = new DOMParser();
    var doc = parser.parseFromString(logoImage, "image/svg+xml");
    var svgBase = doc.getElementsByTagName('svg')[0];
    var scale = width / svgBase.getAttribute('width');
    if ((height / svgBase.getAttribute('height')) < scale) {
      scale = height / svgBase.getAttribute('height');
    }
    var group = document.createElementNS(svgNS, "g");
    group.setAttribute('transform', 'scale(' + scale + ')');
    group.appendChild(svgBase);
    svg.appendChild(group);
// other images are included through an xlink data url
  } else {
    var image = document.createElementNS (svgNS, "image");
    image.setAttribute('x', 0);
    image.setAttribute('y', 0);
    image.setAttribute('width', width);
    image.setAttribute('height', height);
    image.setAttribute('preserveAspectRatio', 'xMaxYMax');
    image.setAttributeNS(xlinkNS, 'href', logoImage);
    svg.appendChild (image);
  }
  svg.setAttribute("class", "logoSvg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  return svg;
}

// logoChooser will display the available logo's in the sequence window and allow for selection of a logo
function logoChooser() {
// define logo thumbnail width and height
  var width = 120;
  var height = 120;
  var container = document.getElementById('svgContainer');
// Clean up the svg container div
  while (container.childNodes.length > 0) container.removeChild(container.lastChild);
// Show selection text and file field
  container.innerHTML = '<div id=uploadLogo><p>' + userText.logoExplain +
    '</p><input type="file" id="logoFile" accept="image/*" ' +
    'onChange="openFile(document.getElementById(\'logoFile\').files[0], \'Logo\')">' +
    '</div><div id=chooseLogo></div>';
// Show all the logo images
  container = document.getElementById('chooseLogo');
  for (var logoName in logoImages) {
    var link = document.createElement('a');
    link.setAttribute("href", "#");
    link.setAttribute("onClick", "selectLogo('" + logoName + "')");
    container.appendChild(link);
    link.appendChild(buildLogoSvg(logoImages[logoName], width, height));
  }
}

// selectLogo is called when a logo is clicked in the logoChooser and will select the correct logo for use
function selectLogo(logo) {
  logoImg = logoImages[logo];
  document.getElementById('logo').value = logo;
  draw();
  drawActiveLogo();
  changeSequenceInfo();
}

// uploadLogo is used to upload a logo
function uploadLogo (file) {
  logoImages['mylogo'] = file;
  selectLogo ('mylogo');
}

// drawActiveLogo makes a small thumbnail of the active logo in the Sequence info and adds 'remove logo' link
function drawActiveLogo() {
  var width = 60;
  var height = 60;
  var container = document.getElementById('activeLogo');
  container.removeChild(container.lastChild);
// Make a link to the logoChooser
  var link = document.createElement('a');
  link.setAttribute("href", "#");
  link.setAttribute("onClick", "logoChooser()");
  container.appendChild(link);
// Create logo svg
  link.appendChild(buildLogoSvg(logoImg, width, height));

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
  
// parseFiguresFile parses the figures file and stores it in several arrays for fast retrieval
function parseFiguresFile () {
  var groupRegex = new RegExp('^F[0-9]');
  var figGroupSelector = document.getElementById('figureGroup');
  var figGroupNr = -1;
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
      figGroupSelector.appendChild(option);
    } else {
      if (splitLine[0]) {
        // Next we split the Aresti and K-factors part
        var arestiK = splitLine[1].split("(")
        var kFactors = arestiK[1].replace(")","").split(":");
        // Split K factors on the colon; kFactors[0] is for Powered, kFactors[1] is for Gliders
        fig[i] = {'aresti':arestiK[0], 'kpwrd':kFactors[0], 'kglider':kFactors[1], 'group':figGroupNr, 'pattern':splitLine[0]};
        // We will extract roll elements for everything but roll figures and (rolling) turns
        turnRegex = /[^o]j/;
        if (turnRegex.test(splitLine[0])) {
          theBase = splitLine[0];
          if (theBase in figBaseLookup) {
            figBaseLookup[theBase].push(i);
          } else figBaseLookup[theBase] = [i];
          fig[i].base = theBase;
          fig[i].draw = splitLine[2];
        } else if (splitLine.length > 2) {
          theBase = splitLine[0].replace(/[\d\(\)\_\^\&]+/g, '');
          if (theBase in figBaseLookup) {
            figBaseLookup[theBase].push(i);
          } else figBaseLookup[theBase] = [i];
          fig[i].base = theBase;
          fig[i].draw = splitLine[2];
        // Find which rolls are possible in this figure, handle the empty base of rolls on horizontal
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
          rollBase[i] = splitLine[0];
          rollAresti[i] = arestiK[0];
          rollKPwrd[i] = kFactors[0];
          rollKGlider[i] = kFactors[1];
        }
      }
    }
  }
}

// parseRulesFile walks through the rules file to find out which rules are available
function parseRulesFile() {
  for (var i=0; i<rules.length; i++) {
// Check for [section]
    if (rules[i].charAt(0) == '[') {
      var parts = rules[i].replace(/[\[\]]/g, '').split(" ")
      if (parts.length > 2) {
// Seems like a valid section name. Set correct rule, cat and seq.
        var ruleName = parts[0]
        var seqName = parts[parts.length - 1]
        parts.splice(parts.length - 1, 1)
  parts.splice(0, 1)
        var catName = parts.join(' ')
        if (!seqCheckAvail[ruleName.toLowerCase()]) seqCheckAvail[ruleName.toLowerCase()] = {'name':ruleName, 'cats':[]};
        if (!seqCheckAvail[ruleName.toLowerCase()]['cats'][catName.toLowerCase()]) seqCheckAvail[ruleName.toLowerCase()]['cats'][catName.toLowerCase()] = {'name':catName, 'seqs':[]};
  seqCheckAvail[ruleName.toLowerCase()]['cats'][catName.toLowerCase()]['seqs'][seqName.toLowerCase()] = seqName     
      }
    }
  }
  var rulesList = document.getElementById('rulesList')
  for (ruleName in seqCheckAvail) {
    var listItem = document.createElement('li')
    listItem.innerHTML = seqCheckAvail[ruleName]['name']
    rulesList.appendChild(listItem)
  }
}

// loadRules loads the rules for the active sequence and stores it in several arrays for fast retrieval
function loadRules(ruleName, catName, seqName) {
// Set parseSection to true to match the global rules
  var parseSection = true
  var ruleSection = '[' + ruleName + ' ' + catName + ' ' + seqName + ']'
// First clear the arrays
  checkAllowRegex = []
  checkAllowCatId = []
  checkCatGroup = []
  checkFigGroup = []
  checkRule = []
  defRules = []
// Walk through the rules
  for (var i=0; i<rules.length; i++) {
    rules[i] = sanitizeSpaces(rules[i])
// Check for [section] or (section) to match sequence type specific rules
    if ((rules[i].charAt(0) == '[') || (rules[i].charAt(0) == '(')) {
      if (rules[i].toLowerCase() == ruleSection.toLowerCase()) {
  parseSection = true;
      } else {
  parseSection = false;
      }
    } else if (parseSection) {
// when parseSection = true, continue
// First we remove any spaces around '=', this makes parsing easier
      rules[i] = rules[i].replace(/ *= */g, '=')
// We also remove spaces around : or ; except when it is a 'why-' line
      if (!rules[i].match(/^why-.+/)) {
  rules[i] = rules[i].replace(/ *: */g, ':')
  rules[i] = rules[i].replace(/ *; */g, ';')
      }
      if (rules[i].match(/^more=/)) {
// Apply 'more' rules
  var subRuleRegex = RegExp('^[\\\[\\\(]'+rules[i].replace('more=', '')+'[\\\]\\\)]')
  for (var j=(i+1); j<rules.length; j++) {
    if (rules[j].match(subRuleRegex)) break;
  }
  i = j
      } else if (rules[i].match(/^group-/)) {
// Apply 'group' rules => single catalog id match
  var newGroup = rules[i].replace(/^group-/, '').split('=')
  checkCatGroup[newGroup[0]] = new Array()
  checkCatGroup[newGroup[0]]['regex'] = RegExp(newGroup[1] + '[0-9\.]*', '')
      } else if (rules[i].match(/^Group-/)) {
// Apply 'Group' rules => full figure (multiple catalog id) match
  var newGroup = rules[i].replace(/^Group-/, '').split('=')
  checkFigGroup[newGroup[0]] = new Array()
  checkFigGroup[newGroup[0]]['regex'] = RegExp(newGroup[1] + '[0-9\.]*', 'g')
      } else if (rules[i].match(/^allow=/)) {
// Apply 'allow' rules
  var newCatLine = rules[i].replace(/^allow=/, '')
  var newCat = newCatLine.match(/^[^\s]*/g)
  var newRules = newCatLine.replace(newCat, '').split(';')
  for (var j = 0; j<newRules.length; j++) {
    newRules[j] = newRules[j].replace(/^\s+|\s+$/g, '')
  }
        checkAllowRegex.push ({'regex':RegExp(newCat, 'g'), 'rules':newRules})
      } else if (rules[i].match(/^allow-defrules=/)) {
// Apply 'allow-defrules' rules
  var newCatLine = rules[i].replace(/^allow-defrules=/, '')
  defRules = newCatLine.replace(/[\s]+/g, '').split(';')
      } else if (rules[i].match(/^[0-9]+\./)) {
// Apply figure number rules
// The key of checkAllowCatId is equal to the figure number
// The value is an array of rules that have to be applied
  var newCatLine = rules[i]
  var newCat = newCatLine.match(/^[^\s]*/g)[0]
  // Create an array with rules that have to be applied to the figure
  var newRules = newCatLine.replace(newCat, '').replace(/[\s]+/g, '').split(';')
  // When there are no rules we want an empty array, whereas split provides an array with one empty string
  if (newRules[0] == '') newRules = []
  // Check if the figure string applies to multiple figures, such as 1.1.1.1-4
  // If so, make a new checkAllowCatId for each figure
  var multiple = newCat.match(/[0-9]+\-[0-9]+$/)
  if (multiple) {
    multiple = multiple[0]
    for (var j = multiple.split('-')[0]; j < (parseInt(multiple.split('-')[1]) + 1); j++) {
      checkAllowCatId[newCat.replace(multiple, '') + j] = newRules
    }
  } else checkAllowCatId[newCat] = newRules
      } else if (rules[i].match(/[^-]+-min=\d+$/)) {
// Apply [group]-min rules
  var group = rules[i].replace(/-min/, '').split('=')
  if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['min'] = group[1];
  if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['min'] = group[1];
      } else if (rules[i].match(/[^-]+-max=\d+$/)) {
// Apply [group]-max rules
  var group = rules[i].replace(/-max/, '').split('=')
  if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['max'] = group[1];
  if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['max'] = group[1];
      } else if (rules[i].match(/[^-]+-repeat=\d+$/)) {
// Apply [group]-repeat rules
  var group = rules[i].replace(/-repeat/, '').split('=')
  if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['repeat'] = group[1];
  if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['repeat'] = group[1];
      } else if (rules[i].match(/[^-]+-minperfig=\d+$/)) {
// Apply [group]-minperfig rules
  var group = rules[i].replace(/-minperfig/, '').split('=')
  if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['minperfig'] = group[1];
  if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['minperfig'] = group[1];
      } else if (rules[i].match(/[^-]+-maxperfig=\d+$/)) {
// Apply [group]-maxperfig rules
  var group = rules[i].replace(/-maxperfig/, '').split('=')
  if (checkCatGroup[group[0]]) checkCatGroup[group[0]]['maxperfig'] = group[1];
  if (checkFigGroup[group[0]]) checkFigGroup[group[0]]['maxperfig'] = group[1];
      } else if (rules[i].match(/[^-]+-name=.+$/)) {
// Apply [group]-name rules
  var group = rules[i].replace(/-name/, '').split('=')
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
  var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^rule-/, '')
  var checkRuleParts = rules[i].replace('rule-'+newRuleName+'=', '')
  var colonPos = checkRuleParts.indexOf(':')
  checkRule[newRuleName] = {'conv':checkRuleParts.substring(0,colonPos), 'regex':RegExp(checkRuleParts.substring(colonPos + 1), 'g')}
      } else if (rules[i].match(/^why-[^=]+=.+/)) {
// Apply why-x rules
  var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why-/, '')
  if (checkRule[newRuleName]) checkRule[newRuleName]['why'] = rules[i].replace(/^[^=]+=/, '')
      }
    }
  }
// Check the loaded rules against the sequence and display any alerts
  checkRules()
  displayAlerts ()
}

// checkRules will check a complete sequence against the loaded rules and produce alerts where necessary
// the Aresti list according description in allowed.js is in the array figCheckLine
function checkRules () {
  var figNr = 0;
  figureK = 0;
  var connectors = 0;
  groupMatch = [];
  for (var i = 0; i < figures.length; i++) {
    aresti = figures[i].aresti;
    if (aresti) {
      k = figures[i].k;
      var figString = figCheckLine[figures[i].seqNr];
      figNr++;
      // Check if the figure is a connector
      if (regexConnector.test(figures[i].string)) {
        connectors++;
      } else {
        var figK = 0;
        var groupFigMatch = [];
      // Walk through the elements of the figure
        for (var j = 0; j < aresti.length; j++) {
      // Check all group rules on all elements
          for (group in checkCatGroup) {
            if (group != 'k') {
              var match = aresti[j].match(checkCatGroup[group]['regex']);
              if (match) {
                if (!groupFigMatch[group]) groupFigMatch[group] = [];
                groupFigMatch[group].push(match[0]);
                if (!groupMatch[group]) groupMatch[group] = [];
                groupMatch[group].push(match[0]);
              }
              // Do checks after the last aresti code of the figure has been processed
              if (j == (aresti.length - 1)) {
                if (groupFigMatch[group]) {
                  if (checkCatGroup[group]['maxperfig'] && (groupFigMatch[group].length > checkCatGroup[group]['maxperfig'])) {
                    checkAlert(group, 'maxperfig', figNr);
                  }
                  if (checkCatGroup[group]['minperfig'] && (groupFigMatch[group].length < checkCatGroup[group]['minperfig'])) {
                    checkAlert(group, 'minperfig', figNr);
                  }
                }
              }
            }
          }
          // Check for specific allowed figures if the checkAllowCatId object is not empty
          // Used only for Unknowns at this point (2012)
          if (Object.keys(checkAllowCatId).length > 0) {
            if (!(aresti[j] in checkAllowCatId)) {
              checkAlert (aresti[j], 'notAllowed', figNr);
            }
          }
          
          figK = figK + parseInt(k[j]);
        }
        // Run rule checks on specific allowed figures if the checkAllowCatId object is not empty
        // Used only for Unknowns at this point (2012)
        if (Object.keys(checkAllowCatId).length > 0) {
          var arestiNr = figString.split(' ')[0];
          if (arestiNr in checkAllowCatId) {
            // Apply rules to the figure
            for (k = 0; k < checkAllowCatId[arestiNr].length; k++) {
            // Run the checks on the rolls
              var checkLine = figString.replace(arestiNr + ' ', '');
              rule = checkAllowCatId[arestiNr][k];
              // Apply conversions to the Aresti number before checking the rule
              if (checkRule[rule]['conv']) {
                var conversion = checkRule[rule]['conv'];
                for (l = 0; l < checkConv[conversion].length; l++) {
                  checkLine = checkLine.replace(checkConv[conversion][l]['regex'], checkConv[conversion][l]['replace']);
                }
              }
              if (checkLine.match(checkRule[rule]['regex'])) {
                checkAlert (checkRule[rule]['why'], 'rule', figNr);
              }
            }
            // Check default rules when applicable
            if (defRules != []) {
              for (k = 0; k < defRules.length; k++) {
                var checkLine = figString.replace(arestiNr + ' ', '');
                rule = defRules[k];
                // Apply conversions to the Aresti number before checking the rule
                if (checkRule[rule]['conv']) {
                  var conversion = checkRule[rule]['conv'];
                  for (l = 0; l < checkConv[conversion].length; l++) {
                    checkLine = checkLine.replace(checkConv[conversion][l]['regex'], checkConv[conversion][l]['replace']);
                  }
                }
                if (checkLine.match(checkRule[rule]['regex'])) {
                  checkAlert (checkRule[rule]['why'], 'rule', figNr);
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
            for (j = 0; j < match.length; j++) groupMatch[group].push(match[j]);
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
      figureK = figureK + figK;
    }
    if (checkCatGroup['k']['min']) {
      if (figureK < checkCatGroup['k']['min']) checkAlert('k', 'min');
    }
    if (checkCatGroup['k']['max']) {
      if (figureK > checkCatGroup['k']['max']) checkAlert('k', 'max');
    }
  }
// Run checks on maximum and minimum occurrence of a group (catalog ID)
// Go through all groups
  for (group in checkCatGroup) {
// Did we have a match on this group?
    if (groupMatch[group]) {
// Check for max and min occurrences of the group
      if (checkCatGroup[group]['max'] && (groupMatch[group].length > checkCatGroup[group]['max'])) checkAlert(group, 'max')
      if (checkCatGroup[group]['min'] && (groupMatch[group].length < checkCatGroup[group]['min'])) checkAlert(group, 'min')
// Check for repeats of the exact same figure when necessary
      if (checkCatGroup[group]['repeat']) {
  var matches = []
  for (j = 0; j < groupMatch[group].length; j++) {
    if (matches[groupMatch[group][j]]) matches[groupMatch[group][j]]++; else matches[groupMatch[group][j]] = 1
  }
  for (match in matches) {
    if (checkCatGroup[group]['repeat'] && (matches[match] > checkCatGroup[group]['repeat'])) checkAlert(group, 'repeat')
  }
      }
    } else {
// No occurrences of this group, was there a minimum?
      if (checkCatGroup[group]['min']) checkAlert(group, 'min')
    }
  }
// Run checks on maximum and minimum occurrence of a Group (complete figure)
// Go through all groups
  for (group in checkFigGroup) {
// Did we have a match on this group?
    if (groupMatch[group]) {
// Check for max and min occurrences of the group
      if (checkFigGroup[group]['max'] && (groupMatch[group].length > checkFigGroup[group]['max'])) checkAlert(group, 'figmax')
      if (checkFigGroup[group]['min'] && (groupMatch[group].length < checkFigGroup[group]['min'])) checkAlert(group, 'figmin')
// Check for repeats of the exact same figure when necessary
      if (checkFigGroup[group]['repeat']) {
  var matches = []
  for (j = 0; j < groupMatch[group].length; j++) {
    if (matches[groupMatch[group][j]]) matches[groupMatch[group][j]]++; else matches[groupMatch[group][j]] = 1
  }
  for (match in matches) {
    if (checkFigGroup[group]['repeat'] && (matches[match] > checkFigGroup[group]['repeat'])) checkAlert(group, 'figrepeat')
  }
      }
    } else {
// No occurrences of this group, was there a minimum?
      if (checkFigGroup[group]['min']) checkAlert(group, 'figmin')
    }
  }
}

// checkAlert adds an alert resulting from sequence checking
// 'value' represents a value for processing
// 'type' represents the type of checking error
function checkAlert (value, type, figNr) {
  if (figNr) alertFig = '(' + figNr + ') '; else alertFig = ''
  switch (type) {
    case 'maxperfig':
      alertMsgs.push(alertFig + 'Not more than ' + checkCatGroup[value]['maxperfig'] + ' of ' + checkCatGroup[value]['name'] + ' per figure')
      break;
    case 'minperfig':
      alertMsgs.push(alertFig + 'At least ' + checkCatGroup[value]['minperfig'] + ' of ' + checkCatGroup[value]['name'] + ' per figure')
      break   
    case 'max':
      alertMsgs.push(alertFig + 'Not more than ' + checkCatGroup[value]['max'] + ' of ' + checkCatGroup[value]['name'] + ' allowed')
      break;
    case 'min':
      alertMsgs.push(alertFig + 'At least ' + checkCatGroup[value]['min'] + ' of ' + checkCatGroup[value]['name'] + ' required')
      break;
    case 'repeat':
      alertMsgs.push(alertFig + 'Not more than ' + checkCatGroup[value]['repeat'] + ' exact repetitions of ' + checkCatGroup[value]['name'] + ' allowed')
      break;
    case 'figmax':
      alertMsgs.push(alertFig + 'Not more than ' + checkFigGroup[value]['max'] + ' of ' + checkFigGroup[value]['name'] + ' allowed')
      break;
    case 'figmin':
      alertMsgs.push(alertFig + 'At least ' + checkFigGroup[value]['min'] + ' of ' + checkFigGroup[value]['name'] + ' required')
      break;
    case 'figrepeat':
      alertMsgs.push(alertFig + 'Not more than ' + checkFigGroup[value]['repeat'] + ' exact repetitions of ' + checkFigGroup[value]['name'] + ' allowed')
      break;
    case 'rule':
      alertMsgs.push(alertFig + value)
      break;
    case 'notAllowed':
      alertMsgs.push(alertFig + value + ' is not allowed in this sequence')
  }
}

// changeFigureGroup updates the figure group in the figure chooser
function changeFigureGroup(e) {
  var aresti = [];
  var figureGroup = e.value;
  var table = document.getElementById('figureChooserTable');
  var container = document.getElementById('figureSvgContainer');
  // figureSvg holds the figures for selection
  var svg = document.getElementById('figureChooserSvg');

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
          figure = figure.replace(figpat.halfroll, '2');
          figures[-1] = [];
          if (figure[0] != '-') {
            Attitude = 0;
            Direction = 0;
          } else {
            Attitude = 180;
            Direction = 180;
          }
          // build the figure and replace line paths by thicker line paths
          buildFigure ([i], figure, false, -1);
          var paths = figures[-1].paths;
          for (j = paths.length - 1; j >= 0; j--) {
            if (paths[j].style == 'neg') paths[j].style = 'chooserNeg'; else if (paths[j].style == 'pos') paths[j].style = 'chooserPos';
          }
          figures[-1] = {'paths': paths};
          // clear the svg
          prepareSvg(svg);
          // draw the figure
          drawFullFigure(-1, true, svg);
          // retrieve the group holding the figure and set viewbox
          var group = svg.getElementById('figure-1');
          var bBox = group.getBBox();
          var xMargin = bBox.width / 20;
          var yMargin = bBox.height / 20;
          group.setAttribute('transform', 'translate(' + roundTwo((xMargin - bBox.x)) + ' ' + roundTwo((yMargin - bBox.y)) + ')')
          svg.setAttribute('viewBox', '0 0 '+roundTwo(bBox.width+xMargin*2)+' '+roundTwo(bBox.height+yMargin*2));
          svg.setAttribute('width', 100);
          svg.setAttribute('height', 100);
          svg.setAttribute('id', 'figureChooser'+i);
          // add the svg to fig[i] as xml text
          fig[i].svg = new XMLSerializer().serializeToString(svg);
          svg.setAttribute('id', 'figureChooserSvg');
        }
        if (fig[i].aresti.match(/\.[013]$/)) {
          var tr = document.createElement('tr');
          table.appendChild(tr);
        }
        var td = document.createElement('td');
        tr.appendChild(td);
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.setAttribute('id', i);
        a.setAttribute('onmousedown', 'selectFigure(this);');
        a.innerHTML = fig[i].svg;
        td.appendChild(a);
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
}

// selectFigure is executed when clicking a figure in the figureChooser
// (e = object) or from grabFigure (e = figNr) or false
function selectFigure (e) {
  if (!(e === false)) {
    // show figure editor tab
    selectTab ('tab-figureInfo');
  }
  if (typeof e === 'object') {
    // Replace the selected figure or add a new figure at the end
    // first we take the original base and remove + and full/any roll symbols
    var figure = fig[e.id].pattern.replace(/[\+\_\&]/g, '');
    // Special case, put 0 for a horizontal line
    if (fig[e.id].pattern == '+_+') figure = '0';
    // next we replace half roll symbols by actual half rolls
    figure = figure.replace(/\^/g, '2');
    // See if a figure was grabbed already. If so, replace it
    if (selectedFigure.id != null) {
      updateSequence(selectedFigure.id, figure, true)
    } else {
      // otherwise, add a new figure at the end
      updateSequence(figures.length - 1, figure, false);
      setFigureSelected(figures.length - 1);
    }
  } else if (!(e === false)) {
    setFigureSelected(e);
    var figNr = figures[selectedFigure.id].figNr;
//    setFigChooser(figNr);
    e = SVGRoot.getElementById('figure'+e);
  }
  var figureSelector = document.getElementById('figureSelector');
  var elFT = document.getElementById('addFigureText');
  if (!(e === false)) {
    // hide the figure selector but highlight the chosen figure
    // in case the figure selector is shown again
    hideFigureSelector ();
    var table = document.getElementById('figureChooserTable');
    var selected = table.getElementsByClassName('selected');
    // remove selected class for all
    for (var i = 0; i < selected.length; i++) selected[i].removeAttribute('class');
    // add selected class to figure
    e.parentNode.setAttribute('class', 'selected');
    updateFigureEditor();
    elFT.parentNode.setAttribute('class', "hoverdisplay");
    elFT.firstChild.innerHTML = userText.clickChangeFigure;
    setFigChooser(figures[selectedFigure.id].figNr);
    
    // select the figure in the sequence text when we were not editing
    // in the text. DISABLED NOW: CAUSING TROUBLE
/*    var el = sequenceText;
//    if (!el.hasFocus) {
      el.focus();
      el.setAttribute('selectionStart', figures[selectedFigure.id].stringStart);
      el.setAttribute('selectionEnd', figures[selectedFigure.id].stringEnd);
      //createSelection (el, figures[selectedFigure.id].stringStart, figures[selectedFigure.id].stringEnd);
//    }
*/
  } else {
    setFigureSelected(null);
    updateFigureEditor();
    hideFigureSelector();
    changeFigureGroup(document.getElementById('figureGroup'));
    document.getElementById('selectedFigureSvg').innerHTML = "";
    elFT.parentNode.removeAttribute('class');
    elFT.firstChild.innerHTML = userText.clickAddFigure;
    document.getElementById('figureHeader').innerHTML = userText.addingFigure;
  }
}

// ###################################################
// Functions for creating complete sequences

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
  figureK = 0;
  for (var i = 0; i < figures.length; i++) {
    aresti = figures[i].aresti;
    k = figures[i].k;
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
      if (regexConnector.test(figures[i].string)) {
        figK = connectorsTotalK / connectors;
        if (aresti.length < 2) blockY += 12;
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 4, 'miniFormA');
        drawText ('Conn.', blockX + 4, (topBlockY + blockY) / 2 + 16, 'miniFormA');
      } else {
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 10, 'miniFormA');
      }
      drawText (figK, blockX + 130, (topBlockY + blockY) / 2 + 10, 'miniFormA');
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

// mouseOverFigureStart will highlight the figure over the start of which the mouse hovers
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
         // move this element to the "top" of the display, so it is always over other elements
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
        
        // the DragTarget id is the new selectedFigure.id
        selectFigure(DragTarget.id.replace('figure', ''));
         
     } else selectFigure(false);
   } else selectFigure(false);
};

// setFigChooser sets the figure chooser to the correct group and
// highlights the figure provided by figNr
function setFigChooser (figNr) {
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
  td.setAttribute('class', 'selected');
  div.scrollTop = scroll;
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

  if (figNr != null) {
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
  // put the coordinates of object evt in TrueCoords global
   TrueCoords.x = evt.clientX;
   TrueCoords.y = evt.clientY;

  // if we don't currently have an element in tow, don't do anything
  if (DragTarget) {
    // Don't drag figure 0, it's auto positioned
    if (DragTarget.id != 'figure0') {
      // account for the offset between the element's origin and the
      //    exact place we grabbed it... this way, the drag will look more natural
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
};

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
      
      // create new moveTo for dragged elements
      if (transform) {
        var dxdy = transform.match(/[0-9\-\.]*,[0-9\-\.]*/)[0].split(',');
        var dx = parseInt(dxdy[0] / lineElement)
        var dy = parseInt(dxdy[1] / lineElement)
        // reverse direction for dragging in Form C
        if (activeForm == 'C') dx = -dx;
        updateSequence (DragTarget.id.replace('figure', '') - 1, '[' + dx + ',' + dy + ']', false)
      }
      
      // set the global variable to null, so nothing will be dragged until we
      //    grab the next element
      DragTarget = null;
   }
};

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
  if (activeSequence.text.replace(' '+userpat.subSequence+' ','').indexOf(userpat.flipYaxis) > -1) {
    // disable flip
    sequenceText.value = sequenceText.value.replace(regexFlipYAxis, '$1$2');
  } else {
    // add flip to first real figure, if it exists
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) {
        updateSequence (i, userpat.flipYaxis + figures[i].string, true);
        break;
      }
    }
      //sequenceText.value = userpat.flipYaxis + sequenceText.value;
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
//  do {
//    var option = document.getElementById('entryOption');
//    if (option) el.removeChild(option);
//  } while (option)
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

// separateFigures separates all the figures from each other
function separateFigures () {
  // Only do anything if we're not in Form A and there is more than 1 figure
  if ((activeForm != 'A') && figures.length > 1) {
    for (i = 1; i < figures.length; i++) {
      var bBox = figures[i].bBox
      if (bBox) {
        var moveDown = 0
        do {
          var iterate = false;
          for (var j = i - 1; j > -1; j--) {
            var bBoxJ = figures[j].bBox
            if (bBoxJ) {
              if (((bBox.x + bBox.width) > bBoxJ.x) && ((bBox.y + bBox.height) > bBoxJ.y)) {
                if ((bBox.x < (bBoxJ.x + bBoxJ.width)) && (bBox.y + moveDown) < (bBoxJ.y + bBoxJ.height)) {
                  moveDown = bBoxJ.y + bBoxJ.height - bBox.y
                  iterate = true;
                }
              }
            }
          }
        } while (iterate == true);
        if (moveDown > 0) {
          moveDown = Math.ceil(moveDown/lineElement)
  // No longer necessary because we redraw every time. This code could be
  // quicker but needs extra work. Keep it here just in case...
  //        for (j = i; j < figures.length; j++) {
  //          if (figures[j].bBox) figures[j].bBox.y = figures[j].bBox.y + (moveDown * lineElement)
  //        }
          updateSequence(i - 1, '[0,' + moveDown + ']', false)
        }
      }
    }
    checkSequenceChanged();
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
  svgElement = svg.getElementById('sequence')
  var paths = figures[i].paths
// Create a group for the figure, draw it and apply to the SVG
  var group = document.createElementNS (svgNS, "g")
  group.setAttribute('id', 'figure' + i)
  if ((selectedFigure.id == i) && draggable) {
    group.setAttribute('filter', 'url(#selectFilter)');
  }
  // put the group in the DOM
  svgElement.appendChild(group)
  for (var j = 0; j < paths.length; j++) {
    drawShape (paths[j], group)
  }
  if (draggable) {
    figures[i].bBox = group.getBBox();
  }
}

// makeFormA creates Form A from the figures array
function makeFormA() {
  yAxisOffset = yAxisOffsetDefault;
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
  var columnTitles = Array('No:20', 'Symbol:100', 'Cat. No.:70', 'K:30', 'Total K:60', 'Marks:80', 'Remarks:220', 'Pos:40');
  var columnWidths = Array(20, 100, 70, 30, 60, 40, 40, 220, 40);
  var rowHeight = parseInt((1000 - columnTitleHeight) / figNr);
  if (rowHeight > 125) rowHeight = 125;
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
    var aresti = figures[i].aresti
    var k = figures[i].k
    if (aresti) {
      var x = 0
      for (var column = 0; column < 9; column++) {
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
      if (regexConnector.test(figures[i].string)) figK = connectorsTotalK / connectors;
      break;
    case (4):
      drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
      drawText (figK, x + columnWidths[column] / 2, y + rowHeight / 2, 'FormATextLarge', 'middle')
      var superFamily = getSuperFamily (aresti, document.getElementById('category').value)
      if (superFamily) drawText('SF ' + superFamily,  x + columnWidths[column] / 2, y + rowHeight - 10, 'FormAText', 'middle')
            if (regexConnector.test(figures[i].string)) drawText('connect',  x + columnWidths[column] / 2, y + 12, 'FormAText', 'middle')
      figureK = figureK + figK
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
      drawLine (x + columnWidths[column], y, 0, rowHeight, 'FormLineBold')
  }
  if ((row == 0) && (column > 4)) drawLine (x, y, columnWidths[column], 0, 'FormLineBold')
  if ((row == (figNr - 1)) && (column > 4)) drawLine (x, y + rowHeight, columnWidths[column], 0, 'FormLineBold')
  x = x + columnWidths[column]
      }
      y = y + rowHeight
      row++
    }
  }
  SVGRoot.setAttribute("viewBox", '0 0 800 1000');
  SVGRoot.setAttribute("width", '800px');
  SVGRoot.setAttribute("height", '1000px');
}

// makeFormB creates Form B from the figures array
function makeFormB() {
  yAxisOffset = yAxisOffsetDefault
  Direction = 0
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].paths) drawFullFigure(i, figures[i]['paths'][0]['figureStart']);
  }

// Find out how big the SVG has become and adjust margins
  var bBox = SVGRoot.getBBox()
  x = parseInt(bBox['x']) 
  y = parseInt(bBox['y'])
  w = parseInt(bBox['width'])
  h = parseInt(bBox['height'])
  y = y - 40
  h = h + 40
  drawWind ((w + x) + 172, y, 1)
// Add mini Form A
  var block = makeMiniFormA ((w + x) + 20, y + 50)
  w = w + 20 + block['width']
  if ((50 + block['height']) > h) h = (50 + block['height'])
// Change the viewBox to make the sequence fit
  viewBox = (x - 3) + ' ' + (y - 3) + ' ' + (w + 5) + ' ' + (h + 5)
  SVGRoot.setAttribute("viewBox", viewBox);
  SVGRoot.setAttribute("width", w + 5);
  SVGRoot.setAttribute("height", h + 5);
  // Put an image at the figure start with a hover link
  // The hover link will light up the complete figure
  // markFigureStarts(-x,-y)    
}

// makeFormC creates Form C from the figures array
function makeFormC() {
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].paths) drawFullFigure(i, figures[i]['paths'][0]['figureStart'])
  }
// Find out how big the SVG has become and adjust margins
  var bBox = SVGRoot.getBBox()
  x = parseInt(bBox['x']) 
  y = parseInt(bBox['y'])
  w = parseInt(bBox['width'])
  h = parseInt(bBox['height'])
  y = y - 40
  h = h + 40
  drawWind (x, y, -1)
// Add mini Form A
  var block = makeMiniFormA ((w + x) + 20, y + 50)
  w = w + 20 + block['width']
  if ((50 + block['height']) > h) h = (50 + block['height'])
// Change the viewBox to make the sequence fit
  viewBox = (x - 3) + ' ' + (y - 3) + ' ' + (w + 5) + ' ' + (h + 5) + ''
  SVGRoot.setAttribute("viewBox", viewBox);
  SVGRoot.setAttribute("width", (w + 5) + 'px');
  SVGRoot.setAttribute("height", (h + 5) + 'px');
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
    container.appendChild (document.createElement('br'))
    var htmlText = document.createElement('span')
    container.appendChild (htmlText)
    htmlText.innerHTML = alertMsgs[i]
  }
// Clear all alerts
  alertMsgs = []
}

// do some kind of draw
function draw () {
  rebuildSequenceSvg ();
  firstFigure = true;
  Attitude = 0;
  X = 0;
  Y = 0;
  var content = ''
  if (activeForm == 'C') {
    yAxisOffset = 180 - yAxisOffsetDefault;
    Direction = 180;
  } else {
    yAxisOffset = yAxisOffsetDefault;
    Direction = 0;
  }
  
  parseSequence();

  if (activeForm == 'A') {
    makeFormA();
  } else if (activeForm == 'B') {
    makeFormB();
  } else makeFormC();
  // check if selectedFigure.id is still valid
  if (!figures[selectedFigure.id]) selectFigure(false);
  displayAlerts ();
}

// checkSequenceChanged is called by onInput or onKeyUp on the
// sequence input field to check if it has to be redrawn
function checkSequenceChanged () {
  var el = sequenceText;
  // read the sequence string and mark the location of the caret/selection
  var selStart = el.selectionStart;
  var selectFigureId = false;
  if (activeSequence.text != sequenceText.value) {
    activeSequence.text = sequenceText.value;
    string = activeSequence.text;
    
    var figure = [];
    var thisFigure = {'string':'', 'stringStart':0, 'stringEnd':0};
    for (var i =0; i <= string.length; i++) {
      if ((string[i] == ' ') || (i == string.length)) {
        if (thisFigure.string != '') {
          var match = thisFigure.string.match (regexMoveForward);
          // Create a separate 'figure' for moveForward (x>) at the beginning of a figure.
          // OLAN has it coupled to a figure but OpenAero keeps sequence drawing instructions separate
          if (match) {
            figure.push ({'string':match[0], 'stringStart':thisFigure.stringStart, 'stringEnd':(thisFigure.stringStart + match[0].length)});
            thisFigure.stringStart = thisFigure.stringStart + match[0].length;
            thisFigure.string = thisFigure.string.replace(regexMoveForward, '');
          }
          // only add figures that are not empty
          if (thisFigure.string != '') {
            figure.push ({'string':thisFigure.string, 'stringStart':thisFigure.stringStart, 'stringEnd':i});
            thisFigure.string = '';
            // make the selected figure the same as the one selected in the string
            if ((selStart >= thisFigure.stringStart) && (selStart < i)) {
              if (selectedFigure.id != (figure.length - 1)) {
                selectFigureId = figure.length - 1;
              }
            }
          }
        }
      } else {
        // set the start when this is the first character
        if (thisFigure.string == '') thisFigure.stringStart = i;
        // add the character
        thisFigure.string += string[i];
      }
    }
    
    // Now assign to activeSequence      
    activeSequence.figures = figure;

    // Get current scroll position of the sequence
    var scrollPosition = SVGRoot.parentNode.scrollTop;
    
    // Redraw sequence
    draw ();
    
    // Select the correct figure when applicable
    if (!(selectFigureId === false)) selectFigure (selectFigureId);
    
    // Set the correct scroll position
    SVGRoot.parentNode.scrollTop = scrollPosition;
    
    // Prevent OpenAero from being left unintentionally
    sequenceSaved = false;
    window.onbeforeunload = function(e){return userText.confirmLeave;}
    
    // Update sequenceXML and cookie
    changeSequenceInfo();
    
    // Update figure editor when a figure is being edited
    if (!(selectedFigure.id === null)) updateFigureEditor();
  } else if (el == document.activeElement) {
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
    if (selectFigureId != selectedFigure.id) selectFigure (selectFigureId);
  }
}

// select which Form to show
function selectForm (form) {
  activeForm = form;
  draw (form);
}

// ####################################################
// Functions for opening and saving files

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

// openFile is called to open a file
// file = file object from file input element
// handler = name of correct handler to execute after loading. Function names are loaded<handler>
function openFile (file, handler) {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  // obtain input element through DOM 
    if(file){
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      // Handle success, and errors. With onload the correct loading function will be called
      reader.onload = eval ('loaded' + handler);
      reader.onerror = errorHandler;
    }
  } else {
    alert(userText.fileOpeningNotSupported);
  }
}

// loadedSequence will be called when a sequence file has been loaded
function loadedSequence(evt) {
  // First we clear the sequence info
  var seqInfo = document.getElementById ('sequenceInfo');
  var nodes = seqInfo.getElementsByClassName ('item');
  for (var ele in nodes) {
    if (nodes[ele].lastChild) nodes[ele].lastChild.value = '';
  }
  // Obtain the read file data  
  var fileString = evt.target.result
// Check if we have an OLAN sequence or an OpenAero XML sequence
// If the sequence file starts with '<', assume it's an XML sequence
  if (fileString.charAt(0) == '<') {
    activateXMLsequence (fileString);
  } else {
    var lines = fileString.replace('\r', '').split('\n');
    for (var i = 0; i < lines.length; i = i + 2) {
      var key = lines[i].toLowerCase().replace(/[^a-z]/g, '');
      var value = lines[i + 1];
      if (key == 'sequence') {
        key = 'sequence_text';
      }
      if (document.getElementById(key) && value) {
        document.getElementById(key).value = value;
      }
    }
  }
  logo = document.getElementById('logo').value;
  if (logoImages[logo]) selectLogo(logo);
// Draw the sequence and change the browser title after loading
  checkSequenceChanged();
  changeSequenceInfo();
  sequenceSaved = true;
  window.onbeforeunload = null;

// Activate the loading of the checking rules (if any)
  changeCombo('program');
}

// activateXMLsequence will make a sequence provided as XML active
function activateXMLsequence (xml) {
  var myElement = document.createElement('div');
  myElement.innerHTML = xml;
  var rootNode = myElement.getElementsByTagName("sequence")[0];
  var nodes = rootNode.childNodes;
// Put every element in the correct field. Replace &gt; by >
  for (var ele in nodes) {
    if(nodes[ele].innerHTML) {
      document.getElementById(nodes[ele].nodeName.toLowerCase()).value = nodes[ele].innerHTML.replace(/\&gt\;/g, '>');
    }
  }
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
// If we are running on a server we use a bounce from PHP to save files
  if (window.location.protocol == 'http:' || window.location.protocol == 'https:') {

    // Giving IE a chance to build the DOM in
    // the iframe with a short timeout:

    setTimeout(function(){

      var form = document.getElementById("saveFileForm");

      form.elements["data"].value = data;
      form.elements["name"].value = name;
      form.elements["format"].value = format;
      // Submitting the form to download.php. This will
      // cause the file download dialog box to appear.
      form.submit();
    },50);
  } else {
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
    html += '<div class=largeButton><a download="' + name + '" href="data:' + format +
      ',' + data + '" download="' + name + '">' + name + '</a></div>';
    alertBox(html);
  }
  return result;
}

// saveSequence will save a sequence to a .seq file
// the .seq file is standard xml, so not OLAN compatible
function saveSequence () {
  var sequence = sequenceXML;
  var fileName = document.getElementById('location').value+' '+
    document.getElementById('category').value+' '+
    document.getElementById('program').value+' '+
    document.getElementById('pilot').value;
  fileName = fileName.replace(/^\s+|\s+$/g, '');
  if (fileName == '') fileName = 'sequence';
  if (saveFile (sequence, fileName + '.seq', {'name':'OpenAero Sequence', 'filter':'*.seq'}, 'text/xhtml+xml;utf8')) {
    sequenceSaved = true;
    window.onbeforeunload = null;
  } else {
    sequenceSaved = false;
    // Prevent OpenAero from being left unintentionally
    window.onbeforeunload = function(e){return userText.confirmLeave;};
  }
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

/********************************
 * Functions for handling cookies
 */
 
function setCookie(c_name,value,exdays) {
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
  var i,x,y,ARRcookies=document.cookie.split(";");
  for (i=0;i<ARRcookies.length;i++) {
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x==c_name) return unescape(y);
  }
}

/********************************
 * Functions for printing
 */

// printAllForms will print forms A,B and C. This can also be used to output them to PDF
function printAllForms () {
  // make sure nog figure is selected
  selectFigure (false);
  var activeFormSave = activeForm;
  // Open a new window for the print
  myWindow = window.open('',"printForms","width=900,height=700,top=50");
  myWindow.document.title = userText.printForms;
  var pages = new Array('A', 'B', 'C');
  myWindow.document.write('<html><head><style type="text/css"' +
    'media="print">body {margin: 0px;}@page {size:A4 portrait;margin:0mm;}</style></head><body>')
  for (var i = 0; i<pages.length; i++) {
    activeForm = pages[i];
    draw ();
    if (i < (pages.length - 1)) {
      var divClass = 'breakAfter';
    } else var divClass = '';
    myWindow.document.write('<div class="' + divClass + '">' +
      buildPrintForm (SVGRoot) + '</div>');
  }
  myWindow.document.write('</body></html>');
  // use setTimeout for printing to prevent blocking and
  // associated warnings by the browser
  setTimeout (function(){myWindow.print();  myWindow.close();
}, 100);
  // Reset the screen to the normal view
  activeForm = activeFormSave;
  draw ();
}
  
// buildPrintForm will build a complete SVG string for printing a form
// from a provided SVG object and activeForm global.
// The default size of the page is A4, 800x1130
function buildPrintForm (svg) {
// Find the size and adjust scaling if necessary, upscaling to a maximum factor of 2
// The sequence max width=800, height=1000
  var bBox = svg.getBBox();
  w = parseInt(bBox['width']);
  h = parseInt(bBox['height']);
// For form A we need to add the righthand scoring column, so max width = 620
  if (activeForm == 'A') {
    var scale = 620 / w;
    var marginTop = 130;
  } else {
    var scale = 800 / w;
    var marginTop = 140;
// For some reason the bounding box at the bottom is not always correct for Form B and C
// So we add 16 at the bottom to make sure it's all on the form; HACK
    h = h + 16;
  }
  if ((1000 / h) < scale) scale = 1000 / h;
  if (scale > 2) scale = 2;
  if (activeForm == 'A') {
    var moveRight = (620 - (w * scale));
  } else var moveRight = (800 - (w * scale));
  svg.getElementById('sequence').setAttribute('transform', 'translate(' +
    (moveRight - (bBox['x'] * scale)) + ',' + (marginTop - bBox['y']*scale) +
    ') scale(' + scale + ')');
// Insert rectangle (=background) before sequence

  var path = document.createElementNS (svgNS, "rect");
  path.setAttribute('x', '-5');
  path.setAttribute('y', '-5');
  path.setAttribute('width', '810');
  path.setAttribute('height', '1140');
  path.setAttribute('style',style['FormBackground']);
  svg.insertBefore(path, svg.getElementById('sequence'));

  svg.setAttribute("viewBox", '-5 -5 810 1140');
  svg.setAttribute("width", '200mm');
  svg.setAttribute("height", '280mm');
// Add all necessary elements
  buildPrintHeader (svg);
  if (activeForm == 'A') buildPrintScoreColumn (svg);
  buildPrintCornertab (svg);
  if (logoImg) buildPrintLogo (svg);
// For some reason serializeToString may convert the xlink:href to
// a0:href or just href for the logo image
// So we change it back right away because otherwise the logo isn't displayed
  var sequenceSVG = new XMLSerializer().serializeToString(svg).replace (/ [^ ]*href/, ' xlink:href');
  sequenceSVG = '<?xml version="1.0" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
    '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + sequenceSVG;
  return sequenceSVG;
}

// buildPrintHeader will append the sequence header
function buildPrintHeader (svg) {
  drawRectangle (130, 0, 590, 65, 'FormLine', svg);
  drawText (document.getElementById('location').value + ' ' +
    document.getElementById('date').value, 425, 33, 'FormATextLarge', 'middle', '', svg);
  drawRectangle (720, 0, 80, 65, 'FormLine', svg);
  drawText ('Form ' + activeForm, 760, 33, 'FormATextLarge', 'middle', '', svg);
  drawRectangle (130, 65, 80, 65, 'FormLine', svg);
  drawText ('Pilot ID', 135, 75, 'miniFormA', 'start', '', svg);
  drawRectangle (210, 65, 510, 65, 'FormLine', svg);
  drawText (document.getElementById('category').value + ' Programme ' +
    document.getElementById('program').value, 465, 98, 'FormATextLarge', 'middle', '', svg);
  drawRectangle (720, 65, 80, 65, 'FormLine', svg);
  drawText ('Flight #', 725, 75, 'miniFormA', 'start', '', svg);
}

// buildPrintScoreColumn will append the righthand scoring column
function buildPrintScoreColumn (svg) {
  drawRectangle (620, 130, 60, 50, 'FormLine', svg);
  drawText ('Item', 650, 155, 'FormAText', 'middle', '', svg);
  drawRectangle (680, 130, 40, 50, 'FormLine', svg);
  drawText ('K', 700, 155, 'FormAText', 'middle', '', svg);
  drawRectangle (720, 130, 80, 50, 'FormLine', svg);
  drawText ('Grade', 760, 155, 'FormAText', 'middle', '', svg);

  drawRectangle (620, 180, 60, 50, 'FormLine', svg);
  drawText ('Pos', 650, 205, 'FormAText', 'middle', '', svg);
  drawRectangle (680, 180, 40, 50, 'FormLine', svg);
  drawText (document.getElementById('positioning').value, 700, 205, 'FormATextLarge', 'middle', '', svg);
  drawRectangle (720, 180, 80, 50, 'FormLineBold', svg);
  drawLine (760, 180, 0, 50, 'FormLine', svg);
  
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
  
  drawRectangle (620, y+85, 180, 25, 'FormLine', svg);
  drawText ('Judges Details', 710, y + 100, 'FormATextBold', 'middle', '', svg);
  drawRectangle (620, y+110, 180, 160, 'FormLineBold', svg);
  drawLine (620, y+170, 180, 0, 'FormLine', svg);
  drawLine (620, y+220, 180, 0, 'FormLine', svg);
  drawText ('Signature', 628, y + 128, 'FormAText', 'start', '', svg);
  drawText ('Name', 628, y + 188, 'FormAText', 'start', '', svg);
  drawText ('Number', 628, y + 238, 'FormAText', 'start', '', svg);
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

// buildPrintLogo will add a logo
function buildPrintLogo (svg) {
  svg.appendChild (buildLogoSvg(logoImg, 120, 120));
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
  var result = new Array();
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
  if (activeForm == 'C') dxdy[0] = -dxdy[0];
  paths.push({'path':'l ' + roundTwo(dxdy[0] * lineElement) + ',' +
    roundTwo(dxdy[1] * lineElement), 'style':'dotted', 'dx':(dxdy[0] * lineElement), 'dy':(dxdy[1] * lineElement)});
// Create space after the figure
  figures[i].paths = buildShape ('FigSpace' , 2, paths);
  figures[i].moveTo = dxdy;
}

// buildMoveForward moves the cursor forward
function buildMoveForward (extent, i) {
  figures[i].paths = buildShape ('FigSpace' , extent);
  figures[i].moveForward = extent;
}

// buildFigure parses a complete figure as defined by the figNrs and
// figString and puts it in array figures. It also creates a figCheckLine
// for each figure that can be used for sequence validity checking
function buildFigure (figNrs, figString, seqNr, figStringIndex) {
  var figNr = figNrs[0];
  var roll = [];
  var rollSums = [];
  var rollPatterns = [];
  var paths = [];
  var rollInfo = [];
// In the first part we handle everything except (rolling) turns
  turnRegex = /[^o]j/;
  bareFigBase = fig[figNr].base.replace(/[\+\-]+/g, '');
  if (!turnRegex.test(fig[figNr].base)) {
    // First we split the figstring in it's elements, the bareFigBase is empty for rolls on horizontal
    if (bareFigBase != '') {
      var splitLR = figString.split(bareFigBase);
    } else var splitLR = Array(figString);
  // Find the roll patterns
    regEx = /[\+\~\^\>]+/g;
    rollPatterns[0] = splitLR[0].replace(regEx, '');
    if (splitLR.length > 1) {
      moreRolls = splitLR[1].replace(regEx, '').split(')');
      for (var i = 0; i < moreRolls.length; i++) {
        rollPatterns[i + 1] = moreRolls[i].replace(/\(/g, '');
      }
    }
  // Parse the roll patterns and find out where to put rolls, snaps and spins
  // We need to do this before building the figure because it can affect our choice of figure
    for (var i = 0; i < rollPatterns.length; i++) {
      roll[i] = [];
      rollInfo[i] = {'gap':[0], 'pattern':[]};
      var rollPattern = rollPatterns[i];
      rollSums[i] = 0;
      if (activeForm == 'C') rollSign = -1; else rollSign = 1;
      extent = 0;
      var subRoll = 0;
      var switchRoll = '';
      if (rollPattern) {
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
              if (switchRoll == '') switchRoll = '-'; else switchRoll = '';
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
              if (rollPattern.charAt(j + 1) == 'f') {
                j++;
                roll[i].push({'type':'negsnap', 'extent':rollSign * 360, 'pattern':'1if'});
                extent = 360;
                rollInfo[i].pattern[subRoll] = switchRoll+'if';
                subRoll++;
                rollInfo[i].gap[subRoll] = 0;
              } else if (rollPattern.charAt(j + 1) == 's') {
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
                if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad})
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
                    if (rollPattern.charAt(j + 2) == 'f') {
                      j = j + 2;
                      if (!stops) {
                        roll[i].push({'type':'negsnap', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)});
                      } else illegalSnapSpin = rollPattern.substring(j - 1, j + 1);
                    } else if (rollPattern.charAt(j + 2) == 's') {
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
              }
          }
        }
      }
    }
    // We now have all the roll patterns parsed but the numbering may not
    // match the numbering of the fig[i].rolls because rolls may be missing.
    // This is inconvenient and confusing, so we'll now adjust the numbering when necessary
    rollsSkip = fig[figNr].rolls.length - rollPatterns.length;
    // Only do something if rolls have been skipped
    if (rollsSkip > 0) {
      for (var i = (fig[figNr].rolls.length - 1); i > rollsSkip; i--) {
        roll[i] = roll[i - rollsSkip];
        rollSums[i] = rollSums[i - rollsSkip];
        rollInfo[i] = rollInfo[i - rollsSkip];
      }
      for (var i = rollsSkip; i > 0; i--) {
        roll[i] = [];
        rollSums[i] = 0;
        rollInfo[i] = {'gap':[0], 'pattern':[]};
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
  if ((sportingClass.value == 'glider') && (fig[figNr].kglider)) {
    var kFactors = new Array(fig[figNr].kglider);
  } else var kFactors = new Array(fig[figNr].kpwrd);
  figures[figStringIndex].figNr = figNr;
  figCheckLine[seqNr] = fig[figNr].aresti;
  // If we are not in Form A we check for entry and exit extension
  // and shortening and apply them
  var entryExt = 0;
  var exitExt = 0;
  if (activeForm != 'A') {
    var basePos = figString.indexOf(bareFigBase);
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
  // First sum continuous lines in the figure
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
        // When something else than a roll or line is encountered, build the line
        // do not make any existing line shorter than 1
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
        break;
      // Make tailslides
      case (figpat.tailslidecanopy):
      case (figpat.tailslidewheels):
        paths = buildShape('Tailslide', figureDraw.charAt(i), paths);
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
                if (lineSum > 0) {
                  lineLength = lineLength + lineSum;
                  rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths);
                } else {
                  lineLength++;
                  rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths);
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
        if (((rollSum / 180) == parseInt(rollSum / 180)) || (Attitude == 90) || (Attitude == 270)) {
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
      }
    }

    rollSum = rollSums[rollnr];
    // See if we have to autocorrect the rolls
    if (fig[figNr].rolls[rollnr] == 1) {
      autoCorr = (parseInt(rollSum / 360) - (rollSum / 360)) * 360;
      // When a line is standing by to be built, build it before doing the autocorrect
      if (autoCorr != 0) {
        if (lineDraw) {
          if (lineSum > 0) {
            lineLength = lineLength + lineSum;
            rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths);
          } else {
            lineLength++;
            rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths);
          }
          lineSum = 0;
          lineDraw = false;
        }
        // Also build a line if a roll was done before
        if (rollDone) {
          rollPaths = buildShape('Line', Array(2, NegLoad), rollPaths);
          lineLength = lineLength + 2;
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
          if (lineSum > 0) {
            lineLength = lineLength + lineSum;
            rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths);
          } else {
            lineLength++;
            rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths);
          }
          lineSum = 0;
          lineDraw = false;
        }
        // Also build a line if a roll was done before
        if (rollDone) {
          rollPaths = buildShape('Line', Array(2, NegLoad), rollPaths);
          lineLength = lineLength + 2;
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
      rollPaths = buildShape('Roll', Array(autoCorr,0), rollPaths);
      // Find which roll in figures.js matches. There should only be one. \
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
    // Move the pointer to where the roll should be. Start it offset so it is centered on the top (especially for multiple rolls)
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
    if (((Attitude == 90) || (Attitude == 270)) && ((rollSum / 180) != parseInt(rollSum / 180))) {
      if (activeForm == 'C') {
        changeDir (-Math.abs(rollSum));
      } else changeDir(Math.abs(rollSum))
      if ((Direction == 0) || (Direction == 180)) {
        if (regexSwitchDirX.test (figString)) {
          changeDir (180);
          figures[figStringIndex].switchX = true;
          // Remove this direction changer from the figure string once applied
          figString = figString.replace(regexSwitchDirX, '');
        } else figures[figStringIndex].switchX = false;
      } else {
        if (regexSwitchDirY.test (figString)) {
          changeDir(180);
          figures[figStringIndex].switchY = true;
          figString = figString.replace(regexSwitchDirY, '');
        } else figures[figStringIndex].switchY = false;
      }
    }      

    // The roll drawing has past, so make sure the rollTop variable is set to false
    rollTop = false;
    rollnr++;
    break;
    // (rolling) turns are handled here. We pass the turn part and any
    // direction changers of the draw string.
    // Other parsing is in the makeTurn function
      case ('j'):
      case ('J'):
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
// Handle angle and curve drawing
      default:
      if (figureDraw.charAt(i) in drawAngles) {
        var angle = parseInt(drawAngles[figureDraw.charAt(i)]);
        // Draw sharp angles for corners less than 180 unless
        // specifically told to make a curve by '=' symbol
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
            //HERE!
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
  
  // Replace double spaces or a space at the end on the figCheckLine
  // with the fake Aresti code for no roll 0.0.0.0
  while (figCheckLine[seqNr].match(/(  )|( $)/)) {
    figCheckLine[seqNr] = figCheckLine[seqNr].replace('  ', ' 0.0.0.0 ');
    figCheckLine[seqNr] = figCheckLine[seqNr].replace(/ $/, ' 0.0.0.0');
  }
}

// updateSequence updates the sequence character string
// figure 'figure' is placed after figure 'figNr' or over figNr' when 'replace' is true
// Also some checks are done
function updateSequence (figNr, figure, replace) {
  if (figure == '') var separator = ''; else var separator = ' ';
  var el = sequenceText;
  // with a negative figNr the fig is placed at the beginning
  if (figNr > -1) var string = ''; else var string = figure + separator;
  for (var i = 0; i < figures.length; i++) {
    if (i == figNr) {
      // Handle (multiple) moveto
      if (figure.match(regexMoveTo) && !replace) {
        if (figures[i].string.match(regexMoveTo)) {
          var dxdy1 = figures[i].string.replace(/[^0-9\,\-]/g, '').split(',');
          var dxdy2 = figure.replace(/[^0-9\,\-]/g, '').split(',');
          var dx = parseInt(dxdy1[0]) + parseInt(dxdy2[0]);
          var dy = parseInt(dxdy1[1]) + parseInt(dxdy2[1]);
          figure = '[' + dx + ',' + dy + ']';
          replace = true;
        }
      }
      if (!replace) {
        string = string + figures[i].string + ' ';
      }
      if (figure != '[0,0]') string = string + figure + separator;
    } else string = string + figures[i].string + ' ';
  }
  if (selectedFigure.id > figNr) {
    if (replace) {
      if (figure == '') selectedFigure.id--;
    } else {
      if (!(selectedFigure.id === null)) selectedFigure.id++;
    }
  } else if (replace) {
    if (figure == '') selectFigure(false);
  }

  // remove last added space and update field
  el.value = string.replace (/ $/, '');

  checkSequenceChanged();
}

// parseSequence parses the sequence character string
function parseSequence () {
  // Clear the figCheckLine array
  figCheckLine = [];
  // Clear the figureStart array
  figureStart = [];
  var seqNr = 1;
  var figure = '';
  connectors = 0;
// Make sure the scale is set to 1 before parsing
  if (scale != 1) {
    curveRadius = curveRadius / scale;
    rollcurveRadius = rollcurveRadius / scale;
    lineElement = lineElement / scale;
    scale = 1;
  }
  // See if there is a y-axis flip symbol and activate it, except when 
  // it matches the subSequence code which is similar (/ or //)
  if (activeSequence.text.replace(' '+userpat.subSequence+' ','').indexOf(userpat.flipYaxis) > -1) {
    yAxisOffset = 180 - yAxisOffset;
  }
  // Get the split string from activeSequence
  figures = activeSequence.figures;

  for (var i = 0; i < figures.length; i++) {
    figure = figures[i].string;
    // simplify the string
    
    // replace `+  by forwardshorten for entry
    var shorten = figure.match (regexEntryShorten);
    if (shorten) {
      figure = figure.replace (regexEntryShorten, 
        new Array(shorten[0].length).join(userpat.forwardshorten));
    }
    
    // replace +` by forwardshorten for exit
    var shorten = figure.match (regexExitShorten);
    if (shorten) {
      figure = figure.replace (regexExitShorten, 
        new Array(shorten[0].length).join(userpat.forwardshorten));
    }
    
    // replace longforward by 3x forward
    figure = figure.replace (regexLongForward, userpat.forward+userpat.forward+userpat.forward);
    
    
    // Parse out the instructions that are for drawing B and C forms only
    if (regexDrawInstr.test(figure) || (figure.replace(regexMoveForward, '').length == 0) || (figure == userpat.subSequence)) {
      var onlyDraw = true;
      if (figure.charAt(0) == userpat.moveto) {
        // Move to new position
        var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
        if ((dxdy[0] >= 0 || dxdy[0] < 0) && (dxdy[1] >= 0 || dxdy[1] < 0)) buildMoveTo (dxdy, i);
      } else if (regexMoveForward.test(figure)) {
        // Move forward without connecting line
        var moveFwd = figure.match(regexMoveForward)[0];
        if (parseInt (moveFwd)) {
          buildMoveForward (parseInt(moveFwd) + moveFwd.length - moveFwd.match(/[0-9]*/).length - 1, i);
        } else {
          buildMoveForward (moveFwd.length, i);
        }
      } else if (figure.charAt(figure.length - 1) == userpat.scale) {
        // Change scale
        if (scale != 1) {
          curveRadius = curveRadius / scale;
          rollcurveRadius = rollcurveRadius / scale;
          lineElement = lineElement / scale;
        }
        scale = 1 + (parseInt (figure.replace(userpat.scale, '')) / 10);
        if (!scale) scale = 1;
        if (scale < 0.1) scale = 0.1;
        curveRadius = curveRadius * scale;
        rollcurveRadius = rollcurveRadius * scale;
        lineElement = lineElement * scale;
        figures[i].scale = true;
      } else if (figure == userpat.subSequence) {
        // Start subsequence
        firstFigure = true;
        Attitude = 0;
        Direction = 0;
      }
    } else {
      if (regexConnector.test(figure)) connectors++;
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
        if (base.charAt(0) != '-') base = '+' + base;
        if (base.charAt(base.length - 1) != '-') base = base + '+';
      }
      // Autocorrect the entry attitude for figures after the first (sub)figure where necessary
      if (!firstFigure) {
      // Start upright
        if (Attitude == 0) {
          while (base.charAt(0) == '-') {
            base = base.substring(1);
            alertMsgs.push ('Fig ' + seqNr + userText.setUpright);
          }
        // Start inverted
        } else if (Attitude == 180) {
          if (base.charAt(0) != '-') {
            base = '-' + base;
            alertMsgs.push ('Fig ' + seqNr + userText.setInverted);
          }
        }
      }
      // Handle turns and rolling turns. They do have numbers in the base
      if ((base.charAt(1) == 'j') || ((base.charAt(1) == 'i') && (base.charAt(2) == 'j'))) {
        base = figure.replace(/[^a-z0-9\-\+]+/g, '');
        if (base.charAt(0) != '-') base = '+' + base;
        if (base.charAt(base.length - 1) != '-') base = base + '+'
      }
      // Retrieve the figNrs (if any) from array figBaseLookup
      figNrs = figBaseLookup[base];
      if (figNrs) {
        // When the first figure starts negative we make sure the
        // Attitude is inverted and the DRAWING direction stays the same
        if ((firstFigure) && (base.charAt(0) == '-')) {
          Attitude = 180;
          Direction = 180 - Direction;
        }
        buildFigure (figNrs, figure, seqNr, i);
        seqNr ++;
        firstFigure = false;
        // Reset scale to 1 after completing a figure
        if (scale != 1) {
          curveRadius = curveRadius / scale;
          rollcurveRadius = rollcurveRadius / scale;
          lineElement = lineElement / scale;
          scale = 1;
        }
        // Crossbox entry 'figure'
      } else if ((firstFigure) && (base == '+ej+')) {
        Direction = 270;
        updateSequenceOptions ('ej');
        // Crossbox away entry 'figure'
      } else if ((firstFigure) && (base == '+eja+')) {
        Direction = 90;
        updateSequenceOptions ('eja');
        // Downwind entry 'figure'
      } else if ((firstFigure) && (base == '+ed+')) {
        Direction = 180 - Direction;
        updateSequenceOptions ('ed');
      } else if (firstFigure) {
        updateSequenceOptions ('');
      } else {
      // No viable figure found, therefore Illegal
        buildIllegal (i);
        if (i == (figures.length - 1)) {
          alertMsgs.push (userText.illegalAtEnd);
        } else {  
          alertMsgs.push (userText.illegalBefore + seqNr);
        }
      }
    }
  }
// Check the sequence against the correct rules
  if (rulesActive) checkRules ();
// Build the last figure stop shape after all's done. This won't work well if 'move' figures are added at the end
  if (!firstFigure) {
    paths = figures[figures.length - 1]['paths']
    // remove space at end of figure
    paths.pop();
    paths = buildShape ('FigStop', true, paths)
    figures[figures.length - 1]['paths'] = paths
  }
}
