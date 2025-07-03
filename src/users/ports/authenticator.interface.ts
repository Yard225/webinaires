import { User } from '../entities/user.entity';

export interface IAuthenticator {
  validateUser(token: string): Promise<User | null>;
}
