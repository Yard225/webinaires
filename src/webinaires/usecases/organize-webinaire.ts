import { IIDGenerator } from '../../core/ports/id-generator.interface';
import { IExecutable } from '../../shared/executable';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';
import { User } from '../../users/entities/user.entity';
import { Webinaire } from '../entities/webinaire.entity';
import { IDateGenerator } from '../../core/ports/date-generator';
import { HappenTooEarlyException } from '../exceptions/happen-too-early.exception';
import { MaximumSeatsReachedException } from '../exceptions/maximum-seats-reached.exception';
import { MinimumSeatsNotReachedException } from '../exceptions/minimum-seats-not-reached.exception';

type Request = {
  user: User;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

type Response = { id: string };

export class OrganizeWebinaire implements IExecutable<Request, Response> {
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
      title: title,
      seats: seats,
      startDate: startDate,
      endDate: endDate,
    });

    if (webinaire.itTooClose(this.dateGenerator.now()))
      throw new HappenTooEarlyException();

    if (webinaire.maximumSeatReached())
      throw new MaximumSeatsReachedException();

    if (webinaire.minimumSeatNotReached())
      throw new MinimumSeatsNotReachedException();

    this.repository.create(webinaire);

    return { id };
  }
}
