# 🚀 START HERE - Deployment Quick Start

**Goal:** Deploy your Commercial Real Estate Platform to procom.uz with SSL

**Time:** 1-2 hours

---

## 📚 Choose Your Path

### Path 1: Complete Step-by-Step Guide (Recommended for First Time)
👉 **[SERVER_SETUP_COMPLETE_GUIDE.md](./SERVER_SETUP_COMPLETE_GUIDE.md)**

**Best for:**
- First time deploying
- Want detailed explanations
- Need help with each step

**Includes:**
- SSH setup
- Software installation
- Database configuration
- SSL setup
- Complete deployment

---

### Path 2: Quick Checklist (For Experienced Users)
👉 **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

**Best for:**
- Have deployed before
- Know Linux basics
- Want quick reference

**Format:**
- Checkbox list
- Quick commands
- No explanations

---

## 🎯 What You Need Before Starting

### Required
- [ ] Server (VPS) with Ubuntu 20.04+
- [ ] Server IP address: `_______________`
- [ ] Root/sudo access
- [ ] Domain: procom.uz
- [ ] 1-2 hours of time

### Optional (Can Add Later)
- [ ] SMS API key (Eskiz.uz)
- [ ] Payment gateway keys (Payme, Click)
- [ ] Mapbox token

---

## 📖 All Available Documentation

### Getting Started
1. **[SERVER_SETUP_COMPLETE_GUIDE.md](./SERVER_SETUP_COMPLETE_GUIDE.md)** ⭐ Start here!
2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Quick checklist

### Deployment Methods
3. **[DEPLOYMENT_UPLOAD_GUIDE.md](./DEPLOYMENT_UPLOAD_GUIDE.md)** - How to upload code
4. **[DEPLOYMENT_METHODS_COMPARISON.md](./DEPLOYMENT_METHODS_COMPARISON.md)** - Compare options

### Automation
5. **[CI_CD_SETUP_GUIDE.md](./CI_CD_SETUP_GUIDE.md)** - Auto-deployment (FREE)
6. **[DEPLOYMENT_CONTROL_GUIDE.md](./DEPLOYMENT_CONTROL_GUIDE.md)** - Manual vs Auto

### Reference
7. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete reference
8. **[DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md)** - Quick commands
9. **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - Overview

---

## 🎬 Quick Overview

### What Will Happen

```
1. Connect to Server (SSH)
   ↓
2. Install Software (Node.js, PostgreSQL, Nginx, PM2)
   ↓
3. Setup Database
   ↓
4. Push Code to GitHub
   ↓
5. Clone on Server
   ↓
6. Configure Environment (.env)
   ↓
7. Setup SSL Certificates (Let's Encrypt)
   ↓
8. Configure Nginx (Reverse Proxy)
   ↓
9. Build Applications
   ↓
10. Start with PM2
   ↓
11. Test Everything
   ↓
🎉 LIVE at https://procom.uz
```

---

## ⚡ Super Quick Start (If You Know What You're Doing)

