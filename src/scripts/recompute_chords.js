"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var App_1 = require("../App");
var fs = require("fs");
var base_chord_rules_1 = require("../constants/base-chord-rules");
var recalculateChordRules = function () {
    var chordRules = [];
    base_chord_rules_1.BASE_CHORD_RULES.map(function (chordRule) {
        var pitchClass = chordRule.pitchClass.slice();
        for (var v = 0; v < chordRule.pitchClass.length; v++) {
            if (v > 0) {
                var firstPitch = pitchClass.shift();
                if (firstPitch && firstPitch >= 0) {
                    pitchClass.push(firstPitch);
                }
            }
            for (var p = 0; p < pitchClass.length; p++) {
                while (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
                    pitchClass[p] += 12;
                }
            }
            chordRules.push(__assign({}, chordRule, { pitchClass: pitchClass.slice(), variation: v }));
        }
    });
    fs.writeFile('src/constants/chord-rules-with-variations.ts', "export const CHORD_RULES_WITH_VARIATIONS = " + JSON.stringify(chordRules), function (err) {
        if (err) {
            console.error("Failed to write File", err);
        }
    });
    return chordRules;
};
exports.KEYS = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
var recalculateAllChords = function () {
    var chords = [];
    var chordRules = recalculateChordRules();
    for (var n = 0; n < App_1.NUMBER_OF_NOTES; n++) {
        var baseKey = exports.KEYS[n % exports.KEYS.length];
        for (var c = 0; c < chordRules.length; c++) {
            var chordRule = chordRules[c];
            var pitchClass = chordRule.pitchClass.slice();
            for (var p = 0; p < pitchClass.length; p++) {
                pitchClass[p] += n;
            }
            chords.push(__assign({}, chordRule, { pitchClass: pitchClass, baseKey: baseKey }));
        }
    }
    fs.writeFile('src/constants/chords.ts', "export const CHORDS = " + JSON.stringify(chords), function (err) {
        if (err) {
            console.error("Failed to write File", err);
        }
    });
    return chords;
};
recalculateAllChords();
