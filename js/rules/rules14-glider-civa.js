// OpenAero rules14-glider-civa.js file

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

// Updates:
// OpenAero 1.3.4
// -Free Unknown rules
// -Advanced allowed figures for Known and Free:8.6.17-24.1-2
// OpenAero 1.3.8
// -infocheck directive for checking presence of Sequence info
// OpenAero 1.4.0
// -updated rules for 2014
// OpenAero 1.4.2
// -corrected rules for 8.6.1-8 column 3&4
// OpenAero 1.4.3.1
// -corrected civa-glider-rules:
//	*corrected Kmax of Free Unknown and Unknowns
//	*Section 6 part II 4.3.4.2 implemented
//	*connectors are down- or upgraded in FREE UNKNOWN only
//	*wrong alert "no roll on 1st element" for 4b3if corrected
//	*wrong alert for repitition of 1.1.1.x corrected
//	*in each Unknown and Free Unknown it is allowed to fly more than one
//	 rolling circle / tailslide / stall-turn / spin / pos. flick / neg. flick /
//	 hes roll / superslow roll as long as catIDs of these figures are not repeated
//	*floating points in Free and Unknowns, but not in Free Unknown
//  *improved detection of upright exit for seqcheck-upend
// OpenAero 1.5.0
// -added figures 2.2.7.1-4 to CIVA Glider rules for Known

//###################################################################################
//################################ CIVA GLIDERS FREE ################################
//###################################################################################

//#######################################################################
rules.push("[glider-CIVA Unlimited Known]");// specific rules for the Unlimited Known program
//#######################################################################

// what info should be filled out
rules.push("infocheck=positioning;harmony");

// Maximum K-Factor acc. to Ch. 4.3.6
//===================================
rules.push("k-max=190");// maximum k-factor including floating points

// Positioning and Harmony k-Factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+10");// positioning k-factor assuming line judges
rules.push("posnl=15+10");// positioning k-factor assuming no line judges
rules.push("poselec=15+10");// positioning k-factor assuming elcetric telemetry

rules.push("more=glider-CIVA Unlimited arestibase");

//######################################################################
rules.push("[glider-CIVA Unlimited Free]");// specific rules for the Unlimited Free program
//######################################################################

// what info should be filled out
rules.push("infocheck=pilot;aircraft;positioning;harmony");

// Super Families
rules.push("sf=^9\\.11\\.:3;^9\\.12\\.:3;^9\\.9\\.:4;^9\\.10\\.:4;^2\\.:2;^5\\.:5;^6\\.:6;^1\\.:7;^3\\.:7;^7\\.:7;^8\\.:7;^0\\.:7");

// Repeations of base-figures acc. to CIVA Section 6 part II Ch. 4.3.3.1 (a)
//==========================================================================
rules.push("basefigex11-repeat=1");// base figures except of 1.1.1. and 9.1
// may not be repeated in sequence
//##hesroll-repeat=1 # hesitation roll elements may not be repeated in sequence
//##spin-repeat=1 # spin elements may not be repeated in sequence
//##snap-repeat=1 # snap roll elements may not be repeated in sequence

// Maximum K-Factor and number of figures acc. to CIVA Section 6 part II Ch. 4.3.3.1 (b)
//======================================================================================
rules.push("k-max=233");	// maximum k-factor including maximum floating points
rules.push("basefig-max=10");	// maximum 10 base figures per sequence
rules.push("floating-point=3");	// 3 points may be reduced

// Versatility acc. to CIVA Section 6 part II Ch. 4.3.3.2
//=======================================================
rules.push("fam5-min=1");// minimum one figure from family 5
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

// 4.3.3.2 a)
//-----------
rules.push("group-roller=^(2\\.1\\.3|2\\.2\\.[2-6]|2\\.3\\.[2-5]|2\\.4\\.[3-8])");// new definition acc. new catIDs
rules.push("roller-name=Rolling Turn with at least one full roll");
rules.push("roller-min=1");

// 4.3.3.2 b)
//-----------
// i)
rules.push("group-froll2=^9\\.1\\.\\d\\.[^1]");
rules.push("froll2-name=no-hesitation roll (9.1.x.x) of at least 1/2 required");
rules.push("froll2-min=1");

// ii)
rules.push("hesroll-min=1");// a hesitation roll of any extent (fam 9.2, 9.4 & 9.8)

// iii)
rules.push("isnap-min=1");// minimum one inside snap roll element

// iv)
rules.push("osnap-min=1");// minimum one outside snap roll element

// Sequence entry and exit attitudes acc. to Ch. 4.3.3.4
//======================================================
rules.push("seqcheck-upend=[\\da-z][~+`'()\"]*>?\\s*$");// Sequence exit must be in positive attitude
rules.push("upend-name=Sequence must end flying upright");

// Positioning and Harmony k-factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+20");// positioning k-factor assuming line judges
rules.push("posnl=15+20");// positioning k-factor assuming no line judges
rules.push("poselec=15+20");// positioning k-factor assuming electric telemetry

rules.push("more=glider-CIVA Unlimited arestibase");

//######################
rules.push("(glider-CIVA Unlimited arestibase)");
//######################
// Allowed Figures for KNOWN and FREE acc. to Ch. 4.3.2.2 (c) # "acc. to the Aresti-System, Glider Version"
//=========================================================================================================
rules.push("1.1.1.1-4");
rules.push("1.1.2.1-4");
rules.push("1.1.3.1-4");
rules.push("1.1.6.1-4");
rules.push("1.1.7.1-4");
rules.push("1.2.1.1-2");
rules.push("1.2.2.1-2");
rules.push("1.2.3.1-4");
rules.push("1.2.4.1-4");
rules.push("1.2.5.1-2");
rules.push("1.2.6.1-3");
rules.push("1.2.7.1-2");
rules.push("1.2.7.4");
rules.push("1.2.8.1-3");
rules.push("1.3.1.2-3");
rules.push("1.3.2.1");
rules.push("1.3.2.4");
rules.push("1.3.3.2-3");
rules.push("1.3.4.1");
rules.push("1.3.4.4");
rules.push("1.3.5.1");
rules.push("1.3.5.3");
rules.push("1.3.6.2");
rules.push("1.3.6.4");
rules.push("1.3.7.1");
rules.push("1.3.7.3");
rules.push("1.3.8.2");
rules.push("1.3.8.4");

rules.push("2.1.1.1-2");
rules.push("2.1.2.1-4");
rules.push("2.1.3.1-4");
rules.push("2.2.1.1-2");
rules.push("2.2.2.1-4");
rules.push("2.2.3.1-4");
rules.push("2.2.4.1-4");
rules.push("2.2.5.1-4");
rules.push("2.2.6.1-4");
// new 1.5.0
rules.push("2.2.7.1-4");
//
rules.push("2.3.1.1-2");
rules.push("2.3.2.1-4");
rules.push("2.3.3.1-4");
rules.push("2.3.4.1-4");
rules.push("2.3.5.1-4");
rules.push("2.4.1.1-2");
rules.push("2.4.3.1-4");
rules.push("2.4.4.1-4");
rules.push("2.4.5.1-4");
rules.push("2.4.6.1-4");
rules.push("2.4.7.1-4");
rules.push("2.4.8.1-4");

rules.push("3.3.1.1-4");

rules.push("5.2.1.1-4");

rules.push("6.2.1.1-4");
rules.push("6.2.2.1-4");

