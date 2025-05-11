import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

function ChatContainer() {
  const authUser = useAuthStore((state) => state.authUser);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const getMessages = useChatStore((state) => state.getMessages);
  const messages = useChatStore((state) => state.messages);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);
  const [message, setMessage] = useState({ message: "", image: "" });

  const sendMessage = async () => {
    const userID = authUser._id;
    await useChatStore.getState().sendMessage(userID, message);
    setMessage({ ...message, message: "" });
    getMessages(userID, selectedUser._id);
  };

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(authUser._id, selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  if (!selectedUser) return null;

  return (
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
        <p className="text-white font-semibold text-lg">{selectedUser.name}</p>
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
          onChange={(e) => setMessage({ ...message, message: e.target.value })}
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
  );
}

export default ChatContainer;
