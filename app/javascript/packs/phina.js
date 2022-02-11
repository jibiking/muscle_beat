if (!phina.util.Support.webAudio) {
  alert('webAudioに対応していません！最新のブラウザを使って下さい！');
}

phina.globalize();


var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 768;
var MARKER_RADIUS = 80; //ノーツの大きさ
var MARKER_STROKE_WIDTH = 8; //ノーツの幅

var MARKER_APPEARANCE_DELTA = 4000; // ノーツ出現時間(ms): 大きくするほど低速
var MUSIC_START_DELAY = 2000;

// var TRACK_NUM = 9;
// var ICON_INTERVAL_DEGREE = 180 / (TRACK_NUM - 1); // 22.5
// var UNIT_ARRANGE_RADIUS = SCREEN_WIDTH * 0.41 | 0;


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
  music: "/assets/energy.mp3",
  ring: "/assets/tamborine.mp3",
},
json: {
  beatmap: "/assets/notes.json"
},
image: {
  'bg': "/assets/club.png",
  'sprite': "/assets/sample.png",
},
  // スプライトシート
spritesheet: {
  "sprite_ss":
  {
    // フレーム情報
    "frame": {
      "width": 750, // 1フレームの画像サイズ（横）
      "height": 1334, // 1フレームの画像サイズ（縦）
      "cols": 1, // フレーム数（横）
      "rows": 28, // フレーム数（縦）
    },
    // アニメーション情報
    "animations" : {
      "squat": { // アニメーション名
        "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27], // フレーム番号範囲
        "next": "squat", // 次のアニメーション
        "frequency": 6, // アニメーション間隔
      },
    }
  },
}
};



