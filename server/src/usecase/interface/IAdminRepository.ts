import Admin from "../../entities/adminEntity";

interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  registerAdmin(adminData: Admin): Promise<Admin | null>;
  //   loginUser(
  //     admin: Admin,
  //     email: string,
  //     password: string
  //   ): Promise<string | null>;
}

export default IAdminRepository;
