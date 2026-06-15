const { v4: uuidv4 } = require('uuid');
const prisma = require('../../config/database');
const { CLIENT_URL } = require('../../config/env');

const EXPIRACION_HORAS = 72;

async function invitar(listaId, emisorId, email, rol) {
  const lista = await prisma.lista.findFirst({
    where: {
      id: listaId,
      eliminadoEn: null,
      OR: [
        { propietarioId: emisorId },
        {
          colaboradores: {
            some: { usuarioId: emisorId, rol: { in: ['PROPIETARIO', 'EDITOR'] } },
          },
        },
      ],
    },
    include: {
      propietario: { select: { nombre: true } },
    },
  });

  if (!lista) {
    const error = new Error('Lista no encontrada o sin permisos');
    error.statusCode = 404;
    throw error;
  }

  if (email) {
    const invitacionExistente = await prisma.invitacion.findFirst({
      where: {
        listaId,
        email,
        pendiente: true,
        expiracion: { gt: new Date() },
      },
    });

    if (invitacionExistente) {
      const error = new Error('Ya existe una invitación pendiente para este email');
      error.statusCode = 400;
      throw error;
    }
  }

  const receptor = email ? await prisma.usuario.findUnique({ where: { email } }) : null;

  const token = uuidv4();
  const expiracion = new Date();
  expiracion.setHours(expiracion.getHours() + EXPIRACION_HORAS);

  const invitacion = await prisma.invitacion.create({
    data: {
      token,
      email: email || `invitacion-${token.slice(0, 8)}@enlace`,
      rol,
      listaId,
      emisorId,
      receptorId: receptor ? receptor.id : null,
      pendiente: !receptor,
      expiracion,
    },
  });

  const enlace = `${CLIENT_URL[0]}/invitacion/${token}`;

  return {
    mensaje: 'Enlace de invitación generado',
    invitacion: { id: invitacion.id, email: invitacion.email, rol },
    enlace,
  };
}

async function verificarInvitacion(token) {
  const invitacion = await prisma.invitacion.findUnique({
    where: { token },
    include: {
      lista: { select: { id: true, nombre: true } },
      emisor: { select: { id: true, nombre: true, email: true } },
    },
  });

  if (!invitacion) {
    const error = new Error('Invitación no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (new Date() > invitacion.expiracion) {
    const error = new Error('La invitación ha expirado');
    error.statusCode = 400;
    throw error;
  }

  return {
    id: invitacion.id,
    email: invitacion.email,
    rol: invitacion.rol,
    lista: invitacion.lista,
    emisor: invitacion.emisor,
    pendiente: invitacion.pendiente,
  };
}

async function aceptarInvitacion(token, usuarioId) {
  const invitacion = await prisma.invitacion.findUnique({
    where: { token },
  });

  if (!invitacion) {
    const error = new Error('Invitación no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (new Date() > invitacion.expiracion) {
    const error = new Error('La invitación ha expirado');
    error.statusCode = 400;
    throw error;
  }

  if (invitacion.aceptada) {
    const error = new Error('La invitación ya fue aceptada');
    error.statusCode = 400;
    throw error;
  }

  const colaboracionExistente = await prisma.colaboradorLista.findUnique({
    where: {
      usuarioId_listaId: {
        usuarioId,
        listaId: invitacion.listaId,
      },
    },
  });

  if (colaboracionExistente) {
    await prisma.invitacion.update({
      where: { id: invitacion.id },
      data: { aceptada: true, pendiente: false },
    });

    return { mensaje: 'Ya eres colaborador de esta lista' };
  }

  await prisma.$transaction([
    prisma.colaboradorLista.create({
      data: {
        usuarioId,
        listaId: invitacion.listaId,
        rol: invitacion.rol,
      },
    }),
    prisma.invitacion.update({
      where: { id: invitacion.id },
      data: { aceptada: true, pendiente: false, receptorId: usuarioId },
    }),
  ]);

  return { mensaje: 'Invitación aceptada. Ahora eres colaborador de la lista.' };
}

module.exports = { invitar, verificarInvitacion, aceptarInvitacion };
