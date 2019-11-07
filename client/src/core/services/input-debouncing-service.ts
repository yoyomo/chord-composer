import {Action} from "../root-reducer";
import {Effect} from "./services";

export const clearInputDebouncingEventName = "clear-input-debouncing";

export interface ClearInputDebouncing {
  effectType: "clear-input-debouncing"
}

export function clearInputDebouncing(): ClearInputDebouncing {
  return {effectType: "clear-input-debouncing"};
}

export const withInputDebouncing = (dispatch: (action: Action) => void) => {
  return (effect: Effect) => {
    switch (effect.effectType) {
      case "clear-input-debouncing":
        document.dispatchEvent(new Event(clearInputDebouncingEventName));
        break;
    }
  }
};