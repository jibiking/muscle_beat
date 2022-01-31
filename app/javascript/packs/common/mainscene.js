
/**
 * メイン
 */
phina.define('MainScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);
    this.backgroundColor = "navy";
    // 背景
    Sprite('bg').addChildTo(this)
                .setPosition(this.gridX.center(), this.gridY.center());

    var self = this;
    var gx = this.gridX;
    var gy = this.gridY;
    var AM = phina.asset.AssetManager;

    var beatmap = AM.get('json', 'beatmap').data;

    // タイマーのセット
    this.elapsedTime = 0; // 経過時間
    this.gameTime = 0 - MUSIC_START_DELAY + beatmap.offset; // 判定用時間

    this.totalScore = 0;

    // 時間が来たら音楽流す
    this.one('musicstart', function() {
      SoundManager.playMusic('music', null, false);
    });

    // ユニットアイコンの配置（ノーツの出発地点）
    var iconGroup = DisplayElement()
    .setPosition(gx.center(6), gy.span(12))
    .addChildTo(this);

    // タップアイコンの配置（９個）→１個に変更
    // for (var i = 0; i < 1; i++) {
      // var label = INDEX_TO_KEY_MAP[i].toUpperCase(); // 対応キーを表示
      // var rad = (i * ICON_INTERVAL_DEGREE).toRadian(); // 度数をラジアン変換
      var icon = UnitIcon(0)
      .setPosition(
        gx.center(-20),
        gy.center(-8),
      )
      .addChildTo(iconGroup);

      // 加速度センサーを利用した判定機能
      window.addEventListener("devicemotion", function (event) {
        // 加速度センサーの値を変数に格納
        var x = Math.floor(event.accelerationIncludingGravity.x)
        var y = Math.floor(event.accelerationIncludingGravity.y)
        var z = Math.floor(event.accelerationIncludingGravity.z)

        if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
          self.judge(icon);
        }
      })


      // タップ・クリック判定
      icon.onpointstart = function() {
        self.judge(this); // 自分を渡す
        this.flare('dm'); //dm発火
      };


    // 譜面の展開
    this.markerGroup = DisplayElement()
    .setPosition(iconGroup.x, iconGroup.y)
    .addChildTo(this);
    beatmap.notes.forEach(function(note) {
      TargetMarker(note.targetTime, note.track)
      .addChildTo(self.markerGroup)
    })

    // score表示
    this.scoreLabel = Label({
      text: 0,
      textAlign: "center",
      stroke: "magenta",
      fill: "white",
      strokeWidth: 2,
      fontSize: 50,
    })
    .setPosition(gx.center(), gy.span(3))
    .addChildTo(this)
    .on('enterframe', function() {
      this.text = self.totalScore;
    });

    // リセットボタン
    Button({
      text: 'RESET',
      fill: "#F539B9",
    })
    .setOrigin(1, 0)
    .setPosition(this.width, 0)
    .addChildTo(this)
    .on('push', function() {
      SoundManager.stopMusic();
      self.exit('main')
    });

  },

  update: function(app) {
    var self = this;
    var ps = app.pointers;
    var kb = app.keyboard;

    // タイマー加算
    this.elapsedTime += app.deltaTime;
    this.gameTime += app.deltaTime;

    // ゲームスタートまでの猶予
    if (this.has('musicstart') && this.elapsedTime > MUSIC_START_DELAY) {
      this.flare('musicstart');
    }

    // ノーツ描画
    var markers = this.markerGroup.children;
    markers.forEach(function(m) {
      if (!m.isAwake) return;

      var time = this.gameTime
      var rTime = m.targetTime - time; // 相対時間

      if (rTime < MARKER_APPEARANCE_DELTA) {
        // ノーツの位置比率や縮小率（倍率）を計算する
        // ratioはアイコンに近いほど1.0に近づく
        var ratio = (time - (m.targetTime - MARKER_APPEARANCE_DELTA)) / MARKER_APPEARANCE_DELTA;
        var distance = 750 * ratio; // ノーツのストローク

        m.setVisible(true)
        .setPosition(
          m.vector.x * distance,
          m.vector.y * distance
        )
        // ノーツの大きさ（縮小率）
        .setScale(1, 1);
      }

      // miss判定
      if (RATING_TABLE["miss"].range < -rTime) {
        this.reaction(m, "miss");
      }
    }.bind(this));

  },

  // 判定処理 以下そのままでOK
  judge: function(unitIcon) {
    var time = this.gameTime;

    // 判定可能ノーツを探索
    var markers = this.markerGroup.children;
    markers.some(function(m) {
      if (!m.isAwake || m.trackId !== unitIcon.id) return;

      // ノーツが有効かつtrackIdが一致、かつ判定範囲内
      // 判定が狭い順に判定し、該当したらループ拔ける
      var delta = Math.abs(m.targetTime - time);
      if (delta <= RATING_TABLE["perfect"].range) {
        unitIcon.fireEffect();
        SoundManager.play('ring');
        this.reaction(m, "perfect");
        return true;
      }
      if (delta <= RATING_TABLE["great"].range) {
        unitIcon.fireEffect();
        SoundManager.play('ring');
        this.reaction(m, "great");
        return true;
      }
      if (delta <= RATING_TABLE["good"].range) {
        unitIcon.fireEffect();
        SoundManager.play('ring');
        this.reaction(m, "good");
        return true;
      }
      if (delta <= RATING_TABLE["miss"].range) {
        this.reaction(m, "miss");
        return true;
      }
    }.bind(this));

  },

  reaction: function(marker, rating) {
    // ノーツ不可視化
    marker.isAwake = false;
    marker.visible = false;

    RateLabel({text: rating.toUpperCase()})
    .setPosition(this.gridX.center(), this.gridY.center())
    .addChildTo(this);

    this.totalScore += RATING_TABLE[rating].score;
  },

});
