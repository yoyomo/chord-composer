import {historyPush, navigationReducer, PathLocation} from "../core/services/navigation-service";
import {State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {Effect} from "../core/services/service";
import {getStripe} from "../core/services/stripe-service";

export type PathPart = 'chords' | 'sign-up'
export function routerReducer(state: State,
                              location: PathLocation): ReductionWithEffect<State> {
  let effects: Effect[] = [];
  state = {...state};

  effects = effects.concat(getStripe(state.stripe.publishableKey));

  let nextPathParts: PathPart[] = location.pathname.split("/").slice(1) as PathPart[];
  if (!nextPathParts[0]) nextPathParts = ["chords"];
  
  switch (nextPathParts[0]) {

    case "sign-up":
      if(state.loggedInUser) {
        nextPathParts = ["chords"];
        effects = effects.concat(historyPush({pathname: "chords"}));
      }

      break;

    case "chords":
      break;

  }


  state.pathParts = nextPathParts;

  return {state, effects};
}

export const reduceNavigation = navigationReducer(routerReducer);
