import {calculateMML, parseMMLChords} from "../utils/mml";
import {initialState} from "../state";
import {ChordType, recomputeChordGrid} from "../reducers/recompute-chord-grid";

const testMML = (chord: ChordType, variation: number, mmlText: string) => {
  expect(chord.variation).toEqual(variation);
  expect(calculateMML(chord)).toEqual(mmlText);
  expect(parseMMLChords(test.state.chordRules,[mmlText])).toEqual([chord]);
};

let test = {state: initialState};
it('saves and retrieves identical chords', () => {
  test.state = {...test.state};
  test.state.selectedKeyIndex = 0;
  test.state.showingVariations = {...test.state.showingVariations};
  test.state.showingVariations[0] = true;

  test.state.chordGrid = recomputeChordGrid(test.state);

  expect(test.state.chordGrid.length).toBeGreaterThan(test.state.chordRules.length);


  testMML(test.state.chordGrid[0],0, "o2[Ac#e]");
  testMML(test.state.chordGrid[1],1, "o2[c#eA]");
  testMML(test.state.chordGrid[2],2, "o2[eAc#]");

});