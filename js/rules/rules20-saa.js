// OpenAero rules20-saa.js file

// This file is part of OpenAero.

//  OpenAero was originally designed by Ringo Massa and built upon ideas
//  of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

//  OpenAero is Free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.

// This file defines year (YY) and rule type (XXX) specific rules

/**
SAA 2020, written and updated by Juerg Sutter, July 2020

Modifications 2020  V 2020.01

* 2020.01
* - template created
* - added reference sequences for 2020:
*   -SPO Free 2020
*   -INT Free 2020
*   already covered in CIVA: Free Known ADV, Free Unk ADV, Free Known UNL, Free Unk UNL
*
*   Sources 2020:
*   https://www.fai.org/sites/default/files/documents/section6_part1_v2020_1.pdf (FAI general rules)
*   https://www.saa.ch/wp-content/uploads/2020/04/SNAC-Regulations-v2020-1.pdf (SAA specifics)
*/

// open the rules.push command
rules.push (

//######################################################################################
//##### SAA INTERMEDIATE FREE 2020 #####################################################
//######################################################################################
 
"[SAA Intermediate Free]",
"posnl=30",
"k-max=200",
"basefig-max=11",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

// at least one rolling turn:
"group-rollturn=^2\\.\\d\\.[^1]\\.\\d",
"rollturn-name=Family 2 except 2.x.1.x (rolling turns)",
"rollturn-min=1",

// figure 1.2.5.2 or 5.2.1.4 or 7.2.1.2 or 7.2.2.2 or 8.4.2.2 or 8.4.4.2
"group-int2020special=^(1\\.2\\.5\\.2|5\\.2\\.1\\.4|7\\.2\\.1\\.2|7\\.2\\.2\\.2|8\\.4\\.2\\.2|8\\.4\\.4\\.2)",
"int2020special-name=Figure 1.2.5.2 or 5.2.1.4 or 7.2.1.2 or 7.2.2.2 or 8.4.2.2 or 8.4.4.2",
"int2020special-min=1",

// at least one figure from families 7 and 8:
"fam7-min=1",
"fam8-min=1",

// at least one figure each from sub-family 9.1.x.x to 9.8.x.x
"group-fam91=^9\\.1",
"group-fam92=^9\\.2",
"group-fam94=^9\\.4",
"group-fam98=^9\\.8",
"fam91-name=Family 9.1 (continuous rolls)",
"fam92-name=Family 9.2 (two-point rolls)",
"fam94-name=Family 9.4 (four-point rolls)",
"fam98-name=Family 9.8 (eight-point rolls)",
"fam91-min=1",
"fam92-min=1",
"fam94-min=1",
"fam98-min=1",

// at least two from sub-family 9.9.x.x or 9.10.x.x
"snap-min=2",

// Only one figure from sub-family 9.11.1.x or 9.12.1.x
"spin-min=1",
"spin-max=1",

// At least one opposite roll with elements from sub-family 9.1.x.x to 9.10.x.x.
"opposite-min=1",

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",


//######################################################################################
//##### SAA SPORTSMAN FREE 2020 ########################################################
//######################################################################################
 
"[SAA Sportsman Free]",
"posnl=20",
"k-max=150",
"basefig-max=10",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

// at least one figure from families 2 and 5:
"fam2-min=1",
"fam5-min=1",

// at least one figure from sub-families: 7.4.x.x, 8.4.x.x or 8.8.x.x.
"group-fam748488=^(7\\.4.*|8\\.4.*|8\\.8)",
"fam748488-name=Family 7.4 (whole loops), 8.4 (humpty bumps) or 8.8 (double humpty bumps)",
"fam748488-min=1",

// at least one figure each from sub-family 9.1.x.x to 9.4.x.x
"froll-min=1",
"hroll-min=1",
"qroll-min=1",

// only one figure from sub-family 9.11.1.x
"spin-min=1",
"spin-max=1",

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning"


// last argument has no trailing comma. Now close the rules.push arguments
);
