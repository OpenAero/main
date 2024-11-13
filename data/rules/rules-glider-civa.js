// OpenAero rules-glider-civa.js file

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
Updates:
OpenAero 1.3.4
-Free Unknown rules
-Advanced allowed figures for Known and Free:8.6.17-24.1-2
OpenAero 1.3.8
-infocheck directive for checking presence of Sequence info
OpenAero 1.4.0
-updated rules for 2014
OpenAero 1.4.2
-corrected rules for 8.6.1-8 column 3&4
OpenAero 1.4.3.1
-corrected civa-glider-rules:
	*corrected Kmax of Free Unknown and Unknowns
	*Section 6 Part 2 4.3.4.2 implemented
	*connectors are down- or upgraded in FREE UNKNOWN only
	*wrong alert "no roll on 1st element" for 4b3if corrected
	*wrong alert for repitition of 1.1.1.x corrected
	*in each Unknown and Free Unknown it is allowed to fly more than one
	 rolling circle / tailslide / stall-turn / spin / pos. flick / neg. flick /
	 hes roll / superslow roll as long as catIDs of these figures are not repeated
	*floating points in Free and Unknowns, but not in Free Unknown
 *improved detection of upright exit for seqcheck-upend
OpenAero 1.5.0
-added figures 2.2.7.1-4 to CIVA Glider rules for Known
OpenAero 1.5.2
-added checking for repetition of hesitation rolls, snaps and spins
 in Free
OpenAero 1.5.2.1
-corrected roll checking for Unlimited Unknown figure 8.7.6.4
1.5.2.3
- updated infocheck directives for actype and acreg
OpenAero 2016.1
-Changed to 2016 rules:
 - New Free Known (Programme1)
 - Kept Known and Free as hidden options to allow old sequence rule
   checking
 - Changed programmes 2-4
 - removed Super Slow Roll from allowed figures
2016.2.2
- improved detection of upright exit for seqcheck-upend to accept . character
- corrected froll2-name by removing "required"
* 2017.1
* - removed Harmony k-Factors
* - added P-loops with half rolls on top for Unknown programmes
* - added checks for A.14.1.3 : No flick rolls on horizontal entry or
*   exit lines of figures in columns 1 and 2
* 2018.1
* - updated reference sequences for 2018
* 2018.3.2
* - improved detection of upright exit for seqcheck-upend to accept ^ character
* - major update to conform to Sporting Code 2018 chapters and wording
* 2018.3.3
* - corrected "manual check" warning to 2.3.1.2 c)
* - allowed multiple non-aileron rolls on the same line (NOAH i.s.o. NOU) in many figures
* 2018.3.5
* - added 7.4.1.1 (Adv and Unl) and 7.4.2.1 (Unl) to Unknown
* 2019.1.3
* - added correct reference sequences for 2019
* 2020.1
* - added reference sequences for 2020
 * 2021.1.9
 * - applied 2021 rule changes (Sporting code 2.3.1.4)
 * - added figure K and versatility requirements for Unlimited (Free) Unknown
 * - added figure K and versatility requirements for Advanced (Free) Unknown
 * - corrected total sequence K for Advanced and Unlimited (Free) Unknown
 * 2022.1.1
 * - added 2022 reference sequences
 * - major update of rules to comply with 2021 and 2022 Unknown updates
 * 2023.1.1
 * - Added 2023 reference sequences
 * - No flicks on 45 down lines after a looping segment that passed through
 *   vertical down. E.g. 8.7.5.1 (NP2023-16)
 * 2023.3.13
 * - Removed incorrect figures 7.4.1.2, 7.4.1.3, 7.8.4.4, 7.8.8.1 from Advanced Unknown
 * 2024.1.1
 * - Added 8.5.9.1, 8.5.10.1 (“UG” only), 8.5.11.2 (“UG” only), 8.5.12.2 (“UG” only), 8.5.17.1
 *   9.1.3.1, 9.1.3.3, 9.4.3.3, 9.8.3.1 to programmes 2 to 6 (CIVA NP2024-1)
 * - Renamed "Free Known" to "Known" and "Free Unknown" to "Free" (CIVA NP2024-2)
 * - Added 2024 reference sequences
 * 2024.1.10
 * - Fixed 2024 Unlimited reference sequence
 * 2025.1.1
 * - Implemented 2024 CIVA plenary NP2025-15 Parts 1 and 5, NP2025-17, NP2025-19
 * - Updated reference sequences for 2025
*/