rules.push("7.2.1.1-4");
rules.push("7.2.2.1-4");
rules.push("7.2.3.1-4");
rules.push("7.2.4.1-4");
rules.push("7.3.1.1-4");
rules.push("7.3.2.1-4");
rules.push("7.3.3.1-4");
rules.push("7.3.4.1-4");
rules.push("7.4.1.1-4");
rules.push("7.4.2.1-4");
rules.push("7.4.3.1-4");
rules.push("7.4.4.1-4");
rules.push("7.4.5.1-2");
rules.push("7.4.6.1-2");
rules.push("7.4.7.1-4");
rules.push("7.4.8.1-4");
rules.push("7.4.9.1-4");
rules.push("7.4.10.1-4");
rules.push("7.4.11.1-4");
rules.push("7.4.12.1-4");
rules.push("7.4.13.1-4");
rules.push("7.4.14.1-4");
rules.push("7.5.1.1-4");
rules.push("7.5.2.1-4");
rules.push("7.5.3.1-4");
rules.push("7.5.4.1-4");
rules.push("7.5.5.1-4");
rules.push("7.5.6.1-4");
rules.push("7.5.7.1-4");
rules.push("7.5.8.1-4");
rules.push("7.8.1.1-4");
rules.push("7.8.2.1-4");
rules.push("7.8.3.1-4");
rules.push("7.8.4.1-4");
rules.push("7.8.5.1-4");
rules.push("7.8.6.1-4");
rules.push("7.8.7.1-4");
rules.push("7.8.8.1-4");
rules.push("7.8.9.1-4");
rules.push("7.8.10.1-4");
rules.push("7.8.11.1-4");
rules.push("7.8.12.1-4");
rules.push("7.8.13.1-4");
rules.push("7.8.14.1-4");
rules.push("7.8.15.1-4");
rules.push("7.8.16.1-4");

rules.push("8.4.1.1-4");
rules.push("8.4.2.1-4");
rules.push("8.4.3.1-4");
rules.push("8.4.4.1-4");
rules.push("8.4.13.1-4");
rules.push("8.4.14.1-4");
rules.push("8.4.15.1-4");
rules.push("8.4.16.1-4");
rules.push("8.4.17.1-4");
rules.push("8.4.18.1-4");
rules.push("8.4.19.1-4");
rules.push("8.4.20.1-4");
rules.push("8.5.1.1-4");
rules.push("8.5.2.1-4");
rules.push("8.5.3.1-4");
rules.push("8.5.4.1-4");
rules.push("8.5.5.1-4");
rules.push("8.5.6.1-4");
rules.push("8.5.7.1-4");
rules.push("8.5.8.1-4");
rules.push("8.5.9.1-4");
rules.push("8.5.10.1-4");
rules.push("8.5.11.1-4");
rules.push("8.5.12.1-4");
rules.push("8.5.17.1-4");
rules.push("8.5.18.1-4");
rules.push("8.5.19.1-4");
rules.push("8.5.20.1-4");
rules.push("8.6.1.1-4");
rules.push("8.6.2.1-4");
rules.push("8.6.3.1-4");
rules.push("8.6.4.1-4");
rules.push("8.6.5.1-4");
rules.push("8.6.6.1-4");
rules.push("8.6.7.1-4");
rules.push("8.6.8.1-4");
rules.push("8.6.9.1-4");
rules.push("8.6.10.1-4");
rules.push("8.6.11.1-4");
rules.push("8.6.12.1-4");
rules.push("8.6.13.1-4");
rules.push("8.6.14.1-4");
rules.push("8.6.15.1-4");
rules.push("8.6.16.1-4");
rules.push("8.6.17.1-2");
rules.push("8.6.18.1-2");
rules.push("8.6.19.1-2");
rules.push("8.6.20.1-2");
rules.push("8.6.21.1-2");
rules.push("8.6.22.1-2");
rules.push("8.6.23.1-2");
rules.push("8.6.24.1-2");
rules.push("8.7.1.1");
rules.push("8.7.1.4");
rules.push("8.7.2.3");
rules.push("8.7.3.1");
rules.push("8.7.3.4");
rules.push("8.7.4.3");
rules.push("8.7.5.1-4");
rules.push("8.7.6.1-4");
rules.push("8.7.7.1-4");
rules.push("8.7.8.1-4");
rules.push("8.8.1.1");
rules.push("8.8.1.4");
rules.push("8.8.2.1");
rules.push("8.8.2.4");
rules.push("8.8.3.2");
rules.push("8.8.3.4");
rules.push("8.8.4.2");
rules.push("8.8.4.4");
rules.push("8.8.5.1");
rules.push("8.8.5.3");
rules.push("8.8.6.1");
rules.push("8.8.6.3");
rules.push("8.8.7.2-3");
rules.push("8.8.8.2-3");
rules.push("8.10.1.1-4");
rules.push("8.10.2.1-4");

rules.push("9.1.1.1-2");
rules.push("9.1.2.1-2");
rules.push("9.1.2.4");
rules.push("9.1.3.1-8");
rules.push("9.1.4.1-4");
rules.push("9.1.5.1-3");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.2.4.4");
rules.push("9.4.1.2");
rules.push("9.4.2.2");
rules.push("9.4.3.2-8");
rules.push("9.4.4.2-4");
rules.push("9.4.5.2");
rules.push("9.8.1.1");
rules.push("9.8.2.1-2");
rules.push("9.8.3.1-8");
rules.push("9.8.4.1-2");
rules.push("9.8.5.1-2");
rules.push("9.9.1.2");
rules.push("9.9.2.2-4");
rules.push("9.9.3.2-8");
rules.push("9.9.4.2-8");
rules.push("9.9.5.2-8");
rules.push("9.9.6.2");
rules.push("9.9.7.2");
rules.push("9.9.8.2-8");
rules.push("9.9.9.2-8");
rules.push("9.9.10.2-8");
rules.push("9.10.1.2");
rules.push("9.10.2.2-4");
rules.push("9.10.3.2-8");
rules.push("9.10.4.2-8");
rules.push("9.10.5.2-8");
rules.push("9.10.6.2");
rules.push("9.10.7.2");
rules.push("9.10.8.2-8");
rules.push("9.10.9.2-8");
rules.push("9.10.10.2-8");
rules.push("9.11.1.4-8");
rules.push("9.12.1.4-8");
rules.push("9.13.3.2");
rules.push("9.13.3.4");
rules.push("9.13.3.6");

//###################
rules.push("[glider-CIVA Unlimited Unknown1]");
//###################
rules.push("more=glider-CIVA Unlimited Unknown3");

//######################
rules.push("[glider-CIVA Unlimited FreeUnknown]");
//######################

// what info should be filled out
rules.push("infocheck=positioning;harmony");

// Maximum K-Factor and number of figures acc. to CIVA Section 6 part II Ch. 4.3.6
//================================================================================
rules.push("figure-letters=ABCDEFG");
rules.push("k-max=200");	// 2014 : maximum k-factor + 3 floating points
rules.push("k-min=180");	// 2014 : minimum k-factor
rules.push("basefig-max=7");	// max. 7 base figures per sequence (+ max 2 links)
//rules.push("floating-point=3");	// 3 points may be reduced (4.3.4.6 last sentence -applies to P3,5 and 6 only)
rules.push("connectors=2/10"); 	// max 2 connectors with 10K total

// Positioning and Harmony k-factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+20");// positioning k-factor assuming line judges
rules.push("posnl=15+20");// positioning k-factor assuming no line judges
rules.push("poselec=15+20");// positioning k-factor assuming electric telemetry

// Maximum number of each family
//==============================
//rules.push("fam2-max=1");	outlined in 2014
//rules.push("fam5-max=1");
//rules.push("fam6-max=1");
//rules.push("isnap-max=1");
//rules.push("osnap-max=1");
//rules.push("spin-max=1");

