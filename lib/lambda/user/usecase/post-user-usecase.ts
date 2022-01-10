import { UserRepository } from "../repository/user";

type PostUserType = {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
};

export class PostUserUseCase {
  private body: PostUserType;
  private userRepository: UserRepository;

  constructor(body: any) {
    this.body = JSON.parse(body);
    this.userRepository = new UserRepository();
  }

  public async createUser() {
    await this.userRepository.postUser(this.body);
  }
}
