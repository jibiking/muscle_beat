require 'rails_helper'

RSpec.describe "Beats", type: :request do
  let!(:user){ create(:user, :admin)}
  let!(:beat){ create(:beat, user: user) }

  describe "GET /beats" do
    it "200ステータスが返ってくる" do
      get beats_path
      expect(response).to have_http_status(200)
    end

    it "200ステータスが返ってくる" do
      get beat_path(beat)
      expect(response).to have_http_status(200)
    end
  end
end
