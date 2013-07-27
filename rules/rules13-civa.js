// OpenAero rules13-civa.js file

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

// This file defines year (YY) and rule type (XXX) specific rules

//#
//# CIVA 2011, written and updated by Michael Golan, April 2011, based on Section 6 version 2011-1
//#
//#
//# Recopie par GG de rules11-civa avec intégration des régles Civa modifiées pour 2012.
//# Ces modifications sont signalées par "# Modif GG évolution Civa 2012".
//#
//# Puis changement de la numerotation en pseudo numerotation 2012
//#
//# Modifications 2013 (ajout Prog Q 2013, Suppression Prog free)  V 2013.0.50
//#
//# Added Yak 52 for 2013
//# OpenAero 1.3.4:
//# -Updated Free Unknown connectors info
//# OpenAero 1.3.7:
//# -Corrected Yak52 Free rules for figure repetition
//# -Moved rules from Intermediate to Yak52 as they are identical

//######################################################################################
//##### CIVA YAK52 FREE ################################################################
//######################################################################################

rules.push("[CIVA Yak52 Free]");
rules.push("posnl=30");
rules.push("basefig-max=12");
rules.push("k-max=180");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("eroll-min=1");
rules.push("snap-min=1");
rules.push("spin-min=1");

rules.push("group-roller=^2\\.(1\\.[23]|2\\.[2-6]|3\\.[2-5]|4\\.[2-8])");
rules.push("roller-name=Rolling turn, family 2.1.2 to 2.1.3, 2.2.2 to 2.2.6, 2.3.2 to 2.3.5, 2.4.2 to 2.4.8");
rules.push("roller-min=1");

rules.push("emptyline-max=0");

rules.push("opposite-min=1"); //one opposite roll is required!

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program

//######################################################################################
//##### CIVA INTERMEDIATE FREE #########################################################
//######################################################################################

rules.push("[CIVA Intermediate Free]");
rules.push("more=CIVA Yak52 Free");

//######################################################################################
//##### ADVANCED FREE #################################################################
//######################################################################################

rules.push("[civa advanced free]");
rules.push("posnl=30");//no line judges
rules.push("poslj=10");
rules.push("k-max=300");
rules.push("basefig-max=12");
//for 2006 basefig-max=15

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("group-roller=^2\\.(1\\.[23]|2\\.[2-6]|3\\.[2-5]|4\\.[2-8])");
rules.push("roller-name=Rolling turn, family 2.1.2 to 2.1.3, 2.2.2 to 2.2.6, 2.3.2 to 2.3.5, 2.4.2 to 2.4.8");

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
rules.push("spin-min=1");
//spin-max=1 # Modif GG évolution Civa 2012

//for 2006: opposite-min=0
rules.push("opposite-min=1");//one opposite roll is required!

rules.push("allow=^[1-9]");//all figures are allowed for the free program

//######################################################################################
//##### UNLIMITED FREE #################################################################
//######################################################################################

rules.push("[civa unlimited free]");
rules.push("posnl=60");//assume no line judges
rules.push("poslj=20");
//for 2006: basefig-max=10
rules.push("basefig-max=9");
rules.push("k-max=420");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");
//for 2005: k-maxperfig=99 #starting with 2006 this was removed

//group-roller=^2\.([5-9]|1[0-5]|1[7-9]|20)
//roller-name=Rolling turn, family 2.5-2.15 or 2.17-2.20
//group-humpty=^8\.[1-4]\.
//humpty-name=family 8.1-8.4 (humpty bumps)
rules.push("group-roller=^2\\.(2\\.[3-6]|3\\.[2-5]|4\\.[2-8])");
rules.push("roller-name=Rolling turn, family 2.2.3 to 2.2.6, 2.3.2 to 2.3.5, 2.4.2 to 2.4.8");

rules.push("fam1-min=1");
rules.push("roller-min=1");
rules.push("fam5-min=1");
//fam5-max=3 # Modif GG évolution Civa 2012
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
//humpty-max=4 # Modif GG évolution Civa 2012

rules.push("spin-min=1");//not clear if one spin is required:
//spin-max=1     #it say "only 1 figure of 9.11/9.12"
//spin-max=1 # Modif GG évolution Civa 2012

rules.push("isnap-min=2");
rules.push("osnap-min=2");

rules.push("opposite-min=1");//one opposite roll is required!

rules.push("allow=^[1-9]");//all figures are allowed for the free program

//#######################################################################################
//###################### UNLIMITED UNKNOWNS #############################################
//#######################################################################################

rules.push("[civa unlimited unknown1]");
rules.push("more=civa unlimited freeunknown");
rules.push("(civa unlimited 1stunknown)");
rules.push("more=civa unlimited freeunknown");
rules.push("[civa unlimited program2]");
rules.push("more=civa unlimited freeunknown");

rules.push("[civa unlimited unknown2]");
rules.push("more=civa unlimited freeunknown");
rules.push("(civa unlimited 2ndunknown)");
rules.push("more=civa unlimited freeunknown");
rules.push("[civa unlimited program3]");
rules.push("more=civa unlimited freeunknown");

rules.push("[civa unlimited freeunknown]");
rules.push("connectors=4/24");
rules.push("unknown-letters=ABCDEFGHIJ");

rules.push("more=civa unlimited unknown");

rules.push("[civa unlimited unknown]");
rules.push("poslj=10");
rules.push("posnl=60");
//group-one=^1\.([6-9]|1[01])\.[34]
//one-name=family 1.6-11 columns 3&4
//group-two=^8\.([1-4]|1[5-8]|3[1-4])\.[34]
//two-name=family 8.1-4,15-18,31-34 columns 3&4
rules.push("group-one=^1\\.(1[6-9]|11[01])\\.[34]");
rules.push("one-name=family 1.1.6-11 columns 3&4");
rules.push("group-two=^8\\.(4[1-4]|4[7-9]|410|5[1-2]|6[1-2])\\.[34]");
rules.push("two-name=family 8.4.1-4,8.4.7-10,8.5.1-2,8.6.1-2 columns 3&4");
rules.push("group-vsnap=^9\\.(9|10)\\.[16]\\.");
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

