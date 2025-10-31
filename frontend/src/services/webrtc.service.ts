import { Device } from 'mediasoup-client';
import { Transport, Producer, Consumer, RtpCapabilities } from 'mediasoup-client/lib/types';

const MEDIA_SERVER_URL = import.meta.env.VITE_MEDIA_SERVER_URL || 'http://localhost:6000';

class WebRTCService {
  private device: Device | null = null;
  private sendTransport: Transport | null = null;
  private recvTransport: Transport | null = null;
  private producers: Map<string, Producer> = new Map();
  private consumers: Map<string, Consumer> = new Map();

  async initialize() {
    this.device = new Device();
  }

  async loadDevice(routerRtpCapabilities: RtpCapabilities) {
    if (!this.device) {
      await this.initialize();
    }
    await this.device!.load({ routerRtpCapabilities });
  }

  getDevice() {
    return this.device;
  }

  isLoaded() {
    return this.device?.loaded || false;
  }

  getRtpCapabilities() {
    return this.device?.rtpCapabilities;
  }

  // Создание транспорта для отправки медиа
  async createSendTransport(transportOptions: any) {
    if (!this.device) {
      throw new Error('Device not initialized');
    }

    this.sendTransport = this.device.createSendTransport(transportOptions);

    this.sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        // Отправляем dtlsParameters на сервер
        await fetch(`${MEDIA_SERVER_URL}/transport/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transportId: this.sendTransport!.id,
            dtlsParameters,
          }),
        });
        callback();
      } catch (error) {
        errback(error as Error);
      }
    });

    this.sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const response = await fetch(`${MEDIA_SERVER_URL}/transport/produce`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transportId: this.sendTransport!.id,
            kind,
            rtpParameters,
          }),
        });
        const { id } = await response.json();
        callback({ id });
      } catch (error) {
        errback(error as Error);
      }
    });

    return this.sendTransport;
  }

  // Создание транспорта для получения медиа
  async createRecvTransport(transportOptions: any) {
    if (!this.device) {
      throw new Error('Device not initialized');
    }

    this.recvTransport = this.device.createRecvTransport(transportOptions);

    this.recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await fetch(`${MEDIA_SERVER_URL}/transport/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transportId: this.recvTransport!.id,
            dtlsParameters,
          }),
        });
        callback();
      } catch (error) {
        errback(error as Error);
      }
    });

    return this.recvTransport;
  }

  // Отправка видео/аудио трека
  async produce(track: MediaStreamTrack, kind: 'audio' | 'video') {
    if (!this.sendTransport) {
      throw new Error('Send transport not created');
    }

    const producer = await this.sendTransport.produce({ track });
    this.producers.set(kind, producer);

    producer.on('transportclose', () => {
      console.log('Transport closed, producer closed');
    });

    producer.on('trackended', () => {
      console.log('Track ended');
    });

    return producer;
  }

  // Получение медиа от другого участника
  async consume(consumerId: string, producerId: string, kind: 'audio' | 'video', rtpParameters: any) {
    if (!this.recvTransport) {
      throw new Error('Receive transport not created');
    }

    const consumer = await this.recvTransport.consume({
      id: consumerId,
      producerId,
      kind,
      rtpParameters,
    });

    this.consumers.set(consumerId, consumer);

    consumer.on('transportclose', () => {
      console.log('Transport closed, consumer closed');
    });

    return consumer;
  }

  // Получение локального медиа стрима
  async getUserMedia(constraints: MediaStreamConstraints = {
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 },
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  }): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error('Error getting user media:', error);
      throw error;
    }
  }

  // Получение демонстрации экрана
  async getDisplayMedia(constraints: DisplayMediaStreamOptions = {
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 },
    },
    audio: true,
  }): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getDisplayMedia(constraints);
    } catch (error) {
      console.error('Error getting display media:', error);
      throw error;
    }
  }

  // Получение списка устройств
  async getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      videoinput: devices.filter(d => d.kind === 'videoinput'),
      audioinput: devices.filter(d => d.kind === 'audioinput'),
      audiooutput: devices.filter(d => d.kind === 'audiooutput'),
    };
  }

  // Закрытие producer
  closeProducer(kind: 'audio' | 'video') {
    const producer = this.producers.get(kind);
    if (producer) {
      producer.close();
      this.producers.delete(kind);
    }
  }

  // Закрытие consumer
  closeConsumer(consumerId: string) {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      consumer.close();
      this.consumers.delete(consumerId);
    }
  }

  // Закрытие всех соединений
  disconnect() {
    this.producers.forEach(producer => producer.close());
    this.consumers.forEach(consumer => consumer.close());
    this.sendTransport?.close();
    this.recvTransport?.close();
    
    this.producers.clear();
    this.consumers.clear();
    this.sendTransport = null;
    this.recvTransport = null;
  }
}

export default new WebRTCService();



