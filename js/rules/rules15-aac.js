// OpenAero rules15-aac.js file

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
// This file defines AAC (Australian Aerobatic Club - http://www.aerobaticsaustralia.com.au/)
// Free sequence (Programme 2) rules for 2015 
//
// Created by Bruno Roque (bruno.r.roque@gmail.com)
// ------------------------------------------------------------------------------------------

//###############################################################################
//##### AAC Sportsman FREE ######################################################
//###############################################################################


rules.push("[AAC Sportsman Free]");

//All figures are allowed for the Free Program
rules.push("allow=^[1-9]");

// Define Family 2.1 - 2.2
rules.push("group-sportaacturn=^2\\.[1-2]");
rules.push("sportaacturn-name=Family 2.1-2.2 Turns");

// Define Family 9.1 - 9.4
rules.push("group-sportaacroll=^9\\.[1-4]");
rules.push("sportaacroll-name=Family 9.1-9.4 Rolls");

// Define figures not allowed for repetition - Family 2 to 8 (only 1 and 9 allowed repetition)
rules.push("group-sportfignorept=^[2-8]");
rules.push("sportfignorept-name=Family 2 - 8");

// Score, max number of figures and max K
rules.push("posnl=4");                  // Positioning score = 4
rules.push("basefig-max=12");           // Maximum of 12 figures
rules.push("k-max=120");                // Maximum K = 120

// Mandatory figures (at least one)
rules.push("fam1-min=1");                // Family 1
rules.push("sportaacturn-min=1");        // Family 2.1 - 2.2
rules.push("fam7-min=1");                // Family 7
rules.push("fam8-min=1");                // Family 8
rules.push("sportaacroll-min=1");        // Family 9.1 - 9.4
rules.push("spin-min=1");                // Family 9.11 - 9.12

// Figures that can NOT appear more than once
rules.push("sportfignorept-repeat=1"); // Only Family 1 and 9 alowed to repeat
rules.push("spin-max=1");              // Only one spin
rules.push("combined-repeat=1");       // A figure can not be repeated
 
// What info should be filled out
rules.push("infocheck=pilot;aircraft;positioning");


//###############################################################################
//##### AAC Intermediate (AUS) FREE #############################################
//###############################################################################

rules.push("[AAC Intermediate (AUS) Free]");
rules.push("more=CIVA Intermediate Free");


//###############################################################################
//##### AAC Intermediate (CIVA) FREE ############################################
//###############################################################################

rules.push("[AAC Intermediate (CIVA) Free]");
rules.push("more=CIVA Intermediate Free");


//###############################################################################
//##### AAC Advanced FREE #######################################################
//###############################################################################

rules.push("[AAC Advanced Free]");
rules.push("more=CIVA Advanced Free");


//###############################################################################
//##### AAC Unlimited FREE ######################################################
//###############################################################################

rules.push("[AAC Unlimited Free]");
rules.push("more=CIVA Unlimited Free");


