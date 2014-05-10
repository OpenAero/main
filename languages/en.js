// en.js 1.4.2
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

// The first key should be the human-readable form of the language code.
// Subsequent keys are alphabetical.
'en' : 'English',
'about' : 'About',
'ac' : 'A/C',
'addAllToQueue' : 'Add all to Queue',
'addAllToQueueWait' : 'Adding all figures in sequence to queue. This ' +
  'may take a while. Please wait...',
'addFigureText' : 'Click to add figure',
'addingFigure' : 'Add new figure',
'addToQueue' : 'Add to Queue',
'aircraft' : 'A/C type &amp; reg',
'alertBoxClose' : 'Close',
'alerts' : 'Alerts',
'anonymousSequences' : 'Anonymise sequences by removing pilot name etc',
'arestiSystem' : 'Aresti system',
'autocorrectRoll' : ':Added autocorrect roll',
'blackWhite' : 'Black & white', 
'cancel' : 'Cancel',
'cancelPrint' : 'Cancel',
'cancelSave' : 'Cancel',
'category' : 'Category',
'changeStyle' : 'Change',
'checkingRules' : 'Sequence checking rules',
'checkMulti' : 'Check multiple sequences',
'checkMultiClose' : 'Close',
'checkMultiCounter' : 'Checking sequence %s of %s<br>%s<br>This may ' +
  'take some time. Please wait...',
'checkMultipleSeq' : 'Check multiple seq',
'checkMultiWait' : 'Checking %s sequences.<br>This may ' +
  'take some time. Please wait...',
'checkSequence' : 'Check sequence',
'checkSequenceLog' : 'Show log',
'checkSequenceOK' : 'OK',
'checkSequenceResult' : 'Sequence check result',
'checkSequences' : 'Check sequences',
'chooseFiles' : 'Choose your files here:',
// new 1.4.1
'chooseFilesPrint' : 'Choose your files here:',
//
'chooseLogo' : 'Choose logo',
'class' : 'Class',
'clearPositioning' : 'Clear positioning',
'clearPositioningConfirm' : 'This will remove all sequence position ' +
  'formatting. Are you sure you want to continue?',
'clearQueue' : 'Clear Queue',
'clearQueueConfirm' : 'Are you sure you want to remove all figures from queue?',
'clearSequence' : 'Clear sequence',
'clickAddFigure' : 'Click to add figure',
'clickChangeFigure' : 'Click to change/add figure',
'closeAlert' : 'Close',
'closeIt' : 'Close',
'columns' : 'Columns',
'comments' : 'Comments',
'confirmBoxYes' : 'Yes',
'confirmBoxNo' : 'No',
'confirmLeave' : 'You\'re leaving OpenAero. Any sequence that is not saved may be lost.',
'contest' : 'Contest',
'convertingFailed' : 'Converting to PNG image failed.<br>If you wish ' +
  'to report this error to an OpenAero developer, please click the ' +
  'link below:<br><a href="mailto:openaero.devel@gmail.com?subject=' +
  'BUG:SVG_to_PNG_conversion&body=%s" target="_blank">Email bug report</a>',
'convertingToPng' : 'Converting forms to PNG image.<br>This may take ' +
  'some time. Please wait...',
'convertingTitle' : 'Converting...',
'date' : 'Date',
'demo' : 'Demo',
'desktopVersion' : 'Desktop version',
'download' : 'Download',
// updated 1.4.2
'downloadHTML5' : 'You can save your file by choosing a name ' +
  'and clicking <i>Save File</i> below.<br>A dialog where you can ' +
  'choose the folder will then pop up.' +
  '<p class="chromeHint">Chrome hint: The standard Chrome browser will ' +
  'save the file to your default Download folder. To change this, go ' +
  'to the <b>advanced</b> Settings (access via the Chrome ≡ button) ' +
  'and tick checkbox "Ask where to save ..."</p>',
//
'downloadLegacy' : 'You can save your file by choosing a ' +
  'name, right-clicking on <i>Save File</i> below '+
  'and choosing "Save File As..." or "Save Link As...".<br>A dialog ' +
  'where you can choose the folder will then pop up.',
