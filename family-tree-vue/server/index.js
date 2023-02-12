const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

let socketMap = {};
const private = io.of("/chat/private").on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  const socketId = socket.id;
  socketMap[userId] = socketId;
  console.log("PRIVATE SOCKETS: ", socketMap);
  function getKeyByValue(value) {
    return Object.keys(socketMap).find((key) => socketMap[key] === value);
  }
  socket.on("private message", ({ content, to }) => {
    console.log("GOT THE MESSAGE");
    socket.to(socketMap[to]).emit("private message", {
      content,
      from: getKeyByValue(socket.id),
    });
  });
  console.log("PRIVATE CONNECTION");
});

const public = io.of("/chat/public").on("connection", (socket) => {
  socket.broadcast.emit("user connected", socket.id);
  let users = [];
  for (let [id, socket] of io.of("/chat/public").sockets) {
    users.push({
      socketId: id,
      userId: socket.userId,
    });
  }
  console.log("PUBLIC USERS: ", users);
  const { name } = socket.nsp;
  socket.on("message", async (message) => {
    socket.broadcast.emit("message", {
      author: message.author,
      message: message.msg,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(3000, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
