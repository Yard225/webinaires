import { testUsers } from '../../users/test/unit-test.user';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { Webinaire } from '../entities/webinaire.entity';
import { InMemoryParticipationRepository } from '../adapters/in-memory-participation.repository';
import { InMemoryMailer } from '../../core/adapters/in-memory-mailer';
import { Participation } from '../entities/participation.entity';
import { InMemoryUserRepository } from '../../users/adapters/in-memory-user.repository';
import { CancelWebinaire } from './cancel-webinaire';

describe('Feature: Organize webinaire', () => {
  function expectWebinaireNotToBeDeleted() {
    const storedWebinaire = webinaireRepository.findByIdSync(
      webinaire.props.id,
    );

    expect(storedWebinaire).not.toBeNull();
  }

  function expectWebinaireToBeDeleted() {
    const storedWebinaire = webinaireRepository.findByIdSync(
      webinaire.props.id,
    );

    expect(storedWebinaire).toBeNull();
  }

  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let mailer: InMemoryMailer;
  let webinaireRepository: InMemoryWebinaireRepository;
  let useCase: CancelWebinaire;

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

  beforeEach(async () => {
    mailer = new InMemoryMailer();
    userRepository = new InMemoryUserRepository([
      testUsers.bob,
      testUsers.alice,
    ]);
    participationRepository = new InMemoryParticipationRepository([
      bobParticipation,
    ]);
    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);
    useCase = new CancelWebinaire(
      webinaireRepository,
      participationRepository,
      userRepository,
      mailer,
    );
  });

  describe('Scenario: Happy Path', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: webinaire.props.id,
    };

    it('should delete the webinaire', async () => {
      await useCase.execute(payload);

      expectWebinaireToBeDeleted();
    });

    it('should send an email to the participants', async () => {
      await useCase.execute(payload);
      expect(mailer.sentEmails).toEqual([
        {
          to: testUsers.bob.props.emailAddress,
          subject: `The webinaire ${webinaire.props.title} have cancelled`,
          body: 'The webinaire have cancelled',
        },
        // {
        //   to: testUsers.alice.props.emailAddress,
        //   subject: `You have successfully cancel the webinaire : ${webinaire.props.title}`,
        //   body: 'The webinaire cancelled successfully',
        // },
      ]);
    });
  });

  describe('Scenario: The webinaire is not found', () => {
    const payload = {
      user: testUsers.alice,
      webinaireId: 'not-exist',
    };

    it('should reject because the webinaire is not found', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );

      expectWebinaireNotToBeDeleted();
    });
  });

  describe('Scenario: cancelling the webinaire of someone else', () => {
    const payload = {
      user: testUsers.bob,
      webinaireId: webinaire.props.id,
    };

    it('should not allowed to delete this webinaire', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'You are not allowed to update this webinaire',
      );

      expectWebinaireNotToBeDeleted();
    });
  });
});
