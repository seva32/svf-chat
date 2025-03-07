const path = require("path");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const socketio = require("socket.io");
const Filter = require("bad-words");
const redis = require("redis");
const RedisStore = require("connect-redis").RedisStore;

const env = require("./config.cjs");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./app/utils/users.cjs");

const {
  generateMessage,
  generateLocationMessage,
} = require("./app/utils/messages.cjs");

const redisClient = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

redisClient
  .connect()
  .then(() => console.log("✅ Redis Connected"))
  .catch((err) => console.error("❌ Redis Connection Error:", err));

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

const app = express();
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    store: redisStore,
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
    
    // after updating the bad-words package this started to throw an error
    // const filter = new Filter();

    // if (filter.clean(message)) {
    //   return callback("Profanity allowed soon!!!");
    // }

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

module.exports = { app, server };
