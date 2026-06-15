const express = require('express');
const itemsController = require('./items.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const { crearElementoSchema, editarElementoSchema, reordenarElementosSchema } = require('./items.validation');

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.get('/', itemsController.obtenerElementos);

router.post('/', validate(crearElementoSchema), itemsController.crearElemento);

router.put('/orden', validate(reordenarElementosSchema), itemsController.reordenarElementos);

router.put('/:id', validate(editarElementoSchema), itemsController.editarElemento);

router.patch('/:id/completar', itemsController.toggleCompletado);

router.delete('/:id', itemsController.eliminarElemento);

module.exports = router;
