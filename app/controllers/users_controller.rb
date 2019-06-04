class UsersController < ApplicationController

  def index
    render json: User.all
  end

  def show
    render json: User.find_by(id: params[:id])
  end

  def update
    user = User.find_by(id: params[:id])
    user.update!(params)
    render json: user
  end
end