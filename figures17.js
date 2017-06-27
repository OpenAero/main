// figures17.js

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

// This file defines all the basic shapes.
// They are grouped for easy user selection through the interface
// The grouping is of the format "Fxxx Name", where xxx is an Aresti family group
// with any number of dots (so e.g. just 3 or 8.5)
// Every figure is encoded in the following manner: figs.push("*ENCODING*");
// The 'push' term is not related to pushing or pulling in aerobatics but is necessary for the software
// The *ENCODING* part is of the following format:
// - Figure pattern as given by the user, with rolls indicated by ^ or _ etc.
// - at least one space character
// - Aresti figure number (no spaces after this!)
// - (KFactorPowered:KfactorGlider)
// - at least one space character
// - Figure drawing instructions, made of ~' dvzmcpro DVZMCPRO [/=!] h  j tT
// This format should be strictly maintained to make sure the software works!

// First, we define the figs array
var figs = new Array();

/**** PATTERNS ****
 * +- entry exit
 * letters - name of figure
 * () middle roll
 * _ full roll
 * ^ half roll
 * & any roll is allowed
 * ~ allow line length change without roll

 **** Instructions ****
 * + force positive attitude
 * - force negative attitude 
 * ~ forward fly
 * ' 1/4-lengh forward fly
 * h add a hammerhead sign
 * t add a tailslide sign 
 * T add a wheels-up tailslide sign
 * u pointed top (non-Aresti)
 * j a turn (jo=outside, jio=inside-outside, joi=outside-inside)
 * _ roll location

 change angle/draw arc:
 45d  90v 135z 180m  225c  270p  315r  360o
   D    V    Z    M     C     P   R     O

 letter!_  is a looping portion with a roll inside   eg o!_
 letter=   means to draw the figure "exact" with actual looping portion (no hard corners, see pp figure)
 letter/   means to draw the looping portion half-size (see b figure)
*/

/** OLD OLAN CODE. NOT SURE ABOUT USE
//diagonal
//zee
//shark
//tooth
//vert
//sharkzee
//zeetooth
//bow
//nfig pushnfig
//turn inroller outroller inoutroller outinroller
//immelman splits loop square diamond octagonal
//goldfish supereight fullcuban cuban  revcuban keyhole
//humpty pushhumpty sausage revsausage
//ploop qloop revploop revqloop 
//hammer tailslide  
//  use @ as "flick" indicator  $ as spin indicator  6$ vertical
*/

//
// Family 1: Lines and Angles
//

// Family 1.1. Single Lines
figs.push("F1.1 Single Lines");

// 1.1.1.1 through 1.1.1.4 (was 1.1.1 through 1.1.4)
figs.push("+_+ 1.1.1.1(2) ~_~");
figs.push("-_- 1.1.1.2(3) ~_~");
//-_-   1.1.1(3) = -~_-~
figs.push("+^- 1.1.1.3(2) ~_-~");
figs.push("-^+ 1.1.1.4(2) ~_-~");
//-^+   1.1.1(2) = -~_~

// 1.1.2.1 through 1.1.2.4 (was 1.2.1 through 1.2.4)
figs.push("+d_+ 1.1.2.1(7) ~d~_~D~");
figs.push("-d_- 1.1.2.2(8) ~D~_~d~");
figs.push("+id_+ 1.1.2.3(7) ~D~_~d~");
figs.push("-id_- 1.1.2.4(8) ~d~_~D~");
//-d_-  1.1.2(8) = -~D~_~d~-
//+id_+  1.1.2(7) = ~D~_~d~
//-id_-  1.1.2(8) = -~d~_~D~-

// 1.1.3.1 through 1.1.3.4 (was 1.3.1 through 1.3.4)
figs.push("+d^- 1.1.3.1(7) ~d~_~d~");
figs.push("-d^+ 1.1.3.2(8) ~D~_~D~");
figs.push("+id^- 1.1.3.3(8) ~D~_~D~");
figs.push("-id^+ 1.1.3.4(7) ~d~_~d~");
//-d^+ 1.1.3(8) = -~D~_~D~
//+id^- 1.1.3(8) = ~D~_~D~-
//-id^+ 1.1.3(7) = -~d~_~d~

// 1.1.4.1 through 1.1.4.4 (was 1.4.1 through 1.4.4)
figs.push("+d_- 1.1.4.1(9:0) ~d~_~z~");
figs.push("-d_+ 1.1.4.2(11:0) ~D~_~Z~");
figs.push("+id_- 1.1.4.3(10:0) ~D~_~Z~");
figs.push("-id_+ 1.1.4.4(9:0) ~d~_~z~");
//-d_+ 1.1.4(11) = -~D~_~Z~
//+id_- 1.1.4(10) = ~D~_~Z~-
//-id_+ 1.1.4(9) = -~d~_~z~

// 1.1.5.1 through 1.1.5.4 (was 1.5.1 through 1.5.4)
figs.push("+d^+ 1.1.5.1(10:0) ~d~_~Z~");
figs.push("-d^- 1.1.5.2(10:0) ~D~_~z~");
figs.push("+id^+ 1.1.5.3(9:0) ~D~_~z~");
figs.push("-id^- 1.1.5.4(11:0) ~d~_~Z~");
//-d^- 1.1.5(10) = -~D~_~z~-
//+id^+ 1.1.5(9) = ~D~_~z~
//-id^- 1.1.5(11) = -~d~_~Z~-

// 1.1.6.1-4
figs.push("+v&+ 1.1.6.1(10) ~v~_~V~");
figs.push("-v&- 1.1.6.2(11) ~V~_~v~");
figs.push("+iv&+ 1.1.6.3(10) ~V~_~v~");
figs.push("-iv&- 1.1.6.4(10) ~v~_~V~");
//-v&-	1.1.6(11) = -~V~_~v~-
//+iv&+	1.1.6(10) = ~V~_~v~
//-iv&-	1.1.6(10) = -~v~_~V~-

// 1.1.7.1-4
figs.push("+v&- 1.1.7.1(9) ~v~_~v~");
figs.push("-v&+ 1.1.7.2(12) ~V~_~V~");
figs.push("+iv&- 1.1.7.3(11) ~V~_~V~");
figs.push("-iv&+ 1.1.7.4(9) ~v~_~v~");
//-v&+	1.1.7(12) = -~V~_~V~
//+iv&-	1.1.7(11) = ~V~_~V~-
//-iv&+	1.1.7(9) = -~v~_~v~

// 1.1.8.1-4
figs.push("+z_+ 1.1.8.1(12:0) ~''z~_~Z''~");
figs.push("-z_- 1.1.8.2(12:0) ~''Z~_~z''~");
figs.push("+iz_+ 1.1.8.3(12:0) ~''Z~_~z''~");
figs.push("-iz_- 1.1.8.4(12:0) ~''z~_~Z''~");

// 1.1.9.1-4
figs.push("+z^- 1.1.9.1(11:0) ~''z~_~z''~");
figs.push("-z^+ 1.1.9.2(14:0) ~''Z~_~Z''~");
figs.push("+iz^- 1.1.9.3(14:0) ~''Z~_~Z''~");
figs.push("-iz^+ 1.1.9.4(11:0) ~''z~_~z''~");

// 1.1.10.1-4
figs.push("+z_- 1.1.10.1(9:0) ~''z~_~d''~");
figs.push("-z_+ 1.1.10.2(11:0) ~''Z~_~D''~");
figs.push("+iz_- 1.1.10.3(11:0) ~''Z~_~D''~");
figs.push("-iz_+ 1.1.10.4(8:0) ~''z~_~d''~");

// 1.1.11.1-4
figs.push("+z^+ 1.1.11.1(9:0) ~''z~_~D''~");
figs.push("-z^- 1.1.11.2(11:0) ~''Z~_~d''~");
figs.push("+iz^+ 1.1.11.3(10:0) ~''Z~_~d''~");
figs.push("-iz^- 1.1.11.4(10:0) ~''z~_~D''~");

// Family 1.2. Two Lines
figs.push("F1.2 Two Lines");

// 1.2.1.1-4
figs.push("+_t&+ 1.2.1.1(13) ~d~_~Z~_~v~");
figs.push("-_t&- 1.2.1.2(14) ~D~_~z~_~V~");
figs.push("+_it&+ 1.2.1.3(13:0) ~D~_~z~_~V~");
figs.push("-_it&- 1.2.1.4(15:0) ~d~_~Z~_~v~");

// 1.2.2.1-4
figs.push("+_t&- 1.2.2.1(14) ~d~_~Z~_~V~");
figs.push("-_t&+ 1.2.2.2(13) ~D~_~z~_~v~");
figs.push("+_it&- 1.2.2.3(12:0) ~D~_~z~_~v~");
figs.push("-_it&+ 1.2.2.4(15:0) ~d~_~Z~_~V~");

// 1.2.3.1-4
figs.push("+^t&+ 1.2.3.1(12) ~d~_~z~_~v~");
figs.push("-^t&- 1.2.3.2(16) ~D~_~Z~_~V~");
figs.push("+^it&+ 1.2.3.3(15) ~D~_~Z~_~V~");
figs.push("-^it&- 1.2.3.4(12) ~d~_~z~_~v~");

// 1.2.4.1-4
figs.push("+^t&- 1.2.4.1(13) ~d~_~z~_~V~");
figs.push("-^t&+ 1.2.4.2(14) ~D~_~Z~_~v~");
figs.push("+^it&- 1.2.4.3(14) ~D~_~Z~_~v~");
figs.push("-^it&+ 1.2.4.4(13) ~d~_~z~_~V~");

// 1.2.5.1-4
figs.push("+&k_- 1.2.5.1(14) ~v~''_~z~~_~~D~");
figs.push("-&k_+ 1.2.5.2(16) ~V~''_~Z~~_~~d~");
figs.push("+&ik_- 1.2.5.3(17:0) ~V~''_~Z~~_~~d~");
figs.push("-&ik_+ 1.2.5.4(14:0) ~v~''_~z~~_~~D~");

// 1.2.6.1-4
figs.push("+&k_+ 1.2.6.1(14) ~v~''_~Z~~_~~d~");
figs.push("-&k_- 1.2.6.2(16) ~V~''_~z~~_~~D~");
figs.push("+&ik_+ 1.2.6.3(15) ~V~''_~z~~_~~D~");
figs.push("-&ik_- 1.2.6.4(15) ~v~''_~Z~~_~~d~");

// 1.2.7.1-4
figs.push("+&k^+ 1.2.7.1(13) ~v~''_~z~~_~~d~");
figs.push("-&k^- 1.2.7.2(17) ~V~''_~Z~~_~~D~");
figs.push("+&ik^+ 1.2.7.3(16:0) ~V~''_~Z~~_~~D~");
figs.push("-&ik^- 1.2.7.4(14) ~v~''_~z~~_~~d~");

// 1.2.8.1-4
figs.push("+&k^- 1.2.8.1(16) ~v~''_~Z~~_~~D~");
figs.push("-&k^+ 1.2.8.2(15) ~V~''_~z~~_~~d~");
figs.push("+&ik^- 1.2.8.3(15) ~V~''_~z~~_~~d~");
figs.push("-&ik^+ 1.2.8.4(15:0) ~v~''_~Z~~_~~D~");

// 1.2.9.1-4
figs.push("+_zt&+ 1.2.9.1(15:0) ~~z~_~z~_~v~");
figs.push("-_zt&- 1.2.9.2(20:0) ~~Z~_~Z~_~V~");
figs.push("+_izt&+ 1.2.9.3(20:0) ~~Z~_~Z~_~V~");
figs.push("-_izt&- 1.2.9.4(16:0) ~~z~_~z~_~v~");

// 1.2.10.1-4
figs.push("+_zt&- 1.2.10.1(16:0) ~~z~_~z~_~V~");
figs.push("-_zt&+ 1.2.10.2(19:0) ~~Z~_~Z~_~v~");
figs.push("+_izt&- 1.2.10.3(21:0) ~~Z~_~Z~_~v~");
figs.push("-_izt&+ 1.2.10.4(15:0) ~~z~_~z~_~V~");

// 1.2.11.1-4
figs.push("+^zt&+ 1.2.11.1(19:0) ~~z~_~Z~_~V~");
figs.push("-^zt&- 1.2.11.2(17:0) ~~Z~_~z~_~v~");
figs.push("+^izt&+ 1.2.11.3(17:0) ~~Z~_~z~_~v~");
figs.push("-^izt&- 1.2.11.4(19:0) ~~z~_~Z~_~V~");

// 1.2.12.1-4
figs.push("+^zt&- 1.2.12.1(18:0) ~~z~_~Z~_~v~");
figs.push("-^zt&+ 1.2.12.2(18:0) ~~Z~_~z~_~V~");
figs.push("+^izt&- 1.2.12.3(18:0) ~~Z~_~z~_~V~");
figs.push("-^izt&+ 1.2.12.4(18:0) ~~z~_~Z~_~v~");

// 1.2.13.1-4
figs.push("+&kz_+ 1.2.13.1(16:0) ~v~_~z~_~z~~");
figs.push("-&kz_- 1.2.13.2(20:0) ~V~_~Z~_~Z~~");
figs.push("+&ikz_+ 1.2.13.3(20:0) ~V~_~Z~_~Z~~");
figs.push("-&ikz_- 1.2.13.4(15:0) ~v~_~z~_~z~~");

// 1.2.14.1-4
figs.push("+&kz_- 1.2.14.1(18:0) ~v~_~Z~_~Z~~");
figs.push("-&kz_+ 1.2.14.2(18:0) ~V~_~z~_~z~~");
figs.push("+&ikz_- 1.2.14.3(17:0) ~V~_~z~_~z~~");
figs.push("-&ikz_+ 1.2.14.4(19:0) ~v~_~Z~_~Z~~");

// 1.2.15.1-4
figs.push("+&kz^- 1.2.15.1(17:0) ~v~_~z~_~Z~~");
figs.push("-&kz^+ 1.2.15.2(19:0) ~V~_~Z~_~z~~");
figs.push("+&ikz^- 1.2.15.3(19:0) ~V~_~Z~_~z~~");
figs.push("-&ikz^+ 1.2.15.4(19:0) ~v~_~z~_~Z~~");

// 1.2.16.1-4
figs.push("+&kz^+ 1.2.16.1(17:0) ~v~_~Z~_~z~~");
figs.push("-&kz^- 1.2.16.2(19:0) ~V~_~z~_~Z~~");
figs.push("+&ikz^+ 1.2.16.3(18:0) ~V~_~z~_~Z~~");
figs.push("-&ikz^- 1.2.16.4(17:0) ~v~_~Z~_~z~~");

// Family 1.3. Three lines
figs.push("F1.3 Three Lines");

// 1.3.1.1-4
figs.push("+_w(&)_- 1.3.1.1(22:0) ~d''_''~~Z~_~Z~~_~d~");
figs.push("-_w(&)_+ 1.3.1.2(19) ~D''_''~~z~_~z~~_~D~");
figs.push("+_iw(&)_- 1.3.1.3(19) ~D''_''~~z~_~z~~_~D~");
figs.push("-_iw(&)_+ 1.3.1.4(22:0) ~d''_''~~Z~_~Z~~_~d~");

// 1.3.2.1-4
figs.push("+^w(&)_+ 1.3.2.1(18) ~d''_''~~z~_~z~~_~D~");
figs.push("-^w(&)_- 1.3.2.2(23:0) ~D''_''~~Z~_~Z~~_~d~");
figs.push("+^iw(&)_+ 1.3.2.3(22:0) ~D''_''~~Z~_~Z~~_~d~");
figs.push("-^iw(&)_- 1.3.2.4(19) ~d''_''~~z~_~z~~_~D~");

// 1.3.3.1-4
figs.push("+_w(&)^+ 1.3.3.1(22:0) ~d''_''~~Z~_~Z~~_~D~");
figs.push("-_w(&)^- 1.3.3.2(19) ~D''_''~~z~_~z~~_~d~");
figs.push("+_iw(&)^+ 1.3.3.3(18) ~D''_''~~z~_~z~~_~d~");
figs.push("-_iw(&)^- 1.3.3.4(23:0) ~d''_''~~Z~_~Z~~_~D~");

// 1.3.4.1-4
figs.push("+^w(&)^- 1.3.4.1(18) ~d''_''~~z~_~z~~_~d~");
figs.push("-^w(&)^+ 1.3.4.2(23:0) ~D''_''~~Z~_~Z~~_~D~");
figs.push("+^iw(&)^- 1.3.4.3(23:0) ~D''_''~~Z~_~Z~~_~D~");
figs.push("-^iw(&)^+ 1.3.4.4(18) ~d''_''~~z~_~z~~_~d~");

// 1.3.5.1-4
figs.push("+_w(&)_+ 1.3.5.1(20) ~d''_''~~Z~_~z~~_~D~");
figs.push("-_w(&)_- 1.3.5.2(21:0) ~D''_''~~z~_~Z~~_~d~");
figs.push("+_iw(&)_+ 1.3.5.3(19) ~D''_''~~z~_~Z~~_~d~");
figs.push("-_iw(&)_- 1.3.5.4(22:0) ~d''_''~~Z~_~z~~_~D~");

// 1.3.6.1-4
figs.push("+^w(&)_- 1.3.6.1(20:0) ~d''_''~~z~_~Z~~_~d~");
figs.push("-^w(&)_+ 1.3.6.2(21) ~D''_''~~Z~_~z~~_~D~");
figs.push("+^iw(&)_- 1.3.6.3(21:0) ~D''_''~~Z~_~z~~_~D~");
figs.push("-^iw(&)_+ 1.3.6.4(19) ~d''_''~~z~_~Z~~_~d~");

// 1.3.7.1-4
figs.push("+_w(&)^- 1.3.7.1(20) ~d''_''~~Z~_~z~~_~d~");
figs.push("-_w(&)^+ 1.3.7.2(21:0) ~D''_''~~z~_~Z~~_~D~");
figs.push("+_iw(&)^- 1.3.7.3(20) ~D''_''~~z~_~Z~~_~D~");
figs.push("-_iw(&)^+ 1.3.7.4(20:0) ~d''_''~~Z~_~z~~_~d~");

// 1.3.8.1-4
figs.push("+^w(&)^+ 1.3.8.1(20:0) ~d''_''~~z~_~Z~~_~D~");
figs.push("-^w(&)^- 1.3.8.2(21) ~D''_''~~Z~_~z~~_~d~");
figs.push("+^iw(&)^+ 1.3.8.3(20:0) ~D''_''~~Z~_~z~~_~d~");
figs.push("-^iw(&)^- 1.3.8.4(20) ~d''_''~~z~_~Z~~_~D~");

// 1.3.9.1-4
figs.push("+&n(_)&+ 1.3.9.1(24:0) ~v~_''~z~~_~Z~''_~V~");
figs.push("-&pn(_)&- 1.3.9.2(24:0) -~V~_''~Z~~_~z~''_~v~");
figs.push("+&ipn(_)&+ 1.3.9.3(22:0) ~V~_''~Z~~_~z~''_~v~");
figs.push("-&in(_)&- 1.3.9.4(23:0) -~v~_''~z~~_~Z~''_~V~");

// 1.3.10-1-4
figs.push("+&n(_)&- 1.3.10.1(23:0) ~v~_''~z~~_~Z~''_~v~");
figs.push("-&pn(_)&+ 1.3.10.2(24:0) -~V~_''~Z~~_~z~''_~V~");
figs.push("+&ipn(_)&- 1.3.10.3(24:0) ~V~_''~Z~~_~z~''_~V~");
figs.push("-&in(_)&+ 1.3.10.4(22:0) -~v~_''~z~~_~Z~''_~v~");

