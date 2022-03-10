# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = 'https://www.muscle-beat.com'
SitemapGenerator::Sitemap.sitemaps_host = 'https://s3-ap-northeast-1.amazonaws.com/muscle-beat'
SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'
SitemapGenerator::Sitemap.adapter = SitemapGenerator::AwsSdkAdapter.new(
  'muscle-beat',
  aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  aws_region: 'ap-northeast-1'
)

SitemapGenerator::Sitemap.create do
  add root_path
  add explain_path
  Beat.find_each do |beat|
    add beat_path(beat)
  end
end
