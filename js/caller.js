/*
caller.js

This file is part of OpenAero.

 OpenAero was originally designed by Ringo Massa and built upon ideas
 of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others.

 OpenAero is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 OpenAero is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.

 **************************************************************
 *
 *           CALLER TEXT GENERATION
 *
 * Generates human-readable caller text for each figure in a
 * sequence, suitable for reading figures aloud for pilots or
 * judges during flight. Output is included as a <caller> element
 * in .seq file XML when the enableCaller setting is on.
 *
 * Developed by David Garceau / IMAC / AeroJudge
 *
 **************************************************************/
"use strict";

// ── Token-to-Text Maps ──────────────────────────────────────

// Geometry token angles (absolute degrees) and spoken name.
// Lowercase = pull, uppercase = push. Angle values match
// OA.drawAngles but are always positive here for text generation.
const callerAngleText = {
    'd': { degrees: 45,  name: '' },
    'v': { degrees: 90,  name: '' },
    'z': { degrees: 135, name: '135' },
    'D': { degrees: 45,  name: '' },
    'V': { degrees: 90,  name: '' },
    'Z': { degrees: 135, name: '135' },
    'M': { degrees: 180, name: '' },
    'm': { degrees: 180, name: '' },
    'C': { degrees: 225, name: '' },
    'c': { degrees: 225, name: '' },
    'P': { degrees: 270, name: '' },
    'p': { degrees: 270, name: '' },
    'R': { degrees: 315, name: '' },
    'r': { degrees: 315, name: '' },
    'O': { degrees: 360, name: '' },
    'o': { degrees: 360, name: '' }
};

// Loop tokens (>= 180 degrees) — spoken loop type names
const callerLoopText = {
    'm': 'half loop',
    'c': 'five eighths loop',
    'p': 'three quarter loop',
    'r': 'seven eighths loop',
    'o': 'full loop'
};

// Roll pattern codes → spoken roll text.
// Keys match the pattern strings from figure.rolls[].pattern
// and figure.rollInfo[].pattern[].
const callerRollText = {
    // Standard rolls (from rollTypes in config.js)
    '4':   'quarter roll',
    '2':   'half roll',
    '3':   'three quarter roll',
    '1':   'full roll',
    '5':   'one and a quarter roll',
    '6':   'one and a half roll',
    '7':   'one and three quarter roll',
    '9':   'two rolls',
    '22':  'two of two point roll',
    '32':  'three of two point roll',
    '42':  'four of two point roll',
    '24':  'two of four point roll',
    '34':  'three of four point roll',
    '44':  'four of four point roll',
    '54':  'five of four point roll',
    '64':  'six of four point roll',
    '74':  'seven of four point roll',
    '84':  'eight of four point roll',
    '8':   'two of eight point roll',
    '48':  'four of eight point roll',
    '68':  'six of eight point roll',
    '88':  'eight of eight point roll',
    '108': 'ten of eight point roll',
    '128': 'twelve of eight point roll',
    '148': 'fourteen of eight point roll',
    '168': 'sixteen of eight point roll',

    // Positive snaps (from posFlickTypes — "flick" → "positive snap")
    '2f':  'half positive snap',
    '3f':  'three quarter positive snap',
    '1f':  'full positive snap',
    '5f':  'one and a quarter positive snap',
    '6f':  'one and a half positive snap',
    '7f':  'one and three quarter positive snap',
    '9f':  'two positive snaps',

    // Negative snaps (from negFlickTypes — "neg flick" → "negative snap")
    '2if': 'half negative snap',
    '3if': 'three quarter negative snap',
    '1if': 'full negative snap',
    '5if': 'one and a quarter negative snap',
    '6if': 'one and a half negative snap',
    '7if': 'one and three quarter negative snap',
    '9if': 'two negative snaps',

    // Positive spins (from posSpinTypes)
    '1s':  'one turn positive spin',
    '5s':  'one and a quarter turn positive spin',
    '6s':  'one and a half turn positive spin',
    '7s':  'one and three quarter turn positive spin',
    '9s':  'two turn positive spin',

    // Negative spins (from negSpinTypes)
    '1is': 'one turn negative spin',
    '5is': 'one and a quarter turn negative spin',
    '6is': 'one and a half turn negative spin',
    '7is': 'one and three quarter turn negative spin',
    '9is': 'two turn negative spin'
};

