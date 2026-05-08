"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCheck, Eye, X, Star } from 'lucide-react'; 
import { useSelector } from 'react-redux'; 
import { motion, AnimatePresence } from "framer-motion"; // 🟢 Added framer motion

// --- ADVANCED SMART TEXT PARSER ---
const parseSmartText = (text) => {
  if (!text) return null;
  
  // 1. Convert *bold* text
  let processedText = text.replace(/\*([^*]+)\*/g, '<strong class="font-bold">$1</strong>');
  
  // 2. Highlight specific trading keywords
  const keywords = [
    "Entry Above =", "Entry Above", 
    "SL =", "SL", 
    "Target 1 =", "Target 2 =", "Target 3 =", "Target", 
    "Disclaimer:", "Rationale=", "Rationale", 
    "Confidence Level Trade", "🟡 Medium probability", "🔴 Low probability", "🟢 High probability",
    "🔓 Unlock:"
  ];
  
  // Sort by length to prevent partial matching (e.g. replacing 'SL' inside another word)
  keywords.sort((a, b) => b.length - a.length).forEach(kw => {
     const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     processedText = processedText.replace(new RegExp(escapedKw, 'g'), `<strong class="font-bold">${kw}</strong>`);
  });

  // 3. Convert URLs to clickable links
  processedText = processedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline cursor-pointer">$1</a>');

  // 4. Convert \n to actual HTML line breaks
  processedText = processedText.replace(/\n/g, '<br />');

  // Render HTML safely
  return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
};

