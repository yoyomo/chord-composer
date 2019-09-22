class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    
    create_table(:users) do |t|

      t.string :username
      t.string :email, :null => false
      t.text :favorite_chords, array: true, default: []

      t.string :stripe_customer_id
      t.string :stripe_subscription_id
      t.string :stripe_plan_id
      t.string :stripe_token_id

      t.string :password_digest, null: false, default: ""
      t.string :confirmation_token
      t.datetime :confirmation_expires_at
      t.datetime :confirmed_at

      t.string :access_token, uniqueness: true

      t.timestamps
    end

    add_index :users, :email,                unique: true
  end
end
