import { InMemoryUserRepository } from '../adapters/in-memory-user.repository';
import { testUsers } from '../test/unit-test.user';
import { Authenticator } from './authenticator';

describe(' Test suite', () => {
  let repository: InMemoryUserRepository;
  let authenticator: Authenticator;

  beforeEach(async () => {
    repository = new InMemoryUserRepository([testUsers.alice]);
    authenticator = new Authenticator(repository);
  });

  describe('Scenario: Happy Path', () => {
    const payload = Buffer.from(
      `${testUsers.alice.props.emailAddress}:${testUsers.alice.props.password}`,
    ).toString('base64');

    it('should be defined', async () => {
      const user = await authenticator.validateUser(payload);

      expect(user!.props).toEqual({
        id: testUsers.alice.props.id,
        emailAddress: testUsers.alice.props.emailAddress,
        password: testUsers.alice.props.password,
      });
    });
  });

  describe('Scenario: Invalid Email', () => {
    const payload = Buffer.from(
      `${testUsers.alice.props.emailAddress + 'aaa'}:${testUsers.alice.props.password}`,
    ).toString('base64');

    it('should be defined', async () => {
      const user = await authenticator.validateUser(payload);

      expect(user).toBeNull();
    });
  });

  describe('Scenario: Invalid password', () => {
    const payload = Buffer.from(
      `${testUsers.alice.props.emailAddress}:1234`,
    ).toString('base64');

    it('should be defined', async () => {
      const user = await authenticator.validateUser(payload);

      expect(user).toBeNull();
    });
  });
});
