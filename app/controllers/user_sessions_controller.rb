class UserSessionsController < ApplicationController
  skip_before_action :require_login, only: %i[new create]
  skip_before_action :check_admin, only: %i[new create destroy]

  def create
    @user = login(params[:user_name], params[:password])

    if @user
      redirect_back_or_to(:beats, notice: 'Login successful')
    else
      flash.now[:alert] = 'Login failed'
      render action: 'new'
    end
  end

  def destroy
    logout
    redirect_to(:beats, notice: 'Logged out!')
  end
end
