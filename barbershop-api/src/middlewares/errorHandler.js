const { ZodError } = require('zod'); 
const AppError = require('../errors/AppError');

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      issues: err.format(), 
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ status: 'error', message: messages });
  }

  console.error(err); 

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}

module.exports = errorHandler;