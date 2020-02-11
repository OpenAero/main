// OpenAero rules18-iac.js file

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
//
// 1.5.0
// - added Known sequences
// 1.5.1.6
// - fixed basefigex11-repeat rule
// 1.5.1.8
// - added floating-point for Sportsman Free
// 1.5.2.2
// - added Unlimited Free
// 1.5.2.3
// - updated infocheck directives for actype and acreg
// 2017
// - updated rules for 2017
// 2017.1.1
// - corrected fam 7 requirement for Sportsman Free
// 2018.1.2
// - updated Sportsman K for 2018

//###############################################################################
//##### IAC Primary KNOWN #######################################################
//###############################################################################

rules.push("[IAC Primary Known]");
rules.push("posnl=3");
// rules.push("demo=/o c.',2 ,1 5% 2j 3j 1");

//###############################################################################
//##### IAC Sportsman KNOWN #######################################################
//###############################################################################

rules.push("[IAC Sportsman Known]");
rules.push("posnl=6");
// rules.push("demo=b 2t...+ 4> +++m2++ iv``5s..' h`4 2% ``````,2``rc+`````````` (0,9) o ``+c.'',2.' 3j 22");

//###############################################################################
//##### IAC Intermediate KNOWN #######################################################
//###############################################################################

rules.push("[IAC Intermediate Known]");
rules.push("posnl=8");
// rules.push("demo=/+++k.,24....+ m,2,22++++ 6> 4% 2a1+++ (1,10) ~`b`2.'+`` of ,4h...8....~~ 'rp~ 1% ``+```2.g`2.-` -1j5>");

//###############################################################################
//##### IAC Sportsman FREE ###############################################
//###############################################################################


rules.push("[IAC Sportsman Free]");

rules.push("group-fam7274=^7\\.(2\\.[1-4]|4\\.[1-6])\\.");
rules.push("fam7274-name=7.2.1 thru 7.2.4, or 7.4.1 thru 7.4.6");

rules.push("posnl=6");
rules.push("basefig-max=12");
rules.push("k-max=122");
rules.push("floating-point=1");

rules.push("basefigex11-repeat=1");

rules.push("roll-repeat=1");
rules.push("spin-repeat=1");

rules.push("fam7274-min=1");
rules.push("fam8-min=1");
rules.push("fam9-min=1");

rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free Program

// what info should be filled out
rules.push("infocheck=pilot;actype;acreg;positioning");

//###############################################################################
//##### IAC INTERMEDIATE FREE ##################################################
//###############################################################################

rules.push("[IAC Intermediate Free]");

// new for 2016
rules.push("group-snapor44=^9\\.(9|10|4\\.3\\.4)");
rules.push("snapor44-name=snap roll or 9.4.3.4");

rules.push("posnl=8");
rules.push("basefig-max=15");
rules.push("k-max=191");
rules.push("floating-point=1");

rules.push("basefigex11-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("fam9-min=1");
rules.push("froll-min=1");
rules.push("snapor44-min=1");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free Program

// what info should be filled out
rules.push("infocheck=pilot;actype;acreg;positioning");

//###############################################################################
//##### IAC INTERMEDIATE UNKNOWN##################################################
//###############################################################################

rules.push("[IAC Intermediate Unknown]");

rules.push("posnl=8");
rules.push("basefig-max=12");
rules.push("basefig-min=6");
rules.push("k-max=175");

rules.push("emptyline-max=0");

rules.push("allow=^[1-9]"); //all figures are allowed 

// what info should be filled out
rules.push("infocheck=pilot;actype;acreg;positioning");

//###############################################################################
//##### IAC ADVANCED FREE ##################################################
//###############################################################################

rules.push("[IAC Advanced Free]");

rules.push("posnl=12");
rules.push("basefig-max=12");
rules.push("k-max=301");
rules.push("floating-point=1");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("fam1-min=1");
rules.push("fam2-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("fam9-min=1");
rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("eroll-min=1");
rules.push("snap-min=1");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("allow=^[1-9]"); //all figures are allowed for the Free Program

// what info should be filled out
rules.push("infocheck=pilot;actype;acreg;positioning");
//###############################################################################
//##### IAC ADVANCED UNKNOWN##################################################
//###############################################################################

rules.push("[IAC Advanced Unknown]");

rules.push("posnl=8");
rules.push("basefig-max=14");
rules.push("basefig-min=10");
rules.push("k-max=275");
rules.push("snap-min=2");
rules.push("snap-max=4");
rules.push("emptyline-max=0");

rules.push("allow=^[1-9]"); //all figures are allowed 

// what info should be filled out
rules.push("infocheck=pilot;actype;acreg;positioning");

//###############################################################################
//##### IAC UNLIMITED FREE ######################################################
//###############################################################################

rules.push("[IAC Unlimited Free]");

rules.push("posnl=26");
rules.push("k-max=421");
rules.push("floating-point=1");

rules.push("more=CIVA/IAC Unlimited Free");
