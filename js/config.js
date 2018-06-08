// config.js

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
// It is of format yyyy.x.z
// Where a new x should be used for versions that create sequences not
// fully backward compatible with the previous version

var version = '2018.3.4';
/* versionNew is an object that contains version update information
   The structure is {vvv : [[ttt, n], ...], ...} , where
   vvv = version number
   ttt = update text
   n   = importance (higher = more important)
*/
var versionNew = {
	'2018.3.3' : [
		['Improved Grid display options and figure group creation for ' +
		'glider competition', 4],
		['Fixed bug which caused switching the first roll of 3-roll ' +
		'figures to behave erratically', 3]
	],
	'2018.3.2' : [
		['Updated CIVA Glider rules for 2018, including Sporting Code ' +
		'references', 3]
	],
	'2018.3' : [
		['<font style="color:red;">2018 Advanced Free Known figure A was ' +
		'changed by CIVA in early may (snap roll direction now the same ' +
		'as 1 1/2 roll). Make sure to check sequences that have already ' +
		'been made</font>', 5]
	], 
	'2018.2.1' : [
		['Improved printing and printing options of several forms', 2]
	],
	'2018.2' : [
		['Changed figure chooser to show all possible roll positions', 3]
	],
	'2018.1.9' : [
		['Enabled blue figure editing handles option for phone layout (can be disabled in Settings)', 1],
		['Improved saving and sharing sequences from mobile app', 3]
	],
	'2018.1.7' : [
		['Added French rules and sequences for 2018', 3]
	],
	'2018.1.6' : [
		['Fixed bug that made it impossible to choose a free figure in the Designer', 4]
	],
	'2018.1.5' : [
		['Corrected roll position in several figures of 8.6.17-8.6.24', 4],
		['iOS app now available in the App Store', 4]
	],
	'2018.1.4' : [
		['Corrected CIVA 2018 rules regarding required rolling turn in the Free Known', 4],
		['Added IAC and BAeA Known sequences for 2018', 3]
	],
	'2018.1' : [
		['CIVA rules and Free Known sequences for 2018', 4],
		['Aresti Catalogue updates for 2018', 4],
		['Overhauled interface completely, including addition of special mobile device menus', 4],
    ['Expanded Free Unknown Designer to also support Free Known sequences', 5]
	],
  '2017.2.3' : [
    ['Switched figure rows 8.6.18 and 8.6.19 as they were not according latest Aresti catalog', 3]
  ],
  '2017.2.2' : [
    ['Fixed several issues with Free Unknown designer', 3]
  ],
  '2017.2.1' : [
    ['Fixed incorrect handling of some P-loops with half roll in top', 4],
    ['Added French rules and sequences for 2017', 3],
    ['Improved look and layout of figure chooser', 2]
  ],
  '2017.2' : [
    ['Updated BAeA logo for 2017', 1],
    ['Only show "Additional" when rules allow the use of Additional figures', 3],
    ['Added dragging of sequence from system file manager to OpenAero to open it', 3]
  ],
  '2017.1.2' : [
    ['Disabled Chrome App installation for other than ChromeOS as ' +
      'support <a href="https://blog.chromium.org/2016/08/from-chrome-apps-to-web.html" target="_blank">' +
      'will be ended by Google</a>', 4],
    ['IAC Glider sequences for 2017', 3],
    ['NZAC Power sequences for 2017/2018', 3]
  ],
  '2017.1.1' : [
    ['BAeA Power and glider rules and sequences for 2017', 3]
  ],
  '2017.1' : [
    ['CIVA rules and Free Known sequences for 2017', 4],
    ['IAC Power rules and sequences for 2017', 3],
    ['Added Grid info panel with figure group generator to improve ' +
    'figure selection for Free Unknowns', 4]
  ],
  '2016.3.5' : [
    ['Updated NZAC rules for 2016/2017', 3]
  ],
  '2016.3.2' : [
    ['Improved printing for iOS and Microsoft Edge', 2]
  ],
  '2016.3' : [
    ['Made many changes to the interface to conform to ' +
    '<a href="https://material.google.com/" target="_blank">Material ' +
    'Design</a> philosophy. This will be the new look and feel of ' +
    'OpenAero to improve user interaction.', 3]
  ],
  '2016.2' : [
    ['Added option to flip the Y axis direction for individual ' +
    'figures. Except when the figure starts on Y axis.', 4],
    ['Added "Open Sequence" for iOS. As of iOS 9, opening files from ' +
    'Dropbox and Google Drive is supported.', 2]
  ],
  '2016.1.5' : [
    ['Added French rules for 2016, including reduced K factors for ' +
    'rolling turns in certain categories', 3]
  ],
  '2016.1.3' : [
    ['Added option to lock the sequence to prevent changing it', 2],
    ['Improved drag & drop of figures', 2]
  ],
  '2016.1.1' : [
    ['IAC Power rules for 2016', 3]
  ],
  '2016.1' : [
    ['Corrected handling of direction in double bumps with different ' +
    'radii and having a roll of uneven quarters on the first line ' +
    'and a roll on the second line', 3],
    ['Added drag & drop figure editing. When a figure is selected, ' +
    'handles appear that allow you to change all line lengths ' +
    'directly.', 4],
    ['CIVA rules and Free Known sequences for 2016', 4]
  ],
  '1.5.2.1' : [
    ['Added AAC Sportsman Free rules', 2]
  ],
  '1.5.2' : [
    ['Updated German Aerobatics and CIVA Glider rules', 2],
    ['Added figure string input field for Free Unknown Designer linking figures', 1]
  ],
  '1.5.1.4' : [
    ['Fixed printing failing on some systems', 3]
  ],
  '1.5.1.2' : [
    ['Fixed some bugs in form L & R handling of K factors', 3]
  ],
  '1.5.1' : [
    ['New form L & R concepts added', 4],
    ['Reference sequence checking for detecting errors in Free Unknown', 4]
  ],
  '1.5.0.4' : [
    ['Sequence data is embedded in PNG image', 3],
    ['Fixed bug causing printing to be disabled', 3],
    ['Added "Open Sequence link". Especially useful for iOS', 3]
  ],
  '1.5.0'   : [
    ['<b>Free Unknown designer!</b> Create Free Unknown sequences ' +
      'efficiently', 5],
    ['CIVA rules and sequences for 2015', 4],
    ['IAC rules for Free sequences and limited checking for Unknown ' +
      'sequences', 3],
    ['Printing and image saving of multiple sequences at once; ' +
      'Tools -> Print multiple seq', 2],
    ['Added alerts for illegal spins', 2],
    ['Added French translations for sequence alerts', 2],
    ['Many national sequences for 2015', 2]
  ]
}
// versionNewMax defines the maximum updates to show when upgrading
var versionNewMax = 10;

