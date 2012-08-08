// config.js file

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
// * These variables can be used to change the look of sequences
// * and even the way they are parsed.
// *
// * Changing these variables is at your own risk and might stop
// * the software from functioning!
// *
// **************************************************************

// **************
// Define drawing lengths, radiuses etc
// **************

// basic curve size
var curveRadius = 40
// roll curve size
var rollcurveRadius = 20
// basic line element size
var lineElement = 10
// basic Snap element size
var snapElement = 8
// basic Spin element size
var spinElement = 8
// derived line element sizes, prevents many calculations during runtime
var lineElement12 = lineElement * 1.2
var lineElement2 = lineElement * 2
var lineElement24 = lineElement * 2.4
var lineElement3 = lineElement * 3
// derived snap element sizes, prevents many calculations during runtime
var snapElement12 = snapElement * 1.2
var snapElement2 = snapElement * 2
var snapElement24 = snapElement * 2.4
var snapElement3 = snapElement * 3
// derived spin element sizes, prevents many calculations during runtime
var spinElement12 = spinElement * 1.2
var spinElement2 = spinElement * 2
var spinElement24 = spinElement * 2.4
var spinElement3 = spinElement * 3
// define the offset for figures in the y axis
var yAxisOffsetDefault = 30
// how much to flatten turns in the Y axis
var flattenTurn = (2 / 3)
// Superfamily definitions
// For every category the list of SF is defined below. The order MATTERS! The SF will be decided by the first aresti fig nr match
var superFamilies = new Array()
superFamilies['unlimited'] = {'2.':'2', '5.':'5', '6.':'6', '1.':'7', '7.':'7', '8.':'7'}
superFamilies['advanced'] = {'9.11.':'3', '9.12.':'3', '9.9.':'4', '9.10.':'4', '2.':'2', '5.':'5', '6.':'6', '1.':'7', '7.':'7', '8.':'7'}
superFamilies['yak52'] = superFamilies['advanced']
// Total K for Unknown connector figures
var connectorsTotalK = 24

// *************
// Define styles and font sizes
// *************
var style = new Array()
// Positive line style
style['pos'] = 'stroke: black; stroke-width: 1px; fill: none;'
// Negative line style
style['neg'] = 'stroke-dasharray: 5, 3; stroke: red; stroke-width: 1px; fill: none;'
// Black filled path style
style['blackfill'] = 'stroke: black; stroke-width: 1px; fill: black;'
// Positive filled path style
style['posfill'] = 'stroke: black; stroke-width: 1px; fill: white;'
// Negative filled path style
style['negfill'] = 'stroke: black; stroke-width: 1px; fill: red;'
// Dotted path style
style['dotted'] = 'stroke-dasharray: 1, 2; stroke: black; stroke-width: 1px; fill: none;'
// Illegal figure cross style
style['illegalCross'] = 'stroke: red; stroke-width: 3px; fill: none;'
// Illegal figure box style
style['illegalBox'] = 'stroke: black; stroke-width: 1px; fill: none;'
// Roll font size
rollFontSize = 14
// Roll text style
style['rollText'] = 'font-family: sans; font-size: ' + rollFontSize + 'px; stroke: red; stroke-width: 0.5px; fill: red;'
// Mini Form A styles
style['miniFormA'] = 'font-family: verdana, helvetica, sans; font-size: 10px; fill: black;'
style['miniFormATotal'] = 'font-family: verdana, helvetica, sans; font-size: 16px; font-weight: bold; fill: black;'
// Form A styles
style['FormAText'] = 'font-family: verdana, helvetica, sans; font-size: 12px; fill: black;'
style['FormATextBold'] = 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;'
style['FormATextLarge'] = 'font-family: verdana, helvetica, sans; font-size: 18px; fill: black;'
style['FormLine'] = 'stroke: black; stroke-width: 1px; fill: none;'
style['FormLineBold'] = 'stroke: black; stroke-width: 4px; fill: none;'
// Print styles
style['FormBackground'] = 'fill: white;'

// ***************
// Define patterns for the user's OpenAero drawing string
// ***************

var userpat = new Object();
userpat.forward = '~'
userpat.shortforward = '\''
userpat.longforward = '+'
userpat.sameroll = ';'
userpat.opproll = ','
userpat.rollext = '.'
userpat.rollextshort = '\''
userpat.rolllineshorten = '`'
userpat.movedown = '^'
userpat.moveforward = '>'
userpat.samedir = '>'
userpat.switchdir = '^'
userpat.moveto = '['
userpat.scale = '%'
userpat.swapYaxis = '/'
userpat.connector = '='
userpat.subSequence = '//'

// ***************
// Define patterns for the software figure string
// ***************

var figpat = new Object();
figpat.fullroll = '_'
figpat.halfroll = '^'
figpat.anyroll = '&'
figpat.hammer = 'h'
figpat.pushhammer = 'H'
figpat.tailslidecanopy = 't'
figpat.tailslidewheels = 'T'
var drawAngles = {'d':45, 'v':90, 'z':135, 'm':180, 'c':225, 'p':270, 'r':315, 'o':360, 'D':-45, 'V':-90, 'Z':-135, 'M':-180, 'C':-225, 'P':-270, 'R':-315, 'O':-360}
var rollAttitudes = {'0':'', '45':'d', '90':'v', '135':'d', '180':'', '225':'id', '270':'iv', '315':'id'}

// ****************
// define Regex patterns for drawing and sequence parsing
// ****************

regexChangeDir = new RegExp ('[' + userpat.samedir + '\\' + userpat.switchdir + ']')
regexMoveForward = new RegExp ('^[0-9]*' + userpat.moveforward + '+')
regexDrawInstr=/[\[\]\%]+/
regexConnector = new RegExp (userpat.connector)

// ****************
// define texts for user interaction
// ****************

var userText = new Object();
userText.removeLogo = 'Remove logo'
userText.chooseLogo = 'Choose logo'
userText.pilot = 'pilot'
userText.ac = 'A/C'
userText.closeIt = 'Close'
userText.wind = 'wind/vent'
userText.illegalFig = ' is illegal, try '
userText.autocorrectRoll = ':Added autocorrect roll'
userText.setUpright = ':set upright entry'
userText.setInverted = ':set inverted entry'
userText.illegalAtEnd = 'Illegal figure at the end'
userText.illegalBefore = 'Illegal figure before figure '
userText.saveFileAsAlert = 'To download your file, right-click on this text and choose "Save link as..." or "Save file as...".'
userText.fileNotSaved = 'File not yet saved.<br>Saving files works better on Firefox 3.0 or later.<br>You can try to save your file from the browser window that should have been opened now.'
userText.logoExplain = 'Upload your own logo by clicking on the file chooser below, or select one of the displayed logos.'
userText.sequenceNotSavedWarning = 'Your current sequence has not been saved.\nAre you sure you want to open a new one?'
userText.fileOpeningNotSupported = 'File opening is not supported in this browser.'
userText.unknownFileType = 'File opening is not supported in this browser.'