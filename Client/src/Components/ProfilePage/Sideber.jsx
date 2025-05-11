import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';


function Sideber() {
    const authUser = useAuthStore((state) => state.authUser);
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(1);
    const [menu, setMenu] = useState([
        { id: 1, icon : IoChatbubbleEllipsesOutline, nav: `/profile/${authUser._id}` },
        { id: 2, icon : CgProfile, nav: `/UserDetails/${authUser._id}` },
        { id: 3, icon : IoSettings, nav: '/' },
    ])

    const navigateItem = (id, navi) => {
        setIsActive(id);
        navigate(navi);
    }

    useEffect(() => {
        console.log(authUser);
    }, [])
  return (
    <div className='w-20 h-full bg-black flex items-center justify-start flex-col gap-5 py-10 '>
        {menu.map((item, index) => (
            <button
            className={`text-white text-2xl ${isActive === item.id ? 'bg-gray-700 text-black' : ''} p-3 rounded-xl`}
            key={index}
            onClick={() => navigateItem(item.id, item.nav)}
            >
                <item.icon />
            </button>
        ))}
    </div>
  )
}

export default Sideber