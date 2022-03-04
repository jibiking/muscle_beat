class UserSessionsController < ApplicationController
  skip_before_action :require_login, only: %i[new create]
  skip_before_action :check_admin, only: %i[new create destroy]

  def create
    @user = login(params[:user_name], params[:password])

    if @user
      redirect_back_or_to beats_path, notice: 'ログインしました！'
    else
      flash.now[:notice] = 'ログインに失敗しました…。'
      render action: 'new'
    end
  end

  def destroy
    logout
    redirect_to beats_path, notice: 'ログアウトしました！'
  end
end
