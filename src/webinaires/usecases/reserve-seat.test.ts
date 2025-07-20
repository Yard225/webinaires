import { testUsers } from 'src/users/test/unit-test.user';
import { InMemoryParticipationRepository } from '../adapters/in-memory-participation.repository';
import { ReserveSeat } from './reserve-seat';
import { Webinaire } from '../entities/webinaire.entity';
import { InMemoryMailer } from '../../core/adapters/in-memory-mailer';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { InMemoryUserRepository } from '../../users/adapters/in-memory-user.repository';
import { Participation } from '../entities/participation.entity';

describe('Feature: Reserve Seat', () => {
  function expectParticipationToBeCreated(userId: string) {
    const storedParticipation = participationRepository.findOneSync(
      userId,
      webinaire.props.id,
    );

    expect(storedParticipation).not.toBeNull();
  }

  function expectParticipationNotToBeCreated(userId: string) {
    const storedParticipation = participationRepository.findOneSync(
      userId,
      webinaire.props.id,
    ); //?

    expect(storedParticipation).toBeNull();
  }

  const webinaire = new Webinaire({
    id: 'id-1',
    organizerId: testUsers.alice.props.id,
    title: 'My first webinaire',
    seats: 100,
    startDate: new Date('2025-01-10T10:00:00.000Z'),
    endDate: new Date('2025-01-11T10:00:00.000Z'),
  });

  const webinaireWithFewSeats = new Webinaire({
    id: 'id-2',
    organizerId: testUsers.alice.props.id,
    title: 'My second webinaire',
    seats: 1,
    startDate: new Date('2025-01-10T10:00:00.000Z'),
    endDate: new Date('2025-01-11T10:00:00.000Z'),
  });

  const charlesParticipation = new Participation({
    userId: testUsers.charles.props.id,
    webinaireId: webinaireWithFewSeats.props.id,
  });

  let mailer: InMemoryMailer;
  let webinaireRepository: InMemoryWebinaireRepository;
  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let useCase: ReserveSeat;

  beforeEach(async () => {
    mailer = new InMemoryMailer();
    webinaireRepository = new InMemoryWebinaireRepository([
      webinaire,
      webinaireWithFewSeats,
    ]);

    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
      testUsers.charles,
    ]);

    participationRepository = new InMemoryParticipationRepository([
      charlesParticipation,
    ]);

    useCase = new ReserveSeat(
      participationRepository,
      webinaireRepository,
      userRepository,
      mailer,
    );
  });

  describe('Scenario: Happy Path', () => {
    const payload = {
      user: testUsers.bob,
      webinaireId: webinaire.props.id,
    };

    it('should reserve a seat', async () => {
      await useCase.execute(payload);

      expectParticipationToBeCreated(testUsers.bob.props.id);
    });

    it('should send the e-mail to the organizer', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[0]).toEqual({
        to: testUsers.alice.props.emailAddress,
        subject: 'New Participation',
        body: `A new User has reserved a seat for your webinaire ${webinaire.props.title}`,
      });
    });

    it('should send the e-mail to participants', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[1]).toEqual({
        to: testUsers.bob.props.emailAddress,
        subject: 'Your Participation to a webinaire',
        body: `You have reserved a seat for the webinaire ${webinaire.props.title}`,
      });
    });
  });

  describe('Scenario: The webinaire does not exist', () => {
    const payload = {
      user: testUsers.bob,
      webinaireId: 'not-exist',
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );

      expectParticipationNotToBeCreated(testUsers.bob.props.id);
    });
  });

  describe('Scenario: The webinaire does not have enough seats', () => {
    const payload = {
      user: testUsers.bob,
      webinaireId: webinaireWithFewSeats.props.id,
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'No seats available',
      );

      expectParticipationNotToBeCreated(testUsers.charles.props.id);
    });
  });

  describe('Scenario: User already participate to a webinaire', () => {
    const payload = {
      user: testUsers.charles,
      webinaireId: webinaireWithFewSeats.props.id,
    };

    it('should reject', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'You already participate in this webinaire',
      );

      expectParticipationNotToBeCreated(testUsers.charles.props.id);
    });
  });
});
