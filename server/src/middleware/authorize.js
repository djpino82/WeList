const prisma = require('../config/database');

function authorize(...rolesPermitidos) {
  return async (req, res, next) => {
    try {
      if (!req.usuario || !req.usuario.id) {
        return res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: req.usuario.id },
        select: { rol: true },
      });

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para realizar esta acción',
        });
      }

      req.usuario.rol = usuario.rol;
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = authorize;