// Roll direction separators — applied between consecutive rolls
// in the same roll section. First roll has no prefix.
const callerSeparatorText = {
    ',': 'opposite',
    ';': 'same direction',
    '.': 'continuation'
};

// Special figure tokens — hammerheads, tailslides, stall pull/push
const callerSpecialText = {
    'h': 'Stall turn to vertical downline',
    'H': 'Stall turn to vertical downline',
    'u': 'Stalled pull hammer to vertical downline',
    'U': 'Stalled push hammer to vertical downline',
    't': 'Wheels down tailslide',
    'T': 'Wheels up tailslide'
};

// Draw tokens that produce no caller text — spacing, modifiers,
// and structural markers. Note: '_' and '!' are handled explicitly
// in the walker, not in this set.
const callerIgnoredTokens = new Set([
    '~',   // Forward fly (spacing only)
    "'",   // Quarter-length forward fly
    '/',   // Half-size loop modifier (visual only)
    '=',   // Exact rendering modifier (visual only)
    '^',   // Half roll position marker (pattern char, not in draw strings)
    '&',   // Any roll position marker (pattern char, not in draw strings)
    '$',   // Spin roll position marker (pattern char, not in draw strings)
    '+',   // Force positive attitude (structural)
    '-',   // Force negative attitude (structural)
    '\u00AB', // « Hidden curve entry (visual only)
    '\u00BB'  // » Hidden curve exit (visual only)
]);

// ── State Model ─────────────────────────────────────────────

// getCallerState - maps OA attitude (0-359) to line position
// and caller attitude for text generation.
function getCallerState(oaAttitude) {
    const att = ((oaAttitude % 360) + 360) % 360;
    const lineMap = {
        0:   'horizontal',
        45:  '45 degree upline',
        90:  'vertical upline',
        135: '45 degree upline',
        180: 'horizontal',
        225: '45 degree downline',
        270: 'vertical downline',
        315: '45 degree downline'
    };
    const attMap = {
        0:   'upright',
        45:  'upright',
        90:  'vertical',
        135: 'inverted',
        180: 'inverted',
        225: 'inverted',
        270: 'vertical',
        315: 'upright'
    };
    return {
        linePosition: lineMap[att],
        callerAttitude: attMap[att]
    };
}

// calculateNetRotation - sums roll extents in a roll section,
// skipping line segments. Returns normalized 0-359.
function calculateNetRotation(rolls) {
    let net = 0;
    for (const roll of rolls) {
        if (roll.type === 'line') continue;
        net += roll.extent;
    }
    return ((net % 360) + 360) % 360;
}

// ── Entry Point ─────────────────────────────────────────────

// generateAllCallerText - called after parseSequence() completes.
// Iterates all figures and generates caller text for each figure
// that has aresti data.
function generateAllCallerText() {
    const figures = OA.figures;
    for (let i = 0; i < figures.length; i++) {
        if (figures[i] && figures[i].aresti) {
            figures[i].caller = generateCallerText(figures[i], i, figures);
        }
    }
}

// ── Utility Functions ────────────────────────────────────────

// getFamilyNumber - extracts the family number (first digit before
// first dot) from a figure's aresti code. Returns 0 for non-Aresti.
function getFamilyNumber(figure) {
    if (!figure.aresti || !figure.aresti[0]) return 0;
    const match = figure.aresti[0].match(/^(\d+)\./);
    return match ? parseInt(match[1]) : 0;
}

// isFamily1Horizontal - checks if figure is a horizontal line
// (aresti 1.1.1.1 through 1.1.1.4)
function isFamily1Horizontal(figure) {
    return figure.aresti[0] && /^1\.1\.1\.[1-4]$/.test(figure.aresti[0]);
}

// isLastArestiFigure - checks if this is the last figure in the
// sequence that has aresti data
function isLastArestiFigure(figure, figIndex, allFigures) {
    for (let i = figIndex + 1; i < allFigures.length; i++) {
        if (allFigures[i] && allFigures[i].aresti) return false;
    }
    return true;
}

