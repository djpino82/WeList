function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        error: result.error.errors,
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
