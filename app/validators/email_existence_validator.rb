require 'httparty'

class EmailExistenceValidator < ActiveModel::EachValidator
  API_KEY = ENV['MAILBOXLAYER_API_KEY']

  def validate_each(record, attribute, value)
    url = "https://apilayer.net/api/check?access_key=#{API_KEY}&email=#{value}&smtp=1&format=1"
    response = HTTParty.get(url)
    data = JSON.parse(response.body)

    unless data["format_valid"] && data["smtp_check"]
      record.errors.add(attribute, :invalid_email, message: "no es un correo válido o no existe")
    end
  rescue => e
    record.errors.add(attribute, :invalid_email, message: "no se pudo validar el correo")
  end
end

