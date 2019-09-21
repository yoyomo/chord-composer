Rails.application.routes.draw do

  get 'stripe/data'

  namespace :api do
    namespace :v1 do

      resources :users do
        collection do
          put "confirm_email"
          put "sign_in"
        end
      end

      resources :songs

    end
  end
end
