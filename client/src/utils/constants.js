const isProd = window.location.hostname !== 'localhost';

export const API_URL = import.meta.env.VITE_API_URL
  || (isProd ? 'https://welist-production-b5d2.up.railway.app/api' : 'http://localhost:3001/api');
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
  || (isProd ? 'wss://welist-production-b5d2.up.railway.app' : 'http://localhost:3001');

export const ROLES = {
  PROPIETARIO: 'PROPIETARIO',
  EDITOR: 'EDITOR',
  LECTOR: 'LECTOR',
};
