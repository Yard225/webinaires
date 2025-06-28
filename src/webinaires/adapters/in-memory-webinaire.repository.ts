import { Webinaire } from '../entities/webinaire.entity';
import { IWebinaireRepository } from '../ports/webinaire.interface';

export class InMemoryWebinaireRepository implements IWebinaireRepository {
  public readonly database: Webinaire[] = [];

  async create(webinaire: Webinaire) {
    this.database.push(webinaire);
  }
}
