const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    const usuario = await prisma.usuario.update({
      where: { email: 'djaimep82@gmail.com' },
      data: { rol: 'admin' },
    });

    console.log('Admin actualizado:');
    console.log('  Nombre:', usuario.nombre);
    console.log('  Email:', usuario.email);
    console.log('  Rol:', usuario.rol);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
