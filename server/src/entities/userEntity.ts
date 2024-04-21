interface User {
  _id?: string;
  name: string;
  email: string;
  gender: string;
  password: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
}

export default User;
