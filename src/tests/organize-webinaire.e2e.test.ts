import { addDays } from 'date-fns';
import { TestApp } from './utils/test-app';
import * as request from 'supertest';
import { e2eUsers } from './seeds/users.seed';
import {
  I_WEBINAIRE_REPOSITORY,
  IWebinaireRepository,
} from '../webinaires/ports/user-repository.interface';

describe('Feature: Organizing Webinaire', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    const startDate = addDays(new Date(), 4);
    const endDate = addDays(new Date(), 5);

    const payload = {
      title: 'My first webinaire',
      seats: 100,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    it('should be defined', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinaires')
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send(payload);

      expect(result.status).toBe(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinaireRepository = app.get<IWebinaireRepository>(
        I_WEBINAIRE_REPOSITORY,
      );
      const webinaire = await webinaireRepository.findById(result.body.id);

      expect(webinaire).toBeDefined();
      expect(webinaire!.props).toEqual({
        id: result.body.id,
        organizerId: e2eUsers.johnDoe.entity.props.id,
        title: 'My first webinaire',
        seats: 100,
        startDate,
        endDate,
      });
    });
  });

  describe('Scenario: the user is not authenticate', () => {
    const startDate = addDays(new Date(), 4);
    const endDate = addDays(new Date(), 5);

    const payload = {
      title: 'My first webinaire',
      seats: 100,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    it('should rejected', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinaires')
        .send(payload);

      expect(result.status).toBe(403);
    });
  });
});
