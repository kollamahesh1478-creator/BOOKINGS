# Medical Appointment Booking System - Setup Guide

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BOOKINGS
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add:
- MongoDB connection string
- JWT secret
- Email credentials (Gmail SMTP)
- Twilio account details
- Payment gateway API keys

#### Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo

# Or install locally and run mongod
```

#### Start Backend Server
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Create Environment File
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

#### Start Frontend Server
```bash
npm run dev
# Application runs on http://localhost:3000
```

## 🎯 User Roles & Access

### Patient
- Register and login
- Search doctors and specialties
- Book appointments
- Make payments
- View appointment history
- Rate and review doctors
- Manage medical records

### Doctor
- View assigned appointments
- Update availability
- Manage consultations
- View patient details
- Add prescriptions

### Admin
- Full system access
- User management
- Doctor management
- Financial reporting
- System configuration
- Analytics and insights

## 🔑 Initial Setup Tasks

1. **Create Admin User**
   - In MongoDB, create admin user with role='admin'
   - Or use provided registration endpoint

2. **Add Medical Specialties**
   ```bash
   POST /api/admin/specialties
   {
     "name": "Cardiology",
     "description": "Heart and cardiovascular diseases",
     "icon": "❤️"
   }
   ```

3. **Add Doctors**
   - Use admin dashboard to add doctors
   - Set specialization, experience, fees
   - Configure available time slots

4. **Configure Payment Gateways**
   - Update all payment keys in .env
   - Test in sandbox mode first

5. **Setup Email & SMS**
   - Verify email credentials
   - Test SMS with Twilio

## 📱 API Testing

### Using Postman

1. **Register Patient**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "phone": "9876543210",
     "password": "password123",
     "role": "patient"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Get Doctors**
   ```
   GET http://localhost:5000/api/doctors
   ```

4. **Create Appointment**
   ```
   POST http://localhost:5000/api/appointments
   Authorization: Bearer <token>
   Content-Type: application/json

   {
     "doctorId": "doctor_id_here",
     "appointmentDate": "2024-12-25",
     "timeSlot": {
       "startTime": "10:00",
       "endTime": "10:30"
     },
     "symptoms": "Chest pain",
     "appointmentType": "consultation",
     "consultationMode": "inperson"
   }
   ```

## 🔧 Configuration Details

### Email Configuration
- Provider: Gmail
- Enable 2-Factor Authentication
- Create App-Specific Password
- Update SMTP credentials

### Payment Gateway Setup

#### Stripe
1. Go to stripe.com/dashboard
2. Copy Secret and Publishable keys
3. Update STRIPE_SECRET_KEY

#### PayPal
1. Create Business Account
2. Get Client ID and Secret
3. Switch between sandbox/live

#### Razorpay
1. Login to razorpay.com
2. Copy Key ID and Secret
3. Test in sandbox first

### SMS Configuration (Twilio)
1. Create Twilio account
2. Verify phone numbers
3. Get Account SID and Auth Token
4. Purchase phone number

## 🧪 Testing Checklist

- [ ] User registration and email verification
- [ ] Patient login and dashboard
- [ ] Doctor browsing and filtering
- [ ] Appointment booking
- [ ] Time slot availability
- [ ] Payment processing (all methods)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin dashboard functions
- [ ] User management
- [ ] Reports generation

## 🚀 Deployment

### Backend Deployment (Railway/Render)
```bash
# Set environment variables in hosting platform
# Deploy from GitHub repository
# Ensure MongoDB Atlas connection
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy dist folder
# Set VITE_API_URL to production backend URL
```

## 📞 Support & Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check MONGODB_URI format
- Ensure MongoDB service is running
- Verify username/password

**Payment Gateway Error**
- Verify API keys are correct
- Check sandbox vs production mode
- Ensure sufficient account balance

**Email Not Sending**
- Enable "Less Secure Apps" (Gmail)
- Verify SMTP credentials
- Check spam/junk folder

**CORS Error**
- Update CLIENT_URL in backend .env
- Ensure frontend runs on configured port

## 📖 Additional Documentation

- See README.md for full feature list
- Check API documentation in backend/src/routes
- Review database schema in backend/src/models

---

**Happy Booking! 🏥**
