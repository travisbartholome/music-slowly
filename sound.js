function onDOMLoad() {
  //alert('Working!'); // Testing file loading in index.html
  let audioURL = "https://raw.githubusercontent.com/travisbartholome/music-slowly/master/samples/ferling-10.ogg";
  let play = document.getElementById("play");
  let audioContext = new AudioContext();
  let sample;
  function playBuffer(buffer) {
    let player = audioContext.createBufferSource();
    player.buffer = buffer;
    player.connect(audioContext.destination);
    player.start(audioContext.currentTime + 0.5);
  }
  play.addEventListener("click", function() {
    if (sample) {
      playBuffer(sample);
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
