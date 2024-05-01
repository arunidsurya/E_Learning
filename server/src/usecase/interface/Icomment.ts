interface IComment {
  user: object;
  comment: string;
  commentReplies: IComment[];
}

export default IComment;
