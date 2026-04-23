# ⚡ Quick Start Guide

Get your Hospital Appointment Booking System running in 5 minutes!

## 📋 Prerequisites Checklist

- ✅ Node.js v16+ installed
- ✅ MongoDB running locally or Atlas account
- ✅ npm installed
- ✅ Git installed

## 🚀 Start in 3 Commands

### Step 1: Backend Setup (2 minutes)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected
```

### Step 2: Frontend Setup (2 minutes)

```bash
cd ../frontend
npm install
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Step 3: Access Application

- 🏥 **Patient Portal:** http://localhost:3000
- 👨‍💼 **Admin Login:** http://localhost:3000/admin/login
- 🔌 **API:** http://localhost:5000/api

## 📝 Demo Credentials

### Admin Account
```
Email: admin@hospital.com
Password: admin@123
```

### Create Patient Account
- Click "Get Started" on home page
- Fill registration form
- Use any email for testing

## ⚙️ Configuration (5 minutes)

### 1. Update Backend `.env` File

```bash
cd backend
nano .env
```

**Minimal Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/hospital-booking
JWT_SECRET=your_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
PORT=5000

# For testing, these can be left as is:
STRIPE_SECRET_KEY=sk_test_fake
PAYPAL_CLIENT_ID=fake_id
RAZORPAY_KEY_ID=fake_key
TWILIO_ACCOUNT_SID=fake_sid
```

### 2. Start MongoDB (if local)

```bash
# macOS
mongod

# Windows - ensure MongoDB service is running
# Linux
sudo systemctl start mongod
```

### 3. Verify Setup

```bash
# Test API health
curl http://localhost:5000/api/health

# Should return:
# {"status":"API is running"}
```

## 🧪 First Test Flow (5 minutes)

### 1. Patient Registration

1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill registration details
4. Click Register

### 2. Browse Doctors

1. Click "Browse Doctors"
2. See list of available specialties

### 3. Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Use admin credentials
3. Explore dashboard

## 📁 Project Structure Overview

```
BOOKINGS/
├── backend/
│   ├── src/
│   │   ├── models/         ← Database schemas
│   │   ├── controllers/    ← Business logic
│   │   ├── routes/         ← API endpoints
│   │   └── server.js       ← Start here
│   └── .env                ← Configuration
│
└── frontend/
    ├── src/
    │   ├── pages/          ← Page components
    │   ├── store/          ← State management
    │   └── App.jsx         ← Main app
    └── vite.config.js      ← Build config
```

## 🆘 Troubleshooting

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh

# If error, start MongoDB:
mongod
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### npm install fails
```bash
# Clear cache
npm cache clean --force

# Retry
npm install
```

### Frontend API 404 Errors
```bash
# Ensure backend is running on port 5000
curl http://localhost:5000/api/health

# Check VITE_API_URL in frontend
echo $VITE_API_URL
```

## ✨ Key Features to Try

### As Patient
- ✅ Register & login
- ✅ Browse doctors
- ✅ Book appointment
- ✅ Make payment (stripe test card: 4242-4242-4242-4242)
- ✅ Cancel appointment
- ✅ Rate doctor

### As Admin
- ✅ View dashboard
- ✅ Manage users
- ✅ Add doctors
- ✅ View reports

## 🔑 Test Payment Card

**Stripe Test Card:**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

## 📊 Useful Commands

```bash
# View logs
npm run dev  # Verbose output

# Build for production
npm run build

# Check code
npm run lint

# Database backup
mongodump -d hospital-booking -o ./backup
```

## 🌐 API Endpoints Cheatsheet

```bash
# Register
POST /api/auth/register

# Login
POST /api/auth/login

# Get doctors
GET /api/doctors

# Create appointment
POST /api/appointments

# Admin dashboard
GET /api/admin/dashboard
```

## 📚 Documentation Files

1. **README.md** - Full feature list
2. **SETUP.md** - Detailed setup
3. **API_TESTING_GUIDE.md** - API documentation
4. **IMPLEMENTATION_SUMMARY.md** - What's included

## 🎯 Next Steps

1. **Customize Configuration**
   - Update colors in CSS
   - Change hospital name
   - Add your logo

2. **Add Real Payment Keys**
   - Get Stripe API key
   - Get PayPal credentials
   - Update in .env

3. **Setup Email Service**
   - Get Gmail app password
   - Configure Nodemailer
   - Test email sending

4. **Deploy**
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel/Netlify

## 💡 Pro Tips

- Use Postman to test APIs
- Enable email in .env for notifications
- Add sample doctors through admin panel
- Test payment with stripe test card
- Check MongoDB compass for data

## 🚀 Ready to Deploy?

When ready for production:

1. Update `.env` with real credentials
2. Set `NODE_ENV=production`
3. Minimize frontend with `npm run build`
4. Deploy using Docker or cloud platform
5. Use MongoDB Atlas instead of local

## ❓ Need Help?

1. Check troubleshooting section above
2. Review SETUP.md for detailed guide
3. Check API_TESTING_GUIDE.md for endpoints
4. Review code comments in src/ folder

---

**Congratulations!** 🎉 Your hospital appointment booking system is now running!

For detailed documentation, see:
- 📖 **SETUP.md** - Full setup guide
- 📚 **README.md** - Feature overview
- 🔌 **API_TESTING_GUIDE.md** - API reference
- ✨ **IMPLEMENTATION_SUMMARY.md** - What's included

Happy Coding! 💻
