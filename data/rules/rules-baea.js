// OpenAero rules-baea.js file

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

// This file defines BAeA rules

// 1.5.0
// - added BAeA Power Known sequences, no rule updates done
// 2016.1.3
// - altered Club and Sports to Club and Sports respectively
// - renamed Free programme to Free 2015 as BAeA now uses the
//   CIVA Free Known
// 2016.1.5
// - corrected BAeA Club positioning to 10
// 2017.1
// - added BAeA 2017 sequences
// 2022.1.7
// - moved 2017 BAeA sequences to library

rules.push (
"year=2022",
//######################################################################
//##### BAeA CLUB KNOWN ################################################
//######################################################################

"[BAeA Club Known]",
"posnl=10",

//######################################################################
//##### BAeA SPORTS KNOWN ##############################################
//######################################################################

"[BAeA Sports Known]",
"posnl=15",

/***********************************************************************
 * BAeA Intermediate Free Known                                        *
 ***********************************************************************/

"[BAeA Intermediate Free Known]",
"more=CIVA Intermediate Free Known",

//######################################################################
//##### BAeA INTERMEDIATE 2015 FREE ####################################
//######################################################################

//
// Modified for 2013 WL + RM
// Modified for 2014 RM

"(BAeA Intermediate Free)",
"more=BAeA Intermediate 2015 Free",
"(BAeA Intermediate 2015 Free)",

"posnl=30",
"basefig-max=12",
"k-max=180",

"fam5-min=1",
"fam7-min=1",
"fam8-min=1",
"froll-min=1",
"hroll-min=1",
"qroll-min=1",
"eroll-min=1",
"snap-min=1",
"spin-min=1",

"group-roller=^2\\.[1-4]\\.[^1]",
"roller-name=Rolling turn, family 2.1 to 2.4",
"roller-min=1",

"emptyline-max=0",

"basefig-repeat=1",
"fam9-repeat=1",

"Group-oppunl=[,;]",
"oppunl-name=opposite or unlinked rolls",
"oppunl-min=1", //one opposite or unlinked roll is required! (7.3.2.1)

"allow=^[1-9]", //all figures are allowed for the Free program

//######################################################################
//##### UNKNOWNS #######################################################
//######################################################################

// BAeA Intermediate Unknown

// ROLL CHECKING NEEDS TO BE ADDED!
"(BAeA Intermediate Unknown)",

"emptyline-max=0",
"posnl=30",
"basefig-max=12",
"basefig-min=8",

"rule-SPIN=rfsz:^[zrf]",
"why-SPIN=Figure must include a spin ",

"conv-hrfsz=^9\\.[248]\\.=h; ^9\\.1\\.=r; ^9\\.(9|10)\\.=s; ^0\.0\.0\.0=z",

"rule-NHR1 = hrfsz:^h",
"why-NHR1 = no hesitation roll is allowed for 1st roll",

"rule-NHR2 = hrfsz:^[\\w,;]+ h",
"why-NHR2 = no hesitation roll is allowed for 2nd roll",

"rule-NHR3 = hrfsz:^[\\w,;]+ [\\w,;]+ h",
"why-NHR3 = no hesitation roll is allowed for 2nd roll",

"conv-hqerfsz=^9\\.2\\.=h; ^9\\.4\\.=q; ^9\\.8\\.=e; ^9\\.1\\.=r; ^9\\.(9|10)\\.=s; ^0\\.0\\.0\\.0=z",

"rule-NEQR1 = hqerfsz:^[eq]",
"why-NEQR1 = no eigths or quarter hesitation roll is allowed for 1st roll",

"rule-NEQR2 = hqerfsz:^[\\w,;]+ [eq]",
"why-NEQR2 = no eights or quarter hesitation roll is allowed for 2nd roll",

"rule-NEQR3 = hqerfsz:^[\\w,;]+ [\\w,;]+ [eq]",
"why-NEQR3 = no eights or quarter hesitation roll is allowed for 3rd roll",

"rule-NER1 = hqerfsz:^e",
"why-NER1 = no eigths hesitation roll is allowed for 1st roll",

"rule-NER2 = hqerfsz:^[\\w,;]+ e",
"why-NER2 = no eights hesitation roll is allowed for 2nd roll",

"rule-NER3 = hqerfsz:^[\\w,;]+ [\\w,;]+ e",
"why-NER3 = no eights hesitation roll is allowed for 3rd roll",

"rule-BOTTOP = rfsz:^[^z] [^z]",
"why-BOTTOP = a roll may only be added to the top OR bottom of the loop, not both",

"rule-MAX1 = rfsz: [^z] [^z]",
"why-MAX1 = a maximum of one optional roll may be added to figure",

"conv-int=^9\\.1\\.1\\.2=v; ^9\\.1\\.5\\.2=d",

"rule-MaxQUp =int:v",
"rule-MaxQDn =int:d",
"why-MaxQUp  =maximum quarter roll up",
"why-MaxQDn  =maximum quarter roll down",

//conversion rules for checking validity
//replace rolls added to figure with single letter/digit, matched by "rule-"s
// spin=s flick=f roll=r   no roll=z

"conv-rfsz=^9\\.[1248]\\.=r; ^9\\.(9|10)\\.=f; ^9\\.1[12]\\.=s; ^0\\.0\\.0\\.0=z",

// Replace 1/4,3/4 horizontal roll as last element by 'a'
// Replace all remaining unlinked/linked rolls by 'n'
// Used for checking BAeA Intermediate Unknown
"conv-q3qlvl=^9\\.1\\.3\\.1=q3; ^9\\.1\\.3\\.3=q; ^9\\.=n",

"rule-IntermediateNOU =q3qlvl: n",
"why-IntermediateNOU =no opposite or unlinked rolls allowed, except 9.1.3.1+9.1.3.4 on 1.1.1.3-4",

// NF1 - no flick on roll#1
// NF2 - no flick on roll#2
// NOU1 - no opposite or unlinked rolls on roll#1
// LRH1 - limit roll to 1/2 on roll#1

"rule-NF1=rfsz:^[^ ]*f",
"rule-NF2=rfsz:^[^ ]+ [^ ]*f",
"rule-NF3=rfsz:^[^ ]+ [^ ]+ [^ ]*f",
"rule-NF4=rfsz:^[^ ]+ [^ ]+ [^ ]+ [^ ]*f",

"why-NF1=no flick is allowed on the first roll element",
"why-NF2=no flick is allowed on the second roll element",
"why-NF3=no flick is allowed on the third roll element",
"why-NF4=no flick is allowed on the fourth roll element",

"rule-NR1 = rfsz:^[^z]",
"rule-NR2 = rfsz:^[^ ]+ [^z]",
"rule-NR3 = rfsz:^[^ ]+ [^ ]+ [^z]",
"rule-NR4 = rfsz:^[^ ]+ [^ ]+ [^ ]+ [^z]",

"why-NR1  =no roll allowed for first rolling element ",
"why-NR2  =no roll allowed for second rolling element",
"why-NR3  =no roll allowed for third rolling element",
"why-NR4  =no roll allowed for fourth rolling element",

"rule-OS1 = rfsz:^[rf]",
"rule-OS2 = rfsz:^[^ ]+ [rf]",
"rule-OS3 = rfsz:^[^ ]+ [^ ]+ [rf]",
"rule-OS4 = rfsz:^[^ ]+ [^ ]+ [^ ]+ [rf]",

"why-OS1  =only spin allowed for first rolling element ",
"why-OS2  =only spin allowed for second rolling element",
"why-OS3  =only spin allowed for third rolling element",
"why-OS4  =only spin allowed for fourth rolling element",

"rule-OHS = 9\\.11\\.1\\.[57]",

"why-OHS  =only 1 or 1 1/2 spin allowed in this figure",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

// Lines
"1.1.1.1-2 NOU",
"1.1.1.3-4 IntermediateNOU",
"1.1.2.1 NOU",
"1.1.2.3 NOU",
"1.1.3.1 NOU",
"1.1.3.3 NOU ; NHR1",
"1.1.3.4 NOU",
"1.1.6.1 NOU ; MaxQUp",
"1.1.6.3 NOU ; MaxQDn",
"1.1.7.1 NOU ; MaxQUp",
"1.1.7.4 NOU ; MaxQDn",

// Sharks tooth
"1.2.1.1 NOU ; MaxQDn",
"1.2.1.3 NOU ; MaxQUp",
"1.2.2.3 NOU ; MaxQUp",
"1.2.3.1 NOU ; MaxQDn",
"1.2.3.4 NOU ; NHR1",
"1.2.4.4 NOU ; NHR1",
"1.2.5.1 NOU ; MaxQUp",
"1.2.5.4 NOU ; OS1 ; NR2",
"1.2.6.1 NOU ; MaxQUp",
"1.2.6.3 NOU ; OHS",
"1.2.7.1 NOU ; MaxQUp",
"1.2.7.4 NOU ; NHR2",
"1.2.8.1 NOU ; MaxQUp ; NHR2",
"1.2.8.3 NOU ; MaxQDn ; OHS",

// Bow
"1.3.2.1 NOU",

// Turns & rolling circles
"2.1.1.1-2",
"2.1.3.1-2",
"2.2.1.1-2",
"2.2.5.1",
"2.3.1.1-2",
"2.3.4.1",

// -idz+
"3.3.1.4 NOU",

// Hammerheads
"5.2.1.1 NOU",
"5.2.1.3 NOU ; NR2",
"5.3.1.1 NOU ; NR1 ; NR2 ; NHR3",

// Half loops
"7.2.1.1 NOU ; NF1 ; NHR1 ; NR2",
"7.2.1.2 NOU ; NR1 ; NR2",
"7.2.1.4 NOU ; NR1 ; NF2",
"7.2.2.1 NOU ; NF1 ; NEQR1 ; NER2 ; NF2",
"7.2.2.4 NOU ; NR1 ; NF2",
"7.2.3.3 NOU ; NEQR2 ; NF2",
"7.2.4.2 NOU ; NHR2",
"7.2.4.3 NOU ; NHR2 ; NF2",

// Goldfish
"7.3.1.2 NOU ; NR1",
"7.3.1.3 NOU",
"7.3.2.1 NOU",
"7.3.3.3 NOU",
"7.3.4.1 NOU",

// Loops
"7.4.1.1 NOU ; NEQR1",
"7.4.3.1 NOU ; NR1",
"7.4.5.1 NOU ; NR1 ; NR2",

// Reversing loops
"7.3.7.1 NOU ; NHR1",
"7.4.8.1 NOU ; NR1 ; NHR2",
"7.4.9.3 NOU ; NF1 ; NHR1",
"7.4.12.3 NOU ; NHR2",

// Horizontal S-es
"7.5.2.1 NOU ; NEQR1 ; NF1 ; NHR2 ; NR3",
"7.5.2.4 NOU ; NR1 ; NHR2 ; NEQR3 ; NF3",
"7.5.5.3 NOU ; NF1 ; NHR2 ; NR3",
"7.5.7.1 NOU ; NR1 ; NHR2 ; NF3",

// Full cubans
"7.8.3.1 NOU ; NR1 ; NR3",
"7.8.3.4 NOU ; NR1 ; NR3",
"7.8.4.1 NOU ; NR1",
"7.8.6.3 NOU ; NR1 ; NR3",
"7.8.8.1 NOU ; NR3",
"7.8.8.4 NOU ; NR3",

// Humpty bumps
"8.4.1.1 NOU ; MaxQUp ; MaxQDn",
"8.4.2.1 NOU ; MaxQUp ; NR2",
"8.4.3.1 NOU ; MaxQUp ; MaxQDn",
"8.4.13.1 NOU ; NR1 ; NR2",
"8.4.14.1 NOU ; NR1",
"8.4.15.1 NOU ; NR2",

// Half cubans
"8.5.1.2 NOU ; NER2",
"8.5.1.3 NOU ; NEQR2",
"8.5.2.1 NOU ; NER2",
"8.5.3.3 NOU ; NF2",
"8.5.4.1 NOU ; NHR1 ; NF2",
"8.5.4.4 NOU ; NF2",
"8.5.5.1 NOU ; NER2",
"8.5.5.4 NOU ; NEQR1",
"8.5.6.1 NOU ; NER1",
"8.5.7.1 NOU ; NR2",
"8.5.7.3 NOU ; NF1",
"8.5.8.3 NOU ; NF1 ; NH1 ; NHR2",

// Keyhole loops
"8.5.9.1 NR1 ; NR2",
"8.5.17.1 NR1 ; NR2",

// P loops
"8.6.1.1 NOU ; MaxQUp ; NER2 ; NF2 ; NF3",
"8.6.3.3 NOU ; NR1 ; NEQR2 ; NF2",
"8.6.4.3 NOU ; OHS ; NF2 ; NER2",
"8.6.5.1 NOU ; NF1 ; NER1 ; NHR2 ; BOTTOP ; MaxQDn",
"8.6.7.2 NOU ; NR2",
"8.6.7.3 NOU ; NF1 ; MaxQUp",
"8.6.8.3 NOU ; NF1 ; MaxQUp",

// Porpoises
"8.6.11.1 NOU ; NR1 ; NR2 ; NEQR3 ; NF3",
"8.6.11.3 NOU ; OHS ; NR2 ; NEQR3 ; NF3",

// Q loops
"8.7.1.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
"8.7.3.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
"8.7.5.1 NOU ; NF1 ; NEQR1 ; NHR2 ; NR3",
"8.7.7.2 NOU ; NER1 ; NR2 ; NR3",

// Rolls
"9.1.1.1-2",
"9.1.2.2",
"9.1.2.4",
"9.1.3.1-4",
"9.1.4.2",
"9.1.5.1",
"9.1.5.2",
"9.2.3.4",
"9.4.2.2",
"9.4.3.2",
"9.4.3.4",
"9.4.4.2",
"9.8.3.2",
"9.8.3.4",

// Snaps
"9.9.3.2",
"9.9.3.4",
"9.9.4.4",

// Spins
"9.11.1.4-7",
"9.12.1.4",
"9.12.1.6",

/***********************************************************************
 * BAeA Glider Intermediate Free Known                                        *
 ***********************************************************************/

"[glider-BAeA Intermediate Free Known]",
"figure-letters=ABCDE",
'reference="@A" 2t "@B" c2 "@C" h "@D" m2 "@E" 2a',
"posnl=15",
"basefig-max=10",
"basefig-min=10"

);
