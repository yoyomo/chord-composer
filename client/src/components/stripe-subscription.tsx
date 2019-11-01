import * as React from "react";
import { UserResource } from "../resources/user-resource";

interface StripeSubscriptionProps {
  user: UserResource | void
}

export function StripeSubscription(props: StripeSubscriptionProps): JSX.Element {

  if (!props.user) return <div>none</div>;

  let d = new Date();
  d.setTime(props.user.stripe_subscription.current_period_end * 1000);

  return (<div>
    <div>
      {props.user.stripe_subscription.plan.interval} - {props.user.stripe_subscription.status} {d.toLocaleDateString()}
    </div>
  </div>
  )

}
