require('dotenv').config();
require('express-async-errors'); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler.js');
const scheduleRoutes = require('./routes/schedule.routes.js');
const professionalRoutes = require('./routes/professional.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const serviceRoutes = require('./routes/service.routes.js');
const appointmentRoutes = require('./routes/appointment.routes.js');
const providerRoutes = require('./routes/provider.routes.js');
const passwordRoutes = require('./routes/password.routes.js');

const app = express(); 

app.use(helmet());
app.use(cors());
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

app.use(errorHandler);
module.exports = app;