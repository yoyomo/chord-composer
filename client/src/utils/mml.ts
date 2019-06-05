import {ChordRuleType, ChordType, KEYS} from "../reducers/recompute-chord-grid";

export const calculateMML = (chord: ChordType) => {
  let mml = "o" + chord.octave + "[";
  for (let p = 0; p < chord.pitchClass.length; p++) {
    let pitch = chord.pitchClass[p];
    if (p > 0 && chord.pitchClass[p] < chord.pitchClass[p - 1]) {
      mml += "<";
    }

    let key = KEYS[pitch % KEYS.length];

    if (key !== chord.baseKey) {
      key = key.toLowerCase();
    }

    mml += key;
  }

  mml += ']';

  return mml;
};

export const parseMMLChords = (chordRules: ChordRuleType[], mmlChords: string[]): ChordType[] => {
  let result: ChordType[] = [];

  mmlChords.map(mmlChord => {
    let octave = 0;
    let pitchClass: number[] = [];
    let chordRulePitchClass: number[] = [];
    let readingChord = false;

    let chordNoteKeys = mmlChord.match(/[abcdefgABCDEFG]/g);
    if (!chordNoteKeys) return null;

    let upperCaseKeys = mmlChord.match(/[ABCDEFG]/g);
    if (!upperCaseKeys) return null;

    let baseKey = upperCaseKeys[0];
    let variation = chordNoteKeys.length - chordNoteKeys.indexOf(baseKey);

    for (let m = 0; m < mmlChord.length; m++) {
      let mmlItem = mmlChord[m];

      if (mmlItem === "o" && parseInt(mmlChord[m + 1])) {
        octave = parseInt(mmlChord[++m]);
      } else if (mmlItem === "[") {
        readingChord = true;
      } else if (mmlItem === "]") {
        readingChord = false;
      } else if (mmlItem.match(/[abcdefgABCDEFG]/g)) {

        let key = mmlItem;
        if (mmlChord[m + 1] === "#") {
          key += mmlChord[++m];
        }

        if (readingChord) {

          let pitch = KEYS.indexOf(key.toUpperCase());

          pitch = (pitch + KEYS.indexOf(baseKey)) % KEYS.length;

          chordRulePitchClass.push(pitch);

          while (pitchClass.length > 0 && pitch < pitchClass.slice(-1)[0]){
            pitch += KEYS.length;
          }

          pitchClass.push(pitch);

        }

      }
    }


    let chordRuleIndex;
    for (chordRuleIndex = 0 ; chordRuleIndex < chordRules.length; chordRuleIndex++){
      if (JSON.stringify(chordRules[chordRuleIndex].pitchClass) === JSON.stringify(chordRulePitchClass)) {
        break;
      }
    }

    let chord = {
      ...chordRules[chordRuleIndex],
      octave: octave,
      pitchClass: pitchClass,
      variation: variation,
      baseKey: baseKey,
      chordRuleIndex: chordRuleIndex,
    };

    result.push(chord);
    return chord;
  });

  return result;
};