const { Router } = require('express');
const DashboardController = require('../controllers/DashboardController');
const { verifyToken, verifyOwner } = require('../middlewares/auth');

const dashboardRoutes = Router();

dashboardRoutes.get('/finances', verifyToken, verifyOwner, DashboardController.getFinances);

module.exports = dashboardRoutes;