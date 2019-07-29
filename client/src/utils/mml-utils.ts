import {ChordRuleType, ChordType, KeyLetter, KEYS} from "../reducers/recompute-chord-grid";

export const calculateMML = (chord: ChordType) => {
  let mml = "o" + chord.octave + "[";
  for (let p = 0; p < chord.notes.length; p++) {
    let pitch = chord.notes[p];
    if (p > 0 && chord.notes[p] < chord.notes[p - 1]) {
      mml += "<";
    }

    let key: string = KEYS[pitch % KEYS.length];

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
    let chordNotes: number[] = [];
    let pitchClass: number[] = [];
    let readingChord = false;

    let chordNoteKeys = mmlChord.match(/[abcdefgABCDEFG]#?/g);
    if (!chordNoteKeys) return null;

    let upperCaseKeys = mmlChord.match(/[ABCDEFG]#?/g);
    if (!upperCaseKeys) return null;

    let baseKey: KeyLetter = upperCaseKeys[0] as KeyLetter;
    let variation = (chordNoteKeys.length - chordNoteKeys.indexOf(baseKey) ) % chordNoteKeys.length;

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

          let chordNote = KEYS.indexOf(key.toUpperCase() as KeyLetter);

          let basePitch = (chordNote - KEYS.indexOf(baseKey) + KEYS.length) % KEYS.length;

          pitchClass.push(basePitch);

          chordNote += octave * KEYS.length;

          while (chordNotes.length > 0 && chordNote < chordNotes.slice(-1)[0]){
            chordNote += KEYS.length;
          }

          chordNotes.push(chordNote);

        }

      }
    }


    let chordRuleIndex;
    pitchClass = pitchClass.slice(pitchClass.indexOf(0)).concat(pitchClass.slice(0, pitchClass.indexOf(0)));

    for (chordRuleIndex = 0 ; chordRuleIndex < chordRules.length; chordRuleIndex++){
      if (JSON.stringify(chordRules[chordRuleIndex].pitchClass) === JSON.stringify(pitchClass)) {
        break;
      }
    }

    let chord = {
      ...chordRules[chordRuleIndex],
      octave: octave,
      notes: chordNotes,
      variation: variation,
      baseKey: baseKey,
      chordRuleIndex: chordRuleIndex,
    };

    result.push(chord);
    return chord;
  });

  return result;
};