rules.push("more=glider-CIVA Unlimited Unknownbase");

//###################
rules.push("[glider-CIVA Unlimited Unknown2]");
//###################
rules.push("more=glider-CIVA Unlimited Unknown3");

//###################
rules.push("[glider-CIVA Unlimited Unknown3]");

// what info should be filled out
rules.push("infocheck=positioning;harmony");

//###################
// Maximum K-Factor and number of figures acc. to CIVA Section 6 part II Ch. 4.3.6
//================================================================================
rules.push("k-max=193");		// maximum k-factor + maximum floating points
rules.push("k-min=175");		// minimum k-factor
rules.push("basefig-max=9");		// maximum 9 base figures per sequence (7 chosen + max 2 additional)
rules.push("floating-point = 3");	// maximum floating points (4.3.4.6 last sentence)

// Positioning and Harmony k-factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+10");	// positioning k-factor assuming line judges
rules.push("posnl=15+10");	// positioning k-factor assuming no line judges
rules.push("poselec=15+10");	// positioning k-factor assuming electric telemetry

// Maximum number of each family
//==============================
//rules.push("fam2-max=1");	outlined in 2014
//rules.push("fam5-max=1");
//rules.push("fam6-max=1");
//rules.push("isnap-max=1");
//rules.push("osnap-max=1");
//rules.push("spin-max=1");

rules.push("more=glider-CIVA Unlimited Unknownbase");

//###################
rules.push("[glider-CIVA Unlimited Unknown0]");
//###################
rules.push("basefig-max=28");

// 4.3.4.2 Sentence 1:
// "Four figures maximum can be chosen in each of Families 2, 5, 6, 9.9, 9.10 and 9.11/12."

rules.push("fam2-max = 4");
rules.push("fam5-max = 4");
rules.push("fam6-max = 4");
rules.push("isnap-max = 4");
rules.push("osnap-max = 4");
rules.push("spin-max = 4");

// 4.3.4.2. a) In Unlimited, the minimum acceptable K per figure is 15

rules.push("k-minperfig=15");// 2014 : minimum K for every figure

// 4.3.4.2. b) No figure may be selected with a K higher than 40 (AG 35)

rules.push("k-maxperfig=40");// 2014 : maximum K for every figure

// 4.3.4.2. c) In the case of teams which select two or more figures, one must be a reversing figure
//		and the sum of coefficients of the figures proposed by a NAC must not exceed:
//		60 (AG 55) for two figures
//		80 (AG 70) for three figures
//		95 (AG 85) for four figures

// --- unable to implement ---

// 4.3.4.2 d) The same catalogue number may only be used once, except of fam. 9

rules.push("basefig-repeat=1");

rules.push("more=glider-CIVA Unlimited Unknownbase");

//##########################################################################
rules.push("(glider-CIVA Unlimited Unknownbase)");// specific rules for the Unlimited Unknown programs
//##########################################################################

// Definition of global rules
//===========================
//## basic rules "NR", "NF" and "NOU" see basic rules file

//## Opposite slow or hesitation rolls are allowed on horizontal lines
//>>> implemented by rule-NOU

rules.push("rule-NHR=roll:[248]");//## new rule added ### checked
rules.push("why-NHR=no hesitation roll allowed");

// acc. to 9.1.1.22:
// Full horizontal positive flick rolls only at the appex of upward looping figures

rules.push("conv-hpflick=^9\\.9\\.3\\.4=o ; ^9\\.=r ; ^0\\.=z");//## new converions added ### works perfect
rules.push("rule-nfpf=hpflick:o");//## new rule added  ### checked
rules.push("why-nfpf=Rule 9.1.1.22 Full horizontal positive flick rolls only at the appex of upward looping figures!");

// acc. to 9.1.1.23 and acc. to 9.1.1.25::
// Positive half flick on negative line 9.8.8.2 only with figures 7.2.2.2 and 7.2.4.1
// Negative half flick on positive line 9.10.8.2 only with figures 7.2.2.1 and 7.2.4.2

rules.push("conv-fignhf=^9\\.9\\.8\\.2=p ;^9\\.10\\.8\\.2=n ; ^9\\.=r ; ^0\\.=z");//## new conversion added ### checked
rules.push("rule-nhfonl=fignhf: [pn]");//## new rule added  ### checked
rules.push("why-nhfonl=Rule 9.1.1.23/25 Positive/Negative half flick on line 9.9.8.2/9.10.8.2 only with 7.2.2.2 and 7.2.4.1");

rules.push("conv-hnfvd=^9\\.10\\.(5\\.[34]|10\\.[34])=o ; ^9\\.=r ; ^0\\.=z");//## new conversion added ### checked
rules.push("rule-nopushout=hnfvd:o$");
rules.push("why-nopushout=Rule 9.1.1.24 No inverted exit after more than 1/2 negative flick roll vertically down");

// Allowed figures for all Unlimited Unknowns (glider)
//====================================================
//## "figures will be chosen from section 9 of sporting code" (acc. to 4.3.4.1)

// Single Lines
//-------------
rules.push("1.1.1.1-4 nfpf ; nhfonl");
rules.push("1.1.2.1-2 NR");
rules.push("1.1.2.3-4 NOU");
rules.push("1.1.3.1-4 NOU");
rules.push("1.1.6.1  NOU");
rules.push("1.1.6.3  NOU");
rules.push("1.1.6.4  NOU ; nopushout");
rules.push("1.1.7.1  NOU");
rules.push("1.1.7.3  NOU ; nopushout");
rules.push("1.1.7.4  NOU");

// Two Lines
//----------
// no vertical roll in fig. of column 4, or column 2 of 1.2.5-8 ### acc. to Ch. 9.1.1.3
// no hesitation rolls on 45°lines of lines 1.2.5-8  ### acc. to Ch. 9.1.1.4
rules.push("1.2.1.1  NOU ; NR:1");
rules.push("1.2.1.2  NOU  ; NR:1 ; nopushout");
rules.push("1.2.2.1  NOU ; NR:1 ; nopushout");
rules.push("1.2.2.2  NOU ; NR:1");
rules.push("1.2.3.1  NOU");
rules.push("1.2.3.2  NOU ; nopushout");
rules.push("1.2.3.4  NOU  ; NR:2");
rules.push("1.2.4.1  NOU ; nopushout");
rules.push("1.2.4.2  NOU");
rules.push("1.2.4.4  NOU ; NR:2");
rules.push("1.2.5.1  NOU ; NHR:2");
rules.push("1.2.5.2  NOU ; NR:1 ; NHR:2");
rules.push("1.2.6.1  NOU ; NHR:2");
rules.push("1.2.6.2  NOU ; NR:1 ; NHR:2");
rules.push("1.2.7.1  NOU");
rules.push("1.2.7.2  NOU ; NR:1");
rules.push("1.2.8.1  NOU");
rules.push("1.2.8.2  NOU ; NR:1");

// Turns and Rolling Turns
//------------------------
rules.push("2.1.1.1-2");
rules.push("2.1.2.1-4");
rules.push("2.1.3.1-4");
rules.push("2.2.1.1-2");
rules.push("2.2.2.1-3");
rules.push("2.2.3.1-4");
rules.push("2.2.4.1-4");
rules.push("2.2.5.1-4");
rules.push("2.2.6.1-4");
rules.push("2.3.1.1-2");
rules.push("2.4.1.1-2");

// Stall-Turns
//------------
// Rolling elements may only be added where indicated  ### acc. to 9.1.1.5
rules.push("5.2.1.1  NOU");
rules.push("5.2.1.2  NOU ; NR:1 ; nopushout");
rules.push("5.2.1.3  NOU ; nopushout");
rules.push("5.2.1.4  NOU  ; NR:1");

