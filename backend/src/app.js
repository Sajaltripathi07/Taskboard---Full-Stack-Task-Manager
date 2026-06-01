

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');

const authRoutes    = require('./routes/authRoutes');
const taskRoutes    = require('./routes/taskRoutes');
const { sendError } = require('./utils/response');

const app = express();

//  Security headers 
app.use(helmet());

//  CORS 
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.options(/(.*)/, cors(corsOptions));

//  Body parsers 
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

//  Health check 
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

//  API routes 
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

//  404 handler 
app.use((_req, res) => sendError(res, 'Route not found.', 404));

//  Global error handler 
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  sendError(res, err.message || 'Internal server error.', err.status || 500);
});

module.exports = app;
