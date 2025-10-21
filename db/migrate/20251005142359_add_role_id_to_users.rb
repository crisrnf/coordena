class AddRoleIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_reference :users, :role, foreign_key: true
    add_column :users, :telefono, :string
    add_column :users, :dni, :string
    add_column :users, :fecha_nacimiento, :date
    add_column :users, :bloqueado_hasta, :datetime
    add_column :users, :ultimo_login, :datetime
  end
end