export default function MessageCard({ message, showTag }) {
  const userType = useSelector((state) => state.user.userData.userType);
  const isPremium = userType === "premium";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // 🟢 Feedback States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  if (!message || !message.timestamp || !message.content) return null;
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true  
  });

  // Check if content has the single 'text' field
  const hasTextContent = Boolean(message.content.text);
  const showImage = Boolean(message.content.image && !imgError);

  const handleSubmitFeedback = () => {
    // API Call ya Redux dispatch yahan hoga
    console.log(`Feedback for message ${message.id}:`, { rating, text: feedbackText });
    setShowFeedbackModal(false);
    setRating(4); // Reset default rating
    setFeedbackText(""); // Clear text
  };

  return (
    <>
      <div className="mt-auto mb-4 ml-2 flex flex-col items-start w-fit max-w-[94%] animate-in fade-in slide-in-from-left-2 duration-300">
        
        {/* 🟢 Background white, light border, and relative positioning */}
        <div className="relative bg-white p-3 pt-4 rounded-[18px] rounded-bl-none border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] w-full">
          
          {/* 🟢 The Tail is now white with gray stroke to match the card */}
          <div className="absolute bottom-[-1px] -left-2.75 w-3.25 h-4 z-0 drop-shadow-sm">
            <svg viewBox="0 0 13 16" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 0 Q9 14 0 15.5 L13 15.5" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1.5" />
            </svg>
          </div>

          {/* 🟢 Golden Premium Badge at Top Right */}
          <div className="absolute top-[-1px] right-[0.5px] bg-linear-to-br from-[#e1c57e] via-[#f7ebba] to-[#a68a49] px-7 py-1 rounded-bl-[16px] rounded-tr-[18px] rounded-tl-[16px] shadow-sm z-20 border border-white">
            <span className="text-[14px] font-semibold text-black tracking-wide">Premium</span>
          </div>

         {/* --- DYNAMIC BLUR WRAPPER --- */}
          <div className={`relative z-10 transition-all duration-300 ${!isPremium ? 'blur-[4px] opacity-90 pointer-events-none select-none' : ''}`}>
            
            {/* 1. IMAGE RENDERING */}
            {showImage && (
              <div 
                className={`cursor-pointer overflow-hidden rounded-lg border border-black/5 relative ${hasTextContent ? 'mb-3' : ''}`} 
                onClick={() => setIsModalOpen(true)} 
              >
                <Image 
                  src={message.content.image} 
                  alt="Premium Attached Image" 
                  width={400} 
                  height={300} 
                  className="w-full h-auto max-h-50 object-cover transition-transform duration-200"
                  onError={() => setImgError(true)} 
                />
              </div>
            )}

            {/* 2. SMART TEXT RENDERING */}
            {hasTextContent && (
              <div className="text-gray-800 text-[14px] leading-[1.5] space-y-3 pr-2">
                 {parseSmartText(message.content.text)}
              </div>
            )}

            {/* 3. METADATA (Time, Tag, Views) */}
            <div className="flex items-center justify-between mt-3 pt-1 gap-2 w-full">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[12px] text-blue-600 font-medium tracking-tight">#{message.id ? String(message.id).slice(-6) : '123'}</span>
                
                {showTag && message.tag && (
                  <span className="border border-[#228b22] text-black px-1.5 py-0.5 rounded-[5px] text-[10px] font-medium tracking-tight bg-white">
                    {message.tag}
                  </span>
                )}
              </div>

             <div className="flex items-center gap-1 text-[11px] text-black font-medium shrink-0 ml-auto">
               {/* Center: Send Feedback Button */}
              <div className="flex-1 flex justify-center px-1">
                <button 
                  onClick={() => setShowFeedbackModal(true)} // 🟢 Open Modal
                  className="bg-[#228b22] hover:bg-[#1a7328] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm transition-colors whitespace-nowrap active:scale-95"
                >
                  Send Feedback
                </button>
              </div>

                <span className="flex items-center gap-0.5">
                  ({message.views || 1155} <Eye size={12} strokeWidth={2.5} className="ml-0.5" />)
                </span>
                <span className="ml-0.5">{formattedTime}</span>
                <CheckCheck size={14} className="text-blue-500 stroke-[2.5px] ml-0.5" />
              </div>

            </div>                     
          </div>

          {/* --- LOCK OVERLAY --- */}
          {!isPremium && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[18px]">
              <div className="bg-white/80 w-55 p-4 rounded-3xl shadow-[0_6px_20px_rgba(0,0,0,0.1)] flex flex-col items-center border border-white backdrop-blur-md">
                <div className="mb-2.5 drop-shadow-sm">
                  <svg width="22" height="28" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round"/>
                    <rect x="4" y="11" width="16" height="13" rx="3" fill="#EAB308"/>
                    <circle cx="12" cy="16" r="1.5" fill="#A16207"/>
                    <path d="M11.25 16H12.75V20H11.25V16Z" fill="#A16207" className="rounded-b-sm"/>
                  </svg>
                </div>
                <span className="text-[14px] font-bold text-gray-900 mb-3.5 tracking-tight">Premium Trade</span>
                <button className="bg-[#218b32] hover:bg-[#1a7328] text-white text-[13px] font-semibold py-2 px-4 rounded-xl w-full transition-transform active:scale-95 shadow-sm">
                  Talk to us
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- LIGHTBOX (IMAGE POPUP) --- */}
      {isModalOpen && showImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative w-full max-w-md flex justify-center items-center flex-col">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors z-50 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="relative w-full flex justify-center">
              <Image 
                src={message.content.image} 
                alt="Enlarged view" 
                width={1000}
                height={1000}
                className="rounded-xl w-full h-auto max-h-[85vh] object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 🟢 TRADE FEEDBACK MODAL (Zero-Rating Enabled) */}
      {/* ========================================= */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] w-full max-w-[340px] p-6 shadow-2xl relative flex flex-col items-center"
            >
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <h2 className="text-[20px] font-bold text-[#1e293b] mb-1">Trade feedback</h2>
              <p className="text-[13px] text-gray-500 mb-6">Please rate your experience below</p>

              {/* 🟢 Star Rating (Click twice to clear/zero) */}
              <div className="flex items-center gap-1.5 mb-8 w-full justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    // 🟢 NAYA LOGIC: Agar same star dubara dabaya toh 0 kar do, warna utne star do
                    onClick={() => setRating(rating === star ? 0 : star)} 
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <Star 
                      size={28} 
                      fill={star <= rating ? "#fbbf24" : "transparent"} 
                      className={star <= rating ? "text-[#fbbf24]" : "text-gray-300"} 
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
                <span className="text-[12px] text-gray-500 font-medium ml-3">
                  {rating === 0 ? "No rating" : `${rating}/5 stars`}
                </span>
              </div>

              {/* Textarea */}
              <div className="w-full flex flex-col items-start w-full">
                <span className="text-[13px] text-gray-500 mb-1 ml-1 font-medium">Additional feedback</span>
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="My feedback!!"
                  className="w-full h-24 border border-gray-200 rounded-xl p-3 text-[14px] outline-none focus:border-[#228b22] focus:ring-1 focus:ring-[#228b22] resize-none mb-6 text-gray-800 placeholder:text-gray-400"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmitFeedback}
                className="w-full bg-[#228b22] hover:bg-[#1a7328] text-white font-semibold py-3 rounded-xl transition-all active:scale-95 text-[15px]"
              >
                Submit feedback
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}