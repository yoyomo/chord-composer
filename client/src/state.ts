import {BASE_CHORD_RULES} from "./constants/base-chord-rules";
import {ChordRuleType, ChordType} from "./reducers/recompute-chord-grid";
import {UserResource} from "./resources/user-resource";
import {PathPart} from "./reducers/router-reducer";
import {SongResource} from "./resources/song-resource";

let AudioContext = (window as any).AudioContext // Default
  || (window as any).webkitAudioContext // Safari and old versions of Chrome
  || false;

export type ToggleMap = {[k: number]: boolean}

const loginPageInputs = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const initialState = {
  audioContext: AudioContext && new AudioContext(),
  notes: [] as number[],
  baseFrequency: 440,
  selectedKeyIndex: undefined as number | void,
  octave: 2,
  chordRules: BASE_CHORD_RULES as ChordRuleType[],
  chordGrid: [] as ChordType[],
  showingVariations: {} as ToggleMap,
  selectedGridChord: undefined as ChordType | void,
  suggestedGridChords: [] as ChordType[],
  suggestedKeyIndexes: [] as number[],
  chordMapperKeys: [] as boolean[],
  waveType: "sine" as OscillatorType,
  soundOn: true,
  savedChords: [] as ChordType[],
  selectedSavedChord: undefined as number | void,
  loggedInUser: undefined as UserResource | void,
  pathParts: [] as PathPart[],
  headers: {} as {[k: string]: string},

  // TODO request data from backend & display plan information
  stripe: {
    object: undefined as stripe.Stripe | void,
    publishableKey: "pk_test_djBzxE7qYBOJYdTPP2OT7aXa00gGQMNEZb" as string,
    plans: ["plan_FPRSWCfeC2eHz1"] as string[],
    chosenPlanID: "plan_FPRSWCfeC2eHz1" as string,
  },

  inputs: {
    lyric: "",
    ...loginPageInputs,
  },

  toggles: {
    showLogInModal: false,
  },

  loginPage: {
    success: {
      signUp: "" as string
    },
    errors: {
      signIn: [] as string[],
      signUp: [] as string[]
    }
  },

  songs: [] as SongResource[],
  newSong: {id: undefined as unknown as number, user_id: "", title: "", author: "", chordsAndLyrics: [], created_at: null as unknown as string} as SongResource,

};

export type State = typeof initialState;
export type Inputs = typeof initialState.inputs;
export type Toggles = typeof initialState.toggles;