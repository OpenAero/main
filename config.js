// config.js 1.2.0

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
// * These variables can be used to change the look of sequences
// * and even the way they are parsed.
// *
// * Changing these variables is at your own risk and might stop
// * the software from functioning!
// *
// **************************************************************

// **************
// Define active version number of OpenAero
// **************

var version = '1.2.0';

// **************
// Define drawing lengths, radiuses etc
// **************

// basic curve size
var curveRadius = 40;
// roll curve size
var rollcurveRadius = 20;
// basic line element size
var lineElement = 10;
// basic Snap element size
var snapElement = 8;
// basic Spin element size
var spinElement = 8;
// derived line element sizes, prevents many calculations during runtime
var lineElement075 = lineElement * 0.75;
var lineElement12 = lineElement * 1.2;
var lineElement2 = lineElement * 2;
var lineElement24 = lineElement * 2.4;
var lineElement3 = lineElement * 3;
// derived snap element sizes, prevents many calculations during runtime
var snapElement075 = snapElement * 0.75;
var snapElement12 = snapElement * 1.2;
var snapElement2 = snapElement * 2;
var snapElement24 = snapElement * 2.4;
var snapElement3 = snapElement * 3;
// derived spin element sizes, prevents many calculations during runtime
var spinElement12 = spinElement * 1.2;
var spinElement2 = spinElement * 2;
var spinElement24 = spinElement * 2.4;
var spinElement3 = spinElement * 3;
// define the offset for figures in the y axis in degrees
var yAxisOffsetDefault = 30;
// how much to flatten turns in the Y axis
var flattenTurn = (2 / 3);
// how far apart the starts of figures should at least be
var minFigStartDist = lineElement * 3;
var minFigStartDistSq = minFigStartDist * minFigStartDist;

// Superfamily definitions
// For every category the list of SF is defined below. The order MATTERS! The SF will be decided by the first aresti fig nr match
var superFamilies = [];
superFamilies['unlimited'] = {'2.':'2', '5.':'5', '6.':'6', '1.':'7', '3.':'7', '7.':'7', '8.':'7'};
superFamilies['advanced'] = {'9.11.':'3', '9.12.':'3', '9.9.':'4', '9.10.':'4', '2.':'2', '5.':'5', '6.':'6', '1.':'7', '3.':'7', '7.':'7', '8.':'7'};
superFamilies['yak52'] = superFamilies['advanced'];
superFamilies['intermediate'] = superFamilies['advanced'];
// Total K for Unknown connector figures
var connectorsTotalK = 24;
// available rolls
var rollTypes = [':none','4:1/4','2:1/2','3:3/4','1:1','5:1 1/4','6:1 1/2','7:1 3/4','9:2','22:2x2','32:3x2','42:4x2']
for (i = 2; i < 9; i++) rollTypes.push(i + '4:' + i + 'x4');
rollTypes.push('8:2x8');
for (i = 2; i < 9; i++) rollTypes.push((i*2) + '8:' + (i*2) + 'x8');
var flickTypes = ['2f:1/2 pos flick','3f:3/4 pos flick','f:1 pos flick','5f:1 1/4 pos flick','6f:1 1/2 pos flick','7f:1 3/4 pos flick','9f:2 pos flick','2if:1/2 neg flick','3if:3/4 neg flick','if:1 neg flick','5if:1 1/4 neg flick','6if:1 1/2 neg flick','7if:1 3/4 neg flick','9if:2 neg flick'];
var spinTypes = ['s:1 pos spin','5s:1 1/4 pos spin','6s:1 1/2 pos spin','7s:1 3/4 pos spin','9s:2 pos spin','is:1 neg spin','5is:1 1/4 neg spin','6is:1 1/2 neg spin','7is:1 3/4 neg spin','9is:2 neg spin'];
// how many rolls per roll position
var rollsPerRollElement = 2;

