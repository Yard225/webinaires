import { IIDGenerator } from '../../core/ports/id-generator.interface';
import { User } from '../../users/entities/user.entity';
import { Webinaire } from '../entities/webinaire.entity';
import { IWebinaireRepository } from '../ports/user-repository.interface';
import { IDateGenerator } from '../../core/ports/date-generator.interface';

type Request = {
  user: User;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

type Response = { id: string };

export class OrganizeWebinaire {
  constructor(
    private readonly repository: IWebinaireRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  async execute({
    user,
    title,
    seats,
    startDate,
    endDate,
  }: Request): Promise<Response> {
    const id = this.idGenerator.generate();

    const webinaire = new Webinaire({
      id,
      organizerId: user.props.id,
      title,
      seats,
      startDate,
      endDate,
    });

    if (webinaire.itTooclose(this.dateGenerator.now()))
      throw new Error('The webinaire must happens in at least 3 days');

    if (webinaire.maximumSeatsReached())
      throw new Error('The webinaire must have maximum of 1000 seats');

    if (webinaire.hasNoSeats())
      throw new Error('The webinaire must have at least 1 seat');

    this.repository.create(webinaire);

    return { id };
  }
}
