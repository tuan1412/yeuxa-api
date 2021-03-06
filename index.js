const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const config = require("./config-local.json");
const background = require("./background");

const userRouter = require("./modules/api/users/router");
const authRouter = require("./modules/api/auth/router");
const friendRouter = require("./modules/api/friend/router");
const roomRouter = require("./modules/api/room/router");

mongoose.connect(
  config.mongoPath,
  err => {
    if (err) console.error(err);
    else console.log("Database connect successful");
  }
);

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );

  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.secureCookie,
      maxAge: 12 * 60 * 60 * 1000
    }
  })
);

const roomsOnline = {};

io.on("connection", socket => {
  socket.on("online", data => {
    socket.username = data.username;
    const room = data.room;
    socket.room = room;
    socket.join(room);

    background(data.place.city)
      .then(res => {
        if (roomsOnline[room] === undefined) {
          roomsOnline[room] = [
            { username: data.username, place: res, location: data.place }
          ];
        } else {
          roomsOnline[room] = roomsOnline[room].filter(
            user => user.username !== data.username
          );
          roomsOnline[room].push({
            username: data.username,
            place: res,
            location: data.place
          });
        }
        io.in(room).emit("loveOnline", roomsOnline[room]);
      })
      .catch(e => {
        if (roomsOnline[room] === undefined) {
          roomsOnline[room] = [{ username: data.username, place: {} }];
        } else {
          roomsOnline[room] = roomsOnline[room].filter(
            user => user.username !== data.username
          );
          roomsOnline[room].push({ username: data.username, place: {} });
        }
        io.in(room).emit("loveOnline", roomsOnline[room]);
      });
  });

  socket.on("message", message => {
    socket.to(socket.room).emit("loveMessage", message);
  });

  socket.on("changeNumber", number => {
    socket.to(socket.room).emit("changeNumber", number);
  })

  socket.on("disconnect", () => {
    if (!roomsOnline[socket.room]) return;
    roomsOnline[socket.room].splice(
      roomsOnline[socket.room].findIndex(
        user => user.username === socket.username
      ),
      1
    );
    io.in(socket.room).emit("loveOffline");
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/friend", friendRouter);
app.use("/api/room", roomRouter);

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

const port = process.env.PORT || 9000;

server.listen(port, err => {
  if (err) console.log(err);
  console.log(`Server started at port ${port}`);
});
