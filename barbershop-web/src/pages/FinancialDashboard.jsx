/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export function FinancialDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFinances() {
      try {
        const response = await api.get('/dashboard/finances');
        setData(response.data);
      } catch (error) {
        toast.error('Erro ao carregar os dados financeiros.');
      } finally {
        setLoading(false);
      }
    }
    fetchFinances();
  }, []);


  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-emerald-500">
        <p className="text-xl font-bold animate-pulse">Calculando o caixa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="mx-auto max-w-5xl">
        

        <div className="mb-8">
          <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-emerald-400 mb-2 inline-block transition-colors">
            &larr; Voltar ao Dashboard Principal
          </Link>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Fluxo de Caixa do Mês</h2>
            <span className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium border border-zinc-700">
              Mês Atual
            </span>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          

          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-zinc-400 font-medium mb-1">Faturamento Bruto</h3>
            <p className="text-3xl font-bold text-white mb-2">
              {formatMoney(data?.overview?.totalRevenue || 0)}
            </p>
            <p className="text-xs text-zinc-500">Todo o dinheiro que entrou</p>
          </div>

          <div className="bg-zinc-800 border border-red-900/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full"></div>
            <h3 className="text-zinc-400 font-medium mb-1">Comissões da Equipe</h3>
            <p className="text-3xl font-bold text-red-400 mb-2">
              - {formatMoney(data?.overview?.totalCommissions || 0)}
            </p>
            <p className="text-xs text-zinc-500">Dinheiro repassado aos barbeiros</p>
          </div>

          <div className="bg-zinc-800 border border-emerald-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full"></div>
            <h3 className="text-zinc-400 font-medium mb-1">Lucro Líquido (Caixa)</h3>
            <p className="text-3xl font-bold text-emerald-400 mb-2">
              {formatMoney(data?.overview?.netProfit || 0)}
            </p>
            <p className="text-xs text-zinc-500">O que sobrou para a barbearia</p>
          </div>

        </div>

        <h3 className="text-xl font-bold text-white mb-4">Folha de Pagamento & Desempenho</h3>
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden">
          
          {data?.teamPerformance?.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              Nenhum serviço foi concluído neste mês ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-400 text-sm border-b border-zinc-700">
                    <th className="p-4 font-medium">Profissional</th>
                    <th className="p-4 font-medium text-center">Cortes Realizados</th>
                    <th className="p-4 font-medium">Valor Gerado</th>
                    <th className="p-4 font-medium text-emerald-400">Comissão a Receber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {data?.teamPerformance?.map((prof, index) => (
                    <tr key={index} className="hover:bg-zinc-700/20 transition-colors">
                      <td className="p-4 font-bold text-white">{prof.name}</td>
                      <td className="p-4 text-center text-zinc-300">
                        <span className="bg-zinc-700 px-2 py-1 rounded text-xs">
                          {prof.servicesRendered}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-300">{formatMoney(prof.totalGenerated)}</td>
                      <td className="p-4 font-bold text-emerald-400 bg-emerald-500/5">
                        {formatMoney(prof.commissionEarned)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}