import { User } from '../../users/entities/user.entity';
import { IWebinaireRepository } from '../ports/user-repository.interface';

type Request = {
  user: User;
  webinaireId: string;
  seats: number;
};

type Response = void;

export class ChangeSeats {
  constructor(private readonly webinaireRepository: IWebinaireRepository) {}

  async execute({ user, webinaireId, seats }: Request): Promise<Response> {
    const webinaire = await this.webinaireRepository.findById(webinaireId);

    if (!webinaire) throw new Error('Webinaire not found');

    webinaire!.update({ seats });
  }
}
