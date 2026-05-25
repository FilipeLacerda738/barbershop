const { Router } = require('express');
const ProfessionalController = require('../controllers/ProfessionalController');
const { verifyToken, verifyOwner } = require('../middlewares/auth');

const professionalRoutes = Router();

professionalRoutes.use(verifyToken);
professionalRoutes.use(verifyOwner);

professionalRoutes.get('/', ProfessionalController.list);
professionalRoutes.post('/', ProfessionalController.create);
professionalRoutes.put('/:id', ProfessionalController.update);
professionalRoutes.delete('/:id', ProfessionalController.delete);

module.exports = professionalRoutes;