// new 1.4.2
'downwind' : 'Downwind',
//
'downwindEntry' : 'Downwind entry',
'drawingStyles' : 'Drawing styles',
'drawingStylesExplain' : '<p>All drawing styles can be changed here. ' +
  'Some useful ones: <strong>pos</strong>=positive line, ' +
  '<strong>neg</strong>=negative line, <strong>rollText</strong>=roll ' +
  'font (e.g. 2x8).</p>',
'editingFigure' : 'Edit figure ',
// new 1.4.2
'emailHeader' : 'Click the link below to open the sequence in OpenAero. ' +
  'Or, if clicking doesn\'t work, copy and paste it (completely!) in ' +
  'your browser address bar.',
'emailSequence' : 'Email sequence',
//
'entryExitAttExt' : 'Entry/exit attitude & extension',
'expert' : 'Expert',
'feedback' : 'Feedback',
'fileOpeningNotSupported' : 'File opening is not supported in ' +
  'this browser. Some functions have been disabled.',
'figSelectorAddAfter' : 'Add new figure after active',
'figSelectorAddBefore' : 'Add new figure before active',
'figSelectorAddEnd' : 'Add new figure at end',
'figSelectorAddStart' : 'Add new figure at start',
'figSelectorReplace' : 'Replace active figure',
'figsInGrid' : 'Figs in grid',
'figureAlreadyInQueue' : 'This figure is already in the queue',
'figureEditor' : 'Figure&nbsp;editor',
'figureQueue' : 'Figure Queue',
'file' : 'File',
'fileName' : 'File name',
'flipYAxis' : 'Flip Y-axis',
'forElement' : ' for element ',
'formA' : 'Form A',
'formB' : 'Form B',
'formC' : 'Form C',
'freeUnknownFig' : 'Free Unknown fig ',
'freeUnknownLink' : 'Free unknown Link',
'FUfigOptionsDisabled' : 'Some options disabled for Free Unknown fig',
'FUletterMulti' : '(%s) Free Unkn letter %s used multiple times',
'gaps' : 'Gaps',
'general' : 'General',
'getChrome' : 'For optimum use of OpenAero, please download the ' +
  'latest version of the <a href="https://www.google.com/intl/en/chrome/browser/">' +
  'Google Chrome</a> browser.',
'glider' : 'Glider',
'gridView' : 'Grid view',
'harmony' : 'Harmony',
'help' : 'Help',
'hideIllegalFigures' : 'Hide illegal figs (Sequence info Rules)',
'iacForms' : 'Forms IAC style',
'illegalAtEnd' : 'Illegal figure at the end',
'illegalBefore' : 'Illegal figure before figure ',
'illegalFig' : ' is illegal, try ',
'imageFormat' : 'Image format',
'imageHeight' : 'Height',
'imageSize' : 'Image size',
'imageWidth' : 'Width',
'importRulesFile' : 'Import rules file',
'installation' : 'Installation',
'installChromeApp' : 'You can install OpenAero as a Chrome App. This ' +
  'provides:<ul><li>Improved file saving</li><li>Adding OpenAero to ' +
  'your desktop to start without opening Chrome browser</li></ul>' +
  'Do you wish to install the App? If you select <i>No</i> you will ' +
  'not be asked again but can install it through the <i>Tools</i> ' +
  'menu at any time.',
'installChromeAppComplete' : 'Chrome App has been installed. You can ' +
  'access it by opening a new tab in Chrome. By right-clicking you ' +
  'add the App to your desktop.',
'installChromeAppTitle' : 'Install Chrome App',
'inverseForms' : 'Inverse color (white on black)',
'language' : 'Language',
'loadNewVersion' : 'A new version of OpenAero is available. Load it?',
'loadNewVersionNoCookies' : 'A new version of OpenAero is available. ' +
	'Load it? If you have a sequence open now it will be cleared.',
'loadNewVersionTitle' : 'New version',
'location' : 'Location',
'logo' : 'Logo',
'logoExplain' : 'Upload your own logo by clicking on the file ' +
  'chooser below, or select one of the displayed logos.',