// *************
// Define styles and font sizes
// *************
var style = [];
// Positive line style
style['pos'] = 'stroke: black; stroke-width: 1px; fill: none;';
style['chooserPos'] = 'stroke: black; stroke-width: 3px; fill: none;';
// Negative line style
style['neg'] = 'stroke-dasharray: 5, 3; stroke: red; stroke-width: 1px; fill: none;';
style['chooserNeg'] = 'stroke-dasharray: 10, 6; stroke: red; stroke-width: 3px; fill: none;';
// Black filled path style
style['blackfill'] = 'stroke: black; stroke-width: 1px; fill: black;';
// Positive filled path style
style['posfill'] = 'stroke: black; stroke-width: 1px; fill: white;';
// Negative filled path style
style['negfill'] = 'stroke: black; stroke-width: 1px; fill: red;';
// Dotted path style
style['dotted'] = 'stroke-dasharray: 1, 3; stroke: black; stroke-width: 1px; fill: none;';
// Illegal figure cross style
style['illegalCross'] = 'stroke: red; stroke-width: 3px; fill: none;';
// Illegal figure box style
style['illegalBox'] = 'stroke: black; stroke-width: 1px; fill: none;';
// Roll font size
rollFontSize = 14;
// Roll text style
style['rollText'] = 'font-family: sans; font-size: ' + rollFontSize +
  'px; stroke: red; stroke-width: 0.5px; fill: red;';
// Mini Form A styles
style['miniFormA'] = 'font-family: verdana, helvetica, sans; font-size: 10px; fill: black;';
style['miniFormATotal'] = 'font-family: verdana, helvetica, sans; font-size: 16px; font-weight: bold; fill: black;';
// Form A styles
style['FormAText'] = 'font-family: verdana, helvetica, sans; font-size: 12px; fill: black;';
style['FormATextBold'] = 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;';
style['FormATextBold8px'] = 'font-family: verdana, helvetica, sans; font-size: 8px; font-weight: bold; fill: black;';
style['FormATextBold9px'] = 'font-family: verdana, helvetica, sans; font-size: 9px; font-weight: bold; fill: black;';
style['FormATextBold10px'] = 'font-family: verdana, helvetica, sans; font-size: 10px; font-weight: bold; fill: black;';
style['FormATextBold11px'] = 'font-family: verdana, helvetica, sans; font-size: 11px; font-weight: bold; fill: black;';
style['FormATextBold12px'] = 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;';
style['FormATextBold13px'] = 'font-family: verdana, helvetica, sans; font-size: 13px; font-weight: bold; fill: black;';
style['FormATextLarge'] = 'font-family: verdana, helvetica, sans; font-size: 18px; fill: black;';
style['FormLine'] = 'stroke: black; stroke-width: 1px; fill: none;';
style['FormLineBold'] = 'stroke: black; stroke-width: 4px; fill: none;';
// Print styles
style['FormBackground'] = 'fill: white;';

// ***************
// Set png masks for buttons
// ***************

var mask = [];
mask.off = 'buttons/mask.png';
mask.on = 'buttons/mask-on.png';
mask.disable = 'buttons/mask-disable.png';
mask.smalloff = 'buttons/smallMask.png';
mask.smallon = 'buttons/smallMask-on.png';

// ***************
// Define patterns for the user's OpenAero drawing string
// ***************

var userpat = [];
userpat.forward = '~';
userpat.longforward = '+';
userpat.forwardshorten = '<';
userpat.sameroll = ';';
userpat.opproll = ',';
userpat.rollext = '.';
userpat.rollextshort = '\'';
userpat.lineshorten = '`';
userpat.movedown = '^';
userpat.moveforward = '>';
userpat.switchDirX = '>';
userpat.switchDirY = '^';
userpat.moveto = '[';
userpat.scale = '%';
userpat.flipYaxis = '/';
userpat.connector = '=';
userpat.subSequence = '//';

