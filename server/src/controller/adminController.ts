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
}

export default adminController;
