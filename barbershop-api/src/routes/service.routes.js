const { Router } = require('express');
const ServiceController = require('../controllers/ServiceController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const { verifyOwner } = require('../middlewares/auth');
const serviceRoutes = Router();


serviceRoutes.use(verifyToken);

serviceRoutes.get('/', ServiceController.list);

serviceRoutes.post('/', verifyOwner, ServiceController.create);
serviceRoutes.put('/:id', verifyOwner, ServiceController.update);
serviceRoutes.delete('/:id', verifyOwner, ServiceController.delete);

module.exports = serviceRoutes;