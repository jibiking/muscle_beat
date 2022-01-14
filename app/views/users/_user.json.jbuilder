json.extract! user, :id, :user_name, :role, :crypted_password, :salt, :created_at, :updated_at
json.url user_url(user, format: :json)
