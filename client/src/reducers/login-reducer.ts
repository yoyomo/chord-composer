import {initialState, State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {parseHTTPHeadersToJSON, requestAjax} from "../core/services/ajax-service";
import {AuthConfirmEmail, AuthSignIn, AuthSignOut, AuthSignUp} from "../resources/routes";
import {historyPush} from "../core/services/navigation-service";
import {ResourceType} from "../resources/resource";
import {UserResource} from "../resources/user-resource";
import {Action} from "../core/root-reducer";
import {Effect} from "../core/services/service";
import {setCookie} from "../utils/cookies";
import {getLoggedInUserRequestName} from "./footer-reducer";
import {parseMMLChords} from "../utils/mml-utils";
import {getStripePublishableKeyRequestName} from "./router-reducer";
import {StripeResource} from "../resources/stripe-resource";
import {getStripe} from "../core/services/stripe-service";

export interface SignInAction {
  type: "sign-in"
}

export const signIn = (): SignInAction => {
  return {
    type: "sign-in"
  };
};

export interface SignOutAction {
  type: "sign-out"
}

export const signOut = (): SignOutAction => {
  return {
    type: "sign-out"
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

export interface ChooseStripePlanAction {
  type: "choose-stripe-plan"
  stripePlanId: string
}

export const chooseStripePlan = (stripePlanId: string): ChooseStripePlanAction => {
  return {
    type: "choose-stripe-plan",
    stripePlanId
  }
};


export type LogInActions =
  | SignInAction
  | SignOutAction
  | GoSignUpAction
  | SignUpAction
  | ErrorOnSignUpAction
  | ChooseStripePlanAction;


export interface ResponseType {
  status: string
  data: ResourceType
  errors: string[]
}

export const AuthHeaders = ["access-token", "token-type", "client", "expiry", "uid"];

export const setUser = (state: State, headers: string, userData: UserResource | void): State => {
  state = {...state};
  state.loggedInUser = userData;
  state.headers = parseHTTPHeadersToJSON(headers);

  state.savedChords = (state.loggedInUser && parseMMLChords(state.chordRules, state.loggedInUser.favorite_chords)) || [];

  for (let key in state.headers) {
    if (AuthHeaders.indexOf(key) !== -1) {
      setCookie(key, state.headers[key], Number(state.headers["expiry"]));
    } else {
      delete state.headers[key];
    }
  }
  setCookie("id", (state.loggedInUser && state.loggedInUser.id.toString()) || "", Number(state.headers["expiry"]));

  return state;
};

export const reduceLogin = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "complete-request":
      if (!action.response) break;
      let response = JSON.parse(action.response) as ResponseType;

      if (action.name[0] === userSignInRequesName) {
        if (action.success) {
          effects = effects.concat(requestAjax([validateTokenRequestName], {
            url: AuthConfirmEmail,
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
          state = setUser(state, action.headers, response.data as UserResource);
          state.toggles = {...state.toggles};
          state.toggles.showLogInModal = false;

          effects = effects.concat(historyPush({pathname: 'home/chords'}));
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
          effects = effects.concat(historyPush({pathname: '/home/chords'}));

        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signUp = (response.errors as any).full_messages || response.errors;
          state.loginPage.success = initialState.loginPage.success;
        }
      } else if (action.name[0] === getLoggedInUserRequestName) {
        if (action.success) {
          state = setUser(state, action.headers, response.data as UserResource);
        }
      } else if (action.name[0] === userSignOutRequesName) {
        if (action.success) {
          state = setUser(state, action.headers, undefined);
        }
      } else if(action.name[0] === getStripePublishableKeyRequestName) {
        let stripeData = response.data as StripeResource;
        state = {...state};
        state.stripe = {...state.stripe};
        state.stripe.publishableKey = stripeData.publishable_key;

        state.stripe.plans = stripeData.plans;
        state.stripe.chosenPlanID = stripeData.plans[0].id;
        effects = effects.concat(getStripe(state.stripe.publishableKey));
      }
      break;

    case "choose-stripe-plan":
      state = {...state};
      state.stripe = {...state.stripe};
      state.stripe.chosenPlanID = action.stripePlanId;
      break;

    case "sign-in": {
      effects.push(requestAjax([userSignInRequesName],
        {
          url: AuthSignIn, method: "PUT", headers: {},
          json: {
            email: state.inputs.email,
            password: state.inputs.password
          }
        }));

      break;
    }

    case "sign-out": {
      effects.push(requestAjax([userSignOutRequesName],
        {
          url: AuthSignOut, method: "DELETE", headers: state.headers
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

      if (!action.token_id) {
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
export const userSignOutRequesName = "user-sign-out";
export const userSignUpRequesName = "user-sign-up";