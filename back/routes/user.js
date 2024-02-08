const express = require("express");
const app = express.Router();
const userController = require('../controllers/user.js'); 
const authMiddleware=require("../controllers/auth.js");

app.post("/signin", userController.signin);
app.post("/signup", userController.signup);
app.get("/verify/:id",userController.verify);
app.get("/list",authMiddleware,userController.allUsers);
app.get("/userinfo",authMiddleware,userController.userInformation)


module.exports = app;