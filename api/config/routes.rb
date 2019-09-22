Rails.application.routes.draw do

  get 'stripe/data'

  namespace :api do
    namespace :v1 do

      resources :users do
        collection do
          put "confirm_email"
          put "sign_in"
          put "generate_new_access_token"
          put "resend_confirmation_email"
        end
      end

      resources :songs

    end
  end
end
