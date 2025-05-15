import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Sideber from "./Sidebar";
import useAuthStore from "../../store/authStore";

function UserDetails() {
  const [profilePic, setProfilePic] = useState(null);
  const [isGetDetails, setIsGetDetails] = useState(false);
  const authUser = useAuthStore((state) => state.authUser);
  const setUploadProfilePic = useAuthStore(
    (state) => state.setUploadProfilePic
  );

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
      console.log(base64Image);
      setProfilePic(base64Image);
      await setUploadProfilePic({ profilePic: base64Image });
    };
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-between p-5">
      <Sideber />
      {isGetDetails ? (
        <div className="w-full h-full p-10">
          <p className="text-2xl font-semibold text-white">Profile</p>
          <p className="text-gray-400 text-sm mb-10">
            View all your profile details here
          </p>
          <div className="flex flex-row border-[2px] border-white rounded-lg w-full p-5 h-[80%]">
            <div className="w-1/3 flex items-center justify-center flex-col text-white">
              <p className="text-center text-2xl font-bold">{authUser.name}</p>
              <p className="text-center text-green-400 font-semibold mb-5">
                Authorsed User
              </p>
              <div className="relative p-2 bg-gray-800 rounded-full">
                <img
                  src={authUser.profilePic}
                  alt="Profile"
                  className="w-[300px] h-[300px] object-cover rounded-full"
                />

                <label
                  htmlFor="fileInput"
                  className="absolute top-[80%] left-[70%] bg-black text-white p-3 rounded-full cursor-pointer"
                >
                  <FaCamera className="text-2xl" />
                </label>

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handelChange(e)}
                  className="hidden"
                />
              </div>
            </div>

            <div className="w-2/3 border-l-[2px] border-white text-white">
              <p className="text-2xl font-semibold ml-10">Bio and details</p>

              <p className="mt-5 ml-10 text-sm text-gray-400">Name :<br/> 
                <span className="text-xl font-semibold text-white">{authUser.name}</span>
              </p>
              <p className="mt-2 ml-10 text-sm text-gray-400">Email :<br/>
                <span className="text-xl font-semibold text-white">{authUser.email}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white">No user details found.</div>
      )}
    </div>
  );
}

export default UserDetails;
