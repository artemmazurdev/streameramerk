// Shared types across all services

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionTier: 'free' | 'basic' | 'professional' | 'enterprise';
}

export interface Broadcast {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended' | 'recording';
  startTime?: Date;
  endTime?: Date;
}

export interface Participant {
  id: string;
  userId?: string;
  name: string;
  role: 'host' | 'guest' | 'viewer';
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
}

export interface StreamDestination {
  id: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  streamKey: string;
  rtmpUrl: string;
  enabled: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export const EVENTS = {
  // Broadcast events
  BROADCAST_STARTED: 'broadcast-started',
  BROADCAST_ENDED: 'broadcast-ended',
  
  // Participant events
  PARTICIPANT_JOINED: 'participant-joined',
  PARTICIPANT_LEFT: 'participant-left',
  PARTICIPANT_STATUS_UPDATED: 'participant-status-updated',
  
  // WebRTC events
  WEBRTC_OFFER: 'webrtc-offer',
  WEBRTC_ANSWER: 'webrtc-answer',
  ICE_CANDIDATE: 'ice-candidate',
  
  // Chat events
  CHAT_MESSAGE: 'chat-message',
} as const;



