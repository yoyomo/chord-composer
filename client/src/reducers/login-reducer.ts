import { initialState, State, Toggles } from "../state";
import { ReductionWithEffect } from "../core/reducers";
import { parseHTTPHeadersToJSON, requestAjax } from "../core/services/ajax-service";
import {
  ApiV1UsersPath,
  AuthResendConfirmationEmail,
  AuthSignIn,
  AuthSignUp,
} from "../resources/routes";
import { historyPush } from "../core/services/navigation-service";
import { ResourceType } from "../resources/resource";
import { UserResource } from "../resources/user-resource";
import { Action } from "../core/root-reducer";
import { Effect } from "../core/services/service";
import { setCookie } from "../utils/cookies";
import { getLoggedInUserRequestName } from "./footer-reducer";
import { parseMMLChords } from "../utils/mml-utils";
import { getStripePublishableKeyRequestName, getStripeData } from "./router-reducer";
import { StripeResource } from "../resources/stripe-resource";
import { getStripe } from "../core/services/stripe-service";
import { setTimer } from "../core/services/timer-service";
import { toggle } from "./toggle-reducer";

export type SignInAction = {
  type: "sign-in"
}

export const signIn = (): SignInAction => {
  return {
    type: "sign-in"
  };
};

export type SignOutAction = {
  type: "sign-out"
}

export const signOut = (): SignOutAction => {
  return {
    type: "sign-out"
  };
};

export type GoSignUpAction = {
  type: "go-sign-up"
}

export const goSignUp = (): GoSignUpAction => {
  return {
    type: "go-sign-up"
  };
};

export type SignUpAction = {
  type: "sign-up"
  token_id: string
}

export const signUp = (token_id: string): SignUpAction => {
  return {
    type: "sign-up",
    token_id
  };
};

export type ErrorOnSignUpAction = {
  type: "error-on-sign-up"
  error: ResponseError
}

export const errorOnSignUp = (error: ResponseError): ErrorOnSignUpAction => {
  return {
    type: "error-on-sign-up",
    error
  };
};

export type ChooseStripePlanAction = {
  type: "choose-stripe-plan"
  stripePlanId: string
}

export const chooseStripePlan = (stripePlanId: string): ChooseStripePlanAction => {
  return {
    type: "choose-stripe-plan",
    stripePlanId
  }
};

export type GenerateNewAccessTokenAction = {
  type: "generate-new-access-token"
}

export const generateNewAccessToken = (): GenerateNewAccessTokenAction => {
  return {
    type: "generate-new-access-token",
  }
};

export type ResendConfirmationEmailAction = {
  type: "resend-confirmation-email"
}

export const resendConfirmationEmail = (): ResendConfirmationEmailAction => {
  return {
    type: "resend-confirmation-email",
  }
};

export type ChangeEmailAction = {
  type: "change-email"
}

export const changeEmail = (): ChangeEmailAction => {
  return {
    type: "change-email",
  }
};

export type ChangePasswordAction = {
  type: "change-password"
}

export const changePassword = (): ChangePasswordAction => {
  return {
    type: "change-password",
  }
};

export type ForgotPasswordAction = {
  type: "forgot-password"
}

export const forgotPassword = (): ForgotPasswordAction => {
  return {
    type: "forgot-password",
  }
};

export type ResetPasswordAction = {
  type: "reset-password"
}

export const resetPassword = (): ResetPasswordAction => {
  return {
    type: "reset-password",
  }
};

export type CancelSubscriptionAction = {
  type: "cancel-subscription"
}

export const cancelSubscription = (): CancelSubscriptionAction => {
  return {
    type: "cancel-subscription",
  }
};

export type ChangeSubscriptionAction = {
  type: "change-subscription"
  token_id: string
}

