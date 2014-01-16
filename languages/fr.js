// fr.js 1.4.0 V gg_1
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
'fr' : 'Francais',
'about' : 'A propos',
'ac' : 'Avion',
'addAllToQueue' : 'Ajouter tout a la file',
'addFigureText' : 'Cliquer pour ajouter figure',
'addingFigure' : 'Ajouter une nouvelle figure',
'addToQueue' : 'Ajouter a la file',
'aircraft' : 'Avion et Immat',
'alertBoxClose' : 'Fermer',
'alerts' : 'Alertes',
'arestiSystem' : 'systeme Aresti',
'autocorrectRoll' : 'Tonneau d\'autocorrection',
'blackWhite' : 'Noir et Blanc',
'cancel' : 'Annuler',
'cancelPrint' : 'Annuler',
'cancelSave' : 'Annuler',
'category' : 'Categorie',
'changeStyle' : 'Changer',
'checkingRules' : 'Regles de verification',
'checkMulti' : 'Verification de plusieurs programmes',
'checkMultiClose' : 'Fermer',
'checkMultipleSeq' : 'Verification d\'un groupe de programmes',
'checkSequence' : 'Verification du programme',
'checkSequenceLog' : 'Voir le detail',
'checkSequenceOK' : 'OK',
'checkSequenceResult' : 'Resultat de verification',
'chooseFiles' : 'Choisir les fichiers ici :',
'chooseLogo' : 'Choisir un logo',
'class' : 'Type',
'clearPositioning' : 'Effacer le positionement',
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
'contest' : 'Competition',
'convertingFailed' : 'La convertion in image PNG a echouee.<br>Si vous souhaitez' +
  'que cette erreur soit transmise aux developpeurs d\'OpenAero, cliquez sur le ' +
  'lien ci-dessous :<br><a href="mailto:openaero.devel@gmail.com?subject=' +
  'BUG:SVG_to_PNG_conversion&body=%s" target="_blank">Email bug report</a>',
'convertingToPng' : 'Conversion en image PNG.<br>Ceci peut prendre' +
  'un peu de temps. Merci de patienter...',
'convertingTitle' : 'Conversion en cours...',
'date' : 'Date',
'demo' : 'Exemples',
'desktopVersion' : 'Version ordinateur',
'download' : 'Telecharger',
'downloadHTML5' : 'Vous pouvez enregistrer en choisissant un nom' +
  'et en cliquant <i>Enregister fichier</i> ci-dessous.<br>Une fenêtre où vous pourrez' +
  'choisir le repertoire apparaitra.',
'downloadLegacy' : 'Vous pouvez enregistrer en choisissant un nom ' +
  'et/ou faire un clic droit sur <i>Enregistrer</i> ci-dessous ' +
  'et choisir "Enregistrer la cible du lien sous... " ou "Copier l\'adresse du lien".<br>Une fenetre ou vous pourrez ' +
  'choisir le repertoire apparaitra.',
'downwindEntry' : 'Debuter vent arriere',
'drawingStyles' : 'Parametres de dessin',
'drawingStylesExplain' : '<p>Tous les parametres du dessin peuvent etre changes ici. ' +
  'Exemples : <strong>pos</strong>=ligne positive, ' +
  '<strong>neg</strong>=ligne negative, <strong>rollText</strong>=texte' +
  ' de la rotation (e.g. 2x8).</p>',
'editingFigure' : 'Edition figure',
'entryExitAttExt' : 'Attitude de debut/fin et longueur',
'expert' : 'Expert',
'feedback' : 'Retour',
'fileOpeningNotSupported' : 'L\'ouverture de fichier n\'est pas supportee dans ' +
  'ce navigateur. Certaines fonctions ont ete invalidees.',
'figSelectorAddAfter' : 'Ajout de figure apres',
'figSelectorAddBefore' : 'Ajout de figure avant',
'figSelectorAddEnd' : 'Ajout de figure a la fin',
'figSelectorAddStart' : 'Ajout de figure au debut',
'figSelectorReplace' : 'Remplace la figure en selectionnee ',
'figsInGrid' : 'Tableau des figures',
'figureAlreadyInQueue' : 'Cette figure est deja dans la file',
'figureEditor' : 'Editeur&nbsp;de figure',
'figureQueue' : 'File / Tampon',
'file' : 'Fichier',
'fileName' : 'Nom du fichier',
'flipYAxis' : 'Changer d\'axe Y',
'forElement' : ' pour element ',
'formA' : 'Forme A',
'formB' : 'Forme B',
'formC' : 'Forme C',
'freeUnknownFig' : 'Figure Inconnu-Libre',
'freeUnknownLink' : 'Liaison Inconnu-Libre',
'FUfigOptionsDisabled' : 'Certaines options sont invalidees pour l\'inconnu-libre',
'FUletterMulti' : '(%s) lettre Inc-Libre %s utilisee plusieurs fois',
'gaps' : 'Espaces',
'general' : 'General',
'getChrome' : 'Pour une utilisation optimale d\OpenAero, telechargez la ' +
  'derniere version du navigateur <a href="https://www.google.com/intl/en/chrome/browser/">' +
  'Google Chrome</a>.',
