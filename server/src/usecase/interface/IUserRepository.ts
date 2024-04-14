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
}

export default IUserRepository;
