// OpenAero rules23-imac.js file

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

// This file defines IMAC rules for 2023 for Unknown programs 
// 
//  Rules come from the 2018 Aresti Catalogs approved by IMAC.  Changes, comments, or errors should be
//  submitted to bdavy92960@msn.com for correction
//


rules.push (

	//#############################################################################
	//##### IMAC Basic Known ######################################################
	//#############################################################################
	"[IMAC Basic Known]",
	
	/*"Basic" Maneuvers
	(Little negative G time) - Loop, Immelman, Split S, Half Cuban Eight, Hammerhead, etc.
	1/2 rolls allowed on 45 and vertical lines only. 1 full roll only from upright horizontal.*/
	"rule-MAX180= qtrs:<3",
	"allow-defrules = MAX180; NOU",
	
	//Family 1.1 Single Lines - need a rule to limit roll elements to 360 degrees, excluding spins (NOU)
	//
	"1.1.1.1 ^MAX180",
	"1.1.2.1",
	"1.1.2.3",
	"1.1.3.4",
	"1.1.6.1",
	"1.1.6.3",
	"1.1.11.1",
	
	//Family 1.2 Two Lines
	"1.2.3.1",
	
	"1.2.6.3",
	"1.2.7.1",
	
	//Family 1.3 Three Lines
	"1.3.5.1",
	
	//Family 2.1-2.4 Turns//
	"2.1.1.1-2",
	"2.2.1.1-2",
	"2.3.1.1-2",
	"2.4.1.1-2",
	
	//Family 3 combinations of lines
	
	//Family 5 Stall Turns
	"5.2.1.1",
	
	
	//Family 6 Tail Slides (not allowed in Basic-Advanced)
	
	//Family 7 Loops and Eights   
	"7.2.2.1",
	
	"7.4.1.1 NR",
	 
	
	//Family 8 Combinations of lines, angles, and loops
	//8.4 Humpty Bumps
	
	"8.4.1.1",
	
	//8.5 Diagonal Humpty Bumps
	"8.4.14.1",
	"8.4.15.1",
	
	
	//8.5 Half Cubans
	"8.5.2.1",
	"8.5.6.1",
	
	//8.5 Vertical 5/8ths Loops
	"8.5.9.1",
	"8.5.17.1",
	
	//8.6 P loops
	
	//8.6 Reversing P Loops
	
	//8.7 Q Loops
	
	//8.8 Double Humpty Bumps 
	
	//8.10 Reversing 1-1/4 Loops 
	//9.1 Rolls
	"9.1.1.2",
	"9.1.2.2",
	"9.1.3.2",
	"9.1.3.4",
	"9.1.4.2",
	"9.1.5.2",
	
	//9.2 2-point Aileron Rolls 
	
	//9.4 4-point rolls 
	
	//9.8 8 point rolls 
	
	//9.9 Positive Flick Rolls 
	
	//9.10 Negative Flick Rolls 
	
	//9.11 Positive Spins
	"9.11.1.4",
	"9.11.1.6",
	"9.11.1.8",
	
	
	//9.12  Negative Spins 
	
	//#####################################################################################
	//#################   IMAC Sportsman Known   ##########################################
	//#####################################################################################
	"[IMAC Sportsman Known]",
	"9.9.2.4",
	"more=IMAC Sportsman Unknown",
	
	//#####################################################################################
	//#################   IMAC Intermediate Known   ##########################################
	//#####################################################################################
	"[IMAC Intermediate Known]",
	"7.5.1.4 noposflick:3",
	"7.5.3.3 noposflick:3",
	"7.5.4.4",
	"9.1.2.1",
	"9.1.4.1",
	"9.8.2.1",
	"9.8.4.1",
	
	"more=IMAC Intermediate Unknown",
	
	//#####################################################################################
	//#################   IMAC Advanced Known   ##########################################
	//#####################################################################################
	"[IMAC Advanced Known]",
	"more=IMAC Advanced Unknown",
	
	
	//#####################################################################################
	//#################   IMAC Unlimited Known   ##########################################
	//#####################################################################################
	"[IMAC Unlimited Known]",
	"more=IMAC Unlimited Unknown",
	
	//#####################################################################################
	//#################   IMAC Intermediate Alt-Known   ##########################################
	//#####################################################################################
	"[IMAC Intermediate Alt-Known]",
	"7.5.1.4 noposflick:3",
	"7.5.3.3 noposflick:3",
	"7.5.4.4",
	"9.1.2.1",
	"9.1.4.1",
	"9.8.2.1",
	"9.8.4.1",
	
	"more=IMAC Intermediate Alt-Unknown",
	
	
	//#####################################################################################
	//#################   IMAC Advanced Alt-Known   ##########################################
	//#####################################################################################
	"[IMAC Advanced Alt-Known]",
	"more=IMAC Advanced Alt-Unknown",
	
	//#####################################################################################
	//#################   IMAC Unlimited Alt-Known   ##########################################
	//#####################################################################################
	"[IMAC Unlimited Alt-Known]",
	"more=IMAC Unlimited Alt-Unknown",
	
	//###############################################################################
	//##### IMAC Sportsman Unknown ###############################################
	//###############################################################################
	/*Construction rules
	No combination roll elements
	One full roll max allowed on any line (NOU) for all sportsman class figures
	one full roll or one half roll are permitted on horizontal and all 45 degree lines (implemented by Family 9 allowed elements)
	One quarter, one half, three quarters, and full roll may be used on vertical up or down lines (implemented by Family 9 allowed elements)
	Any positive spin from upright.(implemented by Family 9 allowed elements)
	*/
	
	"[IMAC Sportsman Unknown]",
	"allow-defrules=NOU",
	"rule-MAX180=qtrs:<3",
	"why-MAX180=maximum of 180 degrees rotation allowed",
	"rule-NOPOINT=roll:[248]",
	"why-NOPOINT=no point roll allowed",
	
	
	//Family 1.1 Single Lines - need a rule to limit roll elements to 360 degrees, excluding spins (NOU)
	//
	"1.1.1.1-4",
	"1.1.2.1-3",
	"1.1.3.1",
	"1.1.3.2",
	"1.1.3.4",
	"1.1.4.1-2",
	"1.1.5.1-2",
	"1.1.6.1",
	"1.1.6.3",
	"1.1.7.1",
	"1.1.7.4",
	"1.1.10.1",
	"1.1.10.4",
	"1.1.11.1",
	"1.1.11.3",
	
	//Family 1.2 Two Lines
	"1.2.1.1",
	"1.2.1.3",
	"1.2.2.2",
	"1.2.2.3",
	"1.2.3.1",
	"1.2.5.4",
	"1.2.6.1",
	"1.2.6.3",
	"1.2.7.1",
	"1.2.7.4",
	"1.2.8.3",
	"1.2.9.1",
	"1.2.12.1",
	"1.2.13.4",
	"1.2.14.3",
	"1.2.15.4",
	"1.2.16.3",
	
	//Family 1.3 Three Lines
	"1.3.2.1",
	"1.3.3.2-3",
	"1.3.4.1",
	"1.3.4.4",
	"1.3.5.1",
	"1.3.5.3",
	"1.3.6.4",
	"1.3.7.1",
	"1.3.8.2",
	"1.3.10.4",
	"1.3.11.1",
	"1.3.11.4",
	"1.3.12.1",
	"1.3.13.1",
	"1.3.13.3",
	"1.3.14.1",
	"1.3.16.3",
	
	//Family 2.1-2.4 Turns//
	"2.1.1.1-2",
	"2.2.1.1-2",
	"2.3.1.1-2",
	"2.4.1.1-2",
	
	//Family 3 combinations of lines
	"3.3.1.1",
	"3.3.1.2",
	"3.3.1.4",
	"3.4.1.1",
	"3.4.1.2",
	"3.4.1.4",
	"3.4.2.1",
	"3.4.2.2",
	
	//Family 5 Stall Turns
	"5.2.1.1",
	"5.3.1.1 MAX180; NOPOINT",
	"5.3.2.4 MAX180; NOPOINT; NR:2",
	
	/*Need to add rules for Family Five with 45 degree entry or exit : Family 5.3.x.x-5.4.x.x
	A single roll element of 180 degrees or less may be used on only one of the two ascending lines and only one of the two descending lines
	point rolls and snap rolls may not be used.  
	Implementation:  5.3.1.1 max rotation of 180 prevents roll on first vertical leg.  5.3.2.4 NR:2 Prevents additional roll on vertical upline since 180 degree required on 45 entry.
	
	These secial roll limitations only apply to 3 an 4 line Family 5 figures.
	*/
	
	//Family 6 Tail Slides (not allowed in Sportsman-Advanced)
	
	//Family 7 Loops and Eights /*1 positive flick may be used at the top of  1/2 or full inside loops, and 9.9.8.4 may ONLY be used at the top of a 1/2 outside loop  
	"7.2.1.1 NF:2",
	"7.2.1.2 NF:1",
	"7.2.1.4 NF:1",
	"7.2.2.1",
	"7.2.2.2 NF",
	"7.2.3.1",
	"7.2.3.2 NF:2",
	"7.2.3.3",
	"7.2.4.1-2",
	"7.3.2.1",
	"7.3.3.3",
	"7.3.4.1",
	"7.3.4.4",
	"7.4.1.1 NOPOINT",
	"7.4.2.2 NOPOINT",
	"7.4.3.1 NOPOINT; NF",
	"7.4.5.1 NOPOINT; NF",
	"7.4.6.1 NF",
	/*IMAC 2018 Catalog Figures 7.4.9.3 to 7.4.12.3: Roll elements not
	permitted in the 3/4 loop portion of the figure.*/
	"7.4.9.3 NR:2", 
	"7.4.10.3 NR:2",
	"7.4.11.2 NOPOINT:2; NF:1",
	"7.4.11.3 NR:2",
	"7.4.12.3 NR:2",
	"7.4.13.1 NOPOINT:2",
	"7.5.2.1",
	"7.5.2.4 NF:1",
	"7.5.5.2-3",
	"7.5.7.1",
	"7.5.7.4 NF:1",
	"7.5.8.2-3",
	"7.5.10.1 MAX180; NOPOINT", /*2018 IMAC Catalog only 1/2 roll permitted*/
	"7.8.3.4 NF:1",
	"7.8.4.1",
	"7.8.4.4 NF:1",
	"7.8.6.2-3",
	"7.8.8.1",
	"7.8.8.4",
	"7.8.11.2",
	"7.8.13.1",
	"7.8.15.2-3",
	"7.8.16.1",
	"7.8.16.4",
	
	//Family 8 Combinations of lines, angles, and loops
	//8.4 Humpty Bumps
	/*Roll elements on all lines may not exceed 360 degrees*/
	"8.4.1.1",
	"8.4.1.4",
	"8.4.2.2",
	"8.4.2.4",
	"8.4.3.1",
	"8.4.3.3",
	"8.4.4.3",
	
	//8.5 Diagonal Humpty Bumps
	"8.4.14.1",
	"8.4.15.1",
	"8.4.15.4",
	"8.4.16.4",
	"8.4.17.3",
	"8.4.18.1",
	"8.4.18.3",
	"8.4.19.1",
	"8.4.20.2",
	
	//8.5 Half Cubans
	"8.5.1.2-3",
	"8.5.2.1",
	"8.5.2.4",
	"8.5.3.2-3",
	"8.5.4.1",
	"8.5.4.4",
	"8.5.5.2 NF:1",
	"8.5.5.4 NF:1",
	"8.5.6.1",
	"8.5.6.4 NF:1",
	"8.5.7.1",
	"8.5.7.3",
	"8.5.8.2-3",
	
	//8.5 Vertical 5/8ths Loops
	"8.5.9.1",
	"8.5.12.2",
	"8.5.17.1",
	"8.5.20.1",
	
	//8.6 P loops
	"8.6.1.1 NOPOINT:2",
	"8.6.2.1 NOPOINT:2",
	"8.6.5.1 NOPOINT:2",
	"8.6.7.2 NOPOINT:2",
	"8.6.17.2 NOPOINT:2",
	"8.6.19.1 NOPOINT:2",
	"8.6.20.1 NOPOINT:2",
	"8.6.21.2 NOPOINT:2; NF:1",
	"8.6.22.1 NOPOINT:2",
	"8.6.23.1 NOPOINT:2",
	"8.6.24.2 NOPOINT:2",
	
	//8.6 Reversing P Loops
	"8.6.11.1 NOPOINT:2; NF:2",
	"8.6.12.1 NOPOINT:2; NF:2",
	
	//8.7 Q Loops
	"8.7.1.1 NOPOINT:2",
	"8.7.2.2 NOPOINT:2",
	"8.7.3.1 NOPOINT:2",
	"8.7.4.2 NOPOINT:2",
	"8.7.5.1 NOPOINT:2",
	"8.7.7.2 NOPOINT:2",
	
	//8.8 Double Humpty Bumps (not allowed in Sportsman)
	
	//8.10 Reversing 1-1/4 Loops (not allowed in Sportsman)
	
	//9.1 Rolls
	"9.1.1.1-4",
	"9.1.2.2",
	"9.1.2.4",
	"9.1.3.2",
	"9.1.3.4",
	"9.1.4.2",
	"9.1.4.4",
	"9.1.5.1-4",
	
	//9.2 2-point Aileron Rolls (not permitted in looping maneuvers for sportsman)
	"9.2.1.4",
	"9.2.2.4",
	"9.2.3.4",
	"9.2.4.4",
	
	
	//9.4 4-point rolls (point rolls not allowed in looping maneuvers)
	"9.4.1.2",
	"9.4.2.2",
	"9.4.3.2",
	"9.4.4.2",
	"9.4.5.2",
	
	
	//9.8 8 point rolls (point rolls not permitted in looping maneuvers for sportsman)
	"9.8.1.1",
	"9.8.5.1",
	
	//9.9 Positive Flick Rolls (9.9.3.4 may be used at the top of 1/2 or full inside loops in sportsman)
	
	"9.9.3.4",
	"9.9.8.4", /*9.9.8.4 may ONLY be used at the top of a 1/2 outside loop*/
	
	//9.10 Negative Flick Rolls (not permitted in Sportsman)
	
	//9.11 Positive Spins
	"9.11.1.4",
	"9.11.1.5",
	"9.11.1.6",
	"9.11.1.7",
	"9.11.1.8",
	
	
	//9.12  Negative Spins (not permitted in Sportsman)
	
	
	
	//###############################################################################
	//##### IMAC Intermediate Alt-Unknown ###############################################
	//###############################################################################
	/*Construction rules
	No 135 degree exit from 45 degree down line that ends with horizontal flight path - controlled by figure allowed.
	
	Combination rolls or sigle roll elements on all lines cannot be in excess of 540 degrees, excluding spins. (allow-defrules=MAX540 covers this criteria for all familys)
	Single roll (360 degrees) max within looping maneuvers. ( MAX360; NOU)
	Total Roll limitation or combination roll elements means the total sum of all rolls on that line, linked, unlinked and combination.
	*/
	
	"[IMAC Intermediate Alt-Unknown]",
	"conv-qtrs=^9\\.([1-9]|10)\\.([123456789]|10)\\.([1-8]) = $3; ^9\\.1[12]\\.1\\.([456]) = $1; ^9\\.1[12]\\.1\\.([78]) = 6",
	"rule-MAX540=qtrs:<7",
	"why-MAX540=maximum of 540 degrees rotation allowed, except spins",
	"rule-MAX360=qtrs:<5",
	"why-MAX360=maximum of 360 degrees rotation allowed",
	"rule-NOPOINT=roll:[248]",
	"why-NOPOINT=no point roll allowed",
	"rule-MAX180=qtrs:<3",
	"why-MAX180 = maximum roll is 180 degrees",
	
	"conv-ptsct=^9.2.[1-5].4 = 2; ^9.2.[1-5].6 = 3; ^9.2.[1-5].8= 4; ^9.4.([1-5]).([2-8]) = $2; ^9.8.[1-5].1=2 ; ^9.8.[1-5].2=4; ^9.8.[1-5].3=6; ^9.8.[1-5].4=8; ^9.[1|9|10] = z",
	"rule-maxpts2 = ptsct:<3",
	"why-maxpts2 = No more than 2 points allowed on Family 5.3 for Intermediate",
	
	"conv-ptsqtr=^9\\.([248])\\.[1-5]\\.([1-8]) = $2; ^9.([1|9|10])=z",
	"rule-maxptsqtr2= ptsqtr:<3",
	"why-maxptsqtr2= maximum of 180 degrees of point role on family 5.3 in Intermediate",  
	
	//Combination rolls or sigle roll elements on all lines cannot be in excess of 540 degrees, excluding spins.
	"allow-defrules=MAX540",
	
	
	"conv-climbqtrs=^9\\.([1-9]|10)\\.[1267]\\.([1-8]) = $2; ^9.([1-9]|10).([459]|10)\\.[1-8] = z; ^9\\.([1-9]|10)\\.3\\.([1-8]) = 0",
	"rule-climbmax540 = climbqtrs:+<7",
	"why-climbmax540 = maximum of 540 degrees total rotation on all up lines vertical and diagonal for Family 5.3",
	
//	"conv-downqtrs=^9.([1-9]|10).[123678].([1-8]) = z ; ^9\\.([1-9]|10)\\.[459|10]\\.([1-8]) = $2",
	"conv-downqtrs=^9\\.([1-9]|10)\\.([459]|10)\\.([1-8]) = $3; ^9\\.([1-9]|10)\\.[123678]\\.([1-8]) = z ",

	"rule-downmax360 = downqtrs:+<5",
	"why-downmax360 = maximum of 360 degrees rotation total on all down lines vertical and diagonal for Family 5.2 and 5.3", 
	
	"conv-posflick=^9\\.9\\.8\\.4 = 1; ^9\\.= 0",
	"rule-noposflick = posflick:<1",
	"why-noposflick = 9.9.8.4 may only be used at the top of a 1/2 or full outside loop.",
	
	//Family 1.1 Single Lines - need a rule to limit roll elements to 540 degrees, excluding spins
	//
	"1.1.1.1-4",
	"1.1.2.1-4",
	"1.1.3.1-4",
	"1.1.4.1-2",
	"1.1.5.1-2",
	"1.1.6.1-4",
	"1.1.7.1-4",
	"1.1.8.1-2",
	"1.1.9.1",
	"1.1.10.1-2",
	"1.1.10.4",
	"1.1.11.1-3",
	
	//Family 1.2 Two Lines
	"1.2.1.1-3",
	"1.2.2.1-3",
	"1.2.3.1",
	"1.2.3.2",
	"1.2.3.4",
	"1.2.5.1",
	"1.2.5.2",
	"1.2.5.4",
	"1.2.6.1-3",
	"1.2.7.1",
	"1.2.7.2",
	"1.2.7.4",
	"1.2.8.1-3",
	"1.2.9.1-2",
	"1.2.10.1-2",
	"1.2.11.1-2",
	"1.2.12.1-2",
	
	"1.2.13.4",
	"1.2.14.3",
	"1.2.15.4",
	"1.2.16.3",
	
	//Family 1.3 Three Lines
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
	"1.3.9.2",
	"1.3.9.4",
	"1.3.10.2",
	"1.3.10.4",
	"1.3.11.1",
	"1.3.11.4",
	"1.3.12.1",
	"1.3.12.4",
	"1.3.13.1",
	"1.3.13.3",
	"1.3.14.1",
	"1.3.14.3",
	"1.3.15.2",
	"1.3.15.3",
	"1.3.16.2",
	"1.3.16.3",
	
	//Family 2.1-2.4 Turns
	"2.1.1.1",
	"2.1.1.2",
	"2.2.1.1",
	"2.2.1.2",
	"2.3.1.1",
	"2.3.1.2",
	"2.4.1.1",
	"2.4.1.2",
	
	
	//Family 3 combinations of lines
	"3.3.1.1-4",
	"3.4.1.1-2",
	"3.4.1.4",
	"3.4.2.1-3",
	"3.8.1.2-3",
	
	//Family 5 Stall Turns
	"5.2.1.1-4 MAX540:1; MAX360:2",
	"5.3.1.1-4 NOPOINT:1; climbmax540; downmax360; maxpts2; maxptsqtr2",
	"5.3.2.1-4 NOPOINT:1; climbmax540; downmax360; maxpts2; maxptsqtr2",
	"5.3.3.1 NOPOINT:3; climbmax540; downmax360; maxpts2; maxptsqtr2",
	"5.3.3.4 NOPOINT:3; climbmax540; downmax360; maxpts2; maxptsqtr2",
	"5.3.4.1 NOPOINT:3; climbmax540; downmax360; maxpts2; maxptsqtr2",
	"5.3.4.4 NOPOINT:3; climbmax540; downmax360; maxpts2; maxptsqtr2",
	
	
	/*
	Need to add rules for Family 5 with vertical entry and exit lines.  Family 5.2.x.x
	Combination or total roll elements on a vertical up-line may not exceed 540 degrees (1-1/2 rolls.
	Combination or total roll elements on a vertical downline may not exceed 360 degrees (1 roll)
	
	Family 5 with 45 degree entry or exit special rules: Family 5.3.x.x-5.4.x.x
	1. Combination, or total roll elements, on all up-lines (both 450 and vertical) may not exceed 540 º of rotation (1 ½ rolls).
	2. Combination, or total roll elements, on all down-lines (both 450 and vertical) may not exceed 360º of rotation (1 roll).
	3. Point rolls, if used, may not exceed 180 degrees, must be two points or less; may only be use on the vertical up-line or vertical downline.
	4. Total roll limitation, or combination roll elements, means the sum of all roll elements on the both 450 and vertical: Linked, unlinked, and combination.
	Note: These special roll limitations only apply to 3 and 4 line Family 5 figures.
	
	Family 9
	9.9.3.4 can also be used at the top of 1/2 or full inside loop
	9.10.3.4 can also be used t the top of 1/2 or full outside loop
	
	*/
	
	//Family 6 Tail Slides not allowed in Sportsman-Advanced
	
	//Family 7 Loops and Eights
	"7.2.1.1",
	"7.2.1.2 noposflick:1",
	"7.2.1.3 noposflick:2",
	"7.2.1.4",
	"7.2.2.1",
	"7.2.2.2",
	"7.2.2.3 noposflick:2",
	"7.2.2.4",
	"7.2.3.1",
	"7.2.3.2",
	"7.2.3.3",
	"7.2.3.4 noposflick:2",
	"7.2.4.1-4",
	"7.3.1.1-4",
	"7.3.2.1-4",
	"7.3.3.1-4",
	"7.3.4.1-4",
	"7.4.1.1-2 MAX360; NOU",
	"7.4.2.1-2  MAX360; NOU",
	"7.4.3.1-2",
	"7.4.4.1-2",
	"7.4.5.1-2",
	"7.4.6.1",
	"7.4.7.1 MAX360:2; NOU:2; noposflick:3",
	"7.4.7.2 MAX360:2; NOU:2; noposflick:1",
	"7.4.8.1 MAX360:2; NOU:2",
	"7.4.8.2 MAX360:2; NOU:2; noposflick:1 ",
	"7.4.9.1 MAX360:2; NOU:2",
	"7.4.9.2 MAX360:2; NOU:2; noposflick:3",
	"7.4.9.3 MAX360:2; NOU:2",
	"7.4.10.1 MAX360:2; NOU:2",
	"7.4.10.2 MAX360:2; NOU:2; noposflick:3 ",
	"7.4.10.3 MAX360:2; NOU:2",
	"7.4.11.1 MAX360:2; NOU:2; noposflick:3",
	"7.4.11.2 MAX360:2; NOU:2; noposflick:1",
	"7.4.11.3 MAX360:2; NOU:2",
	"7.4.12.1 MAX360:2; NOU:2",
	"7.4.12.2 MAX360:2; NOU:2; noposflick:1",
	"7.4.12.3 MAX360:2; NOU:2",
	"7.4.13.1 MAX360:2; NOU:2",
	"7.4.13.2 MAX360:2; NOU:2; noposflick:1; noposflick:3",
	
	"7.4.14.1-2 MAX360:2; NOU:2; noposflick:1; noposflick:3",
	
	//Horizontal S
	"7.5.1.1",
	"7.5.1.2 noposflick:1",
	"7.5.1.3",
	"7.5.2.1 noposflick:1",
	"7.5.2.2",
	"7.5.2.4",
	"7.5.3.1",
	"7.5.3.2",
	"7.5.3.4",
	"7.5.4.1",
	"7.5.4.2 noposflick:1",
	"7.5.4.3",
	
	"7.5.5.1-3",
	"7.5.6.1-4",
	"7.5.7.1",
	"7.5.7.2 noposflick:1",
	"7.5.7.4",
	"7.5.8.1-3",
	
	//Vertical S
	"7.5.9.1-2",
	"7.5.10.1-2",
	
	//Horizontal 8
	"7.8.1.1",
	"7.8.1.2 noposflick:1",
	"7.8.1.3-4",
	"7.8.2.1-4",
	"7.8.3.1",
	"7.8.3.2 noposflick:1",
	"7.8.3.4",
	"7.8.4.1",
	"7.8.4.2 noposflick:1",
	
	"7.8.4.4",
	"7.8.5.1",
	"7.8.5.3-4",
	"7.8.6.2-3",
	"7.8.7.2-4",
	"7.8.8.1",
	"7.8.8.4",
	
	//Horizontal super 8
	"7.8.9.1-4",
	"7.8.10.1-4",
	"7.8.11.1-4",
	"7.8.12.1-4",
	"7.8.13.1-4",
	"7.8.14.1-4",
	"7.8.15.1-4",
	"7.8.16.1-4",
	
	//Vertical 8
	"7.8.17.1-2 ^MAX540",	
	"7.8.20.1 ^MAX540; MAX180; NOPOINT; NF",
	
	
	//Family 8 Combinations of lines, angles, and loops
	//8.4 Humpty Bumps
	/*Roll elements on all lines may not exceed 540 degrees*/
	"8.4.1.1-2",
	"8.4.1.4",
	"8.4.2.1-2",
	"8.4.2.4",
	"8.4.3.1-3",
	"8.4.4.1-3",
	
	// Diagonal Humpty Bumps
	"8.4.5.4",
	"8.4.6.4",
	"8.4.7.4",
	"8.4.8.4",
	"8.4.9.3",
	"8.4.10.3",
	"8.4.11.3",
	"8.4.12.3",
	"8.4.13.1-2",
	"8.4.13.4",
	"8.4.14.1-2",
	"8.4.14.4",
	"8.4.15.1-2",
	"8.4.15.4",
	"8.4.16.1-2",
	"8.4.16.4",
	"8.4.17.1-3",
	"8.4.18.1-3",
	"8.4.19.1-3",
	"8.4.20.1-3",
	"8.4.21.1-2",
	"8.4.22.1-2",
	"8.4.23.1-2",
	"8.4.24.1-2",
	"8.4.25.1-2",
	"8.4.26.1-2",
	"8.4.27.1-2",
	"8.4.28.1-2",
	
	
	
	//8.5 Half Cubans
	"8.5.1.1-4",
	"8.5.2.1-4",
	"8.5.3.1-4",
	"8.5.4.1-4",
	"8.5.5.1-4",
	"8.5.6.1-4",
	"8.5.7.1-4",
	"8.5.8.1-4",
	
	
	//8.5 Vertical 5/8ths Loops
	"8.5.9.1-2",
	"8.5.9.4",
	"8.5.10.1-2",
	"8.5.10.4",
	"8.5.11.1-3",
	"8.5.12.1-3",
	"8.5.13.1-2",
	"8.5.14.1-2",
	"8.5.15.1",
	"8.5.16.1",
	"8.5.17.1-2",
	"8.5.17.4",
	"8.5.18.1-2",
	"8.5.18.4",
	"8.5.19.1-3",
	"8.5.20.1-3",
	"8.5.21.4",
	"8.5.22.4",
	
	
	//8.6 P loops
	"8.6.1.1-2 MAX360:2; NOU:2",
	"8.6.1.4 MAX360:2; NOU:2",
	"8.6.2.1-2 MAX360:2; NOU:2",
	"8.6.3.1-3 MAX360:2; NOU:2",
	"8.6.4.1-3 MAX360:2; NOU:2",
	"8.6.5.1-2 MAX360:2; NOU:2",
	"8.6.5.4 MAX360:2; NOU:2",
	"8.6.6.1-24 MAX360:2; NOU:2",
	"8.6.6.4 MAX360:2; NOU:2",
	"8.6.7.1-3 MAX360:2; NOU:2",
	"8.6.8.1-3 MAX360:2; NOU:2",
	
	//Reversing P-Loops
	"8.6.9.1-2 MAX360:2; NOU:2",
	"8.6.9.4 MAX360:2; NOU:2",
	"8.6.10.1-2 MAX360:2; NOU:2",
	"8.6.10.4 MAX360:2; NOU:2",
	"8.6.11.1-3 MAX360:2; NOU:2",
	"8.6.12.1-3 MAX360:2; NOU:2",
	"8.6.13.1-3 MAX360:2; NOU:2",
	"8.6.14.1-3 MAX360:2; NOU:2",
	"8.6.15.1-2 MAX360:2; NOU:2",
	"8.6.15.4 MAX360:2; NOU:2",
	"8.6.16.1-2 MAX360:2; NOU:2",
	"8.6.16.4 MAX360:2; NOU:2",
	
	//Reversing P-loops with half rolls on top
	"8.6.17.1-2 MAX360:2; NOU:2",
	"8.6.18.1-2 MAX360:2; NOU:2",
	"8.6.19.1-2 MAX360:2; NOU:2",
	"8.6.20.1-2 MAX360:2; NOU:2",
	"8.6.21.1-2 MAX360:2; NOU:2",
	"8.6.22.1-2 MAX360:2; NOU:2",
	"8.6.23.1-2 MAX360:2; NOU:2",
	"8.6.24.1-2 MAX360:2; NOU:2",
	
	
	//8.7 Q Loops
	"8.7.1.1-2 MAX360:2; NOU:2",
	"8.7.1.4 MAX360:2; NOU:2",
	"8.7.2.1-3 MAX360:2; NOU:2",
	"8.7.3.1-2 MAX360:2; NOU:2",
	"8.7.3.4 MAX360:2; NOU:2",
	"8.7.4.1-3 MAX360:2; NOU:2",
	"8.7.5.1-2 MAX360:2; NOU:2",
	"8.7.5.4 MAX360:2; NOU:2",
	"8.7.6.1-2 MAX360:2; NOU:2",
	"8.7.6.4 MAX360:2; NOU:2",
	"8.7.7.1-3 MAX360:2; NOU:2",
	"8.7.8.1-3 MAX360:2; NOU:2",
	
	//8.8 Double Humpty Bumps 
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
	"8.8.7.2",
	"8.8.7.3",
	"8.8.8.2",
	"8.8.8.3",	
	
	
	//8.10 Reversing 1-1/4 Loops 
	"8.10.1.1 MAX360:2; NOU:2",
	"8.10.1.2 MAX360:2; NOU:2",
	"8.10.1.4 MAX360:2; NOU:2",
	"8.10.2.1 MAX360:2; NOU:2",
	"8.10.2.2 MAX360:2; NOU:2",
	"8.10.2.4 MAX360:2; NOU:2",
	
	//9.1 Rolls
	"9.1.1.1-6",
	"9.1.2.2",
	"9.1.2.4",
	"9.1.2.6",
	"9.1.3.1-4",
	"9.1.3.6",
	"9.1.4.2",
	"9.1.4.4",
	"9.1.4.6",
	"9.1.5.1-5",
	
	//9.2 2-point Aileron Rolls 
	"9.2.1.4",
	"9.2.1.6",
	"9.2.2.4",
	"9.2.2.6",
	"9.2.3.4",
	"9.2.3.6",
	"9.2.4.4",
	"9.2.5.4",
	
	//9.4 4-point rolls 
	"9.4.1.2-4",
	"9.4.2.2",
	"9.4.2.4",
	"9.4.3.2-4",
	"9.4.4.2",
	"9.4.5.2-3",
	
	//9.8 8 point rolls (point rolls not permitted in looping maneuvers for sportsman)
	"9.8.1.1",
	"9.8.1.2",
	"9.8.2.2",
	"9.8.3.1",
	"9.8.3.2",
	"9.8.4.2",
	"9.8.5.1",
	"9.8.5.2",
	
	
	//9.9 Positive Flick Rolls 
	"9.9.2.4",
	"9.9.3.4",
	"9.9.4.4",
	"9.9.5.4",
	"9.9.8.4",
	"9.9.10.4",
	
	//9.10 Negative Flick Rolls 
	"9.10.2.4",
	"9.10.3.4",
	"9.10.4.4",
	"9.10.5.4",
	"9.10.10.4",
	
	//9.11 Positive Spins
	"9.11.1.4-8 ^MAX540",
	
	//9.12  Negative Spins (not permitted in Intermediate)
	
	//###############################################################################
	//##### IMAC Advanced Alt-Unknown ###############################################
	//###############################################################################
	/*Construction rules
	Done On 45º down-lines that require a 135º push or pull to figure exit, roll elements cannot be in 
	excess of 360º (1 roll), no combination rolls allowed. - MAX360 NOU  Done Needs double check
	Done 1. Combination or total roll elements on horizontal and 45º may not exceed 720º (2 rolls). Except for special limitations for figures covered by rule above. MAX720
	Done 2. Combination or total roll elements on vertical lines or looping maneuvers may not exceed 540º degrees (1-1/2 rolls), except for spins.
	Done 3. Total roll limitation or combination roll elements means the total sum of all rolls on that line; linked, unlinked and combination.
	Family Five with vertical entry and exit lines: Family 5.2.x.x
		1. Combination or total roll elements on a vertical line may not exceed 540º (1 ½ rolls).
	Family Five with 45º entry or exit special rules: Family 5.3.x.x - 5.4.x.x.
	Class Specific:
	Done	1. Combination, or total roll elements, on all up-lines (both 450 and vertical) may not exceed 720 degrees of rotation (2 rolls).
	Done		- Point rolls, if used, may not exceed 180 of rotation; may only be on one of the two ascending lines.
	Done	2. Combination, or total roll elements, on all down-lines (both 450 and vertical) may not exceed 540 degree of rotation (1 1/2 rolls).
	Done		- Point rolls, if used, may not exceed 1800 of rotation; may only be on one of the two descending lines.
	Done	3. Total roll limitation, or combination roll elements, means the sum of all roll elements on the both 450 and vertical: Linked, unlinked, and combination.
		.
	*/
	
	"[IMAC Advanced Alt-Unknown]",
	//rules definitions
	"rule-MAX180=qtrs:<3",
	"why-MAX180 = maximum roll is 180 degrees",
	"rule-MAX540=qtrs:<7",
	"why-MAX540=maximum of 540 degrees rotation allowed, except spins",
	"rule-MAX360=qtrs:<5",
	"why-MAX360=maximum of 360 degrees rotation allowed",
	"rule-MAX720=qtrs:<9",
	"why-MAX720= 1. Combination or total roll elements on horizontal and 45º uplines may not exceed 720º (2 rolls).", 
	"rule-NOPOINT=roll:[248]",
	"why-NOPOINT=no point roll allowed",
	
	"conv-hordiagqtrs=^9\\.([1-9]|10)\\.[234789]\\.([1-8]) = $2; ^9\\.([1-9]|10|11|12)\\.([1569]|10)\\.[1-8] = z",
	"rule-maxdiahor720= hordiagqtrs:<9",
	"why-maxdiahor720 = Combination or total roll elements on horizontal and 45º uplines may not exceed 720º (2 rolls).",
	
	"conv-uppoconv= ^9\\.[2-8]\\.[1-2]=p ; ^9\\.[1|9|10]=o",
	"rule-only1pntrollup=uppoconv: (p,o p,o)|(o,p p,o)|(o,p o,p)|(p,o o,p)|(p p)|(p o,p)]|(p,o p)|(p,p)",
	"why-only1pntrollup = point roll only allowed on one of the uplines",
	
	"conv-dnpoconv= ^9\\.[2-8]\\.[4-5]=p ; ^9\\.[1|9|10]=o",
	"rule-only1pntrolldn=dnpoconv: (p,o p,o)|(o,p p,o)|(o,p o,p)|(p,o o,p)|(p p)|(p o,p)]|(p,o p)|(p,p)",
	"why-only1pntrolldn = point roll only allowed on one of the down lines",
	
	"conv-vertqtrs=^9\\.([1-9]|10)\\.([14569]|10)\\.([1-8]) = $3; ^9\\.1[12]\\.1\\.([456]) = $1; ^9\\.1[12]\\.1\\.([78]) = 6;^9\\.([1-9]|10)\\.[2378]\\.[1-8] = z",
	"rule-maxvert540=vertqtrs:<7",
	"why-maxvert540 = Combination or total roll elements on vertical lines, diagonal down lines or looping maneuvers may not exceed 540º degrees (1-1/2 rolls), except for spins",
	
	"conv-climbqtrs=^9\\.([1-9]|10)\\.[1267]\\.([1-8]) = $2; ^9.([1-9]|10).([459]|10)\\.[1-8] = z; ^9\\.([1-9]|10)\\.3\\.([1-8]) = 0",
	"rule-climbmax720 = climbqtrs:+<9",
	"why-climbmax720 = maximum of 720 degrees total rotation on all up lines vertical and diagonal for Family 5.3 and 5.4",

	"conv-downqtrs=^9\\.([1-9]|10)\\.([459]|10)\\.([1-8]) = $3; ^9\\.([1-9]|10)\\.[123678]\\.([1-8]) = z ",
	"rule-downmax540 = downqtrs:+<7",
	"why-downmax540 = maximum of 540 degrees rotation total on all down lines vertical and diagonal for Family 5.2 and 5.3", 
	
	"conv-ptsqtr=^9\\.([248])\\.[1-5]\\.([1-8]) = $2; ^9.([1|9|10])=z",
	"rule-maxptsqtr2= ptsqtr:<3",
	"why-maxptsqtr2= Point rolls, if used, may not exceed 180 degrees of rotation.",  
	
	//Default rules
	"allow-defrules=maxdiahor720; maxvert540",
	
	//Family 1.1 Single Lines - need a rule to limit roll elements to 360 degrees, excluding spins
	/*
	Family One special rules:
	1. Total roll degree limitation for the 45º down-lines on applicable figures in family one is 540º.
	*/
	//
	"1.1.1.1-4",
	"1.1.2.1-2",
	"1.1.2.3-4 MAX540",
	"1.1.3.1-2",
	"1.1.3.3-4 MAX540",
	"1.1.4.1-2",
	"1.1.4.3-4 MAX360; NOU",
	"1.1.5.1-2",
	"1.1.5.3-4 MAX360; NOU",
	"1.1.6.1-4",
	"1.1.7.1-4",
	"1.1.8.1-2",
	"1.1.8.3-4 MAX360; NOU",
	"1.1.9.1-2",
	"1.1.9.3-4 MAX360; NOU",
	"1.1.10.1-4",
	"1.1.11.1-4",
	
	//Family 1.2 Two Lines
	"1.2.1.1-4",
	"1.2.2.1-4",
	"1.2.3.1-4",
	"1.2.3.1-4",
	"1.2.5.1-4",
	"1.2.6.1-4",
	"1.2.7.1-4",
	"1.2.8.1-4",
	"1.2.9.1-4",
	"1.2.10.1-4",
	"1.2.11.1-4",
	"1.2.12.1-4",
	"1.2.13.1-2 MAX360:2; NOU:2",
	"1.2.13.3-4",
	"1.2.14.1-2 MAX360:2; NOU:2",
	"1.2.14.3-4",
	"1.2.15.1-2 MAX360:2; NOU:2",
	"1.2.15.3-4",
	"1.2.16.1-2 MAX360:2; NOU:2",
	"1.2.16.3-4",
	
	//Family 1.3 Three Lines
	"1.3.1.1-4",
	"1.3.2.1-4",
	"1.3.3.1-4",
	"1.3.4.1-4",
	"1.3.5.1-4",
	"1.3.6.1-4",
	"1.3.7.1-4",
	"1.3.8.1-4",
	"1.3.9.1-4",
	"1.3.10.1-4",
	"1.3.11.1-4",
	"1.3.12.1-4",
	"1.3.13.1-4",
	"1.3.14.1-4",
	"1.3.15.1-4",
	"1.3.16.1-4",
	"1.3.16.1-4",
	
	//Family 2.1-2.4 Turns
	"2.1.1.1",
	"2.1.1.2",
	
	"2.2.1.1",
	"2.2.1.2",
	
	"2.3.1.1-2",
	"2.4.1.1-2",
	
	
	//Family 3 combinations of lines
	"3.3.1.1-4",
	"3.4.1.1-4",
	"3.4.2.1-4",
	"3.8.1.1-4",
	
	//Family 5 Stall Turns
	/*
	
	*/
	"5.2.1.1-4 MAX540",
	"allow=^5\\.[3-4]\\.[1-4]\\.[1-4] climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.3.1.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.3.2.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.3.3.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.3.4.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.4.1.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.4.2.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.4.3.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	//"5.4.4.1-4 climbmax720; downmax540; maxptsqtr2; only1pntrollup; only1pntrolldn",
	
	
	
	//Family 6 Tail Slides (not allowed in Sportsman-Advanced
	
	//Family 7 Loops and Eights
	"7.2.1.1-4",
	"7.2.2.1-4",
	"7.2.3.1-4",
	"7.2.4.1-4",
	"7.3.1.1-4",
	"7.3.2.1-4",
	"7.3.3.1-4",
	"7.3.4.1-4",
	"7.4.1.1-4 MAX540",
	"7.4.2.1-4 MAX540",
	"7.4.3.1-4",
	"7.4.4.1-4",
	"7.4.5.1-2",
	"7.4.6.1-4",
	"7.4.7.1-4 MAX540:2",
	"7.4.8.1-4 MAX540:2",
	"7.4.9.1-4 MAX540:2",
	"7.4.10.1-4 MAX540:2",
	"7.4.11.1-4 MAX540:2",
	"7.4.12.1-4 MAX540:2",
	"7.4.13.1-4 MAX540:2",
	"7.4.14.1-4 MAX540:2",
	
	//Horizontal S
	"7.5.1.1-4",
	"7.5.2.1-4",
	"7.5.2.1-4",
	"7.5.3.1-4",
	"7.5.4.1-4",
	"7.5.5.1-4",
	"7.5.6.1-4",
	"7.5.7.1-4",
	"7.5.8.1-4",
	
	//Vertical S
	"7.5.9.1-2",
	"7.5.10.1-2",
	
	//Horizontal 8
	"7.8.1.1-4",
	"7.8.2.1-4",
	"7.8.3.1-4",
	"7.8.4.1-4",
	"7.8.5.1-4",
	"7.8.6.1-4",
	"7.8.7.1-4",
	"7.8.8.1-4",
	
	/*
	Family Eight special rules:
	1. For all applicable family 8 figures total roll limitations for 45º down- lines is 540º, 
	except when 135º push-pull rule from construction rules apply.
	*/
	//Horizontal super 8
	"7.8.9.1-4",
	"7.8.10.1-4",
	"7.8.11.1-4",
	"7.8.12.1-4",
	"7.8.13.1-4",
	"7.8.14.1-4",
	"7.8.15.1-4",
	"7.8.16.1-4",
	
	//Vertical 8
	"7.8.17.1-2 ^maxvert540",
	"7.8.18.1-2 MAX180; NOPOINT; NF",
	"7.8.19.1-2 MAX180; NOPOINT; NF",
	"7.8.20.1-2 MAX180; NOPOINT; NF",
	
	
	//Family 8 Combinations of lines, angles, and loops
	//8.4 Humpty Bumps
	/*Roll elements on all lines may not exceed 540 degrees*/
	"8.4.1.1-4",
	"8.4.2.1-4",
	"8.4.3.1-4",
	"8.4.4.1-4",
	
	// Diagonal Humpty Bumps
	"8.4.5.1-2 MAX360:2; NOU:2",
	"8.4.5.3-4 MAX540:1",
	"8.4.6.1-2 MAX360:2; NOU:2",
	"8.4.6.3-4 MAX540:1",
	"8.4.7.1-2 MAX360:2; NOU:2",
	"8.4.7.3-4 MAX540:1",
	"8.4.8.1-2 MAX360:2; NOU:2",
	"8.4.8.3-4 MAX540:1",
	"8.4.9.1-2 MAX360:2; NOU:2",
	"8.4.9.3-4 MAX540:1",
	"8.4.10.1-2 MAX360:2; NOU:2",
	"8.4.10.3-4 MAX540:1",
	"8.4.11.1-2 MAX360:2; NOU:2",
	"8.4.11.3-4 MAX540:1",
	"8.4.12.1-2 MAX360:2; NOU:2",
	"8.4.12.3-4 MAX540:1",
	"8.4.13.1-2 MAX540:2",
	"8.4.13.3-4 MAX540:1",
	"8.4.14.1-2 MAX540:2",
	"8.4.14.3-4 MAX540:1",
	"8.4.15.1-2 MAX540:2",
	"8.4.15.3-4 MAX540:1",
	"8.4.16.1-2 MAX540:2",
	"8.4.16.3-4 MAX540:1",
	"8.4.17.1-2 MAX540:2",
	"8.4.17.3-4 MAX540:1",
	"8.4.18.1-2 MAX540:2",
	"8.4.18.3-4 MAX540:1",
	"8.4.19.1-2 MAX540:2",
	"8.4.19.3-4 MAX540:1",
	"8.4.20.1-2 MAX540:2",
	"8.4.20.3-4 MAX540:1",
	"8.4.21.1-2 MAX540:2",
	"8.4.21.3-4 MAX540:1",
	"8.4.22.1-2 MAX540:2",
	"8.4.22.3-4 MAX540:1",
	"8.4.23.1-2 MAX540:2",
	"8.4.23.3-4 MAX540:1",
	"8.4.24.1-2 MAX540:2",
	"8.4.24.3-4 MAX540:1",
	"8.4.25.1-2 MAX540:2",
	"8.4.25.3-4 MAX540:1",
	"8.4.26.1-2 MAX540:2",
	"8.4.26.3-4 MAX540:1",
	"8.4.27.1-2 MAX540:2",
	"8.4.27.3-4 MAX540:1",
	"8.4.28.1-2 MAX540:2",
	"8.4.28.3-4 MAX540:1",
	
	
	
	//8.5 Half Cubans /*need to check line limit rules on 8.5. Missing some figures*/
	"8.5.1.1-2",
	"8.5.1.3-4",
	"8.5.2.1-2",
	"8.5.2.3-4 MAX540:1",
	"8.5.3.1-2",
	"8.5.3.3-4 MAX540:1",
	"8.5.4.1-2",
	"8.5.4.3-4 MAX540:1",
	"8.5.5.1-2 MAX540:2",
	"8.5.5.3-4",
	"8.5.6.1-2 MAX540:2",
	"8.5.6.3-4",
	"8.5.7.1-2 MAX540:2",
	"8.5.7.3-4",
	"8.5.8.1-2 MAX540:2",
	"8.5.8.3-4",
	
	
	
	//8.5 Vertical 5/8ths Loops
	"8.5.9.1-2",
	"8.5.9.3-4 MAX540:1",
	"8.5.10.1-4",
	"8.5.11.1-4",
	"8.5.12.1-4",
	"8.5.13.1-2",
	"8.5.14.1-2",
	"8.5.15.1-2",
	"8.5.16.1-2",
	"8.5.17.1-4",
	"8.5.18.1-4",
	"8.5.19.1-4",
	"8.5.20.1-4",
	"8.5.21.1-2 MAX360:2; NOU:2",
	"8.5.21.3-4",
	"8.5.22.1-2 MAX360:2; NOU:2",
	"8.5.22.3-4",
	"8.5.23.1-2 MAX360:2; NOU:2",
	"8.5.23.3-4",
	"8.5.24.1-2 MAX360:2; NOU:2",
	"8.5.24.3-4",
	
	
	
	//8.6 P loops
	"8.6.1.1-4 MAX540:2",
	"8.6.2.1-4 MAX540:2",
	"8.6.3.1-4 MAX540:2",
	"8.6.4.1-2 MAX540:2",
	"8.6.4.3-4",
	"8.6.5.1-2 MAX540:2",
	"8.6.5.34",
	"8.6.6.1-2 MAX540:2",
	"8.6.6.3-4",
	"8.6.7.1-2 MAX540:2",
	"8.6.7.3-4",
	"8.6.8.1-2 MAX540:2",
	"8.6.8.3-4",
	
	
	//Reversing P-Loops
	"8.6.9.1-2 MAX540:2",
	"8.6.9.3-4",
	"8.6.10.1-2 MAX540:2",
	"8.6.10.3-4",
	"8.6.11.1-2 MAX540:2",
	"8.6.11.3-4",
	"8.6.12.1-2 MAX540:2",
	"8.6.12.3-4",
	"8.6.13.1-2 MAX540:2",
	"8.6.13.3-4",
	"8.6.14.1-2 MAX540:2",
	"8.6.14.3-4",
	"8.6.15.1-2 MAX540:2",
	"8.6.15.3-4",
	"8.6.16.1-2 MAX540:2",
	"8.6.16.3-4",
	
	
	//Reversing P-loops with half rolls on top
	"8.6.17.1-4 MAX540:2",
	"8.6.18.1-4 MAX540:2",
	"8.6.19.1-4 MAX540:2",
	"8.6.20.1-4 MAX540:2",
	"8.6.21.1-4 MAX540:2",
	"8.6.22.1-4 MAX540:2",
	"8.6.23.1-4 MAX540:2",
	"8.6.24.1-4 MAX540:2",
	
	
	//8.7 Q Loops
	"8.7.1.1-2 MAX540:2",
	"8.7.1.3-4 MAX540:1",
	"8.7.2.1-2 MAX540:2",
	"8.7.2.3-4 MAX540:1",
	"8.7.3.1-2 MAX540:2",
	"8.7.3.3-4 MAX540:1",
	"8.7.4.1-2 MAX540:2",
	"8.7.4.3-4 MAX540:1",
	"8.7.5.1-2 MAX540:2 MAX540:3",
	"8.7.5.3-4",
	"8.7.6.1-2 MAX540:2 MAX540:3",
	"8.7.6.3-4",
	"8.7.7.1-2 MAX540:2 MAX540:3",
	"8.7.7.3-4",
	"8.7.8.1-2 MAX540:2 MAX540:2",
	"8.7.8.3-4",
	
	//8.8 Double Humpty Bumps 
	"8.8.1.1-4",
	"8.8.2.1-4",
	"8.8.3.1-4",
	"8.8.4.1-4",
	"8.8.5.1-4",
	"8.8.6.1-4",
	"8.8.7.1-4",
	"8.8.8.1-4",	
	
	
	//8.10 Reversing 1-1/4 Loops 
	"8.10.1.1-4",
	"8.10.2.1-4",
	
	//9.1 Rolls
	"9.1.1.1-6",
	"9.1.2.1-6",
	"9.1.3.1-8",
	"9.1.4.1-6",
	"9.1.5.1-6",
	
	//9.2 2-point Aileron Rolls 
	"9.2.1.4",
	"9.2.1.6",
	"9.2.1.8",
	"9.2.2.4",
	"9.2.2.6",
	"9.2.3.4",
	"9.2.3.6",
	"9.2.3.8",
	"9.2.4.4",
	"9.2.4.6",
	"9.2.5.4",
	
	//9.4 4-point rolls 
	"9.4.1.2-6",
	"9.4.2.2-6",
	"9.4.3.2-6",
	"9.4.4.2-4",
	"9.4.5.2-4",
	
	//9.8 8 point rolls (point rolls not permitted in looping maneuvers for sportsman)
	"9.8.1.1-4",
	"9.8.2.1-4",
	"9.8.3.1-4",
	"9.8.4.1-2",
	"9.8.5.1-2",
	
	
	//9.9 Positive Flick Rolls 
	"9.9.1.2",
	"9.9.1.3",
	"9.9.1.4",
	"9.9.2.2",
	"9.9.2.4",
	"9.9.2.6",
	"9.9.3.2",
	"9.9.3.4",
	"9.9.3.6",
	"9.9.4.2",
	"9.9.4.4",
	"9.9.4.6",
	"9.9.5.2",
	"9.9.5.3",
	"9.9.5.4",
	"9.9.5.5",
	"9.9.5.6",
	"9.9.6.2",
	"9.9.6.3",
	"9.9.6.4",
	"9.9.7.2",
	"9.9.7.4",
	"9.9.7.6",
	"9.9.8.2",
	"9.9.8.4",
	"9.9.8.6",
	"9.9.9.2",
	"9.9.9.4",
	"9.9.9.6",
	"9.9.10.2",
	"9.9.10.3",
	"9.9.10.4",
	"9.9.10.5",
	"9.9.10.6",
	
	
	//9.10 Negative Flick Rolls 
	"9.10.1.2",
	"9.10.1.3",
	"9.10.1.4",
	
	"9.10.2.2",
	"9.10.2.4",
	"9.10.2.6",
	"9.10.3.2",
	"9.10.3.4",
	"9.10.3.6",
	"9.10.4.2",
	"9.10.4.4",
	"9.10.4.6",
	"9.10.5.2",
	"9.10.5.3",
	"9.10.5.4",
	"9.10.5.5",
	"9.10.5.6",
	"9.10.6.2",
	"9.10.6.3",
	"9.10.6.4",
	"9.10.7.2",
	"9.10.7.4",
	"9.10.7.6",
	"9.10.8.2",
	"9.10.8.4",
	"9.10.8.6",
	"9.10.9.2",
	"9.10.9.4",
	"9.10.9.6",
	"9.10.10.2",
	"9.10.10.3",
	"9.10.10.4",
	"9.10.10.4",
	"9.10.10.6",
	
	//9.11 Positive Spins
	"9.11.1.4-8",
	
	//9.12  Negative Spins
	"9.12.1.4-8",
	
	
	//###############################################################################
	//##### IMAC Unlimited Alt-Unknown ###############################################
	//###############################################################################
	
	/*Construction rules
	MAX720dn45 done  On 45º down-lines that require a 135º push or pull to figure exit, roll elements may not exceed 720º (2 rolls),
	Done 1. Combination or total roll elements on down-lines of 45º and vertical may not exceed 900º (2-1/2 rolls).
	Done 2. Combination or total roll elements on up-lines of 45º and vertical may not exceed 1080º (3 rolls).
	Done 3. Total roll limitation or combination roll elements means the total sum of all rolls on that line; linked, unlinked and combination.
	*/
	"[IMAC Unlimited Alt-Unknown]",
	"rule-MAX720dn45=qtrs:<9",
	"why-MAX720dn45= On 45º down-lines that require a 135º push or pull to figure exit, roll elements may not exceed 720º (2 rolls)", 

	"conv-downqtrs=^9\\.([1-9]|10)\\.([459]|10)\\.([1-8]) = $3; ^9\\.(1[12])\\.1\\.([4-8]) = $2; ^9\\.([1-9]|10)\\.[123678]\\.([1-8]) = z ",
	"rule-downmax900 = downqtrs:<11",
	"why-downmax900 = Combination or total roll elements on down-lines of 45º and vertical may not exceed 900º (2-1/2 rolls).",
	
	"conv-climbqtrs=^9\\.([1-9]|10)\\.[1267]\\.([1-8]) = $2; ^9.([1-9]|10).([459]|10)\\.[1-8] = z; ^9\\.([1-9]|10)\\.3\\.([1-8]) = 0; ^9\\.1[12]\\.1\\.[4-8] = 0",
	"rule-climbmax1080 = climbqtrs:<13",
	"why-climbmax1080 = Combination or total roll elements on up-lines of 45º and vertical may not exceed 1080º (3 rolls).",
	
	"rule-34linehdup=climbqtrs:+<11",
	"why-34linehdup = Combination, or total roll elements, on all up-lines (both 450 and vertical) may not exceed 900 degrees of rotation (2 ½ rolls).",
	
	"rule-34linehddn=downqtrs:+<9",
	"why-34linehddn = Combination, or total roll elements, on all down-lines (both 450 and vertical) may not exceed 720 degree of rotation (2 rolls).",
	
	"conv-ptsct=^9.2.[1-5].4 = 2; ^9.2.[1-5].6 = 3; ^9.2.[1-5].8= 4; ^9.4.([1-5]).([2-8]) = $2; ^9.8.[1-5].1=2 ; ^9.8.[1-5].2=4; ^9.8.[1-5].3=6; ^9.8.[1-5].4=8; ^9.[1|9|10] = z",
	"rule-maxpts4 = ptsct:<5",
	"why-maxpts4 = Point rolls, if used on 5.3 and 5.4, may not exceed 4 points",
	
	"conv-uppoconv= ^9\\.[2-8]\\.[1-2]=p ; ^9\\.[1|9|10]=o",
	"rule-only1pntrollup=uppoconv: (p,o p,o)|(o,p p,o)|(o,p o,p)|(p,o o,p)|(p p)|(p o,p)]|(p,o p)|(p,p)",
	"why-only1pntrollup = point roll only allowed on one of the uplines",
	
	"conv-dnpoconv= ^9\\.[2-8]\\.[4-5]=p ; ^9\\.[1|9|10]=o",
	"rule-only1pntrolldn=dnpoconv: (p,o p,o)|(o,p p,o)|(o,p o,p)|(p,o o,p)|(p p)|(p o,p)]|(p,o p)|(p,p)",
	"why-only1pntrolldn = point roll only allowed on one of the down lines",
	
	"rule-MAX180= qtrs:<3",
	"why-MAX180 = 1/2 roll only",
	
	"rule-NOPOINT=roll:[248]",
	"why-NOPOINT=no point roll allowed",
	
	
	//Default rules
	"allow-defrules=climbmax1080; downmax900",
	
	//Family 1.1 Single Lines - need a rule to limit roll elements to 360 degrees, excluding spins
	/*
	
	Family One special rules:
	1. Total roll degree limitation for the 45 degree down-lines on applicable figures in family one is 900 degrees.
	*/
	//
	"1.1.1.1-4",
	"1.1.2.1-4",
	"1.1.3.1-4",
	"1.1.4.1-2",
	"1.1.4.3-4 MAX720dn45",
	"1.1.5.1-2",
	"1.1.5.3-4 MAX720dn45 ",
	"1.1.6.1-4",
	"1.1.7.1-4",
	"1.1.8.1-2",
	"1.1.8.3-4 MAX720dn45",
	"1.1.9.1-2",
	"1.1.9.3-4 MAX720dn45",
	"1.1.10.1-4",
	"1.1.11.1-4",
	
	//Family 1.2 Two Lines
	"1.2.1.1-4",
	"1.2.2.1-4",
	"1.2.3.1-4",
	"1.2.3.1-4",
	"1.2.5.1-4",
	"1.2.6.1-4",
	"1.2.7.1-4",
	"1.2.8.1-4",
	"1.2.9.1-4",
	"1.2.10.1-4",
	"1.2.11.1-4",
	"1.2.12.1-4",
	"1.2.13.1-2",
	"1.2.13.3-4",
	"1.2.14.1-2 MAX720dn45:2",
	"1.2.14.3-4",
	"1.2.15.1-2 MAX720dn45:2",
	"1.2.15.3-4",
	"1.2.16.1-2 MAX720dn45:2",
	"1.2.16.3-4",
	
	//Family 1.3 Three Lines
	"1.3.1.1-4",
	"1.3.2.1-4",
	"1.3.3.1-4",
	"1.3.4.1-4",
	"1.3.5.1-4",
	"1.3.6.1-4",
	"1.3.7.1-4",
	"1.3.8.1-4",
	"1.3.9.1-4",
	"1.3.10.1-4",
	"1.3.11.1-4",
	"1.3.12.1-4",
	"1.3.13.1-4",
	"1.3.14.1-4",
	"1.3.15.1-4",
	"1.3.16.1-4",
	"1.3.16.1-4",
	
	//Family 2.1-2.4 Turns
	"2.1.1.1-2",
	
	"2.2.1.1-2",
	
	"2.3.1.1-2",
	
	"2.4.1.1-2",
	
	
	//Family 3 combinations of lines
	"3.3.1.1-4",
	"3.4.1.1-4",
	"3.4.2.1-4",
	"3.8.1.1-4",
	
	//Family 5 Stall Turns
	
	"5.2.1.1-4",
	"allow=^5\\.[3-4]\\.[1-4]\\.[1-4] 34linehdup; 34linehddn; maxpts4; only1pntrollup; only1pntrolldn",
	
	
	//Family 6 Tail Slides 
	"6.2.1.1-4",
	"6.2.2.1-4",
	
	
	//Family 7 Loops and Eights
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
	"7.4.5.1-4",
	"7.4.6.1-4",
	"7.4.7.1-4",
	"7.4.8.1-4",
	"7.4.9.1-4",
	"7.4.10.1-4",
	"7.4.11.1-4",
	"7.4.12.1-4",
	"7.4.13.1-4",
	"7.4.14.1-4",
	
	//Horizontal S
	"7.5.1.1-4",
	"7.5.2.1-4",
	"7.5.2.1-4",
	"7.5.3.1-4",
	"7.5.4.1-4",
	"7.5.5.1-4",
	"7.5.6.1-4",
	"7.5.7.1-4",
	"7.5.8.1-4",
	
	//Vertical S
	"7.5.9.1-4",
	"7.5.10.1-4",
	
	//Horizontal 8
	"7.8.1.1-4",
	"7.8.2.1-4",
	"7.8.3.1-4",
	"7.8.4.1-4",
	"7.8.5.1-4",
	"7.8.6.1-4",
	"7.8.7.1-4",
	"7.8.8.1-4",
	
	/*
	Family Eight special rules:
	1. For all applicable family 8 figures total roll limitations for 45º down- lines is 900 degrees, 
	except when 135 degree push-pull rule from construction rules apply.
	*/
	//Horizontal super 8
	"7.8.9.1-4",
	"7.8.10.1-4",
	"7.8.11.1-4",
	"7.8.12.1-4",
	"7.8.13.1-4",
	"7.8.14.1-4",
	"7.8.15.1-4",
	"7.8.16.1-4",
	
	//Vertical 8
	"7.8.17.1-4",
	"7.8.18.1-4 MAX180; NOPOINT; NF",
	"7.8.19.1-4 MAX180; NOPOINT; NF",
	"7.8.20.1-4 MAX180; NOPOINT; NF",
	"7.8.21.1-4",
	"7.8.22.1-4 MAX180; NOPOINT; NF",
	
	
	//Family 8 Combinations of lines, angles, and loops
	//8.4 Humpty Bumps
	/*Roll elements on all lines may not exceed 540 degrees*/
	"8.4.1.1-4",
	"8.4.2.1-4",
	"8.4.3.1-4",
	"8.4.4.1-4",
	
	// Diagonal Humpty Bumps
	"8.4.5.1-2 MAX720dn45:2",
	"8.4.5.3-4",
	"8.4.6.1-2 MAX720dn45:2",
	"8.4.6.3-4",
	"8.4.7.1-2 MAX720dn45:2",
	"8.4.7.3-4",
	"8.4.8.1-2 MAX720dn45:2",
	"8.4.8.3-4",
	"8.4.9.1-2 MAX720dn45:2",
	"8.4.9.3-4",
	"8.4.10.1-2 MAX720dn45:2",
	"8.4.10.3-4",
	"8.4.11.1-2 MAX720dn45:2",
	"8.4.11.3-4",
	"8.4.12.1-2 MAX720dn45:2",
	"8.4.12.3-4",
	"8.4.13.1-2",
	"8.4.13.3-4",
	"8.4.14.1-2",
	"8.4.14.3-4",
	"8.4.15.1-2",
	"8.4.15.3-4",
	"8.4.16.1-2",
	"8.4.16.3-4",
	"8.4.17.1-2",
	"8.4.17.3-4",
	"8.4.18.1-2",
	"8.4.18.3-4",
	"8.4.19.1-2",
	"8.4.19.3-4",
	"8.4.20.1-2",
	"8.4.20.3-4",
	"8.4.21.1-2",
	"8.4.21.3-4",
	"8.4.22.1-2",
	"8.4.22.3-4",
	"8.4.23.1-2",
	"8.4.23.3-4",
	"8.4.24.1-2",
	"8.4.24.3-4",
	"8.4.25.1-2",
	"8.4.25.3-4",
	"8.4.26.1-2",
	"8.4.26.3-4",
	"8.4.27.1-2",
	"8.4.27.3-4",
	"8.4.28.1-2",
	"8.4.28.3-4",
	
	
	
	//8.5 Half Cubans
	"8.5.1.1-2",
	"8.5.1.3-4",
	"8.5.2.1-2",
	"8.5.2.3-4",
	"8.5.3.1-2",
	"8.5.3.3-4",
	"8.5.4.1-2",
	"8.5.4.3-4",
	"8.5.5.1-2",
	"8.5.5.3-4",
	"8.5.6.1-2",
	"8.5.6.3-4",
	"8.5.7.1-2",
	"8.5.7.3-4",
	"8.5.8.1-2",
	"8.5.8.3-4",
	
	
	
	//8.5 Vertical 5/8ths Loops
	"8.5.9.1-4",
	"8.5.10.1-4",
	"8.5.11.1-4",
	"8.5.12.1-4",
	"8.5.13.1-4",
	"8.5.14.1-4",
	"8.5.15.1-4",
	"8.5.16.1-4",
	"8.5.17.1-2",
	"8.5.17.3-4",
	"8.5.18.1-2",
	"8.5.18.3-4",
	"8.5.19.1-2",
	"8.5.19.3-4",
	"8.5.20.1-2",
	"8.5.20.3-4",
	"8.5.21.1-2 MAX720dn452",
	"8.5.21.3-4",
	"8.5.22.1-2 MAX720dn45:2",
	"8.5.22.3-4",
	"8.5.23.1-2 MAX720dn45:2",
	"8.5.23.3-4",
	"8.5.24.1-2 MAX720dn45:2",
	"8.5.24.3-4",
	
	
	
	//8.6 P loops
	"8.6.1.1-4",
	"8.6.2.1-4",
	"8.6.3.1-4",
	"8.6.4.1-2",
	"8.6.4.3-4",
	"8.6.5.1-2",
	"8.6.5.3-4",
	"8.6.6.1-2",
	"8.6.6.3-4",
	"8.6.7.1-2",
	"8.6.7.3-4",
	"8.6.8.1-2",
	"8.6.8.3-4",
	
	
	//Reversing P-Loops
	"8.6.9.1-2",
	"8.6.9.3-4",
	"8.6.10.1-2",
	"8.6.10.3-4",
	"8.6.11.1-2",
	"8.6.11.3-4",
	"8.6.12.1-2",
	"8.6.12.3-4",
	"8.6.13.1-2",
	"8.6.13.3-4",
	"8.6.14.1-2",
	"8.6.14.3-4",
	"8.6.15.1-2",
	"8.6.15.3-4",
	"8.6.16.1-2",
	"8.6.16.3-4",
	
	
	//Reversing P-loops with half rolls on top
	"8.6.17.1-4",
	"8.6.18.1-4",
	"8.6.19.1-4",
	"8.6.20.1-4",
	"8.6.21.1-4",
	"8.6.22.1-4",
	"8.6.23.1-4",
	"8.6.24.1-4",
	
	
	//8.7 Q Loops
	"8.7.1.1-2",
	"8.7.1.3-4",
	"8.7.2.1-2",
	"8.7.2.3-4",
	"8.7.3.1-2",
	"8.7.3.3-4",
	"8.7.4.1-2",
	"8.7.4.3-4",
	"8.7.5.1-2",
	"8.7.5.3-4",
	"8.7.6.1-2",
	"8.7.6.3-4",
	"8.7.7.1-2",
	"8.7.7.3-4",
	"8.7.8.1-2",
	"8.7.8.3-4",
	
	//8.8 Double Humpty Bumps 
	"8.8.1.1-4",
	"8.8.2.1-4",
	"8.8.3.1-4",
	"8.8.4.1-4",
	"8.8.5.1-4",
	"8.8.6.1-4",
	"8.8.7.1-4",
	"8.8.8.1-4",	
	
	
	//8.10 Reversing 1-1/4 Loops 
	"8.10.1.1-4",
	"8.10.2.1-4",
	
	//9.1 Rolls
	"9.1.1.1-8",
	"9.1.2.1-8",
	"9.1.3.1-8",
	"9.1.4.1-8",
	"9.1.5.1-8",
	
	//9.2 2-point Aileron Rolls 
	"9.2.1.4-8",
	"9.2.2.4-8",
	"9.2.3.4-8",
	"9.2.4.4-8",
	"9.2.5.4-6",
	
	//9.4 4-point rolls 
	"9.4.1.2-6",
	"9.4.2.2-6",
	"9.4.3.2-8",
	"9.4.4.2-6",
	"9.4.5.2-5",
	
	//9.8 8 point rolls (point rolls not permitted in looping maneuvers for sportsman)
	"9.8.1.1-4",
	"9.8.2.1-4",
	"9.8.3.1-4",
	"9.8.4.1-4",
	"9.8.5.1-4",
	
	
	//9.9 Positive Flick Rolls 
	"9.9.1.2-8",
	"9.9.2.2-8",
	"9.9.3.2-8",
	"9.9.4.2-8",
	"9.9.5.2-8",
	"9.9.6.2-8",
	"9.9.7.2-8",
	"9.9.8.2-8",
	"9.9.9.2-8",
	"9.9.10.2-8",
	
	//9.10 Negative Flick Rolls 
	"9.10.1.2-8",
	"9.10.2.2-8",
	"9.10.3.2-8",
	"9.10.4.2-8",
	"9.10.5.2-8",
	"9.10.6.2-8",
	"9.10.7.2-8",
	"9.10.8.2-8",
	"9.10.9.2-8",
	"9.10.10.2-8",
	
	//9.11 Positive Spins
	"9.11.1.4-8",
	
	//9.12  Negative Spins
	"9.12.1.4-8",
	//#################################################################################################
	//##############################  Intermediate Unknown (adds rollers)  ############################
	//#################################################################################################
	"[IMAC Intermediate Unknown]",
	"2.1.3.1",
	"2.1.3.2",
	"more=IMAC Intermediate Alt-Unknown",
	
	//#################################################################################################
	//##############################  Advanced Unknown (adds rollers)  ################################
	//#################################################################################################
	"[IMAC Advanced Unknown]",
	"2.1.3.1",
	"2.1.3.2",
	"2.2.5.1-2",
	"2.3.4.1-2",
	
	"more=IMAC Advanced Alt-Unknown",
	
	//#################################################################################################
	//##############################  Unlimited Unknown (adds rollers)     ############################
	//#################################################################################################
	"[IMAC Unlimited Unknown]",
	"2.1.2.1-4",
	"2.1.3.1-4",
	
	"2.2.2.1-4",
	"2.2.3.1-4",
	"2.2.4.1-4",
	"2.2.5.1-4",
	"2.2.6.1-4",
	"2.2.7.1-4",
	
	"2.3.2.1-4",
	"2.3.3.1-4",
	"2.3.4.1-4",
	"2.3.5.1-4",
	"2.3.6.1-4",
	
	"2.4.2.1-4",
	"2.4.3.1-4",
	"2.4.4.1-4",
	"2.4.5.1-4",
	"2.4.6.1-4",
	"2.4.7.1-4",
	"2.4.8.1-4",
	"more=IMAC Unlimited Alt-Unknown"
	
	);
	
	
	