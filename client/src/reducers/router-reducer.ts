import {historyPush, navigationReducer, PathLocation} from "../core/services/navigation-service";
import {State} from "../state";
import {ReductionWithEffect, SideEffect} from "../core/reducers";
import {Effect} from "../core/services/service";
import {AuthHeaders, confirmEmailRequestName} from "./login-reducer";
import {getCookie} from "../utils/cookies";
import {requestAjax} from "../core/services/ajax-service";
import {ApiV1UsersPath, AuthConfirmEmail, StripePath} from "../resources/routes";
import {getLoggedInUserRequestName} from "./footer-reducer";

export type PathPart = '' | 'home' | 'sign-up' | 'chords' | 'song'

export const getStripeData = (state: State, effects: Effect[]): ReductionWithEffect<State> => {
  if (!state.stripe.publishableKey || state.stripe.plans.length === 0) {
    effects = effects.concat(requestAjax([getStripePublishableKeyRequestName], {
      headers: state.headers,
      url: StripePath + '/data',
      method: 'GET'
    }));
  }

  if (state.loggedInUser ) {
    state = {...state};
    state.stripe = {...state.stripe};
    state.stripe.chosenPlanID = state.loggedInUser && state.loggedInUser.stripe_subscription.plan.id || state.stripe.chosenPlanID;
  }
  return {state, effects};
}

export function routerReducer(state: State,
                              location: PathLocation): ReductionWithEffect<State> {
  let effects: Effect[] | void = [];
  state = {...state};

  let nextPathParts: PathPart[] = location.pathname.split("/").slice(1) as PathPart[];
  if (!nextPathParts[0]) nextPathParts[0] = "home";

  switch (nextPathParts[0]) {

    case "sign-up":
      if (state.loggedInUser) {
        nextPathParts = ["home"];
        effects = effects.concat(historyPush({pathname: "home"}));
      }

      ({ state, effects } = getStripeData(state, effects));

      break;

    case "home":
      if (!nextPathParts[1]) nextPathParts[1] = "chords";

      if (state.loggedInUser) break;

      state.headers = {...state.headers};

      AuthHeaders.map(header => {
        let value = getCookie(header);
        if (!value) return null;
        state.headers[header] = value;
        return value;
      });

      let userId = state.headers["id"];
      if (userId && Object.keys(state.headers).length === AuthHeaders.length) {
        effects.push(requestAjax([getLoggedInUserRequestName], {
          url: `${ApiV1UsersPath}/${userId}`, method: "GET", headers: state.headers
        }));
        break;
      }

      let parameters = location.search.split('&');

      parameters = parameters.filter(p => p);
      if (parameters.length === 0) break;

      parameters[0] = parameters[0].split('?')[1];
      let confirmationToken = "";
      let email = "";
      let resetPasswordToken = "";
      parameters.map(param => {
        let [key, value] = param.split('=');

        if (key === "confirmation_token" && value) {
          confirmationToken = value
        } else if (key === "email" && value) {
          email = value;
        } else if (key === "reset_password_token" && value){
          resetPasswordToken = value;
        }
        return param;
      });

      if(email) {
        if (confirmationToken) {
          effects = effects.concat(requestAjax([confirmEmailRequestName], {
            url: AuthConfirmEmail,
            method: "PUT",
            headers: state.headers,
            json: {
              user: {
                confirmation_token: confirmationToken,
                email: email
              }
            }
          }));
        } else if(resetPasswordToken) {

          state = {...state};
          state.toggles = {...state.toggles};
          state.toggles.isResettingPassword = true;
          state.inputs = {...state.inputs};
          state.inputs.email = email;
          state.inputs.resetPasswordToken = resetPasswordToken;

          state.toggles.showLogInModal = true;

        }
      }


      break;

  }


  state.pathParts = nextPathParts;

  return {state, effects};
}

export const getStripePublishableKeyRequestName = "get-stripe-publishable-key";

export const reduceNavigation = navigationReducer(routerReducer);
