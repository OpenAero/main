// OpenAero.js 0.9.5
// This file is part of OpenAero.

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
var savefile = new Object();
// svg Name Space
var svgNS = "http://www.w3.org/2000/svg"
// xlink Name Space for including image in svg
var xlinkNS="http://www.w3.org/1999/xlink";
// set y axis offset to the default
var yAxisOffset = yAxisOffsetDefault
// Attitude goes from 0 to 359
// 0 = upright LTR, 45 = 45 up LTR, 90 = vertical up belly right etc
var Attitude = 0
// Direction goes from 0 to 359 and indicates the direction the aircraft would have if it was pulled to level flight.
// It is combined with Attitude to define overall direction allowing integers for all whole degrees
// 0 = LTR, 90 = front to back, 180 = RTL, 270 = back to front. But when Attitude is inverted directions are reversed!
var Direction = 0
// NegLoad indicates whether the current vertical has a negative load
// 0 = positive, 1 = negative
var NegLoad = 0
// X is x position on canvas
var X = 0
// Y is y position on canvas
var Y = 0
// Scale is the current scaling factor
// 1 = default, .5 is 50%, 2 is 200%
var scale = 1
// activeForm holds the currently displayed form
// activeForm == 'C' is true when form C is drawn. It is used in various functions to ensure exact mirroring
var activeForm = 'B'
// activeSequence holds the current sequence string
var activeSequence = ''
// sequenceSaved is true when the current sequence has been saved. It starts out true as we start with an empty sequence
var sequenceSaved = true
// figureK holds the current total figureK
var figureK = 0
// firstFigure is true when the figure is the first of the (sub)sequence
var firstFigure = true
// connectors holds the number of connector figures in the sequence
var connectors = 0
// PI2 is 2 times PI. Saves calculations during runtime
var PI2 = Math.PI * 2
// logoImg holds the active logo image
var logoImg = false
// openWindow holds the new window handle that may be necessary when saving files on other browsers than Firefox
var openWindow = ''
// seqCheckAvail indicates if sequence checking is available for a rule/cat/seq combination
var seqCheckAvail = new Array()
// variables used for checking sequence validity
var checkAllowRegex = []
var checkAllowCatId = []
var checkCatGroup = []
var checkFigGroup = []
var checkConv = []
var checkRule = []
var rulesActive = false
// figPattern is the complete pattern for each figure
  var figPattern = new Array()
// figBase is the pattern for each figure as it's written in the sequence, with + and - but without any rolls
  var figBase = new Array()
// figBaseLookup holds the same data as figBase, but with the base as key and corresponding figure(s) as an array for fast lookup
  var figBaseLookup = new Array()
// figRolls shows which roll positions are possible for each figure
  var figRolls = new Array()
// figAresti is the Aresti number for each figure 
  var figAresti = new Array ()
// figK is the K factor for each figure
  var figKPwrd = new Array ()
// figK is the K factor for each figure
  var figKGlide = new Array ()
// figDraw are the drawing instructions for each figure
  var figDraw = new Array ()
// rollBase holds the base for each roll (roll, snap, spin) element
  var rollBase = new Array ()
// rollAresti is the Aresti number for each roll
  var rollAresti = new Array ()
// rollK is the K factor for each roll
  var rollKPwrd = new Array ()
// rollK is the K factor for each roll
  var rollKGlide = new Array ()
// figure is the array which will hold drawing instructions, Aresti nrs and K factors for each complete figure in the sequence
  var figure = new Array ()
// alertMsgs will hold any alerts about figures and the sequence
  var alertMsgs = new Array ()

// **************************************************************
// *
// *           FUNCTIONS
// *
// **************************************************************

// rebuildSequence deletes and recreates the svg that holds the sequence
function rebuildSequenceSvg () {
  var container = document.getElementById("svgContainer");
  while (container.childNodes.length > 0) container.removeChild(container.lastChild);
  var mySvg = document.createElementNS(svgNS, "svg");
  mySvg.setAttribute("xmlns", svgNS) 
  mySvg.setAttribute("version", "1.2");
  mySvg.setAttribute("baseProfile", "tiny");
  mySvg.setAttribute("id", "sequenceSvg");
  var group = document.createElementNS (svgNS, "g")
  group.setAttribute('id', 'sequence')
  mySvg.appendChild(group)
  container.appendChild(mySvg);
}

// alertBox creates a styled alert box with a 'close' option
function alertBox(html) {
// Remove any open boxes first
  closeAlertBox();
// Make the box
  var div = document.createElement('div')
  div.id = 'alertBox'
// Make the message
  var msgDiv = document.createElement('div')
  msgDiv.id = 'message'
  msgDiv.innerHTML = html
  div.appendChild(msgDiv)
// Make the 'close' button
  var closeDiv = document.createElement('div')
  closeDiv.id = 'close'
  var aElem = document.createElement('a')
  aElem.href = '#'
  aElem.setAttribute('onClick', 'closeAlertBox();')
  aElem.appendChild(document.createTextNode(userText.closeIt))
  closeDiv.appendChild(aElem)
  div.appendChild(closeDiv)
  document.body.appendChild(div)
}

//closeAlertBox removes any alertBoxes
function closeAlertBox() {
  box = document.getElementById('alertBox')
  if (box) document.body.removeChild(box)
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

// roundTwo returns a number rounded to two decimal places
// Use for all drawing functions to prevent rendering errors and keep SVG file size down
function roundTwo (nr) {
  return (nr + 0.005).toFixed(2)
}

// getSuperFamily returns the superfamily for a category of the figure described by an array of Aresti numbers
function getSuperFamily (aresti, category) {
  category = category.toLowerCase()
  var returnValue = ''
// Only search if superFamilies are defined for the category
  if (superFamilies[category]) {
    for (var family in superFamilies[category]) {
      for (var i = 0; i<aresti.length; i++) {
	if (aresti[i].substring(0, family.length) == family) {
	  returnValue = superFamilies[category][family]
	  break; // Break loop i
	}
      }
      if (returnValue) break; // Break loop family
    }
  }
  return returnValue
}

// dirAttToAngle creates an angle to draw from the values for direction and attitude
// 0 or higher angles mean theta was in the right half, negative angles mean theta was in the left half => necessary for correct looping shapes
function dirAttToAngle (dir, att) {
  while (dir < 0) dir = dir + 360
  while (dir >= 360) dir = dir - 360
// Create offset for the Y-axis, determined by yAxisOffset
  if (dir < 90) {
    var theta = (dir * (yAxisOffset / 90))
  } else if (dir < 180) {
    var theta = (dir - 90) * ((180 - yAxisOffset) / 90) + yAxisOffset
  } else if (dir < 270) {
    var theta = (dir - 180) * (yAxisOffset / 90) + 180
  } else var theta = (dir - 270) * ((180 - yAxisOffset) / 90) + yAxisOffset + 180
// No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    if ((theta < 90) || (theta > 270)) theta = 0; else theta = 180;
  }
// Check for right or left half, calculate angle and make negative for left half
  if ((theta < 90) || (theta > 270)) {
    var angle = ((theta + att) / 180) * Math.PI
    if (angle > PI2) angle = angle - PI2; else if (angle < 0) angle = angle + PI2
  } else {
    var angle = ((theta - att) / 180) * Math.PI
    if (angle >= 0) angle = angle - PI2; else if (angle < -PI2) angle = angle + PI2
  }
  return angle
}

// changeDir changes Direction global by value
// and checks it stays within 0-359
function changeDir (value) {
  Direction = Direction + value
  while (Direction < 0) Direction = Direction + 360
  while (Direction >= 360) Direction = Direction - 360
}

// changeAtt changes Attitude global by value
// and checks it stays within 0-359
function changeAtt (value) {
  Attitude = Attitude + value
  while (Attitude < 0) Attitude = Attitude + 360
  while (Attitude >= 360) Attitude = Attitude - 360
}

// *******************************************************************************
// Define the low level shapes
// The function names are of the format makeXXX where XXX is the name to be called
// *******************************************************************************

// drawWind draws the wind arrow and text
// x and y represent the corner of the rectangle bounding the arrow at the top downwind side
// The return value is an array with the width and height of the bounding rectangle
function drawWind (x, y, sign) {
  var path = document.createElementNS (svgNS, "path")
  pathNode = 'M' + x + ',' + (y + 6) + ' l ' + (-sign * 80) + ',0 l 0,-6 l ' + (-sign * 16) + ',16 l ' + (sign * 16) + ',16 l 0,-6 l ' + (sign * 80) + ',0 z'
  path.setAttribute ('d', pathNode)
  path.setAttribute ('style', style['pos'])
  document.getElementById('sequenceSvg').getElementById('sequence').appendChild(path)
  var text = document.createElementNS (svgNS, "text")
  text.setAttribute('x', x - (sign * 10));      
  text.setAttribute('y', y + 20);
  text.setAttribute('style', style['miniFormA'])
  if (sign == 1) text.setAttribute('text-anchor', 'end'); else text.setAttribute('text-anchor', 'start')
  var textNode = document.createTextNode(userText.wind);
  text.appendChild(textNode)
  document.getElementById('sequenceSvg').getElementById('sequence').appendChild(text)
  return {'width':96, 'height':32}
}

// makeFigStart creates figure start marker
function makeFigStart (seqNr) {
  var pathsArray = new Array()
  var angle = dirAttToAngle (Direction, Attitude)
  if (firstFigure) {
    pathsArray.push({'path': 'm 3,-6 a7,7 0 1 1 -6,0', 'style':'pos'})
  }
  if (seqNr) pathsArray.push ({'text':seqNr, 'style':'miniFormA', 'x':0, 'y':-8, 'text-anchor':'middle'})
  pathsArray.push({'path': 'm -4,0 a4,4 0 1 1 0,0.01', 'style':'blackfill', 'dx':Math.cos(angle) * 4, 'dy':- Math.sin(angle) * 4})
  return pathsArray
}

// makeFigStop creates figure stop
function makeFigStop (lastFig) {
  var pathArray = new Array()
  var angle = ((Direction + 90) / 180) * Math.PI
  var dx = Math.cos(angle) * lineElement
  var dy = - Math.sin(angle) * lineElement
  if (lastFig) {
    var angle2 = dirAttToAngle (Direction, Attitude)
    var dx2 = Math.cos(angle2) * lineElement
    var dy2 = - Math.sin(angle2) * lineElement
    pathArray['path'] = 'm ' + roundTwo(dx2) + ',' + roundTwo(dy2) + ' l ' + roundTwo(dx * 2) + ',' + roundTwo(dy * 2) + ' l ' + roundTwo(-4 * dx) + ',' + roundTwo(-4 * dy)
    pathArray['style'] = 'pos'
    pathArray['dx'] = dx2
    pathArray['dy'] = dy2
  } else {
    pathArray['path'] = 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' l ' + roundTwo(-2 * dx) + ',' + roundTwo(-2 * dy)
    pathArray['style'] = 'pos'
    pathArray['dx'] = 0
    pathArray['dy'] = 0
  }
  return Array(pathArray)
}

// makeFigSpace creates space after figure
function makeFigSpace (extent) {
  var pathArray = new Array()
  var angle = dirAttToAngle (Direction, Attitude)
  var dx = Math.cos(angle) * lineElement * extent
  var dy = - Math.sin(angle) * lineElement * extent
  pathArray['path'] = ''
  pathArray['style'] = 'neg'
  pathArray['dx'] = dx
  pathArray['dy'] = dy
  return Array(pathArray)
}

// makeFigLast creates last figure stop
function makeFigLast () {
  var pathArray = new Array(2)
}

// makeLine creates lines
function makeLine (Params) {
  var Extent = Params[0]
  var pathArray = new Array()
  var angle = dirAttToAngle (Direction, Attitude)
  var dx = Math.cos(angle) * lineElement * Extent
  var dy = - Math.sin(angle) * lineElement * Extent
  pathArray['path'] = 'l ' + roundTwo(dx) + ',' + roundTwo(dy)
  if ((Attitude == 90) || (Attitude == 270)) {
    if (NegLoad == 0) pathArray['style'] = 'pos'; else pathArray['style'] = 'neg'
  } else if ((Attitude > 90) && (Attitude < 270)) {
    pathArray['style'] = 'neg'
    NegLoad = 1
  } else {
    pathArray['style'] = 'pos'
    NegLoad = 0
  }
  pathArray['dx'] = dx
  pathArray['dy'] = dy
  return Array(pathArray)
}

// makeMove is similar to makeLine but only moves the pointer and creates no lines
function makeMove (Params) {
  var Extent = Params[0]
  var pathArray = new Array()
  var angle = dirAttToAngle (Direction, Attitude)
  var dx = Math.cos(angle) * lineElement * Extent
  var dy = - Math.sin(angle) * lineElement * Extent
  pathArray['path'] = ''
  pathArray['style'] = ''
  pathArray['dx'] = dx
  pathArray['dy'] = dy
  return Array(pathArray)
}

// makeCorner creates sharp corners. Actually it only changes direction, no lines are created
function makeCorner (param) {
  var Extent = Math.abs(param)
  var PullPush = param > 0 ? 0 : param == 0 ? 0 : 1;
  var pathArray = new Array()
  changeAtt(Extent - (PullPush * 2 * Extent))
  pathArray['path'] = ''
  NegLoad = PullPush
  if (NegLoad == 0) pathArray['style'] = 'pos'; else pathArray['style'] = 'neg'
  return Array(pathArray)
}

