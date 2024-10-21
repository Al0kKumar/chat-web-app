// OtpPage.tsx
import React, { useState } from 'react';
import OTPInput from '../components/OtpInput';

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    if (otp.length === 6) {
      console.log('OTP submitted:', otp);
      // You can call your API or verification function here
      alert(`OTP submitted: ${otp}`);
    } else {
      alert('Please enter a valid OTP of length 6');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Enter OTP</h1>
      <OTPInput value={otp} onChange={setOtp} />
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Verify
      </button>
      {/* <p className="mt-2">Entered value: {otp}</p> */}
    </div>
  );
};

export default OtpPage;
