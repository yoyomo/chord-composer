import * as React from "react";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {
  chooseStripePlan,
} from "../../../reducers/login-reducer";


export function StripePlans(dispatch: (action: Action) => void) {
  const dispatcher = {
    choosePlan: (stripePlanId: string) => dispatch(chooseStripePlan(stripePlanId)),
  };

  return (state: State) => {
    return (
      <div>
        {state.stripe.plans.length > 0 &&
        state.stripe.plans.map(stripePlan => {

          let symbol = "";
          let amount = stripePlan.amount;
          switch (stripePlan.currency) {
            case "usd":
              symbol = "$";
              amount = amount / 100;
              break;
          }

          return <div key={"stripe-plan-" + stripePlan.id}
                      onClick={() => dispatcher.choosePlan(stripePlan.id)}
                      className={"db ba b--light-gray ma2 pa2 br2 tc hover-bg-light-gray pointer " + (state.stripe.chosenPlanID === stripePlan.id ? "bg-light-gray" : "")}>

            <div>
              {symbol}{amount}
              <div className={"di gray ma1"}>
                {stripePlan.currency}
              </div>
              / {stripePlan.interval}
            </div>

            <div className={"ma2"}/>
            <div className={"f7"}>
              Includes:
              <div>
                ・Access to all chords
              </div>
              <div>
                ・Access to all variations of chords
              </div>
              <div>
                ・Saving draft chords
              </div>

              <div className={"ma2"}/>
              <div>
                Soon:
                <div>
                  ・Create and Save songs
                </div>
                <div>
                  ・Saving synthesizer parameters
                </div>
              </div>
            </div>

          </div>
        })
        }
      </div>
    );
  }
}