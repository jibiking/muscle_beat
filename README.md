# Muscle Beat
![rails](https://img.shields.io/badge/Rails-v6.1.4-red)


### https://www.muscle-beat.com


## サービス概要
筋トレ × 音ゲー × EDM
<br>
自宅でできる１分間の新感覚トレーニングアプリ
<br>
※ スマホのみプレイ可能


## 画面・機能一覧
| トップページ                                                          | 説明ページ                                                          |
| ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| <img src="https://i.gyazo.com/c750f08ca361c67e31c7dd436eb6cdd9.png"> | <img src="https://i.gyazo.com/89fb9d68f82cfa5b27929728f0ebad84.png">   |
| ・STARTボタンで説明ページに遷移する               | ・各種ページの説明<br>・プレイ画面もしくは曲一覧画面に遷移する                           |
<br>


| 曲一覧ページ                                                                       |
| ------------------------------------------------------------------                |
| <img src="https://i.gyazo.com/545a1274bd367432fb5f2d557c53db8a.gif">                |
| ・カードをタップでタイトルページに遷移する<br>・ハンバーガーメニューから新規登録・ログイン画面に遷移する<br>・曲ごとにランキングの表示<br>・レベルの切り替えボタン |
<br>


| タイトルページ                                                                       |
| ------------------------------------------------------------------                |
| <img src="https://i.gyazo.com/282e468a0e2b5576fb4bf40d7c5cc645.jpg">                |
| ・タップでプレイページに遷移する |
<br>


| プレイページ                                                                       |
| ------------------------------------------------------------------                |
| <img src="https://i.gyazo.com/7745742fa871d06f861e673b7297107c.gif">                |
| 1. マッチョマンの通りのスマホを持ったフォームを意識する<br>2. 動作の詳細は説明文の通り<br>3. 流れてくるノーツに合わせて動作する<br>
<br>


| スコアページ                                                                       |
| ------------------------------------------------------------------                |
| <img src="https://i.gyazo.com/353c8fa0037ce9b3e53ae5788549ff8b.jpg">                |
| ・プレイスコアの表示<br>・リトライボタンで同じ曲のプレイ画面に遷移する<br>・ツイッターシェアボタンでツイート投稿ページに遷移する<br>・ホームボタンで曲一覧ページに遷移する |
<br>

| 新規登録ページ                                                                      | ログインページ                                                       | マイページ                                                       |
| ------------------------------------------------------------------                | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| <img src="https://i.gyazo.com/42e133a456db543b36130c8da7cd02c8.png">                | <img src="https://i.gyazo.com/7a3f5f6699c141dbef854385525e8bd1.png"> | <img src="https://i.gyazo.com/9d35b3d5c783c2520ccd803f7ef0776c.png"> |
| ・ユーザーの新規登録 | ・ユーザーのログイン| ・トレーニング記録の表示|
<br>

| 利用規約                                                                      | プライバシーポリシー                                                       | お問い合わせ                                                       |
| ------------------------------------------------------------------                | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| <img src="https://i.gyazo.com/99e8fecfa5c2c0e0959b9b1d9414765a.png">                | <img src="https://i.gyazo.com/a8f27ac054feb72d2f0c0b9e4b382760.png"> | <img src="https://i.gyazo.com/2794f470ad6894ffd9c054a7dbe6d608.png"> |
| ・利用規約の表示 | ・プライバシーポリシーの表示| お問い合わせの表示|
<br>


## 使用技術
**フロントエンド**
<ul>
  <li>phina.js 0.2.3</li>
</ul>

**バックエンド**
<ul>
  <li>Ruby 3.0.1</li>
  <li>Rails 6.1.4</li>
  <details>
    <summary>主要gem</summary>
    <ul>
      <li><a href="https://github.com/aws/aws-sdk-ruby">aws-sdk-s3</a></li>
      <li><a href="https://github.com/kpumuk/meta-tags">meta-tags</a></li>
      <li><a href="https://github.com/rubocop/rubocop">rubocop</a></li>
    </ul>
  </deatails>
</ul>
  
**インフラ**
- Heroku
- PostgreSQL
- Amazon S3

**その他**<br>
<ul>
  <li>JavaScriptのdevicemotionイベントをphina.jsの判定イベントに組み込んで、スマホを振った際に音ゲーの判定ができるようになっています。</li>
  <li>音ゲーに必要なファイル（MP3・GIF画像・譜面等）はバックエンドで管理しています。</li>
</ul>

## ER図
![ER図](https://i.gyazo.com/c0c5af59ed88acd67174b090c1dbf249.png)

## 画面遷移図
https://www.figma.com/file/BYFZyGFnnNjPcxwamTbhjr/%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB%E5%9B%B3?node-id=0%3A1

## 関連ページ
- Twitterハッシュタグ: [#MuscleBeat](https://twitter.com/hashtag/MuscleBeat?src=hashtag_click)
