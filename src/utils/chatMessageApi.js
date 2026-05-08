import { api } from './apiHelper';

const CATEGORY_ID_MAP = {
  NFT: 1,
  EQT: 2,
  COM: 3,
  SWG: 4,
};

const TAG_BY_CATEGORY_ID = {
  1: 'NFT',
  2: 'EQT',
  3: 'COM',
  4: 'SWG',
};

const mapApiMessage = (msg) => ({
  id: msg._id,
  type: msg.message_type === 1 ? 'premium' : 'white',
  tag: TAG_BY_CATEGORY_ID[msg.category_id] || 'NFT',
  views: msg.views,
  timestamp: msg.created_at,
  content: {
    text: msg.message,
  },
});

export const fetchMessagesFromApi = async (category, page = 1, limit = 10) => {
  try {
    const params = { page, limit };
    if (category !== 'All') {
      const catId = CATEGORY_ID_MAP[category];
      if (catId) params.category_id = catId;
    }

    const response = await api.get('/messages', { params });

    if (!response.data.status) {
      return { data: [], hasMore: false };
    }

    const rawMessages = response.data.data || [];
    const messages = rawMessages.map(mapApiMessage);
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return {
      data: messages,
      hasMore: rawMessages.length >= limit,
    };
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return { data: [], hasMore: false };
  }
};
