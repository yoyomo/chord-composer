class UserMailer < ApplicationMailer
  default from: 'notifications@example.com'

  before_action :set_user
  before_action :set_url

  def confirm_email
    mail(to: @user.email, subject: 'Welcome to Kordpose!')
  end

  def confirm_change_of_email
    mail(to: @user.email, subject: 'Please Confirm: Your Kordpose email has been changed')
  end

  def set_user
    @user = params[:user]
  end

  def set_url
    @url  = "http://localhost:3002?confirmation_token=#{@user.confirmation_token}&email=#{@user.email}"
  end

end
