import { Webinaire } from 'src/usecases/organize-webinaire';

export interface IWebinaireRepository {
  create(webianire: Webinaire): Promise<void>;
}
