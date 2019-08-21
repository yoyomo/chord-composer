import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";
import {historyPush} from "../core/services/navigation-service";
import {Effect} from "../core/services/service";
import {PathPart} from "./router-reducer";

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

export interface GoToHomePageAction {
  type: "go-to-home-page"
  page: PathPart
}

export const goToHomePage = (page: PathPart): GoToHomePageAction => {
  return {
    type: "go-to-home-page",
    page
  };
};


export type HeaderActions =
    | ChangeBaseFrequencyAction
    | SelectWaveTypeAction
    | ToggleSoundAction
    | GoToHomePageAction;


export const reduceHeader = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

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

    case "go-to-home-page": {
      effects = effects.concat(historyPush({pathname: action.page}));
      break;
    }

  }

  return {state, effects};
};