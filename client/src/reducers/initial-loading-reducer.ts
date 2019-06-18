import {State} from "../state";
import {Action, Effect} from "../react-root";
import {ReductionWithEffect} from "../core/reducers";
import {parseMMLChords} from "../utils/mml";
import {historyPush} from "../core/services/navigation-services";

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
          effects = effects.concat(historyPush({pathname: '/login'}));
        }
      }

      break;
    }

  }

  return {state, effects};
};

export const loadUserRequestName = "load-logged-in-user";