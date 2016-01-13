// en.js 2016.1.3
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
// changed 2016.1
'aboutNewer' : 'You are running a newer version than Stable. You have ' +
  'all the latest features but may run into more bugs. If you do, ' +
  'you can help OpenAero development by adding them to ' +
  '<a href="https://github.com/OpenAero/main/issues" target="_blank">' +
  'the Issues list</a>.',
// changed 2016.1
'aboutOlder' : '<font color="red">You are running an outdated version. ' +
  '</font><br /><ul>' +
  '<li>If you are using the Chrome app, open Chrome and enter ' +
  '<strong>chrome://extensions</strong> in your address bar. Then, ' +
  'choose "Developer mode" and click "Update extensions now".</li>' +
  '<li>If you are using openaero.net on Google Chrome (but not as an ' +
  'app) it may help to clear the appCache. Enter ' +
  '<strong>chrome://appcache-internals</strong> in your address bar ' +
  'and <strong>Remove</strong> all entries that contain OpenAero.</li>' +
  '<li>If you are running from a local file, please check instructions at ' +
  '<a href="https://github.com/OpenAero/main/wiki/Installation" target="_blank">' +
  'the Installation wiki</a>.</li></ul>',
//
'aboutUnknown' : 'Unable to determine Stable version. You are ' +
  'probably offline.',
'aboutText' : '<div class="section">' +
  '<p>This&nbsp;version:<strong>%s</strong> &nbsp; ' +
  'Stable&nbsp;version:<strong>%s</strong></p>%s</div>' +
  '<div class="section">' +
  '<p>OpenAero is aerobatic sequence design software that ' +
  'runs inside your web browser.</p><p>OpenAero is free software: you ' +
  'can redistribute it and/or modify it under the terms of the ' +
  '<a href="gpl.htm">GNU General Public License</a> as published by ' +
  'the Free Software Foundation, either version 3 of the License, or ' +
  '(at your option) any later version.</p><p>OpenAero is distributed ' +
  'in the hope that it will be useful, but WITHOUT ANY WARRANTY; ' +
  'without even the implied warranty of MERCHANTABILITY or FITNESS ' +
  'FOR A PARTICULAR PURPOSE. See the GNU General Public License for ' +
  'more details.</p></div><div class="section">' +
  'OpenAero is designed, built and maintained by ' +
  '<strong>Ringo Massa</strong>, using <strong>Michael Golan</strong>\'s ' +
  'OLAN sequence coding.<br>Many people have contributed, including:' +
  '<table>' +
  '<tr><td><strong>Wouter Liefting</strong></td>' +
  '<td>Figure and rule coding</td></tr>' +
  '<tr><td><strong>Gilles Guillemard</strong></td>' +
  '<td>Figure, rule and software coding</td></tr>' +
  '<tr><td><strong>Christian Falck</strong></td>' +
  '<td>Rule coding</td></tr>' +
  '</table></div>',
'ac' : 'A/C',
'addAllToQueue' : 'Add all to Queue',
// new 1.5.0
'addAllToQueueNoFigures' : 'There are no figures in the sequence, so ' +
  'no figures to add to queue',
// end new
'addAllToQueueWait' : 'Adding all figures in sequence to queue. This ' +
  'may take a while. Please wait...',
'addFigureText' : 'Click to add figure',
'addingFigure' : 'Add new figure',
// changed 2016.1
'Additional' : 'Additional',
//
'addToQueue' : 'Add to Queue',
// new 1.5.2.3
'acreg': 'Aircraft registration',
'actype': 'Aircraft type',
//
'aircraft' : 'A/C type &amp; reg',
// alert forms a sub-array
'alert': {
  'family111RollMissing' : 'Family 1.1.1 without roll not allowed',
  'maxTwoRotationElements' : 'Maximum two combined rotation ' +
    'elements allowed',
  'noCrossoverSpin' : 'Crossover spins are not allowed',
  'spinFirst' : 'No roll allowed before spin on same line',
  'unlinkedSameNotAllowed' : 'Unlinked rolls of the same type and ' +
    'the same direction are not allowed'
}, // end alert array
'alertBoxClose' : 'Close',
'alerts' : 'Alerts',
// changed 1.5.1
'anonymousSequences' : 'Anonymise sequences by removing pilot name, ' +
  'team and aircraft',
