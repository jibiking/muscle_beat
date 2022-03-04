class RankingController < ApplicationController
  # 削除予定
  def index
    beat = Beat.find(params[:id])
    @rankings = Score.includes(:user).where(beat_id: beat.id).order(score: :desc)
  end
end
