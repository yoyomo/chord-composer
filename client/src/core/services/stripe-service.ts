import {Service} from "./service";
import {Action} from "../root-reducer";
import {setStripeObject} from "../../reducers/stripe-reducer";

export function withStripe(dispatch: (action: Action) => void, apiKey = "pk_test_djBzxE7qYBOJYdTPP2OT7aXa00gGQMNEZb"): Service {

  let stripeScript = document.querySelector('#stripe-js');

  if (stripeScript){
    stripeScript.addEventListener('load', () => {
      dispatch(setStripeObject((window as any).Stripe(apiKey)));
    });
  }

  return () => null
}
