import {historyPush, navigationReducer, PathLocation} from "../core/services/navigation-services";
import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Effect} from "../react-root";
import {requestAjax} from "../core/services/ajax-services";
import {RapiV1UsersPath} from "../resources/routes";
import {loadUserRequestName} from "./initial-loading-reducer";

export type PathPart = 'login' | 'chords'
export function routerReducer(state: State,
                              location: PathLocation): ReductionWithEffect<State> {
  let effects: Effect[] = [];
  state = {...state};

  let nextPathParts: PathPart[] = location.pathname.split("/").slice(1) as PathPart[];
  if (!nextPathParts[0]) nextPathParts = ["chords"];

  effects.push(requestAjax([loadUserRequestName], {url: RapiV1UsersPath + "/1", method: "GET"}));

  switch (nextPathParts[0]) {

    case "login":

      break;

    case "chords":
      //if not logged in, go to login page
      // nextPathParts = ["login"];
      break;

  }


  effects = effects.concat(historyPush({pathname: nextPathParts.join('/')}));
  state.pathParts = nextPathParts;

  return {state, effects};
}

export const reduceNavigation = navigationReducer(routerReducer);
