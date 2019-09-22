class APIController < ApplicationController
  before_action :authenticate_user!

  protected

  def authenticate_user!
    @current_user = User.find_by(access_token: request.headers['kordpose-session'])

    render json: { error: 'Not Authorized' }, status: 401 unless @current_user && @current_user.confirmed_at

    true
  end

end