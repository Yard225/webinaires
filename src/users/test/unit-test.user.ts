import { User } from '../entities/user.entity';

export const testUsers = {
  alice: new User({
    id: 'alice',
    emailAddress: 'alice@abc.fr',
    password: 'alice123',
  }),

  bob: new User({
    id: 'bob',
    emailAddress: 'bob@abc.fr',
    password: 'bob123',
  }),
};
