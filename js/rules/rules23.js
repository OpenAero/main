// rules23.js

// This file is part of OpenAero.

//  OpenAero was originally designed by Ringo Massa and built upon ideas
//  of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

//  OpenAero is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.

/***********************************************************************
 * This file defines year (YY) specific rules
 * 
 * 
 * The rule files contains the specifications for sequence verification.
 * They also provide details about the position and harmony, connectors, etc.
 * the free programs are relatively easy to check. The unknowns have
 * specific rules for every figure.
 * The rulesYY.js file is the main file for year YY.
 * The rulesYY-ORG.js file should contain information for ORG organization
 * (eg CIVA, IAC, glider-CIVA, etc).
 * Redirection within a file is allowed using "more=" line. Also, using
 * "more=civa program kind" allows a redirection from another organization
 * (eg IAC or BAEA) into the civa rules themselves.
 * 
 * Generally, the file contains several types of line:
 * [section]        refers to specific rules for specific sequence
 * (section)        refers to specific rules which will not show up in the
 *                  rules chooser
 * name=value       where name is usually some type of rule (such as
 *                  group-xxx), and value is a count of a regular expression,
 * catalogId value  where catalogID is an Aresti catalog number, and value
 *                  is a listing of rules applied to it
 * 
 * To write or modify these files, you'll need:
 * 1. extensive knowledge of regular expressions
 * 2. extensive knowledge of sequence design and catalog info
 * 3. complete understanding of configuration files like this
 * 4. a basic understanding of algorithms and how OpenAero processes the
 *    rules files
 * 
 * How OpenAero checks a sequence:
 * On OpenAero startup:
 *  1. The latest rulesYY file is loaded and the general rules are stored
 *  2. All rulesYY-rules.js files are loaded, where "rules" is the sequence
 *     "rules" box (CIVA, glider-CIVA, etc), and stored.
 *  3. OpenAero goes through all lines of rules and appends them to sequence
 *     types (e.g.: CIVA Unlimited Free Known)
 *  3. The sequence type is determined by [section] or (section) statements.
 *  4. When a "more=section" line is found, appending of rules continues from
 *     "section".
 *  5. Rules that are loaded later for the same sequence type (e.g.: CIVA
 *     Unlimited Free Known) override earlier rules of the same type.
 * When a sequence is checked:
 *  1. create a form-A like list of the sequence. Each figure on a new line.
 *   The first number on the line is the Aresti code of the base figure.
 *   Next are all rolls, with 0.0.0.0 indicating an unused optional roll.
 *   Opposite or linked rolls are x,y or x;y etc. Figure is id(k)
 * 
 *     e.g  2t4,3f line would be:   1.2.3.1 9.1.2.2 9.1.5.1,9.9.5.3
 *     2t  would be:                1.2.3.1 9.1.2.2 0.0.0.0
 * 
 *  2. the rules for the sequence type are activated.
 *  3. all "group-xxx" rules have a list of (figure: count) associated
 *     with them, and a total count.
 *  4. OpenAero goes over every complete full figure (line from 1 above)
 *     and in it, every individual catalog number:
 *     a. every Group-xxx rule (capital G) is matched against the full
 *        figure(line), and if so, counted
 *     b. every group-xxx rule (lowercase g) is matched against every
 *        catalog number, and if so, counted
 *     c. group-k is special, and counts the total k instead of the
 *        number of figures
 *     d. the list of figure:count (item 8) is also counted, (ignored
 *        for connectors)
 *     e. if the catalog id is not matched in "allow=" nor in the list
 *        of figures (lines without "=" eg 7.2.1-2) an alert occurs
 *        "figure xxx not allowed"
 *     f. for the base figure (first figure on every line), the base
 *        rules are checked, e.g. the rule "1.2.1-4 NOU" will check the
 *        NOU rule for the figure 1.2.1.1-4 line. Using the ^ symbol before
 *        a rule will disable this rule as set in allow_defrules (item g
 *        below). E.g.: "7.4.1.3-4 ^UnlimitedNO3f" disables checking of
 *        default rule UnlimitedNO3f for figures 7.4.1.3-4.
 *     g. for the base figure, if a "allow-defrules=" rule exists, it is
 *        also checked (default rules for every base figure)
 *     h. for each line, if a group-xxx-minperfig or group-xxx-maxperfig
 *        rule exists, it is checked with the line count
 *     i. for every group so counted, a total for the sequence is added.
 * 5.  base rules are checked (item 9f and 9g above) as follows:
 *     a. the list of base rules are separated by ";"
 *     b. for a rule "abc" there must be a "rule-abc=xxx:yyy" line
 *     c. the "xxx" is a conversion rule, a reg-ex substitute applied to
 *        the figure line, listed as "conv-xxx="
 *     d. the conversion rule is applied
 *     e. if "yyy" "<nn"  where nn is a number, then the conversion's
 *        result numbers are summed per element and must be below nn.
 *     f. otherwise, "yyy" is a regex. if the convered result matches
 *        "yyy" an alert is reported
 * 6.  conversion rules "conv-xxx=" are used to check for individual
 *     figure limitations, mostly to limit rolls on unknown figures
 *     a. the conversion regex is applied for each catalog id on the line
 *     b. the conversion regex is a ";" separated list of regex=replace,
 *     c. if the regex is matched, the whole catalog info is replaced by
 *        the replace string.
 *     d. if the replace contains $1, $2 or $3 itself, this is replaced
 *        by the first or 2nd or 3rd () match of the regex
 * 7.  after all the full figures been counted for, OpenAero goes through
 *     every group (figure:count) to check for repetitions
 *     a. any specific figure:count with count bigger than group-repeat
 *        is reported
 *     b. the total repeats of figure:count within a group is matched
 *        against group-totrepeat and reported.
 *        For example, you can have a rule for snaps ("group-snap=^9\.9")
 *        the group-repeat=3 would allow any specific snap to be repeated
 *        three times. The group-totrepeat=4 would allow only 4
 *        repetitions in total (ie 4 snaps each had 2 repetitions, or
 *        2 snaps with 3 repeats)
 *     c. and group-min and group-max are checked and reported
 * 8.  any seqcheck-xxx rule is matched agains the OpenAero
 *     representation of the sequence (can be used to test entry etc)
 * 
 * Note that because group-k is special, and group-base is simply a
 * count of base figures, the basic test, e.g. for
 * unlimited unknown:
 * group-k=^   # group k is special, total the K-factor per fig/seq
 * group-basefig=^[1-8]
 * basefig-max=9
 * k-max=420
 * 
 * is a result of the application of the above rules! There are no
 * built-in rules except the above.
 * 
 * A detailed listing of all special conventions:
 * 
 * Group-x=regex  define a group for a full figure (match full line)
 * group-x=regex  define a group for catalog id (match rolls and base figs)
 * x-min          specify minimum value for group for the whole sequence
 * x-max          specify maximum -"-
 * x-repeat       specify maximum repeation of identical items that have
 *                matched the group
 * x-minperfig    specify a min that applies per figure
 * x-maxperfig    specify a max that applies per figure
 * group-k        is special, count is the K factor total
 * x-name         specify group name for x, for displaying errors
 * x-name_xx      the same, but for language xx
 * x-y-rule       the catalog or sporting code rule upon which the error
 *                of test y is based, for example:
 *                k-maxperfig-rule=Sporting Code Section 6 Part I, 4.3.4.1
 * 
 * allow=regex        specify a regex to match catalog ids to allow them to be used
 * 1.2.4  A;B ..      explictly allow BASE figure id. Rules A B etc are checked
 * conv-x=a=b;c=d;... specify a regex sub a:b c:d etc to apply to rolls
 *                    cat# when rule is explictly specified on base fig
 * Conv-x=a=b;c=d;... specify a regex sub a:b c:d etc to convert full figure
 *                    cat numbers when rule is specified under allow-defrules
 *                    e.g.: Conv-onlyRollOn1111=^1\\.1\\.1\\.1.*=y;^[0-9.]* 9\\..*=n
 *                          rule-onlyRollOn1111=onlyRollOn1111:n
 * rule-A=x:regex     when A is attached to allow figure: apply conv-x to
 *                    rolls catalog info, then regex must match.
 * why-A              details of why rule has failed to apply for specific figure
 * why_xx-A           the same, but for language xx
 * 
 * seqcheck-x=    is a complete regex that must match the OpenAero sequence
 *                itself. can be used to ensure eg cross box entry...
 * allow-defrules=
 *   List of default rules which are applied to ALL figures.
 *   These can be disabled on a per-figure basis by using ^ symbol.
 *   E.g.: 7.4.1.3-4 ^UnlimitedNO3f
 *   It is possible to apply conversions for complete figures (base and rolls)
 *   to these rules using Conv-x=a=b;c=d;... (see above).
 * additionals=XX/YY
 *   allowed number and total K of additionals
 * unknown-letters=ABCDEFGHIJ
 *   allowed letters for Free Unknown figures
 * sf=r1:f1;r2:f2;r3:f3;...
 *   Super Families for the programme. Each rX is a regex. A match will
 *   result in SF fX being assigned. Only the FIRST match is applied so
 *   the order matters!
 * floating-point=
 *   number of floating point that can be reduced from program if needed.
 *   FP is included in k-max.
 * demo=
 *   add sequence string to Library menu
 * reference=
 *   fill reference sequence with supplied sequence string
 * logo=image name
 *   define a specific logo, name must exactly match logo image name in logo.js
 *   e.g. CIVA or GermanAerobatics
 *   
 * more=section
 *   continue reading rules from given section
 * 
 * for example, using "group-snap=^9\.9" defines the group of inside snaps.
 * you can use "snap-max=4" to specify a maximum of 4 snaps per sequence,
 * snap-maxperfig=1 to allow at most one snap per figure,
 * and "snap-repeat=2" to specify any snap element can be repeated at most twice.
 * 
 * a [section] describes a specific sequence for checking.
 * [iac unlimited free] first element is rules type, 2nd sequence type 3rd is program
 * each section describes general rules using grouping, and specific rules per
 * allowed figure. A list of figures is provided which are allowed explicitly,
 * plus an "allow=" can be used to specify which figures to allow by regex
 * using a regular expression.
 * 
 * example
 * conv-foconv= ^9\.1=f ; ^9\.[^1]=o
 * rule-no2ndsnap=foconv: [fo],o|[fo,]+ [fo],o
 * 
 * no2ndsnap-why=snap may not be the 2nd element on the first or 2nd lines
 * convert to just 'f' or 'o' instead of the rolling elements before rules are applied.
 * e.g  2t4,3f the line is:  1.14.1 9.1.2.2 9.1.5.1,9.9.5.3  converted to: 1.14.1 f f,o
 * for conversion, a , is used for opposite and a ; for same-direction rolls.
 * For rule match, match always anchored ^ at the start of the converted seq
 * if we had specificed:
 * 1.14.1 no2ndsnap
 * Then for 1.14.1 the 'foconv' conversion would first be applied,
 * then apply rule no2ndsnap to "f f,o" so the rule
 * would be true and the program will disallow the figure.
 * 
 *************************************************************************/

