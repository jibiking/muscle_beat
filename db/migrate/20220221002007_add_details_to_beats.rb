class AddDetailsToBeats < ActiveRecord::Migration[6.1]
  def change
    add_column :beats, :thumbnail, :string, null: false
    add_column :beats, :training_description, :string, null: false
    add_column :beats, :gif, :string, null: false
    add_column :beats, :music, :string, null: false
    add_column :beats, :notes, :string, null: false
  end
end
