# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_10_05_155642) do
  create_table "alumnos", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "curso_id"
    t.string "matricula"
    t.date "fecha_ingreso"
    t.date "fecha_egreso"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["curso_id"], name: "index_alumnos_on_curso_id"
    t.index ["user_id"], name: "index_alumnos_on_user_id"
  end

  create_table "asistencias", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "alumno_id", null: false
    t.bigint "curso_id", null: false
    t.date "fecha"
    t.string "estado"
    t.string "justificacion"
    t.integer "registrado_por"
    t.boolean "confirmado"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["alumno_id"], name: "index_asistencias_on_alumno_id"
    t.index ["curso_id"], name: "index_asistencias_on_curso_id"
  end

  create_table "cursos", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "nombre"
    t.string "nivel"
    t.integer "año"
    t.boolean "activo", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "roles", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "role_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_name"], name: "index_roles_on_role_name", unique: true
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "provider"
    t.string "uid"
    t.string "nombre"
    t.string "apellido"
    t.string "telefono"
    t.string "dni"
    t.date "fecha_nacimiento"
    t.datetime "bloqueado_hasta"
    t.datetime "ultimo_login"
    t.bigint "role_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
  end

  add_foreign_key "alumnos", "cursos"
  add_foreign_key "alumnos", "users"
  add_foreign_key "asistencias", "alumnos"
  add_foreign_key "asistencias", "cursos"
  add_foreign_key "users", "roles"
end
