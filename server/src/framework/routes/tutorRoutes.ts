import express from "express";

import userController from "../../controller/userController";
import sendMail from "../services/SendMail";
import JwtTokenService from "../services/JwtToken";
import tutorRepository from "../repository/tutorRepository";
import tutorUseCase from "../../usecase/tutorUseCase";
import tutorController from "../../controller/tutorController";

const tutorRouter = express.Router();
const repository = new tutorRepository();
const sendEmail = new sendMail();
const JwtToken = new JwtTokenService();
const tutorCase = new tutorUseCase(repository, sendEmail, JwtToken);
const controller = new tutorController(tutorCase);

tutorRouter.post("/tutor/registration", (req, res, next) => {
  controller.registerTutor(req, res, next);
});
tutorRouter.post("/tutor/login", (req, res, next) => {
  controller.loginTutor(req, res, next);
});
tutorRouter.get("/tutor/logout", (req, res, next) => {
  controller.logoutTutor(req, res, next);
});
export default tutorRouter;
