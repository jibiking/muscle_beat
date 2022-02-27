class MypageController < ApplicationController
  def index
    @scores = Score.where(user_id: current_user.id)
  end
end
