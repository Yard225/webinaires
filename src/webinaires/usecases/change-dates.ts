import { User } from '../../users/entities/user.entity';
import { IExecutable } from '../../shared/executable';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';
import { WebinaireNotFoundException } from '../exceptions/not-found.exception';
import { ItNotAllowed } from '../exceptions/not-allowed.exception';
import { HappenTooEarlyException } from '../exceptions/happen-too-early.exception';
import { IDateGenerator } from '../../core/ports/date-generator';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IMailer } from '../../core/ports/mailer.interface';
import { IUserRepository } from '../../users/ports/user-repository.interface';
import { Webinaire } from '../entities/webinaire.entity';

type Request = {
  user: User;
  webinaireId: string;
  startDate: Date;
  endDate: Date;
};

type Response = void;

export class ChangeDates implements IExecutable<Request, Response> {
  constructor(
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly dateGenerator: IDateGenerator,
    private readonly mailer: IMailer,
  ) {}

  async execute({ user, webinaireId, startDate, endDate }: Request) {
    const webinaire = await this.webinaireRepository.findById(webinaireId);

    if (!webinaire) throw new WebinaireNotFoundException();

    if (webinaire.isOrganizer(user.props.id) === false)
      throw new ItNotAllowed();

    webinaire!.update({ startDate, endDate });

    if (webinaire.itTooClose(this.dateGenerator.now()))
      throw new HappenTooEarlyException();

    this.webinaireRepository.update(webinaire!);

    await this.sendEmailToParticipants(webinaire);
  }

  async sendEmailToParticipants(webinaire: Webinaire) {
    const participants = await this.participationRepository.findByWebinaireId(
      webinaire.props.id,
    );

    const users = (await Promise.all(
      participants
        .map((participation) =>
          this.userRepository.findById(participation.props.userId),
        )
        .filter((user) => user !== null),
    )) as User[];

    await Promise.all(
      users.map((user) =>
        this.mailer.send({
          to: user.props.emailAddress,
          subject: `The dates of webinaire ${webinaire.props.title} have changed`,
          body: 'The webinaire dates have changed',
        }),
      ),
    );
  }
}
