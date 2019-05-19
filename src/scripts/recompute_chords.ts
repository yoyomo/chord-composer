import {ChordRuleType, ChordRuleVariationType, NUMBER_OF_NOTES} from "../App";
import * as fs from "fs";
import {BASE_CHORD_RULES} from "../constants/base-chord-rules";

const recalculateChordRules = (): ChordRuleVariationType[] => {
  let chordRules: ChordRuleVariationType[] = [];

  BASE_CHORD_RULES.map((chordRule: ChordRuleType) => {
    let pitchClass = chordRule.pitchClass.slice();

    for (let v = 0; v < chordRule.pitchClass.length; v++) {
      if (v > 0) {
        let firstPitch = pitchClass.shift();
        if (firstPitch && firstPitch >= 0) {
          pitchClass.push(firstPitch)
        }
      }
      for (let p = 0; p < pitchClass.length; p++) {
        while (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
          pitchClass[p] += 12;
        }
      }
      chordRules.push({...chordRule, pitchClass: pitchClass.slice(), variation: v});
    }
  });

  fs.writeFile('src/constants/chord-rules-with-variations.ts', "export const CHORD_RULES_WITH_VARIATIONS = " + JSON.stringify(chordRules),
      (err) => {
        if (err) {
          console.error("Failed to write File", err)
        }
      });

  return chordRules;
};

export const KEYS = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const recalculateAllChords = () => {
  let chords = [];
  let chordRules = recalculateChordRules();


  for (let n = 0; n < NUMBER_OF_NOTES; n++) {
    let baseKey = KEYS[n % KEYS.length];
    for (let c = 0; c < chordRules.length; c++) {
      let chordRule = chordRules[c];
      let pitchClass = chordRule.pitchClass.slice();

      for (let p = 0; p < pitchClass.length; p++) {
        pitchClass[p] += n;
      }

      chords.push({
        ...chordRule,
        pitchClass: pitchClass,
        baseKey: baseKey,
      });
    }

  }

  fs.writeFile('src/constants/chords.ts', "export const CHORDS = " + JSON.stringify(chords),
      (err) => {
        if (err) {
          console.error("Failed to write File", err)
        }
      });

  return chords;
};

recalculateAllChords();