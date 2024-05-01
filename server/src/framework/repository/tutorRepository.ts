import { Document, set } from "mongoose";
import User from "../../entities/userEntity";
import ITutorRepository from "../../usecase/interface/ITutorRepository";
import { redis } from "../config/redis";
import userModel from "../database/userModel";
import JwtTokenService from "../services/JwtToken";
import Tutor from "../../entities/tutorEntity";
import tutorModel from "../database/tutorModel";
import ICourse from "../../usecase/interface/Icourse";
import CourseModel from "../database/CourseModel";
import Category from "../../entities/Categories";
import CategoryModel from "../database/CategoryModel";
import CourseDataModel from "../database/courseData";
import Course from "../../entities/course";

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
        redis.set(`tutor-${tutor.email}`, JSON.stringify(tutor) as any);
        // console.log(token);
        return token;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async createCourse(
    data: Course
  ): Promise<Document<any, any, ICourse> | null> {
    try {
      // console.log(data);

      const {
        courseTitle,
        instructorId,
        instructorName,
        category,
        description,
        price,
        estimatedPrice,
        totalVideos,
        tags,
        thumbnail,
        level,
        demoUrl,
        benefits,
        prerequisites,
        courseData,
      } = data;

      const createdCourseData = await CourseDataModel.create(courseData);

      // console.log("createdCourseData :", createdCourseData);

      // Convert createdCourseData to an array if it's not already
      const courseDataIds = Array.isArray(createdCourseData)
        ? createdCourseData.map((data) => data._id)
        : [];

      // Prepare data for Course document
      const savedCourse = await CourseModel.create({
        courseTitle,
        instructorId,
        instructorName,
        category,
        description,
        price,
        estimatedPrice,
        totalVideos,
        tags,
        thumbnail,
        level,
        demoUrl,
        benefits,
        prerequisites,
        courseData: courseDataIds,
      });

      if (savedCourse) {
        return savedCourse;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getAllCourses(
    id: string
  ): Promise<Document<any, any, Course>[] | null> {
    console.log(id);
    
    try {
      const courses = await CourseModel.find({instructorId:id})
        .populate("courseData")
        .sort({ createdAt: -1 })
        .exec();
      if (courses) {
        return courses;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCategories(): Promise<Category[] | null | boolean> {
    try {
      const categories = await CategoryModel.find();
      if (categories.length === 0) {
        return null;
      }
      return categories;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteCourse(_id: string): Promise<boolean> {
    try {
      const course = await CourseModel.findById(_id);
      if (!course) {
        return false; // Course not found
      }

      // Delete associated documents using Promise.all to wait for all deletions
      await Promise.all(
        course.courseData.map(async (objId) => {
          try {
            await CourseDataModel.findByIdAndDelete(objId);
          } catch (error) {
            console.error(
              `Error deleting associated document with ID ${objId}:`,
              error
            );
          }
        })
      );

      // Delete the main course document
      const courseResult = await CourseModel.findByIdAndDelete(_id);
      if (!courseResult) {
        return false; // Course deletion failed
      }

      return true; // Course deleted successfully
    } catch (error) {
      console.error("Error deleting course:", error);
      return false; // Error occurred during deletion
    }
  }
  async editCourse(data: Course): Promise<Document<any, any, ICourse> | null> {
    try {
      // Extract data from the input
      const {
        _id,
        courseTitle,
        instructorId,
        instructorName,
        category,
        description,
        price,
        estimatedPrice,
        totalVideos,
        tags,
        thumbnail,
        level,
        demoUrl,
        benefits,
        prerequisites,
        courseData,
      } = data;

      console.log(data);
      // console.log(courseData);

      // Update the courseData documents
      await Promise.all(
        courseData.map(async (data) => {
          await CourseDataModel.findByIdAndUpdate(data._id, data);
        })
      );
      console.log("reached here");

      // Update the course document
      const updatedCourse = await CourseModel.findByIdAndUpdate(
        _id,
        {
          courseTitle,
          instructorId,
          instructorName,
          category,
          description,
          price,
          estimatedPrice,
          totalVideos,
          tags,
          thumbnail,
          level,
          demoUrl,
          benefits,
          prerequisites,
        },
        { new: true }
      );

      return updatedCourse;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default tutorRepository;
