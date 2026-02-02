# Migration from TypeORM to Prisma

## ✅ What's Done

1. **Prisma Schema** created at `backend/prisma/schema.prisma`
2. **PrismaModule & PrismaService** created
3. **Seed script** created at `backend/prisma/seed.ts`
4. **package.json** updated with Prisma dependencies
5. **Environment variables** updated for Prisma

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI (dev dependency)

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

### 3. Create Database & Run Migration

```bash
# Push schema to database (creates tables)
npm run prisma:push

# OR create a migration
npm run prisma:migrate
```

### 4. Seed Database

```bash
npm run prisma:seed
```

This will create:
- 3 subscription plans
- 1 admin user (+998901234567)
- 3 sample properties

### 5. Update .env File

```bash
cp ../.env.example ../.env
```

Edit `.env` and update:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realestate?schema=public"
```

## 📝 Next Steps - Update Services

You need to update all services to use Prisma instead of TypeORM:

### Example: Update AuthService

**Before (TypeORM):**
```typescript
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>,
) {}

const user = await this.userRepository.findOne({ where: { phone } });
```

**After (Prisma):**
```typescript
import { PrismaService } from '../prisma/prisma.service';

constructor(
  private prisma: PrismaService,
) {}

const user = await this.prisma.user.findUnique({ where: { phone } });
```

### Services to Update:

1. **auth.service.ts** - User authentication
2. **users.service.ts** - User management
3. **properties.service.ts** - Property CRUD
4. **subscriptions.service.ts** - Subscription management
5. **admin.service.ts** - Admin operations

### Common Prisma Operations:

```typescript
// Find one
await prisma.user.findUnique({ where: { id } });
await prisma.user.findFirst({ where: { phone } });

// Find many
await prisma.property.findMany({
  where: { city: 'Ташкент' },
  include: { images: true, videos: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Create
await prisma.user.create({
  data: { phone, role: 'free' },
});

// Update
await prisma.user.update({
  where: { id },
  data: { firstName, lastName },
});

// Delete
await prisma.property.delete({ where: { id } });

// Count
await prisma.property.count({ where: { city: 'Ташкент' } });
```

## 🔧 Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to DB (no migration files)
npm run prisma:push

# Create migration
npm run prisma:migrate

# Open Prisma Studio (GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## 🐳 Docker Setup

The `docker-compose.yml` has been updated. Rebuild containers:

```bash
docker-compose down
docker-compose up --build
```

Inside the container, Prisma will automatically:
1. Generate the client during build
2. Connect to PostgreSQL using DATABASE_URL

## 📊 Prisma Studio

View and edit your data with Prisma Studio:

```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

## ⚠️ Important Notes

1. **Remove TypeORM** entities folder after migration is complete
2. **Update app.module.ts** to import PrismaModule instead of TypeOrmModule
3. **Lint errors** will disappear after `npm install`
4. **Type safety** - Prisma generates types automatically
5. **Relations** are handled automatically by Prisma

## 🎯 Benefits of Prisma

✅ **Type-safe** - Auto-generated types  
✅ **Better DX** - Intuitive API  
✅ **Migrations** - Version controlled schema changes  
✅ **Prisma Studio** - Built-in database GUI  
✅ **Performance** - Optimized queries  
✅ **Modern** - Active development and community  

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma with NestJS](https://docs.nestjs.com/recipes/prisma)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
