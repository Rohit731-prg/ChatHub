import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from '../assets/loadingAnimation.json';
import useAuthStore from "../store/authStore";

function Loading() {
  const navigate = useNavigate();
  const getUserDetailsByCookie = useAuthStore((state) => state.getUserDetailsByCookie);

  const fetchUser = async () => {
    const user = await getUserDetailsByCookie();
    if (user) {
      navigate(`/profile/${user._id}`);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center flex-col">
      <div className="w-40 h-40">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      <p>Loading...</p>
    </div>
  );
}

export default Loading;
