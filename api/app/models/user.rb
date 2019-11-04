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

  def create_stripe_customer
    customer = Stripe::Customer.create({
                                           email: self.email,
                                           source: self.stripe_token_id,
                                       })

    self.update!(stripe_customer_id: customer.id)
    customer
  end

  def create_stripe_subscription
    subscription = Stripe::Subscription.create({
                                                   customer: self.stripe_customer_id,
                                                   items: [{plan: self.stripe_plan_id}],
                                               })

    self.update!(stripe_subscription_id: subscription.id)
  end

  def update_stripe_subscription
    subscription = Stripe::Subscription.update(self.stripe_subscription_id,
                                               {
                                                   cancel_at_period_end: false,
                                                   items: [{plan: self.stripe_plan_id}],
                                               })

    self.update!(stripe_subscription_id: subscription.id)
  end

  def update_stripe_customer
    customer = Stripe::Customer.update(self.stripe_customer_id,
                                       {
                                           source: self.stripe_token_id,
                                       })

    self.update!(stripe_customer_id: customer.id)
    customer
  end

  def create_or_update_customer_subscription
    customer = Stripe::Customer.retrieve(self.stripe_customer_id)
    subscription = Stripe::Subscription.retrieve(self.stripe_subscription_id)

    if customer
      self.update_stripe_customer
    else
      self.create_stripe_customer
    end


    if subscription && subscription.ended_at.nil?
      self.update_stripe_subscription
    else
      self.create_stripe_subscription
    end

  end

  def stripe_subscription
    init_stripe unless Stripe.api_key
    Stripe::Subscription.retrieve(self.stripe_subscription_id)
  end

  def cancel_stripe_subscription
    init_stripe unless Stripe.api_key
    Stripe::Subscription.delete(self.stripe_subscription_id)
  end
end
