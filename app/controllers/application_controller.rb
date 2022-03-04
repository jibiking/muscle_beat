class ApplicationController < ActionController::Base
  before_action :require_login
  before_action :check_admin

  private

  def not_authenticated
    redirect_to login_path, notice: "ログインが必要です！"
  end

  def check_admin
    redirect_to beats_path, notice: '権限がありません' unless current_user.admin?
  end
end