// makeCurve creates curves of up to 359 degrees
// This is used for all looping shapes
function makeCurve (param) {
// Define some variables
  var pathArray = new Array()
  var Extent = Math.abs(param)
  var PullPush = param > 0 ? 0 : param == 0 ? 0 : 1;
  NegLoad = PullPush
  if (NegLoad == 0) pathArray['style'] = 'pos'; else pathArray['style'] = 'neg'
  var Radius = curveRadius
  if (Extent > 180) var longCurve = 1; else var longCurve = 0
// Calculate at which angle the curve starts
  var radStart = dirAttToAngle (Direction, Attitude)
// Change direction and make sure Attitude stays in [0,359]
  if (PullPush == 0) changeAtt(Extent); else changeAtt(-Extent)
// Calculate at which angle the curve stops
  var radStop = dirAttToAngle (Direction, Attitude)
// See if we are curving left or right, depending on radStart and PullPush
  if (radStart >= 0) var curveRight = 0; else var curveRight = 1
  if (PullPush == 1) curveRight = 1 - curveRight
  if (curveRight == 0) {
    var dx = (Math.sin(radStop) - Math.sin(radStart)) * Radius
    var dy = (Math.cos(radStop) - Math.cos(radStart)) * Radius
  } else {
    var dx = (Math.sin(radStop + Math.PI) - Math.sin(radStart + Math.PI)) * Radius
    var dy = (Math.cos(radStop + Math.PI) - Math.cos(radStart + Math.PI)) * Radius
  }
  var sweepFlag = curveRight
// Make the path and move the cursor
  pathArray['path'] = 'a' + Radius + ',' + Radius + ' 0 ' + longCurve + ' ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy)
  pathArray['dx'] = dx
  pathArray['dy'] = dy
  return Array(pathArray)
}

// #################################
// Code for making (rolling) turns
// This has to be changed in the future to improve the look of the figures and the code
// For now we keep it like this as it does work

// makeTurnArc creates arc segments for turns and rolling circles. Size is in DRAWN rads
function makeTurnArc (rad, startRad, stopRad, pathsArray) {
  while (startRad >= PI2) startRad = startRad - PI2
  while (startRad < 0) startRad = startRad + PI2
  while (stopRad >= PI2) stopRad = stopRad - PI2
  while (stopRad < 0) stopRad = stopRad + PI2
    
  if (rad >= 0) var sign = 1; else var sign = -1
// calculate where we are in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn))
// as the atan function only produces angles between -PI/2 and PI/2 we may have to correct for full ellipse range
  if ((startRad > Math.PI) && (startRad < PI2)) radEllipse = radEllipse + Math.PI
  startX = Math.cos (radEllipse) * curveRadius
  startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn)
// calculate where we go to in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn))
  if ((stopRad > Math.PI) && (stopRad < PI2)) radEllipse = radEllipse + Math.PI
  stopX = Math.cos (radEllipse) * curveRadius
  stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn)
  dx = (stopX - startX) * sign
  dy = (stopY - startY) * sign
  if (rad > 0) sweepFlag = 0; else sweepFlag = 1
  if (Math.abs (rad) < Math.PI) longCurve = 0; else longCurve = 1
  if ((Attitude > 90) && (Attitude < 270)) {
    pathsArray.push({'path':'a ' + curveRadius + ',' + roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' + sweepFlag + ' ' + dx + ',' + dy, 'style':'neg', 'dx':dx,'dy':dy})
  } else {
    pathsArray.push({'path':'a ' + curveRadius + ',' + roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' + sweepFlag + ' ' + dx + ',' + dy, 'style':'pos', 'dx':dx,'dy':dy})
  }
  return pathsArray
}

// makeTurnDots creates dotted arc segments for turns and rolling circles. Size is in DRAWN rads
function makeTurnDots (rad, startRad, stopRad, pathsArray) {
  while (startRad >= PI2) startRad = startRad - PI2
  while (stopRad >= PI2) stopRad = stopRad - PI2
    
  if (rad >= 0) sign = 1; else sign = -1
// calculate where we are in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn))
// as the atan function only produces angles between -PI/2 and PI/2 we may have to correct for full ellipse range
  if ((startRad > Math.PI) && (startRad < PI2)) radEllipse = radEllipse + Math.PI
  startX = Math.cos (radEllipse) * curveRadius
  startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn)
// calculate where we go to in the ellipse
  radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn))
  if ((stopRad > Math.PI) && (stopRad < PI2)) radEllipse = radEllipse + Math.PI
  stopX = Math.cos (radEllipse) * curveRadius
  stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn)
  dx = (stopX - startX) * sign
  dy = (stopY - startY) * sign
  if (rad > 0) sweepFlag = 0; else sweepFlag = 1
  if (Math.abs (rad) < Math.PI) longCurve = 0; else longCurve = 1
  pathsArray.push({'path':'a ' + curveRadius + ',' + roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' + sweepFlag + ' ' + dx + ',' + dy, 'style':'dotted'})
  return pathsArray
}

// makeTurnRoll creates rolls in rolling turns. Basically a minimal version of makeRoll
// param is the amount of roll degrees
function makeTurnRoll (param, rad) {
  var pathsArray = new Array()
  var extent = Math.abs(param)
  var sign = param > 0 ? 1 : -1;
  var sweepFlag = param > 0 ? 1 : 0;
// calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad)
  var radCos = Math.cos(rad)
  // Make the tip shape
  var radPoint = rad + sign * (Math.PI / 3.5)
  dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius)
  dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius)
  path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
  var radPoint = rad + sign * (Math.PI / 6)
  dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip
  dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip
  path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
  dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip
  dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip
  path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z'
  pathsArray.push ({'path':path, 'style':'blackfill'})

// Calculate at which angle the curve starts and stops
  if (extent >= 360) {
    radPoint = rad - sign * (Math.PI / 6)
  } else {
    radPoint = rad
  }
  var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip
  var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip
// Make the curved path
  path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
  path = path + 'a' + rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
  pathsArray.push ({'path':path, 'style':'pos'})
  return pathsArray
}

// makeTurn builds turns and rolling circles from the draw instructions parsed from figDraw
function makeTurn (draw) {
// parse base
  var pathsArray = new Array()
// Check if we are in an in/out or out/in roll
  regex = /io|IO/
  if (regex.test(draw)) var switchRollDir = true; else switchRollDir = false
// Check if the exit direction is flipped
  if (draw.charAt(0) == '>') var sign = -1; else var sign = 1
// See if we start with an outside roll
  regex = /J/
  if (regex.test(draw)) var rollDir = -sign; else var rollDir = sign
// See if we start inverted, this will also flip the drawing direction
  if (Attitude == 180) rollDir = -rollDir
  var numbers = draw.replace(/[^\d]+/g, '')
  var extent = parseInt(numbers.charAt(0)) * 90
// See if direction change is called for by the preparsed draw string
  var stopRad = dirAttToAngle (Direction + (sign * extent), Attitude)
  if (stopRad < 0) stopRad = stopRad + PI2
  var startRad = dirAttToAngle (Direction, Attitude)
  if (startRad < 0) startRad = startRad + PI2
  startRadSave = startRad
  var rad = sign * stopRad - sign * startRad
  if (rad <= 0) rad = rad + PI2
  if (numbers.length > 1) {
// rolling turns
    rolls = parseFloat(numbers.substring(1).replace('5', '.5'))
    var step = rad / parseInt(rolls + 0.5)
    var halfStepSigned = sign * (step / 2)
    for (var i = 0; i < rad; i = i + step) {
      pathsArray = makeTurnArc (halfStepSigned, startRad, startRad + halfStepSigned, pathsArray)
      startRad = startRad + halfStepSigned
      if ((parseInt(rolls + 0.5) != parseInt(rolls)) && (i == (rad - step))) { 
        rollPaths = makeTurnRoll (180 * rollDir, startRad)
	changeDir (180)
	changeAtt (180)
      } else {
	rollPaths = makeTurnRoll (360 * rollDir, startRad)
	if (switchRollDir) rollDir = - rollDir
      }
      for (var j = 0; j < rollPaths.length; j++) {
	pathsArray.push (rollPaths[j])
      }
      pathsArray = makeTurnArc (halfStepSigned, startRad, startRad + halfStepSigned, pathsArray)
      startRad = startRad + halfStepSigned
    }
    pathsArray = makeTurnDots (sign*(PI2 - rad), stopRad, startRadSave, pathsArray)
    changeDir (sign * extent)
  } else {
// regular turns
    if (extent != 360) {
      pathsArray = makeTurnArc (sign * rad, startRad, stopRad, pathsArray)
      pathsArray = makeTurnDots (sign * (PI2-rad), stopRad, startRad, pathsArray)
      changeDir (sign * extent)
    } else {
      pathsArray = makeTurnArc (sign * Math.PI, startRad, startRad + Math.PI, pathsArray)
      changeDir (180)
      pathsArray = makeTurnArc (sign * Math.PI, startRad + Math.PI, startRad, pathsArray)
      changeDir (180)
    }
  }
  return pathsArray
}

// makeRoll creates aileron rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of roll
// [1] is hesitations in fractions of full roll
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// Example: (270,4) would be a 3x4 roll
function makeRoll (params) {
  var pathsArray = new Array()
  var stops = params[1]
  var extent = Math.abs(params[0])
  var sign = params[0] > 0 ? 1 : -1;
  var sweepFlag = params[0] > 0 ? 1 : 0;
  if (params.length > 2) var rollTop = params[2]
  var rad = dirAttToAngle (Direction, Attitude)
// calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad)
  var radCos = Math.cos(rad)
  while (extent > 0) {
    // Make the tip shape
    var radPoint = rad + sign * (Math.PI / 3.5)
    dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius)
    dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius)
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
    var radPoint = rad + sign * (Math.PI / 6)
    dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip
    dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
    dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip
    dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z'
    pathsArray.push ({'path':path, 'style':'blackfill'})

  // Calculate at which angle the curve starts and stops
    if (extent >= 360) {
      radPoint = rad - sign * (Math.PI / 6)
    } else {
      radPoint = rad
    }
    var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip
    var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip
// Make the curved path
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
    path = path + 'a' + rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
    pathsArray.push ({'path':path, 'style':'pos'})
// Where necessary, print the roll numbers after completing the first roll point and arc.
// This is only necessary for rolls that are not multiples of 180 or have hesitations
    if (extent == Math.abs(params[0])) {
      if ((parseInt(extent / 180) != (extent / 180)) || (stops > 0)) {
	if (stops > 0) {
	  var text = '' + (extent / (360 / stops))
	  if (extent != 360) text = text + 'x' + stops
	} else {
	  text = ((extent / 90) - (parseInt (extent / 360) * 4)) + '/4'
	}
	if (extent > 360) {
          dx = -sign * (radSin * (rollcurveRadius + 4 + ((rollFontSize / 5) * text.length)))
	  dy = -sign * (radCos * (rollcurveRadius + rollFontSize)) + (rollFontSize / 5) + 1
	} else {
          dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 5) * text.length)))
	  dy = -sign * (radCos * (rollcurveRadius + rollFontSize / 2)) + (rollFontSize / 5) + 1
	}
	pathsArray.push ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'})
      }
    }
// Completed the first (full) roll. Continue for more than 360
    extent = extent - 360
// For more than 360 degrees, draw a line between the rolls and the roll tip connect line
    if (extent > 0) {
// Make the line between the two rolls. Always positive for now
// Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', Array(2, 0), pathsArray)
      } else {
	pathsArray = buildShape ('Line', Array(2, 0), pathsArray)
      }
// Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1]['dx']
      dy = pathsArray[pathsArray.length - 1]['dy']
      var radPoint = rad + sign * (Math.PI / 3)
      dxTip = (((Math.cos(radPoint) * (rollcurveRadius + 2)) - (radCos * rollcurveRadius)))
      dyTip = -(((Math.sin(radPoint) * (rollcurveRadius + 2)) - (radSin * rollcurveRadius)))
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
      path = path + 'l ' + roundTwo(-dx) + ',' + roundTwo(-dy)
      pathsArray.push ({'path':path, 'style':'pos'})
    }
  }
  return pathsArray
}

// makeSnap creates snap rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of snap
// [1] indicates pos or neg snap. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// Examples: (270,0) is a 3/4 pos snap. (180,1) is a 1/2 neg snap
function makeSnap (params) {
  var pathsArray = new Array()
  var stops = params[1]
  var extent = Math.abs(params[0])
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude)
// calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad)
  var radCos = Math.cos(rad)
  if (params.length > 2) var rollTop = params[2]
  while (extent > 0) {
    // Make the base shape
    dxTip = -radSin * snapElement2 * sign
    dyTip = -radCos * snapElement2 * sign
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
    dx = radCos * snapElement   
    dy = -radSin * snapElement   
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
    pathsArray.push ({'path':path, 'style':'pos'})
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
    if (extent >= 360) {
      dx = (radCos * snapElement12) + (radSin * snapElement3 * sign)
      dy = (- radSin * snapElement12) + (radCos * snapElement3 * sign)
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
      dx = (- radCos) * snapElement24
      dy = radSin * snapElement24
    } else {
      dx = (radCos * snapElement) + (radSin * snapElement2 * sign)
      dy = (- radSin * snapElement) + (radCos * snapElement2 * sign)
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
      dx = (- radCos) * snapElement2
      dy = radSin * snapElement2
    }
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z'
    if (params[1] == 0) pathStyle = 'posfill'; else pathStyle = 'negfill'
    pathsArray.push ({'path':path, 'style':pathStyle, 'dx':radCos * snapElement075, 'dy':-radSin * snapElement075})
// Where necessary, print the roll numbers after completing the first roll point and arc.
// This is only necessary for rolls that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      if (parseInt(extent / 180) != (extent / 180)) {
        text = ((extent / 90) - (parseInt (extent / 360) * 4)) + '/4'
	if (extent > 360) {
          dx = -sign * (radSin * (rollcurveRadius + 4 + ((rollFontSize / 5) * text.length)))
	  dy = -sign * (radCos * (rollcurveRadius + rollFontSize)) + (rollFontSize / 5) + 1
	} else {
          dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 5) * text.length)))
	  dy = -sign * (radCos * (rollcurveRadius + rollFontSize / 2)) + (rollFontSize / 5) + 1
	}
	pathsArray.push ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'})
      }
    }
