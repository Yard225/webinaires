import { DomainException } from '../../shared/exception';

export class MinimumSeatsNotReachedException extends DomainException {
  constructor() {
    super('The webinaire must have at least 1 seat');
  }
}