// hasActualRolls - returns true if a roll section contains any
// non-line roll entries
function hasActualRolls(rolls) {
    if (!rolls) return false;
    return rolls.some(r => r.type !== 'line');
}

// getCurveName - returns the loop name for an angle drawn as a
// curve (followed by '=' in the draw string). In practice this
// only occurs for the matching quarter loop in P-loop figures.
function getCurveName(degrees) {
    if (degrees === 90) return 'quarter loop';
    return degrees + ' degree loop';
}

// isAdjacentToLoop - checks if a roll position at rollIndex in the
// draw string is directly adjacent to a loop token (>= 180°).
// direction: -1 checks backward (exit), +1 checks forward (entry).
// Returns false if forward-fly (~, ') or ! separates them.
function isAdjacentToLoop(drawString, rollIndex, direction) {
    let j = rollIndex + direction;
    while (j >= 0 && j < drawString.length) {
        const ch = drawString[j];
        // Skip visual-only modifiers that don't break adjacency
        if (ch === '=' || ch === '/' ||
            ch === '\u00AB' || ch === '\u00BB') {
            j += direction;
            continue;
        }
        if (ch === '~' || ch === "'" || ch === '!') return false;
        if (callerAngleText[ch] && callerLoopText[ch.toLowerCase()]) {
            return true;
        }
        return false;
    }
    return false;
}

// isOnEntryLine - checks if a roll position is on the figure's
// first line segment (no geometry or special token before it).
// Scans backward from rollIndex skipping spacing and modifiers.
function isOnEntryLine(drawString, rollIndex) {
    for (let j = rollIndex - 1; j >= 0; j--) {
        const ch = drawString[j];
        if (callerIgnoredTokens.has(ch)) continue;
        // Hit a geometry, special, or roll token → not on entry line
        if (callerAngleText[ch] || callerSpecialText[ch] ||
            ch === '_' || ch === '!') return false;
    }
    return true;
}

// isOnExitLine - checks if a roll position is on the figure's
// last line segment (no geometry or special token after it).
// Scans forward from rollIndex skipping spacing and modifiers.
function isOnExitLine(drawString, rollIndex) {
    for (let j = rollIndex + 1; j < drawString.length; j++) {
        const ch = drawString[j];
        if (callerIgnoredTokens.has(ch)) continue;
        if (callerAngleText[ch] || callerSpecialText[ch] ||
            ch === '_' || ch === '!') return false;
    }
    return true;
}

// ── Roll Text Generation ────────────────────────────────────

// getRollSectionText - generates spoken text for all rolls in
// a single roll section. Handles separators (opposite/same).
function getRollSectionText(rolls, rInfo) {
    const textParts = [];
    let subRollIndex = 0;
    for (const r of rolls) {
        if (r.type === 'line') continue;
        const rollName = callerRollText[r.pattern] || r.pattern;
        let prefix = '';
        if (subRollIndex > 0) {
            if (rInfo.flip[subRollIndex] !== rInfo.flip[subRollIndex - 1]) {
                prefix = 'opposite ';
            } else {
                prefix = 'same direction ';
            }
        }
        textParts.push(prefix + rollName);
        subRollIndex++;
    }
    return textParts.join(', ');
}

// hasSpinInSection - checks if a roll section contains a spin
function hasSpinInSection(rolls) {
    if (!rolls) return false;
    return rolls.some(r =>
        r.type === 'posspin' || r.type === 'negspin');
}

// getSpinEntryText - generates text for a spin entry roll section.
// The spin is combined with "to [line position]", then additional
// rolls are appended with comma separation.
function getSpinEntryText(rolls, rInfo, linePosition) {
    const textParts = [];
    let subRollIndex = 0;
    let spinDone = false;

    for (const r of rolls) {
        if (r.type === 'line') continue;
        const rollName = callerRollText[r.pattern] || r.pattern;

        if (!spinDone && (r.type === 'posspin' || r.type === 'negspin')) {
            textParts.push(rollName + ' to ' + linePosition);
            spinDone = true;
        } else {
            let prefix = '';
            if (subRollIndex > 0) {
                if (rInfo.flip[subRollIndex] !== rInfo.flip[subRollIndex - 1]) {
                    prefix = 'opposite ';
                } else {
                    prefix = 'same direction ';
                }
            }
            textParts.push(prefix + rollName);
        }
        subRollIndex++;
    }
    return textParts.join(', ');
}

