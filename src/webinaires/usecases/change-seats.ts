import { User } from '../../users/entities/user.entity';
import { IExecutable } from '../../shared/executable';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';
import { WebinaireNotFoundException } from '../exceptions/not-found.exception';
import { ItNotAllowed } from '../exceptions/not-allowed.exception';
import { WebinaireSeatsReducingException } from '../exceptions/reduce-seats.exception';
import { MaximumSeatsReachedException } from '../exceptions/maximum-seats-reached.exception';

type Request = {
  user: User;
  webinaireId: string;
  seats: number;
};

type Response = void;

export class ChangeSeats implements IExecutable<Request, Response> {
  constructor(private readonly webinaireRepository: IWebinaireRepository) {}

  async execute({ user, webinaireId, seats }: Request) {
    const webinaire = await this.webinaireRepository.findById(webinaireId);

    if (!webinaire) throw new WebinaireNotFoundException();

    if (webinaire.props.seats > seats)
      throw new WebinaireSeatsReducingException();

    if (webinaire.isOrganizer(user.props.id) === false)
      throw new ItNotAllowed();

    webinaire.update({ seats });

    if (webinaire.maximumSeatReached())
      throw new MaximumSeatsReachedException();

    this.webinaireRepository.update(webinaire!);
  }
}
