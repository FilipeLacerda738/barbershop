const { z } = require('zod');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../errors/AppError');

class ProfessionalController {
  
  async list(req, res) {
    const { name } = req.query;
    let filter = { role: 'admin' };

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; 
    }

    const professionals = await User.find(filter).select('-password').sort('name');
    return res.json(professionals);
  }


  async create(req, res) {
    const professionalSchema = z.object({
      name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
      email: z.string().email('Formato de e-mail inválido.'),
      password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').optional(),
      phone: z.string().optional(),
    });

    const parsedData = professionalSchema.parse(req.body);

    const userExists = await User.findOne({ email: parsedData.email });

    if (userExists) {
      if (userExists.role === 'admin' || userExists.role === 'owner') {
        throw new AppError('Este usuário já faz parte da equipe.', 400);
      }

      userExists.role = 'admin';
      userExists.name = parsedData.name; 
      await userExists.save();

      userExists.password = undefined; 
      return res.status(200).json(userExists);
    }

    if (!parsedData.password) {
        throw new AppError('A senha é obrigatória para registrar um novo barbeiro.', 400);
    }

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const professional = await User.create({
      name: parsedData.name,
      email: parsedData.email,
      password: hashedPassword,
      phone: parsedData.phone,
      role: 'admin', 
    });

    professional.password = undefined;

    return res.status(201).json(professional);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (id === req.user.id) {
      throw new AppError('Você não pode excluir sua própria conta.', 403);
    }

    const professional = await User.findByIdAndDelete(id);

    if (!professional) {
      throw new AppError('Profissional não encontrado.', 404);
    }

    return res.status(204).send();
  }
}

module.exports = new ProfessionalController();