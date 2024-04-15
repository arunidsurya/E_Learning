import { redis } from "../framework/config/redis";
import adminUseCase from "../usecase/adminUseCase";
import { Request, Response, NextFunction } from "express";

class adminController {
  private adminCase: adminUseCase;

  constructor(adminCase: adminUseCase) {
    this.adminCase = adminCase;
  }

  async registerAdmin(req: Request, res: Response, next: NextFunction) {
    const adminData = req.body;
    const result = await this.adminCase.adminRegister(adminData);

    res.json(result);
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await this.adminCase.loginAdmin(email, password);
    if (result?.success) {
      res.cookie("admin_AccessToken", result.token);
      res.json(result);
    }
  }
  async logoutAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("admin_AccessToken", "", { maxAge: 1 });
      const email = req.admin?.email || "";
      redis.del(email);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.log(error);
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.adminCase.getUsers();
      // console.log(users);

      if (!users) {
        res.json({
          success: false,
          status: 400,
          message: "No users found!!",
        });
      }
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const newUser = this.adminCase.addUser(userData);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "Add user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User added successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const newUser = this.adminCase.editUser(userData);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.body;
      const newUser = this.adminCase.blockUser(_id);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.body;
      const newUser = this.adminCase.unBlockUser(_id);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default adminController;
