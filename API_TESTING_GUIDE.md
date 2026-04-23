# API Testing Guide - Hospital Appointment Booking System

## 📌 Prerequisites
- Postman or any HTTP client
- Backend running on http://localhost:5000
- MongoDB connection configured

## 🔑 Authentication

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securepass123",
  "role": "patient"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "patient",
    "isVerified": true
  }
}
```

### 3. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "patient",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update Profile

**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "9876543210",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

## 🏥 Specialties Management

### 1. Get All Specialties

**Endpoint:** `GET /api/specialties`

**Response:**
```json
{
  "success": true,
  "specialties": [
    {
      "_id": "specialty_id",
      "name": "Cardiology",
      "description": "Heart and cardiovascular diseases",
      "icon": "❤️",
      "isActive": true
    },
    {
      "_id": "specialty_id_2",
      "name": "Orthopedics",
      "description": "Bone and joint disorders",
      "icon": "🦴",
      "isActive": true
    }
  ]
}
```

### 2. Create Specialty (Admin)

**Endpoint:** `POST /api/admin/specialties`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Dermatology",
  "description": "Skin diseases and treatment",
  "icon": "🩹"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Specialty created successfully",
  "specialty": {
    "_id": "new_specialty_id",
    "name": "Dermatology",
    "description": "Skin diseases and treatment",
    "icon": "🩹",
    "isActive": true
  }
}
```

## 👨‍⚕️ Doctor Management

### 1. Get All Doctors

**Endpoint:** `GET /api/doctors`

**Query Parameters:**
- `specialization` (optional) - Specialty ID
- `search` (optional) - Doctor name or bio
- `page` (optional) - Page number
- `limit` (optional) - Results per page

**Example:**
```
GET /api/doctors?specialization=123&search=cardiologist&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "doctor_id",
      "firstName": "Dr. Rajesh",
      "lastName": "Kumar",
      "specialization": {
        "_id": "specialty_id",
        "name": "Cardiology"
      },
      "experience": 15,
      "consultationFee": 500,
      "rating": 4.5,
      "totalReviews": 120,
      "isAvailable": true,
      "bio": "Senior Cardiologist with 15 years experience"
    }
  ],
  "totalPages": 1,
  "currentPage": 1
}
```

### 2. Get Doctor Details

**Endpoint:** `GET /api/doctors/:id`

**Response:**
```json
{
  "success": true,
  "doctor": {
    "_id": "doctor_id",
    "firstName": "Dr. Rajesh",
    "lastName": "Kumar",
    "email": "rajesh@hospital.com",
    "phone": "9876543210",
    "specialization": { ... },
    "experience": 15,
    "consultationFee": 500,
    "qualifications": [
      {
        "degree": "MBBS",
        "institute": "Medical College",
        "year": 2008
      },
      {
        "degree": "MD - Cardiology",
        "institute": "Medical College",
        "year": 2012
      }
    ],
    "rating": 4.5,
    "totalReviews": 120,
    "totalAppointments": 450,
    "availableSlots": [
      {
        "day": "Monday",
        "startTime": "09:00",
        "endTime": "17:00",
        "slotDuration": 30
      }
    ]
  }
}
```

### 3. Get Available Slots

**Endpoint:** `GET /api/doctors/:doctorId/available-slots`

**Query Parameters:**
- `doctorId` - Doctor ID
- `date` - Date in YYYY-MM-DD format

**Example:**
```
GET /api/doctors/123/available-slots?doctorId=123&date=2024-12-25
```

**Response:**
```json
{
  "success": true,
  "slots": [
    {
      "startTime": "09:00",
      "endTime": "09:30"
    },
    {
      "startTime": "09:30",
      "endTime": "10:00"
    },
    {
      "startTime": "10:00",
      "endTime": "10:30"
    }
  ]
}
```

### 4. Create Doctor (Admin)

**Endpoint:** `POST /api/admin/doctors`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "firstName": "Dr. Rajesh",
  "lastName": "Kumar",
  "email": "rajesh@hospital.com",
  "phone": "9876543210",
  "password": "securepass123",
  "licenseNumber": "MED123456",
  "specialization": "specialty_id",
  "experience": 15,
  "consultationFee": 500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor created successfully",
  "user": { ... }
}
```

## 📅 Appointment Management

### 1. Create Appointment

**Endpoint:** `POST /api/appointments`

**Headers:**
```
Authorization: Bearer <patient_token>
Content-Type: application/json
```

**Request:**
```json
{
  "doctorId": "doctor_id",
  "appointmentDate": "2024-12-25",
  "timeSlot": {
    "startTime": "10:00",
    "endTime": "10:30"
  },
  "symptoms": "Chest pain and shortness of breath",
  "appointmentType": "consultation",
  "consultationMode": "inperson"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "_id": "appointment_id",
    "appointmentId": "APT-123456",
    "patient": "patient_id",
    "doctor": "doctor_id",
    "specialty": "specialty_id",
    "appointmentDate": "2024-12-25T10:00:00Z",
    "timeSlot": {
      "startTime": "10:00",
      "endTime": "10:30"
    },
    "status": "scheduled",
    "paymentStatus": "pending",
    "symptoms": "Chest pain and shortness of breath",
    "appointmentType": "consultation",
    "consultationMode": "inperson",
    "createdAt": "2024-12-20T15:30:00Z"
  }
}
```

### 2. Get User Appointments

**Endpoint:** `GET /api/appointments`

**Headers:**
```
Authorization: Bearer <patient_token>
```

**Query Parameters:**
- `status` (optional) - scheduled, confirmed, completed, cancelled
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "appointment_id",
      "appointmentId": "APT-123456",
      "doctor": {
        "firstName": "Dr. Rajesh",
        "lastName": "Kumar",
        "specialization": "Cardiology",
        "consultationFee": 500
      },
      "specialty": {
        "name": "Cardiology"
      },
      "appointmentDate": "2024-12-25T10:00:00Z",
      "timeSlot": { ... },
      "status": "scheduled",
      "paymentStatus": "pending"
    }
  ],
  "totalPages": 1,
  "currentPage": 1
}
```

