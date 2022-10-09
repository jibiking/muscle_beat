# == Schema Information
#
# Table name: users
#
#  id               :bigint           not null, primary key
#  crypted_password :string
#  role             :integer          default("general"), not null
#  salt             :string
#  user_name        :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_users_on_user_name  (user_name) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user){ create(:user) }

  describe 'バリデーション確認' do
    context '正常系' do
      it 'ユーザーが正常に作成されること' do
        expect(user.valid?).to be true
      end
    end

    context 'エラー系' do
      it '名前が未入力のユーザーは作成されないこと' do
        null_user_name = User.new
        expect(null_user_name.valid?).to be false
        expect(null_user_name.errors.messages[:user_name]).to eq ["を入力してください"]
      end

      it '名前が４文字以上のユーザーは作成されないこと' do
        over_user_name = User.new(user_name: 'user5', password: 'password', password_confirmation: 'password')
        expect(over_user_name.valid?).to be false
        expect(over_user_name.errors.messages[:user_name]).to eq ["は4文字以内で入力してください"]
      end
    end
  end
end
