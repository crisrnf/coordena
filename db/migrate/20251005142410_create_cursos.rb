class CreateCursos < ActiveRecord::Migration[7.1]
  def change
    create_table :cursos do |t|
      t.string :nombre
      t.string :nivel
      t.integer :año
      t.boolean :activo, default: true

      t.timestamps
    end
  end
end
