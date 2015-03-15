# Introduction #

OpenAero is, as it's name suggests, open software.
The source code is freely accessible and anyone is invited to submit improvements and additions to the code.

If you're interested in doing this, there is some useful information on several subjects to be found below.

[Getting started](Developers#Getting_started.md)

[Creating rule checking files](Developers#Creating_rule_checking_files.md)

[Installing OpenAero locally](Developers#Installing_locally.md)

[Adding/editing OpenAero code](Developers#Adding/editing_code.md)

[Functioning in a nutshell](Developers#Functioning_in_a_nutshell.md)


# Getting started #

OpenAero is completely written in Javascript. Currently OpenAero is mostly tested on Google Chrome. Functioning on other browsers is considered a bonus.
The reasons for this are:
  * Chrome offers best support for modern HTML5 techniques that are needed for the functioning of complex web apps
  * Chrome is highly standards compliant. Even though some of it's features are not supported in other browsers now, it's expected that this will happen in the future
  * Chrome is available on all modern OSs, including mobile
  * Testing and coding for multiple browsers takes time which is better spent at developing OpenAero functionality

All drawing is done in SVG images. SVG has several advantages over other formats:
  * Completely Open Source
  * Rescalable to any size without loss of quality
  * Files are in XML format which means they are human readable and easily managed by software

To develop new functions of OpenAero, with the exception of new rules, a good understanding of Javascript, CSS, the HTML5 DOM and SVG are important. There are many resources and programming tips to be found online.

The current stable version of OpenAero can be found at http://openaero.net and http://www.openaero.net . The development version is located at http://devel.openaero.net and is updated very frequently.


# Creating rule checking files #

For creating rule checking files, knowledge of Javascript or SVG are not required. What is required:
  * A thorough understanding of the rules to be coded
  * Understanding of Regular Expressions (regex)

All rule files are named ruleYY-XXX.js where YY is the year and XXX the rules name. For Glider the rules name always starts with "glider-". So the rules for 2013 CIVA Glider are in rules13-glider-civa.js

In the [downloads section](https://code.google.com/p/open-aero/downloads/list), a PHP script can be found which can convert OLAN rules files to OpenAero format.

A description of the format can be found at the beginning of the rulesYY.js file, which is available in the [source code](http://code.google.com/p/open-aero/source/browse/#git%2Frules). In the source code you can also find various other (national) rule files to help you get started.

As of OpenAero version 1.3.4 it's possible to import rule files into OpenAero from the browser. This is done through _Import rules file_ which can be found in the _Tools_ menu.
A message will be presented indicating success or failure. The rules that have been loaded can also be checked through Chrome's Javascript Console (in **Chrome's** Tools menu).

After checking your rule file for correctness, you can send it to openaero.devel@gmail.com to have it added to the next version of OpenAero.


# Installing OpenAero locally #

For regular users, OpenAero should be run from www.openaero.net . This assures the latest version is always available.
Developers however may want a local copy to see how changes to the code work out. Explanations on how to create a local copy of the source code can be found on the [Source Checkout page](http://code.google.com/p/open-aero/source/checkout).

Once a copy has been made, OpenAero can be opened by opening the local index.html page from the OpenAero directory. Alternatively, the OpenAero directory can be put under your own webserver's directory and accessed by going to http://localhost/OpenAero


# Adding/editing OpenAero code #

Before diving right in, please take some time to get familiar with OpenAero's code. All of it is heavily commented so it should be possible to get a quick grasp of it workings. The main files are:

BASE:
  * **index.html**    Main page. Holds menus, predefined dialogs etc
CONFIGURATION:
  * **config.js**        All configuration options etc
  * **examples.js**      Example sequences
  * **figuresYY.js**     Figure definitions for year YY
  * **logo.js**          Logo definitions, mostly as SVG
  * **language/en.js**   Holds English user interaction texts
  * **language/_XX_.js** Holds language XX user interaction texts
  * **rules/rulesYY.js** Default rules and explanation of rules files format
  * **rules/rulesYY-_rules_.js** Specific (country) rule sets
SOFTWARE:
  * **OpenAero.js**   The core of the system. All functions, user interaction etc
  * **jszip.js**      Used to create ZIP files (e.g. for _Save figs separate_)
  * **sprintf.js**    Used to create text with substitutions
  * **vkbeautify.js** Used to create good-looking XML output
STYLING:
  * **OpenAero.css**  Main css file with all general declarations
  * **desktop.css**   CSS for desktop use only
  * **mobile.css**    CSS for mobile use only

So with respect to programming, most action takes place in OpenAero.js. To improve readability and prevent code repetitions many separate functions are used. Any action will usually have the effect of calling a number of these functions.

Most actions will initially be triggered by "click", "change" etc... event handlers on an element in index.html. These handlers are all specified in function _addEventListeners_ in OpenAero.js. E.g. clicking on "Clear sequence" will trigger onClick="clearSequence()" which will start the corresponding function in OpenAero.js.

# Functioning in a nutshell #

Allthough specific elements can get quite complex, the basic functioning of OpenAero is simple:
  * Read the sequence string
  * Check which kind of draw is requested (Form A, B, C, grid)
  * Convert the string to correctly oriented figures
  * put these in the **figures** global object, including extra information
  * Check the rules when applicable
  * Do the actual drawing from the **figures** object
When a figure is updated through the figure editor, or the sequence is changed through another point-and-click method:
  * Update the sequence string
  * Start from 'Read the sequence string'