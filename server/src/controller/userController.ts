import { Request, Response } from "express";
import userUserCase from "../usecase/UserUserCase";

class userController {
  private userCase: userUserCase;

  constructor(userCase: userUserCase) {
    this.userCase = userCase;
  }

  async registerUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      //   console.log(userData);
      const user = await this.userCase.registrationUser(userData);
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  }

  async activateUser(req: Request, res: Response) {
    try {
      const activationCode = req.body.activation_code;
      const activationToken = req.body.activation_token;
      //   console.log(userData);
      const user = await this.userCase.activateUser(
        activationCode,
        activationToken
      );
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  }
  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const data = await this.userCase.loginUser(email, password);

      if (data) {
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
    } catch (error) {
      console.log(error);
    }
  }
}

export default userController;
