phina.globalize();



var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 768;
var MARKER_RADIUS = 70;
var MARKER_STROKE_WIDTH = 8;

var TRACK_NUM = 9;
var ICON_INTERVAL_DEGREE = 180 / (TRACK_NUM - 1); // 22.5

var MARKER_APPEARANCE_DELTA = 2000; // ノーツ出現時間(ms): 大きくするほど低速
var UNIT_ARRANGE_RADIUS = SCREEN_WIDTH * 0.41 | 0;
var MUSIC_START_DELAY = 2000;

var RATING_TABLE = {
  perfect: {
    score: 1000,
    range: 34, //ms
  },
  great: {
    score: 500,
    range: 64, //ms
  },
  good: {
    score: 100,
    range: 90, //ms
  },
  miss: {
    score: 0,
    range: 134, //ms
  },
};


var ASSETS = {
  sound: {
    music: "../../../assets/music/energy.mp3",
    ring: "../../../assets/music/tamborine.mp3",
  },
  json: {
    beatmap: "../../../assets/json/notes.json"
  },
  image: {
    'bg': '../../../assets/images/club.jpg'
  }
};


// devicemotionの導入
function deviceMotionRequest () {
  if (DeviceMotionEvent.requestPermission) {
    // DMイベントの許可を求める
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        // リクエストが許可されたら
        if (permissionState === 'granted') {
          window.addEventListener("devicemotion", function (event) {
            // 許可されなかった時の表示
            if (!event.accelerationIncludingGravity) {
              alert('event.accelerationIncludingGravity is null');
              return;
            }
            // 加速度センサーの値を変数に格納
            var x = Math.floor(event.accelerationIncludingGravity.x)
            var y = Math.floor(event.accelerationIncludingGravity.y)
            var z = Math.floor(event.accelerationIncludingGravity.z)

            // 加速度センサーの値の表示
            document.getElementById('x').innerHTML = x;
            document.getElementById('y').innerHTML = y;
            document.getElementById('z').innerHTML = z;

            // 右・左の判定
            if(x < 0) {
              $(".tilt span").removeClass("color");
              $(".tilt span").eq(0).addClass("color");
            }else{
              $(".tilt span").removeClass("color");
              $(".tilt span").eq(1).addClass("color");
            }
            // 上・下の判定
            if(y < 0) {
              $(".ud span").removeClass("color");
              $(".ud span").eq(0).addClass("color");
            }else{
              $(".ud span").removeClass("color");
              $(".ud span").eq(1).addClass("color");
            }
            // 手前・奥の判定
            if(z < 0) {
              $(".depth span").removeClass("color");
              $(".depth span").eq(1).addClass("color");
            }else{
              $(".depth span").removeClass("color");
              $(".depth span").eq(0).addClass("color");
            }

            if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
            // ここに振っているときの動作を入れる
            // とりあえず１振り＝ +0.1で定めておく
              // alert("振ってるよ");
              var thisCount = $("#count").html();
              thisCount = Number(thisCount);
              thisCount = thisCount + 0.1;
              $("#count").html(thisCount);
            }
          })
        }
      })
      .catch(console.error);
  } else {
    alert('DeviceMotionEvent.requestPermission is not found')
  }
}









// ############################################################




/**
 * タイトル
 */
phina.define('TitleScene', {
  superClass: 'phina.display.DisplayScene',

  init: function(params) {
    this.superInit(params);
    this.backgroundColor = params.backgroundColor;

    // タイトルラベル
    Label({
      text: "太鼓の達人風音ゲー",
      fill: "white",
      stroke: "#2F3CEC",
      strokeWidth: 6,
      fontSize: 100,
    })
    .setPosition(this.gridX.center(), this.gridY.span(6))
    .addChildTo(this)

    var touchLabel = Label({
      text: "タップでSTART",
      fill: "white",
      stroke: "#2F3CEC",
      strokeWidth: 6,
      fontSize: 64,
    })
    .setPosition(this.gridX.center(), this.gridY.span(12))
    .addChildTo(this);

    // 明滅させる
    touchLabel.tweener.clear()
    .setLoop(true)
    .to({alpha: 0}, 700)
    .to({alpha: 1}, 700)
    ;

    // モバイルでの再生制限アンロックのため、画面タッチ時にSoundを無音再生
    this.on('enter', function() {
      var event = "touchstart";
      var dom = this.app.domElement;
      dom.addEventListener(event, (function() {
        return function f() {
          var context = phina.asset.Sound.getAudioContext();
          var buf = context.createBuffer(1, 1, 22050);
          var src = context.createBufferSource();
          src.buffer = buf;
          src.connect(context.destination);
          src.start(0);

          dom.removeEventListener(event, f, false);
        }
      }()), false);

      // シーン遷移
      this.on('pointend', function() {
        this.exit();
      });
    });

  },

});




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











/*
 * ユニット表示アイコン
 */
phina.define('UnitIcon', {
  superClass: 'phina.display.CircleShape',

  init: function(id, label) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      stroke: "magenta",
      fill: "pink",
    });
    this.setInteractive(true);
    this.id = id;
  },

  fireEffect: function() {
    EffectWave().addChildTo(this);
  },

});


/**
 * ターゲットマーカー（ノーツ）
 */
phina.define('TargetMarker', {
  superClass: 'phina.display.CircleShape',

  init: function(targetTime, trackId, type) {
    this.superInit({
      radius: MARKER_RADIUS,
      strokeWidth: MARKER_STROKE_WIDTH,
      stroke: "red",
      fill: false,
    });

    this.visible = false;
    this.scaleX = this.scaleY = 0;
    this.isAwake = true;

    this.targetTime = targetTime;
    this.trackId = trackId;

    // 進行方向 右→左
    this.vector = phina.geom.Vector2(
      Math.cos((180).toRadian()),
      Math.sin((180).toRadian())
    );
  },
});


// 以下そのままでOK

/**
 * エフェクト：白フェードアウト円
 */
phina.define('EffectWave', {
  superClass: 'phina.display.CircleShape',

  init: function(options) {
    this.superInit({
      radius: MARKER_RADIUS,
      stroke: false,
      fill: "white",
    });

    this.tweener
    .to({scaleX:1.7, scaleY:1.7, alpha:0}, 250)
    .call(function() {
      this.remove();
    }, this);
  },
});

/**
 * エフェクト："PERFECT!"など
 */
phina.define('RateLabel', {
  superClass: 'phina.display.Label',

  init: function(textParam) {
    this.superInit({
      text: textParam.text,
      fontSize: 60,
      strokeWidth: 8,
      fill: "pink",
      stroke: "white",
    });

    this.tweener
    .set({scaleX: 0.2, scaleY: 0.2, alpha: 0})
    .to({scaleX:1, scaleY:1, alpha:1}, 130, "easeOutCirc")
    .wait(250)
    .to({alpha:0}, 100)
    .call(function() {
      this.remove();
    }, this);
  },
});








phina.main(function() {
  var app = GameApp({
    assets: ASSETS,
    width: SCREEN_WIDTH,
    height: 300,
    startLabel: 'title',
    backgroundColor: 'navy',
    title: 'サンプル',
    fps: 60,
    query: '#mycanvas',
    // fit: false,
  });

  app.run();
});