import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export function useSocket() {
  const socketRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  function unirseALista(listaId) {
    if (socketRef.current) {
      socketRef.current.emit('unirse-lista', { listaId });
    }
  }

  function salirDeLista(listaId) {
    if (socketRef.current) {
      socketRef.current.emit('salir-lista', { listaId });
    }
  }

  function escucharEvento(evento, callback) {
    if (socketRef.current) {
      socketRef.current.on(evento, callback);
    }
  }

  function dejarDeEscuchar(evento, callback) {
    if (socketRef.current) {
      socketRef.current.off(evento, callback);
    }
  }

  return {
    socket: socketRef.current,
    unirseALista,
    salirDeLista,
    escucharEvento,
    dejarDeEscuchar,
  };
}