'gridView' : 'Vue en tableau',
'harmony' : 'Harmonie',
'help' : 'Aide',
'hideIllegalFigures' : 'Masquer les figures non autorisees',
'iacForms' : 'Formulaire style IAC',
'illegalAtEnd' : 'Figure illegale a la fin',
'illegalBefore' : 'Figure illegale avant la figure',
'illegalFig' : ' est interdit, essayez ',
'imageFormat' : 'Format d\'image',
'imageHeight' : 'Hauteur',
'imageSize' : 'Taille d\'image',
'imageWidth' : 'Largeur',
'importRulesFile' : 'Importer un fichier de regles',
'installation' : 'Installation',
'installChromeApp' : 'Vous pouvez installer OpenAero comme une Application Chrome. Ceci ' +
  'procure:<ul><li>Une sauvegarde de fichiers amelioree</li><li>Le lancement ' +
  'd\'OpenAero sans ouvrir le navigateur Chrome</li></ul>' +
  'Voulez-vous installer l\'application? Si vous choisissez <i>Non</i> on ne vous' +
  're-demandera pas, mais vous pourrez l\'installer par le menu <i>Outils</i> ' +
  'a n\'importe quel moment.',
'installChromeAppComplete' : 'L\'application Chrome a ete installee. Vous pouvez y ' +
  'acceder en ouvrant une nouvelle rubrique dans Chrome. Par un clic droit ' +
  'vous pouvez ajouter l\'application sur votre bureau.',
'installChromeAppTitle' : 'Installer l\'application Chrome',
'inverseForms' : 'Inverse video (blanc sur noir)',
'language' : 'Langue',
'loadNewVersion' : 'Une nouvelle version d\'OpenAero est disponible. La charger ?',
'loadNewVersionNoCookies' : 'Une nouvelle version d\'OpenAero est disponible. La charger ?' +
  'Si un programme est ouvert, il sera efface.',
'loadNewVersionTitle' : 'Nouvelle version',
'location' : 'Lieu',
'logo' : 'Logo',
'logoExplain' : 'Chargez votre logo en cliquant sur parcourir..., ' +
  'ou selectionnez un des logos deja affiches.',
'manual' : 'Manuel OpenAero',
'maxConnectors' : 'Maximum de figures de liaison permis :',
'missingInfo' : 'Des informations essentielles du programme manquent.' +
  'Etes-vous sur de vouloir enregistrer ou imprimer le fichier sans celles-ci :',
'missingInfoTitle' : 'Informations du programme manquantes',
'mobileVersion' : 'Version mobile',
'multiOverrideRules' : 'Au lieu des regles de chaque programme, utiliser les regles :',
'noCookies' : 'Il semble que les cookies sont invalides dans votre navigateur.' +
  'Certaines fonctions d\'OpenAero ne marcheront pas.<br>' +
  'Pour autoriser les cookies dans Chrome, copier l\'url ' +
  'suivante dans la barre d\'addresse :<br />' +
  '<strong>chrome://chrome/settings/content</strong><br />' +
  'et choisissez <i>Autoriser l\'enregistrement de donnees locales</i>',
'noFigureLetterAssigned' : '(%s) Pas de lettre affectee',
'noFreeUnknownFig' : 'Pas de figure d\'Inc-Libre',
'nonArestiRolls' : 'Autoriser les rotations non-Aresti (essayer <i>41h66</i>)',
'none' : 'Aucune',
'noRules' : 'Pas de regle de verification disponible.',
'notes' : 'Notes',
'notOnFormBC' : 'Cette fonction est seulement disponible lorsque ' +
  'la forme B ou C est affichee.',
'numberInCircle' : 'Numeros de figure dans un cercle',
'ok' : 'OK',
// OLANBumpBugWarning can be removed (with asociated code in OpenAero.js)
// in 2015
'OLANBumpBugWarning' : ' a ete detecte comme retournement vertical ' +
  'de l\'axe X vers l\'axe Y.',
