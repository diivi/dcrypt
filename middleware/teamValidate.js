const Joi = require("@hapi/joi");

const validateTeam = (data) => {
  const teamSchema = Joi.object({
    school: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(1024).min(8).required(),
  });
  return teamSchema.validate(data, { abortEarly: false });
};

module.exports = validateTeam;
