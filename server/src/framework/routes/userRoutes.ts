import express from "express";
import userRepository from "../repository/userRepository";
import userController from "../../controller/userController";
import userUseCase from "../../usecase/UserUserCase";
import sendMail from "../services/SendMail";
import JwtTokenService from "../services/JwtToken";

const userRouter = express.Router();
const repository = new userRepository();
const sendEmail = new sendMail();
const JwtToken = new JwtTokenService();
const userCase = new userUseCase(repository, sendEmail, JwtToken);
const controller = new userController(userCase);

userRouter.post("/user/registration", (req, res) => {
  controller.registerUser(req, res);
});
userRouter.post("/user/activate-user", (req, res) => {
  controller.activateUser(req, res);
});
userRouter.post("/user/login", (req, res) => {
  controller.loginUser(req, res);
});

export default userRouter;
