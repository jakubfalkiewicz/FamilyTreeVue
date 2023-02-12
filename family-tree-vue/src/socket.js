import { io } from "socket.io-client";

const URL = "http://localhost:3000/chat/public";
const socket = io(URL);

socket.onAny((event, ...args) => {
  console.log(event, args);
});

// socket.on("message", (message, author) => {
//   console.log("GOT MESSAGE FROM SERVER" + message);
// });

socket.on("private message", ({ content, to }) => {
  console.log("GOT PRIVATE MESSAGE " + content);
});

export default socket;
