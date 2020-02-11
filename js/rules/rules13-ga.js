// OpenAero rules13-ga.js file
 
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
 
// This file defines German-Aerobatics (GA) rules for 2013
 
//###############################################################################
//##### GA SPORTSMAN DEFAULT-FREE ###############################################
//###############################################################################
 
rules.push("[German-Aerobatics Sportsman Free]");
 
rules.push("posnl=20");
rules.push("basefig-max=12");
rules.push("k-max=150");
 
rules.push("fam1-min=1");
rules.push("fam2-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("spin-max=1");
rules.push("spin-min=1");
 
rules.push("emptyline-max=0");
 
rules.push("basefig-repeat=1");
rules.push("fam9-repeat=1");
 
rules.push("allow=^[1-9]"); //all figures are allowed for the Free program
 
//###############################################################################
//##### GA INTERMEDIATE FREE ####################################################
//###############################################################################
 
rules.push("[German-Aerobatics Intermediate Free]");
 
rules.push("posnl=30");
rules.push("basefig-max=10");
rules.push("k-max=185");
 
rules.push("fam1-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("froll-min=1");
rules.push("hroll-min=1");
rules.push("qroll-min=1");
rules.push("snap-min=1");
rules.push("spin-max=1");
rules.push("spin-min=1");
 
rules.push("group-roller=^2\\.[1-4]\\.[^1]");
rules.push("roller-name=Rolling turn, family 2.1 to 2.4");
rules.push("roller-min=1");
 
rules.push("emptyline-max=0");
 
rules.push("basefig-repeat=1");
rules.push("fam9-repeat=1");
 
rules.push("opposite-min=1"); //one opposite roll is required!
 
rules.push("allow=^[1-9]"); //all figures are allowed for the Free program
 
