// OpenAero rules14-nzac.js file

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

//###############################################################################
//##### NZAC BASE ########################################################
//###############################################################################

rules.push("[NZAC Base]");
rules.push("fam1-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("group-fspinrec=^9\\.[11|12]");
rules.push("fspinrec-name=family 9.11-9.12 (spin)");
rules.push("fspinrec-min=1");
rules.push("combined-repeat=1");

//###############################################################################
//##### NZAC SPORTS FREE ########################################################
//###############################################################################

rules.push("[NZAC Sports Free]");
rules.push("posnl=6");
rules.push("basefig-max=12");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("spin-min=1");
rules.push("k-max=136");
rules.push("allow=^[1-9]"); //all figures are allowed for the Free program
rules.push("group-frollsport=^9\\.[1234]");
rules.push("frollsport-name=family 9.1-9.4 (roll)");
rules.push("frollsport-min=1");
rules.push("group-fturnsport=^2\\.[12]");
rules.push("fturnsport-name=family 2.1-2.2 (turn)");
rules.push("fturnsport-min=1");
rules.push("group-basefignorept=^[2-8]");
rules.push("basefignorept-repeat=1");
rules.push("more=NZAC Base");

//###############################################################################
//##### NZAC RECREATIONAL FREE ########################################################
//###############################################################################

rules.push("[NZAC Recreational Free]");
rules.push("posnl=6");
rules.push("basefig-max=12");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("spin-min=1");
rules.push("k-max=93");
rules.push("allow=^[1-9]"); //all figures are allowed for the Free program
rules.push("group-frollrec=^9\\.[1234]");
rules.push("frollrec-name=family 9.1-9.4 (roll)");
rules.push("frollrec-min=1");
rules.push("group-fturnrec=^2\\.[12]");
rules.push("fturnrec-name=family 2.1-2.2 (turn)");
rules.push("fturnrec-min=1");
rules.push("group-basefignorept=^[2-8]");
rules.push("basefignorept-repeat=1");
rules.push("more=NZAC base");
