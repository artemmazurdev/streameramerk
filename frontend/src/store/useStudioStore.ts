import { create } from 'zustand';
import { StudioStore } from '@types/index';

export const useStudioStore = create<StudioStore>((set) => ({
  broadcast: null,
  participants: [],
  localStream: null,
  isAudioEnabled: true,
  isVideoEnabled: true,
  isScreenSharing: false,
  selectedCamera: null,
  selectedMicrophone: null,
  currentLayout: 'grid',
  isRecording: false,
  isLive: false,
  chatMessages: [],

  setBroadcast: (broadcast) => set({ broadcast }),

  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== participantId),
    })),

  updateParticipant: (participantId, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === participantId ? { ...p, ...updates } : p
      ),
    })),

  toggleAudio: () =>
    set((state) => {
      const newState = !state.isAudioEnabled;
      if (state.localStream) {
        state.localStream.getAudioTracks().forEach((track) => {
          track.enabled = newState;
        });
      }
      return { isAudioEnabled: newState };
    }),

  toggleVideo: () =>
    set((state) => {
      const newState = !state.isVideoEnabled;
      if (state.localStream) {
        state.localStream.getVideoTracks().forEach((track) => {
          track.enabled = newState;
        });
      }
      return { isVideoEnabled: newState };
    }),

  toggleScreenShare: () =>
    set((state) => ({ isScreenSharing: !state.isScreenSharing })),

  setLocalStream: (stream) => set({ localStream: stream }),

  selectCamera: (deviceId) => set({ selectedCamera: deviceId }),

  selectMicrophone: (deviceId) => set({ selectedMicrophone: deviceId }),

  setLayout: (layout) => set({ currentLayout: layout }),

  startRecording: () => set({ isRecording: true }),

  stopRecording: () => set({ isRecording: false }),

  goLive: () => set({ isLive: true }),

  endBroadcast: () => set({ isLive: false, isRecording: false }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
}));



