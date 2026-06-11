const listsService = require('./lists.service');
const { sendSuccess, sendError } = require('../../utils/response');

async function crearLista(req, res, next) {
  try {
    const { nombre, descripcion } = req.body;
    const lista = await listsService.crearLista(nombre, descripcion, req.usuario.id);
    return sendSuccess(res, 'Lista creada', lista, 201);
  } catch (error) {
    next(error);
  }
}

async function obtenerListas(req, res, next) {
  try {
    const listas = await listsService.obtenerListas(req.usuario.id);
    return sendSuccess(res, 'Listas obtenidas', listas);
  } catch (error) {
    next(error);
  }
}

async function obtenerListaPorId(req, res, next) {
  try {
    const lista = await listsService.obtenerListaPorId(req.params.id, req.usuario.id);
    return sendSuccess(res, 'Lista obtenida', lista);
  } catch (error) {
    next(error);
  }
}

async function editarLista(req, res, next) {
  try {
    const lista = await listsService.editarLista(
      req.params.id,
      req.usuario.id,
      req.body
    );
    return sendSuccess(res, 'Lista actualizada', lista);
  } catch (error) {
    next(error);
  }
}

async function eliminarLista(req, res, next) {
  try {
    const resultado = await listsService.eliminarLista(req.params.id, req.usuario.id);
    return sendSuccess(res, resultado.message);
  } catch (error) {
    next(error);
  }
}

module.exports = { crearLista, obtenerListas, obtenerListaPorId, editarLista, eliminarLista };
