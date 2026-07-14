const { z } = require('zod');

const restablecerPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
});

module.exports = { restablecerPasswordSchema };
