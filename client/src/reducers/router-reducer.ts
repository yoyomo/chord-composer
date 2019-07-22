import {historyPush, navigationReducer, PathLocation} from "../core/services/navigation-service";
import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Effect} from "../core/services/service";

export type PathPart = 'login' | 'chords' | 'sign_up'
export function routerReducer(state: State,
                              location: PathLocation): ReductionWithEffect<State> {
  let effects: Effect[] = [];
  state = {...state};

  let nextPathParts: PathPart[] = location.pathname.split("/").slice(1) as PathPart[];
  if (!nextPathParts[0]) nextPathParts = ["chords"];
  
  switch (nextPathParts[0]) {

    case "login":
      if(state.loggedInUser) {
        nextPathParts = ["chords"];
        effects = effects.concat(historyPush({pathname: "chords"}));
      }

      break;

    case "chords":
      if(!state.loggedInUser){
        nextPathParts = ["login"];
        effects = effects.concat(historyPush({pathname: "login"}));
      }
      break;

  }


  state.pathParts = nextPathParts;

  return {state, effects};
}

export const reduceNavigation = navigationReducer(routerReducer);
