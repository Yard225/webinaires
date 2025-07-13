import { testUsers } from '../../users/test/unit-test.user';
import { FixedIDGenerator as FixedIDGenerator } from '../../core/adapters/fixed-id-generator';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { OrganizeWebinaire } from './organize-webinaire';
import { Webinaire } from '../entities/webinaire.entity';
import { FixedDateGenerator } from '../../core/adapters/fixed-date-generator';

describe('Feature: Organize webinaire', () => {
  function expectWebinaireEqualTo(webinaire: Webinaire) {
    expect(webinaire.props).toEqual({
      id: 'id-1',
      organizerId: testUsers.alice.props.id,
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2025-01-10T10:00:00.000Z'),
      endDate: new Date('2025-01-11T10:00:00.000Z'),
    });
  }

  let dateGenerator: FixedDateGenerator;
  let idGenerator: FixedIDGenerator;
  let repository: InMemoryWebinaireRepository;
  let useCase: OrganizeWebinaire;

  beforeEach(async () => {
    dateGenerator = new FixedDateGenerator();
    idGenerator = new FixedIDGenerator();
    repository = new InMemoryWebinaireRepository();
    useCase = new OrganizeWebinaire(repository, idGenerator, dateGenerator);
  });

  describe('Scenario: Happy Path', () => {
    const payload = {
      user: testUsers.alice,
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2025-01-10T10:00:00.000Z'),
      endDate: new Date('2025-01-11T10:00:00.000Z'),
    };

    it('should return an ID', async () => {
      const result = await useCase.execute(payload);
      expect(result.id).toBe('id-1');
    });

    it('should integrate data into BDD', async () => {
      await useCase.execute(payload);
      expect(repository.database.length).toBe(1);

      const createdWebinaire = repository.database[0];
      expectWebinaireEqualTo(createdWebinaire);
    });
  });

  describe('Scenario: The webinaire must happen too close', () => {
    const payload = {
      user: testUsers.alice,
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2025-01-03T10:00:00.000Z'),
      endDate: new Date('2025-01-04T10:00:00.000Z'),
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must happens in at least 3 days',
      );
    });

    it('should dont add data in database', async () => {
      try {
        await useCase.execute(payload);
        expect(repository.database.length).toBe(0);
      } catch (e) {}
    });
  });

  describe('Scenario: The webinaire must have a maximum of 1000 seats', () => {
    const payload = {
      user: testUsers.alice,
      title: 'My first webinaire',
      seats: 1001,
      startDate: new Date('2025-01-10T10:00:00.000Z'),
      endDate: new Date('2025-01-11T10:00:00.000Z'),
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have a maximum of 1000 seats',
      );
    });

    it('should dont add data in database', async () => {
      try {
        await useCase.execute(payload);
        expect(repository.database.length).toBe(0);
      } catch (e) {}
    });
  });

  describe('Scenario: The webinaire dont have enough seats', () => {
    const payload = {
      user: testUsers.alice,
      title: 'My first webinaire',
      seats: 0,
      startDate: new Date('2025-01-10T10:00:00.000Z'),
      endDate: new Date('2025-01-11T10:00:00.000Z'),
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have at least 1 seat',
      );
    });

    it('should dont add data in database', async () => {
      try {
        await useCase.execute(payload);
        expect(repository.database.length).toBe(0);
      } catch (e) {}
    });
  });
});
