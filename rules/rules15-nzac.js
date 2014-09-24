// OpenAero rules15-nz.js file

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

// This file defines NZAC Recreational/Sports rules for 2015

//###############################################################################
//##### NZAC BASE ###############################################################
//###############################################################################

rules.push("[NZAC Base]");
rules.push("fam1-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
//rules.push("group-fspinrec=^9\\.[11|12]");
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
rules.push("k-max=140");
rules.push("allow=^[1-9]"); //all figures are allowed for the Free program
rules.push("group-frollsport=^9\\.[1234]");
rules.push("frollsport-name=family 9.1-9.4 (roll)");
rules.push("frollsport-min=1");
rules.push("group-fturnsport=^2\\.[12]");
rules.push("fturnsport-name=family 2.1-2.2 (turn)");
rules.push("fturnsport-min=1");
rules.push("group-basefignorept=^[2-8]");
rules.push("basefignorept-repeat=1");
rules.push("fspinrec-name=family 9.11-9.12 (spin)");
rules.push("fspinrec-max=1");
rules.push("more=NZAC Base");

//###############################################################################
//##### NZAC RECREATIONAL FREE ##################################################
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
rules.push("fspinrec-name=family 9.11-9.12 (spin)");
rules.push("fspinrec-max=1");
rules.push("more=NZAC base");

//###############################################################################
//##### NZAC SPORTS UNKNOWN #####################################################
//###############################################################################

rules.push("[NZAC Sports Unknown]");
rules.push("posnl=6");
rules.push("basefig-max=10");
rules.push("basefig-min=8");
rules.push("connectors=4/24")
rules.push("k-max=120");
rules.push("allow=^[1-9]");
rules.push("group-fsnapsport=^9\\.9");
rules.push("fsnapsport-name=family 9.9 (inside snap)");
rules.push("fsnapsport-min=1");
rules.push("fsnapsport-max=2");
rules.push("group-fsharksport=^1\\.2\\.[34]\\.[34]");
rules.push("fsharksport-name=family 1.2.3.3-4/1.2.4.3-4 (shark tooth)");
rules.push("fsharksport-max=1");
rules.push("group-fsharksport=^1\\.2\\.[34]");
rules.push("fsharksport-name=family 1.2.3/1.2.4 (shark tooth)");
rules.push("fsharksport-max=1");
rules.push("group-basefignorept=^[2-8]");
rules.push("basefignorept-repeat=1");
rules.push("fspinrec-name=family 9.11-9.12 (spin)");
rules.push("fspinrec-max=1");
rules.push("combined-repeat=1");
rules.push("1.1.1.1 NOU");
rules.push("1.1.2.1 NR");
rules.push("1.1.2.3 NR");
rules.push("1.1.6.3 OS");
rules.push("1.2.3.1 NR:2");
rules.push("1.2.6.3 OS NR:2 NOU");
rules.push("1.2.7.1 NR:1 NOU");
rules.push("1.3.2.1");
rules.push("2.1.1.1");
rules.push("2.2.1.1");
rules.push("2.3.1.1");
rules.push("2.4.1.1");
rules.push("5.2.1.1 NR:1");
rules.push("7.2.2.1 NR:1");
rules.push("7.3.2.1 NR:2");
rules.push("7.3.3.3 NR:1");
rules.push("7.4.1.1 NR");
rules.push("7.8.4.1");
rules.push("7.8.8.1");
rules.push("8.4.1.1 NR:1");
rules.push("8.5.2.1 NR:2");
rules.push("8.5.6.1 NR:1");
rules.push("8.6.5.1 NR");
rules.push("9.1.2.2");
rules.push("9.1.3.2");
rules.push("9.1.3.4");
rules.push("9.1.4.2");
rules.push("9.1.5.1");
rules.push("9.2.3.4");
rules.push("9.4.3.2");
rules.push("9.4.4.2");
rules.push("9.11.1.4");
rules.push("9.11.1.5");
rules.push("9.11.1.6");

