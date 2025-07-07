const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth');
const getMenuByRoles = require('./routes/getMenuByRole');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/menus', getMenuByRoles); // ✅ FIXED from './api/menu' to '/api/menus'

module.exports = app;
