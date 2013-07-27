// OpenAero rulesYY-France file

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

// This file defines year (YY) and rule type specific rules

//######################################################################################
//#####      Regles France 2013      Espoirs à Doret 2013  Olan 6.0  ###################
//#####      Regles France 2013      Version 2013_PN.1.00            ###################
//######################################################################################
//######################################################################################
//#####                                                              ###################
//#####      Modifications et corrections 2013 pseudo numerotation   ###################
//#####                                                              ###################
//######################################################################################
//#####                                                              ###################
//#####      Régles de l'inconnu Doret prises en compte, à affiner.  ###################
//#####                                                              ###################
//######################################################################################
// prog 2013 : Espoirs, Desavois, National2, Doret

//##### (Une partie des) Regles specifiques à la France.

//conv-vertqtrs=^9\.([1-9]|10)\.([156]|10)\.([1-8]) = $3 ; ^9\. = r ; ^0\.=z
//conv-vertupqtrs=^9\.([1-9]|10)\.([16])\.([1-8]) = $3 ; ^9\. = r ; ^0\.=z
//conv-vertdoqtrs=^9\.([1-9]|10)\.(5|10)\.([1-8]) = $3 ; ^9\. = r ; ^0\.=z

// Figures avec vrille seulement # Niveaux Espoirs,Desavois et CF2
//rule-SPIN=roll:^[^s]
//why-SPIN=Figure avec vrille uniquement

// Figures avec vrille ou rien  # Niveaux Desavois et CF2
//rule-Spin_ou_rien=roll:^[^sz]
//why-Spin_ou_rien=Figure seule ou avec vrille uniquement sur la verticale

// Pas de declenché dans les rotations composées. # Niveau Desavois
//rule-NFC=roll:(\w,[fF])|([fF],\w)
//why-NFC=pas de declenche dans les rotations composees

// Pas de declenché en 2eme element d'une rotation composée. # Niveau CF2
//rule-NSF=roll:(\w,[fF])
//why-NSF=pas de declenche en 2eme element dans une rotation composee

//##### Fin des regles specifiques à la France.


rules.push("[France espoirs connu]");

rules.push("demo=ed 2g iv''5s..^ -2% m,2 > 3j -3% c''2.'+``` ^ o h'.+ 3> ~+m-~~ 3% 3> -2j- -1-");

rules.push("k-max=120");

rules.push("more=France espoirs all");

rules.push("[France espoirs inconnu]");

rules.push("k-max=120");

rules.push("more=France espoirs all");

rules.push("[France espoirs libre]");

rules.push("k-max=130");
rules.push("basefig-max=12");

rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("roll-min=1");
rules.push("spin-min=1");

rules.push("emptyline-max=0");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=2");
rules.push("roll-totrepeat=1");
// spin-repeat=1  # n'est pas explicitement interdit ?

rules.push("more=France espoirs all");

rules.push("(France espoirs all)");

rules.push("poslj=10");
rules.push("posnl=10");
rules.push("floating-point=0");

//group-turnpos=^2\.[12]\.[13]
rules.push("group-turnpos=^2\\.[1-4]1\\.1");
rules.push("turnpos-name= virages ventre");
rules.push("turnpos-max=1");

// Figures avec vrille seulement # Niveaux Espoirs,Desavois et CF2
rules.push("rule-SPIN=roll:^[^s]");
rules.push("why-SPIN=Figure avec vrille uniquement");

// Modif 2013 (ou correction)
// Regle PG : Rotations alternées autorisées uniquement sur les figures 1.1.1.1-4 et limitées 720° maximum.
// Réalisé par la superposition des 3 règles suivantes.
rules.push("conv-rot_alt = ^9\\.\\d+\\.3\\.([1-8]) = $1 ;^9\\.\\d+\\.[1245]\\.[1-8] = x ; ^9\\. = y ; ^0\\.=z");
rules.push("rule-No_alt_45 = rot_alt: x,");
rules.push("why-No_alt_45 = Rotation alternee interdite sur les lignes a 45 degres");
rules.push("rule-No_alt_hor = rot_alt: ,");
rules.push("why-No_alt_hor = Rotation alternee interdite");
// Rotations composées horizontales limitées à 720°
rules.push("rule-Max_alt_720 = rot_alt: (8,|,8|6,6|6,4|4,6)");
rules.push("why-Max_alt_720 = Rotation alternee limitee a 720 degres");

rules.push("allow-defrules = No_alt_45");

// Modif 2013 (ou correction) Fin

rules.push("1.1.1.1-4 Max_alt_720");// Modif 2013 Max_alt_720
rules.push("1.1.2.1");
rules.push("1.1.2.3 NR:1");
rules.push("1.1.3.1");
rules.push("1.1.3.4");
rules.push("1.1.6.1 NR:1");
rules.push("1.1.6.3 SPIN");
//1.17.1 NR:1  # Modif 2013 suppression figure
rules.push("1.2.1.3 NR:1; NR:3");
rules.push("1.2.2.3 NR:1; NR:3");
rules.push("1.2.3.1 NR:3");
rules.push("1.2.3.4 NR:3");
rules.push("1.2.4.4 NR:3");
rules.push("1.2.6.1 NR:1; NR:3");
rules.push("1.2.7.1 NR:1");

rules.push("2.1.1.1-2");
rules.push("2.2.1.1-2");
rules.push("2.3.1.1-2");
rules.push("2.4.1.1-2");

rules.push("5.2.1.1 NR:1; NR:3");
rules.push("5.3.1.1 NR:1; NR:2; NR:3");

rules.push("7.2.1.1 NR:1; No_alt_hor");// Modif 2013 No_alt_hor
rules.push("7.2.1.4 NR:1; NR:3");
rules.push("7.2.2.1 NR:1; No_alt_hor");// Modif 2013 No_alt_hor
rules.push("7.4.1.1 NR:1");
rules.push("7.3.2.1");
rules.push("7.3.3.3 NR:1");
rules.push("7.3.4.1");
rules.push("7.3.4.4");
rules.push("7.8.4.1 NR:1");// Correction 2012 23 -> 26 + NR:1
rules.push("7.8.6.3 NR:1; NR:3");// Correction 2012 NR:3
rules.push("7.8.8.1 NR:3");// Correction 2012 NR:3
rules.push("7.8.8.4 NR:3");// Correction 2012 NR:3

rules.push("8.4.1.1 NR:1; NR:3");
rules.push("8.4.3.1 NR:1; NR:3");
rules.push("8.5.1.3 NR:1; No_alt_hor");// Modif 2013 No_alt_hor
rules.push("8.5.2.1 NR:3");
rules.push("8.5.2.4 No_alt_hor");// Modif 2013 No_alt_hor
rules.push("8.5.3.3 NR:1; No_alt_hor");// Modif 2013 No_alt_hor
rules.push("8.5.4.1 No_alt_hor");// Modif 2013 No_alt_hor
rules.push("8.5.4.4 No_alt_hor");// Modif 2013 No_alt_hor
rules.push("8.5.5.4 NR:1");
rules.push("8.5.6.1 No_alt_hor");// Modif 2013 No_alt_hor
rules.push("8.5.6.4 NR:1");
rules.push("8.5.8.2 No_alt_hor");// Modif 2013 No_alt_hor
rules.push("8.6.1.1 NR:1; NR:2; NR:3");

rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.3.2");
rules.push("9.1.3.4");
rules.push("9.1.3.6");
rules.push("9.1.3.8");
rules.push("9.1.4.2");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.11.1.4-7");

rules.push("[France desavois connu]");

rules.push("demo=d24- -iv'is'' 2h.- -3% -m 6% > 2j2 -3% 3^2> ``+2,2c2.''+`` ````+,4pb+```` 4k''2. m2 2f-");

rules.push("k-max=175");

rules.push("more=France desavois all");

rules.push("[France desavois inconnu]");

rules.push("k-max=160");

rules.push("more=France desavois all");

rules.push("[France desavois libre]");

rules.push("k-max=205");
rules.push("basefig-max=12");

