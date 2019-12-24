import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";
import {requestAjax} from "../core/services/ajax-service";
import {ApiV1SynthPath} from "../resources/routes";
import {Effect} from "../core/services/services";
import {getLoggedInUserRequestName} from "./footer-reducer";
import {userSignInRequestName} from "./login-reducer";

const ChangeOctaveActionType = "change-octave";
export type ChangeOctaveAction = {
  type: typeof ChangeOctaveActionType
  change: OctaveChanges
}

export const changeOctave = (change: OctaveChanges): ChangeOctaveAction => {
  return {
    type: ChangeOctaveActionType,
    change
  };
};

export type OctaveChanges = 'increase' | 'decrease'

export const MAXIMUM_OCTAVE = 4;
export const MINIMUM_OCTAVE = 0;

const ChangeBaseFrequencyActionType = "change-base-frequency";
export type ChangeBaseFrequencyAction = {
  type: typeof ChangeBaseFrequencyActionType
  frequency: number
}

export const changeBaseFrequency = (frequency: number): ChangeBaseFrequencyAction => {
  return {
    type: ChangeBaseFrequencyActionType,
    frequency
  };
};

const SelectWaveTypeActionType = "select-wave-type";
export type SelectWaveTypeAction = {
  type: typeof SelectWaveTypeActionType
  waveType: OscillatorType
}

export const selectWaveType = (waveType: OscillatorType): SelectWaveTypeAction => {
  return {
    type: SelectWaveTypeActionType,
    waveType
  };
};

const ToggleSoundActionType = "toggle-sound";
export type ToggleSoundAction = {
  type: typeof ToggleSoundActionType
}

export const toggleSound = (): ToggleSoundAction => {
  return {
    type: ToggleSoundActionType
  };
};

const SaveSynthToolsActionType = "save-synth-tools";
export type SaveSynthToolsAction = {
  type: typeof SaveSynthToolsActionType
}

export const saveSynthTools = (): SaveSynthToolsAction => {
  return {
    type: SaveSynthToolsActionType
  };
};


export type ChordToolsActions =
  ChangeOctaveAction
  | ChangeBaseFrequencyAction
  | SelectWaveTypeAction
  | ToggleSoundAction
  | SaveSynthToolsAction;

export const reduceChordTools = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];

  switch (action.type) {

    case "complete-request":
      let response = JSON.parse(action.response);
      if (action.name[0] === updateSynthToolsRequestName) {
        if(action.success){
          let synth = response.data;
          state = {...state};
          state.synth = synth;

          if(!state.loggedInUser) break;
          state.loggedInUser = {...state.loggedInUser};
          state.loggedInUser.latest_synth = synth;
        }

      }
      else if (action.name[0] === getLoggedInUserRequestName || action.name[0] === userSignInRequestName){
        if(action.success){
          let synth = response.data.latest_synth;
          if(synth){
            state = {...state};
            state.synth = synth;
          }
        }
      }
      break;

    case "change-octave": {

      state = {...state};
      state.synth = {...state.synth};
      switch (action.change) {
        case "decrease":
          state.synth.base_octave--;
          if (state.synth.base_octave < MINIMUM_OCTAVE) {
            state.synth.base_octave = MINIMUM_OCTAVE;
          }

          break;
        case 'increase':
          state.synth.base_octave++;
          if (state.synth.base_octave > MAXIMUM_OCTAVE) {
            state.synth.base_octave = MAXIMUM_OCTAVE;
          }
          break;
      }

      break;
    }

    case "change-base-frequency": {
      state = {...state};
      state.synth = {...state.synth};
      state.synth.base_frequency = action.frequency;
      break;
    }

    case "select-wave-type": {
      state = {...state};
      state.synth = {...state.synth};
      state.synth.vco_signal = action.waveType;
      break;
    }

    case "toggle-sound": {
      state = {...state};
      state.synth = {...state.synth};
      state.synth.sound_on = !state.synth.sound_on;
      break;
    }

    case "save-synth-tools":
      const url = ApiV1SynthPath + (state.synth.id ? "/" + state.synth.id : "");
      const method = state.synth.id ? "PUT" : "POST";
      const {id, ...synth} = {...state.synth};
      synth.user_id = state.loggedInUser && state.loggedInUser.id;

      effects = effects.concat(requestAjax([updateSynthToolsRequestName], {
        url: url,
        method: method,
        headers: state.headers,
        json: {
          synth: {...synth}
        }
      }));
      break;
  }

  return {state, effects};
};

export const updateSynthToolsRequestName = "update-synth-tools";