// use express
const express = require("express");
// use http
const http = require("http");
// use socketio
const socketio = require("socket.io");
// create the app
const app = express();
// create the server using the http and app
const server = http.createServer(app);
// create io on this sever
const io = socketio(server);

// run when a client connects
io.on("connection", socket => {
  var room = "general";
  // recieve location messages
  socket.on("locationMessage", data => {
    // send the data to every other client in the room
    io.to(room).emit("message", data);
  });

  
  //'#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}
  // when a client is in a room
  socket.on("joinRoom", data => {
    socket.join(room);
    socket.emit("info", { who: socket.id, where: room, color: generateRandomColor()});
    socket.broadcast
      .to(room)
      .emit("message", { user: socket.id, connected: true });
  });
  
  socket.on("update", data => {
    console.log(data);
    io.emit("movePlayers", data);
  });

  // send a disconnection message when a client leaves
  socket.on("disconnect", data => {
    console.log(socket.id + " Disconnected");
    io.emit("message", { user: socket.id, disconnected: true });
    io.emit("removeUser", socket.id);
  });
  
  socket.on("stream-media", data => {
    console.log("stream-media::");
    console.log(data);
  });
  
  // Recieve and Emit Audio to clients
  socket.on("audio-data", data =>{
    io.emit("audio-feed", data);
  })
});


const PORT = 3000 || process.env.PORT;

app.use(express.static(__dirname + "/public"));
server.listen(PORT, _ => console.log("Listening on port " + PORT));

function generateRandomColor(){
  var letters = '0123456789ABCDEF';
  var color = "#";
  for (var i = 0; i < 6; i++)
    color += letters[Math.floor(Math.random() * 16)];
  return color;
}