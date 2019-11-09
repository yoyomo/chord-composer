import {
  ChordMapperKeys, FirstChordMapperKeyIndex,
  mapChordToKeys,
  mapKeysToChord,
  nextVariation,
  scalePitchClass
} from "../reducers/keyboard-reducer";
import {KordPoseTest} from "./mml.test";
import {MAXIMUM_OCTAVE, MINIMUM_OCTAVE} from "../reducers/chord-tools-reducer";
import {ChordType, KEYS} from "../reducers/recompute-chord-grid";

it('maps and demaps correctly', () => {
  let test = new KordPoseTest();

  test.state = {...test.state};
  test.state.octave = 0;
  test.state.chordRules.map((chordRule, chordRuleIndex) => {
    KEYS.map((baseKey, baseKeyIndex) => {
      for(let variation = 0; variation < chordRule.pitchClass.length; variation++){

        let notes: number[] = scalePitchClass(chordRule.pitchClass.map(pitch => pitch + baseKeyIndex));
        for (let i = 0 ;i < variation; i++){
          notes = scalePitchClass(nextVariation(notes));
        }
        while (notes[0] >= KEYS.length) {
          notes = notes.map(note => note - KEYS.length);
        }

        let selectedGridChord = {
          ...chordRule,
          baseKey: baseKey,
          chordRuleIndex: chordRuleIndex,
          octave: test.state.octave,
          variation: variation,
          notes: notes
        };

        test.state.selectedGridChord = selectedGridChord;

        test.state = mapChordToKeys(test.state);
        let chordMapperNotes = notes.map(note => note + KEYS.length - FirstChordMapperKeyIndex);
        while (chordMapperNotes[0] >= KEYS.length) {
          chordMapperNotes = chordMapperNotes.map(note => note - KEYS.length);
        }
        let chordMapped = ChordMapperKeys.map((key, i) => {
          return chordMapperNotes.includes(i);
        });

        expect(test.state.chordMapperKeys).toEqual(chordMapped);

        test.state = mapKeysToChord(test.state);

        for (let octave = MINIMUM_OCTAVE; octave <= MAXIMUM_OCTAVE; octave++) {

          let expectedChord = {...selectedGridChord, octave: octave, notes: notes.map(pitch => pitch + octave * KEYS.length)};
          expect(test.state.suggestedGridChords.filter(suggestedChord => {
            for(let key in suggestedChord){
              if(JSON.stringify(suggestedChord[key as keyof ChordType]) !== JSON.stringify(expectedChord[key as keyof ChordType])){
                return false;
              }
            }
            return true;
          }).length).toEqual(1);
        }

      }

    });
  });


});