//
'arestiSystem' : 'Aresti system',
'autocorrectRoll' : 'Added autocorrect roll',
'blackWhite' : 'Black & white',
// new 1.5.1
'boxOuts' : 'Box Outs',
//
'browserDetect' : 'Your browser has been detected as: %s.<br>',
'cancel' : 'Cancel',
'cancelPrint' : 'Cancel',
'cancelSave' : 'Cancel',
'category' : 'Category',
'changeStyle' : 'Change',
// new 1.5.0
// checkAlert forms a sub-array
'checkAlert' : {
  'maxperfig' : 'Not more than %s of %s per figure',
  'minperfig' : 'At least %s of %s per figure',
  'max'       : 'Not more than %s of %s allowed',
  'min'       : 'At least %s of %s required',
  'repeat'    : 'Not more than %s exact repetitions of %s allowed',
  'totrepeat' : 'Not more than %s instances of exact repetitions of ' +
    '%s allowed',
  'figmax'    : 'Not more than %s of %s allowed',
  'figmin'    : 'At least %s of %s required',
  'figrepeat' : 'Not more than %s exact repetitions of %s allowed',
  'notAllowed': '%s is not allowed in this sequence'
}, // end checkAlert
//
'checkingRules' : 'Sequence checking rules',
'checkMulti' : 'Check multiple sequences',
'checkMultiClose' : 'Close',
'checkMultiCounter' : 'Checking sequence %s of %s<br>%s<br>This may ' +
  'take some time. Please wait...',
'checkMultipleSeq' : 'Check multiple seq',
// changed 2016.1.1
'checkMultiUseReference' : 'Use <a href="#">reference sequence</a> ' +
  'for Free (Un)known',
//
'checkMultiWait' : 'Checking %s sequences.<br>This may ' +
  'take some time. Please wait...',
'checkSequence' : 'Check sequence',
'checkSequenceLog' : 'Show log',
'checkSequenceOK' : 'OK',
'checkSequenceResult' : 'Sequence check result',
'checkSequences' : 'Check sequences',
'chooseFiles' : 'Choose your files here:',
'chooseFilesPrint' : 'Choose your files here:',
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
// new 1.5.1
'disqualified' : 'Disqual Fig',
//
'download' : 'Download',
'downloadHTML5' : 'You can save your file by choosing a name ' +
  'and clicking <i>Save File</i> below.<br>A dialog where you can ' +
  'choose the folder will then pop up.' +
  '<p class="chromeHint">Chrome hint: The standard Chrome browser will ' +
  'save the file to your default Download folder. To change this, go ' +
  'to the <b>advanced</b> Settings (access via the Chrome ≡ button) ' +
  'and tick checkbox "Ask where to save ..."</p>',
'downloadLegacy' : 'You can save your file by choosing a ' +
  'name, right-clicking on <i>Save File</i> below '+
  'and choosing "Save File As..." or "Save Link As...".<br>A dialog ' +
  'where you can choose the folder will then pop up.',
'downwind' : 'Downwind',
'downwindEntry' : 'Downwind entry',
'drawingStyles' : 'Drawing styles',
'drawingStylesExplain' : '<p>All drawing styles can be changed here. ' +
  'Some useful ones: <strong>pos</strong>=positive line, ' +
  '<strong>neg</strong>=negative line, <strong>rollText</strong>=roll ' +
  'font (e.g. 2x8).</p>',
'dropFigureHere' : 'Drop Figure here',
'editingFigure' : 'Edit figure ',
'emailHeader' : 'Click the link below to open the sequence in OpenAero. ' +
  'Or, if clicking doesn\'t work, copy and paste it (completely!) in ' +
  'your browser address bar.',