// 1.3.11.1-4
figs.push("+&n(^)&- 1.3.11.1(20:0) ~v~_''~z~~_~z~''_~v~");
figs.push("-&pn(^)&+ 1.3.11.2(27:0) -~V~_''~Z~~_~Z~''_~V~");
figs.push("+&ipn(^)&- 1.3.11.3(26:0) ~V~_''~Z~~_~Z~''_~V~");
figs.push("-&in(^)&+ 1.3.11.4(20:0) -~v~_''~z~~_~z~''_~v~");

// 1.3.12.1-4
figs.push("+&n(^)&+ 1.3.12.1(21:0) ~v~_''~z~~_~z~''_~V~");
figs.push("-&pn(^)&- 1.3.12.2(26:0) -~V~_''~Z~~_~Z~''_~v~");
figs.push("+&ipn(^)&+ 1.3.12.3(25:0) ~V~_''~Z~~_~Z~''_~v~");
figs.push("-&in(^)&- 1.3.12.4(21:0) -~v~_''~z~~_~z~''_~V~");

// 1.3.13-1.4
figs.push("+&pn(_)&+ 1.3.13.1(22:0) ~v~_''~Z~~_~z~''_~V~");
figs.push("-&n(_)&- 1.3.13.2(25:0) -~V~_''~z~~_~Z~''_~v~");
figs.push("+&in(_)&+ 1.3.13.3(23:0) ~V~_''~z~~_~Z~''_~v~");
figs.push("-&ipn(_)&- 1.3.13.4(23:0) -~v~_''~Z~~_~z~''_~V~");

// 1.3.14.1-4
figs.push("+&pn(_)&- 1.3.14.1(22:0) ~v~_''~Z~~_~z~''_~v~");
figs.push("-&n(_)&+ 1.3.14.2(25:0) -~V~_''~z~~_~Z~''_~V~");
figs.push("+&in(_)&- 1.3.14.3(24:0) ~V~_''~z~~_~Z~''_~V~");
figs.push("-&ipn(_)&+ 1.3.14.4(22:0) -~v~_''~Z~~_~z~''_~v~");

// 1.3.15.1-4
figs.push("+&pn(^)&- 1.3.15.1(24:0) ~v~_''~Z~~_~Z~''_~v~");
figs.push("-&n(^)&+ 1.3.15.2(23:0) -~V~_''~z~~_~z~''_~V~");
figs.push("+&in(^)&- 1.3.15.3(22:0) ~V~_''~z~~_~z~''_~V~");
figs.push("-&ipn(^)&+ 1.3.15.4(23:0) -~v~_''~Z~~_~Z~''_~v~");

// 1.3.16.1-4
figs.push("+&pn(^)&+ 1.3.16.1(25:0) ~v~_''~Z~~_~Z~''_~V~");
figs.push("-&n(^)&- 1.3.16.2(22:0) -~V~_''~z~~_~z~''_~v~");
figs.push("+&in(^)&+ 1.3.16.3(21:0) ~V~_''~z~~_~z~''_~v~");
figs.push("-&ipn(^)&- 1.3.16.4(25:0) -~v~_''~Z~~_~Z~''_~V~");

//
// Family 2. Turns and Rolling Turns
//

// Family 2.1. 90 degree turns
figs.push("F2.1 90 degree Turns");

// 2.1.1.1-2 (90 degree turn, no roll)
// can be written as j or 1j
figs.push("+j+ 2.1.1.1(3) ~j1~");
figs.push("-j- 2.1.1.2(4) ~J1~");
figs.push("+1j+ 2.1.1.1(3) ~j1~");
figs.push("-1j- 2.1.1.2(4) ~J1~");

// 2.1.2.1-4 (90 degree turn, 1/2 roll)
figs.push("+1j5- 2.1.2.1(14:19) ~''j15''~");
figs.push("-1j5+ 2.1.2.2(14:19) ~''J15''~");
figs.push("+1jo5- 2.1.2.3(15:21) ~''J15''~");
figs.push("-1jo5+ 2.1.2.4(15:21) ~''j15''~");

// 2.1.3.1-4 (90 degree turn, 1 roll)
figs.push("+1j1+ 2.1.3.1(14:19) ~''j11''~");
figs.push("-1j1- 2.1.3.2(15:20) ~''J11''~");
figs.push("+1jo1+ 2.1.3.3(15:21) ~''J11''~");
figs.push("-1jo1- 2.1.3.4(16:22) ~''j11''~");

// Family 2.2. 180 degree turns
figs.push("F2.2 180 degree Turns");

// 2.2.1.1-2 (180 degree turn, no roll)
figs.push("+2j+ 2.2.1.1(4) ~j2~");
figs.push("-2j- 2.2.1.2(5) ~J2~");

// 2.2.2.1-4 (180 degree turn, one roll)
figs.push("+2j1+ 2.2.2.1(26:36) ~''j21''~");
figs.push("-2j1- 2.2.2.2(27:37) ~''J21''~");
figs.push("+2jo1+ 2.2.2.3(28:40) ~''J21''~");
figs.push("-2jo1- 2.2.2.4(29:41) ~''j21''~");

// 2.2.3.1-4 (180 degree turn, 1.5 roll)
figs.push("+2j15- 2.2.3.1(24:31) ~''j215''~");
figs.push("-2j15+ 2.2.3.2(24:31) ~''J215''~");
figs.push("+2jo15- 2.2.3.3(26:35) ~''J215''~");
figs.push("-2jo15+ 2.2.3.4(26:35) ~''j215''~");

// 2.2.4.1-4 (180 degree turn, 1 followed by opposite 0.5 roll)
figs.push("+2jio15- 2.2.4.1(26:37) ~''jio215''~");
figs.push("-2jio15+ 2.2.4.2(26:37) ~''JIO215''~");
figs.push("+2joi15- 2.2.4.3(27:39) ~''JIO215''~");
figs.push("-2joi15+ 2.2.4.4(27:39) ~''jio215''~");

// 2.2.5.1-4 (180 degree turn, 2 rolls)
figs.push("+2j2+ 2.2.5.1(22:30) ~''j22''~");
figs.push("-2j2- 2.2.5.2(23:31) ~''J22''~");
figs.push("+2jo2+ 2.2.5.3(24:34) ~''J22''~");
figs.push("-2jo2- 2.2.5.4(25:35) ~''j22''~");

// 2.2.6.1-4 (180 degree turn, 1 followed by opposite 1 roll)
figs.push("+2jio2+ 2.2.6.1(25:37) ~''jio22''~");
figs.push("-2jio2- 2.2.6.2(26:38) ~''JIO22''~");
figs.push("+2joi2+ 2.2.6.3(25:37) ~''JIO22''~");
figs.push("-2joi2- 2.2.6.4(26:38) ~''jio22''~");

// 2.2.7.1-4 (180 degree turn, 0.5 followed by 1 opposite roll)
figs.push("+2jio51- 2.2.7.1(27:40) ~''jio251''~");
figs.push("-2jio51+ 2.2.7.2(27:40) ~''JIO251''~");
figs.push("+2joi51- 2.2.7.3(26:39) ~''JIO251''~");
figs.push("-2joi51+ 2.2.7.4(26:39) ~''jio251''~");

// Family 2.3. 270 degree turns
figs.push("F2.3 270 degree Turns");

// 2.3.1.1-2: (270 degree turn, no roll)
figs.push("+3j+ 2.3.1.1(5) ~''j3''~");
figs.push("-3j- 2.3.1.2(7) ~''J3''~");

// 2.3.2.1-4: (270 degree turn, 1.5 roll)
figs.push("+3j15- 2.3.2.1(34:47) ~~j315~~");
figs.push("-3j15+ 2.3.2.2(34:47) ~~J315~~");
figs.push("+3jo15- 2.3.2.3(37:53) ~~J315~~");
figs.push("-3jo15+ 2.3.2.4(37:53) ~~j315~~");

// 2.3.3.1-4: (270 degree turn, 1.5 roll in/out)
figs.push("+3jio15- 2.3.3.1(37:54) ~~jio315~~");
figs.push("-3jio15+ 2.3.3.2(37:54) ~~JIO315~~");
figs.push("+3joi15- 2.3.3.3(38:56) ~~JIO315~~");
figs.push("-3joi15+ 2.3.3.4(38:56) ~~jio315~~");

// 2.3.4.1-4: (270 degree turn, 3 rolls)
figs.push("+3j3+ 2.3.4.1(30:41) ~~j33~~");
figs.push("-3j3- 2.3.4.2(31:42) ~~J33~~");
figs.push("+3jo3+ 2.3.4.3(33:47) ~~J33~~");
figs.push("-3jo3- 2.3.4.4(34:48) ~~j33~~");

// 2.3.5.1-4: (270 degree turn, 3 rolls in/out/in)
figs.push("+3jio3+ 2.3.5.1(35:53) ~~jio33~~");
figs.push("-3jio3- 2.3.5.2(36:54) ~~JIO33~~");
figs.push("+3joi3+ 2.3.5.3(36:55) ~~JIO33~~");
figs.push("-3joi3- 2.3.5.4(37:56) ~~jio33~~");

// 2.3.6.1-4: (270 degree turn, 0.5 roll followed by 1 opposite roll)
// CHECK
figs.push("+3jio51- 2.3.6.1(38:0) ~~jio351~~");
figs.push("-3jio51+ 2.3.6.2(38:0) ~~JIO351~~");
figs.push("+3joi51- 2.3.6.3(37:0) ~~JIO351~~");
figs.push("-3joi51+ 2.3.6.4(37:0) ~~jio351~~");

// Family 2.4. 360 degree turns
figs.push("F2.4 360 degree Turns");

// 2.4.1.1-2
figs.push("+4j+ 2.4.1.1(6) ~j4~");
figs.push("-4j- 2.4.1.2(8) ~J4~");

// 2.4.2.1-4 (1 roll)
figs.push("+4j1+ 2.4.2.1(46:0) ~''j41''~");
figs.push("-4j1- 2.4.2.2(47:0) ~''J41''~");
figs.push("+4jo1+ 2.4.2.3(50:0) ~''J41''~");
figs.push("-4jo1- 2.4.2.4(51:0) ~''j41''~");

// 2.4.3.1-4 (2 rolls)
figs.push("+4j2+ 2.4.3.1(42:58) ~''j42''~");
figs.push("-4j2- 2.4.3.2(43:59) ~''J42''~");
figs.push("+4jo2+ 2.4.3.3(46:66) ~''J42''~");
figs.push("-4jo2- 2.4.3.4(47:67) ~''j42''~");

// 2.4.4.1-4 (2 rolls in/out)
figs.push("+4jio2+ 2.4.4.1(46:67) ~''jio42''~");
figs.push("-4jio2- 2.4.4.2(47:68) ~''JIO42''~");
figs.push("+4joi2+ 2.4.4.3(46:67) ~''JIO42''~");
figs.push("-4joi2- 2.4.4.4(47:68) ~''jio42''~");

// 2.4.5.1-4 (3 rolls)
figs.push("+4j3+ 2.4.5.1(39:52) ~''j43''~");
figs.push("-4j3- 2.4.5.2(40:53) ~''J43''~");
figs.push("+4jo3+ 2.4.5.3(43:60) ~''J43''~");
figs.push("-4jo3- 2.4.5.4(44:61) ~''j43''~");

// 2.4.6.1-4 (3 rolls in/out/in)
figs.push("+4jio3+ 2.4.6.1(45:65) ~''jio43''~");
figs.push("-4jio3- 2.4.6.2(45:65) ~''JIO43''~");
figs.push("+4joi3+ 2.4.6.3(46:67) ~''JIO43''~");
figs.push("-4joi3- 2.4.6.4(47:68) ~''jio43''~");

// 2.4.7.1-4 (4 rolls)
figs.push("+4j4+ 2.4.7.1(38:52) ~''j44''~");
figs.push("-4j4- 2.4.7.2(39:53) ~''J44''~");
figs.push("+4jo4+ 2.4.7.3(42:60) ~''J44''~");
figs.push("-4jo4- 2.4.7.4(43:61) ~''j44''~");

// 2.4.8.1-4 (4 rolls in/out/in/out)
figs.push("+4jio4+ 2.4.8.1(46:71) ~''jio44''~");
figs.push("-4jio4- 2.4.8.2(47:72) ~''JIO44''~");
figs.push("+4joi4+ 2.4.8.3(46:71) ~''JIO44''~");
figs.push("-4joi4- 2.4.8.4(47:72) ~''jio44''~");


//
// Family 3. Combinations of lines
//

// Family 3.3 Three Corners
figs.push("F3 Combinations of Lines");

// 3.3.1.1-4
figs.push("+dz- 3.3.1.1(9) ~d~v~d~");
figs.push("-dz+ 3.3.1.2(11) ~D~V~D~");
figs.push("+idz- 3.3.1.3(11) ~D~V~D~");
figs.push("-idz+ 3.3.1.4(9) ~d~v~d~");

// Family 3.4 Four Corners

// 3.4.1.1-4
figs.push("+dvz- 3.4.1.1(10:0) ~d~d~d~d~");
figs.push("-dvz+ 3.4.1.2(13:0) ~D~D~D~D~");
figs.push("+idvz- 3.4.1.3(12:0) ~D~D~D~D~");
figs.push("-idvz+ 3.4.1.4(10:0) ~d~d~d~d~");

// 3.4.2.1-4
figs.push("+dvd+ 3.4.2.1(11:0) ~d~d~D~D~");
figs.push("-dvd- 3.4.2.2(12:0) ~D~D~d~d~");
figs.push("+idvd+ 3.4.2.3(11:0) ~D~D~d~d~");
figs.push("-idvd- 3.4.2.4(12:0) ~d~d~D~D~");

// Family 3.8 Eight Corners

// 3.8.1.1-4
figs.push("+rqq- 3.8.1.1(22:0) ~d~d~D~D~D~D~D~D~");
figs.push("-rqq+ 3.8.1.2(23:0) ~D~D~d~d~d~d~d~d~");
figs.push("+irqq- 3.8.1.3(22:0) ~D~D~d~d~d~d~d~d~");
figs.push("-irqq+ 3.8.1.4(23:0) ~d~d~D~D~D~D~D~D~");

//
// Family 5. Stall Turns
//

// Family 5.2. Two Line Stall Turns
figs.push("F5.2 Two line Stall Turns");

// 5.2.1.1-4
figs.push("+&h&+ 5.2.1.1(17) ~v~_~h~_''v~");
figs.push("-&h&- 5.2.1.2(23) ~V~_~H~_''V~");
figs.push("+&h&- 5.2.1.3(18) ~v~_~h~_''V~");
figs.push("-&h&+ 5.2.1.4(22) ~V~_~H~_''v~");

// Family 5.3. Three Line Stall Turns
figs.push("F5.3 Three line Stall Turns");

// 5.3.1.1-4
figs.push("+_dh(&)&+ 5.3.1.1(18:0) ~d~_~d~_~h~_''v~");
figs.push("-_dh(&)&- 5.3.1.2(25:0) ~D~_~D~_~H~_''V~");
figs.push("+_dh(&)&- 5.3.1.3(20:0) ~d~_~d~_~h~_''V~");
figs.push("-_dh(&)&+ 5.3.1.4(23:0) ~D~_~D~_~H~_''v~");

// 5.3.2.1-4
figs.push("+^dh(&)&+ 5.3.2.1(24:0) ~d~_~D~_~h~_''v~");
figs.push("-^dh(&)&- 5.3.2.2(22:0) ~D~_~d~_~H~_''V~");
figs.push("+^dh(&)&- 5.3.2.3(25:0) ~d~_~D~_~h~_''V~");
figs.push("-^dh(&)&+ 5.3.2.4(21:0) ~D~_~d~_~H~_''v~");

// 5.3.3.1-4
figs.push("+&hd(&)_+ 5.3.3.1(18:0) ~v~_~h~_''d~_~d~");
figs.push("-&hd(&)_- 5.3.3.2(24:0) ~V~_~H~_''D~_~D~");
figs.push("+&hd(&)_- 5.3.3.3(20:0) ~v~_~h~_''D~_~D~");
figs.push("-&hd(&)_+ 5.3.3.4(23:0) ~V~_~H~_''d~_~d~");

// 5.3.4.1-4
figs.push("+&hd(&)^+ 5.3.4.1(20:0) ~v~_~h~_''D~_~d~");
figs.push("-&hd(&)^- 5.3.4.2(25:0) ~V~_~H~_''d~_~D~");
figs.push("+&hd(&)^- 5.3.4.3(20:0) ~v~_~h~_''d~_~D~");
figs.push("-&hd(&)^+ 5.3.4.4(25:0) ~V~_~H~_''D~_~d~");

// Family 5.4. Four Line Stall Turns
figs.push("F5.4 Four line Stall Turns");

// 5.4.1.1-4
figs.push("+_dhd(&)(&)_+ 5.4.1.1(19:0) ~d~_~d~_~h~_''d~_~d~");
figs.push("-_dhd(&)(&)_- 5.4.1.2(26:0) ~D~_~D~_~H~_''D~_~D~");
figs.push("+_dhd(&)(&)_- 5.4.1.3(21:0) ~d~_~d~_~h~_''D~_~D~");
figs.push("-_dhd(&)(&)_+ 5.4.1.4(24:0) ~D~_~D~_~H~_''d~_~d~");

// 5.4.2.1-4
figs.push("+_dhd(&)(&)^+ 5.4.2.1(21:0) ~d~_~d~_~h~_''D~_~d~");
figs.push("-_dhd(&)(&)^- 5.4.2.2(27:0) ~D~_~D~_~H~_''d~_~D~");
figs.push("+_dhd(&)(&)^- 5.4.2.3(22:0) ~d~_~d~_~h~_''d~_~D~");
figs.push("-_dhd(&)(&)^+ 5.4.2.4(26:0) ~D~_~D~_~H~_''D~_~d~");

// 5.4.3.1-4
figs.push("+^dhd(&)(&)_+ 5.4.3.1(25:0) ~d~_~D~_~h~_''d~_~d~");
figs.push("-^dhd(&)(&)_- 5.4.3.2(23:0) ~D~_~d~_~H~_''D~_~D~");
figs.push("+^dhd(&)(&)_- 5.4.3.3(26:0) ~d~_~D~_~h~_''D~_~D~");
figs.push("-^dhd(&)(&)_+ 5.4.3.4(22:0) ~D~_~d~_~H~_''d~_~d~");

// 5.4.4.1-4
figs.push("+^dhd(&)(&)^+ 5.4.4.1(27:0) ~d~_~D~_~h~_''D~_~d~");
figs.push("-^dhd(&)(&)^- 5.4.4.2(24:0) ~D~_~d~_~H~_''d~_~D~");
figs.push("+^dhd(&)(&)^- 5.4.4.3(27:0) ~d~_~D~_~h~_''d~_~D~");
figs.push("-^dhd(&)(&)^+ 5.4.4.4(24:0) ~D~_~d~_~H~_''D~_~d~");

//
// Family 6. Tail Slides
//
figs.push("F6 Tail Slides");

// Family 6.2. Two Line Tail Slides

