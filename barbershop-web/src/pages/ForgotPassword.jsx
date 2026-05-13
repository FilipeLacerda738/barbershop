import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleReset(e) {
    e.preventDefault();

    try {
      await api.patch('/auth/reset-password', { email, newPassword });
      toast.success('Senha atualizada com sucesso! Faça seu login.');
      navigate('/'); // Volta pro login
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao redefinir a senha.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-zinc-800 p-8 shadow-xl border border-zinc-700">
        <h1 className="text-2xl font-bold text-white mb-2">Recuperar Senha</h1>
        <p className="text-zinc-400 mb-6 text-sm">Modo de teste: Altere sua senha diretamente.</p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Seu Email</label>
            <input
              type="email"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Nova Senha</label>
            <input
              type="password"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white transition-colors hover:bg-emerald-600 focus:outline-none"
          >
            Redefinir Senha
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/" className="text-emerald-400 hover:text-emerald-300">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}