'emailSequence' : 'Email sequence',
// new 1.5.0
'END' : 'END',
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
// new 1.5.1
'figureK' : 'Figure K',
// new 2016.1.3
'figureLetterNotAllowed' : '(%s) Figure letter %s is not allowed',
'figurePositioning' : 'Figure positioning',
'figureQueue' : 'Figure Queue',
// new 1.5.2
'figureString' : 'Figure string',
//
'file' : 'File',
'fileName' : 'File name',
'finalizeSequence' : 'Finalize sequence & exit Free Unknown Designer',
// new 1.5.1
'flightNr' : 'Flight #',
//
'flipYAxis' : 'Flip Y-axis',
'forElement' : ' for element ',
'formA' : 'Form A',
'formB' : 'Form B',
'formC' : 'Form C',
// new 1.5.1
'formL' : 'Form L',
'formR' : 'Form R',
//
// changed 1.5.2.3
//'freeUnknownFig' : 'Free Unknown fig ',
'freeUnknownFig' : 'Letter ',
// changed 2016.1
'freeUnknownAdditional' : 'Free unknown Additional',
'FUconfirmExit' : 'The Free Unknown designer may not restart ' +
  'succesfully in this situation without re-opening the sequence. ' +
  'Confirm you want to exit the Free Unknown designer',
'fuDesigner' : 'Free Unknown Designer',
'fuFiguresTab' : 'Figures',
// changed 1.5.2.3
//'FUfigOptionsDisabled' : 'Some options disabled for Free Unknown fig',
'FUfigOptionsDisabled' : 'Some options disabled for lettered figures',
'FUDesignletterMulti' : 'Free Unknown letter %s used multiple times. ' +
  'Unable to start Free Unknown Designer',
'FUDesignMissingLetters' : 'Free Unknown letter(s) <strong>%s</strong> ' +
  'are missing. Unable to start Free Unknown Designer',
'FUDesignNotFreeUnknown' : 'Sequence rules are not set for Free ' +
  'Unknown. Unable to start Free Unknown Designer',
'FUerrorsDetected' : 'Error(s) in sequence detected, as shown below:',
'FUfinalizing' : 'Finalizing sequence. This may take a while. Please ' +
  'wait...',
// changed 1.5.2.3
//'FUletterMulti' : '(%s) Free Unkn letter %s used multiple times',
'FUletterMulti' : '(%s) figure letter %s used multiple times',
'FUmultipleSubsequences' : 'The sequence has %s subsequences. There ' +
  'should be only one',
// changed 2016.1
'fuSelectFigureFirst' : 'Click a figure on one of the subsequences ' +
  'to edit it. You can drag & drop figures and Additional figures ' + 
  'from the <i>Figures</i> tab to the subsequence(s).',
'FUstarting' : 'Starting Free Unknown designer. This may take a while. ' +
  'Please wait...',
'FUstartOnLoad' : 'The sequence appears to be a figures file for Free ' +
  'Unknown. Do you want to start the Free Unknown designer?',
'FUexitEntryMatch' : 'Some figure exit / entry attitudes do not match',
//
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
// changed 1.5.1
'iacForms' : 'A/B/C Forms in IAC style',
//
'illegalAtEnd' : 'Illegal figure at the end',
'illegalBefore' : 'Illegal figure before figure ',
'illegalFig' : ' is illegal, try ',
'imageFormat' : 'Image format',
'imageHeight' : 'Height',
'imageSize' : 'Image size',
'imageWidth' : 'Width',
'importRulesFile' : 'Import rules file',
// new 1.5.1
'insertions' : 'Insertions',
//
'installation' : 'Installation',
// changed 2016.1.3
'installChromeApp' : '<p>OpenAero has now been installed ' +
  'in this browser and will automatically receive updates. It is ' +
  'available online and offline at <a href="http://%1\$s" target="_blank">' +
  '%1\$s</a>.</p>' +
  '<p>An extensive <a href="manual.html" target="_blank">Manual</a> ' +
  'is available. Please take some time to read it!</p>' +
  '<p>You can install OpenAero as a Chrome App. This ' +
  'provides:<ul><li>Improved file saving</li><li>Adding OpenAero to ' +
  'your desktop to start without opening Chrome browser</li></ul>' +
  'Do you wish to install the App? If you select <i>No</i> you will ' +
  'not be asked again but can install it through the <i>Tools</i> ' +
  'menu at any time.</p>',
