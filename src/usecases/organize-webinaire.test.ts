import { InMemoryWebinaireRepository } from 'src/adapters/in-memory-webinaire.repository';
import { OrganizeWebinaire } from './organize-webinaire';
import { FixedIDGenerator } from 'src/adapters/fixed-id-generator';

describe('Feature: organizing a webinaire', () => {
  let repository: InMemoryWebinaireRepository;
  let idGenerator: FixedIDGenerator;
  let useCase: OrganizeWebinaire;

  /*
  Préparation du Test avec:
  - le repository
  - l'ID Generator
  - le usecase
  */
  beforeEach(() => {
    repository = new InMemoryWebinaireRepository();
    idGenerator = new FixedIDGenerator();
    useCase = new OrganizeWebinaire(repository, idGenerator);
  });

  afterEach(() => {});

  describe('Scenario: Happy Path', () => {
    const payload = {
      title: 'My first Webinaire',
      seats: 100,
      startDate: new Date('2023-01-10T00:00:00:000Z'),
      endDate: new Date('2023-01-11T00:00:00:000Z'),
    };

    it('should return the ID', async () => {
      const result = await useCase.execute(payload);
      expect(result.id).toBe('id-1');
    });
  });

  describe('Scenario: Happy Path', () => {
    const payload = {
      id: 'id-1',
      title: 'My first Webinaire',
      seats: 100,
      startDate: new Date('2023-01-10T00:00:00:000Z'),
      endDate: new Date('2023-01-11T00:00:00:000Z'),
    };

    it('should insert the webinaire into the database', async () => {
      await useCase.execute(payload);
      expect(repository.database.length).toBe(1);

      const createdWebinaire = repository.database[0];
      expect(createdWebinaire.props).toEqual(payload);
    });
  });
});
