const { startOfMonth, endOfMonth, parseISO } = require('date-fns');
const Appointment = require('../models/Appointment');
const AppError = require('../errors/AppError');
const { model } = require('mongoose');

class DashboardController{
  async getFinances(req, res){
    const { mouth } = req.query;

    const targetDate = mouth ? parseISO(mouth) : new Date();

    const firstDay = startOfMonth(targetDate);
    const lastDay = endOfMonth(targetDate);
    
    const appointments = await Appointment.find({
      status: 'completed',
      date: { $gte: firstDay, $lte: lastDay }
    }).populate('provider', 'name');

    let totalRevenue = 0;
    let totalCommissions = 0;
    const providerStats = {};


    appointments.forEach(app => {
      const price = app.price || 0;
      const commission = app.commissionAmount || 0;
      const providerId = app.provider._id.toString();

      totalRevenue += price;
      totalCommissions += commission;


      if(!providerStats[providerId]){
        providerStats[providerId] = {
          name: app.provider.name, 
          servicesRendered: 0,
          totalGenerated: 0,
          commissionEarned: 0
        };
      }

      providerStats[providerId].servicesRendered += 1;
      providerStats[providerId].totalGenerated += price;
      providerStats[providerId].commissionEarned += commission;
    });

    const netProfit = totalRevenue - totalCommissions;

    return res.json({
      period: {
        start: firstDay,
        end: lastDay
      },
      overview: {
        totalRevenue,
        totalCommissions,
        netProfit
      },
      teamPerformance: Object.values(providerStats)
    });
  }
}

module.exports = new DashboardController();