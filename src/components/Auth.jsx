"use client";
import { useState } from "react";
// import { WelcomeScreen } from "@/components/WelcomeScreen";
import { RegisterScreen } from "@/components/RegisterScreen";
import { OTPScreen } from "@/components/OTPScreen";

export default function Home() {
  const [step, setStep] = useState("register");
  const [authMode, setAuthMode] = useState("Login");
  
  // 🟢 NEW STATE: Register se number pakad kar OTP screen tak le jane ke liye
  const [savedMobile, setSavedMobile] = useState(""); 

//   const handleWelcomeAction = (mode) => {
//     setAuthMode(mode); 
//     setStep("register");
//   };

  return (
    <div className="min-h-screen bg-white">
      {/* {step === "welcome" && (
        <WelcomeScreen 
          onLogin={() => handleWelcomeAction("Login")} 
          onCreate={() => handleWelcomeAction("Create")} 
        />
      )} */}
      
      {step === "register" && (
        <RegisterScreen 
          buttonText={authMode}
          onBack={() => setStep("welcome")} 
          
          // 🟢 FIX: Yahan se number receive karke state me save kiya
          onNext={(number) => {
            setSavedMobile(number); 
            setStep("otp");
          }} 
        />
      )}

      {step === "otp" && (
        <OTPScreen 
          mobileNumber={savedMobile} // 🟢 FIX: Yahan saved number OTP screen ko de diya
          onBack={() => setStep("register")} 
        />
      )}
    </div>
  );
}