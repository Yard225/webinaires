import { TestApp } from './utils/test-app';
import * as request from 'supertest';
import { e2eUsers } from './seeds/user.seed';
import { e2eWebinaires } from './seeds/webinaire.seed';
import {
  I_PARTICIPATION_REPOSITORY,
  IParticipationRepository,
} from '../webinaires/ports/participation-repository.interface';
import { e2eParticipation } from './seeds/participation.seed';

describe('Feature: Cancelling webinaire', () => {
  let app: TestApp;

  const id = e2eWebinaires.webinaire.entity.props.id;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eWebinaires.webinaire,
      e2eParticipation.bob,
    ]); //ne pas oublier de créer des fixtures
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy Path', () => {
    it('should cancel the participation', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/webinaires/${id}/participations`)
        .set('Authorization', e2eUsers.bob.createAuthorizationToken());

      expect(result.status).toBe(200);

      const participationRepository = app.get<IParticipationRepository>(
        I_PARTICIPATION_REPOSITORY,
      );

      const participation = await participationRepository.findOne(
        e2eUsers.bob.entity.props.id,
        id,
      );

      expect(participation).toBeNull();
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/webinaires/${id}/participations`,
      );

      expect(result.status).toBe(403);
    });
  });
});
