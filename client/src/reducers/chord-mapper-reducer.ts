import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";
import {ChordRuleType, ChordType, KEYS} from "./recompute-chord-grid";

//c,#,d,#,e,f,#,g,#, +  a,#,b,c,#,d,#,e,f,#,g,#,  +  a,#,b,c,#,d,#,e,f,#,g,#, + a,#,b
export const DISPLAYED_KEYS = KEYS.slice(3).concat(KEYS).concat(KEYS).concat(KEYS.slice(0, 3));

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
      let newPitch = (pitch - state.octave * 12 - 3) % (DISPLAYED_KEYS.length);

      tmpPitchClass[i] = newPitch;
      if (tmpPitchClass[0] < 0) {
        newPitch += 12;
      }
      pitchClass[i] = newPitch;
    }
    state.chordMapperKeys = DISPLAYED_KEYS.map((key, i) => {
      return pitchClass.includes(i);
    });
  }

  return state;
};

export const correctPitchClass = (pitchClass: number[]): number[] => {
  for (let p = 1; p < pitchClass.length; p++) {
    while (pitchClass[p - 1] >= pitchClass[p]) {
      pitchClass[p] += KEYS.length;
    }
  }
  return pitchClass;
};

export const nextVariation = (pitchClass: number[]): number[] => {
  pitchClass = pitchClass.slice(1).concat(pitchClass[0]);
  pitchClass = correctPitchClass(pitchClass);
  return pitchClass;
};

export const mapKeysToChord = (state: State): State => {
  let pitchClass = state.chordMapperKeys.map((on, mapKeyIndex) => {
    return on ? (mapKeyIndex + 3) % KEYS.length : -1;
  }).filter(k => k >= 0);
  pitchClass = correctPitchClass(pitchClass);
  console.log(pitchClass);


  //TODO map pitchClass To The Correct chord
  let isShowingChords = state.chordGrid.length > 0;
  let availableChords = isShowingChords ? state.chordGrid : state.chordRules;
  nextChord: for (let i = 0; i < availableChords.length; i++) {
    let chord = availableChords[i];

    if (pitchClass.length !== chord.pitchClass.length) continue;

    let chordPitchClass = chord.pitchClass.slice();
    chordPitchClass = correctPitchClass(chordPitchClass);

    for (let p = 0; p < pitchClass.length; p++) {
      if (chordPitchClass.indexOf(pitchClass[p]) === -1) continue nextChord;
    }

    state = {...state};

    //TODO get base key, and change selectedChordGridIndex according to the chordRule & variant index
    // get base key -> selectedKeyIndex
    // create chord -> selectedChordGrid

    let variation;
    for (variation = 0; variation < chordPitchClass.length; variation++) {
      if (JSON.stringify(pitchClass) === JSON.stringify(chordPitchClass)) break;
      chordPitchClass = nextVariation(chordPitchClass);
    }

    console.log("found!",pitchClass, chord.pitchClass);

    if (variation > 0) {
      state.showingVariations[isShowingChords ? (chord as ChordType).chordRuleIndex : i] = true;
    }



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
