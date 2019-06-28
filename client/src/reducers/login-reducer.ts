import {initialState, State} from "../state";
import {Action, Effect} from "../react-root";
import {ReductionWithEffect} from "../core/reducers";
import {requestAjax} from "../core/services/ajax-services";
import {AuthSignIn, AuthSignUp} from "../resources/routes";
import {historyPush} from "../core/services/navigation-services";
import {UserResource} from "../resources/user-resource";
import {ResourceType} from "../resources/resource";

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


export interface ResponseType {
  status: string
  data: ResourceType
  errors: string[]
}

export const reduceLogin = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "complete-request":
      if (!action.response) break;
      let response = JSON.parse(action.response) as ResponseType;

      if (action.name[0] === userSignInRequesName){
        if(action.success) {
          state = {...state};
          state.loggedInUser = response.data;
          effects = effects.concat(historyPush({pathname: '/chords'}));
        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signIn = response.errors
        }
      }

      if (action.name[0] === userSignUpRequesName){
        if(action.success) {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.success = {...state.loginPage.success};
          state.loginPage.success.signUp = "A confirmation email was sent to you. Please confirm your email.";
          state.loginPage.errors = initialState.loginPage.errors;
          effects = effects.concat(historyPush({pathname: '/login'}));

        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signUp = (response.errors as any).full_messages;
          state.loginPage.success = initialState.loginPage.success;
        }
      }
      break;

    case "sign-in": {
      effects.push(requestAjax([userSignInRequesName],
        {url: AuthSignIn, method: "POST",
        json: {
          email: state.inputs.email,
          password: state.inputs.password
      }
      }));

      break;
    }

    case "sign-up": {

      if(state.inputs.password !== state.inputs.confirmPassword) {
        state = {...state};
        state.loginPage = {...state.loginPage};
        state.loginPage.errors = {...state.loginPage.errors};
        state.loginPage.errors.signUp = ["Password mismatch"];
      }
      else{
        effects.push(requestAjax([userSignUpRequesName],
          {url: AuthSignUp, method: "POST",
            json: {
              email: state.inputs.email,
              password: state.inputs.password
            }
          }));
      }


      break;
    }

    case "go-sign-up": {
      effects.push(historyPush({pathname: '/login/sign_up'}));
      break;
    }


  }

  return {state, effects};
};

export const userSignInRequesName = "user-sign-in";
export const userSignUpRequesName = "user-sign-up";