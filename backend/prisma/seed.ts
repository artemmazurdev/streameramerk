import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      subscriptionTier: 'professional',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      subscriptionTier: 'basic',
    },
  });

  console.log('✅ Created users:', { user1, user2 });

  // Create sample broadcasts
  const broadcast1 = await prisma.broadcast.create({
    data: {
      userId: user1.id,
      title: 'My First Live Stream',
      description: 'Testing the streaming platform',
      status: 'scheduled',
      layoutType: 'grid',
      maxParticipants: 10,
      enableChat: true,
      enableRecording: true,
      enableVirtualBackground: false,
    },
  });

  const broadcast2 = await prisma.broadcast.create({
    data: {
      userId: user1.id,
      title: 'Weekly Podcast',
      description: 'Our regular weekly podcast',
      status: 'scheduled',
      layoutType: 'spotlight',
      maxParticipants: 5,
      enableChat: true,
      enableRecording: true,
      enableVirtualBackground: true,
    },
  });

  console.log('✅ Created broadcasts:', { broadcast1, broadcast2 });

  // Create sample destinations
  await prisma.destination.create({
    data: {
      broadcastId: broadcast1.id,
      platform: 'youtube',
      streamKey: 'test-youtube-key',
      rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
      enabled: true,
    },
  });

  await prisma.destination.create({
    data: {
      broadcastId: broadcast1.id,
      platform: 'facebook',
      streamKey: 'test-facebook-key',
      rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp',
      enabled: true,
    },
  });

  console.log('✅ Created destinations');

  console.log('🌱 Seeding completed!');
  console.log('');
  console.log('Test credentials:');
  console.log('  Email: test@example.com');
  console.log('  Password: password123');
  console.log('');
  console.log('  Email: demo@example.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



