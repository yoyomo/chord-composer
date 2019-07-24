import {initialState, State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {parseHTTPHeadersToJSON, requestAjax} from "../core/services/ajax-service";
import {AuthSignIn, AuthSignUp, AuthValidateToken} from "../resources/routes";
import {historyPush} from "../core/services/navigation-service";
import {ResourceType} from "../resources/resource";
import {UserResource} from "../resources/user-resource";
import {Action} from "../core/root-reducer";
import {Effect} from "../core/services/service";
import {setCookie} from "../utils/cookies";
import {getLoggedInUserRequestName} from "./footer-reducer";

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
  token_id: string
}

export const signUp = (token_id: string): SignUpAction => {
  return {
    type: "sign-up",
    token_id
  };
};

export interface ErrorOnSignUpAction {
  type: "error-on-sign-up"
  errorMessage: string
}

export const errorOnSignUp = (errorMessage: string): ErrorOnSignUpAction => {
  return {
    type: "error-on-sign-up",
    errorMessage
  };
};


export type LogInActions =
  | SignInAction
  | GoSignUpAction
  | SignUpAction
  | ErrorOnSignUpAction;


export interface ResponseType {
  status: string
  data: ResourceType
  errors: string[]
}

export const AuthHeaders = ["access-token", "token-type", "client", "expiry", "uid"];

export const reduceLogin = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "complete-request":
      if (!action.response) break;
      let response = JSON.parse(action.response) as ResponseType;

      if (action.name[0] === userSignInRequesName) {
        if (action.success) {
          effects = effects.concat(requestAjax([validateTokenRequestName], {
            url: AuthValidateToken,
            method: "GET",
            headers: parseHTTPHeadersToJSON(action.headers)
          }));
        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signIn = response.errors;
          state.loginPage.success = initialState.loginPage.success;
        }
      } else if (action.name[0] === validateTokenRequestName) {
        if (action.success) {
          state = {...state};
          state.loggedInUser = response.data as UserResource;
          state.headers = parseHTTPHeadersToJSON(action.headers);

          for (let key in state.headers){
            if (AuthHeaders.indexOf(key) !== -1) {
              setCookie(key, state.headers[key], Number(state.headers["expiry"]));
            } else {
              delete state.headers[key];
            }
          }
          setCookie("id", state.loggedInUser.id.toString(), Number(state.headers["expiry"]));

          effects = effects.concat(historyPush({pathname: '/chords'}));
        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signIn = response.errors
        }
      } else if (action.name[0] === userSignUpRequesName) {

        if (action.success) {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.success = {...state.loginPage.success};
          state.loginPage.success.signUp = "A confirmation email was sent to you. Please confirm your email.";
          state.loginPage.errors = initialState.loginPage.errors;
          effects = effects.concat(historyPush({pathname: '/chords'}));

        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signUp = (response.errors as any).full_messages || response.errors;
          state.loginPage.success = initialState.loginPage.success;
        }
      } else if (action.name[0] === getLoggedInUserRequestName) {
        state = {...state};
        state.loggedInUser = response.data as UserResource;
      }
      break;

    case "sign-in": {
      effects.push(requestAjax([userSignInRequesName],
        {
          url: AuthSignIn, method: "POST", headers: state.headers,
          json: {
            email: state.inputs.email,
            password: state.inputs.password
          }
        }));

      break;
    }

    case "sign-up": {

      state = {...state};
      state.loginPage = {...state.loginPage};
      state.loginPage.errors = {...state.loginPage.errors};
      state.loginPage.errors.signUp = [];

      if (!state.inputs.email) {
        state.loginPage.errors.signUp.push("Email is required");
      }

      if (!state.inputs.password) {
        state.loginPage.errors.signUp.push("Password is required");
      }

      if (state.inputs.password !== state.inputs.confirmPassword) {
        state.loginPage.errors.signUp.push("Password mismatch");
      }

      if (!action.token_id ) {
        state.loginPage.errors.signUp.push("Must insert valid card");
      }

      if (state.loginPage.errors.signUp.length === 0) {

        effects.push(requestAjax([userSignUpRequesName],
          {
            url: AuthSignUp, method: "POST", headers: state.headers,
            json: {
              email: state.inputs.email,
              password: state.inputs.password,
              stripe_plan_id: state.stripe.chosenPlanID,
              stripe_token_id: action.token_id
            }
          }));
      }


      break;
    }

    case "error-on-sign-up": {

      state = {...state};
      state.loginPage = {...state.loginPage};
      state.loginPage.errors = {...state.loginPage.errors};
      state.loginPage.errors.signUp = [action.errorMessage];

      break;
    }

    case "go-sign-up": {
      effects.push(historyPush({pathname: '/sign-up'}));
      break;
    }


  }

  return {state, effects};
};

export const validateTokenRequestName = "validate-token";
export const userSignInRequesName = "user-sign-in";
export const userSignUpRequesName = "user-sign-up";