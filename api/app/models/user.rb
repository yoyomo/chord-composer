class User < ApplicationRecord
  has_secure_password

  PASSWORD_REQUIREMENTS = /\A(?=.{6,})/x
  EMAIL_REQUIREMENTS = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :password, allow_nil: true, format: PASSWORD_REQUIREMENTS
  validates :email, uniqueness: true, format: EMAIL_REQUIREMENTS

  attribute :stripe_subscription

  before_destroy :cancel_stripe_subscription, prepend: true

  def send_confirmation_email
    update_user_confirmation
    UserMailer.with(user: self).confirm_email.deliver_later
  end

  def send_confirmation_change_of_email
    UserMailer.with(user: self).notify_change_of_email.deliver_later
    update_user_confirmation
    UserMailer.with(user: self).confirm_change_of_email.deliver_later
  end

  def update_user_confirmation
    self.update!(confirmation_token: SecureRandom.hex, confirmation_expires_at: 30.minutes.from_now, confirmed_at: nil)
  end

  def send_reset_password_link
    update_user_reset_password
    UserMailer.with(user: self).reset_password.deliver_later
  end

  def update_user_reset_password
    self.update!(reset_password_token: SecureRandom.hex, reset_password_expires_at: 30.minutes.from_now)
  end

  def confirm
    user = resource
    if user.email.nil? || user.stripe_token_id.nil? || user.stripe_plan_id.nil?
      Rails.logger.error "Stripe Error: Email, Token ID, and Plan ID are required"
      return
    end

    user.create_stripe_subscription
  end

  def create_stripe_subscription
    customer = Stripe::Customer.retrieve(self.stripe_customer_id)
    if !customer
      customer = Stripe::Customer.create({
        email: self.email,
        source: self.stripe_token_id,
      })
    end

    subscription = Stripe::Subscription.list(customer: customer.id).select { |sub| sub.status === "active" }.first
    if !subscription
      subscription = Stripe::Subscription.create({
        customer: customer.id,
        items: [{ plan: self.stripe_plan_id }],
      })
    end

    self.update!(stripe_customer_id: customer.id, stripe_subscription_id: subscription.id)
  end

  def stripe_subscription
    init_stripe if !Stripe.api_key
    Stripe::Subscription.retrieve(self.stripe_subscription_id)
  end

  def cancel_stripe_subscription
    init_stripe if !Stripe.api_key
    Stripe::Subscription.delete(self.stripe_subscription_id)
  end
end
