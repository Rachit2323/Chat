const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const userRoutes = require("./routes/user.js");
const chatRoutes = require("./routes/chat.js");
const messageRoutes = require("./routes/message.js");
const cors = require("cors");

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// cloudinary.v2.config({
//   cloud_name: "dyedquiym",
//   api_key: "154218675918319",
//   api_secret: "d_TyO6pmhjEMcj2-CUooPs93bhI",
// });

app.use("/users", userRoutes);
app.use("/chats", chatRoutes);
app.use("/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello, I am here and running!");
});

mongoose
  .connect("mongodb+srv://Rachit23:UhP8Iiyp4xxptvmM@cluster0.fgnb20h.mongodb.net/chat", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const server = app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection",(socket)=>{

  // socket.on("joinchat", ({chatId}) => {
  //   socket.join(chatId);
  //   console.log('room',chatId);
  //   socket.emit("connected");
  // });

  socket.on('sendbackmsg',({message,chatId,userDetailsId})=>{
    // console.log(message,userDetailsId);
    io.emit('receivemsg',{message,chatId,userDetailsId})
  })
})