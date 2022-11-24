/* Set up the rulesWorker. This is not done through a separate Worker
 * script as this will not work when using OpenAero from a local file.
 * 
 * The rulesWorker handles all rule loading and checking in a separate
 * thread. Within the rulesWorker only one thread will run at a time,
 * so there are no concurrent operations within the Worker.
 */

var blobURL = URL.createObjectURL (new Blob (['(',

function(){

/** Worker code starts here */

// define worker globals
var
	activeForm,
	alertMsgs = [],
	alertMsgRules = {},
	language,
	fig,
	arestiToFig,
	referenceSequence = {},
	rollFig,
	rules,
	activeRules = false,
	rulesKFigures = {},
	regexRulesAdditionals = /^(connectors|additionals)=([0-9]+)\/([0-9]+)/,
	regexUnlinkedRolls = /[,; ](9\.[1-8]\.[0-9.]*;9\.[1-8]\.)|(9\.(9|10)\.[0-9.]*;9\.(9|10))|(9\.1[12]\.[0-9.]*;9\.1[12])/,
	superFamilies,
	scriptSrc,
	userText;

// seqCheckAvail indicates if sequence checking is available for a
// rule/cat/seq combination
var
    seqCheckAvail = {},
    // variables used for checking sequence validity
    checkConv = [],        // conversions
    checkAllowRegex = [],  // regexes for allowed figures
    checkAllowCatId = [],  // Catalogue Numbers for allowed figures
    checkCatGroup = [],
    checkFigGroup = [],
    checkRule = [],
    defRules = [],      // default rules in for rule/cat/seq to be applied to a figure check
    excludeRules = [],     // default rules excluded for this figure check
    activeRules = false,   // Are rules active?  If so, is object {description: xxx, logo: xxx}
    figureLetters = '',    // Letters that can be assigned to individual figures
    additionalFig = {'max': 0, 'totalK': 0},    // Additional figures, max and K
    ruleSuperFamily = [],  // Array of rules for determining figure SF
    ruleSeqCheck = [];     // rules for checking complete OpenAero seq string


// handle message events
self.onmessage = function (e) {
	switch (e.data.action) {
		case 'activeForm':
			activeForm = e.data.form;
			break;
		case 'checkAlert':
			checkAlert (
				e.data.value,
				e.data.type,
				e.data.figNr,
				e.data.rule
			);
			// send alertMessages to main script for processing
			var a = alertMsgs.pop();
			postMessage ({
				runFunction: 'addAlertsToAlertMsgs',
				arguments: [{
					alertMsgs: [a],
					alertMsgRules: alertMsgRules
				}]
			});
			break;
		case 'initialize':
			arestiToFig = e.data.arestiToFig;
			fig = e.data.fig;
			rollFig = e.data.rollFig;
			rules = e.data.rules;
			scriptSrc = e.data.scriptSrc;
			superFamilies = e.data.superFamilies;
			parseRules ();
			break;
		case 'userText':
			language = e.data.language;
			userText = e.data.userText;
			break;
		case 'referenceSequence':
			referenceSequence = e.data.referenceSequence;
			break;
		case 'sportingClass':
			sportingClass = e.data.class;
			break;
		case 'loadRules':
			loadRules (e.data.ruleName, e.data.catName, e.data.programName);
			break;
		case 'loadedRulesFile':
			loadedRulesFile (e.data.lines);
			break;
		case 'unloadRules':
			unloadRules();
			break;
		case 'checkRules':
			checkRules (
				e.data.callbackId,
				e.data.activeSequenceText,
				e.data.figures,
				e.data.figCheckLine,
				e.data.nonArestiRolls,
				e.data.multi);
			break;
		case false:
			postMessage ({callbackId: e.data.callbackId});
			break;
	}
}

/*! sprintf-js | Alexandru Marasteanu <hello@alexei.ro> (http://alexei.ro/) | BSD-3-Clause */

!function(a){function b(){var a=arguments[0],c=b.cache;return c[a]&&c.hasOwnProperty(a)||(c[a]=b.parse(a)),b.format.call(null,c[a],arguments)}function c(a){return Object.prototype.toString.call(a).slice(8,-1).toLowerCase()}function d(a,b){return Array(b+1).join(a)}var e={not_string:/[^s]/,number:/[dief]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fiosuxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[\+\-]/};b.format=function(a,f){var g,h,i,j,k,l,m,n=1,o=a.length,p="",q=[],r=!0,s="";for(h=0;o>h;h++)if(p=c(a[h]),"string"===p)q[q.length]=a[h];else if("array"===p){if(j=a[h],j[2])for(g=f[n],i=0;i<j[2].length;i++){if(!g.hasOwnProperty(j[2][i]))throw new Error(b("[sprintf] property '%s' does not exist",j[2][i]));g=g[j[2][i]]}else g=j[1]?f[j[1]]:f[n++];if("function"==c(g)&&(g=g()),e.not_string.test(j[8])&&"number"!=c(g)&&isNaN(g))throw new TypeError(b("[sprintf] expecting number but found %s",c(g)));switch(e.number.test(j[8])&&(r=g>=0),j[8]){case"b":g=g.toString(2);break;case"c":g=String.fromCharCode(g);break;case"d":case"i":g=parseInt(g,10);break;case"e":g=j[7]?g.toExponential(j[7]):g.toExponential();break;case"f":g=j[7]?parseFloat(g).toFixed(j[7]):parseFloat(g);break;case"o":g=g.toString(8);break;case"s":g=(g=String(g))&&j[7]?g.substring(0,j[7]):g;break;case"u":g>>>=0;break;case"x":g=g.toString(16);break;case"X":g=g.toString(16).toUpperCase()}!e.number.test(j[8])||r&&!j[3]?s="":(s=r?"+":"-",g=g.toString().replace(e.sign,"")),l=j[4]?"0"===j[4]?"0":j[4].charAt(1):" ",m=j[6]-(s+g).length,k=j[6]&&m>0?d(l,m):"",q[q.length]=j[5]?s+g+k:"0"===l?s+k+g:k+s+g}return q.join("")},b.cache={},b.parse=function(a){for(var b=a,c=[],d=[],f=0;b;){if(null!==(c=e.text.exec(b)))d[d.length]=c[0];else if(null!==(c=e.modulo.exec(b)))d[d.length]="%";else{if(null===(c=e.placeholder.exec(b)))throw new SyntaxError("[sprintf] unexpected placeholder");if(c[2]){f|=1;var g=[],h=c[2],i=[];if(null===(i=e.key.exec(h)))throw new SyntaxError("[sprintf] failed to parse named argument key");for(g[g.length]=i[1];""!==(h=h.substring(i[0].length));)if(null!==(i=e.key_access.exec(h)))g[g.length]=i[1];else{if(null===(i=e.index_access.exec(h)))throw new SyntaxError("[sprintf] failed to parse named argument key");g[g.length]=i[1]}c[2]=g}else f|=2;if(3===f)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");d[d.length]=c}b=b.substring(c[0].length)}return d};var f=function(a,c,d){return d=(c||[]).slice(0),d.splice(0,0,a),b.apply(null,d)};"undefined"!=typeof exports?(exports.sprintf=b,exports.vsprintf=f):(a.sprintf=b,a.vsprintf=f,"function"==typeof define&&define.amd&&define(function(){return{sprintf:b,vsprintf:f}}))}("undefined"==typeof window?this:window);

// sanitizeSpaces does:
// transform tabs to spaces, multiple to single spaces and
// remove leading and trailing spaces (when noLT is false)
function sanitizeSpaces (line, noLT) {
  line = line.replace(/[\t]/g, ' ').replace(/\s\s+/g, ' ');
  if (!noLT) line = line.trim();
  return line;
}

// rulesYear retrieves the year of the rules provided in ruleName.
// with no ruleName provided, the year of rulesYY.js is used
function rulesYear (ruleName) {
  ruleName = ruleName ? '-' + ruleName : '';
  var year = '';
  // find the year of the rules from the file name in index.html
  var regex = new RegExp ('rules/rules([0-9][0-9]+)' + ruleName + '\\.js$', 'i');
  for (var i = scriptSrc.length - 1; i >=0; i--) {
    var match = scriptSrc[i].match(regex);
    if (match) {
      year = (match[1].length == 2 ? '20' + match[1] : match[1]) + ' ';
      break;
    }
  }
  return year;
}

// loadedRulesFile will be called when a rules file has been loaded
function loadedRulesFile (lines) {
	var start = rules.length;

    // use function to interpret rule file but make sure to limit scope
    function addRules() {
        "use strict";
        return (
            new Function(
                '"use strict"; var rules=[];' + lines + '; return rules;')()
        )
    }

    rules.push(...addRules());
  // when new rules have been added, parse those
  if (rules.length > start) parseRules (start);
	postMessage ({runFunction: 'alertBox',
		arguments: [
			rules.length > start ?
				userText.rulesImported + (rules.length - start) :
				userText.rulesNotImported,
			userText.rulesImportTitle
		]
	});
}

// parseRules walks through the rules file to find out which rules
// are available
function parseRules (start) {
  start = start || 0;

    var log = [];
  var sections = [];
  var year = rulesYear();
  
  for (var i = start; i < rules.length; i++) {
    // Check for [section]
    if (rules[i][0].match(/[\[\(]/)) {
      sections.push (rules[i].toLowerCase().replace (/[\[\(\]\)]/g, ''));
      var parts = rules[i].match (/^[\[\(]([^ ]+) ([^ ]+) (.+)[\]\)]$/);
      if (parts && parts.length > 3) {
        // remove first, global, match. We don't need it
        parts.shift();
        // Seems like a valid section name. Set correct rule, cat and seq.
        var ruleName = parts[0];
        var rnLower = ruleName.toLowerCase();
        var seqName = parts[parts.length - 1];
        parts.splice(parts.length - 1, 1);
        parts.splice(0, 1);
        var catName = parts.join(' ');
        log.push('Parsing ' + rules[i]);
        // only add square-bracket names to rules
        if (!seqCheckAvail[rnLower]) {
          // remove 'glider-' in display name, if present
          ruleName = ruleName.replace (/^glider-/, '');
          seqCheckAvail[rnLower] = {
            'show': false,
            'name': ruleName,
            'cats':[]
          };
        }
        if (!seqCheckAvail[rnLower].cats[catName.toLowerCase()]) {
          seqCheckAvail[rnLower].cats[catName.toLowerCase()] = {
            'show': false,
            'name': catName,
            'seqs':[]
          };
        }
        if (rules[i][0] == '[') {
          seqCheckAvail[rnLower].cats[catName.toLowerCase()].seqs[seqName.toLowerCase()] = seqName;
          seqCheckAvail[rnLower].show = true;
          seqCheckAvail[rnLower].cats[catName.toLowerCase()].show = true;
        } else {
          seqCheckAvail[rnLower].cats[catName.toLowerCase()].seqs[seqName.toLowerCase()] = '*' + seqName;
        }
        
        // set correct year
        year = rulesYear (ruleName);
      }
    } else if (rules[i].match (/^(demo|programme)[\s]*=/)) {
      // add library
      if (seqName && year) {
				postMessage ({runFunction: 'createProgramme', arguments: [
          year,
          rnLower,
          ruleName,
          catName,
          seqName,
          rules[i].match(/^(demo|programme)[\s]*=[\s]*(.*)$/)[2]]}
        );
      }
    }
  }

  // verify all "more=" statements refer to existing sections
  for (var i=start; i<rules.length; i++) {
    if (rules[i][0].match(/[\[\(]/)) var currentSection = rules[i];
    var match = rules[i].toLowerCase().match (/^more[\s]*=[\s]*(.*)$/);
    if (match) {
      if (sections.indexOf (match[1]) === -1) {
        log.push ('*** Error: section ' + currentSection +
          ' references non-existing section "' + match[1] + '"');
      }
    }
    }

    console.log('*** Parsing rules ***');
    console.log(log);

  postMessage ({runFunction: 'updateRulesList', arguments: [seqCheckAvail]});
  // add submenu showing/hiding
  postMessage ({runFunction: 'addMenuEventListeners'});
}

// loadRules loads the rules for the active sequence and stores it in
// several arrays for fast retrieval
function loadRules (ruleName, catName, programName) {
  
  // check if the rules exist. If not, unload rules
  if (!(seqCheckAvail[ruleName] &&
    seqCheckAvail[ruleName].cats[catName] &&
    seqCheckAvail[ruleName].cats[catName].seqs[programName])) {
    if (activeRules) unloadRules();
    return false;
  }

  var
	  updatedFig = false,
	  year = rulesYear (ruleName);

  // return true if rules were already loaded
  if (activeRules && activeRules.description === (year + ruleName + ' ' + catName + ' ' + programName)) {
    return true;
  }

	// unload previous rules
	unloadRules();

    // set rules active
    activeRules = { 'description': year + ruleName + ' ' + catName + ' ' + programName };

  // Set parseSection to true to match the global rules
  var parseSection = true;
  var ruleSection = ruleName + ' ' + catName + ' ' + programName;
  ruleSection = ruleSection.toLowerCase();
  console.log ('Loading rules ' + ruleSection);
  var section = [];
  var sectionRegex = /[\[\]\(\)]/g;
    var infoCheck = []; // Seq info fields to be filled out when saving or printing
  // First clear or preset the variables
  checkAllowRegex = [];
  checkAllowCatId = [];
  checkCatGroup = [];
  checkFigGroup = [];
  checkRule = [];
  defRules = [];
  checkConv = [];
  additionalFig = {'max': 0, 'totalK': 0};
  figureLetters = '';
  ruleSuperFamily = [];
  ruleSeqCheck = [];
  
  // Find the sections
  for (var i = 0; i < rules.length; i++) {
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      var name = rules[i].toLowerCase().replace (sectionRegex, '');
      if (section[name]) {
        // log duplicate sections. Use the last one as this will allow
        // rules import by the user
        console.log('* Warning: duplicate section "' + name +
        '" at rulenr ' + i + '. May be because of rule import. ' +
        'Using last section.');
      }
      section[name] = i;
    }
  }
  // Walk through the rules

  // First run, simplify rule lines and define groups and Groups
  for (var i = 0; i < rules.length; i++) {
    rules[i] = sanitizeSpaces(rules[i]);
    // Check for [section] or (section) to match sequence type specific
    // rules
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      parseSection = (i == section[ruleSection]) ? true : false;
    } else if (parseSection) {
      // when parseSection = true, continue
      // First we remove any spaces around '=', this makes parsing easier
      rules[i] = rules[i].replace(/ *= */g, '=');
      // We also remove spaces around : or ; except when it is a 'why-' line
      if (!rules[i].match(/^why-.+/)) {
        rules[i] = rules[i].replace(/ *: */g, ':');
        rules[i] = rules[i].replace(/ *; */g, ';');
      }
      if (rules[i].match(/^more=/)) {
        // Apply 'more' rules
        var name = rules[i].replace('more=', '').toLowerCase();
        if (section[name]) {
          i = section[name];
          ruleSection = false; // don't go over this section again!
        }
      } else if (rules[i].match(/^group-/)) {
        // Apply 'group' rules => single catalog id match
        var newGroup = rules[i].replace(/^group-/, '').split('=');
        checkCatGroup[newGroup[0]] = [];
        checkCatGroup[newGroup[0]].regex = RegExp(newGroup[1] + '[0-9\.]*', '');
      } else if (rules[i].match(/^Group-/)) {
        // Apply 'Group' rules => full figure (multiple catalog id) match
        var newGroup = rules[i].replace(/^Group-/, '').split('=');
        checkFigGroup[newGroup[0]] = [];
        // when regex ends with $, assume it's fully formatted.
        // Otherwise, add catch all
        if (newGroup[1].slice(-1) === '$') {
          checkFigGroup[newGroup[0]].regex = RegExp(newGroup[1], 'g');
        } else {
          checkFigGroup[newGroup[0]].regex = RegExp(newGroup[1] + '[0-9\. ]*', 'g');
        }
      }
    }
  }
  
  parseSection = true;
  ruleSection = (ruleName + ' ' + catName + ' ' + programName).toLowerCase();

  // Second run, add all other rules
  for (var i = 0; i < rules.length; i++) {
    // Check for [section] or (section) to match sequence type specific rules
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      parseSection = (i == section[ruleSection]) ? true : false;
    } else if (parseSection) {
      // when parseSection = true, continue
        if (rules[i].match(/^conv-[^=]+=/)) {
            // Apply 'conv' rules
            var convName = rules[i].match(/^conv-([^=]+)/)[1];
            // log duplicate conversions, use latest
            if (checkConv[convName]) {
                console.log('* Error: duplicate conversion "' + convName +
                    '" at rulenr ' + i);
            }
            checkConv[convName] = [];
            var convRules = rules[i].match(/^conv-[^=]+=(.*)$/)[1].split(';');
            for (var j = 0; j < convRules.length; j++) {
                var c = convRules[j].split('=');
                // create regex, make sure it matches to the end
                checkConv[convName].push({
                    'regex': new RegExp(c[0] + '.*', 'g'),
                    'replace': c[1]
                });
            }
        } else if (rules[i].match(/^more=/)) {
            // Apply 'more' rules
            var name = rules[i].replace('more=', '').toLowerCase();
            if (section[name]) {
                i = section[name];
                ruleSection = false; // don't go over this section again!
            } else {
                console.log('*** Error: rule section "' + name +
                    '" does not exist');
            }
        } else if (rules[i].match(/^allow=/)) {
            // Apply 'allow' rules
            var newCatLine = rules[i].replace(/^allow=/, '');
            var newCat = newCatLine.match(/^[^\s]*/g);
            var newRules = newCatLine.replace(newCat, '').split(';');
            for (var j = 0; j < newRules.length; j++) {
                newRules[j] = newRules[j].replace(/^\s+|\s+$/g, '');
            }
            checkAllowRegex.push({ 'regex': RegExp(newCat, ''), 'rules': newRules });
        } else if (rules[i].match(/^allow-defrules=/)) {
            // Apply 'allow-defrules' rules
            var newCatLine = rules[i].replace(/^allow-defrules=/, '');
            defRules = newCatLine.replace(/[\s]+/g, '').split(';');
            // Remove multiple instances of the same rule
            defRules = defRules.filter((x, j, a) => a.indexOf(x) === j);
        } else if (rules[i].match(/^[0-9]+\./)) {
            // Apply figure number rules
            // The key of checkAllowCatId is equal to the figure number
            // The value is an array of rules that have to be applied
            var newCatLine = rules[i];
            var newCat = newCatLine.match(/^[^\s\(]*/g)[0];
            // Extract in the array newK the specified K if any
            var newK = newCatLine.match(/\([0-9,:\s]*\)/);
            if (newK) {
                newCatLine = newCatLine.replace(newK[0], '');
                // change from ':' to ',' is not necessary since rules file
                // doesn't mix powered and glider
                newK = newK[0].replace(/[\(\)\s]*/g, '').split(',');
            }
            // Create an array with rules that have to be applied to the figure
            var newRules = newCatLine.replace(newCat, '').replace(/[\s]+/g, '').split(';');
            // When there are no rules we want an empty array, whereas split
            // provides an array with one empty string
            if (newRules[0] == '') newRules = [];
            // Check if the figure string applies to multiple figures, such as 1.1.1.1-4
            // If so, make a new checkAllowCatId for each figure
            var multiple = newCat.match(/[0-9]+\-[0-9]+$/);
            if (multiple) {
                multiple = multiple[0];
                for (var j = multiple.split('-')[0]; j < (parseInt(multiple.split('-')[1]) + 1); j++) {
                    checkAllowCatId[newCat.replace(multiple, '') + j] = newRules;

                    if (newK && (newK[j - multiple.split('-')[0]] != '')) {
                        var figIds = arestiToFig[newCat.replace(multiple, '') + j];
                        for (var l = 0; l < figIds.length; l++) {
                            fig[figIds[l]].kRules = newK[j - multiple.split('-')[0]];
                        }
                        rulesKFigures[newCat.replace(multiple, '') + j] = true;
                        console.log('Changed K for ' + newCat.replace(multiple, '') + j + ' to ' + newK[j - multiple.split('-')[0]]);
                        updatedFig = true;
                    }
                }
            } else {
                checkAllowCatId[newCat] = newRules;
                if (newK) {
                    var figIds = arestiToFig[newCat];
                    for (var l = 0; l < figIds.length; l++) {
                        fig[figIds[l]].kRules = newK[0];
                    }
                    rulesKFigures[newCat] = true;
                    console.log('Changed K for ' + newCat + ' to ' + newK[0]);
                    updatedFig = true;
                }
            }
        } else if (rules[i].match(/[^-]+-min=\d+$/)) {
            // Apply [group]-min rules
            var group = rules[i].replace(/-min/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].min = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].min = parseInt(group[1]);
        } else if (rules[i].match(/[^-]+-max=\d+$/)) {
            // Apply [group]-max rules
            var group = rules[i].replace(/-max/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].max = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].max = parseInt(group[1]);
        } else if (rules[i].match(/[^-]+-repeat=\d+$/)) {
            // Apply [group]-repeat rules
            var group = rules[i].replace(/-repeat/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].repeat = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].repeat = parseInt(group[1]);
        } else if (rules[i].match(/[^-]+-totrepeat=\d+$/)) {
            // Apply [group]-totrepeat rules
            var group = rules[i].replace(/-totrepeat/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].totrepeat = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].totrepeat = parseInt(group[1]);
        } else if (rules[i].match(/[^-]+-minperfig=\d+$/)) {
            // Apply [group]-minperfig rules
            var group = rules[i].replace(/-minperfig/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].minperfig = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].minperfig = parseInt(group[1]);
        } else if (rules[i].match(/[^-]+-maxperfig=\d+$/)) {
            // Apply [group]-maxperfig rules
            var group = rules[i].replace(/-maxperfig/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].maxperfig = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].maxperfig = parseInt(group[1]);
        } else if (rules[i].match(/[^-]+-name=.+$/)) {
            // Apply [group]-name and seqcheck-name rules
            var group = rules[i].replace(/-name/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].name = group[1];
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].name = group[1];
            if (ruleSeqCheck[group[0]]) ruleSeqCheck[group[0]].name = group[1];
        } else if (rules[i].match(/[^-]+-name_[a-z]{2}=.+$/)) {
            // Apply [group]-name and seqcheck-name rules
            var group = rules[i].replace(/-name_[a-z]{2}/, '').split('=');
            if (checkCatGroup[group[0]]) {
                checkCatGroup[group[0]][rules[i].match(/name_[a-z]{2}/)[0]] = group[1];
            }
            if (checkFigGroup[group[0]]) {
                checkFigGroup[group[0]][rules[i].match(/name_[a-z]{2}/)[0]] = group[1];
            }
            if (ruleSeqCheck[group[0]]) {
                ruleSeqCheck[group[0]][rules[i].match(/name_[a-z]{2}/)[0]] = group[1];
            }
        } else if (rules[i].match(/-[^-]+-rule=.+$/)) {
            // apply rulebook references
            var part = rules[i].match(/^([^-]+)-([^-]+)-rule=(.*)$/, '');
            if (checkCatGroup[part[1]] && checkCatGroup[part[1]][part[2]]) {
                if (!checkCatGroup[part[1]].rule) checkCatGroup[part[1]].rule = [];
                checkCatGroup[part[1]].rule[part[2]] = part[3];
            }
            if (checkFigGroup[part[1]] && checkFigGroup[part[1]][part[2]]) {
                if (!checkFigGroup[part[1]].rule) checkFigGroup[part[1]].rule = [];
                checkFigGroup[part[1]].rule[part[2]] = part[3];
            }
        } else if (rules[i].match(/-rule=.+$/)) {
            var newRuleName = rules[i].match(/^[^-]+/)[0];
            if (checkRule[newRuleName]) {
                checkRule[newRuleName].rule = rules[i].replace(/^[^=]+=/, '');
            } else if (ruleSeqCheck[newRuleName]) {
                ruleSeqCheck[newRuleName].rule = rules[i].replace(/^[^=]+=/, '');
            }
        } else if (rules[i].match(/^rule-[^=]+=.+/)) {
            // Apply rule-x rules
            var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^rule-/, '');
            var checkRuleParts = rules[i].replace('rule-' + newRuleName + '=', '');
            var colonPos = checkRuleParts.indexOf(':');
            var check = checkRuleParts.substring(colonPos + 1);
            if (check.match(/^</)) {
                checkRule[newRuleName] = {
                    'conv': checkRuleParts.substring(0, colonPos),
                    'less': parseInt(check.match(/^<(.*)/)[1])
                };
                //console.log (checkRule[newRuleName].less);
            } else if (check.match(/^\+</)) {
                checkRule[newRuleName] = {
                    'conv': checkRuleParts.substring(0, colonPos),
                    'totalLess': parseInt(check.match(/^\+<(.*)/)[1])
                };
                //console.log (checkRule[newRuleName].totalLess);
            } else {
                checkRule[newRuleName] = {
                    'conv': checkRuleParts.substring(0, colonPos),
                    'regex': RegExp(checkRuleParts.substring(colonPos + 1), 'g')
                };
            }
        } else if (rules[i].match(/^why-[^=]+=.+/)) {
            // Apply why-x rules
            var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why-/, '');
            if (checkRule[newRuleName]) {
                checkRule[newRuleName].why = rules[i].replace(/^[^=]+=/, '');
            }
        } else if (rules[i].match(/^why_[a-z]{2}-[^=]+=.+/)) {
            // Apply why_cc-x rules where cc = country code
            var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why_[a-z]{2}-/, '');
            if (checkRule[newRuleName]) {
                checkRule[newRuleName][rules[i].match(/^why_[a-z]{2}/)[0]] = rules[i].replace(/^[^=]+=/, '');
            }
        } else if (rules[i].match(/^floating-point/)) {
            // Apply floating-point rules
            checkCatGroup.floatingPoint = rules[i].match(/[0-9]+/)[0];
        } else if (rules[i].match(regexRulesAdditionals)) {
            // apply Additionals rules
            var match = rules[i].match(regexRulesAdditionals);
            additionalFig.max = parseInt(match[2]);
            additionalFig.totalK = parseInt(match[3]);
        } else if (/^pos(nl)?=/.test(rules[i])) {
            // Split positioning options on ;
            var posOptions = rules[i].replace(/^pos[^=]*=/, '').split(';');
            var pos = [];
            // Go through positioning options. When there are multiple, each
            // should have a description. Format 'p+h:d; p+h:d; ...'
            // First match is description, second positioning and harmony K.
            for (var j = 0; j < posOptions.length; j++) {
                var matches = posOptions[j].trim().match(/^([0-9]+\+?[0-9]*):?(.+)?$/);
                pos.push({ posHarm: matches[1], description: matches[2] });
            }
            postMessage({
                runFunction: 'setRulesPosHarmony',
                arguments: [pos]
            });
        } else if (rules[i].match(/^infocheck[ ]*=/)) {
            // define fields that should be checked for not being empty when
            // saving or printing a sequence
            infoCheck = rules[i].replace(/ /g, '').match(/=(.*)/)[1].split(';');
        } else if (rules[i].match(/^figure-letters[ ]*=/)) {
            // define Figure Letters
            figureLetters = rules[i].replace(/ /g, '').match(/=(.*)/)[1];
        } else if (rules[i].match(/^sf[ ]*=/)) {
            // define Super Families
            var val = rules[i].replace(/ /g, '').match(/=(.*)/)[1];
            if (superFamilies[val.toLowerCase()]) {
                ruleSuperFamily = superFamilies[val.toLowerCase()];
            } else {
                var families = val.split(';');
                for (var j = 0; j < families.length; j++) {
                    var regex = new RegExp(families[j].split(':')[0]);
                    var fam = families[j].split(':')[1];
                    ruleSuperFamily.push([regex, fam]);
                }
            }
        } else if (rules[i].match(/^seqcheck-/)) {
            var newRuleName = rules[i].split('=')[0].replace(/^seqcheck-/, '');
            var regex = new RegExp(rules[i].split('=')[1]);
            ruleSeqCheck[newRuleName] = { 'regex': regex };
        } else if (rules[i].match(/^reference[\s]*=/)) {
            // load reference sequence
            postMessage({
                runFunction: 'setReferenceSequence',
                arguments: [rules[i].match(/^reference[\s]*=[\s]*(.*)$/)[1], true]
            });
        } else if (rules[i].match(/^logo[\s]*=/)) {
            activeRules.logo = rules[i].replace(/^logo[\s]*=/, '').trim();
        }
      }
    }
 
  
	if (checkAllowRegex) {
    for (var i = 0 ; i < checkAllowRegex.length ; i++) {
			for (var j in fig) {
				if (fig[j].aresti &&
					checkAllowRegex[i].regex.test(fig[j].aresti) &&
					!(fig[j].aresti in checkAllowCatId)) {
						checkAllowCatId[fig[j].aresti] =
							(checkAllowRegex[i].rules.length == 0) ? [] : checkAllowRegex[i].rules;
						}
		  }
      for (var j in rollFig) {
				if (checkAllowRegex[i].regex.test(rollFig[j].aresti) &&
					!(rollFig[j].aresti in checkAllowCatId)) {
					checkAllowCatId[rollFig[j].aresti] = [];
				}
	    }
	  }
	}
  
  postMessage({runFunction: 'activateRules',
	  arguments: [{
			additionalFig: additionalFig,
			checkAllowCatId: checkAllowCatId,
			checkCatGroup: checkCatGroup,
			figureLetters: figureLetters,
			ruleSuperFamily: ruleSuperFamily,
            iacForms: (/^(glider-)?iac$/.test(ruleName)) ? true : false,
			infoCheck: infoCheck,
		    activeRules: activeRules,
			rulesKFigures: rulesKFigures,
			updatedFig: (updatedFig ? fig : false)
		}]
	});
	
	return true;
}

