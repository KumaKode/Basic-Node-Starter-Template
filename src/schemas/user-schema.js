const zod = require("zod");

const signupValidation = zod.object({
  userName: zod.string().email().trim(),
  password: zod.string().min(8),
  firstName: zod.string().min(3).max(25),
  lastName: zod.string().min(3).max(25),
});

const signinValidation = zod.object({
  userName: zod.string().email().trim(),
  password: zod.string().min(8),
});

const updateValidation = zod.object({
  firstName: zod.string().min(3).max(25).optional(),
  lastName: zod.string().min(3).max(25).optional(),
});

module.exports = {
  signupValidation,
  signinValidation,
  updateValidation,
};
