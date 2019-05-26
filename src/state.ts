import {BASE_CHORD_RULES} from "./constants/base-chord-rules";
import {ChordRuleType, ChordType} from "./reducers/recompute-chord-grid";

const AudioContext = (window as any).AudioContext // Default
  || (window as any).webkitAudioContext // Safari and old versions of Chrome
  || false;

export type ToggleMap = {[k: number]: boolean}

export let initialState = {
  audioContext: new AudioContext(),
  notes: [] as number[],
  baseFrequency: 440,
  selectedKeyIndex: null as number | null,
  octave: 2,
  chordRules: BASE_CHORD_RULES as ChordRuleType[],
  chordGrid: [] as ChordType[],
  showingVariations: {} as ToggleMap,
  selectedChord: null as (ChordType | null),
  waveType: "triangle" as OscillatorType,
  soundOn: true,
  savedChords: [] as ChordType[]

};

export type State = typeof initialState;