// platform holds various platform variables
var platform = {};

// Define chrome app id and if app is active
var chromeApp = {
  'id': 'gadjhgnenmdfihhmnhgpcijlafpahfbi',
  'active': false
}

// platform.cordova is set to true here. It is set to false in
// cordova.js when not compiled on Cordova
platform.cordova = true;

// define the labels (=input field ids) for saving/loading sequences
var sequenceXMLlabels = [
  'pilot',
  'team',
  'aircraft',
  'actype',
  'acreg',
  'category',
  'location',
  'date',
  'class',
  'program',
  'rules',
  'positioning',
  'harmony',
  'notes',
  'sequence_text',
  'fu_figures',
  'logo',
  'oa_version',
  'default_view',
  'lock_sequence',
  'pilot_id',	// Ajout Modif GG 2017
  'flight_nb'	// Ajout Modif GG 2017
  ];

/**********************************************************************
 * 
 * Sequence drawing configuration
 * 
 * Define lengths, radii etc
 * 
 **********************************************************************/

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
var snapElement15 = snapElement * 1.5;
var snapElement2 = snapElement * 2;
var snapElement24 = snapElement * 2.4;
var snapElement3 = snapElement * 3;
// derived spin element sizes, prevents many calculations during runtime
var spinElement12 = spinElement * 1.2;
var spinElement2 = spinElement * 2;
var spinElement24 = spinElement * 2.4;
var spinElement3 = spinElement * 3;
// define golden ratio
Math.GR = 1.618;
// define A4 page ratio
Math.PageRatio = 1.4143;
// Tau is 2 times PI. Saves calculations during runtime
Math.Tau = Math.PI * 2;
// degToRad is Pi / 180. Saves calculations for degree to rad conversions
Math.degToRad = Math.PI / 180;
Math.radToDeg = 180 / Math.PI;
// define the offset for figures in the y axis in degrees
var yAxisOffsetDefault = 30;
// define the scale factor on the y axis for perspective drawing
var yAxisScaleFactor = 0.7;
// how much to flatten turns in the Y axis
var flattenTurn = 0.7;
// set scaleLine object to prevent calculations in makeLine
var scaleLine = {'x':1, 'y':1};
// define whether to show numbers in circles
var numberInCircle = false;
// define whether to show curves in perspective on Y axis
var curvePerspective = true;
// newTurnPerspective is a checkbox in settings
var newTurnPerspective;
// how far apart the starts of figures should at least be
var minFigStartDist = lineElement * 3;
var minFigStartDistSq = minFigStartDist * minFigStartDist;
// how much margin to use when automatically separating figures
var separateMargin = 2;

/**********************************************************************
 * 
 * User interface configuration
 * 
 **********************************************************************/

