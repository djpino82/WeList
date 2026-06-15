const itemsService = require('./items.service');
const { sendSuccess, sendError } = require('../../utils/response');

async function obtenerElementos(req, res, next) {
  try {
    const elementos = await itemsService.obtenerElementos(
      req.params.listaId,
      req.usuario.id
    );
    return sendSuccess(res, 'Elementos obtenidos', elementos);
  } catch (error) {
    next(error);
  }
}

async function crearElemento(req, res, next) {
  try {
    const { texto } = req.body;
    const elemento = await itemsService.crearElemento(
      req.params.listaId,
      req.usuario.id,
      texto
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`lista:${req.params.listaId}`).emit('elemento-creado', {
        listaId: req.params.listaId,
        elemento,
      });
    }

    return sendSuccess(res, 'Elemento creado', elemento, 201);
  } catch (error) {
    next(error);
  }
}

async function editarElemento(req, res, next) {
  try {
    const elemento = await itemsService.editarElemento(
      req.params.listaId,
      req.params.id,
      req.usuario.id,
      req.body
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`lista:${req.params.listaId}`).emit('elemento-actualizado', {
        listaId: req.params.listaId,
        elemento,
      });
    }

    return sendSuccess(res, 'Elemento actualizado', elemento);
  } catch (error) {
    next(error);
  }
}

async function toggleCompletado(req, res, next) {
  try {
    const elemento = await itemsService.toggleCompletado(
      req.params.listaId,
      req.params.id,
      req.usuario.id
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`lista:${req.params.listaId}`).emit('elemento-completado', {
        listaId: req.params.listaId,
        elementoId: elemento.id,
        completado: elemento.completado,
      });
    }

    return sendSuccess(res, 'Estado actualizado', elemento);
  } catch (error) {
    next(error);
  }
}

async function eliminarElemento(req, res, next) {
  try {
    const resultado = await itemsService.eliminarElemento(
      req.params.listaId,
      req.params.id,
      req.usuario.id
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`lista:${req.params.listaId}`).emit('elemento-eliminado', {
        listaId: req.params.listaId,
        elementoId: req.params.id,
      });
    }

    return sendSuccess(res, resultado.message);
  } catch (error) {
    next(error);
  }
}

async function reordenarElementos(req, res, next) {
  try {
    const resultado = await itemsService.reordenarElementos(
      req.params.listaId,
      req.usuario.id,
      req.body.orden
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`lista:${req.params.listaId}`).emit('elementos-reordenados', {
        listaId: req.params.listaId,
        orden: req.body.orden,
      });
    }

    return sendSuccess(res, resultado.message);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerElementos,
  crearElemento,
  editarElemento,
  toggleCompletado,
  eliminarElemento,
  reordenarElementos,
};