'installChromeAppComplete' : 'Chrome App has been installed. You can ' +
  'access it by opening a new tab in Chrome. By right-clicking you ' +
  'add the App to your desktop.',
'installChromeAppTitle' : 'Install Chrome App',
// new 2016.1.3
'installed' : '<p>OpenAero has now been installed ' +
  'in this browser and will automatically receive updates. It is ' +
  'available online and offline at <a href="http://%1\$s" target="_blank">' +
  '%1\$s</a>. You can add a link to this address to your desktop for ' +
  'easy access.</p>' +
  '<p>An extensive <a href="manual.html" target="_blank">Manual</a> ' +
  'is available. Please take some time to read it!</p>',
// new 1.5.1
'interruptions' : 'Interruptions',
//
'inverseForms' : 'Inverse color (white on black)',
// new 1.5.0
'iOScancelSave' : 'Cancel',
'iOSprintExplain' : 'Select what you would like to print or save, then ' +
  'tap <strong>Save PNG image</strong>',
'iOSsaveFile' : 'Show sequence image',
'iOSsaveFileMessage' : '<p>By clicking the <i>Show sequence image</i> ' +
  'button a new window or browser tab will be opened. In Safari, you ' +
  'can then tap the <span class="iOSsaveIcon"></span> button to save ' +
  'or print the image. In Chrome, you can print from the ≡ menu.</p>' +
  '<p>Tips: If the image quality is not sufficient, you can increase ' +
  'the resolution in the Print dialog under "Saving PNG or SVG image". ' +
  'If you only get a blank page, try saving each sequence Form ' +
  'separately.',
'iOSsaveFileTitle' : 'Save File',
//
// new 1.5.1
'judgesName' : 'Judges Name',
//
'language' : 'Language',
// changed 2016.1.3
'loadNewVersion' : 'A new version is available and will automatically ' +
  'be loaded next time you start OpenAero. Load it now?',
'loadNewVersionNoCookies' : 'A new version of OpenAero is available. ' +
	'Load it? If you have a sequence open now it will be cleared.',
'loadNewVersionTitle' : 'New version',
'location' : 'Location',
// new 2016.1.3
'locked' : 'This sequence is locked. To unlock, choose <i>Unlock</i> ' +
  'from the Sequence menu',
'lockSequence' : 'Lock',
//
'logo' : 'Logo',
'logoExplain' : 'Upload your own logo by clicking on the file ' +
  'chooser below, or select one of the displayed logos.',
'manual' : 'Manual',
// changed 1.5.1.2
'maxAdditionals' : 'Maximum additional figures allowed: %s',
//
'maxScaling' : 'Max small seq. scaling',
// new 1.5.1
'missedSlot' : 'Missed Slot',
//
'missingInfo' : 'There seems to be essential Sequence Info missing. ' +
  'Are you sure you want to save or print the file without:',
'missingInfoTitle' : 'Sequence info missing',
'mobileVersion' : 'Mobile version',
'multiNoSequence' : 'One or more files do not appear to be OpenAero ' +
  'or OLAN sequence files. They have not been added to the list',
'multiOverrideRules' : 'Override sequence rules with current rules ' +
  'from Sequence info: ',
'multiActiveLogo' : 'Use logo from active sequence',
'multiRemoveLogo' : 'Remove logo',
'multiOriginalLogo' : 'Use original logo',
// new 1.5.0
'newCopySubsequence' : 'New / copy subsequence',
//
/** removed in 2016.1.3
'newReplacementsABC' : 'New style replacements for A/B/C forms',
*/
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
// changed 1.5.2.3
//'noFreeUnknownFig' : 'No Free Unknown fig',
'noFreeUnknownFig' : 'No figure letter',
'nonArestiRolls' : 'Allow non-Aresti rolls and combinations (try ' + 
  'sequence text <i>41h4,f,4 66</i>)',
'none' : 'None',
'noRollAllowed' : 'No roll allowed according Aresti Catalog',
'noRules' : 'No sequence validity checking rules available.',
'notes' : 'Notes',
'notOnFormBC' : 'This function is only available when Form ' +
  'B or C  is being viewed.',
