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

export interface RemoveSavedChordAction {
  type: "remove-saved-chord"
}

export const removeSavedChord = (): RemoveSavedChordAction => {
  return {
    type: "remove-saved-chord",
  };
};

export interface SelectSavedChordAction {
  type: "select-saved-chord"
  savedChordIndex: number
}

export const selectSavedChord = (savedChordIndex: number): SelectSavedChordAction => {
  return {
    type: "select-saved-chord",
    savedChordIndex
  };
};

export type FooterActions =
    ShowVariationsAction
    | HideVariationsAction
    | SaveChordAction
    | RemoveSavedChordAction
    | SelectSavedChordAction;

export const reduceFooter = (state: State, action: Action): State => {
  switch (action.type) {

    case "show-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[state.selectedGridChord.chordRuleIndex] = true;
      break;
    }

    case "hide-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[state.selectedGridChord.chordRuleIndex] = false;
      break;
    }

    case "save-chord": {
      state = {...state};
      state.savedChords = state.savedChords.slice();
      state.savedChords.push(state.selectedGridChord);
      break;
    }

    case "remove-saved-chord": {
      state = {...state};
      state.savedChords = state.savedChords.slice();
      state.savedChords.splice(state.selectedSavedChord || state.savedChords.length - 1, 1);
      state.selectedSavedChord = null as unknown as number;
      break;
    }

    case "select-saved-chord": {
      state = {...state};
      state.selectedSavedChord = action.savedChordIndex;
      break;
    }

  }

  return state;
};
