import React, { useEffect, useState, useRef } from "react";
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
  fetchChat,
} from "../../Reducers/Chat.js";
import { userInfo } from "../../Reducers/auth.js";
import socketIo from "socket.io-client";
import { jwtDecode } from "jwt-decode";

import ScrollToBottom from "react-scroll-to-bottom";
const END = "http://localhost:4000/";

const Message = ({ userListData, chatNameSelected, setMessageSection }) => {
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
    RemoveusercreateGroupSuccess,
    RemoveusercreateGroupData,
    AddusercreateGroupSuccess,
    AddusercreateGroupData,
  } = useSelector((state) => state.chat);

  const [chatId, setChatId] = useState(null);
  const [user, setUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [message, setMessage] = useState("");
  const [groupInformationShow, setGroupInformationShow] = useState(false);
  const [activeUser, setActiveUser] = useState();
  const [userDetailsId, setuserDetailsId] = useState();
  const [allUserMessage, setAllUserMessage] = useState([]);

  const [userList, setUserList] = useState(userListData);
  useEffect(() => {
    dispatch(userInfo());
  }, []);

  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          return userId;
        } catch (error) {}
      }
    };

    const userIdFromToken = getUserIdFromToken();

    setActiveUser(userIdFromToken);
  }, []);

  const { userInfoSuccess, userdetail } = useSelector((state) => state.user);

  const socket = socketIo(END, { transports: ["websocket"] });

  useEffect(() => {
    socket.on("connect", () => {});
    return () => {};
  }, []);

  useEffect(() => {
    setUserList(userListData);
  }, [userListData]);

  useEffect(() => {
    if (fetchMessageSuccess) {
      // dispatch(fetchAllChat(chatId));
      // console.log(fetchChats);
      const makeSenderObjArray = fetchChats.map((chat) => ({
        senderId: chat.sender._id,
        content: chat.content,
      }));

      setAllUserMessage(makeSenderObjArray);
    }
  }, [fetchMessageSuccess, chatNameSelected, userListData, fetchChats]);

  useEffect(() => {
    if (userList) {
      setChatId(userList._id);
    }
  }, [userList]);

  useEffect(() => {
    if (userInfoSuccess) {
      setuserDetailsId(userdetail._id);
    }
  }, [userInfoSuccess]);

  const sendMessageToEnd = (e) => {
    e.preventDefault();

    socket.emit("sendbackmsg", { message, chatId, userDetailsId });
    dispatch(sendMesageToBack({ content: message, chatId }));
    dispatch(fetchAllChat(chatId));
    setMessage("");
  };

  useEffect(() => {
    socket.on("receivemsg", ({ message, chatId, userDetailsId }) => {
      // dispatch(fetchAllChat(chatId))
      const newMessage = {
        senderId: userDetailsId,
        content: message,
      };
      // console.log(fetchChats);

      setAllUserMessage((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.off();
    };
  }, [allUserMessage, fetchChats]);

  useEffect(() => {
    if (chatId) {
      dispatch(fetchAllChat(chatId));
      // socket.emit("joinchat", { chatId });
    }
  }, [chatId, chatNameSelected, userListData]);

  const groupInformation = () => {
    setGroupInformationShow(true);
  };
  const dispatch = useDispatch();
  const handlecloseModal = () => {
    setGroupInformationShow(false);
  };

  const handleUserRemove = (userId) => {
    dispatch(RemoveusercreateGroup({ userId, chatId }));
    dispatch(fetchChat());
  };

  useEffect(() => {
    dispatch(fetchChat());
  }, [userList]);

  const AddUserGroup = () => {
    dispatch(AddusercreateGroup({ userId: selectedUsers, chatId }));
    setGroupInformationShow(false);
    setSelectedUsers([]);
  };

  const handleUserInputChange = (e) => {
    const input = e.target.value;
    setUser(input);

    setShowUserList(false);
  };

  useEffect(() => {
    if (allUser) {
      setFilteredUsers(
        allUser.map((user) => ({ id: user._id, name: user.name }))
      );
    }
  }, [allUser]);

  const handleInputClick = () => {
    setShowUserList(true);
  };

  const handleUserSelection = (selectedUser) => {
    const selectedUserData = allUser.find(
      (user) => user.id === selectedUser.id && user.name === selectedUser.name
    );

    setSelectedUsers(selectedUser);

    setFilteredUsers(
      filteredUsers.filter((user) => user.id !== selectedUser.id)
    );
  };

  useEffect(() => {
    if (AddusercreateGroupSuccess) {
      setUserList(AddusercreateGroupData);
    }
  }, [AddusercreateGroupSuccess]);

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

  useEffect(() => {
    if (RemoveusercreateGroupSuccess) {
      setUserList(RemoveusercreateGroupData);
      setGroupInformationShow(false);
    }
  }, [RemoveusercreateGroupSuccess]);

  const closeMessages = () => {
    setMessageSection(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 w-full lg:w-full h-full relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img src={fake} className="w-8 h-8 mr-2" alt="User" />
            <div>
              <h4 className="font-bold">{chatNameSelected}</h4>
              <p>Online</p>
            </div>
          </div>
          <span className="flex gap-2 justify-center items-center ">
            {userListData.isGroupChat && (
              <IoIosInformationCircle
                onClick={() => groupInformation()}
                className="w-[30px] h-[30px] cursor-pointer "
              />
            )}
            <IoCloseOutline
              className="cursor-pointer  w-[30px] h-[30px]"
              onClick={() => closeMessages()}
            />
          </span>
        </div>
        <div className="overflow-y-auto max-h-[635px] h-[100%] gap-3 flex w-full flex-col scrollbar-hide">
          <ScrollToBottom
            checkInterval={17}
            initialScrollBehavior="auto"
            atEnd={true}
            atBottom={true}
            sticky={true}
            mode="bottom"
            className="gap-2 flex flex-col border border-gray-300 pt-2 h-full w-full"
          >
            {allUserMessage?.map((message, idx) => (
              <div
                key={idx}
                className={`px-2 py-2 w-[170px] rounded-lg ${
                  message?.senderId === activeUser
                    ? "bg-green-500 text-white"
                    : "bg-blue-200"
                }`}
                style={{
                  marginLeft: message?.senderId === activeUser ? "83%" : "1%",
                  marginBottom: "4px",
                }}
              >
                {message?.content}
              </div>
            ))}
          </ScrollToBottom>
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
            onClick={sendMessageToEnd}
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
              {userList.users?.map((user, index) => (
                <div
                  key={index}
                  className="bg-gray-300 rounded-md p-1 mr-1 mb-1 flex items-center"
                >
                  <span>{user?.name}</span>
                  <button
                    onClick={() => handleUserRemove(user?._id)}
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
              // value={selectedUsers?.map((user) => user?.name).join(", ")}
              value={selectedUsers.name}
              onChange={handleUserInputChange}
              onClick={() => handleInputClick()}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => AddUserGroup()}
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
            >
              Update
            </button>
            {showUserList && (
              <ul className="user-suggestions mt-2">
                {filteredUsers.map(
                  (filteredUser, index) =>
                    filteredUser.id !== userdetail._id &&
                    !userList.users.some(
                      (user) => user._id === filteredUser.id
                    ) && (
                      <li
                        key={index}
                        onClick={() => handleUserSelection(filteredUser)}
                        className="cursor-pointer py-2 px-4 hover:bg-gray-100"
                      >
                        {filteredUser.name}
                      </li>
                    )
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Message;
