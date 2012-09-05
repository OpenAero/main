// allowed.js 0.9.4

// This file is part of OpenAero.

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
    
// This file defines all the rules for sequence checking.
// Every rule is encoded in the following manner: rules.push("*ENCODING*");
// The 'push' term is not related to pushing or pulling in aerobatics but is necessary for the software
// The *ENCODING* part is of the following format:
// This format should be strictly maintained to make sure the software works!

// First, we define the rules array
var rules = new Array();
//$Header: d:\my\cvsroot/olan/allowed.txt,v 1.22 2009/06/06 00:19:01 mg Exp $
//
// this contains a list of allowed and/or required figures for specific programs
// program action to check a sequence:
// 1. create a form-A like list of figures. each figure on a new line. first number on line is 
//    the base figure. next are all rolls, 0.0.0.0(0) indicate optional roll not used.
//	 opposite or linked rolls are x,y or x;y etc.
//    e.g  2t4,3f line would be:		 1.14.1 9.1.2.2 9.1.5.1,9.9.5.3
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

// for example, using "group-snap=^9\.(09)" defines the group of inside snaps.
// you can use "snap-max=4" to specify a maximum of 4 snaps per sequence,
// snap-maxperfig=1 to allow at most one snap per figure,
// and "snap-repeat=2" to specify any snap element can be repeated at most twice.

// a (section) describes a part of sequence checking that is not shown in the 'Sequence info' lists.
// These are usually common sections, like (both advanced free)

// a [section] describes a specific sequence for checking which will be shown in the 'Sequence info' lists.
// [iac unlimited free]	first element is rules type, 2nd sequence type 3rd is program
// each section describes general rules using grouping, and specific rules per 
// allowed figure. A list of figures is provided which are allowed explicitly,
// plus an "allow=" can be used to specify which figures to allow by regex
// using a regular expression.

// example 
// conv-foconv= ^9\.1=f ; ^9\.[^1]=o
// rule-no2ndsnap=foconv: [fo],o|[fo,]+ [fo],o

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
//fig-connector=		regex to define figures as "connectors" which are not checked (for unknown sequences)
//fig-connector-min= minimum number of figures required in seq for the "connector" rule to be applied
//floating-point=	number of floating point that can be reduced from program if needed. FP is included in k-max.




rules.push("group-k=^"); // group k is special, total the K-factor per fig/seq
rules.push("group-basefig=^[1-8]");
rules.push("group-basefigex11=^(1\.[2-9]|1\.1\d|[2-8])");
rules.push("group-roll=^9\.[1248]\.");
rules.push("group-snap=^9\.(9|10)");
rules.push("group-isnap=^9\.9");
rules.push("group-osnap=^9\.10");
rules.push("group-spin=^9\.1[12]");
rules.push("group-uspin=^9\.11");

rules.push("group-fam1=^1\..*");
rules.push("group-fam2=^2\..*");
rules.push("group-fam3=^3\..*");
rules.push("group-fam4=^4\..*");
rules.push("group-fam5=^5\..*");
rules.push("group-fam6=^6\..*");
rules.push("group-fam7=^7\..*");
rules.push("group-fam8=^8\..*");
rules.push("group-fam9=^9\..*");

rules.push("group-froll=^9\.1\.");
rules.push("group-hroll=^9\.2");
rules.push("group-troll=^9\.3");
rules.push("group-qroll=^9\.4");
rules.push("group-eroll=^9\.8");
rules.push("group-sroll=^9\.13");
rules.push("group-hesroll=^9\.[2-8]");

//super groups ("G") are matched the full catalog info. this one indicates real opposite rolls (spin-roll is not!)
//note that Group-opposite count opposites on base figures, NOT actual opposites (1,1c1,2 will be counted ONCE). 

rules.push("Group-opposite=(^| )9\.([1-9]|10)\.[\d()\.]+,");
rules.push("opposite-name=opposite rolls");

//used to avoid a line-only figure (0 and -0-)
rules.push("Group-emptyline=^\s*1\.1\.[1-4]\(\d+\)\s*0\.0\.0\.0\(0\)\s*$");
rules.push("emptyline-name=lines(1.1.1-1.1.4) without rolls");

//used to allow k2 and k24 but not k2 twice, etc for glider int. indicate repeations of complete figures
rules.push("Group-combined=^			");
rules.push("combined-name=combination figures (base and rolls)");

rules.push("k-name=K factor"); //special, counts actual K instead of figures count
rules.push("basefig-name=base figures");
rules.push("basefigex11-name=base figures except 1.1.x");
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

rules.push("conv-rfsz=^9\.[1248]\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");

// NF1 - no flick on roll#1
// NF2 - no flick on roll#2
// NOU1 - no opposite or unlinked rolls on roll#1
// LRH1 - limit roll to 1/2 on roll#1

rules.push("rule-NF1=rfsz:^(f|\w,f)");
rules.push("rule-NF2=rfsz:^[\w,]+ (f|\w,f)");
rules.push("rule-NF3=rfsz:^[\w,]+ [\w,]+ (f|\w,f)");

rules.push("why-NF1=no flick is allowed on the first roll element");
rules.push("why-NF2=no flick is allowed on the second roll element");
rules.push("why-NF3=no flick is allowed on the last roll element");


