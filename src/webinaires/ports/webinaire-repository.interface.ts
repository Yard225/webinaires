import { IRepository } from '../../shared/repository';
import { Webinaire } from '../entities/webinaire.entity';

export const I_WEBINAIRE_REPOSITORY = 'I_WEBINAIRE_REPOSITORY';

export interface IWebinaireRepository extends IRepository<Webinaire> {
  update(webinaire: Webinaire): Promise<void>;
  delete(webinaireId: string): Promise<void>;
  findByIdSync(id: string): Webinaire | null;
}