'notSequenceFile' : 'This does not appear to be an OpenAero or OLAN ' +
  'sequence file',
// new 1.5.1
'number' : 'Number',
//
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
'oldBrowser' : 'Your browser (%s) is not capable of running OpenAero.<br>',
'openaeroLanguage' : 'OpenAero language',
'openQueueFile' : 'Open queue file',
'openSequence' : 'Open sequence',
// new 1.5.0.4
'openSequenceLink' : 'Open sequence link',
'openSequenceLinkCancel' : 'Cancel',
'openSequenceLinkError' : '<p>There was an error opening the sequence ' +
  'link. This was the link you provided:<br>%s</p><p>Please check you ' +
  'have copied the <strong>entire</strong> link',
'openSequenceLinkMessage' : 'To open a sequence that has been provided ' +
  'to you as a link (e.g. through email), copy it completely. Then ' +
  'paste it in the box below',
'openSequenceLinkOpen' : 'Open',
'openSequenceLinkTitle' : 'Open sequence from link',
//
'orFileDrop' : 'Or drag & drop your files here',
'orFileDropPrint' : 'Or drag & drop your files here',
// new 2016.1.1
'otherNote' : 'Other(note...)',
'pageSpacing' : 'Page spacing',
'pilot' : 'Pilot',
'pilotCardFormB' : 'Form B',
'pilotCardFormC' : 'Form C',
// new 1.5.1
'pilotID' : 'Pilot ID',
//
'pilotNo' : 'Pilot\'s No.',
'pilotnumberIAC1' : "pilot\'s",
'pilotnumberIAC2' : "number",
'pleaseWaitStartup' : 'Please wait while OpenAero is starting up...',
'png' : 'PNG',
'positionClearAuto' : 'Automatically position new/changed figures ' +
  'clear of others',
'positioning' : 'Positioning',
'powered' : 'Power',
'print' : 'Print / Save PDF',
'printCheck' : 'Sequence check result',
'printDialog' : 'Print options',
'printExplain' : 'You can set the options for printing below.<br>' +
  'To <i>save</i> your forms as PDF, click <strong>Print</strong> and ' +
  'then choose <i>destination</i> <strong>Save as PDF</strong> in the ' +
  'browser\'s print menu.',
'printForms' : 'OpenAero printing forms...',
'printFormA' : 'Form A',
'printFormB' : 'Form B',
'printFormC' : 'Form C',
'printFormGrid' : 'Figures in grid',
// new 1.5.1
'printFormL' : 'Form L',
'printFormR' : 'Form R',
//
'printMiniFormAonB' : 'with mini Form A',
'printMiniFormAonC' : 'with mini Form A',
'printMulti' : 'Print multiple sequences',
'printMultiClose' : 'Close',
'printMultiOverrideRules' : 'Override sequence rules with current ' +
  'rules from Sequence info: ',
'printMultipleSeq' : 'Print multiple seq',
'printMultiWait' : 'Printing %s sequences.<br>This may ' +
  'take some time. Please wait...',
'printNotes' : 'Sequence Notes (top of pages)',
'printPilotCards' : 'Pilot cards',
'printSaveForms' : 'Print/save forms',
'printSF' : 'Super Family numbers',
'printString' : 'Sequence string',
'program' : 'Program',
'programme' : 'Programme',
'queue' : 'Queue',
'queueColumns' : 'Columns',
'queueEmpty' : 'There are no figures in the queue to save',
'queueLabel' : 'Queue',
'queueNotSaved' : 'The queue figures have NOT been saved',
'queueSaved' : 'The queue figures have been saved',
// new 1.5.1
'referenceFigureDifferent' : 'Figure %s differs from reference sequence',
'referenceFigureExitOpp' : 'Figure %s should exit in direction ' +
  'opposite to entry',
'referenceFigureExitSame' : 'Figure %s should exit in same direction ' +
  'as entry',