rules.push("rule-NOU  =rfsz: ^(\w,\w)|([\w,]+ \w,\w)|([\w,]+ [\w,]+ \w,\w)");
rules.push("rule-NOU1 =rfsz: ^\w,\w");
rules.push("rule-NOU2 =rfsz: ^[\w,]+ \w,\w");
rules.push("rule-NOU3 =rfsz: ^[\w,]+ [\w,]+ \w,\w");

rules.push("why-NOU  =no opposite or unlinked rolls allowed on non-horizontal lines");
rules.push("why-NOU1  =no opposite or unlinked rolls allowed on non-horizontal lines");
rules.push("why-NOU2  =no opposite or unlinked rolls allowed on non-horizontal lines");
rules.push("why-NOU3  =no opposite or unlinked rolls allowed on non-horizontal lines");

rules.push("rule-NR1 = rfsz:^[^z]");
rules.push("rule-NR2 = rfsz:^[\w,]+ [^z]");
rules.push("rule-NR3 = rfsz:^[\w,]+ [\w,]+ [^z]");

rules.push("why-NR1  =no roll allowed for first rolling element ");
rules.push("why-NR2  =no roll allowed for second rolling element");
rules.push("why-NR3  =no roll allowed for third rolling element");


//#######################################################################
//##### KNOWNS ##########################################################
//#######################################################################
rules.push("[civa unlimited programq]");
rules.push("more=civa unlimited known");
rules.push("[civa advanced programq]");
rules.push("more=civa advanced known");

rules.push("[iac sportsman known]");
rules.push("poslj=6");
rules.push("allow=^([1-8]|0\.[12]|9\.([12348]|11))"); //allow cloverleaf
rules.push("[iac intermediate known]");
rules.push("poslj=8");
rules.push("allow=^([1-8]|9\.([123489]|1[12]))");
rules.push("[iac advanced known]");
rules.push("poslj=12");
rules.push("allow=^([1-8]|9\.([123489]|1[12]))");
rules.push("[civa advanced known]");
rules.push("poslj=10");
rules.push("posnl=40");
rules.push("allow=^([1-8]|9\.([123489]|1[12]))");
rules.push("[iac unlimited known]");
rules.push("poslj=20");
rules.push("allow=^[1-9]");
rules.push("[civa unlimited known]");
rules.push("poslj=10");
rules.push("posnl=60");
rules.push("allow=^[1-9]");



rules.push("[iac glider sportsman known]");
rules.push("poslj=15");
rules.push("allow=^[0-9]");

rules.push("[iac glider intermediate known]");
rules.push("poslj=15");
rules.push("allow=^[1-9]");

rules.push("[iac glider unlimited known]");
rules.push("poslj=20");
rules.push("allow=^[1-9]");
rules.push("[civa glider unlimited known]");
rules.push("poslj=10");
rules.push("posnl=35");
rules.push("allow=^[1-9]");

rules.push("[civa glider advanced unknown]");
rules.push("poslj=10");
rules.push("posnl=35");
rules.push("k-min=130");
rules.push("k-max=145");
rules.push("floating-point=3");
rules.push("allow=^[1-9]");

rules.push("[civa glider unlimited unknown]");
rules.push("poslj=10");
rules.push("posnl=35");
rules.push("k-min=175");
rules.push("k-max=190");
rules.push("floating-point=3");
rules.push("allow=^[1-9]");

//######################################################################################
//##### IAC SPORTS & INTERMEDIATE FREE #################################################
//######################################################################################
rules.push("[iac sportsman free]");
rules.push("poslj=6");
rules.push("floating-point=1");
rules.push("k-max=126"); //value good for 2009 only inc f.p
rules.push("basefig-max=25"); //fixme? there is no actual limit

rules.push("group-loop8s=^7\.([1-9]\.|10)");
rules.push("loop8s-name=loops and eights");
rules.push("loop8s-min=1");

rules.push("fam8-min=1");
rules.push("roll-min=1");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("basefigex11-repeat=1");
rules.push("fam9-repeat=1");

rules.push("allow=^([1-9]|0.[12])"); //all figures + clover leaf

rules.push("[baea intermediate free]");
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

rules.push("allow=^[1-9]"); //all figures are allowed for the free program


rules.push("[iac intermediate free]");
rules.push("poslj=8");
rules.push("basefig-max=15");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");
rules.push("floating-point=1");
rules.push("k-max=191"); //inc fp


rules.push("fam5-min=1");
rules.push("fam8-min=1");

rules.push("group-loop8s=^7\.([1-9]\.|10)");
rules.push("loop8s-name=loops and eights");
rules.push("loop8s-min=1");

