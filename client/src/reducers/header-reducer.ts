import {HomePages, State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";

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
  page: HomePages
}

export const goToHomePage = (page: HomePages): GoToHomePageAction => {
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
      state = {...state};
      state.homePage = {...state.homePage};
      state.homePage.page = action.page;
      break;
    }


  }

  return {state};
};