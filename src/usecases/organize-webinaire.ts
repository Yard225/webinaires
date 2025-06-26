import { User } from '../entities/user.entity';
import { Webinaire } from '../entities/webinaire.entity';
import { IDateGenerator } from '../ports/date-generator.interface';
import { IIDGenerator } from '../ports/id-generator.interface';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';

export class OrganizeWebinaire {
  constructor(
    private readonly repository: IWebinaireRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly actualDate: IDateGenerator,
  ) {
    // console.log(repository, idGenerator, actualDate);
    // console.log() nous sert à vérifier si les dépendances sont bien chargées.
  }

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