// Completed the first (full) roll. Continue for more than 360
    extent = extent - 360
// For more than 360 degrees, draw a line between the rolls and the roll tip connect line
    if (extent > 0) {
// Make the line between the two rolls. Always positive for now
// Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', Array(1.5, 0), pathsArray)
      } else {
	pathsArray = buildShape ('Line', Array(1.5, 0), pathsArray)
      }
// Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1]['dx'] + radCos * snapElement2
      dy = pathsArray[pathsArray.length - 1]['dy'] - radSin * snapElement2
      dxTip = -radSin * snapElement24 * sign + radCos * snapElement
      dyTip = -radCos * snapElement24 * sign - radSin * snapElement
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
      path = path + 'l ' + roundTwo(-dx) + ',' + roundTwo(-dy)
      pathsArray.push ({'path':path, 'style':'pos'})
    }
  }
  return pathsArray
}

// makeSpin creates spins
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of spin
// [1] indicates pos or neg spin. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// Examples: (270,0) is a 3/4 pos spin. (540,1) is a 1 1/2 neg spin
function makeSpin (params) {
  var pathsArray = new Array()
  var stops = params[1]
  var extent = Math.abs(params[0])
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude)
  if (params.length > 2) var rollTop = params[2]
// calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad)
  var radCos = Math.cos(rad)
  while (extent > 0) {
// Make the base shape
// First make the tip line
    dxTip = -radSin * spinElement2 * sign
    dyTip = -radCos * spinElement2 * sign
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
    dx = radCos * spinElement   
    dy = -radSin * spinElement   
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
    pathsArray.push ({'path':path, 'style':'pos'})
// Next make the triangle
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
    if (extent >= 360) {
      dx = (radCos * spinElement * 1.5) + (radSin * spinElement3 * sign)
      dy = (- radSin * spinElement * 1.5) + (radCos * spinElement3 * sign)
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
      dx = (- radCos) * spinElement * 1.5
      dy = radSin * spinElement * 1.5
    } else {
      dx = (radCos * spinElement) + (radSin * spinElement2 * sign)
      dy = (- radSin * spinElement) + (radCos * spinElement2 * sign)
      path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' '
      dx = (- radCos) * spinElement
      dy = radSin * spinElement
    }
    path = path + 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z'
    if (params[1] == 0) pathStyle = 'posfill'; else pathStyle = 'negfill'
    pathsArray.push ({'path':path, 'style':pathStyle, 'dx':radCos * spinElement, 'dy':-radSin * spinElement})
// Where necessary, print the roll numbers after completing the first roll point and arc.
// This is only necessary for spins that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      if (parseInt(extent / 180) != (extent / 180)) {
        text = ((extent / 90) - (parseInt (extent / 360) * 4)) + '/4'
        dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 3) * text.length)))
	dy = -sign * (radCos * (rollcurveRadius + rollFontSize)) + (rollFontSize / 5)
	pathsArray.push ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'})
      }
    }
// Completed the first (full) spin. Continue for more than 360
    extent = extent - 360
// For more than 360 degrees, draw a line between the spins and the spin tip connect line
    if (extent > 0) {
// Make the line between the two rolls. Always positive for now
// Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', Array(0.5, 0), pathsArray)
      } else {
	pathsArray = buildShape ('Line', Array(0.5, 0), pathsArray)
      }
// Get the relative movement by the line and use this to build the tip connector line
      dx = pathsArray[pathsArray.length - 1]['dx'] + radCos * spinElement2
      dy = pathsArray[pathsArray.length - 1]['dy'] - radSin * spinElement2
      dxTip = -radSin * spinElement24 * sign + radCos * spinElement
      dyTip = -radCos * spinElement24 * sign - radSin * spinElement
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' '
      path = path + 'l ' + roundTwo(-dx) + ',' + roundTwo(-dy)
      pathsArray.push ({'path':path, 'style':'pos'})
    }
  }
  return pathsArray
}

// makeHammer creates hammerhead tops
// extent is the size of the line before the hammerhead top. We will move that much down before continuing drawing
function makeHammer (extent) {
  pathArray = new Array()
  Attitude = 270
  changeDir(180)
  pathArray['path'] = "l " + (lineElement) + "," + (lineElement)
  pathArray['style'] = 'pos'
  pathArray['dx'] = 0
  pathArray['dy'] = lineElement * extent
  return Array(pathArray)
}

// makeTailslide creates tailslide tops
// param gives the type as a string
function makeTailslide (param) {
  var pathsArray = new Array(Array(),Array())
  var sweepFlag = 1
  NegLoad = 0
  var angle = dirAttToAngle (Direction, Attitude)
  if (param == figpat.tailslidewheels) angle = -angle
  if (angle > 0) sweepFlag = 1; else sweepFlag = 0
  if (param == figpat.tailslidecanopy) pathsArray[0]['style'] = 'pos'; else pathsArray[0]['style'] = 'neg'
  var Radius = curveRadius
  if (angle > 0) dx = -Radius; else dx = Radius
  dy = Radius
// Make the path and move the cursor
  pathsArray[0]['path'] = 'a' + Radius + ',' + Radius + ' 0 0 ' + sweepFlag + ' ' + dx + ',' + dy
  pathsArray[0]['dx'] = dx
  pathsArray[0]['dy'] = dy
  var Radius = (curveRadius) / 2
  if (angle > 0) dx = Radius; else dx = -Radius
  dy = Radius
  pathsArray[1]['path'] = 'a' + Radius + ',' + Radius + ' 0 0 ' + sweepFlag + ' ' + dx + ',' + dy
  pathsArray[1]['style'] = 'pos'
  pathsArray[1]['dx'] = dx
  pathsArray[1]['dy'] = dy
  Attitude = 270
  return pathsArray
}

// ######################################################################
// Functions for creating and drawing complex shapes from the base shapes

// draw a shape
function buildShape(ShapeName, Params, paths) {
// if the paths array was not provided, create an empty one
if (!paths) var paths = new Array()
  // define the pathsArray by executing the correct makeShape function
  var pathsArray = eval ('make' + ShapeName + '(Params)')
  // walk through the returned paths
  for (var i = 0; i < pathsArray.length; i++) {
    paths.push (pathsArray[i])
  }
  return paths
}

// draw a shape from a pathArray
function drawShape(pathArray, svgElement) {
  if (!svgElement) svgElement = document.getElementById('sequenceSvg').getElementById('sequence')
// some paths are empty, don't draw them. Should change code somewhere else to not even save them (maybe?)
  if (pathArray['path']) {
    var path = document.createElementNS (svgNS, "path")
    path.setAttribute('d', 'M ' + roundTwo(X) + ',' + roundTwo(Y) + ' ' + pathArray['path'])
    path.setAttribute('style',style[pathArray['style']])
    svgElement.appendChild(path)
  } else if (pathArray['text']) {
    var text = document.createElementNS (svgNS, "text")
//    text.setAttribute('id', 'text-' + figNr)
    text.setAttribute('x', X + pathArray['x']);        
    text.setAttribute('y', Y + pathArray['y']);
    text.setAttribute('style', style[pathArray['style']])
    text.setAttribute('text-anchor', pathArray['text-anchor'])
    var textNode = document.createTextNode(pathArray['text']);
    text.appendChild(textNode)
    svgElement.appendChild(text)
  }
  if ('dx' in pathArray) X = X + pathArray['dx']
  if ('dy' in pathArray) Y = Y + pathArray['dy']
}

// drawLine draws a line from x,y to x+dx,y+dy in style styleId
// When an svg object is provided, it will be used i.s.o. the standard sequenceSvg
function drawLine (x, y, dx, dy, styleId, svg) {
  var path = document.createElementNS (svgNS, "path")
  path.setAttribute('d', 'M ' + roundTwo(x) + ',' + roundTwo(y) + ' l ' + roundTwo(dx) + ',' + roundTwo(dy))
  path.setAttribute('style',style[styleId])
  if (svg) svg.appendChild(path); else document.getElementById('sequenceSvg').getElementById('sequence').appendChild(path)
}
  
// drawRectangle draws a rectangle at position x, y in style styleId
// When an svg object is provided, it will be used i.s.o. the standard sequenceSvg
function drawRectangle (x, y, width, height, styleId, svg) {
  var path = document.createElementNS (svgNS, "rect")
  path.setAttribute('x', x)
  path.setAttribute('y', y)
  path.setAttribute('width', width)
  path.setAttribute('height', height)
  path.setAttribute('style',style[styleId])
  if (svg) svg.appendChild(path); else document.getElementById('sequenceSvg').getElementById('sequence').appendChild(path)
}
  
// drawText draws any text at position x, y in style styleId with optional anchor and id
function drawText (text, x, y, styleId, anchor, id, svg) {
  var newText = document.createElementNS (svgNS, "text")
  if (id) newText.setAttribute('id', id)
  if (style) newText.setAttribute('style', style[styleId])
  if (anchor) newText.setAttribute('text-anchor', anchor)
  newText.setAttribute('x', roundTwo(x));        
  newText.setAttribute('y', roundTwo(y));
  var textNode = document.createTextNode(text);
  newText.appendChild(textNode)
  if (svg) svg.appendChild (newText); else document.getElementById('sequenceSvg').getElementById('sequence').appendChild(newText)
}

// draw an aresti number text with a figure
function drawArestiText(figNr, aresti) {
  drawText (aresti, X, Y, 'start', 'text-' + figNr)
}

// #####################################################
// Functions for interpreting user input and variables

// doOnLoad is only called on initial loading of the page
function doOnLoad () {
// Parse the figures file
  parseFiguresFile();
// Parse the rules file
  parseRulesFile();
// Some browsers keep the input fields after reload, so do a draw to make sure an entered sequence is shown
  draw();
// Also update the browser title
  changeTitle();
// Add combo box functions for rules/category/program input fiels
  new combo('rules','#cc9','#ffc');
  new combo('category','#cc9','#ffc');
  new combo('program','#cc9','#ffc');
}

// changeTitle changes the web page title to reflect the sequence info
function changeTitle () {
  var title = 'OpenAero - '
  title = title + document.getElementById('category').value + ' '
  title = title + document.getElementById('program').value + ' '
  title = title + document.getElementById('location').value + ' - '
  title = title + document.getElementById('date').value + ' - '
  title = title + document.getElementById('pilot').value
  document.title = title
}

