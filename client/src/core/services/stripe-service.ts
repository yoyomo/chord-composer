import {Service} from "./service";
import {Action} from "../root-reducer";
import {setStripeObject} from "../../reducers/stripe-reducer";

export function withStripe(dispatch: (action: Action) => void, apiKey = "pk_test_djBzxE7qYBOJYdTPP2OT7aXa00gGQMNEZb"): Service {

  if ((window as any).Stripe) {
    dispatch(setStripeObject((window as any).Stripe(apiKey)));
  } else {
    let stripeScript = document.querySelector('#stripe-js');

    if(!stripeScript) return () => {};

    stripeScript.addEventListener('load', () => {
      dispatch(setStripeObject((window as any).Stripe(apiKey)));
    });
  }
  return () => {}
}
