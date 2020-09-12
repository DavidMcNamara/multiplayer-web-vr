console.log("This is the Client JS");

// create this client socket
const socket = io();
// store who this client is
var whoami;
// store what room this client is in
var whereami;
// store what hex value this client is
var colorami;
//var webCamFeed;

// video enabled
var enableVideo = false;

// SOCKET LISTENERS AND EMITTERS

socket.emit("joinRoom", { user: socket.id, room: whereami });

// recieve messages from the server
socket.on("message", data => {
  // DEBUG
  console.log(data);
  // process this data
});

// Update the hud
AFRAME.registerComponent("whoami", {
  tick: function() {
    AFRAME.utils.entity.setComponentProperty(this.el, "value", whoami);
  }
});

// Remove any clients from the scene when they disconnect
socket.on("removeUser", data => {
  document.getElementById(data).remove();
});
