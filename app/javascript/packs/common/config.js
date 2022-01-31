
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

