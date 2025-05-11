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
  const selectedUser = useChatStore((state) => state.selectedUser);
  const users = useChatStore((state) => state.users) || [];
  const messages = useChatStore((state) => state.messages) || [];
  const getMessages = useChatStore((state) => state.getMessages);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({
    message: "",
    image: "",
  });
  const getMessagesByUser = async (user) => {
    setSelectedUser(user);
    getMessages(authUser._id, user._id);
    console.log("calling subscribe to messages");
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  };

  const sendMessage = async () => {
    const userID = authUser._id;
    useChatStore.getState().sendMessage(userID, message);
    setMessage({ ...message, message: "" });
    getMessages(userID, selectedUser._id);
  };

  useEffect(() => {
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
        <div className="w-3/4 bg-gray-900 rounded-md p-4 flex flex-col h-full">
          {/* Top Bar */}
          <nav className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
            {selectedUser?.profilePic && (
              <img
                src={selectedUser.profilePic}
                className="w-10 h-10 rounded-full object-cover"
                alt="User"
              />
            )}
            <p className="text-white font-semibold text-lg">
              {selectedUser ? selectedUser.name : "Select a user"}
            </p>
          </nav>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs md:max-w-sm break-words px-4 py-2 rounded-lg text-sm ${
                  msg.sender === authUser._id
                    ? "ml-auto bg-green-500 text-white rounded-br-none"
                    : "mr-auto bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="mt-4 flex items-center gap-2">
            <input type="file" className="text-white" />
            <input
              type="text"
              value={message.message}
              placeholder="Type a message"
              onChange={(e) =>
                setMessage({ ...message, message: e.target.value })
              }
              className="flex-1 bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Send
            </button>
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
