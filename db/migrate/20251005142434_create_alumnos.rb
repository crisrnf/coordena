class CreateAlumnos < ActiveRecord::Migration[7.1]
  def change
    create_table :alumnos do |t|
      t.references :user, foreign_key: true
      t.references :curso, foreign_key: true
      t.string :matricula
      t.date :fecha_ingreso
      t.date :fecha_egreso

      t.timestamps
    end
  end
end
