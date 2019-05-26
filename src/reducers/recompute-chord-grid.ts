import {memoizeBySomeProperties} from "../utils/memoizers";
import {initialState} from "../state";
import {KEYS} from "../components/note-key";

export interface ChordType extends ChordRuleType {
  baseKey: string,
  variation: number,
  chordRuleIndex: number,
  id: string,
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
}, (state) => {

  let chordGrid: ChordType[] = [];
  state.chordRules.map((chordRule, chordRuleIndex) => {
    let pitchClass = chordRule.pitchClass.slice();
    let variation = 0;

    // add key and octave
    for (let p = 0; p < pitchClass.length; p++) {
      pitchClass[p] += state.selectedKeyIndex + state.octave * 12;
    }

    // make sure pitchClass is incrementing array
    for (let p = 0; p < pitchClass.length; p++) {
      while (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
        pitchClass[p] += 12;
      }
    }

    let baseChord: ChordType = {
      ...chordRule,
      pitchClass: pitchClass.slice(),
      variation: variation,
      baseKey: KEYS[state.selectedKeyIndex],
      chordRuleIndex: chordRuleIndex,
      id: `c${chordRuleIndex}v${variation}`
    };

    chordGrid.push(baseChord);

    if (state.showingVariations[chordRuleIndex]) {

      let pitchClass = baseChord.pitchClass.slice();

      for (let v = 1; v < pitchClass.length; v++) {
        let firstPitch = pitchClass.shift();

        if (firstPitch) {
          while (firstPitch < pitchClass[pitchClass.length - 1]) {
            firstPitch += 12;
          }
          pitchClass.push(firstPitch);
        }

        let chordVariation: ChordType = {
          ...baseChord,
          pitchClass: pitchClass.slice(),
          variation: v,
          id: `c${chordRuleIndex}v${v}`
        };

        chordGrid.push(chordVariation);
      }
    }

    return baseChord;
  });


  return chordGrid
});
