import { InMemoryWebinaireRepository } from 'src/adapters/in-memory-webinaire.repository';
import { OrganizeWebinaire } from './organize-webinaire';
import { FixedIDGenerator } from '../adapters/fixed-id-generator';
import { Webinaire } from '../entities/webinaire.entity';
import { FixedDateGenerator } from '../adapters/fixed-date-generator';
import { User } from '../entities/user.entity';

describe('Feature: organizing a webinaire', () => {
  /*
    Création de fonction dans le but de refactoriser au maximum
  */
  function expectedWebinaireToEqual(webinaire: Webinaire) {
    expect(webinaire.props).toEqual({
      id: 'id-1',
      organizerId: 'john-doe',
      title: 'My first Webinaire',
      seats: 100,
      startDate: new Date('2023-01-10T10:00:00.000Z'),
      endDate: new Date('2023-01-10T11:00:00.000Z'),
    });
  }

  const johnDoe = new User({ id: 'john-doe' });

  let repository: InMemoryWebinaireRepository;
  let fixedIDGenerator: FixedIDGenerator;
  let fixedDateGenerator: FixedDateGenerator;
  let useCase: OrganizeWebinaire;

  beforeEach(() => {
    repository = new InMemoryWebinaireRepository();
    fixedIDGenerator = new FixedIDGenerator();
    fixedDateGenerator = new FixedDateGenerator();
    useCase = new OrganizeWebinaire(
      repository,
      fixedIDGenerator,
      fixedDateGenerator,
    );
  });

  afterEach(() => {});

  describe('Scenario: Happy Path', () => {
    /* Happy Path
        Pouvoir organiser un webinaire
        -> usecase + repository
    */
    const payload = {
      user: johnDoe,
      title: 'My first Webinaire',
      seats: 100,
      startDate: new Date('2023-01-10T10:00:00.000Z'),
      endDate: new Date('2023-01-10T11:00:00.000Z'),
    };

    it('should return the ID', async () => {
      const result = await useCase.execute(payload);
      expect(result.id).toBe('id-1');
    });

    it('should insert the webinaire into the database', async () => {
      await useCase.execute(payload);
      expect(repository.database.length).toBe(1);

      const createdWebinaire = repository.database[0];
      expectedWebinaireToEqual(createdWebinaire);
    });
  });

  describe('Scenario: The webinaire should happen soon', () => {
    /* Règle de gestion
        N°1: le webinaire doit être organisé au moins 03 jours avant la date de début (startDate).
        ->  Ne pas pouvoir créer de webinaire
    */
    const payload = {
      user: johnDoe,
      title: 'My first Webinaire',
      seats: 100,
      startDate: new Date('2023-01-01T10:00:00.000Z'),
      endDate: new Date('2023-01-01T11:00:00.000Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must happens in at least 3 days',
      );
    });

    it('should not create a webinaire', async () => {
      /* le Try Catch permet d'éxécuter le usecase mais ne va rien intercepter comme erreur */
      try {
        await useCase.execute(payload);
      } catch (error) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: The webinaire has too many seats', () => {
    /* Règle de gestion
        N°2: le nombre de siège du webinaire ne doit pas être supérieur à 1000 (seats).
        ->  Ne pas pouvoir créer de webinaire
    */
    const payload = {
      user: johnDoe,
      title: 'My first Webinaire',
      seats: 1001,
      startDate: new Date('2023-01-05T10:00:00.000Z'),
      endDate: new Date('2023-01-06T11:00:00.000Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have maximum of 1000 seats',
      );
    });

    it('should not create a webinaire', async () => {
      /* le Try Catch permet d'éxécuter le usecase mais ne va rien intercepter comme erreur */
      try {
        await useCase.execute(payload);
      } catch (error) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: The webinaire dont have enough seats', () => {
    /* Règle de gestion
        N°3: le nombre de siège du webinaire ne doit pas être inférieur à 1 (seats).
        ->  Ne pas pouvoir créer de webinaire
    */
    const payload = {
      user: johnDoe,
      title: 'My first Webinaire',
      seats: 0,
      startDate: new Date('2023-01-05T10:00:00.000Z'),
      endDate: new Date('2023-01-06T11:00:00.000Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have at least 1 seat',
      );
    });

    it('should not create a webinaire', async () => {
      /* le Try Catch permet d'éxécuter le usecase mais ne va rien intercepter comme erreur */
      try {
        await useCase.execute(payload);
      } catch (error) {}

      expect(repository.database.length).toBe(0);
    });
  });
});