// unloadRules will set rules to inactive and do some checks
function unloadRules () {
  console.log('Clearing rules');

	var updatedFig = false;
	for (var i = fig.length - 1; i >= 0; i--) {
		if (fig[i] && fig[i].kRules) {
			updatedFig = true;
			delete (fig[i].kRules);
		}
	}
	for (var key in rollFig) {
		if (rollFig[key].kRules) {
			updatedFig = true;
			delete (rollFig[key].kRules);
		}
	}
	rulesKFigures = {};
  postMessage ({runFunction: 'unloadRules',
		arguments: [updatedFig ? fig : false]});

  activeRules = false;
}

// checkRules will check a complete sequence against the loaded rules
// and produce alerts where necessary.
// The Aresti list according description in allowed.js is in the array
// figCheckLine
// The required callback is called with a single argument object
// containing alertMsgs, alertMsgRules and log
function checkRules (callbackId, activeSequenceText, figures, figCheckLine, nonArestiRolls, multi) {
  
  if (!callbackId) throw new Error ('Callback is required for checkRules');
  
  /* why creates the correct 'why' string. Priority is:
   1) current language
   2) no language
   3) English */
    function why(rule) {
    if (checkRule[rule]['why_' + language]) {
      return checkRule[rule]['why_' + language];
    } else if (checkRule[rule].why) {
      return checkRule[rule].why;
    } else if (checkRule[rule].why_en) {
      return checkRule[rule].why_en;
    } else return '';
  }
  
  var
	  figNr = 0,
	  figureK = 0,
	  additionals = 0,
	  groupMatch = [],
	  figCount = [],
	  elemCount = [],
	  log = [],
	  logLine = '',
	  errFigs;
  
  log.push ('Testing sequence:' + activeSequenceText);
  alertMsgs = [];
  
  // first we check for rules that are ALWAYS valid, i.e. Aresti
  // Catalogue rules
  for (var i = 0; i < figures.length; i++) {
    var seqNr = figures[i].seqNr;
    if (seqNr) {
      // some alerts are disabled when nonArestiRolls is checked
      if (!nonArestiRolls) {
        // check for more than two roll elements on a roll position
        // Aresti Catalogue Part I - 17
        if (figCheckLine[seqNr].replace(/[^,; ]/g, '').match(/[,;][,;]/)) {
          checkAlert (userText.alert.maxTwoRotationElements,
          false,
          seqNr,
          'Aresti Catalogue');
        }
        // check for same direction same type unlinked rolls
        // Aresti Catalogue Part I - 19
        if (regexUnlinkedRolls.test(figCheckLine[seqNr])) {
          checkAlert (userText.alert.unlinkedSameNotAllowed,
          false,
          seqNr,
          'Aresti Catalogue');
        }
        // check if a spin is preceded by another roll element
        // Aresti Catalogue 27
        if (figCheckLine[seqNr].match(/[,;]9\.1[12]\./)) {
          checkAlert (userText.alert.spinFirst,
          false,
          seqNr,
          'Aresti Catalogue');
        }
      }
      // check if there is a roll on family 1.1.1
      // Aresti Catalogue 7.2
      if (figCheckLine[seqNr].match(/^1\.1\.1[^0]+0\.0\.0\.0$/)) {
        checkAlert (userText.alert.family111RollMissing,
        false,
        seqNr,
        'Aresti Catalogue');
      }
    }
  }
  
  // see if there are active rules. If not, skip rule checking
  if (!activeRules) {
		log.push ('Rules: no');
  } else {
      log.push('Rules: ' + activeRules.description);
	  
	  for (var i = 0; i < figures.length; i++) {
	    var aresti = figures[i].aresti;
	    if (aresti) {
	      var k = figures[i].k;
	      var figString = figCheckLine[figures[i].seqNr];
	      figNr++;
	      if (aresti.length > 1) {
	        var checkLine = figString.replace(aresti[0] + ' ', '');
	      } else {
	        var checkLine = '';
	      }
	      var a = '';
	      var checkArray = [];
	      for (var ii = 0; ii < checkLine.length; ii++) {
	        if (checkLine[ii].match(/[ ,;]/)) {
	          checkArray.push(a);
	          checkArray.push(checkLine[ii]);
	          a = '';
	        } else {
	          a += checkLine[ii];
	        }
	      }
	      checkArray.push(a);
	
	      // format thisFig for logging
	      var thisFig = figString.replace(/;/g, ',');
	      for (var j = 0; j < aresti.length; j++) {
	        var regex = new RegExp ('(' + aresti[j].replace(/\./g, '\\.') + ')( |,|$)');
	        thisFig = thisFig.replace(regex, '$1(' + k[j] + ')$2');
	      }
	      log.push ('========= Figure #' + figNr + ': ' + thisFig);
	      // Check if the figure is an additional
          if (figures[i].additional) {
            // no rule checking for additionals
	        additionals++;
              log.push('is additional? True');
	      } else {
	        log.push ('is additional? False');
	        var figK = 0;
	        var groupFigMatch = [];
	        // Walk through the elements of the figure
	        if (figCount[aresti[0]]) {
	          figCount[aresti[0]]++;
	        } else figCount[aresti[0]] = 1;
	        log.push ('Group-combined: Count=' + figNr + ' Fig count=' +
	          figCount[aresti[0]]);
	        elemCount = [];
	        for (var j = 0; j < aresti.length; j++) {
	          log.push ('---- Element: ' + aresti[j]);
	          figK += parseInt(k[j]);
	          figureK += parseInt(k[j]);
	          if (elemCount[aresti[j]]) {
	            elemCount[aresti[j]]++;
	          } else elemCount[aresti[j]] = 1;
	          log.push('Group-k: Count=' + figureK + ' Elem count=' +
	            elemCount[aresti[j]]);
	          // Check all group rules on all elements
	          for (group in checkCatGroup) {
	            if ((group != 'k') && (group != 'floatingPoint')) {
	              var match = aresti[j].match(checkCatGroup[group].regex);
	              if (match) {
	                if (!groupFigMatch[group]) groupFigMatch[group] = [];
	                groupFigMatch[group].push(match[0]);
	                if (!groupMatch[group]) groupMatch[group] = [];
	                groupMatch[group].push({'match':match[0], 'fig':figNr});
	                log.push ('group-' + group +
	                  ': Count=' + groupFigMatch[group].length +
	                  ' Elem count=' + elemCount[aresti[j]]);
	              }
	              // Do checks after the last aresti code of the figure has been processed
	              if (j == (aresti.length - 1)) {
	                if (groupFigMatch[group]) {
	                  log.push ('group-' + checkCatGroup[group].name +
	                    ': Count=' + groupFigMatch[group].length +
	                    ' Elem count=' + elemCount[aresti[j]]);
	                  if (checkCatGroup[group].minperfig &&
		                  (groupFigMatch[group].length < checkCatGroup[group].minperfig)) {
											if (('maxperfig' in checkCatGroup[group]) &&
												(checkCatGroup[group].minperfig === checkCatGroup[group].maxperfig)) {
												checkAlert(group, 'exactlyperfig');
											} else checkAlert(group, 'minperfig', figNr);
	                    log.push('Minimum of ' + checkCatGroup[group].minperfig + ' elements of this group not reached');
	                  }
	                  if (checkCatGroup[group].maxperfig && (groupFigMatch[group].length > checkCatGroup[group].maxperfig)) {
	                    checkAlert(group, 'maxperfig', figNr);
	                    log.push('Maximum of ' + checkCatGroup[group].maxperfig + ' elements of this group exceeded');
	                  }
	                }
	              }
	            }
	          }
	          // Check for specific allowed figures if the checkAllowCatId
	          // object is not empty
	          if (Object.keys(checkAllowCatId).length > 0) {
	            //log.push ('Checking for specific allowed figures');
	            if (!(aresti[j] in checkAllowCatId)) {
	              checkAlert (aresti[j], 'notAllowed', figNr);
	              //log.push ('Not allowed:' + aresti[j]);
	            }
	          }
	        }
	        // Run rule checks on specific allowed figures if the
	        // checkAllowCatId object is not empty
	        if (Object.keys(checkAllowCatId).length > 0) {
	          //log.push ('Checking rules on specific allowed figures');
	          var arestiNr = figString.split(' ')[0];
	          //console.log(arestiNr);
	          if ((arestiNr in checkAllowCatId) && (checkAllowCatId[arestiNr][0] !== '')) {
	            //log.push('Allowed base figure:' + arestiNr);
	            // Apply rules to the figure
	            // Run the checks on the rolls

                  // set the excluded rules to empty at the start
                  excludeRules = [];
	            for (var ii = 0; ii < checkAllowCatId[arestiNr].length; ii++) {
	              // copy checkArray to check
	              var check = checkArray.slice(0);
	              // forElement may be used to add element number to 'why'
	              var forElement = '';
                    var rule = checkAllowCatId[arestiNr][ii];
                    // Check if the rule matches ^xxx format. If so, this marks
                    // exclusion of a rule for a figure and should be handled as
                    // such
                    if (rule.substring(0, 1) == '^') {
                        if (/:/.test(rule)) {
                            log.push('Referenced rule ' + rule + ' is not allowed. ' +
                                'You can\'t specify a specific roll position while ' +
                                'excluding a rule("^" and ":" together)' ) ; 
                        } else excludeRules.push(rule.substring(1));
                        continue;
                    }
	              log.push ('-basefig rule: ' + rule);
	              // check if this is a rule of form rule:nr
	              var ruleSplit = rule.split(':');
	              rule = ruleSplit[0];
	              // if it is a rule of form rule:nr, only put this roll
	              // element in check
	              if (ruleSplit[1]) {
	                var rollNr = 1;
	                check = [];
	                for (var m = 0; m < checkArray.length; m++) {
	                  if (rollNr == ruleSplit[1]) {
	                    if (checkArray[m] == ' ') break;
	                    check.push (checkArray[m]);
	                  } else {
	                    if (checkArray[m] == ' ') rollNr++;
	                  }
	                }
	                forElement = userText.forElement + ruleSplit[1];
	              }
	              // Apply conversions to the Aresti number before checking the rule
	              if (checkRule[rule]) { // make sure rule was defined
		              if (checkRule[rule].conv) {
		                var conversion = checkRule[rule].conv;
		                log.push ('Apply: ' + checkRule[rule].conv);
		                logLine = 'Converted: ' + check.join('') + ' => ';
		                for (var l = 0; l < checkConv[conversion].length; l++) {
		                  for (var m = 0; m < check.length; m++) {
		                    if (!check[m].match(/[ ,;]/)) {
		                      check[m] = check[m].replace(checkConv[conversion][l].regex,
		                      checkConv[conversion][l].replace);
		                    }
		                  }
		                }
		                checkLine = check.join('');
		
		                log.push (logLine + checkLine);
		              }
		              if (checkRule[rule].regex) {
		                if (checkLine.match(checkRule[rule].regex)) {
		                  checkAlert (why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
		                  log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
		                }
		              } else if (checkRule[rule].less) {
		                var sum = 0;
		                for (var l = check.length - 1; l >= 0; l--) {
		                  if (check[l].match(/^[0-9]/)) {
		                    sum += parseInt (check[l]);
		                  }
		                  if ((check[l] == ' ') || (l == 0)) {
		                    if (sum >= parseInt (checkRule[rule].less)) {
		                      checkAlert (why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
		                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
		                    }
		                    sum = 0;
		                  }
		                }
		              } else if (checkRule[rule].totalLess) {
		                var sum = 0;
		                for (var l = check.length - 1; l >= 0; l--) {
		                  if (check[l].match(/^[0-9]/)) {
		                    sum += parseInt (check[l]);
		                  }
		                }
		                if (sum >= parseInt (checkRule[rule].totalLess)) {
		                  checkAlert (why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
		                  log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
		                }
		              }
								} else console.log ('Referenced rule "' + rule +
									'" does not exist');
	              
	            }
	            // Check default rules when applicable
	            if (defRules != []) {
	              for (k = 0; k < defRules.length; k++) {
	                // copy checkArray to check
	                var check = checkArray.slice(0);
	                
	                var checkLine = figString.replace(arestiNr + ' ', '');
	                rule = defRules[k];
	                // check if this is a rule of form rule:nr
	                var ruleSplit = rule.split(':');
	                if ((ruleSplit[1] === j) || (ruleSplit.length == 1)) {
	                  rule = ruleSplit[0];
	                  // check if the rule is in excludeRules. If so, skip it
                        if (excludeRules.includes(rule)) {
                            excludeRules.splice(excludeRules.indexOf(rule), 1);
                            continue;
                        }
                        // apparently not in excludeRules
	                  log.push ('-basefig rule: ' + rule);
	                  // Apply conversions to the Aresti number before checking the rule
	                  if (checkRule[rule].conv) {
	                    var conversion = checkRule[rule].conv;
	                    log.push ('Apply: ' + checkRule[rule].conv);
	                    logLine = 'Converted: ' + checkLine + ' => ';
	                    for (var l = 0; l < checkConv[conversion].length; l++) {
	                      for (var m = 0; m < check.length; m++) {
	                        if (!check[m].match(/[ ,;]/)) {
	                          check[m] = check[m].replace(checkConv[conversion][l].regex,
	                          checkConv[conversion][l].replace);
	                        }
	                      }
	                    }
	                    checkLine = check.join('');
	                    log.push (logLine + checkLine);
	                  }
	                  if (checkRule[rule].regex) {
	                    if (checkLine.match(checkRule[rule].regex)) {
	                      checkAlert (why(rule), 'rule', figNr, checkRule[rule].rule);
	                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
	                    }
	                  } else if (checkRule[rule].less) {
	                    var sum = 0;
	                    for (var l = check.length - 1; l >= 0; l--) {
	                      if (check[l].match(/^[0-9]/)) {
	                        sum += parseInt (check[l]);
	                      }
	                      if ((check[l] == ' ') || (l == 0)) {
	                        if (sum >= parseInt (checkRule[rule].less)) {
	                          checkAlert (why(rule), 'rule', figNr, checkRule[rule].rule);
	                          log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
	                        }
	                        sum = 0;
	                      }
	                    }
	                  } else if (checkRule[rule].totalLess) {
	                    var sum = 0;
	                    for (var l = check.length - 1; l >= 0; l--) {
	                      if (check[l].match(/^[0-9]/)) {
	                        sum += parseInt (check[l]);
	                      }
	                    }
	                    if (sum >= parseInt (checkRule[rule].totalLess)) {
	                      checkAlert (why(rule), 'rule', figNr, checkRule[rule].rule);
	                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
	                    }
	
	                  }
	                }
                    }
                    if (excludeRules.length) {
                        log.push('Referenced rule ^' + excludeRules.join(',^') + ' is not allowed on figure ' + arestiNr + '. You can\'t exclude a rule that is not set in allow-defrules');
                        excludeRules = [];
                    }
	            }
	          }
	        }
	        // Check the Group rules for complete figures
	        for (group in checkFigGroup) {
	          var match = figString.match(checkFigGroup[group].regex);
	          if (match) {
	            if (!groupMatch[group]) groupMatch[group] = [];
	            for (j = 0; j < match.length; j++) {
	              groupMatch[group].push({'match':match[j], 'fig':figNr});
	            }
	          }
	        }
	        if ('minperfig' in checkCatGroup.k) {
	          if (figK < checkCatGroup.k.minperfig) {
							if (('maxperfig' in checkCatGroup.k) &&
								(checkCatGroup.k.minperfig === checkCatGroup.k.maxperfig)) {
								checkAlert('k', 'exactlyperfig', figNr);
							} else checkAlert('k', 'minperfig', figNr);
	          }
	        }
	        if ('maxperfig' in checkCatGroup.k) {
	          if (figK > checkCatGroup.k.maxperfig) {
	            checkAlert('k', 'maxperfig', figNr);
	          }
	        }
	      }
	    }
	  }
	  
	  // add additionals to figureK where applicable
	  if ((additionals > 0) && (additionalFig.max > 0)) {
	    figureK += additionalFig.totalK;
	  }
	  // check for total min/max K
	  if ('min' in checkCatGroup.k) {
			if (figureK < checkCatGroup.k.min) {
				if (('max' in checkCatGroup.k) &&
					(checkCatGroup.k.min === checkCatGroup.k.max)) {
					checkAlert ('k', 'exactly');
				} else checkAlert('k', 'min');
			}
	  }
	  if ('max' in checkCatGroup.k) {
	    if (figureK > checkCatGroup.k.max) checkAlert('k', 'max');
	  }
	
	  // Run checks on maximum and minimum occurrence of a group (catalog ID)
	  // Go through all groups
	  log.push ('====== Testing global repeat/min/max ======');
	  for (group in checkCatGroup) {
	    // Did we have a match on this group?
	    if (groupMatch[group]) {
	      //console.log('* Match');
	      //console.log(checkCatGroup[group]);
	      // Check for max and min occurrences of the group
	      if ('max' in checkCatGroup[group]) {
	        log.push ('testing group ' + group + '-max=' +
	          checkCatGroup[group].max + ' val=' + groupMatch[group].length);
	        if (groupMatch[group].length > checkCatGroup[group].max) {
	          errFigs = figureNumbers (groupMatch[group]);
	          checkAlert(group, 'max', errFigs);
	          log.push ('*** Error: Maximum ' + checkCatGroup[group].max +
	            ' of group ' + group + '(' + errFigs + ')');
	        }
	      }
	      if ('min' in checkCatGroup[group]) {
	        log.push ('testing group ' + group + '-min=' +
	          checkCatGroup[group].min + ' val=' + groupMatch[group].length);
	        if (groupMatch[group].length < checkCatGroup[group].min) {
						if (('max' in checkCatGroup[group]) &&
							(checkCatGroup[group].min === checkCatGroup[group].max)) {
							checkAlert(group, 'exactly');
						} else checkAlert(group, 'min');
	          log.push ('*** Error: Minimum ' + checkCatGroup[group].min +
	            ' of group ' + group);
	        }
	      }
	      // Check for repeats of the exact same catalog id when necessary
	      if (('repeat' in checkCatGroup[group]) ||
	        ('totrepeat' in checkCatGroup[group])) {
	        //console.log('Check repeat');
	        var matches = [];
	        for (var j = 0; j < groupMatch[group].length; j++) {
	          var thisMatch = groupMatch[group][j];
	          if (matches[thisMatch.match]) {
	            matches[thisMatch.match].push({'match':thisMatch.match, 'fig':thisMatch.fig});
	          } else {
	            matches[thisMatch.match] =
	              [{'match':thisMatch.match, 'fig':thisMatch.fig}];
	          }
	        }
	        if ('repeat' in checkCatGroup[group]) {
	          for (match in matches) {
	            if (matches[match].length > checkCatGroup[group].repeat) {
	              errFigs = figureNumbers (matches[match]);
	              checkAlert(group, 'repeat', errFigs);
	              log.push ('*** Error: Repeat ' + checkCatGroup[group].repeat +
	                ' of group ' + group + '(' + errFigs + ')');
	            }
	          }
	        }
	        if ('totrepeat' in checkCatGroup[group]) {
	          var count = 0;
	          for (match in matches) {
	            if (matches[match].length > 1) {
	              count++;
	            } else delete matches[match];
	          }
	          if (count > checkCatGroup[group].totrepeat) {
	            errFigs = [];
	            for (match in matches) {
	              for (var i = 0; i < matches[match].length; i++) {
	                errFigs.push (matches[match][i]);
	              }
	            }
	            errFigs = figureNumbers (errFigs);
	            checkAlert(group, 'totrepeat', errFigs);
	            log.push ('*** Error: Total Repeat ' + checkCatGroup[group].totrepeat +
	              ' of group ' + group + '(' + errFigs + ')');
	          }
	        }        
	      }
	    } else {
	      // No occurrences of this group, was there a minimum?
	      if ((group != 'k') && (checkCatGroup[group].min)) {
					if (('max' in checkCatGroup[group]) &&
						(checkCatGroup[group].min === checkCatGroup[group].max)) {
						checkAlert(group, 'exactly');
					} else checkAlert(group, 'min');
	        log.push ('*** Error: Minimum ' + checkCatGroup[group].min +
	          ' of group ' + group);
	      }
	    }
	  }
	  // Run checks on maximum and minimum occurrence of a Group (complete figure)
	  // Go through all groups
	  for (group in checkFigGroup) {
	    // Did we have a match on this group?
	    if (groupMatch[group]) {
	      // Check for min and max occurrences of the group
	      if (('min' in checkFigGroup[group]) &&
	        (groupMatch[group].length < checkFigGroup[group].min)) {
					if (('max' in checkFigGroup[group]) &&
						(checkFigGroup[group].min === checkFigGroup[group].max)) {
						checkAlert(group, 'figexactly');
					} else checkAlert(group, 'figmin');
	        log.push ('*** Error: Minimum ' + checkFigGroup[group].min +
	          ' of group ' + group);
	      }
	      if (('max' in checkFigGroup[group]) &&
	        (groupMatch[group].length > checkFigGroup[group].max)) {
	        errFigs = figureNumbers (groupMatch[group]);
	        checkAlert(group, 'figmax', errFigs);
	        log.push ('*** Error: Maximum ' + checkFigGroup[group].max +
	          ' of group ' + group + '(' + errFigs + ')');
	      }
	      // Check for repeats of the exact same figure when necessary
	      if ('repeat' in checkFigGroup[group]) {
	        var matches = [];
	        for (var j = 0; j < groupMatch[group].length; j++) {
	          var thisMatch = groupMatch[group][j];
	          if (matches[thisMatch.match]) {
	            matches[thisMatch.match].push({
	              'match':thisMatch.match,
	              'fig':thisMatch.fig
	            });
	          } else {
	            matches[thisMatch.match] =
	              [{'match':thisMatch.match, 'fig':thisMatch.fig}];
	          }
	        }
	        for (match in matches) {
	          if (checkFigGroup[group].repeat &&
	            (matches[match].length > checkFigGroup[group].repeat)) {
	            errFigs = figureNumbers (matches[match]);
	            checkAlert(group, 'figrepeat', errFigs);
	            log.push ('*** Error: Repeat ' + checkFigGroup[group].repeat +
	              ' of group ' + group + '(' + errFigs + ')');
	          }
	        }
	      }
	    } else {
	      // No occurrences of this group, was there a minimum?
	      if ('min' in checkFigGroup[group]) {
					if (('max' in checkFigGroup[group]) &&
						(checkFigGroup[group].min === checkFigGroup[group].max)) {
						checkAlert(group, 'figexactly');
					} else checkAlert(group, 'figmin');
	        log.push ('*** Error: Minimum ' + checkFigGroup[group].min +
	          ' of group ' + group);
	      }
	    }
	  }
	  
	  // Check complete sequence string on seqcheck directives
	  // By default, when there is NO match for any of the directives, an alert is created
      // When the name starts with !, this logic is reversed

      if (ruleSeqCheck !== []) {
          for (var name in ruleSeqCheck) {
            if ((name[0] != '!' && !ruleSeqCheck[name].regex.test(activeSequenceText)) ||
                name[0] == '!' && ruleSeqCheck[name].regex.test(activeSequenceText)) {
	        checkAlert (
	          checkName(ruleSeqCheck[name]),
	          false,
	          false,
	          ruleSeqCheck[name].rule
	        );
	      }
	    }
	  }
	  
	  // check for multiple use of the same free unknown figure, except additionaL
	  // Also check if all figures have been assigned a Free (Un)known letter
	  // or Additional when applicable and if the assigned figure letters
	  // are allowed according the rules
	
	  var remaining = figureLetters ? figureLetters : '';
	
	  var ufl = [];
	  for (var i = 0; i < figures.length; i++) {
	    var l = figures[i].unknownFigureLetter;
	    if (figures[i].aresti) {
	      if (l) {
	        if ((figureLetters + 'L').indexOf (l) === -1) {
	          var msg = sprintf (
	            userText.figureLetterNotAllowed,
	            figures[i].seqNr,
	            l);
	          alertMsgs.push (msg);
	          log.push ('*** Error: ' + msg);
	          //delete figures[i].unknownFigureLetter;
	        } else {
	          if (ufl[l]) {
	            ufl[l].push(figures[i].seqNr);
	          } else {
	            ufl[l] = [figures[i].seqNr];
	          }
	          remaining = remaining.replace(l, '');
	        }
	      }
	    }
	  }
	  
	  for (l in ufl) {
	    if ((ufl[l].length > 1) && (l != 'L')) {
	      var msg = sprintf(userText.FUletterMulti, ufl[l].join(','), l);
	      alertMsgs.push(msg);
	      log.push ('*** Error: ' + msg);
	    }
	  }
	  // see if we have remaining (=unused) letters
	  if (remaining.length) {
	    var figs = [];
	    for (var i = 0; i < figures.length; i++) {
	      if (!figures[i].unknownFigureLetter && figures[i].aresti) {
	        figs.push (figures[i].seqNr);
	      }
	    }
	    // nuisance warning in Designer, so hide there
	    if (figs.length && (activeForm !== 'FU')) {
	      var msg = sprintf(userText.noFigureLetterAssigned, figs.join(','));
	      alertMsgs.push (msg);
	      log.push ('*** Error: ' + msg);
	    }
	
	    var msg = sprintf(userText.unusedFigureLetters, remaining);
	    alertMsgs.push (msg);
	    log.push ('*** Error: ' + msg);
	  }
	  
	  // when additionals are allowed, at least one is required
	  if (additionalFig.max && !additionals) {
	    checkAlert (
	      userText.additionalFigureRequired,
	      false,
	      false,
	      (sportingClass.value === 'glider') ?
	        "Sporting Code Section 6 Part II, 3.3.3.8" :
	        "Sporting Code Section 6 Part I, 2.3.1.4&nbsp;c"
	    );
	  }
	
	  // check Reference sequence if provided
	  if (figureLetters && referenceSequence.figures &&
	    (!multi.processing || multi.useReference)) {
	    checkReferenceSequence (figures);
	  }
	}
	postMessage ({
		callbackId: callbackId,
		arguments: [{alertMsgs: alertMsgs, alertMsgRules: alertMsgRules, log: log}]
	});
}

// checkReferenceSequence checks the active sequence against a reference
// sequence and provides appropriate warnings
function checkReferenceSequence (figures) {
  for (var i = 0; i < figures.length; i++) {
		var f = figures[i];
    if (f.aresti &&
      f.unknownFigureLetter &&
      (f.unknownFigureLetter !== 'L') &&
      referenceSequence.figures[f.unknownFigureLetter]) {
      var refFig = referenceSequence.figures[f.unknownFigureLetter];
      if (refFig.checkLine !== f.checkLine) {
        checkAlert (sprintf (userText.referenceFigureDifferent,
          f.unknownFigureLetter), false, f.seqNr);
      } else if (refFig.entryDir === refFig.exitDir) {
        if (f.entryDir !== f.exitDir) {
          if (refFig.entryAtt === refFig.exitAtt) {
            var text = userText.referenceFigureExitSame;
          } else {
            var text = userText.referenceFigureExitOpp;
          }
          checkAlert (sprintf (text,
           f.unknownFigureLetter), false, f.seqNr);
        }
      } else if (refFig.entryDir !== refFig.exitDir) {
        if (f.entryDir === f.exitDir) {
          if (refFig.entryAtt === refFig.exitAtt) {
            var text = userText.referenceFigureExitOpp;
          } else {
            var text = userText.referenceFigureExitSame;
          }
          checkAlert (sprintf (text,
           f.unknownFigureLetter), false, f.seqNr);
        }
      }
    }
  }
}

// figureNumbers is called by checkRules. It takes a match array with
// i items {'match':xxx, 'fig':xxx} and returns the fig numbers as a
// comma-separated line. Do not add the same number multiple times.
// When there are more than 3 numbers, all sequential, then
// first...last is returned.
function figureNumbers (match) {
    var
        figs = [match[0].fig],
        sequential = true;
    for (var i = 1; i < match.length; i++) {
        if (match[i].fig > figs[figs.length - 1] + 1) sequential = false;
        if (figs.indexOf(match[i].fig) === -1) figs.push(match[i].fig);
    }
    if (sequential && figs.length > 3) {
        return (figs[0] + '...' + figs.pop())
    } else return figs.join(',');
}

// checkName creates the correct 'name' string. Priority is:
// 1) current language
// 2) no language
// 3) English
function checkName (obj) {
  if (obj['name_' + language]) {
    return obj['name_' + language];
  } else if (obj.name) {
    return obj.name;
  } else if (obj.why_en) {
    return obj.name_en;
  } else return '';
}

// checkAlert adds an alert resulting from sequence checking
// value : a value for processing
// type  : the type of checking error
// rule  : optional, literal text for the rulebook rule that invoked
//         this as in xxx-rule
function checkAlert (value, type, figNr, rule) {
  var alertFig = figNr ? '(' + figNr + ') ' : '';

  switch (type) {
    case 'maxperfig':
    case 'minperfig':
    case 'exactlyperfig':
    case 'max':
    case 'min':
    case 'exactly':
    case 'repeat':
    case 'totrepeat':
	    // reduce max total K for floating point
	    if (value === 'k' && checkCatGroup.floatingPoint) {
				alertMsgs.push(alertFig + sprintf (userText.checkAlert[type],
        checkCatGroup[value][type.replace (/^exactly/, 'max')] - checkCatGroup.floatingPoint,
        checkName(checkCatGroup[value])));
			} else {
	      alertMsgs.push(alertFig + sprintf (userText.checkAlert[type],
	        checkCatGroup[value][type.replace (/^exactly/, 'max')],
	        checkName(checkCatGroup[value])));
	    }
      if (checkCatGroup[value].rule) {
        rule = checkCatGroup[value].rule[type.replace (/^exactly/, 'max')];
      }
      break;
    case 'figmax':
    case 'figmin':
    case 'figexactly':
    case 'figrepeat':
      alertMsgs.push(alertFig + sprintf (userText.checkAlert[type],
        checkFigGroup[value][type.replace (/^fig/, '').replace (/exactly$/, 'max')],
        checkName(checkFigGroup[value])));
      if (checkFigGroup[value].rule) {
        rule = checkFigGroup[value].rule[type.replace (/^fig/, '').replace (/exactly$/, 'max')];
      }
      break;
    case 'notAllowed':
      alertMsgs.push(alertFig + sprintf (userText.checkAlert.notAllowed,
        value));
      break;
    default:
      alertMsgs.push(alertFig + value);
  }
  alertMsgRules [alertMsgs[alertMsgs.length - 1]] = rule;
}

/** Worker code ends here */

}.toString(), ')()'], {type: 'application/javascript'}));

// activate Worker
var rulesWorker = new Worker (blobURL);
delete blobURL; // clean up

// workerCallback is a global used for callback functions of form
// workerCallback [id] = function
var workerCallback = [];

// set up message receiving from main code
rulesWorker.onmessage = function (e) {
	if (e.data.callbackId) {
		// run specified callback with arguments
		workerCallback[e.data.callbackId].apply (null, e.data.arguments);
		delete (workerCallback[e.data.callbackId]);
	} else if	(e.data.runFunction) {
		// run specified function with arguments
		window[e.data.runFunction].apply (null, e.data.arguments);
	}
}