function changeCombo(id) {
  var ruleName = document.getElementById('rules').value
  if (id == 'rules') {
    var categoryList = document.getElementById('categoryList')
  // Clean up the list
    while (categoryList.childNodes.length > 0) categoryList.removeChild(categoryList.lastChild);
    if (seqCheckAvail[ruleName]) {
      for (categoryName in seqCheckAvail[ruleName]) {
	var listItem = document.createElement('li')
	listItem.appendChild(document.createTextNode(categoryName))
	categoryList.appendChild(listItem)
      }
    }
    document.getElementById('category').value = ''
    new combo('category','#cc9','#ffc');
  }
  if ((id == 'rules') || (id == 'category')) {
    var categoryName = document.getElementById('category').value
    var programList = document.getElementById('programList')
  // Clean up the list
    while (programList.childNodes.length > 0) programList.removeChild(programList.lastChild);
    if (seqCheckAvail[ruleName][categoryName]) {
      for (programName in seqCheckAvail[ruleName][categoryName]) {
	var listItem = document.createElement('li')
	listItem.innerHTML = programName
	programList.appendChild(listItem)
      }
    }
    document.getElementById('program').value = ''
    new combo('program','#cc9','#ffc');
    changeTitle();
  }
  if (id == 'program') {
    var ruleName = document.getElementById('rules').value.toLowerCase()
    var categoryName = document.getElementById('category').value.toLowerCase()
    var programName = document.getElementById('program').value.toLowerCase()
    if (seqCheckAvail[ruleName][categoryName][programName]) {
// Load rules, check the sequence and display any alerts
      rulesActive = true
      loadRules(ruleName, categoryName, programName)
    } else rulesActive = false;
    changeTitle()
  }
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
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
// svg images are included inline and scaled
  if (logoImage.match(/<svg/)) {
    parser = new DOMParser();
    var doc = parser.parseFromString(logoImage, "image/svg+xml");
    var svgBase = doc.getElementsByTagName('svg')[0]
    var scale = width / svgBase.getAttribute('width')
    if ((height / svgBase.getAttribute('height')) < scale) scale = height / svgBase.getAttribute('height');
    var group = document.createElementNS(svgNS, "g");
    group.setAttribute('transform', 'scale(' + scale + ')')
    group.appendChild(svgBase)
    svg.appendChild(group)
// other images are included through an xlink data url
  } else {
    var image = document.createElementNS (svgNS, "image")
    image.setAttribute('x', 0)
    image.setAttribute('y', 0)
    image.setAttribute('width', width)
    image.setAttribute('height', height)
    image.setAttribute('preserveAspectRatio', 'xMaxYMax')
    image.setAttributeNS(xlinkNS, 'href', logoImage)
    svg.appendChild (image)
  }
  svg.setAttribute("class", "logoSvg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  return svg
}

// logoChooser will display the available logo's in the sequence window and allow for selection of a logo
function logoChooser() {
// define logo thumbnail width and height
  var width = 120
  var height = 120
  var container = document.getElementById('svgContainer')
// Clean up the svg container div
  while (container.childNodes.length > 0) container.removeChild(container.lastChild);
// Show selection text and file field
  container.innerHTML = '<div id=uploadLogo><p>' + userText.logoExplain + '</p><input type="file" id="logoFile" accept="image/*" onChange="openFile(document.getElementById(\'logoFile\').files[0], \'Logo\')"></div><div id=chooseLogo></div>';
// Show all the logo images
  container = document.getElementById('chooseLogo')
  for (var logoName in logoImages) {
    var link = document.createElement('a')
    link.setAttribute("href", "#")
    link.setAttribute("onClick", "selectLogo('" + logoName + "')")
    container.appendChild(link)
    link.appendChild(buildLogoSvg(logoImages[logoName], width, height));
  }
}

// selectLogo is called when a logo is clicked in the logoChooser and will select the correct logo for use
function selectLogo(logo) {
  logoImg = logoImages[logo];
  document.getElementById('logo').value = logo;
  draw();
  drawActiveLogo();
}

// uploadLogo is used to upload a logo
function uploadLogo (file) {
  logoImages['mylogo'] = file
  selectLogo ('mylogo')
}

// drawActiveLogo makes a small thumbnail of the active logo in the Sequence info and adds 'remove logo' link
function drawActiveLogo() {
  var width = 60
  var height = 60
  var container = document.getElementById('activeLogo')
  container.removeChild(container.lastChild);
// Make a link to the logoChooser
  var link = document.createElement('a')
  link.setAttribute("href", "#")
  link.setAttribute("onClick", "logoChooser()")
  container.appendChild(link)
// Create logo svg
  link.appendChild(buildLogoSvg(logoImg, width, height))

  var container = document.getElementById('removeLogo')
// Make a link to removeLogo when it's not there
  if (container.childNodes.length < 1) {
    var link = document.createElement('a')
    link.setAttribute("href", "#")
    link.setAttribute("onClick", "removeLogo()")
    container.appendChild(link)
    var text = document.createTextNode(userText.removeLogo)
    link.appendChild(text)
  }
}

// removeLogo makes it possible to remove the previously chosen logo
function removeLogo() {
  logoImg = false;
// Remove 'remove logo' link and logo image
  var container = document.getElementById('removeLogo')
  container.removeChild(container.lastChild)
  var container = document.getElementById('activeLogo')
  container.removeChild(container.lastChild);
// Add choose logo option
  var link = document.createElement('a')
  link.setAttribute("href", "#")
  link.setAttribute("onClick", "logoChooser()")
  container.appendChild(link)
  var text = document.createTextNode(userText.chooseLogo)
  link.appendChild(text)
}
  
// parseFiguresFile parses the figures file and stores it in several arrays for fast retrieval
function parseFiguresFile () {
  for (var i = 0; i < figs.length; i++) {
// Transform tabs to spaces and multiple to single spaces
    var line = figs[i].replace(/[\t]/g," ")
    var tmpline = line.replace(/\s\s+/g, ' ')
// Split the remainder on the space. Family 9 should now have two elements, the others three 
    var splitLine = tmpline.split(" ")

    if (splitLine[0]) {
// Next we split the Aresti and K-factors part
      var arestiK = splitLine[1].split("(")
      var kFactors = arestiK[1].replace(")","").split(":")
// Split K factors on the colon; kFactors[0] is for Powered, kFactors[1] is for Gliders
// For now, we will only handle Powered
      figPattern[i] = splitLine[0]
      figAresti[i] = arestiK[0]
      figKPwrd[i] = kFactors[0]
      figKGlide[i] = kFactors[1]
// We will extract roll elements for everything but roll figures and (rolling) turns
      turnRegex = /[^o]j/
      if (turnRegex.test(splitLine[0])) {
	theBase = splitLine[0]
	if (theBase in figBaseLookup) figBaseLookup[theBase].push(i); else figBaseLookup[theBase] = [i]
	figBase[i] = theBase
        figDraw[i] = splitLine[2]
      } else if (splitLine.length > 2) {
	theBase = splitLine[0].replace(/[\d\(\)\_\^\&]+/g, '')
	if (theBase in figBaseLookup) figBaseLookup[theBase].push(i); else figBaseLookup[theBase] = [i]
	figBase[i] = theBase
	figDraw[i] = splitLine[2]
// Find which rolls are possible in this figure, handle the empty base of rolls on horizontal
        if (theBase.replace(/[\+\-]+/g, '') != '') {
          rollbase = splitLine[0].split(theBase.replace(/[\+\-]+/g, ''))
	} else rollbase = Array(splitLine[0].replace(/[\+\-]+/g, ''))
	rolls = rollbase.join(')').replace(/[\(\+\-]+/g, '').split(')')
	figRolls[i] = new Array()
	for (r = 0; r < rolls.length; r++) {
	  switch (rolls[r]) {
	    case (figpat.fullroll):
	      figRolls[i][r] = 1;
	      break;
	    case (figpat.halfroll):
  	      figRolls[i][r] = 2;
	      break;
	    case (figpat.anyroll):
	      figRolls[i][r] = 3;
	      break;
	    default:
	      figRolls[i][r] = 0;
	  }
	}
// Handle rolls
      } else {
        rollBase[i] = splitLine[0]
        rollAresti[i] = arestiK[0]
        rollKPwrd[i] = kFactors[0]
        rollKGlide[i] = kFactors[1]
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
        if (!seqCheckAvail[ruleName]) seqCheckAvail[ruleName] = new Array();
        if (!seqCheckAvail[ruleName][catName]) seqCheckAvail[ruleName][catName] = new Array();
	seqCheckAvail[ruleName][catName][seqName] = true			  
      }
    }
  }
  var rulesList = document.getElementById('rulesList')
  for (ruleName in seqCheckAvail) {
    var listItem = document.createElement('li')
    listItem.innerHTML = ruleName
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
  checkConv = []
  checkRule = []
// Walk through the rules
  for (var i=0; i<rules.length; i++) {
// Check for [section] or (section) to match sequence type specific rules
    if ((rules[i].charAt(0) == '[') || (rules[i].charAt(0) == '(')) {
      if (rules[i] == ruleSection) {
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
        checkAllowRegex.push = {'regex':RegExp(newCat, 'g'), 'rules':newRules}
      } else if (rules[i].match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
// Apply figure number rules
	var newCatLine = rules[i]
	var newCat = newCatLine.match(/^[^\s]*/g)
	var newRules = newCatLine.replace(newCat, '').split(';')
	for (var j = 0; j<newRules.length; j++) {
	  newRules[j] = newRules[j].replace(/^\s+|\s+$/g, '')
	}
        checkAllowCatId.push = {'id':newCat, 'rules':newRules}
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
	var convName = rules[i].match(/[^=]+/).toString().replace(/^conv-/, '')
	var convRules = rules[i].replace('conv-'+convName+'=', '').split(';')
	checkConv[convName] = new Array()
	for (var j = 0; j<convRules.length; j++) {
	  var convRuleParts = convRules[j].split('=')
	  checkConv[convName][j] = {'regex':RegExp(convRuleParts[0], 'g'), 'replace':convRuleParts[1]}
	}
      } else if (rules[i].match(/^rule-[^=]+=.+/)) {
// Apply rule-x rules
	var newRuleName = rules[i].match(/[^=]+/).toString().replace(/^rule-/, '')
	var checkRuleParts = rules[i].replace('rule-'+newRuleName+'=', '').split(':')
	checkRule[newRuleName] = {'conv':checkRuleParts[0], 'regex':RegExp(checkRuleParts[1], 'g')}
      } else if (rules[i].match(/^why-[^=]+=.+/)) {
// Apply why-x rules
	var newRuleName = rules[i].match(/[^=]+/).toString().replace(/^why-/, '')
	if (checkRule[newRuleName]) checkRule[newRuleName]['why'] = rules[i].replace(/^[^=]+=/, '')
      }
    }
  }
// Check the loaded rules against the sequence and display any alerts
  checkRules()
  displayAlerts ()
}

// checkRules will check a complete sequence against the loaded rules and produce alerts where necessary
function checkRules () {
  var figNr = 0
  figureK = 0
  var connectors = 0
  groupMatch = []
  for (var i = 0; i < figure.length; i++) {
    aresti = figure[i]['aresti']
    k = figure[i]['k']
    var figString = ''
    if (aresti) {
      figNr++
// Check if the figure is a connector
      if (regexConnector.test(figure[i]['string'])) {
	connectors++
      } else {
	var figK = 0
	var groupFigMatch = []
// Walk through the elements of the figure
	for (var j = 0; j < aresti.length; j++) {
// Check all group rules on all elements
	  for (group in checkCatGroup) {
	    if (group != 'k') {
	      var match = aresti[j].match(checkCatGroup[group]['regex'])
	      if (match) {
		if (!groupFigMatch[group]) groupFigMatch[group] = []
		groupFigMatch[group].push(match[0])
		if (!groupMatch[group]) groupMatch[group] = []
		groupMatch[group].push(match[0])
	      }
  // Do checks after the last aresti code of the figure has been processed
	      if (j == (aresti.length - 1)) {
		if (groupFigMatch[group]) {
		  if (checkCatGroup[group]['maxperfig'] && (groupFigMatch[group].length > checkCatGroup[group]['maxperfig'])) checkAlert(group, 'maxperfig', figNr)
		  if (checkCatGroup[group]['minperfig'] && (groupFigMatch[group].length < checkCatGroup[group]['minperfig'])) checkAlert(group, 'minperfig', figNr)
		}
	      }
	    }
	  }
	  figK = figK + parseInt(k[j])
	  figString = figString + aresti[j] + ' '
	}
	for (group in checkFigGroup) {
	  var match = figString.match(checkFigGroup[group]['regex'])
	  if (match) {
	    if (!groupMatch[group]) groupMatch[group] = []
	    for (j = 0; j < match.length; j++) groupMatch[group].push(match[j]);
	  }
	}
	if (checkCatGroup['k']['minperfig']) {
	  if (figK < checkCatGroup['k']['minperfig']) checkAlert('k', 'minperfig', figNr)
	}
	if (checkCatGroup['k']['maxperfig']) {
	  if (figK > checkCatGroup['k']['maxperfig']) checkAlert('k', 'maxperfig', figNr)
	}
      }
      figureK = figureK + figK
    }
    if (checkCatGroup['k']['min']) {
      if (figureK < checkCatGroup['k']['min']) checkAlert('k', 'min')
    }
    if (checkCatGroup['k']['max']) {
      if (figureK > checkCatGroup['k']['max']) checkAlert('k', 'max')
    }
    
  }
// Run checks on maximum and minimum occurrence of a group
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
}

// checkAlert adds an alert resulting from sequence checking
// 'group' represents the affected group
// 'type' represents the type of checking error
function checkAlert (group, type, figNr) {
  if (figNr) alertFig = 'Fig ' + figNr + ':'; else alertFig = ''
  switch (type) {
    case 'maxperfig':
      alertMsgs.push(alertFig + 'Not more than ' + checkCatGroup[group]['maxperfig'] + ' of ' + checkCatGroup[group]['name'] + ' allowed per figure')
      break;
    case 'minperfig':
      alertMsgs.push(alertFig + 'At least ' + checkCatGroup[group]['minperfig'] + ' of ' + checkCatGroup[group]['name'] + ' required per figure')
      break   
    case 'max':
      alertMsgs.push(alertFig + 'Not more than ' + checkCatGroup[group]['max'] + ' of ' + checkCatGroup[group]['name'] + ' allowed')
      break;
    case 'min':
      alertMsgs.push(alertFig + 'At least ' + checkCatGroup[group]['min'] + ' of ' + checkCatGroup[group]['name'] + ' required')
      break;
    case 'repeat':
      alertMsgs.push(alertFig + 'Not more than ' + checkCatGroup[group]['repeat'] + ' exact repetitions of ' + checkCatGroup[group]['name'] + ' allowed')
  }
}

// ###################################################
// Functions for creating complete sequences

// makeMiniFormA creates a mini form A
// It starts at (x, y) and returns width and height of the block
function makeMiniFormA (x, y) {
  var blockX = x
  var blockY = y
  var figNr = 0
  figureK = 0
  for (var i = 0; i < figure.length; i++) {
    aresti = figure[i]['aresti']
    k = figure[i]['k']
    if (aresti) {
      figNr++
      var figK = 0
      topBlockY = blockY
      for (var j = 0; j < aresti.length; j++) {
        drawText (aresti[j], blockX + 44, blockY + 16, 'miniFormA')
        drawText (k[j], blockX + 104, blockY + 16, 'miniFormA')
	figK = figK + parseInt(k[j])
        blockY = blockY + 12
      }
// Adjust figure K for connectors
      if (regexConnector.test(figure[i]['string'])) {
	figK = connectorsTotalK / connectors
	if (aresti.length < 2) blockY=blockY + 12;
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 4, 'miniFormA')
	drawText ('Conn.', blockX + 4, (topBlockY + blockY) / 2 + 16, 'miniFormA')
      } else {
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 10, 'miniFormA')
      }
      drawText (figK, blockX + 130, (topBlockY + blockY) / 2 + 10, 'miniFormA')
      drawLine (blockX, topBlockY, 152, 0, 'pos')
      var vertSize = (blockY - topBlockY + 12)
      drawLine (blockX, topBlockY, 0, vertSize, 'pos')
      drawLine (blockX + 40, topBlockY, 0, vertSize, 'pos')
      drawLine (blockX + 100, topBlockY, 0, vertSize, 'pos')
      drawLine (blockX + 126, topBlockY, 0, vertSize, 'pos')
      drawLine (blockX + 152, topBlockY, 0, vertSize, 'pos')
      figureK = figureK + figK
      blockY = blockY + 12
    }
  }
  drawText ('Total K = ' + figureK, blockX + 4, blockY + 16, 'miniFormATotal')
  drawRectangle (blockX, blockY, 152, 24, 'pos')
  return {'width':152, 'height':(blockY + 24) - y}
}

// makeFormA creates Form A from the figures array
function makeFormA() {
  yAxisOffset = yAxisOffsetDefault
  Direction = 0
  figNr = 0
  svgElement = document.getElementById('sequenceSvg').getElementById('sequence')
// Count how many real figures there are
  for (var i = 0; i < figure.length; i++) {
    var aresti = figure[i]['aresti']
    var paths = figure[i]['paths']
    if (aresti) {
  // Build the figure at the top-left
      X = 0
      Y = 0
// Create a group for the figure, draw it and apply to the SVG
      var group = document.createElementNS (svgNS, "g")
      group.setAttribute('id', 'figure' + i)
      for (var j = 0; j < paths.length; j++) {
	drawShape (paths[j], group)
      }
      svgElement.appendChild(group)
      figNr ++
    }
  }
// The final form will be 800x1000px, leaving room for the print header
  var columnTitleHeight = 50;
  var columnTitles = Array('No:20', 'Symbol:100', 'Cat. No.:70', 'K:30', 'Total K:60', 'Marks:80', 'Remarks:220', 'Pos:40')
  var columnWidths = Array(20, 100, 70, 30, 60, 40, 40, 220, 40)
  var rowHeight = parseInt((1000 - columnTitleHeight) / figNr);
  if (rowHeight > 125) rowHeight = 125;
  var x = 0;
  for (var i = 0; i < columnTitles.length; i++) {
    drawRectangle (x, 0, columnTitles[i].split(':')[1], columnTitleHeight, 'FormLine')
    drawText (columnTitles[i].split(':')[0], x + columnTitles[i].split(':')[1] / 2, columnTitleHeight / 2, 'FormAText', 'middle')
    x = x + parseInt(columnTitles[i].split(':')[1])
  }
  var y = columnTitleHeight
  var row = 0
  figureK = 0
  for (var i = 0; i < figure.length; i++) {
    var aresti = figure[i]['aresti']
    var k = figure[i]['k']
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
	    if (((rowHeight - 20) / bBox['height']) < scaleFigure) scaleFigure = roundTwo((rowHeight - 10) / bBox['height'])
	    var xMargin = (columnWidths[column] - bBox['width'] * scaleFigure) / 2
	    var yMargin = (rowHeight - bBox['height'] * scaleFigure) / 2
	    group.setAttribute('transform', 'translate(' + roundTwo((x + xMargin - bBox['x']*scaleFigure)) + ' ' + roundTwo((y + yMargin - bBox['y']*scaleFigure)) + ') scale(' + scaleFigure + ')')
            break;
	  case (2):
	    drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
	    for (var j = 0; j < aresti.length; j++) {
	      drawText (aresti[j], x + columnWidths[column] / 2, y + j * 14 + 14, 'FormATextBold', 'middle')
	    }
	    break;
	  case (3):
	    drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
	    var figK = 0
	    for (var j = 0; j < aresti.length; j++) {
	      drawText (k[j], x + columnWidths[column] / 2, y + j * 14 + 14, 'FormATextBold', 'middle')
	      figK = figK + parseInt(k[j])
	    }
            if (regexConnector.test(figure[i]['string'])) figK = connectorsTotalK / connectors
	    break;
	  case (4):
	    drawRectangle (x, y, columnWidths[column], rowHeight, 'FormLine')
	    drawText (figK, x + columnWidths[column] / 2, y + rowHeight / 2, 'FormATextLarge', 'middle')
	    var superFamily = getSuperFamily (aresti, document.getElementById('category').value)
	    if (superFamily) drawText('SF ' + superFamily,  x + columnWidths[column] / 2, y + rowHeight - 10, 'FormAText', 'middle')
            if (regexConnector.test(figure[i]['string'])) drawText('connect',  x + columnWidths[column] / 2, y + 12, 'FormAText', 'middle')
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
  seqSvg = document.getElementById("sequenceSvg")
  seqSvg.setAttribute("viewBox", '0 0 800 1000');
  seqSvg.setAttribute("width", '800px');
  seqSvg.setAttribute("height", '1000px');
}

// makeFormB creates Form B from the figures array
function makeFormB() {
  yAxisOffset = yAxisOffsetDefault
  Direction = 0
  for (var i = 0; i < figure.length; i++) {
    aresti = figure[i]['aresti']
    paths = figure[i]['paths']
    for (var j = 0; j < paths.length; j++) {
      drawShape (paths[j])
    }
  }

// Find out how big the SVG has become and adjust margins
  seqSvg = document.getElementById("sequenceSvg")
  var bBox = seqSvg.getBBox()
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
  seqSvg.setAttribute("viewBox", viewBox);
  seqSvg.setAttribute("width", (w + 5) + 'px');
  seqSvg.setAttribute("height", (h + 5) + 'px');
}

// makeFormC creates Form C from the figures array
function makeFormC() {
  for (var i = 0; i < figure.length; i++) {
    aresti = figure[i]['aresti']
    paths = figure[i]['paths']
    for (var j = 0; j < paths.length; j++) {
      drawShape (paths[j])
    }
  }
// Find out how big the SVG has become and adjust margins
  seqSvg = document.getElementById("sequenceSvg")
  var bBox = seqSvg.getBBox()
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
  seqSvg.setAttribute("viewBox", viewBox);
  seqSvg.setAttribute("width", (w + 5) + 'px');
  seqSvg.setAttribute("height", (h + 5) + 'px');
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
    container.appendChild (document.createTextNode(alertMsgs[i]))
  }
// Clear all alerts
  alertMsgs = []
}

// do some kind of draw
function draw () {
  figure = []
  rebuildSequenceSvg ()
  Attitude = 0
  X = 0
  Y = 0
  var content = ''
  if (activeForm == 'C') {
    yAxisOffset = 180 - yAxisOffsetDefault
    Direction = 180
  } else {
    yAxisOffset = yAxisOffsetDefault
    Direction = 0
  }
  parseSequence(document.action.sequence_text.value)

  seqSvg = document.getElementById('sequenceSvg').getElementById('sequence')
  if (activeForm == 'A') {
    makeFormA()
  } else if (activeForm == 'C') {
    makeFormC()
  } else makeFormB()
  displayAlerts ()
}

// checkSequenceChanged is called by unKeyUp on the sequence input field to check if it has to be redrawn
function checkSequenceChanged () {
  if (activeSequence != document.action.sequence_text.value) {
    activeSequence = document.action.sequence_text.value
    var scrollPosition = window.pageYOffset
    draw ()
    window.scrollTo (0, scrollPosition)
    sequenceSaved = false;
  }
}

// select which Form to show
function selectForm (form) {
  activeForm = form
  draw (form)
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
}

// openFile is called to open a file
// file = file objevt from file input element
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
  var seqInfo = document.getElementById ('sequenceInfo')
  var nodes = seqInfo.getElementsByClassName ('item')
  for (var ele in nodes) {
    if (nodes[ele].lastChild) nodes[ele].lastChild.value = ''
  }
  // Obtain the read file data  
  var fileString = evt.target.result
// Check if we have an OLAN sequence or an OpenAero XML sequence
// If the sequence file starts with '<', assume it's an XML sequence
  if (fileString.charAt(0) == '<') {
    var myElement = document.createElement('div');
    myElement.innerHTML = fileString
    var rootNode = myElement.getElementsByTagName("sequence")[0];
    var nodes = rootNode.childNodes
// Put every element in the correct field. Replace &gt; by >
    for (var ele in nodes) {
      if(nodes[ele].innerHTML) {
	document.getElementById(nodes[ele].nodeName.toLowerCase()).value = nodes[ele].innerHTML.replace(/\&gt\;/g, '>')
      }
    }
  } else {
    var lines = fileString.replace('\r', '').split('\n')
    for (var i = 0; i < lines.length; i = i + 2) {
      var key = lines[i].toLowerCase().replace(/[^a-z]/g, '')
      var value = lines[i + 1]
      if (key == 'sequence') {
	key = 'sequence_text'
      }
      if (document.getElementById(key) && value) document.getElementById(key).value = value
    }
  }
  logo = document.getElementById('logo').value
  if (logoImages[logo]) selectLogo(logo);
// Draw the sequence and change the browser title after loading
  draw()
  changeTitle()
  sequenceSaved = true
// Activate the loading of the checking rules (if any)
  changeCombo('program')
}

