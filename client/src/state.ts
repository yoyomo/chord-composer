import {BASE_CHORD_RULES} from "./constants/base-chord-rules";
import {ChordRuleType, ChordType} from "./reducers/recompute-chord-grid";
import {UserResource} from "./resources/user-resource";

const AudioContext = (window as any).AudioContext // Default
  || (window as any).webkitAudioContext // Safari and old versions of Chrome
  || false;

export type ToggleMap = {[k: number]: boolean}

export const initialState = {
  audioContext: new AudioContext(),
  notes: [] as number[],
  baseFrequency: 440,
  selectedKeyIndex: null as unknown as number,
  octave: 2,
  chordRules: BASE_CHORD_RULES as ChordRuleType[],
  chordGrid: [] as ChordType[],
  showingVariations: {} as ToggleMap,
  selectedGridChord: {} as ChordType,
  waveType: "sine" as OscillatorType,
  soundOn: true,
  savedChords: [] as ChordType[],
  selectedSavedChord: null as unknown as number,
  loggedInUser: null as unknown as UserResource

};

export type State = typeof initialState;