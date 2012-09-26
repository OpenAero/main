// allowed.js 1.0.0

// This file is part of OpenAero.

//  OpenAero is Free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.
    
// This file defines all the rules for sequence checking.
// Every rule is encoded in the following manner: rules.push("*ENCODING*");
// The 'push' term is not related to pushing or pulling in aerobatics but is necessary for the software
// The *ENCODING* part is of the following format:
// This format should be strictly maintained to make sure the software works!

// First, we define the rules array
// var rules will contain most rules. Thy are parsed by the software later
var rules = []
// var checkConv contains all conversions of Aresti numbers to short code, done by regex
var checkConv = []
//
// this contains a list of allowed and/or required figures for specific programs
// program action to check a sequence:
// 1. create a form-A like list of figures. each figure on a new line. first number on line is 
//    the base figure. next are all rolls, 0.0.0.0(0) indicate optional roll not used.
//	 opposite or linked rolls are x,y or x;y etc.
//    e.g  2t4,3f line would be: 1.14.1 9.1.2.2 9.1.5.1,9.9.5.3
//
// 2. go over each line(ie complete figure) and test all rules.
// 3. apply Group (capital) for the full line. same rules as group(lowercase g) below but the match
//    is for the full line
// 4. apply "group" for each catalog# that matches. this works on 1-8 and 9.x.
//    All matched figures are counted total and repeation.
//	 for the figure, a -minperfig and -maxperfig can be set (eg to allow max 1 snap per figure)
//	 For the sequence,a  "-min", "-max" and "-repeat" maybe specified for the complete sequence
// 5. for each base figure, find if it is in the "allowed" list and if so apply the allowed list checks
// 
// Group-x=regex		define a group for a full figure (match full line)
// group-x=regex		define a group for catalog id (match rolls and base figs)
// x-min				specify minimum value for group for the whole sequence
// x-max				specify maximum -"-
// x-repeat			specify maximum repeation of identical items that have matched the group
// x-minperfig		specify a min that applies per figure 
// x-maxperfig		specify a max that applies per figure 
// group-k			is special, count is the K factor total
// x-name			specify group name for x, for displaying errors

// allow=regex		specify a regex to match catalog ids to allow them to be used
// 1.2.4  A;B ..		explictly allow BASE figure id. Rules A B etc are checked
// conv-x=a=b;c=d... specify a regex sub a:b c:d etc to apply to rolls cat# when rule is explictly specified on base fig
// rule-A=x:regex	when A is attacehd to allow figure: apply conv-x to rolls catalog info, then regex must match.
// why-A				details of why rule has failed to apply for specific figure

// seqcheck-x=		is a complete regex that must match the Olan sequence itself. can be used to ensure eg cross box entry...
// more=section		continue reading rules from given section. Only jumps, no subroutines!

// for example, using "group-snap=^9\\.(09)" defines the group of inside snaps.
// you can use "snap-max=4" to specify a maximum of 4 snaps per sequence,
// snap-maxperfig=1 to allow at most one snap per figure,
// and "snap-repeat=2" to specify any snap element can be repeated at most twice.

// a (section) describes a part of sequence checking that is not shown in the 'Sequence info' lists.
// These are usually common sections, like (both Advanced Free)

// a [section] describes a specific sequence for checking which will be shown in the 'Sequence info' lists.
// [IAC Unlimited Free]	first element is rules type, 2nd sequence type 3rd is program
// each section describes general rules using grouping, and specific rules per 
// allowed figure. A list of figures is provided which are allowed explicitly,
// plus an "allow=" can be used to specify which figures to allow by regex
// using a regular expression.

// conversions are added directly in the checkConv array in the form:
// checkConv['NAME'] = []
// checkConv['NAME'].push ({'regex': REGEX, 'replace': REPLACE})
// conversions can be specified in rules and will be applied before checking the rule
//
// example:
// checkConv['foconv'] = []
// checkConv['foconv'].push ({'regex': /9\.1/g, 'replace': 'f'})
// checkConv['foconv'].push ({'regex': /9\\.[^1]/g, 'replace': 'o'})
// rules.push("rule-no2ndsnap=foconv: [fo],o|[fo,]+ [fo],o")

// no2ndsnap-why=snap may not be the 2nd element on the first or 2nd lines
// convert to just 'f' or 'o' instead of the rolling elements before rules are applied. 
// e.g  2t4,3f the line is:	 1.14.1 9.1.2.2 9.1.5.1,9.9.5.3  converted to: 1.14.1 f f,o
// for conversion, a , is used for both opposite and same-direction rolls.
// for rule match, match always anchored ^ at the start of the converted seq
// if we had specificed:
// 1.14.1 no2ndsnap
// Then for 1.14.1 the 'foconv' conversion would first be applied, 
// then apply rule no2ndsnap to "f f,o" so the rule
// would be true and the program will disallow the figure.

//allow-defrules=	list of default rules which are applied to ALL figures 
//floating-point=	number of floating point that can be reduced from program if needed. FP is included in k-max.

rules.push("group-k=^"); // group k is special, total the K-factor per fig/seq
rules.push("group-basefig=^[1-8]");
rules.push("group-basefigex111=^(1\\.1\\.(^1|1\\d)|1\\.(^1|1\\d)|[2-8])");
rules.push("group-roll=^9\\.[1248]\\.");
rules.push("group-snap=^9\\.(9|10)\\.");
rules.push("group-isnap=^9\\.9\\.");
rules.push("group-osnap=^9\\.10\\.");
rules.push("group-spin=^9\\.1[12]\\.");
rules.push("group-uspin=^9\\.11\\.");

rules.push("group-fam1=^1\\..*");
rules.push("group-fam2=^2\\..*");
rules.push("group-fam3=^3\\..*");
rules.push("group-fam4=^4\\..*");
rules.push("group-fam5=^5\\..*");
rules.push("group-fam6=^6\\..*");
rules.push("group-fam7=^7\\..*");
rules.push("group-fam8=^8\\..*");
rules.push("group-fam9=^9\\..*");

rules.push("group-froll=^9\\.1\\.");
rules.push("group-hroll=^9\\.2");
rules.push("group-troll=^9\\.3");
rules.push("group-qroll=^9\\.4");
rules.push("group-eroll=^9\\.8");
rules.push("group-sroll=^9\\.13");
rules.push("group-hesroll=^9\\.[2-8]");

//super groups ("G") are matched the full catalog info. this one indicates real opposite rolls (spin-roll is not!)
//note that Group-opposite count opposites on base figures, NOT actual opposites (1,1c1,2 will be counted ONCE). 

rules.push("Group-opposite=(^| )9\\.([1-9]|10)\\.[\\d\\.]+,");
rules.push("opposite-name=opposite rolls");

//used to avoid a line-only figure (0 and -0-)
rules.push("Group-emptyline=^1\\.1\\.1\\.[1-4] 0");
rules.push("emptyline-name=lines(1.1.1.1-1.1.1.4) without rolls");

//used to allow k2 and k24 but not k2 twice, etc for glider int. indicate repeations of complete figures
rules.push("Group-combined=^			");
rules.push("combined-name=combination figures (base and rolls)");

rules.push("k-name=K factor"); //special, counts actual K instead of figures count
rules.push("basefig-name=base figures");
rules.push("basefigex111-name=base figures except 1.1.1.x");
rules.push("roll-name=roll family");
rules.push("snap-name=snap roll");
rules.push("isnap-name=inside (positive) snap roll");
rules.push("osnap-name=outside (negative) snap roll");
rules.push("spin-name=spin family");
rules.push("uspin-name=upright spin family");


rules.push("fam1-name=Family 1");
rules.push("fam2-name=Family 2");
rules.push("fam3-name=Family 3");
rules.push("fam4-name=Family 4");
rules.push("fam5-name=Family 5");
rules.push("fam6-name=Family 6");
rules.push("fam7-name=Family 7");
rules.push("fam8-name=Family 8");
rules.push("fam9-name=Family 9");

rules.push("froll-name=family 9.1 (no-hesitation roll)");
rules.push("hroll-name=family 9.2 (half roll hesitations)");
rules.push("troll-name=1/3 roll");
rules.push("qroll-name=family 9.4 (quarter roll hesitations)");
rules.push("eroll-name=1/8's roll");
rules.push("sroll-name=super slow roll");
rules.push("hesroll-name=hesitation roll");


//#####################################################################
//##### UNKNOWNS ALLOWED FIGURES RULES ################################
//#####################################################################

//conversion rules for checking validity
//replace rolls added to figure with single letter/digit, matched by "rule-"s
// spin=s flick=f roll=r   no roll=z

checkConv['rfsz'] = []
checkConv['rfsz'].push ({'regex':/9\.[1248]\.[0-9]\.[0-9]/g,'replace':'r'})
checkConv['rfsz'].push ({'regex':/9\.(9|10)\.[0-9]\.[0-9]/g,'replace':'f'})
checkConv['rfsz'].push ({'regex':/9\.1[12]\.[0-9]\.[0-9]/g,'replace':'s'})
checkConv['rfsz'].push ({'regex':/0\.0\.0\.0/g,'replace':'z'})
//rules.push("conv-rfsz=9.[1248].[0-9].[0-9]=r; 9.(9|10).[0-9].[0-9]=f; 9.1[12].[0-9].[0-9]=s ; 0.0.0.0=z");

// Replace 1/4,3/4 horizontal roll as last element by 'a'
// Replace all remaining unlinked/linked rolls by 'n'
// Used for checking BAeA/VINK Intermediate Unknown
checkConv['q3qlvl'] = []
checkConv['q3qlvl'].push ({'regex':/9\.1\.3\.1,9\.1\.3\.3$/g, 'replace':'a'})
checkConv['q3qlvl'].push ({'regex':/9\.\d\.\d\.\d[,;]/g, 'replace':'n'})

// NF1 - no flick on roll#1
// NF2 - no flick on roll#2
// NOU1 - no opposite or unlinked rolls on roll#1
// LRH1 - limit roll to 1/2 on roll#1

rules.push("rule-NF1=rfsz:^[^ ]*f");
rules.push("rule-NF2=rfsz:^[^ ]+ [^ ]*f");
rules.push("rule-NF3=rfsz:^[^ ]+ [^ ]+ [^ ]*f");
rules.push("rule-NF4=rfsz:^[^ ]+ [^ ]+ [^ ]+ [^ ]*f");

