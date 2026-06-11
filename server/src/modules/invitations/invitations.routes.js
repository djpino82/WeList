const express = require('express');
const invitationsController = require('./invitations.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const { inviteLimiter } = require('../../middleware/rateLimiter');
const { invitarSchema } = require('./invitations.validation');

const router = express.Router();

router.post(
  '/listas/:listaId/invitar',
  authenticate,
  inviteLimiter,
  validate(invitarSchema),
  invitationsController.invitar
);

router.get('/invitaciones/:token', invitationsController.verificarInvitacion);

router.post(
  '/invitaciones/:token/aceptar',
  authenticate,
  invitationsController.aceptarInvitacion
);

module.exports = router;
