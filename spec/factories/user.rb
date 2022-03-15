FactoryBot.define do
  factory :user do
    sequence(:user_name) { |n| "u_#{n}" }
    password { 'password' }
    password_confirmation { 'password' }

    trait :admin do
      role {:admin}
    end
  end
end