### 3. Get Appointment Details

**Endpoint:** `GET /api/appointments/:id`

**Headers:**
```
Authorization: Bearer <patient_token>
```

**Response:**
```json
{
  "success": true,
  "appointment": { ... }
}
```

### 4. Cancel Appointment

**Endpoint:** `DELETE /api/appointments/:id`

**Headers:**
```
Authorization: Bearer <patient_token>
Content-Type: application/json
```

**Request:**
```json
{
  "cancellationReason": "Doctor not available, need to reschedule"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

### 5. Rate Appointment

**Endpoint:** `POST /api/appointments/:id/rate`

**Headers:**
```
Authorization: Bearer <patient_token>
```

**Request:**
```json
{
  "rating": 5,
  "review": "Excellent doctor, very professional and caring. Highly recommended!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully"
}
```

## 💳 Payment Management

### 1. Initiate Payment

**Endpoint:** `POST /api/payments/initiate`

**Headers:**
```
Authorization: Bearer <patient_token>
```

**Request:**
```json
{
  "appointmentId": "appointment_id",
  "paymentMethod": "stripe",
  "amount": 500
}
```

**Response (Stripe):**
```json
{
  "success": true,
  "sessionId": "cs_test_123456",
  "paymentUrl": "https://checkout.stripe.com/pay/cs_test_123456",
  "transactionId": "TXN-UUID"
}
```

**Response (PayPal):**
```json
{
  "success": true,
  "orderId": "paypal_order_id",
  "paymentUrl": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "transactionId": "TXN-UUID"
}
```

**Response (Google Pay):**
```json
{
  "success": true,
  "paymentData": { ... },
  "transactionId": "TXN-UUID"
}
```

### 2. Verify Payment

**Endpoint:** `POST /api/payments/verify`

**Headers:**
```
Authorization: Bearer <patient_token>
```

**Request:**
```json
{
  "appointmentId": "appointment_id",
  "transactionId": "TXN-UUID",
  "paymentMethod": "stripe",
  "paymentData": {
    "stripeSessionId": "cs_test_123456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "_id": "payment_id",
    "transactionId": "TXN-UUID",
    "appointment": "appointment_id",
    "amount": 500,
    "paymentMethod": "stripe",
    "paymentStatus": "completed",
    "createdAt": "2024-12-20T15:35:00Z"
  }
}
```

### 3. Get Payment History

**Endpoint:** `GET /api/payments/history`

**Headers:**
```
Authorization: Bearer <patient_token>
```

**Query Parameters:**
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "_id": "payment_id",
      "transactionId": "TXN-123",
      "appointment": {
        "_id": "apt_id",
        "appointmentId": "APT-123"
      },
      "amount": 500,
      "paymentMethod": "stripe",
      "paymentStatus": "completed",
      "createdAt": "2024-12-20T15:35:00Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1
}
```

### 4. Process Refund

**Endpoint:** `POST /api/payments/refund`

**Headers:**
```
Authorization: Bearer <patient_token>
```

**Request:**
```json
{
  "paymentId": "payment_id",
  "reason": "Appointment cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "refund": {
    "refundId": "REF-UUID",
    "refundAmount": 500,
    "refundDate": "2024-12-20T15:40:00Z",
    "refundReason": "Appointment cancelled",
    "refundStatus": "completed"
  }
}
```

## 👥 User Management (Admin)

### 1. Get All Users

**Endpoint:** `GET /api/admin/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `role` (optional) - patient, doctor, admin
- `search` (optional) - name or email
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "patient",
      "isActive": true,
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### 2. Toggle User Status

**Endpoint:** `POST /api/admin/users/:userId/toggle-status`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User status updated",
  "user": {
    "_id": "user_id",
    "isActive": false
  }
}
```

## 📊 Admin Reports

### 1. Dashboard Statistics

**Endpoint:** `GET /api/admin/dashboard`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPatients": 250,
    "totalDoctors": 45,
    "totalAppointments": 1250,
    "totalRevenue": 625000,
    "appointmentsByStatus": [
      { "_id": "completed", "count": 800 },
      { "_id": "scheduled", "count": 350 },
      { "_id": "cancelled", "count": 100 }
    ],
    "recentAppointments": [ ... ]
  }
}
```

### 2. Appointment Reports

**Endpoint:** `GET /api/admin/reports/appointments`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `startDate` (optional) - YYYY-MM-DD
- `endDate` (optional) - YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "appointments": [ ... ],
  "stats": {
    "total": 150,
    "byStatus": { ... },
    "bySpecialty": { ... },
    "byDoctor": { ... }
  }
}
```

### 3. Payment Reports

**Endpoint:** `GET /api/admin/reports/payments`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)

**Response:**
```json
{
  "success": true,
  "payments": [ ... ],
  "stats": {
    "total": 120,
    "totalRevenue": 60000,
    "byPaymentMethod": { ... },
    "byStatus": { ... }
  }
}
```

---

## 🧪 Testing Tips

1. **Use Postman Collections** - Import endpoints as collection
2. **Set Global Variables** - Store tokens for reuse
3. **Test Data Flow** - Follow user journey from registration to payment
4. **Check Error Cases** - Test with invalid data
5. **Verify Notifications** - Check email/SMS are sent
6. **Test Edge Cases** - Empty results, duplicate entries, etc.

## ⚠️ Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

**Happy Testing!** 🚀
