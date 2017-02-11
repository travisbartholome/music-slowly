function onDOMLoad() {
  //alert('Working!'); // Testing file loading in index.html
  let audioURL = "https://raw.githubusercontent.com/travisbartholome/music-slowly/master/samples/ferling-10.ogg";
  let play = document.getElementById("play");
  let audioContext = new AudioContext();
  let sampleBuffer;

  function transformAudio(source, nextNode, playbackRate) {
    let analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(nextNode);
    analyser.fftSize = Math.pow(2,14); // TODO: Not sure what size I want here. Probably should be dynamic.
    let dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteFrequencyData(dataArray);
    console.log(dataArray);
  }

  function playBuffer(playbackRate) {
    return function(buffer) {
      let player = audioContext.createBufferSource();
      transformAudio(player, audioContext.destination, playbackRate);
      sampleBuffer = buffer;
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
