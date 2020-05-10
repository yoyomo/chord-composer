class ApplicationController < ActionController::API
  def fallback_index_html
    redirect_to 'public/index.html'
  end
end
