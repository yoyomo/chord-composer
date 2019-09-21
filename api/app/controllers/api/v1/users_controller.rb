class Api::V1::UsersController < APIController
  before_action :set_user, only: [:show, :update, :destroy]

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
      @user.send_confirmation_instructions
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

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:stripe_customer_id, :stripe_subscription_id, :stripe_plan_id, :stripe_token_id,
                                 :username, :email, :password, favorite_chords: [])
  end
end