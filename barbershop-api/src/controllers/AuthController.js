const { z } = require('zod');
const User = require('../models/User.js');
const AppError = require('../errors/AppError.js');
const generateToken = require('../utils/generateToken.js');

class AuthController{
  async register(req, res) {
    const registerSchema = z.object({
      name: z.string().min(3, 'O nome deve ter pelo menos 3 letras'),
      email: z.string().email('Formato de e-mail inválido'),
      phone: z.string().min(10, 'Telefone inválido'),
      password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
      role: z.enum(['client', 'admin']).optional(),
    });

    const parsedData = registerSchema.parse(req.body);

    
    const userExists = await User.findOne({ email: parsedData.email });
    if (userExists) {
      throw new AppError('Este e-mail já está em uso.', 409);
    }
    
    const user = await User.create(parsedData);

    user.password = undefined;

    return res.status(201).json({
      user,
      token: generateToken(user._id, user.role),
    });
  }

  async login(req, res){
    // validação 
    const loginSchema = z.object({
      email: z.string().email('Formato de email inválido'),
      password: z.string().min(1, 'A senha é obrigatória'),
    });



    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+password');

    if(!user){
      throw new AppError('Email ou senha incorretos', 401);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
      throw new AppError('Email ou senha incorretos', 401);
    }

    user.password = undefined;
    return res.json({
      user,
      token: generateToken(user._id, user.role),
    });
  }

   async resetPassword(req, res) {
    
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado com este email.' });
    }

    
    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Senha atualizada com sucesso!' });
  }
}

module.exports = new AuthController();