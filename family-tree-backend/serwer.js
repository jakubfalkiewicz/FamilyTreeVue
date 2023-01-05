require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());
app.options("*", cors()); // include before other routes
// const session = require("express-session");
// const User = require("./models/User");
// const axios = require("axios");
// const Room = require("./models/Room");
const mongoose = require("mongoose");

app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const dbConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "projekt-vue-mongo",
};

const db_url = `mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`;

// Dodajemy usługi REST, które należy zdefiniować w pliku „users.js”
// znajdującym się w podkatalogu „routes”
const users = require("./routes/users");
const roomsAPI = require("./routes/rooms");

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/api/users", users);
app.use("/api/rooms", roomsAPI);

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));

const apiPort = process.env.PORT || 4000;
const apiHost = process.env.API_HOST || "localhost";

const server = app.listen(apiPort, () => {
  console.log(`API server available from: http://${apiHost}:${apiPort}`);
});

// const io = require("socket.io")(server);

// const rooms = io.of(/^\/rooms\/\w+$/).on("connection", (socket) => {
//   const { name } = socket.nsp;
//   socket.on("message", async (message, author) => {
//     if (!message) return;
//     const users = await axios
//       .get("http://localhost:3000/api/users/")
//       .then((response) => response.data);
//     const sender = users.filter((el) => el._id == author)[0].login;
//     const roomId = name.split("/")[2];
//     const dbRoom = await Room.findById(roomId);
//     dbRoom.messages.push({ author: sender, message: message });
//     await dbRoom.save();
//     socket.broadcast.emit("message", { sender, message });
//   });
// });

// app.io = io;
