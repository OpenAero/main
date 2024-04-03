// OpenAero rules24-sac.js file
 
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
 * 
 */

rules.push (
 
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

"allow=^[1-9]" //all figures are allowed for the Free program

);
