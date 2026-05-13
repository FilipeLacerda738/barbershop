const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const authRoutes = Router();


authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.patch('/reset-password', AuthController.resetPassword);

module.exports = authRoutes;