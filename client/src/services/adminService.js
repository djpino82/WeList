import api from './api';

export async function obtenerUsuarios() {
  const response = await api.get('/admin');
  return response.data;
}

export async function restablecerPassword(usuarioId, password) {
  const response = await api.post(`/admin/usuarios/${usuarioId}/restablecer-password`, { password });
  return response.data;
}
