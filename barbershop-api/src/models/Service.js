const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Serviço obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0, 'Preço não pode ser menor que 0'],
    },
    durationMinutes: {
      type: Number,
      required: [false],
      min: [15, 'Duração mínima é de 15 minutos'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', ServiceSchema); 

