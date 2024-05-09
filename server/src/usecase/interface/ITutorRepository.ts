import { Document } from "mongoose";
import Tutor from "../../entities/tutorEntity";
import Course from "../../entities/course";
import Category from "../../entities/Categories";

interface ITutorRepository {
  findByEmail(email: string): Promise<Tutor | null>;
  // isLoggedEmail(email: string): Promise<Tutor | null>;
  createTutor(tutorData: Tutor): Promise<Tutor | null>;
  loginTutor(
    tutor: Tutor,
    email: string,
    password: string
  ): Promise<string | null>;
  createCourse(data: Course): Promise<Document<any, any, Course> | null>;
  editCourse(data: Course): Promise<Document<any, any, Course> | null>;
  deleteCourse(_id: string): Promise<Boolean | null>;
  getAllCourses(id:string): Promise<Document<any, any, Course>[] | null>;
  getCategories(): Promise<Category[] | null | boolean>;
  replyToQuestion(tutor:any,answer:string,courseId:string,contentId:string,questionId:string):Promise<boolean|null>
  replyToReview(tutor:any,comment:string,courseId:string,reviewId:string):Promise<boolean|null>
}

export default ITutorRepository;
