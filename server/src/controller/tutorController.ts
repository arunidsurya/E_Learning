import { Request, Response, NextFunction } from "express";
import { redis } from "../framework/config/redis";
import tutorUseCase from "../usecase/tutorUseCase";

class tutorController {
  private tutorCase: tutorUseCase;

  constructor(tutorCase: tutorUseCase) {
    this.tutorCase = tutorCase;
  }

  async registerTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const tutorData = req.body;
      const newTutor = await this.tutorCase.registerTutor(tutorData);
      res.json(newTutor);
    } catch (error) {
      console.log(error);
    }
  }
  async loginTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const data = await this.tutorCase.loginTutor(email, password);
      // console.log("data :", data);

      if (data?.success) {
        res.cookie("tutor_token", data.token);

        res.status(201).json({ data });
      } else {
        res.json({ data });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    }
  }
  async logoutTutor(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("tutor_token", "", { maxAge: 1 });
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.log(error);
    }
  }
}

export default tutorController;
