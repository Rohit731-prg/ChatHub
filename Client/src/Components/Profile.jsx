import React, { useEffect, useState } from "react";
import Sideber from "./ProfilePage/Sideber";
import { Toaster } from "react-hot-toast";
import { IoChatbubbles } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { IoSearchSharp } from "react-icons/io5";
import { useChatStore } from "../store/chatStore";
import useAuthStore from "../store/authStore";

function Profile() {
  const authUser = useAuthStore((state) => state.authUser);
  const getUsers = useChatStore((state) => state.getUsers);
  const users = useChatStore((state) => state.users) || [];
  const messages = useChatStore((state) => state.messages) || [];
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({
    user: '',
    message: '',
    image: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const getMessagesByUser = async (receiverID) => {
    const userID = authUser._id;
    setSelectedUser(receiverID);
    setMessage({ ...message, user: receiverID._id });
    useChatStore.getState().getMessages(userID, receiverID._id);
  };

  const sendMessage = async () => {
    const userID = authUser._id;
    useChatStore.getState().sendMessage(userID, message);
  };

  useEffect(() => {
    console.log(users);
    const userID = authUser._id;
    getUsers(userID);
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-row text-white p-5">
      <Sideber />
      <div className="bg-gray-800 flex flex-col p-3 w-1/4 rounded-md mr-5">
        <p className="text-white font-bold text-3xl mb-5">Chats</p>

        <div className="flex flex-row gap-3 items-center mb-5 bg-black py-1 px-1 border-green-500 border-b-[2px] rounded-md">
          <IoSearchSharp />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
            placeholder="Search for friends"
          />
        </div>

        {users.length > 0 ? (
          users.map((user, index) => (
            <button
              className="hover:bg-gray-700 p-2 rounded-md text-left w-full"
              onClick={() => getMessagesByUser(user)}
              key={user._id || index}
            >
              <div className="flex items-start gap-3 py-2">
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <p className="text-white">{user.name}</p>
              </div>
            </button>
          ))
        ) : (
          <p className="text-gray-400">No users found</p>
        )}
      </div>

      {messages.length > 0 ? (
        <div className="w-3/4 bg-gray-800 rounded-md p-4">
          <nav className="flex items-start gap-3 mb-5">
            {selectedUser && selectedUser.profilePic && (
              <img src={selectedUser.profilePic} className="w-10 h-10" />
            )}
            <p>{selectedUser ? selectedUser.name : "Select a user"}</p>
          </nav>

          <div>
            {messages.map((msg, index) => (
              <p key={index}>{msg.message}</p>
            ))}
          </div>

          <div>
            <input type="file" />
            <input
              type="text"
              value={message.message}
              placeholder="Type a message"
              onChange={(e) => setMessage({ ...message, message: e.target.value })}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="w-3/4 bg-gray-800 flex items-center justify-center rounded-md">
          <div className="flex flex-col items-center">
            <IoChatbubbles className="text-gray-500 text-5xl" />
            <p className="text-2xl text-gray-500 font-semibold my-5">
              ChatHub for Desktop
            </p>
            <p className="text-gray-400">
              Send and receive messages instantly from your desktop — no need to
              keep your phone online.
            </p>
            <p className="flex items-center flex-row gap-2 mt-20 text-gray-300">
              <CiLock />
              End-to-end encrypted
            </p>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}

export default Profile;