### On Your Server
```bash
# 1. Install everything
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs postgresql nginx git
sudo npm install -g pm2

# 2. Setup database
sudo -u postgres psql -c "CREATE DATABASE realestate_prod;"
sudo -u postgres psql -c "CREATE USER prod_user WITH PASSWORD 'YourPassword';"
sudo -u postgres psql -c "GRANT ALL ON DATABASE realestate_prod TO prod_user;"

# 3. Clone project
sudo mkdir -p /var/www/procom.uz
sudo chown -R $USER:$USER /var/www/procom.uz
cd /var/www/procom.uz
git clone YOUR-REPO .

# 4. Configure
cp .env.production .env
nano .env  # Edit values

# 5. Setup SSL
sudo bash scripts/setup-ssl.sh

# 6. Configure Nginx
sudo cp nginx/procom.uz.conf /etc/nginx/sites-available/procom.uz
sudo ln -s /etc/nginx/sites-available/procom.uz /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 7. Build & Deploy
bash scripts/deploy.sh

# 8. Start
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Done!** Visit https://procom.uz

---

## 🆘 Need Help?

### Common Issues

**Can't connect to server?**
- Check server IP
- Check SSH port (22)
- Check firewall

**DNS not working?**
- Wait 5-30 minutes for propagation
- Check DNS records: `ping procom.uz`

**SSL certificate failed?**
- Ensure DNS is working first
- Check domain points to server
- Try again: `sudo certbot renew --force-renewal`

**Application won't start?**
- Check logs: `pm2 logs`
- Check .env file
- Check database connection

### Get More Help

1. **Check logs:** `pm2 logs`
2. **Check Nginx:** `sudo tail -f /var/log/nginx/error.log`
3. **Review guides:** See documentation list above
4. **Troubleshooting section:** In SERVER_SETUP_COMPLETE_GUIDE.md

---

## 📊 What You'll Get

### After Deployment

**Live URLs:**
- 🌐 Frontend: https://procom.uz
- 📡 API: https://api.procom.uz
- 📚 API Docs: https://api.procom.uz/api/docs
- 📊 Dashboard: https://dashboard.procom.uz

**Features:**
- ✅ SSL/HTTPS (A+ rating)
- ✅ Auto-restart on crash
- ✅ Nginx reverse proxy
- ✅ Rate limiting
- ✅ Security headers
- ✅ Compressed responses
- ✅ Static file caching

**Management:**
- `pm2 status` - Check apps
- `pm2 logs` - View logs
- `pm2 restart all` - Restart
- `bash scripts/deploy.sh` - Update

---

## 🎓 Learning Path

### If You're New to Server Deployment

**Day 1: Setup (1-2 hours)**
- Follow [SERVER_SETUP_COMPLETE_GUIDE.md](./SERVER_SETUP_COMPLETE_GUIDE.md)
- Get application running
- Test all URLs

**Day 2: Understanding (30 min)**
- Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Understand each component
- Learn PM2 commands

**Day 3: Automation (30 min)**
- Setup CI/CD: [CI_CD_SETUP_GUIDE.md](./CI_CD_SETUP_GUIDE.md)
- Enable auto-deployment
- Test with a change

**Day 4: Maintenance (ongoing)**
- Setup backups
- Monitor logs
- Update as needed

---

## 💡 Pro Tips

### Before You Start
1. ✅ Read through the complete guide once
2. ✅ Prepare all credentials (database password, JWT secret)
3. ✅ Ensure DNS is configured
4. ✅ Have 1-2 hours of uninterrupted time

### During Deployment
1. ✅ Follow steps in order
2. ✅ Don't skip verification steps
3. ✅ Save important credentials
4. ✅ Test each component before moving on

### After Deployment
1. ✅ Test all URLs
2. ✅ Check SSL rating
3. ✅ Setup backups
4. ✅ Document your setup

---

## 🎯 Next Steps After Deployment

### Immediate (Day 1)
- [ ] Test all features
- [ ] Add your content
- [ ] Test user registration
- [ ] Test property creation

### Soon (Week 1)
- [ ] Setup database backups
- [ ] Configure monitoring
- [ ] Setup CI/CD for auto-deployment
- [ ] Add real API keys (SMS, Payment, Maps)

### Later (Month 1)
- [ ] Setup staging environment
- [ ] Configure CDN (optional)
- [ ] Setup error tracking (Sentry)
- [ ] Performance optimization

---

## 📞 Support

### Documentation
- All guides are in the project root
- Each guide has troubleshooting section
- Quick reference available

### Commands Reference
- **[DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md)** - All commands

### Logs
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# Database logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## ✅ Ready to Start?

### Choose Your Guide:

**👉 New to deployment?**
Start with: **[SERVER_SETUP_COMPLETE_GUIDE.md](./SERVER_SETUP_COMPLETE_GUIDE.md)**

**👉 Have experience?**
Use: **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

**👉 Want automation?**
Setup: **[CI_CD_SETUP_GUIDE.md](./CI_CD_SETUP_GUIDE.md)**

---

**Good luck with your deployment! 🚀**

You've got this! The guides are comprehensive and tested. Just follow step by step.

**Questions?** Check the troubleshooting sections in each guide.

**Stuck?** Review the logs: `pm2 logs` and `/var/log/nginx/error.log`

**Success?** Celebrate! 🎉 Your app is live at https://procom.uz
