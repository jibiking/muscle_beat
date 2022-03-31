class StartsController < ApplicationController
  skip_before_action :require_login

  def index; end
  def explain; end
  def terms; end
  def privacy; end
  def contact; end
end
