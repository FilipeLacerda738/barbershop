/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@Barbershop:token');
    const user = localStorage.getItem('@Barbershop:user');

    if (token && user) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {};
  });

  async function signIn({ email, password }) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('@Barbershop:token', token);
      localStorage.setItem('@Barbershop:user', JSON.stringify(user));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setData({ token, user });

      toast.success('Login feito com sucesso!');

    } catch (error) {
      const mensagemDeErro = error.response?.data?.message || 'Erro ao tentar fazer login.';
      toast.error(mensagemDeErro);
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('@Barbershop:token');
    localStorage.removeItem('@Barbershop:user');
    setData({});
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user: data.user }}>
      {children}
    </AuthContext.Provider>
  );
}