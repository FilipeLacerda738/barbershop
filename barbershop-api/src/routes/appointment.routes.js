const { Router } = require('express');
const AppointmentController = require('../controllers/AppointmentController');
const { verifyToken } = require('../middlewares/auth');

const appointmentRoutes = Router();

appointmentRoutes.use(verifyToken);

appointmentRoutes.post('/', AppointmentController.create);

appointmentRoutes.get('/me', AppointmentController.listMyAppointments);

appointmentRoutes.get('/schedule', AppointmentController.listSchedule);

appointmentRoutes.patch('/:id/cancel', AppointmentController.cancel);

appointmentRoutes.delete('/:id', AppointmentController.delete);

appointmentRoutes.patch('/:id/status', AppointmentController.updateStatus);

module.exports = appointmentRoutes;