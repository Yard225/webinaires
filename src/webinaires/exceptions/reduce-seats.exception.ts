import { DomainException } from '../../shared/exception';

export class WebinaireSeatsReducingException extends DomainException {
  constructor() {
    super('You cannot reduce the number of seats');
  }
}
