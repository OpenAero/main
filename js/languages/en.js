// en.js
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
'aboutNewer' : 'You are running a newer version than Stable. You have ' +
  'all the latest features but may run into more bugs. If you do, ' +
  'you can help OpenAero development by adding them to ' +
  '<a href="https://github.com/OpenAero/main/issues" target="_blank">' +
  'the Issues list</a>.',
'aboutOlder' : '<font color="red">You are running an outdated version.' +
  '</font><br />',
'aboutOlderAndroid' : '<a href="https://play.google.com' +
	'/store/apps/details?id=net.openaero" target="_blank">' +
	'<img src="img/google-play-badge.png" width="200"></a>',
'aboutOlderCache' : 'If you are using openaero.net on Google Chrome ' +
	'(but not as an app) it may help to clear the appCache. Enter ' +
  '<strong>chrome://appcache-internals</strong> in your address bar ' +
  'and <strong>Remove</strong> all entries that contain OpenAero.',
'aboutOlderChrome' : 'It seems you are using the Chrome app, open Chrome and enter ' +
  '<strong>chrome://extensions</strong> in your address bar. Then, ' +
  'choose "Developer mode" and click "Update extensions now".',
'aboutOlderCopy' : 'It seems you are running a copy of OpenAero, please check instructions at ' +
  '<a href="https://github.com/OpenAero/main/wiki/Installation" target="_blank">' +
  'the Installation wiki</a>.',
'aboutOlderIos' : '<a href="https://itunes.apple.com' +
	'/us/app/openaero/id1343773321" target="_blank">' +
	'<img src="img/ios-appstore-badge.svg" width="200"></a>',
'aboutUnknown' : 'Unable to determine Stable version. You are ' +
  'probably offline.',
// changed 2020.1.1
'aboutText' : '<div class="divider">' +
  '<p>This&nbsp;version:<strong>%s</strong> &nbsp; ' +
  'Stable&nbsp;version:<strong>%s</strong></p><p>%s</p>' +
  '<a id="viewChangelog">View changelog.txt</a></div>' +
  '<div class="divider">' +
  '<p>OpenAero is aerobatic sequence design software that ' +
  'runs inside your web browser or as an app.</p>' +
  '<p>OpenAero is free software: you ' +
  'can redistribute it and/or modify it under the terms of the ' +
  '<a href="doc/gpl.htm">GNU General Public License</a> as published by ' +
  'the Free Software Foundation, either version 3 of the License, or ' +
  '(at your option) any later version.</p><p>OpenAero is distributed ' +
  'in the hope that it will be useful, but WITHOUT ANY WARRANTY; ' +
  'without even the implied warranty of MERCHANTABILITY or FITNESS ' +
  'FOR A PARTICULAR PURPOSE. See the GNU General Public License for ' +
  'more details.</p>' +
  '<a id="privacyPolicy">View our privacy policy</a></div><div>' +
  '<p>OpenAero is designed, built and maintained by ' +
  '<strong>Ringo Massa</strong>, using <strong>Michael Golan</strong>\'s ' +
  'OLAN sequence coding.<br>Many people have contributed, including:' +
  '<table>' +
  '<tr><td><strong>Wouter Liefting</strong></td>' +
  '<td>Figure and rule coding</td></tr>' +
  '<tr><td><strong>Gilles Guillemard</strong></td>' +
  '<td>Figure, rule and software coding</td></tr>' +
  '</table></p></div>',
'ac' : 'A/C',
'addAllToQueue' : 'Add all to Queue',
'addAllToQueueNoFigures' : 'There are no figures in the sequence, so ' +
  'no figures to add to queue',
'addAllToQueueWait' : 'Adding all figures in sequence to queue. This ' +
  'may take a while. Please wait...',
'addFigureText' : 'Add figure',
'addingFigure' : 'Add new figure',
    'additional': 'Additional',
    'additionalFigureRequired': 'At least 1 additional figure required',
'addSequenceLink' : 'Add sequence link',
    'addToQueue': 'Add to Queue',
