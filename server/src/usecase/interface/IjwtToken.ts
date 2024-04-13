import { JwtPayload } from "jsonwebtoken";
import User from "../../entities/userEntity";

interface IjwtToken {
  SignJwt(email: string, password: string): Promise<string>;
  VerifyJwt(token: string): Promise<JwtPayload | null>;
  otpGenerateJwt(user: User, activationCode: string): Promise<string>;
  otpVerifyJwt(
    activationToken: string,
    activationCode: string
  ): Promise<{ user: User; activationCode: string } | null>;
}
export default IjwtToken;
