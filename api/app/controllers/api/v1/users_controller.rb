class Api::V1::UsersController < APIController
  before_action :set_user, only: [:show, :update, :destroy]

  skip_before_action :authenticate_user!, only: [:confirm_email, :sign_in]

  def index
    @users = User.all

    render json: {data: @users}
  end

  def show
    render json: {data: @user}
  end

  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_confirmation_email
      render json: {data: @user}, status: :created, location: @user
    else
      render json: {errors: @user.errors}, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: {data: @user}
    else
      render json: {errors: @user.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end

  def resend_confirmation_email
    @user.send_confirmation_email
  end

  def confirm_email
    token = params[:confirmation_token]
    email = params[:email]
    user = User.find_by(email: email, confirmation_token: token)

    if user && user.confirmation_expires_at > Time.now && !user.stripe_token_id.nil? && !user.stripe_plan_id.nil?

      customer = Stripe::Customer.create({
                                             email: user.email,
                                             source: user.stripe_token_id
                                         })

      subscription = Stripe::Subscription.create({
                                                     customer: customer.id,
                                                     items: [{plan: user.stripe_plan_id}]
                                                 })

      user.update!(stripe_customer_id: customer.id, stripe_subscription_id: subscription.id)

      render json: {data: user}
    else
      render json: {errors: [{type: "confirmation",
                              message: "Confirmation token is invalid or has expired"}]},
             status: :unprocessable_entity
    end
  end

  def sign_in
    email = params[:email]
    password = params[:token]

    user = User.find_by(email: email)

    if user.authenticate(password)

      render json: {errors: [{type: "confirmation",
                              message: "A confirmation email has already been sent to "+user.email+
                                  ". Please go to your email account and confirm."}]},
             status: :unprocessable_entity if user.confirmed_at.nil?


      token = user.access_token
      if token.nil?
        token = SecureRandom.hex
        user.update!(token: token)
      end

      response.set_header('kordpose_session', token)

      render json: {data: user}
    else
      render json: {errors: [{type: "sign_in",
                              message: "Invalid email or password"}]},
             status: :unprocessable_entity
    end
  end

  def generate_new_access_token
    @user.update!(access_token: SecureRandom.hex)
    render json: {data: @user}
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:stripe_customer_id, :stripe_subscription_id, :stripe_plan_id, :stripe_token_id,
                                 :username, :email, :password, favorite_chords: [])
  end
end