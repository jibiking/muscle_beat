class UsersController < ApplicationController
  before_action :set_user, only: %i[show edit update destroy]
  skip_before_action :require_login, only: %i[new create]
  skip_before_action :check_admin, only: %i[new create]

  def index
    @users = User.page(params[:page]).per(10)
  end

  def show; end

  def new
    @user = User.new
  end

  def edit; end

  def create
    @user = User.new(user_params)

    if @user.save
      auto_login(@user)
      redirect_to beats_path, notice: 'ユーザーを登録しました！'
    else
      render :new
    end
  end

  def update
    if @user.update(user_params)
      redirect_to user_url(@user), notice: 'ユーザーを登録できませんでした…。'
    else
      render :edit
    end
  end

  def destroy
    @user.destroy
    redirect_to users_path, notice: 'ユーザーを削除しました！'
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:user_name, :role, :password, :password_confirmation)
  end
end
