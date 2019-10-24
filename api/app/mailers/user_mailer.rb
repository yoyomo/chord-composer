class UserMailer < ApplicationMailer
  default from: 'notifications@example.com'

  before_action :set_user
  before_action :set_url

  def confirm_email
    append_url_confirmation
    mail(to: @user.email, subject: 'Welcome to Kordpose!')
  end

  def confirm_change_of_email
    append_url_confirmation
    mail(to: @user.email, subject: 'Please Confirm: Your Kordpose email has been changed')
  end

  def notify_change_of_email
    mail(to: @user.email, subject: 'Your Kordpose email has been changed')
  end

  def reset_password
    append_url_reset_password
    mail(to: @user.email, subject: 'Kordpose: Reset your password')
  end

  def set_user
    @user = params[:user]
  end

  def set_url
    @url  = "http://localhost:3002?email=#{@user.email}"
  end

  def append_url_confirmation
    @url += "&confirmation_token=#{@user.confirmation_token}"
  end

  def append_url_reset_password
    @url += "&reset_password_token=#{@user.reset_password_token}"
  end

end