// ── Standard Figure Text Generation ─────────────────────────

// generateStandardFigureText - the core algorithm that walks the
// draw string token by token and generates caller text for
// families 1, 3, 5, 6, 7, 8.
function generateStandardFigureText(figure) {
    const drawString = OA.fig[figure.figNr].draw;
    const parts = [];
    let attitude = figure.entryAtt;
    // Determine starting roll index using the same logic as
    // buildFigure() (main.js:17236): if the pattern has a roll
    // marker before the base, rolls start at index 0. Otherwise
    // index 0 is empty and real rolls start at index 1.
    const startRollIdx = regexRollBeforeBase.test(
        OA.fig[figure.figNr].pattern) ? 0 : 1;
    let rollSectionIndex = startRollIdx;
    let insideLoop = false;
    let pendingEntryRoll = null;
    let lastLoopInfo = null; // {isPull, loopName, entryAtt} for inside-loop rolls

    // Detect spin entry: first real roll section contains a spin type
    const isSpinEntry = hasSpinInSection(figure.rolls[startRollIdx]);
    let spinEntrySuppressed = false; // true after suppressing the geometry token before spin

    // Pre-scan: find the index of the last geometry token for Rule 20
    let lastGeoIdx = -1;
    for (let i = 0; i < drawString.length; i++) {
        if (callerAngleText[drawString[i]]) lastGeoIdx = i;
    }

    // Determine if the last geometry token is an angle (not a loop)
    // and has no roll positions after it (rolls after last geo would
    // make Rule 20's "to exit" premature)
    let hasRollAfterLastGeo = false;
    for (let k = lastGeoIdx + 1; k < drawString.length; k++) {
        if (drawString[k] === '_') { hasRollAfterLastGeo = true; break; }
    }
    const lastGeoIsAngle = lastGeoIdx >= 0 &&
        !callerLoopText[drawString[lastGeoIdx].toLowerCase()] &&
        !hasRollAfterLastGeo;

    for (let i = 0; i < drawString.length; i++) {
        const ch = drawString[i];

        // ── Geometry tokens (angles and loops) ──
        if (callerAngleText[ch]) {
            const isLoop = callerLoopText[ch.toLowerCase()] !== undefined;
            const isPull = ch === ch.toLowerCase();
            const isLastGeo = (i === lastGeoIdx) && lastGeoIsAngle;

            // Update attitude using OA.drawAngles
            attitude = (((attitude + OA.drawAngles[ch]) % 360) + 360) % 360;
            const state = getCallerState(attitude);

            // Spin entry: suppress the first angle token (pull/push to
            // vertical). The spin text will include "to vertical [dir]".
            if (isSpinEntry && !spinEntrySuppressed && !isLoop) {
                spinEntrySuppressed = true;
                insideLoop = false;
                continue;
            }

            // Check if this angle is drawn as a curve (followed by '=')
            // making it a loop-like element (e.g., V= = quarter loop in P-loops)
            const isCurve = !isLoop &&
                (i + 1 < drawString.length) && drawString[i + 1] === '=';

            let text;
            if (isLoop || isCurve) {
                const direction = isPull ? 'inside' : 'outside';
                const loopName = isCurve ?
                    getCurveName(callerAngleText[ch].degrees) :
                    callerLoopText[ch.toLowerCase()];
                text = (isPull ? 'Pull ' : 'Push ') +
                    direction + ' ' + loopName;
                // Add exit line position for loops that don't end horizontal
                if (state.linePosition !== 'horizontal') {
                    text += ' to ' + state.linePosition;
                }
                // Store loop info for potential inside-loop roll
                lastLoopInfo = {
                    isPull: isPull,
                    loopName: loopName,
                    entryAtt: (((attitude - OA.drawAngles[ch]) % 360) + 360) % 360,
                    exitAtt: attitude
                };
            } else if (isLastGeo) {
                // Rule 20: fold exit attitude into the last angle token.
                // Include crossbox if the figure exits on Y axis.
                const prefix = isPull ? 'Pull ' : 'Push ';
                const showAngle = (ch.toLowerCase() === 'z');
                const angleStr = showAngle ? '135 ' : '';
                const crossbox = (figure.exitAxis === 'Y' &&
                    figure.entryAxis !== 'Y') ? ' crossbox' : '';
                text = prefix + angleStr + 'to exit ' +
                    state.callerAttitude + crossbox;
            } else {
                // Standard angle: "Pull [angle] to [line position]"
                const prefix = isPull ? 'Pull ' : 'Push ';
                const angleName = callerAngleText[ch].name;
                const angleStr = angleName ? angleName + ' ' : '';
                text = prefix + angleStr + 'to ' + state.linePosition;
            }

            // If there's a pending entry roll, combine with this geometry
            if (pendingEntryRoll && isLoop) {
                text = pendingEntryRoll + ' on entry, ' + text;
                pendingEntryRoll = null;
            } else if (pendingEntryRoll) {
                // Entry roll before a non-loop geometry — shouldn't happen
                // but handle gracefully by outputting separately
                parts.push('Center ' + pendingEntryRoll);
                pendingEntryRoll = null;
            }

            parts.push(text);
            insideLoop = false;
            continue;
        }

        // ── Special tokens (hammerhead, tailslide, stall) ──
        if (callerSpecialText[ch]) {
            parts.push(callerSpecialText[ch]);
            // Attitude updates match buildShape handlers:
            // h/H (makeHammer): OA.attitude = 270 (main.js:3495)
            // t/T (makeTailslide): OA.attitude = 270 (main.js:3557)
            // u/U (makePointTip): changeAtt(180) (main.js:3565)
            if (ch === 'u' || ch === 'U') {
                attitude = (((attitude + 180) % 360) + 360) % 360;
            } else {
                attitude = 270;
            }
            continue;
        }

        // ── ! marker — flags next roll as inside-loop ──
        if (ch === '!') {
            insideLoop = true;
            continue;
        }

        // ── Roll position marker ──
        if (ch === '_') {
            const rolls = figure.rolls[rollSectionIndex];
            const rInfo = figure.rollInfo[rollSectionIndex];

            if (rolls && hasActualRolls(rolls)) {
                // Spin entry: first real roll section with spin gets special text
                if (isSpinEntry && rollSectionIndex === startRollIdx) {
                    const state = getCallerState(attitude);
                    const spinText = getSpinEntryText(
                        rolls, rInfo, state.linePosition);
                    parts.push(spinText);

                    const netRot = calculateNetRotation(rolls);
                    if (netRot === 180) {
                        attitude = 180 - attitude;
                        if (attitude < 0) attitude += 360;
                    }
                    insideLoop = false;
                    rollSectionIndex++;
                    continue;
                }

                // Determine placement context.
                // Priority: inside-loop > loop-adjacent > entry/exit line > center
                let placement;
                if (insideLoop) {
                    placement = 'inside';
                } else if (isAdjacentToLoop(drawString, i, -1)) {
                    placement = 'loopExit';
                } else if (isAdjacentToLoop(drawString, i, 1)) {
                    placement = 'loopEntry';
                } else if (isOnEntryLine(drawString, i)) {
                    placement = 'entry';
                } else if (isOnExitLine(drawString, i)) {
                    placement = 'exit';
                } else {
                    placement = 'center';
                }

                const rollText = getRollSectionText(rolls, rInfo);

                if (placement === 'center') {
                    parts.push('Center ' + rollText);
                } else if (placement === 'entry') {
                    // Roll on entry line — standalone announcement
                    parts.push(rollText + ' on entry');
                } else if (placement === 'exit') {
                    // Roll on exit line — standalone announcement
                    parts.push(rollText + ' on exit');
                } else if (placement === 'loopEntry') {
                    // Roll directly adjacent to loop — buffer for
                    // comma-combination with the following loop
                    pendingEntryRoll = rollText;
                } else if (placement === 'loopExit') {
                    // Roll directly after loop — comma-append
                    if (parts.length > 0) {
                        parts[parts.length - 1] += ', ' +
                            rollText + ' on exit';
                    } else {
                        parts.push(rollText + ' on exit');
                    }
                } else if (placement === 'inside') {
                    // Inside-loop roll — reconstruct loop text with roll.
                    // Preserve any entry roll prefix already on the part
                    // (e.g., "half roll on entry, Pull inside ...")
                    if (parts.length > 0 && lastLoopInfo) {
                        const netRot = calculateNetRotation(rolls);
                        const hasFlip = (netRot === 180);
                        const force = lastLoopInfo.isPull ?
                            'Pull ' : 'Push ';
                        let direction;
                        if (lastLoopInfo.isPull) {
                            direction = hasFlip ?
                                'inside outside ' : 'inside ';
                        } else {
                            direction = hasFlip ?
                                'outside inside ' : 'outside ';
                        }
                        const position = getInsideLoopPosition(
                            lastLoopInfo.entryAtt, lastLoopInfo.isPull);
                        // Compute exit line after loop + inside roll
                        let exitAtt = lastLoopInfo.exitAtt;
                        if (hasFlip) {
                            exitAtt = 180 - exitAtt;
                            if (exitAtt < 0) exitAtt += 360;
                        }
                        const exitState = getCallerState(exitAtt);
                        const exitSuffix = (exitState.linePosition !== 'horizontal') ?
                            ' to ' + exitState.linePosition : '';
                        const loopText = force + direction +
                            lastLoopInfo.loopName + exitSuffix +
                            ' with ' + rollText + ' ' + position;
                        // Check if the current part has an entry roll
                        // prefix (text before the loop's Pull/Push)
                        const prevPart = parts[parts.length - 1];
                        const loopStart = prevPart.indexOf(
                            lastLoopInfo.isPull ? 'Pull ' : 'Push ');
                        if (loopStart > 0) {
                            // Preserve the entry roll prefix
                            parts[parts.length - 1] =
                                prevPart.substring(0, loopStart) + loopText;
                        } else {
                            parts[parts.length - 1] = loopText;
                        }
                    } else {
                        parts.push(rollText);
                    }
                }

                // Track attitude changes from rolls.
                // OA uses 180-attitude for half-roll flips (main.js:17776).
                // This mirrors across horizontal: upright↔inverted on the
                // same line, while vertical (90/270) stays unchanged.
                const netRot = calculateNetRotation(rolls);
                if (netRot === 180) {
                    attitude = 180 - attitude;
                    if (attitude < 0) attitude += 360;
                }
            }

            insideLoop = false;
            rollSectionIndex++;
            continue;
        }

        // All other tokens are ignored (spacing, modifiers)
    }

    // Flush any buffered entry roll that was never combined with a loop
    if (pendingEntryRoll) {
        parts.push('Center ' + pendingEntryRoll);
    }

    return parts.join('.. ');
}

