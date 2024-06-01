const express = require("express");
const router = express.Router();

const { UserController } = require("../../controllers");
const { UserMiddlewares } = require("../../middlewares");

router.post("/signup", UserMiddlewares.validateSignup, UserController.signup);

router.post("/signin", UserMiddlewares.validateSignin, UserController.signin);

router.patch(
  "/",
  [UserMiddlewares.chekAuth, UserMiddlewares.validateUpdateUser],
  UserController.updateUser
);

router.get("/find", UserController.getUserByName);

module.exports = router;
