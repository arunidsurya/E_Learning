import IComment from "./Icomment";

interface IReview {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

export default IReview;