// 6.2.1.1-4
figs.push("+&ta&+ 6.2.1.1(15:17) ~~v''_''~t~~_''v~~");
figs.push("-&ta&- 6.2.1.2(18:23) ~~V''_''~t~~_''V~~");
figs.push("+&ta&- 6.2.1.3(16:18) ~~v''_''~t~~_''V~~");
figs.push("-&ta&+ 6.2.1.4(17:22) ~~V''_''~t~~_''v~~");

// 6.2.2.1-4
figs.push("+&ita&+ 6.2.2.1(15:17) ~~v''_''~T~~_''v~~");
figs.push("-&ita&- 6.2.2.2(18:23) ~~V''_''~T~~_''V~~");
figs.push("+&ita&- 6.2.2.3(16:18) ~~v''_''~T~~_''V~~");
figs.push("-&ita&+ 6.2.2.4(17:22) ~~V''_''~T~~_''v~~");


//
// Family 7. Loops and Eights
//

// Family 7.2. Half Loops
figs.push("F7.2 Half Loops");

// 7.2.1.1-4
figs.push("+_m_- 7.2.1.1(6) ~_m_~");
figs.push("-_m_+ 7.2.1.2(8) ~_M_~");
figs.push("+_a_- 7.2.1.3(8) ~_M_~");
figs.push("-_a_+ 7.2.1.4(6) ~_m_~");

// 7.2.2.1-4
figs.push("+_m^+ 7.2.2.1(6) ~_m_~");
figs.push("-_m^- 7.2.2.2(9) ~_M_~");
figs.push("+_a^+ 7.2.2.3(8) ~_M_~");
figs.push("-_a^- 7.2.2.4(7) ~_m_~");

// 7.2.3.1-4
figs.push("+^m_+ 7.2.3.1(8) ~_M_~");
figs.push("-^m_- 7.2.3.2(7) ~_m_~");
figs.push("+^a_+ 7.2.3.3(6) ~_m_~");
figs.push("-^a_- 7.2.3.4(9) ~_M_~");

// 7.2.4.1-4
figs.push("+^m^- 7.2.4.1(8) ~_M_~");
figs.push("-^m^+ 7.2.4.2(6) ~_m_~");
figs.push("+^a^- 7.2.4.3(6) ~_m_~");
figs.push("-^a^+ 7.2.4.4(8) ~_M_~");

// Family 7.3. Three-Quarter Loops
figs.push("F7.3 Three-Quarter Loops");

// 7.3.1.1-4
figs.push("+_g_- 7.3.1.1(16) ~d~~_''P~~_''d~");
figs.push("-_g_+ 7.3.1.2(14) ~D~~_''p~~_''D~");
figs.push("+_ig_- 7.3.1.3(14) ~D~~_''p~~_''D~");
figs.push("-_ig_+ 7.3.1.4(16) ~d~~_''P~~_''d~");

// 7.3.2.1-4
figs.push("+^g_+ 7.3.2.1(14) ~d~~_''p~~_''D~");
figs.push("-^g_- 7.3.2.2(18) ~D~~_''P~~_''d~");
figs.push("+^ig_+ 7.3.2.3(17) ~D~~_''P~~_''d~");
figs.push("-^ig_- 7.3.2.4(15) ~d~~_''p~~_''D~");

// 7.3.3.1-4
figs.push("+_g^+ 7.3.3.1(17) ~d~~_''P~~_''D~");
figs.push("-_g^- 7.3.3.2(15) ~D~~_''p~~_''d~");
figs.push("+_ig^+ 7.3.3.3(14) ~D~~_''p~~_''d~");
figs.push("-_ig^- 7.3.3.4(18) ~d~~_''P~~_''D~");

// 7.3.4.1-4
figs.push("+^g^- 7.3.4.1(16) ~d~~_''p~~_''d~");
figs.push("-^g^+ 7.3.4.2(20) ~D~~_''P~~_''D~");
figs.push("+^ig^- 7.3.4.3(19) ~D~~_''P~~_''D~");
figs.push("-^ig^+ 7.3.4.4(15) ~d~~_''p~~_''d~");

// Family 7.4. Whole Loops
figs.push("F7.4 Whole Loops");

// 7.4.1.1-4
figs.push("+o_+ 7.4.1.1(10) ~''o!_''~");
figs.push("-o_- 7.4.1.2(15) ~''O!_''~");
figs.push("+io_+ 7.4.1.3(14) ~''O!_''~");
figs.push("-io_- 7.4.1.4(11) ~''o!_''~");

// 7.4.2.1-4
figs.push("+o^- 7.4.2.1(12) ~''o!_''~");
figs.push("-o^+ 7.4.2.2(12) ~''O!_''~");
figs.push("+io^- 7.4.2.3(12) ~''O!_''~");
figs.push("-io^+ 7.4.2.4(12) ~''o!_''~");

// 7.4.3.1-4
figs.push("+qo_+ 7.4.3.1(14) ~~~v~~v~_~v~~v~~~");
figs.push("-qo_- 7.4.3.2(19) ~~~V~~V~_~V~~V~~~");
figs.push("+iqo_+ 7.4.3.3(18) ~~~V~~V~_~V~~V~~~");
figs.push("-iqo_- 7.4.3.4(14) ~~~v~~v~_~v~~v~~~");

// 7.4.4.1-4
figs.push("+qo^- 7.4.4.1(17) ~~~v~~v~_~V~~''V~~~");
figs.push("-qo^+ 7.4.4.2(17) ~~~V~~V~_~v~~''v~~~");
figs.push("+iqo^- 7.4.4.3(17) ~~~V~~V~_~v~~''v~~~");
figs.push("-iqo^+ 7.4.4.4(17) ~~~v~~v~_~V~~''V~~~");

// 7.4.5.1-4
figs.push("+_dq_+ 7.4.5.1(15) ~~d~_~v~~v~_~v~~d~~");
figs.push("-_dq_- 7.4.5.2(20) ~~D~_~V~~V~_~V~~D~~");
figs.push("+_idq_+ 7.4.5.3(19) ~~D~_~V~~V~_~V~~D~~");
figs.push("-_idq_- 7.4.5.4(16) ~~d~_~v~~v~_~v~~d~~");

// 7.4.6.1-4
figs.push("+qq+ 7.4.6.1(19) ~~d~d~d~d~d~d~d~d~~");
figs.push("-qq- 7.4.6.2(24) ~~D~D~D~D~D~D~D~D~~");
figs.push("+iqq+ 7.4.6.3(24:0) ~~D~D~D~D~D~D~D~D~~");
figs.push("-iqq- 7.4.6.4(19:0) ~~d~d~d~d~d~d~d~d~~");

// Family 7.4. (cont) Reversing Whole Loops
// New for 2012 - coded by Wouter Liefting
// coded as "ao" (Alternating O) when the reverse is after 3/4 loop,
// and as "rao" (Rev Alternating O) when the reverse is after 1/4 loop.
figs.push("F7.4 Reversing Whole Loops");

// 7.4.7.1-4
figs.push("+_ao(_)_- 7.4.7.1(11) ~_v=m!_V=_~");
figs.push("-_ao(_)_+ 7.4.7.2(13) ~_V=M!_v=_~");
figs.push("+_iao(_)_- 7.4.7.3(13) ~_V=M!_v=_~");
figs.push("-_iao(_)_+ 7.4.7.4(11) ~_v=m!_V=_~");

// 7.4.8.1-4
figs.push("+_ao(_)^+ 7.4.8.1(11) ~_v=m!_V=_~");
figs.push("-_ao(_)^- 7.4.8.2(14) ~_V=M!_v=_~");
figs.push("+_iao(_)^+ 7.4.8.3(13) ~_V=M!_v=_~");
figs.push("-_iao(_)^- 7.4.8.4(12) ~_v=m!_V=_~");

// 7.4.9.1-4
figs.push("+^ao(_)_+ 7.4.9.1(13) ~_V=M!_v=_~");
figs.push("-^ao(_)_- 7.4.9.2(12) ~_v=m!_V=_~");
figs.push("+^iao(_)_+ 7.4.9.3(11) ~_v=m!_V=_~");
figs.push("-^iao(_)_- 7.4.9.4(14) ~_V=M!_v=_~");

// 7.4.10.1-4
figs.push("+^ao(_)^- 7.4.10.1(13) ~_V=M!_v=_~");
figs.push("-^ao(_)^+ 7.4.10.2(11) ~_v=m!_V=_~");
figs.push("+^iao(_)^- 7.4.10.3(11) ~_v=m!_V=_~");
figs.push("-^iao(_)^+ 7.4.10.4(13) ~_V=M!_v=_~");

// 7.4.11.1-4
figs.push("+_rao(_)_- 7.4.11.1(13) ~_v=M!_V=_~");
figs.push("-_rao(_)_+ 7.4.11.2(11) ~_V=m!_v=_~");
figs.push("+_irao(_)_- 7.4.11.3(11) ~_V=m!_v=_~");
figs.push("-_irao(_)_+ 7.4.11.4(13) ~_v=M!_V=_~");

// 7.4.12.1-4
figs.push("+_rao(_)^+ 7.4.12.1(13) ~_v=M!_V=_~");
figs.push("-_rao(_)^- 7.4.12.2(12) ~_V=m!_v=_~");
figs.push("+_irao(_)^+ 7.4.12.3(11) ~_V=m!_v=_~");
figs.push("-_irao(_)^- 7.4.12.4(14) ~_v=M!_V=_~");

// 7.4.13.1-4
figs.push("+^rao(_)_- 7.4.13.1(11) ~_V=m!_v=_~");
figs.push("-^rao(_)_+ 7.4.13.2(14) ~_v=M!_V=_~");
figs.push("+^irao(_)_- 7.4.13.3(13) ~_v=M!_V=_~");
figs.push("-^irao(_)_+ 7.4.13.4(12) ~_V=m!_v=_~");

// 7.4.14.1-4
figs.push("+^rao(_)^- 7.4.14.1(11) ~_V=m!_v=_~");
figs.push("-^rao(_)^+ 7.4.14.2(13) ~_v=M!_V=_~");
figs.push("+^irao(_)^- 7.4.14.3(13) ~_v=M!_V=_~");
figs.push("-^irao(_)^+ 7.4.14.4(11) ~_V=m!_v=_~");

// PREVIOUS CODING KEPT FOR BACKWARD COMPATIBILITY
// Family 7.4. (cont) Reversing Whole Loops
// New for 2012 - coded by Wouter Liefting
// coded as "or" when the reverse is after 3/4 loop,
// and as "ro" when the reverse is after 1/4 loop.

// 7.4.7.1-4
figs.push("+_or(_)_- 7.4.7.1(11) ~_v=m!_V=_~");
figs.push("-_or(_)_+ 7.4.7.2(13) ~_V=M!_v=_~");
figs.push("+_ior(_)_- 7.4.7.3(13) ~_V=M!_v=_~");
figs.push("-_ior(_)_+ 7.4.7.4(11) ~_v=m!_V=_~");

// 7.4.8.1-4
figs.push("+_or(_)^+ 7.4.8.1(11) ~_v=m!_V=_~");
figs.push("-_or(_)^- 7.4.8.2(14) ~_V=M!_v=_~");
figs.push("+_ior(_)^+ 7.4.8.3(13) ~_V=M!_v=_~");
figs.push("-_ior(_)^- 7.4.8.4(12) ~_v=m!_V=_~");

// 7.4.9.1-4
figs.push("+^or(_)_+ 7.4.9.1(13) ~_V=M!_v=_~");
figs.push("-^or(_)_- 7.4.9.2(12) ~_v=m!_V=_~");
figs.push("+^ior(_)_+ 7.4.9.3(11) ~_v=m!_V=_~");
figs.push("-^ior(_)_- 7.4.9.4(14) ~_V=M!_v=_~");

// 7.4.10.1-4
figs.push("+^or(_)^- 7.4.10.1(13) ~_V=M!_v=_~");
figs.push("-^or(_)^+ 7.4.10.2(11) ~_v=m!_V=_~");
figs.push("+^ior(_)^- 7.4.10.3(11) ~_v=m!_V=_~");
figs.push("-^ior(_)^+ 7.4.10.4(13) ~_V=M!_v=_~");

// 7.4.11.1-4
figs.push("+_ro(_)_- 7.4.11.1(13) ~_v=M!_V=_~");
figs.push("-_ro(_)_+ 7.4.11.2(11) ~_V=m!_v=_~");
figs.push("+_iro(_)_- 7.4.11.3(11) ~_V=m!_v=_~");
figs.push("-_iro(_)_+ 7.4.11.4(13) ~_v=M!_V=_~");

// 7.4.12.1-4
figs.push("+_ro(_)^+ 7.4.12.1(13) ~_v=M!_V=_~");
figs.push("-_ro(_)^- 7.4.12.2(12) ~_V=m!_v=_~");
figs.push("+_iro(_)^+ 7.4.12.3(11) ~_V=m!_v=_~");
figs.push("-_iro(_)^- 7.4.12.4(14) ~_v=M!_V=_~");

// 7.4.13.1-4
figs.push("+^ro(_)_- 7.4.13.1(11) ~_V=m!_v=_~");
figs.push("-^ro(_)_+ 7.4.13.2(14) ~_v=M!_V=_~");
figs.push("+^iro(_)_- 7.4.13.3(13) ~_v=M!_V=_~");
figs.push("-^iro(_)_+ 7.4.13.4(12) ~_V=m!_v=_~");

// 7.4.14.1-4
figs.push("+^ro(_)^- 7.4.14.1(11) ~_V=m!_v=_~");
figs.push("-^ro(_)^+ 7.4.14.2(13) ~_v=M!_V=_~");
figs.push("+^iro(_)^- 7.4.14.3(13) ~_v=M!_V=_~");
figs.push("-^iro(_)^+ 7.4.14.4(11) ~_V=m!_v=_~");

// Family 7.5. Horizontal Ss
// New for 2012 - coded by Wouter Liefting
// coded as "ac" - for Alternating Cuban
figs.push("F7.5 Horizontal \"S\"s");

// 7.5.1.1-4
figs.push("+_ac(_)_+ 7.5.1.1(16) ~~~~_c'''_'''C_~~~~");
figs.push("-_ac(_)_- 7.5.1.2(16) ~~~~_C'''_'''c_~~~~");
figs.push("+_iac(_)_+ 7.5.1.3(16) ~~~~_C'''_'''c_~~~~");
figs.push("-_iac(_)_- 7.5.1.4(16) ~~~~_c'''_'''C_~~~~");

// 7.5.2.1-4
figs.push("+_ac(^)_- 7.5.2.1(15) ~~~~_c'''_'''c_~~~~");
figs.push("-_ac(^)_+ 7.5.2.2(20) ~~~~_C'''_'''C_~~~~");
figs.push("+_iac(^)_- 7.5.2.3(20) ~~~~_C'''_'''C_~~~~");
figs.push("-_iac(^)_+ 7.5.2.4(15) ~~~~_c'''_'''c_~~~~");

// 7.5.3.1-4
figs.push("+^ac(_)_- 7.5.3.1(16) ~~~~_C'''_'''c_~~~~");
figs.push("-^ac(_)_+ 7.5.3.2(16) ~~~~_c'''_'''C_~~~~");
figs.push("+^iac(_)_- 7.5.3.3(16) ~~~~_c'''_'''C_~~~~");
figs.push("-^iac(_)_+ 7.5.3.4(16) ~~~~_C'''_'''c_~~~~");

// 7.5.4.1-4
figs.push("+_ac(_)^- 7.5.4.1(16) ~~~~_c'''_'''C_~~~~");
figs.push("-_ac(_)^+ 7.5.4.2(16) ~~~~_C'''_'''c_~~~~");
figs.push("+_iac(_)^- 7.5.4.3(16) ~~~~_C'''_'''c_~~~~");
figs.push("-_iac(_)^+ 7.5.4.4(16) ~~~~_c'''_'''C_~~~~");

// 7.5.5.1-4
figs.push("+^ac(^)_+ 7.5.5.1(20) ~~~~_C'''_'''C_~~~~");
figs.push("-^ac(^)_- 7.5.5.2(15) ~~~~_c'''_'''c_~~~~");
figs.push("+^iac(^)_+ 7.5.5.3(15) ~~~~_c'''_'''c_~~~~");
figs.push("-^iac(^)_- 7.5.5.4(20) ~~~~_C'''_'''C_~~~~");

// 7.5.6.1-4
figs.push("+^ac(_)^+ 7.5.6.1(16) ~~~~_C'''_'''c_~~~~");
figs.push("-^ac(_)^- 7.5.6.2(17) ~~~~_c'''_'''C_~~~~");
figs.push("+^iac(_)^+ 7.5.6.3(16) ~~~~_c'''_'''C_~~~~");
figs.push("-^iac(_)^- 7.5.6.4(17) ~~~~_C'''_'''c_~~~~");

// 7.5.7.1-4
figs.push("+_ac(^)^+ 7.5.7.1(15) ~~~~_c'''_'''c_~~~~");
figs.push("-_ac(^)^- 7.5.7.2(20) ~~~~_C'''_'''C_~~~~");
figs.push("+_iac(^)^+ 7.5.7.3(20) ~~~~_C'''_'''C_~~~~");
figs.push("-_iac(^)^- 7.5.7.4(15) ~~~~_c'''_'''c_~~~~");

// 7.5.8.1-4
figs.push("+^ac(^)^- 7.5.8.1(20) ~~~~_C'''_'''C_~~~~");
figs.push("-^ac(^)^+ 7.5.8.2(15) ~~~~_c'''_'''c_~~~~");
figs.push("+^iac(^)^- 7.5.8.3(15) ~~~~_c'''_'''c_~~~~");
figs.push("-^iac(^)^+ 7.5.8.4(20) ~~~~_C'''_'''C_~~~~");

// PREVIOUS CODING KEPT FOR BACKWARD COMPATIBILITY
// Family 7.5. Horizontal Ss
// New for 2012 - coded by Wouter Liefting
// coded as "cm" - for Cuban iMmelmann

// 7.5.1.1-4
figs.push("+_cm(_)_+ 7.5.1.1(16) ~~~~_c'''_'''C_~~~~");
figs.push("-_cm(_)_- 7.5.1.2(16) ~~~~_C'''_'''c_~~~~");
figs.push("+_icm(_)_+ 7.5.1.3(16) ~~~~_C'''_'''c_~~~~");
figs.push("-_icm(_)_- 7.5.1.4(16) ~~~~_c'''_'''C_~~~~");

// 7.5.2.1-4
figs.push("+_cm(^)_- 7.5.2.1(15) ~~~~_c'''_'''c_~~~~");
figs.push("-_cm(^)_+ 7.5.2.2(20) ~~~~_C'''_'''C_~~~~");
figs.push("+_icm(^)_- 7.5.2.3(20) ~~~~_C'''_'''C_~~~~");
figs.push("-_icm(^)_+ 7.5.2.4(15) ~~~~_c'''_'''c_~~~~");

// 7.5.3.1-4
figs.push("+^cm(_)_- 7.5.3.1(16) ~~~~_C'''_'''c_~~~~");
figs.push("-^cm(_)_+ 7.5.3.2(16) ~~~~_c'''_'''C_~~~~");
figs.push("+^icm(_)_- 7.5.3.3(16) ~~~~_c'''_'''C_~~~~");
figs.push("-^icm(_)_+ 7.5.3.4(16) ~~~~_C'''_'''c_~~~~");

