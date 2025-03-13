// OpenAero rules-sac.js file
 
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
 
// This file defines South-African Aerobatic Club (SAC) rules for 2021

/**
 * 
 * 2024.1.4
 * - Added k-minperfig=10 to Sportsman and RV Free rules
 * 2025.1.3
 * - Added 2025 SAC Intermediate Free Known, which is a copy of
 *   CIVA Intermediate Free Known, but with -h24 changed to dh
 */

rules.push (
"year=2025",
/***********************************************************************
 * SAC SPORTSMAN FREE
 **********************************************************************/
 
"[SAC Sportsman Free]",
 
"posnl=15",
"basefig-max=12",
"k-max=120",
"k-minperfig=10",
 
"fam1-min=1",
"fam5-min=1",
"fam7-min=1",
"fam8-min=1",
"froll-min=1",
"hroll-min=1",
"qroll-min=1",
"spin-max=1",
"spin-min=1",
 
"emptyline-max=0",
 
"basefig-repeat=1",
"fam9-repeat=1",
 
"allow=^[1-9]", //all figures are allowed for the Free program

/***********************************************************************
 * SAC RV FREE
 **********************************************************************/
 
"[SAC RV Free]",

    "posnl=18",
    "basefig-max=10",
    "k-max=120",
    "k-minperfig=10",

    "fam1-min=1",
    "fam5-min=1",
    "fam7-min=1",
    "fam8-min=1",
    "froll-min=1",
    "hroll-min=1",
    "qroll-min=1",

    "emptyline-max=0",

    "basefig-repeat=1",
    "fam9-repeat=1",

    "allow=^[1-9]", //all figures are allowed for the Free program

/***********************************************************************
 * SAC Bald Eagles FREE
 **********************************************************************/
 
"[SAC Bald_Eagles Free]",

"group-vsnap=^9\\.(9|10)\\.[16]\\.",
"vsnap-name=vertically climbing flick(s)",

"posnl=40",
"basefig-max=10",
"k-max=380",

"spin-min=1",
"snap-min=3",
"osnap-min=1",
"vsnap-min=1",

"emptyline-max=0",

"basefig-repeat=1",
"fam9-repeat=1",

"allow=^[1-9]", //all figures are allowed for the Free program

//######################################################################################
//##### SAC INTERMEDIATE FREE KNOWN ###################################################
//######################################################################################

"[SAC Intermediate Free Known]",
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

// "allow=^[1-9]",//all figures are allowed for the Free Programme

"figure-letters=ABCDE",

'reference="@A" mf- "@B" dh "@C" `+1j1 "@D" 2f`rc+` "@E" `+\'2\'rp22',

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

);
