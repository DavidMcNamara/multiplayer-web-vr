console.log("This is the Client JS");

// create this client socket
const socket = io();
var whoami;
var whereami;
var webCamFeed;

var enableVideo = false;
let recordAudio;

// AUDIO FUNCTIONALITY
var audioMode = false;
document.addEventListener("keydown", event => {
  //console.log(event);
  if (event.code == "Space") {
    audioMode = !audioMode;
    console.log(audioMode);

    if (audioMode) {
      navigator.getUserMedia(
        {
          audio: true
        },
        stream => {
          recordAudio = RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm",
            sampleRate: 44100,
            desiredSampRate: 16000,
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1
          });
          recordAudio.startRecording();
        },
        error => {
          console.error(JSON.stringify(error));
        }
      );
    } else {
      recordAudio.stopRecording(_ => {
        recordAudio.getDataURL(audioDataURL => {
          var files = {
            audio: {
              type: recordAudio.getBlob().type || "audio/wav",
              dataURL: audioDataURL,
              id: socket.id
            }
          };
          socket.emit("audio-data", files);
        });
      });
    }
  }
});

// PLAY FEED
socket.on("audio-feed", data => {
  console.log(data);
  console.log(data.audio.dataURL);
  var audio = document.getElementById(data.audio.id+"++audio");
  console.log(audio);
  audio.src = data.audio.dataURL;
  audio.oncanplaythrough = () => {
    audio.play();
  };
});
