const HttpError = require("../utils/HttpError");

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((item) => item.message).join(", ");
      return next(new HttpError(400, message));
    }

    req.body = value;
    next();
  };
}

module.exports = validateBody;
