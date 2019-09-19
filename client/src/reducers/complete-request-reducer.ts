import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Action} from "../core/root-reducer";

export const stringifyRequestName = (name: string[]) => {
  return name.join('-');
};

export const reduceCompleteRequest = (state: State, action: Action): ReductionWithEffect<State> => {
  switch (action.type) {

    case "complete-request": {
      state = {...state};
      state.loadingRequests = {...state.loadingRequests};
      delete state.loadingRequests[stringifyRequestName(action.name)];
      break;
    }


    case "loading-request":
      state = {...state};
      state.loadingRequests = {...state.loadingRequests};
      state.loadingRequests[stringifyRequestName(action.name)] = true;
      break;
  }

  return {state};
};