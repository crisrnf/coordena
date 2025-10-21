class AddFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    # Se agrega role_id de nuevo, null: true para no romper usuarios existentes
    add_reference :users, :role, null: true, foreign_key: true, if_not_exists: true
  end
end
