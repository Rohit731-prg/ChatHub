import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Sideber from "./Sidebar";
import useAuthStore from "../../store/authStore";

function UserDetails() {
  const [profilePic, setProfilePic] = useState(null);
  const [isGetDetails, setIsGetDetails] = useState(false);
  const authUser = useAuthStore((state) => state.authUser);
  const setUploadProfilePic = useAuthStore((state) => state.setUploadProfilePic);

  const checkUser = () => {
    if (authUser) {
      setIsGetDetails(true);
    }
  };

  const handelChange = async (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setProfilePic(base64Image);
      await setUploadProfilePic({ profilePic: base64Image });
    };
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-between p-5">
      <Sideber />
      {isGetDetails ? (
        <div className="flex flex-row border-[2px] border-white rounded-lg w-full p-5 h-[80%]">
          <div className="w-1/3 flex items-center justify-center flex-col text-white">
          <p className="text-center text-2xl font-bold">{authUser.name}</p>
          <p className="text-center text-green-400 font-semibold mb-5">Authorsed User</p>
              <div className="relative p-2 bg-gray-800 rounded-full">
                <img src={authUser.profilePic} alt="" className="w-[300px] rounded-full" />
                <input 
                type="file"
                accept="image/*"
                onChange={(e) => handelChange(e)}
                className="text-white absolute text-5xl p-5 top-[80%] left-[70%] bg-black rounded-full" />
                  <FaCamera />
              </div>
          </div>


          <div className="w-2/3 border-l-[2px] border-white text-white">
              <p className="text-2xl font-semibold ml-10">Bio and details</p>
          </div>
        </div>
      ) : (
        <div className="text-white">No user details found.</div>
      )}
    </div>
  );
}

export default UserDetails;
