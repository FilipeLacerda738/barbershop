const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { required } = require('zod/mini');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [false, 'O email é obrigatório'],
    },
    phone: {
      type: String,
      required: [true, 'O telefone é obrigatório'],
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