"use client";
import React, { useState } from 'react';
import { Button } from './Button';
// import { api } from '@/utils/apiHelper'; // Import Axios helper

export const RegisterScreen = ({ onBack, onNext, buttonText }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false); // 🟢 Nayi state loading ke liye

  const validateAndNext = async () => {
    const regex = /^[6789]\d{9}$/;
    
    if (!phoneNumber) {
      setError("Please enter mobile number");
      return;
    } 
    if (!regex.test(phoneNumber)) {
      setError("Number must be 10 digits and start with 7, 8, or 9");
      return;
    } 
    
    setError("");
    setIsLoading(true); // Button spinner on

    try {
      // 🟢 SEND OTP API CALL
      const response = await api.post('/auth/send-otp', {
        mobile: phoneNumber
      });

      if (response.data.status === true) {
        // Success! Go to next screen and pass the phone number
        onNext(phoneNumber); 
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false); // Button spinner off
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (error) setError(""); 
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 bg-white max-w-md mx-auto font-sans">
      {/* Back Button */}
      {/* <button onClick={onBack} className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-lg mb-12 shadow-sm active:scale-95 transition-all">
        <span className="text-xl text-black">{"<"}</span>
      </button> */}

      <h2 className="text-[32px] font-bold text-black leading-tight mb-10">
        Welcome to <br /> TG Levels
      </h2>

      {/* Country Code + Input */}
      <div className={`flex items-center h-16 w-full rounded-xl border ${error ? 'border-red-500' : 'border-gray-100'} shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-all overflow-hidden`}>
        <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="h-full px-1 bg-transparent text-gray-700 font-medium outline-none border-r border-gray-100 cursor-pointer">
          <option value="+91" className='text-black'>+91 (IN)</option>
        </select>
        <input type="tel" value={phoneNumber} onChange={handleInputChange} placeholder="Enter your mobile number" className="flex-1 h-full px-4 bg-transparent text-black outline-none placeholder:text-gray-400 font-medium"/>
      </div>

      {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}

      <div className="mt-9 w-full">
        {/* Loading state button me handle karni hogi agar aapke <Button> me support hai */}
        <Button onClick={validateAndNext} disabled={isLoading}>
          {isLoading ? "Sending..." :"Register"}
        </Button>
      </div>
    </div>
  );
};