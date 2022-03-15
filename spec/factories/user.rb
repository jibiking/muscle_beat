FactoryBot.define do
  factory :user do
    sequence(:user_name) { |n| "u_#{n}" }
    password { 'password' }
    password_confirmation { 'password' }
  end
end