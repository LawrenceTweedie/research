let tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let videos = document.querySelectorAll('.video');
let player;

function onYouTubeIframeAPIReady() {
  let players = [];

  videos.forEach(function (video, index) {
    let frame = video.querySelector('#player');
    let id = video.getAttribute('data-id');
    let idPlayer = index;

    player = new window.YT.Player(frame, {
      height: '460',
      width: '869',
      videoId: id,
      playerVars: {
        autoplay: 0,
      },
    });

    player.idPlayer = idPlayer;
    players.push(player);
    video.setAttribute('data-index', idPlayer);
  });

  document.addEventListener('click', (evt) => {
    players.forEach(function (item) {
      item.pauseVideo();
    });

    videos.forEach(function (video) {
      video.classList.remove('hide-cover');
    });

    if (evt.target.closest('.video')) {
      let currentVideo = evt.target.closest('.video');
      let idx = currentVideo.getAttribute('data-index');
      currentVideo.classList.add('hide-cover');

      let currentPlayer = players[idx];

      currentPlayer.playVideo();
    }
  });
}
