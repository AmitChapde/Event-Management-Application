const Joi = require("joi");

module.exports = (schema) => {
  return (req, res, next) => {
    const validations = [];

    if (schema.params) {
      const result = schema.params.validate(req.params, {
        abortEarly: false,
        allowUnknown: false,
      });
      validations.push(result);
    }

    if (schema.body) {
      const result = schema.body.validate(req.body, {
        abortEarly: false,
        allowUnknown: false,
      });
      validations.push(result);
    }

    if (schema.query) {
      const result = schema.query.validate(req.query, {
        abortEarly: false,
        allowUnknown: false,
      });
      validations.push(result);
    }

  
    const errors = validations
      .filter((v) => v.error)
      .flatMap((v) => v.error.details.map((d) => d.message));

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};
