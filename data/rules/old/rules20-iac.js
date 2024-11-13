// OpenAero rules20-iac.js file

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

// This file defines IAC rules for 2015 for Free programs 
// For the Unknowns, limited checking is implemented, just # figures and Maks K
/**
* 1.5.0
* - added Known sequences
* 1.5.1.6
* - fixed basefigex11-repeat rule
* 1.5.1.8
* - added floating-point for Sportsman Free
* 1.5.2.2
* - added Unlimited Free
* 1.5.2.3
* - updated infocheck directives for actype and acreg
* 2017
* - updated rules for 2017
* 2017.1.1
* - corrected fam 7 requirement for Sportsman Free
* 2018.1.2
* - updated Sportsman K for 2018
* 2019.1.4
* - updated all posnl (Presentation) K factors
* 2019.2.4
* - corrected min-snap in Advanced Free to 2
* - added opposite-min=1 in Advanced Free
 * 2020.1.6
 * - added non-Aresti figures 0.1 and 0.2 (quarter clovers) to Intermediate
*/

rules.push (

//###############################################################################
//##### IAC Primary KNOWN #######################################################
//###############################################################################

"[IAC Primary Known]",
"posnl=5",
// "demo=/o c.',2 ,1 5% 2j 3j 1",

//###############################################################################
//##### IAC Sportsman KNOWN #######################################################
//###############################################################################

"[IAC Sportsman Known]",
"posnl=10",
// "demo=b 2t...+ 4> +++m2++ iv``5s..' h`4 2% ``````,2``rc+`````````` (0,9) o ``+c.'',2.' 3j 22",

//###############################################################################
//##### IAC Intermediate KNOWN #######################################################
//###############################################################################

"[IAC Intermediate Known]",
"posnl=15",
// "demo=/+++k.,24....+ m,2,22++++ 6> 4% 2a1+++ (1,10) ~`b`2.'+`` of ,4h...8....~~ 'rp~ 1% ``+```2.g`2.-` -1j5>",

//###############################################################################
//##### IAC Sportsman FREE ###############################################
//###############################################################################


"[IAC Sportsman Free]",

"group-fam7274=^7\\.(2\\.[1-4]|4\\.[1-6])\\.",
"fam7274-name=7.2.1 thru 7.2.4, or 7.4.1 thru 7.4.6",

"posnl=10",
"basefig-max=12",
"k-max=130",
"floating-point=1",

"basefigex11-repeat=1",

"roll-repeat=1",
"spin-repeat=1",

"fam7274-min=1",
"fam8-min=1",
"fam9-min=1",

"spin-min=1",

"emptyline-max=0",

"allow=^[1-9]", //all figures are allowed for the Free Program

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

//###############################################################################
//##### IAC INTERMEDIATE FREE ##################################################
//###############################################################################

"[IAC Intermediate Free]",

// new for 2016
"group-snapor44=^9\\.(9|10|4\\.3\\.4)",
"snapor44-name=snap roll or 9.4.3.4",

"posnl=15",
"basefig-max=15",
"k-max=191",
"floating-point=1",

"basefigex11-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

"fam5-min=1",
"fam7-min=1",
"fam8-min=1",
"fam9-min=1",
"froll-min=1",
"snapor44-min=1",
"spin-min=1",

"emptyline-max=0",
// all Aresti figures and quarter clovers are allowed for the Free Program
"allow=^[1-9]|(0\.[12]$)",

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

//###############################################################################
//##### IAC INTERMEDIATE UNKNOWN##################################################
//###############################################################################

"[IAC Intermediate Unknown]",

"posnl=15",
"basefig-max=12",
"basefig-min=6",
"k-max=175",

"emptyline-max=0",

"allow=^[1-9]", //all figures are allowed 

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

//###############################################################################
//##### IAC ADVANCED FREE ##################################################
//###############################################################################

"[IAC Advanced Free]",

"posnl=25",
"basefig-max=12",
"k-max=301",
"floating-point=1",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

"fam1-min=1",
"fam2-min=1",
"fam5-min=1",
"fam7-min=1",
"fam8-min=1",
"fam9-min=1",
"froll-min=1",
"hroll-min=1",
"qroll-min=1",
"eroll-min=1",
"snap-min=2",
"spin-min=1",
"opposite-min=1",

"emptyline-max=0",

"allow=^[1-9]", //all figures are allowed for the Free Program

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",
//###############################################################################
//##### IAC ADVANCED UNKNOWN##################################################
//###############################################################################

"[IAC Advanced Unknown]",

"posnl=25",
"basefig-max=14",
"basefig-min=10",
"k-max=275",
"snap-min=2",
"snap-max=4",
"emptyline-max=0",

"allow=^[1-9]", //all figures are allowed 

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

//###############################################################################
//##### IAC UNLIMITED FREE ######################################################
//###############################################################################

"[IAC Unlimited Free]",

"posnl=40",
"k-max=421",
"floating-point=1",

"more=CIVA/IAC Unlimited Free"

);
