
Rails.application.routes.draw do
  get "home/index"
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  root "home#index"
  get 'hola', to: 'home#hola', as: :hola
end

