import {Effect, Services} from "./services";
import {Action} from "../root-reducer";

export interface SetTimerEffect {
  effectType: "set-timer"
  action: Action
  ms: number
}

export function setTimer(action: Action, ms: number): SetTimerEffect {
  return {
    effectType: "set-timer",
    action,
    ms
  }
}

export function withTimer(dispatch: (action: Action) => void): Services {
  let timer: number;

  return (effect: Effect) => {

    switch (effect.effectType) {
      case "set-timer":
        window.clearTimeout(timer);
        timer = window.setTimeout(() => dispatch(effect.action), effect.ms);
        break;
    }

  }
}
