class UserSessionsController < ApplicationController
  skip_before_action :require_login, only: %i[new create]

  def create
    @user = login(params[:user_name], params[:password])

    if @user
      redirect_back_or_to(:users, notice: 'Login successful')
    else
      flash.now[:alert] = 'Login failed'
      render action: 'new'
    end
  end

  def destroy
    logout
    redirect_to(:users, notice: 'Logged out!')
  end
end
