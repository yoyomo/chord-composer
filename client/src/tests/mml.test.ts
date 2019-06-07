import {calculateMML, parseMMLChords} from "../utils/mml";
import {initialState, State} from "../state";
import {ChordRuleType, ChordType, KEYS, recomputeChordGrid} from "../reducers/recompute-chord-grid";

export class ChordComposerTest {
  state: State;

  constructor() {
    this.state = initialState;
  }
}


const testMML = (chordRules: ChordRuleType[], chord: ChordType, variation: number, mmlText: string) => {
  expect(chord.variation).toEqual(variation);
  expect(calculateMML(chord)).toEqual(mmlText);
  expect(parseMMLChords(chordRules,[mmlText])).toEqual([chord]);
};

const testSelectedKeyIndexMML = (selectedKeyIndex: number) => {
  let test = new ChordComposerTest();

  test.state = {...test.state};
  test.state.showingVariations = {...test.state.showingVariations};

  for (let i = 0; i < test.state.chordRules.length; i++) {
    test.state.showingVariations[i] = true;
  }

  test.state.selectedKeyIndex = selectedKeyIndex;
  test.state.chordGrid = recomputeChordGrid(test.state);

  expect(test.state.chordGrid.length).toBeGreaterThan(test.state.chordRules.length);

  let i = 0;
  let chord = test.state.chordRules[i];

  let variedPitchClass = chord.pitchClass;

  for (let v = 0; v < chord.pitchClass.length; v++){

    if (v > 0) {
      variedPitchClass = variedPitchClass.slice(1).concat([variedPitchClass[0]]);
    }
    let chordNoteKeys: string[] = variedPitchClass.map(pitch => {
      let keyPitch = pitch + selectedKeyIndex;
      return pitch === 0 ? KEYS[keyPitch] : KEYS[keyPitch].toLowerCase();
    });
    let mmlText = `o${test.state.octave}[${chordNoteKeys.join('')}]`;
    testMML(test.state.chordRules, test.state.chordGrid[i + v], v, mmlText);
  }

};


it('saves and retrieves identical chords', () => {

  for(let k = 0; k < KEYS.length; k++){
    testSelectedKeyIndexMML(k);
  }

});