import api from './api';

export async function obtenerElementos(listaId) {
  const response = await api.get(`/listas/${listaId}/elementos`);
  return response.data;
}

export async function crearElemento(listaId, texto) {
  const response = await api.post(`/listas/${listaId}/elementos`, { texto });
  return response.data;
}

export async function editarElemento(listaId, elementoId, datos) {
  const response = await api.put(`/listas/${listaId}/elementos/${elementoId}`, datos);
  return response.data;
}

export async function toggleCompletado(listaId, elementoId) {
  const response = await api.patch(`/listas/${listaId}/elementos/${elementoId}/completar`);
  return response.data;
}

export async function eliminarElemento(listaId, elementoId) {
  const response = await api.delete(`/listas/${listaId}/elementos/${elementoId}`);
  return response.data;
}

export async function reordenarElementos(listaId, orden) {
  const response = await api.put(`/listas/${listaId}/elementos/orden`, { orden });
  return response.data;
}
