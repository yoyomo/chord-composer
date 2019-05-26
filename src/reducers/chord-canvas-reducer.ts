import {State} from "../state";
import {Action} from "../react-root";
import {ChordType} from "./recompute-chord-grid";

export interface SelectKeyAction {
  type: "select-key"
  keyIndex: number
}

export const selectKey = (keyIndex: number): SelectKeyAction => {
  return {
    type: "select-key",
    keyIndex
  };
};

export interface SelectChordAction {
  type: "select-chord"
  chord: ChordType
}

export const selectChord = (chord: ChordType): SelectChordAction => {
  return {
    type: "select-chord",
    chord: chord
  };
};

export type ChordCanvasActions =
    SelectKeyAction
    | SelectChordAction;


export const reduceChordCanvas = (state: State, action: Action): State => {
  switch (action.type) {
    case "select-key": {
      let keyIndex = action.keyIndex;

      state = {...state};
      state.selectedKeyIndex = keyIndex;
      break;
    }

    case "select-chord": {
      state = {...state};
      state.selectedChord = action.chord;
      break;
    }

    case "show-variations": {
      if (state.selectedChord !== null) {
        state = {...state};
        state.showingVariations = {...state.showingVariations};
        state.showingVariations[state.selectedChord && state.selectedChord.chordRuleIndex] = true;
      }
      break;
    }

    case "hide-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[state.selectedChord.chordRuleIndex] = false;
      break;
    }

  }

  return state;
};
