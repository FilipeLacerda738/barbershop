import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); 
  
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {

      await api.post('/auth/register', { name, email, password, phone });

      toast.success('Conta criada com sucesso! Faça seu login.');
      navigate('/');

    } catch (error) {
      const responseData = error.response?.data;
      
      if (responseData?.status === 'validation_error' && responseData.errors) {
        // Se for erro do Zod, pega a mensagem do primeiro campo que falhou
        const primeiroErro = responseData.errors[0].message;
        toast.error(`Erro: ${primeiroErro}`);
      } else {
        // Se for outro erro 
        const errorMessage = responseData?.message || 'Erro ao criar conta.';
        toast.error(errorMessage);
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-zinc-800 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="text-zinc-400 mt-2">Junte-se a nós para agendar seus horários</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Nome Completo</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
            <input
              type="password"
              placeholder="Crie uma senha"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white transition-colors hover:bg-emerald-600 focus:outline-none"
          >
            Cadastrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Já tem uma conta?{' '}
          <Link to="/" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}