rules.push("more=civa unlimited unknownbase");

//# a single unknown figure, without sequence requirements
rules.push("(civa unlimited unknownfigure)");
rules.push("snap-maxperfig=1");
rules.push("k-minperfig=22");
rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");
rules.push("more=civa unlimited unknownbase");

//###################################################################################################
rules.push("(civa unlimited unknownbase)");

// Modif GG évolution Civa 2012
rules.push("conv-horstop=^9\\.(1|9|10)\\.[38]=1 ; ^9\\.2\\.3\\.4 = 2 ;^9\\.2\\.3\\.6 = 3 ;^9\\.2\\.3\\.8 = 4 ;^9\\.4\\.3\\.([1-8]) = $1; ^9\\.8\\.3\\.1 = 2;^9\\.8\\.3\\.2 = 4;^9\\.8\\.3\\.3 = 6;^9\\.8\\.3\\.4 = 8; ^9\\.=r ; ^0\\.=z");
rules.push("rule-Hor10stop = horstop:<11");
rules.push("why-Hor10stop  = a maximum of 10 stops are allowed on straight horizontal lines rolls");
// Fin modif GG évolution Civa 2012

rules.push("conv-climbqtrs=^9\\.([1-9]|10)\\.[1267]\\.([1-8]) = $2 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-climbstop=^9\\.(1|9|10)\\.[1267]=1 ; ^9\\.2\\.[12]\\.4 = 2 ;^9\\.2\\.[12]\\.6 = 3 ;^9\\.2\\.[12]\\.8 = 4 ;^9\\.4\\.[12]\\.([1-8]) = $1;^9\\.8\\.[12]\\.1 = 2;^9\\.8\\.[12]\\.2 = 4;^9\\.8\\.[12]\\.3 = 6;^9\\.8\\.[12]\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("conv-upqtrs=^9\\.([1-9]|10)\\.[16]\\.([1-8]) = $2 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-upstop=^9\\.(1|9|10)\\.[16]=1 ; ^9\\.2\\.1\\.4 = 2 ;^9\\.2\\.1\\.6 = 3 ;^9\\.2\\.1\\.8 = 4 ;^9\\.4\\.1\\.([1-8]) = $1; ^9\\.8\\.1\\.1 = 2;^9\\.8\\.1\\.2 = 4;^9\\.8\\.1\\.3 = 6;^9\\.8\\.1\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("conv-diagupqtrs=^9\\.([1-9]|10)\\.[27]\\.([1-8]) = $2 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-diagupstop=^9\\.1\\.2=1 ;^9\\.(9|10)\\.[27]=2 ; ^9\\.2\\.2\\.4 = 2 ;^9\\.2\\.2\\.6 = 3 ;^9\\.2\\.2\\.8 = 4 ;^9\\.4\\.2\\.([1-8]) = $1; ^9\\.8\\.2\\.1 = 2;^9\\.8\\.2\\.2 = 4;^9\\.8\\.2\\.3 = 6;^9\\.8\\.2\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("conv-downqtrs=^9\\.([1-9]|10)\\.(5|10)\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-downstop=^9\\.(1|9|10)\\.(5|10)=1 ; ^9\\.2\\.5\\.4 = 2 ;^9\\.2\\.5\\.6 = 3 ;^9\\.2\\.5\\.8 = 4 ;^9\\.4\\.5\\.([1-8]) = $1; ^9\\.8\\.5\\.1 = 2;^9\\.8\\.5\\.2 = 4;^9\\.8\\.5\\.3 = 6;^9\\.8\\.5\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("rule-VUP450 = upqtrs:<6");
rules.push("why-VUP450  = a maximum of 450 degrees are allowed on vertical up opposite rolls");

rules.push("rule-DIAGUP540 = diagupqtrs:<7");
rules.push("why-DIAGUP540  = a maximum of 540 degrees are allowed on diagonal up opposite rolls");

rules.push("rule-VUP4S = upstop:<5");
rules.push("why-VUP4S  = a maximum of 4 stops are allowed on vertical up opposite rolls");

rules.push("rule-DIAGUP4S = diagupstop:<5");
rules.push("why-DIAGUP4S  = a maximum of 4 stops (3 if snap) are allowed on diagonal up opposite rolls");

//note +<6 indicates the total count is less than 6 ... all climbing rolls combined
rules.push("rule-CLIMB450 = climbqtrs:+<6");
rules.push("why-CLIMB450  = a maximum of 450 degrees are allowed on climbing rolls");

rules.push("rule-CLIMB4S = climbstop:+<5");
rules.push("why-CLIMB4S  = a maximum of 4 stops are allowed on climbing rolls");

rules.push("rule-VDOWN360 = downqtrs:<5");
rules.push("why-VDOWN360  = a maximum of 360 degrees are allowed on vertical down opposite rolls");

rules.push("rule-VDOWN3S = downstop:<4");
rules.push("why-VDOWN3S  = a maximum of 3 stops are allowed on vertical down opposite rolls");

rules.push("conv-vdDhfsz=^9\\.[1248]\\.[15]=v;^9\\.[1248]\\.2=d;^9\\.[1248]\\.4=D; ^9\\.[1248]\\.=h; ^9\\.(9|10)\\.[1-5]=f;^9\\.(9|10)\\.=F; ^9\\.1[12]=s ; ^0\\.=z");
rules.push("rule-UnlimitedNOU  =vdDhfsz: D,|,D|v,[fF]|[Ff],v|[Ff],d");
rules.push("why-UnlimitedNOU  = opposite or unlinked roll/roll (or flick) combination is not allowed");

rules.push("rule-UnlimitedNOUF  =vdDhfsz: d,F");
rules.push("why-UnlimitedNOUF  = 45-up roll/flick (\"hard way\") combination is not allowed");

rules.push("rule-NF3TOPH  =roll: (.,.|248) [fF]$");
rules.push("why-NF3TOPH  = no flick roll on vertical down line after hesitation in the loop");

rules.push("rule-NF2UP360 = upqtrs: ^([5-8]|,4|4,|2,3|3,[23]) f");
rules.push("why-NF2UP360  = no flick roll on loop top after more than 360 roll going up");

rules.push("rule-NF2UP2STOP = upstop: ^([3-9]|,2|2,) f");
rules.push("why-NF2UP2STOP  = no flick roll on loop top after more than 2 stops going up");

rules.push("rule-N88 = roll: 8");
rules.push("why-N88     = 8 point roll is not allowed");

rules.push("rule-NORF   = roll: [1248],f");
rules.push("why-NORF    = roll,flick combination not allowed");


rules.push("allow-defrules=UnlimitedNOU ; UnlimitedNOUF; VUP450; VUP4S ; VDOWN360 ; VDOWN3S ;DIAGUP540 ; DIAGUP4S ; Hor10stop");// Modif GG (Hor10stop) évolution Civa 2012

// ~%~  ~i?d%~ ~i?v%~
//1.1.1-4  #2009 only as linking figures
rules.push("1.1.2.1");
rules.push("1.1.2.2 NORF");
rules.push("1.1.2.3-4");
rules.push("1.1.3.1");
rules.push("1.1.3.2 NORF");
rules.push("1.1.3.3-4");
rules.push("1.1.6.1-4");
rules.push("1.1.7.1-4");

// z_- z^ -iz_ -iz^-

rules.push("1.1.10.1 NORF");
rules.push("1.1.10.4");
rules.push("1.1.11.1 NORF");
rules.push("1.1.11.4");

// ~%i?t%~  ~%i?k%~

rules.push("1.2.1.1");
rules.push("1.2.1.2 NORF:1");
rules.push("1.2.1.3-4");

rules.push("1.2.2.1");
rules.push("1.2.2.2 NORF:1");
rules.push("1.2.2.3-4");

rules.push("1.2.3.1");
rules.push("1.2.3.2 NORF:1");
rules.push("1.2.3.3-4");

rules.push("1.2.4.1");
rules.push("1.2.4.2 NORF:1");
rules.push("1.2.4.3-4");

rules.push("1.2.5.1-2");
rules.push("1.2.5.3 NORF:2");
rules.push("1.2.5.4");

rules.push("1.2.6.1-2");
rules.push("1.2.6.3");
rules.push("1.2.6.4 NORF:2");

rules.push("1.2.7.1-2");
rules.push("1.2.7.3 NORF:2");
rules.push("1.2.7.4");

rules.push("1.2.8.1-2");
rules.push("1.2.8.3");
rules.push("1.2.8.4 NORF:2");

// ~[21]jo?1~   ~2j(|o|io|oi)2~ ~4j(|o|io|oi)[234]~ ~3j(|o|io|oi)3~
//              ~2j(|o|oi)15~        ~3j(|o|io|oi)15~

//2.11.1-2 # Suppression CIVA 2013
//2.21.1-2 # Suppression CIVA 2013
//2.31.1-2 # Suppression CIVA 2013

rules.push("2.1.3.1-4");
rules.push("2.2.2.1-4");

rules.push("2.2.5.1-4");
rules.push("2.4.3.1-4");
rules.push("2.3.4.1-4");
rules.push("2.4.5.1-4");
rules.push("2.4.7.1-4");
rules.push("2.2.6.1-4");
rules.push("2.4.4.1-4");
rules.push("2.3.5.1-4");
rules.push("2.4.6.1-4");
rules.push("2.4.8.1-4");

rules.push("2.2.3.1-4");
rules.push("2.3.2.1-4");
rules.push("2.2.4.1-4");
rules.push("2.3.3.1-4");

// ~%h%~ ~%i?ta%~

rules.push("5.2.1.1-4");
rules.push("5.3.1.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450");
rules.push("5.3.2.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450");
rules.push("6.2.1.1-4  NF:1");
rules.push("6.2.2.1-4  NF:1");

//half loops
// ~%a%~ ~%m%~ ~o%~ io% -io%-  ~i?qo%~ %dq% -%idq%- qq -iqq-

rules.push("7.2.1.1-2  NF:1");
rules.push("7.2.2.1-2  NF:1");
rules.push("7.2.3.1-2  NF:1");
rules.push("7.2.4.1-2  NF:1");


rules.push("7.2.1.3-4  NF:2");
rules.push("7.2.2.3-4  NF:2");
rules.push("7.2.3.3-4  NF:2");
rules.push("7.2.4.3-4  NF:2");

//loops
rules.push("7.4.1.1-2 NOU:1");
rules.push("7.4.1.3-4 NOU:1 ; NF:1 ; N88");
rules.push("7.4.2.1-2 NOU:1");
rules.push("7.4.3.1-2");
rules.push("7.4.3.3-4 NF:1");
rules.push("7.4.4.1-2");
rules.push("7.4.4.3-4 NF:1");

rules.push("7.4.5.1  NF:1");
rules.push("7.4.5.4  NF:2");//doc say "no flick roll on any lower lines of figure" which means what?!
rules.push("7.4.6.1");

//goldfish
// ~%i?g%~
rules.push("7.3.1.1 NORF:2");
rules.push("7.3.1.2 NORF:1");
rules.push("7.3.1.3-4");

rules.push("7.3.2.1");
rules.push("7.3.2.2 NORF");
rules.push("7.3.2.3-4");

rules.push("7.3.3.1 NORF:2");
rules.push("7.3.3.2 NORF:1");
rules.push("7.3.3.3-4");

rules.push("7.3.4.1");
rules.push("7.3.4.2 NORF");
rules.push("7.3.4.3-4");

//cc
// ~%i?cc%~
rules.push("7.8.1.1-2 NF:1");
rules.push("7.8.2.1-2 NF:1");
rules.push("7.8.3.1-2 NF:1");
rules.push("7.8.4.1-2 NF:1");

rules.push("7.8.1.3 NORF:2");
rules.push("7.8.1.4 NORF:3");
rules.push("7.8.2.3 NORF:2");
rules.push("7.8.2.4 NORF:3");
rules.push("7.8.3.3 NORF");
rules.push("7.8.3.4");
rules.push("7.8.4.3 NORF");
rules.push("7.8.4.4");

//rcc
rules.push("7.8.5.1 NF:3 ; NORF:2");
rules.push("7.8.5.2 NF:3 ; NORF:1");
rules.push("7.8.6.1 NF:3 ; NORF:2");
rules.push("7.8.6.2 NF:3 ; NORF:1");
rules.push("7.8.7.1 NF:3");
rules.push("7.8.7.2 NF:3 ; NORF");
rules.push("7.8.8.1 NF:3");
rules.push("7.8.8.2 NF:3 ; NORF");

rules.push("7.8.5.3-4");
rules.push("7.8.6.3-4");
rules.push("7.8.7.3-4");
rules.push("7.8.8.3-4");


//bumps
// ~%i?p?b%~
rules.push("8.4.1.1-4");
rules.push("8.4.2.1-4");
rules.push("8.4.3.1-4");
rules.push("8.4.4.1-4");

// %db%~   ~%rdb%~  ~%irdb%~
rules.push("8.4.13.1");
rules.push("8.4.14.1");

rules.push("8.4.15.1");
rules.push("8.4.15.2-4 NORF");

rules.push("8.4.16.1");
rules.push("8.4.16.2-4 NORF");

rules.push("8.4.17.1");
rules.push("8.4.17.2-4 NORF");
rules.push("8.4.18.1");
rules.push("8.4.18.2-4 NORF");

//rc
// ~%i?c%~  ~%i?rc%~ ~%i?rp%~
rules.push("8.5.1.1  NF:2");
rules.push("8.5.1.2  NF:2 ; NORF");
rules.push("8.5.2.1  NF:2");
rules.push("8.5.2.2  NF:2 ; NORF");

rules.push("8.5.3.1  NF:2");
rules.push("8.5.3.2  NF:2 ; NORF");
rules.push("8.5.4.1  NF:2");
rules.push("8.5.4.2  NF:2 ; NORF");
rules.push("8.5.1.3-4");
rules.push("8.5.2.3-4");
rules.push("8.5.3.3-4");
rules.push("8.5.4.3-4");

//rp
rules.push("8.6.1.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP");
rules.push("8.6.3.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP");
rules.push("8.6.2.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP");
rules.push("8.6.4.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP");

rules.push("8.6.1.3-4");
rules.push("8.6.3.3-4");
rules.push("8.6.2.3-4");
rules.push("8.6.4.3-4");

//c
rules.push("8.5.5.1-2  NF:1");
rules.push("8.5.6.1-2  NF:1");
rules.push("8.5.7.1-2  NF:1");
rules.push("8.5.8.1-2  NF:1");
rules.push("8.5.5.3   NORF:2");
rules.push("8.5.5.4");
rules.push("8.5.6.3   NORF:2");
rules.push("8.5.6.4");
rules.push("8.5.7.3");
rules.push("8.5.7.4   NORF:2");
rules.push("8.5.8.3");
rules.push("8.5.8.4    NORF:2");

//p
rules.push("8.6.5.1-2  NOU:2 ; NF:1 ; NF3TOPH");
rules.push("8.6.6.1-2  NOU:2 ; NF:1 ; NF3TOPH");
rules.push("8.6.7.1-2  NOU:2 ; NF:1 ; NF3TOPH");
rules.push("8.6.8.1-2  NOU:2 ; NF:1 ; NF3TOPH");
rules.push("8.6.5.3-4");
rules.push("8.6.6.3-4");
rules.push("8.6.7.3-4");
rules.push("8.6.8.3-4");

// ROLLS
// v[42315] d[216] [42316]   id[216] iv[4231]
rules.push("9.1.1.1-5");
rules.push("9.1.2.1-6");
rules.push("9.1.3.1-8");
rules.push("9.1.4.2");
rules.push("9.1.4.4");
rules.push("9.1.4.6");
rules.push("9.1.5.1-4");

// v22 d22 [23]2   id22 iv22

rules.push("9.2.1.4");
rules.push("9.2.2.4");
rules.push("9.2.2.6");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.2.4.4");
rules.push("9.2.5.4");

// v[234]4  d[24]4 [234]4 id[24]4 iv[23]4

rules.push("9.4.1.2-4");
rules.push("9.4.2.2-4");
rules.push("9.4.3.2-4");
rules.push("9.4.4.2");
rules.push("9.4.4.4");
rules.push("9.4.5.2-3");

// v4?8  d48 [48]8  id48 iv4?8

rules.push("9.8.1.1-2");
rules.push("9.8.2.1-2");
rules.push("9.8.3.1-2");
rules.push("9.8.3.4");
rules.push("9.8.4.2");
rules.push("9.8.5.1-2");

//snaps & spins
// ~v[231]f   ~d[21]f  ~[21]f  ~id[21]f  ~iv[231]f  6f id6f
// ~v[231]if  ~d[21]if ~[21]if ~id[21]if ~iv[231]if  -6if
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
rules.push("(civa advanced 1stunknown)");
rules.push("more=civa advanced unknown1");
rules.push("(civa advanced 2ndunknown)");
rules.push("more=civa advanced unknown2");
rules.push("[civa advanced program2]");
rules.push("more=civa advanced unknown1");
rules.push("[civa advanced program3]");
rules.push("more=civa advanced unknown2");

rules.push("[civa advanced unknown1]");
rules.push("k-maxperfig=35");
rules.push("more=civa advanced unknownboth");

rules.push("[civa advanced unknown2]");
rules.push("k-maxperfig=40");
rules.push("2.4.5.1-2"); // Only for unknown2
rules.push("2.4.7.1-2"); //  "    "     "

rules.push("more=civa advanced unknownboth");

//#######################################################################################
rules.push("(civa advanced unknownboth)");
//#######################################################################################
rules.push("poslj=10");
rules.push("posnl=30");

// general rules for AWAC: 10-14 figures,
// limit on figure types (max1 spin etc)
// limit on snaps (2-4 total), (one max per figure)
// figures 10-14. Kfactor 15-35.
// at most one of 1.14.3-4 1.15.3-4 amd one of 7.23-30.*

//group-one=^1\.1[45]\.[34]
//group-two=^7\.(2[3-9]|30)
// at most one of 1.2.3.3-4 1.2.4.3-4 amd one of 7.8.1-8.*

rules.push("group-one=^1\\.2[34]\\.[34]");
rules.push("group-two=^7\\.8[1-8]");

rules.push("k-minperfig=15");

rules.push("snap-maxperfig=1");
rules.push("snap-min=2");
rules.push("snap-max=4");

rules.push("spin-max=1");

//one-name=family 1.14-15 columns 3&4 (inv tooth)
//one-max=1

//two-name=family 7.23-30 (full cubans)
//two-max=1

rules.push("one-name=family 1.2.3-4 columns 3&4 (inv tooth)");
rules.push("one-max=1");

rules.push("two-name=family 7.8.1-8 (full cubans)");
rules.push("two-max=1");

rules.push("basefig-min=10");
rules.push("basefig-max=10");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("connectors=4/24");
rules.push("unknown-letters=ABCDEFGHIJ");

rules.push("more=civa advanced unknownbase");
rules.push("(civa advanced unknownbase)");

//############################################################
// extended conv rule version with limited vertical rolls=v(up) =n(down)
// limited vertical rolls are 3/4 & 2/4 up(v =can't flyoff) or down(n=cant push out)
// for Advanced Unknowns only, of course.

// Modif GG évolution Civa 2012
rules.push("conv-horstop=^9\\.(1|9|10)\\.[38]=1 ; ^9\\.2\\.3\\.4 = 2 ;^9\\.2\\.3\\.6 = 3 ;^9\\.2\\.3\\.8 = 4 ;^9\\.4\\.3\\.([1-8]) = $1; ^9\\.8\\.3\\.1 = 2;^9\\.8\\.3\\.2 = 4;^9\\.8\\.3\\.3 = 6;^9\\.8\\.3\\.4 = 8; ^9\\.=r ; ^0\\.=z");
rules.push("rule-Hor10stop = horstop:<11");
rules.push("why-Hor10stop  = a maximum of 10 stops are allowed on straight horizontal lines rolls");
// Fin modif GG évolution Civa 2012

rules.push("conv-adv=^9\\.(1\\.1\\.3|4\\.1\\.2)=v ; ^9\\.(1\\.5\\.3|4\\.5\\.2)=n; ^9\\.[1248]\\.=r; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");

rules.push("rule-NRLevFly   =adv:v$");
rules.push("rule-NRPushout  =adv:n$");
rules.push("why-NRLevFly    = level fly off is not allowed after this roll");
rules.push("why-NRPushout   = negative recovery is not allowed after this roll");


//For Adv rp figures, we convert 3/4 up to 'x' which isnt allowed
rules.push("conv-advrp=^9\\.(1\\.1\\.3)=x ;  ^9\\.=r; ^0\\.=z");
rules.push("rule-NR:3Q1 =advrp:^x");
rules.push("why-NR:3Q1  =no more than 1/2 roll is allowed for first rolling element position");

//for Adv p figures, we convert any hesitation full roll into 'h' to disallow flick down
//conv-advp=^9\.[248]\.3=h   ;   ^9\.[1248]\.=r; ^9\.(9|10)=f; ^9\.1[12]=s ; ^0\.=z
//note since 2006 no roll at all on top of loop...

rules.push("rule-NH2F3 =roll:^[\\w,]+ [1248] (f|\\w,f)");
rules.push("why-NH2F3 = no flick allowed in third position when 2nd position has a roll");

//for Adv dh figures, we check for 9.4.2.2 or 9.2.1.2 on 45 and 9.1.1.1 on vert
rules.push("conv-advdh45=^9\\.(4\\.2\\.2)=v ;  ^9\\.(1\\.2\\.2)=v ; ^9\\.=x; ^0\\.=z");
rules.push("rule-DH45M = advdh45: ^x");
rules.push("why-DH45M = max of 9.4.2.2 or 9.1.2.2 allowed on 45 up");

rules.push("conv-advdhv= ^9\\.(1\\.1\\.1)=v ; ^9\\.=x; ^0\\.=z");
rules.push("rule-DHVM = advdhv: ^. x");
rules.push("why-DHVM = max of 9.1.1.1 allowed on vertical up");

// Modif GG évolution Civa 2012

rules.push("allow-defrules= Hor10stop");

// Fin modif GG évolution Civa 2012

rules.push("1.1.1.1-4");
rules.push("1.1.2.1-4 NOU");
rules.push("1.1.3.1-4 NOU");
rules.push("1.1.6.1-3 NOU ; NRLevFly");
rules.push("1.1.6.4   NOU ; NRPushout");
rules.push("1.1.7.1-2 NOU ; NRLevFly");
rules.push("1.1.7.3   NOU ; NRPushout");
rules.push("1.1.7.4   NOU");

rules.push("1.2.1.1 NOU");
rules.push("1.2.1.3 NOU ; NRLevFly");
rules.push("1.2.2.3 NOU ; NRLevFly");
rules.push("1.2.3.1 NOU ; NRLevFly");
rules.push("1.2.3.3-4 NOU ; NRLevFly");
rules.push("1.2.4.2-4 NOU ; NRLevFly");
rules.push("1.2.5.1 NOU");
rules.push("1.2.5.4 NOU");
rules.push("1.2.6.1 NOU");
rules.push("1.2.6.3 NOU");
rules.push("1.2.7.1 NOU");
rules.push("1.2.7.4 NOU");
rules.push("1.2.8.1 NOU");
rules.push("1.2.8.3 NOU");

//2.34.1.xx # Correction à faire3-4
//2.12.1.xx # Correction à faire1-4
//2.11.1-2 # Suppression CIVA 2013
//2.21.1-2 # Suppression CIVA 2013
//2.31.1-2 # Suppression CIVA 2013

//2.13.1  # Suppression CIVA 2013
rules.push("2.1.3.2-4");
rules.push("2.2.5.1-4");
rules.push("2.3.4.1-4");
//rules.push("2.4.5.1-2"); // Only for unknown2
//rules.push("2.4.7.1-2"); //  "    "     "
rules.push("2.2.3.1-4");

rules.push("5.2.1.1 NOU");
rules.push("5.3.1.1-4  NOU ; NF:1 ; NF:2 ; DHVM ; DH45M");
rules.push("5.3.2.1-4  NOU ; NF:1 ; NF:2 ; DHVM ; DH45M");

rules.push("5.2.1.2-3 NOU ; NRPushout");
rules.push("5.2.1.4 NOU");

rules.push("7.2.1.1-2  NF:1");
rules.push("7.2.2.1-2  NF:1");
rules.push("7.2.3.1-2  NF:1");
rules.push("7.2.4.1-2  NF:1");

rules.push("7.2.1.3-4  NF:2");
rules.push("7.2.2.3-4  NF:2");
rules.push("7.2.3.3-4  NF:2");
rules.push("7.2.4.3-4  NF:2");

//loops
rules.push("7.4.1.1 NOU ; MAX360");
rules.push("7.4.1.2 NOU ; FAM91:1");
rules.push("7.4.2.1-2 NOU");
rules.push("7.4.3.1-2 NOU");
rules.push("7.4.5.1 NR:1 ; NR:2");
rules.push("7.4.6.1");

//goldfish
rules.push("7.3.1.2-3 NOU");
rules.push("7.3.2.1   NOU");
rules.push("7.3.2.3-4 NOU");
rules.push("7.3.3.3   NOU");
rules.push("7.3.4.1   NOU");
rules.push("7.3.4.4   NOU");

//cc
rules.push("7.8.1.1-2 NOU ; NF:1");
rules.push("7.8.1.3-4 NOU");

rules.push("7.8.2.1-2 NOU ; NF:1");
rules.push("7.8.2.3-4 NOU");
rules.push("7.8.3.1   NOU ; NF:1");
rules.push("7.8.3.4   NOU");
rules.push("7.8.4.1   NOU ; NF:1");
rules.push("7.8.4.4   NOU");

rules.push("7.8.5.1-2   NOU ; NF:3");
rules.push("7.8.5.3-4   NOU");
rules.push("7.8.6.2   NOU ; NF:3");
rules.push("7.8.6.3   NOU");
rules.push("7.8.7.1-2   NOU ; NF:3");
rules.push("7.8.7.3-4   NOU");
rules.push("7.8.8.1   NOU ; NF:3");
rules.push("7.8.8.4   NOU");

//bumps
rules.push("8.4.1.1 NOU");
rules.push("8.4.1.2 NOU ; NRPushout");
rules.push("8.4.2.1 NOU ; NRPushout");
rules.push("8.4.2.2 NOU");
rules.push("8.4.3.1 NOU");
rules.push("8.4.3.2 NOU ; NRPushout");
rules.push("8.4.4.1 NOU ; NRPushout");
rules.push("8.4.4.2 NOU");

rules.push("8.4.13.1 NOU ;NF:1 ; NF:2");
rules.push("8.4.14.1 NOU; NF:1 ; NF:2");
rules.push("8.4.15.1-2 NOU ; NF:2");// Modif GG évolution Civa 2012
rules.push("8.4.16.1-2 NOU ; NF:2");// Modif GG évolution Civa 2012
rules.push("8.4.18.1-2 NOU ; NF:2");// Modif GG évolution Civa 2012

//rc
rules.push("8.5.1.1-2 NOU:1; NF:2");
rules.push("8.5.2.1-2 NOU:1; NF:2");
rules.push("8.5.1.3-4 NOU:1");
rules.push("8.5.2.3-4 NOU:1");

rules.push("8.5.3.1-2 NOU:1; NF:2");
rules.push("8.5.3.3 NOU:1");
rules.push("8.5.3.4 NOU:1 ; FAM91:1");
rules.push("8.5.4.1-2 NOU:1; NF:2");
rules.push("8.5.4.3-4 NOU:1");

//rp
rules.push("8.6.1.1   NOU:1 ; NR:3Q1 ;NR:2 ;NF:3");
rules.push("8.6.1.4  NOU:1; NR:2");// Modif GG correction Civa 2012
rules.push("8.6.3.1   NOU:1 ; NR:3Q1 ;NR:2 ;NF:3");
rules.push("8.6.3.2   NR:1   ;NR:2 ;NF:3");
rules.push("8.6.3.3  NOU:1; NR:2");// Modif GG correction Civa 2012

rules.push("8.6.2.1   NOU:1 ; NR:3Q1 ;NR:2 ;NF:3");
rules.push("8.6.2.4  NOU:1");
rules.push("8.6.4.1   NOU:1 ; NR:3Q1 ;NR:2 ;NF:3");
rules.push("8.6.4.2  NR:1 ; NR:2 ; NF:3");
rules.push("8.6.4.3  NOU:1");

//c
rules.push("8.5.5.1-2 NF:1 ; NOU:2");
rules.push("8.5.6.1-2 NF:1 ; NOU:2");
rules.push("8.5.5.4 NOU:2");
rules.push("8.5.6.4 NOU:2");
rules.push("8.5.7.1-2 NF:1 ; NOU:2");
rules.push("8.5.8.1-2 NF:1 ; NOU:2");
rules.push("8.5.7.3 NOU:2");
rules.push("8.5.8.3 NOU:2");

//p
rules.push("8.6.5.1   NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2");
rules.push("8.6.6.1   NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2 ; NRPushout");
rules.push("8.6.6.2   NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2");

rules.push("8.6.7.2   NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2");
rules.push("8.6.8.1   NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2");
rules.push("8.6.8.2   NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2 ; NRPushout");

// ROLLS
rules.push("9.1.1.1-2");
rules.push("9.1.1.3");//9.1.1.3 (3/4 up) may not be followed by fly-off
rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.3.1-4");
rules.push("9.1.3.6");
rules.push("9.1.3.8");
rules.push("9.1.4.2");
rules.push("9.1.4.4");
rules.push("9.1.5.1-2");
rules.push("9.1.5.3");//9.1.5.3 (3/4 down) may not be followed by negative

rules.push("9.2.2.4");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.2.4.4");

rules.push("9.4.1.2");// may not be followed by level fly-off
rules.push("9.4.2.2");
rules.push("9.4.2.4");
rules.push("9.4.3.2-4");
rules.push("9.4.4.2");
rules.push("9.4.5.2");// may not be followed by negative recovery

rules.push("9.8.1.1");
rules.push("9.8.2.2");
rules.push("9.8.3.1");
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

//######################################################################################
//##### CIVA YAK52 UNKNOWN #############################################################
//######################################################################################

rules.push("[CIVA Yak52 unknown]");
rules.push("more=CIVA Yak52 unknown1");
rules.push("(CIVA Yak52 1stunknown)");
rules.push("more=CIVA Yak52 unknown1");
rules.push("(CIVA Yak52 2ndunknown)");
rules.push("more=CIVA Yak52 unknown2");
rules.push("[CIVA Yak52 program2]");
rules.push("more=CIVA Yak52 unknown1");
rules.push("[CIVA Yak52 program3]");
rules.push("more=CIVA Yak52 unknown2");

rules.push("[CIVA Yak52 unknown1]");
rules.push("k-minperfig=12");
rules.push("k-maxperfig=20");
rules.push("more=CIVA Yak52 unknownboth");

rules.push("[CIVA Yak52 unknown2]");
rules.push("k-minperfig=15");
rules.push("k-maxperfig=25");
rules.push("more=CIVA Yak52 unknownboth");

//#######################################################################################
rules.push("(CIVA Yak52 unknownboth)");
//#######################################################################################
rules.push("poslj=10");
rules.push("posnl=30");

// general rules for AWAC: 10-14 figures,
// limit on figure types (max1 spin etc)
// limit on snaps (2-4 total), (one max per figure)
// figures 10-14. Kfactor 15-35.
// at most one of 1.14.3-4 1.15.3-4 amd one of 7.23-30.*

rules.push("group-one=^1\\.2[34]\\.[34]");
rules.push("group-two=^7\\.8[1-8]");

rules.push("snap-maxperfig=1");
rules.push("snap-min=1");
rules.push("snap-max=2");

rules.push("spin-max=1");

//one-name=family 1.14-15 columns 3&4 (inv tooth)
//one-max=1

//two-name=family 7.23-30 (full cubans)
//two-max=1

rules.push("one-name=family 1.2.3-4 columns 3&4 (inv tooth)");
rules.push("one-max=1");

rules.push("two-name=family 7.8.1-8 (full cubans)");
rules.push("two-max=1");

rules.push("basefig-min=10");
rules.push("basefig-max=10");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("connectors=4/24");

rules.push("more=CIVA Yak52 unknownbase");
rules.push("(CIVA Yak52 unknownbase)");

//############################################################
// extended conv rule version with limited vertical rolls=v(up) =n(down)
// limited vertical rolls are 3/4 & 2/4 up(v =can't flyoff) or down(n=cant push out)
// for Yak52 Unknwons only, of course.

// Modif GG évolution CIVA 2012
rules.push("conv-horstop=^9\\.(1|9|10)\\.[38]=1 ; ^9\\.2\\.3\\.4 = 2 ;^9\\.2\\.3\\.6 = 3 ;^9\\.2\\.3\\.8 = 4 ;^9\\.4\\.3\\.([1-8]) = $1; ^9\\.8\\.3\\.1 = 2;^9\\.8\\.3\\.2 = 4;^9\\.8\\.3\\.3 = 6;^9\\.8\\.3\\.4 = 8; ^9\\.=r ; ^0\\.=z");
rules.push("rule-Hor10stop = horstop:<11");
rules.push("why-Hor10stop  = a maximum of 10 stops are allowed on straight horizontal lines rolls");
// Fin modif GG évolution CIVA 2012

rules.push("conv-adv=^9\\.(1\\.1\\.3|4\\.1\\.2)=v ; ^9\\.(1\\.5\\.3|4\\.5\\.2)=n; ^9\\.[1248]\\.=r; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");

rules.push("rule-NRLevFly   =adv:v$");
rules.push("rule-NRPushout  =adv:n$");
rules.push("why-NRLevFly    = level fly off is not allowed after this roll");
rules.push("why-NRPushout   = negative recovery is not allowed after this roll");

//For Adv rp figures, we convert 3/4 up to 'x' which isnt allowed
rules.push("conv-advrp=^9\\.(1\\.1\\.3)=x ;  ^9\\.=r; ^0\\.=z");
rules.push("rule-NR:3Q1 =advrp:^x");
rules.push("why-NR:3Q1  =no more than 1/2 roll is allowed for first rolling element position");

//for Adv p figures, we convert any hesitation full roll into 'h' to disallow flick down
//conv-advp=^9\.[248]\.3=h   ;   ^9\.[1248]\.=r; ^9\.(9|10)=f; ^9\.1[12]=s ; ^0\.=z
//note since 2006 no roll at all on top of loop...

rules.push("rule-NH2F3 =roll:^[\\w,]+ [1248] (f|\\w,f)");
rules.push("why-NH2F3 = no flick allowed in third position when 2nd position has a roll");

//for Adv dh figures, we check for 9.4.2.2 or 9.2.1.2 on 45 and 9.1.1.1 on vert
rules.push("conv-advdh45=^9\\.(4\\.2\\.2)=v ;  ^9\\.(1\\.2\\.2)=v ; ^9\\.=x; ^0\\.=z");
rules.push("rule-DH45M = advdh45: ^x");
rules.push("why-DH45M = max of 9.4.2.2 or 9.1.2.2 allowed on 45 up");

rules.push("conv-advdhv= ^9\\.(1\\.1\\.1)=v ; ^9\\.=x; ^0\\.=z");
rules.push("rule-DHVM = advdhv: ^. x");
rules.push("why-DHVM = max of 9.1.1.1 allowed on vertical up");

// Modif GG évolution CIVA 2012

rules.push("allow-defrules= Hor10stop");

// Fin modif GG évolution CIVA 2012

//conversion rules for checking validity

rules.push("1.1.1.1-4");
rules.push("1.1.2.1 NOU");
rules.push("1.1.3.1 NOU");
rules.push("1.1.3.4 NOU");
rules.push("1.1.6.3 OS:1");

rules.push("1.2.1.1 NOU ; NR:2");
rules.push("1.2.1.3 NOU ; NR:2");
rules.push("1.2.2.3 NOU ; NR:2");
rules.push("1.2.3.1 NOU ; NR:2");
rules.push("1.2.3.4 NOU ; NR:2");
rules.push("1.2.4.4 NOU ; NR:2");
rules.push("1.2.5.4 NOU ; NR:1");
rules.push("1.2.6.1 NOU");
rules.push("1.2.6.3 NOU ; OS:1");
rules.push("1.2.7.1 NOU");
rules.push("1.2.7.4 NOU ; NR:1");
rules.push("1.2.8.3 NOU ; OS:1");

// rolling circle
rules.push("2.1.3.1");

// hammerhead
rules.push("5.2.1.1 NOU");

// half loops
rules.push("7.2.1.1  NF:1");
rules.push("7.2.2.1  NF:1");

rules.push("7.2.1.4  NF:2");
rules.push("7.2.3.3  NF:2");

//goldfish
rules.push("7.3.2.1   NOU");
rules.push("7.3.3.3   NOU");
rules.push("7.3.4.1   NOU");
rules.push("7.3.4.4   NOU");

//loops
rules.push("7.4.1.1 NOU ; MAX360");
rules.push("7.4.3.1 NR");

//cc
rules.push("7.8.4.1   NOU ; NF:1");
rules.push("7.8.8.1   NOU ; NF:3");
rules.push("7.8.13.1  NOU");
rules.push("7.8.15.1  NOU");
rules.push("7.8.16.1  NOU");
rules.push("7.8.16.4  NOU");

//bumps
rules.push("8.4.1.1 NOU");
rules.push("8.4.3.1 NOU");

//rc
rules.push("8.5.1.3 NOU:1");
rules.push("8.5.2.1 NOU:1; NF:2");
rules.push("8.5.2.4 NOU:1");

rules.push("8.5.3.3 NOU:1");
rules.push("8.5.4.4 NOU:1");

//c
rules.push("8.5.5.4 NOU:2");
rules.push("8.5.6.1 NF:1 ; NOU:2");
rules.push("8.5.6.4 NOU:2");
rules.push("8.5.7.3 NOU:2");
rules.push("8.5.8.3 NOU:2");

//rp
rules.push("8.6.1.1   NR:1 ; NR:2 ;NF:3");
rules.push("8.6.1.4  NR:1; NR:2");
rules.push("8.6.2.4  NR:1");
rules.push("8.6.3.3  OS:1; NR:2");

rules.push("8.6.4.3  OS:1");

// ROLLS
rules.push("9.1.1.1-2");
rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.3.1-2");
rules.push("9.1.3.4");
rules.push("9.1.3.6");
rules.push("9.1.4.2");
rules.push("9.1.5.1");

rules.push("9.2.2.4");
rules.push("9.2.3.4");
rules.push("9.2.3.6");

rules.push("9.4.2.2");
rules.push("9.4.2.4");
rules.push("9.4.3.2");
rules.push("9.4.3.4");
rules.push("9.4.4.2");

rules.push("9.8.1.1");
rules.push("9.8.2.2");
rules.push("9.8.3.1");
rules.push("9.8.3.2");
rules.push("9.8.5.1");

//snaps & spins
rules.push("9.9.2.2");
rules.push("9.9.3.2");
rules.push("9.9.3.4");

rules.push("9.11.1.4-6");

//######################################################################################
//##### CIVA INTERMEDIATE UNKNOWN ######################################################
//######################################################################################

rules.push("[CIVA Intermediate unknown]");
rules.push("more=CIVA Yak52 unknown1");
rules.push("(CIVA Intermediate 1stunknown)");
rules.push("more=CIVA Yak52 unknown1");
rules.push("(CIVA Intermediate 2ndunknown)");
rules.push("more=CIVA Yak52 unknown2");
rules.push("[CIVA Intermediate program2]");
rules.push("more=CIVA Yak52 unknown1");
rules.push("[CIVA Intermediate program3]");
rules.push("more=CIVA Yak52 unknown2");

rules.push("[CIVA Intermediate unknown1]");
rules.push("more=CIVA Yak52 unknown1");

rules.push("[CIVA Intermediate unknown2]");
rules.push("more=CIVA Yak52 unknown2");

//##### MISC - the "known program" has no real verification issues. it is listed here to process position info

rules.push("(civa unlimited programq)");
rules.push("more=civa unlimited known");
rules.push("(civa advanced programq)");
rules.push("more=civa advanced known");

rules.push("[civa advanced known]");
rules.push("demo=~~,24pbb(\"|\"3````)4-~ -isin(``1),4 ~~8'b''2f 2m8,3- 4% [-4,10] -2joi15 h''f. 10% ``+`````````2f```rc24-````````` -o6 m32,6f-`");
rules.push("basefig-min=9");// Modif GG correction Civa 2012
rules.push("basefig-max=9");// Modif GG correction Civa 2012
rules.push("poslj=10");
rules.push("posnl=30");
rules.push("allow=^([1-8]|9\\.([123489]|1[12]))");

rules.push("[civa unlimited known]");
rules.push("demo=~~~~'2,2f'zt.''2f;2 2% ,7,3m\"|\"5if,3 [-5,18] 24ip1 >~s,3if.ibpb(``````\"|\"3``)3f\"|\",4.''+``> 'if'h'5f' .8rp(44)9> > 3joi15-~~ ~~~~-.\"|\"4taf''> ,34'pb'''3");
rules.push("basefig-min=9");// Modif GG correction Civa 2012
rules.push("basefig-max=9");// Modif GG correction Civa 2012
rules.push("poslj=10");
rules.push("posnl=60");
rules.push("allow=^[1-9]");
