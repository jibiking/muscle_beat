Rails.application.routes.draw do
  root :to => 'start#index'
  resources :start, only: %i[index]
end
