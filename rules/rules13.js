// rules13.js version 1.3.5

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

// This file defines year (YY) specific rules

//
// The rule files contains the specifications for sequence verification.
// They also provide details about the position and harmony, allowed connectors, etc.
// the free programs are relatively easy to check. The unknowns have specific rules for every figure.
// The rulesYY.js file is the main file for year YY
// The rulesYY-ORG.js file should contain information for ORG organization (eg CIVA, IAC, glider-CIVA, etc)
// the program first loads the rulesYY file, then the rulesYY-TYPE for the sequence type.
// redirection within a file is allowed using "more=" line. Also, using "more=civa program kind" allows
// a redirection from another organization (eg IAC or BAEA) into the civa file itself.
//
// Generally, the file contains several types of line:
// [section]   - refers to specific rules for specific sequence
// (section)   - refers to specific rules which will not show up in the rules chooser
// "name=value  - where name is usually some type of rule (especiall group-xxx), and value is a count of a regular expression,
// catalogId value - where catalogID is an Aresti catalog number, and value is a listing of rules applied to it

// To write or modify these files, you'd need:
// 1. extensive knowledge of regular expressions
// 2. extensive knowledge of sequence design and catalog info
// 3. complete understanding of configuration files like this
// 4. a basic understanding of algorithms and how OpenAero processes the rules file

// How OpenAero checks a sequence:
// 1. create a form-A like list of the sequence. Each figure on a new line.
//  first number on line is the base figure.
//  next are all rolls, with 0.0.0.0(0) indicating an unused optional roll.
//  opposite or linked rolls are x,y or x;y etc. Figure is id(k)
//
//    e.g  2t4,3f line would be:   1.14.1(12) 9.1.2.2(6) 9.1.5.1(2),9.9.5.3(11)
//    2t  would be:       1.14.1(12) 9.1.2.2(6) 0.0.0.0(0)

// 2. the rulesYY for the sequence's date(year YY) are loaded.
// 3. the rulesYY-type.js file is loaded where "type" is sequence "rules" box (CIVA, glider-CIVA, etc)
// 4. all rules from the start of the file are read until the first [section]
// 5. a line "[kind program]" is searched in the file and if found, that section is read
// 6. a "more=section" line, if read, makes the program read the "more" section.

// 7. all "group-xxx" rules have a list of (figure: count) associated with them, and a total count.
// 8. [removed]
// 9. OpenAero goes over every complete full figure (line from 1 above) and in it, every individual catalog number:
//    a. every Group-xxx rule (capital G) is matched against the full figure(line), and if so, counted
//  b. every group-xxx rule (lowercase g) is matched against every catalog number, and if so, counted
//    c. group-k is special, and counts the total k instead of the number of figures
//  d. the list of figure:count (item 8) is also counted, (ignored for connectors)
//  e. if the catalog id is not matched in "allow=" nor in the list of figures (lines without "=" eg 7.2.1-2)
//  an error occur "figure xxx not allowed"
//  f. for the base figure (first figure on every line), the base rules are checked, e.g.
//     the rule "1.2.1-4 NOU" will check the NOU rule for the figure 1.2.1 line
//    g. for the base figure, if a "allow-defrules=" rule exist, it is also checked (default rules for every base figure)
//    h. for each line, if a group-xxx-minperfig or group-xxx-maxperfig rule exist, it is checked with the line count
//    i. for every grouped so counted, a total for the sequence is added.
//10. base rules are checked (item 9f and 9g above) as follows:
//  a. the list of base rules are separated by ";"
//    b. for a rule "abc" there must be a "rule-abc=xxx:yyy" line
//    c. the "xxx" is a conversion rule, a reg-ex substitute applied to the figure line, listed as "conv-xxx="
//    d. the conversion rule is applied
//  e. if "yyy" "<nn"  where nn is a number, then the conversion's result numbers are summed per element and must be below nn.
//    f. otherwise, "yyy" is a regex. if the convered result matches "yyy" an error is reported
//11. conversion rules "conv-xxx=" are used to check for individual figure limitations, mostly to limit rolls on unknown figures
//  a. the conversion regex is applied for each catalog id on the line
//    b. the conversion regex is a ";" separated list of regex=replace,
//  c. if the regex is matched, the whole catalog info is replaced by the replace string.
//  d. if the replace contains $1, $2 or $3 itself, this is replaced by the first or 2nd or 3rd () match of the regex
//12. after all the full figures been counted for, OpenAero goes through every group (figure:count) to check for repeations
//  a. any specific figure:count with count bigger than group-repeat is reported
//    b. the total repeats of figure:count within a groupd is matched agains group-totrepeat and reported
//  for example, you can have a rule for snaps ("group-snap=^9\.9") the group-repeat=3 would allow
//  any specific snap to be repeated three times. the group-totrepeat=4 would allow only 4 repeations in
//       total (ie 4 snaps each had 2 repeations, or 2 snaps with 3 repeats)
//  c. and group-min and group-max are checked and reported
//13. any seqcheck-xxx rule is matched agains the OpenAero representation of the sequence (can be used to test entry etc)
//
// Note that because group-k is special, and group-base is simply a count base figures, the basic test, e.g. for
// unlimited unknown:
//  group-k=^   # group k is special, total the K-factor per fig/seq
//  group-basefig=^[1-8]
//  basefig-max=9
//  k-max=420
//
//is a result of the application of the above rules! There are no built-in rules except the above.

