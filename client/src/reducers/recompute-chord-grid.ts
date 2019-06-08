import {memoizeBySomeProperties} from "../utils/memoizers";
import {initialState} from "../state";
import {calculateMML} from "../utils/mml";

export const chordIdentifier = (chord: ChordType): string => {
  return `k${chord.baseKey}c${chord.chordRuleIndex}v${chord.variation}p${chord.pitchClass}m${calculateMML(chord)}`
};

export const KEYS = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export interface ChordType extends ChordRuleType {
  baseKey: string,
  variation: number,
  chordRuleIndex: number,
  octave: number,
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
  octave: initialState.octave,
  showingVariations: initialState.showingVariations,
}, (state): ChordType[] => {

  if (state.selectedKeyIndex === undefined) return [];
  let selectedKeyIndex: number = state.selectedKeyIndex;
  let baseKey = KEYS[selectedKeyIndex];
  let chordGrid: ChordType[] = [];

  state.chordRules.map((chordRule, chordRuleIndex) => {
    let pitchClass = chordRule.pitchClass.slice();
    let variation = 0;

    for (let p = 0; p < pitchClass.length; p++) {
      pitchClass[p] += selectedKeyIndex + state.octave * KEYS.length;

      while (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
        pitchClass[p] += KEYS.length;
      }
    }

    let baseChord: ChordType = {
      ...chordRule,
      pitchClass: pitchClass.slice(),
      variation: variation,
      baseKey: baseKey,
      chordRuleIndex: chordRuleIndex,
      octave: state.octave,
    };

    chordGrid.push(baseChord);

    if (state.showingVariations[chordRuleIndex]) {

      let pitchClass = baseChord.pitchClass.slice();

      for (variation = 1; variation < pitchClass.length; variation++) {
        let firstPitch = pitchClass[0];

        while (firstPitch < pitchClass[pitchClass.length - 1]) {
          firstPitch += KEYS.length;
        }

        pitchClass = pitchClass.slice(1).concat(firstPitch);

        if (pitchClass[0] >= state.octave * KEYS.length + KEYS.length){
          pitchClass = pitchClass.map(pitch => pitch - KEYS.length);
        }

        let chordVariation: ChordType = {
          ...baseChord,
          pitchClass: pitchClass.slice(),
          variation: variation,
        };

        chordGrid.push(chordVariation);
      }
    }

    return baseChord;
  });


  return chordGrid
});
