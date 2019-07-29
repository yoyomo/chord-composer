import {
  ChordMapperKeys, FirstChordMapperKeyIndex,
  mapChordToKeys,
  mapKeysToChord,
  nextVariation,
  scalePitchClass
} from "../reducers/chord-mapper-reducer";
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
        let notes: number[] = chordRule.pitchClass;
        for (let i = 0 ;i < variation; i++){
          notes = scalePitchClass(nextVariation(chordRule.pitchClass));
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
        let chordNotes = notes.map(note => note + baseKeyIndex + ((KEYS.length - FirstChordMapperKeyIndex) % KEYS.length));
        let chordMapped = ChordMapperKeys.map((key, i) => {
          return chordNotes.includes(i);
        });

        console.log("testing", selectedGridChord);

        expect(test.state.chordMapperKeys).toEqual(chordMapped);
        test.state.suggestedGridChords = [];
        expect(test.state.suggestedGridChords).toEqual([]);
        test.state = mapKeysToChord(test.state);

        let suggestedChordsByOctave = 0;
        for (let octave = MINIMUM_OCTAVE; octave < MAXIMUM_OCTAVE; octave++) {
          notes = notes.map(pitch => pitch + octave * KEYS.length + baseKeyIndex);

          let expectedChord = {...selectedGridChord, octave: octave, notes: notes};
          suggestedChordsByOctave += test.state.suggestedGridChords.filter(suggestedChord =>{
            for ( let key in expectedChord){
              if(JSON.stringify(expectedChord[key as keyof ChordType]) !== JSON.stringify(suggestedChord[key as keyof ChordType]) ){
                return false;
              }
            }
            return true;
          }).length;
        }

        expect(test.state.suggestedGridChords.length).toBeGreaterThanOrEqual(MAXIMUM_OCTAVE - MINIMUM_OCTAVE);
      }

    });
  });


});