// A detailed listing of all special conventions:

// Group-x=regex  define a group for a full figure (match full line)
// group-x=regex  define a group for catalog id (match rolls and base figs)
// x-min    specify minimum value for group for the whole sequence
// x-max    specify maximum -"-
// x-repeat   specify maximum repeation of identical items that have matched the group
// x-minperfig  specify a min that applies per figure
// x-maxperfig  specify a max that applies per figure
// group-k   is special, count is the K factor total
// x-name   specify group name for x, for displaying errors

// allow=regex  specify a regex to match catalog ids to allow them to be used
// 1.2.4  A;B ..  explictly allow BASE figure id. Rules A B etc are checked
// conv-x=a=b;c=d... specify a regex sub a:b c:d etc to apply to rolls cat# when rule is explictly specified on base fig
// rule-A=x:regex when A is attacehd to allow figure: apply conv-x to rolls catalog info, then regex must match.
// why-A    details of why rule has failed to apply for specific figure

// seqcheck-x=  is a complete regex that must match the OpenAero sequence itself. can be used to ensure eg cross box entry...
// more=section  continue reading rules from given section

// for example, using "group-snap=^9\.9" defines the group of inside snaps.
// you can use "snap-max=4" to specify a maximum of 4 snaps per sequence,
// snap-maxperfig=1 to allow at most one snap per figure,
// and "snap-repeat=2" to specify any snap element can be repeated at most twice.

// a [section] describes a specific sequence for checking.
// [iac unlimited free] first element is rules type, 2nd sequence type 3rd is program
// each section describes general rules using grouping, and specific rules per
// allowed figure. A list of figures is provided which are allowed explicitly,
// plus an "allow=" can be used to specify which figures to allow by regex
// using a regular expression.

// example
// conv-foconv= ^9\.1=f ; ^9\.[^1]=o
// rule-no2ndsnap=foconv: [fo],o|[fo,]+ [fo],o

// no2ndsnap-why=snap may not be the 2nd element on the first or 2nd lines
// convert to just 'f' or 'o' instead of the rolling elements before rules are applied.
// e.g  2t4,3f the line is:  1.14.1 9.1.2.2 9.1.5.1,9.9.5.3  converted to: 1.14.1 f f,o
// for conversion, a , is used for both opposite and same-direction rolls.
// for rule match, match always anchored ^ at the start of the converted seq
// if we had specificed:
// 1.14.1 no2ndsnap
// Then for 1.14.1 the 'foconv' conversion would first be applied,
// then apply rule no2ndsnap to "f f,o" so the rule
// would be true and the program will disallow the figure.

//allow-defrules= list of default rules which are applied to ALL figures
//connectors=XX/YY allowed number and total K of connectors
//unknown-letters=ABCDEFGHIJ allowed letters for Free Unknown figures
//floating-point= number of floating point that can be reduced from program
// if needed. FP is included in k-max.

// define rules global
var rules = [];

rules.push("group-k=^");// group k is special, total the K-factor per fig/seq
rules.push("group-basefig=^[1-8]");
rules.push("group-basefigex11=^(1\\.1[2-9]|1\\.11\\d|[2-8])");
rules.push("group-roll=^9\\.[1248]\\.");
rules.push("group-snap=^9\\.(9|10)");
rules.push("group-isnap=^9\\.9");
rules.push("group-osnap=^9\\.10");
rules.push("group-spin=^9\\.1[12]");
rules.push("group-uspin=^9\\.11");

