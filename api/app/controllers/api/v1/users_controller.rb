class Api::V1::UsersController < APIController

  before_action :set_user, only: [:show, :update, :destroy]

  skip_before_action :authenticate_user!, only: [:create, :confirm_email, :sign_in, :resend_confirmation_email]

  def index
    @users = User.all

    render json: {data: @users}
  end

  def show
    render json: {data: @user}
  end

  def create
    @user = User.new(user_params)
    if User.find_by(email: @user.email)
      render json: {errors: [{type: "sign_up", message: "Email already exists"}]}, status: :unprocessable_entity
    elsif @user.save
      @user.send_confirmation_email
      render json: {data: @user}, status: :created
    else
      render json: {errors: [{type: "sign_up", message: @user.errors.messages.to_s}]}, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: {data: @user}
    else
      render json: {errors: [{type: "update", message: @user.errors.messages.to_s}]}, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end

  def resend_confirmation_email
    email = user_params[:email]
    password = user_params[:password]

    user = User.find_by(email: email)

    if user && user.authenticate(password)
      user.send_confirmation_email
      render json: {data: user}
    else
      render json: {errors: [{type: "confirmation",
                              message: "Could not find user"}]},
             status: :unprocessable_entity
    end
  end

  def confirm_email
    token = user_params[:confirmation_token]
    email = user_params[:email]
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

      user.update!(confirmed_at: Time.now, stripe_customer_id: customer.id, stripe_subscription_id: subscription.id)

      render json: {data: user}
    else
      render json: {errors: [{type: "confirmation",
                              message: "Confirmation token is invalid or has expired"}]},
             status: :unprocessable_entity
    end
  end

  def sign_in
    email = user_params[:email]
    password = user_params[:password]

    user = User.find_by(email: email)

    if user && user.authenticate(password)

      if user.confirmed_at.nil?
        return render json: {errors: [{type: "confirmation",
                                message: "A confirmation email has already been sent to " + user.email +
                                    ". Please go to your email account and confirm."}]},
               status: :unprocessable_entity
      end


      token = user.access_token
      if token.nil?
        token = SecureRandom.hex
        user.update!(access_token: token)
      end

      response.set_header('kordpose-session', token)
      response.set_header('id', user.id)

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
                                 :username, :email, :password, :confirmation_token, favorite_chords: [])
  end
end