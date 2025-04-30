// OpenAero rules-saa.js file

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

// This file defines year 2025 and rule type Sportsman (Free) and Excellence (Programs 1-4) specific rules
// Intermediate, Advanced and Unlimited categories are covered by CIVA rules

// SAA 2025, written and updated by Nicolas Durand, March 2025

// Sources:
// https://www.saa.ch/regulations/

// open the rules.push command
rules.push (
  "year=2025",

  //######################################################################################
  //##### SAA EXCELLENCE FREE KNOWN ######################################################
  //######################################################################################

  "[SAA Excellence Free Known]",
  "posnl=35",//assume no line judges
  "poslj=35",

  // 2025 Set of Figures: 
  'reference="@A" 3joi15- "@B" 44dbif;2 "@C" 3fbb1 "@D" 4,5dq1 "@E" 5,3m2if;1-',

  //"more=SAA Excellence Free Known", 

  //"(SAA Excellence Free Known)",

  "basefig-min=10",
  "basefig-max=10",
  "k-max=380",

  "basefig-repeat=1",
  "roll-repeat=1",
  "snap-repeat=1",
  "spin-repeat=1",

  "group-roller=^2\\.(2\\.[3-7]|3\\.[2-6]|4\\.[2-8])",
  "roller-name=Rolling turn, family 2.2.3 to 2.2.7, 2.3.2 to 2.3.6, 2.4.2 to 2.4.8",
  "roller-name_fr=Tonneaux en virage, famille 2.2.3 à 2.2.7 ou 2.3.2 à 2.3.6 ou 2.4.2 à 2.4.8",
  "roller-name_de=Rollenkreis, Familie 2.2.3 bis 2.2.7, 2.3.2 bis 2.3.6, 2.4.2 bis 2.4.8",

  "fam1-min=1",
  "roller-min=1",
  "fam5-min=1",
  "fam6-min=1",
  "fam7-min=1",
  "fam8-min=1",

  "spin-min=1",

  "isnap-min=2",
  "osnap-min=2",

  "opposite-min=1",//one opposite roll is required!

  "figure-letters=ABCDE",

  // what info should be filled out
  "infocheck=pilot;actype;acreg;positioning",

  //#######################################################################################
  //##### SAA EXCELLENCE UNKNOWNS #########################################################
  //#######################################################################################

  "[SAA Excellence Unknown1]",
  "k-maxperfig=40",
  "more=SAA Excellence FreeUnknown",

  "[SAA Excellence Unknown2]",
  "k-maxperfig=45",
  "more=SAA Excellence FreeUnknown",

  "[SAA Excellence Unknown3]",
  "k-maxperfig=50",
  "more=SAA Excellence FreeUnknown",

  "(SAA Excellence FreeUnknown)",
  "additionals=4/24",
  "figure-letters=ABCDEFGHIJ",

  "poslj=35",
  "posnl=35",
  "group-one=^1\\.(1\\.[6-9]|1\\.1[01])\\.[34]",
  "one-name=family 1.1.6-11 columns 3&4",
  "one-name_fr=famille 1.1.6 à 1.1.11 colonnes 3 et 4",
  "one-name_de=Familie 1.1.6-11 Spalten 3&4",
  "group-two=^8\\.(4\\.[1-4]|4\\.[7-9]|4\\.10|5\\.[1-2]|6\\.[1-2])\\.[34]",
  "two-name=family 8.4.1-4,8.4.7-10,8.5.1-2,8.6.1-2 columns 3&4",
  "two-name_fr=famille 8.4.1-4,8.4.7-10,8.5.1-2,8.6.1-2 colonnes 3 et 4",
  "two-name_de=Familie 8.4.1-4,8.4.7-10,8.5.1-2,8.6.1-2 Spalten 3&4",
  "group-vsnap=^9\\.(9|10)\\.[16]\\.",
  "vsnap-name=vertically climbing flick(s)",
  "vsnap-name_fr=déclenché(s) ascendant vertical",
  "vsnap-name_de=vertikal aufwärts Gerissene/Gestoßene",
  //"vsnap-rule=Sporting Code Section 6 Part 1 2.3.1.4",
  "one-max=1", //   "one-max=2",
  "two-max=1", //   "two-max=2",
  "isnap-min=2", // 9.9
  "isnap-max=3",
  "osnap-min=2", // 9.10
  "osnap-max=3",
  "vsnap-min=1", // vertically climbing flick
  "vsnap-max=2",
  "snap-max=6",

  "snap-maxperfig=1",

  "k-minperfig=22",

  "basefig-min=10",
  "basefig-max=10",

  "basefig-repeat=1",
  "roll-repeat=1",
  "snap-repeat=1",
  "spin-repeat=1",

  "more=SAA Excellence Unknownbase",

  //# a single Unknown figure, without sequence requirements
  "(SAA Excellence Unknownfigure)",
  "snap-maxperfig=1",
  "k-minperfig=22",
  "basefig-repeat=1",
  "roll-repeat=1",
  "snap-repeat=1",
  "spin-repeat=1",
  "more=SAA Excellence Unknownbase",

  //###################################################################################################
  "(SAA Excellence Unknownbase)",

  "conv-horstop=^9\\.(1|9|10)\\.[38]=1 ; ^9\\.2\\.3\\.4 = 2 ;^9\\.2\\.3\\.6 = 3 ;^9\\.2\\.3\\.8 = 4 ;^9\\.4\\.3\\.([1-8]) = $1; ^9\\.8\\.3\\.1 = 2;^9\\.8\\.3\\.2 = 4;^9\\.8\\.3\\.3 = 6;^9\\.8\\.3\\.4 = 8; ^9\\.=r ; ^0\\.=z",
  "rule-Hor10stop = horstop:<11",
  "why-Hor10stop  = a maximum of 10 stops are allowed on straight horizontal lines rolls",
  "why_fr-Hor10stop  = un maximum de 10 arrets est autorisé dans les rotations des lignes droites horizontales",
  "why_de-Hor10stop  = maximal 10 Stops in horizontalen Rollen erlaubt",
  // added  "^9\\.(9|10)\\. = f" to next 8 for flick checking
  "conv-climbqtrs=^9\\.([1-9]|10)\\.[1267]\\.([1-8]) = $2 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
  "conv-climbstop=^9\\.(1|9|10)\\.[1267]=1 ; ^9\\.2\\.[12]\\.4 = 2 ;^9\\.2\\.[12]\\.6 = 3 ;^9\\.2\\.[12]\\.8 = 4 ;^9\\.4\\.[12]\\.([1-8]) = $1;^9\\.8\\.[12]\\.1 = 2;^9\\.8\\.[12]\\.2 = 4;^9\\.8\\.[12]\\.3 = 6;^9\\.8\\.[12]\\.4 = 8 ; ^9\\.(9|10)\\. = f; ^9\\.=r ; ^0\\.=z",

  "conv-upqtrs=^9\\.([1-9]|10)\\.[16]\\.([1-8]) = $2 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
  "conv-upstop=^9\\.(1|9|10)\\.[16]=1 ; ^9\\.2\\.1\\.4 = 2 ;^9\\.2\\.1\\.6 = 3 ;^9\\.2\\.1\\.8 = 4 ;^9\\.4\\.1\\.([1-8]) = $1; ^9\\.8\\.1\\.1 = 2;^9\\.8\\.1\\.2 = 4;^9\\.8\\.1\\.3 = 6;^9\\.8\\.1\\.4 = 8 ; ^9\\.(9|10)\\. = f; ^9\\.=r ; ^0\\.=z",

  // changed in 2022 (NP2022-17), old regex kept below
  "conv-diagupqtrs=^9\\.([1-9]|10)\\.[27]\\.([1-8]) = $2 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
  "conv-diagupstop=^9\\.1\\.2=1 ;^9\\.(9|10)\\.[27]=1 ; ^9\\.2\\.2\\.4 = 2 ;^9\\.2\\.2\\.6 = 3 ;^9\\.2\\.2\\.8 = 4 ;^9\\.4\\.2\\.([1-8]) = $1; ^9\\.8\\.2\\.1 = 2;^9\\.8\\.2\\.2 = 4;^9\\.8\\.2\\.3 = 6;^9\\.8\\.2\\.4 = 8 ; ^9\\.(9|10)\\. = f; ^9\\.=r ; ^0\\.=z",

  // flicks are counted as 2 stops for application of rules A.2.2.2 and A.2.2.3
  //"conv-diagupqtrs=^9\\.([1-9]|10)\\.[27]\\.([1-8]) = $2 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
  //"conv-diagupstop=^9\\.1\\.2=1 ;^9\\.(9|10)\\.[27]=2 ; ^9\\.2\\.2\\.4 = 2 ;^9\\.2\\.2\\.6 = 3 ;^9\\.2\\.2\\.8 = 4 ;^9\\.4\\.2\\.([1-8]) = $1; ^9\\.8\\.2\\.1 = 2;^9\\.8\\.2\\.2 = 4;^9\\.8\\.2\\.3 = 6;^9\\.8\\.2\\.4 = 8 ; ^9\\.(9|10)\\. = f; ^9\\.=r ; ^0\\.=z",

  "conv-downqtrs=^9\\.([1-9]|10)\\.(5|10)\\.([1-8]) = $3 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
  // 9.8.5.2 (4x8) is converted to 3, to assure allowing it when it exists alone, but not combined with other rolls
  "conv-downstop=^9\\.(1|9|10)\\.(5|10)=1 ; ^9\\.2\\.5\\.4 = 2 ;^9\\.2\\.5\\.6 = 3 ;^9\\.2\\.5\\.8 = 4 ;^9\\.4\\.5\\.([1-8]) = $1; ^9\\.8\\.5\\.1 = 2;^9\\.8\\.5\\.2 = 3;^9\\.8\\.5\\.3 = 6;^9\\.8\\.5\\.4 = 8 ; ^9\\.(9|10)\\. = f; ^9\\.=r ; ^0\\.=z",

  "conv-diagdownqtrs=^9\\.([1-9]|10)\\.[49]\\.([1-8]) = $2 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
  // 9.8.4.2 (4x8) and 9.4.4.4 (4x4) are converted to 3, to assure allowing it when it exists alone, but not combined with other rolls
  "conv-diagdownstop=^9\\.(1|9|10)\\.[49]=1 ; ^9\\.2\\.4\\.4 = 2 ;^9\\.2\\.4\\.6 = 3 ;^9\\.2\\.4\\.8 = 4 ;^9\\.4\\.4\\.([1-3]) = $1; ^9\\.4\\.4\\.4 = 3; ^9\\.4\\.4\\.([5-8]) = $1; ^9\\.8\\.4\\.1 = 2;^9\\.8\\.4\\.2 = 3;^9\\.8\\.4\\.3 = 6;^9\\.8\\.4\\.4 = 8 ; ^9\\.(9|10)\\. = f; ^9\\.=r ; ^0\\.=z",

  "rule-VUP450 = upqtrs:<6",
  "why-VUP450  = a maximum of 450 degrees are allowed on vertical up opposite rolls",
  "why_fr-VUP450  = un maximum de 450° est permis sur les rotations alternées verticales montantes",
  "why_de-VUP450  = maximal 450° für gegenläufige Rollen auf vertikalen Aufwärtslinien",
  "VUP450-rule = Sporting Code Section 6 Part I, A.2.2.2",

  "rule-VUP4S = upstop:<5",
  "why-VUP4S  = a maximum of 4 stops are allowed on vertical up opposite rolls",
  "why_fr-VUP4S  = un maximum de 4 arrets est permis sur les rotations alternées verticales montantes",
  "why_de-VUP4S  = maximal 4 Stops in gegenläufigen Rollen auf vertikalen Aufwärtslinien erlaubt",
  "VUP4S-rule = Sporting Code Section 6 Part I, A.2.2.2",

  "rule-DIAGUP540 = diagupqtrs:<7",
  "why-DIAGUP540  = a maximum of 540 degrees are allowed on diagonal up opposite rolls",
  "why_fr-DIAGUP540  = un maximum de 540° est permis sur les rotations alternées à 45° montant",
  "why_de-DIAGUP540  = maximal 540° in gegenläufigen Rollen auf diagonalen Aufwärtslinien erlaubt",
  "DIAGUP540-rule = Sporting Code Section 6 Part I, A.2.2.2",

  // changed in 2022 (NP2022-17)
  "rule-DIAGUP4S = diagupstop:<5",
  "why-DIAGUP4S  = a maximum of 4 stops are allowed on diagonal up opposite rolls",
  "why_fr-DIAGUP4S  = un maximum de 4 arrets est permis sur les rotations combinées à 45° montant",
  "why_de-DIAGUP4S  = maximal 4 Stops in gegenläufigen Rollen auf diagonalen Aufwärtslinien erlaubt",
  "DIAGUP4S-rule = Sporting Code Section 6 Part I, A.2.2.2 and A.2.2.3",

  "rule-VDOWN360 = downqtrs:<5",
  "why-VDOWN360  = a maximum of 360 degrees are allowed on vertical down opposite rolls",
  "why_fr-VDOWN360  = un maximum de 360° est permis sur les rotations alternées verticales descendantes",
  "why_de-VDOWN360  = maximal 360° in gegenläufigen Rollen auf vertikalen Abwärtslinien erlaubt",
  "VDOWN360-rule = Sporting Code Section 6 Part I, A.2.2.2",

  "rule-VDOWN3S = downstop:<4",
  "why-VDOWN3S  = a maximum of 3 stops are allowed on vertical down opposite rolls",
  "why_fr-VDOWN3S  = un maximum de 3 arrets est permis sur les rotations alternées verticales descendantes",
  "why_de-VDOWN3S  = maximal 3 Stops in gegenläufigen Rollen auf vertikalen Abwärtslinien erlaubt",
  "VDOWN3S-rule = Sporting Code Section 6 Part I, A.2.2.2",

  "rule-DIAGDOWN540 = diagdownqtrs:<7",
  "why-DIAGDOWN540  = a maximum of 540° are allowed on diagonal down opposite rolls",
  "why_fr-DIAGDOWN540  = un maximum de 540° est permis sur les rotations alternées à 45° descendantes",
  "why_de-DIAGDOWN540  = maximal 540° in gegenläufigen Rollen auf diagonalen Abwärtslinien erlaubt",
  "DIAGDOWN540-rule = Sporting Code Section 6 Part I, A.2.2.2",

  "rule-DIAGDOWN3S = diagdownstop:<4",
  "why-DIAGDOWN3S  = a maximum of 3 stops are allowed on diagonal down opposite rolls",
  "why_fr-DIAGDOWN3S  = un maximum de 3 arrets est permis sur les rotations alternées à 45° descendantes",
  "why_de-DIAGDOWN3S  = maximal 3 Stops in gegenläufigen Rollen auf diagonalen Abwärtslinien erlaubt",
  "DIAGDOWN3S-rule = Sporting Code Section 6 Part I, A.2.2.2",

  //note +<6 indicates the total count is less than 6 ... all climbing rolls combined
  "rule-CLIMB450 = climbqtrs:+<6",
  "why-CLIMB450  = a maximum of 450 degrees are allowed on climbing rolls",
  "why_fr-CLIMB450  = un maximum de 450° est permis sur l\'ensemble des rotations montantes",
  "why_de-CLIMB450  = maximal 450° in steigenden Rollen erlaubt",
  "CLIMB450-rule = Sporting Code Section 6 Part I, A.8.1.3",

  "rule-CLIMB4S = climbstop:+<5",
  "why-CLIMB4S  = a maximum of 4 stops are allowed on climbing rolls",
  "why_fr-CLIMB4S  =un maximum de 4 arrets est permis sur l\'ensemble des rotations montantes",
  "why_de-CLIMB4S  = maximal 4 Stops in steigenden Rollen erlaubt",
  "CLIMB4S-rule = Sporting Code Section 6 Part I, A.8.1.3",

  "conv-vdDhfsz=^9\\.[1248]\\.[15]=v; ^9\\.[1248]\\.2=d; ^9\\.[1248]\\.4=D; ^9\\.[1248]\\.=h; ^9\\.(9|10)\\.[38]=h; ^9\\.(9|10)\\.[1-5]=f;^9\\.(9|10)\\.=F; ^9\\.1[12]=s; ^0\\.=z",

  "rule-UnlimitedNOU   = vdDhfsz:D[,;][Ff]|v[,;][fF]|[Ff][,;]v|[Ff][,;]d|[Ff][,;][Ff]",
  "why-UnlimitedNOU    = this type of opposite or unlinked roll/roll (or flick) combination is not allowed",
  "why_fr-UnlimitedNOU = type de rotations combinées interdites",
  "why_de-UnlimitedNOU    = Diese gegenläufige oder unverbundene Rollenkombination ist nicht erlaubt",
  "UnlimitedNOU-rule   = Sporting Code Section 6 Part I, A.2.2",

  // new in 2022 (NP2022-15)
  "conv-3f_vdDhfFsz=^9\\.[1248]\\.[15]=v;^9\\.[1248]\\.2=d;^9\\.[1248]\\.4=D; ^9\\.[1248]\\.=h; ^9\\.9\\.[2-4]\\.3=3f; ^9\\.(9|10)\\.[1-5]=f;^9\\.9\\.[7-9]\\.3=3F;^9\\.(9|10)\\.=F; ^9\\.1[12]=s ; ^0\\.=z",

  "rule-UnlimitedNO3f   = 3f_vdDhfFsz:d[,;]3F|3f[,;]D|h[,;]3F$|[vdDhsz,. ]+ 3F[,;]h$|^3f[,;]h",
  // 45° up | 45° down | Horizontal roll first then flick | Horizontal flick first under g load -> final rotation | Horizontal flick first standard load (+- 1g) -> first or only rotation
  "why-UnlimitedNO3f    = 3/4 flick starting or ending with down rudder is not allowed",
  "why_fr-UnlimitedNO3f = 3/4 déclenché positif départ ou arret pied bas interdit",
  "why_de-UnlimitedNO3f = 3/4 Gerissene/Gestoßene beginnend oder endend mit Seitenruder unten ist nicht erlaubt",

  "rule-In_loop_3f   = 3f_vdDhfFsz:h[,;]3F$|3F[,;]h$",
  "why-In_loop_3f    = 3/4 flick in a loop starting or ending with down rudder is not allowed",
  "why_fr-In_loop_3f = 3/4 déclenché positif dans une boucle départ ou arret pied bas interdit",
  "why_de-In_loop_3f = 3/4 Gerissene/Gestoßene im Loop beginnend oder endend mit Seitenruder unter is nicht erlaubt",

  // New in 2023 (NP2023-9)
//  "Group-two_snaps_figure=[ ,;]9\\.(9|10)\\..*[ ,;]9\\.(9|10)\\.",
//  "two_snaps_figure-name=figure(s) with 2 flicks",
//  "two_snaps_figure-name_fr=figure(s) avec 2 déclenchés",
//  "two_snaps_figure-name_de=Figur(en) mit 2 Gerissenen/Gestoßenen",
//  "two_snaps_figure-max=2",
//  "snap-maxperfig=2",

  // No more than one flick roll per figure
  "Group-one_snaps_figure=[ ,;]9\\.(9|10)\\..*[ ,;]9\\.(9|10)\\.",
  "one_snaps_figure-name=figure(s) with 1 flick",
  "one_snaps_figure-name_fr=figure(s) avec 1 déclenché",
  "one_snaps_figure-name_de=Figur(en) mit  Gerissene/Gestoßene",
  "one_snaps_figure-max=1",
  "snap-maxperfig=1",

  "rule-NF3TOPH   = roll: (.[,;].|[248]) [fF]$",
  "why-NF3TOPH    = no flick roll on vertical down line after hesitation in the loop",
  "why_fr-NF3TOPH = pas de déclenché sur la verticale descendante aprés des facettes dans la boucle",
  "why_de-NF3TOPH = keine Gerissene/Gestoßene auf vertikaler Abwärtslinie nach einer Zeitenrolle im Loopbogen erlaubt",

  "rule-NF2UP360   = upqtrs: ^([5-8]|[1-8][,;]4|4[,;][1-8]|2[,;]3|3[,;][23]) f",
  "why-NF2UP360    = no flick roll on loop top after more than 360 roll going up",
  "why_fr-NF2UP360 = pas de déclenché en haut de boucle si plus de 360° de rotation verticale montante",
  "why_de-NF2UP360 = keine Gerissene/Gestoßene im Loopbogen nach mehr als 360° rollen auf Aufwärtslinie",

  "rule-NF2UP2STOP   = upstop: ^([3-9]|[,;]2|2[,;]) f",
  "why-NF2UP2STOP    = no flick roll on loop top after more than 2 stops going up",
  "why_fr-NF2UP2STOP = pas de déclenché en haut de boucle si plus de 2 arrets en verticale montante",
  "why_de-NF2UP2STOP = keine Gerissene/Gestoßene im Loopbogen nach mehr als 2 Stopps auf der Aufwärtslinie erlaubt",

  "rule-N88   = roll: 8",
  "why-N88    = 8 point roll is not allowed",
  "why_fr-N88 = 8 facettes interdit",
  "why_de-N88    = 8-Zeiten-Rolle nicht erlaubt",

  "rule-NORF   = roll: [1248][,;][Ff]",
  "why-NORF    = roll,flick combination not allowed",
  "why_fr-NORF = combinaison tonneau,déclenché interdite",
  "why_de-NORF    = Rollenkombination Gesteuert + Gerissene/Gestoßene nicht erlaubt",

  "rule-NORDIAGDOWN   = vdDhfsz: D[,;]|[,;]D",
  "why-NORDIAGDOWN    = opposite or unlinked rotation combination on diagonal down line is not allowed",
  "why_fr-NORDIAGDOWN = rotations combinées interdites à lignes 45° descendantes",
  "why_de-NORDIAGDOWN = gegenläufige oder unverbundene Rollenkombination auf diagonaler Abwärtslinie nicht erlaubt",
  "NORDIAGDOWN-rule   = Sporting Code Section 6 Part I, A.4-A.15",

  "allow-defrules=UnlimitedNOU ; VUP450 ; VUP4S ; VDOWN360 ; VDOWN3S ; DIAGUP540 ; DIAGUP4S ; DIAGDOWN540 ; DIAGDOWN3S ; Hor10stop ; UnlimitedNO3f",

  // ~%~  ~i?d%~ ~i?v%~
  "1.1.2.1-4",
  "1.1.3.1-4",
  "1.1.6.1", // "1.1.6.1-4"
  "1.1.6.2 NF:1",
  "1.1.6.3-4",
  "1.1.7.1", // "1.1.7.1-4"
  "1.1.7.2 NF:1",
  "1.1.7.3-4",

  // z_- z^ -iz_ -iz^-

  "1.1.10.1 NORF",
//  "1.1.10.4 NORDIAGDOWN",
  "1.1.11.1 NORF",
//  "1.1.11.4 NORDIAGDOWN",

  // ~%i?t%~  ~%i?k%~

  "1.2.1.1-3", // "1.2.1.1-4",
  "1.2.2.1-3", // "1.2.2.1-4"
  "1.2.3.1-4",
  "1.2.4.1-4",
  "1.2.5.1", // "1.2.5.1-4"
  "1.2.5.2 NF:1", // Added
  "1.2.5.4", // Added
  "1.2.6.1-3", // "1.2.6.1-4"
  "1.2.6.2 NF:1",
  "1.2.6.3", 
  "1.2.7.1", // "1.2.7.1-4"
  "1.2.7.2 NF:1",
  "1.2.7.4", // Added
  "1.2.8.1", // "1.2.8.1-4"
  "1.2.8.2 NF:1",
  "1.2.8.3", 

  // ~[21]jo?1~   ~2j(|o|io|oi)2~ ~4j(|o|io|oi)[234]~ ~3j(|o|io|oi)3~
  //              ~2j(|o|oi)15~        ~3j(|o|io|oi)15~

  "2.1.3.1-4",
  "2.2.2.1-4",

  "2.2.5.1-4",
  "2.4.3.1-4",
  "2.3.4.1-4",
  "2.4.5.1-4",
  "2.4.7.1-4",
  "2.2.6.1-4",
  "2.4.4.1-4",
  "2.3.5.1-4",
  "2.4.6.1-4",
  "2.4.8.1-4",

  "2.2.3.1-4",
  "2.3.2.1-4",
  "2.2.4.1-4",
  "2.3.3.1-4",

  // ~%h%~ ~%i?ta%~

  "5.2.1.1", // "5.2.1.1-4"
  "5.2.1.2 NF:1",
  "5.2.1.3",
  "5.2.1.4 NF:1",
  "5.3.1.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450",
  "5.3.2.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450",

  // tailslides
  "6.2.1.1-4 NF:1", //   "6.2.1.1-4 
  "6.2.2.1-4 NF:1", //   "6.2.2.1-4

  //half loops
  // ~%a%~ ~%m%~ ~o%~ io% -io%-  ~i?qo%~ %dq% -%idq%- qq -iqq-

  "7.2.1.1-2  NF:1",
  "7.2.2.1-2  NF:1",
  "7.2.3.1-2  NF:1",
  "7.2.4.1-2  NF:1",

  "7.2.1.3-4  NF:2",
  "7.2.2.3-4  NF:2",
  "7.2.3.3-4  NF:2",
  "7.2.4.3-4  NF:2",

  //goldfish
  // ~%i?g%~
  "7.3.1.1-4",
  "7.3.2.1-4",
  "7.3.3.1-4",
  "7.3.4.1-4",

  //loops
  "7.4.1.1-2 NOU:1 ; ^UnlimitedNO3f ; In_loop_3f",
  "7.4.1.3-4 NOU:1 ; NF:1 ; N88 ; ^UnlimitedNO3f ; In_loop_3f",
  "7.4.2.1-2 NOU:1 ; ^UnlimitedNO3f ; In_loop_3f",
  "7.4.2.3-4 NOU:1 ; NF:1 ; ^UnlimitedNO3f ; In_loop_3f",
  "7.4.3.1", // "7.4.3.1-2"
  "7.4.3.2 NF:1",
  "7.4.3.3-4 NF:1",
  "7.4.4.1", // "7.4.4.1-2"
  "7.4.4.2 NF:1",
  "7.4.4.3-4 NF:1",

  "7.4.5.1  NF:1 ; NORDIAGDOWN",
  "7.4.5.4  NF:2 ; NORDIAGDOWN",
  "7.4.6.1",

  //cc
  // ~%i?cc%~
  "7.8.1.1-2 NF:1",
  "7.8.2.1-2 NF:1",
  "7.8.3.1 NF:1",
  "7.8.4.1 NF:1",

  "7.8.1.3-4",
  "7.8.2.3-4",
  "7.8.3.4",
  "7.8.4.4",

  //rcc
  "7.8.5.1-2 NF:3",
  "7.8.6.2 NF:3",
  "7.8.7.1-2 NF:3",
  "7.8.8.1 NF:3",

  "7.8.5.3-4",
  "7.8.6.3",
  "7.8.7.3-4",
  "7.8.8.4",

  //bumps
  // ~%i?p?b%~
  "8.4.1.1", // "8.4.1.1-4"
  "8.4.1.2 NF:1",
  "8.4.1.4",
  "8.4.2.1", // "8.4.2.1-4"
  "8.4.2.2 NF:1",
  "8.4.2.4",
  "8.4.3.1", // "8.4.3.1-4"
  "8.4.3.2 NF:1",
  "8.4.3.3",
  "8.4.4.1", // "8.4.4.1-4"
  "8.4.4.2 NF:1",
  "8.4.4.3",

  // %db%~   ~%rdb%~  ~%irdb%~
  "8.4.13.1",
  "8.4.14.1",
  "8.4.15.1-2 NORDIAGDOWN", // "8.4.15.1-4 NORDIAGDOWN"
  "8.4.15.4 NORDIAGDOWN",
  "8.4.16.1-2 NORDIAGDOWN", // "8.4.16.1-4 NORDIAGDOWN"
  "8.4.16.4 NORDIAGDOWN",
  "8.4.17.1-3 NORDIAGDOWN", // "8.4.17.1-4 NORDIAGDOWN"
  "8.4.18.1-3 NORDIAGDOWN", // "8.4.18.1-4 NORDIAGDOWN"

  //rc
  // ~%i?c%~  ~%i?rc%~ ~%i?rp%~
  "8.5.1.1-2  NF:2",
  "8.5.2.1-2  NF:2",
  "8.5.3.1-2  NF:2",
  "8.5.4.1-2  NF:2",
  "8.5.1.3-4",
  "8.5.2.3-4",
  "8.5.3.3-4",
  "8.5.4.3-4",

  //rp
  "8.6.1.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP",
  "8.6.1.2  NF:1; NOU:2; NF:3; NF2UP360; NF2UP2STOP", // NF:1 added
  "8.6.2.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP",
  "8.6.2.2  NF:1; NOU:2; NF:3; NF2UP360; NF2UP2STOP", // NF:1 added
  "8.6.3.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP",
  "8.6.3.2  NF:1; NOU:2; NF:3; NF2UP360; NF2UP2STOP", // NF:1 added
  "8.6.4.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP",
  "8.6.4.2  NF:1; NOU:2; NF:3; NF2UP360; NF2UP2STOP", // NF:1 added

//  "8.6.1.3-4",
//  "8.6.3.3-4",
//  "8.6.2.3-4",
//  "8.6.4.3-4",

  //c
  "8.5.5.1-2  NF:1",
  "8.5.6.1-2  NF:1",
  "8.5.7.1-2  NF:1",
  "8.5.8.1-2  NF:1",
  "8.5.5.3-4",
  "8.5.6.3-4",
  "8.5.7.3-4",
  "8.5.8.3-4",

  //p
  "8.6.5.1-2  NOU:2 ; NF:1 ; NF3TOPH",
  "8.6.6.1-2  NOU:2 ; NF:1 ; NF3TOPH",
  "8.6.7.1-2  NOU:2 ; NF:1 ; NF3TOPH",
  "8.6.8.1-2  NOU:2 ; NF:1 ; NF3TOPH",
//  "8.6.5.3-4",
//  "8.6.6.3-4",
//  "8.6.7.3-4",
//  "8.6.8.3-4",

  // double bumps
  "8.8.1.1 NOU",
  "8.8.1.4 NOU",
  "8.8.2.1 NOU",
  "8.8.5.1 NOU",
  "8.8.6.1 NOU",
  "8.8.7.2 NOU",
  "8.8.8.2 NOU",
  "8.8.6.3 NOU",
  "8.8.7.3 NOU",
  "8.8.8.3 NOU",

  // ROLLS
  // v[42315] d[216] [42316]   id[216] iv[4231]
  "9.1.1.1-5",
  "9.1.2.1-6",
  "9.1.3.1-8",
  "9.1.4.1-4", // Added 9.1.4.1 and 9.1.4.3 in 2022 (NP2022-13)
  "9.1.4.6",
  "9.1.5.1-4",

  // v22 d22 [23]2   id22 iv22

  "9.2.1.4",
  "9.2.2.4",
  "9.2.2.6",
  "9.2.3.4",
  "9.2.3.6",
  "9.2.3.8",
  "9.2.4.4",
  "9.2.4.6", // Added 2022 (NP2022-12)
  "9.2.5.4",

  // v[234]4  d[24]4 [234]4 id[24]4 iv[23]4

  "9.4.1.2-4",
  "9.4.2.2-4",
  "9.4.3.2-4",
  "9.4.4.2-4", // Added 9.4.4.3 in 2022 (NP2022-13)
  "9.4.5.2-3",

  // v4?8  d48 [48]8  id48 iv4?8

  "9.8.1.1-2",
  "9.8.2.1-2",
  "9.8.3.1-2",
  "9.8.3.4",
  "9.8.4.1-2",
  "9.8.5.1-2",

  //snaps & spins
  // ~v[231]f   ~d[21]f  ~[21]f  ~id[21]f  ~iv[231]f  6f id6f
  // ~v[231]if  ~d[21]if ~[21]if ~id[21]if ~iv[231]if  -6if
  "9.9.1.2", // "9.9.1.2-4"
  "9.9.1.4",
  "9.9.2.2", // "9.9.2.2-4"
  "9.9.2.4",  
  "9.9.3.2",  // "9.9.3.2-4"
  "9.9.3.4",  
  "9.9.3.6",
  "9.9.4.2",  // "9.9.4.2-4"
  "9.9.4.4",
  "9.9.4.6",
  "9.9.5.2", // "9.9.5.2-4"
  "9.9.5.4",
// "9.9.6.2-4"
// "9.9.7.2-4"
// "9.9.8.2-4"
// "9.9.9.2-4"
// "9.9.10.2-4"

//  "9.10.1.2-4",
  "9.10.2.2",
  "9.10.2.4",
  "9.10.3.2",
  "9.10.3.4",
  "9.10.3.6",
  "9.10.4.2",
  "9.10.4.4",
  "9.10.5.2-4",
  "9.10.6.2-4",
//  "9.10.7.2",
//  "9.10.7.4",
//  "9.10.8.2",
//  "9.10.8.4",
//  "9.10.9.2",
//  "9.10.9.4",
  "9.10.10.2-4",

  // [156]i?s

  "9.11.1.4-6",
  "9.12.1.4-6",

  // what info should be filled out
  "infocheck=pilot;actype;acreg;positioning",

  
  //######################################################################################
  //##### SAA SPORTSMAN FREE #############################################################
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
  "fam748488-name=Family 7.4 (Whole Loops), 8.4 (Humpty Bumps) or 8.8 (Double Humpty Bumps)",
  "fam748488-min=1",
  
  // at least one figure each from sub-family 9.1.x.x to 9.4.x.x
  "froll-min=1",
  "hroll-min=1",
  "qroll-min=1",
  
  // only one figure from sub-family 9.11.1.x or 9.12.1.x
  "spin-min=1",
  "spin-max=1",
  
  // what info should be filled out
  "infocheck=pilot;actype;acreg;positioning"
  
  
  // Close the rules.push arguments
);