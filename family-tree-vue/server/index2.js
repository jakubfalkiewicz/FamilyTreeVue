const express = require("express");
const http = require("http");
const Server = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = Server(server, {
  cors: {
    origin: "*",
  },
});

const workspaces = io.of(/^\/\w+$/);

workspaces.on("connection", async (socket) => {
  console.log("someone connected");
  const workspace = socket.nsp;
  const name = workspace.name;
  console.log(name);
  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });
});

const port = 3000;
server.listen(port);
console.log(`API server listening at http://localhost:${port}`);
