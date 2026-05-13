const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');


const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido.', 401);
  }

  
  const [, token] = authHeader.split(' ');

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = decoded;

    
    return next();
  } catch (err) {
    throw new AppError('Token inválido ou expirado.', 401);
  }
};


const verifyAdmin = (req, res, next) => {
  
  if (req.user.role !== 'admin') {
    throw new AppError('Acesso negado. Apenas administradores podem realizar esta ação.', 403); // 403 Forbidden
  }

  return next();
};

const verifyOwner = (req, res, next) => {
  if(req.user.role !== 'owner'){
    return res.status(403).json({ status: 'error', message: 'Acesso negado.'})
  }

  return next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyOwner
};