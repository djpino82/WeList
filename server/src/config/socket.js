const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, CLIENT_URL } = require('./env');
const prisma = require('./database');

function configurarSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Autenticación requerida'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.userId}`);

    socket.on('unirse-dashboard', () => {
      socket.join(`dashboard:${socket.userId}`);
      console.log(`Usuario ${socket.userId} se unió a su dashboard`);
    });

    socket.on('unirse-lista', async ({ listaId }) => {
      try {
        const colaborador = await prisma.colaboradorLista.findUnique({
          where: {
            usuarioId_listaId: {
              usuarioId: socket.userId,
              listaId,
            },
          },
        });

        if (colaborador) {
          socket.join(`lista:${listaId}`);
          console.log(`Usuario ${socket.userId} se unió a lista ${listaId}`);
        }
      } catch (error) {
        console.error('Error al unirse a sala:', error);
      }
    });

    socket.on('salir-lista', ({ listaId }) => {
      socket.leave(`lista:${listaId}`);
      console.log(`Usuario ${socket.userId} salió de lista ${listaId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.userId}`);
    });
  });

  return io;
}

module.exports = configurarSocket;
