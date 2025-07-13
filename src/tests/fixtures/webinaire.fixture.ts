import {
  I_WEBINAIRE_REPOSITORY,
  IWebinaireRepository,
} from '../../webinaires/ports/webinaire-repository.interface';
import { BaseFixture } from '../../shared/fixture';
import { Webinaire } from '../../webinaires/entities/webinaire.entity';
import { TestApp } from '../utils/test-app';
import { IFixture } from './fixture.interface';

export class WebinaireFixture
  extends BaseFixture<Webinaire>
  implements IFixture
{
  async load(app: TestApp): Promise<void> {
    const webinaireRepository = app.get<IWebinaireRepository>(
      I_WEBINAIRE_REPOSITORY,
    );
    webinaireRepository.create(this.entity);
  }
}
