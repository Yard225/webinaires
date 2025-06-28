import { Test } from '@nestjs/testing';
import { addDays } from 'date-fns';
import { AppModule } from '../app/app.module';
import * as request from 'supertest';

describe('Feature: Organizing webinaire', () => {
  it('should organize a webinaire', async () => {
    const module = Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = (await module).createNestApplication();
    await app.init();

    const resultat = await request(app.getHttpServer())
      .post('/webinaires')
      .send({
        title: 'My first webinaire',
        seats: 100,
        startDate: addDays(new Date(), 5).toISOString(),
        endDate: addDays(new Date(), 6).toISOString(),
      });

    expect(resultat.status).toBe(201);
    expect(resultat.body).toEqual({ id: expect.any(String) });
  });
});
