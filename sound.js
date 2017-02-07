function onDOMLoad() {
  //alert('Working!'); // Testing file loading in index.html
  let audioURL = "https://raw.githubusercontent.com/travisbartholome/music-slowly/master/samples/ferling-10.ogg";
  let play = document.getElementById("play");
  let audioContext = new AudioContext();
  let sampleBuffer;
  function playBuffer(buffer) {
    sampleBuffer = buffer;
    let player = audioContext.createBufferSource();
    player.buffer = buffer;
    player.connect(audioContext.destination);
    let startTime = audioContext.currentTime + 0.5; // Is the 0.5s delay necessary?
    player.start(startTime);
    player.stop(startTime + 8); // Arbitrary duration
  }
  play.addEventListener("click", function() {
    if (sampleBuffer) {
      playBuffer(sampleBuffer);
    } else {
      let request = new XMLHttpRequest();
      request.onload = function() {
        audioContext.decodeAudioData(request.response, playBuffer);
      };
      request.responseType = "arraybuffer";
      request.open("GET", audioURL);
      request.send();
    }
  });
}
