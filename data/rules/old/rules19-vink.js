// OpenAero rules19-vink.js file

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

// This file defines VINK rules
/**
* 1.3.8
* - added Standard Unknown
* 1.4.4
* - corrected Standard Unknown K to 15
* 1.5.0
* - added Beginners & Standard Known
* - changed display order
* 2016.1.3
* - removed Intermediate
* - 2016 Beginners & Standard Known
* 2016.3
* - corrected 8.6.5.1 and 8.7.5.1 in Standard Unknown to allow 9.1.3.4
* 2019.1.4
* - updated VINK rules for Club and Sports
*/

rules.push (

//###############################################################################
//##### VINK CLUB KNOWN ####################################################
//###############################################################################

"[VINK Club Known]",
"posnl=10",
//"demo=d iv``s.' c.'',2 o 2j 1",

//###############################################################################
//##### VINK STANDARD KNOWN #####################################################
//###############################################################################

"[VINK Sports Known]",
"posnl=15",
//"demo=m,2+ +2j (0,12) d iv```6s...''++ ',2rc ~~44~~ 2> `+h,4''+ 3> oj c.'2 1",

//###############################################################################
//##### VINK STANDARD UNKNOWN ###################################################
//###############################################################################

"[VINK Sports Unknown]",
"posnl=15",

// convert 9.11.1.4 and .6 to s, 9.11.1.5 to q and no roll to z
"conv-standardSpin=^9\\.11\\.1\\.[46]=s ; ^9\\.11\\.1\\.5=q ; ^0\\.=z",

"rule-no5Qspin=standardSpin:q",
"why-no5Qspin=no 1 1/4 spin allowed",

"rule-spinRequired=standardSpin:z",
"why-spinRequired=spin required on vertical",

"rule-NH=roll:2",
"why-NH=no 2-point rolls allowed",

"rule-NQ=roll:4",
"why-NQ=no 4-point rolls allowed",

"emptyline-max=0",
"opposite-max=0",

"1.1.1.1",
"1.1.2.1",
"1.1.2.3",
"1.1.6.3 spinRequired",
"1.2.3.1",
"1.2.6.3 spinRequired:1 ; no5Qspin",
"2.1.1.1",
"2.2.1.1",
"2.3.1.1",
"5.2.1.1",
"7.2.2.1 NR:1",
"7.2.3.3 NR:2",
"7.3.2.1",
"7.3.3.3",
"7.4.1.1 NR",
"7.5.5.3",
"7.5.7.1",
"8.4.1.1 NR",
"8.5.2.1 NQ",
"8.5.3.3",
"8.5.6.1 NR:1",
"8.5.7.3",
"8.6.4.3 spinRequired:1 ; no5Qspin",
"8.6.5.1 NH ; NQ ; NR:2 ; NR:3",
"8.7.5.1 NH ; NQ ; NR:2 ; NR:3",

"9.1.2.2",
"9.1.3.2",
"9.1.3.4",
"9.1.4.2",
"9.1.5.1",
"9.2.3.4",
"9.4.3.4",

"9.11.1.4",
"9.11.1.5",
"9.11.1.6"

);
