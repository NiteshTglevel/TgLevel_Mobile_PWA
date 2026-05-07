export const dummyData = {
  GLOBAL_ALERTS: [
    {
      id: 'promo-course-holi',
      type: 'white',
      timestamp: '2026-02-28T10:00:00', 
      content: {
        text: "🌼 Rangon ka tyohar, offers ki bahaar,\nMMTC Family ke saath khushiyan hazaar!🎨😇\n\nStudy example of this week's Calculated returns✅\n=348 POINTS (23 TRADES)*65*1 =₹22,620😯💥\n\n✅ 25+ Live Workshops\n✅ 20+ Real-World Trading Strategies\n✅ 5+ Expert Doubt Solving Sessions\n✅ 1 Month Trade Analysis with Community 💬\n✅ Lifetime Equity Options Scanner Access\n✅ 1 Year Recorded Course Material 🎥\n\nLast Chance to Enroll in ₹10,999/-💯🤩🧑🏻‍💻\nhttps://form.qfixonline.com/trgim\n\nFor More Info about Course🧑🏻‍💻👇👇\nhttps://wa.link/dyojvd",
        image: "/holy.jpeg"
      }
    }
  ],
  NFT: [
    { 
      id: 'nft1', 
      type: 'premium',
      tag: 'Nifty', 
      price: '4,999', 
      views: '1156', 
      timestamp: '2026-02-28T11:43:00',
      content: {
        // Alag-alag fields ko milakar ek single text string bana diya gaya hai
        text: "Hi Jackson Peterson, 👋\n\nWe Hope You Enjoyed Exploring Our Platform During Your 3-Day Free Trial.\n\nTo Continue Accessing Premium Features—Including Detailed Insights And The Exclusive Community Page—You'll Need To Activate Your Plan.\n\n🔓 Unlock:\n• Full Access To Premium Content\n• Entry To Our Members-Only Community\n• Continuous Updates And Expert Insights\n\nIf You Have Any Questions Or Need Help Getting Started, We're Just A Message Away.\n\nThank You For Being A Part Of Our Community!\n\n*Warm Regards,*\n*TG Levels*"
      }
    },
    {
      id: 'nft-research-1',
      type: 'white',
      timestamp: '2026-02-28T11:00:00',
      content: {
        text: "✅*RESEARCH ANALYSIS*✅ \n\n*BUY NIFTY 2 MAR 25450 PE *\n\nEntry Above = 165 \nSL = 150 \nTarget 1 = 180 \nTarget 2 = 195 \n\nDisclaimer: Investments in the market are subject to market risk. Please read all related documents carefully before investing. Registration granted by SEBI, Enlistment as RA with Exchange and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. \n*Our Customer Care:-* 99871 96114 \nRationale=https://bit.ly/4s7hzyv \nConfidence Level Trade \n🟡 Medium probability"
      }
    }
  ],
  EQT: [
    { 
      id: 'eqt1', 
      type: 'premium',
      tag: 'EQT', 
      price: '2,999', 
      views: '450', 
      timestamp: '2026-02-24T09:15:00',
      content: {
        text: "Hello Trader, 🚀\n\nWelcome to the Equity Premium Zone.\n\nGet ready for high-accuracy equity calls and swing trading setups.\n\n🔓 Unlock:\n• Daily Equity Calls\n• Swing Trade Setups\n• Weekly Market Analysis\n\nLet's make some profits today.\n\nHappy Trading!\n\n*Best,*\n*Equity Team*",
        image: "/EQT.jpeg"
      }
    },
    {
      id: 'eqt-white-1',
      type: 'white',
      timestamp: '2026-02-26T10:15:00',
      content: {
        text: "*💡 Equity Free Insight*\n\nWatch out for IT sector stocks today. Major volume breakouts observed in mid-cap IT companies.",
        image: "/eqt.jpeg" 
      }
    }
  ],
  COM: [
    { 
      id: 'com1', 
      type: 'premium',
      tag: 'COM', 
      price: '3,499', 
      views: '320', 
      timestamp: '2026-02-21T18:30:00',
      content: {
        text: "Hi Commodity Trader, 🥇\n\nStep into the world of Gold, Silver, and Crude Oil trading.\n\nUnlock exclusive insights and real-time alerts for the commodity market.\n\n🔓 Unlock:\n• Real-time MCX Alerts\n• Daily Gold & Silver Levels\n• Global Market Impact Analysis\n\nReach out if you need assistance.\n\nTrade smart, trade safe!\n\n*Regards,*\n*MCX Experts*"
      }
    },
    {
      id: 'com-white-1',
      type: 'white',
      timestamp: '2026-02-25T14:15:00',
      content: {
        text: "*🛢️ Commodity Update*\n\nCrude oil inventories data releasing tonight. Expect high volatility in the evening session.",
        image: "/com.jpeg" 
      }
    }
  ],
  SWG: [
    { 
      id: 'swg1', 
      type: 'premium',
      tag: 'SWG', 
      price: '1,999', 
      views: '670', 
      timestamp: '2026-02-26T10:00:00',
      content: {
        text: "Hey Investor, 📈\n\nPatience pays off. Welcome to the Swing Trading community.\n\nAccess our thoroughly researched swing trade ideas.\n\nOur team is here to help you build a solid portfolio.\n\nHere's to steady growth!\n\n*Cheers,*\n*Swing Wealth Team*"
      }
    },
    {
      id: 'swg-white-1',
      type: 'white',
      timestamp: '2026-02-24T11:10:00',
      content: {
        text: "*📈 Swing Trade Idea*\n\nLook for strong consolidations near the 200-day moving average. Patience is key in swing setups.",
        image: "" 
      }
    }
  ]
};

