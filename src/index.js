const path = require("path");
const helmet = require("helmet");
const http = require("http");
// const https = require("https");
// const fs = require("fs");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const socketio = require("socket.io");
const Filter = require("bad-words");
const redis = require("redis");
const connectRedis = require("connect-redis");

const env = require("./config");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./app/utils/users");

const {
  generateMessage,
  generateLocationMessage,
} = require("./app/utils/messages");

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function () {
  console.log("Connected to redis successfully");
});

const app = express();
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: env.session_secret,
    name: env.session_name,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 10, // session max age in miliseconds
    },
  })
);

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const server = http.createServer(app);

// const server =
//   env.node_env === "development"
//     ? http.createServer(app)
//     : https.createServer(
//         {
//           key: fs.readFileSync(env.key),
//           cert: fs.readFileSync(env.cert),
//           // passphrase: env.pass,
//         },
//         app
//       );

const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New websocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessageFromClient", (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity allowed soon!!!");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMsg",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left =(`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

export { server };
