/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function BarberDashboard() {
  const { user } = useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const response = await api.get('/schedule', { params: { date } });
        setSchedule(response.data);
      } catch (error) {
        toast.error('Erro ao carregar a agenda.');
      }
    }
    loadSchedule();
  }, [date]);

  async function handleStatusChange(id, newStatus) {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      
      setSchedule(schedule.map(appointment => 
        appointment._id === id ? { ...appointment, status: newStatus } : appointment
      ));
      
      toast.success(`Status atualizado com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar o status no banco de dados.');
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <h2 className="text-2xl font-bold text-white">Minha Agenda</h2>
          
          {user?.role === 'owner' && (
            <div className="flex gap-2 items-center">
              <Link to="/manage-services" className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white">
                Gerenciar Serviços
              </Link>
              <Link to="/manage-professionals" className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white">
                Minha Equipe
              </Link>
              <Link to="/finances" className="rounded bg-emerald-600 px-3 py-1 text-sm font-bold text-white transition-colors hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
                Caixa e Finanças
              </Link>
            </div>
          )}
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-white border border-zinc-700 focus:border-emerald-500 focus:outline-none [color-scheme:dark]"
        />
      </div>

      {schedule.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-800/50 p-8 text-center">
          <p className="text-zinc-400">Nenhum agendamento para este dia.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {schedule.map((appointment) => {
            const time = new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            const isDone = appointment.status === 'completed' || appointment.status === 'no-show';
            
            return (
              <div 
                key={appointment._id} 
                className={`flex items-center justify-between rounded-xl bg-zinc-800 p-5 shadow-sm border border-zinc-700 transition-all ${isDone ? 'opacity-50 border-l-4 border-l-zinc-600' : 'border-l-4 border-l-emerald-500'}`}
              >
                <div className="flex gap-6 items-center">
                  <div className={`text-xl font-bold w-16 ${isDone ? 'text-zinc-500' : 'text-emerald-400'}`}>
                    {time}
                  </div>
                  <div className="h-10 w-px bg-zinc-700"></div>
                  <div>
                    <p className={`font-bold text-lg ${isDone ? 'text-zinc-400' : 'text-white'}`}>
                      {appointment.client?.name || 'Cliente'}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {appointment.service?.name} - R$ {appointment.service?.price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isDone ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(appointment._id, 'no-show')}
                        className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        title="Cliente não compareceu"
                      >
                        Faltou
                      </button>
                      <button
                        onClick={() => handleStatusChange(appointment._id, 'completed')}
                        className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-500 transition-colors hover:bg-emerald-500 hover:text-white"
                        title="Atendimento concluído"
                      >
                        Concluir
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-900 text-zinc-400 rounded-md">
                      {appointment.status === 'completed' ? 'Concluído' : 'Ausente'}
                    </span>
                  )}
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}