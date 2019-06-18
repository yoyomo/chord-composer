import {State} from "../state";
import {Action, Effect} from "../react-root";
import {ReductionWithEffect} from "../core/reducers";
import {requestAjax} from "../core/services/ajax-services";
import {loadUserRequestName} from "./initial-loading-reducer";
import {AuthSignIn, ApiV1UsersPath, AuthSignUp} from "../resources/routes";
import {historyPush} from "../core/services/navigation-services";

export interface SignInAction {
  type: "sign-in"
}

export const signIn = (): SignInAction => {
  return {
    type: "sign-in"
  };
};

export interface GoSignUpAction {
  type: "go-sign-up"
}

export const goSignUp = (): GoSignUpAction => {
  return {
    type: "go-sign-up"
  };
};

export interface SignUpAction {
  type: "sign-up"
}

export const signUp = (): SignUpAction => {
  return {
    type: "sign-up"
  };
};

export type LogInActions =
  | SignInAction
  | GoSignUpAction
  | SignUpAction;


export const reduceLogin = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "complete-request":
      if (!action.response) break;
      let response = JSON.parse(action.response);

      if (action.name[0] === userSignInRequesName){
        if(response.success) {

        } else {
          state = {...state};
          state.errors = {...state.errors};
          state.errors.signIn = response.errors
        }
      }

      if (action.name[0] === userSignUpRequesName){
        if(response.success) {

        } else {
          state = {...state};
          state.errors = {...state.errors};
          state.errors.signUp = response.errors
        }
      }
      break;

    case "sign-in": {
      effects.push(requestAjax([userSignInRequesName],
        {url: AuthSignIn, method: "POST",
        json: {
          username: state.inputs.email,
          password: state.inputs.password
      }
      }));

      break;
    }

    case "sign-up": {
      effects.push(requestAjax([userSignUpRequesName],
        {url: AuthSignUp, method: "GET",
          json: {
            username: state.inputs.email,
            password: state.inputs.password
          }
        }));

      break;
    }

    case "go-sign-up": {
      effects.push(historyPush({pathname: state.pathParts[0] + '/sign_up'}));
      break;
    }


  }

  return {state, effects};
};

export const userSignInRequesName = "user-sign-in";
export const userSignUpRequesName = "user-sign-up";