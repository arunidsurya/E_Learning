import User from "../entities/userEntity";
import JwtTokenService from "../framework/services/JwtToken";
import sendMail from "../framework/services/SendMail";
import IUserRepository from "./interface/IUserRepository";

class userUserCase {
  private iUserRepository: IUserRepository;
  private sendEmail: sendMail;
  private JwtToken: JwtTokenService;

  constructor(
    iuserRepository: IUserRepository,
    sendEmail: sendMail,
    JwtToken: JwtTokenService
  ) {
    this.iUserRepository = iuserRepository;
    this.sendEmail = sendEmail;
    this.JwtToken = JwtToken;
  }

  async registrationUser(user: User) {
    try {
      const email = user.email;
      console.log(email);
      const isEmailExist = await this.iUserRepository.findByEmail(email);
      if (isEmailExist) {
        return { success: false, message: "Email already exists" };
      }

      const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const activationTokenPromise = this.JwtToken.otpGenerateJwt(
        user,
        activationCode
      );
      const activationToken = await activationTokenPromise;
      console.log(activationToken);
      console.log(activationCode);

      const subject = "Please find the below otp to activate your account";

      const sendmail = this.sendEmail.sendMail({
        email,
        subject,
        activationCode,
      });
      if (sendMail) {
        return {
          status: 201,
          success: true,
          message: "Please check your email to activate your account",
          activationToken,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async activateUser(activationCode: string, activationToken: string) {
    try {
      const newUser = await this.JwtToken.otpVerifyJwt(
        activationToken,
        activationCode
      );
      if (!newUser) {
        return {
          status: 500,
          success: false,
          message: "Token expired,Please register again",
        };
      }
      console.log(newUser.user);
      const savedUser = this.iUserRepository.createUser(newUser.user);
      if (!savedUser) {
        return {
          status: 500,
          success: false,
          message: "internal error, please try again later",
        };
      }
      return savedUser;
    } catch (error) {}
  }
  async loginUser(email: string, password: string) {
    try {
      console.log(email);
      const user = await this.iUserRepository.findByEmail(email);
      if (!user) {
        return {
          status: 500,
          success: false,
          message: "Invalid email or password!!",
        };
      }
      const token = await this.iUserRepository.loginUser(user, email, password);
      return { user, token };
    } catch (error) {
      console.log(error);
    }
  }
}

export default userUserCase;
