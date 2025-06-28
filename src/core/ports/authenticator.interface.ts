import { User } from '../../users/entities/user.entity';

export interface IAuthenticator {
  validateUser(token: string): Promise<User>;
}
