const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Global security headers
app.use(helmet());

// Cross-Origin Resource Sharing configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or localhost/dev origins
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(null, process.env.CORS_ORIGIN || true);
    }
  },
  credentials: true,
}));

// Request body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.status(200).json(swaggerSpec));
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Handle unknown routes (404 Not Found)
app.use(notFoundHandler);

// Global centralized error handler
app.use(errorHandler);

module.exports = app;
