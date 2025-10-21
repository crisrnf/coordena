class CreateRoles < ActiveRecord::Migration[7.1]
  def change
    create_table :roles do |t|
      t.string :role_name  # solo la columna, sin unique
      t.timestamps
    end

    # Creamos un índice único sobre role_name
    add_index :roles, :role_name, unique: true
  end
end

