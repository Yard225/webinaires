import { User } from '../entities/user.entity';
import { IAuthenticator } from '../ports/authenticator.interface';
import { IUserRepository } from '../ports/user-repository.interface';

export class Authenticator implements IAuthenticator {
  constructor(private readonly repository: IUserRepository) {}

  async validateUser(token: string): Promise<User | null> {
    const decoded = Buffer.from(token, 'base64').toString();
    const [emailAddress, password] = decoded.split(':');

    const user = await this.repository.findByEmailAddress(emailAddress);

    if (user && user.props.password === password) return user;
    else return null;
  }
}
