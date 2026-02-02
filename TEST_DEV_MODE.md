# 🧪 Test DEV_MODE - SMS Disabled

## Quick Test

### 1. Request Verification Code
```bash
curl -X POST http://localhost:3001/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+998901234567"}'
```

**Expected Response:**
```json
{
  "message": "Verification code sent"
}
```

### 2. Check Backend Logs
```bash
docker-compose logs -f backend
```

**You should see:**
```
📱 [DEV MODE] SMS would be sent:
   To: +998901234567
   Message: Your verification code is: XXXXXX
   (SMS sending disabled in dev mode)
```

### 3. Copy the Code and Verify
```bash
curl -X POST http://localhost:3001/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "code": "XXXXXX"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "phone": "+998901234567",
    "role": "free"
  }
}
```

---

## ✅ Success Indicators

- ✅ No actual SMS sent
- ✅ Verification code visible in logs
- ✅ Authentication works normally
- ✅ No SMS API errors
- ✅ No SMS costs

---

## 🔄 Switch to Production Mode

### Update docker-compose.yml:
```yaml
environment:
  DEV_MODE: "false"  # Enable SMS
```

### Restart:
```bash
docker-compose restart backend
```

Now SMS will be sent via the real SMS API!

---

## 📊 Current Status

**DEV_MODE**: ✅ Enabled (true)
**SMS Sending**: ❌ Disabled
**Console Logging**: ✅ Enabled
**Authentication**: ✅ Working

Perfect for development! 🚀
