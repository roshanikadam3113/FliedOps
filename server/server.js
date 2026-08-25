const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Serve static assets in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  // Test route for development
  app.get("/", (req, res) => {
    res.json({
      message: "FieldOps API is running",
      endpoints: {
        auth: "/api/auth",
        jobs: "/api/jobs"
      }
    });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FieldOps server running on port ${PORT}`);
});