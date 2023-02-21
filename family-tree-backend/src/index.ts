import express, { Application } from "express"
import path from "path"
import cors from "cors"
import mongoose, {ConnectOptions} from "mongoose"
import initializePassport from "./config/passportConfig"
import passport from "passport"
import cookieParser from "cookie-parser"
import credentials from "./middleware/credentials"
import session from "express-session"
import https from "https"
import fs from "fs"
require("dotenv").config();

// app.use(cors());
// app.options("*", cors());
const app: Application = express();

app.use(cookieParser());
app.use(credentials);
app.use(
  cors({
    origin: ["https://127.0.0.1:5173", "https://127.0.0.1:5173/"],
    credentials: true,
  })
);
app.use(express.json());

initializePassport(passport);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
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
  } as ConnectOptions)
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));

const apiPort = process.env.PORT || 4000;
const apiHost = process.env.API_HOST || "localhost";

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../cert/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../cert/cert.pem")),
  },
  app
);

server.listen(apiPort, () => {
  console.log(`API server available from: https://${apiHost}:${apiPort}`);
});

// const io = require("socket.io")(server);

// const rooms = io.of(/^\/rooms\/\w+$/).on("connection", (socket) => {
//   console.log(socket.nsp.name);
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
