// en.js 1.3.8
// This file is part of OpenAero.

//  OpenAero was originally designed by Ringo Massa and built upon ideas
//  of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

//  OpenAero is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY, without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.

/***********************************************************************
 * Language files define texts for user interaction in various languages
 * This file is for English. For other languages, use the same format.
 ***********************************************************************/

// lang.xx , where xx is language code
lang.en = {
// Edit keys and values here. Keys are the same for every language.
// A value can also be an array, such as 'rollPos', or even a sub-array
// with keys such as 'tooltip'. This must be the same in other languages.
'ac' : 'A/C',
'addingFigure' : 'Add new figure',
'aircraft' : 'A/C type &amp; reg',
'autocorrectRoll' : ':Added autocorrect roll',
'cancel' : 'Cancel',
'category' : 'Category',
'checkMulti' : 'Check multiple sequences',
'checkSequence' : 'Sequence check result',
'checkingRules' : 'Sequence checking rules',
'chooseFiles' : 'Choose your files here:',
'chooseLogo' : 'Choose logo',
'class' : 'Class',
'clearQueue' : 'Are you sure you want to remove all figures from queue?',
'clickAddFigure' : 'Click to add figure',
'clickChangeFigure' : 'Click to change/add figure',
'closeIt' : 'Close',
'confirmLeave' : 'You\'re leaving OpenAero. Any sequence that is not saved may be lost.',
'contest' : 'Contest',
'date' : 'Date',
'desktopVersion' : 'Desktop version',
'download' : 'Download',
'downloadHTML5' : 'However, you can save your file by choosing a name and clicking <i>Save File</i> below.',
'downloadLegacy' : 'However, you can save your file by choosing a name, right-clicking on <i>Save File</i> below '+
  'and choosing "Save File As..." or "Save Link As...".',
'downloadWarning' : 'File saving works best through the OpenAero ' +
  'website (<a href="http://www.openaero.net">www.openaero.net</a>) when ' +
  'you are online or by running OpenAero on your own server.',
'editingFigure' : 'Edit figure ',
'fileOpeningNotSupported' : 'File opening is not supported in ' +
  'this browser. Some functions have been disabled.',
'figSelectorAddAfter' : 'Add new figure after active',
'figSelectorAddBefore' : 'Add new figure before active',
'figSelectorAddEnd' : 'Add new figure at end',
'figSelectorAddStart' : 'Add new figure at start',
'figSelectorReplace' : 'Replace active figure',
'figureAlreadyInQueue' : 'This figure is already in the queue',
'figureQueue' : 'Figure Queue',
'forElement' : ' for element ',
'formB' : 'Form B',
'formC' : 'Form C',
'getChrome' : 'For optimum use of OpenAero, please download the ' +
  'latest version of the <a href="https://www.google.com/intl/en/chrome/browser/">' +
  'Google Chrome</a> browser.',
'harmony' : 'Harmony',
'iacForms' : 'Print forms IAC style',
'illegalAtEnd' : 'Illegal figure at the end',
'illegalBefore' : 'Illegal figure before figure ',
'illegalFig' : ' is illegal, try ',
'inverseForms' : 'Print forms in inverse color (white on black)',
'loadNewVersion' : 'A new version of OpenAero is available. Load it?',
'loadNewVersionNoCookies' : 'A new version of OpenAero is available. ' +
	'Load it? If you have a sequence open now it will be cleared.',
'location' : 'Location',
'logo' : 'Logo',
'logoExplain' : 'Upload your own logo by clicking on the file ' +
  'chooser below, or select one of the displayed logos.',
'maxConnectors' : 'Maximum connecting figures allowed: ',
'missingInfo' : 'There seems to be essential Sequence Info missing. ' +
  'Are you sure you want to save or print the file without:',
'mobileVersion' : 'Mobile version',
'noCookies' : 'It seems cookies are disabled in your browser. ' +
  'This means some functions of OpenAero will not work.<br>' +
  'To enable cookies in the Chrome browser, please copy the following ' +
  'url to your address bar:<br />' + 
  'chrome://chrome/settings/content',
'none' : 'None',
'noRules' : 'No sequence validity checking rules available.',
'notes' : 'Notes',
'notOnFormBC' : 'This function is only available when Form ' +
  'B or C  is being viewed.',
'numberInCircle' : 'Figure numbers in circle',
'ok' : 'OK',
// OLANBumpBugWarning can be removed (with asociated code in OpenAero.js)
// in 2015
'OLANBumpBugWarning' : ' has been detected to be a Humpty Bump ' +
  'from Y to X axis. ',
'OLANBumpBugWarningMulti' : ' have been detected to be a Humpty ' +
  'Bump from Y to X axis. ',
'OLANNBugWarning' : ' has been detected to be an N figure ' +
  'with direction change on X axis. ',
'OLANNBugWarningMulti' : ' have been detected to be N figures ' +
  'with direction change on X axis. ',
'OLANBugWarningFooter' : '<font color=red>These figures or the ' +
  'ones following may be drawn differently in OLAN and OpenAero!</font> ' +
  'Please check correct direction.<br>' +
  'This message will not be shown for this sequence again.',
'multiOverrideRules' : 'Override sequence rules with current rules from Sequence info: ',
'orFileDrop' : 'Or drag & drop your files here',
'pilot' : 'Pilot',
'pilotNo' : 'Pilot\'s No.',
'pilotnumberIAC1' : "pilot\'s",
'pilotnumberIAC2' : "number",
'pleaseWaitStartup' : 'Please wait while OpenAero is starting up...',
'positioning' : 'Positioning',
'print' : 'Print',
'printCheck' : 'Print check result',
'printDialog' : 'Print options',
'printExplain' : 'You can set the options for printing below.<br>' +
  'To <i>save</i> your forms, click <strong>Print</strong> and then choose ' +
  '<i>destination</i> <strong>Save as PDF</strong> in the browser\'s ' +
  'print menu.',
'printForms' : 'OpenAero printing forms...',
'printFormA' : 'Print Form A',
'printFormB' : 'Print Form B',
'printFormC' : 'Print Form C',
'printFormGrid' : 'Print Figures in grid',
'printMiniFormAonB' : 'Print mini Form A on Form B',
'printMiniFormAonC' : 'Print mini Form A on Form C',
'printPilotCards' : 'Print pilot cards',
'printSF' : 'Print Super Family numbers',
'printString' : 'Print sequence string',
'program' : 'Program',
'programme' : 'Programme',
'queueEmpty' : 'There are no figures in the queue to save',
'queueNotSaved' : 'The queue figures have NOT been saved',
'queueSaved' : 'The queue figures have been saved',
'remove' : 'Remove',
'rollPos' : ['First roll position', 'Second roll position', 'Third roll position', 'Fourth roll position'],
'rules' : 'Rules',
'rulesImported' : 'Succesfully imported rules from file. Total lines (excluding comments) : ',
'rulesImportTitle' : 'Rules file import',
'rulesNotImported' : 'There were no rules imported! Maybe this ' +
  'is not a valid rules file? Please refer to ' +
  '<a href="http://code.google.com/p/open-aero/wiki/Developers#Creating_rule_checking_files" '+
  'target="_blank">Creating rule checking files</a> for more information.',
'runFromFile' : 'It seems you are running OpenAero directly from ' +
  'a file. As of version 1.2.3 (february 2013) this is no longer ' +
  'recommended as some functions will be unavailable.<br />' +
  'Please go to <a href="http://openaero.net">openaero.net</a>. ' +
  'OpenAero will automatically install in your browser and will also ' +
  'be available offline.',
'saveFile' : 'Save File',
'saveAsURL' : 'The link presented below contains your complete ' +
  'sequence. You can copy it to email, bookmark it etc...<br />' +
  'Use right-click and "Copy Link Address".',
'saveAsURLTitle' : 'Save sequence as link',
'saveFileAsAlert' : 'To download your file, right-click on this ' +
  'text and choose "Save link as..." or "Save file as...".',
'saveFileTitle' : 'Save File',
'selectCategoryFirst' : 'Select Category first',
'selectRulesFirst' : 'Select Rules first',
'separateFigures' : 'This will remove all sequence position ' +
  'formatting. Are you sure you want to continue?',
'sequenceCorrect' : 'Sequence is correct',
'sequenceHasErrors' : 'Sequence has errors:',
'sequenceTest' : 'Check: ',
'sequenceNotSavedWarning' : 'Your current sequence has not been ' +
  'saved.\nAre you sure you want to open a new one?',
'settings' : 'Settings',
'setUpright' : ':set upright entry',
'setInverted' : ':set inverted entry',
'showFullLog' : 'Show full log',
'showLog' : 'Show log',
// tooltip forms a sub-array
'tooltip' : {
  'connector' : 'Make this figure a connector for Unknown sequences',
  'curvedLine' : 'Move figure to a new position with a curved line',
  'deleteFig' : 'Delete active figure',
  // next two disabled. Are disabling minus button
  //entryExt' : 'Change figure entry line length',
  //exitExt' : 'Change figure exit line length',
  'figEntryButton' : 'Switch figure entry upright/inverted',
  'figExitButton' : 'Switch figure exit upright/inverted',
  'magMin' : 'Make figure smaller',
  'magPlus' : 'Make figure larger',
  'moveForward' : 'Move figure forward without a line',
  'straightLine' : 'Move figure to a new position with a straight line',
  'subSequence' : 'Start a sub sequence from this figure',
  'switchFirstRoll' : 'Switch first roll direction',
  'switchX' : 'Switch X exit direction',
  'switchY' : 'Switch Y exit direction'
}, // end tooltip sub-array
'unknownFileType' : 'File opening is not supported in this browser.',
'warningPre' : '<p>When you save this sequence again this ' +
  'warning will not be shown any more.</p>',
'warningPre123' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 1.2.3. Please check that all figure exit ' +
  'directions are correct.</p>',
'warningPre124' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 1.2.4. Please check that all double ' +
  'Humpty Bump directions are correct.</p>', 
'warningPre137' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 1.3.7. Some snap rolls started from knife ' +
  'edge flight may have had the wrong Aresti number and K. They should be ' +
  'correct now. Please check if applicable.</p>', 
'wind' : 'wind/vent',
'windIAC' : 'wind direction',
'zipImageFilenamePattern' : 'Separate fig images filename pattern'
// end of key-value pairs. No comma after last
};

// set default language to English
var userText = lang.en;
