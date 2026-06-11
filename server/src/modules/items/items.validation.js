const { z } = require('zod');

const crearElementoSchema = z.object({
  texto: z
    .string()
    .min(1, 'El texto es requerido')
    .max(500, 'El texto no puede exceder 500 caracteres'),
});

const editarElementoSchema = z.object({
  texto: z
    .string()
    .min(1, 'El texto es requerido')
    .max(500, 'El texto no puede exceder 500 caracteres')
    .optional(),
  completado: z.boolean().optional(),
});

module.exports = { crearElementoSchema, editarElementoSchema };
