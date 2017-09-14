// OpenAero rules17-aac.js file

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
// Free sequence (Programme 2) rules for 2017 
//
// Created by Bruno Roque (bruno.r.roque@gmail.com)
// ------------------------------------------------------------------------------------------



//###############################################################################
//##### AAC Sportsman FREE ######################################################
//###############################################################################


rules.push("[AAC Sportsman Free]");		// Name of the rule for the user to select

//All figures are allowed
rules.push("allow=^[1-9]");

// Define Family 2.1 - 2.2
rules.push("group-aacturn=^2\\.[1-2]");
rules.push("aacturn-name=Family 2.1 - 2.2 Turns");

// Define Family 9.1 - 9.4
rules.push("group-aacroll=^9\\.[1-4]");
rules.push("aacroll-name=Family 9.1 - 9.4 Rolls");

// Define figures not allowed for repetition - Family 2 to 8 (only 1 and 9 allowed repetition)
rules.push("group-fignorept=^[2-8]");
rules.push("fignorept-name=Family 2 - 8");

// Score, max number of figures and max K
rules.push("posnl=4");                  	// Positioning score = 4
rules.push("basefig-max=12");           	// Maximum of 12 figures
rules.push("k-max=129");                	// Maximum K is the same as the Known for that year, in 2017 K = 129

// Mandatory figures (at least one)
rules.push("fam1-min=1");			// Family 1
rules.push("aacturn-min=1");        		// Family 2.1 - 2.2
rules.push("fam7-min=1");              		// Family 7
rules.push("fam8-min=1");               	// Family 8
rules.push("aacroll-min=1");			// Family 9.1 - 9.4
rules.push("spin-min=1");               	// Family 9.11 - 9.12

// Figures that can NOT appear more than once
rules.push("fignorept-repeat=1");		// Only Family 1 and 9 allowed to repeat
rules.push("spin-max=1");              		// Only one spin allowed
rules.push("combined-repeat=1");       		// A figure can not be repeated
 
// What info should be filled out
rules.push("infocheck=pilot;actype;acreg;positioning");


//###############################################################################
//##### AAC Intermediate (AUS) FREE #############################################
//###############################################################################

rules.push("[AAC Intermediate AUS Free]");	// Name of the rule for the user to select



//All figures are allowed
rules.push("allow=^[1-9]");

// Define figures not allowed for repetition - Family 2 to 8 (only 1 and 9 allowed repetition)
rules.push("group-fignorept=^[2-8]");
rules.push("fignorept-name=Family 2 - 8");

// Score, max number of figures and max K
rules.push("posnl=15");                 	// Positioning score = 15
rules.push("basefig-max=10");           	// Maximum of 10 figures
rules.push("k-max=200");                	// Maximum K = 200

// Mandatory figures (at least one)
rules.push("group-intermediatefam2=^2\\.(1\\.[2-3]|2\\.[2-6]|3\\.[2-5]|4\\.[2-8])");		// Intermediate Family 2

rules.push("intermediatefam2-name=Family 2.1.2 to 2.1.3, 2.2.2 to 2.2.6, 2.3.2 to 2.3.5 and 2.4.2 to 2.4.8");

rules.push("intermediatefam2-min=1");		// At least 1 from the Intermediate Family 2


rules.push("fam5-min=1");               	// Family 5

rules.push("fam7-min=1");               	// Family 7
rules.push("fam8-min=1");               	// Family 8


						// At least one from each sub Family 9.1 to 9.8

rules.push("froll-min=1");               	// At least 1 from the Family 9.1

rules.push("hroll-min=1");               	// At least 1 from the Family 9.2

rules.push("troll-min=1");               	// At least 1 from the Family 9.3

rules.push("qroll-min=1");               	// At least 1 from the Family 9.4

rules.push("group-roll95=^9\\.5");		// Define the family

rules.push("roll95-name=Family 9.5");		// Define the name

rules.push("roll95-min=1");               	// At least 1 from the Family 9.5

rules.push("group-roll96=^9\\.6");		// Define the family

rules.push("roll96-name=Family 9.6");		// Define the name

rules.push("roll96-min=1");               	// At least 1 from the Family 9.6

rules.push("group-roll97=^9\\.7");		// Define the family

rules.push("roll97-name=Family 9.7");		// Define the name

rules.push("roll97-min=1");               	// At least 1 from the Family 9.7

rules.push("eroll-min=1");               	// At least 1 from the Family 9.8


rules.push("snap-min=1");               	// At least 1 from the Family 9.9 or 9.10 (snap)

rules.push("spin-min=1");               	// Family 9.11 - 9.12


rules.push("opposite-min=1");               	// At least 1 opposite roll


// Figures that can NOT appear more than once
rules.push("fignorept-repeat=1");		// Only Family 1 and 9 allowed to repeat
rules.push("combined-repeat=1");       		// A figure can not be repeated
 
// What info should be filled out
rules.push("infocheck=pilot;actype;acreg;positioning");





//###############################################################################

//##### AAC Intermediate (CIVA) FREE ############################################

//###############################################################################



rules.push("[AAC Intermediate CIVA Free]");

rules.push("more=CIVA Intermediate Programme1");


//###############################################################################
//##### AAC Advanced FREE #######################################################
//###############################################################################

rules.push("[AAC Advanced Free]");
rules.push("more=CIVA Advanced Programme1");


//###############################################################################
//##### AAC Unlimited FREE ######################################################
//###############################################################################

rules.push("[AAC Unlimited Free]");
rules.push("more=CIVA Unlimited Programme1");


