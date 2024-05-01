import { Document } from "mongoose";
import Tutor from "../../entities/tutorEntity";
import ICourse from "./Icourse";
import Category from "../../entities/Categories";
import Course from "../../entities/course";

interface ITutorRepository {
  findByEmail(email: string): Promise<Tutor | null>;
  // isLoggedEmail(email: string): Promise<Tutor | null>;
  createTutor(tutorData: Tutor): Promise<Tutor | null>;
  loginTutor(
    tutor: Tutor,
    email: string,
    password: string
  ): Promise<string | null>;
  createCourse(data: Course): Promise<Document<any, any, ICourse> | null>;
  editCourse(data: Course): Promise<Document<any, any, ICourse> | null>;
  deleteCourse(_id: string): Promise<Boolean | null>;
  getAllCourses(id:string): Promise<Document<any, any, Course>[] | null>;
  getCategories(): Promise<Category[] | null | boolean>;
}

export default ITutorRepository;