// loadedLogo will be called when a logo image has been loaded
function loadedLogo (evt) {
  var fileData = evt.target.result;
  if (evt.type) {
// svg images are put in logoImg as-is
    if (fileData.match(/<svg/)) {
      logoImg = fileData
// other (binary) images are encoded to base64
    } else {
      logoImg = 'data:' + evt.type + ';base64,' + btoa(fileData)
    }
    draw()
    drawActiveLogo()
  } else {
    alert (userText.unknownFileType)
  }
}

// saveFile saves a file
// The function returns true if the file was saved
function saveFile(data, name, filter, format) {
  var result = false;
  savefile.data = data
  savefile.name = name
  savefile.format = format
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
  // Open a new window that may be used to display the file data for saving by the user
  // This is closed upon success from nsIFilePicker or FileWriter
  // We have to do it now to prevent popup blocking by the browser!
    var activeWindow = window
    openWindow = window.open('','_blank',"menubar=yes, scrollbars=yes, status=no, toolbar=no, width=900,height=700,top=50");
    activeWindow.focus()
  // Try to save through mozilla nsIFilePicker
  // Only works on Firefox
    try {
      // Request file write privs
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
      // Open the save file dialog
      const nsIFilePicker = Components.interfaces.nsIFilePicker;
      var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init (window, "Save File...", nsIFilePicker.modeSave);
      if (filter) fp.appendFilter(filter['name'], filter['filter']);
      if (name) fp.defaultString = name;
      var rv = fp.show();
      if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
	// Open the file and write to it
	var file = fp.file;
	if (file.exists() == false) { //create as necessary
	  file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
	}
	var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
	  .createInstance( Components.interfaces.nsIFileOutputStream );
	outputStream.init( file, 0x04 | 0x08 | 0x20, 640, 0 );
	var result = outputStream.write(data, data.length );
	outputStream.close();
	result = true
      }
      netscape.security.PrivilegeManager.revertPrivilege("UniversalXPConnect");
      openWindow.close();
    } catch (e) {
  // If nsIFiliePicker didn't work, try HTML5 FileWriter
      if (window.requestFileSystem) {
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler)
	function onInitFs(fs) {
	  fs.root.getFile(savefile.name, {create: true}, function(fileEntry) {

	    // Create a FileWriter object for our FileEntry (log.txt).
	    fileEntry.createWriter(function(fileWriter) {

	      fileWriter.onwriteend = function(e) {
		console.log('Write completed.');
	      };

	      fileWriter.onerror = function(e) {
		console.log('Write failed: ' + e.toString());
	      };

	      // Create a new Blob and write it to savefile.name
	      var bb = new BlobBuilder();
	      bb.append(savefile.data);
	      fileWriter.write(bb.getBlob());
	      alertBox('<a href="' + fileEntry.toURL() + '">' + userText.saveFileAsAlert + '</a>')
	      openWindow.close();

	    }, errorHandler);

	  }, errorHandler);
	}
      } else errorHandler();
    }
  }
  return result
}

// errorHandler will be called when there is a file saving error
// This means that that both Firefox nsiFilePicker and Chrome FileWriter didn't work
// Fall back to using the previously opened window for a data URL
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

  openWindow.location = 'data:application/octet-stream,' + encodeURIComponent(savefile.data)
  alertBox (userText.fileNotSaved);
}

// saveSequence will save a sequence to a .seq file
// the .seq file is standard xml, so not OLAN compatible
function saveSequence () {
  var sequence = '<sequence>'
  var labels = new Array('pilot', 'aircraft', 'category', 'location', 'date', 'program', 'rules', 'positioning', 'notes', 'sequence_text', 'logo')
  for (i = 0; i < labels.length; i++) {
    sequence = sequence + '<' + labels[i] + '>' + document.getElementById(labels[i]).value + '</' + labels[i] + '>\n'
  }
  sequence = sequence + '</sequence>'
  var fileName = document.getElementById('location').value+' '+
    document.getElementById('category').value+' '+
    document.getElementById('program').value+' '+
    document.getElementById('pilot').value
  fileName = fileName.replace(/^\s+|\s+$/g, '');
  if (fileName == '') fileName = 'sequence';
  if (saveFile (sequence, fileName + '.seq', {'name':'OpenAero Sequence', 'filter':'*.seq'}, 'text/xhtml+xml;utf8')) {
    sequenceSaved = true;
  } else {
    sequenceSaved = false;
  }
}

// printAllForms will print forms A,B and C. This can also be used to output them to PDF
function printAllForms () {
  var activeFormSave = activeForm
// Open a new window for the print
  myWindow = window.open("","printForms","width=900,height=700,top=50")
  var pages = new Array('A', 'B', 'C')
  myWindow.document.write('<html><head><style type="text/css" media="print">body {margin: 0px;}@page {size:A4 portrait;margin:0mm;}</style></head><body>')
  for (var i = 0; i<pages.length; i++) {
    activeForm = pages[i]
    draw ()
    var svg = document.getElementById('sequenceSvg')
    if (i < (pages.length - 1)) var divClass = 'breakAfter'; else var divClass = '';
    myWindow.document.write('<div class="' + divClass + '">' + buildPrintForm (svg) + '</div>')
  }
  myWindow.document.write('</body></html>')
  myWindow.print()
  myWindow.close()
// Reset the screen to the normal view
  activeForm = activeFormSave
  draw ()
}
  
