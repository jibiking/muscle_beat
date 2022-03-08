class ScoresController < ApplicationController
  protect_from_forgery
  before_action :set_score, only: %i[destroy]
  skip_before_action :check_admin, only: [:create]

  def index
    @scores = Score.all
  end

  def create
    @score = Score.new(score_params)

    if @score.save
      redirect_to scores_path, notice: 'Score was successfully created.'
    else
      render :new
    end
  end

  def destroy
    @score.destroy

    redirect_to scores_url, notice: 'Score was successfully destroyed.'
  end

  private

  def set_score
    @score = Score.find(params[:id])
  end

  def score_params
    params.permit(:score, :user_id, :beat_id)
  end
end
