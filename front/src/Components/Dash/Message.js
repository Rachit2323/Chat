import React, { useEffect, useState } from "react";
import "./Dash.css";
import "./Message.css";
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
const END = "http://localhost:4000";
var socket;
const Message = ({ userList }) => {
  const {
    fetchChatSuccess,
    allchat,
    allUser,
    allUserSuccess,
    createGroupData,
    createGroupSuccess,
    fetchChats,
    fetchMessageSuccess,
  } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(userInfo());
  }, []);
  const [allUserMessage, setAllUserMessage] = useState([]);

  useEffect(() => {
    if (fetchMessageSuccess) {
      setAllUserMessage(fetchChats);
    }
  }, [fetchMessageSuccess]);
  const { userInfoSuccess, userdetail } = useSelector((state) => state.user);

  const [socketConnectd, setSocketConnected] = useState(false);
  console.log(userdetail);
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
    console.log("running");
    dispatch(fetchAllChat(chatId));
  }, [chatId]);

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
    console.log(userId, selectedUsersId);

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


  return (
    <div className="right_all_message">
      <div className="right_top_bar">
        <section>
          <span>
            <img src={fake} />
            <strong>
              <h4>{userList.chatName}</h4>
              <p>Online</p>
            </strong>
          </span>
          <IoIosInformationCircle onClick={() => groupInformation()} />
        </section>

        <IoCloseSharp />
      </div>
      <div className="message_section">
    
        <ScrollableFeed className="message_alligned" style={{ height:'100%' }}>
          {allUserMessage.map((message) => (

            <div key={message._id}  style={{ 
              backgroundColor: message.sender?._id === userdetail._id ? "green" : "skyblue",
              border: message.sender?._id === userdetail._id ? "2px solid green" : "2 px solid skyblue",
              marginLeft: message.sender?._id === userdetail._id ? "86%" : "1%"
            }} className="message_send">
              {message.content}
            </div>

          ))}
        </ScrollableFeed>
      </div>
      <div className="input_message">
        <CiLink style={{ color: "rgba(0, 0, 0, 0.45)" }} />
        <input
          placeholder="Type your Message here ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <IoSendSharp
          style={{ color: "green" }}
          onClick={() => sendMessageToEnd()}
        />
      </div>
      {groupInformationShow && (
        <div className="information_table_outer">
          <span onClick={() => handlecloseModal()}>
            <IoCloseOutline />
          </span>

          <label htmlFor="members">Members:</label>
          <div className="members">
            {userList.users.map((user, index) => (
              <div key={index} className="member">
                <span>{user.name}</span>
                <button onClick={() => handleUserRemove(user._id)}>X</button>
              </div>
            ))}
          </div>
          <label htmlFor="addUser">Add User:</label>
          <input
            type="text"
            id="addUser"
            placeholder="Enter username"
            value={selectedUsers.join(", ")}
            onChange={handleUserInputChange}
            onClick={() => handleInputClick()}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => AddUserGroup(user)}>Update</button>
          {showUserList && (
            <ul className="user-suggestions">
              {filteredUsers.map((filteredUser, index) => (
                <li
                  key={index}
                  onClick={() => handleUserSelection(filteredUser)}
                >
                  {filteredUser}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
