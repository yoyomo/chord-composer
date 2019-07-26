import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";
import {ChordType, KeyLetter, KEYS} from "./recompute-chord-grid";

export const FirstChordMapperKeyIndex = ((firstLetter: KeyLetter): number => {
  for(let k = 0; k < KEYS.length; k++){
    if (firstLetter === KEYS[k]){
      return k;
    }
  }
  return 0;
})('C');

//c,#,d,#,e,f,#,g,#, +  a,#,b,c,#,d,#,e,f,#,g,#,  +  a,#,b,c,#,d,#,e,f,#,g,#, + a,#,b
export const ChordMapperKeys = KEYS.slice(FirstChordMapperKeyIndex).concat(KEYS).concat(KEYS).concat(KEYS.slice(0, FirstChordMapperKeyIndex));

export interface ToggleChordMapperKey {
  type: "toggle-chord-mapper-key"
  keyIndex: number
}

export const toggleChordMapperKey = (keyIndex: number): ToggleChordMapperKey => {
  return {
    type: "toggle-chord-mapper-key",
    keyIndex
  };
};

export type ChordMapperActions =
  ToggleChordMapperKey
  ;

export const mapChordToKeys = (state: State): State => {
  if (state.selectedGridChord) {

    let tmpPitchClass = state.selectedGridChord.pitchClass.slice();
    let pitchClass = tmpPitchClass.slice();
    for (let i = 0; i < pitchClass.length; i++) {
      let pitch = pitchClass[i];
      let newPitch = (pitch - state.octave * KEYS.length - FirstChordMapperKeyIndex) % (ChordMapperKeys.length);

      tmpPitchClass[i] = newPitch;
      if (tmpPitchClass[0] < 0) {
        newPitch += KEYS.length;
      }
      pitchClass[i] = newPitch;
    }
    state.chordMapperKeys = ChordMapperKeys.map((key, i) => {
      return pitchClass.includes(i);
    });
  }

  return state;
};

export const scalePitchClass = (pitchClass: number[]): number[] => {
  let scaledPitchClass = pitchClass.slice();
  for (let p = 1; p < scaledPitchClass.length; p++) {
    while (scaledPitchClass[p - 1] >= scaledPitchClass[p]) {
      scaledPitchClass[p] += KEYS.length;
    }
  }
  return scaledPitchClass;
};

export const nextVariation = (pitchClass: number[]): number[] => {
  return scalePitchClass(pitchClass.slice(1).concat(pitchClass[0]));
};

export const chordMapperKeysToKeys = (chordMapperKeys: boolean[]): number[] => {
  return chordMapperKeys.map((on, mapKeyIndex) => {
    return on ? (mapKeyIndex + FirstChordMapperKeyIndex) % KEYS.length : -1;
  }).filter(k => k >= 0)
};

export const keysToPitchClass = (keyIndexes: number[]): number[] => {
  return keyIndexes.map(keyIndex => keyIndex - keyIndexes[0]);
};

export const mapKeysToChord = (state: State): State => {
  let keyIndexes = chordMapperKeysToKeys(state.chordMapperKeys);
  let pitchClass = keysToPitchClass(scalePitchClass((keyIndexes)));
  console.log(pitchClass);


  //TODO find variations
  let isShowingChords = state.chordGrid.length > 0;
  let availableChords = isShowingChords ? state.chordGrid : state.chordRules;
  nextChord: for (let i = 0; i < availableChords.length; i++) {
    let chord = availableChords[i];

    if (pitchClass.length !== chord.pitchClass.length) continue;

    let chordPitchClass = isShowingChords ? state.chordRules[(chord as ChordType).chordRuleIndex].pitchClass.slice() : chord.pitchClass;
    chordPitchClass = scalePitchClass(chordPitchClass);

    for (let p = 0; p < pitchClass.length; p++) {
      if (chordPitchClass.indexOf(pitchClass[p]) === -1) continue nextChord;
    }

    state = {...state};

    let variation;
    for (variation = 0; variation < chordPitchClass.length; variation++) {
      if (JSON.stringify(pitchClass) === JSON.stringify(chordPitchClass)) break;
      chordPitchClass = nextVariation(chordPitchClass);
    }

    console.log("found!", pitchClass);

    if (variation > 0) {
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[isShowingChords ? (chord as ChordType).chordRuleIndex : i] = true;
    }
    console.log("variation", variation);

    let baseKeyIndex = keyIndexes[0]; //TODO get this right
    let baseKey = KEYS[baseKeyIndex];
    console.log("base key",baseKey);

    state.selectedKeyIndex = baseKeyIndex;
    state.selectedGridChord = isShowingChords ? chord as ChordType : {...chord,
      pitchClass: scalePitchClass(pitchClass.map(pitch => pitch + baseKeyIndex + state.octave * KEYS.length)),
      baseKey: baseKey, variation: variation, chordRuleIndex: i, octave: state.octave};



    break;
  }

  return state;
};


export const reduceChordMapper = (state: State, action: Action): ReductionWithEffect<State> => {
  switch (action.type) {
    case "toggle-chord-mapper-key": {
      state = {...state};
      state.chordMapperKeys = state.chordMapperKeys.slice();
      state.chordMapperKeys[action.keyIndex] = !state.chordMapperKeys[action.keyIndex];

      state = mapKeysToChord(state);

      break;
    }

  }

  return {state};
};