// ***************
// Define patterns for the software figure string
// ***************

var figpat = [];
figpat.forward = '\'';
figpat.longforward = '~';
figpat.fullroll = '_';
figpat.halfroll = '^';
figpat.anyroll = '&';
figpat.hammer = 'h';
figpat.pushhammer = 'H';
figpat.tailslidecanopy = 't';
figpat.tailslidewheels = 'T';
var drawAngles = {'d':45, 'v':90, 'z':135, 'm':180, 'c':225, 'p':270, 'r':315, 'o':360, 'D':-45, 'V':-90, 'Z':-135, 'M':-180, 'C':-225, 'P':-270, 'R':-315, 'O':-360};
var rollAttitudes = {'0':'', '45':'d', '90':'v', '135':'d', '180':'', '225':'id', '270':'iv', '315':'id'};

// ****************
// define Regex patterns for drawing and sequence parsing
// ****************

var regexChangeDir = new RegExp ('[' + userpat.switchDirX + '\\' + userpat.switchDirY + ']');
var regexSwitchDirX = new RegExp ('\\' + userpat.switchDirX);
var regexSwitchDirY = new RegExp ('\\' + userpat.switchDirY);
var regexMoveForward = new RegExp ('^[0-9]*' + userpat.moveforward + '+');
var regexDrawInstr = new RegExp ('[\\[\\]\\%]+');
var regexConnector = new RegExp (userpat.connector);
var regexMoveTo = new RegExp ('\[[0-9\-]*,[0-9\-]*\]');
var regexLongForward = new RegExp ('\\' + userpat.longforward, 'g');
var regexEntryShorten = /`+\+/;
var regexExitShorten = /\+`+/;
var regexFlipYAxis = /(^|[^\/])\/([^\/]|$)/g;

// ****************
// define texts for user interaction
// ****************

var userText = [];
userText.removeLogo = 'Remove logo';
userText.chooseLogo = 'Choose logo';
userText.pilot = 'pilot';
userText.ac = 'A/C';
userText.closeIt = 'Close';
userText.wind = 'wind/vent';
userText.illegalFig = ' is illegal, try ';
userText.autocorrectRoll = ':Added autocorrect roll';
userText.setUpright = ':set upright entry';
userText.setInverted = ':set inverted entry';
userText.illegalAtEnd = 'Illegal figure at the end';
userText.illegalBefore = 'Illegal figure before figure ';
userText.saveFileAsAlert = 'To download your file, right-click on this text and choose "Save link as..." or "Save file as...".';
userText.logoExplain = 'Upload your own logo by clicking on the file chooser below, or select one of the displayed logos.';
userText.sequenceNotSavedWarning = 'Your current sequence has not been saved.\nAre you sure you want to open a new one?';
userText.fileOpeningNotSupported = 'File opening is not supported in this browser.';
userText.unknownFileType = 'File opening is not supported in this browser.';
userText.pleaseWaitStartup = 'Please wait while OpenAero is starting up...';
userText.editingFigure = 'Edit figure ';
userText.addingFigure = 'Add new figure'; 
userText.confirmLeave = 'You\'re leaving OpenAero. Any sequence that is not saved will be lost.';
userText.rollPos = ['First roll position', 'Second roll position', 'Third roll position', 'Fourth roll position'];
userText.clickAddFigure = 'Click to add figure';
userText.clickChangeFigure = 'Click to change figure';
userText.downloadHTML5 = 'However, you can save your file by clicking on the link below.';
userText.downloadLegacy = 'However, you can save your file by right-clicking on the link below '+
  'and choosing "Save File As..." or "Save Link As...".';
userText.downloadWarning = 'File saving works best through the OpenAero website '+
  '(<a href="http://www.openaero.net">www.openaero.net</a>) or by running '+
  'OpenAero on your own server.';
userText.printForms = 'OpenAero printing forms...';
