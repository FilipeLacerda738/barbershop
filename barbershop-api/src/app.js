require('dotenv').config();
require('express-async-errors'); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); 

const errorHandler = require('./middlewares/errorHandler.js');
const scheduleRoutes = require('./routes/schedule.routes.js');
const professionalRoutes = require('./routes/professional.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const serviceRoutes = require('./routes/service.routes.js');
const appointmentRoutes = require('./routes/appointment.routes.js');
const providerRoutes = require('./routes/provider.routes.js');
const passwordRoutes = require('./routes/password.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js'); 

const app = express(); 

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://barbershop-alpha-wheat.vercel.app'
  ],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { status: 'error', message: 'Muitas requisições deste IP, tente novamente em 15 minutos.' }
});

app.use('/api', limiter); 

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'API rodando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/appointments/me', appointmentRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/dashboard', dashboardRoutes); 

app.use(errorHandler);

module.exports = app;