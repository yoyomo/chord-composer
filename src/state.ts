import {BASE_CHORD_RULES} from "./constants/base-chord-rules";
import {ChordRuleType, ChordType} from "./components/chord";

export const NUMBER_OF_NOTES = 88;

export const recomputeAllNotes = (baseFrequency = 440): number[] => {
  let notes = [];

  for (let n = 0; n < NUMBER_OF_NOTES; n++) {
    notes[n] = Math.pow(2, ((n + 1) - 49) / 12) * baseFrequency;
  }

  return notes;
};

const AudioContext = (window as any).AudioContext // Default
    || (window as any).webkitAudioContext // Safari and old versions of Chrome
    || false;


export let initialState = {
  audioContext: new AudioContext(),
  notes: recomputeAllNotes(),
  selectedKeyIndex: null as unknown as number,
  octave: 3,
  chordRules: BASE_CHORD_RULES as ChordRuleType[],
  chordGrid: [] as ChordType[],
  showingVariations: false,
  selectedChordTypeIndex: null as unknown as number,

};

export type State = typeof initialState;