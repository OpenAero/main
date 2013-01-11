// examples.js 1.2.1

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
    
// This file contains example sequences which will be available
// in menu Help -> Example sequences

var exampleSequences = [];

exampleSequences['2013 CIVA Adv Known'] = '<sequence>' +
'<pilot></pilot>' +
'<aircraft></aircraft>' +
'<category>Advanced</category>' +
'<location></location>' +
'<date></date>' +
'<class>powered</class>' +
'<program>Known</program>' +
'<rules>CIVA</rules>' +
'<positioning>40</positioning>' +
'<notes></notes>' +
'<sequence_text>,24pbb(,3),4- +-isin(1),4~ ~8b.2f> 3> ~~2m,8,3-~ (0,12) -2joi15~~ ~hf.~~ ~``````2f``rc,24``````````- (0,10) -o,6 ++m32,6f-</sequence_text>' +
'<logo>VINK</logo>' +
'</sequence>';

exampleSequences['2013 CIVA Unl Known'] = '<sequence>' +
'<pilot></pilot>' +
'<aircraft></aircraft>' +
'<category>Advanced</category>' +
'<location></location>' +
'<date></date>' +
'<class>powered</class>' +
'<program>Known</program>' +
'<rules>CIVA</rules>' +
'<positioning>60</positioning>' +
'<notes></notes>' +
"<sequence_text>+,2,2f'zt,2f;2+~ 2> ~~7,3m5if,3'' [0,18] 24ip1 3> 2% ~```,s,3if...ibpb(```3)..,3f,4' ifh5f++ 3> .8'rp(44)9 [0,12] `+3joi15-++ -.,4itaf> 34pb3.^></sequence_text>" +
'<logo>VINK</logo>' +
'</sequence>';

exampleSequences['2013 BAeA Int Known'] = '<sequence>' +
'<pilot></pilot>' +
'<aircraft></aircraft>' +
'<category>Advanced</category>' +
'<location></location>' +
'<date></date>' +
'<class>powered</class>' +
'<program>Known</program>' +
'<rules>BAeA</rules>' +
'<positioning>20</positioning>' +
'<notes></notes>' +
"<sequence_text>ej /,4rp2>~~ ~~2j2^ (0,8) 1% +24ic,24`````- [0,12] +-1ic. 2> +++2j (0,10) d2- -is++++ +++4h.4.++> 22 m2 ,2f-></sequence_text>" +
'<logo>VINK</logo>' +
'</sequence>';
