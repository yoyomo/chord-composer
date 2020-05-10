class ApplicationController < ActionController::API
  def fallback_index_html
    redirect_to "#{ENV['CLIENT_URL']}/#{params[:path]}" || 'public/index.html'
  end
end
