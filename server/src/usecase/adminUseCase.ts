import Admin from "../entities/adminEntity";
import { redis } from "../framework/config/redis";
import JwtTokenService from "../framework/services/JwtToken";
import sendMail from "../framework/services/SendMail";
import IAdminRepository from "./interface/IAdminRepository";

class adminUseCase {
  private iAdminRepository: IAdminRepository;
  private sendEmail: sendMail;
  private JwtToken: JwtTokenService;

  constructor(
    iAdminRepository: IAdminRepository,
    sendEmail: sendMail,
    JwtToken: JwtTokenService
  ) {
    this.iAdminRepository = iAdminRepository;
    this.sendEmail = sendEmail;
    this.JwtToken = JwtToken;
  }

  async loginAdmin(email: string, password: string) {
    try {
      const admin = await this.iAdminRepository.findByEmail(email);
      if (!admin) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }
      const isPasswordMatch = await admin.comparePassword(password);
      if (!isPasswordMatch) {
        return {
          success: false,
          message: "Entered password is wrong",
        };
      }
      const token = await this.JwtToken.AdminSignJwt(admin);
      if (!token) {
        return {
          success: false,
          message: "Internal server error, please try again later",
        };
      }
      redis.set(admin.email, JSON.stringify(admin) as any);
      return { status: 201, success: true, admin, token };
    } catch (error) {
      console.log(error);
    }
  }
  async adminRegister(adminData: Admin) {
    try {
      const { name, email, gender, password } = adminData;
      const isEmailExist = await this.iAdminRepository.findByEmail(email);
      if (isEmailExist) {
        return {
          success: false,
          message: "Exisiting Email",
        };
      }
      const admin = this.iAdminRepository.registerAdmin(adminData);
      if (!admin) {
        return {
          success: false,
          message: "Internal server error, please try again later",
        };
      }
      return {
        success: false,
        message: "Successfully registered",
        admin,
      };
    } catch (error) {}
  }
}

export default adminUseCase;
