const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth } = require("../utils/common");

const userRepository = new UserRepository();

async function signup(data) {
  try {
    let user = await userRepository.find({ userName: data.userName });

    if (user) {
      throw new AppError(
        "User with this email already exists",
        { explanation: "" },
        StatusCodes.CONFLICT
      );
    }

    user = await userRepository.create(data);

    const jwt = Auth.createToken({ id: user._id, email: user.userName });

    return jwt;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Cannot create new user",
      { explanation: error.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signin(data) {
  try {
    const user = await userRepository.find({ userName: data.userName });

    if (!user) {
      throw new AppError(
        "No user found for the given email",
        { explanation: "" },
        StatusCodes.NOT_FOUND
      );
    }

    const password = Auth.matchPassword(data.password, user.password);

    if (!password) {
      throw new AppError(
        "Invalid password",
        { explanation: "" },
        StatusCodes.CONFLICT
      );
    }

    const jwt = Auth.createToken({ id: user._id, email: user.userName });

    return jwt;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Cannot create new user",
      { explanation: error.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError(
        "No JWT token found",
        { explanation: "" },
        StatusCodes.BAD_REQUEST
      );
    }
    const response = Auth.verifyToken(token);

    const user = await userRepository.find({ _id: response.id });

    if (!user) {
      throw new AppError(
        "No user found",
        { explanation: "" },
        StatusCodes.BAD_REQUEST
      );
    }
    return user.id;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.name === "JsonWebTokenError") {
      throw new AppError(
        "Invalid JWT Token",
        { explanation: "" },
        StatusCodes.BAD_REQUEST
      );
    }
    if (error.name === "TokenExpiredError") {
      throw new AppError(
        "JWT Token Expired",
        { explanation: "" },
        StatusCodes.BAD_REQUEST
      );
    }
    throw new AppError(
      "Something went wrong!",
      { explanation: error.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateUser(id, data) {
  try {
    const response = await userRepository.update(id, data);

    if (!response) {
      throw new AppError(
        "Can't perform update",
        { explanation: "" },
        StatusCodes.BAD_REQUEST
      );
    }

    return response;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Something went wrong!",
      { explanation: error.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getUserByName(name) {
  try {
    const response = await userRepository.find({
      $or: [
        {
          firstName: { $regex: new RegExp(name, "i") },
        },
        {
          lastName: { $regex: new RegExp(name, "i") },
        },
      ],
    });

    if (!response) {
      throw new AppError(
        "Can't find the user",
        { explanation: "" },
        StatusCodes.BAD_REQUEST
      );
    }

    return response;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Something went wrong!",
      { explanation: error.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  signup,
  signin,
  isAuthenticated,
  updateUser,
  getUserByName,
};