// 7.5.4.1-4
figs.push("+_cm(_)^- 7.5.4.1(16) ~~~~_c'''_'''C_~~~~");
figs.push("-_cm(_)^+ 7.5.4.2(16) ~~~~_C'''_'''c_~~~~");
figs.push("+_icm(_)^- 7.5.4.3(16) ~~~~_C'''_'''c_~~~~");
figs.push("-_icm(_)^+ 7.5.4.4(16) ~~~~_c'''_'''C_~~~~");

// 7.5.5.1-4
figs.push("+^cm(^)_+ 7.5.5.1(20) ~~~~_C'''_'''C_~~~~");
figs.push("-^cm(^)_- 7.5.5.2(15) ~~~~_c'''_'''c_~~~~");
figs.push("+^icm(^)_+ 7.5.5.3(15) ~~~~_c'''_'''c_~~~~");
figs.push("-^icm(^)_- 7.5.5.4(20) ~~~~_C'''_'''C_~~~~");

// 7.5.6.1-4
figs.push("+^cm(_)^+ 7.5.6.1(16) ~~~~_C'''_'''c_~~~~");
figs.push("-^cm(_)^- 7.5.6.2(17) ~~~~_c'''_'''C_~~~~");
figs.push("+^icm(_)^+ 7.5.6.3(16) ~~~~_c'''_'''C_~~~~");
figs.push("-^icm(_)^- 7.5.6.4(17) ~~~~_C'''_'''c_~~~~");

// 7.5.7.1-4
figs.push("+_cm(^)^+ 7.5.7.1(15) ~~~~_c'''_'''c_~~~~");
figs.push("-_cm(^)^- 7.5.7.2(20) ~~~~_C'''_'''C_~~~~");
figs.push("+_icm(^)^+ 7.5.7.3(20) ~~~~_C'''_'''C_~~~~");
figs.push("-_icm(^)^- 7.5.7.4(15) ~~~~_c'''_'''c_~~~~");

// 7.5.8.1-4
figs.push("+^cm(^)^- 7.5.8.1(20) ~~~~_C'''_'''C_~~~~");
figs.push("-^cm(^)^+ 7.5.8.2(15) ~~~~_c'''_'''c_~~~~");
figs.push("+^icm(^)^- 7.5.8.3(15) ~~~~_c'''_'''c_~~~~");
figs.push("-^icm(^)^+ 7.5.8.4(20) ~~~~_C'''_'''C_~~~~");


// Family 7.5. (cont) Vertical Ss
figs.push("F7.5 Vertical \"S\"s");

// 7.5.9.1-4
figs.push("+mm+ 7.5.9.1(12:0) ~~mM~~");
figs.push("-mm- 7.5.9.2(13:0) ~~Mm~~");
figs.push("+imm+ 7.5.9.3(12:0) ~~Mm~~");
figs.push("-imm- 7.5.9.4(13:0) ~~mM~~");

// 7.5.10.1-4
figs.push("+mm^- 7.5.10.1(10:0) ~~m_m~~");
figs.push("-mm^+ 7.5.10.2(14:0) ~~M_M~~");
figs.push("+imm^- 7.5.10.3(14:0) ~~M_M~~");
figs.push("-imm^+ 7.5.10.4(10:0) ~~m_m~~");

// Family 7.8. Horizontal 8s
figs.push("F7.8 Horizontal \"8\"s");

// 7.8.1.1-4
figs.push("+_cc(_)_+ 7.8.1.1(20) ~~~~_c''_''~P''_~~''d~~");
figs.push("-_cc(_)_- 7.8.1.2(20) ~~~~_C''_''~p''_~~''D~~");
figs.push("+_icc(_)_+ 7.8.1.3(20) ~~~~_C''_''~p''_~~''D~~");
figs.push("-_icc(_)_- 7.8.1.4(20) ~~~~_c''_''~P''_~~''d~~");

// 7.8.2.1-4
figs.push("+_cc(_)^- 7.8.2.1(22) ~~~~_c''_''~P''_~~''D~~");
figs.push("-_cc(_)^+ 7.8.2.2(20) ~~~~_C''_''~p''_~~''d~~");
figs.push("+_icc(_)^- 7.8.2.3(21) ~~~~_C''_''~p''_~~''d~~");
figs.push("-_icc(_)^+ 7.8.2.4(22) ~~~~_c''_''~P''_~~''D~~");

// 7.8.3.1-4
figs.push("+_cc(^)_- 7.8.3.1(19) ~~~~_c''_''~p''_~~''D~~");
figs.push("-_cc(^)_+ 7.8.3.2(23) ~~~~_C''_''~P''_~~''d~~");
figs.push("+_icc(^)_- 7.8.3.3(24) ~~~~_C''_''~P''_~~''d~~");
figs.push("-_icc(^)_+ 7.8.3.4(19) ~~~~_c''_''~p''_~~''D~~");

// 7.8.4.1-4
figs.push("+_cc(^)^+ 7.8.4.1(19) ~~~~_c''_''~p''_~~''d~~");
figs.push("-_cc(^)^- 7.8.4.2(26) ~~~~_C''_''~P''_~~''D~~");
figs.push("+_icc(^)^+ 7.8.4.3(25) ~~~~_C''_''~P''_~~''D~~");
figs.push("-_icc(^)^- 7.8.4.4(20) ~~~~_c''_''~p''_~~''d~~");

// 7.8.5.1-4
figs.push("+_rcc(_)_+ 7.8.5.1(20) ~~d''''_~~P''_''~c_~~~~");
figs.push("-_rcc(_)_- 7.8.5.2(20) ~~D''''_~~p''_''~C_~~~~");
figs.push("+_ircc(_)_+ 7.8.5.3(20) ~~D''''_~~p''_''~C_~~~~");
figs.push("-_ircc(_)_- 7.8.5.4(20) ~~d''''_~~P''_''~c_~~~~");

// 7.8.6.1-4
figs.push("+_rcc(^)_- 7.8.6.1(24) ~~d''''_~~P''_''~C_~~~~");
figs.push("-_rcc(^)_+ 7.8.6.2(19) ~~D''''_~~p''_''~c_~~~~");
figs.push("+_ircc(^)_- 7.8.6.3(18) ~~D''''_~~p''_''~c_~~~~");
figs.push("-_ircc(^)_+ 7.8.6.4(24) ~~d''''_~~P''_''~C_~~~~");

// 7.8.7.1-4
figs.push("+^rcc(_)_- 7.8.7.1(21) ~~d''''_~~p''_''~C_~~~~");
figs.push("-^rcc(_)_+ 7.8.7.2(22) ~~D''''_~~P''_''~c_~~~~");
figs.push("+^ircc(_)_- 7.8.7.3(21) ~~D''''_~~P''_''~c_~~~~");
figs.push("-^ircc(_)_+ 7.8.7.4(21) ~~d''''_~~p''_''~C_~~~~");

// 7.8.8.1-4
figs.push("+^rcc(^)_+ 7.8.8.1(19) ~~d''''_~~p''_''~c_~~~~");
figs.push("-^rcc(^)_- 7.8.8.2(26) ~~D''''_~~P''_''~C_~~~~");
figs.push("+^ircc(^)_+ 7.8.8.3(25) ~~D''''_~~P''_''~C_~~~~");
figs.push("-^ircc(^)_- 7.8.8.4(20) ~~d''''_~~p''_''~c_~~~~");

// Family 7.8. (cont) Horizontal Super 8s
figs.push("F7.8 Horizontal Super \"8\"s");

// 7.8.9.1-4
figs.push("+_gg(_)_+ 7.8.9.1(23) ~~d''_''~P~''_''~p~~''_''D~~");
figs.push("-_gg(_)_- 7.8.9.2(24) ~~D''_''~p~''_''~P~~''_''d~~");
figs.push("+_igg(_)_+ 7.8.9.3(23) ~~D''_''~p~''_''~P~~''_''d~~");
figs.push("-_igg(_)_- 7.8.9.4(24) ~~d''_''~P~''_''~p~~''_''D~~");

// 7.8.10.1-4
figs.push("+^gg(_)_- 7.8.10.1(25) ~~d''_''~p~''_''~P~~''_''d~~");
figs.push("-^gg(_)_+ 7.8.10.2(26) ~~D''_''~P~''_''~p~~''_''D~~");
figs.push("+^igg(_)_- 7.8.10.3(25) ~~D''_''~P~''_''~p~~''_''D~~");
figs.push("-^igg(_)_+ 7.8.10.4(24) ~~d''_''~p~''_''~P~~''_''d~~");

// 7.8.11.1-4
figs.push("+_gg(^)_- 7.8.11.1(28) ~~d''_''~P~''_''~P~~''_''d~~");
figs.push("-_gg(^)_+ 7.8.11.2(23) ~~D''_''~p~''_''~p~~''_''D~~");
figs.push("+_igg(^)_- 7.8.11.3(22) ~~D''_''~p~''_''~p~~''_''D~~");
figs.push("-_igg(^)_+ 7.8.11.4(27) ~~d''_''~P~''_''~P~~''_''d~~");

// 7.8.12.1-4
figs.push("+_gg(_)^- 7.8.12.1(25) ~~d''_''~P~''_''~p~~''_''d~~");
figs.push("-_gg(_)^+ 7.8.12.2(26) ~~D''_''~p~''_''~P~~''_''D~~");
figs.push("+_igg(_)^- 7.8.12.3(25) ~~D''_''~p~''_''~P~~''_''D~~");
figs.push("-_igg(_)^+ 7.8.12.4(24) ~~d''_''~P~''_''~p~~''_''d~~");

// 7.8.13.1-4
figs.push("+^gg(^)_+ 7.8.13.1(23) ~~d''_''~p~''_''~p~~''_''D~~");
figs.push("-^gg(^)_- 7.8.13.2(30) ~~D''_''~P~''_''~P~~''_''d~~");
figs.push("+^igg(^)_+ 7.8.13.3(29) ~~D''_''~P~''_''~P~~''_''d~~");
figs.push("-^igg(^)_- 7.8.13.4(24) ~~d''_''~p~''_''~p~~''_''D~~");

// 7.8.14.1-4
figs.push("+^gg(_)^+ 7.8.14.1(26) ~~d''_''~p~''_''~P~~''_''D~~");
figs.push("-^gg(_)^- 7.8.14.2(27) ~~D''_''~P~''_''~p~~''_''d~~");
figs.push("+^igg(_)^+ 7.8.14.3(26) ~~D''_''~P~''_''~p~~''_''d~~");
figs.push("-^igg(_)^- 7.8.14.4(27) ~~d''_''~p~''_''~P~~''_''D~~");

// 7.8.15.1-4
figs.push("+_gg(^)^+ 7.8.15.1(29) ~~d''_''~P~''_''~P~~''_''D~~");
figs.push("-_gg(^)^- 7.8.15.2(24) ~~D''_''~p~''_''~p~~''_''d~~");
figs.push("+_igg(^)^+ 7.8.15.3(23) ~~D''_''~p~''_''~p~~''_''d~~");
figs.push("-_igg(^)^- 7.8.15.4(30) ~~d''_''~P~''_''~P~~''_''D~~");

// 7.8.16.1-4
figs.push("+^gg(^)^- 7.8.16.1(25) ~~d''_''~p~''_''~p~~''_''d~~");
figs.push("-^gg(^)^+ 7.8.16.2(31) ~~D''_''~P~''_''~P~~''_''D~~");
figs.push("+^igg(^)^- 7.8.16.3(31) ~~D''_''~P~''_''~P~~''_''D~~");
figs.push("-^igg(^)^+ 7.8.16.4(24) ~~d''_''~p~''_''~p~~''_''d~~");

// Family 7.8. (cont) Vertical 8s
figs.push("F7.8 Vertical \"8\"s");

// 7.8.17.1-4
figs.push("+oo+ 7.8.17.1(22:0) ~mOm~");
figs.push("-oo- 7.8.17.2(23:0) ~MoM~");
figs.push("+ioo+ 7.8.17.3(22:0) ~MoM~");
figs.push("-ioo- 7.8.17.4(23:0) ~mOm~");

// 7.8.18.1-4
figs.push("+^oo- 7.8.18.1(20:0) ~m_oM~");
figs.push("-^oo+ 7.8.18.2(24:0) ~M_Om~");
figs.push("+^ioo- 7.8.18.3(24:0) ~M_Om~");
figs.push("-^ioo+ 7.8.18.4(20:0) ~m_oM~");

// 7.8.19.1-4
figs.push("+oo^- 7.8.19.1(24:0) ~mO_M~");
figs.push("-oo^+ 7.8.19.2(20:0) ~Mo_m~");
figs.push("+ioo^- 7.8.19.3(20:0) ~Mo_m~");
figs.push("-ioo^+ 7.8.19.4(24:0) ~mO_M~");

// 7.8.20.1-4
figs.push("+^oo^+ 7.8.20.1(18:0) ~m_o_m~");
figs.push("-^oo^- 7.8.20.2(27:0) ~M_O_M~");
figs.push("+^ioo^+ 7.8.20.3(26:0) ~M_O_M~");
figs.push("-^ioo^- 7.8.20.4(19:0) ~m_o_m~");

// 7.8.21.1-4
figs.push("+ooo+ 7.8.21.1(22:0) ~oO~");
figs.push("-ooo- 7.8.21.2(23:0) ~Oo~");
figs.push("+iooo+ 7.8.21.3(22:0) ~O''o~");
figs.push("-iooo- 7.8.21.4(23:0) ~o''O~");

// 7.8.22.1-4
figs.push("+ooo^+ 7.8.22.1(18:0) ~o_o~");
figs.push("-ooo^- 7.8.22.2(26:0) ~O_O~");
figs.push("+iooo^+ 7.8.22.3(26:0) ~O_''O~");
figs.push("-iooo^- 7.8.22.4(18:0) ~o_''o~");

//
// Family 8. Combinations of lines, angles and loops
//

// Family 8.4. Humpty Bumps
figs.push("F8.4 Humpty Bumps");

// 8.4.1.1-4
figs.push("+&b&+ 8.4.1.1(13) ~''v~''_''m/~''_~v''~");
figs.push("-&pb&- 8.4.1.2(18) -~''V~''_''M/~''_~V''~");
figs.push("+&ipb&+ 8.4.1.3(17) ~''V~''_''M/~''_~V''~");
figs.push("-&ib&- 8.4.1.4(13) -~''v~''_''m/~''_~v''~");

// 8.4.2.1-4
figs.push("+&b&- 8.4.2.1(14) ~''v~''_''m/~''_~V''~");
figs.push("-&pb&+ 8.4.2.2(17) -~''V~''_''M/~''_~v''~");
figs.push("+&ipb&- 8.4.2.3(17) ~''V~''_''M/~''_~v''~");
figs.push("-&ib&+ 8.4.2.4(14) -~''v~''_''m/~''_~V''~");

// 8.4.3.1-4
figs.push("+&pb&+ 8.4.3.1(15) ~''v~''_''M/~''_~v''~");
figs.push("-&b&- 8.4.3.2(16) -~''V~''_''m/~''_~V''~");
figs.push("+&ib&+ 8.4.3.3(15) ~''V~''_''m/~''_~V''~");
figs.push("-&ipb&- 8.4.3.4(16) -~''v~''_''M/~''_~v''~");

// 8.4.4.1-4
figs.push("+&pb&- 8.4.4.1(16) ~''v~''_''M/~''_~V''~");
figs.push("-&b&+ 8.4.4.2(14) -~''V~''_''m/~''_~v''~");
figs.push("+&ib&- 8.4.4.3(14) ~''V~''_''m/~''_~v''~");
figs.push("-&ipb&+ 8.4.4.4(16) -~''v~''_''M/~''_~V''~");

// Family 8.4. (cont) Diagonal Humpty Bumps
figs.push("F8.4 Diagonal Humpty Bumps");

// 8.4.5.1-4
figs.push("+_bz_+ 8.4.5.1(13:0) ~~~d~''_''m~''_~~z~~~~");
figs.push("-_bz_- 8.4.5.2(17:0) ~~~D~''_''M~''_~~Z~~~~");
figs.push("+_ibz_+ 8.4.5.3(17:0) ~~~D~''_''M~''_~~Z~~~~");
figs.push("-_ibz_- 8.4.5.4(13:0) ~~~d~''_''m~''_~~z~~~~");

// 8.4.6.1-4
figs.push("+_bz^- 8.4.6.1(15:0) ~~~d~''_''m~''_~~Z~~~~");
figs.push("-_bz^+ 8.4.6.2(17:0) ~~~D~''_''M~''_~~z~~~~");
figs.push("+_ibz^- 8.4.6.3(17:0) ~~~D~''_''M~''_~~z~~~~");
figs.push("-_ibz^+ 8.4.6.4(16:0) ~~~d~''_''m~''_~~Z~~~~");

// 8.4.7.1-4
figs.push("+^rbz_- 8.4.7.1(16:0) ~d~~_''m''_''~Z~~");
figs.push("-^rbz_+ 8.4.7.2(17:0) ~D~~_''M''_''~z~~");
figs.push("+^irbz_- 8.4.7.3(16:0) ~D~~_''M''_''~z~~");
figs.push("-^irbz_+ 8.4.7.4(16:0) ~d~~_''m''_''~Z~~");

// 8.4.8.1-4
figs.push("+^rbz^+ 8.4.8.1(15:0) ~d~~_''m''_''~z~~");
figs.push("-^rbz^- 8.4.8.2(20:0) ~D~~_''M''_''~Z~~");
figs.push("+^irbz^+ 8.4.8.3(19:0) ~D~~_''M''_''~Z~~");
figs.push("-^irbz^- 8.4.8.4(16:0) ~d~~_''m''_''~z~~");

// 8.4.9.1-4
figs.push("+_rbz_+ 8.4.9.1(15:0) ~d~~_''M''_''~z~~");
figs.push("-_rbz_- 8.4.9.2(15:0) ~D~~_''m''_''~Z~~");
figs.push("+_irbz_+ 8.4.9.3(15:0) ~D~~_''m''_''~Z~~");
figs.push("-_irbz_- 8.4.9.4(15:0) ~d~~_''M''_''~z~~");

// 8.4.10.1-4
figs.push("+_rbz^- 8.4.10.1(17:0) ~d~~_''M''_''~Z~~");
figs.push("-_rbz^+ 8.4.10.2(15:0) ~D~~_''m''_''~z~~");
figs.push("+_irbz^- 8.4.10.3(15:0) ~D~~_''m''_''~z~~");
figs.push("-_irbz^+ 8.4.10.4(18:0) ~d~~_''M''_''~Z~~");

// 8.4.11.1-4
figs.push("+^bz_- 8.4.11.1(18:0) ~~~d~''_''M~''_~~Z~~~~");
figs.push("-^bz_+ 8.4.11.2(15:0) ~~~D~''_''m~''_~~z~~~~");
figs.push("+^ibz_- 8.4.11.3(14:0) ~~~D~''_''m~''_~~z~~~~");
figs.push("-^ibz_+ 8.4.11.4(18:0) ~~~d~''_''M~''_~~Z~~~~");

// 8.4.12.1-4
figs.push("+^bz^+ 8.4.12.1(17:0) ~~~d~''_''M~''_~~z~~~~");
figs.push("-^bz^- 8.4.12.2(18:0) ~~~D~''_''m~''_~~Z~~~~");
figs.push("+^ibz^+ 8.4.12.3(17:0) ~~~D~''_''m~''_~~Z~~~~");
figs.push("-^ibz^- 8.4.12.4(18:0) ~~~d~''_''M~''_~~z~~~~");