// define if we show an error when running from file://
var presentFileError = false;
// show mini Form A on Form B and C
var miniFormA = true;
// define whether to draw IAC style forms by default
var iacForms = false;
// define default pattern for figure images saved in ZIP
var zipImageFilenamePattern = '%location %category %program %pilot Form %form_fig_%figure';
// define which settings will be saved in localStorage and sequence XML
var saveSettings = [
  'language',
  'marginBottom',
  'marginLeft',
  'marginTop',
  'marginRight',
  'gridColumns',
  'queueColumns',
  'saveFigsSeparateWidth',
  'saveFigsSeparateHeight',
  'zipImageFilenamePattern',
  'numberInCircle',
  'positionClearAuto',
  'showHandles',
  'smallMobile',
  'rollFontSize',
  'nonArestiRolls'];
// define which settings will be loaded from sequence
var loadSettings = [
  'numberInCircle',
  'rollFontSize',
  'nonArestiRolls'];
// define default language
var defaultLanguage = 'en';
// define language object
var lang = [];
// entryOptions are in reverse order of displayed
var entryOptions = {
  'eja': 'xBoxEntryAway',
  'ej': 'xBoxEntry',
  'ed': 'downwindEntry',
  '': 'upwindEntry'
};
// how many rolls per roll position
var rollsPerRollElement = 2;

// *************
// Define styles and font sizes
// *************

// Default roll font size
var rollFontSize = 20;
// Roll sizes. User displayed names are set through index.html and
// language files
var rollFont = {'small': 15, 'medium': 20, 'large': 25};

// styleSave is used for restoring after change by user
var styleSave = [];

// style holds the style objects
// !!! don't use 'entry' or 'exit', they are reserved !!!
var style = {
  // Positive line style
  'pos' : 'stroke: black; stroke-width: 1.5px; fill: none; vector-effect: non-scaling-stroke;',
  //'chooserPos' : 'stroke: black; stroke-width: 3px; fill: none;',
  // Negative line style
  'neg' : 'stroke-dasharray: 5, 3; stroke: red; stroke-width: 1.5px; fill: none; vector-effect: non-scaling-stroke;',
  'negBW' : 'stroke-dasharray: 4, 4; stroke: black; stroke-width: 1.5px; fill: none; vector-effect: non-scaling-stroke;',
  //'chooserNeg' : 'stroke-dasharray: 10, 6; stroke: red; stroke-width: 3px; fill: none;',
  // Black filled path style
  'blackfill' : 'stroke: black; stroke-width: 1px; fill: black;',
  // Positive filled path style
  'posfill' : 'stroke: black; stroke-width: 1.5px; fill: white;',
  // Negative filled path style
  'negfill' : 'stroke: black; stroke-width: 1.5px; fill: red;',
  'negfillBW' : 'stroke: black; stroke-width: 1.5px; fill: black;',
  // Dotted path style
  'dotted' : 'stroke-dasharray: 1, 3; stroke: black; stroke-width: 1px; fill: none; vector-effect: non-scaling-stroke;',
	// hiddenCurve
	'hiddenCurve' : 'stroke: transparent; stroke-width: 0; fill: none;',
  // Illegal figure cross style
  'illegalCross' : 'stroke: red; stroke-width: 3px; fill: none;',
  // Illegal figure box style
  'illegalBox' : 'stroke: black; stroke-width: 1px; fill: none;',
  // Autocorrect path style
  'corr' : 'stroke: red; stroke-width: 2px; fill: none;',
  // Autocorrect filled path style
  'corrfill' : 'stroke: red; stroke-width: 2px; fill: red;',
  // Roll text style
  'rollText' : 'font-family: arial, sans; font-size: ' + rollFontSize +
    'px; font-weight: bold; fill: red;',
  // Figure Number
  'figNbr_09' : 'font-family: verdana, helvetica, sans; font-size: 14px; font-weight: bold; fill: black;',
  'figNbr_10' : 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;',
  // Text block style
  'textBlock' : 'font-family: verdana, helvetica, sans; font-size: 20px; fill: black;',
  'textBlockBorder' : 'stroke: black; stroke-width: 1px; fill: none;',
  'textBlockBorderBold' : 'stroke: black; stroke-width: 2px; fill: none;',
  'textBlockBorderBoldRed' : 'stroke: red; stroke-width: 2px; fill: none;',
  // Mini Form A styles
  'miniFormA' : 'font-family: verdana, helvetica, sans; font-size: 10px; fill: black;',
  'miniFormABold' : 'font-family: verdana, helvetica, sans; font-size: 10px; font-weight: bold; fill: black;',
  'miniFormAMax' : 'font-family: verdana, helvetica, sans; font-size: 14px; fill: black;',
  'miniFormAModifiedK' : 'font-family: verdana, helvetica, sans; font-size: 10px; color: red; fill: red;',
  'miniFormASmall' : 'font-family: verdana, helvetica, sans; font-size: 8px; fill: black;',
  'miniFormATotal' : 'font-family: verdana, helvetica, sans; font-size: 16px; font-weight: bold; fill: black;',
  // Form A styles
  'formATextTiny' : 'font-family: verdana, helvetica, sans; font-size: 8px; fill: black;',
  'formATextSmall' : 'font-family: verdana, helvetica, sans; font-size: 10px; fill: black;',
  'formAText' : 'font-family: verdana, helvetica, sans; font-size: 12px; fill: black;',
  'formATextBold' : 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;',
  'formATextBold8px' : 'font-family: verdana, helvetica, sans; font-size: 8px; font-weight: bold; fill: black;',
  'formATextBold9px' : 'font-family: verdana, helvetica, sans; font-size: 9px; font-weight: bold; fill: black;',
  'formATextBold10px' : 'font-family: verdana, helvetica, sans; font-size: 10px; font-weight: bold; fill: black;',
  'formATextBold11px' : 'font-family: verdana, helvetica, sans; font-size: 11px; font-weight: bold; fill: black;',
  'formATextBold12px' : 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;',
  'formATextBold13px' : 'font-family: verdana, helvetica, sans; font-size: 13px; font-weight: bold; fill: black;',
  'formATextMedium' : 'font-family: verdana, helvetica, sans; font-size: 15px; fill: black;',
  'formATextLarge' : 'font-family: verdana, helvetica, sans; font-size: 18px; fill: black;',
  'formATextXL' : 'font-family: verdana, helvetica, sans; font-size: 21px; fill: black;',
  'formATextHuge' : 'font-family: verdana, helvetica, sans; font-size: 40px; fill: black;',	// Ajout Modif GG 2017
  'formATextBoldHuge' : 'font-family: verdana, helvetica, sans; font-size: 40px; font-weight: bold; fill: black;',
  'formLine' : 'stroke: black; stroke-width: 1px; fill: none;',
  'formLineBold' : 'stroke: black; stroke-width: 4px; fill: none;',
  // Print styles
  'formBackground' : 'fill: white;',
  'modifiedK' : 'font-family: monospace; font-size: 8px; color: red; fill: red;',
  'printNotes' : 'font-family: verdana, helvetica, sans; font-size: 24px; fill: black;',
  'sequenceString' : 'font-family: monospace; font-size: 8px; color: blue; fill: blue; word-wrap: break-word;',
  'windArrow' : 'stroke: black; stroke-width: 1.5px; fill: white;',
  // Selection styles
  'selectedFigureBox' : 'stroke: #0000ff; stroke-width: 1; stroke-opacity: 0.7; fill: transparent',
  'selectedFigureHandle' : 'stroke: #0000ff; stroke-width: 1; fill: #0000ff; fill-opacity: 0.2'
}

