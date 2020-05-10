def init_stripe
  Stripe.api_key ||= ENV["STRIPE_SECRET_KEY"]
end

init_stripe
