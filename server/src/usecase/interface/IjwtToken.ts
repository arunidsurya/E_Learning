import { JwtPayload } from "jsonwebtoken";
import User from "../../entities/userEntity";
import Admin from "../../entities/adminEntity";

interface IjwtToken {
  SignJwt(user: User): Promise<string>;
  AdminSignJwt(admin: Admin): Promise<string | null>;
  VerifyJwt(token: string): Promise<JwtPayload | null>;
  otpGenerateJwt(user: User, activationCode: string): Promise<string>;
  otpVerifyJwt(
    activationToken: string,
    activationCode: string
  ): Promise<{ user: User; activationCode: string } | null>;
}
export default IjwtToken;
