# FieldOps

## What is FieldOps?
FieldOps is an advanced, centralized platform designed to streamline dispatch, track real-time technician workflows, and manage customer relations for service companies. 

## Main Features
- **Customer Portal:** Easily submit and track service requests and invoices.
- **Admin Dispatch:** Intuitive dashboard for managing jobs, assigning technicians, and monitoring live business intelligence and analytics.
- **Technician App:** Track jobs, record on-the-way statuses, consume inventory, and complete work orders directly from the field.
- **AI Insights:** Demand prediction algorithms, smart technician recommendations, and inventory forecasting.
- **Automated Communication:** In-App, Socket.IO, Email (via Resend) and SMS (via Twilio) event notifications.
- **Billing & Inventory:** Robust inventory consumption workflows connected directly to dynamic invoice generation.

## Architecture & Tech Stack
- **Frontend:** React, TailwindCSS, React Router, Vite, Recharts, Lucide Icons.
- **Backend:** Node.js, Express, Socket.IO.
- **Database:** MongoDB (Mongoose ORM).
- **Authentication:** Custom JWT-based Identity with granular Role-Based Access Control (RBAC).
- **Communication:** Twilio, Resend, Socket.IO.

## User Roles
- **Admin:** Complete platform control. Full access to intelligence tools, analytics, notifications, and company settings.
- **Technician:** Field operative. Can access assigned jobs and adjust job statuses. 
- **Customer:** Standard user. Can submit requests, review service, and view private invoices.

## Local Setup

### 1. Database Setup
Ensure MongoDB is running locally on port `27017` or use MongoDB Atlas.

### 2. Environment Variables
Copy the `.env.example` file in the `server` directory and rename it to `.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/fieldops
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_PROVIDER=RESEND
EMAIL_API_KEY=your_key
EMAIL_FROM=notifications@fieldops.com
SMS_PROVIDER=TWILIO
SMS_ACCOUNT_SID=your_sid
SMS_AUTH_TOKEN=your_token
SMS_FROM=+1234567890
```

### 3. Running Backend
```bash
cd server
npm install
npm run dev
```

### 4. Running Frontend
```bash
cd client
npm install
npm run dev
```

### 5. Seeding Database (Development Only)
Seed the development databases securely. Run from the server folder:
```bash
node scripts/seedData.js
```

### 6. Production Build
From the `client` directory run:
```bash
npm run build
```
The static assets can be served by configuring `NODE_ENV=production` inside the server.

## Payment & Notification Architectures
- Payments exist logically but omit live PCI-DSS gateways, safely capturing webhooks and preventing duplication.
- Notifications utilize background asynchronous promises failing safely without breaking core FieldOps transaction limits.
