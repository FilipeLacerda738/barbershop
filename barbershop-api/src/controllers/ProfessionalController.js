const { z } = require('zod');
const User = require('../models/User');
const AppError = require('../errors/AppError');

class ProfessionalController {
  
  async list(req, res) {
    const { name } = req.query;
    
    let filter = {
      $or: [
        { role: { $in: ['admin', 'owner'] } },
        { isProvider: true }
      ]
    };

    if (name) {
      filter = {
        $and: [
          filter,
          { name: { $regex: name, $options: 'i' } }
        ]
      }; 
    }

    const professionals = await User.find(filter).select('-password').sort('name');
    return res.json(professionals);
  }

  async create(req, res) {
    const professionalSchema = z.object({
      name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
      email: z.string().email('Formato de e-mail inválido.'),
      password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').optional(),
      phone: z.string().min(11).optional(),

      commissionRate: z.number().min(0).max(100).optional().default(0),
    });

    const parsedData = professionalSchema.parse(req.body);

    const userExists = await User.findOne({ email: parsedData.email });

    if (userExists) {
      if (userExists.role === 'admin' || userExists.role === 'owner') {
        throw new AppError('Este usuário já faz parte da equipe.', 400);
      }

      
      userExists.role = 'admin';
      userExists.isProvider = true;
      userExists.commissionRate = parsedData.commissionRate;
      userExists.name = parsedData.name; 
      await userExists.save();

      userExists.password = undefined; 
      return res.status(200).json(userExists);
    }

    if (!parsedData.password) {
        throw new AppError('A senha é obrigatória para registrar um novo barbeiro.', 400);
    }

    const professional = await User.create({
      name: parsedData.name,
      email: parsedData.email,
      password: parsedData.password, 
      phone: parsedData.phone,
      role: 'admin', 
      isProvider: true, 
      commissionRate: parsedData.commissionRate 
    });

    professional.password = undefined;

    return res.status(201).json(professional);
  }

  
  async update(req, res) {
    const { id } = req.params;

    const updateSchema = z.object({
      role: z.enum(['client', 'admin', 'owner'], {
        errorMap: () => ({ message: 'Cargo inválido. Escolha entre client, admin ou owner.' })
      }).optional(),
      isProvider: z.boolean({
        errorMap: () => ({ message: 'O campo isProvider deve ser verdadeiro ou falso.' })
      }).optional(),
      commissionRate: z.number()
        .min(0, 'A comissão não pode ser menor que 0%')
        .max(100, 'A comissão não pode ser maior que 100%')
        .optional(),
    });

    const { role, isProvider, commissionRate } = updateSchema.parse(req.body);

    const employee = await User.findById(id);
    if (!employee) {
      throw new AppError('Funcionário não encontrado.', 404);
    }

    if (id === req.user.id && role && role !== 'owner') {
      throw new AppError('Você não pode remover o seu próprio cargo de Dono (Owner).', 400);
    }

    if (role !== undefined) employee.role = role;
    if (isProvider !== undefined) employee.isProvider = isProvider;
    if (commissionRate !== undefined) employee.commissionRate = commissionRate;

    await employee.save();

    const updatedEmployee = employee.toObject();
    delete updatedEmployee.password;

    return res.json({
      message: 'Funcionário atualizado com sucesso!',
      employee: updatedEmployee
    });
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