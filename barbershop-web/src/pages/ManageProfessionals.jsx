/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function ManageProfessionals() {
  const { user } = useContext(AuthContext); // Precisamos do user logado para não deixar o dono demitir a si mesmo
  const [professionals, setProfessionals] = useState([]);
  
  // Estados para criar um novo funcionário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [commissionRate, setCommissionRate] = useState('');

 
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ role: '', isProvider: false, commissionRate: 0 });

  useEffect(() => {
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
      const response = await api.post('/professionals', { 
        name, 
        email, 
        password,
        commissionRate: Number(commissionRate) || 0 // Garante que envia um número
      });
      setProfessionals([...professionals, response.data]);
      setName('');
      setEmail('');
      setPassword('');
      setCommissionRate('');
      toast.success('Novo barbeiro contratado com sucesso!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar profissional.');
    }
  }

  function startEditing(prof) {
    setEditingId(prof._id);
    setEditData({
      role: prof.role,
      isProvider: prof.isProvider,
      commissionRate: prof.commissionRate || 0
    });
  }


  async function handleUpdate(id) {
    try {
      const response = await api.put(`/professionals/${id}`, editData);
      
   
      setProfessionals(professionals.map(p => p._id === id ? response.data.employee : p));
      
      setEditingId(null); 
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar dados.');
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
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-emerald-400 mb-2 inline-block">
              &larr; Voltar ao Dashboard
            </Link>
            <h2 className="text-3xl font-bold text-white">Gestão da Equipe</h2>
          </div>
        </div>

        <form onSubmit={handleCreate} className="mb-10 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-emerald-500">Contratar Novo Barbeiro</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Comissão (%)"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full md:w-auto rounded-lg bg-emerald-500 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-600"
          >
            Cadastrar Barbeiro
          </button>
        </form>

        <h3 className="mb-4 text-xl font-semibold text-white">Barbeiros e Administradores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionals.length === 0 ? (
            <p className="text-zinc-400">Nenhum barbeiro na equipe ainda.</p>
          ) : (
            professionals.map((prof) => (
              <div key={prof._id} className="flex flex-col rounded-xl border border-zinc-700 bg-zinc-800 p-5 transition-all">
                
                {/* CABEÇALHO DO CARD */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg text-white">{prof.name}</p>
                      <span className={`text-xs px-2 py-1 rounded-md font-bold ${prof.role === 'owner' ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-700 text-zinc-300'}`}>
                        {prof.role === 'owner' ? 'Dono' : 'Admin'}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{prof.email}</p>
                  </div>
                  
                  <span className={`text-xs px-2 py-1 rounded-full border ${prof.isProvider ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>
                    {prof.isProvider ? 'Agenda Aberta' : 'Agenda Fechada'}
                  </span>
                </div>

                {editingId === prof._id ? (
                  <div className="border-t border-zinc-700 pt-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-zinc-300 font-medium">Permissão:</label>
                      <select 
                        value={editData.role} 
                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                        className="bg-zinc-900 border border-zinc-700 rounded p-1 text-sm text-white"
                        disabled={prof._id === user?.id} 
                      >
                        <option value="admin">Administrador</option>
                        <option value="owner">Dono (Owner)</option>
                        <option value="client">Rebaixar para Cliente</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-zinc-300 font-medium">Comissão (%):</label>
                      <input 
                        type="number" 
                        min="0" max="100"
                        value={editData.commissionRate}
                        onChange={(e) => setEditData({...editData, commissionRate: Number(e.target.value)})}
                        className="bg-zinc-900 border border-zinc-700 rounded p-1 text-sm text-white w-20 text-center"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input 
                        type="checkbox" 
                        checked={editData.isProvider}
                        onChange={(e) => setEditData({...editData, isProvider: e.target.checked})}
                        className="w-4 h-4 accent-emerald-500"
                      />
                      <span className="text-sm text-zinc-300">Aparecer no App para clientes agendarem</span>
                    </label>

                    <div className="flex gap-2 mt-2">
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded transition-colors text-sm font-medium">
                        Cancelar
                      </button>
                      <button onClick={() => handleUpdate(prof._id)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded transition-colors text-sm font-medium">
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-zinc-700 pt-4 flex items-center justify-between">
                    <p className="text-sm text-zinc-300">
                      Comissão atual: <strong className="text-emerald-400 text-lg">{prof.commissionRate || 0}%</strong>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(prof)}
                        className="rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-white"
                      >
                        Editar
                      </button>
                      {prof._id !== user?.id && (
                        <button
                          onClick={() => handleDelete(prof._id, prof.name)}
                          className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        >
                          Demitir
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}