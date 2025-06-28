import { Test } from '@nestjs/testing';
import { addDays } from 'date-fns';
import { AppModule } from '../app/app.module';
import * as request from 'supertest';
import { User } from '../users/entities/user.entity';
import { InMemoryUserRepository } from '../core/adapters/in-memory-user.repository';
import { InMemoryWebinaireRepository } from '../webinaires/adapters/in-memory-webinaire.repository';
import { INestApplication } from '@nestjs/common';

describe('Feature: Organizing webinaire', () => {
  let app: INestApplication;

  const johnDoe = new User({
    id: 'john-doe',
    emailAddress: 'johndoe@gmail.com',
    password: 'azerty',
  });

  const startDate = addDays(new Date(), 5);
  const endDate = addDays(new Date(), 6);

  const token = Buffer.from(
    `${johnDoe.props.emailAddress}:${johnDoe.props.password}`,
  ).toString('base64');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const userRepository = app.get(InMemoryUserRepository);
    await userRepository.create(johnDoe);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Scenario: Happy Path', () => {
    it('should create the webinaire', async () => {
      const resultat = await request(app.getHttpServer())
        .post('/webinaires')
        .set('Authorization', 'Basic ' + token)
        .send({
          title: 'My first webinaire',
          seats: 100,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(resultat.status).toBe(201);
      expect(resultat.body).toEqual({ id: expect.any(String) });

      const webinaireRepository = app.get(InMemoryWebinaireRepository);
      const webianire = webinaireRepository.database[0];

      expect(webianire).toBeDefined();
      expect(webianire.props).toEqual({
        id: resultat.body.id,
        organizerId: 'john-doe',
        title: 'My first webinaire',
        seats: 100,
        startDate,
        endDate,
      });
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should reject', async () => {
      const resultat = await request(app.getHttpServer())
        .post('/webinaires')
        .send({
          title: 'My first webinaire',
          seats: 100,
          startDate: addDays(new Date(), 5).toISOString(),
          endDate: addDays(new Date(), 6).toISOString(),
        });

      expect(resultat.status).toBe(403);
    });
  });
});
