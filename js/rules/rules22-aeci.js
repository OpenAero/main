// OpenAero rules22-AeCI.js file

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

// This file defines AeCI rules for 2022
// Adorisio Francesco 2022

rules.push(

    //###############################################################################
    //##### AeCI INTERMEDIATE FREE KNOWN ##################################################
    //###############################################################################

    //INTERMEDIATE known
    "[AeCI Intermediate known]",
    "posnl=30",
    "basefig-max=10",
    "basefig-min=10",

    //definizione delle famiglie minime per la composizione dei programmi
    "fam5-min=1",
    "fam7-min=1", //7.2 half loops 7.3 three quarter loops 7.4 whoole loops 7.5 horizontal and vertical S 7.8 horizontal+vertical 8 
    "fam8-min=1", //8.4 humpty bumps, 8.5 half cubans, 8.6 "P" loops, 8.7 "Q" loops, 8.8 double humpty bumps, 8.10 reversing 1 1/4 loops
    "froll-min=1", //family 9.1 continous roll
    "hroll-min=1", //family 9.2 2 points roll
    "qroll-min=1", //family 9.4 4 points roll
    "eroll-min=1", //family 9.8 8 points roll
    "snap-min=1",//family 9.9 and 9.10 flick roll
    "spin-min=1", //family 9.11 and 9.12 spin

    //"group-roller=^2\\.[1-4]\\.[^1]",
    //"roller-name=Rolling turn, family 2.1 to 2.4",
    //"roller-min=1",
    //"emptyline-max=0",


    "figure-letters=ABCDE",
    "additionals=4/24",
    //DEFINIZIONE MASTER SET... figure da selezionare nel catalogo AeCI ammesse
    'reference="@A" p(22) (8,0) "@B" 4h8 (0,11) "@C" m32 (0,9) "@D" of (0,1) "@E" 6a ',


    // ripetizioni 

    "basefig-repeat=1", // nessuna ripetizione di figura base è permessa
    "fam9-repeat=1", // nessuna ripetizione di airelon roll è permessa

    //"opposite-min=1", //one opposite roll is required!
    //"allow=^[1-9]", //all figures are allowed for the Free program

    // LIMITAZIONI e REGOLE

    // NHR  = no hesitation roll (comando costruito FAD)
    // N88  = 8 point roll is not allowed (comando costruito FAD)
    // NEQR = no eigth point or quarter hesitation roll
    // NER  = no eigths hesitation roll
    // NF   = no flick allowed (Comando Open aero)
    // NOU  = no opposite or unlinked rolls (Comando Open aero)
    // NR = no roll on segment (Comando Open aero)
    // MAX360= max 360 rotation allowed (Comando Open aero)
    // OS   = only SPIN (Comando Open aero)

    "rule-N88   = roll: [8]",
    "why-N88    = 8 point roll not allowed",

    //"rule-NHR   = roll: [248]",
    //"why-NHR    = 8 point roll is not allowed",

    //"rule-HR180  = upqtrs:<3",
    //"why-HR180   = no more than half roll",

    //"rule-NHR = hrfsz:^h",
    //"rule-NHR2 = hrfsz:^[\\w,]+ h",
    //"rule-NHR3 = hrfsz:^[\\w,]+ [\\w,]+ h",
    //"why-NHR = no hesitation roll is allowed for 1st roll",
    //"why-NHR2 = no hesitation roll is allowed for 2nd roll",
    //"why-NHR3 = no hesitation roll is allowed for 3rd roll",

    //"rule-NEQR1 = hqerfsz:^[eq]",
    //"rule-NEQR2 = hqerfsz:^[\\w,]+ [eq]",
    //"rule-NEQR3 = hqerfsz:^[\\w,]+ [\\w,]+ [eq]",
    //"why-NEQR1 = no eigths or quarter hesitation roll is allowed for 1st roll",
    //"why-NEQR2 = no eights or quarter hesitation roll is allowed for 2nd roll",
    //"why-NEQR3 = no eights or quarter hesitation roll is allowed for 3rd roll",

    //"rule-NER1 = hqerfsz:^e",
    //"rule-NER2 = hqerfsz:^[\\w,]+ e",
    //"rule-NER3 = hqerfsz:^[\\w,]+ [\\w,]+ e",
    //"why-NER1 = no eigths hesitation roll is allowed for 1st roll",
    //"why-NER2 = no eights hesitation roll is allowed for 2nd roll",
    //"why-NER3 = no eights hesitation roll is allowed for 3rd roll",

    //"rule-MaxQUp =int:v",
    //"rule-MaxQDn =int:d",
    //"why-MaxQUp  =maximum quarter roll up",
    //"why-MaxQDn  =maximum quarter roll down",

    //"rule-NF1=rfsz:^[^ ]*f",
    //"rule-NF2=rfsz:^[^ ]+ [^ ]*f",
    //"rule-NF3=rfsz:^[^ ]+ [^ ]+ [^ ]*f",
    //"rule-NF4=rfsz:^[^ ]+ [^ ]+ [^ ]+ [^ ]*f",

    //"why-NF1=no flick is allowed on the first roll element",
    //"why-NF2=no flick is allowed on the second roll element",
    //"why-NF3=no flick is allowed on the third roll element",
    //"why-NF4=no flick is allowed on the fourth roll element",

    //"rule-NR1 = rfsz:^[^z]",
    //"rule-NR2 = rfsz:^[^ ]+ [^z]",
    //"rule-NR3 = rfsz:^[^ ]+ [^ ]+ [^z]",
    //"rule-NR4 = rfsz:^[^ ]+ [^ ]+ [^ ]+ [^z]",

    //"why-NR1  =no roll allowed for first rolling element ",
    //"why-NR2  =no roll allowed for second rolling element",
    //"why-NR3  =no roll allowed for third rolling element",
    //"why-NR4  =no roll allowed for fourth rolling element",

    //"rule-OS1 = rfsz:^[rf]",
    //"rule-OS2 = rfsz:^[^ ]+ [rf]",
    //"rule-OS3 = rfsz:^[^ ]+ [^ ]+ [rf]",
    //"rule-OS4 = rfsz:^[^ ]+ [^ ]+ [^ ]+ [rf]",

    //"why-OS1  =only spin allowed for first rolling element ",
    //"why-OS2  =only spin allowed for second rolling element",
    //"why-OS3  =only spin allowed for third rolling element",
    //"why-OS4  =only spin allowed for fourth rolling element",


    //CHEKING VALIDITY

    // Lines
    "1.1.1.1 NF ; NOU",
    "1.1.1.2 NF ; NOU",
    "1.1.1.3 NF ; NOU",
    "1.1.1.4 NF ; NOU",

    //"1.1.1.2-4 NF",
    //"1.1.2.1 NF",
    //"1.1.2.1-4",
    "1.1.2.1 NOU",
    "1.1.2.2 NOU",
    "1.1.2.3 NOU",
    "1.1.2.4 NOU",
    "1.1.3.1 NOU",
    "1.1.3.2 NOU",
    "1.1.3.3 NOU",
    "1.1.3.4 NOU",
    //"1.1.2.3 NOU ; NHR1 ; NF1",
    //"1.1.2.4 NOU ; NF1",
    //"1.1.3.3 NOU ; NF1; NEQR1" ,
    //"1.1.3.4 NOU ; NF1; NEQR1" ,
    //"1.1.3.4 NOU",
    "1.1.6.1 NOU",
    "1.1.6.3 NOU",
    "1.1.7.1 NOU",
    "1.1.7.4 NOU",

    // Sharks tooth
    "1.2.1.1 NR:1; NR:2",
    //"1.2.1.3 NOU; NR:2",
    //"1.2.2.3 NOU ; MaxQUp",
    "1.2.3.1 NOU; NR:2",
    //"1.2.3.4 NOU ; NHR1",
    //"1.2.4.4 NOU ; NHR1",
    "1.2.5.1 NOU; NR:2",
    //"1.2.5.4 NOU ; OS1 ; NR2",
    "1.2.6.1 NOU ; NR:2",
    //"1.2.6.3 NOU ; OHS",
    "1.2.7.1 NOU",
    //"1.2.7.4 NOU ; NHR2",
    "1.2.8.1 NOU",
    //"1.2.8.3 NOU ; MaxQDn ; OHS",

    // Bow
    //"1.3.2.1 NOU",

    // Turns & rolling circles
    "2.1.1.1",
    "2.1.1.2",
    "2.1.3.1",
    "2.1.3.2",
    "2.1.3.3",
    "2.1.3.4",
    "2.2.1.1",
    "2.2.1.2",
    "2.2.5.1",
    "2.2.5.2",
    "2.2.5.3",
    "2.2.5.4",
    "2.2.6.1",
    "2.2.6.2",
    "2.3.1.1",
    "2.3.1.2",
    "2.3.4.1",
    "2.3.4.2",
    "2.4.1.1",
    "2.4.1.2",
    "2.4.7.1",


    // -idz+
    //"3.3.1.4 NOU",

    // Hammerheads
    "5.2.1.1 NOU",
    "5.2.1.3 NOU; NR:2",
    "5.2.1.4 NOU; NR:1",


    // Half loops
    "7.2.1.1 NOU ; NF:1; NF:2",
    "7.2.1.2 NR:1 ; NR:2",
    //"7.2.1.4 NOU ; NR1 ; NF2",
    "7.2.2.1 NOU ; NF:1 ; MAX360 ; N88:1 ",
    //"7.2.2.4 NOU ; NR1 ; NF2",
    "7.2.3.1 NOU ; NF:1 ; MAX360 ; NR:2",
    "7.2.3.2 NOU ; NF:1 ; MAX360 ; NR:2",
    //"7.2.3.3 NOU ; NEQR2 ; NF2",
    "7.2.4.2 NOU ; MAX360 ; NF:1 ; NF:2",
    //"7.2.4.3 NOU ; NHR2 ; NF2",

    // Goldfish
    //"7.3.1.2 NOU ; NR1",
    "7.3.1.3 NR",
    "7.3.2.1 NR:2 ; MAX360",
    "7.3.2.4 NR:2 ; MAX360",
    "7.3.3.3 NOU",
    "7.3.4.1 MAX360",
    "7.3.4.4 NOU",

    // Loops
    "7.4.1.1 NOU; N88",
    "7.4.1.2 NR",
    //"7.4.3.1 NOU ; NR1",
    //"7.4.5.1 NOU ; NR1 ; NR2",

    // Reversing loops
    //"7.3.7.1 NOU ; NHR1",
    //"7.4.8.1 NOU ; NR1 ; NHR2",
    //"7.4.9.3 NOU ; NF1 ; NHR1",
    //"7.4.12.3 NOU ; NHR2",

    // Horizontal S-es
    //"7.5.2.1 NOU ; NEQR1 ; NF1 ; NHR2 ; NR3",
    //"7.5.2.4 NOU ; NR1 ; NHR2 ; NEQR3 ; NF3",
    //"7.5.5.3 NOU ; NF1 ; NHR2 ; NR3",
    //"7.5.7.1 NOU ; NR1 ; NHR2 ; NF3",

    // Horizontal 8
    "7.8.1.1 NR",


    // Full cubans
    "7.8.2.2 NOU ; NR:1 ; NR:2",
    "7.8.3.1 NOU ; MAX360:1 ; NR:1 ; NR:3",
    //"7.8.3.4 NOU ; NR1 ; NR3",
    "7.8.4.1 NOU ; NR:1",
    //"7.8.6.3 NOU ; NR1 ; NR3",
    "7.8.8.1 NOU ; NR:3",
    //"7.8.8.4 NOU ; NR3",

    // Humpty bumps
    "8.4.1.1 NOU",
    "8.4.2.1 NOU ; NR:2",
    "8.4.2.2 NOU ; NR:1",
    "8.4.3.1 NOU",
    "8.4.4.2 NR",
    //"8.4.13.1 NOU ; NR1 ; NR2",
    //"8.4.14.1 NOU ; NR1",
    //"8.4.15.1 NOU ; NR2",

    // Half cubans
    "8.5.1.1 NR",
    "8.5.1.2 NR",
    //"8.5.1.3 NOU ; NEQR2",
    "8.5.1.4 NR",
    "8.5.2.1 NOU ; MAX360; NR:2",
    "8.5.2.2 NOU ; MAX360; NR:2",
    "8.5.2.3 NOU ; NR:2",
    "8.5.2.4 NOU ; NR:2",
    "8.5.3.1 NR",
    "8.5.3.3 NOU; NR:1",
    "8.5.4.1 NOU ; MAX360; NF:2",
    "8.5.4.4 NOU ; MAX360",
    "8.5.5.1 NR",
    "8.5.5.2 NR",
    //"8.5.5.4 NOU ; NEQR1",
    "8.5.6.1 NOU ; NR:1",
    "8.5.7.1 NOU ; MAX360; NR:2",
    "8.5.7.2 NOU ; MAX360; NR:2",
    //"8.5.7.3 NOU ; NF1",
    "8.5.8.2 NOU ; MAX360",
    //"8.5.8.3 NOU ; NF1 ; NH1 ; NHR2",

    // Keyhole loops
    //"8.5.9.1 NR1 ; NR2",
    //"8.5.17.1 NR1 ; NR2",

    // P loops
    "8.6.1.1 NOU ; NR:2; NF:3",
    "8.6.2.1 NOU; NR:2; MAX360; NF:3",
    "8.6.3.1 NR",
    //"8.6.3.3 NOU ; NR1 ; NEQR2 ; NF2",
    //"8.6.4.3 NOU ; OHS ; NF2 ; NER2",
    //"8.6.5.1 NOU ; NF1 ; NER1 ; NHR2 ; BOTTOP ; MaxQDn",
    "8.6.6.2 NR",
    //"8.6.7.2 NOU ; NR2",
    //"8.6.7.3 NOU ; NF1 ; MaxQUp",
    //"8.6.8.3 NOU ; NF1 ; MaxQUp",

    // Porpoises
    //"8.6.11.1 NOU ; NR1 ; NR2 ; NEQR3 ; NF3",
    //"8.6.11.3 NOU ; OHS ; NR2 ; NEQR3 ; NF3",

    // Q loops
    //"8.7.1.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
    //"8.7.3.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
    //"8.7.5.1 NOU ; NF1 ; NEQR1 ; NHR2 ; NR3",
    //"8.7.7.2 NOU ; NER1 ; NR2 ; NR3",

    // Rolls
    //"9.1.1.1-2",
    //"9.1.2.1-4",
    //"9.1.2.3",
    //"9.1.3.1-6",
    "9.1.1.1",
    "9.1.2.1",
    "9.1.2.2",
    "9.1.2.3",
    "9.1.2.4",
    "9.1.3.2",
    "9.1.3.4",
    "9.1.3.6",
    "9.1.4.2",
    "9.1.5.1",
    //"9.2.3.4-6",
    "9.2.3.4",
    "9.2.3.6",
    //"9.4.1.2",
    "9.4.2.2",
    "9.4.3.2",
    "9.4.3.4",
    "9.4.3.6",
    "9.4.4.2",
    "9.8.1.1",
    //"9.8.2.2",
    //"9.8.3.1-2",
    "9.8.2.2",
    "9.8.3.2",
    "9.8.3.4",
    "9.8.5.1",

    // Snaps
    "9.9.3.2",
    "9.9.3.4",
    //"9.9.4.4",

    // Spins
    //"9.11.1.4-6",
    //"9.12.1.4-6",
    "9.11.1.4",
    "9.11.1.5",
    "9.11.1.6",
    "9.12.1.4",
    "9.12.1.5",
    "9.12.1.6",


    //###############################################################################
    //##### AeCI INTERMEDIATE UNKNOWN 1 ##################################################
    //###############################################################################

    //INTERMEDIATE unk 1


    "[AeCI Intermediate Unknown1]",
    "basefig-max=14",
    "basefig-min=10",
    "posnl=30",

    //definizione delle famiglie minime per la composizione dei programmi
    "fam5-min=1",
    "fam7-min=1", //7.2 half loops 7.3 three quarter loops 7.4 whoole loops 7.5 horizontal and vertical S 7.8 horizontal+vertical 8 
    "spin-max=1", //family 9.11 and 9.12 spin

    "figure-letters=ABCDE",
    "additionals=4/24",

    // ripetizioni 

    "basefig-repeat=1", // nessuna ripetizione di figura base è permessa
    "fam9-repeat=1", // nessuna ripetizione di airelon roll è permessa

    // LIMITAZIONI e REGOLE

    // NHR  = no hesitation roll (comando costruito FAD)
    // N88  = 8 point roll is not allowed (comando costruito FAD)
    // NEQR = no eigth point or quarter hesitation roll
    // NER  = no eigths hesitation roll
    // NF   = no flick allowed (Comando Open aero)
    // NOU  = no opposite or unlinked rolls (Comando Open aero)
    // NR = no roll on segment (Comando Open aero)
    // MAX360= max 360 rotation allowed (Comando Open aero)
    // OS   = only SPIN (Comando Open aero)

    "rule-N88  = roll: [8]",
    "why-N88   = 8 point roll not allowed",



    //CHEKING VALIDITY

    // Lines
    "1.1.1.1 NF ; NOU",
    "1.1.1.2 NF ; NOU",
    "1.1.1.3 NF ; NOU",
    "1.1.1.4 NF ; NOU",


    "1.1.2.1 NOU",
    "1.1.2.2 NOU",
    "1.1.2.3 NOU",
    "1.1.2.4 NOU",
    "1.1.3.1 NOU",
    "1.1.3.2 NOU",
    "1.1.3.3 NOU",
    "1.1.3.4 NOU",

    "1.1.6.1 NOU",
    "1.1.6.3 NOU",
    "1.1.7.1 NOU",
    "1.1.7.4 NOU",

    // Sharks tooth
    "1.2.1.1 NR:1; NR:2",

    "1.2.3.1 NOU; NR:2",

    "1.2.5.1 NOU; NR:2",

    "1.2.6.1 NOU ; NR:2",

    "1.2.7.1 NOU",

    "1.2.8.1 NOU",


    // Bow
    //"1.3.2.1 NOU",

    // Turns & rolling circles
    "2.1.1.1",
    "2.1.1.2",
    "2.1.3.1",
    "2.1.3.2",
    "2.1.3.3",
    "2.1.3.4",
    "2.2.1.1",
    "2.2.1.2",
    "2.2.5.1",
    "2.2.5.2",
    "2.2.5.3",
    "2.2.5.4",
    "2.2.6.1",
    "2.2.6.2",
    "2.3.1.1",
    "2.3.1.2",
    "2.3.4.1",
    "2.3.4.2",
    "2.4.1.1",
    "2.4.1.2",
    "2.4.7.1",


    // -idz+
    //"3.3.1.4 NOU",

    // Hammerheads
    "5.2.1.1 NOU",
    "5.2.1.3 NOU; NR:2",
    "5.2.1.4 NOU; NR:1",


    // Half loops
    "7.2.1.1 NOU ; NF:1; NF:2",
    "7.2.1.2 NR:1 ; NR:2",

    "7.2.2.1 NOU ; NF:1 ; MAX360 ; N88:1 ",

    "7.2.3.1 NOU ; NF:1 ; MAX360 ; NR:2",
    "7.2.3.2 NOU ; NF:1 ; MAX360 ; NR:2",

    "7.2.4.2 NOU ; MAX360 ; NF:1 ; NF:2",


    // Goldfish
    //"7.3.1.2 NOU ; NR1",
    "7.3.1.3 NR",
    "7.3.2.1 NR:2 ; MAX360",
    "7.3.2.4 NR:2 ; MAX360",
    "7.3.3.3 NOU",
    "7.3.4.1 MAX360",
    "7.3.4.4 NOU",

    // Loops
    "7.4.1.1 NOU; N88",
    "7.4.1.2 NR",


    // Reversing loops
    //"7.3.7.1 NOU ; NHR1",
    //"7.4.8.1 NOU ; NR1 ; NHR2",
    //"7.4.9.3 NOU ; NF1 ; NHR1",
    //"7.4.12.3 NOU ; NHR2",

    // Horizontal S-es
    //"7.5.2.1 NOU ; NEQR1 ; NF1 ; NHR2 ; NR3",
    //"7.5.2.4 NOU ; NR1 ; NHR2 ; NEQR3 ; NF3",
    //"7.5.5.3 NOU ; NF1 ; NHR2 ; NR3",
    //"7.5.7.1 NOU ; NR1 ; NHR2 ; NF3",

    // Horizontal 8
    "7.8.1.1 NR",


    // Full cubans
    "7.8.2.2 NOU ; NR:1 ; NR:2",
    "7.8.3.1 NOU ; MAX360:1 ; NR:1 ; NR:3",

    "7.8.4.1 NOU ; NR:1",

    "7.8.8.1 NOU ; NR:3",


    // Humpty bumps
    "8.4.1.1 NOU",
    "8.4.2.1 NOU ; NR:2",
    "8.4.2.2 NOU ; NR:1",
    "8.4.3.1 NOU",
    "8.4.4.2 NR",

    // Half cubans
    "8.5.1.1 NR",
    "8.5.1.2 NR",

    "8.5.1.4 NR",
    "8.5.2.1 NOU ; MAX360; NR:2",
    "8.5.2.2 NOU ; MAX360; NR:2",
    "8.5.2.3 NOU ; NR:2",
    "8.5.2.4 NOU ; NR:2",
    "8.5.3.1 NR",
    "8.5.3.3 NOU; NR:1",
    "8.5.4.1 NOU ; MAX360; NF:2",
    "8.5.4.4 NOU ; MAX360",
    "8.5.5.1 NR",
    "8.5.5.2 NR",

    "8.5.6.1 NOU ; NR:1",
    "8.5.7.1 NOU ; MAX360; NR:2",
    "8.5.7.2 NOU ; MAX360; NR:2",

    "8.5.8.2 NOU ; MAX360",


    // Keyhole loops
    //"8.5.9.1 NR1 ; NR2",
    //"8.5.17.1 NR1 ; NR2",

    // P loops
    "8.6.1.1 NOU ; NR:2; NF:3",
    "8.6.2.1 NOU; NR:2; MAX360; NF:3",
    "8.6.3.1 NR",

    "8.6.6.2 NR",


    // Porpoises
    //"8.6.11.1 NOU ; NR1 ; NR2 ; NEQR3 ; NF3",
    //"8.6.11.3 NOU ; OHS ; NR2 ; NEQR3 ; NF3",

    // Q loops
    //"8.7.1.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
    //"8.7.3.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
    //"8.7.5.1 NOU ; NF1 ; NEQR1 ; NHR2 ; NR3",
    //"8.7.7.2 NOU ; NER1 ; NR2 ; NR3",

    // Rolls

    "9.1.1.1",
    "9.1.2.1",
    "9.1.2.2",
    "9.1.2.3",
    "9.1.2.4",
    "9.1.3.2",
    "9.1.3.4",
    "9.1.3.6",
    "9.1.4.2",
    "9.1.5.1",

    "9.2.3.4",
    "9.2.3.6",

    "9.4.2.2",
    "9.4.3.2",
    "9.4.3.4",
    "9.4.3.6",
    "9.4.4.2",
    "9.8.1.1",

    "9.8.2.2",
    "9.8.3.2",
    "9.8.3.4",
    "9.8.5.1",

    // Snaps
    "9.9.3.2",
    "9.9.3.4",


    // Spins

    "9.11.1.4",
    "9.11.1.5",
    "9.11.1.6",
    "9.12.1.4",
    "9.12.1.5",
    "9.12.1.6",

    //###############################################################################
    //##### AeCI INTERMEDIATE UNKNOWN 2 ##################################################
    //###############################################################################

    "[AeCI Intermediate Unknown2]",
    "basefig-max=10",
    "basefig-min=8",
    "posnl=30",

    //definizione delle famiglie minime per la composizione dei programmi
    "fam5-min=1",
    "fam7-min=1", //7.2 half loops 7.3 three quarter loops 7.4 whoole loops 7.5 horizontal and vertical S 7.8 horizontal+vertical 8 
    "spin-max=1", //family 9.11 and 9.12 spin

    "figure-letters=ABCDE",
    "additionals=4/24",

    // ripetizioni 

    "basefig-repeat=1", // nessuna ripetizione di figura base è permessa
    "fam9-repeat=1", // nessuna ripetizione di airelon roll è permessa

    // LIMITAZIONI e REGOLE

    // NHR  = no hesitation roll (comando costruito FAD)
    // N88  = 8 point roll is not allowed (comando costruito FAD)
    // NEQR = no eigth point or quarter hesitation roll
    // NER  = no eigths hesitation roll
    // NF   = no flick allowed (Comando Open aero)
    // NOU  = no opposite or unlinked rolls (Comando Open aero)
    // NR = no roll on segment (Comando Open aero)
    // MAX360= max 360 rotation allowed (Comando Open aero)
    // OS   = only SPIN (Comando Open aero)

    "rule-N88  = roll: [8]",
    "why-N88   = 8 point roll not allowed",



    //CHEKING VALIDITY

    // Lines
    "1.1.1.1 NF ; NOU",
    "1.1.1.2 NF ; NOU",
    "1.1.1.3 NF ; NOU",
    "1.1.1.4 NF ; NOU",


    "1.1.2.1 NOU",
    "1.1.2.2 NOU",
    "1.1.2.3 NOU",
    "1.1.2.4 NOU",
    "1.1.3.1 NOU",
    "1.1.3.2 NOU",
    "1.1.3.3 NOU",
    "1.1.3.4 NOU",

    "1.1.6.1 NOU",
    "1.1.6.3 NOU",
    "1.1.7.1 NOU",
    "1.1.7.4 NOU",

    // Sharks tooth
    "1.2.1.1 NR:1; NR:2",

    "1.2.3.1 NOU; NR:2",

    "1.2.5.1 NOU; NR:2",

    "1.2.6.1 NOU ; NR:2",

    "1.2.7.1 NOU",

    "1.2.8.1 NOU",


    // Bow
    //"1.3.2.1 NOU",

    // Turns & rolling circles
    "2.1.1.1",
    "2.1.1.2",
    "2.1.3.1",
    "2.1.3.2",
    "2.1.3.3",
    "2.1.3.4",
    "2.2.1.1",
    "2.2.1.2",
    "2.2.5.1",
    "2.2.5.2",
    "2.2.5.3",
    "2.2.5.4",
    "2.2.6.1",
    "2.2.6.2",
    "2.3.1.1",
    "2.3.1.2",
    "2.3.4.1",
    "2.3.4.2",
    "2.4.1.1",
    "2.4.1.2",
    "2.4.7.1",


    // -idz+
    //"3.3.1.4 NOU",

    // Hammerheads
    "5.2.1.1 NOU",
    "5.2.1.3 NOU; NR:2",
    "5.2.1.4 NOU; NR:1",


    // Half loops
    "7.2.1.1 NOU ; NF:1; NF:2",
    "7.2.1.2 NR:1 ; NR:2",

    "7.2.2.1 NOU ; NF:1 ; MAX360 ; N88:1 ",

    "7.2.3.1 NOU ; NF:1 ; MAX360 ; NR:2",
    "7.2.3.2 NOU ; NF:1 ; MAX360 ; NR:2",

    "7.2.4.2 NOU ; MAX360 ; NF:1 ; NF:2",


    // Goldfish
    //"7.3.1.2 NOU ; NR1",
    "7.3.1.3 NR",
    "7.3.2.1 NR:2 ; MAX360",
    "7.3.2.4 NR:2 ; MAX360",
    "7.3.3.3 NOU",
    "7.3.4.1 MAX360",
    "7.3.4.4 NOU",

    // Loops
    "7.4.1.1 NOU; N88",
    "7.4.1.2 NR",


    // Reversing loops
    //"7.3.7.1 NOU ; NHR1",
    //"7.4.8.1 NOU ; NR1 ; NHR2",
    //"7.4.9.3 NOU ; NF1 ; NHR1",
    //"7.4.12.3 NOU ; NHR2",

    // Horizontal S-es
    //"7.5.2.1 NOU ; NEQR1 ; NF1 ; NHR2 ; NR3",
    //"7.5.2.4 NOU ; NR1 ; NHR2 ; NEQR3 ; NF3",
    //"7.5.5.3 NOU ; NF1 ; NHR2 ; NR3",
    //"7.5.7.1 NOU ; NR1 ; NHR2 ; NF3",

    // Horizontal 8
    "7.8.1.1 NR",


    // Full cubans
    "7.8.2.2 NOU ; NR:1 ; NR:2",
    "7.8.3.1 NOU ; MAX360:1 ; NR:1 ; NR:3",

    "7.8.4.1 NOU ; NR:1",

    "7.8.8.1 NOU ; NR:3",


    // Humpty bumps
    "8.4.1.1 NOU",
    "8.4.2.1 NOU ; NR:2",
    "8.4.2.2 NOU ; NR:1",
    "8.4.3.1 NOU",
    "8.4.4.2 NR",

    // Half cubans
    "8.5.1.1 NR",
    "8.5.1.2 NR",

    "8.5.1.4 NR",
    "8.5.2.1 NOU ; MAX360; NR:2",
    "8.5.2.2 NOU ; MAX360; NR:2",
    "8.5.2.3 NOU ; NR:2",
    "8.5.2.4 NOU ; NR:2",
    "8.5.3.1 NR",
    "8.5.3.3 NOU; NR:1",
    "8.5.4.1 NOU ; MAX360; NF:2",
    "8.5.4.4 NOU ; MAX360",
    "8.5.5.1 NR",
    "8.5.5.2 NR",

    "8.5.6.1 NOU ; NR:1",
    "8.5.7.1 NOU ; MAX360; NR:2",
    "8.5.7.2 NOU ; MAX360; NR:2",

    "8.5.8.2 NOU ; MAX360",


    // Keyhole loops
    //"8.5.9.1 NR1 ; NR2",
    //"8.5.17.1 NR1 ; NR2",

    // P loops
    "8.6.1.1 NOU ; NR:2; NF:3",
    "8.6.2.1 NOU; NR:2; MAX360; NF:3",
    "8.6.3.1 NR",

    "8.6.6.2 NR",


    // Porpoises
    //"8.6.11.1 NOU ; NR1 ; NR2 ; NEQR3 ; NF3",
    //"8.6.11.3 NOU ; OHS ; NR2 ; NEQR3 ; NF3",

    // Q loops
    //"8.7.1.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
    //"8.7.3.1 NOU ; NR1 ; NR2 ; NER3 ; NF3",
    //"8.7.5.1 NOU ; NF1 ; NEQR1 ; NHR2 ; NR3",
    //"8.7.7.2 NOU ; NER1 ; NR2 ; NR3",

    // Rolls

    "9.1.1.1",
    "9.1.2.1",
    "9.1.2.2",
    "9.1.2.3",
    "9.1.2.4",
    "9.1.3.2",
    "9.1.3.4",
    "9.1.3.6",
    "9.1.4.2",
    "9.1.5.1",

    "9.2.3.4",
    "9.2.3.6",

    "9.4.2.2",
    "9.4.3.2",
    "9.4.3.4",
    "9.4.3.6",
    "9.4.4.2",
    "9.8.1.1",

    "9.8.2.2",
    "9.8.3.2",
    "9.8.3.4",
    "9.8.5.1",

    // Snaps
    "9.9.3.2",
    "9.9.3.4",


    // Spins

    "9.11.1.4",
    "9.11.1.5",
    "9.11.1.6",
    "9.12.1.4",
    "9.12.1.5",
    "9.12.1.6",

    //###############################################################################
    //##### AeCI SPORTSMAN UNKNOWN 1,2 ##################################################
    //###############################################################################

    "[AeCI Sportsman Unknown1]",
    "more=AeCI Sportsman Unknown2",
    "[AeCI Sportsman Unknown2]",
    "AeCI Sportsman Unknown2",
    "basefig-max=8",
    "basefig-min=8",
    "posnl=20",

    //definizione delle famiglie minime per la composizione dei programmi

    // ripetizioni 

    "basefig-repeat=1", // nessuna ripetizione di figura base è permessa
    "fam9-repeat=1", // nessuna ripetizione di airelon roll è permessa

    // LIMITAZIONI e REGOLE

    // NHR  = no hesitation roll (comando costruito FAD)
    // N88  = 8 point roll is not allowed (comando costruito FAD)
    // NEQR = no eigth point or quarter hesitation roll
    // NER  = no eigths hesitation roll
    // NF   = no flick allowed (Comando Open aero)
    // NOU  = no opposite or unlinked rolls (Comando Open aero)
    // NR = no roll on segment (Comando Open aero)
    // MAX360= max 360 rotation allowed (Comando Open aero)
    // OS   = only SPIN (Comando Open aero)

    "rule-N88  = roll: [8]",
    "why-N88   = 8 point roll not allowed",

    //CHEKING VALIDITY

    // Lines
    "1.1.1.1 NF; NOU",
    "1.1.1.2 NF; NOU",
    "1.1.1.3 NF; NOU",
    "1.1.1.4 NF; NOU",

    "1.1.2.1 NOU",

    "1.1.2.3 NOU",

    "1.1.3.1 NOU",


    "1.1.3.4 NOU",
    "1.1.6.1 NOU",
    "1.1.6.3 NOU",

    // Sharks tooth

    "1.2.7.1 NOU",


    // Turns & rolling circles
    "2.1.1.1",
    "2.1.1.2",

    "2.2.1.1",
    "2.2.1.2",

    "2.3.1.1",
    "2.3.1.2",

    "2.4.1.1",



    // -idz+
    //"3.3.1.4 NOU",

    // Hammerheads
    "5.2.1.1 NOU",


    // Half loops
    "7.2.1.1 NR",
    "7.2.2.1 NR:1; MAX360",

    // Goldfish
    "7.3.2.1 NR:2",

    // Loops
    "7.4.1.1 NR",

    //Full cubans
    "7.8.4.1 NOU ; NR:1",
    "7.8.8.1 NOU ; NR:3",

    // Humpty bumps
    "8.4.1.1 NOU",

    // Half cubans
    "8.5.2.1 NOU; NR:2",
    "8.5.6.1 NOU; NR:1",

    // P loops
    "8.6.1.1 NR",

    // Rolls

    //"9.1.1.1",
    //"9.1.2.1",
    "9.1.2.2",
    //"9.1.2.3",
    //"9.1.2.4",
    "9.1.3.2",
    "9.1.3.4",
    //"9.1.3.6",
    "9.1.4.2",
    "9.1.5.1",

    "9.2.3.4",
    //"9.2.3.6",

    "9.4.2.2",
    "9.4.3.2",
    "9.4.3.4",
    //"9.4.3.6",
    "9.4.4.2",
    //"9.8.1.1",

    //"9.8.2.2",
    //"9.8.3.2",
    //"9.8.3.4",
    //"9.8.5.1",

    // Snaps
    //"9.9.3.2",
    //"9.9.3.4",


    // Spins

    "9.11.1.4",
    //"9.11.1.5",
    "9.11.1.6"
    //"9.12.1.4",
    //"9.12.1.5",
    //"9.12.1.6",
);