import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";
import {Toggles} from "../state";

export interface Toggle<T = ToggleMap> {
  type: 'toggle',
  target: Extract<keyof T, string>,
  on?: boolean | void
}

export function toggle<T = ToggleMap>(target: Extract<keyof T, string>, on = undefined as boolean | void): Toggle<T> {
  return {type: "toggle", on, target};
}

export function toggleDispatcher(dispatch: (a: Toggle<Toggles>) => void,
                                                target: Extract<keyof Toggles, string>,
                                                on = undefined as boolean | void) {
  return (e?: { stopPropagation: () => void }) => {
    if (e) {
      e.stopPropagation();
    }
    dispatch(toggle<Toggles>(target, on));
  }
}

export interface ToggleMap {
  [k: string]: boolean
}

export type ToggleAction<T = ToggleMap> = Toggle<T>

export function reduceToggle<T extends ToggleMap>(state: ToggleMap, action: Action): ReductionWithEffect<T> {
  switch (action.type) {
    case 'toggle':
      let result: boolean;
      if (action.on != null) {
        result = !!action.on;
      }
      else {
        result = !state[action.target];
      }

      if (result !== !!state[action.target]) {
        state = {...state} as T;
        state[action.target] = result;
      }
      break;

  }
  return {state: state as T};
}