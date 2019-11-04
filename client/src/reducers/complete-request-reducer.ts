import {initialState, State, Toggles} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";
import {setTimer} from "../core/services/timer-service";
import {toggle} from "./toggle-reducer";
import {Effect} from "../core/services/service";

export const stringifyRequestName = (name: string[]) => {
  return name.join('-');
};

export const reduceCompleteRequest = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] | void = [];
  switch (action.type) {

    case "complete-request": {
      state = {...state};
      state.loadingRequests = {...state.loadingRequests};
      delete state.loadingRequests[stringifyRequestName(action.name)];

      const response = JSON.parse(action.response);

      if (action.success) {
        state.errors = initialState.errors;
        //TODO save according to type using indexer
      } else {
        state.success = initialState.success;
        state.errors = {...state.errors};
        state.errors.server = response.errors;

        state.toggles = {...state.toggles};
        state.toggles.showTemporaryUserModal = true;
        effects = effects.concat(setTimer(toggle<Toggles>("showTemporaryUserModal", false), 1500))
      }
      break;
    }


    case "loading-request":
      state = {...state};
      state.loadingRequests = {...state.loadingRequests};
      state.loadingRequests[stringifyRequestName(action.name)] = true;
      break;
  }

  return {state, effects};
};