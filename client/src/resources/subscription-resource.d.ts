import {StripeResource} from "./stripe-resource";

export interface SubscriptionResource extends StripeResource{
  customer: string
}