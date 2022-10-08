class ScoresController < ApplicationController
  protect_from_forgery

  def create
    @score = Score.new(score_params)
    @score.save!
  end

  private

  def score_params
    params.permit(:score, :user_id, :beat_id)
  end
end
