const invitationsService = require('./invitations.service');
const { sendSuccess, sendError } = require('../../utils/response');

async function invitar(req, res, next) {
  try {
    const { email, rol } = req.body;
    const resultado = await invitationsService.invitar(
      req.params.listaId,
      req.usuario.id,
      email,
      rol
    );
    return sendSuccess(res, resultado.mensaje, { ...resultado.invitacion, enlace: resultado.enlace }, 201);
  } catch (error) {
    next(error);
  }
}

async function verificarInvitacion(req, res, next) {
  try {
    const invitacion = await invitationsService.verificarInvitacion(req.params.token);
    return sendSuccess(res, 'Invitación válida', invitacion);
  } catch (error) {
    next(error);
  }
}

async function aceptarInvitacion(req, res, next) {
  try {
    const resultado = await invitationsService.aceptarInvitacion(
      req.params.token,
      req.usuario.id
    );
    return sendSuccess(res, resultado.mensaje);
  } catch (error) {
    next(error);
  }
}

module.exports = { invitar, verificarInvitacion, aceptarInvitacion };