// getInsideLoopPosition - determines "on top" or "at the bottom"
// for inside-loop rolls based on the entry attitude to the loop
// and whether it was a pull (lowercase) or push (uppercase).
// Rule 31 decision matrix:
//   upright + pull → on top    upright + push → at the bottom
//   inverted + pull → at bottom  inverted + push → on top
//   vertical upline → on top    vertical downline → at the bottom
function getInsideLoopPosition(entryAtt, isPull) {
    const state = getCallerState(entryAtt);
    if (state.callerAttitude === 'vertical') {
        return (((entryAtt % 360) + 360) % 360) === 90 ?
            'on top' : 'at the bottom';
    }
    const isUpright = (state.callerAttitude === 'upright');
    if ((isUpright && isPull) || (!isUpright && !isPull)) {
        return 'on top';
    }
    return 'at the bottom';
}

// ── Family-Specific Text Generation ─────────────────────────

// generateFamily1HorizontalText - special case for horizontal
// lines (aresti 1.1.1.x). No geometry text, just rolls.
function generateFamily1HorizontalText(figure) {
    if (!figure.rolls[0] || !hasActualRolls(figure.rolls[0])) {
        return 'Horizontal line';
    }
    const rollText = getRollSectionText(
        figure.rolls[0], figure.rollInfo[0]);
    return 'Horizontal line with ' + rollText;
}

