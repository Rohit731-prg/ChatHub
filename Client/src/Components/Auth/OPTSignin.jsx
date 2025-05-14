import React, { useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

function OPTSignin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [otp, setOTP] = useState('');

    const verifyOTP = async () => {
        try {
            const res = await axios.post(`http://localhost:2000/api/user/verifyUser/${id}`, {code: otp});
            console.log(res);
            toast.success(res.data.message);
            setTimeout(() => {
                navigate(`/login`);
            }, 1000);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log('error form verifyOPT', error);
        }
    }
  return (
    (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
          <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Enter OTP</h2>
    
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
    
            <button
              onClick={verifyOTP}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Verify
            </button>
    
            <Toaster position="top-right" />
          </div>
        </div>
      )
  )
}

export default OPTSignin