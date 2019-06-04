import {State} from "../state";
import {Action, Effect} from "../react-root";
import {ReductionWithEffect} from "../core/reducers";
import {requestResourceFetch} from "../core/resources";
import {RapiV1UsersPath} from "../resources/routes";
import {parseMMLChords} from "../utils/mml";

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
      effects.push(requestResourceFetch([loadUserRequestName], RapiV1UsersPath + "/1"));
      break;
    }

    case "complete-request": {
      let response = JSON.parse(action.response);

      if (action.name[0] === loadUserRequestName){
        let user = response;
        if (user){
          state = {...state};
          state.loggedInUser = {...state.loggedInUser};
          state.loggedInUser = user;

          state.savedChords = parseMMLChords(state.loggedInUser.favoriteChords)
        }
      }

      break;
    }

  }

  return {state, effects};
};

export const loadUserRequestName = "load-logged-in-user";