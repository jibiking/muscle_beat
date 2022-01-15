class CreateBeats < ActiveRecord::Migration[6.1]
  def change
    create_table :beats do |t|
      t.string :title, null: false
      t.string :url, null: false
      t.string :training_muscle, null: false
      t.integer :level, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
