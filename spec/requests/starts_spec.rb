require 'rails_helper'

RSpec.describe "Starts", type: :request do
  describe "GET /starts" do
    it "200ステータスが返ってくる" do
      get root_path
      expect(response).to have_http_status(200)
    end

    it "200ステータスが返ってくる" do
      get explain_path
      expect(response).to have_http_status(200)
    end

    it "200ステータスが返ってくる" do
      get terms_path
      expect(response).to have_http_status(200)
    end

    it "200ステータスが返ってくる" do
      get privacy_path
      expect(response).to have_http_status(200)
    end

    it "200ステータスが返ってくる" do
      get contact_path
      expect(response).to have_http_status(200)
    end
  end
end
