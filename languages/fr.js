// fr.js 1.4.4
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
lang.fr = {
// Edit keys and values here. Keys are the same for every language.
// A value can also be an array, such as 'rollPos', or even a sub-array
// with keys such as 'tooltip'. This must be the same in other languages.

// The first key should be the human-readable form of the language code.
// Subsequent keys are alphabetical.
'fr' : 'Français',
'about' : 'A propos',
'ac' : 'Avion',
'addAllToQueue' : 'Ajouter tout à la file',
'addFigureText' : 'Cliquer pour ajouter figure',
'addingFigure' : 'Ajouter une nouvelle figure',
'addToQueue' : 'Ajouter à la file',
'aircraft' : 'Avion et Immat',
'alertBoxClose' : 'Fermer',
'alerts' : 'Alertes',
'arestiSystem' : 'Système Aresti',
'autocorrectRoll' : 'Tonneau d\'autocorrection',
'blackWhite' : 'Noir et Blanc',
'cancel' : 'Annuler',
'cancelPrint' : 'Annuler',
'cancelSave' : 'Annuler',
'category' : 'Catégorie',
'changeStyle' : 'Changer',
'checkingRules' : 'Règles de vérification',
'checkMulti' : 'Vérification de plusieurs programmes',
'checkMultiClose' : 'Fermer',
'checkMultipleSeq' : 'Vérification d\'un groupe de programmes',
'checkSequence' : 'Vérification du programme',
'checkSequenceLog' : 'Voir le détail',
'checkSequenceOK' : 'OK',
'checkSequenceResult' : 'Résultat de vérification',
'checkSequences' : 'Vérification des programmes',
'chooseFiles' : 'Choisir les fichiers ici :',
'chooseLogo' : 'Choisir un logo',
'class' : 'Type',
'clearPositioning' : 'Effacer le positionnement',
'clearPositioningConfirm' : 'Ceci supprimera le positionnement des figures.' +
  'Voulez-vous continer ?',
'clearQueue' : 'Effacer la file',
'clearQueueConfirm' : 'Etes-vous sur de vouloir effacer toutes les figures de la file ?',
'clearSequence' : 'Effacer le programme',
'clickAddFigure' : 'Cliquer pour ajouter figure',
'clickChangeFigure' : 'Cliquer pour changer ou ajouter une figure',
'closeAlert' : 'Fermer',
'closeIt' : 'Fermer',
'columns' : 'Colonnes',
'comments' : 'Commentaires',
'confirmBoxYes' : 'Oui',
'confirmBoxNo' : 'Non',
'confirmLeave' : 'Vous quittez OpenAero. Les programmes non sauvegardes seront perdus.',
'contest' : 'Compétition',
'convertingFailed' : 'La conversion in image PNG a échouée.<br>Si vous souhaitez' +
  'que cette erreur soit transmise aux développeurs d\'OpenAero, cliquez sur le ' +
  'lien ci-dessous :<br><a href="mailto:openaero.devel@gmail.com?subject=' +
  'BUG:SVG_to_PNG_conversion&body=%s" target="_blank">Email bug report</a>',
'convertingToPng' : 'Conversion en image PNG.<br>Ceci peut prendre' +
  'un peu de temps. Merci de patienter...',
'convertingTitle' : 'Conversion en cours...',
'date' : 'Date',
'demo' : 'Exemples',
'desktopVersion' : 'Version ordinateur',
'download' : 'Télécharger',
'downloadHTML5' : 'Vous pouvez enregistrer en choisissant un nom' +
  'et en cliquant <i>Enregistrer fichier</i> ci-dessous.<br>Une ' +
  'fenêtre où vous pourrez choisir le répertoire apparaîtra.',
'downloadLegacy' : 'Vous pouvez enregistrer en choisissant un nom ' +
  'et/ou faire un clic droit sur <i>Enregistrer</i> ci-dessous ' +
  'et choisir "Enregistrer la cible du lien sous... " ou "Copier ' +
  'l\'adresse du lien".<br>Une fenêtre ou vous pourrez ' +
  'choisir le répertoire apparaîtra.',
// nouveau 1.4.2
'downwind' : 'vent arrière',
//
'downwindEntry' : 'Débuter vent arrière',
'drawingStyles' : 'Paramètres de dessin',
'drawingStylesExplain' : '<p>Tous les paramètres du dessin peuvent être changés ici. ' +
  'Exemples : <strong>pos</strong>=ligne positive, ' +
  '<strong>neg</strong>=ligne negative, <strong>rollText</strong>=texte' +
  ' de la rotation (e.g. 2x8).</p>',
'editingFigure' : 'Edition figure',
'entryExitAttExt' : 'Attitude de debut/fin et longueur',
'expert' : 'Expert',
'feedback' : 'Retour',
'fileOpeningNotSupported' : 'L\'ouverture de fichier n\'est pas supportée dans ' +
  'ce navigateur. Certaines fonctions ont été invalidées.',
'figSelectorAddAfter' : 'Ajout de figure après',
'figSelectorAddBefore' : 'Ajout de figure avant',
'figSelectorAddEnd' : 'Ajout de figure à la fin',
'figSelectorAddStart' : 'Ajout de figure au début',
'figSelectorReplace' : 'Remplace la figure sélectionnée ',
'figsInGrid' : 'Tableau des figures',
'figureAlreadyInQueue' : 'Cette figure est déjà dans la file',
'figureEditor' : 'Editeur&nbsp;de figure',
'figureQueue' : 'File / Tampon',
'file' : 'Fichier',
'fileName' : 'Nom du fichier',
'flipYAxis' : 'Changer d\'axe Y',
'forElement' : ' pour élément ',
'formA' : 'Forme A',
'formB' : 'Forme B',
'formC' : 'Forme C',
'freeUnknownFig' : 'Figure Inconnu-Libre',
'freeUnknownLink' : 'Liaison Inconnu-Libre',
'FUfigOptionsDisabled' : 'Certaines options sont invalidées pour l\'inconnu-libre',
'FUletterMulti' : '(%s) lettre d\’Inconnu-Libre %s utilisée plusieurs fois',
'gaps' : 'Espaces',
'general' : 'Général',
'getChrome' : 'Pour une utilisation optimale d\OpenAero, téléchargez la ' +
  'dernière version du navigateur <a href="https://www.google.com/intl/en/chrome/browser/">' +
  'Google Chrome</a>.',
'glider' : 'Planeur',
'gridView' : 'Vue en tableau',
'harmony' : 'Harmonie',
'help' : 'Aide',
'hideIllegalFigures' : 'Masquer les figures non autorisées',
'iacForms' : 'Formulaire style IAC',
'illegalAtEnd' : 'Figure illégale à la fin',
'illegalBefore' : 'Figure illégale avant la figure',
'illegalFig' : ' est interdit, essayez ',
'imageFormat' : 'Format d\'image',
'imageHeight' : 'Hauteur',
'imageSize' : 'Taille d\'image',
'imageWidth' : 'Largeur',
'importRulesFile' : 'Importer un fichier de règles',
'installation' : 'Installation',
'installChromeApp' : 'Vous pouvez installer OpenAero comme une Application Chrome. Ceci ' +
  'procure:<ul><li>Une sauvegarde de fichiers améliorée</li><li>Le lancement ' +
  'd\'OpenAero sans ouvrir le navigateur Chrome</li></ul>' +
  'Voulez-vous installer l\'application? Si vous choisissez <i>Non</i> on ne vous' +
  're-demandera pas, mais vous pourrez l\'installer par le menu <i>Outils</i> ' +
  'a n\'importe quel moment.',
'installChromeAppComplete' : 'L\'application Chrome a été installée. Vous pouvez y ' +
  'accéder en ouvrant une nouvelle rubrique dans Chrome. Par un clic droit ' +
  'vous pouvez ajouter l\'application sur votre bureau.',
'installChromeAppTitle' : 'Installer l\'application Chrome',
'inverseForms' : 'Inverse vidéo (blanc sur noir)',
'language' : 'Langue',
'loadNewVersion' : 'Une nouvelle version d\'OpenAero est disponible. La charger ?',
'loadNewVersionNoCookies' : 'Une nouvelle version d\'OpenAero est disponible. La charger ?' +
  'Si un programme est ouvert, il sera efface.',
'loadNewVersionTitle' : 'Nouvelle version',
'location' : 'Lieu',
'logo' : 'Logo',
'logoExplain' : 'Chargez votre logo en cliquant sur parcourir..., ' +
  'ou sélectionnez un des logos déjà affiches.',
'manual' : 'Manuel OpenAero',
'maxConnectors' : 'Maximum de figures de liaison permis :',
'missingInfo' : 'Des informations essentielles du programme manquent.' +
  'Etes-vous sur de vouloir enregistrer ou imprimer le fichier sans celles-ci :',
'missingInfoTitle' : 'Informations du programme manquantes',
'mobileVersion' : 'Version mobile',
'multiOverrideRules' : 'Au lieu des règles de chaque programme, utiliser les règles :',
'noCookies' : 'Il semble que les cookies sont invalidés dans votre navigateur.' +
  'Certaines fonctions d\'OpenAero ne marcheront pas.<br>' +
  'Pour autoriser les cookies dans Chrome, copier l\'url ' +
  'suivante dans la barre d\'addresse :<br />' +
  '<strong>chrome://chrome/settings/content</strong><br />' +
  'et choisissez <i>Autoriser l\'enregistrement de données locales</i>',
'noFigureLetterAssigned' : '(%s) Pas de lettre affectée',
'noFreeUnknownFig' : 'Pas de figure d\'Inconnu-Libre',
// change 1.4.4
'nonArestiRolls' : 'Autoriser les rotations et combinations ' +
  'non-Aresti (essayer <i>41h4,f,4 66</i>)',
'none' : 'Aucune',
'noRules' : 'Pas de règle de vérification disponible.',
'notes' : 'Notes',
'notOnFormBC' : 'Cette fonction est seulement disponible lorsque ' +
  'la forme B ou C est affichée.',
'numberInCircle' : 'Numéros de figure dans un cercle',
'ok' : 'OK',
// OLANBumpBugWarning can be removed (with asociated code in OpenAero.js)
// in 2015
'OLANBumpBugWarning' : ' a été détecté étant un comme retournement vertical ' +
  'de l\'axe X vers l\'axe Y.',
'OLANBumpBugWarningMulti' : ' ont été détectés comme étant des retournements verticaux' +
  'de l\'axe X vers l\'axe Y.',
'OLANNBugWarning' : ' a été détecté comme étant un N avec  ' +
  'un changement de direction sur l\'axe X.',
'OLANNBugWarningMulti' : ' ont ete detectes comme un N avec ' +
  'un changement de direction sur l\'axe X.',
'OLANBugWarningFooter' : '<font color=red>Ces figures ou les  ' +
  'suivantes peuvent être dessinées différemment dans Olan et OpenAero !</font>' +
  'Vérifiez que la direction de sortie est correcte.<br>' +
  'Ce message ne sera plus affiche pour ce programme.',
'openaeroLanguage' : 'Syntaxe OpenAero',
'openQueueFile' : 'Ouvrir un fichier file',
'openSequence' : 'Ouvrir un programme',
'orFileDrop' : 'Ou glisser/déplacer vos fichiers ici',
'pageSpacing' : 'Espacement entre pages',
'pilot' : 'Pilote',
'pilotCardFormB' : 'Forme B',
'pilotCardFormC' : 'Forme C',
'pilotNo' : 'Pilote No.',
'pilotnumberIAC1' : "pilote",
'pilotnumberIAC2' : "Numéro",
'pleaseWaitStartup' : 'Patentiez pendant le chargement d\'OpenAero',
'png' : 'PNG',
'positioning' : 'Cadre (Coef)',
'powered' : 'Avion',
'print' : 'Imprimer / Enregistrer PDF',
'printCheck' : 'Résultat de la vérification',
'printDialog' : 'Options d\impression',
// updated 1.4.2
'printExplain' : 'Vous pouvez positionner les options d\'impression ci-dessous.<br>' +
  'Pour <i>enregistrer</i> PDF, cliquer <strong>Imprimer</strong> puis choisir ' +
  'comme <i>destination</i> <strong>Enregistrer en PDF</strong> dans le ' +
  'Menu de votre navigateur.',
//
'printForms' : 'Impression des Formes...',
'printFormA' : 'Forme A',
'printFormB' : 'Forme B',
'printFormC' : 'Forme C',
'printFormGrid' : 'Tableau des figures',
'printMiniFormAonB' : 'avec mini Forme A',
'printMiniFormAonC' : 'avec mini Forme A',
'printNotes' : 'Annotations (haut de page)',
'printPilotCards' : 'Fiche pilote',
'printSaveForms' : 'Imprimer / Enregistrer image',
'printSF' : 'Numéro de Super Famille',
'printString' : 'Texte du programme',
'program' : 'Programme',
'programme' : 'Programme',
'queue' : 'File/Tampon',
// new in 1.4.2
'queueColumns' : 'Colonnes',
'queueEmpty' : 'Pas de figure à enregistrer dans la file',
'queueLabel' : 'File/Tampon',
//
'queueNotSaved' : 'Les figures de la file ont été enregistrées',
'queueSaved' : 'Les figures de la file N\'ONT PAS été enregistrées',
'remove' : 'Supprimer',
'removeLogo' : 'Supprimer',
'resetStyle' : 'Valeur par défaut',
'resetStyleAll' : 'Valeur par défaut (tous les paramètres)',
'rollLarge' : 'Grand',
'rollMedium' : 'Moyen',
'rollPos' : ['Première série de rotations','Deuxième série de rotations','Troisième série de rotations','Quatrième série de rotations'],
'rollSmall' : 'Petit',
'rollTextSize' : 'Taille du texte des rotations',
'rules' : 'Règles',
'rulesImported' : 'Règles importées du fichier avec succès. Nombre de lignes (hors commentaires) :',
'rulesImportTitle' : 'Importation du fichier de règles',
'rulesNotImported' : 'Pas de règles importées ! Ce n\'est peut être ' +
  'pas un fichier de règles ? Consultez ' +
  '<a href="http://code.google.com/p/open-aero/wiki/Developers#Creating_rule_checking_files"' +
  'target="_blank">Création d\'un fichier de règles</a> pour plus d\' information.',
'runFromFile' : 'Vous avez démarré OpenAero à partir d\'un fichier.' +
  'Depuis la version 1.2.3 (février 2013) ceci est déconseillé ' +
  'car certains fonctions ne sont pas disponibles.<br />' +
  'Alllez à <a href="http://openaero.net">openaero.net</a>. ' +
  'OpenAero sera automatiquement installe dans votre navigateur et sera egalement ' +
  'disponible hors connexion.',
'saveAsImage' : 'Enregistrer l\'image',
'saveAsLink' : 'Enregistrer en tant que lien',
'saveAsPNG' : 'Enregistrer une image PNG',
'saveAsSVG' : 'Enregistrer une image SVG',
'saveAsURL' : 'Le lien ci-dessous contient votre programme. ' +
  'Vous pouvez le copier dans un émail, en faire un favori, etc...<br /> ' +
  'Faire un clic droit et "Enregistrer la cible du lien sous...".',
'saveAsURLFromApp' : 'Le lien ci-dessous contient votre programme. ' +
  'Vous pouvez le copier dans un émail, en faire un favori, etc...<br /> ' +
  'Faire un clic droit pour le copier.',
'saveAsURLTitle' : 'Enregistrement du programme en tant que lien',
'saveFigsSeparate' : 'Enregistrer chaque figure',
'saveFigsSeparateTitle' : 'Enregistrement individuel des figures',
'saveFile' : 'Enregistrer',
'saveFileAsAlert' : 'Pour enregistrer votre fichier, faire un clic droit sur ' +
  'ce texte et choisissez "Enregistrer le lien…" ou "Enregistrer le fichier…"',
'saveFileTitle' : 'Enregistrement',
'saveImageVariables' : 'Enregistrement d\'une image en PNG ou SVG',
'saveQueueFile' : 'Enregistrer la file',
'saveSequence' : 'Enregistrer le programme',
'selectCategoryFirst' : 'Sélectionnez la Catégorie',
'selectRulesFirst' : 'Sélectionnez les Règles',
'separateFigures' : 'Espacer les figures',
'sequence' : 'Programme',
'sequenceCorrect' : 'Le programme est correct',
'sequenceHasErrors' : 'Le programme est incorrect :',
'sequenceInfo' : 'Programme',
// nouveau 1.4.2
'sequenceShort' : 'Prog.',
//
'sequenceTab' : 'Programme',
'sequenceTest' : 'Vérification :',
'sequenceNotSavedWarning' : 'Le programme n\'a pas été Enregistre.\n' +
  'Etes-vous sur de vouloir en ouvrir un nouveau ?',
'setMobile' : 'Version mobile',
'settings' : 'Paramétrage',
'settingsClose' : 'Fermer',
'settingsTitle' : 'Paramètres',
'setUpright' : ':entrée ventre',
'setInverted' : ':entrée dos',
'showFullLog' : 'Voir le rapport de vérification complet',
'showQueue' : 'Voir la file',
'styleSettingsHeader' : 'Vous pouvez changer ici les paramètres de dessin. ' +
  'Notez bien que ces changements affectent l\'apparence du programme sur ' +
  '<strong>votre<strong> version d\'OpenAero, mais pas ' +
  'celle obtenue sur d\'autres version d\'OpenAero.',
'styling' : 'Style',
'svg' : 'SVG',
'tools' : 'Outils',
// tooltip forms a sub-array
'tooltip' : {
  'connector' : 'Fait de cette figure une figure de liaison pour Inconnu-Libre',
  'curvedLine' : 'Déplace la figure et crée une ligne de liaison courbe',
  'deleteFig' : 'Supprime la figure sélectionnée',
  // next two disabled. Are disabling minus button
  // entryExt' : 'Changer la ligne d\'entrée',
  // exitExt' : 'Changer la ligne de sortie',
  'figEntryButton' : 'Change l\'entrée ventre <=> dos',
  'figExitButton' : 'Change la sortie ventre <=> dos',
  'magMin' : 'réduit la taille de la figure',
  'magPlus' : 'Agrandit la figure',
  'moveForward' : 'Déplace la figure vers l\'avant sans ligne de liaison',
  'straightLine' : 'Déplace la figure et crée une ligne de liaison droite',
  'subSequence' : 'Débute un sous programme à partir de la figure selectionnee',
  'switchFirstRoll' : 'Change le sens de la première rotation',
  'switchX' : 'Change le sens de la sortie sur l\'axe X',
  'switchY' : 'Change le sens de la sortie sur l\'axe Y'
}, // end tooltip sub-array
'unknownFileType' : 'L\'ouverture de ce fichier n\'est pas supportée dans ce navigateur.',
'unusedFigureLetters' : 'Lettre inutilisée : %s',
'update' : 'Mise à jour',
// nouveau 1.4.2
'upwind' : 'Vent de face',
//
'upwindEntry' : 'Débuter vent de face',
'version' : 'Version : %s',
'view' : 'Affichage',
'warningPre' : '<p> Lors de la prochaine sauvegarde, cet ' +
  'avertissement \'apparaîtra plus.</p>',
'warningPre123' : '<p> Le programme que vous venez d\'ouvrir a ete cree ' +
  'avec une version d\'OpenAero antérieure à 1.2.3. Vérifiez que le sens le sortie de toutes ' +
  'les figures est correct.</p>',
'warningPre124' : '<p> Le programme que vous venez d\'ouvrir a été crée ' +
  'avec une version d\'OpenAero antérieure à 1.2.3. Vérifiez que le sens le sortie de tous ' +
  'les doubles retournements verticaux est correct.</p>',
'warningPre137' : '<p> Le programme que vous venez d\'ouvrir a été crée ' +
  'avec une version d\'OpenAero antérieure à 1.3.7. Certains déclenchés débutés tranche ' +
  'peuvent avoir un code Aresti et un K incorrect. Ceci devrait être corrigé maintenant. ' +
  'vérifiez bien, si vous êtes dans cette situation.</p>',
'wind' : 'V E N T',
'windIAC' : 'sens du vent',
// nouveau 1.4.2
'xBox' : 'De face',
'xBoxAway' : 'De derrière',
//
'xBoxEntry' : 'Débuter de face',
'xBoxEntryAway' : 'Débuter de derrière',
'zipImageFilenamePattern' : 'Chaîne de définition des noms des fichiers image',
// nouveau 1.4.2
'zoom' : 'Zoom'
//
// end of key-value pairs. No comma after last
};
