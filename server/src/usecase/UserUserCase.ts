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
      // console.log(email);
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
      // console.log(activationToken);
      // console.log(activationCode);

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
    console.log("activationToken :", activationToken);
    console.log("activationCode :", activationCode);
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
      // console.log(newUser.user);
      const savedUser = await this.iUserRepository.createUser(newUser.user);
      // console.log("saveduser :", savedUser);
      if (!savedUser) {
        return {
          status: 500,
          success: false,
          message: "internal error, please try again later",
        };
      }

      return { savedUser, success: true };
    } catch (error) {
      console.log(error);
    }
  }
  async loginUser(email: string, password: string) {
    try {
      // console.log(email);
      const user = await this.iUserRepository.findByEmail(email);
      if (!user) {
        return {
          status: 500,
          success: false,
          message: "Invalid email or password!!",
        };
      }
      const token = await this.iUserRepository.loginUser(user, email, password);
      if (token) {
        return { status: 201, success: true, user, token };
      }
      return {
        status: 500,
        success: false,
        message: "Invalid email or password!!",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async forgotPasswordOtp(email: string) {
    const user = await this.iUserRepository.isLoggedEmail(email);
    if (!user) {
      return {
        status: 500,
        success: false,
        message: "Invalid email address!",
      };
    }
    // console.log("user :", user);

    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const activationTokenPromise = this.JwtToken.otpGenerateJwt(
      user,
      activationCode
    );
    const activationToken = await activationTokenPromise;
    // console.log(activationToken);
    // console.log(activationCode);

    const subject = "Please find the below otp to confirm your account";

    const sendmail = this.sendEmail.sendMail({
      email,
      subject,
      activationCode,
    });
    if (sendMail) {
      return {
        status: 201,
        success: true,
        message: "Please check your email to confirm your account",
        activationToken,
        email,
      };
    }
  }
  async forgotPasswordApproval(
    activationCode: string,
    activationToken: string
  ) {
    try {
      console.log("code:", activationCode);
      console.log("token:", activationToken);
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
      // console.log(newUser.user);
      return {
        status: 201,
        success: true,
        message: "otp verified successfully",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async forgotPasswordConfirm(email: string, newPassword: string) {
    try {
      const user = await this.iUserRepository.forgotPasswordConfirm(
        email,
        newPassword
      );
      if (!user) {
        return {
          status: 500,
          success: false,
          message: "password change unsccessfull, please try agin later",
        };
      } else {
        return {
          status: 201,
          success: true,
          message:
            "password changed successfully, please proceed to login page",
          user,
        };
      }
    } catch (error: any) {
      console.log(error);
    }
  }
}

export default userUserCase;
