document.addEventListener('turbolinks:load', () => {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onYouTubeIframeAPIReady() {
    new YT.Player('player', {
      videoId: '<%= @beat.url %>',
    });
  }

  console.log("世界の中心で愛をさけぶ")

})

// とりあえずviewファイルのスクリプトに直書きする。