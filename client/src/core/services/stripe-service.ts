import {Effect, Services} from "./services";
import {Action} from "../root-reducer";
import {setStripeObject} from "../../reducers/stripe-reducer";

export interface GetStripeEffect {
  effectType: "get-stripe"
  apiKey: string
}

export function getStripe(apiKey: string): GetStripeEffect {
  return {
    effectType: "get-stripe",
    apiKey,
  }
}

export function withStripe(dispatch: (action: Action) => void): Services {
  let getStripeTimeout: number;
  return (effect: Effect) => {

    switch (effect.effectType) {
      case "get-stripe":
        if ((window as any).Stripe) {

          dispatch(setStripeObject((window as any).Stripe(effect.apiKey)));

        } else {

          const getStripeScript = () => {
            let stripeScript = document.querySelector('#stripe-js');

            if (stripeScript){
              stripeScript.addEventListener('load', () => {
                dispatch(setStripeObject((window as any).Stripe(effect.apiKey)));
              });
            } else {
              clearTimeout(getStripeTimeout);
              getStripeTimeout = window.setTimeout(getStripeScript,300);
            }
          };

          getStripeScript();
        }
        break;
    }

  }
}
