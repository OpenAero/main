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
"use strict";
// Define window objects for saving files
if (!window.BlobBuilder && window.WebKitBlobBuilder) {
    window.BlobBuilder = window.WebKitBlobBuilder;
}
if (!window.requestFileSystem && window.webkitRequestFileSystem) {
    window.requestFileSystem = window.webkitRequestFileSystem;
}

// interval id
var intervalID = [];

// trueDrawingAngle is used for correctly drawing on Y axis
var trueDrawingAngle;
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
// sequenceEditing is true when the sequence drawing output is set for
// editing and false when set for output (e.g. printing)
var sequenceEditing = true;
// activeSequence holds the current sequence string, separate figures,
// XML string with all sequence info, undo, redo and filename
const activeSequence = {
    'text': '',
    'figures': [],
    'xml': null,
    'undo': [],
    'redo': [],
    'addUndo': true
};
// referenceSequence is used for checking Free (Un)known sequence against
// reference
const referenceSequence = { figures: [] };
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
var perspectiveParam = getEllipseParameters(yAxisOffsetDefault, yAxisScaleFactor);
// logoImg holds the active logo image
var logoImg = false;
// figureStart holds the start positions (x,y) of all figures
var figureStart = [];
// selectFigure holds variables for the currently selected figure
var selectedFigure = { 'id': null };
// SVGRoot is the sequence SVG object
var SVGRoot = null;
// These variables are used for dragging and dropping
var TrueCoords = null;
var GrabPoint = null;
var dragTarget = null;

// platform.mobile is true when running on a mobile device (e.g. tablet)
/** SET TO true FOR TESTING MOBILE */
platform.mobile = (window.matchMedia("(max-width: 767px)").matches ||
    ("ontouchstart" in document.documentElement) ||
    (navigator.userAgent.indexOf('IEMobile') !== -1) || 
    platform.cordova ||
    false); // here

// platform.touch is true on touch enabled devices
platform.touch = (('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0));

// storage is true when localStorage is enabled (checked by doOnLoad)
// start with true to activate the check
var storage = true;

// multi is used for keeping track of multiple sequence check globals
// processing  : false when multiple sequences are not being processed,
//               otherwise 'check' or 'print'
// total       : total number
// count       : current number
// savedSeq    : sequence active before starting multi check
// useReference: use current reference sequence or not
const multi = {
    processing: false,
    total: 0,
    count: 0,
    savedSeq: '',
    useReference: false
};

// saveData is used to hold data for filesaving
const saveData = { blob: '', ext: '' };

// variable for OLAN Humpty Bump check, N check and automatic conversion
// of roll directions. Only used when opening OLAN files
const OLAN = {
    bumpBugCheck: false,
    bumpBugFigs: [],
    nBugFigs: [],
    sequence: false,
    inFigureXSwitchFig: Infinity
};

// seqCheckAvail indicates if sequence checking is available for a
// rule/cat/seq combination
var seqCheckAvail = {};
// variables used for checking sequence validity
var checkAllowCatId = [];  // Catalogue Numbers for allowed figures
var checkCatGroup = [];
var activeRules = false;   // Are rules active? If so, is object {description: ,logo:}
var infoCheck = [];        // Seq info fields to be filled out when saving or printing
var figureLetters = '';    // Letters that can be assigned to individual figures
var additionalFig = { 'max': 0, 'totalK': 0 };    // Additional figures, max and K
var ruleSuperFamily = [];  // Array of rules for determining figure SF

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
kPwrd   : the powered K factor for each figure
kGlider : the glider K factor for each figure
kRules  : the rule based K factor for each figure (overruling!)
draw    : the drawing instructions for each figure
group   : to which group every figure belongs
unknownFigureLetter : the figure letter, if applicable
*/
let fig = [];
// arestiToFig holds all fig index numbers under key of Aresti number
const arestiToFig = {};
// rulesKFigures holds Aresti numbers of figures that had K changed in rules
let rulesKFigures = {};

// fuFig is similar to fig, holding figures for the Free (Un)known Designer
const fuFig = {};

// figBaseLookup holds the same data as fig.base, but with the base as
// key and corresponding figure(s) as an array for fast lookup
var figBaseLookup = [];
// figGroup holds the figure group data
var figGroup = [];
// rollFig wild hold all rolls as objects, key = rollBase
var rollFig = {};
// rollArestiToFig holds all rollBase values under key of Aresti number
var rollArestiToFig = {};
// alertMsgs will hold any alerts about figures and the sequence
var alertMsgs = [];
// alertMsgsRules will hold the Rulebook reference for alerts
var alertMsgRules = {};
// errors is used for tracking startup errors
var errors = [];

/**************************************************************
 *
 *           FUNCTIONS
 *
 *************************************************************/

/************************************************
 * 
 * Basic and I/O functions
 * 
 ************************************************/

// Use $ for document.getElementById. Saves around 20kB and improves readability
const $ = id => document.getElementById(id);

/*
 * steganography.js v1.0.3 2017-09-22
 *
 * Copyright (C) 2012 Peter Eigenschink (http://www.peter-eigenschink.at/)
 * Dual-licensed under MIT and Beerware license.
*/
(function (name, context, factory) {
    // Supports UMD. AMD, CommonJS/Node.js and browser context
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        context[name] = factory();
    }
})("steg", this, () => {
    var Cover = function Cover() { };
    var util = {
        "isPrime": function (n) {
            if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
            if (n % 2 === 0) return (n === 2);
            if (n % 3 === 0) return (n === 3);
            var m = Math.sqrt(n);
            for (let i = 5; i <= m; i += 6) {
                if (n % i === 0) return false;
                if (n % (i + 2) === 0) return false;
            }
            return true;
        },
        "findNextPrime": function (n) {
            for (let i = n; true; i += 1)
                if (util.isPrime(i)) return i;
        },
        "sum": function (func, end, options) {
            var sum = 0;
            options = options || {};
            for (let i = options.start || 0; i < end; i += (options.inc || 1))
                sum += func(i) || 0;

            return (sum === 0 && options.defValue ? options.defValue : sum);
        },
        "product": function (func, end, options) {
            var prod = 1;
            options = options || {};
            for (let i = options.start || 0; i < end; i += (options.inc || 1))
                prod *= func(i) || 1;

            return (prod === 1 && options.defValue ? options.defValue : prod);
        },
        "createArrayFromArgs": function (args, index, threshold) {
            var ret = new Array(threshold - 1);
            for (let i = 0; i < threshold; i += 1)
                ret[i] = args(i >= index ? i + 1 : i);

            return ret;
        },
        "loadImg": function (url) {
            var image = new Image();
            image.src = url;
            return image;
        }
    };

    Cover.prototype.config = {
        "t": 3,
        "threshold": 1,
        "codeUnitSize": 16,
        "args": function (i) { return i + 1; },
        "messageDelimiter": function (modMessage, threshold) {
            var delimiter = new Array(threshold * 3);
            for (let i = 0; i < delimiter.length; i += 1)
                delimiter[i] = 255;

            return delimiter;
        },
        "messageCompleted": function (data, ithreshold) {
            var done = true;
            for (let j = 0; j < 16 && done; j += 1) {
                done = done && (data[i + j * 4] === 255);
            }
            return done;
        }
    };
    Cover.prototype.getHidingCapacity = function (image, options) {
        options = options || {};
        var config = this.config;

        var width = options.width || image.width,
            height = options.height || image.height,
            t = options.t || config.t,
            codeUnitSize = options.codeUnitSize || config.codeUnitSize;
        return t * width * height / codeUnitSize >> 0;
    };
    Cover.prototype.encode = function (message, image, options) {
        // Handle image url
        if (image.length) {
            image = util.loadImg(image);
        } else if (image.src) {
            image = util.loadImg(image.src);
        } else if (!(image instanceof HTMLImageElement)) {
            throw new Error('IllegalInput: The input image is neither an URL string nor an image.');
        }

        options = options || {};
        var config = this.config;

        var t = options.t || config.t,
            threshold = options.threshold || config.threshold,
            codeUnitSize = options.codeUnitSize || config.codeUnitSize,
            prime = util.findNextPrime(Math.pow(2, t)),
            args = options.args || config.args,
            messageDelimiter = options.messageDelimiter || config.messageDelimiter;

        if (!t || t < 1 || t > 7) throw new Error('IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8');

        var shadowCanvas = document.createElement('canvas'),
            shadowCtx = shadowCanvas.getContext('2d');

        shadowCanvas.style.display = 'none';
        shadowCanvas.width = options.width || image.width;
        shadowCanvas.height = options.height || image.height;
        if (options.height && options.width) {
            shadowCtx.drawImage(image, 0, 0, options.width, options.height);
        } else {
            shadowCtx.drawImage(image, 0, 0);
        }

        var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
            data = imageData.data;

        // bundlesPerChar ... Count of full t-bit-sized bundles per Character
        // overlapping ... Count of bits of the currently handled character which are not handled during each run
        // dec ... UTF-16 Unicode of the i-th character of the message
        // curOverlapping ... The count of the bits of the previous character not handled in the previous run
        // mask ... The raw initial bitmask, will be changed every run and if bits are overlapping
        var bundlesPerChar = codeUnitSize / t >> 0,
            overlapping = codeUnitSize % t,
            modMessage = [],
            decM, oldDec, oldMask, left, right,
            dec, curOverlapping, mask;

        var i, j;
        for (i = 0; i <= message.length; i += 1) {
            dec = message.charCodeAt(i) || 0;
            curOverlapping = (overlapping * i) % t;
            if (curOverlapping > 0 && oldDec) {
                // Mask for the new character, shifted with the count of overlapping bits
                mask = Math.pow(2, t - curOverlapping) - 1;
                // Mask for the old character, i.e. the t-curOverlapping bits on the right
                // of that character
                oldMask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -curOverlapping));
                left = (dec & mask) << curOverlapping;
                right = (oldDec & oldMask) >> (codeUnitSize - curOverlapping);
                modMessage.push(left + right);

                if (i < message.length) {
                    mask = Math.pow(2, 2 * t - curOverlapping) * (1 - Math.pow(2, -t));
                    for (j = 1; j < bundlesPerChar; j += 1) {
                        decM = dec & mask;
                        modMessage.push(decM >> (((j - 1) * t) + (t - curOverlapping)));
                        mask <<= t;
                    }
                    if ((overlapping * (i + 1)) % t === 0) {
                        mask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -t));
                        decM = dec & mask;
                        modMessage.push(decM >> (codeUnitSize - t));
                    }
                    else if (((((overlapping * (i + 1)) % t) + (t - curOverlapping)) <= t)) {
                        decM = dec & mask;
                        modMessage.push(decM >> (((bundlesPerChar - 1) * t) + (t - curOverlapping)));
                    }
                }
            }
            else if (i < message.length) {
                mask = Math.pow(2, t) - 1;
                for (j = 0; j < bundlesPerChar; j += 1) {
                    decM = dec & mask;
                    modMessage.push(decM >> (j * t));
                    mask <<= t;
                }
            }
            oldDec = dec;
        }

        // Write Data
        var offset, index, subOffset, delimiter = messageDelimiter(modMessage, threshold),
            q, qS;
        for (offset = 0; (offset + threshold) * 4 <= data.length && (offset + threshold) <= modMessage.length; offset += threshold) {
            qS = [];
            for (i = 0; i < threshold && i + offset < modMessage.length; i += 1) {
                q = 0;
                for (j = offset; j < threshold + offset && j < modMessage.length; j += 1)
                    q += modMessage[j] * Math.pow(args(i), j - offset);
                qS[i] = (255 - prime + 1) + (q % prime);
            }
            for (i = offset * 4; i < (offset + qS.length) * 4 && i < data.length; i += 4)
                data[i + 3] = qS[(i / 4) % threshold];

            subOffset = qS.length;
        }
        // Write message-delimiter
        for (index = (offset + subOffset); index - (offset + subOffset) < delimiter.length && (offset + delimiter.length) * 4 < data.length; index += 1)
            data[(index * 4) + 3] = delimiter[index - (offset + subOffset)];
        // Clear remaining data
        for (i = ((index + 1) * 4) + 3; i < data.length; i += 4) data[i] = 255;

        imageData.data = data;
        shadowCtx.putImageData(imageData, 0, 0);

        return shadowCanvas.toDataURL();
    };

    Cover.prototype.decode = function (image, options) {
        // Handle image url
        if (image.length) {
            image = util.loadImg(image);
        } else if (image.src) {
            image = util.loadImg(image.src);
        } else if (!(image instanceof HTMLImageElement)) {
            throw new Error('IllegalInput: The input image is neither an URL string nor an image.');
        }

        options = options || {};
        var config = this.config;

        var t = options.t || config.t,
            threshold = options.threshold || config.threshold,
            codeUnitSize = options.codeUnitSize || config.codeUnitSize,
            prime = util.findNextPrime(Math.pow(2, t)),
            args = options.args || config.args,
            messageCompleted = options.messageCompleted || config.messageCompleted;

        if (!t || t < 1 || t > 7) throw new Error('IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8');

        var shadowCanvas = document.createElement('canvas'),
            shadowCtx = shadowCanvas.getContext('2d');

        shadowCanvas.style.display = 'none';
        shadowCanvas.width = options.width || image.width;
        shadowCanvas.height = options.width || image.height;
        if (options.height && options.width) {
            shadowCtx.drawImage(image, 0, 0, options.width, options.height);
        } else {
            shadowCtx.drawImage(image, 0, 0);
        }

        var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
            data = imageData.data,
            modMessage = [],
            q;

        var i, k, done;
        if (threshold === 1) {
            for (i = 3, done = false; !done && i < data.length && !done; i += 4) {
                done = messageCompleted(data, i, threshold);
                if (!done) modMessage.push(data[i] - (255 - prime + 1));
            }
        }

        var message = "", charCode = 0, bitCount = 0, mask = Math.pow(2, codeUnitSize) - 1;
        for (i = 0; i < modMessage.length; i += 1) {
            charCode += modMessage[i] << bitCount;
            bitCount += t;
            if (bitCount >= codeUnitSize) {
                message += String.fromCharCode(charCode & mask);
                bitCount %= codeUnitSize;
                charCode = modMessage[i] >> (t - bitCount);
            }
        }
        if (charCode !== 0) message += String.fromCharCode(charCode & mask);

        return message;
    };

    return new Cover();
});

/*! sprintf-js | Alexandru Marasteanu <hello@alexei.ro> (http://alexei.ro/) | BSD-3-Clause */

!function (a) { function b() { var a = arguments[0], c = b.cache; return c[a] && c.hasOwnProperty(a) || (c[a] = b.parse(a)), b.format.call(null, c[a], arguments) } function c(a) { return Object.prototype.toString.call(a).slice(8, -1).toLowerCase() } function d(a, b) { return Array(b + 1).join(a) } var e = { not_string: /[^s]/, number: /[dief]/, text: /^[^\x25]+/, modulo: /^\x25{2}/, placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fiosuxX])/, key: /^([a-z_][a-z_\d]*)/i, key_access: /^\.([a-z_][a-z_\d]*)/i, index_access: /^\[(\d+)\]/, sign: /^[\+\-]/ }; b.format = function (a, f) { var g, h, i, j, k, l, m, n = 1, o = a.length, p = "", q = [], r = !0, s = ""; for (h = 0; o > h; h++)if (p = c(a[h]), "string" === p) q[q.length] = a[h]; else if ("array" === p) { if (j = a[h], j[2]) for (g = f[n], i = 0; i < j[2].length; i++) { if (!g.hasOwnProperty(j[2][i])) throw new Error(b("[sprintf] property '%s' does not exist", j[2][i])); g = g[j[2][i]] } else g = j[1] ? f[j[1]] : f[n++]; if ("function" == c(g) && (g = g()), e.not_string.test(j[8]) && "number" != c(g) && isNaN(g)) throw new TypeError(b("[sprintf] expecting number but found %s", c(g))); switch (e.number.test(j[8]) && (r = g >= 0), j[8]) { case "b": g = g.toString(2); break; case "c": g = String.fromCharCode(g); break; case "d": case "i": g = parseInt(g, 10); break; case "e": g = j[7] ? g.toExponential(j[7]) : g.toExponential(); break; case "f": g = j[7] ? parseFloat(g).toFixed(j[7]) : parseFloat(g); break; case "o": g = g.toString(8); break; case "s": g = (g = String(g)) && j[7] ? g.substring(0, j[7]) : g; break; case "u": g >>>= 0; break; case "x": g = g.toString(16); break; case "X": g = g.toString(16).toUpperCase() }!e.number.test(j[8]) || r && !j[3] ? s = "" : (s = r ? "+" : "-", g = g.toString().replace(e.sign, "")), l = j[4] ? "0" === j[4] ? "0" : j[4].charAt(1) : " ", m = j[6] - (s + g).length, k = j[6] && m > 0 ? d(l, m) : "", q[q.length] = j[5] ? s + g + k : "0" === l ? s + k + g : k + s + g } return q.join("") }, b.cache = {}, b.parse = function (a) { for (var b = a, c = [], d = [], f = 0; b;) { if (null !== (c = e.text.exec(b))) d[d.length] = c[0]; else if (null !== (c = e.modulo.exec(b))) d[d.length] = "%"; else { if (null === (c = e.placeholder.exec(b))) throw new SyntaxError("[sprintf] unexpected placeholder"); if (c[2]) { f |= 1; var g = [], h = c[2], i = []; if (null === (i = e.key.exec(h))) throw new SyntaxError("[sprintf] failed to parse named argument key"); for (g[g.length] = i[1]; "" !== (h = h.substring(i[0].length));)if (null !== (i = e.key_access.exec(h))) g[g.length] = i[1]; else { if (null === (i = e.index_access.exec(h))) throw new SyntaxError("[sprintf] failed to parse named argument key"); g[g.length] = i[1] } c[2] = g } else f |= 2; if (3 === f) throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported"); d[d.length] = c } b = b.substring(c[0].length) } return d }; var f = function (a, c, d) { return d = (c || []).slice(0), d.splice(0, 0, a), b.apply(null, d) }; "undefined" != typeof exports ? (exports.sprintf = b, exports.vsprintf = f) : (a.sprintf = b, a.vsprintf = f, "function" == typeof define && define.amd && define(function () { return { sprintf: b, vsprintf: f } })) }("undefined" == typeof window ? this : window);

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

var saveAs = saveAs || (function (view) {
    // IE <10 is explicitly unsupported
    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
        doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
        , get_URL = function () {
            return view.URL || view.webkitURL || view;
        }
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = "download" in save_link
        , click = function (node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        }
        , is_safari = /constructor/i.test(view.HTMLElement)
        , is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent)
        , throw_outside = function (ex) {
            (view.setImmediate || view.setTimeout)(function () {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        , arbitrary_revoke_timeout = 1000 * 40 // in ms
        , revoke = function (file) {
            var revoker = function () {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        }
        , dispatch = function (filesaver, event_types, event) {
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
        , auto_bom = function (blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
            }
            return blob;
        }
        , FileSaver = function (blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var
                filesaver = this
                , type = blob.type
                , force = type === force_saveable_type
                , object_url
                , dispatch_all = function () {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                , fs_error = function () {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if (!popup) view.location.href = url;
                            url = undefined; // release reference before dispatching
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
                setTimeout(function () {
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
        , saveAs = function (blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        }
        ;
    // IE 10+ (native saveAs)
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function (blob, name, no_auto_bom) {
            name = name || blob.name || "download";

            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
        };
    }

    FS_proto.abort = function () { };
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
    define([], () => {
        return saveAs;
    });
}

// Nodelist.forEach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// HTMLCanvasElement.toBlob() polyfill
// Needed for Microsoft Edge 2020
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));
        }
    });
}

// findLastIndex polyfill
if (!Array.prototype.findLastIndex) {
    Object.defineProperty(Array.prototype, 'findLastIndex', {
        value: function (f) { return this.length - 1 - [...this].reverse().findIndex(f); }
    });
}

/**************************************************************
 *
 * Cordova functions
 *
 *************************************************************/

// cordovaHandleOpenURL handles opening a sequence file as received from
// URL (iOS)
function cordovaHandleOpenURL(url) {
    window.resolveLocalFileSystemURI(
        url,
        function (fileEntry) {
            fileEntry.file(
                function (file) {
                    openFile(file, 'Sequence');
                },
                function (error) {
                    console.log(error);
                }
            )
        },
        function (error) {
            console.log(error);
        }
    )
}

// cordovaHandleIntent handles opening a sequence file as received from
// Intent (Android)
function cordovaHandleIntent(intent) {	// intent.action android.intent.action.MAIN
    if (intent.hasOwnProperty('data')) {
        window.FilePath.resolveNativePath(intent.data, function (path) {
            window.resolveLocalFileSystemURL(path, function (fileEntry) {
                fileEntry.file(function (file) {
                    openFile(file, 'Sequence');
                });
            });
        }, function (error) {
            if (platform.android) {
                window.plugins.webintent.getUri(
                    function (uri) {
                        if (uri.match(/^https:\/\/openaero.net\/\?s=/)) {
                            launchURL({ url: uri });
                        } else alertBox(userText.saveDeviceFirst);
                    }
                );
            } else alertBox(userText.saveDeviceFirst);
        });
    } /*else {
		window.FilePath.resolveNativePath(intent.clipItems[0].uri, function(path) {
			console.log(path);
			openFile(path, 'Sequence');
		}, function(error) {console.log(error)});
	}*/
}

// cordovaSave uses the socialsharing plugin to provide options for
// saving/exporting a file
function cordovaSave(blob, filename) {
    // use socialsharing to save or send file through dataURL.
    var reader = new FileReader();
    reader.onload = function (evt) {
        var options = {
            subject: filename,
            // Add filename to dataURL with df:
            files: [`df:${filename};${evt.target.result}`]
        }
        if ($('addSequenceLink').checked) {
            options.message = `${userText.emailHeader}
                https://openaero.net/?s=${encodeBase64Url(compressSequence(activeSequence.xml))}`;
        }
        window.plugins.socialsharing.shareWithOptions(options);
    }
    reader.readAsDataURL(blob);
}

// cordovaPdf opens a pdf in an external viewer
/* DISABLED DUE TO ANDROID COMPILE ISSUES
function cordovaPdf(uri, title) {
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + '/www/' + uri, function (fileEntry) {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
            fileEntry.copyTo(dirEntry, uri.split('/').pop(), function (newFileEntry) {
                var file = newFileEntry.nativeURL;
                // open file
                cordova.plugins.fileOpener2.open(file, 'application/pdf');
            });
        });
    });
}
*/

/**************************************************************
 *
 * Windows functions
 *
 *************************************************************/

// Open associated .seq file in Windows UWP
if (platform.uwp) {
    Windows.UI.WebUI.WebUIApplication.addEventListener(
        'activated', function (activatedEventArgs) {
            if (activatedEventArgs.kind === Windows.ApplicationModel.Activation.ActivationKind.file) {
                Windows.Storage.FileIO.readTextAsync(activatedEventArgs.files[0])
                    .done(function (text) {
                        loadedSequenceWindows(text, activatedEventArgs.files[0].name);
                    });
            }
        });
}

/************************************************
 * User interface functions
 ************************************************/

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

var iosDragDropShim = {
    enableEnterLeave: true,
    openaero: true,
    copy: true
};

(function (doc) {
    log = noop; // noOp, remove this line to enable debugging

    var coordinateSystemForElementFromPoint;

    function main(config) {
        config = config || {};

        coordinateSystemForElementFromPoint = navigator.userAgent.match(/OS [1-4](?:_\d+)+ like Mac/) ? "page" : "client";

        /** apply patch in relevant cases **/
        var div = doc.createElement('div');
        var dragDiv = 'draggable' in div;
        var evts = 'ondragstart' in div && 'ondrop' in div;
        var needsPatch = !(dragDiv || evts) || /iPad|iPhone|iPod/.test(navigator.userAgent);

        log((needsPatch ? "" : "not ") + "patching html5 drag drop");

        if (!needsPatch) return;

        iosDragDropShim.enabled = true;

        if (!config.enableEnterLeave) {
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
            var newNode = this.el.cloneNode(true);
            this.copy = document.createElement('div');
            this.copy.classList.add('fuSequence');
            if (newNode.tagName === 'TD') {
                // Copied node is a <td>, implying a single FU figure
                var table = document.createElement('table');
                var tr = document.createElement('tr');
                this.copy.appendChild(table).appendChild(tr).appendChild(newNode);
            } else {
                // Copied node is a <table>, implying an FU subsequence
                if (newNode.tagName === 'TABLE') newNode.classList.add('dragDropCopy');
                this.copy.appendChild(newNode);
            }
            doc.body.appendChild(this.copy);
            var copyPos = this.copy.getBoundingClientRect();

            writeTransform(this.copy, origPos.left - copyPos.left, origPos.top - copyPos.top);
        }

        event.preventDefault();

        log("dragstart");

        this.dispatchDragStart();
        this.elTranslation = readTransform(this.copy);
        this.listen()
    }

    DragDrop.prototype = {
        listen: function () {
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
                    doc.body.removeChild(e.copy);
                    e.copy = null;
                }
                return [move, end, cancel].forEach(function (handler) {
                    return handler.off();
                });
            }
        },
        move: function (event) {
            var deltas = { x: [], y: [] };

            [].forEach.call(event.changedTouches, function (touch, index) {
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
        synthesizeEnterLeave: function (event) {
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
        dragend: function (event) {
            // we'll dispatch drop if there's a target, then dragEnd. If drop
            // isn't fired or isn't cancelled, we'll snap back
            // drop comes first http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#drag-and-drop-processing-model
            log("dragend");

            if (this.lastEnter) {
                this.dispatchLeave(event);
            }

            var target = elementFromTouchEvent(this.copy ? this.copy : this.el, event);

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
        dispatchDrop: function (target, event) {
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
                getData: function (type) {
                    return this.dragData[type];
                }.bind(this)
            };
            dropEvt.preventDefault = function () {
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

            once(doc, "drop", () => {
                log("drop event not canceled");
                if (snapBack) this.snapBack();
            }, this);

            if (this.copy) {
                log('removing copy');
                doc.body.removeChild(this.copy);
                this.copy = null;
            }

            target.dispatchEvent(dropEvt);
        },
        dispatchEnter: function (event) {
            var enterEvt = doc.createEvent("Event");
            enterEvt.initEvent("dragenter", true, true);
            enterEvt.dataTransfer = {
                types: this.dragDataTypes,
                getData: function (type) {
                    return this.dragData[type];
                }.bind(this)
            };

            var touch = event.changedTouches[0];
            enterEvt.pageX = touch.pageX;
            enterEvt.pageY = touch.pageY;

            this.lastEnter.dispatchEvent(enterEvt);
        },
        dispatchOver: function (event) {
            var overEvt = doc.createEvent("Event");
            overEvt.initEvent("dragover", true, true);
            overEvt.dataTransfer = {
                types: this.dragDataTypes,
                getData: function (type) {
                    return this.dragData[type];
                }.bind(this)
            };

            var touch = event.changedTouches[0];
            overEvt.pageX = touch.pageX;
            overEvt.pageY = touch.pageY;

            this.lastEnter.dispatchEvent(overEvt);
        },
        dispatchLeave: function (event) {
            var leaveEvt = doc.createEvent("Event");
            leaveEvt.initEvent("dragleave", true, true);
            leaveEvt.dataTransfer = {
                types: this.dragDataTypes,
                getData: function (type) {
                    return this.dragData[type];
                }.bind(this)
            };

            var touch = event.changedTouches[0];
            leaveEvt.pageX = touch.pageX;
            leaveEvt.pageY = touch.pageY;

            this.lastEnter.dispatchEvent(leaveEvt);
            this.lastEnter = null;
        },
        snapBack: function () {
            log('Snap back');
            if (iosDragDropShim.copy) {
                if (this.copy) {
                    doc.body.removeChild(this.copy);
                    this.copy = null;
                }
            } else if (this.el) {
                this.el.style["pointer-events"] = "auto";
                this.el.style["-webkit-transition"] = "none";
                this.el.style["z-index"] = "";
                writeTransform(this.el, 0, 0);
            }
        },
        dispatchDragStart: function () {
            var evt = doc.createEvent("Event");
            evt.initEvent("dragstart", true, true);
            evt.dataTransfer = {
                setData: function (type, val) {
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
            // Check if the element is draggable, or has data-draggable set (for FU figures and subsequences)
            if (el.getAttribute('draggable') === 'true' || el.getAttribute('data-draggable')) {
                evt.preventDefault();
                evt.stopPropagation();
                new DragDrop(evt, el);
            } else if (iosDragDropShim.enabled) {
                if (el.classList.contains('removeFigureButton')) {
                    // event handler is on button
                    evt.preventDefault();
                    return false;
                } else if (el.classList.contains('fuFigure') ||
                    el.classList.contains('fuFigureMulti') ||
                    el.classList.contains('additionalFigure') ||
                    el.classList.contains('additionalFigureMulti')) {
                    evt.preventDefault();
                    selectFigureFu(el.className.match(regexFuFigNr)[1]);
                    return false;
                }
            }
        } while ((el = el.parentNode) && el !== doc.body);
        return true;
    }

    // DOM helpers
    function elementFromTouchEvent(el, event) {
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
        if (match) {
            x = parseInt(match[1], 10);
            y = parseInt(match[2], 10);
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
            off: function () {
                return el.removeEventListener(event, handler);
            }
        };
    }

    function once(el, event, handler, context) {
        if (context) handler = handler.bind(context);
        function listener(evt) {
            handler(evt);
            return el.removeEventListener(event, listener);
        }
        return el.addEventListener(event, listener);
    }

    // general helpers
    function log(msg) {
        console.log(msg);
    }

    function average(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((function (s, v) {
            return v + s;
        }), 0) / arr.length;
    }

    function noop() { }

    main(window.iosDragDropShim);
})(document);
/* end iOS drag & drop support */

/*! iNoBounce - v0.1.5
* https://github.com/lazd/iNoBounce/
* Copyright (c) 2013 Larry Davis <lazdnet@gmail.com>; Licensed BSD */
(function (global) {
    // Stores the Y position where the touch started
    var startTouch = { x: 0, y: 0 };

    // Store enabled status
    var enabled = false;

    var handleTouchmove = function (evt) {
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
                    doPreventDefault = true;
                    // Apply X scroll when applicable
                    if (startTouch.x !== curX) {
                        var dx = startTouch.x - curX;
                        el.scrollLeft += dx;
                        startTouch.x -= dx;
                    }
                } else doPreventDefault = false;

                // continue up the DOM to check for scrollable parents
            }

            // Test the next parent
            el = el.parentNode;
        }

        // Stop the bouncing -- no parents are scrollable
        if (doPreventDefault) evt.preventDefault();
    };

    var handleTouchstart = function (evt) {
        // Store the first X and Y position of the touch
        startTouch.x = evt.touches ? evt.touches[0].screenX : evt.screenX;
        startTouch.y = evt.touches ? evt.touches[0].screenY : evt.screenY;
    };

    var enable = function () {
        // Listen to a couple key touch events
        window.addEventListener('touchstart', handleTouchstart, false);
        window.addEventListener('touchmove', handleTouchmove, { passive: false }); // add {passive: false} to fig iOS 11.3 bug
        enabled = true;
    };

    var disable = function () {
        // Stop listening
        window.removeEventListener('touchstart', handleTouchstart, false);
        window.removeEventListener('touchmove', handleTouchmove);
        enabled = false;
    };

    var isEnabled = function () {
        return enabled;
    };

    // Enable by default if the browser supports -webkit-overflow-scrolling
    // Test this by setting the property with JavaScript on an element that exists in the DOM
    // Then, see if the property is reflected in the computed style
    var testDiv = document.createElement('div');
    document.documentElement.appendChild(testDiv);
    testDiv.style.WebkitOverflowScrolling = 'touch';
    var scrollSupport = 'getComputedStyle' in window && window.getComputedStyle(testDiv)['-webkit-overflow-scrolling'] === 'touch';
    testDiv.remove();

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
        (function (define) {
            define('iNoBounce', [], () => { return iNoBounce; });
        }(global.define));
    }
    else {
        // Browser support
        global.iNoBounce = iNoBounce;
    }
}(this));
/* end iNoBounce.js */

// removeChildNodes removes all childNodes from a DOM element
function removeChildNodes(container) {
    while (container.childNodes.length) {
        container.lastChild.remove();
    }
}

// switchSmallMobile switches between smallMobile and regular layout
function switchSmallMobile() {
    hideFigureSelector(); /* to prevent leftBlock from being invisible */
    saveSettingsStorage();
    platform.smallMobile = !platform.smallMobile;
    // select no figure
    if (selectedFigure.id !== null) selectFigure(false);
    // load CSS depending on smallMobile, largeMobile or desktop version
    var link = $('desktopLargeMobileCSS');
    var svg = $('sequenceArea');
    if (platform.smallMobile) {

        // set smallMobile css
        link.setAttribute('href', 'css/smallMobile.css');

        // update folowing parts of interface when not in Free Unknown Designer
        if (activeForm != 'FU') {
            // show sequence tab
            $('tab-sequenceArea').classList.remove('noDisplay');
            // hide sequence svg and move to before fuFigures
            svg.classList.add('hidden');
            var fuFigures = $('fuFigures');
            fuFigures.parentNode.insertBefore(svg, fuFigures);
            // move grid column setting to settings
            $('t_gridView').parentNode.appendChild($('gridColumnsContainer'));
            // move figureSelector to previous sibling of main
            $('main').parentNode.insertBefore(
                $('figureSelector'),
                $('main'));
        }
        // lock orientation in portrait on Cordova
        if (window.screen.orientation && window.screen.orientation.lock) {
            window.screen.orientation.lock('portrait');
        } else if (window['cordova'] && window['cordova'].plugins && window['cordova'].plugins.screenorientation) {
            window['cordova'].plugins.screenorientation.setOrientation('portrait');
        }
    } else {
        if (window.screen.orientation && window.screen.orientation.unlock) {
            window.screen.orientation.unlock();
        } else if (window['cordova'] && window['cordova'].plugins && window['cordova'].plugins.screenorientation) {
            window['cordova'].plugins.screenorientation.setOrientation('any');
        }

        $('t_fuDesigner').parentNode.classList.remove('noDisplay');
        link.setAttribute('href', 'css/desktop-largeMobile.css');

        // hide sequence tab
        $('tab-sequenceArea').classList.add('noDisplay');

        // restore sequence container
        svg.removeAttribute('style');
        svg.classList.remove('hidden');
        $('sequenceAreaPlacing').parentNode.insertBefore(svg, $('sequenceAreaPlacing'));

        // move grid column setting to grid info
        $('gridInfoContents').insertBefore(
            $('gridColumnsContainer'), $('gridInfoContents').firstChild
        );

        selectTab('tab-sequenceInfo');

        // move figureSelector to previous sibling of main
        $('main').insertBefore($('figureSelector'), $('main').firstChild);

        // show mini form A
        miniFormA = true;

        checkSequenceChanged();
    }
    // set correctly sized plus min elements
    addPlusMinElements();
    // set undo/redo button size
    setUndoRedo();
    // clear all figure chooser svgs
    fig.forEach ((f) => { if (f) delete f.svg });
    setFormLayout(activeForm);
    // redraw sequence
    draw();
    // Activate the first figure selection group
    changeFigureGroup();
}

// mobileInterface adjusts interface for mobile devices
function mobileInterface() {
    $('desktopCSS').setAttribute('href', 'css/mobile.css');

    // update menu
    var topBlock = $('topBlock');
    var mainMenu = $('mainMenu');
    topBlock.parentNode.insertBefore(mainMenu, topBlock);

    // move some Tools menu items to main and hide Tools menu
    $('menu').insertBefore(
        $('t_fuDesigner').parentNode,
        $('menuHelp')
    );
    $('t_fuDesigner').parentNode.classList.remove('divider');
    $('menu').insertBefore(
        $('settings'),
        $('menuHelp')
    );
    $('settings').classList.remove('divider');
    $('menuTools').classList.add('noDisplay');

    // move Free (Un)known Designer finalize button
    $('topBlock').insertBefore(
        $('t_finalizeSequence'),
        $('undoRedo').nextSibling);

    // update header for mobile menus
    mobileMenuHeader();

    // set rightArrow for all submenus
    var menuNodes = $('menu').childNodes;
    for (let i = 0; i < menuNodes.length; i++) {
        if (menuNodes[i].tagName) {
            var ul = menuNodes[i].getElementsByTagName('UL');
            if (ul.length > 0) {
                var iNode = document.createElement('i');
                iNode.setAttribute('class', 'material-icons rightArrow');
                menuNodes[i].insertBefore(iNode, ul[0]);
            }
        }
    }

    // disable or change some items for iOS
    if (platform.ios) {
        // hide all save options, except on Cordova app
        if (!platform.cordova) {
            $('t_saveSequence').parentNode.classList.add('noDisplay');
            $('t_saveFigsSeparate').parentNode.classList.add('noDisplay');
            $('t_saveQueueFile').parentNode.classList.add('noDisplay');
        } else {
            // update save/print dialog for Cordova
            $('t_printSavePdf').classList.add('noDisplay');
            $('t_print').classList.remove('noDisplay');
            $('t_savePdf').classList.remove('noDisplay');
        }

        $('t_saveAsSVG').classList.add('noDisplay');

        // print margins
        $('saveImageVariables').parentNode.classList.remove('divider');
        $('printMargins').classList.add('noDisplay');

        // fix leftblock scroll bug
        var leftBlock = $('leftBlockContainer');
        leftBlock.style.height = '1px';
        setTimeout(function () { leftBlock.style.removeProperty('height'); }, 200);
    }
}

// menuMobileHeader updates mobile menu header items
function mobileMenuHeader() {

    function addHeader(menu) {
        menu.childNodes.forEach (node => {
            if (/^li$/i.test(node.tagName)) {
                // copy menu title from previous menu
                const ul = node.getElementsByTagName('UL')[0];
                if (ul) {
                    if (ul.getElementsByClassName('menuHeader')[0]) {
                        ul.removeChild(ul.getElementsByClassName('menuHeader')[0]);
                    }
                    const li = document.createElement('li');
                    li.classList.add('menuHeader');
                    li.innerHTML = `<span class="previousMenu"><i class="material-icons leftArrow"></i>${(menu === $('menu')) ? 'Menu' :
                        node.parentNode.parentNode.getElementsByTagName('SPAN')[0].innerHTML}</span><span class="currentMenu">${ul.parentNode.getElementsByTagName('SPAN')[0].innerHTML}</span>`;
                    ul.insertBefore(li, ul.firstChild);
                    li.firstChild.addEventListener('mousedown', function (e) {
                        this.parentNode.parentNode.parentNode.classList.remove('active');
                        e.stopPropagation();
                    });
                    addHeader(ul);
                }
            }
        });
    }

    addHeader($('menu'));
}

// panelHeader sets correct panel header for expanded or collapsed panel
function panelHeader(el, empty) {
    var grandPa = el.parentNode.parentNode;
    if (grandPa.classList.contains('expanded')) {
        el.innerText = '';
    } else {
        var
            inputs = grandPa.getElementsByClassName('panelHeader'),
            values = [];
        for (let i = 0; i < inputs.length; i++) {
            // add input values
            if ((inputs[i].tagName === 'SELECT') && userText[inputs[i].value]) {
                values.push(userText[inputs[i].value]);
            } else {
                // use non-breaking spaces to keep input values together
                values.push(inputs[i].value.replace(/ /, "\u00A0"));
            }
        }
        el.innerText = values.join(' ').trim() || empty || '';
    }
}

// menuActive and menuInactive show and remove top menus on mouseover
function menuActive() {
    if (this.id === 'hamburgerMenu') {
        var menu = $('mainMenu');
        if (menu.classList.contains('active')) {
            menuInactiveAll();
        } else {
            this.classList.add('active');
            menu.classList.add('active');
            document.body.classList.add('menuOpen');
            window.scrollTo(0, 0);
        }
    } else {
        this.classList.add('active');
        this.parentNode.scrollTop = 0;
    }
}

function menuInactive(el) {
    if (el.classList) {
        el.classList.remove('active');
    } else {
        this.classList.remove('active');
    }
}

// menuTouch deactivates menu when called
function menuTouch() {
    var node = this;
    // add a delay to make sure the menu item gets activated
    setTimeout(function () {
        while (node && node.classList.contains('active')) {
            menuInactive(node);
            node = node.parentNode.parentNode;
            document.body.classList.remove('menuOpen');
        }
    }, 200);
}

// menuInactiveAll hides all active menus
function menuInactiveAll() {
    var menu = $('mainMenu');
    if (!menu) return;
    menu.classList.remove('active');

    var el = menu.getElementsByClassName('active');
    for (let i = el.length - 1; i >= 0; i--) {
        el[i].classList.remove('active');
    }

    document.body.classList.remove('menuOpen');
}

// newSvg creates a new, minimal svg
function newSvg() {
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("version", "1.2");
    svg.setAttribute("baseProfile", "basic");
    prepareSvg(svg);
    return svg;
}

// rebuildSequenceSvg deletes and recreates the svg that holds the sequence
// SVGRoot is a global SVG object
function rebuildSequenceSvg() {
    // Save the current width and height to prevent "blinking"
    // while building the new sequence svg
    let width, height;
    if (SVGRoot) {
        width = SVGRoot.getAttribute('width');
        height = SVGRoot.getAttribute('height');
    }
    $("sequenceArea").childNodes.forEach(c => {
        if (/svg/i.test(c.tagName)) c.remove();
    });
    SVGRoot = newSvg();
    SVGRoot.setAttribute("xmlns:xlink", xlinkNS);
    SVGRoot.setAttribute("id", "sequenceSvg");
    SVGRoot.setAttribute("viewBox", "0 0 800 600");
    if (width) SVGRoot.setAttribute('width', width);
    if (height) SVGRoot.setAttribute('height', height);
    SVGRoot.setAttribute("viewport-fill", "white");
    // enable figure selection and drag&drop on all forms except A
    if (activeForm != 'A') {
        // set touchDevice actions
        if (platform.touch) {
            SVGRoot.addEventListener('touchstart', grabFigure, false);
            SVGRoot.addEventListener('touchmove', Drag, false);
            SVGRoot.addEventListener('touchend', Drop, false);
        }
        // set mouse actions, also for touchDevice as this may also be a
        // touch enabled browser with mouse
        SVGRoot.addEventListener('mousedown', grabFigure, false);
        SVGRoot.addEventListener('mousemove', Drag, false);
        SVGRoot.addEventListener('mouseup', Drop, false);
    }

    $("sequenceArea").appendChild(SVGRoot);

    // these svg points hold x and y values...
    // very handy, but they do not display on the screen
    TrueCoords = SVGRoot.createSVGPoint();
    GrabPoint = SVGRoot.createSVGPoint();
}

// prepareSvg clears a provided svg and prepares it for figure addition
function prepareSvg(svg) {
    removeChildNodes(svg);
    var group = document.createElementNS(svgNS, "g")
    group.setAttribute('id', 'sequence');
    svg.appendChild(group);
}

// centerFigure scrolls sequence to approximately center figure given by id
function centerFigure(id) {
    $('sequenceArea').scrollLeft += $('figure'+id).getBoundingClientRect().left +
        $('figure'+id).getBoundingClientRect().width / 2 -
        ($('sequenceArea').getBoundingClientRect().left +
        ($('sequenceArea').getBoundingClientRect().width - 140) / 2);
    $('sequenceArea').scrollTop += $('figure'+id).getBoundingClientRect().top +
        $('figure'+id).getBoundingClientRect().height / 2  -
        ($('sequenceArea').getBoundingClientRect().top +
        $('sequenceArea').getBoundingClientRect().height / 2);
}

/** Dialogs and windows */

// infoBox creates a styled box without any options.
// message contains the HTML text. When false, the box is closed
function infoBox(message, title) {
    // hide all menus
    menuInactiveAll();

    if (message) {
        // show box
        $('infoBox').classList.remove('noDisplay');
        dialogBuildContents('info', message, title);
        /** Code to be used later for building UWP native dialogs. Most of
         * the infoboxes should be progress boxes. See
         * https://docs.microsoft.com/en-us/uwp/api/windows.ui.popups.messagedialog
         * https://docs.microsoft.com/en-gb/windows/uwp/design/controls-and-patterns/progress-controls
            if (platform.uwp) {
                var dialog = new Windows.UI.Popups.MessageDialog (
                    $('infoMessage').innerHTML,
                    $('infoTitle').innerHTML);
                dialog.showAsync ();
            }
            */
    } else {
        $('infoBox').classList.add('noDisplay');
    }
}

// alertBox creates a styled alert box with a 'close' option
// message contains the HTML text. When false, the box is closed
// The buttons object may contain an array of buttons to be added of
// form [{name:xxx, function:yyy}, ...]
function alertBox(message, title, buttons) {
    if (typeof message === "function") message = message();
    // hide all menus
    menuInactiveAll();

    if (message) {
        // show box
        $('alertBox').classList.remove('noDisplay');
        // remove old buttons
        $('t_closeAlert').parentNode.querySelectorAll('.addedButton').forEach(el => el.remove());
        // add new buttons
        if (buttons) for (let i = 0; i < buttons.length; i++) {
            var button = document.createElement('span');
            button.classList.add('textButton', 'addedButton');
            button.innerHTML = userText[buttons[i].name];
            button.addEventListener('mousedown', buttons[i].function);
            $('t_closeAlert').parentNode.insertBefore(button, $('t_closeAlert'));
        }
        dialogBuildContents('alert', message, title);
    } else {
        $('alertBox').classList.add('noDisplay');
    }
}

// confirmBox creates a styled confirm box with 'yes' and 'no' options
// message contains the HTML text. When false, the box is closed
// the callback will be executed after confirm
function confirmBox(message, title, callback) {
    // hide all menus
    menuInactiveAll();

    if (message) {
        // show box
        $('confirmBox').classList.remove('noDisplay');
        dialogBuildContents('confirm', message, title);
        // Remove old event listeners
        $('t_confirmBoxYes').replaceWith($('t_confirmBoxYes').cloneNode(true));
        // Add callback listener
        $('t_confirmBoxYes').addEventListener('mousedown', () => {
            confirmBox();
            callback();
        });
    } else {
        $('confirmBox').classList.add('noDisplay');
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
function dialogBuildContents(boxName, message, title) {
    // Make the title
    if (title && (typeof title === 'object')) {
        title.params = title.params || [];
        title.params.splice(0, 0, userText[title.userText]);
        $(boxName + 'Title').innerHTML =
            sprintf.apply(undefined, title.params);
    } else {
        $(boxName + 'Title').innerHTML = title ? title : '';
    }
    // Make the message
    if (message.userText) {
        message.params = message.params || [];
        message.params.splice(0, 0, userText[message.userText]);
        $(boxName + 'Message').innerHTML =
            sprintf.apply(undefined, message.params);
        // add language chooser, assure correct title formatting
        addLanguageChooser(
            boxName,
            message,
            (typeof title === 'object') ? title : { userText: title, params: [] });
    } else {
        $(boxName + 'Message').innerHTML = message;
    }
}

// addLanguageChooser adds flags to a supplied element to change the
// language. message and title are supplied as:
// {userText: key, params: [userText, param1, param2, ...]}
function addLanguageChooser(boxName, message, title) {
    for (let code in lang) {
        // show flags for languages other than current
        if ($('language').value !== code) {
            var img = document.createElement('img');
            $(boxName + 'Title').appendChild(img);
            img.classList.add('boxTitleFlag');
            img.setAttribute('src', `data:image/png;base64,${flags[code === 'en' ? 'gb' : code]}`);
            img.setAttribute('language', code);
            // add function that will change the language
            img.addEventListener('mousedown', () => {
                // change UI language
                $('language').value = this.getAttribute('language');
                changeLanguage();
                // update dialog box texts and rebuild language chooser
                title.params[0] = userText[title.userText];
                $(boxName + 'Title').innerHTML =
                    sprintf.apply(undefined, title.params);
                message.params[0] = userText[message.userText] +
                    (errors ? `<p>${errors.join('</p><p>')}</p>` : '');
                $(boxName + 'Message').innerHTML =
                    sprintf.apply(undefined, message.params);
                addLanguageChooser(boxName, message, title);
            });
        }
    }
}

// saveDialog shows or hides the save dialog
// when message is false, the dialog is closed
function saveDialog(message, name, ext, param = {}) {
    // hide all menus
    menuInactiveAll();

    if (message) {
        $('saveDialog').classList.remove('noDisplay');
        $('saveFileMessage').innerHTML = message;
        $('dlTextField').value = name;
        $('fileExt').innerHTML = ext;
        if (platform.cordova) {
            $('t_saveFile').innerText = userText.saveShareFile;
        }
        // Don't show sequence link option if param.noSequenceLink is true
        if (param.noSequenceLink) {
            $('saveFileAddSequenceLink').classList.add('hidden');
        } else {
            $('saveFileAddSequenceLink').classList.remove('hidden');
        }
    } else {
        $('saveDialog').classList.add('noDisplay');
    }
}

// printDialog shows or hides the print dialog
// When false, the dialog is closed
function printDialog(show) {
    // hide all menus
    menuInactiveAll();

    $('printNotesCopy').checked = $('printNotes').checked;

    if (show) {
        // Generate QR code. Not needed immediately but it is created asynchronously and may later
        // be added to a pilot card. Generate at twice the pilot card resolution for improved scanning.
        setTimeout(function () {
            $('qrCodeForPrint').innerHTML = '';
            new QRCode(
                $('qrCodeForPrint'),
                {
                    text: `https://openaero.net/?s=${encodeBase64Url(compressSequence(activeSequence.xml))}`,
                    width: 600,
                    height: 600
                }
            );
        }, 10);
        missingInfoCheck(function () {
            setPrintPageSet();
            $('printDialog').classList.remove('noDisplay');
            $('printMulti').classList.add('noDisplay');
            $('printForms').classList.add('content2cols');
            $('printForms').classList.remove('content3cols');
            $('printOptions').classList.add('content2cols');
            $('printOptions').classList.remove('content3cols');
        });
    } else {
        // clear fileList in case we were in printMultiDialog
        fileList = [];
        saveImageSizeAdjust();

        $('printDialog').classList.add('noDisplay');
    }
}

// printMultiDialog shows the print multi file dialog
// Closing is done by printDialog
function printMultiDialog() {
    // hide all menus
    menuInactiveAll();

    // clear the file list
    fileList = [];
    multi.processing = false;
    clearFileListContainer($('fileDropPrintFiles'));

    $('printMultiCurrentRules').innerHTML = activeRules ?
        activeRules.description.replace(/ /g, '&nbsp;') : userText.none;

    setPrintPageSet();
    $('printDialog').classList.remove('noDisplay');
    $('printMulti').classList.remove('noDisplay');
    $('printForms').classList.add('content3cols');
    $('printForms').classList.remove('content2cols');
    $('printOptions').classList.add('content3cols');
    $('printOptions').classList.remove('content2cols');
}

// settingsDialog shows or hides the settings dialog with tab e when supplied
// when false, the dialog is closed
function settingsDialog(e) {
    // hide all menus
    menuInactiveAll();

    if (e) {
        $('settingsDialog').classList.remove('noDisplay');
        // select specific tab if required
        if ($(`tab-${e}`)) selectTab(`tab-${e}`);
    } else {
        $('settingsDialog').classList.add('noDisplay');
    }
}

// referenceSequenceDialog shows or hides the Reference sequence dialog
function referenceSequenceDialog(e) {
    if (e === false) {
        $('referenceSequenceDialog').classList.add('noDisplay');
    } else {
        $('referenceSequenceDialog').classList.remove('noDisplay');
        changeReferenceSequence(true);
    }
}

// proposalsDialog shows or hides the figure group proposals dialog
function proposalsDialog(e) {
    if (e === false) {
        $('createProposalsDialog').classList.add('noDisplay');
    } else {
        $('createProposalsDialog').classList.remove('noDisplay');
        createFigureProposals();
    }
}

// proposalsToGrid loads the proposals from the dialog to the Grid
function proposalsToGrid() {
    sequenceText.innerHTML = $('proposals').textContent.trim();
    proposalsDialog(false);
    checkSequenceChanged(true);
}

// helpWindow will display a window with content from url and title
function helpWindow(url, title) {
    // set a small delay to make sure the menu is not again activated
    setTimeout(menuInactiveAll, 100);

    if (platform.cordova) {
        if (platform.android && /\.pdf$/.test(url)) {
            /* cordovaPdf(url, title); */
        } else {
            var win = cordova.InAppBrowser.open(
                url, '_blank', 'location=no,hardwareback=no,closebuttoncolor=#fb8c00');
            win.addEventListener("loadstop", () => {
                // hide elements with class noCordova
                win.executeScript({
                    code:
                        "var els = document.getElementsByClassName ('noCordova');" +
                        "for (let i = 0; i < els.length; i++) els[i].classList.add ('noDisplay');"
                })
            });
        }
    } else if (platform.mobile && !platform.ios && !/\.pdf$/.test(url)) {
        // for platform.mobile, open inline except for PDF
        $('helpBox').classList.remove('noDisplay');
        $('helpTitle').innerText = title;
        $('helpContent').firstChild.src = url;
    } else if (platform.uwp) {
        var w = window.open(
            url,
            title,
            'menubar=no, scrollbars=yes, status=no, toolbar=no, top=30, width=800'
        );
    } else if (window.navigator.standalone) {
        // create and click <a> for standalone
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.click();
    } else {
        // open new window for all others
        var w = window.open(
            url,
            title,
            'menubar=no, scrollbars=yes, status=no, toolbar=no, top=30, width=800'
        );
    }
}

// aboutDialog will build a complete 'about' dialog. This includes
// version checking
function aboutDialog() {
    function show(stableVersion) {
        var compText = '';
        if (!stableVersion) {
            compText = userText.aboutUnknown;
            stableVersion = '-';
        } else {
            switch (compVersion(version, stableVersion)) {
                case -1:
                    compText = userText.aboutOlder;
                    if (platform.cordova && platform.ios) {
                        compText += userText.aboutOlderIos;
                    } else
                        if (platform.cordova && platform.android) {
                            compText += userText.aboutOlderAndroid;
                        } else
                            if (!window.location.hostname.match(/^(.+\.)?openaero.net$/)) {
                                compText += userText.aboutOlderCopy;
                            } else {
                                compText += userText.aboutOlderCache;
                            }
                    break;
                case 1:
                    compText = userText.aboutNewer;
            }
        }
        alertBox(
            sprintf(userText.aboutText, version, stableVersion.split(' ')[0], compText),
            userText.about);
        $('viewChangelog').addEventListener(
            'mousedown',
            function () { helpWindow('changelog.txt', 'changelog.txt'); });
        $('privacyPolicy').addEventListener(
            'mousedown',
            function () { helpWindow('doc/privacy.html', 'Privacy policy'); });
    }

    getStableVersion(show);
}

/** End dialogs and windows */

// Datalist with combo box polyfill
// The correct values are put in the select list when the box is
// activated by user
function combo(id) {
    var self = this;
    self.inp = $(id);
    /** DISABLED datalist. The autocomplete "feature" causes only rules
     * matching the current value to show. This is not the desired
     * behaviour for these fields.
    */
    if (false && 'options' in document.createElement('datalist')) {
        var datalistId = 'datalist-' + id;
        self.inp.setAttribute('list', datalistId);
        var datalist = document.createElement('datalist');
        datalist.id = datalistId;
        self.inp.parentNode.appendChild(datalist);
        self.inp.onfocus = function () {
            // rebuild the list
            switch (self.inp.id) {
                case 'rules':
                    updateRulesList();
                    break;
                case 'category':
                    updateCategoryList();
                    break;
                case 'program':
                    updateProgramList();
            }
        }
        self.inp.onchange = function () { changeCombo(self.inp.id); };
    } else {
        self.hasfocus = false;
        self.sel = -1;
        self.ul = self.inp.nextSibling;
        while (self.ul.tagName !== 'UL') self.ul = self.ul.nextSibling;
        self.ul.onmouseover = function () {
            self.ul.classList.remove('focused');
        };
        self.ul.onmouseout = function () {
            self.ul.classList.add('focused');
            if (!self.hasfocus) self.ul.style.display = 'none';
        };

        self.inp.onfocus = function () {
            var ul = self.ul;
            ul.style.display = 'block';
            ul.classList.add('focused');
            self.hasfocus = true;
            self.sel = -1;
            // rebuild the list
            switch (ul.id) {
                case 'rulesList':
                    updateRulesList();
                    break;
                case 'categoryList':
                    updateCategoryList();
                    break;
                case 'programList':
                    updateProgramList();
            }
            self.addMouseDown();
        };
        self.inp.onblur = function () {
            if (self.ul.classList.contains('focused')) {
                self.rset(self);
            }
            self.ul.classList.remove('focused');
            self.hasfocus = false;
            changeCombo(self.inp.id);
        };
        self.inp.onkeyup = function (e) {
            var k = e ? e.keyCode : event.keyCode;
            if (k == 40 || k == 13) {
                if (self.sel == self.list.length - 1) {
                    self.sel = -1;
                }
                self.inp.value = self.list[++self.sel].firstChild.data;
                changeCombo(self.inp.id);
            } else if (k == 38 && self.sel > 0) {
                self.inp.value = self.list[--self.sel].firstChild.data;
                changeCombo(self.inp.id);
            }
            return false;
        };
    }
}
// only apply these for polyfill
if (!(false && 'options' in document.createElement('datalist'))) {
    combo.prototype.rset = function (self) {
        self.ul.style.display = 'none';
        self.sel = -1;
        return false;
    }
    combo.prototype.addMouseDown = function () {
        var self = this;
        self.list = self.ul.getElementsByTagName('li');
        for (let i = self.list.length - 1; i >= 0; i--) {
            self.list[i].addEventListener(
                'mousedown',
                function () {
                    self.inp.value = this.firstChild ? this.firstChild.data : '';
                    self.rset(self);
                },
                false
            );
        }
        changeCombo(self.ul.id);
    }
}

// selectTab allows us to select different tabbed pages
// 'e' is either the tab object or a tab id
function selectTab(e) {
    const li = e.target ? this : $(e);
    // make sure we only select tabs
    if (!li.id.match(/^tab-/)) return;
    // check if tabbing in leftBlock, for alertBox slide
    const leftBlock = li.id.match(/^tab-(sequenceInfo|figureInfo|sequenceArea)$/);
    const tab = $(li.id.replace('tab-', ''));
    var rect;
    // unselect all tabs
    li.parentNode.querySelectorAll('li').forEach (l => {
        // only do something when the tab is displayed
        if (!l.classList.contains('noDisplay')) {
            if (leftBlock && l.classList.contains('activeTab')) {
                rect = $(l.id.replace('tab-', '')).getBoundingClientRect();
            }
            l.classList.remove('activeTab');
            l.classList.add('inactiveTab');
            // hide the tab by using display:hidden
            // so any data is still accessible
            var hideTab = $(l.id.replace('tab-', ''));
            if (hideTab) {
                hideTab.classList.add('hidden');
                if (tab.id === 'sequenceArea') {
                    hideTab.classList.add('left');
                } else {
                    hideTab.classList.remove('left');
                }
            }
        }
    });

    // some special changes when in smallMobile fuDesigner
    if (platform.smallMobile && activeForm == 'FU') {
        if (li.id == 'tab-figureInfo') {
            $('leftBlockTabSelector').style.width =
                $('leftBlock').style.width =
                $('leftBlockContainer').style.width =
                $('fuSequence').style.marginLeft = '284px';
        } else {
            $('leftBlockTabSelector').style.width =
                $('leftBlock').style.width =
                $('leftBlockContainer').style.width =
                $('fuSequence').style.marginLeft = '';
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

        function slide(el) {
            el.style.transition = '';
            var dy = (rect.bottom - rect.top) - (newRect.bottom - newRect.top);
            el.style.transform = `translateY(${dy}px)`;
            setTimeout(function () {
                el.style.transition = 'all 0.3s ease-in-out';
                el.style.transform = '';
            }, (dy > 0) ? 300 : 5);
        }

        slide($('alerts'));
        slide($('design'));
    }
}

// updateUserTexts updates all userText in the interface as indicated by
// <span class="userText" id="t_[key]"></span> or another HTML element,
// e.g. <a></a> or <div></div>
// where [key] is the key in userText, e.g. "addingFigure"
function updateUserTexts() {
    var
        language = lang[$('language').value],
        id,
        value,
        els = document.getElementsByClassName('userText');

    // Go over all elements with class userText
    for (let i = 0; i < els.length; i++) {
        id = els[i].id.replace(/^t_/, '');
        // Find the value for the current language
        value = id.split('.').reduce((a, b) => a ? a[b] : false, language);
        // If the value does not exist, fall back to English and add a
        // warning to the console. Helps in creating new translations
        if (!value) {
            console.log(`Key "${id}" missing in language "${$('language').value}"`);
            value = id.split('.').reduce((a, b) => a ? a[b] : false, lang.en) || '';
        }
        els[i].innerHTML = value;
    }

    // Merge the active language over English into userText
    //userText = {...lang.en, ...language};
    [lang.en, language].forEach(e=>Object.assign(userText,e));

    // update userText in rulesWorker
    rulesWorker.postMessage({
        action: 'userText',
        language: $('language').value,
        userText: userText
    });

    // rebuild buttons and tooltips
    buildButtons();
}

/************************************************
 * General functions
 ************************************************/

// uniqueId creates a unique ID by combining millisecond time and random
function uniqueId() {
    return (new Date().getTime() + Math.random().toString().substring(2));
}

// roundTwo returns a number rounded to two decimal places.
// Use for all drawing functions to prevent rendering errors and keep
// SVG file size down
function roundTwo(nr) {
    return parseFloat(parseFloat(nr).toFixed(2));
}

// sanitizeSpaces does:
// transform tabs to spaces, multiple to single spaces and
// remove leading and trailing spaces (when noLT is false)
function sanitizeSpaces(line, noLT) {
    line = line.replace(/[\t]/g, ' ').replace(/\s\s+/g, ' ');
    if (!noLT) line = line.trim();
    return line;
}

// setSequenceSaved sets the sequenceSaved variable to true or false by
// passing through the rules worker to assure any actions there are
// executed first. When setting to true, always wait a while to assure
// any false settings are executed first
function setSequenceSaved(value) {
    var id = uniqueId();
    workerCallback[id] = function () {
        if (value) {
            setTimeout(function () { sequenceSaved = true; }, 200);
        } else sequenceSaved = false;
    }
    rulesWorker.postMessage({ action: false, callbackId: id });
}

// simplifyFigures takes the figures global and returns a leaner version
// for rule checking by Worker
function simplifyFigures() {
    const figs = [];
    figures.forEach ((f) => {
        figs.push({
            additional: f.additional,
            aresti: f.aresti,
            checkLine: f.checkLine,
            entryAtt: f.entryAtt,
            entryDir: f.entryDir,
            exitAtt: f.exitAtt,
            exitDir: f.exitDir,
            k: f.k,
            seqNr: f.seqNr,
            unknownFigureLetter: f.unknownFigureLetter
        });
    });
    return figs;
}

// getSuperFamily returns the superfamily for a category of the figure
// described by an array of Aresti numbers
function getSuperFamily(aresti, category) {

    var superFamily = (activeRules && ruleSuperFamily.length) ?
        // set Super Family from rules when applicable
        ruleSuperFamily :
        // otherwise, check if a matching category is active or default to "advanced"
        (superFamilies[category.toLowerCase()] || superFamilies.advanced);

    for (let i = 0; i < superFamily.length; i++) {
        for (let j = 0; j < aresti.length; j++) {
            if (aresti[j].match(superFamily[i][0])) {
                return superFamily[i][1];
            }
        }
    }
    // return '' when no Super Family is found
    return '';
}

// dirAttToAngle creates an angle to draw from the values for direction
// and attitude. When nof is set to true, yAxisOffset is not applied (used for
// experimental turn perspective).
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToAngle(dir, att, nof=false) {
    dir = (((dir % 360) + 360) % 360) ; // set range [0, 360>
    var dirSin = Math.sin(dir * Math.degToRad);

    // Create offset for the Y-axis, determined by yAxisOffset
    var theta = dir - (nof ? 0 : dirSin * dirSin * (90 - yAxisOffset));

    // No Y-axis correction for pure verticals. This could be changed to a cos^2(att)
    // correction on yAxisOffset above, but would then also affect diagonal lines
    // on Y-axis.
    if ((att == 90) || (att == 270)) {
        theta = ((theta < 90) || (theta > 270)) ? 0 : 180;
    }

    // Check for right or left half, calculate angle and make negative for left half.
    // + 0 is required to prevent -0 values
    if ((theta < 90) || (theta > 270)) {
        var angle = ((theta + att + 360) % 360 + 0) * Math.degToRad;
    } else {
        var angle = ((theta - att - 360) % 360 + 0) * Math.degToRad || -Math.Tau;
    }
    return angle;
}

// changeDir changes Direction global by value
// and checks it stays within 0-359
function changeDir(value) {
    Direction = (((Direction + value) % 360) + 360) % 360;
}

// changeAtt changes Attitude global by value
// and checks it stays within 0-359
function changeAtt(value) {
    Attitude = (((Attitude + value) % 360) + 360) % 360;
    // update goRight for attitude changes. We monitor the exit direction
    // but also the direction through the top or bottom when ending vert.
    // Don't update this time when updateAxisDir is false, used for
    // double bumps
    if (updateAxisDir) {
        if (((Direction % 180) == 0) && (value != 0)) {
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
function changeRollFontSize(s) {
    var regex = new RegExp(`font-size:[ ]*${rollFontSize}px;`);
    rollFontSize = s;
    style.rollText = style.rollText.replace(regex, `font-size: ${rollFontSize}px;`);
}

// myGetBBox accepts an element and returns the bBox for the element and
// bBoxes for it's child elements
function myGetBBox(e) {
    var bBox = e.getBBox();
    // add right, bottom and nodes
    bBox.right = bBox.x + bBox.width;
    bBox.bottom = bBox.y + bBox.height;
    bBox.nodes = [];
    var nodes = e.childNodes;
    for (let i = 0; i < nodes.length; i++) {
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
function drawWind(x, y, signScale, svgEl) {
    svgEl = svgEl || SVGRoot.getElementById('sequence');
    const
        sign = Math.sign(signScale),
        g = document.createElementNS(svgNS, 'g'),
        path = document.createElementNS(svgNS, 'path');

    g.setAttribute('id', 'windArrow');
    path.setAttribute('d',
        'M' + x + ',' + (y + 6) + ' l ' + (-signScale * 90) +
            ',0 l 0,-6 l ' + (-sign * 16) + ',16 l ' + (sign * 16) +
            ',16 l 0,-6 l ' + (signScale * 90) + ',0 z');
    path.setAttribute('style', style.windArrow);
    g.appendChild(path);
    drawText(/^(iac|imac)$/.test(formStyle) ? userText.windIAC : userText.wind,
        x - (signScale * 50), y + 20, 'miniFormA', 'middle', '', g);
    svgEl.appendChild(g);
    return { width: Math.abs(signScale * 90 + sign * 16), height: 32 };
}

// makeFigStart creates figure start marker
function makeFigStart(params) {
    var
        seqNr = params.seqNr,
        first = params.first,
        paths = [],
        angle = dirAttToAngle(Direction, Attitude);

    // Create a marker for possible automatic repositioning of the figure
    // start and applying styles after full definition of figure
    paths.push({ 'figureStart': true });
    // Create the first figure mark if applicable
    var
        refRadius = 11,
        open = Math.PI / 6,
        radius = refRadius;
    // draw numbers in circles when numberInCircle set AND seqNr present
    if (numberInCircle && seqNr && (activeForm != 'A')) {
        if (first && !(/^G/.test(activeForm))) {
            radius = refRadius + 4;
            let
                ax = roundTwo(radius * Math.cos(angle - open)),
                ay = -roundTwo(radius * Math.sin(angle - open)),
                dX = roundTwo(radius * Math.cos(angle + open) - ax),
                dY = roundTwo(-radius * Math.sin(angle + open) - ay);
            paths.push({
                'path': `m ${ax},${ay} a${radius},${radius} 0 1 1 ${dX},${dY}`,
                'style': 'openFigureStartMarker'
            });
        }
        // Make the marker
        radius = refRadius + (seqNr < 10 ? 0 : 1);
        paths.push({
            'path': `m ${-radius},0 a${radius},${radius} 0 1 1 0,0.01`,
            'style': 'openFigureStartMarker'
        });
        // Add the figure number
        if (seqNr) paths.push({
            'text': seqNr,
            'style': seqNr < 10 ? 'figNbr_09' : 'figNbr_10',
            'x': 0,
            'y': 5,
            'text-anchor': 'middle',
            'params': {class: 'figNr'}
        });
        // move the drawing position
        paths.push({
            'dx': Math.cos(angle) * refRadius,
            'dy': - Math.sin(angle) * refRadius
        });
    } else {
        if (first && (activeForm !== 'A') && !(/^G/.test(activeForm))) {
            paths.push({ 'path': 'm 3,-6 a7,7 0 1 1 -6,0', 'style': 'openFigureStartMarker' });
        }
        // Add the figure number, except on Form A
        if (seqNr && (activeForm !== 'A')) {
            paths.push({
                'text': seqNr,
                'style': 'figNbr_09',
                'x': 0,
                'y': -8,
                'text-anchor': 'middle',
                'params': {class: 'figNr'}
            });
        }
        // Make the marker
        paths.push({
            'path': 'm -4,0 a4,4 0 1 1 0,0.01',
            'style': 'figureStartMarker',
            'dx': Math.cos(angle) * 4,
            'dy': - Math.sin(angle) * 4
        });
    }
    paths.push({ 'figureStartEnd': true });
    return paths;
}

// getFigureStartStyle returns a style for the figure start
function getFigureStartStyle(f) {
    // only apply style when editing and not in FU editor
    if (!sequenceEditing || /^[^BC]/.test(activeForm)) return false;

    if (f.unknownFigureLetter) {
        // set "additional" style for figures with letter L
        if (f.unknownFigureLetter == 'L') return 'additional';
        // check all other figures for use of the same letter
        for (let i = 0; i < figures.length; i++) {
            if (figures[i].aresti &&
                figures[i].seqNr != f.seqNr &&
                figures[i].unknownFigureLetter === f.unknownFigureLetter) {
                return 'error';
            }
        }
        // check figures against reference sequence if active
        if (referenceSequence.figures[f.unknownFigureLetter]) {
            var refFig = referenceSequence.figures[f.unknownFigureLetter];
            if (refFig.checkLine !== f.checkLine) {
                return 'error';
            } else if (refFig.entryDir === refFig.exitDir) {
                if (f.entryDir !== f.exitDir) {
                    if (refFig.entryAtt === refFig.exitAtt) {
                        var text = userText.referenceFigureExitSame;
                    } else {
                        var text = userText.referenceFigureExitOpp;
                    }
                    return 'error';
                }
            } else if (refFig.entryDir !== refFig.exitDir) {
                if (f.entryDir === f.exitDir) {
                    if (refFig.entryAtt === refFig.exitAtt) {
                        var text = userText.referenceFigureExitOpp;
                    } else {
                        var text = userText.referenceFigureExitSame;
                    }
                    return 'error';
                }
            }
            return "correct";
        }
    }
}

// makeFigStop creates figure stop
function makeFigStop(lastFig) {
    let
        paths = { style: 'pos' },
        angle = (Direction + 90) * Math.degToRad,
        dx = roundTwo(Math.cos(angle) * lineElement / scale),
        dy = - roundTwo(Math.sin(angle) * lineElement / scale);
    if (lastFig) {
        let
            angle2 = dirAttToAngle(Direction, Attitude),
            dx2 = roundTwo(Math.cos(angle2) * lineElement),
            dy2 = - roundTwo(Math.sin(angle2) * lineElement);
        paths.path = `m ${dx2 + dx * 2},${dy2 + dy * 2} l ${-4 * dx},${-4 * dy}`;
        paths.dx = dx2;
        paths.dy = dy2;
    } else {
        paths.path = `m ${dx},${dy} l ${-2 * dx},${-2 * dy}`;
        paths.dx = paths.dy = 0;
    }
    return [paths];
}

// makeFigSpace creates space after figure
// scaling should not affect movement, so divide by scale
function makeFigSpace(extent) {
    const angle = dirAttToAngle(Direction, Attitude);
    return [{
        'path': '',
        'style': 'neg',
        'dx': roundTwo(Math.cos(angle) * (lineElement / scale) * extent),
        'dy': roundTwo(-Math.sin(angle) * (lineElement / scale) * extent)
    }];
}

// makeVertSpace creates vertical space
// scaling should not affect movement, so divide by scale
function makeVertSpace(extent) {
    return [{
        'path': '',
        'style': 'neg',
        'dx': 0,
        'dy': (lineElement / scale) * extent
    }];
}

// makeLine creates lines
// Params:
// 0: line length
// 1: handle
// 2: style
function makeLine(Params) {
    let
        Extent = Params[0],
        angle = dirAttToAngle(Direction, Attitude),
        dx = roundTwo(Math.cos(angle) * lineElement * Extent),
        dy = - roundTwo(Math.sin(angle) * lineElement * Extent);

    if (((Direction % 180) == 90) && curvePerspective) {
        dx = roundTwo(yAxisScaleFactor * dx);
        if (!((Attitude == 90) || (Attitude == 270))) {
            dy = roundTwo(yAxisScaleFactor * dy);
        }
        if ((Attitude % 90) == 45) {
            angle -= yAxisOffset * Math.degToRad;
            dx = roundTwo(scaleLine.x * Math.cos(angle) * lineElement * Extent);
            if (yAxisOffset > 90) {
                dy = roundTwo((-scaleLine.y * Math.cos(angle) + Math.sin(angle)) * lineElement * Extent);
            } else {
                dy = - roundTwo((scaleLine.y * Math.cos(angle) + Math.sin(angle)) * lineElement * Extent);
            }
            trueDrawingAngle = Math.atan(-dy / dx) + (dx < 0 ? Math.PI : 0);
        }
    } else trueDrawingAngle = angle;
    return [{
        'path': `l ${dx},${dy}`,
        'style': style[Params[2]] ? Params[2] : (NegLoad == 0) ? 'pos' : 'neg',
        'class': 'line',
        'handle': Params[1],
        'dx': dx,
        'dy': dy
    }];
}

// makeMove is similar to makeLine but only moves the pointer and
// creates no lines
function makeMove(Params) {
    const
        Extent = Params[0],
        angle = dirAttToAngle(Direction, Attitude);
    return [{
        'path': '',
        'style': '',
        'dx': roundTwo(Math.cos(angle) * lineElement * Extent),
        'dy': -roundTwo(Math.sin(angle) * lineElement * Extent)
    }];
}

// makeCorner creates sharp corners. Actually it only changes direction,
// no lines are created
function makeCorner(param) {
    // make sure param is an Integer
    param = parseInt(param);
    changeAtt(param);
    NegLoad = (param >= 0) ? 0 : 1;
    return [{
        'path': '',
        'style': (NegLoad == 0) ? 'pos' : 'neg'
    }];
}

// getEllipseParameters gets the ellipse radius and orientation from
// the perspective angle and the Y axis scale factor
function getEllipseParameters(pAngle, yScale) {
    if ((pAngle == 30) && (yScale == 0.7)) {
        return {
            'xRadius': 0.559,
            'yRadius': 1.085,
            'rotAngle': 14.67,
            'hXRadius': 1.184,
            'hYRadius': 0.296,
            'hRotAngle': -9.41
        };
    }
    if (yScale == 1) {
        return {
            'xRadius': Math.sqrt(1 - Math.sin(pAngle * Math.degToRad)),
            'yRadius': Math.sqrt(1 + Math.sin(pAngle * Math.degToRad)),
            'rotAngle': (90 - pAngle) / 2,
            'hXRadius': Math.sqrt(1 + Math.sin((90 - pAngle) * Math.degToRad)),
            'hYRadius': Math.sqrt(1 - Math.sin((90 - pAngle) * Math.degToRad)),
            'hRotAngle': - pAngle / 2
        };
    }
    var a = yScale * Math.cos(pAngle * Math.degToRad);
    var b = yScale * Math.sin(pAngle * Math.degToRad);
    // Parameters for perspective of elements in the vertical plane
    // (loops or loop parts)
    var theta = (Math.PI + Math.atan(-2 * b / (1 - yScale * yScale))) / 2;
    var vOrient = roundTwo(90 - (180 * Math.atan((Math.sin(theta) +
        b * Math.cos(theta)) / (a * Math.cos(theta))) / Math.PI));
    var vRMax = roundTwo(Math.sqrt(Math.pow(a * Math.cos(theta), 2) +
        Math.pow(Math.sin(theta) + b * Math.cos(theta), 2)));
    theta += Math.PI / 2;
    var vRMin = roundTwo(Math.sqrt(Math.pow(a * Math.cos(theta), 2) +
        Math.pow(Math.sin(theta) + b * Math.cos(theta), 2)));
    // Parameters for perspective of elements in the horizontal plane
    // (turns or rolling turns)
    theta = Math.atan(2 * a / (1 - yScale * yScale)) / 2;
    var hRMax = roundTwo(Math.sqrt(Math.pow(Math.cos(theta) +
        a * Math.sin(theta), 2) + Math.pow(b * Math.sin(theta), 2)));
    theta += Math.PI / 2;
    var hRMin = roundTwo(Math.sqrt(Math.pow(Math.cos(theta) +
        a * Math.sin(theta), 2) + Math.pow(b * Math.sin(theta), 2)));
    var hOrient = roundTwo(-90 - 180 * Math.atan((b * Math.sin(theta)) /
        (Math.cos(theta) + a * Math.sin(theta))) / Math.PI);
    // Returns both vertical and horizontal planes parameters
    return {
        'xRadius': vRMin,
        'yRadius': vRMax,
        'rotAngle': vOrient,
        'hXRadius': hRMax,
        'hYRadius': hRMin,
        'hRotAngle': hOrient
    };
}

// dirAttToXYAngle modified from dirAttToAngle to just care about angle
// in a vertical "plan".
// dirAttToAngle creates an angle to draw from the values for direction
// and attitude
// 0 or higher angles mean theta was in the right half, negative angles
// mean theta was in the left half => necessary for correct looping shapes
function dirAttToXYAngle(dir, att) {
    dir = ((dir % 360) + 360) % 360;
    // Create offset for the Y-axis, determined by yAxisOffset
    var theta = (dir < 180) ? 0 : 180;
    // No Y-axis correction for pure verticals
    if ((att == 90) || (att == 270)) {
        theta = ((theta < 90) || (theta > 270)) ? 0 : 180;
    }
    // Check for right or left half, calculate angle and make negative for
    // left half
    if ((theta < 90) || (theta > 270)) {
        var angle = ((theta + att + 360) % 360 + 0) * Math.degToRad;
    } else {
        var angle = ((theta - att - 360) % 360 + 0) * Math.degToRad || -Math.Tau;
    }
    trueDrawingAngle = angle;
    return angle;
}

// makeCurve creates curves of up to 359 degrees
// This is used for all looping shapes
// params is the angle in whole degrees, or an object containing parameters
function makeCurve(params) {
    if (params.angle) {
        var angle = parseInt(params.angle);
    } else {
        var angle = parseInt(params); 
        params = {};
    }

    // Define some variables
    let
        paths = [],
        PullPush = (angle >= 0) ? 0 : 1,
        longCurve = (Math.abs(angle) > 180) ? 1 : 0,
        // Calculate at which angle the curve starts
        radStart = dirAttToAngle(Direction, Attitude),
        radStartXY = dirAttToXYAngle(Direction, Attitude);

    NegLoad = PullPush;

    if (params.style) {
        paths.style = params.style;
    } else {
        paths.style = (NegLoad == 0) ? 'pos' : 'neg';
    }

    changeAtt(angle);

    // Calculate at which angle the curve stops
    var radStop = dirAttToAngle(Direction, Attitude);
    var radStopXY = dirAttToXYAngle(Direction, Attitude);
    // See if we are curving left or right, depending on radStart and PullPush
    var curveRight = (radStart >= 0) ? 0 : 1;
    if (PullPush == 1) curveRight = 1 - curveRight;
    if (curveRight == 0) {
        var dx = (Math.sin(radStop) - Math.sin(radStart)) * curveRadius;
        var dy = (Math.cos(radStop) - Math.cos(radStart)) * curveRadius;
    } else {
        var dx = (Math.sin(radStop + Math.PI) - Math.sin(radStart + Math.PI)) * curveRadius;
        var dy = (Math.cos(radStop + Math.PI) - Math.cos(radStart + Math.PI)) * curveRadius;
    }
    var sweepFlag = curveRight;
    // Make the path and move the cursor
    if (((Direction % 180) == 90) && curvePerspective) {
        var curveRight = (radStartXY >= 0) ? 0 : 1;
        if (PullPush == 1) curveRight = 1 - curveRight;
        dx = yAxisScaleFactor * ((Math.sin(radStopXY) - Math.sin(radStartXY))) * curveRadius;
        dy = (Math.cos(radStopXY) - Math.cos(radStartXY)) * curveRadius;
        if (curveRight == 1) {
            dx = -dx;
            dy = -dy;
        }
        var rotAxisEllipse = roundTwo((yAxisOffset < 90) ? perspectiveParam.rotAngle : -perspectiveParam.rotAngle);
        var xAxisRadius = roundTwo(perspectiveParam.xRadius * curveRadius);
        var yAxisRadius = roundTwo(perspectiveParam.yRadius * curveRadius);
        dy -= dx * Math.sin(yAxisOffset * Math.degToRad);
        dx = dx * Math.cos(yAxisOffset * Math.degToRad);
        paths.path = `a${xAxisRadius},${yAxisRadius} ${rotAxisEllipse} ${longCurve} ${sweepFlag} ${roundTwo(dx)},${roundTwo(dy)}`;
    } else {
        paths.path = `a${curveRadius},${curveRadius} 0 ${longCurve} ${sweepFlag} ${roundTwo(dx)},${roundTwo(dy)}`;
    }
    paths.dx = dx;
    paths.dy = dy;
    return [paths];
}

// makeRollTopLine creates the small lines around rolls in the top
function makeRollTopLine() {
    const
        angle = dirAttToAngle(Direction, Attitude + 90),
        dx = roundTwo(Math.cos(angle) * lineElement075),
        dy = - roundTwo(Math.sin(angle) * lineElement075);
    return [{
        path:   `l ${dx},${dy} l ${-2 * dx},${-2 * dy}`,
        style:  'pos',
        dx:     0,
        dy:     0
    }];
}

// Code for making (rolling) turns
// This has to be changed in the future to improve the look of the code
// For now we keep it like this as it does work

// makeTurnArc creates arc segments for turns and rolling circles.
// Size is in DRAWN rads
function makeTurnArc(rad, startRad, stopRad, paths) {
    startRad = ((startRad % Math.Tau) + Math.Tau) % Math.Tau;
    stopRad = ((stopRad % Math.Tau) + Math.Tau) % Math.Tau;

    var sign = (rad >= 0) ? 1 : -1;

    if (!$('newTurnPerspective').checked) {
        // calculate where we are in the ellipse
        var radEllipse = Math.atan(-1 / (Math.tan(startRad) / flattenTurn));
        // as the atan function only produces angles between -PI/2 and PI/2 we
        // may have to correct for full ellipse range
        if ((startRad > Math.PI) && (startRad < Math.Tau)) {
            radEllipse += Math.PI;
        }
        var startX = Math.cos(radEllipse) * curveRadius;
        var startY = - (Math.sin(radEllipse) * curveRadius * flattenTurn);
        // calculate where we go to in the ellipse
        radEllipse = Math.atan(-1 / (Math.tan(stopRad) / flattenTurn));
        if ((stopRad > Math.PI) && (stopRad < Math.Tau)) {
            radEllipse += Math.PI;
        }
        var
            stopX = Math.cos(radEllipse) * curveRadius,
            stopY = - (Math.sin(radEllipse) * curveRadius * flattenTurn),
            dx = roundTwo(stopX - startX) * sign,
            dy = roundTwo(stopY - startY) * sign,
            sweepFlag = (rad > 0) ? 0 : 1,
            longCurve = (Math.abs(rad) < Math.PI) ? 0 : 1;

        if ((Attitude > 90) && (Attitude < 270)) {
            paths.push({
                'path': `a ${curveRadius},${roundTwo(curveRadius * flattenTurn)} 0 ${longCurve} ${sweepFlag} ${dx},${dy}`,
                'style': 'neg', 'dx': dx, 'dy': dy
            });
        } else {
            paths.push({
                'path': `a ${curveRadius},${roundTwo(curveRadius * flattenTurn)} 0 ${longCurve} ${sweepFlag} ${dx},${dy}`,
                'style': 'pos', 'dx': dx, 'dy': dy
            });
        }
    } else {
        var
            rotAxisEllipse = (yAxisOffset < 90) ? perspectiveParam.rRotAngle : -perspectiveParam.hRotAngle,
            xCurveRadius = roundTwo(perspectiveParam.hXRadius * curveRadius),
            yCurveRadius = roundTwo(perspectiveParam.hYRadius * curveRadius),
            dy = yAxisScaleFactor * (Math.cos(stopRad) - Math.cos(startRad)),
            dx = roundTwo((Math.sin(stopRad) - Math.sin(startRad) - dy * Math.cos(yAxisOffset * Math.degToRad)) * curveRadius) * sign,
            sweepFlag = (rad > 0) ? 0 : 1,
            longCurve = (Math.abs(rad) < Math.PI) ? 0 : 1;

        dy = roundTwo(dy * Math.sin(yAxisOffset * Math.degToRad) * curveRadius) * sign;

        if ((Attitude > 90) && (Attitude < 270)) {
            paths.push({
                'path': `a ${xCurveRadius},${yCurveRadius} ${rotAxisEllipse} ${longCurve} ${sweepFlag} ${dx},${dy}`,
                'style': 'neg', 'dx': dx, 'dy': dy
            });
        } else {
            paths.push({
                'path': `a ${xCurveRadius},${yCurveRadius} ${rotAxisEllipse} ${longCurve} ${sweepFlag} ${dx},${dy}`,
                'style': 'pos', 'dx': dx, 'dy': dy
            });
        }
    }
    return paths;
}

// makeTurnDots creates dotted arc segments for turns and rolling circles.
// Size is in DRAWN rads
function makeTurnDots(rad, startRad, stopRad, paths) {
    startRad = ((startRad % Math.Tau) + Math.Tau) % Math.Tau;
    stopRad = ((stopRad % Math.Tau) + Math.Tau) % Math.Tau;

    var sign = (rad >= 0) ? 1 : -1;
    if (!$('newTurnPerspective').checked) {
        // calculate where we are in the ellipse
        var radEllipse = Math.atan(-1 / (Math.tan(startRad) / flattenTurn));
        // as the atan function only produces angles between -PI/2 and PI/2
        // we may have to correct for full ellipse range
        if ((startRad > Math.PI) && (startRad < Math.Tau)) {
            radEllipse += Math.PI;
        }
        var startX = Math.cos(radEllipse) * curveRadius;
        var startY = - (Math.sin(radEllipse) * curveRadius * flattenTurn);
        // calculate where we go to in the ellipse
        radEllipse = Math.atan(-1 / (Math.tan(stopRad) / flattenTurn));
        if ((stopRad > Math.PI) && (stopRad < Math.Tau)) {
            radEllipse += Math.PI;
        }
        var
            stopX = Math.cos(radEllipse) * curveRadius,
            stopY = - (Math.sin(radEllipse) * curveRadius * flattenTurn),
            dx = roundTwo(stopX - startX) * sign,
            dy = roundTwo(stopY - startY) * sign,
            sweepFlag = (rad > 0) ? 0 : 1,
            longCurve = (Math.abs(rad) < Math.PI) ? 0 : 1;

        paths.push({
            'path': `a ${curveRadius},${roundTwo(curveRadius * flattenTurn)} 0 ${longCurve} ${sweepFlag} ${dx},${dy}`,
            'style': 'dotted'
        });
    } else {
        var 
            rotAxisEllipse = (yAxisOffset < 90) ? perspectiveParam.hRotAngle : -perspectiveParam.hRotAngle,
            xCurveRadius = roundTwo(perspectiveParam.hXRadius * curveRadius),
            yCurveRadius = roundTwo(perspectiveParam.hYRadius * curveRadius),
            dy = yAxisScaleFactor * (Math.cos(stopRad) - Math.cos(startRad)),
            dx = roundTwo((Math.sin(stopRad) - Math.sin(startRad) - dy * Math.cos(yAxisOffset * Math.degToRad)) * curveRadius) * sign,
            sweepFlag = (rad > 0) ? 0 : 1,
            longCurve = (Math.abs(rad) < Math.PI) ? 0 : 1;

        dy = roundTwo(dy * Math.sin(yAxisOffset * Math.degToRad) * curveRadius) * sign,

        paths.push({
            'path': `a ${xCurveRadius},${yCurveRadius} ${rotAxisEllipse} ${longCurve} ${sweepFlag} ${dx},${dy}`,
            'style': 'dotted'
        });
    }
    return paths;
}

// makeTurnRoll creates rolls in rolling turns. Basically a minimal version of makeRoll
// param is the amount of roll degrees
function makeTurnRoll(param, rad) {
    if ($('newTurnPerspective').checked) {
        // Define the size of the arrow and its tip
        var arrowTipWidth = 5;
        var arrowTipLength = Math.PI / 4.5;
        var arrowLength = Math.PI / 9;
        var turnRollcurveRadius = rollcurveRadius * 2;
    }
    var paths = [];
    var extent = Math.abs(param);
    var sign = param > 0 ? 1 : -1;
    var sweepFlag = param > 0 ? 1 : 0;
    // calculate sin and cos for rad once to save calculation time
    var radSin = Math.sin(rad);
    var radCos = Math.cos(rad);
    if (!$('newTurnPerspective').checked) {
        // Make the tip shape
        var
            radPoint = rad + sign * (Math.PI / 3.5),
            dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius),
            dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
        var path = 'm ' +
            roundTwo((Math.cos(radPoint) - radCos) * rollcurveRadius) + ',' +
            roundTwo(-((Math.sin(radPoint) - radSin) * rollcurveRadius)) + ' ';
        var
            radPoint = rad + sign * (Math.PI / 6),
            dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip,
            dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
        path += `l ${roundTwo(dx)},${roundTwo(dy)} `;
        dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
        dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
        path += `l ${roundTwo(dx)},${roundTwo(dy)} z`;
        paths.push({ 'path': path, 'style': 'blackfill' });

        // Calculate at which angle the curve starts and stops
        radPoint = (extent >= 360) ? rad - sign * (Math.PI / 6) : rad;
        var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
        var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
        // Make the curved path
        path = 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' a ' +
            rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag +
            ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ';
        paths.push({ 'path': path, 'style': 'pos' });
    } else {
        var perspSin = Math.sin(yAxisOffset * Math.degToRad);
        var perspCos = Math.cos(yAxisOffset * Math.degToRad);
        // get ellipse parameters
        var rotAxisEllipse = (yAxisOffset < 90) ? perspectiveParam.hRotAngle : -perspectiveParam.hRotAngle;
        var xRollcurveRadius = roundTwo(perspectiveParam.hXRadius * turnRollcurveRadius);
        var yRollcurveRadius = roundTwo(perspectiveParam.hYRadius * turnRollcurveRadius);
        // Make the tip shape
        var radPoint = rad + sign * arrowTipLength;
        dxTip = ((Math.cos(radPoint) - radCos) * turnRollcurveRadius);
        dyTip = -((Math.sin(radPoint) - radSin) * turnRollcurveRadius);
        var elDxTip = dxTip - yAxisScaleFactor * dyTip * perspCos;
        var elDyTip = yAxisScaleFactor * dyTip * perspSin;
        path = `m ${roundTwo(elDxTip)},${roundTwo(elDyTip)} `;
        var radPoint = rad + sign * arrowLength;
        dx = (((Math.cos(radPoint) * (turnRollcurveRadius + arrowTipWidth)) - (radCos * turnRollcurveRadius))) - dxTip;
        dy = -(((Math.sin(radPoint) * (turnRollcurveRadius + arrowTipWidth)) - (radSin * turnRollcurveRadius))) - dyTip;
        var elDx = dx - yAxisScaleFactor * dy * perspCos;
        var elDy = yAxisScaleFactor * dy * perspSin;
        path += `l ${roundTwo(elDx)},${roundTwo(elDy)} `;
        dx = (((Math.cos(radPoint) * (turnRollcurveRadius - arrowTipWidth)) - (radCos * turnRollcurveRadius))) - dx - dxTip;
        dy = -(((Math.sin(radPoint) * (turnRollcurveRadius - arrowTipWidth)) - (radSin * turnRollcurveRadius))) - dy - dyTip;
        elDx = dx - yAxisScaleFactor * dy * perspCos;
        elDy = yAxisScaleFactor * dy * perspSin;
        path += `l ${roundTwo(elDx)},${roundTwo(elDy)} z`;
        paths.push({ 'path': path, 'style': 'blackfill' });

        // Calculate at which angle the curve starts and stops
        radPoint = (extent >= 360) ? rad - sign * arrowLength : rad;
        var dx = (Math.cos(radPoint) - radCos) * turnRollcurveRadius - dxTip;
        var dy = -(Math.sin(radPoint) - radSin) * turnRollcurveRadius - dyTip;
        elDx = dx - yAxisScaleFactor * dy * perspCos;
        elDy = yAxisScaleFactor * dy * perspSin;
        // Make the curved path
        paths.push({
            'path': 'm ' + roundTwo(elDxTip) + ',' + roundTwo(elDyTip) + ' a ' +
                xRollcurveRadius + ',' + yRollcurveRadius + ' ' + rotAxisEllipse + ' 0 ' + sweepFlag +
                ' ' + roundTwo(elDx) + ',' + roundTwo(elDy) + ' ',
            'style': 'pos'
        });
    }
    return paths;
}

// makeTurn builds turns and rolling circles from the draw instructions
// parsed from fig[i].draw
function makeTurn(draw) {
    // parse base
    var paths = [];
    // Check if we are in an in/out or out/in roll
    var switchRollDir = /io|IO/.test(draw) ? true : false;
    var sign = 1;
    var numbers = draw.replace(/[^\d]+/g, '');
    var extent = parseInt(numbers.charAt(0)) * 90;
    // Set the default exit direction
    if ((extent == 90) || (extent == 270)) {
        var dirChange = sign * extent;
        changeDir(dirChange);
        if ((Direction % 180) == 0) {
            // Set depending on goRight on X axis
            if ((((Direction == 0) == (Attitude == 0)) != goRight) == (!/^[CL]/.test(activeForm))) {
                sign = -sign;
                rollDir = -rollDir;
            }
        } else {
            // Set towards viewer on Y axis
            if (((Direction == 90) == (Attitude == 0)) == (!/^[CL]/.test(activeForm))) {
                sign = -sign;
                rollDir = -rollDir;
            }
        }
        changeDir(-dirChange);
    } else {
        if ((Direction % 180) == 0) {
            // towards viewer X-to-X axis
            if (((Direction == 0) == (Attitude < 180)) == (!/^[CL]/.test(activeForm))) {
                sign = -sign;
                rollDir = -rollDir;
            }
        } else {
            // according goRight Y-to-Y axis
            if ((((Direction == 90) == (Attitude == 0)) != goRight) == (!/^[CL]/.test(activeForm))) {
                sign = -sign;
                rollDir = -rollDir;
            }
        }
    }
    // Check if the exit direction is flipped
    if (draw.charAt(0) == userpat.moveforward) sign = -sign;

    // See if we start with an outside roll
    var rollDir = /J/.test(draw) ? -sign : sign;
    // See if we start inverted, this will also flip the drawing direction
    if (Attitude == 180) rollDir = -rollDir;

    // use for wingover
    var newAttitude = extent == 180 ? (360 - Attitude) % 360 : Attitude;

    // See if direction change is called for by the preparsed draw string
    if (newAttitude != Attitude) {
        // for wingover, HACK
        var stopRad = dirAttToXYAngle(Direction + (sign * extent), newAttitude);
        var startRad = dirAttToXYAngle(Direction, Attitude);
    } else {
        if (!$('newTurnPerspective').checked) {
            var stopRad = dirAttToAngle(Direction + (sign * extent), newAttitude);
            var startRad = dirAttToAngle(Direction, Attitude);
        } else {
            var stopRad = dirAttToAngle(Direction + (sign * extent), newAttitude, true);
            var startRad = dirAttToAngle(Direction, Attitude, true);
        }
    }
    if (stopRad < 0) stopRad += Math.Tau;
    if (startRad < 0) startRad += Math.Tau;
    var startRadSave = startRad;
    var rad = sign * stopRad - sign * startRad;
    if (rad <= 0) rad += Math.Tau;
    if (numbers.length > 1) {
        // rolling turns
        var steps = 0;
        var rolls = 0;
        for (let i = 1; i < numbers.length; i++) {
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
        for (let i = 0; i < rad; i += step) {
            paths = makeTurnArc(halfStepSigned, startRad, startRad + halfStepSigned, paths);
            startRad += halfStepSigned;
            if (numbers[rollPos] == '5') {
                var rollPaths = makeTurnRoll(180 * rollDir, startRad);
                changeDir(180);
                changeAtt(180);
            } else {
                var rollPaths = makeTurnRoll(360 * rollDir, startRad);
            }
            if (switchRollDir) rollDir = -rollDir;
            for (let j = 0; j < rollPaths.length; j++) {
                paths.push(rollPaths[j]);
            }
            paths = makeTurnArc(halfStepSigned, startRad, startRad + halfStepSigned, paths);
            startRad += halfStepSigned;
            rollPos++;
        }
        if (extent != 360) {
            paths = makeTurnDots(sign * (Math.Tau - rad), stopRad, startRadSave, paths);
        }
        changeDir(sign * extent);
    } else {
        // regular turns
        if (extent != 360) {
            paths = makeTurnArc(sign * rad, startRad, stopRad, paths);
            paths = makeTurnDots(sign * (Math.Tau - rad), stopRad, startRad, paths);
            // build turn extent text with degree sign in unicode
            // not always exactly centered: fixme: improve code
            if (!$('newTurnPerspective').checked) {
                var dx = -sign * (Math.sin(stopRad)) * curveRadius;
                var dy = -sign * (Math.cos(stopRad)) * curveRadius * flattenTurn;
            } else {
                var dx = -sign * (Math.sin(stopRad)) * perspectiveParam.hXRadius * curveRadius;
                var dy = -sign * (Math.cos(stopRad)) * perspectiveParam.hYRadius * curveRadius + rollFontSize / 3;
            }

            paths.push({
                'text': extent + "\u00B0",
                'style': 'rollText',
                'x': roundTwo(dx),
                'y': roundTwo(dy),
                'text-anchor': 'middle'
            });
            changeDir(sign * extent);
            // used for wingover
            Attitude = newAttitude;
        } else {
            paths = makeTurnArc(sign * Math.PI, startRad, startRad + Math.PI, paths);
            changeDir(180);
            paths = makeTurnArc(sign * Math.PI, startRad + Math.PI, startRad, paths);
            changeDir(180);
        }
    }
    return paths;
}

// makeRollText is a helper function for makeRoll, makeSnap and makeSpin.
// It creates the text (2x8, 3/4 etc) and also comments next to rolls,
// snaps and spins.
// It returns the text as a paths, or false for no text
function makeRollText(extent, stops, sign, comment, radSin, radCos) {
    // don't flip text by default and start with empty comment text
    var
        flipText = false,
        text = '',
        dx = 0,
        dy = 0;

    // check for roll comment
    if (comment) {
        // check for roll text flip
        if (comment[0] === userpat.flipNumber) {
            flipText = true;
            comment = comment.substring(1);
        }
        text = comment;
    }

    if ((extent % 180) || (stops > 0) || (text.length > 0)) {
        if (stops > 0) {
            if (text.length > 0) text = ` ${text}`;
            if (extent != 360) text = `x${stops}${text}`;
            text = (extent / (360 / stops)) + text;
        } else if (extent % 180) {
            if (text.length > 0) text = ` ${text}`;
            text = `${(extent % 360) / 90}/4${text}`;
        }

        // rollcurveRadius is mostly used for determining spacing. Although rollSymbolSize would
        // seem more logical, its value is too low for correct spacing.
        if (flipText) {
            if (extent >= 360) { // make room for 'tail' of roll symbol
                dx = sign * (radSin * (rollcurveRadius / 1.5 + ((rollFontSize / 3.5) * text.length)));
                dy = sign * (radCos * (rollcurveRadius / 1.5 + rollFontSize / 2)) + rollFontSize / 4;
            } else {             // no tail
                dx = sign * (radSin * (4 + ((rollFontSize / 3) * text.length)));
                dy = sign * (radCos * (4 + rollFontSize / 1.5)) + rollFontSize / 4;
            }
        } else {
            if (extent > 360) { // make room for roll connect line
                dx = -sign * (radSin * (rollcurveRadius + 4 + ((rollFontSize / 3.5) * text.length)));
                dy = -sign * (radCos * (rollcurveRadius + 4 + rollFontSize / 2)) + rollFontSize / 4 + 2;
            } else {
                dx = -sign * (radSin * (rollcurveRadius + ((rollFontSize / 3.5) * text.length)));
                dy = -sign * (radCos * (rollcurveRadius + rollFontSize / 2)) + rollFontSize / 4 + 2;
            }
        }
    }

    if (text != '') {
        return ({ 'text': text, 'style': 'rollText', 'x': dx, 'y': dy, 'text-anchor': 'middle' });
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
function makeRoll(params) {
    var
        paths = [],
        stops = params[1],
        extent = Math.abs(params[0]),
        sign = params[0] > 0 ? 1 : -1,
        sweepFlag = params[0] > 0 ? 1 : 0,
        rollTop = params.length > 2 ? params[2] : false,
        rad = (Attitude % 90) == 45 ? trueDrawingAngle : dirAttToAngle(Direction, Attitude);

    // calculate sin and cos for rad once to save calculation time
    var radSin = Math.sin(rad);
    var radCos = Math.cos(rad);
    // distinguish for autocorrect rolls
    if (params[4]) {
        var style = ['corrfill', 'corr'];
        // draw circle around roll
        paths.push({
            'path': `m -${rollcurveRadius * 1.2},0 a${rollcurveRadius * 1.2},${rollcurveRadius * 1.2} 0 1 1 0,0.01`,
            'style': style[1]
        });
    } else {
        var style = ['blackfill', 'pos'];
    }
    while (extent > 0) {
        // Make the tip shape
        var
            radPoint = rad + sign * (Math.PI / 3.5),
            dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius),
            dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius),
            path = `m ${roundTwo(dxTip)},${roundTwo(dyTip)} `,
            radPoint = rad + sign * (Math.PI / 6);

        dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
        dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
        path += `l ${roundTwo(dx)},${roundTwo(dy)} `;
        dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
        dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
        path += `l ${roundTwo(dx)},${roundTwo(dy)} z`;
        // only show arrow tip when params[6] is not trueish
        if (!params[6]) paths.push({ 'path': path, 'style': style[0] });

        // Make the second tip for glider super slow rolls
        if (params[3]) {
            var radPoint = rad + sign * (Math.PI / 2.5);
            dxTip = ((Math.cos(radPoint) - radCos) * rollcurveRadius);
            dyTip = -((Math.sin(radPoint) - radSin) * rollcurveRadius);
            path = `m ${roundTwo(dxTip)},${roundTwo(dyTip)} `;
            var radPoint = rad + sign * (Math.PI / 3.5);
            dx = (((Math.cos(radPoint) * (rollcurveRadius + 4)) - (radCos * rollcurveRadius))) - dxTip;
            dy = -(((Math.sin(radPoint) * (rollcurveRadius + 4)) - (radSin * rollcurveRadius))) - dyTip;
            path += `l ${roundTwo(dx)},${roundTwo(dy)} `;
            dx = (((Math.cos(radPoint) * (rollcurveRadius - 4)) - (radCos * rollcurveRadius))) - dx - dxTip;
            dy = -(((Math.sin(radPoint) * (rollcurveRadius - 4)) - (radSin * rollcurveRadius))) - dy - dyTip;
            path += `l ${roundTwo(dx)},${roundTwo(dy)} z`;
            paths.push({ 'path': path, 'style': style[0] });
        }

        // Calculate at which angle the curve starts and stops
        radPoint = (extent >= 360) ?
            rad - sign * (Math.PI / (params[6] ? 3.5 : 6)) : // make roll symmetrical or not
            rad;
        var dx = (Math.cos(radPoint) - radCos) * rollcurveRadius - dxTip;
        var dy = -(Math.sin(radPoint) - radSin) * rollcurveRadius - dyTip;
        // Make the curved path
        paths.push({
            'path': 'm ' + roundTwo(dxTip) + ',' + roundTwo(dyTip) + ' a ' +
                rollcurveRadius + ',' + rollcurveRadius + ' 0 0 ' + sweepFlag +
                ' ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ',
            'style': style[1]
        });

        if (params[6] > 2) {	// if "any roll" or spin => Draw the 2 little lines for "any rolls" and, if spin, the drawing "spin allowed".
            let
                halfLength = roundTwo(rollcurveRadius / 2),
                tinyLength = roundTwo(rollcurveRadius / 5);	// Length and spacing of the 2 little lines for "any rolls".
            paths.push({
                'path': 'm ' + (dxTip + (dxTip > 0 ? tinyLength : -tinyLength)) +
                ',' + (dyTip + 0.5 * halfLength) + ' v ' + -halfLength +
                ' m ' + (dxTip > 0 ? tinyLength : -tinyLength) + ',0 v ' + halfLength,
                'style': style[1]
            });
            if (params[6] == 4) {	// Draw the drawing "spin allowed".
                paths.push({
                    'path': 'm ' + roundTwo(-dxTip + (dx > 0 ? 1.07 * rollcurveRadius : -(1.07 * rollcurveRadius))) +
                        ',' + roundTwo(dy - 0.7 * halfLength) + ' h ' + rollcurveRadius + ' l ' + -rollcurveRadius + ',' + halfLength,
                    'style': style[1]
                });
            }
        }

        // Where necessary, show the roll numbers after completing the first
        // roll point and arc.
        // This is only necessary for rolls that are not multiples of 180 or
        // have hesitations
        // Also add any user defined comment here
        if (extent == Math.abs(params[0])) {
            var rollText = makeRollText(
                extent,
                stops,
                sign,
                params[5],
                radSin,
                radCos
            );
            if (rollText) paths.push(rollText);
        }
        // Completed the first (full) roll. Continue for more than 360
        extent -= 360;
        // For more than 360 degrees, draw a line between the rolls and the
        // roll tip connect line
        if (extent > 0) {
            // Make the line between the two rolls.
            // Only move the pointer (no line) for rolls in the top
            if (rollTop) {
                paths = buildShape('Move', [1 / scale], paths);
            } else {
                paths = buildShape('Line', [1 / scale], paths);
            }
            // Get the relative movement by the line and use this to build the
            // tip additional line
            dx = paths[paths.length - 1].dx;
            dy = paths[paths.length - 1].dy;
            // glider super slow roll or regular roll
            var radPoint = params[3] ? rad + sign * (Math.PI / 2) : rad + sign * (Math.PI / 3);

            dxTip = (((Math.cos(radPoint) * (rollcurveRadius + 2)) - (radCos * rollcurveRadius)));
            dyTip = -(((Math.sin(radPoint) * (rollcurveRadius + 2)) - (radSin * rollcurveRadius)));
            if (params[3]) {
                // glider super slow roll
                path = `m ${roundTwo(dxTip + dx / 2)},${roundTwo(dyTip + dy / 2)} l ${roundTwo(-dx * 1.5)},${roundTwo(-dy * 1.5)}`;
            } else {
                // regular roll
                path = `m ${roundTwo(dxTip)},${roundTwo(dyTip)} l ${roundTwo(-dx)},${roundTwo(-dy)}`;
            }
            paths.push({ 'path': path, 'style': style[1] });
        }
    }
    return paths;
}

// makeSnap creates snap rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of snap
// [1] indicates pos or neg snap. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional comment
// Examples: (270,0) is a 3/4 pos snap. (180,1) is a 1/2 neg snap
function makeSnap(params) {
    var
        paths = [],
        extent = Math.abs(params[0]),
        sign = params[0] > 0 ? 1 : -1,
        rollTop = params.length > 2 ? params[2] : false,
        rad = (Attitude % 90) == 45 ? trueDrawingAngle : dirAttToAngle(Direction, Attitude),
        // calculate sin and cos for rad once to save calculation time
        radSin = Math.sin(rad),
        radCos = Math.cos(rad),
        // tipFactor makes sure the tip symbol is exactly on the tip,
        // considering default line thickness
        tipFactor = snapElement2 / (snapElement2 + 0.75);

    while (extent > 0) {
        // Make the base shape
        var
            dxTip = -radSin * (snapElement2 + 0.75) * sign,
            dyTip = -radCos * (snapElement2 + 0.75) * sign,
            dx = radCos * snapElement,
            dy = -radSin * snapElement,
            path = `m ${roundTwo(dxTip)},${roundTwo(dyTip)} l ${roundTwo(dx)},${roundTwo(dy)} `;

        paths.push({ 'path': path, 'style': 'pos' });
        path = `m ${roundTwo(dxTip * tipFactor)},${roundTwo(dyTip * tipFactor)}`;
        if (extent >= 360) { // full snap symbol
            dx = (radCos * snapElement12) + (radSin * snapElement3 * sign);
            dy = (- radSin * snapElement12) + (radCos * snapElement3 * sign);
            path += ` l ${roundTwo(dx)},${roundTwo(dy)} `;
            dx = (- radCos) * snapElement24;
            dy = radSin * snapElement24;
        } else { // half snap symbol
            dx = (radCos * snapElement) + (radSin * snapElement2 * sign);
            dy = (- radSin * snapElement) + (radCos * snapElement2 * sign);
            path += ` l ${roundTwo(dx)},${roundTwo(dy)} `;
            dx = (- radCos) * snapElement2;
            dy = radSin * snapElement2;
        }
        path += `l ${roundTwo(dx)},${roundTwo(dy)} z`;
        paths.push({
            'path': path,
            'style': (params[1] == 0) ? 'posfill' : 'negfill',
            'dx': radCos * snapElement075,
            'dy': -radSin * snapElement075
        });

        // Where necessary, show the roll numbers after completing the first
        // roll point and arc.
        // This is only necessary for rolls that are not multiples of 180
        if (extent == Math.abs(params[0])) {
            var rollText = makeRollText(
                extent,
                0,
                sign,
                params[3],
                radSin * snapElementText,
                radCos * snapElementText
            );
            if (rollText) paths.push(rollText);
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
                paths = buildShape('Move', [snapElement017 / scale], paths);
            } else {
                paths = buildShape('Line', [snapElement017 / scale], paths);
            }
            NegLoad = saveLoad;
            // Get the relative movement by the line and use this to build the
            // tip additional line
            dx = -roundTwo(paths[paths.length-1].dx + radCos * snapElement2);
            dy = -roundTwo(paths[paths.length-1].dy - radSin * snapElement2);
            dxTip = roundTwo(-radSin * snapElement24 * sign + radCos * snapElement);
            dyTip = roundTwo(-radCos * snapElement24 * sign - radSin * snapElement);
            paths.push({
                'path': `m ${dxTip},${dyTip} l ${dx},${dy}`,
                'style': 'pos'
            });
        }
    }

    return paths;
}

// makeSpin creates spins
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction of spin
// [1] indicates pos or neg spin. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in top, true = in top
// [3] is optional comment
// Examples: (270,0) is a 3/4 pos spin. (540,1) is a 1 1/2 neg spin
function makeSpin(params) {
    var
        paths = [],
        extent = Math.abs(params[0]),
        sign = params[0] > 0 ? 1 : -1,
        rad = dirAttToAngle(Direction, Attitude),
        // calculate sin and cos for rad once to save calculation time
        radSin = Math.sin(rad),
        radCos = Math.cos(rad);

    if (params.length > 2) var rollTop = params[2];

    // tipFactor makes sure the tip symbol is exactly on the tip,
    // considering default line thickness
    var tipFactor = spinElement2 / (spinElement2 - 0.75);

    while (extent > 0) {
        // Make the base shape
        // First make the tip line
        var
            dxTip = -radSin * (spinElement2 - 0.75) * sign,
            dyTip = -radCos * (spinElement2 - 0.75) * sign,
            dx = radCos * spinElement,
            dy = -radSin * spinElement,
            path = `m ${roundTwo(dxTip)},${roundTwo(dyTip)} l ${roundTwo(dx)},${roundTwo(dy)} `;

        paths.push({'path': path, 'style': 'pos' });
        // Next make the triangle
        path = `m ${roundTwo(dxTip * tipFactor)},${roundTwo(dyTip * tipFactor)} `;
        if (extent >= 360) {
            dx = (radCos * spinElement * 1.5) + (radSin * spinElement3 * sign);
            dy = (- radSin * spinElement * 1.5) + (radCos * spinElement3 * sign);
            path += `l ${roundTwo(dx)},${roundTwo(dy)} `;
            dx = (- radCos) * spinElement * 1.5;
            dy = radSin * spinElement * 1.5;
        } else {
            dx = (radCos * spinElement) + (radSin * spinElement2 * sign);
            dy = (- radSin * spinElement) + (radCos * spinElement2 * sign);
            path += `l ${roundTwo(dx)},${roundTwo(dy)} `;
            dx = (- radCos) * spinElement;
            dy = radSin * spinElement;
        }
        path += `l ${roundTwo(dx)},${roundTwo(dy)} z`;
        paths.push({
            'path': path,
            'style': params[1] == 0 ? 'posfill' : 'negfill',
            'dx': radCos * spinElement,
            'dy': -radSin * spinElement
        });
        // Where necessary, show the roll numbers after completing the first
        // roll point and arc.
        // This is only necessary for spins that are not multiples of 180
        if (extent == Math.abs(params[0])) {
            var rollText = makeRollText(
                extent,
                0,
                sign,
                params[3],
                radSin * spinElementText,
                radCos * spinElementText
            );
            if (rollText) paths.push(rollText);
        }
        // Completed the first (full) spin. Continue for more than 360
        extent -= 360;
        // For more than 360 degrees, draw a line between the spins and the
        // spin tip connect line
        if (extent > 0) {
            // Make the line between the two rolls. Always positive for now
            // Only move the pointer for rolls in the top
            if (rollTop) {
                paths = buildShape('Move', [0.5 / scale], paths);
            } else {
                paths = buildShape('Line', [0.5 / scale], paths);
            }
            // Get the relative movement by the line and use this to build the
            // tip additional line
            dx = -roundTwo(paths[paths.length - 1].dx + radCos * spinElement2);
            dy = -roundTwo(paths[paths.length - 1].dy - radSin * spinElement2);
            dxTip = roundTwo(-radSin * spinElement24 * sign + radCos * spinElement);
            dyTip = roundTwo(-radCos * spinElement24 * sign - radSin * spinElement);
            paths.push({
                'path': `m ${dxTip},${dyTip} l ${dx},${dy}`,
                'style': 'pos'
            });
        }
    }
    return paths;
}

// makeShoulderRoll creates shoulder rolls
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction
// [1] indicates pos or neg. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in
//     top, true = in top
// [3] is optional comment
function makeShoulderRoll(params) {
    var
        paths = [],
        extent = Math.abs(params[0]),
        sign = params[0] > 0 ? 1 : -1,
        rad = (Attitude % 90) == 45 ? trueDrawingAngle : dirAttToAngle(Direction, Attitude),
        // calculate sin and cos for rad once to save calculation time
        radSin = Math.sin(rad),
        radCos = Math.cos(rad),
        rollTop = params.length > 2 ? params[2] : false;

    while (extent > 0) {
        // Make the base shape
        var path = `a${snapElement15},${snapElement15} 0 0,${sign === 1 ? 1 : 0} ${roundTwo((radCos * snapElement15) - (radSin * snapElement15 * sign))},${roundTwo(-(radCos * snapElement15 * sign) - (radSin * snapElement15))} l ${roundTwo((radCos * snapElement15) + (radSin * snapElement15 * sign))},${roundTwo((radCos * snapElement15 * sign) - (radSin * snapElement15))} `;

        if (extent >= 360) { // full shoulder roll symbol
            path += 'l ' +
                roundTwo(radSin * snapElement075 * sign) + ',' +
                roundTwo(radCos * snapElement075 * sign) + ' ' +
                'l ' +
                roundTwo(-radCos * snapElement3) + ',' +
                roundTwo(radSin * snapElement3) + ' ';
        }
        path += 'z';
        paths.push({
            'path': path,
            'style': params[1] == 0 ? 'posfill' : 'negfill',
            'dx': radCos * snapElement3,
            'dy': -radSin * snapElement3
        });

        // Where necessary, show the roll numbers after completing the first
        // roll point and arc.
        // This is only necessary for rolls that are not multiples of 180
        if (extent == Math.abs(params[0])) {
            var rollText = makeRollText(
                extent,
                0,
                sign,
                params[3],
                radSin,
                radCos
            );
            if (rollText) paths.push(rollText);
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
            paths = buildShape(rollTop ? 'Move' : 'Line', [0.5 / scale], paths);
            NegLoad = saveLoad;
            // Get the relative movement by the line and use this to build the
            // tip additional line
            path = 'm ' + roundTwo(-radSin * snapElement2 * sign + radCos * snapElement) + ',' +
                roundTwo(-radCos * snapElement2 * sign - radSin * snapElement) +
                ' l ' +
                roundTwo(-(paths[paths.length - 1].dx + radCos * snapElement3)) + ',' +
                roundTwo(-(paths[paths.length - 1].dy - radSin * snapElement3));
            paths.push({'path': path, 'style': 'pos' });
        }
    }
    return paths;
}

// makeRuade creates ruades
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction
// [1] indicates pos or neg. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in
//     top, true = in top
// [3] is optional comment
function makeRuade(params) {
    var
        paths = [],
        extent = Math.abs(params[0]),
        sign = params[0] > 0 ? 1 : -1,
        rollTop = params.length > 2 ? params[2] : false,
        rad = (Attitude % 90) == 45 ? trueDrawingAngle : dirAttToAngle(Direction, Attitude),
        // calculate sin and cos for rad once to save calculation time
        radSin = Math.sin(rad),
        radCos = Math.cos(rad);

    while (extent > 0) {
        // Make the base shape
        var path = 'l' + roundTwo(-radSin * snapElement15 * sign) + ',' +
            roundTwo(-radCos * snapElement15 * sign) + ' l ' +
            roundTwo((radCos * snapElement3) + (radSin * snapElement15 * sign)) + ',' +
            roundTwo((radCos * snapElement15 * sign) - (radSin * snapElement3)) + ' ';

        if (extent >= 360) { // full ruade symbol
            path += 'l ' + roundTwo(radSin * snapElement075 * sign) + ',' +
                roundTwo(radCos * snapElement075 * sign) + ' l ' +
                roundTwo(-radCos * snapElement3) + ',' +
                roundTwo(radSin * snapElement3) + ' ';
        }
        path += 'z';
        paths.push({
            'path': path,
            'style': (params[1] == 0) ? 'posfill' : 'negfill',
            'dx': radCos * snapElement3,
            'dy': -radSin * snapElement3
        });

        // Where necessary, show the roll numbers after completing the first
        // roll point and arc.
        // This is only necessary for rolls that are not multiples of 180
        if (extent == Math.abs(params[0])) {
            var rollText = makeRollText(
                extent,
                0,
                sign,
                params[3],
                radSin,
                radCos
            );
            if (rollText) paths.push(rollText);
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
                paths = buildShape('Move', [0.5 / scale], paths);
            } else {
                paths = buildShape('Line', [0.5 / scale], paths);
            }
            NegLoad = saveLoad;
            // Get the relative movement by the line and use this to build the
            // tip additional line
            path = 'm ' + roundTwo(-radSin * snapElement2 * sign + radCos * snapElement) + ',' +
                roundTwo(-radCos * snapElement2 * sign - radSin * snapElement) +
                ' l ' +
                roundTwo(-(paths[paths.length - 1].dx + radCos * snapElement3)) + ',' +
                roundTwo(-(paths[paths.length - 1].dy - radSin * snapElement3));
            paths.push({'path': path, 'style': 'pos' });
        }
    }
    return paths;
}

// makeLomcevak creates Lomcevaks
// params is an array:
// [0] is the amount of degrees. A negative value changes the direction
// [1] indicates pos or neg. 0=pos 1=neg
// [2] is optional roll in top argument, false or non-present = not in
//     top, true = in top
// [3] is optional comment
function makeLomcevak(params) {
    var
        paths = [],
        extent = Math.abs(params[0]),
        sign = params[0] > 0 ? 1 : -1,
        rollTop = params.length > 2 ? params[2] : false,
        rad = (Attitude % 90) == 45 ? trueDrawingAngle : dirAttToAngle(Direction, Attitude),
        // calculate sin and cos for rad once to save calculation time
        radSin = Math.sin(rad),
        radCos = Math.cos(rad);

    while (extent > 0) {
        // Make the base shape
        var path = 'l' + roundTwo(-radSin * snapElement15 * sign) + ',' +
            roundTwo(-radCos * snapElement15 * sign) + ' l ' +
            roundTwo(radCos * snapElement3) + ',' +
            roundTwo(-radSin * snapElement3) + 'a' +
            snapElement15 + ',' + snapElement15 + ' 0 0,' +
            (sign === 1 ? 0 : 1) + ' ' +
            roundTwo(-(radCos * snapElement15) + (radSin * snapElement15 * sign)) + ',' +
            roundTwo((radCos * snapElement15 * sign) + (radSin * snapElement15)) + ' l' +
            roundTwo(radCos * snapElement15) + ',' +
            roundTwo(-radSin * snapElement15);

        if (extent >= 360) { // full Lomcevak symbol
            path += 'l ' + roundTwo(radSin * snapElement075 * sign) + ',' +
                roundTwo(radCos * snapElement075 * sign) + ' l ' +
                roundTwo(-radCos * snapElement3) + ',' +
                roundTwo(radSin * snapElement3) + ' ';
        }
        path += 'z';
        paths.push({
            'path': path,
            'style': (params[1] == 0) ? 'posfill' : 'negfill',
            'dx': radCos * snapElement3,
            'dy': -radSin * snapElement3
        });

        // Where necessary, show the roll numbers after completing the first
        // roll point and arc.
        // This is only necessary for rolls that are not multiples of 180
        if (extent == Math.abs(params[0])) {
            var rollText = makeRollText(
                extent,
                0,
                sign,
                params[3],
                radSin,
                radCos
            );
            if (rollText) paths.push(rollText);
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
                paths = buildShape('Move', [0.5 / scale], paths);
            } else {
                paths = buildShape('Line', [0.5 / scale], paths);
            }
            NegLoad = saveLoad;
            // Get the relative movement by the line and use this to build the
            // tip additional line
            path = 'm ' + roundTwo(-radSin * snapElement2 * sign + radCos * snapElement) + ',' +
                roundTwo(-radCos * snapElement2 * sign - radSin * snapElement) +
                ' l ' +
                roundTwo(-(paths[paths.length - 1].dx + radCos * snapElement3)) + ',' +
                roundTwo(-(paths[paths.length - 1].dy - radSin * snapElement3));
            paths.push({'path': path, 'style': 'pos' });
        }
    }
    return paths;
}

// makeHammer creates hammerhead tops
// extent is the size of the line before the hammerhead top.
// We will move that much down before continuing drawing
function makeHammer(extent) {
    const paths = {
        style: 'pos',
        class: 'hammerTip',
        dx: 0,
        dy: lineElement * extent
    };
    Attitude = 270;
    changeDir(180);
    if ((Direction % 180) == 90) {
        paths.path = `l ${roundTwo(scaleLine.x * lineElement)},${roundTwo((1 - scaleLine.y) * lineElement)}`;
    } else {
        paths.path = `l ${lineElement},${lineElement}`;
    }
    return [paths];
}

// makeTailslide creates tailslide tops
// param gives the type as a string
function makeTailslide(param) {
    let
        paths = new Array(Array(), Array()),
        sweepFlag = 1,
        angle = dirAttToAngle(Direction, Attitude),
        radius = curveRadius;

    NegLoad = 0;
    if (param == figpat.tailslidewheels) angle = -angle;
    sweepFlag = (angle > 0) ? 1 : 0;
    paths[0].style = (param == figpat.tailslidecanopy) ? 'pos' : 'neg';

    let dx = (angle > 0) ? -radius : radius;
    let dy = radius;
    // Make the path and move the cursor
    if (((Direction % 180) == 90) && curvePerspective) {
        var
            rotAxisEllipse = (yAxisOffset < 90) ? perspectiveParam.rotAngle : -perspectiveParam.rotAngle,
            xAxisRadius = perspectiveParam.xRadius * radius,
            yAxisRadius = perspectiveParam.yRadius * radius;

        dx *= scaleLine.x;
        dy -= dx * scaleLine.y;
        if (yAxisOffset > 90) dx = -dx;

        paths[0].path = `a${roundTwo(xAxisRadius)},${roundTwo(yAxisRadius)} ${rotAxisEllipse} 0 ${sweepFlag} ${roundTwo(dx)},${roundTwo(dy)}`;
    } else {
        paths[0].path = `a${radius},${radius} 0 0 ${sweepFlag} ${dx},${dy}`;
    }
    paths[0].dx = dx;
    paths[0].dy = dy;
    radius = curveRadius / 2;
    dx = (angle > 0) ? radius : -radius;
    dy = radius;
    if (((Direction % 180) == 90) && curvePerspective) {
        dx *= scaleLine.x;
        dy -= dx * scaleLine.y;
        if (yAxisOffset > 90) dx = -dx;

        paths[1].path = `a${roundTwo(xAxisRadius)},${roundTwo(yAxisRadius)} ${rotAxisEllipse} 0 ${sweepFlag} ${roundTwo(dx)},${roundTwo(dy)}`;
    } else {
        paths[1].path = `a${radius},${radius} 0 0 ${sweepFlag} ${dx},${dy}`;
    }
    paths[1].style = 'pos';
    paths[1].dx = dx;
    paths[1].dy = dy;
    Attitude = 270;
    return paths;
}

// makePointTip creates pointed tops (non-Aresti)
// extent is the size of the line before the top.
// We will move that much down before continuing drawing
function makePointTip(extent) {
    changeAtt(180);
    changeDir(180);
    return [{
        path: 'M 0,0', // make sure it is "drawn", as a drag handle marker
        style: 'pos',
        class: 'pointTip',
        dx: 0,
        dy: lineElement * extent
    }];
}

// tspan creates an svg tspan with optional spacing to the next line
function tspan(line, dy = 14) {
    // create span
    const span = document.createElementNS(svgNS, 'tspan');
    span.setAttribute('x', 0);
    span.setAttribute('dy', dy);
    span.appendChild(document.createTextNode(line));
    return span;
}

// makeTextBlock makes text blocks, for example from comments.
// It also handles assignment of figure letter codes for Free (un)known
// operations.
function makeTextBlock(text) {
    var
        paths = [],
        rotate = false,
        header = true;

    // handle special code for Free (Un)known figure designation
    let match = text.match(/^@[A-Z]/);
    if (match) {
        text = text.replace(match[0], '');
        unknownFigureLetter = match[0].replace('@', '');
    }
    // handle special code for Unknown additional
    if (/^additional$/.test(text)) {
        text = '';
        unknownFigureLetter = 'L';
    }

    // remove letter if it is an additional figure and none are allowed
    if ((unknownFigureLetter === 'L') && !additionalFig.max) {
        unknownFigureLetter = false;
    }

    if (text != '') {
        // temporarily attach text to SVG root
        const t = SVGRoot.appendChild(document.createElementNS(svgNS, 'text'));
        t.setAttribute('style', style.textBlock);

        // determine fontSize or use default of 20
        let fontSize = style.textBlock.match(/font-size:[ ]*(\d+)px/)[1] || 20;

        // Parse special codes
        // Not all OLAN special codes are supported yet. They will be
        // filtered out
        let
            lineNr = 0,
            line = '',
            header = true,
            styleId = 'textBlockBorder';

        // First check for text block reposition {xx,yy}
        let moveXY = text.match(/\{(-?\d+),(-?\d+)\}/) || false;
        if (moveXY) {
            text = text.replace (/\{(-?\d+),(-?\d+)\}/, '');
            moveXY[1] = parseInt(moveXY[1]) * lineElement * (/^[CL]/.test(activeForm) ? -1 : 1);
            moveXY[2] = parseInt(moveXY[2]) * lineElement;
        }
        // Now go through the rest of the text
        for (let i = 0; i < text.length; i++) {
            switch (text[i]) {
                // anywhere tags
                case ('\\'): // new line
                    t.appendChild(tspan(line, fontSize));
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
                        if (text.charAt(i + 1) === '[') {
                            styleId = 'textBlockBorderBoldRed';
                            i++;
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

        t.appendChild(tspan(line, fontSize));

        // Determine final text block size
        var w = t.getBBox().width;
        var h = t.getBBox().height;
        // If the box will be rotated, swap w and h
        if (rotate) [w,h] = [h,w];

        // remove element from SVG root
        SVGRoot.removeChild(t);

        // calculate where the center of the box should be
        // rotation is taken into account
        // current angle = angle to box center
        const angle = dirAttToAngle(Direction, Attitude);
        // find distance from box edge to center in this direction
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        if (s == 0) { // horizontal
            var d = w / 2;
        } else if (c == 0) { // vertical
            var d = h / 2;
        } else { // other, choose shortest
            var d = Math.min(Math.abs((w / 2) / c), Math.abs((h / 2) / s));
        }

        // set top-left x and y of the text box
        let x = roundTwo((c * d) - (w / 2)) + (moveXY ? parseInt(moveXY[1]) : 0);
        let y = - roundTwo((s * d) + (h / 2)) + (moveXY ? parseInt(moveXY[2]) : 0);

        // set dx and dy for starting the figure after the text box
        let dx = moveXY ? 0 : roundTwo(2 * c * d);
        let dy = moveXY ? 0 : - roundTwo(2 * s * d);

        // draw rectangle around text
        paths.push({
            'path': `m ${x - 3},${y - 3} l ${w + 6},0 l 0,${h + 6} l${-(w + 6)},0 z`,
            'style': styleId
        });

        // when the text will be rotated, re-adjust x and y so the
        // un-rotated text will be in the right position before rotation
        if (rotate) {
            x = roundTwo((c * d) - (h / 2)) + (moveXY ? parseInt(moveXY[1]) : 0);
            y = - roundTwo((s * d) + (w / 2)) + (moveXY ? parseInt(moveXY[2]) : 0);
        }
        paths.push({ 'textBlock': t, 'x': x, 'y': y, 'dx': dx, 'dy': dy, 'r': rotate });

        // put space after block
        if (!moveXY) paths.push(makeFigSpace(2)[0]);
    } else {
        paths.push({ 'dx': 0, 'dy': 0 });
    }
    return paths;
}

/**************************************************************************
 * Functions for creating and drawing complex shapes from the base shapes */

// draw a shape
function buildShape(shapeName, Params, paths = []) {
    let shapePaths = [];
    // define the shapePaths by executing the correct makeShape function
    switch (shapeName) {
        case 'FigStart':
            shapePaths = makeFigStart(Params);
            break;
        case 'FigStop':
            shapePaths = makeFigStop(Params);
            break;
        case 'FigSpace':
            shapePaths = makeFigSpace(Params);
            break;
        case 'VertSpace':
            shapePaths = makeVertSpace(Params);
            break;
        case 'Line':
            shapePaths = makeLine(Params);
            break;
        case 'Move':
            shapePaths = makeMove(Params);
            break;
        case 'Corner':
            shapePaths = makeCorner(Params);
            break;
        case 'Curve':
            shapePaths = makeCurve(Params);
            break;
        case 'RollTopLine':
            shapePaths = makeRollTopLine(Params);
            break;
        case 'TurnRoll':
            shapePaths = makeTurnRoll(Params);
            break;
        case 'Turn':
            shapePaths = makeTurn(Params);
            break;
        case 'Roll':
            shapePaths = makeRoll(Params);
            break;
        case 'Snap':
            shapePaths = makeSnap(Params);
            break;
        case 'Spin':
            shapePaths = makeSpin(Params);
            break;
        case 'ShoulderRoll':
            shapePaths = makeShoulderRoll(Params);
            break;
        case 'Ruade':
            shapePaths = makeRuade(Params);
            break;
        case 'Lomcevak':
            shapePaths = makeLomcevak(Params);
            break;
        case 'Hammer':
            shapePaths = makeHammer(Params);
            break;
        case 'Tailslide':
            shapePaths = makeTailslide(Params);
            break;
        case 'PointTip':
            shapePaths = makePointTip(Params);
            break;
        case 'TextBlock':
            shapePaths = makeTextBlock(Params);
            break;
    }
    // walk through the returned paths
    shapePaths.forEach ((p) => { paths.push(p) });
    return paths;
}

// drawShape draws a shape from paths
// selectFigure will be true if the figure to be drawn is one selected
// by hover
// prev, if provided, should hold the contents and bounding box of a
// previous text element to avoid.
function drawShape(paths, svgElement, prev) {
    var cur = false;
    svgElement = svgElement || SVGRoot.getElementById('sequence');

    // decide if we are drawing a path or text or starting a figure
    if (paths.path) {
        var path = document.createElementNS(svgNS, "path");
        path.setAttribute('d', `M ${roundTwo(X)},${roundTwo(Y)} ${paths.path}`);

        function pathStyle(styleList) {
            var styleStrings = [];
            for (let i = 0; i < styleList.length; i++) styleStrings.push(style[styleList[i]]);
            return styleStrings.join(';');
        };
        path.setAttribute('style', pathStyle(paths.style.split(';')));

        if (paths.class) path.setAttribute('class', paths.class);
        if (paths.handle && svgElement.id) {
            path.setAttribute('id', `${svgElement.id}-${paths.handle}`);
        }
        // option for rotating paths. Not used yet but may become usefull
        // for fitting rolls and snaps to curve in top or bottom of loop
        if ('rotate' in paths) {
            path.setAttribute('transform', `rotate(${paths.rotate} ${X} ${Y})`);
        }
        svgElement.appendChild(path);
    } else if (paths.text) {
        var text = drawText(
            paths.text,
            roundTwo(X + paths.x),
            roundTwo(Y + paths.y),
            paths.style,
            paths['text-anchor'],
            false,
            svgElement,
            paths.params
        );

        // Following is used to check subsequent rolls for overlap and
        // apply corrections. We use two ellipses sized to fit the text BBox
        // to determine the correct distance.

        // If we are dealing with a rollText of 5 characters or less, create
        // cur. Longer texts are just too hard to separate consistently.
        if ((paths.text.length <= 5) && (paths.style == 'rollText')) {
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
                text.setAttribute('x', roundTwo(X + paths.x - cos * overlap));
                text.setAttribute('y', roundTwo(Y + paths.y - sin * overlap));
            }
        }
    } else if (paths.textBlock) {
        var tb = paths.textBlock;
        var spans = tb.getElementsByTagName('tspan');
        // set all tspan x values
        for (let i = 0; i < spans.length; i++) {
            spans[i].setAttribute('x', roundTwo(X + paths.x));
        }
        // set text x value
        tb.setAttribute('x', roundTwo(X + paths.x));
        tb.setAttribute('y', roundTwo(Y + paths.y));
        // when a rotation is specified, rotate around center
        svgElement.appendChild(tb);
        if (paths.r) {
            var box = tb.getBBox();
            tb.setAttribute('transform', `rotate (${paths.r},${roundTwo(box.x + box.width / 2)},${roundTwo(box.y + box.height / 2)})`);
        }
    } else if (paths.figureStart) {
        // Check if figure starts do not overlap when this is not the first
        // figure
        if (figureStart.length > 0) {
            // count is used to make sure there is never an infinite loop
            var count = 0;
            do {
                // Walk through the figure starts and see if we find any distance
                // lower than minimum with the one we're making now
                var overlap = false;
                for (let i = 0; i < figureStart.length; i++) {
                    var distSq = (figureStart[i].x - X) * (figureStart[i].x - X) +
                        (figureStart[i].y - Y) * (figureStart[i].y - Y);
                    if (distSq < minFigStartDistSq) {
                        // found one that's too close. Move the start down and run again
                        Y = parseInt(figureStart[i].y + Math.sqrt(minFigStartDistSq - ((figureStart[i].x - X) * (figureStart[i].x - X))) + 1);
                        overlap = true;
                        count++;
                        break; // break for loop
                    }
                }
            } while (overlap && (count < 10000));
            Y = roundTwo(Y);
        }
        // Put this figure's start in the figureStart array for checking
        // against the next one
        figureStart.push({ 'x': X, 'y': Y });
    }
    if ('dx' in paths) X = roundTwo(X + paths.dx);
    if ('dy' in paths) Y = roundTwo(Y + paths.dy);
    return cur;
}

// drawLine draws a line from x,y to x+dx,y+dy in style styleId
// When an svg object is provided, it will be used i.s.o. the standard sequenceSvg
function drawLine(x, y, dx, dy, styleId, svg) {
    svg = svg || SVGRoot.getElementById('sequence');
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute('d', `M ${roundTwo(x)},${roundTwo(y)} l ${roundTwo(dx)},${roundTwo(dy)}`);
    path.setAttribute('style', style[styleId]);
    svg.appendChild(path);
}

// drawRectangle draws a rectangle at position x, y in style styleId
// When an svg object is provided, it will be used i.s.o. the standard
// sequenceSvg
// If style[styleId] does not exist, use styleId as style directly
// The function returns the drawn rectangle
function drawRectangle(x, y, width, height, styleId = '', svg = SVGRoot.getElementById('sequence')) {
    const path = document.createElementNS(svgNS, "rect");
    path.setAttribute('x', x);
    path.setAttribute('y', y);
    path.setAttribute('width', width);
    path.setAttribute('height', height);
    path.setAttribute('style', style[styleId] || styleId);
    svg.appendChild(path);
    return path;
}

// drawText draws any text at position x, y in style styleId with
// optional anchor, id, svg
function drawText(text, x, y, styleId, anchor, id, svg, params={}) {
    svg = svg || SVGRoot.getElementById('sequence');
    var newText = document.createElementNS(svgNS, "text");
    if (id) newText.setAttribute('id', id);
    if (style && styleId) newText.setAttribute('style', style[styleId]);
    if (anchor) newText.setAttribute('text-anchor', anchor);
    newText.setAttribute('x', roundTwo(x));
    newText.setAttribute('y', roundTwo(y));
    // Add additional parameters
    for (let key in params) newText.setAttribute (key, params[key]);
    var textNode = document.createTextNode(text);
    newText.appendChild(textNode);
    svg.appendChild(newText);
    return newText;
}

// drawTextArea draws any text area at position x, y in style styleId
// with optional anchor and id
// w and h are width and height. With one of them not set the other will
// be determined automatically
function drawTextArea(text, x, y, w, h, styleId, id, svg) {
    svg = svg || SVGRoot.getElementById('sequence');

    // determine current svg width for later checking of correct
    // foreignObject handling
    var svgWidth = svg.getBBox().width;

    var newText = document.createElementNS(svgNS, "foreignObject");
    var div = document.createElement('div');
    newText.setAttribute('x', roundTwo(x));
    newText.setAttribute('y', roundTwo(y));
    if (w) {
        div.setAttribute('width', roundTwo(w));
        newText.setAttribute('width', roundTwo(w));
    }
    if (h) newText.setAttribute('height', roundTwo(h));
    div.innerHTML = text;
    if (styleId) div.setAttribute('style', style[styleId]);
    newText.appendChild(div);
    svg.appendChild(newText);

    // A bug in the Windows app causes the width of the svg to
    // be incorrect when using foreignObject. So we check the new
    // width. If it's wrong, redo everything as text lines
    if (w && svg.getBBox().width > Math.max(svgWidth, x + w)) {
        newText.remove();
        var
            newText = document.createElementNS(svgNS, 'g'),
            words = text.split(' '),
            textLine = document.createElementNS(svgNS, "text"),
            textNode = document.createTextNode('|');

        // First we find out the line height using | character
        textLine.appendChild(textNode);
        newText.appendChild(textLine);
        svg.appendChild(newText);
        if (styleId) newText.setAttribute('style', style[styleId]);
        var lineHeight = textLine.getBBox().height;
        y += lineHeight;
        // Now that we know, start building the lines, word by word
        textLine.firstChild.data = words[0];
        textLine.setAttribute('x', roundTwo(x));
        textLine.setAttribute('y', roundTwo(y));
        for (let i = 1; i < words.length; i++) {
            var len = textNode.data.length;
            textLine.firstChild.data += ` ${words[i]}`;
            if (textLine.getComputedTextLength() > w) {
                textLine.firstChild.data = textLine.firstChild.data.slice(0, len);
                textLine = document.createElementNS(svgNS, "text");
                y += lineHeight;
                textLine.setAttribute("x", roundTwo(x));
                textLine.setAttribute("y", roundTwo(y));
                textNode = document.createTextNode(words[i]);
                textLine.appendChild(textNode);
                newText.appendChild(textLine);
            }
        }
    }

    if (id) newText.setAttribute('id', id);

    return newText;

}

// drawCircle draws a circle
function drawCircle(attributes, svg) {
    svg = svg || SVGRoot.getElementById('sequence');
    let circle = document.createElementNS(svgNS, "circle");
    for (let key in attributes) circle.setAttribute(key, attributes[key]);
    svg.appendChild(circle);
}

// drawImage draws an image
function drawImage(attributes, svg) {
    svg = svg || SVGRoot.getElementById('sequence');
    var image = document.createElementNS(svgNS, 'image');
    for (let key in attributes) {
        if (key === 'href') {
            image.setAttributeNS(xlinkNS, 'href', attributes.href);
        } else image.setAttribute(key, attributes[key]);
    }
    svg.appendChild(image);
    return image;
}

// Functions for setting up the software

// doOnLoad is only called on initial loading of the page
function doOnLoad() {

    // Immediately remove splash screen on Windows or Cordova app
    // as splash screen is shown by the app itself
    if (platform.uwp || platform.cordova) $('loading').remove();

    // Check browser requirements by checking for Promise support.
    // OpenAero will not function without it!
    // Support has existed in all major browsers since 2016. Other
    // technologies used in OpenAero are older so this should be the most
    // limiting.
    if (!('Promise' in window)) {
        document.getElementsByTagName('body')[0].innerHTML = `<h2><center>${userText.oldBrowser}${userText.getChrome}</center></h2>`;
        throw new Error('Browser not capable of running OpenAero');
    }

    // define DOM variables
    sequenceText = $('sequence_text');
    sportingClass = $('class');
    rulesWorker.postMessage({ action: 'sportingClass', class: sportingClass.value });
    fileName = $('fileName');

    // Cordova app settings
    if (platform.cordova) {
        
        if (device.isiOSAppOnMac) {
            // Use the desktop interface when running on Mac
            platform.mobile = false;
            /** QR Scanner disabled as it crashes app
            // Update menu for QR code scanning
            $('t_openSequenceLink').parentNode.classList.remove('divider');
            $('t_scanQRcode').parentNode.classList.remove('noDisplay');
            */
            // handle OpenURL for iOS
            window.handleOpenURL = cordovaHandleOpenURL;
            // don't shrink view on Mac when entering text
            Keyboard.shrinkView(false);
            Keyboard.hideFormAccessoryBar(true);
        } else {
            // Set mobile interface
            mobileInterface();
            // scroll input field into view where applicable
            // Supported in Chrome and Safari 2018-01-17
            window.addEventListener('keyboardDidShow', () => {
                document.activeElement.scrollIntoViewIfNeeded();
            });

            // set File menu and dialog items
            // Update menu for QR code scanning
            $('t_openSequenceLink').parentNode.classList.remove('divider');
            $('t_scanQRcode').parentNode.classList.remove('noDisplay');
            // Update menu for saving, emailing and sharing of sequence
            $('t_saveSequence').parentNode.classList.add('noDisplay');
            $('t_emailSequence').parentNode.classList.add('noDisplay');
            $('t_saveShareSequence').parentNode.classList.remove('noDisplay');
            // Update save dialog
            $('saveFileAddSequenceLink').classList.remove('noDisplay');

            switch (device.platform.toLowerCase()) {
                case 'ios':
                    // handle OpenURL for iOS
                    window.handleOpenURL = cordovaHandleOpenURL;

                    // shrink view for iOS when keyboard pops up
                    Keyboard.shrinkView(true);

                    // fix iOS Cordova contenteditable focus bug by setting
                    // contentEditable to false on blur and restoring on focus
                    sequenceText.addEventListener('blur', () => {
                        sequenceText.setAttribute('contentEditable', false);
                    });
                    sequenceText.addEventListener('touchstart', () => {
                        sequenceText.setAttribute('contentEditable', true);
                    });
                    sequenceText.addEventListener('focus', () => {
                        sequenceText.setAttribute('contentEditable', true);
                    });

                    // Make sure full height is used before selecting keyboard
                    // (seems like iOS bug)
                    sequenceText.focus();

                    // add status bar inside webview
                    $('cordovaStatusBar').classList.remove('noDisplay');
                    $('mainOverlay').classList.add('iosCordova');
                    setTimeout(function(){StatusBar.styleDefault();},1000);

                    break;
                case 'android':
                    // handle Intents for Android
                    window.plugins.intent.setNewIntentHandler(cordovaHandleIntent);
                    window.plugins.webintent.onNewIntent(function (uri) {
                        if (uri.match(/^https:\/\/openaero.net\/\?s=/)) {
                            launchURL({ url: uri });
                        }
                    });
                    // Handle the Intent when the app is not open
                    // This will be executed only when the app starts or wasn't active
                    // in the background
                    window.plugins.intent.getCordovaIntent(cordovaHandleIntent);
                    // Correctly set status bar in 2 seconds
                    setTimeout(function(){
                        StatusBar.overlaysWebView(false);
                        StatusBar.backgroundColorByHexString("#512da8");
                    }, 2000);
                    break;
            }

            // Remove splash screen in 1 second
            setTimeout(function () {navigator.splashscreen.hide();}, 1000);
        }
    }

    // Check if localStorage is supported.
    try {
        storage = (typeof localStorage != 'undefined') ? true : false;
    } catch (err) { storage = false };

    getLocal('fileName', function (value) { fileName.innerText = value });

    // set correct options and menu items in various places
    setOptions();

    // Parse the figures file
    parseFiguresFile();

    // Define the default language and userText now as they are used
    // in other functions during load
    updateUserTexts();

    // load settings from storage
    loadSettingsStorage();
    loadPrintDialogStorage();

    // load private logos
    getLocal('logoImages', function (privateLogoImages) {
        privateLogoImages = JSON.parse(privateLogoImages);
        for (let key in privateLogoImages) {
            logoImages[key] = privateLogoImages[key];
        }
    });
    // check for existence of logoSelectionCount
    getLocal('logoSelectionCount', function (count) {
        if (!count) {
            // by default, set CIVA logo to 3 selections so it starts in front
            storeLocal('logoSelectionCount', JSON.stringify({ CIVA: 3 }));
        }
    });

    // Send the sources of all rule scripts to rulesWorker, which can use
    // them to determine rule year.
    var
        scripts = document.getElementsByTagName('script'),
        scriptSrc = [];
    for (let i = 0; i < scripts.length; i++) {
        if (/rules\/rules[0-9][0-9]+.*.js$/.test(scripts[i].src)) scriptSrc.push(scripts[i].src);
    }
    // Parse the rules
    rulesWorker.postMessage({
        action: 'initialize',
        arestiToFig, arestiToFig,
        fig: fig,
        rollFig: rollFig,
        rules: rules,
        scriptSrc: scriptSrc,
        superFamilies: superFamilies
    });

    // add all listeners for clicks, keyup etc
    addEventListeners();

    if (!(platform.android || platform.ios || platform.uwp || platform.windows10)) {
        // setup PWA handler. Must be done early to ensure triggering of
        // beforeinstallprompt
        var installPWA = $(platform.mobile ?
            'mobileInstallPWA' : 't_installApp');
        window.addEventListener('beforeinstallprompt', (e) => {
            platform.supportsPWA = true;
            installPWA.addEventListener('mousedown', () => {
                installPWA.parentNode.classList.add('noDisplay');
                e.prompt();
            });
        });
    }
    // Give Cordova or PWA three seconds to start, then...
    setTimeout(function () {
        if (!platform.cordova) checkForApp();
    }, 3000);

    // build sequence svg
    rebuildSequenceSvg();

    // remove zoomMenu when zoom is not supported
    if (!('zoom' in document.body.style) && !platform.mobile) {
        $('zoomMenu').classList.add('noDisplay');
    }

    // by default, do not allow drag & drop of files to OpenAero
    document.body.addEventListener('dragover', noDragOver);
    document.body.addEventListener('drop', noDrop);

    // check for drag n drop support and correctly set dropzones
    var dropZone = $('fileDrop');
    if ('ondrop' in dropZone) {
        // Setup the drag n drop listeners for multi file checking
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', updateCheckMulti, false);
        $('t_chooseFiles').innerHTML = userText.chooseFilesOrDrop;
        $('t_chooseFiles').id = 't_chooseFilesOrDrop';
        // Setup the drag n drop listeners for multi file printing
        var dropZone = $('fileDropPrint');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', updatePrintMulti, false);
        $('t_chooseFilesPrint').innerHTML = userText.chooseFilesOrDropPrint;
        $('t_chooseFilesPrint').id = 't_chooseFilesOrDropPrint';
        // Setup the drag n drop listeners for logo uploading
        var dropZone = $('fileDropLogo');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', openLogoFile, false);
        // Setup the drag n drop listener for file opening
        if (!platform.mobile) {
            $('topBlock').addEventListener('dragover', handleDragOver, false);
            $('topBlock').addEventListener('drop', dropSequence);
            $('main').addEventListener('drop', dropSequence);
            $('main').addEventListener('dragover', handleDragOver, false);
        }
    }

    // Activate the first figure selection group
    changeFigureGroup();
    $('figureHeader').innerHTML = '';
    // Add plus and minus elements such as used in entry/exit line adjustment
    addPlusMinElements();
    // Build the buttons
    buildButtons();
    // Prepare figure editor
    updateFigureEditor();
    // Update save as PNG or SVG height
    saveImageSizeAdjust();
    // Set default Y axis offset and start direction
    setYAxisOffset(yAxisOffsetDefault);
    Direction = 0;
    // Set OpenAero version for saving
    $('oa_version').value = version;

    // add Team select list
    var fragment = document.createDocumentFragment();
    var sortKeys = Object.keys(iocCountriesReverse).sort();
    sortKeys[-1] = '';
    for (let i = -1; i < sortKeys.length; i++) {
        var option = document.createElement('option');
        option.value = option.text = sortKeys[i];
        fragment.appendChild(option);
    }
    $('team').appendChild(fragment);

    // Load sequence from URL if sequence GET element is set.
    // Reload with clean url if storage is true
    if (launchURL({ 'url': window.document.URL }) && storage) {
        window.location = window.document.URL.replace(/\?s.+/, '');
    }

    // When no sequence is active yet, load sequence storage (if any).
    // Do this after the rules have been loaded to make sure rules stay
    // in Sequence info
    if (!activeSequence.xml) {
        getLocal('sequence', s => {
            activeSequence.xml = s;
            activateXMLsequence(activeSequence.xml);
        });
    }

    // Add combo box functions for rules/category/program input fields
    new combo('rules');
    new combo('category');
    new combo('program');
    changeCombo('program');

    // Check if the sequence displayed is the one in the input field
    checkSequenceChanged();
    // Select active Form.
    // Need to do this to make sure the sequence is drawn when loaded
    // from localStorage or url
    selectForm(activeForm);

    if (platform.smallMobile) selectTab('tab-sequenceInfo');

    // Enable hiding dialogs by tapping outside dialog, but not in scrollbars
    var els = document.getElementsByClassName('boxbg');
    for (let i = els.length - 1; i >= 0; i--) {
        els[i].addEventListener('mousedown', function (e) {
            if (e.target && e.target.classList &&
                e.target.classList.contains('boxbg') &&
                (e.target.clientWidth >= e.clientX) &&
                (e.target.clientHeight >= e.clientY)) {
                this.classList.add('noDisplay');
            }
        }
        );
    }

    // Similarly, enable hiding the top dialog by using the Android back button
    if (platform.android) {
        document.addEventListener("backbutton", function() {
            var els = document.getElementsByClassName('boxbg');
            for (let i = els.length - 1; i >= 0; i--) {
                if (!els[i].classList.contains('noDisplay')) {
                    els[i].classList.add('noDisplay');
                    return;
                }
            }
        });
    }

    // Enable expansion panel toggles
    var els = document.getElementsByClassName('expand-toggle');
    for (let i = els.length - 1; i >= 0; i--) {
        if (els[i].parentNode.id === 'rulesLabel') {
            els[i].parentNode.addEventListener('mousedown', () => {
                $('rulesLabel').parentNode.classList.toggle('expanded');
                panelHeader($('activeRules'));
            }
            );
        } else if (els[i].parentNode.id === 'contestLabel') {
            els[i].parentNode.addEventListener('mousedown', () => {
                $('contestLabel').parentNode.classList.toggle('expanded');
                panelHeader($('activeContest'), userText.contest);
            });
        } else {
            els[i].parentNode.addEventListener('mousedown', function (e) {
                e.target.parentNode.parentNode.classList.toggle('expanded');
            });
        }
    }

    // Check if we are running from a file
    if (!platform.cordova && window.location.protocol === 'file:') {
        if (presentFileError) errors.push(userText.runFromFile);
    }

    // set alert if localStorage is disabled
    if (!storage) errors.push(userText.noCookies);

    // show alert box for any errors
    if (errors.length) alertBox(`<p>${errors.join('</p><p>')}</p>`);
    errors = [];

    // Check if an update has just been done
    checkUpdateDone();

    // retrieve queue from storage
    queueFromStorage();

    // check for latest version in a second
    setTimeout(getLatestVersion, 1000);

    // add submenu showing/hiding
    addMenuEventListeners();

    // Load completed, except possibly for asynchronous rule loading.
    // Fade out and remove splash screen in a second
    if (!(platform.cordova || platform.uwp)) {
        setTimeout(function () { $('loading').style = 'opacity: 0.01;'; }, 600);
        setTimeout(function () { $('loading').remove(); }, 1000);
    }
}

// launchURL is run during doOnLoad (web) or on event onLaunched (App)
// and retrieves sequence from URL (if any). It returns true on succes
// or false on faillure
function launchURL(launchData) {
    // remove newlines if present
    launchData.url = launchData.url.replace(/[\n\r]/g, '');
    // check format
    var match = launchData.url.toString().match(/\?(sequence|s)=.+/);
    if (match) {
        match = match[0].replace(/^\?(sequence|s)=/, '');
        if (match.match(/^%3Csequence%3E/)) {
            // before 1.5.0    : URI encoded link
            // decode %2B to + character
            var string = decodeURI(match.replace(/%2B/g, '+'));
        } else {
            // 1.5.0 and later : base64url encoded link
            var string = decodeBase64Url(match);
            if (string === false) {
                alertBox(sprintf(userText.openSequenceLinkError, launchData.url),
                    userText.openSequenceLink);
                return false;
            }
            // test for first character code between 128 and 159
            if (string.charCodeAt(0) >= 128 && string.charCodeAt(0) <= 159) {
                // 2021.1.10 and later : restore xml tags and decompress sequence_text
                var
                    i = 0,
                    label = "",
                    result = '<sequence>';
                while (i < string.length) {
                    label = sequenceXMLlabels[string.charCodeAt(i) - 128];
                    result += `<${label}>`;
                    i++;
                    while (i < string.length &&
                        (string.charCodeAt(i) < 128 || string.charCodeAt(i) > 159)) {
                        if (label == 'sequence_text' && string.charCodeAt(i) > 159) {
                            if (string.charCodeAt(i) == 255) {
                                // special character after 255 code
                                i++;
                                if (i < string.length) result += string[i];
                            } else {
                                // Add two identical regular characters
                                result += String.fromCharCode(string.charCodeAt(i) - 128, string.charCodeAt(i) - 128);
                            }
                        } else {
                            // Add regular character or control character (e.g. newline)
                            result += string[i];
                        }
                        i++;
                    }
                    result += `</${label}>`;
                }
                string = result + '</sequence>';
            } else if (/<\/>/.test(string)) { // test for empty end tag
                // 2016.3.2 up to 2021.1.10 : restore xml end tags and sequence tags
                var tags = [];
                var parts = string.split('<');
                for (let i = 1; i < parts.length; i++) {
                    if (/^\/>/.test(parts[i])) {
                        parts[i] = `/${tags.pop()}${parts[i].substring(1)}`;
                    } else {
                        tags.push(parts[i].match(/^[^>]+/)[0]);
                    }
                }
                string = `<sequence>${parts.join('<')}</sequence>`;
            }
        }
        updateSaveFilename(); // clear filename
        return activateXMLsequence(string);
    }
    return false;
}

// keyListener listens to key strokes for various usages
function keyListener(e) {
    // do not handle keys when in input area
    if (e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA") return;
    if (e.target.isContentEditable) return;
    // use delete key for deleting figure
    if (e.keyCode == 46) {
        $('deleteFig').click();
    }
}

// appZoom adds zoom functionality to the app and is called by keydown
function appZoom(e) {
    var zoomSteps = ['0.33', '0.5', '0.67', '0.75', '0.9', '1',
        '1.1', '1.25', '1.5', '1.75', '2', '2.5', '3'];
    if (platform.mobile) {
        var zoom = (parseInt(
            $('zoom').textContent.match(/\d+/)[0]) /
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
        $('zoom').textContent = parseInt(zoom * 100) + '%';
        if (platform.mobile) {
            checkSequenceChanged(true);
        } else {
            document.body.style.zoom = zoom;
        }
    }
    // don't bubble key
    return false;
}

// addEventListeners adds all event listeners for actions.
function addEventListeners() {
    document.addEventListener('keydown', keyListener, false);

    if (platform.touch) {
        // zoom for touch devices
        document.addEventListener('keydown', appZoom, false);

        // remove all menus when tapping anywhere outside menu
        document.addEventListener('touchstart', function (evt) {
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
        // drop any dragged object when releasing touch
        window.addEventListener('touchend', Drop);
    }

    // drop any dragged object when releasing mouse anywhere
    window.addEventListener('mouseup', Drop);

    // menu
    $('hamburgerMenu').addEventListener('mousedown', menuActive);
    $('file').addEventListener('mousedown', () => {
        setTimeout(menuInactiveAll, 1000);
    }, true);
    $('fileForm').addEventListener('mousedown', function () { this.reset() }, false);
    $('file').addEventListener('change', openSequence, false);
    $('t_openSequence').parentNode.addEventListener('mousedown', $('file').mousedown, false);
    $('t_openSequenceLink').parentNode.addEventListener('mousedown', openSequenceLink, false);
    $('t_scanQRcode').parentNode.addEventListener('mousedown', scanQRcode, false);
    $('t_clearSequence').parentNode.addEventListener('mousedown', clearSequence, false);
    $('t_saveSequence').parentNode.addEventListener('mousedown', saveSequence, false);
    $('t_emailSequence').parentNode.addEventListener('mousedown', emailSequence, false);
    $('t_saveShareSequence').parentNode.addEventListener('mousedown', saveSequence, false);
    $('t_saveAsLink').parentNode.addEventListener('mousedown', saveAsURL, false);
    $('t_qrCode').parentNode.addEventListener('mousedown', QRcode, false);
    $('exitDesigner').addEventListener('mousedown', () => { exitFuDesigner(false) }, false);
    $('t_saveFigsSeparate').parentNode.addEventListener('mousedown', saveFigs, false);
    $('t_printSaveForms').parentNode.addEventListener('mousedown', () => { printDialog(true) }, false);

    $('t_formA').parentNode.addEventListener('mousedown', () => { selectForm('A') }, false);
    $('t_formB').parentNode.addEventListener('mousedown', () => { selectForm('B') }, false);
    $('t_formC').parentNode.addEventListener('mousedown', () => { selectForm('C') }, false);
    $('t_figsInGrid').parentNode.addEventListener('mousedown', () => { selectForm('G') }, false);
    $('t_flyingMode').parentNode.addEventListener('mousedown', flyingMode, false);
    $('zoomMin').addEventListener('mousedown', () => { appZoom(-1) }, false);
    $('zoomPlus').addEventListener('mousedown', () => { appZoom(1) }, false);

    $('t_flipYAxis').parentNode.addEventListener('mousedown', flipYAxis, false);
    $('t_clearPositioning').parentNode.addEventListener('mousedown', clearPositioningOption, false);
    $('t_separateFigures').parentNode.addEventListener('mousedown', separateFigures, false);
    $('t_checkSequence').parentNode.addEventListener('mousedown', () => { checkSequence(true) }, false);
    $('lockSequence').addEventListener('mousedown', lockSequence);
    $('unlockSequence').addEventListener('mousedown', lockSequence);

    $('t_showQueue').parentNode.addEventListener('mousedown', showQueue, false);
    $('t_addToQueue').parentNode.addEventListener('mousedown', addToQueue, false);
    $('t_addAllToQueue').parentNode.addEventListener('mousedown', addAllToQueue, false);
    $('t_clearQueue').parentNode.addEventListener('mousedown', clearQueue, false);
    $('queue').addEventListener('change', openQueue, false);
    $('t_saveQueueFile').parentNode.addEventListener('mousedown', saveQueue, false);

    $('t_fuDesigner').parentNode.addEventListener('mousedown', startFuDesigner, false);
    $('t_checkMultipleSeq').parentNode.addEventListener('mousedown', () => { checkMultiDialog(true) }, false);
    $('t_printMultipleSeq').parentNode.addEventListener('mousedown', printMultiDialog, false);
    $('rulesFile').addEventListener('change', openRulesFile, false);
    $('t_settings').parentNode.addEventListener('mousedown', settingsDialog, false);

    $('t_finalizeSequence').addEventListener('mousedown', () => { exitFuDesigner(false) });

    $('t_manual').parentNode.addEventListener('mousedown', () => {
        helpWindow('doc/manual.html', 'OpenAero manual');
    }, false);
    $('t_openaeroLanguage').parentNode.addEventListener('mousedown', () => {
        helpWindow('doc/language.html', 'OpenAero language');
    }, false);
    $('t_arestiSystem').parentNode.addEventListener('mousedown', () => {
        helpWindow('doc/aresti_system.html', 'The Aresti system');
    }, false);

    $('t_freeKnownGuidancePower').parentNode.addEventListener('mousedown', () => {
        helpWindow('doc/CIVA-Free-Known-Programme-Guidance-Power-Aircraft.html', 'CIVA Free Known Guidance Power');
    }, false);

    $('t_freeKnownGuidanceGlider').parentNode.addEventListener('mousedown', () => {
        helpWindow('doc/CIVA-Free-Known-Programme-Guidance-Glider-Aircraft.html', 'CIVA Free Known Guidance Glider');
    }, false);

    $('t_about').parentNode.addEventListener('mousedown',
        aboutDialog, false);

    // Flying mode
    $('t_exitFlyingMode').addEventListener('mousedown', exitFlyingMode, false);
    $('t_windArrow').addEventListener('mousedown', switchWindArrow, false)

    // sequence string
    $('undo').addEventListener('mousedown', clickButton, false);
    $('redo').addEventListener('mousedown', clickButton, false);
    sequenceText.addEventListener('input', checkSequenceChanged, false);
    sequenceText.addEventListener('keyup', checkSequenceChanged, false);
    sequenceText.addEventListener('mouseup', checkSequenceChanged, false);
    sequenceText.addEventListener('focus', virtualKeyboard, false);
    sequenceText.addEventListener('blur', virtualKeyboard, false);

    // virtual keyboard
    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
            $('virtualKeyboard').style.top = window.visualViewport.height - 42 + 'px';
            $('virtualKeyboard').style.bottom = 'auto';
        });
    }
    $('virtualKeyboard').addEventListener('mousedown', clickVirtualKeyboard, false);
    $('virtualKeyboard').addEventListener('mouseup', releaseVirtualKeyboard, false);

    // grid info
    if (platform.touch) {
        $('gridInfo').addEventListener('touchstart', grabFigure);
        $('gridInfo').addEventListener('touchmove', Drag);
    }
    $('gridInfo').addEventListener('mousedown', grabFigure);
    $('gridInfo').addEventListener('mousemove', Drag);

    $('gridColumns').addEventListener('change', updateGridColumns);
    $('gridOrderBy').addEventListener('change', () => { selectForm('G'); });
    $('manual_html_grid_system').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#grid_system', 'Grid system');
    }, false);
    $('t_proposalsCreateGroups').addEventListener('mousedown', proposalsDialog, false);

    // left block tabs
    $('tab-sequenceInfo').addEventListener('mousedown', selectTab, false);
    $('tab-figureInfo').addEventListener('mousedown', selectTab, false);
    $('tab-sequenceArea').addEventListener('mousedown', selectTab, false);
    $('tab-fuFigures').addEventListener('mousedown', selectTab, false);

    // sequence info options
    $('pilot').addEventListener('change', changeSequenceInfo, false);
    $('pilot').addEventListener('keydown', function (e) {
        if (e.shiftKey && (e.keyCode == 9)) {
            $('notes').focus();
            e.preventDefault();
        }
    }, false);
    $('team').addEventListener('change', changeSequenceInfo, false);
    $('actype').addEventListener('change', changeSequenceInfo, false);
    $('acreg').addEventListener('change', changeSequenceInfo, false);

    sportingClass.addEventListener('change', selectPwrdGlider, false);
    $('positioning').addEventListener('change', changeSequenceInfo, false);
    $('t_referenceSequence').addEventListener('mousedown', referenceSequenceDialog);
    $('harmony').addEventListener('change', changeSequenceInfo, false);

    $('copyContest').addEventListener('mousedown', copyContest, false);
    $('pasteContest').addEventListener('mousedown', pasteContest, false);
    $('lockContest').addEventListener('mousedown', lockContest, false);
    $('location').addEventListener('change', changeSequenceInfo, false);
    $('date').addEventListener('change', changeSequenceInfo, false);
    $('t_chooseLogo').addEventListener('mousedown', logoChooser, false);
    $('removeLogo').addEventListener('mousedown', removeLogo, false);
    $('logoImage').addEventListener('mousedown', logoChooser, false);
    $('t_logoChooserCancel').addEventListener('mousedown', hideLogoChooser, false);
    $('logoFile').addEventListener('change', openLogoFile, false);

    $('notes').addEventListener('input', changeSequenceInfo, false);
    $('notes').addEventListener('keydown', function (e) {
        if (e.keyCode == 9) {
            $('pilot').focus();
            e.preventDefault();
        }
    }, false);

    // figure editor options
    $('manual.html_adding_a_figure').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#adding_a_figure', 'Adding a figure');
    }, false);
    $('manual.html_figure_comments').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#figure_comments', 'Figure comments');
    }, false);

    $('subSequenceDirection').addEventListener('change', updateFigure, false);
    $('addFigureText').addEventListener('mousedown', showFigureSelector, false);
    $('subSequence').addEventListener('click', clickButton, false);
    $('deleteFig').addEventListener('click', clickButton, false);
    $('flipYAxis').addEventListener('click', clickButton, false);
    $('switchFirstRoll').addEventListener('click', clickButton, false);
    $('switchY').addEventListener('click', clickButton, false);
    $('switchX').addEventListener('click', clickButton, false);
    $('magMin').addEventListener('click', clickButton, false);
    $('magPlus').addEventListener('click', clickButton, false);
    $('moveForward').addEventListener('click', clickButton, false);
    $('straightLine').addEventListener('click', clickButton, false);
    $('curvedLine').addEventListener('click', clickButton, false);
    $('moveX').addEventListener('change', updateFigure, false);
    $('moveY').addEventListener('change', updateFigure, false);
    $('rotate90').addEventListener('click', clickButton, false);
    $('unknownFigure').addEventListener('change', updateFigure, false);
    $('figEntryButton').addEventListener('click', clickButton, false);
    $('figExitButton').addEventListener('click', clickButton, false);
    // $('comments').addEventListener('change', updateFigureComments);
    $('comments').addEventListener('input', updateFigureComments);

    // figure selector
    $('manual.html_the_figure_chooser').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#adding_a_figure', 'Adding a figure');
    }, false);
    $('figureStringInput').addEventListener('input', changeFigureString, false);
    $('hideIllegal').addEventListener('change', changeHideFigs, false);
    $('hideRarelyUsed').addEventListener('change', changeHideFigs, false);
    $('hideFigureSelector').addEventListener('mousedown', hideFigureSelector, false);
    $('figureGroup').addEventListener('change', changeFigureGroup, false);
    window.addEventListener('resize', adjustMiniFormAPosition, false);

    // Sequence area
    $('manual_html_optimal_sequence_area').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#optimal_sequence_area', 'OpenAero manual');
    }, false);

    // logo chooser
    $('manual_html_contest_information').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#contest_information', 'Grid system');
    }, false);

    // close alert box
    $('t_closeAlert').addEventListener('click', () => { alertBox() }, false);

    // close help box
    $('closeHelp').addEventListener('mousedown', () => {
        $('helpBox').classList.add('noDisplay');
    }, false);
    // confirm box
    $('t_confirmBoxNo').addEventListener('click', () => { confirmBox() }, false);

    // check sequence dialog
    $('t_checkSequenceOK').addEventListener('click', () => { checkSequence() }, false);
    $('t_checkSequenceLog').addEventListener('click', () => { checkSequence('log') }, false);

    // check multiple dialog
    $('t_checkMultiUseReference').addEventListener('mousedown', referenceSequenceDialog);
    $('checkMultiFiles').addEventListener('change', function () { updateCheckMulti(this) }, false);
    $('t_checkSequences').addEventListener('mousedown', checkMulti, false);
    $('t_checkMultiClose').addEventListener('click', () => { checkMultiDialog() }, false);

    // print multiple dialog
    $('printMultiFiles').addEventListener('change', function () { updatePrintMulti(this) }, false);

    // settings dialog
    $('manual.html_settings').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#settings', 'Settings');
    }, false);
    $('tab-general').addEventListener('click', selectTab, false);
    $('tab-styling').addEventListener('click', selectTab, false);
    $('tab-expert').addEventListener('click', selectTab, false);
    $('language').addEventListener('change', changeLanguage, false);
    $('smallMobile').addEventListener('change', switchSmallMobile, false);
    $('queueColumns').addEventListener('change', changeQueueColumns, false);
    $('positionClearAuto').addEventListener('change', () => { saveSettingsStorage() }, false);
    $('showHandles').addEventListener('change', () => {
        setFigureSelected(selectedFigure.id);
        saveSettingsStorage()
    }, false);
    $('showOptiSeqArea').addEventListener('change', () => {
        draw();
        saveSettingsStorage()
    }, false);
    $('saveFigsSeparateImageFormat').addEventListener('change', () => { saveSettingsStorage() }, false);
    $('saveFigsSeparateWidth').addEventListener('change', () => { saveSettingsStorage() }, false);
    $('saveFigsSeparateHeight').addEventListener('change', () => { saveSettingsStorage() }, false);
    $('zipImageFilenamePattern').addEventListener('change', () => { saveSettingsStorage() }, false);
    $('saveFigsSeparateFigureNumbers').addEventListener('change', () => { saveSettingsStorage() }, false);

    $('numberInCircle').addEventListener('change', updateNumberInCircle, false);
    $('rollFontSize').addEventListener('change', updateRollFontSize, false);
    $('rollSymbolSize').addEventListener('change', updateRollSymbolSize, false);

    $('nonArestiRolls').addEventListener('change', updateNonArestiRolls, false);
    $('styles').addEventListener('change', getStyle, false);
    $('styleString').addEventListener('input', updateStyle, false);
    $('t_resetStyle').addEventListener('mousedown', () => { resetStyle() }, false);
    $('t_resetStyleAll').addEventListener('mousedown', () => { resetStyle(true) }, false);
    $('t_stylingSave').addEventListener('mousedown', stylingSave, false);
    $('stylingFile').addEventListener('change', () => {
        openFile(this.files[0], 'Styling');
    }, false);
    $('newTurnPerspective').addEventListener('change', draw, false);
    $('t_restoreDefaultSettings').addEventListener('mousedown', restoreDefaultSettings, false);

    $('t_settingsClose').addEventListener('mousedown', () => { settingsDialog() }, false);

    // reference sequence dialog
    $('t_referenceSequenceClose').addEventListener('mousedown', () => { referenceSequenceDialog(false) });
    $('referenceSequenceString').addEventListener('input', changeReferenceSequence, false);

    // create proposals dialog
    $('t_proposalsCreate').addEventListener('mousedown', createFigureProposals);
    $('t_proposalsToGrid').addEventListener('mousedown', proposalsToGrid);
    $('t_proposalsDialogClose').addEventListener('mousedown', () => { proposalsDialog(false) });

    // save dialog
    $('dlTextField').addEventListener('input', () => { updateSaveFilename(this.value) }, true);
    // use 'click' to prevent OS save dialog blocking
    $('t_saveFile').addEventListener('click', () => {
        // close dialog 1 second after click
        window.setTimeout(function () { saveDialog() }, 1000);
        let name = sanitizeFileName($('dlTextField').value);
        if (platform.cordova) {
            cordovaSave(saveData.blob, name + saveData.ext);
        } else saveAs(saveData.blob, name + saveData.ext);
    });
    $('t_cancelSave').addEventListener('mousedown', () => { saveDialog() }, false);

    // iOS save dialog
    $('t_iOSsaveFile').addEventListener('click', () => {
        window.setTimeout(function () {
            $('iOSsaveDialog').classList.add('noDisplay');
        }, 200);
    }, false);
    $('t_iOScancelSave').addEventListener('mousedown', () => {
        $('iOSsaveDialog').classList.add('noDisplay');
    }, false);

    // openSequenceLink dialog
    $('t_openSequenceLinkOpen').addEventListener('mousedown', () => { openSequenceLink(true) });
    $('t_openSequenceLinkCancel').addEventListener('mousedown', () => { openSequenceLink(false) });

    // print/save image dialog
    var inputs = $('printDialog').getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', savePrintDialogStorage, false);
    }
    $('multiLogo').addEventListener('change', savePrintDialogStorage, false);
    $('manual.html_save_print').addEventListener('mousedown', () => {
        helpWindow('doc/manual.html#save_print', 'OpenAero manual');
    }, false);
    $('printPageSet').addEventListener('change', setPrintPageSet, false);
    $('printPageSetString').addEventListener('input', updatePrintPageSetLayout, false);
    $('printFormA').addEventListener('change', saveImageSizeAdjust, false);
    $('printFormB').addEventListener('change', saveImageSizeAdjust, false);
    $('printMiniFormAonB').addEventListener('change', updatePrintPageSetValue, false);
    $('printFormC').addEventListener('change', saveImageSizeAdjust, false);
    $('printMiniFormAonC').addEventListener('change', updatePrintPageSetValue, false);
    $('printFormR').addEventListener('change', saveImageSizeAdjust, false);
    $('printFormL').addEventListener('change', saveImageSizeAdjust, false);
    $('printFormGrid').addEventListener('change', saveImageSizeAdjust, false);
    $('formGridHeader').addEventListener('change', updatePrintPageSetValue, false);
    $('printFormPilotCards').addEventListener('change', setPilotCardForm, false);
    $('pilotCardPercent').addEventListener('mousedown', setPilotCardLayout, false);
    $('pilotCardPercentValue').addEventListener('input', changePilotCardPercent, false);
    $('pilotCard2').addEventListener('mousedown', setPilotCardLayout, false);
    $('pilotCard4').addEventListener('mousedown', setPilotCardLayout, false);
    $('pilotCard2QR').addEventListener('mousedown', setPilotCardLayout, false);
    $('imageWidth').addEventListener('change', saveImageSizeAdjust, false);
    $('imageHeight').addEventListener('change', saveImageSizeAdjust, false);
    $('pageSpacing').addEventListener('change', saveImageSizeAdjust, false);
    $('t_printSavePdf').addEventListener('mousedown', printForms, false);
    $('t_print').addEventListener('mousedown', printForms, false);
    $('t_savePdf').addEventListener('mousedown', printForms, false);
    $('t_saveAsPNG').addEventListener('mousedown', savePNG, false);
    $('t_saveAsSVG').addEventListener('mousedown', saveSVG, false);
    $('t_cancelPrint').addEventListener('mousedown', () => { printDialog() }, false);
    $('printNotesCopy').addEventListener('change', () => {
        $('printNotes').checked = $('printNotesCopy').checked;
    });

    // installApp banner
    $('closeInstallApp').addEventListener(
        'mousedown', () => {
            removeBanner($('installApp'));
        });

    // QR code scanner
    $('t_cancelQRscan').addEventListener('mousedown', cancelQRscan, false);

    // Printing
    window.onbeforeprint = beforePrint;
}

// addMenuEventListeners adds event listeners for showing and hiding
// submenus to all menus. Make sure we do this after rules are loaded by passing
// through rulesWorker
function addMenuEventListeners() {
    var id = uniqueId();
    workerCallback[id] = function () {
        // menu showing and hiding. Add listeners to all <li> menu items
        function addListeners(e) {
            var li = e.getElementsByTagName('li');
            for (let i = 0; i < li.length; i++) {
                if (platform.mobile) {
                    li[i].addEventListener('mousedown', menuActive);
                } else {
                    li[i].addEventListener('mouseover', menuActive);
                    li[i].addEventListener('mouseout', menuInactive);
                }
                if (!/^zoom.+/.test(li[i].id)) {
                    checkUL: {
                        var els = li[i].childNodes;
                        for (let j in els) {
                            if (els[j].tagName && (els[j].tagName === 'UL')) break checkUL;
                        }
                        li[i].addEventListener('mouseup', menuTouch);
                    }
                }
            }
        }

        addListeners($('menu'));

        // Load the mobile interface when applicable, but not on Cordova, where it can be
        // loaded after deviceReady
        if (!platform.cordova && (platform.mobile || platform.smallMobile)) mobileInterface();

        // when smallMobile is checked (loaded from settings), or when screen
        // width is small and no setting is found, switch to smallMobile.
        // Use window.screen.width to get CSS pixels
        if (platform.mobile && $('smallMobile').checked) {
            switchSmallMobile();
        } else if (window.screen.width < 640) {
            function f(settings) {
                if (!/\bsmallMobile\b/.test(settings)) {
                    $('smallMobile').checked = 'checked';
                    switchSmallMobile();
                }
            }

            if (storage) getLocal('settings', f); else f();
        }

    }
    rulesWorker.postMessage({ action: false, callbackId: id });
}

// checkForApp will check the platform and present appropriate
// information for getting an app
function checkForApp() {
    if (platform.chrome) {
        // chrome app is discontinued from june 2020 onwards
        confirmBox(userText.warningChrome, '', () => {
            window.open('https://openaero.net');
            chrome.management.uninstallSelf();
        });
    } else if (platform.android || platform.ios ||
        (platform.mobile && !(platform.cordova || platform.uwp))) {
        // Show the banner for getting the Android, iOS or PWA app under
        // certain conditions
        getLocal('installAppAsked', function (timestamp) {
            var
                banner = $('installApp'),
                t = parseInt((new Date()).getTime());

            if (timestamp) { // do not ask the first time
                if (timestamp < (t - 86400 * 7)) { // ask once a week
                    storeLocal('installAppAsked', t);
                    banner.classList.remove('noDisplay');
                    if (platform.android) {
                        banner.classList.add('android');
                    } else if (platform.ios) {
                        banner.classList.add('ios');
                    } else banner.classList.add('pwa');
                    // use setTimeout before showing to allow subtle entry
                    setTimeout(function () { banner.classList.add('show') }, 500);
                    setTimeout(function () { removeBanner(banner) }, 15000);
                }
            } else storeLocal('installAppAsked', 1);
        });
    } else if (platform.uwp) {
        // inside UWP app, do nothing
    } else if (platform.windows10) {
        // add the link to Windows 10 installation to Tools
        $('installDesktopApp').classList.remove('noDisplay');
        $('t_installApp').addEventListener(
            'mousedown', () => {
                window.location = platform.windowsStore;
            }
        );
    } else {
        // add the install link to Tools on PWA enabled browsers
        if (platform.supportsPWA) {
            $('installDesktopApp').classList.remove('noDisplay');
        }
    }
}

// Functions for interpreting user input and variables

// clickButton is called when clicking certain buttons
function clickButton() {
    var e = this;

    // don't click disabled buttons
    if (e.classList.contains('disable')) return;

    // when the figure is a Free (Un)known figure with a letter, don't
    // click disableFUfig buttons
    if (selectedFigure.id) {
        if (figures[selectedFigure.id].unknownFigureLetter) {
            if (figures[selectedFigure.id].unknownFigureLetter !== 'L') {
                if (e.classList.contains('disableFUfig')) {
                    return;
                }
            }
        }
    }

    switch (e.getAttribute('class')) {
        // handle min button
        case 'minButton':
            e.classList.add('on');
            window.setTimeout(function () {
                e.classList.remove('on');
            }, 200);
            e.nextSibling.value--;
            break;
        // handle plus button
        case 'plusButton':
            e.classList.add('on');
            window.setTimeout(function () {
                e.classList.remove('on');
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
                    if (e.classList.contains('on')) return;
                    e.classList.add('on');
                    window.setTimeout(function () { e.classList.remove('on'); }, 200);
                    break;
                case 'undo':
                case 'redo':
                    break;
                // switch between active/inactive buttons
                default:
                    e.classList.toggle('on');
            }
    }

    // disable the moveX/moveY selectors. They will be enabled depending
    // on the move button that's active
    $('moveXCont').classList.add('collapsed');
    $('moveYCont').classList.add('collapsed');

    // take action
    switch (e.id) {
        case 'undo':
            if (activeSequence.undo.length) {
                setTimeout(function () {
                    activeSequence.redo.push(activeSequence.xml);
                    activeSequence.addUndo = false;
                    activateXMLsequence(activeSequence.undo.pop());
                    changeSequenceInfo();
                    activeSequence.addUndo = true;
                    setUndoRedo();
                }, 200);
            }
            // don't continue. Not a figure function
            return;
        case 'redo':
            if (activeSequence.redo.length) {
                setTimeout(function () {
                    activeSequence.undo.push(activeSequence.xml);
                    activeSequence.addUndo = false;
                    activateXMLsequence(activeSequence.redo.pop());
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
                // when Y was flipped and we removed the figure with the only
                // flip symbol, put it back
                if (flipY && !activeSequence.text.replace(regexComments, '').match(regexFlipYAxis)) {
                    flipYAxis();
                }
                selectFigure(false);
            }
            // don't continue function, figure has been removed
            return;
        case 'flipYAxis':
            if (selectedFigure.id !== null) {
                function flipFigureYAxis(id) {
                    var v = figures[id].string;
                    if (v.replace(regexComments, '').match(regexFlipYAxis)) {
                        // disable flip
                        var t = '';
                        var inComment = false;
                        for (let i = 0; i < v.length; i++) {
                            // disregard / in comments
                            if (v[i] === userpat.comment) inComment = !inComment;
                            // check for single /
                            if ((v[i] !== '/') || inComment) t += v[i];
                        }
                        v = t;
                    } else {
                        v = userpat.flipYaxis + v;
                    }
                    updateSequence(id, v, true);
                }

                flipFigureYAxis(selectedFigure.id);
                // don't continue function. Figure already changed
                return;
            }
            break;
        case 'magMin':
            $('scale').value--;
            updateFigure();
            break;
        case 'magPlus':
            $('scale').value++;
            updateFigure();
            break;
        case 'moveForward':
            $('straightLine').classList.remove('on');
            $('curvedLine').classList.remove('on');
            if (e.classList.contains('on')) {
                // remove disabled for move
                $('moveXCont').firstElementChild.classList.add('noDisplay');
                $('moveXCont').classList.remove('collapsed');
                // set default of 2 if no value was set
                if ($('moveX-value').value == 0) $('moveX-value').value = 2;
            }
            break;
        case 'straightLine':
            $('moveForward').classList.remove('on');
            $('curvedLine').classList.remove('on');
            if (e.classList.contains('on')) {
                $('moveXCont').firstElementChild.classList.remove('noDisplay');
                $('moveXCont').classList.remove('collapsed');
                $('moveYCont').classList.remove('collapsed');
            }
            break;
        case 'curvedLine':
            $('straightLine').classList.remove('on');
            $('moveForward').classList.remove('on');
            if (e.classList.contains('on')) {
                $('moveXCont').firstElementChild.classList.remove('noDisplay');
                $('moveXCont').classList.remove('collapsed');
                $('moveYCont').classList.remove('collapsed');
            }
            break;
        case 'rotate90':
            // Define subsequent rotation steps
            var rotate = {
                '//': 'ej',
                eu: 'ej',
                ej: 'ed',
                ed: 'eja',
                eja: ''
            };
            // The first figure rotation is changed by changing sequence entry
            if (figures[selectedFigure.id].seqNr == 1) {
                if (figures[0] && entryOptions[figures[0].string]) {
                    updateSequence(0, rotate[figures[0].string], true);
                } else {
                    $('t_xBoxEntry').dispatchEvent(new Event('mousedown'));
                }
            } else
            // Subsequent figure rotations are changed using subsequence logic
            if (figures[selectedFigure.id].seqNr > 1) {
                if (figures[selectedFigure.id].subSequence) {
                    $('subSequenceDirections').value =
                        rotate[$('subSequenceDirections').value];
                    if (!$('subSequenceDirections').value) {
                        $('subSequence').classList.remove('on');
                    }
                } else {
                    $('subSequenceDirections').value = 'ej';
                    $('subSequence').classList.add('on');
                    // updateSequence(selectedFigure.id - 1, 'ej', false);
                }
                updateFigure();
            }
            break;
        case 'figEntryButton':
        case 'figExitButton':
            // switch button upright/inverted
            e.classList.toggle('inverted');
            break;
        case 'switchX':
        case 'switchY':
            var l = figures[selectedFigure.id].unknownFigureLetter;
            if (l && (l !== 'L') && ('switchFirstRoll' in figures[selectedFigure.id])) {
                $('switchFirstRoll').classList.toggle('on');
            }
    }
    updateFigure();
}

// addPlusMinElements creates plus/min elements on startup and when
// switching smallMobile
function addPlusMinElements() {
    var el = document.getElementsByClassName('plusMin');
    for (let i = el.length - 1; i >= 0; i--) {
        removeChildNodes(el[i]);
        buildPlusMinElement(el[i].id + '-value', 0, el[i]);
    }
}

// buildButtons builds the buttons on startup, or after being called by
// updateUserTexts
function buildButtons() {
    var el = document.getElementsByClassName('button');
    for (let i = el.length - 1; i >= 0; i--) {
        el[i].classList.remove('on');
    }
    // add tooltips, but not on touchscreen
    if (!platform.mobile && !platform.touch) {
        for (let key in userText.tooltip) {
            var el = $(key);
            // add empty div and class on first run
            if (!el.classList.contains('tooltip')) {
                el.classList.add('tooltip');
                el.appendChild(document.createElement('div'));
            }

            el.lastChild.innerHTML = userText.tooltip[key];
        }
    }
}

// build an element with plus/minus buttons and return it
function buildPlusMinElement(id, value, el) {
    el = el || document.createElement('span');

    var span = document.createElement('span');
    span.classList.add('minButton');
    span.addEventListener('click', clickButton, false);
    el.appendChild(span);

    var input = document.createElement('input');
    input.type = 'number';
    input.step = '1';
    input.setAttribute('id', id);
    input.setAttribute('value', value);
    input.classList.add('plusMinText');
    input.addEventListener('update', updateFigure, false);
    el.appendChild(input);

    var span = document.createElement('span');
    span.classList.add('plusButton');
    span.addEventListener('click', clickButton, false);
    el.appendChild(span);

    if (!platform.smallMobile && (userText.tooltip[id])) {
        el.classList.add('tooltip', 'ttRight');
        var div = document.createElement('div');
        div.innerHTML = userText.tooltip[id];
        el.appendChild(div);
    }

    return el;
}

// addRollSelectElement adds roll select elements to the parent element
function addRollSelectElement(figNr, rollEl, elNr, parent) {
    var
        thisRoll = figures[figNr].rollInfo[rollEl],
        thisAttitude = rollAttitudes[thisRoll.attitude],
        ruleCheckRolls = activeRules && (Object.keys(checkAllowCatId).length > 0),
        pattern = '',
        span = document.createElement('span'),
        html = `<div class="form-group"><select id="roll${rollEl}-${elNr}" class="rollSelect disableRollFUfig">`;

    span.classList.add('rollElement');

    // assign pattern, handle special case where (non-standard) 28 is used i.s.o. 8
    if (thisRoll.pattern[elNr]) pattern = thisRoll.pattern[elNr].replace(/^28$/, '8');

    // build the aileron roll options
    rollTypes.forEach ((r, i) => {
        let roll = r.split(':');
        // only show no roll, active roll and valid rolls
        if (i == 0 || roll[0] == pattern || !ruleCheckRolls ||
            $('nonArestiRolls').checked ||
            (rollFig[thisAttitude + roll[0]].aresti) in checkAllowCatId) {
            html += `<option value="${roll[0]}" class="rollSelectOption"`;
            if (roll[0] == pattern) html += ' selected="selected"';
            html += `>${roll[1]}</option>`;
        }
    });

    // Build the positive flick options. Also allow opposite attitude as
    // flick may have been proceeded by half roll, except on vertical
    thisAttitude = (thisRoll.negLoad ? '-' : '+') +
        rollAttitudes[thisRoll.attitude];
    var oppAttitude = (thisRoll.negLoad ? '+' : '-') +
        rollAttitudes[(thisRoll.attitude + 180) % 360];

    posFlickTypes.forEach(r => {
        let
            roll = r.split(':'),
            rollPattern = roll[0].replace(/^1/, '');

        if (rollPattern == pattern || !ruleCheckRolls ||
            $('nonArestiRolls').checked ||
            (rollFig[thisAttitude + roll[0]].aresti) in checkAllowCatId ||
            (((thisRoll.attitude % 180) != 90 &&
            rollFig[oppAttitude + roll[0]].aresti) in checkAllowCatId)) {
            html += `<option value="${rollPattern}" class="posFlickSelectOption"`;
            if (rollPattern == pattern) html += ' selected="selected"';
            html += `>${roll[1]}</option>`;
        }
    });

    // Build the negative flick options. Also allow opposite attitude as
    // flick may have been proceeded by half roll, except on vertical
    negFlickTypes.forEach (r => {
        let
            roll = r.split(':'),
            rollPattern = roll[0].replace(/^1/, '');
        if (rollPattern == pattern || !ruleCheckRolls ||
            $('nonArestiRolls').checked ||
            (rollFig[thisAttitude + roll[0]].aresti) in checkAllowCatId ||
            (((thisRoll.attitude % 180) != 90 &&
            rollFig[oppAttitude + roll[0]].aresti) in checkAllowCatId)) {
            html += `<option value="${rollPattern}" class="negFlickSelectOption"`;
            if (rollPattern == pattern) html += ' selected="selected"';
            html += `>${roll[1]}</option>`;
        }
    });

    // add spins when rollcode = 4 AND in first element, OR nonArestiRolls
    // is enabled
    thisAttitude = rollAttitudes[thisRoll.attitude];
    if ((fig[figures[figNr].figNr].rolls[rollEl] === 4 && (elNr === 0)) ||
        $('nonArestiRolls').checked) {
        // build the positive spin options
        posSpinTypes.forEach (s => {
            let
                roll = s.split(':'),
                rollPattern = roll[0].replace(/^1/, '');
            if (rollPattern == pattern ||
                $('nonArestiRolls').checked ||
                (thisRoll.negLoad && (!ruleCheckRolls ||
                    (rollFig[thisAttitude + roll[0]].aresti) in checkAllowCatId))) {
                html += `<option value="${rollPattern}" class="posSpinSelectOption"`;
                if (rollPattern == pattern) html += ' selected="selected"';
                html += `>${roll[1]}</option>`;
            }
        });
        // build the negative spin options
        negSpinTypes.forEach (s => {
            let
                roll = s.split(':'),
                rollPattern = roll[0].replace(/^1/, '');
            if (rollPattern == pattern ||
                $('nonArestiRolls').checked ||
                (!thisRoll.negLoad && (!ruleCheckRolls ||
                    (rollFig[thisAttitude + roll[0]].aresti) in checkAllowCatId))) {
                html += `<option value="${rollPattern}" class="negSpinSelectOption"`;
                if (rollPattern == pattern) html += ' selected="selected"';
                html += `>${roll[1]}</option>`;
            }
        });
    }
    // build the glider slow roll options
    if (sportingClass.value === 'glider') {
        gliderRollTypes.forEach (r => {
            var roll = r.split(':');
            if (roll[0] == pattern || !ruleCheckRolls ||
                $('nonArestiRolls').checked ||
                (rollFig[thisAttitude + roll[0]] &&
                    (rollFig[thisAttitude + roll[0]].aresti) in checkAllowCatId)) {
                html += `<option value="${roll[0]}" class="rollSelectOption"`;
                if (roll[0] == pattern) html += ' selected="selected"';
                html += `>${roll[1]}</option>`;
            }
        });
    }

    html += '</select><i class="bar"></i></div>';

    // build direction flip button
    if (elNr === 0) {
        html += `<div id="roll${rollEl}-${elNr}-flip" class="rollFlip button small`;
    } else {
        html += `<div id="roll${rollEl}-${elNr}-flip" class="rollFlipTwo button small`;
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
            if (thisRoll.flip[elNr] != thisRoll.flip[elNr - 1]) {
                html += ' on';
            }
        }
    } else if (elNr !== 0) {
        // activate flip direction for subsequent rolls that are still empty
        html += ' on';
    }

    html += '"><div><div></div></div></div>';

    // build number flip button
    html += `<div id="roll${rollEl}-${elNr}-flipNumber" class="numberFlip button small`;

    // decide wether the direction flip is activated for rolls
    if (pattern !== '') {
        if (thisRoll.flipNumber[elNr]) html += ' on';
    } else html += ' disable';

    html += '"><div><div></div></div></div>';

    // build roll comment field
    html += `<input type="text" id="roll${rollEl}-${elNr}-comment" class="rollComment" value="`;
    if (thisRoll.comment[elNr]) {
        html += thisRoll.comment[elNr].replace(/^\|/, '');
    }
    html += '">';
    span.innerHTML = html;
    parent.appendChild(span);
    const rollId = `roll${rollEl}-${elNr}`;
    if ($(rollId)) {
        $(rollId).addEventListener('change', updateFigure, false);
        $(rollId + '-flip').addEventListener('click', clickButton, false);
        $(rollId + '-flipNumber').addEventListener('click', clickButton, false);
        $(rollId + '-comment').addEventListener('change', updateFigure, false);
    }
}

// createProgramme will build a programme and add it to
// the library menu list. It is called by rulesWorker
function createProgramme(year, rnLower, rules, cat, seq, string) {
    var key = `${year + rules} ${cat} ${seq}`;
    var sequence = '<sequence><class>' +
        rnLower.match(/^glider-/) ? 'glider' : 'powered' +
        '</class><rules>' + rules + '</rules>' +
        '<category>' + cat + '</category>' +
        '<program>' + seq + '</program>' +
        '<sequence_text>' + string + '</sequence_text>' +
        ((activeRules && activeRules.logo) ? '<logo>' + activeRules.logo + '</logo>' :
            (rulesLogo[rules.toLowerCase()]) ? '<logo>' + rulesLogo[rules.toLowerCase()] + '</logo>' : '') +
        '<oa_version>' + version + '</oa_version></sequence>';
    console.log('Adding programme: ' + key);
    library[key] = sequence;
    addProgrammeToMenu(key);
}

// addProgrammeToMenu will add an entry in the library menu list
function addProgrammeToMenu(key) {
    const year = key.match(/^\d+/)[0];
    if (year) {
        let li = $(`year${year}`);
        if (!li) {
            li = document.createElement('li');
            li.setAttribute('id', `year${year}`);
            li.innerHTML = `<span>${year}</span><i class="material-icons ${platform.mobile ? 'rightArrow' : 'leftArrow'}"></i>`;
            var ul = document.createElement('ul');
            li.appendChild(ul);
            $('library').appendChild(li);
        } else {
            var ul = li.lastChild;
        }
        const subli = document.createElement('li');
        // don't put the current year CIVA sequences under CIVA submenu
        if (key.match(/^[\d]+ CIVA(-Glider|)/) &&
            (year === (version.match(/[\d]+/)[0]))) {
            subli.innerHTML = `<span>${key.replace(/^[\d]+[ ]*/, '').replace(/ /g, '&nbsp;').replace(/-/g, '&#8209;')}</span>`;
            subli.setAttribute('id', `programme-${key}`);
            subli.addEventListener('click', programme, false);
        } else {
            const group = key.match(/^[\d]+ ([^ ]+)/)[1];
            let subul = $(`${year} ${group}`);
            // create new group if the group does not exist yet
            if (!subul) {
                subli.innerHTML = `<span>${group}</span><i class="material-icons rightArrow"></i>`;
                subul = document.createElement('ul');
                subul.id = `${year} ${group}`;
                subli.appendChild(subul);
            }
            const subsubli = document.createElement('li');
            subsubli.innerHTML = `<span>${key.replace(/^[\d]+ [^ ]+[ ]*/, '')}</span>`;
            subsubli.setAttribute('id', `programme-${key}`);
            subsubli.addEventListener('click', programme, false);
            subul.appendChild(subsubli);
            // Sort the sub-sub menues on size.
            // If previous ul has less children, swap ul. This keeps the
            // largest program lists in top
            const pNode = subul.parentNode;
            while (pNode.previousSibling &&
                pNode.previousSibling.lastChild &&
                (pNode.previousSibling.lastChild.tagName === 'UL') &&
                (pNode.previousSibling.lastChild.childElementCount < subul.childElementCount) &&
                !/^CIVA(-Glider|)/.test(pNode.previousSibling.firstChild.innerHTML)) {
                pNode.parentNode.insertBefore(pNode, pNode.previousSibling);
            }
        }
        if (subli.innerHTML) ul.appendChild(subli);
    } else {
        let li = document.createElement('li');
        li.innerHTML = `<span>${key}</span>`;
        li.setAttribute('id', `programme-${key}`);
        li.addEventListener('click', programme, false);
        $('library').appendChild(li);
    }
}

// setOptions will:
// -add programme entries to the menu
// -set correct options in settings dialog
function setOptions() {
    // add programme entries
    for (let key in library) addProgrammeToMenu(key);
    // Update menu headers for mobile
    if (platform.mobile) mobileMenuHeader();

    // set settings dialog options

    // create language chooser, with default language
    for (let key in lang) {
        var option = document.createElement('option');
        option.setAttribute('value', key);
        option.innerHTML = lang[key][key];
        $('language').appendChild(option);
    }
    $('language').setAttribute('value', defaultLanguage);

    // set default values
    $('numberInCircle').setAttribute('value', numberInCircle);
    $('zipImageFilenamePattern').setAttribute('value', zipImageFilenamePattern);
    $('zipImageFilenamePattern').setAttribute('size', zipImageFilenamePattern.length);

    // set roll font sizes
    for (let key in rollFont) {
        var opt = $(`t_roll${key[0].toUpperCase()}${key.slice(1)}`);
        opt.setAttribute('value', rollFont[key]);
        if (rollFont[key] == rollFontSize) {
            opt.setAttribute('selected', 'selected');
        }
    }

    // add styles to settings dialog, sorted alphabetically
    var sortKeys = Object.keys(style).sort();
    for (let i = 0; i < sortKeys.length; i++) {
        var key = sortKeys[i];
        styleSave[key] = style[key];
        var opt = document.createElement('option');
        opt.setAttribute('value', key);
        opt.innerHTML = key;
        $('styles').appendChild(opt);
    }
    getStyle();
}

// loadSettingsXML will load settings from provided XML data
// xml      = xml data
// Returns an object containing the loaded settings, or
// false if no settings were loaded
function loadSettingsXML(xml) {
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
        for (let i = 0; i < nodes.length; i++) {
            var key = nodes[i].getElementsByTagName("key")[0].textContent;
            var val = nodes[i].getElementsByTagName("value")[0].innerHTML;
            // only adjust settings that are in loadSettings (config.js)
            if (loadSettings.indexOf(key) != -1) {
                if (val) {
                    // translate escape characters by browser through myTextArea
                    myTextArea.innerHTML = val;
                    // e will be the field, only put a value when it exists
                    var e = $(key);
                    if (e) {
                        if (e.type === 'checkbox') {
                            if (val === 'true') {
                                e.checked = 'checked';
                            } else {
                                e.removeAttribute('checked');
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
function loadSettingsStorage(location) {
    location = location || 'settings';

    function f(settings) {
        // check if settings exist in correct format
        if (settings && /[\[\{]/.test(settings.charAt(0))) {
            settings = JSON.parse(settings);
            for (let settingKey in settings) {
                var
                    el = $(settingKey),
                    value = settings[settingKey];
                if (el.type === 'checkbox') {
                    if (value == 1) {
                        el.setAttribute('checked', 'checked');
                    } else {
                        el.removeAttribute('checked');
                    }
                } else if (el.type.match(/^select/)) {
                    // only set values that are in the list in a select
                    var nodes = el.childNodes;
                    for (let key in nodes) {
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
            numberInCircle = $('numberInCircle').checked ? true : false;
            changeRollFontSize($('rollFontSize').value);
            setRollSymbolSizes($('rollSymbolSize').value);
        }
    }

    if (storage) getLocal(location, f);
}

// saveSettingsStorage will save the settings to storage
// When location is not set it will default to 'settings'
function saveSettingsStorage(location) {
    var settings = {};

    location = location || 'settings';

    if (storage) {
        saveSettings.forEach((settingKey) => {
            var el = $(settingKey);
            settings[el.id] = (el.type === 'checkbox') ? (el.checked ? 1 : 0) : el.value;
        });
        storeLocal(location, JSON.stringify(settings));
    }
}

// savePrintDialogStorage will save the print dialog settings to
// storage
function savePrintDialogStorage() {
    var settings = {};

    if (storage) {
        ['input', 'select'].forEach(function (inputType) {
            var inputs = $('printDialog').getElementsByTagName(inputType);
            for (let i = 0; i < inputs.length; i++) {
                var el = inputs[i];
                if (el.type !== 'file') {
                    settings[el.id] = (el.type === 'checkbox') ? (el.checked ? 1 : 0) : el.value;
                }
            }
        });
        storeLocal('printDialog', JSON.stringify(settings));
    }
}

// loadPrintDialogStorage will load the the print dialog settings from
// storage
function loadPrintDialogStorage() {
    function f(settings) {
        if (!settings) return;
        settings = JSON.parse(settings);
        for (let settingKey in settings) {
            var
                el = $(settingKey),
                value = settings[settingKey];
            if (el) {
                if (el.type === 'checkbox') {
                    if (value == 1) {
                        el.setAttribute('checked', 'checked');
                    } else {
                        el.removeAttribute('checked');
                    }
                } else if (el.type.match(/^select/)) {
                    // only set values that are in the list in a select
                    var nodes = el.childNodes;
                    for (let key in nodes) {
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
                } else if (el.type !== 'file') {
                    // don't try to load file field: not allowed
                    el.value = value;
                }
            }
        }
        setPilotCardForm();
    }

    if (storage) {
        getLocal('printDialog', f);
    } else {
        setPilotCardForm();      
    }
}

// changeLanguage will change the interface language
function changeLanguage() {
    // Make sure no figure is selected because otherwise the "Edit figure"
    // header is in the previous language
    selectFigure(false);
    updateUserTexts();
    updateFigureSelectorOptions();
    if (platform.mobile) mobileMenuHeader();
    saveSettingsStorage();
    checkSequenceChanged(true);
}

// getStyle will retrieve a style and put it's value in the Settings
// styleString field
function getStyle() {
    var key = $('styles').value;
    $('styleString').value = style[key];
}

// updateStyle will change a style after it has been changed in the
// Settings styleString field
function updateStyle() {
    style[$('styles').value] = this.value;
    // update rollFontSize if applicable
    if ($('styles').value === 'rollText') {
        rollFontSize = style.rollText.match(regexRollFontSize)[1];
    }
    // redraw sequence
    draw();
}

// resetStyle resets a style (or all) to the default value
function resetStyle(all) {
    var key;
    if (all) {
        for (let key in style) style[key] = styleSave[key];
    } else {
        key = $('styles').value;
        style[key] = styleSave[key];
    }
    getStyle();
    draw();
}

// stylingSave saves all styling values to an XML file
function stylingSave() {
    var xml = document.implementation.createDocument(null, 'styling');
    for (let key in style) {
        var node = xml.createElement(key);
        node.appendChild (xml.createTextNode(style[key]));
        xml.firstChild.appendChild(node);
    }
    xml = vkbeautify.xml(new XMLSerializer().serializeToString(xml));
    saveFile(
        xml,
        'styling',
        '.xml',
        { 'name': 'OpenAero styling', 'filter': '.xml' },
        'text/xhtml+xml;utf8',
        {noSequenceLink: true}
    );
}

// loadedStyling loads all styling values from an XML file
function loadedStyling(evt) {
    // XML.get extracts xml values from tags
    var XML = {
        get: function (xml, tag) {
            if  (xml.getElementsByTagName(tag)[0]) {
                return xml.getElementsByTagName(tag)[0].firstChild.data;
            } else return false;
        }
    }
    var fileString = evt.target.result;
    // convert from base64 if needed
    if (/^data:/.test(fileString)) {
        fileString = decodeURIComponent(escape(atob(
            fileString.replace(/^data:.*;base64,/, ''))));
    }
    // xml will hold every entry as a node
    var xml = new DOMParser().parseFromString(fileString, 'text/xml');
    for (let key in style) {
        if (XML.get (xml, key)) style[key] = XML.get (xml, key);
    }
    // redraw to apply changed styling
    draw();
    $('stylingFileForm').reset();
}

// restoreDefaultSettings restores all settings to their default values
function restoreDefaultSettings() {
    // close settings dialog
    settingsDialog();
    confirmBox(
        userText.restoreDefaultSettingsConfirm,
        userText.restoreDefaultSettings,
        function () {
            storeLocal('settings', '');
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
    selectFigure(false);
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

// updateRollFontSize is called when "roll font size" is changed in
// settings
function updateRollSymbolSize() {
    saveSettingsStorage();
    setRollSymbolSizes(this.value);
    draw();
}

// updateGridColumns is called when "Grid columns" is changed in settings
function updateGridColumns() {
    saveSettingsStorage();
    selectForm('G');
}

// setPilotCardForm will show or hide pilot card options
function setPilotCardForm() {
    if ($('printFormPilotCards').checked) {
        $('pilotCardLayout').classList.remove('folded');
    } else {
        $('pilotCardLayout').classList.add('folded');
    }
    saveImageSizeAdjust();
    changePilotCardPercent();
}

// setPilotCardLayout is activated when clicking a pilot card layout in
// the print/save dialog
function setPilotCardLayout(evt) {
    var els = document.getElementsByClassName('pilotCardLayout');
    for (let i = els.length - 1; i >= 0; i--) {
        if (els[i] === this) {
            if (this.classList.contains('active')) {
                if (evt.target === $('pilotCardPercentValue')) return;
                if (this.classList.contains('formRL')) {
                    this.classList.remove('formRL');
                } else if (this.classList.contains('formL')) {
                    if (this.id === 'pilotCardPercent') {
                        this.classList.remove('formL');
                    } else {
                        this.classList.remove('formL');
                        this.classList.add('formRL');
                    }
                } else this.classList.add('formL');
            } else this.classList.add('active');
        } else {
            els[i].classList.remove('active');
        }
    }
    updatePrintPageSetValue();
}

// changePilotCardPercent is activated when changing pilotCardPercentValue
function changePilotCardPercent() {
    $('pilotCardPercentImage').style.height =
        Math.min(90, $('pilotCardPercentValue').value * 0.9) + 'px';
    updatePrintPageSetValue();
}

// setPrintPageSet is activated when changing printPageSet
function setPrintPageSet() { 
    updatePrintPageSetValue();
    updatePrintPageSetLayout();
    saveImageSizeAdjust();

    $('printForms').childNodes.forEach(function (el) {
        if (el.classList && el.id !== 'sectionPrintPageSet') {
            if ($('printPageSet').checked) {
                el.classList.add('hidden');
            } else el.classList.remove('hidden');
        }
    });
    if ($('printPageSet').checked) {
        $('printPageSetLayout').classList.remove('noDisplay');
        $('t_printPageSetHidesFormSelectors').classList.remove('noDisplay');
        $('printPageSetString').removeAttribute('disabled')
    } else {
        $('printPageSetLayout').classList.add('noDisplay');
        $('t_printPageSetHidesFormSelectors').classList.add('noDisplay');
        $('printPageSetString').setAttribute('disabled', true)
    }
}

// updatePrintPageSetValue updates the value of printPageSetString when print form selectors are changed.
// The string is then used in all cases to define forms to be printed.
function updatePrintPageSetValue() {
    // don't do anything when printPageSet is checked
    if ($('printPageSet').checked) return;

    var value = '';
    if ($('printFormA').checked) value += 'A';
    if ($('printFormB').checked) value += $('printMiniFormAonB').checked ? 'B+' : 'B';
    if ($('printFormC').checked) value += $('printMiniFormAonC').checked ? 'C+' : 'C';
    if ($('printFormR').checked) value += 'R';
    if ($('printFormL').checked) value += 'L';
    if ($('printFormGrid').checked) value += $('formGridHeader').checked ? 'G+' : 'G';
    if ($('printFormPilotCards').checked) {
        if ($('pilotCardPercent').classList.contains('active')) {
            value += Math.round($('pilotCardPercentValue').value / 10).toString().slice(-1) +
                ($('pilotCardPercent').classList.contains('formL') ? '>' : '<');
        } else if ($('pilotCard2').classList.contains('active')) {
            if ($('pilotCard2').classList.contains('formL')) {
                value += 'T>';
            } else if ($('pilotCard2').classList.contains('formRL')) {
                value += 'T=';
            } else value += 'T<';
        } else if ($('pilotCard4').classList.contains('active')) {
            if ($('pilotCard4').classList.contains('formL')) {
                value += 'F>';
            } else if ($('pilotCard4').classList.contains('formRL')) {
                value += 'F=';
            } else value += 'F<';
        } else if ($('pilotCard2QR').classList.contains('active')) {
            if ($('pilotCard2QR').classList.contains('formL')) {
                value += 'Q>';
            } else if ($('pilotCard2QR').classList.contains('formRL')) {
                value += 'Q=';
            } else value += 'Q<';
        }
    }
    $('printPageSetString').value = value;
}

// updatePrintPageSetLayout updates the print page set graphical layout
function updatePrintPageSetLayout() {
    var
        string = $('printPageSetString').value.toUpperCase(),
        html = '',
        page = 0;

    for (let i = 0; i < string.length; i++) {
        if (/[ABCRLG_ ]/.test(string[i]) ||
            (/\d[><]|[TFQ][><=]/.test(string.substring(i, i + 2)))) {
            page++;
            if (page % 2) html += '<div class="pageSet">';
            html += '<div class="singlePage">';
            if (/[BCG]\+|\d[><]|[TFQ][><=]/.test(string.substring(i, i + 2))) {
                html += string.substring(i, i + 2);
                i++;
            } else if (/[_ ]/.test(string[i])) {
                html += '&nbsp;';
            } else html += string[i];
            html += '</div>';
            if (!(page % 2)) html += '</div>';
        }
    }
    if (page % 2) html += '</div>';

    // Show information to add wind direction after pilot card character
    if (/[0-9TFQ]$/.test(string)) {
        html += `<p>${userText.addWindAfterPilotCardCharacter}</p>`;
    }

    $('printPageSetLayout').innerHTML = html;
}

// selectPwrdGlider is activated when powered or glider is chosen
function selectPwrdGlider() {
    rulesWorker.postMessage({ action: 'sportingClass', class: sportingClass.value });
    // update figure chooser
    changeFigureGroup();
    // update figure entryExit values
    if (sportingClass.value === 'glider') {
        for (let i = fig.length - 1; i >= 0; i--) {
            if (fig[i]) fig[i].entryExit = fig[i].entryExitGlider;
        }
    } else {
        for (let i = fig.length - 1; i >= 0; i--) {
            if (fig[i]) fig[i].entryExit = fig[i].entryExitPower;
        }
    }
    // update rule list
    updateRulesList();
    changeCombo('program', function (data) {
        // select no figure to force roll option redraw
        selectFigure(false);
        // redraw including mini form A
        draw();
        // update sequence info
        changeSequenceInfo();
        // hide Harmony field for powered
        if ($('harmonyField')) {
            if (sportingClass.value === 'powered') {
                $('harmonyField').classList.add('hidden');
                $('harmony').setAttribute('disabled', true);
            } else if (!activeRules) {
                $('harmonyField').classList.remove('hidden');
                $('harmony').removeAttribute('disabled');
            }
        }
    });
}

// setRulesPosHarmony sets positioning and harmony from rule Worker
function setRulesPosHarmony(pos) {

    function setValues(posHarm) {
        $('positioning').value = parseInt(posHarm.split('+')[0]) || 0;
        $('positioning').setAttribute('disabled', true);
        $('harmony').value = parseInt(posHarm.split('+')[1]) || 0;
        $('harmony').setAttribute('disabled', true);
        if ($('harmony').value == 0) {
            $('harmonyField').classList.add('hidden');
        } else {
            $('harmonyField').classList.remove('hidden');
        }
    }

    var el = $('positioningText');
    // Check if we have multiple positioning/harmony options. If so,
    // create select list, display it, and if relevant select correct option
    if (pos.length > 1) {
        el.innerHTML = '';
        el.onchange = ((e) => { setValues(e.target.value); });
        // Preselect first option
        el.value = pos[0].posHarm;
        for (let i = 0; i < pos.length; i++) {
            // Create option
            el.appendChild(document.createElement('option'));
            el.lastChild.textContent = pos[i].description;
            el.lastChild.value = pos[i].posHarm;
            // Preselect option which matches current positioning K, if any
            if (parseInt(pos[i].posHarm.split('+')[0]) == $('positioning').value) {
                el.value = pos[i].posHarm;
            }
        }
        el.classList.remove('hidden');
        setValues(el.value);
        // otherwise, hide select list
    } else {
        el.classList.add('hidden');
        setValues(pos[0].posHarm);
    }
}

// setYAxisOffset sets the Y axis offset
function setYAxisOffset(offset) {
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
function updateFigureEditor() {
    if ($('figureInfo')) {
        displaySelectedFigure();
        addRollSelectors(selectedFigure.id);
        updateFigureOptions(selectedFigure.id);
    }
}

// showFigureSelector displays the base figure selector
// for some reason sliding only works from the left for smallMobile !?
function showFigureSelector() {
    var figureSelector = $('figureSelector');
    updateFigureSelectorOptions();
    figureSelector.classList.add('active');
    if (activeForm === 'FU') {
        // set figureString correctly, using positioning relative to leftBlock
        $('leftBlock').scrollTop = 0;
        figureSelector.insertBefore(
            $('figureString'),
            figureSelector.firstChild);
    }
    adjustMiniFormAPosition();
}

// hideFigureSelector hides the base figure selector
// but because we do need it to be available for various operations
// we hide it by removing the CSS class that shows it on screen
function hideFigureSelector() {
    $('figureSelector').classList.remove('active');
    $('leftBlock').insertBefore(
        $('figureString'),
        $('figureInfo').nextSibling);
    // Reset position of mini form A and windarrow
        adjustMiniFormAPosition();
}

// hideLogoChooser hides the logo chooser
function hideLogoChooser() {
    $('logoChooserContainer').classList.add('noDisplay');
}

// displaySelectedFigure will display the currently selected figure
// in the figure editor
function displaySelectedFigure() {
    var svg = $('selectedFigureSvg');
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
function updateFigureOptions(figureId) {
    var
        f = figures[figureId],
        figureOptions = $('figureOptions');

    // show figure box and figureOptions by default
    $('selectedFigure').classList.remove('hidden');
    figureOptions.classList.remove('hidden');
    // hide fuSelectFigureFirst text by default
    $('fuSelectFigureFirst').classList.add('noDisplay');
    // hide figureStringInput by default
    $('figureString').classList.add('noDisplay');

    if ((activeForm !== 'FU') && (!f || (f && !f.aresti))) selectedFigure.id = null;

    if (selectedFigure.id === null) {
        $('figureInfo').classList.add('noFigure');
        if (activeForm !== 'FU') {
            // clear figure box
            $('selectedFigure').classList.remove('active');
        } else {
            // hide figure box and options. Important to only HIDE for Firefox
            $('selectedFigure').classList.add('hidden');
            figureOptions.classList.add('hidden');
            $('subSequenceDirection').classList.add('noDisplay');
            $('fuSelectFigureFirst').classList.remove('noDisplay');
        }
        // hide figure modifiers
        $('unknownFigureChooser').classList.add('hidden');
        $('entryExit').classList.add('noDisplay');
        // hide Free (Un)known disabled options warning
        $('FUfigOptionsDisabled').classList.add('noDisplay');
    } else {
        // remove all 'disable' and 'on' classes
        var els = figureOptions.getElementsByClassName('disable');
        while (els.length) els[0].classList.remove('disable');
        var els = figureOptions.getElementsByClassName('on');
        while (els.length) els[0].classList.remove('on');
        var els = document.getElementsByClassName('disableFUfig');
        for (let i = els.length - 1; i >= 0; i--) {
            els[i].classList.remove('disable');
        }

        $('figureInfo').classList.remove('noFigure');
        // activate figure box
        $('selectedFigure').classList.add('active');
        if ((activeForm === 'FU') && f.unknownFigureLetter && (f.unknownFigureLetter !== 'L')) {
            $('addFigureText').classList.add('noDisplay');
        } else {
            $('addFigureText').classList.remove('noDisplay');
        }

        if ((activeForm === 'FU') && ((f.unknownFigureLetter === 'L') || !f.unknownFigureLetter)) {
            // update and show figureStringInput
            if ($('figureStringInput').value !== f.string) {
                $('figureStringInput').value = (!/[LX]/.test(f.string)) ? f.string : '';
            }
            $('figureString').classList.remove('noDisplay');
        }

        // show figure modifiers
        if (fig[f.figNr]) {
            $('entryExit').classList.remove('noDisplay');
        } else $('entryExit').classList.add('noDisplay');
        if ((f.entryAxis === 'X') || (f.seqNr === 1) || f.subSequence) {
            $('flipYAxis').classList.remove('disable');
        } else {
            $('flipYAxis').classList.add('disable');
        }
        // set switchFirstRoll
        if (f.switchFirstRoll) {
            $('switchFirstRoll').classList.add('on');
        } else if (f.switchFirstRoll === false) {
            $('switchFirstRoll').classList.remove('on');
        } else {
            $('switchFirstRoll').classList.add('disable');
        }
        // set switchX
        var el = $('switchX');
        if (f.switchX) {
            el.classList.add('on');
        } else if (f.switchX === false) {
            el.classList.remove('on');
        } else {
            el.classList.add('disable');
        }
        // disable for Free (Un)known fig unless this figure starts on Y axis
        if (f.entryAxis === 'Y') {
            el.classList.remove('disableFUfig');
        } else {
            el.classList.add('disableFUfig');
        }
        // set switchY
        var el = $('switchY');
        if (f.switchY) {
            el.classList.add('on');
        } else if (f.switchY === false) {
            el.classList.remove('on');
        } else {
            el.classList.add('disable');
        }
        // disable for Free (Un)known fig unless this figure starts on X axis
        if (f.entryAxis === 'X') {
            el.classList.remove('disableFUfig');
        } else {
            el.classList.add('disableFUfig');
        }
        // set correct scale
        $('scale').value = f.scale || 0;
        // set move
        // first we disable all selectors and remove values
        $('straightLine').classList.remove('on');
        $('curvedLine').classList.remove('on');
        $('moveForward').classList.remove('on');
        $('moveXCont').classList.add('collapsed');
        $('moveYCont').classList.add('collapsed');
        $('moveX-value').value = '';
        $('moveY-value').value = '';

        // go back in the figure list until we end up at the beginning OR
        // find a real figure OR find a move figure
        var i = figureId - 1;
        while ((i >= 0) && !figures[i].figNr) {
            var prevFig = figures[i];
            if (prevFig) {
                if (prevFig.moveTo) {
                    $('moveX-value').value = /^[CL]/.test(activeForm) ?
                        -prevFig.moveTo[0] : prevFig.moveTo[0];
                    $('moveY-value').value = prevFig.moveTo[1];
                    $('straightLine').classList.add('on');
                    $('moveXCont').classList.remove('collapsed');
                    $('moveXCont').firstElementChild.classList.remove('noDisplay');
                    $('moveYCont').classList.remove('collapsed');
                    break;
                } else if (prevFig.curveTo) {
                    $('moveX-value').value = /^[CL]/.test(activeForm) ?
                        -prevFig.curveTo[0] : prevFig.curveTo[0];
                    $('moveY-value').value = prevFig.curveTo[1];
                    $('curvedLine').classList.add('on');
                    $('moveXCont').classList.remove('collapsed');
                    $('moveXCont').firstElementChild.classList.remove('noDisplay');
                    $('moveYCont').classList.remove('collapsed');
                    break;
                } else if (prevFig.moveForward) {
                    $('moveX-value').value = prevFig.moveForward;
                    $('moveForward').classList.add('on');
                    $('moveXCont').classList.remove('collapsed');
                    $('moveXCont').firstElementChild.classList.add('noDisplay');
                    break;
                }
            }
            i--;
        }
        // no earlier real figure found, disable move selectors
        if (i == -1) {
            $('straightLine').classList.add('disable');
            $('curvedLine').classList.add('disable');
            $('moveForward').classList.add('disable');
        }
        // set subSequence, but disable for first real figure except on
        // Free (Un)known designer
        if ((i == -1) && (activeForm !== 'FU')) {
            $('subSequence').classList.add('disable');
            $('subSequenceDirection').classList.add('noDisplay');
        } else if (f.subSequence) {
            $('subSequence').classList.add('on');
            $('subSequenceDirection').classList.remove('noDisplay');
            $('subSequenceDirections').value = f.subSequence;
        } else {
            $('subSequence').classList.remove('on');
            $('subSequenceDirection').classList.add('noDisplay');
        }

        // only show unknown figure letter selector when figureLetters
        // defined, or when the value was not 0 to enable changing
        var el = $('unknownFigure');
        if ((figureLetters !== '') || f.unknownFigureLetter) {
            // clear select list
            removeChildNodes(el);
            // build select list
            var listLetters = figureLetters;
            var option = document.createElement('option');
            option.setAttribute('value', '0');
            option.innerHTML = userText.noFreeUnknownFig;
            el.appendChild(option);
            if (additionalFig.max > 0) {
                var option = document.createElement('option');
                option.setAttribute('value', 'L');
                option.innerHTML = userText.freeUnknownAdditional;
                el.appendChild(option);
                listLetters += 'L';
            }
            for (let j = 0; j < figureLetters.length; j++) {
                var option = document.createElement('option');
                option.setAttribute('value', figureLetters[j]);
                option.innerHTML = userText.freeUnknownFig + figureLetters[j];
                el.appendChild(option);
            }
            // add the actual figure letter as an option if not present in list
            if (f.unknownFigureLetter) {
                if (!listLetters.match(new RegExp(f.unknownFigureLetter))) {
                    var option = document.createElement('option');
                    option.setAttribute('value', f.unknownFigureLetter);
                    if (f.unknownFigureLetter === 'L') {
                        option.innerHTML = userText.freeUnknownAdditional;
                    } else {
                        option.innerHTML = userText.freeUnknownFig +
                            f.unknownFigureLetter;
                    }
                    el.appendChild(option);
                }
            }

            // set Unknown Figure and selector colors
            el.parentNode.classList.remove('hidden');
            if (activeForm === 'FU') {
                el.setAttribute('disabled', 'disabled');
            } else el.removeAttribute('disabled');
            var used = [];
            for (let j = figures.length - 1; j >= 0; j--) {
                if (figures[j].unknownFigureLetter && figures[j].aresti && (j != figureId)) {
                    if (figures[j].unknownFigureLetter != 'L') {
                        used.push(figures[j].unknownFigureLetter);
                    }
                }
            }
            var options = el.getElementsByTagName('option');
            for (let j = options.length - 1; j >= 0; j--) {
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
            el.parentNode.classList.add('hidden');
        }

        // check if dealing with a real figure. If so, allow upright/inverted setting
        if (fig[f.figNr]) {
            // set entry attitude button
            var pattern = fig[f.figNr].pattern;
            $('figEntryButton').classList.remove('inverted');
            if (pattern[0] === '-') {
                $('figEntryButton').classList.add('inverted');
            }
            // set exit attitude button
            $('figExitButton').classList.remove('inverted');
            if (pattern.slice(-1) === '-') {
                $('figExitButton').classList.add('inverted');
            }
        }

        // set entry extension
        $('entryExt-value').value = f.entryExt || 0;
        // set exit extension
        $('exitExt-value').value = f.exitExt || 0;
        // show comments box
        if (f.comments || (document.activeElement.id === 'comments')) {
            $('commentSection').classList.add('expanded');
        } else $('commentSection').classList.remove('expanded');
        $('comments').value = f.comments ? f.comments : '';

        var disable = false;
        $('FUfigOptionsDisabled').classList.add('noDisplay');
        // when the figure is a Free (Un)known figure with a letter, disable
        // disableFUfig buttons and disableRollFUfig select
        if (figures[selectedFigure.id].unknownFigureLetter &&
            figures[selectedFigure.id].unknownFigureLetter !== 'L') {
                disable = true;
                $('FUfigOptionsDisabled').classList.remove('noDisplay');
        }

        var els = document.getElementsByClassName('disableFUfig');
        for (let i = els.length - 1; i >= 0; i--) {
            if (disable) els[i].classList.add('disable');
        }

        var els = document.getElementsByClassName('disableRollFUfig');
        for (let i = els.length - 1; i >= 0; i--) {
            if (disable) {
                els[i].setAttribute('disabled', 'disabled');
            } else {
                els[i].removeAttribute('disabled');
            }
        }
    }
}

// addRollSelectors will add all applicable roll selectors when
// editing a figure
// var figureId is the id of the figures[] object
function addRollSelectors(figureId) {
    var myEl = $('rollInfo');
    if ((figureId === null) || !fig[figures[figureId].figNr]) {
        myEl.classList.add('noDisplay');
    } else {
        myEl.classList.remove('noDisplay');
        var rolls = fig[figures[figureId].figNr].rolls;
        // clear selectors
        removeChildNodes(myEl);
        // show the applicable roll selectors
        if (rolls) {
            // check if rule-illegal rolls are allowed in settings and present warning if so
            if (activeRules && $('nonArestiRolls').checked) {
                var div = document.createElement('div');
                div.classList.add('content');
                div.id = 't_ruleIllegalRollsEnabled';
                div.innerHTML = userText.ruleIllegalRollsEnabled;
                myEl.appendChild(div);
                div.addEventListener('mousedown', () => { settingsDialog('expert'); });
            }
            var rollNr = 0;
            for (let i = 0; i < rolls.length; i++) {
                if ((parseInt(rolls[i]) > 0) &&
                    !((rolls[i] == 4) && figures[figureId].rollInfo[i].rollTop)) {
                    var rollInfo = figures[figureId].rollInfo[i];
                    var div = document.createElement('div');
                    myEl.appendChild(div);
                    div.id = `roll${i}`;
                    div.classList.add('content', 'divider');
                    var divdiv = document.createElement('div');
                    divdiv.classList.add('contentLabel');
                    divdiv.innerHTML = userText.rollPos[rollNr];
                    div.appendChild(divdiv);
                    // roll positions of type 9 only allow changing line length
                    if (rolls[i] == 9) {
                        var divdiv = document.createElement('div');
                        divdiv.classList.add('clearBoth');
                        divdiv.innerHTML = `<font color="red">${userText.noRollAllowed}</font>`;
                        div.appendChild(divdiv);
                    }
                    // loop until max rolls per element + 1
                    for (var j = 0; j < rollsPerRollElement + 1; j++) {
                        var pattern = rollInfo.pattern[j - 1];
                        pattern = pattern ? pattern.replace('-', '') : '';
                        // show the element when:
                        // it's the first one OR the previous one is not empty
                        // AND it's number is not higher than rollsPerRollElement
                        if ((j == 0) || (pattern != '')) {
                            if (j < rollsPerRollElement) {
                                addRollSelectElement(figureId, i, j, div);
                                var divdiv = document.createElement('div');
                                divdiv.classList.add('clearBoth');
                                div.appendChild(divdiv);
                            }
                        } else break;
                    }

                    // j indicates how many active subrolls there are
                    var subRolls = j;
                    // build the gaps element for subRolls rolls, but not for
                    // rolls in the top
                    if (!rollInfo.rollTop) {
                        var divdiv = document.createElement('div');
                        divdiv.classList.add('rollGaps');
                        // only show 'Gaps' text for non-smallMobile
                        if (!platform.smallMobile) {
                            var span = document.createElement('span');
                            span.innerHTML = userText.gaps;
                            div.appendChild(span);
                        }
                        var gap = rollInfo.gap;
                        for (let j = 0; j < subRolls; j++) {
                            var span = document.createElement('span');
                            span.setAttribute('id', `roll${i}-gap${j}`);
                            span.classList.add('plusMin');
                            span.appendChild(buildPlusMinElement(
                                `roll${i}-gap${j}-value`,
                                (typeof gap[j] != 'undefined') ? gap[j] : 0
                            ));
                            divdiv.appendChild(span);
                        }
                        div.appendChild(divdiv);
                    }
                    var divdiv = document.createElement('div');
                    divdiv.classList.add('clearBoth');
                    div.appendChild(divdiv);
                    rollNr++;
                }
            }
        }
    }
}

// setUndoRedo will update undo/redo buttons and redo object
function setUndoRedo(e, clear) {
    if (clear) activeSequence[e] = [];
    if (activeSequence.undo.length) {
        $('undo').firstChild.classList.remove('disabled');
    } else {
        $('undo').firstChild.classList.add('disabled');
    }
    if (activeSequence.redo.length) {
        $('redo').firstChild.classList.remove('disabled');
    } else {
        $('redo').firstChild.classList.add('disabled');
    }
}

// updateFigure will be called when any figure option is updated
// when noRedraw is true, the figure editor is not updated
function updateFigure(noRedraw) {
    var
        scroll = $('leftBlockContainer').scrollTop,
        // get the current string
        string = figures[selectedFigure.id].string,
        // get the base figure number
        figNr = figures[selectedFigure.id].figNr,
        // get the pattern
        pattern = fig[figNr].pattern,
        // get the base
        base = fig[figNr].base,
        // update the original pattern for entry/exit changes
        entry = $('figEntryButton'),
        exit = $('figExitButton');

    if (entry.classList.contains('inverted')) {
        pattern = `-${pattern.substring(1)}`;
        base = `-${base.substring(1)}`;
    } else {
        pattern = `+${pattern.substring(1)}`;
        base = `+${base.substring(1)}`;
    }
    if (exit.classList.contains('inverted')) {
        pattern = pattern.substring(0, pattern.length - 1) + '-';
        base = base.substring(0, base.length - 1) + '-';
    } else {
        pattern = pattern.substring(0, pattern.length - 1) + '+';
        base = base.substring(0, base.length - 1) + '+';
    }
    // check if the base exists
    if (!figBaseLookup[base]) {
        // if not, try flipping entry AND exit
        base = fig[figNr].base.replace(/-/g, '#').replace(/\+/g, '-').replace(/#/g, '+');
        if (figBaseLookup[base]) {
            pattern = fig[figNr].pattern.replace(/-/g, '#').replace(/\+/g, '-').replace(/#/g, '+');
            // set figEntryButton and figExitButton to correct state
            if (base[0] === '-') {
                entry.classList.add('inverted');
            } else {
                entry.classList.remove('inverted');
            }
            if (base.slice(-1) === '-') {
                exit.classList.add('inverted');
            } else {
                exit.classList.remove('inverted');
            }
        } else {
            // Doesn't help. Restore original pattern. No option for changing
            // upright/inverted
            pattern = fig[figNr].pattern;
        }
    }
    // remove + from pattern
    pattern = pattern.replace(RegExp(`\\${userpat.longforward}`, 'g'), '');
    // add rolls
    var rollEl = 0;
    // start at roll 1 for figures that don't have roll element 0
    if (!$('roll0')) rollEl = 1;
    while (pattern.match(regexRollsAndLines)) {
        var rolls = '';
        for (let rollNr = 0; rollNr <= rollsPerRollElement; rollNr++) {
            // apply gaps
            var gap = $(`roll${rollEl}-gap${rollNr}-value`);
            // only apply when the input element exists
            if (gap) {
                gap = gap.value;
                if (gap < 0) {
                    rolls += new Array(1 - gap).join(userpat.lineshorten);
                } else if (gap > 0) {
                    gap = gap / 3;
                    rolls += new Array(parseInt(gap) + 1).join(userpat.rollext);
                    rolls += new Array(Math.round((gap - parseInt(gap)) * 3) + 1).join(userpat.rollextshort);
                }
            }
            // apply rolls, roll direction flips, roll number flips and comments
            var thisRoll = $(`roll${rollEl}-${rollNr}`);
            // only apply when the input element exists
            if (thisRoll) {
                var rollFlip = $(`roll${rollEl}-${rollNr}-flip`);
                var flipNumber = $(`roll${rollEl}-${rollNr}-flipNumber`);
                if (thisRoll.value != '') {
                    var comment = '';
                    if (rollFlip.classList.contains('on')) {
                        rolls += ',';
                    } else {
                        if (rolls.match(/[0-9fseul]/)) rolls += ';';
                    }
                    if (flipNumber.classList.contains('on')) {
                        comment = userpat.flipNumber; // add to start of comment
                    }
                    comment += $(`roll${rollEl}-${rollNr}-comment`).value;
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
            $('switchFirstRoll').classList.contains('on')) {
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
    if (!pattern.match(/\([^)]+\)/)) {
        pattern = pattern.replace(/\(\)/g, '');
    }
    // move back in the figure cueue to find scale, move or subsequence
    // patterns
    var
        i = selectedFigure.id - 1,
        moveToFig = false,
        moveForwardFig = false,
        moveDownFig = false,
        scaleFig = false,
        subSequence = false;

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
    var el = $('scale');
    if (scaleFig === false) {
        if (el.value != 0) {
            updateSequence(selectedFigure.id - 1, el.value + '%', false);
            return;
        }
    } else {
        if (el.value != 0) {
            updateSequence(scaleFig, el.value + '%', true);
        } else {
            updateSequence(scaleFig, '', true);
            return;
        }
    }
    var
        moveX = parseInt($('moveX-value').value || 0),
        moveY = parseInt($('moveY-value').value || 0),
        el1 = $('moveForward'),
        el2 = $('straightLine'),
        el3 = $('curvedLine');
    if (el2.classList.contains('on')) {
        // set moveTo with straight line
        // remove any moveForward
        if (moveForwardFig != false) {
            updateSequence(moveForwardFig, '', true);
            if (moveToFig != false) moveToFig--;
        }
        // remove any moveDown
        if (moveDownFig != false) {
            updateSequence(moveDownFig, '', true);
            if (moveToFig != false) moveToFig--;
        }
        // replace any moveTo or curveTo
        //if ((Math.abs(moveX) > 0) || (Math.abs(moveY) > 0)) {
        var movePattern = `[${moveX},${moveY}]`;
        if (moveToFig != false) {
            // replace moveTo HERE!
            updateSequence(moveToFig, movePattern, true);
        } else {
            // add new moveTo
            updateSequence(selectedFigure.id - 1, movePattern, false);
            return;
        }
    } else if (el3.classList.contains('on')) {
        // set moveTo with curved line
        // remove any moveForward
        if (moveForwardFig != false) {
            updateSequence(moveForwardFig, '', true);
            if (moveToFig != false) moveToFig--;
        }
        // remove any moveDown
        if (moveDownFig != false) {
            updateSequence(moveDownFig, '', true);
            if (moveToFig != false) moveToFig--;
        }
        // replace any moveTo or curveTo
        //if ((Math.abs(moveX) > 0) || (Math.abs(moveY) > 0)) {
        var movePattern = `(${moveX},${moveY})`;
        if (moveToFig != false) {
            // replace curveTo HERE!
            updateSequence(moveToFig, movePattern, true);
        } else {
            // add new curveTo
            updateSequence(selectedFigure.id - 1, movePattern, false);
            return;
        }
    } else if (el1.classList.contains('on')) {
        // set moveForward
        // remove any moveTo
        if (moveToFig != false) {
            updateSequence(moveToFig, '', true);
            if (moveForwardFig != false) moveForwardFig--;
        }
        // replace any moveForward
        if (parseInt(moveX) > 0) {
            if (moveX == 1) {
                var movePattern = '>';
            } else var movePattern = moveX + '>';
            if (moveForwardFig != false) {
                // replace moveForward
                updateSequence(moveForwardFig, movePattern, true);
            } else {
                // add new moveForward
                updateSequence(selectedFigure.id - 1, movePattern, false);
                return;
            }
        } else if (moveForwardFig != false) {
            // remove moveForward
            updateSequence(moveForwardFig, '', true);
        }
    } else {
        // remove moveTo and moveForward
        if (moveToFig != false) {
            updateSequence(moveToFig, '', true);
        }
        if (moveForwardFig != false) {
            updateSequence(moveForwardFig, '', true);
        }
    }
    // set correct subSequence type
    var sel = $('subSequenceDirections');
    if ($('subSequence').classList.contains('on')) {
        figures[selectedFigure.id].subSequence = sel.value;
        if (subSequence === false) {
            updateSequence(i, sel.value, false);
        } else {
            updateSequence(subSequence, sel.value, true);
        }
    } else {
        if (subSequence !== false) {
            updateSequence(subSequence, '', true);
            sel.value = userpat.subSequence;
        }
    }

    // set entry extension
    var val = $('entryExt-value').value;
    if (val < 0) {
        if (pattern[0] == '-') {
            // don't prepend + for negative entry
            pattern = new Array(1 - val).join(userpat.lineshorten) + pattern;
        } else {
            pattern = `${new Array(1 - val).join(userpat.lineshorten)}+${pattern}`;
        }
    } else if (val > 0) {
        val = val / 3;
        if ($('figEntryButton').classList.contains('inverted')) {
            // use '-' for negative entry
            pattern = new Array(parseInt(val) + 1).join('-') + pattern;
        } else {
            pattern = new Array(parseInt(val) + 1).join(userpat.longforward) + pattern;
        }
        pattern = new Array(Math.round((val - parseInt(val)) * 3) + 1).join(userpat.forward) + pattern;
    }

    // set exit extension
    val = $('exitExt-value').value;
    if (val < 0) {
        if (pattern.slice(-1) == '-') {
            // don't prepend + for negative exit
            pattern += new Array(1 - val).join(userpat.lineshorten);
        } else {
            pattern += `+${new Array(1 - val).join(userpat.lineshorten)}`;
        }
    } else if (val > 0) {
        val = val / 3;
        if ($('figExitButton').classList.contains('inverted')) {
            // use '-' for negative exit
            pattern += new Array(parseInt(val) + 1).join('-');
        } else {
            pattern += new Array(parseInt(val) + 1).join(userpat.longforward);
        }
        pattern += new Array(Math.round((val - parseInt(val)) * 3) + 1).join(userpat.forward);
    }

    var axisChange = figures[selectedFigure.id].entryAxisFormB;

    // set switchY
    if ($('switchY').classList.contains('on')) {
        pattern += axisChange ? userpat.switchDirX : userpat.switchDirY;
    }

    // set switchX
    if ($('switchX').classList.contains('on')) {
        pattern += axisChange ? userpat.switchDirY : userpat.switchDirX;
    }

    // when there was a flipYaxis in this figure, add it to the beginning
    // of the pattern
    if (figures[selectedFigure.id].string.indexOf(userpat.flipYaxis) > -1) {
        pattern = userpat.flipYaxis + pattern;
    }

    // update comments, including Free (Un)known letter
    // keep this at the end to prevent disturbing other items
    var val = $('unknownFigure').value;
    var comments = (val != 0) ? `@${val}` : '';

    comments += $('comments').value;

    // retrieve original comments
    if (figures[selectedFigure.id].unknownFigureLetter) {
        var oldComments = `@${figures[selectedFigure.id].unknownFigureLetter}`;
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
                match = prevFig.string.match(RegExp('^\\' + userpat.comment +
                    '([^\\' + userpat.comment + ']*)\\' + userpat.comment + '$'));
                if (match) {
                    if (comments != '') {
                        updateSequence(i, `"${comments}"`, true, false, false, true);
                    } else {
                        updateSequence(i, '', true, false, false, true);
                    }
                    break;
                }
            }
            i--;
        }
        // no match, apply new
        if (!match && (comments != '')) {
            updateSequence(
                selectedFigure.id - 1,
                `"${comments}"`,
                false,
                false,
                false,
                true);
        }
    }

    // update the sequence with the final pattern
    if (pattern !== string) {
        updateSequence(selectedFigure.id, pattern, true);
    } else if (!noRedraw) {
        updateFigureOptions(selectedFigure.id);
    }
    $('leftBlockContainer').scrollTop = scroll;
}

// updateFigureComments updates the figure coments
function updateFigureComments() {
    if (intervalID.updateFigureComments) {
        window.clearTimeout(intervalID.updateFigureComments);
    }
    intervalID.updateFigureComments = window.setTimeout(function () {
        updateFigure();
        delete intervalID.updateFigureComments;
    }, 100);
}

// getLatestVersion makes sure the latest version is installed
function getLatestVersion() {
    if (localStorage.getItem("reload")) {
        localStorage.removeItem("reload");
    } else {
        getStableVersion(function (latestVersion) {
            // Show a warning banner when the version is older than Stable
            // AND Stable is at least 48 hours old
            if (compVersion(version, latestVersion) == -1 &&
            parseInt(latestVersion.split(' ')[1]) > 172800) {
                if (!/^http/.test(window.location.protocol)) {
                    var banner = $('installApp');
                    banner.classList.remove('noDisplay');
                    $('t_getTheApp').innerHTML =
                        sprintf(userText.updateApp, latestVersion.split(' ')[0]);
                    if (platform.android) banner.classList.add('android');
                    if (platform.ios) banner.classList.add('ios');
                    banner.classList.add('update', 'show');
                } else {
                    // Set "reload" in localStorage to make sure we only reload once
                    localStorage.setItem("reload", "true");
                    window.location.reload();
                }
            }
        });
    }
}

// getStableVersion returns whichever version is currently on
// openaero.net or the iOS app store. Function f is
// executed when version is loaded
function getStableVersion(f) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 5000;
    xhr.onload = function () { f(xhr.response) };
    xhr.onerror = xhr.ontimeout = function () { f(false) };
    xhr.open('GET', 'https://openaero.net/openaero.php?v', true);
    xhr.send();
}

// preventUnload is used to set a question asking the user if he wants
// to leave OpenAero. Argument is false (no question) or true (question)
function preventUnload(e) {
    e.returnValue = userText.confirmLeave;
    return userText.confirmLeave;
}

// checkUpdateDone checks if an update was just done. If so, it presents
// a dialog to the user
function checkUpdateDone() {
    function f(oldVersion) {
        if (!oldVersion) {
            // First install

            // Set numberInCircle for French browser
            if (navigator.language == 'fr') {
                if (!$('numberInCircle').checked) {
                    $('numberInCircle').checked = true;
                    numberInCircle = true;
                }
            }

            // Adjust language when available
            if (navigator.language != 'en' && lang[navigator.language]) {
                // change language next, this will also saveSettingsStorage
                if ($('language').value != navigator.language) {
                    $('language').value = navigator.language;
                    changeLanguage();
                }
            }

            // Wait a few seconds to give platform.cordova to be set if applicable
            setTimeout(function () {
                if (platform.cordova || platform.uwp) {
                    alertBox(
                        { userText: 'installedApp' },
                        { userText: 'installation' }
                    );
                } else if (platform.windows10) {
                    alertBox(
                        { userText: 'installedWindows10', params: [window.location.host] },
                        { userText: 'installation' }
                    );
                } else if (window.location.host) {
                    alertBox(
                        { userText: 'installed', params: [window.location.host] },
                        { userText: 'installation' }
                    );
                }
            }, 3000);
            storeLocal('version', version);
        } else if (oldVersion !== version) {
            // create version update text
            var list = [];
            for (let v in versionNew) {
                if (compVersion(oldVersion, v) < 0) {
                    for (let i = 0; i < versionNew[v].length; i++) {
                        list.push(versionNew[v][i]);
                    }
                }
            }
            list.sort(function (a, b) { return b[1] - a[1] });
            var li = '';
            for (let i = 0; i < Math.min(list.length, versionNewMax); i++) {
                li += `<li>${list[i][0]}</li>\n`;
            }
            alertBox(sprintf(userText.versionNew, oldVersion, version, li));
            // create link for changelog
            $('changelog').addEventListener(
                'mousedown',
                function () { helpWindow('changelog.txt', 'changelog.txt'); }
            );
            storeLocal('version', version);
        }
    }

    // this only works when storage is enabled
    if (storage) getLocal('version', f);
}

// removeBanner hides and then removes banner
function removeBanner(banner) {
    banner.classList.remove('show');
    setTimeout(function () { banner.classList.add('noDisplay') }, 2000);
}

// changeSequenceInfo is called whenever any part of the sequence info
// may be changed, including the sequence string
function changeSequenceInfo() {
    // check if sequenceInfo element exists. If not, we may be called from
    // page using API
    if ($('sequenceInfo')) {
        // change the web page title to reflect the sequence info
        document.title =
            (
                `OpenAero - ${$('category').value} ${$('program').value} ${$('location').value} - ${$('date').value} - ${$('pilot').value}`
            ).replace(/- +-/g, '-').replace(/[ -]+$/, '');

        // create sequence XML
        var xml = '<sequence>\n'
        for (let i = 0; i < sequenceXMLlabels.length; i++) {
            var el = $(sequenceXMLlabels[i]);
            if (el) {
                var value = ('value' in el) ? el.value : el.innerText;
                if (value !== '') {
                    xml += `<${sequenceXMLlabels[i]}>${value
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;")}</${sequenceXMLlabels[i]}>\n`;
                }
            }
        }
        xml += '</sequence>';
        if (xml != activeSequence.xml) {
            if (activeSequence.addUndo) {
                // add undo and clear redo
                if (activeSequence.xml) {
                    activeSequence.undo.push(activeSequence.xml);
                    // maximum 100 undos
                    while (activeSequence.undo.length > 100) {
                        activeSequence.undo.shift();
                    }
                }

                setUndoRedo('redo', true);
            }
            // put everything in activeSequence.xml object
            activeSequence.xml = xml;
            // save activeSequence.xml in storage 'sequence'
            storeLocal('sequence', activeSequence.xml);
        }
        checkInfo();
        // update 'Notes' field height
        $('notes').style.height = "";
        $('notes').style.height = $('notes').scrollHeight + "px";
    }
}

// buildFigureXML creates a well-formatted XML string that holds all
// sequence details. It is later appended at the end of the .seq file
function buildFigureXML() {
    var
        ff = document.createElement('figures'),
        figNr = 0,
        aresti,
        k;
    figureK = 0;
    for (let i = 0; i < figures.length; i++) {
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
                if ((figureLetters.indexOf(figures[i].unknownFigureLetter) > -1) ||
                    (additionalFig.max && (figures[i].unknownFigureLetter === 'L')) ||
                    !activeRules) {
                    var letter = f.appendChild(document.createElement('letter'));
                    letter.appendChild(document.createTextNode(figures[i].unknownFigureLetter));
                }
            }

            if (figures[i].superFamily) {
                var sf = f.appendChild(document.createElement('sf'));
                sf.appendChild(document.createTextNode(figures[i].superFamily));
            }

            for (let j = 0; j < aresti.length; j++) {
                var el = f.appendChild(document.createElement('element'));
                var aj = el.appendChild(document.createElement('aresti'));
                aj.appendChild(document.createTextNode(aresti[j]));
                var kj = el.appendChild(document.createElement('k'));
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
    if (parseInt($('positioning').value)) {
        var totalK = figureK +
            parseInt($('positioning').value);
    } else var totalK = figureK;
    var tK = ff.appendChild(document.createElement('totalk'));
    tK.appendChild(document.createTextNode(totalK));
    var xml = new XMLSerializer().serializeToString(ff);
    return (xml.replace(/^<figures[^>]*/, '<figures'));
}

// buildSettingsXML creates a well-formatted XML string that holds all
// settings details. It is later appended at the end of the .seq file
function buildSettingsXML() {
    var key, val, s, node;
    var settings = document.createElement('settings');
    for (let i = 0; i < saveSettings.length; i++) {
        key = saveSettings[i];
        // get the value or, if checkbox, if checked or not
        if ($(key).type == 'checkbox') {
            val = $(key).checked ? true : false;
        } else {
            val = $(key).value;
        }
        s = settings.appendChild(document.createElement('setting'));
        node = s.appendChild(document.createElement('key'));
        node.appendChild(document.createTextNode(key));
        node = s.appendChild(document.createElement('value'));
        node.appendChild(document.createTextNode(val));
    }
    return (new XMLSerializer().serializeToString(settings));
}

// changeCombo is executed when a combo box value is changed by user or
// when called by other routine. In the latter case it should always be
// called as changeCombo ('program') to prevent strange effects.
// When noLogo is true, the logo is not changed
// If a callback is provided, this will be executed with log and alertMsgs
// as argument. Also when the rules are not changed, sequence check will
// be done as other code relies on this
function changeCombo(id, callback) {
    function disable(e) {
        e.value = '';
        if (e.id === 'program') {
            e.placeholder = userText.selectCategoryFirst;
        } else {
            e.placeholder = userText.selectRulesFirst;
        }
        e.setAttribute('disabled', 'disabled');
        e.nextElementSibling.innerHTML = '';
    }
    function enable(e) {
        e.placeholder = '';
        e.removeAttribute('disabled');
        e.nextElementSibling.innerHTML = userText[e.id];
    }

    var rules = $('rules'),
        ruleName = getRuleName(),
        category = $('category'),
        categoryName = category.value.toLowerCase(),
        program = $('program'),
        programName = program.value.toLowerCase();

    if (id === 'rules') {
        // set default logo for rules
        if (rulesLogo[ruleName]) selectLogo(rulesLogo[ruleName]);

        // set CIVA, IAC or IMAC forms default
        formStyle = /^(iac|imac)$/i.test(rules.value) ?
            rules.value.match(/(iac|imac)/i)[1].toLowerCase() : 'civa';
        $('formStyle').value = formStyle;

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
        disable(category);
    } else enable(category);
    if (category.value == '') {
        disable(program);
    } else enable(program);

    function completeActions() { // called after rule checking
        changeSequenceInfo();
        // redraw sequence. May be necessary to update (mini) Form A
        checkSequenceChanged(true);
        // make sure only available figure groups are shown in chooser
        availableFigureGroups();
    }

    // Load rules and check against the sequence. Display any alerts.
    // Activate callback if required.
    var
        ruleName = getRuleName(),
        catName = $('category').value.toLowerCase(),
        programName = $('program').value.toLowerCase();

    // load the rules. Worker will decide if it's possible and necessary
    rulesWorker.postMessage({
        action: 'loadRules',
        ruleName: ruleName,
        catName: catName,
        programName: programName
    });

    // check the rules and execute function
    checkRules(function (data) {
        addAlertsToAlertMsgs(data);
        displayAlerts();
        markFigures();
        checkInfo();
        completeActions();
        if (callback) callback(data);
    });
}

// highlight marks part of a text
function highlight(el, start, end) {
    var
        text = el.innerText,
        range = saveSelection(el);

    if (end) {
        var newHTML = (text.substr(0, start) +
            '<span class="highlight">' + text.substr(start, (end - start)) +
            '</span>' + text.substr(end)).replace(/(\r\n|\n|\r)/gm, '');
        if (el.innerHTML !== newHTML) el.innerHTML = newHTML;
        var span = el.getElementsByClassName('highlight')[0];
        el.scrollTop = parseInt(span.getBoundingClientRect().top -
            el.getBoundingClientRect().top);
    } else if (el.innerHTML != text) el.innerHTML = text;
    if (document.activeElement === el) restoreSelection(el, range);
}

// saveSelection returns the current selection in containerEl
function saveSelection(containerEl) {
    var
        doc = containerEl.ownerDocument,
        win = doc.defaultView;

    if (!win.getSelection().anchorNode) return { start: 0, end: 0 };

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
function restoreSelection(containerEl, savedSel) {
    var
        doc = containerEl.ownerDocument,
        charIndex = 0,
        range = doc.createRange(),
        nodeStack = [containerEl],
        node,
        foundStart = false,
        stop = false;

    range.setStart(containerEl, 0);
    range.collapse(true);

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

    var sel = doc.defaultView.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

// copyContest will copy the contest info to localStorage
function copyContest(e) {
    noPropagation(e);
    storeLocal('contestInfo', JSON.stringify({
        location: $('location').value,
        date: $('date').value,
        logo: $('logo').value,
        notes: $('notes').value
    }));
}

// pasteContest retrieves contest info from localStorage and puts it in
// Contest Info fields
function pasteContest(e) {
    noPropagation(e);
    if ($('lockContest').classList.contains('locked')) return;
    getLocal('contestInfo', function (string) {
        if (string) {
            var info = JSON.parse(string);
            $('location').value = info.location;
            $('date').value = info.date;
            if (info.logo) selectLogo(info.logo); else removeLogo();
            $('notes').value = info.notes;
            changeSequenceInfo();
        }
    });
}

// lockContest locks and unlocks the contest info when called. Locking
// prevents the contest info from being changed by anything
function lockContest(e) {
    noPropagation(e);
    if ($('lockContest').classList.contains('locked')) {
        // unlock
        $('lockContest').classList.remove('locked');
        $('pasteContest').classList.remove('disabled');
        $('removeLogo').classList.remove('disabled');
        $('t_chooseLogo').classList.remove('disabled');
        $('location').disabled = false;
        $('date').disabled = false;
        $('printNotes').disabled = false;
        $('notes').disabled = false;
    } else {
        // lock
        $('lockContest').classList.add('locked');
        $('pasteContest').classList.add('disabled');
        $('removeLogo').classList.add('disabled');
        $('t_chooseLogo').classList.add('disabled');
        $('location').disabled = true;
        $('date').disabled = true;
        $('printNotes').disabled = true;
        $('notes').disabled = true;
    }
}

// buildLogoSvg will create a logo svg from a provided image string,
// width and height
function buildLogoSvg(logoImage, x, y, width, height, blackWhite) {

    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("version", "1.2");
    svg.setAttribute("baseProfile", "basic");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("xmlns:xlink", xlinkNS);
    // svg images are included inline and scaled
    if (logoImage.match(/<svg/)) {
        var
            parser = new DOMParser(),
            doc = parser.parseFromString(logoImage, "image/svg+xml"),
            svgBase = doc.getElementsByTagName('svg')[0],
            scale = Math.min(width / svgBase.getAttribute('width'),
                height / svgBase.getAttribute('height')),
            group = document.createElementNS(svgNS, "g");

        group.setAttribute('transform', 'translate(' + roundTwo(x) + ',' +
            roundTwo(y) + ') scale(' + scale.toFixed(4) + ')');
        group.appendChild(svgBase);
        svg.appendChild(group);
        // other images are included through an xlink data url
    } else {
        // find image size and use this to set correct width and height of
        // image, using provided as max
        var img = document.createElement('img');
        img.src = logoImage;
        if (img.width) {
            var scale = Math.min(width / img.width, height / img.height);
            width = parseInt(img.width * scale);
            height = parseInt(img.height * scale);
        }
        drawImage({
            x: x, y: y, width: width, height: height,
            preserveAspectRatio: 'xMaxYMax', href: logoImage
        }, svg);
    }
    svg.setAttribute("class", "logoSvg");
    svg.setAttribute("width", x + width);
    svg.setAttribute("height", y + height);

    if (blackWhite) {
        var defs = document.createElementNS(svgNS, 'defs');
        defs.innerHTML =
            `<filter id="blackWhiteFilter">
                <feColorMatrix in="SourceGraphic" type="saturate" values="0"/>
            </filter>`;
        svg.firstChild.setAttribute('filter', 'url(#blackWhiteFilter)');
        svg.insertBefore(defs, svg.firstChild);
    }

    return svg;
}

// logoChooser will display the available logos
// and allow for selection of a logo
function logoChooser() {
    if ($('lockContest').classList.contains('locked')) return;
    // define logo thumbnail width and height
    var width = 80;
    var height = 80;
    // show the logo chooser container
    var container = $('logoChooserContainer');
    container.classList.remove('noDisplay');
    // clear logo file when present
    if ($('logoFile')) $('logoFile').value = '';
    // Show all the logo images
    container = $('chooseLogo');
    // Clean up the container
    var fileDropLogo = $('fileDropLogo');
    fileDropLogo.style.width = (width - 40) + 'px';
    fileDropLogo.style.height = (height - 40) + 'px';
    while (container.lastChild !== fileDropLogo) {
        container.lastChild.remove();
    }
    // add logoImages
    getLocal('logoSelectionCount', function (count) {
        // find out which are used most, put them right after private logos
        count = JSON.parse(count);
        var keys = Object.keys(count);
        for (let i = 0; i < keys.length; i++) {
            // remove private logos. They are added to the beginning later
            if (/^\d+$/.test(keys[i])) {
                keys.splice(i, 1);
                i--;
            } else keys[i] = `${count[keys[i]]}|${keys[i]}`;
        }
        keys.sort(function (a, b) { return parseInt(b) - parseInt(a) });
        for (let i = 0; i < keys.length; i++) keys[i] = keys[i].split('|')[1];
        var privateLogos = 0;
        for (let logoName in logoImages) {
            if (/^\d+$/.test(logoName)) {
                // add private logos to the beginning
                keys.unshift(logoName);
                privateLogos++;
            } else if (!keys.includes(logoName)) {
                // add remaining logos to the end
                keys.push(logoName);
            }
        }
        if (privateLogos > 2) { // max 3 private logos
            fileDropLogo.classList.add('noDisplay');
        } else fileDropLogo.classList.remove('noDisplay');
        // build the logos in correct order
        for (let i = 0; i < keys.length; i++) {
            var div = document.createElement('div');
            container.appendChild(div);
            var logoName = keys[i];
            div.setAttribute("alt", logoName);
            div.addEventListener('mousedown', selectLogo, false);
            div.appendChild(buildLogoSvg(logoImages[logoName], 0, 0, width, height));
            if (/^\d+$/.test(logoName)) {
                // add a 'delete' button
                var button = document.createElement('div');
                button.classList.add('deleteLogoButton');
                button.id = `deleteLogo-${logoName}`;
                button.innerHTML = '<i class="material-icons">close</i>';
                // make sure we remove on touch devices by using touchstart
                // which fires before mousedown
                if (platform.touch) {
                    button.addEventListener('touchstart', deleteLogo);
                }
                button.addEventListener('mousedown', deleteLogo);
                div.appendChild(button);
            }
        }
    });
}

// selectLogo is called when a logo is clicked in the logoChooser and
// will select the correct logo for use. Can also be called from
// code in which case a logo name should be supplied.
function selectLogo(logo) {
    // called from eventListener
    if (this && this.getAttribute) {
        // get name from alt attribute
        logo = this.getAttribute('alt');
        // increment selection counter
        getLocal('logoSelectionCount', function (totals) {
            totals = JSON.parse(totals);
            if (logo in totals) totals[logo]++; else totals[logo] = 1;
            storeLocal('logoSelectionCount', JSON.stringify(totals));
        });
    }

    // check if there already was a logo to replace
    var replace = logoImg ? true : false;
    logoImg = logoImages[logo];
    $('logo').value = logo;
    if (!replace) drawActiveLogo();
    // move the logo smoothly into place from logoChooser
    if (this && this.getAttribute) {
        var
            el = $('logoImage'),
            elBox = el.getBoundingClientRect(),
            thisBox = this.firstChild.getBoundingClientRect();
        // set transform for new logo. Take into account that the old logo
        // container may have been moved left from view if no logo was
        // active
        this.style.transform = 'translate(' +
            (((elBox.left > 0) ? elBox.left : (elBox.left + 240)) - thisBox.left) +
            'px,' + (elBox.bottom - thisBox.bottom) + 'px)';
        if (!replace) el.style = 'opacity: 0.001';
        setTimeout(function () {
            if (replace) drawActiveLogo();
            el.style = '';
            hideLogoChooser();
        }, 300);
    } else if (replace) {
        // or just replace if not from logoChooser
        drawActiveLogo();
    }
    changeSequenceInfo();
}

// drawActiveLogo makes a small thumbnail of the active logo in the
// Sequence info and adds 'remove logo' link
// Start by checking for logoImage element. It may not be present when
// using OpenAero API
function drawActiveLogo() {
    if ($('logoImage')) {
        var width = 120; // maximum width
        var height = 60; // maximum height
        $('logoImage').classList.remove('noDisplay');
        $('activeLogo').classList.remove('empty');
        $('t_chooseLogo').classList.add('noDisplay');
        // Create logo svg
        var link = $('logoImage');
        if (link.firstChild) link.firstChild.remove();
        link.appendChild(buildLogoSvg(logoImg, 0, 0, width, height));

        $('removeLogo').classList.remove('noDisplay');
        $('contest').classList.add('hasLogo');
        return true;
    } else return false;
}

// removeLogo makes it possible to remove the previously chosen logo
function removeLogo() {
    if ($('lockContest').classList.contains('locked')) return;
    logoImg = false;
    // Remove 'remove logo' link and logo image
    $('removeLogo').classList.add('noDisplay');
    $('activeLogo').classList.add('empty');
    setTimeout(function () {
        $('logoImage').classList.add('noDisplay');
        $('contest').classList.remove('hasLogo');
        // Add choose logo option
        $('t_chooseLogo').classList.remove('noDisplay');
    }, 300);
    $('logo').value = '';
    changeSequenceInfo();
}

// deleteLogo deletes the private logo from the chooser and localStorage
function deleteLogo(evt) {
    noPropagation(evt);
    var logoName = this.id.replace(/^deleteLogo-/, '');
    this.parentNode.remove();
    $('fileDropLogo').classList.remove('noDisplay');
    delete logoImages[logoName];
    privateLogoImages = {};
    // update images in localStorage
    for (let key in logoImages) {
        if (/^\d+$/.test(key)) privateLogoImages[key] = logoImages[key];
    }
    storeLocal('logoImages', JSON.stringify(privateLogoImages));
}

// parseFiguresFile parses the figures file and stores it in several
// arrays for fast retrieval
function parseFiguresFile() {
    var
        groupRegex = new RegExp('^F\\d'),
        figGroupSelector = $('figureGroup'),
        figGroupNr = 0,
        entryExit = '',
        entryExitSplit = [],
        theBase = '',
        rollbase = '',
        rolls = [];

    // add the Queue 'figure group' at the beginning
    figGroup[0] = { 'family': '*', 'name': userText.figureQueue };
    // add an option for the group to the figure selector
    var option = document.createElement('option');
    option.setAttribute('value', 0);
    option.id = 't_figureQueue';
    option.classList.add('userText');
    if (figGroupSelector) figGroupSelector.appendChild(option);

    var figMainGroup = '';
    var groupClasses = ['familyA', 'familyB'];
    var groupClass = 1;
    for (let i = 0; i < figs.length; i++) {
        // Clean up the lines
        var line = sanitizeSpaces(figs[i]);
        // Split the remainder on the space. Figure group lines and
        // Family 9 should now have two elements, the others three
        var splitLine = line.split(" ");
        // check if we are dealing with a 'figure group' line
        if (groupRegex.test(line)) {
            // increase figGroupNr counter
            figGroupNr++;
            // parse family and name
            figGroup[figGroupNr] = {
                'family': splitLine[0].replace(/^F/, ''),
                'name': splitLine[1]
            };
            // add an option for the group to the figure selector
            var option = document.createElement('option');
            option.setAttribute('value', figGroupNr);
            option.setAttribute('id', `t_figureGroups.${figGroup[figGroupNr].name}`);
            option.classList.add ('userText');
            if (figMainGroup != line[1]) {
                figMainGroup = line[1];
                groupClass = 1 - groupClass;
            }
            option.classList.add(groupClasses[groupClass]);
            if (figGroupSelector) figGroupSelector.appendChild(option);
        } else {
            if (splitLine[0]) {
                // Next we split the Aresti and K-factors part
                var arestiK = splitLine[1].split("(");
                var kFactors = arestiK[1].replace(")", "").split(":");
                if (!arestiK[1].match(/:/)) kFactors[1] = kFactors[0];
                // Split K factors on the colon; kFactors[0] is for Powered,
                // kFactors[1] is for Gliders
                fig[i] = {
                    'aresti': arestiK[0],
                    'kPwrd': parseInt(kFactors[0]),
                    'kGlider': parseInt(kFactors[1]),
                    'group': figGroupNr,
                    'pattern': splitLine[0]
                };
                (arestiToFig[arestiK[0]] || (arestiToFig[arestiK[0]] = [])).push(i);
                // Extract roll elements for everything but roll figures
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
                        theBase.replace(/[^-+]*/g, '').replace(/-/g, 'n').replace(/\+/g, 'N');
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
                    for (let r = 0; r < rolls.length; r++) {
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
                    entryExit = fig[i].draw.replace(/[^dvzmcpro_]/gi, '');
                    // assure only half rolls remain
                    entryExitSplit = entryExit.split('_');
                    for (let j = 0; j < entryExitSplit.length; j++) {
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
                    entryExit = entryExit.replace(regexSpeedConv.v, 'v').replace(regexSpeedConv.V, 'V');

                    // getCode gets correct letter code, depending on attitude,
                    // aClass (aerobatic class) and entry or exit
                    function getCode(att, aClass, ee) {
                        if (regexSpeed[aClass][ee].L.test(entryExit)) {
                            return (att === '+') ? 'L' : 'l';
                        } else if (regexSpeed[aClass][ee].H.test(entryExit)) {
                            return (att === '+') ? 'H' : 'h';
                        } else return (att === '+') ? 'N' : 'n';
                    }

                    fig[i].entryExitGlider = getCode(theBase[0], 'glider', 'entry') +
                        getCode(theBase.slice(-1), 'glider', 'exit');
                    fig[i].entryExitPower = getCode(theBase[0], 'power', 'entry') +
                        getCode(theBase.slice(-1), 'power', 'exit');
                    fig[i].entryExit = fig[i].entryExitPower;
                } else {
                    // Handle rolls
                    delete (fig[i]); // no fig object for rolls
                    rollFig[splitLine[0]] = {
                        aresti: arestiK[0],
                        kPwrd: parseInt(kFactors[0]),
                        kGlider: parseInt(kFactors[1])
                    };
                    (rollArestiToFig[arestiK[0]] || (rollArestiToFig[arestiK[0]] = [])).push(splitLine[0]);
                }
            }
        }
    }
    // select first figure group and create a clone of HTML content
    if (figGroupSelector) {
        figGroupSelector.value = 1;
        $('figureGroupClone').innerHTML = figGroupSelector.innerHTML;
    }
}

// getRuleName will create the correct, active, ruleName
function getRuleName() {
    return (
        (sportingClass.value === 'glider' ? 'glider-' : '') +
        $('rules').value.toLowerCase()
    );
}

// updateRulesList updates the rules field for power or glider
function updateRulesList(avail) {
    var
        el = $('rules').list ?
            $('datalist-rules') :
            $('rulesList'),
        fragment = document.createDocumentFragment();

    function addRuleItem(name) {
        if ($('rules').list) {
            var listItem = document.createElement('option');
            listItem.value = name;
        } else {
            var listItem = document.createElement('li');
            listItem.innerHTML = name;
        }
        fragment.appendChild(listItem);
    }

    if (avail) seqCheckAvail = avail; // update when avail provided

    // clear list
    removeChildNodes(el);
    // Start with empty option
    addRuleItem('');
    // build list for powered or glider
    for (let ruleName in seqCheckAvail) {
        if (sportingClass.value === 'glider' === /^glider-/.test(ruleName)) {
            if (seqCheckAvail[ruleName].show) {
                addRuleItem(seqCheckAvail[ruleName].name);
            }
        }
    }
    el.appendChild(fragment);
}

// updateCategoryList updates the category list
function updateCategoryList() {
    var
        ruleName = getRuleName(),
        el = $('category').list ?
            $('datalist-category') :
            $('categoryList'),
        fragment = document.createDocumentFragment();

    removeChildNodes(el);
    // Populate category list
    if (seqCheckAvail[ruleName]) {
        for (let n in seqCheckAvail[ruleName].cats) {
            if (seqCheckAvail[ruleName].cats[n].show) {
                var listItem = document.createElement(
                    $('category').list ? 'option' : 'li');
                var name = seqCheckAvail[ruleName].cats[n].name;
                listItem.appendChild(document.createTextNode(name));
                fragment.appendChild(listItem);
            }
        }
    }
    el.appendChild(fragment);
}

// updateProgramList updates the program list
function updateProgramList() {
    var
        ruleName = getRuleName(),
        categoryName = $('category').value.toLowerCase(),
        el = $('program').list ?
            $('datalist-program') :
            $('programList'),
        fragment = document.createDocumentFragment();

    removeChildNodes(el);
    // Populate program list
    if (seqCheckAvail[ruleName] && seqCheckAvail[ruleName].cats[categoryName]) {
        for (let n in seqCheckAvail[ruleName].cats[categoryName].seqs) {
            if (seqCheckAvail[ruleName].cats[categoryName].seqs[n][0] != '*') {
                var listItem = document.createElement(
                    $('program').list ? 'option' : 'li');
                var name = seqCheckAvail[ruleName].cats[categoryName].seqs[n];
                listItem.appendChild(document.createTextNode(name));
                fragment.appendChild(listItem);
            }
        }
    }
    el.appendChild(fragment);
}

// checkRules calls the checkRules worker with a callbackId
function checkRules(callback) {
    var id = uniqueId();
    workerCallback[id] = callback;

    multi.useReference = $('multiUseReference').checked;

    rulesWorker.postMessage({
        action: 'checkRules',
        activeSequenceText: activeSequence.text,
        figures: simplifyFigures(),
        nonArestiRolls: $('nonArestiRolls').checked,
        multi: multi,
        callbackId: id
    });
}

// activateRules is called by loadRules Worker
function activateRules(data) {
    additionalFig = data.additionalFig;
    checkAllowCatId = data.checkAllowCatId;
    checkCatGroup = data.checkCatGroup;
    infoCheck = data.infoCheck;
    activeRules = data.activeRules;
    ruleSuperFamily = data.ruleSuperFamily;

    // set the activeRules marker
    $('rulesActive').classList.add('good');
    // Fold rules section, unless there are multiple pos K options
    if ($('positioningText').classList.contains('hidden')) {
        $('rulesLabel').parentNode.classList.remove('expanded');
        panelHeader($('activeRules'));
    }

    // set a rule based logo if applicable
    if (activeRules.logo) selectLogo(activeRules.logo);

    if (data.updatedFig) {
        fig = data.updatedFig;
        // Assure that queue figures are reloaded if applicable
        queueFromStorage();
    }

    if (data.figureLetters) {
        figureLetters = data.figureLetters;
        // show reference sequence link
        $('t_referenceSequence').classList.remove('noDisplay');
    } else {
        // hide link
        $('t_referenceSequence').classList.add('noDisplay');
    }

    // set formStyle (civa, iac or imac)
    $('formStyle').value = data.formStyle;

    // by default, disable "Print Super Family", but enable change
    // enable when rules with sf definition active and disable change
    $('printSF').checked = data.ruleSuperFamily.length ? true : false;
    $('printSF').disabled = data.ruleSuperFamily.length ? true : false;

    rulesKFigures = data.rulesKFigures;

    // update reference sequence
    changeReferenceSequence(true);
}

// unloadRules will set rules to inactive and do some checks.
// It should only be called from the rule Worker
function unloadRules(updatedFig) {
    if (updatedFig) {
        rulesKFigures = {};
        fig = updatedFig;
        // Assure that queue figures are reloaded if applicable
        queueFromStorage();
        console.log('Resetting K factors');
    }

    // by default, disable "Print Super Family", but enable change
    $('printSF').checked = false;
    $('printSF').disabled = false;

    figureLetters = '';
    activeRules = false;
    $('rulesActive').classList.remove('good');

    // remove disable property of positioning and harmony
    $('positioning').removeAttribute('disabled');
    $('harmony').removeAttribute('disabled');
    if (sportingClass.value !== 'powered') {
        $('harmonyField').classList.remove('hidden');
    }
    // Hide options for choosing positioning K
    $('positioningText').classList.add('hidden');
    // update sequence
    checkSequenceChanged(true);
    // hide reference sequence button
    $('t_referenceSequence').classList.add('noDisplay');
    // restore Reference sequence to previous value
    $('referenceSequenceString').value = savedReference;
    $('referenceSequenceString').removeAttribute('disabled');
    $('t_referenceSequenceFixed').classList.add('noDisplay');

    // Set formStyle value depending on Rules field only
    formStyle = /^(iac|imac)$/i.test(rules.value) ? strToLower(rules.value).match(/(iac|imac)/)[1] : 'civa';
    $('formStyle').value = formStyle;

    // make sure only available figure groups are shown in chooser
    availableFigureGroups();
    // update figure chooser
    changeFigureGroup();
}

// checkAlert adds an alert resulting from sequence checking
// value : a value for processing
// type  : the type of checking error
// rule  : optional, literal text for the rulebook rule that invoked
//         this as in xxx-rule
function checkAlert(value, type, figNr, rule) {
    rulesWorker.postMessage({
        action: 'checkAlert',
        value: value,
        type: type,
        figNr: figNr,
        rule: rule
    });
}

// checkSequence will show a window with sequence checking information
// show=true : show window
// show=log  : show log page
// show=false: hide window
function checkSequence(show) {
    if (show) {
        if (show === 'log') {
            checkRules((data) => {
                alertBox(() => {
                    // show log page
                    var div = document.createElement('div');
                    var pre = document.createElement('pre');
                    for (let i = 0; i < data.log.length; i++) {
                        pre.appendChild(document.createTextNode(data.log[i] + '\n'));
                    }
                    div.appendChild(pre);
                    return `<div id="logBox">${div.innerHTML}</div>`;
                }, userText.sequenceCheckLog,
                    [{
                        'name': 'copyClipboard', 'function': function () {
                            window.getSelection().selectAllChildren($('logBox'));
                            document.execCommand('copy');
                            alertBox();
                        }
                    }]
                );
                window.getSelection().selectAllChildren($('logBox'));
            });
            $('checkSequence').classList.add('noDisplay');
        } else {
            $('checkSequence').classList.remove('noDisplay');
            if (activeRules) {
                var content = `<div class="divider">${userText.checkingRules} : ${activeRules.description}</div>`;
            } else {
                var content = '';
            }
            // get alerts from alert area
            var contentDiv = $('checkSequenceContent');
            contentDiv.innerHTML = $('alerts').innerHTML;
            // remove label
            contentDiv.firstChild.remove();
            if (contentDiv.innerHTML == '') {
                // no alerts
                if (activeRules) {
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
        $('checkSequence').classList.add('noDisplay');
    }
}

// lockSequence is called when locking or unlocking the sequence
// When lock is not true, it toggles. When lock is true it locks the
// sequence
function lockSequence(lock) {
    var els = document.getElementsByClassName('lock');
    if ($('lock_sequence').value && (lock !== true)) {
        // was locked, so unlock
        $('lock_sequence').value = '';
        $('lockSequence').classList.remove('noDisplay');
        $('unlockSequence').classList.add('noDisplay');
        for (let i = 0; i < els.length; i++) {
            if (els[i].tagName === 'LI') {
                els[i].classList.remove('noDisplay');
            } else if (els[i].getAttribute('disabledByLock')) {
                els[i].removeAttribute('disabled');
            }
        }
        $('t_locked').classList.add('hidden');
    } else {
        // was unlocked, so lock
        selectFigure(false);
        selectTab('tab-sequenceInfo');
        $('lock_sequence').value = '1';
        $('lockSequence').classList.add('noDisplay');
        $('unlockSequence').classList.remove('noDisplay');
        for (let i = 0; i < els.length; i++) {
            if (els[i].tagName === 'LI') {
                els[i].classList.add('noDisplay');
            } else if (!els[i].disabled) {
                els[i].setAttribute('disabledByLock', true);
                els[i].setAttribute('disabled', true);
            }
        }
        $('t_locked').classList.remove('hidden');
    }
    changeSequenceInfo();
    menuInactiveAll();
}

// setReferenceSequence is used to change several reference sequence
// parameters
function setReferenceSequence(string, fixed) {
    $('referenceSequenceString').value = string;
    if (fixed) {
        $('referenceSequenceString').setAttribute('disabled', true);
        $('t_referenceSequenceFixed').classList.remove('noDisplay');
    } else {
        $('referenceSequenceString').removeAttribute('disabled');
        $('t_referenceSequenceFixed').classList.add('noDisplay');
    }
}

// changeReferenceSequence is called when the reference sequence is
// changed
function changeReferenceSequence(auto) {
    var
        // remove all line breaks from the sequence reference
        string = $('referenceSequenceString').value.replace(/(\r\n|\n|\r)/gm, ' '),
        match,
        savedText = activeSequence.text,
        thisFigure = { 'string': '', 'stringStart': 0, 'stringEnd': 0 },
        inText = false,
        activeFormSave = activeForm;

    activeSequence.figures = [];
    if (auto !== true) savedReference = string;

    for (let i = 0; i <= string.length; i++) {
        if (string[i] == userpat.comment) inText = !inText;
        if (((string[i] === ' ') || (i === string.length)) && !inText) {
            if (thisFigure.string !== '') {
                // Remove moveForward (x>) and moveDown (x^) at the beginning of
                // a figure.
                // OLAN had it coupled to a figure but OpenAero keeps sequence
                // drawing instructions separate
                while (match = thisFigure.string.match(regexMoveFwdDn)) {
                    thisFigure.stringStart = thisFigure.stringStart + match[0].length;
                    thisFigure.string = thisFigure.string.replace(regexMoveFwdDn, '');
                }
                // only add figures that are not empty
                if (thisFigure.string != '') {
                    activeSequence.figures.push({
                        'string': thisFigure.string,
                        'stringStart': thisFigure.stringStart,
                        'stringEnd': i
                    });
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
    activeForm = 'G';
    Attitude = Direction = X = Y = 0;

    // See if there is a y-axis flip symbol and activate it, except when
    // it matches the subSequence code which is similar (/ or //). Usually
    // this is done by parseSequence, but it checks activeSequence.text
    if (string.replace(regexComments, '').match(regexFlipYAxis)) {
        setYAxisOffset(180 - yAxisOffset);
    }

    parseSequence();

    activeForm = activeFormSave;

    var figCount = figures.filter((figure) => figure.aresti).length;

    const div = $('referenceSequenceDialog');
    var noDisplay = div.classList.contains('noDisplay');

    // show div to make sure bBoxes can be calculated
    div.classList.remove('noDisplay');

    var svg = $('referenceSequenceSvg');
    prepareSvg(svg);
    if (figCount) {
        makeFormGrid(figCount, figCount * 150, svg);
        if (svg.getAttribute('width') && svg.getAttribute('height')) {
            svg.setAttribute('width', svg.getAttribute('width') * (200 / svg.getAttribute('height')));
        }
        svg.setAttribute('height', 200);
    } else {
        svg.setAttribute('width', 0);
        svg.setAttribute('height', 0);
    }

    // restore div to previous state
    if (noDisplay) div.classList.add('noDisplay');

    referenceSequence.figures = {};
    for (let i = 0; i < figures.length; i++) {
        if (figures[i].aresti && figures[i].unknownFigureLetter) {
            referenceSequence.figures[figures[i].unknownFigureLetter] = figures[i];
        }
    }

    var remaining = figureLetters;
    for (let i = 0; i < figureLetters.length; i++) {
        if (referenceSequence.figures[figureLetters[i]]) {
            remaining = remaining.replace(figureLetters[i], '');
        }
    }
    $('referenceSequenceAlerts').innerHTML = remaining ?
        sprintf(userText.unusedFigureLetters, remaining.split('').join(' ')) : '';

    // send relevant parts of referenceSequence to rulesWorker
    var refSeqCheck = { figures: {} };
    for (let key in referenceSequence.figures) {
        refSeqCheck.figures[key] = {
            checkLine: referenceSequence.figures[key].checkLine,
            entryDir: referenceSequence.figures[key].entryDir,
            entryAtt: referenceSequence.figures[key].entryAtt,
            exitDir: referenceSequence.figures[key].exitDir,
            exitAtt: referenceSequence.figures[key].exitAtt
        }
    }
    rulesWorker.postMessage({
        action: 'referenceSequence',
        referenceSequence: refSeqCheck
    });

    // restore sequence
    alertMsgs = [];
    alertMsgRules = {};
    activeSequence.figures = [];
    activeSequence.text = sequenceText.innerText = savedText;

    checkSequenceChanged(true);
}

// checkInfo checks if the required Sequence info is present and
// highlights any empty info fields with red borders (checkInfo class)
function checkInfo() {
    // first clear all red borders
    var el = document.getElementsByClassName('checkInfo');
    for (let i = el.length - 1; i >= 0; i--) {
        el[i].removeAttribute('required');
        el[i].classList.remove('checkInfo');
    }
    // when no rules are active, revert to default: pilot, actype, acreg
    if (!activeRules) infoCheck = ['pilot', 'actype', 'acreg'];
    // add red borders to missing info
    for (let i = 0; i < infoCheck.length; i++) {
        el = $(infoCheck[i]);
        if (el) {
            el.setAttribute('required', true);
            if (el.value == '') el.classList.add('checkInfo');
        }
    }
}

// missingInfoCheck checks for missing Sequence Info.
// When no missing info is detected, function f is executed.
// Otherwise, a warning is presented and f executed only after confirm
function missingInfoCheck(f) {
    var el = document.getElementsByClassName('checkInfo');

    if (el.length === 0) {
        f();
    } else {
        var warning = userText.missingInfo + '</br>';
        for (let i = 0; i < el.length; i++) {
            warning += `</br>\n${userText[el[i].id].replace(/&amp;/g, '&')}`;
        }
        confirmBox(warning, userText.missingInfoTitle, f);
    }
}

// updateFigureSelectorOptions updates the figure chooser options
function updateFigureSelectorOptions(selectedOption) {
    const container = $('figureSelectorOptionsDiv');
    if (container) {
        removeChildNodes(container);

        // only make a selector when there is at least one figure in the seq
        // and we are not in Free (Un)known designer
        if ((figures.findIndex(f => 'aresti' in f) >= 0) && (activeForm != 'FU')) {
            // Options are different when a figure is selected
            if (selectedFigure.id !== null) {
                var options = [
                    'figSelectorAddBefore',
                    'figSelectorReplace',
                    'figSelectorAddAfter'
                ];
                // set default option to add after
                if (!selectedOption) selectedOption = 'figSelectorAddAfter';
            } else {
                var options = [
                    'figSelectorAddStart',
                    'figSelectorAddEnd'
                ];
                // set default option to add at end
                if (!selectedOption) selectedOption = 'figSelectorAddEnd';
            }

            var div = document.createElement('div');
            div.id = 'figureSelectorOptions';
            options.forEach ((o, i) => {
                var button = document.createElement('div');
                button.classList.add ('figureSelectorOptionsButton');
                button.id = o;
                if (o == selectedOption) {
                    button.classList.add('selected');
                }
                let text = document.createElement('div');
                text.appendChild(document.createTextNode(userText[options[i]]));
                button.appendChild(text);
                // On smallMobile, add an image of the active figure
                // as a reminder
                if (button.id == 'figSelectorReplace' && platform.smallMobile) {
                    button.appendChild($('selectedFigureSvg').cloneNode(true));
                    button.lastChild.setAttribute('id', 'selectedFigureSvgInChooser');
                    button.lastChild.setAttribute('width', '50');
                    button.lastChild.setAttribute('height', '30');
                }
                button.addEventListener('mousedown', function() {
                    this.parentNode.getElementsByClassName('selected')[0].classList.remove('selected');
                    this.classList.add ('selected');
                    markFigures();
                });
                div.appendChild(button);
            });
            container.appendChild(div);
        } else {
            // otherwise, clear container
            container.innerHTML = '';
        }
        markFigures();
    }
}

// changeFigureString is executed when the figureString in the Figure
// Selector is changed
function changeFigureString(e) {
    var string = this.value.replace(/ /g, '');

    if (e.inputType === 'insertText') {
        if (e.data === ' ') return false;
    } else this.value = string;

    string = string || (additionalFig.max ? 'L' : 'X');
    updateSequence(selectedFigure.id, string, true, true);
    this.focus();
}

// changeHideFigs is executed when the hideIllegal or hideRarelyUsed
// checkbox is toggled
function changeHideFigs() {
    availableFigureGroups();
    changeFigureGroup();
    saveSettingsStorage();
}

// Function to check if the figure is in rarelyUsed
function checkRarelyUsed (fig) {
    if ($('hideRarelyUsed').checked == true) {
        for (let regex of rarelyUsed) {
            if (regex.test(fig.aresti)) return true;
        }
    }
    return false;
}

// availableFigureGroups selects the available figure groups. May be
// limited by active rules.
function availableFigureGroups() {
    const
        options = $('figureGroupClone').childNodes,
        firstGroup = (activeForm === 'FU') ? 0 : 1,
        value = $('figureGroup').value;

    // Clear figureGroup <select>
    removeChildNodes($('figureGroup'));

    // hide all options, except rolls and spins
    for (let i = firstGroup; i < options.length; i++) {
        if (figGroup[i].family != 9) {
            options[i].classList.add('noDisplay');
            options[i].disabled = 'disabled';
        }
    }
    if ($('hideRarelyUsed').checked == true || (
        (Object.keys(checkAllowCatId).length > 0) &&
        activeRules &&
        ($('hideIllegal').checked == true) &&
        (activeForm !== 'FU'))) {
        // show all options that are applicable
        fig.forEach (f => {
            if (Object.keys(checkAllowCatId).length === 0 || f.aresti in checkAllowCatId ||
            (activeRules && ($('hideIllegal').checked == false))) {
                if (!checkRarelyUsed(f)) {
                    options[f.group].classList.remove('noDisplay');
                    options[f.group].disabled = false;
                }
            }
        });
    } else if (activeForm !== 'FU') {
        // show all options
        for (let i = 1; i < options.length; i++) {
            options[i].classList.remove('noDisplay');
            options[i].disabled = false;
        }
    } else {
        // show all options, except the last one (non-Aresti)
        for (let i = 1; i < (options.length - 1); i++) {
            options[i].classList.remove('noDisplay');
            options[i].disabled = false;
        }
    }

    // Copy all visible nodes from the clone to the original.
    // We need this step because Safari still shows options with
    // 'display: none' in <select> lists
    options.forEach (o => {
        if (!o.disabled) $('figureGroup').appendChild(o.cloneNode(true));
    });
    $('figureGroup').value = value;
}

// changeFigureGroup updates the figure group in the figure chooser
function changeFigureGroup() {
    let
        e = $('figureGroup'),
        arestiDraw = [],
        arestiRow = 0,
        figureGroup = e.value,
        table = $('figureChooserTable'),
        svg = $('figureChooserSvg'),
        colCount = 0,
        fragment = document.createDocumentFragment();

    // If the requested figureGroup does not exist, set to singleLines by default
    if (!figGroup[figureGroup]) figureGroup = e.value = 1;
    
    // set the correct size and row count for the figure thumbnails
    if (figGroup[figureGroup].family == 9) { // rolls and spins group
        $('figureChooserColumns').classList.add('noDisplay');
        table.innerHTML = `<span class="userText" id="t_rollsSpinsExplain">${userText['rollsSpinsExplain']}</span>`;
        return;
    } else if (figureGroup != 0) { // normal Aresti group
        var
            size = 56,
            newRow = /\.[01]$/,
            maxColCount = 4;
        $('figureChooserColumns').classList.remove('noDisplay');
    } else { // queue group
        var
            maxColCount = $('queueColumns').value,
            size = parseInt((280 / maxColCount) - 8),
            newRow = /never/;
        $('figureChooserColumns').classList.add('noDisplay');
    }

    firstFigure = false;

    removeChildNodes(table);
    for (let i = 0; i < fig.length; i++) {
        if (fig[i]) {
            // Only draw figures that are in this group AND have not been
            // drawn before (e.g. 1j and j)
            if ((fig[i].group == figureGroup) && !inArray(arestiDraw, (fig[i].aresti + fig[i].draw))) {
                if (!fig[i].svg) {
                    // The figure has not been drawn in this session, go ahead and
                    // draw it. First we take the original base and remove + and
                    // replace full/any roll/spin symbols by '1'
                    var figure = fig[i].pattern.replace(/[\+]/g, '')
                        .replace(regexFullAnySpinRoll, '1');
                    // next we replace half roll symbols by actual half rolls
                    figure = figure.replace(regexHalfRoll, '2');
                    figures[-1] = [];

                    Attitude = Direction = (figure[0] != '-') ? 0 : 180;

                    // build the figure
                    // fig[i].string is only set for Queue figures
                    if (fig[i].string) {
                        buildFigure([i], fig[i].string, false, -1);
                    } else {
                        buildFigure([i], figure, false, -1, true);
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
                    var
                        group = svg.getElementById('figure-1'),
                        bBox = group.getBBox(),
                        xMargin = bBox.width / 20,
                        yMargin = bBox.height / 20;
                    group.setAttribute('transform',
                        `translate(${roundTwo((xMargin - bBox.x))} ${roundTwo((yMargin - bBox.y))})`
                    );
                    svg.setAttribute('viewBox',
                        `0 0 ${roundTwo(bBox.width + xMargin * 2)} ${roundTwo(bBox.height + yMargin * 2)}`
                    );
                    svg.setAttribute('width', size);
                    svg.setAttribute('height', size);
                    svg.setAttribute('id', `figureChooser${i}`);
                    // add the svg to fig[i] as xml text
                    fig[i].svg = new XMLSerializer().serializeToString(svg);
                    svg.setAttribute('id', 'figureChooserSvg');
                    // add the roll Aresti nrs to fig if applicable
                    fig[i].rollBase = [];
                    for (let j = 1; j < figures[-1].aresti.length; j++) {
                        fig[i].rollBase[j - 1] = rollArestiToFig[figures[-1].aresti[j]][0];
                    }
                }
                if ((fig[i].aresti.match(newRow) && (fig[i].group != 0)) || (colCount == 0)) {
                    colCount = 0;
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    tr.appendChild(td);
                    td.classList.add('arestiRow');
                    // add Aresti row number if not in queue or non-Aresti figures
                    if ((fig[i].group != 0) && !/^0/.test(fig[i].aresti)) {
                        // Add additional empty row when going to a lower arestiRow.
                        // This happens, for example, for the various double bump
                        // drawing styles
                        if (arestiRow > parseInt(fig[i].aresti.match(/^\d+\.\d+\.(\d+)/)[1])) {
                            tr.classList.add ('newDrawingGroup');
                        }
                        arestiRow = parseInt(fig[i].aresti.match(/^\d+\.\d+\.(\d+)/)[1]);
                        td.innerHTML = arestiRow;
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
                td.addEventListener('mousedown', function () { selectFigure(this) });
                var rollK = 0;
                if (!fig[i].rollBase) fig[i].rollBase = [];
                if (sportingClass.value === 'glider') {
                    var k = fig[i].kGlider;
                    for (let j = 0; j < fig[i].rollBase.length; j++) {
                        // Set rollK to -1 when this roll has 0K -> illegal
                        // Can only happen for queue figures
                        if ((rollFig[fig[i].rollBase[j]].kGlider === 0) &&
                            (figureGroup == 0)) {
                            rollK = -1;
                            break;
                        }
                        // only count half rolls and rolls in queue figures
                        if (fig[i].string || (/2$/.test(fig[i].rollBase[j]))) {
                            rollK += rollFig[fig[i].rollBase[j]].kRules ?
                                rollFig[fig[i].rollBase[j]].kRules :
                                rollFig[fig[i].rollBase[j]].kGlider;
                        }
                    }
                } else {
                    var k = fig[i].kPwrd;
                    for (let j = 0; j < fig[i].rollBase.length; j++) {
                        // Set rollK to -1 when this roll has 0K -> illegal
                        // Can only happen for queue figures
                        if ((rollFig[fig[i].rollBase[j]].kPwrd === 0) &&
                            (figureGroup == 0)) {
                            rollK = -1;
                            break;
                        }
                        // only count half rolls and rolls in queue figures
                        if (fig[i].string || (/2$/.test(fig[i].rollBase[j]))) {
                            rollK += rollFig[fig[i].rollBase[j]].kRules ?
                                rollFig[fig[i].rollBase[j]].kRules :
                                rollFig[fig[i].rollBase[j]].kPwrd;
                        }
                    }
                }
                if (fig[i].kRules) k = fig[i].kRules;
                if (rollK > 0) {
                    k += `(+${rollK})`;
                } else if (rollK < 0) {
                    k += '<font color="red">(N/A)</font>';
                }
                fig[i].rollK = rollK;

                inner.innerHTML += `K:${k}`;

                // extra for figures in queueGroup
                if (fig[i].group == 0) {
                    // add class queue
                    td.classList.add('queue');
                    // add a 'remove' button
                    var div = document.createElement('div');
                    div.classList.add('removeFigureButton');
                    div.id = `removeFromQueue${i}`;
                    div.innerHTML = '<i class="material-icons">close</i>';
                    // make sure we remove on touch devices by using touchstart
                    // which fires before mousedown
                    if (platform.touch) {
                        div.addEventListener('touchstart', removeFromQueue);
                    }
                    div.addEventListener('mousedown', removeFromQueue);
                    inner.appendChild(div);
                    // add the unknownFigureLetter where defined
                    if (fig[i].unknownFigureLetter) {
                        var div = document.createElement('div');
                        div.classList.add('UFletterInQueue');
                        div.innerHTML = fig[i].unknownFigureLetter;
                        inner.appendChild(div);
                    }
                }

                tr.appendChild(td);

                // add this figure's Aresti number and pattern to arestiDraw
                // so it is not drawn twice
                arestiDraw.push(fig[i].aresti + fig[i].draw);
            }
        }
    }
    // When any figure was drawn, redraw sequence
    if (-1 in figures) {
        // Clear alert messages created by building figures
        alertMsgs = [];
        alertMsgRules = {};
        // Delete this figure
        delete figures[-1];
    }

    table.appendChild(fragment);

    markFigures();
}

// markFigures applies marking to figure chooser elements
function markFigures() {
    markUsedFigures();
    markMatchingFigures();
    markNotAllowedFigures(); // Includes marking of rarelyUsed
}

// markUsedFigures marks figures that are already in the sequence
function markUsedFigures() {
    var
        table = $('figureChooserTable'),
        tr = table.childNodes;

    for (let i = 0; i < tr.length; i++) {
        var td = tr[i].childNodes;
        for (let j = 1; j < td.length; j++) {
            td[j].classList.remove('queueUsed');
            td[j].classList.remove('queueUsedMulti');
            // add class queueUsed if the figure is already present in
            // the sequence
            for (let k = 0; k < figures.length; k++) {
                if (!figures[k]) break;
                if (figures[k].aresti && fig[td[j].id].aresti) {
                    if ((`queue-${figures[k].aresti.join('-')}`) === fig[td[j].id].aresti) {
                        if (td[j].classList.contains('queueUsed')) {
                            td[j].classList.remove('queueUsed');
                            td[j].classList.add('queueUsedMulti');
                            break;
                        } else {
                            td[j].classList.add('queueUsed');
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
function markMatchingFigures() {
    let sel = false;
    // for the Free (Un)known designer, the selector is hidden. We always do
    // replace in that case
    if (activeForm === 'FU') {
        sel = 'figSelectorReplace';
    } else {
        let el = $('figureSelectorOptions');
        if (el && el.getElementsByClassName('selected')[0]) sel = el.getElementsByClassName('selected')[0].id;
    }
    var previousPattern = false;
    var nextPattern = false;
    if (sel) {
        switch (sel) {
            case 'figSelectorAddStart':
                for (let i = 0; i < figures.length; i++) {
                    if (figures[i].aresti) {
                        nextPattern = fig[figures[i].figNr].pattern;
                        break;
                    } else if (figures[i].subSequence) break;
                }
                break;
            case 'figSelectorAddBefore':
                for (let i = 0; i < figures.length; i++) {
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
                for (let i = 0; i < figures.length; i++) {
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
                for (let i = 0; i < figures.length; i++) {
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
                for (let i = figures.length - 1; i >= 0; i--) {
                    if (figures[i].aresti) {
                        previousPattern = fig[figures[i].figNr].pattern;
                        break;
                    } else if (figures[i].subSequence) break;
                }
        }
    }
    var regexString = previousPattern ? `^[\\${previousPattern.slice(-1)}].*` : '';
    if (nextPattern) regexString += `[\\${nextPattern[0]}]\$`;
    var regex = new RegExp(regexString);
    var table = $('figureChooserTable');
    var tr = table.childNodes;
    for (let i = 0; i < tr.length; i++) {
        var td = tr[i].childNodes;
        // start with 2nd <td>, as first holds Aresti row nr
        for (let j = 1; j < td.length; j++) {
            if (/^G/.test(activeForm)) {
                td[j].classList.add('grid');
            } else {
                td[j].classList.remove('grid');
            }
            if (fig[td[j].id].pattern.match(regex)) {
                td[j].classList.add('matchingFigure');
            } else {
                td[j].classList.remove('matchingFigure');
            }
        }
    }
}

// markNotAllowedFigures updates figure chooser elements to show if they
// are not allowed for the specified rules, or if they are disabled
// through "Hide rarely used figures"
function markNotAllowedFigures() {

    let showRow;

    function legalFigure(td) {
        td.classList.remove('figureNotAllowed');
        if (!$('hideRarelyUsed').checked || !checkRarelyUsed(fig[td.id])) {
            td.classList.remove('hidden');
            showRow = true;
        }
    }

    function illegalFigure(td) {
        if (($('hideIllegal').checked == true) &&
            ($('figureGroup').value != 0)) {
            td.classList.add('hidden');
            td.classList.remove('matchingFigure');
        } else {
            if (!$('hideRarelyUsed').checked || !checkRarelyUsed(fig[td.id])) {
                td.classList.add('figureNotAllowed');
                showRow = true;
            }
        }
    }

    $('figureChooserTable').childNodes.forEach (tr => {
        let td = tr.childNodes;
        
        showRow = false;

        for (let j = 1; j < td.length; j++) {
            if ((sportingClass.value === 'powered') && (fig[td[j].id].kPwrd == 0)) {
                illegalFigure(td[j]);
            } else if ((sportingClass.value === 'glider') && (fig[td[j].id].kGlider == 0)) {
                illegalFigure(td[j]);
            } else if (activeRules) {
                if (Object.keys(checkAllowCatId).length > 0) {
                    var aresti = fig[td[j].id].aresti;
                    if (!fig[td[j].id].kRules) {
                        var totalK = parseInt((sportingClass.value === 'powered') ?
                            fig[td[j].id].kPwrd : fig[td[j].id].kGlider);
                    } else var totalK = parseInt(fig[td[j].id].kRules);
                    totalK += parseInt(fig[td[j].id].rollK);

                    if (aresti.match(/^queue-/)) {
                        aresti = aresti.match(/^queue-([0-9\.]+)/)[1];
                    }

                    if (!(aresti in checkAllowCatId) || (checkCatGroup.k &&
                        checkCatGroup.k.maxperfig && (checkCatGroup.k.maxperfig < totalK))) {
                        illegalFigure(td[j]);
                    } else {
                        legalFigure(td[j]);
                    }
                } else {
                    legalFigure(td[j]);
                }
            } else {
                legalFigure(td[j]);
            }
        }
        // hide row when no legal figures present
        if (($('hideIllegal').checked == true || $('hideRarelyUsed').checked == true) &&
            ($('figureGroup').value != 0) &&
            (figGroup[$('figureGroup').value].family != 9) &&
            !showRow) {
            tr.classList.add('noDisplay');
        }
    });
}

// selectFigure is executed when clicking a figure in the figureChooser
// (e = object) or from grabFigure (e = figNr) or from certain functions
// or false
function selectFigure(e) {
    
    // disable when sequence locked
    if ($('lock_sequence').value) return;

    if (e === null) e = false;

    // show figure editor tab
    if ((e !== false) && !platform.smallMobile) selectTab('tab-figureInfo');

    var queueFigure = false;
    var fromChooser = (typeof e === 'object');
    if (fromChooser) {
        let options = $('figureSelectorOptions') ?
            $('figureSelectorOptions').getElementsByClassName('selected')[0].id : false;
        // check if this was triggered by removing a figure. If so, do nothing
        if (!fig[e.id]) return;
        // use the string if provided (for Queue figures)
        if (fig[e.id].string) {
            figure = fig[e.id].string;
            queueFigure = e.id;
        } else {
            // when doing a replace, check if this is a similar figure
            if (options) {
                if (options == 'figSelectorReplace') {
                    // getRolls creates a string that represents the rolls and
                    // their attitude in the figure
                    function getRolls(id) {
                        var
                            rolls = fig[id].pattern.replace(regexRolls, ''),
                            att = 0,
                            out = '',
                            n = 0,
                            d = fig[id].draw;
                        for (let i = 0; i < d.length; i++) {
                            if (drawAngles[d[i]]) {
                                att += drawAngles[d[i]];
                            } else if (d[i].match(/[hHtTuU]/)) {
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
                if (!/\([^)]+\)/.test(figure)) {
                    figure = figure.replace(/\(\)/g, '');
                }
            }
        }
        // See if a figure was grabbed already. If so, replace it
        if (options) {
            switch (options) {
                case 'figSelectorAddStart':
                    // find the first 'figure', except sequence options
                    // and add before that one
                    for (let i = 0; i < figures.length; i++) {
                        if (!figures[i].string.match(regexSequenceOptions)) {
                            updateSequence(i - 1, figure, false, true);
                            setFigureSelected(i);
                            break;
                        }
                    }
                    break;
                case 'figSelectorAddBefore':
                    for (var i = selectedFigure.id - 1; i >= 0; i--) {
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
            updateSequence(selectedFigure.id, figure, true);
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
        e = SVGRoot.getElementById(`figure${e}`);
    }
    var elFT = $('t_addFigureText');
    if (e != false && selectedFigure.id !== null) {
        // => a figure is selected
        // hide the figure selector for smallMobile browsers, but highlight the
        // chosen figure in case the figure selector is shown again
        if (platform.smallMobile) hideFigureSelector();
        var table = $('figureChooserTable');
        var selected = table.getElementsByClassName('selected');
        // remove selected class for all
        for (let i = 0; i < selected.length; i++) {
            selected[i].classList.remove('selected');
        }
        // add selected class to figure
        if (e && e.parentNode.classList) {
            e.parentNode.classList.add('selected');
        }
        elFT.parentNode.parentNode.classList.add('hoverdisplay');
        elFT.innerHTML = userText.clickChangeFigure;

        // with figure loaded from chooser, remove any unknown figure letters
        // and add queue unknown figure letter if applicable. Don't do this
        // in Free (Un)known designer
        if (fromChooser && (activeForm !== 'FU')) {
            var uf = queueFigure ? fig[queueFigure].unknownFigureLetter : false;

            for (let i = selectedFigure.id - 1; i >= 0; i--) {
                if (figures[i].aresti) {
                    break;
                } else if (figures[i].unknownFigureLetter) {
                    updateSequence(i, '', true);
                }
            }
            // set unknown figure letter if applicable
            if (uf) updateSequence(i, `"@${uf}"`, false, true);
        }

        // update all figure options
        updateFigureEditor();

        // set the figure chooser, except when queue is set and not empty
        if (($('figureGroup').selectedIndex !== 0) ||
            ($('figureChooserTable').childNodes.length === 0)) {
            if (queueFigure) {
                setFigChooser(queueFigure);
            } else {
                setFigChooser(figures[selectedFigure.id].figNr);
            }
        } else updateFigureSelectorOptions();

        // Highlight the figure in the sequence text when we were not editing
        // the comments and not in FU designer
        if ((activeForm !== 'FU') && (document.activeElement.id !== 'comments')) {
            var start = figures[selectedFigure.id].stringStart;
            for (let i = selectedFigure.id - 1; i >= 0; i--) {
                if (figures[i].aresti) {
                    break;
                } else {
                    start = figures[i].stringStart;
                }
            }
            highlight(sequenceText, start, figures[selectedFigure.id].stringEnd);
        }
    } else {
        // e===false => select no figure
        // remove highlight
        if (activeForm !== 'FU') highlight(sequenceText);
        // set selected figure to null
        setFigureSelected(null);
        if ($('figureInfo')) {
            // set figure editor
            updateFigureEditor();
            // update figure selector options
            updateFigureSelectorOptions();
            // correctly set the figure change/edit block
            $('selectedFigureSvg').innerHTML = "";
            elFT.parentNode.parentNode.classList.remove('hoverdisplay');
            elFT.innerHTML = userText.clickAddFigure;
            $('figureHeader').innerHTML = '';
        }
        if (activeForm === 'FU') selectTab('tab-fuFigures');
    }
    setQueueMenuOptions();
}

// selectFigureFu is called when selecting a figure in Free (Un)known
// designer
function selectFigureFu(id) {
    selectTab('tab-figureInfo');

    // deselect any previously selected
    var els = document.getElementsByClassName(`fuFig${selectedFigure.id}`);
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('active');
    }

    $('t_addFigureText').parentNode.parentNode.classList.add('hoverdisplay');
    $('t_addFigureText').innerHTML = userText.clickChangeFigure;

    setFigureSelected(id);

    // update all figure options
    updateFigureEditor();

    // set figure chooser for new additionaL and eXtra figures, or hide for others
    if (((figures[id].unknownFigureLetter === 'L') && (figures[id].string === 'L')) ||
        (figures[id].string === 'X')) {
        updateFigureSelectorOptions();
        markMatchingFigures();
        showFigureSelector();
    } else {
        hideFigureSelector();
    }
}

/*******************************************
 * Functions for creating complete sequences
 ******************************************/

// checkFloatingPoint checks if a floating point correction should be
// made and adds this to the figures object where applicable
function checkFloatingPoint() {
    var figureK = 0;
    // in case of floating-point, check total K first to determine
    // how much to take off and where. Disregard additionals.
    if (checkCatGroup.floatingPoint) {
        var figK = [];
        for (let i = 0; i < figures.length; i++) {
            if (figures[i].aresti && !figures[i].additional) {
                // build array figK[i] = XXYY, where XX = K and YY = 99 - i
                // this will enable sorting while keeping K and i relation
                figK[i] = 99 - i;
                for (let j = 0; j < figures[i].k.length; j++) {
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
        figK.sort(function (a, b) { return a - b });
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

// makeMiniFormAScreen creates a mini form A for the screen interface
function makeMiniFormAScreen() {
    let
        columns = ['Fig', 'K', '&Sigma;'],
        totalK = 0,
        modifiedK = [],
        tr = document.createElement('tr');

    // Clear miniFormA
    removeChildNodes($('miniFormAHeader'));
    removeChildNodes($('miniFormA'));
    // Check if any figure has a figure letter. If so, add column @
    figures.forEach(fig => {
        if (fig.unknownFigureLetter) columns = ['Fig', '@', 'K', '&Sigma;'];
    });   
    // Remove K column for smallMobile
    if (platform.smallMobile) columns.splice(-2, 1);
    // Add column headers
    columns.forEach(col => {
        let td = document.createElement('td');
        td.innerHTML = (platform.smallMobile && col == '&Sigma;') ? 'K' : col;
        tr.appendChild(td);
    });
    $('miniFormAHeader').appendChild(tr);
    // Go through the figures
    figures.forEach ((fig, i) => {
        if (fig.aresti) {
            let tr = document.createElement('tr');            
            tr.id = `miniFormA-figure${i}`;
            tr.classList.add('dnd-sortable-item', 'dnd-sortable-handle');
            columns.forEach(col => {
                let td = document.createElement('td');
                switch (col) {
                    case 'Fig':
                        td.innerText = fig.seqNr;
                        break;
                    case '@':
                        td.innerText = fig.unknownFigureLetter ?
                            fig.unknownFigureLetter.replace('L', 'Add') : '';
                        break;
                    case 'K':
                        // join with +, and a zero-width space after every 3rd
                        td.innerHTML = fig.k.join('+')
                            .replace(/((?:[^+]*\+){2}[^+]*)\+/g, '$1+\u200b');
                        break;
                    case '&Sigma;':
                        var figK = 0;
                        // Check for additionals
                        if (fig.unknownFigureLetter == 'L') {
                            if (additionals <= additionalFig.max) {
                                figK = additionalFig.totalK / additionals;
                            } else {
                                if (additionalFig.max > 0) {
                                    figK = additionalFig.totalK / additionalFig.max;
                                }
                                checkAlert(sprintf(userText.maxAdditionals, additionalFig.max),
                                    false,
                                    fig.seqNr);
                            }
                        } else figK = fig.k.reduce((a,b) => a + b);
                        // Check for floating point
                        if (fig.floatingPoint) {
                            td.innerText = `${figK - 1} (${figK})`;
                            figK -= 1;
                        } else td.innerText = figK;
                        totalK += figK;
                        // Check if K was modified
                        fig.aresti.forEach(a => {
                            if (a in rulesKFigures) modifiedK.push(fig.seqNr);
                        });
                }
                tr.appendChild(td);
            });
            $('miniFormA').appendChild(tr);

            // Allow the row to be dragged when there is more than 1 figure
            // if (figureList.length > 1) tr.setAttribute('draggable', true);
        }
    });

    // Now that the form is complete, we add functions for drag & drop
    // repositioning of figures
    let draggedRow, startY;
    
    // Function to handle touch start or mousedown
    function dragStart(event) {
        if (event.type === 'touchstart') {
            startY = event.targetTouches[0].clientY;
        } else {
            startY = event.clientY;
        }

        draggedRow = event.target.closest('tr');
        draggedRow.style = '';
        draggedRow.style.zIndex = 10;

        let match = draggedRow.id.match(/^miniFormA-figure(\d+)$/);
        if (match) {
            selectFigure(match[1]);
            centerFigure(match[1]);
        }
    }
    
    // Function to handle touch move or mousemove
    function dragMove(event) {
        event.preventDefault();
        if (!draggedRow) return;

        const
            previousRow = draggedRow.previousSibling,
            nextRow = draggedRow.nextSibling,
            zoom = parseInt($('zoom').textContent.match(/\d+/)[0]) / 100;

        function deltaY() {
            let dy;
            if (event.type === 'touchmove') {
                dy = (event.targetTouches[0].clientY - startY) / zoom;
            } else {
                dy = (event.clientY - startY) / zoom;
            }
            // Limit dy to top and bottom of miniFormA
            return (
                Math.min (
                    Math.max(dy, previousRow ? -Infinity : 0),
                    nextRow ? Infinity : 0
                )
            );
        }
    
        draggedRow.style.transform = `translateY(${deltaY()}px)`;

        // Check if the row is dragged up
        if (previousRow && draggedRow.offsetTop + deltaY() <= previousRow.offsetTop + draggedRow.offsetHeight * 0.4) {
            const offsetTop = previousRow.offsetTop;
            startY -= previousRow.offsetHeight * zoom;
            draggedRow.style.transform = `translateY(${deltaY()}px)`;
            $('miniFormA').insertBefore(draggedRow, previousRow);
            // Place previousRow at original position
            previousRow.style.transition = '';
            previousRow.style.transform = `translateY(${offsetTop - previousRow.offsetTop}px)`;
            // Now slowly place it at its new position
            setTimeout(() => {
                previousRow.style.transition = 'transform 0.5s';
                previousRow.style.transform = 'translateY(0)';
            }, 10);
            // Check if the row is dragged down
        } else if (nextRow && draggedRow.offsetTop + deltaY() >= nextRow.offsetTop - draggedRow.offsetHeight * 0.4) {
            const offsetTop = nextRow.offsetTop;
            startY += nextRow.offsetHeight * zoom;
            draggedRow.style.transform = `translateY(${deltaY()}px)`;
            $('miniFormA').insertBefore(nextRow, draggedRow);
            // Place nextRow at original position
            nextRow.style.transition = '';
            nextRow.style.transform = `translateY(${offsetTop - nextRow.offsetTop}px)`;
            // Now slowly place it at its new position
            setTimeout(() => {
                nextRow.style.transition = 'transform 0.5s';
                nextRow.style.transform = 'translateY(0)';
            }, 10);
        }

        // Show the placeFigure marker, but only when we are moving the figure
        // to a new position
        if ([...$('miniFormA').children].indexOf(draggedRow) == draggedRow.firstChild.innerText - 1) {
            $('placeFigure').classList.add('noDisplay');
        } else {
            $('placeFigure').classList.remove('noDisplay');
            if (!draggedRow.previousSibling) {
                // Drop location before first figure
                var id = draggedRow.nextSibling.id.match(/^miniFormA-figure(\d+)$/)[1];
                centerFigure(id);
                $('placeFigure').style.left = $('figure'+id).firstChild.getBoundingClientRect().left + 'px';
                $('placeFigure').style.top = $('figure'+id).firstChild.getBoundingClientRect().top + 'px';
            } else {
                // Drop location after figure
                var id = draggedRow.previousSibling.id.match(/^miniFormA-figure(\d+)$/)[1];
                centerFigure(id);
                $('placeFigure').style.left = $('figure'+id).lastChild.getBoundingClientRect().left + 'px';
                $('placeFigure').style.top = $('figure'+id).lastChild.getBoundingClientRect().top + 'px';
            }            
        }
    }
    
    // Function to handle touch end or mouseup
    function dragEnd() {
        draggedRow.style = '';
        startY = null;

        $('placeFigure').classList.add('noDisplay');

        // If we dropped in the original position, we're done
        if ([...$('miniFormA').children].indexOf(draggedRow) == draggedRow.firstChild.innerText - 1) {
            draggedRow = null;
            return;
        }

        // Otherwise, reposition the figure
        let
            newSeqNr,
            id = selectedFigure.id,
            // Set dropAfter id. Set to false if dropping at beginning
            dropAfter = draggedRow.previousSibling ?
                parseInt(draggedRow.previousSibling.id.match(/^miniFormA-figure(\d+)$/)[1]) : false,
            // Find the first 'figure' after the preceding real figure. This could include
            // move 'figures', figure letters etc
            selFigStart = figures[
                figures.findIndex(fig => fig.seqNr == figures[id].seqNr - 1) + 1
            ].stringStart,
            figString = activeSequence.text.slice(selFigStart, figures[id].stringEnd);

        draggedRow = null; // reset draggedRow for next drag

        if (dropAfter === false) {
            // Drop at the beginning
            newSeqNr = 1;
            updateSequenceText(
                `${activeSequence.text.slice(0, selFigStart)} ${activeSequence.text.slice(figures[id].stringEnd)}`
            );
            checkSequenceChanged();
            // Drop after entry option, when present
            updateSequence(/^e(u|d|j|ja) /.test(activeSequence.text) ? 0 : -1, figString);
        } else {
            if (dropAfter < id) {
                // Drop before original position
                newSeqNr = figures[dropAfter].seqNr + 1;
                updateSequenceText(
                    activeSequence.text.slice(0, figures[dropAfter].stringEnd) + ' ' +
                    figString + activeSequence.text.slice(figures[dropAfter].stringEnd, selFigStart) +
                    activeSequence.text.slice(figures[id].stringEnd)
                );
            } else {
                // Drop after original position
                newSeqNr = figures[dropAfter].seqNr;
                updateSequenceText(
                    activeSequence.text.slice(0, selFigStart) +
                    activeSequence.text.slice(figures[id].stringEnd, figures[dropAfter].stringEnd) +
                    ' ' + figString + activeSequence.text.slice(figures[dropAfter].stringEnd)
                );
            }
            checkSequenceChanged();
            // Update non-existing figure to clean up sequence string
            updateSequence(figures.length);
        }
        selectFigure(
            figures.findIndex(fig => fig.seqNr == newSeqNr)
        );
    }
    
    // Add event listeners for touch and mouse events
    $('miniFormA').querySelectorAll('tr').forEach(row => {
      row.addEventListener('touchstart', dragStart);
      row.addEventListener('touchmove', dragMove);
      row.addEventListener('touchend', dragEnd);
    
      row.addEventListener('mousedown', dragStart);
      row.addEventListener('mousemove', dragMove);
      row.addEventListener('mouseup', dragEnd);
    });
    
    // Create total K footer
    $('miniFormAFooter').innerHTML = platform.smallMobile ?
        `<tr>
            <td colspan=${columns.length}>
                Total K
                <br />
                ${totalK}
            </td>
        </tr>`
        :
        `<tr>
            <td colspan=${columns.length - 1}>
                Total K
            </td>
            <td>
                ${totalK}
            </td>
        </tr>`;
    // Show maximum K when applicable, corrected for floatingPoint
    if (activeRules && checkCatGroup.k && checkCatGroup.k.max) {
    $('miniFormAFooter').innerHTML += platform.smallMobile ?
        `<tr>
            <td colspan=${columns.length}>
                Max K
                <br />
                ${checkCatGroup.k.max - (checkCatGroup.floatingPoint || 0)}
            </td>
        </tr>`
        :
        `<tr>
            <td colspan=${columns.length - 1}>
                Max K
            </td>
            <td>
                ${checkCatGroup.k.max - (checkCatGroup.floatingPoint || 0)}
            </td>
        </tr>`;
    }
    // Set fixed width of modifiedK (required by Windows app, no CSS solution found)
    if (platform.uwp) $('modifiedK').style.width = `${$('miniFormAHeader').getBoundingClientRect().width}px`;
    // Add text when K has been modified by rules
    $('modifiedK').innerHTML = modifiedK.length ?
        changedFigureKText(modifiedK, activeRules.description) : '';
}

// adjustMiniFormAPosition adjusts the  position of mini form A and wind arrow, when
// in Form B or C, not on smallMobile and the figureSelector is active
function adjustMiniFormAPosition() {
    $('miniFormAContainer').style.transform = $('t_windArrow').style.transform = '';
    if (/[BC]/.test(activeForm) && !platform.smallMobile && $('figureSelector').classList.contains('active')) {
        const translateX = `translateX(${- Math.min(
            $('sequenceArea').clientWidth-$('sequenceSvg').getAttribute('width')-$('miniFormAContainer').offsetWidth - 36,
            $('figureSelector').offsetWidth - 12
        )}px)`;
        $('miniFormAContainer').style.transform = translateX;
        // Only adjust wind arrow on Form B
        if (activeForm == 'B') $('t_windArrow').style.transform = translateX;
    }
}

// makeMiniFormA creates a mini form A for printing and saving
// It starts at (x, y) and returns width and height of the block
function makeMiniFormA(x, y, tiny) {
    var
        blockX = x,
        blockY = y,
        figNr = 0,
        figureK = 0,
        modifiedK = [],
        widths = tiny ? [28, 0, 0, 35] : [30, 60, 26, 25],
        totalWidth = widths.reduce((a, b) => a + b, 0),
        svg = SVGRoot.getElementById('sequence').appendChild(document.createElementNS(svgNS, 'g')),
        background = drawRectangle(x, y, totalWidth, 1, 'formRect', svg);
        
    svg.id = 'miniFormA';

    if (!tiny) {
        // set the header for the correct sporting class
        if (sportingClass.options[sportingClass.selectedIndex]) {
            var myClass = sportingClass.options[sportingClass.selectedIndex].innerHTML;
            drawText(myClass, blockX + 4, blockY + 17, 'miniFormATotal', 'start', '', svg);
            drawRectangle(blockX, blockY, totalWidth, 24, 'formLine', svg);
            blockY += 24;
        }
    }

    drawText('Fig', blockX + widths[0] / 2, blockY + 17, 'formATextBold', 'middle', '', svg);
    drawText('K', blockX + widths[0] + widths[1] + (widths[2] + widths[3]) / 2,
        blockY + 17, 'formATextBold', 'middle', '', svg);
    drawRectangle(blockX, blockY, totalWidth, 24, 'formLine', svg);
    drawLine(blockX + widths[0], blockY, 0, 24, 'formLine', svg);
    if (!tiny) {
        drawText('Aresti', blockX + widths[0] + widths[1] / 2,
            blockY + 17, 'formATextBold', 'middle', '', svg);
        drawLine(blockX + widths[0] + widths[1], blockY, 0, 24, 'formLine', svg);
    }
    blockY += 24;

    for (let i = 0; i < figures.length; i++) {
        var aresti = figures[i].aresti;
        var k = figures[i].k;
        if (aresti) {
            figNr++;
            var figK = 0;
            var topBlockY = blockY;
            if (tiny) blockY += 24;
            for (let j = 0; j < aresti.length; j++) {
                if (aresti[j] in rulesKFigures) modifiedK.push(figNr);
                figK += parseInt(k[j]);
                if (!tiny) {
                    if (/^non-Aresti /.test(aresti[j])) {
                        // User-built figures have red "Aresti" numbers
                        drawText(aresti[j].replace(/^non-Aresti /, ''), blockX + widths[0] + 4, blockY + 16, 'miniFormAModifiedK', 'start', '', svg);
                    } else {
                        drawText(aresti[j], blockX + widths[0] + 4, blockY + 16, 'miniFormA', 'start', '', svg);
                    }
                    drawText(k[j], blockX + widths[0] + widths[1] + widths[2] - 4,
                        blockY + 16, 'miniFormA', 'end', '', svg);
                    blockY += 12;
                }
            }
            // Adjust figure K for additionals
            if (figures[i].unknownFigureLetter) {
                if (aresti.length < 2) blockY += 12;
                drawText(figNr, blockX + widths[0] - 4,
                    (topBlockY + blockY) / 2 + 4,
                    tiny ? 'formATextMedium' : 'miniFormA', 'end', '', svg);
                if (figures[i].unknownFigureLetter == 'L') {
                    if (additionals <= additionalFig.max) {
                        figK = additionalFig.totalK / additionals;
                    } else {
                        if (additionalFig.max > 0) {
                            figK = additionalFig.totalK / additionalFig.max;
                        }
                        checkAlert(sprintf(userText.maxAdditionals, additionalFig.max),
                            false,
                            figNr);
                    }
                    drawText('Add.', blockX + widths[0] - 4,
                        (topBlockY + blockY) / 2 + 16,
                        tiny ? 'formATextBold' : 'miniFormABold', 'end', '', svg);
                } else {
                    drawText(figures[i].unknownFigureLetter,
                        blockX + widths[0] - 4,
                        (topBlockY + blockY) / 2 + 16,
                        tiny ? 'formATextBold' : 'miniFormA', 'end', '', svg);
                }
            } else {
                drawText(figNr, blockX + widths[0] - 4,
                    (topBlockY + blockY) / 2 + 10,
                    tiny ? 'formATextMedium' : 'miniFormA', 'end', '', svg);
            }
            // adjust figure K for floating point
            if (figures[i].floatingPoint) {
                if (topBlockY == blockY) blockY += 12;
                drawText(`(${figK})`, blockX + totalWidth - 4,
                    (topBlockY + blockY) / 2 + 15, 'miniFormASmall', 'end', '', svg);
                figK -= 1;
                drawText(figK, blockX + totalWidth - 4,
                    (topBlockY + blockY) / 2 + 5,
                    tiny ? 'formATextMedium' : 'miniFormA', 'end', '', svg);
            } else {
                drawText(figK, blockX + totalWidth - 4,
                    (topBlockY + blockY) / 2 + 10,
                    tiny ? 'formATextMedium' : 'miniFormA', 'end', '', svg);
            }
            drawLine(blockX, topBlockY, totalWidth, 0, 'formLine', svg);
            var vertSize = (blockY - topBlockY + 12);
            drawLine(blockX, topBlockY, 0, vertSize, 'formLine', svg);
            drawLine(blockX + widths[0], topBlockY, 0, vertSize, 'formLine', svg);
            if (!tiny) {
                drawLine(blockX + widths[0] + widths[1], topBlockY,
                    0, vertSize, 'formLine', svg);
                drawLine(blockX + widths[0] + widths[1] + widths[2], topBlockY,
                    0, vertSize, 'formLine', svg);
            }
            drawLine(blockX + totalWidth, topBlockY, 0, vertSize, 'formLine', svg);
            figureK += figK;
            blockY += 12;
        }
    }

    if (tiny) {
        drawText('Total K', blockX + 32, blockY + 17, 'formATextMedium', 'middle', '', svg);
        drawText(figureK, blockX + 32, blockY + 38, 'formATextXL', 'middle', '', svg);
        // add maximum K (corrected for Floating Point) where applicable
        if (activeRules && checkCatGroup.k && checkCatGroup.k.max) {
            var max = checkCatGroup.k.max;
            if (checkCatGroup.floatingPoint) max -= checkCatGroup.floatingPoint;
            drawText('Max K', blockX + totalWidth / 2, blockY + 54,
                'formATextMedium', 'middle', '', svg);
            drawText(max, blockX + totalWidth / 2, blockY + 74,
                'formATextLarge', 'middle', '', svg);
            drawRectangle(blockX, blockY, totalWidth, 80, 'formLine', svg);
            blockY += 80;
        } else {
            drawRectangle(blockX, blockY, totalWidth, 44, 'formLine', svg);
            blockY += 44;
        }
    } else {
        drawText(`Total K = ${figureK}`, blockX + 4, blockY + 21, 'miniFormATotal', 'start', '', svg);
        // add maximum K (corrected for Floating Point) where applicable
        if (activeRules && checkCatGroup.k && checkCatGroup.k.max) {
            var max = checkCatGroup.k.max;
            if (checkCatGroup.floatingPoint) max -= checkCatGroup.floatingPoint;
            drawText(`(max K = ${max})`,
                blockX + 4, blockY + 36, 'miniFormAMax', 'start', '', svg);
            drawRectangle(blockX, blockY, totalWidth, 48, 'formLine', svg);
            blockY += 48;
        } else {
            drawRectangle(blockX, blockY, totalWidth, 32, 'formLine', svg);
            blockY += 32;
        }
    }

    // add text when K has been modified by rules
    if (modifiedK.length) {
        drawTextArea(
            changedFigureKText(modifiedK, activeRules.description),
            blockX + 4,
            blockY + 4,
            totalWidth - 8,
            10000 / totalWidth , // height is set greater for narrower widths
            'miniFormAModifiedK',
            'miniFormAModifiedK',
            svg
        )
        blockY += 10000 / totalWidth + 8;
    }

    // Set background to correct size
    background.setAttribute('height', blockY - y);

    return { 'width': totalWidth + 1, 'height': blockY - y };
}

/**********************************************************************
 *
 * Functions for drag & drop repositioning
 *
 **********************************************************************/

// grabFigure will select a figure and allow dragging
function grabFigure(evt) {
    
    // disable when sequence locked
    if ($('lock_sequence').value) return;

    // do not preventDefault as gridInfo may need inside clicks!

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

    // First we check if we're trying to drag a draggable panel
    // E.g.: Grid Info panel
    if (this.classList.contains('draggablePanel')) {
        this.classList.add('dragging');
        dragTarget = this;
        //evt.preventDefault(); // prevent default drag & drop
        var transform = dragTarget.style.transform.match(/-?[\d]*px/g) || [0, 0];

        GrabPoint.x = TrueCoords.x - parseInt(transform[0]);
        GrabPoint.y = TrueCoords.y - parseInt(transform[1]);
        return;
    }

    // first see if we grabbed a figure handle
    if (evt.target.id.match(/-handle$/)) {
        dragTarget = evt.target;

        dragTarget.targetLine = svg.getElementById(
            dragTarget.id.replace(/-handle$/, ''));

        // get dx and dy for this line
        var match = dragTarget.targetLine.getAttribute('d').match(/l ([0-9\-\.]+)[, ]([0-9\-\.]+)/);
        dragTarget.linedx = parseFloat(match[1]);
        dragTarget.linedy = parseFloat(match[2]);

        if (dragTarget.id.match(/entry-handle$/)) {
            // get entry gap element
            dragTarget.gap = $('entryExt-value');
            dragTarget.lineLength = parseInt(
                figures[dragTarget.id.match(/^figure(\d+)/)[1]].entryLength
            );
        } else if (dragTarget.id.match(/exit-handle$/)) {
            // get exit gap element
            dragTarget.gap = $('exitExt-value');
            dragTarget.lineLength = parseInt(
                figures[dragTarget.id.match(/^figure(\d+)/)[1]].exitLength
            );
        } else {
            // get current roll gap element
            dragTarget.gap = $(
                dragTarget.id.match(/roll\d+-gap\d+/)[0] + '-value');

            // get current line length from figures object
            match = dragTarget.id.match(/^figure(\d+)-roll(\d+)-gap(\d+)/);
            var roll = figures[match[1]].rolls[match[2]];
            var gapnr = 0;
            for (let i = 0; i < roll.length; i++) {
                if ('lineLength' in roll[i]) {
                    if (gapnr == match[3]) {
                        dragTarget.lineLength = Math.max(parseInt(roll[i].lineLength), 0.02);
                        break;
                    } else gapnr++;
                }
            }
            if (!dragTarget.lineLength) {
                dragTarget.lineLength = Math.max(parseInt(roll.lineLengthAfter), 0.02);
            }
        }
        // get current gap starting value
        dragTarget.gapValue = parseInt(dragTarget.gap.value);

        // grab magnifier
    } else if (evt.target.id === 'magnifier') {
        dragTarget = evt.target;

        selectedFigure.bottom = parseInt(selectedFigure.y) + parseInt(selectedFigure.height);
        selectedFigure.scale = $('scale').value;
        selectedFigure.diagonal = Math.sqrt(
            Math.pow(selectedFigure.width, 2) + Math.pow(selectedFigure.height, 2));

        // grab full sequence figures
    } else if (evt.target.parentNode.id.match(/^figure\d+$/)) {
        if (figures[evt.target.parentNode.id.replace('figure', '')].draggable) {
            //set the item moused down on as the element to be dragged
            dragTarget = evt.target.parentNode;
        }
    } else if (evt.target.parentNode.id === 'sequenceArea') {
        // clicked somewhere in the SVG container, maybe within figure bBox?
        // svg may be rescaled on smallMobile browser
        const margin = platform.smallMobile ? svg.getAttribute('width') / viewBox[2] * 5 : 5;
        const zoom = parseInt($('zoom').textContent.match(/\d+/)[0]) / 100;
        GrabPoint.x = TrueCoords.x / zoom;
        GrabPoint.y = TrueCoords.y / zoom;
        var x = TrueCoords.x / zoom;
        var y = TrueCoords.y / zoom;

        // Find the figure that is closest and set it to be the dragTarget
        let minDistSq = Infinity;
        figures.forEach ((f, i) => {
            if (f.draggable) {
                let figure = svg.getElementById(`figure${i}`);
                if (figure) {
                    var bBox = figure.getBoundingClientRect();
                    // clicked well within bBox (>margin units within border)?
                    if ((x > (bBox.left + margin)) && (x < (bBox.right - margin)) &&
                        (y > (bBox.top + margin)) && (y < (bBox.bottom - margin))) {
                        // calculate distance squared to bBox centre
                        let distSq = Math.pow(x - (bBox.left + (bBox.width / 2)), 2) +
                            Math.pow(y - (bBox.top + (bBox.height / 2)), 2);
                        if (distSq < minDistSq) {
                            minDistSq = distSq;
                            dragTarget = figure;
                        }
                    }
                }
            }
        });
    }

    if (dragTarget) {
        evt.preventDefault(); // prevent default drag & drop

        // save current scrollTop, to be restored after Drop
        dragTarget.scrollTopSave = $('sequenceArea').scrollTop;
        dragTarget.scrollLeftSave = $('sequenceArea').scrollLeft;

        // move this element to the "top" of the display, so it is
        // always over other elements
        if (!dragTarget.id.match(/^(.*-handle|magnifier)$/)) {
            dragTarget.parentNode.appendChild(dragTarget);
        }

        // turn off all pointer events to the dragged element, this does 2 things:
        //    1) allows us to drag text elements without selecting the text
        //    2) allows us to find out where the dragged element is dropped (see Drop)
        dragTarget.setAttribute('pointer-events', 'none');

        // Enlarge svg to cover top and left, except on smallMobile and Grid.
        // Also, don't do this when selecting the first figure as this can not
        // be dragged.
        // Additionally, reposition optimalSequenceArea div
        if (!platform.smallMobile && !(/^G/.test(activeForm)) &&
            !((/^figure\d+$/.test(dragTarget.id) && figures[dragTarget.id.replace(/^figure/, '')].seqNr == '1'))) {
            var svgRect = svg.getBoundingClientRect();
            var w = window.innerWidth + dragTarget.scrollLeftSave;
            var h = window.innerHeight + dragTarget.scrollTopSave;
            svg.setAttribute('viewBox',
                roundTwo(viewBox[0] - svgRect.left - dragTarget.scrollLeftSave) + ' ' +
                roundTwo(viewBox[1] - svgRect.top - dragTarget.scrollTopSave) + ' ' + w + ' ' + h
            );
            $('optimalSequenceArea').style.transform = 'translate(' +
                parseInt(svgRect.left + dragTarget.scrollLeftSave) + 'px, ' +
                parseInt(svgRect.top + dragTarget.scrollTopSave) + 'px)';
            svg.setAttribute('width', w);
            svg.setAttribute('height', h);
            // correct position for padding
            svg.parentNode.classList.add('sequenceOverlay');
            var main = $('main');
            $('leftBlock').setAttribute('style',
                `margin-top: ${main.offsetTop + main.parentNode.offsetTop}px`);
            $('leftBlockTabSelector').setAttribute('style',
                `top: ${main.offsetTop + main.parentNode.offsetTop}px`);
            main.style.top = (0 - main.parentNode.offsetTop) + 'px';
        }

        // we need to find the current position and translation of the grabbed element,
        //    so that we only apply the differential between the current location
        //    and the new location
        GrabPoint.x = TrueCoords.x;
        GrabPoint.y = TrueCoords.y;

        // blur sequenceText area
        sequenceText.blur();

        // the dragTarget id is the new selectedFigure.id
        if (!dragTarget.id.match(/^(.*-handle|magnifier)$/)) {
            selectFigure(dragTarget.id.replace('figure', ''));
        }
    } else {
        selectFigure(false);
    }
}

// setFigChooser sets the figure chooser to the correct group and
// highlights the figure provided by figNr
function setFigChooser(figNr) {
    // check if fig[figNr] is valid
    if (fig[figNr]) {
        var select = $('figureGroup');
        var options = select.options;
        for (let i = options.length - 1; i >= 0; i--) {
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
        // First look for the earliest figure with the correct Aresti code
        // as the same code may be used more than once (e.g. j and 1j)
        for (var i = 0; i < figNr; i++) if (fig[i] && (fig[i].aresti == fig[figNr].aresti)) break;
        var td = $(`figureChooser${i}`).parentNode;
        td.classList.add('selected');
        // Set the vertical offset of the <tr> in which the element is
        $('figureChooser').scrollTop = td.parentNode.offsetTop;
    }
    updateFigureSelectorOptions();
}

// setFigureSelected sets the active figure and applies color filter
function setFigureSelected(figNr) {
    // make sure we only select valid figures
    if (figNr === false || isNaN(figNr)) figNr = null;
    // allow selecting figures without aresti nr in Free Unknown designer
    // (temporarily empty free figures), but not in other cases
    if (activeForm !== 'FU') {
        while (figures[figNr] && !figures[figNr].aresti) figNr++;
    }

    if (activeForm != 'FU') {
        // if any figure was previously selected, remove that filter
        var selFig = SVGRoot.getElementById('figure' + selectedFigure.id);
        if (selFig) {
            var nodes = selFig.childNodes;
            for (let i = nodes.length - 1; i >= 0; i--) {
                var s = nodes[i].getAttribute('style');
                if (s) {
                    nodes[i].setAttribute('style',
                        s.replace(/#ff00a0/g, 'black').replace(/#ff1090/g, 'red')
                    );
                }
                if (nodes[i].id &&
                    nodes[i].id.match(/^(.*-handle|magnifier|selectedFigureBox)$/)) {
                    nodes[i].remove();
                }
            }
            if ($(`miniFormA-figure${selectedFigure.id}`)){
                $(`miniFormA-figure${selectedFigure.id}`).classList.remove('selected');
            }
        }

        if (figNr !== null && figures[figNr].aresti) {
            // fill selectedFigure with BBox values
            var el = SVGRoot.getElementById('figure' + figNr);

            $('figureHeader').innerHTML = sprintf(userText.editingFigure, figures[figNr].seqNr) +
                ' (' + figures[figNr].k.reduce((a, v) => a + v) + 'K)';

            if (el) {
                var
                    svgScale = platform.smallMobile ?
                        roundTwo(SVGRoot.viewBox.baseVal.width /
                        (SVGRoot.width.baseVal.value || 1)) || 1
                        : 1,
                    showHandles = $('showHandles').checked &&
                        !(/^G/.test(activeForm)),
                    nodes = el.childNodes,
                    length = nodes.length;
                selectedFigure = el.getBBox();
                // apply color filter
                for (let i = 0; i < length; i++) {
                    var s = nodes[i].getAttribute('style');
                    if (s) {
                        nodes[i].setAttribute('style',
                            s.replace(/black/g, '#ff00a0').replace(/red/g, '#ff1090')
                        );
                    }
                    // add editing handles where applicable. They are centered on
                    // the element. Somewhat larger circles for touch devices to
                    // improve grabbing, corrected for svg scaling
                    if (nodes[i].id && showHandles) {
                        var bBox = nodes[i].getBBox();
                        drawCircle({
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
                    drawImage({
                        x: selectedFigure.x + selectedFigure.width - 10,
                        y: selectedFigure.y - 20,
                        width: platform.touch ? 32 * svgScale : 24,
                        height: platform.touch ? 32 * svgScale : 24,
                        'id': 'magnifier',
                        cursor: 'move',
                        href: 'img/magnifier.svg'
                    }, el);
                }
            }
            if ($(`miniFormA-figure${figNr}`)) {
                $(`miniFormA-figure${figNr}`).classList.add('selected');
            }
        }
    } else {
        var el = document.getElementsByClassName('fuFig' + figNr)[0];
        if (el) el.classList.add('active');
        $('figureHeader').innerHTML = sprintf(userText.editingFigure, '');
    }

    // set selectedFigure.id
    selectedFigure.id = figNr;
}

// setSeqViewBox correctly sets the sequence svg viewbox 
function setSeqViewBox() {
    const
        bBox = SVGRoot.getElementById('sequence').getBBox(),
        x = parseInt(bBox.x),
        y = parseInt(bBox.y),
        w = parseInt(bBox.width),
        h = parseInt(bBox.height);

    // Change the viewBox to make the sequence fit
    SVGRoot.setAttribute('viewBox', `${x - 3} ${y - 3} ${w + 5} ${h + 5}`);

    // Restore width and height when not on smallMobile
    if (!platform.smallMobile) {
        SVGRoot.setAttribute('width', w + 5);
        SVGRoot.setAttribute('height', h + 5);
    }
}

// Drag allows to drag the selected figure or handle to a new position
function Drag(evt) {
    if (!dragTarget) return;

    evt.preventDefault(); // prevent default dag & drop and scrolling on touch devices

    // don't drag figures when in grid view
    if (/^G/.test(activeForm) && !dragTarget.classList.contains('draggablePanel')) return;

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
        // if (platform.touch) evt.preventDefault();

        // find out what we are dragging
        if (dragTarget.id.match(/-handle$/)) {
            // Dragging a handle

            var crossLineC = -dragTarget.linedx * GrabPoint.x - dragTarget.linedy * GrabPoint.y;
            // calculate the correct displacement of the handle, along it's
            // line
            var d = (dragTarget.linedx * TrueCoords.x +
                dragTarget.linedy * TrueCoords.y + crossLineC) /
                (Math.pow(dragTarget.linedx, 2) +
                    Math.pow(dragTarget.linedy, 2));
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
                var d = dragTarget.targetLine.getAttribute('d');
                d = d.replace(/l ([0-9\-\.]+)[, ]([0-9\-\.]+)/, 'l ' +
                    (dragTarget.linedx + newX) + ',' +
                    (dragTarget.linedy + newY));
                dragTarget.targetLine.setAttribute('d', d);

                // also change the gap value to reflect this transform
                if (dragTarget.linedx != 0) {
                    dragTarget.gap.value = Math.round(dragTarget.gapValue +
                        (dragTarget.lineLength / dragTarget.linedx) * newX);
                } else {
                    dragTarget.gap.value = Math.round(dragTarget.gapValue +
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
                    var elClass = el.getAttribute('class');
                    if (elClass) {
                        // break if no longer vertical up
                        if ((elClass === 'line') &&
                            !el.getAttribute('d').match(/l 0,-/)) break;
                        if (/^(hammer|point)Tip$/.test(elClass)) {
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
                    if (!el.id.match(/-handle$/)) {
                        el.setAttribute('transform',
                            'translate(' + newX + ',' + newY + ')');
                    }
                }

                // and move all later handles, upto last if applicable
                el = dragTarget;
                while ((lastHandle !== el.id)) {
                    if (!(el = el.nextSibling)) break;
                    if (el.id.match(/-handle$/)) {
                        el.setAttribute('transform',
                            'translate(' + newX + ',' + newY + ')');
                    }
                }

                // move subsequent figures, if no elStop
                if (elStop === null) {
                    for (let figureNr = parseInt(dragTarget.parentNode.id.match(/\d+/)) + 1;
                        figureNr < figures.length; figureNr++) {
                        var figure = SVGRoot.getElementById('figure' + figureNr);
                        if (figure) {
                            figure.setAttribute('transform',
                                'translate(' + newX + ',' + newY + ')');
                        }
                    }
                }

                // Adjust magnifier position
                // Do this by first removing it, then determining the bBox and
                // putting it back
                dragTarget.parentNode.lastChild.remove();
                var
                    bBox = dragTarget.parentNode.getBBox(),
                    svgScale = platform.smallMobile ?
                        roundTwo(SVGRoot.viewBox.baseVal.width /
                        SVGRoot.width.baseVal.value) || 1
                        : 1;
                // add scale handle
                drawImage({
                    x: bBox.x + bBox.width - 10,
                    y: bBox.y - 20,
                    width: platform.touch ? 32 * svgScale : 24,
                    height: platform.touch ? 32 * svgScale : 24,
                    'id': 'magnifier',
                    cursor: 'move',
                    href: 'img/magnifier.svg'
                }, dragTarget.parentNode);
            }
        } else if (dragTarget.id === 'magnifier') {
            // Dragging magnifier

            var scale = Math.sqrt(
                Math.pow(TrueCoords.x + parseInt(selectedFigure.width) - GrabPoint.x, 2) +
                Math.pow(-TrueCoords.y + parseInt(selectedFigure.height) + GrabPoint.y, 2)) /
                selectedFigure.diagonal;

            // scale figure (and magnifier)
            dragTarget.parentNode.setAttribute('transform',
                'translate (' +
                ((parseInt(selectedFigure.x)) * (1 - scale)) + ',' +
                ((parseInt(selectedFigure.bottom)) * (1 - scale)) +
                ') scale (' + scale + ')');

            // Set scale. Math.log gets the natural logarithm. The number
            // 14.427 = 10 / log (2)
            $('scale').value = parseInt(
                parseInt(selectedFigure.scale) + Math.log(scale) * 14.427);

            // Don't drag the first real figure, it's auto positioned
        } else if (dragTarget.id.match(/^figure\d+$/) &&
            (figures[dragTarget.id.replace(/^figure/, '')].seqNr != '1')) {
            // Dragging a complete figure

            // account for the offset between the element's origin and the
            // exact place we grabbed it
            var newX = parseInt(TrueCoords.x - GrabPoint.x);
            var newY = parseInt(TrueCoords.y - GrabPoint.y);

            // apply a new tranform translation to the dragged element, to display
            // it in its new location
            dragTarget.setAttribute('transform', 'translate(' + newX + ',' + newY + ')');

            // move subsequent figures
            for (let figureNr = parseInt(dragTarget.id.match(/\d+/)) + 1; figureNr < figures.length; figureNr++) {
                var figure = SVGRoot.getElementById('figure' + figureNr);
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
            dragTarget.style.transform = 'translate(' + Math.min(newX, 0) +
                'px,' + Math.max(newY, 0) + 'px)';
            var leftX = dragTarget.getBoundingClientRect().left;
            if (leftX < 0) {
                dragTarget.style.transform = 'translate(' + Math.min(newX - leftX, 0) +
                    'px,' + Math.max(newY, 0) + 'px)';
            }

            return;
        }

        if (platform.smallMobile) setSeqViewBox();
    }
}

// Drop is activated when a figure or handle is dropped
function Drop() {
    // if we aren't currently dragging an element, don't do anything
    if (!dragTarget) return;

    $('main').style.top = '';

    // turn the pointer-events back on, so we can grab this item later
    dragTarget.setAttribute('pointer-events', 'all');

    if (dragTarget.classList.contains('draggablePanel')) {
        dragTarget.classList.remove('dragging');
        dragTarget = null;
        return;
    }

    // restore sequenceArea size
    SVGRoot.parentNode.classList.remove('sequenceOverlay');
    $('leftBlock').removeAttribute('style');
    $('leftBlockTabSelector').removeAttribute('style');
    // restore optimalSequenceArea position
    $('optimalSequenceArea').style.removeProperty('transform');

    const transform = dragTarget.getAttribute('transform');

    if (dragTarget.id.match(/^(.*-handle|magnifier)$/)) {
        // Dropping a handle or magnifier
        updateFigure();
        setSeqViewBox();
    } else if (!/^G/.test(activeForm)) {
        // Dropping a complete figure

        // create curveTo for dragged elements when not in grid view
        if (transform) {
            // make sure a comma is used for x y separation in transform
            var dxdy = transform.match(/[0-9\-\.]+[, ][0-9\-\.]+/) ?
                transform.replace(/ /, ',').match(/[0-9\-\.]+,[0-9\-\.]+/)[0].split(',') :
                [transform.match(/[0-9\-\.]+/)[0], 0];
            var dx = parseInt(dxdy[0] / lineElement);
            var dy = parseInt(dxdy[1] / lineElement);
            // reverse direction for dragging in Form C
            if (/^[CL]/.test(activeForm)) dx = -dx;
            if ((dx != 0) || (dy != 0)) {
                updateSequence(dragTarget.id.replace('figure', '') - 1,
                    '(' + dx + ',' + dy + ')',
                    false,
                    false,
                    true);
            }
        }
        setSeqViewBox();
    }

    $('sequenceArea').scrollTop = dragTarget.scrollTopSave;
    $('sequenceArea').scrollLeft = dragTarget.scrollLeftSave;

    // set the global variable to null, so nothing will be dragged until
    // we grab the next element
    dragTarget = null;
}

/**********************************************************************
 *
 * Functions for point & click altering of the sequence
 *
 **********************************************************************/

// changeEntryDirection alters the entry direction of the sequence
function changeEntryDirection() {
    var
        prevEntry = '',
        doFlipY = false;

    // get code
    for (var code in entryOptions) {
        if (entryOptions[code] === this.id.replace(/^t_/, '')) break;
    }
    updateSequenceOptions('');
    if (activeSequence.figures[0] && entryOptions[activeSequence.figures[0].string]) {
        prevEntry = activeSequence.figures[0].string;
    }

    // Flip move options if applicable. Would like to do full rotation
    // support (also ej and eja) but this would result in y -> -y on 180
    // rotation. So only support for changing directly from upwind to
    // downwind and vv
    if ((code + prevEntry) === 'ed') { // match 'ed' + '' and '' + 'ed'
        for (let i = 0; i < figures.length; i++) {
            if (regexCurveTo.test(figures[i].string) || regexMoveTo.test(figures[i].string)) {
                var dxdy = figures[i].string.replace(/[^0-9\,\-]/g, '').split(',');
                updateSequence(i,
                    figures[i].string[0] + -parseInt(dxdy[0]) + ',' + dxdy[1] +
                    figures[i].string.slice(-1),
                    true);
            }
            // flip Y axis when we have a crossbox inside the sequence
            if (figures[i].entryAxis === 'Y') doFlipY = true;
        }
    }

    // insert before start or replace first
    updateSequence(prevEntry ? 0 : -1, code, prevEntry ? true : false);

    if (doFlipY) flipYAxis();
}

// flipYAxis will flip the drawn direction of the Y axis for the whole
// sequence
function flipYAxis() {
    var v = sequenceText.innerText;
    if (v.replace(regexComments, '').match(regexFlipYAxis)) {
        // disable flip
        var t = '';
        var inComment = false;
        for (let i = 0; i < v.length; i++) {
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
        for (let i = 0; i < figures.length; i++) {
            if (figures[i].aresti) {
                updateSequence(i, userpat.flipYaxis + figures[i].string, true);
                break;
            }
        }
    }
    checkSequenceChanged();
}

// updateSequenceOptions updates the sequence options to reflect the
// active start of the sequence. The active start is NOT displayed as an
// option
function updateSequenceOptions(code) {
    // disable when sequence locked
    if ($('lock_sequence').value) return;

    el = $('sequenceOptions');
    if (el) {
        if (code === 'eu') code = '';
        for (let key in entryOptions) {
            var el = $('t_' + entryOptions[key]);
            if (code !== key) {
                el.addEventListener('mousedown', changeEntryDirection);
                el.parentNode.classList.remove('disabled');
            } else {
                el.removeEventListener('mousedown', changeEntryDirection);
                el.parentNode.classList.add('disabled');
            }
        }
    }
}

// clearPositioning removes all figure positioning elements
function clearPositioningOption() {
    // only do this when on Form B or C
    if (/^[BC]/.test(activeForm)) {
        // confirm clearing the position formatting
        confirmBox(userText.clearPositioningConfirm,
            userText.clearPositioning, clearPositioning);
    } else {
        alertBox(userText.notOnFormBC);
    }
}

// clearPositioning removes all figure positioning elements
function clearPositioning() {
    var changesMade = false;
    // make sure no figure is selected
    selectFigure(false);
    // remove all moveTo, curveTo and moveForward figures
    for (let i = 0; i < figures.length; i++) {
        if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
            updateSequence(i, '', true);
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
function separateFigure(id) {
    if (figures[id]) {
        var selectFig = selectedFigure.id;

        // remove any previous move 'figure'
        var i = id - 1;
        if (figures[i]) {
            if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
                selectFig--;
                updateSequence(i, '', true);
                i--;
            }
        }
        i++;
        // need to define bBox here
        figures[i].bBox = myGetBBox($('figure' + i));
        // separate the figure itself
        moveClear(i);

        // select correct figure
        setFigureSelected(selectFig);
        // find the next real figure and separate that one
        i = selectedFigure.id + 1;
        while (figures[i]) {
            if (figures[i].aresti) {
                moveClear(i);
                break;
            } else if (figures[i].moveTo || figures[i].curveTo || figures[i].moveForward) {
                // remove move 'figures'
                updateSequence(i, '', true);
            } else {
                i++;
            }
        }
    }
}

// separateFigures separates all the figures from each other. This is
// done vertically with a curveTo
function separateFigures(noConfirm) {
    function f() {
        // clearPositioning is false when no changes were made. In this
        // case, add undo
        if (!clearPositioning()) {
            activeSequence.undo.push(activeSequence.xml);
        }
        // Start a loop that will continue until nothing's done any more,
        // or until 10000 iterations
        let count = 0;
        do {
            var movedFigure = false;
            let i = 1;
            // start going through the figures from the second figure
            while (i < figures.length && !movedFigure) {
                movedFigure = moveClear(i);
                i++;
            }
            count++;
        } while (movedFigure && count < 10000);
        // replace any (0,0) curveTo by a 2> moveForward
        figures.forEach ((f, i) => {
            if (f.string === "(0,0)") updateSequence(i, '2>', true);
        });
    }

    // Only check for need of confirmation on Form B or C
    if (/^[BC]/.test(activeForm)) {
        if (noConfirm === true) {
            f();
        } else {
            // confirm clearing the position formatting. When confirmed, the
            // function f is executed
            confirmBox(userText.separateFiguresConfirm,
                userText.separateFigures, f);
        }
    } else {
        alertBox(userText.notOnFormBC);
    }
}

// moveClear will move figure i clear from all previous figures
// The return value is true when the figure is moved
function moveClear(i) {
    // put separateMargin in m
    const m = separateMargin;
    // get the bBox set for the figure
    const bBoxI = figures[i].bBox;
    // only do something for real Aresti figures
    if (bBoxI && figures[i].aresti) {
        let
            moveLR = 0,
            // for horizontal movement, move in the same direction as the figure entry
            moveLRsign = (figures[i].entryDir % 180) == 0 ?
                (figures[i].entryAtt == figures[i].entryDir ? 1 : -1) : 0,
            moveDown = 0,
            repeat;
        // loop through all nodes of relevant figures. Whenever we encounter
        // an overlap the figure will be moved down and tests run anew.
        do {
            repeat = false;
            // go through all previous figures
            for (let j = i - 1; j >= 0; j--) {
                const bBoxJ = figures[j].bBox;
                if (bBoxJ && figures[j].aresti) {
                    // go through all nodes of previous figures
                    for (let k = 0; k < bBoxJ.nodes.length; k++) {
                        const bBoxK = bBoxJ.nodes[k];
                        // go through all nodes of this figure
                        for (let l = 0; l < bBoxI.nodes.length; l++) {
                            // set
                            const bBox = bBoxI.nodes[l];
                            // check if we have overlap. If so, try adjusting movedown
                            if (((bBox.right + m) > bBoxK.x) &&
                                ((bBox.x - m) < (bBoxK.x + bBoxK.width))) {
                                if (((bBox.bottom + moveDown + m) > bBoxK.y) &&
                                    ((bBox.y + moveDown - m) < (bBoxK.y + bBoxK.height))) {
                                    moveDown = bBoxK.y + bBoxK.height - bBox.y + m;
                                    repeat = true;
                                }
                            }
                            if (moveLRsign != 0) {
                                // check if we have overlap. If so, try adjusting moveLR
                                if (((bBox.right + moveLR + m) > bBoxK.x) &&
                                    ((bBox.x + moveLR - m) < (bBoxK.x + bBoxK.width))) {
                                    if (((bBox.bottom + m) > bBoxK.y) &&
                                        ((bBox.y - m) < (bBoxK.y + bBoxK.height))) {
                                        if (moveLRsign > 0) {
                                            moveLR = (bBoxK.x + bBoxK.width - bBox.x + m);
                                        } else {
                                            moveLR = -(bBox.x + bBox.width - bBoxK.x + m);
                                        }

                                        repeat = true;
                                    }
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
            // Movement of the figure required. Round the values of moveLR. Tests show
            // that rounding will still assure sufficient spacing 
            moveLR = Math.round(moveLR / lineElement);
            if (activeForm === 'C') {
                moveLR = -moveLR;
                moveLRsign = -moveLRsign;
            }
            moveDown = Math.ceil(moveDown / lineElement);
            // No longer necessary because we redraw every time. This code could be
            // quicker but needs extra work. Keep it here just in case...
            //        for (let j = i; j < figures.length; j++) {
            //          if (figures[j].bBox) figures[j].bBox.y = figures[j].bBox.y + (moveDown * lineElement)
            //        }

            // Use whatever requires least movement, with a slight preference for moving down
            if ((moveLRsign != 0) && (Math.abs(moveLR) < moveDown)) {
                updateSequence(i - 1, `(${moveLR},0)`, false);
            } else {
                updateSequence(i - 1, `(0,${moveDown})`, false);
            }
            // don't add undo for this
            activeSequence.undo.pop();
            return true;
        }
    }
    return false;
}

// drawFullFigure draws a complete Aresti figure in the sequenceSvg
// or in an other svg object when provided
function drawFullFigure(i, draggable, svg) {
    // default to SVGRoot when no svg object provided
    svg = svg || SVGRoot;
    // Mark the starting position of the figure
    figures[i].startPos = { 'x': X, 'y': Y };
    figures[i].draggable = draggable;
    // return for no-draw figures
    if (!figures[i].paths) return;
    // Create a group for the figure, draw it and apply to the SVG
    let group = document.createElementNS(svgNS, "g");
    group.setAttribute('id', 'figure' + i);
    // put the group in the DOM
    svg.getElementById('sequence').appendChild(group);
    var bBox = false;
    figures[i].paths.forEach ((p) => {
        bBox = drawShape(p, group, bBox) || bBox;
    });
    figures[i].bBox = myGetBBox(group);
}

// setQueueMenuOptions enables/disables queue menu options as applicable
function setQueueMenuOptions() {
    $('t_addToQueue').parentNode.removeEventListener('mousedown', addToQueue);
    $('t_addAllToQueue').parentNode.removeEventListener('mousedown', addAllToQueue);
    $('t_clearQueue').parentNode.removeEventListener('mousedown', clearQueue);
    $('t_saveQueueFile').parentNode.removeEventListener('mousedown', saveQueue);
    if (fig.slice(-1) && fig.slice(-1)[0] && fig.slice(-1)[0].group == 0) {
        $('t_clearQueue').parentNode.classList.remove('disabled');
        $('t_saveQueueFile').parentNode.classList.remove('disabled');
        $('t_clearQueue').parentNode.addEventListener('mousedown', clearQueue);
        $('t_saveQueueFile').parentNode.addEventListener('mousedown', saveQueue);
    } else {
        $('t_clearQueue').parentNode.classList.add('disabled');
        $('t_saveQueueFile').parentNode.classList.add('disabled');
    }
    if (figures[selectedFigure.id]) {
        $('t_addToQueue').parentNode.classList.remove('disabled');
        $('t_addToQueue').parentNode.addEventListener('mousedown', addToQueue);
    } else {
        $('t_addToQueue').parentNode.classList.add('disabled');
    }
    if (figures.length) {
        $('t_addAllToQueue').parentNode.classList.remove('disabled');
        $('t_addAllToQueue').parentNode.addEventListener('mousedown', addAllToQueue);
    } else {
        $('t_addAllToQueue').parentNode.classList.add('disabled');
    }
}

// showQueue shows the figure queue
function showQueue() {
    $('figureGroup').selectedIndex = 0;
    changeFigureGroup($('figureGroup').options[0]);
    showFigureSelector();
}

// changeQueueColumns changes the amount of columns in queue
function changeQueueColumns() {
    saveSettingsStorage();
    // clear queue figure SVGs first, to allow resizing
    fig.forEach ((f) => { if (f && f.group == 0) f.svg = false; });
    showQueue();
}

// addToQueue adds the selected figure to the figure queue
function addToQueue(e) {
    var f = figures[selectedFigure.id];
    var figNr = f.figNr;
    // create aresti string
    // queue-[base]-[roll1]-[roll2]-...
    var aresti = 'queue-' + f.aresti.join('-');
    // check if the figure is already in the queue
    var i = fig.length - 1;
    while (fig[i]) {
        if (fig[i].group == 0) {
            if (fig[i].aresti == aresti) {
                if (e) alertBox(userText.figureAlreadyInQueue);
                return;
            }
            i--;
        } else break;
    }

    var string = f.string
        // remove extensions/shortenings
        .replace(regexExtendShorten, '').replace(/-+/g, '-')
        // remove comments
        .replace(regexComments, '');
    // correct X/Y axis switch where necessary. Queue figures always
    // start on X axis
    if (f.entryAxis == 'Y') {
        string = string
            .replace(regexSwitchDirY, '#')
            .replace(regexSwitchDirX, userpat.switchDirY)
            .replace(/#/g, userpat.switchDirX);
    }
    // Handle the very special case where there's only an upright or
    // inverted spin and the base figure is an iv
    if (/^-?\d*i?s/.test(string) && /iv/.test(fig[figNr].base)) {
        string = string.replace(/(\d*i?s)/, "iv$1");
    }

    // append the figure to the fig object
    fig.push({
        'aresti': aresti,
        'base': fig[figNr].base,
        'rolls': fig[figNr].rolls,
        'draw': fig[figNr].draw,
        'pattern': fig[figNr].pattern,
        'kPwrd': fig[figNr].kPwrd,
        'kGlider': fig[figNr].kGlider,
        'kRules': fig[figNr].kRules,
        'unknownFigureLetter': f.unknownFigureLetter,
        'group': 0,
        'string': string
    });

    showQueue();
    setQueueMenuOptions();
    queueToStorage();
}

// addAllToQueue adds all figures in sequence to queue
function addAllToQueue() {
    // check if there are any figures to add
    var noFigures = true;
    for (let i = 0; i < figures.length; i++) {
        if (figures[i].aresti) {
            noFigures = false;
            break;
        }
    }
    if (noFigures) {
        alertBox(userText.addAllToQueueNoFigures, userText.addAllToQueue);
        return;
    }

    infoBox(userText.addAllToQueueWait, userText.addAllToQueue);
    setTimeout(function () {
        const selFig = selectedFigure.id;
        figures.forEach ((f, i) => {
            if (f.aresti) {
                selectFigure(i);
                addToQueue(false);
            }
        });
        // remove infoBox
        setTimeout(infoBox, 300);
        // reselect original selected figure
        selectFigure(selFig);
        // set the figure chooser to the queue group
        $('figureGroup').value = '0';
        changeFigureGroup();
    }, 50);
}

// removeFromQueue removes a figure from the queue
function removeFromQueue(e) {
    noPropagation(e);
    fig.splice(e.target.parentNode.id.replace(/^removeFromQueue/, ''), 1);
    showQueue();
    setQueueMenuOptions();
    queueToStorage();
}

// clearQueue removes all figures from queue
function clearQueue() {
    var figLast = fig.length - 1;
    while (!fig[figLast]) {
        fig.length -= 1;
        figLast -= 1;
    }
    // only do anything when there are actually figures in the queue
    if (fig[figLast].group == 0) {
        showQueue();
        // confirm removing all
        confirmBox(userText.clearQueueConfirm, userText.clearQueue, () => {
            // start removing figures
            var i = figLast;
            while (fig[i]) {
                if (fig[i].group == 0) {
                    fig.pop();
                    i--;
                } else break;
            }
            changeFigureGroup();
            hideFigureSelector();
            setQueueMenuOptions();
            storeLocal('queue', []);
        });
    }
    showQueue();
}

// queueToStorage saves the queue to localStorage to keep it through
// restarts
function queueToStorage() {
    var
        queue = [],
        figLast = fig.findLastIndex((f) => f);

    while (fig[figLast] && (fig[figLast].group == 0)) {
        queue.push(fig[figLast]);
        figLast--;
    }

    storeLocal('queue', JSON.stringify(queue));
}

// queueFromStorage retrieves the queue from localStorage
function queueFromStorage() {
    getLocal('queue', function (string) {
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
        alertBox(userText.FUDesignNotFreeUnknown, userText.fuDesigner);
        return false;
    }
    if (!buildFuFiguresTab()) {
        console.log('Unable to start Free (Un)known Designer');
        return false;
    }

    function f() {

        // unlock sequence when locked
        if ($('lock_sequence').value) lockSequence();

        // deactivate figureSelector and any active menus etc
        hideFigureSelector();
        menuInactiveAll();

        infoBox(userText.FUstarting, userText.fuDesigner);

        // use setTimeout to assure the infoBox shows
        setTimeout(function () {
            // Free Unknown Designer for smallMobile
            if (platform.smallMobile) {
                // hide sequence tab
                $('tab-sequenceArea').classList.add('noDisplay');

                // restore sequence container
                var svg = $('sequenceArea');
                svg.removeAttribute('style');
                svg.classList.remove('hidden');
                var placing = $('sequenceAreaPlacing');
                placing.parentNode.insertBefore(svg, placing);
            }
            selectFigure(false);
            clearPositioning();

            // add fuDesigner class to body
            document.body.classList.add('fuDesigner');

            if (platform.mobile) {
                // move items from File menu to main menu for quick access
                var items = document.getElementsByClassName('menuFileItem');
                for (let i = 0; i < items.length; i++) {
                    $('menu').insertBefore(items[i], $('menuFile'));
                }
                $('menuFile').classList.add('noDisplay');
            } else {
                // move undoRedo and set topBlock height
                $('mainMenu').insertBefore($('undoRedo'), $('t_finalizeSequence'));
            }

            // clear undo and redo
            activeSequence.undo = activeSequence.redo = [];

            // clear the sequence if loading from Grid and no Additional
            // figure present
            var noAdditional = true;
            for (let i = 0; i < figures.length; i++) {
                if (figures[i].unknownFigureLetter === 'L') {
                    noAdditional = false;
                    break;
                }
            }

            if (/^G/.test(activeForm) && noAdditional) {
                var text = 'eu';
            } else {
                // rebuild the sequence according Free (Un)known designer format
                // remove / symbols and entry/exit extension from string
                var text = '';
                for (let i = 0; i < figures.length; i++) {
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
                if (!text.match(/^e(u|d|j|ja) /)) text = 'eu ' + text;
                if (text === 'eu eu') text = 'eu';
            }

            sequenceText.innerText = text;

            checkSequenceChanged(true);

            // add new stylesheet rule 0 to hide all elements with class
            // disableFUdesigner. Only do this after checkSequenceChanged as
            // otherwise it may break some bBox routines!
            $('fuDesignerStyle').innerHTML =
                '.disableFUdesigner{display:none !important;}';

            selectForm('FU');
            availableFigureGroups();

            // select the Free (Un)known figures tab
            $('fuFigures').classList.remove('noDisplay');
            $('tab-fuFigures').classList.remove('noDisplay');
            selectTab('tab-fuFigures');
            $('figureSelector').classList.add('left');

            infoBox();
        }, 300);
    }

    if (dontConfirm) {
        f();
    } else {
        confirmBox(userText.clearPositioningConfirm, userText.fuDesigner, f);
    }
}

// exitFuDesigner is called to exit the Free (Un)known designer. Several
// checks are done and warnings presented if necessary.
// newSequence is true when we are exiting because of loading of new
// sequence
function exitFuDesigner(newSequence) {
    var sub;

    function exitFu() {
        if (!newSequence) {
            infoBox(userText.FUfinalizing, userText.finalizeSequence);
        }

        // use setTimeout to assure the infoBox shows
        setTimeout(function () {
            // remove fuDesigner class from body
            document.body.classList.remove('fuDesigner');

            // delete fuDesignerStyle rule to show all elements with class
            // disableFUdesigner
            $('fuDesignerStyle').innerHTML = '';

            if (platform.mobile) {
                // move items from main menu back to File menu
                var ul = $('menuFileUl');
                var items = document.getElementsByClassName('menuFileItem');
                for (let i = items.length - 1; i >= 0; i--) {
                    ul.insertBefore(items[i], items[i + 1]);
                }
                ul.parentNode.classList.remove('noDisplay');
            } else {
                // move undoRedo
                var undoRedo = $('undoRedo');
                $('topBlock').insertBefore(
                    undoRedo, $('sequenceTextContainer'));
            }

            // clear undo and redo
            activeSequence.undo = activeSequence.redo = [];

            $('fu_figures').value = '';

            if (newSequence === true) {
                checkSequenceChanged(true);
            } else {
                selectFigure(false);
                selectForm('B');

                // remove unassigned Free figures
                sequenceText.innerText = sequenceText.innerText.replace(/X/g, '');
                checkSequenceChanged();

                separateFigures(true);
                sequenceText.innerText = sequenceText.innerText.trim()
                    .replace(/ e(u|d|j|ja)$/, '')
                    .replace(/^eu[ ]*/, '');

                checkSequenceChanged();
            }

            // restore the tabs
            $('subSequenceDirection').classList.add('noDisplay');
            $('tab-fuFigures').classList.add('noDisplay');
            $('fuFigures').classList.add('noDisplay', 'hidden');
            selectTab('tab-figureInfo');
            selectTab('tab-sequenceInfo');
            $('figureSelector').classList.remove('left');

            // clear fuSequence div
            $('fuSequence').innerHTML = '';

            availableFigureGroups();

            // Layout is now restored to desktop/largeMobile.
            // If we were in smallMobile layout, reactivate required elements

            if (platform.smallMobile) {
                platform.smallMobile = false;
                switchSmallMobile();
                selectTab('tab-sequenceInfo');
            }

            if (!newSequence) infoBox();
        }, 300);
    }

    if (newSequence) {
        exitFu();
    } else {
        // get alerts from alert area
        var div = document.createElement('div');
        div.innerHTML = $('alerts').innerHTML;
        // remove label
        div.firstChild.remove();

        var myAlerts = div.innerHTML;

        figures.forEach ((f) => { if (f.aresti) sub = f.subSeq; });
        if (sub > 1) {
            myAlerts += '<br />' + sprintf(userText.FUmultipleSubsequences, sub);
        }

        if (myAlerts.match(RegExp('(' + userText.setUpright + ')|(' +
            userText.setInverted + ')'))) {
            myAlerts += '<br />' + userText.FUexitEntryMatch;
        }

        if (myAlerts !== '') {
            var confirmText = '<p>' + userText.FUerrorsDetected + '</p><p>' +
                myAlerts + '</p><p>' + userText.FUconfirmExit + '</p>';
            confirmBox(confirmText, userText.finalizeSequence, exitFu);
        } else {
            exitFu();
        }
    }
}

// freeCell builds a td element for specified subsequence, column and row
function freeCell(sub, col, row) {
    var td = document.createElement('td');
    td.id = 'sub' + sub + 'col' + col + 'row' + row;
    return td;
}

// freeCellAddHandlers adds correct handlers to each table cell in the
// Free (Un)known designer
function freeCellAddHandlers(td) {
    td.addEventListener('dragenter', () => {
        var nodes = $('fuSequence').getElementsByClassName('hover');
        while (nodes.length) nodes[0].classList.remove('hover');
        if (this) this.classList.add('hover');
    });
    td.addEventListener('dragleave', function (e) {
        if (e.target.id === this.id) this.classList.remove('hover');
    });
    td.addEventListener('dragover', handleFreeDragOver);
    td.addEventListener('drop', handleFreeDrop);

    if (!td.classList.contains('endBlock')) {
        td.addEventListener('mousedown', handleFreeSelect);
    }
}

/***********************************************************************
 *
 * Free (Un)known drag & drop
 *
 **********************************************************************/

// noPropagation makes sure the event doesn't propagate/redirect
function noPropagation(e) {
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
    var l = this.id.replace(/^fu/, '');
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
    e.target.getElementsByClassName('endBlock')[0].classList.add('hidden');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text', string);
}

// handleFreeDragOver fires when dragging over Free (Un)known designer figure
function handleFreeDragOver(e) {
    noPropagation(e); // Necessary. Allows us to drop.

    this.classList.add('hover');
    e.dataTransfer.dropEffect = 'copy';

    return false;
}

// handleFreeDragEnd is called when dragging stops without dropping to
// restore dragged subsequence
function handleFreeDragEnd(e) {
    e.target.getElementsByClassName('endBlock')[0].classList.remove('hidden');
}

// handleFreeDrop handles dropping Free (Un)known figure or subsequence
function handleFreeDrop(e) {
    // this/e.target is current target element.
    noPropagation(e); // Stops some browsers from redirecting.

    // Save scroll location, to restore later
    var scrollTop = $('fuSequence').scrollTop;

    handleFreeDeselect(e);

    this.classList.remove('hover');

    // put dataTransfer text into string
    var string = e.dataTransfer.getData('text');
    var regexSub = /^"(\d+)" /;

    if (this.classList.contains('fuNewSub')) {
        // drop figure or subsequence to new subsequence. Make sure it ends with 'eu'
        string = string.replace(regexSub, '');
        updateSequence(figures.length - 1, string + ' eu');
        // when dropping Additional, select and open figure editor
        if (string.match(/\@L/) || (string === 'X')) {
            selectFigureFu(figures.length - 2);
        }
    } else {
        // drop figure or subsequence on figure (or end)
        var figNr = parseInt(this.className.match(regexFuFigNr)[1]);
        var string = e.dataTransfer.getData('text');

        // if unknownFigureLetter is set, drop one figure earlier
        var previous = figures[figNr].unknownFigureLetter ? 1 : 0;

        // a subsequence is marked by "n" at the start, where
        // n = subsequence number
        var match = string.match(regexSub);
        // check if dropping subsequence
        if (match) {
            // don't drop subsequence on itself
            if (figures[figNr - 1].subSeq != match[1]) {
                var t = '';
                figures.forEach ((f, i) => {
                    // put subsequence in new location
                    if (i == (figNr - previous)) {
                        t += ` ${string.replace(match[0], '')} `;
                    }
                    // only keep figures that were not in original subsequence
                    if (f.subSeq != match[1]) t += ` ${f.string} `;
                });
                sequenceText.innerText = sanitizeSpaces(t);
                checkSequenceChanged();
            }
        } else {
            // single figure
            updateSequence(figNr - 1 - previous, string, false, true);
            // when dropping Additional or eXtra, select and open figure editor
            if (string.match(/\@L/)) {
                selectFigureFu(figNr + 1 - previous);
            } else if (string === 'X') selectFigureFu(figNr - previous);
        }
    }

    // Restore scroll location
    $('fuSequence').scrollTop = scrollTop;

    sequenceText.innerText = sanitizeSpaces(sequenceText.innerText);
    return false;
}

// handleFreeRemove handles removing a figure from the sequence
function handleFreeRemove(e, el) {
    el = el ? el : this;

    noPropagation(e); // Stops some browsers from redirecting.

    // Save scroll location, to restore later
    var scrollTop = $('fuSequence').scrollTop;

    // Shrink figure to disappear
    el.parentNode.style.transform = 'scale(0.01)';

    // wait for remove animation to complete
    setTimeout(function () {
        handleFreeDeselect(e);

        var figNr = el.parentNode.className.match(regexFuFigNr)[1];

        // Because sequenceText is simply formatted in Designer, and sequence change
        // is checked later, simply update sequenceText. Run check to see if previous
        // figure was figureletter and needs to be removed too
        sequenceText.innerText =
            sequenceText.innerText.substring(0,
                figures[figNr - ((/^\"\@[A-Z]/.test(figures[figNr - 1].string)) ? 1 : 0)].stringStart) +
            sequenceText.innerText.substring(figures[figNr].stringEnd);

        // remove any multiple entry options, keeping last one. And clean up spaces
        sequenceText.innerText = sanitizeSpaces(sequenceText.innerText.replace(/(e[udj] +)+(e[udj])/, '$2'));

        checkSequenceChanged();

        // restore scroll position
        $('fuSequence').scrollTop = scrollTop;
    }, 300);
}

// handleFreeDeselect is called when an Additional figure is deselected
function handleFreeDeselect(e) {
    noPropagation(e); // Stops some browsers from redirecting.

    document.querySelectorAll('.fuFig' + selectedFigure.id).forEach(e => {
        e.classList.remove('active');
    });

    selectFigure(false);
    selectTab('tab-fuFigures');
    hideFigureSelector();
}

// handleFreeSelect is called by mousedown on a Free (Un)known figure
function handleFreeSelect(evt) {
    // need to do this to fix temporary selection on iOS
    if (evt.target && evt.target.parentNode &&
        evt.target.parentNode.classList.contains('removeFigureButton')) {
        return;
    }
    var match = this.className.match(regexFuFigNr);
    if (match) {
        selectFigureFu(this.className.match(regexFuFigNr)[1]);
    }
}

// buildFuFiguresTab fills the fuFigures tab with the Free (Un)known
// lettered figures in the active sequence.
function buildFuFiguresTab() {
    Object.keys(fuFig).forEach(key => {delete fuFig[key]});

    for (let f of figures) {
        let l = f.unknownFigureLetter;
        if (l && (figureLetters.indexOf(l) > -1) && f.aresti) {
            const figNr = f.figNr;
            // check if this letter exists already. If this happens, present
            // error message and return false
            if (fuFig[l]) {
                alertBox(sprintf(userText.FUDesignletterMulti, l), userText.fuDesigner);
                return false;
            }
            // append the figure to the fuFig array
            fuFig[l] = {
                // Aresti string: fu-[base]-[roll1]-[roll2]-...
                'aresti': 'fu-' + f.aresti.join('-'),
                'base': fig[figNr].base,
                'rolls': fig[figNr].rolls,
                'draw': fig[figNr].draw,
                'pattern': fig[figNr].pattern,
                'kPwrd': fig[figNr].kPwrd,
                'kGlider': fig[figNr].kGlider,
                'kRules': fig[figNr].kRules,
                'figNr': figNr
            };
            // remove extensions/shortenings and y axis switch
            let string = f.string
                .replace(/[~\.'`\+\/]/g, '').replace(/-+/g, '-')
                // remove comments
                .replace(regexComments, '');
            // correct X/Y axis switch where necessary. fu figures always
            // start on X axis.
            // When fu_figures has a value, the strings were already converted
            if (($('fu_figures').value == '') &&
                ((f.entryAxis == 'Y') || (f.entryAxisFormB == 'Y'))) {
                string = string.replace(regexSwitchDirY, '#').
                    replace(regexSwitchDirX, userpat.switchDirY).
                    replace(/#/g, userpat.switchDirX);
            }
            // Handle the very special case where there's only an upright or
            // inverted spin and the base figure is an iv
            if (/\d*i?s/.test(string) && !/iv/.test(string) &&
                /iv/.test(fuFig[l].base)) {
                string = string.replace(/(\d*i?s)/, "iv$1");
            }

            fuFig[l].string = string;
        }
    };

    // check if we have all required figures. If not, present error
    // message and return false
    var missing = '';
    figureLetters.split('').forEach ((l) => { if (!fuFig[l]) missing += l; });

    if (missing) {
        alertBox(sprintf(userText.FUDesignMissingLetters, missing), userText.fuDesigner);
        return false;
    }

    // start adding the figures
    var
        svg = $('figureChooserSvg'),
        // Define chooser width. Add margin to scroll for touch devices and iOS apps on Mac
        width = platform.smallMobile ? 90 : (platform.touch || (platform.cordova && device.isiOSAppOnMac) ? 110 : 120),
        height = 100,
        maxColCount = platform.smallMobile ? 1 : 2,
        colCount = 0,
        letters = figureLetters.split(''),
        table = $('fuFiguresTable'),
        tr,
        fragment = document.createDocumentFragment();

    firstFigure = false;

    $('fu_figures').value = '';
    removeChildNodes(table);
    // put figures in table. In essence this is a trimmed version of the
    // routine in changeFigureGroup
    letters.push(additionalFig.max ? 'L' : 'X');
    letters.forEach((l) => {
        // clear the svg
        prepareSvg(svg);
        if (!/[LX]/.test(l)) {
            // clear figure
            figures[-1] = [];

            // Set correct attitude and direction for figures starting inverted
            Attitude = Direction = (fuFig[l].base[0] != '-') ? 0 : 180;

            // build the figure
            buildFigure([fuFig[l].figNr], fuFig[l].string, false, -1);

            // reset X and Y and clear figureStart to prevent adjusting
            // figure position
            X = Y = 0;
            figureStart = [];
            // draw the figure
            drawFullFigure(-1, true, svg);
            // retrieve the group holding the figure and set viewbox
            var
                group = svg.getElementById('figure-1'),
                bBox = group.getBBox(),
                xMargin = bBox.width / 20,
                yMargin = bBox.height / 20;

            group.setAttribute('transform', 'translate(' +
                roundTwo((xMargin - bBox.x)) + ' ' +
                roundTwo((yMargin - bBox.y)) + ')');
            svg.setAttribute('viewBox', '0 0 ' +
                roundTwo(bBox.width + xMargin * 2) + ' ' +
                roundTwo(bBox.height + yMargin * 2));
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.setAttribute('id', 'fuFig' + l);
            // add the svg to fuFig[l] as xml text
            fuFig[l].svg = new XMLSerializer().serializeToString(svg);
            // restore svg id
            svg.setAttribute('id', 'figureChooserSvg');
            // add the roll Aresti nrs to fig if applicable
            fuFig[l].rollBase = [];
            for (let j = 1; j < figures[-1].aresti.length; j++) {
                fuFig[l].rollBase[j - 1] = rollArestiToFig[figures[-1].aresti[j]][0];
            }

            $('fu_figures').value += `"@${l}" ${fuFig[l].string} `;
        }
        if (colCount == 0) {
            tr = document.createElement('tr');
            fragment.appendChild(tr);
        }
        colCount = (colCount + 1) % maxColCount;

        var td = document.createElement('td');
        tr.appendChild(td);
        td.setAttribute('id', 'fu' + l);
        if (!(/[LX]/.test(l))) {
            td.innerHTML = fuFig[l].svg;
            // add the unknownFigureLetter and K
            td.innerHTML += `<div class="UFletterInQueue">${l}</div>` +
                '<div class="UFKInQueue">K:' +
                figures[-1].k.reduce((a, b) => a + b) + '</div>';
        } else {
            var textDiv = td.appendChild(document.createElement('div'));
            textDiv.innerHTML = userText[(l === 'L') ? 'additional' : 'free'];
        }
        td.setAttribute(iosDragDropShim.enabled ? 'data-draggable' : 'draggable', true);
        td.addEventListener('dragstart', handleFreeDragFigureStart);
    });

    table.appendChild(fragment);

    $('fu_figures').value = $('fu_figures').value.trim();

    return true;
}

/***********************************************************************
 *
 * Making Forms A, B, C, Grid and FU
 *
 **********************************************************************/

// changedFigureKText creates a well-formatted string
function changedFigureKText(figs) {
    if (figs && figs.length > 1) {
        return sprintf(userText.changedFigureKMulti, figs.join(','), activeRules.description);
    } else return sprintf(userText.changedFigureK, figs[0], activeRules.description);
}

// makeFormA creates Form A from the figures object
function makeFormA() {
    var
        figNr = 0,
        modifiedK = [],
        svgElement = SVGRoot.getElementById('sequence');

    setYAxisOffset(yAxisOffsetDefault);
    Direction = 0;

    // Count how many real figures there are
    figures.forEach ((f, i) => {
        if (f.aresti) {
            // Build the figure at the top-left
            X = Y = 0;
            drawFullFigure(i, false);
            figNr++;
        }
    });
    // The final form will be 800x1000px, leaving room for the print header
    var columnTitleHeight = 50;
    // define column titles and widths
    switch (formStyle) {
        case 'iac':
            var columnTitles = ['No', 'Symbol', 'Cat. No.', 'K', 'Total K', 'Grade', 'Remarks'];
            var columnWidths = [20, 100, 70, 30, 60, 80, 259];
            break;
        case 'imac':
            columnTitleHeight = 30;
            var columnTitles = ['No', 'Symbol', 'Catalogue No.', 'K', 'Total K', 'Score', 'Remarks'];
            var columnWidths = [20, 90, 97, 33, 50, 60, 209];
            break;
        default:
            var columnTitles = ['No', 'Symbol', 'Cat. No.', 'K', 'Total K', 'Grade', 'Pos', 'Remarks'];
            var columnWidths = [20, 100, 70, 30, 60, 70, 48, 221];
    }
    // define height of each row
    var rowHeight = Math.min(parseInt((1000 - columnTitleHeight) / figNr), 125);
    // build column titles
    var x = 0;
    columnTitles.forEach ((title, i) => {
        var lastColumnPlusOne = i == columnTitles.length -1 ? 1 : 0;
        drawRectangle(x, 0, columnWidths[i] + lastColumnPlusOne, columnTitleHeight, 'formLine');
        drawText(
            title,
            x + columnWidths[i] / 2,
            columnTitleHeight / 1.8,
            'formAText',
            'middle');
        x += columnWidths[i];
    });
    var y = columnTitleHeight;
    var row = 0;
    figureK = 0;
    for (let i = 0; i < figures.length; i++) {
        // reduce rowheight for last one so border fits within height 1000
        if (row == (figNr - 1)) rowHeight -= 2;
        // find Aresti nr(s) and k(s) for figure
        var aresti = figures[i].aresti;
        var k = figures[i].k;
        // only draw if there is a (fake) aresti number
        if (aresti) {
            var x = 0;
            for (let column = 0; column < columnWidths.length; column++) {
                switch (column) {
                    case (0):
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                        drawText(row + 1,
                            x + columnWidths[column] / 2,
                            y + rowHeight / 2,
                            'formATextBold',
                            'middle');
                        break;
                    case (1):
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'pos');
                        // Get the drawn figure from the SVG and set the correct scaling
                        var group = SVGRoot.getElementById('figure' + i);
                        var bBox = group.getBBox();
                        var scaleFigure = roundTwo(Math.min((columnWidths[column] - 10) / bBox.width, (rowHeight - 20) / bBox.height));
                        var xMargin = (columnWidths[column] - bBox.width * scaleFigure) / 2;
                        var yMargin = (rowHeight - bBox.height * scaleFigure) / 2;
                        group.setAttribute('transform', 'translate(' +
                            roundTwo((x + xMargin - bBox.x * scaleFigure)) + ' ' +
                            roundTwo((y + yMargin - bBox.y * scaleFigure)) +
                            ') scale(' + scaleFigure + ')');
                        break;
                    case (2):
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                        // set the font size from 8-13 depending on the amount of Aresti nrs
                        var fontsize = Math.max(
                            Math.min(
                                parseInt(rowHeight / (aresti.length + 1)),
                                13),
                            8);
                        for (let j = 0; j < aresti.length; j++) {
                            if (aresti[j] in rulesKFigures) modifiedK.push(row + 1);
                            if (/^non-Aresti /.test(aresti[j])) {
                                // User-built figures have red "Aresti" numbers
                                drawText(aresti[j].replace(/^non-Aresti /, ''),
                                    x + 10,
                                    y + (j + 1.5) * fontsize,
                                    'miniFormAModifiedK',
                                    'start');
                            } else {
                                drawText(aresti[j],
                                    x + 10,
                                    y + (j + 1.5) * fontsize,
                                    'formAText' + fontsize + 'px',
                                    'start');
                            }
                        }
                        if (figures[i].floatingPoint && /^(iac|imac)$/.test(formStyle)) {
                            // add 'F.P.' to IAC form A when applicable
                            drawText('F.P.',
                                x + columnWidths[column] / 2,
                                y + (aresti.length + 2) * fontsize,
                                'formATextBold' + fontsize + 'px',
                                'middle');
                        }
                        break;
                    case (3):
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                        var figK = 0;
                        // set the font size from 8-13 depending on the amount of Aresti nrs
                        var fontsize = Math.max(
                            Math.min(
                                parseInt(rowHeight / (aresti.length + 1)),
                                13),
                            8);
                        k.forEach ((k, i) => {
                            drawText(k,
                                x + columnWidths[column] - 7,
                                y + (i + 1.5) * fontsize,
                                'formAText' + fontsize + 'px',
                                'end');
                            figK += parseInt(k);
                        });
                        // Adjust figure K for additionals
                        if (figures[i].additional) {
                            if (additionals <= additionalFig.max) {
                                figK = additionalFig.totalK / additionals;
                            } else {
                                if (additionalFig.max > 0) {
                                    figK = additionalFig.totalK / additionalFig.max[sportingClass.value];
                                }
                                checkAlert(sprintf(userText.maxAdditionals, additionalFig.max),
                                    false,
                                    row + 1);
                            }
                        }
                        break;
                    case (4):
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                        if (figures[i].floatingPoint) {
                            drawText('(' + figK + ')',
                                x + columnWidths[column] / 2,
                                y + rowHeight / 2 + 10,
                                'formAText',
                                'middle');
                            figK -= 1;
                            drawText(figK,
                                x + columnWidths[column] / 2,
                                y + rowHeight / 2 - 8,
                                'formATextBoldLarge',
                                'middle');
                        } else {
                            drawText(figK,
                                x + columnWidths[column] / 2,
                                y + rowHeight / 2,
                                'formATextBoldLarge',
                                'middle');
                        }
                        if (($('printSF').checked === true) &&
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
                        if (formStyle == 'civa') {
                            drawCircle({
                                cx: x + columnWidths[column] / 2,
                                cy: y + rowHeight * 0.8, r: 2, fill: 'black'
                            });
                        }
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                        drawLine(x, y, 0, rowHeight, 'formLineBold');
                        break;
                    case (6):
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                        break;
                    case (7):
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                        break;
                    default:
                        drawRectangle(x, y, columnWidths[column], rowHeight, 'formLine');
                }
                if (column == (columnWidths.length - 1)) {
                    drawLine(x + columnWidths[column], y, 0, rowHeight, 'formLineBold');
                }
                if ((row == 0) && (column > 4)) {
                    drawLine(x, y, columnWidths[column], 0, 'formLineBold');
                }
                if ((row == (figNr - 1)) && (column > 4)) {
                    drawLine(x, y + rowHeight, columnWidths[column], 0, 'formLineBold');
                }
                x += columnWidths[column];
            }
            y += rowHeight;
            row++;
        }
    }
    if (modifiedK.length) {
        drawText(changedFigureKText(modifiedK, activeRules.description),
            0, y + 12, 'miniFormAModifiedK', 'start', '', svgElement);
        SVGRoot.setAttribute("viewBox", '0 0 800 1020');
    } else SVGRoot.setAttribute("viewBox", '0 0 800 1000');

    SVGRoot.setAttribute("width", '800px');
    SVGRoot.setAttribute("height", '1000px');
}

// makeFormB creates Form B from the figures array
function makeFormB() {
    figures.forEach((f, i) => {
        // only make real figures draggable
        if (f.paths.length) drawFullFigure(i, f.aresti && true);
    });
    addFormElements('B');
}

// makeFormC creates Form C from the figures array
function makeFormC() {
    figures.forEach((f, i) => {
        // only make real figures draggable
        if (f.paths.length) drawFullFigure(i, f.aresti && true);
    });
    addFormElements('C');
}

// makeFormGrid creates a grid of figures
function makeFormGrid(cols, width, svg = SVGRoot) {
    width = width || 800; // capture negative widths

    let
        cw = parseInt(width / cols),
        ch = parseInt(cw * Math.GR),
        x = 0,
        y = 0,
        col = 0,
        scaleMin = Infinity, // will hold the smallest Fig scale
        modifiedK = [],
        sortFigures = [],
        totalK = 0,
        tw = 0,
        flag = false,
        entryExit = {
            Entry: { l: 0, n: 0, h: 0, L: 0, N: 0, H: 0 },
            Exit: { l: 0, n: 0, h: 0, L: 0, N: 0, H: 0 }
        };

    // draw all real figures, ordered as selected
    const orderBy = $('gridOrderBy').value;
    figures.forEach ((f, i) => {
        if (f.aresti) {
            sortFigures.push({ id: i, orderBy: f[orderBy] });
        }
    });

    if (orderBy !== 'seqNr') {
        sortFigures.sort(function (a, b) {
            // when equal or non-existant, sort by id
            if (!a.orderBy && !b.orderBy) return (a.id - b.id);
            if (!a.orderBy || (a.orderBy > b.orderBy)) return 1;
            if (!b.orderBy || (b.orderBy > a.orderBy)) return -1;
            return (a.id - b.id);
        });
    }

    for (let i = 0; i < sortFigures.length; i++) {
        const f = figures[sortFigures[i].id];

        // draw rectangle
        drawRectangle(x, y, cw, ch, 'formLine', svg);
        // draw figure Ks, Arestis and Figure Letter
        let textWidth = 0;
        // yy is used to determine the top of all Aresti nrs, comments etc
        let yy = y + ch - 10;
        drawText('K: ' + f.k.reduce ((a,b) => a + b),
            x + 5, yy, 'formATextBold', 'start', '', svg);
        totalK += f.k.reduce ((a,b) => a + b);
        for (let j = f.k.length - 1; j >= 0; j--) {
            if (f.aresti[j] in rulesKFigures) modifiedK.push(f.seqNr);
            yy -= 15;
            drawText(f.aresti[j] + '(' + f.k[j] + ')',
                x + 5,
                yy,
                'formAText',
                'start',
                'Fig' + i + 'Aresti' + j,
                svg);
            tw = svg.lastChild.getBBox().width;
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
            let
                flagWidth = 0,
                scale = 1;

            if (f.country) {
                // set scale for flag
                const scale = Math.min(roundTwo((cw - tw - 10) / 56), 1);
                flag = drawImage({
                    width: 48 * scale,
                    height: 48 * scale,
                    x: x + cw - (52 * scale),
                    y: y + ch - (48 * scale),
                    'id': 'flag' + i,
                    href: 'data:image/png;base64,' + flags[f.country]
                }, svg);
                flagWidth = 56 * scale;
            }

            const paths = makeTextBlock(f.comments);
            // create group for comments
            const g = svg.appendChild(document.createElementNS(svgNS, 'g'));
            for (let j = 0; j < paths.length; j++) {
                // don't draw box, only text
                if (!paths[j].path) drawShape(paths[j], g);
            }
            const bBox = g.getBBox();
            // check if comments fit right of Aresti nrs, scale if necessary
            if (flag && (((y + ch) - yy) > bBox.height)) {
                scale = Math.min((cw - tw - 40) / bBox.width, 1);
            } else {
                scale = Math.min((cw - tw - flagWidth - 40) / bBox.width, 1);
            }
            if (scale < 0.67) {
                // would get too small, put above Aresti nrs and scale to
                // column width, upto factor 0.67
                scale = Math.max(Math.min((cw - 40) / bBox.width, 1), 0.67);
                yy -= (bBox.height + 10);
                g.setAttribute('transform', 'translate(' +
                    roundTwo(x - (bBox.x * scale) + 5) + ',' +
                    roundTwo(yy - (bBox.y * scale)) + ') scale(' +
                    roundTwo(scale) + ')');
            } else {
                // put right bottom and scale
                if (flag) {
                    yy = Math.min(y + ch + 15 - (bBox.height * scale) - flag.getAttribute('height'), yy);
                    g.setAttribute('transform', 'translate(' +
                        roundTwo((x - ((bBox.x + bBox.width) * scale)) + cw - 10) + ',' +
                        roundTwo((y + ch + 3 - ((bBox.y + bBox.height) * scale) - flag.getAttribute('height'))) + ') scale(' +
                        roundTwo(scale) + ')');
                } else {
                    yy = Math.min(y + ch + 15 - (bBox.height * scale), yy);
                    g.setAttribute('transform', 'translate(' +
                        roundTwo((x - ((bBox.x + bBox.width) * scale)) + cw - 10) + ',' +
                        roundTwo((y + ch - 2 - ((bBox.y + bBox.height) * scale))) + ') scale(' +
                        roundTwo(scale) + ')');
                }
            }
        }

        // draw figure
        const fh = yy - y - 10;
        // set X and Y to 0 to prevent roundoff errors in figure drawing
        // and scaling
        X = Y = 0;
        drawFullFigure(sortFigures[i].id, f.paths[0].figureStart, svg);
        const bBox = f.bBox;
        // set figure size to column width - 20
        const scale = Math.min((cw - 20) / bBox.width, (fh - 20) / bBox.height);
        if (scale < scaleMin) scaleMin = scale;
        // move each figure to grid element center and scale appropriately
        f.tx = roundTwo(x - (bBox.x * scale) + ((cw - bBox.width * scale) / 2));
        f.ty = roundTwo(y - (bBox.y * scale) + ((fh - bBox.height * scale) / 2));
        f.fh = roundTwo(fh);
        f.viewScale = roundTwo(scale);
        svg.getElementById('figure' + sortFigures[i].id).setAttribute('transform', 'translate(' +
            f.tx + ',' + f.ty + ') scale(' + f.viewScale + ')');
        if (i < (sortFigures.length - 1)) {
            x += cw;
            col++;
            if (col >= cols) {
                x = col = 0;
                y += ch;
            }
        }

        entryExit.Entry[fig[f.figNr].entryExitPower[0]]++;
        entryExit.Exit[fig[f.figNr].entryExitPower[1]]++;
    }

    $('gridTotalK').innerText = totalK;

    // update viewbox and svg height
    var height = y + ch + 2;
    if (modifiedK.length) {
        drawText(changedFigureKText(modifiedK, activeRules.description),
            0, -4, 'miniFormAModifiedK', 'start', '', svgElement);
        height += 12;
        svg.setAttribute("viewBox", '-1 -13 ' + (width + 2) + ' ' + height);
    } else svg.setAttribute("viewBox", '-1 -1 ' + (width + 2) + ' ' + height);

    if (platform.smallMobile) {
        svg.removeAttribute("width");
        svg.removeAttribute("height");
    } else {
        svg.setAttribute("width", (width + 2));
        svg.setAttribute("height", height);
    }

    // go through the figures again, set maximum scale to scaleMin * 2
    // and recenter horizontally when necessary
    sortFigures.forEach ((s) => {
        var f = figures[s.id];
        var scale = f.viewScale;
        if (scale > (scaleMin * 2)) {
            var scale = scaleMin * 2;
            var bBox = f.bBox;
            var x = roundTwo(f.tx + (bBox.x * f.viewScale) - ((cw - bBox.width * f.viewScale) / 2));
            var y = roundTwo(f.ty + (bBox.y * f.viewScale) - ((f.fh - bBox.height * f.viewScale) / 2));
            svg.getElementById('figure' + s.id).setAttribute('transform', 'translate(' +
                roundTwo(x - (bBox.x * scale) + ((cw - bBox.width * scale) / 2)) +
                ',' + roundTwo(y - (bBox.y * scale) + ((f.fh - bBox.height * scale) / 2)) +
                ') scale(' + roundTwo(scale) + ')');
        }
    });

    // list entry and exit speeds and attitudes
    for (let key in { Entry: '', Exit: '' }) {
        for (let attSpd in entryExit[key]) {
            $('grid' + key + attSpd).innerHTML =
                entryExit[key][attSpd];
        }
    }

    // Go through the grid figures to obtain a reasonable estimate of
    // the required number of additional figures.
    //
    // In parseFiguresFile all figures get a two letter code describing
    // entry and exit attitude and speed. Letters used are L(ow),
    // N(eutral) and H(igh). Lowercase is used for inverted attitudes.
    // Speeds are determined by selection defined in config.js.
    //
    // Here we match these until no more matches are possible

    var sets = [];
    figures.forEach ((f) => {
        if (f.aresti) sets.push(fig[f.figNr].entryExit);
    });

    // run the matching routine both on the normal and reverse order of
    // figures. This improves match finding. Only use the lowest value.
    $('gridAdditionals').textContent = Math.max(
        Math.min(
            getFigureSets(sets).length,
            getFigureSets(sets.reverse()).length
        ) - 1, 0
    );

    if (additionalFig.max) {
        $('gridAdditionals').setAttribute('class', 'remaining' + Math.max(
            Math.min(additionalFig.max - $('gridAdditionals').textContent, 4), -1));
            $('gridAdditionals').textContent += ' / ' + additionalFig.max;
    } else $('gridAdditionals').setAttribute('class', '');
}

// getFigureSets creates sets of figures that match.
//
// In parseFiguresFile all figures get a two letter code describing
// entry and exit attitude and speed. Letters used are L(ow),
// N(eutral) and H(igh). Lowercase is used for inverted attitudes.
// Speeds are determined by selection defined in config.js.
//
// Here, we match these until no more matches are possible.
//
// sets    : figures entry/exit of form [xx, xx, xx, ...]
// maxSize : maximum size per set (defaults to Infinity)
//
// The return is an array of the form
// [[fignr, fignr, ...], [fignr, fignr, ...], ...]

function getFigureSets(sets, maxSize) {
    maxSize = maxSize * 2 || Infinity; // *2 because every figure = 2 letters

    var setFigs = [];
    sets.forEach ((s, i) => { setFigs.push([i]) });

    if (sets.length > 1) {
        // first match correct speeds, then match with neutral
        var matchNeutral = false;
        do {
            do {
                var join = false;
                for (let i = 0; i < (sets.length - 1); i++) {
                    for (let j = i + 1; j < sets.length; j++) {
                        // stop matching for this set when reaching maxSize
                        if (sets[i] && (sets[i].length >= maxSize)) break;
                        // match at the beginning of set i
                        while ((j < sets.length) && (sets[i].length < maxSize) &&
                            ((sets[j].slice(-1) === sets[i][0]) ||
                                (matchNeutral &&
                                    (sets[j].slice(-1) + sets[i][0]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)))) {
                            sets[i] = sets[j] + sets[i];
                            sets.splice(j, 1);
                            setFigs[i].unshift(setFigs[j][0]);
                            setFigs[j].splice(0, 1);
                            if (!setFigs[j].length) setFigs.splice(j, 1);
                            join = true;
                        }
                        // match at the end of set i
                        while ((j < sets.length) && (sets[i].length < maxSize) &&
                            ((sets[j][0] === sets[i].slice(-1)) ||
                                (matchNeutral &&
                                    (sets[j][0] + sets[i].slice(-1)).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)))) {
                            sets[i] += sets[j];
                            sets.splice(j, 1);
                            setFigs[i].push(setFigs[j][0]);
                            setFigs[j].splice(0, 1);
                            if (!setFigs[j].length) setFigs.splice(j, 1);
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

// shuffle accepts an array and returns it's shuffled version
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// createFigureProposals creates groups of figures, based on matching by
// getFigureSets.
// It is used to create groups from a large number of Unknown figures
function createFigureProposals() {
    var
        realFigs = [],
        superFamilyRatio = {},
        proposals = [],
        size = $('gridColumns').value;

    // create an array holding the indexes of real figures
    figures.forEach ((f, i) => {
        if (f.aresti) {
            realFigs.push(i);
            superFamilyRatio[f.superFamily] = 0;
        }
    });
    var propCount = Math.floor(realFigs.length / size);

    // randomize figure order. The realFig holds the true figure index
    // and needs to be consulted after all is done
    realFigs = shuffle(realFigs);

    // now sort by Superfamily. This prevents filling up proposals before
    // "difficult" Superfamilies are spread out
    realFigs.sort((a, b) => 
        figures[a].superFamily - figures[b].superFamily
    );

    // build empty proposals
    proposals = Array.from ({ length: propCount }, () => {
        return { figures: [], sf: JSON.parse(JSON.stringify(superFamilyRatio)) }
    });

    var figsInProposals = propCount * size;
    // count specific families to ensure equal distibution
    for (let i = 0; i < figsInProposals; i++) {
        superFamilyRatio[figures[realFigs[i]].superFamily] += 1 / propCount;
    }

    // go through figures and build proposals
    for (let i = 0; i < figsInProposals; i++) {
        var f = figures[realFigs[i]];
        // shuffle proposals on every figure so we don't start by adding
        // everything to the same proposal
        proposals = shuffle(proposals);
        // match 1) exact, 2) neutral, 3) all
        for (let matchType = 1; matchType <= 3; matchType++) {
            // look at each proposal
            for (let prop = 0; prop < propCount; prop++) {
                var match = false;
                var p = proposals[prop];
                // check if the proposal is not full, and distribution of
                // Superfamily, except family 7
                if ((p.figures.length < size) && ((f.superFamily == 7) ||
                    (p.sf[f.superFamily] < superFamilyRatio[f.superFamily]))) {
                    // match at the beginning of proposal
                    if (!p.length || // always add to empty proposal
                        (fig[f.figNr].entryExit[1] === fig[realFigs[p.figures[0]].figNr].entryExit[0]) ||
                        ((matchType == 2) &&
                            (fig[f.figNr].entryExit[1] + fig[realFigs[p.figures[0]].figNr].entryExit[0]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/)) ||
                        (matchType == 3)) {
                        proposals[prop].figures.unshift(i);
                        // add superFamily
                        proposals[prop].sf[f.superFamily]++;
                        match = true;
                    } else
                        // match at the end of proposal
                        if ((fig[f.figNr].entryExit[0] === fig[realFigs[p.figures.slice(-1)].figNr].entryExit[1]) ||
                            ((matchType == 2) &&
                                (fig[f.figNr].entryExit[0] + fig[realFigs[p.figures.slice(-1)].figNr].entryExit[1]).match(/^(n[hl]|N[HL]|[hl]n|[HL]N)$/))) {
                            proposals[prop].figures.push(i);
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
    $('t_proposalsIncomplete').classList.add('noDisplay');
    if (figsInProposals < realFigs.length) {
        $('t_proposalsIncomplete').classList.remove('noDisplay');
        proposals.push({ figures: [] });
        for (let i = figsInProposals; i < realFigs.length; i++) {
            proposals[proposals.length - 1].figures.push(i);
        }
    }

    // build a sequence string and count total K for each proposal
    var
        content = '',
        propK,
        string;

    $('proposalsTotalK').innerHTML = userText.proposalsTotalK;
    sequenceText.innerHTML = '';
    proposals.forEach ((p) => {
        propK = 0;
        string = "";
        p.figures.forEach ((pf) => {
            var f = figures[realFigs[pf]];
            if (f.comments || f.unknownFigureLetter) string += '"' +
                (f.unknownFigureLetter ? '@' + f.unknownFigureLetter : '') +
                (f.comments ? f.comments : '') + '" ';
            string += f.string + ' ';
            propK += f.k.reduce ((a,b) => a + b);
        });
        $('proposalsTotalK').innerHTML += propK +
            '&nbsp;&nbsp;'
        content += string.trim() + '\n';
        sequenceText.innerHTML += string;
    });

    $('proposals').textContent = content;

    // set Grid rendering options
    activeSequence.figures = [];
    var savedText = activeSequence.text;
    var savedOrder = $('gridOrderBy').value;
    $('gridOrderBy').value = 'seqNr';

    // build Grid image for proposals
    checkSequenceChanged(true);

    var svg = $('proposalsSequenceSvg');
    prepareSvg(svg);

    var h = 200 * Math.ceil(realFigs.length / size);
    makeFormGrid(size, size * 150, svg);
    svg.setAttribute('width', svg.getAttribute('width') * (h / svg.getAttribute('height')));
    svg.setAttribute('height', h);

    // restore normal Grid view
    activeSequence.figures = [];
    activeSequence.text = savedText;
    sequenceText.innerHTML = savedText;
    $('gridOrderBy').value = savedOrder;

    checkSequenceChanged(true);
}

// makeFree builds Free Known and Unknown designer sequences
// When additionalFig.max is zero, it's a Free Known. Otherwise, Unknown
function makeFree() {
    // set sizes
    var
        cellW = platform.smallMobile ? 100 : 120,
        cellH = platform.smallMobile ? 80 : 100,
        div = $('fuSequence'),
        subseqString = '',
        sub = 1,     // current subsequence number
        col = 1,     // subsequence table column
        prevSub = 0, // previous subsequence
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
    document.body.classList.add('fuDesigner');
    removeChildNodes(div);
    let table = document.createElement('table');
    div.appendChild(table);

    // getTd gets the td for the next figure block and updates size when
    // necessary
    function getTd() {
        let tr;
        // check if td was already occupied. Can happen on reversing
        // figures. If so, increase row
        let td = $(`sub${sub}col${col}row${row}`);
        if (td && td.firstChild) row++;
        // add new row if it did not exist
        if (row > height) {
            tr = document.createElement('tr');
            table.appendChild(tr);
            for (let i = minCol; i <= maxCol; i++) {
                tr.appendChild(freeCell(sub, i, row));
            }
            height = row;
        }
        if (col > maxCol) {
            // add new column right
            table.childNodes.forEach ((tr,i) => {
                tr.appendChild(freeCell(sub, col, i + 1));
            });
            maxCol = col;
        } else if (col < minCol) {
            // add new column left
            table.childNodes.forEach((tr, i) => {
                tr.insertBefore(freeCell(sub, col, i + 1), tr.firstChild);
            });
            minCol = col;
        }

        td = $(`sub${sub}col${col}row${row}`);

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
        const td = getTd();
        if (figures[id - 1] && (figures[id - 1].exitAtt !== undefined)) {
            const svg = newSvg();
            td.appendChild(svg);
            // set X and Y to 0 to prevent roundoff errors in figure drawing
            // and scaling
            X = Y = 0;
            Attitude = figures[id - 1].exitAtt;
            Direction = figures[id - 1].exitDir;
            NegLoad = ((Attitude > 90) && (Attitude < 270)) ? 1 : 0;

            figures[id].paths = buildShape('Line', [6]);
            figures[id].paths = buildShape('FigStop', false, figures[id].paths);
            figures[id].paths = buildShape('FigStop', true, figures[id].paths);
            drawFullFigure(id, false, svg);
            const thisFig = svg.getElementById('figure' + id);
            const bBox = thisFig.getBBox();

            // retrieve the group holding the figure and set viewbox (only fill
            // half the width)
            var xMargin = bBox.width / 2;
            var yMargin = bBox.height / 2;
            thisFig.setAttribute('transform', 'translate(' +
                roundTwo((xMargin - bBox.x)) + ' ' +
                roundTwo((yMargin - bBox.y)) + ')');
            svg.setAttribute('viewBox', '0 0 ' +
                roundTwo(bBox.width + xMargin * 2) + ' ' +
                roundTwo(bBox.height + yMargin * 2));
            svg.setAttribute('width', cellW);
            svg.setAttribute('height', cellH);
        }

        if (!additionalFig.max) {
            // add Total K
            const div = document.createElement('div');
            div.classList.add('UFKInFigure');
            div.innerHTML = 'Total K: ' + totalK;
            if (activeRules && checkCatGroup.k && checkCatGroup.k.max) {
                div.innerHTML += '<br />Max K: ' + checkCatGroup.k.max;
            }
            td.appendChild(div);
        }

        td.classList.add('fuFig' + id, 'endBlock');
        freeCellAddHandlers(td);

        // add table drag handling
        if (iosDragDropShim.enabled) {
            table.setAttribute('data-draggable', true);
        } else table.setAttribute('draggable', true);
        table.addEventListener('dragstart', function (e) {
            handleFreeDragSubStart(e, string);
        });
        table.addEventListener('dragend', handleFreeDragEnd);

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
        return document.createElement('table');
    }

    // addRemoveFigureButton adds a button to remove the figure
    function addRemoveFigureButton(container) {
        const div = document.createElement('div');
        div.classList.add('removeFigureButton');
        div.innerHTML = '<i class="material-icons">close</i>';
        div.addEventListener('mousedown', handleFreeRemove);
        container.appendChild(div);
    }

    // addFigureK adds figure K
    function addFigureK(container, f) {
        const div = document.createElement('div');
        const K = f.k.reduce((a, b) => a + b);
        div.classList.add('UFKInFigure');
        div.innerHTML = 'K:' + K;
        container.appendChild(div);
        return K;
    }

    // make sure the sequence ends with 'eu' marked as subSequence
    if (figures.slice(-1) && figures[figures.length-1].string == 'eu') {
        figures.pop();
    }
    figures.push({ 'string': 'eu', 'subSequence': true });

    // check for multiple use of same letter
    const usedLetters = figures.reduce((acc, f) => {
        const l = f.unknownFigureLetter;
        if (!acc[l]) acc[l] = 0;
        if (f.aresti) acc[l]++;
        return acc;
    }, {});
    // draw all real figures
    figures.forEach ((f, i) => {

        f.subSeq = sub;
        if (f.aresti) {
            var td = getTd();
            addRemoveFigureButton(td);
            if (!additionalFig.max) totalK += addFigureK(td, f);
            td.classList.add('fuFig' + i);

            var svg = newSvg();
            td.appendChild(svg);

            // set different class for Additional and Free figures
            if (f.unknownFigureLetter === 'L') {
                if (additionalFig && (usedLetters.L > additionalFig.max)) {
                    td.classList.add('additionalFigureMulti');
                } else {
                    td.classList.add('additionalFigure');
                }
            } else if (!f.unknownFigureLetter) {
                td.classList.add('additionalFigure');
                freeFigures++;
            } else if (usedLetters[f.unknownFigureLetter] > 1) {
                td.classList.add('fuFigureMulti');
            } else {
                td.classList.add('fuFigure');
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
            svg.setAttribute('viewBox', '0 0 ' +
                roundTwo(bBox.width + xMargin * 2) + ' ' +
                roundTwo(bBox.height + yMargin * 2));
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
        } else if (f.subSequence && (i > 0) && (figures[i-1].aresti || figures[i-1].string == 'X')) {
            // new subsequence, end previous
            table = endSubseq(i, '"' + sub + '" ' + subseqString);
            div.appendChild(table);
            // set subSeq number of new subsequence
            figures[i].subSeq = sub;
        } else if (/^[LX]$/.test(f.string)) {
            // undefined Additional figure
            var td = getTd();
            td.innerHTML = userText[(f.string === 'L') ? 'additional' : 'free'];

            addRemoveFigureButton(td);
            td.classList.add('fuFig' + i, 'additionalFigure');

            freeCellAddHandlers(td);
            // append Additional to subseqString
            subseqString += (additionalFig.max ? '"@L" L ' : 'X ');

            prevSub = sub;
        }
    });

    // add 'new subsequence' block
    var tr = document.createElement('tr');
    table.appendChild(tr);
    var td = freeCell(sub, 1, 1);
    freeCellAddHandlers(td);
    tr.appendChild(td);
    td.innerHTML = (sub === 1) ? userText.dropFigureHere : userText.newCopySubsequence;
    td.classList.add('fuNewSub');

    // mark figures in fuFiguresTable
    (figureLetters + (additionalFig.max ? 'L' : 'X')).split('').forEach (l => {
        let td = $('fu' + l);
        // check if td exists to prevent failing ungracefully
        if (td) {
            td.classList.value = ''; // Clear all classes
            let match = sequenceText.innerText.match(RegExp(`"@${l}"`, 'g'));
            if (match) {
                td.classList.add('figUsed');
                if (l === 'L') {
                    td.firstChild.innerHTML = `${userText.additional}<br />${match.length}x`;
                }
                if (match.length > ((l === 'L' && additionalFig.max) ? additionalFig.max : 1)) {
                    td.classList.add('figUsedMulti');
                }
            } else if (l === 'X') {
                td.classList.add('figUsed');
                // set Free figure defaults. Should be overridden by rules
                let freeFigMin = 5;
                let freeFigMax = 5;
                if (activeRules && checkCatGroup && checkCatGroup.basefig) {
                    freeFigMin = checkCatGroup.basefig.min - figureLetters.length;
                    freeFigMax = checkCatGroup.basefig.max - figureLetters.length;
                }
                if ((freeFigures < freeFigMin) || (freeFigures > freeFigMax)) {
                    td.classList.add('figUsedMulti');
                }
                td.firstChild.innerHTML = `${userText.free}<br />${freeFigures} / ${freeFigMax}`;
            } else if (l === 'L') td.firstChild.innerHTML = userText.additional;
        }
    });
}

// makeFormDescription creates a form that contains the figures
// in describing text form. Can be used by a caller
function makeFormDescription(svg) {
    var text = '<div style="width: 800px;height: 990px;column-count: 3;">';
    figures.forEach ((f) => {
        if (f.aresti) {
            text += '<div style="break-inside: avoid;"><strong>Figure ' + f.seqNr + '</strong><ol>';
            f.description.forEach ((d) => { text += '<li>' + d + '</li>'; });
            text += '</ol></div>';
        }
    });
    text += '</div>';
    drawTextArea(text, 0, 0, 800, 990, 'formATextLarge', 'textBox', svg);
    addFormElementsGrid(svg);
}

// addFormElements adds wind & mini form A and adjusts size
function addFormElements(form) {
    // Find out how big the SVG has become and adjust margins
    var
        bBox = SVGRoot.getElementById('sequence').getBBox(),
        x = parseInt(bBox.x),
        y = parseInt(bBox.y) - 40,
        w = parseInt(bBox.width),
        h = parseInt(bBox.height);

    // miniFormA and windArrow are handled differently on screen than on print/save
    if ($('sequenceArea').classList.contains('screen')) {
        makeMiniFormAScreen();
        // Add a transparent rectangle around the figure on screen to
        // prevent rescaling when handles are shown on a selected figure
        if ($('showHandles').checked && (/^[BC]/.test(activeForm))) {
            SVGRoot.getElementById('sequence').childNodes.forEach (group => {
                let bBox = group.getBBox();
                drawRectangle (
                    bBox.x - (platform.touch ? 16 : 8),
                    bBox.y - 20,
                    bBox.width + (platform.touch ? 48 : 24),
                    bBox.height + (platform.touch ? 32 : 32),
                    'stroke: none; fill: none'
                );
            });
        }
    } else {
        // Add mini Form A, but only to Form B or C when miniFormA is set
        if (/^[BC]/.test(form) && miniFormA) {
            var miniFormASize = makeMiniFormA((w + x) + 20, y + 50, miniFormA === 'tiny');
        }

        // Draw wind arrow on Form B and C
        if (/^B/.test(form)) {
            drawWind((w + x) + (miniFormA ? miniFormASize.width + 20 : 0), y, 1);
        } else if (/^C/.test(form)) {
            drawWind(x, y, -1);
        }
    }

    // Set optimal sequence area size and check if the sequence is not exceeding it
    // SmallMobile code is not working correctly yet in 2023.1.1. Keep for later update.
    if ($('showOptiSeqArea').checked && /^[BC]/.test(form) && !platform.smallMobile) {
        const
            optArea = $('optimalSequenceArea'),
            optWidth = (formStyle == 'civa') ? 561 : 605,
            optHeight = (formStyle == 'civa') ? 1080 : 1090,
            scaleSvg = platform.smallMobile ? Math.min((window.innerWidth - 8) / (w + 5), 2) : 1;

        optArea.classList.remove('noDisplay');
        optArea.style.width = `${optWidth * scaleSvg}px`;
        optArea.style.height = `${optHeight * scaleSvg}px`;
        if (w > optWidth || h > optHeight) {
            optArea.classList.add('exceeded');
        } else optArea.classList.remove('exceeded');
    }

    setSeqViewBox();
        
    // Resize svg if we are smallMobile, to a max factor 2
    // Do this with a tiny delay to allow miniFormA to draw and size
    // to be determined
    if (platform.smallMobile) {
        setTimeout(e => {
            const scaleSvg = platform.smallMobile ?
                Math.min((window.innerWidth - $('miniFormAContainer').getBoundingClientRect().width - 16) / (w + 5), 2) : 1;
            SVGRoot.setAttribute("width", scaleSvg * (w + 5));
            SVGRoot.setAttribute("height", scaleSvg * (h + 5));
        }, 1);
    }
}

// addAlertsToAlertMsgs adds an object provided by checkRules Worker
// to alertMsgs and alertMsgRules
function addAlertsToAlertMsgs(data) {
    data.alertMsgs.forEach ((a) => {
        alertMsgs.push(a);
        alertMsgRules[a] = data.alertMsgRules[a];
    });
}

// displayAlerts displays alert messages in the Alerts box
function displayAlerts() {
    var container = $('alerts');
    if (container) {
        // Clear any previous messages but make sure we don't remove the label (1 node)
        while (container.childNodes.length > 1) {
            container.lastChild.remove();
        }
        // sort messages alphabetically/by number. Specific figure messages
        // will be shown first as '(' comes before all letters
        // However, during sorting we change (x) to (0x) to assure figures
        // below 10 are shown before later figures
        alertMsgs.sort(function (a, b) {
            return (
                a.replace(/^\((\d[\),])/, '(0$1') < b.replace(/^\((\d[\),])/, '(0$1') ? -1 : 1
            );
        });
        // Add a message to the top to warn if no rules are loaded
        if (!activeRules) alertMsgs.unshift(userText.noRules);
        // Display messages
        alertMsgs.forEach ((a) => {
            var span = document.createElement('span');
            span.innerHTML = a;
            if (alertMsgRules[a]) {
                var div = document.createElement('div');
                div.innerHTML = alertMsgRules[a];
                span.appendChild(div);
                span.classList.add('alertMsgRule');
            }
            container.appendChild(span);
            // use <br> because sequence check log uses simple formatting
            container.appendChild(document.createElement('br'));
        });
        // Clear all alerts
        alertMsgs = [];
        alertMsgRules = {};
    }
}

// do some kind of draw

function draw() {
    rebuildSequenceSvg();
    // reset all drawing variables to default values
    // firstFigure is disabled in Free (Un)known designer
    firstFigure = (activeForm !== 'FU') ? true : false;
    Attitude = X = Y = 0;
    if (/^[CL]/.test(activeForm)) {
        goRight = false;
        setYAxisOffset(180 - yAxisOffsetDefault);
        Direction = 180;
    } else {
        goRight = true;
        setYAxisOffset(yAxisOffsetDefault);
        Direction = 0;
    }
    // get current numberInCircle setting
    //changeRollFontSize ($('rollFontSize').value);
    numberInCircle = $('numberInCircle').checked ? true : false;

    parseSequence();

    // By default, don't show optimalSequenceArea. Will be activated on form B and C
    $('optimalSequenceArea').classList.add('noDisplay');
    // Draw requested form
    switch (activeForm) {
        case 'A':
            makeFormA();
            break;
        case 'B':
        case 'B+':
        case 'R':
            makeFormB();
            break;
        case 'C':
        case 'C+':
        case 'L':
            makeFormC();
            break;
        case 'FU':
            makeFree();
            break;
        case 'D':
            break;
        default:
            makeFormGrid($('gridColumns').value,
                platform.smallMobile ? 240 * Math.sqrt($('gridColumns').value) : false);
    }

    // check if selectedFigure.id is still valid
    if (!figures[selectedFigure.id]) selectFigure(false);

    // Adjust position of mini Form A    
    adjustMiniFormAPosition();
}

// virtualKeyboard shows or hides the virtual keyboard for
// special keys for touch devices, except on small mobile
function virtualKeyboard(e) {
    e.hasfocus = (document.activeElement === sequenceText) ? true : false;
    if (platform.touch && platform.mobile && !platform.smallMobile) {
        if (document.activeElement === sequenceText) {
            $('virtualKeyboard').classList.remove('noDisplay');
        } else {
            $('virtualKeyboard').classList.add('noDisplay');
        }
    }
}

// clickVirtualKeyboard is called when one of the virtual keys is
// clicked
function clickVirtualKeyboard(e) {
    // remove blur handler until clicking complete
    sequenceText.removeEventListener('blur', virtualKeyboard);

    var key = e.target.textContent;
    if (key.length === 1) {
        e.target.classList.add('clicked');
        // always remove highlight after a second
        setTimeout(function () {
            e.target.classList.remove('clicked');
        }, 1000);

        var range = saveSelection(sequenceText);

        sequenceText.innerText = sequenceText.innerText.substring(0, range.start) +
            key + sequenceText.innerText.substring(range.end);
        checkSequenceChanged();

        range.start++;
        range.end = range.start;
        restoreSelection(sequenceText, range);
    }
}

// releaseVirtualKeyboard is called when the virtual keyboard key is
// released
function releaseVirtualKeyboard(e) {
    // restore blur handler
    sequenceText.addEventListener(
        'blur',
        virtualKeyboard,
        false);
    sequenceText.focus();
    e.target.classList.remove('clicked');
}

// updateSequenceText updates the sequence text and keeps caret location
function updateSequenceText(string) {
    if (document.activeElement === sequenceText) {
        // focussed, maintain caret position
        var
            range = saveSelection(sequenceText),
            selStart = range.start,
            selEnd = range.end;

        // remove all line breaks from the sequence input field
        sequenceText.innerHTML = string;

        // put caret back in correct place
        var
            range = document.createRange(),
            sel = window.getSelection();

        range.setStart(sequenceText.firstChild, selStart);
        range.setEnd(sequenceText.firstChild, selEnd);
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
function checkSequenceChanged(force) {
    var selStart = 0;

    if (document.activeElement === sequenceText) {
        var range = saveSelection(sequenceText);
        selStart = range.start;
    }

    if (/(\r\n|\n|\r)/gm.test(sequenceText.innerHTML)) {
        updateSequenceText(sequenceText.innerHTML.replace(/(\r\n|\n|\r)/gm, ' '));
    }

    var selectFigureId = false;

    // whenever the sequence is empty, clear the filename
    if (sequenceText.innerText == '') updateSaveFilename();

    // Prevent OpenAero from being left unintentionally
    if (activeSequence.text != sequenceText.innerText) {
        setSequenceSaved(false);
    }

    if ((activeSequence.text != sequenceText.innerText.replace(/\u00a0/g, ' ')) || (force === true)) {
        // reset sequence entry options
        updateSequenceOptions('');
        activeSequence.text = sequenceText.innerText.replace(/\u00a0/g, ' ');
        var string = activeSequence.text;

        // whenever the string is empty, consider it 'saved'
        if (string === '') setSequenceSaved(true);

        var
            figure = [],
            thisFigure = { 'string': '', 'stringStart': 0, 'stringEnd': 0 },
            inText = false;
            
        for (let i = 0; i <= string.length; i++) {
            if (string[i] == userpat.comment) inText = !inText;
            if (((string[i] === ' ') || (i === string.length)) && !inText) {
                if (thisFigure.string !== '') {
                    var match = thisFigure.string.match(regexMoveForward);
                    // Create a separate 'figure' for moveForward (x>) at the
                    // beginning of a figure.
                    // OLAN had it coupled to a figure but OpenAero keeps sequence
                    // drawing instructions separate
                    if (match) {
                        figure.push({
                            'string': match[0],
                            'stringStart': thisFigure.stringStart,
                            'stringEnd': (thisFigure.stringStart + match[0].length)
                        });
                        thisFigure.stringStart = thisFigure.stringStart + match[0].length;
                        thisFigure.string = thisFigure.string.replace(regexMoveForward, '');
                    }
                    // do the same for moveDown (x^)
                    var match = thisFigure.string.match(regexMoveDown);
                    if (match) {
                        figure.push({
                            'string': match[0],
                            'stringStart': thisFigure.stringStart,
                            'stringEnd': (thisFigure.stringStart + match[0].length)
                        });
                        thisFigure.stringStart = thisFigure.stringStart + match[0].length;
                        thisFigure.string = thisFigure.string.replace(regexMoveDown, '');
                    }
                    // only add figures that are not empty
                    if (thisFigure.string != '') {
                        figure.push({
                            'string': thisFigure.string,
                            'stringStart': thisFigure.stringStart,
                            'stringEnd': i
                        });
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
        activeSequence.previousFigures = JSON.parse(JSON.stringify(activeSequence.figures));

        // Now assign to activeSequence
        activeSequence.figures = figure;

        // Get current scroll position of the sequence
        var scrollPosition = SVGRoot ? SVGRoot.parentNode.scrollTop : 0;

        // Update activeSequence.xml and storage
        changeSequenceInfo();

        // Redraw sequence
        draw();

        // scale sequence if zoom is set on mobile
        if (platform.mobile && (activeForm !== 'FU')) {
            if (SVGRoot.getAttribute('width') && SVGRoot.getAttribute('height')) {
                const zoom = parseInt($('zoom').textContent.match(/\d+/)[0]) / 100;
                SVGRoot.setAttribute('width', parseInt(SVGRoot.getAttribute('width')) * zoom);
                SVGRoot.setAttribute('height', parseInt(SVGRoot.getAttribute('height')) * zoom);
            }
        }

        // Select the correct figure when applicable
        if ((selectFigureId !== false) && (selectedFigure.id !== null)) {
            selectFigure(selectFigureId);
        }

        // Set the correct scroll position
        if (SVGRoot) SVGRoot.parentNode.scrollTop = scrollPosition;

        // Update figure editor when a figure is being edited
        if (selectedFigure.id !== null) updateFigureEditor();

        // Update marking of figures in figure selector when active
        if ($('figureSelector') && $('figureSelector').classList.contains('active')) {
            markFigures();
        }
    } else if (document.activeElement === sequenceText) {
        // when no change was made, just check where the caret in the
        // sequence text is and when necessary change selected figure
        for (let i = 0; i < figures.length; i++) {
            if ((selStart >= figures[i].stringStart) && (selStart <= figures[i].stringEnd)) {
                if (figures[i].aresti) {
                    selectFigureId = i;
                }
                break;
            }
        }
        if (selectFigureId != selectedFigure.id) {
            selectFigure(selectFigureId);
        }
    }
}

// selectForm selects which Form to show
function selectForm(form) {
    activeForm = form;
    rulesWorker.postMessage({ action: 'activeForm', form: form });
    updateDefaultView();
    // always do a full redraw of the form and figure editor as these may
    // change when switching to or from Grid view
    checkSequenceChanged(true);

    if (selectedFigure.id) updateFigureEditor();
    if (platform.smallMobile) selectTab('tab-sequenceArea');
    setFormLayout(form);
    selectFigure(false);
    adjustMiniFormAPosition();
}

// setFormLayout sets the correct layout for each Form view
function setFormLayout(form) {
    ['A', 'B', 'C', 'FU', 'G'].forEach(f => {
        if (f != form) $('mainOverlay').classList.remove(f); else $('mainOverlay').classList.add(f);
    });
    if (/^G/.test(form)) {
        $('moveControls').classList.add('hidden');
        $('rotateControls').classList.remove('hidden');
    } else {
        $('moveControls').classList.remove('hidden');
        $('rotateControls').classList.add('hidden');
    }
    if (/^G/.test(form) && !platform.smallMobile) {
        $('gridInfo').classList.remove('hidden');
    } else if (form === 'A' && platform.smallMobile) {
        SVGRoot.style = 'width: 280vw; height: auto;';
    } else {
        $('gridInfo').setAttribute('style', '');
        $('gridInfo').classList.add('hidden');
    }
}

// flyingMode switches the view to Flying mode
function flyingMode() {
    const drawForms = $('mainOverlay').classList.contains ('C') ? ['B', 'C'] : ['C', 'B'];
    $('flyingModeTop').appendChild($('t_windArrow'));
    $('flyingMode').classList.remove('flyingModeHidden');
    drawForms.forEach (form => {
        selectForm(form);
        // Clear sequence svg
        rebuildSequenceSvg();
        // Add only the figures
        figures.forEach ((f, i) => { if (f.paths.length) drawFullFigure(i); });
        // Change the viewBox to make the sequence fit
        let
            bBox = SVGRoot.getElementById('sequence').getBBox(),
            x = parseInt(bBox.x),
            y = parseInt(bBox.y),
            w = parseInt(bBox.width),
            h = parseInt(bBox.height);
        SVGRoot.setAttribute("viewBox",
            (x - 3) + ' ' + (y - 3) + ' ' + (w + 5) + ' ' + (h + 5));
        $('flyingModeSequence').appendChild(SVGRoot.cloneNode(true));
        $('flyingModeSequence').lastChild.id = 'flyingModeSequenceForm' + form;
    });
    activeForm = 'F';
    // start keep awaking (Cordova only)
    if (window.plugins && window.plugins.insomnia) window.plugins.insomnia.keepAwake();
}

// switchWindArrow switches the wind direction
function switchWindArrow() {
    if (activeForm == 'F') {
        $('flyingModeSequence').style = 'transform: rotateY(90deg)';
        setTimeout(() => {
            $('mainOverlay').classList.toggle('B');
            $('mainOverlay').classList.toggle('C');
            $('flyingModeSequence').style = ''
        }, 150);
    } else {
        selectForm(activeForm == 'B' ? 'C' : 'B');
    }
}

// exitFlyingMode exits the Flying mode
function exitFlyingMode() {
    // stop keep awaking (Cordova only)
    if (window.plugins && window.plugins.insomnia) window.plugins.insomnia.allowSleepAgain();
    // switch to normal view
    selectForm($('mainOverlay').classList.contains('C') ? 'C' : 'B');
    $('optimalSequenceArea').after($('t_windArrow'));
    $('flyingMode').classList.add('flyingModeHidden');
    // clear sequences after timeout
    setTimeout(function () { $('flyingModeSequence').innerHTML = '' }, 500);
}
// updateDefaultView updates the hidden defaultView value
function updateDefaultView(queue) {
    const el = $('default_view');
    if (queue) {
        el.value = 'queue';
    } else {
        if (/^G/.test(activeForm)) {
            el.value = 'grid:' + $('gridColumns').value;
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
function clearSequence() {
    function clear() {

        if (activeForm !== 'FU') {
            // activate empty sequence
            activateXMLsequence();
            // set OpenAero version for saving
            $('oa_version').value = version;
            updateDefaultView();
        } else {
            sequenceText.innerText = 'eu';
            checkSequenceChanged();
            displayAlerts();

            setSequenceSaved(true);
        }

    }

    if (!sequenceSaved) {
        confirmBox(userText.sequenceNotSavedWarning,
            userText.clearSequence, clear);
    } else {
        clear();
    }
}

// openLogoFile will load a logo from a file
function openLogoFile(evt) {
    hideLogoChooser();
    if (evt.dataTransfer) {
        // file dropped
        noPropagation(evt);
        openFile(evt.dataTransfer.files[0], 'Logo');
    } else {
        // get files from file input
        openFile(this.files[0], 'Logo');
        // clear for next
        this.parentNode.reset();
    }
}

// programme will load a programme
function programme() {
    var key = this.id.replace(/^programme-/, '');
    OLAN.bumpBugCheck = false;
    updateSaveFilename();
    if (/^<sequence>/.test(library[key])) {
        activateXMLsequence(library[key]);
    } else {
        if (!launchURL({ 'url': library[key] })) {
            console.log('Error loading programme ' + key);
        }
    }
}

// dropSequence will attempt to load a sequence from a file dropped in
// the main area
function dropSequence(evt) {
    if (evt && evt.dataTransfer && evt.dataTransfer.files &&
        evt.dataTransfer.files[0]) {
        noPropagation(evt);
        openSequence(evt);
    }
}

// openSequence will load a sequence from a .seq file
function openSequence(evt) {
    function open(e) {
        openFile(e, 'Sequence');
    }

    var e = evt && evt.dataTransfer && evt.dataTransfer.files &&
        evt.dataTransfer.files[0] ?
        evt.dataTransfer.files[0] :
        $('file').files[0];
    // Check if the current sequence was saved. If not, present a dialog
    if (!sequenceSaved) {
        confirmBox(userText.sequenceNotSavedWarning,
            userText.openSequence, () => { open(e) });
    } else open(e);
}

// openSequence will load a sequence from a .seq file
function openQueue() {
    openFile($('queue').files[0], 'Queue');
    // Clear file field to enable loading the same file again
    $('queueForm').reset();
}

// openRulesFile will load a rules file from a .js file
function openRulesFile() {
    openFile($('rulesFile').files[0], 'RulesFile');
    // Clear file field to enable loading the same file again
    $('rulesFileForm').reset();
}

// openFile is called to open a file
// file    = file object from file input element
// handler = name of correct handler to execute after loading. Function
//           names are loaded<handler>
// params  = parameters, if any
function openFile(file, handler, params) {
    if (file) {
        console.log('Reading file: ' + file.name);
        var reader = new FileReader();
        // Handle success, and errors. With onload the correct loading
        // function will be called
        switch (handler) {
            case 'FileList':
                reader.onload = function (e) { loadedFileList(e, params) };
                break;
            case 'Sequence':
                reader.onload = function (e) { loadedSequence(e, file.name) };
                break;
            case 'Queue':
                reader.onload = loadedQueue;
                break;
            case 'Logo':
                reader.onload = loadedLogo;
                break;
            case 'RulesFile':
                reader.onload = function (e) {
                    rulesWorker.postMessage(
                        { action: 'loadedRulesFile', lines: e.target.result })
                };
                break;
            case 'Styling':
                reader.onload = loadedStyling;
                break;
        }
        reader.onerror = errorHandler;
        if (handler === 'RulesFile') {
            reader.readAsText(file);
        } else reader.readAsDataURL(file);
    }
}

// removeFileListFile removes a file from fileList
function removeFileListFile(el, callback) {
    var id = el.id.replace(/^removeFileListFile/, '');
    var container = el.parentNode.parentNode;
    fileList.splice(id, 1);
    // we need to rebuild because splice changes the indexes
    clearFileListContainer(container);
    fileList.forEach ((f, i) => { addToFileList(i, container, callback); });
}

// checkMultiDialog shows or hides the multiple sequence check dialog
// when false, the dialog is closed
function checkMultiDialog(show) {
    // hide all menus
    menuInactiveAll();

    if (show) {
        // clear the file list
        fileList = [];
        multi.processing = false;
        clearFileListContainer($('fileDropFiles'));
        $('t_checkSequences').classList.add('disabled');
        $('checkMulti').classList.remove('noDisplay');
        $('multiCurrentRules').innerHTML = activeRules ? activeRules.description.replace(/ /g, '&nbsp;') : userText.none;
    } else {
        $('checkMulti').classList.add('noDisplay');
    }
}

// clearFileListContainer is called to clear file list containers
function clearFileListContainer(container) {
    removeChildNodes(container);
    // make sure we remove all els with fileListFileRemove class
    document.querySelectorAll('fileListFileRemove').forEach(e => e.remove());
}

// updateFileList is called by updateCheckMulti and updatePrintMulti to
// update the fileList object
// evt      = where the files come from
// el       = the element that holds the file list
// callback = called on changes
function updateFileList(evt, el, callback) {
    if (evt) {
        if (evt.dataTransfer) {
            noPropagation(evt);
            var files = evt.dataTransfer.files; // FileList object.
        } else {
            // get files from file element
            var files = evt.files;
            // clear for next, after short wait
            setTimeout(function () { evt.parentNode.reset(); }, 400);
        }
        for (let i = 0; i < files.length; i++) {
            (function () {
                // check if the file is not already in fileList
                for (let j = 0; j < fileList.length; j++) {
                    // check for lastModfiedDate, name and size as full path is not
                    // available
                    if ((files[i].lastModifiedDate.toString() === fileList[j].lastModifiedDate.toString()) &&
                        (files[i].name === fileList[j].name) &&
                        (files[i].size === fileList[j].size)) {
                        console.log('Duplicate, not adding: ' + fileList[j].name);
                        return;
                    }
                }
                openFile(
                    files[i],
                    'FileList',
                    {
                        'callback': callback,
                        'container': el,
                        'file': files[i]
                    }
                );
            })();
        }
    }
}

// loadedFileList is called when a file for fileList is loaded
function loadedFileList(e, params) {
    loadSequence(e.target.result, function (sequence) {
        // only add to fileList when a valid sequence was detected
        if (sequence) {
            params.file.sequence = sequence;
            fileList.push(params.file);
            addToFileList(fileList.length - 1, params.container, params.callback);
        } else {
            alertBox(userText.multiNoSequence);
        }
    });
}

// addToFileList is called to add a file to a file list
// id        = id of fileList element
// container = where the div will be put
// callback  = function to execute on changes
function addToFileList(id, container, callback) {
    if (!callback) callback = function () { };
    // build and add div
    var div = document.createElement('div');
    var i = document.createElement('i');
    i.classList.add('fileListFileRemove', 'material-icons');
    i.id = 'removeFileListFile' + id;
    i.innerHTML = 'close';
    i.addEventListener('mousedown', () => {
        removeFileListFile(this, callback);
        callback();
    }, false);
    div.appendChild(i);
    var name = document.createTextNode(fileList[id].name);
    div.appendChild(name);
    container.appendChild(div);
    callback();
    // adjust image size for saving
    saveImageSizeAdjust();
}

// updateCheckMulti is called after dragging & dropping files to check
// multi field or adding files with file chooser
function updateCheckMulti(evt) {
    updateFileList(evt, $('fileDropFiles'), () => {
        if (fileList.length) {
            $('t_checkSequences').classList.remove('disabled');
        } else $('t_checkSequences').classList.add('disabled');
    });
}

// updatePrintMulti is called after dragging & dropping files to print
// multi field or adding files with file chooser
function updatePrintMulti(evt) {
    updateFileList(evt, $('fileDropPrintFiles'));
}

// checkMulti is called to open multiple files for checking.
function checkMulti() {
    if (this.classList.contains('disabled')) return;

    // save active sequence
    multi.savedSeq = activeSequence.xml;
    multi.processing = 'check';

    infoBox(
        '<span id="checkMultiCounter"></span>',
        userText.checkMulti);

    // hide dialog screen
    checkMultiDialog();

    // go through the selected files
    checkSequenceMulti(document.createElement('body'));
}

// checkSequenceMulti will be called when a sequence file has been
// loaded for multiple sequence checking
function checkSequenceMulti(body) {
    $('checkMultiCounter').innerHTML = sprintf(
        userText.checkMultiCounter, fileList[0].name, fileList.length);

    console.log('Checking: ' + fileList[0].name);
    // create log entry
    var pre = document.createElement('pre');
    body.appendChild(pre);
    pre.appendChild(document.createTextNode('File: ' + fileList[0].name + '\n'));

    if (fileList[0].sequence) {
        activateXMLsequence(fileList[0].sequence, true);

        var callback = function (data) {
            // clear any alert boxes. Errors are shown in the log.
            alertBox();
            // add alerts created by Worker and display them in the alerts area
            addAlertsToAlertMsgs(data);
            displayAlerts();

            if ($('multiFullLog').checked) {
                // full expanded log
                data.log.forEach ((l) => {
                    pre.appendChild(document.createTextNode(l + '\n'));
                });
            } else {
                // concise log

                // get alerts from alert area
                var div = document.createElement('div');
                div.innerHTML = $('alerts').innerHTML;
                // remove label
                div.firstChild.remove();

                if (div.innerHTML == '') {
                    if (activeRules) {
                        pre.appendChild(document.createTextNode('Rules: ' + activeRules.description + '\n'));
                        pre.appendChild(document.createTextNode(userText.sequenceCorrect + '\n'));
                    } else {
                        pre.appendChild(document.createTextNode(userText.noRules + '\n'));
                    }
                } else {
                    if (activeRules) {
                        pre.appendChild(document.createTextNode('Rules: ' + activeRules.description + '\n'));
                    }
                    body.appendChild(div);
                }
            }
            // add delimiter
            var delimiter = document.createElement('pre');
            body.appendChild(delimiter);
            delimiter.appendChild(document.createTextNode(
                '\n--------------------------------------------------------\n'));

            // check next file or finalize
            fileList.shift();
            if (fileList.length) {
                checkSequenceMulti(body);
            } else {
                // show the check result window
                alertBox('<div id="logBox">' + body.innerHTML + '</div>',
                    userText.sequenceCheckLog,
                    [{
                        'name': 'copyClipboard', 'function': function () {
                            window.getSelection().selectAllChildren($('logBox'));
                            document.execCommand('copy');
                            alertBox();
                        }
                    }]
                );
                window.getSelection().selectAllChildren($('logBox'));
                // clear "wait" message
                infoBox();

                // restore saved sequence. First unload rules to make sure
                // reference sequence is correctly loaded from rules
                rulesWorker.postMessage({ action: 'unloadRules' });
                activateXMLsequence(multi.savedSeq);

                multi.processing = false;
            }
        }

        // Give sequence half a second to load, then...
        setTimeout(function () {
            // Activate the loading of the checking rules (if any)
            if ($('multiOverrideRules').checked) {
                // use rules currently set
                checkRules(callback);
            } else {
                // use rules from file
                changeCombo('program', callback);
            }
        }, 500);
    }
}

/***********************************************************************
 *
 * Sequence file handling
 *
 **********************************************************************/

// loadedSequence will be called when a sequence file has been loaded
function loadedSequence(evt, name) {
    // Obtain the read file data
    loadSequence(evt.target.result, function (xml) {
        if (xml === false) {
            alertBox(userText.notSequenceFile);
            return;
        }

        updateSaveFilename(name.replace(/.*\\/, '').replace(/\.[^.]*$/, ''));

        activateXMLsequence(xml, true);

        // update the sequence if OLAN.sequence was true
        if (OLAN.sequence) {
            OLAN.sequence = false;
            activeSequence.text = '';
            checkSequenceChanged();
        }

        // Activate the loading of the checking rules (if any)
        changeCombo('program', checkFuFiguresFile);

        setSequenceSaved(true);
    });
}

// loadedQueue will be called when a queue file has been loaded
function loadedQueue(evt) {
    // Obtain the read file data
    loadSequence(evt.target.result, function (fileString) {
        if (fileString === false) return;

        // save current sequence
        var sequence = activeSequence.xml;

        // clear queue
        for (let i = fig.length - 1; i >= 0; i--) {
            if (fig[i]) {
                if (fig[i].group == 0) {
                    delete fig[i];
                } else break;
            }
        }
        // put the figures in the queue
        activateXMLsequence(fileString);

        figures.forEach ((f, i) => {
            if (f.aresti) {
                selectedFigure.id = i;
                addToQueue(false);
            }
        });

        // restore previous sequence or start with empty
        activateXMLsequence(sequence);
        // show queue
        showQueue();
    });
}

// loadedSequence will be called when a sequence file has been loaded
function loadedSequenceWindows(text, name) {
    // Obtain the read file data
    loadSequence(text, function (xml) {
        if (xml === false) {
            alertBox(userText.notSequenceFile);
            return;
        }

        if (name) {
            updateSaveFilename(name.replace(/.*\\/, '').replace(/\.[^.]*$/, ''));
        }

        activateXMLsequence(xml, true);

        // update the sequence if OLAN.sequence was true
        if (OLAN.sequence) {
            OLAN.sequence = false;
            updateSequence(-1, '');
            activeSequence.text = '';
            checkSequenceChanged();
        }

        setSequenceSaved(true);

        // Activate the loading of the checking rules (if any)
        changeCombo('program', checkFuFiguresFile);
    });
}

// loadSequence loads a sequence file and does some checks. Callback
// is executed with an XML sequence or false
function loadSequence(fileString, callback) {
    // Check if we have an OLAN sequence or an OpenAero XML sequence.
    // If the sequence file starts with '<sequence', assume it's an XML
    // sequence.
    // If it does the same from steg decode, assume it's XML
    // If it starts with '[', assume it's an OLAN sequence.
    // In all other cases throw an error.
    try {
        if (/^data:image\/png/.test(fileString)) {
            var image = new Image();
            image.src = fileString;
            image.onload = function () {
                var string = steg.decode(image);
                if (string.match(/^<sequence/)) {
                    // this is an OpenAero sequence, no need to do OLAN checks
                    OLAN.bumpBugCheck = false;
                    callback(string);
                    return;
                } else {
                    console.log('*** ' + userText.notSequenceFile);
                    callback(false);
                }
            }
            return;
        } else {
            // if needed, decode from base64
            if (/^data:/.test(fileString)) {
                fileString = decodeURIComponent(escape(atob(
                    fileString.replace(/^data:.*;base64,/, ''))));
            }

            if (/^<sequence/.test(fileString)) {
                // this is an OpenAero sequence, no need to do OLAN checks
                OLAN.bumpBugCheck = false;
                callback(fileString);
                return;
            }
            if (fileString.charAt(0) === '[') {
                // OLAN sequence, transform to XML
                callback(OLANtoXML(fileString));
                return;
            }
        }
    } catch (err) { console.log(err) }

    console.log('*** ' + userText.notSequenceFile);
    callback(false);
}

// OLANtoXML transforms an OLAN file to OpenAero XML
function OLANtoXML(string) {
    OLAN.sequence = true;
    var activeKey = false;
    var lines = string.split('\n');
    string = '<sequence>';
    lines.forEach ((l) => {
        // remove Windows linebreak
        l = l.replace('\r', '');
        // check for key match
        if (l.match(/^\[[a-zA-Z]+\]$/)) {
            var key = l.toLowerCase().replace(/[^a-z]/g, '');
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
        } else if (activeKey) {
            // Add the value, but make sure to escape XML special characters
            string += l
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    });
    if (activeKey) string += '</' + activeKey + '>';
    // end with current oa_version to prevent some error messages
    string += '<oa_version>' + version + '</oa_version></sequence>';
    OLAN.bumpBugCheck = true;

    return string;
}

// activateXMLsequence will make a sequence provided as XML active
// it returns true on succes and false on failure
function activateXMLsequence(xml, noLoadRules) {
    var freeUnknownSequence = '';

    // make sure no figure is selected
    if (selectedFigure.id !== null) selectFigure(false);

    // unlock sequence when locked
    if ($('lock_sequence').value) lockSequence();

    // clear previous values
    sequenceXMLlabels.forEach ((l) => {
        if ($('lockContest').classList.contains('locked') &&
            ['location', 'date', 'logo', 'notes'].includes(l)) {
            // do nothing for contest elements when contest is locked
        } else {
            var el = $(l);
            if (el && ('value' in el)) el.value = ''; else if (el.innerText) el.innerText = '';
        }
    });
    if (!$('lockContest').classList.contains('locked')) {
        logoImg = false;
    }
    // set 'class' to powered by default to provide compatibility with OLAN
    // and older OpenAero versions
    sportingClass.value = 'powered';

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

        var pre1516Sequence = true;
        // Put every element in the correct field
        for (let ele in nodes) {
            if (nodes[ele].innerHTML) {
                if ($('lockContest').classList.contains('locked') &&
                    ['location', 'date', 'logo', 'notes'].includes(nodes[ele].nodeName.toLowerCase())) {
                    // do nothing for contest elements when contest is locked
                } else {
                    // translate escape characters by browser through myTextArea
                    myTextArea.innerHTML = nodes[ele].innerHTML;
                    // e will be the field, only put a value when it exists
                    var e = $(nodes[ele].nodeName.toLowerCase());
                    if (e) {
                        if ('value' in e) {
                            if (typeof e.value === 'number') {
                                e.value = parseFloat(myTextArea.value || 0);
                            } else e.value = myTextArea.value || "";
                        } else if ('innerText' in e) e.innerText = myTextArea.value;
                    }
                    if (nodes[ele].nodeName.toLowerCase() === 'actype') {
                        pre1516Sequence = false;
                    }
                }
            }
        }

        // put actype and acreg in correct fields for pre 1.5.1.6
        // sequences
        if (pre1516Sequence) {
            $('actype').value = parseAircraft('type');
            $('acreg').value = parseAircraft('registration');
        }

        var prevForm = activeForm;
        // check for default_view
        var view = $('default_view').value;
        if (view) {
            view = view.split(':');
            switch (view[0]) {
                case 'grid':
                    $('gridColumns').value = view[1];
                    activeForm = 'G';
                    break;
                case 'queue':
                    activeForm = 'G';
                    break;
                case 'freeUnknown':
                    freeUnknownSequence = sequenceText.innerText;
                    sequenceText.innerText = $('fu_figures').value;
                    activeForm = 'FU';
                    break;
                default:
                    if (('ABC'.indexOf(view[0])) > -1) {
                        activeForm = view[0];
                    } else activeForm = 'B';
            }
        } else activeForm = 'B';

        setFormLayout(activeForm);

        var logo = $('logo').value;
        if (logoImages[logo]) selectLogo(logo); else removeLogo();

        checkOpenAeroVersion();
    }

    // hide Harmony field for powered
    var el = $('harmonyField');
    if (el) {
        if (sportingClass.value === 'powered') {
            el.classList.add('hidden');
            $('harmony').setAttribute('disabled', true);
        } else if (!activeRules) {
            // Activate for glider if no rules are active, otherwise should be set by rules
            el.classList.remove('hidden');
            $('harmony').removeAttribute('disabled');
        }
    }

    // set panel headers correctly
    panelHeader($('activeRules'));
    panelHeader($('activeContest'), userText.contest);

    // Load rules when applicable and update sequence data

    if (!noLoadRules) {
        // restore Reference sequence to previous value
        var refSeqEl = $('referenceSequenceString');
        refSeqEl.value = savedReference;
        refSeqEl.removeAttribute('disabled');
        $('t_referenceSequenceFixed').classList.add('noDisplay');
        rulesWorker.postMessage({
            action: 'loadRules',
            ruleName: getRuleName(),
            catName: $('category').value.toLowerCase(),
            programName: $('program').value.toLowerCase()
        });
    }

    // check if we are switching from a regular sequence to Free (Un)known
    // or vv. Make sure we do this after rules are loaded by passing
    // through rulesWorker
    var id = uniqueId();
    workerCallback[id] = function () {
        if ((activeForm === 'FU') && (prevForm !== 'FU')) {
            if (!startFuDesigner(true)) activeForm = prevForm;
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
            checkSequenceChanged();
        } else {
            // lock sequence when applicable
            if ($('lock_sequence').value) lockSequence(true);
        }
    }
    rulesWorker.postMessage({ action: false, callbackId: id });

    // The sequence is now fully loaded
    if (!noLoadRules) checkRules(checkFuFiguresFile);

    // sequence was just loaded, so also saved
    setSequenceSaved(true);

    return true;
}

// checkFuFiguresFile checks if:
// rules allow additionals AND figure letters are required AND
// sequence is not locked AND not processing multiple files
// If so, if it may be a Free (Un)known figures file and the user is
// asked if he wants to open it in the Free (Un)known Designer
function checkFuFiguresFile() {

    var l = figureLetters;
    if (
        l &&
        !$('lock_sequence').value &&
        !multi.processing) {
        for (let i = 0; i < figures.length; i++) {
            // when we find a figure without a letter, or with an incorrect
            // letter (including L), stop and return
            if (figures[i].aresti) {
                if (figures[i].unknownFigureLetter &&
                    (l.indexOf(figures[i].unknownFigureLetter) >= 0)) {
                    l = l.replace(figures[i].unknownFigureLetter, '');
                } else return;
            }
        }
        if (l === '') {
            // all letters used once, fill referenceSequence and ask question
            $('referenceSequenceDialog').classList.remove('noDisplay');
            var ref = $('referenceSequenceString');
            ref.value = '';
            // add figures including letter AND any sequence options (to make
            // sure direction changers work correctly)
            figures.forEach ((f) => {
                if (f.aresti && f.unknownFigureLetter &&
                    (f.unknownFigureLetter !== 'L')) {
                    ref.value += `"@${f.unknownFigureLetter}" ${f.string} `;
                } else if (regexSequenceOptions.test(f.string)) {
                    ref.value += f.string + ' ';
                }
            });
            changeReferenceSequence();
            $('referenceSequenceDialog').classList.add('noDisplay');

            confirmBox(
                userText[(additionalFig.max ? 'FUstartOnLoad' : 'FKstartOnLoad')],
                userText.openSequence + ' <span class="info" ' +
                'id="manual.html_free_unknown_designer">' +
                '<i class="material-icons info">info</i></span>',
                function () { startFuDesigner(true) }
            );
            $('manual.html_free_unknown_designer').addEventListener('mousedown',
                function () {
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
function checkOpenAeroVersion() {
    var
        oa_version = $('oa_version'),
        alerts = '';

    // before 1.2.3
    if (oa_version.value == '') {
        if (sequenceText.innerText != '') alerts += userText.warningPre123;
    }

    // before 1.2.4: check for bumps
    if (compVersion(oa_version.value, '1.2.4') < 0) {
        if (sequenceText.innerText.match(/p?bp?b/)) {
            alerts += userText.warningPre124;
        }
    }

    // before 1.3.7: check for flicks started from knife edge
    if (compVersion(oa_version.value, '1.3.7') < 0) {
        if (sequenceText.innerText.match(/((^|[^0-9])(4|[357]4?))[if\.'`]*[,;][\.'`]*[357]i?f/)) {
            alerts += userText.warningPre137;
        }
    }

    // before 2016.1:
    // check for double bumps with enlarged radius and rolls on the
    // first and second line, where the first roll is of uneven quarters
    if (compVersion(oa_version.value, '2016.1') < 0) {
        if (sequenceText.innerText.match(/B/)) {
            var f = sanitizeSpaces(sequenceText.innerText).split(' ');
            for (let i = 0; i < f.length; i++) {
                // remove comments
                f[i] = f[i].replace(regexComments, '');
                // only keep specific characters, and convert ; to ,
                f[i] = f[i].replace(/[^\d,;B\(\)]/g, '').replace(/;/g, ',');
                // convert all non-quarter rolls to 'r'
                f[i] = f[i].replace(/(48|88|128|168|24|44|64|84|22|32|42|2|1|9)/g, 'r');
                // convert remaining rolls to 'q' and remove ,
                f[i] = f[i].replace(/\d+/g, 'q').replace(/,/g, '');
                // check for correct match
                if (f[i].match(/^(q|qr|rq)B+\([qr]/)) {
                    alerts += userText.warningPre20161;
                    break;
                }
            }
        }
    }

    // before 2016.1.1:
    // remove all figures that end with " but do not start with ".
    // Older OpenAero versions would just disregard those
    if (compVersion(oa_version.value, '2016.1.1') < 0) {
        while (sequenceText.innerText.match(/(^| )[^" ]+"[^"]*"( |$)/)) {
            sequenceText.innerText = sequenceText.innerText.replace(/(^| )[^" ]+"[^"]*"( |$)/, ' ');
        }
        // check for X-Y direction changers when loading as Grid
        if ($('default_view').value.match(/^grid:\d+$/) &&
            sequenceText.innerText.match(/[a-zA-Z][^ ]*[>^]/)) {
            alerts += userText.warningPre201611;
        }
    }

    // before 2019.2:
    // check for figures 1.2.11.x and 1.2.12.x which were incorrect before 2019.2
    // fix figures where necessary and present warning
    if (compVersion(oa_version.value, '2019.2') < 0) {
        // remove any irrelevant parts, including full rolls, and match
        if (sequenceText.innerText.replace(/[^\dzt ]|1|22|44|88|9|42|84|168/g, '').match(/\dzt/)) {
            // basic check passed, now check thoroughly and correct
            checkSequenceChanged();
            var s = false;
            figures.forEach ((f, i) => {
                if (f.aresti && f.aresti[0].match(/1\.2\.1[12]/)) {
                    s = f.string;
                    var m = s.match(/(zt[^-]*)(-+)/);
                    if (m) {
                        s = s.replace(m[0], m[1] + Array(m[2].length).join('+'));
                    } else {
                        m = s.match(/(zt[^\+]*)(\++)/);
                        if (m) {
                            s = s.replace(m[0], m[1] + Array(m[2].length + 2).join('-'));
                        } else s += '-';
                    }
                    updateSequence(i, s, true);
                }
            });
            if (s) alerts += userText.warningPre20192;
        }
    }

    // add any additional checks here
    // compVersion can be used to check against specific minimum versions

    // check if running OpenAero version is older than that of the
    // sequence, but only check the first two version parts. So checking
    // version 2016.2.1 against 2016.2.2 would not trigger the warning
    if (compVersion(oa_version.value, version, 2) > 0) {
        alerts += userText.warningNewerVersion;
    }

    if ((alerts != '') && !multi.processing) {
        // don't show when processing multiple files
        alertBox(alerts + userText.warningPre);
    }
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
function compVersion(v1, v2, parts) {
    if (!v1) return -1;
    if (!v2) return 1;
    var subV1 = v1.split('.');
    var subV2 = v2.split('.');
    var count = (subV1.length > subV2.length) ? subV1.length : subV2.length;
    if (parts && (parts < count)) count = parts;
    // pad zeroes
    while (subV1.length < count) subV1.push(0);
    while (subV2.length < count) subV2.push(0);

    for (let i = 0; i < count; i++) {
        if (i >= subV1.length) return -1;
        if (i >= subV2.length) return 1;
        if (parseInt(subV1[i]) < parseInt(subV2[i])) return -1;
        if (parseInt(subV1[i]) > parseInt(subV2[i])) return 1;
    }
    return 0;
}

// loadedLogo will be called when a logo image has been loaded
function loadedLogo(evt) {
    // check file for maximum size due local storage on mobile
    if (platform.mobile && (evt.loaded > 1048576)) {
        alertBox(userText.logoFileTooLarge);
        return;
    }
    getLocal('logoImages', function (privateLogoImages) {
        privateLogoImages = JSON.parse(privateLogoImages) || {};
        // check if this logo already existed
        for (let key in privateLogoImages) {
            if (privateLogoImages[key] === evt.target.result) {
                selectLogo(key);
                return;
            }
        }
        // logo did not exist yet, create new
        var t = (new Date()).getTime();
        privateLogoImages[t] = logoImages[t] = evt.target.result;
        storeLocal('logoImages', JSON.stringify(privateLogoImages));
        selectLogo(t);
    });
}

// sanitizeFileName assures fileName does not contain illegal
// characters
function sanitizeFileName(fname) {
    var
        illegalRe = /[\/\?<>\\:\*\|":]/g,
        controlRe = /[\x00-\x1f\x80-\x9f]/g,
        reservedRe = /^\.+$/,
        windowsReservedRe = /^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i;

    var sanitized = fname
        .replace(illegalRe, '')
        .replace(controlRe, '')
        .replace(reservedRe, '')
        .replace(windowsReservedRe, '');
    return (sanitized.substring(0, 255));
}

// updateSaveFilename gets called when the "Save as" filename is changed
function updateSaveFilename(fname) {
    // make sure the filename is legal
    fname = fname ? sanitizeFileName(fname) : '';
    $('dlTextField').value = fileName.innerText = fname;
    storeLocal('fileName', fname);
}

// waitForIO waits for file IO
function waitForIO(writer, callback) {
    // set a watchdog to avoid eventual locking:
    var start = Date.now();
    // wait for a few seconds
    var reentrant = function () {
        if (writer.readyState === writer.WRITING && Date.now() - start < 4000) {
            setTimeout(reentrant, 100);
            return;
        }
        if (writer.readyState === writer.WRITING) {
            console.error("Write operation taking too long, aborting!" +
                " (current writer readyState is " + writer.readyState + ")");
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
function saveFile(data, name, ext, filter, format, param={}) {
    // Set saving result to true always as we currently have no method of
    // knowing whether the file was saved or not
    var result = true;

    // convert base64 to binary
    if (format.match(/;base64$/)) {
        var byteC = atob(data);
        var byteN = new Array(byteC.length);
        for (let i = 0; i < byteC.length; i++) {
            byteN[i] = byteC.charCodeAt(i);
        }
        data = new Uint8Array(byteN);
    }

    saveData.blob = new Blob([data], { type: format.replace(/;.+$/, '') });
    saveData.ext = ext;

    // depending on platform we choose a method for
    // saving the file with the following preference:
    // 1) Use Windows.Storage for Windows UWP
    // 2) Use "download" attribute
    // 3) Ask user to right-click and "Save as"

    if (platform.uwp) {
        // 1) Windows UWP saving
        var savePicker = new Windows.Storage.Pickers.FileSavePicker();
        savePicker.suggestedStartLocation =
            Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        // Dropdown of file types the user can save the file as
        savePicker.fileTypeChoices.insert(filter.name, [filter.filter]);
        savePicker.suggestedFileName = name + ext;

        savePicker.pickSaveFileAsync().done(function (file) {
            if (file) {
                // Open the returned file in order to copy the data
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {
                    // Get the IInputStream stream from the blob object
                    var input = saveData.blob.msDetachStream();

                    // Copy the stream from the blob to the File stream
                    Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                        output.flushAsync().done(function () {
                            //if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
                            // update filename, except for zipped figure files
                            if (ext != '.zip') updateSaveFilename(file.name.replace(/\.[^.]*$/, ''));
                            if (ext === '.seq') setSequenceSaved(true);
                            //} else {
                            //	result = false;
                            //}
                            input.close();
                            output.close();
                        });
                    });
                });
            } else {
                // saving was cancelled
                result = false;
            }
        });
        return result;
    } else if (platform.cordova) {
        saveDialog(' ', name, ext, param);
    } else if (platform.ios) {
        saveDialog(userText.iOSsaveFileMessage, name, ext, param);
    } else {
        saveDialog(userText.downloadHTML5, name, ext, param);
    }

    return result;
}

// saveSequence will save a sequence to a .seq file
// the .seq file is standard xml
function saveSequence() {
    function save() {
        var fname = activeFileName() || 'sequence';

        // take the original sequence XML,
        // remove the end tag, add figure XML and add the end tag again.
        // Then beautify the output.
        var xml = activeSequence.xml.replace('</sequence>', '');
        // check if the alerts box contains no alerts. If so, add verified
        // tag
        if (activeRules &&
            ($('alerts').childElementCount < 2)) {
            xml += '<verified>' + activeRules.description + '</verified>';
        }
        xml += buildFigureXML();
        xml += buildSettingsXML();
        xml += '</sequence>';
        xml = vkbeautify.xml(xml);
        saveFile(
            xml,
            fname,
            '.seq',
            { 'name': 'OpenAero Sequence', 'filter': '.seq' },
            'text/xhtml+xml;utf8'
        );
    }

    missingInfoCheck(save);
}

// saveQueue will save the current queue to a .seq file
// the .seq file is standard xml
function saveQueue() {
    var sequenceString = sequenceText.innerText;
    var queueFigs = [];
    for (let i = fig.length - 1; i >= 0; i--) {
        if (fig[i]) {
            if (fig[i].group == 0) {
                queueFigs.push(fig[i].string);
            } else break;
        }
    }
    if (queueFigs.length == 0) {
        alertBox(userText.queueEmpty);
        return;
    }
    // put queue figures in sequence for saving
    sequenceText.innerText = queueFigs.join(' // ');
    updateDefaultView(true);
    checkSequenceChanged();
    var fname = activeFileName('QUEUE');
    // Beautify the output.
    var xml = vkbeautify.xml(activeSequence.xml);
    saveFile(
        xml,
        fname,
        '.seq',
        { 'name': 'OpenAero Queue', 'filter': '.seq' },
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

// encodeBase64Url encodes string t to URL safe base64
function encodeBase64Url(t) {
    return btoa(t).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

// decodeBase64Url decodes URL safe base64 to string
function decodeBase64Url(t) {
    try {
        return atob(t.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (err) {
        return false;
    }
}

// compressSequence compresses the xml to minimize the size of the sequence link. Steps:
// - replace each sequenceXMLlabel and xml markup in the original xml
//   by a single character with code 128-159.
// - compress sequence_text (see explanation in code)
function compressSequence(xml) {
    var
        parser = new DOMParser(),
        xmlDoc = parser.parseFromString(xml, "text/xml"),
        result = "";

    if (sequenceXMLlabels.length > 31) {
        throw new Error('Compression will not work when there are more than 31 labels.');
    }

    sequenceXMLlabels.forEach ((l, i) => {
        var label = xmlDoc.getElementsByTagName(l);
        // Add label code and value to result if label value exists
        if (label && label[0]) {
            var labelValue = label[0].childNodes[0].nodeValue;
            result += String.fromCharCode(i + 128);
            if (l == 'sequence_text') {
                // Compress sequence_text by using the property that it hardly ever
                // contains characters with code > 127
                for (let j = 0; j < labelValue.length; j++) {
                    if (labelValue.charCodeAt(j) >= 128) {
                        // Characters with code >= 128 are preceded by code 255 and not compressed
                        result += String.fromCharCode(255) + labelValue[j];
                    } else if (labelValue.charCodeAt(j) > 31 &&
                        j < (labelValue.length - 1) &&
                        labelValue[j] === labelValue[j + 1]) {
                        // Compress double identical characters with code between 32 and 127 (most common).
                        // The pair fits in a single byte.
                        result += String.fromCharCode(labelValue.charCodeAt(j) + 128);
                        j++;
                    } else {
                        // Do not compress characters with code < 32 or non-repeating
                        result += labelValue[j];
                    }
                }
            } else result += labelValue;
        }
    });
    return result;
}


// saveAsURL provides a URL encoded sequence that the user can copy
// and then email, bookmark or whatever
function saveAsURL() {
    
    function save() {

        var url = 'https://openaero.net/?s=' + encodeBase64Url(compressSequence(activeSequence.xml));

        alertBox('<p>' + userText.saveAsURLFromApp +
            '</p><textarea id="saveAsURLArea" readonly></textarea>',
            userText.saveAsURLTitle,
            [{
                'name': 'copyClipboard', 'function': function () {
                    if (!copyFrom.select()) copyFrom.setSelectionRange(0, 9999);
                    document.execCommand('copy');
                    alertBox();
                }
            }]);
        var copyFrom = $('saveAsURLArea');
        copyFrom.innerHTML = url;
        copyFrom.focus();
        if (!copyFrom.select()) copyFrom.setSelectionRange(0, 9999);
    }

    missingInfoCheck(save);
}

// QRcode shows an alertBox containing a QR code holding the sequence link
function QRcode() {
    // Show alertBox with temporary "generating" text
    alertBox('<div id="QRcode">' + userText.generatingQRCode + '</div>',
        userText.qrCodeTitle);
    // Use setTimeout to generate QR code asynchronously
    setTimeout(function () {
        const div = document.createElement('div');
        // Create QR code at 600x600, then scale down to 300x300. This improves QR code
        // recognition for very large sequences.
        new QRCode(
            div,
            {
                text: 'https://openaero.net/?s=' + encodeBase64Url(compressSequence(activeSequence.xml)),
                width: 600,
                height: 600
            }
        );
        $('QRcode').innerHTML =
            '<img src="' + div.children[0].toDataURL("image/png") + '" style="width: 300px; height: 300px;">';
    }, 10);
}

// scanQRcode opens the scanner for QR code sequences (Cordova only)
function scanQRcode() {
    // Hide all menus
    menuInactiveAll();

    // Make the webview transparent so the video preview is visible behind it.
    QRScanner.show();

    // Hide normal interface and show QR scan overlay
    document.body.parentNode.style = "background: none transparent;";
    document.body.style = "background: none transparent;";
    $('mainOverlay').classList.add('movedFromView');

    QRScanner.scan(function (err, sequenceLink) {
        // Shut down QRScanner
        QRScanner.destroy();

        // Restore normal interface and hide QR scan overlay
        document.body.parentNode.style = "";
        document.body.style = "";
        $('mainOverlay').classList.remove('movedFromView');

        if (err && err.name == 'SCAN_CANCELED') {
            // Error code 6 = scan cancelled 
            return;
        } else if (err) {
            // Other error
            alertBox(
                sprintf(userText.qrScanFail, err.name),
                userText.openSequenceLink
            );
        } else if (!launchURL({ url: sequenceLink })) {
            // Show an error when launchURL gives an error
            alertBox(
                sprintf(userText.openSequenceLinkError, sequenceLink),
                userText.openSequenceLink
            );
            // Should be good...
        } else updateSaveFilename(); // clear filename
    });

}

// cancelQRscan cancels QR code scanning
function cancelQRscan() {
    QRScanner.cancelScan();
}

// emailSequence creates an email with a complete sequence as a URL in
// the body and the set save name as subject
function emailSequence() {
    const el = $('t_emailSequence');

    function email() {
        // create body with descriptive text, newlines and sequence URL
        // also replace single ticks (') and + as they may break the link
        var body = userText.emailHeader + '\r\n\r\n' +
            'https://openaero.net/?s=' + encodeBase64Url(compressSequence(activeSequence.xml));
        var subject = activeFileName() || 'Sequence';
        el.setAttribute('href', 'mailto:%20?subject=' + encodeURI(subject) +
            '&body=' + encodeURI(body));
        // click again to make sure this also gets triggerred after
        // missingInfoCheck dialog
        el.click();
    }

    el.setAttribute('href', '');
    missingInfoCheck(email);
}

// openSequenceLink handles opening a sequence from link in dialog
function openSequenceLink(e) {
    var dialog = $('openSequenceLink');
    var link = $('openSequenceLinkUrl');

    if (e === false) {
        dialog.classList.add('noDisplay');
    } else if (e === true) {
        dialog.classList.add('noDisplay');
        if (!launchURL({ url: link.value })) {
            alertBox(
                sprintf(userText.openSequenceLinkError, link.value),
                userText.openSequenceLink
            );
        } else updateSaveFilename(); // clear filename
    } else {
        dialog.classList.remove('noDisplay');
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
        localStorage.setItem(name, value);
        return true;
    } else return false;
}

// getLocal gets a value from localStorage and returns it. If
// localStorage is not supported it returns false.
// Callback will be called when the storage is loaded
function getLocal(name, callback) {
    if (storage) {
        callback(localStorage.getItem(name));
    } else return false;
}

/********************************
 * Functions for printing
 */

// parseAircraft will parse aircraft type or registration from aircraft field
// field
function parseAircraft(t) {
    for (let i = 0; i < regexRegistration.length; i++) {
        var match = $('aircraft').value.match(regexRegistration[i]);
        if (match) {
            return (t === 'registration' ?
                match[0] : $('aircraft').value.replace(match[0], '').trim());
        }
    };
    return (t === 'registration' ? '' : $('aircraft').value.trim());
}

// aircraft will return a combined value for aircraft from actype and acreg
function aircraft() {
    return ($('actype').value + ' ' + $('acreg').value).trim();
}

// printForms will print selected forms
// Depending on the system a method will be chosen:
// 1) Integrate print into main page and use screen and media print styles
// 2) Check if called from "Save PDF" on Cordova app
function printForms(evt) {

    if (platform.cordova) {
        beforePrint(evt);
    } else {
        window.print();
    }

    // restore title (changed in beforePrint)
    changeSequenceInfo();

    return true;
}

// Before printing, adjust layout. When using Cordova, printing is
// activated from this function also
function beforePrint(evt) {
    buildForms(window, function (printBody) {
        // update the print style with margins
        var style = $('printStyle');
        style.innerHTML = '@page {size: auto; margin: ' +
            $('marginTop').value + 'mm ' +
            $('marginRight').value + 'mm ' +
            $('marginBottom').value + 'mm ' +
            $('marginLeft').value + 'mm}' +
            'html {height: 100%; overflow: initial;}' +
            'body {margin: 0; height: 100%; overflow: initial;}' +
            '.noPrint {display: none;}' +
            '#noScreen {height: 100%;}' +
            '.breakAfter {position: relative; display:block; ' +
            'page-break-inside:avoid; page-break-after:always; ' +
            'height: 100%;}' +
            'svg {position: absolute; top: 0; height: 100%;}';

        window.document.title = '';
        // clear noScreen div
        removeChildNodes($('noScreen'));
        // add all nodes that will be printed
        while (printBody.childNodes.length > 0) {
            $('noScreen').appendChild(printBody.childNodes[0]);
        }
        window.document.title = activeFileName();

        // On Cordova, start printing now
        if (platform.cordova) {
            var printHtml =
                '<html>' +
                '<head>' +
                '<style type="text/css">' + style.innerHTML + '</style>' +
                '</head><body>' +
                $('noScreen').innerHTML +
                '</body>' +
                '</html>';
            if (evt && evt.target && evt.target.id === 't_savePdf') {
                // Font size of directly generated pdf in iOS is too large (cordova bug?).
                // Reduce font sizes. HACK!
                printHtml = printHtml.replace(/font-size[ ]*:[ ]*(\d+)/g, match =>
                    `font-size:${Math.round(parseInt(match.match(/\d+/))*0.7)}`
                );
                pdf.fromData(printHtml, {
                    documentSize: 'A4',
                    type: 'share',
                    fileName: activeFileName() + '.pdf'
                });
            } else {
                cordova.plugins.printer.print(printHtml);
            }
        }

    });
}

// buildForms will format selected forms for print or save. When
// win=true, a body is created in window win and callback executed
// with this body (for print).
// Otherwise an SVG holding the forms is sent to callback
function buildForms(win, callback) {
    var
        activeFormSave = activeForm,
        svg = '',
        translateY = 0,
        // save the miniFormA value and set miniFormA depending on checkbox
        miniFormASave = miniFormA,
        // save the Sequence Notes check
        sequenceNotesSave = $('printNotes').checked,
        // save the current logo
        logoSave = $('logo').value,
        fname = activeFileName() || 'sequence';

    // buildMulti is used when building multiple sequences for print/save
    function buildMulti() {
        var file = fileList[0];
        $('processingMultiCounter').innerHTML = sprintf(
            userText.processingMultiCounter, file.name, fileList.length);
        console.log('Processing: ' + file.name);
        // set previous settings for default values
        loadSettingsStorage('tempSavedSettings');
        // load settings from sequence
        loadSettingsXML(file.sequence);

        activateXMLsequence(file.sequence, true);

        // Add sequence file name if checked
        // Do this by putting it in the Notes area. If the 'Sequence Notes'
        // box is already ticked, add it before any existing Notes
        if ($('showFileName').checked) {
            var e = $('printNotes');
            var t = $('notes').value;
            t = ((t != '') && e.checked) ? file.name + ' - ' + t : file.name;
            $('notes').value = t;
            e.setAttribute('checked', true);
        }

        // anonymize sequence if checked
        if ($('anonymousSequences').checked) {
            $('pilot').value = '';
            $('team').value = '';
            $('acreg').value = '';
            $('actype').value = '';
        }

        // select correct logo
        switch ($('multiLogo').value) {
            case 'remove':
                removeLogo();
                break;
            case 'active':
                selectLogo(logoSave);
        }


        // Give sequence half a second to load, then...
        setTimeout(function () {
            // Activate the loading of the checking rules (if any) and build
            // the forms
            if ($('printMultiOverrideRules').checked) {
                // use rules currently set
                checkRules(buildSingle);
            } else {
                // use rules from file
                changeCombo('program', buildSingle);
            }
        }, 500);
    }

    // buildSingle builds the forms for a single file
    function buildSingle(data) {
        if (data) addAlertsToAlertMsgs(data);

        // go through the pages by parsing printPageSetString
        var string = $('printPageSetString').value.toUpperCase();
        for (let i = 0; i < string.length; i++) {
            if (/[ABCRLGD_ ]/.test(string[i]) ||
                (/\d[><]|[TFQ][><=]/.test(string.substring(i, i + 2)))) {
                if (/[BCG]\+|\d[><]|[TFQ][><=]/.test(string.substring(i, i + 2))) {
                    activeForm = string.substring(i, i + 2);
                    i++;
                } else activeForm = string[i];

                var formSVG = /^[_ ]/.test(activeForm) ? '' : buildForm(win);

                if (win) {
                    var div = win.document.createElement('div');
                    div.setAttribute('class', 'breakAfter noScreen');
                    div.innerHTML = formSVG;
                    // make sure we only keep the svg images in the div
                    var nodes = div.childNodes;
                    for (let k = nodes.length - 1; k >= 0; k--) {
                        if (!/svg/i.test(nodes[k].tagName)) nodes[k].remove();
                    }
                    body.appendChild(div);
                } else {
                    // remove newlines from SVG to simplify regex matching
                    // and remove end tag from all SVGs
                    formSVG = formSVG.replace(/[\n\r]/g, '').replace(/<\/svg>$/, '');
                    if (svg === '') {
                        // use first SVG start tag and adjust width
                        svg = formSVG.replace(/(<svg[^>]*width=")([^"]*)/, '$1' +
                            $('imageWidth').value);
                    } else {
                        // remove subsequent SVGs start tags
                        formSVG = formSVG
                            .replace(/^.*?<svg[^>]*>/, '')
                            // remove xml declarations
                            .replace(/<\?xml[^>]*>/, '');
                        // add translated group with formSVG
                        svg += '<g transform="translate (0,' +
                            roundTwo(translateY) + ')">' + formSVG + '</g>';
                    }
                    translateY += 1130 + parseInt($('pageSpacing').value);
                }
            }
        }
        if (fileList.length > 1) {
            fileList.shift();
            // files remaining in fileList, so buildMulti
            buildMulti();
        } else {
            // no files (remaining) in fileList. Finish up

            // hide print dialog, do this after we are done as fileList will
            // also be cleared
            printDialog();

            infoBox();

            if (!win) {
                svg += '</svg>';
                var height = translateY -
                    parseInt($('pageSpacing').value) + 10;
                // update first rectangle
                svg = svg
                    .replace(/<rect [^>]+>/, '<rect x="-5" y="-20" ' +
                    'width="810" height="' + (height + 40) + '" ' +
                    'style="fill: white;"/>')
                    // Update viewBox
                    // Add some margin to make sure bold lines etc are correctly shown
                    .replace(/viewBox="[^"]*"/, `viewBox="-5 -5 810 ${height}"`)
                    // replace first width and height. These should be for complete SVG
                    .replace(/width="[^"]*"/, `width="${$('imageWidth').value}px"`)
                    .replace(/height="[^"]*"/, `height="${$('imageHeight').value}px"`);
            }

            if (multi.processing) {
                multi.processing = false;
                // restore previous settings and sequence
                loadSettingsStorage('tempSavedSettings');
                activateXMLsequence(savedSeq);
                // restore the Sequence Notes check
                $('printNotes').checked = sequenceNotesSave;
            }

            // execute callback with either body or svg
            callback(win ? body : svg);
        }
    }

    formStyle = $('formStyle').value;

    // make sure no figure is selected
    selectFigure(false);

    // Remove 'screen' class of sequenceArea
    $('sequenceArea').classList.remove ('screen');

    if (win) var body = win.document.createElement('body');

    // start the process, multi or single
    if (fileList.length) {
        // save active sequence and settings
        var savedSeq = activeSequence.xml;
        saveSettingsStorage('tempSavedSettings');

        multi.processing = 'print';
        infoBox(
            '<span id="processingMultiCounter"></span>',
            userText.printMulti);
        buildMulti();
    } else buildSingle();

    // Restore 'screen' class of sequenceArea
    $('sequenceArea').classList.add ('screen');
    
    // Reset the screen to the normal view
    miniFormA = miniFormASave;
    selectForm(activeFormSave);
}

// adjustRollFontSize will adjust the rollFontSize to compensate for
// scaling in buildForm
function adjustRollFontSize(scale, svg = SVGRoot) {
    var baseRollFontSize = rollFontSize;
    SVGRoot = svg; // make sure this svg and SVGRoot are synchronized

    // increase rollFontSize for significant downscaling, and redraw
    if (parseInt(rollFontSize / Math.sqrt(scale)) > rollFontSize) {
        changeRollFontSize(parseInt(rollFontSize / Math.sqrt(scale)));
        draw();
        changeRollFontSize(baseRollFontSize);
    }
    return SVGRoot;
}

// buildForm will build a complete SVG string for printing a form
// from a provided SVG object and activeForm global.
// The default size of the page is A4, 800x1130
function buildForm(print) {

    // generate output for saving, not editing
    sequenceEditing = false;

    miniFormA = /^[BC]\+/.test(activeForm);

    if (/^[0-9TFQ]/.test(activeForm)) {
        var activeFormSave = activeForm.toString();
        activeForm = (activeForm[1] === '>') ? 'L' : 'R';
        draw();
        activeForm = activeFormSave;
    } else draw();

    var bBox = SVGRoot.getBBox();
    var mySVG = SVGRoot;

    switch (activeForm.replace(/[0-9TFQ][><=]/, 'P')) {
        case 'G':
        case 'G+':
            addFormElementsGrid(mySVG);
            break;

        case 'P':
            // 1 to 4 pilot cards on a sheet
            var
                rotate = false,
                flipSecond = (activeForm[1] === '=') ? true : false;
            switch (activeForm[0]) {
                case 'T':
                    var copies = 2;
                    rotate = true;
                    var width = 565;
                    var height = 800;
                    break;
                case 'F':
                    var copies = 4;
                    var width = 400;
                    var height = 565;
                    break;
                case 'Q':
                    var copies = 2;
                    var width = 400;
                    var height = 565;
                    break;
                default:
                    var copies = 1;
                    var width = (parseInt(activeForm[0]) * 80) || 800;
                    var height = (parseInt(activeForm[0]) * 113) || 1130;
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
            var scale = roundTwo(Math.min(width / w, height / h));

            // make copies and translate / rotate / scale
            var seq1 = mySVG.getElementById('sequence');

            if (rotate) {
                // use matrix transform to rotate, scale and translate
                seq1.setAttribute('transform', 'matrix(0,' + scale + ',' +
                    (-scale) + ',0,' + (scale * (h + y) + (height - h * scale) / 2) + ',' +
                    (-scale * x + ((width - w * scale) / 2)) + ')');
            } else {
                seq1.setAttribute('transform', 'translate(' +
                    roundTwo(-x * scale) + ',' + roundTwo(-y * scale) +
                    ') scale(' + scale + ')');
            }

            // Handle pilot card prints with more than 1 copy
            if (copies !== 1) {
                var addQRcode = /^Q/.test(activeForm);
                if (flipSecond) {
                    activeForm = 'L';
                    draw();
                    var bBox = SVGRoot.getBBox();
                    var seq2 = SVGRoot.getElementById('sequence');
                    var x2 = parseInt(bBox.x) - bBox.width * 0.05;
                } else var seq2 = seq1.cloneNode(true);
                seq2.setAttribute('id', 'seq2');
                if (rotate) {
                    // use matrix transform to rotate, scale and translate
                    seq2.setAttribute('transform', 'matrix(0,' + scale + ',' +
                        (-scale) + ',0,' + (scale * (h + y) + (height - h * scale) / 2) +
                        ',' + (-scale * (flipSecond ? x2 : x) + width +
                            ((width - w * scale) / 2)) + ')');
                } else {
                    seq2.setAttribute('transform', 'translate(' +
                        roundTwo(((flipSecond ? -x2 : -x) * scale) + (addQRcode ? 0 : width)) + ',' +
                        roundTwo(-y * scale + (addQRcode ? height : 0)) + ') scale(' + scale + ')');
                }
                mySVG.appendChild(seq2);
                // See if we need to add the QR codes. These have a fixed size of 300x300
                if (addQRcode) {
                    var qrImage = $('qrCodeForPrint').children[0].toDataURL("image/png");
                    drawImage({
                        x: width + 50, y: 20, width: 300, height: 300,
                        preserveAspectRatio: 'xMaxYMax',
                        href: qrImage
                    }, mySVG);
                    drawImage({
                        x: width + 50, y: height + 20, width: 300, height: 300,
                        preserveAspectRatio: 'xMaxYMax',
                        href: qrImage
                    }, mySVG);
                }
            }

            // Handle pilot card prints with 2 copies
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
            mySVG.setAttribute('viewBox', '0 0 800 1130');
            mySVG.setAttribute("width", '100%');
            break;
        
        case 'L':
        case 'R':
            addFormElementsLR(mySVG, print);
            break;
        case 'D':
            makeFormDescription(mySVG);
            break;
        default:
            // Handle forms A, B and C
            // Find the size and adjust scaling if necessary
            
            // The sequence max width=800, height=1000 (Form A) or 950 (Form B & C)
            var maxHeight = activeForm === 'A' ? 1000 :
                ($('printCheck').checked ? 938 : 950);

            switch (formStyle) {
                case 'iac':
                    // IAC forms
                    var
                        moveRight = 15;
                        w = parseInt(bBox.width);
                        h = parseInt(bBox.height + 20); // add some margin to the bottom

                    // check maximum scale from print dialog
                    var maxScale = $('maxScaling').value / 100;

                    // For form A we need to add the righthand scoring column, so
                    // max width = 580
                    if (activeForm === 'A') {
                        var scale = Math.min(580 / w, maxScale);
                        var marginTop = 130;
                    } else {
                        var scale = Math.min(700 / w, maxScale);
                        var marginTop = 120;
                    }
                    // check for max height
                    if ((maxHeight / h) < scale) {
                        scale = Math.min(maxHeight / h, maxScale);
                        // height limited, so we can move the sequence right for centering
                        moveRight = Math.max((700 - (w * scale)) / 2, 0) + 15;
                    }

                    // Check if roll font size should be enlarged because of downscaling.
                    // Do this before adding wind and box around sequence as sequence
                    // may be redrawn!
                    mySVG = adjustRollFontSize(scale, mySVG);

                    // remove wind arrow
                    mySVG.querySelectorAll('#windArrow').forEach(el => el.remove());

                    if (activeForm === 'A') {
                        // check if the columns should be stretched (max factor 1.2)
                        moveRight = 0;
                        var xScale = (scale * w) < 580 ? Math.min(580 / w, 1.2) : scale;

                        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
                            roundTwo(moveRight - (bBox.x * scale)) + ',' +
                            roundTwo(marginTop - bBox.y * scale) +
                            ') scale(' + xScale + ',' + scale + ')');
                        mySVG.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');
                    } else {
                        // Insert box containing sequence
                        drawRectangle(0, 126, 740, 945, 'formLine', mySVG);

                        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
                            roundTwo(moveRight - (bBox.x * scale)) + ',' +
                            roundTwo(marginTop - bBox.y * scale) +
                            ') scale(' + scale + ')');
                    }

                    // IACnoUpwindNote adds text for sequences that do not start upwind
                    function IACnoUpwindNote() {
                        for (let i = 0; i < figures.length; i++) {
                            if (figures[i].aresti) {
                                if ((figures[i].entryDir + figures[i].entryAtt) % 360 !=
                                    (activeForm[0] === 'B' ? 0 : 180)) {
                                    var el = drawText(
                                        figures[i].entryDir % 180 == 90 ? userText.iacNoteYAxisEntry : userText.iacNoteDownwindEntry,
                                        activeForm[0] === 'B' ? 10 : 730,
                                        136, 'IACFormEntryNote',
                                        activeForm[0] === 'B' ? 'start' : 'end',
                                        'IACFormEntryNote', mySVG);
                                    // add white background over sequence border
                                    bBox = el.getBBox();
                                    drawRectangle(
                                        roundTwo(bBox.x - 4),
                                        roundTwo(bBox.y - 4),
                                        roundTwo(bBox.width + 8),
                                        roundTwo(bBox.height + 8),
                                        'formBackground',
                                        mySVG);
                                    // re-append the text element to put it above white background
                                    mySVG.appendChild(el);
                                }
                                break;
                            }
                        }
                    }

                    // rebuild wind arrow in the correct place and check if a note
                    // needs to be added for non-upwind start
                    if (activeForm[0] === 'B') {
                        drawWind(740, 110, 1, mySVG);
                        IACnoUpwindNote();
                    } else if (activeForm[0] === 'C') {
                        drawWind(0, 110, -1, mySVG);
                        IACnoUpwindNote();
                    }

                    // Add all necessary elements
                    if (logoImg) {
                        if (activeForm === 'A') {
                            var logoSvg = buildLogoSvg(logoImg, 610, 930, 110, 110,
                                $('blackWhite').checked);
                        } else {
                            var logoSvg = buildLogoSvg(logoImg, 0, 10, 80, 100,
                                $('blackWhite').checked);
                        }
                        mySVG.appendChild(logoSvg);
                    }
                    buildHeader(mySVG);
                    if (activeForm === 'A') {
                        buildScoreColumn(mySVG);
                        buildCornertab(mySVG);
                    }
                    break;
                case 'imac':
                    // IMAC forms

                    var
                        moveRight = 15,
                        bBox = mySVG.getBBox(),
                        w = parseInt(bBox.width),
                        h = parseInt(bBox.height + 20), // add some margin to the bottom
                        // define the width of the basic form, without scoring column
                        formWidth = activeForm === 'A' ? 540 : 800,
                        // maximum scale from print dialog
                        maxScale = $('maxScaling').value / 100,
                        scale = Math.min(formWidth / w, maxScale),
                        marginTop = activeForm === 'A' ? 90 : 100,
                        miniFormAGroup = mySVG.getElementById('miniFormA');
                    
                    if (miniFormAGroup) var miniFormAbBox = miniFormAGroup.getBBox();

                    // check for max height
                    if ((maxHeight / h) < scale) {
                        scale = Math.min(maxHeight / h, maxScale);
                        // height limited, so we can move the sequence right for centering
                        moveRight = Math.max((formWidth - (w * scale)) / 2, 0) + 15;
                        // Move form C to the right when miniFormA was used
                        // (in original drawing, miniFormA is always on the right)
                        if (miniFormAGroup && /^C/.test(activeForm)) {
                            moveRight += miniFormAbBox.width;
                        }
                    }

                    // Check if roll font size should be enlarged because of downscaling.
                    // Do this before adding wind and box around sequence as sequence
                    // may be redrawn!
                    mySVG = adjustRollFontSize(scale, mySVG);

                    // Remove wind arrow and miniFormA
                    mySVG.querySelectorAll('#windArrow,#miniFormA').forEach(el => el.remove());

                    if (activeForm === 'A') {
                        // check if the columns should be stretched (max factor 1.2)
                        moveRight = 0;
                        var xScale = (scale * w) < formWidth ? Math.min(formWidth / w, 1.2) : scale;

                        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
                            roundTwo(moveRight - (bBox.x * scale)) + ',' +
                            roundTwo(marginTop - bBox.y * scale) +
                            ') scale(' + xScale + ',' + scale + ')');
                        mySVG.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');

                        buildScoreColumn(mySVG);
                    } else {
                        // Insert box containing sequence
                        drawRectangle(0, 110, formWidth, 965, 'formLine', mySVG);

                        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
                            roundTwo(moveRight - (bBox.x * scale)) + ',' +
                            roundTwo(marginTop - bBox.y * scale) +
                            ') scale(' + scale + ')');

                        // rebuild wind arrow and miniFormA in the correct place
                        if (/^B/.test(activeForm)) {
                            drawWind(formWidth, 94, 1, mySVG);
                        } else {
                            drawWind(0, 94, -1, mySVG);
                        }
                        if (miniFormAGroup) {
                            // append miniFormA to the svg at top level
                            mySVG.appendChild(miniFormAGroup);
                            var miniFormAbBox = miniFormAGroup.getBBox();
                            miniFormAGroup.setAttribute('transform', 'translate(' +
                                roundTwo(-miniFormAbBox.x +
                                    (/^B/.test(activeForm) ? 800 - miniFormAbBox.width : 0)
                                ) + ',' +
                                roundTwo(1075 - (miniFormAbBox.y + miniFormAbBox.height)) +
                                ')');
                        }
                    }

                    // Add chosen logo image
                    if (logoImg) {
                        if (activeForm === 'A') {
                            var logoSvg = buildLogoSvg(logoImg, 550, 0, 240, 110,
                                $('blackWhite').checked);
                        } else {
                            var logoSvg = buildLogoSvg(logoImg, 610, 0, 190, 100,
                                $('blackWhite').checked);
                        }
                        mySVG.appendChild(logoSvg);
                    }

                    // Add form header
                    buildHeader(mySVG);
                    break;
                case 'civa':
                    // CIVA forms
                    var
                        moveRight = 10,
                        w = parseInt(bBox.width),
                        h = parseInt(bBox.height + 20), // add some margin to the bottom
                        // set maximum scale from print dialog
                        maxScale = $('maxScaling').value / 100;

                    // take the tear-off tab into account with no miniFormA
                    // (defined by X + Y = 1620)
                    if (!miniFormA && (1620 / (w + h)) < maxScale) maxScale = 1620 / (w + h);

                    // For form A we need to add the righthand scoring column, so
                    // max width = 620. For Form B and C max width = 788 to always
                    // provide 10px left and 2px right margin to sequence.
                    if (activeForm === 'A') {
                        var scale = Math.min(600 / w, maxScale);
                        var marginTop = 130;
                    } else {
                        var scale = Math.min(788 / w, maxScale);
                        var marginTop = 140;
                    }
                    // check for max height
                    if ((maxHeight / h) < scale) {
                        scale = Math.min(maxHeight / h, maxScale);
                        // height limited, so we can move the sequence right for centering
                        // limit this on tear-off tab
                        moveRight = Math.max(1620 - ((w + h) * scale), 0) / 2;
                    }

                    mySVG = adjustRollFontSize(scale, mySVG);

                    if (activeForm === 'A') {
                        // check if the columns should be stretched (maximum factor 1.2)
                        moveRight = 0;
                        var xScale = (scale * w < 620) ? Math.min(620 / w, 1.2) : scale;
                        mySVG.getElementById('sequence').setAttribute('preserveAspectRatio', 'none');

                        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
                            roundTwo(moveRight - (bBox.x * scale)) + ',' +
                            roundTwo(marginTop - bBox.y * scale) +
                            ') scale(' + xScale + ',' + scale + ')');
                    } else {
                        mySVG.getElementById('sequence').setAttribute('transform', 'translate(' +
                            roundTwo(moveRight - (bBox.x * scale)) + ',' +
                            roundTwo(marginTop - bBox.y * scale) +
                            ') scale(' + scale + ')');
                    }

                    // Add all necessary elements
                    var logoWidth = 0;
                    if (logoImg) {
                        var logoSvg = buildLogoSvg(logoImg, 0, 0, 200, 120,
                            $('blackWhite').checked);
                        mySVG.appendChild(logoSvg);
                        logoWidth = parseInt(logoSvg.getBBox().width) + 10;
                    }
                    var header = document.createElementNS(svgNS, 'g');
                    buildHeader(header, logoWidth);
                    mySVG.appendChild(header);

                    if (activeForm === 'A') buildScoreColumn(mySVG);
                    buildCornertab(mySVG);
                }

                if (/^[BC]/.test(activeForm)) {
                    // add sequence string when checked.
                    if ($('printString').checked) {
                        addSequenceString(mySVG, { x: 10, y: 1085, width: 600, height: 40 }, print);
                    }

                    // add check result when checked
                    if ($('printCheck').checked) {
                        addCheckResult(mySVG, { x: 10, y: 1082 });
                    }
                }
                mySVG.setAttribute("viewBox", '0 0 800 1130');
                mySVG.setAttribute("width", '100%');
    }

    // remove height when printing
    if (print) mySVG.removeAttribute("height");

    // Add the notes to the top when checked. This will result in a
    // "vertical flattening" of the entire form
    if ($('printNotes').checked) {
        // rebuild entire svg in group
        var g = document.createElementNS(svgNS, 'g');
        while (mySVG.childNodes.length > 0) {
            g.appendChild(mySVG.firstChild);
        }
        // temporarily attach text to SVGRoot. Needed as after possible
        // roll scaling, mySVG may be detached from DOM and t.getBBox()
        // does not work
        var
            t = SVGRoot.appendChild(document.createElementNS(svgNS, 'text')),
            dy = style.printNotes.match(/font-size[ ]*:[ ]*([\d]+)/)[1],
            lines = $('notes').value.replace(/\r/g, '').split('\n');

        t.setAttribute('style', style.printNotes);
        lines.forEach ((l) => { t.appendChild(tspan(l, dy)) });

        var box = t.getBBox();
        mySVG.appendChild(t);
        t.setAttribute('transform', 'translate(' + roundTwo(-box.x) + ',' +
            roundTwo(-box.y) + ')');
        g.setAttribute('transform', 'translate (0,' +
            roundTwo(box.height + 4) + ') scale (1,' +
            ((1126 - box.height) / 1130) + ')');
        mySVG.appendChild(g);
    }

    // Insert rectangle (=background) at the beginning
    var path = document.createElementNS(svgNS, "rect");
    path.setAttribute('x', '-5');
    path.setAttribute('y', '0');
    path.setAttribute('width', '810');
    path.setAttribute('height', '1130');
    path.setAttribute('style', style.formBackground);
    mySVG.insertBefore(path, mySVG.firstChild);

    var svg = mySVG;

    // For some reason serializeToString may convert the xlink:href to
    // a0:href or just href for the logo image
    // So we change it back right away because otherwise the logo isn't displayed
    var sequenceSVG = new XMLSerializer().serializeToString(svg).replace(/ [^ ]*href/g, ' xlink:href');
    sequenceSVG = '<?xml version="1.0" standalone="no"?>\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.2//EN" ' +
        '"http://www.w3.org/Graphics/SVG/1.2/DTD/svg12.dtd">\n' + sequenceSVG;

    // create Black & White forms when checked
    if ($('blackWhite').checked) {
        sequenceSVG = sequenceSVG
            // replace style neg by negBW
            .replace(RegExp(`"${style.neg}"`, 'g'), `"${style.negBW}"`)
            // replace style negfill by negfillBW
            .replace(RegExp(`"${style.negfill}"`, 'g'), `"${style.negfillBW}"`)
            // replace remaining red by black
            .replace(/\bred;/g, 'black;');
    }

    // create inverse forms when checked
    if ($('inverseForms').checked) {
        // build sequence white-on-black
        sequenceSVG = sequenceSVG
            .replace(/\bwhite;/g, 'BLACK;')
            .replace(/\bblack;/g, 'white;')
            .replace(/\bBLACK;/g, 'black;')
            // change red to lighter red
            .replace(/\bred;/g, '#ff6040;')
            // fatten lines
            .replace(/stroke-width:\s*2px;/g, 'stroke-width: 4px;')
            .replace(/stroke-width:\s*1\.5px;/g, 'stroke-width: 3px;')
            .replace(/stroke-width:\s*1px;/g, 'stroke-width: 2px;');
    }

    // go back to editing output mode
    sequenceEditing = true;

    return sequenceSVG;
}

// addSequenceString will add a correctly formatted sequence string to
// a sequence diagram
function addSequenceString(svg, textBox, print) {
    var txt = sanitizeSpaces(activeSequence.text);
    // When printing a PDF, we prefer textarea as this improves
    // copy/paste
    // When saving as image, we can not use textarea as this will
    // cause errors in conversion
    if (print) {
        // replace spaces and hyphens by non-breaking to make sure
        // copy/paste works correctly and minimum lines are used
        txt = txt.replace(/ /g, '&nbsp;').replace(/-/g, '&#8209;');
        drawTextArea(txt, textBox.x, textBox.y,
            textBox.width, textBox.height, $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', svg);
    } else {
        var g = document.createElementNS(svgNS, 'g');
        drawText(txt, 0, 0, $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
        svg.appendChild(g);

        var scaleBox = '';

        var box = g.getBBox();
        if (box.width > textBox.width) {
            g.firstChild.remove();
            // medium to long text
            // split on last possible space, might create three lines
            var words = txt.split(' ');
            var lines = [''];
            var maxChar = parseInt(txt.length * (textBox.width / box.width));
            words.forEach ((w) => {
                if ((lines.slice(-1).length + w.length) < maxChar) {
                    lines[lines.length - 1] += w + ' ';
                } else {
                    lines.push(w + ' ');
                }
            });

            if (lines.length > 3) {
                // very long text
                // Split in three equal lines
                drawText(txt.substring(0, parseInt(txt.length / 3)),
                    0, 0, $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
                drawText(txt.substring(parseInt(txt.length / 3),
                    parseInt((txt.length / 3) * 2)),
                    0, 13, $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
                drawText(txt.substring(parseInt((txt.length / 3) * 2)),
                    0, 26, $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
            } else {
                lines.forEach ((l, i) => {
                    drawText(l, 0, i * 13, $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
                });
            }
            //  adjust X scale if necessary
            box = g.getBBox();
            var scaleX = textBox.width / box.width;
            if (scaleX < 1) {
                scaleBox = ' scale (' + scaleX + ',1)';
            }
        }
        g.setAttribute('transform', 'translate (' + roundTwo(textBox.x - box.x) +
            ',' + roundTwo((textBox.y + 40) - (box.y + box.height)) + ')' + scaleBox);
    }
}

// addCheckResult will add the check result to a sequence
function addCheckResult(svg, pos) {
    var
        d = new Date(),
        text = userText.sequenceTest +
            d.getDate() + '-' +
            parseInt(d.getMonth() + 1) + '-' +
            d.getFullYear() + ' ' +
            d.getHours() + ':' +
            ('0' + d.getMinutes()).slice(-2) + ' ' +
            'OpenAero ' + version + ' ' +
            (activeRules ? activeRules.description : '') + ' ',
        g = document.createElementNS(svgNS, 'g'),
        // get alerts from alert area
        alertMessages = $('alerts').getElementsByTagName('SPAN');

    g.id = 'checkResult';

    if (alertMessages.length < 1) { // no messages
        // no alerts
        if (activeRules) {
            drawText(text + userText.sequenceCorrect, pos.x, pos.y,
                $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
        }
    } else {
        // alerts present
        var y = pos.y;
        for (let i = alertMessages.length - 1; i >= 0; i--) {
            drawText(alertMessages[i].innerText, pos.x, y,
                $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
            y -= 12;
        }
        drawText(text + userText.sequenceHasErrors, pos.x, y,
            $('blackWhite').checked ? 'sequenceStringBW' : 'sequenceString', '', 'start', g);
    }

    svg.appendChild(g);
    alertMsgs = [];
    alertMsgRules = {};
    return g.getBBox();
}

// addFormElementsLR will add all L or R form elements to a provided SVG object.
// The default size of the page is A4, 800x1130
function addFormElementsLR(svg, print) {
    // logo
    var logoWidth = 0;
    if (logoImg) {
        var logoSvg = buildLogoSvg(logoImg, 0, 0, 112, 112,
            $('blackWhite').checked);
        svg.appendChild(logoSvg);
        logoWidth = parseInt(logoSvg.getBBox().width);
    }
    // header
    switch (formStyle) {
        case 'iac':
        case 'imac':
            // Sequence info
            drawRectangle(logoWidth + 10, 2, 526 - logoWidth, 45, 'formLine', svg);
            drawLine(logoWidth + 10, 23, 526 - logoWidth, 0, 'formLine', svg);
            drawText('Çategory: ' +
                (sportingClass.value === 'glider' ? ' Glider' : 'Power') + ' ' +
                $('category').value,
                logoWidth + 20, 17, 'formAText', 'start', '', svg);
            drawText('Date: ' + $('date').value,
                378, 17, 'formAText', 'start', '', svg);
            drawText('Program: ' + $('program').value,
                logoWidth + 20, 40, 'formAText', 'start', '', svg);

            // Header K block
            drawRectangle(553, 2, 41, 75, 'formLine', svg);
            drawText(userText.figureK, 573, 12, 'formATextTiny', 'middle', '', svg);
            drawLine(553, 38, 41, 0, 'formLine', svg);
            drawText(userText.totalK, 573, 48, 'formATextTiny', 'middle', '', svg);

            // Header judges block
            drawRectangle(602, 2, 129, 75, 'formLineBold', svg);
            drawText('Judge Name', 610, 15, 'formATextSmall', 'start', '', svg);
            drawText('IAC#', 695, 13, 'formATextSmall', 'start', '', svg);
            drawLine(602, 38, 129, 0, 'formLine', svg);
            drawText('Asst. Name', 610, 51, 'formATextSmall', 'start', '', svg);
            drawText('IAC#', 695, 51, 'formATextSmall', 'start', '', svg);

            // Header Pilot # block
            drawRectangle(738, 2, 60, 75, 'formLine', svg);
            drawText('Pilot #', 767, 13, 'formATextSmall', 'middle', '', svg);
            drawText($('flight_nb').value, 767, 40, 'formATextXL', 'middle', '', svg);
            break;
        default:
            drawRectangle(logoWidth + 10, 2, 490 - logoWidth, 68, 'formLine', svg);
            drawLine(logoWidth + 10, 36, 490 - logoWidth, 0, 'formLine', svg);
            drawText($('rules').value,
                logoWidth + 20, 25, 'formATextLarge', 'start', '', svg);
            drawText($('category').value +
                (sportingClass.value === 'glider' ? ' Glider' : ''),
                logoWidth / 2 + 250, 25, 'formATextLarge', 'middle', '', svg);
            drawText($('date').value,
                490, 25, 'formATextLarge', 'end', '', svg);
            drawText($('program').value,
                logoWidth + 20, 60, 'formATextLarge', 'start', '', svg);
            drawText($('location').value,
                490, 60, 'formATextLarge', 'end', '', svg);

            // Header K block
            drawRectangle(510, 2, 50, 98, 'formLine', svg);
            drawText(userText.figureK, 535, 15, 'formATextSmall', 'middle', '', svg);
            drawLine(510, 51, 50, 0, 'formLine', svg);
            drawText(userText.totalK, 535, 64, 'formATextSmall', 'middle', '', svg);

            // Header judges block
            drawRectangle(570, 2, 150, 98, 'formLineBold', svg);
            drawText(userText.judgesName, 580, 13, 'formATextTiny', 'start', '', svg);
            drawLine(570, 51, 150, 0, 'formLine', svg);
            drawText(userText.signature, 580, 62, 'formATextTiny', 'start', '', svg);
            drawText(userText.number, 670, 62, 'formATextTiny', 'start', '', svg);

            drawRectangle(730, 2, 68, 98, 'formLineBold', svg);
            drawText(userText.flightNr, 765, 15, 'formATextSmall', 'middle', '', svg);
            drawText($('flight_nb').value, 764, 55, 'formATextXL', 'middle', '', svg);
    }

    // continue from bottom

    // pilot info line
    drawText(userText.pilot + ':', 160, 1128, 'formATextSmall', 'end', '', svg);
    drawText($('pilot').value, 165, 1128, 'formATextLarge', 'start', '', svg);
    drawText(userText.ac + ':', 495, 1128, 'formATextSmall', 'end', '', svg);
    drawText(aircraft(), 500, 1128, 'formATextLarge', 'start', '', svg);
    if ($('team').value) {
        drawText(userText.team + ':', 740, 1128, 'formATextSmall', 'end', '', svg);
        drawText($('team').value, 745, 1128, 'formATextLarge', 'start', '', svg);
    }

    var qrcode = false;
    /* QR code on Form R/L disabled because it becomes too large. Maybe future development?
    // Add QR code at bottom left, if switched on
    if (true) {
        qrcode = $('qrcode').lastChild;
        drawImage({
            x: 0, y: 1130 - qrcode.height / 2, width: qrcode.width / 2, height: qrcode.height / 2,
            preserveAspectRatio: 'xMaxYMax', href: qrcode.src
        }, svg);
    }
    */

    // Aresti and K block
    var
        figureNr = 0,
        x = 5,
        rows = 0,
        g = document.createElementNS(svgNS, 'g'),
        totalK = 0,
        modifiedK = [];

    figures.forEach ((f) => {
        if (f.aresti && (rows < f.aresti.length)) { rows = f.aresti.length; }
    });

    figures.forEach ((f) => {
        if (f.aresti) {
            figureNr++;
            var figK = 0;
            drawText(
                'Fig ' + figureNr + ' ' + (f.unknownFigureLetter || ''),
                x, 15, 'miniFormABold', 'start', '', g);
            drawText('K', x + 70, 15, 'miniFormABold', 'end', '', g);
            var y = 27;
            f.aresti.forEach ((fa, i) => {
                if (fa in rulesKFigures) modifiedK.push(figureNr);
                drawText(fa, x, y, 'miniFormA', 'start', '', g);
                drawText(f.k[i], x + 70, y, 'miniFormA', 'end', '', g);
                figK += parseInt(f.k[i]);
                y += 12;
            });

            // Adjust figure K for additionals
            if (f.unknownFigureLetter && (f.unknownFigureLetter === 'L')) {
                if (additionals <= additionalFig.max) {
                    figK = additionalFig.totalK / additionals;
                } else {
                    if (additionalFig.max > 0) {
                        figK = additionalFig.totalK / additionalFig.max;
                    }
                    checkAlert(sprintf(userText.maxAdditionals, additionalFig.max),
                        false,
                        figureNr);
                }
            }
            // adjust figure K for floating point
            if (f.floatingPoint) figK -= 1;

            totalK += figK;
            if (($('printSF').checked === true) &&
                (f.superFamily)) {
                drawText('SF ' + f.superFamily,
                    x, 27 + rows * 12, 'miniFormABold', 'start', '', g);
            }
            if (f.floatingPoint) figK = '(-1)' + figK;
            drawText(figK, x + 70, 27 + rows * 12, 'miniFormABold', 'end', '', g);
            x += 80;
        }
    });
    svg.appendChild(g);
    var bBox = g.getBBox();
    drawRectangle(0, 0, bBox.width + 10, bBox.height + 10, 'formLine', g);
    for (let i = 1; i < figureNr; i++) {
        drawLine(i * 80, 0, 0, bBox.height + 10, 'formLine', g);
    }

    // Scale width to fit, but don't upscale more than 20%.
    // When QR code is added, move block to the right 110px.
    var scaleX = Math.min((qrcode ? 789 - qrcode.width / 2 : 799) / (bBox.width + 10), 1.2);
    var blockTop = roundTwo(1100 - bBox.height);
    g.setAttribute('transform', 'translate (' + (qrcode ? qrcode.width / 2 + 10 : 0) + ',' + blockTop + ') scale (' + scaleX + ',1)');

    // figureK and totalK
    // Header K block
    switch (formStyle) {
        case 'iac':
        case 'imac':
            drawText(totalK, 573, 32, 'formATextLarge', 'middle', '', svg);
            break;
        default:
            drawText(totalK, 535, 41, 'formATextXL', 'middle', '', svg);
    }
    totalK += parseInt($('positioning').value || 0) +
        parseInt($('harmony').value || 0);
    switch (formStyle) {
        case 'iac':
        case 'imac':
            drawText(totalK, 573, 68, 'formATextLarge', 'middle', '', svg);
            break;
        default:
            drawText(totalK, 535, 90, 'formATextXL', 'middle', '', svg);
    }

    var seqBottom = blockTop;

    // sequence string and check result
    if ($('printString').checked) {
        seqBottom -= 42;
        addSequenceString(svg, { x: 10, y: seqBottom, width: 480, height: 40 }, print);
    }

    // add check result when checked
    if ($('printCheck').checked) {
        bBox = addCheckResult(svg, { x: 10, y: seqBottom - 6 });
        seqBottom -= bBox.height;
    }

    // add warning for modified K when applicable
    if (modifiedK.length) {
        drawText(changedFigureKText(modifiedK, activeRules.description),
            10, seqBottom - 8, 'modifiedK', 'start', '', svg);
        seqBottom -= 10;
    }

    // remove wind arrow
    svg.querySelectorAll('#windArrow').forEach(el => el.remove());

    // rebuild wind arrow in the correct place, and add form letter
    if (activeForm === 'R') {
        switch (formStyle) {
            case 'iac':
            case 'imac':
                bBox = drawWind(485, 55, 0.8, svg);
                drawText('R', 515, 85, 'formATextBoldHuge', 'middle', '', svg);
                break;
            default:
                bBox = drawWind(450, 75, 0.8, svg);
                drawText('R', 480, 105, 'formATextBoldHuge', 'middle', '', svg);
        }
    } else {
        switch (formStyle) {
            case 'iac':
            case 'imac':
                bBox = drawWind(logoWidth + 50, 55, -0.8, svg);
                drawText('L', logoWidth + 20, 85, 'formATextBoldHuge', 'middle', '', svg);
                break;
            default:
                // Move wind arrow right of logo if the logo extends below header block
                var rightOfLogo = (logoWidth > 0 && logoSvg.getBBox().height > 70) ? logoWidth : 0;
                bBox = drawWind(45 + rightOfLogo, 75, -0.8, svg);
                drawText('L', 20 + rightOfLogo, 105, 'formATextBoldHuge', 'middle', '', svg);
        }
    }

    // scale and position sequence
    var
        width = (formStyle == 'civa') ? 480 : 523,
        maxScale = $('maxScaling').value / 100,
        sequence = svg.getElementById('sequence');

    bBox = sequence.getBBox();
    scaleX = roundTwo(Math.min(width / bBox.width, maxScale));
    var scaleY = roundTwo(Math.min((seqBottom - 130) / bBox.height, maxScale));
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
        var redrawSVG = adjustRollFontSize(scaleX, svg);
        // remove wind arrow
        redrawSVG.querySelectorAll('#windArrow').forEach(el => el.remove());
        sequence.innerHTML = redrawSVG.getElementById('sequence').innerHTML;
    }

    // penalty block
    if (formStyle == 'civa') {
        blockTop -= 114;
        drawRectangle(510, blockTop, 289, 104, 'formLine', svg);
        drawRectangle(614, blockTop, 39, 104, 'formLineBold', svg);
        drawRectangle(759, blockTop, 39, 104, 'formLineBold', svg);
        drawLine(510, blockTop + 26, 289, 0, 'formLine', svg);
        drawLine(510, blockTop + 52, 289, 0, 'formLine', svg);
        drawLine(510, blockTop + 78, 289, 0, 'formLine', svg);

        drawText(userText.tooLow, 516, blockTop + 18, 'formAText', 'start', '', svg);
        drawText(userText.tooHigh, 516, blockTop + 44, 'formAText', 'start', '', svg);
        drawText(userText.interruptions, 516, blockTop + 70, 'formAText', 'start', '', svg);
        drawText(userText.insertions, 516, blockTop + 96, 'formAText', 'start', '', svg);
        drawText(userText.trgViolation, 661, blockTop + 18, 'formAText', 'start', '', svg);
        drawText(userText.wingRocks, 661, blockTop + 44, 'formAText', 'start', '', svg);
        drawText(userText.disqualified, 661, blockTop + 70, 'formAText', 'start', '', svg);
        drawText(userText.otherNote, 661, blockTop + 96, 'formAText', 'start', '', svg);
    }

    // position and harmony
    switch (formStyle) {
        case 'iac':
        case 'imac':
            blockTop -= 55;
            drawRectangle(553, blockTop, 143, 45, 'formLine', svg);
            drawRectangle(636, blockTop, 60, 45, 'formLineBold', svg);
            drawCircle({ cx: 666, cy: blockTop + 32, r: 2, fill: 'black' }, svg);
            drawText('Presentation', 595, blockTop + 12, 'formATextSmall', 'middle', '', svg);
            drawText($('positioning').value,
                595, blockTop + 34, 'formATextLarge', 'middle', '', svg);
            break;
        default:
            blockTop -= 50;
            drawRectangle(510, blockTop, 143, 40, 'formLine', svg);
            drawRectangle(593, blockTop, 60, 40, 'formLineBold', svg);
            drawCircle({ cx: 623, cy: blockTop + 27, r: 2, fill: 'black' }, svg);
            drawText(userText.positioning, 552, blockTop + 12, 'formATextSmall', 'middle', '', svg);
            drawText($('positioning').value,
                552, blockTop + 32, 'formATextLarge', 'middle', '', svg);

            if ($('harmony').value &&
                $('harmony').value > 0) {
                drawRectangle(668, blockTop, 130, 40, 'formLine', svg);
                drawRectangle(738, blockTop, 60, 40, 'formLineBold', svg);
                drawCircle({ cx: 768, cy: blockTop + 27, r: 2, fill: 'black' }, svg);
                drawText(userText.harmony, 703, blockTop + 12, 'formATextSmall', 'middle', '', svg);
                drawText($('harmony').value,
                    703, blockTop + 32, 'formATextLarge', 'middle', '', svg);
            }
    }

    // figure grading block
    switch (formStyle) {
        case 'iac':
        case 'imac':
            drawRectangle(553, 90, 245, blockTop - 105, 'formLine', svg);
            drawRectangle(583, 110, 215, blockTop - 125, 'formLineBold', svg);
            drawLine(583, 90, 0, 20, 'formLine', svg);
            drawLine(643, 90, 0, blockTop - 105, 'formLine', svg);

            drawText('Fig', 568, 103, 'formATextSmall', 'middle', '', svg);
            drawText('Grade', 615, 103, 'formATextSmall', 'middle', '', svg);
            drawText('Remarks', 724, 103, 'formATextSmall', 'middle', '', svg);

            var y = 110;
            var dy = (blockTop - 125) / figureNr;
            for (let i = 1; i <= figureNr; i++) {
                drawLine(553, y, 246, 0, 'formLine', svg);
                drawText(i, 568, y + (dy / 2) + 5, 'formATextLarge', 'middle', '', svg);
                drawCircle({ cx: 612, cy: roundTwo(y + dy - 15), r: 2, fill: 'black' }, svg);
                y += dy;
            }
            break;
        default:
            drawRectangle(510, 110, 288, blockTop - 120, 'formLine', svg);
            drawRectangle(540, 130, 258, blockTop - 140, 'formLineBold', svg);
            drawLine(540, 110, 0, 20, 'formLine', svg);
            drawLine(600, 110, 0, blockTop - 120, 'formLine', svg);
            drawLine(648, 110, 0, blockTop - 120, 'formLine', svg);

            drawText('Fig', 525, 123, 'formATextSmall', 'middle', '', svg);
            drawText('Grade', 570, 123, 'formATextSmall', 'middle', '', svg);
            drawText('Pos', 624, 123, 'formATextSmall', 'middle', '', svg);
            drawText('Remarks', 724, 123, 'formATextSmall', 'middle', '', svg);

            var y = 130;
            var dy = (blockTop - 140) / figureNr;
            for (let i = 1; i <= figureNr; i++) {
                drawLine(510, y, 289, 0, 'formLine', svg);
                drawText(i, 525, y + (dy / 2) + 5, 'formATextLarge', 'middle', '', svg);
                drawCircle({ cx: 569, cy: roundTwo(y + dy - 15), r: 2, fill: 'black' }, svg);
                y += dy;
            }
    }
    // set correct viewbox and size for the form
    svg.setAttribute("viewBox", '0 0 800 1130');
    svg.setAttribute("width", '100%');
}

// buildHeader will append the sequence header
function buildHeader(svg, logoWidth) {
    switch (formStyle) {
        case 'iac':
            // IAC Forms
            if (activeForm === 'A') {
                drawRectangle(0, 0, 60, 130, 'formLine', svg);
                drawRectangle(60, 0, 740, 50, 'formLine', svg);
                drawRectangle(60, 50, 240, 80, 'formLine', svg);
                drawRectangle(300, 50, 100, 80, 'formLine', svg);
                drawRectangle(400, 50, 120, 80, 'formLine', svg);
                drawRectangle(520, 50, 120, 80, 'formLine', svg);
                drawRectangle(640, 50, 70, 80, 'formLine', svg);
                drawRectangle(710, 50, 89, 80, 'formLineBold', svg);
                drawText(activeForm[0], 30, 75, 'formATextBoldHuge', 'middle', '', svg);
                drawText('INTERNATIONAL AEROBATIC CLUB SCORESHEET', 430, 35, 'formATextLarge', 'middle', '', svg);
                drawText(userText.contest + ':', 65, 70, 'formAText', 'start', '', svg);
                drawText($('location').value, 180, 100, 'formATextMedium', 'middle', '', svg);
                drawText(userText.date + ':', 305, 70, 'formAText', 'start', '', svg);
                drawText($('date').value, 350, 100, 'formATextMedium', 'middle', '', svg);
                drawText(userText.category + ':', 405, 70, 'formAText', 'start', '', svg);
                drawText(userText[sportingClass.value], 460, 95, 'formATextMedium', 'middle', '', svg);
                drawText($('category').value, 460, 115, 'formATextMedium', 'middle', '', svg);
                drawText(userText.programme + ':', 525, 70, 'formAText', 'start', '', svg);
                drawText($('program').value, 580, 100, 'formATextMedium', 'middle', '', svg);
                drawText(userText.pilotnumberIAC1, 645, 70, 'formAText', 'start', '', svg);
                drawText(userText.pilotnumberIAC2, 645, 95, 'formAText', 'start', '', svg);
            } else {
                // sequence info box
                drawRectangle(90, 10, 550, 100, 'formLine', svg);
                drawRectangle(570, 60, 70, 50, 'formLineBold', svg);
                drawLine(90, 60, 550, 0, 'formLine', svg); // ---
                drawLine(140, 10, 0, 50, 'formLine', svg); // |
                drawLine(490, 10, 0, 100, 'formLine', svg);// ||
                drawLine(290, 60, 0, 50, 'formLine', svg); // |
                drawText(activeForm[0], 115, 48, 'formATextBoldHuge', 'middle', '', svg);
                drawText(userText.contest + ':', 150, 25,
                    'formAText', 'start', '', svg);
                drawText($('location').value, 315, 47,
                    'formATextLarge', 'middle', '', svg);
                drawText(userText.category + ':', 500, 25,
                    'formAText', 'start', '', svg);
                drawText(`${userText[sportingClass.value]} ${$('category').value}`, 565, 47,
                    'formATextMedium', 'middle', '', svg);
                drawText(userText.date + ':', 100, 75,
                    'formAText', 'start', '', svg);
                drawText($('date').value, 190, 97,
                    'formATextLarge', 'middle', '', svg);
                drawText(userText.program + ':', 300, 75,
                    'formAText', 'start', '', svg);
                drawText($('program').value, 390, 97,
                    'formATextLarge', 'middle', '', svg);
                drawText(userText.pilotNo, 530, 90,
                    'formAText', 'middle', '', svg);

                // tear-off tab
                drawLine(640, 0, 159, 160, 'formLine', svg);
                drawLine(650, 0, 149, 150, 'dotted', svg);
                drawText(userText.pilot + ': ' +
                    $('pilot').value, 670, 10, 'formAText',
                    'start', 'pilotText', svg);
                // rotate pilot text elements by 45 degr CW
                var el = svg.getElementById('pilotText');
                el.setAttribute('transform', 'rotate(45 ' +
                    el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');

                // check line
                drawLine(799, 420, 0, 460, 'dotted', svg);
                drawText('FREE PROGRAM CHECK BY:', 790, 1080, 'formAText',
                    'start', 'checkByText', svg);
                drawText('(signature/date)', 790, 880, 'formAText', 'start',
                    'signText', svg);
                drawText('A/C: ' + $('actype').value,
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
            break;
        case 'imac':
            // IMAC Forms
            if (activeForm === 'A') {
                drawRectangle(0, 0, 540, 90, 'formLine', svg);
                drawLine(40, 0, 0, 90, 'formLine', svg); //  |
                drawLine(40, 30, 500, 0, 'formLine', svg); // +---------------------------
                drawLine(200, 30, 0, 60, 'formLine', svg); //            |
                drawLine(300, 30, 0, 60, 'formLine', svg); //                   |
                drawText('A', 20, 55, 'formATextBoldXXL', 'middle', '', svg);
                drawText(`${$('date').value} 
                    ${$('program').value}  
                    Scoresheet`,
                    290, 17, 'formATextBold', 'middle', '', svg);
                drawText(`${userText.contest}:`, 45, 45, 'formAText', 'start', '', svg);
                drawText($('location').value, 120, 75, 'formATextMedium', 'middle', '', svg);
                drawText(`${userText.date}:`, 205, 45, 'formAText', 'start', '', svg);
                drawText($('date').value, 250, 75, 'formATextMedium', 'middle', '', svg);
                drawText(`${userText.category}:`, 305, 45, 'formAText', 'start', '', svg);
                drawText($('category').value, 420, 75, 'formATextXL', 'middle', '', svg);
            } else {
                // sequence info box
                drawRectangle(0, 10, 600, 80, 'formLine', svg);
                drawLine(40, 10, 0, 40, 'formLine', svg); //  |
                drawLine(0, 50, 600, 0, 'formLine', svg); // --------------------
                drawLine(160, 50, 0, 40, 'formLine', svg);//      |
                drawText(activeForm[0], 20, 40, 'formATextBoldXXL', 'middle', '', svg);
                drawText(`${userText.contest}:`, 48, 25,
                    'formAText', 'start', '', svg);
                drawText($('location').value, 320, 37,
                    'formATextLarge', 'middle', '', svg);
                drawText($('category').value, 230, 77,
                    'formATextLarge', 'start', '', svg);
                drawText(`${userText.date}:`, 8, 66,
                    'formAText', 'start', '', svg);
                drawText($('date').value, 45, 77,
                    'formATextLarge', 'start', '', svg);
                drawText(`${userText.program}:`, 168, 66,
                    'formAText', 'start', '', svg);
                drawText($('program').value, 590, 77,
                    'formATextLarge', 'end', '', svg);
            }
            break;
        default:
            // CIVA Forms
            drawRectangle(logoWidth, 0, 720 - logoWidth, 65, 'formLine', svg);
            drawText($('location').value + ' ' +
                $('date').value, 425, 33, 'formATextLarge', 'middle', '', svg);
            drawRectangle(720, 0, 79, 65, 'formLine', svg);
            drawText('Form ' + activeForm[0], 760, 33, 'formATextLarge', 'middle', '', svg);
            drawRectangle(logoWidth, 65, 80, 65, 'formLine', svg);
            drawText(userText.pilotID, logoWidth + 5, 75, 'miniFormA', 'start', '', svg);
            drawText($('pilot_id').value, logoWidth + 40, 115, 'formATextHuge', 'middle', '', svg);
            drawRectangle(logoWidth + 80, 65, 640 - logoWidth, 65, 'formLine', svg);
            drawText(
                $('rules').value + ' ' +
                (sportingClass.value === 'glider' ? 'Glider ' : '') +
                $('category').value + ' ' +
                $('program').value,
                475, 105, 'formATextLarge', 'middle', '', svg);
            drawRectangle(720, 65, 79, 65, 'formLine', svg);
            drawText(userText.flightNr, 725, 75, 'miniFormA', 'start', '', svg);
            drawText($('flight_nb').value, 760, 115, 'formATextHuge', 'middle', '', svg);
    }
}

// buildGridHeader appends a header to the Grid form
function addFormElementsGrid(svg) {
    svg.setAttribute("width", '100%');
    svg.setAttribute("height", '100%');
    svg.setAttribute("viewBox", '0 0 800 1130');

    if (/^G\+|D/.test(activeForm)) {
        var children = svg.childNodes;
        for (let i = 0; i < children.length; i++) {
            children[i].setAttribute('transform',
                'translate(0,140) ' +
                (children[i].getAttribute('transform') || ''));
        }

        var logoWidth = 0;
        if (logoImg) {
            var logoSvg = buildLogoSvg(logoImg, 0, 0, 200, 120,
                $('blackWhite').checked);
            svg.appendChild(logoSvg);
            logoWidth = parseInt(logoSvg.getBBox().width) + 32;
        }
        drawText($('location').value + ' ' +
            $('date').value,
            logoWidth, 32, 'formATextHuge', 'start', '', svg);
        // scale down if needed
        var scale = roundTwo((800 - logoWidth) / svg.lastChild.getBBox().width);
        if (scale < 1) {
            svg.lastChild.setAttribute(
                'transform', 'scale(' + scale + ') ' +
                'translate(' + roundTwo(logoWidth / scale - logoWidth) + ',0)');
        }

        drawText(
            $('rules').value + ' ' +
            (sportingClass.value === 'glider' ? 'Glider ' : '') +
            $('category').value + ' ' +
            $('program').value,
            logoWidth, 60, 'formATextXL', 'start', '', svg);

        drawText($('notes').value, logoWidth, 96,
            'formATextXL', 'start', '', svg);
    }
}

// buildScoreColumn will append the righthand scoring column
function buildScoreColumn(svg) {
    switch (formStyle) {
        case 'iac':
            drawRectangle(580, 130, 120, 50, 'formLine', svg);
            drawText('Item', 650, 155, 'formAText', 'middle', '', svg);
            drawRectangle(700, 130, 40, 50, 'formLine', svg);
            drawText('K', 720, 155, 'formAText', 'middle', '', svg);
            drawRectangle(740, 130, 59, 50, 'formLine', svg);
            drawText('Score', 770, 155, 'formAText', 'middle', '', svg);

            drawRectangle(580, 180, 120, 50, 'formLine', svg);
            drawText('Presentation', 590, 205, 'formATextBold', 'start', '', svg);
            drawRectangle(700, 180, 40, 50, 'formLine', svg);
            drawText($('positioning').value, 720, 205,
                'formATextLarge', 'middle', '', svg);
            drawRectangle(740, 180, 59, 50, 'formLineBold', svg);
            drawLine(740, 180, 0, 50, 'formLine', svg);

            drawText('FIGURE TOTAL K =', 590, 270, 'formAText', 'start', '', svg);
            drawRectangle(740, 240, 59, 40, 'formLine', svg);
            drawText('INC. PRESENTATION =', 590, 320, 'formAText', 'start', '', svg);
            drawRectangle(740, 290, 59, 40, 'formLine', svg);

            drawText(figureK, 770, 265, 'formATextLarge', 'middle', '', svg);
            var totalK = figureK;
            if (parseInt($('positioning').value)) {
                totalK += parseInt($('positioning').value);
            }

            drawText(totalK, 770, 315, 'formATextLarge', 'middle', '', svg);

            drawRectangle(590, 340, 209, 60, 'formLine', svg);
            drawText('Aircraft type:', 600, 355, 'formAText', 'start', '', svg);
            drawText($('actype').value, 695, 380,
                'formATextLarge', 'middle', '', svg);

            // "checked by" block
            drawRectangle(640, 430, 159, 280, 'formLine', svg);
            drawLine(695, 430, 0, 280, 'formLine', svg);
            drawLine(750, 430, 0, 280, 'formLine', svg);
            drawLine(750, 610, 49, 0, 'formLine', svg);
            drawText('FREE PROGRAM CHECKED BY:', 630, 700, 'formAText', 'start', 'checkedBy1', svg);
            drawText('Signature:', 655, 700, 'formAText', 'start', 'checkedBy2', svg);
            drawText('Printed Name:', 710, 700, 'formAText', 'start', 'checkedBy3', svg);
            drawText('IAC No:', 765, 700, 'formAText', 'start', 'checkedBy4', svg);
            drawText('Date:', 765, 600, 'formAText', 'start', 'checkedBy5', svg);
            // rotate all text elements by 90 degr CCW
            for (let i = 1; i < 6; i++) {
                var el = svg.getElementById('checkedBy' + i);
                el.setAttribute('transform', 'rotate(-90 ' +
                    el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
            }

            // judge details
            var y = 740;
            drawRectangle(590, y, 209, 75, 'formLine', svg);
            drawLine(590, y + 50, 209, 0, 'formLine', svg);
            drawText('Judge', 595, y + 15, 'formAText', 'start', '', svg);
            drawText(
                'Name:',
                595,
                y + 15 + parseInt(style.formAText.match(/font-size[ ]*:[ ]*(\d+)px/)[1]),
                'formAText',
                'start',
                '',
                svg);
            drawText('IAC #', 595, y + 67, 'formAText', 'start', '', svg);

            // assistant details
            var y = 830;
            drawRectangle(590, y, 209, 75, 'formLine', svg);
            drawLine(590, y + 50, 209, 0, 'formLine', svg);
            drawText('Assistant', 595, y + 15, 'formAText', 'start', '', svg);
            drawText(
                'Name:',
                595,
                y + 15 + parseInt(style.formAText.match(/font-size[ ]*:[ ]*(\d+)px/)[1]),
                'formAText',
                'start',
                '',
                svg);
            drawText('IAC #', 595, y + 67, 'formAText', 'start', '', svg);
            break;
        case 'imac':
            // Sound box
            drawRectangle(540, 120, 260, 70, 'formLine', svg);
            drawLine(740, 120, 0, 20, 'formLine', svg);
            drawLine(540, 140, 260, 0, 'formLine', svg);
            drawRectangle(740, 140, 59, 50, 'formLineBold', svg);
            drawText('Item', 640, 134, 'formAText', 'middle', '', svg);
            drawText('Score', 770, 134, 'formAText', 'middle', '', svg);
            drawText('Sound', 550, 170, 'formATextBoldLarge', 'start', '', svg);

            // Pilot/Panel box
            drawRectangle(540, 210, 260, 70, 'formLine', svg);
            drawLine(740, 210, 0, 20, 'formLine', svg);
            drawLine(540, 230, 260, 0, 'formLine', svg);
            drawRectangle(740, 230, 59, 50, 'formLineBold', svg);
            drawText('Item', 640, 224, 'formAText', 'middle', '', svg);
            drawText('Yes/No', 770, 224, 'formAText', 'middle', '', svg);
            drawText('Pilot/Panel', 550, 260, 'formATextBoldLarge', 'start', '', svg);

            // Air Space Control box
            drawRectangle(540, 300, 260, 70, 'formLine', svg);
            drawLine(740, 300, 0, 20, 'formLine', svg);
            drawLine(540, 320, 260, 0, 'formLine', svg);
            drawRectangle(740, 320, 59, 50, 'formLineBold', svg);
            drawText('Item', 640, 314, 'formAText', 'middle', '', svg);
            drawText('Score', 770, 314, 'formAText', 'middle', '', svg);
            drawText('Air Space Control', 550, 350, 'formATextBoldLarge', 'start', '', svg);

            // Total K
            drawRectangle(740, 400, 59, 40, 'formLine', svg);
            drawText('TOTAL K =', 620, 425, 'formATextLarge', 'start', '', svg);
            drawText(figureK, 770, 425, 'formATextBoldLarge', 'middle', '', svg);

            // pilot and A/C Type block
            drawLine(680, 480, 0, 580, 'dotted', svg);
            drawLine(770, 480, 0, 580, 'dotted', svg);
            function rotateLeft90(el) {
                el.setAttribute('transform', 'rotate(-90 ' +
                    el.getAttribute('x') + ' ' + el.getAttribute('y') + ')');
            }
            var el = drawText($('pilot').value, 666, 1055, 'formATextHuge', 'start', '', svg);
            rotateLeft90(el);
            el = drawText('pilot', 700, 1055, 'formATextLarge', 'start', '', svg);
            rotateLeft90(el);
            el = drawText($('actype').value, 756, 1055, 'formATextHuge', 'start', '', svg);
            rotateLeft90(el);
            el = drawText('A/C Type', 790, 1055, 'formATextLarge', 'start', '', svg);
            rotateLeft90(el);
            break;
        default:
            // CIVA forms
            drawRectangle(620, 130, 60, 50, 'formLine', svg);
            drawText('Item', 650, 155, 'formAText', 'middle', '', svg);
            drawRectangle(680, 130, 40, 50, 'formLine', svg);
            drawText('K', 700, 155, 'formAText', 'middle', '', svg);
            drawRectangle(720, 130, 79, 50, 'formLine', svg);
            drawText('Grade', 760, 155, 'formAText', 'middle', '', svg);

            // Positioning
            drawRectangle(620, 180, 60, 50, 'formLine', svg);
            drawText('Pos.', 650, 205, 'formAText', 'middle', '', svg);
            drawRectangle(680, 180, 40, 50, 'formLine', svg);
            drawText($('positioning').value, 700, 205, 'formATextLarge', 'middle', '', svg);
            if (!$('harmony').value) {
                drawRectangle(720, 180, 79, 50, 'formLineBold', svg);
            }
            drawLine(760, 180, 0, 50, 'formLine', svg);

            // Harmony
            if ($('harmony').value) {
                drawRectangle(620, 230, 60, 50, 'formLine', svg);
                drawText('Harm.', 650, 255, 'formAText', 'middle', '', svg);
                drawRectangle(680, 230, 40, 50, 'formLine', svg);
                drawText($('harmony').value, 700, 255, 'formATextLarge', 'middle', '', svg);
                drawRectangle(720, 180, 79, 100, 'formLineBold', svg);
                drawLine(760, 230, 0, 50, 'formLine', svg);
                drawLine(720, 230, 79, 0, 'formLine', svg);
            }

            drawRectangle(620, 280, 90, 25, 'formLine', svg);
            drawText('Fig K', 665, 295, 'formAText', 'middle', '', svg);
            drawRectangle(710, 280, 89, 25, 'formLine', svg);
            drawText('Total K', 755, 295, 'formAText', 'middle', '', svg);
            drawRectangle(620, 305, 90, 50, 'formLine', svg);
            drawText(figureK, 665, 330, 'formATextLarge', 'middle', '', svg);
            drawRectangle(710, 305, 89, 50, 'formLine', svg);
            var totalK = figureK;
            if (parseInt($('positioning').value)) {
                totalK += parseInt($('positioning').value);
            }
            if (parseInt($('harmony').value)) {
                totalK += parseInt($('harmony').value);
            }

            drawText(totalK, 755, 330, 'formATextLarge', 'middle', '', svg);
            drawRectangle(620, 355, 179, 25, 'formLine', svg);
            drawText('Penalties', 710, 370, 'formATextBold', 'middle', '', svg);
            var penalties = [
                'tooLow',
                'tooHigh',
                'interruptions',
                'insertions',
                'trgViolation',
                'wingRocks',
                'disqualified',
                'otherNote'];
            var y = 380;
            drawRectangle(750, y, 49, penalties.length * 25, 'formLineBold', svg);
            penalties.forEach ((p) => {
                drawRectangle(620, y, 179, 25, 'formLine', svg);
                drawText(userText[p], 628, y + 18, 'formAText', 'start', '', svg);
                y += 25;
            });

            drawRectangle(620, y, 179, 25, 'formLine', svg);
            drawText('Final Freestyle', 710, y + 15, 'formATextBold', 'middle', '', svg);
            drawRectangle(620, y + 25, 80, 50, 'formLine', svg);
            drawText('Duration', 660, y + 50, 'formAText', 'middle', '', svg);
            drawRectangle(700, y + 25, 50, 50, 'formLine', svg);
            drawText('Min', 725, y + 40, 'formAText', 'middle', '', svg);
            drawRectangle(750, y + 25, 49, 50, 'formLine', svg);
            drawText('Sec', 775, y + 40, 'formAText', 'middle', '', svg);
            drawRectangle(700, y + 50, 99, 25, 'formLineBold', svg);

            // judge details
            drawRectangle(620, y + 85, 179, 25, 'formLine', svg);
            drawText('Judges Details', 710, y + 100, 'formATextBold', 'middle', '', svg);
            drawRectangle(620, y + 110, 179, 160, 'formLineBold', svg);
            drawLine(620, y + 170, 179, 0, 'formLine', svg);
            drawLine(620, y + 220, 179, 0, 'formLine', svg);
            drawText('Signature', 628, y + 128, 'formAText', 'start', '', svg);
            drawText('Name', 628, y + 188, 'formAText', 'start', '', svg);
            drawText('Number', 628, y + 238, 'formAText', 'start', '', svg);
    }
}

// buildCornertab will append the righthand corner cut-off tab
function buildCornertab(svg) {
    drawLine(620, 1130, 179, -180, 'formLine', svg);
    drawLine(680, 1120, 110, -110, 'dotted', svg);
    drawLine(730, 1120, 60, -60, 'dotted', svg);
    // Add pilot's name
    if ($('pilot').value) {
        var newText = document.createElementNS(svgNS, "text");
        newText.setAttribute('style', style.formATextBold);
        newText.setAttribute('text-anchor', 'middle');
        newText.setAttribute('x', 730);
        newText.setAttribute('y', 1060);
        newText.setAttribute('transform', 'rotate(-45 730 1060)');
        var textNode = document.createTextNode($('pilot').value);
        newText.appendChild(textNode);
        svg.appendChild(newText);
    }
    // Add pilot text
    var newText = document.createElementNS(svgNS, "text");
    newText.setAttribute('style', style.formAText);
    newText.setAttribute('text-anchor', 'middle');
    newText.setAttribute('x', 780);
    newText.setAttribute('y', 1035);
    newText.setAttribute('transform', 'rotate(-45 780 1035)');
    var textNode = document.createTextNode(userText.pilot);
    newText.appendChild(textNode);
    svg.appendChild(newText);
    // Add aircraft info
    if (aircraft()) {
        var newText = document.createElementNS(svgNS, "text");
        newText.setAttribute('style', style.formATextBold);
        newText.setAttribute('text-anchor', 'middle');
        newText.setAttribute('x', 755);
        newText.setAttribute('y', 1085);
        newText.setAttribute('transform', 'rotate(-45 755 1085)');
        if (formStyle == 'iac') {
            var textNode = document.createTextNode($('acreg').value);
        } else {
            var textNode = document.createTextNode(aircraft());
        }
        newText.appendChild(textNode);
        svg.appendChild(newText);
    }
    // Add aircraft text
    var newText = document.createElementNS(svgNS, "text");
    newText.setAttribute('style', style.formAText);
    newText.setAttribute('text-anchor', 'middle');
    newText.setAttribute('x', 785);
    newText.setAttribute('y', 1080);
    newText.setAttribute('transform', 'rotate(-45 785 1080)');
    var textNode = document.createTextNode(userText.ac);
    newText.appendChild(textNode);
    svg.appendChild(newText);
}

// activeFileName will return the current active file name, or create a
// default file name. The result is appended with 'append' when supplied
function activeFileName(append) {
    append = append || '';
    if (!fileName.innerText) {
        var fname = $('location').value + ' ';
        if (sportingClass.value == 'glider') fname += 'Glider ';
        fname += $('category').value + ' ' +
            $('program').value + ' ' +
            $('pilot').value;
        fname = sanitizeSpaces(fname);
        updateSaveFilename(fname);
    } else {
        fname = fileName.innerText;
    }
    fname += append;
    return fname;
}

// saveImageSizeAdjust will adjust the "Saving PNG or SVG" width or
// height, whichever is relevant
function saveImageSizeAdjust() {

    // Update the page set first
    updatePrintPageSetValue();

    var
        string = $('printPageSetString').value.toUpperCase(),
        count = 0;
    for (let i = 0; i < string.length; i++) {
        if (/[ABCRLG_ ]/.test(string[i]) ||
            (/\d[><]|[TFQ][><=]/.test(string.substring(i, i + 2)))) {
            if (/[BCG]\+|\d[><]|[TFQ][><=]/.test(string.substring(i, i + 2))) {
                i++;
            }
            count++;
        }
    }

    // multiply this if doing printMulti
    if (fileList.length > 1) count = count * fileList.length;

    // calculate ratio (Y / X) in base units
    var ratio = ((count * 1130) +
        ((count - 1) * $('pageSpacing').value)) / 800;

    if (this && this.id === 'imageHeight') {
        $('imageWidth').value = parseInt(this.value / ratio);
    }
    $('imageHeight').value = parseInt($('imageWidth').value * ratio);

}

// saveSVG will save an SVG image as selected in print/save dialog
function saveSVG() {
    // save file after checking rules
    checkRules(function (data) {
        buildForms(false, function (svg) {
            saveFile(
                svg,
                activeFileName(),
                '.svg',
                { 'name': 'SVG file', 'filter': '.svg' },
                'image/svg+xml;utf8'
            );
            draw();
        });
    });
}

// savePNG will save a PNG image as selected in print/save dialog
function savePNG() {
    infoBox(userText.convertingToPng, userText.convertingTitle);

    // wrap conversion in try, in case it fails
    try {
        buildForms(false, function (svg) {
            svgToPng(svg, function (canvas) {
                //        steg.encode (activeSequence.xml, canvas.toDataURL()).toBlob(function(blob){
                canvas.toBlob(function (blob) {
                    saveFile(
                        blob,
                        activeFileName(),
                        '.png',
                        { 'name': 'PNG file', 'filter': '.png' },
                        'image/png'
                    );
                    infoBox();
                    draw();
                });
            });
        });
    } catch (err) {
        console.log(err.stack);
        infoBox();
        draw();
        alertBox(
            sprintf(userText.convertingFailed, encodeURI(err.stack)),
            userText.convertingTitle);
        return;
    }
}

// saveFigs will save all the figures in the sequence separately in a
// single zip file
function saveFigs() {
    var
        fname = activeFileName(),
        // create new zip object
        zip = new JSZip(),
        // get image filename pattern
        fPattern = $('zipImageFilenamePattern').value,
        // get image width and height
        width = $('saveFigsSeparateWidth').value.replace(/[^0-9]/g, '') + 'px',
        height = $('saveFigsSeparateHeight').value.replace(/[^0-9]/g, '') + 'px',
        i = 0;

    // generate output for saving, not editing
    sequenceEditing = false;
    draw();

    // go through the active form and get each figure from the edit figure
    // box
    function zipFigure() {
        if (i === figures.length) {
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    saveFile(
                        content,
                        fname + ' Form ' + activeForm[0],
                        '.zip',
                        { 'name': 'ZIP file', 'filter': '.zip' },
                        'application/zip',
                        {noSequenceLink: true}
                    );
                });

            // restore svg to editing mode
            sequenceEditing = true;
            selectFigure(false);
            draw();
        } else if (figures[i].figNr) {
            selectedFigure.id = i;
            displaySelectedFigure();
            var svg = $('selectedFigureSvg');
            if (!$('saveFigsSeparateFigureNumbers').checked) {
                svg.getElementsByClassName('figNr')[0].remove();
            }
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            // convert svg object to string
            svg = new XMLSerializer().serializeToString(svg);
            // create correct image filename
            var fName = fPattern;
            fName = fName.replace(/%pilot/g, $('pilot').value);
            fName = fName.replace(/%aircraft/g, aircraft());
            fName = fName.replace(/%location/g, $('location').value);
            fName = fName.replace(/%date/g, $('date').value);
            fName = fName.replace(/%class/g, sportingClass.value);
            fName = fName.replace(/%rules/g, $('rules').value);
            fName = fName.replace(/%category/g, $('category').value);
            fName = fName.replace(/%program/g, $('program').value);
            fName = fName.replace(/%form/g, activeForm[0]);
            fName = fName.replace(/%figure/g, figures[i].seqNr);
            if ($('saveFigsSeparateImageFormat').value == 'png') {
                // rasterize canvas to png data URL (without data URL info) and
                // put in ZIP file
                svgToPng(svg, function (png) {
                    zip.file(
                        fName.trim() + '.png',
                        png.toDataURL().replace(/^data:[^,]*,/, ''),
                        { base64: true }
                    );
                    i++;
                    zipFigure();
                });
            } else {
                // convert svg to standalone
                svg = '<?xml version="1.0" standalone="no"?>\n' +
                    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.2//EN" ' +
                    '"http://www.w3.org/Graphics/SVG/1.2/DTD/svg12.dtd">\n' + svg;
                zip.file(fName.trim() + '.svg', svg);
                i++;
                zipFigure();
            }
        } else {
            i++;
            zipFigure();
        }
    }
    zipFigure();

}

// svgToPng will convert an svg to a png image
// The png will be returned as canvas
// If provided, callback will be executed when the canvas has loaded.
// Otherwise, the function will return with the data.
// Use the callback (with function f) when the SVG may include external
// or data: images to make sure these are loaded before toDataURL
function svgToPng(svg, callback) {
    // remove anything before <svg tag and create svg Blob
    svg = new Blob([svg.replace(/^.*?<svg/, '<svg')], { type: "image/svg+xml;charset=utf-8" });

    var
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d"),
        DOMURL = self.URL || self.webkitURL || self,
        img = new Image(),
        url = DOMURL.createObjectURL(svg);

    // temporarily add canvas to document to make sure it will be drawn
    document.lastChild.appendChild(canvas);

    img.onload = function () {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.remove();
        if (callback) callback(canvas); else return canvas;
    }
    // convert svg to canvas
    img.src = url;

}

// savePDF will save any combination of pages as a single PDF
// NOT functional yet!
function savePDF() {
}

// inArray returns all the array keys in 'arr' that hold 'val' as an array
// Only works for numbered arrays!
function inArray(arr, val) {
    var result = [];
    var i = arr.indexOf(val);
    while (i >= 0) {
        result.push(i);
        i = arr.indexOf(val, i + 1);
    }
    if (result.length > 0) return result; else return false;
}

// buildIllegal builds the symbol for an illegal figure
function buildIllegal(i) {
    // create space before the figure
    var paths = [];
    paths = buildShape('FigSpace', 2, paths);
    var angle = dirAttToAngle(Direction, Attitude);
    var dx = Math.cos(angle) * lineElement * 6;
    var dy = - Math.sin(angle) * lineElement * 6;
    paths.push({
        'path': 'l ' + dx + ',' + (dy - lineElement * 6) + ' m ' +
            -dx + ',' + -dy + ' l ' + dx + ',' + (dy + lineElement * 6), 'style': 'illegalCross'
    });
    paths.push({
        'path': 'l ' + dx + ',' + dy + ' l 0,' + (-lineElement * 6) +
            ' l ' + -dx + ',' + -dy + ' z', 'style': 'illegalBox', 'dx': dx, 'dy': dy
    });
    // Create empty space after illegal figure symbol
    paths = buildShape('FigSpace', 2, paths);
    figures[i].paths = paths;
    figures[i].unknownFigureLetter = unknownFigureLetter;
}

// buildMoveTo builds the symbol for a moveto and moves the cursor
// scaling should not affect movement, so divide by scale
function buildMoveTo(dxdy, i) {
    var paths = [];
    if (/^[CL]/.test(activeForm)) dxdy[0] = -dxdy[0];
    paths.push({
        'path': 'l ' + roundTwo(dxdy[0] * (lineElement / scale)) +
            ',' + roundTwo(dxdy[1] * (lineElement / scale)),
        'style': 'dotted',
        'dx': dxdy[0] * (lineElement / scale),
        'dy': dxdy[1] * (lineElement / scale)
    });
    // Create space after the figure
    figures[i].paths = buildShape('FigSpace', 2, paths);
    figures[i].moveTo = dxdy;
}

// buildCurveTo builds the symbol for a curveto and moves the cursor
// scaling should not affect movement, so divide by scale
function buildCurveTo(dxdy, i) {
    var paths = [];
    if (/^[CL]/.test(activeForm)) dxdy[0] = -dxdy[0];
    var angle = dirAttToAngle(Direction, Attitude);
    var dist = Math.sqrt(dxdy[0] * dxdy[0] + dxdy[1] * dxdy[1]);
    var dx = Math.cos(angle) * (lineElement / scale) * dist / 2;
    var dy = - Math.sin(angle) * (lineElement / scale) * dist / 2;

    paths.push({
        'path': 'c ' + roundTwo(dx) + ',' + roundTwo(dy) + ' ' +
            roundTwo(dxdy[0] * (lineElement / scale) - dx) + ',' +
            roundTwo(dxdy[1] * (lineElement / scale) - dy) + ' ' +
            roundTwo(dxdy[0] * (lineElement / scale)) + ',' +
            roundTwo(dxdy[1] * (lineElement / scale)),
        'style': 'dotted',
        'dx': (dxdy[0] * (lineElement / scale)),
        'dy': (dxdy[1] * (lineElement / scale))
    });
    // Create space after the figure
    figures[i].paths = buildShape('FigSpace', 2, paths);
    figures[i].curveTo = dxdy;
}

// buildMoveForward moves the cursor forward
function buildMoveForward(extent, i) {
    if (extent > 0) {
        figures[i].paths = buildShape('FigSpace', extent);
        figures[i].moveForward = extent;
    }
}

// buildMoveDown moves the cursor downward
function buildMoveDown(extent, i) {
    if (extent > 0) {
        figures[i].paths = buildShape('VertSpace', extent);
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
// figureChooser  = Optional argument, true if we are building the
//                  figure for the figure chooser
function buildFigure(figNrs, figString, seqNr, figStringIndex, figureChooser) {
    var
        figNr = figNrs[0],
        roll = [],
        rollSums = [],
        rollPatterns = [],
        rollInfo = [],
        // lowKFlick is set when the K for flick should be low:
        // vertical down after hammerhead, tailslide or after roll element
        lowKFlick = false,
        // entryAxis identifies the axis on which the figure starts
        entryAxis = ((Direction % 180) == 0) ? 'X' : 'Y',
        entryAtt = Attitude,
        entryDir = Direction,
        description = [],
        figCheckLine = '';

    // goFront is set to true for every new figure that starts to front
    if (((Direction == 90) && (Attitude == 0)) || ((Direction == 270) && (Attitude == 180))) {
        goFront = false;
    } else {
        goFront = true;
    }

    var bareFigBase = fig[figNr].base.replace(/[+-]+/g, '');

    // In the first part we handle everything except (rolling) turns
    if (!regexTurn.test(fig[figNr].base)) {
        // First we split the figstring in it's elements, the bareFigBase
        // is empty for rolls on horizontal.
        if (bareFigBase != '') {
            // prevent splitting on bareFigBase inside comments
            if (figString.match(/"/)) {
                var inComment = false;
                var l = bareFigBase.length;
                for (let i = 0; i <= (figString.length - l); i++) {
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
        for (let i = 0; i < fig[figNr].rolls.length; i++) {
            rollPatterns[i] = '';
        }
        // Find the roll patterns
        var regEx = /[\+<\~\^\>]+/g;
        rollPatterns[0] = splitLR[0].replace(regEx, '');
        if (splitLR.length > 1) {
            var moreRolls = splitLR[1].replace(regEx, '').split(')');
            moreRolls.forEach ((r, i) => {
                if (/\(/.test(r)) {
                    rollPatterns[i + 1] = r.replace(/\(/g, '');
                } else {
                    rollPatterns[fig[figNr].rolls.length - 1] = r;
                }
            });
        }

        // Parse the roll patterns and find out where to put rolls, flicks,
        // spins and tumbles
        // We need to do this before building the figure because it can
        // affect our choice of figure
        rollPatterns.forEach ((r, i) => {
            roll[i] = [];
            rollInfo[i] = {
                'gap': [0],
                'pattern': [],
                'flip': [],
                'flipNumber': [],
                'comment': []
            };
            var rollPattern = r;
            rollSums[i] = 0;
            var
                rollSign = (/^[CL]/.test(activeForm)) ? -1 : 1,
                extent = 0,
                subRoll = 0,
                flipRoll = false,
                flipNumber = false,
                inComment = false,
                comment = '';

            if (rollPattern != '') {
                for (let j = 0; j < rollPattern.length; j++) {
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
                                roll[i].push({ 'type': 'line', 'extent': 3, 'load': NegLoad });
                                rollInfo[i].gap[subRoll] += 3;
                                break;
                            case (userpat.rollextshort):
                                // Short line before or after roll, twice the length of
                                // the same pattern in figures.js
                                roll[i].push({ 'type': 'line', 'extent': 1, 'load': NegLoad });
                                rollInfo[i].gap[subRoll]++;
                                break;
                            case (userpat.lineshorten):
                                // Make line before or after roll shorter
                                roll[i].push({ 'type': 'line', 'extent': -1, 'load': NegLoad });
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
                                // Add single flicks, spins and tumbles
                                // When there was a roll before, add a line first
                                var type = {
                                    'f': 'possnap',
                                    's': 'posspin',
                                    'e': 'posShoulderRoll',
                                    'u': 'posRuade',
                                    'l': 'posLomcevak'
                                }[char];
                                if (extent > 0) {
                                    roll[i].push({ 'type': 'line', 'extent': 2, 'load': NegLoad });
                                }
                                roll[i].push({
                                    'type': type,
                                    'extent': rollSign * 360,
                                    'pattern': '1' + char,
                                    'flip': flipRoll,
                                    'flipNumber': flipNumber,
                                    'comment': comment
                                });
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
                                // Add single inverted flicks, spins and tumbles
                                // When there was a roll before, add a line first
                                var type = {
                                    'f': 'negsnap',
                                    's': 'negspin',
                                    'e': 'negShoulderRoll',
                                    'u': 'negRuade',
                                    'l': 'negLomcevak'
                                }[rollPattern.charAt(j + 1)];
                                if (type) {
                                    if (extent > 0) {
                                        roll[i].push({ 'type': 'line', 'extent': 2, 'load': NegLoad });
                                    }
                                    j++;
                                    roll[i].push({
                                        'type': type,
                                        'extent': rollSign * 360,
                                        'pattern': '1i' + rollPattern.charAt(j),
                                        'flip': flipRoll,
                                        'flipNumber': flipNumber,
                                        'comment': comment
                                    });
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
                                    var stops = 0;
                                    // When there was a roll before, add a line first
                                    if (extent > 0) {
                                        var regex = /[fs]/;
                                        if (regex.test(rollPattern)) {
                                            roll[i].push({ 'type': 'line', 'extent': 2, 'load': NegLoad })
                                        } else {
                                            roll[i].push({ 'type': 'line', 'extent': 1, 'load': NegLoad })
                                        }
                                    }

                                    if (rollPattern[j] == '9') {
                                        extent = 720;
                                        // 9 is a double roll. But for non-Aresti it can be
                                        // followed by more numbers to indicate more roll.
                                        // This can not be used for hesitations
                                        // e.g. 96 is 3 1/2 roll
                                        if ($('nonArestiRolls').checked) {
                                            while (rollPattern.charAt(j + 1).match(/[12345679]/)) {
                                                j++;
                                                extent += parseInt({
                                                    1: 360, 2: 180, 3: 270,
                                                    4: 90, 5: 450, 6: 540, 7: 630,
                                                    9: 720
                                                }[rollPattern[j]]);
                                            }
                                        }
                                    } else if (rollPattern.charAt(j + 1).match(/[0-8]/)) { // use charAt to prevent end-of-string error
                                        // special case: more than 8x8 roll
                                        if (rollPattern.charAt(j + 2).match(/[1-9]/)) { // use charAt to prevent end-of-string error
                                            stops = parseInt(rollPattern[j + 2]);
                                            extent = parseInt(rollPattern.substring(j, j + 2)) * (360 / stops);
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
                                                'l': 'negLomcevak'
                                            }[rollPattern.charAt(j + 2)];
                                            if (type) {
                                                j += 2;
                                                if (!stops) {
                                                    roll[i].push({
                                                        'type': type,
                                                        'extent': rollSign * extent,
                                                        'pattern': rollPattern.substring(startJ, j + 1),
                                                        'flip': flipRoll,
                                                        'flipNumber': flipNumber,
                                                        'comment': comment
                                                    });
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
                                                'l': 'posLomcevak'
                                            }[rollPattern.charAt(j + 1)];
                                            j++;
                                            if (!stops) {
                                                roll[i].push({
                                                    'type': type,
                                                    'extent': rollSign * extent,
                                                    'pattern': rollPattern.substring(startJ, j + 1),
                                                    'flip': flipRoll,
                                                    'flipNumber': flipNumber,
                                                    'comment': comment
                                                });
                                            } else {
                                                illegalSnapSpin = rollPattern.substring(j, j + 1);
                                            }
                                            break;
                                        default:
                                            roll[i].push({
                                                'type': 'roll',
                                                'extent': rollSign * extent,
                                                'stops': stops,
                                                'pattern': rollPattern.substring(startJ, j + 1),
                                                'flip': flipRoll,
                                                'flipNumber': flipNumber,
                                                'comment': comment
                                            });
                                    }
                                    if (illegalSnapSpin) {
                                        alertMsgs.push('(' + seqNr + ') ' +
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
                                        roll[i].push({ 'type': 'line', 'extent': 2, 'load': NegLoad });
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
                                    }
                                    rollSums[i] += rollSign * extent;
                                    if (extent != 0) {
                                        rollInfo[i].pattern[subRoll] = rollPattern.substring(startJ, j + 1);
                                        rollInfo[i].flip[subRoll] = flipRoll;
                                        rollInfo[i].flipNumber[subRoll] = flipNumber;
                                        rollInfo[i].comment[subRoll] = comment;
                                        subRoll++;
                                        rollInfo[i].gap[subRoll] = 0;
                                        roll[i].push({
                                            'type': 'slowroll',
                                            'extent': rollSign * extent,
                                            'stops': 0,
                                            'pattern': rollPattern.substring(startJ, j + 1),
                                            'flip': flipRoll,
                                            'flipNumber': flipNumber,
                                            'comment': comment
                                        });
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
        });
        // Set the number of the first roll for drawing later on
        // To do this we check the fig.pattern for a roll match before the base
        var rollnr = regexRollBeforeBase.test(fig[figNr].pattern) ? 0 : 1;

        // If there are multiple figNrs we check the rolls to see which one
        // matches best. It's very important that with different figures with
        // the same figure base the roll total is equal in the figures.js file
        if (figNrs.length > 1) {
            // Set rollCorrMin to infinity to start with so the
            // first correction will allways be smaller
            var rollCorrMin = Infinity;
            figNrs.forEach ((fn) => {
                var rollCorr = 0;
                roll.forEach ((r, i) => {
                    if (fig[fn].rolls[i] == 2) {
                        // half roll symbol at this position in fig[xx].rolls[yy]
                        rollCorr += Math.abs((rollSums[i] + 180) % 360);
                    } else if (/[^34]/.test(fig[fn].rolls[i])) {
                        // full or no roll symbol at this position in fig[xx].rolls[yy]
                        // 'no roll' can be no roll line at all (rolls[j] undefined)
                        // or only line without roll allowed as in some P-loops
                        // (rolls[j] = 9)
                        rollCorr += Math.abs(rollSums[i] % 360);
                        // The (rare) figures with a "no roll allowed" element are complementary
                        // to similar figures with a roll allowed. Whenever a roll is chosen in
                        // this element, make the "no roll allowed" figure less likely to be chosen
                        // by adding 360 to the rollCorr.
                        if (r.length && fig[fn].rolls[i] == 9) rollCorr += 360;
                    }
                });
                if (rollCorr < rollCorrMin) {
                    rollCorrMin = rollCorr;
                    figNr = fn;
                    rollnr = regexRollBeforeBase.test(fig[figNr].pattern) ? 0 : 1;
                }
            });
            var figureDraw = fig[figNr].draw;
        } else var figureDraw = fig[figNrs[0]].draw;
    } else var figureDraw = fig[figNrs[0]].draw;
    // The chosen figure is now final, so we can:
    // * assign Aresti Nr and K Factor to the figure
    // * fix the figNr in the figures object
    // * remove rolls where only line shortening/lengthening is allowed
    var arestiNrs = new Array(fig[figNr].aresti);
    if (!fig[figNr].kRules) {
        if ((sportingClass.value === 'glider') && fig[figNr].kGlider) {
            var kFactors = [parseInt(fig[figNr].kGlider)];
        } else {
            var kFactors = [parseInt(fig[figNr].kPwrd)];
        }
    } else var kFactors = [parseInt(fig[figNr].kRules)];
    figures[figStringIndex].figNr = figNr;
    figCheckLine = fig[figNr].aresti;

    // consolidate gaps for lines without rolls
    roll.forEach ((r, i) => {
        if (fig[figNr].rolls[i] === 9) {
            for (let j = 0; j < r.length; j++) {
                if (r[j].type !== 'line') {
                    r.splice(j, 1);
                    j--;
                }
            }
            rollSums[i] = 0;
            var gap = rollInfo[i].gap.reduce ((a,b) => parseInt(a) + parseInt(b));
            rollInfo[i] = { gap: [gap], pattern: [], comment: [] };
        }
    });
    // If we are not in Form A we check for entry and exit extension
    // and shortening and apply them
    var entryExt = 0;
    var exitExt = 0;
    if (activeForm !== 'A') {
        // get position for the base (1) OR the roll(s) on a horizontal (2)
        if (bareFigBase != '') {
            var basePos = figString.indexOf(bareFigBase);
        } else {
            stringLoop:
            for (let i = 0; i < figString.length; i++) {
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
        for (let i = 0; i < figString.length; i++) {
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

    figures[figStringIndex].unknownFigureLetter = unknownFigureLetter;

    // Now we go through the drawing instructions
    var
        lineLength = 0,
        lineSum = 0,
        lineDraw = false,
        rollTop = false,
        afterRoll = false,
        comment = false,
        // Build the start of figure symbol
        paths = buildShape('FigStart',
            {
                'seqNr': seqNr,
                'first': firstFigure,
                'figId': figStringIndex
            },
            paths),
        entryLine = true;

    // add any paths that were already provided
    // (e.g. for autocorrect red circle)
    if (figures[figStringIndex].paths) {
        figures[figStringIndex].paths.forEach((p) => { paths.push(p); });
    }

    for (let i = 0; i < figureDraw.length; i++) {
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
                        lineSum = Math.max(lineSum, 1);
                        var params = [lineSum];
                        lineLength += lineSum;
                    } else var params = [0.02];
                    if (afterRoll) {
                        params.push('roll' + (rollnr - 1) + '-gap' + gapnr);
                        roll[rollnr - 1].lineLengthAfter = lineSum;
                    }
                    if (entryLine) {
                        params.push('entry');
                        figures[figStringIndex].entryLength = lineSum;
                        entryLine = false;
                    }

                    paths = buildShape('Line', params, paths);
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
                rollInfo[rollnr].attitude = Attitude;
                rollInfo[rollnr].negLoad = NegLoad;
                // Make a space on the figCheckLine before every possible roll
                figCheckLine += ' ';
                // mark rolls in the top
                if (rollTop) rollInfo[rollnr].rollTop = true;
                if (roll[rollnr]) {
                    var
                        rollPaths = [],
                        rollSum = 0,
                        rollDone = false,
                        attChanged = 0,
                        gapnr = 0;

                    roll[rollnr].forEach ((r, i) => {
                        // Build line elements after all extensions and shortenings have been processed
                        if (r.type != 'line') {
                            if (lineDraw) {
                                // set a fixed distance for rolls in the top
                                if (rollTop) {
                                    rollPaths = buildShape('Move', [1.2 / scale], rollPaths);
                                } else {
                                    // Minimum gap is 2 units between rolls to assure clear
                                    // roll separation, 1 in other cases.
                                    lineSum = Math.max(lineSum, gapnr > 0 ? 2 : 1);
                                    lineLength += lineSum;
                                    // add roll paths with id for handle
                                    rollPaths = buildShape(
                                        'Line',
                                        [lineSum, `roll${rollnr}-gap${gapnr}`],
                                        rollPaths
                                    );
                                    gapnr++;

                                    r.lineLength = lineSum;
                                }
                                lineDraw = false;
                            } else if (!rollTop) {
                                // add roll paths tiny line with id for handle, except
                                // for rolls in the top
                                rollPaths = buildShape(
                                    'Line',
                                    [0.02, `roll${rollnr}-gap${i}`],
                                    rollPaths
                                );
                                r.lineLength = 0.02;
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
                        if ((r.type == 'possnap') || (r.type == 'negsnap')) {
                            if (((Attitude == 90) || (Attitude == 270)) && lowKFlick) {
                                // Handle snaps on verticals where lowKFlick is set
                                rollAtt = (r.type == 'possnap') ? '+' + rollAtt : '-' + rollAtt;
                            } else if (((rollSum % 180) == 0) || (Attitude == 90) || (Attitude == 270)) {
                                // Handle snaps on verticals and from non-knife-edge
                                rollAtt = (NegLoad == 0) ? '+' + rollAtt : '-' + rollAtt;
                            } else {
                                // Handle snaps from knife edge. Use rollSum to find the
                                // previous amount of roll. Use switches to determine
                                // correct virtual load/attitude combination
                                var inv = ((Attitude > 90) && (Attitude < 270));
                                inv = (inv == (((Math.abs(rollSum) - 90) % 360) == 0));
                                inv = (inv == ((rollSum * r.extent) > 0));
                                // 1) Foot up for pos start, foot down for neg start
                                // 2) Foot down for pos start, foot up for neg start
                                rollAtt = inv ? '+' + rollAtt : '-' + rollAtt;
                            }
                        }
                        // set lowKFlick to true after anything but a line
                        if (r.type !== 'line') lowKFlick = true;

                        if (!$('nonArestiRolls').checked) {
                            // Check if spin is allowed on this roll position
                            if (r.type.match(/^(pos|neg)spin$/) &&
                                (fig[figNr].rolls[rollnr] != 4)) {
                                checkAlert(
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
                                if (((r.type == 'posspin') && !NegLoad) ||
                                    ((r.type == 'negspin') && NegLoad)) {
                                    checkAlert(userText.alert.noCrossoverSpin,
                                        false,
                                        seqNr,
                                        'Aresti Catalogue item 26');
                                }
                            }
                        }
                        var thisRoll = rollFig[rollAtt + r.pattern];
                        if (thisRoll) {
                            arestiNrs.push(thisRoll.aresti);
                            if (thisRoll.kRules) {
                                kFactors.push(parseInt(thisRoll.kRules));
                            } else if ((sportingClass.value === 'glider') && (thisRoll.kGlider)) {
                                kFactors.push(parseInt(thisRoll.kGlider));
                            } else {
                                kFactors.push(parseInt(thisRoll.kPwrd));
                            }
                            // Check if there was a roll before the current one and
                            // - add ; or , as appropriate for checking
                            // - when the roll type is the same and not opposite,
                            //   check if nonArestiRolls is checked. Otherwise,
                            //   present warning
                            // - check if there are not more than two subsequent rolls
                            //   when nonArestiRolls is not checked
                            var k = i - 1;
                            while (k > -1) {
                                if (roll[rollnr][k].type != 'line') {
                                    figCheckLine += ((r.extent / roll[rollnr][k].extent) > 0) ? ';' : ',';
                                    break;
                                }
                                k--;
                            }
                            figCheckLine += thisRoll.aresti;
                        } else {
                            // disable non-Aresti rolls
                            if (!$('nonArestiRolls').checked) {
                                if (r.type != 'line') {
                                    rollSums[rollnr] -= r.extent;
                                    r = { 'type': 'line', 'extent': 0 };
                                }
                            }
                        }

                        /** add the roll drawings to rollPaths */
                        switch (r.type) {
                            // Sum line elements
                            case ('line'):
                                lineSum += r.extent;
                                // don't set lineDraw to true for shortenings. This will
                                // prevent drawing a line of minimum length 1 when no
                                // line was present in the figure drawing instructions
                                if (r.extent > 0) lineDraw = true;
                                break;
                            // Build roll elements
                            case ('roll'):
                                rollPaths = buildShape('Roll', Array(
                                    r.extent,
                                    r.stops,
                                    rollTop,
                                    false,
                                    false,
                                    r.comment,
                                    figureChooser ? fig[figNr].rolls[rollnr] : false
                                ),
                                    rollPaths);
                                lineLength += parseInt((Math.abs(r.extent) - 1) / 360) * (10 / lineElement);
                                break;
                            case ('slowroll'):
                                rollPaths = buildShape('Roll', Array(
                                    r.extent,
                                    r.stops,
                                    rollTop,
                                    true,
                                    false,
                                    r.comment), rollPaths);
                                lineLength += parseInt((Math.abs(r.extent) - 1) / 360) * (10 / lineElement);
                                break;
                            case ('possnap'):
                                rollPaths = buildShape('Snap', Array(
                                    r.extent,
                                    0,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case ('negsnap'):
                                rollPaths = buildShape('Snap', Array(
                                    r.extent,
                                    1,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case 'posShoulderRoll':
                                rollPaths = buildShape('ShoulderRoll', Array(
                                    r.extent,
                                    0,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case 'negShoulderRoll':
                                rollPaths = buildShape('ShoulderRoll', Array(
                                    r.extent,
                                    1,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case 'posRuade':
                                rollPaths = buildShape('Ruade', Array(
                                    r.extent,
                                    0,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case 'negRuade':
                                rollPaths = buildShape('Ruade', Array(
                                    r.extent,
                                    1,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case 'posLomcevak':
                                rollPaths = buildShape('Lomcevak', Array(
                                    r.extent,
                                    0,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case 'negLomcevak':
                                rollPaths = buildShape('Lomcevak', Array(
                                    r.extent,
                                    1,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (snapElement075 / lineElement);
                                break;
                            case ('posspin'):
                                rollPaths = buildShape('Spin', Array(
                                    r.extent,
                                    0,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (spinElement / lineElement);
                                break;
                            case ('negspin'):
                                rollPaths = buildShape('Spin', Array(
                                    r.extent,
                                    1,
                                    rollTop,
                                    r.comment),
                                    rollPaths);
                                lineLength += Math.abs(parseInt(r.extent / 360)) * (spinElement / lineElement);
                        }

                        /** update attitude and direction after roll */
                        if (r.type != 'line') {
                            rollSum += r.extent;
                            rollDone = true;
                            // Half rolls and all rolls in the vertical change
                            // direction and possibly attitude
                            if (((rollSum + 180) % 360) == 0) {
                                Attitude = 180 - Attitude;
                                if (Attitude < 0) Attitude += 360;
                                if (/^[CL]/.test(activeForm)) {
                                    changeDir(-Math.abs(rollSum));
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
                    });
                    // completed all rolls of this roll position
                    // set lowKFlick to false for next roll position
                    lowKFlick = false;

                    rollSum = rollSums[rollnr];
                    // See if we have to autocorrect the rolls
                    if (fig[figNr].rolls[rollnr] == 1) {
                        var autoCorr = -(rollSum % 360);
                        // When a line is standing by to be built, build it before
                        // doing the autocorrect
                        if (autoCorr != 0) {
                            if (lineDraw) {
                                // set a fixed distance for rolls in the top
                                if (rollTop) {
                                    rollPaths = buildShape('Move', [1.2 / scale], rollPaths);
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
                                    rollPaths = buildShape('Move', [1.2 / scale], rollPaths);
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
                                    rollPaths = buildShape('Move', [1.2 / scale], rollPaths);
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
                                    rollPaths = buildShape('Move', [1.2 / scale], rollPaths);
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
                                var addRoll = rollAtt + '4';
                                break;
                            case (180):
                                var addRoll = rollAtt + '2';
                                break;
                            case (270):
                                var addRoll = rollAtt + '3';
                                break;
                            default:
                                var addRoll = false;
                        }
                        if (addRoll) {
                            arestiNrs.push(rollFig[addRoll].aresti);
                            if (rollFig[addRoll].kRules) {
                                kFactors.push(parseInt(rollFig[addRoll].kRules));
                            } else if ((sportingClass.value === 'glider') && (rollFig[addRoll].kGlider)) {
                                kFactors.push(parseInt(rollFig[addRoll].kGlider));
                            } else kFactors.push(parseInt(rollFig[addRoll].kPwrd));
                        }
                        alertMsgs.push('(' + seqNr + ') ' + userText.autocorrectRoll);
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
                        paths = buildShape('Curve', topLineAngle, paths);
                        if (rollPaths.length) {
                            // draw the second marker when there was a roll in the top
                            paths = buildShape('RollTopLine', '', paths);
                        } else {
                            // no roll, remove first marker
                            paths[paths.length - 3].path = '';
                        }
                        paths = buildShape('Curve', rollTopAngleAfter - topLineAngle, paths);
                        // Retrieve the movement by the two curve paths
                        var dx = paths[paths.length - 1].dx + paths[paths.length - 3].dx;
                        var dy = paths[paths.length - 1].dy + paths[paths.length - 3].dy;
                        var dxRolls = 0;
                        var dyRolls = 0;

                        // Retrieve the roll path movements
                        rollPaths.forEach ((p) => {
                            if (p.dx) dxRolls += p.dx;
                            if (p.dy) dyRolls += p.dy;
                        });
                        /** fixme: would be nice to have rolls and snaps follow the curve of the
                         *  loop. No consistent method found yet. */
                        paths.push({
                            'path': '',
                            'style': '',
                            'dx': -dx - (dxRolls / 2),
                            'dy': -dy - (dyRolls / 2)
                        });
                    }

                    // Add all the roll paths
                    rollPaths.forEach ((p) => { paths.push(p) });
                    // Move back to the right place at the end of the curve after
                    // a roll in the top
                    if (rollTop) {
                        paths.push({
                            'path': '',
                            'style': '',
                            'dx': dx - (dxRolls / 2),
                            'dy': dy - (dyRolls / 2)
                        });
                    }
                }

                // See if the direction should be changed from default.
                // This is only possible when there was a 1/4, 3/4 etc roll, the
                // attitude is vertical and we did not just come from roll in the top.
                // Only run one X and one Y switch per figure
                if (!rollTop) {
                    figString = checkQRollSwitch(
                        figString,
                        figStringIndex,
                        fig[figNr].pattern,
                        seqNr,
                        rollSum,
                        figureDraw,
                        i,
                        roll,
                        rollnr);
                }

                // The roll drawing has past, so make sure the rollTop variable
                // is set to false
                rollTop = false;
                rollnr++;
                break;
            // handle clovers (figures with fixed 1/4 roll up or down)
            case ('4'):
                paths = buildShape('Roll', Array(90, 0), paths);
                figString = checkQRollSwitch(
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
                if (OLAN.sequence) OLANXSwitch(figStringIndex);

                if (regexChangeDir.test(figString)) {
                    figures[figStringIndex].switchX = true;
                    var prefix = (/^[CL]/.test(activeForm)) ? '' : userpat.moveforward;
                } else {
                    figures[figStringIndex].switchX = false;
                    var prefix = (/^[CL]/.test(activeForm)) ? userpat.moveforward : '';
                }
                paths = buildShape('Turn', prefix +
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
                    // add text to description
                    description.push(sprintf(
                        (angle > 0) ? userText.pullLoop : userText.pushLoop, Math.abs(angle)));
                    // Draw sharp angles for corners less than 180 unless
                    // specifically told to make a curve by '=' symbol
                    if ((Math.abs(angle) < 180) && (figureDraw.charAt(i + 1) != '=')) {
                        paths = buildShape('Corner', angle, paths);
                    } else {
                        // Draw curve. Half size when followed by '/' symbol
                        if (figureDraw.charAt(i + 1) == '/') {
                            curveRadius = curveRadius / 2;
                        }
                        // Check if the next roll should be in the top
                        rollTop = (figureDraw[i + 1] == '!') ? true : false;
                        if ((Math.abs(angle) < 360) && !rollTop) {
                            paths = buildShape('Curve', angle, paths);
                        } else if (rollTop) {
                            // Split any loop with a roll in top so we can use the second
                            // part later to determine the top
                            // We do this by finding the point closest to the center of
                            // looping shape that has Attitude 0 or 180
                            var attTop = Attitude + (angle / 2);
                            var diffTop = ((attTop / 180) - parseInt((attTop + 90) / 180)) * 180;
                            if (Math.abs(diffTop) > 90) {
                                diffTop = ((attTop / 180) - parseInt((attTop - 90) / 180)) * 180;
                            }
                            var angleTop = (angle / 2) - diffTop;

                            var topLineAngle = (angleTop > 0) ? 45 : -45;
                            paths = buildShape('Curve', angleTop - topLineAngle, paths);
                            paths = buildShape('RollTopLine', '', paths);
                            paths = buildShape('Curve', topLineAngle, paths);
                            var rollTopAngleAfter = angle - angleTop;
                        } else {
                            // Split full loops in several parts for drawing. Only used
                            // for loops without a roll in the top. Useful for vertical 8s

                            // Option 1: We add an invisible part to clarify initial loop.

                            if (figureDraw.charAt(i + 1) == '«') {
                                paths = buildShape('Line', [2, false, 'hiddenCurve'], paths);
                                paths = buildShape('Curve', { angle: angle * 0.05, style: 'hiddenCurve' }, paths);
                                paths = buildShape('Curve', angle * 0.95, paths);
                            } else if (figureDraw.charAt(i + 1) == '»') {
                                paths = buildShape('Curve', angle * 0.95, paths);
                                paths = buildShape('Curve', { angle: angle * 0.05, style: 'hiddenCurve' }, paths);
                                paths = buildShape('Line', [2, false, 'hiddenCurve'], paths);
                            } else {
                                paths = buildShape('Curve', { angle: angle * 0.5 }, paths);
                                paths = buildShape('Curve', { angle: angle * 0.5 }, paths);
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
        paths = buildShape('Line', [Math.max(lineSum, 1), 'exit'], paths);
        figures[figStringIndex].exitLength = Math.max(lineSum, 1);
    }

    // Make the end of figure symbol
    paths = buildShape('FigStop', '', paths);
    // Create empty space after each figure
    paths = buildShape('FigSpace', 2, paths);

    // Replace double spaces or a space at the end on the figCheckLine
    // with the fake Aresti code for no roll 0.0.0.0
    while (/(  )|( $)/.test(figCheckLine)) {
        figCheckLine = figCheckLine.replace('  ', ' 0.0.0.0 ').replace(/ $/, ' 0.0.0.0');
    }

    // The figure is complete. Create the final figure object for later
    // processing such as drawing Forms and point & click figure editing
    Object.assign(figures[figStringIndex], {
        description: description,
        paths: paths,
        aresti: arestiNrs,
        k: kFactors,
        seqNr: seqNr,
        rolls: roll,
        rollInfo: rollInfo,
        scale: Math.round((scale - 1) * 10),
        entryExt: entryExt,
        exitExt: exitExt,
        entryAxis: entryAxis,
        entryAtt: entryAtt,
        entryDir: entryDir,
        exitAtt: Attitude,
        exitDir: Direction,
        unknownFigureLetter: unknownFigureLetter,
        checkLine: figCheckLine,
        superFamily: getSuperFamily(arestiNrs,
            sportingClass.value == 'glider' ? 'glider' : $('category').value
        )
    });
    unknownFigureLetter = false;

    // now that the figure is determined, apply marking to figureStart
    var figureStartStyle = getFigureStartStyle(figures[figStringIndex]);
    if (figureStartStyle) {
        var i = 0;
        while (i < paths.length && !paths[i].figureStart) i++;
        while (i < (paths.length - 1) && !paths[i + 1].figureStartEnd) {
            i++;
            switch (figureStartStyle) {
                case "additional":
                    paths[i].style = paths[i].style + "-additional";
                    break;
                case "correct":
                    paths[i].style = paths[i].style + "-correct";
                    break;
                case "error":
                    paths[i].style = paths[i].style + "-error";
                    break;
            }
        }
        // copy update to figures.paths
        figures[figStringIndex].paths = paths;
    }


    // set OLAN.inFigureXSwitchFig (used for OLAN sequence autocorrect) to
    // Infinity when we exit on X axis
    if ((Direction % 180) == 0) OLAN.inFigureXSwitchFig = Infinity;
}

// checkQRollSwitch checks for vertical 1/4 rolls and determines
// roll direction.
// Only run one X and one Y switch per figure
function checkQRollSwitch(figString, figStringIndex, pattern, seqNr, rollSum, figureDraw, fdIndex, roll, rollnr) {
    if (((Attitude == 90) || (Attitude == 270)) && (rollSum % 180)) {
        if (/^[CL]/.test(activeForm)) {
            changeDir(-Math.abs(rollSum));
        } else {
            changeDir(Math.abs(rollSum));
        }
        // find the next angle. Usually this will occur before a new rolling
        // element EXCEPT for tailslides and hammerheads
        var
            nextAngle = 0,
            nextRollExtent = 0,
            nextRollExtentPrev = 0,
            switchVert = false,
            verticalRolls = (pattern.match(
                RegExp('[\\' + figpat.anyroll + '\\' +
                figpat.spinroll + ']', 'g')) || []).length,
            firstRoll = (rollnr == 0) ? true : false;

        for (let i = fdIndex + 1; i < figureDraw.length; i++) {
            if (figureDraw[i] in drawAngles) {
                // found an angle
                nextAngle = drawAngles[figureDraw[i]];
                // break the loop when the angle doesn't bring us back to vertical
                if (nextAngle % 180) break;
            } else if (figureDraw[i] == figpat.fullroll) {
                // see if there are more rolls before any angle. This happens on
                // tailslides and hammers and influences the direction in which we
                // will have to turn to end up correct at the end of the figure
                rollnr++;
                nextRollExtentPrev = nextRollExtent;
                for (let j = 0; j < roll[rollnr].length; j++) {
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

                        var switchDir = regex.test(figString);
                        if (switchDir) figString = figString.replace(regex, "$1");
                        figures[figStringIndex].switchFirstRoll = switchDir;

                        if ((Direction % 180) == 0) {
                            if (((((Attitude == 90) == (Direction == 0)) == (nextAngle > 0)) == goRight) != switchDir) {
                                changeDir(180);
                            }
                            goFront = !goFront;
                        } else {
                            if (((((Attitude == 90) == (Direction == 270)) == (nextAngle > 0)) == goFront) != switchDir) {
                                changeDir(180);
                            }
                            if (updateAxisDir) goFront = !goFront;
                        }
                        updateAxisDir = false;
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
        if ((Direction % 180) == 0) {
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
            if (OLAN.sequence) OLANXSwitch(figStringIndex);
            if (regexSwitchDirX.test(figString)) {
                changeDir(180);
                figures[figStringIndex].switchX = true;
                OLAN.inFigureXSwitchFig = figStringIndex; // used for OLAN auto correct
                // Remove this direction changer from the figure string once
                // applied and no Q roll follows
                if (nextRollExtent == 0) {
                    figString = figString.replace(regexSwitchDirX, '');
                }
            } else figures[figStringIndex].switchX = false;
            // check for the OLAN Humpty Bump direction bug
            if (OLAN.bumpBugCheck) {
                if (regexOLANBumpBug.test(pattern)) {
                    OLAN.bumpBugFigs.push(seqNr);
                    // autocorrect loaded OLAN sequence when applicable
                    if (OLAN.sequence) {
                        if (regexSwitchDirX.test(figString)) {
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
            if (OLAN.sequence && !goFront) {
                goFront = true;
                if (regexSwitchDirY.test(figString)) {
                    figures[figStringIndex].string = figures[figStringIndex].string.replace(regexSwitchDirY, '');
                } else {
                    figures[figStringIndex].string += userpat.switchDirY;
                }
            }
            if (((((Attitude == 90) == (Direction == 90)) == (nextAngle < 0)) == goFront) != switchVert) {
                changeDir(180);
            }
            if (regexSwitchDirY.test(figString)) {
                changeDir(180);
                figures[figStringIndex].switchY = true;
                if (nextRollExtent == 0) {
                    figString = figString.replace(regexSwitchDirY, '');
                }
            } else {
                figures[figStringIndex].switchY = false;
            }
            // check for the OLAN N direction bug
            if (OLAN.bumpBugCheck && figures[figStringIndex].switchX) {
                if (regexOLANNBug.test(pattern)) {
                    OLAN.nBugFigs.push(seqNr);
                }
            }
        }
        if (!(nextRollExtent % 180)) changeDir(-nextRollExtent);
    }
    return figString;
}

// OLANXSwitch:
// when this was an OLAN sequence, check for previous in-figure
// X axis swap and autocorrect the exit of this figure for the
// next round
function OLANXSwitch(figStringIndex) {
    if (OLAN.inFigureXSwitchFig < figStringIndex) {
        if (regexSwitchDirX.test(figures[figStringIndex].string)) {
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
function updateSequence(figNr, figure, replace, fromFigSel, force) {
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
    for (let i = figures.length - 1; i >= 0; i--) {
        if (i == figNr) {
            if (!replace) {
                // Handle (multiple) moveto or curveto
                if (figure.match(regexMoveTo) || figure.match(regexCurveTo)) {
                    var
                        curve = true,
                        dxdy = figure.replace(/[^0-9\,\-]/g, '').split(','),
                        dx = parseInt(dxdy[0]),
                        dy = parseInt(dxdy[1]);
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
                        if ((Math.abs(dx) + Math.abs(dy)) > 0) {
                            figure = curve ? '(' + dx + ',' + dy + ')' : '[' + dx + ',' + dy + ']';
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

    // check if the selected figure id has to be changed
    if ((selectedFigure.id !== null) && updateSelected) {
        if (replace && (figure === '') && (selectedFigure.id === figNr)) {
            selectFigure(false);
        } else if (selectedFigure.id > figNr) {
            if (replace) {
                if (figure === '') selectedFigure.id--;
            } else {
                selectedFigure.id++;
            }
        }
    }

    // remove last added space, update field
    sequenceText.innerText = string.replace(/ $/, '');

    // check for sequence changes
    checkSequenceChanged(force);

    // use automatic positioning if checked
    if (fromFigSel &&
        $('positionClearAuto').checked &&
        (activeForm !== 'FU')) {
        if (replace) {
            // need to get bBox as it hasn't been loaded yet
            figures[figNr].bBox = myGetBBox($('figure' + figNr));
            separateFigure(figNr);
        } else {
            separateFigure(figNr + 1);
        }
    }

    // reselect correct figure
    setFigureSelected(selectedFigure.id);

    // If there is now a move figure before the first real
    // figure, remove that
    for (var i = 0; i < figures.length; i++) {
        if (figures[i].aresti) break;
        if (regexMoveForward.test(figures[i].string) ||
            regexMoveDown.test(figures[i].string) ||
            regexMoveTo.test(figures[i].string) ||
            regexCurveTo.test(figures[i].string)) {
                updateSequence(i, '', true);
                break;
            }
    };
}

// comparePreviousSequence returns the old and new figure numbers that
// are the last ones changed compared to the previous sequence, e.g.:
// "o b4 h3 q" to "o d b h3 q" would return [1,2]
// with no change, the return is [false, false]
function comparePreviousSequence() {
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
function updateXYFlip(m, n) {
    var sub = false;
    var dmn = m - n;
    if (activeSequence.figures[n]) {
        var text = activeSequence.text.substring(0, activeSequence.figures[n].stringStart);
        for (let i = n; i < activeSequence.figures.length; i++) {
            var s = activeSequence.figures[i].string;
            if (s.match(/^e(u|d|j|ja)$/)) sub = true;
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
        updateSequenceText(text);
    }
}

// parseSequence parses the sequence character string
function parseSequence() {
    var
        seqNr = 1,
        subSequence = false,
        comments = false,
        figure = '',
        formBDirection = 0,
        match = false,
        userBuiltRegex = /^\$(\d+\.\d+\.[\d\.]+)?(\(.+\))?([+-].+)$/;

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

    // Remove user-built figures from end of fig object, if applicable
    for (let i = fig.length - 1; i > 0; i--) {
        if (/^non-Aresti /.test((fig[i] || {}).aresti)) {
            fig.splice(i,1);
        } else if (/^\d/.test((fig[i] || {}).aresti)) break;
    }

    figures.forEach ((f, i) => {
        // make sure all paths are empty
        f.paths = [];

        figure = f.string;
        // always start figure LTR for Figures in grid view, except for the
        // first figure of a subsequence. This means
        // we have to correct direction switchers if the figure would start
        // on Y axis on Form B
        if (/^G/.test(activeForm) && !(
            (seqNr == 1 && Direction != 0) || subSequence)) {
            formBDirection += Direction;
            if (formBDirection >= 360) formBDirection -= 360;
            if ((formBDirection === 90) || (formBDirection === 270)) {
                // switch > and ^. Use temporary placeholder #
                figure = figure.replace(regexSwitchDirY, '#').
                    replace(regexSwitchDirX, userpat.switchDirY).
                    replace(/#/g, userpat.switchDirX);
                f.entryAxisFormB = 'Y';
            }
            Direction = (Attitude == 0) ? 0 : 180;
        }

        // See if there is a y-axis flip symbol and activate it, except when
        // - it matches the subSequence code which is similar (/ or //)
        // - the previous figure did not exit on X axis (not applicable
        //   for Grid)
        flipY: if (figure.replace(regexComments, '').match(regexFlipYAxis)) {
            if (!(/^G/.test(activeForm))) {
                for (let j = i - 1; j >= 0; j--) {
                    if (figures[j].aresti) {
                        if (figures[j].exitAxis == 'X') break; else break flipY;
                    }
                }
            }
            setYAxisOffset(180 - yAxisOffset);
        }

        // If this is a user-built figure, append it to fig object
        var match = figure.match(userBuiltRegex);
        if (match) { // under development, DISABLE FOR PRODUCTION!
            var rolls = match[3].match(/\([^)]*\)/g) || [];
            fig.push({
                // Don't allow official Aresti numbers
                aresti: 'non-Aresti ' + ((arestiToFig[match[1]] || rollArestiToFig[match[1]]) ? '' : (match[1] || '')),
                base: match[3][0] + 'x+',
                draw: match[3].replace(/[+-]/g, '').replace(/\([^)]*\)/g, '_'),
                kPwrd: parseInt(((match[2] || '').match(/\((\d+)[:)]/) || [])[1] || 0),
                kGlider: parseInt(((match[2] || '').match(/:(\d+)\)/) || [])[1] || 0),
                pattern: match[3][0] +
                    (rolls.length > 0 ? '$x' : 'x') +
                    (rolls.length > 2 ? Array(rolls.length - 2).fill('($)').join('') : '') +
                    (rolls.length > 1 ? '$+' : '+'),
                rolls: Array(rolls.length).fill(3)
            });
        } else {
            // simplify the string

            // replace `+ by forwardshorten for entry
            var shorten = figure.match(regexEntryShorten);
            if (shorten) {
                figure = figure.replace(regexEntryShorten,
                    new Array(shorten[0].length - shorten[1].length).join(userpat.forwardshorten) +
                    shorten[1]);
            }

            // replace +` by forwardshorten for exit
            var shorten = figure.match(regexExitShorten);
            if (shorten) {
                figure = figure.replace(regexExitShorten, shorten[1] +
                    new Array(shorten[0].length - shorten[1].length).join(userpat.forwardshorten));
            }

            // replace `- by forwardshorten for negative entry
            var shorten = figure.match(regexEntryShortenNeg);
            if (shorten) {
                figure = figure.replace(regexEntryShortenNeg,
                    new Array(shorten[0].length - shorten[1].length + 1).join(userpat.forwardshorten) +
                    shorten[1]);
            }

            // replace -` by forwardshorten for negative exit
            var shorten = figure.match(regexExitShortenNeg);
            if (shorten) {
                figure = figure.replace(regexExitShortenNeg, shorten[1] +
                    new Array(shorten[0].length - shorten[1].length + 1).join(userpat.forwardshorten));
            }

            // replace the second '-' and up (in row) by longforward (reverse for speed)
            // e.g. ---h--- will be ++-h++-
            // if the figure is only - and extensions, e.g. --, disregard last minus
            // e.g. --- will be +--
            if (RegExp('^[-\\' + userpat.forward + '\\' + userpat.lineshorten + ']*$').test(figure)) {
                figure = figure.replace (/-(?=--)/g, userpat.longforward);
            } else figure = figure.replace (/-(?=-)/g, userpat.longforward);

            // replace longforward by 3x forward
            // e.g. -++h- will be -~~~~~~h-
            figure = figure.replace(regexLongForward, userpat.forward + userpat.forward + userpat.forward);
        }

        // Parse out the instructions that are for drawing B and C forms only
        if (figure.match(regexDrawInstr) ||
            (figure.replace(regexMoveForward, '').length == 0) ||
            (figure.replace(regexMoveDown, '').length == 0) ||
            (figure == userpat.subSequence)) {
            // do not do moveTo, curveTo or moveForward on first figure
            if ((figure.charAt(0) == userpat.moveto) && (seqNr > 1)) {
                // Move to new position
                var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
                if ((dxdy[0] >= 0 || dxdy[0] < 0) && (dxdy[1] >= 0 || dxdy[1] < 0)) {
                    buildMoveTo(dxdy, i);
                }
            } else if ((figure.charAt(0) == userpat.curveTo) && (seqNr > 1)) {
                // Curve to new position
                var dxdy = figure.replace(/[^0-9\,\-]/g, '').split(',');
                if ((dxdy[0] >= 0 || dxdy[0] < 0) && (dxdy[1] >= 0 || dxdy[1] < 0)) {
                    buildCurveTo(dxdy, i);
                }
            } else if (regexMoveForward.test(figure) && (seqNr > 1)) {
                // Move forward without connecting line
                var moveFwd = figure.match(regexMoveForward)[0];
                if (parseInt(moveFwd)) {
                    buildMoveForward(parseInt(moveFwd) +
                        moveFwd.length -
                        moveFwd.match(/\d*/)[0].length -
                        1, i);
                } else {
                    buildMoveForward(moveFwd.length, i);
                }
            } else if (regexMoveDown.test(figure)) {
                // Move down without connecting line
                var moveDn = figure.match(regexMoveDown)[0];
                if (parseInt(moveDn)) {
                    buildMoveDown(parseInt(moveDn) + moveDn.length - moveDn.match(/\d*/).length - 1, i);
                } else {
                    buildMoveDown(moveDn.length, i);
                }
            } else if (figure.charAt(figure.length - 1) == userpat.scale) {
                // Change scale
                if (scale != 1) {
                    curveRadius = curveRadius / scale;
                    lineElement = lineElement / scale;
                }
                scale = Math.max(1 + (parseInt(figure.replace(userpat.scale, '')) / 10), 0.1) || 1;
                curveRadius = curveRadius * scale;
                lineElement = lineElement * scale;
                f.scale = true;
                //      } else if (figure.match (regexSequenceOptions)) {
            } else if (figure == userpat.subSequence) {
                // Start subsequence
                firstFigure = true;
                f.subSequence = subSequence = '//';
                if (Attitude == 180) {
                    Attitude = 0;
                    changeDir(180);
                }
            } else if (regexTextBlock.test(figure)) {
                // add text block
                f.paths = buildShape('TextBlock', figure.replace(RegExp(userpat.comment, 'g'), ''), []);
                f.unknownFigureLetter = unknownFigureLetter;
                // set comments, to be applied to the next real figure
                comments = figure.replace(RegExp(userpat.comment, 'g'), '');
                // remove unknownFigureLetter from comments when applicable
                comments = comments.replace(/^@[A-L]/, '');
            }
        } else if (match = figure.match(/^e(ja?|d|u)$/)) {
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
                if (/^[CL]/.test(activeForm)) {
                    Direction = 0;
                    goRight = true;
                } else {
                    Direction = 180;
                    goRight = false;
                }
            } else if (match === 'eu') {
                // Upwind entry 'figure'
                if (/^[CL]/.test(activeForm)) {
                    Direction = 180;
                    goRight = false;
                } else {
                    Direction = 0;
                    goRight = true;
                }
            }
            if (firstFigure) {
                updateSequenceOptions(match);
            } else {
                subSequence = match;
                firstFigure = true;
            }
            f.subSequence = match;
        } else {
            if (userBuiltRegex.test(figure)) {
                // Draw user-built figure
                // Update figure string to the correct format
                match = figure.match(userBuiltRegex);
                figure = (rolls.pop() || '').replace(/[\(\)]/g, '') + '+';
                figure = (
                    match[3][0] +
                    (rolls.shift() || '').replace(/[\(\)]/g, '') +
                    'x' +
                    figure
                ).replace ('x', 'x' + rolls.join(''));
                var base = fig[fig.length-1].base;
                figNrs = [fig.length-1];
            } else {
                // Determination of the base
                // Remove any comments inside the figure and all non-alphabet characters (except -)
                var base = figure.replace(regexComments, '').replace(/[^a-zA-Z\-]+/g, '');
                // Replace any x> format to move forward by x times >
                if (regexMoveForward.test(figure)) {
                    var moveFwd = fig.match(regexMoveForward)[0];
                    if (parseInt(moveFwd)) {
                        figure = figure.replace(regexMoveForward, parseInt(moveFwd) + moveFwd.length - moveFwd.match(/\d*/).length - 1);
                    } else {
                        figure = figure.replace(regexMoveForward, moveFwd.length);
                    }
                }
                // Handle the very special case where there's only an upright
                // or inverted spin
                if (/^-?i?s-?$/.test(base)) {
                    figure = figure.replace(/(\d*i?s)/, "iv$1");
                    base = base.replace(/i?s/, 'iv');
                }
                // To continue determining the base we remove all snap, spin and
                // tumble characters. Handle special case of non-Aresti tri figure
                // Line immediately below is more elegant but causes Safari on iOS to crash
                // base = base.replace(/(?<!tr)i?[fseul]/g, '');
                base = base.replace('tri', '#').replace(/i?[fseul]/g, '').replace('#', 'tri');
                // Handle simple horizontal rolls that change from upright to
                // inverted or vv
                if (base == '-') {
                    if (/^[^a-zA-Z0-9\-\+]*-/.test(figure)) {
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
                if (/^\+e(ja?|d|u)\+$/.test(base) && !firstFigure) {
                    subSequence = true;
                }

                // Handle turns and rolling turns. They do have numbers in the base
                if (/^.j[^w]/.test(base)) {
                    base = figure.replace(/[^a-zA-Z0-9\-\+]+/g, '');
                    if (base.charAt(0) != '-') base = `+${base}`;
                    if (base.charAt(base.length - 1) != '-') base += '+';
                }
                // Retrieve the figNrs (if any) from array figBaseLookup
                var figNrs = figBaseLookup[base];
            }

            // Autocorrect the entry attitude for figures after the first
            // (sub)figure where necessary
            if (!(firstFigure || subSequence)) {
                if ((Attitude == 0 && base[0] == '-') || (Attitude == 180 && base[0] == '+')) {
                    // Show warning, except in Grid view
                    if (!(/^G/.test(activeForm))) {
                        let angle = dirAttToAngle(Direction, Attitude);
                        alertMsgs.push(`(${seqNr}) ${userText[Attitude == 0 ? 'setUpright' : 'setInverted']}`);
                        // draw circle around figure start
                        f.paths = [{
                            'path': `m ${-rollcurveRadius * 1.2 - Math.cos(angle) * 4},${Math.sin(angle) * 4} a${rollcurveRadius * 1.2},${rollcurveRadius * 1.2} 0 1 1 0,0.01`,
                            'style': 'corr'
                        }];
                    }
                    Attitude = 180 - Attitude;
                    changeDir(180);
                }
            }

            if (figNrs) {
                // When the first figure starts negative we make sure the
                // Attitude is inverted and the DRAWING direction stays the same
                if ((firstFigure || subSequence) && (base.charAt(0) == '-')) {
                    Attitude = 180;
                    changeDir(-180);
                }
                // switch default goRight for every figure that starts on X axis
                if ((Direction % 180) == 0) {
                    goRight = ((Direction == 180) == (Attitude == 0));
                }
                // build the figure into the figures object
                buildFigure(figNrs, figure, seqNr, i);
                // check if this is a additional
                if (regexAdditional.test(figure) ||
                    (f.unknownFigureLetter && f.unknownFigureLetter == 'L')) {
                    additionals++;
                    f.additional = true;
                }

                // check if this is the first figure of a subSequence
                if (subSequence) {
                    f.subSequence = subSequence;
                    subSequence = false;
                }

                // add comments when applicable
                if (comments) {
                    f.comments = comments;

                    // add country when applicable
                    var country = false;
                    // check for three-letter flag country in separate "word"
                    var match = comments.match(/\b[A-Z]{3}\b/g);
                    if (match) {
                        for (let j = match.length - 1; j >= 0; j--) {
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
                    f.country = country;
                    if (country) {
                        f.iocCountry = iocCountries[country.toUpperCase()];
                    }

                    comments = false;
                }

                // increase sequence figure number
                seqNr++;
                firstFigure = false;
                // Reset scale to 1 after completing a figure
                if (scale != 1) {
                    curveRadius = curveRadius / scale;
                    lineElement = lineElement / scale;
                    scale = 1;
                }
            } else if (base != '') {
                if (firstFigure) updateSequenceOptions('');
                // No viable figure found, therefore Illegal
                buildIllegal(i);
                if (i == (figures.length - (activeForm === 'FU' ? 2 : 1))) {
                    alertMsgs.push(userText.illegalAtEnd);
                } else {
                    alertMsgs.push(userText.illegalBefore + seqNr);
                }
            }
        }

        // set the exitAxis for every figure, including draw only
        f.exitAxis = ((Direction % 180) == 0) ? 'X' : 'Y';

        // check if this is the changePoint
        if (i === changePoints[1]) {
            // check if the exitAxis has been changed
            if (activeSequence.previousFigures[changePoints[0]].exitAxis !== f.exitAxis) {
                updateXYFlip(changePoints[0] + 1, i + 1);
            }
        }

    });
    // check for floating point correction
    checkFloatingPoint();
    // Check the sequence against the correct rules
    checkRules(function (data) {
        data.alertMsgs.forEach ((a) => {
            alertMsgs.push(a);
            alertMsgRules[a] = data.alertMsgRules[a];
        });
        displayAlerts();
    });
    // check for any OLAN Humpty Bump bug messages
    if (OLAN.bumpBugCheck) {
        var warning = '';
        if (OLAN.bumpBugFigs.length >= 1) {
            warning = `Fig ${OLAN.bumpBugFigs.join(' and ')}`;
            if (OLAN.bumpBugFigs.length < 2) {
                warning += userText.OLANBumpBugWarning;
            } else warning += userText.OLANBumpBugWarningMulti;
        }
        if (OLAN.nBugFigs.length >= 1) {
            warning += 'Fig ' + OLAN.OLAN.nBugFigs.join(' and ');
            if (OLAN.nBugFigs.length < 2) {
                warning += userText.OLANNBugWarning;
            } else warning += userText.OLANNBugWarningMulti;
        }
        if (warning != '') {
            alertBox(warning + userText.OLANBugWarningFooter);
            OLAN.bumpBugFigs = OLAN.nBugFigs = [];
            OLAN.bumpBugCheck = false;
        }
    }
    // Build the last figure stop shape at the last real figure after
    // all's done.
    if (!firstFigure && !(/^(G)|(FU)$/.test(activeForm))) {
        const i = figures.findLastIndex((figure) => figure.aresti);
        // remove space at end of figure
        figures[i].paths.pop();
        figures[i].paths = buildShape('FigStop', true, figures[i].paths);
    }
}

// do initialization when all DOM content has been loaded and device is ready (cordova)
if (platform.cordova) {
    document.addEventListener("deviceready", doOnLoad);
} else {
    document.addEventListener("DOMContentLoaded", doOnLoad, false);
}