/**
* タイトル
*/
phina.define('TitleScene', {
superClass: 'phina.display.DisplayScene',

init: function(params) {
  this.superInit(params);
  this.backgroundColor = params.backgroundColor;
  Sprite('bg').addChildTo(this)
          .setPosition(this.gridX.center(), this.gridY.center());


  // タイトルラベル
  Label({
    text: "<%= @beat.title %>",
    fill: "white",
    stroke: "#2F3CEC",
    strokeWidth: 6,
    fontSize: 140,
  })
  .setPosition(this.gridX.span(10), this.gridY.center())
  .setRotation(90)
  .addChildTo(this)

  var touchLabel = Label({
    text: "タップでSTART",
    fill: "white",
    stroke: "#2F3CEC",
    strokeWidth: 6,
    fontSize: 84,
  })
  .setPosition(this.gridX.span(4), this.gridY.center())
  .setRotation(90)
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
* スコアページ
*/
phina.define('ScoreScene', {
superClass: 'phina.display.DisplayScene',

init: function(params) {
  this.superInit(params);
  this.backgroundColor = params.backgroundColor;
  Sprite('bg').addChildTo(this)
          .setPosition(this.gridX.center(), this.gridY.center());


  // タイトルラベル
  Label({
    text: params.score,
    fill: "white",
    stroke: "#2F3CEC",
    strokeWidth: 6,
    fontSize: 160,
  })
  .setPosition(this.gridX.span(10), this.gridY.center())
  .setRotation(90)
  .addChildTo(this)

  var touchLabel = Label({
    text: "タップで終了",
    fill: "white",
    stroke: "#2F3CEC",
    strokeWidth: 6,
    fontSize: 84,
  })
  .setPosition(this.gridX.span(4), this.gridY.center())
  .setRotation(90)
  .addChildTo(this);

  // 明滅させる
  touchLabel.tweener.clear()
  .setLoop(true)
  .to({alpha: 0}, 700)
  .to({alpha: 1}, 700)
  ;

  // シーン遷移（ビート一覧へ遷移）
  this.on('pointend', function() {
    this.exit(); //デバッグ用
    // window.location.href = '/beats';
  });
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
    stroke: "rgba(127, 255, 255, 1)",
    fill: "rgba(127, 255, 255, 0.4)",
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
    stroke: "magenta",
    fill: false,
  });

  this.visible = false;
  this.scaleX = this.scaleY = 0;
  this.isAwake = true;

  this.targetTime = targetTime;
  this.trackId = trackId;

  // 進行方向 下→上
  this.vector = phina.geom.Vector2(
    Math.cos((270).toRadian()),
    Math.sin((270).toRadian())
  );
},
});


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
  .to({scaleX:2.3, scaleY:2.3, alpha:0}, 250)
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
    fontSize: 90,
    strokeWidth: 6,
    fill: "magenta",
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
  .setPosition(gx.center(-5), gy.span(16.5))
  .addChildTo(this);

  // タップアイコンの配置（９個）→１個に変更
  // for (var i = 0; i < 1; i++) {
    // var label = INDEX_TO_KEY_MAP[i].toUpperCase(); // 対応キーを表示
    // var rad = (i * ICON_INTERVAL_DEGREE).toRadian(); // 度数をラジアン変換
    var icon = UnitIcon(0)
    .setPosition(
      gx.center(-8),
      gy.span(-14.5),
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
    };

  // 画面をタップ・クリックで判定
  this.on('pointend', function() {
    self.judge(icon);
  });


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
    strokeWidth: 4,
    fontSize: 60,
  })
  .setPosition(gx.span(13), gy.center())
  .setRotation(90)
  .addChildTo(this)
  .on('enterframe', function() {
    this.text = self.totalScore;
  });


  // 筋トレ説明文の表示
  this.descriptionLabel = Label({
    text: ["〜スクワット〜 \nスマホを両手で握り\n地面と水平に持つ！\nノーツのタイミングで\n腰を落としてスクワット！"],
    textAlign: "center",
    fill: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    strokeWidth: 2,
    fontSize: 42,
  })
  .setPosition(gx.span(12), gy.center(4.5))
  .setRotation(90)
  .addChildTo(this)


  // スプライト画像作成
  var sprite = Sprite('sprite', 750, 1334)
  .setPosition(gx.span(11.5), gy.center(-4.5))
  .setScale(0.5, 0.5)
  .setRotation(90)
  .addChildTo(this);
  // スプライトにフレームアニメーションをアタッチ
  var anim = FrameAnimation('sprite_ss').attachTo(sprite);
  // アニメーションを指定する
  anim.gotoAndPlay('squat');



  // リセットボタン
  // Button({
  //   text: 'RESET',
  //   fill: "#F539B9",
  // })
  // .setOrigin(1, 0)
  // .setPosition(this.width, 0)
  // .addChildTo(this)
  // .on('push', function() {
  //   SoundManager.stopMusic();
  //   self.exit('main')
  // });

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

  // ゲーム終了（Scoreページへ）
  if (this.elapsedTime > "<%= @beat.url%>") {
    SoundManager.stopMusic();
    self.exit({score: this.totalScore,});
  };

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
      var distance = 1360 * ratio; // ノーツのストローク

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
  .setRotation(90)
  .addChildTo(this);

  this.totalScore += RATING_TABLE[rating].score;
},

});


phina.main(function() {
  var app = GameApp({
    assets: ASSETS,
    // width: 380, //スマホの縦
    // height: 655, //スマホの横
    // width: SCREEN_WIDTH, //デバッグ用
    // height: SCREEN_HEIGHT, //デバッグ用
    width: 1030, //デバッグ用
    height: 1500, //デバッグ用
    startLabel: 'TitleScene',
    backgroundColor: 'navy',
    title: 'サンプル',
    fps: 60,
    // query: '#mycanvas',
    // fit: false,

    scenes: [
      {
        className: 'TitleScene',
        label: 'TitleScene',
        nextLabel: 'MainScene',
      },
      {
        className: 'MainScene',
        label: 'MainScene',
        nextLabel: 'ScoreScene',
      },
      {
        className: 'ScoreScene',
        label: 'ScoreScene',
        nextLabel: 'TitleScene',
      },
    ]
  });

  app.run();
});