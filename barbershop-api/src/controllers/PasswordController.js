const crypto = require('crypto'); 
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../errors/AppError');
const { sendEmail } = require('../services/emailService');

class PasswordController {
  
  async forgotPassword(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Usuário não encontrado com este e-mail.', 404);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; 
    await user.save();

  
    const resetURL = `http://localhost:5173/reset-password?token=${resetToken}`;

    const message = `
      <h2>Recuperação de Senha</h2>
      <p>Você solicitou uma redefinição de senha para a sua conta na Barbershop.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${resetURL}" target="_blank" style="display:inline-block; padding:10px 20px; background-color:#10b981; color:white; text-decoration:none; border-radius:5px;">Redefinir minha senha</a>
      <p>Se você não solicitou isso, ignore este e-mail. Este link expira em 1 hora.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Recuperação de Senha - Barbershop',
        body: message
      });

      return res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso!' });
    } catch (error) {
     
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      throw new AppError('Erro ao enviar o e-mail. Tente novamente mais tarde.', 500);
    }
  }

  async resetPassword(req, res) {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() } 
    }).select('+passwordResetToken +passwordResetExpires'); 

    if (!user) {
      throw new AppError('Token inválido ou expirado. Solicite a recuperação novamente.', 400);
    }
    user.password = password;
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();

    return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  }
}

module.exports = new PasswordController();