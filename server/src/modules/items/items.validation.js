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

const reordenarElementosSchema = z.object({
  orden: z
    .array(
      z.object({
        id: z.string().min(1, 'El ID es requerido'),
        posicion: z.number().int().min(0, 'La posición debe ser un número positivo'),
      })
    )
    .min(1, 'El orden no puede estar vacío'),
});

module.exports = { crearElementoSchema, editarElementoSchema, reordenarElementosSchema };
