import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { cancelAppointment } from '../services/appointmentService';
import { BarberDashboard } from './BarberDashboard';

export function Dashboard(){
  const { user, signOut } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  useEffect(() => {
    async function fetchAppointments() {
      if (user?.role === 'admin' || user?.role === 'owner') return;

      try {
        const response = await api.get('/appointments/me');
        setAppointments(response.data);
      } catch (error) {
        toast.error('Erro ao buscar seus agendamentos.');
      }
    }

    fetchAppointments();
  }, [user?.role]);

  async function handleCancel(id) {
    const isConfirmed = window.confirm('Tem certeza que deseja cancelar este horário?');
    
    if (!isConfirmed) return;

    try {
      await cancelAppointment(id);
      setAppointments(appointments.filter(appointment => appointment._id !== id));
      toast.success('Agendamento cancelado com sucesso!');
    } catch (error) {
      toast.error('Erro ao cancelar o agendamento.');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
    
      <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-500">Barbershop</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">Olá, <strong className="text-white">{user?.name}</strong></span>
            <button
                onClick={handleSignOut}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-red-400">
                Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        
        {user?.role === 'admin' || user?.role === 'owner' ? (
          <BarberDashboard />
        ) : (
    
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Meus Agendamentos</h2>
              <Link 
                to="/new-appointment"
                className="rounded-lg bg-emerald-500 px-4 py-2 font-bold text-white transition-colors hover:bg-emerald-600"
              >
                + Novo Agendamento
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-800/50 p-8 text-center">
                <p className="text-zinc-400">Você ainda não tem nenhum horário marcado.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {appointments.map((appointment) => {
                  
                  const isDone = appointment.status === 'completed' || appointment.status === 'no-show';

                  return (
                    <div 
                      key={appointment._id} 
                      className={`flex items-center justify-between rounded-xl p-4 shadow-sm border transition-all ${
                        isDone ? 'bg-zinc-800/50 border-zinc-700/50 opacity-60' : 'bg-zinc-800 border-zinc-700'
                      }`}
                    >
                      <div>
                        <p className={`font-semibold ${isDone ? 'text-zinc-400' : 'text-white'}`}>
                          {appointment.service?.name || 'Serviço Indisponível'}
                        </p>
                        <p className="text-sm text-zinc-500">
                          Com: {appointment.provider?.name || 'Barbeiro'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className={`font-semibold ${isDone ? 'text-zinc-500' : 'text-emerald-400'}`}>
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        <div className="w-24 flex justify-end">
                          {appointment.status === 'pending' || appointment.status === 'confirmed' || !appointment.status ? (
                            <button
                              onClick={() => handleCancel(appointment._id)}
                              className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                              title="Cancelar Agendamento"
                            >
                              Cancelar
                            </button>
                          ) : appointment.status === 'completed' ? (
                            <span className="rounded bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500">
                              Concluído
                            </span>
                          ) : appointment.status === 'no-show' ? (
                            <span className="rounded bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500">
                              Faltou
                            </span>
                          ): null }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}