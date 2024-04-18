import Tutor from "../entities/tutorEntity";
import { redis } from "../framework/config/redis";
import JwtTokenService from "../framework/services/JwtToken";
import sendMail from "../framework/services/SendMail";
import ITutorRepository from "./interface/ITutorRepository";

class tutorUseCase {
  private iTutorRepository: ITutorRepository;
  private sendEmail: sendMail;
  private JwtToken: JwtTokenService;

  constructor(
    itutorRepository: ITutorRepository,
    sendEmail: sendMail,
    JwtToken: JwtTokenService
  ) {
    this.iTutorRepository = itutorRepository;
    this.sendEmail = sendEmail;
    this.JwtToken = JwtToken;
  }

  async registerTutor(tutorData: Tutor) {
    try {
      const { email } = tutorData;
      const existingTutor = await this.iTutorRepository.findByEmail(email);
      if (existingTutor) {
        return {
          status: 400,
          success: false,
          message: "Email already exists",
        };
      }
      const newTutor = await this.iTutorRepository.createTutor(tutorData);
      if (!newTutor) {
        return {
          status: 500,
          success: false,
          message: "internal server error, please try again later",
        };
      }
      return {
        status: 201,
        success: true,
        message: "Congratulations!! registration successfull",
        newTutor,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async loginTutor(email: string, password: string) {
    try {
      const tutor = await this.iTutorRepository.findByEmail(email);
      if (!tutor) {
        return {
          status: 400,
          success: false,
          message: "invalid credentials",
        };
      }
      if (!tutor.isVerified) {
        return {
          status: 400,
          success: false,
          message: "Account not verified.!! please contact admin",
        };
      }
      const token = await this.iTutorRepository.loginTutor(
        tutor,
        email,
        password
      );
      if (!token) {
        return {
          status: 400,
          success: false,
          message: "invalid credentials",
        };
      }
      return {
        status: 201,
        success: true,
        message: "successfully loggedIn",
        tutor,
        token,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default tutorUseCase;
