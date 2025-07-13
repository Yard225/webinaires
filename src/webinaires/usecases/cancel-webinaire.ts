import { User } from '../../users/entities/user.entity';
import { IExecutable } from '../../shared/executable';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';
import { WebinaireNotFoundException } from '../exceptions/not-found.exception';
import { ItNotAllowed } from '../exceptions/not-allowed.exception';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IUserRepository } from '../../users/ports/user-repository.interface';
import { IMailer } from '../../core/ports/mailer.interface';
import { Webinaire } from '../entities/webinaire.entity';

type Request = {
  user: User;
  webinaireId: string;
};

type Response = void;

export class CancelWebinaire implements IExecutable<Request, Response> {
  constructor(
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({ user, webinaireId }: Request): Promise<void> {
    const webinaire = await this.webinaireRepository.findById(webinaireId);

    if (!webinaire) throw new WebinaireNotFoundException();

    if (webinaire.isOrganizer(user.props.id) === false)
      throw new ItNotAllowed();

    await this.webinaireRepository.delete(webinaireId);

    await this.sendEmailToParticipants(webinaire);

    // await this.sendEmailToOrganizer(webinaire);
  }

  async sendEmailToParticipants(webinaire: Webinaire) {
    const participation = await this.participationRepository.findByWebinaireId(
      webinaire.props.id,
    );

    const user = (await Promise.all(
      participation
        .map((p) => this.userRepository.findById(p.props.userId))
        .filter((user) => user !== null),
    )) as User[];

    user.map((user) =>
      this.mailer.send({
        to: user.props.emailAddress, //?
        subject: `The webinaire ${webinaire.props.title} have cancelled`,
        body: 'The webinaire have cancelled',
      }),
    );
  }

  //   async sendEmailToOrganizer(webinaire: Webinaire) {
  //     const user = await this.userRepository.findById(
  //       webinaire.props.organizerId,
  //     );

  //     this.mailer.send({
  //       to: user!.props.emailAddress,
  //       subject: `You have successfully cancel the webinaire : ${webinaire.props.title}`,
  //       body: 'The webinaire cancelled successfully',
  //     });
  //   }
}
