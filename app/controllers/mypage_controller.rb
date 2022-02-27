class MypageController < ApplicationController
  def index
    @scores = Score.includes(:beat).where(user_id: current_user.id)
  end
end
