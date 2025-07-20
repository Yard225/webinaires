import { DomainException } from '../../shared/exception';

export class NoMoreSeatsAvailable extends DomainException {
  constructor() {
    super('No seats available');
  }
}
