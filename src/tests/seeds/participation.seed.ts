import { Participation } from '../../webinaires/entities/participation.entity';
import { ParticipationFixture } from '../fixtures/participation.fixture';

export const e2eParticipation = {
  bob: new ParticipationFixture(
    new Participation({
      userId: 'bob',
      webinaireId: 'id-1',
    }),
  ),

  charles: new ParticipationFixture(
    new Participation({
      userId: 'charles',
      webinaireId: 'id-1',
    }),
  ),
};
