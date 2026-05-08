"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Paperclip, Mic, Play, Pause, ChevronDown, Send, Square } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, type: 'text', text: 'Hello! Welcome to TGLevels support. How can I help you today?', side: 'received', time: '10:00 AM' },
  { id: 2, type: 'text', text: 'Feel free to ask any questions about your subscription or trading signals.', side: 'received', time: '10:00 AM' },
];

function VoiceMessageBubble({ duration, side }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(0);
  const speedRef = useRef(1);

  const [durM, durS] = duration.split(':').map(Number);
  const totalMs = (durM * 60 + durS) * 1000;
  const TICK = 50;

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const increment = (TICK * speedRef.current / totalMs) * 100;
      progressRef.current = Math.min(progressRef.current + increment, 100);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        clearInterval(intervalRef.current);
        progressRef.current = 0;
        setProgress(0);
        setPlaying(false);
      }
    }, TICK);
  };

  const togglePlay = () => {
    if (playing) {
      clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      startInterval();
    }
  };

  const cycleSpeed = (e) => {
    e.stopPropagation();
    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    speedRef.current = next;
    setSpeed(next);
    if (playing) startInterval();
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const isRight = side === 'received';

  return (
    <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-3 bg-[#EBEBEB] rounded-2xl px-4 py-3 w-[200px]">
        <button
          onClick={togglePlay}
          className="w-7 h-7 flex items-center justify-center shrink-0 cursor-pointer"
        >
          {playing
            ? <Pause size={15} strokeWidth={2.5} color="#04386C" />
            : <Play size={15} strokeWidth={2.5} color="#04386C" fill="#04386C" />}
        </button>

        <div className="flex-1 h-[3px] bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#04386C] rounded-full"
            style={{ width: `${progress}%`, transition: `width ${TICK}ms linear` }}
          />
        </div>

        <button
          onClick={cycleSpeed}
          className="text-[12px] font-semibold text-[#04386C] w-8 text-center shrink-0 cursor-pointer"
        >
          {speed === 1 ? '1×' : speed === 1.5 ? '1.5×' : '2×'}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(p => !p); }}
          className="shrink-0 cursor-pointer"
        >
          <ChevronDown
            size={16}
            strokeWidth={2.5}
            color="#04386C"
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 w-[200px] text-[12px] text-gray-500">
          Duration: {duration}
        </div>
      )}
    </div>
  );
}

function TextBubble({ text, side }) {
  const isRight = side === 'sent';
  return (
    <div className={`max-w-[65%] px-4 py-2 rounded-2xl text-[14px] ${
      isRight
        ? 'bg-[#04386C] text-white rounded-br-sm'
        : 'bg-[#EBEBEB] text-black rounded-bl-sm'
    }`}>
      {text}
    </div>
  );
}

export default function SupportChat() {
  const router = useRouter();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const bottomRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendText = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), type: 'text', text: trimmed, side: 'sent', time }]);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      recordChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) recordChunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const elapsed = recordSeconds;
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        const dur = `${m}:${s.toString().padStart(2, '0')}`;
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        setMessages(prev => [...prev, { id: Date.now(), type: 'voice', duration: dur, side: 'sent', time }]);
        setRecordSeconds(0);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      recordTimerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } catch {
      alert('Microphone permission denied.');
    }
  };

  const stopRecording = () => {
    clearInterval(recordTimerRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleAttachment = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), type: 'text', text: `📎 ${file.name}`, side: 'sent', time }]);
    e.target.value = '';
  };

  const formatRecordTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      {/* Header */}
      <div className="flex-none flex items-center gap-3 bg-white border-b border-gray-100 px-4 h-14 z-50">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center cursor-pointer">
          <ArrowLeft size={22} strokeWidth={2.5} color="#000" />
        </button>
        <span className="text-[17px] font-semibold text-black">Support Chat</span>
      </div>

      {/* Agent Status Bar */}
      <div className="flex-none flex items-center gap-3 bg-[#04386C] px-4 py-2.5">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden shrink-0 flex items-center justify-center">
          <Image src="/human.png" alt="TGLevels TL" width={40} height={40} className="object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-[14px]">TGLevels TL</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-green-400 text-[12px]">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 ${msg.side === 'sent' ? 'items-end' : 'items-start'}`}
          >
            {msg.type === 'voice'
              ? <VoiceMessageBubble duration={msg.duration} side={msg.side} />
              : <TextBubble text={msg.text} side={msg.side} />}
            <span className="text-[11px] text-gray-400 mx-1">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none border-t border-gray-100 px-3 py-2 bg-white">
        {isRecording ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-full px-4 py-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="flex-1 text-[14px] text-red-600 font-medium">
              Recording... {formatRecordTime(recordSeconds)}
            </span>
            <button
              onClick={stopRecording}
              className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
            >
              <Square size={14} color="#fff" fill="#fff" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                className="flex-1 bg-transparent text-[14px] text-black placeholder-gray-400 outline-none cursor-text"
              />
              <button onClick={handleAttachment} className="shrink-0 cursor-pointer">
                <Paperclip size={20} strokeWidth={2} color="#888" />
              </button>
            </div>

            {inputText.trim() ? (
              <button
                onClick={sendText}
                className="w-10 h-10 bg-[#04386C] rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send size={18} color="#fff" />
              </button>
            ) : (
              <button
                onMouseDown={startRecording}
                onTouchStart={startRecording}
                className="w-10 h-10 bg-[#04386C] rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Mic size={18} color="#fff" />
              </button>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,application/pdf,.doc,.docx"
      />
    </div>
  );
}
