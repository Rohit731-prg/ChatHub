import { useEffect, useState } from "react";
import {IoChatbubbleEllipsesOutline,IoPersonOutline,IoLogOutOutline} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import axios from "../utils/axios";
import toast, { Toaster } from "react-hot-toast";


function Sidebar() {
  const isActive = useAuthStore((state) => state.isActive);
  const setIsActive = useAuthStore((state) => state.setIsActive);
  const authUser = useAuthStore((state) => state.authUser);
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 1, icon: IoChatbubbleEllipsesOutline, nav: `/profile/${authUser._id}` },
    { id: 2, icon: IoPersonOutline, nav: `/UserDetails/${authUser._id}` },
    { id: 3, icon: IoLogOutOutline, nav: "/" },
  ];
  const logout = async () => {
    try {
      const res = await axios.get("http://localhost:2000/api/user/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
      console.log(error);
    }
  };

  const handleNavigate = (id, nav) => {
    if (id === 3) {
      logout();
      return;
    }
    setIsActive(Number(id));
    navigate(nav);
  };

  useEffect(() => {
    console.log(authUser);
  }, [authUser]);

  return (
    <div className="w-20 h-full bg-black flex items-center justify-start flex-col gap-5 py-10">
      {menuItems.map((item) => {
        const buttonClass = `text-white text-2xl ${
          isActive === item.id ? "bg-gray-700 text-black" : ""
        } p-3 rounded-xl`;

        return (
          <button
            key={item.id}
            className={buttonClass}
            onClick={() => handleNavigate(item.id, item.nav)}
            >
            <item.icon />
          </button>
        );
      })}
      {console.log(isActive)}
      <Toaster />
    </div>
  );
}

export default Sidebar;