// Tail-Slides
//------------
//Rolling elements may only be added where indicated  ### acc. to 9.1.1.6
rules.push("6.2.1.1  NOU");
rules.push("6.2.1.2  NOU ; NR:1 ; nopushout");
rules.push("6.2.1.3  NOU ; nopushout");
rules.push("6.2.1.4  NOU ; NR:1");
rules.push("6.2.2.1  NOU");
rules.push("6.2.2.2  NOU  ; NR:1 ; nopushout");
rules.push("6.2.2.3  NOU ; nopushout");
rules.push("6.2.2.4  NOU  ; NR:1");

// Immelmann and Split-S
//----------------------
// no flick rolls on entries in 7.2.1-4.1-2 nor on exits in 7.2.1-4.3-4 ### acc. to 9.1.1.7
// no negative flick rolls on 7.2.2.2 or 7.2.4.1    ### acc. to 9.1.1.8
// no positive flick rolls on 7.2.2.1 or 7.2.4.2    ### acc. to 9.1.1.8

rules.push("rule-NNF=roll:S");//## new rule added ### checked
rules.push("why-NNF=no negative flick roll on 7.2.2.2 or 7.2.4.1");
rules.push("rule-NPF=roll:S");//## new rule added ### checked
rules.push("why-NPF=no positive flick roll on 7.2.2.1 or 7.2.4.2");

rules.push("7.2.1.1-2 NF:1 ; nfpf");// Rule 9.1.1.7
rules.push("7.2.1.3-4 NF:2 ; nfpf");// Rule 9.1.1.7
rules.push("7.2.2.1  NF:1 ; NPF:2  ; nfpf");// Rule 9.1.1.7 ; 9.1.1.8
rules.push("7.2.2.2  NF:1 ; NNF:2  ; nfpf");// Rule 9.1.1.7 ; 9.1.1.8
rules.push("7.2.2.3-4 NF:2 ; nfpf ; nhfonl");// Rule 9.1.1.7
rules.push("7.2.3.1-2 NF:1 ; nfpf ; nhfonl");// Rule 9.1.1.7
rules.push("7.2.3.3-4 NF:2 ; nfpf ; nhfonl");
rules.push("7.2.4.1  NF:1 ; NNF:1 ; NNF:2");// Rule 9.1.1.7 ; 9.1.1.8 ; 9.1.1.8
rules.push("7.2.4.2  NF:1 ; NPF:1 ; NPF:2 ; nhfonl");// Rule 9.1.1.7 ; 9.1.1.8 ; 9.1.1.8
rules.push("7.2.4.3-4 NF:2 ; nhfonl");

// Goldfishes
//-----------
rules.push("7.3.1.1-4 NOU");
rules.push("7.3.2.1-4 NOU");
rules.push("7.3.3.1-4 NOU");
rules.push("7.3.4.1-4 NOU");

// Loops
//------
// no rolls on 7.4.1.3-4      ### acc. to 9.1.1.9
// no superslow rolls in 7.4.1.1-2 and 7.4.2.1   ### acc. to 9.1.1.10
// no hesitation roll in 7.4.1.2     ### acc. to 9.1.1.11

rules.push("rule-nossr=roll:t");//## new rule added ### checked
rules.push("why-nossr=no super slow roll allowed");

rules.push("7.4.1.1  nossr");
rules.push("7.4.1.2  NHR ; nossr");
rules.push("7.4.1.3-4 NR");
rules.push("7.4.2.1  nossr");

// horizontal Eights = Full Cuban Eights
//--------------------------------------
// no flick rolls on hor. entries in figures 7.8.1-4.1-2  ### acc. to 9.1.1.12
// no flick rolls on hor. exits in figures 7.8.5-8.1-2  ### acc. to 9.1.1.13
// no rolls on diagonal lines acc. to Ch. 9 page 90
rules.push("7.8.1.1-2 NOU ;NF:1");
rules.push("7.8.1.3-4 NOU ;NR:1 ; NR:2 ; nfpf");
rules.push("7.8.2.1-2 NOU ;NF:1");
rules.push("7.8.2.3-4 NOU ;NR:2 ; nfpf");
rules.push("7.8.3.1-2 NOU ;NF:1");
rules.push("7.8.3.3-4 NOU ;NR:3 ; nfpf");
rules.push("7.8.4.1-2 NOU ;NF:1");
rules.push("7.8.4.4  NOU ;nfpf");
rules.push("7.8.5.1-2 NOU ;NR:1 ; NR:2 ; NF:3");
rules.push("7.8.5.3-4 NOU ;nfpf");
rules.push("7.8.6.1-2 NOU ;NR:1 ; NF:3");
rules.push("7.8.6.3-4 NOU ;NR:3 ; nfpf");//##### Anfrage bei Manfred
rules.push("7.8.7.1-2 NOU ;NR:2 ; NF:3");
rules.push("7.8.7.3-4 NOU ;nfpf");
rules.push("7.8.8.1  NOU ;NF:3");
rules.push("7.8.8.3-4 NOU ;nfpf");

// Super-Eights
//-------------
// no rolls on diagonal lines acc. to Ch. 9 page 91
rules.push("7.8.9.1-2 NOU ;NR:1 ; NR:2 ; NR:3");
rules.push("7.8.9.3-4 NOU");
rules.push("7.8.10.1-2 NOU ;NR:2 ; NR:3");
rules.push("7.8.10.3-4 NOU");
rules.push("7.8.11.1-2 NOU ;NR:1 ; NR:3");
rules.push("7.8.11.3-4 NOU");
rules.push("7.8.12.1-2 NOU ;NR:1 ; NR:2");
rules.push("7.8.12.3-4 NOU");
rules.push("7.8.13.4 NOU ;NR:3");
rules.push("7.8.14.3-4 NOU ;NR:2");
rules.push("7.8.15.3 NOU");
rules.push("7.8.16.4 NOU");

// Humpty-Bumps
//-------------
rules.push("8.4.1.1 NOU");
rules.push("8.4.1.2 NOU ; NR:1 ; nopushout"); 	// 2014 : upward roll not allowed
rules.push("8.4.2.1 NOU ; nopushout");
rules.push("8.4.2.2 NOU ; NR:1");		// 2014 : upward roll not allowed
rules.push("8.4.3.1 NOU");
rules.push("8.4.3.2 NOU ; nopushout");
rules.push("8.4.4.1 NOU ; nopushout");
rules.push("8.4.4.2 NOU");

// Diagonal bumps
//---------------
// no flick rolls on diagonal down lines in 8.4.15-16.2, 8.4.17-18.1 ### acc. to 9.1.1.14
// no rolls on lines acc. to Ch. 9 page 92 and 93
rules.push("8.4.13.1-2 NOU ; NR:1");
rules.push("8.4.14.1-2 NOU ; NR:1");
rules.push("8.4.15.1 NOU");
rules.push("8.4.15.2 NOU ; NF:2");
rules.push("8.4.15.3-4 NOU ; NR:2");
rules.push("8.4.16.1 NOU");
rules.push("8.4.16.2 NOU ; NF:2");
rules.push("8.4.16.4 NOU");
rules.push("8.4.17.1 NOU ; NF:2 ; NR:1");
rules.push("8.4.17.2 NOU ; NR:1");
rules.push("8.4.17.3 NOU ; NR:2");
rules.push("8.4.18.1 NOU ; NF:2");
rules.push("8.4.18.2 NOU ; NR:1");
rules.push("8.4.18.3 NOU");

