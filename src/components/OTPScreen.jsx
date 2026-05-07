"use client";
import React, { useState } from 'react';
import { Button } from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { useDispatch } from "react-redux";
// import { updateProfile } from "@/redux/userSlice";
// import { api } from '@/utils/apiHelper'; // Import Axios helper

// 🟢 FIX: 'mobileNumber' prop add kiya jo Register Screen se aayega
export const OTPScreen = ({ onBack, mobileNumber }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return; 
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (error) setError("");

    if (value !== "" && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isAgreed) return; 

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }

    setIsLoading(true);

    try {
      // 🟢 VERIFY OTP API CALL
      const response = await api.post('/auth/verify-otp', {
        mobile: mobileNumber,
        otp: enteredOtp
      });

      if (response.data.status === true) {
        // 1. Token Save Karo!
        localStorage.setItem("auth_token", response.data.token);

        // 2. Redux Update & Navigation
        if (response.data.is_new_user === true) {
          dispatch(updateProfile({ isNewUser: true, hasCompletedOnboarding: false }));
          router.push('/profile'); // Add Details Page
        } else {
          dispatch(updateProfile({ isNewUser: false, hasCompletedOnboarding: true }));
          // Old user ka data GetUserDetails API se aayega, abhi ke liye home bhej do
          router.push('/homePage'); 
        }
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-md mx-auto bg-white relative">
      <button onClick={onBack} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center mb-10 hover:bg-gray-50 transition-colors">
        <span className="text-3xl text-black">{"<"}</span>
      </button>

      <h2 className="text-2xl font-bold mb-2 text-black">OTP Verification</h2>
      <p className="text-gray-500 text-sm mb-10 leading-relaxed">
        Enter the verification code we just sent on {mobileNumber ? `+91 ${mobileNumber}` : "your mobile number"}.
      </p>

      <div className="flex justify-between gap-4 mb-2 mx-15">
        {otp.map((digit, i) => (
          <input
            key={i} id={`otp-${i}`} type="text" inputMode="numeric" pattern="[0-9]*"
            value={digit} onChange={(e) => handleOtpChange(e.target.value, i)} onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 border border-gray-200 rounded-xl text-center text-black text-2xl font-bold focus:border-[#228B22] focus:ring-1 focus:ring-[#228B22] outline-none transition-all"
          />
        ))}
      </div>
      
      {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

      <div className="flex items-center gap-2 mb-10 mt-4">
        <input type="checkbox" id="terms" className="w-4 h-4 accent-[#228B22] cursor-pointer" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)}/>
        <label htmlFor="terms" className="text-xs text-gray-900 cursor-pointer">
          I Agree To The <Link href="/TermsCondition" className="text-blue-500 underline">Terms&Condition</Link>
        </label>
      </div>

      <Button onClick={handleVerify} disabled={!isAgreed || isLoading} className={`mb-6 transition-all ${(!isAgreed || isLoading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
        {isLoading ? "Verifying..." : "Verify"}
      </Button>

      {/* DEV HACK HAT GAYA HAI 🎉 */}

      <p className="text-center text-sm text-gray-500 mt-auto pt-4">
        Didn't receive code? <button className="text-[#228B22] font-bold hover:underline ml-1">Resend</button>
      </p>
    </div>
  );
};