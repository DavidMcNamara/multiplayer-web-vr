// record audio here
let recordAudio;

// AUDIO FUNCTIONALITY
// toggle audio variable
var audioMode = false;
// when the user presses "Space" toggle the record and send audio commands
document.addEventListener("keydown", event => {
  if (event.code == "Space") {
    audioMode = !audioMode;
    //console.log(audioMode);
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
// this will not be audiable on the senders end as their audio element will not exist
// this audio feed will only be audiable to other clients
socket.on("audio-feed", data => {
  var audio = document.getElementById(data.audio.id + "++audio");
  if (audio) {
    audio.src = data.audio.dataURL;
    //AFRAME.utils.entity.setComponentProperty(audio, "src", data.audio.dataURL);
    
    console.log(audio);
    //audio.play()
    audio.oncanplaythrough = () => {
      audio.play();
    };
    audio.addEventListener("sound-loaded", function(evt){
      
      audio.play();
    });
  }
});