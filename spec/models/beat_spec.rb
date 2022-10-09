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
require 'rails_helper'

RSpec.describe Beat, type: :model do
  let(:user){ create(:user, :admin)}
  let(:beat){ create(:beat, user: user) }

  describe 'バリデーション確認' do
    context '正常系' do
      it 'ビートが正常に作成されること' do
        expect(beat.valid?).to be true
      end
    end

    context 'エラー系' do
      it '未入力のあるビートは作成されないこと' do
        null_beat = Beat.new
        expect(null_beat.valid?).to be false
      end
    end
  end
end