// 8.4.13.1-4
figs.push("+_db_- 8.4.13.1(11) ~~~d~''_''m~''_''D~");
figs.push("-_db_+ 8.4.13.2(13) ~~~D~''_''M~''_''d~");
figs.push("+_idb_- 8.4.13.3(13) ~~~D~''_''M~''_''d~");
figs.push("-_idb_+ 8.4.13.4(11) ~~~d~''_''m~''_''D~");

// 8.4.14.1-4
figs.push("+_db^+ 8.4.14.1(12) ~~~d~''_''m~''_''d~");
figs.push("-_db^- 8.4.14.2(16) ~~~D~''_''M~''_''D~");
figs.push("+_idb^+ 8.4.14.3(15) ~~~D~''_''M~''_''D~");
figs.push("-_idb^- 8.4.14.4(13) ~~~d~''_''m~''_''d~");

// 8.4.15.1-4
figs.push("+^rdb_+ 8.4.15.1(12) ~d~''_''m~''_''d~~~");
figs.push("-^rdb_- 8.4.15.2(16) ~D~''_''M~''_''D~~~");
figs.push("+^irdb_+ 8.4.15.3(15) ~D~''_''M~''_''D~~~");
figs.push("-^irdb_- 8.4.15.4(13) ~d~''_''m~''_''d~~~");

// 8.4.16.1-4
figs.push("+^rdb^- 8.4.16.1(14) ~d~''_''m~''_''D~~~");
figs.push("-^rdb^+ 8.4.16.2(16) ~D~''_''M~''_''d~~~");
figs.push("+^irdb^- 8.4.16.3(16) ~D~''_''M~''_''d~~~");
figs.push("-^irdb^+ 8.4.16.4(14) ~d~''_''m~''_''D~~~");

// 8.4.17.1-4
figs.push("+_rdb_- 8.4.17.1(13) ~d~''_''M~''_''D~~~");
figs.push("-_rdb_+ 8.4.17.2(11) ~D~''_''m~''_''d~~~");
figs.push("+_irdb_- 8.4.17.3(11) ~D~''_''m~''_''d~~~");
figs.push("-_irdb_+ 8.4.17.4(13) ~d~''_''M~''_''D~~~");

// 8.4.18.1-4
figs.push("+_rdb^+ 8.4.18.1(14) ~d~''_''M~''_''d~~~");
figs.push("-_rdb^- 8.4.18.2(14) ~D~''_''m~''_''D~~~");
figs.push("+_irdb^+ 8.4.18.3(13) ~D~''_''m~''_''D~~~");
figs.push("-_irdb^- 8.4.18.4(15) ~d~''_''M~''_''d~~~");

// 8.4.19.1-4
figs.push("+^db_+ 8.4.19.1(14) ~~~d~''_''M~''_''d~");
figs.push("-^db_- 8.4.19.2(14) ~~~D~''_''m~''_''D~");
figs.push("+^idb_+ 8.4.19.3(13) ~~~D~''_''m~''_''D~");
figs.push("-^idb_- 8.4.19.4(15) ~~~d~''_''M~''_''d~");

// 8.4.20.1-4
figs.push("+^db^- 8.4.20.1(16) ~~~d~''_''M~''_''D~");
figs.push("-^db^+ 8.4.20.2(14) ~~~D~''_''m~''_''d~");
figs.push("+^idb^- 8.4.20.3(14) ~~~D~''_''m~''_''d~");
figs.push("-^idb^+ 8.4.20.4(16) ~~~d~''_''M~''_''D~");

// 8.4.21.1-4
figs.push("+_zb_+ 8.4.21.1(13:0) ~~~~z~''_''~m''_''~d''~");
figs.push("-_zb_- 8.4.21.2(17:0) ~~~~Z~''_''~M''_''~D''~");
figs.push("+_izb_+ 8.4.21.3(17:0) ~~~~Z~''_''~M''_''~D''~");
figs.push("-_izb_- 8.4.21.4(13:0) ~~~~z~''_''~m''_''~d''~");

// 8.4.22.1-4
figs.push("+_zb^- 8.4.22.1(15:0) ~~~~z~''_''~m''_''~D''~");
figs.push("-_zb^+ 8.4.22.2(17:0) ~~~~Z~''_''~M''_''~d''~");
figs.push("+_izb^- 8.4.22.3(18:0) ~~~~Z~''_''~M''_''~d''~");
figs.push("-_izb^+ 8.4.22.4(15:0) ~~~~z~''_''~m''_''~D''~");

// 8.4.23.1-4
figs.push("+^rzb_- 8.4.23.1(15:0) ~~z~''_''m~''_''~D''");
figs.push("-^rzb_+ 8.4.23.2(18:0) ~~Z~''_''M~''_''~d''");
figs.push("+^irzb_- 8.4.23.3(18:0) ~~Z~''_''M~''_''~d''");
figs.push("-^irzb_+ 8.4.23.4(14:0) ~~z~''_''m~''_''~D''");

// 8.4.24.1-4
figs.push("+^rzb^+ 8.4.24.1(15:0) ~~z~''_''m~''_''~d''");
figs.push("-^rzb^- 8.4.24.2(20:0) ~~Z~''_''M~''_''~D''");
figs.push("+^irzb^+ 8.4.24.3(19:0) ~~Z~''_''M~''_''~D''");
figs.push("-^irzb^- 8.4.24.4(16:0) ~~z~''_''m~''_''~d''");

// 8.4.25.1-4
figs.push("+_rzb_+ 8.4.25.1(15:0) ~~z~''_''M~''_''~d''");
figs.push("-_rzb_- 8.4.25.2(15:0) ~~Z~''_''m~''_''~D''");
figs.push("+_irzb_+ 8.4.25.3(15:0) ~~Z~''_''m~''_''~D''");
figs.push("-_irzb_- 8.4.25.4(15:0) ~~z~''_''M~''_''~d''");

// 8.4.26.1-4
figs.push("+_rzb^- 8.4.26.1(17:0) ~~z~''_''M~''_''~D''");
figs.push("-_rzb^+ 8.4.26.2(15:0) ~~Z~''_''m~''_''~d''");
figs.push("+_irzb^- 8.4.26.3(16:0) ~~Z~''_''m~''_''~d''");
figs.push("-_irzb^+ 8.4.26.4(17:0) ~~z~''_''M~''_''~D''");

// 8.4.27.1-4
figs.push("+^zb_- 8.4.27.1(17:0) ~~~~z~''_''~M''_''~D''~");
figs.push("-^zb_+ 8.4.27.2(16:0) ~~~~Z~''_''~m''_''~d''~");
figs.push("+^izb_- 8.4.27.3(16:0) ~~~~Z~''_''~m''_''~d''~");
figs.push("-^izb_+ 8.4.27.4(16:0) ~~~~z~''_''~M''_''~D''~");

// 8.4.28.1-4
figs.push("+^zb^+ 8.4.28.1(17:0) ~~~~z~''_''~M''_''~d''~");
figs.push("-^zb^- 8.4.28.2(18:0) ~~~~Z~''_''~m''_''~D''~");
figs.push("+^izb^+ 8.4.28.3(17:0) ~~~~Z~''_''~m''_''~D''~");
figs.push("-^izb^- 8.4.28.4(18:0) ~~~~z~''_''~M''_''~d''~");

// Family 8.5. Half Cubans
figs.push("F8.5 Half Cubans");

// 8.5.1.1-4
figs.push("+_rc_- 8.5.1.1(12) ~d~~''_~C_''~~~");
figs.push("-_rc_+ 8.5.1.2(10) ~D~~''_~c_''~~~");
figs.push("+_irc_- 8.5.1.3(10) ~D~~''_~c_''~~~");
figs.push("-_irc_+ 8.5.1.4(12) ~d~~''_~C_''~~~");

// 8.5.2.1-4
figs.push("+^rc_+ 8.5.2.1(10) ~d~~''_~c_''~~~");
figs.push("-^rc_- 8.5.2.2(14) ~D~~''_~C_''~~~");
figs.push("+^irc_+ 8.5.2.3(13) ~D~~''_~C_''~~~");
figs.push("-^irc_- 8.5.2.4(11) ~d~~''_~c_''~~~");

// 8.5.3.1-4
figs.push("+_rc^+ 8.5.3.1(12) ~d~~''_~C_''~~~");
figs.push("-_rc^- 8.5.3.2(11) ~D~~''_~c_''~~~");
figs.push("+_irc^+ 8.5.3.3(10) ~D~~''_~c_''~~~");
figs.push("-_irc^- 8.5.3.4(13) ~d~~''_~C_''~~~");

// 8.5.4.1-4
figs.push("+^rc^- 8.5.4.1(11) ~d~~''_~c_''~~~");
figs.push("-^rc^+ 8.5.4.2(14) ~D~~''_~C_''~~~");
figs.push("+^irc^- 8.5.4.3(14) ~D~~''_~C_''~~~");
figs.push("-^irc^+ 8.5.4.4(11) ~d~~''_~c_''~~~");

// 8.5.5.1-4
figs.push("+_c_- 8.5.5.1(10) ~~~''_c'''_'~~D~");
figs.push("-_c_+ 8.5.5.2(12) ~~~''_C'''_'~~d~");
figs.push("+_ic_- 8.5.5.3(12) ~~~''_C'''_'~~d~");
figs.push("-_ic_+ 8.5.5.4(10) ~~~''_c'''_'~~D~");

// 8.5.6.1-4
figs.push("+_c^+ 8.5.6.1(10) ~~~''_c'''_'~~d~");
figs.push("-_c^- 8.5.6.2(14) ~~~''_C'''_'~~D~");
figs.push("+_ic^+ 8.5.6.3(14) ~~~''_C'''_'~~D~");
figs.push("-_ic^- 8.5.6.4(11) ~~~''_c'''_'~~d~");

// 8.5.7.1-4
figs.push("+^c_+ 8.5.7.1(12) ~~~''_C'''_'~~d~");
figs.push("-^c_- 8.5.7.2(11) ~~~''_c'''_'~~D~");
figs.push("+^ic_+ 8.5.7.3(10) ~~~''_c'''_'~~D~");
figs.push("-^ic_- 8.5.7.4(13) ~~~''_C'''_'~~d~");

// 8.5.8.1-4
figs.push("+^c^- 8.5.8.1(14) ~~~''_C'''_'~~D~");
figs.push("-^c^+ 8.5.8.2(11) ~~~''_c'''_'~~d~");
figs.push("+^ic^- 8.5.8.3(11) ~~~''_c'''_'~~d~");
figs.push("-^ic^+ 8.5.8.4(14) ~~~''_C'''_'~~D~");

// Family 8.5. (cont) Vertical 5/8th Loops
figs.push("F8.5 Vertical 5/8ths Loops");

// 8.5.9.1-4
figs.push("+_y&+ 8.5.9.1(12) ~d~''_''c~''_''~v~");
figs.push("-_y&- 8.5.9.2(18) ~D~''_''C~''_''~V~");
figs.push("+_iy&+ 8.5.9.3(17) ~D~''_''C~''_''~V~");
figs.push("-_iy&- 8.5.9.4(13) ~d~''_''c~''_''~v~");

// 8.5.10.1-4
figs.push("+_y&- 8.5.10.1(14) ~d~''_''c~''_''~V~");
figs.push("-_y&+ 8.5.10.2(16) ~D~''_''C~''_''~v~");
figs.push("+_iy&- 8.5.10.3(16) ~D~''_''C~''_''~v~");
figs.push("-_iy&+ 8.5.10.4(14) ~d~''_''c~''_''~V~");

// 8.5.11.1-4
figs.push("+^y&+ 8.5.11.1(17) ~d~''_''C~''_''~v~");
figs.push("-^y&- 8.5.11.2(16) ~D~''_''c~''_''~V~");
figs.push("+^iy&+ 8.5.11.3(15) ~D~''_''c~''_''~V~");
figs.push("-^iy&- 8.5.11.4(17) ~d~''_''C~''_''~v~");

// 8.5.12.1-4
figs.push("+^y&- 8.5.12.1(18) ~d~''_''C~''_''~V~");
figs.push("-^y&+ 8.5.12.2(15) ~D~''_''c~''_''~v~");
figs.push("+^iy&- 8.5.12.3(15) ~D~''_''c~''_''~v~");
figs.push("-^iy&+ 8.5.12.4(18) ~d~''_''C~''_''~V~");

// 8.5.13.1-4
figs.push("+_zy&+ 8.5.13.1(17:0) ~z~''_''C~_~~v~");
figs.push("-_zy&- 8.5.13.2(17:0) ~Z~''_''c~_~~V~");
figs.push("+_izy&+ 8.5.13.3(17:0) ~Z~''_''c~_~~V~");
figs.push("-_izy&- 8.5.13.4(18:0) ~z~''_''C~_~~v~");

// 8.5.14.1-4
figs.push("+_zy&- 8.5.14.1(19:0) ~z~''_''C~_~~V~");
figs.push("-_zy&+ 8.5.14.2(16:0) ~Z~''_''c~_~~v~");
figs.push("+_izy&- 8.5.14.3(17:0) ~Z~''_''c~_~~v~");
figs.push("-_izy&+ 8.5.14.4(19:0) ~z~''_''C~_~~V~");

// 8.5.15.1-4
figs.push("+^zy&+ 8.5.15.1(16:0) ~z~''_''c~_~~v~");
figs.push("-^zy&- 8.5.15.2(22:0) ~Z~''_''C~_~~V~");
figs.push("+^izy&+ 8.5.15.3(21:0) ~Z~''_''C~_~~V~");
figs.push("-^izy&- 8.5.15.4(16:0) ~z~''_''c~_~~v~");

// 8.5.16.1-4
figs.push("+^zy&- 8.5.16.1(17:0) ~z~''_''c~_~~V~");
figs.push("-^zy&+ 8.5.16.2(20:0) ~Z~''_''C~_~~v~");
figs.push("+^izy&- 8.5.16.3(20:0) ~Z~''_''C~_~~v~");
figs.push("-^izy&+ 8.5.16.4(17:0) ~z~''_''c~_~~V~");

// 8.5.17.1-4
figs.push("+&ry_+ 8.5.17.1(12) ~~v~~_~c''_''~d~");
figs.push("-&ry_- 8.5.17.2(18) ~~V~~_~C''_''~D~");
figs.push("+&iry_+ 8.5.17.3(17) ~~V~~_~C''_''~D~");
figs.push("-&iry_- 8.5.17.4(13) ~~v~~_~c''_''~d~");

// 8.5.18.1-4
figs.push("+&ry^- 8.5.18.1(15) ~~v~~_~c''_''~D~");
figs.push("-&ry^+ 8.5.18.2(18) ~~V~~_~C''_''~d~");
figs.push("+&iry^- 8.5.18.3(18) ~~V~~_~C''_''~d~");
figs.push("-&iry^+ 8.5.18.4(15) ~~v~~_~c''_''~D~");

// 8.5.19.1-4
figs.push("+&ry_- 8.5.19.1(16) ~~v~~_~C''_''~D~");
figs.push("-&ry_+ 8.5.19.2(14) ~~V~~_~c''_''~d~");
figs.push("+&iry_- 8.5.19.3(14) ~~V~~_~c''_''~d~");
figs.push("-&iry_+ 8.5.19.4(16) ~~v~~_~C''_''~D~");

// 8.5.20.1-4
figs.push("+&ry^+ 8.5.20.1(16) ~~v~~_~C''_''~d~");
figs.push("-&ry^- 8.5.20.2(16) ~~V~~_~c''_''~D~");
figs.push("+&iry^+ 8.5.20.3(16) ~~V~~_~c''_''~D~");
figs.push("-&iry^- 8.5.20.4(17) ~~v~~_~C''_''~d~");

// 8.5.21.1-4
figs.push("+&ryz_- 8.5.21.1(16:0) ~~v~~_~c~_~Z~");
figs.push("-&ryz_+ 8.5.21.2(19:0) ~~V~~_~C~_~z~");
figs.push("+&iryz_- 8.5.21.3(18:0) ~~V~~_~C~_~z~");
figs.push("-&iryz_+ 8.5.21.4(16:0) ~~v~~_~c~_~Z~");

// 8.5.22.1-4
figs.push("+&ryz^+ 8.5.22.1(16:0) ~~v~~_~c~_~z~");
figs.push("-&ryz^- 8.5.22.2(22:0) ~~V~~_~C~_~Z~");
figs.push("+&iryz^+ 8.5.22.3(21:0) ~~V~~_~C~_~Z~");
figs.push("-&iryz^- 8.5.22.4(16:0) ~~v~~_~c~_~z~");

// 8.5.23.1-4
figs.push("+&ryz_+ 8.5.23.1(17:0) ~~v~~_~C~_~z~");
figs.push("-&ryz_- 8.5.23.2(18:0) ~~V~~_~c~_~Z~");
figs.push("+&iryz_+ 8.5.23.3(17:0) ~~V~~_~c~_~Z~");
figs.push("-&iryz_- 8.5.23.4(17:0) ~~v~~_~C~_~z~");

// 8.5.24.1-4
figs.push("+&ryz^- 8.5.24.1(20:0) ~~v~~_~C~_~Z~");
figs.push("-&ryz^+ 8.5.24.2(17:0) ~~V~~_~c~_~z~");
figs.push("+&iryz^- 8.5.24.3(17:0) ~~V~~_~c~_~z~");
figs.push("-&iryz^+ 8.5.24.4(20:0) ~~v~~_~C~_~Z~");

// Family 8.6. P Loops
figs.push('F8.6 "P" Loops');

// 8.6.1.1-4
figs.push("+&rp(_)_+ 8.6.1.1(11) ~v''_''~p!__''~");
figs.push("-&rp(_)_- 8.6.1.2(16) ~V''_''~P!__''~");
figs.push("+&irp(~)_+ 8.6.1.3(15) ~V''_''~P!__''~");
figs.push("-&irp(~)_- 8.6.1.4(12) ~v''_''~p!__''~");

// 8.6.2.1-4
figs.push("+&rp(_)^- 8.6.2.1(12) ~v~_~~p!__''~");
figs.push("-&rp(_)^+ 8.6.2.2(16) ~V~_~~P!__''~");
figs.push("+&irp(~)^- 8.6.2.3(16) ~V~_~~P!__''~");
figs.push("-&irp(~)^+ 8.6.2.4(12) ~v~_~~p!__''~");

// 8.6.3.1-4
figs.push("+&rp(_)_- 8.6.3.1(15) ~v''_''~P!__''~");
figs.push("-&rp(_)_+ 8.6.3.2(13) ~V''_''~p!__''~");
figs.push("+&irp(~)_- 8.6.3.3(13) ~V''_''~p!__''~");
figs.push("-&irp(~)_+ 8.6.3.4(14) ~v''_''~P!__''~");

// 8.6.4.1-4
figs.push("+&rp(_)^+ 8.6.4.1(14) ~v~_~~P!__''~");
figs.push("-&rp(_)^- 8.6.4.2(13) ~V~_~~p!__''~");
figs.push("+&irp(~)^+ 8.6.4.3(13) ~V~_~~p!__''~");
figs.push("-&irp(~)^- 8.6.4.4(15) ~v~_~~P!__''~");

// 8.6.5.1-4
figs.push("+_p(_)&+ 8.6.5.1(11) ~~_p!_~~_''v~");
figs.push("-_p(_)&- 8.6.5.2(16) ~~_P!_~~_''V~");
figs.push("+_ip(~)&+ 8.6.5.3(16) ~~_P!_~~_''V~");
figs.push("-_ip(~)&- 8.6.5.4(12) ~~_p!_~~_''v~");

