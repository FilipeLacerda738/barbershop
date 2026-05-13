/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';


export function Login(){
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const { signIn } = useContext(AuthContext);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signIn({ email, password })

      navigate('/dashboard')
    } catch (error) {
      toast.error('Email ou senha incorretos!');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      
      {/* Caixa do formulário */}
      <div className="w-full max-w-md rounded-xl bg-zinc-800 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Barbershop</h1>
          <p className="text-zinc-400 mt-2">Faça login para agendar seu horário</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              E-mail
            </label>
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
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right mt-1 mb-4">
            <Link to="/forgot-password" className="text-sm text-emerald-400   hover:text-emerald-300">
                Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Ainda não tem conta?{' '}
            <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
                  Crie uma agora
            </Link>
        </p>
      </div>
    </div>
  );
}