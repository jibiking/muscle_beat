class StartsController < ApplicationController
  skip_before_action :require_login, only: [:index]
  skip_before_action :check_admin, only: [:index]

  def index; end
end
