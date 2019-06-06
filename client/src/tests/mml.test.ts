import {calculateMML, parseMMLChords} from "../utils/mml";
import {initialState} from "../state";
import {ChordType, recomputeChordGrid} from "../reducers/recompute-chord-grid";

let test = {state: initialState};
it('saves and retrieves identical chords', () => {
  test.state = {...test.state};
  test.state.selectedKeyIndex = 0;
  test.state.chordGrid = recomputeChordGrid(test.state);



  test.state.selectedGridChord = test.state.chordGrid[0];
  test.state.showingVariations = {...test.state.showingVariations};
  test.state.showingVariations[test.state.selectedGridChord.chordRuleIndex] = true;
  test.state.chordGrid = recomputeChordGrid(test.state);

  let chords = test.state.chordGrid.slice(0);
  expect(calculateMML(chords[0])).toEqual("o2[Ac#e]");
  expect(parseMMLChords(test.state.chordRules,["o2[Ac#e]"])).toEqual([chords[0]]);

  chords = test.state.chordGrid.slice(0,1);
  expect(calculateMML(chords[0])).toEqual("o2[c#eA]");
  expect(parseMMLChords(test.state.chordRules,["o2[c#eA]"])).toEqual([chords[0]]);

  chords = test.state.chordGrid.slice(1,2);
  expect(calculateMML(chords[0])).toEqual("o2[eAc#]");
  expect(parseMMLChords(test.state.chordRules,["o2[eAc#]"])).toEqual([chords[0]]);

});