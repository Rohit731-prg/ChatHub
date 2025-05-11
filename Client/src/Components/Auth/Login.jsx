import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaUnlock } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';
import useAuthStore from "../../store/authStore";

function Login() {
  const navigate = useNavigate();
  const isUserLogin = useAuthStore((state) => state.isUserLogin);
  const authUser = useAuthStore((state) => state.authUser);
  const setUserDetails = useAuthStore((state) => state.setUserDetails);


  const [userData, setUserData] = useState({
    email: "",
    password: "",
  })

  const handelSubmit = async (e) => {
    e.preventDefault();

    await setUserDetails(userData);
    if(isUserLogin) {
      navigate(`/profile/${authUser._id}`);
    }
  }
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center text-white">
      <div 
      style={{boxShadow: '0 0 10px white'}}
      className="px-10 py-5 rounded-md flex flex-col items-center justify-center bg-gray-800">
        <img
          src="https://bcassetcdn.com/public/blog/wp-content/uploads/2022/05/06230258/angry-gorilla-logo-for-sale-by-unom-design-dribbble.png"
          alt=""
          className="w-20 h-20 mb-20 object-cover rounded-full"
        />

        <p className="text-5xl font-semibold">Welcome Back</p>
        
        <form onSubmit={handelSubmit} className="mt-10 w-full">
          <div className="px-2 py-2 flex flex-row items-center justify-center bg-black gap-5 rounded-md w-full">
            <MdEmail />
            <input type="text" 
            placeholder="Email" 
            value={userData.email}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
            className="bg-black w-full border-none outline-none" />
          </div>
          <div className="px-2 py-2 flex flex-row items-center justify-center bg-black gap-5 rounded-md w-full mt-5 ">
            <FaUnlock />
            <input type="password" 
            onChange={(e) => setUserData({...userData, password: e.target.value})}
            value={userData.password}
            placeholder="Password" className="bg-black w-full border-none outline-none" />
          </div>

          <button
          type="submit"
          className="bg-white text-black px-2 py-2 rounded-md w-full mt-5 font-semibold"
          >
            Log in
          </button>
        </form>

        <div className="flex flex-row items-center justify-center gap-2 mt-5">
          <div className="w-20 h-[2px] bg-white"></div>
          <div>
            <p>or</p>
          </div>
          <div className="w-20 h-[2px] bg-white"></div>
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mt-5 text-xl font-semibold w-full">
          <p>Don't have an account?</p>
          <button 
          className="text-blue-500"
          onClick={() => navigate("/signup")}>Sign up</button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Login;