// Half Cuban Eight, diagonal lines first
//---------------------------------------
// no flick rolls on hor. exits in fig. 8.5.1-4.1-2   ### acc. to 9.1.1.15
// no rolls on lines acc. to Ch. 9 page 93
rules.push("8.5.1.1-2 NF:2 ; NR:1 ; nfpf");
rules.push("8.5.1.3-4 NOU:1 ; nfpf");
rules.push("8.5.2.1-2 NOU:1 ; NF:2 ; nfpf");
rules.push("8.5.2.3-4 NOU:1 ; nfpf");
rules.push("8.5.3.1-2 NF:2  ; NR:1");
rules.push("8.5.3.3-4 nhfonl");
rules.push("8.5.4.1-2 NOU:1 ; NF:2");
rules.push("8.5.4.3-4 NOU:1 ; nhfonl");

// Half Cuban Eight, diagonal lines last
//--------------------------------------
// no flick rolls on hor. entries in fig. 8.5.5-8.1-2   ### acc. to 9.1.1.16
// no rolls on lines acc. to Ch. 9 page 94
rules.push("8.5.5.1-2 NF:1 ; NOU:2 ; nfpf");
rules.push("8.5.5.3-4 NR:2 ; nfpf");
rules.push("8.5.6.1-2 NF:1 ; NOU:2 ; nfpf");
rules.push("8.5.6.3-4 NOU:2 ; nfpf");
rules.push("8.5.7.1-2 NF:1 ; NOU:2");
rules.push("8.5.7.3-4 NR:2");
rules.push("8.5.8.1-2 NF:1 ; NOU:2");
rules.push("8.5.8.3-4 NOU:2");

// P-Loops with full rolls in appex
//---------------------------------
// no superslow rolls in the top of 8.6.1|3.1    ### acc. to 9.1.1.17
// no rolls on top of 8.6.1|3.1 after roll on the up line  ### acc. to 9.1.1.18
// no rolls on lines acc. to Ch. 9 page 94-95
// no superslow rolls in the top of 8.6.5-8.1-2    ### acc. to 9.1.1.19
// no flicks on vert. down lines in 8.6.5-8.1-2 after hesitation in loop ### acc. to 9.1.1.20

rules.push("rule-NLRAULR=roll: [12348fFSt] ([12348fFSt])");//## new rule added ### checked
rules.push("why-NLRAULR=no rolls on top of loop after roll on up line (see Ch. 9.1.1.18)");

rules.push("rule-NFALHR=roll: (.,.|[248]) [fFS]$");//## new rule added ### checked
rules.push("why-NFALHR=no flick roll on vertical down line after hesitation roll in loop segment");

rules.push("8.6.1.1  nossr:2 ; NLRAULR ; NOU:1 ; NOU:2 ; nfpf:3");
rules.push("8.6.1.4  NOU:1  ; nfpf:3");
rules.push("8.6.2.1  NR:1 ; NR:2  ; nhfonl");
rules.push("8.6.2.4  NOU:1");
rules.push("8.6.3.1  nossr:2 ; NLRAULR  ; NOU:1 ; NOU:2 ; nfpf:3");
rules.push("8.6.3.3  NOU:1  ; nfpf:3");
rules.push("8.6.4.1  NR:1 ; NR:2  ; nhfonl");
rules.push("8.6.4.3  NOU:1  ; nhfonl");
rules.push("8.6.5.1  nossr:2 ; NFALHR  ; NOU:2 ; NOU:3 ; nfpf:1");
rules.push("8.6.5.4  NOU:2  ; nfpf:1");
rules.push("8.6.6.1  nossr:2 ; NFALHR  ; NOU:2 ; NOU:3 ; nfpf:1 ; nopushout");
rules.push("8.6.6.2  nossr:2 ; NFALHR  ; NOU:2 ; NOU:3 ; nfpf:1");
rules.push("8.6.6.4  NOU:2  ; nfpf:1");
rules.push("8.6.7.2  nossr:2 ; NFALHR  ; NOU:2 ; NOU:3 ; nhfonl");
rules.push("8.6.7.3  NOU:2  ; nhfonl");
rules.push("8.6.8.1  nossr:2 ; NFALHR  ; NOU:2 ; NOU:3 ; nhfonl");
rules.push("8.6.8.2  nossr:2 ; NFALHR  ; NOU:2 ; NOU:3 ; nhfonl ; nopushout");
rules.push("8.6.8.3  NOU:2  ; nhfonl");

// "reversing P-Loops" or Porpoise
//--------------------------------
// no rolls on lines acc. to Ch. 9 page 96
rules.push("8.6.13.1 NR:1 ; NR:2 ; NOU:3");
rules.push("8.6.13.2 NR:1 ; NR:2 ; NOU:3 ; nopushout");
rules.push("8.6.13.3 NR:1 ; NR:2 ; NOU:3");
rules.push("8.6.14.1 NR:1 ; NR:2 ; NOU:3 ; nopushout");
rules.push("8.6.14.2 NR:1 ; NR:2 ; NOU:3");
rules.push("8.6.14.3 NR:1 ; NR:2 ; NOU:3");

// P-Loops with half rolls in appex
//---------------------------------
// none taken to section 6 version 2013

// Q-Loops
//--------
// no hesitation rolls on top of 8.7.5|6.2    ### acc. to 9.1.1.21
// no rolls on lines acc. to Ch. 9 page 96
rules.push("8.7.5.1  NOU:2 ; NOU:3 ; nfpf:1");
rules.push("8.7.5.2  NHR:2 ; NOU:2 ; NOU:3 ; nfpf:1");
rules.push("8.7.5.4  NR:2 ; NR:3 ; nfpf:1");
rules.push("8.7.6.1  NOU:2 ; NOU:3 ; nfpf:1");
rules.push("8.7.6.2  NHR:2 ; NOU:2 ; NOU:3 ; nfpf:1");
rules.push("8.7.6.4  NR:2 ; NOU:3 ; nfpf:1");

// Rolls
//------
rules.push("9.1.1.1");
rules.push("9.1.2.2");
rules.push("9.1.3.2");
rules.push("9.1.3.4");
rules.push("9.1.3.6");
rules.push("9.1.3.8");
rules.push("9.1.4.2");
rules.push("9.1.4.4");
rules.push("9.1.5.1-2");

rules.push("9.2.3.4");

rules.push("9.4.2.2");
rules.push("9.4.3.2");
rules.push("9.4.3.4");
rules.push("9.4.4.2");

rules.push("9.8.3.2");

rules.push("9.9.2.2");
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.9.4.2");
rules.push("9.9.4.4");
rules.push("9.9.5.2-4");
rules.push("9.9.8.2");
rules.push("9.9.10.2-4");

rules.push("9.10.2.2");
rules.push("9.10.3.2");
rules.push("9.10.4.2");
rules.push("9.10.4.4");
rules.push("9.10.5.2-4");
rules.push("9.10.8.2");
rules.push("9.10.10.2-4");

rules.push("9.11.1.4-6");

rules.push("9.12.1.4-6");

rules.push("9.13.3.2");
rules.push("9.13.3.4");

//########################################################################################

//#################### End of Rules for GLIDER UNLIMITED #################################

//########################################################################################

//#######################################################################
rules.push("[glider-CIVA Advanced Known]");// specific rules for the Advanced Known program
//#######################################################################

// what info should be filled out
rules.push("infocheck=positioning;harmony");

// Maximum K-Factor acc. to Ch. 4.3.6
//===================================
rules.push("k-max=145");// maximum k-factor including floating points

