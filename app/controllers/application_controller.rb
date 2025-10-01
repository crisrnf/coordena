class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nombre, :apellido])
    devise_parameter_sanitizer.permit(:account_update, keys: [:nombre, :apellido])
  end

  def after_sign_in_path_for(resource)
    hola_path
  end

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end
end