const Chat = require("../models/chat.js");
const User = require("../models/user.js");

const accessChat = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.userId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  const user = await User.findOne({ _id: req.userId });
  const user1 = await User.findOne({ _id: userId });
  console.log("users", user1, user);
  if (isChat.length > 0) {
    res.send({ data: isChat[0], success: true });
  } else {
    var chatData = {
      chatName: `${req.userId}-${user.name},${userId}-${user1.name}`,
      isGroupChat: false,
      users: [req.userId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json({ data: FullChat, success: true });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send({ data: results, success: true });
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.selectedUsersId || !req.body.chatName) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = req.body.selectedUsers.map((user) => user.id);

  users.push(req.userId);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.userId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({ data: fullGroupChat, success: true });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
      //this help to return new update value else it will return old name
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404).json({ success: false, message: "Chat Not Found" });
      return;
    }

    res.json({ success: true, data: removed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToGroup = async (req, res) => {
  try {
    const USERDATA = req.body;

    const userId = USERDATA.userId.id;
    const chatId = USERDATA.chatId;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    }

    res.json({ data: added, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
