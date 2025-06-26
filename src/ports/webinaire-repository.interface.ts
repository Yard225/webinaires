import { Webinaire } from '../entities/webinaire.entity';

export interface IWebinaireRepository {
  create(webianire: Webinaire): Promise<void>;
}
