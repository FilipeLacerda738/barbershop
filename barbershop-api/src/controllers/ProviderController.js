const { startOfDay, endOfDay, parseISO, isAfter, format, setHours, setMinutes } = require('date-fns');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const AppError = require('../errors/AppError');

class ProviderController {
  
  async list(req, res) {
    const providers = await User.find({ role: 'admin' }).select('-password');
    return res.json(providers);
  }

  async listAvailability(req, res) {
    const { id } = req.params; 
    const { date } = req.query; 

    if (!date) {
      throw new AppError('A data é obrigatória. Envie no formato YYYY-MM-DD.', 400);
    }

    const parsedDate = parseISO(date); 

    const provider = await User.findOne({ _id: id, role: 'admin' });
    if (!provider) {
      throw new AppError('Profissional não encontrado.', 404);
    }

    const appointments = await Appointment.find({
      provider: id,
      date: {
        $gte: startOfDay(parsedDate), 
        $lte: endOfDay(parsedDate),  
      },
      status: { $ne: 'cancelled' },
    });

    const schedule = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];
    
    const availability = schedule.map((time) => {
      const [hour, minute] = time.split(':');
      
      let value = new Date(parsedDate);
      value = setHours(value, Number(hour));
      value = setMinutes(value, Number(minute));

      const isPast = isAfter(new Date(), value);

      const hasAppointment = appointments.find(
        (appointment) => format(appointment.date, 'HH:mm') === time
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), 
        available: !isPast && !hasAppointment,
      };
    });

    return res.json(availability);
  }
}

module.exports = new ProviderController();