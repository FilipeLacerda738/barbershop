const { Router } = require('express');
const PasswordController = require('../controllers/PasswordController');

const passwordRoutes = Router();

passwordRoutes.post('/forgot-password', PasswordController.forgotPassword);
passwordRoutes.post('/reset-password', PasswordController.resetPassword);

module.exports = passwordRoutes;