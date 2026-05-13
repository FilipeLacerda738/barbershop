/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export function ManageProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProfessionals();
  }, []);

  async function fetchProfessionals() {
    try {
      const response = await api.get('/professionals');
      setProfessionals(response.data);
    } catch (error) {
      toast.error('Erro ao buscar a equipe.');
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const response = await api.post('/professionals', { name, email, password });
      setProfessionals([...professionals, response.data]);
      setName('');
      setEmail('');
      setPassword('');
      toast.success('Novo barbeiro contratado com sucesso!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar profissional.');
    }
  }

  async function handleDelete(id, professionalName) {
    const confirmation = window.prompt(`ALERTA: Para demitir ${professionalName}, digite o nome exato dele abaixo:`);
    
    if (confirmation !== professionalName) {
      if (confirmation !== null) toast.error('Nome incorreto. Exclusão cancelada.');
      return;
    }

    try {
      await api.delete(`/professionals/${id}`);
      setProfessionals(professionals.filter(p => p._id !== id));
      toast.success(`${professionalName} foi removido da equipe.`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao excluir profissional.');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-emerald-400 mb-2 inline-block">
              &larr; Voltar ao Dashboard
            </Link>
            <h2 className="text-3xl font-bold text-white">Minha Equipe</h2>
          </div>
        </div>
        <form onSubmit={handleCreate} className="mb-10 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-emerald-500">Contratar Novo Barbeiro</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Senha de Acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-emerald-500 focus:outline-none"
              required
              minLength="6"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full md:w-auto rounded-lg bg-emerald-500 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-600"
          >
            Cadastrar Barbeiro
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionals.length === 0 ? (
            <p className="text-zinc-400">Nenhum barbeiro na equipe ainda.</p>
          ) : (
            professionals.map((prof) => (
              <div key={prof._id} className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-5">
                <div>
                  <p className="font-bold text-lg text-white">{prof.name}</p>
                  <p className="text-sm text-zinc-400">{prof.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(prof._id, prof.name)}
                  className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                >
                  Demitir
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}