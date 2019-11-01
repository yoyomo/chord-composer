import * as React from "react";
import { UserResource } from "../resources/user-resource";

interface StripeSubscriptionProps {
  user: UserResource | void
}

export function StripeSubscription(props: StripeSubscriptionProps) {

  return (<div>
    {props.user ?
      <div>
        {props.user.stripe_subscription.plan.interval} - {props.user.stripe_subscription.status}
      </div> : "none"
    }
  </div>
  )

}
