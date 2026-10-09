# FieldOps

## What is FieldOps?
FieldOps is an advanced, centralized platform designed to streamline dispatch, track real-time technician workflows, and manage customer relations for service companies. 

## Main Features
- **Customer Portal:** Easily submit and track service requests, view history, and securely pay invoices via Stripe.
- **Admin Dispatch:** Intuitive dashboard for managing jobs, assigning technicians, and monitoring live business intelligence and analytics.
- **Technician App:** Track jobs, record on-the-way statuses, consume inventory, and complete work orders directly from the field.
- **AI Insights:** Demand prediction algorithms, smart technician recommendations (with dedicated Smart Assignment UI), and inventory forecasting.
- **Automated Communication:** In-App, Socket.IO, Email (via Resend) and SMS (via Twilio) event notifications.
- **Billing & Payments:** Robust inventory consumption connected to dynamic invoice generation, featuring full **Stripe Checkout & Webhook** integration for live payments.

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
```env
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/fieldops
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_PROVIDER=RESEND
EMAIL_API_KEY=your_key
EMAIL_FROM=notifications@fieldops.com
SMS_PROVIDER=TWILIO
SMS_ACCOUNT_SID=your_sid
SMS_AUTH_TOKEN=your_token
SMS_FROM=+1234567890
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
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

### 6. Production Build (Local)
From the `client` directory run:
```bash
npm run build
```
The static assets can be served by configuring `NODE_ENV=production` inside the server.

## Deployment Guide

FieldOps is designed to be easily deployable using modern PaaS providers. 

### Frontend (Vercel)
The project root includes a `vercel.json` file configured for deploying the frontend.
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. The Build Command is already set to `cd client && npm install && npm run build` via `vercel.json`.
4. Add your Environment Variables (`VITE_API_URL` pointing to your deployed backend, `VITE_STRIPE_PUBLISHABLE_KEY`).

### Backend (Docker / Render / Railway)
A `Dockerfile` is provided in the `server` directory for containerized deployment.
1. Deploy via a service like Render or Railway by pointing to the `server` folder.
2. If using Render, create a New Web Service, connect your repo, and set the Root Directory to `server`.
3. Set the Environment to `Docker` or `Node`.
4. Ensure you populate all Environment Variables (Stripe, Resend, Twilio, MongoDB URI, etc.).

## Payment & Notification Architectures
- **Payments:** Fully integrated with Stripe. The backend generates secure Stripe Checkout sessions and listens via a Webhook (`/api/payments/webhook`) to automatically mark invoices as `PAID` upon successful transaction.
- **Notifications:** Notifications utilize background asynchronous promises failing safely without breaking core FieldOps transaction limits. Real-time in-app alerts are powered by Socket.IO.