// buildPrintForm will build a complete SVG string for printing a form from a provided SVG object and activeForm global
// The default size of the page is A4, 800x1130
function buildPrintForm (svg) {
// Find the size and adjust scaling if necessary, upscaling to a maximum factor of 2
// The sequence max width=800, height=1000
  var bBox = svg.getBBox()
  w = parseInt(bBox['width'])
  h = parseInt(bBox['height'])
// For form A we need to add the righthand scoring column, so max width = 620
  if (activeForm == 'A') {
    var scale = 620 / w
    var marginTop = 130
  } else {
    var scale = 800 / w
    var marginTop = 140
// For some reason the bounding box at the bottom is not always correct for Form B and C
// So we add 10 at the bottom to make sure it's all on the form; HACK
    h = h + 10
  }
  if ((1000 / h) < scale) scale = 1000 / h;
  if (scale > 2) scale = 2;
  if (activeForm == 'A') var moveRight = (620 - (w * scale)); else var moveRight = (800 - (w * scale));
  svg.getElementById('sequence').setAttribute('transform', 'translate(' + (moveRight - (bBox['x'] * scale)) + ',' + (marginTop - bBox['y']*scale) + ') scale(' + scale + ')')
// Insert rectangle (=background) before sequence
  var path = document.createElementNS (svgNS, "rect")
  path.setAttribute('x', '-5')
  path.setAttribute('y', '-5')
  path.setAttribute('width', '810')
  path.setAttribute('height', '1140')
  path.setAttribute('style',style['FormBackground'])
  svg.insertBefore(path, svg.getElementById('sequence'))
//  svg.setAttribute("width", '810px');
//  svg.setAttribute("height", '1140px');
  svg.setAttribute("viewBox", '-5 -5 810 1140');
  svg.setAttribute("width", '200mm');
  svg.setAttribute("height", '280mm');
// Add all necessary elements
  
  buildPrintHeader (svg)
  if (activeForm == 'A') buildPrintScoreColumn (svg)
  buildPrintCornertab (svg)
  if (logoImg) buildPrintLogo (svg)
// For some reason serializeToString may convert the xlink:href to a0:href or just href for the logo image
// So we change it back right away because otherwise the logo isn't displayed
  var sequenceSVG = new XMLSerializer().serializeToString(svg).replace (/ [^ ]*href/, ' xlink:href');
  sequenceSVG = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + sequenceSVG;
  return sequenceSVG
}

// buildPrintHeader will append the sequence header
function buildPrintHeader (svg) {
  drawRectangle (130, 0, 590, 65, 'FormLine', svg)
  drawText (document.getElementById('location').value + ' ' + document.getElementById('date').value, 425, 33, 'FormATextLarge', 'middle', '', svg)
  drawRectangle (720, 0, 80, 65, 'FormLine', svg)
  drawText ('Form ' + activeForm, 760, 33, 'FormATextLarge', 'middle', '', svg)
  drawRectangle (130, 65, 80, 65, 'FormLine', svg)
  drawText ('Pilot ID', 135, 75, 'miniFormA', 'start', '', svg)
  drawRectangle (210, 65, 510, 65, 'FormLine', svg)
  drawText (document.getElementById('category').value + ' Programme ' + document.getElementById('program').value, 465, 98, 'FormATextLarge', 'middle', '', svg)
  drawRectangle (720, 65, 80, 65, 'FormLine', svg)
  drawText ('Flight #', 725, 75, 'miniFormA', 'start', '', svg)
}

// buildPrintScoreColumn will append the righthand scoring column
function buildPrintScoreColumn (svg) {
  drawRectangle (620, 130, 60, 50, 'FormLine', svg)
  drawText ('Item', 650, 155, 'FormAText', 'middle', '', svg)
  drawRectangle (680, 130, 40, 50, 'FormLine', svg)
  drawText ('K', 700, 155, 'FormAText', 'middle', '', svg)
  drawRectangle (720, 130, 80, 50, 'FormLine', svg)
  drawText ('Grade', 760, 155, 'FormAText', 'middle', '', svg)

  drawRectangle (620, 180, 60, 50, 'FormLine', svg)
  drawText ('Pos', 650, 205, 'FormAText', 'middle', '', svg)
  drawRectangle (680, 180, 40, 50, 'FormLine', svg)
  drawText (document.getElementById('positioning').value, 700, 205, 'FormATextLarge', 'middle', '', svg)
  drawRectangle (720, 180, 80, 50, 'FormLineBold', svg)
  drawLine (760, 180, 0, 50, 'FormLine', svg)
  
  drawRectangle (620, 280, 90, 25, 'FormLine', svg)
  drawText ('Fig K', 665, 295, 'FormAText', 'middle', '', svg)
  drawRectangle (710, 280, 90, 25, 'FormLine', svg)
  drawText ('Total K', 755, 295, 'FormAText', 'middle', '', svg)
  drawRectangle (620, 305, 90, 50, 'FormLine', svg)
  drawText (figureK, 665, 330, 'FormATextLarge', 'middle', '', svg)
  drawRectangle (710, 305, 90, 50, 'FormLine', svg)
  if (parseInt(document.getElementById('positioning').value)) var totalK = figureK + parseInt(document.getElementById('positioning').value); else var totalK = figureK
  drawText (totalK, 755, 330, 'FormATextLarge', 'middle', '', svg)
  drawRectangle (620, 355, 180, 25, 'FormLine', svg)
  drawText ('Penalties', 710, 370, 'FormATextBold', 'middle', '', svg)
  var penalties = new Array ('Too Low', 'Disqual Fig', 'Too High', 'Outs', 'Interruptions', 'Insertions', 'Missed Slot', 'Trg Violation', 'Faulty Wing Rocks')
  var y = 380
  drawRectangle (750, y, 50, penalties.length * 25, 'FormLineBold', svg)
  for (var i = 0; i<penalties.length; i++) {
    drawRectangle (620, y, 180, 25, 'FormLine', svg)
    drawText (penalties[i], 628, y + 18, 'FormAText', 'start', '', svg)
    y = y + 25
  }

  drawRectangle (620, y, 180, 25, 'FormLine', svg)
  drawText ('Final Freestyle', 710, y + 15, 'FormATextBold', 'middle', '', svg)
  drawRectangle (620, y+25, 80, 50, 'FormLine', svg)
  drawText ('Duration', 660, y + 50, 'FormAText', 'middle', '', svg)
  drawRectangle (700, y+25, 50, 50, 'FormLine', svg)
  drawText ('Min', 725, y + 40, 'FormAText', 'middle', '', svg)
  drawRectangle (750, y+25, 50, 50, 'FormLine', svg)
  drawText ('Sec', 775, y + 40, 'FormAText', 'middle', '', svg)
  drawRectangle (700, y+50, 100, 25, 'FormLineBold', svg)
  
  drawRectangle (620, y+85, 180, 25, 'FormLine', svg)
  drawText ('Judges Details', 710, y + 100, 'FormATextBold', 'middle', '', svg)
  drawRectangle (620, y+110, 180, 160, 'FormLineBold', svg)
  drawLine (620, y+170, 180, 0, 'FormLine', svg)
  drawLine (620, y+220, 180, 0, 'FormLine', svg)
  drawText ('Signature', 628, y + 128, 'FormAText', 'start', '', svg)
  drawText ('Name', 628, y + 188, 'FormAText', 'start', '', svg)
  drawText ('Number', 628, y + 238, 'FormAText', 'start', '', svg)
}

// buildPrintCornertab will append the righthand corner cut-off tab
function buildPrintCornertab (svg) {
  drawLine (620, 1130, 180, -180, 'FormLine', svg)
  drawLine (680, 1120, 110, -110, 'dotted', svg)
  drawLine (730, 1120, 60, -60, 'dotted', svg)
// Add pilot's name  
  var newText = document.createElementNS (svgNS, "text")
  newText.setAttribute('style', style['FormATextBold'])
  newText.setAttribute('text-anchor', 'middle')
  newText.setAttribute('x', 730);        
  newText.setAttribute('y', 1060);
  newText.setAttribute('transform', 'rotate(-45 730 1060)')
  var textNode = document.createTextNode(document.getElementById('pilot').value);
  newText.appendChild(textNode)
  svg.appendChild (newText)
// Add pilot text
  var newText = document.createElementNS (svgNS, "text")
  newText.setAttribute('style', style['FormAText'])
  newText.setAttribute('text-anchor', 'middle')
  newText.setAttribute('x', 780);        
  newText.setAttribute('y', 1035);
  newText.setAttribute('transform', 'rotate(-45 780 1035)')
  var textNode = document.createTextNode(userText.pilot);
  newText.appendChild(textNode)
  svg.appendChild (newText)
// Add aircraft info
  var newText = document.createElementNS (svgNS, "text")
  newText.setAttribute('style', style['FormATextBold'])
  newText.setAttribute('text-anchor', 'middle')
  newText.setAttribute('x', 755);        
  newText.setAttribute('y', 1085);
  newText.setAttribute('transform', 'rotate(-45 755 1085)')
  var textNode = document.createTextNode(document.getElementById('aircraft').value);
  newText.appendChild(textNode)
  svg.appendChild (newText)
// Add aircraft text
  var newText = document.createElementNS (svgNS, "text")
  newText.setAttribute('style', style['FormAText'])
  newText.setAttribute('text-anchor', 'middle')
  newText.setAttribute('x', 785);        
  newText.setAttribute('y', 1080);
  newText.setAttribute('transform', 'rotate(-45 785 1080)')
  var textNode = document.createTextNode(userText.ac);
  newText.appendChild(textNode)
  svg.appendChild (newText)
}

// buildPrintLogo will add a logo
function buildPrintLogo (svg) {
  svg.appendChild (buildLogoSvg(logoImg, 120, 120))
}

// saveSvg will create a download dialog box to save the currently viewed Form
function saveSvg () {
  var svg = document.getElementById('sequenceSvg')
  var fileName = document.getElementById('location').value+' '+
    document.getElementById('category').value+' '+
    document.getElementById('program').value+' '+
    document.getElementById('pilot').value+' '+
    'Form '+activeForm+'.svg'
  fileName = fileName.replace(/^\s+|\s+$/g, '');
  saveFile(buildPrintForm (svg), fileName, '*.svg', 'image/svg+xml;utf8')
  draw ()
}

// savePDF will save Forms A,B and C as a single PDF
// NOT functional yet!
function savePDF () {
  form = 'A'
  draw ()
}

// inArray returns all the array keys in 'arr' that hold 'val' as an array
// Only works for numbered arrays!
function inArray(arr, val) {
  var result = new Array()
  var i = arr.indexOf (val)
  while (i >= 0) {
    result.push(i)
    i = arr.indexOf (val, i + 1)
  }
  if (result.length > 0) return result; else return false;
}

// buildIllegal builds the symbol for an illegal figure
function buildIllegal () {
// create space before the figure
  var paths = new Array()
  paths = buildShape ('FigSpace' , 2, paths)
  var angle = dirAttToAngle (Direction, Attitude)
  var dx = Math.cos(angle) * lineElement * 6
  var dy = - Math.sin(angle) * lineElement * 6
  paths.push({'path':'l ' + dx + ',' + (dy - lineElement * 6) + ' m ' + -dx + ',' + -dy + ' l ' + dx + ',' + (dy + lineElement * 6), 'style':'illegalCross'})
  paths.push({'path':'l ' + dx + ',' + dy + ' l 0,' + (-lineElement * 6) + ' l ' + -dx + ',' + -dy + ' z', 'style':'illegalBox', 'dx':dx, 'dy':dy})
  var figureArray = {'paths': paths}
  figure.push(figureArray)
}

// buildMoveTo builds the symbol for a moveto and moves the cursor
function buildMoveTo (dxdy) {
  var paths = new Array()
// Create space before the figure
  paths = buildShape ('FigSpace' , 2, paths)
  if (activeForm == 'C') dxdy[0] = -dxdy[0]
  paths.push({'path':'l ' + roundTwo(dxdy[0] * lineElement) + ',' + roundTwo(dxdy[1] * lineElement), 'style':'dotted', 'dx':(dxdy[0] * lineElement), 'dy':(dxdy[1] * lineElement)})
  var figureArray = {'paths': paths}
  figure.push(figureArray)
}

// buildMoveForward moves the cursor forward
function buildMoveForward (extent) {
  var figureArray = {'paths': buildShape ('FigSpace' , extent)}
  figure.push({'paths': buildShape ('FigSpace' , extent)})
}