'OLANBumpBugWarningMulti' : ' ont ete detectes comme retournements verticaux' +
  'de l\'axe X vers l\'axe Y.',
'OLANNBugWarning' : ' a ete detecte comme un N avec  ' +
  'un changement de direction sur de l\'axe X.',
'OLANNBugWarningMulti' : ' ont ete detectes comme un N avec ' +
  'un changement de direction sur de l\'axe X.',
'OLANBugWarningFooter' : '<font color=red>Ces figures ou les  ' +
  'suivantes peuvent être dessinees differement dans Olan et OpenAero !</font>' +
  'Verifiez que la direction de sortie est correcte.<br>' +
  'Ce message ne sera plus affiche pour ce programme.',
'openaeroLanguage' : 'Syntaxe OpenAero',
'openQueueFile' : 'Ouvrir un fichier file',
'openSequence' : 'Ouvrir un programme',
'orFileDrop' : 'Ou glisser/deplacer vos fichiers ici',
'pageSpacing' : 'Espacement entre pages',
'pilot' : 'Pilote',
'pilotCardFormB' : 'Forme B',
'pilotCardFormC' : 'Forme C',
'pilotNo' : 'Pilote No.',
'pilotnumberIAC1' : "pilote",
'pilotnumberIAC2' : "Numero",
'pleaseWaitStartup' : 'Patentiez pendant le chargement d\'OpenAero',
'png' : 'PNG',
'positioning' : 'Cadre (Coef)',
'print' : 'Imprimer / Enregistrer PDF',
'printCheck' : 'Resultat de la verification',
'printDialog' : 'Options d\impression',
'printExplain' : 'Vous pouvez positionner les options d\'impression ci-dessous.<br>' +
  'Pour <i>enregistrer</i>, cliquer <strong>Imprimer</strong> puis choisir ' +
  'comme <i>destination</i> <strong>Enregistrer en PDF</strong> dans le ' +
  'Menu de votre navigateur.',
'printForms' : 'Impression des Formes…',
'printFormA' : 'Forme A',
'printFormB' : 'Forme B',
'printFormC' : 'Forme C',
'printFormGrid' : 'Tableau des figures',
'printMiniFormAonB' : 'avec mini Forme A',
'printMiniFormAonC' : 'avec mini Forme A',
'printNotes' : 'Annotations (haut de page)',
'printPilotCards' : 'Fiche pilote',
'printSaveForms' : 'Imprimer / Enregistrer image',
'printSF' : 'Numero de Super Famille',
'printString' : 'Texte du programme',
'program' : 'Programme',
'programme' : 'Programme',
'queue' : 'File/Tampon',
'queueEmpty' : 'Pas de figure a enregistrer dans la file',
'queueNotSaved' : 'Les figures de la file ont ete enregistrees',
'queueSaved' : 'Les figures de la file N\'ONT PAS ete enregistrees',
'remove' : 'Supprimer',
'removeLogo' : 'Supprimer',
'resetStyle' : 'Valeur par defaut',
'resetStyleAll' : 'Valeur par defaut (tous les parametres)',
'rollLarge' : 'Grand',
'rollMedium' : 'Moyen',
'rollPos' : ['Premiere serie de rotations','Deuxieme serie de rotations','Troisieme serie de rotations','Quatrieme serie de rotations'],
'rollSmall' : 'Petit',
'rollTextSize' : 'Taille du texte des rotations',
'rules' : 'Regles',
'rulesImported' : 'Regles importees du fichier avec succes. Nombre de lignes (hors commentaires) :',
'rulesImportTitle' : 'Importation du fichier de regles',
'rulesNotImported' : 'Pas de regles importees ! Ce n\'est peut être ' +
  'pas un fichier de regles ? Consultez ' +
  '<a href="http://code.google.com/p/open-aero/wiki/Developers#Creating_rule_checking_files"' +
  'target="_blank">Creation d\'un fichier de regles</a> pour plus d\' information.',
'runFromFile' : 'Vous avez demarre OpenAero a partir d\'un fichier.' +
  'Depuis la version 1.2.3 (fevrier 2013) ceci est deconseille ' +
  'car certains fonctions ne sont pas disponibles.<br />' +
  'Alllez a <a href="http://openaero.net">openaero.net</a>. ' +
  'OpenAero sera automatiquement installe dans votre navigateur et sera egalement ' +
  'disponible hors connection.',
'saveAsImage' : 'Enregistrer l\'image',
'saveAsLink' : 'Enregistrer en tant que lien',
'saveAsPNG' : 'Enregistrer une image PNG',
'saveAsSVG' : 'Enregistrer une image SVG',
'saveAsURL' : 'Le lien ci-dessous contient votre programme. ' +
  'Vous pouvez le copier dans un email, en faire un favori, etc...<br /> ' +
  'Faire un clic droit et "Enregistrer la cible du lien sous...".',
