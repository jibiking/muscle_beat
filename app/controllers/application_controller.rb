class ApplicationController < ActionController::Base
  before_action :require_login
  # before_action :check_admin
  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def not_authenticated
    redirect_to login_path, notice: 'ログインが必要です！'
  end

  def user_not_authorized
    redirect_to beats_path, notice: '権限がありません'
  end
end
