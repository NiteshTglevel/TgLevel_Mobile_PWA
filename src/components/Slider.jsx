import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '@/redux/chatSlice';

export default function Slider() {
 
  const activeTab = useSelector((state) => state.chat.activeTab);
  const dispatch = useDispatch();

  const tabs = [
    { name: 'All' },
    { name: 'NFT', dot: true },
    { name: 'EQT' },
    { name: 'COM' },
    { name: 'SWG' },
  ];

  return (
    <div className="flex-none flex items-center p-1.5 overflow-x-auto border-y border-black bg-white scrollbar-hide w-full max-w-md">
      <div className="shrink-0 px-1 flex items-center justify-center cursor-pointer">
        <ChevronLeft size={18} strokeWidth={3} className="text-black" />
      </div>
      <div className="flex items-center gap-1.5 ">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => dispatch(setActiveTab(tab.name))} // update the Redux action
            className={`relative h-8.5 px-5.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors border 
              ${activeTab === tab.name 
                ? 'bg-[#47D185] text-white border-white shadow-md' 
                : 'bg-white text-[#333333] border-black hover:bg-gray-50' 
              }
            `}
          >
            <span className="flex items-center gap-1">
              {tab.name}
              {tab.dot && <span className="w-1.25 h-1.25 bg-[#FF0000] rounded-full mt-1px" />}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}