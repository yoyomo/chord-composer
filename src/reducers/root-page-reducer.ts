import {State} from "../state";
import {ChordType} from "../components/chord";
import {KEYS} from "../components/note-key";

export const removeVariations = (state: State): State => {
  let baseChord = state.chordGrid[state.selectedChordTypeIndex];

  let chordGrid = state.chordGrid.slice();

  chordGrid = chordGrid.slice(0,state.selectedChordTypeIndex+1).
  concat(chordGrid.slice(state.selectedChordTypeIndex + baseChord.pitchClass.length));

  state = {...state};
  state.chordGrid = chordGrid;
  state.showingVariations = false;

  return state;
};

export const recomputeVariations = (state: State): State => {
  let baseChord = state.chordGrid[state.selectedChordTypeIndex];

  let pitchClass = baseChord.pitchClass.slice();
  let chordGrid = state.chordGrid.slice();

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
    };

    chordGrid.splice(state.selectedChordTypeIndex + v, 0, chordVariation);
  }

  state = {...state};
  state.chordGrid = chordGrid;
  state.showingVariations = true;

  return state;
};

export const selectChordType = (state: State, chordGridIndex: number): State => {
  let selectedChord = state.chordGrid[chordGridIndex];

  while (selectedChord.variation > 0){
    selectedChord = state.chordGrid[--chordGridIndex];
  }

  let nextChord = state.chordGrid[chordGridIndex + 1];

  state = {...state};
  state.selectedChordTypeIndex = chordGridIndex;
  state.showingVariations = nextChord && nextChord.variation > 0;

  return state;
};

export const recomputeChords = (state: State, keyIndex: number): State => {
  state = {...state};
  state.selectedKeyIndex = keyIndex;

  let chordGrid: ChordType[] = [];
  state.chordRules.map(chordRule => {
    let pitchClass = chordRule.pitchClass.slice();

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

    let chord: ChordType = {
      ...chordRule,
      pitchClass: pitchClass.slice(),
      variation: 0,
      baseKey: KEYS[keyIndex]
    };

    chordGrid.push(chord);
  });

  state.chordGrid = chordGrid;

  return state;
};

export const selectKey = (state: State, keyIndex: number): State => {
  return recomputeChords(state,keyIndex);
};

export const showVariations = (state: State): State => {
  return recomputeVariations(state);
};

export const hideVariations = (state: State): State => {
  return removeVariations(state);
};