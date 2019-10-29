import {BASE_CHORD_RULES} from "./constants/base-chord-rules";
import {ChordRuleType, ChordType} from "./reducers/recompute-chord-grid";
import {UserResource} from "./resources/user-resource";
import {PathPart} from "./reducers/router-reducer";
import {SongResource} from "./resources/song-resource";
import {StripePlanResource} from "./resources/stripe-resource";
import {ResponseError} from "./reducers/login-reducer";

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
};

export const initialState = {
  audioContext: AudioContext && new AudioContext(),
  notes: [] as number[],
  baseFrequency: 440,
  selectedKeyIndex: undefined as number | void,
  octave: 2,
  chordRules: BASE_CHORD_RULES as ChordRuleType[],
  chordGrid: [] as ChordType[],
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
  headers: {} as { [k: string]: string },
  minimumPasswordLength: 6,

  stripe: {
    object: undefined as stripe.Stripe | void,
    publishableKey: undefined as string | void,
    plans: [] as StripePlanResource[],
    chosenPlanID: undefined as string | void,
  },

  inputs: {
    lyric: "",
    ...loginPageInputs,
    ...accountSettingsInputs,
  },

  toggles: {
    showLogInModal: false,
    showSuccessfulLogInModal: false,
    showSettingsModal: false,
    changeEmail: false,
    changePassword: false,
    changeAccessToken: false,
    changeSubscription: false,
    isResettingPassword: false,
  },

  success: {
    signUp: "" as string,
    changeAccountSettings: "" as string
  },
  errors: {
    signIn: [] as ResponseError[],
    signUp: [] as ResponseError[],
    changeAccountSettings: [] as ResponseError[]
  },
  alerts: {
    signIn: "" as string
  },

  loadingRequests: {} as { [k: string]: boolean },

  songs: [] as SongResource[],
  newSong: {
    id: undefined as unknown as number,
    user_id: "",
    title: "",
    author: "",
    chordsAndLyrics: [],
    created_at: null as unknown as string
  } as SongResource,

};

export type State = typeof initialState;
export type Inputs = typeof initialState.inputs;
export type Toggles = typeof initialState.toggles;