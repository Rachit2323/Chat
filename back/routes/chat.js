const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chat.js");
const authMiddleware = require("../controllers/auth.js");

const router = express.Router();

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchChats);
router.route("/group").post(authMiddleware, createGroupChat);
router.route("/rename").put(authMiddleware, renameGroup);
router.route("/groupremove").put(authMiddleware, removeFromGroup);
router.route("/groupadd").put(authMiddleware, addToGroup);

module.exports = router;
