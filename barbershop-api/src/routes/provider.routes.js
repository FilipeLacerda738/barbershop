const { Router } = require('express');
const ProviderController = require('../controllers/ProviderController.js');
const { verifyToken } = require('../middlewares/auth.js');

const providerRoutes = Router();

providerRoutes.use(verifyToken);

providerRoutes.get('/', ProviderController.list);
providerRoutes.get('/:id/availability', ProviderController.listAvailability);

module.exports = providerRoutes;