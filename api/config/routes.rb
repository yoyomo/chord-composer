Rails.application.routes.draw do

  get 'stripe/data'

  namespace :api do
    namespace :v1 do

      resources :users do
        collection do
          put "confirm_email"
          put "sign_in"
          put "resend_confirmation_email"
          put "forgot_password"
          put "reset_password"
        end
        member do
          put "generate_new_access_token"
        end
      end

      resources :songs

    end
  end
end