rules.push("k-name=K factor");//special, counts actual K instead of figures count
rules.push("basefig-name=base figures");
rules.push("basefigex11-name=base figures except 1.11.x");
rules.push("roll-name=roll family");
rules.push("snap-name=snap roll");
rules.push("isnap-name=inside (positive) snap roll");
rules.push("osnap-name=outside (negative) snap roll");
rules.push("spin-name=spin family");
rules.push("uspin-name=upright spin family");

rules.push("group-fam1=^1\\..*");
rules.push("group-fam2=^2\\..*");
rules.push("group-fam3=^3\\..*");
rules.push("group-fam4=^4\\..*");
rules.push("group-fam5=^5\\..*");
rules.push("group-fam6=^6\\..*");
rules.push("group-fam7=^7\\..*");
rules.push("group-fam8=^8\\..*");
rules.push("group-fam9=^9\\..*");

rules.push("fam1-name=Family 1");
rules.push("fam2-name=Family 2");
rules.push("fam3-name=Family 3");
rules.push("fam4-name=Family 4");
rules.push("fam5-name=Family 5");
rules.push("fam6-name=Family 6");
rules.push("fam7-name=Family 7");
rules.push("fam8-name=Family 8");
rules.push("fam9-name=Family 9");

rules.push("group-froll=^9\\.1\\.");
rules.push("group-hroll=^9\\.2");
rules.push("group-troll=^9\\.3");
rules.push("group-qroll=^9\\.4");
rules.push("group-eroll=^9\\.8");
rules.push("group-sroll=^9\\.13");
rules.push("group-hesroll=^9\\.[2-8]");

rules.push("froll-name=family 9.1 (no-hesitation roll)");
rules.push("hroll-name=family 9.2 (half roll hesitations)");
rules.push("troll-name=1/3 roll");
rules.push("qroll-name=family 9.4 (quarter roll hesitations)");
rules.push("eroll-name=1/8's roll");
rules.push("sroll-name=super slow roll");
rules.push("hesroll-name=hesitation roll");

//super groups ("G") are matched the full catalog info. this one indicates real opposite rolls (spin-roll is not!)
//note that Group-opposite count opposites on base figures, NOT actual opposites (1,1c1,2 will be counted ONCE).

rules.push("Group-opposite=(^| )9\\.([1-9]|10)\\.[\\d()\\.]+,");
rules.push("opposite-name=opposite rolls");

//used to avoid a line-only figure (0 and -0-)
//Group-emptyline=^\s*1\.1\.[1-4]\(\d+\)\s*0\.0\.0\.0\(0\)\s*$
//emptyline-name=lines(1.1.1-1.1.4) without rolls
rules.push("Group-emptyline=^\\s*1\\.11\\.[1-4]\\(\\d+\\)\\s*0\\.0\\.0\\.0\\(0\\)\\s*$");
rules.push("emptyline-name=lines(1.1.1.1-1.1.1.4) without rolls");

//used to allow k2 and k24 but not k2 twice, etc for glider int. indicate repeations of complete figures
rules.push("Group-combined=^");
rules.push("combined-name=combination figures (base and rolls)");

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

rules.push("conv-roll=^9\\.([1248])\\.=$1; ^9\\.(9|10)\\.([6-9]|10)=F; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");

//replace rolls added to figure with single digit 1-8 for # of qtrs
rules.push("conv-qtrs=^9\\.\\d+\\.\\d.([1-8])=$1; ^0\\.=0");

// NF:1 - no flick on roll#1
// NF:2 - no flick on roll#2
// NOU:1 - no opposite or unlinked rolls on roll#1

rules.push("rule-NF=roll:[fF]");
rules.push("why-NF=no flick allowed");

rules.push("rule-NOU=roll:[,;]");
rules.push("why-NOU=no opposite or unlinked rolls allowed");

rules.push("rule-NR=roll:[^z]");
rules.push("why-NR=no roll allowed");

rules.push("rule-OS=roll:[1248fF]");
rules.push("why-OS=only spin allowed");

rules.push("rule-MAX360=qtrs:<5");
rules.push("why-MAX360=maximum of 360 degrees rotation allowed");

rules.push("rule-FAM91=roll:[^1z]");
rules.push("why-FAM91=only family 1 roll allowed");
