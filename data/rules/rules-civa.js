﻿/* OpenAero rules-civa.js file

This file is part of OpenAero.

OpenAero was originally designed by Ringo Massa and built upon ideas
of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

OpenAero is Free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

OpenAero is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.

This file defines year and rule type specific rules
---------------------------------------------------------------------------------------

CIVA 2011, written and updated by Michael Golan, April 2011, based on Section 6 version 2011-1

Recopie par GG de rules11-CIVA avec intégration des régles Civa modifiées pour 2012.
Ces modifications sont signalées par "# Modif GG évolution Civa 2012".

Puis changement de la numerotation en pseudo numerotation 2012

Modifications 2013 (ajout Prog Q 2013, Suppression Prog Free)  V 2013.0.50

Added Yak 52 for 2013
OpenAero 1.3.4:
-Updated Free Unknown additionals info
OpenAero 1.3.7:
-Corrected Yak52 Free rules for figure repetition
-Moved rules from Intermediate to Yak52 as they are identical
OpenAero 1.3.8
-Added code for flick checking in conv-climbqtrs and others
-Fixed missing "no flick roll on vertical down line after hes..."
-Improved sequence naming and added "Programme1-4"
-Corrected positioning K for 2013 rules
OpenAero 1.4.0
-Updated checks for 8.5.1.4 for 2014 rules 
OpenAero 1.4.3
-corrected rules for 8.6.1-8 column 3&4
-corrected conv-downstop to allow 9.8.5.2 (4x8) in Unlimited Unknown
OpenAero 1.4.6
-corrected 7.8.15.1 to 7.8.15.3 in Intermediate Unknown
OpenAero 1.5.0
-removed from Yak 52/Intermediate Unknown:
 7.8.4.1 7.8.8.1 7.8.13.1 7.8.15.3 7.8.16.1 7.8.16.4
OpenAero 1.5.2.3
-added (temporary) CIVA Free Known rules
OpenAero 2016.1
-Changed to 2016 rules:
 - New Free Known (Programme1)
 - Kept Known and Free as hidden options to allow old sequence rule
   checking
 - Changed programmes 2-4
 - removed Program (i.s.o. Programme). Obsolete since 2013
OpenAero 2016.2
-added several rule references, using the new x-y-rule=... syntax
OpenAero 2016.2.2
-added MAX360 for Advanced Unknown figure 7.4.1.2
OpenAero 2016.3.2
-added SuperFamiles to Unlimited and Yak52/Intermediate Free Known
OpenAero 2016.3.2
-removed SuperFamiles from all Free Known programmes
2017.1
- updated reference and example sequences for 2017
- added tailslides to Advanced Free Unknown
- added double bumps to Advanced and Unlimited Free Unknown
2017.1.1
- added 8.8.1.4 to Unlimited Unknown
2017.2.1
- fixed A.17.1.3 rule checking for Advanced Unknown
2018.1
- updated to 2018 rules and sequences
2018.1.4
- removed 2015 rules (Known and Free)
- corrected required rolling turns for Free Known 
2018.3
- changed Advanced Free Known reference sequence again
2019.1.3
- added correct reference sequences for 2019
2020.1
- added reference sequences for 2020
- flick rolls on vertical up of tailslides are now allowed in Unlimited Unknown
2021.1
- added reference sequences for 2021
- updated Unlimited Unknown rules with addition of allowed rolls on 45 up and down lines
  (NP2021-20, NP2021-22 and NP2021-23)
- removed roller-min for 2021 Unlimited Free Known due to CIVA waiver
2021.1.10
- Added missing figure 2.2.7 to allowed required figure for Advanced Free Known
2022.1.1
- added reference sequences for 2022
- updated Unlimited Unknown rules with addition of hesitation rolls, 3/4 snaps and versatility
  (NP2022-12,13,14,15,17,22)
2023.1.1
- Added reference sequences for 2023
- Added figures 7.4.2.3 and 7.4.2.4 to Unlimited Unknown (NP2023-2)
- Added maximum of 2 flick rolls per figure in 2 figures in Unlimited Unknown (NP2023-9)
- Removed Yak52 category from selectable categories (NP2023-12)
2023.2.2
- Simplified Unknown rules for allowed figures
  Unlimited: 1.1.x, 1.2.x, 7.3.x, 7.8.x, 8.4.x, 8.5.x
  Advanced : 9.1.x
2024.1.1
- Added reference sequences for 2024
2024.1.4
- Added CIVA Excellence rules, copied from France (DISABLED for now)
2025.1.1
- Removed double negative Horizontal "8" figures from allowed Unknowns
- Updated reference sequences for 2025
2025.1.3
- Added k-min to all Free Known sequences to match the Known set
  Minimum Total K
*/

