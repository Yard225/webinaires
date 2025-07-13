import { TestApp } from './utils/test-app';
import * as request from 'supertest';
import { e2eUsers } from './seeds/user.seed';
import {
  I_WEBINAIRE_REPOSITORY,
  IWebinaireRepository,
} from '../webinaires/ports/webinaire-repository.interface';
import { e2eWebinaires } from './seeds/webinaire.seed';
import { addDays } from 'date-fns';

describe('Feature: Changing seats', () => {
  let app: TestApp;

  const id = 'id-1';
  const startDate = addDays(new Date(), 8);
  const endDate = addDays(new Date(), 8);

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
    it('should change the dates of webinaire', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinaires/${id}/dates`)
        .set('Authorization', e2eUsers.alice.createAuthorizationToken())
        .send({ startDate, endDate });

      expect(result.status).toBe(200);

      const webinaireRepository = app.get<IWebinaireRepository>(
        I_WEBINAIRE_REPOSITORY,
      );

      const webinaire = await webinaireRepository.findById(id);

      expect(webinaire).toBeDefined();
      expect(webinaire!.props.startDate).toEqual(startDate);
      expect(webinaire!.props.endDate).toEqual(endDate);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinaires/${id}/seats`)
        .send({ startDate, endDate });

      expect(result.status).toBe(403);
    });
  });
});
