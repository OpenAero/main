// de.js
// This file is part of OpenAero and edited by Dirk Maslonka, 2023-01-15.

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
lang.de = {
  // Edit keys and values here. Keys are the same for every language.
  // A value can also be an array, such as 'rollPos', or even a sub-array
  // with keys such as 'tooltip'. This must be the same in other languages.
  
  // The first key should be the human-readable form of the language code.
  // Subsequent keys are alphabetical.
  'de' : 'Deutsch',
  'about' : 'Über',
  'aboutNewer' : 'Sie benutzen eine neuere Version als die stabile und haben ' +
    'die aller neuesten Features, welche aber noch fehlerhaft sein können. ' +
    'Falls Sie eine Fehlfunktion entdecken, können Sie uns dies hier melden: ' +
    '<a href="https://github.com/OpenAero/main/issues" target="_blank">' +
    'die Problemliste</a>.',
  'aboutOlder' : '<font color="red">Achtung! Sie haben eine veraltete Version.' +
    '</font><br />',
  'aboutOlderAndroid' : '<a href="https://play.google.com' +
    '/store/apps/details?id=net.openaero" target="_blank">' +
    '<img src="img/google-play-badge.png" width="200"></a>',
  'aboutOlderCache' : 'Falls Sie openaero.net mit Google Chrome verwenden ' +
    '(aber nicht als App) kann es helfen den appCache zu leeren. Geben Sie ' +
    '<strong>chrome://appcache-internals</strong> in ihre Adresszeile ein ' +
    'und <strong>löschen</strong> Sie alle Einträge, die OpenAero enthalten.',
  'aboutOlderChrome' : 'Scheinbar verwenden Sie die Chrome-App. Öffnen Sie ' +
    'Chrome und geben Sie <strong>chrome://extensions</strong> in die Adresszeile ein ' +
    'Wählen Sie dann "Entwicklungsmodus" und klicken Sie "Jetzt Erweiterungen updaten".',
  'aboutOlderCopy' : 'Scheinbar verwenden sie eine Kopie von OpenAero. Bitte prüfen Sie die Anleitungen auf ' +
    '<a href="https://github.com/OpenAero/main/wiki/Installation" target="_blank">' +
    'the Installation wiki</a>.',
  'aboutOlderIos' : '<a href="https://itunes.apple.com' +
    '/us/app/openaero/id1343773321" target="_blank">' +
    '<img src="img/ios-appstore-badge.svg" width="200"></a>',
  'aboutUnknown' : 'Unfähig eine stabile Version zu bestimmen. Sie sind vermutlich offline. ',
  'aboutText' : '<div class="divider">' +
    '<p>Diese&nbsp;Version:<strong>%s</strong> &nbsp; ' +
    'Stabile&nbsp;Version:<strong>%s</strong></p><p>%s</p>' +
    '<a id="viewChangelog">Siehe Änderungslog.txt</a></div>' +
    '<div class="divider">' +
    '<p>OpenAero ist eine Kunstflugsequenz Design Software, die in Ihrem ' +
    'Internet Browser oder als App läuft.</p>' +
    '<p>OpenAero ist freie Software: Sie können sie weiterverbreiten und/oder ' +
    'modifizieren unter den Bedingungen der ' +
    '<a href="doc/gpl.htm">GNU General Public License</a> wie sie von ' +
    'der Free Software Foundation, entweder als Version 3 der Lizenz, oder ' +
    '(nach Ihrer Wahl) einer späteren Version, publiziert ist. '+
    '</p><p>OpenAero ist in der Hoffnung veröffentlicht, nützlich zu sein, aber OHNE JEDE GARANTIE; ' +
    'auch ohne die implizierte Gewährleistung auf MÄNGEL oder GEBRAUCHSTAUGLICHKEIT ' +
    'FÜR EINEN BESTIMMTEN ZWECK. Für mehr Details ist auf die GNU General Public License ' +
    'verwiesen.</p>' +
    '<a id="privacyPolicy">Sehen Sie sich unsere Datenschutzgrundsätze an.</a></div><div>' +
    '<p>OpenAero ist konzipiert, erstellt und gewartet von ' +
    '<strong>Ringo Massa</strong>, mit Verwendung von <strong>Michael Golan</strong>\'s ' +
    'OLAN sequence coding.<br> Viele weitere haben dazu beigetragen, inklusive:' +
    '<table>' +
    '<tr><td><strong>Wouter Liefting</strong></td>' +
    '<td>Figuren- und Regelprogrammierung</td></tr>' +
    '<tr><td><strong>Gilles Guillemard</strong></td>' +
    '<td>Figuren-, Regel- und Softwareprogrammierung</td></tr>' +
    '<tr><td><strong>Dirk Maslonka</strong></td>' +
    '<td>Softwaretests, Segelflugregeln, Feedback & Deutsche Übersetzung</td></tr>' +
    '</table></p></div>',
  'ac' : 'Flugzeug',
  'addAllToQueue' : 'Alle zur Warteschlange hinzufügen',
  'addAllToQueueNoFigures' : 'Es sind keine Figuren in der Sequenz und deshalb ' +
    'wurden keine Figuren zur Warteschlange hinzugefügt.',
  'addAllToQueueWait' : 'Es werden alle Figuren zur Warteschlange hinzugefügt. ' +
    'Dies kann einen Moment dauern. Bitte warten...',
  'addFigureText' : 'Figur hinzufügen',
  'addingFigure' : 'Neue Figur hinzufügen',
      'additional': 'Zusatz',
      'additionalFigureRequired': 'Mindestens 1 Zusatz-Figur erforderlich.',
  'addSequenceLink' : 'Sequenz-Link hinzufügen',
      'addToQueue': 'Zur Warteschlange hinzufügen',
      'addWindAfterPilotCardCharacter': 'Hinzufügen eines von <strong>><=</strong> nach dem' +
          'Pilotenkarte-Zeichen, um Windrichtung zu wählen.',
  'acreg': 'Kennung',
  'actype': 'Flugzeugtyp',
  'aircraft' : 'Flugzeugtyp &amp; Flugzeugkennung',
  // alert forms a sub-array
  'alert': {
    'family111RollMissing' : 'Familie 1.1.1 ohne Rolle nicht erlaubt.',
    'maxTwoRotationElements' : 'Maximal zwei kombinierte Rotationselemente ' +
      'erlaubt.',
    'noCrossoverSpin' : 'Crossover-Trudler nicht erlaubt.',
    'spinFirst' : 'Keine Rolle vor einem Trudler auf der selben Linie erlaubt.',
    'spinsStartHorizontal' : 'Trudler sollten von horizontaler Fluglage beginnen',
    'unlinkedSameNotAllowed' : 'Nicht verbundene Rollen gleicher Art und ' +
      'gleicher Drehrichtung sind nicht erlaubt.'
  }, // end alert array
  'alertBoxClose' : 'Schließen',
  'alerts' : 'Alarmmeldungen',
  'anonymousSequences' : 'Sequenz anonymisieren durch Löschen des Pilotennamens, ' +
    'des Teams und Flugzeugs',
  'arestiSystem' : 'Aresti System',
  'autocorrectRoll' : 'Hinzugefügte Autokorrektur der Rolle',
  'blackWhite' : 'Schwarz-Weiß',
  'boxOuts' : 'außerhalb Box',
  'cancel' : 'abbrechen',
      'cancelPrint': 'Abbrechen',
  'cancelQRscan': 'Abbrechen',
  'cancelSave' : 'Abbrechen',
  'category' : 'Kategorie',
  'changedFigureK' : 'Standard Aresti K von Figur %s geändert ' +
    'gemäß der Regel %s',
  'changedFigureKMulti' : 'Standard Aresti K von Figuren %s geändert ' +
    'gemäß den Regeln %s',
  // checkAlert forms a sub-array
  'checkAlert' : {
    'exactlyperfig' : 'Genau %s %s je Figur',
    'maxperfig' : 'Nicht mehr als %s %s je Figur',
    'minperfig' : 'Mindestens %s %s je Figur',
    'exactly'   : 'Genau %s %s erforderlich',
    'max'       : 'Nicht mehr als %s von %s erlaubt',
    'min'       : 'Mindestens %s von %s erforderlich',
    'repeat'    : 'Nicht mehr als %s exakte Wiederholungen von %s erlaubt',
    'totrepeat' : 'Nicht mehr als %s Instanzen exakter Wiederholung von ' +
      '%s erlaubt',
    'figexactly': 'Genau %s %s erforderlich',
    'figmax'    : 'Nicht mehr als %s von %s erlaubt',
    'figmin'    : 'Mindestens %s von %s erforderlich',
    'figrepeat' : 'Nicht mehr als %s exakter Wiederholung von %s erlaubt',
    'notAllowed': '%s ist in dieser Sequenz nicht erlaubt'
  }, // end checkAlert
  'checkingRules' : 'Sequenzprüfregeln',
  'checkMulti' : 'Prüfung mehrerer Sequenzen',
  'checkMultiClose' : 'Schließen',
  'checkMultiCounter' : 'Prüfe Sequenz %s<br><br><strong>%s ' +
    'remaining</strong>',
  'checkMultipleSeq' : 'Prüfung mehrerer Sequenzen',
  'checkMultiUseReference' : 'Benutze <a href="#">Referenzsequenz</a> ' +
    'für freie (Un)bekannte',
  'checkSequence' : 'Sequenzprüfung',
  'checkSequenceLog' : 'Zeige Log',
  'checkSequenceOK' : 'OK',
  'checkSequenceResult' : 'Sequenzprüfresultat',
  'checkSequences' : 'Sequenzenprüfung',
  'chooseFiles' : '<strong>Wählen Sie Ihre Dateien</strong>',
  'chooseFilesOrDrop' : 'Wählen Sie Ihre Dateien oder ziehen Sie sie hier hin',
  'chooseFilesPrint' : '<strong>Wählen Sie Ihre Dateien</strong>',
  'chooseFilesOrDropPrint' : 'Wählen Sie Ihre Dateien oder ziehen Sie sie hier hin',
  'chooseLogo' : 'Logoauswahl',
  'class' : 'Klasse',
  'clearPositioning' : 'Positionierung aufheben',
  'clearPositioningConfirm' : 'Dies wird die Sequenzformatierung löschen. ' +
    'Sind Sie sicher fortzufahren?',
  'clearQueue' : 'Warteschlange leeren',
  'clearQueueConfirm' : 'Sind sie sicher alle Figuren aus der Warteschlange zu entfernen?',
  'clearSequence' : 'Sequenz leeren',
  'clickAddFigure' : 'Figur hinzufügen',
  'clickChangeFigure' : 'Figur hinzufügen oder ändern',
  'closeAlert' : 'Schließen',
  'closeIt' : 'Schließen',
  'columns' : 'Spalten',
  'comments' : 'Kommentare',
  'confirmBoxYes' : 'Ja',
  'confirmBoxNo' : 'Nein',
  'confirmLeave' : 'Sie verlassen OpenAero. Nicht gespeicherte Sequenzen können verloren gehen.',
  'contest' : 'Wettbewerb',
  'convertingFailed' : 'Konvertierung zu PNG Bild gescheitert.<br>Falls Sie dies ' +
    'einem OpenAero Entwickler melden möchten, klicken Sie bitte den folgenden' +
    'Link:<br><a href="mailto:openaero.devel@gmail.com?subject=' +
    'BUG:SVG_to_PNG_conversion&body=%s" target="_blank">Email bug report</a>',
  'convertingToPng' : 'Konvertieren der Formulare zu PNG Bild.<br>Dies mag etwas ' +
    'dauern. Bitte warten...',
  'convertingTitle' : 'Konvertiere...',
  'copyClipboard' : 'Kopie zur Zwischenablage',
  'date' : 'Datum',
  'demo' : 'Demo',
  'disqualified' : 'Disqualifizierte Figur',
  'download' : 'Download',
  'downloadHTML5' : 'Sie können Ihre Datei speichern durch Auswahl eines Dateinamens ' +
    'und Klickens <i>Datei speichern</i>.<br>Abhängig von Ihrem Browser: ' +
    '<ul><li>' +
    'Diese Datei wird gespeichert im Standard-Download-Ordner ihres Browsers, oder' +
    '</li><li>' +
    'ein Dialogfeld erscheint, wo Sie den Dateispeicherort auswählen können.' +
    '</li></ul>' +
    '<p class="chromeHint">Chrome Hinweis: Der Standard Chrome Browser speichert ' +
    'die Datei in Ihrem Standard Download Ordner. Um dies zu ändern, gehen Sie ' +
    'zu den <b>erweiterten</b> Einstellungen (zugänlich über den Chrome ' +
    '<i class="material-icons md-18 inText">more_vert</i> button) ' +
    'und klicken Sie das Kontrollkästchen "Fragen, wo gespeichert wird ..."</p>',
  'downloadLegacy' : 'Sie können Ihre Datei speichern mit ' +
    'Name, Rechtsklick auf <i>Datei speichern</i>'+
    'und Auswahl von "Datei speichern als..." oder "Link speichern als...".<br>' +
    'Ein Dialogfeld zur Ordnerauswahl erscheint dann.',
  'downwind' : 'Rückenwind',
  'downwindEntry' : 'Rückenwindeingang',
  'drawingStyles' : 'Zeichnungsstile',
  'drawingStylesExplain' : '<p>Alle Zeichnungsstile sind hier änderbar. ' +
    'Einige nützliche: <strong>pos</strong>=Positive Linie, ' +
    '<strong>neg</strong>=Negative Linie, <strong>rollText</strong>=Rollen Text ' +
    '(e.g. 2x8).</p>',
  'dropFigureHere' : 'Figur hier her ziehen',
  'editingFigure' : 'Figur %s bearbeiten',
  'emailHeader' : 'Klicken Sie den unteren Link, um die Sequenz in OpenAero zu öffnen. ' +
    'oder kopieren Sie den Link und benutzen Sie "Datei -> Sequenz Link öffnen" ' +
    'in Ihrer OpenAero App.',
  'emailSequence' : 'Sequenz per Email verschicken',
  'END' : 'ENDE',
  'entryExitAttExt' : 'Ein-/Ausgangs-Fluglage & &#8209;erweiterung',
      'exitDesigner': 'Designer verlassen',
  'exitFlyingMode': 'Verlassen',
  'expert' : 'Experte',
  'feedback' : 'Rückmeldung',
  'figSelectorAddAfter' : 'Figur nach aktiver hinzufügen',
  'figSelectorAddBefore' : 'Neue Figur vor aktiver einfügen',
  'figSelectorAddEnd' : 'Neue Figur am Ende hinzufügen',
  'figSelectorAddStart' : 'Neue Figur am Anfang einfügen',
  'figSelectorReplace' : 'Aktive Figur ersetzen',
  'figsInGrid' : 'Figurengitter',
  'figureAlreadyInQueue' : 'Diese Figur ist bereits in der Warteschlange',
  'figureEditor' : 'Figur-gestalter',
  'figureGroups' :
  {
    singleLines         : '1.1 Eine-Linie-Figuren',
    twoLines            : '1.2 Zwei-Linien-Figuren',
    threeLines          : '1.3 Drei-Linien-Figuren',
    '90degreeTurns'     : '2.1 90 Grad Kurven',
    '180degreeTurns'    : '2.2 180 Grad Kurven',
    '270degreeTurns'    : '2.3 270 Grad Kurven',
    '360degreeTurns'    : '2.4 360 Grad Kurven',
    combinationsOfLines : '3 Linienkombinationen',
    twoLineStallTurns   : '5.2 Zwei-Linien-Stall-Turns',
    threeLineStallTurns : '5.3 Drei-Linien-Stall-Turns',
    fourLineStallTurns  : '5.4 Vier-Linien-Stall-Turns',
    tailSlides          : '6.2 Weibchen und Männchen',
    halfLoops           : '7.2 Auf- und Abschwünge',
    threeQuarterLoops   : '7.3 Drei-Viertel-Loops',
    wholeLoops          : '7.4 Ganze Loops',
    reversingWholeLoops : '7.4 Umkehrende ganze Loops',
    horizontalSs        : '7.5 Horizontale "S"s',
    verticalSs          : '7.5 Vertikale "S"s',
    horizontal8s        : '7.8 Horizontale Achten',
    horizontalSuper8s   : '7.8 Horizontale Superachten',
    vertical8s          : '7.8 Vertikale Achten',
    humptyBumps         : '8.4 Humpty Bumps',
    diagonalHumptyBumps : '8.4 Diagonale Humpty Bumps',
    halfCubans          : '8.5 Halbe Kubanische Achten',
    vertical58Loops     : '8.5 Tropfen',
    pLoops              : '8.6 "P" Loops',
    reversingPLoops     : '8.6 Donauwellen',
    pLoopsHalfRollsOnTop: '8.6 "P" Loops mit halber Rolle im Scheitel',
    qLoops              : '8.7 "Q" Loops',
    doubleHumptyBumps   : '8.8 Doppelte Humpty Bumps',
    reversing114Loops   : '8.10 Umkehrende Fünf-Viertel-Loops',
    rollsAndSpins       : '9 Rollen und Trudler',
    nonArestiCatalog    : '0 Nicht-Aresti Katalog'
  },
  'figureK' : 'Figur-K',
  'figureLetterNotAllowed' : '(%s) Figurenbuchstabe %s ist nicht erlaubt',
  'figurePositioning' : 'Figurenpositionierung',
  'figureQueue' : '* Figurenwarteschlange',
  'figureString' : 'Figuren-String',
  'file' : 'Datei',
  'fileName' : 'Dateiname',
  'finalizeSequence' : 'Sequenz finalisieren',
  'FKstartOnLoad' : 'Die Sequenz scheint eine Figurendatei für die frei Bekannte zu sein. ' +
    'Möchten Sie den Sequenz-Designer für freie (Un)bekannte starten?',
  'flightNr' : 'Flug #',
      'flipYAxis': 'Y-Achse schwenken',
      'flyingMode': 'Flugmodus',
  'flyingModeWind': 'Wind',
  'forElement' : ' für Element ',
  'formA' : 'Form A',
  'formB' : 'Form B / Wind von rechts',
  'formC' : 'Form C / Wind von lLinks',
  'formGridSequenceInfo' : 'mit Sequenzinformation',
  'formL' : 'Form L',
  'formR' : 'Form R',
  'formStyle' : 'Formenstil',
  'free' : 'Frei',
  'freeKnownGuidancePower' : 'Freie Bekannte Motorflug',
  'freeKnownGuidanceGlider' : 'Freie Bekannte Segelflug',
  'freeUnknownFig' : 'Buchstabe ',
  'freeUnknownAdditional' : 'Freie Unbekannte Zusatzfigur',
  'FUconfirmExit' : 'Der Sequenz-Designer mag in dieser Situation nicht erneut ' +
    'erfolgreich starten, ohne die Sequenz erneut zu öffnen. ' +
    'Bestätigen Sie bitte das Verlassen des Sequenz-Designers.',
  'fuDesigner' : 'Sequenz-Designer',
  'fuFiguresTab' : 'Figuren',
  'FUfigOptionsDisabled' : 'Einige Optionen für bezeichnete Figuren nicht verfügbar',
  'FUDesignletterMulti' : 'Figur-Buchstabe %s mehrmals benutzt. ' +
    'Unfähig den Sequenz-Designer zu starten.',
  'FUDesignMissingLetters' : 'Figur-Buchstabe(n) <strong>%s</strong> ' +
    'fehlen. Unfähig den Sequenz-Designer zu starten.',
  'FUDesignNotFreeUnknown' : 'Sequenz Regeln sind nicht gesetzt für die freie ' +
    'Bekannte oder Unbekannte. Unfähig den Sequenz-Designer zu starten.',
  'FUerrorsDetected' : 'Sequenz fehlerhaft:',
  'FUfinalizing' : 'Finalisiere Sequenz. Einen Moment bitte... ',
  'FUletterMulti' : '(%s) Figur-Buchstabe %s mehrmals benutzt.',
  'FUmultipleSubsequences' : 'Die Sequenz hat %s Untersequenzen. Es sollte ' +
    'nur eine geben.',
  'fuSelectFigureFirst' : 'Klicken Sie auf eine Figur der Untersequenz(en) ' +
    'um sie zu bearbeiten. Sie können die Figuren vom <i>Figurenrgister</i> ziehen ' +
    'und in der Untersequenz ablegen.',
  'FUstarting' : 'Starte den Sequenz-Designer. Einen Moment bitte... ',
  'FUstartOnLoad' : 'Die Sequenz scheint eine Figurendatei für die freie ' +
    'Unbekannte zu sein. Möchten Sie den Sequenz-Designer starten?',
  'FUexitEntryMatch' : 'Einige Figureein- / -ausgangsfluglagen passen nicht zueinander',
  'gaps' : 'Lücken',
      'general': 'Allgemein',
  'generatingQRCode' : 'Generiere QR-Code...',
  'getChrome' : 'Zur optimalen Anwendung von OpenAero, downloaden Sie bitte ' +
    'die neueste Version des <a href="https://www.google.com/intl/en/chrome/browser/">' +
    'Google Chrome</a> Browsers.',
  'getTheApp' : 'OpenAero ist als App verfügbar.',
  'glider' : 'Segelflug',
  'gridAdditionals' : 'Zusatzfigur(en) benötigt',
  'gridInfo' : 'Gitterinformation',
  'gridNegEntry' : 'Neg. Eingang',
  'gridNegExit' : 'Neg. Ausgang',
  'gridOrderBy' : 'Sortieren nach',
  'gridPosEntry' : 'Pos. Eingang',
  'gridPosExit' : 'Pos. Ausgang',
  'gridSpeed' : 'Geschwindigkeit',
  'gridView' : 'Die Gitterspaltenanzahl ist in der Gitteransicht zu finden. ',
  'harmony' : 'Harmonie',
  'help' : 'Hilfe',
  'hideIllegalFigures' : 'Illegale Figuren ausblenden (gemäß Sequenz-Regeln)',
      'iacNoteDownwindEntry' : 'Beachten Sie den Rückenwind-Eingang. ',
  'iacNoteYAxisEntry' : 'Beachten Sie den Querwind Eingang. ',
  'illegalAtEnd' : 'Illegale Figur am Ende ',
  'illegalBefore' : 'Illegale Figur vor Figur ',
  'illegalFig' : ' ist illegal, versuchen Sie ',
  'imageFormat' : 'Bildformat',
  'imageHeight' : 'Höhe',
  'imageSize' : 'Bildgröße',
  'imageWidth' : 'Breite',
  'importRulesFile' : 'Importiere Regeldatei',
  'insertions' : 'Einfügungen',
  // new 2020.1.1, 2023-01-15
  'installApp' : 'Installiere App',
  'installation' : 'Installation',
  'installed' : '<p>OpenAero wurde nun in diesem Browser installiert ' +
    'und wird automatisch Updates erhalten. Es ist online verfügbar und offline ' +
    'unter <a href="http://%1\$s" target="_blank">' +
    '%1\$s</a>. Sie können eine Verknüpfung zu dieser Adresse auf Ihrem Desktop ' +
    'für einen Erleichterten Zugang ablegen.</p>' +
    '<p>Ein weitreichendes Benutzerhandbuch ist verfügbar unter <i>Hilfe -> Handbuch</i>. ' +
    'Bitte nehmen Sie sich etwas Zeit um es zu lesen. </p>',
  'installedApp' : '<p>Willkommen zu Ihrer OpenAero App.</p>' +
    '<p>Ein weitreichendes Benutzerhandbuch ist verfügbar unter <i>Hilfe -> Handbuch</i>. ' +
    'Bitte nehmen Sie sich etwas Zeit um es zu lesen.</p>',
  'installedWindows10' : '<p>OpenAero wurde nun in diesem Browser installiert' +
    'und wird automatisch Updates erhalten. Es ist online verfügbar und offline ' +
    'unter <a href="http://%1\$s" target="_blank">' +
    '%1\$s</a>.</p>' +
    '<p>Ein weitreichendes Benutzerhandbuch ist verfügbar unter <i>Hilfe -> Handbuch</i>. ' +
    '<p>Bitte nehmen Sie sich etwas Zeit um es zu lesen.</p>' +
    '<p>Sie können OpenAero als Windows-App installieren. Dies ermöglicht ' +
    '<ul><li>verbessertes Datei-Speichern</li><li>Hinzufügen von OpenAero zum ' +
    'Desktop, um es ohne Browser zu starten</li></ul>' +
    'Sie können die App vom <i>Werkzeuge</i> Menu installieren.</p>',
  'interruptions' : 'Unterbrechungen',
  'inverseForms' : 'Inverse Farbgebung (Weiß auf Schwarz)',
  'iOScancelSave' : 'Abbrechen',
  'iOSprintExplain' : 'Wählen Sie, was Sie drucken oder speichern möchten, dann ' +
    'tippen Sie auf <strong>PNG Bild speichern</strong>',
  'iOSsaveFile' : 'Zeige Sequenzbild',
  'iOSsaveFileMessage' : '<p>Mit Klick auf <i>Datei speichern</i> ' +
    'wird ein neues Fenster oder Browser-Tab geöffnet. Sie können dann auf' +
    '<span class="iOSsaveIcon"></span> klicken um zu drucken oder tippen und halten ' +
    'Sie das Bild, um es zu speichern.</p>' +
    '<p>Tips: Falls die Bildqualität nicht zufriedenstellend ist, können Sie die ' +
    'die Auflösung im Druck-Dialog "PNG oder SVG Vektorgrafik speichern" erhöhen. ' +
    'Falls Sie nur eine leere Seite erhalten, versuchen Sie jedes Sequenz Formular ' +
    'einzeln zu speichern.',
  'iOSsaveFileTitle' : 'Datei speichern',
  'judgesName' : 'Punktrichter Name',
  'language' : 'Sprache',
  'library' : 'Bibliothek',
  'loadNewVersion' : 'Eine neue Version ist verfügbar und wird automatisch ' +
    'beim nächsten Start von OpenAero geladen. Möchten Sie sie jetzt laden?',
  'loadNewVersionNoCookies' : 'Eine neue Version von OpenAero ist verfügbar ' +
    'Soll sie geladen werden? Falls Sie gerade eine Sequenz offen haben wird sie geleert. ',
  'loadNewVersionTitle' : 'Neue Version',
  'location' : 'Wettbewerb / Ort',
  'locked' : 'Die Sequenz ist gesperrt. Zum Entsperren, wählen Sie <i>Entsperren</i> ' +
    'im Sequenz-Menu',
  'lockSequence' : 'Sperren',
  'logo' : 'Logo',
  'logoChooserCancel' : 'Abbrechen',
  'logoChooserTitle' : 'Logoauswahl',
  // new 2020.1, 2023-01-15
  'logoFileTooLarge' : 'Logo-Datei ist zu groß. Bitte limitieren Sie die Dateigröße ' +
    'zu 1 MB.',
  'manual' : 'Handbuch',
  'maxAdditionals' : 'Maximal zusätzlich erlaubte Figuren: %s',
  'maxScaling' : 'Maximal kleinste Sequenzskalierung %',
  'missedSlot' : 'Versäumter Slot',
  'missingInfo' : 'Scheinbar fehlt essentielle Sequenzinformation.</br>' +
    'Sind Sie sicher die Datei zu drucken oder speichern ohne: ',
  'missingInfoTitle' : 'fehlende Sequenzinformation',
  'multiNoSequence' : 'Eine oder mehrere Dateien sind scheinbar keine OpenAero ' +
    'oder OLAN Sequenz-Dateien. Sie wurden nicht der Liste hinzugefügt. ',
  'multiOverrideRules' : 'Überschreiben der Sequenzregeln mit aktuellen Regeln ' +
    'der Sequenzinformation: ',
  'multiActiveLogo' : 'Benutze das Logo der aktuellen Sequenz',
  'multiRemoveLogo' : 'Logo entfernen',
  'multiOriginalLogo' : 'Benutze das Original-Logo',
  'newCopySubsequence' : 'Neue / kopiere Untersequenz',
  'newTurnPerspective' : `Realistischer erscheinende Perspektive für Kurven<br />
      <font color=red>EXPERIMENTELL, NICHT FÜR WETTBEWERBSFLÜGE VERWENDEN!</font>`,
  'noCookies' : 'Es scheint dass Cookies in Ihrem Browser deaktiviert sind. ' +
    'Das bedeutet, manche Funktionen von OpenAero werden nicht laufen.<br>' +
    'Um Cookies im Chrome Browser zu aktivieren, kopieren Sie bitte die folgende ' +
    'url in Ihre Adresszeile:<br />' +
    '<strong style="user-select: text;">chrome://settings/content/cookies</strong><br />' +
    'und vergewissern Sie sich, dass Cookies nicht blockiert werden. ',
  'noFigureLetterAssigned' : '(%s) Kein Figurenbuchstabe zugewiesen. ',
  'noFreeUnknownFig' : 'Kein Figurenbuchstabe',
  'nonArestiRolls' : 'Erlaube Nicht-Aresti-Figuren und nicht regulierte Rollen und Kombinationen. ' +
    'Probieren Sie den Sequenz-String <i>41h4,f,4 66</i> aus.)',
  'none' : 'Keine',
  'noRollAllowed' : 'Erlaubte Rollenkombinationen sind begrenzt (Aresti Catalog)',
  'noRules' : 'Keine Regeln zur Sequenzprüfung aktiv.',
  'notes' : 'Notizen (am Seitenanfang)',
  'notOnFormBC' : 'Diese Funktion ist nur verfügbar, wenn Formular ' +
    'B oder C angezeigt wird.',
  'notSequenceFile' : 'Dies scheint keine OpenAero oder OLAN ' +
    'Sequenzdatei zu sein.',
  'number' : 'Nummer',
  'numberInCircle' : 'Figurnummern im Eingangskreis',
  'ok' : 'OK',
  'OLANBumpBugWarning' : ' wurde als Humpty Bump erkannt ' +
    'von der Y zur X Achse. ',
  'OLANBumpBugWarningMulti' : ' wurden als Humpty Bump erkannt ' +
    ' von der Y zur X Achse. ',
  'OLANNBugWarning' : ' wurde als N-Figur erkannt ' +
    'mit Richtungsänderung auf der X Achse. ',
  'OLANNBugWarningMulti' : ' wurden als N-Figur erkannt ' +
    'mit Richtungsänderung auf der X Achse. ',
  'OLANBugWarningFooter' : '<font color=red> Diese Figuren oder die folgenden ' +
    'sind in OLAN anders gezeichnet als in OpenAero!</font> ' +
    'Prüfen Sie bitte die korrekten Richtungen.<br>' +
    'Diese Meldung erscheint für diese Sequenz nicht noch einmal. ',
  // changed 2020.1
  'oldBrowser' : 'Ihre Bowser ist für OpenAero nicht geeignet.<br>',
  'openaeroLanguage' : 'OpenAero Sprache',
  'openQueueFile' : 'Öffne Warteschlangendatei',
  'openSequence' : 'Öffne Sequenz',
  'openSequenceLink' : 'Öffne Sequenz-Link',
  'openSequenceLinkCancel' : 'Abbrechen',
  'openSequenceLinkError' : '<p>Es gab einen Fehler beim Öffnen des Seequenz-Links ' +
    'Dies war der bereitgestellte Link:<br>%s</p><p>Bitte prüfen Sie, ob Sie ' +
    'der Link <strong>komplett</strong> ist',
  'openSequenceLinkMessage' : 'Um eine Sequenz zu öffnen, die Ihnen als Link ' +
    'bereit gestellt wurde (z.B. per Email), kopieren Sie ihn komplett. Dann ' +
    'fügen Sie ihn in untere Box ein. ',
  'openSequenceLinkOpen' : 'Öffnen',
      'openSequenceLinkTitle': 'Sequenz von Link öffnen',
  'optimalSequenceAreaExceeded': 'Die Sequenz überschreitet die optimale Größe. ',
  'orderCountry' : 'Land',
  'orderFigureNr' : 'Figuren-Nr',
  'orderK' : 'K Faktor',
  'orderLetter' : 'Figurenbuchstabe',
  'otherNote' : 'Sonstige Notiz',
  'pageSpacing' : 'Seitenaufteilung',
  'pilot' : 'Pilot',
  'pilotCardExplain' : 'Wählen und tippen Sie erneut, um die Windrichtung um zu kehren',
  'pilotID' : 'Piloten ID',
  'pilotNo' : 'Piloten Nummer',
  'pilotnumberIAC1' : "Piloten",
  'pilotnumberIAC2' : "Nummer",
  'pleaseWaitStartup' : 'Bitte warten Sie während OpenAero startet...',
  'png' : 'PNG',
  'positionClearAuto' : 'Positioniere automatisch neue oder geänderte Figuren ' +
    'frei von anderen',
  'positioning' : 'Positionieren',
  'powered' : 'Motorflug',
  'print' : 'Drucken',
  'printCheck' : 'Sequenzprüfresultat',
  'printDialog' : 'Druckoptionen',
  // changed 2020.1.1, 2023-01-15
  'printExplain' : 'Sie können unten die Druckoptionen einstellen.<br>' +
    'Um Formulare als PDF zu <i>speichern</i>, klicken Sie <strong>Drucken</strong> und ' +
    'wählen dann den <i>Speicherort</i> und <strong>Speichern als PDF</strong> im ' +
    'Druck-Menu.',
  'printForms' : 'OpenAero druckt die Formulare...',
  'printFormA' : 'Formular A',
  'printFormB' : 'Formular B',
  'printFormC' : 'Formular C',
  'printFormGrid' : 'Figurengitter',
  'printFormL' : 'Formular L',
  'printFormR' : 'Formular R',
  'printMargins' : 'Druckabstände',
  'printMiniFormAonB' : 'mit mini Formular A',
  'printMiniFormAonC' : 'mit mini Formular A',
  'printMulti' : 'Drucken mehrerer Sequenzen',
  'printMultiClose' : 'Schließen',
  'printMultiOverrideRules' : 'Überschreiben der Sequenzregelen mit aktuellen ' +
    'Regeln der Sequenzinformation: ',
  'printMultipleSeq' : 'Drucken mehrerer Sequenzen',
  'printMultiWait' : 'Drucke %s Sequenzen.<br> Einen Moment bitte... ',
  'printNotes': 'Notizen (am Seitenanfang)',
  // new 2020.1.5
      'printPageSet': 'Seitencode',
      'printPageSetHidesFormSelectors': 'Wenn "Seitencode" aktiv ist ' +
      'wird andere Formatauswahl ausgeblendet. Siehe Handbuch für weitere Codes.',
  'printPilotCards' : 'Pilotenkarte',
  'printSaveForms' : 'Drucken / Speichern von Formularen',
  'printSavePdf' : 'Drucken / Speichern als PDF',
  'printSF' : 'Superfamiliennummern',
  'printString' : 'Sequenz-String',
  'processingMultiCounter' : 'Verarbeite Sequenz %s<br><br><strong>%s ' +
    'verbleibend</strong>',
  'program' : 'Programm',
  'programme' : 'Programm',
  'proposalsCreate' : 'Erstellung neuer Vorschläge',
  'proposalsCreateGroups' : 'Gruppenerstellung',
  'proposalsDialogClose' : 'Schließen',
  'proposalsExplain' : 'Sie können diesen Dialog zur Zufallsgenerierung von ' +
    'passenden Figurgruppenvorschlägen aus der aktiven Sequenz verwenden. Die ' +
    'Figurenanzahl jeden Vorschlags ist gleich der gesetzten Spaltenanzahl im ' +
    'Figurengitter. Der generierte Sequenz-String kann in eine andere Instanz von ' +
    'OpenAero eigefügt werden, oder alles kann ins Figurengitter geladen werden. ',
  'proposalsFigureCount' : 'Figuren in jedem Vorschlag',
  'proposalsIncomplete' : 'Der letzte Vorschlag ist nicht komplett, weil er ' +
    'in der aktiven Sequenz unzureichende Figuren sind',
  'proposalsTitle' : 'Erstellung der Figurengruppenvorschläge',
  'proposalsToGrid' : 'Laden ins Figurengitter',
      'proposalsTotalK': 'Gesamt K für jeden Vorschlag: ',
      'pullLoop': 'Ziehe %s Grad',
      'pushLoop': 'Drücke %s Grad',
      'qrCode': 'QR-Code',
      'qrCodeTitle': 'Sequenz-QR-Code',
      'qrScanFail': 'QR-Scan gescheitert: %s',
  'queue' : 'Warteschlange',
  'queueColumns' : 'Spaltenanzahl',
  'queueEmpty' : 'In der Warteschlange sind keine Figuren zum Speichern.',
  'queueLabel' : 'Warteschlange',
  'queueNotSaved' : 'Die Warteschlangefiguren wurden NICHT gespeichert.',
  'queueSaved' : 'Die Warteschlangefiguren wurden gespeichert.',
  'referenceFigureDifferent' : 'Figur %s unterscheidet sich von der Referenzsequenz.',
  'referenceFigureExitOpp' : 'Figur %s sollte gegen Eingangsrichtung existieren. ',
  'referenceFigureExitSame' : 'Figur %s sollte in Eingangsrichtung existieren. ',
  'referenceSequence' : 'Referenzsequenz',
  'referenceSequenceClose' : 'Schließen',
  'referenceSequenceExplain' : 'In untere Box können Sie einen Referenzsequenz-String ' +
    'zur Prüfung anderer Sequenzen eingeben mit erforderlichen Figuren, wie z.B.  ' +
    'die, der freien Bekannten oder Unbekannten.',
  'referenceSequenceFixed' : 'Diese Referenzsequenz kann nicht geändert werden, weil ' +
    'sie mit den aktiven Sequenzregeln gekoppelt ist.',
  'referenceSequenceTitle' : 'Referenzsequenz',
  'registration' : 'Kennung',
  'remove' : 'Entfernen',
  'removeLogo' : 'Logo entfernen',
  'resetStyle' : 'Zurücksetzen',
  'resetStyleAll' : 'Alles zurücksetzen',
  'restoreDefaultSettings' : 'Wiederherstellen aller Standard-Einstellungen ' +
    'und Werte',
  'restoreDefaultSettingsConfirm' : 'Alle OpenAero Einstellungen werden zu ihrem  ' +
    'Standard wiederhergestellt. Möchten Sie fortfahren?',
  'rollLarge' : 'Groß',
  'rollMedium' : 'Mittel',
  'rollPos' : [
    'Erster Roll/Trudel-Platzhalter',
    'Zweiter Roll-Platzhalter',
    'Dritter Roll-Platzhalter',
    'Vierter Roll-Platzhalter'],
  'rollSmall' : 'Klein',
  'rollsSpinsExplain' : 'Zum Hinzufügen von Rollen oder Trudlern, wählen Sie eine ' +
    'Basisfigur (z.B. aus Familie 1) und fügen Sie dann das Roll oder Trudelelement darauf ein',
  'rollSymbolLarge' : 'Groß',
  'rollSymbolMedium' : 'Mittel',
  'rollSymbolSize' : 'Rollensymbolgröße',
      'rollTextSize': 'Rollentextgröße',
      'ruleIllegalRollsEnabled': '<i class="material-icons status bad"></i><span>' +
          'Regel-illegale Rollen sind aktiviert in <a href="#">settings</a></span>',
  'rules' : 'Regeln',
  'rulesImported' : 'Erfolgreich importierte Regeln von Datei. Gesamtzeilenanzahl (ohne Kommentare): ',
  'rulesImportTitle' : 'Regeldateiimport',
  'rulesNotImported' : 'Es wurden keine Regeln importiert! Ist es vielleicht ' +
    'keine gültige Regeldatei? Bitte konsultieren Sie ' +
    '<a href="http://code.google.com/p/open-aero/wiki/Developers#Creating_rule_checking_files" '+
    'target="_blank">Creating rule checking files</a> for more information.',
  // changed 2020.1.1
  'runFromFile' : 'Es scheint als laufe OpenAero direkt von einer Datei. ' +
    'Mit Version 1.2.3 (Februar 2013) ist dies nicht länger empfhohlen, weil ' +
    'einige Funktionen nicht verfügbar sein werden. <br />' +
    'Bitte konsultieren Sie <a href="http://openaero.net">openaero.net</a>. ' +
    'OpenAero wird automatisch in Ihrem Browser installiert und ' +
    'wird auch offline verfügbar sein. <br />' +
    'Falls Sie Entwickler sind und eine lokale Kopie von OpenAero laufen lassen ' +
    'möchten, benutzen Sie bitte: ' +
    '<a href="https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb">' +
    'Web Server für Chrome</a>.',
  'sameAsBefore' : 'wie zuvor',
  'saveAsLink' : 'Als Link speichern',
  'saveAsPNG' : 'PNG Bild speichern',
  'saveAsSVG' : 'SVG Vektorgrafik speichern',
  'saveAsURL' : 'Der untere Link enthält Ihre komplette Sequenz. ' +
    'Sie können Ihn in eine Email oder für ein Lesezeichen etc. kopieren. <br />' +
    'Verwenden Sie Rechtsklick und "Link kopieren".',
  'saveAsURLFromApp' : 'Der untere Link enthält Ihre komplette Sequenz. ' +
    'Sie können Ihn in eine Email oder für ein Lesezeichen etc. kopieren.',
  'saveAsURLTitle' : 'Sequenz als Link speichern',
  'saveDeviceFirst' : 'Unfähig die Sequenz direkt zu öffnen. Bitte speichern Sie ' +
    'sie zunächst auf Ihrem Gerät, dann öffnen Sie sie vom Gerät.',
  'saveFigsSeparate' : 'Figuren einzeln speichern',
  'saveFigsSeparateFigureNumbers' : 'Figurnummern',
  'saveFigsSeparateTitle' : 'Figuren einzeln speichern',
  'saveFile' : 'Datei speichern',
  'saveFileAsAlert' : 'Zum Dowloaden Ihrer Datei, rechtsklicken Sie auf diesen ' +
    'Text und wählen "Link specihern als..." oder "Datei speichern als...".',
  'saveFileTitle' : 'Datei speichern',
  'saveImageVariables' : 'Speicher PNG Bild oder SVG Vektorgrafik',
  'savePdf' : 'PDF speichern',
  'saveQueueFile' : 'Warteschlangendatei speichern',
  'saveSequence' : 'Sequenz speichern',
  'saveShareFile' : 'Datei speichern / teilen',
      'saveShareSequence': 'Sequenz speichern / teilen',
      'scanQRcode': 'QR-Code scannen',
  'selectCategoryFirst' : 'zuerst die Kategorie wählen',
  'selectRulesFirst' : 'zuerst die Regeln wählen',
  'separateFigures' : 'Figuren trennen',
  'separateFiguresConfirm' : 'Dies wird die Figuren voneinander trennen ' +
    'und alle vorherigen Sequenzpositionierungen entfernen. ' +
    'Sind Sie sicher fortzufahren?',
  'sequence' : 'Sequenz',
  'sequenceCheckLog' : 'OpenAero Sequenzprüfungslog',
  'sequenceCorrect' : 'Sequenz ist korrekt',
  'sequenceHasErrors' : 'Sequenz ist fehlerhaft:',
  'sequenceInfo' : 'Sequenz-information',
  'sequenceShort' : 'Seq.',
  'sequenceTab' : 'Sequenz',
  'sequenceTest' : 'Prüfung: ',
  'sequenceNotSavedWarning' : 'Ihre aktuelle Sequenz wurde noch nicht gespeichert. ' +
    '\nSind Sie sicher eine neue zu öffnen?',
  'settings' : 'Einstellungen',
  'settingsClose' : 'Schließen',
  'settingsTitle' : 'Einstellungen',
  'setUpright' : 'Setze Eingang in Bauchlage',
  'setInverted' : 'Setze Eingang in Rückenlage',
  'showFileName' : 'Sequenzdateinamen hinzufügen',
  'showFullLog' : 'Zeige das ganze Log',
  'showHandles' : 'Zeige Figuranfasser (blaue Kreise) wenn ' +
    'Figur ausgewählt ist',
  'showOptiSeqArea' : 'Optimale Sequenz Größe anzeigen',
  'showQueue' : 'Zeige Warteschlange',
  'signature' : 'Unterschrift',
  'smallMobile' : 'Smartphone-Layout',
  'styleSettingsHeader' : 'Hier können Sie verschiedene Stileinstellungen ändern. ' +
    'Bitte beachten Sie, dass diese die Erscheinung ' +
    '<strong>Ihrer</strong> Version von OpenAero ändern, aber nicht die Erscheinung ' +
    'Ihrer Sequenz bei einem anderen Anwender von OpenAero!',
  'styling' : 'Stil',
  'stylingLoad' : 'Lade',
'stylingSave' : 'Speichern',
  'subSequenceDirection' : 'Untersequenzeingangsrichtung',
  'svg' : 'SVG',
  'switchFigures' : 'Figuren',
  'switchQueue' : 'Warteschlange',
  'team' : 'Mannschaft',
  'tooHigh' : 'Zu hoch',
  'tooLow' : 'Zu tief',
  'tools' : 'Werkzeuge',
  // tooltip forms a sub-array
  'tooltip' : {
    'curvedLine' : 'Figur zur neuen Position mit gekrümmter Linie verschieben',
    'deleteFig' : 'Aktive Figur löschen',
    // next two disabled. Are disabling minus button
    //entryExt' : 'Ändere Figureneingangslinienlänge',
    //exitExt' : 'Ändere Figurenausgangslinienlänge',
    'figEntryButton' : 'Umschalten der Figureneingangsfluglage Bauch / Rücken',
    'figExitButton' : 'Umschalten der Figurenausgangsfluglage Bauch / Rücken',
    'flipYAxis' : 'Umkehren der Y-Achse',
    'magMin' : 'Figur verkleinern',
    'magPlus' : 'Figur vergrößern',
      'moveForward': 'Figur ohne Verbindungslinie vorwärts verschieben',
    'rotate90': 'In Gitteransicht drehen',
    'straightLine' : 'Figure zu neuer Position mit gerader Verbindungslinie verschieben',
    'subSequence' : 'Von dieser Figur aus eine Untersequenz starten',
    'switchFirstRoll' : 'Umschalten erster Rollendrehrichtung',
    'switchX' : 'Umschalten der Ausgangsrichtung auf X Achse',
    'switchY' : 'Umschalten der Ausgangsrichtung auf Y Achse'
  }, // end tooltip sub-array
  'totalK' : 'Gesamt K',
  'trgViolation' : 'Verstoß',
  'unlockSequence' : 'Entsperren',
  'unusedFigureLetters' : 'Unbenutzte(r) Figurbuchstabe(n): %s',
  'update' : 'Update',
  'updateApp' : 'OpenAero update %s ist verfügbar',
  'upwind' : 'Gegenwind',
  'upwindEntry' : 'Gegenwindeingang',
  'version' : 'Version: %s',
  'versionNew' : '<strong>OpenAero wurde hochgerüstet von Version %s zu %s' +
    '</strong><br>Neue Eiegenschaften:<ul>%s' +
    '<li>Andere Fehlerbehebungen und Verbesserungen (siehe <a id="changelog">' +
    'Änderungslog.txt</a> if interested)</li>' +
    '</ul>',
  'view' : 'Ansicht',
  // new 2020.1.1
  'warningChrome' : '<p><i class="material-icons" style="color:red">Warnhinweis</i> ' +
    'Sie benutzen die Chrome App. Dies wird in naher Zukunft nicht länger ' +
    'unterstützt von Google.</p>' +
    '<p>Eine neue App ist verfügbar, die die offline Sequenzerstellung enthält. </p>' +
    '<p>Möchten Sie die App jetzt deinstallieren und die neue App über ' +
    '<b>Werkzeuge</b> auf https://openaero.net</p> installieren?',
  'warningNewerVersion' : '<p>Diese Sequenz wurde mit einer neueren Version als Ihre erstellt. ' +
    'Es mag neue Eigenschaften enthalten. Bitte prüfen Sie die Korrektheit der Sequenz.</p>',
  'warningPre' : '<p>Wenn Sie diese Sequenz erneut speichern, wird dieser ' +
    'Warnhinweis nicht mehr angezeigt.</p>',
  'warningPre123' : '<p>Die gerade geöffnete Datei wurde mit einer OpenAero Version,' +
    'die älter als 1.2.3. ist, erstellt. Bitte prüfen Sie die Korrektheit aller ' +
    'Figurenausgangsrichtungen.</p>',
  'warningPre124' : '<p>Die gerade geöffnete Datei wurde mit einer OpenAero Version, ' +
    'die älter als 1.2.4. ist, erstellt. Bitte prüfen Sie die Korrektheit aller ' +
    'Richtungen von doppelten Humpty-Bumps.</p>',
  'warningPre137' : '<p>Die gerade geöffnete Datei wurde mit einer OpenAero Version, ' +
    'die älter als 1.3.7. Manche gerissene /gestoßene Rollen, die in Messefluglage beginnen ' +
    'hatten möglicherweise die falsche Aresti-Nummer und falschen K-Faktor. Sie sollten ' +
    'nun korrekt sein. Falls zutreffend, überprüfen Sie sie bitte.</p>',
  'warningPre20161' : '<p>Die gerade geöffnete Datei wurde mit einer OpenAero Version, ' +
    'die älter als 2016.1. ist, erstellt. Außerdem wurde die folgende Figur erkannt: ' +
    '<br>Ein doppelter Humpty Bump mit einem der Radii vergrößert und mit ' +
    'einer Rolle mit ungerader Viertelanzahl auf der ersten Linie und einer Rolle ' +
    'auf der zweiten Linie.<br> Diese Figurart wurde fehlerhaft von älteren OpenAero ' +
    'Versionen behandelt. Bitte überprüfen Sie alle doppleten Humpty-Bumps auf . ' +
    'korrekte Richtungen.</p>',
  'warningPre201611' : '<p>Die gerade geöffnete Datei wurde mit einer OpenAero Version, ' +
    'die älter als 2016.1.1. ist, erstellt. Außerdem wurde sie als Gitter geöffnet ' +
    'und enthält eine Änderung der Figurenausgangsrichtung (^ or > Symbol). ' +
    'Dies ist von älteren OpenAero Version anders behandelt. Bitte prüfen Sie ' +
    'die Figuren um sicher zustellen, dass ihre Ausgangsrichtungen korrekt ' +
    'bezogen auf ihre Eingangsrichtung sind.</p>',
  'warningPre20192' : '<p>Die gerade geöffnete Datei wurde mit einer OpenAero Version, ' +
    'die älter als 2019.2. ist, erstellt. Außerdem enthält sie eine oder mehrere ' +
    'Figuren der Familien 1.2.11 oder 1.2.12 (Käseecken mit halber Rolle auf 45-Grad-Linie ' +
    'Diese wurden in älteren Versionen von OpenAero fehlerhaft programmiert. Sie ' +
    'wurden nun automatisch korrigiert. Prüfen Sie bitte trotzdem die Sequenz, um ' +
    'die Korrektheit der Ausgangsrichtungen und -fluglagen sicher zu stellen.</p>',
  'wind' : 'Wind/Vent',
  'windIAC' : 'Wind Richtung',
  'wingRocks' : 'Flügel wackeln',
  'xBox' : 'Box Querrichtung heran',
  'xBoxAway' : 'Box-Querrichtung hinweg',
  'xBoxEntry' : 'Querrichtungseingang heran',
  'xBoxEntryAway' : 'Querrichtungseingang hinweg',
  'zipImageFilenamePattern' : 'Muster für Figureneinzelbilder-Dateinamen',
  'zoom' : 'Zoom'
  // end of key-value pairs. No comma after last
}; 
