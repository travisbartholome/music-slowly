function onDOMLoad() {
  //alert('Working!'); // Testing file loading in index.html
  let audioURL = "https://raw.githubusercontent.com/travisbartholome/music-slowly/master/samples/ferling-10.ogg";
  let play = document.getElementById("play");
  let audioContext = new AudioContext();
  let sampleBuffer;

  function playBuffer(playbackRate) {
    return function(buffer) {
      sampleBuffer = buffer;
      let player = audioContext.createBufferSource();
      player.buffer = buffer;
      player.playbackRate.value = playbackRate;
      //player.detune.value = 2400 * (1 - playbackRate); // HACK HACK HACK HACK for only 1/2 speed
      player.connect(audioContext.destination);
      let startTime = audioContext.currentTime + 0.5; // Is the 0.5s delay necessary?
      player.start(startTime);
      player.stop(startTime + 8); // Arbitrary duration
    };
  }

  function getAudio(playbackRate) {
    return function() {
      if (sampleBuffer) {
        playBuffer(playbackRate)(sampleBuffer);
      } else {
        let request = new XMLHttpRequest();
        request.onload = function() {
          audioContext.decodeAudioData(request.response, playBuffer(playbackRate));
        };
        request.responseType = "arraybuffer";
        request.open("GET", audioURL);
        request.send();
      }
    };
  }

  play.addEventListener("click", getAudio(1));
  halfSpeed.addEventListener("click", getAudio(0.5));
}