// 8.6.6.1-4
figs.push("+_p(_)&- 8.6.6.1(12) ~~_p!_~~_''V~");
figs.push("-_p(_)&+ 8.6.6.2(15) ~~_P!_~~_''v~");
figs.push("+_ip(~)&- 8.6.6.3(15) ~~_P!_~~_''v~");
figs.push("-_ip(~)&+ 8.6.6.4(13) ~~_p!_~~_''V~");

// 8.6.7.1-4
figs.push("+^p(_)&- 8.6.7.1(16) ~~_P!_~~_''V~");
figs.push("-^p(_)&+ 8.6.7.2(12) ~~_p!_~~_''v~");
figs.push("+^ip(~)&- 8.6.7.3(12) ~~_p!_~~_''v~");
figs.push("-^ip(~)&+ 8.6.7.4(16) ~~_P!_~~_''V~");

// 8.6.8.1-4
figs.push("+^p(_)&+ 8.6.8.1(15) ~~_P!_~~_''v~");
figs.push("-^p(_)&- 8.6.8.2(13) ~~_p!_~~_''V~");
figs.push("+^ip(~)&+ 8.6.8.3(12) ~~_p!_~~_''V~");
figs.push("-^ip(~)&- 8.6.8.4(15) ~~_P!_~~_''v~");

// Family 8.6. (cont) Reversing P Loops
// New for 2012 - coded by Wouter Liefting
// coded as follows (based on pre-2012 porpoise)
// pp = 3/4 loop with reverse, line, 1/4 loop
// rpp = 1/4 loop, line, 3/4 loop with reverse
figs.push('F8.6 Reversing "P" Loops');

// 8.6.9.1-4
figs.push("+&rpp(_)_- 8.6.9.1(13) ~~~~v~_~m!_V=_~");
figs.push("-&rpp(_)_+ 8.6.9.2(15) ~~~~V~_~M!_v=_~");
figs.push("+&irpp_- 8.6.9.3(15) ~~~~V~_~Mv=_~");
figs.push("-&irpp_+ 8.6.9.4(13) ~~~~v~_~mV=_~");

// 8.6.10.1-4
figs.push("+&rpp(_)^+ 8.6.10.1(12) ~~~~v~_~m!_V=_~");
figs.push("-&rpp(_)^- 8.6.10.2(15) ~~~~V~_~M!_v=_~");
figs.push("+&irpp^+ 8.6.10.3(14) ~~~~V~_~Mv=_~");
figs.push("-&irpp^- 8.6.10.4(14) ~~~~v~_~mV=_~");

// 8.6.11.1-4
figs.push("+&rpp(_)_+ 8.6.11.1(13) ~v~_~M!_v=_~");
figs.push("-&rpp(_)_- 8.6.11.2(14) ~V~_~m!_V=_~");
figs.push("+&irpp_+ 8.6.11.3(13) ~V~_~mV=_~");
figs.push("-&irpp_- 8.6.11.4(14) ~v~_~Mv=_~");

// 8.6.12.1-4
figs.push("+&rpp(_)^- 8.6.12.1(14) ~v~_~M!_v=_~");
figs.push("-&rpp(_)^+ 8.6.12.2(14) ~V~_~m!_V=_~");
figs.push("+&irpp^- 8.6.12.3(14) ~V~_~mV=_~");
figs.push("-&irpp^+ 8.6.12.4(13) ~v~_~Mv=_~");

// 8.6.13.1-4
figs.push("+_pp(_)&+ 8.6.13.1(13) ~_v=M!_~_~v~");
figs.push("-_pp(_)&- 8.6.13.2(14) ~_V=m!_~_~V~");
figs.push("+_ipp&+ 8.6.13.3(13) ~_V=m~_~V~");
figs.push("-_ipp&- 8.6.13.4(14) ~_v=M~_~v~");

// 8.6.14.1-4
figs.push("+_pp(_)&- 8.6.14.1(15) ~_v=M!_~_~V~");
figs.push("-_pp(_)&+ 8.6.14.2(12) ~_V=m!_~_~v~");
figs.push("+_ipp&- 8.6.14.3(13) ~_V=m~_~v~");
figs.push("-_ipp&+ 8.6.14.4(15) ~_v=M~_~V~");

// 8.6.15.1-4
figs.push("+^pp(_)&- 8.6.15.1(13) ~_V=m!_~_~V~");
figs.push("-^pp(_)&+ 8.6.15.2(14) ~_v=M!_~_~v~");
figs.push("+^ipp&- 8.6.15.3(14) ~_v=M~_~v~");
figs.push("-^ipp&+ 8.6.15.4(14) ~_V=m~_~V~");

// 8.6.16.1-4
figs.push("+^pp(_)&+ 8.6.16.1(12) ~_V=m!_~_~v~");
figs.push("-^pp(_)&- 8.6.16.2(15) ~_v=M!_~_~V~");
figs.push("+^ipp&+ 8.6.16.3(15) ~_v=M~_~V~");
figs.push("-^ipp&- 8.6.16.4(13) ~_V=m~_~v~");

// New for 2013. More regular (non-reversing) P-loops, but with a half roll on top.
// In the CIVA proposal the full rolls on the horizontal and vertical segments were left out.
// Problem is that this makes the match criteria too broad. So they are added here, just in case,
// but commented out for the future.
figs.push('F8.6 "P" Loops w/ half rolls on top');

// 8.6.17.1-4
figs.push("+~rp(^)~- 8.6.17.1(14) ~v''_''~p!__''~");
figs.push("-~rp(^)~+ 8.6.17.2(14) ~V''_''~P!__''~");
figs.push("+~irp(^)~- 8.6.17.3(14) ~V''_''~P!__''~");
figs.push("-~irp(^)~+ 8.6.17.4(14) ~v''_''~p!__''~");
// figs.push("+&rp(^)_- 8.6.17.1(14) ~v''_''~p!__''~");
// figs.push("-&rp(^)_+ 8.6.17.2(14) ~V''_''~P!__''~");
// figs.push("+&irp(^)_- 8.6.17.3(14) ~V''_''~P!__''~");
// figs.push("-&irp(^)_+ 8.6.17.4(14) ~v''_''~p!__''~");

// 8.6.18 and 8.6.19 figure shapes were switched in OpenAero 1.3.5 and
// earlier. K's were correct for catalog nr but not for shape!
// 8.6.18.1-4
figs.push("+~rp(^)~+ 8.6.18.1(12) ~v_''''~P!__''~");
figs.push("-~rp(^)~- 8.6.18.2(15) ~V_''''~p!__''~");
figs.push("+~irp(^)~+ 8.6.18.3(15) ~V_''''~p!__''~");
figs.push("-~irp(^)~- 8.6.18.4(13) ~v_''''~P!__''~");
// figs.push("+&rp(^)^+ 8.6.18.1(12) ~v''_''~p!__''~");
// figs.push("-&rp(^)^- 8.6.18.2(15) ~V''_''~P!__''~");
// figs.push("+&irp(^)^+ 8.6.18.3(15) ~V''_''~P!__''~");
// figs.push("-&irp(^)^- 8.6.18.4(13) ~v''_''~p!__''~");

// 8.6.19.1-4
figs.push("+~rp(^)^+ 8.6.19.1(13) ~v_''''~p!__''~");
figs.push("-~rp(^)^- 8.6.19.2(14) ~V_''''~P!__''~");
figs.push("+~irp(^)^+ 8.6.19.3(14) ~V_''''~P!__''~");
figs.push("-~irp(^)^- 8.6.19.4(14) ~v_''''~p!__''~");

// 8.6.20.1-4
figs.push("+~rp(^)^- 8.6.20.1(13) ~v~_''''~P!__''~");
figs.push("-~rp(^)^+ 8.6.20.2(15) ~V_''''~p!__''~");
figs.push("+~irp(^)^- 8.6.20.3(15) ~V_''''~p!__''~");
figs.push("-~irp(^)^+ 8.6.20.4(13) ~v_''''~P!__''~");

// 8.6.21.1-4
figs.push("+~p(^)~- 8.6.21.1(14) ~~_p!_~~''_V~");
figs.push("-~p(^)~+ 8.6.21.2(14) ~~_P!_~~''_v~");
figs.push("+~ip(^)~- 8.6.21.3(14) ~~_P!_~~_''v~");
figs.push("-~ip(^)~+ 8.6.21.4(14) ~~_p!_~~_''V~");

// 8.6.22.1-4
figs.push("+~p(^)~+ 8.6.22.1(13) ~~_p!_~~''_v~");
figs.push("-~p(^)~- 8.6.22.2(15) ~~_P!_~~''_V~");
figs.push("+~ip(^)~+ 8.6.22.3(14) ~~_P!_~~''_V~");
figs.push("-~ip(^)~- 8.6.22.4(13) ~~_p!_~~''_v~");

// 8.6.23.1-4
figs.push("+^p(^)~+ 8.6.23.1(13) ~~_P!_~~''_v~");
figs.push("-^p(^)~- 8.6.23.2(14) ~~_p!_~~''_V~");
figs.push("+^ip(^)~+ 8.6.23.3(14) ~~_p!_~~''_V~");
figs.push("-^ip(^)~- 8.6.23.4(14) ~~_P!_~~''_v~");

// 8.6.24.1-4
figs.push("+^p(^)~- 8.6.24.1(15) ~~_P!_~~''_V~");
figs.push("-^p(^)~+ 8.6.24.2(13) ~~_p!_~~''_v~");
figs.push("+^ip(^)~- 8.6.24.3(13) ~~_p!_~~_''v~");
figs.push("-^ip(^)~+ 8.6.24.4(15) ~~_P!_~~_''V~");

// Family 8.7. Q Loops
figs.push('F8.7 "Q" Loops');

// 8.7.1.1-4
figs.push("+_rq(_)_+ 8.7.1.1(11) ~d''_''~r!__~~");
figs.push("-_rq(_)_- 8.7.1.2(16:0) ~D''_''~R!__~~");
figs.push("+_irq_+ 8.7.1.3(15:0) ~D''_''~R_~~");
figs.push("-_irq_- 8.7.1.4(12) ~d''_''~r_~~");

// 8.7.2.1-4
figs.push("+^rq(_)_- 8.7.2.1(17:0) ~d''_''~R!__~~");
figs.push("-^rq(_)_+ 8.7.2.2(14:0) ~D''_''~r!__~~");
figs.push("+^irq_- 8.7.2.3(13) ~D''_''~r_~~");
figs.push("-^irq_+ 8.7.2.4(16:0) ~d''_''~R_~~");

// 8.7.3.1-4
figs.push("+_rq(_)^- 8.7.3.1(12) ~d''_''~r!__~~");
figs.push("-_rq(_)^+ 8.7.3.2(16:0) ~D''_''~R!__~~");
figs.push("+_irq^- 8.7.3.3(15:0) ~D''_''~R_~~");
figs.push("-_irq^+ 8.7.3.4(12) ~d''_''~r_~~");

// 8.7.4.1-4
figs.push("+^rq(_)^+ 8.7.4.1(16:0) ~d''_''~R!__~~");
figs.push("-^rq(_)^- 8.7.4.2(14:0) ~D''_''~r!__~~");
figs.push("+^irq^+ 8.7.4.3(13) ~D''_''~r_~~");
figs.push("-^irq^- 8.7.4.4(17:0) ~d''_''~R_~~");

// 8.7.5.1-4
figs.push("+_q(_)_+ 8.7.5.1(11) ~~_r!_~~_''d~");
figs.push("-_q(_)_- 8.7.5.2(16) ~~_R!_~~_''D~");
figs.push("+_iq_+ 8.7.5.3(15) ~~_R~~_''D~");
figs.push("-_iq_- 8.7.5.4(12) ~~_r~~_''d~");

// 8.7.6.1-4
figs.push("+_q(_)^- 8.7.6.1(13) ~~_r!_~~_''D~");
figs.push("-_q(_)^+ 8.7.6.2(16) ~~_R!_~~_''d~");
figs.push("+_iq^- 8.7.6.3(17) ~~_R~~_''d~");
figs.push("-_iq^+ 8.7.6.4(14) ~~_r~~_''D~");

// 8.7.7.1-4
figs.push("+^q(_)_- 8.7.7.1(16) ~~_R!_~~_''D~");
figs.push("-^q(_)_+ 8.7.7.2(11) ~~_r!_~~_''d~");
figs.push("+^iq_- 8.7.7.3(12) ~~_r~~_''d~");
figs.push("-^iq_+ 8.7.7.4(16) ~~_R~~_''D~");

// 8.7.8.1-4
figs.push("+^q(_)^+ 8.7.8.1(16) ~~_R!_~~_''d~");
figs.push("-^q(_)^- 8.7.8.2(14) ~~_r!_~~_''D~");
figs.push("+^iq^+ 8.7.8.3(13) ~~_r~~_''D~");
figs.push("-^iq^- 8.7.8.4(17) ~~_R~~_''d~");

// Family 8.8. Double bumps
// New for 2012
// bb = pull, pull
// pbb = push, pull
// bpb = pull, push
// pbpb = push, push
figs.push('F8.8 Double Humpty Bumps');

// 8.8.1.1-4
figs.push("+&bb(&)&- 8.8.1.1(18) ~''v~'_'m/~~''_~m/''_~v''~");
figs.push("-&pbpb(&)&+ 8.8.1.2(25:0) -~''V~'_'M/~~''_~M/''_~V''~");
figs.push("+&ipbpb(&)&- 8.8.1.3(25:0) ~''V~'_'M/~~''_~M/''_~V''~");
figs.push("-&ibb(&)&+ 8.8.1.4(18) -~''v~'_'m/~~''_~m/''_~v''~");

// 8.8.2.1-4
figs.push("+&bb(&)&+ 8.8.2.1(19) ~''v~'_'m/~~''_~m/''_~V''~");
figs.push("-&pbpb(&)&- 8.8.2.2(24:0) -~''V~'_'M/~~''_~M/''_~v''~");
figs.push("+&ipbpb(&)&+ 8.8.2.3(24:0) ~''V~'_'M/~~''_~M/''_~v''~");
figs.push("-&ibb(&)&- 8.8.2.4(19) -~''v~'_'m/~~''_~m/''_~V''~");

// 8.8.3.1-4
figs.push("+&bpb(&)&- 8.8.3.1(21:0) ~''v~'_'m/~~''_~M/''_~v''~");
figs.push("-&pbb(&)&+ 8.8.3.2(23) -~''V~'_'M/~~''_~m/''_~V''~");
figs.push("+&ipbb(&)&- 8.8.3.3(23:0) ~''V~'_'M/~~''_~m/''_~V''~");
figs.push("-&ibpb(&)&+ 8.8.3.4(20) -~''v~'_'m/~~''_~M/''_~v''~");

// 8.8.4.1-4
figs.push("+&bpb(&)&+ 8.8.4.1(21:0) ~''v~'_'m/~~''_~M/''_~V''~");
figs.push("-&pbb(&)&- 8.8.4.2(22) -~''V~'_'M/~~''_~m/''_~v''~");
figs.push("+&ipbb(&)&+ 8.8.4.3(21:0) ~''V~'_'M/~~''_~m/''_~v''~");
figs.push("-&ibpb(&)&- 8.8.4.4(22) -~''v~'_'m/~~''_~M/''_~V''~");

// 8.8.5.1-4
figs.push("+&pbb(&)&- 8.8.5.1(21) ~''v~'_'M/~~''_~m/''_~v''~");
figs.push("-&bpb(&)&+ 8.8.5.2(23:0) -~''V~'_'m/~~''_~M/''_~V''~");
figs.push("+&ibpb(&)&- 8.8.5.3(23) ~''V~'_'m/~~''_~M/''_~V''~");
figs.push("-&ipbb(&)&+ 8.8.5.4(20:0) -~''v~'_'M/~~''_~m/''_~v''~");

// 8.8.6.1-4
figs.push("+&pbb(&)&+ 8.8.6.1(21) ~''v~'_'M/~~''_~m/''_~V''~");
figs.push("-&bpb(&)&- 8.8.6.2(22:0) -~''V~'_'m/~~''_~M/''_~v''~");
figs.push("+&ibpb(&)&+ 8.8.6.3(21) ~''V~'_'m/~~''_~M/''_~v''~");
figs.push("-&ipbb(&)&- 8.8.6.4(22:0) -~''v~'_'M/~~''_~m/''_~V''~");

// 8.8.7.1-4
figs.push("+&pbpb(&)&- 8.8.7.1(23:0) ~''v~'_'M/~~''_~M/''_~v''~");
figs.push("-&bb(&)&+ 8.8.7.2(21) -~''V~'_'m/~~''_~m/''_~V''~");
figs.push("+&ibb(&)&- 8.8.7.3(20) ~''V~'_'m/~~''_~m/''_~V''~");
figs.push("-&ipbpb(&)&+ 8.8.7.4(23:0) -~''v~'_'M/~~''_~M/''_~v''~");

// 8.8.8.1-4
figs.push("+&pbpb(&)&+ 8.8.8.1(25:0) ~''v~'_'M/~~''_~M/''_~V''~");
figs.push("-&bb(&)&- 8.8.8.2(20) -~''V~'_'m/~~''_~m/''_~v''~");
figs.push("+&ibb(&)&+ 8.8.8.3(19) ~''V~'_'m/~~''_~m/''_~v''~");
figs.push("-&ipbpb(&)&- 8.8.8.4(25:0) -~''v~'_'M/~~''_~M/''_~V''~");

// Double Humpty Bumps with first half loop large (since 2014)
figs.push("+&Bb(&)&-    8.8.1.1(18)	   ~''v~'_'m~~''_~m/''_~v''~");
figs.push("-&pBpb(&)&+  8.8.1.2(25)	  -~''V~'_'M~~''_~M/''_~V''~");
figs.push("+&ipBpb(&)&- 8.8.1.3(25)	   ~''V~'_'M~~''_~M/''_~V''~");
figs.push("-&iBb(&)&+   8.8.1.4(18)	  -~''v~'_'m~~''_~m/''_~v''~");

figs.push("+&Bb(&)&+    8.8.2.1(19)	   ~''v~'_'m~~''_~m/''_~V''~");
figs.push("-&pBpb(&)&-  8.8.2.2(24)	  -~''V~'_'M~~''_~M/''_~v''~");
figs.push("+&ipBpb(&)&+ 8.8.2.3(24)	   ~''V~'_'M~~''_~M/''_~v''~");
figs.push("-&iBb(&)&-   8.8.2.4(19)	  -~''v~'_'m~~''_~m/''_~V''~");

figs.push("+&Bpb(&)&-   8.8.3.1(21)	   ~''v~'_'m~~''_~M/''_~v''~");
figs.push("-&pBb(&)&+   8.8.3.2(23)	  -~''V~'_'M~~''_~m/''_~V''~");
figs.push("+&ipBb(&)&-  8.8.3.3(23)	   ~''V~'_'M~~''_~m/''_~V''~");
figs.push("-&iBpb(&)&+  8.8.3.4(20)	  -~''v~'_'m~~''_~M/''_~v''~");

figs.push("+&Bpb(&)&+   8.8.4.1(21)	   ~''v~'_'m~~''_~M/''_~V''~");
figs.push("-&pBb(&)&-   8.8.4.2(22)	  -~''V~'_'M~~''_~m/''_~v''~");
figs.push("+&ipBb(&)&+  8.8.4.3(21)	   ~''V~'_'M~~''_~m/''_~v''~");
figs.push("-&iBpb(&)&-  8.8.4.4(22)	  -~''v~'_'m~~''_~M/''_~V''~");

