import { DomainException } from '../../shared/exception';

export class ExistingParticipationException extends DomainException {
  constructor() {
    super('You already participate in this webinaire');
  }
}