'manual' : 'Manual',
'maxConnectors' : 'Maximum connecting figures allowed: ',
'missingInfo' : 'There seems to be essential Sequence Info missing. ' +
  'Are you sure you want to save or print the file without:',
'missingInfoTitle' : 'Sequence info missing',
'mobileVersion' : 'Mobile version',
'multiOverrideRules' : 'Override sequence rules with current rules from Sequence info: ',
'newTurnPerspective' : 'Realistic-looking perspective for turns ' +
  '<font color=red>EXPERIMENTAL, DO NOT USE FOR COMPETITION SEQUENCES!' +
  '</font>',
'noCookies' : 'It seems cookies are disabled in your browser. ' +
  'This means some functions of OpenAero will not work.<br>' +
  'To enable cookies in the Chrome browser, please copy the following ' +
  'url to your address bar:<br />' + 
  '<strong>chrome://chrome/settings/content</strong><br />' +
  'and choose <i>Allow local data to be set</i>.',
'noFigureLetterAssigned' : '(%s) No figure letter assigned',
'noFreeUnknownFig' : 'No Free Unknown fig',
'nonArestiRolls' : 'Allow non-Aresti rolls (try sequence text <i>41h 66</i>)',
'none' : 'None',
'noRules' : 'No sequence validity checking rules available.',
'notes' : 'Notes',
'notOnFormBC' : 'This function is only available when Form ' +
  'B or C  is being viewed.',
'notSequenceFile' : 'This does not appear to be an OpenAero or OLAN ' +
  'sequence file',
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
'openaeroLanguage' : 'OpenAero language',
'openQueueFile' : 'Open queue file',
'openSequence' : 'Open sequence',
'orFileDrop' : 'Or drag & drop your files here',
// new 1.4.1
'orFileDropPrint' : 'Or drag & drop your files here',
//
'pageSpacing' : 'Page spacing',
'pilot' : 'Pilot',
'pilotCardFormB' : 'Form B',
'pilotCardFormC' : 'Form C',
'pilotNo' : 'Pilot\'s No.',
'pilotnumberIAC1' : "pilot\'s",
'pilotnumberIAC2' : "number",
'pleaseWaitStartup' : 'Please wait while OpenAero is starting up...',
'png' : 'PNG',
'positioning' : 'Positioning',
'powered' : 'Power',
'print' : 'Print / Save PDF',
'printCheck' : 'Sequence check result',
'printDialog' : 'Print options',
'printExplain' : 'You can set the options for printing below.<br>' +
  'To <i>save</i> your forms, click <strong>Print</strong> and then choose ' +
  '<i>destination</i> <strong>Save as PDF</strong> in the browser\'s ' +
  'print menu.',
'printForms' : 'OpenAero printing forms...',
'printFormA' : 'Form A',
'printFormB' : 'Form B',
'printFormC' : 'Form C',
'printFormGrid' : 'Figures in grid',
'printMiniFormAonB' : 'with mini Form A',
'printMiniFormAonC' : 'with mini Form A',
// new 1.4.1
'printMulti' : 'Print multiple sequences (NOT FUNCTIONAL YET!)',
'printMultiClose' : 'Close',
'printMultiOverrideRules' : 'Override sequence rules with current ' +
  'rules from Sequence info: ',
'printMultipleSeq' : 'Print multiple seq',
'printMultiWait' : 'Printing %s sequences.<br>This may ' +
  'take some time. Please wait...',
//
'printNotes' : 'Sequence Notes (top of pages)',
'printPilotCards' : 'Pilot cards',
'printSaveForms' : 'Print/save forms',
'printSF' : 'Super Family numbers',
'printString' : 'Sequence string',
'program' : 'Program',
'programme' : 'Programme',
'queue' : 'Queue',
// new in 1.4.2
'queueColumns' : 'Columns',
//
'queueEmpty' : 'There are no figures in the queue to save',
// new in 1.4.2
'queueLabel' : 'Queue',
//
'queueNotSaved' : 'The queue figures have NOT been saved',
'queueSaved' : 'The queue figures have been saved',
'remove' : 'Remove',
'removeLogo' : 'Remove',
'resetStyle' : 'Reset',
'resetStyleAll' : 'Reset All',
// new 1.4.2
'restoreDefaultSettings' : 'Restore all settings to their default ' +
  'values',
