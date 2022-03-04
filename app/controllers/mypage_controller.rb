class MypageController < ApplicationController
  skip_before_action :check_admin, only: [:index]
  def index
    @scores = Score.includes(:beat).where(user_id: current_user.id)
  end
end
