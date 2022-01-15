# == Schema Information
#
# Table name: beats
#
#  id              :bigint           not null, primary key
#  level           :integer          not null
#  title           :string           not null
#  training_muscle :string           not null
#  url             :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :bigint           not null
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
end
