class CreateSynths < ActiveRecord::Migration[5.2]
  def change
    create_table :synths do |t|
      t.integer :base_frequency
      t.integer :base_octave
      t.integer :vco_signal
      t.boolean :sound_on

      t.references :user

      t.timestamps
    end
  end
end
