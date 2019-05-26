import {State} from "../state";
import {Action} from "../react-root";

export interface ShowVariationsAction {
  type: "show-variations"
}

export const showVariations = (): ShowVariationsAction => {
  return {
    type: "show-variations",
  };
};

export interface HideVariationsAction {
  type: "hide-variations"
}

export const hideVariations = (): HideVariationsAction => {
  return {
    type: "hide-variations",
  };
};

export interface SaveChordAction {
  type: "save-chord"
}

export const saveChord = (): SaveChordAction => {
  return {
    type: "save-chord",
  };
};

export type FooterActions =
    ShowVariationsAction
    | HideVariationsAction
    | SaveChordAction;

export const reduceFooter = (state: State, action: Action): State => {
  switch (action.type) {

    case "show-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[state.selectedChord.chordRuleIndex] = true;
      break;
    }

    case "hide-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[state.selectedChord.chordRuleIndex] = false;
      break;
    }

    case "save-chord": {
      state = {...state};
      state.savedChords = state.savedChords.slice();
      state.savedChords.push(state.chordGrid[state.selectedChord.chordRuleIndex]);
      break;
    }

  }

  return state;
};