'addWindAfterPilotCardCharacter' : 'Add one of <strong>><=</strong> after pilot card character to choose wind direction.',
'acreg': 'Aircraft registration',
'actype': 'Aircraft type',
'aircraft' : 'A/C type &amp; reg',
// alert forms a sub-array
'alert': {
  'family111RollMissing' : 'Family 1.1.1 without roll not allowed',
  'maxTwoRotationElements' : 'Maximum two combined rotation ' +
    'elements allowed',
  'noCrossoverSpin' : 'Crossover spins are not allowed',
  'spinFirst' : 'No roll allowed before spin on same line',
  'spinsStartHorizontal' : 'Spins should start from horizontal flight',
  'unlinkedSameNotAllowed' : 'Unlinked rolls of the same type and ' +
    'the same direction are not allowed'
}, // end alert array
'alertBoxClose' : 'Close',
'alerts' : 'Alerts',
'anonymousSequences' : 'Anonymise sequences by removing pilot name, ' +
  'team and aircraft',
'arestiSystem' : 'Aresti system',
'autocorrectRoll' : 'Added autocorrect roll',
'blackWhite' : 'Black & white',
'boxOuts' : 'Box Outs',
'cancel' : 'Cancel',
'cancelPrint' : 'Cancel',
'cancelSave' : 'Cancel',
'category' : 'Category',
'changedFigureK' : 'Standard Aresti K of figure %s changed ' +
  'according rules %s',
'changedFigureKMulti' : 'Standard Aresti K of figures %s changed ' +
  'according rules %s',
'changeStyle' : 'Change',
// checkAlert forms a sub-array
'checkAlert' : {
	'exactlyperfig' : 'Exactly %s of %s per figure',
  'maxperfig' : 'Not more than %s of %s per figure',
  'minperfig' : 'At least %s of %s per figure',
  'exactly'   : 'Exactly %s of %s required',
  'max'       : 'Not more than %s of %s allowed',
  'min'       : 'At least %s of %s required',
  'repeat'    : 'Not more than %s exact repetitions of %s allowed',
  'totrepeat' : 'Not more than %s instances of exact repetitions of ' +
    '%s allowed',
  'figexactly': 'Exactly %s of %s required',
  'figmax'    : 'Not more than %s of %s allowed',
  'figmin'    : 'At least %s of %s required',
  'figrepeat' : 'Not more than %s exact repetitions of %s allowed',
  'notAllowed': '%s is not allowed in this sequence'
}, // end checkAlert
'checkingRules' : 'Sequence checking rules',
'checkMulti' : 'Check multiple sequences',
'checkMultiClose' : 'Close',
'checkMultiCounter' : 'Checking sequence %s<br><br><strong>%s ' +
	'remaining</strong>',
'checkMultipleSeq' : 'Check multiple seq',
'checkMultiUseReference' : 'Use <a href="#">reference sequence</a> ' +
  'for Free (Un)known',
'checkSequence' : 'Check sequence',
'checkSequenceLog' : 'Show log',
'checkSequenceOK' : 'OK',
'checkSequenceResult' : 'Sequence check result',
'checkSequences' : 'Check sequences',
'chooseFiles' : '<strong>Choose your files</strong>',
'chooseFilesOrDrop' : 'Choose your files or drag them here',
'chooseFilesPrint' : '<strong>Choose your files</strong>',
'chooseFilesOrDropPrint' : 'Choose your files or drag them here',
'chooseLogo' : 'Choose logo',
'class' : 'Class',
'clearPositioning' : 'Clear positioning',
'clearPositioningConfirm' : 'This will remove all sequence position ' +
  'formatting. Are you sure you want to continue?',
'clearQueue' : 'Clear Queue',
'clearQueueConfirm' : 'Are you sure you want to remove all figures from queue?',
'clearSequence' : 'Clear sequence',
'clickAddFigure' : 'Add figure',
'clickChangeFigure' : 'Change/add figure',
'closeAlert' : 'Close',
'closeIt' : 'Close',
'columns' : 'Grid columns',
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
'copyClipboard' : 'Copy to clipboard',
'date' : 'Date',
'demo' : 'Demo',
'disqualified' : 'Disqual Fig',
'download' : 'Download',
'downloadHTML5' : 'You can save your file by choosing a name ' +
  'and clicking <i>Save File</i> below.<br>Depending on your browser: ' +
  '<ul><li>' +
  'The file will be saved in your browser\'s default Download folder, or' +
  '</li><li>' + 
  'A dialog where you can choose the folder will pop up' +
  '</li></ul>' +
  '<p class="chromeHint">Chrome hint: The standard Chrome browser will ' +
  'save the file to your default Download folder. To change this, go ' +
  'to the <b>advanced</b> Settings (access via the Chrome ' +
  '<i class="material-icons md-18 inText">more_vert</i> button) ' +
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
  'Or you can copy the link and use "File -> Open sequence link" ' +
  'in your OpenAero app.', 