figs.push("+&pBb(&)&-   8.8.5.1(21)	   ~''v~'_'M~~''_~m/''_~v''~");
figs.push("-&Bpb(&)&+   8.8.5.2(23)	  -~''V~'_'m~~''_~M/''_~V''~");
figs.push("+&iBpb(&)&-  8.8.5.3(23)	   ~''V~'_'m~~''_~M/''_~V''~");
figs.push("-&ipBb(&)&+  8.8.5.4(20)	  -~''v~'_'M~~''_~m/''_~v''~");

figs.push("+&pBb(&)&+   8.8.6.1(21)	   ~''v~'_'M~~''_~m/''_~V''~");
figs.push("-&Bpb(&)&-   8.8.6.2(22)	  -~''V~'_'m~~''_~M/''_~v''~");
figs.push("+&iBpb(&)&+  8.8.6.3(21)	   ~''V~'_'m~~''_~M/''_~v''~");
figs.push("-&ipBb(&)&-  8.8.6.4(22)	  -~''v~'_'M~~''_~m/''_~V''~");

figs.push("+&pBpb(&)&-  8.8.7.1(23)	   ~''v~'_'M~~''_~M/''_~v''~");
figs.push("-&Bb(&)&+    8.8.7.2(21)	  -~''V~'_'m~~''_~m/''_~V''~");
figs.push("+&iBb(&)&-   8.8.7.3(20)	   ~''V~'_'m~~''_~m/''_~V''~");
figs.push("-&ipBpb(&)&+ 8.8.7.4(23)	  -~''v~'_'M~~''_~M/''_~v''~");

figs.push("+&pBpb(&)&+  8.8.8.1(25)	   ~''v~'_'M~~''_~M/''_~V''~");
figs.push("-&Bb(&)&-    8.8.8.2(20)	  -~''V~'_'m~~''_~m/''_~v''~");
figs.push("+&iBb(&)&+   8.8.8.3(19)	   ~''V~'_'m~~''_~m/''_~v''~");
figs.push("-&ipBpb(&)&- 8.8.8.4(25)	  -~''v~'_'M~~''_~M/''_~V''~");

// Double Humpty Bumps with second half loop large (since 2014)
figs.push("+&bB(&)&-    8.8.1.1(18)	   ~''v~'_'m/~~''_~m''_~v''~");
figs.push("-&pbpB(&)&+  8.8.1.2(25)	  -~''V~'_'M/~~''_~M''_~V''~");
figs.push("+&ipbpB(&)&- 8.8.1.3(25)	   ~''V~'_'M/~~''_~M''_~V''~");
figs.push("-&ibB(&)&+   8.8.1.4(18)	  -~''v~'_'m/~~''_~m''_~v''~");

figs.push("+&bB(&)&+    8.8.2.1(19)	   ~''v~'_'m/~~''_~m''_~V''~");
figs.push("-&pbpB(&)&-  8.8.2.2(24)	  -~''V~'_'M/~~''_~M''_~v''~");
figs.push("+&ipbpB(&)&+ 8.8.2.3(24)	   ~''V~'_'M/~~''_~M''_~v''~");
figs.push("-&ibB(&)&-   8.8.2.4(19)	  -~''v~'_'m/~~''_~m''_~V''~");

figs.push("+&bpB(&)&-   8.8.3.1(21)	   ~''v~'_'m/~~''_~M''_~v''~");
figs.push("-&pbB(&)&+   8.8.3.2(23)	  -~''V~'_'M/~~''_~m''_~V''~");
figs.push("+&ipbB(&)&-  8.8.3.3(23)	   ~''V~'_'M/~~''_~m''_~V''~");
figs.push("-&ibpB(&)&+  8.8.3.4(20)	  -~''v~'_'m/~~''_~M''_~v''~");

figs.push("+&bpB(&)&+   8.8.4.1(21)	   ~''v~'_'m/~~''_~M''_~V''~");
figs.push("-&pbB(&)&-   8.8.4.2(22)	  -~''V~'_'M/~~''_~m''_~v''~");
figs.push("+&ipbB(&)&+  8.8.4.3(21)	   ~''V~'_'M/~~''_~m''_~v''~");
figs.push("-&ibpB(&)&-  8.8.4.4(22)	  -~''v~'_'m/~~''_~M''_~V''~");

figs.push("+&pbB(&)&-   8.8.5.1(21)	   ~''v~'_'M/~~''_~m''_~v''~");
figs.push("-&bpB(&)&+   8.8.5.2(23)	  -~''V~'_'m/~~''_~M''_~V''~");
figs.push("+&ibpB(&)&-  8.8.5.3(23)	   ~''V~'_'m/~~''_~M''_~V''~");
figs.push("-&ipbB(&)&+  8.8.5.4(20)	  -~''v~'_'M/~~''_~m''_~v''~");

figs.push("+&pbB(&)&+   8.8.6.1(21)	   ~''v~'_'M/~~''_~m''_~V''~");
figs.push("-&bpB(&)&-   8.8.6.2(22)	  -~''V~'_'m/~~''_~M''_~v''~");
figs.push("+&ibpB(&)&+  8.8.6.3(21)	   ~''V~'_'m/~~''_~M''_~v''~");
figs.push("-&ipbB(&)&-  8.8.6.4(22)	  -~''v~'_'M/~~''_~m''_~V''~");

figs.push("+&pbpB(&)&-  8.8.7.1(23)	   ~''v~'_'M/~~''_~M''_~v''~");
figs.push("-&bB(&)&+    8.8.7.2(21)	  -~''V~'_'m/~~''_~m''_~V''~");
figs.push("+&ibB(&)&-   8.8.7.3(20)	   ~''V~'_'m/~~''_~m''_~V''~");
figs.push("-&ipbpB(&)&+ 8.8.7.4(23)	  -~''v~'_'M/~~''_~M''_~v''~");

figs.push("+&pbpB(&)&+  8.8.8.1(25)	   ~''v~'_'M/~~''_~M''_~V''~");
figs.push("-&bB(&)&-    8.8.8.2(20)	  -~''V~'_'m/~~''_~m''_~v''~");
figs.push("+&ibB(&)&+   8.8.8.3(19)	   ~''V~'_'m/~~''_~m''_~v''~");
figs.push("-&ipbpB(&)&- 8.8.8.4(25)	  -~''v~'_'M/~~''_~M''_~V''~");

// Family 8.10. Reversing 1.25 Loops
figs.push('F8.10 Reversing 1 1/4 Loops');

// 8.10.1.1-4
figs.push("+_co&+ 8.10.1.1(19) ~~~_pM''_''V~");
figs.push("-_co&- 8.10.1.2(19) ~~~_Pm''_''v~");
figs.push("+_ico&+ 8.10.1.3(18) ~~~_Pm''_''v~");
figs.push("-_ico&- 8.10.1.4(19) ~~~_pM''_''V~");

// 8.10.2.1-4
figs.push("+_co&- 8.10.2.1(18) ~~~_pM''_''v~");
figs.push("-_co&+ 8.10.2.2(20) ~~~_Pm''_''V~");
figs.push("+_ico&- 8.10.2.3(19) ~~~_Pm''_''V~");
figs.push("-_ico&+ 8.10.2.4(18) ~~~_pM''_''v~");

//############ family 0 figures - non FAI catalog ################
figs.push('F0 non-Aresti catalog');

// wingover
figs.push("+_jw_+ 0.0(8) ~d''_''j2~_~d~"); // was 0.0.0

//Clover leaf (with optional roll in top)
// we use 0.x based
// 1.4.0 : changed glider K to identical with power, were 13 and 10
figs.push("+oj_+ 0.1(16) ~''v=4p!_~"); // was 0.4.1.1
figs.push("+ioj_+ 0.2(13) ~''p!_4v=~");// was 0.4.1.2

//Half barrel rolls
// use 0.2.x.y as equivalent to 7.2.x.y
figs.push("+_mj_- 0.2.1.1(10) ~''_v=4v=_~");
figs.push("-_mj_+ 0.2.1.2(12) ~''_V=4V=_~");
figs.push("+_aj_- 0.2.1.3(12) ~''_V=4V=_~");
figs.push("-_aj_+ 0.2.1.4(10) ~''_v=4v=_~");
figs.push("+_mj^+ 0.2.2.1(10) ~''_v=4v=_~");
figs.push("-_mj^- 0.2.2.2(13) ~''_V=4V=_~");
figs.push("+_aj^+ 0.2.2.3(12) ~''_V=4V=_~");
figs.push("-_aj^- 0.2.2.4(11) ~''_v=4v=_~");

figs.push("+^mj_+ 0.2.3.1(12) ~''_V=4V=_~");
figs.push("-^mj_- 0.2.3.2(11) ~''_v=4v=_~");
figs.push("+^aj_+ 0.2.3.3(10) ~''_v=4v=_~");
figs.push("-^aj_- 0.2.3.4(13) ~''_V=4V=_~");
figs.push("+^mj^- 0.2.4.1(12) ~''_V=4V=_~");
figs.push("-^mj^+ 0.2.4.2(10) ~''_v=4v=_~");
figs.push("+^aj^- 0.2.4.3(10) ~''_v=4v=_~");
figs.push("-^aj^+ 0.2.4.4(12) ~''_V=4V=_~");

// 0.2.4.9-12 360 rolling turns with 1/2 roll
figs.push("+4j5- 0.2.4.9(50:0) ~''j45''~");
figs.push("-4j5+ 0.2.4.10(51:0) ~''J45''~");
figs.push("+4jo5- 0.2.4.11(54:0) ~''J45''~");
figs.push("-4jo5+ 0.2.4.12(55:0) ~''j45''~");

//extended tip-head hammer - for any "on spot turn around" (like knife edge up-down)
figs.push("+&th&+ 0.5.1.1(17) ~v~_~u~_''v~");
figs.push("-&th&- 0.5.1.2(23) ~V~_~U~_''V~");
figs.push("+&th&- 0.5.1.3(18) ~v~_~u~_''V~");
figs.push("-&th&+ 0.5.1.4(22) ~V~_~U~_''v~");

//extended vertical up-down lines figure, sort of alternate to the uh figure with a connector on top
figs.push("+&vv(_)&+ 0.11.1(20) ~v~''_~V''_''V~_''~v~");
figs.push("-&vv(_)&- 0.11.2(20) ~V~''_~v''_''v~_''~V~");
figs.push("+&ivv(_)&+ 0.11.3(20) ~V~''_~v''_''v~_''~V~");
figs.push("-&ivv(_)&- 0.11.4(20) ~v~''_~V''_''V~_''~v~");
figs.push("+&hat(_)&+ 0.12.1(20) ~v~''_~v''_''v~_''~v~");
figs.push("-&hat(_)&- 0.12.2(20) ~V~''_~V''_''V~_''~V~");
figs.push("+&ihat(_)&+ 0.12.3(20) ~V~''_~V''_''V~_''~V~");
figs.push("-&ihat(_)&- 0.12.4(20) ~v~''_~v''_''v~_''~v~");


//hammer p loop
figs.push("+&hp(&)_+ 0.5.2.1(20) ~v~_~h''_''~p_''~");
figs.push("-&hp(&)_- 0.5.2.2(20) ~V~_~H''_''~P_''~");
figs.push("+&hp(&)_- 0.5.2.3(20) ~v~_~h''_''~P_''~");
figs.push("-&hp(&)_+ 0.5.2.4(20) ~V~_~H''_''~p_''~");

figs.push("+&hp(&)^- 0.5.3.1(20) ~v~_~h''_''~p_''~");
figs.push("-&hp(&)^+ 0.5.3.2(20) ~V~_~H''_''~P_''~");
figs.push("+&hp(&)^+ 0.5.3.3(20) ~v~_~h''_''~P_''~");
figs.push("-&hp(&)^- 0.5.3.4(20) ~V~_~H''_''~p_''~");

//ip-hammer loop

figs.push("+_iph(&)&+ 0.5.4.1(20) ~~_P~~_~h~~_~v~");
figs.push("-_iph(&)&- 0.5.4.2(20) ~~_p~~_~H~~_~V~");
figs.push("+_iph(&)&- 0.5.4.3(20) ~~_P~~_~h~~_~V~");
figs.push("-_iph(&)&+ 0.5.4.4(20) ~~_p~~_~H~~_~v~");

figs.push("+^iph(&)&+ 0.5.6.1(20) ~~_p~~_~h~~_~v~");
figs.push("-^iph(&)&- 0.5.6.2(20) ~~_P~~_~H~~_~V~");
figs.push("+^iph(&)&- 0.5.6.3(20) ~~_p~~_~h~~_~V~");
figs.push("-^iph(&)&+ 0.5.6.4(20) ~~_P~~_~H~~_~v~");

//ib-hammer 
figs.push("+&ibh(&)&+ 0.5.7.1(20) ~~V~_''m~~_~h~~_''v~");
figs.push("-&ibh(&)&+ 0.5.7.2(20) -~~v~_''m~~_~h~~_''v~");
figs.push("+&ibh(&)&- 0.5.7.3(20) ~~V~_''m~~_~h~~_''V~");
figs.push("-&ibh(&)&- 0.5.7.4(20) -~~v~_''m~~_~h~~_''V~");

//ipb-hammer 
figs.push("+&ipbh(&)&+ 0.5.8.1(20) ~~V~_''M~~_~h~~_''v~");
figs.push("-&ipbh(&)&+ 0.5.8.2(20) -~~v~_''M~~_~h~~_''v~");
figs.push("+&ipbh(&)&- 0.5.8.3(20) ~~V~_''M~~_~h~~_''V~");
figs.push("-&ipbh(&)&- 0.5.8.4(20) -~~v~_''M~~_~h~~_''V~");

//can also add hib hipb figures 
//can also add hammer at the top of a k figure etc, but it would be very hard to judge
//need a figure with a clear vertical exit/entry line.
//the exit from N would be a candidate, but it implies 4-roll lines figures

//triangular!
figs.push("+_tri(_)_+ 0.11.1(20) ~~~d~_~z~''_~''z~_~d~~~");
figs.push("-_tri(_)_- 0.11.2(20) ~~~D~_~Z~''_~''Z~_~D~~~");
figs.push("+_itri(_)_+ 0.11.3(20) ~~~D~_~Z~''_~''Z~_~D~~~");
figs.push("-_itri(_)_- 0.11.4(20) ~~~d~_~z~''_~''z~_~d~~~");
figs.push("+^tri(_)^+ 0.12.1(20) ~~~d~_~Z~''_~''Z~_~d~~~");
figs.push("-^tri(_)^- 0.12.2(20) ~~~D~_~z~''_~''z~_~D~~~");
figs.push("+^itri(_)^+ 0.12.3(20) ~~~D~_~z~''_~''z~_~D~~~");
figs.push("-^itri(_)^- 0.12.4(20) ~~~d~_~Z~''_~''Z~_~d~~~");
figs.push("+^tri(^)_+ 0.13.1(20) ~~~d~_~Z~''_~''z~_~d~~~");
figs.push("-^tri(^)_- 0.13.2(20) ~~~D~_~z~''_~''Z~_~D~~~");
figs.push("+^itri(^)_+ 0.13.3(20) ~~~D~_~z~''_~''Z~_~D~~~");
figs.push("-^itri(^)_- 0.13.4(20) ~~~d~_~Z~''_~''z~_~d~~~");
figs.push("+_tri(^)^+ 0.14.1(20) ~~~d~_~z~''_~''Z~_~d~~~");
figs.push("-_tri(^)^- 0.14.2(20) ~~~D~_~Z~''_~''z~_~D~~~");
figs.push("+_itri(^)^+ 0.14.3(20) ~~~D~_~Z~''_~''z~_~D~~~");
figs.push("-_itri(^)^- 0.14.4(20) ~~~d~_~z~''_~''Z~_~d~~~");

figs.push("+^tri(^)^- 0.15.1(20) ~~~d~_~Z~''_~''z~_~D~~~");
figs.push("-^tri(^)^+ 0.15.2(20) ~~~D~_~z~''_~''Z~_~d~~~");
figs.push("+^itri(^)^- 0.15.3(20) ~~~D~_~z~''_~''Z~_~d~~~");
figs.push("-^itri(^)^+ 0.15.4(20) ~~~d~_~Z~''_~''z~_~D~~~");
figs.push("+^tri(_)_- 0.16.1(20) ~~~d~_~Z~''_~''Z~_~D~~~");
figs.push("-^tri(_)_+ 0.16.2(20) ~~~D~_~z~''_~''z~_~d~~~");
figs.push("+^itri(_)_- 0.16.3(20) ~~~D~_~z~''_~''z~_~d~~~");
figs.push("-^itri(_)_+ 0.16.4(20) ~~~d~_~Z~''_~''Z~_~D~~~");
figs.push("+_tri(^)_- 0.17.1(20) ~~~d~_~z~''_~''Z~_~D~~~");
figs.push("-_tri(^)_+ 0.17.2(20) ~~~D~_~Z~''_~''z~_~d~~~");
figs.push("+_itri(^)_- 0.17.3(20) ~~~D~_~Z~''_~''z~_~d~~~");
figs.push("-_itri(^)_+ 0.17.4(20) ~~~d~_~z~''_~''Z~_~D~~~");
figs.push("+_tri(_)^- 0.18.1(20) ~~~d~_~z~''_~''z~_~D~~~");
figs.push("-_tri(_)^+ 0.18.2(20) ~~~D~_~Z~''_~''Z~_~d~~~");
figs.push("+_itri(_)^- 0.18.3(20) ~~~D~_~Z~''_~''Z~_~d~~~");
figs.push("-_itri(_)^+ 0.18.4(20) ~~~d~_~z~''_~''z~_~D~~~");

// other extended figures
//extended immelman, has 3 roll positions
figs.push("+_xm(_)_+ 0.101.1(20) ~d=_d=_d=_d=~");
figs.push("-_xm(_)_- 0.101.2(20) ~D=_D=_D=_D=~");
figs.push("+_ixm(_)_+ 0.101.3(20) ~D=_D=_D=_D=~");
figs.push("-_ixm(_)_- 0.101.4(20) ~d=_d=_d=_d=~");
figs.push("+_xm(^)_+ 0.102.1(20) ~d=_d=_D=_D=~");
figs.push("-_xm(^)_- 0.102.2(20) ~D=_D=_d=_d=~");
figs.push("+_ixm(^)_+ 0.102.3(20) ~D=_D=_d=_d=~");
figs.push("-_ixm(^)_- 0.102.4(20) ~d=_d=_D=_D=~");
figs.push("+_xm(_)^+ 0.103.1(20) ~d=_d=_d=_D=~");
figs.push("-_xm(_)^- 0.103.2(20) ~D=_D=_D=_d=~");
figs.push("+_ixm(_)^+ 0.103.3(20) ~D=_D=_D=_d=~");
figs.push("-_ixm(_)^- 0.103.4(20) ~d=_d=_d=_D=~");
figs.push("+^xm(_)_+ 0.104.1(20) ~d=_D=_D=_D=~");
figs.push("-^xm(_)_- 0.104.2(20) ~D=_d=_d=_d=~");
figs.push("+^ixm(_)_+ 0.104.3(20) ~D=_d=_d=_d=~");
figs.push("-^ixm(_)_- 0.104.4(20) ~d=_D=_D=_D=~");

