/* Set up the rulesWorker. This is not done through a separate Worker
 * script as this will not work when using OpenAero from a local file.
 * 
 * The rulesWorker handles all rule loading and checking in a separate
 * thread. Within the rulesWorker only one thread will run at a time,
 * so there are no concurrent operations within the Worker.
 */

var blobURL = URL.createObjectURL(new Blob(['(',

  function () {
    "use strict";
    /** Worker code starts here */

    // define worker globals
    var
      activeForm,
      alertMsgs = [],
      alertMsgRules = {},
      initializeComplete, // Used to resolve initComplete Promise
      initComplete = new Promise(function(resolve, reject) {initializeComplete = resolve}),
      language,
      fig,
      arestiToFig,
      referenceSequence = {},
      rollFig = [],
      rules,
      activeRules = false,
      rulesKFigures = {},
      regexRulesAdditionals = /^(connectors|additionals)=([0-9]+)\/([0-9]+)/,
      regexUnlinkedRolls = /[,; ](9\.[1-8]\.[0-9.]*;9\.[1-8]\.)|(9\.(9|10)\.[0-9.]*;9\.(9|10))|(9\.1[12]\.[0-9.]*;9\.1[12])/,
      superFamilies,
      userText,
      // seqCheckAvail indicates if sequence checking is available for a
      // rule/cat/seq combination
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
      additionalFig = { 'max': 0, 'totalK': 0 },    // Additional figures, max and K
      ruleSuperFamily = [],  // Array of rules for determining figure SF
      ruleSeqCheck = [],     // rules for checking complete OpenAero seq string
      sportingClass;

    // handle message events
    self.onmessage = function (e) {
      if (e.data.action == 'initialize') {
        // The 'initialize' action is the first action to be performed
        // and must be complete before other actions. Completeness state
        // is set by calling initializeComplete()
        arestiToFig = e.data.arestiToFig;
        fig = e.data.fig;
        rollFig = e.data.rollFig;
        rules = e.data.rules;
        superFamilies = e.data.superFamilies;

        // loadRulesFromDB loads the rules from indexedDB, when present
        function loadRulesFromDB (db) {
          readWriteDB (db, 'rules', 0).then(result => {
            if (result) {
              console.log('Loading rules from DB')
              rules = result.rules;
            } else console.log ('No rules in DB');
            parseRules();
            // Force reloading of the active rules in the main thread
            postMessage({
              runFunction: 'changeCombo',
              arguments: [
                'program'
              ]
            });
            initializeComplete();
          });
        }

        // Initialize indexedDB and check if there are rule updates
        initializeDB().then ((db) => {
          readWriteDB(db, 'rules', 0).then((data) => {
            // If the timestamp is more recent than the stored timestamp,
            // or if no timestamp is in the database yet, load updated rules
            // from openaero.net. The rules object is replaced by the new rules
            // when ALL rules are loaded succesfully
            const
              timeStamp = data ? data.time : 0,
              xhr = new XMLHttpRequest();
            xhr.onload = () => {
              if (xhr.responseText != timeStamp) {
                console.log('Loading rules from openaero.net...');
                // Load rulefiles
                // Use function to interpret rule files, making sure to limit scope
                // to prevent (accidental) code injection
                function newRules() {
                  return (
                    new Function(
                      `"use strict";
                      const rules=[];
                      ${xhr.responseText};
                      return rules;`
                    )()
                  )
                }
                // Processed file, replace rules object and update timestamp and
                // rules in database. openaero.php outputs the rules starting with
                // the timestamp preceded by // to assure correct parsing of the rules,
                // then the rule files themselves
                rules = newRules();
                readWriteDB (
                  db,
                  'rules',
                  0,
                  {'id': 0, 'time': xhr.responseText.match(/^\/\/(\d+)/)[1], 'rules': rules}
                )
                // Parse rules
                .then(() => {
                  parseRules();
                  initializeComplete();
                });
              } else {
                loadRulesFromDB (db);             
              }
            }
            xhr.onerror = xhr.ontimeout = () => {
              if (data) {
                loadRulesFromDB (db);
              } else {
                parseRules();
                initializeComplete();
              }
            };
            // Get collated rulefiles from openaero.php
            xhr.open("GET", `https://openaero.net/openaero.php?collateRuleFiles=${timeStamp}`);
            xhr.send();
          });
        });
      } else {
        // Any other action is only performed after initialization is complete
        initComplete.then(() => {
          switch (e.data.action) {
            case 'activeForm':
              activeForm = e.data.form;
              break;
            case 'checkAlert':
              checkAlert(
                e.data.value,
                e.data.type,
                e.data.figNr,
                e.data.rule
              );
              // send alertMessages to main script for processing
              postMessage({
                runFunction: 'addAlertsToAlertMsgs',
                arguments: [{
                  alertMsgs: [alertMsgs.pop()],
                  alertMsgRules: alertMsgRules
                }]
              });
              break;
            case 'versionUpdate':
              // When a version update has been done, update the rules in the database
              // with the new version rules, until an update from the rules at openaero.net
              // has been completed.
              initializeDB().then ((db) => {
                readWriteDB(db, 'rules', 0).then((result) => {
                  if (!result) return;
                  readWriteDB (db, 'rules', 0, {'id': 0, 'time': result.time, 'rules': e.data.rules});
                });
              });
              break;
            case 'rulesUpdateDateTime':
              rulesUpdateDateTime(e.data.callbackId);
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
              initComplete.then (() => 
                loadRules(e.data.ruleName, e.data.catName, e.data.programName));
              break;
            case 'loadedRulesFile':
              loadedRulesFile(e.data.lines);
              break;
            case 'unloadRules':
              unloadRules();
              break;
            case 'checkRules':
              checkRules(
                e.data.callbackId,
                e.data.activeSequenceText,
                e.data.figures,
                e.data.nonArestiRolls,
                e.data.multi);
              break;
            case false:
              // Wait with any of these callbacks until initialization is complete
              initComplete.then (() => 
                postMessage({ callbackId: e.data.callbackId }));
              break;
          }
        });
      }
    }

    // sprintf function using template literal
    function sprintf(format, ...args) {
      const regex = /%([%sdfbxoX])/g;
      const flags = {
        '%': '%',
        'd': 'number',
        's': 'string',
        'f': 'number',
        'b': 'binary',
        'x': 'hexadecimal',
        'X': 'hexadecimal uppercase',
      };
    
      return format.replace(regex, (match, type) => {
        const arg = args.shift();
        if (arg === undefined) {
          throw new Error('Not enough arguments for format string');
        }
    
        switch (flags[type]) {
          case 'number':
            return arg.toString();
          case 'string':
            return arg;
          case 'binary':
            return arg.toString(2);
          case 'hexadecimal':
            return arg.toString(16);
          case 'hexadecimal uppercase':
            return arg.toString(16).toUpperCase();
          default:
            return match; // For other types (e.g., '%')
        }
      });
    }

    // initializeDB initializes indexedDB
    async function initializeDB () {
      return new Promise ((resolve, reject) => {
        const request = indexedDB.open('openaero');

        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          db.createObjectStore ('rules', {keyPath: 'id'});
          e.target.transaction.oncomplete = () => {resolve (db)};
        }

        request.onsuccess = (e) => {
          const db = e.target.result;
          resolve (db);
        }

        request.onerror = (e) => {
          reject(e.target.error);
        }
      });
    }

    // readWriteDB reads or writes a value in indexedDB
    async function readWriteDB(db, objStore, key, value = false) {
      return new Promise ((resolve, reject) => {
        const store = db
          .transaction(objStore, 'readwrite')
          .objectStore (objStore);
        const req = value ? store.put (value) : store.get (key);
        req.onsuccess = (e) => resolve (req.result);
      });
    }

    // sanitizeSpaces does:
    // transform tabs to spaces, multiple to single spaces and
    // remove leading and trailing spaces (when noLT is false)
    function sanitizeSpaces(line, noLT) {
      line = line.replace(/[\t]/g, ' ').replace(/\s\s+/g, ' ');
      return (noLT ? line : line.trim());
  }

    // rulesYear retrieves the year of the rules provided in ruleName.
    // with no ruleName provided, the year of rules.js is used.
    // A space is added at the end
    function rulesYear(ruleName) {
      if (ruleName && seqCheckAvail[ruleName]) return `${seqCheckAvail[ruleName].year} `;
      // Look for the first year directive
      for (const rule of rules) {
        if (/^year\s*=\s*\d{4}/.test (rule)) return `${rule.match(/^year\s*=\s*(\d{4})/)[1]} `;
      }
      // No directive found. Return empty (this should never happen)
      return '';
    }

    // rulesUpdateDateTime returns the timestamp of the latest rules update
    function rulesUpdateDateTime (callbackId) {
      if (!callbackId) throw new Error('Callback is required for rulesUpdateDateTime');
      initializeDB().then ((db) => {
        readWriteDB(db, 'rules', 0).then((result) => {
          postMessage({
            callbackId: callbackId,
            arguments: [{time: result ? result.time : 0}]
          });
        });
      });
    }

    // loadedRulesFile will be called when a rules file has been loaded
    function loadedRulesFile(lines) {
      const start = rules.length;

      // use function to interpret rule file but make sure to limit scope
      function addRules() {
        return (
          new Function(
            `"use strict";
            const rules=[];
            ${lines};
            return rules;`)()
        )
      }

      rules.push(...addRules());
      // when new rules have been added, parse those
      if (rules.length > start) parseRules(start);
      postMessage({
        runFunction: 'alertBox',
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
    function parseRules(start = 0) {

      const
        log = [],
        sections = [];
      let year = rulesYear();

      for (let i = start; i < rules.length; i++) {
        if (/^year\s*=\s*\d{4}/.test (rules[i])) { // check for year directive
          year = rules[i].match(/^year\s*=\s*(\d{4})/)[1];
        } else if (/[\[\(]/.test (rules[i][0])) { // Check for [section]
          sections.push(rules[i].toLowerCase().replace(/[\[\(\]\)]/g, ''));
          let
            parts = rules[i].match(/^[\[\(]([^ ]+) ([^ ]+) (.+)[\]\)]$/),
            rnLower, ruleName, catName, seqName;
          if (parts && parts.length > 3) {
            // Seems like a valid section name. Set correct rule, cat and seq.
            ruleName = parts[1],
            rnLower = ruleName.toLowerCase();
            seqName = parts[parts.length - 1];
            catName = parts.splice(2, parts.length - 3).join(' ');

            log.push(rules[i]);
            // only add square-bracket names to rules
            if (!seqCheckAvail[rnLower]) {
              // remove 'glider-' in display name, if present
              ruleName = ruleName.replace(/^glider-/, '');
              seqCheckAvail[rnLower] = {
                'show': false,
                'name': ruleName,
                'cats': [],
                year: year,
              };
            }
            if (!seqCheckAvail[rnLower].cats[catName.toLowerCase()]) {
              seqCheckAvail[rnLower].cats[catName.toLowerCase()] = {
                'show': false,
                'name': catName,
                'seqs': []
              };
            }
            if (rules[i][0] == '[') {
              seqCheckAvail[rnLower].cats[catName.toLowerCase()].seqs[seqName.toLowerCase()] = seqName;
              seqCheckAvail[rnLower].show = true;
              seqCheckAvail[rnLower].cats[catName.toLowerCase()].show = true;
            } else {
              seqCheckAvail[rnLower].cats[catName.toLowerCase()].seqs[seqName.toLowerCase()] = '*' + seqName;
            }
          }
        }
      }

      // Verify that all "more=" statements refer to existing sections
      for (let i = start; i < rules.length; i++) {
        let currentSection = 'Top level';
        if (rules[i][0].match(/[\[\(]/)) currentSection = rules[i];
        const match = rules[i].toLowerCase().match(/^more[\s]*=[\s]*(.*)$/);
        if (match) {
          if (sections.indexOf(match[1]) === -1) {
            log.push(`*** Error: section ${currentSection} references non-existing section "${match[1]}"`);
          }
        }
      }

      console.log('Parsing rules');
      console.log(log);

      postMessage({ runFunction: 'updateRulesList', arguments: [seqCheckAvail] });
    }

    // loadRules loads the rules for the active sequence and stores it in
    // several arrays for fast retrieval
    function loadRules(ruleName, catName, programName) {

      // check if the rules exist. If not, unload rules
      if (!(seqCheckAvail[ruleName] &&
        seqCheckAvail[ruleName].cats[catName] &&
        seqCheckAvail[ruleName].cats[catName].seqs[programName])) {
        if (activeRules) unloadRules();
        return false;
      }

      let updatedFig = false;
      const year = rulesYear(ruleName);

      // return true if rules were already loaded
      if (activeRules && activeRules.description === `${year}${ruleName} ${catName} ${programName}`) {
        return true;
      }

      // unload previous rules
      unloadRules();

      // set rules active
      activeRules = {'description': `${year}${ruleName} ${catName} ${programName}`};

      const section = [];
      // Set parseSection to true to match the global rules
      let
        parseSection = true,
        ruleSection = (`${ruleName} ${catName} ${programName}`).toLowerCase(),
        infoCheck = []; // Seq info fields to be filled out when saving or printing
      console.log('Loading rules ' + ruleSection);
      
      // First clear or preset the variables
      checkAllowRegex = [];
      checkAllowCatId = [];
      checkCatGroup = [];
      checkFigGroup = [];
      checkRule = [];
      defRules = [];
      checkConv = [];
      additionalFig = { 'max': 0, 'totalK': 0 };
      figureLetters = '';
      ruleSuperFamily = [];
      ruleSeqCheck = {};

      // Find the sections
      for (let i = 0; i < rules.length; i++) {
        if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
          const name = rules[i].toLowerCase().replace(/[\[\]\(\)]/g, '');
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
      for (let i = 0; i < rules.length; i++) {
        rules[i] = sanitizeSpaces(rules[i]);
        // Check for [section] or (section) to match sequence type specific
        // rules
        if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
          parseSection = (i == section[ruleSection]) ? true : false;
        } else if (parseSection) {
          // when parseSection = true, continue
          // First we remove any spaces around '=', this makes parsing easier
          rules[i] = rules[i].replace(/ *= */g, '=');
          // We also remove spaces around : or ; except when it is a 'why-' or 'why_' line
          if (!/^why[-_].+/.test(rules[i])) {
            rules[i] = rules[i].replace(/ *([:;]) */g, '$1');
          }
          if (rules[i].match(/^more=/)) {
            // Apply 'more' rules
            const name = rules[i].replace('more=', '').toLowerCase();
            if (section[name]) {
              i = section[name];
              ruleSection = false; // don't go over this section again!
            }
          } else if (/^group-/.test(rules[i])) {
            // Apply 'group' rules => single catalog id match
            const newGroup = rules[i].replace(/^group-/, '').split('=');
            checkCatGroup[newGroup[0]] = { regex: RegExp(newGroup[1] + '[0-9.]*', '') };
          } else if (/^Group-/.test(rules[i])) {
            // Apply 'Group' rules => full figure (multiple catalog id) match
            const newGroup = rules[i].replace(/^Group-/, '').split('=');
            checkFigGroup[newGroup[0]] = [];
            // When regex ends with $, assume it's fully formatted.
            // Otherwise, add catch all to assure that the complete string is matched
            if (newGroup[1].slice(-1) === '$') {
              checkFigGroup[newGroup[0]].regex = RegExp(newGroup[1], 'g');
            } else {
              checkFigGroup[newGroup[0]].regex = RegExp(newGroup[1] + '[0-9\. ]*', 'g');
            }
          }
        }
      }

      parseSection = true;
      ruleSection = (`${ruleName} ${catName} ${programName}`).toLowerCase();

      // Second run, add all other rules
      for (let i = 0; i < rules.length; i++) {
        // Check for [section] or (section) to match sequence type specific rules
        if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
          parseSection = (i == section[ruleSection]) ? true : false;
        } else if (parseSection) {
          // when parseSection = true, continue
          if (/^[Cc]onv-[^=]+=/.test(rules[i])) {
            // Apply 'conv' and 'Conv' rules
            const convName = rules[i].match(/^[Cc]onv-([^=]+)/)[1];
            // log duplicate conversions, use latest
            if (checkConv[convName]) {
              console.log(`* Error: duplicate conversion "${convName}" at rulenr ${i}`);
            }
            checkConv[convName] = [];
            const convRules = rules[i].match(/^[Cc]onv-[^=]+=(.*)$/)[1].split(';');
            for (let j = 0; j < convRules.length; j++) {
              const c = convRules[j].split('=');
              // create regex, make sure it matches to the end
              checkConv[convName].push({
                'regex': new RegExp(c[0] + '.*', 'g'),
                'replace': c[1],
                'fullFigure': (/^Conv-[^=]+=/.test(rules[i])) ? true : false
              });
            }
          } else if (rules[i].match(/^more=/)) {
            // Apply 'more' rules
            const name = rules[i].replace('more=', '').toLowerCase();
            if (section[name]) {
              i = section[name];
              ruleSection = false; // don't go over this section again!
            } else {
              console.log(`*** Error: rule section "${name}" does not exist`);
            }
          } else if (rules[i].match(/^allow=/)) {
            // Apply 'allow' rules
            const
              newCatLine = rules[i].replace(/^allow=/, ''),
              newCat = newCatLine.match(/^[^\s]*/g),
              newRules = newCatLine.replace(newCat, '').split(';');
            for (let j = 0; j < newRules.length; j++) {
              newRules[j] = newRules[j].replace(/^\s+|\s+$/g, '');
            }
            checkAllowRegex.push({ 'regex': RegExp(newCat, ''), 'rules': newRules });
          } else if (rules[i].match(/^allow-defrules=/)) {
            // Apply 'allow-defrules' rules
            defRules = rules[i].replace(/^allow-defrules=/, '').replace(/[\s]+/g, '').split(';');
            // Remove multiple instances of the same rule
            defRules = defRules.filter((x, j, a) => a.indexOf(x) === j);
          } else if (rules[i].match(/^[0-9]+\./)) {
            // Apply figure number rules
            // The key of checkAllowCatId is equal to the figure number
            // The value is an array of rules that have to be applied
            let newCatLine = rules[i];
            const newCat = newCatLine.match(/^[^\s\(]*/g)[0];
            // Extract in the array newK the specified K if any
            let newK = newCatLine.match(/\([0-9,:\s]*\)/);
            if (newK) {
              newCatLine = newCatLine.replace(newK[0], '');
              // change from ':' to ',' is not necessary since rules file
              // doesn't mix powered and glider
              newK = newK[0].replace(/[\(\)\s]*/g, '').split(',');
            }
            // Create an array with rules that have to be applied to the figure
            let newRules = newCatLine.replace(newCat, '').replace(/[\s]+/g, '').split(';');
            // When there are no rules we want an empty array, whereas split
            // provides an array with one empty string
            if (newRules[0] == '') newRules = [];
            // Check if the figure string applies to multiple figures, such as 1.1.1.1-4
            // If so, make a new checkAllowCatId for each figure
            let multiple = newCat.match(/[0-9]+\-[0-9]+$/);
            if (multiple) {
              multiple = multiple[0];
              for (let j = multiple.split('-')[0]; j < (parseInt(multiple.split('-')[1]) + 1); j++) {
                checkAllowCatId[newCat.replace(multiple, '') + j] = newRules;

                if (newK && (newK[j - multiple.split('-')[0]] != '')) {
                  const figIds = arestiToFig[newCat.replace(multiple, '') + j];
                  for (let l = 0; l < figIds.length; l++) {
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
                const figIds = arestiToFig[newCat];
                for (let l = 0; l < figIds.length; l++) {
                  fig[figIds[l]].kRules = newK[0];
                }
                rulesKFigures[newCat] = true;
                console.log(`Changed K for ${newCat} to ${newK[0]}`);
                updatedFig = true;
              }
            }
          } else if (rules[i].match(/[^-]+-min=\d+$/)) {
            // Apply [group]-min rules
            const group = rules[i].replace(/-min/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].min = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].min = parseInt(group[1]);
          } else if (rules[i].match(/[^-]+-max=\d+$/)) {
            // Apply [group]-max rules
            const group = rules[i].replace(/-max/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].max = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].max = parseInt(group[1]);
          } else if (rules[i].match(/[^-]+-repeat=\d+$/)) {
            // Apply [group]-repeat rules
            const group = rules[i].replace(/-repeat/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].repeat = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].repeat = parseInt(group[1]);
          } else if (rules[i].match(/[^-]+-totrepeat=\d+$/)) {
            // Apply [group]-totrepeat rules
            const group = rules[i].replace(/-totrepeat/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].totrepeat = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].totrepeat = parseInt(group[1]);
          } else if (rules[i].match(/[^-]+-minperfig=\d+$/)) {
            // Apply [group]-minperfig rules
            const group = rules[i].replace(/-minperfig/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].minperfig = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].minperfig = parseInt(group[1]);
          } else if (rules[i].match(/[^-]+-maxperfig=\d+$/)) {
            // Apply [group]-maxperfig rules
            const group = rules[i].replace(/-maxperfig/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].maxperfig = parseInt(group[1]);
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].maxperfig = parseInt(group[1]);
          } else if (rules[i].match(/[^-]+-name=.+$/)) {
            // Apply [group]-name and seqcheck-name rules
            const group = rules[i].replace(/-name/, '').split('=');
            if (checkCatGroup[group[0]]) checkCatGroup[group[0]].name = group[1];
            if (checkFigGroup[group[0]]) checkFigGroup[group[0]].name = group[1];
            if (ruleSeqCheck[group[0]]) ruleSeqCheck[group[0]].name = group[1];
          } else if (rules[i].match(/[^-]+-name_[a-z]{2}=.+$/)) {
            // Apply [group]-name and seqcheck-name rules
            const group = rules[i].replace(/-name_[a-z]{2}/, '').split('=');
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
            const part = rules[i].match(/^([^-]+)-([^-]+)-rule=(.*)$/, '');
            if (checkCatGroup[part[1]] && checkCatGroup[part[1]][part[2]]) {
              if (!checkCatGroup[part[1]].rule) checkCatGroup[part[1]].rule = [];
              checkCatGroup[part[1]].rule[part[2]] = part[3];
            }
            if (checkFigGroup[part[1]] && checkFigGroup[part[1]][part[2]]) {
              if (!checkFigGroup[part[1]].rule) checkFigGroup[part[1]].rule = [];
              checkFigGroup[part[1]].rule[part[2]] = part[3];
            }
          } else if (rules[i].match(/-rule=.+$/)) {
            const newRuleName = rules[i].match(/^[^-]+/)[0];
            if (checkRule[newRuleName]) {
              checkRule[newRuleName].rule = rules[i].replace(/^[^=]+=/, '');
            } else if (ruleSeqCheck[newRuleName]) {
              ruleSeqCheck[newRuleName].rule = rules[i].replace(/^[^=]+=/, '');
            }
          } else if (rules[i].match(/^rule-[^=]+=.+/)) {
            // Apply rule-x rules
            const
              newRuleName = rules[i].match(/[^=]+/)[0].replace(/^rule-/, ''),
              checkRuleParts = rules[i].replace('rule-' + newRuleName + '=', ''),
              colonPos = checkRuleParts.indexOf(':'),
              check = checkRuleParts.substring(colonPos + 1);

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
            const newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why-/, '');
            if (checkRule[newRuleName]) {
              checkRule[newRuleName].why = rules[i].replace(/^[^=]+=/, '');
            }
          } else if (rules[i].match(/^why_[a-z]{2}-[^=]+=.+/)) {
            // Apply why_cc-x rules where cc = country code
            const newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why_[a-z]{2}-/, '');
            if (checkRule[newRuleName]) {
              checkRule[newRuleName][rules[i].match(/^why_[a-z]{2}/)[0]] = rules[i].replace(/^[^=]+=/, '');
            }
          } else if (rules[i].match(/^floating-point/)) {
            // Apply floating-point rules
            checkCatGroup.floatingPoint = rules[i].match(/[0-9]+/)[0];
          } else if (rules[i].match(regexRulesAdditionals)) {
            // apply Additionals rules
            const match = rules[i].match(regexRulesAdditionals);
            additionalFig.max = parseInt(match[2]);
            additionalFig.totalK = parseInt(match[3]);
          } else if (/^pos(nl)?=/.test(rules[i])) {
            // Split positioning options on ;
            const
              posOptions = rules[i].replace(/^pos[^=]*=/, '').split(';'),
              pos = [];
            // Go through positioning options. When there are multiple, each
            // should have a description. Format 'p+h:d; p+h:d; ...'
            // First match is description, second positioning and harmony K.
            for (const posOpt of posOptions) {
              const matches = posOpt.trim().match(/^([0-9]+\+?[0-9]*):?(.+)?$/);
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
            const val = rules[i].replace(/ /g, '').match(/=(.*)/)[1];
            if (superFamilies[val.toLowerCase()]) {
              ruleSuperFamily = superFamilies[val.toLowerCase()];
            } else {
              for (const family of val.split(';')) {
                ruleSuperFamily.push([
                  new RegExp(family.split(':')[0]),
                  family.split(':')[1],
                ]);
              }
            }
          } else if (rules[i].match(/^seqcheck-/)) {
            const newRuleName = rules[i].split('=')[0].replace(/^seqcheck-/, '');
            ruleSeqCheck[newRuleName] = { 'regex': new RegExp(rules[i].split('=')[1]) };
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
        for (const car of checkAllowRegex) {
          for (const f of fig) {
            if (f && f.aresti && car.regex.test(f.aresti) && !(f.aresti in checkAllowCatId)) {
              checkAllowCatId[f.aresti] = (car.rules.length == 0) ? [] : car.rules;
            }
          }

          // rollFig is not iterable, use ...in..., not ...of...
          for (const key in rollFig) {
            if (car.regex.test(rollFig[key].aresti) && !(rollFig[key].aresti in checkAllowCatId)) {
              checkAllowCatId[rollFig[key].aresti] = [];
            }
          }
        }
      }

      postMessage({
        runFunction: 'activateRules',
        arguments: [{
          additionalFig: additionalFig,
          checkAllowCatId: checkAllowCatId,
          checkCatGroup: checkCatGroup,
          figureLetters: figureLetters,
          ruleSuperFamily: ruleSuperFamily,
          formStyle: /^(glider-)?(iac|imac)$/.test(ruleName) ? ruleName.match(/(iac|imac)/)[1] : 'civa',
          infoCheck: infoCheck,
          activeRules: activeRules,
          rulesKFigures: rulesKFigures,
          updatedFig: (updatedFig ? fig : false)
        }]
      });

      return true;
    }

    // unloadRules will set rules to inactive and do some checks
    function unloadRules() {
      console.log('Clearing rules');

      let updatedFig = false;
      for (const f of fig) {
        if (f && f.kRules) {
          updatedFig = true;
          delete (f.kRules);
        }
      }

      for (const key in rollFig) {
        if (rollFig[key].kRules) {
          updatedFig = true;
          delete (rollFig[key].kRules);
        }
      }
      rulesKFigures = {};
      postMessage({
        runFunction: 'unloadRules',
        arguments: [updatedFig ? fig : false]
      });

      activeRules = false;
    }

    // checkRules will check a complete sequence against the loaded rules
    // and produce alerts where necessary.
    // The required callback is called with a single argument object
    // containing alertMsgs, alertMsgRules and log
    function checkRules(callbackId, activeSequenceText, figures, nonArestiRolls, multi) {

      if (!callbackId) throw new Error('Callback is required for checkRules');

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

      log.push(`Testing sequence:${activeSequenceText}`);
      alertMsgs = [];

      // first we check for rules that are ALWAYS valid, i.e. Aresti
      // Catalogue rules
      for (let i = 0; i < figures.length; i++) {
        let seqNr = figures[i].seqNr;
        if (seqNr) {
          // some alerts are disabled when nonArestiRolls is checked
          if (!nonArestiRolls) {
            // check for more than two roll elements on a roll position
            // Aresti Catalogue Part I - 17
            if (/[,;][^ ]*[,;]/.test(figures[i].checkLine)) {
              checkAlert(userText.alert.maxTwoRotationElements,
                false,
                seqNr,
                'Aresti Catalogue Part I - 17');
            }
            // check for same direction same type unlinked rolls
            // Aresti Catalogue Part I - 19
            if (regexUnlinkedRolls.test(figures[i].checkLine)) {
              checkAlert(userText.alert.unlinkedSameNotAllowed,
                false,
                seqNr,
                'Aresti Catalogue Part I - 19');
            }
            // check if a spin is preceded by another roll element
            // Aresti Catalogue 27
            if (/[,;]9\.1[12]\./.test(figures[i].checkLine)) {
              checkAlert(userText.alert.spinFirst,
                false,
                seqNr,
                'Aresti Catalogue 27');
            }
          }
          // check if there is a roll on family 1.1.1
          // Aresti Catalogue 7.2
          if (/^1\.1\.1[^0]+0\.0\.0\.0$/.test(figures[i].checkLine)) {
            checkAlert(userText.alert.family111RollMissing,
              false,
              seqNr,
              'Aresti Catalogue 7.2');
          }
        }
      }

      // see if there are active rules. If not, skip rule checking
      if (!activeRules) {
        log.push('Rules: no');
      } else {
        log.push(`Rules: ${activeRules.description}`);

        for (let i = 0; i < figures.length; i++) {
          const aresti = figures[i].aresti;
          if (aresti) {
            const
              k = figures[i].k,
              // fullCheckLine contains all aresti numbers, including base figure
              fullCheckLine = figures[i].checkLine;
            let
              // Define checkline WITHOUT base figure (only rolls). Content can change during rule checking
              checkLine = figures[i].checkLine.replace(/^[0-9.]* ?/, '');
            const
              // Build checkArray from rolls, with # as placeholder for splitting
              checkArray = checkLine.replace(/([ ,;])/g, "#$1#").split('#');

            figNr++;
            // format thisFig for logging
            let thisFig = fullCheckLine.replace(/;/g, ',');
            for (let j = 0; j < aresti.length; j++) {
              thisFig = thisFig.replace(
                new RegExp('(' + aresti[j].replace(/\./g, '\\.') + ')( |,|$)'),
                '$1(' + k[j] + ')$2'
              );
            }
            log.push('========= Figure #' + figNr + ': ' + thisFig);
            // Check if the figure is an additional
            if (figures[i].additional) {
              // no rule checking for additionals
              additionals++;
              log.push('is additional? True');
            } else {
              log.push('is additional? False');
              let figK = 0;
              let groupFigMatch = [];
              // Walk through the elements of the figure
              if (figCount[aresti[0]]) {
                figCount[aresti[0]]++;
              } else figCount[aresti[0]] = 1;
              log.push(`Group-combined: Count=${figNr} Fig count=${figCount[aresti[0]]}`);
              elemCount = [];
              for (let j = 0; j < aresti.length; j++) {
                log.push('---- Element: ' + aresti[j]);
                figK += parseInt(k[j]);
                figureK += parseInt(k[j]);
                if (elemCount[aresti[j]]) {
                  elemCount[aresti[j]]++;
                } else elemCount[aresti[j]] = 1;
                log.push('Group-k: Count=' + figureK + ' Elem count=' +
                  elemCount[aresti[j]]);
                // Check all group rules on all elements
                for (const group in checkCatGroup) {
                  if ((group != 'k') && (group != 'floatingPoint')) {
                    const match = aresti[j].match(checkCatGroup[group].regex);
                    if (match) {
                      if (!groupFigMatch[group]) groupFigMatch[group] = [];
                      groupFigMatch[group].push(match[0]);
                      if (!groupMatch[group]) groupMatch[group] = [];
                      groupMatch[group].push({ 'match': match[0], 'fig': figNr });
                      log.push('group-' + group +
                        ': Count=' + groupFigMatch[group].length +
                        ' Elem count=' + elemCount[aresti[j]]);
                    }
                    // Do checks after the last aresti code of the figure has been processed
                    if (j == (aresti.length - 1)) {
                      if (groupFigMatch[group]) {
                        log.push('group-' + checkCatGroup[group].name +
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
                    checkAlert(aresti[j], 'notAllowed', figNr);
                    //log.push ('Not allowed:' + aresti[j]);
                  }
                }
              }
              // Run rule checks on specific allowed figures if the
              // checkAllowCatId object is not empty
              if (Object.keys(checkAllowCatId).length > 0) {
                //log.push ('Checking rules on specific allowed figures');
                const arestiNr = fullCheckLine.split(' ')[0];
                if ((arestiNr in checkAllowCatId) && (checkAllowCatId[arestiNr][0] !== '')) {
                  //log.push('Allowed base figure:' + arestiNr);
                  // Apply rules to the figure
                  // Run the checks on the rolls

                  // set the excluded rules to empty at the start
                  excludeRules = [];
                  for (let ii = 0; ii < checkAllowCatId[arestiNr].length; ii++) {
                    // copy checkArray to check
                    let check = checkArray.slice(0);
                    // forElement may be used to add element number to 'why'
                    let forElement = '';
                    let rule = checkAllowCatId[arestiNr][ii];
                    // Check if the rule matches ^xxx format. If so, this marks
                    // exclusion of a rule for a figure and should be handled as
                    // such
                    if (rule.substring(0, 1) == '^') {
                      if (/:/.test(rule)) {
                        log.push('Referenced rule ' + rule + ' is not allowed. ' +
                          'You can\'t specify a specific roll position while ' +
                          'excluding a rule("^" and ":" together)');
                      } else excludeRules.push(rule.substring(1));
                      continue;
                    }
                    log.push('-basefig rule: ' + rule);
                    // check if this is a rule of form rule:nr
                    let ruleSplit = rule.split(':');
                    rule = ruleSplit[0];
                    // if it is a rule of form rule:nr, only put this roll
                    // element in check
                    if (ruleSplit[1]) {
                      let rollNr = 1;
                      check = [];
                      for (const ca of checkArray) {
                        if (rollNr == ruleSplit[1]) {
                          if (ca == ' ') break;
                          check.push(ca);
                        } else {
                          if (ca == ' ') rollNr++;
                        }
                      }
                      forElement = userText.forElement + ruleSplit[1];
                    }
                    // Apply conversions to the Aresti number before checking the rule
                    if (checkRule[rule]) { // make sure rule was defined
                      if (checkRule[rule].conv) {
                        const conversion = checkRule[rule].conv;
                        if (!checkConv[conversion]) {
                          console.log(`* Error: conversion ${conversion}, used in rule ${rule}, is undefined`);
                        } else {
                          log.push('Apply: ' + checkRule[rule].conv);
                          logLine = 'Converted: ' + check.join('') + ' => ';
                          for (const conv of checkConv[conversion]) {
                            if (conv.fullFigure) {
                              log.push('Full figure conversions are only supported in "allow-defrules"')
                            } else {
                              // Check for individual roll Aresti number conversions
                              for (let m = 0; m < check.length; m++) {
                                if (!check[m].match(/[ ,;]/)) {
                                  check[m] = check[m].replace(conv.regex, conv.replace);
                                }
                              }
                            }
                          }
                        }
                        checkLine = check.join('');

                        log.push(logLine + checkLine);
                      }

                      if (checkRule[rule].regex) {
                        if (checkLine.match(checkRule[rule].regex)) {
                          checkAlert(why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
                          log.push('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                        }
                      } else if (checkRule[rule].less) {
                        let sum = 0;
                        for (let l = check.length - 1; l >= 0; l--) {
                          if (/^[0-9]/.test(check[l])) sum += parseInt(check[l]);
                          if ((check[l] == ' ') || (l == 0)) {
                            if (sum >= parseInt(checkRule[rule].less)) {
                              checkAlert(why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
                              log.push('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                            }
                            sum = 0;
                          }
                        }
                      } else if (checkRule[rule].totalLess) {
                        let sum = 0;
                        for (const c of check) if (/^[0-9]/.test(c)) sum += parseInt(c);
                        if (sum >= parseInt(checkRule[rule].totalLess)) {
                          checkAlert(why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
                          log.push('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                        }
                      }
                    } else console.log(`Referenced rule "${rule}" does not exist`);

                  }
                  // Check default rules when applicable
                  if (defRules != []) {
                    let check = [];
                    for (let k = 0; k < defRules.length; k++) {
                      // copy fullCheckLine to checkLine
                      const defRule = defRules[k];
                      // Skip rule if it doesn't exist
                      if (!checkRule[defRule]) {
                        console.log(`Rule ${defRule} from allow-defrules doesn't exist`)
                        continue;
                      }
                      // check if this is a rule of form rule:nr
                      const ruleSplit = defRule.split(':');
                      const rule = ruleSplit[0];
                      // check if the rule is in excludeRules. If so, skip it
                      if (excludeRules.includes(rule)) {
                        excludeRules.splice(excludeRules.indexOf(rule), 1);
                        continue;
                      }
                      // apparently not in excludeRules
                      log.push('-basefig rule: ' + rule);
                      // Apply conversions to the Aresti number before checking the rule
                      if (checkRule[rule].conv) {
                        const conversion = checkRule[rule].conv;
                        if (!checkConv[conversion]) {
                          console.log(`* Error: conversion ${conversion}, used in rule ${rule}, is undefined`);
                        } else {
                          log.push('Apply: ' + checkRule[rule].conv);
                          let logLine;
                          if (checkConv[conversion][0].fullFigure) {
                            checkLine = fullCheckLine.slice();
                            logLine = 'Converted: ' + checkLine + ' => ';
                            // Check for full figure conversions
                            for (const conv of checkConv[conversion]) {
                              checkLine = checkLine.replace(conv.regex, conv.replace);
                            }
                          } else {
                            // Check for individual roll Aresti number conversions
                            const check = checkArray.slice();
                            logLine = 'Converted: ' + fullCheckLine + ' => ';
                            for (const conv of checkConv[conversion]) {
                              for (let m = 0; m < check.length; m++) {
                                if (!/[ ,;]/.test(check[m])) {
                                  check[m] = check[m].replace(conv.regex, conv.replace);
                                }
                              }
                            }
                            checkLine = check.join('');
                          }
                          log.push(logLine + checkLine);
                        }
                      }
                      if (checkRule[rule].regex) {
                        if (checkLine.match(checkRule[rule].regex)) {
                          checkAlert(why(rule), 'rule', figNr, checkRule[rule].rule);
                          log.push('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                        }
                      } else if (checkRule[rule].less) {
                        let sum = 0;
                        for (let l = check.length - 1; l >= 0; l--) {
                          if (/^[0-9]/.test(check[l])) {
                            sum += parseInt(check[l]);
                          }
                          if ((check[l] == ' ') || (l == 0)) {
                            if (sum >= parseInt(checkRule[rule].less)) {
                              checkAlert(why(rule), 'rule', figNr, checkRule[rule].rule);
                              log.push('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                            }
                            sum = 0;
                          }
                        }
                      } else if (checkRule[rule].totalLess) {
                        let sum = 0;
                        for (const c of check) if (/^[0-9]/.test(c)) sum += parseInt(c);
                        if (sum >= parseInt(checkRule[rule].totalLess)) {
                          checkAlert(why(rule), 'rule', figNr, checkRule[rule].rule);
                          log.push('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
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
              for (const group in checkFigGroup) {
                const match = fullCheckLine.match(checkFigGroup[group].regex);
                if (match) {
                  if (!groupMatch[group]) groupMatch[group] = [];
                  for (const m of match) {
                    groupMatch[group].push({ 'match': m, 'fig': figNr });
                  }
                }
              }
              if (checkCatGroup.k) {
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
        }

        // add additionals to figureK where applicable
        if ((additionals > 0) && (additionalFig.max > 0)) {
          figureK += additionalFig.totalK;
        }
        // check for total min/max K
        if (checkCatGroup.k) {
          if ('min' in checkCatGroup.k) {
            if (figureK < checkCatGroup.k.min) {
              if (('max' in checkCatGroup.k) &&
                (checkCatGroup.k.min === checkCatGroup.k.max)) {
                checkAlert('k', 'exactly');
              } else checkAlert('k', 'min');
            }
          }
          if ('max' in checkCatGroup.k) {
            if (figureK > checkCatGroup.k.max) checkAlert('k', 'max');
          }
        }

        // Run checks on maximum and minimum occurrence of a group (catalog ID)
        // Go through all groups
        log.push('====== Testing global repeat/min/max ======');
        for (const group in checkCatGroup) {
          // Did we have a match on this group?
          if (groupMatch[group]) {
            //console.log('* Match');
            //console.log(checkCatGroup[group]);
            // Check for max and min occurrences of the group
            if ('max' in checkCatGroup[group]) {
              log.push('testing group ' + group + '-max=' +
                checkCatGroup[group].max + ' val=' + groupMatch[group].length);
              if (groupMatch[group].length > checkCatGroup[group].max) {
                errFigs = figureNumbers(groupMatch[group]);
                checkAlert(group, 'max', errFigs);
                log.push('*** Error: Maximum ' + checkCatGroup[group].max +
                  ' of group ' + group + '(' + errFigs + ')');
              }
            }
            if ('min' in checkCatGroup[group]) {
              log.push('testing group ' + group + '-min=' +
                checkCatGroup[group].min + ' val=' + groupMatch[group].length);
              if (groupMatch[group].length < checkCatGroup[group].min) {
                if (('max' in checkCatGroup[group]) &&
                  (checkCatGroup[group].min === checkCatGroup[group].max)) {
                  checkAlert(group, 'exactly');
                } else checkAlert(group, 'min');
                log.push('*** Error: Minimum ' + checkCatGroup[group].min +
                  ' of group ' + group);
              }
            }
            // Check for repeats of the exact same catalog id when necessary
            if (('repeat' in checkCatGroup[group]) ||
              ('totrepeat' in checkCatGroup[group])) {
              //console.log('Check repeat');
              const matches = [];
              for (const thisMatch of groupMatch[group]) {
                if (matches[thisMatch.match]) {
                  matches[thisMatch.match].push({ 'match': thisMatch.match, 'fig': thisMatch.fig });
                } else {
                  matches[thisMatch.match] =
                    [{ 'match': thisMatch.match, 'fig': thisMatch.fig }];
                }
              }
              if ('repeat' in checkCatGroup[group]) {
                for (const match in matches) {
                  if (matches[match].length > checkCatGroup[group].repeat) {
                    errFigs = figureNumbers(matches[match]);
                    checkAlert(group, 'repeat', errFigs);
                    log.push('*** Error: Repeat ' + checkCatGroup[group].repeat +
                      ' of group ' + group + '(' + errFigs + ')');
                  }
                }
              }
              if ('totrepeat' in checkCatGroup[group]) {
                let count = 0;
                for (const match in matches) {
                  if (matches[match].length > 1) {
                    count++;
                  } else delete matches[match];
                }
                if (count > checkCatGroup[group].totrepeat) {
                  errFigs = [];
                  for (const match of matches) {
                    for (const m in match) errFigs.push(m);
                  }
                  errFigs = figureNumbers(errFigs);
                  checkAlert(group, 'totrepeat', errFigs);
                  log.push('*** Error: Total Repeat ' + checkCatGroup[group].totrepeat +
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
              log.push('*** Error: Minimum ' + checkCatGroup[group].min +
                ' of group ' + group);
            }
          }
        }
        // Run checks on maximum and minimum occurrence of a Group (complete figure)
        // Go through all groups
        for (const group in checkFigGroup) {
          // Did we have a match on this group?
          if (groupMatch[group]) {
            // Check for min and max occurrences of the group
            if (('min' in checkFigGroup[group]) &&
              (groupMatch[group].length < checkFigGroup[group].min)) {
              if (('max' in checkFigGroup[group]) &&
                (checkFigGroup[group].min === checkFigGroup[group].max)) {
                checkAlert(group, 'figexactly');
              } else checkAlert(group, 'figmin');
              log.push('*** Error: Minimum ' + checkFigGroup[group].min +
                ' of group ' + group);
            }
            if (('max' in checkFigGroup[group]) &&
              (groupMatch[group].length > checkFigGroup[group].max)) {
              errFigs = figureNumbers(groupMatch[group]);
              checkAlert(group, 'figmax', errFigs);
              log.push('*** Error: Maximum ' + checkFigGroup[group].max +
                ' of group ' + group + '(' + errFigs + ')');
            }
            // Check for repeats of the exact same figure when necessary
            if ('repeat' in checkFigGroup[group]) {
              const matches = [];
              for (const thisMatch of groupMatch[group]) {
                if (matches[thisMatch.match]) {
                  matches[thisMatch.match].push({
                    'match': thisMatch.match,
                    'fig': thisMatch.fig
                  });
                } else {
                  matches[thisMatch.match] =
                    [{ 'match': thisMatch.match, 'fig': thisMatch.fig }];
                }
              }
              for (const match of matches) {
                if (checkFigGroup[group].repeat && (match.length > checkFigGroup[group].repeat)) {
                  errFigs = figureNumbers(match);
                  checkAlert(group, 'figrepeat', errFigs);
                  log.push('*** Error: Repeat ' + checkFigGroup[group].repeat +
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
              log.push('*** Error: Minimum ' + checkFigGroup[group].min +
                ' of group ' + group);
            }
          }
        }

        // Check complete sequence string on seqcheck directives
        // By default, when there is NO match for any of the directives, an alert is created
        // When the name starts with !, this logic is reversed

        if (ruleSeqCheck != {}) {
          for (const name in ruleSeqCheck) {
            if ((name[0] != '!' && !ruleSeqCheck[name].regex.test(activeSequenceText)) ||
              name[0] == '!' && ruleSeqCheck[name].regex.test(activeSequenceText)) {
              checkAlert(
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

        let
          remaining = figureLetters ? figureLetters : '',
          ufl = [];

        for (const f of figures) {
          const l = f.unknownFigureLetter;
          if (f.aresti) {
            if (l) {
              if ((figureLetters + 'L').indexOf(l) === -1) {
                const msg = sprintf(
                  userText.figureLetterNotAllowed,
                  f.seqNr,
                  l);
                alertMsgs.push(msg);
                log.push('*** Error: ' + msg);
              } else {
                if (ufl[l]) {
                  ufl[l].push(f.seqNr);
                } else {
                  ufl[l] = [f.seqNr];
                }
                remaining = remaining.replace(l, '');
              }
            }
          }
        }

        for (const l in ufl) {
          if ((ufl[l].length > 1) && (l != 'L')) {
            const msg = sprintf(userText.FUletterMulti, ufl[l].join(','), l);
            alertMsgs.push(msg);
            log.push('*** Error: ' + msg);
          }
        }
        // see if we have remaining (=unused) letters
        if (remaining.length) {
          const figs = [];
          for (const f of figures) {
            if (!f.unknownFigureLetter && f.aresti) figs.push(f.seqNr);
          }
          // nuisance warning in Designer, so hide there
          if (figs.length && (activeForm !== 'FU')) {
            const msg = sprintf(userText.noFigureLetterAssigned, figs.join(','));
            alertMsgs.push(msg);
            log.push('*** Error: ' + msg);
          }

          const msg = sprintf(userText.unusedFigureLetters, remaining);
          alertMsgs.push(msg);
          log.push('*** Error: ' + msg);
        }

        // when additionals are allowed, at least one is required
        if (additionalFig.max && !additionals) {
          checkAlert(
            userText.additionalFigureRequired,
            false,
            false,
            (sportingClass === 'glider') ?
              "Sporting Code Section 6 Part II, 3.3.3.8" :
              "Sporting Code Section 6 Part I, 2.3.1.4&nbsp;c"
          );
        }

        // check Reference sequence if provided
        if (figureLetters && referenceSequence.figures &&
          (!multi.processing || multi.useReference)) {
          checkReferenceSequence(figures);
        }
      }
      postMessage({
        callbackId: callbackId,
        arguments: [{ alertMsgs: alertMsgs, alertMsgRules: alertMsgRules, log: log }]
      });
    }

    // checkReferenceSequence checks the active sequence against a reference
    // sequence and provides appropriate warnings
    function checkReferenceSequence(figures) {
      for (const f of figures) {
        if (f.aresti &&
          f.unknownFigureLetter &&
          (f.unknownFigureLetter !== 'L') &&
          referenceSequence.figures[f.unknownFigureLetter]) {
          const refFig = referenceSequence.figures[f.unknownFigureLetter];
          let text;
          if (refFig.checkLine !== f.checkLine) {
            checkAlert(sprintf(userText.referenceFigureDifferent,
              f.unknownFigureLetter), false, f.seqNr);
          } else if (refFig.entryDir === refFig.exitDir) {
            if (f.entryDir !== f.exitDir) {
              if (refFig.entryAtt === refFig.exitAtt) {
                text = userText.referenceFigureExitSame;
              } else {
                text = userText.referenceFigureExitOpp;
              }
              checkAlert(sprintf(text,
                f.unknownFigureLetter), false, f.seqNr);
            }
          } else if (refFig.entryDir !== refFig.exitDir) {
            if (f.entryDir === f.exitDir) {
              if (refFig.entryAtt === refFig.exitAtt) {
                text = userText.referenceFigureExitOpp;
              } else {
                text = userText.referenceFigureExitSame;
              }
              checkAlert(sprintf(text,
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
    function figureNumbers(match) {
      let
        figs = [match[0].fig],
        sequential = true;
      for (let i = 1; i < match.length; i++) {
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
    function checkName(obj) {
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
    function checkAlert(value, type, figNr, rule) {
      const alertFig = figNr ? `(${figNr})` : '';

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
            alertMsgs.push(alertFig + sprintf(userText.checkAlert[type],
              checkCatGroup[value][type.replace(/^exactly/, 'max')] - checkCatGroup.floatingPoint,
              checkName(checkCatGroup[value])));
          } else {
            alertMsgs.push(alertFig + sprintf(userText.checkAlert[type],
              checkCatGroup[value][type.replace(/^exactly/, 'max')],
              checkName(checkCatGroup[value])));
          }
          if (checkCatGroup[value].rule) {
            rule = checkCatGroup[value].rule[type.replace(/^exactly/, 'max')];
          }
          break;
        case 'figmax':
        case 'figmin':
        case 'figexactly':
        case 'figrepeat':
          alertMsgs.push(alertFig + sprintf(userText.checkAlert[type],
            checkFigGroup[value][type.replace(/^fig/, '').replace(/exactly$/, 'max')],
            checkName(checkFigGroup[value])));
          if (checkFigGroup[value].rule) {
            rule = checkFigGroup[value].rule[type.replace(/^fig/, '').replace(/exactly$/, 'max')];
          }
          break;
        case 'notAllowed':
          alertMsgs.push(alertFig + sprintf(userText.checkAlert.notAllowed,
            value));
          break;
        default:
          alertMsgs.push(`${alertFig} ${value}`);
      }
      alertMsgRules[alertMsgs[alertMsgs.length - 1]] = rule;
    }

    /** Worker code ends here */

  }.toString(), ')()'], { type: 'application/javascript' }));

// activate Worker
const rulesWorker = new Worker(blobURL);
delete blobURL; // clean up

// workerCallback is a global used for callback functions of form
// workerCallback [id] = function
const workerCallback = [];

// set up message receiving from main code
rulesWorker.onmessage = function (e) {
  if (e.data.callbackId) {
    // run specified callback with arguments
    workerCallback[e.data.callbackId].apply(null, e.data.arguments);
    delete (workerCallback[e.data.callbackId]);
  } else if (e.data.runFunction) {
    // run specified function with arguments
    window[e.data.runFunction].apply(null, e.data.arguments);
  }
}