'emailSequence' : 'Email sequence',
'END' : 'END',
'entryExitAttExt' : 'Entry/exit attitude & extension',
'exitDesigner' : 'Exit Designer',
'expert' : 'Expert',
'feedback' : 'Feedback',
'figSelectorAddAfter' : 'Add new figure after active',
'figSelectorAddBefore' : 'Add new figure before active',
'figSelectorAddEnd' : 'Add new figure at end',
'figSelectorAddStart' : 'Add new figure at start',
'figSelectorReplace' : 'Replace active figure',
'figsInGrid' : 'Figs in grid',
'figureAlreadyInQueue' : 'This figure is already in the queue',
'figureEditor' : 'Figure editor',
'figureK' : 'Figure K',
'figureLetterNotAllowed' : '(%s) Figure letter %s is not allowed',
'figurePositioning' : 'Figure positioning',
'figureQueue' : '* Figure Queue',
'figureString' : 'Figure string',
'file' : 'File',
'fileName' : 'File name',
'finalizeSequence' : 'Finalize sequence',
'FKstartOnLoad' : 'The sequence appears to be a figures file for Free ' +
  'Known. Do you want to start the Free (Un)known designer?',
'flightNr' : 'Flight #',
'flipYAxis' : 'Flip Y-axis',
'forElement' : ' for element ',
'formA' : 'Form A',
'formB' : 'Form B / Wind Right',
'formC' : 'Form C / Wind Left',
'formGridSequenceInfo' : 'with sequence info',
'formL' : 'Form L',
'formR' : 'Form R',
'free' : 'Free',
'freeKnownGuidancePower' : 'Free Known Power',
'freeKnownGuidanceGlider' : 'Free Known Glider',
'freeUnknownFig' : 'Letter ',
'freeUnknownAdditional' : 'Free unknown Additional',
'FUconfirmExit' : 'The Free (Un)known designer may not restart ' +
  'succesfully in this situation without re-opening the sequence. ' +
  'Confirm you want to exit the Free (Un)known designer',
'fuDesigner' : 'Free (Un)known Designer',
'fuFiguresTab' : 'Figures',
'FUfigOptionsDisabled' : 'Some options disabled for lettered figures',
'FUDesignletterMulti' : 'Free (Un)known letter %s used multiple times. ' +
  'Unable to start Free (Un)known Designer',
'FUDesignMissingLetters' : 'Free (Un)known letter(s) <strong>%s</strong> ' +
  'are missing. Unable to start Free (Un)known Designer',
'FUDesignNotFreeUnknown' : 'Sequence rules are not set for Free ' +
  'Known or Unknown. Unable to start Free (Un)known Designer',
'FUerrorsDetected' : 'Error(s) in sequence detected, as shown below:',
'FUfinalizing' : 'Finalizing sequence. This may take a while. Please ' +
  'wait...',
'FUletterMulti' : '(%s) figure letter %s used multiple times',
'FUmultipleSubsequences' : 'The sequence has %s subsequences. There ' +
  'should be only one',
'fuSelectFigureFirst' : 'Click a figure on one of the subsequences ' +
  'to edit it. You can drag & drop figures and Additional figures ' + 
  'from the <i>Figures</i> tab to the subsequence(s).',
'FUstarting' : 'Starting Free (Un)known designer. This may take a while. ' +
  'Please wait...',
'FUstartOnLoad' : 'The sequence appears to be a figures file for Free ' +
  'Unknown. Do you want to start the Free (Un)known designer?',
