# == Schema Information
#
# Table name: scores
#
#  id         :bigint           not null, primary key
#  score      :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  beat_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_scores_on_beat_id  (beat_id)
#  index_scores_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (beat_id => beats.id)
#  fk_rails_...  (user_id => users.id)
#
class Score < ApplicationRecord
  belongs_to :user
  belongs_to :beat
end
