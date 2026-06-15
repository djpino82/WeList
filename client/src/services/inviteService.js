import api from './api';

export async function crearInvitacion(listaId, rol = 'EDITOR') {
  const response = await api.post(`/listas/${listaId}/invitar`, { rol });
  return response.data;
}

export async function verificarInvitacion(token) {
  const response = await api.get(`/invitaciones/${token}`);
  return response.data;
}

export async function aceptarInvitacion(token) {
  const response = await api.post(`/invitaciones/${token}/aceptar`);
  return response.data;
}
