// OpenAero rules13-vink.js file

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

// This file defines VINK rules for 2013

// version 1.3.8
// - added Standard Unknown

//###############################################################################
//##### VINK INTERMEDIATE FREE ##################################################
//###############################################################################

rules.push("[VINK Intermediate Free]");
rules.push("more=civa yak52 free");

//###############################################################################
//##### VINK INTERMEDIATE UNKNOWN ###############################################
//###############################################################################

rules.push("[VINK Intermediate Unknown1]");
rules.push("more=CIVA Yak52 Unknown1");
rules.push("[VINK Intermediate Unknown2]");
rules.push("more=CIVA Yak52 Unknown2");

//###############################################################################
//##### VINK STANDARD UNKNOWN ###################################################
//###############################################################################

rules.push("[VINK Standard Unknown]");
rules.push("posnl=20");

// convert 9.11.1.4 and .6 to s, 9.11.1.5 to q and no roll to z
rules.push("conv-standardSpin=^9\\.11\\.1\\.[46]=s ; ^9\\.11\\.1\\.5=q ; ^0\\.=z");

rules.push("rule-no5Qspin=standardSpin:q");
rules.push("why-no5Qspin=no 1 1/4 spin allowed");

rules.push("rule-spinRequired=standardSpin:z");
rules.push("why-spinRequired=spin required on vertical");

rules.push("rule-NQ=roll:4");
rules.push("why-NQ=no 4-point rolls allowed");

rules.push("emptyline-max=0");
rules.push("opposite-max=0");

rules.push("1.1.1.1");
rules.push("1.1.2.1");
rules.push("1.1.2.3");
rules.push("1.1.6.3 spinRequired");
rules.push("1.2.3.1");
rules.push("1.2.6.3 spinRequired:1 ; no5Qspin");
rules.push("2.1.1.1");
rules.push("2.2.1.1");
rules.push("2.3.1.1");
rules.push("5.2.1.1");
rules.push("7.2.2.1 NR:1");
rules.push("7.2.3.3 NR:2");
rules.push("7.3.2.1");
rules.push("7.3.3.3");
rules.push("7.4.1.1 NR");
rules.push("7.5.5.3");
rules.push("7.5.7.1");
rules.push("8.4.1.1 NR");
rules.push("8.5.2.1 NQ");
rules.push("8.5.3.3");
rules.push("8.5.6.1 NR:1");
rules.push("8.5.7.3");
rules.push("8.6.4.3 spinRequired:1 ; no5Qspin");
rules.push("8.6.5.1 NR");
rules.push("8.7.5.1 NR");

rules.push("9.1.2.2");
rules.push("9.1.3.2");
rules.push("9.1.3.4");
rules.push("9.1.4.2");
rules.push("9.1.5.1");
rules.push("9.2.3.4");
rules.push("9.4.3.4");

rules.push("9.11.1.4");
rules.push("9.11.1.5");
rules.push("9.11.1.6");
