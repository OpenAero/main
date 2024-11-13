// OpenAero rules-ga.js file
 
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
 
// This file defines German-Aerobatics (GA) rules for 2015

 
//###############################################################################
//##### GA SPORTSMAN DEFAULT-FREE ###############################################
//###############################################################################

rules.push (
"year=2015",
"[German-Aerobatics Sportsman Free]",
 
"posnl=20",
"basefig-max=12",
"k-max=150",
 
"fam1-min=1",
"fam2-min=1",
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
 
"allow=^[1-9]" //all figures are allowed for the Free program
 
//##### GA INTERMEDIATE FREE REMOVED IN 2015 #############################

);
