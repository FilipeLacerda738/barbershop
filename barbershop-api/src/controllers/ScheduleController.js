const { startOfDay, endOfDay, parseISO } = require('date-fns');
const Appointment = require('../models/Appointment');

class ScheduleController {
  async index(req, res){
    const { date } = req.query;

    const parsedDate = date ? parseISO(date) : new Date();

    const providerId = req.user.id || req.userId;

    const schedule = await Appointment.find({
      provider: providerId,
      status: { $ne: 'cancelled' },
      date: {
        $gte: startOfDay(parsedDate),
        $lte: endOfDay(parsedDate),
      },
    })
      .populate('client', 'name')
      .populate('service', 'name price') 
      .sort('date');

    return res.json(schedule);
  }
}

module.exports = new ScheduleController();