/**********************************************************************
 * 
 * Aresti and roll handling configuration
 * 
 **********************************************************************/

// Superfamily definitions
// For every category the list of SF is defined below. The order MATTERS!
// The SF will be decided by the first aresti fig nr match
// Superfamilies are also used for creation of figure group proposals
var superFamilies = {
	unlimited : [
	  [/^2\./,'2'],
	  [/^5\./,'5'],
	  [/^6\./,'6'],
	  [/^1\./,'7'],
	  [/^3\./,'7'],
	  [/^7\./,'7'],
	  [/^8\./,'7'],
	  [/^0\./,'7']
	  ],
	advanced : [
	  [/^9\.11\./,'3'],
	  [/^9\.12\./,'3'],
	  [/^9\.9\./, '4'],
	  [/^9\.10\./,'4'],
	  [/^2\./,    '2'],
	  [/^5\./,    '5'],
	  [/^6\./,    '6'],
	  [/^1\./,    '7'],
	  [/^3\./,    '7'],
	  [/^7\./,    '7'],
	  [/^8\./,    '7'],
	  [/^0\./,    '7']
  ]
};
superFamilies.yak52 = superFamilies.advanced;
superFamilies.intermediate = superFamilies.advanced;
superFamilies.glider = superFamilies.advanced;

// available rolls
var rollTypes = [
  ':none',
  '4:1/4',
  '2:1/2',
  '3:3/4',
  '1:1',
  '5:1 1/4',
  '6:1 1/2',
  '7:1 3/4',
  '9:2',
  '22:2x2',
  '32:3x2',
  '42:4x2'];
for (var i = 2; i < 9; i++) {
  rollTypes.push(i + '4:' + i + 'x4');
}
rollTypes.push('8:2x8');
for (var i = 2; i < 9; i++) {
  rollTypes.push((i*2) + '8:' + (i*2) + 'x8');
}
var posFlickTypes = [
  '2f:1/2 pos flick',
  '3f:3/4 pos flick',
  'f:1 pos flick',
  '5f:1 1/4 pos flick',
  '6f:1 1/2 pos flick',
  '7f:1 3/4 pos flick',
  '9f:2 pos flick'];
var negFlickTypes = [
  '2if:1/2 neg flick',
  '3if:3/4 neg flick',
  'if:1 neg flick',
  '5if:1 1/4 neg flick',
  '6if:1 1/2 neg flick',
  '7if:1 3/4 neg flick',
  '9if:2 neg flick'];
