const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
const { addUsers, removeUsers, getUser, getUsersInRoom } = require("./users");
const router = require("./router");
const PORT = process.env.PORT || 5000;
app.use(router);

io.on("connection", (socket) => {
  const id = socket.id;
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUsers({ id, name, room });
    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, Welcome to room ${room}`,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined room${room}`,
    });
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  // send messages ny ordinary user
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    // replace to with in
    if (user) {
      io.to(user.room).emit("message", { user: user.name, text: message });
      callback();
    } else {
      console.log("46 error");
    }
  });

  // work when user disconnect
  socket.on("disconnect", ({ name, room }) => {
    const user = removeUsers(id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left the room`,
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`app is listening on ${PORT}`));
