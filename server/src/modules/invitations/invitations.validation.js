const { z } = require('zod');

const invitarSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres')
    .optional(),
  rol: z.enum(['EDITOR', 'LECTOR']).default('EDITOR'),
});

module.exports = { invitarSchema };
