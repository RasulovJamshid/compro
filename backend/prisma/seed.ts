import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Uzbekistan cities and districts
const cities = ['Ташкент', 'Самарканд', 'Бухара', 'Андижан', 'Наманган', 'Фергана'];
const tashkentDistricts = [
  'Мирзо-Улугбекский', 'Чиланзарский', 'Сергелийский', 'Яккасарайский',
  'Юнусабадский', 'Шайхантахурский', 'Алмазарский', 'Яшнабадский'
];

const propertyTypes = ['office', 'warehouse', 'shop', 'cafe_restaurant', 'industrial', 'salon', 'recreation', 'other'] as const;
const dealTypes = ['sale', 'rent'] as const;
const statuses = ['active', 'inactive', 'sold', 'rented', 'under_contract'] as const;

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Cleaning database...');
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.systemSettings.deleteMany();
  await prisma.propertyView.deleteMany();
  await prisma.savedProperty.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.propertyVideo.deleteMany();
  await prisma.propertyDocument.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.property.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.user.deleteMany();

  // Create subscription plans
  console.log('📋 Creating subscription plans...');
  const plans = await prisma.subscriptionPlan.createMany({
    data: [
      {
        code: 'premium_1m',
        name: 'Premium 1 месяц',
        description: 'Полный доступ на 1 месяц',
        price: 50000,
        durationDays: 30,
        features: ['Полный доступ к контактам', 'Просмотр видео', '360-туры', 'Без ограничений'],
      },
      {
        code: 'premium_3m',
        name: 'Premium 3 месяца',
        description: 'Полный доступ на 3 месяца со скидкой',
        price: 120000,
        durationDays: 90,
        features: ['Полный доступ к контактам', 'Просмотр видео', '360-туры', 'Без ограничений', 'Скидка 20%'],
      },
      {
        code: 'premium_6m',
        name: 'Premium 6 месяцев',
        description: 'Полный доступ на 6 месяцев со скидкой',
        price: 200000,
        durationDays: 180,
        features: ['Полный доступ к контактам', 'Просмотр видео', '360-туры', 'Без ограничений', 'Скидка 33%'],
      },
      {
        code: 'premium_12m',
        name: 'Premium 1 год',
        description: 'Полный доступ на 1 год с максимальной скидкой',
        price: 350000,
        durationDays: 365,
        features: ['Полный доступ к контактам', 'Просмотр видео', '360-туры', 'Без ограничений', 'Скидка 42%', 'Приоритетная поддержка'],
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${plans.count} subscription plans`);

  // Get all plans for later use
  const allPlans = await prisma.subscriptionPlan.findMany();

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { phone: '998901234567' },
    update: {},
    create: {
      phone: '998901234567',
      role: 'admin',
      firstName: 'Администратор',
      lastName: 'Системы',
      email: 'admin@realestate.uz',
    },
  });
  console.log('✅ Admin user created');

  // Create moderator user
  console.log('👤 Creating moderator user...');
  const moderatorUser = await prisma.user.upsert({
    where: { phone: '998901234568' },
    update: {},
    create: {
      phone: '998901234568',
      role: 'moderator',
      firstName: 'Модератор',
      lastName: 'Платформы',
      email: 'moderator@realestate.uz',
    },
  });
  console.log('✅ Moderator user created');

  // Create regular users (50 users)
  console.log('👥 Creating regular users...');
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        phone: `+99890${faker.string.numeric(7)}`,
        role: 'free',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} regular users`);

  // Create subscriptions for some users
  console.log('💳 Creating subscriptions...');
  const subscriptionsCount = 20;
  for (let i = 0; i < subscriptionsCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const plan = faker.helpers.arrayElement(allPlans);
    const startDate = faker.date.past({ years: 1 });
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        startDate,
        endDate,
        status: faker.helpers.arrayElement(['active', 'expired', 'cancelled']),
      },
    });
  }
  console.log(`✅ Created ${subscriptionsCount} subscriptions`);

  // Create properties (100 properties)
  console.log('🏢 Creating properties...');
  const properties = [];
  for (let i = 0; i < 100; i++) {
    const propertyType = faker.helpers.arrayElement([...propertyTypes]);
    const dealType = faker.helpers.arrayElement([...dealTypes]);
    const city = faker.helpers.arrayElement(cities);
    const district = city === 'Ташкент' ? faker.helpers.arrayElement(tashkentDistricts) : faker.location.county();
    const area = faker.number.int({ min: 50, max: 2000 });
    const pricePerSqm = faker.number.int({ min: 5000, max: 50000 });
    const price = area * pricePerSqm;
    const status = faker.helpers.arrayElement([...statuses]);

    const property = await prisma.property.create({
      data: {
        title: `${propertyType === 'office' ? 'Офис' : propertyType === 'warehouse' ? 'Склад' : propertyType === 'shop' ? 'Торговое помещение' : propertyType === 'cafe_restaurant' ? 'Кафе/Ресторан' : propertyType === 'industrial' ? 'Производственное помещение' : propertyType === 'salon' ? 'Салон' : propertyType === 'recreation' ? 'Развлекательный центр' : 'Другое'} ${area}м² в ${city}`,
        description: faker.lorem.paragraphs(2),
        propertyType: propertyType as any,
        dealType: dealType as any,
        area,
        price,
        pricePerMonth: dealType === 'rent' ? price : null,
        hasCommission: faker.datatype.boolean(),
        city,
        district,
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude({ min: 41.2, max: 41.4 }),
        longitude: faker.location.longitude({ min: 69.1, max: 69.4 }),
        floor: faker.number.int({ min: 1, max: 20 }),
        totalFloors: faker.number.int({ min: 1, max: 25 }),
        hasParking: faker.datatype.boolean(),
        hasVideo: faker.datatype.boolean(),
        hasTour360: faker.datatype.boolean(),
        isVerified: status === 'active' ? true : false,
        isTop: faker.datatype.boolean({ probability: 0.2 }),
        status: status as any,
        contactName: faker.person.fullName(),
        contactPhone: `+99890${faker.string.numeric(7)}`,
        contactEmail: faker.internet.email(),
        viewCount: faker.number.int({ min: 0, max: 1000 }),
      },
    });
    properties.push(property);

    // Add images (2-5 images per property)
    const imageCount = faker.number.int({ min: 2, max: 5 });
    for (let j = 0; j < imageCount; j++) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          url: faker.image.urlLoremFlickr({ category: 'building' }),
          order: j,
        },
      });
    }

    // Add video (30% chance)
    if (property.hasVideo) {
      await prisma.propertyVideo.create({
        data: {
          propertyId: property.id,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnailUrl: faker.image.urlLoremFlickr({ category: 'building' }),
        },
      });
    }

    // Add documents (1-3 documents per property)
    const docCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < docCount; j++) {
      await prisma.propertyDocument.create({
        data: {
          propertyId: property.id,
          title: faker.helpers.arrayElement(['План помещения', 'Договор аренды', 'Свидетельство о собственности']),
          url: faker.internet.url(),
          type: faker.helpers.arrayElement(['brochure', 'floor_plan', 'site_plan', 'zoning']),
        },
      });
    }
  }
  console.log(`✅ Created ${properties.length} properties with images, videos, and documents`);

  // Create property views
  console.log('👁️  Creating property views...');
  const viewsCount = 500;
  for (let i = 0; i < viewsCount; i++) {
    const property = faker.helpers.arrayElement(properties);
    const user = faker.helpers.arrayElement([...users, null]); // Some views are anonymous

    await prisma.propertyView.create({
      data: {
        propertyId: property.id,
        userId: user?.id,
        viewedAt: faker.date.past({ years: 1 }),
      },
    });
  }
  console.log(`✅ Created ${viewsCount} property views`);

  // Create saved properties
  console.log('⭐ Creating saved properties...');
  const savedCount = 100;
  for (let i = 0; i < savedCount; i++) {
    const property = faker.helpers.arrayElement(properties);
    const user = faker.helpers.arrayElement(users);

    try {
      await prisma.savedProperty.create({
        data: {
          propertyId: property.id,
          userId: user.id,
        },
      });
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log(`✅ Created saved properties`);

  // Create reviews (80 reviews)
  console.log('⭐ Creating reviews...');
  const reviewsCount = 80;
  for (let i = 0; i < reviewsCount; i++) {
    const property = faker.helpers.arrayElement(properties);
    const user = faker.helpers.arrayElement(users);
    const status = faker.helpers.arrayElement(['pending', 'approved', 'rejected']);

    await prisma.review.create({
      data: {
        propertyId: property.id,
        userId: user.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        status: status as any,
        moderatedBy: status !== 'pending' ? moderatorUser.id : null,
        moderatedAt: status !== 'pending' ? faker.date.recent({ days: 30 }) : null,
      },
    });
  }
  console.log(`✅ Created ${reviewsCount} reviews`);

  // Create transactions (60 transactions)
  console.log('💰 Creating transactions...');
  const transactionsCount = 60;
  for (let i = 0; i < transactionsCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
      include: { plan: true },
    });

    if (subscription) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          subscriptionId: subscription.id,
          amount: subscription.plan.price,
          currency: 'UZS',
          status: faker.helpers.arrayElement(['pending', 'completed', 'failed', 'refunded']) as any,
          paymentMethod: faker.helpers.arrayElement(['payme', 'click', 'uzum', 'card', 'cash']) as any,
          transactionId: faker.string.alphanumeric(20),
          description: `Оплата подписки ${subscription.plan.name}`,
        },
      });
    }
  }
  console.log(`✅ Created ${transactionsCount} transactions`);

  // Create system settings
  console.log('⚙️  Creating system settings...');
  const settings = [
    // General settings
    { key: 'general_siteName', value: 'Commercial Real Estate', category: 'general' },
    { key: 'general_siteDescription', value: 'Платформа коммерческой недвижимости Узбекистана', category: 'general' },
    { key: 'general_contactEmail', value: 'info@realestate.uz', category: 'general' },
    { key: 'general_contactPhone', value: '+998712345678', category: 'general' },
    { key: 'general_timezone', value: 'Asia/Tashkent', category: 'general' },
    { key: 'general_language', value: 'ru', category: 'general' },
    
    // Notification settings
    { key: 'notifications_emailEnabled', value: true, category: 'notifications' },
    { key: 'notifications_smsEnabled', value: true, category: 'notifications' },
    { key: 'notifications_newPropertyAlert', value: true, category: 'notifications' },
    { key: 'notifications_priceChangeAlert', value: true, category: 'notifications' },
    
    // Security settings
    { key: 'security_twoFactorEnabled', value: false, category: 'security' },
    { key: 'security_sessionTimeout', value: 3600, category: 'security' },
    { key: 'security_maxLoginAttempts', value: 5, category: 'security' },
    { key: 'security_passwordMinLength', value: 8, category: 'security' },
    
    // Property settings
    { key: 'properties_autoApprove', value: false, category: 'properties' },
    { key: 'properties_maxImages', value: 10, category: 'properties' },
    { key: 'properties_requireVerification', value: true, category: 'properties' },
    { key: 'properties_topListingDays', value: 30, category: 'properties' },
    
    // Payment settings
    { key: 'payments_payme_enabled', value: true, category: 'payments' },
    { key: 'payments_click_enabled', value: true, category: 'payments' },
    { key: 'payments_uzum_enabled', value: true, category: 'payments' },
    { key: 'payments_commission_rate', value: 5, category: 'payments' },
  ];

  for (const setting of settings) {
    await prisma.systemSettings.create({
      data: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
        updatedBy: adminUser.id,
      },
    });
  }
  console.log(`✅ Created ${settings.length} system settings`);

  // Summary
  console.log('\n📊 Seeding Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👥 Users: ${users.length + 2} (${users.length} regular + 1 admin + 1 moderator)`);
  console.log(`🏢 Properties: ${properties.length}`);
  console.log(`📋 Subscription Plans: ${allPlans.length}`);
  console.log(`💳 Subscriptions: ${subscriptionsCount}`);
  console.log(`⭐ Reviews: ${reviewsCount}`);
  console.log(`💰 Transactions: ${transactionsCount}`);
  console.log(`👁️  Property Views: ${viewsCount}`);
  console.log(`⚙️  System Settings: ${settings.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
