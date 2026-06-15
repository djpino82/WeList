const prisma = require('../../config/database');

async function crearLista(nombre, descripcion, propietarioId) {
  const lista = await prisma.lista.create({
    data: {
      nombre,
      descripcion,
      propietarioId,
      colaboradores: {
        create: {
          usuarioId: propietarioId,
          rol: 'PROPIETARIO',
        },
      },
    },
    include: {
      propietario: {
        select: { id: true, nombre: true, email: true },
      },
      colaboradores: true,
    },
  });

  return lista;
}

async function obtenerListas(usuarioId) {
  const listas = await prisma.lista.findMany({
    where: {
      eliminadoEn: null,
      OR: [
        { propietarioId: usuarioId },
        { colaboradores: { some: { usuarioId } } },
      ],
    },
    include: {
      propietario: {
        select: { id: true, nombre: true, email: true },
      },
      _count: {
        select: { elementos: true, colaboradores: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return listas;
}

async function obtenerListaPorId(listaId, usuarioId) {
  const lista = await prisma.lista.findFirst({
    where: {
      id: listaId,
      eliminadoEn: null,
      OR: [
        { propietarioId: usuarioId },
        { colaboradores: { some: { usuarioId } } },
      ],
    },
    include: {
      propietario: {
        select: { id: true, nombre: true, email: true },
      },
      colaboradores: {
        include: {
          usuario: {
            select: { id: true, nombre: true, email: true },
          },
        },
      },
      elementos: {
        orderBy: { posicion: 'asc' },
      },
    },
  });

  if (!lista) {
    const error = new Error('Lista no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return lista;
}

async function editarLista(listaId, usuarioId, datos) {
  const lista = await prisma.lista.findFirst({
    where: {
      id: listaId,
      eliminadoEn: null,
      OR: [
        { propietarioId: usuarioId },
        {
          colaboradores: {
            some: { usuarioId, rol: { in: ['PROPIETARIO', 'EDITOR'] } },
          },
        },
      ],
    },
  });

  if (!lista) {
    const error = new Error('Lista no encontrada o sin permisos');
    error.statusCode = 404;
    throw error;
  }

  const listaEditada = await prisma.lista.update({
    where: { id: listaId },
    data: datos,
    include: {
      propietario: {
        select: { id: true, nombre: true, email: true },
      },
    },
  });

  return listaEditada;
}

async function eliminarLista(listaId, usuarioId) {
  const lista = await prisma.lista.findFirst({
    where: {
      id: listaId,
      eliminadoEn: null,
      propietarioId: usuarioId,
    },
  });

  if (!lista) {
    const error = new Error('Lista no encontrada o sin permisos');
    error.statusCode = 404;
    throw error;
  }

  await prisma.lista.update({
    where: { id: listaId },
    data: { eliminadoEn: new Date() },
  });

  return { message: 'Lista eliminada' };
}

module.exports = { crearLista, obtenerListas, obtenerListaPorId, editarLista, eliminarLista };
