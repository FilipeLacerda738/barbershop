const AppError = require('../errors/AppError.js');
const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  if(err instanceof AppError){
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Formata o erro para devolver um array: [{ field: "email", message: "E-mail inválido" }]
  if (err.name === 'ZodError') {
    const validationErrors = err.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return res.status(400).json({
      status: 'validation_error',
      message: 'Dados de entrada inválidos.',
      errors: validationErrors,
    });
  }

  // Código 11000 = Duplicação de campo Unique
  if(err.code === 11000){
    const duplicatedField = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: 'conflito',
      message: `O valor informado no campo ${duplicatedField} já está sendo usado`
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: `O formato do ID informado (${err.value}) é inválido.`,
    });
  }

  if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
    return res.status(400).json({
      status: 'error',
      message: 'Formato de dados é inválido'
    });
  }

  if(err.name === 'ValidationError'){
    const message = Object.values(err.erros).map((val) => val.message);
    return res.status(400).json({
      status: 'validation_error',
      message: 'Erro de validação do banco de dados. ',
      errors: messages,
    });
  }

  if(err.name === 'JsonWebTokenError'){
    return res.status(401).json({
      status: 'unauthorized',
      message: 'Token de autenticação inválido',
    });
  }

  if(err.name === 'TokenExpiredError'){
    return res.status(401).json({
      status: 'unauthorized',
      message: 'Sessão expirou',
    });
  }

  // Erros Críticos
  console.error('Erro crítico: ', err);

  return res.status(500).json({
    status: 'error',
    message: 'Error interno no servidor',

  });
  
};

module.exports = errorHandler;