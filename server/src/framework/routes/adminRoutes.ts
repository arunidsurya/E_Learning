import express from "express";
import adminRepositoty from "../repository/adminRepository";
import sendMail from "../services/SendMail";
import JwtTokenService from "../services/JwtToken";
import adminUseCase from "../../usecase/adminUseCase";
import adminController from "../../controller/adminController";
import { isAuthorized } from "../middlewares/adminAuth";

const adminRouter = express.Router();
const repository = new adminRepositoty();
const sendEmail = new sendMail();
const JwtToken = new JwtTokenService();
const userCase = new adminUseCase(repository, sendEmail, JwtToken);
const controller = new adminController(userCase);

adminRouter.post("/admin/register", (req, res, next) => {
  controller.registerAdmin(req, res, next);
});

adminRouter.post("/admin/login", (req, res, next) => {
  controller.loginAdmin(req, res, next);
});

adminRouter.get("/admin/logout", isAuthorized, (req, res, next) => {
  controller.logoutAdmin(req, res, next);
});

export default adminRouter;
