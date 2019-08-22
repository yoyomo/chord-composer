Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    confirmations: 'custom/confirmations'
  }

  get 'stripe/get_plans'

  namespace :api do
    namespace :v1 do

      resources :users
      resources :songs

    end
  end
end
