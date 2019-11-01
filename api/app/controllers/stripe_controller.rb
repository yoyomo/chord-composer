class StripeController < ApplicationController
  def data
    plan_ids = ENV["STRIPE_PLAN_IDS"].split(",")

    render json: { data: { publishable_key: ENV["STRIPE_PUBLISHABLE_KEY"], plans: Stripe::Plan.all["data"].select { |plan| plan_ids.include? plan.id } } }
  end
end
