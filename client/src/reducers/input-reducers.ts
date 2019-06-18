import {Inputs, State} from "../state";
import {Action, Effect} from "../react-root";
import {ReductionWithEffect} from "../core/reducers";
import {clearInputDebouncing} from "../core/services/input-debouncing-service";

export interface InputChange {
  type: "input-change"
  target: Extract<keyof Inputs, string>
  text: string
}

export const inputChange = (target: Extract<keyof Inputs, string>, text: string): InputChange => {
  return {
    type: "input-change",
    target,
    text
  };
};

export function inputChangeDispatcher(dispatch: (a: Action) => void,
                                                     target: Extract<keyof Inputs, string>, value?: string) {
  return (e: EventInput) => {
    e.stopPropagation();
    dispatch(inputChange(target, value === undefined ? e.target.value : value));
  }
}

export interface EventInput {
  stopPropagation: () => void,
  target: any
}

export interface InputMap {
  [k: string]: string
}

export function reduceInputs<T extends InputMap>(state: InputMap, a: Action): ReductionWithEffect<T> {
  let effects: Effect[] = [];
  switch (a.type) {
    case 'input-change':
      effects = effects.concat(clearInputDebouncing());
      if (state[a.target] === a.text) break;
      state = {...state};
      state[a.target] = a.text;
      break;
  }

  return {state: state as T, effects};
}