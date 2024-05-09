import { redis } from "../framework/config/redis";
import adminUseCase from "../usecase/adminUseCase";
import { Request, Response, NextFunction } from "express";

class adminController {
  private adminCase: adminUseCase;

  constructor(adminCase: adminUseCase) {
    this.adminCase = adminCase;
  }

  async registerAdmin(req: Request, res: Response, next: NextFunction) {
    const adminData = req.body;
    const result = await this.adminCase.adminRegister(adminData);

    res.json(result);
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await this.adminCase.loginAdmin(email, password);
    if (result?.success) {
      res.cookie("admin_AccessToken", result.token);
      res.json(result);
    }
  }
  async logoutAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("admin_AccessToken", "", { maxAge: 1 });
      const email = req.admin?.email || "";
      redis.del(email);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.log(error);
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.adminCase.getUsers();
      // console.log(users);

      if (!users) {
        res.json({
          success: false,
          status: 400,
          message: "No users found!!",
        });
      }
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const newUser = this.adminCase.addUser(userData);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "Add user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User added successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const newUser = this.adminCase.editUser(userData);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.body;
      const newUser = this.adminCase.blockUser(_id);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.body;
      const newUser = this.adminCase.unBlockUser(_id);
      if (!newUser) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getTutors(req: Request, res: Response, next: NextFunction) {
    try {
      const tutors = await this.adminCase.getTutors();
      // console.log(tutors);

      if (!tutors) {
        res.json({
          success: false,
          status: 400,
          message: "No users found!!",
        });
      }
      res.status(201).json({
        success: true,
        tutors,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async verifyTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.body;
      const newTutor = this.adminCase.verifyTutor(_id);
      if (!newTutor) {
        return res.json({
          status: 400,
          success: false,
          message: "update newTutor unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "newTutor edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async refuteTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.body;
      const newTutor = this.adminCase.refuteTutor(_id);
      if (!newTutor) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async editTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const tutorData = req.body;
      const newTutor = this.adminCase.editTutor(tutorData);
      if (!newTutor) {
        return res.json({
          status: 400,
          success: false,
          message: "update user unsuccessfull!!",
        });
      }
      res.status(201).json({
        success: true,
        message: "User edited successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryData = req.body;
      const newCategory = await this.adminCase.createCategory(categoryData);

      if (newCategory === null) {
        return res.status(500).json({
          success: false,
          message: "Internal server error, Please try again later",
        });
      }
      if (newCategory === false) {
        return res.status(409).json({
          success: false,
          message: "The category name already exists!!",
        });
      }
      return res.status(201).json({
        success: true,
        message: "New Category created successfully!!",
        newCategory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error, Please try again later",
      });
    }
  }
  async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryData = req.body;
      const updatedCategory = await this.adminCase.editCategory(categoryData);

      if (updatedCategory === null) {
        return res.status(500).json({
          success: false,
          message: "Internal server error, Please try again later",
        });
      }
      if (updatedCategory === false) {
        return res.status(400).json({
          success: false,
          message: "The category not found!!",
        });
      }
      return res.status(201).json({
        success: true,
        message: "Category updated successfully!!",
        updatedCategory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error, Please try again later",
      });
    }
  }
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const _id = req.params.id;
      const result = await this.adminCase.deleteCategory(_id);
      if (result === false) {
        return res.status(500).json({
          success: false,
          message: "Internal server error, Please try again later",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully!!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error, Please try again later",
      });
    }
  }
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.adminCase.getCategories();
      if (categories === null) {
        return res.status(404).json({
          success: false,
          message: "No categories available",
        });
      }
      if (categories === false) {
        return res.status(500).json({
          success: false,
          message: "Internal server error, Please try again later",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully!!",
        categories,
      });
    } catch (error) {}
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) { 
        try {
          const courses = await this.adminCase.getAllCourses();
          if(courses===null){
            return res.json({
              success:false,
              message:"No course found!!"
            })
          }
          return res.status(200).json({
            success:true,
            courses
          })
        } catch (error) {
          console.log(error);
          
        }
  }
  async changeCourseStatus(req: Request, res: Response, next: NextFunction) { 
    try {
          const status = req.body.status;
          const courseId = req.body.courseId;
          const result = await this.adminCase.changeCourseStatus(
            status,
            courseId
          );
          if(result === false){
            return res.json({
              success:false,
              message:"Error occured!! please try again later"
            })
          }
          return res.status(201).json({
            success:true,
            message:"course status updated successfully!!"
          })
    } catch (error) {
      console.log(error);
      
    }

  }
}

export default adminController;
