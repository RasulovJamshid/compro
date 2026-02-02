# Database Migration Guide

## 🎯 Overview

This guide will help you migrate the database to add the new models (Review, Transaction, SystemSettings) required for the fully integrated dashboard.

---

## ⚠️ Prerequisites

1. **Backup your database** before running any migrations
2. Ensure PostgreSQL is running
3. Verify backend environment variables are set correctly
4. Stop any running backend instances

---

## 📋 Step-by-Step Migration

### **Step 1: Navigate to Backend Directory**

```bash
cd backend
```

### **Step 2: Generate Migration**

This will create a new migration file based on schema changes:

```bash
npx prisma migrate dev --name add_reviews_transactions_settings
```

**What this does:**
- Creates a new migration file in `prisma/migrations/`
- Applies the migration to your development database
- Generates the Prisma Client with new models

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "realestate_db", schema "public" at "localhost:5432"

Applying migration `20260119_add_reviews_transactions_settings`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260119_add_reviews_transactions_settings/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client
```

### **Step 3: Verify Migration**

Check that the migration was created:

```bash
ls prisma/migrations/
```

You should see a new folder with today's date and the migration name.

### **Step 4: Review Migration SQL (Optional)**

View the SQL that was executed:

```bash
cat prisma/migrations/[MIGRATION_FOLDER]/migration.sql
```

**Expected SQL includes:**
- `CREATE TYPE "ReviewStatus"` enum
- `CREATE TYPE "TransactionStatus"` enum
- `CREATE TYPE "PaymentMethod"` enum
- `CREATE TABLE "reviews"` with all fields
- `CREATE TABLE "transactions"` with all fields
- `CREATE TABLE "system_settings"` with all fields
- Indexes and constraints

### **Step 5: Verify Database Tables**

Connect to your database and verify tables were created:

```bash
# Using psql
psql -U your_username -d realestate_db

# List tables
\dt

# Check reviews table
\d reviews

# Check transactions table
\d transactions

# Check system_settings table
\d system_settings

# Exit psql
\q
```

### **Step 6: Generate Prisma Client (if needed)**

If you skipped step 2 or need to regenerate:

```bash
npx prisma generate
```

### **Step 7: Restart Backend**

```bash
npm run start:dev
```

---

## 🧪 Testing the Migration

### **Test 1: Check API Endpoints**

```bash
# Test reviews endpoint (should return empty array initially)
curl -X GET http://localhost:3001/api/admin/reviews \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test transactions endpoint
curl -X GET http://localhost:3001/api/admin/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test settings endpoint
curl -X GET http://localhost:3001/api/admin/settings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Test 2: Create Test Data**

**Create a test review:**
```sql
INSERT INTO reviews (id, "propertyId", "userId", rating, comment, status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'existing-property-id',
  'existing-user-id',
  5,
  'Test review',
  'pending',
  NOW(),
  NOW()
);
```

**Create a test transaction:**
```sql
INSERT INTO transactions (id, "userId", amount, currency, status, "paymentMethod", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'existing-user-id',
  100000,
  'UZS',
  'completed',
  'payme',
  NOW(),
  NOW()
);
```

**Create a test setting:**
```sql
INSERT INTO system_settings (id, key, value, category, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'general_siteName',
  '"Commercial Real Estate"'::jsonb,
  'general',
  NOW(),
  NOW()
);
```

### **Test 3: Verify Frontend**

1. Open dashboard: `http://localhost:5173`
2. Navigate to Reviews page - should load without errors
3. Navigate to Payments page - should load without errors
4. Navigate to Reports page - should load without errors
5. Navigate to Settings page - should load without errors

---

## 🔄 Rollback (If Needed)

If something goes wrong, you can rollback:

### **Option 1: Rollback Last Migration**

```bash
npx prisma migrate resolve --rolled-back [MIGRATION_NAME]
```

### **Option 2: Reset Database (Development Only)**

⚠️ **WARNING: This will delete all data!**

```bash
npx prisma migrate reset
```

This will:
- Drop the database
- Create a new database
- Apply all migrations
- Run seed script (if configured)

### **Option 3: Manual Rollback**

```sql
-- Drop tables
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "ReviewStatus";
DROP TYPE IF EXISTS "TransactionStatus";
DROP TYPE IF EXISTS "PaymentMethod";
```

---

## 🚀 Production Deployment

### **Step 1: Backup Production Database**

```bash
pg_dump -U username -d production_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### **Step 2: Deploy Migration**

```bash
# On production server
cd backend
npx prisma migrate deploy
```

**Note:** `migrate deploy` is used in production (not `migrate dev`)

### **Step 3: Verify Production**

- Check logs for errors
- Test API endpoints
- Verify frontend pages load
- Monitor database performance

---

## 📊 Expected Database Changes

### **New Tables:**

1. **reviews** (9 columns)
   - id, propertyId, userId, rating, comment
   - status, moderatedBy, moderatedAt
   - createdAt, updatedAt

2. **transactions** (12 columns)
   - id, userId, subscriptionId, amount, currency
   - status, paymentMethod, transactionId
   - description, metadata
   - createdAt, updatedAt

3. **system_settings** (7 columns)
   - id, key, value, category
   - description, updatedBy
   - createdAt, updatedAt

### **New Enums:**

1. **ReviewStatus**: pending, approved, rejected
2. **TransactionStatus**: pending, completed, failed, refunded
3. **PaymentMethod**: payme, click, uzum, card, cash

---

## 🐛 Troubleshooting

### **Error: "Migration failed to apply"**

**Solution:**
1. Check PostgreSQL is running
2. Verify database credentials in `.env`
3. Check database user has CREATE permissions
4. Review error logs for specific SQL errors

### **Error: "Prisma Client not found"**

**Solution:**
```bash
npx prisma generate
npm install
```

### **Error: "Column already exists"**

**Solution:**
- You may have run the migration twice
- Check database state with `\d table_name`
- Either rollback or manually fix the schema

### **Error: "Foreign key constraint violation"**

**Solution:**
- Ensure referenced tables (users, properties) exist
- Check that test data uses valid IDs
- Review the migration SQL for constraint definitions

---

## ✅ Post-Migration Checklist

- [ ] Migration applied successfully
- [ ] All new tables created
- [ ] Prisma Client regenerated
- [ ] Backend starts without errors
- [ ] API endpoints respond correctly
- [ ] Frontend pages load without errors
- [ ] Test data can be created
- [ ] Production backup created (if deploying)
- [ ] Production migration successful (if deploying)

---

## 📞 Support

If you encounter issues:

1. Check backend logs: `npm run start:dev`
2. Check Prisma logs in console
3. Verify database connection
4. Review migration SQL file
5. Check this guide's troubleshooting section

---

**Created:** January 19, 2026
**Last Updated:** January 19, 2026
