import { User } from '../entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(public readonly database: User[] = []) {}

  async create(entity: User): Promise<void> {
    this.database.push(entity);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.database.find((user) => user.props.id === id);
    return user ? new User({ ...user.props }) : null;
  }

  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    const user = this.database.find(
      (user) => user.props.emailAddress === emailAddress,
    );
    return user ?? null;
  }

  async findAll(): Promise<User[]> {
    return this.database;
  }
}