'restoreDefaultSettingsConfirm' : 'All your OpenAero settings will be ' +
  'restored to their default settings. Do you want to continue?',
//
'rollLarge' : 'Large',
'rollMedium' : 'Medium',
'rollPos' : ['First roll position', 'Second roll position', 'Third roll position', 'Fourth roll position'],
'rollSmall' : 'Small',
'rollTextSize' : 'Roll text size',
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
// new in 1.4.2
'sameAsBefore' : 'Same as before',
//
'saveAsImage' : 'Save as image',
'saveAsLink' : 'Save as link',
'saveAsPNG' : 'Save PNG image',
'saveAsSVG' : 'Save SVG image',
'saveAsURL' : 'The link presented below contains your complete ' +
  'sequence. You can copy it to email, bookmark it etc...<br />' +
  'Use right-click and "Copy Link Address".',
'saveAsURLFromApp' : 'The link presented below contains your complete ' +
  'sequence. You can copy it to email, bookmark it etc...<br />' +
  'Use right-click to copy to your clipboard.',
'saveAsURLTitle' : 'Save sequence as link',
'saveFigsSeparate' : 'Save figs separate',
'saveFigsSeparateTitle' : 'Save figures separately',
'saveFile' : 'Save File',
'saveFileAsAlert' : 'To download your file, right-click on this ' +
  'text and choose "Save link as..." or "Save file as...".',
'saveFileTitle' : 'Save File',
'saveImageVariables' : 'Saving PNG or SVG image',
'saveQueueFile' : 'Save queue file',
'saveSequence' : 'Save sequence',
'selectCategoryFirst' : 'Select Category first',
'selectRulesFirst' : 'Select Rules first',
'separateFigures' : 'Separate figures',
'sequence' : 'Sequence',
'sequenceCheckLog' : 'OpenAero Sequence check log',
'sequenceCorrect' : 'Sequence is correct',
'sequenceHasErrors' : 'Sequence has errors:',
'sequenceInfo' : 'Sequence info',
'sequenceShort' : 'Seq.',
'sequenceTab' : 'Sequence',
'sequenceTest' : 'Check: ',
'sequenceNotSavedWarning' : 'Your current sequence has not been ' +
  'saved.\nAre you sure you want to open a new one?',
'setMobile' : 'Mobile version',
'settings' : 'Settings',
'settingsClose' : 'Close',
'settingsTitle' : 'Settings',
'setUpright' : ':set upright entry',
'setInverted' : ':set inverted entry',
'showFileName' : 'Show sequence file name',
'showFullLog' : 'Show full log',
'showQueue' : 'Show Queue',
'styleSettingsHeader' : 'Here you can change various style settings. ' +
  'Please keep in mind that these change the look of ' +
  '<strong>your</strong> version of OpenAero but not how your sequence ' +
  'will look to another user of OpenAero!',
'styling' : 'Styling',
// new in 1.4.2
'subSequenceDirection' : 'Sub sequence entry direction',
//
'svg' : 'SVG',
'tools' : 'Tools',
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
'unusedFigureLetters' : 'Unused figure letters: %s',
'update' : 'Update',
// new 1.4.2
'upwind' : 'Upwind',
//
'upwindEntry' : 'Upwind entry',
'version' : 'Version: %s',
'view' : 'View',
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
// new 1.4.2
'xBox' : 'X-Box',
'xBoxAway' : 'X-Box away',
//
'xBoxEntry' : 'X-box entry',
'xBoxEntryAway' : 'X-box entry away',
'zipImageFilenamePattern' : 'Separate fig images filename pattern',
// new 1.4.2
'zoom' : 'Zoom'
//
// end of key-value pairs. No comma after last
};
