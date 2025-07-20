import { TestApp } from './utils/test-app';
import * as request from 'supertest';
import { e2eUsers } from './seeds/user.seed';
import {
  I_WEBINAIRE_REPOSITORY,
  IWebinaireRepository,
} from '../webinaires/ports/webinaire-repository.interface';
import { e2eWebinaires } from './seeds/webinaire.seed';

describe('Feature: Changing seats', () => {
  let app: TestApp;

  const id = e2eWebinaires.webinaire.entity.props.id;
  const seats = 100;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.alice, e2eWebinaires.webinaire]); //ne pas oublier de créer des fixtures
  });

  afterEach(async () => {
    app.cleanup();
  });

  describe('Scenario: Happy Path', () => {
    it('should change the number of seats', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinaires/${id}/seats`)
        .set('Authorization', e2eUsers.alice.createAuthorizationToken())
        .send({ seats });

      expect(result.status).toBe(200);

      const webinaireRepository = app.get<IWebinaireRepository>(
        I_WEBINAIRE_REPOSITORY,
      );

      const webinaire = await webinaireRepository.findById(id);

      expect(webinaire).toBeDefined();
      expect(webinaire!.props.seats).toBe(seats);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinaires/${id}/seats`)
        .send({ seats });

      expect(result.status).toBe(403);
    });
  });
});
