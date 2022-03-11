module ApplicationHelper
  def default_meta_tags
    {
      site: 'Muscle Beat',
      title: 'MuscleBeat - 筋トレ×音ゲー×EDMの新感覚トレーニングアプリ',
      reverse: true,
      charset: 'utf-8',
      description: '筋トレ×音ゲー×EDMの新感覚トレーニングアプリMuscle Beat（マッスルビート）| １分間でノリノリシェイプアップ！HIITトレーニングを採用した最新鋭トレーニングを提供します！',
      keywords: '筋トレ,ダイエット,トレーニングアプリ,筋トレアプリ,ダイエットアプリ',
      canonical: request.original_url,
      separator: '|',
      icon: [
        { href: image_url('favicon.ico') },
        { href: image_url('icon.png'), rel: 'apple-touch-icon', sizes: '180x180',
          type: 'image/png' }
      ],
      og: {
        site_name: 'MuscleBeat - 筋トレ×音ゲー×EDMの新感覚トレーニングアプリ',
        title: 'MuscleBeat - 筋トレ×音ゲー×EDMの新感覚トレーニングアプリ',
        description: '１分間でシェイプアップ！ノリノリ筋トレで高得点を目指せ！',
        type: 'website',
        url: request.original_url,
        image: image_url('ogp.png'),
        locale: 'ja_JP'
      },
      twitter: {
        card: 'summary_large_image',
        site: '@ji_bi__'
      }
    }
  end
end
