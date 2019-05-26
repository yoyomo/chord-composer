import {State} from "../state";
import {Action} from "../react-root";

export interface DecreaseOctaveAction {
  type: "decrease-octave"
}

export const decreaseOctave = (): DecreaseOctaveAction => {
  return {
    type: "decrease-octave",
  };
};

export interface IncreaseOctaveAction {
  type: "increase-octave"
}

export const increaseOctave = (): IncreaseOctaveAction => {
  return {
    type: "increase-octave",
  };
};

export interface ChangeBaseFrequencyAction {
  type: "change-base-frequency"
  frequency: number
}

export const changeBaseFrequency = (frequency: number): ChangeBaseFrequencyAction => {
  return {
    type: "change-base-frequency",
    frequency
  };
};

export interface SelectWaveTypeAction {
  type: "select-wave-type"
  waveType: OscillatorType
}

export const selectWaveType = (waveType: OscillatorType): SelectWaveTypeAction => {
  return {
    type: "select-wave-type",
    waveType
  };
};

export interface ToggleSoundAction {
  type: "toggle-sound"
}

export const toggleSound = (): ToggleSoundAction => {
  return {
    type: "toggle-sound"
  };
};

export type HeaderActions =
    DecreaseOctaveAction
    | IncreaseOctaveAction
    | ChangeBaseFrequencyAction
    | SelectWaveTypeAction
    | ToggleSoundAction;


export const reduceHeader = (state: State, action: Action): State => {
  switch (action.type) {

    case "decrease-octave": {
      state = {...state};
      state.octave--;
      if (state.octave < 0) {
        state.octave = 0;
      }
      break;
    }

    case "increase-octave": {
      state = {...state};
      state.octave++;
      if (state.octave > 5) {
        state.octave = 5;
      }
      break;
    }

    case "change-base-frequency": {
      state = {...state};
      state.baseFrequency = action.frequency;
      break;
    }

    case "select-wave-type": {
      state = {...state};
      state.waveType = action.waveType;
      break;
    }

    case "toggle-sound": {
      state = {...state};
      state.soundOn = !state.soundOn;
      break;
    }


  }

  return state;
};