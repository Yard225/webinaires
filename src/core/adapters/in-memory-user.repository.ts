import { User } from '../../users/entities/user.entity';
import { IUserRepository } from '../../users/ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private readonly database: User[] = []) {}

  async create(user: User) {
    this.database.push(user);
  }

  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    const user = this.database.find(
      (user) => user.props.emailAddress === emailAddress,
    );

    return user ?? null;
  }
}
