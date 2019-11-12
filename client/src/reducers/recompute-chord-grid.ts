import {memoizeBySomeProperties} from "../utils/memoizers";
import {initialState} from "../state";
import {calculateMML} from "../utils/mml-utils";

export const chordIdentifier = (chord: ChordType | void): string => {
  if(!chord) return "";
  return `k${chord.baseKey}c${chord.chordRuleIndex}v${chord.variation}p${chord.pitchClass}m${calculateMML(chord)}`
};

export type KeyLetter = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#'
export const KEYS: KeyLetter[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export interface ChordType extends ChordRuleType {
  baseKey: string,
  variation: number,
  chordRuleIndex: number,
  octave: number,
  notes: number[],
}

export interface ChordRuleType {
  name: string,
  symbol: string,
  pitchClass: number[],
  quality: string,
}

export const recomputeChordGrid = memoizeBySomeProperties({
  chordRules: initialState.chordRules,
  selectedKeyIndex: initialState.selectedKeyIndex,
  synth: initialState.synth,
}, (state): ChordType[] => {

  if (state.selectedKeyIndex === undefined) return [];
  let selectedKeyIndex: number = state.selectedKeyIndex;
  let baseKey = KEYS[selectedKeyIndex];
  let chordGrid: ChordType[] = [];

  state.chordRules.map((chordRule, chordRuleIndex) => {
    let chordNotes = chordRule.pitchClass.slice();
    let variation = 0;

    for (let p = 0; p < chordNotes.length; p++) {
      chordNotes[p] += selectedKeyIndex + state.synth.base_octave * KEYS.length;

      while (p > 0 && chordNotes[p] < chordNotes[p - 1]) {
        chordNotes[p] += KEYS.length;
      }
    }

    let baseChord: ChordType = {
      ...chordRule,
      notes: chordNotes.slice(),
      variation: variation,
      baseKey: baseKey,
      chordRuleIndex: chordRuleIndex,
      octave: state.synth.base_octave,
    };

    chordGrid.push(baseChord);


    let baseChordNotes = baseChord.notes.slice();

    for (variation = 1; variation < baseChordNotes.length; variation++) {
      let firstPitch = baseChordNotes[0];

      while (firstPitch < baseChordNotes[baseChordNotes.length - 1]) {
        firstPitch += KEYS.length;
      }

      baseChordNotes = baseChordNotes.slice(1).concat(firstPitch);

      if (baseChordNotes[0] >= state.synth.base_octave * KEYS.length + KEYS.length) {
        baseChordNotes = baseChordNotes.map(note => note - KEYS.length);
      }

      let chordVariation: ChordType = {
        ...baseChord,
        notes: baseChordNotes.slice(),
        variation: variation,
      };

      chordGrid.push(chordVariation);
    }

    return baseChord;
  });


  return chordGrid
});