'FUexitEntryMatch' : 'Some figure exit / entry attitudes do not match',
'gaps' : 'Gaps',
'general' : 'General',
'getChrome' : 'For optimum use of OpenAero, please download the ' +
  'latest version of the <a href="https://www.google.com/intl/en/chrome/browser/">' +
  'Google Chrome</a> browser.',
'getTheApp' : 'OpenAero is available as an app',
'glider' : 'Glider',
'gridAdditionals' : 'Additionals needed',
'gridInfo' : 'Grid info',
'gridNegEntry' : 'Negative entry',
'gridNegExit' : 'Negative exit',
'gridOrderBy' : 'Order by',
'gridPosEntry' : 'Positive entry',
'gridPosExit' : 'Positive exit',
'gridSpeed' : 'Speed',
'gridView' : 'The Grid view column setting can be found on the Grid view',
'harmony' : 'Harmony',
'help' : 'Help',
'hideIllegalFigures' : 'Hide illegal figs (Sequence info Rules)',
    'iacForms': 'A/B/C Forms in IAC style',
    'iacNoteDownwindEntry' : 'Note Downwind Entry',
'iacNoteYAxisEntry' : 'Note Y Axis Entry',
'illegalAtEnd' : 'Illegal figure at the end',
'illegalBefore' : 'Illegal figure before figure ',
'illegalFig' : ' is illegal, try ',
'imageFormat' : 'Image format',
'imageHeight' : 'Height',
'imageSize' : 'Image size',
'imageWidth' : 'Width',
'importRulesFile' : 'Import rules file',
'insertions' : 'Insertions',
// new 2020.1.1
'installApp' : 'Install app',
'installation' : 'Installation',
'installed' : '<p>OpenAero has now been installed ' +
  'in this browser and will automatically receive updates. It is ' +
  'available online and offline at <a href="http://%1\$s" target="_blank">' +
  '%1\$s</a>. You can add a link to this address to your desktop for ' +
  'easy access.</p>' +
  '<p>An extensive manual is available under <i>Help -> Manual</i>. ' +
  'Please take some time to read it!</p>',
'installedApp' : '<p>Welcome to your OpenAero app.</p>' +
  '<p>An extensive manual is available under <i>Help -> Manual</i>. ' +
  'Please take some time to read it!</p>',
'installedWindows10' : '<p>OpenAero has now been installed ' +
  'in this browser and will automatically receive updates. It is ' +
  'available online and offline at <a href="http://%1\$s" target="_blank">' +
  '%1\$s</a>.</p>' +
  '<p>An extensive manual is available under <i>Help -> Manual</i>. ' +
  'Please take some time to read it!</p>' +
  '<p>You can install OpenAero as a Windows App. This ' +
  'provides<ul><li>Improved file saving</li><li>Adding OpenAero to ' +
  'your desktop to start without opening your browser</li></ul>' +
  'You can install the app from the <i>Tools</i> menu.</p>',
'interruptions' : 'Interruptions',
'inverseForms' : 'Inverse color (white on black)',
'iOScancelSave' : 'Cancel',
'iOSprintExplain' : 'Select what you would like to print or save, then ' +
  'tap <strong>Save PNG image</strong>',
'iOSsaveFile' : 'Show sequence image',
'iOSsaveFileMessage' : '<p>By clicking the <i>Save file</i> ' +
  'button a new window or browser tab will be opened. You ' +
  'can then tap the <span class="iOSsaveIcon"></span> button to print ' +
  'or tap and hold the image to save it.</p>' +
  '<p>Tips: If the image quality is not sufficient, you can increase ' +
  'the resolution in the Print dialog under "Saving PNG or SVG image". ' +
  'If you only get a blank page, try saving each sequence Form ' +
  'separately.',
'iOSsaveFileTitle' : 'Save File',
'judgesName' : 'Judges Name',
'language' : 'Language',
'library' : 'Library',
'loadNewVersion' : 'A new version is available and will automatically ' +
  'be loaded next time you start OpenAero. Load it now?',
'loadNewVersionNoCookies' : 'A new version of OpenAero is available. ' +
	'Load it? If you have a sequence open now it will be cleared.',
'loadNewVersionTitle' : 'New version',
'location' : 'Contest / location',
'locked' : 'This sequence is locked. To unlock, choose <i>Unlock</i> ' +
  'from the Sequence menu',
