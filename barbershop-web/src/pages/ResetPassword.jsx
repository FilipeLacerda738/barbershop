import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      toast.error('Link de recuperação inválido ou ausente.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/password/reset-password', { token, password });
      
      toast.success('Senha atualizada com sucesso! Faça login.');
      navigate('/'); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao redefinir a senha. O link pode ter expirado.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-800 p-8 shadow-xl border border-zinc-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Criar nova senha
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Digite sua nova senha de acesso abaixo.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg bg-emerald-500 py-3 px-4 font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Atualizar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}