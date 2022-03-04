class StartsController < ApplicationController
  skip_before_action :require_login
  skip_before_action :check_admin

  def index; end

  def explain; end
end
