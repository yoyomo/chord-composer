class ApplicationController < ActionController::API
  def fallback_index_html
    redirect_to ENV['CLIENT_URL'] ? "#{ENV['CLIENT_URL']}#{params[:path]}" : ""
  end
end
