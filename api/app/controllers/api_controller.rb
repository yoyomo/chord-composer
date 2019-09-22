class APIController < ApplicationController
  include ActionController::RequestForgeryProtection

  protect_from_forgery with: :null_session, unless: -> {request.format.json?}
  before_action :authenticate_user!

  protected

  def authenticate_user!

    @current_user = User.find_by(access_token: headers['kordpose_session'])

    render json: { error: 'Not Authorized' }, status: 401 unless @current_user && @current_user.confirmed_at

    true
  end

end