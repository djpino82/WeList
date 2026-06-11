import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const queryClient = useQueryClient();

  const { data: usuario, isLoading } = useQuery({
    queryKey: ['perfil'],
    queryFn: authService.obtenerPerfil,
    enabled: !!token,
    retry: false,
    onError: () => {
      logout();
    },
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  async function login(datos) {
    const respuesta = await authService.login(datos);
    setToken(respuesta.data.token);
    queryClient.setQueryData(['perfil'], respuesta.data.usuario);
    return respuesta;
  }

  async function registro(datos) {
    const respuesta = await authService.registrar(datos);
    setToken(respuesta.data.token);
    queryClient.setQueryData(['perfil'], respuesta.data.usuario);
    return respuesta;
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('token');
    queryClient.removeQueries(['perfil']);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario: usuario?.data || null,
        token,
        isLoading,
        login,
        registro,
        logout,
        isAuthenticated: !!token && !!usuario?.data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
