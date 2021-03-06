class BeatsController < ApplicationController
  skip_before_action :require_login, only: %i[index show]
  before_action :set_beat, only: %i[show edit update destroy]
  before_action :authorize_beat, only: %i[index new create]

  def index
    @beats_hard = Beat.hard
    @beats_nomal = Beat.nomal
  end

  def show; end

  def new
    @beat = Beat.new
  end

  def edit; end

  def create
    @beat = current_user.beats.build(beat_params)

    if @beat.save
      redirect_to(:beats, success: 'ビートを追加しました！')
    else
      flash.now[:danger] = 'ビートを追加できませんでした…。'
      render 'new'
    end
  end

  def update
    if @beat.update(beat_params)
      redirect_to beats_path, notice: 'ビートを更新しました！'
    else
      render :beats, status: :unprocessable_entity
    end
  end

  def destroy
    @beat.destroy
    redirect_to beats_path, notice: 'ビートを削除しました！'
  end

  private

  def set_beat
    @beat = Beat.find(params[:id])
    authorize @beat
  end

  def authorize_beat
    authorize Beat
  end

  def beat_params
    params.require(:beat).permit(:title, :url, :training_muscle, :level, :user_id, :thumbnail,
                                 :training_description, :gif, :music, :notes)
  end
end
