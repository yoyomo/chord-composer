import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {parseMMLChords} from "../utils/mml-utils";
import {historyPush} from "../core/services/navigation-service";
import {Action} from "../core/root-reducer";
import {Effect} from "../core/services/service";

export const reduceInitialLoading = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "complete-request": {
      if (!action.response) break;
      let response = JSON.parse(action.response);

      if (action.name[0] === loadUserRequestName){
        let user = response;
        if (user.success){
          state = {...state};
          state.loggedInUser = user;

          state.savedChords = parseMMLChords(state.chordRules, user.favorite_chords)
        }
        else {
          effects = effects.concat(historyPush({pathname: '/sign_up'}));
        }
      }

      break;
    }

  }

  return {state, effects};
};

export const loadUserRequestName = "load-logged-in-user";