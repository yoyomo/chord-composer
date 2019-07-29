import {State} from "../state";
import {ChordType} from "./recompute-chord-grid";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";
import {mapChordToKeys} from "./chord-mapper-reducer";

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


export const reduceChordCanvas = (state: State, action: Action): ReductionWithEffect<State> => {
  switch (action.type) {
    case "select-key": {
      let keyIndex = action.keyIndex;

      state = {...state};
      state.selectedKeyIndex = keyIndex;
      break;
    }

    case "select-chord": {
      state = {...state};
      state.selectedGridChord = action.chord;

      state = mapChordToKeys(state);

      break;
    }

    case "show-variations": {
      if (!state.selectedGridChord) break;
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      if (!state.selectedGridChord) break;
      state.showingVariations[state.selectedGridChord.chordRuleIndex] = true;
      break;
    }

    case "hide-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      if (!state.selectedGridChord) break;
      state.showingVariations[state.selectedGridChord.chordRuleIndex] = false;
      break;
    }

  }

  return {state};
};
