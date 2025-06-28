import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { OrganizeWebinaire } from './organize-webinaire';
import { User } from '../../users/entities/user.entity';
import { Webinaire } from '../entities/webinaire.entity';
import { FixedIDGenerator } from '../adapters/fixed-id-generator';
import { FixedDateGenerator } from '../adapters/fixed-date-generator';

describe('Feature: Organize webinaire', () => {
  function expectedWebinaireToEqual(webinaire: Webinaire) {
    expect(webinaire.props).toEqual({
      id: 'id-1',
      organizerId: 'john-doe',
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2023-01-10T10:00:00.000Z'),
      endDate: new Date('2023-01-11T11:00:00.000Z'),
    });
  }

  const johnDoe = new User({ id: 'john-doe' });

  let repository: InMemoryWebinaireRepository;
  let fixedIdGenerator: FixedIDGenerator;
  let fixedDateGenerator: FixedDateGenerator;
  let useCase: OrganizeWebinaire;

  beforeEach(() => {
    repository = new InMemoryWebinaireRepository();
    fixedIdGenerator = new FixedIDGenerator();
    fixedDateGenerator = new FixedDateGenerator();
    useCase = new OrganizeWebinaire(
      repository,
      fixedIdGenerator,
      fixedDateGenerator,
    );
  });

  afterEach(() => {});

  describe('Scenario: Happy Path', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2023-01-10T10:00:00.000Z'),
      endDate: new Date('2023-01-11T11:00:00.000Z'),
    };

    it('should return an ID', async () => {
      const result = await useCase.execute(payload);
      expect(result.id).toBe('id-1');
    });

    it('should insert data into the database', async () => {
      await useCase.execute(payload);
      expect(repository.database.length).toBe(1);

      const webinaireCreated = repository.database[0];
      expectedWebinaireToEqual(webinaireCreated);
    });
  });

  describe('Scenario: the webinaire must happen too close', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2023-01-01T10:00:00.000Z'),
      endDate: new Date('2023-01-01T11:00:00.000Z'),
    };

    it('should throw an error', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'The webinaire must happens in at least 3 days',
      );
    });

    it('should dont create webinaire', async () => {
      try {
        await useCase.execute(payload);
      } catch (error) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: the webinaire must have a maximum of 1000 seats', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 1001,
      startDate: new Date('2023-01-10T10:00:00.000Z'),
      endDate: new Date('2023-01-11T11:00:00.000Z'),
    };

    it('should throw an error', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have maximum of 1000 seats',
      );
    });

    it('should dont create webinaire', async () => {
      try {
        await useCase.execute(payload);
      } catch (error) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: the webinaire dont have enough seats', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 0,
      startDate: new Date('2023-01-10T10:00:00.000Z'),
      endDate: new Date('2023-01-11T11:00:00.000Z'),
    };

    it('should throw an error', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have at least 1 seat',
      );
    });

    it('should dont create webinaire', async () => {
      try {
        await useCase.execute(payload);
      } catch (error) {}

      expect(repository.database.length).toBe(0);
    });
  });
});
