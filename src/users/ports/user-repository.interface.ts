import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmailAddress(emailAddress: string): Promise<User | null>;
}
