import { TestApp } from './utils/test-app';
import * as request from 'supertest';
import { e2eUsers } from './seeds/user.seed';
import {
  I_WEBINAIRE_REPOSITORY,
  IWebinaireRepository,
} from '../webinaires/ports/webinaire-repository.interface';
import { e2eWebinaires } from './seeds/webinaire.seed';
import { addDays } from 'date-fns';

describe('Feature: Cancelling webinaire', () => {
  let app: TestApp;

  const id = 'id-1';

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eWebinaires.webinaire,
    ]); //ne pas oublier de créer des fixtures
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy Path', () => {
    it('should cancel the webinaire', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/webinaires/${id}`)
        .set('Authorization', e2eUsers.alice.createAuthorizationToken());

      expect(result.status).toBe(200);

      const webinaireRepository = app.get<IWebinaireRepository>(
        I_WEBINAIRE_REPOSITORY,
      );

      const webinaire = await webinaireRepository.findById(id);

      expect(webinaire).toBeNull();
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/webinaires/${id}`,
      );

      expect(result.status).toBe(403);
    });
  });
});