// generateFamily2Text - turns (Family 2). Derives turn angle
// and type from aresti code and pattern.
// For turns, roll data is part of the figure base (e.g., +3j3+),
// NOT in figure.rolls[]. We extract it from the pattern directly.
function generateFamily2Text(figure) {
    // Extract turn angle from aresti second digit
    const aresti = figure.aresti[0];
    const angleDigit = parseInt(aresti.split('.')[1]);
    const turnAngle = angleDigit * 90;

    // Extract turn type and roll digits from OA.fig pattern.
    // Pattern format: +[N]j[type][rollDigits][+-]
    // where type = '' (inside), 'o' (outside), 'io', 'oi'
    const pattern = OA.fig[figure.figNr].pattern;
    const turnMatch = pattern.match(/j(io|oi|o)?(\d*)/i);
    let turnType = '';
    let rollDigits = '';

    if (turnMatch) {
        const modifier = (turnMatch[1] || '').toLowerCase();
        rollDigits = turnMatch[2] || '';

        if (modifier === 'io') {
            turnType = 'alternating inside outside';
        } else if (modifier === 'oi') {
            turnType = 'alternating outside inside';
        } else if (modifier === 'o') {
            turnType = 'outside';
        } else if (rollDigits) {
            turnType = 'inside';
        }
    }

    // Build turn text — no-roll variant is an "aerobatic turn"
    // Rolling turns split into two parts for clarity:
    //   "270 degree rolling turn.. Three rolls inside.."
    // instead of the tongue-twister:
    //   "270 degree inside rolling turn with three rolls.."
    if (!rollDigits) {
        return turnAngle + ' degree aerobatic turn';
    }

    const parts = [];
    parts.push(turnAngle + ' degree rolling turn');

    // Roll description with direction as suffix
    const rollDesc = getTurnRollText(rollDigits);
    if (rollDesc) {
        parts.push(rollDesc + ' ' + turnType);
    }

    return parts.join('.. ');
}

