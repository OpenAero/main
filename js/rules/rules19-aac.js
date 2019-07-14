// OpenAero rules19-aac.js file

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

// ------------------------------------------------------------------------------------------
// This file defines AAC (Australian Aerobatic Club - http://www.aerobaticsaustralia.com.au)
// rules for 2019
//
// Created by Bruno Roque (bruno.r.roque@gmail.com)
// ------------------------------------------------------------------------------------------

rules.push (

//###############################################################################
//##### AAC Sportsman FREE ######################################################
//###############################################################################

"[AAC Sportsman Free]",             // Name of the rule for the user to select

//All figures are allowed
"allow=^[1-9]",

// Define Family 2.1 - 2.2
"group-aacturn=^2\\.[1-2]",
"aacturn-name=Family 2.1 - 2.2 Turns",

// Define Family 9.1 - 9.4
"group-aacroll=^9\\.[1-4]",
"aacroll-name=Family 9.1 - 9.4 Rolls",

// Define figures not allowed for repetition - Family 2 to 8 (only 1 and 9 allowed repetition)
"group-fignorept=^[2-8]",
"fignorept-name=Family 2 - 8",

// Score, max number of figures and max K
"posnl=4",                          // Positioning score = 4
"basefig-max=12",                   // Maximum of 12 figures
"k-max=136",                        // Maximum K is the same as the Known for that year, in 2019 K = 136

// Mandatory figures (at least one)
"fam1-min=1",                       // Family 1
"aacturn-min=1",                    // Family 2.1 - 2.2
"fam7-min=1",                       // Family 7
"fam8-min=1",                       // Family 8
"aacroll-min=1",                    // Family 9.1 - 9.4
"spin-min=1",                       // Family 9.11 - 9.12

// Figures that can NOT appear more than once
"fignorept-repeat=1",               // Only Family 1 and 9 allowed to repeat
"spin-max=1",                       // Only one spin allowed
"combined-repeat=1",                // A figure can not be repeated

// What info should be filled out
"infocheck=pilot;actype;acreg;positioning",


//###############################################################################
//##### AAC Intermediate (AUS) FREE #############################################
//###############################################################################

"[AAC Intermediate AUS Free]",      // Name of the rule for the user to select

//All figures are allowed
"allow=^[1-9]",

// Define figures not allowed for repetition - Family 2 to 8 (only 1 and 9 allowed repetition)
"group-fignorept=^[2-8]",
"fignorept-name=Family 2 - 8",

// Score, max number of figures and max K
"posnl=15",                         // Positioning score = 15
"basefig-max=10",                   // Maximum of 10 figures
"k-max=200",                        // Maximum K = 200

// Mandatory figures (at least one)
"group-intermediatefam2=^2\\.(1\\.[2-3]|2\\.[2-6]|3\\.[2-5]|4\\.[2-8])", // Intermediate Family 2

"intermediatefam2-name=Family 2.1.2 to 2.1.3, 2.2.2 to 2.2.6, 2.3.2 to 2.3.5 and 2.4.2 to 2.4.8",

"intermediatefam2-min=1",           // At least 1 from the Intermediate Family 2


"fam5-min=1",                       // Family 5

"fam7-min=1",                       // Family 7
"fam8-min=1",                       // Family 8


// At least one from each sub Family 9.1 to 9.8

"froll-min=1",                      // At least 1 from the Family 9.1

"hroll-min=1",                      // At least 1 from the Family 9.2

"qroll-min=1",                      // At least 1 from the Family 9.4

"eroll-min=1",                      // At least 1 from the Family 9.8

"snap-min=1",                       // At least 1 from the Family 9.9 or 9.10 (snap)

"spin-min=1",                       // Family 9.11 - 9.12

"opposite-min=1",                   // At least 1 opposite roll


// Figures that can NOT appear more than once
"fignorept-repeat=1",               // Only Family 1 and 9 allowed to repeat
"combined-repeat=1",                // A figure can not be repeated

// What info should be filled out
"infocheck=pilot;actype;acreg;positioning",



//###############################################################################
//##### AAC Intermediate (CIVA) FREE ############################################
//###############################################################################

"[AAC Intermediate Free Known]",
"more=CIVA Intermediate Free Known",
"[AAC Intermediate Unknown1]",
"more=CIVA Intermediate Unknown1",
"[AAC Intermediate Unknown2]",
"more=CIVA Intermediate Unknown2",
"[AAC Intermediate Unknown3]",
"more=CIVA Intermediate Unknown3",


//###############################################################################
//##### AAC Advanced FREE #######################################################
//###############################################################################

"[AAC Advanced Free Known]",
"more=CIVA Advanced Free Known",
"[AAC Advanced Unknown1]",
"more=CIVA Advanced Unknown1",
"[AAC Advanced Unknown2]",
"more=CIVA Advanced Unknown2",
"[AAC Advanced Unknown3]",
"more=CIVA Advanced Unknown3",


//###############################################################################
//##### AAC Unlimited FREE ######################################################
//###############################################################################

"[AAC Unlimited Free Known]",
"more=CIVA Unlimited Free Known",
"[AAC Unlimited Unknown1]",
"more=CIVA Unlimited Unknown1",
"[AAC Unlimited Unknown2]",
"more=CIVA Unlimited Unknown2",
"[AAC Unlimited Unknown3]",
"more=CIVA Unlimited Unknown3"

);
