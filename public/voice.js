// record audio here
let recordAudio;

// AUDIO FUNCTIONALITY
// toggle audio variable
var audioMode = false;
// when the user presses "Space" toggle the record and send audio commands
document.addEventListener("keydown", event => {
  if (event.code == "Space") {
    audioMode = !audioMode;
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
          console.error(error);
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


socket.on("audio-feed", data => {
  var audio = document.getElementById(data.audio.id + "++audio");
  if (audio) {
    audio.src = data.audio.dataURL;
    audio.oncanplay = () => {
      var sound = document.getElementById(data.audio.id+"++sound");
      if (sound) {
        console.log("found the a-sound");
        AFRAME.utils.entity.setComponentProperty(
          sound,
          "src",
          data.audio.dataURL
        ); 
        sound.addEventListener("sound-loaded", _ =>{
          sound.components.sound.playSound();
        });
        sound.addEventListener("sound-ended", _ => {
          sound.components.sound.stopSound();
        });
      }
    };
  }
});
