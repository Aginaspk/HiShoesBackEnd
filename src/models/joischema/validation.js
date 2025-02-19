import joi from "joi";

const joiUserSchema = joi.object({
  name: joi.string(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
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

const joiProductSchema = joi.object({
  name: joi.string().trim().optional(),
  description: joi.string().trim().optional(),
  price: joi.number().optional(),
  sale: joi.number().optional(),
  brand: joi.string().trim().optional(),
  sizes: joi.string().trim().optional(),
  gender: joi.string().trim().optional(), // Corrected "trm" to "trim"
  sold: joi.number().optional(),
  isDeleted:joi.boolean().default(false).optional(),

});

export { joiUserLogin, joiUserSchema, joiProductSchema };
