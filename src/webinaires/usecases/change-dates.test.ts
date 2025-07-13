import { testUsers } from '../../users/test/unit-test.user';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { ChangeDates } from './change-dates';
import { Webinaire } from '../entities/webinaire.entity';
import { FixedDateGenerator } from '../../core/adapters/fixed-date-generator';
import { InMemoryParticipationRepository } from '../adapters/in-memory-participation.repository';
import { InMemoryMailer } from '../../core/adapters/in-memory-mailer';
import { Participation } from '../entities/participation.entity';
import { InMemoryUserRepository } from '../../users/adapters/in-memory-user.repository';

describe('Feature: Organize webinaire', () => {
  async function expectDatesRemainUnchanged() {
    const webinaire = await webinaireRepository.findById('id-1');
    expect(webinaire!.props.startDate).toEqual(
      new Date('2025-01-10T10:00:00.000Z'),
    );
    expect(webinaire!.props.endDate).toEqual(
      new Date('2025-01-11T10:00:00.000Z'),
    );
  }

  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let mailer: InMemoryMailer;
  let dateGenerator: FixedDateGenerator;
  let webinaireRepository: InMemoryWebinaireRepository;
  let useCase: ChangeDates;

  const webinaire = new Webinaire({
    id: 'id-1',
    organizerId: testUsers.alice.props.id,
    title: 'My first webinaire',
    seats: 50,
    startDate: new Date('2025-01-10T10:00:00.000Z'),
    endDate: new Date('2025-01-11T10:00:00.000Z'),
  });

  const bobParticipation = new Participation({
    userId: testUsers.bob.props.id,
    webinaireId: webinaire.props.id,
  });

  beforeEach(async () => {
    mailer = new InMemoryMailer();
    dateGenerator = new FixedDateGenerator();
    userRepository = new InMemoryUserRepository([
      testUsers.bob,
      testUsers.alice,
    ]);
    participationRepository = new InMemoryParticipationRepository([
      bobParticipation,
    ]);
    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);
    useCase = new ChangeDates(
      webinaireRepository,
      participationRepository,
      userRepository,
      dateGenerator,
      mailer,
    );
  });

  describe('Scenario: Happy Path', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'id-1',
      startDate: new Date('2025-01-20T10:00:00.000Z'),
      endDate: new Date('2025-01-21T10:00:00.000Z'),
    };

    it('should change the start and the end date of the webinaire', async () => {
      const result = await useCase.execute(payload);

      const webinaire = await webinaireRepository.findById('id-1');
      expect(webinaire!.props.startDate).toEqual(
        new Date('2025-01-20T10:00:00.000Z'),
      );
      expect(webinaire!.props.endDate).toEqual(
        new Date('2025-01-21T10:00:00.000Z'),
      );
    });

    it('should send an email to the participants', async () => {
      const result = await useCase.execute(payload);
      expect(mailer.sentEmails).toEqual([
        {
          to: testUsers.bob.props.emailAddress,
          subject: `The dates of webinaire ${webinaire.props.title} have changed`,
          body: 'The webinaire dates have changed',
        },
      ]);
    });
  });

  describe('Scenario: The webinaire is not found', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'not-exist',
      startDate: new Date('2025-01-20T10:00:00.000Z'),
      endDate: new Date('2025-01-21T10:00:00.000Z'),
    };

    it('should reject because the webinaire is not found', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );
    });

    it('should not change the dates of the webinaire', async () => {
      await expectDatesRemainUnchanged();
    });
  });

  describe('Scenario: updating the webinaire of someone else', () => {
    const payload = {
      user: testUsers.bob,
      webinaireId: 'id-1',
      startDate: new Date('2025-01-20T10:00:00.000Z'),
      endDate: new Date('2025-01-21T10:00:00.000Z'),
    };

    it('should not allowed to update this webinaire', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'You are not allowed to update this webinaire',
      );
    });

    it('should not change the dates of the webinaire', async () => {
      await expectDatesRemainUnchanged();
    });
  });

  describe('Scenario: The webinaire must happen too close', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'id-1',
      startDate: new Date('2025-01-03T10:00:00.000Z'),
      endDate: new Date('2025-01-21T10:00:00.000Z'),
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must happens in at least 3 days',
      );
    });

    it('should not change the dates of the webinaire', async () => {
      await expectDatesRemainUnchanged();
    });
  });
});
