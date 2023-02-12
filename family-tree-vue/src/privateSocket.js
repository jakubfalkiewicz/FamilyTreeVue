import { io } from "socket.io-client";

const URL = "http://localhost:3000/chat/private";
const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
const privateSocket = io(URL, { auth: { userId: loggedUser._id } });

privateSocket.onAny((event, ...args) => {
  console.log(event, args);
});

// socket.on("message", (message, author) => {
//   console.log("GOT MESSAGE FROM SERVER" + message);
// });

privateSocket.on("private message", ({ content, to }) => {
  console.log("GOT PRIVATE MESSAGE " + content);
});

export default privateSocket;
