// config.js 1.4.2

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

var version = '1.4.1.5';
var versionNew = '<strong>OpenAero has been upgraded to version ' +
  version + '</strong><br>New features:<ul>' +
  '<li>Added option to Email the sequence</li>' +
  '<li>Several changes to improve use of the figure queue</li>' +
  '<li>Improved sub sequence handling</li>' +
  '<li>Other bugfixes and improvements (check <a href="changelog.txt">' +
  'changelog.txt</a> if interested)</li>' +
  '</ul>' +
  'This may take a few seconds to complete.';

// Define chrome app id and if app is active
var chromeApp = {
  'id': 'gadjhgnenmdfihhmnhgpcijlafpahfbi',
  'active': false
}

// define the labels (=input field ids) for saving/loading sequences
var sequenceXMLlabels = [
  'pilot',
  'aircraft',
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
  'logo',
  'oa_version',
  'default_view'
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

/**********************************************************************
 * 
 * User interface configuration
 * 
 **********************************************************************/

// define if we show an error when running from file://
var presentFileError = false;
// show mini Form A on Form B
var miniFormA = true;
// define whether to draw IAC style forms by default
var iacForms = false;
// define default pattern for figure images saved in ZIP
var zipImageFilenamePattern = '%location %category %program %pilot Form %form_fig_%figure';
// define which settings will be saved in cookie
var saveSettings = [
  'language',
  'gridColumns',
  'queueColumns',
  'saveFigsSeparateWidth',
  'saveFigsSeparateHeight',
  'zipImageFilenamePattern',
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

// style holds the style objects
var style = [];
// styleSave is used for restoring after change by user
var styleSave = [];
// Positive line style
style.pos = 'stroke: black; stroke-width: 1.5px; fill: none;';
style.chooserPos = 'stroke: black; stroke-width: 3px; fill: none;';
// Negative line style
style.neg = 'stroke-dasharray: 5, 3; stroke: red; stroke-width: 1.5px; fill: none;';
style.negBW = 'stroke-dasharray: 4, 4; stroke: black; stroke-width: 1.5px; fill: none;';
style.chooserNeg = 'stroke-dasharray: 10, 6; stroke: red; stroke-width: 3px; fill: none;';
// Black filled path style
style.blackfill = 'stroke: black; stroke-width: 1px; fill: black;';
// Positive filled path style
style.posfill = 'stroke: black; stroke-width: 1px; fill: white;';
// Negative filled path style
style.negfill = 'stroke: black; stroke-width: 1px; fill: red;';
style.negfillBW = 'stroke: black; stroke-width: 1px; fill: black;';
// Dotted path style
style.dotted = 'stroke-dasharray: 1, 3; stroke: black; stroke-width: 1px; fill: none;';
// Illegal figure cross style
style.illegalCross = 'stroke: red; stroke-width: 3px; fill: none;';
// Illegal figure box style
style.illegalBox = 'stroke: black; stroke-width: 1px; fill: none;';
// Autocorrect path style
style.corr = 'stroke: red; stroke-width: 2px; fill: none;';
// Autocorrect filled path style
style.corrfill = 'stroke: red; stroke-width: 2px; fill: red;';
// Roll text style
style.rollText = 'font-family: arial, sans; font-size: ' + rollFontSize +
  'px; font-weight: bold; fill: red;';
// Figure Number
style.figNbr_09 = 'font-family: verdana, helvetica, sans; font-size: 14px; font-weight: bold; fill: black;';
style.figNbr_10 = 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;';
// Text block style
style.textBlock = 'font-family: verdana, helvetica, sans; font-size: 14px; fill: black;';
style.textBlockBorder = 'stroke: black; stroke-width: 1px; fill: none;';
style.textBlockBorderBold = 'stroke: black; stroke-width: 2px; fill: none;';
style.textBlockBorderBoldRed = 'stroke: red; stroke-width: 2px; fill: none;';
// Mini Form A styles
style.miniFormA = 'font-family: verdana, helvetica, sans; font-size: 10px; fill: black;';
style.miniFormAMax = 'font-family: verdana, helvetica, sans; font-size: 14px; fill: black;';
style.miniFormASmall = 'font-family: verdana, helvetica, sans; font-size: 8px; fill: black;';
style.miniFormATotal = 'font-family: verdana, helvetica, sans; font-size: 16px; font-weight: bold; fill: black;';
// Form A styles
style.formAText = 'font-family: verdana, helvetica, sans; font-size: 12px; fill: black;';
style.formATextBold = 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;';
style.formATextBold8px = 'font-family: verdana, helvetica, sans; font-size: 8px; font-weight: bold; fill: black;';
style.formATextBold9px = 'font-family: verdana, helvetica, sans; font-size: 9px; font-weight: bold; fill: black;';
style.formATextBold10px = 'font-family: verdana, helvetica, sans; font-size: 10px; font-weight: bold; fill: black;';
style.formATextBold11px = 'font-family: verdana, helvetica, sans; font-size: 11px; font-weight: bold; fill: black;';
style.formATextBold12px = 'font-family: verdana, helvetica, sans; font-size: 12px; font-weight: bold; fill: black;';
style.formATextBold13px = 'font-family: verdana, helvetica, sans; font-size: 13px; font-weight: bold; fill: black;';
style.formATextMedium = 'font-family: verdana, helvetica, sans; font-size: 15px; fill: black;';
style.formATextLarge = 'font-family: verdana, helvetica, sans; font-size: 18px; fill: black;';
style.formATextHuge = 'font-family: verdana, helvetica, sans; font-size: 40px; font-weight: bold; fill: black;';
style.formLine = 'stroke: black; stroke-width: 1px; fill: none;';
style.formLineBold = 'stroke: black; stroke-width: 4px; fill: none;';
// Print styles
style.formBackground = 'fill: white;';
style.printNotes = 'font-family: verdana, helvetica, sans; font-size: 14px; fill: black;';
style.sequenceString = 'font-family: monospace; font-size: 10px; color: blue; fill: blue; word-wrap: break-word;';
style.windArrow = 'stroke: black; stroke-width: 1.5px; fill: white;';

// ***************
// Set png masks for buttons
// ***************

var mask = [];
mask.off = 'buttons/mask.png';
mask.on = 'buttons/mask-on.png';
mask.disable = 'buttons/mask-disable.png';
mask.smalloff = 'buttons/smallMask.png';
mask.smallon = 'buttons/smallMask-on.png';
mask.smalldisable = 'buttons/smallMask-disable.png';

/**********************************************************************
 * 
 * Aresti and roll handling configuration
 * 
 **********************************************************************/

// Superfamily definitions
// For every category the list of SF is defined below. The order MATTERS!
// The SF will be decided by the first aresti fig nr match
var superFamilies = [];
superFamilies.unlimited = [
  [/^2\./,'2'],
  [/^5\./,'5'],
  [/^6\./,'6'],
  [/^1\./,'7'],
  [/^3\./,'7'],
  [/^7\./,'7'],
  [/^8\./,'7'],
  [/^0\./,'7']
  ];
superFamilies.advanced = [
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
  ];
superFamilies.yak52 = superFamilies.advanced;
superFamilies.intermediate = superFamilies.advanced;
superFamilies.glider = superFamilies.advanced;
// Total K for Unknown connector figures
var connectFig = [];
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
for (var i = 2; i < 9; i++) rollTypes.push(i + '4:' + i + 'x4');
rollTypes.push('8:2x8');
for (var i = 2; i < 9; i++) rollTypes.push((i*2) + '8:' + (i*2) + 'x8');
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
var userpat = [];
userpat.comment = '"';
userpat.connector = '=';
userpat.curveTo = '(';
userpat.flipNumber = '|';
userpat.flipYaxis = '/';
userpat.forward = '~';
userpat.forwardshorten = '<';
userpat.lineshorten = '`';
userpat.longforward = '+';
userpat.movedown = '^';
userpat.moveforward = '>';
userpat.moveto = '[';
userpat.opproll = ',';
userpat.rollext = '.';
userpat.rollextshort = '\'';
userpat.sameroll = ';';
userpat.scale = '%';
userpat.subSequence = '//';
userpat.switchDirX = '>';
userpat.switchDirY = '^';

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
figpat.pointTip = 'u';
figpat.pushPointTip = 'U';
var drawAngles = {
  'd':45, 'v':90, 'z':135, 'm':180,
  'c':225, 'p':270, 'r':315, 'o':360,
  'D':-45, 'V':-90, 'Z':-135, 'M':-180,
  'C':-225, 'P':-270, 'R':-315, 'O':-360};
var rollAttitudes = {'0':'', '45':'d', '90':'v', '135':'d',
  '180':'', '225':'id', '270':'iv', '315':'id'};

// ****************
// define Regex patterns for drawing and sequence parsing
// ****************

var regexRollFontSize = /font-size:[ ]*([\d]+)px/;
var regexChangeDir = new RegExp ('[' + userpat.switchDirX + '\\' + userpat.switchDirY + ']');
// match all comments
var regexComments = /"[^"]*"/g;
var regexSwitchDirX = new RegExp ('\\' + userpat.switchDirX);
var regexSwitchDirY = new RegExp ('\\' + userpat.switchDirY);
var regexMoveForward = new RegExp ('^[0-9]*' + userpat.moveforward + '+');
var regexMoveDown = new RegExp ('^[0-9]*\\' + userpat.movedown + '+');
var regexConnector = new RegExp (userpat.connector);
var regexCurveTo = new RegExp ('^[\(][0-9\-]*,[0-9\-]*[\)]$');
var regexMoveTo = new RegExp ('^\[[0-9\-]*,[0-9\-]*\]$');
// regexDrawInstr matches moveTo, curveTo, scale and text
var regexDrawInstr = /^(\[|\().+(\]|\)$)|([0-9]+\%)|("[^"]*"$)/;
var regexLongForward = new RegExp ('\\' + userpat.longforward, 'g');
var regexEntryShorten = /`+\+(.*[a-zA-Z])/;
var regexExitShorten = /([a-zA-Z].*)\+`+/;
var regexEntryShortenNeg = /`+(-.*[a-zA-Z])/;
var regexExitShortenNeg = /([a-zA-Z].*-)`+/;
// match the Y axis flip symbol
var regexFlipYAxis = /(^|[^\/])\/([^\/]|$)/;
// match (rolling) turns
var regexTurn = /[0-9\+\-]j[io0-9\+\-]/;
// regexOLANBumpBug is used to check for the Humpty Bump direction bug
// in OLAN. Can be removed (incl relevant code in OpenAero.js) in 2015
var regexOLANBumpBug = /(\&b)|(\&ipb)/;
var regexOLANNBug = /n/;
var regexRegistration = [];
regexRegistration.push (/N[1-9][0-9A-Z]+/);
regexRegistration.push (/(C|C-|G|G-|D|D-|F|F-)[A-Z]{4}/);
regexRegistration.push (/(PH|PH-)[A-Z]{3}/);
regexRegistration.push (/X(A|A-|B|B-|C|C-)[A-Z]{3}/);
var regexRulesConnectors = /^connectors=([0-9]+)\/([0-9]+)/;
var regexSequenceOptions = /^(ed|eu|ej|eja|\/\/)$/;
var regexTextBlock = /^"[^"]*"$/;

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
