// OpenAero rules-aac.js file

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
// rules
//
// Created by Bruno Roque (bruno.r.roque@gmail.com)
// ------------------------------------------------------------------------------------------
/*
 * 2022.1.7
 * - Updated Sportsman Free K
 * 2023.3.1
 * - Updated Sportsman Free K
 * - Addec fixed positioning K factors for Graduate and Sportsman
 * 2026.1.1
 * - Updated Intermediate Free Known reference sequence
 */

rules.push (
"year=2023",
// AAC Graduate and Sportsman Known. Empty rulesets just to prevent rule warning
"[AAC Graduate Known]",
"posnl=10",                          // Positioning score = 10
"[AAC Sportsman Known]",
"posnl=15",                          // Positioning score = 15

//###############################################################################
//##### AAC Sportsman ###########################################################
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

// Score, max number of figures and max K of figures
"posnl=15",                          // Positioning score = 15
"basefig-max=12",                   // Maximum of 12 figures
"k-max=137",                        // Maximum K is the same as the Known for that year, in 2023 K = 137

// Mandatory figures (at least one)
"fam1-min=1",                       // Family 1
"aacturn-min=1",                    // Family 2.1 - 2.2
"fam5-min=1",                       // Family 5
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
//##### AAC Intermediate  #######################################################
//###############################################################################

// Programme 1 is identical to the CIVA programme 1, except for the
// reference sequence
"[AAC Intermediate Programme1]",
"posnl=30",//no line judges
"poslj=10",
"k-max=200",
"basefig-min=10",
"basefig-max=10",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

"fam5-min=1",
"fam7-min=1",
"fam8-min=1",
"froll-min=1",
"hroll-min=1",
"qroll-min=1",
"eroll-min=1",
"snap-min=1",
"spin-min=1",

"group-roller=^2\\.(1\\.[23]|2\\.[2-7]|3\\.[2-6]|4\\.[2-8])",
"roller-name=Rolling turn, family 2.1.2 to 2.1.3, 2.2.2 to 2.2.7, 2.3.2 to 2.3.6, 2.4.2 to 2.4.8",
"roller-name_fr=Tonneaux en virage, famille 2.1.2, 2.1.3, 2.2.2 à 2.2.7, 2.3.2 à 2.3.6, 2.4.2 à 2.4.8",
"roller-name_de=Rollenkreis, Familie 2.1.2 bis 2.1.3, 2.2.2 bis 2.2.7, 2.3.2 bis 2.3.6, 2.4.2 bis 2.4.8",
"roller-min=1",

"emptyline-max=0",

"opposite-min=1",//one opposite roll is required!

"figure-letters=ABCDE",

'reference="@A" dh.\'\' "@B" rp2- "@C" ,24a44 "@D" \'2f.\'t.\'\' "@E" pb8.\'\'^',

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",
// End of programme 1

"[AAC Intermediate Programme2]",
"more=CIVA Intermediate Programme2",
"[AAC Intermediate Programme3]",
"more=CIVA Intermediate Programme3",
"[AAC Intermediate Programme4]",
"more=CIVA Intermediate Programme4",


//###############################################################################
//##### AAC Advanced  ###########################################################
//###############################################################################

"[AAC Advanced Programme1]",
"more=CIVA Advanced Programme1",
"[AAC Advanced Programme2]",
"more=CIVA Advanced Programme2",
"[AAC Advanced Programme3]",
"more=CIVA Advanced Programme3",
"[AAC Advanced Programme4]",
"more=CIVA Advanced Programme4",


//###############################################################################
//##### AAC Unlimited  ##########################################################
//###############################################################################

"[AAC Unlimited Programme1]",
"more=CIVA Unlimited Programme1",
"[AAC Unlimited Programme2]",
"more=CIVA Unlimited Programme2",
"[AAC Unlimited Programme3]",
"more=CIVA Unlimited Programme3",
"[AAC Unlimited Programme4]",
"more=CIVA Unlimited Programme4"

);
