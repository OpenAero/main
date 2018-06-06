// main.js
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
    
// **************************************************************
// *
// *           BASE VARIABLES
// *
// **************************************************************

// Define window objects for saving files
if (!window.BlobBuilder && window.WebKitBlobBuilder) {
  window.BlobBuilder = window.WebKitBlobBuilder;
}
if (!window.requestFileSystem && window.webkitRequestFileSystem) {
  window.requestFileSystem = window.webkitRequestFileSystem;
}
var savefile = [];
// interval id
var intervalID = [];
// svg Name Space
var svgNS = "http://www.w3.org/2000/svg";
// xlink Name Space for including image in svg
var xlinkNS = "http://www.w3.org/1999/xlink";

// True_Drawing_Angle is used for correctly drawing on Y axis
var True_Drawing_Angle;
// set y axis offset to the default
var yAxisOffset = yAxisOffsetDefault;
// Attitude goes from 0 to 359
// 0 = upright LTR, 45 = 45 up LTR, 90 = vertical up belly right etc
var Attitude = 0;
// Direction goes from 0 to 359 and indicates the direction the aircraft
// would have if it was pulled to level flight. It is combined with Attitude
// to define overall direction allowing integers for all whole degrees
// 0 = LTR, 90 = front to back, 180 = RTL, 270 = back to front. But when
// Attitude is inverted directions are reversed!
var Direction = 0;
// NegLoad indicates whether the current vertical has a negative load
// 0 = positive, 1 = negative
var NegLoad = 0;
// goRight determines in which direction a vertical 1/4 roll to the
// X axis will go. True = right (=upwind on form B), false = left
var goRight = true;
// goFront determines direction for 1/4 roll to Y axis
var goFront = true;
// updateAxisDir determines if it should be updated in changeAtt
var updateAxisDir = true;
// X is x position on canvas
var X = 0;
// Y is y position on canvas
var Y = 0;
// Scale is the current scaling factor
// 1 = default, .5 is 50%, 2 is 200%
var scale = 1;
// activeForm holds the currently displayed form
// activeForm == 'C' is true when form C is drawn. It is used in various
// functions to ensure exact mirroring
var activeForm = 'B';
// activeSequence holds the current sequence string, separate figures,
// XML string with all sequence info, undo, redo and filename
var activeSequence = {'text': '',
                      'figures': [],
                      'xml': null,
                      'undo': [],
                      'redo': [],
                      'addUndo': true
                      };
// referenceSequence is used for checking Free (Un)known sequence against
// reference
var referenceSequence = {figures: []};
// sequenceSaved is true when the current sequence has been saved. It
// starts out true as we start with an empty sequence
var sequenceSaved = true;
// sequenceText will hold the sequence_text input field object
var sequenceText;
// sportingClass will hold the class select object
var sportingClass;
// fileName will hold the fileName span
var fileName;
// figureK holds the current total figureK
var figureK = 0;
// userText global
var userText = [];
// fileList is used for operations that involve multiple files
var fileList = [];

/** figures is an object that will hold all figure data of the sequence
format is: figures[i].xxx where:
i is the figure nr (including drawing only figs)
xxx is a specific element, being: 
aresti               the Aresti nrs of the figure
bBox                 bounding rectangles of the figure and it's elements
comments             comments set before the figure by "xxx"
additional           true for additional figures
draggable            boolean to indicate if draggable or not
entryAxis            the entry axis (X or Y) of the figure
entryAtt             entry Attitude
entryDir             entry Direction
exitAxis             exit axis
exitAtt              exit Attitude
exitDir              exit Direction
figNr                the base figure index in fig[]
k                    the K factors of the figure
paths                all the drawing paths
rollInfo             roll information
seqNr                number in sequence
startPos             the starting position
string               as in sequence text line
unknownFigureLetter  letter for Free (Un)known figures
subSeq               subsequence number, used in Free (Un)known Designer
switchFirstRoll      multi switch figures. true/false/null
*/
var figures = [];

// firstFigure is true when the figure is the first of the (sub)sequence
var firstFigure = true;
// additionals holds the number of additional figures in the sequence
var additionals = 0;
// unknownFigureLetter holds the letter assigned to the upcoming figure
var unknownFigureLetter = false;
// Get ellipse perameters for perspective drawing
var perspective_param = getEllipseParameters(yAxisOffsetDefault,yAxisScaleFactor);
// logoImg holds the active logo image
var logoImg = false;
// figureStart holds the start positions (x,y) of all figures
var figureStart = [];
// selectFigure holds variables for the currently selected figure
var selectedFigure = {'id':null};
// SVGRoot is the sequence SVG object
var SVGRoot = null;
// These variables are used for dragging and dropping
var TrueCoords = null;
var GrabPoint = null;
var dragTarget = null;
// confirmFunction is used as a function reference of confirm dialog
var confirmFunction;

// set platform OS for Android and iOS
platform.android = /Android/i.test(navigator.userAgent);
platform.ios = /i(Pad|Phone|Pod)/i.test(navigator.userAgent);

// platform.mobile is true when running on a mobile device (e.g. tablet)
/** SET TO TRUE FOR TESTING MOBILE */
platform.mobile = ((typeof window.orientation !== 'undefined') ||
	(navigator.userAgent.indexOf('IEMobile') !== -1) || false);

// platform.touch is true on touch enabled devices
platform.touch = (('ontouchstart' in window)
  || (navigator.maxTouchPoints > 0)
  || (navigator.msMaxTouchPoints > 0));

// browserString identifies the browser
var browserString = '';

// storage is true when localStorage is enabled (checked by doOnLoad)
// start with true to activate the check
var storage = true;

// loadComplete is true when doOnLoad has completed
var loadComplete = false;

// multi is used for keeping track of multiple sequence check globals
// processing : true when one of multiple sequences is processed
// total      : total number 
// count      : current number
// savedSeq   : sequence active before starting multi check
var multi = {'processing':false, 'total':0, 'count':0, 'savedSeq':''};

// saveData is used to hold data for filesaving
var saveData = {blob: '', ext: ''};

// variables for OLAN Humpty Bump check. Only used when opening OLAN
// files
var OLANBumpBugCheck = false;
var OLANBumpBugFigs = [];
var OLANNBugFigs = [];
// variables for automatic conversion of roll directions in OLAN files
var OLANSequence = false;
var inFigureXSwitchFig = Infinity;

// seqCheckAvail indicates if sequence checking is available for a
// rule/cat/seq combination
var seqCheckAvail = [];
// variables used for checking sequence validity
var checkConv = [];        // conversions
var checkAllowRegex = [];  // regexes for allowed figures
var checkAllowCatId = [];  // Catalogue Numbers for allowed figures
var checkCatGroup = [];
var checkFigGroup = [];
var checkRule = [];
var figCheckLine = [];
var defRules = [];
var rulesActive = false;   // Are rules active?
var infoCheck = [];        // Seq info fields to be filled out when saving or printing
var figureLetters = '';    // Letters that can be assigned to individual figures
var additionalFig = {'max': 0, 'totalK': 0};    // Additional figures, max and K
var ruleSuperFamily = [];  // Array of rules for determining figure SF
var ruleSeqCheck = [];     // rules for checking complete OpenAero seq string

// savedReference saves the active Reference sequence when it is
// automatically changed by the reference directive in rules
var savedReference = '';

/** fig will hold all figures in the catalog, and queue figures in the
form fig[i].xxx where xxx is:
base    : the pattern for each figure as it's written in the sequence,
           with + and - but without any rolls
aresti  : the Aresti number for each figure 
rolls   : shows which roll positions are possible for each figure
          types are:
          1=full roll, 2=half roll, 3=any roll, 4=any roll or spin, 9=no roll(~)
kpwrd   : the powered K factor for each figure
kglide  : the glider K factor for each figure
draw    : the drawing instructions for each figure
group   : to which group every figure belongs
unknownFigureLetter : the figure letter, if applicable
// Modif GG v2016.1.4 Start
next    : to chain the lines having the same value of .aresti
            0 or undefined  = not set ; positive value = line number of the next instance ; -1 last instance
*/
var fig = [];

// rule_K holds the new figure K and the figure index for which a K
// change has been set in a rule file in the form rule_K[i].xxx where xxx is:
// .i_fig  : the index in fig for each figure with a changed K
// .new_K  : the new K factor for the figure
var rule_K = [];
// aresti_K holds the original aresti K and the figure index for which a
// K change has been set in fig array in the form aresti_K[key].xxx
// where key is Aresti number and xxx is:
// .i_fig   : the index in fig for each figure with a changed K
// .saved_K : the saved K factor for the figure
var aresti_K = [];
var aresti_K_class ; // "class" (kpwrd or kglider) of the active rules for setting the corresponding K in fig.
// Modif GG v2016.1.4 End

// fuFig is similar to fig, holding figures for the Free (Un)known Designer
var fuFig = [];

// figBaseLookup holds the same data as fig.base, but with the base as
// key and corresponding figure(s) as an array for fast lookup
var figBaseLookup = [];
// figGroup holds the figure group data
var figGroup = [];
// rollBase holds the base for each roll (roll, snap, spin) element
var rollBase = [];
// rollAresti is the Aresti number for each roll
var rollAresti = [];
// rollKPwrd is the K factor for each roll for Powered
var rollKPwrd = [];
// rollKGlider is the K factor for each roll for gliders
var rollKGlider = [];
// alertMsgs will hold any alerts about figures and the sequence
var alertMsgs = [];
// alertMsgsRules will hold the Rulebook reference for alerts
var alertMsgRules = [];
// errors is used for tracking startup errors
var errors = [];

/************************************************
 * 
 * HTML5 DOM shims
 * 
 ************************************************/
 
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {
	
	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (
		   !("classList" in document.createElement("_")) 
		|| document.createElementNS
		&& !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
	) {
	
	(function (view) {
	
	"use strict";
	
	if (!('Element' in view)) return;
	
	var
		  classListProp = "classList"
		, protoProp = "prototype"
		, elemCtrProto = view.Element[protoProp]
		, objCtr = Object
		, strTrim = String[protoProp].trim || function () {
			return this.replace(/^\s+|\s+$/g, "");
		}
		, arrIndexOf = Array[protoProp].indexOf || function (item) {
			var
				  i = 0
				, len = this.length
			;
			for (; i < len; i++) {
				if (i in this && this[i] === item) {
					return i;
				}
			}
			return -1;
		}
		// Vendors: please allow content code to instantiate DOMExceptions
		, DOMEx = function (type, message) {
			this.name = type;
			this.code = DOMException[type];
			this.message = message;
		}
		, checkTokenAndGetIndex = function (classList, token) {
			if (token === "") {
				throw new DOMEx(
					  "SYNTAX_ERR"
					, "The token must not be empty."
				);
			}
			if (/\s/.test(token)) {
				throw new DOMEx(
					  "INVALID_CHARACTER_ERR"
					, "The token must not contain space characters."
				);
			}
			return arrIndexOf.call(classList, token);
		}
		, ClassList = function (elem) {
			var
				  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
				, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
				, i = 0
				, len = classes.length
			;
			for (; i < len; i++) {
				this.push(classes[i]);
			}
			this._updateClassName = function () {
				elem.setAttribute("class", this.toString());
			};
		}
		, classListProto = ClassList[protoProp] = []
		, classListGetter = function () {
			return new ClassList(this);
		}
	;
	// Most DOMException implementations don't allow calling DOMException's toString()
	// on non-DOMExceptions. Error's toString() is sufficient here.
	DOMEx[protoProp] = Error[protoProp];
	classListProto.item = function (i) {
		return this[i] || null;
	};
	classListProto.contains = function (token) {
		return ~checkTokenAndGetIndex(this, token + "");
	};
	classListProto.add = function () {
		var
			  tokens = arguments
			, i = 0
			, l = tokens.length
			, token
			, updated = false
		;
		do {
			token = tokens[i] + "";
			if (!~checkTokenAndGetIndex(this, token)) {
				this.push(token);
				updated = true;
			}
		}
		while (++i < l);
	
		if (updated) {
			this._updateClassName();
		}
	};
	classListProto.remove = function () {
		var
			  tokens = arguments
			, i = 0
			, l = tokens.length
			, token
			, updated = false
			, index
		;
		do {
			token = tokens[i] + "";
			index = checkTokenAndGetIndex(this, token);
			while (~index) {
				this.splice(index, 1);
				updated = true;
				index = checkTokenAndGetIndex(this, token);
			}
		}
		while (++i < l);
	
		if (updated) {
			this._updateClassName();
		}
	};
	classListProto.toggle = function (token, force) {
		var
			  result = this.contains(token)
			, method = result ?
				force !== true && "remove"
			:
				force !== false && "add"
		;
	
		if (method) {
			this[method](token);
		}
	
		if (force === true || force === false) {
			return force;
		} else {
			return !result;
		}
	};
	classListProto.replace = function (token, replacement_token) {
		var index = checkTokenAndGetIndex(token + "");
		if (~index) {
			this.splice(index, 1, replacement_token);
			this._updateClassName();
		}
	}
	classListProto.toString = function () {
		return this.join(" ");
	};
	
	if (objCtr.defineProperty) {
		var classListPropDesc = {
			  get: classListGetter
			, enumerable: true
			, configurable: true
		};
		try {
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		} catch (ex) { // IE 8 doesn't support enumerable:true
			// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
			// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
			if (ex.number === undefined || ex.number === -0x7FF5EC54) {
				classListPropDesc.enumerable = false;
				objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
			}
		}
	} else if (objCtr[protoProp].__defineGetter__) {
		elemCtrProto.__defineGetter__(classListProp, classListGetter);
	}
	
	}(self));
	
	}
	
	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.
	
	(function () {
		"use strict";
	
		var testElement = document.createElement("_");
	
		testElement.classList.add("c1", "c2");
	
		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function(method) {
				var original = DOMTokenList.prototype[method];
	
				DOMTokenList.prototype[method] = function(token) {
					var i, len = arguments.length;
	
					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}
	
		testElement.classList.toggle("c3", false);
	
		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;
	
			DOMTokenList.prototype.toggle = function(token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};
	
		}
	
		// replace() polyfill
		if (!("replace" in document.createElement("_").classList)) {
			DOMTokenList.prototype.replace = function (token, replacement_token) {
				var
					  tokens = this.toString().split(" ")
					, index = tokens.indexOf(token + "")
				;
				if (~index) {
					tokens = tokens.slice(index);
					this.remove.apply(this, tokens);
					this.add(replacement_token);
					this.add.apply(this, tokens.slice(1));
				}
			}
		}
	
		testElement = null;
	}());

}// * End classlist.js

// add getElementsByClassName for older browsers
if(!document.getElementsByClassName) {
  document.getElementsByClassName = function(className) {
    return this.querySelectorAll("." + className);
  };
}

/* 
 * steganography.js v1.0.1
 * 
 * Copyright (C) 2012, Peter Eigenschink (http://www.peter-eigenschink.at/)
 * Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
 */
(function(g) {
  var util = {
    "isPrime" : function(n) {
      if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false;
      if (n%2==0) return (n==2);
      if (n%3==0) return (n==3);
      var m=Math.sqrt(n);
      for (var i=5;i<=m;i+=6) {
        if (n%i==0) return false;
        if (n%(i+2)==0) return false;
      }
      return true;
    },
    "findNextPrime" : function(n) {
      for(var i=n; true; i+=1)
        if(util.isPrime(i)) return i;
    },
    "sum" : function(func, end, options) {
      var sum = 0;
      options = options || {};
      for(var i = options.start || 0; i < end; i+=(options.inc||1))
        sum += func(i) || 0;

      return (sum === 0 && options.defValue ? options.defValue : sum);
    },
    "product" : function(func, end, options) {
      var prod = 1;
      options = options || {};
      for(var i = options.start || 0; i < end; i+=(options.inc||1))
        prod *= func(i) || 1;

      return (prod === 1 && options.defValue ? options.defValue : prod);
    },
    "createArrayFromArgs" : function(args,index,threshold) {
      var ret = new Array(threshold-1);
      for(var i = 0; i < threshold; i+=1)
        ret[i] = args(i >= index ? i+1:i);

      return ret;
    }
  };
  
  function Cover() {};

  Cover.prototype = {
    "config": {
      "t": 3,
      "threshold": 1,
      "codeUnitSize": 16,
      "args": function(i) { return i+1; },
      "messageDelimiter": function(modMessage,threshold) {
                var delimiter = new Array(threshold*3);
                for(var i = 0; i < delimiter.length; i+=1)
                  delimiter[i] = 255;
                
                return delimiter;
              },
      "messageCompleted": function(data, i, threshold) {
                var done = true;
                for(var j = 0; j < 16 && done; j+=1) {
                  done = done && (data[i+j*4] === 255);
                }
                return done;
              }
    },
    "encode": function(message, image, options) {
      options = options || {};
      var config = this.config;

      var shadowCanvas = document.createElement('canvas'),
        shadowCtx = shadowCanvas.getContext('2d');

      shadowCanvas.style.display = 'none';

      if(image.length) {
        var dataURL = image;
        image = new Image();
        image.src = dataURL;
      }
      shadowCanvas.width = options.width || image.width;
      shadowCanvas.height = options.height || image.height;
      if(options.height && options.width) {
        shadowCtx.drawImage(image, 0, 0, options.width, options.height );
      } else {
        shadowCtx.drawImage(image, 0, 0);
      }
      
      var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
        data = imageData.data;
      // bundlesPerChar ... Count of full t-bit-sized bundles per Character
      // overlapping ... Count of bits of the currently handled character which are not handled during each run
      var t = options.t || config.t,
        threshold = options.threshold || config.threshold,
        codeUnitSize = options.codeUnitSize || config.codeUnitSize,
        bundlesPerChar = codeUnitSize/t >> 0,
        overlapping = codeUnitSize%t,
        messageDelimiter = options.messageDelimiter || config.messageDelimiter,
        args = options.args || config.args,
        prime = util.findNextPrime(Math.pow(2,t)),
        decM, oldDec, oldMask, modMessage = [], left, right;

      for(var i=0; i<=message.length; i+=1) {
        // dec ... UTF-16 Unicode of the i-th character of the message
        // curOverlapping ... The count of the bits of the previous character not handled in the previous run
        // mask ... The raw initial bitmask, will be changed every run and if bits are overlapping
        var dec = message.charCodeAt(i) || 0, curOverlapping = (overlapping*i)%t, mask;
        if(curOverlapping > 0 && oldDec) {
          mask = Math.pow(2,t-curOverlapping) - 1;
          oldMask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -curOverlapping));
          left = (dec & mask) << curOverlapping;
          right = (oldDec & oldMask) >> (codeUnitSize - curOverlapping);
          modMessage.push(left+right);

          if(i<message.length) {
            mask = Math.pow(2,2*t-curOverlapping) * (1 - Math.pow(2, -t));
            for(var j=1; j<bundlesPerChar; j+=1) {
              decM = dec & mask;
              modMessage.push(decM >> (((j-1)*t)+(t-curOverlapping)));
              mask <<= t;
            }
            if((overlapping*(i+1))%t === 0) {
              mask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2,-t));
              decM = dec & mask;
              modMessage.push(decM >> (codeUnitSize-t));
            }
            else if(((((overlapping*(i+1))%t) + (t-curOverlapping)) <= t)) {
              decM = dec & mask;
              modMessage.push(decM >> (((bundlesPerChar-1)*t)+(t-curOverlapping)));
            }
          }
        }
        else if(i<message.length) {
          mask = Math.pow(2,t) - 1;
          for(var j=0; j<bundlesPerChar; j+=1) {
            decM = dec & mask;
            modMessage.push(decM >> (j*t));
            mask <<= t;
          }
        }
        oldDec = dec;
      }

      // Write Data
      var offset, index, subOffset, delimiter = messageDelimiter(modMessage,threshold);
      for(offset = 0; (offset+threshold)*4 <= data.length && (offset+threshold) <= modMessage.length; offset += threshold) {
        var q, qS=[];
        for(var i=0; i<threshold && i+offset < modMessage.length; i+=1) {
          q = 0;
          for(var j=offset; j<threshold+offset && j<modMessage.length; j+=1)
            q+=modMessage[j]*Math.pow(args(i),j-offset);
          qS[i] = (255-prime+1)+(q%prime);
        }
        for(var i=offset*4; i<(offset+qS.length)*4 && i<data.length; i+=4)
          data[i+3] = qS[(i/4)%threshold];
        
        subOffset = qS.length;
      }
      // Write message-delimiter
      for(index = (offset+subOffset); index-(offset+subOffset)<delimiter.length && (offset+delimiter.length)*4<data.length; index+=1)
        data[(index*4)+3]=delimiter[index-(offset+subOffset)];
      // Clear remaining data
      for(var i=((index+1)*4)+3; i<data.length; i+=4) data[i] = 255;

      imageData.data = data;
      shadowCtx.putImageData(imageData, 0, 0);

      return shadowCanvas;
    },
    "decode": function(image, options) {
      options = options || {};
      var config = this.config;
      
      var t = options.t || config.t, threshold = options.threshold || config.threshold,
        codeUnitSize = options.codeUnitSize || config.codeUnitSize, prime = util.findNextPrime(Math.pow(2, t)),
        imageData, data, q, args = options.args || config.args, modMessage = [], 
        messageCompleted = options.messageCompleted || config.messageCompleted;

      if(!t || (t < 1 && t > 7)) throw "Error: Parameter t = " + t + " is not valid: 0 < t < 8";
        
      var shadowCanvas = document.createElement('canvas'),
        shadowCtx = shadowCanvas.getContext('2d');

      shadowCanvas.style.display = 'none';
      document.body.appendChild(shadowCanvas);

      if(image.length) {
        var dataURL = image;
        image = new Image();
        image.src = dataURL;
      }
      shadowCanvas.width = options.width || image.width;
      shadowCanvas.height = options.width || image.height;
      if(options.height && options.width) {
        shadowCtx.drawImage(image, 0, 0, options.width, options.height );
      } else {
        shadowCtx.drawImage(image, 0, 0);
      }

      imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);
      data = imageData.data;

      if (threshold === 1) {
        for(var i=3, done=false; !done && i<data.length && !done; i+=4) {
          done = messageCompleted(data, i, threshold);
          if(!done) modMessage.push(data[i]-(255-prime+1));
        }
      } else {
        for(var k = 0, done=false; !done; k+=1) {
          q = [];
          for(var i=(k*threshold*4)+3; i<(k+1)*threshold*4 && i<data.length && !done; i+=4) {
            done = messageCompleted(data,i,threshold);
            if(!done) q.push(data[i]-(255-prime+1)); // at Array index (i-((k*threshold*4)+3))/4
          }
          if(q.length === 0) continue;
          // Calculate the coefficients which are the same for any order of the variable, but different for each argument
          // i.e. for args[0] coeff=q[0]*(args[1]-args[2])*(args[1]-args[3])*...(args[1]-args[threshold-1])*...*(args[threshold-1]-args[1])*...*(args[threshold-1]-args[threshold-2])
          var variableCoefficients = (function(i) {
            if(i >= q.length) return [];
            return [q[i]*
            util.product(function(j) {
            if(j != i) {
              return util.product(function(l) {
              if(l != j) return (args(j) - args(l));
              }, q.length);
            }
            }, q.length)].concat(arguments.callee(i+1));
          }(0));
          // Calculate the coefficients which are different for each order of the variable and for each argument
          // i.e. for order=0 and args[0] coeff=args[1]*args[2]*...*args[threshold-1]
          var orderVariableCoefficients = function(order, varIndex) {
            var workingArgs = util.createArrayFromArgs(args,varIndex,q.length), maxRec = q.length - (order+1);
            return (function(startIndex, endIndex, recDepth) {
            var recall = arguments.callee;
            return util.sum(function(i) {
              if(recDepth < maxRec)
              return workingArgs[i]*recall(i+1,startIndex+order+2,recDepth+1);
            }, endIndex, {"start": startIndex, "defValue": 1});
            }(0,order+1,0));
          };
          // Calculate the common denominator of the whole term
          var commonDenominator = util.product(function(i) {
            return util.product(function(j) {
            if(j != i) return (args(i) - args(j));
            }, q.length);
          }, q.length);

          for(var i = 0; i < q.length; i+=1) {
            modMessage.push((((Math.pow(-1,q.length-(i+1))*util.sum(function(j) {
            return orderVariableCoefficients(i,j)*
            variableCoefficients[j];
            }, q.length))%prime)+prime)%prime); // ?divide by commonDenominator?
          }
        }
      }

      var message = "", charCode = 0, bitCount = 0, mask = Math.pow(2, codeUnitSize)-1;
      for(var i = 0; i < modMessage.length; i+=1) {
        charCode += modMessage[i] << bitCount;
        bitCount += t;
        if(bitCount >= codeUnitSize) {
          message += String.fromCharCode(charCode & mask);
          bitCount %= codeUnitSize;
          charCode = modMessage[i] >> (t-bitCount);
        }
      }
      if(charCode !== 0) message += String.fromCharCode(charCode & mask);

      return message;
    },
    "getHidingCapacity" : function(image, options) {
      options = options || {};
      var config = this.config;
    
      var width = options.width || image.width,
        height = options.height || image.height,
        t = options.t || config.t,
        codeUnitSize = options.codeUnitSize || config.codeUnitSize;
      return t*width*height/codeUnitSize >> 0;
    }
  };
  g.steganography = g.steg = new Cover();
})(window);

/* iOS drag & drop support */
/*Copyright (c) 2013 Tim Ruffles

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.*/

var iosDragDropShim = { enableEnterLeave: true,
                        openaero: true,
                        copy: true };

(function(doc) {

  log = noop; // noOp, remove this line to enable debugging

  var coordinateSystemForElementFromPoint;

  function main(config) {
    config = config || {};

    coordinateSystemForElementFromPoint = navigator.userAgent.match(/OS [1-4](?:_\d+)+ like Mac/) ? "page" : "client";

    /** changed to apply patch to all touchscreens */
    // var div = doc.createElement('div');
    // var dragDiv = 'draggable' in div;
    // var evts = 'ondragstart' in div && 'ondrop' in div;    
    // var needsPatch = !(dragDiv || evts) || /iPad|iPhone|iPod/.test(navigator.userAgent);
    var needsPatch = platform.touch;
    
    log((needsPatch ? "" : "not ") + "patching html5 drag drop");

    if(!needsPatch) return;

		iosDragDropShim.enabled = true;
		
    if(!config.enableEnterLeave) {
      DragDrop.prototype.synthesizeEnterLeave = noop;
    }

    doc.addEventListener("touchstart", touchstart);
  }

  function DragDrop(event, el) {

    this.touchPositions = {};
    this.dragData = {};
    this.dragDataTypes = [];
    this.el = el || event.target;
    if (iosDragDropShim.copy) {
      var origPos = this.el.getBoundingClientRect();
      var newNode = this.el.cloneNode (true);
      this.copy = document.createElement('div');
      this.copy.classList.add ('fuSequence');
      if (newNode.tagName === 'TD') {
        var table = document.createElement('table');
        var tr = document.createElement('tr');
        this.copy.appendChild(table).appendChild(tr).appendChild(newNode);
      } else {
        if (newNode.tagName === 'TABLE') newNode.classList.add ('dragDropCopy');
        this.copy.appendChild (newNode);
      }
      doc.body.appendChild(this.copy);
      var copyPos = this.copy.getBoundingClientRect();

      writeTransform (this.copy, origPos.left - copyPos.left, origPos.top - copyPos.top);
    }
      
    event.preventDefault();

    log("dragstart");

    this.dispatchDragStart();
    this.elTranslation = readTransform(this.copy);
    this.listen()

  }

  DragDrop.prototype = {
    listen: function() {
      var move = onEvt(doc, "touchmove", this.move, this);
      var end = onEvt(doc, "touchend", ontouchend, this);
      var cancel = onEvt(doc, "touchcancel", cleanup, this);

      function ontouchend(event) {
        this.dragend(event, event.target);
        cleanup(this);
      }
      function cleanup(e) {
        log("cleanup");
        e.touchPositions = {};
        e.dragDataTypes = [];
        e.el = e.dragData = null;
        if (e.copy) {
          log('removing copy');
          doc.body.removeChild (e.copy);
          e.copy = null;
        }
        return [move, end, cancel].forEach(function(handler) {
          return handler.off();
        });
      }
    },
    move: function(event) {
      var deltas = { x: [], y: [] };

      [].forEach.call(event.changedTouches,function(touch, index) {
        var lastPosition = this.touchPositions[index];
        if (lastPosition) {
          deltas.x.push(touch.pageX - lastPosition.x);
          deltas.y.push(touch.pageY - lastPosition.y);
        } else {
          this.touchPositions[index] = lastPosition = {};
        }
        lastPosition.x = touch.pageX;
        lastPosition.y = touch.pageY;
      }.bind(this))

      this.elTranslation.x += average(deltas.x);
      this.elTranslation.y += average(deltas.y);
      if (this.copy) {
        this.copy.style["pointer-events"] = "none";
        this.copy.style["z-index"] = "999999";
        writeTransform(this.copy, this.elTranslation.x, this.elTranslation.y);
      } else {
        this.el.style["pointer-events"] = "none";
        this.el.style["z-index"] = "999999";
        writeTransform(this.el, this.elTranslation.x, this.elTranslation.y);
      }

      this.synthesizeEnterLeave(event);
    },
    synthesizeEnterLeave: function(event) {
      var target = elementFromTouchEvent(this.copy ? this.copy : this.el, event);
      if (target != this.lastEnter) {
        if (this.lastEnter) {
          this.dispatchLeave(event);
        }
        this.lastEnter = target;
        if (this.lastEnter) {
          this.dispatchEnter(event);
        }
      }
      if (this.lastEnter) {
        this.dispatchOver(event);
      }
    },
    dragend: function(event) {

      // we'll dispatch drop if there's a target, then dragEnd. If drop
      // isn't fired or isn't cancelled, we'll snap back
      // drop comes first http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#drag-and-drop-processing-model
      log("dragend");

      if (this.lastEnter) {
        this.dispatchLeave(event);
      }

      var target = elementFromTouchEvent(this.copy ? this.copy : this.el,event);

      if (target) {
        log("found drop target " + target.tagName);
        this.dispatchDrop(target, event);
      } else {
        log("no drop target, scheduling snapBack")
        once(doc, "dragend", this.snapBack, this);
      }

      var dragendEvt = doc.createEvent("Event");
      dragendEvt.initEvent("dragend", true, true);
      this.el.dispatchEvent(dragendEvt);
    },
    dispatchDrop: function(target, event) {
      var snapBack = true;

      var dropEvt = doc.createEvent("Event");
      dropEvt.initEvent("drop", true, true);

      var touch = event.changedTouches[0];
      var x = touch[coordinateSystemForElementFromPoint + 'X'];
      var y = touch[coordinateSystemForElementFromPoint + 'Y'];
      dropEvt.offsetX = x - target.x;
      dropEvt.offsetY = y - target.y;

      dropEvt.dataTransfer = {
        types: this.dragDataTypes,
        getData: function(type) {
          return this.dragData[type];
        }.bind(this)
      };
      dropEvt.preventDefault = function() {
        // https://www.w3.org/Bugs/Public/show_bug.cgi?id=14638 - if we
        // don't cancel it, we'll snap back
        if (iosDragDropShim.copy) {
          if (this.copy) {
            this.copy.style["z-index"] = "";
            this.copy.style["pointer-events"] = "auto";
          }
        } else {
          this.el.style["z-index"] = "";
          this.el.style["pointer-events"] = "auto";
          writeTransform(this.el, 0, 0);
        }
      }.bind(this);

      once(doc, "drop", function() {
        log("drop event not canceled");
        if (snapBack) this.snapBack();
      },this);

      if (this.copy) {
        log('removing copy');
        doc.body.removeChild (this.copy);
        this.copy = null;
      }

      target.dispatchEvent(dropEvt);
    },
    dispatchEnter: function(event) {

      var enterEvt = doc.createEvent("Event");
      enterEvt.initEvent("dragenter", true, true);
      enterEvt.dataTransfer = {
        types: this.dragDataTypes,
        getData: function(type) {
          return this.dragData[type];
        }.bind(this)
      };

      var touch = event.changedTouches[0];
      enterEvt.pageX = touch.pageX;
      enterEvt.pageY = touch.pageY;

      this.lastEnter.dispatchEvent(enterEvt);
    },
    dispatchOver: function(event) {

      var overEvt = doc.createEvent("Event");
      overEvt.initEvent("dragover", true, true);
      overEvt.dataTransfer = {
        types: this.dragDataTypes,
        getData: function(type) {
          return this.dragData[type];
        }.bind(this)
      };

      var touch = event.changedTouches[0];
      overEvt.pageX = touch.pageX;
      overEvt.pageY = touch.pageY;

      this.lastEnter.dispatchEvent(overEvt);
    },
    dispatchLeave: function(event) {

      var leaveEvt = doc.createEvent("Event");
      leaveEvt.initEvent("dragleave", true, true);
      leaveEvt.dataTransfer = {
        types: this.dragDataTypes,
        getData: function(type) {
          return this.dragData[type];
        }.bind(this)
      };

      var touch = event.changedTouches[0];
      leaveEvt.pageX = touch.pageX;
      leaveEvt.pageY = touch.pageY;

      this.lastEnter.dispatchEvent(leaveEvt);
      this.lastEnter = null;
    },
    snapBack: function() {
      log ('Snap back');
      if (iosDragDropShim.copy) {
        if (this.copy) {
          doc.body.removeChild (this.copy);
          this.copy = null;
        }
      } else if (this.el) {
        this.el.style["pointer-events"] = "auto";
        this.el.style["-webkit-transition"] = "none";
        this.el.style["z-index"] = "";
        writeTransform(this.el, 0, 0);
      }
    },
    dispatchDragStart: function() {
      var evt = doc.createEvent("Event");
      evt.initEvent("dragstart", true, true);
      evt.dataTransfer = {
        setData: function(type, val) {
          this.dragData[type] = val;
          if (this.dragDataTypes.indexOf(type) == -1) {
            this.dragDataTypes[this.dragDataTypes.length] = type;
          }
          return val;
        }.bind(this),
        dropEffect: this.copy ? "copy" : "move"
      };
      this.el.dispatchEvent(evt);
    }
  }

  // event listeners
  function touchstart(evt) {
    var el = evt.target;
    do {
      if (el.getAttribute('draggable') === 'true') {
        evt.preventDefault();
        new DragDrop(evt,el);
      } else if (iosDragDropShim.openaero) {
        if (el.classList.contains ('removeFigureButton')) {
          evt.preventDefault();
          handleFreeRemove (evt, el);
          return false;
        } else if (el.classList.contains ('fuFigure') ||
          el.classList.contains ('fuFigureMulti') ||
          el.classList.contains ('additionalFigure') ||
          el.classList.contains ('additionalFigureMulti')) {
          evt.preventDefault();
          selectFigureFu (el.className.match(regexFuFigNr)[1]);
          return false;
        }
      }
    } while((el = el.parentNode) && el !== doc.body);
    return true;
  }

  // DOM helpers
  function elementFromTouchEvent(el,event) {
    var touch = event.changedTouches[0];
    var target = doc.elementFromPoint(
      touch[coordinateSystemForElementFromPoint + "X"],
      touch[coordinateSystemForElementFromPoint + "Y"]
    );
    return target;
  }

  function readTransform(el) {
    var transform = el.style["-webkit-transform"];
    var x = 0;
    var y = 0;
    var match = /translate\(\s*(-?\d+)[^,]*,[^-\d]*(-?\d+)/.exec(transform);
    if(match) {
      x = parseInt(match[1],10);
      y = parseInt(match[2],10);
    }
    return { x: x, y: y };
  }

  function writeTransform(el, x, y) {
    var transform = el.style["-webkit-transform"].replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g, '');
    el.style["-webkit-transform"] = transform + " translate(" + x + "px," + y + "px)";
  }

  function onEvt(el, event, handler, context) {
    if (context) handler = handler.bind(context);
    el.addEventListener(event, handler);
    return {
      off: function() {
        return el.removeEventListener(event, handler);
      }
    };
  }

  function once(el, event, handler, context) {
    if (context) handler = handler.bind(context);
    function listener(evt) {
      handler(evt);
      return el.removeEventListener(event,listener);
    }
    return el.addEventListener(event,listener);
  }


  // general helpers
  function log(msg) {
    console.log(msg);
  }

  function average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((function(s, v) {
      return v + s;
    }), 0) / arr.length;
  }

  function noop() {}

  main(window.iosDragDropShim);

})(document);
/* end iOS drag & drop support */

/*! iNoBounce - v0.1.5
* https://github.com/lazd/iNoBounce/
* Copyright (c) 2013 Larry Davis <lazdnet@gmail.com>; Licensed BSD */
(function(global) {
	// Stores the Y position where the touch started
	var startTouch = {x: 0, y: 0};

	// Store enabled status
	var enabled = false;

	var handleTouchmove = function(evt) {
		// Get the element that was scrolled upon
		var el = evt.target;
		var doPreventDefault = true;

		// Check all parent elements for scrollability
		while (el !== document.body && el !== document) {
			// Get some style properties
			var style = window.getComputedStyle(el);

			if (!style) {
				// If we've encountered an element we can't compute the style for, get out
				break;
			}

			// Ignore range input element
			if (el.nodeName === 'INPUT' && el.getAttribute('type') === 'range') {
				return;
			}

			var scrolling = style.getPropertyValue('-webkit-overflow-scrolling');
			var overflowX = style.getPropertyValue('overflow-x');
			var overflowY = style.getPropertyValue('overflow-y');
			var height = parseInt(style.getPropertyValue('height'), 10);

			// Determine if the element should scroll
			var isScrollableX = scrolling === 'touch' &&
				(overflowX === 'auto' || overflowX === 'scroll');
			var isScrollableY = scrolling === 'touch' &&
				(overflowY === 'auto' || overflowY === 'scroll');
			var canScrollX = el.scrollWidth > el.offsetWidth;
			var canScrollY = el.scrollHeight > el.offsetHeight;

			if ((isScrollableX && canScrollX) || (isScrollableY && canScrollY)) {
				// Get the current X and Y position of the touch
				var curX = evt.touches ? evt.touches[0].screenX : evt.screenX;
				var curY = evt.touches ? evt.touches[0].screenY : evt.screenY;

				// Determine if the user is trying to scroll past the top or bottom
				// In this case, the window will bounce, so we have to prevent scrolling completely
				var isAtTop = (startTouch.y <= curY && el.scrollTop === 0);
				var isAtBottom = (startTouch.y >= curY && el.scrollHeight - el.scrollTop === height);

				// Stop a bounce bug when at the bottom or top of the scrollable element
				if (!canScrollY || isAtTop || isAtBottom) {
					/** evt.preventDefault();*/
					doPreventDefault = true;
					// Apply X scroll when applicable
					if (startTouch.x !== curX) {
						var dx = startTouch.x - curX;
						el.scrollLeft += dx;
						startTouch.x -= dx;
					}
				} else doPreventDefault = false;

/**
				// No need to continue up the DOM, we've done our job
				return;
				*/
				// continue up the DOM to check for scrollable parents
			}

			// Test the next parent
			el = el.parentNode;
		}

		// Stop the bouncing -- no parents are scrollable
		if (doPreventDefault) evt.preventDefault();
	};

	var handleTouchstart = function(evt) {
		// Store the first X and Y position of the touch
		startTouch.x = evt.touches ? evt.touches[0].screenX : evt.screenX;
		startTouch.y = evt.touches ? evt.touches[0].screenY : evt.screenY;
	};
	
	var enable = function() {
		// Listen to a couple key touch events
		window.addEventListener('touchstart', handleTouchstart, false);
		window.addEventListener('touchmove', handleTouchmove, {passive: false}); // add {passive: false} to fig iOS 11.3 bug
		enabled = true;
	};

	var disable = function() {
		// Stop listening
		window.removeEventListener('touchstart', handleTouchstart, false);
		window.removeEventListener('touchmove', handleTouchmove);
		enabled = false;
	};

	var isEnabled = function() {
		return enabled;
	};

	// Enable by default if the browser supports -webkit-overflow-scrolling
	// Test this by setting the property with JavaScript on an element that exists in the DOM
	// Then, see if the property is reflected in the computed style
	var testDiv = document.createElement('div');
	document.documentElement.appendChild(testDiv);
	testDiv.style.WebkitOverflowScrolling = 'touch';
	var scrollSupport = 'getComputedStyle' in window && window.getComputedStyle(testDiv)['-webkit-overflow-scrolling'] === 'touch';
	document.documentElement.removeChild(testDiv);

	if (scrollSupport) {
		enable();
	}

	// A module to support enabling/disabling iNoBounce
	var iNoBounce = {
		enable: enable,
		disable: disable,
		isEnabled: isEnabled
	};

	if (typeof module !== 'undefined' && module.exports) {
		// Node.js Support
		module.exports = iNoBounce;
	}
	if (typeof global.define === 'function') {
		// AMD Support
		(function(define) {
			define('iNoBounce', [], function() { return iNoBounce; });
		}(global.define));
	}
	else {
		// Browser support
		global.iNoBounce = iNoBounce;
	}
}(this));
/* end iNoBounce.js */

// encode_utf8 returns a string that can be correctly used by btoa
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

// decode_utf8 returns a string that can be correctly used by atob
function decode_utf8( s ) {
  return decodeURIComponent(escape(s));
}

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement)
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define([], function() {
    return saveAs;
  });
}

/* HTMLCanvasElement.toBlob() polyfill */
if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}
 
/**************************************************************
 *
 *           FUNCTIONS
 *
 *************************************************************/

/**************************************************************
 * 
 * Cordova functions
 * 
 *************************************************************/

// cordovaHandleOpenURL handles opening a sequence file as received from
// URL (iOS)
function cordovaHandleOpenURL (url) {
	window.resolveLocalFileSystemURI (
		url, 
		function (fileEntry) {
			fileEntry.file (
					function (file) {
						openFile (file, 'Sequence');
					},
					function (error) {
						console.log (error);
					}
				)
			}, 
			function (error) {
				console.log(error);
		}
	)
};

// cordovaHandleIntent handles opening a sequence file as received from
// Intent (Android)
function cordovaHandleIntent (intent) {	// intent.action android.intent.action.MAIN
	if (intent.hasOwnProperty('data')) {
		window.FilePath.resolveNativePath(intent.data, function(path) {
			window.resolveLocalFileSystemURL (path, function (fileEntry) {
				fileEntry.file (function(file) {
					openFile (file, 'Sequence');
				});
			});
		}, function(error) {alertBox (userText.saveDeviceFirst)});
	} /*else {
		window.FilePath.resolveNativePath(intent.clipItems[0].uri, function(path) {
			console.log(path);
			openFile(path, 'Sequence');
		}, function(error) {console.log(error)});
		
	}*/
}

// cordovaSave uses the socialsharing plugin to provide options for
// saving/exporting a file
function cordovaSave (blob, filename) {
	/**
	var onSuccess = function(result) {
	  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
	  console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
	}
	
	var onError = function(msg) {
	  console.log("Sharing failed with message: " + msg);
	}
	*/
	
	// use socialsharing to save or send file through dataURL.
	var reader = new FileReader();
	reader.onload = function(evt) {
		var options = {
			subject: filename,
			// Add filename to dataURL with df:
			files: ['df:' + filename + ';' + evt.target.result]
		}
		if (document.getElementById ('addSequenceLink').checked) {
			options.message = userText.emailHeader + '\r\n\r\n' +
				'https://openaero.net/?s=' + encodeBase64Url(activeSequence.xml);
		}
		window.plugins.socialsharing.shareWithOptions (options);
	}
	reader.readAsDataURL (blob);
	
	/** before 2018.1.9 strategy: create file and share
	// request filesystem
	window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSystem) {
		// succes! Create file
		fileSystem.root.getFile(filename, {create: true, exclusive: false}, function(entry) {
			// succes! Create writer and write
			entry.createWriter(function(writer) {
				// write done?
				writer.onwrite = function(evt) {
					// Yes! Share file
					var message = userText.emailHeader + '\n\n' + 
			      'https://openaero.net/?s=' + encodeBase64Url(activeSequence.xml);
					window.plugins.socialsharing.shareWithOptions (
						{
							message: message, // not supported on some apps (Facebook, Instagram)
						  subject: filename, // fi. for email
							files: [entry.nativeURL] // an array of filenames either locally or remotely
						},
						onSuccess,
						onError);
				};
				writer.write(blob);
			}, function(error) {
				console.log(error);
			});
		}, function(error){
			console.log(error);
		});
	},
	function(error){
		console.log(error);
	});
	*/
}

// cordovaPdf opens a pdf in an external viewer
function cordovaPdf (uri, title) {
	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + '/www/' + uri, function(fileEntry) {
		window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
			fileEntry.copyTo(dirEntry, uri.split('/').pop(), function(newFileEntry) {
				var file = newFileEntry.nativeURL;
				// open file
				cordova.plugins.fileOpener2.open(file, 'application/pdf');
	     });
	  });
	});
}

/************************************************
 * User interface functions
 ************************************************/
 
// switchSmallMobile switches between smallMobile and regular layout
function switchSmallMobile () {
	hideFigureSelector(); /* to prevent leftBlock from being invisible */
	saveSettingsStorage();
  platform.smallMobile = !platform.smallMobile;
  // select no figure
  if (selectedFigure.id !== null) selectFigure (false);
  // load CSS depending on smallMobile, largeMobile or desktop version
  var link = document.getElementById('desktopLargeMobileCSS');
  var svg = document.getElementById('svgContainer');
  var showHandles = document.getElementById('showHandles');
  if (platform.smallMobile) {
		if (platform.cordova && screen.orientation) {
			screen.orientation.lock('portrait');
		}
    // set viewport
    // windowResize();
    // hide Free (Un)known designer menu item
    document.getElementById('t_fuDesigner').parentNode.classList.add ('noDisplay');
    // set smallMobile css
    link.setAttribute('href', 'css/smallMobile.css');
    // show sequence tab
    document.getElementById('tab-svgContainer').classList.remove ('noDisplay');
    // hide sequence svg and move to before fuFigures
    svg.classList.add('hidden');
    var fuFigures = document.getElementById('fuFigures');
    fuFigures.parentNode.insertBefore (svg, fuFigures);
    // move grid column setting to settings
    var el = document.getElementById ('t_gridView');
    el.parentNode.appendChild (document.getElementById ('gridColumnsContainer'));
    // move figureSelector to previous sibling of main
    document.getElementById ('main').parentNode.insertBefore (
	    document.getElementById ('figureSelector'),
	    document.getElementById ('main'));
    // show tiny form A
    miniFormA = 'tiny';
  } else {
		if (platform.cordova && screen.orientation) {
			screen.orientation.unlock();
		}

		// restore viewport
    //document.getElementById('viewport').setAttribute('content',
	  //  'width=device-width,viewport-fit=cover');

    document.getElementById('t_fuDesigner').parentNode.classList.remove ('noDisplay');
    link.setAttribute('href', 'css/desktop-largeMobile.css');

    // hide sequence tab
    document.getElementById('tab-svgContainer').classList.add ('noDisplay');

    // restore sequence container
    svg.removeAttribute('style');
    svg.classList.remove('hidden');
    var placing = document.getElementById('svgContainerPlacing');
    placing.parentNode.insertBefore (svg, placing);

    // move grid column setting to grid info
    var el = document.getElementById ('gridInfoContents');
    el.insertBefore (document.getElementById ('gridColumnsContainer'), el.firstChild);

    selectTab ('tab-sequenceInfo');

    // move figureSelector to previous sibling of main
    document.getElementById ('main').insertBefore (
	    document.getElementById ('figureSelector'),
	    document.getElementById ('main').firstChild);
	    
    // show mini form A
    miniFormA = true;
    
    checkSequenceChanged();
  }
  // set correctly sized plus min elements
  addPlusMinElements();
  // set undo/redo button size
  setUndoRedo ();
  // clear all figure chooser svgs
  for (var i = 0; i < fig.length; i++) {
    if (fig[i]) delete fig[i].svg;
  }
  setFormLayout (activeForm);
  // redraw sequence
  draw();
  // Activate the first figure selection group
  changeFigureGroup();
}    

// mobileInterface adjusts interface for mobile devices
function mobileInterface () {

	document.getElementById('desktopCSS').setAttribute('href', 'css/mobile.css');

	// update menu
	var topBlock = document.getElementById ('topBlock');
	var mainMenu = document.getElementById ('mainMenu');
	topBlock.parentNode.insertBefore (mainMenu, topBlock);

	// move some Tools menu items to main and hide Tools menu
	document.getElementById('menu').insertBefore (
		document.getElementById('t_fuDesigner').parentNode,
		document.getElementById('menuHelp')
	);
	document.getElementById('t_fuDesigner').parentNode.classList.remove ('divider');
	document.getElementById('menu').insertBefore (
		document.getElementById('settings'),
		document.getElementById('menuHelp')
	);
	document.getElementById('settings').classList.remove ('divider');
	document.getElementById('menuTools').classList.add ('noDisplay');
	
	// move Free (Un)known Designer finalize button
	document.getElementById('topBlock').insertBefore (
		document.getElementById ('t_finalizeSequence'),
		document.getElementById ('undoRedo').nextSibling);
    
	// update header for mobile menus
	mobileMenuHeader();
	
	// set rightArrow for all submenus
	var menuNodes = document.getElementById ('menu').childNodes;
	for (var i = 0; i < menuNodes.length; i++) {
		if (menuNodes[i].tagName) {
			var ul = menuNodes[i].getElementsByTagName ('UL');
			if (ul.length > 0) {
				var iNode = document.createElement('i');
				iNode.setAttribute ('class', 'material-icons rightArrow');
				menuNodes[i].insertBefore (iNode, ul[0]);
			}
		}
	}
	
  // disable or change some items for iOS
  if (platform.ios) {
    // hide all save options, except on Cordova app
    if (!platform.cordova) {
	    document.getElementById('t_saveSequence').parentNode.classList.add ('noDisplay');
	    document.getElementById('t_saveFigsSeparate').parentNode.classList.add ('noDisplay');
	    document.getElementById('t_saveQueueFile').parentNode.classList.add ('noDisplay');
		}
    
    document.getElementById('t_saveAsSVG').classList.add ('noDisplay');
    
    // print margins
    document.getElementById('saveImageVariables').parentNode.classList.remove ('divider');
    document.getElementById('printMargins').classList.add ('noDisplay');
    
    // fix leftblock scroll bug
    var leftBlock = document.getElementById ('leftBlockContainer');
    leftBlock.style.height = '1px';
    setTimeout (function() {leftBlock.style.removeProperty('height');}, 200);
  }
}

// menuMobileHeader updates mobile menu header items
function mobileMenuHeader () {
	addHeader (document.getElementById ('menu'));
	
	function addHeader (menu) {
		var nodes = menu.childNodes;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].tagName === 'LI') {
				// copy menu title from previous menu
			  var ul = nodes[i].getElementsByTagName ('UL')[0];
			  if (ul) {
				  if (ul.getElementsByClassName ('menuHeader')[0]) {
				    ul.removeChild (ul.getElementsByClassName ('menuHeader')[0]);
				  }
				  var li = document.createElement ('li');
				  li.classList.add ('menuHeader');
				  li.innerHTML = '<span class="previousMenu">' +
            '<i class="material-icons leftArrow"></i>' +
					  ((menu === document.getElementById ('menu')) ? 'Menu' :
					    nodes[i].parentNode.parentNode.getElementsByTagName ('SPAN')[0].innerHTML) +
				    '</span>' +
				    '<span class="currentMenu">' +
				    ul.parentNode.getElementsByTagName ('SPAN')[0].innerHTML +
				    '</span>';
				  ul.insertBefore (li, ul.firstChild);
				  li.firstChild.addEventListener ('mousedown', function(e){
						this.parentNode.parentNode.parentNode.classList.remove ('active');
						e.stopPropagation();
					});
				  addHeader (ul);
				}
			}
		}
	}
}

// panelHeader sets correct panel header for expanded or collapsed panel 
function panelHeader (el, empty) {
	var grandPa = el.parentNode.parentNode;
	if (grandPa.classList.contains ('expanded')) {
		el.innerText = '';
	} else {
		var inputs = grandPa.getElementsByClassName('panelHeader');
		var values = [];
		for (var i = 0; i < inputs.length; i++) {
			if ((inputs[i].tagName === 'SELECT') && userText[inputs[i].value]) {
				values.push (userText[inputs[i].value]);
			} else values.push(inputs[i].value);
		}
		el.innerText = values.join(' ').trim() || empty || '';
	}
}

// menuActive and menuInactive show and remove top menus on mouseover
function menuActive () {
  if (this.id === 'hamburgerMenu') {
    var menu = document.getElementById ('mainMenu');
    if (menu.classList.contains ('active')) {
      menuInactiveAll();
    } else {
      this.classList.add ('active');
      menu.classList.add ('active');
      document.body.classList.add ('menuOpen');
			window.scrollTo (0,0);
    }
  } else {
    this.classList.add ('active');
    this.parentNode.scrollTop = 0;
  }
}

function menuInactive (el) {
  if (el.classList) {
    el.classList.remove ('active');
  } else {
    this.classList.remove ('active');
  }
}

// menuTouch deactivates menu when called
function menuTouch () {
  var node = this;
  // add a delay to make sure the menu item gets activated
  setTimeout(function(){
    while (node && node.classList.contains ('active')) {
      menuInactive (node);
      node = node.parentNode.parentNode;
			document.body.classList.remove ('menuOpen');
    }
	  //document.getElementById('hamburgerMenu').classList.remove ('active');
  }, 200);
}  

// menuInactiveAll hides all active menus
function menuInactiveAll () {
  var menu = document.getElementById('mainMenu');
  menu.classList.remove ('active');
  var el = menu.getElementsByClassName ('active');
  for (var i = el.length - 1; i >= 0; i--) {
    el[i].classList.remove ('active');
  }
  document.body.classList.remove ('menuOpen');
  //document.getElementById('hamburgerMenu').classList.remove ('active');
}

// newSvg creates a new, minimal svg
function newSvg() {
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("version", "1.2");
  svg.setAttribute("baseProfile", "tiny");
  prepareSvg(svg);
  return svg;
}

// rebuildSequenceSvg deletes and recreates the svg that holds the sequence
// SVGRoot is a global SVG object
function rebuildSequenceSvg () {
  var container = document.getElementById("svgContainer");
  while (container.childNodes.length) {
    container.removeChild(container.lastChild);
  }
  SVGRoot = newSvg();
  SVGRoot.setAttribute("xmlns:xlink", xlinkNS);
  SVGRoot.setAttribute("id", "sequenceSvg");
  SVGRoot.setAttribute("viewBox", "0 0 800 600");
  SVGRoot.setAttribute("viewport-fill", "white");
  // enable figure selection and drag&drop on all forms except A
  if (activeForm != 'A') {
    // set touchDevice actions
    if (platform.touch) {
      SVGRoot.addEventListener ('touchstart', grabFigure, false);
      SVGRoot.addEventListener ('touchmove', Drag, false);
      SVGRoot.addEventListener ('touchend', Drop, false);    
    }
    // set mouse actions, also for touchDevice as this may also be a
    // touch enabled browser with mouse
    SVGRoot.addEventListener ('mousedown', grabFigure, false);
    SVGRoot.addEventListener ('mousemove', Drag, false);
    SVGRoot.addEventListener ('mouseup', Drop, false);
  }
  
  container.appendChild(SVGRoot);
  
  // these svg points hold x and y values...
  // very handy, but they do not display on the screen
  TrueCoords = SVGRoot.createSVGPoint();
  GrabPoint = SVGRoot.createSVGPoint();
}

// prepareSvg clears a provided svg and prepares it for figure addition
function prepareSvg (svg) {
  while (svg.childNodes.length) svg.removeChild(svg.lastChild);
  var group = document.createElementNS (svgNS, "g")
  group.setAttribute('id', 'sequence');
  svg.appendChild(group);
}

/** Dialogs and windows */

// infoBox creates a styled box without any options.
// message contains the HTML text. When false, the box is closed
function infoBox(message, title) {
  // hide all menus
  menuInactiveAll();
  
  var div = document.getElementById('infoBox');
  if (message) {
    // show box
    div.classList.remove ('noDisplay');
    dialogBuildContents ('info', message, title);
  } else {
    div.classList.add ('noDisplay');
  }
}

// alertBox creates a styled alert box with a 'close' option
// message contains the HTML text. When false, the box is closed
// The buttons object may contain an array of buttons to be added of
// form [{name:xxx, function:yyy}, ...]
function alertBox(message, title, buttons) {
  // hide all menus
  menuInactiveAll();
  
  var div = document.getElementById('alertBox');
  if (message) {
    // show box
    div.classList.remove ('noDisplay');
    // remove old buttons
    var closeButton = document.getElementById ('t_closeAlert');
    var button = closeButton.parentNode.getElementsByClassName ('addedButton');
    while (button.length > 0) button[0].parentNode.removeChild (button[0]);
    // add new buttons
    if (buttons) for (var i = 0; i < buttons.length; i++) {
      var button = document.createElement ('span');
      button.classList.add ('textButton');
      button.classList.add ('addedButton');
      button.innerHTML = userText[buttons[i].name];
      button.addEventListener ('mousedown', buttons[i].function);
      closeButton.parentNode.insertBefore (button, closeButton);
    }
    dialogBuildContents ('alert', message, title);
  } else {
    div.classList.add ('noDisplay');
  }
}

// confirmBox creates a styled confirm box with 'yes' and 'no' options
// message contains the HTML text. When false, the box is closed
// f is a function to be executed after confirm
function confirmBox(message, title, f) {
  // hide all menus
  menuInactiveAll();
  
  var div = document.getElementById('confirmBox');
  if (message) {
    // show box
    div.classList.remove ('noDisplay');
    dialogBuildContents ('confirm', message, title);
    confirmFunction = f;
  } else {
    div.classList.add ('noDisplay');
  }
}

// dialogBuildContents will build the contents of an infoBox, alertBox
// or confirmBox. boxName holds the name of the box. title and message
// are either:
// - formatted as HTML
// - an array of 'userText key' and sprintf replace values
// In the latter case multiple languages will be available for the box
// Any errors will be added to the box, after which the errors will be
// cleared.
function dialogBuildContents (boxName, message, title) {
  // Make the title
  if (title && (typeof title === 'object')) {
    title.params = title.params || [];
    title.params.splice (0, 0, userText[title.userText]);
    document.getElementById(boxName + 'Title').innerHTML =
      sprintf.apply (undefined, title.params);
  } else {
    document.getElementById(boxName + 'Title').innerHTML = title ? title : '';
  }
  // Make the message
  if (message.userText) {
    message.params = message.params || [];
    message.params.splice (0, 0, userText[message.userText] +
      (errors ? '<p>' + errors.join('</p><p>') + '</p>' : ''));
    document.getElementById(boxName + 'Message').innerHTML =
      sprintf.apply (undefined, message.params);
    // add language chooser, assure correct title formatting
    addLanguageChooser (
      boxName,
      message,
      (typeof title === 'object') ? title : {userText: title, params: []});
  } else {
    document.getElementById(boxName + 'Message').innerHTML = message +
      (errors ? '<p>' + errors.join('</p><p>') + '</p>' : '');
  }
  setTimeout (function(){errors = []}, 2000);
}

// addLanguageChooser adds flags to a supplied element to change the
// language. message and title are supplied as:
// {userText: key, params: [userText, param1, param2, ...]}
function addLanguageChooser (boxName, message, title) {
  var el = document.getElementById (boxName + 'Title');
  for (var code in lang) {
    // show flags for languages other than current
    if (document.getElementById ('language').value !== code) {
      var img = document.createElement ('img');
      el.appendChild (img);
      img.classList.add ('boxTitleFlag');
      var flag = flags[(code === 'en') ? 'gb' : code]; 
      img.setAttribute ('src', 'data:image/png;base64,' + flag);
      img.setAttribute ('language', code);
      // add function that will change the language
      img.addEventListener ('mousedown', function() {
        // change UI language
        document.getElementById ('language').value = this.getAttribute ('language');
        changeLanguage();
        // update dialog box texts and rebuild language chooser
        title.params[0] = userText [title.userText];
        document.getElementById (boxName + 'Title').innerHTML =
          sprintf.apply (undefined, title.params);
        message.params[0] = userText [message.userText] +
          (errors ? '<p>' + errors.join('</p><p>') + '</p>' : '');
        document.getElementById (boxName + 'Message').innerHTML =
          sprintf.apply (undefined, message.params);
        addLanguageChooser (boxName, message, title);
      });
    }
  }
}
  
// saveDialog shows or hides the save dialog
// when message is false, the dialog is closed
function saveDialog (message, name, ext) {
  // hide all menus
  menuInactiveAll();
  
  if (message) {
    document.getElementById('saveDialog').classList.remove ('noDisplay');
    document.getElementById('saveFileMessage').innerHTML = message;
    document.getElementById('dlTextField').value = name;
    document.getElementById('fileExt').innerHTML = ext;
    if (platform.cordova) {
			document.getElementById('t_saveFile').innerText = userText.saveShareFile;
		}
  } else {
    document.getElementById('saveDialog').classList.add ('noDisplay');
  }
}

// printDialog shows or hides the print dialog
// When false, the dialog is closed
function printDialog(show) {
  // hide all menus
  menuInactiveAll();
  
  document.getElementById ('printNotesCopy').checked = document.getElementById ('printNotes').checked;
  
  if (show) {
    missingInfoCheck(function(){

      document.getElementById('printDialog').classList.remove ('noDisplay');
      document.getElementById('printMulti').classList.add ('noDisplay');
      document.getElementById('printForms').classList.add ('content2cols');
      document.getElementById('printForms').classList.remove ('content3cols');
      document.getElementById('printOptions').classList.add ('content2cols');
      document.getElementById('printOptions').classList.remove ('content3cols');

    });
  } else {
    // clear fileList in case we were in printMultiDialog
    fileList = [];

    document.getElementById('printDialog').classList.add ('noDisplay');
  }
}

// printMultiDialog shows the print multi file dialog
// Closing is done by printDialog
function printMultiDialog() {
  // hide all menus
  menuInactiveAll();

  // clear the file list
  fileList = [];
  clearFileListContainer (document.getElementById('fileDropPrintFiles'));

  var el = document.getElementById('printMultiCurrentRules');
  el.innerHTML = rulesActive ? rulesActive.replace (/ /g, '&nbsp;') : userText.none;
  
  document.getElementById('printDialog').classList.remove ('noDisplay');
  document.getElementById('printMulti').classList.remove ('noDisplay');
  document.getElementById('printForms').classList.add ('content3cols');
  document.getElementById('printForms').classList.remove ('content2cols');
  document.getElementById('printOptions').classList.add ('content3cols');
  document.getElementById('printOptions').classList.remove ('content2cols');
}

// settingsDialog shows or hides the settings dialog
// when false, the dialog is closed
function settingsDialog(e) {
  // hide all menus
  menuInactiveAll();
  
  var div = document.getElementById('settingsDialog');
  if (e) {
    div.classList.remove ('noDisplay');
  } else {
    div.classList.add ('noDisplay');
  }
}

// referenceSequenceDialog shows or hides the Reference sequence dialog
function referenceSequenceDialog (e) {
  var div = document.getElementById('referenceSequenceDialog');
  if (e === false) {
    div.classList.add ('noDisplay');
  } else {
    div.classList.remove ('noDisplay');
    changeReferenceSequence(true);
  }
}

// proposalsDialog shows or hides the figure group proposals dialog
function proposalsDialog (e) {
  var div = document.getElementById('createProposalsDialog');
  if (e === false) {
    div.classList.add ('noDisplay');
  } else {
    div.classList.remove ('noDisplay');
    /* document.getElementById ('proposalsFigureCount').value =
      document.getElementById ('gridColumns').value; */
    createFigureProposals();
  }
}

// proposalsToGrid loads the proposals from the dialog to the Grid
function proposalsToGrid () {
  sequenceText.innerHTML = document.getElementById ('proposals').textContent.trim();
  proposalsDialog (false);
  checkSequenceChanged (true);
}

// helpWindow will display a window with content from url and title
function helpWindow (url, title) {
	// set a small delay to make sure the menu is not again activated
	setTimeout(menuInactiveAll, 100);
	
	if (platform.cordova) {
		if (platform.android && /\.pdf$/.test (url)) {
			cordovaPdf (url, title);
		} else {
			var win = window.open (
				url, '_blank', 'location=no,hardwareback=no');
			win.addEventListener( "loadstop", function() {
				// hide elements with class noCordova
				win.executeScript ({code:
					"var els = document.getElementsByClassName ('noCordova');" +
					"for (var i = 0; i < els.length; i++) els[i].classList.add ('noDisplay');"
				})
			});
		}
	} else if (platform.mobile && !platform.ios && !/\.pdf$/.test (url)) {
		// for platform.mobile, open inline except for PDF
		document.getElementById ('helpBox').classList.remove ('noDisplay');
		document.getElementById ('helpTitle').innerText = title;
		document.getElementById ('helpContent').firstChild.src = url;
	} else if (chromeApp.active) {
    // use chrome.app.window.create for desktop Chrome app
    chrome.app.window.create (url, {
      bounds: {
        width:800,
        height:600
      }
    }, function(w) {
      var win = w.contentWindow;
      win.onLoad = function() {
        win.document.title = title;
      };
    });
  } else if (window.navigator.standalone) {
    // create and click <a> for standalone
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  } else {
    // open new window for all others
    var w = window.open(url, title, 'menubar=no, scrollbars=yes, status=no, toolbar=no, top=30, width=800');
    // set location again after 2 seconds to circumvent Chrome bug
    // regarding anchors later in html
    if (!/\.pdf$/.test (url)) {
	    setTimeout(function(){
	      w.location = url;
	    }, 2000);
		}
  }
}

// newWindow will display a window with content from body and title
// body can also be a function
function newWindow (body, title) {
  if (typeof body === "function") body = body();
  
  // empty body?
  if (!body) body = document.createElement ('body');
  
  // handling is different for App, touchdevice and web
  if (chromeApp.active) {
    chrome.app.window.create ('window.html', {
      bounds: {
        width:800,
        height:600
      }
    }, function(w) {
      var win = w.contentWindow;
      win.onLoad = function() {
        win.document.title = title;
        win.document.body = body;
      };
    });
  } else {// if (platform.touch) {
    alertBox ('<div id="newWindow"></div>', title)
    document.getElementById('newWindow').innerHTML = body.innerHTML;
  }/* else {
    var w = window.open ('', title, 'width=800,height=600,top=50,' +
    'location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
    // create data uri
    var uri = 'data:text/html;base64,' +
      btoa('<title>' + title + '</title>' +
      new XMLSerializer().serializeToString(body));
    // open the window with data uri for contents
    w.location.assign(uri);
    w.focus();
  }*/
}

// aboutDialog will build a complete 'about' dialog. This includes
// version checking
function aboutDialog () {
  function show (stableVersion) {
    var compText = '';
    if (stableVersion === '-') {
      compText = userText.aboutUnknown;
    } else {
      switch (compVersion (version, stableVersion)) {
        case -1:
          compText = userText.aboutOlder;
          break;
        case 1:
          compText = userText.aboutNewer;
      }
    }
    alertBox (
      sprintf(userText.aboutText, version, stableVersion, compText),
      userText.about);
  }
  
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://openaero.net/openaero.php?v', true);
	xhr.timeout = 5000;
	xhr.onload = function() {
		show (xhr.response);
	}
  // onerror or ontimeout will be triggered when offline
  xhr.onerror = xhr.ontimeout = function() {show ('-');};
	xhr.send();
}

/** End dialogs and windows */

// Combo box
// The correct values are put in the select list when the box is
// activated by user

// fixme: replace by HTML5 combo function (<datalist>) when Safari supports

function combo(id,h,l) {
  var self = this; 
  self.h = h; 
  self.l = l; 
  self.inp = document.getElementById(id); 
  self.hasfocus = false; 
  self.sel = -1; 
  self.ul = self.inp.nextSibling;
  while (self.ul.tagName !== 'UL') self.ul = self.ul.nextSibling; 
  self.ul.onmouseover = function() {
    self.ul.classList.remove ('focused');
  }; 
  self.ul.onmouseout = function() {
    self.ul.classList.add ('focused');
    if (!self.hasfocus) self.ul.style.display = 'none';
  };
  
  self.inp.onfocus = function() {
    var ul = self.ul;
    ul.style.display = 'block';
    ul.classList.add ('focused');
    self.hasfocus = true;
    self.sel = -1;
    // rebuild the list
    switch (ul.id) {
      case 'rulesList':
        updateRulesList ();
        break;
      case 'categoryList':
        updateCategoryList ();
        break;
      case 'programList':
        updateProgramList ();
    }
    self.addMouseDown();
  }; 
  self.inp.onblur = function() {
    if(self.ul.classList.contains ('focused')) {
      self.rset(self);
    }
    self.ul.classList.remove ('focused');
    self.hasfocus = false;
    changeCombo(self.inp.id);
  }; 
  self.inp.onkeyup = function(e) {
    var k = e ? e.keyCode : event.keyCode;
    if (k == 40 || k == 13) {
      if (self.sel == self.list.length-1) {
        self.list[self.sel].style.backgroundColor = self.l;
        self.sel = -1;
      }
      if (self.sel > -1) {
        self.list[self.sel].style.backgroundColor = self.l;
      }
      self.inp.value = self.list[++self.sel].firstChild.data;
      self.list[self.sel].style.backgroundColor = self.h;
      changeCombo (self.inp.id);
    } else if (k == 38 && self.sel > 0) {
      self.list[self.sel].style.backgroundColor = self.l;
      self.inp.value = self.list[--self.sel].firstChild.data;
      self.list[self.sel].style.backgroundColor = self.h;
      changeCombo (self.inp.id);
    }
    return false;
  };
}
combo.prototype.rset = function(self) {
  self.ul.style.display = 'none';
  self.sel = -1;
  for (var i=self.list.length - 1; i >= 0; i--) {
    self.list[i].style.backgroundColor = self.l;
  }
  return false;
}
combo.prototype.addMouseDown = function () {
  var self = this;
  self.list = self.ul.getElementsByTagName('li'); 
  for (var i = self.list.length - 1; i >= 0; i--) {
    self.list[i].addEventListener (
      'mousedown',
      function() {
        self.inp.value = this.firstChild.data;
        self.rset(self);
      },
      false
    );
  }
  changeCombo (self.ul.id);
}  

// selectTab allows us to select different tabbed pages
// 'e' is either the tab object or a tab id
function selectTab (e) {
  var li = e.target ? this : document.getElementById(e);
  // make sure we only select tabs
  if (!li.id.match(/^tab-/)) return;
  // check if tabbing in leftBlock, for alertBox slide
  var leftBlock = li.id.match (/^tab-(sequenceInfo|figureInfo|svgContainer)$/);
  var tab = document.getElementById(li.id.replace('tab-', ''));
  var ul = li.parentNode;
  var list = ul.getElementsByTagName('li');
  // unselect all tabs
  for (var i = list.length - 1; i >= 0; i--) {
    // only do something when the tab is displayed
    if (!list[i].classList.contains('noDisplay')) {
      if (leftBlock && list[i].classList.contains ('activeTab')) {
        var rect = document.getElementById(list[i].id.replace('tab-', '')).getBoundingClientRect();
      }
      list[i].classList.remove('activeTab');
      list[i].classList.add('inactiveTab');
      // hide the tab by using display:hidden
      // so any data is still accessible
      var hideTab = document.getElementById(list[i].id.replace('tab-', ''));
      if (hideTab) {
        hideTab.classList.add('hidden');
        if (tab.id === 'svgContainer') {
          hideTab.classList.add('left');
        } else hideTab.classList.remove('left');
      }
    }
  }
  // select correct tab
  li.classList.remove('inactiveTab');
  li.classList.add('activeTab');
  tab.classList.remove('hidden');
  // scroll tab parents to top
  var t = tab;
  while (t = t.parentNode) t.scrollTop = 0;
  // slide alertBox and design when relevant
  if (leftBlock && rect) {
    var newRect = tab.getBoundingClientRect();
    
    function slide (el) {
      el.style.transition = '';
      var dy = (rect.bottom - rect.top) - (newRect.bottom - newRect.top);
      el.style.transform = 'translateY(' + dy + 'px)';
      setTimeout (function(){
        el.style.transition = 'all 0.3s ease-in-out';
        el.style.transform = '';
      }, (dy > 0) ? 300 : 5);
    }
    
    slide (document.getElementById('alerts'));
    slide (document.getElementById('design'));
  }
}

// updateUserTexts updates all userText in the interface as indicated by
// <span class="userText" id="t_[key]"></span> or another HTML element,
// e.g. <a></a> or <div></div>
// where [key] is the key in userText, e.g. "addingFigure"
function updateUserTexts () {
  var language = lang[document.getElementById('language').value];
  // add a warning to the console for every missing key. Helps in
  // creating new translations
  for (var key in lang.en) {
    if (!(key in language) && (key != 'en')) {
      console.log ('Key "' + key + '" missing in language "' +
        document.getElementById('language').value + '"');
    }
  }
  // put language values in userText
  for (var key in language) userText[key] = language[key];

  var id;
  var value;
  var els = document.getElementsByClassName('userText');
  for (var i = els.length - 1; i >= 0; i--) {
    id = els[i].id.replace (/^t_/, '');
    value = userText[id];
    if (!value) value = '';
    els[i].innerHTML = value;
  }
  // rebuild buttons and tooltips
  buildButtons();
}

/************************************************
 * General functions
 ************************************************/

// roundTwo returns a number rounded to two decimal places.
// Use for all drawing functions to prevent rendering errors and keep
// SVG file size down
function roundTwo (nr) {
  return parseFloat(parseFloat(nr).toFixed(2));
}

// sanitizeSpaces does:
// transform tabs to spaces, multiple to single spaces and
// remove leading and trailing spaces (when noLT is false)
function sanitizeSpaces (line, noLT) {
  line = line.replace(/[\t]/g, ' ').replace(/\s\s+/g, ' ');
  if (!noLT) line = line.trim();
  return line;
}

// getSuperFamily returns the superfamily for a category of the figure
// described by an array of Aresti numbers
function getSuperFamily (aresti, category) {
  var
	  superFamily = [],
	  returnValue = '';
	  
  // Set default Super Family. First check if a matching category is
  // active, otherwise use "advanced".
  category = category.toLowerCase();
  superFamily = superFamilies[category] || superFamilies.advanced;
  // set Super Family from rules
  if (rulesActive && ruleSuperFamily.length) {
    superFamily = ruleSuperFamily;
  }

  // Only search if superFamilies are defined for the category
  if (superFamily !== []) {
    for (var i = 0; i < superFamily.length; i++) {
      for (var j = 0; j < aresti.length; j++) {
        if (aresti[j].match(superFamily[i][0])) {
          returnValue = superFamily[i][1];
          break; // Break loop aresti
        }
      }
      if (returnValue) break; // Break loop superFamily
    }
  }
  return returnValue;
}

// dirAttToAngle creates an angle to draw from the values for direction
// and attitude.
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToAngle (dir, att) {
  while (dir < 0) dir += 360;
  while (dir >= 360) dir -= 360;
  // Create offset for the Y-axis, determined by yAxisOffset
  if (dir < 90) {
    var theta = (dir * (yAxisOffset / 90));
  } else if (dir < 180) {
    var theta = (dir - 90) * ((180 - yAxisOffset) / 90) + yAxisOffset;
  } else if (dir < 270) {
    var theta = (dir - 180) * (yAxisOffset / 90) + 180;
  } else {
    var theta = (dir - 270) * ((180 - yAxisOffset) / 90) + yAxisOffset + 180;
  }
  // No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    theta = ((theta < 90) || (theta > 270)) ? 0 : 180;
  }
// Check for right or left half, calculate angle and make negative for left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * Math.degToRad;
    if (angle > Math.Tau) {
      angle -= Math.Tau;
    } else if (angle < 0) {
      angle += Math.Tau;
    }
  } else {
    var angle = (theta - att) * Math.degToRad;
    if (angle >= 0) {
      angle -= Math.Tau;
    } else if (angle < -Math.Tau) {
      angle += Math.Tau;
    }
  }
  return angle;
}

// changeDir changes Direction global by value
// and checks it stays within 0-359
function changeDir (value) {
  Direction += value;
  while (Direction < 0) Direction += 360;
  while (Direction >= 360) Direction -= 360;
}

// changeAtt changes Attitude global by value
// and checks it stays within 0-359
function changeAtt (value) {
  Attitude += value;
  while (Attitude < 0) Attitude += 360;
  while (Attitude >= 360) Attitude -= 360;
  // update goRight for attitude changes. We monitor the exit direction
  // but also the direction through the top or bottom when ending vert.
  // Don't update this time when updateAxisDir is false, used for
  // double bumps
  if (updateAxisDir) {
    if (((Direction == 0) || (Direction == 180)) && (value != 0)) {
      goRight = (Direction == 0) ? false : true;
      if ((Attitude > 90) && (Attitude < 270)) {
        goRight = !goRight;
      } else if ((Attitude == 90) || (Attitude == 270)) {
        if ((Attitude == 90) == (value < 0)) goRight = !goRight;
      }
    }
  } else {
    updateAxisDir = true;
  }
}

// changeRollFontSize will update the font size for rolls (e.g. 2x8)
function changeRollFontSize (s) {
  var regex = new RegExp('font-size:[ ]*' + rollFontSize + 'px;');
  rollFontSize = s;
  style.rollText = style.rollText.replace(regex,'font-size: ' + rollFontSize + 'px;');
}

// myGetBBox accepts an element and returns the bBox for the element and
// bBoxes for it's child elements
function myGetBBox (e) {
  var bBox = e.getBBox();
  // add right, bottom and nodes
  bBox.right = bBox.x + bBox.width;
  bBox.bottom = bBox.y + bBox.height;
  bBox.nodes = [];
  var nodes = e.childNodes;
  for (var i = 0; i < nodes.length; i++) {
    bBox.nodes[i] = nodes[i].getBBox();
    // add right and bottom
    bBox.nodes[i].right = bBox.nodes[i].x + bBox.nodes[i].width;
    bBox.nodes[i].bottom = bBox.nodes[i].y + bBox.nodes[i].height;
  }
  return bBox;
}

/*******************************************************************************
 Define the low level shapes
 The function names are of the format makeXXX where XXX is the name to be called
 *******************************************************************************/

// drawWind draws the wind arrow and text
// x and y represent the corner of the rectangle bounding the arrow at
// the top downwind side. signScale is used for direction (pos = RTL)
// and horizontal size scaling of the "bar"
// The return value is an array with the width and height of the bounding rectangle
function drawWind (x, y, signScale, svgEl) {
  svgEl = svgEl || SVGRoot.getElementById('sequence');
  var sign = signScale / Math.abs (signScale);
  
  var g = document.createElementNS (svgNS, 'g');
  g.setAttribute('id', 'windArrow');
  var path = document.createElementNS (svgNS, "path");
  pathNode = 'M' + x + ',' + (y + 6) + ' l ' + (-signScale * 90) +
    ',0 l 0,-6 l ' + (-sign * 16) + ',16 l ' + (sign * 16) +
    ',16 l 0,-6 l ' + (signScale * 90) + ',0 z';
  path.setAttribute ('d', pathNode);
  path.setAttribute ('style', style.windArrow);
  g.appendChild(path);
  drawText (iacForms ? userText.windIAC : userText.wind,
    x - (signScale * 50), y + 20, 'miniFormA', 'middle', '', g);
  svgEl.appendChild(g);
  return {width: Math.abs (signScale * 90 + sign * 16), height: 32};
}

// makeFigStart creates figure start marker
function makeFigStart (params) {
  var seqNr = params.seqNr;
  var first = params.first;
  
  var pathsArray = [];
  var angle = dirAttToAngle (Direction, Attitude);
  // Create a marker for possible automatic repositioning of the figure
  // start
  pathsArray.push({'figureStart': true});
  // Create the first figure mark if applicable
  var ref_rayon = 9;
  var open = Math.PI / 6;
  var rayon = ref_rayon;
  // draw numbers in circles when numberInCircle set AND seqNr present
  if (numberInCircle && seqNr && (activeForm != 'A')) {
    if (first && (activeForm !== 'Grid')) {
      rayon = ref_rayon + 4;
      var ax = roundTwo(rayon * Math.cos(angle - open));
      var ay = -roundTwo(rayon * Math.sin(angle - open));
      var Deltax = roundTwo(rayon * Math.cos(angle + open) - ax);
      var Deltay = roundTwo(-rayon * Math.sin(angle + open) - ay);
      pathsArray.push({'path': 'm ' + ax + ',' + ay + ' a' + rayon +
        ',' + rayon +' 0 1 1 ' + Deltax + ',' + Deltay, 'style':'pos'});
    }
    if (seqNr < 10) {
      // Add the figure number
      if (seqNr) pathsArray.push ({
        'text':seqNr,
        'style':'figNbr_09',
        'x':0,
        'y':5,
        'text-anchor':'middle'
      });
      rayon = ref_rayon;     
    } else {
      // Add the figure number
      pathsArray.push ({
        'text':seqNr,
        'style':'figNbr_10',
        'x':0,
        'y':5,
        'text-anchor':'middle'
      });
      rayon = ref_rayon + 1;   
    }
    // Make the marker
    pathsArray.push({
      'path': 'm ' + (-rayon) + ',0 a' + rayon + ',' + rayon + ' 0 1 1 0,0.01',
      'style':'pos',
      'dx':Math.cos(angle) * 9,
      'dy':- Math.sin(angle) * 9
    });
  } else {
    if (first && (activeForm !== 'A') && (activeForm !== 'Grid')) {
      pathsArray.push({'path': 'm 3,-6 a7,7 0 1 1 -6,0', 'style':'pos'});
    }
    // Add the figure number, except on Form A
    if (seqNr && (activeForm != 'A')) {
      pathsArray.push ({
        'text':seqNr,
        'style':'figNbr_09',
        'x':0,
        'y':-8,
        'text-anchor':'middle'
      });
    }
    // Make the marker
    pathsArray.push({
      'path': 'm -4,0 a4,4 0 1 1 0,0.01',
      'style':'blackfill',
      'dx':Math.cos(angle) * 4,
      'dy':- Math.sin(angle) * 4
    });
  }
  return pathsArray;
}

// makeFigStop creates figure stop
function makeFigStop (lastFig) {
  var pathArray = {style:'pos'};
  var angle = (Direction + 90) * Math.degToRad;
  var dx = roundTwo(Math.cos(angle) * lineElement / scale);
  var dy = - roundTwo(Math.sin(angle) * lineElement / scale);
  if (lastFig) {
    var angle2 = dirAttToAngle (Direction, Attitude);
    var dx2 = roundTwo(Math.cos(angle2) * lineElement);
    var dy2 = - roundTwo(Math.sin(angle2) * lineElement);
    pathArray.path = 'm ' + (dx2 + dx * 2) + ',' + (dy2 + dy * 2) +
      ' l ' + (-4 * dx) + ',' + (-4 * dy);
    pathArray.dx = dx2;
    pathArray.dy = dy2;
  } else {
    pathArray.path = 'l ' + dx + ',' + dy + ' l ' + (-2 * dx) +
      ',' + (-2 * dy);
    pathArray.dx = 0;
    pathArray.dy = 0;
  }
  return Array(pathArray);
}

// makeFigSpace creates space after figure
// scaling should not affect movement, so divide by scale
function makeFigSpace (extent) {
  var angle = dirAttToAngle (Direction, Attitude);
  return Array({
    'path': '',
    'style': 'neg',
    'dx': roundTwo(Math.cos(angle) * (lineElement / scale) * extent),
    'dy': roundTwo(-Math.sin(angle) * (lineElement / scale) * extent)
  });
}

// makeVertSpace creates vertical space
// scaling should not affect movement, so divide by scale
function makeVertSpace (extent) {
  return Array({
    'path': '',
    'style': 'neg',
    'dx': 0,
    'dy': (lineElement / scale) * extent
  });
}

// makeLine creates lines
// Params:
// 0: line length
// 1: handle
// 2: style
function makeLine (Params) {
  var Extent = Params[0];
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = roundTwo(Math.cos(angle) * lineElement * Extent);
  var dy = - roundTwo(Math.sin(angle) * lineElement * Extent);
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    dx = roundTwo(yAxisScaleFactor*dx);
    if (!((Attitude == 90) || (Attitude == 270))) {
      dy = roundTwo(yAxisScaleFactor*dy);
    }
    if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
      angle -= yAxisOffset * Math.degToRad;
      dx = roundTwo(scaleLine.x * Math.cos(angle) * lineElement * Extent);
      if (yAxisOffset > 90) {
        dy = roundTwo((-scaleLine.y * Math.cos(angle) + Math.sin(angle)) * lineElement * Extent);
      } else {
        dy = - roundTwo((scaleLine.y * Math.cos(angle) + Math.sin(angle)) * lineElement * Extent);
      }
      True_Drawing_Angle = Math.atan(-dy/dx);
      if (dx < 0) True_Drawing_Angle += Math.PI;
    }
  } else True_Drawing_Angle = angle;
  return Array({
    'path': 'l ' + dx + ',' + dy,
    'style': style[Params[2]] ? Params[2] : (NegLoad == 0) ? 'pos' : 'neg',
    'class': 'line',
    'handle': Params[1],
    'dx': dx,
    'dy': dy
  });
}

// makeMove is similar to makeLine but only moves the pointer and
// creates no lines
function makeMove (Params) {
  var Extent = Params[0];
  var angle = dirAttToAngle (Direction, Attitude);
  return Array({
    'path': '',
    'style': '',
    'dx': roundTwo(Math.cos(angle) * lineElement * Extent),
    'dy': -roundTwo(Math.sin(angle) * lineElement * Extent)
  });
}

// makeCorner creates sharp corners. Actually it only changes direction,
// no lines are created
function makeCorner (param) {
  // make sure param is an Integer
  param = parseInt (param);
  changeAtt (param);
  NegLoad = (param >= 0) ? 0 : 1;
  return Array({
    'path': '',
    'style': (NegLoad == 0) ? 'pos' : 'neg'
  });
}

// getEllipseParameters gets the ellipse radius and orientation from
// the perspective angle and the Y axis scale factor
function getEllipseParameters(P_Angle,Y_Scale) {
  if ((P_Angle == 30) && (Y_Scale == 0.7)) {
    return {
      'x_radius': 0.559,
      'y_radius': 1.085,
      'rot_angle': 14.67,      
	    'H_x_radius': 1.184,
      'H_y_radius': 0.296,
      'H_rot_angle': -9.41
    };
  }
  if (Y_Scale == 1) {
    var V_orient = (90 - P_Angle) /2;
    var V_r_min = Math.sqrt(1 - Math.sin(P_Angle*Math.degToRad)) ;
    var V_r_max = Math.sqrt(1 + Math.sin(P_Angle*Math.degToRad)) ;
    var H_orient = - P_Angle /2;
    var H_r_min = Math.sqrt(1 - Math.sin((90-P_Angle)*Math.degToRad)) ;
    var H_r_max = Math.sqrt(1 + Math.sin((90-P_Angle)*Math.degToRad)) ;
    return {
      'x_radius': V_r_min,
      'y_radius': V_r_max,
      'rot_angle': V_orient,
	    'H_x_radius': H_r_max,
      'H_y_radius': H_r_min,
      'H_rot_angle': H_orient
    };
  }
  var A = Y_Scale * Math.cos(P_Angle*Math.degToRad);
  var B = Y_Scale * Math.sin(P_Angle*Math.degToRad);
  // Parameters for perspective of elements in the vertical plane
  // (loops or loop parts)
  var theta = (Math.PI + Math.atan(-2*B/(1 - Y_Scale * Y_Scale)))/2 ;
  var V_orient = roundTwo(90 - (180 * Math.atan((Math.sin(theta) +
    B*Math.cos(theta)) / (A*Math.cos(theta))) / Math.PI)) ;
  var V_r_max = roundTwo(Math.sqrt(Math.pow(A*Math.cos(theta),2) +
    Math.pow(Math.sin(theta) + B*Math.cos(theta),2)));
  theta += Math.PI/2 ;
  var V_r_min = roundTwo(Math.sqrt(Math.pow(A*Math.cos(theta),2) +
    Math.pow(Math.sin(theta) + B*Math.cos(theta),2)));
  // Parameters for perspective of elements in the horizontal plane
  // (turns or rolling turns)
  theta = Math.atan(2*A/(1 - Y_Scale * Y_Scale))/2 ;
  var H_r_max = roundTwo(Math.sqrt(Math.pow(Math.cos(theta) +
    A*Math.sin(theta),2) + Math.pow(B*Math.sin(theta),2)));
  theta += Math.PI/2 ;
  var H_r_min = roundTwo(Math.sqrt(Math.pow(Math.cos(theta) +
    A*Math.sin(theta),2) + Math.pow(B*Math.sin(theta),2)));
  var H_orient = roundTwo(-90 - 180 * Math.atan((B*Math.sin(theta)) /
    (Math.cos(theta) + A*Math.sin(theta))) / Math.PI);
// Returns both vertical and horizontal planes parameters
  return {
    'x_radius': V_r_min, 
    'y_radius': V_r_max,
    'rot_angle': V_orient ,
    'H_x_radius': H_r_max,
    'H_y_radius': H_r_min,
    'H_rot_angle': H_orient
  };
}

// dirAttToXYAngle modified from dirAttToAngle to just care about angle
// in a vertical "plan".
// dirAttToAngle creates an angle to draw from the values for direction
// and attitude
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToXYAngle (dir, att) {
  while (dir < 0) dir += 360;
  while (dir >= 360) dir -= 360;
  // Create offset for the Y-axis, determined by yAxisOffset
  var theta = (dir < 180) ? 0 : 180;
  // No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    theta = ((theta < 90) || (theta > 270)) ? 0 : 180;
  }
  // Check for right or left half, calculate angle and make negative for
  // left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * Math.degToRad;
    if (angle > Math.Tau) {
      angle -= Math.Tau;
    } else if (angle < 0) {
      angle += Math.Tau;
    }
  } else {
    var angle = (theta - att) * Math.degToRad;
    if (angle >= 0) {
      angle -= Math.Tau;
    } else if (angle < -Math.Tau) {
      angle += Math.Tau;
    }
  }
  True_Drawing_Angle = angle;
  return angle;
}

// dirAttToGGAngle modified from dirAttToAngle to neutralize perspective
// angle adjustments.
// dirAttToAngle creates an angle to draw from the values for direction
// and attitude
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToGGAngle (dir, att) {
  while (dir < 0) dir += 360;
  while (dir >= 360) dir -= 360;
  // Don't create offset for the Y-axis related to yAxisOffset
  var theta = dir ;  // perspective neutralisation
  // No Y-axis correction for pure verticals
  if ((att == 90) || (att == 270)) {
    theta = ((theta < 90) || (theta > 270)) ? 0 : 180;
  }
  // Check for right or left half, calculate angle and make negative for
  // left half
  if ((theta < 90) || (theta > 270)) {
    var angle = (theta + att) * Math.degToRad;
    if (angle > Math.Tau) {
      angle -= Math.Tau;
    } else if (angle < 0) {
      angle += Math.Tau;
    }
  } else {
    var angle = (theta - att) * Math.degToRad;
    if (angle >= 0) {
      angle -= Math.Tau;
    } else if (angle < -Math.Tau) {
      angle += Math.Tau;
    }
  }
  return angle;
}

// makeCurve creates curves of up to 359 degrees
// This is used for all looping shapes
// param is the angle in whole degrees
function makeCurve (param) {
  // make sure param is an Integer
  if (param.angle) {
		var params = param;
		param = parseInt (param.angle);
	} else {
		var params = {};
		param = parseInt (param);
	}

  // Define some variables
  var
	  pathArray = [],
	  Extent = Math.abs(param),
	  PullPush = (param >= 0) ? 0 : 1,
	  Radius = curveRadius,
	  longCurve = (Extent > 180) ? 1 : 0,
	  // Calculate at which angle the curve starts
	  radStart = dirAttToAngle (Direction, Attitude),
	  radStartXY = dirAttToXYAngle (Direction, Attitude);

  NegLoad = PullPush;
  
  if (params.style) {
		pathArray.style = params.style;
	} else {
	  pathArray.style = (NegLoad == 0) ? 'pos' : 'neg';
	}

  changeAtt (param);
  
  // Calculate at which angle the curve stops
  var radStop = dirAttToAngle (Direction, Attitude);
  var radStopXY = dirAttToXYAngle (Direction, Attitude);
  // See if we are curving left or right, depending on radStart and PullPush
  var curveRight = (radStart >= 0) ? 0 : 1;
  if (PullPush == 1) curveRight = 1 - curveRight;
  if (curveRight == 0) {
    var dx = (Math.sin(radStop) - Math.sin(radStart)) * Radius;
    var dy = (Math.cos(radStop) - Math.cos(radStart)) * Radius;
  } else {
    var dx = (Math.sin(radStop + Math.PI) - Math.sin(radStart + Math.PI)) * Radius;
    var dy = (Math.cos(radStop + Math.PI) - Math.cos(radStart + Math.PI)) * Radius;
  }
  var sweepFlag = curveRight;
  // Make the path and move the cursor
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    var curveRight = (radStartXY >= 0) ? 0 : 1;
    if (PullPush == 1) curveRight = 1 - curveRight;
    dx = yAxisScaleFactor * ((Math.sin(radStopXY) - Math.sin(radStartXY))) * Radius;
    dy = (Math.cos(radStopXY) - Math.cos(radStartXY)) * Radius;
    if (curveRight == 1) {
      dx = -dx ;
      dy = -dy ;
    }
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.rot_angle : -perspective_param.rot_angle;
    var X_axis_Radius = perspective_param.x_radius * Radius;
    var Y_axis_Radius = perspective_param.y_radius * Radius;
    dy -= dx * Math.sin(yAxisOffset * Math.degToRad);
    dx = dx * Math.cos(yAxisOffset * Math.degToRad);
    pathArray.path = 'a' + roundTwo(X_axis_Radius) + ',' +
      roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' ' + longCurve +
      ' ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathArray.path = 'a' + Radius + ',' + Radius + ' 0 ' + longCurve +
      ' ' + sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  }
  pathArray.dx = dx;
  pathArray.dy = dy;
  return Array(pathArray);
}

// makeRollTopLine creates the small lines around rolls in the top
function makeRollTopLine () {
  var pathArray = [];
  var angle = dirAttToAngle (Direction, Attitude + 90);
  var dx = roundTwo(Math.cos(angle) * lineElement075);
  var dy = - roundTwo(Math.sin(angle) * lineElement075);
  pathArray.path = 'l ' + dx + ',' + dy + ' l ' + (-2 * dx) +
    ',' + (-2 * dy);
  pathArray.style = 'pos';
  pathArray.dx = pathArray.dy = 0;
  return Array(pathArray);
}

// Code for making (rolling) turns
// This has to be changed in the future to improve the look of the code
// For now we keep it like this as it does work

// makeTurnArc creates arc segments for turns and rolling circles.
// Size is in DRAWN rads
function makeTurnArc (rad, startRad, stopRad, pathsArray) {
  while (startRad < 0) startRad += Math.Tau;
  while (startRad >= Math.Tau) startRad -= Math.Tau;
  while (stopRad < 0) stopRad += Math.Tau;
  while (stopRad >= Math.Tau) stopRad -= Math.Tau;

  var sign = (rad >= 0) ? 1 : -1;
  
  if (!newTurnPerspective.checked) {
    // calculate where we are in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
    // as the atan function only produces angles between -PI/2 and PI/2 we
    // may have to correct for full ellipse range
    if ((startRad > Math.PI) && (startRad < Math.Tau)) {
      radEllipse += Math.PI;
    }
    startX = Math.cos (radEllipse) * curveRadius;
    startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    // calculate where we go to in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
    if ((stopRad > Math.PI) && (stopRad < Math.Tau)) {
      radEllipse += Math.PI;
    }
    stopX = Math.cos (radEllipse) * curveRadius;
    stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    dx = roundTwo(stopX - startX) * sign;
    dy = roundTwo(stopY - startY) * sign;
    sweepFlag = (rad > 0) ? 0 : 1;
    longCurve = (Math.abs (rad) < Math.PI) ? 0 : 1;
    if ((Attitude > 90) && (Attitude < 270)) {
      pathsArray.push({'path':'a ' + curveRadius + ',' +
        roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'neg', 'dx':dx,'dy':dy});
    } else {
      pathsArray.push({'path':'a ' + curveRadius + ',' +
        roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'pos', 'dx':dx,'dy':dy});
    }
  } else {
  // Always draw in perspactive (rolling) turns, no matter which is the
  // value of curvePerspective
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.H_rot_angle : -perspective_param.H_rot_angle;
    var X_curveRadius = roundTwo(perspective_param.H_x_radius * curveRadius) ;
    var Y_curveRadius = roundTwo(perspective_param.H_y_radius * curveRadius) ;
    dy = yAxisScaleFactor * (Math.cos(stopRad) - Math.cos(startRad)) ;
    dx = roundTwo((Math.sin(stopRad) - Math.sin(startRad) - dy * Math.cos(yAxisOffset * Math.degToRad)) * curveRadius) * sign;
    dy = roundTwo(dy * Math.sin(yAxisOffset * Math.degToRad) * curveRadius) * sign;
    sweepFlag = (rad > 0) ? 0 : 1;
    longCurve = (Math.abs (rad) < Math.PI) ? 0 : 1;
    if ((Attitude > 90) && (Attitude < 270)) {
      pathsArray.push({'path':'a ' + X_curveRadius + ',' +
        Y_curveRadius + ' ' + Rot_axe_Ellipse + ' ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'neg', 'dx':dx,'dy':dy});
    } else {
      pathsArray.push({'path':'a ' + X_curveRadius + ',' +
        Y_curveRadius + ' ' + Rot_axe_Ellipse + ' ' + longCurve + ' ' +
        sweepFlag + ' ' + dx + ',' + dy, 'style':'pos', 'dx':dx,'dy':dy});
    }
  }
  return pathsArray;
}

// makeTurnDots creates dotted arc segments for turns and rolling circles.
// Size is in DRAWN rads
function makeTurnDots (rad, startRad, stopRad, pathsArray) {
  while (startRad >= Math.Tau) startRad -= Math.Tau;
  while (stopRad >= Math.Tau) stopRad -= Math.Tau;
    
  sign = (rad >= 0) ? 1 : -1;
  if (!newTurnPerspective.checked) {
    // calculate where we are in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(startRad) / flattenTurn));
    // as the atan function only produces angles between -PI/2 and PI/2
    // we may have to correct for full ellipse range
    if ((startRad > Math.PI) && (startRad < Math.Tau)) {
      radEllipse += Math.PI;
    }
    startX = Math.cos (radEllipse) * curveRadius;
    startY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    // calculate where we go to in the ellipse
    radEllipse = Math.atan (-1 / (Math.tan(stopRad) / flattenTurn));
    if ((stopRad > Math.PI) && (stopRad < Math.Tau)) {
      radEllipse += Math.PI;
    }
    stopX = Math.cos (radEllipse) * curveRadius;
    stopY = - (Math.sin (radEllipse) * curveRadius * flattenTurn);
    dx = roundTwo(stopX - startX) * sign;
    dy = roundTwo(stopY - startY) * sign;
    sweepFlag = (rad > 0) ? 0 : 1;
    longCurve = (Math.abs (rad) < Math.PI) ? 0 : 1;
    pathsArray.push({'path':'a ' + curveRadius + ',' +
      roundTwo(curveRadius * flattenTurn) + ' 0 ' + longCurve + ' ' +
      sweepFlag + ' ' + dx + ',' + dy, 'style':'dotted'});
  } else {
    // Always draw in perspactive (rolling) turns, no matter which is
    // the value of curvePerspective
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.H_rot_angle : -perspective_param.H_rot_angle;
    var X_curveRadius = roundTwo(perspective_param.H_x_radius * curveRadius) ;
    var Y_curveRadius = roundTwo(perspective_param.H_y_radius * curveRadius) ;
    dy =  yAxisScaleFactor * (Math.cos(stopRad) - Math.cos(startRad)) ;
    dx =  roundTwo((Math.sin(stopRad) - Math.sin(startRad) - dy * Math.cos(yAxisOffset * Math.degToRad)) * curveRadius) * sign;
    dy =  roundTwo(dy * Math.sin(yAxisOffset * Math.degToRad) * curveRadius) * sign;
    sweepFlag = (rad > 0) ? 0 : 1;
    longCurve = (Math.abs (rad) < Math.PI) ? 0 : 1;
    pathsArray.push({'path':'a ' + X_curveRadius + ',' +
      Y_curveRadius + ' ' + Rot_axe_Ellipse + ' ' + longCurve + ' ' +
      sweepFlag + ' ' + dx + ',' + dy, 'style':'dotted'});
  }
  return pathsArray;
}

// makeTurnRoll creates rolls in rolling turns. Basically a minimal version of makeRoll
// param is the amount of roll degrees
function makeTurnRoll (param, rad) {
  if (!!newTurnPerspective.checked) {
    // Define the size of the arrow and its tip
    var arrow_tip_width = 5 ;
    var arrow_tip_length = Math.PI / 4.5 ;
    var arrow_length = Math.PI / 9 ;
    var turn_rollcurveRadius = rollcurveRadius * 2 ;
  }
  var pathsArray = [];
  var extent = Math.abs(param);
  var sign = param > 0 ? 1 : -1;
  var sweepFlag = param > 0 ? 1 : 0;
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  if (!newTurnPerspective.checked) {
    // Make the tip shape
    var radPoint = rad + sign * (Math.PI / 3.5);
    dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius);
    dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    var radPoint = rad + sign * (Math.PI / 6);
    dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    pathsArray.push ({'path':path, 'style':'blackfill'});
  
    // Calculate at which angle the curve starts and stops
    radPoint = (extent >= 360) ? rad - sign * (Math.PI / 6) : rad;
    var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
    var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
    // Make the curved path
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' a ' +
      rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag +
      ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
  } else {
    var persp_Sin = Math.sin(yAxisOffset * Math.degToRad);
    var persp_Cos = Math.cos(yAxisOffset * Math.degToRad);
    // get ellipse parameters
    var rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.H_rot_angle : -perspective_param.H_rot_angle;
    var X_rollcurveRadius = roundTwo(perspective_param.H_x_radius * turn_rollcurveRadius) ;
    var Y_rollcurveRadius = roundTwo(perspective_param.H_y_radius * turn_rollcurveRadius) ;
    // Make the tip shape
    var radPoint = rad + sign * arrow_tip_length ;
    dxTip = ((Math.cos(radPoint) - radCos) * turn_rollcurveRadius);
    dyTip = -((Math.sin(radPoint) - radSin) * turn_rollcurveRadius);
    var el_dxTip = dxTip - yAxisScaleFactor * dyTip * persp_Cos ; 
    var el_dyTip = yAxisScaleFactor * dyTip * persp_Sin ; 
    path = 'm ' + roundTwo(el_dxTip) + ',' + roundTwo(el_dyTip) + ' ';
    var radPoint = rad + sign * arrow_length ;
    dx = (((Math.cos(radPoint) * (turn_rollcurveRadius + arrow_tip_width)) - (radCos * turn_rollcurveRadius))) - dxTip;
    dy = -(((Math.sin(radPoint) * (turn_rollcurveRadius + arrow_tip_width)) - (radSin * turn_rollcurveRadius))) - dyTip;
    var el_dx = dx - yAxisScaleFactor * dy * persp_Cos ; 
    var el_dy = yAxisScaleFactor * dy * persp_Sin ; 
    path += 'l ' + roundTwo(el_dx) + ',' + roundTwo(el_dy) + ' ';
    dx = (((Math.cos(radPoint) * (turn_rollcurveRadius - arrow_tip_width)) - (radCos * turn_rollcurveRadius))) - dx - dxTip;
    dy = -(((Math.sin(radPoint) * (turn_rollcurveRadius - arrow_tip_width)) - (radSin * turn_rollcurveRadius))) - dy - dyTip;
    el_dx = dx - yAxisScaleFactor * dy * persp_Cos ; 
    el_dy = yAxisScaleFactor * dy * persp_Sin ; 
    path += 'l ' + roundTwo(el_dx) + ',' + roundTwo(el_dy) + ' z';
    pathsArray.push ({'path':path, 'style':'blackfill'});
  
    // Calculate at which angle the curve starts and stops
    radPoint = (extent >= 360) ? rad - sign * arrow_length : rad;
    var dx = (Math.cos(radPoint) - radCos) * turn_rollcurveRadius - dxTip;
    var dy = -(Math.sin(radPoint) - radSin) * turn_rollcurveRadius - dyTip;
    el_dx = dx - yAxisScaleFactor * dy * persp_Cos ; 
    el_dy = yAxisScaleFactor * dy * persp_Sin ; 
    // Make the curved path
    path = 'm ' + roundTwo(el_dxTip) + ',' + roundTwo(el_dyTip) + ' a ' +
      X_rollcurveRadius + ',' + Y_rollcurveRadius + ' ' + rot_axe_Ellipse + ' 0 ' + sweepFlag +
      ' ' + roundTwo(el_dx) + ',' + roundTwo(el_dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
  }
  return pathsArray;
}

// makeTurn builds turns and rolling circles from the draw instructions
// parsed from fig[i].draw
function makeTurn (draw) {
  // parse base
  var pathsArray = [];
  // Check if we are in an in/out or out/in roll
  regex = /io|IO/;
  var switchRollDir = regex.test(draw) ? true : false;
  var sign = 1;
  var numbers = draw.replace(/[^\d]+/g, '');
  var extent = parseInt(numbers.charAt(0)) * 90;
  // Set the default exit direction
  if ((extent == 90) || (extent == 270)) {
    var dirChange = sign * extent;
    changeDir (dirChange);
    if ((Direction == 0) || (Direction == 180)) {
      // Set depending on goRight on X axis
      if ((((Direction == 0) == (Attitude == 0)) != goRight ) == (!/^[CL]$/.test(activeForm))) {
        sign = -sign;
        rollDir = -rollDir;
      }
    } else {
      // Set towards viewer on Y axis
      if (((Direction == 90) == (Attitude == 0)) == (!/^[CL]$/.test(activeForm))) {
        sign = -sign;
        rollDir = -rollDir;
      }
    }
    changeDir (-dirChange);
  } else {
    if ((Direction == 0) || (Direction == 180)) {
      // towards viewer X-to-X axis
      if (((Direction == 0) == (Attitude < 180)) == (!/^[CL]$/.test(activeForm))) {
        sign = -sign;
        rollDir = -rollDir;
      }
    } else {
      // according goRight Y-to-Y axis
      if ((((Direction == 90) == (Attitude == 0)) != goRight ) == (!/^[CL]$/.test(activeForm))) {
        sign = -sign;
        rollDir = -rollDir;
      }
    }
  }
  // Check if the exit direction is flipped
  if (draw.charAt(0) == userpat.moveforward) {
    var sign = -sign;
  }
  
  // See if we start with an outside roll
  regex = /J/;
  var rollDir = regex.test(draw) ? -sign : sign;
  // See if we start inverted, this will also flip the drawing direction
  if (Attitude == 180) rollDir = -rollDir;
  
  // use for wingover
  var newAttitude = Attitude;
  if (extent == 180) {
    newAttitude = 360 - Attitude;
    if (newAttitude == 360) newAttitude = 0;
  }

  // See if direction change is called for by the preparsed draw string
  if (newAttitude != Attitude) {
    // for wingover, HACK
    var stopRad = dirAttToXYAngle (Direction + (sign * extent), newAttitude);
    var startRad = dirAttToXYAngle (Direction, Attitude);
  } else {
    if (!newTurnPerspective.checked) {
      var stopRad = dirAttToAngle (Direction + (sign * extent), newAttitude);
      var startRad = dirAttToAngle (Direction, Attitude);
    } else {
      // dirAttToAngle -> dirAttToGGAngle
      var stopRad = dirAttToGGAngle (Direction + (sign * extent), newAttitude);
      var startRad = dirAttToGGAngle (Direction, Attitude);
    }
  }
  if (stopRad < 0) stopRad += Math.Tau;
  if (startRad < 0) startRad += Math.Tau;
  startRadSave = startRad;
  var rad = sign * stopRad - sign * startRad;
  if (rad <= 0) rad += Math.Tau;
  if (numbers.length > 1) {
    // rolling turns
    var steps = 0;
    var rolls = 0;
    for (var i = 1; i < numbers.length; i++) {
      if (numbers[i] == '5') {
        rolls += 0.5;
        steps++;
      } else {
        rolls += parseInt(numbers[i]);
        steps += parseInt(numbers[i]);
      }
    }
    var step = rad / steps;
    var halfStepSigned = sign * (step / 2);
    var rollPos = 1;
    for (var i = 0; i < rad; i += step) {
      pathsArray = makeTurnArc (halfStepSigned, startRad, startRad + halfStepSigned, pathsArray);
      startRad += halfStepSigned;
      if (numbers[rollPos] == '5') { 
        rollPaths = makeTurnRoll (180 * rollDir, startRad);
        changeDir (180);
        changeAtt (180);
        if (switchRollDir) rollDir = -rollDir;
      } else {
        rollPaths = makeTurnRoll (360 * rollDir, startRad);
        if (switchRollDir) rollDir = -rollDir;
      }
      for (var j = 0; j < rollPaths.length; j++) {
        pathsArray.push (rollPaths[j]);
      }
      pathsArray = makeTurnArc (halfStepSigned, startRad, startRad + halfStepSigned, pathsArray);
      startRad += halfStepSigned;
      rollPos++;
    }
    if (extent != 360) {
	    pathsArray = makeTurnDots (sign*(Math.Tau - rad), stopRad, startRadSave, pathsArray);
		}
    changeDir (sign * extent);
  } else {
    // regular turns
    if (extent != 360) {
      pathsArray = makeTurnArc (sign * rad, startRad, stopRad, pathsArray);
      pathsArray = makeTurnDots (sign * (Math.Tau-rad), stopRad, startRad, pathsArray);
      // build turn extent text with degree sign in unicode
      // not always exactly centered: fixme: improve code
      if (!newTurnPerspective.checked) {
        var dx = -sign * (Math.sin (stopRad)) * curveRadius;
        var dy = -sign * (Math.cos (stopRad)) * curveRadius * flattenTurn;
      } else {
        var X_curveRadius = roundTwo(perspective_param.H_x_radius * curveRadius) ;
        var Y_curveRadius = roundTwo(perspective_param.H_y_radius * curveRadius) ;
        var dx = -sign * (Math.sin (stopRad)) * X_curveRadius;
        var dy = -sign * (Math.cos (stopRad)) * Y_curveRadius + rollFontSize / 3;
      }

      pathsArray.push ({
        'text':extent + "\u00B0",
        'style':'rollText',
        'x':dx,
        'y':dy,
        'text-anchor':'middle'
      });
      changeDir (sign * extent);
      // used for wingover
      Attitude = newAttitude;
    } else {
      pathsArray = makeTurnArc (sign * Math.PI, startRad, startRad + Math.PI, pathsArray);
      changeDir (180);
      pathsArray = makeTurnArc (sign * Math.PI, startRad + Math.PI, startRad, pathsArray);
      changeDir (180);
    }
  }
  return pathsArray;
}

// makeRollText is a helper function for makeRoll, makeSnap and makeSpin.
// It creates the text (2x8, 3/4 etc) and also comments next to rolls,
// snaps and spins.
// It returns the text as a pathArray, or false for no text
function makeRollText (extent, stops, sign, comment, radSin, radCos) {
  // don't flip text by default and start with empty comment text
  var flipText = false;
  var text = '';
  
  // check for roll comment
  if (comment) {
    // check for roll text flip
    if (comment[0] === userpat.flipNumber) {
      flipText = true;
      comment = comment.substring (1);
    }
    text = comment;
  }

  if ((extent % 180) || (stops > 0) || (text.length > 0)) {
    if (stops > 0) {
      if (text.length > 0) text = ' ' + text;
      if (extent != 360) text = 'x' + stops + text;
      text = (extent / (360 / stops)) + text;
    } else if (extent % 180) {
      if (text.length > 0) text = ' ' + text;
      text = ((extent % 360) / 90) + '/4' + text;
    }
    if (flipText) {
      if (extent >= 360) { // make room for 'tail' of roll symbol
        dx = sign * (radSin * (rollcurveRadius + ((rollFontSize / 5) * text.length)));
        dy = sign * (radCos * (rollcurveRadius + rollFontSize / 2)) + (rollFontSize / 5) + 1;
      } else {             // no tail
        dx = sign * (radSin * (rollcurveRadius / 2 + ((rollFontSize / 5) * text.length)));
        dy = sign * (radCos * (rollcurveRadius / 2 + rollFontSize / 2)) + (rollFontSize / 5) + 1;
      }
    } else {
      if (extent > 360) { // make room for roll connect line
        dx = -sign * (radSin * (rollcurveRadius + 4 + ((rollFontSize / 4) * text.length)));
        dy = -sign * (radCos * (rollcurveRadius + 4 + rollFontSize / 3)) + (rollFontSize / 4) + 2;
      } else {
        dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 4) * text.length)));
        dy = -sign * (radCos * (rollcurveRadius + rollFontSize / 3)) + (rollFontSize / 4) + 2;
      }
    }
  }

  if (text != '') {
    return ({'text':text, 'style':'rollText', 'x':dx, 'y':dy, 'text-anchor':'middle'});
  } else {
    return false;
  }
}

// makeRoll creates aileron rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of roll
// [1] is hesitations in fractions of full roll
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional glider super slow roll argument, true = slow roll
// [4] is optional autocorrect roll argument, true = autocorrect roll
// [5] is optional comment
// [6] is optional generic roll symbol	1 = roll, 2 = half roll, 3 = any roll, 4 = any roll or spin
// Example: (270,4) would be a 3x4 roll
function makeRoll (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var sweepFlag = params[0] > 0 ? 1 : 0;
  if (params.length > 2) var rollTop = params[2];
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
    rad = True_Drawing_Angle;
  }
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  // distinguish for autocorrect rolls
  if (params[4]) {
    var style = ['corrfill', 'corr'];
    // draw circle around roll
    pathsArray.push({'path': 'm -' + (rollcurveRadius * 1.2) + ',0 a' +
      (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
      ' 0 1 1 0,0.01', 'style':style[1]});
  } else {
    var style = ['blackfill', 'pos'];
  }
  while (extent > 0) {
    // Make the tip shape
    var radPoint = rad + sign * (Math.PI / 3.5);
    dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius);
    dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    var radPoint = rad + sign * (Math.PI / 6);
    dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
    dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    // only show arrow tip when params[6] is not trueish
    if (!params[6]) pathsArray.push ({'path':path, 'style':style[0]});

    // Make the second tip for glider super slow rolls
    if (params[3]) {
      var radPoint = rad + sign * (Math.PI / 2.5);
      dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius);
      dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
      var radPoint = rad + sign * (Math.PI / 3.5);
      dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
      dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
      dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
      pathsArray.push ({'path':path, 'style':style[0]});
    }
    
    // Calculate at which angle the curve starts and stops
		radPoint = (extent >= 360) ?
	    rad - sign * (Math.PI / (params[6] ? 3.5 : 6)) : // make roll symmetrical or not
	    rad;
    var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
    var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
    // Make the curved path
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' a ' +
      rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag +
      ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':style[1]});

    if (params[6] > 2) {	// if "any roll" or spin => Draw the 2 little lines for "any rolls" and, if spin, the drawing "spin allowed".
       var
	       G_len = roundTwo (rollcurveRadius / 2),
	       G_pos = roundTwo (rollcurveRadius / 5);	// Length and spacing of the 2 little lines for "any rolls".
       path = 'm ' + (dxTip + (dxTip > 0 ? G_pos : -G_pos)) +
	       ',' + (dyTip + 0.5 * G_len) + ' v ' + -G_len +
	       ' m ' + (dxTip > 0 ? G_pos : -G_pos) + ',0 v ' + G_len;
       pathsArray.push ({'path':path, 'style':style[1]});
       if (params[6] == 4) {	// Draw the drawing "spin allowed".
				 G_pos = rollcurveRadius / 15 ;
	    	 path = 'm ' + roundTwo(-dxTip +
		    	 (dx > 0 ? 2 * G_len + G_pos : -2 * G_len -G_pos)) + ',' +
		    	 roundTwo(dy - 0.7 * G_len) + ' h ' + roundTwo(2*G_len) +
		    	 ' l ' + roundTwo(-2*G_len) + ',' + roundTwo(G_len);
	    	 pathsArray.push ({'path':path, 'style':style[1]});
       }
    }
            
    // Where necessary, show the roll numbers after completing the first
    // roll point and arc.
    // This is only necessary for rolls that are not multiples of 180 or
    // have hesitations
    // Also add any user defined comment here
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (
        extent,
        stops,
        sign,
        params[5],
        radSin,
        radCos
      );
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) roll. Continue for more than 360
    extent -= 360;
    // For more than 360 degrees, draw a line between the rolls and the
    // roll tip connect line
    if (extent > 0) {
      // Make the line between the two rolls.
      // Only move the pointer (no line) for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', [1/scale], pathsArray);
      } else {
        pathsArray = buildShape ('Line', [1/scale], pathsArray);
      }
      // Get the relative movement by the line and use this to build the
      // tip additional line
      dx = pathsArray[pathsArray.length - 1].dx;
      dy = pathsArray[pathsArray.length - 1].dy;
      // glider super slow roll or regular roll
      var radPoint = params[3] ? rad+sign*(Math.PI/2) : rad+sign*(Math.PI/3);

      dxTip = (((Math.cos(radPoint) * (rollcurveRadius + 2)) - (radCos * rollcurveRadius)));
      dyTip = -(((Math.sin(radPoint) * (rollcurveRadius + 2)) - (radSin * rollcurveRadius)));
      if (params[3]) {
        // glider super slow roll
        path = 'm ' + roundTwo(dxTip+dx/2) + ',' + roundTwo(dyTip+dy/2) +
          ' l ' + roundTwo(-dx*1.5) + ',' + roundTwo(-dy*1.5);
      } else {
        // regular roll
        path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
          roundTwo(-dx) + ',' + roundTwo(-dy);
      }
      pathsArray.push ({'path':path, 'style':style[1]});
    }
  }
  return pathsArray;
}

// makeSnap creates snap rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of snap
// [1] indicates pos or neg snap. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional comment
// Examples: (270,0) is a 3/4 pos snap. (180,1) is a 1/2 neg snap
function makeSnap (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
    rad = True_Drawing_Angle;
  }
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  if (params.length > 2) var rollTop = params[2];

  // tipFactor makes sure the tip symbol is exactly on the tip,
  // considering default line thickness
  var tipFactor = snapElement2 / (snapElement2 + 0.75);

  while (extent > 0) {
    // Make the base shape
    dxTip = -radSin * (snapElement2 + 0.75) * sign;
    dyTip = -radCos * (snapElement2 + 0.75) * sign;
    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    dx = radCos * snapElement; 
    dy = -radSin * snapElement;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
    path = 'm ' + roundTwo(dxTip * tipFactor) + ',' + roundTwo(dyTip * tipFactor) + ' ';
    if (extent >= 360) { // full snap symbol
      dx = (radCos * snapElement12) + (radSin * snapElement3 * sign);
      dy = (- radSin * snapElement12) + (radCos * snapElement3 * sign);
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * snapElement24;
      dy = radSin * snapElement24;
    } else { // half snap symbol
      dx = (radCos * snapElement) + (radSin * snapElement2 * sign);
      dy = (- radSin * snapElement) + (radCos * snapElement2 * sign);
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * snapElement2;
      dy = radSin * snapElement2;
    }
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    pathStyle = (params[1] == 0) ? 'posfill' : 'negfill';
    pathsArray.push ({
      'path':path,
      'style':pathStyle,
      'dx':radCos * snapElement075,
      'dy':-radSin * snapElement075
    });

    // Where necessary, show the roll numbers after completing the first
    // roll point and arc.
    // This is only necessary for rolls that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (
        extent,
        0,
        sign,
        params[3],
        radSin,
        radCos
      );
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) roll. Continue for more than 360
    extent -= 360;
    // For more than 360 degrees, draw a line between the rolls and the
    // roll tip connect line
    if (extent > 0) {
      // Save the status of the load variable, don't want to change that
      // during the roll
      var saveLoad = NegLoad;
      // Make the line between the two rolls
      // Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', [1.5/scale], pathsArray);
      } else {
        pathsArray = buildShape ('Line', [1.5/scale], pathsArray);
      }
      NegLoad = saveLoad;
      // Get the relative movement by the line and use this to build the
      // tip additional line
      dx = pathsArray[pathsArray.length - 1].dx + radCos * snapElement2;
      dy = pathsArray[pathsArray.length - 1].dy - radSin * snapElement2;
      dxTip = -radSin * snapElement24 * sign + radCos * snapElement;
      dyTip = -radCos * snapElement24 * sign - radSin * snapElement;
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
        roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
    }
  }
  return pathsArray;
}

// makeSpin creates spins
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of spin
// [1] indicates pos or neg spin. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional comment
// Examples: (270,0) is a 3/4 pos spin. (540,1) is a 1 1/2 neg spin
function makeSpin (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude);
  if (params.length > 2) var rollTop = params[2];
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);

  // tipFactor makes sure the tip symbol is exactly on the tip,
  // considering default line thickness
  var tipFactor = spinElement2 / (spinElement2 - 0.75);
    
  while (extent > 0) {
    // Make the base shape
    // First make the tip line
    dxTip = -radSin * (spinElement2 - 0.75) * sign;
    dyTip = -radCos * (spinElement2 - 0.75) * sign;

    path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' ';
    dx = radCos * spinElement;
    dy = -radSin * spinElement;
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    pathsArray.push ({'path':path, 'style':'pos'});
    // Next make the triangle
    path = 'm ' + roundTwo(dxTip * tipFactor) + ',' + roundTwo(dyTip * tipFactor) + ' ';
    if (extent >= 360) {
      dx = (radCos * spinElement * 1.5) + (radSin * spinElement3 * sign);
      dy = (- radSin * spinElement * 1.5) + (radCos * spinElement3 * sign);
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * spinElement * 1.5;
      dy = radSin * spinElement * 1.5;
    } else {
      dx = (radCos * spinElement) + (radSin * spinElement2 * sign);
      dy = (- radSin * spinElement) + (radCos * spinElement2 * sign);
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = (- radCos) * spinElement;
      dy = radSin * spinElement;
    }
    path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' z';
    if (params[1] == 0) pathStyle = 'posfill'; else pathStyle = 'negfill';
    pathsArray.push ({
      'path':path,
      'style':pathStyle,
      'dx':radCos * spinElement,
      'dy':-radSin * spinElement
    });
    // Where necessary, show the roll numbers after completing the first
    // roll point and arc.
    // This is only necessary for spins that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (extent, 0, sign, params[3], radSin, radCos);
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) spin. Continue for more than 360
    extent -= 360;
    // For more than 360 degrees, draw a line between the spins and the
    // spin tip connect line
    if (extent > 0) {
      // Make the line between the two rolls. Always positive for now
      // Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', [0.5/scale], pathsArray);
      } else {
        pathsArray = buildShape ('Line', [0.5/scale], pathsArray);
      }
      // Get the relative movement by the line and use this to build the
      // tip additional line
      dx = pathsArray[pathsArray.length - 1].dx + radCos * spinElement2;
      dy = pathsArray[pathsArray.length - 1].dy - radSin * spinElement2;
      dxTip = -radSin * spinElement24 * sign + radCos * spinElement;
      dyTip = -radCos * spinElement24 * sign - radSin * spinElement;
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
        roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
    }
  }
  return pathsArray;
}

// makeShoulderRoll creates shoulder rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction
// [1] indicates pos or neg. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in
//     top, true = in top
// [3] is optional comment
function makeShoulderRoll (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
    rad = True_Drawing_Angle;
  }
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  if (params.length > 2) var rollTop = params[2];

  while (extent > 0) {
    // Make the base shape
    dx = roundTwo((radCos * snapElement15) - (radSin * snapElement15 * sign));
    dy = roundTwo(-(radCos * snapElement15 * sign) - (radSin * snapElement15));
    path = 'a' + snapElement15 + ',' + snapElement15 + ' 0 0,' +
      (sign === 1 ? 1 : 0) + ' ' + dx + ',' + dy;
    dx = roundTwo((radCos * snapElement15) + (radSin * snapElement15 * sign));
    dy = roundTwo((radCos * snapElement15 * sign) - (radSin * snapElement15));
    path += ' l ' + dx + ',' + dy + ' ';

    if (extent >= 360) { // full shoulder roll symbol
      dx = radSin * snapElement075 * sign;
      dy = radCos * snapElement075 * sign;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = -radCos * snapElement3;
      dy = radSin * snapElement3;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    }
    path += 'z';
    pathStyle = (params[1] == 0) ? 'posfill' : 'negfill';
    pathsArray.push ({
      'path':path,
      'style':pathStyle,
      'dx':radCos * snapElement3,
      'dy':-radSin * snapElement3
    });

    // Where necessary, show the roll numbers after completing the first
    // roll point and arc.
    // This is only necessary for rolls that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (
        extent,
        0,
        sign,
        params[3],
        radSin,
        radCos
      );
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) roll. Continue for more than 360
    extent -= 360;
    // For more than 360 degrees, draw a line between the rolls and the
    // roll tip connect line
    if (extent > 0) {
      // Save the status of the load variable, don't want to change that
      // during the roll
      var saveLoad = NegLoad;
      // Make the line between the two rolls
      // Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', [0.5/scale], pathsArray);
      } else {
        pathsArray = buildShape ('Line', [0.5/scale], pathsArray);
      }
      NegLoad = saveLoad;
      // Get the relative movement by the line and use this to build the
      // tip additional line
      dx = pathsArray[pathsArray.length - 1].dx + radCos * snapElement3;
      dy = pathsArray[pathsArray.length - 1].dy - radSin * snapElement3;
      dxTip = -radSin * snapElement2 * sign + radCos * snapElement;
      dyTip = -radCos * snapElement2 * sign - radSin * snapElement;
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
        roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
    }
  }
  return pathsArray;
}

// makeRuade creates ruades
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction
// [1] indicates pos or neg. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in
//     top, true = in top
// [3] is optional comment
function makeRuade (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
    rad = True_Drawing_Angle;
  }
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  if (params.length > 2) var rollTop = params[2];

  while (extent > 0) {
    // Make the base shape
    dx = roundTwo(-radSin * snapElement15 * sign);
    dy = roundTwo(-radCos * snapElement15 * sign);
    path = 'l' + dx + ',' + dy;
    dx = roundTwo((radCos * snapElement3) + (radSin * snapElement15 * sign));
    dy = roundTwo((radCos * snapElement15 * sign) - (radSin * snapElement3));
    path += ' l ' + dx + ',' + dy + ' ';

    if (extent >= 360) { // full ruade symbol
      dx = radSin * snapElement075 * sign;
      dy = radCos * snapElement075 * sign;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = -radCos * snapElement3;
      dy = radSin * snapElement3;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    }
    path += 'z';
    pathStyle = (params[1] == 0) ? 'posfill' : 'negfill';
    pathsArray.push ({
      'path':path,
      'style':pathStyle,
      'dx':radCos * snapElement3,
      'dy':-radSin * snapElement3
    });

    // Where necessary, show the roll numbers after completing the first
    // roll point and arc.
    // This is only necessary for rolls that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (
        extent,
        0,
        sign,
        params[3],
        radSin,
        radCos
      );
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) roll. Continue for more than 360
    extent -= 360;
    // For more than 360 degrees, draw a line between the rolls and the
    // roll tip connect line
    if (extent > 0) {
      // Save the status of the load variable, don't want to change that
      // during the roll
      var saveLoad = NegLoad;
      // Make the line between the two rolls
      // Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', [0.5/scale], pathsArray);
      } else {
        pathsArray = buildShape ('Line', [0.5/scale], pathsArray);
      }
      NegLoad = saveLoad;
      // Get the relative movement by the line and use this to build the
      // tip additional line
      dx = pathsArray[pathsArray.length - 1].dx + radCos * snapElement3;
      dy = pathsArray[pathsArray.length - 1].dy - radSin * snapElement3;
      dxTip = -radSin * snapElement2 * sign + radCos * snapElement;
      dyTip = -radCos * snapElement2 * sign - radSin * snapElement;
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
        roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
    }
  }
  return pathsArray;
}

// makeLomcevak creates Lomcevaks
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction
// [1] indicates pos or neg. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in
//     top, true = in top
// [3] is optional comment
function makeLomcevak (params) {
  var pathsArray = [];
  var stops = params[1];
  var extent = Math.abs(params[0]);
  var sign = params[0] > 0 ? 1 : -1;
  var rad = dirAttToAngle (Direction, Attitude);
  if (((Attitude == 45) || (Attitude == 315)) || ((Attitude == 225) || (Attitude == 135))) {
    rad = True_Drawing_Angle;
  }
  // calculate sin and cos for rad once to save calculation time
  var radSin = Math.sin(rad);
  var radCos = Math.cos(rad);
  if (params.length > 2) var rollTop = params[2];

  while (extent > 0) {
    // Make the base shape
    dx = roundTwo(-radSin * snapElement15 * sign);
    dy = roundTwo(-radCos * snapElement15 * sign);
    path = 'l' + dx + ',' + dy;
    dx = roundTwo(radCos * snapElement3);
    dy = roundTwo(-radSin * snapElement3);
    path += 'l' + dx + ',' + dy;
    dx = roundTwo(-(radCos * snapElement15) + (radSin * snapElement15 * sign));
    dy = roundTwo((radCos * snapElement15 * sign) + (radSin * snapElement15));
    path += 'a' + snapElement15 + ',' + snapElement15 + ' 0 0,' +
      (sign === 1 ? 0 : 1) + ' ' + dx + ',' + dy;
    dx = roundTwo(radCos * snapElement15);
    dy = roundTwo(-radSin * snapElement15);
    path += 'l' + dx + ',' + dy;

    if (extent >= 360) { // full Lomcevak symbol
      dx = radSin * snapElement075 * sign;
      dy = radCos * snapElement075 * sign;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
      dx = -radCos * snapElement3;
      dy = radSin * snapElement3;
      path += 'l ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
    }
    path += 'z';
    pathStyle = (params[1] == 0) ? 'posfill' : 'negfill';
    pathsArray.push ({
      'path':path,
      'style':pathStyle,
      'dx':radCos * snapElement3,
      'dy':-radSin * snapElement3
    });

    // Where necessary, show the roll numbers after completing the first
    // roll point and arc.
    // This is only necessary for rolls that are not multiples of 180
    if (extent == Math.abs(params[0])) {
      var rollText = makeRollText (
        extent,
        0,
        sign,
        params[3],
        radSin,
        radCos
      );
      if (rollText) pathsArray.push (rollText);
    }
    // Completed the first (full) roll. Continue for more than 360
    extent -= 360;
    // For more than 360 degrees, draw a line between the rolls and the
    // roll tip connect line
    if (extent > 0) {
      // Save the status of the load variable, don't want to change that
      // during the roll
      var saveLoad = NegLoad;
      // Make the line between the two rolls
      // Only move the pointer for rolls in the top
      if (rollTop) {
        pathsArray = buildShape ('Move', [0.5/scale], pathsArray);
      } else {
        pathsArray = buildShape ('Line', [0.5/scale], pathsArray);
      }
      NegLoad = saveLoad;
      // Get the relative movement by the line and use this to build the
      // tip additional line
      dx = pathsArray[pathsArray.length - 1].dx + radCos * snapElement3;
      dy = pathsArray[pathsArray.length - 1].dy - radSin * snapElement3;
      dxTip = -radSin * snapElement2 * sign + radCos * snapElement;
      dyTip = -radCos * snapElement2 * sign - radSin * snapElement;
      path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' l ' +
        roundTwo(-dx) + ',' + roundTwo(-dy);
      pathsArray.push ({'path':path, 'style':'pos'});
    }
  }
  return pathsArray;
}

// makeHammer creates hammerhead tops
// extent is the size of the line before the hammerhead top.
// We will move that much down before continuing drawing
function makeHammer (extent) {
  var pathArray = {
    style: 'pos',
    class: 'hammerTip',
    dx: 0,
    dy: lineElement * extent
  };
  Attitude = 270;
  changeDir(180);
  if ((Direction == 90) || (Direction == 270)) {
    dy = roundTwo((1 - scaleLine.y) * lineElement);
    dx = roundTwo(scaleLine.x * lineElement);
    pathArray.path = "l " + (dx) + "," + (dy);
  } else {
    pathArray.path = "l " + (lineElement) + "," + (lineElement);
  }
  return Array(pathArray);
}

// makeTailslide creates tailslide tops
// param gives the type as a string
function makeTailslide (param) {
  var pathsArray = new Array(Array(),Array());
  var sweepFlag = 1;
  NegLoad = 0;
  var angle = dirAttToAngle (Direction, Attitude);
  if (param == figpat.tailslidewheels) angle = -angle;
  sweepFlag = (angle > 0) ? 1 : 0;
  pathsArray[0].style = (param == figpat.tailslidecanopy) ? 'pos' : 'neg';
  var Radius = curveRadius;
  dx = (angle > 0) ? -Radius : Radius;
  dy = Radius;
  // Make the path and move the cursor
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.rot_angle : -perspective_param.rot_angle;
    var X_axis_Radius = perspective_param.x_radius * Radius;
    var Y_axis_Radius = perspective_param.y_radius * Radius;
    dx *= scaleLine.x;
    dy -= dx * scaleLine.y;
    if (yAxisOffset > 90) dx = -dx;

    pathsArray[0].path = 'a' + roundTwo(X_axis_Radius) + ',' +
      roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' 0 ' +
      sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathsArray[0].path = 'a' + Radius + ',' + Radius + ' 0 0 ' +
      sweepFlag + ' ' + dx + ',' + dy;
  }
  pathsArray[0].dx = dx;
  pathsArray[0].dy = dy;
  var Radius = curveRadius / 2;
  dx = (angle > 0) ? Radius : -Radius;
  dy = Radius;
  if (((Direction == 90) || (Direction == 270)) && curvePerspective) {
    var Rot_axe_Ellipse = (yAxisOffset < 90) ? perspective_param.rot_angle : -perspective_param.rot_angle;
    var X_axis_Radius = perspective_param.x_radius * Radius;
    var Y_axis_Radius = perspective_param.y_radius * Radius;
    dx *= scaleLine.x;
    dy -= dx * scaleLine.y;
    if (yAxisOffset > 90) dx = -dx;

    pathsArray[1].path = 'a' + roundTwo(X_axis_Radius) + ',' +
      roundTwo(Y_axis_Radius) + ' ' + Rot_axe_Ellipse + ' 0 ' +
      sweepFlag + ' ' + roundTwo(dx) + ',' + roundTwo(dy);
  } else {
    pathsArray[1].path = 'a' + Radius + ',' + Radius + ' 0 0 ' +
      sweepFlag + ' ' + dx + ',' + dy;
  }
  pathsArray[1].style = 'pos';
  pathsArray[1].dx = dx;
  pathsArray[1].dy = dy;
  Attitude = 270;
  return pathsArray;
}

// makePointTip creates pointed tops (non-Aresti)
// extent is the size of the line before the top.
// We will move that much down before continuing drawing
function makePointTip (extent) {
  changeAtt(180);
  changeDir(180);
  return Array({
    path: 'M 0,0', // make sure it is "drawn", as a drag handle marker
    style: 'pos',
    class: 'pointTip',
    dx: 0,
    dy: lineElement * extent
  });
}

// tspan creates an svg tspan with optional spacing to the next line 
function tspan (line, dy) {
  // when no dy supplied, set to 14
  dy = typeof dy !== 'undefined' ? dy : 14;
  // create span
  var span = document.createElementNS (svgNS, 'tspan');
  span.setAttribute('x', 0);
  span.setAttribute('dy', dy);
  span.appendChild(document.createTextNode(line));
  return span;
}

// makeTextBlock makes text blocks, for example from comments.
// It also handles assignment of figure letter codes for Free (un)known
// operations.
function makeTextBlock (text) {
  var pathsArray = [];
  var rotate = false;
  var header = true;
  
  // handle special code for Free (Un)known figure designation
  var regex = /^@[A-Z]/;
  var match = text.match(regex);
  if (match) {
    text = text.replace (match[0], '');
    unknownFigureLetter = match[0].replace('@', '');
  }
  // handle special code for Unknown additional
  var regex = /^additional$/;
  if (text.match(regex)) {
    text = '';
    unknownFigureLetter = 'L';
  }
  
  // remove letter if it is an additional figure and none are allowed
  if ((unknownFigureLetter === 'L') && !additionalFig.max) {
    unknownFigureLetter = false;
  }
  
  if (text != '') {
    // temporarily attach text to SVG root
    var t = SVGRoot.appendChild(document.createElementNS(svgNS, 'text'));
    t.setAttribute('style', style.textBlock);
    
    // determine fontSize or use default of 20
    var fontSize = style.textBlock.match(/font-size:[ ]*(\d+)px/)[1] || 20;

    // Parse special characters
    // Not all OLAN special codes are supported yet. They will be
    // filtered out
    var lineNr = 0;
    var line = '';
    var header = true;
    var styleId = 'textBlockBorder';
    
    for (var i = 0; i < text.length; i++) {
      switch (text[i]) {
        // anywhere tags
        case ('\\'): // new line          
          t.appendChild (tspan(line, fontSize));
          line = '';
          lineNr++;
          break;
        case ('#'): // aresti numbers and K
          break;
        case ('&'): // figure string
          break;
        // header only tags
        case ('_'): // put text block UNDER subsequent figure
        case ('~'): // put text block ABOVE subsequent figure
          if (header) {
            break;
          }
        case ('['): // make text block bold ( [ ) or red ( [[ )
          if (header) {
            styleId = 'textBlockBorderBold';
            if (text[i+1]) {
              if (text[i+1] === '[') {
                styleId = 'textBlockBorderBoldRed';
                i++;
              }
            }
            break;
          }
        case ('^'): // place block vertically
          if (header) {
            rotate = 90;
            break;
          }
        // no tag, add character
        default:
          line += text[i];
          header = false;
      }
    }

    t.appendChild (tspan(line, fontSize));

    // determine final text block size
    var box = t.getBBox();
    // if the box will be rotated, swap w and h
    if (rotate) {
      var h = box.width;
      var w = box.height;
    } else {
      var w = box.width;
      var h = box.height;
    }

    // remove element from SVG root
    SVGRoot.removeChild(t);

    // calculate where the center of the box should be
    // rotation is taken into account
    // current angle = angle to box center
    var angle = dirAttToAngle (Direction, Attitude);
    // find distance from box edge to center in this direction
    var s = Math.sin (angle);
    var c = Math.cos (angle);
    if (s == 0) { // horizontal
      var d = w / 2;
    } else if (c == 0) { // vertical
      var d = h / 2;
    } else { // other, choose shortest
      var d = Math.min (Math.abs ((w / 2) / c), Math.abs ((h / 2) / s));
    }
    
    // set top-left x and y of the text box
    var x = roundTwo ((c * d) - (w / 2));
    var y = - roundTwo ((s * d) + (h / 2));
    
    // set dx and dy for starting the figure after the text box
    var dx = roundTwo (2 * c * d);
    var dy = - roundTwo (2 * s * d);
    
    // draw rectangle around text
    pathsArray.push ({'path':'m ' + (x-3) + ',' + (y-3) + ' l ' + (w + 6) +
      ',0 l 0,' + (h + 6) + ' l' + -(w+6) + ',0 z', 'style':styleId});
      
    // when the text will be rotated, re-adjust x and y so the
    // un-rotated text will be in the right position before rotation
    if (rotate) {
      var x = roundTwo ((c * d) - (h / 2));
      var y = - roundTwo ((s * d) + (w / 2));
    }
    pathsArray.push ({'textBlock':t, 'x':x, 'y':y, 'dx':dx, 'dy':dy, 'r':rotate});
    
    // put space after block
    pathsArray.push (makeFigSpace(2)[0]);
  } else {
    pathsArray.push({'dx':0,'dy':0});
  }
  return pathsArray;
}

/**************************************************************************
 * Functions for creating and drawing complex shapes from the base shapes */

// draw a shape
function buildShape(shapeName, Params, paths) {
  // if the paths array was not provided, create an empty one
  if (!paths) var paths = [];
  // define the pathsArray by executing the correct makeShape function
  switch (shapeName) {
    case 'FigStart':
      var pathsArray = makeFigStart (Params);
      break;
    case 'FigStop':
      var pathsArray = makeFigStop (Params);
      break;
    case 'FigSpace':
      var pathsArray = makeFigSpace (Params);
      break;
    case 'VertSpace':
      var pathsArray = makeVertSpace (Params);
      break;
    case 'Line':
      var pathsArray = makeLine (Params);
      break;
    case 'Move':
      var pathsArray = makeMove (Params);
      break;
    case 'Corner':
      var pathsArray = makeCorner (Params);
      break;
    case 'Curve':
      var pathsArray = makeCurve (Params);
      break;
    case 'RollTopLine':
      var pathsArray = makeRollTopLine (Params);
      break;
    case 'TurnRoll':
      var pathsArray = makeTurnRoll (Params);
      break;
    case 'Turn':
      var pathsArray = makeTurn (Params);
      break;
    case 'Roll':
      var pathsArray = makeRoll (Params);
      break;
    case 'Snap':
      var pathsArray = makeSnap (Params);
      break;
    case 'Spin':
      var pathsArray = makeSpin (Params);
      break;
    case 'ShoulderRoll':
      var pathsArray = makeShoulderRoll (Params);
      break;
    case 'Ruade':
      var pathsArray = makeRuade (Params);
      break;
    case 'Lomcevak':
      var pathsArray = makeLomcevak (Params);
      break;
    case 'Hammer':
      var pathsArray = makeHammer (Params);
      break;
    case 'Tailslide':
      var pathsArray = makeTailslide (Params);
      break;
    case 'PointTip':
      var pathsArray = makePointTip (Params);
      break;
    case 'TextBlock':
      var pathsArray = makeTextBlock (Params);
      break;
  }
  // walk through the returned paths
  for (var i = 0; i < pathsArray.length; i++) {
    paths.push (pathsArray[i]);
  }
  return paths;
}

// drawShape draws a shape from a pathArray
// selectFigure will be true if the figure to be drawn is one selected
// by hover
// prev, if provided, should hold the contents and bounding box of a
// previous text element to avoid.
function drawShape (pathArray, svgElement, prev) {
  var cur = false;
  svgElement = svgElement || SVGRoot.getElementById('sequence');
  // decide if we are drawing a path or text or starting a figure
  if (pathArray.path) {
    var path = document.createElementNS (svgNS, "path");
    path.setAttribute('d', 'M ' + roundTwo(X) + ',' + roundTwo(Y) +
      ' ' + pathArray.path);
    path.setAttribute('style', style[pathArray.style]);
    if (pathArray.class) path.setAttribute('class', pathArray.class);
    if (pathArray.handle && svgElement.id) {
      path.setAttribute('id', svgElement.id + '-' + pathArray.handle);
    }
    // option for rotating paths. Not used yet but may become usefull
    // for fitting rolls and snaps to curve in top or bottom of loop
    if ('rotate' in pathArray) {
      path.setAttribute('transform', 'rotate(' + pathArray.rotate +
        ' ' + X + ' ' + Y + ')');
    }
    svgElement.appendChild(path);
  } else if (pathArray.text) {
    var text = drawText (
      pathArray.text,
      roundTwo(X + pathArray.x),
      roundTwo(Y + pathArray.y),
      pathArray.style,
      pathArray['text-anchor'],
      false,
      svgElement
    );
    
    // Following is used to check subsequent rolls for overlap and
    // apply corrections. We use two ellipses sized to fit the text BBox
    // to determine the correct distance.
    
    // If we are dealing with a rollText of 5 characters or less, create
    // cur. Longer texts are just too hard to separate consistently.
    if ((pathArray.text.length <= 5) && (pathArray.style == 'rollText')) {
      cur = text.getBBox();
      cur.t = text;
    }
    if (prev && cur) {
      // increase hor and decrease vert spacing
      var cx1 = parseFloat(cur.x + (cur.width / 2));
      var cy1 = parseFloat(cur.y + (cur.height / 2));
      var cx2 = parseFloat(prev.x + (prev.width / 2));
      var cy2 = parseFloat(prev.y + (prev.height / 2));
      // find the line between the centers of the ellipses
      var dx = parseFloat(cx2 - cx1);
      var dy = parseFloat(cy2 - cy1);
      var d = Math.sqrt(dx * dx + dy * dy);
      var cos = dx / d;
      var sin = dy / d;
      var rfCor = rollFontSize / 8;
      // find x and y on the ellipses in the direction of the line
      // connecting the centers
      var ex1 = cos * (cur.width / 2 + rfCor);
      var ey1 = sin * (cur.height / 2 - rfCor);
      var ex2 = cos * (prev.width / 2 + rfCor);
      var ey2 = sin * (prev.height / 2 - rfCor);
      var overlap = (Math.sqrt(ex1 * ex1 + ey1 * ey1) +
        Math.sqrt(ex2 * ex2 + ey2 * ey2)) - d;
      if (overlap > 0) {
        // move previous and current figure opposite by 50% of overlap
        overlap = overlap / 2;
        prev.t.setAttribute('x',
          roundTwo(parseFloat(prev.t.getAttribute('x')) + cos * overlap));
        prev.t.setAttribute('y',
          roundTwo(parseFloat(prev.t.getAttribute('y')) + sin * overlap));
        text.setAttribute('x', roundTwo(X + pathArray.x - cos * overlap));
        text.setAttribute('y', roundTwo(Y + pathArray.y - sin * overlap));
      }
    }
  } else if (pathArray.textBlock) {
    var tb = pathArray.textBlock;
    var spans = tb.getElementsByTagName('tspan');
    // set all tspan x values
    for (var i = 0; i < spans.length; i++) {
      spans[i].setAttribute('x', roundTwo(X + pathArray.x));
    }
    // set text x value
    tb.setAttribute('x', roundTwo(X + pathArray.x));
    tb.setAttribute('y', roundTwo(Y + pathArray.y));
    // when a rotation is specified, rotate around center
    svgElement.appendChild(tb);
    if (pathArray.r) {
      var box = tb.getBBox();
      tb.setAttribute ('transform', 'rotate (' + pathArray.r + ',' +
        roundTwo(box.x + box.width / 2) + ',' +
        roundTwo(box.y + box.height / 2) + ')');
    }
  } else if (pathArray.figureStart) {
    // Check if figure starts do not overlap when this is not the first
    // figure
    if (figureStart.length > 0) {
      // count is used to make sure there is never an infinite loop
      var count = 0;
      do {
        // Walk through the figure starts and see if we find any distance
        // lower than minimum with the one we're making now
        var overlap = false;
        for (var i = 0; i < figureStart.length; i++) {
          var distSq = (figureStart[i].x - X)*(figureStart[i].x - X) +
            (figureStart[i].y - Y)*(figureStart[i].y - Y);
          if (distSq < minFigStartDistSq) {
            // found one that's too close. Move the start down and run again
            Y = parseInt(figureStart[i].y + Math.sqrt(minFigStartDistSq-((figureStart[i].x - X)*(figureStart[i].x - X))) + 1);
            overlap = true;
            count ++;
            break; // break for loop
          }
        }
      } while (overlap && (count < 10000));
      Y = roundTwo(Y);
    }
    // Put this figure's start in the figureStart array for checking
    // against the next one
    figureStart.push({'x':X, 'y':Y});
  }
  if ('dx' in pathArray) X = roundTwo(X + pathArray.dx);
  if ('dy' in pathArray) Y = roundTwo(Y + pathArray.dy);
  return cur;
}

// drawLine draws a line from x,y to x+dx,y+dy in style styleId
// When an svg object is provided, it will be used i.s.o. the standard sequenceSvg
function drawLine (x, y, dx, dy, styleId, svg) {
  svg = svg || SVGRoot.getElementById('sequence');
  var path = document.createElementNS (svgNS, "path");
  path.setAttribute('d', 'M ' + roundTwo(x) + ',' + roundTwo(y) +
    ' l ' + roundTwo(dx) + ',' + roundTwo(dy));
  path.setAttribute('style',style[styleId]);
  svg.appendChild(path);
}
  
// drawRectangle draws a rectangle at position x, y in style styleId
// When an svg object is provided, it will be used i.s.o. the standard
// sequenceSvg
// The function returns the drawn rectangle
function drawRectangle (x, y, width, height, styleId, svg) {
  svg = svg || SVGRoot.getElementById('sequence');
  var path = document.createElementNS (svgNS, "rect");
  path.setAttribute('x', x);
  path.setAttribute('y', y);
  path.setAttribute('width', width);
  path.setAttribute('height', height);
  path.setAttribute('style', style[styleId]);
  svg.appendChild(path);
  return path;
}
  
// drawText draws any text at position x, y in style styleId with
// optional anchor, id, svg
function drawText (text, x, y, styleId, anchor, id, svg) {
  svg = svg || SVGRoot.getElementById('sequence');
  var newText = document.createElementNS (svgNS, "text");
  if (id) newText.setAttribute('id', id);
  if (style && styleId) newText.setAttribute('style', style[styleId]);
  if (anchor) newText.setAttribute('text-anchor', anchor);
  newText.setAttribute('x', roundTwo(x));        
  newText.setAttribute('y', roundTwo(y));
  var textNode = document.createTextNode(text);
  newText.appendChild(textNode);
  svg.appendChild (newText);
  return newText;
}

// drawTextArea draws any text area at position x, y in style styleId
// with optional anchor and id
// w and h are width and height. With one of them not set the other will
// be determined automatically
function drawTextArea (text, x, y, w, h, styleId, id, svg) {
  svg = svg || SVGRoot.getElementById('sequence');
  var newText = document.createElementNS (svgNS, "foreignObject");
  var div = document.createElement ('div');
  if (id) newText.setAttribute('id', id);
  newText.setAttribute('x', roundTwo(x));
  newText.setAttribute('y', roundTwo(y));
  if (w) {
    div.setAttribute('width', roundTwo(w));
    newText.setAttribute('width', roundTwo(w));
  }
  if (h) newText.setAttribute('height', roundTwo(h));
  div.innerHTML = text;
  if (styleId) div.setAttribute('style', style[styleId]);
  newText.appendChild (div);
  svg.appendChild (newText);
  return newText;
}

// drawCircle draws a circle
function drawCircle (attributes, svg) {
  svg = svg || SVGRoot.getElementById('sequence');
  var circle = document.createElementNS (svgNS, "circle");
  for (var key in attributes) circle.setAttribute(key, attributes[key]);
  svg.appendChild (circle);
}

// drawImage draws an image
function drawImage (attributes, svg) {
  svg = svg || SVGRoot.getElementById('sequence');
  var image = document.createElementNS (svgNS, 'image');
  for (var key in attributes) {
    if (key === 'href') {
      image.setAttributeNS(xlinkNS, 'href', attributes.href);
    } else image.setAttribute (key, attributes[key]);
  }
  svg.appendChild (image);
  return image;
}

// draw an aresti number text with a figure
function drawArestiText(figNr, aresti) {
  drawText (aresti, X, Y, 'start', 'text-' + figNr);
}

// Functions for setting up the software

// doOnLoad is only called on initial loading of the page
function doOnLoad () {

	var loading = document.getElementById ('loading');
  
  // define DOM variables
	if ((typeof chrome !== 'undefined') && chrome.fileSystem) {
		chromeApp.active = true;
		console.log('Running as Chrome app');
	}
  sequenceText = document.getElementById('sequence_text');
  sportingClass = document.getElementById('class');
  fileName = document.getElementById('fileName');
  getLocal ('fileName', function(value) {fileName.innerText = value});
  newTurnPerspective = document.getElementById('newTurnPerspective');
						    
	document.addEventListener ("deviceready", function() {
		if (typeof cordova !== 'undefined') platform.cordova = true; // should already have been set
		if (platform.cordova) { // make sure we only do this for Cordova app
			
			// scroll input field into view where applicable
			// Supported in Chrome and Safari 2018-01-17
			window.addEventListener('keyboardDidShow', function () {
		    document.activeElement.scrollIntoViewIfNeeded();
		  });
		  
		  // set File menu and dialog items
		  document.getElementById ('t_saveSequence').parentNode.classList.add ('noDisplay');
		  document.getElementById ('t_emailSequence').parentNode.classList.add ('noDisplay');
		  document.getElementById ('t_saveShareSequence').parentNode.classList.remove ('noDisplay');
		  document.getElementById ('saveFileAddSequenceLink').classList.remove ('noDisplay');
		  
			switch (device.platform.toLowerCase()) {
				case 'ios':
				  // handle OpenURL for iOS
					window.handleOpenURL = cordovaHandleOpenURL;

				  // shrink view for iOS when keyboard pops up
				  Keyboard.shrinkView (true);

					// fix iOS Cordova contenteditable focus bug by setting
					// contentEditable to false on blur and restoring on focus
			    sequenceText.addEventListener ('blur', function() {
						sequenceText.setAttribute ('contentEditable', false);
					});
					sequenceText.addEventListener ('touchstart', function() {
						sequenceText.setAttribute ('contentEditable', true);
					});
					sequenceText.addEventListener ('focus', function() {
						sequenceText.setAttribute ('contentEditable', true);
					});

			  	// add status bar inside webview
					var bar = document.getElementById ('cordovaStatusBar');
					bar.classList.remove ('noDisplay');
					bar.nextElementSibling.style.top = '20px';

					break;
				case 'android':
					// handle Intents for Android
					window.plugins.intent.setNewIntentHandler(cordovaHandleIntent);
				  // Handle the Intent when the app is not open
				  // This will be executed only when the app starts or wasn't active
				  // in the background
				  window.plugins.intent.getCordovaIntent(cordovaHandleIntent);
				  break;
			}
						  
		  if (loading && loading.parentNode) {
				loading.parentNode.removeChild (loading);
			}
			
			setTimeout(
				function(){
					navigator.splashscreen.hide();
					StatusBar.show();
					StatusBar.styleDefault();
				}, 1000);
		}
	});

  // check if Chrome App is installed
  checkForApp();

  // Check if localStorage is supported. When running as Chrome app, we
  // assume the local storage support is present
  if (!chromeApp.active) {
    storage = (typeof(localStorage) != 'undefined') ? true : false;
  }

  // set correct options and menu items in various places
  setOptions();

  // Parse the figures file
  parseFiguresFile();
  
  /** Define the default language and userText now as they are used
   *  In other functions during load
   */
  updateUserTexts();
  
  /** userText is now defined, continue */

  // load settings from storage
  loadSettingsStorage();
  loadPrintDialogStorage();

	// when smallMobile is checked (loaded from settings), or when screen
	// width is small and no setting is found, switch to smallMobile.
	// Use screen.width to get CSS pixels
	if (document.getElementById ('smallMobile').checked) {
		switchSmallMobile ();
	} else if (screen.width < 640) {

		function f(settings) {
			if (!/\bsmallMobile\b/.test (settings)) {
				document.getElementById ('smallMobile').checked = 'checked';
				switchSmallMobile ();
			}
		}
		
		if (storage) getLocal ('settings', f); else f();			 
		
	}

  if (platform.mobile || platform.smallMobile) mobileInterface();
    
  // add all listeners for clicks, keyup etc
  addEventListeners();

  // Add a listener for HTML5 app cache updates
  if (!chromeApp.active) {
    addUpdateListener();
    // Give Cordova five seconds to start, then...
    setTimeout(function() {
			if (!platform.cordova) {
		    if (platform.android || platform.ios) {
					// getTheApp popup for Android and iOS devices
					getTheApp ();
				} else {
				  // activate addtohomescreen for other mobile devices
				  addToHomescreen();
				}
			}
		}, 5000);
  }

  // build sequence svg
  rebuildSequenceSvg();

  // check browser and capabilities
  var err = checkBrowser();
  if (err) errors.push (err);

	// remove zoomMenu when zoom is not supported
	if (!('zoom' in document.body.style) && !platform.mobile) {
		document.getElementById ('zoomMenu').classList.add ('noDisplay');
	}
			
  // by default, do not allow drag & drop of files to OpenAero
  document.body.addEventListener('dragover', noDragOver);
  document.body.addEventListener('drop', noDrop);
      
  // Setup the drag n drop listeners for multi file checking
  var dropZone = document.getElementById('fileDrop');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', updateCheckMulti, false);
  // Setup the drag n drop listeners for multi file printing
  var dropZone = document.getElementById('fileDropPrint');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', updatePrintMulti, false);
  // Setup the drag n drop listener for file opening
  if (!platform.mobile) {
	  document.getElementById('topBlock').addEventListener('dragover', handleDragOver, false);
	  document.getElementById('topBlock').addEventListener('drop', dropSequence);
	  document.getElementById('main').addEventListener('drop', dropSequence);
	  document.getElementById('main').addEventListener('dragover', handleDragOver, false);
	}
  
  // add onresize event for resizing the sequence text window and/or
  // platform.smallMobile viewport
  // window.onresize = windowResize;
  // window.matchMedia('(orientation: portrait)').addListener (windowResize);
  // window.matchMedia('(orientation: landscape)').addListener (windowResize);
  
  // Parse the rules
  parseRules();
  // set default Form to B
  activeForm = 'B';
    
  // Activate the first figure selection group
  changeFigureGroup();
  document.getElementById('figureHeader').innerHTML = '';
  // Add plus and minus elements such as used in entry/exit line adjustment
  addPlusMinElements();
  // build the buttons
  buildButtons();
  // prepare figure editor
  updateFigureEditor();
  // update save as PNG or SVG height
  saveImageSizeAdjust();
  // set default Y axis offset and start direction
  setYAxisOffset (yAxisOffsetDefault);
  Direction = 0;
  // set OpenAero version for saving
  document.getElementById('oa_version').value = version;

  // add Team select list
  var fragment = document.createDocumentFragment();
  var sortKeys = Object.keys(iocCountriesReverse).sort();
  sortKeys[-1] = '';
  for (var i = -1; i < sortKeys.length; i++) {
    var option = document.createElement ('option');
    option.value = option.text = sortKeys[i];
    fragment.appendChild (option);
  }
  document.getElementById ('team').appendChild (fragment);

  // Load sequence from URL if sequence GET element is set.
  launchURL ({'url': window.document.URL});
  
  // When no sequence is active yet, load sequence storage (if any).
  // Do this after the rules have been loaded to make sure rules stay
  // in Sequence info
  if (!activeSequence.xml) {
    function f(c) {
      activeSequence.xml = c;
      activateXMLsequence (activeSequence.xml);
    }
    getLocal('sequence', f);
  }
    
  // Add combo box functions for rules/category/program input fields
  // but make sure we don't change the logo (true)
  new combo('rules','#ddf','transparent');
  new combo('category','#ddf','transparent');
  new combo('program','#ddf','transparent');
  changeCombo('program');
  
  // check if the sequence displayed is the one in the input field
  checkSequenceChanged();
  // select active Form
  // need to do this to make sure the sequence is drawn when loaded
  // from localStorage or url
  selectForm(activeForm);

  if (platform.smallMobile) selectTab('tab-sequenceInfo');
  
  // add submenu showing/hiding
  addMenuEventListeners();
  
  // enable hiding dialogs by tapping outside dialog, but not in
  // scrollbars
  var els = document.getElementsByClassName ('boxbg');
  for (var i = els.length - 1; i >= 0; i--) {
    els[i].addEventListener ('mousedown', function(e) {
      if (e.target && e.target.classList &&
        e.target.classList.contains ('boxbg') &&
        (e.target.clientWidth >= e.clientX) &&
        (e.target.clientHeight >= e.clientY)) {
          this.classList.add ('noDisplay');
        }
      }
    );
  }
  
  // enable expansion panel toggles
  var els = document.getElementsByClassName ('expand-toggle');
  for (var i = els.length - 1; i >= 0; i--) {
		if (els[i].parentNode.id === 'rulesLabel') {
	    els[i].parentNode.addEventListener ('mousedown', function(e) {
	        document.getElementById('rulesLabel').parentNode.classList.toggle ('expanded');
	        panelHeader (document.getElementById ('activeRules'));
	      }
	    );
		} else if (els[i].parentNode.id === 'contestLabel') {
			els[i].parentNode.addEventListener ('mousedown', function(e) {
        document.getElementById('contestLabel').parentNode.classList.toggle ('expanded');
        panelHeader (document.getElementById ('activeContest'), userText.contest);
			});
		} else {
	    els[i].parentNode.addEventListener ('mousedown', function(e) {
        e.target.parentNode.parentNode.classList.toggle ('expanded');
	    });
		}
  }
    
  // check if we are running from a file (DEPRECATED)
  if (window.location.protocol === 'file:') {
    if (presentFileError) errors.push (userText.runFromFile);
  } else {
    // set alert if localStorage is disabled
    if (!storage) errors.push (userText.noCookies);
  }
  // check if we are running from http i.s.o. https (DEPRECATED sep 2016)
  if ((window.location.protocol === 'http:') &&
    !window.location.hostname.match (/^devel./)) {
    errors.push (userText.runOverHttp);
  }
  
  // show alert box for any errors (they are automatically appended)
  if (errors.length) alertBox ('<p></p>');

  // Check if an update has just been done
  checkUpdateDone();

  loadComplete = true;

  // check for latest version in a few seconds
  if (!(chromeApp.active || window.location.hostname.match(/^(.+\.)?openaero.net$/))) {
    setTimeout(latestVersion, 3000);
  }
  
  // retrieve queue from storage
  queueFromStorage ();

  // load (mostly) completed, remove loading icon in 1/2 second
  if (!platform.cordova) {
		setTimeout (function() {loading.style = 'opacity: 0.01;';}, 100);
		setTimeout (function() {loading.parentNode.removeChild (loading);}, 500);
	}
  
  // load Google Analytics, but not on Cordova
  try {
    if (chromeApp.active) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.google-analytics.com/analytics.js', true);
      xhr.responseType = 'blob';
      xhr.onload = function(e) {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script',this.response,'ga');
        
        ga('create', 'UA-12919842-5', 'auto');
        ga('set', 'forceSSL', true); // always use https
        ga('set', 'anonymizeIp', true); // enable IP masking
        ga('send', 'pageview');
      };
      xhr.send();
    } else if (!platform.cordova) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      
      ga('create', 'UA-12919842-5', 'auto');
      ga('set', 'forceSSL', true); // always use https
      ga('set', 'anonymizeIp', true); // enable IP masking
      ga('send', 'pageview');
    }
  } catch (e) {};
}

// launchURL is run during doOnLoad (web) or on event onLaunched (App)
// and retrieves sequence from URL (if any). It returns true on succes
// or false on faillure
function launchURL (launchData) {
  // remove newlines if present
  launchData.url = launchData.url.replace (/[\n\r]/g, '');
  // check format
  var match = launchData.url.toString().match(/\?(sequence|s)=.+/);
  if (match) {
    match = match[0].replace(/^\?(sequence|s)=/, '');
    if (match.match (/^%3Csequence%3E/)) {
      // before 1.5.0    : URI encoded link
      // Make sure to decode %2B to + character
      return activateXMLsequence (decodeURI (match.replace(/%2B/g, '+')));
    } else {
      // 1.5.0 and later : base64url encoded link
      var string = decodeBase64Url (match);
      if (string === false) {
        alertBox (sprintf(userText.openSequenceLinkError, launchData.url),
          userText.openSequenceLink);
        return false;
      }
      if (/<\/>/.test(string)) { // test for empty end tag
        // 2016.3.2 and later : restore xml end tags and sequence tags
        var tags = [];
        var parts = string.split ('<');
        for (var i = 1; i < parts.length; i++) {
          if (/^\/>/.test(parts[i])) {
            parts[i] = '/' + tags.pop() + parts[i].substring(1);
          } else {
            tags.push (parts[i].match (/^[^>]+/)[0]);
          }
        }
        string = '<sequence>' + parts.join ('<') + '</sequence>';
      }
      return activateXMLsequence (string);
    }
  }
  return false;
}

// keyListener listens to key strokes for various usages
function keyListener (e) {
	// do not handle keys when in input area
	if (e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA") return;
  if (e.target.isContentEditable) return;
	// use delete key for deleting figure
	if (e.keyCode == 46) {
		document.getElementById('deleteFig').click();
	} 
}
	
// appZoom adds zoom functionality to the app and is called by keydown
function appZoom (e) {
  var zoomSteps = ['0.33', '0.5', '0.67', '0.75', '0.9', '1',
    '1.1', '1.25', '1.5', '1.75', '2', '2.5', '3'];
  if (platform.mobile) {
		var zoom = (parseInt (
			document.getElementById('zoom').textContent.match(/\d+/)[0]) / 
			100).toString();
	} else {
	  var zoom = document.body.style.zoom ? document.body.style.zoom : '1';
	}
  if ((e.shiftKey && e.ctrlKey && (e.keyCode == 187)) || (e === 1)) {
    var zoom = zoomSteps[zoomSteps.indexOf(zoom) + 1];
  } else if ((!e.shiftKey && e.ctrlKey && (e.keyCode == 189)) || (e === -1)) {
    var zoom = zoomSteps[zoomSteps.indexOf(zoom) - 1];
  } else {
    // no special appZoom key or click, return true to bubble key
    return true;
  }

  // only update zoom when zoom has a valid value
  if (zoom) {
    document.getElementById('zoom').textContent = parseInt(zoom * 100) + '%';
		if (platform.mobile) {
			checkSequenceChanged (true);
		} else {
	    document.body.style.zoom = zoom;
		}
  }
  // don't bubble key
  return false;
}
  
// addEventListeners adds all event listeners for actions.
// In index.html no actions are specified. It is necessary they are
// specified as event listeners for Chrome Apps.
function addEventListeners () {
  // zoom for Chrome app and touch devices
  if (chromeApp.active || platform.touch) {
    document.addEventListener ('keydown', appZoom, false);
  }
  document.addEventListener ('keydown', keyListener, false);
  
  // remove all menus when tapping anywhere outside menu
  if (platform.touch) {
    document.addEventListener ('touchstart', function(evt){
      var el = evt.target;
      while (el && el !== this) {
        if ((el.id === 'menu') || (el.id === 'hamburgerMenu')) return;
        el = el.parentNode;
      }
      setTimeout(menuInactiveAll, 200);
      // on smallMobile, also remove figureSelector when tapping outside
      if (platform.smallMobile) {
				el = evt.target;
	      while (el && el !== this) {
	        if (el.id === 'figureSelector') return;
	        el = el.parentNode;
	      }	
	      hideFigureSelector();
			}
    });
  }

  // window listeners
  // drop any dragged object when releasing mouse anywhere
  if (platform.touch) {
    window.addEventListener ('touchend', Drop);    
  } else window.addEventListener ('mouseup', Drop);
  
  // menu
  document.getElementById('hamburgerMenu').addEventListener ('mousedown', menuActive);
  document.getElementById('file').addEventListener('mousedown', function(){
    setTimeout(menuInactiveAll, 1000);
    }, true);
  document.getElementById('fileForm').addEventListener('mousedown', function(){this.reset()}, false);
  document.getElementById('file').addEventListener('change', openSequence, false);
  document.getElementById('t_openSequence').parentNode.addEventListener('mousedown', document.getElementById('file').mousedown, false);
  document.getElementById('t_openSequenceLink').parentNode.addEventListener('mousedown', openSequenceLink, false);
  document.getElementById('t_clearSequence').parentNode.addEventListener('mousedown', clearSequence, false);
  document.getElementById('t_saveSequence').parentNode.addEventListener('mousedown', saveSequence, false);
  document.getElementById('t_emailSequence').parentNode.addEventListener('mousedown', emailSequence, false);
  document.getElementById('t_saveShareSequence').parentNode.addEventListener('mousedown', saveSequence, false);
  document.getElementById('t_saveAsLink').parentNode.addEventListener('mousedown', saveAsURL, false);
  document.getElementById('exitDesigner').addEventListener('mousedown', function(){exitFuDesigner(false)}, false);
  document.getElementById('t_saveFigsSeparate').parentNode.addEventListener('mousedown', saveFigs, false);
  document.getElementById('t_printSaveForms').parentNode.addEventListener('mousedown', function(){printDialog(true)}, false);
  
  document.getElementById('t_formA').parentNode.addEventListener('mousedown', function(){selectForm('A')}, false);
  document.getElementById('t_formB').parentNode.addEventListener('mousedown', function(){selectForm('B')}, false);
  document.getElementById('t_formC').parentNode.addEventListener('mousedown', function(){selectForm('C')}, false);
  document.getElementById('t_figsInGrid').parentNode.addEventListener('mousedown', function(){selectForm('Grid')}, false);
  document.getElementById('zoomMin').addEventListener('mousedown', function(){appZoom(-1)}, false);
  document.getElementById('zoomPlus').addEventListener('mousedown', function(){appZoom(1)}, false);
  
  document.getElementById('t_flipYAxis').parentNode.addEventListener('mousedown', flipYAxis, false);
  document.getElementById('t_clearPositioning').parentNode.addEventListener('mousedown', clearPositioningOption, false);
  document.getElementById('t_separateFigures').parentNode.addEventListener('mousedown', separateFigures, false);
  document.getElementById('t_checkSequence').parentNode.addEventListener('mousedown', function(){checkSequence(true)}, false);
  document.getElementById('lockSequence').addEventListener('mousedown', lockSequence);
  document.getElementById('unlockSequence').addEventListener('mousedown', lockSequence);
  
  document.getElementById('t_showQueue').parentNode.addEventListener('mousedown', showQueue, false);
  document.getElementById('t_addToQueue').parentNode.addEventListener('mousedown', addToQueue, false);
  document.getElementById('t_addAllToQueue').parentNode.addEventListener('mousedown', addAllToQueue, false);
  document.getElementById('t_clearQueue').parentNode.addEventListener('mousedown', clearQueue, false);
  document.getElementById('queue').addEventListener('change', openQueue, false);
  document.getElementById('t_saveQueueFile').parentNode.addEventListener('mousedown', saveQueue, false);
  
  document.getElementById('t_fuDesigner').parentNode.addEventListener ('mousedown', startFuDesigner, false);
  document.getElementById('t_checkMultipleSeq').parentNode.addEventListener('mousedown', function(){checkMultiDialog(true)}, false);
  document.getElementById('t_printMultipleSeq').parentNode.addEventListener('mousedown', printMultiDialog, false);
  document.getElementById('rulesFile').addEventListener('change', openRulesFile, false);
  document.getElementById('t_settings').parentNode.addEventListener('mousedown', settingsDialog, false);
  document.getElementById('t_installChromeAppTitle').parentNode.addEventListener ('mousedown', installChromeApp, false);
  
  document.getElementById('t_finalizeSequence').addEventListener ('mousedown', function(){exitFuDesigner(false)});
  
  document.getElementById('t_manual').parentNode.addEventListener('mousedown', function(){
      helpWindow('doc/manual.html', 'OpenAero manual');
    }, false);
  document.getElementById('t_openaeroLanguage').parentNode.addEventListener('mousedown', function(){
      helpWindow('doc/language.html', 'OpenAero language');
    }, false);
  document.getElementById('t_arestiSystem').parentNode.addEventListener('mousedown', function(){
      helpWindow('doc/arestisystem.html', 'The Aresti system');
    }, false);
	
  document.getElementById('t_freeKnownGuidancePower').parentNode.addEventListener('mousedown', function(){
      helpWindow('doc/CIVA-Free-Known-Programme-Guidance-Power-Aircraft-2018-v3a.pdf', 'CIVA Free Known Guidance Power');
    }, false);

  document.getElementById('t_freeKnownGuidanceGlider').parentNode.addEventListener('mousedown', function(){
      helpWindow('doc/CIVA-Free-Known-Programme-Guidance-Glider-Aircraft-2018-v1.pdf', 'CIVA Free Known Guidance Glider');
    }, false);
    
  document.getElementById('t_about').parentNode.addEventListener('mousedown',
    aboutDialog, false);
      
  // sequence string
  document.getElementById('undo').addEventListener('mousedown', clickButton, false);
  document.getElementById('redo').addEventListener('mousedown', clickButton, false);
  sequenceText.addEventListener('input', checkSequenceChanged, false);
  sequenceText.addEventListener('keyup', checkSequenceChanged, false);
  sequenceText.addEventListener('mouseup', checkSequenceChanged, false);
  sequenceText.addEventListener('focus', virtualKeyboard, false);
  sequenceText.addEventListener('blur', virtualKeyboard, false);
  
  // virtual keyboard
  document.getElementById('virtualKeyboard').addEventListener('mousedown', clickVirtualKeyboard, false);
  document.getElementById('virtualKeyboard').addEventListener('mouseup', releaseVirtualKeyboard, false);

  // grid info
  if (platform.touch) {
    document.getElementById('gridInfo').addEventListener ('touchstart', grabFigure);
    document.getElementById('gridInfo').addEventListener ('touchmove', Drag);
  }
  document.getElementById('gridInfo').addEventListener ('mousedown', grabFigure);
  document.getElementById('gridInfo').addEventListener ('mousemove', Drag);
  document.getElementById('gridColumns').addEventListener('change', updateGridColumns);
  document.getElementById('gridOrderBy').addEventListener('change', function(){selectForm('Grid');});
  document.getElementById('manual_html_grid_system').addEventListener('mousedown', function(){
    helpWindow('doc/manual.html#grid_system', 'Grid system');
  }, false);
  document.getElementById('t_proposalsCreateGroups').addEventListener('mousedown', proposalsDialog, false);
    
  // left block tabs
  document.getElementById('tab-sequenceInfo').addEventListener('mousedown', selectTab, false);
  document.getElementById('tab-figureInfo').addEventListener('mousedown', selectTab, false);
  document.getElementById('tab-svgContainer').addEventListener('mousedown', selectTab, false);
  document.getElementById('tab-fuFigures').addEventListener('mousedown', selectTab, false);
    
  // sequence info options
  document.getElementById('pilot').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('pilot').addEventListener('keydown', function(e){
    if (e.shiftKey && (e.keyCode == 9)) {
      document.getElementById('notes').focus();
      e.preventDefault();
    }}, false);
  document.getElementById('team').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('actype').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('acreg').addEventListener('change', changeSequenceInfo, false);
  
  document.getElementById('class').addEventListener('change',  selectPwrdGlider, false);
  document.getElementById('positioning').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('t_referenceSequence').addEventListener('mousedown', referenceSequenceDialog);
  document.getElementById('harmony').addEventListener('change', changeSequenceInfo, false);
  
  document.getElementById('location').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('date').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('t_chooseLogo').addEventListener('mousedown', logoChooser, false);
  document.getElementById('removeLogo').addEventListener ('mousedown', removeLogo, false);
  document.getElementById('logoImage').addEventListener ('mousedown', logoChooser, false);
  document.getElementById('t_logoChooserCancel').addEventListener('mousedown', hideLogoChooser, false);
  document.getElementById('logoFile').addEventListener('change', openLogoFile, false);

  document.getElementById('notes').addEventListener('change', changeSequenceInfo, false);
  document.getElementById('notes').addEventListener('keydown', function(e){
    if (e.keyCode == 9) {
      document.getElementById('pilot').focus();
      e.preventDefault();
    }}, false);
  
  // figure editor options
  document.getElementById('manual.html_adding_a_figure').addEventListener('mousedown', function(){
    helpWindow('doc/manual.html#adding_a_figure', 'Adding a figure');
  }, false);
  document.getElementById('manual.html_figure_comments').addEventListener('mousedown', function(){
    helpWindow('doc/manual.html#figure_comments', 'Figure comments');
  }, false);

  document.getElementById('subSequenceDirection').addEventListener('change', updateFigure, false);
  document.getElementById('addFigureText').addEventListener('mousedown', showFigureSelector, false);
  document.getElementById('subSequence').addEventListener('click', clickButton, false);
  document.getElementById('deleteFig').addEventListener('click', clickButton, false);
  document.getElementById('flipYAxis').addEventListener('click', clickButton, false);
  document.getElementById('switchFirstRoll').addEventListener('click', clickButton, false);
  document.getElementById('switchY').addEventListener('click', clickButton, false);
  document.getElementById('switchX').addEventListener('click', clickButton, false);
  document.getElementById('magMin').addEventListener('click', clickButton, false);
  document.getElementById('magPlus').addEventListener('click', clickButton, false);
  document.getElementById('moveForward').addEventListener('click', clickButton, false);
  document.getElementById('straightLine').addEventListener('click', clickButton, false);
  document.getElementById('curvedLine').addEventListener('click', clickButton, false);
  document.getElementById('moveX').addEventListener('change', updateFigure, false);
  document.getElementById('moveY').addEventListener('change', updateFigure, false);
  document.getElementById('unknownFigure').addEventListener('change', updateFigure, false);
  document.getElementById('figEntryButton').addEventListener('click', clickButton, false);
  document.getElementById('figExitButton').addEventListener('click', clickButton, false);
  // document.getElementById('comments').addEventListener('change', updateFigureComments);
  document.getElementById('comments').addEventListener('input', updateFigureComments);
    
  // figure selector
  document.getElementById('manual.html_the_figure_chooser').addEventListener('mousedown', function(){
    helpWindow('doc/manual.html#adding_a_figure', 'Adding a figure');
  }, false);
  document.getElementById('figureStringInput').addEventListener('input', changeFigureString, false);
  document.getElementById('hideIllegal').addEventListener('change', changeHideIllegal, false);
  document.getElementById('hideFigureSelector').addEventListener('mousedown', hideFigureSelector, false);
  document.getElementById('figureGroup').addEventListener('change', changeFigureGroup, false);
//  document.getElementById('t_switchQueue').addEventListener('mousedown', function(){switchQueue(this)});

  // close alert box
  document.getElementById('t_closeAlert').addEventListener('click', function(){alertBox()}, false);
  
  // close help box
  document.getElementById('closeHelp').addEventListener('mousedown', function(){
		document.getElementById('helpBox').classList.add ('noDisplay');}, false);
  // confirm box
  document.getElementById('t_confirmBoxYes').addEventListener('click', confirmYes, false);
  document.getElementById('t_confirmBoxNo').addEventListener('click', function(){confirmBox()}, false);
  
  // check sequence dialog
  document.getElementById('t_checkSequenceOK').addEventListener('click', function(){checkSequence()}, false);
  document.getElementById('t_checkSequenceLog').addEventListener('click', function(){checkSequence('log')}, false);
  
  // check multiple dialog
  document.getElementById('t_checkMultiUseReference').addEventListener('mousedown', referenceSequenceDialog);
  document.getElementById('checkMultiFiles').addEventListener('change', function(){updateCheckMulti(this)}, false);
  document.getElementById('t_checkSequences').addEventListener('mousedown', checkMulti, false);
  document.getElementById('t_checkMultiClose').addEventListener('click', function(){checkMultiDialog()}, false);
  
  // print multiple dialog
  document.getElementById('printMultiFiles').addEventListener('change', function(){updatePrintMulti(this)}, false);

  // settings dialog
  document.getElementById('manual.html_settings').addEventListener('mousedown', function(){
    helpWindow('doc/manual.html#settings', 'Settings');
  }, false);
  document.getElementById('tab-general').addEventListener('click', selectTab, false);
  document.getElementById('tab-styling').addEventListener('click', selectTab, false);
  document.getElementById('tab-expert').addEventListener('click', selectTab, false);
  document.getElementById('language').addEventListener('change', changeLanguage, false);
  document.getElementById('smallMobile').addEventListener('change', switchSmallMobile, false);
  document.getElementById('queueColumns').addEventListener('change', changeQueueColumns, false);
  document.getElementById('positionClearAuto').addEventListener('change', function(){saveSettingsStorage()}, false);
  document.getElementById('showHandles').addEventListener('change', function(){
		setFigureSelected (selectedFigure.id);
		saveSettingsStorage()}, false);
  document.getElementById('imageFormatPNG').addEventListener('change', function(){saveSettingsStorage()}, false);
  document.getElementById('imageFormatSVG').addEventListener('change', function(){saveSettingsStorage()}, false);
  document.getElementById('saveFigsSeparateWidth').addEventListener('change', function(){saveSettingsStorage()}, false);
  document.getElementById('saveFigsSeparateHeight').addEventListener('change', function(){saveSettingsStorage()}, false);
  document.getElementById('zipImageFilenamePattern').addEventListener('change', function(){saveSettingsStorage()}, false);

  document.getElementById('numberInCircle').addEventListener('change', updateNumberInCircle, false);
  document.getElementById('rollFontSize').addEventListener('change', updateRollFontSize, false);

  document.getElementById('nonArestiRolls').addEventListener('change', updateNonArestiRolls, false);
  document.getElementById('styles').addEventListener('change', getStyle, false);
  document.getElementById('styleString').addEventListener('change', updateStyle, false);
  document.getElementById('t_resetStyle').addEventListener('mousedown', function(){resetStyle()}, false);
  document.getElementById('t_resetStyleAll').addEventListener('mousedown', function(){resetStyle(true)}, false);
  document.getElementById('newTurnPerspective').addEventListener('change', draw, false);
  document.getElementById('t_restoreDefaultSettings').addEventListener('mousedown', restoreDefaultSettings, false);
  
  document.getElementById('t_settingsClose').addEventListener('mousedown', function(){settingsDialog()}, false);

  // reference sequence dialog
  document.getElementById('t_referenceSequenceClose').addEventListener('mousedown', function(){referenceSequenceDialog(false)});
  document.getElementById('referenceSequenceString').addEventListener('input', changeReferenceSequence, false);

  // create proposals dialog
  document.getElementById('t_proposalsCreate').addEventListener ('mousedown', createFigureProposals);
  document.getElementById('t_proposalsToGrid').addEventListener ('mousedown', proposalsToGrid);
  document.getElementById('t_proposalsDialogClose').addEventListener('mousedown', function(){proposalsDialog(false)});
  
  // save dialog
  document.getElementById('dlTextField').addEventListener('input', function(){updateSaveFilename(this.value)}, true);
  // use 'click' to prevent OS save dialog blocking
  document.getElementById ('t_saveFile').addEventListener ('click', function(){
	  // close dialog 1 second after click
    window.setTimeout(function(){saveDialog()}, 1000);
    var name = sanitizeFileName (document.getElementById('dlTextField').value);
    if (platform.cordova) {
			cordovaSave (saveData.blob, name + saveData.ext);
		} else saveAs (saveData.blob, name + saveData.ext);
  });
  document.getElementById('t_cancelSave').addEventListener('mousedown', function(){saveDialog()}, false);
  
  // iOS save dialog
  document.getElementById('t_iOSsaveFile').addEventListener('click', function(){
    window.setTimeout(function(){
        document.getElementById('iOSsaveDialog').classList.add ('noDisplay');
      }, 200);
    }, false);
  document.getElementById('t_iOScancelSave').addEventListener('mousedown', function(){
      document.getElementById('iOSsaveDialog').classList.add ('noDisplay');
    }, false);
  
  // openSequenceLink dialog
  document.getElementById('t_openSequenceLinkOpen').addEventListener('mousedown', function(){openSequenceLink(true)});
  document.getElementById('t_openSequenceLinkCancel').addEventListener('mousedown', function(){openSequenceLink(false)});
  
  // print/save image dialog
  var inputs = document.getElementById ('printDialog').getElementsByTagName ('input');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', savePrintDialogStorage, false);
  }
  document.getElementById('manual.html_save_print').addEventListener('mousedown', function(){
      helpWindow('doc/manual.html#save_print', 'OpenAero manual');
    }, false);
  document.getElementById('printFormA').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormB').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormC').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormR').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormL').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('printFormPilotCards').addEventListener('change', setPilotCardForm, false);
  document.getElementById('pilotCardPercent').addEventListener('mousedown', setPilotCardLayout, false);
  document.getElementById('pilotCardPercentValue').addEventListener ('input', changePilotCardPercent, false);
  document.getElementById('pilotCard2').addEventListener('mousedown', setPilotCardLayout, false);
  document.getElementById('pilotCard4').addEventListener('mousedown', setPilotCardLayout, false);
  document.getElementById('printFormGrid').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('imageWidth').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('imageHeight').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('pageSpacing').addEventListener('change', saveImageSizeAdjust, false);
  document.getElementById('t_print').addEventListener('mousedown', printForms, false);
  document.getElementById('t_saveAsPNG').addEventListener('mousedown', savePNG, false);
  document.getElementById('t_saveAsSVG').addEventListener('mousedown', saveSVG, false);
  document.getElementById('t_cancelPrint').addEventListener('mousedown', function(){printDialog()}, false);
  document.getElementById ('printNotesCopy').addEventListener('change', function(){
		document.getElementById ('printNotes').checked = document.getElementById ('printNotesCopy').checked;
	});
  
  // installApp banner
  document.getElementById ('closeInstallApp').addEventListener(
		'mousedown', function(){
			removeBanner (document.getElementById ('installApp'));
		});
}

// addMenuEventListeners adds event listeners for showing and hiding 
// submenus to all menus
function addMenuEventListeners() {
  // menu showing and hiding. Add listeners to all <li> menu items
  function addListeners(e) {
    var li = e.getElementsByTagName ('li');
    for (var i = 0; i < li.length; i++) {
      if (platform.mobile) {
				li[i].addEventListener('mousedown', menuActive);
			} else {
        li[i].addEventListener('mouseover', menuActive);
        li[i].addEventListener('mouseout', menuInactive); 
      }
      if (!/^zoom.+/.test(li[i].id)) {
        checkUL : {
          var els = li[i].childNodes;
          for (var j in els) {
            if (els[j].tagName && (els[j].tagName === 'UL')) break checkUL;
          }
          li[i].addEventListener('mouseup', menuTouch);
        }
      }
    }
  }
  
  var menu = document.getElementById ('menu');
  addListeners(menu);
}

// checkForApp will check if the OpenAero Chrome app is present
function checkForApp () {
  // only do something when not running as Chrome app
  // and
  // in Chrome browser with extension support on Chrome OS
  if (!((navigator.userAgent.toLowerCase().indexOf('chrome') > -1) &&
    (navigator.vendor.toLowerCase().indexOf("google") > -1) &&
    (/\bCrOS/.test(navigator.userAgent)) &&
    chrome)) return;
  if (!chromeApp.active) {
    function f (c) {
      
      if (typeof chrome.app == "undefined") return;
      if (!chromeApp.active) {
        // App not active. This also means we are not in OpenAero Stable
        // (openaero.net or www.openaero.net) with the App installed.
        // Stable is automatically redirected to the App through the
        // url_handlers directive in manifest.json
        
        // Create <head> link for direct install
        var head = document.getElementsByTagName ('head')[0];
        var link = document.createElement ('link');
        link.rel = 'chrome-webstore-item';
        link.href = 'https://chrome.google.com/webstore/detail/' + chromeApp.id;
        head.appendChild (link);
        // Show link in tools menu
        document.getElementById('installChromeApp').classList.remove ('noDisplay');
          
        // Create a box presenting the user with information on OpenAero
        // and asking if they want to install the
        // App, unless installChromeAppAsked is present. Also wait until
        // loadComplete
        if (!c) {
          var id = window.setInterval (function(){
            if (loadComplete) {
              window.clearInterval (intervalID.installChromeApp);
              delete intervalID.installChromeApp;
              confirmBox (
                { userText: 'installChromeApp',
                  params: [window.location.host]},
                { userText: 'installChromeAppTitle' },
                installChromeApp
              );
            }
          }, 1000);
          intervalID.installChromeApp = id;
          // don't ask again, independent of install result
          storeLocal ('installChromeAppAsked', 'true');
        };
      }
      
    }
    
    getLocal ('installChromeAppAsked', f);
    
  }

}

// installChromeApp will perform Chrome App installation after called
function installChromeApp() {
  chrome.webstore.install (
    undefined,
    function() {
      // install succesfull
      alertBox (userText.installChromeAppComplete, userText.installChromeAppTitle);
      // hide menu link
      document.getElementById('installChromeApp').classList.add ('noDisplay');
    },
    function(e) {
      // install unsuccesfull
      console.log(e);
    }
  );
}

// Functions for interpreting user input and variables

// confirmYes is executed when Yes is clicked in a confirm box. It
// causes the box to be removed and function confirmFunction to be
// executed.
function confirmYes () {
  document.getElementById('confirmBox').classList.add ('noDisplay');
  confirmFunction();
  confirmFunction = null;
}

// checkBrowser checks on which browser we're running and creates
// alerts where applicable
function checkBrowser () {
  /* The objects in dataBrowser are used in the order they appear;
   * that's why dataBrowser is an array. As soon as a positive
   * identification is made the script ends, and it doesn't check the
   * remaining objects.
   * Detection order is very important. The general rule is that you
   * check for the minor browsers first. The reason is that many minor
   * browsers give their users the opportunity to change identity in
   * order to work around browser detects.
   * For instance, the Opera navigator.userAgent may contain "MSIE". If
   * we'd check for Explorer first, we'd find the "MSIE" and incorrectly
   * conclude that the browser is Explorer. In order to avoid this false
   * detection, we should check for Opera first. If the browser is in
   * fact Opera, the script never proceeds to the "MSIE" check. */
  var BrowserDetect = {
    init: function () {
      this.browser = this.searchString(this.dataBrowser) || "unknown";
      this.version = this.searchVersion(navigator.userAgent)
        || this.searchVersion(navigator.appVersion)
        || "unknown";
      this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
      for (var i=0;i<data.length;i++)	{
        var dataString = data[i].string;
        var dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if (dataString) {
          if (dataString.indexOf(data[i].subString) != -1)
            return data[i].identity;
        }
        else if (dataProp)
          return data[i].identity;
      }
    },
    searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index == -1) return;
      return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
      {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
      },
      { 	string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
      },
      {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
      },
      {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
      },
      {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
      },
      {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
      },
      {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
      },
      {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
      },
      {		// for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
      },
      {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
      },
      {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
      },
      { 		// for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
      }
    ],
    dataOS : [
      {
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
      },
      {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
      },
      {
           string: navigator.userAgent,
           subString: "iPhone",
           identity: "iPhone/iPod"
      },
      {
        string: navigator.platform,
        subString: 'iPad',
        identity:  'iPad'
      },
      {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
      }
    ]
  
  };
  BrowserDetect.init();
  var fatalError = false;
  browserString = BrowserDetect.browser + ' Version ' +
    BrowserDetect.version + ', running on ' + BrowserDetect.OS;
  // following line can be used for finding browser keys
  // for (key in navigator) console.log (key + ' : ' + navigator[key]);
  console.log ('Browser: ' + browserString);
  // Check for essential methods, OpenAero will not function without these!
  // use the selectedFigureSvg to check for SVG and getBBox support
  if (!document.getElementById('selectedFigureSvg').getBBox()) fatalError = true;
  if (fatalError) {
    document.getElementsByTagName('body')[0].innerHTML = '<h2><center>' +
      sprintf (userText.oldBrowser, browserString) +
      userText.getChrome +
      '</center></h2>';
    throw new Error('Browser not capable of running OpenAero');
  }
  // Check for recommended methods
  // check for file support
  if (!fileSupport()) {
    return userText.fileOpeningNotSupported + '<br>' + userText.getChrome;
  }
  // Present a warning if the browser is not
  // Chrome, Firefox, Safari or Edge
  // and the warning was not displayed for one week. Use store value
  // for setting the expiry time
  if (!BrowserDetect.browser.match(/Chrome|Firefox|Safari|Edge/)) {
    function f(c) {
      var d = new Date();
      var t = parseInt(d.getTime());
      if (c && (c < t)) c = false;
      if (!c) {
        storeLocal ('noChromeWarned', t + 604800000);
        errors.push (sprintf (userText.browserDetect, browserString) +
          userText.getChrome);
      }
    }
    getLocal ('noChromeWarned', f);
  }
}

// checkFileSupport checks for file reading support
// if not available, some functions are disabled and a warning is returned
function fileSupport () {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    //console.log('File reading support confirmed');
    return true;
  } else {
    // disable file reading functions
    var els = document.getElementsByClassName('fileOpening');
    for (var i = els.length - 1; i >= 0; i--) {
      els[i].parentNode.removeChild(els[i]);
    }
    return false;
  }
}

// clickButton is called when clicking certain buttons
function clickButton () {
  var e = this;
  
  // don't click disabled buttons
  if (e.classList.contains ('disable')) return;
  
  // when the figure is a Free (Un)known figure with a letter, don't
  // click disableFUfig buttons
  if (selectedFigure.id) {
    if (figures[selectedFigure.id].unknownFigureLetter) {
      if (figures[selectedFigure.id].unknownFigureLetter !== 'L') {
        if (e.classList.contains ('disableFUfig')) {
          return;
        }
      }
    }
  }

  switch (e.getAttribute('class')) {
    // handle min button
    case 'minButton':
			e.classList.add ('on');
			window.setTimeout (function(){
				e.classList.remove ('on');
				}, 200);
      e.nextSibling.value--;
      break;
    // handle plus button
    case 'plusButton':
			e.classList.add ('on');
			window.setTimeout (function(){
				e.classList.remove ('on');
				}, 200);
      e.previousSibling.value++;
      break;
    // handle all other buttons
    default:
      // activate the correct click action
      switch (e.id) {
        // temporary depression buttons
        case 'deleteFig':
        case 'flipYAxis':
        case 'magMin':
        case 'magPlus':
        case 'figEntryButton':
        case 'figExitButton':          // don't click tempo buttons that are on
          if (e.classList.contains ('on')) return;
					e.classList.add ('on');
					window.setTimeout (function(){e.classList.remove ('on');}, 200);
          break;
        case 'undo':
        case 'redo':
          break;
        // switch between active/inactive buttons
        default:
          e.classList.toggle ('on');
      }
  }
      
  // disable the moveX/moveY selectors. They will be enabled depending
  // on the move button that's active
  document.getElementById('moveXCont').classList.add ('collapsed');
  document.getElementById('moveYCont').classList.add ('collapsed');

  // take action
  switch (e.id) {
    case 'undo':
      if (activeSequence.undo.length) {
        setTimeout(function(){
          activeSequence.redo.push (activeSequence.xml);
          activeSequence.addUndo = false;
          activateXMLsequence (activeSequence.undo.pop());       
          changeSequenceInfo();
          activeSequence.addUndo = true;
          setUndoRedo();
        }, 200);
      }      
      // don't continue. Not a figure function
      return;
    case 'redo':
      if (activeSequence.redo.length) {
        setTimeout(function(){
          activeSequence.undo.push (activeSequence.xml);
          activeSequence.addUndo = false;
          activateXMLsequence (activeSequence.redo.pop());
          changeSequenceInfo();
          activeSequence.addUndo = true;
          setUndoRedo();
        }, 200);
      }
      // don't continue. Not a figure function
      return;
    case 'deleteFig':
      if (selectedFigure.id !== null) {
        var flipY = activeSequence.text.replace(regexComments, '').match(regexFlipYAxis);
        // remove all previous drawing figures and the figure itself
        while (selectedFigure.id > 0) {
          if (figures[selectedFigure.id - 1].figNr) {
            break;
          } else {
            updateSequence(selectedFigure.id - 1, '', true);
          }
        }
        updateSequence(selectedFigure.id, '', true);
        // if first figure now is a move figure, remove that
        if (figures[0]) {
	        if (regexMoveForward.test(figures[0].string) ||
		        regexMoveDown.test(figures[0].string) ||
		        regexMoveTo.test(figures[0].string) ||
		        regexCurveTo.test(figures[0].string)) {
	          updateSequence (0, '', true);
	        }
				}
        // when Y was flipped and we removed the figure with the only
        // flip symbol, put it back
        if (flipY && !activeSequence.text.replace(regexComments, '').match(regexFlipYAxis)) {
          flipYAxis();
        }
        selectFigure (false);
      }
      // don't continue function, figure has been removed
      return;
    case 'flipYAxis':
      if (selectedFigure.id !== null) {
        
        function flipFigureYAxis (id) {
          var v = figures[id].string;
          if (v.replace(regexComments, '').match(regexFlipYAxis)) {
            // disable flip
            var t = '';
            var inComment = false;
            for (var i = 0; i < v.length; i++) {
              // disregard / in comments
              if (v[i] === userpat.comment) inComment = !inComment;
              // check for single /
              if ((v[i] !== '/') || inComment) t += v[i];
            }
            v = t;
          } else {
            v = userpat.flipYaxis + v;
          }
          updateSequence (id, v, true);
        }
        
        flipFigureYAxis (selectedFigure.id);
        // don't continue function. Figure already changed
        return;
      }
      break;
    case 'magMin':
      document.getElementById('scale').value--;
      updateFigure();
      break;
    case 'magPlus':
      document.getElementById('scale').value++;
      updateFigure();
      break;
    case 'moveForward':
      document.getElementById('straightLine').classList.remove ('on');
      document.getElementById('curvedLine').classList.remove ('on');
      if (e.classList.contains ('on')) {
        // remove disabled for move
        document.getElementById('moveXCont').firstChild.classList.add ('noDisplay');
        document.getElementById('moveXCont').classList.remove ('collapsed');
        // set default of 2 if no value was set
        var el = document.getElementById('moveX-value');
        if (el.value == 0) el.value = 2;
      }
      break;
    case 'straightLine':
      document.getElementById('moveForward').classList.remove ('on');
      document.getElementById('curvedLine').classList.remove ('on');
      if (e.classList.contains ('on')) {
        document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
        document.getElementById('moveXCont').classList.remove ('collapsed');
        document.getElementById('moveYCont').classList.remove ('collapsed');
      }
      break;
    case 'curvedLine':
      document.getElementById('straightLine').classList.remove ('on');
      document.getElementById('moveForward').classList.remove ('on');
      if (e.classList.contains ('on')) {
        document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
        document.getElementById('moveXCont').classList.remove ('collapsed');
        document.getElementById('moveYCont').classList.remove ('collapsed');
      }
      break;
    case 'figEntryButton':
    case 'figExitButton':
      // switch button upright/inverted
      e.classList.toggle ('inverted');
      break;
    case 'switchX':
    case 'switchY':
      var l = figures[selectedFigure.id].unknownFigureLetter;
      if (l && (l !== 'L') && ('switchFirstRoll' in figures[selectedFigure.id])) {
        document.getElementById('switchFirstRoll').classList.toggle ('on');
      }
      break;
  }
  updateFigure();
}

// addPlusMinElements creates plus/min elements on startup and when
// switching smallMobile
function addPlusMinElements () {
  var el = document.getElementsByClassName('plusMin');
  for (var i = el.length - 1; i >= 0; i--) {
    // clear element
    while (el[i].childNodes.length) el[i].removeChild(el[i].lastChild);
    buildPlusMinElement (el[i].id + '-value', 0, el[i]);
  }
}

// buildButtons builds the buttons on startup, or after being called by
// updateUserTexts
function buildButtons () {
  var el = document.getElementsByClassName('button');
  for (var i = el.length - 1; i >=0; i--) {
		el[i].classList.remove ('on');
  }
  // add tooltips, but not on touchscreen
  if (!platform.mobile && !platform.touch) {
    for (var key in userText.tooltip) {
      var el = document.getElementById(key);
      // add empty div and class on first run
      if (!el.classList.contains ('tooltip')) {
				el.classList.add ('tooltip');
				el.appendChild (document.createElement ('div'));
			}
				
			el.lastChild.innerHTML = userText.tooltip[key];
		}
	}
}

// build an element with plus/minus buttons and return it
function buildPlusMinElement (id, value, el) {
  el = el || document.createElement('span');
  
  var span = document.createElement('span');
  span.classList.add('minButton');
  span.addEventListener('click', clickButton, false);
  el.appendChild (span);
  
  var input = document.createElement('input');
  input.type = 'number';
  input.step = '1';
  input.setAttribute ('id', id);
  input.setAttribute ('value', value);
  input.classList.add ('plusMinText');
  input.addEventListener ('update', updateFigure, false);
  el.appendChild (input);

  var span = document.createElement('span');
  span.classList.add('plusButton');
  span.addEventListener('click', clickButton, false);
  el.appendChild (span);
  
  if (!platform.smallMobile && (userText.tooltip[id])) {
    el.classList.add ('tooltip','ttRight');
    var div = document.createElement('div');
    div.innerHTML = userText.tooltip[id];
    el.appendChild(div);
  }

  return el;
}

// addRollSelectElement adds roll select elements to the parent element
function addRollSelectElement (figNr, rollEl, elNr, parent) {
  var thisRoll = figures[figNr].rollInfo[rollEl];
  var pattern = '';
  if (thisRoll.pattern[elNr]) {
    pattern = thisRoll.pattern[elNr];
    // handle special case where (non-standard) 28 is used i.s.o. 8
    if (pattern === '28') pattern = '8';
  }
  var span = document.createElement ('span');
  span.classList.add ('rollElement');
  var html = '<div class="form-group">' +
	  '<select id="roll' + rollEl + '-' + elNr +
    '" class="rollSelect disableRollFUfig">';
  // build the slow roll options
  for (var i = 0; i < rollTypes.length; i++) {
    var roll = rollTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="rollSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the positive flick options
  for (var i = 0; i < posFlickTypes.length; i++) {
    var roll = posFlickTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="posFlickSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // build the negative flick options
  for (var i = 0; i < negFlickTypes.length; i++) {
    var roll = negFlickTypes[i].split(':');
    html += '<option value="'+roll[0]+'" class="negFlickSelectOption"';
    if (roll[0] == pattern) html += ' selected="selected"';
    html += '>'+roll[1]+'</option>';
  }
  // add spins when rollcode = 4 AND in first element, OR nonArestiRolls
  // is enabled
  if ((fig[figures[figNr].figNr].rolls[rollEl] === 4 && (elNr === 0)) ||
	  document.getElementById('nonArestiRolls').checked) {
	  // build the positive spin options
	  for (var i = 0; i < posSpinTypes.length; i++) {
	    var roll = posSpinTypes[i].split(':');
	    html += '<option value="'+roll[0]+'" class="posSpinSelectOption"';
	    if (roll[0] == pattern) html += ' selected="selected"';
	    html += '>'+roll[1]+'</option>';
	  }
	  // build the negative spin options
	  for (var i = 0; i < negSpinTypes.length; i++) {
	    var roll = negSpinTypes[i].split(':');
	    html += '<option value="'+roll[0]+'" class="negSpinSelectOption"';
	    if (roll[0] == pattern) html += ' selected="selected"';
	    html += '>'+roll[1]+'</option>';
	  }
	}
  // build the glider slow roll options
  if (sportingClass.value === 'glider') {
    for (var i = 0; i < gliderRollTypes.length; i++) {
      var roll = gliderRollTypes[i].split(':');
      html += '<option value="'+roll[0]+'" class="rollSelectOption"';
      if (roll[0] == pattern) html += ' selected="selected"';
      html += '>'+roll[1]+'</option>';
    }
  }
  
  html += '</select><i class="bar"></i></div>';
  
  // build direction flip button
  if (elNr === 0) {
    html += '<div id="roll' + rollEl + '-' + elNr + '-flip" ' +
      'class="rollFlip button small';
  } else {
    html += '<div id="roll' + rollEl + '-' + elNr + '-flip" ' +
      'class="rollFlipTwo button small';
  }
  
  // disable roll flip for no roll
  if (pattern === '') {
    html += ' disable';
  } else if (elNr !== 0) html += ' disableFUfig';

  // decide wether the direction flip is activated for rolls
  if (pattern !== '') {

    if (elNr === 0) {
      // flip direction for the first roll
      if (thisRoll.flip[elNr]) html += ' on';
    } else {
      // XOR with the previous roll direction for subsequent rolls
      if (thisRoll.flip[elNr] != thisRoll.flip[elNr-1]) {
        html += ' on';
      } 
    }
  } else if (elNr !== 0) {
    // activate flip direction for subsequent rolls that are still empty
    html += ' on';
  }
  
  html += '"><div><div></div></div></div>';
  
  // build number flip button
  html += '<div id="roll' + rollEl + '-' + elNr + '-flipNumber" ' +
    'class="numberFlip button small';

  // decide wether the direction flip is activated for rolls
  if (pattern !== '') {
    if (thisRoll.flipNumber[elNr]) html += ' on';
  } else html += ' disable';
  
  html += '"><div><div></div></div></div>';
  
  // build roll comment field
  html += '<input type="text" id="roll' + rollEl + '-' + elNr +
    '-comment" class="rollComment" value="';
  if (thisRoll.comment[elNr]) {
    html += thisRoll.comment[elNr].replace(/^\|/, '');
  }
  html += '">';
  span.innerHTML = html;
  parent.appendChild (span);
  // give browser time to build the DOM from innerHTML before adding
  // events
  window.setTimeout (function(){
    var el = document.getElementById('roll' + rollEl + '-' + elNr);
    if (el) {
      el.addEventListener('change', updateFigure, false);
      document.getElementById('roll' + rollEl + '-' + elNr + '-flip').addEventListener('click', clickButton, false);
      document.getElementById('roll' + rollEl + '-' + elNr + '-flipNumber').addEventListener('click', clickButton, false);
      document.getElementById('roll' + rollEl + '-' + elNr + '-comment').addEventListener('change', updateFigure, false);
    }
  }, 200);
}

// createProgramme will build a programme and add it to
// the library menu list
function createProgramme (year, rnLower, rules, cat, seq, string) {
  var key = year + rules + ' ' + cat + ' ' + seq;
  var sequence = '<sequence><class>';
  sequence += rnLower.match(/^glider-/) ? 'glider' : 'powered';
  sequence += '</class><rules>' + rules + '</rules>' +
    '<category>' + cat + '</category>' +
    '<program>' + seq + '</program>' +
    '<sequence_text>' + string + '</sequence_text>';
  if (rulesLogo[rules.toLowerCase()]) {
    sequence += '<logo>' + rulesLogo[rules.toLowerCase()] + '</logo>';
  }
  sequence += '<oa_version>' + version + '</oa_version></sequence>';
  console.log ('Adding programme: ' + key);
  library[key] = sequence;
  addProgrammeToMenu (key);
}  

// addProgrammeToMenu will add an entry in the library menu list
function addProgrammeToMenu (key) {
  var el = document.getElementById('library');
  var year = key.match (/^[\d]+/)[0];
  if (year) {
    var li = document.getElementById('year' + year);
    if (!li) {
      li = document.createElement('li');
      li.setAttribute ('id', 'year' + year);
      li.innerHTML = '<span>' + year + '</span>' +
        '<i class="material-icons ' +
        (platform.mobile ? 'rightArrow' : 'leftArrow') + '"></i>';
      var ul = document.createElement('ul');
      li.appendChild (ul);
      el.appendChild (li);
    } else {
      var ul = li.lastChild;
    }
    var subli = document.createElement('li');
    // don't put the current year CIVA sequences under CIVA submenu
    if (key.match (/^[\d]+ CIVA(-Glider|)/) &&
      (year === (version.match (/[\d]+/)[0]))) {
      subli.innerHTML = '<span>' +
        key.replace(/^[\d]+[ ]*/, '').replace (/ /g, '&nbsp;').replace (/-/g, '&#8209;') +
        '</span>';
      subli.setAttribute ('id', 'programme-' + key);
      subli.addEventListener ('click', programme, false);
    } else {
      var group = key.match (/^[\d]+ ([^ ]+)/)[1];
      var subul = document.getElementById(year + ' ' + group);
      // create new group if the group does not exist yet
      if (!subul) {
        subli.innerHTML = '<span>' + group + '</span>' +
          '<i class="material-icons rightArrow"></i>';
        subul = document.createElement ('ul');
        subul.id = year + ' ' + group;
        subli.appendChild (subul);
      }
      var subsubli = document.createElement('li');
      subsubli.innerHTML = '<span>' + key.replace(/^[\d]+ [^ ]+[ ]*/, '') + '</span>';
      subsubli.setAttribute ('id', 'programme-' + key);
      subsubli.addEventListener ('click', programme, false);
      subul.appendChild (subsubli);
      // Sort the sub-sub menues on size.
      // If previous ul has less children, swap ul. This keeps the
      // largest program lists in top
      var pNode = subul.parentNode;
      while (pNode.previousSibling &&
        pNode.previousSibling.lastChild &&
        (pNode.previousSibling.lastChild.tagName === 'UL') &&
        (pNode.previousSibling.lastChild.childElementCount < subul.childElementCount) &&
        !/^CIVA(-Glider|)/.test (pNode.previousSibling.firstChild.innerHTML)) {
        pNode.parentNode.insertBefore(pNode, pNode.previousSibling);
      }
    }
    if (subli.innerHTML) ul.appendChild(subli);
  } else {
    var li = document.createElement('li');
    li.innerHTML = '<span>' + key + '</span>';
    li.setAttribute ('id', 'programme-' + key);
    li.addEventListener ('click', programme, false);
    el.appendChild(li);
  }
}
  
// setOptions will:
// -add programme entries to the menu
// -set correct options in settings dialog
function setOptions () {
  // add programme entries
  for (var key in library) addProgrammeToMenu (key);

  // set settings dialog options
  
  // create language chooser, with default language
  var el = document.getElementById('language');
  for (var key in lang) {
    var option = document.createElement('option');
    option.setAttribute('value', key);
    option.innerHTML = lang[key][key];
    el.appendChild(option);
  }
  el.setAttribute('value', defaultLanguage);

  // set default values
  document.getElementById ('numberInCircle').setAttribute('value', numberInCircle);
  document.getElementById ('zipImageFilenamePattern').setAttribute('value', zipImageFilenamePattern);
  document.getElementById ('zipImageFilenamePattern').setAttribute('size', zipImageFilenamePattern.length);

  // set roll font sizes
  for (var key in rollFont) {
    var opt = document.getElementById('t_roll' + key[0].toUpperCase() + key.slice(1));
    opt.setAttribute('value', rollFont[key]);
    if (rollFont[key] == rollFontSize) {
      opt.setAttribute ('selected', 'selected');
    }
  }
  
  // add styles to settings dialog, sorted alphabetically
  var el = document.getElementById('styles');
  var sortKeys = Object.keys(style).sort();
  for (var i = 0; i < sortKeys.length; i++) {
    var key = sortKeys[i];
    styleSave[key] = style[key];
    var opt = document.createElement('option');
    opt.setAttribute('value', key);
    opt.innerHTML = key;
    el.appendChild(opt);
  }
  getStyle();
}

// loadSettingsXML will load settings from provided XML data
// xml      = xml data
// Returns an object containing the loaded settings, or
// false if no settings were loaded
function loadSettingsXML (xml) {
  var s = {};
  if (xml) {
    // myElement will hold every entry as a node
    var myElement = document.createElement('div');
    // myTextArea will translate HTML escape characters to regular ones
    var myTextArea = document.createElement('textarea');
    myElement.innerHTML = xml;
    var rootNode = myElement.getElementsByTagName("sequence")[0];
    if (!rootNode) return false;
    var settings = rootNode.getElementsByTagName("settings")[0];
    if (!settings) return false;
    var nodes = settings.getElementsByTagName("setting");
    // Put every element in the correct field
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getElementsByTagName("key")[0].textContent;
      var val = nodes[i].getElementsByTagName("value")[0].innerHTML;
      // only adjust settings that are in loadSettings (config.js)
      if (loadSettings.indexOf(key) != -1) {
        if (val) {
          // translate escape characters by browser through myTextArea
          myTextArea.innerHTML = val;
          // e will be the field, only put a value when it exists
          var e = document.getElementById(key);
          if (e) {
            if (e.type === 'checkbox') {
              if (val === 'true') {
                e.checked = 'checked';
              } else {
                e.removeAttribute ('checked');
              }
            } else {
              e.value = myTextArea.value;
            }
            s[key] = myTextArea.value;
          }
        }
      }
    }
  }
  if (s != {}) return s; else return false;
}
  
// loadSettingsStorage will load the settings from storage
// When location is not set it will default to 'settings'
function loadSettingsStorage (location) {
  location = location || 'settings';
  
  function f (settings) {
    if (settings) {
			if (!/[\[\{]/.test(settings.charAt(0))) {
				// settings conversion to JSON. Can be removed in 2019.1
				console.log ('Old settings format, converting to JSON...');
				var settingObj = {};
				settings = settings.split('|');
				for (var i = settings.length - 1; i >= 0; i--) {
					var setting = settings[i].split('=');
					settingObj[setting[0]] = decodeURI(setting[1]);
				}
				settings = JSON.stringify (settingObj);
				saveSettingsStorage (location);
			}
      settings = JSON.parse (settings);
      for (var settingKey in settings) {
        var el = document.getElementById (settingKey);
        var value = settings[settingKey];
        if (el.type === 'checkbox') {
          if (value == 1) {
            el.setAttribute ('checked', 'checked');
          } else {
            el.removeAttribute ('checked');
          }
        } else if (el.type.match (/^select/)) {
          // only set values that are in the list in a select
          var el = document.getElementById (settingKey);
          var nodes = el.childNodes;
          for (var key in nodes) {
            // see if exact value is in there and set and break if so
            if (nodes[key].value == value) {
              el.value = value;
              break;
            }
            // if the value is numeric, find closest match
            if ((parseFloat(nodes[key].value) == nodes[key].value) &&
              (parseFloat(value) == value)) {
              if (Math.abs(nodes[key].value - value) < Math.abs(el.value - value)) {
                el.value = nodes[key].value;
              }
            }
          }
        } else {
          // only update non-empty settings
          if (value !== '') el.value = value;
        }
      }
      updateUserTexts();
      numberInCircle = document.getElementById('numberInCircle').checked ? true : false;
      changeRollFontSize (document.getElementById('rollFontSize').value);
    }
  }
  
  if (storage) getLocal (location, f);
}

// saveSettingsStorage will save the settings to storage
// When location is not set it will default to 'settings'
function saveSettingsStorage (location) {
	var
		settings = {},
		value;

  location = location || 'settings';

  if (storage) {
    for (var i = saveSettings.length - 1; i >=0; i--) {
      var el = document.getElementById(saveSettings[i]);
      if (el.type === 'checkbox') {
        value = el.checked ? 1 : 0;
      } else {
        value = el.value;
      }
      settings[el.id] = value;
    }
    storeLocal (location, JSON.stringify (settings));
  }
}

// savePrintDialogStorage will save the print dialog settings to
// storage
function savePrintDialogStorage () {
  if (storage) {
    var settings = [];
    var inputs = document.getElementById('printDialog').getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      if (el.type === 'checkbox') {
        var value = el.checked ? 1 : 0;
      } else {
        var value = encodeURI(el.value);
      }
      settings.push (el.id + '=' + value);
    }
    storeLocal ('printDialog', settings.join('|'));
  }
}
      
// loadPrintDialogStorage will load the the print dialog settings from
// storage
function loadPrintDialogStorage () {
  
  function f (settings) {
    if (!settings) return;
    settings = settings.split('|');
    for (var i = 0; i < settings.length; i++) {
      var setting = settings[i].split('=');
      var el = document.getElementById (setting[0]);
      var value = decodeURI(setting[1]);
      if (el) {
        if (el.type === 'checkbox') {
          if (setting[1] == 1) {
            el.setAttribute ('checked', 'checked');
          } else {
            el.removeAttribute ('checked');
          }
        } else if (el.type.match (/^select/)) {
          // only set values that are in the list in a select
          var el = document.getElementById (setting[0]);
          var nodes = el.childNodes;
          for (var key in nodes) {
            // see if exact value is in there and set and break if so
            if (nodes[key].value == value) {
              el.value = value;
              break;
            }
            // if the value is numeric, find closest match
            if ((parseFloat(nodes[key].value) == nodes[key].value) &&
              (parseFloat(value) == value)) {
              if (Math.abs(nodes[key].value - value) < Math.abs(el.value - value)) {
                el.value = nodes[key].value;
              }
            }
          }
        } else {
          el.value = value;
        }
      }
    }
    setPilotCardForm();
  }
  
  if (storage) getLocal ('printDialog', f);
}
       
// changeLanguage will change the interface language
function changeLanguage () {
  updateUserTexts();
  updateFigureSelectorOptions ();
  if (platform.mobile) mobileMenuHeader ();
  saveSettingsStorage();
  checkSequenceChanged(true);
}

// getStyle will retrieve a style and put it's value in the Settings
// styleString field
function getStyle() {
  var key = document.getElementById('styles').value;
  document.getElementById('styleString').value = style[key];
}

// updateStyle will change a style after it has been changed in the
// Settings styleString field
function updateStyle() {
  style[document.getElementById('styles').value] = this.value;
  // update rollFontSize if applicable
  if (document.getElementById('styles').value === 'rollText') {
    rollFontSize = style.rollText.match(regexRollFontSize)[1];
  }
  // redraw sequence
  draw();
}

// resetStyle resets a style (or all) to the default value
function resetStyle(all) {
  var key;
  if (all) {
    for (key in style) style[key] = styleSave[key];
  } else {
    key = document.getElementById('styles').value;
    style[key] = styleSave[key];
  }
  getStyle();
  draw();
}

// restoreDefaultSettings restores all settings to their default values
function restoreDefaultSettings () {
  // close settings dialog
  settingsDialog ();
  confirmBox (
    userText.restoreDefaultSettingsConfirm,
    userText.restoreDefaultSettings,
    function(){
      storeLocal ('settings', '');
      // reload the page, sequence will be provided by localStorage
      window.location.reload(true);
    }
  );
}
 
// updateNonArestiRolls is called when "non-Aresti rolls" is changed in
// settings
function updateNonArestiRolls() {
  saveSettingsStorage();
  draw();
  selectFigure (false);
}

// updateNumberInCircle is called when "number in circle" is changed in
// settings
function updateNumberInCircle() {
  saveSettingsStorage();
  numberInCircle = (!numberInCircle);
  draw();
}

// updateRollFontSize is called when "roll font size" is changed in
// settings
function updateRollFontSize() {
  saveSettingsStorage();
  changeRollFontSize(this.value);
  draw();
}

// updateGridColumns is called when "Grid columns" is changed in settings
function updateGridColumns() {
  saveSettingsStorage();
  selectForm('Grid');
}

// setPilotCardForm will show or hide pilot card options
function setPilotCardForm () {
  if (document.getElementById('printFormPilotCards').checked) {
    document.getElementById('pilotCardLayout').classList.remove('folded');
  } else {
    document.getElementById('pilotCardLayout').classList.add('folded');
  }
  saveImageSizeAdjust();
  changePilotCardPercent();
}

// setPilotCardLayout is activated when clicking a pilot card layout in
// the print/save dialog
function setPilotCardLayout(evt) {
  var els = document.getElementsByClassName ('pilotCardLayout');
  for (i = els.length - 1; i >= 0; i--) {
		if (els[i] === this) {
			if (this.classList.contains ('active')) {
				if (evt.target === document.getElementById('pilotCardPercentValue')) return;
				if (this.classList.contains ('formRL')) {
					this.classList.remove ('formRL');
				} else if (this.classList.contains ('formL')) {
					if (this.id === 'pilotCardPercent') {
						this.classList.remove ('formL');
					} else {
						this.classList.remove ('formL');
						this.classList.add ('formRL');
					}
				} else this.classList.add ('formL');
			} else this.classList.add ('active');
		} else {
	    els[i].classList.remove ('active');
		}
  }
}

// changePilotCardPercent is activated when changing pilotCardPercentValue
function changePilotCardPercent () {
	document.getElementById ('pilotCardPercentImage').style.height =
		Math.min (100, document.getElementById ('pilotCardPercentValue').value) + 'px';
}

// selectPwrdGlider is activated when powered or glider is chosen
function selectPwrdGlider () {
  // update figure chooser
  changeFigureGroup();
  // update figure entryExit values
  if (sportingClass.value === 'glider') {
    for (var i = fig.length - 1; i >= 0; i--) {
      if (fig[i]) fig[i].entryExit = fig[i].entryExitGlider;
    }
  } else {
    for (var i = fig.length - 1; i >= 0; i--) {
      if (fig[i]) fig[i].entryExit = fig[i].entryExitPower;
    }
  }
  // update rule list
  updateRulesList();
  changeCombo ('program');
  // select no figure to force roll option redraw
  selectFigure (false);
  // redraw including mini form A
  draw();
  // update sequence info
  changeSequenceInfo();
  // hide Harmony field for powered
  var el = document.getElementById ('harmonyField');
  if (el) {
    if (sportingClass.value === 'powered') {
      el.classList.add ('hidden');
      document.getElementById ('harmony').setAttribute ('disabled', true);
    } else {
      el.classList.remove ('hidden');
      document.getElementById ('harmony').removeAttribute ('disabled');
    }
  }
}

// setYAxisOffset sets the Y axis offset
function setYAxisOffset (offset) {
  yAxisOffset = offset;
  // set scaleLine object to prevent calculations in makeLine and other
  // functions
  if (curvePerspective) {
    scaleLine.x = yAxisScaleFactor * Math.cos(yAxisOffset * Math.degToRad);
    scaleLine.y = yAxisScaleFactor * Math.sin(yAxisOffset * Math.degToRad);
  } else {
    scaleLine.x = scaleLine.y = 1;
  }
}

// updateFigureEditor will update the figure editor for the
// provided figureId
function updateFigureEditor () {
  if (document.getElementById('figureInfo')) {
    displaySelectedFigure();
    updateFigureOptions(selectedFigure.id);
    addRollSelectors(selectedFigure.id);
  }
}

// showFigureSelector displays the base figure selector
// for some reason sliding only works from the left for smallMobile !?
function showFigureSelector () {
	var figureSelector = document.getElementById('figureSelector');
  updateFigureSelectorOptions ();
  figureSelector.classList.add('active');
  if (activeForm === 'FU') {
    // set figureString correctly, using positioning relative to leftBlock
    document.getElementById('leftBlock').scrollTop = 0;
    figureSelector.insertBefore (
	    document.getElementById('figureString'),
	    figureSelector.firstChild);
    //document.getElementById('figureString').classList.add('inFigureSelector');
  }
}

// hideFigureSelector hides the base figure selector
// but because we do need it to be available for various operations
// we hide it by removing the CSS class that shows it on screen
function hideFigureSelector () {
  document.getElementById ('figureSelector').classList.remove('active');
  document.getElementById ('leftBlock').insertBefore (
	  document.getElementById('figureString'),
	  document.getElementById('leftBlock').firstChild);
  //document.getElementById('figureString').classList.remove('inFigureSelector');
}

// hideLogoChooser hides the logo chooser
function hideLogoChooser () {
  document.getElementById('logoChooserContainer').classList.add('noDisplay');
}

// displaySelectedFigure will display the currently selected figure
// in the figure editor
function displaySelectedFigure() {
  var svg = document.getElementById('selectedFigureSvg');
  prepareSvg(svg);
  svg.setAttribute('width', 140);
  svg.setAttribute('height', 140);

  if (selectedFigure.id !== null) {
    // assign this figure an id of -2 to prevent filtering etc.
    figures[-2] = figures[selectedFigure.id];
    // reset X and Y and clear figureStart to prevent adjusting
    // figure position
    X = Y = 0;
    figureStart = [];
    drawFullFigure(-2, true, svg);

    var bBox = figures[-2].bBox;
    delete figures[-2];
    // Set viewBox from figure bBox
    var xMargin = bBox.width / 20;
    var yMargin = bBox.height / 20;
    svg.setAttribute('viewBox',
      roundTwo(bBox.x - xMargin) + ' ' +
      roundTwo(bBox.y - yMargin) + ' ' +
      roundTwo(bBox.width + xMargin * 2) + ' ' +
      roundTwo(bBox.height + yMargin * 2));
  }
}

// updateFigureOptions will update all options for editing a figure
// var figureId is the id of the figures[] object
function updateFigureOptions (figureId) {
  var
	  f = figures[figureId],
	  figureOptions = document.getElementById('figureOptions');
	  
  // show figure box and figureOptions by default
  document.getElementById('selectedFigure').classList.remove('hidden');
  figureOptions.classList.remove('hidden');
  // hide fuSelectFigureFirst text by default
  document.getElementById('fuSelectFigureFirst').classList.add('noDisplay');
  // hide figureStringInput by default
  document.getElementById ('figureString').classList.add ('noDisplay');

  if ((activeForm !== 'FU') && (!f || (f && !f.aresti))) selectedFigure.id = null;
  
  if (selectedFigure.id === null) {
		document.getElementById('figureInfo').classList.add ('noFigure');
    if (activeForm !== 'FU') {
      // clear figure box
      document.getElementById('selectedFigure').classList.remove('active');
    } else {
      // hide figure box and options. Important to only HIDE for Firefox
      document.getElementById('selectedFigure').classList.add('hidden');
      figureOptions.classList.add('hidden');
      document.getElementById('subSequenceDirection').classList.add ('noDisplay'); 
      document.getElementById('fuSelectFigureFirst').classList.remove('noDisplay');
    }
    // hide figure modifiers
    document.getElementById('unknownFigureChooser').classList.add('hidden');
    document.getElementById('entryExit').classList.add('noDisplay');
    // hide Free (Un)known disabled options warning
    document.getElementById('FUfigOptionsDisabled').classList.add ('noDisplay');
  } else {
		// remove all disable classes
		var disable = figureOptions.getElementsByClassName ('disable');
		while (disable.length) disable[0].classList.remove ('disable');
    var els = document.getElementsByClassName ('disableFUfig');
		for (var i = els.length - 1; i >= 0; i--) {
      els[i].classList.remove ('disable');
		}
		
		document.getElementById('figureInfo').classList.remove ('noFigure');
    // activate figure box
    document.getElementById('selectedFigure').classList.add('active');
    if ((activeForm === 'FU') && f.unknownFigureLetter && (f.unknownFigureLetter !== 'L')) {
      document.getElementById ('addFigureText').classList.add ('noDisplay');
    } else {
      document.getElementById ('addFigureText').classList.remove ('noDisplay');
    }
    
    if ((activeForm === 'FU') && ((f.unknownFigureLetter === 'L') || !f.unknownFigureLetter)) {
      // update and show figureStringInput
      if (document.getElementById ('figureStringInput').value !== f.string) {
	      document.getElementById ('figureStringInput').value = (!/[LX]/.test(f.string)) ? f.string : '';
			}
      document.getElementById ('figureString').classList.remove ('noDisplay');
    }

    // show figure modifiers
    if (fig[f.figNr]) {
      document.getElementById('entryExit').classList.remove ('noDisplay');
    } else document.getElementById('entryExit').classList.add ('noDisplay');
    if ((f.entryAxis === 'X') || (f.seqNr === 1) || f.subSequence) {
      document.getElementById ('flipYAxis').classList.remove ('disable');
    } else {
      document.getElementById ('flipYAxis').classList.add ('disable');
    }      
    // set switchFirstRoll
    var el = document.getElementById('switchFirstRoll');
    if (f.switchFirstRoll) {
      el.classList.add ('on');
    } else if (f.switchFirstRoll === false) {
      el.classList.remove ('on');
    } else {
      el.classList.add ('disable');
    }
    // set switchX
    var el = document.getElementById('switchX');
    //el.classList.remove ('disable');
    if (f.switchX) {
      el.classList.add ('on');
    } else if (f.switchX === false) {
      el.classList.remove ('on');
    } else {
      el.classList.add ('disable');
    }
    // disable for Free (Un)known fig unless this figure starts on Y axis
    if (f.entryAxis === 'Y') {
      el.classList.remove ('disableFUfig');
    } else {
      el.classList.add ('disableFUfig');
    }
    // set switchY
    var el = document.getElementById('switchY');
    //el.classList.remove ('disable');
    if (f.switchY) {
      el.classList.add ('on');
    } else if (f.switchY === false) {
      el.classList.remove ('on');
    } else {
      el.classList.add ('disable');
    }
    // disable for Free (Un)known fig unless this figure starts on X axis
    if (f.entryAxis === 'X') {
      el.classList.remove ('disableFUfig');
    } else {
      el.classList.add ('disableFUfig');
    }
    // set correct scale
    document.getElementById('scale').value = f.scale || 0;
    // set move
    // first we disable all selectors and remove values
    document.getElementById('straightLine').classList.remove ('on');
    document.getElementById('curvedLine').classList.remove ('on');
    document.getElementById('moveForward').classList.remove ('on');
    document.getElementById('moveXCont').classList.add ('collapsed');
    document.getElementById('moveYCont').classList.add ('collapsed');
    document.getElementById('moveX-value').value = '';
    document.getElementById('moveY-value').value = '';
    
    // go back in the figure list until we end up at the beginning OR
    // find a real figure OR find a move figure
    var i = figureId - 1;
    while ((i >= 0) && !figures[i].figNr) {
      var prevFig = figures[i];
      if (prevFig) {
        if (prevFig.moveTo) {
          document.getElementById('moveX-value').value = /^[CL]$/.test(activeForm) ?
            -prevFig.moveTo[0] : prevFig.moveTo[0];
          document.getElementById('moveY-value').value = prevFig.moveTo[1];
          document.getElementById('straightLine').classList.add ('on');
          document.getElementById('moveXCont').classList.remove ('collapsed');
          document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
          document.getElementById('moveYCont').classList.remove ('collapsed');
          break;
        } else if (prevFig.curveTo) {
          document.getElementById('moveX-value').value = /^[CL]$/.test(activeForm) ?
            -prevFig.curveTo[0] : prevFig.curveTo[0];
          document.getElementById('moveY-value').value = prevFig.curveTo[1];
          document.getElementById('curvedLine').classList.add ('on');
          document.getElementById('moveXCont').classList.remove ('collapsed');
          document.getElementById('moveXCont').firstChild.classList.remove ('noDisplay');
          document.getElementById('moveYCont').classList.remove ('collapsed');
          break;
        } else if (prevFig.moveForward) {
          document.getElementById('moveX-value').value = prevFig.moveForward;
          document.getElementById('moveForward').classList.add ('on');
          document.getElementById('moveXCont').classList.remove ('collapsed');
          document.getElementById('moveXCont').firstChild.classList.add ('noDisplay');
          break;
        }
      }
      i--;
    }
    // no earlier real figure found, disable move selectors
    if (i == -1) {
      document.getElementById('straightLine').classList.add ('disable');
      document.getElementById('curvedLine').classList.add ('disable');
      document.getElementById('moveForward').classList.add ('disable');
    }
    // set subSequence, but disable for first real figure except on
    // Free (Un)known designer
    var button = document.getElementById('subSequence');
    var el = document.getElementById('subSequenceDirection');
    if ((i == -1) && (activeForm !== 'FU')) {
      button.classList.add ('disable');
      el.classList.add ('noDisplay');
    } else if (f.subSequence) {
      button.classList.add ('on');
      el.classList.remove ('noDisplay');
      document.getElementById('subSequenceDirections').value = f.subSequence;
    } else {
      button.classList.remove ('on');
      el.classList.add ('noDisplay');
    }
    
    // only show unknown figure letter selector when figureLetters
    // defined, or when the value was not 0 to enable changing
    var el = document.getElementById('unknownFigure');
    if ((figureLetters !== '') || f.unknownFigureLetter) {
      // clear select list
      while (el.childNodes.length) el.removeChild(el.lastChild);
      // build select list
      var listLetters = figureLetters;
      var option = document.createElement ('option');
      option.setAttribute ('value', '0');
      option.innerHTML = userText.noFreeUnknownFig;
      el.appendChild (option);
      if (additionalFig.max > 0) {
        var option = document.createElement ('option');
        option.setAttribute ('value', 'L');
        option.innerHTML = userText.freeUnknownAdditional;
        el.appendChild (option);
        listLetters += 'L';
      }
      for (var j = 0; j < figureLetters.length; j++) {
        var option = document.createElement ('option');
        option.setAttribute ('value', figureLetters[j]);
        option.innerHTML = userText.freeUnknownFig + figureLetters[j];
        el.appendChild (option);
      }
      // add the actual figure letter as an option if not present in list
      if (f.unknownFigureLetter) {
        if (!listLetters.match(new RegExp(f.unknownFigureLetter))) {
          var option = document.createElement ('option');
          option.setAttribute ('value', f.unknownFigureLetter);
          if (f.unknownFigureLetter === 'L') {
            option.innerHTML = userText.freeUnknownAdditional;
          } else {
            option.innerHTML = userText.freeUnknownFig +
              f.unknownFigureLetter;
          }
          el.appendChild (option);
        }
      }
        
      // set Unknown Figure and selector colors      
      el.parentNode.classList.remove ('hidden');
      if (activeForm === 'FU') {
        el.setAttribute ('disabled', 'disabled');
      } else el.removeAttribute ('disabled');
      var used = [];
      for (var j = figures.length - 1; j >= 0; j--) {
        if (figures[j].unknownFigureLetter && figures[j].aresti && (j != figureId)) {
          if (figures[j].unknownFigureLetter != 'L') {
            used.push(figures[j].unknownFigureLetter);
          }
        }
      }
      var options = el.getElementsByTagName('option');
      for (var j = options.length - 1; j >= 0; j--) {
        if (used.indexOf(options[j].value) != -1) {
          options[j].classList.add('used');
        } else {
          options[j].classList.remove('used');
        }
      }
      el.value = f.unknownFigureLetter ? f.unknownFigureLetter : 0;
    } else {
      // make sure no value is selected and hide select box
      el.value = 0;
      el.parentNode.classList.add ('hidden');
    }
    
    // check if dealing with a real figure. If so, allow upright/inverted setting
    if (fig[f.figNr]) {
      // set entry attitude button
      var pattern = fig[f.figNr].pattern;
      document.getElementById('figEntryButton').classList.remove('inverted');
      if (pattern[0] === '-') {
        document.getElementById('figEntryButton').classList.add('inverted');
      }      
      // set exit attitude button
      document.getElementById('figExitButton').classList.remove('inverted');
      if (pattern[pattern.length - 1] === '-') {
        document.getElementById('figExitButton').classList.add('inverted');
      }
    }
    
    // set entry extension
    document.getElementById('entryExt-value').value = f.entryExt || 0;
    // set exit extension
    document.getElementById('exitExt-value').value = f.exitExt || 0;
    // show comments box
    var el = document.getElementById('commentSection');
    if (f.comments || (document.activeElement.id === 'comments')) {
      el.classList.add ('expanded');
    } else el.classList.remove ('expanded');
    var el = document.getElementById('comments');
    el.value = f.comments ? f.comments : '';
    
    var disable = false;
    var el = document.getElementById('FUfigOptionsDisabled');
    el.classList.add ('noDisplay');
    // when the figure is a Free (Un)known figure with a letter, disable
    // disableFUfig buttons and disableRollFUfig select
    if (figures[selectedFigure.id].unknownFigureLetter) {
      if (figures[selectedFigure.id].unknownFigureLetter !== 'L') {
        disable = true;
        el.classList.remove ('noDisplay');
      }
    }
    
    // the DOM may need some time to update classes, so wait before
    // enabling/disabling
    //setTimeout (function(){
      var els = document.getElementsByClassName ('disableFUfig');
      for (var i = els.length - 1; i >= 0; i--) {
        if (disable) {
          els[i].classList.add ('disable');
        }
      }
  
      var els = document.getElementsByClassName ('disableRollFUfig');
      for (var i = els.length - 1; i >= 0; i--) {
        if (disable) {
          els[i].setAttribute ('disabled', 'disabled');
        } else {
          els[i].removeAttribute ('disabled');
        }
      }
      
    //}, 200);

  }
}

// addRollSelectors will add all applicable roll selectors when
// editing a figure
// var figureId is the id of the figures[] object
function addRollSelectors (figureId) {
  var myEl = document.getElementById('rollInfo');
  if ((figureId === null) || !fig[figures[figureId].figNr]) {
    myEl.classList.add ('noDisplay');
  } else {
    myEl.classList.remove ('noDisplay');
    var rolls = fig[figures[figureId].figNr].rolls;
    // clear selectors
    while (myEl.childNodes.length) myEl.removeChild(myEl.lastChild);
    // show the applicable roll selectors
    if (rolls) {
      var rollNr = 0;
      for (var i = 0; i < rolls.length; i++) {
        if ((parseInt(rolls[i]) > 0) &&
          !((rolls[i] == 4) && figures[figureId].rollInfo[i].rollTop)) {
          var rollInfo = figures[figureId].rollInfo[i];
          var div = document.createElement('div');
          div.id = 'roll' + i;
          div.classList.add ('content');
          div.classList.add ('divider');
          var divdiv = document.createElement ('div');
          divdiv.classList.add ('contentLabel');
          divdiv.innerHTML = userText.rollPos[rollNr];
          div.appendChild (divdiv);
          // roll positions of type 9 only allow changing line length 
          if (rolls[i] != 9) {
            // loop until max rolls per element + 1
            for (var j = 0; j < rollsPerRollElement + 1; j++) {
              var pattern = figures[figureId].rollInfo[i].pattern[j-1];
              pattern = pattern ? pattern.replace('-', '') : '';
              // show the element when:
              // it's the first one OR the previous one is not empty
              // AND it's number is not higher than rollsPerRollElement
              if ((j == 0) || (pattern != '')) {
                if (j < rollsPerRollElement) {
                  addRollSelectElement(figureId, i, j, div);
                  var divdiv = document.createElement ('div');
                  divdiv.classList.add ('clearBoth');
                  div.appendChild (divdiv);
                }
              } else break;
            }
          } else {
            var divdiv = document.createElement ('div');
            divdiv.classList.add ('clearBoth');
            divdiv.innerHTML = userText.noRollAllowed;
            div.appendChild (divdiv);
            var j = 1;
          }
          // j indicates how many active subrolls there are
          var subRolls = j;
          // build the gaps element for subRolls rolls, but not for
          // rolls in the top
          if (!figures[figureId].rollInfo[i].rollTop) {
            var divdiv = document.createElement ('div');
            divdiv.classList.add ('rollGaps');
            // only show 'Gaps' text for non-smallMobile
            if (!platform.smallMobile) {
              var span = document.createElement('span');
              span.innerHTML = userText.gaps;
              div.appendChild (span);
            }
            var gap = figures[figureId].rollInfo[i].gap;
            for (var j = 0; j < subRolls; j++) {
              var thisGap = (typeof gap[j] != 'undefined') ? gap[j] : 0;
              var span = document.createElement('span');
              span.setAttribute('id', 'roll'+i+'-gap'+j);
              span.classList.add ('plusMin');
              span.appendChild (buildPlusMinElement('roll'+i+'-gap'+j+'-value', thisGap));
              divdiv.appendChild(span);
            }
            div.appendChild (divdiv);
          }
          var divdiv = document.createElement ('div');
          divdiv.classList.add ('clearBoth');
          div.appendChild (divdiv);
          myEl.appendChild(div);
          rollNr++;
        }
      }
    }
  }
}

// setUndoRedo will update undo/redo buttons and redo object
function setUndoRedo (e, clear) {
  if (clear) {
    activeSequence[e] = [];
  }
  if (activeSequence.undo.length) {
    document.getElementById('undo').firstChild.classList.remove ('disabled');
  } else {
    document.getElementById('undo').firstChild.classList.add ('disabled');
  }
  if (activeSequence.redo.length) {
    document.getElementById('redo').firstChild.classList.remove ('disabled');
  } else {
    document.getElementById('redo').firstChild.classList.add ('disabled');
  }
}
    
// updateFigure will be called when any figure option is updated
// when noRedraw is true, the figure editor is not updated
function updateFigure (noRedraw) {
	var
		scroll = document.getElementById ('leftBlockContainer').scrollTop,
	  // get the current string
	  string = figures[selectedFigure.id].string,
	  // get the base figure number
	  figNr = figures[selectedFigure.id].figNr,
	  // get the pattern
	  pattern = fig[figNr].pattern,
	  // get the base
	  base = fig[figNr].base,
	  // update the original pattern for entry/exit changes
	  entry = document.getElementById('figEntryButton'),
	  exit = document.getElementById('figExitButton');

  if (entry.classList.contains ('inverted')) {
    pattern = '-' + pattern.substring(1);
    base = '-' + base.substring(1);
  } else {
    pattern = '+' + pattern.substring(1);
    base = '+' + base.substring(1);
  }
  if (exit.classList.contains ('inverted')) {
    pattern = pattern.substring(0, pattern.length - 1) + '-';
    base = base.substring(0, base.length - 1) + '-';
  } else {
    pattern = pattern.substring(0, pattern.length - 1) + '+';
    base = base.substring(0, base.length - 1) + '+';
  }
  // check if the base exists
  if (!figBaseLookup [base]) {
    // if not, try flipping entry AND exit
    base = fig[figNr].base.replace(/-/g, '#').replace(/\+/g, '-').replace(/#/g, '+');
    if (figBaseLookup [base]) {
      pattern = fig[figNr].pattern.replace(/-/g, '#').replace(/\+/g, '-').replace(/#/g, '+');
      // set figEntryButton and figExitButton to correct state
      if (base[0] === '-') {
        entry.classList.add ('inverted');
      } else {
        entry.classList.remove ('inverted');
      }
      if (base[base.length - 1] === '-') {
        exit.classList.add ('inverted');
      } else {
        exit.classList.remove ('inverted');
      }
    } else {
      // Doesn't help. Restore original pattern. No option for changing
      // upright/inverted
      pattern = fig[figNr].pattern;
    }
  }
  // remove + from pattern
  pattern = pattern.replace(RegExp ('\\' + userpat.longforward, 'g'), '');
  // add rolls
  var rollEl = 0;
  // start at roll 1 for figures that don't have roll element 0
  if (!document.getElementById('roll0')) rollEl = 1;
  while (pattern.match(regexRollsAndLines)) {
    var rolls = '';
    for (var rollNr = 0; rollNr <= rollsPerRollElement; rollNr++) {
      // apply gaps
      var gap = document.getElementById('roll'+rollEl+'-gap'+rollNr+'-value');
      // only apply when the input element exists
      if (gap) {
        gap = gap.value;
        if (gap < 0) {
          rolls += new Array(1 - gap).join(userpat.lineshorten);
        } else if (gap > 0) {
          gap = gap / 3;
          rolls += new Array(parseInt(gap) + 1).join(userpat.rollext);
          rolls += new Array(Math.round((gap-parseInt(gap))*3) + 1).join(userpat.rollextshort);
        }
      }
      // apply rolls, roll direction flips, roll number flips and comments
      var thisRoll = document.getElementById('roll'+rollEl+'-'+rollNr);
      // only apply when the input element exists
      if (thisRoll) {
        var rollFlip = document.getElementById('roll'+rollEl+'-'+rollNr+'-flip');
        var flipNumber = document.getElementById('roll'+rollEl+'-'+rollNr+'-flipNumber');
        if (thisRoll.value != '') {
          var comment = '';
          if (rollFlip.classList.contains ('on')) {
            rolls += ',';
          } else {
            if (rolls.match(/[0-9fseul]/)) rolls += ';';
          }
          if (flipNumber.classList.contains ('on')) {
            comment = userpat.flipNumber; // add to start of comment
          }
          comment += document.getElementById('roll'+rollEl+'-'+rollNr+'-comment').value;
          if (comment !== '') {
            comment = userpat.comment + comment + userpat.comment;
          }
          rolls += comment;
          rolls += thisRoll.value;
        }
      }
    }
    if ((rollEl == 0) &&
      // set switchFirstRoll
		  document.getElementById('switchFirstRoll').classList.contains ('on')) {
			rolls += userpat.switchFirstRoll;
    } 
    pattern = pattern.replace(regexRollsAndLines, rolls);
    rollEl++;
  }
  // pattern is empty, assume horizontal line (figure 1.1.1.1)
  if (pattern === '') pattern = '0';
  // remove non-necessary roll elements in parenthesis, but only when
  // there are no active rolls in parenthesis
  // result is e.g.: dhd or dhd(1)()
  if (!pattern.match (/\([^)]+\)/)) {
    pattern = pattern.replace (/\(\)/g, '');
  }
  // move back in the figure cueue to find scale, move or subsequence
  // patterns
  var i = selectedFigure.id - 1;
  var moveToFig = false;
  var curveToFig = false;
  var moveForwardFig = false;
  var moveDownFig = false;
  var scaleFig = false;
  var subSequence = false;
  // continue as long as we're not at the beginning and are not on
  // a regular figure  
  while ((i >= 0) && !figures[i].figNr) {
    var prevFig = figures[i];
    if (prevFig) {
      if (prevFig.moveTo || prevFig.curveTo) {
        moveToFig = i;
      } else if (prevFig.moveForward) {
        moveForwardFig = i;
      } else if (prevFig.moveDown) {
        moveDownFig = i;
      } else if (prevFig.scale) {
        scaleFig = i;
      } else if (prevFig.subSequence) {
        if ((i > 0) || (activeForm == 'FU')) subSequence = i;
      }
    }
    i--;
  }
  // set magnification
  el = document.getElementById('scale');
  if (scaleFig === false) {
    if (el.value != 0) {
      updateSequence (selectedFigure.id - 1, el.value+'%', false);
      return;
    }
  } else {
    if (el.value != 0) {
      updateSequence (scaleFig, el.value+'%', true);
    } else {
      updateSequence (scaleFig, '', true);
      return;
    }
  }
  var moveX = document.getElementById('moveX-value').value;
  moveX = moveX ? parseInt(moveX) : 0;
  var moveY = document.getElementById('moveY-value').value;
  moveY = moveY ? parseInt(moveY) : 0;
  var
	  el1 = document.getElementById('moveForward'),
	  el2 = document.getElementById('straightLine'),
	  el3 = document.getElementById('curvedLine');
  if (el2.classList.contains ('on')) {
    // set moveTo with straight line
    // remove any moveForward
    if (moveForwardFig != false) {
      updateSequence (moveForwardFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // remove any moveDown
    if (moveDownFig != false) {
      updateSequence (moveDownFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // replace any moveTo or curveTo
    //if ((Math.abs(moveX) > 0) || (Math.abs(moveY) > 0)) {
      var movePattern = '['+moveX+','+moveY+']';
      if (moveToFig != false) {
        // replace moveTo HERE!
        updateSequence (moveToFig, movePattern, true);
      } else {
        // add new moveTo
        updateSequence (selectedFigure.id - 1, movePattern, false);
        return;
      }
  } else if (el3.classList.contains ('on')) {
    // set moveTo with curved line
    // remove any moveForward
    if (moveForwardFig != false) {
      updateSequence (moveForwardFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // remove any moveDown
    if (moveDownFig != false) {
      updateSequence (moveDownFig, '', true);
      if (moveToFig != false) moveToFig--;
    }
    // replace any moveTo or curveTo
    //if ((Math.abs(moveX) > 0) || (Math.abs(moveY) > 0)) {
      var movePattern = '('+moveX+','+moveY+')';
      if (moveToFig != false) {
        // replace curveTo HERE!
        updateSequence (moveToFig, movePattern, true);
      } else {
        // add new curveTo
        updateSequence (selectedFigure.id - 1, movePattern, false);
        return;
      }
  } else if (el1.classList.contains ('on')) {
    // set moveForward
    // remove any moveTo
    if (moveToFig != false) {
      updateSequence (moveToFig, '', true);
      if (moveForwardFig != false) moveForwardFig--;
    }
    // replace any moveForward
    if (parseInt(moveX) > 0) {
      if (moveX == 1) {
        var movePattern = '>';
      } else var movePattern = moveX + '>';
      if (moveForwardFig != false) {
        // replace moveForward
        updateSequence (moveForwardFig, movePattern, true);
      } else {
        // add new moveForward
        updateSequence (selectedFigure.id - 1, movePattern, false);
        return;
      }
    } else if (moveForwardFig != false) {
      // remove moveForward
      updateSequence (moveForwardFig, '', true);
    }
  } else {
    // remove moveTo and moveForward
    if (moveToFig != false) {
      updateSequence (moveToFig, '', true);
    }
    if (moveForwardFig != false) {
      updateSequence (moveForwardFig, '', true);
    }
  }
  // set correct subSequence type
  var sel = document.getElementById('subSequenceDirections');
  if (document.getElementById('subSequence').classList.contains ('on')) {
    figures[selectedFigure.id].subSequence = sel.value;
    if (subSequence === false) {
      updateSequence (i, sel.value, false);
    } else {
      updateSequence (subSequence, sel.value, true);
    }
  } else {
    if (subSequence !== false) {
      updateSequence (subSequence, '', true);
      sel.value = userpat.subSequence;
    }
  }

  // set entry extension
  var val = document.getElementById('entryExt-value').value;
  if (val < 0) {
    if (pattern[0] == '-') {
      // don't prepend + for negative entry
      pattern = new Array(1 - val).join(userpat.lineshorten) + pattern;
    } else {
      pattern = new Array(1 - val).join(userpat.lineshorten) + '+' + pattern;
    }
  } else if (val > 0) {
    val = val / 3;
    if (document.getElementById('figEntryButton').classList.contains ('inverted')) {
      // use '-' for negative entry
      pattern = new Array(parseInt(val) + 1).join('-') + pattern;
    } else {
      pattern = new Array(parseInt(val) + 1).join(userpat.longforward) + pattern;
    }      
    pattern = new Array(Math.round((val-parseInt(val))*3) + 1).join(userpat.forward) + pattern;
  }

  // set exit extension
  val = document.getElementById('exitExt-value').value;
  if (val < 0) {
    if (pattern[pattern.length - 1] == '-') {
      // don't prepend + for negative exit
      pattern += new Array(1 - val).join(userpat.lineshorten);
    } else {
      pattern += '+' + new Array(1 - val).join(userpat.lineshorten);
    }
  } else if (val > 0) {
    val = val / 3;
    if (document.getElementById('figExitButton').classList.contains ('inverted')) {
      // use '-' for negative exit
      pattern += new Array(parseInt(val) + 1).join('-');
    } else {
      pattern += new Array(parseInt(val) + 1).join(userpat.longforward);
    }      
    pattern += new Array(Math.round((val-parseInt(val))*3) + 1).join(userpat.forward);
  }

  var axisChange = figures[selectedFigure.id].entryAxisFormB;
  
  // set switchY
  if (document.getElementById('switchY').classList.contains ('on')) {
    pattern += axisChange ? userpat.switchDirX : userpat.switchDirY; 
  }

  // set switchX
  if (document.getElementById('switchX').classList.contains ('on')) {
    pattern += axisChange ? userpat.switchDirY : userpat.switchDirX;
  }

  // when there was a flipYaxis in this figure, add it to the beginning
  // of the pattern
  if (figures[selectedFigure.id].string.indexOf(userpat.flipYaxis) > -1) {
    pattern = userpat.flipYaxis + pattern;
  }
  
  // update comments, including Free (Un)known letter
  // keep this at the end to prevent disturbing other items
  var val = document.getElementById('unknownFigure').value;
  var comments = (val != 0) ? '@' + val : '';

  comments += document.getElementById('comments').value;

  // retrieve original comments
  if (figures[selectedFigure.id].unknownFigureLetter) {
    var oldComments = '@' + figures[selectedFigure.id].unknownFigureLetter;
  } else {
    var oldComments = '';
  }
  oldComments += figures[selectedFigure.id].comments;
  if (!oldComments) oldComments = '';

  if (comments != oldComments) {
  // move back in the figure queue to find comments
    var match = false;
    var i = selectedFigure.id - 1;
    while ((i >= 0) && !figures[i].figNr) {
      var prevFig = figures[i];
      if (prevFig) {
        // find a match for comments
        match = prevFig.string.match(RegExp ('^\\' + userpat.comment +
	        '([^\\' + userpat.comment + ']*)\\' + userpat.comment + '$'));
        if (match) {
          if (comments != '') {
            updateSequence (i, '"' + comments + '"', true, false, false, true);
          } else {
            updateSequence (i, '', true, false, false, true);
          }
          break;
        }
      }
      i--;
    }
    // no match, apply new
    if (!match && (comments != '')) {
      updateSequence (
        selectedFigure.id - 1,
        '"' + comments + '"',
        false,
        false,
        false,
        true);
    }
  }

  // update the sequence with the final pattern
  if (pattern !== string) {
    updateSequence (selectedFigure.id, pattern, true);
  } else if (!noRedraw) {
    updateFigureOptions (selectedFigure.id);
  }
	document.getElementById ('leftBlockContainer').scrollTop = scroll;
}

// updateFigureComments updates the figure coments
function updateFigureComments () {
  if (intervalID.updateFigureComments) {
    window.clearTimeout (intervalID.updateFigureComments);
  }
  intervalID.updateFigureComments = window.setTimeout (function(){
    updateFigure();
    delete intervalID.updateFigureComments;
  }, 100);
}

// latestVersion makes sure the latest version is installed
function latestVersion() {
  
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    // Check for appcache when using http
    if (window.applicationCache) window.applicationCache.update();
  } else {
		// check for update on non-http(s)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://openaero.net/openaero.php?v', true);
    xhr.onload = function() {
      if (compVersion (version, xhr.response) == -1) {
				var banner = document.getElementById('installApp');
				banner.classList.remove ('noDisplay');
				document.getElementById('t_getTheApp').innerHTML =
					sprintf(userText.updateApp, xhr.response);
				if (platform.android) banner.classList.add ('android');
				if (platform.ios) banner.classList.add ('ios');
				banner.classList.add ('update');
				banner.classList.add ('show');
			}
		};
    xhr.send();
  }
}

// preventUnload is used to set a question asking the user if he wants
// to leave OpenAero. Argument is false (no question) or true (question)
function preventUnload (e) {
  e.returnValue = userText.confirmLeave;
  return userText.confirmLeave;
}

// addUpdateListener adds an event listener that checks if a new app
// cache update is available
function addUpdateListener () {
  if (window.applicationCache) {
    window.applicationCache.addEventListener('updateready', function(e) {
      if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        // Swap it in and reload the page to get the new hotness.
        window.applicationCache.swapCache();
        // only reload after confirmation
        var t = storage ? userText.loadNewVersion : userText.loadNewVersionNoCookies;
        confirmBox (t, userText.loadNewVersionTitle, function(){
          sequenceSaved = true;
          // reload the page, sequence will be provided by localStorage
          window.location.reload(true);
        });
      }
    }, false);
  }
}

// checkUpdateDone checks if an update was just done. If so, it presents
// a dialog to the user
function checkUpdateDone() {

  function f (oldVersion) {
    if (!oldVersion) {
      // First install
      
      // check for French browser
      if (navigator.language == 'fr') {
	      if (!document.getElementById('numberInCircle').checked) {
	        document.getElementById('numberInCircle').checked = true;
	        numberInCircle = true;
	      }
	      // change language next, this will also saveSettingsStorage
	      if (document.getElementById('language').value != 'fr') {
	        document.getElementById('language').value = 'fr';
	        changeLanguage ();
	      }
		  }
      // Only show the installed box if not on Chrome. If on Chrome, it
      // will be shown by checkForApp
      // Wait a few seconds to give platform.cordova to be set if applicable
      if ((typeof chrome !== 'undefined') && chrome.fileSystem) chromeApp.active = true;
      if (!chromeApp.active) setTimeout(function(){
				if (!platform.cordova) {
					if (window.location.host) {
						alertBox (
			        {userText: 'installed', params: [window.location.host]},
			        {userText: 'installation'}
			      );
					} else {
						alertBox (
			        {userText: 'installedFile', params: [location.pathname]},
			        {userText: 'installation'}
			      );
					}
				} 
			}, 3000);
      storeLocal ('version', version);
    } else if (oldVersion !== version) {
      // create version update text
      var list = [];
      for (var v in versionNew) {
        if (compVersion (oldVersion, v) < 0) {
          for (var i = 0 ; i < versionNew[v].length; i++) {
            list.push (versionNew[v][i]);
          }
        }
      }
      list.sort (function (a,b) {return b[1]-a[1]});
      var li = '';
      for (var i = 0; i < list.length; i++) {
        if (i === versionNewMax) break;
        li += '<li>' + list[i][0] + '</li>\n';
      }
      alertBox (sprintf(userText.versionNew, oldVersion, version, li));
      // create link for changelog
      document.getElementById('changelog').addEventListener (
        'mousedown',
        function() {helpWindow ('changelog.txt', 'changelog.txt');}
      );
      storeLocal ('version', version);
    }
  }
  
  // this only works when storage is enabled
  if (storage) getLocal ('version', f);
}

// getTheApp shows the banner for getting the app under certain conditions
// Currently only for Android and iOS
function getTheApp () {
	if (!(platform.android || platform.ios)) return;
	
	getLocal ('installAppAsked', function(timestamp) {

		var
			banner = document.getElementById ('installApp'),
			t = parseInt ((new Date()).getTime());

		if (timestamp) { // do not ask the first time
			if (timestamp < (t - 86400 * 7)) { // ask once a week
				storeLocal ('installAppAsked', t);
				banner.classList.remove ('noDisplay');
				if (platform.android) banner.classList.add ('android');
				if (platform.ios) banner.classList.add ('ios');
				// use setTimeout before showing to allow subtle entry
				setTimeout (function(){banner.classList.add ('show')},500);
				setTimeout (function(){removeBanner (banner)}, 15000);
			}
		} else storeLocal ('installAppAsked', 1);
	});
}

// removeBanner hides and then removes banner
function removeBanner (banner) {
	banner.classList.remove ('show');
	setTimeout (function(){banner.classList.add ('noDisplay')}, 2000);
}

// changeSequenceInfo is called whenever any part of the sequence info
// may be changed, including the sequence string
function changeSequenceInfo () {
  // check if sequenceInfo element exists. If not, we may be called from
  // page using API
  if (document.getElementById('sequenceInfo')) {
    // change the web page title to reflect the sequence info
    var title = 'OpenAero - ';
    title += document.getElementById('category').value + ' ';
    title += document.getElementById('program').value + ' ';
    title += document.getElementById('location').value + ' - ';
    title += document.getElementById('date').value + ' - ';
    title += document.getElementById('pilot').value;
    title = title.replace (/- +-/g, '-');
    document.title = title.replace (/[ -]+$/, '');

    // update deprecated "aircraft" field
    document.getElementById('aircraft').value = (
      document.getElementById('actype').value + ' ' +
      document.getElementById('acreg').value).trim();
      
    // create sequence XML
    var xml = '<sequence>\n'
    for (var i = 0; i < sequenceXMLlabels.length; i++) {
      var el = document.getElementById(sequenceXMLlabels[i]);
      if (el) {
				var value = ('value' in el) ? el.value : el.innerText;
	      if (value !== '') {
	        xml += '<' + sequenceXMLlabels[i] + '>' +
	          value.replace (/</g, '&lt;') + '</' +
	          sequenceXMLlabels[i] + '>\n';
	      }
			}
    }
    xml += '</sequence>';
    if (xml != activeSequence.xml) {
      if (activeSequence.addUndo) {
        // add undo and clear redo
        if (activeSequence.xml) {
          activeSequence.undo.push (activeSequence.xml);
          // maximum 100 undos
          while (activeSequence.undo.length > 100) {
            activeSequence.undo.shift();
          }
        }
  
        setUndoRedo ('redo', true);
      }
      // put everything in activeSequence.xml object
      activeSequence.xml = xml;
      // save activeSequence.xml in storage 'sequence'
      storeLocal ('sequence', activeSequence.xml);
    }
    checkInfo();
  }
}

// buildFigureXML creates a well-formatted XML string that holds all
// sequence details. It is later appended at the end of the .seq file 
function buildFigureXML () {
  var ff = document.createElement('figures');
  var figNr = 0;
  figureK = 0;
  for (var i = 0; i < figures.length; i++) {
    aresti = figures[i].aresti;
    k = figures[i].k;
    if (aresti) {
      figNr++;
      var figK = 0;
      var f = ff.appendChild(document.createElement('figure'));
      var nr = f.appendChild(document.createElement('nr'));
      nr.appendChild(document.createTextNode(figNr));
      // add figure letter if applicable
      if (figures[i].unknownFigureLetter) {
        // if rules are loaded, check if letter is allowed accordingly
        if ((figureLetters.indexOf (figures[i].unknownFigureLetter) > -1) ||
          (additionalFig.max && (figures[i].unknownFigureLetter === 'L')) ||
          !rulesActive) {
          var letter = f.appendChild(document.createElement('letter'));
          letter.appendChild(document.createTextNode(figures[i].unknownFigureLetter));
        }
      }

      if (figures[i].superFamily) {
        var sf = f.appendChild(document.createElement('sf'));
        sf.appendChild(document.createTextNode(figures[i].superFamily));
      }

      for (var j = 0; j < aresti.length; j++) {
        var element = f.appendChild(document.createElement('element'));
        var aj = element.appendChild(document.createElement('aresti'));
        aj.appendChild(document.createTextNode(aresti[j]));
        var kj = element.appendChild(document.createElement('k'));
        kj.appendChild(document.createTextNode(k[j]));
        figK += parseInt(k[j]);
      }
      // Adjust figure K for additionals
      if (figures[i].unknownFigureLetter) {
        if (figures[i].unknownFigureLetter == 'L') {
          if (additionals <= additionalFig.max) {
            figK = additionalFig.totalK / additionals;
          } else if (additionalFig.max > 0) {
            figK = additionalFig.totalK / additionalFig.max;
          }
        }
      }
      // Adjust figure K for floatingPoint
      if (figures[i].floatingPoint) {
        figK -= 1;
      }
      var fK = f.appendChild(document.createElement('figk'));
      fK.appendChild(document.createTextNode(figK));
      figureK += figK;
    }
  }
  var ffK = ff.appendChild(document.createElement('figurek'));
  ffK.appendChild(document.createTextNode(figureK));
  if (parseInt(document.getElementById('positioning').value)) {
    var totalK = figureK +
      parseInt(document.getElementById('positioning').value);
  } else var totalK = figureK;
  var tK = ff.appendChild(document.createElement('totalk'));
  tK.appendChild(document.createTextNode(totalK));
  var xml = new XMLSerializer().serializeToString(ff);
  return (xml.replace (/^<figures[^>]*/, '<figures'));
}

// buildSettingsXML creates a well-formatted XML string that holds all
// settings details. It is later appended at the end of the .seq file 
function buildSettingsXML () {
  var key, val, s, node;
  var settings = document.createElement('settings');
  for (var i = 0; i < saveSettings.length; i++) {
    key = saveSettings[i];
    // get the value or, if checkbox, if checked or not
    if (document.getElementById(key).type == 'checkbox') {
      val = document.getElementById(key).checked? true : false;
    } else {
      val = document.getElementById(key).value;
    }
    s = settings.appendChild(document.createElement('setting'));
    node = s.appendChild(document.createElement('key'));
    node.appendChild (document.createTextNode(key));
    node = s.appendChild(document.createElement('value'));
    node.appendChild (document.createTextNode(val));
  }
  return (new XMLSerializer().serializeToString(settings));
}

// changeCombo is executed when a combo box value is changed by user or
// when called by other routine. In the latter case it should always be
// called as changeCombo ('program') to prevent strange effects.
// When noLogo is true, the logo is not changed
function changeCombo(id) {
  function disable (e) {
    e.value = '';
    if (e.id === 'program') {
      e.placeholder = userText.selectCategoryFirst;
    } else {
      e.placeholder = userText.selectRulesFirst;
    }
    e.setAttribute ('disabled', 'disabled');
    e.nextElementSibling.innerHTML = '';
  }
  function enable (e) {
    e.placeholder = '';
    e.removeAttribute ('disabled');
    e.nextElementSibling.innerHTML = userText[e.id];
  }
  
  var rulesActiveSave = rulesActive;
  var rules = document.getElementById('rules');
  var ruleName = getRuleName();
  var category = document.getElementById('category');
  var categoryName = category.value.toLowerCase();
  var program = document.getElementById('program');
  var programName = program.value.toLowerCase();

  if (id === 'rules') {
    // set logo
    if (rulesLogo[ruleName]) selectLogo(rulesLogo[ruleName]);

    // set CIVA or IAC forms default
    iacForms = (ruleName === 'iac') ? true : false;
    if (iacForms) {
      document.getElementById('iacForms').setAttribute('checked', 'checked');
    } else {
      document.getElementById('iacForms').removeAttribute('checked');
    }
    
    // clear category if these rules exist but do not contain the category
    if (seqCheckAvail[ruleName] && !seqCheckAvail[ruleName].cats[categoryName]) {
      category.value = program.value = '';
    }
  }
  
  if ((id === 'rules') || (id === 'category')) {
    // clear program if this category exists but does not contain the program
    if (seqCheckAvail[ruleName] &&
      seqCheckAvail[ruleName].cats[categoryName] &&
      !seqCheckAvail[ruleName].cats[categoryName].seqs[programName]) {
      program.value = '';
    }
  }

  if (rules.value == '') {
    disable (category);
  } else enable (category);
  if (category.value == '') {
    disable (program);
  } else enable (program);

  loadRules();
  
  // Load rules and check against the sequence, return log and display
  // any alerts
  if (rulesActiveSave != rulesActive) {
    var log = checkRules();
    displayAlerts ();
    markFigures ();
    checkInfo ();
  } else var log = false;

  changeSequenceInfo();
  // redraw sequence. May be necessary to update (mini) Form A
  checkSequenceChanged(true);
  // make sure only available figure groups are shown in chooser
  availableFigureGroups();
  return log;
}

// highlight marks part of a text
function highlight (el, start, end) {
	var
		text = el.innerText,
		range = saveSelection(el);

	if (end) {
		var newHTML = text.substr (0, start) +
			'<span class="highlight">' + text.substr (start, (end - start)) +
			'</span>' + text.substr (end);
		if (el.innerHTML !== newHTML) el.innerHTML = newHTML;
		var span = el.getElementsByClassName ('highlight')[0];
		el.scrollTop = parseInt(span.getBoundingClientRect().top -
			el.getBoundingClientRect().top);
	} else if (el.innerHTML != text) el.innerHTML = text;
	if (document.activeElement === el) restoreSelection (el, range); 
}

// saveSelection returns the current selection in containerEl
function saveSelection (containerEl) {

	var
		doc = containerEl.ownerDocument,
		win = doc.defaultView;

	if (!win.getSelection().anchorNode) return {start: 0, end: 0};
	
	var range = win.getSelection().getRangeAt(0);
	var preSelectionRange = range.cloneRange();
	preSelectionRange.selectNodeContents(containerEl);
	preSelectionRange.setEnd(range.startContainer, range.startOffset);
	var start = preSelectionRange.toString().length;

	return {
		start: start,
		end: start + range.toString().length
	};
};

// restoreSelection restores selection savedSel in containerEl
function restoreSelection (containerEl, savedSel) {

	var
		doc = containerEl.ownerDocument,
		win = doc.defaultView,
		charIndex = 0,
		range = doc.createRange();
		
	range.setStart(containerEl, 0);
	range.collapse(true);
	var nodeStack = [containerEl], node, foundStart = false, stop = false;

	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType == 3) {
			var nextCharIndex = charIndex + node.length;
			if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
				range.setStart(node, savedSel.start - charIndex);
				foundStart = true;
			}
			if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
				range.setEnd(node, savedSel.end - charIndex);
				stop = true;
			}
			charIndex = nextCharIndex;
		} else {
			var i = node.childNodes.length;
			while (i--) {
				nodeStack.push(node.childNodes[i]);
			}
		}
	}

	var sel = win.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

// buildLogoSvg will create a logo svg from a provided image string,
// width and height
function buildLogoSvg(logoImage, x, y, width, height) {
  
  function toInt32(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  }

  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("version", "1.2");
  svg.setAttribute("baseProfile", "tiny");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("xmlns:xlink", xlinkNS);
  // svg images are included inline and scaled
  if (logoImage.match(/<svg/)) {
    var
	    parser = new DOMParser(),
	    doc = parser.parseFromString(logoImage, "image/svg+xml"),
	    svgBase = doc.getElementsByTagName('svg')[0],
	    scale = Math.min (width / svgBase.getAttribute('width'),
	      height / svgBase.getAttribute('height')),
	    group = document.createElementNS(svgNS, "g");

    group.setAttribute('transform', 'translate(' + x + ',' + y + 
      ') scale(' + scale.toFixed(4) + ')');
    group.appendChild(svgBase);
    svg.appendChild(group);
  // other images are included through an xlink data url
  } else {
    // find image size and use this to set correct width and height of
    // image, using provided as max
    var img = document.createElement('img');
    img.src = logoImage;
    if (img.width) {
      var scale = Math.min (width / img.width, height / img.height);
      width = parseInt (img.width * scale);
      height = parseInt (img.height * scale);
    }
    drawImage ({x: x, y: y, width: width, height: height,
      preserveAspectRatio: 'xMaxYMax', href: logoImage}, svg);
  }
  svg.setAttribute("class", "logoSvg");
  svg.setAttribute("width", x + width);
  svg.setAttribute("height", y + height);
  return svg;
}

// logoChooser will display the available logos
// and allow for selection of a logo
function logoChooser() {
	// define logo thumbnail width and height
  var width = platform.smallMobile ? 66 : 80;
  var height = platform.smallMobile ? 66 : 80;
  // show the logo chooser container
  var container = document.getElementById('logoChooserContainer');
  container.classList.remove ('noDisplay');
  // clear logo file when present
  var el = document.getElementById('logoFile');
  if (el) el.value = '';
  // Show all the logo images
  container = document.getElementById('chooseLogo');
  // Clean up the container
  while (container.childNodes.length) {
    container.removeChild(container.lastChild);
  }
  for (var logoName in logoImages) {
    var div = document.createElement('div');
    container.appendChild(div);
    div.setAttribute("alt", logoName);
    div.addEventListener ('click', selectLogo, false);
    div.appendChild(buildLogoSvg(logoImages[logoName], 0, 0, width, height));
  }
}

// selectLogo is called when a logo is clicked in the logoChooser and
// will select the correct logo for use
function selectLogo(logo) {
  // get name from alt attribute when called from eventListener
  if (this.getAttribute) logo = this.getAttribute('alt');
  // check if there already was a logo to replace
  var replace = logoImg ? true : false;
  logoImg = logoImages[logo];
  document.getElementById('logo').value = logo;
  if (!replace) drawActiveLogo();
  // move the logo smoothly into place from logoChooser
  if (this.getAttribute) {
    var el = document.getElementById('logoImage');
    var elBox = el.getBoundingClientRect ();
    var thisBox = this.firstChild.getBoundingClientRect ();
    // set transform for new logo. Take into account that the old logo
    // container may have been moved left from view if no logo was
    // active
    this.style.transform = 'translate(' +
	    (((elBox.left > 0) ? elBox.left : (elBox.left + 240)) - thisBox.left) +
      'px,' + (elBox.bottom - thisBox.bottom) + 'px)';
    if (!replace) el.style = 'opacity: 0.001';
    setTimeout (function(){
			if (replace) drawActiveLogo();
      el.style = '';
      hideLogoChooser();
    }, 300);
  }
  changeSequenceInfo();
}

// uploadLogo is used to upload a logo
function uploadLogo (file) {
  logoImages.mylogo = file;
  selectLogo ('mylogo');
}

// drawActiveLogo makes a small thumbnail of the active logo in the
// Sequence info and adds 'remove logo' link
// Start by checking for logoImage element. It may not be present when
// using OpenAero API
function drawActiveLogo() {
  var el = document.getElementById('logoImage');
  if (el) {
    var width = 120; // maximum width
    var height = 60; // maximum height
    el.classList.remove ('noDisplay');
    document.getElementById('activeLogo').classList.remove ('empty');
    document.getElementById('t_chooseLogo').classList.add ('noDisplay');
    // Create logo svg
    var link = document.getElementById('logoImage');
    if (link.firstChild) link.removeChild(link.firstChild);
    link.appendChild(buildLogoSvg(logoImg, 0, 0, width, height));
  
    document.getElementById('removeLogo').classList.remove ('noDisplay');
    document.getElementById('contest').classList.add ('hasLogo');
    return true;
  } else return false;
}

// removeLogo makes it possible to remove the previously chosen logo
function removeLogo() {
  logoImg = false;
  // Remove 'remove logo' link and logo image
  document.getElementById('removeLogo').classList.add ('noDisplay');
  document.getElementById('activeLogo').classList.add ('empty');
  setTimeout (function()
    {
      document.getElementById('logoImage').classList.add ('noDisplay');
      document.getElementById('contest').classList.remove ('hasLogo');
		  // Add choose logo option
		  document.getElementById('t_chooseLogo').classList.remove ('noDisplay');
    }, 300);
  document.getElementById('logo').value = '';
  changeSequenceInfo();
}
  
// parseFiguresFile parses the figures file and stores it in several
// arrays for fast retrieval
function parseFiguresFile () {
  var
	  groupRegex = new RegExp('^F[0-9]'),
	  figGroupSelector = document.getElementById('figureGroup'),
	  figGroupNr = 0,
	  entryExit = '',
	  entryExitSplit = [];
  
  // add the Queue 'figure group' at the beginning
  figGroup[0] = {'family':'*', 'name':userText.figureQueue};
  // add an option for the group to the figure selector
  var option = document.createElement('option');
  option.setAttribute('value', 0);
  option.id = 't_figureQueue';
  option.classList.add ('userText');
  if (figGroupSelector) figGroupSelector.appendChild(option);

  var figMainGroup = '';
  var groupClasses = ['familyA', 'familyB'];
  var groupClass = 1;
  for (var i = 0; i < figs.length; i++) {
    // Clean up the lines
    line = sanitizeSpaces(figs[i]);
    // Split the remainder on the space. Figure group lines and
    // Family 9 should now have two elements, the others three 
    var splitLine = line.split(" ");
    // check if we are dealing with a 'figure group' line
    if (groupRegex.test(line)) {
      // increase figGroupNr counter
      figGroupNr++;
      // parse family and name
      figGroup[figGroupNr] = {
        'family':splitLine[0].replace(/^F/, ''),
        'name':splitLine[1]
      };
      // add an option for the group to the figure selector
      var option = document.createElement('option');
      option.setAttribute('value', figGroupNr);
      option.innerHTML = line.replace(/^F/, '');
      if (figMainGroup != line[1]) {
        figMainGroup = line[1];
        groupClass = 1 - groupClass;
      }
      option.classList.add (groupClasses[groupClass]);
      if (figGroupSelector) figGroupSelector.appendChild(option);
    } else {
      if (splitLine[0]) {
        // Next we split the Aresti and K-factors part
        var arestiK = splitLine[1].split("(")
        var kFactors = arestiK[1].replace(")","").split(":");
        if (!arestiK[1].match(/:/)) kFactors[1] = kFactors[0];
        // Split K factors on the colon; kFactors[0] is for Powered,
        // kFactors[1] is for Gliders
        fig[i] = {
          'aresti':arestiK[0],
          'kpwrd':kFactors[0],
          'kglider':kFactors[1],
          'group':figGroupNr,
          'pattern':splitLine[0]
        };
        // We will extract roll elements for everything but roll figures
        // and (rolling) turns
        if (regexTurn.test(splitLine[0])) {
          // handle (rolling) turns
          theBase = splitLine[0];
          if (theBase in figBaseLookup) {
            figBaseLookup[theBase].push(i);
          } else {
            figBaseLookup[theBase] = [i];
          }
          fig[i].base = theBase;
          fig[i].draw = splitLine[2];
          fig[i].entryExit = fig[i].entryExitGlider = fig[i].entryExitPower =
            theBase.replace (/[^-+]*/g, '').replace (/-/g, 'n').replace (/\+/g, 'N');
        } else if (splitLine.length > 2) {
          // handle everything except (rolling) turns and rolls
          theBase = splitLine[0].replace(regexTurnsAndRolls, '');
          if (theBase in figBaseLookup) {
            figBaseLookup[theBase].push(i);
          } else {
            figBaseLookup[theBase] = [i];
          }
          fig[i].base = theBase;
          fig[i].draw = splitLine[2];
          // Find which rolls are possible in this figure, handle the
          // empty base of rolls on horizontal
          if (theBase.replace(/[\+\-]+/g, '') != '') {
            rollbase = splitLine[0].split(theBase.replace(/[\+\-]+/g, ''));
          } else {
            rollbase = Array(splitLine[0].replace(/[\+\-]+/g, ''));
          }
          rolls = rollbase.join(')').replace(/[\(\+\-]+/g, '').split(')');
          fig[i].rolls = [];
          for (r = 0; r < rolls.length; r++) {
            switch (rolls[r]) {
              case (figpat.fullroll):
                fig[i].rolls[r] = 1;
                break;
              case (figpat.halfroll):
                fig[i].rolls[r] = 2;
                break;
              case (figpat.anyroll):
                fig[i].rolls[r] = 3;
                break;
              case (figpat.spinroll):
	              fig[i].rolls[r] = 4;
	              break;
              case (figpat.longforward):
                fig[i].rolls[r] = 9;
                break;
              default:
                fig[i].rolls[r] = 0;
            }
          }
          // create entry/exit speed and attitude codes
          entryExit = fig[i].draw.replace (/[^dvzmcpro_]/gi, '');
          // assure only half rolls remain
          entryExitSplit = entryExit.split ('_');
          for (var j = 0; j < entryExitSplit.length; j++) {
						// if first roll does not exist, combine this drawing part
						// with the next roll (e.g. +id^-)
						if (fig[i].rolls[0] === 0) {
	            if (fig[i].rolls[j + 1] === 2) entryExitSplit[j] += '^';
						} else {
							if (fig[i].rolls[j] === 2) entryExitSplit[j] += '^';
						}
          }
          // add attitude info
          entryExit = theBase.charAt(0) + entryExitSplit.join('') +
            theBase.charAt(theBase.length - 1);
          // simplify
          entryExit = entryExit.replace (regexSpeedConv.v, 'v').replace (regexSpeedConv.V, 'V');
          
          // getCode gets correct letter code, depending on attitude,
          // aClass (aerobatic class) and entry or exit
          function getCode (att, aClass, ee) {
            if (regexSpeed[aClass][ee].L.test (entryExit)) {
              return (att === '+') ? 'L' : 'l';
            } else if (regexSpeed[aClass][ee].H.test (entryExit)) {
              return (att === '+') ? 'H' : 'h';
            } else return (att === '+') ? 'N' : 'n';
          }
              
          fig[i].entryExitGlider = getCode (theBase[0], 'glider', 'entry') +
            getCode (theBase[theBase.length - 1], 'glider', 'exit');
          fig[i].entryExitPower = getCode (theBase[0], 'power', 'entry') +
            getCode (theBase[theBase.length - 1], 'power', 'exit');
          fig[i].entryExit = fig[i].entryExitPower;
        } else {
        // Handle rolls
          delete (fig[i]); // no fig object for rolls
          rollBase[i] = splitLine[0];
          rollAresti[i] = arestiK[0];
          rollKPwrd[i] = parseInt(kFactors[0]);
          rollKGlider[i] = parseInt(kFactors[1]);
        }
      }
    }
  }
  // select first figure group
  if (figGroupSelector) figGroupSelector.value = 1;
}

// parseRules walks through the rules file to find out which rules
// are available
function parseRules (start) {
  start = start || 0;
  
  var sections = [];
  var year = rulesYear();
  for (var i=start; i<rules.length; i++) {
    // Check for [section]
    if (rules[i][0].match(/[\[\(]/)) {
      sections.push (rules[i].toLowerCase().replace (/[\[\(\]\)]/g, ''));
      var parts = rules[i].match (/^[\[\(]([^ ]+) ([^ ]+) (.+)[\]\)]$/);
      if (parts && parts.length > 3) {
        // remove first, global, match. We don't need it
        parts.shift();
        // Seems like a valid section name. Set correct rule, cat and seq.
        var ruleName = parts[0];
        var rnLower = ruleName.toLowerCase();
        var seqName = parts[parts.length - 1];
        parts.splice(parts.length - 1, 1);
        parts.splice(0, 1);
        var catName = parts.join(' ');
        console.log('Parsing ' + rules[i]);
        // only add square-bracket names to rules
        if (!seqCheckAvail[rnLower]) {
          // remove 'glider-' in display name, if present
          ruleName = ruleName.replace (/^glider-/, '');
          seqCheckAvail[rnLower] = {
            'show': false,
            'name': ruleName,
            'cats':[]
          };
        }
        if (!seqCheckAvail[rnLower].cats[catName.toLowerCase()]) {
          seqCheckAvail[rnLower].cats[catName.toLowerCase()] = {
            'show': false,
            'name': catName,
            'seqs':[]
          };
        }
        if (rules[i][0] == '[') {
          seqCheckAvail[rnLower].cats[catName.toLowerCase()].seqs[seqName.toLowerCase()] = seqName;
          seqCheckAvail[rnLower].show = true;
          seqCheckAvail[rnLower].cats[catName.toLowerCase()].show = true;
        } else {
          seqCheckAvail[rnLower].cats[catName.toLowerCase()].seqs[seqName.toLowerCase()] = '*' + seqName;
        }
        
        // set correct year
        year = rulesYear (ruleName);
      }
    } else if (rules[i].match (/^(demo|programme)[\s]*=/)) {
      // add library
      if (seqName && year) {
        createProgramme (
          year,
          rnLower,
          ruleName,
          catName,
          seqName,
          rules[i].match(/^(demo|programme)[\s]*=[\s]*(.*)$/)[2]
        );
      }
    }
  }

  // verify all "more=" statements refer to existing sections
  for (var i=start; i<rules.length; i++) {
    if (rules[i][0].match(/[\[\(]/)) var currentSection = rules[i];
    var match = rules[i].toLowerCase().match (/^more[\s]*=[\s]*(.*)$/);
    if (match) {
      if (sections.indexOf (match[1]) === -1) {
        console.log ('*** Error: section ' + currentSection +
          ' references non-existing section "' + match[1] + '"');
      }
    }
  }
  updateRulesList();
}

// getRuleName will create the correct, active, ruleName
function getRuleName () {
  return (
    (document.getElementById('class').value === 'glider' ? 'glider-' : '') +
    document.getElementById('rules').value.toLowerCase()
  );
}

// updateRulesList updates the rules field for power or glider
function updateRulesList () {
  var
	  regex = /^glider-/,
	  el = document.getElementById('rulesList'),
	  fragment = document.createDocumentFragment();
	  
  // clear list
  while (el.firstChild) el.removeChild(el.firstChild);
  // build list for powered or glider
  for (ruleName in seqCheckAvail) {
    if ((document.getElementById('class').value === 'glider') === regex.test(ruleName)) {  
      if (seqCheckAvail[ruleName].show) {
        var listItem = document.createElement('li');
        listItem.innerHTML = seqCheckAvail[ruleName].name;
        fragment.appendChild(listItem);
      }
    }
  }
  el.appendChild (fragment);
}

// updateCategoryList updates the category list
function updateCategoryList () {
  var
	  ruleName = getRuleName(),
	  el = document.getElementById('categoryList'),
	  fragment = document.createDocumentFragment();
	  
  while (el.firstChild) el.removeChild(el.firstChild);
  // Populate category list
  if (seqCheckAvail[ruleName]) {
    for (n in seqCheckAvail[ruleName].cats) {
      if (seqCheckAvail[ruleName].cats[n].show) {
        var listItem = document.createElement('li');
        var name = seqCheckAvail[ruleName].cats[n].name;
        listItem.appendChild (document.createTextNode (name));
        fragment.appendChild(listItem);
      }
    }
  }
  el.appendChild (fragment);
}

// updateProgramList updates the program list
function updateProgramList () {
  var
	  ruleName = getRuleName(),
	  categoryName = document.getElementById('category').value.toLowerCase(),
	  el = document.getElementById('programList'),
	  fragment = document.createDocumentFragment();
	  
  while (el.firstChild) el.removeChild(el.firstChild);
  // Populate program list
  if (seqCheckAvail[ruleName] && seqCheckAvail[ruleName].cats[categoryName]) {
    for (n in seqCheckAvail[ruleName].cats[categoryName].seqs) {
      if (seqCheckAvail[ruleName].cats[categoryName].seqs[n][0] != '*') {
        var listItem = document.createElement('li');
        var name = seqCheckAvail[ruleName].cats[categoryName].seqs[n];
        listItem.appendChild (document.createTextNode (name));
        fragment.appendChild(listItem);
      }
    }
  }
  el.appendChild (fragment);
} 

// rulesYear retrieves the year of the rules provided in ruleName.
// with no ruleName provided, the year of rulesYY.js is used
function rulesYear (ruleName) {
  ruleName = ruleName ? '-' + ruleName : '';
  var year = '';
  // find the year of the rules from the file name in index.html
  var scripts = document.getElementsByTagName('script');
  var regex = new RegExp ('rules/rules([0-9][0-9]+)' + ruleName + '\\.js$', 'i');
  for (var i = scripts.length - 1; i >=0; i--) {
    var match = scripts[i].src.match(regex);
    if (match) {
      year = (match[1].length == 2 ? '20' + match[1] : match[1]) + ' ';
      break;
    }
  }
  return year;
}
  
// loadRules loads the rules for the active sequence and stores it in
// several arrays for fast retrieval
function loadRules() {

  var ruleName = getRuleName();
  var catName = document.getElementById('category').value.toLowerCase();
  var programName = document.getElementById('program').value.toLowerCase();
  
  // check if the rules exist. If not, unload rules and return false
  if (!(seqCheckAvail[ruleName] &&
    seqCheckAvail[ruleName].cats[catName] &&
    seqCheckAvail[ruleName].cats[catName].seqs[programName])) {
    if (rulesActive) unloadRules();
    return false;
  }

  var year = rulesYear (ruleName);

  // return true if rules were already loaded
  if (rulesActive === (year + ruleName + ' ' + catName + ' ' + programName)) {
    return true;
  }

	// unload previous rules
	unloadRules();

  document.getElementById ('rulesActive').classList.add ('good');

  // Set parseSection to true to match the global rules
  var parseSection = true;
  var ruleSection = ruleName + ' ' + catName + ' ' + programName;
  ruleSection = ruleSection.toLowerCase();
  console.log ('Loading rules ' + ruleSection);
  var section = [];
  var sectionRegex = /[\[\]\(\)]/g;
  // First clear or preset the variables
  checkAllowRegex = [];
  checkAllowCatId = [];
  checkCatGroup = [];
  checkFigGroup = [];
  checkRule = [];
  defRules = [];
  checkConv = [];
  additionalFig = {'max': 0, 'totalK': 0};
  infoCheck = [];
  figureLetters = '';
  ruleSuperFamily = [];
  ruleSeqCheck = [];
  var refSeqEl = document.getElementById ('referenceSequenceString');
  
  // restore Reference sequence to previous value
  refSeqEl.value = savedReference;
  refSeqEl.removeAttribute ('disabled');
  document.getElementById ('t_referenceSequenceFixed').classList.add ('noDisplay');
  
  // Find the sections
  for (var i = 0; i < rules.length; i++) {
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      var name = rules[i].toLowerCase().replace (sectionRegex, '');
      if (section[name]) {
        // log duplicate sections. Use the last one as this will allow
        // rules import by the user
        console.log('* Warning: duplicate section "' + name +
        '" at rulenr ' + i + '. May be because of rule import. ' +
        'Using last section.');
      }
      section[name] = i;
    }
  }
  // Walk through the rules

  // First run, simplify rule lines and define groups and Groups
  for (var i = 0; i < rules.length; i++) {
    rules[i] = sanitizeSpaces(rules[i]);
    // Check for [section] or (section) to match sequence type specific
    // rules
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      parseSection = (i == section[ruleSection]) ? true : false;
    } else if (parseSection) {
      // when parseSection = true, continue
      // First we remove any spaces around '=', this makes parsing easier
      rules[i] = rules[i].replace(/ *= */g, '=');
      // We also remove spaces around : or ; except when it is a 'why-' line
      if (!rules[i].match(/^why-.+/)) {
        rules[i] = rules[i].replace(/ *: */g, ':');
        rules[i] = rules[i].replace(/ *; */g, ';');
      }
      if (rules[i].match(/^more=/)) {
        // Apply 'more' rules
        var name = rules[i].replace('more=', '').toLowerCase();
        if (section[name]) {
          i = section[name];
          ruleSection = false; // don't go over this section again!
        }
      } else if (rules[i].match(/^group-/)) {
        // Apply 'group' rules => single catalog id match
        var newGroup = rules[i].replace(/^group-/, '').split('=');
        checkCatGroup[newGroup[0]] = [];
        checkCatGroup[newGroup[0]].regex = RegExp(newGroup[1] + '[0-9\.]*', '');
      } else if (rules[i].match(/^Group-/)) {
        // Apply 'Group' rules => full figure (multiple catalog id) match
        var newGroup = rules[i].replace(/^Group-/, '').split('=');
        checkFigGroup[newGroup[0]] = [];
        // when regex ends with $, assume it's fully formatted.
        // Otherwise, add catch all
        if (newGroup[1].slice(-1) === '$') {
          checkFigGroup[newGroup[0]].regex = RegExp(newGroup[1], 'g');
        } else {
          checkFigGroup[newGroup[0]].regex = RegExp(newGroup[1] + '[0-9\. ]*', 'g');
        }
      }
    }
  }
  
  parseSection = true;
  ruleSection = (ruleName + ' ' + catName + ' ' + programName).toLowerCase();

  // Second run, add all other rules
  for (var i = 0; i < rules.length; i++) {
    // Check for [section] or (section) to match sequence type specific rules
    if ((rules[i][0] == '[') || (rules[i][0] == '(')) {
      parseSection = (i == section[ruleSection]) ? true : false;
    } else if (parseSection) {
      // when parseSection = true, continue
      if (rules[i].match(/^conv-[^=]+=/)) {
        // Apply 'conv' rules
        var convName = rules[i].match(/^conv-([^=]+)/)[1];
        // log duplicate conversions, use latest
        if (checkConv[convName]) {
          console.log('* Error: duplicate conversion "' + convName +
            '" at rulenr ' + i);
        }
        checkConv[convName] = [];
        var convRules = rules[i].match(/^conv-[^=]+=(.*)$/)[1].split(';');
        for (var j = 0; j < convRules.length; j++) {
          var c = convRules[j].split('=');
          // create regex, make sure it matches to the end
          checkConv[convName].push ({
            'regex': new RegExp(c[0] + '.*', 'g'),
            'replace': c[1]
          });
        }
      } else if (rules[i].match(/^more=/)) {
        // Apply 'more' rules
        var name = rules[i].replace('more=', '').toLowerCase();
        if (section[name]) {
          i = section[name];
          ruleSection = false; // don't go over this section again!
        } else {
          console.log ('*** Error: rule section "' + name +
            '" does not exist');
        }
      } else if (rules[i].match(/^allow=/)) {
	      // Apply 'allow' rules
        var newCatLine = rules[i].replace(/^allow=/, '');
        var newCat = newCatLine.match(/^[^\s]*/g);
        var newRules = newCatLine.replace(newCat, '').split(';');
        for (var j = 0; j<newRules.length; j++) {
          newRules[j] = newRules[j].replace(/^\s+|\s+$/g, '');
        }
        checkAllowRegex.push ({'regex':RegExp(newCat, ''), 'rules':newRules});
      } else if (rules[i].match(/^allow-defrules=/)) {
	      // Apply 'allow-defrules' rules
        var newCatLine = rules[i].replace(/^allow-defrules=/, '');
        defRules = newCatLine.replace(/[\s]+/g, '').split(';');
      } else if (rules[i].match(/^[0-9]+\./)) {
        // Apply figure number rules
        // The key of checkAllowCatId is equal to the figure number
        // The value is an array of rules that have to be applied
        var newCatLine = rules[i];
        var newCat = newCatLine.match(/^[^\s\(]*/g)[0];
        // Extract in the array newK the specified K if any
        var newK = newCatLine.match(/\([0-9,:\s]*\)/);	  
        if (newK) {
          newCatLine = newCatLine.replace(newK[0], '');
		      // change from ':' to ',' is not necessary since rules file
		      // doesn't mix powered and glider
          newK = newK[0].replace(/[\(\)\s]*/g,'').split(',');
        } 
        // Create an array with rules that have to be applied to the figure
        var newRules = newCatLine.replace(newCat, '').replace(/[\s]+/g, '').split(';');
        // When there are no rules we want an empty array, whereas split
        // provides an array with one empty string
        if (newRules[0] == '') newRules = [];
        // Check if the figure string applies to multiple figures, such as 1.1.1.1-4
        // If so, make a new checkAllowCatId for each figure
        var multiple = newCat.match(/[0-9]+\-[0-9]+$/);
        if (multiple) {
          multiple = multiple[0];
          for (var j = multiple.split('-')[0]; j < (parseInt(multiple.split('-')[1]) + 1); j++) {
            checkAllowCatId[newCat.replace(multiple, '') + j] = newRules;
          if (newK && (newK[j - multiple.split('-')[0]] != '')) {
            var i_fig = aresti2ind(newCat.replace(multiple, '') + j,0) ;
            while (i_fig < 0) {
              rule_K.push({'i_fig':-i_fig,'new_K':newK[j - multiple.split('-')[0]]}) ;
              i_fig = aresti2ind(newCat,-i_fig) ;
            } 
            rule_K.push({'i_fig':i_fig,'new_K':newK[j - multiple.split('-')[0]]}) ;
            }
          }
        } else {
          checkAllowCatId[newCat] = newRules;
          if (newK) {
          var i_fig = aresti2ind(newCat,0) ;
          while (i_fig < 0) {
            rule_K.push({'i_fig':-i_fig,'new_K':newK[0]}) ;
            i_fig = aresti2ind(newCat,-i_fig) ;
          } 
            rule_K.push({'i_fig':i_fig,'new_K':newK[0]}) ;			
          }
        }
      } else if (rules[i].match(/[^-]+-min=\d+$/)) {
      // Apply [group]-min rules
        var group = rules[i].replace(/-min/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].min = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].min = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-max=\d+$/)) {
      // Apply [group]-max rules
        var group = rules[i].replace(/-max/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].max = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].max = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-repeat=\d+$/)) {
      // Apply [group]-repeat rules
        var group = rules[i].replace(/-repeat/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].repeat = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].repeat = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-totrepeat=\d+$/)) {
      // Apply [group]-totrepeat rules
        var group = rules[i].replace(/-totrepeat/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].totrepeat = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].totrepeat = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-minperfig=\d+$/)) {
      // Apply [group]-minperfig rules
        var group = rules[i].replace(/-minperfig/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].minperfig = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].minperfig = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-maxperfig=\d+$/)) {
      // Apply [group]-maxperfig rules
        var group = rules[i].replace(/-maxperfig/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].maxperfig = parseInt(group[1]);
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].maxperfig = parseInt(group[1]);
      } else if (rules[i].match(/[^-]+-name=.+$/)) {
      // Apply [group]-name and seqcheck-name rules
        var group = rules[i].replace(/-name/, '').split('=');
        if (checkCatGroup[group[0]]) checkCatGroup[group[0]].name = group[1];
        if (checkFigGroup[group[0]]) checkFigGroup[group[0]].name = group[1];
        if (ruleSeqCheck[group[0]]) ruleSeqCheck[group[0]].name = group[1];
      } else if (rules[i].match(/[^-]+-name_[a-z]{2}=.+$/)) {
      // Apply [group]-name and seqcheck-name rules
        var group = rules[i].replace(/-name_[a-z]{2}/, '').split('=');
        if (checkCatGroup[group[0]]) {
          checkCatGroup[group[0]][rules[i].match(/name_[a-z]{2}/)[0]] = group[1];
        }
        if (checkFigGroup[group[0]]) {
          checkFigGroup[group[0]][rules[i].match(/name_[a-z]{2}/)[0]] = group[1];
        }
        if (ruleSeqCheck[group[0]]) {
          ruleSeqCheck[group[0]][rules[i].match(/name_[a-z]{2}/)[0]] = group[1];
        }
      } else if (rules[i].match(/-[^-]+-rule=.+$/)) {
        // apply rulebook references
        var part = rules[i].match (/^([^-]+)-([^-]+)-rule=(.*)$/, '');
        if (checkCatGroup[part[1]] && checkCatGroup[part[1]][part[2]]) {
          if (!checkCatGroup[part[1]].rule) checkCatGroup[part[1]].rule = [];
          checkCatGroup[part[1]].rule[part[2]] = part[3];
        }
        if (checkFigGroup[part[1]] && checkFigGroup[part[1]][part[2]]) {
          if (!checkFigGroup[part[1]].rule) checkFigGroup[part[1]].rule = [];
          checkFigGroup[part[1]].rule[part[2]] = part[3];
        }
      } else if (rules[i].match(/-rule=.+$/)) {
        var newRuleName = rules[i].match(/^[^-]+/)[0];
        if (checkRule[newRuleName]) {
          checkRule[newRuleName].rule = rules[i].replace(/^[^=]+=/, '');
        } else if (ruleSeqCheck[newRuleName]) {
          ruleSeqCheck[newRuleName].rule = rules[i].replace(/^[^=]+=/, '');
        }
      } else if (rules[i].match(/^rule-[^=]+=.+/)) {
      // Apply rule-x rules
        var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^rule-/, '');
        var checkRuleParts = rules[i].replace('rule-'+newRuleName+'=', '');
        var colonPos = checkRuleParts.indexOf(':');
        var check = checkRuleParts.substring(colonPos + 1);
        if (check.match(/^</)) {
          checkRule[newRuleName] = {
            'conv':checkRuleParts.substring(0,colonPos),
            'less':parseInt(check.match(/^<(.*)/)[1])};
          //console.log (checkRule[newRuleName].less);
        } else if (check.match(/^\+</)) {
          checkRule[newRuleName] = {
            'conv':checkRuleParts.substring(0,colonPos),
            'totalLess':parseInt(check.match(/^\+<(.*)/)[1])};
          //console.log (checkRule[newRuleName].totalLess);
        } else {
          checkRule[newRuleName] = {
            'conv':checkRuleParts.substring(0,colonPos),
            'regex':RegExp(checkRuleParts.substring(colonPos + 1), 'g')};
        }
      } else if (rules[i].match(/^why-[^=]+=.+/)) {
        // Apply why-x rules
        var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why-/, '');
        if (checkRule[newRuleName]) {
          checkRule[newRuleName].why = rules[i].replace(/^[^=]+=/, '');
        }
      } else if (rules[i].match(/^why_[a-z]{2}-[^=]+=.+/)) {
        // Apply why_cc-x rules where cc = country code
        var newRuleName = rules[i].match(/[^=]+/)[0].replace(/^why_[a-z]{2}-/, '');
        if (checkRule[newRuleName]) {
          checkRule[newRuleName][rules[i].match(/^why_[a-z]{2}/)[0]] = rules[i].replace(/^[^=]+=/, '');
        }
      } else if (rules[i].match(/^floating-point/)) {
        // Apply floating-point rules
        checkCatGroup.floatingPoint = rules[i].match(/[0-9]+/)[0];
      } else if (rules[i].match(regexRulesAdditionals)) {
        // apply Additionals rules
        var match = rules[i].match(regexRulesAdditionals);
        additionalFig.max = parseInt(match[2]);
        additionalFig.totalK = parseInt(match[3]);
      } else if (rules[i].match(/^posnl/)) {
        // load positioning and harmony K
        // Editing is disabled and harmony hidden when 0
        var pos = rules[i].match(/[0-9+]+/)[0].split('+');
        var el = document.getElementById('positioning');
				el.value = parseInt(pos[0]) || 0;
        el.setAttribute ('disabled', true);
        var el = document.getElementById('harmony');
				el.value = parseInt(pos[1]) || 0;
        el.setAttribute ('disabled', true);
        if (el.value == 0) {
					document.getElementById ('harmonyField').classList.add ('hidden');
				}
      } else if (rules[i].match(/^infocheck[ ]*=/)) {
        // define fields that should be checked for not being empty when
        // saving or printing a sequence
        infoCheck = rules[i].replace(/ /g, '').match(/=(.*)/)[1].split(';');
      } else if (rules[i].match(/^figure-letters[ ]*=/)) {
        // define Figure Letters
        figureLetters = rules[i].replace(/ /g, '').match(/=(.*)/)[1];
      } else if (rules[i].match(/^sf[ ]*=/)) {
        // define Super Families
        var val = rules[i].replace(/ /g, '').match(/=(.*)/)[1];
        if (superFamilies[val.toLowerCase()]) {
          ruleSuperFamily = superFamilies[val.toLowerCase()];
        } else {
          var families = val.split(';');
          for (var j = 0; j < families.length; j++) {
            var regex = new RegExp (families[j].split(':')[0]);
            var fam = families[j].split(':')[1];
            ruleSuperFamily.push ([regex, fam]);
          }
        }
      } else if (rules[i].match(/^seqcheck-/)) {
        var newRuleName = rules[i].split('=')[0].replace(/^seqcheck-/, '');
        var regex = new RegExp (rules[i].split('=')[1]);
        ruleSeqCheck[newRuleName] = {'regex' : regex};
      } else if (rules[i].match (/^reference[\s]*=/)) {
        // load reference sequence
        refSeqEl.value = rules[i].match (/^reference[\s]*=[\s]*(.*)$/)[1];
        refSeqEl.setAttribute ('disabled', true);
        document.getElementById ('t_referenceSequenceFixed').classList.remove ('noDisplay');
      }
    }
  }
  
  // Ajout GG 2018 checkAllowRegex start
	if (checkAllowRegex) {
    for (var i = 0 ; i < checkAllowRegex.length ; i++) {
			for (var j in fig) {
				if (fig[j].aresti &&
					checkAllowRegex[i].regex.test(fig[j].aresti) &&
					!(fig[j].aresti in checkAllowCatId)) {
						checkAllowCatId[fig[j].aresti] =
							(checkAllowRegex[i].rules.length == 0) ? [] : checkAllowRegex[i].rules;
						}
		  }
      for (var j in rollAresti) {
				if (checkAllowRegex[i].regex.test(rollAresti[j]) &&
					!(rollAresti[j] in checkAllowCatId)) {
					checkAllowCatId[rollAresti[j]] = [];
				}
	    }
	  }
	}
	// Ajout GG 2018 checkAllowRegex end

  // set rules active
  rulesActive = year + ruleName + ' ' + catName + ' ' + programName;

  set_rule_K();  // Modif GG v2016.1.4 (Change K if needed). To prevent any K changes, just comment this line.

  if (figureLetters) {
    // show reference sequence link
    document.getElementById ('t_referenceSequence').classList.remove ('noDisplay');
  } else {
    // hide link
    document.getElementById ('t_referenceSequence').classList.add ('noDisplay');
  }

  // set CIVA or IAC forms default
  iacForms = (ruleName === 'iac') ? true : false;
  if (iacForms) {
    document.getElementById('iacForms').setAttribute('checked', 'checked');
  } else {
    document.getElementById('iacForms').removeAttribute('checked');
  }

  // update reference sequence
  changeReferenceSequence(true);

	// by default, disable "Print Super Family", but enable change
	var el = document.getElementById('printSF');
	el.checked = false;
	el.disabled = false;
	// enable when rules with sf definition active and disable change
	if (rulesActive && ruleSuperFamily.length) {
		el.checked = true;
		el.disabled = true;
	}
        
  return true;
}

// Modif GG v2016.1.4 Start

// write_log_fig() Writes fig content to console log. This is just for debug.
function write_log_fig() {
  newK_string = '' ;
  var ggg = 0 ;
  for (var gg in fig) {
    if ((fig[gg].aresti) && (fig[gg].next)) {
      newK_string = newK_string + gg + '\t' + fig[gg].aresti + ' ' +
        fig[gg].base + '     \tpowered(' + fig[gg].kpwrd +
        ')\tglider(' + fig[gg].kglider + ')\tnext : ' + fig[gg].next +
        '\n' ; ggg++ ;
    }
  }
  console.log('Fig (' + aresti_K_class + ') , ' + ggg + ' chained lines : \n' + newK_string ) ;
}

// reset_aresti_K reset back K in fig to aresti K when changed in a rule file
function reset_aresti_K() {
  if (Object.keys(aresti_K).length != 0) {
    for (var key in aresti_K) {
      fig[aresti_K[key].i_fig][aresti_K_class] = aresti_K[key].saved_K;
      delete (fig[aresti_K[key].i_fig].arestiK);
    }
    aresti_K = [] ;
  }
}

// set_rule_K Set K in fig when changed in a rule file and reset it back to aresti K
// set_rule_K is called each time new rules are loaded (at the end of loadrules)
// So far only the change of K for powered has been tested, not the change for glider.
function set_rule_K() {
  // Next line code is just for debug.
//  console.log('set_rule_K() rulesActive = ' + rulesActive + ' last_class = ' + aresti_K_class + ' class = ' + document.getElementById('class').value);
  // First we reset fig with aresti K that have been changed if any
  reset_aresti_K() ;
  // Then, if needed, we set fig with the new K from rule and save aresti K in aresti_K
  if (rule_K.length != 0) {
    aresti_K_class = (document.getElementById('class').value == 'powered') ? 'kpwrd' : 'kglider' ;
    var debug = '' ;
    for (var i in rule_K) {
//      debug = debug + '\n' + rule_K[i].i_fig + '\tfig : ' + fig[rule_K[i].i_fig].aresti + ' (' + rule_K[i].new_K + ') \tau lieu de ' + fig[rule_K[i].i_fig][aresti_K_class];
      aresti_K[fig[rule_K[i].i_fig].aresti] = {
        'i_fig'   : rule_K[i].i_fig,
        'saved_K' : fig[rule_K[i].i_fig][aresti_K_class]
      };
      fig[rule_K[i].i_fig][aresti_K_class] = rule_K[i].new_K;
      fig[rule_K[i].i_fig].arestiK = fig[rule_K[i].i_fig][aresti_K_class];
    }
    console.log('set_rule_K() : ' + rule_K.length + ' K changed for ' + aresti_K_class + ' :' + debug);
    rule_K = [] ;
//write_log_fig() ;		// just for debug
  }
	// If figure chooser is displayed while cat is changed, the figure
	// chooser K needs to be updated.
  if (document.getElementById('figureSelector').classList.contains('active')) changeFigureGroup();
}

// aresti2ind returns the index of the passed aresti code in the fig array
// When multiple instances exist in fig, the tag next is added to fig
// array for chaining all these instances.
// * fig.next is set to the index of the next instance with the same
//   aresti value.
// * fig.next is set to -1 for the last instance or if there is no other
// instance.
// The chaining for an aresti code is built once the first time this
// aresti code is looked for.
// The return index is set to -index if there is an other instance with 
// the same aresti code in fig.

// This is used for replacing figure K's for certain Aresti figures from
// rule files
function aresti2ind(aresti,start) {
  if (start == 0) {
    var previous = 0 ;
    var ind = false ;
    for (var i in fig) if (fig[i].aresti == aresti) {
      if (fig[i].next) {  	// linkage processed. Returns -fig_index if linked and fig_index if otherwise. 
        ind = (fig[i].next == -1) ? i : -i ; 
        break ;
      } else { 		// Built the linkage if any.
        if (previous != 0) { fig[previous].next = i ; if (!ind) ind = -previous ; }
        previous = i ;
      }
    }
    if (previous != 0) {
      fig[previous].next = -1 ;
      if (!ind) ind = previous ; 
    }
  } else {
    ind = (fig[fig[start].next].next == -1) ? fig[start].next : -fig[start].next ;
  }
  return ind ;
}
 
// unloadRules will set rules to inactive and do some checks
function unloadRules () {
  console.log('Clearing rules');
  
  reset_aresti_K() ; // reset aresti K if needed

	// by default, disable "Print Super Family", but enable change
	var el = document.getElementById('printSF');
	el.checked = false;
	el.disabled = false;

  rulesActive = false;
  document.getElementById ('rulesActive').classList.remove ('good');
  // remove disable property of positioning and harmony
  document.getElementById('positioning').removeAttribute ('disabled');
	document.getElementById('harmony').removeAttribute ('disabled');
	if (sportingClass.value !== 'powered') {
		document.getElementById ('harmonyField').classList.remove ('hidden');
	}
  // update sequence
  checkSequenceChanged(true);
  // hide reference sequence button
  document.getElementById ('t_referenceSequence').classList.add ('noDisplay');
  // make sure only available figure groups are shown in chooser
  availableFigureGroups();
  // update figure chooser
  changeFigureGroup ();
}
  
// checkRules will check a complete sequence against the loaded rules
// and produce alerts where necessary.
// The Aresti list according description in allowed.js is in the array
// figCheckLine
// A log array is returned
function checkRules () {
  
  /* why creates the correct 'why' string. Priority is:
   1) current language
   2) no language
   3) English */
  function why (rule) {
    var language = document.getElementById('language').value;
    if (checkRule[rule]['why_' + language]) {
      return checkRule[rule]['why_' + language];
    } else if (checkRule[rule].why) {
      return checkRule[rule].why;
    } else if (checkRule[rule].why_en) {
      return checkRule[rule].why_en;
    } else return '';
  }
  
  // var t = Date.now(); // used for checking execution time. Typical less than 50ms
  
  var
	  figNr = 0,
	  figureK = 0,
	  additionals = 0,
	  groupMatch = [],
	  figCount = [],
	  elemCount = [],
	  log = [],
	  logLine = '',
	  errFigs;
  
  log.push ('Testing sequence:' + activeSequence.text);
  
  // first we check for rules that are ALWAYS valid, i.e. Aresti
  // Catalogue rules
  for (var i = 0; i < figures.length; i++) {
    var seqNr = figures[i].seqNr;
    if (seqNr) {
      // some alerts are disabled when nonArestiRolls is checked
      if (!document.getElementById('nonArestiRolls').checked) {
        // check for more than two roll elements on a roll position
        // Aresti Catalogue Part I - 17
        if (figCheckLine[seqNr].replace(/[^,; ]/g, '').match(/[,;][,;]/)) {
          checkAlert (userText.alert.maxTwoRotationElements,
          false,
          seqNr,
          'Aresti Catalogue');
        }
        // check for same direction same type unlinked rolls
        // Aresti Catalogue Part I - 19
        if (regexUnlinkedRolls.test(figCheckLine[seqNr])) {
          checkAlert (userText.alert.unlinkedSameNotAllowed,
          false,
          seqNr,
          'Aresti Catalogue');
        }
        // check if a spin is preceded by another roll element
        // Aresti Catalogue 27
        if (figCheckLine[seqNr].match(/[,;]9\.1[12]\./)) {
          checkAlert (userText.alert.spinFirst,
          false,
          seqNr,
          'Aresti Catalogue');
        }
      }
      // check if there is a roll on family 1.1.1
      // Aresti Catalogue 7.2
      if (figCheckLine[seqNr].match(/^1\.1\.1[^0]+0\.0\.0\.0$/)) {
        checkAlert (userText.alert.family111RollMissing,
        false,
        seqNr,
        'Aresti Catalogue');
      }
    }
  }
  
  // see if there are active rules. If not, return
  if (rulesActive) {
    log.push ('Rules: ' + rulesActive);
  } else {
    log.push ('Rules: no');
    return log;
  }
  
  for (var i = 0; i < figures.length; i++) {
    var aresti = figures[i].aresti;
    if (aresti) {
      var k = figures[i].k;
      var figString = figCheckLine[figures[i].seqNr];
      figNr++;
      if (aresti.length > 1) {
        var checkLine = figString.replace(aresti[0] + ' ', '');
      } else {
        var checkLine = '';
      }
      var a = '';
      var checkArray = [];
      for (var ii = 0; ii < checkLine.length; ii++) {
        if (checkLine[ii].match(/[ ,;]/)) {
          checkArray.push(a);
          checkArray.push(checkLine[ii]);
          a = '';
        } else {
          a += checkLine[ii];
        }
      }
      checkArray.push(a);

      // format thisFig for logging
      var thisFig = figString.replace(/;/g, ',');
      for (var j = 0; j < aresti.length; j++) {
        var regex = new RegExp ('(' + aresti[j].replace(/\./g, '\\.') + ')( |,|$)');
        thisFig = thisFig.replace(regex, '$1(' + k[j] + ')$2');
      }
      log.push ('========= Figure #' + figNr + ': ' + thisFig);
      // Check if the figure is an additional
      if (figures[i].additional) {
        additionals++;
        log.push ('is additional? True');
      } else {
        log.push ('is additional? False');
        var figK = 0;
        var groupFigMatch = [];
        // Walk through the elements of the figure
        if (figCount[aresti[0]]) {
          figCount[aresti[0]]++;
        } else figCount[aresti[0]] = 1;
        log.push ('Group-combined: Count=' + figNr + ' Fig count=' +
          figCount[aresti[0]]);
        elemCount = [];
        for (var j = 0; j < aresti.length; j++) {
          log.push ('---- Element: ' + aresti[j]);
          figK += parseInt(k[j]);
          figureK += parseInt(k[j]);
          if (elemCount[aresti[j]]) {
            elemCount[aresti[j]]++;
          } else elemCount[aresti[j]] = 1;
          log.push('Group-k: Count=' + figureK + ' Elem count=' +
            elemCount[aresti[j]]);
          // Check all group rules on all elements
          for (group in checkCatGroup) {
            if ((group != 'k') && (group != 'floatingPoint')) {
              var match = aresti[j].match(checkCatGroup[group].regex);
              if (match) {
                if (!groupFigMatch[group]) groupFigMatch[group] = [];
                groupFigMatch[group].push(match[0]);
                if (!groupMatch[group]) groupMatch[group] = [];
                groupMatch[group].push({'match':match[0], 'fig':figNr});
                log.push ('group-' + group +
                  ': Count=' + groupFigMatch[group].length +
                  ' Elem count=' + elemCount[aresti[j]]);
              }
              // Do checks after the last aresti code of the figure has been processed
              if (j == (aresti.length - 1)) {
                if (groupFigMatch[group]) {
                  log.push ('group-' + checkCatGroup[group].name +
                    ': Count=' + groupFigMatch[group].length +
                    ' Elem count=' + elemCount[aresti[j]]);
                  if (checkCatGroup[group].minperfig &&
	                  (groupFigMatch[group].length < checkCatGroup[group].minperfig)) {
										if (('maxperfig' in checkCatGroup[group]) &&
											(checkCatGroup[group].minperfig === checkCatGroup[group].maxperfig)) {
											checkAlert(group, 'exactlyperfig');
										} else checkAlert(group, 'minperfig', figNr);
                    log.push('Minimum of ' + checkCatGroup[group].minperfig + ' elements of this group not reached');
                  }
                  if (checkCatGroup[group].maxperfig && (groupFigMatch[group].length > checkCatGroup[group].maxperfig)) {
                    checkAlert(group, 'maxperfig', figNr);
                    log.push('Maximum of ' + checkCatGroup[group].maxperfig + ' elements of this group exceeded');
                  }
                }
              }
            }
          }
          // Check for specific allowed figures if the checkAllowCatId
          // object is not empty
          if (Object.keys(checkAllowCatId).length > 0) {
            //log.push ('Checking for specific allowed figures');
            if (!(aresti[j] in checkAllowCatId)) {
              checkAlert (aresti[j], 'notAllowed', figNr);
              //log.push ('Not allowed:' + aresti[j]);
            }
          }
        }
        // Run rule checks on specific allowed figures if the
        // checkAllowCatId object is not empty
        if (Object.keys(checkAllowCatId).length > 0) {
          //log.push ('Checking rules on specific allowed figures');
          var arestiNr = figString.split(' ')[0];
          //console.log(arestiNr);
          if ((arestiNr in checkAllowCatId) && (checkAllowCatId[arestiNr][0] !== '')) {
            //log.push('Allowed base figure:' + arestiNr);
            // Apply rules to the figure
            // Run the checks on the rolls

            for (var ii = 0; ii < checkAllowCatId[arestiNr].length; ii++) {
              // copy checkArray to check
              var check = checkArray.slice(0);
              // forElement may be used to add element number to 'why'
              var forElement = '';
              var rule = checkAllowCatId[arestiNr][ii];
              log.push ('-basefig rule: ' + rule);
              // check if this is a rule of form rule:nr
              var ruleSplit = rule.split(':');
              rule = ruleSplit[0];
              // if it is a rule of form rule:nr, only put this roll
              // element in check
              if (ruleSplit[1]) {
                var rollNr = 1;
                check = [];
                for (var m = 0; m < checkArray.length; m++) {
                  if (rollNr == ruleSplit[1]) {
                    if (checkArray[m] == ' ') break;
                    check.push (checkArray[m]);
                  } else {
                    if (checkArray[m] == ' ') rollNr++;
                  }
                }
                forElement = userText.forElement + ruleSplit[1];
              }
              // Apply conversions to the Aresti number before checking the rule
              if (checkRule[rule].conv) {
                var conversion = checkRule[rule].conv;
                log.push ('Apply: ' + checkRule[rule].conv);
                logLine = 'Converted: ' + check.join('') + ' => ';
                for (var l = 0; l < checkConv[conversion].length; l++) {
                  for (var m = 0; m < check.length; m++) {
                    if (!check[m].match(/[ ,;]/)) {
                      check[m] = check[m].replace(checkConv[conversion][l].regex,
                      checkConv[conversion][l].replace);
                    }
                  }
                }
                checkLine = check.join('');

                log.push (logLine + checkLine);
              }
              if (checkRule[rule].regex) {
                if (checkLine.match(checkRule[rule].regex)) {
                  checkAlert (why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
                  log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                }
              } else if (checkRule[rule].less) {
                var sum = 0;
                for (var l = check.length - 1; l >= 0; l--) {
                  if (check[l].match(/^[0-9]/)) {
                    sum += parseInt (check[l]);
                  }
                  if ((check[l] == ' ') || (l == 0)) {
                    if (sum >= parseInt (checkRule[rule].less)) {
                      checkAlert (why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                    }
                    sum = 0;
                  }
                }
              } else if (checkRule[rule].totalLess) {
                var sum = 0;
                for (var l = check.length - 1; l >= 0; l--) {
                  if (check[l].match(/^[0-9]/)) {
                    sum += parseInt (check[l]);
                  }
                }
                if (sum >= parseInt (checkRule[rule].totalLess)) {
                  checkAlert (why(rule) + forElement, 'rule', figNr, checkRule[rule].rule);
                  log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why + forElement);
                }
              }
              
            }
            // Check default rules when applicable
            if (defRules != []) {
              for (k = 0; k < defRules.length; k++) {
                // copy checkArray to check
                var check = checkArray.slice(0);
                
                var checkLine = figString.replace(arestiNr + ' ', '');
                rule = defRules[k];
                // check if this is a rule of form rule:nr
                var ruleSplit = rule.split(':');
                if ((ruleSplit[1] === j) || (ruleSplit.length == 1)) {
                  rule = ruleSplit[0];
  
                  log.push ('-basefig rule: ' + rule);
                  // Apply conversions to the Aresti number before checking the rule
                  if (checkRule[rule].conv) {
                    var conversion = checkRule[rule].conv;
                    log.push ('Apply: ' + checkRule[rule].conv);
                    logLine = 'Converted: ' + checkLine + ' => ';
                    for (var l = 0; l < checkConv[conversion].length; l++) {
                      for (var m = 0; m < check.length; m++) {
                        if (!check[m].match(/[ ,;]/)) {
                          check[m] = check[m].replace(checkConv[conversion][l].regex,
                          checkConv[conversion][l].replace);
                        }
                      }
                    }
                    checkLine = check.join('');
                    log.push (logLine + checkLine);
                  }
                  if (checkRule[rule].regex) {
                    if (checkLine.match(checkRule[rule].regex)) {
                      checkAlert (why(rule), 'rule', figNr, checkRule[rule].rule);
                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                    }
                  } else if (checkRule[rule].less) {
                    var sum = 0;
                    for (var l = check.length - 1; l >= 0; l--) {
                      if (check[l].match(/^[0-9]/)) {
                        sum += parseInt (check[l]);
                      }
                      if ((check[l] == ' ') || (l == 0)) {
                        if (sum >= parseInt (checkRule[rule].less)) {
                          checkAlert (why(rule), 'rule', figNr, checkRule[rule].rule);
                          log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                        }
                        sum = 0;
                      }
                    }
                  } else if (checkRule[rule].totalLess) {
                    var sum = 0;
                    for (var l = check.length - 1; l >= 0; l--) {
                      if (check[l].match(/^[0-9]/)) {
                        sum += parseInt (check[l]);
                      }
                    }
                    if (sum >= parseInt (checkRule[rule].totalLess)) {
                      checkAlert (why(rule), 'rule', figNr, checkRule[rule].rule);
                      log.push ('*** Error: Fig ' + figNr + ': ' + checkRule[rule].why);
                    }

                  }
                }
              }
            }
          }
        }
        // Check the Group rules for complete figures
        for (group in checkFigGroup) {
          var match = figString.match(checkFigGroup[group].regex);
          if (match) {
            if (!groupMatch[group]) groupMatch[group] = [];
            for (j = 0; j < match.length; j++) {
              groupMatch[group].push({'match':match[j], 'fig':figNr});
            }
          }
        }
        if ('minperfig' in checkCatGroup.k) {
          if (figK < checkCatGroup.k.minperfig) {
						if (('maxperfig' in checkCatGroup.k) &&
							(checkCatGroup.k.minperfig === checkCatGroup.k.maxperfig)) {
							checkAlert('k', 'exactlyperfig', figNr);
						} else checkAlert('k', 'minperfig', figNr);
          }
        }
        if ('maxperfig' in checkCatGroup.k) {
          if (figK > checkCatGroup.k.maxperfig) {
            checkAlert('k', 'maxperfig', figNr);
          }
        }
      }
    }
  }
  
  // add additionals to figureK where applicable
  if ((additionals > 0) && (additionalFig.max > 0)) {
    figureK += additionalFig.totalK;
  }
  // check for total min/max K
  if ('min' in checkCatGroup.k) {
		if (figureK < checkCatGroup.k.min) {
			if (('max' in checkCatGroup.k) &&
				(checkCatGroup.k.min === checkCatGroup.k.max)) {
				checkAlert ('k', 'exactly');
			} else checkAlert('k', 'min');
		}
  }
  if ('max' in checkCatGroup.k) {
    if (figureK > checkCatGroup.k.max) checkAlert('k', 'max');
  }

  // Run checks on maximum and minimum occurrence of a group (catalog ID)
  // Go through all groups
  log.push ('====== Testing global repeat/min/max ======');
  for (group in checkCatGroup) {
    // Did we have a match on this group?
    if (groupMatch[group]) {
      //console.log('* Match');
      //console.log(checkCatGroup[group]);
      // Check for max and min occurrences of the group
      if ('max' in checkCatGroup[group]) {
        log.push ('testing group ' + group + '-max=' +
          checkCatGroup[group].max + ' val=' + groupMatch[group].length);
        if (groupMatch[group].length > checkCatGroup[group].max) {
          errFigs = figureNumbers (groupMatch[group]);
          checkAlert(group, 'max', errFigs);
          log.push ('*** Error: Maximum ' + checkCatGroup[group].max +
            ' of group ' + group + '(' + errFigs + ')');
        }
      }
      if ('min' in checkCatGroup[group]) {
        log.push ('testing group ' + group + '-min=' +
          checkCatGroup[group].min + ' val=' + groupMatch[group].length);
        if (groupMatch[group].length < checkCatGroup[group].min) {
					if (('max' in checkCatGroup[group]) &&
						(checkCatGroup[group].min === checkCatGroup[group].max)) {
						checkAlert(group, 'exactly');
					} else checkAlert(group, 'min');
          log.push ('*** Error: Minimum ' + checkCatGroup[group].min +
            ' of group ' + group);
        }
      }
      // Check for repeats of the exact same catalog id when necessary
      if (('repeat' in checkCatGroup[group]) ||
        ('totrepeat' in checkCatGroup[group])) {
        //console.log('Check repeat');
        var matches = [];
        for (var j = 0; j < groupMatch[group].length; j++) {
          var thisMatch = groupMatch[group][j];
          if (matches[thisMatch.match]) {
            matches[thisMatch.match].push({'match':thisMatch.match, 'fig':thisMatch.fig});
          } else {
            matches[thisMatch.match] =
              [{'match':thisMatch.match, 'fig':thisMatch.fig}];
          }
        }
        if ('repeat' in checkCatGroup[group]) {
          for (match in matches) {
            if (matches[match].length > checkCatGroup[group].repeat) {
              errFigs = figureNumbers (matches[match]);
              checkAlert(group, 'repeat', errFigs);
              log.push ('*** Error: Repeat ' + checkCatGroup[group].repeat +
                ' of group ' + group + '(' + errFigs + ')');
            }
          }
        }
        if ('totrepeat' in checkCatGroup[group]) {
          var count = 0;
          for (match in matches) {
            if (matches[match].length > 1) {
              count++;
            } else delete matches[match];
          }
          if (count > checkCatGroup[group].totrepeat) {
            errFigs = [];
            for (match in matches) {
              for (var i = 0; i < matches[match].length; i++) {
                errFigs.push (matches[match][i]);
              }
            }
            errFigs = figureNumbers (errFigs);
            checkAlert(group, 'totrepeat', errFigs);
            log.push ('*** Error: Total Repeat ' + checkCatGroup[group].totrepeat +
              ' of group ' + group + '(' + errFigs + ')');
          }
        }        
      }
    } else {
      // No occurrences of this group, was there a minimum?
      if ((group != 'k') && (checkCatGroup[group].min)) {
				if (('max' in checkCatGroup[group]) &&
					(checkCatGroup[group].min === checkCatGroup[group].max)) {
					checkAlert(group, 'exactly');
				} else checkAlert(group, 'min');
        log.push ('*** Error: Minimum ' + checkCatGroup[group].min +
          ' of group ' + group);
      }
    }
  }
  // Run checks on maximum and minimum occurrence of a Group (complete figure)
  // Go through all groups
  for (group in checkFigGroup) {
    // Did we have a match on this group?
    if (groupMatch[group]) {
      // Check for min and max occurrences of the group
      if (('min' in checkFigGroup[group]) &&
        (groupMatch[group].length < checkFigGroup[group].min)) {
				if (('max' in checkFigGroup[group]) &&
					(checkFigGroup[group].min === checkFigGroup[group].max)) {
					checkAlert(group, 'figexactly');
				} else checkAlert(group, 'figmin');
        log.push ('*** Error: Minimum ' + checkFigGroup[group].min +
          ' of group ' + group);
      }
      if (('max' in checkFigGroup[group]) &&
        (groupMatch[group].length > checkFigGroup[group].max)) {
        errFigs = figureNumbers (groupMatch[group]);
        checkAlert(group, 'figmax', errFigs);
        log.push ('*** Error: Maximum ' + checkFigGroup[group].max +
          ' of group ' + group + '(' + errFigs + ')');
      }
      // Check for repeats of the exact same figure when necessary
      if ('repeat' in checkFigGroup[group]) {
        var matches = [];
        for (var j = 0; j < groupMatch[group].length; j++) {
          var thisMatch = groupMatch[group][j];
          if (matches[thisMatch.match]) {
            matches[thisMatch.match].push({
              'match':thisMatch.match,
              'fig':thisMatch.fig
            });
          } else {
            matches[thisMatch.match] =
              [{'match':thisMatch.match, 'fig':thisMatch.fig}];
          }
        }
        for (match in matches) {
          if (checkFigGroup[group].repeat &&
            (matches[match].length > checkFigGroup[group].repeat)) {
            errFigs = figureNumbers (matches[match]);
            checkAlert(group, 'figrepeat', errFigs);
            log.push ('*** Error: Repeat ' + checkFigGroup[group].repeat +
              ' of group ' + group + '(' + errFigs + ')');
          }
        }
      }
    } else {
      // No occurrences of this group, was there a minimum?
      if ('min' in checkFigGroup[group]) {
				if (('max' in checkFigGroup[group]) &&
					(checkFigGroup[group].min === checkFigGroup[group].max)) {
					checkAlert(group, 'figexactly');
				} else checkAlert(group, 'figmin');
        log.push ('*** Error: Minimum ' + checkFigGroup[group].min +
          ' of group ' + group);
      }
    }
  }
  
  // Check complete sequence string on seqcheck directives
  // When there is NO match for any of the directives, an alert is created
  
  if (ruleSeqCheck !== []) {
    for (var name in ruleSeqCheck) {
      if (!ruleSeqCheck[name].regex.test(activeSequence.text)) {
        checkAlert (
          checkName(ruleSeqCheck[name]),
          false,
          false,
          ruleSeqCheck[name].rule
        );
      }
    }
  }
  
  // check for multiple use of the same free unknown figure, except additionaL
  // Also check if all figures have been assigned a Free (Un)known letter
  // or Additional when applicable and if the assigned figure letters
  // are allowed according the rules

  var remaining = figureLetters ? figureLetters : '';

  var ufl = [];
  for (var i = 0; i < figures.length; i++) {
    var l = figures[i].unknownFigureLetter;
    if (figures[i].aresti) {
      if (l) {
        if ((figureLetters + 'L').indexOf (l) === -1) {
          var msg = sprintf (
            userText.figureLetterNotAllowed,
            figures[i].seqNr,
            l);
          alertMsgs.push (msg);
          log.push ('*** Error: ' + msg);
          //delete figures[i].unknownFigureLetter;
        } else {
          if (ufl[l]) {
            ufl[l].push(figures[i].seqNr);
          } else {
            ufl[l] = [figures[i].seqNr];
          }
          remaining = remaining.replace(l, '');
        }
      }
    }
  }
  
  for (l in ufl) {
    if ((ufl[l].length > 1) && (l != 'L')) {
      var msg = sprintf(userText.FUletterMulti, ufl[l].join(','), l);
      alertMsgs.push(msg);
      log.push ('*** Error: ' + msg);
    }
  }
  // see if we have remaining (=unused) letters
  if (remaining.length) {
    var figs = [];
    for (var i = 0; i < figures.length; i++) {
      if (!figures[i].unknownFigureLetter && figures[i].aresti) {
        figs.push (figures[i].seqNr);
      }
    }
    if (figs.length) {
      var msg = sprintf(userText.noFigureLetterAssigned, figs.join(','));
      alertMsgs.push (msg);
      log.push ('*** Error: ' + msg);
    }

    var msg = sprintf(userText.unusedFigureLetters, remaining);
    alertMsgs.push (msg);
    log.push ('*** Error: ' + msg);
  }
  
  // when additionals are allowed, at least one is required
  if (additionalFig.max && !additionals) {
    checkAlert (
      "At least 1 additional figure required",
      false,
      false,
      (sportingClass.value === 'glider') ?
        "Sporting Code Section 6 Part II, 3.3.3.8" :
        "Sporting Code Section 6 Part I, 2.3.1.4&nbsp;c"
    );
  }

  // check Reference sequence if provided
  if (figureLetters && referenceSequence.figures &&
    (!multi.processing || document.getElementById ('multiUseReference').checked)) {
    checkReferenceSequence ();
  }
  //console.log(Date.now() - t); //log execution time

  return log;
}

// figureNumbers is called by checkRules. It takes a match array with
// i items {'match':xxx, 'fig':xxx} and returns the fig numbers as a
// comma-separated line. Do not add the same number multiple times.
function figureNumbers (match) {
  var figs = [];
  for (var i = 0; i < match.length; i++) {
    if (figs.indexOf (match[i].fig) === -1) figs.push (match[i].fig);
  }
  return figs.join(',');
}

// checkName creates the correct 'name' string. Priority is:
// 1) current language
// 2) no language
// 3) English
function checkName (obj) {
  var language = document.getElementById('language').value;
  if (obj['name_' + language]) {
    return obj['name_' + language];
  } else if (obj.name) {
    return obj.name;
  } else if (obj.why_en) {
    return obj.name_en;
  } else return '';
}

// checkRuleText creates the correct 'ruleText' string. Priority is:
// 1) current language
// 2) no language
// 3) English
function checkRuleText (obj) {
  var language = document.getElementById('language').value;
  if (obj['rule_' + language]) {
    return obj['rule_' + language];
  } else if (obj.rule) {
    return obj.rule;
  } else if (obj.rule_en) {
    return obj.rule_en;
  } else return '';
}

// checkAlert adds an alert resulting from sequence checking
// value : a value for processing
// type  : the type of checking error
// rule  : optional, literal text for the rulebook rule that invoked
//         this as in xxx-rule
function checkAlert (value, type, figNr, rule) {
  var alertRule = false;
  var alertFig = figNr ? '(' + figNr + ') ' : '';
  switch (type) {
    case 'maxperfig':
    case 'minperfig':
    case 'exactlyperfig':
    case 'max':
    case 'min':
    case 'exactly':
    case 'repeat':
    case 'totrepeat':
	    // reduce max total K for floating point
	    if (value === 'k' && checkCatGroup.floatingPoint) {
				alertMsgs.push(alertFig + sprintf (userText.checkAlert[type],
        checkCatGroup[value][type.replace (/^exactly/, 'max')] - checkCatGroup.floatingPoint,
        checkName(checkCatGroup[value])));
			} else {
	      alertMsgs.push(alertFig + sprintf (userText.checkAlert[type],
	        checkCatGroup[value][type.replace (/^exactly/, 'max')],
	        checkName(checkCatGroup[value])));
	    }
      if (checkCatGroup[value].rule) {
        alertRule = checkCatGroup[value].rule[type.replace (/^exactly/, 'max')];
      }
      break;
    case 'figmax':
    case 'figmin':
    case 'figexactly':
    case 'figrepeat':
      alertMsgs.push(alertFig + sprintf (userText.checkAlert[type],
        checkFigGroup[value][type.replace (/^fig/, '').replace (/exactly$/, 'max')],
        checkName(checkFigGroup[value])));
      if (checkFigGroup[value].rule) {
        alertRule = checkFigGroup[value].rule[type.replace (/^fig/, '').replace (/exactly$/, 'max')];
      }
      break;
    case 'notAllowed':
      alertMsgs.push(alertFig + sprintf (userText.checkAlert.notAllowed,
        value));
      break;
    default:
      alertMsgs.push(alertFig + value);
      if (rule) {
        alertRule = rule;
      }
  }
  if (alertRule) alertMsgRules [alertMsgs[alertMsgs.length - 1]] = alertRule;
}

// checkSequence will show a window with sequence checking information
// show=true : show window
// show=log  : show log page
// show=false: hide window
function checkSequence(show) {

  var div = document.getElementById('checkSequence');
  if (show) {
    if (show === 'log') {
      newWindow (function(){
        // show log page
        var log = checkRules();
        var body = document.createElement('body');
        var pre = document.createElement('pre');
        for (var i = 0; i < log.length; i++) {
          pre.appendChild(document.createTextNode(log[i] + '\n'));
        }
        body.appendChild(pre);
        return body;
      }, userText.sequenceCheckLog);
      div.classList.add ('noDisplay');
    } else {
      div.classList.remove ('noDisplay');
      if (rulesActive) {
        var content = '<div class="divider">' + userText.checkingRules +
          ' : ' + rulesActive + '</div>';
      } else {
        var content = '';
      }
      // get alerts from alert area
      var contentDiv = document.getElementById('checkSequenceContent');
      contentDiv.innerHTML = document.getElementById('alerts').innerHTML;
      // remove label
      contentDiv.removeChild(contentDiv.firstChild);
      if (contentDiv.innerHTML == '') {
        // no alerts
        if (rulesActive) {
          contentDiv.innerHTML = content + userText.sequenceCorrect;
        } else {
          contentDiv.innerHTML = content;
        }
      } else {
        // alerts present
        contentDiv.innerHTML = content + contentDiv.innerHTML;
      }
    }
  } else {
    div.classList.add ('noDisplay');
  }
}

// lockSequence is called when locking or unlocking the sequence
// When lock is not true, it toggles. When lock is true it locks the
// sequence
function lockSequence (lock) {
  var els = document.getElementsByClassName ('lock');
  if (document.getElementById ('lock_sequence').value && (lock !== true)) {
    // was locked, so unlock
    document.getElementById ('lock_sequence').value = '';
    document.getElementById ('lockSequence').classList.remove ('noDisplay');
    document.getElementById ('unlockSequence').classList.add ('noDisplay');    
    for (var i = 0; i < els.length; i++) {
      if (els[i].tagName === 'LI') {
        els[i].classList.remove ('noDisplay');
      } else if (els[i].getAttribute('disabledByLock')) {
        els[i].removeAttribute ('disabled');
      }
    }
    document.getElementById ('t_locked').classList.add ('hidden');
  } else {
    // was unlocked, so lock
    selectFigure (false);
    selectTab ('tab-sequenceInfo');
    document.getElementById ('lock_sequence').value = '1';
    document.getElementById ('lockSequence').classList.add ('noDisplay');
    document.getElementById ('unlockSequence').classList.remove ('noDisplay'); 
    for (var i = 0; i< els.length; i++) {
      if (els[i].tagName === 'LI') {
        els[i].classList.add ('noDisplay');
      } else       if (!els[i].disabled) {
        els[i].setAttribute ('disabledByLock', true);
        els[i].setAttribute ('disabled', true);
      }
    }
    document.getElementById ('t_locked').classList.remove ('hidden');
  }
  changeSequenceInfo();
  menuInactiveAll();
}

// changeReferenceSequence is called when the reference sequence is
// changed
function changeReferenceSequence (auto) {

  // remove all line breaks from the sequence reference
  string = document.getElementById ('referenceSequenceString').value.replace (/(\r\n|\n|\r)/gm, ' ');
  
  if (auto !== true) savedReference = string;
  
  var match;
  activeSequence.figures = [];
  var savedText = activeSequence.text;

  var thisFigure = {'string':'', 'stringStart':0, 'stringEnd':0};
  var inText = false;
  for (var i = 0; i <= string.length; i++) {
    if (string[i] == userpat.comment) inText = !inText;
    if (((string[i] === ' ') || (i === string.length)) && !inText) {
      if (thisFigure.string !== '') {
        // Remove moveForward (x>) and moveDown (x^) at the beginning of
        // a figure.
        // OLAN had it coupled to a figure but OpenAero keeps sequence
        // drawing instructions separate
        while (match = thisFigure.string.match (regexMoveFwdDn)) {
          thisFigure.stringStart = thisFigure.stringStart + match[0].length;
          thisFigure.string = thisFigure.string.replace(regexMoveFwdDn, '');
        }
        // only add figures that are not empty
        if (thisFigure.string != '') {
          activeSequence.figures.push ({
            'string':thisFigure.string,
            'stringStart':thisFigure.stringStart,
            'stringEnd':i});
          thisFigure.string = '';
        }
      }
    } else {
      // set the start when this is the first character
      if (thisFigure.string === '') thisFigure.stringStart = i;
      // add the character
      thisFigure.string += string[i];
    }
  }

  // Parse sequence
  var activeFormSave = activeForm;
  activeForm = 'Grid';
  Attitude = Direction = X = Y = 0;

  // See if there is a y-axis flip symbol and activate it, except when 
  // it matches the subSequence code which is similar (/ or //). Usually
  // this is done by parseSequence, but it checks activeSequence.text
  if (string.replace(regexComments, '').match(regexFlipYAxis)) {
    setYAxisOffset (180 - yAxisOffset);
  }
  
  parseSequence ();

  activeForm = activeFormSave;
  
  var figCount = 0;
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) figCount++;
  }
  
  var div = document.getElementById('referenceSequenceDialog');
  var noDisplay = div.classList.contains ('noDisplay');
  
  // show div to make sure bBoxes can be calculated
  div.classList.remove ('noDisplay');
  
  var svg = document.getElementById ('referenceSequenceSvg');
  prepareSvg (svg);
  if (figCount) {
    makeFormGrid (figCount, figCount * 150, svg);
    svg.setAttribute ('width', svg.getAttribute ('width') * (200 / svg.getAttribute ('height')));
    svg.setAttribute ('height', 200);
  } else {
    svg.setAttribute ('width', 0);
    svg.setAttribute ('height', 0);
  }
  
  // restore div to previous state
  if (noDisplay) div.classList.add ('noDisplay');
  
  referenceSequence.figures = {};
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti && figures[i].unknownFigureLetter) {
      referenceSequence.figures[figures[i].unknownFigureLetter] = figures[i];
    }
  }
  
  var remaining = figureLetters;
  var div = document.getElementById ('referenceSequenceAlerts');
  for (var i = 0; i < figureLetters.length; i++) {
    if (referenceSequence.figures[figureLetters[i]]) {
      remaining = remaining.replace (figureLetters[i], '');
    }
  }
  div.innerHTML = remaining ?
	  sprintf (userText.unusedFigureLetters, remaining.split('').join(' ')) : '';

  // restore sequence
  alertMsgs = alertMsgRules = activeSequence.figures = [];
  activeSequence.text = sequenceText.innerText = savedText;
  
  checkSequenceChanged (true);

}

// checkReferenceSequence checks the active sequence against a reference
// sequence and provides appropriate warnings
function checkReferenceSequence () {
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti &&
      figures[i].unknownFigureLetter &&
      (figures[i].unknownFigureLetter !== 'L') &&
      referenceSequence.figures[figures[i].unknownFigureLetter]) {
      var refFig = referenceSequence.figures[figures[i].unknownFigureLetter];
      if (refFig.checkLine !== figures[i].checkLine) {
        checkAlert (sprintf (userText.referenceFigureDifferent,
          figures[i].unknownFigureLetter), false, figures[i].seqNr);
      } else if (refFig.entryDir === refFig.exitDir) {
        if (figures[i].entryDir !== figures[i].exitDir) {
          if (refFig.entryAtt === refFig.exitAtt) {
            var text = userText.referenceFigureExitSame;
          } else {
            var text = userText.referenceFigureExitOpp;
          }
          checkAlert (sprintf (text,
           figures[i].unknownFigureLetter), false, figures[i].seqNr);
        }
      } else if (refFig.entryDir !== refFig.exitDir) {
        if (figures[i].entryDir === figures[i].exitDir) {
          if (refFig.entryAtt === refFig.exitAtt) {
            var text = userText.referenceFigureExitOpp;
          } else {
            var text = userText.referenceFigureExitSame;
          }
          checkAlert (sprintf (text,
           figures[i].unknownFigureLetter), false, figures[i].seqNr);
        }
      }
    }
  }
}

// checkInfo checks if the required Sequence info is present and
// highlights any empty info fields with red borders (checkInfo class)
function checkInfo () {
  // first clear all red borders
  var el = document.getElementsByClassName('checkInfo');
  for (var i = el.length - 1; i >= 0; i--) {
    el[i].removeAttribute ('required');
    el[i].classList.remove ('checkInfo');
  }
  // when no rules are active, revert to default: pilot, actype, acreg
  if (!rulesActive) infoCheck = ['pilot', 'actype', 'acreg'];
  // add red borders to missing info
  for (var i = 0; i < infoCheck.length; i++) {
    el = document.getElementById(infoCheck[i]);
    if (el) {
      el.setAttribute ('required', true);
      if (el.value == '') el.classList.add ('checkInfo');
    }
  }
}

// missingInfoCheck checks for missing Sequence Info.
// When no missing info is detected, function f is executed.
// Otherwise, a warning is presented and f executed only after confirm
function missingInfoCheck (f) {
  var el = document.getElementsByClassName('checkInfo');
  
  if (el.length === 0) {
    f();
  } else {
    var warning = userText.missingInfo + '</br>';
    for (var i = 0; i < el.length; i++) {
      warning += '</br>\n' + userText[el[i].id].replace(/&amp;/g, '&');
    }
    confirmBox (warning, userText.missingInfoTitle, f);
  }
}

// updateFigureSelectorOptions updates the figure chooser options
function updateFigureSelectorOptions (selectedOption) {
  var container = document.getElementById('figureSelectorOptionsDiv');
  if (container) {
    // clear container
    while (container.firstChild) container.removeChild (container.firstChild);
    // find first and last (if any) real figures
    var firstFigure = false;
    var lastFigure = false;
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) {
        if (firstFigure === false) firstFigure = i;
        lastFigure = i;
      }
    }
    // only make a selector when there is at least one figure in the seq
    // and we are not in Free (Un)known designer
    if ((firstFigure !== false) && (activeForm != 'FU')) {
      var options = ['figSelectorAddStart'];
      // if a figure is selected, add extra options
      if (selectedFigure.id !== null) {
        options.push ('figSelectorAddBefore');
        options.push ('figSelectorReplace');
        options.push ('figSelectorAddAfter');
        // set default option to add after
        if (!selectedOption) selectedOption = 'figSelectorAddAfter';
      }
      options.push ('figSelectorAddEnd');
      // set default option to add at end
      if (!selectedOption) selectedOption = 'figSelectorAddEnd';
      var select = document.createElement ('select');
      select.id = 'figureSelectorOptions';
      select.setAttribute('onChange', 'markFigures();');
      for (var i = 0; i < options.length; i++) {
        var option = document.createElement ('option');
        option.value = options[i];
        if (options[i] == selectedOption) {
					option.setAttribute('selected', 'selected');
				}
        option.text = userText[options[i]];
        select.appendChild (option);
      }
      select.value = selectedOption;
      container.appendChild (select);
    } else {
      // otherwise, make a placeholder
      container.innerHTML = '&nbsp;';
    }
    markFigures();
    // add material design form field bar
    container.innerHTML += '<i class="bar"></i>';
  }
}

// changeFigureString is executed when the figureString in the Figure
// Selector is changed
function changeFigureString (e) {
	
	var string = this.value.replace (/ /g, '');

	if (e.inputType === 'insertText') {
		if (e.data === ' ') return false;
	} else this.value = string;
	
  string = string || (additionalFig.max ? 'L' : 'X');
  updateSequence (selectedFigure.id, string, true, true);
  this.focus();
}

// changeHideIllegal is executed when the hideIllegal checkbox is toggled
function changeHideIllegal() {
  availableFigureGroups();
  changeFigureGroup ();
}

// availableFigureGroups selects the available figure groups. May be
// limited by active rules.
function availableFigureGroups() {
  var options = document.getElementById('figureGroup').childNodes;
  var firstGroup = (activeForm === 'FU') ? 0 : 1;
  // hide all options
  for (var i = firstGroup; i < options.length; i++) {
    options[i].classList.add ('noDisplay');
    options[i].disabled = 'disabled';
  }
  if ((Object.keys(checkAllowCatId).length > 0) &&
    rulesActive &&
    (document.getElementById('hideIllegal').checked == true) &&
    (activeForm !== 'FU')) {
    // now show all options that are applicable
    for (var i in fig) {
      if (fig[i].aresti in checkAllowCatId) {
        options[fig[i].group].classList.remove('noDisplay');
        options[fig[i].group].disabled = false;
      }
    }
  } else if (activeForm !== 'FU') {
    // show all options
    for (var i = 1; i < options.length; i++) {
      options[i].classList.remove ('noDisplay');
      options[i].disabled = false;
    }
  } else {
    // show all options, except the last one (non-Aresti)
    for (var i = 1; i < (options.length - 1); i++) {
      options[i].classList.remove ('noDisplay');
      options[i].disabled = false;
    }
  }
}

// changeFigureGroup updates the figure group in the figure chooser
function changeFigureGroup() {
  var
	  e = document.getElementById('figureGroup'),
	  arestiDraw = [],
	  figureGroup = e.value,
	  table = document.getElementById('figureChooserTable'),
	  container = document.getElementById('figureSvgContainer'),
	  svg = document.getElementById('figureChooserSvg'),
	  colCount = 0,
	  fragment = document.createDocumentFragment();
  
  // set the correct size and row count for the figure thumbnails
  if (figureGroup != 0) { // normal Aresti group
    var size = 56;
    var newRow = /\.[01]$/;
    var maxColCount = 4;
    document.getElementById('figureChooserColumns').classList.remove('noDisplay');
  } else { // queue group
    var maxColCount = document.getElementById('queueColumns').value;
    var size = parseInt((280 / maxColCount) - 8);
    var newRow = /never/;
    document.getElementById('figureChooserColumns').classList.add('noDisplay');
  }
  
  firstFigure = false;
  
  // clear the figureChooser table
  while (table.firstChild) table.removeChild(table.firstChild);
  for (var i = 0; i < fig.length; i++) {
    if (fig[i]) {
      // Only draw figures that are in this group AND have not been
      // drawn before (e.g. 1j and j)
      if ((fig[i].group == figureGroup) && !inArray(arestiDraw, (fig[i].aresti+fig[i].draw))) {
        if (!fig[i].svg) {
          // The figure has not been drawn in this session, go ahead and
          // draw it. First we take the original base and remove + and
          // replace full/any roll/spin symbols by '1'
					var figure = fig[i].pattern.replace(/[\+]/g, '').replace(
						regexFullAnySpinRoll, '1') ;
          // next we replace half roll symbols by actual half rolls
          figure = figure.replace(regexHalfRoll, '2');
          figures[-1] = [];
          if (figure[0] != '-') {
            Attitude = Direction = 0;
          } else {
            Attitude = Direction = 180;
          }
          // build the figure
          // fig[i].string is only set for Queue figures
          if (fig[i].string) {
            buildFigure ([i], fig[i].string, false, -1);
          } else {
            buildFigure ([i], figure, false, -1, true);
          }
          // clear the svg
          prepareSvg(svg);
          // reset X and Y and clear figureStart to prevent adjusting
          // figure position
          X = Y = 0;
          figureStart = [];
          // draw the figure
          drawFullFigure(-1, true, svg);
          // retrieve the group holding the figure and set viewbox
          var group = svg.getElementById('figure-1');
          var bBox = group.getBBox();
          var xMargin = bBox.width / 20;
          var yMargin = bBox.height / 20;
          group.setAttribute('transform', 'translate(' +
            roundTwo((xMargin - bBox.x)) + ' ' +
            roundTwo((yMargin - bBox.y)) + ')');
          svg.setAttribute('viewBox', '0 0 '+
            roundTwo(bBox.width+xMargin*2)+' '+
            roundTwo(bBox.height+yMargin*2));
          svg.setAttribute('width', size);
          svg.setAttribute('height', size);
          svg.setAttribute('id', 'figureChooser'+i);
          // add the svg to fig[i] as xml text
          fig[i].svg = new XMLSerializer().serializeToString(svg);
          svg.setAttribute('id', 'figureChooserSvg');
          // add the roll Aresti nrs to fig if applicable
          fig[i].rollAresti = [];

          for (var j = 1; j < figures[-1].aresti.length; j++) {
            fig[i].rollAresti[j] = rollAresti.indexOf(figures[-1].aresti[j]);
          }
        }
        if ((fig[i].aresti.match(newRow) && (fig[i].group != 0)) || (colCount == 0)) {
          colCount = 0;
          var tr = document.createElement('tr');
          var td = document.createElement('td');
          tr.appendChild(td);
          td.classList.add ('arestiRow');
          // add Aresti row number if not in queue or non-Aresti figures
          if ((fig[i].group != 0) && !/^0/.test(fig[i].aresti)) {
            td.innerHTML = fig[i].aresti.match(/^\d+\.\d+\.(\d+)/)[1];
          }
          fragment.appendChild(tr);
        }
        colCount++;
        if (colCount >= maxColCount) colCount = 0;
        var td = document.createElement('td');
        td.setAttribute('id', i);
        var inner = document.createElement('div');
        td.appendChild(inner);
        inner.innerHTML = fig[i].svg;
        td.addEventListener ('mousedown', function(){selectFigure(this)});
        var rollK = 0;
        if (sportingClass.value === 'glider') {
          var k = fig[i].kglider;
          for (var j = 1; j < fig[i].rollAresti.length; j++) {
            // Set rollK to -1 when this roll has 0K -> illegal
            // Can only happen for queue figures
            if (rollKGlider[fig[i].rollAresti[j]] == 0) {
              rollK = -1;
              break;
            }
            // only count half rolls and rolls in queue figures
            if (fig[i].string || (fig[i].rolls[j] == 2)) {
	            rollK += rollKGlider[fig[i].rollAresti[j]];
						}
          }
        } else {
          var k = fig[i].kpwrd;
          for (var j = 1; j < fig[i].rollAresti.length; j++) {
            // Set rollK to -1 when this roll has 0K -> illegal
            // Can only happen for queue figures
            if (rollKPwrd[fig[i].rollAresti[j]] == 0) {
              rollK = -1;
              break;
            }
            // only count half rolls and rolls in queue figures
            if (fig[i].string || (fig[i].rolls[j] == 2)) {
	            rollK += rollKPwrd[fig[i].rollAresti[j]];
						}
          }
        }

        if (rollK > 0) {
          k += '(+' + rollK + ')';
        } else if (rollK < 0) {
          k += '<font color="red">(N/A)</font>';
        }
        fig[i].rollK = rollK;

        inner.innerHTML += 'K:' + k;
        
        // extra for figures in queueGroup
        if (fig[i].group == 0) {
          // add a 'remove' button
          var div = document.createElement('div');
          div.classList.add ('removeFigureButton');
          div.id = 'removeFromQueue' + i;
          div.innerHTML = '<i class="material-icons">close</i>';
          // make sure we remove on touch devices by using touchstart
          // which fires before mousedown
          if (platform.touch) {
            div.addEventListener ('touchstart', removeFromQueue);
          } else {
	          div.addEventListener ('mousedown', removeFromQueue);
					}
          inner.appendChild(div);
          // add the unknownFigureLetter where defined
          if (fig[i].unknownFigureLetter) {
            var div = document.createElement('div');
            div.classList.add ('UFletterInQueue');
            div.innerHTML = fig[i].unknownFigureLetter;
            inner.appendChild(div);
          }
        }

        tr.appendChild(td);

        // add this figure's Aresti number and pattern to arestiDraw
        // so it is not drawn twice
        arestiDraw.push(fig[i].aresti+fig[i].draw);
      }
    }
  }
  // When any figure was drawn, redraw sequence
  if (-1 in figures) {
    // Clear alert messages created by building figures
    alertMsgs = [];
    alertMsgRules = [];
    // Delete this figure
    delete figures[-1];
  }
  
  table.appendChild (fragment);
  
  markFigures();
}

// markFigures applies marking to figure chooser elements
function markFigures () {
  markUsedFigures ();
  markMatchingFigures ();
  // for Free (Un)known designer we only choose Additional figures. All
  // Aresti figures are allowed
  if (activeForm !== 'FU') markNotAllowedFigures ();
}

// markUsedFigures marks figures that are already in the sequence
function markUsedFigures () {
  var table = document.getElementById('figureChooserTable');
  var tr = table.childNodes;
  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].childNodes;
    for (var j = 1; j < td.length; j++) {
      td[j].classList.remove ('queueUsed');
      // add class queueUsed if the figure is already present in
      // the sequence
      for (var k = 0 ; k < figures.length ; k++) {
        if (!figures[k]) break;
        if (figures[k].aresti && fig[td[j].id].aresti) {
          if (('queue-' + figures[k].aresti.join('-')) === fig[td[j].id].aresti) {
            if (td[j].classList.contains ('queueUsed')) {
              td[j].classList.remove ('queueUsed');
              td[j].classList.add ('queueUsedMulti');
              break;
            } else {
              td[j].classList.add ('queueUsed');
            }
          }
        }
      }
    }
  }
}

// markMatchingFigures updates figure chooser elements to show if they
// 'fit' in the selected sequence position. Figures in another
// subsequence are not considered
function markMatchingFigures () {
  // for the Free (Un)known designer, the selector is hidden. We always do
  // replace in that case
  if (activeForm === 'FU') {
    var el = {'value': 'figSelectorReplace'};
  } else {
    var el = document.getElementById('figureSelectorOptions');
  }
  var previousPattern = false;
  var nextPattern = false;
  if (el) {
    switch (el.value) {
      case 'figSelectorAddStart':
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti) {
            nextPattern = fig[figures[i].figNr].pattern;
            break;
          } else if (figures[i].subSequence) break;
        }
        break;
      case 'figSelectorAddBefore':
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti) {
            if (selectedFigure.id > i) {
              previousPattern = fig[figures[i].figNr].pattern;
            } else {
              nextPattern = fig[figures[i].figNr].pattern;
              break;
            }
          }
        }
        break;
      case 'figSelectorReplace':
        for (var i = 0; i < figures.length; i++) {
          if (selectedFigure.id > i) {
            if (figures[i].aresti) {
              previousPattern = fig[figures[i].figNr].pattern;
            } else if (figures[i].subSequence) {
              previousPattern = false;
            }
          } else if (selectedFigure.id < i) {
            if (figures[i].aresti) {
              nextPattern = fig[figures[i].figNr].pattern;
              break;
            } else if (figures[i].subSequence) {
              break;
            }
          }
        }
        break;
      case 'figSelectorAddAfter':
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti) {
            if (selectedFigure.id == i) {
              previousPattern = fig[figures[i].figNr].pattern;
            } else if (selectedFigure.id < i) {
              nextPattern = fig[figures[i].figNr].pattern;
              break;
            }
          }
        }
        break;
      case 'figSelectorAddEnd':
        for (var i = figures.length - 1; i >= 0; i--) {
          if (figures[i].aresti) {
            previousPattern = fig[figures[i].figNr].pattern;
            break;
          } else if (figures[i].subSequence) break;
        }
    }  
  }
  if (previousPattern) {
    var regexString = '^[\\' + previousPattern[previousPattern.length - 1] + '].*';
  } else var regexString = '';
  if (nextPattern) regexString += '[\\' + nextPattern[0] + ']$';
  var regex = new RegExp (regexString);
  var table = document.getElementById('figureChooserTable');
  var tr = table.childNodes;
  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].childNodes;
    // start with 2nd <td>, as first holds Aresti row nr
    for (var j = 1; j < td.length; j++) {
      if (fig[td[j].id].pattern.match(regex)) {
        td[j].classList.add ('matchingFigure');
      } else {
        td[j].classList.remove ('matchingFigure');
      }
    }
  }
}

// markNotAllowedFigures updates figure chooser elements to show if they
// are not allowed for the specified rules
function markNotAllowedFigures () {
  var table = document.getElementById('figureChooserTable');
  var tr = table.childNodes;
  
  function legalFigure () {
    td[j].classList.remove ('figureNotAllowed');
    td[j].firstChild.classList.remove ('hidden');
    anyLegal = true;
  }
  function illegalFigure () {
    if (document.getElementById('hideIllegal').checked == true) {
      td[j].firstChild.classList.add ('hidden');
      td[j].classList.remove ('matchingFigure');
    } else {
      td[j].classList.add ('figureNotAllowed');
    }
  }
    
  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].childNodes;
    var anyLegal = false;
    for (var j = 1; j < td.length; j++) {
      if ((sportingClass.value === 'powered') && (fig[td[j].id].kpwrd == 0)) {
        illegalFigure();
      } else if ((sportingClass.value === 'glider') && (fig[td[j].id].kglider == 0)) {
        illegalFigure();
      } else if (rulesActive) {
        if (Object.keys(checkAllowCatId).length > 0) {
          var aresti = fig[td[j].id].aresti;
          var totalK = parseInt((sportingClass.value === 'powered') ? fig[td[j].id].kpwrd : fig[td[j].id].kglider);
          totalK += parseInt (fig[td[j].id].rollK);

          if (aresti.match(/^queue-/)) {
            aresti = aresti.match(/^queue-([0-9\.]+)/)[1];
          }

          if (!(aresti in checkAllowCatId) || (checkCatGroup.k &&
            checkCatGroup.k.maxperfig && (checkCatGroup.k.maxperfig < totalK))) {
            illegalFigure();
          } else {
            legalFigure();
          }
        } else {
          legalFigure();
        }
      } else {
        legalFigure();
      }
    }
    // hide row when no legal figures present
    if ((document.getElementById('hideIllegal').checked == true) && !anyLegal) {
      tr[i].classList.add ('noDisplay');
    }
  }
}

/*
// switchQueue is called when switching to queue or back to figures in
// the figureChooser
function switchQueue (el) {
  if (!el) return;
  var e = document.getElementById ('figureGroup');
  if (el.id === 't_switchQueue') {
    el.innerHTML = userText.switchFigures;
    el.id = 't_switchFigures';
    var a = document.createAttribute("figureGroup");
    a.value = e.value;
    el.setAttributeNode(a);
    e.setAttribute ('disabled', true);
    e.value = 0;
    document.getElementById ('figureChooserColumns').classList.add ('noDisplay');
  } else {
    el.innerHTML = userText.switchQueue;
    el.id = 't_switchQueue';
    e.removeAttribute ('disabled');
    e.value = Math.max (el.getAttribute('figureGroup'), 1);
    document.getElementById ('figureChooserColumns').classList.remove ('noDisplay');
  }
  changeFigureGroup();
}
*/

// selectFigure is executed when clicking a figure in the figureChooser
// (e = object) or from grabFigure (e = figNr) or from certain functions
// or false
function selectFigure (e) {

  // disable when sequence locked
  if (document.getElementById ('lock_sequence').value) return;

  if (e === null) e = false;
  
  // show figure editor tab
  if ((e !== false) && !platform.smallMobile) selectTab ('tab-figureInfo');
  
  var queueFigure = false;
  var fromChooser = typeof e === 'object' ? true : false;

  if (fromChooser) {
    var options = document.getElementById('figureSelectorOptions');
    // check if this was triggered by removing a figure. If so, do nothing
    if (!fig[e.id]) return;
    // use the string if provided (for Queue figures)
    if (fig[e.id].string) {
      figure = fig[e.id].string;
      queueFigure = e.id;
    } else {
      // when doing a replace, check if this is a similar figure
      if (options) {
        if (options.value == 'figSelectorReplace') {
          
          // getRolls creates a string that represents the rolls and
          // their attitude in the figure
          function getRolls (id) {
            var rolls = fig[id].pattern.replace (regexRolls, '');
            var att = 0;
            var out = '';
            var n = 0;
            var d = fig[id].draw;
            for (var i = 0; i < d.length; i++) {
              if (drawAngles[d[i]]) {
                att += drawAngles[d[i]];
              } else if (d[i].match (/[hHtTuU]/)) {
                att += 180;
              } else if (d[i] == '_') {
                out += att + rolls[n];
                n++;
              } else if (d[i] == '!') {
                out += '!';
              }
              if (att >= 360) att -= 360;
              if (att < 0) att += 360;
            }
            return out;
          }
          
          // replace similar figures, keeping rolls, extensions etc
          if (getRolls(e.id) === getRolls(figures[selectedFigure.id].figNr)) {
            // change the base figure
            figures[selectedFigure.id].pattern = fig[e.id].pattern;
            figures[selectedFigure.id].figNr = e.id;
            // Update figure editor to new figure
            updateFigureOptions(selectedFigure.id);
            // Update the actual figure according figure editor
            updateFigure();
            // no more work needed, figure has been changed
            return;
          }
        }
      }
      if (!figure) {
        // Replace the selected figure or add a new figure at the end
        // first we take the original base and remove + and full/any roll symbols
        var figure = fig[e.id].pattern.replace(regexPlusFullAnyRoll, '');
        // Special case, put 0 for a horizontal line (figure 1.1.1.1)
        if (fig[e.id].pattern === '+_+') figure = '0';
        // replace half roll symbols by actual half rolls
        figure = figure.replace(regexHalfRoll, '2');
        // remove non-necessary roll elements in parenthesis, but only when
        // there are no active rolls in parenthesis
        // result is e.g.: n or n(2)-
        if (!figure.match (/\([^)]+\)/)) {
          figure = figure.replace (/\(\)/g, '');
        }
      }
    }
    // See if a figure was grabbed already. If so, replace it
    if (options) {
      switch (options.value) {
        case 'figSelectorAddStart':
          // find the first 'figure', except sequence options
          // and add before that one
          for (var i = 0; i < figures.length; i++) {
            if (!figures[i].string.match(regexSequenceOptions)) {
              updateSequence(i - 1, figure, false, true);
              setFigureSelected(i);
              break;
            }
          }
          break;
        case 'figSelectorAddBefore':
          for (var i = selectedFigure.id - 1; i>=0; i--) {
            if (i > -1) {
              if (figures[i].string.match(regexSequenceOptions) || figures[i].aresti) {
                break;
              }
            }
          }
          updateSequence(i, figure, false, true);
          setFigureSelected(i + 1);
          break;
        case 'figSelectorReplace':          
          updateSequence(selectedFigure.id, figure, true, true);
          break;
        case 'figSelectorAddAfter':
          updateSequence(selectedFigure.id, figure, false, true);
          setFigureSelected(parseInt(selectedFigure.id) + 1);
          break;
        case 'figSelectorAddEnd':
          updateSequence(figures.length - 1, figure, false, true);
          setFigureSelected(figures.length - 1);
          break;
      }
    } else if (activeForm === 'FU') {
      // in Free (Un)known designer, always replace active figure
      updateSequence (selectedFigure.id, figure, true);
    } else {
      // otherwise, add a new figure at the end
      updateSequence(figures.length - 1, figure, false, true);
      setFigureSelected(figures.length - 1);
    }
  } else if (e !== false) {
    // redirect to selectFigureFU in Free (Un)known designer
    if (activeForm === 'FU') {
      selectFigureFu(e);
      return;
    }

    setFigureSelected(e);
    var figNr = figures[selectedFigure.id].figNr;
    e = SVGRoot.getElementById('figure'+e);
  }
  var elFT = document.getElementById('t_addFigureText');
  if (e !== false) {
    // e!==false => a figure is selected
    // hide the figure selector for smallMobile browsers, but highlight the
    // chosen figure in case the figure selector is shown again
    if (platform.smallMobile) hideFigureSelector ();
    var table = document.getElementById('figureChooserTable');
    var selected = table.getElementsByClassName('selected');
    // remove selected class for all
    for (var i = 0; i < selected.length; i++) {
      selected[i].classList.remove('selected');
    }
    // add selected class to figure
    if (e && e.parentNode.classList) {
      e.parentNode.classList.add ('selected');
    }
    elFT.parentNode.parentNode.classList.add ('hoverdisplay');
    elFT.innerHTML = userText.clickChangeFigure;
    
    // with figure loaded from chooser, remove any unknown figure letters
    // and add queue unknown figure letter if applicable. Don't do this
    // in Free (Un)known designer
    if (fromChooser && (activeForm !== 'FU')) {
      var uf = queueFigure ? fig[queueFigure].unknownFigureLetter : false;

      for (var i = selectedFigure.id - 1; i>=0; i--) {
        if (figures[i].aresti) {
          break;
        } else {
          if (figures[i].unknownFigureLetter) {
            updateSequence(i, '', true);
          }
        }
      }
      // set unknown figure letter if applicable
      if (uf) updateSequence(i, '"@' + uf + '"', false, true);
    }

    // update all figure options
    updateFigureEditor();
   
    // set the figure chooser, except when queue is set and not empty
    if ((document.getElementById ('figureGroup').selectedIndex !== 0) ||
	    (document.getElementById ('figureChooserTable').childNodes.length === 0)) {
	    if (queueFigure) {
	      setFigChooser(queueFigure);
	    } else {
	      setFigChooser(figures[selectedFigure.id].figNr);
	    }
		}
      
    // Highlight the figure in the sequence text when we were not editing
    // the comments and not in FU designer
    if ((activeForm !== 'FU') && (document.activeElement.id !== 'comments')) {
      var start = figures[selectedFigure.id].stringStart;
      for (var i = selectedFigure.id - 1; i>=0; i--) {
        if (figures[i].aresti) {
          break;
        } else {
          start = figures[i].stringStart;
        }
      }
			highlight (sequenceText, start, figures[selectedFigure.id].stringEnd);
    }

  } else {
    // e===false => select no figure
    // remove highlight
    if (activeForm !== 'FU') highlight (sequenceText);
    // set selected figure to null
    setFigureSelected(null);
    if (document.getElementById('figureInfo')) {
      // set figure editor
      updateFigureEditor();
      // update figure selector options
      updateFigureSelectorOptions();
      // correctly set the figure change/edit block
      document.getElementById('selectedFigureSvg').innerHTML = "";
      elFT.parentNode.parentNode.classList.remove ('hoverdisplay');
      elFT.innerHTML = userText.clickAddFigure;
      document.getElementById('figureHeader').innerHTML = '';
    }
    if (activeForm === 'FU') selectTab ('tab-fuFigures');
  }
  setQueueMenuOptions();
}

// selectFigureFu is called when selecting a figure in Free (Un)known
// designer
function selectFigureFu (id) {
  selectTab ('tab-figureInfo');

  // deselect any previously selected
  var els = document.getElementsByClassName ('fuFig' + selectedFigure.id);
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove ('active');
  }

  var elFT = document.getElementById('t_addFigureText');

  elFT.parentNode.parentNode.classList.add ('hoverdisplay');
  elFT.innerHTML = userText.clickChangeFigure;

  setFigureSelected(id);

  // update all figure options
  updateFigureEditor();

  // set figure chooser for new additionaL and eXtra figures, or hide for others
  if (((figures[id].unknownFigureLetter === 'L') && (figures[id].string === 'L')) ||
    (figures[id].string === 'X')) {
    updateFigureSelectorOptions();
    markMatchingFigures ();
    showFigureSelector ();
  } else {
    hideFigureSelector ();
  }
}

/*******************************************
 * Functions for creating complete sequences
 ******************************************/

// checkFloatingPoint checks if a floating point correction should be
// made and adds this to the figures object where applicable
function checkFloatingPoint () {
  var figureK = 0;
  // in case of floating-point, check total K first to determine
  // how much to take off and where. Disregard additionals.
  if (checkCatGroup.floatingPoint) {
    var figK = [];
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti && !figures[i].additional) {
        // build array figK[i] = XXYY, where XX = K and YY = 99 - i
        // this will enable sorting while keeping K and i relation
        figK[i] = 99 - i;
        for (var j = 0; j < figures[i].k.length; j++) {
           if (!figures[i].unknownFigureLetter) {
             figK[i] += (figures[i].k[j] * 100);
           }
          figureK += parseInt(figures[i].k[j]);
        }
      }
    }
    var fp = figureK - (checkCatGroup.k.max - checkCatGroup.floatingPoint);
    // don't apply fp when K is too high anyway
    if (fp > checkCatGroup.floatingPoint) fp = 0;
    // sort figK low to high
    // identical Ks will be sorted first fig first
    figK.sort(function(a,b){return a - b});
    while (fp > 0) {
      var n = figK.pop();
      if (n) {
        // retrieve correct i and set floatingPoint
        var i = 99 - Math.round(n % 100);
        figures[i].floatingPoint = true;
        fp--;
      }
    }
  }
}

// makeMiniFormA creates a mini form A
// It starts at (x, y) and returns width and height of the block
function makeMiniFormA (x, y) {  

  var blockX = x;
  var blockY = y;
  var figNr = 0;
  var figureK = 0;

  // set the header for the correct sporting class
  if (sportingClass.options[sportingClass.selectedIndex]) {
    var myClass = sportingClass.options[sportingClass.selectedIndex].innerHTML;
    drawText (myClass, blockX + 4, blockY + 17, 'miniFormATotal');
    drawRectangle (blockX, blockY, 152, 24, 'formLine');
    blockY += 24;
  }
  
  var modifiedK = [];
  for (var i = 0; i < figures.length; i++) {
    var aresti = figures[i].aresti;
    var k = figures[i].k;
    if (aresti) {
      figNr++;
      var figK = 0;
      topBlockY = blockY;
      for (var j = 0; j < aresti.length; j++) {
        drawText (aresti[j], blockX + 44, blockY + 16, 'miniFormA');
        if (aresti[j] in aresti_K) modifiedK.push (figNr);
        drawText (k[j], blockX + 104, blockY + 16, 'miniFormA');
        figK += parseInt(k[j]);
        blockY += 12;
      }
      // Adjust figure K for additionals
      if (figures[i].unknownFigureLetter) {
        if (aresti.length < 2) blockY += 12;
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 4, 'miniFormA');
        if (figures[i].unknownFigureLetter == 'L') {
          if (additionals <= additionalFig.max) {
            figK = additionalFig.totalK / additionals;
          } else {
            if (additionalFig.max > 0) {
              figK = additionalFig.totalK / additionalFig.max;
            }
            checkAlert (sprintf (userText.maxAdditionals, additionalFig.max),
              false,
              figNr);
          }
          drawText ('Add.', blockX + 4, (topBlockY + blockY) / 2 + 16, 'miniFormABold');
        } else {
          drawText (figures[i].unknownFigureLetter, blockX + 4,
            (topBlockY + blockY) / 2 + 16, 'miniFormABold');
        }
      } else {
        drawText ('Fig ' + figNr, blockX + 4, (topBlockY + blockY) / 2 + 10, 'miniFormA');
      }
      // adjust figure K for floating point
      if (figures[i].floatingPoint) {
        if (topBlockY == blockY) blockY += 12;
        drawText ('(' + figK + ')', blockX + 130,
          (topBlockY + blockY) / 2 + 15, 'miniFormASmall');
        figK -= 1;
        drawText (figK, blockX + 132, (topBlockY + blockY) / 2 + 5, 'miniFormA');
      } else {
        drawText (figK, blockX + 132, (topBlockY + blockY) / 2 + 10, 'miniFormA');
      }
      drawLine (blockX, topBlockY, 152, 0, 'formLine');
      var vertSize = (blockY - topBlockY + 12);
      drawLine (blockX, topBlockY, 0, vertSize, 'formLine');
      drawLine (blockX + 40, topBlockY, 0, vertSize, 'formLine');
      drawLine (blockX + 100, topBlockY, 0, vertSize, 'formLine');
      drawLine (blockX + 126, topBlockY, 0, vertSize, 'formLine');
      drawLine (blockX + 152, topBlockY, 0, vertSize, 'formLine');
      figureK += figK;
      blockY += 12;
    }
  }
  drawText ('Total K = ' + figureK, blockX + 4, blockY + 17, 'miniFormATotal');
  // add maximum K (corrected for Floating Point) where applicable
  if (rulesActive && checkCatGroup.k && checkCatGroup.k.max) {
    var max = checkCatGroup.k.max;
    if (checkCatGroup.floatingPoint) max -= checkCatGroup.floatingPoint;
    drawText ('(max K = ' + max + ')',
      blockX + 4, blockY + 32, 'miniFormAMax');
      drawRectangle (blockX, blockY, 152, 40, 'formLine');
      blockY += 40;
  } else {
    drawRectangle (blockX, blockY, 152, 24, 'formLine');
    blockY += 24;
  }

  // add text when K has been modified by rules
  if (modifiedK.length) {
    var text = drawTextArea (
      changedFigureKText (modifiedK, rulesActive),
      blockX + 4,
      blockY + 4,
      144,
      100, // height is determined later but needs to be set for iOS
      'miniFormAModifiedK'
    )
    var h = parseInt(text.firstChild.getBoundingClientRect().height);
    blockY += h;
  }

  return {'width':152, 'height':blockY - y};
}

// makeTinyFormA creates a tiny form A (only fig nr, K and total K) for
// mobile devices
// It starts at (x, y) and returns width and height of the block
function makeTinyFormA (x, y) {  
  var
	  blockX = x,
	  blockY = y,
	  figNr = 0,
	  figureK = 0,
	  modifiedK = [];

  // set the header for the correct sporting class
	drawText ('Fig', blockX + 14, blockY + 17, 'formATextBold', 'middle');
	drawText ('K', blockX + 46, blockY + 17, 'formATextBold', 'middle');
	drawRectangle (blockX, blockY, 64, 24, 'formLine');
	drawLine (blockX + 28, blockY, 0, 24, 'formLine');
	blockY += 24;

  for (var i = 0; i < figures.length; i++) {
    var aresti = figures[i].aresti;
    var k = figures[i].k;
    if (aresti) {
      figNr++;
      var figK = 0;
      topBlockY = blockY;
      blockY += 24;
      for (var j = 0; j < aresti.length; j++) {
        if (aresti[j] in aresti_K) modifiedK.push (figNr);
        figK += parseInt(k[j]);
      }
      // Adjust figure K for additionals
      if (figures[i].unknownFigureLetter) {
        drawText (figNr, blockX + 24, (topBlockY + blockY) / 2 + 4,
	        'formATextMedium', 'end');
        if (figures[i].unknownFigureLetter == 'L') {
          if (additionals <= additionalFig.max) {
            figK = additionalFig.totalK / additionals;
          } else {
            if (additionalFig.max > 0) {
              figK = additionalFig.totalK / additionalFig.max;
            }
            checkAlert (sprintf (userText.maxAdditionals, additionalFig.max),
              false,
              figNr);
          }
          drawText ('Add.', blockX + 24, (topBlockY + blockY) / 2 + 16,
	          'formATextBold', 'end');
        } else {
          drawText (figures[i].unknownFigureLetter, blockX + 24,
            (topBlockY + blockY) / 2 + 16, 'formATextBold', 'end');
        }
      } else {
        drawText (figNr, blockX + 24, (topBlockY + blockY) / 2 + 10,
	        'formATextMedium', 'end');
      }
      // adjust figure K for floating point
      if (figures[i].floatingPoint) {
        if (topBlockY == blockY) blockY += 12;
        drawText ('(' + figK + ')', blockX + 60,
          (topBlockY + blockY) / 2 + 15, 'formATextMedium', 'end');
        figK -= 1;
        drawText (figK, blockX + 60, (topBlockY + blockY) / 2 + 5,
	        'formATextMedium', 'end');
      } else {
        drawText (figK, blockX + 60, (topBlockY + blockY) / 2 + 10,
	        'formATextMedium', 'end');
      }
      drawLine (blockX, topBlockY, 64, 0, 'formLine');
      var vertSize = (blockY - topBlockY + 12);
      drawLine (blockX, topBlockY, 0, vertSize, 'formLine');
      drawLine (blockX + 28, topBlockY, 0, vertSize, 'formLine');
      drawLine (blockX + 64, topBlockY, 0, vertSize, 'formLine');
      figureK += figK;
      blockY += 12;
    }
  }
  drawText ('Total K', blockX + 32, blockY + 17, 'formATextMedium', 'middle');
  drawText (figureK, blockX + 32, blockY + 36, 'formATextLarge', 'middle');
  // add maximum K (corrected for Floating Point) where applicable
  if (rulesActive && checkCatGroup.k && checkCatGroup.k.max) {
    var max = checkCatGroup.k.max;
    if (checkCatGroup.floatingPoint) max -= checkCatGroup.floatingPoint;
    drawText ('Max K', blockX + 32, blockY + 54, 'formATextMedium', 'middle');
    drawText (max, blockX + 32, blockY + 74, 'formATextLarge', 'middle');
		drawRectangle (blockX, blockY, 64, 80, 'formLine');
		blockY += 80;
  } else {
    drawRectangle (blockX, blockY, 64, 44, 'formLine');
    blockY += 44;
  }

  // add text when K has been modified by rules
  if (modifiedK.length) {
    var text = drawTextArea (
      changedFigureKText (modifiedK, rulesActive),
      blockX + 4,
      blockY + 4,
      56,
      100, // height is determined later but needs to be set for iOS
      'miniFormAModifiedK'
    )
    var h = parseInt(text.firstChild.getBoundingClientRect().height);
    blockY += h;
  }

  return {'width':64, 'height':blockY - y};
}

/**********************************************************************
 * 
 * Functions for drag & drop repositioning
 * 
 **********************************************************************/
 
// grabFigure will select a figure and allow dragging
function grabFigure(evt) {

  // disable when sequence locked
  if (document.getElementById ('lock_sequence').value) return;
  
  // Put the coordinates of object evt in TrueCoords global.
  if (evt.changedTouches && evt.changedTouches[0] && ('pageX' in evt.changedTouches[0])) {
    TrueCoords.x = evt.changedTouches[0].pageX;
    TrueCoords.y = evt.changedTouches[0].pageY;
  } else {
    TrueCoords.x = evt.clientX;
    TrueCoords.y = evt.clientY;
  }

  var svg = SVGRoot;
  var viewBox = svg.getAttribute('viewBox').split(' ');
   
  dragTarget = null;
  // find out which element we moused down on
  
  // first see if we grabbed a figure handle
  if (evt.target.id.match (/-handle$/)) {
    dragTarget = evt.target;
    dragTarget.targetLine = svg.getElementById (
      dragTarget.id.replace (/-handle$/, ''));
    
    // get dx and dy for this line
    var match = dragTarget.targetLine.getAttribute ('d').match (/l ([0-9\-\.]+),([0-9\-\.]+)/);
    dragTarget.linedx = parseFloat(match[1]);
    dragTarget.linedy = parseFloat(match[2]);
    
    if (dragTarget.id.match (/entry-handle$/)) {
      // get entry gap element
      dragTarget.gap = document.getElementById ('entryExt-value');
      dragTarget.lineLength = parseInt(
        figures[dragTarget.id.match (/^figure(\d+)/)[1]].entryLength
      );
    } else if (dragTarget.id.match (/exit-handle$/)) {
      // get exit gap element
      dragTarget.gap = document.getElementById ('exitExt-value');
      dragTarget.lineLength = parseInt(
        figures[dragTarget.id.match (/^figure(\d+)/)[1]].exitLength
      );
    } else {
      // get current roll gap element
      dragTarget.gap = document.getElementById (
        dragTarget.id.match (/roll\d+-gap\d+/)[0] + '-value');
      
      // get current line length from figures object
      match = dragTarget.id.match (/^figure(\d+)-roll(\d+)-gap(\d+)/);
      var roll = figures [match[1]].rolls [match[2]];
      var gapnr = 0;
      for (var i = 0; i < roll.length; i++) {
        if ('lineLength' in roll[i]) {
          if (gapnr == match[3]) {
            dragTarget.lineLength = Math.max (parseInt(roll[i].lineLength), 0.02);
            break;
          } else gapnr++;
        }
      }
      if (!dragTarget.lineLength) {
        dragTarget.lineLength = Math.max (parseInt(roll.lineLengthAfter), 0.02);
      }
    }
    // get current gap starting value
    dragTarget.gapValue = parseInt(dragTarget.gap.value);
    
    // grab magnifier
  } else if (evt.target.id === 'magnifier') {
    dragTarget = evt.target;

    selectedFigure.bottom = parseInt(selectedFigure.y) + parseInt(selectedFigure.height);
    selectedFigure.scale = document.getElementById ('scale').value;
    selectedFigure.diagonal = Math.sqrt (
      Math.pow (selectedFigure.width,2) + Math.pow (selectedFigure.height, 2));

    // grab full sequence figures
  } else if (evt.target.parentNode.id.match (/^figure[0-9]/)) {
    if (figures[evt.target.parentNode.id.replace('figure', '')].draggable) {
      //set the item moused down on as the element to be dragged
      dragTarget = evt.target.parentNode;
    }
  } else if (evt.target.parentNode.id === 'svgContainer') {
    // clicked somewhere in the SVG container, maybe within figure bBox?
    var svgRect = svg.getBoundingClientRect();
    // svg may be rescaled on smallMobile browser
    var scale = platform.smallMobile ? svg.getAttribute('width')/viewBox[2] : 1;
    var margin = 5 * scale;
    GrabPoint.x = TrueCoords.x;
    GrabPoint.y = TrueCoords.y;
    var x = TrueCoords.x;
    var y = TrueCoords.y;

    var closest = false;
    var minDistSq = Infinity;
    for (var i = figures.length - 1; i >= 0; i--) {
     if (figures[i].draggable) {
       if (svg.getElementById('figure' + i)) {
         var bBox = svg.getElementById('figure'+i).getBoundingClientRect();
         // clicked well within bBox (>margin units within border)?
         if ((x > (bBox.left + margin)) && (x < (bBox.right - margin)) &&
           (y > (bBox.top + margin)) && (y < (bBox.bottom - margin))) {
           // calculate distance squared to bBox centre
           var distSq = Math.pow(x - (bBox.left + (bBox.width / 2)), 2) +
             Math.pow(y - (bBox.top + (bBox.height / 2)), 2);
           if (distSq < minDistSq) {
             minDistSq = distSq;
             closest = i;
           }
         }
       }
     }
    }
    // select figure if the closest centre, within bBox, was found
    if (closest !== false) {
      dragTarget = SVGRoot.getElementById('figure'+closest);
    }
  }
  
  if (dragTarget) {
    evt.preventDefault(); // prevent default drag & drop
    
    // save current scrollTop, to be restored after Drop
    dragTarget.scrollTopSave = document.getElementById('svgContainer').scrollTop;
    dragTarget.scrollLeftSave = document.getElementById('svgContainer').scrollLeft;

    // move this element to the "top" of the display, so it is
    // always over other elements
    if (!dragTarget.id.match (/^(.*-handle|magnifier)$/)) {
      dragTarget.parentNode.appendChild( dragTarget );
    }

    // turn off all pointer events to the dragged element, this does 2 things:
    //    1) allows us to drag text elements without selecting the text
    //    2) allows us to find out where the dragged element is dropped (see Drop)
    dragTarget.setAttribute('pointer-events', 'none');

    // enlarge svg to cover top and left
    if (!platform.smallMobile) {
      var svgRect = svg.getBoundingClientRect();
      var w = parseInt(viewBox[2]) + parseInt(svgRect.left) +
	      parseInt(dragTarget.scrollLeftSave);
      var h = parseInt(viewBox[3]) + parseInt(svgRect.top) +
	      parseInt(dragTarget.scrollTopSave);
      svg.setAttribute ('viewBox',
        roundTwo(viewBox[0] - svgRect.left - dragTarget.scrollLeftSave) + ' ' +
        roundTwo(viewBox[1] - svgRect.top - dragTarget.scrollTopSave) + ' ' + w + ' ' + h
      );
      svg.setAttribute ('width', w);
      svg.setAttribute ('height', h);
      // correct position for padding
      svg.parentNode.classList.add ('sequenceOverlay');
      var main = document.getElementById ('main');
      document.getElementById ('leftBlock').setAttribute ('style',
        'margin-top: ' + (main.offsetTop + main.parentNode.offsetTop) + 'px');
      document.getElementById ('leftBlockTabSelector').setAttribute ('style',
        'top: ' + (main.offsetTop + main.parentNode.offsetTop) + 'px');
      main.setAttribute ('style', 'top: ' + (0-main.parentNode.offsetTop) + 'px;');

    }
    
    // we need to find the current position and translation of the grabbed element,
    //    so that we only apply the differential between the current location
    //    and the new location
    GrabPoint.x = TrueCoords.x;
    GrabPoint.y = TrueCoords.y;
    
    // blur sequenceText area
    sequenceText.blur();

    // the dragTarget id is the new selectedFigure.id
    if (!dragTarget.id.match (/^(.*-handle|magnifier)$/)) {
      selectFigure(dragTarget.id.replace('figure', ''));
    }

  } else {
    selectFigure(false);
    if (this.classList.contains ('draggablePanel')) {
      this.classList.add ('dragging');
      dragTarget = this;
      //evt.preventDefault(); // prevent default drag & drop
      var transform = dragTarget.style.transform.match (/-?[\d]*px/g) || [0, 0];

      GrabPoint.x = TrueCoords.x - parseInt(transform[0]);
      GrabPoint.y = TrueCoords.y - parseInt(transform[1]);
    }
  }
}

// setFigChooser sets the figure chooser to the correct group and
// highlights the figure provided by figNr
function setFigChooser (figNr) {
  // check if fig[figNr] is valid
  if (fig[figNr]) {
    var select = document.getElementById ('figureGroup');
    var options = select.options;
    for (var i = options.length - 1; i >= 0; i--) {
      if (options[i].value == fig[figNr].group) {
        options[i].setAttribute('selected', 'true');
        var selectedGroup = options[i];
        select.selectedIndex = i;
      } else {
        options[i].removeAttribute('selected');
      }
    }
    changeFigureGroup(selectedGroup);
    // Select the correct figure and scroll selector there
    var td = document.getElementById(figNr).parentNode;
    td.classList.add ('selected');
    // Set the vertical offset of the <tr> in which the element is
    document.getElementById('figureChooser').scrollTop = td.parentNode.offsetTop;
  }
  updateFigureSelectorOptions();
}

// setFigureSelected sets the active figure and applies color filter
function setFigureSelected (figNr) {

  if (figNr === false) figNr = null;
  // define header element for info
  var header = document.getElementById('figureHeader');

  if (activeForm != 'FU') {
    // if any figure was previously selected, remove that filter
    var selFig = SVGRoot.getElementById('figure'+selectedFigure.id);
    if (selFig) {
			var nodes = selFig.childNodes;
			for (var i = nodes.length - 1; i >= 0; i--) {
				var s = nodes[i].getAttribute('style');
				if (s) {
					s = s.replace (/#ff00a0/g, 'black');
					s = s.replace (/#ff1090/g, 'red');
					nodes[i].setAttribute ('style', s);
				}
				if (nodes[i].id &&
					nodes[i].id.match (/^(.*-handle|magnifier|selectedFigureBox)$/)) {
					selFig.removeChild (nodes[i]);
				}
			}
    }
          
    if (figNr !== null) {

	    // fill selectedFigure with BBox values
	    var el = SVGRoot.getElementById('figure'+figNr);

      header.innerHTML = userText.editingFigure + figures[figNr].seqNr +
	      ' (' + figures[figNr].k.reduce(function(a, v) { return a + v; }) + 'K)';
      
      if (el) {
	      var
		      svgScale = roundTwo (SVGRoot.viewBox.baseVal.width /
			      SVGRoot.width.baseVal.value) || 1,
		      showHandles = document.getElementById ('showHandles').checked &&
		        !(activeForm === 'Grid'),
	        nodes = el.childNodes,
	        length = nodes.length;
				selectedFigure = el.getBBox();
				// apply color filter
        for (var i = 0 ; i < length; i++) {
          var s = nodes[i].getAttribute('style');
          if (s) {
            s = s.replace (/black/g, '#ff00a0');
            s = s.replace (/red/g, '#ff1090');
            nodes[i].setAttribute ('style', s);
          }
          // add editing handles where applicable. They are centered on
          // the element. Somewhat larger circles for touch devices to
          // improve grabbing, corrected for svg scaling
          if (nodes[i].id && showHandles) {
            var bBox = nodes[i].getBBox();
            drawCircle ({
              'cx': roundTwo(bBox.x + bBox.width / 2),
              'cy': roundTwo(bBox.y + bBox.height / 2),
              'r': platform.touch ? 12 * svgScale : 8,
              'style': style.selectedFigureHandle,
              'cursor': 'move',
              'id': nodes[i].id + '-handle'
            }, el);
          }
        }
        // add scale handle
        if (showHandles) {
          drawImage ({
            x: selectedFigure.x + selectedFigure.width - 6,
            y: selectedFigure.y - 9,
            width: 28 * svgScale,
            height: 28 * svgScale,
            'id': 'magnifier',
            cursor: 'move',
            href: 'img/magnifier.svg'}, el);
        }

      }
    }
  } else {
    var el = document.getElementsByClassName ('fuFig' + figNr)[0];
    if (el) el.classList.add ('active');
    header.innerHTML = userText.editingFigure;
  }

  // set selectedFigure.id
  selectedFigure.id = figNr;
}

// Drag allows to drag the selected figure or handle to a new position
function Drag (evt) {

  if (!dragTarget) return;
  
  // don't drag figures when in grid view
  if ((activeForm === 'Grid') && !dragTarget.classList.contains  ('draggablePanel')) return;
  
  // put the coordinates of object evt in TrueCoords global
  if (platform.touch && evt.changedTouches && evt.changedTouches[0] && evt.changedTouches[0].pageX) {
    TrueCoords.x = evt.changedTouches[0].pageX;
    TrueCoords.y = evt.changedTouches[0].pageY;
  } else {
    TrueCoords.x = evt.clientX;
    TrueCoords.y = evt.clientY;
  }
  
  // if we don't currently have an element in tow, don't do anything
  if (dragTarget) {
    
    // prevent scrolling on touch devices
    if (platform.touch) evt.preventDefault();
    
    // find out what we are dragging
    if (dragTarget.id.match (/-handle$/)) {
      
      /** dragging a handle */
    
      var crossLineC = -dragTarget.linedx * GrabPoint.x - dragTarget.linedy * GrabPoint.y;
      // calculate the correct displacement of the handle, along it's
      // line
      var d = (dragTarget.linedx * TrueCoords.x +
        dragTarget.linedy * TrueCoords.y + crossLineC) /
        (Math.pow (dragTarget.linedx, 2) +
        Math.pow (dragTarget.linedy, 2));
      var newX = dragTarget.linedx * d;
      var newY = dragTarget.linedy * d;

      // do not adjust all the way to 0 line length
      if (d > -0.5) {
        // apply a new tranform translation to the dragged handle, to
        // display it in its new location
        dragTarget.setAttribute('transform',
          'translate(' + newX + ',' + newY + ')');
        
        // transform the line which we are adjusting
        newX *= 2;
        newY *= 2;
        var d = dragTarget.targetLine.getAttribute ('d');
        d = d.replace (/l ([0-9\-\.]+),([0-9\-\.]+)/, 'l ' +
          (dragTarget.linedx + newX) + ',' +
          (dragTarget.linedy + newY));
        dragTarget.targetLine.setAttribute ('d', d);
        
        // also change the gap value to reflect this transform
        if (dragTarget.linedx != 0) {
          dragTarget.gap.value = Math.round (dragTarget.gapValue +
            (dragTarget.lineLength / dragTarget.linedx) * newX);
        } else {
          dragTarget.gap.value = Math.round (dragTarget.gapValue +
            (dragTarget.lineLength / dragTarget.linedy) * newY);
        }
        
        // when adjusting a vertical up, we need to check if this is
        // followed by a hammerhead or point tip
        // If so, we don't adjust the position of anything following it.
        var el = dragTarget.targetLine;
        var elStop = null;
        var lastHandle = null;
        do {
          if (el.id) lastHandle = el.id + '-handle';
          var elClass = el.getAttribute ('class');
          if (elClass) {
            // break if no longer vertical up
            if ((elClass === 'line') &&
              !el.getAttribute('d').match (/l 0,-/)) break;
            if (elClass.match (/^(hammer|point)Tip$/)) {
              // found a hammerhead or point tip!
              elStop = el;
              break;
            }
          }
        } while (el = el.nextSibling);
        // there's only a last handle when a stop element was found
        if (!elStop) lastHandle = null;
        
        // move all later elements of this figure, upto stop if applicable
        var el = dragTarget.targetLine;
        while (el !== elStop) {
          if (!(el = el.nextSibling)) break;
          if (!el.id.match (/-handle$/)) {
            el.setAttribute('transform',
              'translate(' + newX + ',' + newY + ')');
          }
        }
        
        // and move all later handles, upto last if applicable
        el = dragTarget;
        while ((lastHandle !== el.id)) {
          if (!(el = el.nextSibling)) break;
          if (el.id.match (/-handle$/)) {
            el.setAttribute('transform',
              'translate(' + newX + ',' + newY + ')');
          }
        }
        
        // move subsequent figures, if no elStop
        if (elStop === null) {
          for (var figureNr = parseInt(dragTarget.parentNode.id.match (/\d+/)) + 1;
            figureNr < figures.length; figureNr++) {
            var figure = SVGRoot.getElementById ('figure' + figureNr);
            if (figure) {
              figure.setAttribute('transform',
                'translate(' + newX + ',' + newY + ')');
            }
          }
        }

        // Adjust magnifier position
        // Do this by first removing it, then determining the bBox and
        // putting it back
        dragTarget.parentNode.removeChild(dragTarget.parentNode.lastChild);
        var
	        bBox = dragTarget.parentNode.getBBox(),
	        svgScale = roundTwo (SVGRoot.viewBox.baseVal.width /
		        SVGRoot.width.baseVal.value) || 1;
        // add scale handle
        drawImage ({
          x: bBox.x + bBox.width - 10,
          y: bBox.y - 10,
          width: 28 * svgScale,
          height: 28 * svgScale,
          'id': 'magnifier',
          cursor: 'move',
          href: 'img/magnifier.svg'}, dragTarget.parentNode);
      }
    } else if (dragTarget.id === 'magnifier') {
      
      /** dragging magnifier */
            
      var scale = Math.sqrt (
        Math.pow (TrueCoords.x + parseInt(selectedFigure.width) - GrabPoint.x, 2) +
        Math.pow (-TrueCoords.y + parseInt(selectedFigure.height) + GrabPoint.y, 2)) /
        selectedFigure.diagonal;
      
      // scale figure (and magnifier)
      dragTarget.parentNode.setAttribute ('transform',
        'translate (' +
        ((parseInt(selectedFigure.x)) * (1 - scale)) + ',' +
        ((parseInt(selectedFigure.bottom)) * (1 - scale)) +
        ') scale (' + scale + ')');
      
      // Set scale. Math.log gets the natural logarithm. The number
      // 14.427 = 10 / log (2)
      document.getElementById ('scale').value = parseInt (
        parseInt(selectedFigure.scale) + Math.log (scale) * 14.427);
      
    // Don't drag the first real figure, it's auto positioned
    } else if (dragTarget.id.match (/^figure/) &&
      (figures[dragTarget.id.replace (/^figure/, '')].seqNr != '1')) {
      
      /** dragging a complete figure */
    
      // account for the offset between the element's origin and the
      // exact place we grabbed it 
      var newX = parseInt(TrueCoords.x - GrabPoint.x);
      var newY = parseInt(TrueCoords.y - GrabPoint.y);

      // apply a new tranform translation to the dragged element, to display
      // it in its new location
      dragTarget.setAttribute('transform', 'translate(' + newX + ',' + newY + ')');

      // move subsequent figures
      for (var figureNr = parseInt(dragTarget.id.match (/\d+/)) + 1; figureNr < figures.length; figureNr++) {
        var figure = SVGRoot.getElementById ('figure' + figureNr);
        if (figure) {
          figure.setAttribute('transform',
            'translate(' + newX + ',' + newY + ')');
        }
      }

    } else if (dragTarget.id === 'gridInfo') {
      var newX = parseInt(TrueCoords.x - GrabPoint.x);
      var newY = parseInt(TrueCoords.y - GrabPoint.y);

      // apply a new tranform translation to the dragged element, to
      // display it in its new location. Only allow translation to left
      // and bottom, and limit to left edge
      dragTarget.style.transform = 'translate(' + Math.min (newX, 0) + 
        'px,' + Math.max (newY, 0) + 'px)';
      var leftX = dragTarget.getBoundingClientRect().left;
      if (leftX < 0) {
        dragTarget.style.transform = 'translate(' + Math.min (newX - leftX, 0) + 
          'px,' + Math.max (newY, 0) + 'px)';
      }
      
      return;
    }        
    

    // Adjust sequence SVG size
    var
	    bBox = SVGRoot.getElementById ('sequence').getBBox(),
	    viewBox = SVGRoot.getAttribute('viewBox').split(' '),
	    w = roundTwo((bBox.x - viewBox[0]) + bBox.width + 5),
	    h = roundTwo((bBox.y - viewBox[1]) + bBox.height + 5);
    SVGRoot.setAttribute ('viewBox',
      viewBox[0] + ' ' +
      viewBox[1] + ' ' +
      w + ' ' +
      h
    );
    if (!platform.smallMobile) {
      SVGRoot.setAttribute('width', w);
      SVGRoot.setAttribute('height', h);
    }
  }

}

// Drop is activated when a figure or handle is dropped
function Drop(evt) {
  
  // if we aren't currently dragging an element, don't do anything
  if (!dragTarget) return;
  
  function restoreViewBox () {
    var bBox = SVGRoot.getBBox();
    SVGRoot.setAttribute ('viewBox', roundTwo(bBox.x) + ' ' +
	    roundTwo(bBox.y) + ' ' + (parseInt(bBox.width) + 5) + ' ' +
	    (parseInt(bBox.height) + 5));
    if (!platform.smallMobile) {
      SVGRoot.setAttribute ('width', parseInt(bBox.width) + 5);
      SVGRoot.setAttribute ('height', parseInt(bBox.height) + 5);
    }
  }

	document.getElementById('main').style = '';
  //if (platform.touch) evt.preventDefault();

  // turn the pointer-events back on, so we can grab this item later
  dragTarget.setAttribute('pointer-events', 'all');
  
  if (dragTarget.classList.contains ('draggablePanel')) {
    dragTarget.classList.remove ('dragging');
    dragTarget = null;
    return;
  }
  
  // restore svgContainer size
  SVGRoot.parentNode.classList.remove ('sequenceOverlay');
  document.getElementById ('leftBlock').removeAttribute ('style');
  document.getElementById ('leftBlockTabSelector').removeAttribute ('style');
  
  var transform = dragTarget.getAttribute('transform');
  
  if (dragTarget.id.match (/^(.*-handle|magnifier)$/)) {
    
    /** dropping a handle or magnifier */
    
    updateFigure();
    restoreViewBox();
    
  } else {
    
    /** dropping a complete figure */
    
    // create curveTo for dragged elements when not in grid view
    if (transform && (activeForm !== 'Grid')) {
		  // make sure a comma is used for x y separation in transform
			transform = transform.replace (/ /, ',');
      var dxdy = transform.match(/[0-9\-\.]*,[0-9\-\.]*/)[0].split(',');
      var dx = parseInt(dxdy[0] / lineElement)
      var dy = parseInt(dxdy[1] / lineElement)
      // reverse direction for dragging in Form C
      if (/^[CL]$/.test(activeForm)) dx = -dx;
      if ((dx != 0) || (dy != 0)) {
	      updateSequence (dragTarget.id.replace('figure', '') - 1,
	        '(' + dx + ',' + dy + ')',
	        false,
	        false,
	        true);
			} else {
				restoreViewBox();
			}
    } else {
      restoreViewBox();
    }
  }

  document.getElementById('svgContainer').scrollTop = dragTarget.scrollTopSave;
  document.getElementById('svgContainer').scrollLeft = dragTarget.scrollLeftSave;
            
  // set the global variable to null, so nothing will be dragged until
  // we grab the next element
  dragTarget = null;

  //if (!platform.touch) sequenceText.focus();

}

/**********************************************************************
 * 
 * Functions for point & click altering of the sequence
 * 
 **********************************************************************/
 
// changeEntryDirection alters the entry direction of the sequence
function changeEntryDirection () {
	var 
		prevEntry = '',
		doFlipY = false;
		
  // get code
  for (code in entryOptions) {
    if (entryOptions[code] === this.id.replace(/^t_/, '')) break;
  }
  updateSequenceOptions ('');
  if (activeSequence.figures[0] && entryOptions[activeSequence.figures[0].string]) {
		prevEntry = activeSequence.figures[0].string;
  }

  // Flip move options if applicable. Would like to do full rotation
  // support (also ej and eja) but this would result in y -> -y on 180
  // rotation. So only support for changing directly from upwind to
  // downwind and vv
  if ((code + prevEntry) === 'ed') { // match 'ed' + '' and '' + 'ed'
		for (var i = 0; i < figures.length; i++) {
			if (regexCurveTo.test (figures[i].string) || regexMoveTo.test (figures[i].string)) {
			  var dxdy = figures[i].string.replace(/[^0-9\,\-]/g, '').split(',');
				updateSequence (i,
					figures[i].string[0] + -parseInt(dxdy[0]) + ',' + dxdy[1] +
						figures[i].string[figures[i].string.length - 1],
					true);
			}
			// flip Y axis when we have a crossbox inside the sequence
			if (figures[i].entryAxis === 'Y') doFlipY = true;
		}
	}

  // insert before start or replace first
  updateSequence (prevEntry ? 0 : -1, code, prevEntry ? true : false);
  
  if (doFlipY) flipYAxis();
}

// flipYAxis will flip the drawn direction of the Y axis for the whole
// sequence
function flipYAxis () {
  var v = sequenceText.innerText;
  if (v.replace(regexComments, '').match(regexFlipYAxis)) {
    // disable flip
    var t = '';
    var inComment = false;
    for (var i = 0; i < v.length; i++) {
      // disregard / in comments
      if (v[i] === userpat.comment) inComment = !inComment;
      // check for single /
      if ((v[i] === '/') && !inComment) {
        if (i < (v.length - 1)) {
          // keep double //
          if (v[i + 1] === '/') {
            t += '//';
            i++;
          }
        }
      } else {
        t += v[i];
      }
    }
    sequenceText.innerText = t;
  } else {
    // add flip to first real figure, if it exists
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) {
        updateSequence (i, userpat.flipYaxis + figures[i].string, true);
        break;
      }
    }
  }
  checkSequenceChanged();
}

// updateSequenceOptions updates the sequence options to reflect the
// active start of the sequence. The active start is NOT displayed as an
// option
function updateSequenceOptions (code) {
  // disable when sequence locked
  if (document.getElementById ('lock_sequence').value) return;

  el = document.getElementById('sequenceOptions');
  if (el) {
    
    if (code === 'eu') code = '';
    for (key in entryOptions) {
      var el = document.getElementById ('t_' + entryOptions[key]);
      if (code !== key) {
        el.addEventListener ('mousedown', changeEntryDirection);
        el.parentNode.classList.remove ('disabled');
      } else {
        el.removeEventListener ('mousedown', changeEntryDirection);
        el.parentNode.classList.add ('disabled');
      }
    }
  }
}

// clearPositioning removes all figure positioning elements
function clearPositioningOption () {
  // only do this when on Form B or C
  if ((activeForm === 'B') || (activeForm === 'C')) {
    // confirm clearing the position formatting
    confirmBox (userText.clearPositioningConfirm,
      userText.clearPositioning, clearPositioning);
  } else {
    alertBox (userText.notOnFormBC);
  }
}

// clearPositioning removes all figure positioning elements
function clearPositioning () {
	var changesMade = false;
  // make sure no figure is selected
  selectFigure (false);
  // remove all moveTo, curveTo and moveForward figures
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
      updateSequence (i, '', true);
      if (changesMade) activeSequence.undo.pop();
      changesMade = true;
      i--;
    }
  }
  return changesMade;
}

// separateFigure will make sure figures are separated from previous and
// next figures when:
// - newly created, or
// - base figure changed
function separateFigure (id) {
  if (figures[id]) {
    var selectFig = selectedFigure.id;
    // remove any previous move 'figure'
    var i = id - 1;
    if (figures[i]) {
      if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
        selectFig--;
        updateSequence (i, '', true);
        i--;
      }
    }
    i++;
    // need to define bBox here
    figures[i].bBox = myGetBBox(document.getElementById('figure' + i));
    // separate the figure itself
    if (moveClear (i)) {
      i++;
      selectFig++;
    }
    // select correct figure
    setFigureSelected (selectFig);
    // find the next real figure and separate that one
    i++;
    while (figures[i]) {
      if (figures[i].aresti) {
        moveClear (i);
        break;
      } else if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
        // remove move 'figures'
        updateSequence (i, '', true);
      } else {
        i++;
      }
    }
  }
}

// separateFigures separates all the figures from each other. This is
// done vertically with a curveTo
function separateFigures (noConfirm) {
	
  function f () {
		// clearPositioning is false when no changes were made. In this
		// case, add undo
    if (!clearPositioning()) {
			activeSequence.undo.push (activeSequence.xml);
		}
    // start a loop that will continue until nothing's done any more
    do {
      var breakLoop = false;
      var i = 1;
      // start going through the figures from the second figure
      while ((i < figures.length) && !breakLoop) {
        moveClear (i);
        i++;
      }
    } while (breakLoop);
  }

  // only do this when on Form B or C
  if ((activeForm === 'B') || (activeForm === 'C')) {
    if (noConfirm === true) {
      f();
    } else {
      // confirm clearing the position formatting. When confirmed, the
      // function f is executed
      confirmBox (userText.separateFiguresConfirm,
        userText.separateFigures, f);
    }
  } else {
    alertBox (userText.notOnFormBC);
  }
}

// moveClear will move figure i clear from all previous figures
// The return value is true when the figure is moved
function moveClear (i) {
  // put separateMargin in m
  var m = separateMargin;
  // get the bBox set for the figure
  var bBoxI = figures[i].bBox;
  // only do something for real Aresti figures
  if (bBoxI && figures[i].aresti) {
    var moveDown = 0;
    // loop through all nodes of relevant figures. Whenever we encounter
    // an overlap the figure will be moved down and tests run anew.
    do {
      var repeat = false;
      // go through all previous figures
      for (var j = i - 1; j >= 0; j--) {
        var bBoxJ = figures[j].bBox;
        if (bBoxJ && figures[j].aresti) {
          // go through all nodes of previous figures
          for (var k = 0; k < bBoxJ.nodes.length; k++) {
            var bBoxK = bBoxJ.nodes[k];
            // go through all nodes of this figure
            for (var l = 0; l < bBoxI.nodes.length; l++) {
              // set 
              var bBox = bBoxI.nodes[l];
              // check if we have overlap. If so, adjust movedown
              if (((bBox.right + m) > bBoxK.x) &&
	              ((bBox.x - m) < (bBoxK.x + bBoxK.width))) {
                if (((bBox.bottom + moveDown + m) > bBoxK.y) &&
	                ((bBox.y + moveDown - m) < (bBoxK.y + bBoxK.height))) {
                  moveDown += bBoxK.y + bBoxK.height - (bBox.y + moveDown) + m;
                  repeat = true;
                }
              }
              if (repeat) break;
            }
            if (repeat) break;
          }
          if (repeat) break;
        }
      }
    } while (repeat);
    if (moveDown > 0) {
      moveDown = Math.ceil(moveDown/lineElement);
      // No longer necessary because we redraw every time. This code could be
      // quicker but needs extra work. Keep it here just in case...
      //        for (j = i; j < figures.length; j++) {
      //          if (figures[j].bBox) figures[j].bBox.y = figures[j].bBox.y + (moveDown * lineElement)
      //        }
      var xml = activeSequence.xml;
      updateSequence(i - 1, '(0,' + moveDown + ')', false);
      // don't add undo for this
      activeSequence.undo.pop();
      breakLoop = true;
      return true;
    }
  }
  return false;
}

// drawFullFigure draws a complete Aresti figure in the sequenceSvg
// or in an other svg object when provided
function drawFullFigure (i, draggable, svg) {
  // default to SVGRoot when no svg object provided
  svg = svg || SVGRoot;
  // Mark the starting position of the figure
  figures[i].startPos = {'x':X, 'y':Y};
  figures[i].draggable = draggable;
  svgElement = svg.getElementById('sequence');
  var paths = figures[i].paths;
  // return for no-draw figures
  if (!paths) return;
  // Create a group for the figure, draw it and apply to the SVG
  var group = document.createElementNS (svgNS, "g");
  group.setAttribute('id', 'figure' + i);
  // put the group in the DOM
  svgElement.appendChild(group);
  var bBox = false;
  for (var j = 0; j < paths.length; j++) {
    var box = drawShape (paths[j], group, bBox);
    if (box) bBox = box;
  }

  figures[i].bBox = myGetBBox (group);

  if ((selectedFigure.id === i) && draggable) setFigureSelected (i);

}

// setQueueMenuOptions enables/disables queue menu options as applicable
function setQueueMenuOptions() {
  document.getElementById('t_addToQueue').parentNode.removeEventListener('mousedown', addToQueue);
  document.getElementById('t_addAllToQueue').parentNode.removeEventListener('mousedown', addAllToQueue);
  document.getElementById('t_clearQueue').parentNode.removeEventListener('mousedown', clearQueue);
  document.getElementById('t_saveQueueFile').parentNode.removeEventListener('mousedown', saveQueue);
  if (fig[fig.length - 1] && fig[fig.length - 1].group == 0) {
    document.getElementById ('t_clearQueue').parentNode.classList.remove ('disabled');
    document.getElementById ('t_saveQueueFile').parentNode.classList.remove ('disabled');
    document.getElementById('t_clearQueue').parentNode.addEventListener('mousedown', clearQueue);
    document.getElementById('t_saveQueueFile').parentNode.addEventListener('mousedown', saveQueue);
  } else {
    document.getElementById ('t_clearQueue').parentNode.classList.add ('disabled');
    document.getElementById ('t_saveQueueFile').parentNode.classList.add ('disabled');
  }
  if (figures[selectedFigure.id]) {
    document.getElementById ('t_addToQueue').parentNode.classList.remove ('disabled');
    document.getElementById('t_addToQueue').parentNode.addEventListener('mousedown', addToQueue);
  } else {
    document.getElementById ('t_addToQueue').parentNode.classList.add ('disabled');
  }
  if (figures.length) {
    document.getElementById ('t_addAllToQueue').parentNode.classList.remove ('disabled');
    document.getElementById('t_addAllToQueue').parentNode.addEventListener('mousedown', addAllToQueue);
  } else {
    document.getElementById ('t_addAllToQueue').parentNode.classList.add ('disabled');
  }
}

// showQueue shows the figure queue
function showQueue () {
  var select = document.getElementById ('figureGroup');
  select.selectedIndex = 0;
  changeFigureGroup(select.options[0]);
  //switchQueue (document.getElementById ('t_switchQueue'));
  showFigureSelector();
}

// chnageQueueColumns changes the amount of columns in queue
function changeQueueColumns () {
  saveSettingsStorage();
  // clear queue figure SVGs first, to allow resizing
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i] && (fig[i].group == 0)) fig[i].svg = false;
  }
  showQueue();
}

// addToQueue adds the selected figure to the figure queue
function addToQueue () {
  var f = figures[selectedFigure.id];
  var figNr = f.figNr;
  // create aresti string
  // queue-[base]-[roll1]-[roll2]-...
  var aresti = 'queue';
  for (var i = 0; i < f.aresti.length; i++) {
    aresti += '-' + f.aresti[i];
  }
  var figLen = fig.length;
  // check if the figure is already in the queue
  var i = figLen - 1;
  while (fig[i]) {
    if (fig[i].group == 0) {
      if (fig[i].aresti == aresti) {
        alertBox (userText.figureAlreadyInQueue);
        return;
      }
      i--;
    } else break;
  }
  // append the figure to the fig object
  fig[figLen] = {'aresti':aresti,
                'base':fig[figNr].base,
                'rolls':fig[figNr].rolls,
                'draw':fig[figNr].draw,
                'pattern':fig[figNr].pattern,
                'kpwrd':fig[figNr].kpwrd,
                'kglider':fig[figNr].kglider};

  // add properties
  fig[figLen].unknownFigureLetter = f.unknownFigureLetter;
  // set queue group nr
  fig[figLen].group = 0;
  // remove extensions/shortenings
  var string = f.string;
  string = string.replace(regexExtendShorten, '').replace(/-+/g, '-');
  // remove comments
  string = string.replace(regexComments, '');
  // correct X/Y axis switch where necessary. Queue figures always
  // start on X axis
  if (f.entryAxis == 'Y') {
    string = string.replace(regexSwitchDirY, '#').
	    replace(regexSwitchDirX, userpat.switchDirY).
	    replace(/#/g, userpat.switchDirX);
  }
  // Handle the very special case where there's only an upright or
  // inverted spin and the base figure is an iv
  if (string.match (/(\d|)(s|is)/) && !string.match (/iv/) && fig[figLen].base.match (/iv/)) {
    string = string.replace (/(\d*)(s|is)/, "iv$1$2");
  }

  fig[figLen].string = string;
  showQueue();
  setQueueMenuOptions();  
  queueToStorage ();
}

// addAllToQueue adds all figures in sequence to queue
function addAllToQueue () {

  // check if there are any figures to add
  var noFigures = true;
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) {
      noFigures = false;
      break;
    }
  }
  if (noFigures) {
    alertBox (userText.addAllToQueueNoFigures, userText.addAllToQueue);
    return
  }
  
  infoBox (userText.addAllToQueueWait, userText.addAllToQueue);
  setTimeout(function(){
    var f = selectedFigure.id;
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) {
        selectFigure(i);
        addToQueue();
      }
    }
    // remove infoBox
    infoBox ();
    // reselect original selected figure
    selectFigure(f);
    // set the figure chooser to the queue group
    document.getElementById ('figureGroup').value = '0';
    changeFigureGroup();
  }, 100);
}

// removeFromQueue removes a figure from the queue
function removeFromQueue (e) {
  noPropagation(e);
  fig.splice(e.target.parentNode.id.replace(/^removeFromQueue/, ''), 1);
  showQueue();
  setQueueMenuOptions();
  queueToStorage();
}

// clearQueue removes all figures from queue
function clearQueue () {
  var figLast = fig.length - 1;
  while (!fig[figLast]) {
    fig.length -= 1;
    figLast -= 1;
  }
  // only do anything when there are actually figures in the queue
  if (fig[figLast].group == 0) {
    showQueue();
    // confirm removing all
    confirmBox (userText.clearQueueConfirm, userText.clearQueue, function(){    
      // start removing figures
      var i = figLast;
      while (fig[i]) {
        if (fig[i].group == 0) {
          fig.pop();
          i--;
        } else break;
      }
      hideFigureSelector();
      setQueueMenuOptions();
      storeLocal ('queue', []);
    });
  }
  showQueue();
}

// queueToStorage saves the queue to localStorage to keep it through
// restarts
function queueToStorage () {
  var queue = [];
  var figLast = fig.length - 1;
  while (!fig[figLast]) figLast--;
  
  while (fig[figLast] && (fig[figLast].group == 0)) {
    queue.push (fig[figLast]);
    figLast--;
  }

  storeLocal ('queue', JSON.stringify(queue));
}

// queueFromStorage retrieves the queue from localStorage
function queueFromStorage () {
  getLocal ('queue', function (string) {
    if (string) {
      var queue = JSON.parse(string);
      while (queue && queue.length) {
        fig.push(queue.pop());
      }
    }
    setQueueMenuOptions();
  });
}

/***********************************************************************
 * 
 * Free (Un)known Designer
 * 
 **********************************************************************/
 
// startFuDesigner starts the Free (Un)known Designer
function startFuDesigner(dontConfirm) {
  if (!figureLetters) {
    alertBox (userText.FUDesignNotFreeUnknown, userText.fuDesigner);
    return;
  }
  if (!buildFuFiguresTab()) {
    console.log('Unable to start Free (Un)known Designer');
    return;
  }
  
  function f () {
    // Free (Un)known designer will not work in smallMobile browser layout
    if (platform.smallMobile) switchSmallMobile();

    // unlock sequence when locked
    if (document.getElementById ('lock_sequence').value) lockSequence();
    
    // deactivate any active menus, dialogs etc
    var active = document.getElementsByClassName ('active');
    while (active.length > 0) active[0].classList.remove ('active');
    
    infoBox (userText.FUstarting, userText.fuDesigner);

    // use setTimeout to assure the infoBox shows    
    setTimeout (function() {
      selectFigure (false);
      clearPositioning ();
      
      // add fuDesigner class to body
      document.body.classList.add ('fuDesigner');
      
      if (platform.mobile) {
				// move items from File menu to main menu for quick access
				var items = document.getElementsByClassName ('menuFileItem');
				for (var i = 0; i < items.length; i++) {
					document.getElementById ('menu').insertBefore (
						items[i], document.getElementById ('menuFile'));
				}
				document.getElementById ('menuFile').classList.add ('noDisplay');
			} else {
	      // move undoRedo and set topBlock height
	      var undoRedo = document.getElementById ('undoRedo');
	      document.getElementById ('mainMenu').insertBefore (
	        undoRedo, document.getElementById ('t_finalizeSequence'));
	    }
  
      // clear undo and redo
      activeSequence.undo = activeSequence.redo = [];
        
      // select the tab
      document.getElementById ('fuFigures').classList.remove ('noDisplay');
      document.getElementById ('tab-fuFigures').classList.remove ('noDisplay');
      selectTab ('tab-fuFigures');
      document.getElementById ('figureSelector').classList.add ('left');
            
      // clear the sequence if loading from Grid and no Additional
      // figure present
      var noAdditional = true;
      for (var i = 0; i < figures.length; i++) {
        if (figures[i].unknownFigureLetter === 'L') {
          noAdditional = false;
          break;
        }
      }
  
      if ((activeForm === 'Grid') && noAdditional) {
        var text = 'eu';
      } else {
        // rebuild the sequence according Free (Un)known designer format
        // remove / symbols and entry/exit extension from 
        var text = '';
        for (var i = 0; i < figures.length; i++) {
					// only add figures with aresti Nr. For Unknown, only add
					// those that have a figure letter
          if (figures[i].aresti && (figures[i].unknownFigureLetter ||
	          !additionalFig.max)) {
            var string = figures[i].string;
            // remove extensions, shortenings and y axis switch
            string = string.replace(/[~\.'`\+\/]/g, '').replace(/-+/g, '-');
            // remove comments
            string = string.replace(regexComments, '');
            if (!figures[i].unknownFigureLetter) {
							text += string + ' ';
						} else {
	            text += '"@' + figures[i].unknownFigureLetter +
	              '" ' + string + ' ';
						}
          } else if (figures[i].subSequence) {
            text += figures[i].subSequence + ' ';
          }
        }

        text = text.trim().replace(/ e(u|d|j|ja)$/, '') + ' eu';
        if (!text.match (/^e(u|d|j|ja) /)) text = 'eu ' + text;
        if (text === 'eu eu') text = 'eu';
      }
      
      sequenceText.innerText = text;
      
      checkSequenceChanged (true);
  
      // add new stylesheet rule 0 to hide all elements with class
      // disableFUdesigner. Only do this after checkSequenceChanged as
      // otherwise it may break some bBox routines!
      document.getElementById ('fuDesignerStyle').innerHTML =
	      '.disableFUdesigner{display:none !important;}';
  
      selectForm('FU');
      availableFigureGroups();
      
      infoBox();
    }, 300);
  }
  
  if (dontConfirm) {
    f();
  } else {
    confirmBox (userText.clearPositioningConfirm, userText.fuDesigner, f);
  }
}

// exitFuDesigner is called to exit the Free (Un)known designer. Several
// checks are done and warnings presented if necessary.
// newSequence is true when we are exiting because of loading of new
// sequence
function exitFuDesigner (newSequence) {
  
  function exitFu () {
    if (!newSequence) {
      infoBox (userText.FUfinalizing, userText.finalizeSequence);
    }

    // use setTimeout to assure the infoBox shows
    setTimeout(function(){
      // remove fuDesigner class from body
      document.body.classList.remove ('fuDesigner');
      
      // delete fuDesignerStyle rule to show all elements with class
      // disableFUdesigner
      document.getElementById ('fuDesignerStyle').innerHTML = '';

			if (platform.mobile) {  
				// move items from main menu back to File menu
				var ul = document.getElementById ('menuFileUl');
				var items = document.getElementsByClassName ('menuFileItem');
				for (var i = items.length - 1; i >= 0; i--) {
					ul.insertBefore (items[i], items[i + 1]);
				}
				ul.parentNode.classList.remove ('noDisplay');
			} else {
	      // move undoRedo
	      var undoRedo = document.getElementById ('undoRedo');
	      document.getElementById ('topBlock').insertBefore (
	        undoRedo, document.getElementById ('sequenceTextContainer'));
	    }
  
      // clear undo and redo
      activeSequence.undo = activeSequence.redo = [];
  
      document.getElementById ('fu_figures').value = '';
      
      if (newSequence === true) {
        checkSequenceChanged (true);
      } else {
        selectFigure (false);
        selectForm ('B');
        
        // remove unassigned Free figures
        sequenceText.innerText = sequenceText.innerText.replace (/X/g, '');
        checkSequenceChanged ();
        
        separateFigures (true);
        sequenceText.innerText = sequenceText.innerText.trim().replace(/ e(u|d|j|ja)$/, '').replace(/^eu[ ]*/, '');
  
        checkSequenceChanged ();
        
        /** breaks reference sequence. Why did I change this? Unsure,
         *  removing for now (2018-1-22)
        // put figures with letters in reference sequence field
        var div = document.getElementById('referenceSequenceDialog');
        div.classList.remove ('noDisplay');
        var ref = document.getElementById ('referenceSequenceString');
        ref.value = '';
        for (var i = 0; i < figures.length; i++) {
          if (figures[i].aresti && figures[i].unknownFigureLetter &&
            (figures[i].unknownFigureLetter !== 'L')) {
            ref.value += '"@' + figures[i].unknownFigureLetter + '" ' +
              figures[i].string + ' ';
          }
        }
        changeReferenceSequence();
        div.classList.add ('noDisplay');
        */
      }
    
      // restore the tabs
      document.getElementById('subSequenceDirection').classList.add ('noDisplay'); 
      document.getElementById ('tab-fuFigures').classList.add ('noDisplay');
      document.getElementById ('fuFigures').classList.add ('noDisplay');
      document.getElementById ('fuFigures').classList.add ('hidden');
      selectTab ('tab-figureInfo');
      selectTab ('tab-sequenceInfo');
      document.getElementById ('figureSelector').classList.remove ('left');
      
      // clear fuSequence div
      document.getElementById('fuSequence').innerHTML = '';
  
      availableFigureGroups();
      
      if (!newSequence) infoBox();
    }, 300);
  }
  
  if (newSequence) {
    exitFu();
  } else {
    // get alerts from alert area
    var div = document.createElement('div');
    div.innerHTML = document.getElementById('alerts').innerHTML;
    // remove label
    div.removeChild(div.firstChild);
    
    var myAlerts = div.innerHTML;
    
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].aresti) var sub = figures[i].subSeq;
    }
    if (sub > 1) {
      myAlerts += '<br />' + sprintf (userText.FUmultipleSubsequences, sub);
    }
    
    if (myAlerts.match (RegExp('(' + userText.setUpright + ')|(' +
      userText.setInverted + ')'))) {
      myAlerts += '<br />' + userText.FUexitEntryMatch;  
    }
    
    if (myAlerts !== '') {  
      var confirmText = '<p>' + userText.FUerrorsDetected + '</p><p>' +
      myAlerts + '</p><p>' + userText.FUconfirmExit + '</p>';
      confirmBox (confirmText, userText.finalizeSequence, exitFu);
    } else {
      exitFu();
    }
  }
}

// freeCell builds a td element for specified subsequence, column and row
function freeCell (sub, col, row) {
  var td = document.createElement ('td');
  td.id = 'sub' + sub + 'col' + col + 'row' + row;
  return td;
}

// freeCellAddHandlers adds correct handlers to each table cell in the
// Free (Un)known designer
function freeCellAddHandlers (td) {
  td.addEventListener ('dragenter', function() {
		var nodes = document.getElementById ('fuSequence').getElementsByClassName ('hover');
		while (nodes.length) nodes[0].classList.remove ('hover');
    this.classList.add ('hover');
  });
  td.addEventListener ('dragleave', function(e) {
		if (e.target.id === this.id) this.classList.remove ('hover');
  });
  td.addEventListener ('dragover', handleFreeDragOver);
  td.addEventListener ('drop', handleFreeDrop);
  
  if (!td.classList.contains ('endBlock')) {
    td.addEventListener ('mousedown', handleFreeSelect);
  }
}

/***********************************************************************
 * 
 * Free (Un)known drag & drop
 * 
 **********************************************************************/
 
// noPropagation makes sure the event doesn't propagate/redirect
function noPropagation (e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
}

// handleFreeDragFigureStart is called when starting to drag a Free (Un)known
// figure. It will set the figure string in dataTransfer
function handleFreeDragFigureStart(e) {
  var l = this.id.replace (/^fu/, '');
  e.dataTransfer.effectAllowed = 'copy';
  if (l === 'L') {
    e.dataTransfer.setData('text', '"@L" L');
  } else if (l === 'X') {
    e.dataTransfer.setData('text', 'X');
  } else {
    e.dataTransfer.setData('text', '"@' + l + '" ' + fuFig[l].string);
  }
}

// handleFreeDragSubStart is called when starting to drag a Free (Un)known
// subsequence. It will set the figure string in dataTransfer
function handleFreeDragSubStart(e, string) {
  e.target.getElementsByClassName('endBlock')[0].classList.add ('hidden');
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text', string);
}

// handleFreeDragOver fires when dragging over Free (Un)known designer figure
function handleFreeDragOver(e) {
  noPropagation (e); // Necessary. Allows us to drop.
  
  this.classList.add ('hover');
  e.dataTransfer.dropEffect = 'copy';

  return false;
}

// handleFreeDragEnd is called when dragging stops without dropping to
// restore dragged subsequence
function handleFreeDragEnd (e) {
  e.target.getElementsByClassName('endBlock')[0].classList.remove ('hidden');
}

// handleFreeDrop handles dropping Free (Un)known figure or subsequence
function handleFreeDrop (e) {
  // this/e.target is current target element.
  noPropagation(e); // Stops some browsers from redirecting.

  handleFreeDeselect (e);
  
  this.classList.remove ('hover');

  // put dataTransfer text into string
  var string = e.dataTransfer.getData('text');
  var regexSub = /^"(\d+)" /;

  if (this.classList.contains ('fuNewSub')) {
    // drop figure or subsequence to new subsequence. Make sure the
    // sequence always ends with 'eu'
    string = string.replace (regexSub, '');
    updateSequence (figures.length - 1, string + ' eu');
    // when dropping Additional, select and open figure editor
    if (string.match (/\@L/) || (string === 'X')) {
      selectFigureFu (figures.length - 2);
    }
  } else {
    // drop figure or subsequence on figure (or end)
    var figNr = parseInt(this.className.match(regexFuFigNr)[1]);
    var string = e.dataTransfer.getData('text');

    // if unknownFigureLetter is set, drop one figure earlier
    // var previous = (figures[figNr].unknownFigureLetter)? 1 : 0;
    // if aresti is set, drop one figure earlier
    var previous = (figures[figNr].aresti) ? 1 : 0;

    // a subsequence is marked by "n" at the start, where
    // n = subsequence number
    var match = string.match (regexSub);
    // check if dropping subsequence
    if (match) {
      // don't drop subsequence on itself
      if (figures[figNr - 1].subSeq != match[1]) {
        var t = '';
        for (var i = 0; i < figures.length; i++) {
          // put subsequence in new location
          if (i == (figNr - previous)) {
            t += ' ' + string.replace (match[0], '') + ' ';
          }
          // only keep figures that were not in original subsequence
          if (figures[i].subSeq != match[1]) {
            t += ' ' + figures[i].string + ' ';
          }
        }
        sequenceText.innerText = t;
        checkSequenceChanged();
      }
    } else {
      // single figure
      updateSequence (figNr - 1 - previous, string, false, true);
      // when dropping Additional or eXtra, select and open figure editor
      if (string.match (/\@L/)) {
        selectFigureFu (figNr + 1 - previous);
      } else if (string === 'X') selectFigureFu (figNr - previous);
    }
  }

  sequenceText.innerText = sanitizeSpaces (sequenceText.innerText);
  return false;
}

// handleFreeRemove handles removing a figure from the sequence
function handleFreeRemove (e, el) {

  var el = el ? el : this;

  noPropagation(e); // Stops some browsers from redirecting.
  
  el.parentNode.style.transform = 'scale(0.01)';
  
  // wait for remove animation to complete
  setTimeout (function() {
	  handleFreeDeselect (e);
	  
	  var figNr = el.parentNode.className.match(regexFuFigNr)[1];
	  
	  // remove figureletter first when applicable
	  if (/^\"\@[A-Z]/.test(figures[figNr - 1].string)) {
	    updateSequence (figNr - 1, '', true);
	    updateSequence (figNr - 1, '', true);
	  } else updateSequence (figNr, '', true);
	
	  // remove any double entry options, keeping last one
	  sequenceText.innerText = sequenceText.innerText.replace (/e[udj] (e[udj])/, '$1');
	  checkSequenceChanged();
	}, 300);
}

// handleFreeDeselect is called when an Additional figure is deselected
function handleFreeDeselect (e) {
  noPropagation(e); // Stops some browsers from redirecting.
  
  var els = document.getElementsByClassName ('fuFig' + selectedFigure.id);
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove ('active');
  }
  selectFigure (false);
  selectTab ('tab-fuFigures');
  hideFigureSelector ();
}
  
// handleFreeSelect is called by mousedown on a Free (Un)known figure
function handleFreeSelect (evt) {
	// need to do this to fix temporary selection on iOS
	if (evt.target && evt.target.parentNode &&
		evt.target.parentNode.classList.contains ('removeFigureButton')) {
		return;
	}
  var match = this.className.match(regexFuFigNr);
  if (match) {
    selectFigureFu (this.className.match(regexFuFigNr)[1]);
  }
}
  
// buildFuFiguresTab fills the fuFigures tab with the Free (Un)known
// lettered figures in the active sequence.
function buildFuFiguresTab() {
  
  var fu_figures = document.getElementById('fu_figures');
  fuFig = [];

  for (var i = 0; i < figures.length; i++) {
    var f = figures[i];
    var l = f.unknownFigureLetter;
    if (l && (figureLetters.indexOf (l) > -1) && f.aresti) {
      var figNr = f.figNr;
      // create aresti string
      // fu-[base]-[roll1]-[roll2]-...
      var aresti = 'fu';
      for (var j = 0; j < f.aresti.length; j++) {
        aresti += '-' + f.aresti[j];
      }
      // check if this letter exists already. If this happens, present
      // error message and return false
      if (fuFig[l]) {
        alertBox (sprintf(userText.FUDesignletterMulti, l), userText.fuDesigner);
        return false;
      }
      // append the figure to the fig array
      fuFig[l] = {
        'aresti':aresti,
        'base':fig[figNr].base,
        'rolls':fig[figNr].rolls,
        'draw':fig[figNr].draw,
        'pattern':fig[figNr].pattern,
        'kpwrd':fig[figNr].kpwrd,
        'kglider':fig[figNr].kglider,
        'figNr':figNr};
      // remove extensions/shortenings and y axis switch
      var string = f.string;
      string = string.replace(/[~\.'`\+\/]/g, '').replace(/-+/g, '-');
      // remove comments
      string = string.replace(regexComments, '');
      // correct X/Y axis switch where necessary. fu figures always
      // start on X axis.
      // When fu_figures has a value, the strings were already converted
      if ((fu_figures.value == '') && f.entryAxis == 'Y') {
        string = string.replace(regexSwitchDirY, '#').
	        replace(regegSwitchDirX, userpat.switchDirY).
	        replace(/#/g, userpat.switchDirX);
      }
      // Handle the very special case where there's only an upright or
      // inverted spin and the base figure is an iv
      if (string.match (/(\d|)(s|is)/) && !string.match (/iv/) && fuFig[l].base.match (/iv/)) {
        string = string.replace (/(\d*)(s|is)/, "iv$1$2");
      }
    
      fuFig[l].string = string;
    }
  }

  // check if we have all required figures. If not, present error
  // message and return false
  var missing = '';
  for (var i = 0; i < figureLetters.length; i++) {
    if (!fuFig[figureLetters[i]]) {
      missing += figureLetters[i];
    }
  }

  if (missing) {
    alertBox (sprintf (userText.FUDesignMissingLetters, missing), userText.fuDesigner);
    return false;
  }

  // start adding the figures
  var svg = document.getElementById('figureChooserSvg');
  
  // add margin to scroll for touch devices
  var
	  width = platform.touch ? 110 : 120,
	  height = 100,
	  maxColCount = 2,
	  colCount = 0,
	  letters = figureLetters + (additionalFig.max ? 'L' : 'X'),
	  table = document.getElementById ('fuFiguresTable');
	  fragment = document.createDocumentFragment();
  
  firstFigure = false;

  fu_figures.value = '';
  // clear
  while (table.firstChild) table.removeChild (table.firstChild);
  // put figures in table. In essence this is a trimmed version of the
  // routine in changeFigureGroup
  for (var i = 0; i < letters.length; i++) {
    // clear the svg
    prepareSvg(svg);
    var l = letters[i];
    if (!/[LX]/.test(l)) {
      // clear figure
      figures[-1] = [];
  
      if (fuFig[l].base[0] != '-') {
        Attitude = 0;
        Direction = 0;
      } else {
        Attitude = 180;
        Direction = 180;
      }
  
      // build the figure
      buildFigure ([fuFig[l].figNr], fuFig[l].string, false, -1);
  
      // reset X and Y and clear figureStart to prevent adjusting
      // figure position
      X = Y = 0;
      figureStart = [];
      // draw the figure
      drawFullFigure(-1, true, svg);
      // retrieve the group holding the figure and set viewbox
      var group = svg.getElementById('figure-1');
      var bBox = group.getBBox();
      var xMargin = bBox.width / 20;
      var yMargin = bBox.height / 20;
      group.setAttribute('transform', 'translate(' +
        roundTwo((xMargin - bBox.x)) + ' ' +
        roundTwo((yMargin - bBox.y)) + ')');
      svg.setAttribute('viewBox', '0 0 '+
        roundTwo(bBox.width+xMargin*2)+' '+
        roundTwo(bBox.height+yMargin*2));
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.setAttribute('id', 'fuFig' + l);
      // add the svg to fuFig[l] as xml text
      fuFig[l].svg = new XMLSerializer().serializeToString(svg);
      svg.setAttribute('id', 'figureChooserSvg');
      // add the roll Aresti nrs to fig if applicable
      fuFig[l].rollAresti = [];
  
      for (var j = 1; j < figures[-1].aresti.length; j++) {
        fuFig[l].rollAresti[j] = rollAresti.indexOf(figures[-1].aresti[j]);
      }
      
      fu_figures.value += '"@' + l + '" ' + fuFig[l].string + ' ';
    }
    if (colCount == 0) {
      var tr = document.createElement('tr');
      fragment.appendChild(tr);
    }
    colCount++;
    if (colCount >= maxColCount) colCount = 0;
    var td = document.createElement('td');
    tr.appendChild(td);
    td.setAttribute('id', 'fu' + l);
    if (!(/[LX]/.test(l))) {
      td.innerHTML = fuFig[l].svg;
      // add the unknownFigureLetter and K
      td.innerHTML += '<div class="UFletterInQueue">' + l + '</div>';
      td.innerHTML += '<div class="UFKInQueue">K:' +
         figures[-1].k.reduce(function(a, b){return a+b;}) + '</div>';
    } else {
      td.innerHTML = userText[(l === 'L') ? 'additional' : 'free'];
    }
    td.setAttribute ('draggable', true);
    td.addEventListener ('dragstart', handleFreeDragFigureStart);
  }
  
  table.appendChild (fragment);
  
  fu_figures.value = fu_figures.value.trim();
  
  return true;
}

/***********************************************************************
 * 
 * Making Forms A, B, C, Grid and FU
 * 
 **********************************************************************/

// changedFigureKText creates a well-formatted string
function changedFigureKText (figs) {
  if (figs && figs.length > 1) {
    return sprintf (userText.changedFigureKMulti, figs.join(','), rulesActive);
  } else return sprintf (userText.changedFigureK, figs[0], rulesActive);
}

// makeFormA creates Form A from the figures object
function makeFormA() {
  setYAxisOffset (yAxisOffsetDefault);
  Direction = 0;
  figNr = 0;
  svgElement = SVGRoot.getElementById('sequence');
  var modifiedK = [];
  // Count how many real figures there are
  for (var i = 0; i < figures.length; i++) {
    var aresti = figures[i].aresti;
    var paths = figures[i].paths;
    if (aresti) {
      // Build the figure at the top-left
      X = Y = 0;
      drawFullFigure(i, false);
      figNr ++;
    }
  }
  // The final form will be 800x1000px, leaving room for the print header
  var columnTitleHeight = 50;
  // define column titles and widths
  if (iacForms) {
    var columnTitles = Array('No:20', 'Symbol:100', 'Cat. No.:70', 'K:30', 'Total K:60', 'Grade:80', 'Remarks:260');
    var columnWidths = Array(20, 100, 70, 30, 60, 80, 260);
  } else {
    var columnTitles = Array('No:20', 'Symbol:100', 'Cat. No.:70', 'K:30', 'Total K:60', 'Marks:80', 'Remarks:220', 'Pos:40');
    var columnWidths = Array(20, 100, 70, 30, 60, 40, 40, 220, 40);
  }
  // define height of each row
  var rowHeight = Math.min (parseInt((1000 - columnTitleHeight) / figNr), 125);
  // build column titles
  var x = 0;
  for (var i = 0; i < columnTitles.length; i++) {
    drawRectangle (x, 0, columnTitles[i].split(':')[1], columnTitleHeight, 'formLine');
    drawText (
      columnTitles[i].split(':')[0],
      x + columnTitles[i].split(':')[1] / 2,
      columnTitleHeight / 2,
      'formAText',
      'middle');
    x += parseInt(columnTitles[i].split(':')[1])
  }
  var y = columnTitleHeight;
  var row = 0;
  figureK = 0;
  for (var i = 0; i < figures.length; i++) {
    // reduce rowheight for last one so border fits within height 1000
    if (row == (figNr - 1)) rowHeight -= 2;
    // find Aresti nr(s) and k(s) for figure
    var aresti = figures[i].aresti;
    var k = figures[i].k;
    // only draw if there is a (fake) aresti number
    if (aresti) {
      var x = 0;
      var colCount = iacForms ? 7 : 9;
      for (var column = 0; column < colCount; column++) {
        switch (column) {
          case (0):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            drawText (row + 1,
              x + columnWidths[column] / 2,
              y + rowHeight / 2,
              'formATextBold',
              'middle');
            break;
          case (1):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'pos');
            // Get the drawn figure from the SVG and set the correct scaling
            var group = SVGRoot.getElementById('figure' + i);
            var bBox = group.getBBox();
            var scaleFigure = roundTwo(Math.min((columnWidths[column] - 10) / bBox.width, (rowHeight - 20) / bBox.height));
            var xMargin = (columnWidths[column] - bBox.width * scaleFigure) / 2;
            var yMargin = (rowHeight - bBox.height * scaleFigure) / 2;
            group.setAttribute('transform', 'translate(' +
              roundTwo((x + xMargin - bBox.x*scaleFigure)) + ' ' +
              roundTwo((y + yMargin - bBox.y*scaleFigure)) +
              ') scale(' + scaleFigure + ')');
            break;
          case (2):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            // set the font size from 8-13 depending on the amount of Aresti nrs
            var fontsize = Math.max (
              Math.min (
                parseInt(rowHeight / (aresti.length + 1)),
                13),
              8);
            for (var j = 0; j < aresti.length; j++) {
              if (aresti[j] in aresti_K) modifiedK.push (row + 1);
              drawText (aresti[j],
                x + columnWidths[column] / 2,
                y + (j + 1) * fontsize,
                'formATextBold' + fontsize + 'px',
                'middle');
            }
            if (figures[i].floatingPoint && iacForms) {
              // add 'F.P.' to IAC form A when applicable
              drawText ('F.P.',
                x + columnWidths[column] / 2,
                y + (j + 1) * fontsize,
                'formATextBold' + fontsize + 'px',
                'middle');
            }
            break;
          case (3):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            var figK = 0;
            // set the font size from 8-13 depending on the amount of Aresti nrs
            var fontsize = Math.max (
              Math.min (
                parseInt(rowHeight / (aresti.length + 1)),
                13),
              8);
            for (var j = 0; j < aresti.length; j++) {
              drawText (k[j],
                x + columnWidths[column] / 2,
                y + (j + 1) * fontsize,
                'formATextBold' + fontsize + 'px',
                'middle');
              figK += parseInt(k[j]);
            }
            // Adjust figure K for additionals
            if (figures[i].additional) {
              if (additionals <= additionalFig.max) {
                figK = additionalFig.totalK / additionals;
              } else {
                if (additionalFig.max > 0) {
                  figK = additionalFig.totalK / additionalFig.max[document.getElementById('class').value];
                }
                checkAlert (sprintf (userText.maxAdditionals, additionalFig.max),
                  false,
                  row + 1);
              }
            }
            break;
          case (4):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            if (figures[i].floatingPoint) {
              drawText ('(' + figK + ')',
                x + columnWidths[column] / 2,
                y + rowHeight / 2 + 10,
                'formAText',
                'middle');
              figK -= 1;
              drawText (figK,
                x + columnWidths[column] / 2,
                y + rowHeight / 2 - 8,
                'formATextLarge',
                'middle');
            } else {
              drawText (figK,
                x + columnWidths[column] / 2,
                y + rowHeight / 2,
                'formATextLarge',
                'middle');
            }
            if ((document.getElementById('printSF').checked === true) &&     
              (figures[i].superFamily)) {
							drawText('SF ' + figures[i].superFamily,
								x + columnWidths[column] / 2,
								y + rowHeight - 10,
								'formAText',
								'middle');
            }
            // check if mark as additional or specific unknown figure
            if (figures[i].additional) {
              drawText('additional',
                x + columnWidths[column] / 2,
                y + 15,
                'formAText',
                'middle');
            } else if (figures[i].unknownFigureLetter) {
              drawText('Fig ' + figures[i].unknownFigureLetter,
                x + columnWidths[column] / 2,
                y + 15,
                'formAText',
                'middle');
            }
            figureK += figK;
            break;
          case (5):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            drawLine (x, y, 0, rowHeight, 'formLineBold');
            break;
          case (6):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            break;
          case (7):
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
            break;
          default:
            drawRectangle (x, y, columnWidths[column], rowHeight, 'formLine');
        }
        if (column == (colCount - 1)) {
          drawLine (x + columnWidths[column], y, 0, rowHeight, 'formLineBold');
        }
        if ((row == 0) && (column > 4)) {
          drawLine (x, y, columnWidths[column], 0, 'formLineBold');
        }
        if ((row == (figNr - 1)) && (column > 4)) {
          drawLine (x, y + rowHeight, columnWidths[column], 0, 'formLineBold');
        }
        x += columnWidths[column];
      }
      y += rowHeight;
      row++;
    }
  }
  if (modifiedK.length) {
    drawText (changedFigureKText (modifiedK, rulesActive),
      0, y + 12, 'miniFormAModifiedK', 'start', '', svgElement);
    SVGRoot.setAttribute("viewBox", '0 0 800 1020');
  } else SVGRoot.setAttribute("viewBox", '0 0 800 1000');
  
  SVGRoot.setAttribute("width", '800px');
  SVGRoot.setAttribute("height", '1000px');
}

// makeFormB creates Form B from the figures array
function makeFormB() {
  for (var i = 0; i < figures.length; i++) {
    // only make real figures draggable
    var draggable = (figures[i].aresti && true);
    if (figures[i].paths.length) drawFullFigure(i, draggable);
  }
  addFormElements ('B');
}

// makeFormC creates Form C from the figures array
function makeFormC() {
  for (var i = 0; i < figures.length; i++) {
    // only make real figures draggable
    var draggable = (figures[i].aresti && true);
    if (figures[i].paths.length) drawFullFigure(i, draggable);
  }
  addFormElements ('C');
}

// makeFormGrid creates a grid of figures
function makeFormGrid (cols, width, svg) {
  svg = svg || SVGRoot;
  width = width || 800;

  var
	  cw = parseInt(width / cols),
	  ch = parseInt(cw * Math.GR),
	  x = 0,
	  y = 0,
	  col = 0,
	  scaleMin = Infinity, // high number, will hold the smallest Fig scale
	  modifiedK = [],
	  entryExit = {Entry : {l: 0, n: 0, h: 0, L: 0, N: 0, H: 0},
	               Exit : {l: 0, n: 0, h: 0, L: 0, N: 0, H: 0}};
	               
  // draw all real figures, ordered as selected
	var orderBy = document.getElementById('gridOrderBy').value;
  figures.sort (function(a, b) {
		if (!a[orderBy] && !b[orderBy]) return 0;
		if (!a[orderBy] || (a[orderBy] > b[orderBy])) return 1;
		if (!b[orderBy] || (b[orderBy] > a[orderBy])) return -1;
		return 0;
  });
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) {

      var f = figures[i];

      // draw rectangle
      drawRectangle (x, y, cw, ch, 'formLine', svg);
      // draw figure Ks, Arestis and Figure Letter
      var textWidth = 0;
      var figK = 0;
      // yy is used to determine the top of all Aresti nrs, comments etc
      var yy = y + ch - 10;
      for (var j = f.k.length - 1; j>=0; j--) figK += parseInt(f.k[j]);
      drawText('K: ' + figK,  x + 5, yy, 'formATextBold', 'start', '', svg);
      for (var j = f.k.length - 1; j>=0; j--) {
        if (f.aresti[j] in aresti_K) modifiedK.push (figures[i].seqNr);
        yy -= 15;
        drawText(f.aresti[j] + '(' + f.k[j] + ')',
          x + 5,
          yy,
          'formAText',
          'start',
          'Fig' + i + 'Aresti' + j,
          svg);
        var bBox = svg.lastChild.getBBox();
        var tw = bBox.width;
        if (tw > textWidth) textWidth = tw;
      }
      if (f.unknownFigureLetter) {
        yy -= 15;
        drawText('Fig ' + f.unknownFigureLetter,
          x + 5,
          yy,
          'formATextBold',
          'start',
          '',
          svg);
      }
      
      // draw comments
      if (f.comments) {
        var flagWidth = 0;
        
        if (f.country) {
          // set scale for flag
          var scale = Math.min (roundTwo((cw - tw - 10) / 56), 1);
          var flag = drawImage ({
            width: 48 * scale,
            height: 48 * scale,
            x: x + cw - (52 * scale),
            y: y + ch - (48 * scale),
            'id': 'flag' + i,
            href: 'data:image/png;base64,' + flags[f.country]}, svg);
          flagWidth = 56 * scale;
        }

        var paths = makeTextBlock (f.comments);
        // create group for comments
        var g = svg.appendChild(document.createElementNS (svgNS, 'g'));
        for (var j = 0; j < paths.length; j++) {
          // don't draw box, only text
          if (!paths[j].path) drawShape (paths[j], g);
        }
        var bBox = g.getBBox();
        // check if comments fit right of Aresti nrs, scale if necessary
        if (flag && (((y + ch) - yy) > bBox.height)) {
          var scale = Math.min ((cw - tw - 40) / bBox.width, 1);
        } else {
          var scale = Math.min ((cw - tw - flagWidth - 40) / bBox.width, 1);
        }
        if (scale < 0.67) {
          // would get too small, put above Aresti nrs and scale to
          // column width, upto factor 0.67
          scale = Math.max (Math.min ((cw - 40) / bBox.width, 1), 0.67);
          yy -= (bBox.height + 10);
          g.setAttribute ('transform', 'translate(' +
            roundTwo(x - (bBox.x * scale) + 5) + ',' +
            roundTwo(yy - (bBox.y * scale)) + ') scale(' +
            roundTwo(scale) + ')');
        } else {
          // put right bottom and scale
          if (flag) {
            yy = Math.min (y + ch + 15 - (bBox.height * scale) - flag.getAttribute('height'), yy);
            g.setAttribute ('transform', 'translate(' +
              roundTwo((x - ((bBox.x + bBox.width) * scale)) + cw - 10) + ',' + 
              roundTwo((y + ch + 3 - ((bBox.y + bBox.height) * scale) - flag.getAttribute('height'))) + ') scale(' +
              roundTwo(scale) + ')');
          } else {
            yy = Math.min (y + ch + 15 - (bBox.height * scale), yy);
            g.setAttribute ('transform', 'translate(' +
              roundTwo((x - ((bBox.x + bBox.width) * scale)) + cw - 10) + ',' + 
              roundTwo((y + ch - 2 - ((bBox.y + bBox.height) * scale))) + ') scale(' +
              roundTwo(scale) + ')');
          }
        }
      }
        
      // draw figure
      var fh = yy - y - 10;
      // set X and Y to 0 to prevent roundoff errors in figure drawing
      // and scaling
      X = Y = 0;
      drawFullFigure(i, f.paths[0].figureStart, svg);
      var bBox = f.bBox;
      var thisFig = svg.getElementById('figure' + i);
      // set figure size to column width - 20
      var scale = Math.min ((cw - 20) / bBox.width, (fh - 20) / bBox.height);
      if (scale < scaleMin) scaleMin = scale;
      // move each figure to grid element center and scale appropriately
      figures[i].tx = roundTwo(x - (bBox.x * scale) + ((cw - bBox.width * scale) / 2));
      figures[i].ty = roundTwo(y - (bBox.y * scale) + ((fh - bBox.height * scale) / 2));
      figures[i].fh = roundTwo(fh);
      figures[i].viewScale = roundTwo(scale);
      thisFig.setAttribute ('transform', 'translate(' +
        figures[i].tx + ',' + 
        figures[i].ty + ') scale(' + 
        figures[i].viewScale + ')');
      if (i < (figures.length - 1)) {
        x += cw;
        col++;
        if (col >= cols) {
          x = col = 0;
          y += ch;
        }
      }
      
      entryExit.Entry[fig[figures[i].figNr].entryExitPower[0]]++;
      entryExit.Exit[fig[figures[i].figNr].entryExitPower[1]]++;
            
    }
  }
  
  // update viewbox and svg height
  var height = y + ch + 2;
  if (modifiedK.length) {
    drawText (changedFigureKText (modifiedK, rulesActive),
      0, -4, 'miniFormAModifiedK', 'start', '', svgElement);
    height += 12;
    svg.setAttribute("viewBox", '-1 -13 ' + (width + 2) + ' ' + height);
  } else svg.setAttribute("viewBox", '-1 -1 ' + (width + 2) + ' ' + height);

  if (platform.smallMobile) {
		svg.setAttribute("width", 'auto');
    svg.setAttribute("height", 'auto');
  } else {
    svg.setAttribute("width", (width + 2));
    svg.setAttribute("height", height);
  }    

  // go through the figures again, set maximum scale to scaleMin * 2
  // and recenter horizontally when necessary
  for (var i = 0; i < figures.length; i++) {
    var f = figures[i];
    if (f.aresti) {
      var thisFig = svg.getElementById('figure' + i);
      var scale = f.viewScale;
      if (scale > (scaleMin * 2)) {
        var scale = scaleMin * 2;
        var bBox = f.bBox;
        var x = roundTwo(f.tx + (bBox.x * f.viewScale) - ((cw - bBox.width * f.viewScale) / 2));
        var y = roundTwo(f.ty + (bBox.y * f.viewScale) - ((f.fh - bBox.height * f.viewScale) / 2));
        thisFig.setAttribute ('transform', 'translate(' +
          roundTwo(x - (bBox.x * scale) + ((cw - bBox.width * scale) / 2)) +
          ',' + roundTwo(y - (bBox.y * scale) + ((f.fh - bBox.height * scale) / 2)) +
          ') scale(' + roundTwo(scale) + ')');
      }
    }
  }

  // list entry and exit speeds and attitudes
  for (var key in {Entry: '', Exit: ''}) {
    for (var attSpd in entryExit[key]) {
      document.getElementById ('grid' + key + attSpd).innerHTML =
        entryExit[key][attSpd];
    }
  }
  
  /* Go through the grid figures to obtain a reasonable estimate of
   * the required number of additional figures.
   * 
   * In parseFiguresFile all figures get a two letter code describing
   * entry and exit attitude and speed. Letters used are L(ow),
   * N(eutral) and H(igh). Lowercase is used for inverted attitudes.
   * Speeds are determined by selection defined in config.js.
   * 
   * Here we match these until no more matches are possible
   */
  
  var sets = [];
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) sets.push (fig[figures[i].figNr].entryExit);
  }  
  
  var gridAdditionals = document.getElementById ('gridAdditionals');
  
  // run the matching routine both on the normal and reverse order of
  // figures. This improves match finding. Only use the lowest value.
  gridAdditionals.textContent = Math.max (
    Math.min (
      getFigureSets(sets).length,
      getFigureSets(sets.reverse()).length
    ) - 1, 0
  );

  if (additionalFig.max) {
    gridAdditionals.setAttribute('class', 'remaining' + Math.max (
      Math.min (additionalFig.max - gridAdditionals.textContent, 4), -1));
    gridAdditionals.textContent += ' / ' + additionalFig.max;
  } else gridAdditionals.setAttribute('class', '');
}  

/* getFigureSets creates sets of figures that match.
 * 
 * In parseFiguresFile all figures get a two letter code describing
 * entry and exit attitude and speed. Letters used are L(ow),
 * N(eutral) and H(igh). Lowercase is used for inverted attitudes.
 * Speeds are determined by selection defined in config.js.
 * 
 * Here we match these until no more matches are possible.
 * 
 * sets    : figures entry/exit of form [xx, xx, xx, ...]
 * maxSize : maximum size per set (defaults to Infinity)
 * 
 * The return is an array of the form
 * [[fignr, fignr, ...], [fignr, fignr, ...], ...]
 */

function getFigureSets (sets, maxSize) {
  maxSize = maxSize * 2 || Infinity; // *2 because every figure = 2 letters
  
  var setFigs = [];
  for (var i = 0; i < sets.length; i++) setFigs.push([i]);

  if (sets.length > 1) {
    // first match correct speeds, then match with neutral
    var matchNeutral = false;
    do {
      do {
        var join = false;
        for (var i = 0; i < (sets.length - 1); i++) {
          for (var j = i + 1; j < sets.length; j++) {
            // stop matching for this set when reaching maxSize
            if (sets[i] && (sets[i].length >= maxSize)) break;
            // match at the beginning of set i 
            while ((j < sets.length) && (sets[i].length < maxSize) && 
              ((sets[j][sets[j].length - 1] === sets[i][0]) ||
              (matchNeutral &&
              (sets[j][sets[j].length - 1] + sets[i][0]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)))) {
              sets[i] = sets[j] + sets[i];
              sets.splice (j, 1);
              setFigs[i].unshift (setFigs[j][0]);
              setFigs[j].splice (0, 1);
              if (!setFigs[j].length) setFigs.splice (j, 1);
              join = true;
            }
            // match at the end of set i
            while ((j < sets.length) && (sets[i].length < maxSize) && 
              ((sets[j][0] === sets[i][sets[i].length - 1]) ||
              (matchNeutral &&
              (sets[j][0] + sets[i][sets[i].length - 1]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)))) {
              sets[i] += sets[j];
              sets.splice (j, 1);
              setFigs[i].push (setFigs[j][0]);
              setFigs[j].splice (0, 1);
              if (!setFigs[j].length) setFigs.splice (j, 1);
              join = true;
            }
          }
        }
      } while (join);
      matchNeutral = !matchNeutral;
    } while (matchNeutral);
  }
  return setFigs;
}

/* getFigureSets creates sets of figures that match.
 * 
 * In parseFiguresFile all figures get a two letter code describing
 * entry and exit attitude and speed. Letters used are L(ow),
 * N(eutral) and H(igh). Lowercase is used for inverted attitudes.
 * Speeds are determined by selection defined in config.js.
 * 
 * Here we match these until no more matches are possible.
 * 
 * sets    : starts as figures entry/exit of form [xx, xx, xx, ...],
 *           later becomes full set (e.g. lhhhhl)
 * maxSize : maximum size per set (defaults to Infinity)
 * realFigs: maps temporary (e.g. random) figure numbers to real figures
 * families: an object of which the keys are regex family matches and
 *           the values are the count of this match over all sets
 * 
 * The return is an array of the form
 * [[fignr, fignr, ...], [fignr, fignr, ...], ...]
 */

/*
function getFigureSets (sets, maxSize, realFigs, superFamilies, mustCompleteToSize) {
  maxSize = maxSize * 2 || false; // *2 because every figure = 2 letters

  var
	  setFigs = [],
	  setFamilies = [],
	  distributionOK,
    matchNeutral = false, // first match correct speeds, then match with
	  completeToSize = false;  // neutral, then complete to fixed size
  
  for (var i = 0; i < sets.length; i++) {
		setFigs.push([i]);
		if (realFigs) {
			setFamilies[i] = {};
			for (var k in superFamilies) {
				setFamilies[i][k] = 0;
			}
			setFamilies[i][figures[realFigs[i]].superFamily] = 1;
		}
	}

  if (sets.length > 1) {
    do {
      do {
        var join = false;
        for (var i = 0; i < (sets.length - 1); i++) {
          for (var j = i + 1; j < sets.length; j++) {
            // stop matching for this set when reaching maxSize
            if (sets[i] && maxSize && (sets[i].length >= maxSize)) break;
						distributionOK = true;
						if (realFigs) {
							var sf = figures[realFigs[j]].superFamily;
							if ((setFamilies[i][sf] >=
								(superFamilies[sf] / (realFigs.length / (maxSize / 2))))) {
								distributionOK = false;
							}
						}
            // match at the beginning of set i 
            if (distributionOK && (j < sets.length) &&
	            (!maxSize || sets[i].length < maxSize) && 
              ((sets[j][sets[j].length - 1] === sets[i][0]) ||
              (matchNeutral &&
              (sets[j][sets[j].length - 1] + sets[i][0]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)) ||
              completeToSize)) {
console.log(completeToSize);
							// add superFamilies if applicable
							if (realFigs) setFamilies[i][figures[realFigs[j]].superFamily]++;
							// merge set j to i
              sets[i] = sets[j] + sets[i];
              sets.splice (j, 1);
              setFigs[i].unshift (setFigs[j][0]);
              setFigs[j].splice (0, 1);
              if (!setFigs[j].length) setFigs.splice (j, 1);
              join = true;

            }
            
            // match at the end of set i
            if (distributionOK && (j < sets.length) &&
	            (!maxSize || (sets[i].length < maxSize)) && 
              ((sets[j][0] === sets[i][sets[i].length - 1]) ||
              (matchNeutral &&
              (sets[j][0] + sets[i][sets[i].length - 1]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)) ||
              completeToSize)) {

							// add superFamilies if applicable
							if (realFigs) setFamilies[i][figures[realFigs[j]].superFamily]++;
							// merge set j to i
              sets[i] += sets[j];
              sets.splice (j, 1);
              setFigs[i].push (setFigs[j][0]);
              setFigs[j].splice (0, 1);
              if (!setFigs[j].length) setFigs.splice (j, 1);
              join = true;

            }
          }
        }
      } while (join);
      if (!completeToSize) matchNeutral = !matchNeutral;
      if (!matchNeutral && mustCompleteToSize) completeToSize = !completeToSize;
    } while (matchNeutral || completeToSize);
  }

  return setFigs;
}
*/

// shuffle accepts an array and returns it's shuffled version
function shuffle (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor (Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
	
// createFigureProposals creates groups of figures, based on matching by
// getFigureSets.
// It is used to create groups from a large number of Unknown figures
function createFigureProposals () {
  var
	  realFigs = [],
	  superFamilyRatio = {}, 
	  proposals = [],
	  size = document.getElementById ('gridColumns').value;
		  
  // create an array holding the indexes of real figures
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) {
			realFigs.push (i);
			superFamilyRatio[figures[i].superFamily] = 0;
		}
  }
  var propCount = Math.floor (realFigs.length / size);
  
  // randomize figure order. The realFig holds the true figure index
  // and needs to be consulted after all is done
  realFigs = shuffle (realFigs);

	// now sort by Superfamily. This prevents filling up proposals before
	// "difficult" Superfamilies are spread out
	realFigs.sort (function (a, b) {
		return (figures[a].superFamily - figures[b].superFamily);
	});
  
  // build empty proposals
  for (var i = 0; i < propCount; i++) {
		proposals.push({figures: [], sf: JSON.parse(JSON.stringify(superFamilyRatio))});
	}

	var figsInProposals = propCount * size;
	// count specific families to ensure equal distibution
	for (var i = 0; i < figsInProposals; i++) {
		superFamilyRatio[figures[realFigs[i]].superFamily] += 1 / propCount;
	}
	  
  // go through figures and build proposals
  for (var i = 0; i < figsInProposals; i++) {
		var f = figures[realFigs[i]];
		// shuffle proposals on every figure so we don't start by adding
		// everything to the same proposal
		proposals = shuffle (proposals);
		// match 1) exact, 2) neutral, 3) all
		for (var matchType = 1; matchType <= 3; matchType++) {
			// look at each proposal
			for (var prop = 0; prop < propCount; prop++) {
				var match = false;
				var p = proposals[prop];
				// check if the proposal is not full, and distribution of
				// Superfamily, except family 7
				if ((p.figures.length < size) && ((f.superFamily == 7) ||
					(p.sf[f.superFamily] <superFamilyRatio[f.superFamily]))) {
					// match at the beginning of proposal
					if (!p.length || // always add to empty proposal
						(fig[f.figNr].entryExit[1] === fig[realFigs[p.figures[0]].figNr].entryExit[0]) ||
						((matchType == 2) &&
						(fig[f.figNr].entryExit[1] + fig[realFigs[p.figures[0]].figNr].entryExit[0]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)) ||
						(matchType == 3)) {
						proposals[prop].figures.unshift (i);
						// add superFamily
						proposals[prop].sf[f.superFamily]++;
						match = true;
					} else 
					// match at the end of proposal
					if ((fig[f.figNr].entryExit[0] === fig[realFigs[p.figures[p.figures.length - 1]].figNr].entryExit[1]) ||
						((matchType == 2) &&
						(fig[f.figNr].entryExit[0] + fig[realFigs[p.figures[[p.figures.length - 1]]].figNr].entryExit[1]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/))) {
						proposals[prop].figures.push (i);
						// add superFamily
						proposals[prop].sf[f.superFamily]++;
						match = true;
					}
				}
				if (match) break;
			}
			if (match) break;
		}		
	}
	
	// if we have figures remaining, add those to the last partial "proposal"
  document.getElementById ('t_proposalsIncomplete').classList.add ('noDisplay');
	if (figsInProposals < realFigs.length) {
		document.getElementById ('t_proposalsIncomplete').classList.remove ('noDisplay');
		proposals.push ({figures: []});
		for (var i = figsInProposals; i < realFigs.length; i++) {
			proposals[proposals.length - 1].figures.push (i);
		}
	}
	
  /*
  // push the sets according realFig index
  for (var i = 0; i < realFigs.length; i++) {
    sets.push (fig[figures[realFigs[i]].figNr].entryExit);
  }  
	*/

/*
  // create sets and sort from long to short 
  sets = getFigureSets (sets, size, realFigs, superFamilies, true).sort (
	  function(a, b) {return b.length - a.length;}
	);
*/
/*
	var setFamilies = {};
  for (var i = 0; i < sets.length; i++) {
		setFamilies[i] = {};
		for (var k in superFamilies) {
			setFamilies[i][k] = 0;
		}
		for (var j = 0; j < sets[i].length; j++) {
			setFamilies[i][figures[realFigs[sets[i][j]]].superFamily] += 1;
		}
	}
*/
/*	
  // combine sets. Take the first (longest) set and add short sets until
  // reaching correct size
  document.getElementById ('t_proposalsIncomplete').classList.add ('noDisplay');
  while (sets.length) {
    padSet: while (sets[0].length < size) {
      var last = sets.length - 1;
      if (last) {
        while ((sets[last].length) && (sets[0].length < size)) {
          sets[0].push (sets[last].splice (0, 1)[0]);
        }
        if (!sets[last].length) sets.pop(); 
      } else {
        document.getElementById ('t_proposalsIncomplete').classList.remove ('noDisplay');
        break padSet; // exit while loop
      }
    }
    proposals.push (sets.splice (0, 1)[0]);
  }
*/      
  // build a sequence string for each proposal
  var content = '';
  sequenceText.innerHTML = '';
  for (var i = 0; i < proposals.length; i++) {
    var string = "";
    for (var j = 0; j < proposals[i].figures.length; j++) {
      var f = figures[realFigs[proposals[i].figures[j]]];
      if (f.comments || f.unknownFigureLetter) string += '"' + 
        (f.unknownFigureLetter ? '@' + f.unknownFigureLetter : '') +
        (f.comments ? f.comments : '') + '" ';
      string += f.string + ' ';
    }
    content += string.trim() + '\n';
    sequenceText.innerHTML += string;
  }

  document.getElementById ('proposals').textContent = content;

	// set Grid rendering options
  activeSequence.figures = [];
  var savedText = activeSequence.text;
  var savedOrder = document.getElementById('gridOrderBy').value;
	document.getElementById('gridOrderBy').value = 'seqNr';
	
	// build Grid image for proposals
  checkSequenceChanged (true);
  
  var svg = document.getElementById ('proposalsSequenceSvg');
  prepareSvg (svg);

  var h = 200 * Math.ceil (realFigs.length / size);
  makeFormGrid (size, size * 150, svg);
  svg.setAttribute ('width', svg.getAttribute ('width') * (h / svg.getAttribute ('height')));
  svg.setAttribute ('height', h);
  
  // restore normal Grid view
  activeSequence.figures = [];
  activeSequence.text = savedText;
  sequenceText.innerHTML = savedText;
  document.getElementById('gridOrderBy').value = savedOrder;
  
  checkSequenceChanged (true);
}

// makeFree builds Free Known and Unknown designer sequences
// When additionalFig.max is zero, it's a Free Known. Otherwise, Unknown
function makeFree () {
  // set sizes
  var
	  cellW = 120,
	  cellH = 100,
	  div = document.getElementById('fuSequence'),
	  subseqString = '',
	  sub = 1,     // current subsequence number
	  prevSub = 0, // previous subsequence number for first figure of new
	  col = 1,     // subsequence table column
	  prevCol = -999,
	  row = 1,     // subsequence table row
	  prevRow = 0,
	  minCol = 1,
	  maxCol = 1,
	  height = 0,
	  totalK = 0,
	  freeFigures = 0;
  
  Direction = 0;

  // make sure the sequence is shown
  document.body.classList.add ('fuDesigner');
  while (div.firstChild) div.removeChild(div.firstChild);
  var table = document.createElement('table');
  div.appendChild(table);
  
  // getTd gets the td for the next figure block and updates size when
  // necessary
  function getTd () {
    // check if td was already occupied. Can happen on reversing
    // figures. If so, increase row
    var td = document.getElementById ('sub' + sub + 'col' + col + 'row' + row);
    if (td && td.firstChild) {
      row++;
    }
    // add new row if it did not exist
    if (row > height) {
      var tr = document.createElement ('tr');
      table.appendChild (tr);
      for (var j = minCol; j <= maxCol; j++) {
        tr.appendChild (freeCell (sub, j, row));
      }
      height = row;
    }
    if (col > maxCol) {
      // add new column right
      var tr = table.childNodes;
      for (var j = 0; j < tr.length; j++) {
        tr[j].appendChild (freeCell (sub, col, j + 1));
      }
      maxCol = col;
    } else if (col < minCol) {
      // add new column left
      var tr = table.childNodes;
      for (var j = 0; j < tr.length; j++) {
        tr[j].insertBefore (freeCell (sub, col, j + 1), tr[j].firstChild);
      }
      minCol = col;
    }

    var td = document.getElementById ('sub' + sub + 'col' + col + 'row' + row);
    
    // add pointer from previous figure
    if (prevCol > -999) {
      if (prevCol < col) {
        if (prevRow < row) {
          td.classList.add('prevLeftTop');
        } else td.classList.add('prevLeft');
      } else if (prevCol > col) {
        if (prevRow < row) {
          td.classList.add('prevRightTop');
        } else td.classList.add('prevRight');
      } else td.classList.add('prevTop');
    }
  
    prevCol = col;
    prevRow = row;
    return td;
  }
  
  // endSubseq ends every subsequence
  // id     = figure id (previous + 1)
  // string = formatted subsequence drop string
  function endSubseq(id, string) {
    // build END block
    var td = getTd();
    if (figures[id-1] && (figures[id-1].exitAtt !== undefined)) {
      var svg = newSvg();
      td.appendChild(svg);
      // set X and Y to 0 to prevent roundoff errors in figure drawing
      // and scaling
      X = Y = 0;
      Attitude = figures[id - 1].exitAtt;
      Direction = figures[id - 1].exitDir;
      NegLoad = ((Attitude > 90) && (Attitude < 270)) ? 1 : 0;
      
      figures[id].paths = buildShape ('Line', [6], []);
      figures[id].paths = buildShape ('FigStop', false, figures[id].paths);
      figures[id].paths = buildShape ('FigStop', true, figures[id].paths);
      drawFullFigure(id, false, svg);
      var thisFig = svg.getElementById('figure' + id);
      var bBox = thisFig.getBBox();
  
      // retrieve the group holding the figure and set viewbox (only fill
      // half the width)
      var xMargin = bBox.width / 2;
      var yMargin = bBox.height / 2;
      thisFig.setAttribute('transform', 'translate(' +
        roundTwo((xMargin - bBox.x)) + ' ' +
        roundTwo((yMargin - bBox.y)) + ')');
      svg.setAttribute('viewBox', '0 0 '+
        roundTwo(bBox.width+xMargin*2)+' '+
        roundTwo(bBox.height+yMargin*2));
      svg.setAttribute('width', cellW);
      svg.setAttribute('height', cellH);
    }

    if (!additionalFig.max) {
      // add Total K
      var div = document.createElement ('div');
      div.classList.add ('UFKInFigure');
      div.innerHTML = 'Total K: ' + totalK;
      if (rulesActive && checkCatGroup.k && checkCatGroup.k.max) {
		    div.innerHTML += '<br />Max K: ' + checkCatGroup.k.max;
			}
      td.appendChild (div);
    }
      
    td.classList.add ('fuFig' + id);
    td.classList.add ('endBlock');
    freeCellAddHandlers (td);
    
    // add table drag handling
    table.setAttribute ('draggable', true);
    table.addEventListener ('dragstart', function(e){
      handleFreeDragSubStart (e, string);});
    table.addEventListener ('dragend', handleFreeDragEnd);
    
    // start new subsequence
    sub++;
    col = 1;
    row = 1;
    prevCol = -999;
    minCol = 1;
    maxCol = 0;
    height = 0;
    subseqString = '';
    totalK = 0;
    
    // return new table
    return document.createElement ('table');
  }
  
  // addRemoveFigureButton adds a button to remove the figure
  function addRemoveFigureButton (container) {
    var div = document.createElement('div');
    div.classList.add ('removeFigureButton');
    div.innerHTML = '<i class="material-icons">close</i>';
    // in iOS, remove is handled by touchstart
    if (!iosDragDropShim.enabled) {
			div.addEventListener ('mousedown', handleFreeRemove);
		}
    container.appendChild (div);
  }
  
  // addFigureK adds figure K
  function addFigureK (container) {
    var div = document.createElement ('div');
    var K = f.k.reduce(function(a, b){return a+b;});
    div.classList.add ('UFKInFigure');
    div.innerHTML = 'K:' + K;
    container.appendChild (div);
    return K;
  }
  
  // make sure the sequence ends with 'eu'. If not, add it
  if (figures[figures.length - 1] && figures[figures.length - 1].string !== 'eu') {
    figures.push ({'string': 'eu', 'subSequence': true});
  }
  
  // check for multiple use of same letter
  var usedLetters = [];
  for (var i = 0; i < figures.length; i++) {
    var f = figures[i];
    var l = f.unknownFigureLetter;
    if (f.aresti) {
      if (l in usedLetters) {
        usedLetters[l] = usedLetters[l] + 1;
      } else usedLetters[l] = 1;
    }
  }
  // draw all real figures
  for (var i = 0; i < figures.length; i++) {
    var f = figures[i];

    f.subSeq = sub;
    if (f.aresti) {
      
      var td = getTd();
      addRemoveFigureButton(td);
      if (!additionalFig.max) totalK += addFigureK(td);
      td.classList.add ('fuFig' + i);

      var svg = newSvg();
      td.appendChild(svg);

      // set different class for Additional and Free figures
      if (f.unknownFigureLetter === 'L') {
        if (additionalFig && (usedLetters.L > additionalFig.max)) {
          td.classList.add ('additionalFigureMulti');
        } else {
          td.classList.add ('additionalFigure');
        }
      } else if (!f.unknownFigureLetter) {
        td.classList.add ('additionalFigure');
        freeFigures++;
      } else if (usedLetters[f.unknownFigureLetter] > 1) {
        td.classList.add ('fuFigureMulti');
      } else {
        td.classList.add ('fuFigure');
      }

      freeCellAddHandlers(td);

      // append every figure with it's letter to subseqString (no letter
      // needed for Free figures in Free Known)
      if (!additionalFig.max && !f.unknownFigureLetter) {
        subseqString += f.string + ' ';
      } else {
        subseqString += '"@' + f.unknownFigureLetter + '" ' + f.string + ' ';
      }
      // set X and Y to 0 to prevent roundoff errors in figure drawing
      // and scaling
      X = Y = 0;
      drawFullFigure(i, false, svg);
      var bBox = f.bBox;
      var thisFig = svg.getElementById('figure' + i);

      // retrieve the group holding the figure and set viewbox
      var xMargin = bBox.width / 20;
      var yMargin = bBox.height / 20;
      thisFig.setAttribute('transform', 'translate(' +
        roundTwo((xMargin - bBox.x)) + ' ' +
        roundTwo((yMargin - bBox.y)) + ')');
      svg.setAttribute('viewBox', '0 0 '+
        roundTwo(bBox.width+xMargin*2)+' '+
        roundTwo(bBox.height+yMargin*2));
      svg.setAttribute('width', cellW);
      svg.setAttribute('height', cellH);
      
      // adjust column and row
      switch (f.exitDir) {
        case 0:
          col += (f.exitAtt == 0) ? 1 : -1;
          break;
        case 90:
          col += (f.exitAtt == 0) ? 1 : -1;
          break;
        case 180:
          col += (f.exitAtt == 0) ? -1 : 1;
          break;
        case 270:
          col += (f.exitAtt == 0) ? -1 : 1;
          break;
      }
      
      prevSub = sub;
    } else if (f.subSequence && (i > 0)) {
      // new subsequence, end previous
      var table = endSubseq (i, '"' + sub + '" ' +subseqString);
      div.appendChild(table);
      // set subSeq number of new subsequence
      figures[i].subSeq = sub;
    } else if ((f.string === 'L') || (f.string === 'X')) {
      // undefined Additional figure
      var td = getTd();
      td.innerHTML = userText[(f.string === 'L') ? 'additional' : 'free'];

      addRemoveFigureButton (td);
      td.classList.add ('fuFig' + i);
      td.classList.add ('additionalFigure');

      freeCellAddHandlers (td);
      // append Additional to subseqString
      subseqString += (additionalFig.max ? '"@L" L ' : 'X ');
      
      prevSub = sub;
    }
  }

  // add 'new subsequence' block
  var tr = document.createElement ('tr');
  table.appendChild (tr);
  var td = freeCell (sub, 1, 1);
  freeCellAddHandlers (td);
  tr.appendChild (td);
  td.innerHTML = (sub === 1) ? userText.dropFigureHere : userText.newCopySubsequence;
  td.classList.add ('fuNewSub');
  
  // mark figures in fuFiguresTable
  var l = figureLetters + (additionalFig.max ? 'L' : 'X');
  for (var i = 0; i < l.length; i++) {
    var td = document.getElementById ('fu' + l[i]);
    // check if td exists to prevent failing ungracefully
    if (td) {
      var match = sequenceText.innerText.match(RegExp ('"@' + l[i] + '"', 'g'));
      if (match) {
        var multi = ((l[i] === 'L') && additionalFig.max) ? additionalFig.max : 1;
        if (l[i] === 'L') {
          td.innerHTML = userText.additional + '<br />' + match.length + 'x';
        }
        if (match.length > multi) {
          td.classList.remove ('figUsed');
          td.classList.add ('figUsedMulti');
        } else {
          td.classList.add ('figUsed');
          td.classList.remove ('figUsedMulti');
        }
      } else if (l[i] === 'X') {
				// set Free figure defaults. Should be overridden by rules
				var freeFigMin = 5;
				var freeFigMax = 5;
				if (rulesActive && checkCatGroup && checkCatGroup.basefig) {
					freeFigMin = checkCatGroup.basefig.min - (figureLetters.length);
					freeFigMax = checkCatGroup.basefig.max - (figureLetters.length);
				}
				if ((freeFigures < freeFigMin) || (freeFigures > freeFigMax)) {
          td.classList.remove ('figUsed');
          td.classList.add ('figUsedMulti');
        } else {
          td.classList.add ('figUsed');
          td.classList.remove ('figUsedMulti');
        }
        td.innerHTML = userText.free + '<br />' + freeFigures + ' / ' +
	        freeFigMax;
      } else {
        td.classList.remove ('figUsed');
        td.classList.remove ('figUsedMulti');
        if (l[i] === 'L') td.innerHTML = userText.additional;
      }
    }
  }
}

// makeFormPilotCard creates pilotcards from the figures array
function makeFormPilotCard() {  
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].paths.length) {
      drawFullFigure(i, figures[i].paths[0].figureStart);
    }
  }
}

// addFormElements adds wind & mini form A and adjusts size
function addFormElements (form) {
  // Find out how big the SVG has become and adjust margins
  var bBox = SVGRoot.getElementById('sequence').getBBox();
  var x = parseInt(bBox.x) ;
  var y = parseInt(bBox.y);
  var w = parseInt(bBox.width);
  var h = parseInt(bBox.height);
  y -= 40;
  switch (form) {
    case 'B':
      drawWind ((w + x) + (miniFormA ? (miniFormA === 'tiny' ? 74 : 172 ) : 0), y, 1);
      break;
    case 'C':
      drawWind (x, y, -1);
      break;
  }
  // Add mini Form A, but only to Form B or C when miniFormA is set
  if (((form === 'C') || (form === 'B')) && miniFormA) {
		if (miniFormA === 'tiny') {
	    makeTinyFormA ((w + x) + 10, y + 50);
		} else makeMiniFormA ((w + x) + 20, y + 50);
  }

  var
	  bBox = SVGRoot.getElementById('sequence').getBBox(),
	  x = parseInt(bBox.x),
	  y = parseInt(bBox.y),
	  w = parseInt(bBox.width),
	  h = parseInt(bBox.height);
  // Change the viewBox to make the sequence fit
  SVGRoot.setAttribute("viewBox",
    (x - 3) + ' ' + (y - 3) + ' ' + (w + 5) + ' ' + (h + 5));
  // resize svg if we are smallMobile, to a max factor 2
  var scaleSvg = platform.smallMobile ? Math.min((window.innerWidth - 8) / (w + 5), 2) : 1;
  
  SVGRoot.setAttribute("width",  scaleSvg * (w + 5));
  SVGRoot.setAttribute("height", scaleSvg * (h + 5));
}

// displayAlerts displays alert messages in the Alerts box
function displayAlerts () {
  var container = document.getElementById('alerts');
  if (container) {
    // Clear any previous messages but make sure we don't remove the label (1 node)
    while (container.childNodes.length > 1) {
      container.removeChild(container.lastChild);
    }
    // sort messages alphabetically/by number. Specific figure messages
    // will be shown first as '(' comes before all letters
    alertMsgs.sort();
    // Add a message to the top to warn if no rules are loaded
    if (!rulesActive) alertMsgs.unshift (userText.noRules);
    // Display messages
    for (var i = 0; i < alertMsgs.length; i++) {
      var span = document.createElement('span');
      span.innerHTML = alertMsgs[i];
      if (alertMsgRules [alertMsgs[i]]) {
        var div = document.createElement ('div');
        div.innerHTML = alertMsgRules [alertMsgs[i]];
        span.appendChild (div);
        span.classList.add ('alertMsgRule');
      }
      container.appendChild (span);
      container.appendChild (document.createElement('br'));
    }
    // Clear all alerts
    alertMsgs = [];
    alertMsgRules = [];
  }
}

// do some kind of draw
// console.log values for debugging
function draw () {

  rebuildSequenceSvg ();
  // reset all drawing variables to default values
  // firstFigure is disabled in Free (Un)known designer
  firstFigure = (activeForm !== 'FU') ? true : false;
  Attitude = X = Y = 0;
  var content = '';
  if (/^[CL]$/.test(activeForm)) {
    goRight = false;
    setYAxisOffset (180 - yAxisOffsetDefault);
    Direction = 180;
  } else {
    goRight = true;
    setYAxisOffset (yAxisOffsetDefault);
    Direction = 0;
  }
  // get current numberInCircle setting
  //changeRollFontSize (document.getElementById('rollFontSize').value);
  numberInCircle = document.getElementById('numberInCircle').checked ? true : false;

  parseSequence();

  switch (activeForm) {
    case 'A':
      makeFormA();
      break;
    case 'B':
    case 'R':
      makeFormB();
      break;
    case 'C':
    case 'L':
      makeFormC();
      break;
    case 'FU':
      makeFree();
      break;
    default:
      makeFormGrid(document.getElementById('gridColumns').value,
	      platform.smallMobile ? 240 * Math.sqrt(document.getElementById('gridColumns').value) : false);
  }
  
  // check if selectedFigure.id is still valid
  if (!figures[selectedFigure.id]) selectFigure(false);
  // display all alerts
  displayAlerts ();
}

/**
// windowResize gets called whenever the window is resized or rotated
function windowResize () {

	if (platform.smallMobile) {
    // set view to device width
		var initScale = screen.width / 320;

	  if (platform.ios && platform.cordova) {
			document.getElementById ('viewport').setAttribute('content',
		    'user-scalable=no, initial-scale=1, width=device-width, '+
		    'viewport-fit=cover');
		  document.body.style = 'transform: scale(' + initScale + '); ' +
			  '-webkit-transform-origin-x: left; ' +
			  '-webkit-transform-origin-y: top;';
		} else {
		  document.getElementById ('viewport').setAttribute('content',
		    'user-scalable=no, viewport-fit=cover, width=321' +
		    (platform.cordova ? ', initial-scale=' + initScale : '')
		  );
		}

	}
}
*/

// virtualKeyboard shows or hides the virtual keyboard for
// special keys for touch devices, except on small mobile
function virtualKeyboard (e) {
  e.hasfocus = (document.activeElement === sequenceText) ? true : false;
  if (platform.touch && platform.mobile && !platform.smallMobile) {
    var el = document.getElementById('virtualKeyboard');
    if (document.activeElement === sequenceText) {
      el.classList.remove ('noDisplay');
    } else {
      el.classList.add ('noDisplay');
    }
  }
}

// clickVirtualKeyboard is called when one of the virtual keys is
// clicked
function clickVirtualKeyboard(e) {
  // remove blur handler until clicking complete
  sequenceText.removeEventListener ('blur', virtualKeyboard);

  var key = e.target.textContent;
  if (key.length === 1) {
    e.target.classList.add ('clicked');
    // always remove highlight after a second
    setTimeout(function(){
      e.target.classList.remove ('clicked');
      }, 1000);
		
		var range = saveSelection (sequenceText);

    sequenceText.innerText = sequenceText.innerText.substring (0, range.start) +
      key + sequenceText.innerText.substring (range.end);
    checkSequenceChanged();

		range.start++;
		range.end = range.start;
		restoreSelection (sequenceText, range);
  }
}

// releaseVirtualKeyboard is called when the virtual keyboard key is
// released
function releaseVirtualKeyboard(e) {
  // restore blur handler
  sequenceText.addEventListener (
    'blur',
    virtualKeyboard,
    false);
  sequenceText.focus();
  e.target.classList.remove ('clicked');
}

// updateSequenceText updates the sequence text and keeps caret location
function updateSequenceText (string) {
  if (document.activeElement === sequenceText) {
		// focussed, maintain caret position
		
		var range = saveSelection (sequenceText);
	  var selStart = range.start;
		var selEnd = range.end;

	  // remove all line breaks from the sequence input field
	  sequenceText.innerHTML = string;
	  
	  // put caret back in correct place
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(sequenceText.childNodes[0], selStart);
		range.setEnd(sequenceText.childNodes[0], selEnd);
		sel.removeAllRanges();
		sel.addRange(range);
	} else {
		// not focussed, just replace
	  sequenceText.innerHTML = string;
	}
}

// checkSequenceChanged is called to check if it has to be redrawn.
// When force is set to true (e.g. after drag & drop) redraw will always
// be done
function checkSequenceChanged (force) {

	var
		selStart = 0,
		selEnd = 0;

  if (document.activeElement === sequenceText) {
		var range = saveSelection (sequenceText);
	  selStart = range.start;
		selEnd = range.end;
	}
				
	if (/(\r\n|\n|\r)/gm.test(sequenceText.innerHTML)) {
		updateSequenceText (sequenceText.innerHTML.replace (/(\r\n|\n|\r)/gm, ' '));
	}

  var selectFigureId = false;

  // whenever the sequence is empty, clear the filename
  if (sequenceText.innerText == '') updateSaveFilename();
  
  // Prevent OpenAero from being left unintentionally
  if (activeSequence.text != sequenceText.innerText) {
    sequenceSaved = false;
  }

  if ((activeSequence.text != sequenceText.innerText.replace(/\u00a0/g, ' ')) || (force === true)) {
    // reset sequence entry options
    updateSequenceOptions ('');
    activeSequence.text = sequenceText.innerText.replace(/\u00a0/g, ' ');
    var string = activeSequence.text;
    // whenever the string is empty, consider it 'saved'
    if (string === '') sequenceSaved = true;

    var figure = [];
    var thisFigure = {'string':'', 'stringStart':0, 'stringEnd':0};
    var inText = false;
    for (var i = 0; i <= string.length; i++) {
      if (string[i] == userpat.comment) inText = !inText;
      if (((string[i] === ' ') || (i === string.length)) && !inText) {
        if (thisFigure.string !== '') {
          var match = thisFigure.string.match (regexMoveForward);
          // Create a separate 'figure' for moveForward (x>) at the
          // beginning of a figure.
          // OLAN had it coupled to a figure but OpenAero keeps sequence
          // drawing instructions separate
          if (match) {
            figure.push ({
              'string':match[0],
              'stringStart':thisFigure.stringStart,
              'stringEnd':(thisFigure.stringStart + match[0].length)});
            thisFigure.stringStart = thisFigure.stringStart + match[0].length;
            thisFigure.string = thisFigure.string.replace(regexMoveForward, '');
          }
          // do the same for moveDown (x^)
          var match = thisFigure.string.match (regexMoveDown);
          if (match) {
            figure.push ({
              'string':match[0],
              'stringStart':thisFigure.stringStart,
              'stringEnd':(thisFigure.stringStart + match[0].length)});
            thisFigure.stringStart = thisFigure.stringStart + match[0].length;
            thisFigure.string = thisFigure.string.replace(regexMoveDown, '');
          }          
          // only add figures that are not empty
          if (thisFigure.string != '') {
            figure.push ({
              'string':thisFigure.string,
              'stringStart':thisFigure.stringStart,
              'stringEnd':i});
            thisFigure.string = '';
            // make the selected figure the same as the one selected in
            // the string, when the string has focus
            if (sequenceText.hasfocus) {
              if ((selStart >= thisFigure.stringStart) && (selStart < i)) {
                if (selectedFigure.id != (figure.length - 1)) {
                  selectFigureId = figure.length - 1;
                }
              }
            }
          }
        }
      } else {
        // set the start when this is the first character
        if (thisFigure.string === '') thisFigure.stringStart = i;
        // add the character
        thisFigure.string += string[i];
      }
    }

    // save previous figures for ^ > flip check
    activeSequence.previousFigures = activeSequence.figures;

    // Now assign to activeSequence      
    activeSequence.figures = figure;
    
    // Get current scroll position of the sequence
    var scrollPosition = SVGRoot.parentNode.scrollTop;
    
    // Update activeSequence.xml and storage
    changeSequenceInfo();

    // Redraw sequence
    draw ();
    
    // scale sequence if zoom is set on mobile
    if (platform.mobile && (activeForm !== 'FU')) {
			var zoom = parseInt(document.getElementById('zoom').textContent.match(/\d+/)[0]) / 100;
			SVGRoot.setAttribute('width', parseInt(SVGRoot.getAttribute('width')) * zoom);
			SVGRoot.setAttribute('height', parseInt(SVGRoot.getAttribute('height')) * zoom);
		}
		
    // Select the correct figure when applicable
    if ((selectFigureId !== false) && (selectedFigure.id !== null)) {
      selectFigure (selectFigureId);
    }
    
    // Set the correct scroll position
    SVGRoot.parentNode.scrollTop = scrollPosition;
          
    // Update figure editor when a figure is being edited
    if (selectedFigure.id !== null) updateFigureEditor();

    // Update marking of figures in figure selector when active
    var el = document.getElementById('figureSelector');
    if (el && el.classList.contains ('active')) {
      markFigures ();
    }
  } else if (document.activeElement === sequenceText) {
    // when no change was made, just check where the caret in the
    // sequence text is and when necessary change selected figure
    for (var i = 0; i < figures.length; i++) {
      if ((selStart >= figures[i].stringStart) && (selStart <= figures[i].stringEnd)) {
        if (figures[i].aresti) {
          selectFigureId = i;
        }
        break;
      }
    }
    if (selectFigureId != selectedFigure.id) {
      selectFigure (selectFigureId);
    }
  }
}

// selectForm selects which Form to show
function selectForm (form) {
  activeForm = form;
  updateDefaultView();
  // always do a full redraw of the form and figure editor as these may
  // change when switching to or from Grid view
  checkSequenceChanged (true);
  // draw (form);
  if (selectedFigure.id) updateFigureEditor();
  if (platform.smallMobile) selectTab('tab-svgContainer');
  setFormLayout (form);
}

// setFormLayout sets the correct layout for each Form view    
function setFormLayout (form) {    
  if ((form === 'Grid') && !platform.smallMobile) {
    document.getElementById ('gridInfo').classList.remove ('hidden');
    document.getElementById('svgContainer').classList.add ('grid');
  } else if (form === 'A' && platform.smallMobile) {
		SVGRoot.style = 'width: 280vw; height: auto;';
	} else {
    document.getElementById ('gridInfo').setAttribute ('style', '');
    document.getElementById ('gridInfo').classList.add ('hidden');
    document.getElementById('svgContainer').classList.remove ('grid');
  }
}

// updateDefaultView updates the hidden defaultView value
function updateDefaultView (queue) {
  var el = document.getElementById('default_view');
  if (queue) {
    el.value = 'queue';
  } else {
    if (activeForm === 'Grid') {
      el.value = 'grid:' + document.getElementById('gridColumns').value;
    } else if (activeForm === 'FU') {
      el.value = 'freeUnknown';
    } else el.value = activeForm;
  }
  changeSequenceInfo();
}

/******************************************
 * Functions for opening and saving files */

// clearSequence will start a new blank sequence, or just clear the
// sequenceText in Free (Un)Known designer
function clearSequence () {
  function clear() {
		if (activeForm !== 'FU') {
	    // clear all input fields
	    var fields = document.getElementsByTagName('input');
	    var length = fields.length;
	    while (length--) {
	      if (fields[length].type === 'text') fields[length].value = '';
	    }

			var div = document.getElementById('referenceSequenceDialog');
			div.classList.remove ('noDisplay');
	    var fields = document.getElementsByTagName('textarea');
	    var length = fields.length;
	    while (length--) fields[length].value = '';
	    console.log(document.getElementById('referenceSequenceString').value);
	    div.classList.add ('noDisplay');
	    changeReferenceSequence();
	    
	    sequenceText.innerText = '';

	    document.getElementById ('fu_figures').value = '';
	    document.getElementById ('default_view').value = '';
	    document.getElementById ('pilot_id').value = '';	// Ajout Modif GG 2017
	    document.getElementById ('flight_nb').value = '';	// Ajout Modif GG 2017
	    // reload sequence
	    unloadRules();
		} else {
			sequenceText.innerText = 'eu';
		}
			
    checkSequenceChanged();
    displayAlerts();
    sequenceSaved = true;
  }
  
  if (!sequenceSaved) {
    confirmBox (userText.sequenceNotSavedWarning,
      userText.clearSequence, clear);
  } else {
    clear();
  }
}

// openLogoFile will load a logo from a file
function openLogoFile () {
  hideLogoChooser();
  openFile(document.getElementById('logoFile').files[0], 'Logo');
}

// programme will load a programme
function programme () {
  var key = this.id.replace(/^programme-/, '');
  OLANBumpBugCheck = false;
  updateSaveFilename();
  if (/^<sequence>/.test(library[key])) {
    activateXMLsequence(library[key]);
  } else {
    if (!launchURL ({url : library[key]})) {
      console.log ('Error loading programme ' + key);
    }
  } 
}

// dropSequence will attempt to load a sequence from a file dropped in
// the main area
function dropSequence (evt) {
  if (evt && evt.dataTransfer && evt.dataTransfer.files &&
    evt.dataTransfer.files[0]) {
    noPropagation(evt);
    openSequence();
  }
}

// openSequence will load a sequence from a .seq file
function openSequence () {
  function open () {
    openFile (document.getElementById('file').files[0], 'Sequence');
  }

  // Check if the current sequence was saved. If not, present a dialog
  if (!sequenceSaved) {
    confirmBox (userText.sequenceNotSavedWarning,
      userText.openSequence, open);
  } else {
    open();
  }

}

// openSequence will load a sequence from a .seq file
function openQueue () {
  openFile(document.getElementById('queue').files[0], 'Queue');
  // Clear file field to enable loading the same file again
  document.getElementById('queueForm').reset();
}

// openRulesFile will load a rules file from a .js file
function openRulesFile () {
  openFile(document.getElementById('rulesFile').files[0], 'RulesFile');
  // Clear file field to enable loading the same file again
  document.getElementById('rulesFileForm').reset();
}

// openFile is called to open a file
// file    = file object from file input element
// handler = name of correct handler to execute after loading. Function
//           names are loaded<handler>
// params  = parameters, if any
function openFile (file, handler, params) {
  if (file) {
    console.log('Reading file: ' + file.name);
    var reader = new FileReader();
    // Handle success, and errors. With onload the correct loading
    // function will be called
    switch (handler) {
      case 'FileList':
        reader.onload = function(e){loadedFileList (e, params)};
        break;
      case 'Sequence':
        reader.onload = function(e){loadedSequence (e, file.name)};
        break;
      case 'Queue':
        reader.onload = loadedQueue;
        break;
      case 'Logo':
        reader.onload = loadedLogo;
        break;
      case 'RulesFile':
        reader.onload = loadedRulesFile;
        break;
    }
    reader.onerror = errorHandler;
    reader.readAsDataURL(file);
  }
}

// removeFileListFile removes a file from fileList
function removeFileListFile(el) {
  var id = el.id.replace(/^removeFileListFile/, '');
  var container = el.parentNode.parentNode;
  console.log ('Removing file:' + fileList[id].name);
  fileList.splice (id, 1);
  // we need to rebuild because splice changes the indexes
  clearFileListContainer (container);
  for (var i = 0; i < fileList.length; i++) {
    addToFileList (i, container);
  }
}
  
// checkMultiDialog shows or hides the multiple sequence check dialog
// when false, the dialog is closed
function checkMultiDialog(show) {
  // hide all menus
  menuInactiveAll();
    
  var div = document.getElementById('checkMulti');
  if (show) {
    // clear the file list
    fileList = [];
    clearFileListContainer (document.getElementById('fileDropFiles'));

    div.classList.remove ('noDisplay');
    var el = document.getElementById('multiCurrentRules');
    el.innerHTML = rulesActive ? rulesActive.replace (/ /g, '&nbsp;') : userText.none;
  } else {
    div.classList.add ('noDisplay');
  }
}

// clearFileListContainer is called to clear file list containers
function clearFileListContainer (container) {
  while (container.childNodes.length > 0) {
    container.removeChild(container.lastChild);
  }
  // make sure we remove all els with fileListFileRemove class
  var e = document.getElementsByClassName ('fileListFileRemove');
  for (var i = e.length - 1; i >= 0; i--) {
    e[i].parentNode.removeChild (e[i]);
  }
  // show orFileDrop text
  container.parentNode.firstChild.classList.remove ('noDisplay');
}
  
// updateFileList is called by updateCheckMulti and updatePrintMulti to
// update the fileList object
// - evt defines where the files come from
// - el is the element that holds the file list
function updateFileList (evt, el) {
  if (evt) {
    if (evt.dataTransfer) {
      noPropagation(evt);
      var files = evt.dataTransfer.files; // FileList object.
    } else {  
      // get files from file element
      var files = evt.files;
      // clear for next, after short wait
      setTimeout(function(){evt.parentNode.reset();}, 400);    
    }
    for (var i = 0; i < files.length; i++) {
      // check if the file is not already in fileList
      for (var j = 0; j < fileList.length; j++) {
        // check for lastModfiedDate, name and size as full path is not
        // available
        if ((files[i].lastModifiedDate.toString() === fileList[j].lastModifiedDate.toString()) &&
          (files[i].name === fileList[j].name) &&
          (files[i].size === fileList[j].size)) {
          console.log('Duplicate, not adding: ' + fileList[j].name);
          j = fileList.length + 1;
        }
      }
      if (j <= fileList.length) {
        openFile (
          files[i],
          'FileList',
          { 'container' : el,
            'file' : files[i]
          }
        );
      }
    }
  }
}

// loadedFileList is called when a file for fileList is loaded
function loadedFileList (e, params) {
  var sequence = loadSequence (e.target.result);
  // only add to fileList when a valid sequence was detected
  if (sequence) {
    params.file.sequence = sequence;
    fileList.push (params.file);
    addToFileList (fileList.length - 1, params.container);
  } else {
    alertBox (userText.multiNoSequence);
  }
}

// addToFileList is called to add a file to a file list
// id        = id of fileList element
// container = where the div will be put
function addToFileList (id, container) {
  // hide the orFileDrop div
  container.parentNode.firstChild.classList.add ('noDisplay');
  // build and add div
  var div = document.createElement ('div');
  var i = document.createElement ('i');
  i.classList.add ('fileListFileRemove');
  i.classList.add ('material-icons');
  i.id = 'removeFileListFile' + id;
  i.innerHTML = 'close';
  i.addEventListener ('mousedown', function(){
    removeFileListFile(this);
    }, false);
  div.appendChild (i);
  var name = document.createTextNode (fileList[id].name);
  div.appendChild (name);
  container.appendChild(div);
  // adjust image size for saving
  saveImageSizeAdjust();
}

// updateCheckMulti is called after dragging & dropping files to check
// multi field or adding files with file chooser
function updateCheckMulti (evt) {  
  updateFileList (evt, document.getElementById('fileDropFiles'));
}

// updatePrintMulti is called after dragging & dropping files to print
// multi field or adding files with file chooser
function updatePrintMulti (evt) {
  updateFileList (evt, document.getElementById('fileDropPrintFiles'));
}

// checkMulti is called to open multiple files for checking.
function checkMulti () {
  if (!chromeApp.active) {
    // open check window. Must do this early to prevent popup blocking
    newWindow ('', userText.sequenceCheckLog);
  }  

  // save active sequence
  multi.savedSeq = activeSequence.xml;
  multi.processing = true;

  infoBox (
    sprintf(userText.checkMultiWait, fileList.length),
    userText.checkMulti);

  // hide dialog screen
  checkMultiDialog();
    
  setTimeout (function() {
    var body = document.createElement('body');
    // go through the selected files
    for (var i = 0; i < fileList.length; i++) {
      checkSequenceMulti (i, body);
    }
  
    // show the check result window
    newWindow (body, userText.sequenceCheckLog);
    // clear "wait" message
    infoBox ();
    // restore saved sequence
    activateXMLsequence (multi.savedSeq);
    
    multi.processing = false;
  }, 1000);
}

// checkSequenceMulti will be called when a sequence file has been
// loaded for multiple sequence checking
function checkSequenceMulti(i, body) {

  /** fixme: possible code to show counter. Problem: it requires full
   *  redraw which makes everything very slow and messy and thus is
   *  counterproductive. Maybe through separate window?
   */
  // document.getElementById ('checkMultiCounter').innerHTML = sprintf(
  //  userText.checkMultiWait, multi.count, multi.total, evt.target.file.name);
  
  console.log('Checking: ' + fileList[i].name);
  // create log entry
  var pre = document.createElement('pre');
  body.appendChild (pre);
  pre.appendChild(document.createTextNode('File: ' + fileList[i].name + '\n'));

  if (fileList[i].sequence) { 
    activateXMLsequence (fileList[i].sequence, true);
  
    // Activate the loading of the checking rules (if any)
    if (document.getElementById('multiOverrideRules').checked) {
      // use rules currently set
      var log = checkRules();
    } else {
      // use rules from file
      var log = changeCombo('program');
    }
  
    // clear any alert boxes. Errors are shown in the log.
    alertBox();
    // clear alert messages
    alertMsgs = [];
    alertMsgRules = [];
  
    if (document.getElementById('multiFullLog').checked) {
      // full expanded log      
      for (var i = 0; i < log.length; i++) {
        pre.appendChild(document.createTextNode(log[i] + '\n'));
      }
    } else {
      // concise log
      
      // get alerts from alert area
      var div = document.createElement('div');
      div.innerHTML = document.getElementById('alerts').innerHTML;
      // remove label
      div.removeChild(div.firstChild);

      if (div.innerHTML == '') {
        if (rulesActive) {
          pre.appendChild(document.createTextNode('Rules: ' + rulesActive + '\n'));
          pre.appendChild(document.createTextNode(userText.sequenceCorrect + '\n'));
        } else {
          pre.appendChild(document.createTextNode(userText.noRules + '\n'));
        }
      } else {
        if (rulesActive) {
          pre.appendChild(document.createTextNode('Rules: ' + rulesActive + '\n'));
        }
        body.appendChild (div);

        var pre = document.createElement('pre');

        body.appendChild (pre);
      }
    }
  }
  pre.appendChild(document.createTextNode(
	  '\n--------------------------------------------------------\n'));
}

/***********************************************************************
 * 
 * Sequence file handling
 * 
 **********************************************************************/
 
// loadedSequence will be called when a sequence file has been loaded
function loadedSequence(evt, name) {

  // Obtain the read file data  
  var xml = loadSequence (evt.target.result);
  if (xml === false) {
    alertBox(userText.notSequenceFile);
    return;
  }

  updateSaveFilename (name.replace(/.*\\/, '').replace(/\.[^.]*$/, ''));

  activateXMLsequence (xml, true);

  // update the sequence if OLANSequence was true
  if (OLANSequence) {
    OLANSequence = false;
    updateSequence (-1, '');
    activeSequence.text = '';
    checkSequenceChanged();
  }

  sequenceSaved = true;

  // Activate the loading of the checking rules (if any)
  changeCombo('program');
  
  checkFuFiguresFile();
}

// loadedQueue will be called when a queue file has been loaded
function loadedQueue(evt) {
  // Obtain the read file data  
  var fileString = loadSequence (evt.target.result);
  if (fileString === false) return;
  
  // save current sequence
  var sequence = activeSequence.xml;

  // clear queue
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i]) {
      if (fig[i].group == 0) {
        delete fig[i];
      } else break;
    }
  }
  // put the figures in the queue
  activateXMLsequence (fileString);

  for (var i = 0; i < figures.length; i++) {  
    if (figures[i].aresti) {
      selectedFigure.id = i;
      addToQueue();
    }
  }

  // restore previous sequence or start with empty
  activateXMLsequence (sequence);
  // show queue
  showQueue();
}

// loadSequence loads a sequence file and does some checks. The
// return value is an XML sequence or false
function loadSequence (fileString) {
  // Check if we have an OLAN sequence or an OpenAero XML sequence.
  // If the sequence file starts with '<sequence', assume it's an XML
  // sequence.
  // If it does the same from steg decode, assume it's XML
  // If it starts with '[', assume it's an OLAN sequence.
  // In all other cases throw an error.
  if (/^data:image\/png/.test (fileString)) {
    try {
      var string = steg.decode (fileString);
      if (string.match (/^<sequence/)) {
        // this is an OpenAero sequence, no need to do OLAN checks
        OLANBumpBugCheck = false;
        return string;
      }
    } catch (err) {}
  } else {
    try {
      fileString = atob (fileString.replace (/^data:.*;base64,/, ''));
      if (fileString.match (/^<sequence/)) {
        // this is an OpenAero sequence, no need to do OLAN checks
        OLANBumpBugCheck = false;
        return fileString;
      }
      if (fileString.charAt(0) === '[') {
        // OLAN sequence, transform to XML
        return OLANtoXML (fileString);
      }
    } catch (err) {}
  }
  console.log('*** ' + userText.notSequenceFile);
  return false;
}

// OLANtoXML transforms an OLAN file to OpenAero XML
function OLANtoXML (string) {
  OLANSequence = true;
  var activeKey = false;
  var lines = string.split('\n');
  string = '<sequence>';
  for (var i = 0; i < lines.length; i++) {
    // remove Windows linebreak
    lines[i] = lines[i].replace('\r', '');
    // check for key match
    if (lines[i].match(/^\[[a-zA-Z]+\]$/)) {
      var key = lines[i].toLowerCase().replace(/[^a-z]/g, '');
      if (key === 'sequence') {
        key = 'sequence_text';
      }
      if (activeKey) {
        string += '</' + activeKey + '>';
        activeKey = false;
      }
      if (inArray(sequenceXMLlabels, key)) {
        string += '<' + key + '>';
        activeKey = key;
      } else activeKey = false;
    } else if (activeKey) string += lines[i];
  }
  if (activeKey) string += '</' + activeKey + '>';
  // end with current oa_version to prevent some error messages
  string += '<oa_version>' + version + '</oa_version></sequence>';
  OLANBumpBugCheck = true;
  return string;
}

// activateXMLsequence will make a sequence provided as XML active
// it returns true on succes and false on failure
function activateXMLsequence (xml, noLoadRules) {
  
  var freeUnknownSequence = '';
  
  // first rebuild the svg container to free up memory
  //rebuildSequenceSvg();
  
  // make sure no figure is selected
  if (selectedFigure.id !== null) selectFigure (false);
  
  // unlock sequence when locked
  if (document.getElementById ('lock_sequence').value) lockSequence();

  // clear previous values
  for (var i = 0; i < sequenceXMLlabels.length; i++) {
    var el = document.getElementById(sequenceXMLlabels[i]);
    if ('value' in el) el.value = ''; else if (el.innerText) el.innerText = '';
  }
  logoImg = false;

  // set 'class' to powered by default to provide compatibility with OLAN
  // and older OpenAero versions
  var el = document.getElementById('class');
  if (el) el.value = 'powered';
  
  if (xml) {
    // myElement will hold every entry as a node
    var myElement = document.createElement('div');
    // myTextArea will translate HTML escape characters to regular ones
    var myTextArea = document.createElement('textarea');
    myElement.innerHTML = xml;
    var rootNode = myElement.getElementsByTagName("sequence")[0];
    
    // return false (=faillure) if no sequence root element present
    if (!rootNode) return false;
    
    var nodes = rootNode.childNodes;
    
    var oldSequence = true;
    // Put every element in the correct field
    for (var ele in nodes) {
      if(nodes[ele].innerHTML) {
        // translate escape characters by browser through myTextArea
        myTextArea.innerHTML = nodes[ele].innerHTML;
        // e will be the field, only put a value when it exists
        var e = document.getElementById(nodes[ele].nodeName.toLowerCase());
        if (e) {
					if ('value' in e) {
						e.value = myTextArea.value;
					} else if ('innerText' in e) e.innerText = myTextArea.value;
				}
        if (nodes[ele].nodeName.toLowerCase() === 'actype') oldSequence = false;
      }
    }

    // put actype and acreg in correct fields for pre 1.5.1.6
    // sequences 
    if (oldSequence) {
      document.getElementById ('actype').value = parseAircraft ('type');
      document.getElementById ('acreg').value = parseAircraft ('registration');
    }

    var prevForm = activeForm;
    // check for default_view
    var view = document.getElementById('default_view').value;
    if (view) {
      var view = view.split(':');
      switch (view[0]) {
        case 'grid':
          document.getElementById('gridColumns').value = view[1];
          activeForm = 'Grid';
          break;
        case 'queue':
          activeForm = 'Grid';
          break;
        case 'freeUnknown':
          freeUnknownSequence = sequenceText.innerText;
          sequenceText.innerText = document.getElementById('fu_figures').value;
          activeForm = 'FU';
          break;
        default:
          if (('ABC'.indexOf (view[0])) > -1) {
            activeForm = view[0];
          } else activeForm = 'B';
      }
    } else activeForm = 'B';

    setFormLayout (activeForm);

    var logo = document.getElementById('logo').value;
    if (logoImages[logo]) selectLogo(logo);

    checkOpenAeroVersion();
  }
  
  // hide Harmony field for powered
  var el = document.getElementById ('harmonyField');
  if (el) {
    if (sportingClass.value === 'powered') {
      el.classList.add ('hidden');
      document.getElementById ('harmony').setAttribute ('disabled', true);
    } else {
      el.classList.remove ('hidden');
      document.getElementById ('harmony').removeAttribute ('disabled');
    }
  }
  
  // set panel headers correctly
  panelHeader (document.getElementById ('activeRules'));
  panelHeader (document.getElementById ('activeContest'), userText.contest);
  
  // Load rules when applicable and update sequence data
  if (!noLoadRules) loadRules();
  
  // check if we are switching from a regular sequence to Free (Un)known
  // or vv
  if ((activeForm === 'FU') && (prevForm !== 'FU')) {
    startFuDesigner(true);
  } else if ((activeForm !== 'FU') && (prevForm === 'FU')) {
    exitFuDesigner(true);
  } else { 
    // update sequence
    checkSequenceChanged();
  }
  
  // if the loaded sequence was a (partial) Free (Un)known composed
  // sequence, load that now that the figures tab has been loaded
  if (freeUnknownSequence) {
    sequenceText.innerText = freeUnknownSequence;
    checkSequenceChanged ();
  } else {
    // lock sequence when applicable
    if (document.getElementById ('lock_sequence').value) lockSequence(true);
  }
  
  // The sequence is now fully loaded
  if (!noLoadRules) checkFuFiguresFile();

  // sequence was just loaded, so also saved
  sequenceSaved = true;
  
  return true;
}

// checkFuFiguresFile checks if:
// rules allow additionals AND figure letters are required AND
// sequence is not locked AND not processing multiple files
// If so, if it may be a Free (Un)known figures file and the user is
// asked if he wants to open it in the Free (Un)known Designer
function checkFuFiguresFile() {
	if (platform.smallMobile) return;
  var l = figureLetters;
  if (
    l &&
    !document.getElementById ('lock_sequence').value &&
    !multi.processing) {
    for (var i = 0; i < figures.length; i++) {
      // when we find a figure without a letter, or with an incorrect
      // letter (including L), stop and return
      if (figures[i].aresti) {
        if (figures[i].unknownFigureLetter &&
          (l.indexOf(figures[i].unknownFigureLetter) >= 0)) {
          l = l.replace (figures[i].unknownFigureLetter, '');
        } else return;
      }
    }
    if (l === '') {
      // all letters used once, fill referenceSequence and ask question
			var div = document.getElementById('referenceSequenceDialog');
			div.classList.remove ('noDisplay');
			var ref = document.getElementById ('referenceSequenceString');
			ref.value = '';
			for (var i = 0; i < figures.length; i++) {
				if (figures[i].aresti && figures[i].unknownFigureLetter &&
					(figures[i].unknownFigureLetter !== 'L')) {
					ref.value += '"@' + figures[i].unknownFigureLetter + '" ' +
						figures[i].string + ' ';
				}
			}
			changeReferenceSequence();
			div.classList.add ('noDisplay');
			
      confirmBox (
        userText[(additionalFig.max ? 'FUstartOnLoad' : 'FKstartOnLoad')],
        userText.openSequence + ' <span class="info" ' +
        'id="manual.html_free_unknown_designer">' +
        '<i class="material-icons info">info</i></span>',
        function(){startFuDesigner(true)}
      );
      document.getElementById('manual.html_free_unknown_designer').addEventListener('mousedown',
        function(){
          helpWindow('doc/manual.html#free_unknown_designer', userText.fuDesigner);
        }
      );
    }
  }
}

// noDragOver is the default for the body
function noDragOver(evt) {
  noPropagation(evt);
  evt.dataTransfer.dropEffect = 'none';
}

// noDrop is the default for the body
function noDrop(evt) {
  noPropagation(evt);
}

// handleDragOver takes care of file dragging
function handleDragOver(evt) {
  noPropagation(evt);
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

/**********************
 * End file functions */

// checkOpenAeroVersion checks for the version number of the loaded
// sequence and provides a warning if necessary
function checkOpenAeroVersion () {
  var oa_version = document.getElementById('oa_version');
  var alerts = '';

  // before 1.2.3
  if (oa_version.value == '') {
    if (sequenceText.innerText != '') alerts += userText.warningPre123;
  }
  
  // before 1.2.4: check for bumps
  if (compVersion (oa_version.value, '1.2.4') < 0) {
    if (sequenceText.innerText.match (/p?bp?b/)) {
      alerts += userText.warningPre124;
    }
  }
  
  // before 1.3.7: check for snaps started from knife edge
  if (compVersion (oa_version.value, '1.3.7') < 0) {
    if (sequenceText.innerText.match (/((^|[^0-9])(4|[357]4?))[if\.'`]*[,;][\.'`]*[357]i?f/)) {
      alerts += userText.warningPre137;
    }
  }
  
  // before 2016.1:
  // check for double bumps with enlarged radius and rolls on the
  // first and second line, where the first roll is of uneven quarters
  if (compVersion (oa_version.value, '2016.1') < 0) {
    if (sequenceText.innerText.match (/B/)) {
      var figures = sanitizeSpaces (sequenceText.innerText).split (' ');
      for (var i = 0; i < figures.length; i++) {
        // remove comments
        figures[i] = figures[i].replace (regexComments, '');
        // only keep specific characters, and convert ; to ,
        figures[i] = figures[i].replace (/[^\d,;B\(\)]/g, '').replace (/;/g, ',');
        // convert all non-quarter rolls to 'r'
        figures[i] = figures[i].replace (/(48|88|128|168|24|44|64|84|22|32|42|2|1|9)/g, 'r');
        // convert remaining rolls to 'q' and remove ,
        figures[i] = figures[i].replace (/\d+/g, 'q').replace (/,/g, '');
        // check for correct match
        if (figures[i].match (/^(q|qr|rq)B+\([qr]/)) {
          alerts += userText.warningPre20161;
          break;
        }
      }
    }
  }
  
  // before 2016.1.1:
  // remove all figures that end with " but do not start with ".
  // Older OpenAero versions would just disregard those
  if (compVersion (oa_version.value, '2016.1.1') < 0) {
    while (sequenceText.innerText.match (/(^| )[^" ]+"[^"]*"( |$)/)) {
      console.log ('Correcting Pre-2016.1.1 sequence');
      console.log (sequenceText.innerText);
      sequenceText.innerText = sequenceText.innerText.replace (/(^| )[^" ]+"[^"]*"( |$)/, ' ');
    }
    // check for X-Y direction changers when loading as Grid
    if (document.getElementById('default_view').value.match (/^grid:\d+$/) &&
      sequenceText.innerText.match (/[a-zA-Z][^ ]*[>^]/)) {
      alerts += userText.warningPre201611;
    }
  }
    
  // add any additional checks here
  // compVersion can be used to check against specific minimum versions

  // check if running OpenAero version is older than that of the
  // sequence, but only check the first two version parts. So checking
  // version 2016.2.1 against 2016.2.2 would not trigger the warning
  if (compVersion (oa_version.value, version, 2) > 0) {
    alerts += userText.warningNewerVersion;
  }

  if (alerts != '') alertBox(alerts + userText.warningPre);
  // set version to current version for subsequent saving
  oa_version.value = version;
}

// compVersion compares two versions and returns:
// -1 when v1 < v2
// 1 when v1 > v2
// 0 when v1 = v2
// No letters can be used but any number of digits. Comparison will
// continue until all parts of the longest version have been checked,
// where a 0 will be counted the same as no number at all.
// When "parts" is set, only that number of parts will be checked
// E.g. ("1.4.1.1", "1.4.0", 2) will return 0 as it only checks "1.4"
function compVersion (v1, v2, parts) {
  if (!v1) return -1;
  if (!v2) return 1;
  var subV1 = v1.split('.');
  var subV2 = v2.split('.');
  var count = (subV1.length > subV2.length) ? subV1.length : subV2.length;
  if (parts && (parts < count)) count = parts;
  // pad zeroes
  while (subV1.length < count) subV1.push(0);
  while (subV2.length < count) subV2.push(0);
  
  for (var i = 0; i < count; i++) {
    if (i >= subV1.length) return -1;
    if (i >= subV2.length) return 1;
    if (parseInt(subV1[i]) < parseInt(subV2[i])) return -1;
    if (parseInt(subV1[i]) > parseInt(subV2[i])) return 1;
  }
  return 0;
}
   
// loadedLogo will be called when a logo image has been loaded
function loadedLogo (evt) {
  var fileData = evt.target.result;
  if (evt.type) {
    logoImg = fileData;
    draw();
    drawActiveLogo();
  } else {
    alertBox (userText.unknownFileType);
  }
}

// loadedRulesFile will be called when a rules file has been loaded
function loadedRulesFile (evt) {
  // get start index for new rules
  var start = rules.length;
  // convert file to array
  var lines = atob (evt.target.result.replace (/^data:.*;base64,/, '')).split("\n");
  for (var i = 0; i < lines.length; i++) {
    // remove any windows linebreaks
    var line = lines[i].replace('\r', '');
    // only keep part inside rules.push
    line = line.replace (/rules\.push[ ]*\("([^"]*).*$/, "$1");
    // replace all double backslashes by single
    line = line.replace (/\\\\/g, '\\');
    // do some basic matching to check for correct rule line
    if (line.match (/^([0-9\.]{5}|\[[^\]]+\]|\([^\)]+\))/) || line.match (/^[^#\/][a-zA-Z0-9\-_]+=/)) {
      console.log(line);
      rules.push (line);
    }
  }
  // when new rules have been added, parse those
  if (rules.length > start) {
    parseRules (start);
    alertBox (userText.rulesImported + (rules.length - start), userText.rulesImportTitle);
  } else {
    alertBox (userText.rulesNotImported, userText.rulesImportTitle);
  }
}

// sanitizeFileName assures fileName does not contain illegal
// characters
function sanitizeFileName (fname) {
	var
		illegalRe = /[\/\?<>\\:\*\|":]/g,
		controlRe = /[\x00-\x1f\x80-\x9f]/g,
		reservedRe = /^\.+$/,
		windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

  var sanitized = fname
    .replace(illegalRe, '')
    .replace(controlRe, '')
    .replace(reservedRe, '')
    .replace(windowsReservedRe, '');
  return (sanitized.substring (0, 255));
}
// updateSaveFilename gets called when the "Save as" filename is changed
function updateSaveFilename (fname) {
	var field = document.getElementById('dlTextField');
	// make sure the filename is legal
  fname = fname ? sanitizeFileName (fname) : '';
  if (field.value !== fname) field.value = fname;
  fileName.innerText = fname;
  storeLocal ('fileName', fname);
}

// writeFileEntry uses the Chrome app API to write files
function writeFileEntry(writableEntry, opt_blob, callback) {
  if (!writableEntry) return;

  writableEntry.createWriter(function(writer) {

    writer.onerror = errorHandler;
    writer.onwriteend = callback;

    // If we have data, write it to the file. Otherwise, just use the
    // file we loaded.
    if (opt_blob) {
      writer.truncate(opt_blob.size);
      waitForIO(writer, function() {
        writer.seek(0);
        writer.write(opt_blob);
      });
    } 
    else {
      chosenEntry.file(function(file) {
        writer.truncate(file.fileSize);
        waitForIO(writer, function() {
          writer.seek(0);
          writer.write(file);
        });
      });
    }
  }, errorHandler);
}

// waitForIO waits for file IO
function waitForIO(writer, callback) {
  // set a watchdog to avoid eventual locking:
  var start = Date.now();
  // wait for a few seconds
  var reentrant = function() {
    if (writer.readyState===writer.WRITING && Date.now()-start<4000) {
      setTimeout(reentrant, 100);
      return;
    }
    if (writer.readyState===writer.WRITING) {
      console.error("Write operation taking too long, aborting!"+
        " (current writer readyState is "+writer.readyState+")");
      writer.abort();
    } 
    else {
      callback();
    }
  };
  setTimeout(reentrant, 100);
}

// saveFile saves a file
// The function returns true if the file was saved
function saveFile(data, name, ext, filter, format) {
  // Set saving result to true always as we currently have no method of
  // knowing whether the file was saved or not
  var result = true;

  // depending on browser we choose a method for
  // saving the file with the following preference:
  // 1) Use chrome.fileSystem, only available when running as Chrome App
  // 2) Use "download" attribute
  // 3) Ask user to right-click and "Save as"

  // convert base64 to binary
  if (format.match (/;base64$/)) {
    var byteC = atob (data);
    var byteN = new Array(byteC.length);
    for (var i = 0; i < byteC.length; i++) {
        byteN[i] = byteC.charCodeAt(i);
    }
    data = new Uint8Array(byteN);
  }

  // 1) Chrome app saving
  if (chromeApp.active) {
    
    chrome.fileSystem.chooseEntry ({
      'type':'saveFile',
      'suggestedName':name+ext
    }, function(w) {
      var blob = new Blob([data], {type: format.replace(/;.+$/, '')});
      writeFileEntry (w, blob, function(){
        // this callback is called after succesful write
        updateSaveFilename (w.name.replace(/\.[^.]*$/, ''));
        if (ext === '.seq') sequenceSaved = true;
      });
    });
    return result;
  }
  
  saveData.blob = new Blob ([data], {type: format.replace(/;.+$/, '')});
  saveData.ext = ext;
  
  var a = document.createElement('a');
  
  if (platform.cordova) {
		saveDialog (' ', name, ext);
	} else if (platform.ios) {
    saveDialog (userText.iOSsaveFileMessage, name, ext);
  } else if (typeof a.download !== "undefined") {
    saveDialog (userText.downloadHTML5, name, ext);
  } else {
    saveDialog (userText.downloadLegacy, name, ext);
  }
  
  return result;
}
  
// saveSequence will save a sequence to a .seq file
// the .seq file is standard xml
function saveSequence () {
  function save() {
    var fname = activeFileName();

    if (fname === '') fname = 'sequence';
    // take the original sequence XML,
    // remove the end tag, add figure XML and add the end tag again.
    // Then beautify the output.
    var xml = activeSequence.xml.replace('</sequence>', '');
    // check if the alerts box contains no alerts. If so, add verified
    // tag
    if (rulesActive &&
      (document.getElementById('alerts').childElementCount < 2)) {
      xml += '<verified>' + rulesActive + '</verified>';
    }
    xml += buildFigureXML();
    xml += buildSettingsXML();
    xml += '</sequence>';
    xml = vkbeautify.xml (xml);
    saveFile (
      xml,
      fname,
      '.seq',
      {'name':'OpenAero Sequence', 'filter':'*.seq'},
      'text/xhtml+xml;utf8'
    );
  }
  
  missingInfoCheck(save);
}

// saveQueue will save the current queue to a .seq file
// the .seq file is standard xml
function saveQueue () {
  var sequenceString = sequenceText.innerText;
  var queueFigs = [];
  for (var i = fig.length - 1; i >= 0; i--) {
    if (fig[i]) {
      if (fig[i].group == 0) {
        queueFigs.push (fig[i].string);
      } else break;
    }
  }
  if (queueFigs.length == 0) {
    alertBox (userText.queueEmpty);
    return;
  }
  // put queue figures in sequence for saving
  sequenceText.innerText = queueFigs.join(' // ');
  updateDefaultView(true);
  checkSequenceChanged();
  var fname = activeFileName('QUEUE');
  // Beautify the output.
  var xml = vkbeautify.xml (activeSequence.xml);
  saveFile (
    xml,
    fname,
    '.seq',
    {'name':'OpenAero Queue', 'filter':'*.seq'},
    'text/xhtml+xml;utf8'
  );

  // restore sequence
  sequenceText.innerText = sequenceString;
  updateDefaultView();
  checkSequenceChanged();
}

// errorHandler will be called when there is a file error
function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

// uriEncode expands encodeURI by also replace single ticks (') and + as
// they may break links in email
function uriEncode (t) {
  return encodeURI(t).replace (/'/g, '%27').replace(/\+/g, '%2B');
}

// encodeBase64Url encodes string t to URL safe base64
function encodeBase64Url (t) {
  t = btoa (t);
  return t.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

// decodeBase64Url decodes URL safe base64 to string
function decodeBase64Url (t) {
  try {
    return atob (t.replace(/-/g, '+').replace(/_/g, '/'));
  } catch (err) {
    return false;
  }
}

// saveAsURL provides a URL encoded sequence that the user can copy
// and then email, bookmark or whatever
function saveAsURL () {
  function save () {
    // compress xml for shorter URL
    var xml = activeSequence.xml.replace(/\n/g, ''); // remove newlines
    xml = xml.replace(/> +</g, '><'); // remove spaces between tags
    // simplifying of end tags and removal of <sequence> tags
    xml = xml.replace(/<\/?sequence>/g, '');
    xml = xml.replace(/<\/[^>]+>/g, '</>'); // remove end tags
    var url = 'https://openaero.net/?s=' + encodeBase64Url(xml);

    alertBox ('<p>' + userText.saveAsURLFromApp +
      '</p><textarea id="saveAsURLArea" readonly></textarea>',
      userText.saveAsURLTitle,
      [{'name': 'copyClipboard', 'function': function(){
        if (!copyFrom.select()) copyFrom.setSelectionRange (0, 9999);
        document.execCommand ('copy');
        alertBox();
      }}]);
    var copyFrom = document.getElementById('saveAsURLArea');
    copyFrom.innerHTML = url;
    copyFrom.focus();
    if (!copyFrom.select()) copyFrom.setSelectionRange (0, 9999);

  }
  
  missingInfoCheck(save);
}

// emailSequence creates an email with a complete sequence as a URL in
// the body and the set save name as subject
function emailSequence () {
  var el = document.getElementById('t_emailSequence');
  
  function email() {
    // create body with descriptive text, newlines and sequence URL
    // also replace single ticks (') and + as they may break the link
    var body = userText.emailHeader + '\r\n\r\n' + 
      'https://openaero.net/?s=' + encodeBase64Url(activeSequence.xml);
    var subject = activeFileName() || 'Sequence';
    el.setAttribute('href', 'mailto:%20?subject=' + encodeURI(subject) +
      '&body=' + encodeURI(body));
    // click again to make sure this also gets triggerred after
    // missingInfoCheck dialog
    el.click();
  }
  
  el.setAttribute('href', '');
  missingInfoCheck (email);
}

// openSequenceLink handles opening a sequence from link in dialog
function openSequenceLink (e) {
  var dialog = document.getElementById('openSequenceLink');
  var link = document.getElementById ('openSequenceLinkUrl');
  
  if (e === false) {
    dialog.classList.add ('noDisplay');
  } else if (e === true) {
    dialog.classList.add ('noDisplay');
    if (!launchURL ({url : link.value})) {
      alertBox (
        sprintf(userText.openSequenceLinkError, link.value),
        userText.openSequenceLink
      );
    } else updateSaveFilename(); // clear filename
  } else {
    dialog.classList.remove ('noDisplay');
  }
  link.value = '';
}

/********************************
 * Functions for handling storage
 */
 
// storeLocal uses localStorage to save data. If this is not supported
// it returns false
function storeLocal(name, value) {
  if (storage) {
    if (chromeApp.active) {
      var c = {};
      c[name] = value;
      chrome.storage.local.set (c);
    } else {
      localStorage.setItem (name, value);
    }
    return true;
  } else {
    return false;
  }
}

// getLocal gets a value from localStorage and returns it. If
// localStorage is not supported it returns false
// To also support chrome.storage (for apps) it works asynchronous.
// Function f is the callback to be called when the storage is loaded
function getLocal(name, f) {
  if (storage) {
    if (chromeApp.active) {
      function ff (value) {
        f (value[name]);
      }
      chrome.storage.local.get (name, ff);
    } else {
      f (localStorage.getItem (name));
    }
  } else {
    return false;
  }
}

/********************************
 * Functions for printing
 */

// parseAircraft will parse aircraft type or registration from Aircraft
// field
function parseAircraft (t) {
  var reg = '';
  var aircraft = document.getElementById('aircraft').value;
  for (var i = regexRegistration.length - 1; i >=0; i--) {
    var match = aircraft.match (regexRegistration[i]);
    if (match) {
      reg = match[0];
      break;
    }
  }
  return ((t === 'registration') ? reg : aircraft.replace(reg, '').trim());
}

// printForms will print selected forms
// Depending on the system a method will be chosen:
// 1) Chrome app: open window and print from that. This actually uses
//    a Quirks mode "fix" for height layout. HACK!
// 2) Integrate print into main page and use screen and media print styles

function printForms () {
  // set a short default wait
  var wait = 50;
  if (fileList.length > 0) {
    infoBox (
      sprintf(userText.printMultiWait, fileList.length),
      userText.printMulti);
    // set wait to 1 second when printing multi to build infoBox
    wait = 1000;
  }

	// Print the constructed pages. For the Chrome App an asynchronous callback
	// is used. For the web version we work synchronous but use
	// setTimeout to prevent browser blocking.
	if (chromeApp.active) {
		chrome.app.window.create ('print.html', {
			bounds: {
				width: 800,
				height: 600
			}
		}, function(w) {
			var win = w.contentWindow;
			var style = win.document.createElement ('style');
			style.type = 'text/css';
			style.media = 'print';
			style.innerHTML = '@page {size: auto; margin: ' +
				document.getElementById ('marginTop').value + 'mm ' +
				document.getElementById ('marginRight').value + 'mm ' +
				document.getElementById ('marginBottom').value + 'mm ' +
				document.getElementById ('marginLeft').value + 'mm}' +
				'body {margin: 0;}' +
				'.breakAfter {position: relative; display:block; ' +
				'page-break-inside:avoid; page-break-after:always; ' +
				'height: 100%;}' +
				'svg {position: absolute; top: 0; height: 100%;}';

			win.onLoad = function() {
				win.document.title = activeFileName();
				win.document.body = buildForms (win);
				win.document.head.appendChild(style);
				if (win.matchMedia) {
					var mediaQueryList = win.matchMedia ('print');
					mediaQueryList.addListener (function (mql) {
						if (!mql.matches) win.close();
					});
				}
				win.print();
			};
		});
	} else {
		setTimeout (function() {
	      // update the print style with margins
	      var style = document.getElementById ('printStyle');
	      style.innerHTML = '@page {size: auto; margin: ' +
	          document.getElementById ('marginTop').value + 'mm ' +
	          document.getElementById ('marginRight').value + 'mm ' +
	          document.getElementById ('marginBottom').value + 'mm ' +
	          document.getElementById ('marginLeft').value + 'mm}' +
	          'html {height: 100%;}' +
	          'body {margin: 0; height: 100%;}' +
	          '.noPrint {display: none;}' +
	          '#noScreen {height: 100%;}' +
	          '.breakAfter {position: relative; display:block; ' +
	          'page-break-inside:avoid; page-break-after:always; ' +
	          'height: 100%;}' +
	          'svg {position: absolute; top: 0; height: 100%;}';

				window.document.title = '';	
	      var printBody = buildForms (window);
	      // clear noScreen div
	      var div = document.getElementById ('noScreen');
	      while (div.firstChild) div.removeChild (div.firstChild);
	      // add all nodes that will be printed
	      while (printBody.childNodes.length > 0) {
	        div.appendChild (printBody.childNodes[0]);
	      }	
				window.document.title = activeFileName();
	      
	      // can be improved but works for now...
	      if (platform.cordova) {
					cordova.plugins.printer.print (
						'<html>' + 
							'<head>' +
								'<style type="text/css">' + style.innerHTML + '</style>' +
							'</head><body>' +
								div.innerHTML +
							'</body>' +
						'</html>');
				} else {
					window.print();				
				}
				// restore title
				changeSequenceInfo();
	    }, wait);
	}
}

// buildForms will format selected forms for print or save. When
// win=true, a body is created in window win and returned (for print).
// Otherwise an SVG holding the forms is returned.
function buildForms (win) {
  var pages = ['A', 'B', 'C', 'R', 'L', 'PilotCards', 'Grid'];
  iacForms = document.getElementById('iacForms').checked;
  var activeFormSave = activeForm;
  var svg = '';
  var translateY = 0;
  // save the miniFormA value and set miniFormA depending on checkbox
  var miniFormASave = miniFormA;
  // save the Sequence Notes check
  var sequenceNotesSave = document.getElementById('printNotes').checked;
  // save the current logo
  var logoSave = document.getElementById('logo').value;
  
  var fname = activeFileName() || 'sequence';

  // make sure no figure is selected
  selectFigure (false);
    
  if (win) var body = win.document.createElement('body');
  
  // set multi to true if we have a fileList
  var multi = (fileList.length > 0);

  if (multi) {
    // save active sequence and settings
    var savedSeq = activeSequence.xml;
    saveSettingsStorage ('tempSavedSettings');
  }
  
  // Do at least once. If the fileList is populated by printMulti,
  // every sequence in it will be loaded
  do {

    if (multi) {
      var file = fileList.shift();
      // set previous settings for default values
      loadSettingsStorage ('tempSavedSettings');
      // load settings from sequence
      loadSettingsXML (file.sequence);
        
      activateXMLsequence (file.sequence, true);
      
      // Add sequence file name if checked
      // Do this by putting it in the Notes area. If the 'Sequence Notes'
      // box is already ticked, add it before any existing Notes
      if (document.getElementById('showFileName').checked) {
        var e = document.getElementById('printNotes');
        var t = document.getElementById('notes').value;
        t = ((t != '') && e.checked) ? file.name + ' - ' + t : file.name;
        document.getElementById('notes').value = t;
        e.setAttribute('checked', true);
      }

      // anonymize sequence if checked
      if (document.getElementById('anonymousSequences').checked) {
        document.getElementById('pilot').value = '';
        document.getElementById('team').value = '';
        document.getElementById('aircraft').value = '';
      }
      
      // select correct logo
      switch (document.getElementById('multiLogo').value) {
        case 'remove':
          removeLogo ();
          break;
        case 'active':
          selectLogo (logoSave);
      }

      // Activate the loading of the checking rules (if any)
      if (document.getElementById('printMultiOverrideRules').checked) {
        // use rules currently set
        var log = checkRules();
      } else {
        // use rules from file
        var log = changeCombo('program');
      }
      
    }
    
    // go through the pages
    for (var i = 0; i < pages.length; i++) {
      if (document.getElementById('printForm' + pages[i]).checked) {
        activeForm = pages[i];
        
        var formSVG = buildForm (win);
        
        if (win) {
          
          var div = win.document.createElement('div');
          div.setAttribute ('class', 'breakAfter noScreen');
          div.innerHTML = formSVG;
          // make sure we only keep the svg images in the div
          var nodes = div.childNodes;
          for (var k = nodes.length - 1; k >= 0; k--) {
            if (!/svg/i.test(nodes[k].tagName)) div.removeChild (nodes[k]);
          }
          body.appendChild (div);
        } else {
          // remove newlines from SVG to simplify regex matching
          formSVG = formSVG.replace (/[\n\r]/g, '');
          // remove end tag from all SVGs
          formSVG = formSVG.replace (/<\/svg>$/, '');
          if (svg === '') {
            // use first SVG start tag and adjust width
            svg = formSVG.replace (/(<svg[^>]*width=")([^"]*)/, '$1' +
              document.getElementById ('imageWidth').value);
          } else {
            // remove subsequent SVGs start tags
            formSVG = formSVG.replace (/^.*?<svg[^>]*>/, '');
            // remove xml declarations
            formSVG = formSVG.replace (/<\?xml[^>]*>/, '');
            // add translated group with formSVG
            svg += '<g transform="translate (0,' + translateY + ')">' +
              formSVG + '</g>';
          }
          translateY += 1130 + parseInt(document.getElementById ('pageSpacing').value);
        }
      }
    }
    // continue until fileList is empty
  } while (fileList.length);

  // hide print dialog, do this after we are done as fileList will
  // also be cleared
  printDialog();
  
  infoBox();

  if (!win) {
    svg += '</svg>';
    var height = translateY -
      parseInt(document.getElementById ('pageSpacing').value) + 10;
    // update first rectangle
    svg = svg.replace (/<rect [^>]+>/, '<rect x="-5" y="-20" ' +
      'width="810" height="' + (height + 40) + '" ' +
      'style="fill: white;"/>');
    // Update viewBox
    // Add some margin to make sure bold lines etc are correctly shown
    svg = svg.replace (/viewBox="[^"]*"/, 'viewBox="-5 -5 810 ' +
      height + '"');
    // replace first width and height. These should be for complete SVG
    svg = svg.replace (/width="[^"]*"/, 'width="' +
      document.getElementById ('imageWidth').value + 'px"');
    svg = svg.replace (/height="[^"]*"/, 'height="' +
      document.getElementById ('imageHeight').value + 'px"');    
  }

  if (multi) {
    // restore previous settings and sequence
    loadSettingsStorage ('tempSavedSettings');
    activateXMLsequence (savedSeq);
    // restore the Sequence Notes check
    document.getElementById('printNotes').checked = sequenceNotesSave;
  }

  // Reset the screen to the normal view
  miniFormA = miniFormASave;
  selectForm (activeFormSave);
  
  return (win ? body : svg);
}

// adjustRollFontSize will adjust the rollFontSize to compensate for
// scaling in buildForm
function adjustRollFontSize (scale, svg) {
  var baseRollFontSize = rollFontSize;
  if (svg) {
    SVGRoot = svg;
  } else {
    svg = SVGRoot;
  }
  // increase rollFontSize for significant downscaling, and redraw
  if (parseInt (rollFontSize / scale) > rollFontSize) {
    changeRollFontSize (parseInt (rollFontSize / scale));
    draw();
    changeRollFontSize (baseRollFontSize);
  }
  return SVGRoot;
}
    
// buildForm will build a complete SVG string for printing a form
// from a provided SVG object and activeForm global.
// The default size of the page is A4, 800x1130
function buildForm (print) {

	if ((activeForm === 'B') && document.getElementById('printMiniFormAonB').checked) {
		miniFormA = true;
	} else if ((activeForm === 'C') && document.getElementById('printMiniFormAonC').checked) {
		miniFormA = true;
	} else {
		miniFormA = false;
	}
	
	if (activeForm === 'PilotCards') {
    var el = document.getElementById('pilotCardLayout').getElementsByClassName('active')[0];
		activeForm = el.classList.contains ('formL') ? 'L' : 'R';
		draw ();
		activeForm = 'PilotCards';
	} else draw ();
  var bBox = SVGRoot.getBBox();
  var mySVG = SVGRoot;
  
  switch (activeForm) {
    
    case 'Grid':
	    addFormElementsGrid (mySVG);
      break;
      
    case 'PilotCards':
      // 1 to 4 pilot cards on a sheet
      var
	      rotate = false,
	      flipSecond = el.classList.contains ('formRL') ? true : false;
      switch (el.id) {
        case 'pilotCard2':
          var copies = 2;
          rotate = true;
          var width = 565;
          var height = 800;
          break;
        case 'pilotCard4':
          var copies = 4;
          var width = 400;
          var height = 565;
          break;
        default:
          var copies = 1;
          var width = document.getElementById('pilotCardPercentValue').value * 8;
          var height = document.getElementById('pilotCardPercentValue').value * 11.3;
      }
      if (copies !== 1) {
        // add 10% margin
        var w = parseInt(bBox.width) * 1.1;
        var x = parseInt(bBox.x) - bBox.width * 0.05;
        var h = parseInt(bBox.height) * 1.1;
        var y = parseInt(bBox.y) - bBox.height * 0.05;
      } else {
        var w = parseInt(bBox.width);
        var x = parseInt(bBox.x);
        var h = parseInt(bBox.height);
        var y = parseInt(bBox.y);  
      }
        
      // find correct scale
      var scale = roundTwo (Math.min (width / w, height / h));
  
      // make copies and translate / rotate / scale
      var seq1 = mySVG.getElementById('sequence');
  
      if (rotate) {
        // use matrix transform to rotate, scale and translate
        seq1.setAttribute ('transform', 'matrix(0,' + scale + ',' +
          (-scale) + ',0,' + (scale * (h + y) + (height - h * scale) / 2) + ',' +
          (-scale * x + ((width - w * scale) / 2)) + ')');
  
      } else {
        seq1.setAttribute('transform', 'translate(' +
        roundTwo(-x * scale) + ',' + roundTwo(-y * scale) +
        ') scale(' + scale + ')');
      }
      
      if (copies !== 1) {
				if (flipSecond) {
					activeForm = 'L';
					draw ();
				  var bBox = SVGRoot.getBBox();
				  var seq2 = SVGRoot.getElementById('sequence');
	        var x2 = parseInt(bBox.x) - bBox.width * 0.05;
				} else var seq2 = seq1.cloneNode(true);
        seq2.setAttribute('id', 'seq2');
        if (rotate) {
	        // use matrix transform to rotate, scale and translate
	        seq2.setAttribute ('transform', 'matrix(0,' + scale + ',' +
	          (-scale) + ',0,' + (scale * (h + y) + (height - h * scale) / 2) + 
	          ',' + (-scale * (flipSecond ? x2 : x) + width +
	          ((width - w * scale) / 2)) + ')');
        } else {
          seq2.setAttribute('transform', 'translate(' +
						roundTwo(((flipSecond ? -x2 : -x) * scale) + width) + ',' +
						roundTwo(-y * scale) + ') scale(' + scale + ')');
        }
        mySVG.appendChild(seq2);
      }
      
      if (copies === 4) {
				var seq3 = seq1.cloneNode(true);
        seq3.setAttribute('id', 'seq2');
        seq3.setAttribute('transform', 'translate(' +
					roundTwo(-x * scale) + ',' + roundTwo(-y * scale + height) +
          ') scale(' + scale + ')');
        mySVG.appendChild(seq3);
        var seq4 = seq2.cloneNode(true);
        seq4.setAttribute('id', 'seq4');
        seq4.setAttribute('transform', 'translate(' +
              roundTwo(((flipSecond ? -x2 : -x) * scale) + width) + ',' +
              roundTwo(-y * scale + height) + ') scale(' + scale + ')');
        mySVG.appendChild(seq4);
      }
      mySVG.setAttribute ('viewBox', '0 0 800 1130');
      mySVG.setAttribute("width", '100%');
      break;
      
    case 'L':
    case 'R':
      addFormElementsLR (mySVG, print);
      break;

    default:
      // Find the size and adjust scaling if necessary, upscaling to a
      // maximum factor of 2.
      // The sequence max width=800, height=1000 (Form A) or 950 (Form B & C)
      w = parseInt(bBox.width);
      h = parseInt(bBox.height + 20); // add some margin to the bottom
      
      if (activeForm === 'A') {
        var maxHeight = 1000;
      } else {
        var maxHeight = 950;
        if (document.getElementById('printCheck').checked) {
          maxHeight -= 12;
        }
      }
      
      if (iacForms) {
        // IAC forms
        var moveRight = 15;
        // check maximum scale from print dialog
        var maxScale = document.getElementById ('maxScaling').value / 100;
          
        // For form A we need to add the righthand scoring column, so
        // max width = 580
        if (activeForm === 'A') {
          var scale = Math.min (580 / w, maxScale);
          var marginTop = 130;
        } else {
          var scale = Math.min (700 / w, maxScale);
          var marginTop = 120;
        }
        // check for max height
        if ((maxHeight / h) < scale) {
          scale = Math.min (maxHeight / h, maxScale);
          // height limited, so we can move the sequence right for centering
          moveRight = Math.max ((700 - (w * scale)) / 2, 0) + 15;
        }
        
        // Check if roll font size should be enlarged because of downscaling.
        // Do this before adding wind and box around sequence as sequence
        // may be redrawn!
        mySVG = adjustRollFontSize (scale, mySVG);
        
        // remove wind arrow
        var el = mySVG.getElementById('windArrow');
        if (el) el.parentNode.removeChild(el);
        
        if (activeForm === 'A') {
          // check if the columns should be stretched
          var maxStretch = 1.2;
          moveRight = 0;
          var xScale = scale;
          if ((xScale * w) < 580) xScale = Math.min (580 / w, maxStretch);
    
          mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
            (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
            ') scale(' + xScale + ',' + scale + ')');
          mySVG.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');
        } else {
          // Insert box containing sequence
          drawRectangle (0, 126, 740, 945, 'formLine', mySVG);
  
          mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
            (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
            ') scale(' + scale + ')');
        }
        
        // rebuild wind arrow in the correct place
        if (activeForm === 'B') {
          drawWind (740, 110, 1, mySVG);
        } else if (activeForm === 'C') {
          drawWind (0, 110, -1, mySVG);
        }
      
        //mySVG.setAttribute("viewBox", '0 0 800 1130');
        //mySVG.setAttribute("width", '100%');
        // Add all necessary elements
        if (logoImg) {
          if (activeForm === 'A') {
            var logoSvg = buildLogoSvg(logoImg, 610, 930, 110, 110);
          } else {
            var logoSvg = buildLogoSvg(logoImg, 0, 10, 80, 100);
          }        
          mySVG.appendChild(logoSvg);
        }
        buildHeader (mySVG);
        if (activeForm === 'A') {
          buildScoreColumn (mySVG);
          buildCornertab (mySVG);
        }
      } else {
        // CIVA forms
        var moveRight = 10;
  
        // set maximum scale from print dialog
        var maxScale = document.getElementById ('maxScaling').value / 100;
        
        // take the tear-off tab into account with no miniFormA
        // (defined by X + Y = 1620)
        if (!miniFormA) {
          if ((1620 / (w+h)) < maxScale) maxScale = 1620 / (w+h);
        }
  
        // For form A we need to add the righthand scoring column, so
        // max width = 620. For Form B and C max width = 790 to always
        // provide 10px left margin to sequence.
        if (activeForm === 'A') {
          var scale = Math.min (600 / w, maxScale);
          var marginTop = 130;
        } else {
          var scale = Math.min (790 / w, maxScale);
          var marginTop = 140;
        }
        // check for max height
        if ((maxHeight / h) < scale) {
          scale = Math.min (maxHeight / h, maxScale);
          // height limited, so we can move the sequence right for centering
          // limit this on tear-off tab
          moveRight = Math.max (1620 - ((w + h) * scale), 0) / 2;
        }
        
        mySVG = adjustRollFontSize (scale, mySVG);
  
        if (activeForm === 'A') {
          // check if the columns should be stretched
          var maxStretch = 1.2;
          moveRight = 0;
          var xScale = scale;
          if ((xScale * w) < 620) {
            xScale = 620 / w;
            if (xScale > maxStretch) {
              xScale = maxStretch;
            }
          }
          mySVG.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');
    
          mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
            (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
            ') scale(' + xScale + ',' + scale + ')');
        } else {
          mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
            (moveRight - (bBox.x * scale)) + ',' + (marginTop - bBox.y * scale) +
            ') scale(' + scale + ')');
        }
          
        // Add all necessary elements
        var logoWidth = 0;
        if (logoImg) {
          var logoSvg = buildLogoSvg(logoImg, 0, 0, 200, 120);
          mySVG.appendChild(logoSvg);
          logoWidth = parseInt(logoSvg.getBBox().width) + 10;
        }
        var header = document.createElementNS(svgNS, 'g');
        buildHeader (header, logoWidth);
        mySVG.appendChild(header);
        
        if (activeForm === 'A') buildScoreColumn (mySVG);
        buildCornertab (mySVG);
      }
      
      if ((activeForm === 'B') || (activeForm === 'C')) {
        // add sequence string when checked.
        if (document.getElementById('printString').checked) {
          addSequenceString (mySVG, {x:10, y:1085, width:600, height:40}, print);
        }
        
        // add check result when checked
        if (document.getElementById('printCheck').checked) {
          addCheckResult (mySVG, {x:10, y:1082});
        }
  
      }
      mySVG.setAttribute("viewBox", '0 0 800 1130');
      mySVG.setAttribute("width", '100%');
  }
  
  // remove height when printing
	if (print) mySVG.removeAttribute("height");

  // Add the notes to the top when checked. This will result in a
  // "vertical flattening" of the entire form
  if (document.getElementById('printNotes').checked) {
    // rebuild entire svg in group
    var g = document.createElementNS (svgNS, 'g');
    while (mySVG.childNodes.length > 0) {
      var node = mySVG.firstChild;
      mySVG.removeChild (node);
      g.appendChild (node);
    }
    // temporarily attach text to SVG root
    var t = mySVG.appendChild(document.createElementNS(svgNS, 'text'));
    t.setAttribute('style', style.printNotes);
    var dy = style.printNotes.match (/font-size[ ]*:[ ]*([\d]+)/)[1];
    var lines = document.getElementById('notes').value.replace(/\r/g, '').split ('\n');
    for (var i = 0; i < lines.length; i++) {
      t.appendChild (tspan(lines[i], dy));
    }
    var box = t.getBBox();
    var vScale = (1126 - box.height) / 1130;
    t.setAttribute ('transform', 'translate(' + (-box.x) + ',' +
      (-box.y) + ')');
    g.setAttribute ('transform', 'translate (0,' + (box.height + 4) +
      ') scale (1,' + vScale + ')');
    mySVG.appendChild (g);
  }
  
  // Insert rectangle (=background) at the beginning
  var path = document.createElementNS (svgNS, "rect");
  path.setAttribute('x', '-5');
  path.setAttribute('y', '0');
  path.setAttribute('width', '810');
  path.setAttribute('height', '1130');
  path.setAttribute('style',style.formBackground);
  mySVG.insertBefore(path, mySVG.firstChild);

  svg = mySVG;

  // For some reason serializeToString may convert the xlink:href to
  // a0:href or just href for the logo image
  // So we change it back right away because otherwise the logo isn't displayed
  var sequenceSVG = new XMLSerializer().serializeToString(svg).replace (/ [^ ]*href/g, ' xlink:href');
  sequenceSVG = '<?xml version="1.0" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.2//EN" ' +
    '"http://www.w3.org/Graphics/SVG/1.2/DTD/svg12.dtd">\n' + sequenceSVG;
    
  // create Black & White (sequence drawing only) forms when checked
  if (document.getElementById('blackWhite').checked) {
    // replace style neg by negBW
    var regex = RegExp('"' + style.neg + '"', 'g');
    sequenceSVG = sequenceSVG.replace (regex, '"' + style.negBW + '"');
    // replace style negfill by negfillBW
    var regex = RegExp('"' + style.negfill + '"', 'g');
    sequenceSVG = sequenceSVG.replace (regex, '"' + style.negfillBW + '"');
    // replace remaining red by black
    sequenceSVG = sequenceSVG.replace(/\bred;/g, 'black;');
  }
  
  // create inverse forms when checked
  if (document.getElementById('inverseForms').checked) {
    // build sequence white-on-black
    sequenceSVG = sequenceSVG.replace(/\bwhite;/g, 'BLACK;');
    sequenceSVG = sequenceSVG.replace(/\bblack;/g, 'white;');
    sequenceSVG = sequenceSVG.replace(/\bBLACK;/g, 'black;');
    // change red to lighter red
    sequenceSVG = sequenceSVG.replace(/\bred;/g, '#ff6040;');
    
    // fatten lines
    sequenceSVG = sequenceSVG.replace(/stroke-width:\s*2px;/g, 'stroke-width: 4px;');
    sequenceSVG = sequenceSVG.replace(/stroke-width:\s*1\.5px;/g, 'stroke-width: 3px;');
    sequenceSVG = sequenceSVG.replace(/stroke-width:\s*1px;/g, 'stroke-width: 2px;');
  }

  return sequenceSVG;
}

// addSequenceString will add a correctly formatted sequence string to
// a sequence diagram
function addSequenceString (svg, textBox, print) { 
  var txt = sanitizeSpaces(activeSequence.text);
  // When printing a PDF, we prefer textarea as this improves
  // copy/paste 
  // When saving as image, we can not use textarea as this will
  // cause errors in conversion
  if (print) {
    // replace spaces and hyphens by non-breaking to make sure
    // copy/paste works correctly and minimum lines are used
    txt = txt.replace (/ /g, '&nbsp;').replace (/-/g, '&#8209;');
    drawTextArea (txt, textBox.x, textBox.y,
      textBox.width, textBox.height, 'sequenceString', '', svg);
  } else {
    var g = document.createElementNS (svgNS, 'g');
    drawText(txt, 0, 0, 'sequenceString', '', 'start', g);
    svg.appendChild(g);

    var scaleBox = '';

    var box = g.getBBox();
    if (box.width > textBox.width) {
      g.removeChild(g.firstChild);
      // medium to long text
      // split on last possible space, might create three lines
      var words = txt.split (' ');
      var lines = [''];
      var maxChar = parseInt(txt.length * (textBox.width / box.width));
      for (var i = 0; i < words.length; i++) {
        if ((lines[lines.length-1].length + words[i].length) < maxChar) {
          lines[lines.length-1] += words[i] + ' ';
        } else {
          lines.push(words[i] + ' ');
        }
      }

      if (lines.length > 3) {
        // very long text
        // Split in three equal lines
        drawText(txt.substring (0,parseInt(txt.length / 3)),
          0, 0, 'sequenceString', '', 'start', g);
        drawText(txt.substring (parseInt(txt.length / 3),
          parseInt((txt.length / 3) * 2)),
          0, 13, 'sequenceString', '', 'start', g);
        drawText(txt.substring (parseInt((txt.length / 3) * 2)),
          0, 26, 'sequenceString', '', 'start', g);
      } else {
        for (var i = 0; i < lines.length; i++) {
          drawText(lines[i], 0, i * 13, 'sequenceString', '', 'start', g);
        }
      }
      //  adjust X scale if necessary
      box = g.getBBox();
      var scaleX = textBox.width / box.width;
      if (scaleX < 1) {
        scaleBox = ' scale (' + scaleX + ',1)';
      }
    }
    g.setAttribute ('transform', 'translate (' + (textBox.x - box.x) +
      ',' + ((textBox.y + 40) - (box.y + box.height)) + ')' + scaleBox);
  }
}

// addCheckResult will add the check result to a sequence
function addCheckResult (svg, pos) {
  checkRules();
  var d = new Date();
  var text = userText.sequenceTest +
    d.getDate() + '-' +
    parseInt(d.getMonth() + 1) + '-' +
    d.getFullYear() + ' ' +
    d.getHours() + ':' +
    ('0' + d.getMinutes()).slice(-2) + ' ' +
    'OpenAero ' + version + ' ' +
    rulesActive + ' ';
  var g = document.createElementNS (svgNS, 'g');
  g.id = 'checkResult';
  if (!alertMsgs.length) {
    drawText(text + userText.sequenceCorrect, pos.x, pos.y,
      'sequenceString', '', 'start', g);
  } else {
    var y = pos.y;
    for (var i = alertMsgs.length - 1; i>=0; i--) {
      drawText (alertMsgs[i], pos.x, y,
        'sequenceString', '', 'start', g);
      y -= 12;
    }
    drawText (text + userText.sequenceHasErrors, pos.x, y,
      'sequenceString', '', 'start', g);
  }
  svg.appendChild (g);
  alertMsgs = [];
  alertMsgRules = [];
  return g.getBBox();
}

// addFormElementsLR will add all L or R form elements to a provided SVG object.
// The default size of the page is A4, 800x1130
function addFormElementsLR (svg, print) {
  // logo
  var logoWidth = 0;
  if (logoImg) {
    var logoSvg = buildLogoSvg(logoImg, 0, 0, 120, 70);
    svg.appendChild(logoSvg);
    logoWidth = parseInt(logoSvg.getBBox().width);
  }
  // header
  drawRectangle (logoWidth + 10, 2, 490 - logoWidth, 68, 'formLine', svg);
  drawLine (logoWidth + 10, 36, 490 - logoWidth, 0, 'formLine', svg);
  drawText (document.getElementById('rules').value,
    logoWidth + 20, 25, 'formATextLarge', 'start', '', svg);
  drawText (document.getElementById('category').value +
    ((document.getElementById('class').value === 'glider') ? ' Glider' : ''),
    logoWidth / 2 + 250, 25, 'formATextLarge', 'middle' , '', svg);
  drawText (document.getElementById('date').value,
    490, 25, 'formATextLarge', 'end', '', svg);
  drawText (document.getElementById('program').value,
    logoWidth + 20, 60, 'formATextLarge', 'start', '', svg);
	drawText (document.getElementById('location').value,
    490, 60, 'formATextLarge', 'end', '', svg);
    
  drawRectangle (510, 2, 50, 98, 'formLine', svg);
  drawText (userText.figureK, 535, 15, 'formATextSmall', 'middle', '', svg);
  drawLine (510, 51, 50, 0, 'formLine', svg);
  drawText (userText.totalK, 535, 64, 'formATextSmall', 'middle', '', svg);
  
  drawRectangle (570, 2, 150, 98, 'formLineBold', svg);
  drawText (userText.judgesName, 580, 13, 'formATextTiny', 'start', '', svg);
  drawLine (570, 51, 150, 0, 'formLine', svg);
  drawText (userText.signature, 580, 62, 'formATextTiny', 'start', '', svg);
  drawText (userText.number, 670, 62, 'formATextTiny', 'start', '', svg);

  drawRectangle (730, 2, 68, 98, 'formLineBold', svg);
  drawText (userText.flightNr, 765, 15, 'formATextSmall', 'middle', '', svg);
  drawText (document.getElementById('flight_nb').value, 764, 55, 'formATextXL', 'middle', '', svg);	// Ajout Modif GG 2017

  // continue from bottom
  
  // pilot info line
  drawText (userText.pilot + ':', 195, 1128, 'formATextSmall', 'end', '', svg);
  drawText (document.getElementById('pilot').value, 200, 1128, 'formATextLarge', 'start', '', svg);
  drawText (userText.ac + ':', 495, 1128, 'formATextSmall', 'end', '', svg);
  drawText (document.getElementById('aircraft').value, 500, 1128, 'formATextLarge', 'start', '', svg);
  if (document.getElementById('team').value) {
    drawText (userText.team + ':', 740, 1128, 'formATextSmall', 'end', '', svg);
    drawText (document.getElementById('team').value, 745, 1128, 'formATextLarge', 'start', '', svg);
  }
  
  // Aresti and K block
  var figureNr = 0;
  var x = 5;
  var rows = 0;
  var g = document.createElementNS (svgNS, 'g');
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti && (rows < figures[i].aresti.length)) {
      rows = figures[i].aresti.length;
    }
  }
  var totalK = 0;
  var modifiedK = [];
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].aresti) {
      figureNr++;
      var figK = 0;
      drawText (
        'Fig ' + figureNr + ' ' + (figures[i].unknownFigureLetter || ''),
        x, 15, 'miniFormABold', 'start', '', g);
      drawText ('K', x + 70, 15, 'miniFormABold', 'end', '', g);
      var y = 27;
      for (var j = 0; j < figures[i].aresti.length; j++) {
        if (figures[i].aresti[j] in aresti_K) modifiedK.push (figureNr);
        drawText (figures[i].aresti[j], x, y, 'miniFormA', 'start', '', g);
        drawText (figures[i].k[j], x + 70, y, 'miniFormA', 'end', '', g);
        figK += parseInt(figures[i].k[j]);
        y += 12;
      }
      
      // Adjust figure K for additionals
      if (figures[i].unknownFigureLetter && (figures[i].unknownFigureLetter === 'L')) {
        if (additionals <= additionalFig.max) {
          figK = additionalFig.totalK / additionals;
        } else {
          if (additionalFig.max > 0) {
            figK = additionalFig.totalK / additionalFig.max;
          }
          checkAlert (sprintf (userText.maxAdditionals, additionalFig.max),
            false,
            figureNr);
        }
      }
      // adjust figure K for floating point
      if (figures[i].floatingPoint) figK -= 1;

      totalK += figK;
      if ((document.getElementById('printSF').checked === true) &&
	      (figures[i].superFamily)) {
				drawText('SF ' + figures[i].superFamily,
					x, 27 + rows * 12, 'miniFormABold', 'start', '', g);
      }
      if (figures[i].floatingPoint) figK = '(-1)' + figK;
      drawText (figK, x + 70, 27 + rows * 12, 'miniFormABold', 'end', '', g);
      x += 80;
    }
  }
  svg.appendChild (g);
  var bBox = g.getBBox();
  drawRectangle (0, 0, bBox.width + 10, bBox.height + 10, 'formLine', g);
  for (var i = 1; i < figureNr; i++) {
    drawLine (i * 80, 0, 0, bBox.height + 10, 'formLine', g);
  }
  // scale width to fit, but don't upscale more than 20%
  var scaleX = Math.min (799 / (bBox.width + 10), 1.2);
  var blockTop = 1100 - bBox.height;
  g.setAttribute ('transform', 'translate (0,' + blockTop + ') scale (' + scaleX + ',1)');

  // figureK and totalK
  drawText (totalK, 535, 41, 'formATextXL', 'middle', '', svg);
  if (document.getElementById('positioning').value) {
    totalK += parseInt (document.getElementById('positioning').value);
  }
  if (document.getElementById('harmony').value) {
    totalK += parseInt (document.getElementById('harmony').value);
  }
  drawText (totalK, 535, 90, 'formATextXL', 'middle', '', svg);

  var seqBottom = blockTop;

  // sequence string and check result
  if (document.getElementById('printString').checked) {
    seqBottom -= 42;
    addSequenceString (svg, {x:10, y:seqBottom, width:480, height:40}, print);
  }
  
  // add check result when checked
  if (document.getElementById('printCheck').checked) {
    bBox = addCheckResult (svg, {x:10, y:seqBottom - 6});
    seqBottom -= bBox.height;
  }
  
  // add warning for modified K when applicable
  if (modifiedK.length) {
    drawText (changedFigureKText (modifiedK, rulesActive),
      10, seqBottom - 8, 'modifiedK', 'start', '', svg);
    seqBottom -= 10;
  }
  
  // remove wind arrow
  var el = svg.getElementById('windArrow');
  if (el) el.parentNode.removeChild(el);

  // rebuild wind arrow in the correct place, and add form letter
  if (activeForm === 'R') {
    bBox = drawWind (450, 75, 0.6, svg);
    drawText ('R', 480, 105, 'formATextBoldHuge', 'middle', '', svg);
  } else {
    bBox = drawWind (45, 75, -0.6, svg);
    drawText ('L', 20, 105, 'formATextBoldHuge', 'middle', '', svg);
  }

  // scale and position sequence
  var maxScale = document.getElementById ('maxScaling').value / 100;
  var sequence = svg.getElementById('sequence');
  bBox = sequence.getBBox();
  scaleX = roundTwo (Math.min (480 / bBox.width, maxScale));
  var scaleY = roundTwo (Math.min ((seqBottom - 130) / bBox.height, maxScale));
  if (scaleX < scaleY) {
    // stretch height up to 5%
    scaleY = ((scaleX * 1.05) < scaleY) ? scaleX * 1.05 : scaleY;
    sequence.setAttribute('transform', 'translate(' + (-bBox.x * scaleX + 10) +
      ',' + (115 - (bBox.y * scaleY)) + ') scale(' + scaleX + ',' + scaleY + ')');
  } else {
    // stretch width up to 5%
    scaleX = ((scaleY * 1.05) < scaleX) ? scaleY * 1.05 : scaleX;
    sequence.setAttribute('transform', 'translate(' + (-bBox.x * scaleX + 260 - (bBox.width * scaleX) / 2) +
      ',' + (115 - (bBox.y * scaleY)) + ') scale(' + scaleX + ',' + scaleY + ')');
  }

  // when downscaling more than 10%, adjust roll font size and redraw
  if (scaleX < 0.9) {
    redrawSVG = adjustRollFontSize (scaleX);
    // remove wind arrow
    var el = redrawSVG.getElementById('windArrow');
    if (el) el.parentNode.removeChild(el);
    sequence.innerHTML = redrawSVG.getElementById ('sequence').innerHTML;
  }
  
  // penalty block
  blockTop -= 114;
  drawRectangle (510, blockTop, 290, 104, 'formLine', svg);
  drawRectangle (614, blockTop, 39, 104, 'formLineBold', svg);
  drawRectangle (759, blockTop, 39, 104, 'formLineBold', svg);
  drawLine (510, blockTop + 26, 290, 0, 'formLine', svg);
  drawLine (510, blockTop + 52, 290, 0, 'formLine', svg);
  drawLine (510, blockTop + 78, 290, 0, 'formLine', svg);
  
  drawText (userText.tooLow, 516, blockTop + 18, 'formAText', 'start', '', svg);
  drawText (userText.tooHigh, 516, blockTop + 44, 'formAText', 'start', '', svg);
  drawText (userText.interruptions, 516, blockTop + 70, 'formAText', 'start', '', svg);
  drawText (userText.insertions, 516, blockTop + 96, 'formAText', 'start', '', svg);
  drawText (userText.trgViolation, 661, blockTop + 18, 'formAText', 'start', '', svg);
  drawText (userText.wingRocks, 661, blockTop + 44, 'formAText', 'start', '', svg);
  drawText (userText.disqualified, 661, blockTop + 70, 'formAText', 'start', '', svg);
  drawText (userText.otherNote, 661, blockTop + 96, 'formAText', 'start', '', svg);
  
  // harmony and position
  blockTop -= 50
  
  if (document.getElementById('harmony').value) {
    drawRectangle (540, blockTop, 127, 40, 'formLine', svg);
    drawRectangle (540, blockTop, 60, 40, 'formLineBold', svg);
    drawCircle ({cx: 570, cy: blockTop + 27, r: 2, fill: 'black'}, svg);
    drawText (userText.harmony, 633, blockTop + 12, 'formATextSmall', 'middle', '', svg);
    drawText (document.getElementById('harmony').value,
      633, blockTop + 32, 'formATextLarge', 'middle', '', svg);
  }
    
  drawRectangle (673, blockTop, 127, 40, 'formLine', svg);
  drawRectangle (740, blockTop, 58, 40, 'formLineBold', svg);
  drawCircle ({cx: 769, cy: blockTop + 27, r: 2, fill: 'black'}, svg);
  drawText (userText.positioning, 706, blockTop + 12, 'formATextSmall', 'middle', '', svg);
  drawText (document.getElementById('positioning').value,
    706, blockTop + 32, 'formATextLarge', 'middle', '', svg);
  
  // figure grading block
  drawRectangle (510, 110, 288, blockTop - 120, 'formLine', svg);
  drawRectangle (540, 130, 258, blockTop - 140, 'formLineBold', svg);
  drawLine (540, 110, 0, 20, 'formLine', svg);
  drawLine (580, 110, 0, blockTop - 120, 'formLine', svg);
  drawLine (740, 110, 0, blockTop - 120, 'formLine', svg);
  
  drawText ('Fig', 525, 123, 'formATextSmall', 'middle', '', svg);
  drawText ('Pos', 560, 123, 'formATextSmall', 'middle', '', svg);
  drawText ('Remarks', 660, 123, 'formATextSmall', 'middle', '', svg);
  drawText ('Grade', 770, 123, 'formATextSmall', 'middle', '', svg);
  
  var y = 130;
  var dy = roundTwo ((blockTop - 140) / figureNr);
  for (var i = 1; i <= figureNr; i++) {
    drawLine (510, y, 290, 0, 'formLine', svg);
    drawText (i, 525, y + (dy / 2) + 5, 'formATextLarge', 'middle', '', svg);
    drawCircle ({cx: 769, cy: y + dy - 15, r: 2, fill: 'black'}, svg);
    y += dy;
  }
  
  // set correct viewbox and size for the form
  svg.setAttribute("viewBox", '0 0 800 1130');
  svg.setAttribute("width", '100%');
}

// buildHeader will append the sequence header
function buildHeader (svg, logoWidth) {
  if (!iacForms) {
    // CIVA Forms
    drawRectangle (logoWidth, 0, 720 - logoWidth, 65, 'formLine', svg);
    drawText (document.getElementById('location').value + ' ' +
      document.getElementById('date').value, 425, 33, 'formATextLarge', 'middle', '', svg);
    drawRectangle (720, 0, 80, 65, 'formLine', svg);
    drawText ('Form ' + activeForm, 760, 33, 'formATextLarge', 'middle', '', svg);
    drawRectangle (logoWidth, 65, 80, 65, 'formLine', svg);
    drawText (userText.pilotID, logoWidth + 5, 75, 'miniFormA', 'start', '', svg);
    drawText (document.getElementById('pilot_id').value, logoWidth + 40, 115, 'formATextHuge', 'middle', '', svg);
    drawRectangle (logoWidth + 80, 65, 640 - logoWidth, 65, 'formLine', svg);
    drawText (
      document.getElementById('rules').value + ' ' +
      ((document.getElementById('class').value === 'glider') ? 'Glider ' : '') +
      document.getElementById('category').value + ' ' +
      document.getElementById('program').value,
      475, 105, 'formATextLarge', 'middle', '', svg);
    drawRectangle (720, 65, 80, 65, 'formLine', svg);
    drawText (userText.flightNr, 725, 75, 'miniFormA', 'start', '', svg);
    drawText (document.getElementById('flight_nb').value, 760, 115, 'formATextHuge', 'middle', '', svg);
  } else {
    // IAC Forms
    if (activeForm === 'A') {
      drawRectangle (0, 0, 60, 130, 'formLine', svg);
      drawRectangle (60, 0, 740, 50, 'formLine', svg);
      drawRectangle (60, 50, 240, 80, 'formLine', svg);
      drawRectangle (300, 50, 100, 80, 'formLine', svg);
      drawRectangle (400, 50, 120, 80, 'formLine', svg);
      drawRectangle (520, 50, 120, 80, 'formLine', svg);
      drawRectangle (640, 50, 70, 80, 'formLine', svg);
      drawRectangle (710, 50, 90, 80, 'formLineBold', svg);
      drawText (activeForm, 30, 75, 'formATextBoldHuge', 'middle', '', svg);
      drawText ('INTERNATIONAL AEROBATIC CLUB SCORESHEET', 430, 35, 'formATextLarge', 'middle', '', svg);
      drawText (userText.contest + ':', 65, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('location').value, 180, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.date + ':', 305, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('date').value, 350, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.category + ':', 405, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('category').value, 460, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.programme + ':', 525, 70, 'formAText', 'start', '', svg);
      drawText (document.getElementById('program').value, 580, 100, 'formATextMedium', 'middle', '', svg);
      drawText (userText.pilotnumberIAC1, 645, 70, 'formAText', 'start', '', svg);
      drawText (userText.pilotnumberIAC2, 645, 95, 'formAText', 'start', '', svg);
    } else {
      // sequence info box
      drawRectangle (90, 10, 550, 100, 'formLine', svg);
      drawRectangle (570, 60, 70, 50, 'formLineBold', svg);
      drawLine (90, 60, 550, 0, 'formLine', svg); // ---
      drawLine (140, 10, 0, 50, 'formLine', svg); // |
      drawLine (490, 10, 0, 100, 'formLine', svg);// ||
      drawLine (290, 60, 0, 50, 'formLine', svg); // |
      drawText (activeForm, 115, 48, 'formATextBoldHuge', 'middle', '', svg);
      drawText (userText.contest + ':', 150, 25,
        'formAText', 'start', '', svg);
      drawText (document.getElementById('location').value, 315, 47,
        'formATextLarge', 'middle', '', svg);
      drawText (userText.category + ':', 500, 25,
        'formAText', 'start', '', svg);
      drawText (document.getElementById('category').value, 565, 47,
        'formATextLarge', 'middle', '', svg);
      drawText (userText.date + ':', 100, 75,
        'formAText', 'start', '', svg);
      drawText (document.getElementById('date').value, 190, 97,
        'formATextLarge', 'middle', '', svg);
      drawText (userText.program + ':', 300, 75,
        'formAText', 'start', '', svg);
      drawText (document.getElementById('program').value, 390, 97,
        'formATextLarge', 'middle', '', svg);
      drawText (userText.pilotNo, 530, 90,
        'formAText', 'middle', '', svg);
      
      // tear-off tab
      drawLine (640, 0, 160, 160, 'formLine', svg);
      drawLine (650, 0, 150, 150, 'dotted', svg);
      drawText (userText.pilot + ': ' +
        document.getElementById('pilot').value, 670, 10, 'formAText',
        'start', 'pilotText', svg);
      // rotate pilot text elements by 45 degr CW    
      var el = svg.getElementById('pilotText');
      el.setAttribute('transform', 'rotate(45 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
        
      // check line
      drawLine (800, 420, 0, 460, 'dotted', svg);
      drawText ('FREE PROGRAM CHECK BY:', 790, 1080, 'formAText',
        'start', 'checkByText', svg);
      drawText ('(signature/date)', 790, 880, 'formAText', 'start',
        'signText', svg);
      drawText ('A/C: ' + document.getElementById('actype').value,
        790, 380, 'formAText', 'start', 'acText', svg);
      // rotate text elements by 90 degr CCW    
      var el = svg.getElementById('checkByText');
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
      var el = svg.getElementById('signText');
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
      var el = svg.getElementById('acText');
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
    }
  }
}

// buildGridHeader appends a header to the Grid form
function addFormElementsGrid (svg) {
	svg.setAttribute("width", '100%');
	svg.setAttribute("height", '100%');
	svg.setAttribute("viewBox", '0 0 800 1130');

	if (document.getElementById ('formGridHeader').checked) {
		var children = svg.childNodes;
		for (var i = 0; i < children.length; i++) {
			children[i].setAttribute('transform', 'translate(0,140)');
		}
	
		var logoWidth = 0;
		if (logoImg) {
			var logoSvg = buildLogoSvg(logoImg, 0, 0, 200, 120);
			svg.appendChild(logoSvg);
			logoWidth = parseInt(logoSvg.getBBox().width) + 32;
		}
		drawText (document.getElementById('location').value + ' ' +
			document.getElementById('date').value, logoWidth, 24, 'formATextHuge', 'start', '', svg);
		// scale down if needed
		var scale = roundTwo ((800 - logoWidth) / svg.lastChild.getBBox().width);
		if (scale < 1) {
			svg.lastChild.setAttribute (
				'transform', 'scale(' + scale + ') translate(' + (logoWidth / scale - logoWidth) +
				',0)');
		}
		
		drawText (
			document.getElementById('rules').value + ' ' +
			((document.getElementById('class').value === 'glider') ? 'Glider ' : '') +
			document.getElementById('category').value + ' ' +
			document.getElementById('program').value,
			logoWidth, 60, 'formATextXL', 'start', '', svg);
	
		drawText (document.getElementById('notes').value, logoWidth, 96, 'formATextXL', 'start', '', svg);
	}
}
	
// buildScoreColumn will append the righthand scoring column
function buildScoreColumn (svg) {
  if (iacForms) {
    drawRectangle (580, 130, 120, 50, 'formLine', svg);
    drawText ('Item', 650, 155, 'formAText', 'middle', '', svg);
    drawRectangle (700, 130, 40, 50, 'formLine', svg);
    drawText ('K', 720, 155, 'formAText', 'middle', '', svg);
    drawRectangle (740, 130, 60, 50, 'formLine', svg);
    drawText ('Score', 770, 155, 'formAText', 'middle', '', svg);

    drawRectangle (580, 180, 120, 50, 'formLine', svg);    
    drawText ('Presentation', 590, 205, 'formATextBold', 'start', '', svg);
    drawRectangle (700, 180, 40, 50, 'formLine', svg);
    drawText (document.getElementById('positioning').value, 720, 205,
      'formATextLarge', 'middle', '', svg);
    drawRectangle (740, 180, 60, 50, 'formLineBold', svg);
    drawLine (740, 180, 0, 50, 'formLine', svg);
    
    drawText ('FIGURE TOTAL K =', 590, 270, 'formAText', 'start', '', svg);
    drawRectangle (740, 240, 60, 40, 'formLine', svg);
    drawText ('INC. PRESENTATION =', 590, 320, 'formAText', 'start', '', svg);
    drawRectangle (740, 290, 60, 40, 'formLine', svg);

    drawText (figureK, 770, 265, 'formATextLarge', 'middle', '', svg);
    var totalK = figureK;
    if (parseInt(document.getElementById('positioning').value)) {
      totalK += parseInt(document.getElementById('positioning').value);
    }
    
    drawText (totalK, 770, 315, 'formATextLarge', 'middle', '', svg);

    drawRectangle (590, 340, 210, 60, 'formLine', svg);
    drawText ('Aircraft type:', 600, 355, 'formAText', 'start', '', svg);
    drawText (document.getElementById('actype').value, 695, 380,
      'formATextLarge', 'middle', '', svg);
    
    // "checked by" block
    drawRectangle (640, 430, 160, 280, 'formLine', svg);
    drawLine (695, 430, 0, 280, 'formLine', svg);
    drawLine (750, 430, 0, 280, 'formLine', svg);
    drawLine (750, 610, 50, 0, 'formLine', svg);
    drawText ('FREE PROGRAM CHECKED BY:', 630, 700, 'formAText', 'start', 'checkedBy1', svg);
    drawText ('Signature:', 655, 700, 'formAText', 'start', 'checkedBy2', svg);
    drawText ('Printed Name:', 710, 700, 'formAText', 'start', 'checkedBy3', svg);
    drawText ('IAC No:', 765, 700, 'formAText', 'start', 'checkedBy4', svg);
    drawText ('Date:', 765, 600, 'formAText', 'start', 'checkedBy5', svg);
    // rotate all text elements by 90 degr CCW
    for (var i = 1; i < 6; i++) {
      var el = svg.getElementById('checkedBy' + i);
      el.setAttribute('transform', 'rotate(-90 ' +
        el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
    }
    
    // judge details
    var y= 740;
    drawRectangle (590, y, 210, 75, 'formLine', svg);
    drawLine (590, y+50, 210, 0, 'formLine', svg);
    drawText ('Judge', 595, y + 15, 'formAText', 'start', '', svg);
    drawText (
      'Name:',
      595,
      y + 15 + parseInt(style.formAText.match(/font-size[ ]*:[ ]*([0-9]+)px/)[1]),
      'formAText',
      'start',
      '',
      svg);
    drawText ('IAC #', 595, y + 67, 'formAText', 'start', '', svg);

    // assistant details
    var y= 830;
    drawRectangle (590, y, 210, 75, 'formLine', svg);
    drawLine (590, y+50, 210, 0, 'formLine', svg);
    drawText ('Assistant', 595, y + 15, 'formAText', 'start', '', svg);
    drawText (
      'Name:',
      595,
      y + 15 + parseInt(style.formAText.match(/font-size[ ]*:[ ]*([0-9]+)px/)[1]),
      'formAText',
      'start',
      '',
      svg);
    drawText ('IAC #', 595, y + 67, 'formAText', 'start', '', svg);


  } else {
    drawRectangle (620, 130, 60, 50, 'formLine', svg);
    drawText ('Item', 650, 155, 'formAText', 'middle', '', svg);
    drawRectangle (680, 130, 40, 50, 'formLine', svg);
    drawText ('K', 700, 155, 'formAText', 'middle', '', svg);
    drawRectangle (720, 130, 80, 50, 'formLine', svg);
    drawText ('Grade', 760, 155, 'formAText', 'middle', '', svg);
  
    // Positioning
    drawRectangle (620, 180, 60, 50, 'formLine', svg);
    drawText ('Pos.', 650, 205, 'formAText', 'middle', '', svg);
    drawRectangle (680, 180, 40, 50, 'formLine', svg);
    drawText (document.getElementById('positioning').value, 700, 205, 'formATextLarge', 'middle', '', svg);
    if (!document.getElementById('harmony').value) {
      drawRectangle (720, 180, 80, 50, 'formLineBold', svg);
    }
    drawLine (760, 180, 0, 50, 'formLine', svg);
  
    // Harmony
    if (document.getElementById('harmony').value) {
      drawRectangle (620, 230, 60, 50, 'formLine', svg);
      drawText ('Harm.', 650, 255, 'formAText', 'middle', '', svg);
      drawRectangle (680, 230, 40, 50, 'formLine', svg);
      drawText (document.getElementById('harmony').value, 700, 255, 'formATextLarge', 'middle', '', svg);
      drawRectangle (720, 180, 80, 100, 'formLineBold', svg);
      drawLine (760, 230, 0, 50, 'formLine', svg);
      drawLine (720, 230, 80, 0, 'formLine', svg);
    }
    
    drawRectangle (620, 280, 90, 25, 'formLine', svg);
    drawText ('Fig K', 665, 295, 'formAText', 'middle', '', svg);
    drawRectangle (710, 280, 90, 25, 'formLine', svg);
    drawText ('Total K', 755, 295, 'formAText', 'middle', '', svg);
    drawRectangle (620, 305, 90, 50, 'formLine', svg);
    drawText (figureK, 665, 330, 'formATextLarge', 'middle', '', svg);
    drawRectangle (710, 305, 90, 50, 'formLine', svg);
    var totalK = figureK;
    if (parseInt(document.getElementById('positioning').value)) {
      totalK += parseInt(document.getElementById('positioning').value);
    }
    if (parseInt(document.getElementById('harmony').value)) {
      totalK += parseInt(document.getElementById('harmony').value);
    }

    drawText (totalK, 755, 330, 'formATextLarge', 'middle', '', svg);
    drawRectangle (620, 355, 180, 25, 'formLine', svg);
    drawText ('Penalties', 710, 370, 'formATextBold', 'middle', '', svg);
    var penalties = new Array (
      'tooLow',
      'tooHigh',
      'interruptions',
      'insertions',
      'trgViolation',
      'wingRocks',
      'disqualified',
      'otherNote');
    var y = 380;
    drawRectangle (750, y, 50, penalties.length * 25, 'formLineBold', svg);
    for (var i = 0; i<penalties.length; i++) {
      drawRectangle (620, y, 180, 25, 'formLine', svg);
      drawText (userText[penalties[i]], 628, y + 18, 'formAText', 'start', '', svg);
      y += 25;
    }
  
    drawRectangle (620, y, 180, 25, 'formLine', svg);
    drawText ('Final Freestyle', 710, y + 15, 'formATextBold', 'middle', '', svg);
    drawRectangle (620, y+25, 80, 50, 'formLine', svg);
    drawText ('Duration', 660, y + 50, 'formAText', 'middle', '', svg);
    drawRectangle (700, y+25, 50, 50, 'formLine', svg);
    drawText ('Min', 725, y + 40, 'formAText', 'middle', '', svg);
    drawRectangle (750, y+25, 50, 50, 'formLine', svg);
    drawText ('Sec', 775, y + 40, 'formAText', 'middle', '', svg);
    drawRectangle (700, y+50, 100, 25, 'formLineBold', svg);
    
    // judge details
    drawRectangle (620, y+85, 180, 25, 'formLine', svg);
    drawText ('Judges Details', 710, y + 100, 'formATextBold', 'middle', '', svg);
    drawRectangle (620, y+110, 180, 160, 'formLineBold', svg);
    drawLine (620, y+170, 180, 0, 'formLine', svg);
    drawLine (620, y+220, 180, 0, 'formLine', svg);
    drawText ('Signature', 628, y + 128, 'formAText', 'start', '', svg);
    drawText ('Name', 628, y + 188, 'formAText', 'start', '', svg);
    drawText ('Number', 628, y + 238, 'formAText', 'start', '', svg);
  }
}

// buildCornertab will append the righthand corner cut-off tab
function buildCornertab (svg) {
  drawLine (620, 1130, 180, -180, 'formLine', svg);
  drawLine (680, 1120, 110, -110, 'dotted', svg);
  drawLine (730, 1120, 60, -60, 'dotted', svg);
  // Add pilot's name
  if (document.getElementById('pilot').value) {
    var newText = document.createElementNS (svgNS, "text");
    newText.setAttribute('style', style.formATextBold);
    newText.setAttribute('text-anchor', 'middle');
    newText.setAttribute('x', 730);        
    newText.setAttribute('y', 1060);
    newText.setAttribute('transform', 'rotate(-45 730 1060)');
    var textNode = document.createTextNode(document.getElementById('pilot').value);
    newText.appendChild(textNode);
    svg.appendChild (newText);
  }
  // Add pilot text
  var newText = document.createElementNS (svgNS, "text");
  newText.setAttribute('style', style.formAText);
  newText.setAttribute('text-anchor', 'middle');
  newText.setAttribute('x', 780);        
  newText.setAttribute('y', 1035);
  newText.setAttribute('transform', 'rotate(-45 780 1035)');
  var textNode = document.createTextNode(userText.pilot);
  newText.appendChild(textNode);
  svg.appendChild (newText);
  // Add aircraft info
  if (document.getElementById('aircraft').value) {
    var newText = document.createElementNS (svgNS, "text");
    newText.setAttribute('style', style.formATextBold);
    newText.setAttribute('text-anchor', 'middle');
    newText.setAttribute('x', 755);
    newText.setAttribute('y', 1085);
    newText.setAttribute('transform', 'rotate(-45 755 1085)');
    if (iacForms) {
      var textNode = document.createTextNode(document.getElementById('acreg').value);
    } else {
      var textNode = document.createTextNode(document.getElementById('aircraft').value);
    }
    newText.appendChild(textNode);
    svg.appendChild (newText);
  }
  // Add aircraft text
  var newText = document.createElementNS (svgNS, "text");
  newText.setAttribute('style', style.formAText);
  newText.setAttribute('text-anchor', 'middle');
  newText.setAttribute('x', 785);        
  newText.setAttribute('y', 1080);
  newText.setAttribute('transform', 'rotate(-45 785 1080)');
  var textNode = document.createTextNode(userText.ac);
  newText.appendChild(textNode);
  svg.appendChild (newText);
}

// activeFileName will return the current active file name, or create a
// default file name. The result is appended with 'append' when supplied
function activeFileName (append) {
  append = append || '';
  if (!fileName.innerText) {
    var fname = document.getElementById('location').value+' ';
    if (document.getElementById('class').value == 'glider') {
      fname += 'Glider ';
    }
    fname += document.getElementById('category').value+' '+
      document.getElementById('program').value+' '+
      document.getElementById('pilot').value;
    fname = fname.replace(/\s\s+/g, ' ');
    fname = fname.replace(/^\s+|\s+$/g, '');
    updateSaveFilename (fname);
  } else {
    fname = fileName.innerText;
  }
  fname += append;
  return fname;
}

// saveImageSizeAdjust will adjust the "Saving PNG or SVG" width or
// height, whichever is relevant
function saveImageSizeAdjust () {
  var pages = ['A', 'B', 'C', 'PilotCards', 'Grid', 'R', 'L'];
  var count = 0;
  for (var i = 0; i < pages.length; i++) {
    if (document.getElementById('printForm'+pages[i]).checked) {
      count++;
    }
  }
  // multiply this if doing printMulti
  if (fileList.length > 1) count = count * fileList.length;
  
  // don't do anything if no pages marked
  if (count === 0) return;
  // calculate ratio (Y / X) in base units
  var ratio = ((count * 1130) +
    ((count - 1) * document.getElementById ('pageSpacing').value)) / 800;

  if (this.id === 'imageHeight') {
    document.getElementById ('imageWidth').value = parseInt (
      this.value / ratio);
  } else {
    document.getElementById ('imageHeight').value = parseInt (
      document.getElementById ('imageWidth').value * ratio);
  }
}
    
// saveSVG will save an SVG image as selected in print/save dialog
function saveSVG () {
  // put the svg in var data
  var data = buildForms();
  saveFile(
    data,
    activeFileName(),
    '.svg',
    {'name':'SVG file', 'filter':'*.svg'},
    'image/svg+xml;utf8');
  draw();
}

// savePNG will save a PNG image as selected in print/save dialog
function savePNG () {
  // put the svg in var data
  var data = buildForms();
  infoBox (userText.convertingToPng, userText.convertingTitle);
  // use setTimeout to prevent browser hang-up and warning, and to give
  // it time to rebuild the sequence first
  setTimeout(function(){
    // wrap conversion in try, in case it fails
    try {
      svgToPng (data, function(canvas){
        steg.encode (activeSequence.xml, canvas).toBlob(function(blob){
        
        saveFile(
          blob,
          activeFileName(),
          '.png',
          {'name':'PNG file', 'filter':'*.png'},
          'image/png');
        infoBox ();
      });
    });
    } catch (err) {
      console.log(err.stack);
      infoBox ();
      alertBox (
        sprintf(userText.convertingFailed, encodeURI(browserString + '\n' + err.stack)),
        userText.convertingTitle);
      return;
    }
  }, 500);
  draw();
}

// saveFigs will save all the figures in the sequence separately in a
// single zip file
function saveFigs () {
  var fname = activeFileName(' Form '+activeForm);
  // save selectedFigure.id
  var id = selectedFigure.id;
  // create new zip object
  var zip = new JSZip();
  // get image filename pattern
  var fPattern = document.getElementById('zipImageFilenamePattern').value;
  // get image width and height
  var width = document.getElementById('saveFigsSeparateWidth').value.replace(/[^0-9]/g, '') + 'px';
  var height = document.getElementById('saveFigsSeparateHeight').value.replace(/[^0-9]/g, '') + 'px';
  // go through the active form and get each figure from the edit figure
  // box
  for (var i = 0; i < figures.length; i++) {
    if (figures[i].figNr) {
      selectedFigure.id = i;
      displaySelectedFigure();
      var svg = document.getElementById('selectedFigureSvg');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      // convert svg object to string
      svg = new XMLSerializer().serializeToString(document.getElementById('selectedFigureSvg'));
      // create correct image filename
      var fName = fPattern;
      fName = fName.replace (/%pilot/g, document.getElementById('pilot').value);
      fName = fName.replace (/%aircraft/g, document.getElementById('aircraft').value);
      fName = fName.replace (/%location/g, document.getElementById('location').value);
      fName = fName.replace (/%date/g, document.getElementById('date').value);
      fName = fName.replace (/%class/g, document.getElementById('class').value);
      fName = fName.replace (/%rules/g, document.getElementById('rules').value);
      fName = fName.replace (/%category/g, document.getElementById('category').value);
      fName = fName.replace (/%program/g, document.getElementById('program').value);
      fName = fName.replace (/%form/g, activeForm);
      fName = fName.replace (/%figure/g, figures[i].seqNr);
      if (document.getElementById('imageFormatPNG').checked) {
        // rasterize canvas to png data URL (without data URL info) and
        // put in ZIP file
        zip.file (
          fName.trim() + '.png',
          svgToPng (svg).toDataURL().replace(/^data:[^,]*,/, ''),
          {base64: true}
        );
      } else {
        // convert svg to standalone
        svg = '<?xml version="1.0" standalone="no"?>\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.2//EN" ' +
        '"http://www.w3.org/Graphics/SVG/1.2/DTD/svg12.dtd">\n' + svg;
        zip.file(fName.trim() + '.svg', svg);
      }
    }
  }
  
  var data = zip.generate({type: 'blob'});

  saveFile(
    data,
    fname,
    '.zip',
    {'name':'ZIP file', 'filter':'*.zip'},
    'application/zip'
  );
  selectedFigure.id = id;
  displaySelectedFigure();
}  

// svgToPng will convert an svg to a png image
// The png will be returned as canvas
// If provided, function f will be executed when the canvas has loaded.
// Otherwise, the function will return with the data.
// Use the callback (with function f) when the SVG may include external
// or data: images to make sure these are loaded before toDataURL
function svgToPng (svg, f) {
  // remove anything before <svg tag
  svg = svg.replace (/^.*?<svg/, '<svg');
  // convert svg to canvas
  var canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  document.lastChild.appendChild (canvas);
  canvg (canvas, svg);
  if (f) {
    setTimeout(function(){
      // Wait 500ms for canvas to render, then...
      document.lastChild.removeChild (canvas);
      f(canvas);
    }, 500);
  } else {
    // return canvas
    document.lastChild.removeChild (canvas);
    return canvas;
  }
}

// savePDF will save Forms A,B and C as a single PDF
// NOT functional yet!
function savePDF () {
}

// inArray returns all the array keys in 'arr' that hold 'val' as an array
// Only works for numbered arrays!
function inArray(arr, val) {
  var result = [];
  var i = arr.indexOf (val);
  while (i >= 0) {
    result.push(i);
    i = arr.indexOf (val, i + 1);
  }
  if (result.length > 0) return result; else return false;
}

// buildIllegal builds the symbol for an illegal figure
function buildIllegal (i) {
// create space before the figure
  var paths = [];
  paths = buildShape ('FigSpace' , 2, paths);
  var angle = dirAttToAngle (Direction, Attitude);
  var dx = Math.cos(angle) * lineElement * 6;
  var dy = - Math.sin(angle) * lineElement * 6;
  paths.push({'path':'l ' + dx + ',' + (dy - lineElement * 6) + ' m ' +
    -dx + ',' + -dy + ' l ' + dx + ',' + (dy + lineElement * 6), 'style':'illegalCross'});
  paths.push({'path':'l ' + dx + ',' + dy + ' l 0,' + (-lineElement * 6) +
    ' l ' + -dx + ',' + -dy + ' z', 'style':'illegalBox', 'dx':dx, 'dy':dy});
  // Create empty space after illegal figure symbol
  paths = buildShape ('FigSpace', 2, paths);
  figures[i].paths = paths;
  figures[i].unknownFigureLetter = unknownFigureLetter;
}

// buildMoveTo builds the symbol for a moveto and moves the cursor
// scaling should not affect movement, so divide by scale
function buildMoveTo (dxdy, i) {
  var paths = [];
  if (/^[CL]$/.test(activeForm)) dxdy[0] = -dxdy[0];
  paths.push({'path':'l ' + roundTwo(dxdy[0] * (lineElement / scale)) +
    ',' + roundTwo(dxdy[1] * (lineElement / scale)),
    'style':'dotted',
    'dx':dxdy[0] * (lineElement / scale),
    'dy':dxdy[1] * (lineElement / scale)});
// Create space after the figure
  figures[i].paths = buildShape ('FigSpace' , 2, paths);
  figures[i].moveTo = dxdy;
}

// buildCurveTo builds the symbol for a curveto and moves the cursor
// scaling should not affect movement, so divide by scale
function buildCurveTo (dxdy, i) {
  var paths = [];
  if (/^[CL]$/.test(activeForm)) dxdy[0] = -dxdy[0];
  var angle = dirAttToAngle (Direction, Attitude);
  var dist = Math.sqrt(dxdy[0]*dxdy[0] + dxdy[1]*dxdy[1]);
  var dx = Math.cos(angle) * (lineElement / scale) * dist / 2;
  var dy = - Math.sin(angle) * (lineElement / scale) * dist / 2;
 
  paths.push({'path':'c ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ' +
    roundTwo(dxdy[0] * (lineElement / scale) - dx) + ',' +
    roundTwo(dxdy[1] * (lineElement / scale) - dy) + ' ' +
    roundTwo(dxdy[0] * (lineElement / scale)) + ',' +
    roundTwo(dxdy[1] * (lineElement / scale)),
    'style':'dotted',
    'dx':(dxdy[0] * (lineElement / scale)),
    'dy':(dxdy[1] * (lineElement / scale))});
// Create space after the figure
  figures[i].paths = buildShape ('FigSpace' , 2, paths);
  figures[i].curveTo = dxdy;
}

// buildMoveForward moves the cursor forward
function buildMoveForward (extent, i) {
  if (extent > 0) {
    figures[i].paths = buildShape ('FigSpace' , extent);
    figures[i].moveForward = extent;
  }
}

// buildMoveDown moves the cursor downward
function buildMoveDown (extent, i) {
  if (extent > 0) {
    figures[i].paths = buildShape ('VertSpace' , extent);
    figures[i].moveDown = extent;
  }
}

// buildFigure parses a complete figure as defined by the figNrs and
// figString and puts it in array figures. It also creates a figCheckLine
// for each figure that can be used for sequence validity checking
// figNrs         = Possible figures that matched pattern
// figString      = User defined string for figure
// seqNr          = Sequence figure number
// figStringIndex = index of figure (figures[figStringIndex])
// figure_chooser = Optional argument, true if we are building the
//                  figure for the figure chooser
function buildFigure (figNrs, figString, seqNr, figStringIndex, figure_chooser) {
  var figNr = figNrs[0];
  var roll = [];
  var rollSums = [];
  var rollPatterns = [];
  var rollInfo = [];
  // lowKFlick is set when the K for flick should be low:
  // vertical down after hammerhead, tailslide or after roll element
  var lowKFlick = false;
  // entryAxis identifies the axis on which the figure starts
  var entryAxis = ((Direction == 0) || (Direction == 180)) ? 'X' : 'Y';
  var entryAtt = Attitude;
  var entryDir = Direction;
  // goFront is set to true for every new figure that starts to front
  if (((Direction == 90) && (Attitude == 0)) || ((Direction == 270) && (Attitude == 180))) {
    goFront = false;
  } else {
    goFront = true;
  }
  // In the first part we handle everything except (rolling) turns
  var bareFigBase = fig[figNr].base.replace(/[\+\-]+/g, '');

  if (!regexTurn.test(fig[figNr].base)) {
    // First we split the figstring in it's elements, the bareFigBase
    // is empty for rolls on horizontal.
    if (bareFigBase != '') {
      // prevent splitting on bareFigBase inside comments
      if (figString.match(/"/)) {
        var inComment = false;
        var l = bareFigBase.length;
        for (var i = 0; i <= (figString.length - l); i++) {
          if (!inComment && (figString.substring(i, i + l) === bareFigBase)) {
            var splitLR = [
              figString.substring(0, i),
              figString.substring(i + l)
            ];
            break;
          } else if (figString[i] === '"') {
            inComment = !inComment;
          }
        }
      } else {
        var splitLR = figString.split(bareFigBase);
      }
    } else {
      var splitLR = Array(figString);
    }
    // start with an empty set of rolls
    for (var i = 0; i < fig[figNr].rolls.length; i++) {
      rollPatterns[i] = '';
    }
    // Find the roll patterns
    regEx = /[\+<\~\^\>]+/g;
    rollPatterns[0] = splitLR[0].replace(regEx, '');
    if (splitLR.length > 1) {
      moreRolls = splitLR[1].replace(regEx, '').split(')');
      for (var i = 0; i < moreRolls.length; i++) {
        if (moreRolls[i].match(/\(/)) {
          rollPatterns[i + 1] = moreRolls[i].replace(/\(/g, '');
        } else {
          rollPatterns[fig[figNr].rolls.length - 1] = moreRolls[i];
        }
      }
    }
    
    // Parse the roll patterns and find out where to put rolls, snaps,
    // spins and tumbles
    // We need to do this before building the figure because it can
    // affect our choice of figure
    for (var i = 0; i < rollPatterns.length; i++) {
      roll[i] = [];
      rollInfo[i] = {
        'gap':[0],
        'pattern':[],
        'flip':[],
        'flipNumber':[],
        'comment':[]
      };
      var rollPattern = rollPatterns[i];
      rollSums[i] = 0;
      rollSign = (/^[CL]$/.test(activeForm)) ? -1 : 1;
      extent = 0;
      var subRoll = 0;
      var flipRoll = false;
      var flipNumber = false;
      var inComment = false;
      var comment = '';
      if (rollPattern != '') {
        for (j = 0; j < rollPattern.length; j++) {
          // check if we are not in a roll comment section
          if (!inComment) {
            var char = rollPattern.charAt(j);
            switch (char) {
              case (userpat.comment):
                // start of comment
                inComment = true;
                break;
              case (userpat.rollext):
                // Long line before or after roll, twice the length of
                // the same pattern in figures.js
                roll[i].push({'type':'line', 'extent':3, 'load':NegLoad});
                rollInfo[i].gap[subRoll] += 3;
                break;
              case (userpat.rollextshort):
                // Short line before or after roll, twice the length of
                // the same pattern in figures.js
                roll[i].push({'type':'line', 'extent':1, 'load':NegLoad});
                rollInfo[i].gap[subRoll]++;
                break;
              case (userpat.lineshorten):
                // Make line before or after roll shorter
                roll[i].push({'type':'line', 'extent':-1, 'load':NegLoad});
                rollInfo[i].gap[subRoll]--;
                break;
              case (userpat.opproll):
                // Switch roll direction
                rollSign = -rollSign;
                flipRoll = !flipRoll;
                break;
              case 'f':
              case 's':
              case 'e':
              case 'u':
              case 'l':
                // Add single snaps, spins and tumbles
                // When there was a roll before, add a line first
                var type = {
                  'f': 'possnap',
                  's': 'posspin',
                  'e': 'posShoulderRoll',
                  'u': 'posRuade',
                  'l': 'posLomcevak'}[char];
                if (extent > 0) {
                  roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
                }
                roll[i].push({
                  'type': type,
                  'extent':rollSign * 360,
                  'pattern':'1' + char,
                  'flip':flipRoll,
                  'flipNumber':flipNumber,
                  'comment':comment});
                extent = 360;
                rollInfo[i].pattern[subRoll] = char;
                rollInfo[i].flip[subRoll] = flipRoll;
                rollInfo[i].flipNumber[subRoll] = flipNumber;
                rollInfo[i].comment[subRoll] = comment;
                flipNumber = false;
                comment = '';
                subRoll++;
                rollInfo[i].gap[subRoll] = 0;
                break;
              case 'i':
                // Add single inverted snaps, spins and tumbles
                // When there was a roll before, add a line first
                var type = {
                  'f': 'negsnap',
                  's': 'negspin',
                  'e': 'negShoulderRoll',
                  'u': 'negRuade',
                  'l': 'negLomcevak'}[rollPattern.charAt(j + 1)];
                if (type) {
                  if (extent > 0) {
                    roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
                  }
                  j++;
                  roll[i].push({
                    'type': type,
                    'extent':rollSign * 360,
                    'pattern':'1i' + rollPattern.charAt(j),
                    'flip':flipRoll,
                    'flipNumber':flipNumber,
                    'comment':comment});
                  rollInfo[i].pattern[subRoll] = 'i' + rollPattern.charAt(j);
                  extent = 360;
                  rollInfo[i].flip[subRoll] = flipRoll;
                  rollInfo[i].flipNumber[subRoll] = flipNumber;
                  rollInfo[i].comment[subRoll] = comment;
                  flipNumber = false;
                  comment = '';
                  subRoll++;
                  rollInfo[i].gap[subRoll] = 0;
                }
                break;
              // Handle all different kinds of rolls and their notation
              default:
                if (parseInt(rollPattern[j])) {
                  var startJ = j;
                  stops = 0;
                  // When there was a roll before, add a line first
                  if (extent > 0) {
                    var regex = /[fs]/;
                    if (regex.test(rollPattern)) {                 
                      roll[i].push({'type':'line', 'extent':2, 'load':NegLoad})
                    } else {
                      roll[i].push({'type':'line', 'extent':1, 'load':NegLoad})
                    }
                  }
  
                  if (rollPattern[j] == '9') {
                    extent = 720;
                    // 9 is a double roll. But for non-Aresti it can be
                    // followed by more numbers to indicate more roll.
                    // This can not be used for hesitations
                    // e.g. 96 is 3 1/2 roll
                    if (document.getElementById('nonArestiRolls').checked) {
                      while (rollPattern.charAt(j + 1).match (/[12345679]/)) {
                        j++;
                        extent += parseInt({1: 360, 2: 180, 3: 270,
                          4: 90, 5: 450, 6: 540, 7: 630,
                          9: 720}[rollPattern[j]]);
                      }
                    }
                  } else if (rollPattern.charAt(j + 1).match(/[0-8]/)) { // use charAt to prevent end-of-string error
                    // special case: more than 8x8 roll
                    if (rollPattern.charAt(j + 2).match(/[1-9]/)) { // use charAt to prevent end-of-string error
                      stops = parseInt(rollPattern[j + 2]);
                      extent = parseInt(rollPattern.substring(j, j+2)) * (360 / stops);
                      j++;
                    } else {
                      if (rollPattern[j + 1] != '0') {
                        stops = parseInt(rollPattern[j + 1]);
                        extent = parseInt(rollPattern[j]) * (360 / stops);
                      }
                    }
                    j++;
                  } else if (rollPattern[j] == '1') {
                    extent = 360;
                  } else if (rollPattern[j] == '4') {
                    extent = 90;
                  } else if (rollPattern[j] == '8') {
                    stops = 8;
                    extent = 90;
                  } else {
                    extent = 90 * parseInt(rollPattern[j]);
                  }
                  var illegalSnapSpin = false;
                  switch (rollPattern.charAt(j + 1)) {
                    case 'i':
                      var type = {
                        'f': 'negsnap',
                        's': 'negspin',
                        'e': 'negShoulderRoll',
                        'u': 'negRuade',
                        'l': 'negLomcevak'}[rollPattern.charAt(j + 2)];
                      if (type) {
                        j += 2;
                        if (!stops) {
                          roll[i].push({
                            'type': type,
                            'extent':rollSign * extent,
                            'pattern':rollPattern.substring(startJ, j + 1),
                            'flip':flipRoll,
                            'flipNumber':flipNumber,
                            'comment':comment});
                        } else {
                          illegalSnapSpin = rollPattern.substring(j - 1, j + 1);
                        }
                      }
                      break;
                    case 'f':
                    case 's':
                    case 'e':
                    case 'u':
                    case 'l':
                      var type = {
                        'f': 'possnap',
                        's': 'posspin',
                        'e': 'posShoulderRoll',
                        'u': 'posRuade',
                        'l': 'posLomcevak'}[rollPattern.charAt(j + 1)];
                      j++;
                      if (!stops) {
                        roll[i].push({
                          'type': type,
                          'extent':rollSign * extent,
                          'pattern':rollPattern.substring(startJ, j + 1),
                          'flip':flipRoll, 
                          'flipNumber':flipNumber,
                          'comment':comment});
                      } else {
                        illegalSnapSpin = rollPattern.substring(j, j + 1);
                      }
                      break;
                    default:
                      roll[i].push({
                        'type':'roll',
                        'extent':rollSign * extent,
                        'stops':stops,
                        'pattern':rollPattern.substring(startJ, j + 1),
                        'flip':flipRoll,
                        'flipNumber':flipNumber,
                        'comment':comment});
                  }
                  if (illegalSnapSpin) {
                    alertMsgs.push ('(' + seqNr + ') ' +
                      rollPattern.substring(startJ, j + 1) +
                      userText.illegalFig +
                      rollPattern.substring(startJ, startJ + 1) +
                      illegalSnapSpin);
                    extent = 0;
                  }
                  rollSums[i] += rollSign * extent;
                  if (extent != 0) {
                    rollInfo[i].pattern[subRoll] = rollPattern.substring(startJ, j + 1);
                    rollInfo[i].flip[subRoll] = flipRoll;
                    rollInfo[i].flipNumber[subRoll] = flipNumber;
                    rollInfo[i].comment[subRoll] = comment;
                    subRoll++;
                    rollInfo[i].gap[subRoll] = 0;
                  }
                  flipNumber = false;
                  comment = '';
                } else if (rollPattern[j] === '0') {
                  // Glider Super Slow roll
                  var startJ = j;
                  // When there was a roll before, add a line first
                  if (extent > 0) {
                    roll[i].push({'type':'line', 'extent':2, 'load':NegLoad});
                    extent = 0;
                  }
                  j++;
                  switch (rollPattern[j]) {
                    case '2':
                      extent = 180;
                      break;
                    case '1':
                      extent = 360;
                      break;
                    case '6':
                      extent = 540;
                      break;
                  }
                  rollSums[i] += rollSign * extent;
                  if (extent != 0) {
                    rollInfo[i].pattern[subRoll] = rollPattern.substring(startJ, j+1);
                    rollInfo[i].flip[subRoll] = flipRoll;
                    rollInfo[i].flipNumber[subRoll] = flipNumber;
                    rollInfo[i].comment[subRoll] = comment;
                    subRoll++;
                    rollInfo[i].gap[subRoll] = 0;
                    roll[i].push({
                      'type':'slowroll',
                      'extent':rollSign * extent,
                      'stops':0,
                      'pattern':rollPattern.substring(startJ, j+1),
                      'flip':flipRoll,
                      'flipNumber':flipNumber,
                      'comment':comment});
                  }
                  flipNumber = false;
                  comment = '';
                }
            }
          } else {
            // in comment, end it or add character to comment
            if (rollPattern[j] === userpat.comment) {
              inComment = false;
            } else {
              // flip roll number if pattern present at comment start
              if ((comment === '') && (rollPattern[j] === userpat.flipNumber)) {
                flipNumber = true;
              }
              comment += rollPattern[j];
            }
          }
        }
      }
    }
    // Set the number of the first roll for drawing later on
    // To do this we check the fig.pattern for a roll match before the base
    var rollnr = regexRollBeforeBase.test (fig[figNr].pattern) ? 0 : 1;

    // If there are multiple figNrs we check the rolls to see which one
    // matches best. It's very important that with different figures with
    // the same figure base the roll total is equal in the figures.js file
    if (figNrs.length > 1) {
      // Set rollCorrMin to infinity to start with so the
      // first correction will allways be smaller
      var rollCorrMin = Infinity;
      for (var i = 0; i < figNrs.length; i++) {
        var rollCorr = 0;
        for (var j = 0; j < roll.length; j++) {
          if (fig[figNrs[i]].rolls[j] == 2) {
            // half roll symbol at this position in fig[xx].rolls[yy]
            rollCorr += Math.abs((rollSums[j] + 180) % 360);
          } else if (/[^34]/.test (fig[figNrs[i]].rolls[j])) {
            // full or no roll symbol at this position in fig[xx].rolls[yy]
            // 'no roll' can be no roll line at all (rolls[j] undefined)
            // or only line without roll allowed as in some P-loops
            // (rolls[j] = 9)
            rollCorr += Math.abs(rollSums[j] % 360);
          }
        }
        if (rollCorr < rollCorrMin) {
          rollCorrMin = rollCorr;
          figNr = figNrs[i];
          var rollnr = regexRollBeforeBase.test (fig[figNr].pattern) ? 0 : 1;
        }
      }
      var figureDraw = fig[figNr].draw;
    } else var figureDraw = fig[figNrs[0]].draw;
  } else var figureDraw = fig[figNrs[0]].draw;
  // The chosen figure is now final, so we can:
  // * assign Aresti Nr and K Factor to the figure
  // * fix the figNr in the figures object
  // * remove rolls where only line shortening/lengthening is allowed
  var arestiNrs = new Array(fig[figNr].aresti);
  if ((sportingClass.value === 'glider') && fig[figNr].kglider) {
    var kFactors = [parseInt(fig[figNr].kglider)];
  } else {
    var kFactors = [parseInt(fig[figNr].kpwrd)];
  }
  figures[figStringIndex].figNr = figNr;
  figCheckLine[seqNr] = fig[figNr].aresti;
  
  // consolidate gaps for lines without rolls
  for (var i = 0; i < roll.length; i++) {
    if (fig[figNr].rolls[i] === 9) {
      for (var j = 0; j < roll[i].length; j++) {
        if (roll[i][j].type !== 'line') {
          roll[i].splice (j, 1);
          j--;
        }
      }
      rollSums[i] = 0;
      var gap = 0;
      for (var j = 0; j in rollInfo[i].gap; j++) gap += parseInt(rollInfo[i].gap[j]);
      rollInfo[i] = {gap: [gap], pattern: [], comment: []};
    }
  }
  // If we are not in Form A we check for entry and exit extension
  // and shortening and apply them
  var entryExt = 0;
  var exitExt = 0;
  if (activeForm != 'A') {
    // get position for the base (1) OR the roll(s) on a horizontal (2)
    if (bareFigBase != '') {
      var basePos = figString.indexOf(bareFigBase);
    } else {
      stringLoop:
      for (var i = 0; i < figString.length; i++) {
        switch (figString[i]) {
          case userpat.forward:
          case userpat.forwardshorten:
          case '-':
            break;
          default:
            basePos = i;
            break stringLoop;
        }
      }
    }
    for (var i = 0; i < figString.length; i++) {
      if (figString.charAt(i) == userpat.forward) {
        if (i < basePos) {
          figureDraw = figpat.forward + figureDraw;
          entryExt++;
        } else {
          figureDraw += figpat.forward;
          exitExt++;
        }
      } else if (figString.charAt(i) == userpat.forwardshorten) {
        if (i < basePos) {
          figureDraw = userpat.forwardshorten + figureDraw;
          entryExt--;
        } else {
          figureDraw += userpat.forwardshorten;
          exitExt--;
        }
      }
    }
  }

  // Now we go through the drawing instructions
  var
	  lineLength = 0,
	  lineSum = 0,
	  lineDraw = false,
	  rollTop = false,
	  afterRoll = false,
	  comment = false,
	  hiddenCurvePaths = [],
	  smallCurve = 0,
	  // Build the start of figure symbol
	  paths = buildShape('FigStart',
	    {
	      'seqNr':seqNr,
	      'first':firstFigure
	    },
	    paths),
	  entryLine = true;
  
  // add any paths that were already provided
  // (e.g. for autocorrect red circle)
  if (figures[figStringIndex].paths) {
    for (var i = 0; i < figures[figStringIndex].paths.length; i++) {
      paths.push (figures[figStringIndex].paths[i]);
    }
  }

  for (var i = 0; i < figureDraw.length; i++) {
    // set correct load
    if ((figureDraw[i] == figpat.longforward) || (figureDraw[i] == figpat.forward)) {
      if ((Attitude != 90) && (Attitude != 270)) {
        NegLoad = ((Attitude > 90) && (Attitude < 270)) ? 1 : 0;
      }
    }
    // Sum continuous lines in the figure
    switch (figureDraw.charAt(i)) {
      // Make long lines
      case (figpat.longforward):
        lineSum += 4;
        lineDraw = true;
        break;
      case (userpat.rollext):
        lineSum += 3;
        lineDraw = true;
        break;
      // Make short lines
      case (figpat.forward):
      case (userpat.rollextshort):
        lineSum++;
        lineDraw = true;
        break;
      // shorten entry and exit lines
      case (userpat.forwardshorten):
        lineSum--;
        break;
      // When a roll is encountered, continue there for line
      // lengthening and/or shortening
      case (figpat.fullroll):
        afterRoll = true;
        break;
      // just skip any negative entry/exit
      case ('-'):
        break;
      // When something else than a roll or line is encountered, build
      // the line. Do not make any existing line shorter than 1
      default:
        if (lineDraw || afterRoll) {
          if (lineDraw) {
            lineSum = Math.max (lineSum, 1);
            var params = [lineSum];
            lineLength += lineSum;
          } else var params =[0.02];
          if (afterRoll) {
            params.push ('roll' + (rollnr - 1) + '-gap' + gapnr);
            roll[rollnr - 1].lineLengthAfter = lineSum; 
          }
          if (entryLine) {
            params.push ('entry');
            figures[figStringIndex].entryLength = lineSum;
            entryLine = false;
          }
          
          paths = buildShape ('Line', params, paths);
          lineDraw = false;
        }
        lineSum = 0;
        afterRoll = false;
    }
    // Take care of everything but lines
    switch (figureDraw.charAt(i)) {
      // Make hammerheads
      case (figpat.hammer):
      case (figpat.pushhammer):
        paths = buildShape('Hammer', lineLength, paths);
        // down line after hammer always positive
        NegLoad = false;
        lowKFlick = true;
        break;
      // Make tailslides
      case (figpat.tailslidecanopy):
      case (figpat.tailslidewheels):
        paths = buildShape('Tailslide', figureDraw.charAt(i), paths);
        lowKFlick = true;
        break;
      case (figpat.pointTip):
      case (figpat.pushPointTip):
        paths = buildShape('PointTip', lineLength, paths);
        break;
      // Make rolls, including any line lenghthening and/or shortening
      case (figpat.fullroll):
        // Make a space on the figCheckLine before every possible roll
        figCheckLine[seqNr] = figCheckLine[seqNr] + ' ';
        // mark rolls in the top
        if (rollTop) rollInfo[rollnr].rollTop = true;
        if (roll[rollnr]) {
          var rollPaths = [];
          rollSum = 0;
          rollDone = false;
          attChanged = 0;
          var gapnr = 0;
          for (j = 0; j < roll[rollnr].length; j++) {
            // Build line elements after all extensions and shortenings have been processed
            if (roll[rollnr][j].type != 'line') {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', [1.2/scale], rollPaths);
                } else {
                  lineSum = Math.max (lineSum, 1);
                  lineLength += lineSum;
                  // add roll paths with id for handle
                  rollPaths = buildShape(
                    'Line',
                    [lineSum, 'roll' + rollnr + "-gap" + gapnr],
                    rollPaths
                  );
                  gapnr++;

                  roll[rollnr][j].lineLength = lineSum;
                }
                lineDraw = false;
              } else if (!rollTop) {
                // add roll paths tiny line with id for handle, except
                // for rolls in the top
                rollPaths = buildShape(
                  'Line',
                  [0.02, 'roll' + rollnr + "-gap" + j],
                  rollPaths
                );
                roll[rollnr][j].lineLength = 0.02;
              }
                
              lineSum = 0;
            } 

            /***** handle rolls and lines *****/
            
            // Find which roll in figures.js matches. There should only
            // be one. Then add Aresti nr and K factor
            var rollAtt = rollAttitudes[Attitude];
            // Find the correct snap/load combination
            // Snaps started knife edge are judged as
            // 'pos from neg'/'neg from pos' with foot-down entry
            if ((roll[rollnr][j].type == 'possnap') || (roll[rollnr][j].type == 'negsnap')) {
              if (((Attitude == 90) || (Attitude == 270)) && lowKFlick) {
                // Handle snaps on verticals where lowKFlick is set
                rollAtt = (roll[rollnr][j].type == 'possnap') ? '+' + rollAtt : '-' + rollAtt;
              } else if (((rollSum % 180) == 0) || (Attitude == 90) || (Attitude == 270)) {
                // Handle snaps on verticals and from non-knife-edge
                rollAtt = (NegLoad == 0) ? '+' + rollAtt : '-' + rollAtt;
              } else {                
                // Handle snaps from knife edge. Use rollSum to find the
                // previous amount of roll. Use switches to determine
                // correct virtual load/attitude combination
                var inv = ((Attitude > 90) && (Attitude < 270));
                inv = (inv == (((Math.abs(rollSum) - 90) % 360) == 0));
                inv = (inv == ((rollSum * roll[rollnr][j].extent) > 0));
                // 1) Foot up for pos start, foot down for neg start
                // 2) Foot down for pos start, foot up for neg start
                rollAtt = inv ? '+' + rollAtt : '-' + rollAtt;
              }
            }
            // set lowKFlick to true after anything but a line
            if (roll[rollnr][j].type !== 'line') lowKFlick = true;

            if (!document.getElementById('nonArestiRolls').checked) {
              // Check if spin is allowed on this roll position
              if (roll[rollnr][j].type.match(/^(pos|neg)spin$/) &&
                (fig[figNr].rolls[rollnr] != 4)) {
								checkAlert (
									userText.alert.spinsStartHorizontal,
									false,
									seqNr,
									(sportingClass.value === 'glider') ?
										'Sporting Code Section 6 Part II, B.9.27.2' :
										'Sporting Code Section 6 Part I, B.9.29.1'
								);
              } else {
	              // Check if posspin and negspin are on correctly loaded line
	              // Crossover spins will create alert when nonArestiRolls is
	              // not checked (Aresti Catalogue item 26)
	              if (((roll[rollnr][j].type == 'posspin') && !NegLoad) ||
	                ((roll[rollnr][j].type == 'negspin') && NegLoad)) {
	                checkAlert (userText.alert.noCrossoverSpin,
		                false,
		                seqNr,
		                'Aresti Catalogue item 26');
	              }
							}
            }
            var rollI = rollBase.indexOf(rollAtt + roll[rollnr][j].pattern);
            if (rollI >= 0) {
              arestiNrs.push (rollAresti[rollI]);
              if ((sportingClass.value === 'glider') && (rollKGlider[rollI])) {
                kFactors.push (rollKGlider[rollI]);
              } else {
                kFactors.push (rollKPwrd[rollI]);
              }
              // Check if there was a roll before the current one and
              // - add ; or , as appropriate for checking
              // - when the roll type is the same and not opposite,
              //   check if nonArestiRolls is checked. Otherwise,
              //   present warning
              // - check if there are not more than two subsequent rolls
              //   when nonArestiRolls is not checked
              var k = j - 1;
              while (k > -1) {      
                if (roll[rollnr][k].type != 'line') {
                  if ((roll[rollnr][j].extent / roll[rollnr][k].extent) > 0) {
                    figCheckLine[seqNr] += ';';
                  } else {
                    figCheckLine[seqNr] += ',';
                  }
                  break;
                }
                k--;
              }
              figCheckLine[seqNr] += rollAresti[rollI];
            } else {
              // disable non-Aresti rolls
              if (!document.getElementById('nonArestiRolls').checked) {
                if (roll [rollnr][j].type != 'line') {
                  rollSums [rollnr] -= roll [rollnr][j].extent;
                  roll [rollnr][j] = {'type': 'line', 'extent': 0};
                }
              }
            }

            /** add the roll drawings to rollPaths */
            switch (roll[rollnr][j].type) {
              // Sum line elements
              case ('line'):
                lineSum += roll[rollnr][j].extent;
                // don't set lineDraw to true for shortenings. This will
                // prevent drawing a line of minimum length 1 when no
                // line was present in the figure drawing instructions
                if (roll[rollnr][j].extent > 0) lineDraw = true;
                break;
              // Build roll elements
              case ('roll'):
                rollPaths = buildShape('Roll', Array(
	                  roll[rollnr][j].extent,
	                  roll[rollnr][j].stops,
	                  rollTop,
	                  false,
	                  false,
	                  roll[rollnr][j].comment,
	                  figure_chooser ? fig[figNr].rolls[rollnr] : false
                  ),
                  rollPaths);
                lineLength += parseInt((Math.abs(roll[rollnr][j].extent) - 1) / 360) * (10 / lineElement);
                break;
              case ('slowroll'):
                rollPaths = buildShape('Roll', Array(
                  roll[rollnr][j].extent,
                  roll[rollnr][j].stops,
                  rollTop,
                  true,
                  false,
                  roll[rollnr][j].comment), rollPaths);
                lineLength += parseInt((Math.abs(roll[rollnr][j].extent) - 1) / 360) * (10 / lineElement);
                break;
              case ('possnap'):
                rollPaths = buildShape('Snap', Array(
                  roll[rollnr][j].extent,
                  0,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case ('negsnap'):
                rollPaths = buildShape('Snap', Array(
                  roll[rollnr][j].extent,
                  1,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case 'posShoulderRoll':
                rollPaths = buildShape('ShoulderRoll', Array(
                  roll[rollnr][j].extent,
                  0,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case 'negShoulderRoll':
                rollPaths = buildShape('ShoulderRoll', Array(
                  roll[rollnr][j].extent,
                  1,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case 'posRuade':
                rollPaths = buildShape('Ruade', Array(
                  roll[rollnr][j].extent,
                  0,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case 'negRuade':
                rollPaths = buildShape('Ruade', Array(
                  roll[rollnr][j].extent,
                  1,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case 'posLomcevak':
                rollPaths = buildShape('Lomcevak', Array(
                  roll[rollnr][j].extent,
                  0,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case 'negLomcevak':
                rollPaths = buildShape('Lomcevak', Array(
                  roll[rollnr][j].extent,
                  1,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (snapElement075 / lineElement);
                break;
              case ('posspin'):
                rollPaths = buildShape('Spin', Array(
                  roll[rollnr][j].extent,
                  0,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (spinElement / lineElement);
                break;
              case ('negspin'):
                rollPaths = buildShape('Spin', Array(
                  roll[rollnr][j].extent,
                  1,
                  rollTop,
                  roll[rollnr][j].comment),
                  rollPaths);
                lineLength += Math.abs(parseInt(roll[rollnr][j].extent / 360)) * (spinElement / lineElement);
            }
            
            /** update attitude and direction after roll */
            if (roll[rollnr][j].type != 'line') {
              rollSum += roll[rollnr][j].extent;
              rollDone = true;
              // Half rolls and all rolls in the vertical change
              // direction and possibly attitude
              if (((rollSum + 180) % 360) == 0) {
                Attitude = 180 - Attitude;
                if (Attitude < 0) Attitude += 360;
                if (/^[CL]$/.test(activeForm)) {
                  changeDir (-Math.abs(rollSum));
                } else {
                  changeDir(Math.abs(rollSum));
                }
                rollSum = 0;
                attChanged = 180 - attChanged;
                // correct load for half rolls in top of loop
                if (rollTop) NegLoad = 1 - NegLoad;
              }
              // check correct load after rolls that are not vertical or
              // in top of loop
              if ((Attitude != 90) && (Attitude != 270) && (!rollTop)) {
                NegLoad = (((Attitude > 90) && (Attitude < 270))) ? 1 : 0;
              }
            }
          }
          // completed all rolls of this roll position
          // set lowKFlick to false for next roll position
          lowKFlick = false;
      
          rollSum = rollSums[rollnr];
          // See if we have to autocorrect the rolls
          if (fig[figNr].rolls[rollnr] == 1) {
            autoCorr = -(rollSum % 360);
            // When a line is standing by to be built, build it before
            // doing the autocorrect
            if (autoCorr != 0) {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', [1.2/scale], rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength += lineSum;
                    rollPaths = buildShape('Line', [lineSum], rollPaths);
                  } else {
                    lineLength++;
                    rollPaths = buildShape('Line', [1], rollPaths);
                  }
                }
                lineSum = 0;
                lineDraw = false;
              }
              // Also build a line if a roll was done before
              if (rollDone) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', [1.2/scale], rollPaths);
                } else {
                  rollPaths = buildShape('Line', [2], rollPaths);
                  lineLength += 2;
                }
              }
            }
            if (attChanged == 180) {
              Attitude = 180 - Attitude;
              if (Attitude < 0) Attitude += 360;
              changeDir(180);
            }
          } else if (fig[figNr].rolls[rollnr] == 2) {
            autoCorr = -((rollSum + 180) % 360);
            // When a line is standing by to be built, build it before
            // doing the autocorrect
            if (autoCorr != 0) {
              if (lineDraw) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', [1.2/scale], rollPaths);
                } else {
                  if (lineSum > 0) {
                    lineLength += lineSum;
                    rollPaths = buildShape('Line', [lineSum], rollPaths);
                  } else {
                    lineLength++;
                    rollPaths = buildShape('Line', [1], rollPaths);
                  }
                }
                lineSum = 0;
                lineDraw = false;
              }
              // Also build a line if a roll was done before
              if (rollDone) {
                // set a fixed distance for rolls in the top
                if (rollTop) {
                  rollPaths = buildShape('Move', [1.2/scale], rollPaths);
                } else {
                  rollPaths = buildShape('Line', [2], rollPaths);
                  lineLength += 2;
                }
              }
            }
            // Half rolls change direction, attitude and load
            if (attChanged == 0) {
              Attitude = 180 - Attitude;
              if (Attitude < 0) Attitude += 360;
              changeDir(180);
            }
          } else {
            autoCorr = 0;
          }
          // Add autocorrect roll
          if (autoCorr != 0) {
            rollPaths = buildShape('Roll', Array(autoCorr, 0, false, false, true), rollPaths);
            // Find which roll in figures.js matches. There should only be one.
            // Then add Aresti nr and K factor
            var rollAtt = rollAttitudes[Attitude];
            switch (Math.abs(autoCorr)) {
              case (90):
                var rollI = rollBase.indexOf(rollAtt + '4');
                break;
              case (180):
                var rollI = rollBase.indexOf(rollAtt + '2');
                break;
              case (270):
                var rollI = rollBase.indexOf(rollAtt + '3');
                break;
              default:
                var rollI = -1;
            }
            if (rollI >= 0) {
              arestiNrs.push (rollAresti[rollI]);
              if ((sportingClass.value === 'glider') && (rollKGlider[rollI])) {
                kFactors.push (rollKGlider[rollI]);
              } else kFactors.push (rollKPwrd[rollI]);
            }
            alertMsgs.push ('(' + seqNr + ') ' + userText.autocorrectRoll);
          }
          // Add the second curve segment after a roll in the top
          // Invert the angle when it was a half roll
          // Move the pointer to where the roll should be. Start it offset
          // so it is centered on the top (especially for multiple rolls)
          if (rollTop) {
            if (fig[figNr].rolls[rollnr] == 2) {
              rollTopAngleAfter = -rollTopAngleAfter;
            }
            var topLineAngle = (rollTopAngleAfter > 0) ? 45 : -45;
            paths = buildShape ('Curve', topLineAngle, paths);
            if (rollPaths.length) {
              // draw the second marker when there was a roll in the top
              paths = buildShape ('RollTopLine', '', paths);
            } else {
              // no roll, remove first marker
              paths[paths.length - 3].path = '';
            }
            paths = buildShape ('Curve', rollTopAngleAfter - topLineAngle, paths);
            // Retrieve the movement by the two curve paths
            dx = paths[paths.length - 1].dx + paths[paths.length - 3].dx;
            dy = paths[paths.length - 1].dy + paths[paths.length - 3].dy;
            dxRolls = dyRolls = 0;

            // Retrieve the roll path movements
            for (var k = 0; k < rollPaths.length; k++) {
              if (rollPaths[k].dx) dxRolls += rollPaths[k].dx;
              if (rollPaths[k].dy) dyRolls += rollPaths[k].dy;
            }
/** fixme: would be nice to have rolls and snaps follow the curve of the
 *  loop. No consistent method found yet. */
            paths.push ({
              'path':'',
              'style':'',
              'dx':-dx-(dxRolls/2),
              'dy':-dy-(dyRolls/2)
            });
          }
          
          // Add all the roll paths
          for (var k = 0; k < rollPaths.length; k++) {
            paths.push(rollPaths[k]);
          }
          // Move back to the right place at the end of the curve after
          // a roll in the top
          if (rollTop) {
            paths.push ({
              'path':'',
              'style':'',
              'dx':dx - (dxRolls / 2),
              'dy':dy - (dyRolls / 2)
            });
          }
        }
      
        // See if the direction should be changed from default
        // This is only possible when there was a 1/4, 3/4 etc roll and
        // the attitude is vertical.
        // Only run one X and one Y switch per figure
        figString = checkQRollSwitch (
          figString,
          figStringIndex,
          fig[figNr].pattern,
          seqNr,
          rollSum,
          figureDraw,
          i,
          roll,
          rollnr);
      
        // The roll drawing has past, so make sure the rollTop variable
        // is set to false
        rollTop = false;
        rollnr++;
        break;
      // handle clovers (figures with fixed 1/4 roll up or down)
      case ('4'):
        paths = buildShape ('Roll', Array(90, 0), paths);
        figString = checkQRollSwitch (
          figString,
          figStringIndex,
          fig[figNr].pattern,
          seqNr,
          90,
          figureDraw,
          i,
          roll,
          rollnr);
        break;
      // (rolling) turns are handled here. We pass the turn part and any
      // direction changers of the draw string.
      // Other parsing is in the makeTurn function
      case ('j'):
      case ('J'):        
        // when this was an OLAN sequence, check for previous in-figure
        // X axis swap and autocorrect the exit of this figure for the
        // next round
        if (OLANSequence) OLANXSwitch(figStringIndex);

        if (regexChangeDir.test (figString)) {
          figures[figStringIndex].switchX = true;
          var prefix = (/^[CL]$/.test(activeForm)) ? '' : userpat.moveforward;
        } else {
          figures[figStringIndex].switchX = false;
          var prefix = (/^[CL]$/.test(activeForm)) ? userpat.moveforward : '';
        }
        paths = buildShape ('Turn', prefix +
          figureDraw.replace(/[^jioJIO\d]+/g, ''), paths);
        var regex = /[jioJIO\d]+/;
        while (regex.test(figureDraw.charAt(i))) i++;
        i--;
        break;
      // Handle angle and curve drawing. In here we will also decide the
      // goRight parameter that decides how we roll vertical
      default:
        if (figureDraw.charAt(i) in drawAngles) {
          var angle = parseInt(drawAngles[figureDraw.charAt(i)]);
          // Draw sharp angles for corners less than 180 unless
          // specifically told to make a curve by '=' symbol
          if ((Math.abs(angle) < 180) && (figureDraw.charAt(i + 1) != '=')) {
            paths = buildShape ('Corner', angle, paths);
          } else {
            // Draw curve. Half size when followed by '/' symbol
            if (figureDraw.charAt(i + 1) == '/') {
              curveRadius = curveRadius / 2;
            }
            // Check if the next roll should be in the top
            rollTop = (figureDraw[i + 1] == '!') ? true : false;
            if ((Math.abs(angle) < 360) && !rollTop) {
              paths = buildShape ('Curve', angle, paths);
            } else if (rollTop) {
              // Split any loop with a roll in top so we can use the second
              // part later to determine the top
              // We do this by finding the point closest to the center of
              // looping shape that has Attitude 0 or 180
              attTop = Attitude + (angle / 2);
              diffTop = ((attTop / 180) - parseInt ((attTop + 90) / 180)) * 180;
              if (Math.abs(diffTop) > 90) {
                diffTop = ((attTop / 180) - parseInt ((attTop - 90) / 180)) * 180;
              }
              angleTop = (angle / 2) - diffTop;

              var topLineAngle = (angleTop > 0) ? 45 : -45;
              paths = buildShape ('Curve', angleTop - topLineAngle, paths);
              paths = buildShape ('RollTopLine', '', paths);
              paths = buildShape ('Curve', topLineAngle, paths);
              var rollTopAngleAfter = angle - angleTop;
            } else {
              // Split full loops in several parts for drawing. Only used
              // for loops without a roll in the top. Useful for vertical 8s
              
              // Option 1: We add an invisible part to clarify initial loop.
              
              if (figureDraw.charAt(i + 1) == '«') {
								paths = buildShape ('Line', [2, false, 'hiddenCurve'], paths);
	              paths = buildShape ('Curve', {angle: angle * 0.05, style: 'hiddenCurve'}, paths);
	              paths = buildShape ('Curve', angle * 0.95, paths);
							} else if (figureDraw.charAt(i + 1) == '»') {
	              paths = buildShape ('Curve', angle * 0.95, paths);								
	              paths = buildShape ('Curve', {angle: angle * 0.05, style: 'hiddenCurve'}, paths);
								paths = buildShape ('Line', [2, false, 'hiddenCurve'], paths);
							} else {
								paths = buildShape ('Curve', {angle: angle * 0.5}, paths);
								paths = buildShape ('Curve', {angle: angle * 0.5}, paths);
							}
              
              /*
              // Option 2: Vary curve size in each half
              if (figureDraw.charAt(i + 1) == '@') smallCurve++;
              if (smallCurve === 1) curveRadius -= 1.5;
	            paths = buildShape ('Curve', angle * 0.5, paths);
	            if (smallCurve === 1) curveRadius += 1.5;
							if (smallCurve === 2) curveRadius -= 1.5;
              paths = buildShape ('Curve', angle * 0.5, paths);
              if (smallCurve === 2) curveRadius += 1.5;
              */
            }
            // if applicable, reset curveRadius when done
            if (figureDraw.charAt(i + 1) == '/') curveRadius *= 2;
          }
          NegLoad = (angle < 0) ? 1 : 0;
          // The lineLength may be necessary for e.g. hammerhead and is
          // set to 0 after any angle
          lineLength = 0;
          // unset lowKFlick after every curve
          lowKFlick = false;
        }
    }
  }
  
  /*
  // Check for hiddenCurvePaths and set first and last back to normal.
  // This will ensure the middle ones hidden in case of some
  // vertical 8 figures
  if (hiddenCurvePaths.length) {
		paths [hiddenCurvePaths[0]].style =
			paths [hiddenCurvePaths[0] + 1].style;
		paths [hiddenCurvePaths[hiddenCurvePaths.length - 1]].style =
			paths [hiddenCurvePaths[hiddenCurvePaths.length - 1] - 1].style;
	}
	*/
	
	// Check for hiddenCurvePaths and set middle two to normal.
  // This will ensure the middle ones hidden in case of some
  // vertical 8 figures
  /*
  if (hiddenCurvePaths.length) {
		paths [hiddenCurvePaths[1]].style =
			paths [hiddenCurvePaths[1] - 1].style;
		paths [hiddenCurvePaths[hiddenCurvePaths.length - 2]].style =
			paths [hiddenCurvePaths[hiddenCurvePaths.length - 2] + 1].style;
	}
	*/
	
  // Draw any remaining line, we can leave the variables 'dirty' because
  // there is no more processing after this
  if (lineDraw) {
    paths = buildShape ('Line', [Math.max (lineSum, 1), 'exit'], paths);
    figures[figStringIndex].exitLength = Math.max (lineSum, 1);
  }

  // Make the end of figure symbol
  paths = buildShape ('FigStop', '', paths);
  // Create empty space after each figure
  paths = buildShape ('FigSpace', 2, paths);

  // Replace double spaces or a space at the end on the figCheckLine
  // with the fake Aresti code for no roll 0.0.0.0
  while (figCheckLine[seqNr].match(/(  )|( $)/)) {
    figCheckLine[seqNr] = figCheckLine[seqNr].replace('  ', ' 0.0.0.0 ');
    figCheckLine[seqNr] = figCheckLine[seqNr].replace(/ $/, ' 0.0.0.0');
  }

  // The figure is complete. Create the final figure object for later
  // processing such as drawing Forms and point & click figure editing
  figures[figStringIndex].paths = paths;
  figures[figStringIndex].aresti = arestiNrs;
  figures[figStringIndex].k = kFactors;
  figures[figStringIndex].seqNr = seqNr;
  figures[figStringIndex].rolls = roll;
  figures[figStringIndex].rollInfo = rollInfo;
  figures[figStringIndex].scale = Math.round((scale - 1) * 10);
  figures[figStringIndex].entryExt = entryExt;
  figures[figStringIndex].exitExt = exitExt;
  figures[figStringIndex].entryAxis = entryAxis;
  figures[figStringIndex].entryAtt = entryAtt;
  figures[figStringIndex].entryDir = entryDir;
  figures[figStringIndex].exitAtt = Attitude;
  figures[figStringIndex].exitDir = Direction;
  figures[figStringIndex].unknownFigureLetter = unknownFigureLetter;
  figures[figStringIndex].checkLine = figCheckLine[seqNr];
  figures[figStringIndex].superFamily = getSuperFamily (arestiNrs,
	  (document.getElementById('class').value == 'glider') ?
	  'glider' : document.getElementById('category').value);
  unknownFigureLetter = false;
      
  // set inFigureXSwitchFig (used for OLAN sequence autocorrect) to
  // Infinity when we exit on X axis
  if ((Direction == 0) || (Direction == 180)) {
    inFigureXSwitchFig = Infinity;
  }
}

// checkQRollSwitch checks for vertical 1/4 rolls and determines 
// roll direction.
// Only run one X and one Y switch per figure
function checkQRollSwitch (figString, figStringIndex, pattern, seqNr, rollSum, figureDraw, fdIndex, roll, rollnr) {
  if (((Attitude == 90) || (Attitude == 270)) && (rollSum % 180)) {
    if (/^[CL]$/.test(activeForm)) {
      changeDir (-Math.abs(rollSum));
    } else {
      changeDir(Math.abs(rollSum));
    }
    // find the next angle. Usually this will occur before a new rolling
    // element EXCEPT for tailslides and hammerheads
    var nextAngle = 0;
    var nextRollExtent = 0;
    var nextRollExtentPrev = 0;
    var switchVert = false;
    var verticalRolls = (pattern.match (
	    RegExp ('[\\' + figpat.anyroll + '\\' +
	    figpat.spinroll + ']', 'g')) || []).length;

    var firstRoll = (rollnr == 0) ? true : false;
    for (var i = fdIndex + 1; i < figureDraw.length; i++) {
      if (figureDraw[i] in drawAngles) {
        // found an angle
        nextAngle = drawAngles[figureDraw[i]];
        // break the loop when the angle doesn't bring us back to vertical
        if (nextAngle % 180) {
          break;
        }
      } else if (figureDraw[i] == figpat.fullroll) {
        // see if there are more rolls before any angle. This happens on
        // tailslides and hammers and influences the direction in which we
        // will have to turn to end up correct at the end of the figure
        rollnr++;
        nextRollExtentPrev = nextRollExtent;
        for (var j = 0; j < roll[rollnr].length; j++) {
          if (roll[rollnr][j].type != 'line') {
            nextRollExtent += parseInt(roll[rollnr][j].extent);
          }
        }
        // When the next roll is a 1/4 roll there is no need to continue.
        // Code applies to all figures with 3 or more rolls of type &
        // (any amount of rotation) as we assume those are vertical.
        // Currently (2016) only applies to double bumps for Aresti,
        // but also some non-Aresti figures (e.g. -4ibh(4)4).
        // When one of the following rolls is a 1/4 we just care about
        // the direction of this roll. It should make the next curve go
        // in the correct direction.
        // We know this routine will be called again for the next roll
        if (nextRollExtent % 180) {
          if ((verticalRolls > 2) && firstRoll) {
            if (rollnr == 2) {
              nextRollExtent = nextRollExtentPrev;
              break;
            }
            // see if there's a first part direction switcher (;> or ;^)
            // before the pattern figure letters (e.g. bb)
            // Remove when applied
            var regex = new RegExp(';[>^]' + pattern.match(/[a-zA-Z]+/)[0]);

            if (figString.match (regex)) {
              var switchDir = true;
              figString = figString.replace(regex, "$1");
              figures[figStringIndex].switchFirstRoll = true;
            } else {
              var switchDir = false;
              figures[figStringIndex].switchFirstRoll = false;
            }
            if ((Direction == 0) || (Direction == 180)) {
              if (((((Attitude == 90) == (Direction == 0)) == (nextAngle > 0)) == goRight) != switchDir) {
                changeDir(180);
              }
              goFront = !goFront;
              updateAxisDir = false;
            } else {
              if (((((Attitude == 90) == (Direction == 270)) == (nextAngle > 0)) == goFront) != switchDir) {
                changeDir(180);
              }
              if (updateAxisDir) goFront = !goFront; 
              updateAxisDir = false;
            }
            return figString;
          } else {
            // The exit direction will be based on this roll next time
            // checkQRollSwitch is called
            break;
          }
            
        } else {
          // we have continued to the next vertical roll, so the vertical
          // has switched
          switchVert = !switchVert;
        }

      } else if (figureDraw[i] == figpat.hammer) {
        // set a 'virtual' roll for the hammerheads. HARDCODED
        nextRollExtent += 180;
      }
    }
    if ((Direction == 0) || (Direction == 180)) {
      // change roll direction depending on the X direction we want to
      // fly after the vertical
      // count angles greater than 180 as negative. e.g. Rev P-loop will
      // first go the 'wrong' way before ending the 'right' way
      if (Math.abs(nextAngle) > 180) nextAngle = -nextAngle;
      // multiple switches decide if we should go right or left
      // each switch toggles the decision
      if (((((Attitude == 90) == (Direction == 0)) == (nextAngle > 0)) == goRight) != switchVert) {
        changeDir(180);
      }
      // when this was an OLAN sequence, check for previous in-figure
      // X axis swap and autocorrect this figure for the next round
      if (OLANSequence) OLANXSwitch(figStringIndex);
      if (regexSwitchDirX.test (figString)) {
        changeDir (180);
        figures[figStringIndex].switchX = true;
        inFigureXSwitchFig = figStringIndex; // used for OLAN auto correct
        // Remove this direction changer from the figure string once
        // applied and no Q roll follows
        if (nextRollExtent == 0) {
          figString = figString.replace(regexSwitchDirX, '');
        }
      } else figures[figStringIndex].switchX = false;
      // check for the OLAN Humpty Bump direction bug
      if (OLANBumpBugCheck) {
        if (regexOLANBumpBug.test(pattern)) {
          OLANBumpBugFigs.push (seqNr);
          // autocorrect loaded OLAN sequence when applicable
          if (OLANSequence) {
            if (regexSwitchDirX.test (figString)) {
              figures[figStringIndex].string = figures[figStringIndex].string.replace(regexSwitchDirX, '');
            } else {
              figures[figStringIndex].string = figures[figStringIndex].string + userpat.switchDirX;
            }
          }
        }
      }
      // just changed from Y to X axis. Make the default direction for
      // a subsequent X to Y in the same figure go the other way. This
      // will keep e.g. 4b4 the same when starting on X or Y axis
      if (updateAxisDir) goFront = !goFront;
    } else {
      // count angles greater than 180 as negative. e.g. Rev P-loop will
      // first go the 'wrong' way before ending the 'right' way
      if (Math.abs(nextAngle) > 180) nextAngle = -nextAngle;
      // autocorrect loaded OLAN sequence when applicable
      if (OLANSequence && !goFront) {
        goFront = true;
        if (regexSwitchDirY.test (figString)) {
          figures[figStringIndex].string = figures[figStringIndex].string.replace(regexSwitchDirY, '');
        } else {
          figures[figStringIndex].string += userpat.switchDirY;
        }
      }
      if (((((Attitude == 90) == (Direction == 90)) == (nextAngle < 0)) == goFront) != switchVert) {
        changeDir(180);
      }      
      if (regexSwitchDirY.test (figString)) {
        changeDir(180);
        figures[figStringIndex].switchY = true;
        if (nextRollExtent == 0) {
          figString = figString.replace(regexSwitchDirY, '');
        }
      } else {
        figures[figStringIndex].switchY = false;
      }
      // check for the OLAN N direction bug
      if (OLANBumpBugCheck && figures[figStringIndex].switchX) {
        if (regexOLANNBug.test(pattern)) {
          OLANNBugFigs.push (seqNr);
        }
      }
    }
    if (!(nextRollExtent % 180)) changeDir (-nextRollExtent);
  }
  return figString;
}

// OLANXSwitch:
// when this was an OLAN sequence, check for previous in-figure
// X axis swap and autocorrect the exit of this figure for the
// next round
function OLANXSwitch (figStringIndex) {
  if (inFigureXSwitchFig < figStringIndex) {
    if (regexSwitchDirX.test (figures[figStringIndex].string)) {
      figures[figStringIndex].string = figures[figStringIndex].string.replace(regexSwitchDirX, '');
    } else {
      figures[figStringIndex].string += userpat.switchDirX;
    }
  }
}

// updateSequence updates the sequence character string.
// Figure 'figure' is placed after figure 'figNr' or over figNr' when
// 'replace' is true.
// Also some checks are done, including direction switcher checks.
// The function assumes the 'figure' starts on X axis. So when the previous
// figure ends on Y axis, direction changers are flipped.

// when force is true, update will be done even when it seems no change is made
function updateSequence (figNr, figure, replace, fromFigSel, force) {

  var updateSelected = true;
  // make sure figNr is handled as integer
  figNr = parseInt(figNr);
  // check if figure is from Figure Selector and correct direction changers
  if (fromFigSel) {
    var prevFig = replace ? figNr - 1 : figNr;
    // correct direction changers
    if (figures[prevFig] && figure.match(/[a-zA-Z]/) &&
      (figures[prevFig].exitAxis === 'Y')) {
      // switch > and ^. Use temporary placeholder #
      figure = figure.replace(regexSwitchDirY, '#').
	      replace(regexSwitchDirX, userpat.switchDirY).
	      replace(/#/g, userpat.switchDirX);
    }
  }
  
  // just return if asked to replace an identical figure
  if (replace && (figures[figNr].string == figure) && !force) return;
  
  var string = '';
  var separator = (figure == '') ? '' : ' ';
  for (var i = figures.length - 1; i >= 0; i--) {
    if (i == figNr) {
      if (!replace) {
        // Handle (multiple) moveto or curveto
        if (figure.match(regexMoveTo) || figure.match(regexCurveTo)) {
          var curve = true;
          var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
          var dx = parseInt(dxdy[0]);
          var dy = parseInt(dxdy[1]);
          // go back until we find a real figure
          while (figures[i] && !figures[i].seqNr) {
            // check for previous move, curve or movefoward
            if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
              // keep straight line when that was the previous way of moving
              if (figures[i].moveTo) curve = false;
              // sum dx and dy
              if (figures[i].moveForward) {
                dx += parseInt(figures[i].paths[0].dx * (scale / lineElement));
                dy += parseInt(figures[i].paths[0].dy * (scale / lineElement));
              } else {
                var dxdy = figures[i].string.replace(/[^0-9\,\-]/g, '').split(',');
                dx += parseInt(dxdy[0]);
                dy += parseInt(dxdy[1]);
              }
              // correcting the selected figure id is done here
              if ((selectedFigure.id !== null) && (i < figNr)) {
                // for every second and subsequent replace of move,
                // we reduce the selected figure id
                if (!updateSelected) selectedFigure.id--;
              }
              // don't update the selectedFigure.id later
              updateSelected = false;
            } else {
              // no move figure, add it to the start of the string and
              // continue looking
              string = figures[i].string + ' ' + string;
            }
            i--;
            // no move on the first figure, so stop there
            if ((i == 0) || (figures[i].seqNr < 2)) break;
          }
          if (!updateSelected) {
            // only build the move when it is more than one unit
            if ((Math.abs(dx) + Math.abs(dy)) > 1) {
              figure = curve ? '('+dx+','+dy+')' : '['+dx+','+dy+']';
            } else {
              figure = '';
              selectedFigure.id--;
            }
          }
        }
      }
      
      // replace or add before
      if (figure !== '') {
        string = figure + separator + string;
      }
      if (!replace && (i >= 0)) {
        string = figures[i].string + ' ' + string;
      }
    } else {
      string = figures[i].string + ' ' + string;
    }
  }
  // with a negative figNr the fig is placed at the beginning
  if (figNr < 0) string = figure + separator + string;

  // check if the selected figure id has te be changed
  if ((selectedFigure.id !== null) && updateSelected) {
    if (selectedFigure.id > figNr) {
      if (replace) {
        if (figure === '') selectedFigure.id--;
      } else {
        selectedFigure.id++;
      }
    } else if (replace && (figure === '') && (selectedFigure.id === figNr)) {
      selectFigure(false);
    }
  }

  // remove last added space, update field
  sequenceText.innerText = string.replace (/ $/, '');

  // check for sequence changes
  checkSequenceChanged (force);

  // use automatic positioning if checked
  if (fromFigSel &&
    document.getElementById('positionClearAuto').checked &&
    (activeForm !== 'FU')) {
    if (replace) {
      // need to get bBox as it hasn't been loaded yet
      figures[figNr].bBox = myGetBBox(document.getElementById('figure' + figNr));
      separateFigure (figNr);
    } else {
      separateFigure (figNr + 1);
    }
  }
  
  // reselect correct figure
  if ((selectedFigure.id !== null) && updateSelected) {
    selectFigure (selectedFigure.id);
  }

}

// comparePreviousSequence returns the old and new figure numbers that
// are the last ones changed compared to the previous sequence, e.g.:
// "o b4 h3 q" to "o d b h3 q" would return [1,2]
// with no change, the return is [false, false]
function comparePreviousSequence () {
  if (activeSequence.previousFigures) {
    var m = activeSequence.previousFigures.length - 1;
    var n = activeSequence.figures.length - 1;
    while ((m >= 0) && (n >= 0)) {
      if (activeSequence.previousFigures[m].string === activeSequence.figures[n].string) {
        m--;
        n--;
      } else {
        return [m, n];
      }
    }
  }
  return [false, false];
}
   
// updateXYFlip changes all > to ^ and vv from figure 'n' (defined by
// comparePreviousSequence) to the end.
// But only on Free (Un)known figures with matching Figure Letters. It is
// done only for these as otherwise unexpected effects when copy-pasting
// whole sequences may occur.
// When doing this, the Figure Letters will be identical by definition,
// as the sequence is checked identical as of 'n'.
function updateXYFlip (m, n) {
  var sub = false;
  var dmn = m - n;
  if (activeSequence.figures[n]) {
    var text = activeSequence.text.substring(0, activeSequence.figures[n].stringStart);
    for (var i = n; i < activeSequence.figures.length; i++) {
      var s = activeSequence.figures[i].string;
      if (s.match (/^e(u|d|j|ja)$/)) sub = true;
      // Only act on figures that previously had an unknownFigureLetter.
      // This will also prevent matching moves, such as "12>", ">", "^^"
      // Also, do not flip XY in new subsequences
      if (activeSequence.previousFigures[i + dmn].unknownFigureLetter && !sub) {
        // switch > and ^. Use temporary placeholder #
        s = s.replace(regexSwitchDirY, '#').
			    replace(regexSwitchDirX, userpat.switchDirY).
			    replace(/#/g, userpat.switchDirX);
      }
      activeSequence.figures[i].string = s;
      text += s + ' ';
    }
    updateSequenceText (text);
  }
}

// parseSequence parses the sequence character string
function parseSequence () {
  var
	  seqNr = 1,
	  subSequence = false,
	  comments = false,
	  figure = '',
	  formBDirection = 0,
	  match = false;

  // Clear the figCheckLine array
  figCheckLine = [];
  // Clear the figureStart array
  figureStart = [];

  additionals = 0;
  // Make sure the scale is set to 1 before parsing
  if (scale != 1) {
    curveRadius = curveRadius / scale;
    lineElement = lineElement / scale;
    scale = 1;
  }

  // Get the split string from activeSequence
  figures = activeSequence.figures;

  // Find out where the sequence changed
  var changePoints = comparePreviousSequence();
  
  for (var i = 0; i < figures.length; i++) {
    // make sure all paths are empty
    figures[i].paths = [];
    
    // always start figure LTR for Figures in grid view. But this means
    // we have to correct direction switchers if the figure would start
    // on Y axis on Form B
    if (activeForm === 'Grid') {
      formBDirection += Direction;
      if (formBDirection >= 360) formBDirection -= 360;
      if ((formBDirection === 90) || (formBDirection === 270)) {
        // switch > and ^. Use temporary placeholder #
        figures[i].string = figures[i].string.replace(regexSwitchDirY, '#').
			    replace(regexSwitchDirX, userpat.switchDirY).
			    replace(/#/g, userpat.switchDirX);
        figures[i].entryAxisFormB = 'Y';
      }
      Direction = (Attitude == 0) ? 0 : 180;
    }

    figure = figures[i].string;

    // See if there is a y-axis flip symbol and activate it, except when 
    // - it matches the subSequence code which is similar (/ or //)
    // - the previous figure did not exited on X axis (not applicable
    //   for Grid)
    flipY: if (figure.replace(regexComments, '').match(regexFlipYAxis)) {
      if (activeForm !== 'Grid') {
        for (var j = i - 1; j >= 0; j--) {
          if (figures[j].aresti) {
            if (figures[j].exitAxis == 'X') break; else break flipY;
          }
        }
      }
      setYAxisOffset (180 - yAxisOffset);
    }
        
    // simplify the string
    
    // replace `+ by forwardshorten for entry
    var shorten = figure.match (regexEntryShorten);
    if (shorten) {
      figure = figure.replace (regexEntryShorten, 
        new Array(shorten[0].length - shorten[1].length).join(userpat.forwardshorten) +
        shorten[1]);
    }
    
    // replace +` by forwardshorten for exit
    var shorten = figure.match (regexExitShorten);
    if (shorten) {
      figure = figure.replace (regexExitShorten, shorten[1] +
        new Array(shorten[0].length - shorten[1].length).join(userpat.forwardshorten));
    }
    
    // replace `- by forwardshorten for negative entry
    var shorten = figure.match (regexEntryShortenNeg);
    if (shorten) {
      figure = figure.replace (regexEntryShortenNeg, 
        new Array(shorten[0].length - shorten[1].length + 1).join(userpat.forwardshorten) +
        shorten[1]);
    }
    
    // replace -` by forwardshorten for negative exit
    var shorten = figure.match (regexExitShortenNeg);
    if (shorten) {
      figure = figure.replace (regexExitShortenNeg, shorten[1] +
        new Array(shorten[0].length - shorten[1].length + 1).join(userpat.forwardshorten));
    }

    // replace the second '-' and up (in row) by longforward (reverse for speed)
    // e.g. ---h- will be ++-h-
    // don't know a way to do this with regex...
    var multipleMinus = false;
    // if the figure is only - and extensions, e.g. --, disregard last minus
    var skipMinus = RegExp ('^[-\\' + userpat.forward + '\\' +
	    userpat.lineshorten + ']*$').test (figure) ? true : false;
    for (var j = figure.length - 1; j >= 0; j--) {
      if (figure[j] == '-') {
        if (multipleMinus) {
          figure = figure.substring(0, j) + userpat.longforward +
            figure.substring (j+1);
        } else if (skipMinus) {
          skipMinus = false;
        } else multipleMinus = true;
      } else multipleMinus = false;
    }
    
    // replace longforward by 3x forward
    // e.g. -++h- will be -~~~~~~h-
    figure = figure.replace (regexLongForward, userpat.forward+userpat.forward+userpat.forward);
    
    // Parse out the instructions that are for drawing B and C forms only
    if (figure.match(regexDrawInstr) ||
      (figure.replace(regexMoveForward, '').length == 0) ||
      (figure.replace(regexMoveDown, '').length == 0) ||
      (figure == userpat.subSequence)) {
      var onlyDraw = true;
      // do not do moveTo, curveTo or moveForward on first figure
      if ((figure.charAt(0) == userpat.moveto) && (seqNr > 1)) {
        // Move to new position
        var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
        if ((dxdy[0] >= 0 || dxdy[0] < 0) && (dxdy[1] >= 0 || dxdy[1] < 0)) {
          buildMoveTo (dxdy, i);
        }
      } else if ((figure.charAt(0) == userpat.curveTo) && (seqNr > 1)) {
        // Curve to new position
        var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
        if ((dxdy[0] >= 0 || dxdy[0] < 0) && (dxdy[1] >= 0 || dxdy[1] < 0)) {
          buildCurveTo (dxdy, i);
        }
      } else if (regexMoveForward.test(figure) && (seqNr > 1)) {
        // Move forward without connecting line
        var moveFwd = figure.match(regexMoveForward)[0];
        if (parseInt (moveFwd)) {
          buildMoveForward (parseInt(moveFwd) +
                            moveFwd.length -
                            moveFwd.match(/[0-9]*/)[0].length -
                            1, i);
        } else {
          buildMoveForward (moveFwd.length, i);
        }
      } else if (regexMoveDown.test(figure)) {
        // Move down without connecting line
        var moveDn = figure.match(regexMoveDown)[0];
        if (parseInt (moveDn)) {
          buildMoveDown (parseInt(moveDn) + moveDn.length - moveDn.match(/[0-9]*/).length - 1, i);
        } else {
          buildMoveDown (moveDn.length, i);
        }
      } else if (figure.charAt(figure.length - 1) == userpat.scale) {
        // Change scale
        if (scale != 1) {
          curveRadius = curveRadius / scale;
          lineElement = lineElement / scale;
        }
        scale = Math.max (1 + (parseInt (figure.replace(userpat.scale, '')) / 10), 0.1) || 1;
        curveRadius = curveRadius * scale;
        lineElement = lineElement * scale;
        figures[i].scale = true;
//      } else if (figure.match (regexSequenceOptions)) {
      } else if (figure == userpat.subSequence) {
        // Start subsequence
        firstFigure = true;
        figures[i].subSequence = '//';
        subSequence = '//';
        if (Attitude == 180) {
          Attitude = 0;
          changeDir(180);
        }
      } else if (regexTextBlock.test(figure)) {
        // add text block
        figures[i].paths = buildShape ('TextBlock', figure.replace(RegExp(userpat.comment, 'g'), ''), []); 
        figures[i].unknownFigureLetter = unknownFigureLetter;
        // set comments, to be applied to the next real figure
        comments = figure.replace(RegExp(userpat.comment, 'g'), '');
        // remove unknownFigureLetter from comments when applicable
        comments = comments.replace(/^@[A-L]/, '');
      }
    } else if (match = figure.match (/^e(ja?|d|u)$/)) {
      match = match[0];
      Attitude = 0;
      // sequence entry options
      if (match === 'eja') {
        // Crossbox away entry 'figure'
        Direction = 90;
      } else if (match === 'ej') {
        // Crossbox entry 'figure'
        Direction = 270;
      } else if (match === 'ed') {
        // Downwind entry 'figure'
        if (/^[CL]$/.test(activeForm)) {
          Direction = 0;
          goRight = true;
        } else {
          Direction = 180;
          goRight = false;
        }
      } else if (match === 'eu') {
        // Upwind entry 'figure'
        if (/^[CL]$/.test(activeForm)) {
          Direction = 180;
          goRight = false;
        } else {
          Direction = 0;
          goRight = true;
        }
      }
      if (firstFigure) {
        updateSequenceOptions (match);
      } else {
        subSequence = match;
        firstFigure = true;
      }
      figures[i].subSequence = match;
    } else {
      // remove any comments inside the figure
      var base = figure.replace(regexComments, '');
      // To determine the base we remove all non-alphabet characters (except -)
      base = base.replace(/[^a-zA-Z\-]+/g, '');
      // Replace any x> format to move forward by x times >
      if (regexMoveForward.test(figure)) {
        var moveFwd = fig.match(regexMoveForward)[0];
        if (parseInt (moveFwd)) {
          figure = figure.replace(regexMoveForward, parseInt(moveFwd) + moveFwd.length - moveFwd.match(/[0-9]*/).length - 1);
        } else {
          figure = figure.replace(regexMoveForward, moveFwd.length);
        }
      }
      // Handle the very special case where there's only an upright (1)
      // or inverted (2) spin
      if (base.replace(/-/g, '') == 's') {
        figure = figure.replace(/(\d*)s/, "iv$1s");
        base = base.replace('s', 'iv');
      } else if (base.replace(/-/g, '') == 'is') {
        figure = figure.replace(/(\d*)is/, "iv$1is");
        base = base.replace('is', 'iv');
      }
      // To continue determining the base we remove all snap, spin and
      // tumble characters. Handle special case of non-Aresti tri figure
      base = base.replace ('tri', '#').replace(/i?[fseul]/g, '').replace ('#', 'tri');
      // Handle simple horizontal rolls that change from upright to
      // inverted or vv
      if (base == '-') {
        if (figure.replace(/[^a-zA-Z0-9\-\+]+/g, '').charAt(0) == '-') {
          base += '+';
        } else {
          base = '+' + base;
        }
        // Handle everything else
      } else if ((base != '') || figure.match(/^[^\[\(]*[0-9fseul]/)) {
        // begin the base with a '+' if there is no '-'
        if (base.charAt(0) != '-') base = '+' + base;
        // end the base with a '+' if there is no '-'
        if (base.charAt(base.length - 1) != '-') base += '+';
      }
      // set subSequence to true for subsequence 'figures'
      if (base.match(/^\+e(j|ja|d|u)\+$/) && !firstFigure) {
        subSequence = true;
      }
      // Autocorrect the entry attitude for figures after the first
      // (sub)figure where necessary
      if (!(firstFigure || subSequence)) {
        // Start upright
        if (Attitude == 0) {
          if (base[0] == '-') {
            Attitude = 180;
            changeDir(180);
            // don't show warning in Grid view
            if (activeForm !== 'Grid') {
              alertMsgs.push ('(' + seqNr + ') ' + userText.setUpright);
              // draw circle around figure start
              figures[i].paths = [{'path': 'm -' + (rollcurveRadius * 1.2) +
                ',0 a' + (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
                ' 0 1 1 0,0.01', 'style':'corr'}];
            }
          }
        // Start inverted
        } else if (Attitude == 180) {
          if (base[0] == '+') {
            Attitude = 0;
            changeDir(180);
            // don't show warning in Grid view
            if (activeForm !== 'Grid') {
              alertMsgs.push ('(' + seqNr + ') ' + userText.setInverted);
              // draw circle around figure start
              figures[i].paths = [{'path': 'm -' + (rollcurveRadius * 1.2) +
                ',0 a' + (rollcurveRadius * 1.2) + ',' + (rollcurveRadius * 1.2) +
                ' 0 1 1 0,0.01', 'style':'corr'}];
            }
          }
        }
      }
      // Handle turns and rolling turns. They do have numbers in the base
      if (base.match(/^.j[^w]/)) {
        base = figure.replace(/[^a-zA-Z0-9\-\+]+/g, '');
        if (base.charAt(0) != '-') base = '+' + base;
        if (base.charAt(base.length - 1) != '-') base += '+';
      }
      // Retrieve the figNrs (if any) from array figBaseLookup
      figNrs = figBaseLookup[base];
      if (figNrs) {
        // When the first figure starts negative we make sure the
        // Attitude is inverted and the DRAWING direction stays the same
        if ((firstFigure || subSequence) && (base.charAt(0) == '-')) {
          Attitude = 180;
          changeDir(-180);
        }
        // switch default goRight for every figure that starts on X axis
        if ((Direction == 0) || (Direction == 180)) {
          goRight = ((Direction == 180) == (Attitude == 0));
        }
        // build the figure into the figures object
        buildFigure (figNrs, figure, seqNr, i);
        // check if this is a additional
        if (regexAdditional.test(figure)) {
          additionals++;
          figures[i].additional = true;
        } else if (figures[i].unknownFigureLetter) {
          if (figures[i].unknownFigureLetter == 'L') {
            additionals++;
            figures[i].additional = true;
          }
        }
            
        // check if this is the first figure of a subSequence
        if (subSequence) {
          figures[i].subSequence = subSequence;
          subSequence = false;
        }
        
        // add comments when applicable
        if (comments) {
          figures[i].comments = comments;
          
          // add country when applicable
          var country = false;
	        // check for three-letter flag country in separate "word"
	        var match = comments.match(/\b[A-Z]{3}\b/g);
	        if (match) {
	          for (var j = match.length - 1; j >= 0; j--) {
	            // check for IOC countries first
	            if (iocCountriesReverse[match[j]]) {
	              country = iocCountriesReverse[match[j]].toLowerCase();
	              if (flags[country]) {
	                break;
	              } else country = false; 
	            }
	            // next check for iso countries
	            if (isoCountriesReverse[match[j]]) {
	              country = isoCountriesReverse[match[j]].toLowerCase();
	              if (flags[country]) {
	                break;
	              } else country = false; 
	            }
	          }
	        }
	        figures[i].country = country;
	        if (country) {
						figures[i].iocCountry = iocCountries[country.toUpperCase()];
					}
	        
          comments = false;
        }
        
        // increase sequence figure number
        seqNr ++;
        firstFigure = false;
        // Reset scale to 1 after completing a figure
        if (scale != 1) {
          curveRadius = curveRadius / scale;
          lineElement = lineElement / scale;
          scale = 1;
        }
      } else if (base != '') {
        if (firstFigure) updateSequenceOptions ('');
        // No viable figure found, therefore Illegal
        buildIllegal (i);
        if (i == (figures.length - (activeForm === 'FU' ? 2 : 1))) {
          alertMsgs.push (userText.illegalAtEnd);
        } else {  
          alertMsgs.push (userText.illegalBefore + seqNr);
        }
      }
    }
    
    // set the exitAxis for every figure, including draw only
    figures[i].exitAxis = ((Direction == 0) || (Direction == 180)) ? 'X' : 'Y';
    
    // check if this is the changePoint
    if (i === changePoints[1]) {
      // check if the exitAxis has been changed
      if (activeSequence.previousFigures[changePoints[0]].exitAxis !== figures[i].exitAxis) {
        updateXYFlip (changePoints[0] + 1, i + 1);
      }
    }
      
  }
  // check for floating point correction
  checkFloatingPoint();
  // Check the sequence against the correct rules
  checkRules ();
  // check for any OLAN Humpty Bump bug messages
  if (OLANBumpBugCheck) {
    var warning = '';
    if (OLANBumpBugFigs.length >= 1) {
      warning = 'Fig ';
      for (var i = 0; i < OLANBumpBugFigs.length; i++) {
        warning += OLANBumpBugFigs[i];
        if (i < (OLANBumpBugFigs.length -1)) warning += ' and ';
      }
      if (OLANBumpBugFigs.length < 2) {
        warning += userText.OLANBumpBugWarning;
      } else warning += userText.OLANBumpBugWarningMulti;
    }
    if (OLANNBugFigs.length >= 1) {
      warning += 'Fig ';
      for (var i = 0; i < OLANNBugFigs.length; i++) {
        warning += OLANNBugFigs[i];
        if (i < (OLANNBugFigs.length -1)) warning += ' and ';
      }
      if (OLANNBugFigs.length < 2) {
        warning += userText.OLANNBugWarning;
      } else warning += userText.OLANNBugWarningMulti;
    }
    if (warning != '') {
      alertBox(warning + userText.OLANBugWarningFooter);
      OLANBumpBugFigs = OLANNBugFigs = [];
      OLANBumpBugCheck = false;
    }
  }
  // Build the last figure stop shape at the last real figure after
  // all's done.
  if (!firstFigure && !(activeForm.match (/^(Grid)|(FU)$/))) {
    for (var i = figures.length - 1; i >= 0; i--) {
      if (figures[i].aresti) {
        paths = figures[i].paths;
        // remove space at end of figure
        paths.pop();
        paths = buildShape ('FigStop', true, paths);
        figures[i].paths = paths;
        break;
      }
    }
  }
}

// do initialization when all DOM content has been loaded. Wrap this in
// a setTimeout to assure splash screen shows immediately
document.addEventListener("DOMContentLoaded", function(){setTimeout(doOnLoad, 100)}, false);
