import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaUnlock } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import useAuthStore from "../../store/authStore";

function Login() {
  const navigate = useNavigate();
  const setUserDetails = useAuthStore((state) => state.setUserDetails);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handelSubmit = async (e) => {
    e.preventDefault();

    await setUserDetails(userData);
    const { isUserLogin, authUser } = useAuthStore.getState();
    if (isUserLogin) {
      navigate(`/profile/${authUser._id}`);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <img
            src="https://bcassetcdn.com/public/blog/wp-content/uploads/2022/05/06230258/angry-gorilla-logo-for-sale-by-unom-design-dribbble.png"
            alt="Logo"
            className="w-20 h-20 object-cover rounded-full mb-6 shadow-md"
          />
          <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
        </div>

        <form onSubmit={handelSubmit} className="space-y-5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-900 focus-within:ring-2 focus-within:ring-white">
            <MdEmail className="text-xl text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-900 focus-within:ring-2 focus-within:ring-white">
            <FaUnlock className="text-xl text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md text-white font-semibold"
          >
            Log In
          </button>
        </form>

        <div className="flex items-center justify-center gap-3 my-6">
          <div className="w-20 h-px bg-gray-500"></div>
          <span className="text-sm text-gray-300">or</span>
          <div className="w-20 h-px bg-gray-500"></div>
        </div>

        <div className="flex justify-center text-sm text-gray-300">
          <p>Don't have an account?</p>
          <button
            className="ml-2 text-blue-500 hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default Login;