var posSpinTypes = [
  's:1 pos spin',
  '5s:1 1/4 pos spin',
  '6s:1 1/2 pos spin',
  '7s:1 3/4 pos spin',
  '9s:2 pos spin'];
var negSpinTypes = [
  'is:1 neg spin',
  '5is:1 1/4 neg spin',
  '6is:1 1/2 neg spin',
  '7is:1 3/4 neg spin',
  '9is:2 neg spin'];
var gliderRollTypes = [
  '33:3x3',
  '63:6x3',
  '02:1/2 Slow Roll',
  '01:1 Slow Roll',
  '06:1 1/2 Slow Roll'];

/**********************************************************************
 * 
 * Sequence string configuration
 * 
 **********************************************************************/
 
// ***************
// Define patterns for the user's OpenAero drawing string
// ***************

// Never use '#' as a pattern! It is used in various places in OpenAero
// as a placeholder for switch operations.
var userpat = {
  'comment' : '"',
  'additional' : '=',
  'curveTo' : '(',
  'flipNumber' : '|',
  'flipYaxis' : '/',
  'forward' : '~',
  'forwardshorten' : '<',
  'lineshorten' : '`',
  'longforward' : '+',
  'movedown' : '^',
  'moveforward' : '>',
  'moveto' : '[',
  'opproll' : ',',
  'rollext' : '.',
  'rollextshort' : "'",
  'sameroll' : ';',
  'scale' : '%',
  'subSequence' : '//',
  'switchDirX' : '>',
  'switchDirY' : '^',
  'switchFirstRoll' : ';>'
}

// ***************
// Define patterns for the software figure string
// ***************

var figpat = {
  'forward' : '\'',
  'longforward' : '~',
  'fullroll' : '_',
  'halfroll' : '^',
  'anyroll' : '&',
  'spinroll' : '$',
  'hammer' : 'h',
  'pushhammer' : 'H',
  'tailslidecanopy' : 't',
  'tailslidewheels' : 'T',
  'pointTip' : 'u',
  'pushPointTip' : 'U'
};

var drawAngles = {
  'd':45, 'v':90, 'z':135, 'm':180,
  'c':225, 'p':270, 'r':315, 'o':360,
  'D':-45, 'V':-90, 'Z':-135, 'M':-180,
  'C':-225, 'P':-270, 'R':-315, 'O':-360
};

var rollAttitudes = {'0':'', '45':'d', '90':'v', '135':'d',
  '180':'', '225':'id', '270':'iv', '315':'id'
};

// ****************
// define Regex patterns for drawing and sequence parsing
// ****************

var
	regexRollFontSize = /font-size:[ ]*([\d]+)px/,
	regexChangeDir = new RegExp ('[\\' + userpat.switchDirX + '\\' + userpat.switchDirY + ']'),
	// match all comments
	regexComments = new RegExp ('\\' + userpat.comment + '[^\\' +
		userpat.comment + ']*\\' + userpat.comment, 'g'),
	regexSwitchDirX = new RegExp ('\\' + userpat.switchDirX),
	regexSwitchDirY = new RegExp ('\\' + userpat.switchDirY),
	regexMoveForward = new RegExp ('^[0-9]*\\' + userpat.moveforward + '+'),
	regexMoveDown = new RegExp ('^[0-9]*\\' + userpat.movedown + '+'),
	regexMoveFwdDn = new RegExp ('^[0-9]*(\\' + userpat.moveforward +
	  '|\\' + userpat.movedown + ')+'),
	regexAdditional = new RegExp ('\\' + userpat.additional),
	regexCurveTo = new RegExp ('^[\(][0-9\-]*,[0-9\-]*[\)]$'),
	regexMoveTo = new RegExp ('^\[[0-9\-]*,[0-9\-]*\]$'),
	// regexDrawInstr matches moveTo, curveTo, scale and text
	regexDrawInstr = /^([\[\(].+[\]\)]|-?[0-9]+\%|"[^"]*")$/,
	regexLongForward = new RegExp ('\\' + userpat.longforward, 'g'),
	regexEntryShorten = /`+\+(.*[a-zA-Z])/,
	regexExitShorten = /([a-zA-Z].*)\+`+/,
	regexEntryShortenNeg = /`+(-.*[a-zA-Z])/,
	regexExitShortenNeg = /([a-zA-Z].*-)`+/,
	regexExtendShorten = new RegExp ('[\\' + userpat.longforward + '\\' +
		userpat.forward + '\\' + userpat.rollext + '\\' +
		userpat.rollextshort + '\\' + userpat.lineshorten + ']', 'g');
	// match the Y axis flip symbol
	regexFlipYAxis = /(^|[^\/])\/([^\/]|$)/,
	// match a Free Unknown figure number
	regexFuFigNr = /\bfuFig(\d+)\b/,
	// match (rolling) turns
	regexTurn = /[0-9\+\-]j[io0-9\+\-]/,
	// regexOLANBumpBug is used to check for the Humpty Bump direction bug
	// in OLAN. It is only used when opening OLAN files.
	regexOLANBumpBug = /(\&b)|(\&ipb)/,
	regexOLANNBug = /n/,
	regexPlusFullAnyRoll = new RegExp('[\\+\\' + figpat.fullroll + '\\' +
		figpat.anyroll + '\\' + figpat.spinroll + ']', 'g'),
	// regexRegistration is used to parse out aircraft registration from the
	// combined A/C type & reg field
	regexRegistration = [
		/N[1-9][0-9A-Z]+/,
		/(C|C-|G|G-|D|D-|F|F-)[A-Z]{4}/,
		/(PH|PH-)[A-Z]{3}/,
		/X(A|A-|B|B-|C|C-)[A-Z]{3}/
	],
	regexFullAnySpinRoll = new RegExp('[\\' + figpat.fullroll + '\\' +
		figpat.anyroll + '\\' + figpat.spinroll + ']', 'g'),
	regexHalfRoll = new RegExp ('\\' + figpat.halfroll, 'g'),
	regexRollBeforeBase = new RegExp ('^[\\+-][\\' + figpat.halfroll +
		'\\'  + figpat.fullroll + '\\' + figpat.anyroll + '\\' +
		figpat.spinroll + '\\' + figpat.longforward + ']'); // /^[\+\-][_\^\&\$\~]/ 
	regexRolls = new RegExp ('[\\' + figpat.halfroll + '\\' +
		figpat.fullroll + '\\' + figpat.anyroll + '\\' + 
		figpat.spinroll + ']', 'g'),
	regexRollsAndLines = new RegExp ('[\\' + figpat.halfroll + '\\' +
		  figpat.fullroll + '\\' + figpat.anyroll + '\\' +
		  figpat.spinroll + '\\' + figpat.longforward + ']');
	regexTurnsAndRolls = new RegExp ('[\\d\\(\\)\\' + figpat.halfroll +
		'\\' + figpat.fullroll + '\\' + figpat.anyroll + '\\' +
		figpat.spinroll + '\\' + figpat.longforward + ']+', 'g'); // /[\d\(\)_\^\&\$\~]+/g
	
