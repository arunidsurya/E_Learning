import Admin from "../../entities/adminEntity";
import User from "../../entities/userEntity";
import IAdminRepository from "../../usecase/interface/IAdminRepository";
import adminModel from "../database/adminModel";
import userModel from "../database/userModel";

class adminRepositoty implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (!admin) {
        return null;
      }
      return admin;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async registerAdmin(adminData: Admin): Promise<Admin | null> {
    try {
      const { name, email, gender, password } = adminData;
      const admin = await adminModel.create({
        name,
        email,
        gender,
        password,
        isVerified: true,
      });
      return admin;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getUsers(): Promise<Admin[] | null> {
    try {
      const users = await userModel.find({});
      if (!users) {
        return null;
      }
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async addUser(userData: User): Promise<User | null> {
    try {
      const { name, email, gender, password } = userData;
      const isEmailExists = await userModel.findOne({ email });
      if (isEmailExists) {
        return null;
      }
      const newUser = userModel.create({
        name,
        email,
        gender,
        password,
      });
      if (!newUser) {
        return null;
      }
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editUser(userData: User): Promise<User | null> {
    try {
      const { _id, name, email, gender } = userData;
      // console.log(name, email, gender);

      let user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      user.name = name;
      user.email = email;
      user.gender = gender;
      user = await user.save();

      // console.log("newUser :", user);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async blockUser(_id: string): Promise<User | null> {
    try {
      let user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      user.isBlocked = true;
      user = await user.save();

      // console.log("newUser :", user);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async unBlockUser(_id: string): Promise<User | null> {
    try {
      let user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      user.isBlocked = false;
      user = await user.save();

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default adminRepositoty;