// Positioning and Harmony k-Factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+10");// positioning k-factor assuming line judges
rules.push("posnl=15+10");// positioning k-factor assuming no line judges
rules.push("poselec=15+10");// positioning k-factor assuming elcetric telemetry

rules.push("more=glider-CIVA Advanced arestibase");

//######################################################################
rules.push("[glider-CIVA Advanced Free]");// specific rules for the Advanced Free program
//######################################################################

// what info should be filled out
rules.push("infocheck=pilot;aircraft;positioning;harmony");

// Super Families
rules.push("sf=^9\\.11\\.:3;^9\\.12\\.:3;^9\\.9\\.:4;^9\\.10\\.:4;^2\\.:2;^5\\.:5;^6\\.:6;^1\\.:7;^3\\.:7;^7\\.:7;^8\\.:7;^0\\.:7");

// Repeations of base-figures acc. to CIVA Section 6 part II Ch. 4.3.3.1 (a)
//==========================================================================
rules.push("basefigex11-repeat=1");// base figures except of 1.1.1. and 9.1  ### Checken!!!
// may not be repeated in sequence

// Maximum K-Factor and number of figures acc. to CIVA Section 6 part II Ch. 4.3.3.1 (b)
//======================================================================================
rules.push("k-max=178");	// 2014 : maximum k-factor + maximum floating points
rules.push("basefig-max=10");	// maximum 10 base figures per sequence
rules.push("floating-point=3");	// 3 points may be reduced

// Versatility acc. to CIVA Section 6 part II Ch. 4.3.3.3
//=======================================================
rules.push("fam5-min=1");// minimum one figure from family 5
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");

// 4.3.3.3 a)
//-----------
rules.push("group-roller=^(2\\.[1-4]\\.1|2\\.1\\.3\\.1)");// new definition acc. new catIDs
// 2014 : requirement for roller deleted
//rules.push("roller-name=Turn with at least 90&deg; or 2.1.3.1");
//rules.push("roller-min=1");

// 4.3.3.3 b)
//-----------
// i)
rules.push("group-froll2=^9\\.1\\.\\d\\.[^1]");
rules.push("froll2-name=no-hesitation roll at least 1/2");
rules.push("froll2-min=1");

// ii)
rules.push("hesroll-min=1");// a hesitation roll of any extent

// Sequence entry and exit attitudes acc. to Ch. 4.3.3.4
//======================================================
rules.push("seqcheck-upend=[\\da-z][~+`'()\"]*>?\\s*$");// Sequence exit must be in positive attitude
rules.push("upend-name=Sequence must end flying upright (Section 6, Ch. 4.3.3.4)");

// Positioning and Harmony k-factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+20");// positioning k-factor assuming line judges
rules.push("posnl=15+20");// positioning k-factor assuming no line judges
rules.push("poselec=15+20");// positioning k-factor assuming electric telemetry

rules.push("more=glider-CIVA Advanced arestibase");

//#####################
rules.push("(glider-CIVA Advanced arestibase)");
//#####################
// Allowed Figures for KNOWN and FREE acc. to Ch. 4.3.2.2 (c) # "acc. to the Aresti-System, Glider Version"
//=========================================================================================================
//no full negative loops, no high speed negative part loops of more than 45°
rules.push("1.1.1.1-4");
rules.push("1.1.2.1-4");
rules.push("1.1.3.1-4");
rules.push("1.1.6.1");
rules.push("1.1.6.3");
rules.push("1.1.7.1");
rules.push("1.1.7.4");
rules.push("1.2.1.1");
rules.push("1.2.2.2");
rules.push("1.2.3.1");
rules.push("1.2.3.4");
rules.push("1.2.4.2");
rules.push("1.2.4.4");
rules.push("1.2.5.1");
rules.push("1.2.6.1");
rules.push("1.2.6.3");
rules.push("1.2.7.1");
rules.push("1.2.7.4");
rules.push("1.2.8.1");
rules.push("1.2.8.3");
rules.push("1.3.1.2-3");
rules.push("1.3.2.1");
rules.push("1.3.2.4");
rules.push("1.3.3.2-3");
rules.push("1.3.4.1");
rules.push("1.3.4.4");
rules.push("1.3.5.1");
rules.push("1.3.5.3");
rules.push("1.3.6.2");
rules.push("1.3.6.4");
rules.push("1.3.7.1");
rules.push("1.3.7.3");
rules.push("1.3.8.2");
rules.push("1.3.8.4");

//no rolling turns except 2.1.3.1 in Free programs
rules.push("2.1.1.1-2");
rules.push("2.1.3.1");
rules.push("2.2.1.1-2");
rules.push("2.3.1.1-2");
rules.push("2.4.1.1-2");

rules.push("3.3.1.1-2");//## what exactly is "high speed"?
rules.push("3.3.1.4");

rules.push("5.2.1.1");

rules.push("6.2.1.1");
rules.push("6.2.2.1");

rules.push("7.2.1.1");
rules.push("7.2.1.4");
rules.push("7.2.2.1");
rules.push("7.2.2.4");
rules.push("7.2.3.2-3");
rules.push("7.2.4.2-3");
rules.push("7.3.1.2-3");
rules.push("7.3.2.1");
rules.push("7.3.2.4");
rules.push("7.3.3.2-3");
rules.push("7.3.4.1");
rules.push("7.3.4.4");
rules.push("7.4.1.1");
rules.push("7.4.1.4");
rules.push("7.4.3.1");
rules.push("7.4.3.4");
rules.push("7.4.5.1");
rules.push("7.4.6.1");
rules.push("7.4.7.4");
rules.push("7.4.8.4");
rules.push("7.4.9.3");
rules.push("7.4.10.3");
rules.push("7.4.11.3");
rules.push("7.4.12.3");
rules.push("7.4.13.4");
rules.push("7.4.14.4");
rules.push("7.5.2.1");
rules.push("7.5.2.4");
rules.push("7.5.5.2-3");
rules.push("7.5.7.1");
rules.push("7.5.7.4");
rules.push("7.5.8.2-3");
rules.push("7.8.3.1");
rules.push("7.8.3.4");
rules.push("7.8.4.1");
rules.push("7.8.4.4");
rules.push("7.8.6.2-3");
rules.push("7.8.8.1");
rules.push("7.8.8.4");
rules.push("7.8.11.2-3");
rules.push("7.8.13.1");
rules.push("7.8.13.4");
rules.push("7.8.15.2-3");
rules.push("7.8.16.1");
rules.push("7.8.16.4");

