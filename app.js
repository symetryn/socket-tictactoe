const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

app.use(express.static("public"));
app.use("/media", express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  console.log();
  res.sendFile(path.join(__dirname + "/index.html"));
  //__dirname : It will resolve to your project folder.
});

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(process.env.PORT || 4000);
// let server = app.listen(process.env.PORT || 4000, () => {
//   console.log("server is running on port", server.address().port);
// });
// const io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("new User");
  //   socket.emit("game-state", { player: "1" });
  socket.on("send-current-grid", grid => {
    console.log(grid);
    socket.broadcast.emit("game-state", grid);
  });
});
