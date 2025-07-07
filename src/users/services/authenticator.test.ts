import { InMemoryUserRepository } from '../adapters/in-memory-user.repository';
import { User } from '../entities/user.entity';
import { Authenticator } from './authenticator';

describe('Feature: Authenticate User', () => {
  let repository: InMemoryUserRepository;
  let authenticator: Authenticator;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    authenticator = new Authenticator(repository);

    repository.create(
      new User({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
      }),
    );
  });

  describe('Scenario: Happy path', () => {
    const token = Buffer.from('johndoe@gmail.com:azerty').toString('base64');

    it('should authenticate user', async () => {
      const user = await authenticator.validateUser(token);
      expect(user!.props).toEqual({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
      });
    });
  });

  describe('Scenario: email is incorrect', () => {
    const token = Buffer.from('johndoe22@gmail.com:azerty').toString('base64');

    it('should return null', async () => {
      const user = await authenticator.validateUser(token);
      expect(user).toBeNull();
    });
  });

  describe('Scenario: password is incorrect', () => {
    const token = Buffer.from('johndoe@gmail.com:azerty12345').toString(
      'base64',
    );

    it('should return null', async () => {
      const user = await authenticator.validateUser(token);
      expect(user).toBeNull();
    });
  });
});
