import { Webinaire } from '../entities/webinaire.entity';
import { IWebinaireRepository } from '../ports/webinaire.interface';

export class InMemoryWebinaireRepository implements IWebinaireRepository {
  public database: Webinaire[] = [];

  async create(webinaire: Webinaire): Promise<void> {
    this.database.push(webinaire);
  }

  async findById(id: string): Promise<Webinaire | null> {
    const webinaire = this.database.find((w) => w.props.id === id);
    return webinaire ?? null;
  }
}
