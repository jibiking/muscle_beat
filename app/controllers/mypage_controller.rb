class MypageController < ApplicationController
  def index
    @scores = Score.all
  end
end
