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
