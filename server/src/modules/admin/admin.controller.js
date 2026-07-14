const adminService = require('./admin.service');
const { sendSuccess, sendError } = require('../../utils/response');

async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await adminService.obtenerUsuarios();
    return sendSuccess(res, 'Usuarios obtenidos', usuarios);
  } catch (error) {
    next(error);
  }
}

async function restablecerPassword(req, res, next) {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const usuario = await adminService.restablecerPassword(id, password);
    return sendSuccess(res, 'Contraseña restablecida exitosamente', usuario);
  } catch (error) {
    next(error);
  }
}

module.exports = { listarUsuarios, restablecerPassword };
