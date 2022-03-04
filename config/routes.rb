Rails.application.routes.draw do
  root :to => 'starts#index'
  resources :starts, only: %i[index]
  resources :users
  resources :beats do
    member do
      resources :ranking, only: %i[index]
    end
  end
  resources :scores, only: %i[index create destroy]
  resources :mypage, only: %i[index]

  get 'explain', to: 'starts#explain'
  get 'terms', to: 'starts#terms'
  get 'privacy', to: 'starts#privacy'

  get 'login', to: 'user_sessions#new', :as => :login
  post 'login', to: 'user_sessions#create'
  post 'logout', to: 'user_sessions#destroy', :as => :logout
end
