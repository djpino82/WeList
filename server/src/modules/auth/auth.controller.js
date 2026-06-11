const authService = require('./auth.service');
const { sendSuccess, sendError } = require('../../utils/response');

async function registrar(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    const resultado = await authService.registrar(nombre, email, password);
    return sendSuccess(res, 'Usuario registrado exitosamente', resultado, 201);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const resultado = await authService.login(email, password);
    return sendSuccess(res, 'Login exitoso', resultado);
  } catch (error) {
    next(error);
  }
}

async function obtenerPerfil(req, res, next) {
  try {
    const perfil = await authService.obtenerPerfil(req.usuario.id);
    return sendSuccess(res, 'Perfil obtenido', perfil);
  } catch (error) {
    next(error);
  }
}

module.exports = { registrar, login, obtenerPerfil };