'lockSequence' : 'Lock',
'logo' : 'Logo',
'logoChooserCancel' : 'Cancel',
'logoChooserTitle' : 'Choose logo',
// new 2020.1
'logoFileTooLarge' : 'Logo file is too large. Please limit file size ' +
	'to 1 MB.',
'manual' : 'Manual',
'maxAdditionals' : 'Maximum additional figures allowed: %s',
'maxScaling' : 'Max small seq. scaling %',
'missedSlot' : 'Missed Slot',
'missingInfo' : 'There seems to be essential Sequence Info missing.</br>' +
  'Are you sure you want to save or print the file without:',
'missingInfoTitle' : 'Sequence info missing',
'multiNoSequence' : 'One or more files do not appear to be OpenAero ' +
  'or OLAN sequence files. They have not been added to the list',
'multiOverrideRules' : 'Override sequence rules with current rules ' +
  'from Sequence info: ',
'multiActiveLogo' : 'Use logo from active sequence',
'multiRemoveLogo' : 'Remove logo',
'multiOriginalLogo' : 'Use original logo',
'newCopySubsequence' : 'New / copy subsequence',
'newTurnPerspective' : 'Realistic-looking perspective for turns ' +
  '<font color=red>EXPERIMENTAL, DO NOT USE FOR COMPETITION SEQUENCES!' +
  '</font>',
'noCookies' : 'It seems cookies are disabled in your browser. ' +
  'This means some functions of OpenAero will not work.<br>' +
  'To enable cookies in the Chrome browser, please copy the following ' +
  'url to your address bar:<br />' + 
  '<strong style="user-select: text;">chrome://settings/content/cookies</strong><br />' +
  'and make sure cookies are not blocked.',
'noFigureLetterAssigned' : '(%s) No figure letter assigned',
'noFreeUnknownFig' : 'No figure letter',
'nonArestiRolls' : 'Allow non-Aresti and rule-illegal rolls and combinations (try ' + 
  'sequence text <i>41h4,f,4 66</i>)',
'none' : 'None',
'noRollAllowed' : 'No roll allowed according Aresti Catalog',
'noRules' : 'No sequence validity checking rules active.',
'notes' : 'Notes (top of pages)',
'notOnFormBC' : 'This function is only available when Form ' +
  'B or C  is being viewed.',
'notSequenceFile' : 'This does not appear to be an OpenAero or OLAN ' +
  'sequence file',
'number' : 'Number',
'numberInCircle' : 'Figure numbers in circle',
'ok' : 'OK',
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
// changed 2020.1
'oldBrowser' : 'Your browser is not capable of running OpenAero.<br>',
'openaeroLanguage' : 'OpenAero language',
'openQueueFile' : 'Open queue file',
'openSequence' : 'Open sequence',
'openSequenceLink' : 'Open sequence link',
'openSequenceLinkCancel' : 'Cancel',
'openSequenceLinkError' : '<p>There was an error opening the sequence ' +
  'link. This was the link you provided:<br>%s</p><p>Please check if ' +
  'you have copied the <strong>entire</strong> link',
'openSequenceLinkMessage' : 'To open a sequence that has been provided ' +
  'to you as a link (e.g. through email), copy it completely. Then ' +
  'paste it in the box below',
'openSequenceLinkOpen' : 'Open',
'openSequenceLinkTitle' : 'Open sequence from link',
'orderCountry' : 'Country',
'orderFigureNr' : 'Figure Nr',
'orderK' : 'K factor',
'orderLetter' : 'Figure letter',
'otherNote' : 'Other(note...)',
'pageSpacing' : 'Page spacing',
'pilot' : 'Pilot',
'pilotCardExplain' : 'Choose and tap again to flip wind R-L',
'pilotID' : 'Pilot ID',
'pilotNo' : 'Pilot\'s No.',
'pilotnumberIAC1' : "pilot\'s",
'pilotnumberIAC2' : "number",
'pleaseWaitStartup' : 'Please wait while OpenAero is starting up...',
'png' : 'PNG',
'positionClearAuto' : 'Automatically position new/changed figures ' +
  'clear of others',
