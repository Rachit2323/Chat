import React, { useEffect, useState } from "react";
import { TiGroupOutline } from "react-icons/ti";
import fake from "../../Image/fake.png";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

import { useSelector, useDispatch } from "react-redux";
import { fetchChat } from "../../Reducers/Chat.js";
import { IoCloseOutline } from "react-icons/io5";
import { allUserList, createGroup } from "../../Reducers/Chat.js";
import Message from "./Message.js";
import { userInfo } from "../../Reducers/auth.js";
import { accessChat } from "../../Reducers/Chat.js";

import io from "socket.io-client";
const END = "http://localhost:4000";
var socket;

const Dash = () => {
  const [allChat, setAllChat] = useState([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [grouptChatName, setGroupChatName] = useState(false);
  const [chatName, setChatName] = useState("");
  const [user, setUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsersSearch, setFilteredUsersSearch] = useState([]);

  const dispatch = useDispatch();
  const {
    fetchChatSuccess,
    allchat,
    allUser,
    allUserSuccess,
    createGroupData,
    createGroupSuccess,
  } = useSelector((state) => state.chat);

  const { userInfoSuccess, userdetail } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchChat());
    dispatch(allUserList());
    dispatch(userInfo());
  }, []);

  useEffect(() => {
    if (fetchChatSuccess) {
      console.log("chats", allChat);
      setAllChat(allchat);
    }
  }, [fetchChatSuccess]);

  const [socketConnectd, setSocketConnected] = useState(false);
  useEffect(() => {
    socket = io(END);
    socket.emit("setup", userdetail);
    socket.on("connection", () => setSocketConnected(true));
  }, [userInfoSuccess]);

  const [messageSection, setMessageSection] = useState(false);
  const [userSelected, setUserSelected] = useState(null);
  const [searchUser, setSearchUser] = useState(false);

  const selectedChat = (index, chat) => {
    setSelectedChatIndex(index);

    setUserSelected(chat);
    setMessageSection(true);
  };

  const handleGroup = () => {
    setGroupChatName(!grouptChatName);
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

  const createGroupChat = () => {
    console.log(selectedUsers, selectedUsersId, chatName);
    dispatch(createGroup({ selectedUsers, selectedUsersId, chatName }));
  };

  useEffect(() => {
    setFilteredUsers(allUser?.map((user) => user.name));
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

  const handleUserSearch = (value) => {

    const filtered = allUser.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsersSearch(filtered);
  };

  const handleMakeChat = (userId) => {
    dispatch(accessChat(userId));
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    handleUserSearch(e.target.value);
    setSearchUser(!searchUser);
  };


  return (
    <>
      <div className="flex w-screen h-screen fixed">
        <div className="w-1/4 border-r border-gray-200 flex ">
          <div className="p-4 h-full flex flex-col items-center justify-center w-1/4 border-r border-gray-400">
            <div className="flex items-center w-full h-full gap-4 flex-col mb-4 mt-4 justify-center ">
              <TiGroupOutline
                className="w-[30px] h-[30px] cursor-pointer"
                onClick={() => handleGroup()}
              />
              <img
                src={fake}
                className="w-10 h-10 rounded-full cursor-pointer transform transition-transform hover:scale-110"
              />

              <IoHomeOutline className="w-[30px] h-[30px] cursor-pointer" />
              <FaRegMessage className="w-[30px] h-[30px] cursor-pointer" />
            </div>
            <div className="flex justify-between flex-col gap-5">
              <IoSettingsOutline className="w-[30px] h-[30px] cursor-pointer" />
              <CiLogout className="w-[30px] h-[30px] cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-col h-full w-3/4">
            <div className="p-4 flex flex-col relative">
              <h3 className="text-lg font-semibold mb-2">Chats</h3>
              <input
                type="text"
                className="w-full py-2 px-4 border border-gray-300 rounded mb-2"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
              />
              {searchUser && (
                <ul className="absolute top-[68%] bg-gray-100 border w-[89%] border-gray-300 divide-y divide-gray-300 rounded py-1 px-1  cursor-pointer text-sm">
                  {filteredUsersSearch.map((user) => (
                    <li
                      key={user._id}
                      className="py-1"
                      onClick={() => handleMakeChat(user._id)}
                    >
                      {user.name} - {user.email}
                    </li>
                  ))}
                </ul>
              )}

              <span className="text-sm text-gray-500">
                Sort by: <strong className="text-blue-500">Newest</strong>
              </span>
            </div>
            <div className="p-2">
              <div className="flex flex-col gap-4">
                {allChat.map((chat, index) => (
                  <div
                    key={index}
                    className={`p-2 flex rounded items-center justify-center gap-2 cursor-pointer ${
                      selectedChatIndex === index ? "bg-blue-100" : ""
                    }`}
                    onClick={() => selectedChat(index, chat)}
                  >
                    <img
                      src={fake}
                      className="w-[65px] h-[65px] rounded-full"
                    />
                    <div className="w-1/2">
                      <h5 className="text-xl font-semibold">
                        {chat?.chatName}
                      </h5>
                      <p className="text-lg text-gray-500">
                        {chat?.latestMessage?.content}
                      </p>
                    </div>
                    <strong className="w-1/4 text-gray-500">
                      {chat?.createdAt?.slice(11, 16)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {messageSection && <Message userList={userSelected} />}

        {grouptChatName && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-400 bg-gray-200 p-4 rounded-lg">
            <div className="">
              <h2 className="flex justify-between items-center">
                Create a Chat Group
                <IoCloseOutline
                  className="cursor-pointer"
                  onClick={() => handleGroup()}
                />
              </h2>
              <div className="input-group mb-4">
                <label htmlFor="chatName" className="block font-semibold mb-1">
                  Chat Name:
                </label>
                <input
                  type="text"
                  id="chatName"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="w-full py-2 px-4 border border-gray-300 rounded"
                />
              </div>
              <div className="input-group mb-4">
                <label htmlFor="user" className="block font-semibold mb-1">
                  User:
                </label>
                <input
                  type="text"
                  id="user"
                  value={selectedUsers.join(", ")}
                  onChange={handleUserInputChange}
                  onClick={() => handleInputClick()}
                  onKeyDown={handleKeyDown}
                  className="w-full py-2 px-4 border border-gray-300 rounded"
                />
                {showUserList && (
                  <ul className="user-suggestions">
                    {filteredUsers.map((filteredUser, index) => (
                      <li
                        key={index}
                        onClick={() => handleUserSelection(filteredUser)}
                        className="cursor-pointer py-2 px-4 hover:bg-gray-100"
                      >
                        {filteredUser}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => createGroupChat()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dash;
