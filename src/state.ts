import {BASE_CHORD_RULES} from "./constants/base-chord-rules";
import {ChordRuleType, ChordType} from "./components/chord";

const AudioContext = (window as any).AudioContext // Default
  || (window as any).webkitAudioContext // Safari and old versions of Chrome
  || false;

export let initialState = {
  audioContext: new AudioContext(),
  notes: [] as number[],
  baseFrequency: 440,
  selectedKeyIndex: null as unknown as number,
  octave: 2,
  chordRules: BASE_CHORD_RULES as ChordRuleType[],
  chordGrid: [] as ChordType[],
  showingVariations: false,
  selectedChordTypeIndex: null as unknown as number,

};

export type State = typeof initialState;