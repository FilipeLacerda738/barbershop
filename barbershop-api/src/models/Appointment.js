const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O cliente é obrigatório'],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'O profissional é obrigatório'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'O serviço é obrigatório'],
    },
    date: {
      type: Date,
      required: [true, 'A data e horário são obrigatórios'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    
 
    price: {
      type: Number,
      
    },
    commissionRateSnapshot: {
      type: Number,
      
    },
    commissionAmount: {
      type: Number,
      
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },

    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

AppointmentSchema.index({ provider: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);