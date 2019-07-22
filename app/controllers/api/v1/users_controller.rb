class Api::V1::UsersController < APIController
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    @users = User.all

    render json: @users
  end

  def show
    render json: @user
  end

  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_confirmation_instructions
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end

  def stripe_create
    if params[:email].nil? || params[:token_id].nil? || params[:plan_id].nil?
      Rails.logger "Stripe Error: Email, Token ID, and Plan ID are required"
      return render json: @user.errors, status: :unprocessable_entity if params[:email]
    end

    customer = Stripe::Customer.create({
                                         email: params[:email],
                                         source: params[:token_id]
                                       })

    subscription = Stripe::Subscription.create({
                                                 customer: customer.id,
                                                 items: [{plan: params[:plan_id]}]
                                               })

    render json: subscription
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:username, :email, favorite_chords: [])
  end
end