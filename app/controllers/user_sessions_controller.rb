class UserSessionsController < ApplicationController
  skip_before_action :require_login, only: %i[new create]

  def create
    @user = login(params[:user_name], params[:password])

    if @user
      redirect_to beats_path, notice: 'ログインしました！'
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