'positioning' : 'Positioning',
'powered' : 'Power',
'print' : 'Print',
'printCheck' : 'Sequence check result',
'printDialog' : 'Print options',
// changed 2020.1.1
'printExplain' : 'You can set the options for printing below.<br>' +
  'To <i>save</i> your forms as PDF, click <strong>Print</strong> and ' +
  'then choose <i>destination</i> <strong>Save as PDF</strong> in the ' +
  'print menu.',
'printForms' : 'OpenAero printing forms...',
'printFormA' : 'Form A',
'printFormB' : 'Form B',
'printFormC' : 'Form C',
'printFormGrid' : 'Figures in grid',
'printFormL' : 'Form L',
'printFormR' : 'Form R',
'printMargins' : 'Print margins',
'printMiniFormAonB' : 'with mini Form A',
'printMiniFormAonC' : 'with mini Form A',
'printMulti' : 'Print multiple sequences',
'printMultiClose' : 'Close',
'printMultiOverrideRules' : 'Override sequence rules with current ' +
  'rules from Sequence info: ',
'printMultipleSeq' : 'Print multiple seq',
'printMultiWait' : 'Printing %s sequences.<br>This may ' +
    'take some time. Please wait...',
'printNotes': 'Notes (top of pages)',
// new 2020.1.5
    'printPageSet': 'Page set',
    'printPageSetHidesFormSelectors': 'When "Page set" is ' +
    'active, other form selectors are hidden. See manual for codes.',
'printPilotCards' : 'Pilot cards',
'printSaveForms' : 'Print/save forms',
'printSavePdf' : 'Print / Save PDF',
'printSF' : 'Super Family numbers',
'printString' : 'Sequence string',
'processingMultiCounter' : 'Processing sequence %s<br><br><strong>%s ' +
	'remaining</strong>',
'program' : 'Program',
'programme' : 'Programme',
'proposalsCreate' : 'Create new proposals',
'proposalsCreateGroups' : 'Create groups',
'proposalsDialogClose' : 'Close',
'proposalsExplain' : 'You can use this dialog to randomly generate ' +
  'matching figure group proposals from the active sequence. The ' +
  'amount of figures in each proposal is the same as the columns set ' +
  'in Grid info. The generated sequence strings can ' +
  'be pasted into another instance of OpenAero, or all loaded ' +
  'into the Grid.',
'proposalsFigureCount' : 'Figures in each proposal',
'proposalsIncomplete' : 'The last proposal is not complete as there ' +
  'are insufficient figures in the active sequence',
'proposalsTitle' : 'Create figure group proposals',
'proposalsToGrid' : 'Load to Grid',
    'proposalsTotalK': 'Total K for each proposal: ',
    'pullLoop': 'Pull %s degrees',
'pushLoop': 'Push %s degrees',
'queue' : 'Queue',
'queueColumns' : 'Columns',
'queueEmpty' : 'There are no figures in the queue to save',
'queueLabel' : 'Queue',
'queueNotSaved' : 'The queue figures have NOT been saved',
'queueSaved' : 'The queue figures have been saved',
'referenceFigureDifferent' : 'Figure %s differs from reference sequence',
'referenceFigureExitOpp' : 'Figure %s should exit in direction ' +
  'opposite to entry',
'referenceFigureExitSame' : 'Figure %s should exit in same direction ' +
  'as entry',
'referenceSequence' : 'Reference sequence',
'referenceSequenceClose' : 'Close',
'referenceSequenceExplain' : 'In the box below you can enter a ' +
  'sequence string that is used as a reference for checking sequences ' +
  'with required figures, such as Free Known and ' +
  'Unknown sequences. Checks are done to confirm correct letters, ' +
  'figure Aresti numbers and entry/exit direction combination.',
'referenceSequenceFixed' : 'This reference sequence can not be ' +
  'changed as it is coupled to the active sequence rules.',
'referenceSequenceTitle' : 'Reference sequence',
'registration' : 'Registration',
'remove' : 'Remove',
'removeLogo' : 'Remove logo',
'resetStyle' : 'Reset',
'resetStyleAll' : 'Reset All',
'restoreDefaultSettings' : 'Restore all settings to their default ' +
  'values',
'restoreDefaultSettingsConfirm' : 'All your OpenAero settings will be ' +
  'restored to their default settings. Do you want to continue?',
