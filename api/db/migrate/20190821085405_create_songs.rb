class CreateSongs < ActiveRecord::Migration[5.2]
  def change
    create_table :songs do |t|

      t.references :user
      t.string :title
      t.string :author

      # [{chord: "o2[Ceg]1^1^1", lyric: "I am a C chord's lyric"} ,...]
      # melody: [{note: "o2a2", syllable: "I"},{note: "o2[ce]8", syllable: "am"} ,...]
      t.jsonb :chords_and_lyrics, array: true, default: [], null: false

      t.timestamps
    end
  end
end
