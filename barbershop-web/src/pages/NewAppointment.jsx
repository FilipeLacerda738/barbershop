/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { createAppointment } from '../services/appointmentService';
import toast from 'react-hot-toast';

export function NewAppointment() {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);

  const [providerId, setProviderId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [providersResponse, servicesResponse] = await Promise.all([
          api.get('/providers'),
          api.get('/services')
        ]);

        setProviders(providersResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        toast.error('Erro ao carregar dados do servidor.');
      }
    }
    loadData();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();

    try {
      const fullDate = new Date(`${date}T${time}:00`).toISOString();

      await createAppointment({
        providerId: providerId,
        serviceId: serviceId,
        date: fullDate
      });

      toast.success('Horário marcado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro retornado pelo backend:", error.response?.data);
      toast.error(error.response?.data?.message || 'Erro ao criar o agendamento.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-zinc-800 p-8 shadow-xl border border-zinc-700">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Novo Agendamento</h1>
          <Link to="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Voltar
          </Link>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Profissional</label>
            <select
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um barbeiro</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Serviço</label>
            <select
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="" disabled>Selecione o serviço</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} - R$ {service.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Data</label>
              <input
                type="date"
                className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none [color-scheme:dark]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="w-1/2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Horário</label>
              <input
                type="time"
                className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none [color-scheme:dark]"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white transition-colors hover:bg-emerald-600 focus:outline-none"
          >
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  );
}