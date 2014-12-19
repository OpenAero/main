// OpenAero rules15-baea.js file

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

// This file defines BAeA rules for 2015

// 1.5.0
// - added BAeA Power Known sequences, no rule updates done

//###############################################################################
//##### BAeA BEGINNERS KNOWN ####################################################
//###############################################################################

rules.push("[BAeA Beginners Known]");
rules.push("posnl=10");
rules.push("demo=/id o `+c.,2.++ ~+++h... 3% oj 1");

//###############################################################################
//##### BAeA STANDARD KNOWN #####################################################
//###############################################################################

rules.push("[BAeA Standard Known]");
rules.push("posnl=15");
rules.push("demo=ed ++,2rc d iv```6s...++++ +c.2` (-3,7) o h``4' ~~+oj+ 4> ~~+++m2 id... 1");

//###############################################################################
//##### BAeA INTERMEDIATE FREE ##################################################
//###############################################################################

//
// Modified for 2013 WL + RM
// Modified for 2014 RM

rules.push("[BAeA Intermediate Free]");

rules.push("posnl=30");
rules.push("basefig-max=12");
rules.push("k-max=180");

rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("eroll-min=1");
rules.push("snap-min=1");
rules.push("spin-min=1");

rules.push("group-roller=^2\\.[1-4]\\.[^1]");
rules.push("roller-name=Rolling turn, family 2.1 to 2.4");
rules.push("roller-min=1");

rules.push("emptyline-max=0");

rules.push("basefig-repeat=1");
rules.push("fam9-repeat=1");

rules.push("Group-oppunl=[,;]");
rules.push("oppunl-name=opposite or unlinked rolls");
rules.push("oppunl-min=1"); //one opposite or unlinked roll is required! (7.3.2.1)

rules.push("allow=^[1-9]"); //all figures are allowed for the Free program

//#######################################################################################
//###################### UNKNOWNS #######################################################
//#######################################################################################

// BAeA Intermediate Unknown

// ROLL CHECKING NEEDS TO BE ADDED!
rules.push("[BAeA Intermediate Unknown]");

rules.push("emptyline-max=0");
rules.push("posnl=30");
rules.push("basefig-max=12");
rules.push("basefig-min=8");

rules.push("rule-SPIN=rfsz:^[zrf]");
rules.push("why-SPIN=Figure must include a spin ");

rules.push("conv-hrfsz=^9\\.[248]\\.=h; ^9\\.1\\.=r; ^9\\.(9|10)\\.=s; ^0\.0\.0\.0=z");

rules.push("rule-NHR1 = hrfsz:^h");
rules.push("why-NHR1 = no hesitation roll is allowed for 1st roll");

rules.push("rule-NHR2 = hrfsz:^[\\w,]+ h");
rules.push("why-NHR2 = no hesitation roll is allowed for 2nd roll");

rules.push("rule-NHR3 = hrfsz:^[\\w,]+ [\\w,]+ h");
rules.push("why-NHR3 = no hesitation roll is allowed for 2nd roll");

rules.push("conv-hqerfsz=^9\\.2\\.=h; ^9\\.4\\.=q; ^9\\.8\\.=e; ^9\\.1\\.=r; ^9\\.(9|10)\\.=s; ^0\\.0\\.0\\.0=z");

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

rules.push("conv-int=^9\\.1\\.1\\.2=v; ^9\\.1\\.5\\.2=d");

rules.push("rule-MaxQUp =int:v");
rules.push("rule-MaxQDn =int:d");
rules.push("why-MaxQUp  =maximum quarter roll up");
rules.push("why-MaxQDn  =maximum quarter roll down");

//conversion rules for checking validity
//replace rolls added to figure with single letter/digit, matched by "rule-"s
// spin=s flick=f roll=r   no roll=z

rules.push("conv-rfsz=^9\\.[1248]\\.=r; ^9\\.(9|10)\\.=f; ^9\\.1[12]\\.=s; ^0\\.0\\.0\\.0=z");