'saveAsURLFromApp' : 'Le lien ci-dessous contient votre programme. ' +
  'Vous pouvez le copier dans un email, en faire un favori, etc...<br /> ' +
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
'selectCategoryFirst' : 'Selectionnez la Categorie',
'selectRulesFirst' : 'Selectionnez les Regles',
'separateFigures' : 'Espacer les figures',
'sequence' : 'Programme',
'sequenceCorrect' : 'Le programme est correct',
'sequenceHasErrors' : 'Le programme est incorrect :',
'sequenceInfo' : 'Infos programme',
'sequenceTab' : 'Programme',
'sequenceTest' : 'Verification :',
'sequenceNotSavedWarning' : 'Le programme n\'a pas ete Enregistre.\n' +
  'Etes-vous sur de vouloir en ouvrir un nouveau ?',
'setMobile' : 'Version mobile',
'settings' : 'Parametrage',
'settingsClose' : 'Fermer',
'settingsTitle' : 'Parametres',
'setUpright' : ':entree ventre',
'setInverted' : ':entree dos',
'showFullLog' : 'Voir le rapport de verification complet',
'showQueue' : 'Voir la file',
'styleSettingsHeader' : 'Vous pouvez changer ici les parametres de dessin. ' +
  'Notez bien que ces changements affectent l\'apparence du programme sur ' +
  '<strong>votre<strong> version d\'OpenAero, mais pas ' +
  'celle obtenue sur d\'autres version d\'OpenAero.',
'styling' : 'Style',
'svg' : 'SVG',
'tools' : 'Outils',
// tooltip forms a sub-array
'tooltip' : {
  'connector' : 'Fait de cette figure une figure de liaison pour Inconnu-Libre',
  'curvedLine' : 'Deplace la figure et cree une ligne de liaison courbe',
  'deleteFig' : 'Supprime la figure selectionnee',
  // next two disabled. Are disabling minus button
  // entryExt' : 'Changer la ligne d\'entree',
  // exitExt' : 'Changer la ligne de sortie',
  'figEntryButton' : 'Change l\'entree ventre <=> dos',
  'figExitButton' : 'Change la sortie ventre <=> dos',
  'magMin' : 'reduit la taille de la figure',
  'magPlus' : 'Agrandit la figure',
  'moveForward' : 'Deplace la figure vers l\'avant sans ligne de liaison',
  'straightLine' : 'Deplace la figure et cree une ligne de liaison droite',
  'subSequence' : 'Demarre un sous programme a partir de la figure selectionnee',
  'switchFirstRoll' : 'Change le sens de la premiere rotation',
  'switchX' : 'Change le sens de la sortie sur l\'axe X',
  'switchY' : 'Change le sens de la sortie sur l\'axe Y'
}, // end tooltip sub-array
'unknownFileType' : 'L\'ouverture de ce fichier n\'est pas supportee dans ce navigateur.',
'unusedFigureLetters' : 'Lettre inutilisee : %s',
'upwindEntry' : 'Debuter vent de face',
'version' : 'Version : %s',
'view' : 'Affichage',
'warningPre' : '<p> Lors de la prochaine sauvegarde, cet ' +
  'avertissement \'apparaitra plus.</p>',
'warningPre123' : '<p> Le programme que vous venez d\'ouvrir a ete cree ' +
  'avec une version d\'OpenAero anterieure a 1.2.3. Verifiez que le sens le sortie de toutes ' +
  'les figures est correct.</p>',
'warningPre124' : '<p> Le programme que vous venez d\'ouvrir a ete cree ' +
  'avec une version d\'OpenAero anterieure a 1.2.3. Verifiez que le sens le sortie de tous ' +
  'les doubles retournements verticaux est correct.</p>',
'warningPre137' : '<p> Le programme que vous venez d\'ouvrir a ete cree ' +
  'avec une version d\'OpenAero anterieure a 1.3.7. Certains declenches debutes tranche ' +
  'peuvent avoir un code Aresti et un K incorrect. Ceci devrait être corrige maintenant. ' +
  'verifiez bien, si vous etes dans cette situation.</p>',
'wind' : 'V E N T',
'windIAC' : 'sens du vent',
'xBoxEntry' : 'Debuter de face',
'xBoxEntryAway' : 'Debuter de derriere',
'zipImageFilenamePattern' : 'Chaine de definition des noms des fichiers image'
// end of key-value pairs. No comma after last
};
