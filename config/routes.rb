Rails.application.routes.draw do
  get "stripe/data"

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
          put "cancel_subscription"
          put "change_subscription"
        end
      end

      resources :synths

      resources :songs
    end
  end

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
