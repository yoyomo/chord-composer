import {initialState, State, Toggles} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {parseHTTPHeadersToJSON, requestAjax} from "../core/services/ajax-service";
import {AuthGenerateNewAccessToken, AuthResendConfirmationEmail, AuthSignIn, AuthSignUp} from "../resources/routes";
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
import {setTimer} from "../core/services/timer-service";
import {toggle} from "./toggle-reducer";

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
  error: ResponseError
}

export const errorOnSignUp = (error: ResponseError): ErrorOnSignUpAction => {
  return {
    type: "error-on-sign-up",
    error
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

export interface GenerateNewAccessTokenAction {
  type: "generate-new-access-token"
}

export const generateNewAccessToken = (): GenerateNewAccessTokenAction => {
  return {
    type: "generate-new-access-token",
  }
};

export interface ResendConfirmationEmailAction {
  type: "resend-confirmation-email"
}

export const resendConfirmationEmail = (): ResendConfirmationEmailAction => {
  return {
    type: "resend-confirmation-email",
  }
};

export type LogInActions =
  | SignInAction
  | SignOutAction
  | GoSignUpAction
  | SignUpAction
  | ErrorOnSignUpAction
  | ChooseStripePlanAction
  | GenerateNewAccessTokenAction
  | ResendConfirmationEmailAction;


export interface ResponseType {
  status: string
  data: ResourceType
  errors: ResponseError[]
}

export type ResponseErrorType = "sign_in" | "confirmation" | "email" | "password" | "confirm_password" | "stripe_card"

export interface ResponseError  {
  type: ResponseErrorType
  message: string
}

export const EMAIL_REGEXP = /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/;
export const AuthHeaders = ["kordpose-session", "id"];

export const setUser = (state: State, headers: string, userData: UserResource): State => {
  state = {...state};
  state.loggedInUser = userData;
  state.headers = parseHTTPHeadersToJSON(headers);

  state.savedChords = parseMMLChords(state.chordRules, state.loggedInUser.favorite_chords);

  for (let key in state.headers) {
    if (AuthHeaders.indexOf(key) !== -1) {
      setCookie(key, state.headers[key]);
    } else {
      delete state.headers[key];
    }
  }

  return state;
};

export const resetUser = (state: State): State => {
  state = {...state};
  state.loggedInUser = undefined;

  state.savedChords = [];

  state.headers = {...state.headers};

  for (let key in state.headers) {
    state.headers[key] = "";
    if (AuthHeaders.indexOf(key) !== -1) {
      setCookie(key, state.headers[key]);
    } else {
      delete state.headers[key];
    }
  }

  return state;
};

export const reduceLogin = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "complete-request":
      if (!action.response) break;
      let response = JSON.parse(action.response) as ResponseType;

      if (action.name[0] === userSignInRequestName) {
        if (action.success) {
          state = {...state};
          state = setUser(state, action.headers, response.data as UserResource);
          state.toggles = {...state.toggles};
          state.toggles.showLogInModal = false;
          state.loginPage = {...state.loginPage};
          state.loginPage.success = initialState.loginPage.success;
          state.loginPage.errors = initialState.loginPage.errors;
          state.inputs = {...state.inputs};
          state.inputs.email = "";
          state.inputs.password = "";
          state.inputs.confirmPassword = "";

          state.toggles.showSuccessfulLogInModal = true;

          effects = effects.concat(setTimer(toggle<Toggles>("showSuccessfulLogInModal", false), 1500))
        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signIn = response.errors;
          state.loginPage.success = initialState.loginPage.success;
        }
      } else if (action.name[0] === confirmEmailRequestName) {
        if (action.success) {
          state = {...state};
          state.toggles = {...state.toggles};
          state.toggles.showLogInModal = true;

          state.loginPage = {...state.loginPage};
          state.loginPage.success = {...state.loginPage.success};
          state.loginPage.success.signUp = "Account Confirmed! Try logging in now";

          effects = effects.concat(historyPush({pathname: 'home/chords'}));
        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signIn = response.errors;
          state.toggles = {...state.toggles};
          state.toggles.showLogInModal = true;
        }
      } else if (action.name[0] === userSignUpRequestName) {

        if (action.success) {
          state = {...state};
          state.toggles = {...state.toggles};
          state.toggles.showLogInModal = true;

          state.loginPage = {...state.loginPage};
          state.loginPage.success = {...state.loginPage.success};
          state.loginPage.success.signUp = "A confirmation email was sent to you. Please confirm your email.";
          state.loginPage.errors = initialState.loginPage.errors;
          effects = effects.concat(historyPush({pathname: '/home/chords'}));

        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signUp = response.errors;
          state.loginPage.success = initialState.loginPage.success;
        }
      } else if (action.name[0] === getLoggedInUserRequestName) {
        if (action.success) {
          state = setUser(state, action.headers, response.data);
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
      effects.push(requestAjax([userSignInRequestName],
        {
          url: AuthSignIn, method: "PUT", headers: {},
          json: {
            user: {
              email: state.inputs.email,
              password: state.inputs.password
            }
          }
        }));

      break;
    }

    case "sign-out": {
      state = resetUser(state);
      break;
    }

    case "sign-up": {

      state = {...state};
      state.loginPage = {...state.loginPage};
      state.loginPage.errors = {...state.loginPage.errors};
      state.loginPage.errors.signUp = [];

      if (!state.inputs.email) {
        state.loginPage.errors.signUp.push({type: "email", message: "Email is required"});
      } else if (!EMAIL_REGEXP.test(state.inputs.email)) {
        state.loginPage.errors.signUp.push({type: "email", message: "Email is invalid"});
      }

      if (!state.inputs.password) {
        state.loginPage.errors.signUp.push({type:"password", message: "Password is required"});
      } else if(state.inputs.password.length < state.minimumPasswordLength) {
        state.loginPage.errors.signUp.push({type:"password", message: "Password minimum length is "+ state.minimumPasswordLength});
      }

      if (state.inputs.password !== state.inputs.confirmPassword) {
        state.loginPage.errors.signUp.push({type: "confirm_password", message: "Password mismatch"});
      }

      if (!action.token_id) {
        state.loginPage.errors.signUp.push({type: "stripe_card", message: "Must insert valid card"});
      }

      if (state.loginPage.errors.signUp.length === 0) {

        effects.push(requestAjax([userSignUpRequestName],
          {
            url: AuthSignUp, method: "POST", headers: state.headers,
            json: {
              user: {
                email: state.inputs.email,
                password: state.inputs.password,
                stripe_plan_id: state.stripe.chosenPlanID,
                stripe_token_id: action.token_id
              }
            }
          }));
      }


      break;
    }

    case "error-on-sign-up": {

      state = {...state};
      state.loginPage = {...state.loginPage};
      state.loginPage.errors = {...state.loginPage.errors};
      state.loginPage.errors.signUp = [action.error];

      break;
    }

    case "go-sign-up": {
      effects.push(historyPush({pathname: '/sign-up'}));
      break;
    }

    case "generate-new-access-token":
      effects.push(requestAjax([userGenerateNewAccessTokenRequestName],
        {
          url: AuthGenerateNewAccessToken, method: "PUT", headers: state.headers,
        }));
      break;

    case "resend-confirmation-email":
      effects.push(requestAjax([resendConfirmationEmailRequestName],
        {
          url: AuthResendConfirmationEmail, method: "PUT", headers: state.headers,
          json: {
            user: {
              email: state.inputs.email,
              password: state.inputs.password,
            }
          }
        }));
      break;



  }

  return {state, effects};
};

export const confirmEmailRequestName = "confirm-email";
export const userSignInRequestName = "user-sign-in";
export const userSignUpRequestName = "user-sign-up";
export const resendConfirmationEmailRequestName = "resend-confirmation-email";
export const userGenerateNewAccessTokenRequestName = "user-generate-new-access-token";