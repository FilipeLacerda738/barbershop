const { z } = require('zod');
const Service = require('../models/Service.js');
const AppError = require('../errors/AppError.js');

class ServiceController {
  
  async create(req, res) {
    const serviceSchema = z.object({
      name: z.string().min(3, 'O nome do serviço é obrigatório'),
      description: z.string().optional(),
      price: z.number().min(0, 'O preço não pode ser negativo'),
      durationMinutes: z.number().min(15, 'A duração mínima é de 15 minutos'),
    });

    const parsedData = serviceSchema.parse(req.body);

    const service = await Service.create(parsedData);

    return res.status(201).json(service);
  }

  
  async list(req, res) {
    
    const services = await Service.find({ isActive: true }).sort('name');
    
    return res.json(services);
  }

 
  async update(req, res) {
    const { id } = req.params;

    
    const updateSchema = z.object({
      name: z.string().min(3).optional(),
      description: z.string().optional(),
      price: z.number().min(0).optional(),
      durationMinutes: z.number().min(15).optional(),
    }).partial();

    const parsedData = updateSchema.parse(req.body);

    
    const service = await Service.findByIdAndUpdate(id, parsedData, {
      new: true,
      runValidators: true, 
    });

    if (!service) {
      throw new AppError('Serviço não encontrado.', 404);
    }

    return res.json(service);
  }

  
  async delete(req, res) {
    const { id } = req.params;

    
    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      throw new AppError('Serviço não encontrado.', 404);
    }

    
    return res.status(204).send();
  }
}

module.exports = new ServiceController();