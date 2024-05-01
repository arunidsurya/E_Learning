import express from "express";

import userController from "../../controller/userController";
import sendMail from "../services/SendMail";
import JwtTokenService from "../services/JwtToken";
import tutorRepository from "../repository/tutorRepository";
import tutorUseCase from "../../usecase/tutorUseCase";
import tutorController from "../../controller/tutorController";
import { isTutuorAuthorized } from "../middlewares/tutorAuth";

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
tutorRouter.get("/tutor/logout", isTutuorAuthorized,(req, res, next) => {
  controller.logoutTutor(req, res, next);
});
tutorRouter.post("/tutor/create_course",isTutuorAuthorized, (req, res, next) => {
  controller.createCourse(req, res, next);
});
tutorRouter.put("/tutor/edit_course", isTutuorAuthorized,(req, res, next) => {
  controller.editCourse(req, res, next);
});
tutorRouter.get("/tutor/courses/:id", isTutuorAuthorized,(req, res, next) => {
  controller.getAllCourses(req, res, next);
});
tutorRouter.get("/tutor/categories",isTutuorAuthorized, (req, res, next) => {
  controller.getCategories(req, res, next);
});
tutorRouter.delete("/tutor/delete_course/:_id", isTutuorAuthorized,(req, res, next) => {
  controller.deleteCourse(req, res, next);
});


export default tutorRouter;