rules.push (
"year=2025",
//###################################################################################
//################################ CIVA GLIDERS KNOWN ###############################
//###################################################################################

// Rule name until 2023. Keep for backward compatibility
"(glider-CIVA Unlimited Free Known)",
"more=glider-CIVA Unlimited Known",

//######################################################################
"[glider-CIVA Unlimited Known]",// specific rules for the Unlimited Known programme
//######################################################################

"figure-letters=ABCDE",

'reference="@A" ig2if "@B" of "@C" k2 "@D" \'4rp(2)2 "@E" 1j1',

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

// Repetitions of base-figures acc. to CIVA Section 6 Part 2 Ch. 2.3.1.4
//==========================================================================
"basefigex11-repeat=1",// base figures except of 1.1.1. and 9.1
// may not be repeated in sequence

// Repetitions of rolls acc. to CIVA Section 6 Part 2 Ch. 2.2.1.4
//==========================================================================
"hesroll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

// Maximum K-Factor and number of figures acc. to CIVA Section 6 Part 2 Ch. 2.2.1.5
//======================================================================================
"k-max=233",	// maximum k-factor including maximum floating points
"basefig-min=10",	// exactly 10 base figures per sequence
"basefig-max=10",
"floating-point=3",	// 3 points may be reduced

// Versatility acc. to CIVA Section 6 Part 2 Ch. 2.2.1.6
//=======================================================
"fam5-min=1",// minimum one figure from family 5
"fam6-min=1",
"fam7-min=1",
"fam8-min=1",

// 2.2.1.6 a)
//-----------
"group-roller=^(2\\.1\\.3|2\\.2\\.[2-6]|2\\.3\\.[2-5]|2\\.4\\.[3-8])",// new definition acc. new catIDs
"roller-name=Rolling Turn with at least one full roll",
"roller_name_fr=Virage roulé avec au moins un tonneau complet",
"roller_name_de=Rollenkreis mit mindestens einer ganzen Rolle",
"roller-min=1",

// 2.2.1.6 b)
//-----------
// i)
"group-froll2=^9\\.1\\.\\d\\.[^1]",
"froll2-name=no-hesitation roll (9.1.x.x) of at least 1/2",
"froll2-name_fr=au moins un demi-rouleau continu",
"froll2-name_de=mindestens eine halbe kontinuierliche Rolle (9.1.x.x)",
"froll2-min=1",

// ii)
"hesroll-min=1",// a hesitation roll of any extent (fam 9.2, 9.4 & 9.8)

// iii)
"isnap-min=1",// minimum one inside snap roll element

// iv)
"osnap-min=1",// minimum one outside snap roll element

// Sequence entry and exit attitudes acc. to Ch. 2.2.1.8
//======================================================
"seqcheck-upend=[\\da-z][~+`'()\"\.>^]*\\s*$",// Sequence exit must be in positive attitude
"upend-name=Sequence must be finished in upright flight",
"upend-name_fr=La séquence doit être terminée en vol debout",
"upend-name_de=Sequenz muss bauchlagig beendet werden",
"upend-rule=Sporting Code Section 6 Part 2 2.2.1.8",

// Positioning k-factors acc. to Ch. 2.6
//====================================================
"pos=25:Judges only; 15:Elec tracking",

"more=glider-CIVA Unlimited arestibase",

//######################
"(glider-CIVA Unlimited arestibase)",
//######################
// Allowed Figures for KNOWN and FREE acc. to Ch. 2.2.1.6 and 2.2.1.7  # "acc. to the Aresti-System, Glider Version"
//=========================================================================================================
"1.1.1.1-4",
"1.1.2.1-4",
"1.1.3.1-4",
"1.1.6.1-4",
"1.1.7.1-4",
"1.2.1.1-2",
"1.2.2.1-2",
"1.2.3.1-4",
"1.2.4.1-4",
"1.2.5.1-2",
"1.2.6.1-3",
"1.2.7.1-2",
"1.2.7.4",
"1.2.8.1-3",
"1.3.1.2-3",
"1.3.2.1",
"1.3.2.4",
"1.3.3.2-3",
"1.3.4.1",
"1.3.4.4",
"1.3.5.1",
"1.3.5.3",
"1.3.6.2",
"1.3.6.4",
"1.3.7.1",
"1.3.7.3",
"1.3.8.2",
"1.3.8.4",

"2.1.1.1-2",
"2.1.2.1-4",
"2.1.3.1-4",
"2.2.1.1-2",
"2.2.2.1-4",
"2.2.3.1-4",
"2.2.4.1-4",
"2.2.5.1-4",
"2.2.6.1-4",
"2.2.7.1-4",
"2.3.1.1-2",
"2.3.2.1-4",
"2.3.3.1-4",
"2.3.4.1-4",
"2.3.5.1-4",
"2.4.1.1-2",
"2.4.3.1-4",
"2.4.4.1-4",
"2.4.5.1-4",
"2.4.6.1-4",
"2.4.7.1-4",
"2.4.8.1-4",

"3.3.1.1-4",

"5.2.1.1-4",

"6.2.1.1-4",
"6.2.2.1-4",

"7.2.1.1-4",
"7.2.2.1-4",
"7.2.3.1-4",
"7.2.4.1-4",
"7.3.1.1-4",
"7.3.2.1-4",
"7.3.3.1-4",
"7.3.4.1-4",
"7.4.1.1-4",
"7.4.2.1-4",
"7.4.3.1-4",
"7.4.4.1-4",
"7.4.5.1-2",
"7.4.6.1-2",
"7.4.7.1-4",
"7.4.8.1-4",
"7.4.9.1-4",
"7.4.10.1-4",
"7.4.11.1-4",
"7.4.12.1-4",
"7.4.13.1-4",
"7.4.14.1-4",
"7.5.1.1-4",
"7.5.2.1-4",
"7.5.3.1-4",
"7.5.4.1-4",
"7.5.5.1-4",
"7.5.6.1-4",
"7.5.7.1-4",
"7.5.8.1-4",
"7.8.1.1-4",
"7.8.2.1-4",
"7.8.3.1-4",
"7.8.4.1-4",
"7.8.5.1-4",
"7.8.6.1-4",
"7.8.7.1-4",
"7.8.8.1-4",
"7.8.9.1-4",
"7.8.10.1-4",
"7.8.11.1-4",
"7.8.12.1-4",
"7.8.13.1-4",
"7.8.14.1-4",
"7.8.15.1-4",
"7.8.16.1-4",

"8.4.1.1-4",
"8.4.2.1-4",
"8.4.3.1-4",
"8.4.4.1-4",
"8.4.13.1-4",
"8.4.14.1-4",
"8.4.15.1-4",
"8.4.16.1-4",
"8.4.17.1-4",
"8.4.18.1-4",
"8.4.19.1-4",
"8.4.20.1-4",
"8.5.1.1-4",
"8.5.2.1-4",
"8.5.3.1-4",
"8.5.4.1-4",
"8.5.5.1-4",
"8.5.6.1-4",
"8.5.7.1-4",
"8.5.8.1-4",
"8.5.9.1-4",
"8.5.10.1-4",
"8.5.11.1-4",
"8.5.12.1-4",
"8.5.17.1-4",
"8.5.18.1-4",
"8.5.19.1-4",
"8.5.20.1-4",
"8.6.1.1-4",
"8.6.2.1-4",
"8.6.3.1-4",
"8.6.4.1-4",
"8.6.5.1-4",
"8.6.6.1-4",
"8.6.7.1-4",
"8.6.8.1-4",
"8.6.9.1-4",
"8.6.10.1-4",
"8.6.11.1-4",
"8.6.12.1-4",
"8.6.13.1-4",
"8.6.14.1-4",
"8.6.15.1-4",
"8.6.16.1-4",
"8.6.17.1-2",
"8.6.18.1-2",
"8.6.19.1-2",
"8.6.20.1-2",
"8.6.21.1-2",
"8.6.22.1-2",
"8.6.23.1-2",
"8.6.24.1-2",
"8.7.1.1",
"8.7.1.4",
"8.7.2.3",
"8.7.3.1",
"8.7.3.4",
"8.7.4.3",
"8.7.5.1-4",
"8.7.6.1-4",
"8.7.7.1-4",
"8.7.8.1-4",
"8.8.1.1",
"8.8.1.4",
"8.8.2.1",
"8.8.2.4",
"8.8.3.2",
"8.8.3.4",
"8.8.4.2",
"8.8.4.4",
"8.8.5.1",
"8.8.5.3",
"8.8.6.1",
"8.8.6.3",
"8.8.7.2-3",
"8.8.8.2-3",
"8.10.1.1-4",
"8.10.2.1-4",

"9.1.1.1-2",
"9.1.2.1-2",
"9.1.2.4",
"9.1.3.1-8",
"9.1.4.1-4",
"9.1.5.1-3",
"9.2.3.4",
"9.2.3.6",
"9.2.3.8",
"9.2.4.4",
"9.4.1.2",
"9.4.2.2",
"9.4.3.2-8",
"9.4.4.2-4",
"9.4.5.2",
"9.8.1.1",
"9.8.2.1-2",
"9.8.3.1-8",
"9.8.4.1-2",
"9.8.5.1-2",
"9.9.1.2",
"9.9.2.2-4",
"9.9.3.2-8",
"9.9.4.2-8",
"9.9.5.2-8",
"9.9.6.2",
"9.9.7.2",
"9.9.8.2-8",
"9.9.9.2-8",
"9.9.10.2-8",
"9.10.1.2",
"9.10.2.2-4",
"9.10.3.2-8",
"9.10.4.2-8",
"9.10.5.2-8",
"9.10.6.2",
"9.10.7.2",
"9.10.8.2-8",
"9.10.9.2-8",
"9.10.10.2-8",
"9.11.1.4-8",
"9.12.1.4-8",

//###################
"[glider-CIVA Unlimited Unknown 1]",
"infocheck=positioning",
"more=glider-CIVA Unlimited Unknown",

// Rule name until 2023. Keep for backward compatibility
"(glider-CIVA Unlimited Free Unknown)",
"more=glider-CIVA Unlimited Free",

//######################
"[glider-CIVA Unlimited Free]",
"infocheck=pilot;actype;acreg;positioning",
"more=glider-CIVA Unlimited Unknown",

//###################
"[glider-CIVA Unlimited Unknown 3]",
"infocheck=positioning",
"more=glider-CIVA Unlimited Unknown",

//###################
"[glider-CIVA Unlimited Unknown 4]",
"infocheck=positioning",
"more=glider-CIVA Unlimited Unknown",

//###################
"[glider-CIVA Unlimited Unknown 5]",
"infocheck=positioning",
"more=glider-CIVA Unlimited Unknown",

//###################
"[glider-CIVA Unlimited Programme 1]",
"more=glider-CIVA Unlimited Known",

//###################
"[glider-CIVA Unlimited Programme 2]",
"more=glider-CIVA Unlimited Unknown 1",

//###################
"[glider-CIVA Unlimited Programme 3]",
"more=glider-CIVA Unlimited Free",

//###################
"[glider-CIVA Unlimited Programme 4]",
"more=glider-CIVA Unlimited Unknown 3",

//###################
"[glider-CIVA Unlimited Programme 5]",
"more=glider-CIVA Unlimited Unknown 4",

//###################
"[glider-CIVA Unlimited Programme 6]",
"more=glider-CIVA Unlimited Unknown 5",

//###################
"(glider-CIVA Unlimited Unknown)",

//###################
// Maximum K-Factor and number of figures acc. to CIVA Section 6 Part 2 Ch. 2.3.1.2
//================================================================================
"figure-letters=ABCDEFG",
"basefig-max=7",	// max. 7 base figures per sequence (+ max 2 links)
"additionals=2/10", 	// max 2 additionals with 10K total

// Positioning k-factors acc. to Ch. 2.6
//====================================================
"pos=25:Judges only; 15:Elec tracking",

"k-min=190",
"k-max=210",

"more=glider-CIVA Unlimited Unknownbase",

//###################
"[glider-CIVA Unlimited Unknown Figs]",

// what info should be filled out
"infocheck=positioning",

//###################
// Maximum K-Factor and number of figures acc. to CIVA Section 6 Part 2 Ch. 2.3.1.1-4
//================================================================================
"figure-letters=ABCDEFG",
    "basefig-max=7",		// maximum 7 selected figures

// Positioning k-factors acc. to Ch. 2.6
//====================================================
"pos=25:Judges only; 15:Elec tracking",

"k-min=180",
"k-max=200",

"more=glider-CIVA Unlimited Unknownbase",

//##########################################################################
"(glider-CIVA Unlimited Unknownbase)",// specific rules for the Unlimited Unknown programs
//##########################################################################

// Definition of global rules
//===========================
//## basic rules "NR", "NF" and "NOU" see basic rules file

//## Opposite aileron hesitation rolls are allowed on horizontal lines
//>>> implemented by rule-NOU
"rule-NOAH=roll:[1248],[1248]",
"why-NOAH=no opposite aileron or hesitation rolls allowed",
"why_fr-NOAH=pas d'aileron opposé ou de roulis d'hésitation autorisés",
"why_de-NOAH=keine gegenläufig-gesteuerten oder Zeiten-Rollen erlaubt",
"NOAH-rule=Sporting Code Section 6 Part 2 A.2.1.1",

"rule-NHR=roll:[248]",
"why-NHR=no hesitation roll allowed",
"why_fr-NHR=aucun jet d'hésitation autorisé",
"why_de-NHR=Keine Zeiten-Rolle erlaubt",

// acc. to A.21.1.1
// Full horizontal positive flick rolls only at the apex of upward looping figures

"conv-hpflick=^9\\.9\\.3\\.4=o ; ^9\\.=r ; ^0\\.=z",
"rule-nfpf=hpflick:o",
"why-nfpf=Full horizontal positive flick 9.9.3.4 only at the apex of upward looping figures and 1.1.1.1",
"why_fr-nfpf=Tonneau déclenché positif complet 9.9.3.4 uniquement au sommet des figures en boucle vers le haut et 1.1.1.1",
"why_de-nfpf=Ganze Gerissene 9.9.3.4 nur in oberen Loopbögen und 1.1.1.1",
"nfpf-rule=Sporting Code Section 6 Part 2 A.21.1.1",

// acc. to A.21.1.2 and acc. to A.22.1.2:
// Positive half flick on negative line 9.8.8.2 only with figures 7.2.2.2 and 7.2.4.1
// Negative half flick on positive line 9.10.8.2 only with figures 7.2.2.1 and 7.2.4.2

"conv-fignhf=^9\\.9\\.8\\.2=p ;^9\\.10\\.8\\.2=n ; ^9\\.=r ; ^0\\.=z",
"rule-nhfonl=fignhf: [pn]",
"why-nhfonl=Positive/Negative half flick on line 9.9.8.2/9.10.8.2 only with 7.2.2.2, 7.2.4.1, 8.5.3.4/8.5.3.3, and 8.5.4.3/8.5.4.4",
"why_fr-nhfonl=Demi Tonneau déclenché sur la ligne 9.9.8.2/9.10.8.2 seulement avec 7.2.2.2, 7.2.4.1, 8.5.3.4/8.5.3.3, et 8.5.4.3/8.5.4.4",
"why_de-nhfonl=Halbe Gerissene/Gestoßene auf Linie 9.9.8.2/9.10.8.2 nur mit 7.2.2.2, 7.2.4.1, 8.5.3.4/8.5.3.3, und 8.5.4.3/8.5.4.4",
"nhfonl-rule=Sporting Code Section 6 Part 2 A.21.1.2/A.22.1.2",

"conv-hnfvd=^9\\.10\\.(5\\.[34]|10\\.[34])=o ; ^9\\.=r ; ^0\\.=z",
"rule-nopushout=hnfvd:o$",
"why-nopushout=No inverted exit after more than 1/2 negative flick vertically down",
"why_fr-nopushout=Pas de sortie inversée après plus de 1/2 tonneau déclenché négatif verticalement vers le bas",
"why_de-nopushout=Kein negatives Abfangen nach mehr als einer halben Gestoßenen in der vertikalen Abwärtslinie",
"nopushout-rule=Sporting Code Section 6 Part 2 A.22.1.1",

// Sporting code 2.3.1.4
"group-roller=^2\\.(1\\.[23]|2\\.[2-6])",
"roller-name=Rolling turn",
"roller-name_fr=Tonneaux en virage",
"roller-name_de=Rollenkreis",
"roller-rule=Sporting Code Section 6 Part 2, 2.3.1.4",
"roller-min=1",

"group-fam5or6=^[56]\\.",
"fam5or6-name=Family 5 or 6",
"fam5or6-name_fr=Famille 5 ou 6",
"fam5or6-name_de=Familie 5 oder 6",
"roller-rule=Sporting Code Section 6 Part 2, 2.3.1.4",
"fam5or6-min=1",

"seqcheck-1fullor2halfflick=([^23i]|^)i?f|2i?f.*2i?f",
"1fullor2halfflick-name=At least one full or two half flicks required",
"1fullor2halfflick-name_fr=Au moins un rouleau complet ou deux demi-rouleaux requis",
"1fullor2halfflick-name_de=Mindestens 1 ganze oder 2 halbe Gerissene/Gestoßene erforderlich",
"1fullor2halfflick-rule=Sporting Code Section 6 Part 2, 2.3.1.4",

// very complicated rule, split in multiple lines for (some) clarity
"seqcheck-!max3flick720=(f.*){4}|" +
    "2i?f.*(3i?f.*([^23i]|^)i?f|([^23i]|^)i?f.*([^2i]|^)i?f)|" +
    "3i?f.*(2i?f.*([^23i]|^)i?f|3i?f.*([^2i]|^)i?f|([^23i]|^)i?f.*f)|" +
    "([^23i]|^)i?f.*(2i?f.*([^2i]|^)i?f|([^2i]|^)i?f.*f)",
"!max3flick720-name=Not more than 3 flicks with 720 degrees total rotation allowed",
"!max3flick720-name_fr=Pas plus de 3 tonneau déclenché avec une rotation totale de 720 degrés autorisés",
"!max3flick720-name_de=Nicht mehr als 3 Gerissene/Gestoßene mit insgesamt 720° erlaubt",
"!max3flick720-rule=Sporting Code Section 6 Part 2, 2.3.1.4",

"seqcheck-first3max110k=\@A.*\@B.*\@C.*\@D",
"first3max110k-name=Manually check that first 3 figures have no more than 110 K total",
"first3max110k-name_fr=Vérifier manuellement que les 3 propositions de chiffre n'ont pas plus de 110 K au total",
"first3max110k-name_de=Überprüfen Sie manuell, dass die ersten 3 Figurenvorschläge nicht insgesamt 110 K überschreiten",
	
"first3max110k-rule=Sporting Code Section 6 Part 2, 2.3.1.4",

"k-minperfig=17",
"k-minperfig-rule=Sporting Code Section 6 Part 2, 2.3.1.4",
"k-maxperfig=43",
"k-maxperfig-rule=Sporting Code Section 6 Part 2, 2.3.1.4",

"snap-maxperfig=1",
"snap-maxperfig-rule=Sporting Code Section 6 Part 2, 2.3.1.4",

// Repetitions of base-figures acc. to CIVA Section 6 Part 2 Ch. 2.3.1.4
//==========================================================================
"group-basefigex1119=^(1\\.1\\.[2-8]\\.|[2-8])\\.",
"basefigex1119-name=base figures except 1.1.1.x and 9.x",
"basefigex1119-name_fr=figures de base sauf 1.1.1.x et 9.x",
"basefigex1119-name_de=Basisfiguren außer 1.1.1.x und 9.x",
"basefigex1119-repeat=1",   // base figures except of 1.1.1. and 9
                            // may not be repeated in sequence

// Allowed figures for all Unlimited Unknowns (glider)
//====================================================
//## "figures will be chosen from Appendix A of sporting code" (acc. to 2.3.1.1)

// Single Lines
//-------------
"1.1.1.1 nhfonl",
"1.1.1.2-4 nfpf ; nhfonl",
"1.1.2.1-2 NR",
"1.1.2.3-4 NOAH",
"1.1.3.1-4 NOAH",
"1.1.6.1  NOAH",
"1.1.6.3  NOAH", // spin figure
"1.1.6.4  NOAH ; nopushout", // spin figure
"1.1.7.1  NOAH",
"1.1.7.3  NOAH ; nopushout", // spin figure
"1.1.7.4  NOAH", // spin figure

// Two Lines
//----------
// no vertical roll in fig. of column 4, or column 2 of 1.2.5-8 ### acc. to Ch. A.4.1.1
// no hesitation rolls on 45°lines of lines 1.2.5-8
"1.2.1.1  NOAH ; NR:1",
"1.2.1.2  NOAH  ; NR:1 ; nopushout",
"1.2.2.1  NOAH ; NR:1 ; nopushout",
"1.2.2.2  NOAH ; NR:1",
"1.2.3.1  NOAH",
"1.2.3.2  NOAH ; nopushout",
"1.2.3.4  NOAH  ; NR:2",
"1.2.4.1  NOAH ; nopushout",
"1.2.4.2  NOAH",
"1.2.4.4  NOAH ; NR:2",
"1.2.5.1  NOAH ; NHR:2",
"1.2.5.2  NOAH ; NR:1 ; NHR:2",
"1.2.6.1  NOAH ; NHR:2",
"1.2.6.2  NOAH ; NR:1 ; NHR:2",
"1.2.7.1  NOAH",
"1.2.7.2  NOAH ; NR:1",
"1.2.8.1  NOAH",
"1.2.8.2  NOAH ; NR:1",

// Turns and Rolling Turns
//------------------------
"2.1.1.1-2",
"2.1.2.1-4",
"2.1.3.1-4",
"2.2.1.1-2",
"2.2.2.1-3",
"2.2.3.1-4",
"2.2.4.1-4",
"2.2.5.1-4",
"2.2.6.1-4",
"2.3.1.1-2",
"2.4.1.1-2",

// Stall-Turns
//------------
// Rolling elements may only be added where indicated  ### acc. to A.6.1.1
"5.2.1.1  NOAH",
"5.2.1.2  NOAH ; NR:1 ; nopushout",
"5.2.1.3  NOAH ; nopushout",
"5.2.1.4  NOAH  ; NR:1",

// Tail-Slides
//------------
//Rolling elements may only be added where indicated  ### acc. to A.7.1.1
"6.2.1.1  NOAH",
"6.2.1.2  NOAH ; NR:1 ; nopushout",
"6.2.1.3  NOAH ; nopushout",
"6.2.1.4  NOAH ; NR:1",
"6.2.2.1  NOAH",
"6.2.2.2  NOAH  ; NR:1 ; nopushout",
"6.2.2.3  NOAH ; nopushout",
"6.2.2.4  NOAH  ; NR:1",

// Immelmann and Split-S
//----------------------
// no flick rolls on entries in 7.2.1-4.1-2 nor on exits in 7.2.1-4.3-4 ### acc. to A.8.1.1
// no negative flick rolls on 7.2.2.2 or 7.2.4.1    ### acc. to A.8.1.2
// no positive flick rolls on 7.2.2.1 or 7.2.4.2    ### acc. to A.8.1.2

"rule-NNF=roll:S",
"why-NNF=no negative flick roll on 7.2.2.2 or 7.2.4.1",
"why_fr-NNF=Aucun tonneau déclenché negatif dans 7.2.2.2 ou 7.2.4.1",
"why_de-NNF=Keine Gestoßene in 7.2.2.2 oder 7.2.4.1",
"rule-NPF=roll:S",
"why-NPF=no positive flick roll on 7.2.2.1 or 7.2.4.2",
"why_fr-NPF=Aucun tonneau déclenché positif dans 7.2.2.1 ou 7.2.4.2",
"why_de-NPF=Keine Gerissene in 7.2.2.1 oder 7.2.4.2",

"7.2.1.1-2 NF:1 ; nfpf",
"7.2.1.3-4 NF:2 ; nfpf",
"7.2.2.1  NF:1 ; NPF:2  ; nfpf",
"7.2.2.2  NF:1 ; NNF:2  ; nfpf",
"7.2.2.3-4 NF:2 ; nfpf ; nhfonl",
"7.2.3.1-2 NF:1 ; nfpf ; nhfonl",
"7.2.3.3-4 NF:2 ; nfpf ; nhfonl",
"7.2.4.1  NF:1 ; NNF:1 ; NNF:2",
"7.2.4.2  NF:1 ; NPF:1 ; NPF:2 ; nhfonl",
"7.2.4.3-4 NF:2 ; nhfonl",

// Goldfishes
//-----------
"7.3.1.1-2 NOAH",
"7.3.2.1-4 NOAH",
"7.3.3.1-4 NOAH",
"7.3.4.1-4 NOAH",

// Loops
//------
// no rolls on 7.4.1.3-4      ### acc. to A.9.1.1
// no hesitation roll in 7.4.1.2     ### acc. to A.9.1.2

"7.4.1.1",
"7.4.1.2  NHR",
"7.4.1.3-4 NR",
"7.4.2.1",

// horizontal Eights = Full Cuban Eights
//--------------------------------------
// no flick rolls on hor. entries in figures 7.8.1-4.1-2  ### acc. to A.10.1.1
// no flick rolls on hor. exits in figures 7.8.5-8.1-2  ### acc. to A.10.1.2
// no rolls on diagonal lines acc. to Ch. 9 page 90
"7.8.1.1-2 NOAH ;NF:1",
"7.8.1.3-4 NOAH ;NR:1 ; NR:2 ; nfpf",
"7.8.2.1-2 NOAH ;NF:1",
"7.8.2.3-4 NOAH ;NR:2 ; nfpf",
"7.8.3.1-2 NOAH ;NF:1",
"7.8.3.3-4 NOAH ;NR:3 ; nfpf",
"7.8.4.1-2 NOAH ;NF:1",
"7.8.4.4  NOAH ;nfpf",
"7.8.5.1-2 NOAH ;NR:1 ; NR:2 ; NF:3",
"7.8.5.3-4 NOAH ;nfpf",
"7.8.6.1-2 NOAH ;NR:1 ; NF:3",
"7.8.6.3-4 NOAH ;NR:3 ; nfpf",//##### Anfrage bei Manfred
"7.8.7.1-2 NOAH ;NR:2 ; NF:3",
"7.8.7.3-4 NOAH ;nfpf",
"7.8.8.1  NOAH ;NF:3",
"7.8.8.3-4 NOAH ;nfpf",

// Super-Eights
//-------------
// no rolls on diagonal lines
"7.8.9.1-2 NOAH ;NR:1 ; NR:2 ; NR:3",
"7.8.9.3-4 NOAH",
"7.8.10.1-2 NOAH ;NR:2 ; NR:3",
"7.8.10.3-4 NOAH",
"7.8.11.1-2 NOAH ;NR:1 ; NR:3",
"7.8.11.3-4 NOAH",
"7.8.12.1-2 NOAH ;NR:1 ; NR:2",
"7.8.12.3-4 NOAH",
"7.8.13.4 NOAH ;NR:3",
"7.8.14.3-4 NOAH ;NR:2",
"7.8.15.3 NOAH",
"7.8.16.4 NOAH",

// Humpty-Bumps
//-------------
"8.4.1.1 NOAH",
"8.4.1.2 NOAH ; NR:1 ; nopushout", 	// 2014 : upward roll not allowed
"8.4.2.1 NOAH ; nopushout",
"8.4.2.2 NOAH ; NR:1",		// 2014 : upward roll not allowed
"8.4.3.1 NOAH",
"8.4.3.2 NOAH ; nopushout",
"8.4.4.1 NOAH ; nopushout",
"8.4.4.2 NOAH",

// Diagonal bumps
//---------------
// no flick rolls on diagonal down lines in 8.4.15-16.1-2, 8.4.17-18.1-2 ### acc. to A.12.1.2
// no rolls on lines
"8.4.13.1-2 NOAH ; NR:1",
"8.4.14.1-2 NOAH ; NR:1",
"8.4.15.1 NOAH ; NF:2",
"8.4.15.2 NOAH ; NR:2",
"8.4.15.3-4 NOAH ; NR:2",
"8.4.16.1 NOAH ; NF:2",
"8.4.16.2 NOAH ; NF:2",
"8.4.16.4 NOAH",
"8.4.17.1 NOAH ; NR",
"8.4.17.2 NOAH ; NR:1 ; NF:2",
"8.4.17.3 NOAH ; NR:2",
"8.4.18.1 NOAH ; NF:2",
"8.4.18.2 NOAH ; NR:1 ; NF:2",
"8.4.18.3 NOAH",

// Half Cuban Eight, diagonal lines first
//---------------------------------------
// no flick rolls on hor. exits in fig. 8.5.1-4.1-2   ### acc. to A.13.1.1
// no rolls on lines acc. to Ch. 9 page 93
"8.5.1.1-2 NF:2 ; NR:1 ; nfpf",
"8.5.1.3-4 NOAH:1 ; nfpf",
"8.5.2.1-2 NOAH:1 ; NF:2 ; nfpf",
"8.5.2.3-4 NOAH:1 ; nfpf",
"8.5.3.1-2 NF:2  ; NR:1",
"8.5.3.3",
"8.5.3.4",
"8.5.4.1-2 NOAH:1 ; NF:2",
"8.5.4.3 NOAH:1",
"8.5.4.4 NOAH:1",

// Half Cuban Eight, diagonal lines last
//--------------------------------------
// no flick rolls on hor. entries in fig. 8.5.5-8.1-2   ### acc. to A.13.1.2
// no rolls on lines acc. to Ch. 9 page 94
"8.5.5.1-2 NF:1 ; NOAH:2 ; nfpf",
"8.5.5.3-4 NR:2 ; nfpf",
"8.5.6.1-2 NF:1 ; NOAH:2 ; nfpf",
"8.5.6.3-4 NOAH:2 ; nfpf",
"8.5.7.1-2 NF:1 ; NOAH:2",
"8.5.7.3-4 NR:2",
"8.5.8.1-2 NF:1 ; NOAH:2",
"8.5.8.3-4 NOAH:2",

// Vertical 5/8ths loops
"8.5.9.1",
"8.5.10.1",
"8.5.11.2",
"8.5.12.2",
"8.5.17.1",

// P-Loops with full rolls in apex
//---------------------------------
// no rolls on top of 8.6.1|3.1 after roll on the up line  ### acc. to A.14.1.1
// no rolls on lines acc. to Ch. 9 page 94-95
// no flicks on vert. down lines in 8.6.5-8.1-2 after hesitation in loop ### acc. to A.14.1.2

"rule-NLRAULR=roll: [12348fFSt] ([12348fFSt])",
"why-NLRAULR=No rolls on top of loop after roll on up line allowed",
"why_fr-NLRAULR=Pas de roulades au de la boucle après roulades sur la ligne ascendante autorisées",
"why_de-NLRAULR=Keine Rolle im Loopbogen nach Rolle auf Aufwärtslinie erlaubt",
"NLRAULR-rule=Sporting Code Section 6 Part 2 A.14.1.1",

"rule-NFALHR=roll: (.[,;].|[248]) [fFS]$",
"why-NFALHR=No flick roll on vertical down line after hesitation roll in loop segment allowed",
"why_fr-NFALHR=Pas de tonneau déclenché sur la ligne verticale descendante après tonneau avec hésitation dans le segment de boucle autorisées",
"why_de-NFALHR=Keine Gerissene/Gestoßene auf Abwärtslinie nach Zeiten-Rolle im Loopbogen erlaubt",
"NFALHR-rule=Sporting Code Section 6 Part 2 A.14.1.2",

"8.6.1.1  NLRAULR ; NOAH:1 ; NOAH:2 ; NF:3",
"8.6.1.4  NOAH:1 ; nfpf:3", // spin figure
"8.6.2.1  NR:1 ; NR:2 ; NF:3",
"8.6.2.4  NOAH:1", // spin figure
"8.6.3.1  NLRAULR  ; NOAH:1 ; NOAH:2 ; NF:3",
"8.6.3.3  NOAH:1 ; nfpf:3", // spin figure
"8.6.4.1  NR:1 ; NR:2  ; NF:3",
"8.6.4.3  NOAH:1 ; nhfonl", // spin figure
"8.6.5.1  NFALHR  ; NOAH:2 ; NOAH:3 ; NF:1",
"8.6.5.4  NOAH:2 ; nfpf:1",
"8.6.6.1  NFALHR  ; NOAH:2 ; NOAH:3 ; NF:1 ; nopushout",
"8.6.6.2  NFALHR  ; NOAH:2 ; NOAH:3 ; NF:1",
"8.6.6.4  NOAH:2 ; nfpf:1",
"8.6.7.2  NFALHR  ; NOAH:2 ; NOAH:3 ; NF:1",
"8.6.7.3  NOAH:2 ; nhfonl",
"8.6.8.1  NFALHR  ; NOAH:2 ; NOAH:3 ; NF:1",
"8.6.8.2  NFALHR  ; NOAH:2 ; NOAH:3 ; NF:1 ; nopushout",
"8.6.8.3  NOAH:2 ; nhfonl",

// "reversing P-Loops" or Porpoise
//--------------------------------
// no rolls on lines
"8.6.13.1 NR:1 ; NR:2 ; NOAH:3",
"8.6.13.2 NR:1 ; NR:2 ; NOAH:3 ; nopushout",
"8.6.13.3 NR:1 ; NR:2 ; NOAH:3",
"8.6.14.1 NR:1 ; NR:2 ; NOAH:3 ; nopushout",
"8.6.14.2 NR:1 ; NR:2 ; NOAH:3",
"8.6.14.3 NR:1 ; NR:2 ; NOAH:3",

// P-Loops with half rolls in apex
//---------------------------------
"8.6.17.1 NR:1 ; NOAH:2 ; NR:3",
"8.6.18.1 NR:1 ; NOAH:2 ; NF:3",
"8.6.19.1 NR:1 ; NOAH:2 ; NR:3",
"8.6.20.1 NR:1 ; NOAH:2 ; NF:3",
"8.6.21.1-2 NR:1 ; NOAH:2 ; NR:3",
"8.6.22.1-2 NR:1 ; NOAH:2 ; NR:3",
"8.6.23.1-2 NF:1 ; NOAH:2 ; NR:3",

// Q-Loops
//--------
// no hesitation rolls on top of 8.7.5|6.2    ### acc. to A.16.1.2
// no rolls on lines
"8.7.5.1  NOAH:2 ; NOAH:3 ; nfpf:1 ; NR:3",
"8.7.5.2  NHR:2 ; NOAH:2 ; NOAH:3 ; nfpf:1 ; NR:3",
"8.7.5.4  NR:2 ; NR:3 ; nfpf:1",
"8.7.6.1  NOAH:2 ; NOAH:3 ; nfpf:1 ; NF:3",
"8.7.6.2  NHR:2 ; NOAH:2 ; NOAH:3 ; nfpf:1 ; NF:3",
"8.7.6.4  NOAH:2 ; nfpf:1",

// Rolls
//------
"9.1.1.1",
"9.1.2.2",
"9.1.3.1-4",
"9.1.3.6",
"9.1.3.8",
"9.1.4.2",
"9.1.4.4",
"9.1.5.1-2",

"9.2.3.4",

"9.4.2.2",
"9.4.3.2-4",
"9.4.4.2",

"9.8.3.1-2",

"9.9.2.2",
"9.9.3.2",
"9.9.3.4",
"9.9.4.2",
"9.9.4.4",
"9.9.5.2-4",
"9.9.8.2",
"9.9.10.2-4",

"9.10.2.2",
"9.10.3.2",
"9.10.4.2",
"9.10.4.4",
"9.10.5.2-4",
"9.10.8.2",
"9.10.10.2-4",

"9.11.1.4-6",

"9.12.1.4-6",

//########################################################################################
//#################### End of Rules for GLIDER UNLIMITED #################################
//########################################################################################

// Rule name until 2023. Keep for backward compatibility
"(glider-CIVA Advanced Free Known)",
"more=glider-CIVA Advanced Known",

//######################################################################
"[glider-CIVA Advanced Known]",// specific rules for the Advanced Known programme
//######################################################################

"figure-letters=ABCDE",

'reference="@A" -2t "@B" 6s "@C" 22c2 "@D" 2ip "@E" 2-',

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

// Repetitions of base-figures acc. to CIVA Section 6 Part 2 Ch. 2.2.1.4
//==========================================================================
"basefigex11-repeat=1",// base figures except of 1.1.1. and 9.1
// may not be repeated in sequence

// Repetitions of rolls acc. to CIVA Section 6 Part 2 Ch. 2.2.1.4
//==========================================================================
"hesroll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

// Maximum K-Factor and number of figures acc. to CIVA Section 6 Part 2 Ch. 2.2.1.5
//======================================================================================
"k-max=178",	// 2014 : maximum k-factor + maximum floating points
"basefig-min=10",	// exactly 10 base figures per sequence
"basefig-max=10",
"floating-point=3",	// 3 points may be reduced

// Versatility acc. to CIVA Section 6 Part 2 Ch. 2.2.1.7
//=======================================================
"fam5-min=1",// minimum one figure from family 5
"fam6-min=1",
"fam7-min=1",
"fam8-min=1",

// 2.2.1.7 a)
//-----------
"group-roller=^(2\\.[1-4]\\.1|2\\.1\\.3\\.1)",// new definition acc. new catIDs

// 2.2.1.7 b)
//-----------
// i)
"group-froll2=^9\\.1\\.\\d\\.[^1]",
"froll2-name=No-hesitation roll at least 1/2",
"froll2-name_fr=Au moins un demi-rouleau continu",
"froll2-name_de=Mindestens eine halbe kontinuierliche Rolle",
"froll2-min=1",

// ii)
"hesroll-min=1",// a hesitation roll of any extent

// Sequence entry and exit attitudes acc. to Ch. 2.2.1.8
//======================================================
"seqcheck-upend=([0-9a-tv-z]+|[^e]u)[~+`'()\\\"\\.>^]*\\s*(eu)?$",// Sequence exit must be in positive attitude
"upend-name=Sequence must be finished in upright flight",
"upend-name_fr=La séquence doit être terminée en vol debout",
"upend-name_de=Sequenz muss bauchlagig beendet werden",
"upend-rule=Sporting Code Section 6 Part 2 2.2.1.8",

// Positioning k-factors acc. to Ch. 2.7
//====================================================
"pos=20:Judges only; 15:Elec tracking",

"more=glider-CIVA Advanced arestibase",

//#####################
"(glider-CIVA Advanced arestibase)",
//#####################
// Allowed Figures for KNOWN and FREE acc. to Ch. 2.2.1.6 and 2.2.1.7 # "acc. to the Aresti-System, Glider Version"
//=========================================================================================================
//no full negative loops, no high speed negative part loops of more than 45°
"1.1.1.1-4",
"1.1.2.1-4",
"1.1.3.1-4",
"1.1.6.1",
"1.1.6.3",
"1.1.7.1",
"1.1.7.4",
"1.2.1.1",
"1.2.2.2",
"1.2.3.1",
"1.2.3.4",
"1.2.4.2",
"1.2.4.4",
"1.2.5.1",
"1.2.6.1",
"1.2.6.3",
"1.2.7.1",
"1.2.7.4",
"1.2.8.1",
"1.2.8.3",
"1.3.1.2-3",
"1.3.2.1",
"1.3.2.4",
"1.3.3.2-3",
"1.3.4.1",
"1.3.4.4",
"1.3.5.1",
"1.3.5.3",
"1.3.6.2",
"1.3.6.4",
"1.3.7.1",
"1.3.7.3",
"1.3.8.2",
"1.3.8.4",

//no rolling turns except 2.1.3.1 in Free programs
"2.1.1.1-2",
"2.1.3.1",
"2.2.1.1-2",
"2.3.1.1-2",
"2.4.1.1-2",

"3.3.1.1-2",//## what exactly is "high speed"?
"3.3.1.4",

"5.2.1.1",

"6.2.1.1",
"6.2.2.1",

"7.2.1.1",
"7.2.1.4",
"7.2.2.1",
"7.2.2.4",
"7.2.3.2-3",
"7.2.4.2-3",
"7.3.1.2-3",
"7.3.2.1",
"7.3.2.4",
"7.3.3.2-3",
"7.3.4.1",
"7.3.4.4",
"7.4.1.1",
"7.4.1.4",
"7.4.3.1",
"7.4.3.4",
"7.4.5.1",
"7.4.6.1",
"7.4.7.4",
"7.4.8.4",
"7.4.9.3",
"7.4.10.3",
"7.4.11.3",
"7.4.12.3",
"7.4.13.4",
"7.4.14.4",
"7.5.2.1",
"7.5.2.4",
"7.5.5.2-3",
"7.5.7.1",
"7.5.7.4",
"7.5.8.2-3",
"7.8.3.1",
"7.8.3.4",
"7.8.4.1",
"7.8.4.4",
"7.8.6.2-3",
"7.8.8.1",
"7.8.8.4",
"7.8.11.2-3",
"7.8.13.1",
"7.8.13.4",
"7.8.15.2-3",
"7.8.16.1",
"7.8.16.4",

"8.4.1.1",
"8.4.1.4",
"8.4.2.4",
"8.4.3.1",
"8.4.3.3",
"8.4.4.3",
"8.4.13.1-2",//## what exactly is "high speed"?
"8.4.13.4",
"8.4.14.1-2",//## what exactly is "high speed"?
"8.4.14.4",
"8.4.15.1-2",//## what exactly is "high speed"?
"8.4.15.4",
"8.4.16.1-2",//## what exactly is "high speed"?
"8.4.16.4",
"8.4.17.1-3",//## what exactly is "high speed"?
"8.4.18.1-3",//## what exactly is "high speed"?
"8.4.19.1-3",//## what exactly is "high speed"?
"8.4.20.1-3",//## what exactly is "high speed"?
"8.5.1.2-3",
"8.5.2.1",
"8.5.2.4",
"8.5.3.2-3",
"8.5.4.1",
"8.5.4.4",
"8.5.5.1",
"8.5.5.4",
"8.5.6.1",
"8.5.6.4",
"8.5.7.2-3",
"8.5.8.2-3",
"8.5.9.1",
"8.5.9.4",
"8.5.10.2",
"8.5.10.4",
"8.5.11.1",
"8.5.11.3",
"8.5.12.2-3",
"8.5.17.1",
"8.5.17.4",
"8.5.18.1",
"8.5.18.4",
"8.5.19.1",
"8.5.19.3",
"8.5.20.1",
"8.5.20.3",
"8.6.1.1",
"8.6.1.4",
"8.6.2.1",
"8.6.2.4",
"8.6.3.3",
"8.6.4.3",
"8.6.5.1",
"8.6.5.4",
"8.6.6.4",
"8.6.7.2-3",
"8.6.8.3",
"8.6.9.4",
"8.6.10.4",
"8.6.11.1",
"8.6.11.3",
"8.6.12.1",
"8.6.12.3",
"8.6.13.1",
"8.6.13.4",
"8.6.14.3",
"8.6.15.2",
"8.6.15.4",
"8.6.16.4",
"8.6.17.1-2",
"8.6.18.1-2",
"8.6.19.1-2",
"8.6.20.1-2",
"8.6.21.1-2",
"8.6.22.1-2",
"8.6.23.1-2",
"8.6.24.1-2",
"8.7.1.1",
"8.7.1.4",
"8.7.2.3",
"8.7.3.1",
"8.7.3.4",
"8.7.4.3",
"8.7.5.1",
"8.7.5.4",
"8.7.6.1",
"8.7.6.4",
"8.7.7.2-3",
"8.7.8.2-3",
"8.8.1.1",
"8.8.1.4",
"8.8.2.1",
"8.8.3.4",
"8.8.5.1",
"8.8.6.1",
"8.8.6.3",
"8.8.8.3",
"8.10.2.4",

//no rolls vertically up, no more than 1/4 roll vertical down, no flicks, no inverted spins

"9.1.2.1-2",
"9.1.2.4",
"9.1.3.1-8",
"9.1.4.1-4",
"9.1.5.1",
"9.2.3.4",
"9.2.3.6",
"9.2.3.8",
"9.2.4.4",
"9.4.2.2",
"9.4.3.2-8",
"9.4.4.2-4",
"9.8.2.1-2",
"9.8.3.1-8",
"9.8.4.1-2",
"9.8.5.1",
"9.11.1.4-8",

//###################
"[glider-CIVA Advanced Unknown 1]",
"infocheck=positioning",
"more=glider-CIVA Advanced Unknown",

// Rule name until 2023. Keep for backward compatibility
"(glider-CIVA Advanced Free Unknown)",
"more=glider-CIVA Advanced Free",

//######################
"[glider-CIVA Advanced Free]",
"infocheck=pilot;actype;acreg;positioning",
"more=glider-CIVA Advanced Unknown",

//###################
"[glider-CIVA Advanced Unknown 3]",
"infocheck=positioning",
"more=glider-CIVA Advanced Unknown",

//###################
"[glider-CIVA Advanced Unknown 4]",
"infocheck=positioning",
"more=glider-CIVA Advanced Unknown",

//###################
"[glider-CIVA Advanced Unknown 5]",
"infocheck=positioning",
"more=glider-CIVA Advanced Unknown",

"[glider-CIVA Advanced Programme 1]",
"more=glider-CIVA Advanced Known",

"[glider-CIVA Advanced Programme 2]",
"more=glider-CIVA Advanced Unknown 1",

"[glider-CIVA Advanced Programme 3]",
"more=glider-CIVA Advanced Free",

"[glider-CIVA Advanced Programme 4]",
"more=glider-CIVA Advanced Unknown 3",

"[glider-CIVA Advanced Programme 5]",
"more=glider-CIVA Advanced Unknown 4",

"[glider-CIVA Advanced Programme 6]",
"more=glider-CIVA Advanced Unknown 5",

//###################
"[glider-CIVA Advanced Unknown Figs]",
//###################

//###################
// Maximum K-Factor and number of figures acc. to CIVA Section 6 Part 2 Ch. 2.3.1.2
//================================================================================
"figure-letters=ABCDEFG",
"basefig-max=7",	// max. 7 base figures per sequence (+ max 2 links)

// Positioning k-factors acc. to Ch. 2.7
//====================================================
"pos=20:Judges only; 15:Elec tracking",

"k-min=150",
"k-max=170",

"more=glider-CIVA Advanced Unknownbase",

//###################
"(glider-CIVA Advanced Unknown)",
//###################

//###################
// Maximum K-Factor and number of figures acc. to CIVA Section 6 Part 2 Ch. 2.3.1.2
//================================================================================
"figure-letters=ABCDEFG",
"basefig-max=7",	// max. 7 base figures per sequence (+ max 2 links)
"additionals=2/10", 	// max 2 additionals with 10K total

// Positioning k-factors acc. to Ch. 2.7
//====================================================
"pos=20:Judges only; 15:Elec tracking",

"k-min=160",
"k-max=180",

// Sequence entry and exit attitudes acc. to Ch. 2.3.2.1
//======================================================
"seqcheck-upend=[\\da-z][~+`'()\"\.>^]*\\s*$",// Sequence exit must be in positive attitude
"upend-name=Sequence must be finished in upright flight",
"upend-name_fr=La séquence doit être terminée en vol debout",
"upend-name_de=Sequenz muss bauchlagig beendet werden",
"upend-rule=Sporting Code Section 6 Part 2 2.3.2.1",

"more=glider-CIVA Advanced Unknownbase",

//##########################################################################
"(glider-CIVA Advanced Unknownbase)",// specific rules for the Advanced Unknown programs
//##########################################################################

// Definition of global rules
//===========================
//## basic rules "NR", "NF" and "NOU" see basic rules file

"rule-NOAH=roll:[1248],[1248]",
"why-NOAH=no opposite aileron or hesitation rolls allowed",
"why_fr-NOAH=pas d'aileron opposé ou de roulis d'hésitation autorisés",
"why_de-NOAH=keine gegenläufig-gesteuerten oder Zeiten-Rollen erlaubt",
"NOAH-rule=Sporting Code Section 6 Part 2 A.2.1.1",

//## Opposite slow or hesitation rolls are allowed on horizontal lines
//>>> implemented by rule-NOU

"rule-NHR=roll:[248]",
"why-NHR=no hesitation roll allowed",
"why_fr-NHR=aucun jet d'hésitation autorisé",
"why_de-NHR=Keine Zeiten-Rolle erlaubt",

// Sporting code 2.3.1.4
"group-fam5or6=^[56]\\.",
"fam5or6-name=Family 5 or 6",
"fam5or6-name_fr=Famille 5 ou 6",
"fam5or6-name_de=Familie 5 oder 6",
"roller-rule=Sporting Code Section 6 Part 2, 2.3.1.4",
"fam5or6-min=1",

"k-minperfig=10",
"k-minperfig-rule=Sporting Code Section 6 Part 2, 2.3.1.4",
"k-maxperfig=37",
"k-maxperfig-rule=Sporting Code Section 6 Part 2, 2.3.1.4",

// Repetitions of base-figures acc. to CIVA Section 6 Part 2 Ch. 2.3.1.4
//==========================================================================
"group-basefigex1119=^(1\\.1\\.[2-8]\\.|[2-8])\\.",
"basefigex1119-name=base figures except 1.1.1.x and 9.x",
"basefigex1119-name_fr=figures de base sauf 1.1.1.x et 9.x",
"basefigex1119-name_de=Basisfiguren außer 1.1.1.x und 9.x",
"basefigex1119-repeat=1",   // base figures except of 1.1.1. and 9
                        // may not be repeated in sequence

// Allowed figures for all Unlimited Unknowns (glider)
//====================================================
//## "figures will be chosen from appendix A of sporting code" (acc. to 2.3.1.1)

// Single Lines
//-------------
"1.1.1.1-4",
"1.1.2.1-4 NR",
"1.1.3.1-4 NOAH",
"1.1.6.1  NR",
"1.1.6.3  NOAH",
"1.1.7.1  NR",
"1.1.7.4  NOAH",

// Two Lines
//----------
// no vertical roll in fig. of column 4, or column 2 of 1.2.5-8 ### acc. to Ch. A.4.1.1
// no hesitation rolls on 45°lines of lines 1.2.5-8  ### acc. to Ch. 9.1.1.4
"1.2.1.1  NOAH ; NR:1",
"1.2.2.2  NOAH ; NR:1",
"1.2.3.1  NOAH",
"1.2.3.4  NOAH  ; NR:2",
"1.2.4.2  NOAH",
"1.2.4.4  NOAH ; NR:2",
"1.2.5.1  NR",
"1.2.6.1  NR",
"1.2.7.1  NR:1 ; NOAH",
"1.2.8.1  NR:1 ; NOAH",

// Turns and Rolling Turns
//------------------------
"2.1.1.1-2",
"2.2.1.1-2",
"2.3.1.1-2",
"2.4.1.1-2",

// Stall-Turns
//------------
// Rolling elements may only be added where indicated  ### acc. to A.6.1.1
"5.2.1.1  NR:1 ; NOAH",

// Tail-Slides
//------------
//Rolling elements may only be added where indicated  ### acc. to A.7.1.1
"6.2.1.1  NR:1 ; NOAH",
"6.2.2.1  NR:1 ; NOAH",

// Immelmann and Split-S
//----------------------
"7.2.1.1",
"7.2.1.4",
"7.2.2.1",
"7.2.2.4",
"7.2.3.2-3",
"7.2.4.2-3",

// Goldfishes
//-----------
"7.3.1.2-3 NR",
"7.3.2.1  NR:2 ; NOAH",
"7.3.2.4  NR:2 ; NOAH",
"7.3.3.2-3 NR:1 ; NOAH",
"7.3.4.1  NOAH",
"7.3.4.4  NOAH",

// Loops
//------
// no roll on 7.4.1.4      ### acc. to A.9.1.1

"7.4.1.1",
"7.4.1.4 NR",

// horizontal Eights = Full Cuban Eights
//--------------------------------------
// no rolls on diagonal lines
"7.8.3.1  NR:3 ; NOAH",
"7.8.3.4  NR:3 : NOAH",
"7.8.4.1  NOAH",
"7.8.6.2  NR:1 ; NOAH",
"7.8.6.3  NR:1 ; NR:3 ; NOAH",
"7.8.8.4  NOAH",

// Super-Eights
//-------------
// no rolls on diagonal lines
"7.8.11.2-3 NOAH ;NR:1 ; NR:3",
"7.8.15.3 NOAH",

// Humpty-Bumps
//-------------
"8.4.1.1  NR:1 ; NOAH",
"8.4.3.1  NR:1 ; NOAH",

// Diagonal bumps
//---------------
// no rolls on lines
"8.4.13.1  NR",
"8.4.14.1  NOAH ; NR:1",
"8.4.15.1  NOAH ; NR:2",
"8.4.15.4  NOAH ; NR:2",
"8.4.16.1  NOAH",
"8.4.16.4  NOAH",
"8.4.17.2-3 NR",
"8.4.18.2-3 NOAH  ; NR:1",

// Half Cuban Eight, diagonal lines first
//---------------------------------------
// no rolls on lines
"8.5.1.2-3 NR:1",
"8.5.2.1  NOAH:1",
"8.5.2.4  NOAH:1",
"8.5.3.2-3 NR:1",
"8.5.4.1  NOAH:1",
"8.5.4.4  NOAH:1",

// Half Cuban Eight, diagonal lines last
//--------------------------------------
// no rolls on lines
"8.5.5.1  NR:2",
"8.5.5.4  NR:2",
"8.5.6.1  NOAH:2",
"8.5.6.4  NOAH:2",
"8.5.7.2-3 NR:2",
"8.5.8.2-3 NOAH:2",

// Vertical 5/8ths loops
"8.5.9.1",
"8.5.17.1",

// P-Loops
//--------
// no rolls on top of 8.6.1|3.1 after roll on the up line  ### acc. to A.14.1.1
// no rolls on lines

"8.6.1.1  NR:1 ; NR:2 ; NF:3",
"8.6.1.4  NOAH:1",
"8.6.2.1  NR:1 ; NR:2 ; NF:3",
"8.6.2.4  NR:1",
"8.6.3.3  NOAH:1",
"8.6.4.3  NOAH:1",
"8.6.5.1  NF:1 ; NOAH:2 ; NOAH:3",
"8.6.5.4  NR:2",
"8.6.6.4  NR:2",
"8.6.7.2  NF:1 ; NOAH:2 ; NOAH:3",
"8.6.7.3  NR:2",
"8.6.8.3  NR:2",

// "reversing P-Loops" or Porpoise
//--------------------------------
// no rolls on lines
"8.6.13.1  NR:1 ; NR:2 ; NOAH:3",
"8.6.13.3  NR",
"8.6.14.3  NR",

// P-Loops with half rolls in apex
//---------------------------------
"8.6.19.1 NR:1 ; NOAH:2 ; NR:3",
"8.6.20.1 NR:1 ; NOAH:2 ; NF:3",
"8.6.22.1 NR:1 ; NOAH:2 ; NR:3",

// Q-Loops
//--------
// no hesitation rolls on top of 8.7.5|6.2    ### acc. to A.16.1.2
// no rolls on lines
"8.7.5.1  NOAH:2 ; NR:3",
"8.7.5.4  NR:2 ; NR:3",

// Rolls
//------
"9.1.2.2",
"9.1.3.1-4",
"9.1.3.6",
"9.1.3.8",
"9.1.4.2",
"9.1.5.1",

"9.2.3.4",

"9.4.2.2",
"9.4.3.2-4",
"9.4.4.2",

"9.8.3.1-2",

"9.11.1.4-6"

//######################################################################
//################### End of GLIDER ADVANCED Rules #####################
//######################################################################

);
