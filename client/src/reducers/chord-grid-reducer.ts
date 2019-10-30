import { State } from "../state";
import { ReductionWithEffect } from "../core/reducers";
import { Action } from "../core/root-reducer";

export type SelectKeyAction = {
  type: "select-key"
  keyIndex: number
}

export const selectKey = (keyIndex: number): SelectKeyAction => {
  return {
    type: "select-key",
    keyIndex
  };
};

export type ChordCanvasActions =
  SelectKeyAction;


export const reduceChordCanvas = (state: State, action: Action): ReductionWithEffect<State> => {
  switch (action.type) {
    case "select-key": {
      let keyIndex = action.keyIndex;

      state = { ...state };
      state.selectedKeyIndex = keyIndex;
      break;
    }
  }

  return { state };
};