// getTurnRollText - converts turn roll digit string to spoken text.
// Turn digits: '5' = half roll, other = N full rolls, digits sum.
function getTurnRollText(digits) {
    let sum = 0;
    for (const d of digits) {
        sum += (d === '5') ? 0.5 : parseInt(d) || 0;
    }
    if (sum === 0) return '';

    const whole = Math.floor(sum);
    const hasHalf = (sum % 1 !== 0);

    // Map common values to spoken text
    const wholeText = {
        0: '', 1: 'one', 2: 'two', 3: 'three', 4: 'four'
    };

    if (whole === 0 && hasHalf) return 'half roll';
    if (whole === 1 && !hasHalf) return 'full roll';
    if (hasHalf) {
        return (wholeText[whole] || whole) +
            ' and a half rolls';
    }
    return (wholeText[whole] || whole) + ' rolls';
}

// hasAnyRolls - checks if any roll section in the figure has rolls
function hasAnyRolls(figure) {
    if (!figure.rolls) return false;
    for (let i = 0; i < figure.rolls.length; i++) {
        if (figure.rolls[i] && hasActualRolls(figure.rolls[i])) {
            return true;
        }
    }
    return false;
}

// ── Sequence-Level Functions ────────────────────────────────

// getEntryAnnouncement - generates entry text for the first figure
// in the sequence if non-standard entry (inverted or crossbox)
function getEntryAnnouncement(figure) {
    const inverted = (figure.entryAtt === 180);
    const crossbox = (figure.entryAxis === 'Y');

    if (!inverted && !crossbox) return null;
    if (inverted && !crossbox) return 'Inverted entry';
    if (!inverted && crossbox) return 'Crossbox entry';
    return 'Inverted crossbox entry';
}

// getExitText - generates exit attitude text for the figure.
// Returns null if Rule 20 already stated the exit attitude.
function getExitText(figure, rule20Applied) {
    if (rule20Applied) return null;

    const exitAtt = ((figure.exitAtt % 360) + 360) % 360;
    const state = getCallerState(exitAtt);

    // Skip exit text for vertical attitudes — attitude is
    // re-established by the next geometry token
    if (state.callerAttitude === 'vertical') return null;

    const crossboxExit = (figure.exitAxis === 'Y' &&
        figure.entryAxis !== 'Y');

    let text = 'Exit ' + state.callerAttitude;
    if (crossboxExit) text += ' crossbox';
    return text;
}

// ── Per-Figure Dispatcher ───────────────────────────────────

