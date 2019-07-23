import {initialState, State} from "../state";
import {ReductionWithEffect} from "../core/reducers";
import {parseHTTPHeaders, requestAjax} from "../core/services/ajax-service";
import {ApiV1UsersPath, AuthSignIn, AuthSignUp, AuthValidateToken} from "../resources/routes";
import {historyPush} from "../core/services/navigation-service";
import {ResourceType} from "../resources/resource";
import {UserResource} from "../resources/user-resource";
import {SubscriptionResource} from "../resources/subscription-resource";
import {Action} from "../core/root-reducer";
import {Effect} from "../core/services/service";

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
            headers: parseHTTPHeaders(action.headers)
          }));
        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signIn = response.errors
        }
      } else if (action.name[0] === validateTokenRequestName) {
        if (action.success) {
          state = {...state};
          state.loggedInUser = response.data as UserResource;
          state.headers = parseHTTPHeaders(action.headers);
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
          effects = effects.concat(historyPush({pathname: '/sign_up'}));

        } else {
          state = {...state};
          state.loginPage = {...state.loginPage};
          state.loginPage.errors = {...state.loginPage.errors};
          state.loginPage.errors.signUp = (response.errors as any).full_messages;
          state.loginPage.success = initialState.loginPage.success;
        }
      } else if (action.name[0] === stripeCreateCustomerRequesName) {
        if(action.success){
          let subscription = response.data as SubscriptionResource;
          effects.push(requestAjax([userSignUpRequesName],
            {
              url: AuthSignUp, method: "POST", headers: state.headers,
              json: {
                email: state.inputs.email,
                password: state.inputs.password,
                customer_id: subscription.customer
              }
            }));
        }

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

      if (state.inputs.password !== state.inputs.confirmPassword) {
        state = {...state};
        state.loginPage = {...state.loginPage};
        state.loginPage.errors = {...state.loginPage.errors};
        state.loginPage.errors.signUp = ["Password mismatch"];
      } else {

        effects.push(requestAjax([stripeCreateCustomerRequesName],
          {
            url: ApiV1UsersPath + '/stripe_create', method: "POST", headers: state.headers,
            json: {
              token_id: action.token_id,
              plan_id: state.stripe.chosenPlanID
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
export const stripeCreateCustomerRequesName = "stripe-create-customer";