# 🛠️ Development Mode Guide

## Overview

The application now supports **DEV_MODE** to disable SMS sending during development, making it easier to test authentication without needing real SMS credentials or incurring SMS costs.

---

## 🎯 What DEV_MODE Does

When `DEV_MODE=true`:
- ✅ SMS messages are **logged to console** instead of being sent
- ✅ No SMS API calls are made
- ✅ No SMS costs incurred
- ✅ Authentication still works normally
- ✅ You can see what SMS would have been sent

### Console Output Example:
```
📱 [DEV MODE] SMS would be sent:
   To: +998901234567
   Message: Your verification code is: 123456
   (SMS sending disabled in dev mode)
```

---

## ⚙️ Configuration

### Development (Default)

**docker-compose.yml**:
```yaml
environment:
  NODE_ENV: development
  DEV_MODE: "true"  # SMS disabled
```

### Production

**docker-compose.prod.yml**:
```yaml
environment:
  NODE_ENV: production
  DEV_MODE: "false"  # SMS enabled
```

Or use environment variables:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🚀 Usage

### Start in Development Mode (SMS Disabled)
```bash
# Default - DEV_MODE is already set to true
docker-compose up -d

# Or explicitly
DEV_MODE=true docker-compose up -d
```

### Start in Production Mode (SMS Enabled)
```bash
# Using production compose file
docker-compose -f docker-compose.prod.yml up -d

# Or override environment variable
DEV_MODE=false docker-compose up -d
```

### Toggle DEV_MODE Without Rebuild
```bash
# Edit docker-compose.yml and change:
DEV_MODE: "true"  # to "false"

# Then restart backend
docker-compose restart backend
```

---

## 🧪 Testing Authentication in DEV_MODE

### 1. Request Verification Code
```bash
curl -X POST http://localhost:3001/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+998901234567"}'
```

### 2. Check Backend Logs for Code
```bash
docker-compose logs -f backend
```

You'll see:
```
📱 [DEV MODE] SMS would be sent:
   To: +998901234567
   Message: Your verification code is: 123456
   (SMS sending disabled in dev mode)
```

### 3. Use the Code to Login
```bash
curl -X POST http://localhost:3001/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "code": "123456"
  }'
```

---

## 📋 Environment Variables

### Required in All Modes
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realestate
JWT_SECRET=your-secret-key
```

### Required Only in Production (DEV_MODE=false)
```env
SMS_API_KEY=your-actual-sms-api-key
SMS_API_URL=https://notify.eskiz.uz/api
```

### Optional in Development (DEV_MODE=true)
```env
SMS_API_KEY=dummy-key  # Not used in dev mode
SMS_API_URL=dummy-url  # Not used in dev mode
```

---

## 🔐 Security Notes

### Development
- ✅ Safe to use dummy SMS credentials
- ✅ No real SMS sent
- ✅ Verification codes logged to console
- ⚠️ **Never expose dev mode in production**

### Production
- ✅ Real SMS sent via API
- ✅ Verification codes not logged
- ✅ Secure SMS provider required
- ⚠️ **Always set DEV_MODE=false**

---

## 🐛 Troubleshooting

### SMS Not Being Sent (Even in Production)

**Check DEV_MODE setting:**
```bash
docker-compose exec backend env | grep DEV_MODE
```

Should show:
- Development: `DEV_MODE=true`
- Production: `DEV_MODE=false`

**Check logs:**
```bash
docker-compose logs backend | grep SMS
```

### Can't See Verification Code in Logs

**Make sure you're watching logs:**
```bash
docker-compose logs -f backend
```

**Or check recent logs:**
```bash
docker-compose logs --tail=50 backend
```

### Authentication Not Working

**Verify backend is running:**
```bash
docker-compose ps
```

**Check backend health:**
```bash
curl http://localhost:3001/api
```

---

## 📊 Comparison Table

| Feature | DEV_MODE=true | DEV_MODE=false |
|---------|---------------|----------------|
| SMS Sent | ❌ No | ✅ Yes |
| Console Logs | ✅ Shows code | ❌ Hidden |
| SMS API Called | ❌ No | ✅ Yes |
| SMS Costs | ✅ Free | 💰 Paid |
| Auth Works | ✅ Yes | ✅ Yes |
| Production Ready | ❌ No | ✅ Yes |

---

## 🎯 Best Practices

### Development
1. ✅ Always use `DEV_MODE=true`
2. ✅ Use dummy SMS credentials
3. ✅ Watch logs for verification codes
4. ✅ Test authentication flow regularly

### Production
1. ✅ Always use `DEV_MODE=false`
2. ✅ Use real SMS API credentials
3. ✅ Monitor SMS delivery rates
4. ✅ Set up SMS provider alerts
5. ✅ Keep SMS API keys secure

### CI/CD
```yaml
# .github/workflows/deploy.yml
env:
  DEV_MODE: false
  NODE_ENV: production
```

---

## 🔄 Migration from Old Setup

If you're upgrading from a version without DEV_MODE:

### 1. Update docker-compose.yml
```yaml
environment:
  DEV_MODE: "true"  # Add this line
```

### 2. Restart Backend
```bash
docker-compose restart backend
```

### 3. Verify
```bash
# Check logs for dev mode message
docker-compose logs backend | grep "DEV MODE"
```

---

## 📚 Related Files

- `backend/src/auth/sms.service.ts` - SMS service with dev mode logic
- `docker-compose.yml` - Development configuration
- `docker-compose.prod.yml` - Production configuration
- `.env.example` - Environment variables template

---

## ✨ Benefits

### For Developers
- 🚀 Faster development (no SMS delays)
- 💰 No SMS costs during testing
- 🔍 Easy debugging (codes in logs)
- 🛠️ No SMS provider setup needed

### For Teams
- 👥 Multiple developers can test simultaneously
- 🔄 CI/CD pipelines work without SMS
- 🧪 Automated testing possible
- 📊 Better development experience

---

## 🎉 Summary

**Development Mode** makes it easy to develop and test authentication features without needing real SMS infrastructure. Simply set `DEV_MODE=true` in development and `DEV_MODE=false` in production.

**Current Setup:**
- ✅ DEV_MODE enabled by default in docker-compose.yml
- ✅ SMS messages logged to console
- ✅ Authentication works normally
- ✅ No SMS costs during development
- ✅ Production-ready when DEV_MODE=false

Happy coding! 🚀
