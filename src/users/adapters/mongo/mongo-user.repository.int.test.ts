import { TestApp } from '../../../tests/utils/test-app';
import { MongoUser } from './mongo-user';
import { Model } from 'mongoose';
import { MongoUserRepository } from './mongo-user.repository';
import { getModelToken } from '@nestjs/mongoose';

describe('MongoUserRepository', () => {
  let app: TestApp;
  let model: Model<MongoUser.Document>;
  let repository: MongoUserRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    model = app.get<Model<MongoUser.Document>>(
      getModelToken(MongoUser.CollectionName),
    );

    repository = new MongoUserRepository(model);
  });

  describe('Scenario: findByEmailAddress', () => {
    it('should find the user when the user is corresponding to the e-mail address', async () => {});
  });

  afterEach(async () => {
    await app.cleanup();
  });
});
