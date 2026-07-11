const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Global security headers
app.use(helmet());

// Cross-Origin Resource Sharing configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

// Request body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handle unknown routes (404 Not Found)
app.use(notFoundHandler);

// Global centralized error handler
app.use(errorHandler);

module.exports = app;
