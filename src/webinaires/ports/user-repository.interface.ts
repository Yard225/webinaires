import { Webinaire } from '../entities/webinaire.entity';

export const I_WEBINAIRE_REPOSITORY = 'I_WEBINAIRE_REPOSITORY';

export interface IWebinaireRepository {
  create(webinaire: Webinaire): Promise<void>;
  findById(id: string): Promise<Webinaire | null>;
}
