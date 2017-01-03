// fr.js 2016.2
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

// ***********************************************************************
// * Language files define texts for user interaction in various languages
// * This file is for French. For other languages, use the same format.
// ***********************************************************************/

// lang.xx , where xx is language code
lang.fr = {
// Edit keys and values here. Keys are the same for every language.
// A value can also be an array, such as 'rollPos', or even a sub-array
// with keys such as 'tooltip'. This must be the same in other languages.

// The first key should be the human-readable form of the language code.
// Subsequent keys are alphabetical.
'fr' : 'Français',
'about' : 'A propos',
// changed 2016.1
'aboutNewer' : 'Vous travaillez avec une version plus récente que la version courante. ' +
  'Vous disposez des dernières améliorations, mais vous pouvez rencontrer des bugs. ' +
  'Si c\'est le cas, vous aiderez à l\'amélioration d\' OpenAero en les ajoutant à ' +
  '<a href="https://github.com/OpenAero/main/issues" target="_blank">la ' +
  'liste des améliorations</a>.',
'aboutOlder' : '<font color="red">Vous travaillez avec une ancienne version. ' +
  '</font>Si vous travaillez hors connexion, vérifiez les instructions au ' +
  '<a href="https://github.com/OpenAero/main/wiki/Installation" target="_blank">' +
  'site d\'installation Wiki</a>.<br>Si vous utilisez openaero.net avec ' +
  'Google Chrome il peut être nécessaire d\'effacer le Cache d\'application. Entrez ' +
  '<strong>chrome://appcache-internals</strong> dans la barre d\'adresse ' +
  'et <strong>Supprimez</strong> toutes les entrées contenant OpenAero.',
'aboutUnknown' : 'Impossible de déterminer la derniere version. ' +
  'Vous travaillez probablement hors connexion.',
// changed 2016.1.3
'aboutText' : '<div class="divider">' +
  '<p>Cette&nbsp;version:<strong>%s</strong> &nbsp; ' +
  'Version&nbsp;courante:<strong>%s</strong></p>%s</div>' +
  '<div class="divider">' +
  '<p>OpenAero est un logiciel de conception de programmes de voltige ' +
  'qui s\'exécute dans votre navigateur web.</p><p>OpenAero est un logiciel gratuit: vous ' +
  'pouvez le redistribuer et/ou le modifier selon les termes de la ' +
  '<a href="gpl.htm">GNU General Public License</a> comme publiée par ' +
  'la \'Free Software Foundation\', soit dans la version 3 de la Licence, soit ' +
  '(à votre choix) dans une version ultérieure.</p><p>OpenAero est distribué ' +
  ' avec l\'espoir de vous être utile, mais SANS AUCUNE GARANTIE; ' +
  'sans même une garantie implicite de COMMERCIALISATION ou D\'APTITUDE ' +
  'A UNE TACHE PARTICULIERE. Voir la \'GNU General Public License\' pour ' +
  'plus de détails.</p></div><div>' +
  '<p>Pour améliorer l\'usage utilisateur, Google Analytics est utilisé pour collecter ' +
  'les données utilisées. Pour protéger votre vie privée ces données sont rendus anonymes et ' +
  'ne sont pas partagées avec d\'autres services de Google ou des tierces parties.</p></div><div>' +  
  '<p>OpenAero est conçu, écrit et maintenu par ' +
  '<strong>Ringo Massa</strong>, sur la base du code des programmes ' +
  'OLAN de <strong>Michael Golan</strong>.<br>Plusieurs personnes ont participée, comme:' +
  '<table>' +
  '<tr><td><strong>Wouter Liefting</strong></td>' +
  '<td>Codage des figures et des règles</td></tr>' +
  '<tr><td><strong>Gilles Guillemard</strong></td>' +
  '<td>Codage des figures, des règles et de parties du logiciel</td></tr>' +
  '<tr><td><strong>Christian Falck</strong></td>' +
  '<td>Codage des règles</td></tr>' +
  '</table></p></div>',
// end new
'ac' : 'Avion',
'addAllToQueue' : 'Ajouter tout à la file',
'addAllToQueueNoFigures' : 'Il n\'y a pas de figure dans ce programme, donc ' +
  'aucune figure à ajouter à la file',
'addAllToQueueWait' : 'Ajout de toutes les figures à la file. Ceci ' +
  'peut prendre du temps. Patentiez, svp…',
'addFigureText' : 'Cliquer pour ajouter figure',
'addingFigure' : 'Ajouter une nouvelle figure',
// updated 2016.1
'Additional' : 'Supplé&#173;mentaire',
//
'addToQueue' : 'Ajouter à la file',
'acreg': 'Immat d\'Avion',
'actype': 'Avion',
'aircraft' : 'Avion et Immat',
// alert forms a sub-array
'alert': {
  'family111RollMissing' : 'Famille 1.1.1 sans rotation interdite',
  'maxTwoRotationElements' : 'Combinaison d\'un maximum de deux types ' +
    'de rotation autorisée',
  'noCrossoverSpin' : 'Vrilles croisées (dos départ ventre ou ventre départ dos) interdites',
  'spinFirst' : 'Rotation interdite avant une vrille (sur la même ligne)',
  'unlinkedSameNotAllowed' : 'Combinaison de rotations de même type ' +
    'et dans le même sens interdite'
}, // end alert array
'alertBoxClose' : 'Fermer',
'alerts' : 'Alertes',
'anonymousSequences' : 'Rend anonyme les programmes en supprimant le nom du pilote, ' +
  'l\'équipe et l\'avion',
'arestiSystem' : 'Système Aresti',
'autocorrectRoll' : 'Tonneau d\'autocorrection',
'blackWhite' : 'Noir et Blanc',
'boxOuts' : 'Sorties de Box',
'browserDetect' : 'Votre navigateur est identifié en tant que: %s.<br>',
'cancel' : 'Annuler',
'cancelPrint' : 'Annuler',
'cancelSave' : 'Annuler',
'category' : 'Catégorie',
// new 2016.1.5
'changedFigureK' : 'Le K Aresti normal de la figure %s a été changé ' +
  'selon le réglement %s',
'changedFigureKMulti' : 'Les K Aresti normaux des figures %s ont été ' +
  'changés selon le réglement %s',
'changeStyle' : 'Changer',
// checkAlert forms a sub-array
'checkAlert' : {
  'maxperfig' : 'Pas plus de %s %s par figure',
  'minperfig' : 'Au moins %s %s par figure',
  'max'       : 'Pas plus de %s %s autorisé(es)',
  'min'       : 'Au moins %s %s obligatoire(s)',
  'repeat'    : 'Pas plus de %s répétition(s) de %s autorisée(s)',
  'totrepeat' : 'Pas plus de %s répétition(s) de répétitions de ' +
    '%s autorisée(s)',
  'figmax'    : 'Pas plus de %s %s autorisé(es)',
  'figmin'    : 'Au moins %s %s obligatoire(s)',
  'figrepeat' : 'Pas plus de %s répétition(s) de %s autorisée(s)',
  'notAllowed': '%s n\'est pas autorisé pour ce programme'
}, // end checkAlert
'checkingRules' : 'Règles de vérification',
'checkMulti' : 'Vérification de plusieurs programmes',
'checkMultiClose' : 'Fermer',
'checkMultiCounter' : 'Vérification du programme %s of %s<br>%s<br>Ceci peut ' +
  'prendre du temps. Patientez, svp...',
'checkMultipleSeq' : 'Vérification d\'un groupe de programmes',
// changed 2016.1.1
'checkMultiUseReference' : 'Utilisez programme de référence pour ' +
  '(In)connu-libre',
//
'checkMultiWait' : 'Vérification des programmes %s .<br>Ceci peut ' +
  'prendre du temps. Patientez, svp...',
// changed 2016.1.3
'checkSequence' : 'Vérifier le programme',
'checkSequenceLog' : 'Voir le détail',
'checkSequenceOK' : 'OK',
'checkSequenceResult' : 'Résultat de vérification',
'checkSequences' : 'Vérification des programmes',
'chooseFiles' : 'Choisir les fichiers ici :',
'chooseFilesPrint' : 'Choisir les fichiers ici :',
'chooseLogo' : 'Choisir un logo',
'class' : 'Type',
'clearPositioning' : 'Effacer le positionnement',
'clearPositioningConfirm' : 'Ceci supprimera le positionnement des figures.' +
  'Voulez-vous continuer ?',
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
'confirmLeave' : 'Vous quittez OpenAero. Les programmes non sauvegardés seront perdus.',
'contest' : 'Compétition',
'convertingFailed' : 'La conversion en image PNG a échoué.<br>Si vous souhaitez' +
  'que cette erreur soit transmise aux développeurs d\'OpenAero, cliquez sur le ' +
  'lien ci-dessous :<br><a href="mailto:openaero.devel@gmail.com?subject=' +
  'BUG:SVG_to_PNG_conversion&body=%s" target="_blank">Email bug report</a>',
'convertingToPng' : 'Conversion en image PNG.<br>Ceci peut prendre' +
  'du temps. Patientez, svp...',
'convertingTitle' : 'Conversion en cours...',
'date' : 'Date',
'demo' : 'Exemples',
'desktopVersion' : 'Version ordinateur',
'disqualified' : 'Disqualifié',
'download' : 'Télécharger',
// changed 2016.3.2
'downloadHTML5' : 'Vous pouvez enregistrer en choisissant un nom ' +
  'et en cliquant <i>Enregistrer fichier</i> ci-dessous.' +
  'En fonction de votre navigateur: '+
  '<ul><li>' +
  'Le fichier sera enregistré dans votre répertoire Téléchargement, ou' +
  '</li><li>' +
  'Une fenêtre où vous pourrez choisir le répertoire apparaîtra' +
  '</li></ul>' +
  '<p class="chromeHint">Chrome hint: Par défaut, le navigateur Chrome sauvegardera ' +
  'le fichier dans votre répertoire Téléchargement. Pour changer ceci, allez ' +
  'dans paramétrage <b>avancé</b>  (accessible via le bouton Chrome ' +
  '<i class="material-icons md-18 inText">more_vert</i>) ' +
  'et cochez la case "Demander où sauvegarder ..."</p>',
//
'downloadLegacy' : 'Vous pouvez enregistrer en choisissant un nom ' +
  'et/ou faire un clic droit sur <i>Enregistrer</i> ci-dessous ' +
  'et choisir "Enregistrer la cible du lien sous... " ou "Copier ' +
  'l\'adresse du lien".<br>Une fenêtre ou vous pourrez ' +
  'choisir le répertoire apparaîtra.',
'downwind' : 'vent arrière',
'downwindEntry' : 'Débuter vent arrière',
'drawingStyles' : 'Paramètres de dessin',
'drawingStylesExplain' : '<p>Tous les paramètres du dessin peuvent être changés ici. ' +
  'Exemples : <strong>pos</strong>=ligne positive, ' +
  '<strong>neg</strong>=ligne negative, <strong>rollText</strong>=texte' +
  ' de la rotation (e.g. 2x8).</p>',
'dropFigureHere' : 'Déplace Figure ici',
'editingFigure' : 'Edition figure',
'emailHeader' : 'Cliquez sur le lien ci-dessous pour ouvrir le programme avec OpenAero. ' +
  'Ou, ça ne fonctionne pas, copiez le et collez le (intégralement!) ' +
  'dans la barre d\'adresse de votre navigateur.',
'emailSequence' : 'Envoyer par email le programme',
'END' : 'FIN',
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
'figureEditor' : 'Editeur de figure',
'figureK' : 'Figure K',
// new 2016.1.3
'figureLetterNotAllowed' : '(%s) La lettre d\'identification %s n\'est pas autorisée',
'figurePositioning' : 'Positionnement de figure',
'figureQueue' : 'File / Tampon',
'figureString' : 'Texte du figure',
'file' : 'Fichier',
'fileName' : 'Nom du fichier',
'finalizeSequence' : 'Finaliser le programme et quitter l\'assembleur',
'flightNr' : 'Vol N°',
'flipYAxis' : 'Changer d\'axe Y',
'forElement' : ' pour élément ',
'formA' : 'Forme A',
'formB' : 'Forme B',
'formC' : 'Forme C',
'formL' : 'Forme L',
'formR' : 'Forme R',
'freeUnknownFig' : 'Lettre ',
'freeUnknownAdditional' : 'Supplémentaire Inconnu-Libre',
'FUconfirmExit' : 'L\'assembleur d\'inconnu-libre peut ne pas redémarrer ' +
  'correctement dans cette situation sans avoir à ré-ouvrir le programme. ' +
  'Confirmer que vous souhaitez quitter l\'assembleur d\'inconnu-libre.',
'fuDesigner' : 'Assembleur d\'inconnu-libre',
'fuFiguresTab' : 'Figures',
// changed 2016.1.3
'FUfigOptionsDisabled' : 'Certaines options sont invalidées pour l\'inconnu-libre (figures avec lettres)',
'FUDesignletterMulti' : 'Lettre d\'inconnu-libre %s utilisée plusieurs fois. ' +
  'Impossible de lancer l\'assembleur d\'inconnu-libre.',
'FUDesignMissingLetters' : 'Lettre(s) d\'inconnu-libre <strong>%s</strong> ' +
  'absente(s). Impossible de lancer l\'assembleur d\'inconnu-libre',
'FUDesignNotFreeUnknown' : 'Les règles du programme ne correspondent pas à un ' +
  'inconnu-libre. Impossible de lancer l\'assembleur d\'inconnu-libre.',
'FUerrorsDetected' : 'Erreur(s) détectée(s) dans le programme, voir ci-dessous :',
'FUfinalizing' : 'Assemblage du programme. Ceci peut prendre du temps. ' +
  'Patientez, svp...',
'FUletterMulti' : '(%s) lettre(s) du figure %s utilisée(s) plusieurs fois',
'FUmultipleSubsequences' : 'Le programme a %s sous-parties. ' +
  'Il ne devrait y en avoir qu\'un.',
'fuSelectFigureFirst' : 'Cliquer sur une figure d\'une sous-partie ' +
  'pour l\'éditer. Vous pouvez glisser/déplacer les figures ou les figures ' +
  'de liaison depuis l\'onglet <i>Figures</i> vers le(s) sous-partie(s).',
'FUstarting' : 'lancement de l\'assembleur d\'inconnu-libre. Ceci peut prendre du temps. ' +
  'Patientez, svp...',
'FUstartOnLoad' : 'Le programme est identifié comme une liste de figures d\'Inconnu-Libre. ' +
  'Voulez-vous lancer l\'assembleur d\'inconnu-libre?',
'FUexitEntryMatch' : 'Certaines attitudes d\'entrée / sortie de figures sont incompatibles',
//
'gaps' : 'Espaces',
'general' : 'Général',
'getChrome' : 'Pour une utilisation optimale d\OpenAero, téléchargez la ' +
  'dernière version du navigateur <a href="https://www.google.com/intl/en/chrome/browser/">' +
  'Google Chrome</a>.',
'glider' : 'Planeur',
// new 2017.1
'gridAdditionals' : 'Informations requises',
'gridInfo' : 'Info tableau',
'gridNegEntry' : 'Entrée dos',
'gridNegExit' : 'Sortie dos',
'gridPosEntry' : 'Entrée ventre',
'gridPosExit' : 'Sortie ventre',
'gridSpeed' : 'Vitesse',
// changed 2017.1
'gridView' : 'Le choix du nombre de colonnes de la vue en tableau est dans Vue en tableau',
'harmony' : 'Harmonie',
'help' : 'Aide',
'hideIllegalFigures' : 'Masquer les figures non autorisées',
'iacForms' : 'Formes A/B/C au style IAC',
'illegalAtEnd' : 'Figure illégale à la fin',
'illegalBefore' : 'Figure illégale avant la figure',
'illegalFig' : ' est interdit, essayez ',
'imageFormat' : 'Format d\'image',
'imageHeight' : 'Hauteur',
'imageSize' : 'Taille d\'image',
'imageWidth' : 'Largeur',
'importRulesFile' : 'Importer un fichier de règles',
'insertions' : 'Insertions',
'installation' : 'Installation',
// changed 2016.1.3
'installChromeApp' : '<p>OpenAero est maintenant installé avec ce ' +
  'navigateur et les mises à jour seront automatiques. Il est disponible ' +
  'en ligne,mais aussi hors connexion à <a href="http://%1\$s" target="_blank">' +
  '%1\$s</a>.</p>' +
  '<p>Un <a href="manual.html" target="_blank">Mode d\'emploi</a> complet ' +
  'est disponible. S\'il vous plait, prenez le temps de le lire !</p>' +
  '<p>Vous pouvez installer OpenAero en tant qu\'Application Chrome. Ceci ' +
  'vous procure:<ul><li>Un enregistrement des fichiers amélioré</li><li>Le lancement ' +
  'd\'OpenAero à partir du bureau sans ouvrir votre navigateur Chrome </li></ul>' +
  'Voulez vous installer cette application ? si vous choisissez <i>Non</i>, cette question ' +
  'ne vous sera plus posée, mais vous pourrez l\'installer par le menu <i>Outils</i> ' +
  'à tout moment.</p>','installChromeAppComplete' : 'L\'application Chrome a été installée. Vous pouvez y ' +
  'accéder en ouvrant une nouvelle rubrique dans Chrome. Par un clic droit ' +
  'vous pouvez ajouter l\'application sur votre bureau.',
'installChromeAppTitle' : 'Installer l\'application Chrome',
// new 2016.1.3
'installed' : '<p>OpenAero est maintenant installé avec ce ' +
  'navigateur et les mises à jour seront automatiques. Il est disponible ' +
  'en ligne,mais aussi hors connexion à <a href="http://%1\$s" target="_blank">' +
  '%1\$s</a>. Vous pouvez ajouter un raccourci vers cette adresse sur votre ' +
  'bureau pour un accès direct.</p>' +
  '<p>Un <a href="manual.html" target="_blank">Mode d\'emploi</a> complet ' +
  'est disponible. S\'il vous plait, prenez le temps de le lire !</p>',
'interruptions' : 'Interruptions',
'inverseForms' : 'Inverse vidéo (blanc sur noir)',
'iOScancelSave' : 'Annuler',
'iOSprintExplain' : 'Selectionnez ce que vous voulez imprimer ou sauvegarder ' +
  'puis cliquez <strong>Enregistrer une image PNG</strong>',
'iOSsaveFile' : 'Voir l\'image du programme',
// changed 2016.3.2
'iOSsaveFileMessage' : '<p>En cliquant sur le bouton <i>Enregistrer</i> ' +
  'une nouvelle fenêtre ou un onglet s\'ouvrira. Vous ' +
  'pouvez alors cliquer sur le bouton <span class="iOSsaveIcon"></span> pour ' +
  'imprimer ou appuyez et maintenez a l\'image pour enregistrer l\'image.</p>' +
  '<p>Astuce : Si la qualité de l\'image est insuffisante, vous pouvez augmenter ' +
  'la résolution dans la boite de dialogue Imprimer de "Enregistrement d\'une image en PNG ou SVG". ' +
  'Si vous obtenez une page blanche, essayer de sauvegarder chaque programme ' +
  'individuellement.',
'iOSsaveFileTitle' : 'Enregistrer le fichier',
'judgesName' : 'Nom des Juges',
'language' : 'Langue',
// new 2017.1
'library' : 'Bibliothèque',
'loadNewVersion' : 'Une nouvelle version d\'OpenAero est disponible. La charger ?',
'loadNewVersionNoCookies' : 'Une nouvelle version d\'OpenAero est disponible. La charger ?' +
  'Si un programme est ouvert, il sera effacé.',
'loadNewVersionTitle' : 'Nouvelle version',
'location' : 'Lieu',
// new 2016.1.3
'locked' : 'Ce programme est verrouillé. Pour le déverrouiller, cliquez sur <i>Déverrouiller</i> ' +
  'dans le menu Programme',
'lockSequence' : 'Verrouiller',
//
'logo' : 'Logo',
// new 2016.3
'logoChooserCancel' : 'Annuler',
'logoChooserTitle' : 'Choisir un logo',
'logoExplain' : 'Chargez votre logo en cliquant sur parcourir..., ' +
  'ou sélectionnez un des logos déjà affiches.',
'manual' : 'Manuel OpenAero',
'maxAdditionals' : 'Maximum de figures supplémentaires permis : %s',
'maxScaling' : 'Agrandissement Max des petits programmes',
'missedSlot' : 'Hors créneau',
// changed 2017.1
'missingInfo' : 'Des informations essentielles du programme manquent.</br>' +
  'Etes-vous sur de vouloir enregistrer ou imprimer le fichier sans celles-ci :',
'missingInfoTitle' : 'Informations du programme manquantes',
'mobileVersion' : 'Version mobile',
'multiNoSequence' : 'Certains fichiers ne sont pas des programmes ' + 
  'OpenAero ou OLAN. Ils n\'ont pas été ajoutés à la liste', 
'multiOverrideRules' : 'Au lieu des règles de chaque programme, utiliser les règles :',
'multiActiveLogo' : 'Utiliser le logo du programme en cours', 
'multiRemoveLogo' : 'Supprimer le logo', 
'multiOriginalLogo' : 'Utiliser le logo d\'origine',
'newCopySubsequence' : 'Créer / Copier sous-partie',
/** removed in 2016.1.3
'newReplacementsABC' : 'Nouveau format pour les formes A/B/C',
*/
'newTurnPerspective' : 'Vraie perspective pour les virages ' +
  '<font color=red>EXPERIMENTAL, A EVITER EN COMPETITION INTERNATIONALE!' +
  '</font>',
'noCookies' : 'Il semble que les cookies sont invalidés dans votre navigateur.' +
  'Certaines fonctions d\'OpenAero ne marcheront pas.<br>' +
  'Pour autoriser les cookies dans Chrome, copier l\'url ' +
  'suivante dans la barre d\'adresse :<br />' +
  '<strong>chrome://chrome/settings/content</strong><br />' +
  'et choisissez <i>Autoriser l\'enregistrement de données locales</i>',
'noFigureLetterAssigned' : '(%s) Pas de lettre affectée',
// changed 2016.1.3
'noFreeUnknownFig' : 'Pas de lettre',
'nonArestiRolls' : 'Autoriser les rotations et combinaisons ' +
  'non-Aresti (essayer <i>41h4,f,4 66</i>)',
'none' : 'Aucune',
// new 2016.1.3
'noRollAllowed' : 'Rotation interdite par l\'Aresti',
'noRules' : 'Pas de règle de vérification disponible.',
'notes' : 'Notes',
'notOnFormBC' : 'Cette fonction est seulement disponible lorsque ' +
  'la forme B ou C est affichée.',
'notSequenceFile' : 'Ce n\'est pas le fichier d\'un programme ' +
  'OpenAero ou OLAN',
'number' : 'Numéro',
//
'numberInCircle' : 'Numéros de figure dans un cercle',
'ok' : 'OK',
'OLANBumpBugWarning' : ' a été détecté comme étant un comme retournement vertical ' +
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
'oldBrowser' : 'Votre navigateur (%s) ne peut pas faire tourner OpenAero.<br>',
'openaeroLanguage' : 'Syntaxe OpenAero',
'openQueueFile' : 'Ouvrir un fichier file',
'openSequence' : 'Ouvrir un programme',
// changed 2016.1.3
'openSequenceLink' : 'Ouvrir le lien vers un programme',
'openSequenceLinkCancel' : 'Annuler',
'openSequenceLinkError' : '<p>Il y a eu une erreur à l\'ouverture du programme ' +
  'pointé par le lien. Voici le lien que vous avez fourni:<br>%s</p><p>Vérifiez que vous ' +
  'avez copié <strong>l\'intégralité</strong> du lien',
'openSequenceLinkMessage' : 'Pour ouvrir le programme qui vous a été indiqué ' +
  'par un lien (par exemple, par email), copiez le intégralement et ' +
  'placez le dans l\'emplacement ci-dessous :',
//
'openSequenceLinkOpen' : 'Ouvrir',
'openSequenceLinkTitle' : 'Ouvrir le programme à partir du lien',
//
'orFileDrop' : 'Ou glisser/déplacer vos fichiers ici',
'orFileDropPrint' : 'Ou glisser/déplacer vos fichiers ici',
// new 2016.1.1
'otherNote' : 'Autre(noter...)',
'pageSpacing' : 'Espacement entre pages',
'pilot' : 'Pilote',
'pilotCardFormB' : 'Forme B',
'pilotCardFormC' : 'Forme C',
'pilotID' : 'Pilote ID',
'pilotNo' : 'Pilote N°.',
'pilotnumberIAC1' : "pilote",
'pilotnumberIAC2' : "Numéro",
'pleaseWaitStartup' : 'Patentiez pendant le chargement d\'OpenAero',
'png' : 'PNG',
'positionClearAuto' : 'Positionne Automatiquement les figures nouvelles/modifiées ' +
  'espacées les unes des autres',
'positioning' : 'Cadre(Coef)',
'powered' : 'Avion',
'print' : 'Imprimer / Enregistrer PDF',
'printCheck' : 'Résultat de la vérification',
'printDialog' : 'Options d\'impression',
'printExplain' : 'Vous pouvez positionner les options d\'impression ci-dessous.<br>' +
  'Pour <i>enregistrer</i> PDF, cliquer <strong>Imprimer</strong> puis choisir ' +
  'comme <i>destination</i> <strong>Enregistrer en PDF</strong> dans le ' +
  'Menu de votre navigateur.',
'printForms' : 'Impression des Formes...',
'printFormA' : 'Forme A',
'printFormB' : 'Forme B',
'printFormC' : 'Forme C',
'printFormGrid' : 'Tableau des figures',
'printFormL' : 'Forme L',
'printFormR' : 'Forme R',
// new 2016.3.2
'printMargins' : 'Marges d\'impression',
'printMiniFormAonB' : 'avec mini Forme A',
'printMiniFormAonC' : 'avec mini Forme A',
'printMulti' : 'Impression de plusieurs programmes',
'printMultiClose' : 'Fermer',
'printMultiOverrideRules' : 'Utilise les régles de Programme plutôt que ' +
  'celles contenues avec le programme: ',
'printMultipleSeq' : 'Impression de plusieurs programmes',
'printMultiWait' : 'Impression de %s programmes.<br>Ceci peut ' +
  'prendre du temps. Patienter, svp...',
'printNotes' : 'Annotations (haut de page)',
'printPilotCards' : 'Fiche pilote',
'printSaveForms' : 'Imprimer / Enregistrer image',
'printSF' : 'Numéro de Super Famille',
'printString' : 'Texte du programme',
'program' : 'Programme',
// new 2017.1
'programme' : 'Programme',
'proposalsCreate' : 'Créer de nouvelles propositions',
'proposalsCreateGroups' : 'Créer des groupes',
'proposalsDialogClose' : 'Fermer',
'proposalsExplain' : 'Vous pouvez utiliser cette fenêtre pour une génération aléatoire ' +
  'de propositions d\'assemblage de figures à partir du programme en cours. Le ' +
  'nombre de figures des propositions est identique au nombre de colonnes sélectionnées ' +
  'pour la vue en tableau. Les textes correspondants aux programmes générés peuvent ' +
  'être copiés dans une autre fenêtre OpenAero, ou tous transférés dans la vue en tableau.',
'proposalsFigureCount' : 'Figures dans chaque proposition',
'proposalsIncomplete' : 'la dernière proposition est incompléte car il n\'y a pas ' +
  'assez de figures dans le programme en cours',
'proposalsTitle' : 'Créer des propositions d\'assemblage de groupes de figures',
'proposalsToGrid' : 'Transférer dans la vue en tableau',
'queue' : 'File/Tampon',
'queueColumns' : 'Colonnes',
'queueEmpty' : 'Pas de figure à enregistrer dans la file',
'queueLabel' : 'File/Tampon',
//
'queueNotSaved' : 'Les figures de la file ont été enregistrées',
'queueSaved' : 'Les figures de la file N\'ONT PAS été enregistrées',
// changed 2016.1.3
'referenceFigureDifferent' : 'La figure %s n\'est pas dans le programme de référence',
'referenceFigureExitOpp' : 'La figure %s devrait sortir en sens inverse ' +
	'de l\'entrée',
'referenceFigureExitSame' : 'La figure %s devrait sortir dans le même ' +
  'sens que l\'entrée',
'referenceSequence' : 'Programme de référence',
'referenceSequenceClose' : 'Fermer',
'referenceSequenceExplain' : 'Dans l\'emplacement ci-dessous, vous pouvez ' +
  'entrer le texte de référence des figures obligatoires pour la ' +
  'construction d\'un programme, tel qu\'un programme d\'Inconnu-Libre. ' +
  'La vérification des lettres, des codes Aresti et des directions ' +
  'relatives d\'entrée / sortie des figures seront alors effectués.',
//
// new 2016.1.3
'referenceSequenceFixed' : 'Ce programme de référence ne pas être changé ' +
  'car il est lié aux règles de vérification du programme en cours.',
// changed 2016.1.3
'referenceSequenceTitle' : 'Figures de référence pour les ' +
  'programmes d\'(In)connu-Libre',
//
'remove' : 'Supprimer',
'removeLogo' : 'Supprimer le logo',
'resetStyle' : 'Valeur par défaut',
'resetStyleAll' : 'Valeur par défaut (tous les paramètres)',
'restoreDefaultSettings' : 'Restaurer toutes les valeurs par defaut ' +
  'du paramétrage',
'restoreDefaultSettingsConfirm' : 'Toutes le paramétrage d\'Openaero va être ' +
  'remis à sa valeur d\'origine. Voulez vous continuer?',
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
  'Allez à <a href="http://openaero.net">openaero.net</a>. ' +
  'OpenAero sera automatiquement installe dans votre navigateur et sera également ' +
  'disponible hors connexion.',
'sameAsBefore' : 'Comme avant',
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
'sequenceCheckLog' : 'Rapport de vérification du programme',
'sequenceCorrect' : 'Le programme est correct',
'sequenceHasErrors' : 'Le programme est incorrect :',
'sequenceInfo' : 'Programme',
// nouveau 1.4.2
'sequenceShort' : 'Prog.',
//
'sequenceTab' : 'Programme',
'sequenceTest' : 'Vérification :',
'sequenceNotSavedWarning' : 'Le programme n\'a pas été enregistré.\n' +
  'Etes-vous sur de vouloir en ouvrir un nouveau ?',
'setMobile' : 'Version mobile',
'settings' : 'Paramétrage',
'settingsClose' : 'Fermer',
'settingsTitle' : 'Paramètres',
'setUpright' : 'entrée ventre',
'setInverted' : 'entrée dos',
'showFileName' : 'Ajouter le nom du fichier',
'showFullLog' : 'Voir le rapport de vérification complet',
// new 2016.1
'showHandles' : 'Montre les points d\'édition (cercles bleu) quand ' +
  'une figure est sélectionnée',
'showQueue' : 'Voir la file',
'signature' : 'Signature',
//
'styleSettingsHeader' : 'Vous pouvez changer ici les paramètres de dessin. ' +
  'Notez bien que ces changements affectent l\'apparence du programme sur ' +
  '<strong>votre<strong> version d\'OpenAero, mais pas ' +
  'celle obtenue sur d\'autres versions d\'OpenAero.',
'styling' : 'Style',
'subSequenceDirection' : 'Débuter la sous partie :',
'svg' : 'SVG',
// new 2016.1
'switchFigures' : 'Figures',
'switchQueue' : 'File',
'team' : 'Equipe',
'tooHigh' : 'Trop Haut',
'tooLow' : 'Trop Bas',
'tools' : 'Outils',
// tooltip forms a sub-array
'tooltip' : {
  'curvedLine' : 'Déplace la figure et crée une ligne de liaison courbe',
  'deleteFig' : 'Supprime la figure sélectionnée',
  // next two disabled. Are disabling minus button
  // entryExt' : 'Changer la ligne d\'entrée',
  // exitExt' : 'Changer la ligne de sortie',
  'figEntryButton' : 'Change l\'entrée ventre <=> dos',
  'figExitButton' : 'Change la sortie ventre <=> dos',
  // new 2016.2
  'flipYAxis' : 'Changer d\'axe Y',
  'magMin' : 'réduit la taille de la figure',
  'magPlus' : 'Agrandit la figure',
  'moveForward' : 'Déplace la figure vers l\'avant sans ligne de liaison',
  'straightLine' : 'Déplace la figure et crée une ligne de liaison droite',
  'subSequence' : 'Débute une sous partie à partir de la figure sélectionnée',
  'switchFirstRoll' : 'Change le sens de la première rotation',
  'switchX' : 'Change le sens de la sortie sur l\'axe X',
  'switchY' : 'Change le sens de la sortie sur l\'axe Y'
}, // end tooltip sub-array
'totalK' : 'K total',
// new 2016.1.1
'trgViolation' : 'Ech. Incorrect',
'unknownFileType' : 'L\'ouverture de ce fichier n\'est pas supportée dans ce navigateur.',
'unlockSequence' : 'Déverrouiller',
'unusedFigureLetters' : 'Lettre(s) inutilisée(s) : %s',
'update' : 'Mise à jour',
'upwind' : 'vent de face',
'upwindEntry' : 'Débuter vent de face',
'version' : 'Version : %s',
'versionNew' : '<strong>OpenAero a été mis à jour de la version %s à %s' +
  '</strong><br>Nouvelles fonctionnalités:<ul>%s' +
  '<li>Autres corrections et améliorations (lisez <a id="changelog">' +
  'changelog.txt</a> si intéressé)</li>' +
  '</ul>' +
  'Ceci peut prendre quelques instants à charger.',
'view' : 'Affichage',
// new 2016.2
'warningNewerVersion' : '<p>Ce programme a été créé avec une version ' +
  'd\'OpenAero plus récente que celle que vous utilisez actuellement. ' +
  'Il utilise peut être de nouvelles fonctions. Vérifiez ' +
  'attentivement que le programme est correct et correctement dessiné.</p>',
// changed 2016.1.3
'warningPre' : '<p> Lors de la prochaine sauvegarde, cet ' +
  'avertissement n\'apparaîtra plus.</p>',
'warningPre123' : '<p> Le programme que vous venez d\'ouvrir a été créé ' +
  'avec une version d\'OpenAero antérieure à 1.2.3. Vérifiez que le sens de sortie de toutes ' +
  'les figures est correct.</p>',
'warningPre124' : '<p> Le programme que vous venez d\'ouvrir a été créé ' +
  'avec une version d\'OpenAero antérieure à 1.2.3. Vérifiez que le sens de sortie de tous ' +
  'les doubles retournements verticaux est correct.</p>',
'warningPre137' : '<p> Le programme que vous venez d\'ouvrir a été créé ' +
  'avec une version d\'OpenAero antérieure à 1.3.7. Certains déclenchés débutés tranche ' +
  'peuvent avoir un code Aresti et un K incorrect. Ceci devrait être corrigé maintenant. ' +
  'vérifiez bien, si vous êtes dans cette situation.</p>',
// new 2016.1
'warningPre20161' : '<p>Le fichier que vous venez d\'ouvrir a été créé avec une ' +
  'version d\'OpenAero antérieure à 2016.1 et la figure suivante a été détecté :<br>' +
  'Un double retournement vertical avec un grand rayon, un nombre impair de ' +
  'quarts de rotation dans la première ligne et une rotation dans la seconde.<br>' +
  'Ce type de figure était traitée incorrectement dans les anciennes versions d\'OpenAero. ' +
  'Vérifiez bien que toutes les orientations (sens) de cette figure sont correctes.</p>',
// new 2016.1.3
'warningPre201611' : '<p>Le fichier que vous venez d\'ouvrir a été créé avec ' +
  'une version d\'OpenAero antérieure à 2016.1.1. Il a été ouvert avec la vue ' +
  '"Tableau des figures" et contient une ou plusieurs figures avec des ' +
  'changements d\'axes (symboles ^ ou >). Ces figures étaient dessinées ' +
  'différement par les anciennes versions d\'OpenAero. Vérifiez bien que les ' +
  'sens relatifs d\'entrée/sortie sont corrects (même sens ou sens opposé).',
'wind' : 'V E N T  ',
'windIAC' : 'sens du vent',
'wingRocks' : 'Battem. d\'Ailes',
'xBox' : 'de face',
'xBoxAway' : 'de derrière',
'xBoxEntry' : 'Débuter de face',
'xBoxEntryAway' : 'Débuter de derrière',
'zipImageFilenamePattern' : 'Chaîne de définition des noms des fichiers image',
'zoom' : 'Zoom'
// end of key-value pairs. No comma after last
};
