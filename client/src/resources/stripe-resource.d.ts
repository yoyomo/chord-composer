export interface StripePlanResource {
  id: string
  amount: number
  currency: string
  interval: string
  interval_count: number
  nickname: string
  product: string
}

export interface StripeResource {
  publishable_key: string,
  plans: StripePlanResource[]
}

export interface StripeSubscriptionResource {
  status: string,
  current_period_end: number,
  plan: StripePlanResource
}