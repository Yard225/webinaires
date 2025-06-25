import { Webinaire } from 'src/entities/webinaire.entity';
import { IIDGenerator } from 'src/ports/id-generator.interface';
import { IWebinaireRepository } from 'src/ports/webinaire-repository.interface';

export class OrganizeWebinaire {
  constructor(
    private readonly repository: IWebinaireRepository,
    private readonly idGenerator: IIDGenerator,
  ) {}

  async execute(data: {
    title: string;
    seats: number;
    startDate: Date;
    endDate: Date;
  }) {
    const id = this.idGenerator.generate();

    const webinaire = new Webinaire({ id, ...data });

    this.repository.create(webinaire);

    return { id };
  }
}
