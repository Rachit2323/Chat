const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/message.js");
const authMiddleware=require("../controllers/auth.js");

const router = express.Router();

router.route("/").get(authMiddleware, allMessages);
router.route("/").post(authMiddleware, sendMessage);

module.exports = router;