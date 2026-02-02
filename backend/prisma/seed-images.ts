import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Free stock photo URLs for commercial real estate
const sampleImages = {
  office: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  ],
  warehouse: [
    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=800',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800',
  ],
  shop: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
    'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800',
  ],
  cafe_restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
  ],
  industrial: [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800',
  ],
  salon: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
    'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800',
  ],
  recreation: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
  ],
  other: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  ],
};

async function main() {
  console.log('🖼️  Starting to add sample images to properties...');

  // Get all properties
  const properties = await prisma.property.findMany({
    include: {
      images: true,
    },
  });

  console.log(`📊 Found ${properties.length} properties`);

  let addedCount = 0;
  let skippedCount = 0;

  for (const property of properties) {
    // Skip if property already has images
    if (property.images && property.images.length > 0) {
      console.log(`⏭️  Skipping ${property.title} - already has ${property.images.length} images`);
      skippedCount++;
      continue;
    }

    // Get images for property type
    const propertyType = property.propertyType as keyof typeof sampleImages;
    const imageUrls = sampleImages[propertyType] || sampleImages.other;

    // Add 3-5 random images for each property
    const numImages = Math.floor(Math.random() * 3) + 3; // 3 to 5 images
    const selectedImages = imageUrls.slice(0, numImages);

    // Create images
    for (let i = 0; i < selectedImages.length; i++) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          url: selectedImages[i],
          isCover: i === 0, // First image is cover
          order: i,
        },
      });
    }

    console.log(`✅ Added ${selectedImages.length} images to: ${property.title}`);
    addedCount++;
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Properties updated: ${addedCount}`);
  console.log(`   ⏭️  Properties skipped: ${skippedCount}`);
  console.log(`   📷 Total images added: ${addedCount * 4} (approx)`);
  console.log('\n🎉 Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
