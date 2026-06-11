const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const { loginLimiter } = require('../../middleware/rateLimiter');
const { registroSchema, loginSchema } = require('./auth.validation');

const router = express.Router();

router.post('/registro', validate(registroSchema), authController.registrar);

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login
);

router.get('/perfil', authenticate, authController.obtenerPerfil);

module.exports = router;
