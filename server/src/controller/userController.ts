import { Request, Response, NextFunction } from "express";
import userUserCase from "../usecase/UserUserCase";
import { redis } from "../framework/config/redis";

class userController {
  private userCase: userUserCase;

  constructor(userCase: userUserCase) {
    this.userCase = userCase;
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      //   console.log(userData);
      const user = await this.userCase.registrationUser(userData);
      res.json({ user, success: true });
    } catch (error) {
      console.log(error);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const activationCode = req.body.activation_code;
      const activationToken = req.body.activation_token;
      //   console.log(userData);
      const user = await this.userCase.activateUser(
        activationCode,
        activationToken
      );

      res.status(201).json({
        user,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const data = await this.userCase.loginUser(email, password);
      // console.log("data :", data);

      if (data?.success) {
        res.cookie("access_token", data.token);

        res.status(201).json({
          success: true,
          user: data.user,
          accessToken: data.token,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "invalid credentials",
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    }
  }
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      const email = req.user?.email || "";
      redis.del(email);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.log(error);
    }
  }
  async forgotPasswordOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      // console.log(email);
      const result = await this.userCase.forgotPasswordOtp(email);
      res.status(201).json(result);
    } catch (error: any) {
      console.log(error);
    }
  }
  async forgotPasswordApproval(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const activationCode = req.body.activation_code;
      const activationToken = req.body.activation_token;
      //   console.log(userData);
      const result = await this.userCase.forgotPasswordApproval(
        activationCode,
        activationToken
      );
      // console.log(result);

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
  async forgotPasswordConfirm(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, newPassword } = req.body;
      const result = await this.userCase.forgotPasswordConfirm(
        email,
        newPassword
      );
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
    }
  }
}

export default userController;
