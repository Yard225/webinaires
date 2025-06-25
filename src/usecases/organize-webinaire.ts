import { User } from 'src/entities/user.entity';
import { Webinaire } from 'src/entities/webinaire.entity';
import { IDateGenerator } from 'src/ports/date-generator.interface';
import { IIDGenerator } from 'src/ports/id-generator.interface';
import { IWebinaireRepository } from 'src/ports/webinaire-repository.interface';

export class OrganizeWebinaire {
  constructor(
    private readonly repository: IWebinaireRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly actualDate: IDateGenerator,
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

    if (webinaire.isTooclose(this.actualDate.now())) {
      throw new Error('The webinaire must happens in at least 3 days');
    }

    if (webinaire.hasTooManySeats()) {
      throw new Error('The webinaire must have maximum of 1000 seats');
    }

    if (webinaire.hasNoSeats()) {
      throw new Error('The webinaire must have at least 1 seat');
    }

    this.repository.create(webinaire);

    return { id };
  }
}
