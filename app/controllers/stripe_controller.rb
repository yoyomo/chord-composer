class StripeController < ApplicationController

  def get_plans

    render json: Stripe::Plan.retrieve("plan_FPRSWCfeC2eHz1")

  end

end