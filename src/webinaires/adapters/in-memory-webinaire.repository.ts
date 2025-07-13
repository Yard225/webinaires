import { Webinaire } from '../entities/webinaire.entity';
import { IWebinaireRepository } from '../ports/webinaire-repository.interface';

export class InMemoryWebinaireRepository implements IWebinaireRepository {
  constructor(public readonly database: Webinaire[] = []) {}

  async create(entity: Webinaire): Promise<void> {
    this.database.push(entity);
  }

  findByIdSync(id: string): Webinaire | null {
    const webinaire = this.database.find((w) => w.props.id === id);
    return webinaire ?? null;
  }

  async findById(id: string): Promise<Webinaire | null> {
    const webinaire = this.findByIdSync(id);
    return webinaire ? new Webinaire({ ...webinaire.props }) : null;
  }

  async findAll(): Promise<Webinaire[]> {
    return this.database;
  }

  async update(webinaire: Webinaire): Promise<void> {
    const index = this.database.findIndex(
      (w) => w.props.id === webinaire.props.id,
    );

    this.database[index] = webinaire;
    webinaire.commit();
  }

  async delete(webinaireId: string): Promise<void> {
    const index = this.database.findIndex((w) => w.props.id === webinaireId);

    this.database.splice(index, 1);
  }
}
