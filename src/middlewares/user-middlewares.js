const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { UserService } = require("../services");
const { UserSchema } = require("../schemas");

async function validateSignup(req, res, next) {
  try {
    await UserSchema.signupValidation.parseAsync(req.body);

    next();
  } catch (error) {
    console.log(error);
    let explaination = [];
    error.issues.forEach((err) => {
      explaination.push({
        code: err.code,
        field: err.path[0],
        message: err.message,
      });
    });
    ErrorResponse.message = "Zod Schema Validation Error!";
    ErrorResponse.error = explaination;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

async function validateSignin(req, res, next) {
  try {
    await UserSchema.signinValidation.parseAsync(req.body);

    next();
  } catch (error) {
    console.log(error);
    let explaination = [];
    error.issues.forEach((err) => {
      explaination.push({
        code: err.code,
        field: err.path[0],
        message: err.message,
      });
    });
    ErrorResponse.message = "Zod Schema Validation Error!";
    ErrorResponse.error = explaination;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

async function validateUpdateUser(req, res, next) {
  try {
    await UserSchema.updateValidation.parseAsync(req.body);

    next();
  } catch (error) {
    console.log(error);
    let explaination = [];
    error.issues.forEach((err) => {
      explaination.push({
        code: err.code,
        field: err.path[0],
        message: err.message,
      });
    });
    ErrorResponse.message = "Zod Schema Validation Error!";
    ErrorResponse.error = explaination;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

async function chekAuth(req, res, next) {
  try {
    let token = "";

    if (req.headers["authorization"]) {
      token = req.headers["authorization"].split(" ")[1];
    }

    const response = await UserService.isAuthenticated(token);

    if (response) {
      req.user = response;
      next();
    }
  } catch (error) {
    ErrorResponse.message = error.message;
    ErrorResponse.error = error.explanation;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,
  chekAuth,
};
