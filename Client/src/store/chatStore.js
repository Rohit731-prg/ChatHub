import { create } from "zustand";
import toast from "react-hot-toast";
import axios from '../Components/utils/axios';
import useAuthStore from "./authStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch users for chat
  getUsers: async (userID) => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.post(`http://localhost:2000/api/message/getUserForUser/${userID}`);
      console.log(res);
      set({ users: res.data.users });
      console.log(get().users);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch chat messages
  getMessages: async (userID, receiverID) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axios.post(`http://localhost:2000/api/message/getMessages/${userID}`, {
        user: receiverID,
      });
      set({ messages: res.data.messages });
      console.log(get().messages);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a new message
  sendMessage: async (userID, messageData) => {
    console.log(get().selectedUser);
    try {
      const res = await axios.post(`http://localhost:2000/api/message/sendMessage/${userID}`, {
        user: get().selectedUser._id,
        message: messageData.message,
        image: messageData.image,
      });
      set((state) => ({
        messages: [...state.messages, res.data.message],
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    console.log(socket);
    socket.on("newMessage", (newMessage) => {
      console.log(newMessage);
      const isMessageSentFromSelectedUser = newMessage.sender === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  // Set the currently selected user
  setSelectedUser: (user) => {
    console.log(user);
    set({ selectedUser: user });
    console.log(get().selectedUser);
  },
}));
