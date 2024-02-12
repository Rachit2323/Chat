import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { CiLink } from "react-icons/ci";
import { IoSendSharp } from "react-icons/io5";
import fake from "../../Image/fake.png";
import { IoIosInformationCircle } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import {
  RemoveusercreateGroup,
  AddusercreateGroup,
  sendMesageToBack,
  fetchAllChat,
} from "../../Reducers/Chat.js";
import { userInfo } from "../../Reducers/auth.js";
import io from "socket.io-client";
import ScrollableFeed from "react-scrollable-feed";
import { useNavigate } from "react-router-dom";
import EmptyScreen from "./Emptyscreen.js";
const END = "http://localhost:4000";
var socket;
const Message = ({ userList,chatNameSelected }) => {
  const {
    fetchChatSuccess,
    allchat,
    allUser,
    allUserSuccess,
    createGroupData,
    createGroupSuccess,
    fetchChats,
    fetchMessageSuccess,
    sendMesageToBackData,
    sendMesageToBackSuccess,
  } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(userInfo());
  }, []);

  const [allUserMessage, setAllUserMessage] = useState([]);

  const naviagte = useNavigate();

  useEffect(() => {
    if (fetchMessageSuccess) {
      setAllUserMessage(fetchChats);
    }
  }, [fetchMessageSuccess]);
  const { userInfoSuccess, userdetail } = useSelector((state) => state.user);

  const [socketConnectd, setSocketConnected] = useState(false);
  useEffect(() => {
    socket = io(END);
    socket.emit("setup", userdetail);
    socket.on("connection", () => setSocketConnected(true));
  }, [userInfoSuccess]);

  const [chatId, setChatId] = useState(null);
  const [user, setUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userList) {
      setChatId(userList._id);
    }
  }, [userList]);

  const sendMessageToEnd = () => {
    dispatch(sendMesageToBack({ content: message, chatId }));
    setMessage("");
  };
  useEffect(() => {
    if (sendMesageToBackSuccess) {
      socket.emit("new message", sendMesageToBackData);
    }
  }, [sendMesageToBackSuccess]);

  useEffect(() => {
    dispatch(fetchAllChat(chatId));
    socket.emit("join chat", chatId);
  }, [chatId]);

  useEffect(() => {
    socket.on("message recived", (newMessage) => {
      dispatch(fetchAllChat(chatId));
      setAllUserMessage([...allUserMessage, newMessage]);
    });
  });

  const [groupInformationShow, setGroupInformationShow] = useState(false);

  const groupInformation = () => {
    setGroupInformationShow(true);
  };
  const dispatch = useDispatch();
  const handlecloseModal = () => {
    setGroupInformationShow(false);
  };

  const handleUserRemove = (userId) => {
    dispatch(RemoveusercreateGroup({ userId, chatId }));
  };

  const AddUserGroup = (userId) => {
    dispatch(AddusercreateGroup({ userId: selectedUsersId, chatId }));
  };

  const handleUserInputChange = (e) => {
    const input = e.target.value;
    setUser(input);
    setFilteredUsers(
      allUser
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(input.toLowerCase()))
    );
    setShowUserList(true);
  };

  useEffect(() => {
    setFilteredUsers(allUser.map((user) => user.name));
  }, [allUser]);

  const handleInputClick = () => {
    setShowUserList(true);
  };

  const handleUserSelection = (selectedUser) => {
    const selectedUserData = allUser.find((user) => user.name === selectedUser);
    setSelectedUsers([...selectedUsers, selectedUser]);
    setSelectedUsersId([...selectedUsersId, selectedUserData._id]);
    setFilteredUsers(filteredUsers.filter((name) => name !== selectedUser));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      const lastSelectedUser = selectedUsers[selectedUsers.length - 1];
      if (lastSelectedUser) {
        setSelectedUsers(selectedUsers.slice(0, -1));
        setSelectedUsersId(selectedUsersId.slice(0, -1));
        setFilteredUsers([...filteredUsers, lastSelectedUser]);
      } else {
        setUser(user.slice(0, -1));
      }
    }
  };

  const [closeMessagesWindow, setCloseMessageWindow] = useState(true);

  const closeMessages = () => {
    setCloseMessageWindow(false);
  };

  return (
    <>
      {closeMessagesWindow ? (
        <div className="bg-white rounded-lg shadow-md p-4 w-3/4 h-full relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img src={fake} className="w-8 h-8 mr-2" alt="User" />
              <div>
                <h4 className="font-bold">{chatNameSelected}</h4>
                <p>Online</p>
              </div>
            </div>
            <IoIosInformationCircle
              onClick={() => groupInformation()}
              className="w-[30px] h-[30px] cursor-pointer "
            />
          </div>
          <div className="overflow-y-auto max-h-[635px] h-[100%] gap-3 flex w-full flex-col scrollbar-hide">
            <ScrollableFeed className="gap-2 flex flex-col border border-gray-300 pt-2">
              {allUserMessage.map((message) => (
                <div
                  key={message._id}
                  className={`px-2 py-2 w-[170px] rounded-lg ${
                    message.sender?._id === userdetail._id
                      ? "bg-green-500 text-white"
                      : "bg-blue-200"
                  }`}
                  style={{
                    marginLeft:
                      message.sender?._id === userdetail._id ? "83%" : "1%",
                  }}
                >
                  {message.content}
                </div>
              ))}
            </ScrollableFeed>
          </div>
          <div className="flex items-center mt-4">
            <CiLink className="text-gray-500  w-[30px] h-[30px]" />
            <input
              className="flex-grow ml-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2"
              placeholder="Type your Message here ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <IoSendSharp
              className="text-green-500 cursor-pointer ml-2 w-[30px] h-[30px]"
              onClick={() => sendMessageToEnd()}
            />
          </div>
          {groupInformationShow && (
            <div className="mt-4 p-4 bg-gray-200 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span onClick={() => handlecloseModal()}>
                <IoCloseOutline className=" cursor-pointer " />
              </span>

              <label htmlFor="members" className="block mb-2">
                Members:
              </label>
              <div className="flex flex-wrap">
                {userList.users.map((user, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 rounded-md p-1 mr-1 mb-1 flex items-center"
                  >
                    <span>{user.name}</span>
                    <button
                      onClick={() => handleUserRemove(user._id)}
                      className="ml-2 text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="addUser" className="block mt-4 mb-2">
                Add User:
              </label>
              <input
                type="text"
                id="addUser"
                placeholder="Enter username"
                value={selectedUsers.join(", ")}
                onChange={handleUserInputChange}
                onClick={() => handleInputClick()}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 mx-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => AddUserGroup(user)}
                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Update
              </button>
              {showUserList && (
                <ul className="user-suggestions mt-2">
                  {filteredUsers.map((filteredUser, index) => (
                    <li
                      key={index}
                      onClick={() => handleUserSelection(filteredUser)}
                      className="cursor-pointer hover:bg-gray-100 py-1 px-2 rounded-md"
                    >
                      {filteredUser}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <EmptyScreen />
        </>
      )}
    </>
  );
};

export default Message;
