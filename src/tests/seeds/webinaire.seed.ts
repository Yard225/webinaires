import { Webinaire } from '../../webinaires/entities/webinaire.entity';
import { WebinaireFixture } from '../fixtures/webinaire.fixture';

export const e2eWebinaires = {
  webinaire: new WebinaireFixture(
    new Webinaire({
      id: 'id-1',
      organizerId: 'alice',
      title: 'My first webinaire',
      seats: 50,
      startDate: new Date('2025-01-01T10:00:00.000Z'),
      endDate: new Date('2025-01-01T10:00:00.000Z'),
    }),
  ),
};
