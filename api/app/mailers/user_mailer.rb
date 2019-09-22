class UserMailer < ApplicationMailer
  default from: 'notifications@example.com'

  def confirm_email
    @user = params[:user]
    @url  = "http://localhost:3002?confirmation_token=#{@user.confirmation_token}&email=#{@user.email}"
    mail(to: @user.email, subject: 'Welcome to Kordpose!')
  end

end