rules.push("neg-min=5");
rules.push("roller-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("spin-min=1");
rules.push("vrot-min=1");
rules.push("turnpos-max=1");

rules.push("emptyline-max=0");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=2");
rules.push("roll-totrepeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("more=France desavois all");

rules.push("(France desavois all)");

rules.push("poslj=15");
rules.push("posnl=15");
rules.push("floating-point=0");

//group-turnpos=^2\.1\.1\.2
//group-turnpos=^2\.[12]\.[13]
rules.push("group-turnpos=^2\\.[1-4]1\\.1");
rules.push("turnpos-name= virages ventre");

rules.push("group-vrot=^9\\.[14]\\.1\\.2");
rules.push("vrot-name= rotation verticale de 180 degres");

//group-roller=^2\.([68]|11)\.
rules.push("group-roller=^2\\.(2[56]|34)\\.");
rules.push("roller-name= tonneaux en virage");

// Pas de declenché dans les rotations composées.
//rule-NSF=rfsz:(\w,f)|(f,\w)
//why-NSF=pas de declenche dans les rotations composees
//rule-NSF1=rfsz:^(\w,f)|^(f,\w)
//rule-NSF2=rfsz:^[\w,]+ (\w,f)
//rule-NSF3=rfsz:^[\w,]+ [\w,]+ (f|\w,f)
//why-NSF1=pas de declenche en 2eme element de rotation composee # Sur la 1ere rotation
//why-NSF2=pas de declenche en 2eme element de rotation composee # Sur la 2eme rotation
//why-NSF3=pas de declenche en 2eme element de rotation composee # Sur la 3eme rotation

// Figures avec vrille seulement # Niveaux Espoirs,Desavois et CF2
rules.push("rule-SPIN=roll:^[^s]");
rules.push("why-SPIN=Figure avec vrille uniquement");

// Figures avec vrille ou rien  # Niveaux Desavois et CF2
rules.push("rule-Spin_ou_rien=roll:^[^sz]");
rules.push("why-Spin_ou_rien=Figure seule ou avec vrille uniquement sur la verticale");

// Pas de declenché dans les rotations composées. # Niveau Desavois
rules.push("rule-NFC=roll:(\\w,[fF])|([fF],\\w)");
rules.push("why-NFC=pas de declenche dans les rotations composees");

// Pas de rotation verticale de plus de 180°
rules.push("conv-vertqtrs=^9\\.([1-9]|10)\\.([156]|10)\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("rule-V180 = vertqtrs:<3");
rules.push("why-V180  = Pas de rotation superieure a 180 sur les verticales");

// Rotations limitées à 90°
rules.push("rule-Max90 = vertqtrs:<2");
rules.push("why-Max90  = Pas de rotation superieure a 90 sur ces verticales");

rules.push("conv-vertupqtrs=^9\\.([1-9]|10)\\.([16])\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("rule-Max90up = vertupqtrs:<2");
rules.push("why-Max90up  = Pas de rotation superieure a 90 sur la verticale montante");

rules.push("conv-vertdoqtrs=^9\\.([1-9]|10)\\.(5|10)\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("rule-Max90do = vertdoqtrs:<2");
rules.push("why-Max90do  = Pas de rotation superieure a 90 sur la verticale descendante");

// Pas de sortie poussée apres certaines vrilles
rules.push("conv-nopush=^9\\.1[12]\\.1\\.[5-8]=n ; ^9\\.[1248]\\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");
rules.push("rule-NSPushout  =nopush:n$");
rules.push("why-NSPushout   = Pas de sortie poussée apres la vrille");

// figures negatives
//Group-neg=^(1\.2\.[24]|1\.[37]\.[23]|1\.6\.4|1\.1[3579]\.2|1\.16\.[12]|2\.[3-8]\.|2\.11\.|5\.[12]\.[234]|5\.3\.|7\.[1256]\.2|7.[346]\.1|7\.19\.|7\.2[3479]\.|7\.20\.[234]|7\.2[18]\.[124]|7\.2[26]\.[23]|7\.25\.[12]|7\.30\.[23]|8\.[13]\.2|8\.[24]\.|8\.13\.|8\.3[17]\.[124]|8\.3[28]\.[23]|8\.34\.1|8\.4[17]\.[12]|8\.4[24]\.2|8\.4[08]\.1|8\.52\.1)|9\.1[02]\.
//neg-name=5 figures considerees comme negatives
//
// figures negatives pour Desavois V0
rules.push("Group-neg=^(1\\.12\\.[24]|1\\.1[37]\\.[23]|1\\.16\\.4|1\\.2[2468]\\.2|1\\.25\\.[12]|2\\.13\\.|2\\.2[256]\\.|2\\.3[4]\\.|2\\.4[23]\\.|5\\.[23]1\\.[234]|5\\.32\\.|7\\.[24][12]\\.2|7\\.2[34]\\.1|7\\.42\\.1|7\\.31\\.|7\\.8[1257]\\.|7\\.32\\.[234]|7\\.33\\.[124]|7\\.86\\.[124]|7\\.[38]4\\.[23]|7\\.83\\.[12]|7\\.88\\.[23]|8\\.4[13]\\.2|8\\.4[24]\\.|8\\.413\\.1|8\\.5[13]\\.[124]|8\\.5[24]\\.[23]|8\\.6[348]\\.1|8\\.58\\.1|8\\.5[57]\\.[12]|8\\.[56]6\\.2)|9\\.1[02]\\.");
rules.push("neg-name=5 figures considerees comme negatives");

// Modif 2013 ajout des regles suivantes (limitation des rotations) Début
//
// Rotations composées horizontales limitées à 720°
rules.push("conv-Horqtrs=^9\\.\\d+\\.[38]\\.([1-8])=$1; ^9\\.=0 ; ^0\\.=0");
rules.push("rule-Max720Hor =Horqtrs:<9");
rules.push("why-Max720Hor  = Pas de rotation composee horizontale superieure a 720 degres");

// Rotations composées 45° montantes limitées à 360°
rules.push("conv-Up45qtrs=^9\\.\\d+\\.[27]\\.([1-8])=$1; ^9\\.=0 ; ^0\\.=0");
rules.push("rule-Max360Up45 =Up45qtrs:<5");
rules.push("why-Max360Up45  = Pas de rotation composee sous 45 montant superieure a 360 degres");

// Rotations composées 45° descendantes limitées à 180°
rules.push("conv-Do45qtrs=^9\\.\\d+\\.[49]\\.([1-8])=$1; ^9\\.=0 ; ^0\\.=0");
rules.push("rule-Max180Do45 =Do45qtrs:<3");
rules.push("why-Max180Do45  = Pas de rotation composee sous 45 descendant superieure a 180 degres");
//
// Modif 2013 ajout des regles suivantes (limitation des rotations) Fin

rules.push("allow-defrules = NFC; V180; Max720Hor; Max360Up45; Max180Do45");//  Modif 2013 ajout des 3 regles Max...


rules.push("1.1.1.1-4");
rules.push("1.1.2.1-2");
rules.push("1.1.2.3-4 NR:1");
rules.push("1.1.3.1-4");
rules.push("1.1.6.1 Max90");
rules.push("1.1.6.3 SPIN");
rules.push("1.1.6.4 SPIN; NSPushout");
rules.push("1.1.7.1 Max90");
rules.push("1.1.7.3 SPIN; NSPushout");
rules.push("1.1.7.4 SPIN");
rules.push("1.2.1.1 NR:2");
rules.push("1.2.1.3 NR:1;Max90");
rules.push("1.2.2.2 NR:2");
rules.push("1.2.2.3 NR:1; Max90");
rules.push("1.2.3.1 NR:2");
rules.push("1.2.3.4 Max90");
rules.push("1.2.4.2 NR:2");
rules.push("1.2.4.4 Max90");
rules.push("1.2.5.1 NR:2");
rules.push("1.2.5.2 NR:1; NR:2");
rules.push("1.2.6.1 NR:2");
rules.push("1.2.6.2 NR:1; NR:2");
rules.push("1.2.7.1");
rules.push("1.2.8.2 NR:1");

rules.push("2.1.1.1-2");
rules.push("2.2.1.1-2");
rules.push("2.3.1.1-2");
rules.push("2.4.1.1-2");

rules.push("2.1.3.1-4");
rules.push("2.2.5.1-4");
//2.34.1-4 # Modif 2013 suppression figure
rules.push("2.2.6.1-4");

rules.push("5.2.1.1 Max90do");
rules.push("5.2.1.2 NR:1; NR:2");
rules.push("5.2.1.3 NR:2");
rules.push("5.2.1.4 NR:1;Max90");
rules.push("5.3.1.1 NR:1; NR:2; Max90do");
rules.push("5.3.1.2 NR:1; NR:2; NR:3");
rules.push("5.3.1.3 NR:1; NR:2; NR:3");
rules.push("5.3.1.4 NR:1; NR:2; Max90do");
rules.push("5.3.2.1 NR:2; Max90do");
rules.push("5.3.2.2-3 NR:2; NR:3");
rules.push("5.3.2.4 NR:2; Max90do");

rules.push("7.2.1.1 NF:1");
rules.push("7.2.1.2-3 NR:1; NR:2");
rules.push("7.2.1.4 NR:1; NF:2");
rules.push("7.2.2.1 NF:1");
rules.push("7.2.2.2 NR:1");
rules.push("7.2.2.4 NR:1; NF:2");
rules.push("7.2.3.1 NF:1; NR:2");
rules.push("7.2.3.2 NF:1");
rules.push("7.2.3.3 NR:2");
rules.push("7.2.4.1-2 NF:1");
rules.push("7.2.4.3 NF:2");
rules.push("7.4.1.1");
rules.push("7.4.1.2-4 NR:1");
rules.push("7.4.2.1-2");
rules.push("7.3.1.1");// Modif 2012
rules.push("7.3.1.2 NR:1");// Modif induite 2012
rules.push("7.3.1.3-4 NR:1; NR:2");
rules.push("7.3.2.1-2");
rules.push("7.3.2.3-4 NR:2");
rules.push("7.3.3.1");// Modif 2012
rules.push("7.3.3.2-4 NR:1");// Modif induite 2012
rules.push("7.3.4.1-4");
rules.push("7.8.1.1-2 NR:1; NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.1.4 NR:1; NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.2.1-2 NR:1; NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.2.4 NR:1; NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.3.1-2 NR:1; NR:3");// version 2010 + Correction 2012
rules.push("7.8.3.4 NR:1");// Correction 2012
rules.push("7.8.4.1-2 NR:1");// Correction 2012
rules.push("7.8.4.4 NR:1");// Correction 2012
rules.push("7.8.5.1-4 NR:1; NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.6.1-4 NR:1; NR:3");// version 2010 + Correction 2012
rules.push("7.8.7.1-4 NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.8.1-4 NR:3");// version 2010 + Correction 2012

rules.push("8.4.1.1 Max90do");
rules.push("8.4.1.2 NR:1; NR:2; Max90do");// Correction 2012
rules.push("8.4.2.1 NR:2");
rules.push("8.4.2.2 NR:1; Max90do");
rules.push("8.4.3.1 Max90do");
rules.push("8.4.3.2 NR:1; NR:2");
rules.push("8.4.4.1 NR:2");
rules.push("8.4.4.2 NR:1; Max90do");
rules.push("8.4.13.1 NR:1; NR:2");
rules.push("8.4.14.1 NR:1");
rules.push("8.5.1.1 NR:2");// Modif 2012
rules.push("8.5.1.2 NR:1; NR:2");// Modif induite 2012
rules.push("8.5.1.3 NR:1");
rules.push("8.5.1.4 NR:1; NR:2");
rules.push("8.5.2.1-3 NR:2");
rules.push("8.5.2.4");
rules.push("8.6.1.1 Max90up; NR:2; NF:3");
rules.push("8.6.3.1 Max90up; NR:2; NR:3");
rules.push("8.5.3.2 NF:2");
rules.push("8.5.3.3-4 NR:1");
rules.push("8.5.4.1 NF:2");
rules.push("8.5.4.3-4");
rules.push("8.6.2.1 Max90up; NR:2; NF:3");
rules.push("8.6.4.1 Max90up; NR:2; NF:3");
rules.push("8.6.4.3 Spin_ou_rien");
rules.push("8.5.5.1 NF:1; NR:2");
rules.push("8.5.5.2 NR:1; NR:2");
rules.push("8.5.5.4 NR:1");
rules.push("8.5.6.1 NF:1");
rules.push("8.5.6.2 NR:1");
rules.push("8.5.6.4 NR:1");
rules.push("8.6.5.1 NR:2; NR:3");
rules.push("8.6.6.2 NR:1; NR:2; NR:3");
rules.push("8.5.7.1-2 NF:1; NR:2");
rules.push("8.5.8.1-2 NF:1");
rules.push("8.6.7.2 NF:1; NR:2; NR:3");
rules.push("8.6.8.1 NF:1; NR:2; NR:3");
rules.push("8.5.17.1 Max90up; NR:2");
rules.push("8.5.19.2 Max90up; NR:2");

rules.push("9.1.1.1-2");
rules.push("9.1.2.2");
rules.push("9.1.2.4");
rules.push("9.1.3.2");
rules.push("9.1.3.4");
rules.push("9.1.3.6");
rules.push("9.1.3.8");
rules.push("9.1.4.2");
rules.push("9.1.5.1");
rules.push("9.2.2.4");
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.4.1.2");
rules.push("9.4.2.2");
rules.push("9.4.3.2");
rules.push("9.4.3.4");
rules.push("9.4.3.6");
rules.push("9.4.4.2");
rules.push("9.8.1.1");
rules.push("9.8.2.2");
rules.push("9.8.3.2");
rules.push("9.8.3.4");
rules.push("9.8.5.1");

rules.push("9.9.2.2");
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.10.2.2");
rules.push("9.10.3.2");

rules.push("9.11.1.4-8");
rules.push("9.12.1.4");

rules.push("(France national2 connu_1)");

rules.push("demo=-d1- -iv5is/ ,4h o1 ~+k''2if..'+``` ```+2fg2- 12% [-8,4] ```-2joi2-``` -4,3 ``h4/ ~~8b m2,\"4x4\"44");
rules.push("more=France national2 connu");

rules.push("(France national2 connu_2)");

rules.push("demo=v'4'/ 7sirp2 ```4,5c''...-`` ``-2dh...+` cc+``` mf;2+`` 3^6> 2joi2 6> ~+```k24..'+``/ ``+o44+`` 5% ```+````````48```rc > ++rp2,24");
rules.push("more=France national2 connu");

rules.push("[France national2 connu]");

rules.push("k-max=235");

rules.push("more=France national2 all");

rules.push("[France national2 inconnu]");

rules.push("k-max=220");

rules.push("more=France national2 all");

rules.push("[France national2 libre]");

rules.push("k-max=265");
rules.push("basefig-max=13");

rules.push("neg-min=6");
rules.push("fam2-min=1");
rules.push("fam5-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
rules.push("froll-min=1");
rules.push("hesroll-min=1");
rules.push("snap-min=1");
rules.push("spin-min=1");
rules.push("vrot-min=1");
rules.push("roller-min=1");

rules.push("emptyline-max=0");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

rules.push("more=France national2 all");

rules.push("(France national2 all)");

rules.push("poslj=20");
rules.push("posnl=20");
rules.push("floating-point=0");

rules.push("group-vrot=^9\\.[14]\\.1\\.2");
rules.push("vrot-name= rotation verticale de 180 degres");

//group-roller=^2\.(9|1[045])\.
rules.push("group-roller=^2\\.4[5-8]\\.");
rules.push("roller-name=tonneau en virage de 360 degres");

// Figures avec vrille seulement # Niveaux Espoirs,Desavois et CF2
rules.push("rule-SPIN=roll:^[^s]");
rules.push("why-SPIN=Figure avec vrille uniquement");

// Figures avec vrille ou rien  # Niveaux Desavois et CF2
rules.push("rule-Spin_ou_rien=roll:^[^sz]");
rules.push("why-Spin_ou_rien=Figure seule ou avec vrille uniquement sur la verticale");

// Pas de declenché en 2eme element d'une rotation composée. # Niveau CF2
rules.push("rule-NSF=roll:(\\w,[fF])");
rules.push("why-NSF=pas de declenche en 2eme element dans une rotation composee");

// Pas de declenché en deuxieme rotation dans les rotations composées.
//rule-NSF1=rfsz:^(\w,f)
//rule-NSF2=rfsz:^[\w,]+ (\w,f)
//rule-NSF3=rfsz:^[\w,]+ [\w,]+ (f|\w,f)
//why-NSF1=pas de declenche en 2eme element de rotation composee # Sur la 1ere rotation
//why-NSF2=pas de declenche en 2eme element de rotation composee # Sur la 2eme rotation
//why-NSF3=pas de declenche en 2eme element de rotation composee # Sur la 3eme rotation

// Pas de rotation verticale de plus de 180°
rules.push("conv-vertqtrs=^9\\.([1-9]|10)\\.([156]|10)\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("rule-V180 = vertqtrs:<3");
rules.push("why-V180  = Pas de rotation superieure a 180 sur les verticales");

// Rotations limitées à 90°
rules.push("rule-Max90 = vertqtrs:<2");
rules.push("why-Max90  = Pas de rotation superieure a 90 sur ces verticales");

rules.push("conv-vertupqtrs=^9\\.([1-9]|10)\\.([16])\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("rule-Max90up = vertupqtrs:<2");
rules.push("why-Max90up  = Pas de rotation superieure a 90 sur la verticale montante");

rules.push("conv-vertdoqtrs=^9\\.([1-9]|10)\\.(5|10)\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("rule-Max90do = vertdoqtrs:<2");
rules.push("why-Max90do  = Pas de rotation superieure a 90 sur la verticale descendante");

// Pas de sortie poussée apres certaines vrilles
rules.push("conv-nopush=^9\\.1[12]\\.1\\.[5-8]=n ; ^9\\.[1248]\\.=r; ^9.(9|10)=f; ^9.1[12]=s ; ^0\\.=z");
rules.push("rule-NSPushout  =nopush:n$");
rules.push("why-NSPushout   = Pas de sortie poussée apres la vrille");

// Modif 2013 ajout des regles suivantes (limitation des rotations) Début
//
// Rotations composées horizontales limitées à 720°
rules.push("conv-Horqtrs=^9\\.\\d+\\.[38]\\.([1-8])=$1; ^9\\.=0 ; ^0\\.=0");
rules.push("rule-Max720Hor =Horqtrs:<9");
rules.push("why-Max720Hor  = Pas de rotation composee horizontale superieure a 720 degres");

// Rotations composées 45° montantes limitées à 540°
rules.push("conv-Up45qtrs=^9\\.\\d+\\.[27]\\.([1-8])=$1; ^9\\.=0 ; ^0\\.=0");
rules.push("rule-Max540Up45 =Up45qtrs:<7");
rules.push("why-Max540Up45  = Pas de rotation composee sous 45 montant superieure a 540 degres");

// Rotations composées 45° descendantes limitées à 180°
rules.push("conv-Do45qtrs=^9\\.\\d+\\.[49]\\.([1-8])=$1; ^9\\.=0 ; ^0\\.=0");
rules.push("rule-Max180Do45 =Do45qtrs:<3");
rules.push("why-Max180Do45  = Pas de rotation composee sous 45 descendant superieure a 180 degres");
//
// Modif 2013 ajout des regles suivantes (limitation des rotations) Fin


// figures negatives
//Group-neg=^(1\.2\.[24]|1\.[37]\.[23]|1\.6\.4|1\.1[2478]\.2|1\.1[3569]\.[12]|2\.[3-9]\.|2\.1[0-9]\.|5\.[12]\.[234]|5\.3\.|7\.[15]\.[23]|7\.[34]\.1|7\.5\.[23]|7\.6\.[12]|7\.19\.|7\.2[3479]\.|7\.20\.[234]|7\.2[18]\.[124]|7\.2[26]\.[23]|7\.25\.[123]|7\.3[1246]\.|7\.3[08]\.[23]|7\.35\.[123]|7\.37\.[124]|8\.[13]\.2|8\.[24]\.|8\.[12][0379]\.[12]|8\.3[17]\.[124]|8\.3[28]\.[23]|8\.34\.18\.41\.[123]|8\.42\.[23]|8\.4[048]\.1|8\.47\.[12]|8\.52\.1|8\.66\.2)|9\.1[02]\.
//neg-name=6 figures considerees comme negatives
//
// figures negatives National 2 Num 2012 V1
//Group-neg=^(1\.12\.[24]|1\.1[37]\.[23]|1\.16\.4|1\.2[1367]\.2|1\.2[2458]\.[12]|2\.13\.|2\.2[2-6]\.|2\.3[245]\.|2\.4[2-8]\.|5\.[23]1\.[234]|5\.32\.|7\.2[12]\.[23]|7\.41\.[23]|7\.2[34]\.1|7\.42\.[12]|7\.31\.|7\.8[1257]\.|7\.32\.[234]|7\.33\.[124]|7\.86\.[124]|7\.[38]4\.[23]|7\.8(3|13)\.[123]|7\.8(9|1[0124])\.|7\.8(8|16)\.[23]|7\.815\.[124]|8\.4[13]\.2|8\.4[24]\.|8\.4(1[0379]|2[037])\.[12]|8\.71\.[12]|8\.5[13]\.[124]|8\.5[24]\.[23]|8\.55\.[123]|8\.56\.[23]|8\.6[3468]\.1|8\.5[78]\.1|8\.5(7|19)\.2)|9\.1[02]\.
//
// figures negatives National 2 Num 2012 V1 modifié 2013 en fonction des figures ajoutées en 2013 (7.5.[1247].[12]
rules.push("Group-neg=^(1\\.12\\.[24]|1\\.1[37]\\.[23]|1\\.16\\.4|1\\.2[1367]\\.2|1\\.2[2458]\\.[12]|2\\.13\\.|2\\.2[2-6]\\.|2\\.3[245]\\.|2\\.4[2-8]\\.|5\\.[23]1\\.[234]|5\\.32\\.|7\\.2[12]\\.[23]|7\\.41\\.[23]|7\\.2[34]\\.1|7\\.42\\.[12]|7\\.31\\.|7\\.8[1257]\\.|7\\.32\\.[234]|7\\.33\\.[124]|7\\.86\\.[124]|7\\.[38]4\\.[23]|7\\.5[14]\\.|7\\.5[27]\\.2|7\\.8(3|13)\\.[123]|7\\.8(9|1[0124])\\.|7\\.8(8|16)\\.[23]|7\\.815\\.[124]|8\\.4[13]\\.2|8\\.4[24]\\.|8\\.4(1[0379]|2[037])\\.[12]|8\\.71\\.[12]|8\\.5[13]\\.[124]|8\\.5[24]\\.[23]|8\\.55\\.[123]|8\\.56\\.[23]|8\\.6[3468]\\.1|8\\.5[78]\\.1|8\\.5(7|19)\\.2)|9\\.1[02]\\.");
rules.push("neg-name=6 figures considerees comme negatives");

rules.push("allow-defrules = NSF; V180; Max720Hor; Max540Up45; Max180Do45");//  Modif 2013 ajout des 3 regles Max...

rules.push("1.1.1.1-4");
rules.push("1.1.2.1-2");
rules.push("1.1.2.3-4 NR:1");
rules.push("1.1.3.1-4");
rules.push("1.1.6.1");
rules.push("1.1.6.3 Spin_ou_rien");
rules.push("1.1.6.4 SPIN; NSPushout");
rules.push("1.1.7.1");
rules.push("1.1.7.2 Max90");
rules.push("1.1.7.3 SPIN; NSPushout");
rules.push("1.1.7.4 Spin_ou_rien");
rules.push("1.2.1.1 Max90");
rules.push("1.2.1.2 NR:2");
rules.push("1.2.1.3 Max90");
rules.push("1.2.2.1 NR:2");
rules.push("1.2.2.2-3 Max90");
rules.push("1.2.3.1 Max90");
rules.push("1.2.3.2 NR:2");
rules.push("1.2.3.4 Max90");
rules.push("1.2.4.1 NR:2");
rules.push("1.2.4.2 Max90");
rules.push("1.2.4.4 Max90");
rules.push("1.2.5.1 NR:2");
rules.push("1.2.5.2 NR:2; Max90");
rules.push("1.2.6.1 NR:2");
rules.push("1.2.6.2 NR:2; Max90");
rules.push("1.2.7.1");
rules.push("1.2.7.2 Max90");
rules.push("1.2.8.1");
rules.push("1.2.8.2 Max90");
rules.push("1.3.2.1");
rules.push("1.3.4.1");

rules.push("2.1.1.1-2");
rules.push("2.2.1.1-2");
rules.push("2.3.1.1-2");
rules.push("2.4.1.1-2");

rules.push("2.1.3.1-4");
rules.push("2.2.5.1-4");
rules.push("2.3.4.1-4");
rules.push("2.4.5.1-4");
rules.push("2.4.7.1-4");
rules.push("2.2.6.1-4");
rules.push("2.3.5.1-4");
rules.push("2.4.6.1-4");
rules.push("2.4.8.1-4");
rules.push("2.2.3.1-4");
rules.push("2.2.4.1-4");

rules.push("5.2.1.1");
rules.push("5.2.1.2 NR:2; Max90up");
rules.push("5.2.1.3 NR:2");
rules.push("5.2.1.4 Max90up");
rules.push("5.3.1.1 NR:1; Max90up");
rules.push("5.3.1.2 NR:1; NR:2; NR:3");
rules.push("5.3.1.3 NR:1; NR:3 ; Max90up");
rules.push("5.3.1.4 NR:1; NR:2");
rules.push("5.3.2.1 NR:2");
rules.push("5.3.2.2-3 NR:2; NR:3");
rules.push("5.3.2.4 NR:2");

rules.push("7.2.1.1 NF:1");
rules.push("7.2.1.2 NR:1");
rules.push("7.2.1.3 NR:1; NR:2");
rules.push("7.2.1.4 NR:1; NF:2");
rules.push("7.2.2.1 NF:1");
rules.push("7.2.2.2 NR:1");
rules.push("7.2.2.3 NR:1; NF:2");
rules.push("7.2.2.4 NR:1; NF:2");
rules.push("7.2.3.1-2 NF:1");
rules.push("7.2.3.3 NF:2");
rules.push("7.2.4.1-2 NF:1");
rules.push("7.2.4.3 NF:2");
rules.push("7.4.1.1");
rules.push("7.4.1.2-4 NR:1");
rules.push("7.4.2.1-2");
rules.push("7.3.1.1-2");
rules.push("7.3.1.3-4 NR:1; NR:2");
rules.push("7.3.2.1-3");
rules.push("7.3.2.4 NR:2");
rules.push("7.3.3.1-2");
rules.push("7.3.3.3-4 NR:1");
rules.push("7.3.4.1-4");
rules.push("7.5.1.1-2 NR:1; NR:2; NR:3");// Modif 2013 ajout figure
rules.push("7.5.2.1-2 NR:1; NR:3");// Modif 2013 ajout figure
rules.push("7.5.4.1-2 NR:1; NR:2");// Modif 2013 ajout figure
rules.push("7.5.7.1-2 NR:1");// Modif 2013 ajout figure
rules.push("7.8.1.1-2 NR:1; NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.1.3-4 NR:1");// Correction 2012
rules.push("7.8.2.1-2 NR:1; NR:2");// version 2010 + Correction 2012
rules.push("7.8.2.3-4 NR:1");// Correction 2012
rules.push("7.8.3.1-2 NR:1; NR:3");// version 2010 + Correction 2012
rules.push("7.8.3.3-4 NR:1");// Correction 2012
rules.push("7.8.4.1-4 NR:1");// Correction 2012
rules.push("7.8.5.1-2 NR:3");// Correction 2012
rules.push("7.8.5.3-4 NR:1; NR:2; NR:3");// version 2010 + Correction 2012
rules.push("7.8.6.1-2 NR:3");// Correction 2012
rules.push("7.8.6.3-4 NR:1; NR:3");// version 2010 + Correction 2012
rules.push("7.8.7.1-2 NR:3");// Correction 2012
rules.push("7.8.7.3-4 NR:1; NR:3");// version 2010 + Correction 2012
rules.push("7.8.8.1-4 NR:3");// Correction 2012
rules.push("7.8.9.1-2");
rules.push("7.8.9.3-4 NR:1; NR:2; NR:3");
rules.push("7.8.10.1-2");
rules.push("7.8.10.3-4 NR:2; NR:3");
rules.push("7.8.11.1-2");
rules.push("7.8.11.3-4 NR:1; NR:3");
rules.push("7.8.12.1-2");
rules.push("7.8.12.3-4 NR:1; NR:2");
rules.push("7.8.13.1-2");
rules.push("7.8.13.3-4 NR:3");
rules.push("7.8.14.1-2");
rules.push("7.8.14.3-4 NR:2");
rules.push("7.8.15.1-2");
rules.push("7.8.15.3-4 NR:1");
rules.push("7.8.16.1-4");

rules.push("8.4.1.1 Max90do");
rules.push("8.4.1.2 NR:2; Max90do");// Correction 2012
rules.push("8.4.2.1 NR:2");
rules.push("8.4.2.2 Max90do");
rules.push("8.4.3.1 Max90do");
rules.push("8.4.3.2 NR:2");
rules.push("8.4.4.1 NR:2");
rules.push("8.4.4.2 Max90do");
rules.push("8.4.13.1 NR:1; NR:2");
rules.push("8.4.14.1 NR:1");
rules.push("8.4.15.1 NR:2");
rules.push("8.4.17.2 NR:2");
//8.419.1 NR:2  # Modif 2013 suppression figure
rules.push("8.4.19.2 NR:2");
//8.420.1  # Modif 2013 suppression figure
rules.push("8.4.20.2");
rules.push("8.5.1.1 NR:2");
rules.push("8.5.1.2 NF:2");
rules.push("8.5.1.3-4 NR:1");
rules.push("8.5.2.1 NF:2");
rules.push("8.5.2.2 NR:2");
rules.push("8.5.2.3-4");
rules.push("8.5.17.1 NR:2; Max90up");
rules.push("8.5.19.2 NR:2; Max90up");
rules.push("8.6.1.1 Max90up; NF:3");
rules.push("8.6.3.1 Max90up; NR:2; NR:3");
rules.push("8.6.3.3 Spin_ou_rien");
rules.push("8.5.3.1-2 NF:2");
rules.push("8.5.3.3-4 NR:1");
rules.push("8.5.4.1-2 NF:2");
rules.push("8.5.4.3-4");
rules.push("8.6.2.1 Max90up; NF:3");
rules.push("8.6.4.1 Max90up; NR:2; NF:3");
rules.push("8.6.4.3 Spin_ou_rien");
rules.push("8.5.5.1 NF:1; NR:2");
rules.push("8.5.5.2 NR:1; NR:2");
rules.push("8.5.5.3-4 NR:1");
rules.push("8.5.6.1 NF:1");
rules.push("8.5.6.2-4 NR:1");
rules.push("8.6.5.1 NF:1; Max90do");
rules.push("8.6.6.1 NF:1; NR:3");
rules.push("8.6.6.2 NR:1; NR:2");
rules.push("8.5.7.1-2 NF:1; NR:2");
rules.push("8.5.7.3");
rules.push("8.5.8.1-2 NF:1");
rules.push("8.5.8.3");
rules.push("8.6.7.2 NF:1; Max90do");
rules.push("8.6.8.1 NF:1; NR:2; Max90do");

rules.push("9.1.1.1-2");
rules.push("9.1.2.1-4");
rules.push("9.1.3.1-8");
rules.push("9.1.4.1-2");
rules.push("9.1.5.1-2");
rules.push("9.2.2.4");
rules.push("9.2.3.4-8");
rules.push("9.4.1.2");
rules.push("9.4.2.2");
rules.push("9.4.3.2-8");
rules.push("9.4.4.2");
rules.push("9.8.1.1");
rules.push("9.8.2.1-2");
rules.push("9.8.3.1-4");
rules.push("9.8.4.1-2");
rules.push("9.8.5.1");

rules.push("9.9.2.2");
rules.push("9.9.2.4");
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.10.2.2");
rules.push("9.10.3.2");
rules.push("9.10.4.2");
rules.push("9.10.8.2");

rules.push("9.11.1.4-8");
rules.push("9.12.1.4-6");

rules.push("[France advanced connu]");
rules.push("more=France civa advanced known");

rules.push("[France advanced libre]");
rules.push("more=France civa advanced free");

rules.push("[France advanced inconnu]");
rules.push("k-maxperfig=45");
// correction de l'oubli dans Civa
//8.61.4  NOU:1; NR:2 # Modif GG correction 2012 reporté dans Civa
//8.63.3  NOU:1; NR:2 # Modif GG correction 2012 reporté dans Civa
rules.push("more=France civa advanced unknownboth");

rules.push("(France doret connu_1)");

rules.push("demo=~~-,fpb`,2'' '',24ita.' n(''.6if..''),\"|\"4'/ ``7s''ik``2f```- 14% ~-48a34,3-``` ````-2ac(2)6f,6-````` -3% ~-3jo3---~/ ~~--''8'h.> ''\"|\"24g2,if'-");
rules.push("more=France doret connu");

rules.push("(France doret connu_2)");

rules.push("demo=ej 3h`2f'' '8`ta,4.- -2% -',if.rdb''22..+````` ifn(.,2..'')````- -2% -'6is.irp''f,9- -3jio3-~~/ -3% ~---4rp3,5-> ~~---k'f...''+``` -2% `+1,24m88");
rules.push("more=France doret connu");

rules.push("[France doret connu]");

rules.push("poslj=40");
rules.push("posnl=40");
rules.push("floating-point=0");
rules.push("k-max=350");
rules.push("basefig-min=9");// Modif GG correction 2012
rules.push("basefig-max=9");// Modif GG correction 2012
rules.push("allow=^[1-9]");

rules.push("[France doret libre]");

rules.push("poslj=40");
rules.push("posnl=40");
rules.push("floating-point=0");
rules.push("k-max=350");
rules.push("basefig-max=9");
rules.push("basefig-min=9");
//basefig-max=13

//  min 2 rotation verticales montantes
//group-vuprot=^9\.([12489]|10)\.[16]\.  # attention valide aussi une seule rotation composée
rules.push("Group-vuprot=9\\.([12489]|10)\\.[16]\\.");// attention ne valide pas deux rotations dans la même figure (N)
rules.push("vuprot-name=rotations verticales montantes");
rules.push("vuprot-min=2");

rules.push("basefig-repeat=1");
rules.push("roll-repeat=1");
rules.push("snap-repeat=1");
rules.push("spin-repeat=1");

//group-roller=^2\.([5-9]|1[0-5]|1[7-9]|20)
rules.push("group-roller=^2\\.(2[3-6]|3[2-5]|4[2-8])\\.");
rules.push("roller-name=Rolling turn, family 2.2.3-2.2.6 ou 2.3.2-2.3.5 ou 2.4.2-2.4.8");
//group-humpty=^8\.[1-4]\.
//humpty-name=family 8.1-8.4 (humpty bumps)

rules.push("fam1-min=1");
rules.push("roller-min=1");
rules.push("fam5-min=1");
//fam5-max=3 # Modif Civa 2012
rules.push("fam6-min=1");
rules.push("fam7-min=1");
rules.push("fam8-min=1");
//humpty-max=4 # Modif Civa 2012

rules.push("spin-min=1");
//spin-max=1 # Modif Civa 2012

rules.push("isnap-min=2");
rules.push("osnap-min=2");

rules.push("opposite-min=1");//one opposite roll is required!

rules.push("allow=^[1-9]");//all figures are allowed for the free program


rules.push("[France doret inconnu]");

rules.push("poslj=40");
rules.push("posnl=40");
rules.push("floating-point=0");
rules.push("k-max=350");

//###################################################################################################
//##
//## en cours de  réalisation sur la base ci-dessous (unlimited unknown) en adaptant la liste des figures
//## Liste des rotations autorisées amendée avec ajout du commentaire : # Modif GG
//## Reste à vérifier la regle R4 (prise en compte des possibles rotations aprés la vrille si necessaire)
//## La regle R6 genere systematiquement une erreur. Ne pas en tenir compte avec les figures indiquée comme valides
//##
//###################################################################################################

rules.push("conv-interdit=^[09]\\.=N");
rules.push("rule-Interdite = interdit:N");
rules.push("why-Interdite   = Figure de base interdite");

// Modif Civa 2012
rules.push("conv-horstop=^9\\.(1|9|10)\\.[38]=1 ; ^9\\.2\\.3\\.4 = 2 ;^9\\.2\\.3\\.6 = 3 ;^9\\.2\\.3\\.8 = 4 ;^9\\.4\\.3\\.([1-8]) = $1; ^9\\.8\\.3\\.1 = 2;^9\\.8\\.3\\.2 = 4;^9\\.8\\.3\\.3 = 6;^9\\.8\\.3\\.4 = 8; ^9\\.=r ; ^0\\.=z");
rules.push("rule-Hor10stop = horstop:<11");
rules.push("why-Hor10stop  = a maximum of 10 stops are allowed on straight horizontal lines rolls");
// Modif Civa 2012

//1.11.1-4 # etait supprimée dans la liste unlimited ci-dessous car considérée comme connectors. puis Modif 2013 Suppression CIVA 2013

//### régle R1

rules.push("2.1.2.1-4");// 17 et 18 deja dans la liste unlimited ci-dessous.

//### régle R2

// Supprimées dans la liste des figures autorisées ci-dessous

//### régle R3  NOU:1 existait déja comme régle Unlimited.

rules.push("7.4.1.2 NF:1; NOU:1");
rules.push("7.4.2.2 NF:1; NOU:1");

//### régle R4

rules.push("conv-roll_R4=^9\\.4\\.1\\.2=A; ^9\\.1\\.1\\.[1-4]=A; ^9\\.([1248])\\.=$1; ^9\\.(9|10)\\.([6-9]|10)=F; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");
//rule-R4 = roll_R4:^s [^Az]  # les possibilités de rotations alternées ou aprés la vrille ne sont pas prises en compte.
rules.push("rule-R4 = roll_R4:^s ([^Az]|\\w,)");// Prise en compte des possibilités de rotations alternées montantes mais pas aprés la vrille.
rules.push("why-R4 = pas de declenche ou pas cette rotation dans la branche montante avec une vrille dans la branche descendante.");

rules.push("8.4.1.1");
rules.push("8.4.1.2 No_depart_dos; No_sortie_dos");
rules.push("8.4.2.1 No_sortie_dos");
rules.push("8.4.2.2 No_depart_dos");
rules.push("8.4.3.1");
rules.push("8.4.3.2 No_depart_dos; No_sortie_dos");
rules.push("8.4.4.1 No_sortie_dos");
rules.push("8.4.4.2 No_depart_dos");
rules.push("8.4.1.3-4 R4");
rules.push("8.4.2.3-4 R4");
rules.push("8.4.3.3-4 R4");
rules.push("8.4.4.3-4 R4");

//### régle R5

rules.push("8.6.5.3-4 NF:3");
rules.push("8.6.6.3-4 NF:3");

//### régle R6

rules.push("conv-roll_R6=^9\\.10\\.8\\.2=X; ^9\\.([1248])\\.=$1; ^9\\.(9|10)\\.([6-9]|10)=F; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");
rules.push("rule-R6 = roll_R6:X");
rules.push("why-R6 = ce declenche est interdit. Sauf sur les figures 7.2.2.1, 7.2.4.2, 8.5.3.3, 8.5.4.4, 8.6.2.4 et 8.6.4.3.");
// Correction 2013 : 8.5.3.4 remplacé par 8.5.4.4 dans la ligne ci-dessus.

// R6 rajoutée dans le "allow-defrules" ci-dessous.

//### régle R7  les autres régles existaient déja comme régles Unlimited.

rules.push("7.4.1.3-4 NR:1; NOU:1 ; NF:1 ; N88");
rules.push("7.4.5.4  NR:1; NR:2; NF:2");

//### régle R8 et R9 NORF:2 existait déja comme régle Unlimited.

rules.push("rule-VDOWN180 = downqtrs:<3");
rules.push("why-VDOWN180  = un maximum 180 degres de rotation est permis.");
rules.push("rule-VDOWN270 = downqtrs:<4");
rules.push("why-VDOWN270  = un maximum 270 degres de rotation est permis.");
rules.push("rule-VDOWN1S = downstop:<2");// Si l'on conprend : pas 9.4.5.2 (pas de facettes).
rules.push("why-VDOWN1S  = pas de facette permise.");

rules.push("1.1.6.1");
rules.push("1.1.6.2 No_depart_dos");
rules.push("1.1.6.3 NF; VDOWN270; VDOWN1S");
rules.push("1.1.6.4 NF; VDOWN180; VDOWN1S; No_sortie_dos");
rules.push("1.1.7.1");
rules.push("1.1.7.2 No_depart_dos");
rules.push("1.1.7.3 NF; VDOWN180; VDOWN1S; No_sortie_dos");
rules.push("1.1.7.4 NF; VDOWN270; VDOWN1S");
rules.push("1.2.5.3 NORF:2; NF; VDOWN180; VDOWN1S");
rules.push("1.2.5.4 NF; VDOWN270; VDOWN1S");
rules.push("1.2.6.3 NF; VDOWN270; VDOWN1S");
rules.push("1.2.6.4 NORF:2; NF; VDOWN180; VDOWN1S");
rules.push("1.2.7.3 NORF:2; NF; VDOWN180; VDOWN1S");
rules.push("1.2.7.4 NF; VDOWN270; VDOWN1S");
rules.push("1.2.8.3 NF; VDOWN270; VDOWN1S");
rules.push("1.2.8.4 NORF:2; NF; VDOWN180; VDOWN1S");

//### régle R10 NORF existait déja comme régle Unlimited.

rules.push("rule-R10 = roll:^((\\w,[fF])|[fF]|([fF],\\w)) [1248]");// les possibilités de rotations alternées sont prises en compte.
rules.push("why-R10 = pas de rotation dans la branche descendante avec un declenche dans la branche montante.");

rules.push("8.4.15.1 R10");
rules.push("8.4.15.2 R10; NORF");
rules.push("8.4.15.3-4 NORF");

rules.push("8.4.16.1 R10");
rules.push("8.4.16.2-4 NORF");

rules.push("8.4.17.1 R10");
rules.push("8.4.17.2 R10; NORF");
rules.push("8.4.17.3-4 NORF");
rules.push("8.4.18.1");
rules.push("8.4.18.2 R10; NORF");
rules.push("8.4.18.3-4 NORF");

//### régle R11 et R12 les autres régles existaient déja comme régles Unlimited.

rules.push("conv-roll_R11=^9\\.1\\.1\\.[12]=A; ^9\\.([1248])\\.=$1; ^9\\.(9|10)\\.([6-9]|10)=F; ^9\\.(9|10)=f ; ^9\\.1[12]=s ; ^0\\.=z;");
// les possibilités de rotations alternées ne sont pas forcement toutes prises en compte.
//rule-R11 = roll_R11:(^[fF] [1248])|(^[1248] [1248])|(^[A1248] [fF])
// les possibilités de rotations alternées sont prises en compte.
rules.push("rule-R11 = roll_R11:(^((\\w,[A1248fF])|[1248fF]|([A1248fF],\\w)) [1248])|(^[^zA]+ [1248])|(^[^z]+ [fF])");
rules.push("why-R11 = cette combinaison de rotation montante et sommitale est interdite.");

rules.push("8.6.1.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP; R11");
rules.push("8.6.1.2  NOU:2; NF:3; NF2UP360; NF2UP2STOP; R11; No_depart_dos");
rules.push("8.6.3.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP; R11");
rules.push("8.6.3.2  NOU:2; NF:3; NF2UP360; NF2UP2STOP; R11; No_depart_dos");

//### régle R13 et R14  les autres régles existaient déja comme régles Unlimited.

rules.push("conv-roll_R14=^9\\.1\\.5\\.[123]=A; ^9\\.([1248])\\.=$1; ^9\\.(9|10)\\.([6-9]|10)=F; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");
rules.push("rule-R14 = roll_R14:^[\\w,]+ ([^z]|(\\w,\\w)) ([^Az]|(\\w,))");// les possibilités de rotations alternées sont prises en compte.
rules.push("why-R14 = cette rotation descendante est interdite en presence d'une rotation au sommet.");

rules.push("8.6.5.1  NOU:2 ; NF:1 ; NF3TOPH; R14");
rules.push("8.6.5.2  NOU:2 ; NF:1 ; NF3TOPH; VDOWN180; VDOWN1S; No_sortie_dos");// Si l'on conprend : pas 9.4.5.2 (pas de facettes).
rules.push("8.6.6.1  NOU:2 ; NF:1 ; NF3TOPH; VDOWN180; VDOWN1S; No_sortie_dos");// Si l'on conprend : pas 9.4.5.2 (pas de facettes).
rules.push("8.6.6.2  NOU:2 ; NF:1 ; NF3TOPH; R14");

//### régle R15 et R16

rules.push("conv-roll_R15=^9\\.1\\.5\\.[1-2]=A; ^9\\.([1248])\\.=X; ^9\\.(9|10)\\.([6-9]|10)=F; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");
rules.push("rule-R15 = roll:s,[fFX]");
rules.push("why-R15 = pas de declenche ou cette rotation apres une vrille.");

// R15 rajoutée dans le "allow-defrules" ci-dessous.

//### régles entrée dos (v) et sortie dos (n) interdite

rules.push("conv-doret_dos=^9\\.1\\.1\\.[5-8]=v; ^9\\.4\\.1\\.[4-8]=v; ^9\\.8\\.1\\.[2-8]=v; ^9\\.[12]\\.5\\.[4-8]=n; ^9\\.[48]\\.5\\.[3-8]=n; ^9\\.(9|10)\\.(5|10)\\.=n; ^9\\.([1248])\\.=r; ^9\\.(9|10)=f; ^9\\.1[12]=s ; ^0\\.=z");
rules.push("rule-No_depart_dos = doret_dos:^v");
rules.push("why-No_depart_dos = pas de depart dos avec cette rotation verticale.");
rules.push("rule-No_sortie_dos = doret_dos:n$");
rules.push("why-No_sortie_dos = pas de sortie dos avec cette rotation verticale.");

// Regles ci-dessus sont rajoutées sur les figures appropriées ci-dessous.

//###################################################################################################
//#####     debut de Recopie et de modification des regles civa 2011 unlimited unknown      #########
//###################################################################################################

//[*unlimited unknownbase]
rules.push("conv-climbqtrs=^9\\.([1-9]|10)\\.[1267]\\.([1-8]) = $2 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-climbstop=^9\\.(1|9|10)\\.[1267]=1 ; ^9\\.2\\.[12]\\.4 = 2 ;^9\\.2\\.[12]\\.6 = 3 ;^9\\.2\\.[12]\\.8 = 4 ;^9\\.4\\.[12]\\.([1-8]) = $1;^9\\.8\\.[12]\\.1 = 2;^9\\.8\\.[12]\\.2 = 4;^9\\.8\\.[12]\\.3 = 6;^9\\.8\\.[12]\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("conv-upqtrs=^9\\.([1-9]|10)\\.[16]\\.([1-8]) = $2 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-upstop=^9\\.(1|9|10)\\.[16]=1 ; ^9\\.2\\.1\\.4 = 2 ;^9\\.2\\.1\\.6 = 3 ;^9\\.2\\.1\\.8 = 4 ;^9\\.4\\.1\\.([1-8]) = $1; ^9\\.8\\.1\\.1 = 2;^9\\.8\\.1\\.2 = 4;^9\\.8\\.1\\.3 = 6;^9\\.8\\.1\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("conv-diagupqtrs=^9\\.([1-9]|10)\\.[27]\\.([1-8]) = $2 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-diagupstop=^9\\.1\\.2=1 ;^9\\.(9|10)\\.[27]=2 ; ^9\\.2\\.2\\.4 = 2 ;^9\\.2\\.2\\.6 = 3 ;^9\\.2\\.2\\.8 = 4 ;^9\\.4\\.2\\.([1-8]) = $1; ^9\\.8\\.2\\.1 = 2;^9\\.8\\.2\\.2 = 4;^9\\.8\\.2\\.3 = 6;^9\\.8\\.2\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("conv-downqtrs=^9\\.([1-9]|10)\\.(5|10)\\.([1-8]) = $3 ; ^9\\. = r ; ^0\\.=z");
rules.push("conv-downstop=^9\\.(1|9|10)\\.(5|10)=1 ; ^9\\.2\\.5\\.4 = 2 ;^9\\.2\\.5\\.6 = 3 ;^9\\.2\\.5\\.8 = 4 ;^9\\.4\\.5\\.([1-8]) = $1; ^9\\.8\\.5\\.1 = 2;^9\\.8\\.5\\.2 = 4;^9\\.8\\.5\\.3 = 6;^9\\.8\\.5\\.4 = 8; ^9\\.=r ; ^0\\.=z");

rules.push("rule-VUP450 = upqtrs:<6");
rules.push("why-VUP450  = a maximum of 450 degrees are allowed on vertical up opposite rolls");

rules.push("rule-DIAGUP540 = diagupqtrs:<7");
rules.push("why-DIAGUP540  = a maximum of 540 degrees are allowed on diagonal up opposite rolls");

rules.push("rule-VUP4S = upstop:<5");
rules.push("why-VUP4S  = a maximum of 4 stops are allowed on vertical up opposite rolls");

rules.push("rule-DIAGUP4S = diagupstop:<5");
rules.push("why-DIAGUP4S  = a maximum of 4 stops (3 if snap) are allowed on diagonal up opposite rolls");

//note +<6 indicates the total count is less than 6 ... all climbing rolls combined
rules.push("rule-CLIMB450 = climbqtrs:+<6");
rules.push("why-CLIMB450  = a maximum of 450 degrees are allowed on climbing rolls");

rules.push("rule-CLIMB4S = climbstop:+<5");
rules.push("why-CLIMB4S  = a maximum of 4 stops are allowed on climbing olls");

rules.push("rule-VDOWN360 = downqtrs:<5");
rules.push("why-VDOWN360  = a maximum of 360 degrees are allowed on vertical down opposite rolls");

rules.push("rule-VDOWN3S = downstop:<4");
rules.push("why-VDOWN3S  = a maximum of 3 stops are allowed on vertical down opposite rolls");

rules.push("conv-vdDhfsz=^9\\.[1248]\\.[15]=v;^9\\.[1248]\\.2=d;^9\\.[1248]\\.4=D; ^9\\.[1248]\\.=h; ^9\\.(9|10)\\.[1-5]=f;^9\\.(9|10)\\.=F; ^9\\.1[12]=s ; ^0\\.=z");
rules.push("rule-UnlimitedNOU  =vdDhfsz: D,|,D|v,[fF]|[Ff],v|[Ff],d");
rules.push("why-UnlimitedNOU  = opposite or unlinked roll/roll (or flick) combination is not allowed");

rules.push("rule-UnlimitedNOUF  =vdDhfsz: d,F");
rules.push("why-UnlimitedNOUF  = 45-up roll/flick (\"hard way\") combination is not allowed");

rules.push("rule-NF3TOPH  =roll: (.,.|248) [fF]$");
rules.push("why-NF3TOPH  = no flick roll on vertical down line after hesitation in the loop");

rules.push("rule-NF2UP360 = upqtrs: ^([5-8]|,4|4,|2,3|3,[23]) f");
rules.push("why-NF2UP360  = no flick roll on loop top after more than 360 roll going up");

rules.push("rule-NF2UP2STOP = upstop: ^([3-9]|,2|2,) f");
rules.push("why-NF2UP2STOP  = no flick roll on loop top after more than 2 stops going up");

rules.push("rule-N88 = roll: 8");
rules.push("why-N88     = 8 point roll is not allowed");

rules.push("rule-NORF   = roll: [1248],f");
rules.push("why-NORF    = roll,flick combination not allowed");


rules.push("allow-defrules= UnlimitedNOU ; UnlimitedNOUF; VUP450; VUP4S ; VDOWN360 ; VDOWN3S ;DIAGUP540 ; DIAGUP4S; R6 ; R15; Hor10stop");


// ~%~  ~i?d%~ ~i?v%~
//1.1.1-4  #2009 only as linking figures
rules.push("1.1.2.1");
rules.push("1.1.2.2 NORF");
rules.push("1.1.2.3-4");
rules.push("1.1.3.1");
rules.push("1.1.3.2 NORF");
rules.push("1.1.3.3-4");
//1.6.1-4
//1.7.1-4

// z_- z^ -iz_ -iz^-

rules.push("1.1.10.1 NORF");
//1.10.4
rules.push("1.1.11.1 NORF");
//1.11.4

// ~%i?t%~  ~%i?k%~

rules.push("1.2.1.1");
rules.push("1.2.1.2 NORF:1; No_sortie_dos");
rules.push("1.2.1.3-4");

rules.push("1.2.2.1 No_sortie_dos");
rules.push("1.2.2.2 NORF:1");
rules.push("1.2.2.3-4");

rules.push("1.2.3.1");
rules.push("1.2.3.2 NORF:1; No_sortie_dos");
rules.push("1.2.3.3-4");

rules.push("1.2.4.1 No_sortie_dos");
rules.push("1.2.4.2 NORF:1");
rules.push("1.2.4.3-4");

rules.push("1.2.5.1");
rules.push("1.2.5.2 No_depart_dos");
//1.16.3 NORF:2
//1.16.4

rules.push("1.2.6.1");
rules.push("1.2.6.2 No_depart_dos");
//1.17.3
//1.17.4 NORF:2

rules.push("1.2.7.1");
rules.push("1.2.7.2 No_depart_dos");
//1.18.3 NORF:2
//1.18.4

rules.push("1.2.8.1");
rules.push("1.2.8.2 No_depart_dos");
//1.19.3
//1.19.4 NORF:2

// ~[21]jo?1~   ~2j(|o|io|oi)2~ ~4j(|o|io|oi)[234]~ ~3j(|o|io|oi)3~
//              ~2j(|o|oi)15~        ~3j(|o|io|oi)15~

//2.11.1-2 # Modif 2013 Suppression CIVA 2013
//2.21.1-2 # Modif 2013 Suppression CIVA 2013
//2.31.1-2 # Modif 2013 Suppression CIVA 2013
//2.41.1-2 # Modif 2013 correction 2013

rules.push("2.1.3.1-4");
rules.push("2.2.2.1-4");

rules.push("2.2.5.1-4");
rules.push("2.4.3.1-4");
rules.push("2.3.4.1-4");
rules.push("2.4.5.1-4");
rules.push("2.4.7.1-4");
rules.push("2.2.6.1-4");
rules.push("2.4.4.1-4");
rules.push("2.3.5.1-4");
rules.push("2.4.6.1-4");
rules.push("2.4.8.1-4");

rules.push("2.2.3.1-4");
rules.push("2.3.2.1-4");
rules.push("2.2.4.1-4");
rules.push("2.3.3.1-4");

// ~%h%~ ~%i?ta%~

rules.push("5.2.1.1");
rules.push("5.2.1.2 No_depart_dos; No_sortie_dos");
rules.push("5.2.1.3 No_sortie_dos");
rules.push("5.2.1.4 No_depart_dos");
rules.push("5.3.1.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450");
rules.push("5.3.2.1-4  NF:1 ; NF:2 ; CLIMB4S ; CLIMB450");
rules.push("6.2.1.1  NF:1");
rules.push("6.2.1.2  NF:1; No_depart_dos; No_sortie_dos");
rules.push("6.2.1.3  NF:1; No_sortie_dos");
rules.push("6.2.1.4  NF:1; No_depart_dos");
rules.push("6.2.2.1  NF:1");
rules.push("6.2.2.2  NF:1; No_depart_dos; No_sortie_dos");
rules.push("6.2.2.3  NF:1; No_sortie_dos");
rules.push("6.2.2.4  NF:1; No_depart_dos");

//half loops
// ~%a%~ ~%m%~ ~o%~ io% -io%-  ~i?qo%~ %dq% -%idq%- qq -iqq-

rules.push("7.2.1.1-2  NF:1");
rules.push("7.2.2.1-2  NF:1");
rules.push("7.2.3.1-2  NF:1");
rules.push("7.2.4.1-2  NF:1");


rules.push("7.2.1.3-4  NF:2");
rules.push("7.2.2.3-4  NF:2");
rules.push("7.2.3.3-4  NF:2");
rules.push("7.2.4.3-4  NF:2");

//loops
rules.push("7.4.1.1 NOU:1");
//7.5.3-4 NOU:1 ; NF:1 ; N88
rules.push("7.4.2.1 NOU:1");
rules.push("7.4.3.1");
rules.push("7.4.3.2 No_depart_dos; No_sortie_dos");
rules.push("7.4.3.3-4 NF:1");
rules.push("7.4.4.1 No_sortie_dos");
rules.push("7.4.4.2 No_depart_dos");
rules.push("7.4.4.3-4 NF:1");

rules.push("7.4.5.1  NF:1");
//7.9.4  NF:2  #doc say "no flick roll on any lower lines of figure" which means what?!
rules.push("7.4.6.1");

//goldfish
// ~%i?g%~
rules.push("7.3.1.1 NORF:2");
rules.push("7.3.1.2 NORF:1");
rules.push("7.3.1.3-4");

rules.push("7.3.2.1");
rules.push("7.3.2.2 NORF");
rules.push("7.3.2.3-4");

rules.push("7.3.3.1 NORF:2");
rules.push("7.3.3.2 NORF:1");
rules.push("7.3.3.3-4");

rules.push("7.3.4.1");
rules.push("7.3.4.2 NORF");
rules.push("7.3.4.3-4");

//cc
// ~%i?cc%~
rules.push("7.8.1.1-2 NF:1");
rules.push("7.8.2.1-2 NF:1");
rules.push("7.8.3.1-2 NF:1");
rules.push("7.8.4.1-2 NF:1");

rules.push("7.8.1.3 NORF:2");
rules.push("7.8.1.4 NORF:3");
rules.push("7.8.2.3 NORF:2");
rules.push("7.8.2.4 NORF:3");
rules.push("7.8.3.3 NORF");
rules.push("7.8.3.4");
rules.push("7.8.4.3 NORF");
rules.push("7.8.4.4");

//rcc
rules.push("7.8.5.1 NF:3 ; NORF:2");
rules.push("7.8.5.2 NF:3 ; NORF:1");
rules.push("7.8.6.1 NF:3 ; NORF:2");
rules.push("7.8.6.2 NF:3 ; NORF:1");
rules.push("7.8.7.1 NF:3");
rules.push("7.8.7.2 NF:3 ; NORF");
rules.push("7.8.8.1 NF:3");
rules.push("7.8.8.2 NF:3 ; NORF");

rules.push("7.8.5.3-4");
rules.push("7.8.6.3-4");
rules.push("7.8.7.3-4");
rules.push("7.8.8.3-4");


//bumps
// ~%i?p?b%~
//8.1.1-4
//8.2.1-4
//8.3.1-4
//8.4.1-4

// %db%~   ~%rdb%~  ~%irdb%~
rules.push("8.4.13.1");
rules.push("8.4.14.1");

//8.15.1
//8.15.2-4 NORF

//8.16.1
//8.16.2-4 NORF

//8.17.1
//8.17.2-4 NORF
//8.18.1
//8.18.2-4 NORF

//rc
// ~%i?c%~  ~%i?rc%~ ~%i?rp%~
rules.push("8.5.1.1  NF:2");
rules.push("8.5.1.2  NF:2 ; NORF");
rules.push("8.5.2.1  NF:2");
rules.push("8.5.2.2  NF:2 ; NORF");

rules.push("8.5.3.1  NF:2");
rules.push("8.5.3.2  NF:2 ; NORF");
rules.push("8.5.4.1  NF:2");
rules.push("8.5.4.2  NF:2 ; NORF");
rules.push("8.5.1.3-4");
rules.push("8.5.2.3-4");
rules.push("8.5.3.3-4");
rules.push("8.5.4.3-4");

//rp
//8.33.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP
//8.34.1-2  NOU:2; NF:3; NF2UP360; NF2UP2STOP
rules.push("8.6.2.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP");
rules.push("8.6.2.2  NOU:2; NF:3; NF2UP360; NF2UP2STOP; No_depart_dos");
rules.push("8.6.4.1  NOU:2; NF:3; NF2UP360; NF2UP2STOP");
rules.push("8.6.4.2  NOU:2; NF:3; NF2UP360; NF2UP2STOP; No_depart_dos");

rules.push("8.6.1.3-4");
rules.push("8.6.3.3-4");
rules.push("8.6.2.3-4");
rules.push("8.6.4.3-4");

//c
rules.push("8.5.5.1-2  NF:1");
rules.push("8.5.6.1-2  NF:1");
rules.push("8.5.7.1-2  NF:1");
rules.push("8.5.8.1-2  NF:1");
rules.push("8.5.5.3   NORF:2");
rules.push("8.5.5.4");
rules.push("8.5.6.3   NORF:2");
rules.push("8.5.6.4");
rules.push("8.5.7.3");
rules.push("8.5.7.4   NORF:2");
rules.push("8.5.8.3");
rules.push("8.5.8.4    NORF:2");

//p
//8.43.1-2  NOU:2 ; NF:1 ; NF3TOPH
//8.44.1-2  NOU:2 ; NF:1 ; NF3TOPH
rules.push("8.6.7.1  NOU:2 ; NF:1 ; NF3TOPH; No_sortie_dos");
rules.push("8.6.7.2  NOU:2 ; NF:1 ; NF3TOPH");
rules.push("8.6.8.1  NOU:2 ; NF:1 ; NF3TOPH");
rules.push("8.6.8.2  NOU:2 ; NF:1 ; NF3TOPH; No_sortie_dos");
//8.43.3-4
//8.44.3-4
rules.push("8.6.7.3-4");
rules.push("8.6.8.3-4");


// ROLLS
// v[42315] d[216] [42316]   id[216] iv[4231]
rules.push("9.1.1.1-5");
rules.push("9.1.2.1-6");
rules.push("9.1.3.1-8");
rules.push("9.1.4.2");
rules.push("9.1.4.4");
rules.push("9.1.4.6");
rules.push("9.1.5.1-4");

// v22 d22 [23]2   id22 iv22

rules.push("9.2.1.4");
rules.push("9.2.2.4");
//9.2.2.6 #Modif GG
rules.push("9.2.3.4");
rules.push("9.2.3.6");
rules.push("9.2.3.8");
rules.push("9.2.4.4");
rules.push("9.2.5.4");

// v[234]4  d[24]4 [234]4 id[24]4 iv[23]4

rules.push("9.4.1.2-4");
//9.4.2.2-4 #Modif GG
rules.push("9.4.2.2");//Modif GG
rules.push("9.4.2.4");//Modif GG
rules.push("9.4.3.2-4");
rules.push("9.4.4.2");
rules.push("9.4.4.4");
rules.push("9.4.5.2-3");

// v4?8  d48 [48]8  id48 iv4?8

rules.push("9.8.1.1-2");
//9.8.2.1-2 #Modif GG
rules.push("9.8.2.2");//Modif GG
//9.8.3.1-2 #Modif GG
rules.push("9.8.3.2");//Modif GG
rules.push("9.8.3.4");
rules.push("9.8.4.2");
rules.push("9.8.5.1-2");

//snaps & spins
// ~v[231]f   ~d[21]f  ~[21]f  ~id[21]f  ~iv[231]f  6f id6f
// ~v[231]if  ~d[21]if ~[21]if ~id[21]if ~iv[231]if  -6if
rules.push("9.9.1.2-4");
rules.push("9.9.2.2");
rules.push("9.9.2.4");
rules.push("9.9.3.2");
rules.push("9.9.3.4");
rules.push("9.9.3.6");
rules.push("9.9.4.2");
rules.push("9.9.4.4");
rules.push("9.9.4.6");
rules.push("9.9.5.2-4");
//9.9.6.2-4 #Modif GG
rules.push("9.9.6.4");//Modif GG
//9.9.7.2 #Modif GG
//9.9.7.4 #Modif GG
//9.9.8.2 #Modif GG
//9.9.8.4 #Modif GG
//9.9.9.2 #Modif GG
//9.9.9.4 #Modif GG
rules.push("9.9.10.2-4");

//9.10.1.2-4 #Modif GG
rules.push("9.10.2.2");
rules.push("9.10.2.4");
rules.push("9.10.3.2");
rules.push("9.10.3.4");
rules.push("9.10.3.6");
rules.push("9.10.4.2");
rules.push("9.10.4.4");
rules.push("9.10.5.2-4");
//9.10.6.2-4 #Modif GG
rules.push("9.10.6.2");//Modif GG
rules.push("9.10.6.4");//Modif GG
//9.10.7.2 #Modif GG
//9.10.7.4 #Modif GG
rules.push("9.10.8.2");
//9.10.8.4 #Modif GG
//9.10.9.2 #Modif GG
//9.10.9.4 #Modif GG
rules.push("9.10.10.2-4");

// [156]i?s

rules.push("9.11.1.4-6");
rules.push("9.12.1.4-6");


//#######################################################################################
//#####     fin de Recopie et modif des regles civa 2011 unlimited unknown      #########
//#######################################################################################

rules.push("[France unlimited connu]");
rules.push("more=France civa unlimited known");

rules.push("[France unlimited libre]");
rules.push("more=France civa unlimited free");

rules.push("[France unlimited inconnu]");
rules.push("more=France civa unlimited unknown");

//######################################################################################
//#####     Fin des modifs et tests de GG      #########################################
//######################################################################################
