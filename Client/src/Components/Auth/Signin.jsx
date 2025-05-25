import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const [userData, serUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:2000/api/user/signup",
        userData
      );
      console.log(res);
      toast.success(res.data.message);
      navigate(`/optSignin/${res.data.userDetails._id}`);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error from signup", error);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 text-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <img
            src="https://bcassetcdn.com/public/blog/wp-content/uploads/2022/05/06230258/angry-gorilla-logo-for-sale-by-unom-design-dribbble.png"
            alt="Logo"
            className="w-20 h-20 rounded-full object-cover mb-6 shadow-md"
          />
          <h2 className="text-3xl font-bold mb-8">Sign Up</h2>
        </div>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={userData.name}
            onChange={(e) =>
              serUserData({ ...userData, name: e.target.value })
            }
            className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={userData.email}
            onChange={(e) =>
              serUserData({ ...userData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) =>
              serUserData({ ...userData, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={submitUser}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors py-3 rounded-md text-white font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default Signin;
