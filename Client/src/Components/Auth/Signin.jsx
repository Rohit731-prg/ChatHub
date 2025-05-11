import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
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
            const res = await axios.post('http://localhost:2000/api/user/signup', userData);
            console.log(res);
            toast.success(res.data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
            console.log('error form signup', error);
        }
    }
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div 
      style={{boxShadow: '0 0 10px white'}}
      className="px-10 py-5 rounded-md flex flex-col items-center justify-center bg-gray-600 w-96">
        <img
          src="https://bcassetcdn.com/public/blog/wp-content/uploads/2022/05/06230258/angry-gorilla-logo-for-sale-by-unom-design-dribbble.png"
          alt=""
          className="w-20 h-20 mb-20 object-cover rounded-full"
        />

        <p className="text-5xl font-semibold">Sign In</p>

        <div className="px-2 py-2 flex flex-row items-center justify-center bg-black gap-5 rounded-md w-full mt-10">
            <input type="text" 
            className="bg-black w-full border-none outline-none text-white"
            placeholder="Full Name"
            value={userData.name}
            onChange={(e) => serUserData({...userData, name: e.target.value})} />
        </div>
        <div className="px-2 py-2 flex flex-row items-center justify-center text-white bg-black gap-5 rounded-md w-full mt-5 ">
            <input type="email" 
            placeholder="Email Address"
            className="bg-black w-full border-none outline-none"
            value={userData.email}
            onChange={(e) => serUserData({...userData, email: e.target.value})} />
        </div>
        <div className="px-2 py-2 flex flex-row items-center justify-center bg-black text-white gap-5 rounded-md w-full mt-5 ">
            <input type="password" 
            className="bg-black w-full border-none outline-none"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => serUserData({...userData, password: e.target.value})} />
        </div>
        <div className="w-full">
          <button className="px-2 py-2 mt-5 bg-black rounded-md text-white w-full" onClick={submitUser}>Sign up</button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Signin;