// buildFigure parses a complete figure as defined by the figNrs and figString and puts it in array figure
function buildFigure (figNrs, figString, seqNr) {
  var figNr = figNrs[0]
  var roll = new Array()
  var rollSums = new Array()
  var rollPatterns = new Array()
  var paths = new Array()
// In the first part we handle everything except (rolling) turns
  turnRegex = /[^o]j/
  bareFigBase = figBase[figNr].replace(/[\+\-]+/g, '')
  if (!turnRegex.test(figBase[figNr])) {
    // First we split the figstring in it's elements, the bareFigBase is empty for rolls on horizontal
    if (bareFigBase != '') var splitLR = figString.split(bareFigBase); else var splitLR = Array(figString);
  // Find the roll patterns
    regEx = /[\~\^\>]+/g
    rollPatterns[0] = splitLR[0].replace(regEx, '')
    if (splitLR.length > 1) {
      moreRolls = splitLR[1].replace(regEx, '').split(')')
      for (var i = 0; i < moreRolls.length; i++) {
	rollPatterns[i + 1] = moreRolls[i].replace(/\(/g, '')
      }
    }
  // Parse the roll patterns and find out where to put rolls, snaps and spins
  // We need to do this before building the figure because it can affect our choice of figure
    for (var i = 0; i < rollPatterns.length; i++) {
      roll[i] = Array()
      rollPattern = rollPatterns[i]
      rollSums[i] = 0
      if (activeForm == 'C') rollSign = -1; else rollSign = 1
      extent = 0
      if (rollPattern) {
	for (j = 0; j < rollPattern.length; j++) {
	  switch (rollPattern.charAt(j)) {
    // Long line before or after roll, twice the length of the same pattern in figures.js
	    case (userpat.rollext):
	      roll[i].push({'type':'line', 'extent':3, 'load':NegLoad})
	      break;
    // Short line before or after roll, twice the length of the same pattern in figures.js
	    case (userpat.rollextshort):
	      roll[i].push({'type':'line', 'extent':1, 'load':NegLoad})
	      break;
    // Make line before or after roll shorter
	    case (userpat.rolllineshorten):
	      roll[i].push({'type':'line', 'extent':-1, 'load':NegLoad})
	      break;
    // Switch roll direction
	    case (userpat.opproll):
	      rollSign = -rollSign
	      break;
	    case ('f'):
  // Add snaps
  // When there was a roll before, add a line first
	      if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad})
	      roll[i].push({'type':'possnap', 'extent':rollSign * 360, 'pattern':'1f'})
	      extent = 360
	      break;
	    case ('s'):
  // Add spins
  // When there was a roll before, add a line first
	      if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad})
	      roll[i].push({'type':'posspin', 'extent':rollSign * 360, 'pattern':'1s'})
	      extent = 360
	      break;
	    case('i'):
  // Add inverted snaps and spins
  // When there was a roll before, add a line first
	      if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad})
	      if (rollPattern.charAt(j + 1) == 'f') {
		j++
		roll[i].push({'type':'negsnap', 'extent':rollSign * 360, 'pattern':'1if'})
		extent = 360
	      } else if (rollPattern.charAt(j + 1) == 's') {
		j++
		roll[i].push({'type':'negspin', 'extent':rollSign * 360, 'pattern':'1is'})
		extent = 360
	      }
	      break;
    // Handle all different kinds of rolls and their notation
	    default:
	      if (parseInt(rollPattern.charAt(j))) {
		var startJ = j
		stops = 0
      // When there was a roll before, add a line first
		if (extent > 0) roll[i].push({'type':'line', 'extent':2, 'load':NegLoad})
		if (parseInt(rollPattern.charAt(j + 1))) {
		  stops = parseInt(rollPattern.charAt(j + 1))
		  extent = parseInt(rollPattern.charAt(j)) * (360 / stops)
		  j++
		} else if (parseInt(rollPattern.charAt(j)) == 1) {
		  extent = 360
		} else if (parseInt(rollPattern.charAt(j)) == 4) {
		  extent = 90
		} else if (parseInt(rollPattern.charAt(j)) == 8) {
		  stops = 8
		  extent = 90
		} else if (parseInt(rollPattern.charAt(j)) == 9) {
		  extent = 720
		} else {
		  extent = 90 * parseInt(rollPattern.charAt(j))
		}
		var illegalSnapSpin = false;
		switch (rollPattern.charAt(j + 1)) {
		  case ('i'):
		    if (rollPattern.charAt(j + 2) == 'f') {
		      j = j + 2
		      if (!stops) roll[i].push({'type':'negsnap', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)}); else illegalSnapSpin = rollPattern.substring(j - 1, j + 1)
		    } else if (rollPattern.charAt(j + 2) == 's') {
		      j = j + 2
		      if (!stops) roll[i].push({'type':'negspin', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)}); else illegalSnapSpin = rollPattern.substring(j - 1, j + 1)
		    } 
		    break;
		  case ('f'):
		    j++
		    if (!stops) roll[i].push({'type':'possnap', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)}); else illegalSnapSpin = rollPattern.substring(j, j + 1)
		    break;
		  case ('s'):
		    j++
		    if (!stops) roll[i].push({'type':'posspin', 'extent':rollSign * extent, 'pattern':rollPattern.substring(startJ, j + 1)}); else illegalSnapSpin = rollPattern.substring(j, j + 1)
		    break;
		  default:
		    roll[i].push({'type':'roll', 'extent':rollSign * extent, 'stops':stops, 'pattern':rollPattern.substring(startJ, j + 1)})
		}
		if (illegalSnapSpin) {
		  alertMsgs.push ('Fig ' + seqNr + ':' + rollPattern.substring(startJ, j + 1) + userText.illegalFig + rollPattern.substring(startJ, startJ + 1) + illegalSnapSpin)
		  extent = 0
		}
		rollSums[i] = rollSums[i] + rollSign * extent
	      }
	  }
	}
      }
    }
  // We now have all the roll patterns parsed but the numbering may not match the numbering of the figRolls because rolls may be missing.
  // This is inconvenient and confusing, so we'll now adjust the numbering when necessary
    rollsSkip = figRolls[figNr].length - rollPatterns.length
  // Only do something if rolls have been skipped
    if (rollsSkip > 0) {
      for (var i = (figRolls[figNr].length - 1); i > rollsSkip; i--) {
	roll[i] = roll[i - rollsSkip]
	rollSums[i] = rollSums[i - rollsSkip]
      }
      for (var i = rollsSkip; i > 0; i--) {
	roll[i] = Array()
	rollSums[i] = 0
      }
    }
// Set the number of the first roll for drawing later on
    if (figRolls[figNr][0] > 0) var rollnr = 0; else var rollnr = 1;

  // If there are multiple figNrs we check the rolls to see which one matches best
  // It's very important that with different figures with the same figure base the roll total is equal in the figures.js file
    if (figNrs.length > 1) {
      rollCorrMin = 9999; // Just a very large number to start with so the first correction will allways be smaller
      for (var i = 0; i < figNrs.length; i++) {
	rollCorr = 0
	for (var j = 0; j < roll.length; j++) {
	  if (figRolls[figNrs[i]][j] == 1) {
	    rollCorr = rollCorr + Math.abs((parseInt(rollSums[j] / 360) - (rollSums[j] / 360)) * 360)
	  } else if (figRolls[figNrs[i]][j] == 2) {
	    rollCorr = rollCorr + Math.abs((parseInt((rollSums[j] + 180) / 360) - ((rollSums[j] + 180) / 360)) * 360)
	  } 
	}
	if (rollCorr < rollCorrMin) {
	  rollCorrMin = rollCorr
	  figNr = figNrs[i]
	}
      }
      var figureDraw = figDraw[figNr]
    } else var figureDraw = figDraw[figNrs[0]]
  } else var figureDraw = figDraw[figNrs[0]]
// The chosen figure is now final, so we can assign Aresti Nr and K Factor to the figure
  var arestiNrs = new Array(figAresti[figNr])
  var kFactors = new Array(figKPwrd[figNr])
// If we are not in Form A we check for entry and exit extension and apply them
  if (activeForm != 'A') {
    var basePos = figString.indexOf(bareFigBase)
    for (var i = 0; i < figString.length; i++) {
      if ((figString.charAt(i) == userpat.forward) || (figString.charAt(i) == userpat.shortforward)) {
	if (i < basePos) {
	  figureDraw = figString.charAt(i) + figureDraw
	} else {
	  figureDraw = figureDraw + figString.charAt(i)
	}
      } else if (figString.charAt(i) == userpat.longforward) {
	if (i < basePos) {
	  figureDraw = userpat.forward + userpat.forward + userpat.forward + figureDraw
	} else {
	  figureDraw = figureDraw + userpat.forward + userpat.forward + userpat.forward
	}
      }
    }
  }

// Now we go through the drawing instructions
  var lineLength = 0
  var lineSum = 0
  var lineDraw = false
  var rollTop = false
// Build the start of figure symbol
  paths = buildShape('FigStart', seqNr, paths)
  for (var i = 0; i < figureDraw.length; i++) {
// First sum continuous lines in the figure
// No need to do shortening here as that's only done in the string provided by the user
    switch (figureDraw.charAt(i)) {
// Make long lines
      case (userpat.forward):
      case (userpat.rollext):
	lineSum = lineSum + 4
	lineDraw = true
	break;
// Make short lines
      case (userpat.shortforward):
      case (userpat.rollextshort):
	lineSum++
	lineDraw = true
	break;
// When a roll is encountered, continue there for line lengthening and/or shortening
      case (figpat.fullroll):
	break;
// When something else than a roll or line is encountered, build the line
      default:
	if (lineDraw) {
	  if (lineSum > 0) {
	    lineLength = lineLength + lineSum
	    paths = buildShape('Line', Array(lineSum, NegLoad), paths)
	  } else {
	    lineLength++
	    paths = buildShape('Line', Array(1, NegLoad), paths)
	  }
	  lineSum = 0
	  lineDraw = false
	}
    }
// Take care of everything but lines
    switch (figureDraw.charAt(i)) {
  // Make hammerheads
      case (figpat.hammer):
      case (figpat.pushhammer):
	paths = buildShape('Hammer', lineLength, paths)
	break;
  // Make tailslides
      case (figpat.tailslidecanopy):
      case (figpat.tailslidewheels):
	paths = buildShape('Tailslide', figureDraw.charAt(i), paths)
	break;
  // Make rolls, including any line lenghthening and/or shortening
      case (figpat.fullroll):
	if (roll[rollnr]) {
	  var rollPaths = Array ()
	  rollSum = 0
	  rollDone = false
	  attChanged = 0
	  for (j = 0; j < roll[rollnr].length; j++) {
// Build line elements after all extensions and shortenings have been processed
	    if (roll[rollnr][j]['type'] != 'line') {
	      if (lineDraw) {
		if (lineSum > 0) {
		  lineLength = lineLength + lineSum
		  rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths)
		} else {
		  lineLength++
		  rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths)
		}
		lineSum = 0
		lineDraw = false
	      }
	    }  
            switch (roll[rollnr][j]['type']) {
// Sum line elements
	      case ('line'):
		lineSum = lineSum + roll[rollnr][j]['extent']
		lineDraw = true;
                break;
    // Build roll elements
	      case ('roll'):
		rollPaths = buildShape('Roll', Array(roll[rollnr][j]['extent'], roll[rollnr][j]['stops'], rollTop), rollPaths)
		break;
	      case ('possnap'):
		rollPaths = buildShape('Snap', Array(roll[rollnr][j]['extent'], 0, rollTop), rollPaths)
		lineLength = lineLength + Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (snapElement075 / lineElement)
		break;
	      case ('negsnap'):
		rollPaths = buildShape('Snap', Array(roll[rollnr][j]['extent'], 1, rollTop), rollPaths)
		lineLength = lineLength + Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (snapElement075 / lineElement)
		break;
	      case ('posspin'):
		rollPaths = buildShape('Spin', Array(roll[rollnr][j]['extent'], 0, rollTop), rollPaths)
		lineLength = lineLength + Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (spinElement / lineElement)
		break;
	      case ('negspin'):
		rollPaths = buildShape('Spin', Array(roll[rollnr][j]['extent'], 1, rollTop), rollPaths)
		lineLength = lineLength + Math.abs(parseInt(roll[rollnr][j]['extent'] / 360)) * (spinElement / lineElement)
	    }
  // Find which roll in figures.js matches. There should only be one. Then add Aresti nr and K factor
	    var rollAtt = rollAttitudes[Attitude]
  // Find the correct snap/load combination
  // Snaps started knife edge are judged as 'pos from neg'/'neg from pos' with foot-down entry
	    if ((roll[rollnr][j]['type'] == 'possnap') || (roll[rollnr][j]['type'] == 'negsnap')) {
	      if (((rollSum / 180) == parseInt(rollSum / 180)) || (Attitude == 90) || (Attitude == 270)) {
  // Handle snaps on verticals and from non-knife-edge
		if (NegLoad == 0) rollAtt = '+' + rollAtt; else rollAtt = '-' + rollAtt
	      } else {
  // Handle snaps from knife edge. This is the only case (so far) where the way something is drawn (tip down=foot down) influences the K factor
		if ((Math.cos(dirAttToAngle (Direction, Attitude)) * roll[rollnr][j]['extent']) < 0) {
  // Foot down snap, the harder one
		  if (roll[rollnr][j]['type'] == 'possnap') rollAtt = '-' + rollAtt; else rollAtt = '+' + rollAtt;
		} else {
  // Foot up snap, the easier one
		  if (roll[rollnr][j]['type'] == 'possnap') rollAtt = '+' + rollAtt; else rollAtt = '-' + rollAtt;
		}
	      }
	    }
	    var rollI = rollBase.indexOf(rollAtt + roll[rollnr][j]['pattern'])
	    if (rollI >= 0) {
	      arestiNrs.push (rollAresti[rollI])
	      kFactors.push (rollKPwrd[rollI])
	    }
	    if (roll[rollnr][j]['type'] != 'line') {
	      rollSum = rollSum + roll[rollnr][j]['extent']
	      rollDone = true
  // Half rolls and all rolls in the vertical change direction and possibly attitude
	      if (((parseInt((rollSum + 180) / 360) - ((rollSum + 180) / 360)) == 0) || (Attitude == 90) || (Attitude == 270)) {
		Attitude = 180 - Attitude
		if (Attitude < 0) Attitude = Attitude + 360;
  // See if the direction should be changed from default
		if (regexChangeDir.test (figString)) {
		  if (activeForm == 'C') changeDir (Math.abs(rollSum)); else changeDir(-Math.abs(rollSum))
  // Remove all direction changers from the figure string once applied
		  figString = figString.replace(regexChangeDir, '')
		} else {
		  if (activeForm == 'C') changeDir (-Math.abs(rollSum)); else changeDir(Math.abs(rollSum))
		}
		rollSum = 0
		attChanged = 180 - attChanged
	      }
	    }
	  }
	  rollSum = rollSums[rollnr]
  // See if we have to autocorrect the rolls
	  if (figRolls[figNr][rollnr] == 1) {
	    autoCorr = (parseInt(rollSum / 360) - (rollSum / 360)) * 360
// When a line is standing by to be built, build it before doing the autocorrect
	    if (autoCorr != 0) {
	      if (lineDraw) {
		if (lineSum > 0) {
		  lineLength = lineLength + lineSum
		  rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths)
		} else {
		  lineLength++
		  rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths)
		}
		lineSum = 0
		lineDraw = false
	      }
// Also build a line if a roll was done before
              if (rollDone) {
		rollPaths = buildShape('Line', Array(2, NegLoad), rollPaths)
		lineLength = lineLength + 2
	      }
	    }
	    if (attChanged == 180) {
	      Attitude = 180 - Attitude
	      if (Attitude < 0) Attitude = Attitude + 360
	      changeDir(180)
	    }
	  } else if (figRolls[figNr][rollnr] == 2) {
	    autoCorr = (parseInt((rollSum + 180) / 360) - ((rollSum + 180) / 360)) * 360
// When a line is standing by to be built, build it before doing the autocorrect
	    if (autoCorr != 0) {
	      if (lineDraw) {
		if (lineSum > 0) {
		  lineLength = lineLength + lineSum
		  rollPaths = buildShape('Line', Array(lineSum, NegLoad), rollPaths)
		} else {
		  lineLength++
		  rollPaths = buildShape('Line', Array(1, NegLoad), rollPaths)
		}
		lineSum = 0
		lineDraw = false
	      }
// Also build a line if a roll was done before
              if (rollDone) {
		rollPaths = buildShape('Line', Array(2, NegLoad), rollPaths)
		lineLength = lineLength + 2
	      }
	    }
// Half rolls change direction and attitude
	    if (attChanged == 0) {
	      Attitude = 180 - Attitude
	      if (Attitude < 0) Attitude = Attitude + 360
	      changeDir(180)
	    }
	  } else {
	    autoCorr = 0;
	  }
  // Add autocorrect roll
	  if (autoCorr != 0) {
	    rollPaths = buildShape('Roll', Array(autoCorr,0), rollPaths)
  // Find which roll in figures.js matches. There should only be one. Then add Aresti nr and K factor
	    var rollAtt = rollAttitudes[Attitude]
	    switch (Math.abs(autoCorr)) {
	      case (90):
		var rollI = rollBase.indexOf(rollAtt + '4')
		break;
	      case (180):
		var rollI = rollBase.indexOf(rollAtt + '2')
		break;
	      case (270):
		var rollI = rollBase.indexOf(rollAtt + '3')
		break;
	      default:
		var rollI = -1
	    }
	    if (rollI >= 0) {
	      arestiNrs.push (rollAresti[rollI])
	      kFactors.push (rollKPwrd[rollI])
	    }
	    alertMsgs.push ('Fig ' + seqNr + userText.autocorrectRoll)
	  }
  // Add the second curve segment after a roll in the top
  // Invert the angle when it was a half roll
  // Move the pointer to where the roll should be. Start it offset so it is centered on the top (especially for multiple rolls)
	  if (rollTop) {
	    if (figRolls[figNr][rollnr] == 2) rollTopAngleAfter = -rollTopAngleAfter
	      
	    paths = buildShape ('Curve', rollTopAngleAfter, paths)
	    dx = paths[paths.length - 1]['dx']
	    dy = paths[paths.length - 1]['dy']
	    dxRolls = 0
	    dyRolls = 0
	    for (var k = 0; k < rollPaths.length; k++) {
	      if (rollPaths[k]['dx']) dxRolls = dxRolls + rollPaths[k]['dx']
	      if (rollPaths[k]['dy']) dyRolls = dyRolls + rollPaths[k]['dy']
	    }
	    paths.push ({'path':'', 'style':'', 'dx':-dx-(dxRolls/2), 'dy':-dy-(dyRolls/2)})
	  }
  // Add all the roll paths
	  for (var k = 0; k < rollPaths.length; k++) paths.push(rollPaths[k]);
  // Move back to the right place at the end of the curve after a roll in the top
	  if (rollTop) {
	    paths.push ({'path':'', 'style':'', 'dx':dx - (dxRolls / 2), 'dy':dy - (dyRolls / 2)})
	  }
	}  

  // The roll drawing has past, so make sure the rollTop variable is set to false
	rollTop = false
	rollnr++
	break;
    // (rolling) turns are handled here. We pass the turn part and any direction changers of the draw string.
    // Other parsing is in the makeTurn function
      case ('j'):
      case ('J'):
	if (regexChangeDir.test (figString)) {
	  if (activeForm == 'C') var prefix = ''; else var prefix = '>'
	} else {
	  if (activeForm == 'C') var prefix = '>'; else var prefix = ''
	}
	paths = buildShape ('Turn', prefix + figureDraw.replace(/[^jioJIO\d]+/g, ''), paths)
	var regex = /[jioJIO\d]+/
	while (regex.test(figureDraw.charAt(i))) i++;
	i--
        break;
