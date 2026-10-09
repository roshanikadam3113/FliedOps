const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL] 
  : ['http://localhost:5173', 'http://localhost:5000', '*'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// Attach io instance to express app
app.set("io", io);

// Socket.io middleware for JWT authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id };
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected to socket:", socket.id);

  // Force user to join their own secure room based on authenticated JWT
  if (socket.user && socket.user.id) {
    socket.join(socket.user.id);
    console.log(`Socket ${socket.id} securely joined room: ${socket.user.id}`);
  }

  // The client might still emit "join", but we ignore the payload and enforce JWT identity
  socket.on("join", () => {
    if (socket.user && socket.user.id) {
      socket.join(socket.user.id);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected from socket:", socket.id);
  });
});

// Connect MongoDB
connectDB();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Middleware
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting for auth routes (basic protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many authentication attempts from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/ai', aiRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static assets in production
const path = require('path');
const fs = require('fs');

const clientDistPath = path.join(__dirname, '../client/dist');

if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*all', (req, res) => {
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  // Test route for development or when static build is not present
  app.get("/", (req, res) => {
    res.json({
      message: "FieldOps API is running with Socket.IO enabled",
      endpoints: {
        auth: "/api/auth",
        jobs: "/api/jobs",
        notifications: "/api/notifications"
      }
    });
  });
}

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`FieldOps server running on port ${PORT}`);
});