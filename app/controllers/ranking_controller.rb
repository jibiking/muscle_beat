class RankingController < ApplicationController
  def index
    beat = Beat.find(params[:id])
    @rankings = Score.includes(:user).where(beat_id: beat.id).limit(3).order(score: :desc)
  end
end
