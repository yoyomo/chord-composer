import { State } from "../state";
import { ReductionWithEffect } from "../core/reducers";
import { Action } from "../core/root-reducer";
import { historyPush } from "../core/services/navigation-service";
import { Effect } from "../core/services/services";
import { PathPart } from "./router-reducer";

export type GoToHomePageAction = {
  type: "go-to-home-page"
  page: PathPart
}

export const goToHomePage = (page: PathPart): GoToHomePageAction => {
  return {
    type: "go-to-home-page",
    page
  };
};


export type HeaderActions =
  | GoToHomePageAction;


export const reduceHeader = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "go-to-home-page": {
      effects = effects.concat(historyPush({ pathname: "/home/" + action.page }));
      break;
    }

  }

  return { state, effects };
};