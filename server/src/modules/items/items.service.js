const prisma = require('../../config/database');

async function verificarAcceso(listaId, usuarioId) {
  const colaborador = await prisma.colaboradorLista.findUnique({
    where: {
      usuarioId_listaId: { usuarioId, listaId },
    },
  });

  return colaborador;
}

async function obtenerElementos(listaId, usuarioId) {
  const colaborador = await verificarAcceso(listaId, usuarioId);

  if (!colaborador) {
    const error = new Error('No tienes acceso a esta lista');
    error.statusCode = 403;
    throw error;
  }

  const elementos = await prisma.elemento.findMany({
    where: { listaId },
    orderBy: { posicion: 'asc' },
  });

  return elementos;
}

async function crearElemento(listaId, usuarioId, texto) {
  const colaborador = await verificarAcceso(listaId, usuarioId);

  if (!colaborador || colaborador.rol === 'LECTOR') {
    const error = new Error('No tienes permisos para crear elementos');
    error.statusCode = 403;
    throw error;
  }

  const ultimoElemento = await prisma.elemento.findFirst({
    where: { listaId },
    orderBy: { posicion: 'desc' },
  });

  const nuevaPosicion = ultimoElemento ? ultimoElemento.posicion + 1 : 0;

  const elemento = await prisma.elemento.create({
    data: {
      texto,
      listaId,
      posicion: nuevaPosicion,
    },
  });

  return elemento;
}

async function editarElemento(listaId, elementoId, usuarioId, datos) {
  const colaborador = await verificarAcceso(listaId, usuarioId);

  if (!colaborador || colaborador.rol === 'LECTOR') {
    const error = new Error('No tienes permisos para editar elementos');
    error.statusCode = 403;
    throw error;
  }

  const elemento = await prisma.elemento.findFirst({
    where: { id: elementoId, listaId },
  });

  if (!elemento) {
    const error = new Error('Elemento no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const elementoEditado = await prisma.elemento.update({
    where: { id: elementoId },
    data: datos,
  });

  return elementoEditado;
}

async function toggleCompletado(listaId, elementoId, usuarioId) {
  const colaborador = await verificarAcceso(listaId, usuarioId);

  if (!colaborador) {
    const error = new Error('No tienes acceso a esta lista');
    error.statusCode = 403;
    throw error;
  }

  const elemento = await prisma.elemento.findFirst({
    where: { id: elementoId, listaId },
  });

  if (!elemento) {
    const error = new Error('Elemento no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const elementoActualizado = await prisma.elemento.update({
    where: { id: elementoId },
    data: { completado: !elemento.completado },
  });

  return elementoActualizado;
}

async function eliminarElemento(listaId, elementoId, usuarioId) {
  const colaborador = await verificarAcceso(listaId, usuarioId);

  if (!colaborador || colaborador.rol === 'LECTOR') {
    const error = new Error('No tienes permisos para eliminar elementos');
    error.statusCode = 403;
    throw error;
  }

  const elemento = await prisma.elemento.findFirst({
    where: { id: elementoId, listaId },
  });

  if (!elemento) {
    const error = new Error('Elemento no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await prisma.elemento.delete({
    where: { id: elementoId },
  });

  return { message: 'Elemento eliminado' };
}

module.exports = {
  obtenerElementos,
  crearElemento,
  editarElemento,
  toggleCompletado,
  eliminarElemento,
};