rules.push("why-NF1=no flick is allowed on the first roll element");
rules.push("why-NF2=no flick is allowed on the second roll element");
rules.push("why-NF3=no flick is allowed on the third roll element");
rules.push("why-NF4=no flick is allowed on the fourth roll element");

rules.push("rule-NOU =rfsz: ^([a-z][,;][a-z])|([a-z,;]+ [a-z][,;][a-z])|([a-z,;]+ [a-z,;]+ [a-z][,;][a-z])|([a-z,;]+ [a-z,;]+ [a-z,;]+ [a-z][,;][a-z])");
rules.push("rule-NOU1 =rfsz: ^[a-z][,;][a-z]");
rules.push("rule-NOU2 =rfsz: ^[a-z,;]+ [a-z][,;][a-z]");
rules.push("rule-NOU3 =rfsz: ^[a-z,;]+ [a-z,;]+ [a-z][,;][a-z]");
rules.push("rule-NOU4 =rfsz: ^[a-z,;]+ [a-z,;]+ [a-z,;]+ [a-z][,;][a-z]");

rules.push("why-NOU =no opposite or unlinked rolls allowed on non-horizontal lines");
rules.push("why-NOU1 =no opposite or unlinked rolls allowed on non-horizontal lines");
rules.push("why-NOU2 =no opposite or unlinked rolls allowed on non-horizontal lines");
rules.push("why-NOU3 =no opposite or unlinked rolls allowed on non-horizontal lines");
rules.push("why-NOU4 =no opposite or unlinked rolls allowed on non-horizontal lines");

rules.push("rule-IntermediateNOU =q3qlvl: n");
rules.push("why-IntermediateNOU =no opposite or unlinked rolls allowed, except 9.1.3.1+9.1.3.4 in 1.1.1.3-4");

rules.push("rule-NR1 = rfsz:^[^z]");
rules.push("rule-NR2 = rfsz:^[^ ]+ [^z]");
rules.push("rule-NR3 = rfsz:^[^ ]+ [^ ]+ [^z]");
rules.push("rule-NR4 = rfsz:^[^ ]+ [^ ]+ [^ ]+ [^z]");

rules.push("why-NR1  =no roll allowed for first rolling element ");
rules.push("why-NR2  =no roll allowed for second rolling element");
rules.push("why-NR3  =no roll allowed for third rolling element");
rules.push("why-NR4  =no roll allowed for fourth rolling element");

rules.push("rule-OS1 = rfsz:^[rf]");
rules.push("rule-OS2 = rfsz:^[^ ]+ [rf]");
rules.push("rule-OS3 = rfsz:^[^ ]+ [^ ]+ [rf]");
rules.push("rule-OS4 = rfsz:^[^ ]+ [^ ]+ [^ ]+ [rf]");

rules.push("why-OS1  =only spin allowed for first rolling element ");
rules.push("why-OS2  =only spin allowed for second rolling element");
rules.push("why-OS3  =only spin allowed for third rolling element");
rules.push("why-OS4  =only spin allowed for fourth rolling element");

rules.push("rule-OHS = 9\\.11\\.1\\.[57]");

rules.push("why-OHS  =only 1 or 1 1/2 spin allowed in this figure");

/*
 * Change rfsz to apply to quarter rolls!
rules.push("rule-NQ  = rfsz:q");
rules.push("rule-NQ1 = rfsz:^[q]");
rules.push("rule-NQ2 = rfsz:^[^ ]+ [q]");
rules.push("rule-NQ3 = rfsz:^[^ ]+ [^ ]+ [q]");
rules.push("rule-NQ4 = rfsz:^[^ ]+ [^ ]+ [^ ]+ [q]");

rules.push("why-NQ   =no quarter roll hesitations allowed in this figure");
rules.push("why-NQ1  =no quarter roll hesitations allowed for first rolling element");
rules.push("why-NQ2  =no quarter roll hesitations allowed for second rolling element");
rules.push("why-NQ3  =no quarter roll hesitations allowed for third rolling element");
rules.push("why-NQ4  =no quarter roll hesitations allowed for fourth rolling element");
*/

//#######################################################################
//##### KNOWNS ##########################################################
//#######################################################################
rules.push("[CIVA Unlimited ProgramQ]");
rules.push("more=CIVA Unlimited Known");
rules.push("[CIVA Advanced ProgramQ]");
rules.push("more=CIVA Advanced Known");

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Sportsman Known]");
rules.push("poslj=6");
rules.push("allow=^([1-8]|0\\.[12]|9\\.([12348]|11))"); //allow cloverleaf
rules.push("[IAC Intermediate Known]");
rules.push("poslj=8");
rules.push("allow=^([1-8]|9\\.([123489]|1[12]))");
rules.push("[IAC Advanced Known]");
rules.push("poslj=12");
rules.push("allow=^([1-8]|9\\.([123489]|1[12]))");
*/

rules.push("[CIVA Advanced Known]");
rules.push("poslj=10");
rules.push("posnl=40");
rules.push("allow=^([1-8]|9\\.([123489]|1[12]))");

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Unlimited Known]");
rules.push("poslj=20");
rules.push("allow=^[1-9]");
*/

rules.push("[CIVA Unlimited Known]");
rules.push("poslj=10");
rules.push("posnl=60");
rules.push("allow=^[1-9]");

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC glider Sportsman Known]");
rules.push("poslj=15");
rules.push("allow=^[0-9]");

rules.push("[IAC glider Intermediate Known]");
rules.push("poslj=15");
rules.push("allow=^[1-9]");

rules.push("[IAC glider Unlimited Known]");
rules.push("poslj=20");
rules.push("allow=^[1-9]");
rules.push("[CIVA glider Unlimited Known]");
rules.push("poslj=10");
rules.push("posnl=35");
rules.push("allow=^[1-9]");

rules.push("[CIVA glider Advanced Unknown]");
rules.push("poslj=10");
rules.push("posnl=35");
rules.push("k-min=130");
rules.push("k-max=145");
rules.push("floating-point=3");
rules.push("allow=^[1-9]");

rules.push("[CIVA glider Unlimited Unknown]");
rules.push("poslj=10");
rules.push("posnl=35");
rules.push("k-min=175");
rules.push("k-max=190");
rules.push("floating-point=3");
rules.push("allow=^[1-9]");
*/

//######################################################################################
//##### IAC SPORTS & INTERMEDIATE FREE #################################################
//######################################################################################

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Sportsman Free]");
rules.push("poslj=6");
rules.push("floating-point=1");
rules.push("k-max=126"); //value good for 2009 only inc f.p
rules.push("basefig-max=25"); //fixme? there is no actual limit

rules.push("group-loop8s=^7\\.([1-9]\\.|10)");
rules.push("loop8s-name=loops and eights");
rules.push("loop8s-min=1");

rules.push("fam8-min=1");
rules.push("roll-min=1");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("basefigex111-repeat=1");
rules.push("fam9-repeat=1");

rules.push("allow=^([1-9]|0.[12])"); //all figures + clover leaf

rules.push("[BAeA Intermediate Free]");
rules.push("basefig-max=11");
rules.push("k-max=160 ");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("fam1-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");