'referenceSequence' : 'Reference sequence',
'referenceSequenceClose' : 'Close',
'referenceSequenceExplain' : 'In the box below you can enter a ' +
  'sequence string that is used as a reference for checking sequences ' +
  'with required figures, such as Free ' +
  'Unknown sequences. Checks are done to confirm correct letters, ' +
  'figure Aresti numbers and entry/exit direction combination.',
// new 2016.1.1
'referenceSequenceFixed' : 'This reference sequence can not be ' +
  'changed as it is coupled to the active sequence rules.',
// changed 2016.1.1
'referenceSequenceTitle' : 'Reference sequence',
//
'remove' : 'Remove',
'removeLogo' : 'Remove',
'resetStyle' : 'Reset',
'resetStyleAll' : 'Reset All',
'restoreDefaultSettings' : 'Restore all settings to their default ' +
  'values',
'restoreDefaultSettingsConfirm' : 'All your OpenAero settings will be ' +
  'restored to their default settings. Do you want to continue?',
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
'sameAsBefore' : 'Same as before',
// removed 1.5.0.4
// 'saveAsImage' : 'Save as image',
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
// changed 1.5.0
'setUpright' : 'set upright entry',
'setInverted' : 'set inverted entry',
//
'showFileName' : 'Add sequence file name',
'showFullLog' : 'Show full log',
// new 2016.1
'showHandles' : 'Show figure editing handles (blue circles) when ' +
  'figure is selected',
'showQueue' : 'Show Queue',
// new 1.5.1
'signature' : 'Signature',
//
'styleSettingsHeader' : 'Here you can change various style settings. ' +
  'Please keep in mind that these change the look of ' +
  '<strong>your</strong> version of OpenAero but not how your sequence ' +
  'will look to another user of OpenAero!',
'styling' : 'Styling',
'subSequenceDirection' : 'Sub sequence entry direction',
'svg' : 'SVG',
// new 2016.1
'switchFigures' : 'Figures',
'switchQueue' : 'Queue',
// new 1.5.1
'team' : 'Team',
'tooHigh' : 'Too High',
'tooLow' : 'Too Low',
//
'tools' : 'Tools',
// tooltip forms a sub-array
'tooltip' : {
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
// new 1.5.1
'totalK' : 'Total K',
// new 2016.1.1
'trgViolation' : 'Trg Violation',
'unknownFileType' : 'File opening is not supported in this browser.',
'unlockSequence' : 'Unlock',
'unusedFigureLetters' : 'Unused figure letter(s): %s',
'update' : 'Update',
'upwind' : 'Upwind',
'upwindEntry' : 'Upwind entry',
'version' : 'Version: %s',
'versionNew' : '<strong>OpenAero has been upgraded from version %s to %s' +
  '</strong><br>New features:<ul>%s' +
  '<li>Other bugfixes and improvements (check <a id="changelog">' +
  'changelog.txt</a> if interested)</li>' +
  '</ul>' +
  'This may take a few seconds to complete.',
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
// new 2016.1
'warningPre20161' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 2016.1. Also, the following figure was ' +
  'detected:<br>A double humpty bump with one of the radii enlarged, ' +
  'having a roll of uneven quarters on the first line and a roll on ' +
  'the second line.<br> This type of figure was handled incorrectly ' +
  'on older versions of OpenAero. Please check that all double ' +
  'Humpty Bump directions are correct.</p>',
// new 2016.1.1
'warningPre201611' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 2016.1.1. Also, it was opened as a ' +
  'Grid and contains a figure exit direction change (^ or > symbol). ' +
  'This is handled differently by older versions of OpenAero. Please ' +
  'check the figures to make sure their exit directions are correct ' +
  'relative to their start (same or opposite).', 
'wind' : 'wind/vent',
'windIAC' : 'wind direction',
// new 1.5.1
'wingRocks' : 'Wing Rocks',
//
'xBox' : 'X-Box',
'xBoxAway' : 'X-Box away',
'xBoxEntry' : 'X-box entry',
'xBoxEntryAway' : 'X-box entry away',
'zipImageFilenamePattern' : 'Separate fig images filename pattern',
'zoom' : 'Zoom'
// end of key-value pairs. No comma after last
};
