import IComment from "./Icomment";
import ILink from "./Ilink";

interface ICourseData {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

export default ICourseData;
