const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("./config-local.json");
const _ = require("lodash");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const userRouter = require("./modules/api/users/router");
const authRouter = require("./modules/api/auth/router");
const friendRouter = require("./modules/api/friend/router");

mongoose.connect(config.mongoPath, err => {
  if (err) console.error(err);
  else console.log("Database connect successful");
});

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

const sessionMiddleware = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.secureCookie,
    maxAge: 12 * 60 * 60 * 1000
  }
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
}); 

let users = {};

io.on('connection', (socket) => { 
  if (socket.request.session.userInfo) socket.currentuser = socket.request.session.userInfo;
  
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/friend", friendRouter);

app.use(express.static('./public'));

app.get('/', (req,res) => {  
  res.sendFile('./public/index.html');
});

const port = process.env.PORT || 9000;

server.listen(port, err => {
  if (err) console.log(err);
  console.log("Server started at port " + port);
});