export const changeSubscription = (token_id: string): ChangeSubscriptionAction => {
  return {
    type: "change-subscription",
    token_id
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
  | ResendConfirmationEmailAction
  | ChangeEmailAction
  | ChangePasswordAction
  | ForgotPasswordAction
  | ResetPasswordAction
  | CancelSubscriptionAction
  | ChangeSubscriptionAction;


export interface ResponseType {
  status: string
  data: ResourceType
  errors: ResponseError[]
}

export type ResponseErrorType = "sign_in" | "confirmation" | "email" | "password" | "confirm_password" | "stripe_card" | "forgot_password" | "reset_password"

export type ResponseError = {
  type: ResponseErrorType
  message: string
}

export const EMAIL_REGEXP = /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/;
export const AuthHeaders = ["kordpose-session", "id"];

export const setUser = (state: State, headers: string, userData: UserResource): State => {
  state = { ...state };
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
  state = { ...state };
  state.loggedInUser = undefined;

  state.savedChords = [];

  state.headers = { ...state.headers };

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
  let effects: Effect[] | void = [];
  switch (action.type) {

    case "complete-request":
      if (!action.response) break;
      let response = JSON.parse(action.response) as ResponseType;

      switch (action.name[0]) {
        case userSignInRequestName: {
          if (action.success) {
            state = { ...state };
            state = setUser(state, action.headers, response.data as UserResource);
            state.toggles = { ...state.toggles };
            state.toggles.showLogInModal = false;
            state.errors = initialState.errors;
            state.inputs = { ...state.inputs };
            state.inputs.email = "";
            state.inputs.password = "";
            state.inputs.confirmPassword = "";

            state.success = {...state.success};
            state.success.signIn = "Successful Login!";
            state.toggles.showTemporaryUserModal = true;

            effects = effects.concat(setTimer(toggle<Toggles>("showTemporaryUserModal", false), 1500))
          } else {
            state = { ...state };
            state.errors = { ...state.errors };
            state.errors.signIn = response.errors;
            state.success = initialState.success;
          }
          break;
        }
        case confirmEmailRequestName: {
          if (action.success) {
            state = { ...state };
            state.toggles = { ...state.toggles };
            state.toggles.showLogInModal = true;

            state.success = { ...state.success };
            state.success.signUp = "Account Confirmed! Try logging in now";

            effects = effects.concat(historyPush({ pathname: 'home/chords' }));
          } else {
            state = { ...state };
            state.errors = { ...state.errors };
            state.errors.signIn = response.errors;
            state.toggles = { ...state.toggles };
            state.toggles.showLogInModal = true;
          }
          break;
        }
        case userSignUpRequestName: {

          if (action.success) {
            state = { ...state };
            state.toggles = { ...state.toggles };
            state.toggles.showLogInModal = true;

            state.success = { ...state.success };
            state.success.signUp = "A confirmation email was sent to you. Please confirm your email.";
            state.errors = initialState.errors;
            effects = effects.concat(historyPush({ pathname: '/home/chords' }));

          } else {
            state = { ...state };
            state.errors = { ...state.errors };
            state.errors.signUp = response.errors;
            state.success = initialState.success;
          }

          break;
        }
        case getLoggedInUserRequestName: {
          if (action.success) {
            state = { ...state };
            state.loggedInUser = response.data;
          }
          break;
        }
        case getStripePublishableKeyRequestName: {
          let stripeData = response.data as StripeResource;
          state = { ...state };
          state.stripe = { ...state.stripe };
          state.stripe.publishableKey = stripeData.publishable_key;

          state.stripe.plans = stripeData.plans;
          state.stripe.chosenPlanID = stripeData.plans[0].id;
          effects = effects.concat(getStripe(state.stripe.publishableKey));
          break;
        }

        case changeEmailRequestName: {
          if (action.success) {
            state = { ...state };
            state.loggedInUser = response.data;

            state.success = { ...state.success };
            state.success.signUp = "Email has changed successfully. A confirmation email has been sent to your new email. Please confirm.";

            state = resetUser(state);
          } else {
            state = { ...state };
            state.errors = { ...state.errors };
            state.errors.changeAccountSettings = response.errors;
            state.success = initialState.success;
          }
          break;
        }
        case changePasswordRequestName: {
          if (action.success) {
            state = { ...state };
            state.loggedInUser = response.data;

            state.success = { ...state.success };
            state.success.changeAccountSettings = "Passwords have been changed successfully";
            state.errors.changeAccountSettings = initialState.errors.changeAccountSettings;

            state.inputs = { ...state.inputs };
            state.inputs.oldPassword = "";
            state.inputs.newPassword = "";
            state.inputs.confirmNewPassword = "";

          } else {
            state = { ...state };
            state.errors = { ...state.errors };
            state.errors.changeAccountSettings = response.errors;
            state.success = initialState.success;
          }
          break;
        }

        case generateNewAccessTokenRequestName: {
          if (action.success) {
            state = setUser(state, action.headers, response.data);

            state = { ...state };
            state.success = { ...state.success };
            state.success.changeAccountSettings = "Generated new access token";
            state.errors = { ...state.errors };
            state.errors.changeAccountSettings = initialState.errors.changeAccountSettings;


          } else {
            state = { ...state };
            state.errors = { ...state.errors };
            state.errors.changeAccountSettings = response.errors;
            state.success = initialState.success;
          }
          break;
        }

        case forgotPasswordRequestName: {
          if (action.success) {
            state = { ...state };
            state.alerts = { ...state.alerts };
            state.alerts.signIn = "An email has been sent to reset your password.";
          }
          break;
        }

        case resetPasswordRequestName: {
          if (action.success) {
            state = { ...state };
            state.toggles = { ...state.toggles };
            state.toggles.isResettingPassword = false;
            state.errors = { ...state.errors };
            state.errors.changeAccountSettings = initialState.errors.changeAccountSettings;

            state.success = { ...state.success };
            state.success.changeAccountSettings = "Password reset successfully! Please try logging in now";

          } else {
            state = { ...state };
            state.errors = { ...state.errors };
            state.errors.changeAccountSettings = response.errors;
            state.success = initialState.success;
          }
          break;
        }

        case cancelSubscriptionRequestName: {
          if (action.success) {
            state = {...state};
            state.loggedInUser = response.data;
          }
          break;
        }
        case changeSubscriptionRequestName: {
          if (action.success) {
            state = {...state};
            state.loggedInUser = response.data;
          }
          break;
        }
      }
      break;

    case "choose-stripe-plan":
      state = { ...state };
      state.stripe = { ...state.stripe };
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
      state = validateEmail(state, "signUp", "email");
      state = validatePasswords(state, "signUp", "password", "confirmPassword");
      state = validateStripeCard(state, action.token_id, "signUp");

      if (state.errors.signUp.length === 0) {

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

      state = { ...state };
      state.errors = { ...state.errors };
      state.errors.signUp = [action.error];

      break;
    }

    case "go-sign-up": {
      effects.push(historyPush({ pathname: '/sign-up' }));
      break;
    }

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

    case "toggle":
      if (action.target === "changeEmail") {
        state = { ...state };
        state.inputs = { ...state.inputs };
        state.inputs.email = (state.loggedInUser && state.loggedInUser.email) || "";
      } else if (action.target === "showSettingsModal") {
        ({ state, effects } = getStripeData(state, effects));
      }
      break;

    case "change-email":

      state = validateEmail(state, "changeAccountSettings", "newEmail");

      if (!state.loggedInUser) break;

      if (state.errors.changeAccountSettings.length > 0) break;
      effects.push(requestAjax([changeEmailRequestName],
        {
          url: ApiV1UsersPath + '/' + state.loggedInUser.id, method: "PUT", headers: state.headers,
          json: {
            user: { email: state.inputs.newEmail }
          }
        }));
      break;

    case "change-password":
      state = validatePasswords(state, "changeAccountSettings", "newPassword", "confirmNewPassword");

      if (!state.inputs.oldPassword) {
        state.errors.changeAccountSettings.push({ type: "password", message: "Current password is required" });
      }

      if (!state.loggedInUser) break;

      if (state.errors.changeAccountSettings.length > 0) break;

      effects.push(requestAjax([changePasswordRequestName],
        {
          url: ApiV1UsersPath + '/' + state.loggedInUser.id, method: "PUT", headers: state.headers,
          json: {
            user: {
              password: state.inputs.newPassword,
              old_password: state.inputs.oldPassword
            }
          }
        }));
      break;

    case "generate-new-access-token":
      if (!state.loggedInUser) break;

      effects.push(requestAjax([generateNewAccessTokenRequestName],
        {
          url: ApiV1UsersPath + '/' + state.loggedInUser.id + "/generate_new_access_token", method: "PUT", headers: state.headers,
        }));
      break;

    case "forgot-password":

      state = validateEmail(state, "signIn", "email");

      if (state.errors.signIn.length > 0) break;

      effects.push(requestAjax([forgotPasswordRequestName],
        {
          url: ApiV1UsersPath + "/forgot_password", method: "PUT", headers: state.headers,
          json: {
            user: {
              email: state.inputs.email
            }
          }
        }));
      break;

    case "reset-password":
      state = validatePasswords(state, "changeAccountSettings", "newPassword", "confirmNewPassword");

      if (state.errors.changeAccountSettings.length > 0) break;

      effects.push(requestAjax([resetPasswordRequestName],
        {
          url: ApiV1UsersPath + "/reset_password", method: "PUT", headers: state.headers,
          json: {
            reset_password_token: state.inputs.resetPasswordToken,
            user: {
              email: state.inputs.email,
              password: state.inputs.newPassword,
            }
          }
        }));
      break;

    case "cancel-subscription":
      if (!state.loggedInUser) break;
      effects.push(requestAjax([cancelSubscriptionRequestName],
        {
          method: "PUT", url: ApiV1UsersPath + "/" + state.loggedInUser.id + "/cancel_subscription", headers: state.headers
        }));
      break;

    case "change-subscription":
      if (!state.loggedInUser) break;
      effects.push(requestAjax([changeSubscriptionRequestName],
        {
          method: "PUT", url: ApiV1UsersPath + "/" + state.loggedInUser.id + "/change_subscription", headers: state.headers,
          json: {
            user: {
              stripe_plan_id: state.stripe.chosenPlanID,
              stripe_token_id: action.token_id
            }
          }
        }));
      break;

  }

  return { state, effects };
};

function validateEmail<Error extends Extract<keyof typeof initialState.errors, string>,
  Inputs extends Extract<keyof typeof initialState.inputs, string>>
  (state: State, errorType: Error, emailType: Inputs): State {
  state = { ...state };
  state.errors = { ...state.errors };
  state.errors[errorType] = [];

  if (!state.inputs[emailType]) {
    state.errors[errorType].push({ type: "email", message: "Email is required" });
  } else if (!EMAIL_REGEXP.test(state.inputs[emailType])) {
    state.errors[errorType].push({ type: "email", message: "Email is invalid" });
  }

  return state;
}

function validatePasswords<Error extends Extract<keyof typeof initialState.errors, string>,
  Inputs extends Extract<keyof typeof initialState.inputs, string>>
  (state: State, errorType: Error, password: Inputs, confirmPassword: Inputs): State {
  state = { ...state };
  state.errors = { ...state.errors };
  state.errors[errorType] = [];

  if (!state.inputs[password]) {
    state.errors[errorType].push({ type: "password", message: "Password is required" });
  } else if (state.inputs[password].length < state.minimumPasswordLength) {
    state.errors[errorType].push({
      type: "password",
      message: "Password minimum length is " + state.minimumPasswordLength
    });
  }

  if (state.inputs[password] !== state.inputs[confirmPassword]) {
    state.errors[errorType].push({ type: "confirm_password", message: "Password mismatch" });
  }

  return state;
}

function validateStripeCard<Error extends Extract<keyof typeof initialState.errors, string>>
  (state: State, tokenId: string, errorType: keyof typeof state.errors): State {
  state = { ...state };
  state.errors = { ...state.errors };
  state.errors[errorType] = [];

  if (!tokenId) {
    state.errors[errorType].push({ type: "stripe_card", message: "Must insert valid card" });
  }

  return state;
}


export const confirmEmailRequestName = "confirm-email";
export const userSignInRequestName = "user-sign-in";
export const userSignUpRequestName = "user-sign-up";
export const resendConfirmationEmailRequestName = "resend-confirmation-email";
export const generateNewAccessTokenRequestName = "user-generate-new-access-token";
export const changeEmailRequestName = "change-email";
export const changePasswordRequestName = "change-password";
export const forgotPasswordRequestName = "forgot-password";
export const resetPasswordRequestName = "reset-password";
export const cancelSubscriptionRequestName = "cancel-subscription";
export const changeSubscriptionRequestName = "change-subscription";