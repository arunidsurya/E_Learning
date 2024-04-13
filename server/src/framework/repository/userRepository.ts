import User from "../../entities/userEntity";
import IUserRepository from "../../usecase/interface/IUserRepository";
import { redis } from "../config/redis";
import userModel from "../database/userModel";
import JwtTokenService from "../services/JwtToken";

class userRepository implements IUserRepository {
  JwtToken = new JwtTokenService();

  async findByEmail(email: string): Promise<User | null> {
    const isEmailExist = await userModel.findOne({ email }).select("+password");
    // console.log("isEmailExist:", isEmailExist);
    return isEmailExist;
  }
  async createUser(user: User): Promise<User | null> {
    try {
      const { name, email, gender, password } = user;
      const savedUser = await userModel.create({
        name,
        email,
        gender,
        password,
        isVerified: true,
      });

      return savedUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async loginUser(
    user: User,
    email: string,
    password: string
  ): Promise<string | null> {
    try {
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return null;
      }

      const token = await this.JwtToken.SignJwt(email, password);
      redis.set(user.email, JSON.stringify(user) as any);
      // console.log(token);
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default userRepository;
