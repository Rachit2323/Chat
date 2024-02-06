import React, { useEffect, useState } from "react";
import "./Dash.css";
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

  const dispatch = useDispatch();
  const {
    fetchChatSuccess,
    allchat,
    allUser,
    allUserSuccess,
    createGroupData,
    createGroupSuccess,
  } = useSelector((state) => state.chat);



  useEffect(() => {
    dispatch(fetchChat());
    dispatch(allUserList());
  }, []);

  useEffect(() => {
    if (fetchChatSuccess) {
      setAllChat(allchat);
    }
  }, [fetchChatSuccess]);

  const [messageSection, setMessageSection] = useState(false);
  const [userSelected, setUserSelected] = useState(null);

  const selectedChat = (index, chat) => {
    console.log("chat", chat);
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
    <>
      <div className="dash_container_outer">
        <div className="left_all_profile">
          <div className="setting_profile">
            <section>
              <TiGroupOutline onClick={() => handleGroup()} />
              <img src={fake} />
              <IoHomeOutline />
              <FaRegMessage />
            </section>

            <section>
              <IoSettingsOutline />
              <CiLogout />
            </section>
          </div>
          <div className="all_profile">
            <h3>Messages</h3>
            <input type="text" placeholder="Search" />
            <span>
              Sort by: <strong>Newest</strong>
            </span>

            <div className="profile_name_section">
              {allChat.map((chat, index) => (
                <section
                  key={index}
                  onClick={() => selectedChat(index, chat)}
                  style={{
                    backgroundColor:
                      selectedChatIndex === index ? "skyblue" : "white",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <img src={fake} />
                  <span>
                    <h5>{chat?.chatName}</h5>
                    <p>{chat?.latestMessage?.content}</p>
                  </span>
                  <strong>
                    <p>{chat?.createdAt?.slice(11, 16)}</p>
                  </strong>
                </section>
              ))}
            </div>
          </div>
        </div>

        {messageSection && <Message userList={userSelected} />}

        {grouptChatName && (
          <div className="complete_section_for_group">
            <div className="chat-box">
              <h2>
                Create a Chat Group{" "}
                <span>
                  <IoCloseOutline onClick={() => handleGroup()} />
                </span>{" "}
              </h2>
              <div className="input-group">
                <label htmlFor="chatName">Chat Name:</label>
                <input
                  type="text"
                  id="chatName"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="user">User:</label>
                <input
                  type="text"
                  id="user"
                  value={selectedUsers.join(", ")}
                  onChange={handleUserInputChange}
                  onClick={() => handleInputClick()}
                  onKeyDown={handleKeyDown}
                />
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
              <button onClick={() => createGroupChat()}>Create</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dash;
