import { InMemoryUserRepository } from '../adapters/in-memory-user.repository';
import { User } from '../entities/user.entity';
import { Authenticator } from './authenticator';

describe('Feature: Authenticate User', () => {
  let repository: InMemoryUserRepository;
  let authenticator: Authenticator;

  const johnDoe = new User({
    id: 'john-doe',
    emailAddress: 'johndoe@gmail.com',
    password: 'azerty',
  });

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    authenticator = new Authenticator(repository);

    repository.create(johnDoe);
  });

  describe('Scenario: Happy Path', () => {
    const token = Buffer.from('johndoe@gmail.com:azerty').toString('base64');
    it('should retrieve user', async () => {
      const user = await authenticator.validateUser(token);
      expect(user!.props).toEqual({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
      });
    });
  });

  describe('Scenario: incorrect email', () => {
    const token = Buffer.from('johndoe22@gmail.com:azerty').toString('base64');
    it('should not retrieve user and return null', async () => {
      const user = await authenticator.validateUser(token);
      expect(user).toBeNull();
    });
  });

  describe('Scenario: incorrect password', () => {
    const token = Buffer.from('johndoe@gmail.com:azerty123@').toString(
      'base64',
    );
    it('should not retrieve user and return null', async () => {
      const user = await authenticator.validateUser(token);
      expect(user).toBeNull();
    });
  });
});