'rollLarge' : 'Large',
'rollMedium' : 'Medium',
'rollPos' : [
	'First roll/spin position',
	'Second roll position',
	'Third roll position',
	'Fourth roll position'],
'rollSmall' : 'Small',
'rollsSpinsExplain' : 'To add rolls or spins, select a base figure ' +
	'(e.g. from family 1) and add the roll or spin onto it',
'rollSymbolLarge' : 'Large',
'rollSymbolMedium' : 'Medium',
'rollSymbolSize' : 'Roll symbol size',
    'rollTextSize': 'Roll text size',
    'ruleIllegalRollsEnabled': '<i class="material-icons status bad"></i><span>' +
        'Rule-illegal rolls are enabled in <a href="#">settings</a></span>',
'rules' : 'Rules',
'rulesImported' : 'Succesfully imported rules from file. Total lines (excluding comments) : ',
'rulesImportTitle' : 'Rules file import',
'rulesNotImported' : 'There were no rules imported! Maybe this ' +
  'is not a valid rules file? Please refer to ' +
  '<a href="http://code.google.com/p/open-aero/wiki/Developers#Creating_rule_checking_files" '+
  'target="_blank">Creating rule checking files</a> for more information.',
// changed 2020.1.1
'runFromFile' : 'It seems you are running OpenAero directly from ' +
  'a file. As of version 1.2.3 (february 2013) this is no longer ' +
  'recommended as some functions will be unavailable.<br />' +
  'Please go to <a href="http://openaero.net">openaero.net</a>. ' +
  'OpenAero will automatically install in your browser and will also ' +
  'be available offline.<br />' +
  'If you are a developer and would like to run a local copy of ' +
  'OpenAero, please use the ' +
  '<a href="https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb">' +
  'Web Server for Chrome</a>.',
'sameAsBefore' : 'Same as before',
'saveAsLink' : 'Save as link',
'saveAsPNG' : 'Save PNG image',
'saveAsSVG' : 'Save SVG image',
'saveAsURL' : 'The link presented below contains your complete ' +
  'sequence. You can copy it to email, bookmark it etc...<br />' +
  'Use right-click and "Copy Link Address".',
'saveAsURLFromApp' : 'The link presented below contains your complete ' +
  'sequence. You can copy it to email, bookmark it etc...',
'saveAsURLTitle' : 'Save sequence as link',
'saveDeviceFirst' : 'Unable to open sequence directly. Please save it ' +
	'to your device first, then open from your device',
'saveFigsSeparate' : 'Save figs separate',
'saveFigsSeparateTitle' : 'Save figures separately',
'saveFile' : 'Save File',
'saveFileAsAlert' : 'To download your file, right-click on this ' +
  'text and choose "Save link as..." or "Save file as...".',
'saveFileTitle' : 'Save File',
'saveImageVariables' : 'Saving PNG or SVG image',
'savePdf' : 'Save PDF',
'saveQueueFile' : 'Save queue file',
'saveSequence' : 'Save sequence',
'saveShareFile' : 'Save/share file',
'saveShareSequence' : 'Save/share sequence',
'selectCategoryFirst' : 'Select Category first',
'selectRulesFirst' : 'Select Rules first',
'separateFigures' : 'Separate figures',
'separateFiguresConfirm' : 'This will separate the figures ' +
	'from each other and remove all previous sequence position ' +
  'formatting. Are you sure you want to continue?',
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
'settings' : 'Settings',
'settingsClose' : 'Close',
'settingsTitle' : 'Settings',
'setUpright' : 'set upright entry',
'setInverted' : 'set inverted entry',
'showFileName' : 'Add sequence file name',
'showFullLog' : 'Show full log',
'showHandles' : 'Show figure editing handles (blue circles) when ' +
  'figure is selected',
'showQueue' : 'Show Queue',
'signature' : 'Signature',
'smallMobile' : 'Phone layout',
'styleSettingsHeader' : 'Here you can change various style settings. ' +
  'Please keep in mind that these change the look of ' +
  '<strong>your</strong> version of OpenAero but not how your sequence ' +
  'will look to another user of OpenAero!',
