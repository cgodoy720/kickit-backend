
const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const server = app.listen("8080", () => {
  console.log("Server Running on Port 8080...");
});

const eventsController = require("./controllers/EventsController"); 

const categoryController = require("./controllers/categoriesController")

const userController = require("./controllers/usersController")

const friendsController = require("./controllers/friendsController")
// MIDDLEWARE
// app.use(cors());
// app.use(express.json());


// ROUTES
app.get('/', (req, res) => {
    // res.send('Welcome to Team 2 - Capstone Project')
    res.json({ message: 'Welcome to Team 2 - Capstone Project'})
});

app.use("/events", eventsController);

app.use("/category", categoryController)

app.use("/users", userController)

app.get('*', (req, res) => {
    res.status(404).send('Not Found')
});


// io = socket(server);
const io = require("socket.io")(server, {
	cors: {
	  origin: "http://localhost:3000",
	  methods: ["GET", "POST"],
	  allowedHeaders: ["my-custom-header"],
	  credentials: true
	}
  });

io.on("connection", (socket) => {
  console.log(socket.id);
console.log('a user connected')
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User Joined Room: " + data);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data.content);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

