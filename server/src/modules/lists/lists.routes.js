const express = require('express');
const listsController = require('./lists.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const { crearListaSchema, editarListaSchema } = require('./lists.validation');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(crearListaSchema), listsController.crearLista);

router.get('/', listsController.obtenerListas);

router.get('/:id', listsController.obtenerListaPorId);

router.put('/:id', validate(editarListaSchema), listsController.editarLista);

router.delete('/:id', listsController.eliminarLista);

module.exports = router;
