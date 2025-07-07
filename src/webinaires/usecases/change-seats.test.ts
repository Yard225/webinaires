import { User } from '../../users/entities/user.entity';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { Webinaire } from '../entities/webinaire.entity';
import { ChangeSeats } from './change-seats';

describe('Feature: Changing the number of seats', () => {
  const johnDoe = new User({
    id: 'john-doe',
    emailAddress: 'johndoe@gmail.com',
    password: 'azerty',
  });

  const webinaire = new Webinaire({
    id: 'id-1',
    organizerId: 'john-doe',
    title: 'My first webinaire',
    seats: 50,
    startDate: new Date('2025-01-01T10:00:00.000Z'),
    endDate: new Date('2025-01-01T10:00:00.000Z'),
  });
  //   function expectEqualToWebinaire(webinaire: Webinaire) {
  //     expect(webinaire.props).toEqual({
  //       id: 'id-1',
  //       organizerId: johnDoe.props.id,
  //       title: 'my first webinaire',
  //       seats: 100,
  //       startDate: new Date('2025-01-10T10:00:00.000Z'),
  //       endDate: new Date('2025-01-11T10:00:00.000Z'),
  //     });
  //   }

  //   let dateGenerator: FixedDateGenerator;
  //   let idGenerator: FixedIDGenerator;
  let webinaireRepository: InMemoryWebinaireRepository;
  let useCase: ChangeSeats;

  beforeEach(async () => {
    // dateGenerator = new FixedDateGenerator();
    // idGenerator = new FixedIDGenerator();
    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);
    useCase = new ChangeSeats(webinaireRepository);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      user: johnDoe,
      webinaireId: 'id-1',
      seats: 100,
    };
    it('should change the number of seats', async () => {
      const result = await useCase.execute(payload);

      const webinaire = await webinaireRepository.findById('id-1');
      expect(webinaire!.props.seats).toEqual(100);
    });
  });

  describe('Scenario: The webinaire does not exist', () => {
    const payload = {
      user: johnDoe,
      webinaireId: 'id-3',
      seats: 100,
    };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );
    });
  });
});
