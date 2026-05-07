
// 📡 Future mein yahan Axios ya Fetch call aayegi
export const syncVideoProgress = async (videoId, currentTime) => {
  // this console  indicate that when progress data are set in database
  console.log(`📡 [API CALL SENT]: Video ID: ${videoId} | Progress Saved: ${Math.floor(currentTime)} seconds`);
  
  // Example for future:
  // await axios.post('/api/save-progress', { videoId, progress: Math.floor(currentTime) });
};

// 📡 when user search and get 0 result at that time this run
export const logFailedSearch = async (searchQuery) => {
  console.log(`🔍 [RESEARCH LOG]: User searched for "${searchQuery}" but found 0 videos!`);
  // await axios.post('/api/log-failed-search', { query: searchQuery });
};