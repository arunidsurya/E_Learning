import Admin from "../../entities/adminEntity";
import Tutor from "../../entities/tutorEntity";
import User from "../../entities/userEntity";

interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  registerAdmin(adminData: Admin): Promise<Admin | null>;
  getUsers(): Promise<Admin[] | null>;
  addUser(userData: User): Promise<User | null>;
  editUser(userData: User): Promise<User | null>;
  blockUser(_id: string): Promise<User | null>;
  unBlockUser(_id: string): Promise<User | null>;
  getTutors(): Promise<Tutor[] | null>;
  verifyTutor(_id: string): Promise<Tutor | null>;
  refuteTutor(_id: string): Promise<Tutor | null>;
  editTutor(tutorData: Tutor): Promise<Tutor | null>;
  //   loginUser(
  //     admin: Admin,
  //     email: string,
  //     password: string
  //   ): Promise<string | null>;
}

export default IAdminRepository;
