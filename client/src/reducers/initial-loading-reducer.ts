import {State} from "../state";
import {Action, Effect} from "../react-root";
import {ReductionWithEffect} from "../core/reducers";
import {RapiV1UsersPath} from "../resources/routes";
import {parseMMLChords} from "../utils/mml";
import {requestAjax} from "../core/services/ajax-services";

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
      effects.push(requestAjax([loadUserRequestName], {url: RapiV1UsersPath + "/1", method: "GET"}));
      break;
    }

    case "complete-request": {
      if (!action.response) break;
      let response = JSON.parse(action.response);

      if (action.name[0] === loadUserRequestName){
        let user = response;
        if (user){
          state = {...state};
          state.loggedInUser = user;

          state.savedChords = parseMMLChords(state.chordRules, user.favorite_chords)
        }
      }

      break;
    }

  }

  return {state, effects};
};

export const loadUserRequestName = "load-logged-in-user";