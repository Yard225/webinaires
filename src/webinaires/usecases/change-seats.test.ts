import { testUsers } from 'src/users/test/unit-test.user';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { ChangeSeats } from './change-seats';
import { Webinaire } from '../entities/webinaire.entity';

describe('Feature: Organize webinaire', () => {
  let webinaireRepository: InMemoryWebinaireRepository;
  let useCase: ChangeSeats;

  const webinaire = new Webinaire({
    id: 'id-1',
    organizerId: testUsers.alice.props.id,
    title: 'My first webinaire',
    seats: 50,
    startDate: new Date('2025-01-10T10:00:00.000Z'),
    endDate: new Date('2025-01-11T10:00:00.000Z'),
  });

  beforeEach(async () => {
    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);
    useCase = new ChangeSeats(webinaireRepository);
  });

  describe('Scenario: Happy Path', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'id-1',
      seats: 100,
    };

    it('should change the number of seats', async () => {
      const result = await useCase.execute(payload);

      const webinaire = await webinaireRepository.findById('id-1');
      expect(webinaire!.props.seats).toEqual(100);
    });
  });

  describe('Scenario: The webinaire is not found', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'not-exist',
      seats: 100,
    };

    it('should reject because the webinaire is not found', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );
    });

    it('should not change the number of seats', async () => {
      const webinaire = await webinaireRepository.findById('id-1');
      expect(webinaire!.props.seats).toEqual(50);
    });
  });

  describe('Scenario: updating the webinaire of someone else', () => {
    const payload = {
      user: testUsers.bob,
      webinaireId: 'id-1',
      seats: 100,
    };

    it('should not allowed to update this webinaire', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'You are not allowed to update this webinaire',
      );
    });

    it('should not change the number of seats', async () => {
      const webinaire = await webinaireRepository.findById('id-1');
      expect(webinaire!.props.seats).toEqual(50);
    });
  });

  describe('Scenario: reducing the number of seats', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'id-1',
      seats: 49,
    };

    it('should not permitted to reduce the number of seats more than it original value', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'You cannot reduce the number of seats',
      );
    });

    it('should not change the number of seats', async () => {
      const webinaire = await webinaireRepository.findById('id-1');
      expect(webinaire!.props.seats).toEqual(50);
    });
  });

  describe('Scenario: The webinaire must have a maximum of 1000 seats', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'id-1',
      seats: 1001,
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have a maximum of 1000 seats',
      );
    });

    it('should not change the number of seats', async () => {
      const webinaire = await webinaireRepository.findById('id-1');
      expect(webinaire!.props.seats).toEqual(50);
    });
  });
});