// also accept deprecated 'connectors' for additional figures
var regexRulesAdditionals = /^(connectors|additionals)=([0-9]+)\/([0-9]+)/;
var regexSequenceOptions = /^(ed|eu|ej|eja|\/\/)$/;
var regexTextBlock = /^"[^"]*"$/;
var regexUnlinkedRolls = /[,; ](9\.[1-8]\.[0-9.]*;9\.[1-8]\.)|(9\.(9|10)\.[0-9.]*;9\.(9|10))|(9\.1[12]\.[0-9.]*;9\.1[12])/;

/* Define entry/exit speeds of figures as follows:
* L for all descending entries and climbing exits
* H for all climbing entries and all descending exits
* N for all others
*/
var regexSpeedConv = {
  'v' : /d?[vzmcpro]|dd|d\^[DVZMCPRO]/g,
  'V' : /D?[VZMCPRO]|DD|D\^[dvzmcpro]/g
}
var regexSpeed = {
  glider: {
    entry: {
      L : /^(\+([DV]|\^[dv])|-([dv]|\^[DV]))/,
      H : /^(\+([dv]|\^[DV])|-([DV]|\^[dv]))/
    },
    exit: {
      L : /(([DV]|[dv]\^)\+)|(([dv]|[DV]\^)-)$/,
      H : /(([dv]|[DV]\^)\+)|(([DV]|[dv]\^)-)$/
    }
  },
  power: {
    entry: {
      L : /^(\+([DV]|\^[dv])|-([dv]|\^[DV]))/,
      H : /^(\+([dv]|\^[DV])|-([DV]|\^[dv]))/
    },
    exit: {
      L : /(([DV]|[dv]\^)\+)|(([dv]|[DV]\^)-)$/,
      H : /(([dv]|[DV]\^)\+)|(([DV]|[dv]\^)-)$/
    }
  }
};

/* optionally, count 45 only as N. However, as this is decided on base
 * figure level, there is no way to differentiate e.g. 45 up with 4x4
 * which is clearly a H

  power: {
    entry: {
      L : /^(\+([DV]|\^[dv])|-([dv]|\^[DV]))/,
      H : /^(\+(v|\^V)|-(V|\^v))/
    },
    exit: {
      L : /(([V]|[v]\^)\+)|(([v]|[V]\^)-)$/,
      H : /(([dv]|[DV]\^)\+)|(([DV]|[dv]\^)-)$/
    }
  }

 */
  
/**********************************************************************
 * 
 * Flag configuration
 * 
 **********************************************************************/
 
