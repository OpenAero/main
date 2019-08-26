// OpenAero rules19-glider-iac.js file

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

// This file defines IAC rules for Glider programs (Known, Free, Unknown).

// For KNOWN programs, there is no checking of any kind.
// For FREE programs, all checks are implemented.
// For UNKNOWN programs, checking is limited to min/max total figures,
// max total K-factor, and max K per figure for Adv/Unl. Allowable figures
// are *not* checked (just too many of them to input for this first go), nor
// are there any checks for special Unknown rules (e.g., "no snap on entry/exit line").

// See rules16.js for details on the various directives below.


/**
*
* Change History
*
* 2019.2.4: Rules for Glider Known, Free, and Unknown programs
*
*/

rules.push (

//###############################################################################
//#### IAC Glider Sportsman KNOWN ###############################################
//###############################################################################

"[glider-IAC Sportsman Known]",
"posnl=15",


//###############################################################################
//#### IAC Glider Intermediate KNOWN ############################################
//###############################################################################

"[glider-IAC Intermediate Known]",
"posnl=15",

//###############################################################################
//##### IAC Glider Advanced KNOWN ###############################################
//###############################################################################

"[glider-IAC Advanced Known]",
"posnl=25",


//###############################################################################
//##### IAC Glider Unlimited KNOWN ##############################################
//###############################################################################

"[glider-IAC Unlimited Known]",
"posnl=25",


//###############################################################################
//##### IAC Glider Sportsman FREE ###############################################
//###############################################################################

"[glider-IAC Sportsman Free]",

"group-fam91=^9\\.1\\.",
"fam91-name=Family 9.1",

"posnl=15",
"k-max=124",
"floating-point=3",

"basefigex11-repeat=1",

"fam2-min=1",
"fam7-min=1",
"fam91-min=1",

"emptyline-max=0",

// All figures are allowed for the Free Program, including wingovers and 1/4-clovers
"allow=^[1-9]|^0\\.[012]$",

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",


//###############################################################################
//##### IAC Glider Intermediate FREE ############################################
//###############################################################################

"[glider-IAC Intermediate Free]",

"posnl=15",
"k-max=143",
"floating-point=3",

"basefigex11-repeat=1",
"roll-repeat=1",

"fam2-min=1",
"fam5-min=1",
"fam7-min=1",
"froll-min=1",
"uspin-min=1",

"emptyline-max=0",

// All figures are allowed for the Free Program, including wingovers & 1/4-clovers
"allow=^[1-9]|^0\\.[012]$",

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",


//###############################################################################
//##### IAC Glider Advanced FREE ################################################
//###############################################################################

"[glider-IAC Advanced Free]",

"posnl=35",
"basefig-max=10",
"k-max=178",
"floating-point=3",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

// #### See IAC Rule Book Section 6.3.1
"group-fam2advf=^2\\.[1234]\\.1\\.|^2\\.1\\.3\\.",
"fam2advf-name=Family 2.1.1, 2.2.1, 2.3.1, 2.4.1, or 2.1.3",
"group-fam9half=^9\\.1\\.[12345]\\.2$",
"fam9half-name=Family 9.1.x.2",
"group-fam9hesitation=^9\\.[248]\\.",
"fam9hesitation-name=Family 9.2, 9.4, or 9.8",

"fam2adv-min=1",
"fam5-min=1",
"fam6-min=1",
"fam7-min=1",
"fam8-min=1",
"fam9half-min=1",
"fam9hesitation-min=1",

"emptyline-max=0",

"allow=^[1-9]", // All Aresti figures are allowed for the Free Program

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",


//###############################################################################
//##### IAC Glider Unlimited FREE ###############################################
//###############################################################################

"[glider-IAC Unlimited Free]",

"posnl=35",
"basefig-max=10",
"k-max=233",
"floating-point=3",

"group-fam2fullroll=^2\\.1\\.3\\.|^2\\.2\\.[3-7]\\.|^2\\.3\\.[2-5]\\.|^2\\.4\\.[3-8]\\.",
"fam2fullroll-name=Family 2 with at least one full roll",

"group-fam91=^9\\.1\\.",
"fam91-name=Family 9.1",

"group-fam92=^9\\.2\\.",
"fam92-name=Family 9.2",

"group-fam94=^9\\.4\\.",
"fam94-name=Family 9.4",

"group-fam98=^9\\.8\\.",
"fam98-name=Family 9.8",

"group-fam99=^9\\.9\\.",
"fam99-name=Family 9.9",

"group-fam910=^9\\.10\\.",
"fam910-name=Family 9.10",

"fam2fullroll-min=1",
"fam5-min=1",
"fam6-min=1",
"fam7-min=1",
"fam8-min=1",
"fam91-min=1",
"fam92-min=1",
"fam94-min=1",
"fam98-min=1",
"fam99-min=1",
"fam910-min=1",

"emptyline-max=0",

"allow=^[0-9]", // All Aresti figures are allowed 

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",


//###############################################################################
//##### IAC Glider Intermediate UNKNOWN #########################################
//###############################################################################

"[glider-IAC Intermediate Unknown]",

"posnl=15",
"basefig-max=9",
"basefig-min=6",
"k-max=130",
"floating-point=0",

"emptyline-max=0",

"allow=^[1-9]", // All figures are allowed 

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",


//###############################################################################
//##### IAC Glider Advanced UNKNOWN #############################################
//###############################################################################

"[glider-IAC Advanced Unknown]",

"posnl=25",
"basefig-max=9",
"basefig-min=7",
"k-max=145",
"k-maxperfig=35",
"k-maxperfig-rule=IAC Rule 5.5.7",
"emptyline-max=0",

"allow=^[1-9]", // All figures are allowed 

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",



//###############################################################################
//##### IAC Glider Unlimited UNKNOWN ############################################
//###############################################################################

"[glider-IAC Unlimited Unknown]",

"posnl=25",
"basefig-max=9",
"basefig-min=7",
"k-max=190",
"k-maxperfig=40",
"k-maxperfig-rule=IAC Rule 5.5.7",
"emptyline-max=0",

"allow=^[1-9]", // All figures are allowed 

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning"

);