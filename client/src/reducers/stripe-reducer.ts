import { State } from "../state";
import { Action } from "../core/root-reducer";
import { ReductionWithEffect } from "../core/reducers";
import { Effect } from "../core/services/service";

export type SetStripeObjectAction = {
  type: "set-stripe-object"
  stripeObject: stripe.Stripe
}

export const setStripeObject = (stripeObject: stripe.Stripe): SetStripeObjectAction => {
  return {
    type: "set-stripe-object",
    stripeObject
  };
};

export type StripeActions =
  SetStripeObjectAction;

export const reduceStripe = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];
  switch (action.type) {

    case "set-stripe-object": {
      state = { ...state };
      state.stripe = { ...state.stripe };
      state.stripe.object = { ...action.stripeObject };

      break;
    }
  }

  return { state, effects };
};