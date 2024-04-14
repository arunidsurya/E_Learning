import Admin from "../../entities/adminEntity";
import IAdminRepository from "../../usecase/interface/IAdminRepository";
import adminModel from "../database/adminModel";

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
}

export default adminRepositoty;
