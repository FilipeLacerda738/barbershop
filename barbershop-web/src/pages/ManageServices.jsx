/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export function ManageServices() {
  const [services, setServices] = useState([]);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30); 
  const [description, setDescription] = useState('');
  
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Erro ao carregar serviços.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name,
      description,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
    };

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        toast.success('Serviço atualizado!');
      } else {
        await api.post('/services', payload);
        toast.success('Serviço criado com sucesso!');
      }

      // Limpa os campos
      resetForm();
      loadServices();
    } catch (error) {
      const responseData = error.response?.data;
      if (responseData?.status === 'error' || responseData?.status === 'validation_error') {
        const errorMsg = responseData.errors ? responseData.errors[0].message : responseData.message;
        toast.error(errorMsg);
      } else {
        toast.error('Erro ao salvar o serviço.');
      }
    }
  }

  function handleEdit(service) {
    setEditingId(service._id);
    setName(service.name);
    setPrice(service.price);
    setDurationMinutes(service.durationMinutes || 30);
    setDescription(service.description || '');
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja inativar este serviço?')) return;

    try {
      await api.delete(`/services/${id}`);
      toast.success('Serviço inativado com sucesso!');
      loadServices(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao excluir serviço.');
    }
  }

  function resetForm() {
    setEditingId(null);
    setName('');
    setPrice('');
    setDurationMinutes(30);
    setDescription('');
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-emerald-500">Gestão de Serviços</h2>
          <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white">
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="mb-8 rounded-xl bg-zinc-800 p-6 shadow-xl border border-zinc-700">
          <h3 className="mb-4 text-lg font-semibold">{editingId ? 'Editar Serviço' : 'Novo Serviço'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm text-zinc-400">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="Ex: Corte Degradê"
                />
              </div>

              <div className="w-32">
                <label className="mb-1 block text-sm text-zinc-400">Preço (R$) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="w-32">
                <label className="mb-1 block text-sm text-zinc-400">Duração (Min) *</label>
                <input
                  type="number"
                  required
                  min="15"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-400">Descrição (Opcional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
                placeholder="Ex: Inclui lavagem e finalização com pomada"
              />
            </div>

            <div className="mt-2 flex gap-2 justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-6 py-2 font-bold text-white transition-colors hover:bg-emerald-600"
              >
                {editingId ? 'Salvar Alterações' : 'Adicionar Serviço'}
              </button>
            </div>

          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map(service => (
            <div key={service._id} className="flex flex-col justify-between rounded-xl bg-zinc-800 p-4 border border-zinc-700">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-lg">{service.name}</h4>
                  <p className="text-emerald-400 font-bold text-lg">R$ {service.price.toFixed(2)}</p>
                </div>
                {service.description && (
                  <p className="text-sm text-zinc-400 mt-1">{service.description}</p>
                )}
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-zinc-900 text-zinc-300 rounded">
                  ⏱ {service.durationMinutes} min
                </span>
              </div>
              
              <div className="flex justify-end gap-2 border-t border-zinc-700 pt-3">
                <button
                  onClick={() => handleEdit(service)}
                  className="rounded-lg bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="rounded-lg bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Inativar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}