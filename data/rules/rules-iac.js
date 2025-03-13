﻿// OpenAero rules-iac.js file

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
 * 2021.1.2
 * - The maximum number of figures in an Advanced Free is now 14 (was 12)
 * - The maximum number of snap rolls in an Advanced Unknown is now 3 (was 4)
 * 2021.1.5
 * - Corrected IAC Sportsman Free maximum K to 116 (115 + 1 fp)
 * 2021.1.7
 * - Advanced Free: replaced fam2 by roller requirement
 * 2022.1.7
 * - Updated IAC Sportsman Free maximum K to 128 (127 + 1 fp)
 * 2023.1
 * - Updated IAC Sportsman Free maximum K to 121 (120 + 1 fp)
 * - Updated pos K for Intermediate to 20 and for Advanced to 30
 * 2024.1.4
 * - Updated IAC Sportsman Free maximum K to 130 (129 + 1 fp)
 * 2025.1.3
 * - Updated IAC Sportsman Free maximum K to 116 (115 + 1 fp)
*/

rules.push (
"year=2023",
//###############################################################################
//##### IAC Primary KNOWN #######################################################
//###############################################################################

"[IAC Primary Known]",
"posnl=5",

//###############################################################################
//##### IAC Sportsman KNOWN #######################################################
//###############################################################################

"[IAC Sportsman Known]",
"posnl=10",

//###############################################################################
//##### IAC Intermediate KNOWN #######################################################
//###############################################################################

"[IAC Intermediate Known]",
    "pos=20",

//###############################################################################
//##### IAC Sportsman FREE ###############################################
//###############################################################################

"[IAC Sportsman Free]",

"group-fam7274=^7\\.(2\\.[1-4]|4\\.[1-6])\\.",
"fam7274-name=7.2.1 thru 7.2.4, or 7.4.1 thru 7.4.6",

"posnl=10",
"basefig-max=12",
"k-max=116", // = 115 + 1 fp
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

"group-snapor44=^9\\.(9|10|4\\.3\\.4)",
"snapor44-name=snap roll or 9.4.3.4",

"pos=20",
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

"pos=20",
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

"group-roller=^2\\.(1\\.[23]|2\\.[2-7]|3\\.[2-6]|4\\.[2-8])",
"roller-name=Rolling turn, family 2.1.2 thru 2.1.3, or 2.2.2 thru 2.2.7, or 2.3.2 thru 2.3.6, or 2.4.2 thru 2.4.8",

"pos=30",
"basefig-max=14",
"k-max=301",
"floating-point=1",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

"fam1-min=1",
"roller-min=1",
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

"pos=30",
"basefig-max=14",
"basefig-min=10",
"k-max=275",
"snap-min=2",
"snap-max=3",
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
