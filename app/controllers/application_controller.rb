class ApplicationController < ActionController::API
  def fallback_index_html
    redirect_to ENV['CLIENT_URL'] || 'public/index.html'
  end
end
