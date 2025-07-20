import { IUserRepository } from '../../users/ports/user-repository.interface';
import { IMailer } from '../../core/ports/mailer.interface';
import { IExecutable } from '../../shared/executable';
import { User } from '../../users/entities/user.entity';
import { Participation } from '../entities/participation.entity';

import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';
import { Webinaire } from '../entities/webinaire.entity';
import { WebinaireNotFoundException } from '../exceptions/not-found.exception';
import { NoMoreSeatsAvailable } from '../exceptions/no-more-seat.exception';
import { ExistingParticipationException } from '../exceptions/existing-participation.exception';

type Request = {
  user: User;
  webinaireId: string;
};

type Response = void;

export class ReserveSeat implements IExecutable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({ user, webinaireId }: Request): Promise<void> {
    const webinaire = await this.webinaireRepository.findById(webinaireId);

    if (!webinaire) throw new WebinaireNotFoundException();

    await this.assertUserIsNotAlreadyParticipating(user, webinaire);
    await this.assertHasEnoughSeats(webinaire);

    const participation = new Participation({
      userId: user.props.id,
      webinaireId,
    });

    await this.participationRepository.create(participation);

    await this.sendEmailToOrganizer(webinaire);
    await this.sendEmailToParticipant(user, webinaire);
  }

  private async assertUserIsNotAlreadyParticipating(
    user: User,
    webinaire: Webinaire,
  ) {
    const existingParticipation = await this.participationRepository.findOne(
      user.props.id,
      webinaire.props.id,
    ); //?

    if (existingParticipation) throw new ExistingParticipationException();
  }

  private async assertHasEnoughSeats(webinaire: Webinaire) {
    const participationCount =
      await this.participationRepository.findParticipationCount(
        webinaire.props.id,
      );

    if (participationCount >= webinaire.props.seats)
      throw new NoMoreSeatsAvailable();
  }

  private async sendEmailToOrganizer(webinaire: Webinaire) {
    const organizer = await this.userRepository.findById(
      webinaire.props.organizerId,
    );

    this.mailer.send({
      to: organizer!.props.emailAddress,
      subject: 'New Participation',
      body: `A new User has reserved a seat for your webinaire ${webinaire!.props.title}`,
    });
  }

  private async sendEmailToParticipant(user: User, webinaire: Webinaire) {
    this.mailer.send({
      to: user.props.emailAddress,
      subject: 'Your Participation to a webinaire',
      body: `You have reserved a seat for the webinaire ${webinaire!.props.title}`,
    });
  }
}