// Replace 1/4,3/4 horizontal roll as last element by 'a'
// Replace all remaining unlinked/linked rolls by 'n'
// Used for checking BAeA Intermediate Unknown
rules.push("conv-q3qlvl=^9\\.1\\.3\\.1=q3; ^9\\.1\\.3\\.3=q; ^9\\.=n");

rules.push("rule-IntermediateNOU =q3qlvl: n");
rules.push("why-IntermediateNOU =no opposite or unlinked rolls allowed, except 9.1.3.1+9.1.3.4 on 1.1.1.3-4");

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

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

// Lines
rules.push("1.1.1.1-2 NOU");
rules.push("1.1.1.3-4 IntermediateNOU");
rules.push("1.1.2.1 NOU");
rules.push("1.1.2.3 NOU");
rules.push("1.1.3.1 NOU");
rules.push("1.1.3.3 NOU ; NHR1");
rules.push("1.1.3.4 NOU");
rules.push("1.1.6.1 NOU ; MaxQUp");
rules.push("1.1.6.3 NOU ; MaxQDn");
rules.push("1.1.7.1 NOU ; MaxQUp");
rules.push("1.1.7.4 NOU ; MaxQDn");

// Sharks tooth
rules.push("1.2.1.1 NOU ; MaxQDn");
rules.push("1.2.1.3 NOU ; MaxQUp");
rules.push("1.2.2.3 NOU ; MaxQUp");
rules.push("1.2.3.1 NOU ; MaxQDn");
rules.push("1.2.3.4 NOU ; NHR1");
rules.push("1.2.4.4 NOU ; NHR1");
rules.push("1.2.5.1 NOU ; MaxQUp");
rules.push("1.2.5.4 NOU ; OS1 ; NR2");
rules.push("1.2.6.1 NOU ; MaxQUp");
rules.push("1.2.6.3 NOU ; OHS");
rules.push("1.2.7.1 NOU ; MaxQUp");
rules.push("1.2.7.4 NOU ; NHR2");
rules.push("1.2.8.1 NOU ; MaxQUp ; NHR2");
rules.push("1.2.8.3 NOU ; MaxQDn ; OHS");

// Bow
rules.push("1.3.2.1 NOU");

// Turns & rolling circles
rules.push("2.1.1.1-2");
rules.push("2.1.3.1-2");
rules.push("2.2.1.1-2");
rules.push("2.2.5.1");
rules.push("2.3.1.1-2");
rules.push("2.3.4.1");

// -idz+
rules.push("3.3.1.4 NOU");

// Hammerheads
rules.push("5.2.1.1 NOU");
rules.push("5.2.1.3 NOU ; NR2");
rules.push("5.3.1.1 NOU ; NR1 ; NR2 ; NHR3");

// Half loops
rules.push("7.2.1.1 NOU ; NF1 ; NHR1 ; NR2");
rules.push("7.2.1.2 NOU ; NR1 ; NR2");
rules.push("7.2.1.4 NOU ; NR1 ; NF2");
rules.push("7.2.2.1 NOU ; NF1 ; NEQR1 ; NER2 ; NF2");
rules.push("7.2.2.4 NOU ; NR1 ; NF2");
rules.push("7.2.3.3 NOU ; NEQR2 ; NF2");
rules.push("7.2.4.2 NOU ; NHR2");
rules.push("7.2.4.3 NOU ; NHR2 ; NF2");

// Goldfish
rules.push("7.3.1.2 NOU ; NR1");
rules.push("7.3.1.3 NOU");
rules.push("7.3.2.1 NOU");
rules.push("7.3.3.3 NOU");
rules.push("7.3.4.1 NOU");

// Loops
rules.push("7.4.1.1 NOU ; NEQR1");
rules.push("7.4.3.1 NOU ; NR1");
rules.push("7.4.5.1 NOU ; NR1 ; NR2");