// define IOC (International Olympic Commitee) countries for flags
var iocCountries = {"AD":"AND","AE":"UAE","AF":"AFG","AG":"ANT",
  "AI":"AIA","AL":"ALB","AM":"ARM","AO":"ANG","AQ":"ATA",
  "AR":"ARG","AS":"ASA","AT":"AUT","AU":"AUS","AW":"ARU",
  "AZ":"AZE","BA":"BIH","BB":"BAR","BD":"BAN","BE":"BEL","BF":"BUR",
  "BG":"BUL","BH":"BRN","BI":"BDI","BJ":"BEN","BM":"BER",
  "BN":"BRU","BO":"BOL","BR":"BRA","BS":"BAH","BT":"BHU",
  "BW":"BOT","BY":"BLR","BZ":"BIZ","CA":"CAN","CD":"COD",
  "CF":"CAF","CG":"CGO","CH":"SUI","CI":"CIV","CK":"COK","CL":"CHI",
  "CM":"CMR","CN":"CHN","CO":"COL","CR":"CRC","CU":"CUB","CV":"CPV",
  "CY":"CYP","CZ":"CZE","DE":"GER","DJ":"DJI","DK":"DEN",
  "DM":"DMA","DO":"DOM","DZ":"ALG","EC":"ECU","EE":"EST","EG":"EGY",
  "ER":"ERI","ES":"ESP","ET":"ETH","FI":"FIN","FJ":"FIJ",
  "FM":"FSM","FR":"FRA","GA":"GAB","GB":"GBR",
  "GD":"GRN","GE":"GEO","GH":"GHA",
  "GM":"GAM","GN":"GUI","GQ":"GEQ","GR":"GRE",
  "GT":"GUA","GU":"GUM","GW":"GBS","GY":"GUY","HK":"HKG",
  "HN":"HON","HR":"CRO","HT":"HAI","HU":"HUN","ID":"INA",
  "IE":"IRL","IL":"ISR","IN":"IND","IQ":"IRQ",
  "IR":"IRI","IT":"ITA","JM":"JAM","JO":"JOR",
  "JP":"JPN","KE":"KEN","KG":"KGZ","KH":"CAM","KI":"KIR","KM":"COM",
  "KN":"SKN","KP":"PRK","KR":"KOR","KW":"KUW","KY":"CAY","KZ":"KAZ",
  "LA":"LAO","LB":"LIB","LC":"LCA","LI":"LIE","LK":"SRI","LR":"LBR",
  "LS":"LES","LT":"LTU","LU":"LUX","LV":"ESA","LY":"LBA","MA":"MAR",
  "MC":"MON","MD":"MDA","ME":"MNE","MG":"MAD","MH":"MHL",
  "MK":"MKD","ML":"MLI","MM":"MYA","MN":"MGL",
  "MR":"MTN","MT":"MLT","MU":"MRI","MV":"MDV",
  "MW":"MAW","MX":"MEX","MY":"MAS","MZ":"MOZ","NA":"NAM",
  "NE":"NIG","NG":"NGR","NI":"NCA","NL":"NED","NO":"NOR",
  "NP":"NEP","NR":"NRU","NZ":"NZL","OM":"OMA","PA":"PAN",
  "PE":"PER","PG":"PNG","PH":"PHI","PK":"PAK","PL":"POL",
  "PR":"PUR","PS":"PLE","PT":"POR","PW":"PLW",
  "PY":"PAR","QA":"QAT","RO":"ROU","RS":"SRB","RU":"RUS",
  "RW":"RWA","SA":"KSA","SB":"SOL","SC":"SEY","SD":"SUD","SE":"SWE",
  "SG":"SIN","SI":"SLO","SK":"SVK","SL":"SLE",
  "SM":"SMR","SN":"SEN","SO":"SOM","SR":"SUR","ST":"STP","SV":"ESA",
  "SY":"SYR","SZ":"SWZ","TD":"CHA","TG":"TGO",
  "TH":"THA","TJ":"TJK","TL":"TLS","TM":"TKM","TN":"TUN",
  "TO":"TGA","TR":"TUR","TT":"TRI","TV":"TUV","TW":"TPE","TZ":"TAN",
  "UA":"UKR","UG":"UGA","US":"USA","UY":"URU","UZ":"UZB",
  "VC":"VIN","VE":"VEN","VG":"IVB","VI":"ISV","VN":"VIE",
  "VU":"VAN","WS":"SAM","YE":"YEM","ZA":"RSA",
  "ZM":"ZAM","ZW":"ZIM"};
// also for key and value reversed
var iocCountriesReverse = []; 
for (key in iocCountries) iocCountriesReverse[iocCountries[key]] = key;