// === SMART PAGINATION API (PRODUCTION READY) ===
export const fetchMessagesFromApi = async (category, page = 1, limit = 10) => {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Fake network delay (Backend aane par ye hat jayega)

  const globalCards = dummyData.GLOBAL_ALERTS || [];
  let baseData = [];

  // 1. Data collect karna (Category ke hisaab se)
  if (category === 'All') {
    baseData = [
      ...(dummyData.NFT || []), 
      ...(dummyData.EQT || []), 
      ...(dummyData.COM || []), 
      ...(dummyData.SWG || []),
      ...globalCards
    ];
  } else {
    baseData = [
      ...(dummyData[category] || []),
      ...globalCards
    ];
  }

  // 👇 YAHAN SE LOOP HATA DIYA HAI 👇
  // Ab hum direct original data use kar rahe hain, koi 5 copy nahi banegi.
  let expandedData = [...baseData];

  // 2. Sorting (Purane message upar, naye message niche)
  expandedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // 3. Pagination Logic (Backend bhi same yahi logic use karega)
  const totalMessages = expandedData.length;
  const startIndex = Math.max(0, totalMessages - (page * limit));
  const endIndex = totalMessages - ((page - 1) * limit);
  
  const chunk = expandedData.slice(startIndex, endIndex);
  
  // Agar aur purane messages bache hain, toh hasMore true hoga
  const hasMore = startIndex > 0; 

  return {
    data: chunk,
    hasMore: hasMore
  };
};





// import axios from 'axios'; // TODO: Real API ke time uncomment karna

// export const dummyData = {
//     // ... (Aapka pura purana dummy data yahan rahega) ...
// };

// ==========================================
// 🚧 FUTURE API INTEGRATION (REAL BACKEND) 🚧
// ==========================================
/*
export const fetchRealMessagesFromApi = async (category, page = 1, limit = 10) => {
  try {
    // User ka token local storage se nikalna (Authentication ke liye)
    const token = localStorage.getItem("userToken");

    const response = await axios.get(`https://api.yourdomain.com/v1/messages`, {
      params: { category, page, limit },
      headers: { Authorization: `Bearer ${token}` } // Taki backend ko pata chale kaunsa user hai
    });

    return {
      data: response.data.messages, // DB se aaye hue messages
      hasMore: response.data.hasMore // Aur messages bache hain ya nahi
    };
  } catch (error) {
    console.error("API Error fetching messages:", error);
    return { data: [], hasMore: false };
  }
};
*/

// ==========================================
// ✅ CURRENT WORKING DUMMY LOGIC ✅
// ==========================================
// export const fetchMessagesFromApi = async (category, page = 1, limit = 10) => {
//   await new Promise((resolve) => setTimeout(resolve, 600)); 

//   const globalCards = dummyData.GLOBAL_ALERTS || [];
//   let baseData = category === 'All' 
//     ? [...(dummyData.NFT || []), ...(dummyData.EQT || []), ...(dummyData.COM || []), ...(dummyData.SWG || []), ...globalCards]
//     : [...(dummyData[category] || []), ...globalCards];

//   let expandedData = [...baseData];
//   expandedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//   const totalMessages = expandedData.length;
//   const startIndex = Math.max(0, totalMessages - (page * limit));
//   const endIndex = totalMessages - ((page - 1) * limit);
  
//   const chunk = expandedData.slice(startIndex, endIndex);
//   const hasMore = startIndex > 0; 

//   return { data: chunk, hasMore };
// };