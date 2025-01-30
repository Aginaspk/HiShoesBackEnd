import joi from "joi";

const joiUserSchema = joi.object({
  name: joi.string(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least one capital letter, one number, and be at least 8 characters long.",
    }),
});

const joiUserLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export  { joiUserLogin, joiUserSchema };
