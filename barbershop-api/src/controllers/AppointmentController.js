const { z } = require('zod');
const { parseISO, isBefore, startOfHour, subHours, startOfDay, endOfDay } = require('date-fns'); 
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');
const AppError = require('../errors/AppError');

class AppointmentController {
  async create(req, res) {
    const appointmentSchema = z.object({
      providerId: z.string().min(1, 'ID do barbeiro é obrigatório'),
      serviceId: z.string().min(1, 'ID do serviço é obrigatório'),
      date: z.string().datetime({ 
        offset: true, 
        message: 'Formato de data inválido. Use ISO-8601' 
      }),
    });

    const { providerId, serviceId, date } = appointmentSchema.parse(req.body);
    const appointmentDate = parseISO(date);
    
    if (isBefore(appointmentDate, new Date())) {
      throw new AppError('Você não pode reservar um horário no passado.', 400);
    }

    const hourStart = startOfHour(appointmentDate);

    
    const providerUser = await User.findOne({ _id: providerId, isProvider: true });
    if (!providerUser) {
      throw new AppError('O profissional escolhido não existe ou não atende.', 404);
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      throw new AppError('Este serviço não está disponível no momento.', 400);
    }

    const checkAvailability = await Appointment.findOne({
      provider: providerId,
      date: hourStart,
      status: { $ne: 'cancelled' } 
    });

    if (checkAvailability) {
      throw new AppError('Este horário não está mais disponível. Escolha outro.', 409);
    }

    const appointment = await Appointment.create({
      client: req.user.id,
      provider: providerId,
      service: serviceId,
      date: hourStart,
    });

    return res.status(201).json(appointment);
  }

  async listMyAppointments(req, res) {
    const appointments = await Appointment.find({ 
      client: req.user.id, 
      status: { $ne: 'cancelled' }
    })
      .populate('provider', 'name email phone') 
      .populate('service', 'name price durationMinutes')
      .sort('date'); 

    return res.json(appointments);
  }

  async cancel(req, res) {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new AppError('Agendamento não encontrado.', 404);
    }

    if (appointment.client.toString() !== req.user.id) {
      throw new AppError('Você não tem permissão para cancelar este agendamento.', 403);
    }

    if (appointment.status === 'cancelled') {
      throw new AppError('Este agendamento já foi cancelado.', 400);
    }

    const cancelLimit = subHours(appointment.date, 2);
    if (isBefore(cancelLimit, new Date())) {
      throw new AppError('Você só pode cancelar com até 2 horas de antecedência.', 403);
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.json(appointment);
  }

  async listSchedule(req, res){
    const { date } = req.query;

    if(!date){
      throw new AppError('A data é obrigatória.', 400)
    }
    
    
    const checkIsProvider = await User.findOne({_id: req.user.id, isProvider: true});
    if(!checkIsProvider){
      throw new AppError('Acesso negado. Apenas profissionais podem ver a própria agenda.', 403);
    }

    const parsedDate = parseISO(date);

    const appointments = await Appointment.find({
      provider: req.user.id,
      date: {
        $gte: startOfDay(parsedDate),
        $lte: endOfDay(parsedDate),
      },
      status: { $ne: 'cancelled' } 
    })
    .populate('client', 'name phone') 
    .populate('service', 'name price') 
    .sort('date'); 

    return res.json(appointments);
  }

  async delete(req, res){
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if(!appointment){
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.json({ message: 'Agendamento cancelado.' })
  }

  
  async updateStatus(req, res){
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];
    if(!validStatuses.includes(status)){
      return res.status(400).json({ message: 'Status inválido.' });
    }

    
    const appointment = await Appointment.findById(id)
      .populate('service')
      .populate('provider');

    if(!appointment){
      return res.status(404).json({ message: 'Agendamento não encontrado' })
    }

    if (status === 'completed' && appointment.status !== 'completed') {
      const servicePrice = appointment.service.price || 0;
      const providerCommissionRate = appointment.provider.commissionRate || 0;
      
      
      appointment.price = servicePrice;
      appointment.commissionRateSnapshot = providerCommissionRate;
      
      appointment.commissionAmount = servicePrice * (providerCommissionRate / 100);
    }

    appointment.status = status;
    await appointment.save();
    
    return res.json({ message: 'Agendamento atualizado com sucesso!', appointment });
  }
}

module.exports = new AppointmentController();