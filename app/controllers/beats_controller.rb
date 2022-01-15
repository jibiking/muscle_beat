class BeatsController < ApplicationController
  before_action :set_beat, only: %i[ show edit update destroy ]

  def index
    @beats = Beat.all
  end

  def show
  end

  def new
    @beat = Beat.new
  end

  def edit
  end

  def create
    @beat = Beat.new(beat_params)

    if @beat.save
      redirect_to beat_url(@beat), notice: "Beat was successfully created."
    else
      render :new
    end
  end

  def update
    if @beat.update(beat_params)
      redirect_to beat_url(@beat), notice: "Beat was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @beat.destroy

    redirect_to beats_url, notice: "Beat was successfully destroyed."
  end

  private

  def set_beat
      @beat = Beat.find(params[:id])
    end

    def beat_params
      params.require(:beat).permit(:title, :url, :training_muscle, :level, :user_id)
    end
end
