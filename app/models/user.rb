class User < ApplicationRecord
  # módulos de Devise habilitados
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]

  # Método que busca o crea un usuario desde Google
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
    end
  end
    # Devise
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Validación de correo externo
  validates :email, email_existence: true
end

