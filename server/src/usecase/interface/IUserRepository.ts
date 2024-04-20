import User from "../../entities/userEntity";

interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  isLoggedEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User | null>;
  loginUser(
    user: User,
    email: string,
    password: string
  ): Promise<string | null>;
  forgotPasswordConfirm(
    email: string,
    newPassword: string
  ): Promise<User | null>;
  updateUserinfo(userData: User): Promise<User | null>;
  updateUserPassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ): Promise<User | null>;
  googleLogin(user: User): Promise<string | null>;
  googleSignup(
    name: string,
    email: string,
    avatar: string
  ): Promise<{ savedUser: User; token: string } | null>;
}

export default IUserRepository;
