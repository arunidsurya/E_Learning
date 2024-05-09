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

adminRouter.get("/admin/getUsers", isAuthorized, (req, res, next) => {
  controller.getUsers(req, res, next);
});
adminRouter.post("/admin/addUser", isAuthorized, (req, res, next) => {
  controller.addUser(req, res, next);
});
adminRouter.put("/admin/editUser", isAuthorized, (req, res, next) => {
  controller.editUser(req, res, next);
});
adminRouter.post("/admin/blockUser", isAuthorized, (req, res, next) => {
  controller.blockUser(req, res, next);
});
adminRouter.post("/admin/unBlockUser", isAuthorized, (req, res, next) => {
  controller.unBlockUser(req, res, next);
});
adminRouter.get("/admin/getTutors", isAuthorized, (req, res, next) => {
  controller.getTutors(req, res, next);
});
adminRouter.post("/admin/verifyTutor", isAuthorized, (req, res, next) => {
  controller.verifyTutor(req, res, next);
});
adminRouter.post("/admin/refuteTutor", isAuthorized, (req, res, next) => {
  controller.refuteTutor(req, res, next);
});
adminRouter.put("/admin/editTutor", isAuthorized, (req, res, next) => {
  controller.editTutor(req, res, next);
});
adminRouter.post("/admin/create_category", isAuthorized, (req, res, next) => {
  controller.createCategory(req, res, next);
});
adminRouter.put("/admin/edit_category", isAuthorized, (req, res, next) => {
  controller.editCategory(req, res, next);
});
adminRouter.delete("/admin/delete_category/:id",isAuthorized,(req, res, next) => {
    controller.deleteCategory(req, res, next);
  });
adminRouter.get("/admin/get_categories", isAuthorized, (req, res, next) => {
  controller.getCategories(req, res, next);
});
adminRouter.get("/admin/courses", isAuthorized, (req, res, next) => {
  controller.getAllCourses(req, res, next);
});
adminRouter.put("/admin/change_courses_status",isAuthorized,(req, res, next) => {
    controller.changeCourseStatus(req, res, next);
  });

export default adminRouter;
