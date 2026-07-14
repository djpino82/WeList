import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    });

    newSocket.connect();
    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [token]);

  const unirseADashboard = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('unirse-dashboard');
    }
  }, []);

  const unirseALista = useCallback((listaId) => {
    if (socketRef.current) {
      socketRef.current.emit('unirse-lista', { listaId });
    }
  }, []);

  const salirDeLista = useCallback((listaId) => {
    if (socketRef.current) {
      socketRef.current.emit('salir-lista', { listaId });
    }
  }, []);

  const escucharEvento = useCallback((evento, callback) => {
    if (socketRef.current) {
      socketRef.current.on(evento, callback);
    }
  }, []);

  const dejarDeEscuchar = useCallback((evento, callback) => {
    if (socketRef.current) {
      socketRef.current.off(evento, callback);
    }
  }, []);

  return {
    socket,
    unirseADashboard,
    unirseALista,
    salirDeLista,
    escucharEvento,
    dejarDeEscuchar,
  };
}
