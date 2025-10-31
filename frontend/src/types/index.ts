// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionTier: 'free' | 'basic' | 'professional' | 'enterprise';
  createdAt: Date;
}

// Broadcast types
export interface Broadcast {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended' | 'recording';
  startTime?: Date;
  endTime?: Date;
  recordingUrl?: string;
  thumbnailUrl?: string;
  viewerCount?: number;
  settings: BroadcastSettings;
  destinations: StreamDestination[];
}

export interface BroadcastSettings {
  layoutType: 'grid' | 'spotlight' | 'sidebar' | 'custom';
  maxParticipants: number;
  enableChat: boolean;
  enableRecording: boolean;
  enableVirtualBackground: boolean;
  overlays: Overlay[];
  brandingLogo?: string;
  brandingColors?: {
    primary: string;
    secondary: string;
  };
}

export interface StreamDestination {
  id: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  streamKey: string;
  rtmpUrl: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error';
}

export interface Overlay {
  id: string;
  type: 'text' | 'image' | 'banner' | 'logo';
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    opacity?: number;
  };
  animation?: 'none' | 'fade' | 'slide';
  visible: boolean;
}

// Participant types
export interface Participant {
  id: string;
  userId?: string;
  name: string;
  avatar?: string;
  role: 'host' | 'guest' | 'viewer';
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  handRaised: boolean;
  joinedAt: Date;
  stream?: MediaStream;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
}

// WebRTC types
export interface RTCConfiguration {
  iceServers: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
}

export interface MediaDevices {
  videoinput: MediaDeviceInfo[];
  audioinput: MediaDeviceInfo[];
  audiooutput: MediaDeviceInfo[];
}

export interface StreamQuality {
  resolution: '360p' | '480p' | '720p' | '1080p' | '1440p' | '4k';
  frameRate: 15 | 24 | 30 | 60;
  bitrate: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'system';
}

// Store types
export interface StudioStore {
  broadcast: Broadcast | null;
  participants: Participant[];
  localStream: MediaStream | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  selectedCamera: string | null;
  selectedMicrophone: string | null;
  currentLayout: BroadcastSettings['layoutType'];
  isRecording: boolean;
  isLive: boolean;
  chatMessages: ChatMessage[];
  
  // Actions
  setBroadcast: (broadcast: Broadcast) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  selectCamera: (deviceId: string) => void;
  selectMicrophone: (deviceId: string) => void;
  setLayout: (layout: BroadcastSettings['layoutType']) => void;
  startRecording: () => void;
  stopRecording: () => void;
  goLive: () => void;
  endBroadcast: () => void;
  addChatMessage: (message: ChatMessage) => void;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Recording types
export interface Recording {
  id: string;
  broadcastId: string;
  userId: string;
  title: string;
  duration: number;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  status: 'processing' | 'ready' | 'failed';
}

// Analytics types
export interface BroadcastAnalytics {
  broadcastId: string;
  viewerCount: number;
  peakViewers: number;
  averageWatchTime: number;
  totalViews: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  viewersByPlatform: {
    platform: string;
    count: number;
  }[];
}



