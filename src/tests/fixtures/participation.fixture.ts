import {
  I_PARTICIPATION_REPOSITORY,
  IParticipationRepository,
} from '../../webinaires/ports/participation-repository.interface';
import { BaseFixture } from '../../shared/fixture';
import { Participation } from '../../webinaires/entities/participation.entity';
import { TestApp } from '../utils/test-app';
import { IFixture } from './fixture.interface';

export class ParticipationFixture
  extends BaseFixture<Participation>
  implements IFixture
{
  async load(app: TestApp): Promise<void> {
    const participationRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );
    await participationRepository.create(this.entity);
  }
}
