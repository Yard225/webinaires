import { User } from '../entities/user.entity';
import { IAuthenticator } from '../ports/authenticator.interface';
import { IUserRepository } from '../ports/user-repository.interface';

export class Authenticator implements IAuthenticator {
  constructor(private readonly repository: IUserRepository) {}

  async validateUser(token: string): Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [emailAddress, password] = decoded.split(':');

    const user = await this.repository.findByEmailAddress(emailAddress);

    if (user && user.props.password === password) {
      return user;
    }

    throw new Error('emailAddress or password is invalid');
  }
}
