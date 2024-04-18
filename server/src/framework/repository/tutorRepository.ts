import { set } from "mongoose";
import User from "../../entities/userEntity";
import ITutorRepository from "../../usecase/interface/ITutorRepository";
import { redis } from "../config/redis";
import userModel from "../database/userModel";
import JwtTokenService from "../services/JwtToken";
import Tutor from "../../entities/tutorEntity";
import tutorModel from "../database/tutorModel";

class tutorRepository implements ITutorRepository {
  JwtToken = new JwtTokenService();
  async findByEmail(email: string): Promise<Tutor | null> {
    try {
      const isEmailExist = await tutorModel
        .findOne({ email })
        .select("+password");
      if (!isEmailExist) {
        return null;
      }
      return isEmailExist;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async createTutor(tutorData: Tutor): Promise<Tutor | null> {
    try {
      const {
        name,
        email,
        password,
        gender,
        institute,
        qualifiaction,
        experience,
      } = tutorData;

      const newTutor = await tutorModel.create({
        name,
        email,
        password,
        gender,
        institute,
        qualifiaction,
        experience,
      });

      if (!newTutor) {
        return null;
      }
      return newTutor;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
  async loginTutor(
    tutor: Tutor,
    email: string,
    password: string
  ): Promise<string | null> {
    try {
      const isPasswordMatch = await tutor.comparePassword(password);
      if (!isPasswordMatch) {
        // Check if password does not match
        return null; // Return null if password does not match
      } else {
        const token = await this.JwtToken.SignTutorJwt(tutor);
        redis.set(tutor.email, JSON.stringify(tutor) as any);
        // console.log(token);
        return token;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default tutorRepository;