'styling' : 'Styling',
'subSequenceDirection' : 'Sub sequence entry direction',
'svg' : 'SVG',
'switchFigures' : 'Figures',
'switchQueue' : 'Queue',
'team' : 'Team',
'tooHigh' : 'Too High',
'tooLow' : 'Too Low',
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
  'flipYAxis' : 'Flip Y-axis',
  'magMin' : 'Make figure smaller',
  'magPlus' : 'Make figure larger',
  'moveForward' : 'Move figure forward without a line',
  'straightLine' : 'Move figure to a new position with a straight line',
  'subSequence' : 'Start a sub sequence from this figure',
  'switchFirstRoll' : 'Switch first roll direction',
  'switchX' : 'Switch X exit direction',
  'switchY' : 'Switch Y exit direction'
}, // end tooltip sub-array
'totalK' : 'Total K',
'trgViolation' : 'Trg Violation',
'unlockSequence' : 'Unlock',
'unusedFigureLetters' : 'Unused figure letter(s): %s',
'update' : 'Update',
'updateApp' : 'OpenAero update %s is available',
'upwind' : 'Upwind',
'upwindEntry' : 'Upwind entry',
'version' : 'Version: %s',
'versionNew' : '<strong>OpenAero has been upgraded from version %s to %s' +
  '</strong><br>New features:<ul>%s' +
  '<li>Other bugfixes and improvements (check <a id="changelog">' +
  'changelog.txt</a> if interested)</li>' +
  '</ul>',
'view' : 'View',
// new 2020.1.1
'warningChrome' : '<p><i class="material-icons" style="color:red">warning</i> ' +
	'You are using the Chrome app. This will no longer ' +
	'be supported by Google in the near future.</p>' +
	'<p>A new app is available that includes offline sequence building.</p>' +
	'<p>Would you like to uninstall this app now and install the new app ' +
	'from the <b>Tools menu</b> at https://openaero.net?</p>',
'warningNewerVersion' : '<p>This sequence was created with a newer ' +
  'version of OpenAero than you are running. It may contain new ' +
  'features. Please double check the sequence is correct.</p>',
'warningPre' : '<p>When you save this sequence again this ' +
  'warning will not be shown any more.</p>',
'warningPre123' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 1.2.3. Please check that all figure exit ' +
  'directions are correct.</p>',
'warningPre124' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 1.2.4. Please check that all double ' +
  'Humpty Bump directions are correct.</p>', 
'warningPre137' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 1.3.7. Some flick rolls started from knife ' +
  'edge flight may have had the wrong Aresti number and K. They should be ' +
  'correct now. Please check if applicable.</p>',
'warningPre20161' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 2016.1. Also, the following figure was ' +
  'detected:<br>A double humpty bump with one of the radii enlarged, ' +
  'having a roll of uneven quarters on the first line and a roll on ' +
  'the second line.<br> This type of figure was handled incorrectly ' +
  'on older versions of OpenAero. Please check that all double ' +
  'Humpty Bump directions are correct.</p>',
'warningPre201611' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 2016.1.1. Also, it was opened as a ' +
  'Grid and contains a figure exit direction change (^ or > symbol). ' +
  'This is handled differently by older versions of OpenAero. Please ' +
  'check the figures to make sure their exit directions are correct ' +
  'relative to their start (same or opposite).</p>',
'warningPre20192' : '<p>The file you just opened was created with an ' +
  'OpenAero version older than 2019.2. Also, it contains one or ' +
  'more figures of family 1.2.11 or 1.2.12 (triangle figures with ' +
  'a half roll on a 45 degree line).' +
  'These were incorrectly coded in older versions of OpenAero. They ' +
  'have now been automatically corrected. Nevertheless, please ' +
  'check the sequence to make sure their exit directions and ' +
  'attitudes are correct.</p>',
'wind' : 'wind/vent',
'windIAC' : 'wind direction',
'wingRocks' : 'Wing Rocks',
'xBox' : 'Cross-Box',
'xBoxAway' : 'Cross-Box away',
'xBoxEntry' : 'Cross-box entry',
'xBoxEntryAway' : 'Cross-box entry away',
'zipImageFilenamePattern' : 'Separate fig images filename pattern',
'zoom' : 'Zoom'
// end of key-value pairs. No comma after last
};
