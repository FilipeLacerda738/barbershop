import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor, digite seu e-mail.');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/password/forgot-password', { email });
      
      toast.success('E-mail enviado! Verifique sua caixa de entrada.');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao enviar o e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-800 p-8 shadow-xl border border-zinc-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Esqueceu a senha?
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Digite seu e-mail cadastrado e enviaremos um link para você criar uma nova senha.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white transition-colors hover:bg-emerald-600 focus:outline-none disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? 'Enviando...' : 'Redefinir Senha'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}