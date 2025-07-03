import { IIDGenerator } from '../../core/ports/id-generator.interface';
import { Webinaire } from '../entities/webinaire.entity';
import { IWebinaireRepository } from '../ports/webinaire.interface';
import { IDateGenerator } from '../../core/ports/date-generator.interface';
import { User } from '../../users/entities/user.entity';

export class OrganizeWebinaire {
  constructor(
    private readonly repository: IWebinaireRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  async execute(data: {
    user: User;
    title: string;
    seats: number;
    startDate: Date;
    endDate: Date;
  }) {
    const id = this.idGenerator.generate();

    const webinaire = new Webinaire({
      id,
      organizerId: data.user.props.id,
      title: data.title,
      seats: data.seats,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    if (webinaire.itTooClose(this.dateGenerator.now())) {
      throw new Error('The webinaire must happens in at least 3 days');
    }

    if (webinaire.maximumSeatsReached()) {
      throw new Error('The webinaire must have maximum of 1000 seats');
    }

    if (webinaire.hasNoSeats()) {
      throw new Error('The webinaire must have at least 1 seat');
    }

    this.repository.create(webinaire);

    return { id };
  }
}
