import {ChordType, KEYS} from "../reducers/recompute-chord-grid";

export const calculateMML = (octave: number, pitchClass: number[]) => {
  let mml = "o" + octave + "[";
  for (let p = 0; p < pitchClass.length; p++) {
    let pitch = pitchClass[p];
    if (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
      mml += "<";
    }

    mml += KEYS[pitch % KEYS.length].toLowerCase();
  }

  mml += ']';

  return mml;
};

export const parseMMLChords = (mmlChords: string[]): ChordType[] => {

};