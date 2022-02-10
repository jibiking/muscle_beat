// beats#indexページのdevicemotionボタン
window.deviceMotionRequest = function(){
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
          })
        }
      })
      .catch(console.error);
  } else {
    alert('この端末ではご利用できません。')
  }
}
