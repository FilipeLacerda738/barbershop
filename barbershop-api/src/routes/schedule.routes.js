const { Router } = require('express');
const ScheduleController = require('../controllers/ScheduleController');
const { verifyToken } = require('../middlewares/auth.js');

const scheduleRouter = Router();

scheduleRouter.use(verifyToken);

scheduleRouter.get('/', ScheduleController.index);

module.exports = scheduleRouter;