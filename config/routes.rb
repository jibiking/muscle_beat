Rails.application.routes.draw do
  root :to => 'starts#index'
  resources :starts, only: %i[index]
  resources :users
  resources :beats
  resources :scores, only: %i[index create destroy]

  get 'login' => 'user_sessions#new', :as => :login
  post 'login' => 'user_sessions#create'
  post 'logout' => 'user_sessions#destroy', :as => :logout
end
