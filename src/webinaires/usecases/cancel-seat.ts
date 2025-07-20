import { User } from '../../users/entities/user.entity';
import { IExecutable } from '../../shared/executable';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';
import { IUserRepository } from '../../users/ports/user-repository.interface';
import { IMailer } from '../../core/ports/mailer.interface';
import { Webinaire } from '../entities/webinaire.entity';
import { WebinaireNotFoundException } from '../exceptions/not-found.exception';
import { ParticipationNotFoundException } from '../exceptions/participation-not-found.exception';

type Request = {
  user: User;
  webinaireId: string;
};

type Response = void;

export class CancelSeat implements IExecutable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({ user, webinaireId }: Request): Promise<Response> {
    const webinaire = await this.webinaireRepository.findById(webinaireId);

    if (!webinaire) throw new WebinaireNotFoundException();

    const participation = await this.participationRepository.findOne(
      user.props.id,
      webinaireId,
    );

    if (!participation) throw new ParticipationNotFoundException();

    await this.participationRepository.delete(participation);

    await this.sendEmailToOrganiser(webinaire);
    await this.sendEmailToParticipant(user, webinaire);
  }

  private async sendEmailToOrganiser(webinaire: Webinaire): Promise<void> {
    const organizer = await this.userRepository.findById(
      webinaire.props.organizerId,
    );

    this.mailer.send({
      to: organizer!.props.emailAddress,
      subject: 'A participant has cancelled their seat',
      body: `A participant has cancelled their seat for the webinaire ${webinaire.props.title}`,
    });
  }

  private async sendEmailToParticipant(
    user: User,
    webinaire: Webinaire,
  ): Promise<void> {
    this.mailer.send({
      to: user.props.emailAddress,
      subject: 'You participation cancellation',
      body: `You have cancelled your particiaption to the webinaire ${webinaire.props.title}`,
    });
  }
}
