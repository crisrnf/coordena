class CreateAsistencias < ActiveRecord::Migration[8.0]
  def change
    create_table :asistencias do |t|
      t.references :alumno, null: false, foreign_key: true
      t.references :curso, null: false, foreign_key: true
      t.date :fecha
      t.string :estado
      t.string :justificacion
      t.integer :registrado_por
      t.boolean :confirmado

      t.timestamps
    end
  end
end
