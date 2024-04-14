require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  gender: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
      minlength: [6, "Password must be atleast 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving

// userSchema.pre<IUser>("save", async function (next: (err?: Error) => void) {
//   if (!this.isModified("password") || !this.password) {
//     return next();
//   }
//   try {
//     this.password = await bcrypt.hash(this.password, 10);
//     return next();
//   } catch (error) {
//     return next(error as Error);
//   }
// });

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

//sign refersh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFERSH_TOKEN || "", {
    expiresIn: "3d",
  });
};

//compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
