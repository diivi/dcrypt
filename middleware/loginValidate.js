const Joi = require("@hapi/joi");

const loginValidate = (data) => {
  const teamSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(1024).min(8).required(),
  });
  return teamSchema.validate(data);
};

module.exports = loginValidate;