rules.push("8.4.1.1");
rules.push("8.4.1.4");
rules.push("8.4.2.4");
rules.push("8.4.3.1");
rules.push("8.4.3.3");
rules.push("8.4.4.3");
rules.push("8.4.13.1-2");//## what exactly is "high speed"?
rules.push("8.4.13.4");
rules.push("8.4.14.1-2");//## what exactly is "high speed"?
rules.push("8.4.14.4");
rules.push("8.4.15.1-2");//## what exactly is "high speed"?
rules.push("8.4.15.4");
rules.push("8.4.16.1-2");//## what exactly is "high speed"?
rules.push("8.4.16.4");
rules.push("8.4.17.1-3");//## what exactly is "high speed"?
rules.push("8.4.18.1-3");//## what exactly is "high speed"?
rules.push("8.4.19.1-3");//## what exactly is "high speed"?
rules.push("8.4.20.1-3");//## what exactly is "high speed"?
rules.push("8.5.1.2-3");
rules.push("8.5.2.1");
rules.push("8.5.2.4");
rules.push("8.5.3.2-3");
rules.push("8.5.4.1");
rules.push("8.5.4.4");
rules.push("8.5.5.1");
rules.push("8.5.5.4");
rules.push("8.5.6.1");
rules.push("8.5.6.4");
rules.push("8.5.7.2-3");
rules.push("8.5.8.2-3");
rules.push("8.5.9.1");
rules.push("8.5.9.4");
rules.push("8.5.10.2");
rules.push("8.5.10.4");
rules.push("8.5.11.1");
rules.push("8.5.11.3");
rules.push("8.5.12.2-3");
rules.push("8.5.17.1");
rules.push("8.5.17.4");
rules.push("8.5.18.1");
rules.push("8.5.18.4");
rules.push("8.5.19.1");
rules.push("8.5.19.3");
rules.push("8.5.20.1");
rules.push("8.5.20.3");
rules.push("8.6.1.1");
rules.push("8.6.1.4");
rules.push("8.6.2.1");
rules.push("8.6.2.4");
rules.push("8.6.3.3");
rules.push("8.6.4.3");
rules.push("8.6.5.1");
rules.push("8.6.5.4");
rules.push("8.6.6.4");
rules.push("8.6.7.2-3");
rules.push("8.6.8.3");
rules.push("8.6.9.4");
rules.push("8.6.10.4");
rules.push("8.6.11.1");
rules.push("8.6.11.3");
rules.push("8.6.12.1");
rules.push("8.6.12.3");
rules.push("8.6.13.1");
rules.push("8.6.13.4");
rules.push("8.6.14.3");
rules.push("8.6.15.2");
rules.push("8.6.15.4");
rules.push("8.6.16.4");
rules.push("8.6.17.1-2");
rules.push("8.6.18.1-2");
rules.push("8.6.19.1-2");
rules.push("8.6.20.1-2");
rules.push("8.6.21.1-2");
rules.push("8.6.22.1-2");
rules.push("8.6.23.1-2");
rules.push("8.6.24.1-2");
rules.push("8.7.1.1");
rules.push("8.7.1.4");
rules.push("8.7.2.3");
rules.push("8.7.3.1");
rules.push("8.7.3.4");
rules.push("8.7.4.3");
rules.push("8.7.5.1");
rules.push("8.7.5.4");
rules.push("8.7.6.1");
rules.push("8.7.6.4");
rules.push("8.7.7.2-3");
rules.push("8.7.8.2-3");
rules.push("8.8.1.1");
rules.push("8.8.1.4");
rules.push("8.8.2.1");
rules.push("8.8.3.4");
rules.push("8.8.5.1");
rules.push("8.8.6.1");
rules.push("8.8.6.3");
rules.push("8.8.8.3");
rules.push("8.10.2.4");

//no rolls vertically up, no more than 1/4 roll vertical down, no flicks, no inverted spins

rules.push("9.1.2.1-2");
rules.push("9.1.2.4");
rules.push("9.1.3.1-8");
rules.push("9.1.4.1-4");
rules.push("9.1.5.1");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.2.4.4");
rules.push("9.4.2.2");
rules.push("9.4.3.2-8");
rules.push("9.4.4.2-4");
rules.push("9.8.2.1-2");
rules.push("9.8.3.1-8");
rules.push("9.8.4.1-2");
rules.push("9.8.5.1");
rules.push("9.11.1.4-8");
rules.push("9.13.3.2");
rules.push("9.13.3.4");
rules.push("9.13.3.6");

//###################
rules.push("[glider-CIVA Advanced Unknown1]");
//###################

rules.push("more=glider-CIVA Advanced Unknown3");

//######################
rules.push("[glider-CIVA Advanced FreeUnknown]");

// what info should be filled out
rules.push("infocheck=positioning;harmony");

//######################
// Maximum K-Factor and number of figures acc. to CIVA Section 6 part II Ch. 4.3.6
//================================================================================
rules.push("figure-letters=ABCDEFG");
rules.push("k-max=160");		// 2014 : maximum k-factor without maximum floating points
rules.push("k-min=140");		// 2014 : minimum k-factor
rules.push("basefig-max=7");		// maximum 7 base figures per sequence (max 2 links)
//rules.push("floating-point=3");	// 2014: 3 points may be reduced (4.3.4.6 last sentence - applies on P3,5 and 6 only)
rules.push("connectors=2/10");		// max 2 connectors with 10K total

// Positioning and Harmony k-factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+20");// positioning k-factor assuming line judges
rules.push("posnl=15+20");// positioning k-factor assuming no line judges
rules.push("poselec=15+20");// positioning k-factor assuming electric telemetry

// Sequence exit must be positive upright acc. to Ch. 4.3.4.8
//===========================================================
rules.push("seqcheck-upend=[\\da-z][~+`'()\"]*>?\\s*$");// Sequence exit must be in positive attitude
rules.push("upend-name=Sequence must end flying upright (Section 6, Ch. 4.3.4.8)");


rules.push("more=glider-CIVA Advanced Unknownbase");

//###################
rules.push("[glider-CIVA Advanced Unknown2]");
//###################
rules.push("more=glider-CIVA Advanced Unknown3");

//###################
rules.push("[glider-CIVA Advanced Unknown3]");

// what info should be filled out
rules.push("infocheck=positioning;harmony");

//###################
// Maximum K-Factor and number of figures acc. to CIVA Section 6 part II Ch. 4.3.6
//================================================================================
rules.push("k-max=148");		// maximum k-factor including maximum floating points
rules.push("k-min=130");		// minimum k-factor
rules.push("basefig-max=9");		// maximum 9 base figures per sequence (7 chosen + max 2 additional)
rules.push("floating-point=3");		// 3 points may be reduced

// Positioning and Harmony k-factors acc. to Ch. 4.3.6
//====================================================
rules.push("poslj=15+10");	// positioning k-factor assuming line judges
rules.push("posnl=15+10");	// positioning k-factor assuming no line judges
rules.push("poselec=15+10");	// positioning k-factor assuming electric telemetry

rules.push("more=glider-CIVA Advanced Unknownbase");

//###################
rules.push("[glider-CIVA Advanced Unknown0]");
//###################
rules.push("basefig-max=28");
rules.push("basefig-min=28");

// 4.3.4.2 Four figures maximum can be chosen in each of Families 2,5,6,9.9,9.10,9.11/12

rules.push("fam2-max=4");	// max 4 of fam 2
rules.push("fam5-max=4");	// max 4 of fam 5
rules.push("fam6-max=4");	// max 4 of fam 6
rules.push("spin-max=4");	// max 4 of spins

// 4.3.4.2 b) No figure may be selected with a K higher than 40 (AG 35).

rules.push("k-maxperfig=35");

// 4.3.4.2 d) The same catalogue number cannot be chosen again except for Family 9 ("AG"
//		Families 5, 6 and 9)

rules.push("group-basefigex569=^([1-4]|[7-8])");
rules.push("basefigex569-name=base figures except, fam 5, 6 and 9");
rules.push("basefigex569-repeat=1");

rules.push("more=glider-CIVA Advanced Unknownbase");

//##########################################################################
rules.push("(glider-CIVA Advanced Unknownbase)");// specific rules for the Advanced Unknown programs
//##########################################################################

// Definition of global rules
//===========================
//## basic rules "NR", "NF" and "NOU" see basic rules file

//## Opposite slow or hesitation rolls are allowed on horizontal lines
//>>> implemented by rule-NOU

rules.push("rule-NHR=roll:[248]");//## new rule added ### checked
rules.push("why-NHR=no hesitation roll allowed");

// Allowed figures for all Unlimited Unknowns (glider)
//====================================================
//## "figures will be chosen from section 9 of sporting code" (acc. to 4.3.4.1)

