import { IRepository } from '../../shared/repository';
import { User } from '../entities/user.entity';

export const I_USER_REPOSITORY = 'I_USER_REPOSITORY';

export interface IUserRepository extends IRepository<User> {
  findByEmailAddress(emailAddress: string): Promise<User | null>;
}
