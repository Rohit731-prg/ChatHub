import { create } from "zustand";
import axios from "../Components/utils/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isUserLogin: false,
  socket: null,
  isActive: null,

  setIsActive: (id) => set({ isActive: id }),

  setUserDetails: async (data) => {
    try {
      const res = await axios.post("http://localhost:2000/api/user/login", data);
      toast.success(res.data.message);
      set({
        authUser: res.data.userDetails,
        isUserLogin: true,
      });
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.log("Error from login", error);
    }
  },

  connectSocket: () => {
    const { isUserLogin } = get();
    if (!isUserLogin) return;

    console.log("socket connected, userID : ", get().authUser._id);

    const socket = io("http://localhost:2000", {
      withCredentials: true,
      query: {
        userID: get().authUser._id,
      }
    });
    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },

  setUserPassword: async (data) => {
    try {
      const res = await axios.post("http://localhost:2000/api/user/resetPassword", data);
      toast.success(res.data.message);
      set({
        authUser: {
          ...get().authUser,
          password: data.newPassword,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password reset failed");
      console.log("Error from password reset", error);
    }
  },

  setUploadProfilePic: async (data) => {
    try {
      const res = await axios.put("http://localhost:2000/api/user/uploadImage", data);
      toast.success(res.data.message);
      set({
        authUser: {
          ...get().authUser,
          profilePic: res.data.imageUrl,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Image upload failed");
      console.log("Error from image upload", error);
    }
  },

  logoutUser: async () => {
    try {
      const res = await axios.get("http://localhost:2000/api/user/logout", { withCredentials: true });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Logout failed");
      console.log("Logout error:", error);
    } finally {
      get().disconnectSocket();
      set({ authUser: null, isUserLogin: false, socket: null });
    }
  },

  getUserDetailsByCookie: async () => {
    try {
      const user = await axios.post("http://localhost:2000/api/user/loginWtithAuth", {}, { withCredentials: true });
      set({ isUserLogin: true, authUser: user.data.userDetails });
      get().connectSocket();
      return user.data.userDetails;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
}));

export default useAuthStore;
