import { api } from './api.js';

export async function createAppointment(appointmentData) {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
  
}

export async function cancelAppointment(id) {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
}