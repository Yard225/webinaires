import { BaseFixture } from '../../shared/fixture';
import { User } from '../../users/entities/user.entity';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from '../../users/ports/user-repository.interface';
import { TestApp } from '../utils/test-app';
import { IFixture } from './fixture.interface';

export class UserFixture extends BaseFixture<User> implements IFixture {
  async load(app: TestApp): Promise<void> {
    const userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
    const user = userRepository.create(this.entity);
  }

  createAuthorizationToken() {
    return (
      'Basic ' +
      Buffer.from(
        `${this.entity.props.emailAddress}:${this.entity.props.password}`,
      ).toString('base64')
    );
  }
}