// open the rules.push command
rules.push(
"year=2025",
    //#######################################################################################
    //#
    //# Define Unlimited programmes.

    "[CIVA Unlimited Programme1]",
    "more=CIVA Unlimited Free Known",
    "[CIVA Unlimited Programme2]",
    "more=CIVA Unlimited Unknown1",
    "[CIVA Unlimited Programme3]",
    "more=CIVA Unlimited Unknown2",
    "[CIVA Unlimited Programme4]",
    "more=CIVA Unlimited Unknown3",

    //######################################################################################
    //##### CIVA UNLIMITED FREE ############################################################
    //######################################################################################

    "(CIVA Unlimited Free)",
    "posnl=40",//assume no line judges
    "poslj=20",
    "k-min=225", // Minimum K for the Known set (2.2.1.4)
    "k-max=420",

    "more=CIVA/IAC Unlimited Free",

    //######################################################################################
    //##### CIVA/IAC UNLIMITED FREE ########################################################
    //######################################################################################

    "(CIVA/IAC Unlimited Free)",

    "basefig-max=9",

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

    "spin-min=1",//not clear if one spin is required:

    "isnap-min=2",
    "osnap-min=2",

    "opposite-min=1",//one opposite roll is required!

    // "allow=^[1-9]",//all figures are allowed for the Free Programme

    // what info should be filled out
    "infocheck=pilot;actype;acreg;positioning",

    // Super Families
    "sf=^2\\.:2;^5\\.:5;^6\\.:6;^1\\.:7;^3\\.:7;^7\\.:7;^8\\.:7;^0\\.:7",

    //######################################################################################
    //##### CIVA UNLIMITED FREE KNOWN ######################################################
    //######################################################################################

    "[CIVA Unlimited Free Known]",
    "posnl=40",//assume no line judges
    "poslj=20",

    'reference="@A" -.\'pn(3f,3.\'). "@B" 4% /``+```5s,24..\';>iBpb(````````,3if\').\',8\',4 "@C" 48dh(4)5if\'~ "@D" /~3jio15-`` "@E" ````+\'\'1ac(\'22`),3\'\',7+``````',

    "more=CIVA/IAC Unlimited Free Known",

    //######################################################################################
    //##### CIVA/IAC UNLIMITED FREE KNOWN ##################################################
    //######################################################################################

    "(CIVA/IAC Unlimited Free Known)",

    "basefig-min=10",
    "basefig-max=10",
    "k-min=225", // Minimum K for the Known set (2.2.1.4)
    "k-max=450",

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

    // "allow=^[1-9]",//all figures are allowed for the Free Programme

    "figure-letters=ABCDE",

    // what info should be filled out
    "infocheck=pilot;actype;acreg;positioning",

    //#######################################################################################
    //##### CIVA UNLIMITED UNKNOWNS #########################################################
    //#######################################################################################

    "[CIVA Unlimited Unknown1]",
    "more=CIVA Unlimited FreeUnknown",
    "(CIVA Unlimited 1stUnknown)",
    "more=CIVA Unlimited FreeUnknown",

    "[CIVA Unlimited Unknown2]",
    "more=CIVA Unlimited FreeUnknown",
    "(CIVA Unlimited 2ndUnknown)",
    "more=CIVA Unlimited FreeUnknown",

    "[CIVA Unlimited Unknown3]",
    "more=CIVA Unlimited FreeUnknown",

    "(CIVA Unlimited FreeUnknown)",
    "additionals=4/24",
    "figure-letters=ABCDEFGHIJ",

    "more=CIVA Unlimited Unknown",

    "(CIVA Unlimited Unknown)",
    "poslj=10",
    "posnl=40",
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
    "one-max=2",
    "two-max=2",
    "isnap-max=4",
    "osnap-max=4",
    "vsnap-min=2", // changed in 2022 (NP2022-22)
    "snap-max=8", // changed in 2022 (NP2022-22)

    "snap-maxperfig=1",

    "k-minperfig=22",

    "basefig-min=10",
    "basefig-max=10",

    "basefig-repeat=1",
    "roll-repeat=1",
    "snap-repeat=1",
    "spin-repeat=1",

    "more=CIVA Unlimited Unknownbase",

    //# a single Unknown figure, without sequence requirements
    "(CIVA Unlimited Unknownfigure)",
    "snap-maxperfig=1",
    "k-minperfig=22",
    "basefig-repeat=1",
    "roll-repeat=1",
    "snap-repeat=1",
    "spin-repeat=1",
    "more=CIVA Unlimited Unknownbase",

    //###################################################################################################
    "(CIVA Unlimited Unknownbase)",

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
    "Group-two_snaps_figure=[ ,;]9\\.(9|10)\\..*[ ,;]9\\.(9|10)\\.",
    "two_snaps_figure-name=figure(s) with 2 flicks",
    "two_snaps_figure-name_fr=figure(s) avec 2 déclenchés",
    "two_snaps_figure-name_de=Figur(en) mit 2 Gerissenen/Gestoßenen",
    "two_snaps_figure-max=2",
    "snap-maxperfig=2",

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
"1.1.6.1-4",
"1.1.7.1-4",

// z_- z^ -iz_ -iz^-

"1.1.10.1 NORF",
"1.1.10.4 NORDIAGDOWN",
"1.1.11.1 NORF",
"1.1.11.4 NORDIAGDOWN",

// ~%i?t%~  ~%i?k%~

"1.2.1.1-4",
"1.2.2.1-4",
"1.2.3.1-4",
"1.2.4.1-4",
"1.2.5.1-4",
"1.2.6.1-4",
"1.2.7.1-4",
"1.2.8.1-4",

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

"5.2.1.1-4",
"5.3.1.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450",
"5.3.2.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450",

// tailslides
"6.2.1.1-4",
"6.2.2.1-4",

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
"7.4.3.1-2",
"7.4.3.3-4 NF:1",
"7.4.4.1-2",
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
"8.4.1.1-4",
"8.4.2.1-4",
"8.4.3.1-4",
"8.4.4.1-4",

// %db%~   ~%rdb%~  ~%irdb%~
"8.4.13.1",
"8.4.14.1",
"8.4.15.1-4 NORDIAGDOWN",
"8.4.16.1-4 NORDIAGDOWN",
"8.4.17.1-4 NORDIAGDOWN",
"8.4.18.1-4 NORDIAGDOWN",

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
"8.6.1.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP",
"8.6.3.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP",
"8.6.2.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP",
"8.6.4.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP",

"8.6.1.3-4",
"8.6.3.3-4",
"8.6.2.3-4",
"8.6.4.3-4",

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
"8.6.5.3-4",
"8.6.6.3-4",
"8.6.7.3-4",
"8.6.8.3-4",

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
"9.9.1.2-4",
"9.9.2.2-4", // Added 9.9.2.3 in 2022 (NP2022-15)
"9.9.3.2-4", // Added 9.9.3.3 in 2022 (NP2022-15)
"9.9.3.6",
"9.9.4.2-4", // Added 9.9.4.3 in 2022 (NP2022-15)
"9.9.4.6",
"9.9.5.2-4",
"9.9.6.2-4",
"9.9.7.2-4", // Added 9.9.7.3 in 2022 (NP2022-15)
"9.9.8.2-4", // Added 9.9.8.3 in 2022 (NP2022-15)
"9.9.9.2-4", // Added 9.9.9.3 in 2022 (NP2022-15)
"9.9.10.2-4",

"9.10.1.2-4",
"9.10.2.2",
"9.10.2.4",
"9.10.3.2",
"9.10.3.4",
"9.10.3.6",
"9.10.4.2",
"9.10.4.4",
"9.10.5.2-4",
"9.10.6.2-4",
"9.10.7.2",
"9.10.7.4",
"9.10.8.2",
"9.10.8.4",
"9.10.9.2",
"9.10.9.4",
"9.10.10.2-4",

// [156]i?s

"9.11.1.4-6",
"9.12.1.4-6",

// what info should be filled out
"infocheck=positioning",

//#######################################################################################
//#
//# Define Excellence programmes.

//"[CIVA Excellence Programme1]",
//"more=CIVA Excellence Known",

//"[CIVA Excellence Programme2]",
//"more=CIVA Excellence Known",

"(CIVA Excellence Known)",
"poslj=35",
"posnl=35",
"floating-point=0",
"k-max=350",
"basefig-min=9",
"basefig-max=9",
"allow=^[1-9]",

//#######################################################################################
//##### CIVA EXCELLENCE UNKNOWNS ########################################################
//#######################################################################################

//    "[CIVA Excellence Programme3]",
//    "more=CIVA Excellence Unknown",

//    "[CIVA Excellence Programme4]",
//    "more=CIVA Excellence Unknown",

    "(CIVA Excellence Unknown)",
    "poslj=35",
    "posnl=35",
    "floating-point=0",
    "k-max=350",
    "snap-max=5",
    "isnap-min=2",
    "osnap-min=2",
    "group-vsnap=^9\.(9|10)\.[16]\.",
    "vsnap-name=vertically climbing flick(s)",
    "vsnap-name_fr=déclenché(s) ascendant vertical",
    "vsnap-name_de=vertikal aufwärts Gerissene/Gestoßene",
    "vsnap-min=1",
    "vsnap-max=2",
    "conv-interdit=^[09]\.=N",
    "rule-Interdite = interdit:N",
    "why-Interdite = Illegal base figure",
    "why_fr-Interdite = Figure de base interdite",
    "conv-horstop=^9\.(1|9|10)\.[38]=1;^9\.2\.3\.4 = 2;^9\.2\.3\.6 = 3;^9\.2\.3\.8 = 4;^9\.4\.3\.([1-8]) = $1;^9\.8\.3\.1 = 2;^9\.8\.3\.2 = 4;^9\.8\.3\.3 = 6;^9\.8\.3\.4 = 8;^9\.=r;^0\.=z",
    "rule-Hor10stop = horstop:<11",
    "why_fr-Hor10stop = un maximum de 10 arrets est autorisé dans les rotations des lignes droites horizontales",
    "why-Hor10stop = a maximum of 10 stops are allowed on straight horizontal lines rolls",
    "conv-roll_R4=^9\.4\.1\.2=A;^9\.1\.1\.[1-4]=A;^9\.([1248])\.=$1;^9\.(9|10)\.([6-9]|10)=F;^9\.(9|10)=f;^9\.1[12]=s;^0\.=z",
    "rule-R4 = roll_R4:^s ([^Az]|\w[,;])",
    "why-R4 = illegal roll on the climbing line after a spin on the descending line",
    "why_fr-R4 = pas de déclenché ou pas cette rotation dans la branche montante avec une vrille dans la branche descendante",
    "conv-roll_R6=^9\.10\.8\.2=X;^9\.([1248])\.=$1;^9\.(9|10)\.([6-9]|10)=F;^9\.(9|10)=f;^9\.1[12]=s;^0\.=z",
    "rule-R6 = roll_R6:X",
    "why-R6 = illegal flick, except on figures 7.2.2.1, 7.2.4.2, 8.5.3.3, 8.5.4.4, 8.6.2.4 and 8.6.4.3",
    "why_fr-R6 = ce déclenché est interdit. Sauf sur les figures 7.2.2.1, 7.2.4.2, 8.5.3.3, 8.5.4.4, 8.6.2.4 et 8.6.4.3",
    "rule-VDOWN180 = downqtrs:<3",
    "why-VDOWN180 = a maximum of 180° of rotation is allowed",
    "why_fr-VDOWN180 = un maximum de 180° de rotation est permis",
    "rule-VDOWN270 = downqtrs:<4",
    "why-VDOWN270 = a maximum of 270° of rotation is allowed",
    "why_fr-VDOWN270 = un maximum de 270° de rotation est permis",
    "rule-VDOWN1S = downstop:<2",
    "why-VDOWN1S = no stops allowed",
    "why_fr-VDOWN1S = pas de facette permise",
    "rule-R10 = roll:^((\w[,;][fF])|[fF]|([fF][,;]\w)) [1248]",
    "why-R10 = no rotation on the descent with a flick roll on the climbing part",
    "why_fr-R10 = pas de rotation dans la branche descendante avec un déclenché dans la branche montante",
    "conv-roll_R11=^9\.1\.1\.[12]=A;^9\.([1248])\.=$1;^9\.(9|10)\.([6-9]|10)=F;^9\.(9|10)=f;^9\.1[12]=s;^0\.=z;",
    "rule-R11 = roll_R11:(^((\w[,;][A1248fF])|[1248fF]|([A1248fF][,;]\w)) [1248])|(^[^zA]+ [1248])|(^[^z]+ [fF])",
    "why-R11 = combination of climbing roll and roll in top is not allowed",
    "why_fr-R11 = cette combinaison de rotation montante et sommitale est interdite",
    "conv-roll_R14=^9\.1\.5\.[123]=A;^9\.([1248])\.=$1;^9\.(9|10)\.([6-9]|10)=F;^9\.(9|10)=f;^9\.1[12]=s;^0\.=z",
    "rule-R14 = roll_R14:^[\w,;]+ ([^z]|(\w[,;]\w)) ([^Az]|(\w[,;]))",
    "why-R14 = no descending roll allowed after a roll in top",
    "why_fr-R14 = cette rotation descendante est interdite en presence d'une rotation au sommet",
    "conv-roll_R15=^9\.1\.5\.[1-2]=A;^9\.([1248])\.=X;^9\.(9|10)\.([6-9]|10)=F;^9\.(9|10)=f;^9\.1[12]=s;^0\.=z",
    "rule-R15 = roll:s[,;][fFX]",
    "why-R15 = illegal roll after spin",
    "why_fr-R15 = pas de déclenché ou cette rotation après une vrille",
    "conv-doret_dos=^9\.1\.1\.[5-8]=v;^9\.4\.1\.[4-8]=v;^9\.8\.1\.[2-8]=v;^9\.[12]\.5\.[4-8]=n;^9\.[48]\.5\.[3-8]=n;^9\.(9|10)\.(5|10)\.=n;^9\.([1248])\.=r;^9\.(9|10)=f;^9\.1[12]=s;^0\.=z",
    "rule-No_depart_dos = doret_dos:^v",
    "why-No_depart_dos = no inverted start before this vertical roll",
    "why_fr-No_depart_dos = pas de départ dos avec cette rotation verticale",
    "rule-No_sortie_dos = doret_dos:n$",
    "why-No_sortie_dos = no inverted exit after this vertical roll",
    "why_fr-No_sortie_dos = pas de sortie dos avec cette rotation verticale",
    "conv-climbqtrs=^9\.([1-9]|10)\.[1267]\.([1-8]) = $2;^9\. = r;^0\.=z",
    "conv-climbstop=^9\.(1|9|10)\.[1267]=1;^9\.2\.[12]\.4 = 2;^9\.2\.[12]\.6 = 3;^9\.2\.[12]\.8 = 4;^9\.4\.[12]\.([1-8]) = $1;^9\.8\.[12]\.1 = 2;^9\.8\.[12]\.2 = 4;^9\.8\.[12]\.3 = 6;^9\.8\.[12]\.4 = 8;^9\.=r;^0\.=z",
    "conv-upqtrs=^9\.([1-9]|10)\.[16]\.([1-8]) = $2;^9\. = r;^0\.=z",
    "conv-upstop=^9\.(1|9|10)\.[16]=1;^9\.2\.1\.4 = 2;^9\.2\.1\.6 = 3;^9\.2\.1\.8 = 4;^9\.4\.1\.([1-8]) = $1;^9\.8\.1\.1 = 2;^9\.8\.1\.2 = 4;^9\.8\.1\.3 = 6;^9\.8\.1\.4 = 8;^9\.=r;^0\.=z",
    "conv-diagupqtrs=^9\.([1-9]|10)\.[27]\.([1-8]) = $2;^9\. = r;^0\.=z",
    "conv-diagupstop=^9\.1\.2=1;^9\.(9|10)\.[27]=2;^9\.2\.2\.4 = 2;^9\.2\.2\.6 = 3;^9\.2\.2\.8 = 4;^9\.4\.2\.([1-8]) = $1;^9\.8\.2\.1 = 2;^9\.8\.2\.2 = 4;^9\.8\.2\.3 = 6;^9\.8\.2\.4 = 8;^9\.=r;^0\.=z",
    "conv-downqtrs=^9\.([1-9]|10)\.(5|10)\.([1-8]) = $3;^9\. = r;^0\.=z",
    "conv-downstop=^9\.(1|9|10)\.(5|10)=1;^9\.2\.5\.4 = 2;^9\.2\.5\.6 = 3;^9\.2\.5\.8 = 4;^9\.4\.5\.([1-8]) = $1;^9\.8\.5\.1 = 2;^9\.8\.5\.2 = 3;^9\.8\.5\.3 = 6;^9\.8\.5\.4 = 8;^9\.(9|10)\. = f;^9\.=r;^0\.=z",
    "rule-VUP450 = upqtrs:<6",
    "why-VUP450 = un maximum de 450° est permis sur les rotations alternées verticales montantes",
    "why_en-VUP450 = a maximum of 450° are allowed on vertical up opposite rolls",
    "rule-DIAGUP540 = diagupqtrs:<7",
    "why-DIAGUP540 = un maximum de 540° est permis sur les rotations alternées à 45° montant",
    "why_en-DIAGUP540 = a maximum of 540° are allowed on diagonal up opposite rolls",
    "rule-VUP4S = upstop:<5",
    "why-VUP4S = un maximum de 4 arrets est permis sur les rotations alternées verticales montantes",
    "why_en-VUP4S = a maximum of 4 stops are allowed on vertical up opposite rolls",
    "rule-DIAGUP4S = diagupstop:<5",
    "why-DIAGUP4S = un maximum de 4 arrets (3 si déclenché) est permis sur les rotations combinées à 45° montant",
    "why_en-DIAGUP4S = a maximum of 4 stops (3 if snap) are allowed on diagonal up opposite rolls",
    "rule-CLIMB450 = climbqtrs:+<6",
    "why-CLIMB450 = un maximum de 450° est permis sur l'ensemble des rotations montantes",
    "why_en-CLIMB450 = a maximum of 450° are allowed on climbing rolls",
    "rule-CLIMB4S = climbstop:+<5",
    "why-CLIMB4S = un maximum de 4 arrets est permis sur l'ensemble des rotations montantes",
    "why_en-CLIMB4S = a maximum of 4 stops are allowed on climbing rolls",
    "rule-VDOWN360 = downqtrs:<5",
    "why-VDOWN360 = un maximum de 360° est permis sur les rotations alternées verticales descendantes",
    "why_en-VDOWN360 = a maximum of 360° are allowed on vertical down opposite rolls",
    "rule-VDOWN3S = downstop:<4",
    "why-VDOWN3S = un maximum de 3 arrets est permis sur les rotations alternées verticales descendantes",
    "why_en-VDOWN3S = a maximum of 3 stops are allowed on vertical down opposite rolls",
    "conv-vdDhfsz=^9\.[1248]\.[15]=v;^9\.[1248]\.2=d;^9\.[1248]\.4=D;^9\.[1248]\.=h;^9\.(9|10)\.[1-5]=f;^9\.(9|10)\.=F;^9\.1[12]=s;^0\.=z",
    "rule-UnlimitedNOU =vdDhfsz: D[,;]|[,;]D|v[,;][fF]|[Ff][,;]v|[Ff][,;]d",
    "why-UnlimitedNOU = rotations combinées interdites",
    "why_en-UnlimitedNOU = opposite or unlinked roll/roll (or flick) combination is not allowed",
    "rule-UnlimitedNOUF =vdDhfsz: d[,;]F",
    "why-UnlimitedNOUF = sous 45° montant rotation combinée tonneau/déclenché \"gros K\" interdite",
    "why_en-UnlimitedNOUF = 45-up roll/flick (\"hard way\") combination is not allowed",
    "rule-NF3TOPH =roll: (.[,;].|248) [fF]$",
    "why-NF3TOPH = pas de déclenché sur la verticale descendante aprés des facettes dans la boucle",
    "why_en-NF3TOPH = no flick roll on vertical down line after hesitation in the loop",
    "rule-NF2UP360 = upqtrs: ^([5-8]|[,;]4|4[,;]|2[,;]3|3[,;][23]) f",
    "why-NF2UP360 = pas de déclenché en haut de boucle si plus de 360° de rotation verticale montante",
    "why_en-NF2UP360 = no flick roll on loop top after more than 360° roll going up",
    "rule-NF2UP2STOP = upstop: ^([3-9]|[,;]2|2[,;]) f",
    "why-NF2UP2STOP = pas de déclenché en haut de boucle si plus de 2 arrets en verticale montante",
    "why_en-NF2UP2STOP = no flick roll on loop top after more than 2 stops going up",
    "rule-N88 = roll: 8",
    "why-N88 = 8 facettes interdit",
    "why_en-N88 = 8 point roll is not allowed",
    "rule-NORF = roll: [1248][,;]f",
    "why-NORF = combinaison tonneau,déclenché interdite",
    "why_en-NORF = roll,flick combination not allowed",

    "allow-defrules=UnlimitedNOU ; VUP450 ; VUP4S ; VDOWN360 ; VDOWN3S ; DIAGUP540 ; DIAGUP4S ; DIAGDOWN540 ; DIAGDOWN3S ; Hor10stop ; UnlimitedNO3f",

    //"allow=^[1-9]",
    "1.1.10.1 NORF",
    "1.1.11.1 NORF",
    "1.1.2.1",
    "1.1.2.2 NORF",
    "1.1.2.3-4",
    "1.1.3.1",
    "1.1.3.2 NORF",
    "1.1.3.3-4",
    "1.1.6.1",
    "1.1.6.2 No_depart_dos",
    "1.1.6.3 NF;VDOWN270;VDOWN1S",
    "1.1.6.4 NF;VDOWN180;VDOWN1S;No_sortie_dos",
    "1.1.7.1",
    "1.1.7.2 No_depart_dos",
    "1.1.7.3 NF;VDOWN180;VDOWN1S;No_sortie_dos",
    "1.1.7.4 NF;VDOWN270;VDOWN1S",
    "1.2.1.1",
    "1.2.1.2 NORF:1;No_sortie_dos",
    "1.2.1.3-4",
    "1.2.2.1 No_sortie_dos",
    "1.2.2.2 NORF:1",
    "1.2.2.3-4",
    "1.2.3.1",
    "1.2.3.2 NORF:1;No_sortie_dos",
    "1.2.3.3-4",
    "1.2.4.1 No_sortie_dos",
    "1.2.4.2 NORF:1",
    "1.2.4.3-4",
    "1.2.5.1",
    "1.2.5.2 No_depart_dos",
    "1.2.5.3 NORF:2;NF;VDOWN180;VDOWN1S",
    "1.2.5.4 NF;VDOWN270;VDOWN1S",
    "1.2.6.1",
    "1.2.6.2 No_depart_dos",
    "1.2.6.3 NF;VDOWN270;VDOWN1S",
    "1.2.6.4 NORF:2;NF;VDOWN180;VDOWN1S",
    "1.2.7.1",
    "1.2.7.2 No_depart_dos",
    "1.2.7.3 NORF:2;NF;VDOWN180;VDOWN1S",
    "1.2.7.4 NF;VDOWN270;VDOWN1S",
    "1.2.8.1",
    "1.2.8.2 No_depart_dos",
    "1.2.8.3 NF;VDOWN270;VDOWN1S",
    "1.2.8.4 NORF:2;NF;VDOWN180;VDOWN1S",
    "2.1.2.1-4",
    "2.1.3.1-4",
    "2.2.2.1-4",
    "2.2.3.1-4",
    "2.2.4.1-4",
    "2.2.5.1-4",
    "2.2.6.1-4",
    "2.3.2.1-4",
    "2.3.3.1-4",
    "2.3.4.1-4",
    "2.3.5.1-4",
    "2.4.3.1-4",
    "2.4.4.1-4",
    "2.4.5.1-4",
    "2.4.6.1-4",
    "2.4.7.1-4",
    "2.4.8.1-4",
    "5.2.1.1",
    "5.2.1.2 No_depart_dos;No_sortie_dos",
    "5.2.1.3 No_sortie_dos",
    "5.2.1.4 No_depart_dos",
    "5.3.1.1-4 NF:1;NF:2;CLIMB4S;CLIMB450",
    "5.3.2.1-4 NF:1;NF:2;CLIMB4S;CLIMB450",
    "6.2.1.1 NF:1",
    "6.2.1.2 NF:1;No_depart_dos;No_sortie_dos",
    "6.2.1.3 NF:1;No_sortie_dos",
    "6.2.1.4 NF:1;No_depart_dos",
    "6.2.2.1 NF:1",
    "6.2.2.2 NF:1;No_depart_dos;No_sortie_dos",
    "6.2.2.3 NF:1;No_sortie_dos",
    "6.2.2.4 NF:1;No_depart_dos",
    "7.2.1.1-2 NF:1",
    "7.2.1.3-4 NF:2",
    "7.2.2.1-2 NF:1",
    "7.2.2.3-4 NF:2",
    "7.2.3.1-2 NF:1",
    "7.2.3.3-4 NF:2",
    "7.2.4.1-2 NF:1",
    "7.2.4.3-4 NF:2",
    "7.3.1.1 NORF:2",
    "7.3.1.2 NORF:1",
    "7.3.1.3-4",
    "7.3.2.1",
    "7.3.2.2 NORF",
    "7.3.2.3-4",
    "7.3.3.1 NORF:2",
    "7.3.3.2 NORF:1",
    "7.3.3.3-4",
    "7.3.4.1",
    "7.3.4.2 NORF",
    "7.3.4.3-4",
    "7.4.1.1 NOU:1",
    "7.4.1.2 NF:1;NOU:1",
    "7.4.1.3-4 NR:1;NOU:1;NF:1;N88",
    "7.4.2.1 NOU:1",
    "7.4.2.2 NF:1;NOU:1",
    "7.4.3.1",
    "7.4.3.2 No_depart_dos;No_sortie_dos",
    "7.4.3.3-4 NF:1",
    "7.4.4.1 No_sortie_dos",
    "7.4.4.2 No_depart_dos",
    "7.4.4.3-4 NF:1",
    "7.4.5.1 NF:1",
    "7.4.5.4 NR:1;NR:2;NF:2",
    "7.4.6.1",
    "7.8.1.1-2 NF:1",
    "7.8.1.3 NORF:2",
    "7.8.1.4 NORF:3",
    "7.8.2.1-2 NF:1",
    "7.8.2.3 NORF:2",
    "7.8.2.4 NORF:3",
    "7.8.3.1-2 NF:1",
    "7.8.3.3 NORF",
    "7.8.3.4",
    "7.8.4.1-2 NF:1",
    "7.8.4.3 NORF",
    "7.8.4.4",
    "7.8.5.1 NF:3;NORF:2",
    "7.8.5.2 NF:3;NORF:1",
    "7.8.5.3-4",
    "7.8.6.1 NF:3;NORF:2",
    "7.8.6.2 NF:3;NORF:1",
    "7.8.6.3-4",
    "7.8.7.1 NF:3",
    "7.8.7.2 NF:3;NORF",
    "7.8.7.3-4",
    "7.8.8.1 NF:3",
    "7.8.8.2 NF:3;NORF",
    "7.8.8.3-4",
    "8.4.1.1",
    "8.4.1.2 No_depart_dos;No_sortie_dos",
    "8.4.1.3-4 R4",
    "8.4.13.1",
    "8.4.14.1",
    "8.4.15.1 R10",
    "8.4.15.2 R10;NORF",
    "8.4.15.3-4 NORF",
    "8.4.16.1 R10",
    "8.4.16.2-4 NORF",
    "8.4.17.1 R10",
    "8.4.17.2 R10;NORF",
    "8.4.17.3-4 NORF",
    "8.4.18.1",
    "8.4.18.2 R10;NORF",
    "8.4.18.3-4 NORF",
    "8.4.2.1 No_sortie_dos",
    "8.4.2.2 No_depart_dos",
    "8.4.2.3-4 R4",
    "8.4.3.1",
    "8.4.3.2 No_depart_dos;No_sortie_dos",
    "8.4.3.3-4 R4",
    "8.4.4.1 No_sortie_dos",
    "8.4.4.2 No_depart_dos",
    "8.4.4.3-4 R4",
    "8.5.1.1 NF:2",
    "8.5.1.2 NF:2;NORF",
    "8.5.1.3-4",
    "8.5.2.1 NF:2",
    "8.5.2.2 NF:2;NORF",
    "8.5.2.3-4",
    "8.5.3.1 NF:2",
    "8.5.3.2 NF:2;NORF",
    "8.5.3.3-4",
    "8.5.4.1 NF:2",
    "8.5.4.2 NF:2;NORF",
    "8.5.4.3-4",
    "8.5.5.1-2 NF:1",
    "8.5.5.3 NORF:2",
    "8.5.5.4",
    "8.5.6.1-2 NF:1",
    "8.5.6.3 NORF:2",
    "8.5.6.4",
    "8.5.7.1-2 NF:1",
    "8.5.7.3",
    "8.5.7.4 NORF:2",
    "8.5.8.1-2 NF:1",
    "8.5.8.3",
    "8.5.8.4 NORF:2",
    "8.6.1.1 NOU:2;NF:3;NF2UP360;NF2UP2STOP;R11",
    "8.6.1.2 NOU:2;NF:3;NF2UP360;NF2UP2STOP;R11;No_depart_dos",
    "8.6.1.3-4",
    "8.6.2.1 NOU:2;NF:3;NF2UP360;NF2UP2STOP",
    "8.6.2.2 NOU:2;NF:3;NF2UP360;NF2UP2STOP;No_depart_dos",
    "8.6.2.3-4",
    "8.6.3.1 NOU:2;NF:3;NF2UP360;NF2UP2STOP;R11",
    "8.6.3.2 NOU:2;NF:3;NF2UP360;NF2UP2STOP;R11;No_depart_dos",
    "8.6.3.3-4",
    "8.6.4.1 NOU:2;NF:3;NF2UP360;NF2UP2STOP",
    "8.6.4.2 NOU:2;NF:3;NF2UP360;NF2UP2STOP;No_depart_dos",
    "8.6.4.3-4",
    "8.6.5.1 NOU:2;NF:1;NF3TOPH;R14",
    "8.6.5.2 NOU:2;NF:1;NF3TOPH;VDOWN180;VDOWN1S;No_sortie_dos",
    "8.6.5.3-4 NF:2",
    "8.6.6.1 NOU:2;NF:1;NF3TOPH;VDOWN180;VDOWN1S;No_sortie_dos",
    "8.6.6.2 NOU:2;NF:1;NF3TOPH;R14",
    "8.6.6.3-4 NF:2",
    "8.6.7.1 NOU:2;NF:1;NF3TOPH;No_sortie_dos",
    "8.6.7.2 NOU:2;NF:1;NF3TOPH",
    "8.6.7.3-4",
    "8.6.8.1 NOU:2;NF:1;NF3TOPH",
    "8.6.8.2 NOU:2;NF:1;NF3TOPH;No_sortie_dos",
    "8.6.8.3-4",
    "8.8.1.1 NOU",
    "8.8.2.1 NOU",
    "8.8.5.1 NOU",
    "8.8.6.1 NOU",
    "9.1.1.1-5",
    "9.1.2.1-6",
    "9.1.3.1-8",
    "9.1.4.2",
    "9.1.4.4",
    "9.1.4.6",
    "9.1.5.1-4",
    "9.10.10.2-4",
    "9.10.2.2",
    "9.10.2.4",
    "9.10.3.2",
    "9.10.3.4",
    "9.10.3.6",
    "9.10.4.2",
    "9.10.4.4",
    "9.10.5.2-4",
    "9.10.6.2-4",
    "9.10.8.2",
    "9.11.1.4-6",
    "9.12.1.4-6",
    "9.2.1.4",
    "9.2.2.4",
    "9.2.3.4",
    "9.2.3.6",
    "9.2.3.8",
    "9.2.4.4",
    "9.2.5.4",
    "9.4.1.2-4",
    "9.4.2.2",
    "9.4.2.4",
    "9.4.3.2-4",
    "9.4.4.2",
    "9.4.4.4",
    "9.4.5.2-3",
    "9.8.1.1-2",
    "9.8.2.1-2",
    "9.8.3.1-2",
    "9.8.3.4",
    "9.8.4.2",
    "9.8.5.1-2",
    "9.9.1.2-4",
    "9.9.10.2-4",
    "9.9.2.2",
    "9.9.2.4",
    "9.9.3.2",
    "9.9.3.4",
    "9.9.3.6",
    "9.9.4.2",
    "9.9.4.4",
    "9.9.4.6",
    "9.9.5.2-4",
    "9.9.6.4",

//#######################################################################################
//#
//# Define Advanced programmes.

"[CIVA Advanced Programme1]",
"more=CIVA Advanced Free Known",
"[CIVA Advanced Programme2]",
"more=CIVA Advanced Unknown1",
"[CIVA Advanced Programme3]",
"more=CIVA Advanced Unknown2",
"[CIVA Advanced Programme4]",
"more=CIVA Advanced Unknown3",

"(CIVA Advanced Unknown)",
"more=CIVA Advanced Unknown1",
"(CIVA Advanced 1stUnknown)",
"more=CIVA Advanced Unknown1",
"(CIVA Advanced 2ndUnknown)",
"more=CIVA Advanced Unknown2",

//######################################################################################
//##### CIVA ADVANCED FREE 2015 ########################################################
//######################################################################################
 
"(CIVA Advanced Free)",
"posnl=30",//no line judges
"poslj=10",
"k-max=300",
"basefig-max=12",
 
"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",
 
"group-roller=^2\\.(1\\.[23]|2\\.[2-7]|3\\.[2-5]|4\\.[2-8])",
"roller-name=Rolling turn, family 2.1.2 to 2.1.3, 2.2.2 to 2.2.7, 2.3.2 to 2.3.5, 2.4.2 to 2.4.8",
"roller-name_fr=Tonneaux en virage, famille 2.1.2, 2.1.3, 2.2.2 à 2.2.7, 2.3.2 à 2.3.5, 2.4.2 à 2.4.8",
"roller-name_de=Rollenkreis, Familie 2.1.2 bis 2.1.3, 2.2.2 bis 2.2.7, 2.3.2 bis 2.3.5, 2.4.2 bis 2.4.8",
 
"roller-min=1",
"fam1-min=1",
"fam5-min=1",
"fam7-min=1",
"fam8-min=1",
 
"froll-min=1",
"hroll-min=1",
"qroll-min=1",
"eroll-min=1",
"snap-min=2",
"spin-min=1",
 
"opposite-min=1",//one opposite roll is required!
 
// "allow=^[1-9]",//all figures are allowed for the Free Programme
 
// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",
 
"more=CIVA AdvYakInt SF",
 
//######################################################################################
//##### CIVA ADVANCED FREE KNOWN #######################################################
//######################################################################################

"[CIVA Advanced Free Known]",
"posnl=30",//no line judges
"poslj=10",
"k-min=160", // Minimum K for the Known set (2.2.1.4)
"k-max=320",
"basefig-min=10",
"basefig-max=10",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

"group-roller=^2\\.(1\\.[23]|2\\.[2-7]|3\\.[2-5]|4\\.[2-8])",
"roller-name=Rolling turn, family 2.1.2 to 2.1.3, 2.2.2 to 2.2.7, 2.3.2 to 2.3.6, 2.4.2 to 2.4.8",
"roller-name_fr=Tonneaux en virage, famille 2.1.2, 2.1.3, 2.2.2 à 2.2.7, 2.3.2 à 2.3.6, 2.4.2 à 2.4.8",
"roller-name_de=Rollenkreis, Familie 2.1.2 bis 2.1.3, 2.2.2 bis 2.2.7, 2.3.2 bis 2.3.6, 2.4.2 bis 2.4.8",

"roller-min=1",
"fam1-min=1",
"fam5-min=1",
"fam7-min=1",
"fam8-min=1",

"froll-min=1",
"hroll-min=1",
"qroll-min=1",
"eroll-min=1",
"snap-min=2",
"spin-min=1",

"opposite-min=1",//one opposite roll is required!

// "allow=^[1-9]",//all figures are allowed for the Free Programme

"figure-letters=ABCDE",

'reference="@A" 1`dh(`)\'f\' "@B" ``+``````2f`rc48-````````` "@C" ``,8\'pb.3+`` "@D" ~-6m6f,44+` "@E" 2j2',

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

//######################################################################################
//##### CIVA ADVANCED UNKNOWN ##########################################################
//######################################################################################

"[CIVA Advanced Unknown1]",
"k-maxperfig=30",
"k-maxperfig-rule=Sporting Code Section 6 Part I, 2.3.1.1",
"more=CIVA Advanced Unknownall",

"[CIVA Advanced Unknown2]",
"k-maxperfig=35",
"k-maxperfig-rule=Sporting Code Section 6 Part I, 2.3.1.1",
"more=CIVA Advanced Unknownall",

"[CIVA Advanced Unknown3]",
"k-maxperfig=40",
"k-maxperfig-rule=Sporting Code Section 6 Part I, 2.3.1.1",

"more=CIVA Advanced Unknownall",

"(CIVA Advanced Unknownall)",
"poslj=10",
"posnl=30",

// general rules for Advanced: 10-14 figures,
// limit on figure types (max1 spin etc)
// limit on snaps (2-4 total), (one max per figure)
// figures 10-14. Kfactor 15-40.

// at most one of 1.2.3-4.3-4 and one of 7.8.1-8.*

"group-one=^1\\.2\\.[34]\.[34]",
"group-two=^7\\.8\\.[1-8]",

"k-minperfig=15",

"snap-maxperfig=1",
"snap-maxperfig-rule=Sporting Code Section 6 Part I, 2.3.1.4 b)",
"snap-min=2",
"snap-max=4",

"spin-max=1",

//one-name=family 1.14-15 columns 3&4 (inv tooth)
//one-max=1

//two-name=family 7.23-30 (full cubans)
//two-max=1

"one-name=family 1.2.3-4 columns 3&4 (inv tooth)",
"one-name_fr=famille 1.2.3-4 colonnes 3 et 4 (triangle inversé)",
"one-name_de=Familie 1.2.3-4 Spalten 3 & 4 (Inv. Käseeck)",
"one-max=1",

"two-name=family 7.8.1-8 (full cubans)",
"two-name_fr=famille 7.8.1-8 (noeuds de savoie)",
"two-name=Familie 7.8.1-8 (Ganze Kubanische Achten)",
"two-max=1",

"basefig-min=10",
"basefig-min-rule=Sporting Code Section 6 Part I, 2.3.1.4",
"basefig-max=10",
"basefig-max-rule=Sporting Code Section 6 Part I, 2.3.1.4",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

"additionals=4/24",
"figure-letters=ABCDEFGHIJ",

"more=CIVA Advanced Unknownbase",
"(CIVA Advanced Unknownbase)",

//############################################################
// extended conv rule version with limited vertical rolls=v(up) =n(down)
// limited vertical rolls are 3/4 & 2/4 up(v =can't flyoff) or down(n=cant push out)
// for Advanced Unknowns only, of course.

"conv-horstop=^9\\.(1|9|10)\\.[38]=1 ; ^9\\.2\\.3\\.4 = 2 ;^9\\.2\\.3\\.6 = 3 ;^9\\.2\\.3\\.8 = 4 ;^9\\.4\\.3\\.([1-8]) = $1; ^9\\.8\\.3\\.1 = 2;^9\\.8\\.3\\.2 = 4;^9\\.8\\.3\\.3 = 6;^9\\.8\\.3\\.4 = 8; ^9\\.=r ; ^0\\.=z",
"rule-Hor10stop = horstop:<11",
"why-Hor10stop  = a maximum of 10 stops are allowed on straight horizontal lines rolls",
"why_fr-Hor10stop  = un maximum de 10 arrets est autorisé dans les rotations sur les lignes droites horizontales",
"why_de-Hor10stop  = maximal 10 Stops in horizontalen Rollen erlaubt",
 
"conv-adv=^9\\.(1\\.1\\.3|4\\.1\\.2)=v ; ^9\\.(1\\.5\\.3|4\\.5\\.2)=n; ^9\\.[1248]\\.=r; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z",

"rule-NRLevFly   =adv:v$",
"rule-NRPushout  =adv:n$",
"why-NRLevFly    = level fly off is not allowed after this roll",
"why_fr-NRLevFly    = rotation interdite avant une mise en palier",
"why_de-NRLevFly    = Pos. Abfangen nach dieser Rolle nicht erlaubt",
"why-NRPushout   = negative recovery is not allowed after this roll",
"why_fr-NRPushout   = sortie dos interdite après cette rotation",
"why_de-NRPushout   = Neg. Abfangen nach dieser Rolle nicht erlaubt",

//For Adv rp figures, we convert 3/4 up to 'x' which isnt allowed
"conv-upqtrs=^9\\.([1-9]|10)\\.[16]\\.([1-8]) = $2 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
"rule-Max180up =upqtrs:<3",
"why-Max180up  =no more than 1/2 roll is allowed",
"why_fr-Max180up  =1/2 rotation maximum autorisée",
"why_de-Max180up  =nicht mehr als eine halbe Rolle erlaubt",

"rule-NH2F3 =roll:^[\\w,;]+ [1248] (f|\\w[,;]f)",
"why-NH2F3 = no flick allowed in third position when 2nd position has a roll",
"why_fr-NH2F3 = déclenché interdit en 3eme rotation si la 2eme rotation est présente",
"why_de-NH2F3 = Keine Gerissene/Gestoßene an Position 3 erlaubt, wenn Position 2 eine Rolle enthält",

//for Adv dh figures, we check for 9.4.2.2 or 9.2.1.2 on 45 and 9.1.1.1 on vert
"conv-advdh45=^9\\.(4\\.2\\.2)=v ;  ^9\\.(1\\.2\\.2)=v ; ^9\\.=x; ^0\\.=z",
"rule-DH45M = advdh45: ^x",
"why-DH45M = max of 9.4.2.2 or 9.1.2.2 allowed on 45° up",
"why_fr-DH45M = maximun 9.4.2.2 ou 9.1.2.2 autorisé en 45° montant",
"why_de-DH45M = höchstens 9.4.2.2 oder 9.1.2.2 auf diagonaler Aufwärtslinie erlaubt",
"DH45M-rule=Sporting Code Section 6 Part I, A.8.1.2",

"conv-advdhv= ^9\\.(1\\.1\\.1)=v ; ^9\\.=x; ^0\\.=z",
"rule-DHVM = advdhv: ^. x",
"why-DHVM = max of 9.1.1.1 allowed on vertical up",
"why_fr-DHVM = maximun 9.1.1.1 autorisé en verticale montante",
"why_de-DHVM = höchstens 9.1.1.1 auf vertikaler Aufwärtslinie erlaubt",

"allow-defrules= Hor10stop",

"1.1.1.1-4",
"1.1.2.1-4 NOU",
"1.1.3.1-4 NOU",
"1.1.6.1-3 NOU ; NRLevFly",
"1.1.6.4   NOU ; NRPushout",
"1.1.7.1-2 NOU ; NRLevFly",
"1.1.7.3   NOU ; NRPushout",
"1.1.7.4   NOU",

"1.2.1.1 NOU",
"1.2.1.3 NOU ; NRLevFly",
"1.2.2.3 NOU ; NRLevFly",
"1.2.3.1 NOU ; NRLevFly",
"1.2.3.3-4 NOU ; NRLevFly",
"1.2.4.2-4 NOU ; NRLevFly",
"1.2.5.1 NOU",
"1.2.5.4 NOU",
"1.2.6.1 NOU",
"1.2.6.3 NOU",
"1.2.7.1 NOU",
"1.2.7.4 NOU",
"1.2.8.1 NOU",
"1.2.8.3 NOU",

"2.1.3.2-4",
"2.2.3.1-4",
"2.2.5.1-4",
"2.3.4.1-4",
"2.4.5.1-2",
"2.4.7.1-2",

"5.2.1.1 NOU",
"5.2.1.2-3 NOU ; NRPushout",
"5.2.1.4 NOU",
"5.3.1.1-4  NOU ; NF:1 ; NF:2 ; DHVM ; DH45M",
"5.3.2.1-4  NOU ; NF:1 ; NF:2 ; DHVM ; DH45M",

// tailslides
"6.2.1.1 NR",
"6.2.2.1 NR",

// half loops
"7.2.1.1-2  NF:1",
"7.2.2.1-2  NF:1",
"7.2.3.1-2  NF:1",
"7.2.4.1-2  NF:1",

"7.2.1.3-4  NF:2",
"7.2.2.3-4  NF:2",
"7.2.3.3-4  NF:2",
"7.2.4.3-4  NF:2",

//goldfish
"7.3.1.2-3 NOU",
"7.3.2.1   NOU",
"7.3.2.3-4 NOU",
"7.3.3.3   NOU",
"7.3.4.1   NOU",
"7.3.4.4   NOU",

//loops
"7.4.1.1 NOU ; MAX360",
"7.4.1.2 NOU ; MAX360 ; FAM91:1",
"7.4.2.1-2 NOU",
"7.4.3.1-2 NOU",
"7.4.5.1 NR:1 ; NR:2",
"7.4.6.1",

//cc
"7.8.1.1-2 NOU ; NF:1",
"7.8.1.3-4 NOU",

"7.8.2.1-2 NOU ; NF:1",
"7.8.2.3-4 NOU",
"7.8.3.1   NOU ; NF:1",
"7.8.3.4   NOU",
"7.8.4.1   NOU ; NF:1",
"7.8.4.4   NOU",

"7.8.5.1-2   NOU ; NF:3",
"7.8.5.3-4   NOU",
"7.8.6.2   NOU ; NF:3",
"7.8.6.3   NOU",
"7.8.7.1-2   NOU ; NF:3",
"7.8.7.3-4   NOU",
"7.8.8.1   NOU ; NF:3",
"7.8.8.4   NOU",

//bumps
"8.4.1.1 NOU",
"8.4.1.2 NOU ; NRPushout",
"8.4.2.1 NOU ; NRPushout",
"8.4.2.2 NOU",
"8.4.3.1 NOU",
"8.4.3.2 NOU ; NRPushout",
"8.4.4.1 NOU ; NRPushout",
"8.4.4.2 NOU",

"8.4.13.1 NOU ;NF:1 ; NF:2",
"8.4.14.1 NOU; NF:1 ; NF:2",
"8.4.15.1-2 NOU ; NF:2",
"8.4.16.1-2 NOU ; NF:2",
"8.4.18.1-2 NOU ; NF:2",

//rc
"8.5.1.1-2 NOU:1; NF:2",
"8.5.2.1-2 NOU:1; NF:2",
"8.5.1.3 NOU:1",
"8.5.1.4 NOU:1 ; FAM91:1",
"8.5.2.3-4 NOU:1",

"8.5.3.1-2 NOU:1; NF:2",
"8.5.3.3 NOU:1",
"8.5.3.4 NOU:1 ; FAM91:1",
"8.5.4.1-2 NOU:1; NF:2",
"8.5.4.3-4 NOU:1",

//rp
"8.6.1.1 NOU:1 ; Max180up:1 ;NR:2 ;NF:3",
"8.6.1.4 NOU:1",
"8.6.3.1 NOU:1 ; Max180up:1 ;NR:2 ;NF:3",
"8.6.3.2 NR:1   ;NR:2 ;NF:3",
"8.6.3.3 NOU:1",

"8.6.2.1 NOU:1 ; Max180up:1 ;NR:2 ;NF:3",
"8.6.2.4 NOU:1",
"8.6.4.1 NOU:1 ; Max180up:1 ;NR:2 ;NF:3",
"8.6.4.2 NR:1 ; NR:2 ; NF:3",
"8.6.4.3 NOU:1",

//c
"8.5.5.1-2 NF:1 ; NOU:2",
"8.5.6.1-2 NF:1 ; NOU:2",
"8.5.5.4 NOU:2",
"8.5.6.4 NOU:2",
"8.5.7.1-2 NF:1 ; NOU:2",
"8.5.8.1-2 NF:1 ; NOU:2",
"8.5.7.3 NOU:2",
"8.5.8.3 NOU:2",

//p
"8.6.5.1 NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2",
"8.6.6.1 NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2 ; NRPushout",
"8.6.6.2 NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2",

"8.6.7.2 NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2",
"8.6.8.1 NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2",
"8.6.8.2 NOU:2; NOU:3; NF:1 ;NH2F3 ; MAX360:2 ; NRPushout",

// double bumps
"8.8.1.1 NOU",
"8.8.2.1 NOU",
"8.8.5.1 NOU",
"8.8.6.1 NOU",
"8.8.7.2 NOU",
"8.8.8.2 NOU",

// ROLLS
"9.1.1.1-3",//9.1.1.3 (3/4 up) may not be followed by fly-off
"9.1.2.2",
"9.1.2.4",
"9.1.3.1-4",
"9.1.3.6",
"9.1.3.8",
"9.1.4.2",
"9.1.4.4",
"9.1.5.1-3",//9.1.5.3 (3/4 down) may not be followed by negative

"9.2.2.4",
"9.2.3.4",
"9.2.3.6",
"9.2.3.8",
"9.2.4.4",

"9.4.1.2",// may not be followed by level fly-off
"9.4.2.2",
"9.4.2.4",
"9.4.3.2-4",
"9.4.4.2",
"9.4.5.2",// may not be followed by negative recovery

"9.8.1.1",
"9.8.2.2",
"9.8.3.1-2",
"9.8.3.4",
"9.8.5.1",

//snaps & spins
"9.9.2.2",
"9.9.2.4",
"9.9.3.2",
"9.9.3.4",
"9.9.3.6",
"9.9.4.2",
"9.9.4.4",
"9.9.5.2-3",
"9.9.10.2",

"9.11.1.4-6",
"9.12.1.4-6",

// what info should be filled out
"infocheck=positioning",

//#######################################################################################
//#
//# Define Intermediate programmes.

"[CIVA Intermediate Programme1]",
"more=CIVA Intermediate Free Known",
"[CIVA Intermediate Programme2]",
"more=CIVA Intermediate Unknown1",
"[CIVA Intermediate Programme3]",
"more=CIVA Intermediate Unknown2",
"[CIVA Intermediate Programme4]",
"more=CIVA Intermediate Unknown3",

//######################################################################################
//##### CIVA INTERMEDIATE FREE KNOWN ###################################################
//######################################################################################

"[CIVA Intermediate Free Known]",
"posnl=30",//no line judges
"poslj=10",
"k-min=100", // Minimum K for the Known set (2.2.1.4)
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

'reference="@A" mf- "@B" -`h24\' "@C" `+1j1 "@D" 2f`rc+` "@E" `+\'2\'rp22',

// what info should be filled out
"infocheck=pilot;actype;acreg;positioning",

/**********************************************************************
 *           Advanced, Yak52 and Intermediate Super Families          *
 **********************************************************************/

"(CIVA AdvYakInt SF)",
"sf=^9\\.11\\.:3;^9\\.12\\.:3;^9\\.9\\.:4;^9\\.10\\.:4;^2\\.:2;^5\\.:5;^6\\.:6;^1\\.:7;^3\\.:7;^7\\.:7;^8\\.:7;^0\\.:7",

//######################################################################################
//##### CIVA INTERMEDIATE UNKNOWN #############################################################
//######################################################################################

"(CIVA Intermediate Unknown)",
"more=CIVA Intermediate Unknown1",
"(CIVA Intermediate 1stUnknown)",
"more=CIVA Intermediate Unknown1",
"(CIVA Intermediate 2ndUnknown)",
"more=CIVA Intermediate Unknown2",

"[CIVA Intermediate Unknown1]",
"k-maxperfig=20",
"more=CIVA Intermediate Unknownall",

"[CIVA Intermediate Unknown2]",
"k-maxperfig=25",
"more=CIVA Intermediate Unknownall",

"[CIVA Intermediate Unknown3]",
"k-maxperfig=30",
"more=CIVA Intermediate Unknownall",

//#######################################################################################
"(CIVA Intermediate Unknownall)",
//#######################################################################################

"k-minperfig=12",

"poslj=10",
"posnl=30",

"group-one=^1\\.2\\.[34]\\.[34]",
"group-two=^7\\.8\\.[1-8]",

"snap-maxperfig=1",
"snap-min=1",
"snap-max=2",

"spin-max=1",

"one-name=family 1.2.3-4 columns 3&4 (inv tooth)",
"one-name_fr=famille 1.2.3-4 colonnes 3 et 4 (triangle inversé)",
"one-name_de=Familie 1.2.3-4 Spalten 3&4 (Inv. Käseeck)",
"one-max=1",

"two-name=family 7.8.1-8 (full cubans)",
"two-name_fr=famille 7.8.1-8 (noeuds de savoie)",
"two-name_de=Familie 7.8.1-8 (Ganze Kubanische Achten)",
"two-max=1",

"basefig-min=10",
"basefig-max=10",

"basefig-repeat=1",
"roll-repeat=1",
"snap-repeat=1",
"spin-repeat=1",

"additionals=4/24",
"figure-letters=ABCDEFGHIJ",

"more=CIVA Intermediate Unknownbase",
"(CIVA Intermediate Unknownbase)",

//############################################################
// extended conv rule version with limited vertical rolls=v(up) =n(down)
// limited vertical rolls are 3/4 & 2/4 up(v =can't flyoff) or down(n=cant push out)
// for Intermediate Unknowns only, of course.

"conv-horstop=^9\\.(1|9|10)\\.[38]=1 ; ^9\\.2\\.3\\.4 = 2 ;^9\\.2\\.3\\.6 = 3 ;^9\\.2\\.3\\.8 = 4 ;^9\\.4\\.3\\.([1-8]) = $1; ^9\\.8\\.3\\.1 = 2;^9\\.8\\.3\\.2 = 4;^9\\.8\\.3\\.3 = 6;^9\\.8\\.3\\.4 = 8; ^9\\.=r ; ^0\\.=z",
"rule-Hor10stop = horstop:<11",
"why-Hor10stop  = a maximum of 10 stops are allowed on straight horizontal lines rolls",
"why_fr-Hor10stop  = un maximum de 10 arrets est autorisé dans les rotations sur les lignes droites horizontales",
"why_de-Hor10stop  = maximal 10 Stops in horizontalen Rollen erlaubt",

"conv-adv=^9\\.(1\\.1\\.3|4\\.1\\.2)=v ; ^9\\.(1\\.5\\.3|4\\.5\\.2)=n; ^9\\.[1248]\\.=r; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z",

"rule-NRLevFly   =adv:v$",
"rule-NRPushout  =adv:n$",
"why-NRLevFly    = level fly off is not allowed after this roll",
"why_fr-NRLevFly    = rotation interdite avant une mise en palier",
"why_de-NRLevFly    = Pos. Abfangen nach dieser Rolle nicht erlaubt",
"why-NRPushout   = negative recovery is not allowed after this roll",
"why_fr-NRPushout   = sortie dos interdite après cette rotation",
"why_de-NRPushout   = Neg. Abfangen nach dieser Rolle nicht erlaubt",

//For Adv rp figures, we convert 3/4 up to 'x' which isnt allowed
"conv-upqtrs=^9\\.([1-9]|10)\\.[16]\\.([1-8]) = $2 ; ^9\\.(9|10)\\. = f ; ^9\\. = r ; ^0\\.=z",
"rule-Max180up =upqtrs:<3",
"why-Max180up  =no more than 1/2 roll is allowed",
"why_fr-Max180up  =1/2 rotation maximum autorisée",
"why_de-Max180up  =nicht mehr als eine halbe Rolle erlaubt",

"rule-NH2F3 =roll:^[\\w,;]+ [1248] (f|\\w[,;]f)",
"why-NH2F3 = no flick allowed in third position when 2nd position has a roll",
"why_fr-NH2F3 = déclenché interdit en 3eme rotation si la 2eme rotation est présente",
"why_de-NH2F3 = Keine Gerissene/Gestoßene an Position 3 erlaubt, wenn Position 2 eine Rolle enthält",

//for Adv dh figures, we check for 9.4.2.2 or 9.2.1.2 on 45 and 9.1.1.1 on vert
"conv-advdh45=^9\\.(4\\.2\\.2)=v ;  ^9\\.(1\\.2\\.2)=v ; ^9\\.=x; ^0\\.=z",
"rule-DH45M = advdh45: ^x",
"why-DH45M = max of 9.4.2.2 or 9.1.2.2 allowed on 45 up",
"why_fr-DH45M = maximun 9.4.2.2 ou 9.1.2.2 autorisé en 45° montant",
"why_de-DH45M = höchstens 9.4.2.2 oder 9.1.2.2 auf diagonaler Aufwärtslinie erlaubt",

"conv-advdhv= ^9\\.(1\\.1\\.1)=v ; ^9\\.=x; ^0\\.=z",
"rule-DHVM = advdhv: ^. x",
"why-DHVM = max of 9.1.1.1 allowed on vertical up",
"why_fr-DHVM = maximun 9.1.1.1 autorisé en verticale montante",
"why-DHVM = höchstens 9.1.1.1 auf vertikaler Aufwärtslinie erlaubt",

"allow-defrules= Hor10stop",

//conversion rules for checking validity

"1.1.1.1-4",
"1.1.2.1 NOU",
"1.1.3.1 NOU",
"1.1.3.4 NOU",
"1.1.6.3 OS:1",

"1.2.1.1 NOU ; NR:2",
"1.2.1.3 NOU ; NR:2",
"1.2.2.3 NOU ; NR:2",
"1.2.3.1 NOU ; NR:2",
"1.2.3.4 NOU ; NR:2",
"1.2.4.4 NOU ; NR:2",
"1.2.5.4 NOU ; NR:1",
"1.2.6.1 NOU",
"1.2.6.3 NOU ; OS:1",
"1.2.7.1 NOU",
"1.2.7.4 NOU ; NR:1",
"1.2.8.3 NOU ; OS:1",

// rolling circle
"2.1.3.1",

// hammerhead
"5.2.1.1 NOU",

// half loops
"7.2.1.1 NF:1",
"7.2.2.1 NF:1",

"7.2.1.4 NF:2",
"7.2.3.3 NF:2",

//goldfish
"7.3.2.1 NOU",
"7.3.3.3 NOU",
"7.3.4.1 NOU",
"7.3.4.4 NOU",

//loops
"7.4.1.1 NOU ; MAX360",
"7.4.3.1 NR",

//bumps
"8.4.1.1 NOU",
"8.4.3.1 NOU",

//rc
"8.5.1.3 NOU:1",
"8.5.2.1 NOU:1; NF:2",
"8.5.2.4 NOU:1",

"8.5.3.3 NOU:1",
"8.5.4.4 NOU:1",

//c
"8.5.5.4 NOU:2",
"8.5.6.1 NF:1 ; NOU:2",
"8.5.6.4 NOU:2",
"8.5.7.3 NOU:2",
"8.5.8.3 NOU:2",

//rp
"8.6.1.1 NR:1 ; NR:2 ;NF:3",
"8.6.1.4 NR:1",
"8.6.2.4 NR:1",
"8.6.3.3 OS:1",
"8.6.4.3 OS:1",

// ROLLS
"9.1.1.1-2",
"9.1.2.2",
"9.1.2.4",
"9.1.3.1-2",
"9.1.3.4",
"9.1.3.6",
"9.1.4.2",
"9.1.5.1",

"9.2.2.4",
"9.2.3.4",
"9.2.3.6",

"9.4.2.2",
"9.4.2.4",
"9.4.3.2",
"9.4.3.4",
"9.4.4.2",

"9.8.1.1",
"9.8.2.2",
"9.8.3.1",
"9.8.3.2",
"9.8.5.1",

//snaps & spins
"9.9.2.2",
"9.9.3.2",
"9.9.3.4",

"9.11.1.4-6",

// what info should be filled out
"infocheck=positioning",

// Close the rules.push arguments
);