// Reversing loops
rules.push("7.3.7.1 NOU ; NHR1");
rules.push("7.4.8.1 NOU ; NR1 ; NHR2");
rules.push("7.4.9.3 NOU ; NF1 ; NHR1");
rules.push("7.4.12.3 NOU ; NHR2");

// Horizontal S-es
rules.push("7.5.2.1 NOU ; NEQR1 ; NF1 ; NHR2 ; NR3");
rules.push("7.5.2.4 NOU ; NR1 ; NHR2 ; NEQR3 ; NF3");
rules.push("7.5.5.3 NOU ; NF1 ; NHR2 ; NR3");
rules.push("7.5.7.1 NOU ; NR1 ; NHR2 ; NF3");

// Full cubans
rules.push("7.8.3.1 NOU ; NR1 ; NR3");
rules.push("7.8.3.4 NOU ; NR1 ; NR3");
rules.push("7.8.4.1 NOU ; NR1");
rules.push("7.8.6.3 NOU ; NR1 ; NR3");
rules.push("7.8.8.1 NOU ; NR3");
rules.push("7.8.8.4 NOU ; NR3");

// Humpty bumps
rules.push("8.4.1.1 NOU ; MaxQUp ; MaxQDn");
rules.push("8.4.2.1 NOU ; MaxQUp ; NR2");
rules.push("8.4.3.1 NOU ; MaxQUp ; MaxQDn");
rules.push("8.4.13.1 NOU ; NR1 ; NR2");
rules.push("8.4.14.1 NOU ; NR1");
rules.push("8.4.15.1 NOU ; NR2");

// Half cubans
rules.push("8.5.1.2 NOU ; NER2");
rules.push("8.5.1.3 NOU ; NEQR2");
rules.push("8.5.2.1 NOU ; NER2");
rules.push("8.5.3.3 NOU ; NF2");
rules.push("8.5.4.1 NOU ; NHR1 ; NF2");
rules.push("8.5.4.4 NOU ; NF2");
rules.push("8.5.5.1 NOU ; NER2");
rules.push("8.5.5.4 NOU ; NEQR1");
rules.push("8.5.6.1 NOU ; NER1");
rules.push("8.5.7.1 NOU ; NR2");
rules.push("8.5.7.3 NOU ; NF1");
rules.push("8.5.8.3 NOU ; NF1 ; NH1 ; NHR2");

// Keyhole loops
rules.push("8.5.9.1 NR1 ; NR2");
rules.push("8.5.17.1 NR1 ; NR2");

// P loops
rules.push("8.6.1.1 NOU ; MaxQUp ; NER2 ; NF2 ; NF3");
rules.push("8.6.3.3 NOU ; NR1 ; NEQR2 ; NF2");
rules.push("8.6.4.3 NOU ; OHS ; NF2 ; NER2");
rules.push("8.6.5.1 NOU ; NF1 ; NER1 ; NHR2 ; BOTTOP ; MaxQDn");
rules.push("8.6.7.2 NOU ; NR2");
rules.push("8.6.7.3 NOU ; NF1 ; MaxQUp");
rules.push("8.6.8.3 NOU ; NF1 ; MaxQUp");

// Porpoises
rules.push("8.6.11.1 NOU ; NR1 ; NR2 ; NEQR3 ; NF3");
rules.push("8.6.11.3 NOU ; OHS ; NR2 ; NEQR3 ; NF3");

// Q loops
rules.push("8.7.1.1 NOU ; NR1 ; NR2 ; NER3 ; NF3");
rules.push("8.7.3.1 NOU ; NR1 ; NR2 ; NER3 ; NF3");
rules.push("8.7.5.1 NOU ; NF1 ; NEQR1 ; NHR2 ; NR3");
rules.push("8.7.7.2 NOU ; NER1 ; NR2 ; NR3");

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
