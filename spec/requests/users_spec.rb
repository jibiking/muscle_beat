require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "GET /users" do
    it "200ステータスが返ってくる" do
      get new_user_path
      expect(response).to have_http_status(200)
    end

    it "200ステータスが返ってくる" do
      get login_path
      expect(response).to have_http_status(200)
    end
  end
end
