import { InMemoryUserRepository } from '../adapters/in-memory-user.repository';
import { User } from '../entities/user.entity';
import { Authenticator } from './authenticator';

describe('Feature: Authenticator', () => {
  let repository: InMemoryUserRepository;
  let authenticator: Authenticator;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();

    await repository.create(
      new User({
        id: 'id-1',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
      }),
    );

    authenticator = new Authenticator(repository);
  });

  describe('Case: the token is valid', () => {
    const payload = Buffer.from('johndoe@gmail.com:azerty').toString('base64');
    it('should return the user', async () => {
      const user = await authenticator.validateUser(payload);

      expect(user.props).toEqual({
        id: 'id-1',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
      });
    });
  });

  describe('Case: the user does not exist', () => {
    const payload = Buffer.from('unknow@gmail.com:azerty').toString('base64');
    it('should fail', async () => {
      await expect(authenticator.validateUser(payload)).rejects.toThrow(
        'emailAddress or password is invalid',
      );
    });
  });

  describe('Case: the password is invalid', () => {
    const payload = Buffer.from('johndoe@gmail.com:azerty12345@').toString(
      'base64',
    );
    it('should fail', async () => {
      await expect(authenticator.validateUser(payload)).rejects.toThrow(
        'emailAddress or password is invalid',
      );
    });
  });
});