// define rules global
var rules = [

"group-k=^",// group k is special, total the K-factor per fig/seq
"group-basefig=^[1-8]",
"group-basefigex11=^(1\\.1\\.[2-9]|1\\.1\\.1\\d|[2-8])",
"group-roll=^9\\.[1248]\\.",
"group-snap=^9\\.(9|10)",
"group-isnap=^9\\.9",
"group-osnap=^9\\.10",
"group-spin=^9\\.1[12]",
"group-uspin=^9\\.11",

"k-name=K factor",//special, counts actual K instead of figures count
"basefig-name=base figures",
"basefigex11-name=base figures except 1.1.1.x",
"roll-name=roll family",
"snap-name=flick roll",
"isnap-name=inside (positive) flick roll",
"osnap-name=outside (negative) flick roll",
"spin-name=spin family",
"uspin-name=upright spin family",

"k-name_fr=Coef K",//special, counts actual K instead of figures count
"basefig-name_fr=figures de base",
"basefigex11-name_fr=figures de base sauf 1.1.1.x",
"roll-name_fr=tonneau(x)",
"snap-name_fr=déclenché(s)",
"isnap-name_fr=déclenché(s) positif(s)",
"osnap-name_fr=déclenché(s) negatif(s)",
"spin-name_fr=vrille(s)",
"uspin-name_fr=vrille(s) positive(s)",
 
"k-name_de=K-Faktor",//special, counts actual K instead of figures count
"basefig-name_de=Basisfiguren",
"basefigex11-name_de=Basisfiguren außer 1.1.1.x",
"roll-name_de=Rollen",
"snap-name_de=Strömungsabriss-Rolle",
"isnap-name_de=Gerissene Rolle",
"osnap-name_de=Gestoßene Rolle",
"spin-name_de=Bauchtrudler",
"uspin-name_de=Rückentrudler",  

"group-fam1=^1\\..*",
"group-fam2=^2\\..*",
"group-fam3=^3\\..*",
"group-fam4=^4\\..*",
"group-fam5=^5\\..*",
"group-fam6=^6\\..*",
"group-fam7=^7\\..*",
"group-fam8=^8\\..*",
"group-fam9=^9\\..*",

"fam1-name=Family 1",
"fam2-name=Family 2",
"fam3-name=Family 3",
"fam4-name=Family 4",
"fam5-name=Family 5",
"fam6-name=Family 6",
"fam7-name=Family 7",
"fam8-name=Family 8",
"fam9-name=Family 9",

"fam1-name_fr=Famille 1",
"fam2-name_fr=Famille 2",
"fam3-name_fr=Famille 3",
"fam4-name_fr=Famille 4",
"fam5-name_fr=Famille 5",
"fam6-name_fr=Famille 6",
"fam7-name_fr=Famille 7",
"fam8-name_fr=Famille 8",
"fam9-name_fr=Famille 9",

"fam1-name_de=Familie 1",
"fam2-name_de=Familie 2",
"fam3-name_de=Familie 3",
"fam4-name_de=Familie 4",
"fam5-name_de=Familie 5",
"fam6-name_de=Familie 6",
"fam7-name_de=Familie 7",
"fam8-name_de=Familie 8",
"fam9-name_de=Familie 9",

"group-froll=^9\\.1\\.",
"group-hroll=^9\\.2",
"group-troll=^9\\.3",
"group-qroll=^9\\.4",
"group-eroll=^9\\.8",
"group-sroll=^9\\.13",
"group-hesroll=^9\\.[2-8]",

"froll-name=Family 9.1 (no-hesitation roll)",
"hroll-name=Family 9.2 (half roll hesitations)",
"troll-name=1/3 roll",
"qroll-name=family 9.4 (quarter roll hesitations)",
"eroll-name=1/8's roll",
"sroll-name=super slow roll",
"hesroll-name=hesitation roll",

"froll-name_fr=Famille 9.1 (tonneaux sans facette)",
"hroll-name_fr=Famille 9.2 (tonneaux à 2 facettes)",
"troll-name_fr=Famille 9.3 (tonneaux à 3 facettes)",
"qroll-name_fr=Famille 9.4 (tonneaux à 4 facettes)",
"eroll-name_fr=Famille 9.8 (tonneaux à 8 facettes)",
"sroll-name_fr=tonneaux super lents",
"hesroll-name_fr=tonneaux à facettes",
  
"froll-name_de=Familie 9.1 (Kontinuierliche Rollen)",
"hroll-name_de=Familie 9.2 (Zwei-Zeiten-Rollen)",
"troll-name_de=Familie 9.3 (Drei-Zeiten-Rollen)",
"qroll-name_de=Familie 9.4 (Vier-Zeiten-Rollen)",
"eroll-name_de=Familie 9.8 (Acht-Zeiten-Rollen)",
"sroll-name_de=Superlangsame Rollen",
"hesroll-name_de=Zeiten-Rollen",

// super groups ("G") are matched the full catalog info. this one
// indicates real opposite rolls (spin-roll is not!)
// note that Group-opposite counts opposites on base figures, NOT actual
// opposites (1,1c1,2 will be counted ONCE).

"Group-opposite=(^| )9\\.([1-9]|10)\\.[\\d()\\.]+,",
"opposite-name=opposite rolls",
"opposite-name_fr=rotation(s) alternée(s)",
"opposite-name_de=Gegenläufige Rollen",

// used to allow k2 and k24 but not k2 twice, etc for glider int.
// indicate repetitions of complete figures
"Group-combined=^",
"combined-name=combination figures (base and rolls)",
"combined-name_fr=figures complétes (base et rotations)",
"combined-name_de=Figurkombination (Grundfigur und Rollenelement)",

//#####################################################################
//##### UNKNOWNS ALLOWED FIGURES RULES ################################
//#####################################################################

// Conversion rules for checking validity
// These generic rules can be used by different rule sets for checking validity
//replace rolls added to figure with single letter/digit, matched by "rule-"s
// 1 continous (no hesitation) roll
// 2 half roll
// 4 qtr-roll roll
// 8 8-point roll
// s spin
// f flick
// F flick "hard way" flick
// z no roll(zero)

"conv-roll=^9\\.([1248])\\.=$1; ^9\\.(9|10)\\.([6-9]|10)=F; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^9\\.13=t ; ^0\\.=z",

//replace rolls added to figure with single digit 1-8 for # of qtrs
"conv-qtrs= ^9.1[1|2].1.[4-8] = 0; ^9\\.\\d+\\.\\d+.([1-8])=$1; ^0\\.=0 ",

// NF:1 - no flick on roll#1
// NF:2 - no flick on roll#2
// NOU:1 - no opposite or unlinked rolls on roll#1

"rule-NF=roll:[fF]",
"why-NF=no flick allowed",
"why_fr-NF=déclenché interdit",
"why_de-NF=Keine Gerissene/Gestoßene erlaubt",

"rule-NOU=roll:[,;]",
"why-NOU=no opposite or unlinked rolls allowed",
"why_fr-NOU=rotations combinées interdites",
"why_de-NOU=Keine gegenläufigen oder unverbundenen Rollen erlaubt",

"rule-NR=roll:[^z ]",
"why-NR=no roll allowed",
"why_fr-NR=rotation interdite",
"why_de-NR=Keine Rolle erlaubt",

"rule-OS=roll:[1248fF]",
"why-OS=only spin allowed",
"why_fr-OS=seule vrille autorisée",
"why_de-OS=nur Trudler erlaubt",

"rule-MAX360=qtrs:<5",
"why-MAX360=maximum of 360 degrees rotation allowed",
"why_fr-MAX360=maximum de 360° de rotation permis",
"why_de-MAX360=maximal 360° Rotation erlaubt",

"rule-FAM91=roll:[^1z,]",
"why-FAM91=only family 1 roll allowed",
"why_fr-FAM91=uniquement tonneau sans facette permis",
"why_de-FAM91=nur Rollen der Familie 9.1 erlaubt"

// close the initial rules array definition
];