// define iso countries for flags
var isoCountries = {"AD":"AND","AE":"ARE","AF":"AFG","AG":"ATG",
  "AI":"AIA","AL":"ALB","AM":"ARM","AN":"ANT","AO":"AGO","AQ":"ATA",
  "AR":"ARG","AS":"ASM","AT":"AUT","AU":"AUS","AW":"ABW","AX":"ALA",
  "AZ":"AZE","BA":"BIH","BB":"BRB","BD":"BGD","BE":"BEL","BF":"BFA",
  "BG":"BGR","BH":"BHR","BI":"BDI","BJ":"BEN","BL":"BLM","BM":"BMU",
  "BN":"BRN","BO":"BOL","BR":"BRA","BS":"BHS","BT":"BTN","BV":"BVT",
  "BW":"BWA","BY":"BLR","BZ":"BLZ","CA":"CAN","CC":"CCK","CD":"COD",
  "CF":"CAF","CG":"COG","CH":"CHE","CI":"CIV","CK":"COK","CL":"CHL",
  "CM":"CMR","CN":"CHN","CO":"COL","CR":"CRI","CU":"CUB","CV":"CPV",
  "CX":"CXR","CY":"CYP","CZ":"CZE","DE":"DEU","DJ":"DJI","DK":"DNK",
  "DM":"DMA","DO":"DOM","DZ":"DZA","EC":"ECU","EE":"EST","EG":"EGY",
  "EH":"ESH","ER":"ERI","ES":"ESP","ET":"ETH","FI":"FIN","FJ":"FJI",
  "FK":"FLK","FM":"FSM","FO":"FRO","FR":"FRA","GA":"GAB","GB":"GBR",
  "GD":"GRD","GE":"GEO","GF":"GUF","GG":"GGY","GH":"GHA","GI":"GIB",
  "GL":"GRL","GM":"GMB","GN":"GIN","GP":"GLP","GQ":"GNQ","GR":"GRC",
  "GS":"SGS","GT":"GTM","GU":"GUM","GW":"GNB","GY":"GUY","HK":"HKG",
  "HM":"HMD","HN":"HND","HR":"HRV","HT":"HTI","HU":"HUN","ID":"IDN",
  "IE":"IRL","IL":"ISR","IM":"IMN","IN":"IND","IO":"IOT","IQ":"IRQ",
  "IR":"IRN","IS":"ISL","IT":"ITA","JE":"JEY","JM":"JAM","JO":"JOR",
  "JP":"JPN","KE":"KEN","KG":"KGZ","KH":"KHM","KI":"KIR","KM":"COM",
  "KN":"KNA","KP":"PRK","KR":"KOR","KW":"KWT","KY":"CYM","KZ":"KAZ",
  "LA":"LAO","LB":"LBN","LC":"LCA","LI":"LIE","LK":"LKA","LR":"LBR",
  "LS":"LSO","LT":"LTU","LU":"LUX","LV":"LVA","LY":"LBY","MA":"MAR",
  "MC":"MCO","MD":"MDA","ME":"MNE","MF":"MAF","MG":"MDG","MH":"MHL",
  "MK":"MKD","ML":"MLI","MM":"MMR","MN":"MNG","MO":"MAC","MP":"MNP",
  "MQ":"MTQ","MR":"MRT","MS":"MSR","MT":"MLT","MU":"MUS","MV":"MDV",
  "MW":"MWI","MX":"MEX","MY":"MYS","MZ":"MOZ","NA":"NAM","NC":"NCL",
  "NE":"NER","NF":"NFK","NG":"NGA","NI":"NIC","NL":"NLD","NO":"NOR",
  "NP":"NPL","NR":"NRU","NU":"NIU","NZ":"NZL","OM":"OMN","PA":"PAN",
  "PE":"PER","PF":"PYF","PG":"PNG","PH":"PHL","PK":"PAK","PL":"POL",
  "PM":"SPM","PN":"PCN","PR":"PRI","PS":"PSE","PT":"PRT","PW":"PLW",
  "PY":"PRY","QA":"QAT","RE":"REU","RO":"ROU","RS":"SRB","RU":"RUS",
  "RW":"RWA","SA":"SAU","SB":"SLB","SC":"SYC","SD":"SDN","SE":"SWE",
  "SG":"SGP","SH":"SHN","SI":"SVN","SJ":"SJM","SK":"SVK","SL":"SLE",
  "SM":"SMR","SN":"SEN","SO":"SOM","SR":"SUR","ST":"STP","SV":"SLV",
  "SY":"SYR","SZ":"SWZ","TC":"TCA","TD":"TCD","TF":"ATF","TG":"TGO",
  "TH":"THA","TJ":"TJK","TK":"TKL","TL":"TLS","TM":"TKM","TN":"TUN",
  "TO":"TON","TR":"TUR","TT":"TTO","TV":"TUV","TW":"TWN","TZ":"TZA",
  "UA":"UKR","UG":"UGA","UM":"UMI","US":"USA","UY":"URY","UZ":"UZB",
  "VA":"VAT","VC":"VCT","VE":"VEN","VG":"VGB","VI":"VIR","VN":"VNM",
  "VU":"VUT","WF":"WLF","WS":"WSM","YE":"YEM","YT":"MYT","ZA":"ZAF",
  "ZM":"ZMB","ZW":"ZWE"};
// also for key and value reversed
var isoCountriesReverse = []; 
for (key in isoCountries) isoCountriesReverse[isoCountries[key]] = key;
