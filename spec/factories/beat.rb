FactoryBot.define do
  factory :beat do
    sequence(:title) { |n| "title_#{n}" }
    url { '5000' }
    training_muscle { 'sample' }
    level { 'nomal' }
    thumbnail { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/thumbnail.jpg'))}
    training_description { 'sample' }
    gif { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/gif.png'))}
    music { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/music.mp3'))}
    notes { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/notes.json'))}
    association :user
  end
end