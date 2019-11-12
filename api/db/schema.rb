# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_11_12_064312) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "synths", force: :cascade do |t|
    t.integer "base_frequency"
    t.integer "base_octave"
    t.integer "vco_signal"
    t.boolean "sound_on"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_synths_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email", null: false
    t.text "favorite_chords", default: [], array: true
    t.string "stripe_customer_id"
    t.string "stripe_subscription_id"
    t.string "stripe_plan_id"
    t.string "stripe_token_id"
    t.string "password_digest", default: "", null: false
    t.string "confirmation_token"
    t.datetime "confirmation_expires_at"
    t.datetime "confirmed_at"
    t.string "reset_password_token"
    t.datetime "reset_password_expires_at"
    t.string "access_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["access_token"], name: "index_users_on_access_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
  end

end
