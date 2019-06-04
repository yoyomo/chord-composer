class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :uuid
      t.string :username
      t.string :email
      t.text :favorite_chords, array: true, default: []
      t.timestamps
    end
  end
end
