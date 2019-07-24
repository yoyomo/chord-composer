class StripeController < ApplicationController

  def subscribe
    if params[:email].nil? || params[:token_id].nil? || params[:plan_id].nil?
      Rails.logger.error "Stripe Error: Email, Token ID, and Plan ID are required"
      return head :unprocessable_entity
    end

    customer = Stripe::Customer.create({
                                         email: params[:email],
                                         source: params[:token_id]
                                       })

    subscription = Stripe::Subscription.create({
                                                 customer: customer.id,
                                                 items: [{plan: params[:plan_id]}]
                                               })

    render json: {data: subscription}
  end

end