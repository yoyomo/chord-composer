class APIController < ApplicationController
  before_action :authenticate_user!
  before_action :verify_stripe!

  protected

  def authenticate_user!
    @current_user = User.find_by(access_token: request.headers['kordpose-session'])

    render json: { errors: [{type: "authorize", message: 'Not Authorized'}]}, status: 401 unless @current_user && @current_user.confirmed_at

    true
  end

  def verify_stripe!
    subscription = Stripe::Subscription.retrieve(@current_user.stripe_subscription_id)
    render json: { errors: [{ type: "subscription", message: "Must have a valid subscription for this action" }] }, status: 403 unless subscription && subscription.ended_at.nil?

    true
  end

end