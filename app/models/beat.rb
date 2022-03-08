# == Schema Information
#
# Table name: beats
#
#  id                   :bigint           not null, primary key
#  gif                  :string           not null
#  level                :integer          not null
#  music                :string           not null
#  notes                :string           not null
#  thumbnail            :string           not null
#  title                :string           not null
#  training_description :string           not null
#  training_muscle      :string           not null
#  url                  :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  user_id              :bigint           not null
#
# Indexes
#
#  index_beats_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Beat < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :url, presence: true
  validates :training_muscle, presence: true
  validates :level, presence: true
  validates :thumbnail, presence: true
  validates :training_description, presence: true
  validates :gif, presence: true
  validates :music, presence: true
  validates :notes, presence: true

  enum level: { nomal: 0, hard: 1 }

  mount_uploader :thumbnail, ThumbnailUploader
  mount_uploader :gif, GifUploader
  mount_uploader :music, MusicUploader
  mount_uploader :notes, NotesUploader
end