rules.push("roll-min=1");
rules.push("snap-min=1 ");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("basefigex11-repeat=1");
rules.push("fam9-repeat=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the free program


//######################################################################################
//##### VINK YAK-52 & INTERMEDIATE FREE ########################################
//######################################################################################

//
// Modified for 2011 WL
//

rules.push("[vink intermediate free]");
rules.push("posnl=20");
rules.push("basefig-max=11");
rules.push("k-max=170");

rules.push("fam1-min=1");

rules.push("group-roller=^2.([3-9]|1[0-9]|20)");
rules.push("roller-name=Rolling turn, family 2.3 to 2.20");
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

rules.push("allow=^[1-9]"); //all figures are allowed for the free program

rules.push("[vink yak52 free]");
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

rules.push("group-roller=^2.([3-9]|1[0-9]|20)");
rules.push("roller-name=Rolling turn, family 2.3 to 2.20");
rules.push("roller-min=1");

rules.push("emptyline-max=0");

rules.push("basefig-repeat=1");
rules.push("fam9-repeat=1");

rules.push("opposite-min=1"); //one opposite roll is required!

rules.push("allow=^[1-9]"); //all figures are allowed for the free program

//######################################################################################
//##### ADVANCED FREE #################################################################
//######################################################################################

//note IAC rules are different than CIVA: 7.1-7.10 req (not just fam7)

rules.push("[iac advanced free]");
rules.push("group-loop8s=^7\.([1-9]\.|10)");
rules.push("loop8s-name=loops and eights");
rules.push("loop8s-min=1");

rules.push("emptyline-max=0");
rules.push("floating-point=1");
rules.push("k-max=301"); //inc fp
rules.push("poslj=12");
rules.push("basefig-max=12"); // changed from 15 only in 2008
rules.push("more=both advanced free");

rules.push("[civa advanced free]");
rules.push("posnl=40"); //no line judges
rules.push("poslj=10");
rules.push("k-max=300");
rules.push("basefig-max=12");
//for 2006 basefig-max=15
rules.push("more=both advanced free");



rules.push("(both advanced free)");
rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");


rules.push("group-roller=^2.([3-9]|1[0-9]|20)");
rules.push("roller-name=Rolling turn, family 2.3 to 2.20");

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

rules.push("allow=^[1-9]"); //all figures are allowed for the free program


//################################################################################
//##### GLIDERS FREE #############################################################
//################################################################################

rules.push("[iac glider intermediate free]");
rules.push("poslj=15");
rules.push("floating-point=3");

rules.push("k-max=143"); //140 offically but upto 143 allowed on form A with FP

rules.push("seqcheck-upstart=^\s*((e\a+|\[.*?\]|{.*?}|\".*?\"|-?\d*%|(-?\d*[<>^/])+)\s*)*[~+`]*[^-]");
rules.push("upstart-name=Sequence must start flying upright");

rules.push("seqcheck-upend=[\da-z.`'][`~+]*>?\s*$");
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


rules.push("[iac glider unlimited free]");
rules.push("poslj=35");
rules.push("spin-max=1");
rules.push("emptyline-max=0");
rules.push("more=both glider unlimited free");

rules.push("[iac glider advanced free]");
rules.push("poslj=35");
rules.push("spin-max=1");
rules.push("emptyline-max=0");
rules.push("more=both glider advanced free");

rules.push("[civa glider advanced free]");
rules.push("poslj=15");
rules.push("posnl=50");
rules.push("more=both glider advaced free");

rules.push("[civa glider unlimited free]");
rules.push("poslj=15");
rules.push("posnl=50");
rules.push("more=both glider unlimited free");

rules.push("(both glider unlimited free)");

rules.push("basefig-max=10");
rules.push("floating-point=3");
//for 2006: k-max=223	#220 offically but upto 223 allowed on form A

rules.push("k-max=233"); //230 offically but upto 233 allowed on form A

rules.push("seqcheck-upend=[\da-z][~+]*>?\s*$");
rules.push("upend-name=Sequence must end flying upright");

rules.push("group-roller=^2.([3-9]|1[0-57-9]|20)");
rules.push("roller-name=Rolling turn, family 2.3 to 2.20 at least one roll");

rules.push("group-froll2=^9\.1\.\d\.[^1]	");
rules.push("froll2-name=slow roll at least 1/2");

rules.push("roller-min=1");
rules.push("fam5-min=1");
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

rules.push("froll2-min=1");
rules.push("hesroll-min=1"); //civa is unclear "two successive elments of a hes roll"
rules.push("isnap-min=1");
rules.push("osnap-min=1");
//for 2006: spin-min=1
//for 2006: sroll-min=1

rules.push("basefigex11-repeat=1");
//froll-repeat=99	note: rolls can be repeated
rules.push("hesroll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the free program


rules.push("(both glider advanced free)");

rules.push("basefig-max=10");
rules.push("floating-point=3");

rules.push("k-max=163"); //160 offically but upto 163 allowed on form A

rules.push("seqcheck-upend=[\da-z][~+]*>?\s*$");
rules.push("upend-name=Sequence must end flying upright");

rules.push("group-roller=^2\.([12]|3\.1)");
rules.push("roller-name=Turn, family 2.1 or 2.2 or 2.3.1");

rules.push("group-froll2=^9\.1\.\d\.[^1]	");
rules.push("froll2-name=slow roll at least 1/2");

rules.push("roller-min=1");
rules.push("fam5-min=1");
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

rules.push("froll2-min=1");
rules.push("hesroll-min=1"); //civa is unclear "two successive elments of a hes roll"

rules.push("basefigex11-repeat=1");
//froll-repeat=99	note: rolls can be repeated
rules.push("hesroll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("allow=^[1-9]"); //all figures are allowed for the free program

//######################################################################################
//##### UNLIMITED FREE #################################################################
//######################################################################################
rules.push("[iac unlimited free]");
rules.push("poslj=26");
rules.push("emptyline-max=0");
rules.push("floating-point=1");
rules.push("basefig-max=9"); //before 2008: 15
rules.push("k-max=421"); //inc floating point
rules.push("more=both unlimited free");

rules.push("[civa unlimited free]");
rules.push("posnl=60"); //assume no line judges
rules.push("poslj=20");
//for 2006: basefig-max=10
rules.push("basefig-max=9");
rules.push("k-max=420");
rules.push("more=both unlimited free");

rules.push("(both unlimited free)");
rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");
//for 2005: k-maxperfig=99	#starting with 2006 this was removed

rules.push("group-roller=^2\.([5-9]|1[0-5]|1[7-9]|20)");
rules.push("roller-name=Rolling turn, family 2.5-2.15 or 2.17-2.20");
rules.push("group-humpty=^8\.[1-4]\.");
rules.push("humpty-name=family 8.1-8.4 (humpty bumps)");

rules.push("fam1-min=1");
rules.push("roller-min=1");
rules.push("fam5-min=1");
rules.push("fam5-max=3");
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("humpty-max=4");

rules.push("spin-min=1"); //not clear if one spin is required:
rules.push("spin-max=1"); //it say "only 1 figure of 9.11/9.12"

rules.push("isnap-min=2");
rules.push("osnap-min=2");

rules.push("opposite-min=1"); //one opposite roll is required!

rules.push("allow=^[1-9]"); //all figures are allowed for the free program



//#######################################################################################
//###################### UNKNOWNS #######################################################
//#######################################################################################
rules.push("[iac intermediate unknown]");
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

rules.push("conv-hrfsz=^9\.[248]\.=h;^9\.1\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");

rules.push("rule-NHR1 = hrfsz:^h");
rules.push("why-NHR1 = no hesitation roll is allowed for 1st roll");

rules.push("rule-NHR2 = hrfsz:^[\w,]+ h");
rules.push("why-NHR2 = no hesitation roll is allowed for 2nd roll");

rules.push("rule-MAX1 = rfsz: [^z] [^z]");
rules.push("why-MAX1 = a maximum of one optional roll may be added to figure");


rules.push("allow-defrules = NOU ");

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



//#######################################################################################
//###################### UNLIMITED UNKNOWNS #############################################
//#######################################################################################


rules.push("[iac unlimited unknown]");
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


rules.push("group-vsnap=^9\.(9|10)\.[16]");
rules.push("vsnap-name=vertical snap");
rules.push("isnap-max=4");
rules.push("osnap-max=4");
rules.push("vsnap-min=1");
rules.push("snap-max=6");

rules.push("more=all unlimited unknown figures");

rules.push("[civa unlimited unknown1]");
rules.push("more=civa unlimited unknown");
rules.push("[civa unlimited 1stunknown]");
rules.push("more=civa unlimited unknown");
rules.push("[civa unlimited program2]");
rules.push("more=civa unlimited unknown");

//
// fixme the 2nd unknown is now "free unknown" and should auto detect 1-4 connectors and set total K to 24
//
rules.push("[civa unlimited unknown2]");
rules.push("more=civa unlimited unknown");
rules.push("[civa unlimited 2ndunknown]");
rules.push("more=civa unlimited unknown");
rules.push("[civa unlimited program3]");
rules.push("more=civa unlimited unknown");

rules.push("[civa unlimited unknown]");
rules.push("poslj=10");
rules.push("posnl=60");
rules.push("group-one=^1\.([6-9]|1[01])\.[34]");
rules.push("one-name=family 1.6-11 columns 3&4");
rules.push("group-two=^8\.([1-4]|1[5-8]|3[1-4])\.[34]");
rules.push("two-name=family 8.1-4,15-18,31-34 columns 3&4");
rules.push("group-vsnap=^9\.(9|10)\.[16]");
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

// how to define a "connector" figure:
// A. any LINE 1.[167].x with at most one 1/4 or 1/2 roll
// B. any Half loop 7.[1-4].x with at most half roll
// B. humpty without rolls, P/RP loops without rolls

// these figures are considered "conectors" when checking unknown seq.
rules.push("fig-connector=(^(1\.[12367]\.[1-4]|7\.[1-4]\.[1-4])( 9\.1\..\.[12])?$)|(^8\.[1-4]\.[12]( 9\.1\..\.[12])?$)|(^8\.3[39]\.1$)|(^8\.(34|4[01])\.[12]$)|(^2\.2\.[1-4]$)");
rules.push("fig-connector-min=11");

rules.push("more=all unlimited unknown figures");

//###################################################################################################
rules.push("(all unlimited unknown figures)");

rules.push("conv-updegstop= ^9\.1\.1\.([1-5]) = $1:1 ; ^9\.2\.1\.4 = 4:2 ; ^9\.4\.1\.([234]) = $1:$1 ; ^9\.8\.1\.1 = 1:2 ; ^9\.8\.1\.2 = 2:4 ; ^9\.[1-8]\.1=e; ^9\.[1-8]=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");
rules.push("rule-VUP450 = updegstop: (.:.,5:.|2:.,4:.|3:.,[34]:.|4:.,[234]:.|5:.,.:.)");
rules.push("why-VUP450  = a maximum of 450 degrees are allowed on vertical up opposite rolls ");

rules.push("conv-climbdegstop= ^9\.1\.[12]\.([1-5]) = $1:1 ; ^9\.2\.[12]\.4 = 4:2 ; ^9\.4\.[12]\.([234]) = $1:$1 ; ^9\.8\.[12]\.1 = 1:2 ; ^9\.8\.[12]\.2 = 2:4 ; ^9\.[1-8]\.[12]=e; ^9\.[1-8]=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");
rules.push("rule-CLIMB450 = climbdegstop: ^(.:. .:.,[45]:.|.:. 2:.,[45]:.|.:. 3:.,[2-5]:.|.:. [45]:.,.:.|2:. .:.,[345]:.|2:. 2:.,[2-5]:.|2:. 3:.,.:.|3:. .:.,[2-5]:.|3:. [2-5]:.,.:.|[45]:. .:.,.:.|.:. 5:.|2:. 4:.|3:. [34]:.|4:. [234]:.|5:. .:.)");
rules.push("why-CLIMB450  = a maximum of 450 degrees are allowed on climbing rolls ");

rules.push("rule-VUP4S = updegstop: (e,|,e|.:.,.:4|.:2,.:3|.:3,.:[23]|.:4,.:.)");
rules.push("why-VUP4S  = a maximum of 4 stops are allowed on vertical up opposite rolls ");

rules.push("rule-CLIMB4S = climbdegstop: ^(.:. .:.,.:[34]|.:. .:2,.:[234]|.:. .:[34],.:.|.:2 .:.,.:[234]|.:2 .:2,.:.|.:[34] .:.,.:.|.:. .:4|.:2 .:3|.:3 .:[23]|.:4 .:.)");
rules.push("why-CLIMB4S  = a maximum of 4 stops are allowed on climbing olls ");

rules.push("conv-downdegstop= ^9\.1\.5\.([1-4]) = $1:1 ; ^9\.2\.5\.4 = 4:2 ; ^9\.4\.5\.([23]) = $1:$1 ; ^9\.8\.5\.1 = 1:2 ; ^9\.8\.5\.2 = 2:4 ; ^9\.[1-8]\.5=e ; ^9\.[1248]=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");
rules.push("rule-VDOWN360 = downdegstop: (.:.,4:.|2:.,3:.|3:.,[23]:.|4:.,.:.)");
rules.push("why-VDOWN360  = a maximum of 360 degrees are allowed on vertical down opposite rolls ");

rules.push("rule-VDOWN3S = downdegstop: (e,|,e|.:.,.:[34]|.:[34],.:.|.:2,.:2)");
rules.push("why-VDOWN3S  = a maximum of 3 stops are allowed on vertical down opposite rolls ");

rules.push("conv-vdhfsz=^9\.[1248]\.[15]=v;^9\.[1248]\.[24]=d; ^9\.[1248]\.=h; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");
rules.push("rule-UnlimitedNOU  =vdhfsz: d,|,d|v,f|f,v");
rules.push("why-UnlimitedNOU  = opposite or unlinked rolls are not allowed");

rules.push("conv-hrfsz=^9\.[248]\.=h;^9\.1\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");

rules.push("rule-NF3TOPH  =hrfsz: (.,.|h) f$");
rules.push("why-NF3TOPH  = no flick roll on vertical down line after hesitation in the loop");

rules.push("rule-NF2UP360 = updegstop: ^(e|e,e|.:.,e|e,.:.|5:.|.:.,[45]:.|2:.,3:.|3:.,[23]:.|[45]:.,.:.) f");
rules.push("why-NF2UP360  = no flick roll on loop top after more than 360 roll going up");

rules.push("rule-NF2UP2STOP = updegstop: ^(e|.,e|e,.|.:[345]|.:.,.:[2-5]|.:[2-5],.:.) f");
rules.push("why-NF2UP2STOP  = no flick roll on loop top after more than 2 stops going up");

rules.push("conv-rhqefsz=^9\.1\.=r; ^9\.2\.=h; ^9\.4\.=q; ^9\.8\.=e; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");

rules.push("rule-N88	= rhqefsz: e");
rules.push("why-N88	    = 8 point roll is not allowed");

rules.push("allow-defrules=UnlimitedNOU ; VUP450; VUP4S ; VDOWN360 ; VDOWN3S ");


// ~%~  ~i?d%~ ~i?v%~ 
//1.1.1-4		#2009 only as linking figures
rules.push("1.2.1-4 ");
rules.push("1.3.1-4 ");
rules.push("1.6.1-4 ");
rules.push("1.7.1-4");

// z_- z^ -iz_ -iz^-

rules.push("1.10.1");
rules.push("1.10.4 ");
rules.push("1.11.1 ");
rules.push("1.11.4 ");

// ~%i?t%~  ~%i?k%~

rules.push("1.12.1-4");
rules.push("1.13.1-4");
rules.push("1.14.1-4 ");
rules.push("1.15.1-4");
rules.push("1.16.1-4");
rules.push("1.17.1-4");
rules.push("1.18.1-4");
rules.push("1.19.1-4");
rules.push(" ");
// ~[21]jo?1~   ~2j(|o|io|oi)2~ ~4j(|o|io|oi)[234]~ ~3j(|o|io|oi)3~ 
//              ~2j(|o|oi)15~					   ~3j(|o|io|oi)15~

rules.push("2.3.1-4");
rules.push("2.4.1-4");

rules.push("2.6.1-4");
rules.push("2.7.1-4");
rules.push("2.8.1-4");
rules.push("2.9.1-4");
rules.push("2.10.1-4");
rules.push("2.11.1-4");
rules.push("2.12.1-4");
rules.push("2.13.1-4");
rules.push("2.14.1-4");
rules.push("2.15.1-4");

rules.push("2.17.1-4");
rules.push("2.18.1-4");
rules.push("2.19.3-4");
rules.push("2.20.1-4");

// ~%h%~ ~%i?ta%~

rules.push("5.1.1-4 ");
rules.push("5.2.1-4  NF1 ; NF2 ; CLIMB4S ; CLIMB450 ");
rules.push("5.3.1-4	 NF1 ; NF2 ; CLIMB4S ; CLIMB450");
rules.push("6.1.1-4  NF1 ");
rules.push("6.2.1-4  NF1 ");

//half loops  
// ~%a%~ ~%m%~ ~o%~ io% -io%-  ~i?qo%~ %dq% -%idq%- qq -iqq- 

rules.push("7.1.1-2  NF1");
rules.push("7.2.1-2	 NF1");
rules.push("7.3.1-2  NF1");
rules.push("7.4.1-2  NF1");


rules.push("7.1.3-4  NF2");
rules.push("7.2.3-4	 NF2");
rules.push("7.3.3-4  NF2");
rules.push("7.4.3-4  NF2");

//loops
rules.push("7.5.1-2 NOU1");
rules.push("7.5.3-4 NOU1 ; NF1 ; N88");
rules.push("7.6.1-2 NOU1");
rules.push("7.7.1-2 ");
rules.push("7.7.3-4 NF1");
rules.push("7.8.1-2 ");
rules.push("7.8.3-4 NF1");

rules.push("7.9.1  NF1");
rules.push("7.9.4  NF2"); //doc say "no flick roll on any lower lines of figure" which means what?!
rules.push("7.10.1");
rules.push("7.10.4");

//goldfish
// ~%i?g%~
rules.push("7.19.1-4 ");
rules.push("7.20.1-4 ");
rules.push("7.21.1-4 ");
rules.push("7.22.1-4 ");

//cc
// ~%i?cc%~
rules.push("7.23.1-4 ");
rules.push("7.24.1-4 ");
rules.push("7.25.1-4 ");
rules.push("7.26.1-4 ");
rules.push("7.27.1-4 ");
rules.push("7.28.1-4 ");
rules.push("7.29.1-4 ");
rules.push("7.30.1-4 ");


//bumps
// ~%i?p?b%~
rules.push("8.1.1-4 ");
rules.push("8.2.1-4 ");
rules.push("8.3.1-4 ");
rules.push("8.4.1-4 ");

// %db%~   ~%rdb%~  ~%irdb%~
rules.push("8.13.1 ");
rules.push("8.14.1 ");
rules.push("8.15.1-4 ");
rules.push("8.16.1-4");
rules.push("8.17.1-4");
rules.push("8.18.1-4");

//rc
// ~%i?c%~  ~%i?rc%~ ~%i?rp%~
rules.push("8.31.1-2  NF2");
rules.push("8.32.1-2  NF2");
rules.push("8.37.1-2  NF2");
rules.push("8.38.1-2  NF2");
rules.push("8.31.3-4 ");
rules.push("8.32.3-4 ");
rules.push("8.37.3-4 ");
rules.push("8.38.3-4 ");

//rp
rules.push("8.33.1-2  NOU2; NF3; NF2UP360; NF2UP2STOP");
rules.push("8.34.1-2  NOU2; NF3; NF2UP360; NF2UP2STOP");
rules.push("8.39.1-2  NOU2; NF3; NF2UP360; NF2UP2STOP");
rules.push("8.40.1-2  NOU2; NF3; NF2UP360; NF2UP2STOP");

rules.push("8.33.3-4    ");
rules.push("8.34.3-4   ");
rules.push("8.39.3-4");
rules.push("8.40.3-4");

//c
rules.push("8.41.1-2  NF1 ");
rules.push("8.42.1-2  NF1 ");
rules.push("8.47.1-2  NF1 ");
rules.push("8.48.1-2  NF1 ");
rules.push("8.41.3-4");
rules.push("8.42.3-4");
rules.push("8.47.3-4");
rules.push("8.48.3-4");

//p
rules.push("8.43.1-2  NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.44.1-2  NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.51.1-2  NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.52.1-2  NOU2 ; NF1 ; NF3TOPH ");
rules.push("8.43.3-4");
rules.push("8.44.3-4");
rules.push("8.51.3-4");
rules.push("8.52.3-4");


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

//snaps & spins
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

// [156]i?s

rules.push("9.11.1.4-6");
rules.push("9.12.1.4-6");


//#######################################################################################

rules.push("[civa advanced unknown]");
rules.push("more=civa advanced unknown1");
rules.push("[civa advanced 1stunknown]");
rules.push("more=civa advanced unknown1");
rules.push("[civa advanced 2ndunknown]");
rules.push("more=civa advanced unknown2");
rules.push("[civa advanced program2]");
rules.push("more=civa advanced unknown1");
rules.push("[civa advanced program3]");
rules.push("more=civa advanced unknown2");

rules.push("[civa advanced unknown1]");
rules.push("k-maxperfig=35");
rules.push("more=civa advanced unknown base");

rules.push("[civa advanced unknown2]");
rules.push("k-maxperfig=40");
rules.push("more=civa advanced unknown base");

//#######################################################################################
rules.push("[iac advanced unknown]");
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


rules.push("more=all advanced unknown figures");

//#######################################################################################
rules.push("(civa advanced unknown base)");
//#######################################################################################
rules.push("poslj=10");
rules.push("posnl=40");

// general rules for AWAC: 10-14 figures, 
// limit on figure types (max1 spin etc)
// limit on snaps (2-4 total), (one max per figure)
// figures 10-14. Kfactor 15-35. 
// at most one of 1.14.3-4 1.15.3-4 amd one of 7.23-30.*

rules.push("group-one=^1.1[45].[34]");
rules.push("group-two=^7.(2[3-9]|30)");


rules.push("k-minperfig=15");

rules.push("snap-maxperfig=1");
rules.push("snap-min=2");
rules.push("snap-max=4");


rules.push("spin-max=1 ");

rules.push("one-name=family 1.14-15 columns 3&4 (inv tooth)");
rules.push("one-max=1");

rules.push("two-name=family 7.23-30 (full cubans)");
rules.push("two-max=1");

rules.push("basefig-min=10");
rules.push("basefig-max=10");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

// these figures are considered "conectors" when checking unknown seq.
rules.push("fig-connector=(^(1\.[12367]\.[1-4]|7\.[1-4]\.[1-4])( 9\.1\..\.[12])?$)|(^8\.[1-4]\.[12]( 9\.1\..\.[12])?$)|(^8\.3[39]\.1$)|(^8\.(34|4[01])\.[12]$)|(^2\.2\.[1-4]$)");
//minimum number of figures to start ignoring connectors
rules.push("fig-connector-min=11");

rules.push("more=all advanced unknown figures");

rules.push("(all advanced unknown figures)");

//############################################################
// extended conv rule version with limited vertical rolls=v(up) =n(down) 
// limited vertical rolls are 3/4 & 2/4 up(v =can't flyoff) or down(n=cant push out)
// for Advanced Unknwons only, of course.

rules.push("conv-adv=^9\.(1\.1\.3|4\.1\.2)=v ; ^9\.(1\.5\.3|4\.5\.2)=n; ^9\.[1248]\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z");

rules.push("rule-NRLevFly   =adv:v$");
rules.push("rule-NRPushout  =adv:n$");
rules.push("why-NRLevFly    = level fly off is not allowed after this roll");
rules.push("why-NRPushout   = negative recovery is not allowed after this roll");


//For Adv rp figures, we convert 3/4 up to 'p' which isnt allowed
rules.push("conv-advrp=^9\.(1\.1\.3)=x ;  ^9\.=r; ^0\.=z");
rules.push("rule-NR3Q1 =advrp:^x");
rules.push("why-NR3Q1  =no more than 1/2 roll is allowed for first rolling element position");

//for Adv p figures, we convert any hesitation full roll into 'h' to disallow flick down
//conv-advp=^9\.[248]\.3=h   ;   ^9\.[1248]\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\.=z
//note since 2006 no roll at all on top of loop...

rules.push("rule-NH2F3 =rfsz:^[\w,]+ r (f|\w,f)");
rules.push("why-NH2F3 = no flick allowed in third position when 2nd position has a roll");

//for Adv dh figures, we check for 9.4.2.2 or 9.2.1.2 on 45 and 9.1.1.1 on vert
rules.push("conv-advdh45=^9\.(4\.2\.2)=v ;  ^9\.(1\.2\.2)=v ; ^9\.=x; ^0\.=z");
rules.push("rule-DH45M = advdh45: ^x");
rules.push("why-DH45M = max of 9.4.2.2 or 9.1.2.2 allowed on 45 up");

rules.push("conv-advdhv= ^9\.(1\.1\.1)=v ; ^9\.=x; ^0\.=z");
rules.push("rule-DHVM = advdhv: ^. x");
rules.push("why-DHVM = max of 9.1.1.1 allowed on vertical up");

rules.push("1.1.1-4");
rules.push("1.2.1-4 NOU");
rules.push("1.3.1-4 NOU");
rules.push("1.6.1-3 NOU ; NRLevFly");
rules.push("1.6.4   NOU ; NRPushout");
rules.push("1.7.1-2 NOU ; NRLevFly ");
rules.push("1.7.3   NOU ; NRPushout");
rules.push("1.7.4   NOU ");

rules.push("1.12.1 NOU ");
rules.push("1.12.3 NOU ; NRLevFly ");
rules.push("1.13.3 NOU ; NRLevFly");
rules.push("1.14.1 NOU ; NRLevFly ");
rules.push("1.14.3-4 NOU ; NRLevFly ");
rules.push("1.15.2-4 NOU ; NRLevFly ");
rules.push("1.16.1 NOU");
rules.push("1.16.4 NOU  ");
rules.push("1.17.1 NOU  ");
rules.push("1.17.3 NOU  ");
rules.push("1.18.1 NOU  ");
rules.push("1.18.4 NOU  ");
rules.push("1.19.1 NOU  ");
rules.push("1.19.3 NOU ");

rules.push("2.1.3-4");
rules.push("2.2.1-4");
rules.push("2.3.1-4");
rules.push("2.6.1-4");
rules.push("2.8.1-4");
rules.push("2.9.1-4");
rules.push("2.10.1-4");
rules.push("2.17.1-4");

rules.push("5.1.1 NOU  ");
rules.push("5.2.1-4  NOU ; NF1 ; NF2 ; DHVM ; DH45M");
rules.push("5.3.1-4	 NOU ; NF1 ; NF2 ; DHVM ; DH45M");

rules.push("5.1.2-3 NOU ; NRPushout");
rules.push("5.1.4 NOU ");

rules.push("7.1.1-2  NF1");
rules.push("7.2.1-2	 NF1");
rules.push("7.3.1-2  NF1");
rules.push("7.4.1-2  NF1");


rules.push("7.1.3-4  NF2");
rules.push("7.2.3-4	 NF2");
rules.push("7.3.3-4  NF2");
rules.push("7.4.3-4  NF2");

//loops
rules.push("7.5.1 NOU");
rules.push("7.6.1-2 NOU");
rules.push("7.7.1-2 NOU");
rules.push("7.9.1 NR1 ; NR2");
rules.push("7.10.1");

//goldfish
rules.push("7.19.2-3 NOU");
rules.push("7.20.1   NOU");
rules.push("7.20.3-4 NOU");
rules.push("7.21.3   NOU");
rules.push("7.22.1   NOU");
rules.push("7.22.4   NOU");

//cc
rules.push("7.23.1-2 NOU");
rules.push("7.23.3   NOU");
//7.23.4  NOU
rules.push("7.24.2   NOU");
rules.push("7.24.4   NOU");
rules.push("7.25.1   NOU");
rules.push("7.25.4   NOU");
rules.push("7.26.1   NOU");
rules.push("7.26.4   NOU");
rules.push("7.27.3   NOU");
rules.push("7.28.3   NOU");
rules.push("7.30.1   NOU");
rules.push("7.30.4   NOU");

//bumps
rules.push("8.1.1 NOU");
rules.push("8.1.2 NOU ; NRPushout");
rules.push("8.2.1 NOU ; NRPushout");
rules.push("8.2.2 NOU");
rules.push("8.3.1 NOU");
rules.push("8.3.2 NOU ; NRPushout");
rules.push("8.4.1 NOU ; NRPushout");
rules.push("8.4.2 NOU");

rules.push("8.13.1 NOU ;NF1 ; NF2");
rules.push("8.14.1 NOU; NF1 ; NF2");
rules.push("8.15.1-2 NOU");
rules.push("8.16.1-2 NOU");
rules.push("8.18.1-2 NOU");

//rc
rules.push("8.31.1-2 NOU1; NF2");
rules.push("8.32.1-2 NOU1; NF2");
rules.push("8.31.3-4 NOU1");
rules.push("8.32.3-4 NOU1");

rules.push("8.37.1-2 NOU1; NF2");
rules.push("8.38.1-2 NOU1; NF2");
rules.push("8.37.3-4 NOU1 ");
rules.push("8.38.3-4 NOU1");

//rp
rules.push("8.33.1   NOU1 ; NR3Q1 ;NR2 ;NF3 ");
rules.push("8.34.1   NOU1 ; NR3Q1 ;NR2 ;NF3");
rules.push("8.34.2   NR1   ;NR2 ;NF3");

rules.push("8.39.1   NOU1 ; NR3Q1 ;NR2 ;NF3 ");
rules.push("8.40.1   NOU1 ; NR3Q1 ;NR2 ;NF3 ");
rules.push("8.40.2  NR1 ; NR2 ; NF3");
rules.push("8.40.3  NOU1");

//c
rules.push("8.41.1-2 NF1 ; NOU2");
rules.push("8.42.1-2 NF1 ; NOU2");
rules.push("8.41.4 NOU2");
rules.push("8.42.4 NOU2");
rules.push("8.47.1-2 NF1 ; NOU2");
rules.push("8.48.1-2 NF1 ; NOU2");
rules.push("8.47.3 NOU2");
rules.push("8.48.3 NOU2");

//p
rules.push("8.43.1   NOU2; NOU3; NF1 ;NH2F3 ");
rules.push("8.44.1   NOU2; NOU3; NF1 ;NH2F3 ; NRPushout");
rules.push("8.44.2   NOU2; NOU3; NF1 ;NH2F3 ");

rules.push("8.51.2   NOU2; NOU3; NF1 ;NH2F3 ");
rules.push("8.52.1   NOU2; NOU3; NF1 ;NH2F3 ");
rules.push("8.52.2   NOU2; NOU3; NF1 ;NH2F3 ; NRPushout");

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

//snaps & spins
rules.push("9.9.2.2");
rules.push("9.9.2.4");
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.9.3.6");
rules.push("9.9.4.2");
rules.push("9.9.4.4");
rules.push("9.9.5.2-3");
rules.push("9.9.10.2");

rules.push("9.11.1.4-6");
rules.push("9.12.1.4-6");

