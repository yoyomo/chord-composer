class Api::V1::UsersController < APIController

  before_action :set_user, only: [:show, :update, :destroy, :generate_new_access_token]

  skip_before_action :authenticate_user!, only: [:create, :confirm_email, :sign_in, :resend_confirmation_email, :forgot_password]

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
    prev_email = @user.email

    old_password = params[:user][:old_password]

    if old_password && !@user.authenticate(old_password)
      return render json: {errors: [{type: "update", message: "Incorrect password"}]}, status: :unprocessable_entity
    end

    if @user.update(user_params)

      if @user.email != prev_email
        @user.send_confirmation_change_of_email
      end

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

    if user && user.confirmed_at.nil? && user.confirmation_expires_at > Time.now

      user.update!(confirmed_at: Time.now)

      if !user.stripe_token_id.nil? && !user.stripe_plan_id.nil? && user.stripe_customer_id.nil? && user.stripe_subscription_id.nil?

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

      set_cookie_headers(user)

      render json: {data: user}
    else
      render json: {errors: [{type: "sign_in",
                              message: "Invalid email or password"}]},
             status: :unprocessable_entity
    end
  end

  def generate_new_access_token
    @user.update!(access_token: SecureRandom.hex)

    set_cookie_headers

    render json: {data: @user}
  end

  def forgot_password
    email = user_params[:email]

    user = User.find_by(email: email)

    if user
      user.send_reset_password_link
      render json: {data: user}
    else
      render json: {errors: [{type: "forgot_password",
                              message: "Could not find user"}]},
             status: :unprocessable_entity
    end
  end

  def reset_password
    token = user_params[:reset_password_token]
    email = user_params[:email]
    password = user_params[:password]

    user = User.find_by(email: email, reset_password_token: token)

    if user && user.reset_password_expires_at > Time.now

      if user.update(password: password, reset_password_expires_at: Time.now)
        render json: {data: user}
      else
        render json: {errors: [{type: "forgot_password", message: @user.errors.messages.to_s}]}, status: :unprocessable_entity
      end
    else
      render json: {errors: [{type: "forgot_password",
                              message: "Reset Password Token is invalid or has expired"}]},
             status: :unprocessable_entity
    end
  end

  private

  def set_cookie_headers(user = @user)
    response.set_header('kordpose-session', user.access_token)
    response.set_header('id', user.id)
  end

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:stripe_customer_id, :stripe_subscription_id, :stripe_plan_id, :stripe_token_id,
                                 :username, :email, :password, :confirmation_token, favorite_chords: [])
  end
end