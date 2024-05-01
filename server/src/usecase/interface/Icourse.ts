import IReview from "./IReview";
import ICourseData from "./IcourseData";

interface ICourse {
  courseTitle: string;
  description: string;
  category:string;
  instructorId: string;
  instructorName: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: string;
  tags: string;
  level: string;
  demoUrl: string;
  benefits?: { title: string }[];
  prerequisites?: { title: string }[];
  reviews?: IReview[];
  courseData?: ICourseData[];
  ratings?: number;
  purchased?: number;
}

export default ICourse;
