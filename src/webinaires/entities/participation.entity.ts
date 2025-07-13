import { BaseEntity } from '../../shared/entity';

type Props = {
  userId: string;
  webinaireId: string;
};

export class Participation extends BaseEntity<Props> {}
