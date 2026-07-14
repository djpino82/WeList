const bcrypt = require('bcryptjs');
const prisma = require('../../config/database');

const SALT_ROUNDS = 10;

async function obtenerUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return usuarios;
}

async function restablecerPassword(usuarioId, nuevaPassword) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { id: true, nombre: true, email: true },
  });

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const passwordHash = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { passwordHash },
  });

  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
}

module.exports = { obtenerUsuarios, restablecerPassword };
