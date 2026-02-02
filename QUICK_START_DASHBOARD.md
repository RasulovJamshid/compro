# 🚀 Quick Start - Dashboard Access

## ✅ Users Created Successfully!

### 🔴 Admin Login
```
URL:   http://localhost:3002
Phone: +998901234567  (or just 998901234567)
Code:  123456
```
**Full Access** - All dashboard sections

---

### 🟣 Moderator Login
```
URL:   http://localhost:3002
Phone: +998901234568  (or just 998901234568)
Code:  123456
```
**Limited Access** - Properties, Analytics, Reviews

---

### 🟡 Premium User (Frontend Only)
```
URL:   http://localhost:3000
Phone: +998901234569  (or just 998901234569)
Code:  123456
```
**No Dashboard Access** - Can use main website

---

### 🔵 Free User (Frontend Only)
```
URL:   http://localhost:3000
Phone: +998901234570  (or just 998901234570)
Code:  123456
```
**No Dashboard Access** - Can use main website

---

## 📝 Login Steps

1. **Open Dashboard**: http://localhost:3002
2. **Enter Phone**: `+998901234567` (for admin)
3. **Click** "Получить код"
4. **Enter Code**: `123456`
5. **Click** "Войти"
6. **Done!** You're in the dashboard

---

## 🎯 What You Can Do

### Admin User
- ✅ View statistics and overview
- ✅ Manage all properties
- ✅ Moderate property listings
- ✅ Manage users and roles
- ✅ View analytics
- ✅ Access payment history
- ✅ Manage reviews
- ✅ Generate reports
- ✅ Configure settings

### Moderator User
- ✅ View statistics
- ✅ Manage properties
- ✅ Moderate listings
- ❌ Cannot manage users
- ✅ View analytics
- ❌ Cannot access payments
- ✅ Manage reviews
- ❌ Cannot generate reports
- ❌ Cannot change settings

---

## 🔧 Troubleshooting

### "Invalid Code" Error
- Make sure `DEV_MODE=true` in docker-compose.yml
- Restart backend: `docker-compose restart backend`
- Use code: `123456`

### "Access Denied" Error
- Check you're using admin or moderator phone
- Verify user exists: 
  ```bash
  docker exec -it realestate-db psql -U postgres -d realestate -c "SELECT phone, role FROM users WHERE phone = '+998901234567';"
  ```

### CORS Error
- Backend should be running on port 3001
- Check: `docker ps | grep backend`
- Restart: `docker-compose restart backend`

---

## 📚 Full Documentation
- [DASHBOARD_ACCESS.md](./DASHBOARD_ACCESS.md) - Complete guide
- [DOCKER.md](./DOCKER.md) - Docker setup
- [README.md](./README.md) - Project overview

---

## 🎉 You're Ready!
Open http://localhost:3002 and login with admin credentials to start managing your platform!
