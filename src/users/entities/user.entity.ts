import { BaseEntity } from '../../shared/entity';

type Props = {
  id: string;
  emailAddress: string;
  password: string;
};

export class User extends BaseEntity<Props> {}