figs.push("+_xa(_)_+ 0.201.1(20) ~D=_D=_D=_D=~");
figs.push("-_xa(_)_- 0.201.2(20) ~d=_d=_d=_d=~");
figs.push("+_ixa(_)_+ 0.201.3(20) ~d=_d=_d=_d=~");
figs.push("-_ixa(_)_- 0.201.4(20) ~D=_D=_D=_D=~");
figs.push("+_xa(^)_+ 0.202.1(20) ~D=_D=_d=_d=~");
figs.push("-_xa(^)_- 0.202.2(20) ~d=_d=_D=_D=~");
figs.push("+_ixa(^)_+ 0.202.3(20) ~d=_d=_D=_D=~");
figs.push("-_ixa(^)_- 0.202.4(20) ~D=_D=_d=_d=~");
figs.push("+_xa(_)^+ 0.203.1(20) ~D=_D=_D=_d=~");
figs.push("-_xa(_)^- 0.203.2(20) ~d=_d=_d=_D=~");
figs.push("+_ixa(_)^+ 0.203.3(20) ~d=_d=_d=_D=~");
figs.push("-_ixa(_)^- 0.203.4(20) ~D=_D=_D=_d=~");
figs.push("+^xa(_)_+ 0.204.1(20) ~D=_d=_D=_D=~");
figs.push("-^xa(_)_- 0.204.2(20) ~d=_D=_d=_d=~");
figs.push("+^ixa(_)_+ 0.204.3(20) ~d=_D=_d=_d=~");
figs.push("-^ixa(_)_- 0.204.4(20) ~D=_d=_D=_D=~");

//+_xv(&)_+  1.301.1(20,20,20,20) = ~_~v~_~V~_~
//+_xv(&)^-  1.302.1(20,20,20,20) = ~_~v~_~v~_~
//+^xv(&)_-  1.303.1(20,20,20,20) = ~_~V~_~V~_~
//+^xv(&)^+  1.304.1(20,20,20,20) = ~_~V~_~v~_~

//+_xd(_)_+  1.401.1(20,20,20,20) = ''_d~_~D_''
//+_xd(^)_-  1.402.1(20,20,20,20) = ''_d~_~d_''
//+^xd(_)_-  1.403.1(20,20,20,20) = ''_D~_~d_''
//+^xd(^)_+  1.404.1(20,20,20,20) = ''_D~_~D_''

// formation figures
// loop and turn
figs.push ("+oaj+ 0.301.1(20) ~oj1~");
figs.push ("+oajj+ 0.301.1(20) ~oj2~");
figs.push ("+oajjj+ 0.301.1(20) ~oj3~");
figs.push ("+oajjjj+ 0.301.1(20) ~oj4~");

//############ family 9 values ################

// 4       2   3     1       5     6     7     9 
figs.push("v4 9.1.1.1(6:9)");
figs.push("v2 9.1.1.2(8:12)");
figs.push("v3 9.1.1.3(10:0)");
figs.push("v1 9.1.1.4(12:0)");
figs.push("v5 9.1.1.5(14:0)");
figs.push("v6 9.1.1.6(15:0)");
figs.push("v7 9.1.1.7(17:0)");
figs.push("v9 9.1.1.8(18:0)");
figs.push("d4 9.1.2.1(4:6)");
figs.push("d2 9.1.2.2(6:9)");
figs.push("d3 9.1.2.3(8:0)");
figs.push("d1 9.1.2.4(10:15)");
figs.push("d5 9.1.2.5(11:0)");
figs.push("d6 9.1.2.6(12:0)");
figs.push("d7 9.1.2.7(14:0)");
figs.push("d9 9.1.2.8(15:0)");
figs.push("4 9.1.3.1(2:3)");
figs.push("2 9.1.3.2(4:6)");
figs.push("3 9.1.3.3(6:9)");
figs.push("1 9.1.3.4(8:12)");
figs.push("5 9.1.3.5(9:14)");
figs.push("6 9.1.3.6(10:15)");
figs.push("7 9.1.3.7(11:17)");
figs.push("9 9.1.3.8(12:18)");
figs.push("id4 9.1.4.1(2:3)");
figs.push("id2 9.1.4.2(4:6)");
figs.push("id3 9.1.4.3(6:9)");
figs.push("id1 9.1.4.4(8:12)");
figs.push("id5 9.1.4.5(9:0)");
figs.push("id6 9.1.4.6(10:0)");
figs.push("id7 9.1.4.7(11:0)");
figs.push("id9 9.1.4.8(12:0)");
figs.push("iv4 9.1.5.1(2:3)");
figs.push("iv2 9.1.5.2(4:6)");
figs.push("iv3 9.1.5.3(6:9)");
figs.push("iv1 9.1.5.4(8:0)");
figs.push("iv5 9.1.5.5(9:0)");
figs.push("iv6 9.1.5.6(10:0)");
figs.push("iv7 9.1.5.7(11:0)");
figs.push("iv9 9.1.5.8(12:0)");

// 22    23     24 
figs.push("v22 9.2.1.4(13:0)");
figs.push("v32 9.2.1.6(17:0)");
figs.push("v42 9.2.1.8(21:0)");
figs.push("d22 9.2.2.4(11:0)");
figs.push("d32 9.2.2.6(14:0)");
figs.push("d42 9.2.2.8(18:0)");
figs.push("22 9.2.3.4(9:14)");
figs.push("32 9.2.3.6(12:18)");
figs.push("42 9.2.3.8(15:23)");
figs.push("id22 9.2.4.4(9:14)");
figs.push("id32 9.2.4.6(12:0)");
figs.push("id42 9.2.4.8(15:0)");
figs.push("iv22 9.2.5.4(9:0)");
figs.push("iv32 9.2.5.6(12:0)");
figs.push("iv42 9.2.5.8(15:0)");

//glider 3 point rolls!
// 33          63 
figs.push("33 9.3.3.4(0:17)");
figs.push("63 9.3.3.8(0:28)");
figs.push("id33 9.3.4.4(0:17)");

// 42   43     44    45    46    47    48 
figs.push("v24 9.4.1.2(9:14)");
figs.push("v34 9.4.1.3(12:0)");
figs.push("v44 9.4.1.4(15:0)");
figs.push("v54 9.4.1.5(18:0)");
figs.push("v64 9.4.1.6(20:0)");
figs.push("v74 9.4.1.7(23:0)");
figs.push("v84 9.4.1.8(25:0)");
figs.push("d24 9.4.2.2(7:11)");
figs.push("d34 9.4.2.3(10:0)");
figs.push("d44 9.4.2.4(13:0)");
figs.push("d54 9.4.2.5(15:0)");
figs.push("d64 9.4.2.6(17:0)");
figs.push("d74 9.4.2.7(20:0)");
figs.push("d84 9.4.2.8(22:0)");
figs.push("24 9.4.3.2(5:8)");
figs.push("34 9.4.3.3(8:12)");
figs.push("44 9.4.3.4(11:17)");
figs.push("54 9.4.3.5(13:20)");
figs.push("64 9.4.3.6(15:23)");
figs.push("74 9.4.3.7(17:26)");
figs.push("84 9.4.3.8(19:28)");
figs.push("id24 9.4.4.2(5:8)");
figs.push("id34 9.4.4.3(8:12)");
figs.push("id44 9.4.4.4(11:17)");
figs.push("id54 9.4.4.5(13:0)");
figs.push("id64 9.4.4.6(15:0)");
figs.push("id74 9.4.4.7(17:0)");
figs.push("id84 9.4.4.8(19:0)");
figs.push("iv24 9.4.5.2(5:8)");
figs.push("iv34 9.4.5.3(8:0)");
figs.push("iv44 9.4.5.4(11:0)");
figs.push("iv54 9.4.5.5(13:0)");
figs.push("iv64 9.4.5.6(15:0)");
figs.push("iv74 9.4.5.7(17:0)");
figs.push("iv84 9.4.5.8(19:0)");

// 8      84 86 88 810 812 814 816
figs.push("v8 9.8.1.1(7:11)");
figs.push("v28 9.8.1.1(7:11)");
figs.push("v48 9.8.1.2(11:0)");
figs.push("v68 9.8.1.3(15:0)");
figs.push("v88 9.8.1.4(19:0)");
figs.push("v108 9.8.1.5(23:0)");
figs.push("v128 9.8.1.6(26:0)");
figs.push("v148 9.8.1.7(30:0)");
figs.push("v168 9.8.1.8(33:0)");
figs.push("d8 9.8.2.1(5:8)");
figs.push("d28 9.8.2.1(5:8)");
figs.push("d48 9.8.2.2(9:14)");
figs.push("d68 9.8.2.3(13:0)");
figs.push("d88 9.8.2.4(17:0)");
figs.push("d108 9.8.2.5(20:0)");
figs.push("d128 9.8.2.6(23:0)");
figs.push("d148 9.8.2.7(27:0)");
figs.push("d168 9.8.2.8(30:0)");
figs.push("8 9.8.3.1(3:5)");
figs.push("28 9.8.3.1(3:5)");
figs.push("48 9.8.3.2(7:11)");
figs.push("68 9.8.3.3(11:17)");
figs.push("88 9.8.3.4(15:23)");
figs.push("108 9.8.3.5(18:27)");
figs.push("128 9.8.3.6(21:32)");
figs.push("148 9.8.3.7(24:36)");
figs.push("168 9.8.3.8(27:41)");
figs.push("id8 9.8.4.1(3:5)");
figs.push("id28 9.8.4.1(3:5)");
figs.push("id48 9.8.4.2(7:11)");
figs.push("id68 9.8.4.3(11:0)");
figs.push("id88 9.8.4.4(15:0)");
figs.push("id108 9.8.4.5(18:0)");
figs.push("id128 9.8.4.6(21:0)");
figs.push("id148 9.8.4.7(24:0)");
figs.push("id168 9.8.4.8(27:0)");
figs.push("iv8 9.8.5.1(3:5)");
figs.push("iv28 9.8.5.1(3:5)");
figs.push("iv48 9.8.5.2(7:11)");
figs.push("iv68 9.8.5.3(11:0)");
figs.push("iv88 9.8.5.4(15:0)");
figs.push("iv108 9.8.5.5(18:0)");
figs.push("iv128 9.8.5.6(21:0)");
figs.push("iv148 9.8.5.7(24:0)");
figs.push("iv168 9.8.5.8(27:0)");

// 2    3    1  5   6  7  9 
figs.push("+v2f 9.9.1.2(15:18)");
figs.push("+v3f 9.9.1.3(15:0)");
figs.push("+v1f 9.9.1.4(15:0)");
figs.push("+v5f 9.9.1.5(17:0)");
figs.push("+v6f 9.9.1.6(19:0)");
figs.push("+v7f 9.9.1.7(21:0)");
figs.push("+v9f 9.9.1.8(23:0)");
figs.push("+d2f 9.9.2.2(13:15)");
figs.push("+d3f 9.9.2.3(13:17)");
figs.push("+d1f 9.9.2.4(13:19)");
figs.push("+d5f 9.9.2.5(15:0)");
figs.push("+d6f 9.9.2.6(16:0)");
figs.push("+d7f 9.9.2.7(18:0)");
figs.push("+d9f 9.9.2.8(20:0)");
figs.push("+2f 9.9.3.2(11:12)");
figs.push("+3f 9.9.3.3(11:14)");
figs.push("+1f 9.9.3.4(11:16)");
figs.push("+5f 9.9.3.5(13:19)");
figs.push("+6f 9.9.3.6(14:21)");
figs.push("+7f 9.9.3.7(16:24)");
figs.push("+9f 9.9.3.8(17:25)");
figs.push("+id2f 9.9.4.2(11:12)");
figs.push("+id3f 9.9.4.3(11:14)");
figs.push("+id1f 9.9.4.4(11:16)");
figs.push("+id5f 9.9.4.5(13:19)");
figs.push("+id6f 9.9.4.6(14:21)");
figs.push("+id7f 9.9.4.7(16:24)");
figs.push("+id9f 9.9.4.8(17:25)");
figs.push("+iv2f 9.9.5.2(11:12)");
figs.push("+iv3f 9.9.5.3(11:14)");
figs.push("+iv1f 9.9.5.4(11:16)");
figs.push("+iv5f 9.9.5.5(13:19)");
figs.push("+iv6f 9.9.5.6(14:21)");
figs.push("+iv7f 9.9.5.7(16:24)");
figs.push("+iv9f 9.9.5.8(17:25)");
//
figs.push("-v2f 9.9.6.2(17:18)");
figs.push("-v3f 9.9.6.3(17:0)");
figs.push("-v1f 9.9.6.4(17:0)");
figs.push("-v5f 9.9.6.5(20:0)");
figs.push("-v6f 9.9.6.6(22:0)");
figs.push("-v7f 9.9.6.7(24:0)");
figs.push("-v9f 9.9.6.8(26:0)");
figs.push("-d2f 9.9.7.2(15:18)");
figs.push("-d3f 9.9.7.3(15:0)");
figs.push("-d1f 9.9.7.4(15:0)");
figs.push("-d5f 9.9.7.5(17:0)");
figs.push("-d6f 9.9.7.6(19:0)");
figs.push("-d7f 9.9.7.7(21:0)");
figs.push("-d9f 9.9.7.8(23:0)");
figs.push("-2f 9.9.8.2(13:15)");
figs.push("-3f 9.9.8.3(13:17)");
figs.push("-1f 9.9.8.4(13:19)");
figs.push("-5f 9.9.8.5(15:22)");
figs.push("-6f 9.9.8.6(16:24)");
figs.push("-7f 9.9.8.7(18:27)");
figs.push("-9f 9.9.8.8(20:30)");
figs.push("-id2f 9.9.9.2(13:15)");
figs.push("-id3f 9.9.9.3(13:17)");
figs.push("-id1f 9.9.9.4(13:19)");
figs.push("-id5f 9.9.9.5(15:22)");
figs.push("-id6f 9.9.9.6(16:24)");
figs.push("-id7f 9.9.9.7(18:27)");
figs.push("-id9f 9.9.9.8(20:30)");
figs.push("-iv2f 9.9.10.2(13:12)");
figs.push("-iv3f 9.9.10.3(13:14)");
figs.push("-iv1f 9.9.10.4(13:16)");
figs.push("-iv5f 9.9.10.5(15:19)");
figs.push("-iv6f 9.9.10.6(16:21)");
figs.push("-iv7f 9.9.10.7(18:24)");
figs.push("-iv9f 9.9.10.8(20:25)");

// 2      3      1       5     6     7     8 
figs.push("-v2if 9.10.1.2(17:21)");
figs.push("-v3if 9.10.1.3(17:0)");
figs.push("-v1if 9.10.1.4(17:0)");
figs.push("-v5if 9.10.1.5(20:0)");
figs.push("-v6if 9.10.1.6(22:0)");
figs.push("-v7if 9.10.1.7(24:0)");
figs.push("-v9if 9.10.1.8(26:0)");
figs.push("-d2if 9.10.2.2(15:18)");
figs.push("-d3if 9.10.2.3(15:20)");
figs.push("-d1if 9.10.2.4(15:22)");
figs.push("-d5if 9.10.2.5(17:0)");
figs.push("-d6if 9.10.2.6(19:0)");
figs.push("-d7if 9.10.2.7(21:0)");
figs.push("-d9if 9.10.2.8(23:0)");
figs.push("-2if 9.10.3.2(13:15)");
figs.push("-3if 9.10.3.3(13:17)");
figs.push("-1if 9.10.3.4(13:19)");
figs.push("-5if 9.10.3.5(15:22)");
figs.push("-6if 9.10.3.6(16:24)");
figs.push("-7if 9.10.3.7(18:27)");
figs.push("-9if 9.10.3.8(20:30)");
figs.push("-id2if 9.10.4.2(13:15)");
figs.push("-id3if 9.10.4.3(13:17)");
figs.push("-id1if 9.10.4.4(13:19)");
figs.push("-id5if 9.10.4.5(15:22)");
figs.push("-id6if 9.10.4.6(16:24)");
figs.push("-id7if 9.10.4.7(18:27)");
figs.push("-id9if 9.10.4.8(20:30)");
figs.push("-iv2if 9.10.5.2(13:15)");
figs.push("-iv3if 9.10.5.3(13:17)");
figs.push("-iv1if 9.10.5.4(13:19)");
figs.push("-iv5if 9.10.5.5(15:22)");
figs.push("-iv6if 9.10.5.6(16:24)");
figs.push("-iv7if 9.10.5.7(18:27)");
figs.push("-iv9if 9.10.5.8(20:30)");

figs.push("+v2if 9.10.6.2(19:21)");
figs.push("+v3if 9.10.6.3(19:0)");
figs.push("+v1if 9.10.6.4(19:0)");
figs.push("+v5if 9.10.6.5(22:0)");
figs.push("+v6if 9.10.6.6(24:0)");
figs.push("+v7if 9.10.6.7(27:0)");
figs.push("+v9if 9.10.6.8(29:0)");
figs.push("+d2if 9.10.7.2(17:21)");
figs.push("+d3if 9.10.7.3(17:0)");
figs.push("+d1if 9.10.7.4(17:0)");
figs.push("+d5if 9.10.7.5(19:0)");
figs.push("+d6if 9.10.7.6(21:0)");
figs.push("+d7if 9.10.7.7(24:0)");
figs.push("+d9if 9.10.7.8(26:0)");
figs.push("+2if 9.10.8.2(15:18)");
figs.push("+3if 9.10.8.3(15:20)");
figs.push("+1if 9.10.8.4(15:22)");
figs.push("+5if 9.10.8.5(17:25)");
figs.push("+6if 9.10.8.6(19:28)");
figs.push("+7if 9.10.8.7(21:31)");
figs.push("+9if 9.10.8.8(23:34)");
figs.push("+id2if 9.10.9.2(15:18)");
figs.push("+id3if 9.10.9.3(15:20)");
figs.push("+id1if 9.10.9.4(15:22)");
figs.push("+id5if 9.10.9.5(17:25)");
figs.push("+id6if 9.10.9.6(19:28)");
figs.push("+id7if 9.10.9.7(21:31)");
figs.push("+id9if 9.10.9.8(23:34)");
figs.push("+iv2if 9.10.10.2(15:15)");
figs.push("+iv3if 9.10.10.3(15:17)");
figs.push("+iv1if 9.10.10.4(15:19)");
figs.push("+iv5if 9.10.10.5(17:22)");
figs.push("+iv6if 9.10.10.6(19:24)");
figs.push("+iv7if 9.10.10.7(21:27)");
figs.push("+iv9if 9.10.10.8(23:30)");

//  1    5    6    7    9 
figs.push("iv1s 9.11.1.4(5:5)");
figs.push("iv5s 9.11.1.5(4:6)");
figs.push("iv6s 9.11.1.6(3:7)");
figs.push("iv7s 9.11.1.7(3:8)");
figs.push("iv9s 9.11.1.8(3:8)");
figs.push("iv1is 9.12.1.4(7:7)");
figs.push("iv5is 9.12.1.5(6:8)");
figs.push("iv6is 9.12.1.6(5:9)");
figs.push("iv7is 9.12.1.7(5:10)");
figs.push("iv9is 9.12.1.8(5:10)");

//glider slow roll

figs.push("02 9.13.3.2(0:8)");
figs.push("01 9.13.3.4(0:16)");
figs.push("06 9.13.3.6(0:20)");

// barrel roll
figs.push("@1 9.14.3.4(0:0)");
figs.push("@9 9.14.3.8(0:0)");
