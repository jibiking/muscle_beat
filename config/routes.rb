Rails.application.routes.draw do
  root :to => 'start#index'
  resources :starts, only: %i[index]
  resources :users

  get 'login' => 'user_sessions#new', :as => :login
  post 'login' => 'user_sessions#create'
  post 'logout' => 'user_sessions#destroy', :as => :logout
end
