import Tutor from "../../entities/tutorEntity";

interface ITutorRepository {
  findByEmail(email: string): Promise<Tutor | null>;
  // isLoggedEmail(email: string): Promise<Tutor | null>;
  createTutor(tutorData: Tutor): Promise<Tutor | null>;
  loginTutor(
    tutor: Tutor,
    email: string,
    password: string
  ): Promise<string | null>;
}

export default ITutorRepository;
