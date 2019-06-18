import {navigationReducer, PathLocation} from "../core/services/navigation-services";
import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Effect} from "../react-root";
import {requestAjax} from "../core/services/ajax-services";
import {ApiV1UsersPath} from "../resources/routes";
import {loadUserRequestName} from "./initial-loading-reducer";

export type PathPart = 'login' | 'chords' | 'sign_up'
export function routerReducer(state: State,
                              location: PathLocation): ReductionWithEffect<State> {
  let effects: Effect[] = [];
  state = {...state};

  let nextPathParts: PathPart[] = location.pathname.split("/").slice(1) as PathPart[];
  if (!nextPathParts[0]) nextPathParts = ["chords"];
  
  switch (nextPathParts[0]) {

    case "login":

      break;

    case "chords":
      effects.push(requestAjax([loadUserRequestName], {url: ApiV1UsersPath + "/1", method: "GET"}));
      break;

  }


  state.pathParts = nextPathParts;

  return {state, effects};
}

export const reduceNavigation = navigationReducer(routerReducer);
