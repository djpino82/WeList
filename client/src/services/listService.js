import api from './api';

export async function obtenerListas() {
  const response = await api.get('/listas');
  return response.data;
}

export async function obtenerListaPorId(id) {
  const response = await api.get(`/listas/${id}`);
  return response.data;
}

export async function crearLista(datos) {
  const response = await api.post('/listas', datos);
  return response.data;
}

export async function editarLista(id, datos) {
  const response = await api.put(`/listas/${id}`, datos);
  return response.data;
}

export async function eliminarLista(id) {
  const response = await api.delete(`/listas/${id}`);
  return response.data;
}
