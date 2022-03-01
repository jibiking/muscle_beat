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


// ハンバーガーメニュー
$(function() {
  $('.hamburger').click(function() {
      $(this).toggleClass('active');

      if ($(this).hasClass('active')) {
          $('.globalMenuSp').fadeToggle(300);
      } else {
          $('.globalMenuSp').fadeToggle(300);
      }
  });
});


// スライダー
$(function() {
	$('.slider').slick({
		// autoplay: true,//自動的に動き出すか。初期値はfalse。
		infinite: true,//スライドをループさせるかどうか。初期値はtrue。
		speed: 300,//スライドのスピード。初期値は300。
		slidesToShow: 3,//スライドを画面に3枚見せる
		slidesToScroll: 1,//1回のスクロールで1枚の写真を移動して見せる
		prevArrow: '<div class="slick-prev"></div>',//矢印部分PreviewのHTMLを変更
		nextArrow: '<div class="slick-next"></div>',//矢印部分NextのHTMLを変更
		centerMode: true,//要素を中央ぞろえにする
		variableWidth: true,//幅の違う画像の高さを揃えて表示
    verticalSwiping: true,//垂直スワイプ
	});
});
