import User from "../../entities/userEntity";

interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User | null>;
  loginUser(
    user: User,
    email: string,
    password: string
  ): Promise<string | null>;
}

export default IUserRepository;
