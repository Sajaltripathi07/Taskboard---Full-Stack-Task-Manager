const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { sendError } = require('./utils/response');

const app = express();

//  Security headers 
app.use(helmet());

//  CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, same-origin).
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

//  Body parsers 
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

//  Health check 
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// API routes 
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler 
app.use((_req, res) => sendError(res, 'Route not found.', 404));

// Global error handler 
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  sendError(res, err.message || 'Internal server error.', err.status || 500);
});

module.exports = app;
