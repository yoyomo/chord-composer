class User < ApplicationRecord
  has_secure_password

  def send_confirmation_email
    self.update!(confirmation_token: SecureRandom.hex, confirmation_expires_at: 30.minutes.from_now)
    UserMailer.with(user: self).confirm_email.deliver_now
  end

  def confirm

    user = resource
    if user.email.nil? || user.stripe_token_id.nil? || user.stripe_plan_id.nil?
      Rails.logger.error "Stripe Error: Email, Token ID, and Plan ID are required"
      return
    end

    customer = Stripe::Customer.create({
                                           email: user.email,
                                           source: user.stripe_token_id
                                       })

    subscription = Stripe::Subscription.create({
                                                   customer: customer.id,
                                                   items: [{plan: user.stripe_plan_id}]
                                               })

    user.update!(stripe_customer_id: customer.id, stripe_subscription_id: subscription.id)

  end

end
