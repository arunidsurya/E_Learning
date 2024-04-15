import { set } from "mongoose";
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
      // console.log("match:", isPasswordMatch);

      if (!isPasswordMatch) {
        // Check if password does not match
        return null; // Return null if password does not match
      } else {
        const token = await this.JwtToken.SignJwt(user);
        redis.set(user.email, JSON.stringify(user) as any);
        // console.log(token);
        return token;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async isLoggedEmail(email: string): Promise<User | null> {
    const userData = await userModel.findOne({ email });

    return userData;
  }

  async forgotPasswordConfirm(
    email: string,
    newPassword: string
  ): Promise<User | null> {
    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        // Handle the case where the user is not found
        return null;
      }
      user.password = newPassword;
      await user.save();
      redis.set(user.email, JSON.stringify(user) as any);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async updateUserinfo(userData: User): Promise<User | null> {
    try {
      const { _id, name, email } = userData;
      const user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      user.name = name;
      user.email = email;

      user.save();

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateUserPassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ): Promise<User | null> {
    try {
      // console.log(email);

      const user = await userModel.findOne({ email }).select("+password");
      // console.log(user);

      if (!user) {
        return null;
      }
      const isOldPasswordMatch = await user?.comparePassword(oldPassword);
      console.log(isOldPasswordMatch);

      if (!isOldPasswordMatch) {
        return null;
      }
      user.password = newPassword;
      await user.save();
      redis.set(user.email, JSON.stringify(user) as any);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default userRepository;
