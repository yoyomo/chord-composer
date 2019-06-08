import {calculateMML, parseMMLChords} from "../utils/mml";
import {initialState, State} from "../state";
import {ChordRuleType, ChordType, KEYS, recomputeChordGrid} from "../reducers/recompute-chord-grid";
import {MAXIMUM_OCTAVE, MINIMUM_OCTAVE} from "../reducers/chord-tools-reducer";

export class ChordComposerTest {
  state: State;

  constructor() {
    this.state = initialState;
  }
}


const testMML = (chordRules: ChordRuleType[], chord: ChordType, mmlText: string) => {
  expect(calculateMML(chord)).toEqual(mmlText);
  expect(parseMMLChords(chordRules, [mmlText])).toEqual([chord]);
};

const testSelectedKeyIndexMML = (octave: number, selectedKeyIndex: number) => {
  let test = new ChordComposerTest();

  test.state = {...test.state};
  test.state.octave = octave;
  test.state.selectedKeyIndex = selectedKeyIndex;

  test.state.showingVariations = {...test.state.showingVariations};
  test.state.showingVariations = new Array(test.state.chordRules.length).fill(true);

  test.state.chordGrid = recomputeChordGrid(test.state);

  expect(test.state.chordGrid.length).toBeGreaterThan(test.state.chordRules.length);

  let variedPitchClass: number[] = [];

  for (let i = 0; i < test.state.chordGrid.length; i++) {
    let chord = test.state.chordGrid[i];
    let baseChord = test.state.chordRules[test.state.chordGrid[i].chordRuleIndex];

    variedPitchClass = chord.variation === 0 ? baseChord.pitchClass
        : variedPitchClass.slice(1).concat([variedPitchClass[0]]);

    let chordNoteKeys: string = variedPitchClass.map(pitch => {
      let keyPitch = (pitch + selectedKeyIndex) % KEYS.length;
      return pitch === 0 ? KEYS[keyPitch] : KEYS[keyPitch].toLowerCase();
    }).join('');

    let mmlText = `o${test.state.octave}[${chordNoteKeys}]`;
    testMML(test.state.chordRules, chord, mmlText);
  }

};


it('saves and retrieves identical chords', () => {

  for (let o = MINIMUM_OCTAVE; o <= MAXIMUM_OCTAVE; o++) {
    for (let k = 0; k < KEYS.length; k++) {
      testSelectedKeyIndexMML(o, k);
    }
  }


});