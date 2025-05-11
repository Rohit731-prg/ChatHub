import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Sideber from "./Sideber";
import useAuthStore from "../../store/authStore";

function UserDetails() {
  const [isGetDetails, setIsGetDetails] = useState(false);
  const authUser = useAuthStore((state) => state.authUser);

  const checkUser = () => {
    if (authUser) {
      setIsGetDetails(true);
    }
  }

  useEffect(() => {
    checkUser();
  }, [])

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-between">
      <Sideber />
      {isGetDetails ? (
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl h-full flex flex-col items-center gap-6 border border-white/10 w-full ">
          <div className="relative">
            <img
              src={authUser.profilePic}
              alt="User Avatar"
              className="w-28 h-28 rounded-full border-4 border-gray-700 object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition">
              <FaCamera />
            </button>
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-semibold">{authUser.name}</p>
            <p className="text-gray-400 text-sm mt-1">{authUser.email}</p>
          </div>
        </div>
      ) : (
        <div className="text-white">No user details found.</div>
      )}
    </div>
  );
}

export default UserDetails;
