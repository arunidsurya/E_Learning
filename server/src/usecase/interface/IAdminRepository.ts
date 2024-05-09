import { Document } from "mongoose";
import Category from "../../entities/Categories";
import Admin from "../../entities/adminEntity";
import Course from "../../entities/course";
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
  createCategory(categoryData: Category): Promise<Category | null | boolean>;
  editCategory(categoryData: Category): Promise<Category | null | boolean>;
  deleteCategory(_id: string): Promise<boolean>;
  getCategories(): Promise<Category[] | null | boolean>;
  getAllCourses(): Promise<Document<any, any, Course>[] | null>;
  changeCourseStatus(status:string,courseId:string): Promise<boolean | null>;
}

export default IAdminRepository;
