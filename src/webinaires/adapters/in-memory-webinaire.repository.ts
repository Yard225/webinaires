import { Webinaire } from '../entities/webinaire.entity';
import { IWebinaireRepository } from '../ports/user-repository.interface';

export class InMemoryWebinaireRepository implements IWebinaireRepository {
  constructor(public database: Webinaire[] = []) {}

  async create(webinaire: Webinaire): Promise<void> {
    this.database.push(webinaire);
  }

  async findById(id: string): Promise<Webinaire | null> {
    const webinaire = this.database.find((w) => w.props.id === id);
    return webinaire ?? null;
  }
}
