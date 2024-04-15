import express from "express";
import userRepository from "../repository/userRepository";
import userController from "../../controller/userController";
import userUseCase from "../../usecase/UserUserCase";
import sendMail from "../services/SendMail";
import JwtTokenService from "../services/JwtToken";
import { isAuthenticated } from "../middlewares/UserAuth";

const userRouter = express.Router();
const repository = new userRepository();
const sendEmail = new sendMail();
const JwtToken = new JwtTokenService();
const userCase = new userUseCase(repository, sendEmail, JwtToken);
const controller = new userController(userCase);

userRouter.post("/user/registration", (req, res, next) => {
  controller.registerUser(req, res, next);
});
userRouter.post("/user/activate-user", (req, res, next) => {
  controller.activateUser(req, res, next);
});
userRouter.post("/user/login", (req, res, next) => {
  controller.loginUser(req, res, next);
});
userRouter.get("/user/logout", isAuthenticated, (req, res, next) => {
  controller.logoutUser(req, res, next);
});
userRouter.post("/user/forgot_password_otp", (req, res, next) => {
  controller.forgotPasswordOtp(req, res, next);
});
userRouter.post("/user/forgot_password_approve", (req, res, next) => {
  controller.forgotPasswordApproval(req, res, next);
});
userRouter.post("/user/forgot_password_confirm", (req, res, next) => {
  controller.forgotPasswordConfirm(req, res, next);
});
userRouter.put("/user/update_user_info", (req, res, next) => {
  controller.upadteUserInfo(req, res, next);
});

userRouter.put("/user/update_user_password", (req, res, next) => {
  controller.upadteUserpassword(req, res, next);
});

export default userRouter;
