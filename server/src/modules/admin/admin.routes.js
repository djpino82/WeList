const express = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const { restablecerPasswordSchema } = require('./admin.validation');
const adminController = require('./admin.controller');

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize('admin'),
  adminController.listarUsuarios
);

router.post(
  '/:id/restablecer-password',
  authenticate,
  authorize('admin'),
  validate(restablecerPasswordSchema),
  adminController.restablecerPassword
);

module.exports = router;
