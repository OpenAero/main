// library.js

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
// in menu Demo

var library = {
	'2018 CIVA Unl Free Known':
	'https://openaero.net/?s=PGNhdGVnb3J5PlVubGltaXRlZDwvPjxjbGFzcz5wb3dlcmVkPC8-PHByb2dyYW0-RnJlZSBLbm93bjwvPjxydWxlcz5DSVZBPC8-PHBvc2l0aW9uaW5nPjQwPC8-PHNlcXVlbmNlX3RleHQ-IkBBIiBvM2YsMyAiQEIiIDM0YmIzaWYtPiAiQEMiIC1gYDZpcywyNGlycGYsMmlmICJARCIgLSw2dGFgMjQuICJARSIgM2ppbzUxLTwvPjxsb2dvPkNJVkE8Lz48b2FfdmVyc2lvbj4yMDE3LjIuNDwvPjxkZWZhdWx0X3ZpZXc-Z3JpZDo1PC8-',
	
	'2018 CIVA Adv Free Known':
	'https://openaero.net/?s=PGNhdGVnb3J5PkFkdmFuY2VkPC8-PGNsYXNzPnBvd2VyZWQ8Lz48cHJvZ3JhbT5GcmVlIEtub3duPC8-PHJ1bGVzPkNJVkE8Lz48cG9zaXRpb25pbmc-MzA8Lz48c2VxdWVuY2VfdGV4dD4iQEEiIC00LDNtNjtmICJAQiIgZnJkYjI0ICJAQyIgMmRoKDgpMjQgIkBEIiBgYGBgNnMuLmlrNCwzNC0gIkBFIiAtMmoxNTwvPjxsb2dvPkNJVkE8Lz48b2FfdmVyc2lvbj4yMDE3LjIuNDwvPjxkZWZhdWx0X3ZpZXc-Z3JpZDo1PC8-',
	
	'2018 CIVA Yak 52 Free Known':
	'https://openaero.net/?s=PGNhdGVnb3J5PllhazUyPC8-PGNsYXNzPnBvd2VyZWQ8Lz48cHJvZ3JhbT5GcmVlIEtub3duPC8-PHJ1bGVzPkNJVkE8Lz48cG9zaXRpb25pbmc-MzA8Lz48c2VxdWVuY2VfdGV4dD4iQEEiIDRiICJAQiIgOGgyICJAQyIgYGBgYDI0LidnICJARCIgYGBgcydpcnA0LDMgIkBFIiAtMWpvMS08Lz48bG9nbz5DSVZBPC8-PG9hX3ZlcnNpb24-MjAxNy4yLjQ8Lz48ZGVmYXVsdF92aWV3PmdyaWQ6NTwvPg',

	'2018 CIVA Int Free Known':
	'https://openaero.net/?s=PGNhdGVnb3J5PkludGVybWVkaWF0ZTwvPjxjbGFzcz5wb3dlcmVkPC8-PHByb2dyYW0-RnJlZSBLbm93bjwvPjxydWxlcz5DSVZBPC8-PHBvc2l0aW9uaW5nPjMwPC8-PHNlcXVlbmNlX3RleHQ-IkBBIiA0YiAiQEIiIDhoMiAiQEMiIGBgYGAyNC4nZyAiQEQiIGBgYHMnaXJwNCwzICJARSIgLTFqbzEtPC8-PGxvZ28-Q0lWQTwvPjxvYV92ZXJzaW9uPjIwMTcuMi40PC8-PGRlZmF1bHRfdmlldz5ncmlkOjU8Lz4',	

	'2018 NZAC Primary Known':
	'https://openaero.net/?s=PHNlcXVlbmNlPgo8Y2F0ZWdvcnk-UHJpbWFyeSA8L2NhdGVnb3J5Pgo8Y2xhc3M-cG93ZXJlZDwvY2xhc3M-Cjxwcm9ncmFtPktub3duIENvbXB1bHNvcnk8L3Byb2dyYW0-CjxydWxlcz5OWkFDPC9ydWxlcz4KPHBvc2l0aW9uaW5nPjM8L3Bvc2l0aW9uaW5nPgo8c2VxdWVuY2VfdGV4dD41JSBkIGl2Li5zLicnK34gLTElIC4uLidjLi4uMi4uLitgIDElIGBgK28rYCA4JSB-KzJqKyAuJzErfjwvc2VxdWVuY2VfdGV4dD4KPGxvZ28-TlpBQzwvbG9nbz4KPG9hX3ZlcnNpb24-MjAxNy4xLjE8L29hX3ZlcnNpb24-Cjwvc2VxdWVuY2U-',

	'2018 NZAC Recreational Known':
	'https://openaero.net/?s=PHNlcXVlbmNlPgo8Y2F0ZWdvcnk-UmVjcmVhdGlvbmFsPC9jYXRlZ29yeT4KPGNsYXNzPnBvd2VyZWQ8L2NsYXNzPgo8cHJvZ3JhbT5Lbm93biBDb21wdWxzb3J5PC9wcm9ncmFtPgo8cnVsZXM-TlpBQzwvcnVsZXM-Cjxwb3NpdGlvbmluZz42PC9wb3NpdGlvbmluZz4KPHNlcXVlbmNlX3RleHQ-J20yICgtMTgsMCkgOCUgfn4yan5-IH5-K2l2JydzJyd-fiB-KydoLi4nK34gfn5gYi4nICgtNiwwKSAtMiUgYGMuLi4uJzIrYGAgLTElIGBgK28rYCAnMWB-PC9zZXF1ZW5jZV90ZXh0Pgo8bG9nbz5OWkFDPC9sb2dvPgo8b2FfdmVyc2lvbj4yMDE3LjEuMTwvb2FfdmVyc2lvbj4KPGRlZmF1bHRfdmlldz5CPC9kZWZhdWx0X3ZpZXc-Cjwvc2VxdWVuY2U-',
	
	'2018 NZAC Sports Known':
	'https://openaero.net/?s=PHNlcXVlbmNlPgo8dGVhbT5OWkw8L3RlYW0-CjxjYXRlZ29yeT5TcG9ydHM8L2NhdGVnb3J5Pgo8Y2xhc3M-cG93ZXJlZDwvY2xhc3M-Cjxwcm9ncmFtPktub3duIENvbXB1bHNvcnkgMjAxODwvcHJvZ3JhbT4KPHJ1bGVzPk5aQUM8L3J1bGVzPgo8cG9zaXRpb25pbmc-MTA8L3Bvc2l0aW9uaW5nPgo8c2VxdWVuY2VfdGV4dD5jYygyKTIrYGAgKDAsMCkgMiUgYGBtMitgICgtMjUsMjUpIDIlIH4yan4-ICgwLDApIH5-ZCsrICgwLDApIGl2JzVzLiAoMCwwKSBiLic0JysrKysrfiAoLTcsMCkgLTMlIH5-JydrLi4uMjQuLi4uJycrYGAgKC0yLDApIGBgK28rYGAgKysuaC4rKyAyMn48L3NlcXVlbmNlX3RleHQ-Cjxsb2dvPk5aQUM8L2xvZ28-CjxvYV92ZXJzaW9uPjIwMTcuMS4xPC9vYV92ZXJzaW9uPgo8ZGVmYXVsdF92aWV3PkI8L2RlZmF1bHRfdmlldz4KPC9zZXF1ZW5jZT4',
	
	'2018 NZAC Intermediate Known':
	'https://openaero.net/?s=PHNlcXVlbmNlPgo8dGVhbT5OWkw8L3RlYW0-CjxjYXRlZ29yeT5JbnRlcm1lZGlhdGU8L2NhdGVnb3J5Pgo8Y2xhc3M-cG93ZXJlZDwvY2xhc3M-Cjxwcm9ncmFtPktub3duIENvbXB1bHNvcnkgMjAxODwvcHJvZ3JhbT4KPHJ1bGVzPk5aQUM8L3J1bGVzPgo8cG9zaXRpb25pbmc-MjA8L3Bvc2l0aW9uaW5nPgo8c2VxdWVuY2VfdGV4dD4zJSBvMjIgK3YuKyAoMCwwKSBpdi41cy4rYGAgKDIsLTEpIGArNGguKyt-fiAoMCwwKSB-fisrLjJmYGBgd2ArfiAoMTAsMTQpIDElIC4nMjRhMi0tLS0gKC0yLDApIC1yYzQ0ICgxNCwxNCkgYGBgK2BgcGIuJzIuKysrKyBbLTIsMF0gMiUgYGArMjRnK2AgMWoxPC9zZXF1ZW5jZV90ZXh0Pgo8bG9nbz5OWkFDPC9sb2dvPgo8b2FfdmVyc2lvbj4yMDE3LjEuMTwvb2FfdmVyc2lvbj4KPC9zZXF1ZW5jZT4',
	
	'2018 NZAC Advanced Known':
	'https://openaero.net/?s=PHNlcXVlbmNlPgo8dGVhbT5OWkw8L3RlYW0-CjxjYXRlZ29yeT5BZHZhbmNlZDwvY2F0ZWdvcnk-CjxjbGFzcz5wb3dlcmVkPC9jbGFzcz4KPHByb2dyYW0-S25vd24gQ29tcHVsc29yeSAyMDE4PC9wcm9ncmFtPgo8cnVsZXM-TlpBQzwvcnVsZXM-Cjxwb3NpdGlvbmluZz4zMDwvcG9zaXRpb25pbmc-CjxzZXF1ZW5jZV90ZXh0PicsInwiMjRgcnkyICgwLDApICsnLDIuaC4sNDguLi4uLi4rKyt-ICgtNiwwKSA0JSAnInwiOC5iYihgYGBgYCJ8IjRgYCkuMicnK35-ICgzLDApIH5-Kycnc2lycCwyZiwyLSAoLTQsMTgpIDglIC0yamlvMi0gKDEzLDApIH4tLi5oLi4ifCIzZi4uLicnICgwLDApIC0xJSArJzRgcnA2LS1-fiAoLTEzLDApIC0uLidrYGAsMmYsMjRgYGAgKDAsMCkgMSUgJydtLDMyLDZmLTwvc2VxdWVuY2VfdGV4dD4KPGxvZ28-TlpBQzwvbG9nbz4KPG9hX3ZlcnNpb24-MjAxNy4xLjE8L29hX3ZlcnNpb24-Cjwvc2VxdWVuY2U-',
	
	'2018 NZAC Unlimited Known':
	'https://openaero.net/?s=PHNlcXVlbmNlPgo8dGVhbT5OWkw8L3RlYW0-CjxjYXRlZ29yeT5VbmxpbWl0ZWQ8L2NhdGVnb3J5Pgo8Y2xhc3M-cG93ZXJlZDwvY2xhc3M-Cjxwcm9ncmFtPktub3duIENvbXB1bHNvcnkgMjAxODwvcHJvZ3JhbT4KPHJ1bGVzPk5aQUM8L3J1bGVzPgo8cG9zaXRpb25pbmc-NDA8L3Bvc2l0aW9uaW5nPgo8c2VxdWVuY2VfdGV4dD4uLDQsM2YnJ2RoKC4pLi4nJzNpZjszLi4nJyAoLTIwLDApIC8rKysuMjQuLicncGJiKGBgZmApLicsInwiMy4nLS0tLX5-IH5-LS4uJzVpc2AsMi4naXJwMywzNC1-fiAoLTEsMCkgMTMlIGBgYC0yajE1ICg0LDApIDMlIC8rLi4sOGBgdGEyaWYuLitgYGBgICcnNCwzJydoNWYuICgtMTgsMCkgLy4nJzEuJyduKDVpZiwzLiknJzUnfiA4JSBgYGArLicnM2lmLi4naWJiKGBgYGBgYGBgYGAsNCwyYGApJycsNWArYGBgYCB-fidmLidiLi4uLjI0Jzwvc2VxdWVuY2VfdGV4dD4KPGxvZ28-TlpBQzwvbG9nbz4KPG9hX3ZlcnNpb24-MjAxNy4xLjE8L29hX3ZlcnNpb24-Cjwvc2VxdWVuY2U-',
	
  '2017 CIVA Unl Free Known':
  '<sequence>' +
  '<category>Unlimited</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>\"@A\" 5s,\"|\"3ib`3,2 \"@B\" 2jio15- 2% \"@C\" ```-9iac(`6f`)3,5-```` \"@D\" 4,2fh5 \"@E\" 22m,3if,7-</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',
  
  '2017 CIVA Adv Free Known':
  '<sequence>' +
  '<category>Advanced</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>\"@A\" -isirp24,f \"@B\" 3joi3 \"@C\" 2fg44 \"@D\" 4h2 \"@E\" -3,34m,22</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',
  
  '2017 CIVA Yak 52 Free Known':
  '<sequence>' +
  '<category>Yak52</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>\"@A\" mf,1- \"@B\" -1j1- \"@C\" dh8 \"@D\" 2g24- \"@E\" -iv``5is''</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',
  
  '2017 CIVA Int Free Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>\"@A\" mf,1- \"@B\" -1j1- \"@C\" dh8 \"@D\" 2g24- \"@E\" -iv``5is''</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',
  
  '2017 CIVA-Glider Unl Free Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Unlimited</category>' +
  '<program>Free Known</program>' +
  '<positioning>15</positioning>' +
  "<sequence_text>\"@A\" ,4b.3f \"@B\" of \"@C\" c4,3if \"@D\" ``+''4ta``+`` \"@E\" -h-</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',
  
  '2017 CIVA-Glider Adv Free Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Advanced</category>' +
  '<program>Free Known</program>' +
  '<positioning>15</positioning>' +
  "<sequence_text>\"@A\" 2a2- \"@B\" -rc22 \"@C\" h4 \"@D\" 2t4 \"@E\" o1</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',

  '2017 IAC Primary Known':
  '<sequence>' +
  '<category>Primary</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>IAC</rules>' +
  '<positioning>3</positioning>' +
  "<sequence_text>d iv``6s... c.2 (-2,10) o 2j 1</sequence_text>" +
  '<logo>IAC</logo>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',

  '2017 IAC Sportsman Known':
  '<sequence>' +
  '<category>Sportsman</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>IAC</rules>' +
  '<positioning>6</positioning>' +
  "<sequence_text>cc(.,2````).'2````` 5% m2+~ 2j^ d iv``5s........ b```4.+++ ++++k24. (-2,8) o h+ 22</sequence_text>" +
  '<logo>IAC</logo>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',

  '2017 IAC Intermediate Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>IAC</rules>' +
  '<positioning>8</positioning>' +
  "<sequence_text>o,22 v iv``5s.. 4h 3> +''2f```w`+~~ (0,13) +24a2- 3> -`rc44~ (0,14) ``pb'2... ~~++24g.+` 1j1</sequence_text>" +
  '<logo>IAC</logo>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',
  
  '2017 IAC Advanced Known':
  '<sequence>' +
  '<category>Advanced</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>IAC</rules>' +
  '<positioning>12</positioning>' +
  "<sequence_text>,``24ry2++ 2h48.... 3> ,8.bB(``````,4`).2.++~ s.....irp2f,2- 6% --2jio2- -``h``3f...' '4`rp6-~~> 2> -----k2f,24...... +m32,6f-</sequence_text>" +
  '<logo>IAC</logo>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',

  '2017 IAC Unlimited Known':
  '<sequence>' +
  '<category>Unlimited</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>IAC</rules>' +
  '<positioning>20</positioning>' +
  "<sequence_text>/,4,3fdh3if;3.+++~~ 3> ~~+++24.pbB(`````f')..3..- -1% -5is,2....''irp3,34- 6% -2j15 /~~++,8ta```2if'+`` 4,3h5f /+++1n(,5if,3....)``,5 3% ```+''3if.iBb(````````,4,2`),5 fb`24.'</sequence_text>" +
  '<logo>IAC</logo>' +
  '<oa_version>2017.1</oa_version>' +
  '</sequence>',

	'2017 IAC-Glider Sportsman Known':
	"<sequence>" +
	"<team>USA</team>" +
	"<category>Sportsman</category>" +
	"<date>2017</date>" +
	"<class>glider</class>" +
	"<program>Known</program>" +
	"<rules>IAC</rules>" +
	"<positioning>15</positioning>" +
	"<sequence_text>```2.'rc pb+`` ~2j (0,9) +b -4% ~~+.2..''rdb.....+++~ ~+'2''t....' .1+ /oj+~~ h</sequence_text>" +
	"<logo>IAC</logo>" +
	"<oa_version>2017.1.1.1</oa_version>" +
	"<default_view>B</default_view>" +
	"</sequence>",
	
	'2017 IAC-Glider Intermediate Known':
	"<sequence>" +
	"<team>USA</team>" +
	"<category>Intermediate</category>" +
	"<date>2017</date>" +
	"<class>glider</class>" +
	"<program>Known</program>" +
	"<rules>IAC</rules>" +
	"<positioning>15</positioning>" +
	"<sequence_text>''22+ d'' ~iv```6s.'++++~ [0,13] ```2.g``2.- (4,0) ~~--2j- (0,9) -''2~ /~+1j1++ ```+ita````4.+````` -3% +''2..'rdb....</sequence_text>" +
	"<logo>IAC</logo>" +
	"<oa_version>2017.1.1.1</oa_version>" +
	"<default_view>B</default_view>" +
	"</sequence>",
	  
  '2017 IAC-Glider Advanced Known':
	"<sequence>" +
	"<team>USA</team>" +
	"<category>Advanced</category>" +
	"<date>2017</date>" +
	"<class>glider</class>" +
	"<program>Known</program>" +
	"<rules>IAC</rules>" +
	"<positioning>25</positioning>" +
	"<sequence_text>`s''irp-------~ 6% ``-.',24```iw,2''+`` (-2,0) o1 ~++h4'' ta`````4''+``` -2% pp (-2,0) m--~ (-3,13) -.'6+ ~~+2j2</sequence_text>" +
	"<logo>IAC</logo>" +
	"<oa_version>2017.1.1.1</oa_version>" +
	"<default_view>B</default_view>" +
	"</sequence>",

	'2017 IAC-Glider Unlimited Known':
	"<sequence>" +
	"<team>USA</team>" +
	"<category>Unlimited</category>" +
	"<date>2017</date>" +
	"<class>glider</class>" +
	"<program>Known</program>" +
	"<rules>IAC</rules>" +
	"<positioning>25</positioning>" +
	"<sequence_text>-1% .'2,1ic.'24---~~ -iv``is....'' o2- -ta````4.+```` h`3if'-~~ ~~----k.24'-- -2j15</sequence_text>" +
	"<logo>IAC</logo>" +
	"<oa_version>2017.1.1.1</oa_version>" +
	"<default_view>B</default_view>" +
	"</sequence>",

  '2017 BAeA-Glider Intermediate Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<class>glider</class>' +
  '<program>Known</program>' +
  '<rules>BAeA</rules>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>~++ig2~ ~~+h.' (2,0) 22 7% 2j (-7,0) -2% p... m- (4,0) -io- (0,0) -iv...' (-3,0) ,1 (-2,0) -1% c2....' (4,0) -1% '2'rc</sequence_text>" +
  '<logo>BAeA</logo>' +
  '<oa_version>2017.1.1</oa_version>' +
  '</sequence>',
  
  '2017 BAeA-Glider Int Free Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<class>glider</class>' +
  '<program>Free Known</program>' +
  '<rules>BAeA</rules>' +
  '<positioning>15</positioning>' +
  '<sequence_text>"@A" 2t "@B" c2 "@C" h "@D" m2 "@E" 2a</sequence_text>' +
  '<logo>BAeA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2017.1.1</oa_version>' +
  '</sequence>',

  '2016 CIVA Unl Free Known':
  '<sequence>' +
  '<category>Unlimited</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>\"@A\" /```````````+24rpp(f)24 \"@B\" ,3'pbB(,2if),34-`> \"@C\" --,2m,32,2if- \"@D\" -3jo15 \"@E\" ``+,4ita``2f'+`</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2016.1.1</oa_version>' +
  '</sequence>',
  
  '2016 CIVA Adv Free Known':
  '<sequence>' +
  '<category>Advanced</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>\"@A\" m,6;6f- \"@B\" ````6s.ik22 \"@C\" 2db``f'' \"@D\" 4h2f \"@E\" -2jo15</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2016.1.1</oa_version>' +
  '</sequence>',
  
  '2016 CIVA Yak 52 Free Known':
  '<sequence>' +
  '<category>Yak52</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>\"@A\" iv```5s. \"@B\" 'k,24 \"@C\" m2,22 \"@D\" ```2f.g' \"@E\" 1j1</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2016.1.1</oa_version>' +
  '</sequence>',
  
  '2016 CIVA Int Free Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<class>powered</class>' +
  '<program>Free Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>\"@A\" iv```5s. \"@B\" 'k,24 \"@C\" m2,22 \"@D\" ```2f.g' \"@E\" 1j1</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2016.1.1</oa_version>' +
  '</sequence>',
  
  '2016 CIVA-Glider Unl Free Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Unlimited</category>' +
  '<program>Free Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>\"@A\" ```-ta``2if.+` \"@B\" -m1 \"@C\" id2f- \"@D\" 4h \"@E\" -'k</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2016.1.1</oa_version>' +
  '</sequence>',
  
  '2016 CIVA-Glider Adv Free Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Advanced</category>' +
  '<program>Free Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>\"@A\" -d2 \"@B\" h \"@C\" 2''rdb \"@D\" q(1) \"@E\" m2</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<notes>See "Creating a Free Known sequence" in the manual</notes>' +
  '<default_view>grid:5</default_view>' +
  '<oa_version>2016.1.1</oa_version>' +
  '</sequence>',

  '2016 France Espoirs Connu':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>espoirs</category>' +
  '<program>connu</program>' +
  '<positioning>10</positioning>' +
  "<sequence_text>ed 2g iv.''5s.... m22--~ 5> ~-3j----- -,2 h....'' rp+~~ c....2...+``` ````m6</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2017.2.1</oa_version>' +
  '</sequence>',
  
  '2016 France Desavois/promotion Connu':
  '<sequence>' +
  '<category>desavois</category>' +
  '<class>powered</class>' +
  '<program>connu</program>' +
  '<rules>France</rules>' +
  '<positioning>15</positioning>' +
  "<sequence_text>2h..-~~ -```m2-~~ 5> -iv.'is..~ 9> ``k''24 ,4''pb.''+` (0,0) ~~``8'b..''+` 4> mf- ~-``,22``-~ 12% 3> ````-2j2-``` ~-24~</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2017.2.1</oa_version>' +
  '</sequence>',
  
  '2016 France National2 Connu1':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>national2</category>' +
  '<program>connu_1</program>' +
  '<positioning>20</positioning>' +
  "<sequence_text>ej ~+8b- -,4h4..'' 5> .'m34,5 ...''sirp24 h4 \"|\"8pb..''-~ -o24 m1,22- (-8,14) 6% ``-2jio15 > ,2fg</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2017.2.1</oa_version>' +
  '</sequence>',
  
  '2016 France National2 Connu2':
  '<sequence>' +
  '<category>national2</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>20</positioning>' +
  "<sequence_text>ed ``-1g ```+.''s''irp- ```-.irc2-`` (0,5) -2if,22 h8.' 2> '2pb```4.'' 13% ```+````````,48```rc+```````````` o44 dh.....++++~~ 4> ''m''8,34~ ``+3joi3~~></sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2017.2.1</oa_version>' +
  '</sequence>',
  
  '2016 France Doret/excellence Connu1':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_1</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>-ita``,24+```` 34h'3if''~~ 10> fbb(`,4'')3-> -2% -is'irp6if+`` -2% ++3jo15------~ 9> ~---pb.'',8+````> `+cc(1)f+````` ``+,4',2''b...''4. ``+1,2frc3,34</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2017.2.1</oa_version>' +
  '</sequence>',
  
  '2016 France Doret/excellence Connu2':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>ed ,frdb24.'+`````` ,3b.'3f'' '',24ta.'' 8> ',if`n(.'',2.....)2`+ [0,0] 6sirp,if,1-~ ````-3joi3-~~ 13> ---`8`h..'+++~ 3> .4,3m2,6 `+``````,2f``rc',88+``````````</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2017.2.1</oa_version>' +
  '</sequence>',
      
  '2016 BAeA-Glider Int Free Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<date>2016</date>' +
  '<class>glider</class>' +
  '<program>Free Known</program>' +
  '<rules>BAeA</rules>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  '<notes>Base Figures for Intermediate Free Known 2016</notes>' +
    '<sequence_text>"@A" 2t "@B" c2 "@C" h "@D" m2 "@E" 2a</sequence_text>' +
  '<logo>BAeA</logo>' +
  '<oa_version>2016.1.3</oa_version>' +
  '<default_view>grid:5</default_view>' +
  '</sequence>',
  
  '2015 CIVA Unl Known':
  '<sequence>' +
  '<category>Unlimited</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>,3,3if''dh..3if,3.++++ ',24,2ita.6...++ `4,3if`ry...',22.+++++ +fbb(3.')5--> -is,1.irp,2f,`6- ~----3joi15++++++++++++ +,4b..f..++++> 1% ~++++3,7m9if- --1c3f;5</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2015 CIVA Adv Known':
  '<sequence>' +
  '<category>Advanced</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>2dh(4)3f.+++ ,24''b1..+++ ~+f.rdb.6....+``````` +++n(,24'),2------ 6> -iv,5is....' ++.4'rp,9----- ----,8h..3...++++ 1% ++++1m6,6f- -3j3-</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2015 CIVA Yak 52 Known':
  '<sequence>' +
  '<category>Yak52</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>/of +++k.,24....+ m,2,22++++ 6> +2fa+~ (-11,12) ++`,4b.'+`` h`,8''~~ 'rp1 1% 2> ``+````2f.g``````,22.'+` (-1,17) 1j5-</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2015 CIVA Int Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>/of +++k.,24....+ m,2,22++++ 6> +2fa+~ (-11,12) ++`,4b.'+`` h`,8''~~ 'rp1 1% 2> ``+````2f.g``````,22.'+` (-1,17) 1j5-</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2015 CIVA-Glider Unl Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Unlimited</category>' +
  '<program>Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>/2fic.2-- --a6-- (3,10) -ita``4. ~+,4pb o2if- 3% ``-2joi51+`` (5,4) c.',24</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2015 CIVA-Glider Adv Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Advanced</category>' +
  '<program>Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>``s.irp--- --2j-- (0,8) -1- -t...'+ o,44 ita``,4. h4.+~ ++b```+ 3% +2j> d</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2015 BAeA Beginners Known':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>BAeA</rules>' +
  '<category>Beginners</category>' +
  '<program>Known</program>' +
  '<positioning>10</positioning>' +
  "<sequence_text>/id o `+c.,2.++ ~+++h... 3% oj 1</sequence_text>" +
  '<logo>BAeA</logo>' +
  '<oa_version>2016.1.3</oa_version>' +
  '</sequence>',
  
  '2015 BAeA Standard Known':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>BAeA</rules>' +
  '<category>Standard</category>' +
  '<program>Known</program>' +
  '<positioning>15</positioning>' +
  "<sequence_text>ed ++,2rc d iv```6s...++++ +c.2` (-3,7) o h``4' ~~+oj+ 4> ~~+++m2 id... 1</sequence_text>" +
  '<logo>BAeA</logo>' +
  '<oa_version>2016.1.3</oa_version>' +
  '</sequence>',
  
  '2015 France Espoirs Connu':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>espoirs</category>' +
  '<program>connu</program>' +
  '<positioning>10</positioning>' +
  "<sequence_text>d iv'6s..'+++ +h.. o ~m- (0,13) -22- 2% -2j- -2 6% 2j~ ~+c2...'+`` 3% ```+```````2``rc``````+~ 6> m2</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2016.1.4</oa_version>' +
  '</sequence>',
  
  '2015 France Desavois Connu':
  '<sequence>' +
  '<category>desavois</category>' +
  '<class>powered</class>' +
  '<program>connu</program>' +
  '<rules>France</rules>' +
  '<positioning>15</positioning>' +
  "<sequence_text>ed ircf- -iv.'is. 4> 24h.''- ``-c'',2''-`` 2> -pb.. 6> 8b...+``` > `+`,4k`2`+``` 2% `+m2,1+`` -4% ``+1jo1</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2016.1.4</oa_version>' +
  '</sequence>',
  
  '2015 France National2 Connu1':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>national2</category>' +
  '<program>connu_1</program>' +
  '<positioning>20</positioning>' +
  "<sequence_text>d2,24 ``+ivs.'- (-11,7) -k2- -``4b.' 24h4 .'mf- (-5,13) -`8,5-` 2% ``-2jio15+`` -2% 5> ``+44c'',2.'+`` (-1,7) ,4pb'' 3> .,4''rp22~></sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2016.1.4</oa_version>' +
  '</sequence>',
  
  '2015 France National2 Connu2':
  '<sequence>' +
  '<category>national2</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>20</positioning>' +
  "<sequence_text>ej '24'h'4.> ~v'4'-- --iv.5is.'~ o22 '2'dh....''--- 15> -m2- ``-....'irc+`` 4,3- 6% ````-2joi15+``` 5% > ```+````````2f```rc`+`````` 2> ~~+```k.'',24'+`` `+d24,2</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2016.1.4</oa_version>' +
  '</sequence>',
  
  '2015 France Doret Connu1':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_1</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>-ita``,24+```` 34h'3if''~~ 10> fbb(`,4'')3-> -2% -is'irp6if+`` -2% ++3jo15------~ 9> ~---pb.'',8+````> `+cc(1)f+````` ``+,4',2''b...''4. ``+1,2frc3,34</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2016.1.4</oa_version>' +
  '</sequence>',
  
  '2015 France Doret Connu2':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>ej .',3ta1'' ifb..24.'+``` 4> ~~1n(.48....''),8+ 3> ```7s`ik```24```-`` ```-,2a4,3+`` (-3,13) ```+ac(2)6f,6-````````` (-6,16) ````-3joi3---~ 3> ~--4h2if.' ,48g,f</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>2016.1.4</oa_version>' +
  '</sequence>',
  
  '2014 CIVA Unl Known':
  '<sequence>' +
  '<category>Unlimited</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>2;6ift.24.++++ .4,3'ta.,1.+++++ 3> +2if``rp(42)4,3--- (0,12) 4% ~---2jo1- -----pn(`5f,5.......)2+ 4> ``+`````5s,2..ib```34-> -''2if;1``iw(,24),9f++++ +++,3fh'3..+++++ +++,5,7m,f;6-</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2014 CIVA Adv Known':
  '<sequence>' +
  '<category>Advanced</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>/,4,3.rdb24..- 4> -2m22-~~ (0,16) -24ipp8 5s..irpf;22---- ----3j3- (-8,12) -h3f. qq 2> ```rp(,1)2 (-1,20) ,2frc88</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2014 CIVA Yak 52 Known':
  '<sequence>' +
  '<category>Yak52</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>eja /,4rp,4,3----- 4> -.rc2,6+ 4> +++.n(,24')+` ``+5s....++ +++b.',4.'+ of +h...++ 2% ++++44m,24 1j1</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2014 CIVA Int Known':
  '<sequence>' +
  '<category>Intermediate</category>' +
  '<class>powered</class>' +
  '<program>Known</program>' +
  '<rules>CIVA</rules>' +
  '<positioning>30</positioning>' +
  "<sequence_text>eja /,4rp,4,3----- 4> -.rc2,6+ 4> +++.n(,24')+` ``+5s....++ +++b.',4.'+ of +h...++ 2% ++++44m,24 1j1</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2014 CIVA-Glider Unl Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Unlimited</category>' +
  '<program>Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>''24irc +iv``s....--~ -1% ``-b2if+` ``+ta``4''+``` 4h -1% `+of -3% `+c...'- -2jio15</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2014 CIVA-Glider Adv Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Advanced</category>' +
  '<program>Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>id2- -,1,2 -2% 2> db`,2'' (0,15) `````+ita+```` ```+pb``,4' h`4.++++ -1% ++++p(,2..)++ -1% ++c''24.</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2014 France Espoirs Connu':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>espoirs</category>' +
  '<program>connu</program>' +
  '<positioning>10</positioning>' +
  "<sequence_text>k2 6> ~m2 ivs...'' `2rc (-9,16) m- -'',1''- -2% 6> -3j----~~ > -2' > ~+3j h...~ o</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2014 France Desavois Connu':
  '<sequence>' +
  '<category>desavois</category>' +
  '<class>powered</class>' +
  '<program>connu</program>' +
  '<rules>France</rules>' +
  '<positioning>15</positioning>' +
  "<sequence_text>ed v- [0,0] -ivis... [-3,1] 2pb...'' 2% 4h4.' [-4,0] -1% mf- [4,13] -2jo2- 1% -`2c''- [3,0] ~-c.....'' [-4,0] m24 2,1-</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2014 France National2 Connu1':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>national2</category>' +
  '<program>connu_1</program>' +
  '<positioning>20</positioning>' +
  "<sequence_text>>~~---''1rc 10> m22- -iv5is.. 2> ~~,2pb...,4 `+mf-~~ 10> 12% ````-2jio2-``` -1,2 c,24....''+``` ``+o2-` -4h.4.'' cc(2)2 rp/</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2014 France National2 Connu2':
  '<sequence>' +
  '<category>national2</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>20</positioning>' +
  "<sequence_text>ed 2% 22g1- 5% `-iv.is.'~ 2% 5> mf,1- (0,19) ``-2c2.'' 24pb4.''+`` ~~8'h...'-~~> 2> -o2 5% 2> m-` -`2if,1+`` -2% ``+3jio3</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2014 France Doret Connu1':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_1</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>ej /-.''24ita8> 'fbb(.''2) -1% ''9s.''irp6f.,6```- 4> -2% -3joi3-~> -8h....2...'> 8> ..''3,8''m48,24'' -2% 2fg2- (-20,22) -iac(2,if) -1% 2,24m1,if-``</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2014 France Doret Connu2':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>ej /.,3ta-```> 6> -2kif,2. 6> ~ifn(...''2....)4- 5> --``,7is.'ibb(`````,2)....''> 17> m2f,1+`` -2% ``+3j15- -h,4.> (-30,13) ````+2rcc(`1`,2f`) ```,24.'g``f</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.5.0</oa_version>' +
  '</sequence>',
  
  '2013 CIVA Adv Known':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>CIVA</rules>' +
  '<category>Advanced</category>' +
  '<program>Known</program>' +
  '<positioning>30</positioning>' +
  "<sequence_text>,24pbb(3)'4--- ---isin(1),4~ +8b.2f 3> ~~2m,8,3-~ (-4,12) -2joi15~~ ~hf.~~ ~``````2f``rc,24``````````- (0,10) -o,6 ++m32,6f-</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 CIVA Unl Known':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>CIVA</rules>' +
  '<category>Unlimited</category>' +
  '<program>Known</program>' +
  '<positioning>40</positioning>' +
  "<sequence_text>+,2,2f'zt,2f;2+~ 2> ~~7,3m,5if,3 [0,19] 24ip1 3> 2% ~```,s,3if...ibpb(```3)..,3f,4'> ifh5f.. 3> .8'rp(44)9> [0,8] ~++3joi15-----~ [-3,2] -.,4taf.> 34pb3^.</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 CIVA-Glider Unl Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Unlimited</category>' +
  '<program>Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>/2ig ita```3f'- -h4 o,2if- 5% -````````24``rc````- -48 2joi2</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 CIVA-Glider Adv Known':
  '<sequence>' +
  '<class>glider</class>' +
  '<rules>CIVA</rules>' +
  '<category>Advanced</category>' +
  '<program>Known</program>' +
  '<positioning>15</positioning>' +
  '<harmony>10</harmony>' +
  "<sequence_text>ivs ta4+````/ b.,4 h'. o1 c..- -2j- -,24 2t. 2j</sequence_text>" +
  '<logo>CIVA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 BAeA Int Known':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>BAeA</rules>' +
  '<category>Intermediate</category>' +
  '<program>Known</program>' +
  '<positioning>20</positioning>' +
  "<sequence_text>ej /`,4`rp2~~ 5% ~~2j2 1% +24ic,24`````- [0,14] --1ic. 2> +++2j (0,10) d2- -iv`is.++++ +++4h.4.++ 22 m2 ,2f-</sequence_text>" +
  '<logo>BAeA</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 France Espoirs Connu':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>espoirs</category>' +
  '<program>connu</program>' +
  '<positioning>10</positioning>' +
  "<sequence_text>ed 2g iv5s..''^ -2% m,2+~ 4> +3j~ -3% c''2''+``` (-2,12) o ``+h.''+ 6> m-~~ ~-2j- (3,7) -1-</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 France Desavois Connu':
  '<sequence>' +
  '<category>desavois</category>' +
  '<class>powered</class>' +
  '<program>connu</program>' +
  '<rules>France</rules>' +
  '<positioning>15</positioning>' +
  "<sequence_text>d24- -iv'is'' 2h.- -3% -m+~~ 6% 3> 2j2 (2,6) -3% ``+2,2c2...''+`` ````+,4pb+```` 2> +4k.'2' +m2 2f-</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 France National2 Connu1':
  '<sequence>' +
  '<class>powered</class>' +
  '<rules>France</rules>' +
  '<category>national2</category>' +
  '<program>connu_1</program>' +
  '<positioning>20</positioning>' +
  "<sequence_text>-d1- -iv5is/ ,4h o1 2> ~+'k''2if...''+``` ```+2fg``2- (-8,3) 12% ```-2joi2-``` -4,3 /``h4' ~~8b+++ ++m2,44</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 France National2 Connu2':
  '<sequence>' +
  '<category>national2</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>20</positioning>' +
  "<sequence_text>v'4'/ 7s''irp2~~ ```4,5c....'-`` ``-2dh...+` cc+``` 2> mf;2+`` (2,13) 3% 2joi2 /~+```k24..'+`` ``+o44+`` 5% ```+````````48```rc > +++rp2,24</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 France Doret Connu1':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_1</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>~~-,fpb`,2'' '',24ita.'+````` 8> /n(.''6if..''),\"|\"4' ``7s..ik``2f```- 14% ~-48a34,3-``` `````-2ac(2)6f,6-`````` (-5,13) -3% ~-3jo3---~/ ~~-''8'h'+++> ++``24.'g``2,if'-</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>',
  
  '2013 France Doret Connu2':
  '<sequence>' +
  '<category>doret</category>' +
  '<class>powered</class>' +
  '<program>connu_2</program>' +
  '<rules>France</rules>' +
  '<positioning>40</positioning>' +
  "<sequence_text>ej 3h`2f'' '8`ta,4.- -2% -',if.rdb.'22..''+````` 5> +ifn(.,2....)````- -2% 3> -'6is..irp''f'',9- -3jio3-~~/ (10,14) -3% ~---''4rp3,5---> 4> -------``k..'f.'+``` -1% `+1,24m88</sequence_text>" +
  '<logo>FFAvoltige</logo>' +
  '<oa_version>1.4.1</oa_version>' +
  '</sequence>'

}
