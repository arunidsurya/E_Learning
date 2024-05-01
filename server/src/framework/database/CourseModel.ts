import mongoose, { Document, Model, Schema } from "mongoose";
import Course from "../../entities/course";

export interface IComment extends Document {
  user: object;
  comment: string;
  commentReplies: IComment[];
}

export interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

export interface ILink extends Document {
  title: string;
  url: string;
}

export const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
});

export const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

export const commentSchema = new Schema<IComment>({
  user: Object,
  comment: String,
  commentReplies: [Object],
});

const courseSchema = new Schema<Course>(
  {
    courseTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructorId: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    totalVideos:{
      type:Number
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [{ type: Schema.Types.ObjectId, ref: "courseData" }],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
    approved:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const CourseModel: Model<Course> = mongoose.model("Course", courseSchema);

export default CourseModel;