// Handle angle and curve drawing
      default:
	if (figureDraw.charAt(i) in drawAngles) {
	  var angle = parseInt(drawAngles[figureDraw.charAt(i)])
    // Draw sharp angles for corners less than 180 unless specifically told to make a curve by '=' symbol
	  if ((Math.abs(angle) < 180) && (figureDraw.charAt(i + 1) != '=')) {
	    paths = buildShape ('Corner', angle, paths)
	  } else {
    // Draw curve. Half size when followed by '/' symbol
	    if (figureDraw.charAt(i + 1) == '/') curveRadius = curveRadius / 2
    // Check if the next roll should be in the top
	    if (figureDraw.charAt(i + 1) == '!') rollTop = true; else rollTop = false
	    if ((Math.abs(angle) < 360) && !rollTop) {
	      paths = buildShape ('Curve', angle, paths)
	    } else if (rollTop) {
    // Split any loop with a roll in top so we can use the second part later to determine the top
    // We do this by finding the point closest to the center of looping shape that has Attitude 0 or 180
	      attTop = Attitude + (angle / 2)
	      diffTop = ((attTop / 180) - parseInt ((attTop + 90) / 180)) * 180
	      if (Math.abs(diffTop) > 90) diffTop = ((attTop / 180) - parseInt ((attTop - 90) / 180)) * 180
	      angleTop = (angle / 2) - diffTop
	      paths = buildShape ('Curve', angleTop, paths)
	      var rollTopAngleAfter = angle - angleTop
	    } else {
    // Split full loops in two parts for drawing.
	      paths = buildShape ('Curve', angle / 2, paths)
	      paths = buildShape ('Curve', angle / 2, paths)
	    }	  
	    if (figureDraw.charAt(i + 1) == '/') curveRadius = curveRadius * 2
	  }
	  if (angle < 0) NegLoad = 1; else NegLoad = 0
    // The lineLength may be necessary for e.g. hammerhead and is set to 0 after any angle
	  lineLength = 0
	}
    }
  }
// Draw any remaining line, we can leave the variables 'dirty' because there is no more processing after this
  if (lineDraw) {
    if (lineSum > 0) {
      paths = buildShape('Line', Array(lineSum, NegLoad), paths)
    } else {
      paths = buildShape('Line', Array(1, NegLoad), paths)
    }
  }

// Make the end of figure symbol
  paths = buildShape ('FigStop', '', paths)
// The figure is complete. Create the final figure array for later processing (drawing Forms)
  var figureArray = {'paths':paths, 'aresti':arestiNrs, 'k':kFactors, 'string':figString}
  figure.push(figureArray)
}

// parseSequence parses the sequence character string
function parseSequence (string) {
  var seqNr = 1
  var fig = ''
  connectors = 0
// Make sure the scale is set to 1 before parsing
  if (scale != 1) {
    curveRadius = curveRadius / scale
    rollcurveRadius = rollcurveRadius / scale
    lineElement = lineElement / scale
    scale = 1
  }
// Create a separate 'figure' for moveForward (x>) at the beginning of a figure. OLAN has it coupled to a figure but OpenAero keeps sequence drawing instructions separate
  string = string.replace(RegExp(' ([0-9]*' + userpat.moveforward + '+)', 'g'), " $1 ")
  string = string.replace(RegExp('^([0-9]*' + userpat.moveforward + '+)', 'g'), "$1 ")
// Remove leading, trailing and multiple spaces
  string = string.replace(/^\s+|\s+$/g, '')
  string = string.replace(/  +/g, ' ')
// Move forward without connecting line
// See if there is a y-axis swap symbol and activate it, except when it matches the subSequence code
  if (string.replace(' '+userpat.subSequence+' ','').indexOf(userpat.swapYaxis) > -1) yAxisOffset = 180 - yAxisOffset
// Split the string in separate figures
  var figures = string.split(" ")
  for (var i = 0; i < figures.length; i++) {
    fig = figures[i]
// Parse out the instructions that are for drawing B and C forms only
    if (regexDrawInstr.test(fig) || (fig.replace(regexMoveForward, '').length == 0) || (fig == userpat.subSequence)) {
      var onlyDraw = true
      if (fig.charAt(0) == userpat.moveto) {
// Move to new position
	var dxdy = fig.replace(/[^0-9\,\-]/g, '').split(',')
	if (dxdy[0] && dxdy[1]) buildMoveTo (dxdy);
      } else if (regexMoveForward.test(fig)) {
// Move forward without connecting line
        var moveFwd = fig.match(regexMoveForward)[0]
        if (parseInt (moveFwd)) {
  	  figure.push({'paths': buildShape ('FigSpace', parseInt(moveFwd) + moveFwd.length - moveFwd.match(/[0-9]*/).length - 1)})
	} else {
  	  figure.push({'paths': buildShape ('FigSpace', moveFwd.length)})
	}
      } else if (fig.charAt(fig.length - 1) == userpat.scale) {
// Change scale
	if (scale != 1) {
	  curveRadius = curveRadius / scale
	  rollcurveRadius = rollcurveRadius / scale
	  lineElement = lineElement / scale
	}
	scale = 1 + (parseInt (fig.replace(userpat.scale, '')) / 10)
	if (!scale) scale = 1
	if (scale < 0.1) scale = 0.1
	curveRadius = curveRadius * scale
	rollcurveRadius = rollcurveRadius * scale
	lineElement = lineElement * scale
      } else if (fig == userpat.subSequence) {
// Start subsequence
	firstFigure = true;
        Attitude = 0
	Direction = 0
      }
    } else {
      if (regexConnector.test(fig)) connectors++
// To determine the base we remove all non-alphabet characters (except -)
      var base = fig.replace(/[^a-z\-]+/g, '')
// Replace any x> format to move forward by x times >
      if (regexMoveForward.test(fig)) {
        var moveFwd = fig.match(regexMoveForward)[0]
        if (parseInt (moveFwd)) {
  	  fig = fig.replace(regexMoveForward, parseInt(moveFwd) + moveFwd.length - moveFwd.match(/[0-9]*/).length - 1)
	} else {
  	  fig = fig.replace(regexMoveForward, moveFwd.length)
	}
      }
// Handle the very special case where there's only an upright (1) or inverted (2) spin
      if (base.replace(/-/g, '') == 's') {
	fig = fig.replace(/(\d*)s/, "iv$1s")
	base = base.replace('s', 'iv')
      } else if (base.replace(/-/g, '') == 'is') {
	fig = fig.replace(/(\d*)is/, "iv$1is")
	base = base.replace('is', 'iv')
      }
// To continue determining the base we remove if, is, f, s
      base = base.replace(/if|is|f|s/g, '')
// Handle simple horizontal rolls that change from upright to inverted or vv
      if (base == '-') {
	if (fig.replace(/[^a-z0-9\-\+]+/g, '').charAt(0) == '-') base = base + '+'; else base = '+' + base
// Handle everything else
      } else {
	if (base.charAt(0) != '-') base = '+' + base;
        if (base.charAt(base.length - 1) != '-') base = base + '+'
      }
// Autocorrect the entry attitude for figures after the first (sub)figure where necessary
      if (!firstFigure) {
// Start upright
	if (Attitude == 0) {
	  while (base.charAt(0) == '-') {
	    base = base.substring(1)
	    alertMsgs.push ('Fig ' + seqNr + userText.setUpright)
	  }
// Start inverted
	} else if (Attitude == 180) {
	  if (base.charAt(0) != '-') {
	    base = '-' + base
	    alertMsgs.push ('Fig ' + seqNr + userText.setInverted)
	  }
	}
      }
// Handle turns and rolling turns. They do have numbers in the base
      if ((base.charAt(1) == 'j') || ((base.charAt(1) == 'i') && (base.charAt(2) == 'j'))) {
	base = fig.replace(/[^a-z0-9\-\+]+/g, '')
        if (base.charAt(0) != '-') base = '+' + base;
        if (base.charAt(base.length - 1) != '-') base = base + '+'
      }
// Retrieve the figNrs (if any) from array figBaseLookup
      figNrs = figBaseLookup[base]
      if (figNrs) {
// Create empty space before each figure
        figure.push({'paths': buildShape ('FigSpace', 2)})
// When the first figure starts negative we make sure the Attitude is inverted and the DRAWING direction stays the same
        if ((firstFigure) && (base.charAt(0) == '-')) {
	  Attitude = 180
	  Direction = 180 - Direction
	}
	buildFigure (figNrs, fig, seqNr)
	seqNr ++
	firstFigure = false;
// Reset scale to 1 after completing a figure
	if (scale != 1) {
	  curveRadius = curveRadius / scale
	  rollcurveRadius = rollcurveRadius / scale
	  lineElement = lineElement / scale
	  scale = 1
	}
// Crossbox entry 'figure'
      } else if ((firstFigure) && (base == '+ej+')) {
	Direction = 270
// Downwind entry 'figure'
      } else if ((firstFigure) && (base == '+ed+')) {
	Direction = 180 - Direction
      } else {
	buildIllegal ()
	if (i == (figures.length - 1)) {
	  alertMsgs.push (userText.illegalAtEnd)
	} else {  
	  alertMsgs.push (userText.illegalBefore + seqNr)
	}
      }
    }
  }
// Check the sequence against the correct rules
  if (rulesActive) checkRules ();
// Build the last figure stop shape after all's done. This won't work well if 'move' figures are added at the end
  if (!firstFigure) figure.push({'paths': buildShape ('FigStop', true)})
// Set firstFigure back to true for another drawing session
  firstFigure = true
}