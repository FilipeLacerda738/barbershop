const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O email é obrigatório'],
      unique: true, 
    },
    phone: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      select: false,
    },
    role: {
      type: String,
      enum: ['client', 'admin', 'owner'],
      default: 'client',
    },
    
    
    isProvider: {
      type: Boolean,
      default: false,
    },
    
    
    commissionRate: {
      type: Number,
      min: [0, 'A comissão não pode ser menor que 0%'],
      max: [100, 'A comissão não pode ser maior que 100%'],
      default: 0,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; 
  }
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);