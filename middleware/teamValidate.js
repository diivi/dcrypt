const Joi = require("@hapi/joi");

const validateTeam = (data) => {
  const teamSchema = Joi.object({
    school: Joi.string().max(30).required(),
    name: Joi.string().max(20).required(),
    discord: Joi.string().max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(256).min(8).required(),
    "g-recaptcha-response": Joi.string().allow(""),
  });
  return teamSchema.validate(data, { abortEarly: false });
};

module.exports = validateTeam;
