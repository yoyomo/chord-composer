Rails.application.routes.draw do

  get 'stripe/data'

  namespace :api do
    namespace :v1 do

      resources :users
      resources :songs

    end
  end
end
