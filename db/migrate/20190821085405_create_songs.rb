class CreateSongs < ActiveRecord::Migration[5.2]
  def change
    create_table :songs do |t|

      t.references :user
      t.string :title
      t.string :author
      t.jsonb :chords_and_lyrics, array: true, default: [], null: false

      t.timestamps
    end
  end
end
