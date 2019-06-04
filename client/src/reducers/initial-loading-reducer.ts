import {State} from "../state";
import {Action, Effect} from "../react-root";
import {ReductionWithEffect} from "../core/reducers";
import {requestResourceFetch} from "../core/resources";

export interface InitAction {
  type: 'init'
}
export const init = (): InitAction => {
  return {
    type: 'init'
  }
};

export type InitialLoadingActions =
  InitAction
  ;

export const reduceInitialLoading = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {
    case "init": {
      effects.push(requestResourceFetch(["load-logged-in-user"], "/api/v1/users/1"));
      break;
    }

    case "complete-request": {
      debugger;
      break;
    }

  }

  return {state, effects};
};