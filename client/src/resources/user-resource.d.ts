import { StripeSubscriptionResource } from "./stripe-resource";

export interface UserResource {
  id: number
  username: string
  email: string
  favorite_chords: string[]
  access_token: string

  confirmed_at: number,
  stripe_customer_id: string,
  stripe_subscription_id: string,
  stripe_plan_id: string,
  stripe_token_id: string,

  stripe_subscription: StripeSubscriptionResource,

  created_at: string
}