// Single Lines
//-------------
rules.push("1.1.1.1-4");
rules.push("1.1.2.1-4 NR");
rules.push("1.1.3.1-4 NOU");
rules.push("1.1.6.1  NR");
rules.push("1.1.6.3  NOU");
rules.push("1.1.7.1  NR");
rules.push("1.1.7.4  NOU");

// Two Lines
//----------
// no vertical roll in fig. of column 4, or column 2 of 1.2.5-8 ### acc. to Ch. 9.1.1.3
// no hesitation rolls on 45°lines of lines 1.2.5-8  ### acc. to Ch. 9.1.1.4
rules.push("1.2.1.1  NOU ; NR:1");
rules.push("1.2.2.2  NOU ; NR:1");
rules.push("1.2.3.1  NOU");
rules.push("1.2.3.4  NOU  ; NR:2");
rules.push("1.2.4.2  NOU");
rules.push("1.2.4.4  NOU ; NR:2");
rules.push("1.2.5.1  NR");
rules.push("1.2.6.1  NR");
rules.push("1.2.7.1  NR:1 ; NOU");
rules.push("1.2.8.1  NR:1 ; NOU");

// Turns and Rolling Turns
//------------------------
rules.push("2.1.1.1-2");
rules.push("2.2.1.1-2");
rules.push("2.3.1.1-2");
rules.push("2.4.1.1-2");

// Stall-Turns
//------------
// Rolling elements may only be added where indicated  ### acc. to 9.1.1.5
rules.push("5.2.1.1  NR:1 ; NOU");

// Tail-Slides
//------------
//Rolling elements may only be added where indicated  ### acc. to 9.1.1.6
rules.push("6.2.1.1  NR:1 ; NOU");
rules.push("6.2.2.1  NR:1 ; NOU");

// Immelmann and Split-S
//----------------------
rules.push("7.2.1.1");
rules.push("7.2.1.4");
rules.push("7.2.2.1");
rules.push("7.2.2.4");
rules.push("7.2.3.2-3");
rules.push("7.2.4.2-3");

// Goldfishes
//-----------
rules.push("7.3.1.2-3 NR");
rules.push("7.3.2.1  NR:2 ; NOU");
rules.push("7.3.2.4  NR:2 ; NOU");
rules.push("7.3.3.2-3 NR:1 ; NOU");
rules.push("7.3.4.1  NOU");
rules.push("7.3.4.4  NOU");

// Loops
//------
// no roll on 7.4.1.4      ### acc. to 9.1.1.9
// no superslow roll in 7.4.1.1-2 and 7.4.2.1   ### acc. to 9.1.1.10
// no hesitation roll in 7.4.1.2     ### acc. to 9.1.1.11

rules.push("rule-nossr=roll:t");//## new rule added ### checked
rules.push("why-nossr=no super slow roll allowed");

rules.push("7.4.1.1  nossr");
rules.push("7.4.1.4  NR");

// horizontal Eights = Full Cuban Eights
//--------------------------------------
// no rolls on diagonal lines acc. to Ch. 9 page 90
rules.push("7.8.3.1  NR:3 ; NOU");
rules.push("7.8.3.4  NR:3 : NOU");
rules.push("7.8.4.1  NOU");
rules.push("7.8.4.4  NOU");
rules.push("7.8.6.2  NR:1 ; NOU");
rules.push("7.8.6.3  NR:1 ; NR:3 ; NOU");
rules.push("7.8.8.1  NOU");
rules.push("7.8.8.4  NOU");

// Super-Eights
//-------------
// no rolls on diagonal lines acc. to Ch. 9 page 91
rules.push("7.8.11.2-3 NOU ;NR:1 ; NR:3");
rules.push("7.8.15.3 NOU");

// Humpty-Bumps
//-------------
rules.push("8.4.1.1  NR:1 ; NOU");
rules.push("8.4.3.1  NR:1 ; NOU");

// Diagonal bumps
//---------------
// no rolls on lines acc. to Ch. 9 page 92 and 93
rules.push("8.4.13.1  NR");
rules.push("8.4.14.1  NOU ; NR:1");
rules.push("8.4.15.1  NOU ; NR:2");
rules.push("8.4.15.4  NOU ; NR:2");
rules.push("8.4.16.1  NOU");
rules.push("8.4.16.4  NOU");
rules.push("8.4.17.2-3 NR");
rules.push("8.4.18.2-3 NOU  ; NR:1");

// Half Cuban Eight, diagonal lines first
//---------------------------------------
// no rolls on lines acc. to Ch. 9 page 93
rules.push("8.5.1.2-3 NR:1");
rules.push("8.5.2.1  NOU:1");
rules.push("8.5.2.4  NOU:1");
rules.push("8.5.3.2-3 NR:1");
rules.push("8.5.4.1  NOU:1");
rules.push("8.5.4.4  NOU:1");

// Half Cuban Eight, diagonal lines last
//--------------------------------------
// no rolls on lines acc. to Ch. 9 page 94
rules.push("8.5.5.1  NR:2");
rules.push("8.5.5.4  NR:2");
rules.push("8.5.6.1  NOU:2");
rules.push("8.5.6.4  NOU:2");
rules.push("8.5.7.2-3 NR:2");
rules.push("8.5.8.2-3 NOU:2");

// P-Loops
//--------
// no superslow rolls in the top of 8.6.1|3.1    ### acc. to 9.1.1.17
// no rolls on top of 8.6.1|3.1 after roll on the up line  ### acc. to 9.1.1.18
// no rolls on lines acc. to Ch. 9 page 94-95
// no superslow rolls in the top of 8.6.5-8.1-2    ### acc. to 9.1.1.19

rules.push("8.6.1.1  NR:1 ; NR:2");
rules.push("8.6.1.4  NOU:1");
rules.push("8.6.2.1  NR:1 ; NR:2");
rules.push("8.6.2.4  NR:1");
rules.push("8.6.3.3  NOU:1");
rules.push("8.6.4.3  NOU:1");
rules.push("8.6.5.1  nossr:2 ; NOU:2 ; NOU:3");
rules.push("8.6.5.4  NR:2");
rules.push("8.6.6.4  NR:2");
rules.push("8.6.7.2  nossr:2 ; NOU:2 ; NOU:3");
rules.push("8.6.7.3  NR:2");
rules.push("8.6.8.3  NR:2");

// "reversing P-Loops" or Porpoise
//--------------------------------
// no rolls on lines acc. to Ch. 9 page 96
rules.push("8.6.13.1  NR:1 ; NR:2 ; NOU:3");
rules.push("8.6.13.3  NR");
rules.push("8.6.14.3  NR");

// Q-Loops
//--------
// no hesitation rolls on top of 8.7.5|6.2    ### acc. to 9.1.1.21
// no rolls on lines acc. to Ch. 9 page 96
rules.push("8.7.5.1  NOU:2 ; NR:3");
rules.push("8.7.5.4  NR:2 ; NR:3");

// Rolls
//------
rules.push("9.1.2.2");
rules.push("9.1.3.2");
rules.push("9.1.3.4");
rules.push("9.1.3.6");
rules.push("9.1.3.8");
rules.push("9.1.4.2");
rules.push("9.1.5.1");

rules.push("9.2.3.4");

rules.push("9.4.2.2");
rules.push("9.4.3.2");
rules.push("9.4.3.4");
rules.push("9.4.4.2");

rules.push("9.8.3.2");

rules.push("9.11.1.4-6");

rules.push("9.13.3.2");
rules.push("9.13.3.4");

//######################################################################

//################### End of GLIDER ADVANCED Rules #####################

//######################################################################
