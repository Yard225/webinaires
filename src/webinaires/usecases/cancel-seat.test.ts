import { testUsers } from '../../users/test/unit-test.user';
import { InMemoryParticipationRepository } from '../adapters/in-memory-participation.repository';
import { Participation } from '../entities/participation.entity';
import { CancelSeat } from './cancel-seat';
import { Webinaire } from '../entities/webinaire.entity';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { InMemoryUserRepository } from '../../users/adapters/in-memory-user.repository';
import { InMemoryMailer } from '../../core/adapters/in-memory-mailer';

describe('Feature: Cancel reservation', () => {
  function expectParticipationNotToBeDeleted() {
    const storedParticipation = participationRepository.findOneSync(
      testUsers.bob.props.id,
      webinaire.props.id,
    );

    expect(storedParticipation).not.toBeNull();
  }

  function expectParticipationToBeDeleted() {
    const storedParticipation = participationRepository.findOneSync(
      testUsers.bob.props.id,
      webinaire.props.id,
    );

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

  const bobParticipation = new Participation({
    userId: testUsers.bob.props.id,
    webinaireId: webinaire.props.id,
  });

  let useCase: CancelSeat;
  let participationRepository: InMemoryParticipationRepository;
  let webinaireRepository: InMemoryWebinaireRepository;
  let userRepository: InMemoryUserRepository;
  let mailer: InMemoryMailer;

  beforeEach(async () => {
    mailer = new InMemoryMailer();

    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
    ]);

    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);

    participationRepository = new InMemoryParticipationRepository([
      bobParticipation,
    ]);

    useCase = new CancelSeat(
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

    it('should cancel the seat', async () => {
      await useCase.execute(payload);

      expectParticipationToBeDeleted();
    });

    it('should send the email to the organizer', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[0]).toEqual({
        to: testUsers.alice.props.emailAddress,
        subject: 'A participant has cancelled their seat',
        body: `A participant has cancelled their seat for the webinaire ${webinaire.props.title}`,
      });
    });

    it('should send the email to the participant', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[1]).toEqual({
        to: testUsers.bob.props.emailAddress,
        subject: 'You participation cancellation',
        body: `You have cancelled your particiaption to the webinaire ${webinaire.props.title}`,
      });
    });
  });

  describe('Scenario: webinaire does not exist', () => {
    const payload = {
      user: testUsers.bob,
      webinaireId: 'not-exist',
    };

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );

      expectParticipationNotToBeDeleted();
    });
  });

  describe('Scenario: user did not reserve a seat', () => {
    const payload = {
      user: testUsers.charles,
      webinaireId: webinaire.props.id,
    };

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'No participation not found',
      );

      expectParticipationNotToBeDeleted();
    });
  });
});