// generateCallerText - generates caller text for a single figure.
// Routes to family-specific handlers and adds sequence-level text.
function generateCallerText(figure, figIndex, allFigures) {
    const parts = [];
    const family = getFamilyNumber(figure);
    const isFirstFigure = (figure.seqNr === 1);
    const isLastFigure = isLastArestiFigure(figure, figIndex, allFigures);

    // Entry announcement (first figure only)
    if (isFirstFigure) {
        const entryText = getEntryAnnouncement(figure);
        if (entryText) parts.push(entryText);
    }

    // Family-specific text generation
    let figureText = '';
    let rule20Applied = false;

    switch (family) {
        case 0:
            parts.push('Non-Aresti figure');
            return parts.join('.. ') + '.. ';
        case 2:
            figureText = generateFamily2Text(figure);
            break;
        default:
            if (isFamily1Horizontal(figure)) {
                figureText = generateFamily1HorizontalText(figure);
            } else {
                figureText = generateStandardFigureText(figure);
                // Check if Rule 20 was applied (last geometry token
                // was an angle — text contains "to exit")
                rule20Applied = figureText.indexOf('to exit') >= 0;
            }
            break;
    }

    if (figureText) parts.push(figureText);

    // Exit attitude (if not already stated by Rule 20)
    const exitText = getExitText(figure, rule20Applied);
    if (exitText) parts.push(exitText);

    // End of sequence
    if (isLastFigure) {
        parts.push('End of sequence');
    }

    return parts.join('.. ') + '.. ';
}

// debugCallerOutput - dumps all figure caller text to console.
// Call from browser console: debugCallerOutput()
function debugCallerOutput() {
    OA.figures.forEach((fig, i) => {
        if (fig && fig.caller) {
            console.log('Figure ' + fig.seqNr + ': ' + fig.caller);
        }
    });
}

// validateCallerTracking - independently walks each figure's draw
// string tracking only attitude, then compares to OA's exitAtt.
// Does NOT use or modify any caller generation code.
// Call from browser console: validateCallerTracking()
function validateCallerTracking() {
    let tested = 0, passed = 0, failed = 0, skipped = 0;

    OA.figures.forEach((fig, idx) => {
        if (!fig || !fig.aresti) return;

        const family = getFamilyNumber(fig);

        // Skip Family 0 and Family 2 (turns use different processing)
        if (family === 0 || family === 2) {
            skipped++;
            return;
        }

        tested++;
        let att = fig.entryAtt;
        const drawString = OA.fig[fig.figNr].draw;
        const startRoll = regexRollBeforeBase.test(
            OA.fig[fig.figNr].pattern) ? 0 : 1;
        let rollIdx = startRoll;

        for (let i = 0; i < drawString.length; i++) {
            const ch = drawString[i];

            // Geometry tokens — update attitude
            if (callerAngleText[ch]) {
                att = (((att + OA.drawAngles[ch]) % 360) + 360) % 360;
                continue;
            }

            // Special tokens — match buildShape handlers
            if (ch === 'h' || ch === 'H' || ch === 't' || ch === 'T') {
                att = 270;
                continue;
            }
            if (ch === 'u' || ch === 'U') {
                att = (((att + 180) % 360) + 360) % 360;
                continue;
            }

            // Roll position — apply net rotation attitude flip
            if (ch === '_') {
                const rolls = fig.rolls[rollIdx];
                if (rolls && hasActualRolls(rolls)) {
                    const netRot = calculateNetRotation(rolls);
                    if (netRot === 180) {
                        att = 180 - att;
                        if (att < 0) att += 360;
                    }
                }
                rollIdx++;
                continue;
            }
        }

        const expected = ((fig.exitAtt % 360) + 360) % 360;
        att = ((att % 360) + 360) % 360;

        if (att === expected) {
            passed++;
        } else {
            failed++;
            console.error('MISMATCH Figure ' + fig.seqNr +
                ' (' + fig.aresti[0] + '): tracked=' + att +
                ' expected=' + expected +
                ' draw=' + drawString);
        }
    });

    console.log('Validation: ' + tested + ' tested, ' +
        passed + ' passed, ' + failed + ' failed, ' +
        skipped + ' skipped (Family 0/2)');
}
