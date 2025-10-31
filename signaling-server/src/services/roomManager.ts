interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  screenSharing?: boolean;
}

export class RoomManager {
  private rooms: Map<string, Map<string, Participant>> = new Map();

  addParticipant(broadcastId: string, participant: Participant) {
    if (!this.rooms.has(broadcastId)) {
      this.rooms.set(broadcastId, new Map());
    }

    const room = this.rooms.get(broadcastId)!;
    room.set(participant.socketId, participant);
  }

  removeParticipant(broadcastId: string, socketId: string) {
    const room = this.rooms.get(broadcastId);
    if (room) {
      room.delete(socketId);
      
      if (room.size === 0) {
        this.rooms.delete(broadcastId);
      }
    }
  }

  removeParticipantFromAll(socketId: string): string[] {
    const affectedRooms: string[] = [];

    this.rooms.forEach((participants, broadcastId) => {
      if (participants.has(socketId)) {
        participants.delete(socketId);
        affectedRooms.push(broadcastId);

        if (participants.size === 0) {
          this.rooms.delete(broadcastId);
        }
      }
    });

    return affectedRooms;
  }

  updateParticipant(broadcastId: string, socketId: string, updates: Partial<Participant>) {
    const room = this.rooms.get(broadcastId);
    if (room) {
      const participant = room.get(socketId);
      if (participant) {
        room.set(socketId, { ...participant, ...updates });
      }
    }
  }

  getParticipants(broadcastId: string): Participant[] {
    const room = this.rooms.get(broadcastId);
    return room ? Array.from(room.values()) : [];
  }

  getParticipant(broadcastId: string, socketId: string): Participant | undefined {
    const room = this.rooms.get(broadcastId);
    return room?.get(socketId);
  }

  getRoomCount(): number {
    return this.rooms.size;
  }

  getTotalParticipants(): number {
    let total = 0;
    this.rooms.forEach((participants) => {
      total += participants.size;
    });
    return total;
  }
}