rules.push("snap-min=1");
rules.push("spin-min=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program


rules.push("[IAC Intermediate Free]");
rules.push("poslj=8");
rules.push("basefig-max=15");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");
rules.push("floating-point=1");
rules.push("k-max=191"); //inc fp


rules.push("fam5-min=1");
rules.push("fam8-min=1");

rules.push("group-loop8s=^7\\.([1-9]\\.|10)");
rules.push("loop8s-name=loops and eights");
rules.push("loop8s-min=1");

rules.push("roll-min=1");
rules.push("snap-min=1 ");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("basefigex111-repeat=1");
rules.push("fam9-repeat=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program
*/

//######################################################################################
//##### VINK INTERMEDIATE FREE #########################################################
//######################################################################################

//
// Modified for 2013 WL + RM
//

rules.push("[VINK Intermediate Free]");
rules.push("posnl=20");
rules.push("basefig-max=11");
rules.push("k-max=170");

rules.push("fam1-min=1");

rules.push("group-roller=^2\\.[1-4]\\.[^1]");
rules.push("roller-name=Rolling turn, family 2.1 to 2.4");
rules.push("roller-min=1");

rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("snap-min=1 ");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("basefig-repeat=1");
rules.push("fam9-repeat=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program

//######################################################################################
//##### CIVA YAK52 FREE ################################################################
//######################################################################################

rules.push("[CIVA Yak52 Free]");
rules.push("posnl=40");
rules.push("basefig-max=12");
rules.push("k-max=225");

rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("eroll-min=1");
rules.push("snap-min=2");
rules.push("spin-min=1");

rules.push("group-roller=^2\\.[1-4]\\.[^1]");
rules.push("roller-name=Rolling turn, family 2.1 to 2.4");
rules.push("roller-min=1");

rules.push("emptyline-max=0");

rules.push("basefig-repeat=1");
rules.push("fam9-repeat=1");

rules.push("opposite-min=1"); //one opposite roll is required!

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program

//######################################################################################
//##### ADVANCED FREE #################################################################
//######################################################################################

//note IAC rules are different than CIVA: 7.1-7.10 req (not just fam7)

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Advanced Free]");
rules.push("group-loop8s=^7\\.([1-9]\\.|10)");
rules.push("loop8s-name=loops and eights");
rules.push("loop8s-min=1");

rules.push("emptyline-max=0");
rules.push("floating-point=1");
rules.push("k-max=301"); //inc fp
rules.push("poslj=12");
rules.push("basefig-max=12"); // changed from 15 only in 2008
rules.push("more=both Advanced Free");
*/
rules.push("[CIVA Advanced Free]");
rules.push("posnl=40"); //no line judges
rules.push("poslj=10");
rules.push("k-max=300");
rules.push("basefig-max=12");
//for 2006 basefig-max=15
rules.push("more=both Advanced Free");

rules.push("(both Advanced Free)");
rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("group-roller=^2\\.[1-4]\\.[^1]");
rules.push("roller-name=Rolling turn, family 2.1 to 2.4");

rules.push("roller-min=1");
rules.push("fam1-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("eroll-min=1");
rules.push("snap-min=2");
//for 2006 span-min=1
rules.push("spin-min=1 ");
rules.push("spin-max=1");

//for 2006: opposite-min=0
rules.push("opposite-min=1"); //one opposite roll is required!

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program


//################################################################################
//##### GLIDERS FREE #############################################################
//################################################################################

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC glider Intermediate Free]");
rules.push("poslj=15");
rules.push("floating-point=3");

rules.push("k-max=143"); //140 offically but upto 143 allowed on form A with FP

rules.push("seqcheck-upstart=^\\s*((e\\a+|\\[.*?\\]|{.*?}|\".*?\"|-?\\d*%|(-?\\d*[<>^/])+)\\s*)*[~+`]*[^-]");
rules.push("upstart-name=Sequence must start flying upright");

rules.push("seqcheck-upend=[\\da-z.`'][`~+]*>?\\s*$");
rules.push("upend-name=Sequence must end flying upright");

rules.push("fam2-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("froll-min=1");
rules.push("uspin-min=1");

rules.push("emptyline-max=0");

//maximum repeation of same base+roll figures
rules.push("combined-repeat=1 ");

rules.push("allow=^([1-9]|0.[012])"); //all figures + clover leaf & wingover

rules.push("[IAC glider Unlimited Free]");
rules.push("poslj=35");
rules.push("spin-max=1");
rules.push("emptyline-max=0");
rules.push("more=both glider Unlimited Free");

rules.push("[IAC glider Advanced Free]");
rules.push("poslj=35");
rules.push("spin-max=1");
rules.push("emptyline-max=0");
rules.push("more=both glider Advanced Free");

rules.push("[CIVA glider Advanced Free]");
rules.push("poslj=15");
rules.push("posnl=50");
rules.push("more=both glider advaced Free");

rules.push("[CIVA glider Unlimited Free]");
rules.push("poslj=15");
rules.push("posnl=50");
rules.push("more=both glider Unlimited Free");

rules.push("(both glider Unlimited Free)");

rules.push("basefig-max=10");
rules.push("floating-point=3");
//for 2006: k-max=223	#220 offically but upto 223 allowed on form A

rules.push("k-max=233"); //230 offically but upto 233 allowed on form A

rules.push("seqcheck-upend=[\\da-z][~+]*>?\\s*$");
rules.push("upend-name=Sequence must end flying upright");

rules.push("group-roller=^2.([2-4].[^1]|1.3)");
rules.push("roller-name=Rolling turn, family 2.1 to 2.4 at least one roll");

rules.push("group-froll2=^9\\.1\\.\\d\\.[^1]	");
rules.push("froll2-name=slow roll at least 1/2");

rules.push("roller-min=1");
rules.push("fam5-min=1");
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

rules.push("froll2-min=1");
rules.push("hesroll-min=1"); //CIVA is unclear "two successive elements of a hes roll"
rules.push("isnap-min=1");
rules.push("osnap-min=1");
//for 2006: spin-min=1
//for 2006: sroll-min=1

rules.push("basefigex111-repeat=1");
//froll-repeat=99	note: rolls can be repeated
rules.push("hesroll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program


rules.push("(both glider Advanced Free)");

rules.push("basefig-max=10");
rules.push("floating-point=3");

rules.push("k-max=163"); //160 offically but upto 163 allowed on form A

rules.push("seqcheck-upend=[\\da-z][~+]*>?\\s*$");
rules.push("upend-name=Sequence must end flying upright");

rules.push("group-roller=^2\\.([12]|3\\.1)");
rules.push("roller-name=Turn, family 2.1 or 2.2 or 2.3.1");

rules.push("group-froll2=^9\\.1\\.\\d\\.[^1]	");
rules.push("froll2-name=slow roll at least 1/2");

rules.push("roller-min=1");
rules.push("fam5-min=1");
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

rules.push("froll2-min=1");
rules.push("hesroll-min=1"); //CIVA is unclear "two successive elments of a hes roll"

rules.push("basefigex111-repeat=1");
//froll-repeat=99	note: rolls can be repeated
rules.push("hesroll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program
*/

//######################################################################################
//##### UNLIMITED FREE #################################################################
//######################################################################################

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Unlimited Free]");
rules.push("poslj=26");
rules.push("emptyline-max=0");
rules.push("floating-point=1");
rules.push("basefig-max=9"); //before 2008: 15
rules.push("k-max=421"); //inc floating point
rules.push("more=both Unlimited Free");
*/

rules.push("[CIVA Unlimited Free]");
rules.push("posnl=60"); //assume no line judges
rules.push("poslj=20");
//for 2006: basefig-max=10
rules.push("basefig-max=9");
rules.push("k-max=420");
rules.push("more=both Unlimited Free");

rules.push("(both Unlimited Free)");
rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");
//for 2005: k-maxperfig=99	#starting with 2006 this was removed

rules.push("group-roller=^2\\.(2\\.[3-6]|3\\.[2-5]|4\\.[2-8])\\.");
rules.push("roller-name=Rolling turn, family 2.2.3-2.2.6 or 2.3.2-2.3.5 or 2.4.2-2.4.8");
//rules.push("group-humpty=^8\\.[1-4]\\."); // 2011
//rules.push("humpty-name=family 8.1-8.4 (humpty bumps)"); // 2011

rules.push("fam1-min=1");
rules.push("roller-min=1");
rules.push("fam5-min=1");
//rules.push("fam5-max=3"); // 2011
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
//rules.push("humpty-max=4"); // 2011

rules.push("spin-min=1");

rules.push("isnap-min=2");
rules.push("osnap-min=2");

rules.push("opposite-min=1"); //one opposite roll is required!

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program


//#######################################################################################
//###################### UNKNOWNS #######################################################
//#######################################################################################

// BAeA and VINK Intermediate Unknown

// ROLL CHECKING NEEDS TO BE ADDED!
rules.push("[VINK Intermediate Unknown]");
rules.push("more=BAeA Intermediate Unknown");
rules.push("[BAeA Intermediate Unknown]");

rules.push("emptyline-max=0");
rules.push("basefig-max=12");
rules.push("basefig-min=8");

rules.push("rule-SPIN=rfsz:^[zrf]");
rules.push("why-SPIN=Figure must include a spin ");

checkConv['hrfsz'] = []
checkConv['hrfsz'].push ({'regex':/9\.[248]\.[0-9]\.[0-9]/g, 'replace':'h'})
checkConv['hrfsz'].push ({'regex':/9\.1\.[0-9]\.[0-9]/g, 'replace':'r'})
checkConv['hrfsz'].push ({'regex':/9\.(9|10)\.[0-9]\.[0-9]/g, 'replace':'s'})
checkConv['hrfsz'].push ({'regex':/0\.0\.0\.0/g, 'replace':'z'})

rules.push("rule-NHR1 = hrfsz:^h");
rules.push("why-NHR1 = no hesitation roll is allowed for 1st roll");

rules.push("rule-NHR2 = hrfsz:^[\\w,]+ h");
rules.push("why-NHR2 = no hesitation roll is allowed for 2nd roll");

rules.push("rule-NHR3 = hrfsz:^[\\w,]+ [\\w,]+ h");
rules.push("why-NHR3 = no hesitation roll is allowed for 2nd roll");

checkConv['hqerfsz'] = []
checkConv['hqerfsz'].push ({'regex':/9\.2\.[0-9]\.[0-9]/g, 'replace':'h'})
checkConv['hqerfsz'].push ({'regex':/9\.4\.[0-9]\.[0-9]/g, 'replace':'q'})
checkConv['hqerfsz'].push ({'regex':/9\.8\.[0-9]\.[0-9]/g, 'replace':'e'})
checkConv['hqerfsz'].push ({'regex':/9\.1\.[0-9]\.[0-9]/g, 'replace':'r'})
checkConv['hqerfsz'].push ({'regex':/9\.(9|10)\.[0-9]\.[0-9]/g, 'replace':'s'})
checkConv['hqerfsz'].push ({'regex':/0\.0\.0\.0/g, 'replace':'z'})

rules.push("rule-NEQR1 = hqerfsz:^[eq]");
rules.push("why-NEQR1 = no eigths or quarter hesitation roll is allowed for 1st roll");

rules.push("rule-NEQR2 = hqerfsz:^[\\w,]+ [eq]");
rules.push("why-NEQR2 = no eights or quarter hesitation roll is allowed for 2nd roll");

rules.push("rule-NEQR3 = hqerfsz:^[\\w,]+ [\\w,]+ [eq]");
rules.push("why-NEQR3 = no eights or quarter hesitation roll is allowed for 3rd roll");

rules.push("rule-NER1 = hqerfsz:^e");
rules.push("why-NER1 = no eigths hesitation roll is allowed for 1st roll");

rules.push("rule-NER2 = hqerfsz:^[\\w,]+ e");
rules.push("why-NER2 = no eights hesitation roll is allowed for 2nd roll");

rules.push("rule-NER3 = hqerfsz:^[\\w,]+ [\\w,]+ e");
rules.push("why-NER3 = no eights hesitation roll is allowed for 3rd roll");

rules.push("rule-BOTTOP = rfsz:^[^z] [^z]");
rules.push("why-BOTTOP = a roll may only be added to the top OR bottom of the loop, not both");

rules.push("rule-MAX1 = rfsz: [^z] [^z]");
rules.push("why-MAX1 = a maximum of one optional roll may be added to figure");

checkConv['int'] = []
checkConv['int'].push ({'regex':/9\.1\.1\.2/g, 'replace':'v'})
checkConv['int'].push ({'regex':/9\.1\.5\.2/g, 'replace':'d'})

rules.push("rule-MaxQUp =int:v");
rules.push("rule-MaxQDn =int:d");
rules.push("why-MaxQUp  =maximum quarter roll up");
rules.push("why-MaxQDn  =maximum quarter roll down");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("allow-defrules = IntermediateNOU");

// Lines
rules.push("1.1.1.1-4");
rules.push("1.1.2.1");
rules.push("1.1.2.3");
rules.push("1.1.3.1");
rules.push("1.1.3.3 NHR1");
rules.push("1.1.3.4");
rules.push("1.1.6.1 MaxQUp");
rules.push("1.1.6.3 MaxQDn");
rules.push("1.1.7.1 MaxQUp");
rules.push("1.1.7.4 MaxQDn");

// Sharks tooth
rules.push("1.2.1.1 MaxQDn");
rules.push("1.2.1.3 MaxQUp");
rules.push("1.2.2.3 MaxQUp");
rules.push("1.2.3.1 MaxQDn");
rules.push("1.2.3.4 NHR1");
rules.push("1.2.4.4 NHR1");
rules.push("1.2.5.1 MaxQUp");
rules.push("1.2.5.4 OS1 ; NR2");
rules.push("1.2.6.1 MaxQUp");
rules.push("1.2.6.3 OHS");
rules.push("1.2.7.1 MaxQUp");
rules.push("1.2.7.4 NHR2");
rules.push("1.2.8.1 MaxQUp ; NHR2");
rules.push("1.2.8.3 MaxQDn ; OHS");

// Bow
rules.push("1.3.2.1");

// Turns & rolling circles
rules.push("2.1.1.1-2");
rules.push("2.1.3.1-2");
rules.push("2.2.1.1-2");
rules.push("2.2.5.1");
rules.push("2.3.1.1-2");
rules.push("2.3.4.1");

// -idz+
rules.push("3.3.1.4");

// Hammerheads
rules.push("5.2.1.1");
rules.push("5.2.1.3 NR2");
rules.push("5.3.1.1 NR1 ; NR2 ; NHR3");

// Half loops
rules.push("7.2.1.1 NF1 ; NHR1 ; NR2");
rules.push("7.2.1.2 NR1 ; NR2");
rules.push("7.2.1.4 NR1 ; NF2");
rules.push("7.2.2.1 NF1 ; NEQR1 ; NER2 ; NF2");
rules.push("7.2.2.4 NR1 ; NF2");
rules.push("7.2.3.3 NEQR2 ; NF2");
rules.push("7.2.4.2 NHR2");
rules.push("7.2.4.3 NHR2 ; NF2");

// Goldfish
rules.push("7.3.1.2 NR1");
rules.push("7.3.1.3");
rules.push("7.3.2.1");
rules.push("7.3.3.3");
rules.push("7.3.4.1");

// Loops
rules.push("7.4.1.1 NEQR1");
rules.push("7.4.3.1 NR1");
rules.push("7.4.5.1 NR1 ; NR2");

// Reversing loops
rules.push("7.3.7.1 NHR1");
rules.push("7.4.8.1 NR1 ; NHR2");
rules.push("7.4.9.3 NF1 ; NHR1");
rules.push("7.4.12.3 NHR2");

// Horizontal S-es
rules.push("7.5.2.1 NEQR1 ; NF1 ; NHR2 ; NR3");
rules.push("7.5.2.4 NR1 ; NHR2 ; NEQR3 ; NF3");
rules.push("7.5.5.3 NF1 ; NHR2 ; NR3");
rules.push("7.5.7.1 NR1 ; NHR2 ; NF3");

// Full cubans
rules.push("7.8.3.1 NR1 ; NR3");
rules.push("7.8.3.4 NR1 ; NR3");
rules.push("7.8.4.1 NR1");
rules.push("7.8.6.3 NR1 ; NR3");
rules.push("7.8.8.1 NR3");
rules.push("7.8.8.4 NR3");

// Humpty bumps
rules.push("8.4.1.1 MaxQUp ; MaxQDn");
rules.push("8.4.2.1 MaxQUp ; NR2");
rules.push("8.4.3.1 MaxQUp ; MaxQDn");
rules.push("8.4.13.1 NR1 ; NR2");
rules.push("8.4.14.1 NR1");
rules.push("8.4.15.1 NR2");

// Half cubans
rules.push("8.5.1.2 NER2");
rules.push("8.5.1.3 NEQR2");
rules.push("8.5.2.1 NER2");
rules.push("8.5.3.3 NF2");
rules.push("8.5.4.1 NHR1 ; NF2");
rules.push("8.5.4.4 NF2");
rules.push("8.5.5.1 NER2");
rules.push("8.5.5.4 NEQR1");
rules.push("8.5.6.1 NER1");
rules.push("8.5.7.1 NR2");
rules.push("8.5.7.3 NF1");
rules.push("8.5.8.3 NF1 ; NH1 ; NHR2");

// Keyhole loops
rules.push("8.5.9.1 NR1 ; NR2");
rules.push("8.5.17.1 NR1 ; NR2");

// P loops
rules.push("8.6.1.1 MaxQUp ; NER2 ; NF2 ; NF3");
rules.push("8.6.3.3 NR1 ; NEQR2 ; NF2");
rules.push("8.6.4.3 OHS ; NF2 ; NER2");
rules.push("8.6.5.1 NF1 ; NER1 ; NHR2 ; BOTTOP ; MaxQDn");
rules.push("8.6.7.2 NR2");
rules.push("8.6.7.3 NF1 ; MaxQUp");
rules.push("8.6.8.3 NF1 ; MaxQUp");

// Porpoises
rules.push("8.6.11.1 NR1 ; NR2 ; NEQR3 ; NF3");
rules.push("8.6.11.3 OHS ; NR2 ; NEQR3 ; NF3");

// Q loops
rules.push("8.7.1.1 NR1 ; NR2 ; NER3 ; NF3");
rules.push("8.7.3.1 NR1 ; NR2 ; NER3 ; NF3");
rules.push("8.7.5.1 NF1 ; NEQR1 ; NHR2 ; NR3");
rules.push("8.7.7.2 NER1 ; NR2 ; NR3");

// Rolls
rules.push("9.1.1.1-2");
rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.3.1-4");
rules.push("9.1.4.2");
rules.push("9.1.5.1");
rules.push("9.1.5.2");
rules.push("9.2.3.4");
rules.push("9.4.2.2");
rules.push("9.4.3.2");
rules.push("9.4.3.4");
rules.push("9.4.4.2");
rules.push("9.8.3.2");
rules.push("9.8.3.4");

// Snaps
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.9.4.4");

// Spins
rules.push("9.11.1.4-7");
rules.push("9.12.1.4");
rules.push("9.12.1.6");

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Intermediate Unknown]");
// general rules for IAC: 6-12 figures, 150K  (175k from 2008)
rules.push("group-fc=^7.(2[3-9]|30)");
rules.push("fc-name=family 7.23-30 (full cubans)");
rules.push("fc-max=1");

rules.push("snap-maxperfig=1");
rules.push("spin-max=1 ");

rules.push("k-max=175");

rules.push("basefig-min=6");
rules.push("basefig-max=12");

rules.push("rule-SPIN=rfsz:^[zrf]");
rules.push("why-SPIN=Figure must include a spin ");

checkConv['hrfsz'] = []
checkConv['hrfsz'].push ({'regex':/9\.[248]\.[0-9]\.[0-9]/g, 'replace':'h'})
checkConv['hrfsz'].push ({'regex':/9\.1\.[0-9]\.[0-9]/g, 'replace':'r'})
checkConv['hrfsz'].push ({'regex':/9\.(9|10)\.[0-9]\.[0-9]/g, 'replace':'s'})
checkConv['hrfsz'].push ({'regex':/0\.0\.0\.0/g, 'replace':'z'})

//rules.push("conv-hrfsz=9\\.[248]\\.[0-9].[0-9]=h;9\\.1\\.[0-9].[0-9]=r; 9.(9|10).[0-9].[0-9]=f; 9.1[12].[0-9].[0-9]=s ; 0.0.0.0=z");

rules.push("rule-NHR1 = hrfsz:^h");
rules.push("why-NHR1 = no hesitation roll is allowed for 1st roll");

rules.push("rule-NHR2 = hrfsz:^[\\w,]+ h");
rules.push("why-NHR2 = no hesitation roll is allowed for 2nd roll");

rules.push("rule-MAX1 = rfsz: [^z] [^z]");
rules.push("why-MAX1 = a maximum of one optional roll may be added to figure");


rules.push("allow-defrules = NOU");

rules.push("1.1.1-4");
rules.push("1.2.1");
rules.push("1.2.3");
rules.push("1.3.1");
rules.push("1.3.4");
rules.push("1.6.1");
rules.push("1.6.3 SPIN");
rules.push("1.7.1");
rules.push("1.7.4");
rules.push("1.12.1");
rules.push("1.12.3");
rules.push("1.13.3");
rules.push("1.14.1");
rules.push("1.14.4");
rules.push("1.15.4");
rules.push("1.16.4 NR1");
rules.push("1.17.1");
rules.push("1.17.3 SPIN; NR2");
rules.push("1.18.1");
rules.push("1.18.4 NR1");
rules.push("1.19.3 SPIN");
rules.push("1.21.4 NR1");
rules.push("1.24.1 NR2");
rules.push("1.25.3 SPIN; NR2");
rules.push("1.29.1 NR2");
rules.push("1.30.3 NR2");
rules.push("1.31.1 NR2");
rules.push("1.31.4 NR2");
rules.push("1.38.1");
rules.push("1.38.4 NR1");
rules.push("1.39.1");
rules.push("1.40.1 NR2");
rules.push("1.40.3 SPIN");
rules.push("1.41.1 NR2");
rules.push("1.43.3 SPIN");
rules.push("2.1.1");
rules.push("2.1.3");
rules.push("2.2.1");
rules.push("2.2.3-4");
rules.push("5.1.1");

rules.push("7.1.1 NF1");
rules.push("7.1.4 NF2");
rules.push("7.2.1 NF1");
rules.push("7.2.4 NF2");
rules.push("7.3.2 NF1");
rules.push("7.3.3 NF2 ");
rules.push("7.4.2 NF1");
rules.push("7.4.3 NF2");
rules.push("7.5.1 NHR1");
rules.push("7.7.1 NR1");
rules.push("7.20.1 NR2");
rules.push("7.21.3 NR1");
rules.push("7.22.1");
rules.push("7.22.4");
rules.push("7.25.1 NR2");
rules.push("7.25.4 NR2");
rules.push("7.26.1");
rules.push("7.26.4");
rules.push("7.28.3 NR1");
rules.push("7.30.1");
rules.push("7.30.4");
rules.push("7.33.3 NR3");
rules.push("7.35.1");
rules.push("7.37.3");
rules.push("7.38.1");
rules.push("7.38.4");

rules.push("8.1.1 ");
rules.push("8.3.1");
rules.push("8.15.1 NR2");
rules.push("8.31.3 NR1; NR2");
rules.push("8.32.1 NF2");
rules.push("8.32.4 NR2");
rules.push("8.33.1 NR1; NR2; NF3");
rules.push("8.33.4 NR1;NR2");

rules.push("8.37.3 NR1");
rules.push("8.38.1 ");
rules.push("8.38.4");
rules.push("8.39.1 NR1; NR2 ");
rules.push("8.39.4 NR1;NR2");
rules.push("8.40.3 NR2");
rules.push("8.41.1 NR2");
rules.push("8.41.4 NR2");
rules.push("8.42.1 NF1");
rules.push("8.42.4");
rules.push("8.43.1 NF1; MAX1; NHR2 ");
rules.push("8.43.4 NR2 ; NR3");
rules.push("8.44.4 NR2");
rules.push("8.45.1 MAX1; NHR2"); //(Maximum of one rolling element. If used, roll at top either full roll or flick)9.1.3.4 or 9.9.3.4)
rules.push("8.47.3 NR2");
rules.push("8.48.2-3");
rules.push("8.51.2 NHR2; NR3");
rules.push("8.51.3 NR2");
rules.push("8.52.3 NR2");

rules.push("8.57.1 NR2");
rules.push("8.59.3 NR2");
rules.push("8.60.3 NR2");
rules.push("8.65.1 NR1");
rules.push("8.65.4 NR2");

rules.push("9.1.1.1");
rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.3.2");
rules.push("9.1.3.4");
rules.push("9.1.3.6");
rules.push("9.1.4.2");
rules.push("9.1.5.1");
rules.push("9.1.5.2");
rules.push("9.2.3.4");
rules.push("9.4.2.2");
rules.push("9.4.3.2");
rules.push("9.4.3.4");
rules.push("9.4.4.2");
rules.push("9.8.3.2");
rules.push("9.9.3.4");
rules.push("9.9.4.4");
rules.push("9.11.1.4-6");
*/

//#######################################################################################
//###################### UNLIMITED UNKNOWNS #############################################
//#######################################################################################

/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Unlimited Unknown]");
rules.push("poslj=20");
// general rules for IAC: 10-14 figures, 400K
rules.push("group-fc=^7.(2[3-9]|30)");
rules.push("fc-name=family 7.23-30 (full cubans)");
rules.push("fc-max=1");

rules.push("snap-maxperfig=1");
rules.push("spin-max=1 ");

rules.push("k-max=400");

rules.push("basefig-min=10");
rules.push("basefig-max=14");


rules.push("group-vsnap=^9\\.(9|10)\\.[16]");
rules.push("vsnap-name=vertical snap");
rules.push("isnap-max=4");
rules.push("osnap-max=4");
rules.push("vsnap-min=1");
rules.push("snap-max=6");

rules.push("more=all Unlimited Unknown figures");
*/

rules.push("[CIVA Unlimited Unknown1]");
rules.push("more=CIVA Unlimited Unknown");
rules.push("[CIVA Unlimited 1stUnknown]");
rules.push("more=CIVA Unlimited Unknown");
rules.push("[CIVA Unlimited program2]");
rules.push("more=CIVA Unlimited Unknown");

rules.push("[CIVA Unlimited Unknown2]");
rules.push("more=CIVA Unlimited Unknown");
rules.push("[CIVA Unlimited 2ndUnknown]");
rules.push("more=CIVA Unlimited Unknown");
rules.push("[CIVA Unlimited program3]");
rules.push("more=CIVA Unlimited Unknown");

rules.push("[CIVA Unlimited Unknown]");
rules.push("poslj=10");
rules.push("posnl=60");
rules.push("group-one=^1\\.1\\.([6-9]|1[01])\\.[34]");
rules.push("one-name=family 1.1.6-11 columns 3&4");
rules.push("group-two=^8\\.(4\\.[1-4]|4\\.([7-9]|10)|5\\.[12]|6\\.[12])\\.[34]");
rules.push("two-name=family 8.4.1-4, 8.4.7-10, 8.5.1-2, 8.6.1-2 columns 3&4");
rules.push("group-vsnap=^9\\.(9|10)\\.[16]");
rules.push("vsnap-name=vertical snap");
rules.push("one-max=2");
rules.push("two-max=2");
rules.push("isnap-max=4");
rules.push("osnap-max=4");
rules.push("vsnap-min=1");
rules.push("snap-max=6");

rules.push("snap-maxperfig=1");

rules.push("k-minperfig=22");

rules.push("basefig-min=10");
rules.push("basefig-max=10");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("more=all Unlimited Unknown figures");

//###################################################################################################
rules.push("(all Unlimited Unknown figures)");

checkConv['updegstop'] = []
checkConv['updegstop'].push ({'regex': /9\.1\.1\.([1-5])/g, 'replace': '$1:1'})
checkConv['updegstop'].push ({'regex': /9\.2\.1\.4/g, 'replace': '4:2'})
checkConv['updegstop'].push ({'regex': /9\.4\.1\.([234])/g, 'replace': '$1:$1'})
checkConv['updegstop'].push ({'regex': /9\.8\.1\.1/g, 'replace': '1:2'})
checkConv['updegstop'].push ({'regex': /9\.8\.1\.2/g, 'replace': '2:4'})
checkConv['updegstop'].push ({'regex': /9\.[1-8]\.1/g, 'replace': 'e'})
checkConv['updegstop'].push ({'regex': /9\.[1-8]\.[0-9]\.[0-9]/g, 'replace': 'r'})
checkConv['updegstop'].push ({'regex': /9\.(9|10)\.[0-9]\.[0-9]/g, 'replace': 'f'})
checkConv['updegstop'].push ({'regex': /9\.1[12]\.[0-9]\.[0-9]/g, 'replace': 's'})
checkConv['updegstop'].push ({'regex': /0\.0\.0\.0/g, 'replace': 'z'})
// rules.push("conv-updegstop= ^9\\.1\\.1\\.([1-5]) = $1:1 ; ^9\\.2\\.1\\.4 = 4:2 ; ^9\\.4\\.1\\.([234]) = $1:$1 ; ^9\\.8\\.1\\.1 = 1:2 ; ^9\\.8\\.1\\.2 = 2:4 ; ^9\\.[1-8]\\.1=e; ^9\\.[1-8]=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");
rules.push("rule-VUP450 = updegstop: (.:.,5:.|2:.,4:.|3:.,[34]:.|4:.,[234]:.|5:.,.:.)");
rules.push("why-VUP450  = a maximum of 450 degrees are allowed on vertical up opposite rolls ");

checkConv['climbdegstop'] = []
checkConv['climbdegstop'].push ({'regex': /9\.1\.[12]\.([1-5])/g, 'replace': '$1:1'})
checkConv['climbdegstop'].push ({'regex': /9\.2\.[12]\.4/g, 'replace': '4:2'})
checkConv['climbdegstop'].push ({'regex': /9\.4\.[12]\.([234])/g, 'replace': '$1:$1'})
checkConv['climbdegstop'].push ({'regex': /9\.8\.[12]\.1/g, 'replace': '1:2'})
checkConv['climbdegstop'].push ({'regex': /9\.8\.[12]\.2/g, 'replace': '2:4'})
checkConv['climbdegstop'].push ({'regex': /9\.[1-8]\.[12]\.[0-9]/g, 'replace': 'e'})
checkConv['climbdegstop'].push ({'regex': /9\.[1-8]\.[0-9]\.[0-9]/g, 'replace': 'r'})
checkConv['climbdegstop'].push ({'regex': /9\.(9|10)\.[0-9]\.[0-9]/g, 'replace': 'f'})
checkConv['climbdegstop'].push ({'regex': /9\.1[12]\.[0-9]\.[0-9]/g, 'replace': 's'})
checkConv['climbdegstop'].push ({'regex': /0\.0\.0\.0/g, 'replace': 'z'})
//rules.push("conv-climbdegstop= ^9\\.1\\.[12]\\.([1-5]) = $1:1 ; ^9\\.2\\.[12]\\.4 = 4:2 ; ^9\\.4\\.[12]\\.([234]) = $1:$1 ; ^9\\.8\\.[12]\\.1 = 1:2 ; ^9\\.8\\.[12]\\.2 = 2:4 ; ^9\\.[1-8]\\.[12]=e; ^9\\.[1-8]=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");
rules.push("rule-CLIMB540 = climbdegstop: ^(.:. .:.,[45]:.|.:. 2:.,[45]:.|.:. 3:.,[2-5]:.|.:. [45]:.,.:.|2:. .:.,[345]:.|2:. 2:.,[2-5]:.|2:. 3:.,.:.|3:. .:.,[2-5]:.|3:. [2-5]:.,.:.|[45]:. .:.,.:.|.:. 5:.|2:. 4:.|3:. [34]:.|4:. [234]:.|5:. .:.)");
rules.push("why-CLIMB540  = a maximum of 540 degrees are allowed on climbing rolls ");

rules.push("rule-VUP4S = updegstop: (e,|,e|.:.,.:4|.:2,.:3|.:3,.:[23]|.:4,.:.)");
rules.push("why-VUP4S  = a maximum of 4 stops are allowed on vertical up opposite rolls ");

rules.push("rule-CLIMB4S = climbdegstop: ^(.:. .:.,.:[34]|.:. .:2,.:[234]|.:. .:[34],.:.|.:2 .:.,.:[234]|.:2 .:2,.:.|.:[34] .:.,.:.|.:. .:4|.:2 .:3|.:3 .:[23]|.:4 .:.)");
rules.push("why-CLIMB4S  = a maximum of 4 stops are allowed on climbing olls ");

checkConv['downdegstop'] = []
checkConv['downdegstop'].push ({'regex': /9\.1\.5\.([1-4])/g, 'replace': '$1:1'})
checkConv['downdegstop'].push ({'regex': /9\.2\.5\.4/g, 'replace': '4:2'})
checkConv['downdegstop'].push ({'regex': /9\.4\.5\.([23])/g, 'replace': '$1:$1'})
checkConv['downdegstop'].push ({'regex': /9\.8\.5\.1/g, 'replace': '1:2'})
checkConv['downdegstop'].push ({'regex': /9\.8\.5\.2/g, 'replace': '2:4'})
checkConv['downdegstop'].push ({'regex': /9\.[1-8]\.5\.[0-9]/g, 'replace': 'e'})
checkConv['downdegstop'].push ({'regex': /9\.[1248]\.[0-9]\.[0-9]/g, 'replace': 'r'})
checkConv['downdegstop'].push ({'regex': /9\.(9|10)\.[0-9]\.[0-9]/g, 'replace': 'f'})
checkConv['downdegstop'].push ({'regex': /9\.1[12]\.[0-9]\.[0-9]/g, 'replace': 's'})
checkConv['downdegstop'].push ({'regex': /0\.0\.0\.0/g, 'replace': 'z'})
//rules.push("conv-downdegstop= ^9\\.1\\.5\\.([1-4]) = $1:1 ; ^9\\.2\\.5\\.4 = 4:2 ; ^9\\.4\\.5\\.([23]) = $1:$1 ; ^9\\.8\\.5\\.1 = 1:2 ; ^9\\.8\\.5\\.2 = 2:4 ; ^9\\.[1-8]\\.5=e ; ^9\\.[1248]=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");
rules.push("rule-VDOWN360 = downdegstop: (.:.,4:.|2:.,3:.|3:.,[23]:.|4:.,.:.)");
rules.push("why-VDOWN360  = a maximum of 360 degrees are allowed on vertical down opposite rolls ");

rules.push("rule-VDOWN3S = downdegstop: (e,|,e|.:.,.:[34]|.:[34],.:.|.:2,.:2)");
rules.push("why-VDOWN3S  = a maximum of 3 stops are allowed on vertical down opposite rolls ");

checkConv['vdhfsz'] = []
checkConv['vdhfsz'].push ({'regex': /9\.[1248]\.[15]\.[0-9]/g, 'replace': 'v'})
checkConv['vdhfsz'].push ({'regex': /9\.[1248]\.[24]\.[0-9]/g, 'replace': 'd'})
checkConv['vdhfsz'].push ({'regex': /9\.[1248]\.[0-9]\.[0-9]/g, 'replace': 'h'})
checkConv['vdhfsz'].push ({'regex': /9\.(9|10)\.[0-9]\.[0-9]/g, 'replace': 'f'})
checkConv['vdhfsz'].push ({'regex': /9\.1[12]\.[0-9]\.[0-9]/g, 'replace': 's'})
checkConv['vdhfsz'].push ({'regex': /0\.0\.0\.0/g, 'replace': 'z'})
//rules.push("conv-vdhfsz=^9\\.[1248]\\.[15]=v;^9\\.[1248]\\.[24]=d; ^9\\.[1248]\\.=h; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");
rules.push("rule-UnlimitedNOU =vdhfsz: (d,|,d|v,f|f,v)");
rules.push("why-UnlimitedNOU = opposite or unlinked rolls are not allowed");


checkConv['hrfsz'] = []
checkConv['hrfsz'].push ({'regex': /9\.[248]\.[0-9]\.[0-9]/g, 'replace': 'h'})
checkConv['hrfsz'].push ({'regex': /9\.1\.[0-9]\.[0-9]/g, 'replace': 'r'})
checkConv['hrfsz'].push ({'regex': /9\.(9|10)\.[0-9]\.[0-9]/g, 'replace': 'f'})
checkConv['hrfsz'].push ({'regex': /9\.1[12]\.[0-9]\.[0-9]/g, 'replace': 's'})
checkConv['hrfsz'].push ({'regex': /0\.0\.0\.0/g, 'replace': 'z'})
//rules.push("conv-hrfsz=^9\\.[248]\\.=h;^9\\.1\\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");

rules.push("rule-NF3TOPH  =hrfsz: (.,.|h) f$");
rules.push("why-NF3TOPH  = no flick roll on vertical down line after hesitation in the loop");

rules.push("rule-NF2UP360 = updegstop: ^(e|e,e|.:.,e|e,.:.|5:.|.:.,[45]:.|2:.,3:.|3:.,[23]:.|[45]:.,.:.) f");
rules.push("why-NF2UP360  = no flick roll on loop top after more than 360 roll going up");

rules.push("rule-NF2UP2STOP = updegstop: ^(e|.,e|e,.|.:[345]|.:.,.:[2-5]|.:[2-5],.:.) f");
rules.push("why-NF2UP2STOP  = no flick roll on loop top after more than 2 stops going up");

checkConv['rhqefsz'] = []
checkConv['rhqefsz'].push ({'regex': /9\.1\.[0-9]\.[0-9]/g, 'replace': 'r'})
checkConv['rhqefsz'].push ({'regex': /9\.2\.[0-9]\.[0-9]/g, 'replace': 'h'})
checkConv['rhqefsz'].push ({'regex': /9\.4\.[0-9]\.[0-9]/g, 'replace': 'q'})
checkConv['rhqefsz'].push ({'regex': /9\.8\.[0-9]\.[0-9]/g, 'replace': 'e'})
checkConv['rhqefsz'].push ({'regex': /9\.(9|10)\.[0-9]\.[0-9]/g, 'replace': 'f'})
checkConv['rhqefsz'].push ({'regex': /9\.1[12]\.[0-9]\.[0-9]/g, 'replace': 's'})
checkConv['rhqefsz'].push ({'regex': /0\.0\.0\.0/g, 'replace': 'z'})
//rules.push("conv-rhqefsz=^9\\.1\\.=r; ^9\\.2\\.=h; ^9\\.4\\.=q; ^9\\.8\\.=e; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");

rules.push("rule-N88 = rhqefsz: e");
rules.push("why-N88  = 8 point roll is not allowed");

rules.push("allow-defrules=UnlimitedNOU ; VUP450; VUP4S ; VDOWN360 ; VDOWN3S ");

// Lines
// ~%~  ~i?d%~ ~i?v%~ 
rules.push("1.1.2.1-4");
rules.push("1.1.3.1-4");
rules.push("1.1.6.1-4");
rules.push("1.1.7.1-4");

// Z figures
// z_- z^ -iz_ -iz^-
rules.push("1.1.10.1");
rules.push("1.1.10.4");
rules.push("1.1.11.1");
rules.push("1.1.11.4");

// K figures
// ~%i?t%~  ~%i?k%~
rules.push("1.2.1.1-4");
rules.push("1.2..1-4");
rules.push("1.2.4.1-4 ");
rules.push("1.2.5.1-4");
rules.push("1.2.6.1-4");
rules.push("1.2.7.1-4");
rules.push("1.2.8.1-4");

// Rolling circles
// ~[21]jo?1~   ~2j(|o|io|oi)2~ ~4j(|o|io|oi)[234]~ ~3j(|o|io|oi)3~ 
//              ~2j(|o|oi)15~ ~3j(|o|io|oi)15~
rules.push("2.2.2.1-4");
rules.push("2.2.3.1-4");
rules.push("2.2.4.1-4");
rules.push("2.2.5.1-4");
rules.push("2.2.6.1-4");

rules.push("2.3.2.1-4");
rules.push("2.3.3.1-4");
rules.push("2.3.4.1-4");
rules.push("2.3.5.1-4");

rules.push("2.4.3.1-4");
rules.push("2.4.4.1-4");
rules.push("2.4.5.1-4");
rules.push("2.4.6.3-4");
rules.push("2.4.7.1-4");
rules.push("2.4.8.1-4");

// Hammerheads
// ~%h%~ ~%i?ta%~
rules.push("5.2.1.1-4 ");
rules.push("5.3.1.1-4 NF1 ; NF2 ; CLIMB4S ; CLIMB540 ");
rules.push("5.3.2.1-4 NF1 ; NF2 ; CLIMB4S ; CLIMB540");

// Tailslides
rules.push("6.2.1.1-4 NF1 ");
rules.push("6.2.2.1-4 NF1 ");

// Half loops  
// ~%a%~ ~%m%~ ~o%~ io% -io%-  ~i?qo%~ %dq% -%idq%- qq -iqq- 
rules.push("7.2.1.1-2 NF1");
rules.push("7.2.1.3-4 NF2");
rules.push("7.2.2.1-2 NF1");
rules.push("7.2.2.3-4 NF2");
rules.push("7.2.3.1-2 NF1");
rules.push("7.2.3.3-4 NF2");
rules.push("7.2.4.1-2 NF1");
rules.push("7.2.4.3-4 NF2");

// Goldfish
// ~%i?g%~
rules.push("7.3.1.1-4");
rules.push("7.3.2.1-4");
rules.push("7.3.3.1-4");
rules.push("7.3.4.1-4");

// Loops
rules.push("7.4.1.1-2 NOU1");
rules.push("7.4.1.3-4 NOU1 ; NF1 ; N88");
rules.push("7.4.2.1-2 NOU1");
rules.push("7.4.3.1-2");
rules.push("7.4.3.3-4 NF1");
rules.push("7.4.4.1-2");
rules.push("7.4.4.3-4 NF1");

rules.push("7.4.5.1 NF1");
rules.push("7.4.5.4 NF2");
rules.push("7.4.6.1");
rules.push("7.4.6.4");

// Full cubans
// ~%i?cc%~
rules.push("7.8.1.1-4");
rules.push("7.8.2.1-4");
rules.push("7.8.3.1-4");
rules.push("7.8.4.1-4");
rules.push("7.8.5.1-4");
rules.push("7.8.6.1-4");
rules.push("7.8.7.1-4");
rules.push("7.8.8.1-4");

// Humpty bumps
// ~%i?p?b%~
rules.push("8.4.1.1-4");
rules.push("8.4.2.1-4");
rules.push("8.4.3.1-4");
rules.push("8.4.4.1-4");

// Diagonal bumps
// %db%~   ~%rdb%~  ~%irdb%~
rules.push("8.4.13.1");
rules.push("8.4.14.1");
rules.push("8.4.15.1-4");
rules.push("8.4.16.1-4");
rules.push("8.4.17.1-4");
rules.push("8.4.18.1-4");

// Reverse half cubans
// ~%i?c%~  ~%i?rc%~ ~%i?rp%~
rules.push("8.5.1.1-2 NF2");
rules.push("8.5.1.3-4");
rules.push("8.5.2.1-2 NF2");
rules.push("8.5.2.3-4");
rules.push("8.5.3.1-2 NF2");
rules.push("8.5.3.3-4");
rules.push("8.5.4.1-2 NF2");
rules.push("8.5.4.3-4");

// Half cubans
rules.push("8.5.5.1-2 NF1");
rules.push("8.5.5.3-4");
rules.push("8.5.6.1-2 NF1");
rules.push("8.5.6.3-4");
rules.push("8.5.7.1-2 NF1");
rules.push("8.5.7.3-4");
rules.push("8.5.8.1-2 NF1");
rules.push("8.5.8.3-4");

// Reverse P loops
rules.push("8.6.1.1-2 NOU2; NF3; NF2UP360; NF2UP2STOP");
rules.push("8.6.1.3-4");
rules.push("8.6.2.1-2 NOU2; NF3; NF2UP360; NF2UP2STOP");
rules.push("8.6.2.3-4");
rules.push("8.6.3.1-2 NOU2; NF3; NF2UP360; NF2UP2STOP");
rules.push("8.6.3.3-4");
rules.push("8.6.4.1-2 NOU2; NF3; NF2UP360; NF2UP2STOP");
rules.push("8.6.4.3-4");

// P loops
rules.push("8.6.5.1-2 NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.6.5.3-4");
rules.push("8.6.6.1-2 NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.6.6.3-4");
rules.push("8.6.7.1-2 NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.6.7.3-4");
rules.push("8.6.8.1-2 NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.6.8.3-4");

// ROLLS
// v[42315] d[216] [42316]   id[216] iv[4231]
rules.push("9.1.1.1-5");
rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.2.6");
rules.push("9.1.3.1-8");
rules.push("9.1.4.2");
rules.push("9.1.4.4");
rules.push("9.1.4.6");
rules.push("9.1.5.1-4");

// v22 d22 [23]2   id22 iv22

rules.push("9.2.1.4");
rules.push("9.2.2.4");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.4.4");
rules.push("9.2.5.4");

// v[234]4  d[24]4 [234]4 id[24]4 iv[23]4

rules.push("9.4.1.2-4");
rules.push("9.4.2.2");
rules.push("9.4.2.4");
rules.push("9.4.3.2-4");
rules.push("9.4.4.2");
rules.push("9.4.4.4");
rules.push("9.4.5.2-3");

// v4?8  d48 [48]8  id48 iv4?8

rules.push("9.8.1.1");
rules.push("9.8.1.2");
rules.push("9.8.2.2");
rules.push("9.8.3.2");
rules.push("9.8.3.4");
rules.push("9.8.4.2");
rules.push("9.8.5.1");
rules.push("9.8.5.2");

// Snaps
// ~v[231]f   ~d[21]f  ~[21]f  ~id[21]f  ~iv[231]f		6f id6f
// ~v[231]if  ~d[21]if ~[21]if ~id[21]if ~iv[231]if		-6if
rules.push("9.9.1.2-4");
rules.push("9.9.2.2");
rules.push("9.9.2.4");
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.9.3.6");
rules.push("9.9.4.2");
rules.push("9.9.4.4");
rules.push("9.9.4.6");
rules.push("9.9.5.2-4");
rules.push("9.9.6.2-4");
rules.push("9.9.7.2");
rules.push("9.9.7.4");
rules.push("9.9.8.2");
rules.push("9.9.8.4");
rules.push("9.9.9.2");
rules.push("9.9.9.4");
rules.push("9.9.10.2-4");

rules.push("9.10.1.2-4");
rules.push("9.10.2.2");
rules.push("9.10.2.4");
rules.push("9.10.3.2");
rules.push("9.10.3.4");
rules.push("9.10.3.6");
rules.push("9.10.4.2");
rules.push("9.10.4.4");
rules.push("9.10.5.2-4");
rules.push("9.10.6.2-4");
rules.push("9.10.7.2");
rules.push("9.10.7.4");
rules.push("9.10.8.2");
rules.push("9.10.8.4");
rules.push("9.10.9.2");
rules.push("9.10.9.4");
rules.push("9.10.10.2-4");

// Spins
// [156]i?s
rules.push("9.11.1.4-6");
rules.push("9.12.1.4-6");


//#######################################################################################

rules.push("[CIVA Advanced Unknown]");
rules.push("more=CIVA Advanced Unknown1");
rules.push("[CIVA Advanced 1stUnknown]");
rules.push("more=CIVA Advanced Unknown1");
rules.push("[CIVA Advanced 2ndUnknown]");
rules.push("more=CIVA Advanced Unknown2");
rules.push("[CIVA Advanced program2]");
rules.push("more=CIVA Advanced Unknown1");
rules.push("[CIVA Advanced program3]");
rules.push("more=CIVA Advanced Unknown2");

rules.push("[CIVA Advanced Unknown1]");
rules.push("k-maxperfig=35");
rules.push("more=CIVA Advanced Unknown base");

rules.push("[CIVA Advanced Unknown2]");
rules.push("k-maxperfig=40");
rules.push("more=CIVA Advanced Unknown base");

//#######################################################################################
/* NOT YET UPDATED TO OPENAERO
rules.push("[IAC Advanced Unknown]");
//#######################################################################################
rules.push("poslj=12");
// general rules for IAC: 10-14 figures, 
// limit on figure types (max1 spin etc)
// limit on snaps (2-4 total), (one max per figure)
// figures 10-14. 
// at most one of 1.14.3-4 1.15.3-4 amd one of 7.23-30.*

rules.push("group-fc=^7.(2[3-9]|30)");
rules.push("fc-name=family 7.23-30 (full cubans)");
rules.push("fc-max=1");

rules.push("k-max=275");


rules.push("snap-maxperfig=1");
rules.push("snap-min=2");
rules.push("snap-max=4");

rules.push("spin-max=1 ");

rules.push("basefig-min=10");
rules.push("basefig-max=14");

//#no limit on repeats!
//basefig-repeat=1
//roll-repeat=1
//snap-repeat=1
//spin-repeat=1

rules.push("more=all Advanced Unknown figures");
*/

//#######################################################################################
rules.push("(CIVA Advanced Unknown base)");
//#######################################################################################
rules.push("poslj=10");
rules.push("posnl=40");

// general rules for AWAC: 10-14 figures, 
// limit on figure types (max1 spin etc)
// limit on snaps (2-4 total), (one max per figure)
// figures 10-14. Kfactor 15-35. 
// at most one of 1.14.3-4 1.15.3-4 amd one of 7.23-30.*

rules.push("group-one=^1\\.2\\.[34]\\.[34]");
rules.push("group-two=^7\\.8\\.[1-8]\\.");


rules.push("k-minperfig=15");

rules.push("snap-maxperfig=1");
rules.push("snap-min=2");
rules.push("snap-max=4");


rules.push("spin-max=1");

rules.push("one-name=family 1.2.3-4 columns 3&4 (inv tooth)");
rules.push("one-max=1");

rules.push("two-name=family 7.8.1-16 (full cubans)");
rules.push("two-max=1");

rules.push("basefig-min=10");
rules.push("basefig-max=10");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("more=all Advanced Unknown figures");

rules.push("(all Advanced Unknown figures)");

//############################################################
// extended conv rule version with limited vertical rolls=v(up) =n(down) 
// limited vertical rolls are 3/4 & 2/4 up(v =can't flyoff) or down(n=cant push out)
// for Advanced Unknowns only, of course.

checkConv['adv'] = []
checkConv['adv'].push ({'regex':/9\.(1\.1\.3|4\.1\.2)/g, 'replace':'v'})
checkConv['adv'].push ({'regex':/9\.(1\.5\.3|4\.5\.2)/g, 'replace':'n'})
checkConv['adv'].push ({'regex':/9\.[1248]\.[0-9]\.[0-9]/g, 'replace':'r'})
checkConv['adv'].push ({'regex':/9\.(9|10)\.[0-9]\.[0-9]/g, 'replace':'f'})
checkConv['adv'].push ({'regex':/9\.1[12]\.[0-9]\.[0-9]/g, 'replace':'f'})
checkConv['adv'].push ({'regex':/9\.(9|10)\.[0-9]\.[0-9]/g, 'replace':'f'})
//rules.push("conv-adv=9\\.(1\\.1\\.3|4\\.1\\.2).[0-9].[0-9]=v ; 9\\.(1\\.5\\.3|4\\.5\\.2).[0-9].[0-9]=n; 9\\.[1248]\\.[0-9].[0-9]=r; 9.(9|10)[0-9].[0-9]=f; ^9.1[12]=s ; 0.0.0.0=z");

rules.push("rule-NRLevFly   =adv:v$");
rules.push("rule-NRPushout  =adv:n$");
rules.push("why-NRLevFly    = level fly off is not allowed after this roll");
rules.push("why-NRPushout   = negative recovery is not allowed after this roll");


//For Adv rp figures, we convert 3/4 up to 'p' which isnt allowed
checkConv['advrp'] = []
checkConv['advrp'].push ({'regex':/9\.(1\.1\.3)\.[0-9]\.[0-9]/g, 'replace':'x'})
checkConv['advrp'].push ({'regex':/9\.[0-9]\.[0-9]\.[0-9]/g, 'replace':'r'})
checkConv['advrp'].push ({'regex':/0\.0\.0\.0/g, 'replace':'z'})
//rules.push("conv-advrp=9\\.(1\\.1\\.3).[0-9].[0-9]=x ;  9\\.[0-9].[0-9].[0-9]=r; 0.0.0.0=z");
rules.push("rule-NR3Q1 =advrp:^x");
rules.push("why-NR3Q1  =no more than 1/2 roll is allowed for first rolling element position");

//for Adv p figures, we convert any hesitation full roll into 'h' to disallow flick down
//conv-advp=^9\\.[248]\\.3=h   ;   ^9\\.[1248]\\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z
//note since 2006 no roll at all on top of loop...

rules.push("rule-NH2F3 =rfsz:^[\\w,]+ r (f|\\w,f)");
rules.push("why-NH2F3 = no flick allowed in third position when 2nd position has a roll");

//for Adv dh figures, we check for 9.4.2.2 or 9.2.1.2 on 45 and 9.1.1.1 on vert
checkConv['advdh45'] = []
checkConv['advdh45'].push ({'regex':/9\.(4\.2\.2)/g, 'replace':'v'})
checkConv['advdh45'].push ({'regex':/9\.(1\.2\.2)/g, 'replace':'v'})
checkConv['advdh45'].push ({'regex':/9\.[0-9]\.[0-9]\.[0-9]/g, 'replace':'x'})
checkConv['advdh45'].push ({'regex':/0\.0\.0\.0/g, 'replace':'z'})
//rules.push("conv-advdh45=9\\.(4\\.2\\.2).[0-9].[0-9]=v ;  9\\.(1\\.2\\.2).[0-9].[0-9]=v ; 9\\.[0-9].[0-9].[0-9]=x; 0.0.0.0=z");
rules.push("rule-DH45M = advdh45: ^x");
rules.push("why-DH45M = max of 9.4.2.2 or 9.1.2.2 allowed on 45 up");

checkConv['advdhv'] = []
checkConv['advdhv'].push ({'regex':/9\.(1\.2\.2)/g, 'replace':'v'})
checkConv['advdhv'].push ({'regex':/9\.[0-9]\.[0-9]\.[0-9]/g, 'replace':'x'})
checkConv['advdhv'].push ({'regex':/0\.0\.0\.0/g, 'replace':'z'})
//rules.push("conv-advdhv= 9\\.(1\\.1\\.1).[0-9].[0-9]=v ; 9\\.[0-9].[0-9].[0-9]=x; 0.0.0.0=z");
rules.push("rule-DHVM = advdhv: ^. x");
rules.push("why-DHVM = max of 9.1.1.1 allowed on vertical up");

// Single lines
rules.push("1.1.1.1-4");
rules.push("1.1.2.1-4 NOU");
rules.push("1.1.3.1-4 NOU");
rules.push("1.1.6.1-3 NOU ; NRLevFly");
rules.push("1.1.6.4   NOU ; NRPushout");
rules.push("1.1.7.1-2 NOU ; NRLevFly ");
rules.push("1.1.7.3   NOU ; NRPushout");
rules.push("1.1.7.4   NOU");

// Shark tooths
rules.push("1.2.1.1 NOU");
rules.push("1.2.1.3 NOU ; NRLevFly ");
rules.push("1.2.2.3 NOU ; NRLevFly");
rules.push("1.2.3.1 NOU ; NRLevFly ");
rules.push("1.2.3.3-4 NOU ; NRLevFly ");
rules.push("1.2.4.2-4 NOU ; NRLevFly ");
rules.push("1.2.5.1 NOU");
rules.push("1.2.5.4 NOU");
rules.push("1.2.6.1 NOU");
rules.push("1.2.6.3 NOU");
rules.push("1.2.7.1 NOU");
rules.push("1.2.7.4 NOU");
rules.push("1.2.8.1 NOU");
rules.push("1.2.8.3 NOU");

// Rolling circles
rules.push("2.1.1.1-2");
rules.push("2.1.3.1-4");
rules.push("2.2.1.1-2");
rules.push("2.2.3.1-4");
rules.push("2.2.5.1-4");
rules.push("2.3.1.1-2");
rules.push("2.3.4.1-4");
rules.push("2.4.5.1-2");
rules.push("2.4.7.1-2");

// Stall turns
rules.push("5.2.1.1 NOU");
rules.push("5.2.1.2-3 NOU ; NRPushout");
rules.push("5.2.1.4 NOU");
rules.push("5.3.1.1  NOU ; NF1 ; NF2 ; DHVM ; DH45M");
rules.push("5.3.1.2-3  NOU ; NF1 ; NF2 ; DHVM ; DH45M ; NRPushout");
rules.push("5.3.1.4  NOU ; NF1 ; NF2 ; DHVM ; DH45M");
rules.push("5.3.2.1 NOU ; NF1 ; NF2 ; DHVM ; DH45M");
rules.push("5.3.2.1-4 NOU ; NF1 ; NF2 ; DHVM ; DH45M ; NRPushout");
rules.push("5.3.2.4 NOU ; NF1 ; NF2 ; DHVM ; DH45M");

// Half loops
rules.push("7.2.1.1-2  NF1");
rules.push("7.2.1.3-4  NF2");
rules.push("7.2.2.1-2 NF1");
rules.push("7.2.2.3-4 NF2");
rules.push("7.2.3.1-2  NF1");
rules.push("7.2.3.3-4  NF2");
rules.push("7.2.4.1-2  NF1");
rules.push("7.2.4.3-4  NF2");

// Goldfish
rules.push("7.3.1.2-3 NOU");
rules.push("7.3.2.1   NOU");
rules.push("7.3.2.3-4 NOU");
rules.push("7.3.3.3   NOU");
rules.push("7.3.4.1   NOU");
rules.push("7.3.4.4   NOU");

// Loops
rules.push("7.4.1.1-2 NOU");
rules.push("7.4.2.1-2 NOU");
rules.push("7.4.3.1-2 NOU");
rules.push("7.4.5.1 NR1 ; NR2");
rules.push("7.4.6.1");


// Cuban eights
rules.push("7.8.1.1-2 NOU ; NF1");
rules.push("7.8.1.3-4 NOU");
rules.push("7.8.2.1-2 NOU ; NF1");
rules.push("7.8.2.3-4 NOU");
rules.push("7.8.3.1 NOU ; NF1");
rules.push("7.8.3.4 NOU");
rules.push("7.8.4.1 NOU ; NF1");
rules.push("7.8.4.4 NOU");
rules.push("7.8.5.1-2 NOU ; NF3");
rules.push("7.8.5.3-4 NOU");
rules.push("7.8.6.2 NOU ; NF3");
rules.push("7.8.6.3 NOU");
rules.push("7.8.7.1-2 NOU ; NF3");
rules.push("7.8.7.3-4 NOU");
rules.push("7.8.8.1 NOU ; NF3");
rules.push("7.8.8.4 NOU");

// Humpty bumps
rules.push("8.4.1.1 NOU");
rules.push("8.4.1.2 NOU ; NRPushout");
rules.push("8.4.2.1 NOU ; NRPushout");
rules.push("8.4.2.2 NOU");
rules.push("8.4.3.1 NOU");
rules.push("8.4.3.2 NOU ; NRPushout");
rules.push("8.4.4.1 NOU ; NRPushout");
rules.push("8.4.4.2 NOU");

// Diagonal bumps
rules.push("8.4.13.1 NOU ; NF1 ; NF2");
rules.push("8.4.14.1 NOU ; NF1 ; NF2");
rules.push("8.4.15.1-2 NOU ; NF2");
rules.push("8.4.16.1-2 NOU ; NF2");
rules.push("8.4.18.1-2 NOU ; NF2");

// Reverse Cuban
rules.push("8.5.1.1-2 NOU1; NF2");
rules.push("8.5.1.3-4 NOU1");
rules.push("8.5.2.1-2 NOU1; NF2");
rules.push("8.5.2.3-4 NOU1");

rules.push("8.5.3.1-2 NOU1; NF2");
rules.push("8.5.3.3-4 NOU1 ");
rules.push("8.5.4.1-2 NOU1; NF2");
rules.push("8.5.4.3-4 NOU1");

// Cuban
rules.push("8.5.5.1-2 NF1 ; NOU2");
rules.push("8.5.5.4 NOU2");
rules.push("8.5.6.1-2 NF1 ; NOU2");
rules.push("8.5.6.4 NOU2");
rules.push("8.5.7.1-2 NF1 ; NOU2");
rules.push("8.5.7.3 NOU2");
rules.push("8.5.8.1-2 NF1 ; NOU2");
rules.push("8.5.8.3 NOU2");

// P loops
rules.push("8.6.1.1 NOU1 ; NR3Q1 ;NR2 ;NF3 ");
rules.push("8.6.1.4 NOU1");
rules.push("8.6.2.1   NOU1 ; NR3Q1 ;NR2 ;NF3");
rules.push("8.6.2.4 NOU1");
rules.push("8.6.3.1-2   NOU1 ; NR3Q1 ;NR2 ;NF3 ");
rules.push("8.6.3.3  NOU1");
rules.push("8.6.4.1-2   NOU1 ; NR3Q1 ;NR2 ;NF3 ");
rules.push("8.6.4.3  NOU1");
rules.push("8.6.5.1   NOU2; NOU3; NF1 ;NH2F3 ");
rules.push("8.6.6.1   NOU2; NOU3; NF1 ;NH2F3 ; NRPushout");
rules.push("8.6.6.2   NOU2; NOU3; NF1 ;NH2F3 ");
rules.push("8.6.7.2   NOU2; NOU3; NF1 ;NH2F3 ");
rules.push("8.6.8.1   NOU2; NOU3; NF1 ;NH2F3 ");
rules.push("8.6.8.2   NOU2; NOU3; NF1 ;NH2F3 ; NRPushout");

// ROLLS
rules.push("9.1.1.1-2");
rules.push("9.1.1.3"); //9.1.1.3 (3/4 up) may not be followed by fly-off
rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.3.1-4");
rules.push("9.1.3.6");
rules.push("9.1.3.8");
rules.push("9.1.4.2");
rules.push("9.1.4.4");
rules.push("9.1.5.1-2");
rules.push("9.1.5.3"); //9.1.5.3 (3/4 down) may not be followed by negative

rules.push("9.2.2.4");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.2.4.4");

rules.push("9.4.1.2"); // may not be followed by level fly-off
rules.push("9.4.2.2");
rules.push("9.4.2.4");
rules.push("9.4.3.2-4");
rules.push("9.4.4.2");
rules.push("9.4.5.2"); // may not be followed by negative recovery

rules.push("9.8.1.1");
rules.push("9.8.2.2");
rules.push("9.8.3.2");
rules.push("9.8.3.4");
rules.push("9.8.5.1");

// Snaps
rules.push("9.9.2.2");
rules.push("9.9.2.4");
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.9.3.6");
rules.push("9.9.4.2");
rules.push("9.9.4.4");
rules.push("9.9.5.2-3");
rules.push("9.9.10.2");

// Spins
rules.push("9.11.1.4-6");
rules.push("9.12.1.4-6");
