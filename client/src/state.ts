import {BASE_CHORD_RULES} from "./constants/base-chord-rules";
import {ChordRuleType, ChordType} from "./reducers/recompute-chord-grid";
import {UserResource} from "./resources/user-resource";
import {PathPart} from "./reducers/router-reducer";
import {SongResource} from "./resources/song-resource";
import {StripePlanResource} from "./resources/stripe-resource";
import {ResponseError} from "./reducers/login-reducer";
import {KeyBoardMapType} from "./reducers/keyboard-reducer";
import {SynthResource} from "./resources/synth-resource";

let AudioContext = (window as any).AudioContext // Default
  || (window as any).webkitAudioContext // Safari and old versions of Chrome
  || false;

export type ToggleMap = { [k: number]: boolean }

const loginPageInputs = {
  email: "",
  password: "",
  confirmPassword: "",
};

const accountSettingsInputs = {
  newEmail: "",
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  resetPasswordToken: "",
};

export const initialState = {
  audioContext: AudioContext && new AudioContext(),
  notes: [] as number[],
  selectedKeyIndex: undefined as number | void,
  chordRules: BASE_CHORD_RULES as ChordRuleType[],
  chordGrid: [] as ChordType[],
  selectedGridChord: undefined as ChordType | void,
  suggestedGridChords: [] as ChordType[],
  suggestedKeyIndexes: [] as number[],
  chordMapperKeys: [] as boolean[],
  draftChords: [] as (ChordType|void)[],
  loggedInUser: undefined as UserResource | void,
  pathParts: [] as PathPart[],
  headers: {} as { [k: string]: string },
  minimumPasswordLength: 6,

  synth: {
    base_octave: 2,
    vco_signal: "sine" as OscillatorType,
    sound_on: true,
    base_frequency: 440,
    cut_off_frequency: 350,
    id: undefined,
    user_id: undefined
  } as SynthResource,

  limits: {
    cut_off_frequency: {
      min: 10,
      max: AudioContext && new AudioContext().sampleRate / 10
    }
  },

  stripe: {
    object: undefined as stripe.Stripe | void,
    publishableKey: undefined as string | void,
    plans: [] as StripePlanResource[],
    chosenPlanID: undefined as string | void,
  },

  inputs: {
    lyric: "",
    mapKeyboardTo: 'keys' as KeyBoardMapType,
    ...loginPageInputs,
    ...accountSettingsInputs,
  },

  toggles: {
    showLogInModal: false,
    showTemporaryUserModal: false,
    showSettingsModal: false,
    changeEmail: false,
    changePassword: false,
    changeAccessToken: false,
    changeSubscription: false,
    isResettingPassword: false
  },

  showStarChord: undefined as ChordType | void,

  success: {
    signIn: "",
    signUp: "",
    changeAccountSettings: ""
  },
  errors: {
    signIn: [] as ResponseError[],
    signUp: [] as ResponseError[],
    changeAccountSettings: [] as ResponseError[],
    server: [] as ResponseError[],
  },
  alerts: {
    signIn: ""
  },

  loadingRequests: {} as { [k: string]: boolean },

  songs: [] as SongResource[],
  newSong: {
    id: undefined as unknown as number,
    user_id: "",
    title: "",
    author: "",
    chordsAndLyrics: [],
    created_at: undefined as string | void
  } as SongResource,

};

export type State = typeof initialState;
export type Inputs = typeof initialState.inputs;
export type Toggles = typeof initialState.toggles;