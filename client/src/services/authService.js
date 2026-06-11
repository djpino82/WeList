import api from './api';

export async function registrar(datos) {
  const response = await api.post('/auth/registro', datos);
  return response.data;
}

export async function login(datos) {
  const response = await api.post('/auth/login', datos);
  return response.data;
}

export async function obtenerPerfil() {
  const response = await api.get('/auth/perfil');
  return response.data;
}
